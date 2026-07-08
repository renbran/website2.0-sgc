# Shield honeycomb — handoff (uncommitted)

Branch: `staging/3d-storytelling`. **Not committed.** Rollback ref discussed: `1bda599`.

## What changed (4 files)
- `components/Shield/ShieldFrame.tsx` — `FRAME_POINTS` → shield polygon (broad crown, 2 shoulders, single bottom point). Values = design SHIELD (lattice units) × 0.581.
- `components/Shield/shieldMotion.ts` — `CLUSTER_SCALE` 0.88 → **0.54** (fits the 3-ring shield inside camera z=5.8 / fov=55, ~±3 units tall).
- `components/Shield/ShieldScene.tsx` — `NARRATIVE_HEXES` rebuilt from 9 mismatched entries → **6** in `TILE_LOCK_POS` order. (Old list had 9 vs `HEX_COUNT`=6, indexing past `TILE_LOCK_POS`.)
- `components/Shield/HexTile.tsx` — label `distanceFactor` 8 → 5 (proportional to smaller cells).

## Locked hourglass (TILE_LOCK_POS index → label)
0 UL=Scattered · 1 UR=At Risk · 2 LL=Unified · 3 LR=Automated · 4 crest=Connected · 5 point=Audit-Ready

## Verified (math, not live render)
Mirrored the real `FillerMesh` clip (center-in-poly + vertex test at r=0.92) with the new constants:
**29 cells = 22 dormant + 6 active + 1 logo**, all 6 active slots inside, top vertex 2.77 < 3.02 half-height. No orbital rings exist in code (only logo hex rim + finale-only `FinaleGlow`).

## TODO in terminal
1. `bun run build` — sole verification gate; NOT yet run here (sandbox had Windows-only swc/sharp, no bun).
2. `bun run dev`, scroll Shield section to assembled/finale state, screenshot at 1440px.
3. Confirm by eye: label fit inside cells (distanceFactor 5), and frame-tube (`CatmullRomCurve3`) may over-round the bottom point — drop tube smoothing or add control points if the tip looks blunt.
4. Mobile note (pre-existing, not introduced): `FillerMesh` is rendered without a `viewportWidth` prop so it defaults to 1440 → its internal `clusterScale` ignores the mobile `responsiveScale` the cluster group uses. Pass `viewportWidth` if you want mobile fill to track the cluster.

Proof images (geometry renders) are in the session outputs: `FINAL_honeycomb_1440.png`, `FINAL_resting_1440.png`.
