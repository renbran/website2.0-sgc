"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { GOLD } from "./complianceData";

interface StoryCalloutProps {
  position: [number, number, number];
  badge: string;
  title: string;
  body: string;
  side: "left" | "right" | "center";
  scrollProgressRef: RefObject<number>;
  opacityFn: (t: number) => number;
  reducedMotion: boolean;
}

export default function StoryCallout({
  position,
  badge,
  title,
  body,
  side,
  scrollProgressRef,
  opacityFn,
  reducedMotion,
}: StoryCalloutProps) {
  const wrapperRef = useRef<HTMLDivElement>(null!);

  useFrame(() => {
    if (!wrapperRef.current) return;
    const p = scrollProgressRef.current ?? 0;
    wrapperRef.current.style.opacity = String(reducedMotion ? 1 : opacityFn(p));
  });

  const isLeft = side === "left";
  const isRight = side === "right";

  return (
    <group position={position}>
      <Html
        position={[0, 0, 0]}
        center
        distanceFactor={14}
        style={{
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div
          ref={wrapperRef}
          style={{
            opacity: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: isLeft ? "flex-end" : isRight ? "flex-start" : "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "clamp(200px, 22vw, 300px)",
              border: `1px solid ${GOLD}55`,
              borderRadius: "3px",
              padding: "1.1rem 1.3rem 1.2rem",
              background: "rgba(8, 11, 17, 0.88)",
              backdropFilter: "blur(12px)",
              boxShadow: `0 0 30px ${GOLD}15, inset 0 1px 0 ${GOLD}20`,
            }}
          >
            {(["tl","tr","bl","br"] as const).map((c) => (
              <span
                key={c}
                style={{
                  position: "absolute",
                  width: 10,
                  height: 10,
                  top: c.startsWith("t") ? -1 : "auto",
                  bottom: c.startsWith("b") ? -1 : "auto",
                  left: c.endsWith("l") ? -1 : "auto",
                  right: c.endsWith("r") ? -1 : "auto",
                  borderTop: c.startsWith("t") ? `2px solid ${GOLD}` : "none",
                  borderBottom: c.startsWith("b") ? `2px solid ${GOLD}` : "none",
                  borderLeft: c.endsWith("l") ? `2px solid ${GOLD}` : "none",
                  borderRight: c.endsWith("r") ? `2px solid ${GOLD}` : "none",
                }}
              />
            ))}

            <p
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: GOLD,
                marginBottom: "0.5rem",
              }}
            >
              [{badge}]
            </p>

            <p
              style={{
                fontFamily: "var(--font-fraunces, Georgia, serif)",
                fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)",
                fontWeight: 600,
                color: "#F4F1EA",
                lineHeight: 1.3,
                marginBottom: "0.5rem",
              }}
            >
              {title}
            </p>

            <p
              style={{
                fontFamily: "var(--font-inter, sans-serif)",
                fontSize: "0.78rem",
                color: "rgba(244, 241, 234, 0.6)",
                lineHeight: 1.7,
              }}
            >
              {body}
            </p>
          </div>

          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: GOLD,
              boxShadow: `0 0 6px ${GOLD}, 0 0 12px ${GOLD}50`,
              marginTop: "-3px",
            }}
          />
        </div>
      </Html>
    </group>
  );
}
