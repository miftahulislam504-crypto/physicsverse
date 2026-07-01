"use client";

// src/app/discovery/DiscoveryClient.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Beaker } from "lucide-react";
import { DISCOVERY_MISSIONS } from "@/lib/constants/discovery-data";
import { DiscoveryMissionCard } from "@/components/discovery/DiscoveryMissionCard";
import { TabBar } from "@/components/ui";

const TABS = [
  { id: "all",        label: "All Missions", icon: <Beaker size={13} /> },
  { id: "pattern",    label: "Pattern Finding", icon: <span>🔍</span> },
  { id: "hypothesis", label: "Hypothesis Testing", icon: <FlaskConical size={13} /> },
] as const;
type TabId = typeof TABS[number]["id"];

export function DiscoveryClient() {
  const [tab, setTab] = useState<TabId>("all");

  const missions = tab === "all" ? DISCOVERY_MISSIONS : DISCOVERY_MISSIONS.filter((m) => m.type === tab);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>Phase 10</p>
          <h1 className="text-4xl font-display font-bold mt-1"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.03em" }}>
            Physics Discovery Center
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Don't just memorize laws — discover them yourself from real experimental data.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <TabBar tabs={TABS} active={tab} onChange={(id) => setTab(id as TabId)} />
        </div>

        <div className="space-y-6">
          {missions.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <DiscoveryMissionCard mission={m} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
