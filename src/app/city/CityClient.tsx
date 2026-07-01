"use client";

// src/app/city/CityClient.tsx
import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { CITY_BUILDINGS, type CityBuilding } from "@/lib/constants/city-data";
import { CityHUD } from "@/components/city/CityHUD";
import { BuildingModal } from "@/components/city/BuildingModal";
import { MobileJoystick } from "@/components/city/MobileJoystick";
import { useUser } from "@/lib/store";
import { useProgress } from "@/lib/hooks/useProgress";
import { xpToLevel, LEVEL_META } from "@/lib/utils";

// Dynamically import the Canvas scene (client-only, avoids SSR issues with Three.js)
const CityScene = dynamic(
  () => import("@/components/city/CityScene").then((m) => ({ default: m.CityScene })),
  { ssr: false, loading: () => <SceneLoader /> }
);

const LEVEL_ORDER = ["electron", "proton", "neutron", "atom", "molecule", "star"] as const;

function SceneLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#060d14" }}>
      <div className="text-center space-y-3">
        <Loader2 size={32} className="mx-auto animate-spin" style={{ color: "#0090f0" }} />
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Loading Science City...</p>
      </div>
    </div>
  );
}

const VISITED_KEY = "pv_city_visited";

function getVisited(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(VISITED_KEY) ?? "[]")); }
  catch { return new Set(); }
}
function saveVisited(ids: Set<string>) {
  localStorage.setItem(VISITED_KEY, JSON.stringify(Array.from(ids)));
}

export function CityClient() {
  const user = useUser();
  const { completedIds } = useProgress();

  // XP-based unlock level (index into LEVEL_ORDER)
  const totalXP = completedIds.length * 50;
  const currentLevelKey = xpToLevel(totalXP);
  const unlockedLevel = LEVEL_ORDER.indexOf(currentLevelKey);

  const [playerPos, setPlayerPos]           = useState(new THREE.Vector3(0, 0, 25));
  const [playerRotation, setPlayerRotation] = useState(Math.PI);
  const [nearBuilding, setNearBuilding]     = useState<CityBuilding | null>(null);
  const [modalBuilding, setModalBuilding]   = useState<CityBuilding | null>(null);
  const [interactTrigger, setInteractTrigger] = useState(0);
  const [visitedIds, setVisitedIds]         = useState<Set<string>>(new Set());
  const [showIntro, setShowIntro]           = useState(true);

  const joystickVectorRef = useRef({ x: 0, y: 0 });

  useEffect(() => { setVisitedIds(getVisited()); }, []);

  // Keyboard "E" listener
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.code === "KeyE") setInteractTrigger((t) => t + 1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleEnterBuilding = useCallback((building: CityBuilding) => {
    setModalBuilding(building);
    setVisitedIds((prev) => {
      const next = new Set(prev);
      next.add(building.id);
      saveVisited(next);
      return next;
    });
  }, []);

  const handleJoystickVector = useCallback((x: number, y: number) => {
    joystickVectorRef.current = { x, y };
  }, []);

  const isModalLocked = modalBuilding ? modalBuilding.unlockLevel > unlockedLevel : false;
  const requiredLevelLabel = modalBuilding
    ? LEVEL_META[LEVEL_ORDER[Math.min(modalBuilding.unlockLevel, LEVEL_ORDER.length - 1)]].label
    : "";

  return (
    <div className="fixed inset-0 z-[100]" style={{ background: "#060d14" }}>
      {/* 3D Scene */}
      <Suspense fallback={<SceneLoader />}>
        <CityScene
          unlockedLevel={unlockedLevel}
          onPositionUpdate={(pos, rotY) => { setPlayerPos(pos.clone()); setPlayerRotation(rotY); }}
          onNearBuildingChange={setNearBuilding}
          joystickVectorRef={joystickVectorRef}
          interactTrigger={interactTrigger}
          onEnterBuilding={handleEnterBuilding}
        />
      </Suspense>

      {/* HUD overlay */}
      <CityHUD
        playerPos={playerPos}
        playerRotation={playerRotation}
        nearBuilding={nearBuilding}
        unlockedLevel={unlockedLevel}
        visitedIds={visitedIds}
        onInteractTap={() => setInteractTrigger((t) => t + 1)}
      />

      {/* Mobile joystick */}
      <MobileJoystick onVectorChange={handleJoystickVector} />

      {/* Building entry modal */}
      <BuildingModal
        building={modalBuilding}
        isLocked={isModalLocked}
        requiredLevel={requiredLevelLabel}
        onClose={() => setModalBuilding(null)}
      />

      {/* Intro overlay */}
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(6,13,20,0.92)" }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="max-w-md text-center space-y-5"
          >
            <span className="text-5xl">🌆</span>
            <h1 className="text-3xl font-display font-bold" style={{ color: "#f0f6fc" }}>
              PhysicsVerse Science City
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              Walk through 10 buildings, each a gateway to a different part of PhysicsVerse.
              Use <strong>WASD</strong> or the joystick to move. Press <strong>E</strong> or tap the
              button near a building to enter.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "#f59e0b" }}>
              🔒 Some buildings unlock as you earn XP by completing chapters and problems.
            </div>
            <button
              onClick={() => setShowIntro(false)}
              className="px-8 py-3 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #0090f0, #7c4ef5)", boxShadow: "0 4px 20px rgba(0,144,240,0.4)" }}
            >
              Enter the City →
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
