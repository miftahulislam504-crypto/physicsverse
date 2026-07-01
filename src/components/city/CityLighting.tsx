"use client";

// src/components/city/CityLighting.tsx
import { Stars } from "@react-three/drei";

export function CityLighting() {
  return (
    <>
      {/* Ambient fill light */}
      <ambientLight intensity={0.35} color="#0090f0" />

      {/* Main directional "moon" light */}
      <directionalLight
        position={[30, 40, 20]}
        intensity={0.8}
        color="#a5c9ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-far={150}
      />

      {/* Rim light for atmosphere */}
      <hemisphereLight
        args={["#0090f0", "#060d14", 0.4]}
      />

      {/* Fog for depth */}
      <fog attach="fog" args={["#060d14", 30, 110]} />

      {/* Starfield */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
    </>
  );
}
