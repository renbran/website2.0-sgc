"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FRAME_POINTS } from "./ShieldFrame";
import {
  CLUSTER_SCALE,
  HEX_RADIUS,
  LATTICE_H,
  LATTICE_V2,
  OCCUPIED_CENTERS,
  responsiveScale,
} from "./shieldMotion";
import { GOLD } from "./complianceData";

function pointInPolygon(x: number, y: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersect =
      (yi > y) !== (yj > y) &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function scalePoly(poly: [number, number][], k: number): [number, number][] {
  return poly.map(([x, y]) => [x * k, y * k] as [number, number]);
}

export default function FillerMesh({
  scrollProgressRef,
  reducedMotion,
  isFinale = false,
  finaleAngleRef,
  viewportWidth = 1440,
}: {
  scrollProgressRef: React.RefObject<number>;
  reducedMotion: boolean;
  isFinale?: boolean;
  finaleAngleRef?: React.RefObject<number>;
  viewportWidth?: number;
}) {
  const fullHexMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const goldFillerMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const plateMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const fillRef = useRef(0);

  const clusterScale = CLUSTER_SCALE * responsiveScale(viewportWidth);
  const localFrame = useMemo(
    () => FRAME_POINTS.map(([x, y]) => [x / clusterScale, y / clusterScale] as [number, number]),
    [clusterScale],
  );

  // 0.96 inset: edge cell centres sit just inside the frame tube (radius 0.12w),
  // so the frame tube visually clips their protruding vertices.
  const hexTestPoly = useMemo(() => scalePoly(localFrame, 0.96), [localFrame]);
  const platePoly   = useMemo(() => scalePoly(localFrame, 0.99), [localFrame]);

  const r = HEX_RADIUS * 0.92;

  const fillerCells = useMemo(() => {
    const bbox = localFrame.reduce(
      (acc, [x, y]) => [Math.min(acc[0], x), Math.min(acc[1], y), Math.max(acc[2], x), Math.max(acc[3], y)],
      [Infinity, Infinity, -Infinity, -Infinity],
    );
    const [minX, minY, maxX, maxY] = bbox;

    const isOccupied = (cx: number, cy: number) =>
      OCCUPIED_CENTERS.some(([ox, oy]) => Math.hypot(cx - ox, cy - oy) < HEX_RADIUS * 0.5);

    const cells: [number, number][] = [];
    const colMin = Math.floor(minX / LATTICE_H) - 1;
    const colMax = Math.ceil(maxX / LATTICE_H) + 1;
    const rowMin = Math.floor(minY / LATTICE_V2) - 1;
    const rowMax = Math.ceil(maxY / LATTICE_V2) + 1;

    for (let col = colMin; col <= colMax; col++) {
      const cx = col * LATTICE_H;
      const yShift = (Math.abs(col) % 2 === 1) ? LATTICE_V2 / 2 : 0;
      for (let row = rowMin; row <= rowMax; row++) {
        const cy = row * LATTICE_V2 + yShift;
        if (isOccupied(cx, cy)) continue;
        // Include any cell whose centre is inside the shield polygon — edge cells
        // that partially cross the frame boundary are visually cropped by the frame tube.
        if (!pointInPolygon(cx, cy, hexTestPoly)) continue;
        cells.push([cx, cy]);
      }
    }
    return cells;
  }, [localFrame, hexTestPoly]);

  const fullFillerCells = useMemo(() => {
    const bbox = localFrame.reduce(
      (acc, [x, y]) => [Math.min(acc[0], x), Math.min(acc[1], y), Math.max(acc[2], x), Math.max(acc[3], y)],
      [Infinity, Infinity, -Infinity, -Infinity],
    );
    const [minX, minY, maxX, maxY] = bbox;
    const cells: [number, number][] = [];
    const colMin = Math.floor(minX / LATTICE_H) - 1;
    const colMax = Math.ceil(maxX / LATTICE_H) + 1;
    const rowMin = Math.floor(minY / LATTICE_V2) - 1;
    const rowMax = Math.ceil(maxY / LATTICE_V2) + 1;
    for (let col = colMin; col <= colMax; col++) {
      const cx = col * LATTICE_H;
      const yShift = (Math.abs(col) % 2 === 1) ? LATTICE_V2 / 2 : 0;
      for (let row = rowMin; row <= rowMax; row++) {
        const cy = row * LATTICE_V2 + yShift;
        if (!pointInPolygon(cx, cy, hexTestPoly)) continue;
        cells.push([cx, cy]);
      }
    }
    return cells;
  }, [localFrame, hexTestPoly]);

  /** Build merged ExtrudeGeometry for filler cells with two material groups:
   *  material-0 (front/back faces) and material-1 (extruded sides / gold rim). */
  const makeMergedHexGeometry = (cells: [number, number][]) =>
    useMemo(() => {
      if (cells.length === 0) return new THREE.BufferGeometry();

      const base = new THREE.ExtrudeGeometry(
        (() => {
          const s = new THREE.Shape();
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3;
            const x = r * Math.cos(a), y = r * Math.sin(a);
            i === 0 ? s.moveTo(x, y) : s.lineTo(x, y);
          }
          s.closePath();
          return s;
        })(),
        { depth: 0.18, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 2, steps: 1 },
      );
      base.center();

      // Accumulate vertices per material group across all cells
      const verts0: number[] = []; // materialIndex 0 — front + back faces
      const verts1: number[] = []; // materialIndex 1 — extruded sides (gold rim)
      const norms0: number[] = [];
      const norms1: number[] = [];

      for (const [cx, cy] of cells) {
        const g = base.clone().translate(cx, cy, 0);
        // ExtrudeGeometry is already non-indexed in current three.js — only
        // convert when an index actually exists, to avoid the deprecation warn.
        const ni = g.index ? g.toNonIndexed() : g;
        const pos = ni.attributes.position.array as Float32Array;
        const norm = ni.attributes.normal?.array as Float32Array;
        for (const group of ni.groups) {
          const start = group.start * 3;
          const count = group.count * 3;
          const tPos = group.materialIndex === 0 ? verts0 : verts1;
          const tNrm = group.materialIndex === 0 ? norms0 : norms1;
          for (let i = start; i < start + count; i++) {
            tPos.push(pos[i]);
            if (norm) tNrm.push(norm[i]);
          }
        }
        g.dispose();
        ni.dispose();
      }
      base.dispose();

      const totalVerts = (verts0.length + verts1.length) / 3;
      if (totalVerts === 0) return new THREE.BufferGeometry();

      const positions = new Float32Array(totalVerts * 3);
      const normals = new Float32Array(totalVerts * 3);
      positions.set(verts0, 0);
      if (verts1.length > 0) positions.set(verts1, verts0.length);
      normals.set(norms0, 0);
      if (norms1.length > 0) normals.set(norms1, norms0.length);

      const merged = new THREE.BufferGeometry();
      merged.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      merged.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
      // Two material groups: all front/back vertices (idx0) then side vertices (idx1)
      merged.groups = [
        { start: 0, count: verts0.length / 3, materialIndex: 0 },
        ...(verts1.length > 0 ? [{ start: verts0.length / 3, count: verts1.length / 3, materialIndex: 1 }] : []),
      ];
      return merged;
    }, [cells, r]);

  const fillerGeometry = makeMergedHexGeometry(fillerCells);
  const fullFillerGeometry = makeMergedHexGeometry(fullFillerCells);

  const plateGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    platePoly.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)));
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [platePoly]);

  useFrame((_, delta) => {
    if (!isFinale) {
      if (fullHexMatRef.current)     fullHexMatRef.current.opacity     = 0.65;
      if (goldFillerMatRef.current)  goldFillerMatRef.current.opacity  = 0.35;
      if (plateMatRef.current)       plateMatRef.current.opacity       = 0.18;
      fillRef.current = 0;
      return;
    }
    // Finale: ramp filler 0.65→1.0, gold rim 0.35→1.0, plate 0.18→0.90
    fillRef.current = Math.min(fillRef.current + delta * 8, 1);
    const fill = fillRef.current;
    if (fullHexMatRef.current)     fullHexMatRef.current.opacity     = 0.65 + fill * 0.35;
    if (goldFillerMatRef.current)  goldFillerMatRef.current.opacity  = 0.35 + fill * 0.65;
    if (plateMatRef.current)       plateMatRef.current.opacity       = 0.18 + fill * 0.72;
  });

  return (
    <group>
      <mesh geometry={plateGeometry} position={[0, 0, -0.08]}>
        <meshStandardMaterial
          ref={plateMatRef}
          color="#0A1A2E"
          emissive="#13314A"
          emissiveIntensity={0.04}
          metalness={0.2}
          roughness={0.5}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      <mesh geometry={fillerGeometry}>
        {/* material-0: inner faces (front + back) — dark emissive */}
        <meshStandardMaterial
          attach="material-0"
          color="#0A1A2E"
          emissive="#1E4A6E"
          emissiveIntensity={0.1}
          metalness={0.3}
          roughness={0.22}
          transparent
          opacity={0.82}
          depthWrite={false}
        />
        {/* material-1: extruded sides — gold rim */}
        <meshStandardMaterial
          attach="material-1"
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.28}
          transparent
          opacity={0.35}
        />
      </mesh>

      <mesh geometry={fullFillerGeometry}>
        {/* material-0: inner faces — animated 0.65→1.0 during finale */}
        <meshStandardMaterial
          ref={fullHexMatRef}
          attach="material-0"
          color="#0A1A2E"
          emissive="#1E4A6E"
          emissiveIntensity={0.1}
          metalness={0.3}
          roughness={0.22}
          transparent
          opacity={0.65}
          depthWrite={false}
        />
        {/* material-1: gold rim — animated 0.35→1.0 during finale */}
        <meshStandardMaterial
          ref={goldFillerMatRef}
          attach="material-1"
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.28}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}
