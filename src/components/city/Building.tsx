"use client";

// src/components/city/Building.tsx
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import type { CityBuilding } from "@/lib/constants/city-data";

interface BuildingProps {
  building:      CityBuilding;
  isNear:        boolean;
  isLocked:      boolean;
  onInteract:    () => void;
}

// ── Shape geometry selector ────────────────────────────────────────────────────
function BuildingShape({ shape, color, isNear, isLocked }: {
  shape: CityBuilding["shape"]; color: string; isNear: boolean; isLocked: boolean;
}) {
  const emissiveIntensity = isNear ? 0.5 : 0.2;
  const opacity = isLocked ? 0.35 : 1;
  const displayColor = isLocked ? "#4d6480" : color;

  const material = (
    <meshStandardMaterial
      color={displayColor}
      emissive={displayColor}
      emissiveIntensity={emissiveIntensity}
      transparent
      opacity={opacity}
      roughness={0.35}
      metalness={0.4}
    />
  );

  switch (shape) {
    case "tower":
      return (
        <group>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            {material}
          </mesh>
          <mesh position={[0, 1.05, 0]}>
            <coneGeometry args={[0.75, 0.4, 4]} />
            {material}
          </mesh>
        </group>
      );
    case "dome":
      return (
        <group>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.6, 0.6, 16]} />
            {material}
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <sphereGeometry args={[0.55, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            {material}
          </mesh>
        </group>
      );
    case "pyramid":
      return (
        <mesh position={[0, 0.5, 0]} castShadow>
          <coneGeometry args={[0.7, 1, 4]} />
          {material}
        </mesh>
      );
    case "cylinder":
      return (
        <group>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.5, 1, 20]} />
            {material}
          </mesh>
          <mesh position={[0, 1.05, 0]}>
            <sphereGeometry args={[0.5, 20, 20]} />
            {material}
          </mesh>
        </group>
      );
    case "cube":
    default:
      return (
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          {material}
        </mesh>
      );
  }
}

export function Building({ building, isNear, isLocked, onInteract }: BuildingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef(0);

  useFrame((_, delta) => {
    pulseRef.current += delta;
    if (groupRef.current && isNear) {
      groupRef.current.position.y = building.position[1] + Math.sin(pulseRef.current * 2) * 0.15;
    } else if (groupRef.current) {
      groupRef.current.position.y = building.position[1];
    }
  });

  return (
    <group
      ref={groupRef}
      position={building.position}
      rotation={[0, building.rotation, 0]}
      scale={building.scale}
    >
      <BuildingShape shape={building.shape} color={building.color} isNear={isNear} isLocked={isLocked} />

      {/* Ground glow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshStandardMaterial
          color={building.color}
          emissive={building.color}
          emissiveIntensity={isNear ? 0.4 : 0.15}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Floating label */}
      <Billboard position={[0, 1.6, 0]}>
        <Text
          fontSize={0.22}
          color={isLocked ? "#4d6480" : "#f0f6fc"}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.015}
          outlineColor="#060d14"
        >
          {building.icon} {building.name}
        </Text>
        {isLocked && (
          <Text
            position={[0, -0.28, 0]}
            fontSize={0.14}
            color="#f59e0b"
            anchorX="center"
            anchorY="top"
          >
            🔒 Locked
          </Text>
        )}
      </Billboard>

      {/* Interact prompt */}
      {isNear && !isLocked && (
        <Billboard position={[0, 1.15, 0]}>
          <Text
            fontSize={0.16}
            color="#22c55e"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.012}
            outlineColor="#060d14"
          >
            Press E to enter
          </Text>
        </Billboard>
      )}
    </group>
  );
}
