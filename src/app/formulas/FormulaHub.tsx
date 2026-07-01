"use client";

// src/app/formulas/FormulaHub.tsx  — bonus hub page combining all Phase 3 tools
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FlaskConical, RefreshCw, Hash } from "lucide-react";
import { ALL_FORMULAS } from "@/lib/constants/formulas-data";
import { DOMAIN_META } from "@/lib/utils";
import { FormulaListCard } from "@/components/physics/FormulaListCard";
import { PhysicsConstants } from "@/components/physics/PhysicsConstants";
import { UnitConverter }    from "@/components/physics/UnitConverter";
import { TabBar, SectionHeader } from "@/components/ui";

const TABS = [
  { id: "formulas",   label: "Formulas",    icon: <span className="font-bold">∑</span> },
  { id: "constants",  label: "Constants",   icon: <Hash size={13} /> },
  { id: "converter",  label: "Unit Converter", icon: <RefreshCw size={13} /> },
] as const;

// Featured formulas — most important ones
const FEATURED_IDS = [
  "f-velocity", "f-newtons-second", "f-kinetic-energy",
  "f-ohms-law", "f-wave-speed", "f-photon-energy",
];
const FEATURED = ALL_FORMULAS.filter((f) => FEATURED_IDS.includes(f.id));

export function FormulaHub() {
  const [tab, setTab] = useState<typeof TABS[number]["id"]>("formulas");

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-primary)" }}>
            Phase 3 — Formula Explorer
          </p>
          <h1
            className="text-4xl font-display font-bold"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.03em" }}
          >
            Physics Formula Hub
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Interactive formulas · Physical constants · Unit converter
          </p>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: ALL_FORMULAS.length, label: "Formulas",  color: "#0090f0" },
            { value: 14,                  label: "Constants", color: "#7c4ef5" },
            { value: 8,                   label: "Unit Groups",color: "#34d399" },
          ].map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-2xl border text-center"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <p className="text-2xl font-bold font-display" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex justify-center">
          <TabBar
            tabs={TABS}
            active={tab}
            onChange={(id) => setTab(id as typeof tab)}
          />
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {tab === "formulas" && (
            <motion.div
              key="formulas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Featured */}
              <div className="space-y-4">
                <SectionHeader
                  eyebrow="Most Important"
                  title="Featured Formulas"
                  description="The essential equations every physics student must know."
                  action={
                    <Link
                      href="/formulas"
                      className="flex items-center gap-1 text-sm"
                      style={{ color: "var(--color-primary)" }}
                    >
                      View all <ArrowRight size={13} />
                    </Link>
                  }
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {FEATURED.map((f, i) => (
                    <FormulaListCard key={f.id} formula={f} index={i} />
                  ))}
                </div>
              </div>

              {/* By domain quick links */}
              <div className="space-y-3">
                <SectionHeader
                  eyebrow="Browse by Domain"
                  title="Domain Formula Sets"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(["mechanics","electricity","waves","optics","modern","thermodynamics"] as const).map((d) => {
                    const meta  = DOMAIN_META[d];
                    const count = ALL_FORMULAS.filter((f) => f.domain === d).length;
                    if (count === 0) return null;
                    return (
                      <Link
                        key={d}
                        href={`/formulas?domain=${d}`}
                        className="flex items-center justify-between p-3 rounded-xl border transition-all hover:scale-[1.02]"
                        style={{
                          background:  "var(--color-surface)",
                          borderColor: "var(--color-border)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span>{meta.icon}</span>
                          <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                            {meta.label}
                          </span>
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: meta.color + "15", color: meta.color }}
                        >
                          {count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {tab === "constants" && (
            <motion.div
              key="constants"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PhysicsConstants />
            </motion.div>
          )}

          {tab === "converter" && (
            <motion.div
              key="converter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <UnitConverter />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
