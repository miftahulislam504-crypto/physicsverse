"use client";

// src/components/city/PlayerController.tsx
import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyboardControls } from "@/lib/hooks/useKeyboardControls";
import { CITY_BOUNDS } from "@/lib/constants/city-data";

const WALK_SPEED  = 5;
const SPRINT_MULT = 1.8;
const CAMERA_HEIGHT = 3.2;
const CAMERA_DISTANCE = 6;

export interface PlayerControllerHandle {
  getPosition: () => THREE.Vector3;
  setJoystickVector: (x: number, y: number) => void;
}

interface PlayerControllerProps {
  onPositionUpdate?: (pos: THREE.Vector3, rotationY: number) => void;
}

export const PlayerController = forwardRef<PlayerControllerHandle, PlayerControllerProps>(
  ({ onPositionUpdate }, ref) => {
    const { camera } = useThree();
    const keys = useKeyboardControls();
    const joystickVec = useRef({ x: 0, y: 0 });

    const position = useRef(new THREE.Vector3(0, 0, 25));
    const rotationY = useRef(Math.PI); // facing toward the city (north = -z)
    const velocity  = useRef(new THREE.Vector3());

    useImperativeHandle(ref, () => ({
      getPosition: () => position.current,
      setJoystickVector: (x, y) => { joystickVec.current = { x, y }; },
    }));

    useFrame((_, delta) => {
      const k = keys.current;
      const jv = joystickVec.current;

      // Combine keyboard + joystick input into a movement vector
      let moveX = 0; let moveZ = 0;
      if (k.forward)  moveZ -= 1;
      if (k.backward) moveZ += 1;
      if (k.left)     moveX -= 1;
      if (k.right)    moveX += 1;

      // Joystick overrides/adds (mobile)
      moveX += jv.x;
      moveZ -= jv.y;

      const inputLen = Math.sqrt(moveX * moveX + moveZ * moveZ);
      if (inputLen > 0.01) {
        moveX /= Math.max(inputLen, 1);
        moveZ /= Math.max(inputLen, 1);

        // Rotate movement vector to face movement direction
        const targetAngle = Math.atan2(moveX, moveZ);
        rotationY.current = THREE.MathUtils.lerp(
          rotationY.current,
          targetAngle,
          Math.min(1, delta * 10)
        );

        const speed = WALK_SPEED * (k.sprint ? SPRINT_MULT : 1);
        velocity.current.set(moveX, 0, moveZ).normalize().multiplyScalar(speed * delta);

        position.current.add(velocity.current);

        // Clamp to city bounds
        position.current.x = THREE.MathUtils.clamp(position.current.x, -CITY_BOUNDS + 2, CITY_BOUNDS - 2);
        position.current.z = THREE.MathUtils.clamp(position.current.z, -CITY_BOUNDS + 2, CITY_BOUNDS - 2);
      }

      // Third-person camera follow
      const camOffsetX = Math.sin(rotationY.current) * CAMERA_DISTANCE;
      const camOffsetZ = Math.cos(rotationY.current) * CAMERA_DISTANCE;

      const targetCamPos = new THREE.Vector3(
        position.current.x + camOffsetX,
        CAMERA_HEIGHT,
        position.current.z + camOffsetZ
      );

      camera.position.lerp(targetCamPos, Math.min(1, delta * 5));
      camera.lookAt(position.current.x, 1.2, position.current.z);

      onPositionUpdate?.(position.current, rotationY.current);
    });

    return (
      <group position={position.current}>
        {/* Simple capsule avatar (visible from third-person) */}
        <mesh position={[0, 0.6, 0]} rotation={[0, rotationY.current, 0]} castShadow>
          <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
          <meshStandardMaterial color="#7c4ef5" emissive="#7c4ef5" emissiveIntensity={0.3} />
        </mesh>
        {/* Direction indicator */}
        <mesh position={[
          Math.sin(rotationY.current) * 0.35, 0.6, Math.cos(rotationY.current) * 0.35,
        ]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#22aaff" emissive="#22aaff" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, 1.2, 0]} intensity={0.3} distance={4} color="#7c4ef5" />
      </group>
    );
  }
);

PlayerController.displayName = "PlayerController";
