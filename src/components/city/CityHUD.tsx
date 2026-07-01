"use client";

// src/components/city/CityHUD.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, MapPin, Trophy } from "lucide-react";
import Link from "next/link";
import * as THREE from "three";
import { Minimap } from "./Minimap";
import { CITY_BUILDINGS, type CityBuilding } from "@/lib/constants/city-data";

interface CityHUDProps {
  playerPos:      THREE.Vector3;
  playerRotation: number;
  nearBuilding:   CityBuilding | null;
  unlockedLevel:  number;
  visitedIds:     Set<string>;
  onInteractTap:  () => void;
}

export function CityHUD({
  playerPos, playerRotation, nearBuilding, unlockedLevel, visitedIds, onInteractTap,
}: CityHUDProps) {
  const visitedCount = visitedIds.size;
  const totalCount   = CITY_BUILDINGS.length;

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 pointer-events-none">
        <Link href="/"
          className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium backdrop-blur-md"
          style={{ background: "rgba(6,13,20,0.7)", border: "1px solid rgba(0,144,240,0.25)", color: "#f0f6fc" }}>
          ← Exit City
        </Link>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs backdrop-blur-md"
          style={{ background: "rgba(6,13,20,0.7)", border: "1px solid rgba(245,158,11,0.25)", color: "#f59e0b" }}>
          <Trophy size={13} /> {visitedCount}/{totalCount} Visited
        </div>
      </div>

      {/* Minimap (top right) */}
      <div className="fixed top-16 right-4 z-30 pointer-events-none">
        <Minimap playerPos={playerPos} playerRotation={playerRotation} unlockedLevel={unlockedLevel} />
      </div>

      {/* Controls hint (bottom, desktop only) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 hidden lg:flex items-center gap-4 px-4 py-2 rounded-xl backdrop-blur-md pointer-events-none"
        style={{ background: "rgba(6,13,20,0.7)", border: "1px solid rgba(0,144,240,0.2)" }}>
        <span className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
          <Keyboard size={12} /> WASD to move
        </span>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Shift to sprint</span>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>E to interact</span>
      </div>

      {/* Interact button (mobile, bottom right) */}
      <AnimatePresence>
        {nearBuilding && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            onClick={onInteractTap}
            className="fixed bottom-10 right-8 z-40 lg:hidden w-16 h-16 rounded-full flex flex-col items-center justify-center gap-0.5 font-bold text-xs"
            style={{
              background: `linear-gradient(135deg, ${nearBuilding.color}, ${nearBuilding.color}cc)`,
              boxShadow: `0 4px 20px ${nearBuilding.color}60`,
              color: "#fff",
            }}
          >
            <MapPin size={16} />
            Enter
          </motion.button>
        )}
      </AnimatePresence>

      {/* Near-building name tag (bottom center, mobile) */}
      <AnimatePresence>
        {nearBuilding && (
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 lg:hidden px-4 py-2 rounded-xl text-xs font-medium backdrop-blur-md"
            style={{ background: "rgba(6,13,20,0.8)", border: `1px solid ${nearBuilding.color}40`, color: nearBuilding.color }}
          >
            {nearBuilding.icon} {nearBuilding.name}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
