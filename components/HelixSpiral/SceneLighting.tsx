"use client";

import { useExperienceStore } from "@/hooks/useExperienceStoreImpl";

export default function SceneLighting() {
  const [{ activeDiamondId }] = useExperienceStore();

  return (
    <>
      <ambientLight color="#1A1510" intensity={1.8} />
      <directionalLight color="#F4ECD8" intensity={0.45} position={[0, 10, 5]} />
      {activeDiamondId && (
        <spotLight
          color="#fffae5"
          intensity={2}
          angle={0.3}
          penumbra={0.5}
          position={[0, 0, 5] as [number, number, number]}
          distance={10}
        />
      )}
      <pointLight color="#EFDBA0" intensity={1.2} position={[-7, 0, 2]} distance={16} />
      <pointLight color="#B57A44" intensity={0.6} position={[7, 0, 2]} distance={16} />
    </>
  );
}
