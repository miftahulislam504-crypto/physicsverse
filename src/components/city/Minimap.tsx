"use client";

// src/components/city/Minimap.tsx
import { useRef, useEffect } from "react";
import { CITY_BUILDINGS, CITY_BOUNDS } from "@/lib/constants/city-data";
import * as THREE from "three";

interface MinimapProps {
  playerPos: THREE.Vector3;
  playerRotation: number;
  unlockedLevel: number;
}

const SIZE = 140;

export function Minimap({ playerPos, playerRotation, unlockedLevel }: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Background
    ctx.fillStyle = "rgba(6,13,20,0.85)";
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Border ring
    ctx.strokeStyle = "rgba(0,144,240,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 3, 0, Math.PI * 2);
    ctx.clip();

    const scale = (SIZE * 0.42) / CITY_BOUNDS;
    const toMap = (wx: number, wz: number) => ({
      mx: SIZE / 2 + (wx - playerPos.x) * scale,
      my: SIZE / 2 + (wz - playerPos.z) * scale,
    });

    // Grid
    ctx.strokeStyle = "rgba(0,144,240,0.08)"; ctx.lineWidth = 1;
    for (let i = -CITY_BOUNDS; i <= CITY_BOUNDS; i += 20) {
      const { mx: x1, my: y1 } = toMap(i, -CITY_BOUNDS);
      const { mx: x2, my: y2 } = toMap(i, CITY_BOUNDS);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }

    // Buildings
    CITY_BUILDINGS.forEach((b) => {
      const { mx, my } = toMap(b.position[0], b.position[2]);
      if (mx < -10 || mx > SIZE + 10 || my < -10 || my > SIZE + 10) return;

      const locked = b.unlockLevel > unlockedLevel;
      ctx.fillStyle = locked ? "rgba(77,100,128,0.7)" : b.color;
      ctx.shadowColor = locked ? "transparent" : b.color;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(mx, my, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    ctx.restore();

    // Player marker (center, always) — direction cone
    ctx.save();
    ctx.translate(SIZE / 2, SIZE / 2);
    ctx.rotate(playerRotation);
    ctx.fillStyle = "#7c4ef5";
    ctx.shadowColor = "#7c4ef5"; ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(-5, 5);
    ctx.lineTo(5, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // North indicator
    ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("N", SIZE / 2, 12);

  }, [playerPos, playerRotation, unlockedLevel]);

  return (
    <canvas
      ref={canvasRef}
      width={SIZE} height={SIZE}
      className="rounded-full"
      style={{ width: SIZE, height: SIZE }}
    />
  );
}
