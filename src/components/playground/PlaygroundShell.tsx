"use client";

// src/components/playground/PlaygroundShell.tsx
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui";

function Loader() {
  return (
    <div className="space-y-3">
      <Skeleton height={300} rounded="rounded-2xl" />
      <Skeleton height={52} rounded="rounded-2xl" />
    </div>
  );
}

const load = (fn: () => Promise<any>, name: string) =>
  dynamic(() => fn().then((m) => ({ default: m[name] })), { ssr: false, loading: () => <Loader /> });

const SIMS: Record<string, React.ComponentType> = {
  "collision":        load(() => import("./CollisionSimulation"), "CollisionSimulation"),
  "rocket-launch":     load(() => import("./RocketLaunchSimulation"), "RocketLaunchSimulation"),
  "gravity-sandbox":   load(() => import("./GravitySandboxSimulation"), "GravitySandboxSimulation"),
};

export function PlaygroundShell({ slug }: { slug: string }) {
  const Sim = SIMS[slug];
  if (!Sim) return <p style={{ color: "var(--color-text-muted)" }}>Coming soon.</p>;
  return <Sim />;
}
