"use client";

// src/components/city/Ground.tsx
import { useMemo } from "react";
import * as THREE from "three";
import { CITY_BOUNDS, PLAZA_RADIUS } from "@/lib/constants/city-data";

export function Ground() {
  // Procedural grid texture for the ground (canvas-based, no external assets)
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Base colour
    ctx.fillStyle = "#0d1b2a";
    ctx.fillRect(0, 0, 512, 512);

    // Grid lines
    ctx.strokeStyle = "rgba(0,144,240,0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 512; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }

    // Subtle noise dots
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(0,144,240,${Math.random() * 0.05})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(CITY_BOUNDS / 4, CITY_BOUNDS / 4);
    return tex;
  }, []);

  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[CITY_BOUNDS * 2, CITY_BOUNDS * 2]} />
        <meshStandardMaterial map={texture} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Central plaza — glowing circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[PLAZA_RADIUS, 48]} />
        <meshStandardMaterial
          color="#0090f0"
          emissive="#0090f0"
          emissiveIntensity={0.15}
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Plaza ring outline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[PLAZA_RADIUS - 0.15, PLAZA_RADIUS, 64]} />
        <meshStandardMaterial
          color="#0090f0"
          emissive="#0090f0"
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Boundary fence (subtle glowing edge) */}
      <mesh position={[0, 1, -CITY_BOUNDS]}>
        <boxGeometry args={[CITY_BOUNDS * 2, 2, 0.2]} />
        <meshStandardMaterial color="#0090f0" transparent opacity={0.08} />
      </mesh>
      <mesh position={[0, 1, CITY_BOUNDS]}>
        <boxGeometry args={[CITY_BOUNDS * 2, 2, 0.2]} />
        <meshStandardMaterial color="#0090f0" transparent opacity={0.08} />
      </mesh>
      <mesh position={[-CITY_BOUNDS, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[CITY_BOUNDS * 2, 2, 0.2]} />
        <meshStandardMaterial color="#0090f0" transparent opacity={0.08} />
      </mesh>
      <mesh position={[CITY_BOUNDS, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[CITY_BOUNDS * 2, 2, 0.2]} />
        <meshStandardMaterial color="#0090f0" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}
