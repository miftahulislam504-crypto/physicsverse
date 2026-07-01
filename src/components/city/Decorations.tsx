"use client";

// src/components/city/Decorations.tsx
import { useMemo } from "react";
import { generateDecorations } from "@/lib/constants/city-data";

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 6]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <coneGeometry args={[0.5, 1, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.35, 0.7, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
    </group>
  );
}

function LampPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 1.5, 8]} />
        <meshStandardMaterial color="#334e68" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial
          color="#22aaff"
          emissive="#22aaff"
          emissiveIntensity={0.8}
          transparent opacity={0.9}
        />
      </mesh>
      <pointLight position={[0, 1.55, 0]} intensity={0.6} distance={5} color="#22aaff" />
    </group>
  );
}

export function Decorations() {
  const items = useMemo(() => generateDecorations(), []);
  return (
    <group>
      {items.map((item, i) =>
        item.type === "tree"
          ? <Tree key={i} position={item.position} />
          : <LampPost key={i} position={item.position} />
      )}
    </group>
  );
}
