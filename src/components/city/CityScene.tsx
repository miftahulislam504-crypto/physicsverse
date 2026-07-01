"use client";

// src/components/city/CityScene.tsx
import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CITY_BUILDINGS, type CityBuilding } from "@/lib/constants/city-data";
import { Ground } from "./Ground";
import { Building } from "./Building";
import { Decorations } from "./Decorations";
import { CityLighting } from "./CityLighting";
import { PlayerController, type PlayerControllerHandle } from "./PlayerController";

const INTERACT_DISTANCE = 5.5;

interface CitySceneProps {
  unlockedLevel: number;
  onPositionUpdate: (pos: THREE.Vector3, rotY: number) => void;
  onNearBuildingChange: (building: CityBuilding | null) => void;
  joystickVectorRef: React.RefObject<{ x: number; y: number }>;
  interactTrigger: number; // increments each time "E" or tap is pressed
  onEnterBuilding: (building: CityBuilding) => void;
}

function Scene({
  unlockedLevel, onPositionUpdate, onNearBuildingChange,
  joystickVectorRef, interactTrigger, onEnterBuilding,
}: CitySceneProps) {
  const playerRef = useRef<PlayerControllerHandle>(null);
  const [nearBuilding, setNearBuilding] = useState<CityBuilding | null>(null);
  const lastTriggerRef = useRef(interactTrigger);

  const handlePositionUpdate = useCallback((pos: THREE.Vector3, rotY: number) => {
    onPositionUpdate(pos, rotY);

    // Sync joystick vector every frame
    if (playerRef.current && joystickVectorRef.current) {
      playerRef.current.setJoystickVector(joystickVectorRef.current.x, joystickVectorRef.current.y);
    }

    // Find nearest building
    let closest: CityBuilding | null = null;
    let minDist = INTERACT_DISTANCE;
    for (const b of CITY_BUILDINGS) {
      const dx = b.position[0] - pos.x;
      const dz = b.position[2] - pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDist) { minDist = dist; closest = b; }
    }

    setNearBuilding((prev) => {
      if (prev?.id !== closest?.id) onNearBuildingChange(closest);
      return closest;
    });

    // Check interact trigger
    if (interactTrigger !== lastTriggerRef.current) {
      lastTriggerRef.current = interactTrigger;
      if (closest) onEnterBuilding(closest);
    }
  }, [onPositionUpdate, onNearBuildingChange, joystickVectorRef, interactTrigger, onEnterBuilding]);

  return (
    <>
      <CityLighting />
      <Ground />
      <Decorations />

      {CITY_BUILDINGS.map((building) => (
        <Building
          key={building.id}
          building={building}
          isNear={nearBuilding?.id === building.id}
          isLocked={building.unlockLevel > unlockedLevel}
          onInteract={() => onEnterBuilding(building)}
        />
      ))}

      <PlayerController ref={playerRef} onPositionUpdate={handlePositionUpdate} />
    </>
  );
}

export function CityScene(props: CitySceneProps) {
  return (
    <Canvas
      shadows
      camera={{ fov: 60, near: 0.1, far: 200, position: [0, 3.2, 31] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#060d14"]} />
      <Scene {...props} />
    </Canvas>
  );
}
