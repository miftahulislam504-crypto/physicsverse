"use client";

// src/app/lab/LabClient.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import {
  LAB_EXPERIMENTS, ZONE_META, getExperimentsByZone, getAllZones,
  type LabZone,
} from "@/lib/constants/lab-data";
import { DIFFICULTY_META } from "@/lib/utils";
import { SectionHeader } from "@/components/ui";

function ExperimentCard({
  exp, index,
}: {
  exp: (typeof LAB_EXPERIMENTS)[0];
  index: number;
}) {
  const zone = ZONE_META[exp.zone];
  const diff = DIFFICULTY_META[exp.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        href={`/lab/${exp.slug}`}
        className="group flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-200 block"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = zone.color + "50";
          el.style.boxShadow   = `0 4px 20px ${zone.color}14`;
          el.style.transform   = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--color-border)";
          el.style.boxShadow   = "none";
          el.style.transform   = "translateY(0)";
        }}
      >
        {/* Icon + badges */}
        <div className="flex items-start justify-between">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: zone.color + "15" }}
          >
            {exp.icon}
          </div>
          <div className="flex items-center gap-1.5">
            {exp.isNew && (
              <span
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: "rgba(232,121,249,0.15)", color: "#e879f9" }}
              >
                <Sparkles size={10} /> New
              </span>
            )}
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: diff.color + "15", color: diff.color }}
            >
              {diff.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="text-sm font-semibold font-display leading-snug"
            style={{ color: "var(--color-text-primary)" }}>
            {exp.title}
          </p>
          <p className="text-xs mt-1 leading-relaxed line-clamp-2"
            style={{ color: "var(--color-text-muted)" }}>
            {exp.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
            <Clock size={11} />
            {exp.duration} min
          </div>
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
            style={{ color: zone.color, opacity: 0.8 }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

export function LabClient() {
  const [activeZone, setActiveZone] = useState<LabZone | "all">("all");
  const zones  = getAllZones();

  const experiments = activeZone === "all"
    ? LAB_EXPERIMENTS
    : getExperimentsByZone(activeZone);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-primary)" }}>Phase 4</p>
          <h1 className="text-4xl font-display font-bold mt-1"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.03em" }}>
            Physics Lab
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            {LAB_EXPERIMENTS.length} interactive experiments across 9 zones.
            Adjust parameters. See physics in action.
          </p>
        </motion.div>

        {/* Zone filter strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          <button
            onClick={() => setActiveZone("all")}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background:  activeZone === "all" ? "var(--color-primary)" : "var(--color-surface)",
              color:       activeZone === "all" ? "#fff" : "var(--color-text-secondary)",
              border:      "1px solid " + (activeZone === "all" ? "transparent" : "var(--color-border)"),
            }}
          >
            All ({LAB_EXPERIMENTS.length})
          </button>
          {zones.map((zone) => {
            const meta  = ZONE_META[zone];
            const count = getExperimentsByZone(zone).length;
            const isActive = activeZone === zone;
            return (
              <button
                key={zone}
                onClick={() => setActiveZone(zone)}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background:  isActive ? meta.color + "20" : "var(--color-surface)",
                  color:       isActive ? meta.color : "var(--color-text-secondary)",
                  border:      `1px solid ${isActive ? meta.color + "45" : "var(--color-border)"}`,
                }}
              >
                {meta.icon} {meta.label}
                <span className="opacity-60 text-xs">({count})</span>
              </button>
            );
          })}
        </motion.div>

        {/* Zone description */}
        <AnimatePresence mode="wait">
          {activeZone !== "all" && (
            <motion.div
              key={activeZone}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 py-3 rounded-xl border text-sm"
              style={{
                background:  ZONE_META[activeZone].color + "0a",
                borderColor: ZONE_META[activeZone].color + "30",
                color:       "var(--color-text-secondary)",
              }}
            >
              {ZONE_META[activeZone].icon} <strong style={{ color: ZONE_META[activeZone].color }}>
                {ZONE_META[activeZone].label}
              </strong> — {ZONE_META[activeZone].description}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Experiment grid */}
        <AnimatePresence mode="wait">
          {activeZone === "all" ? (
            // Grouped by zone
            <div className="space-y-10">
              {zones.map((zone) => {
                const exps = getExperimentsByZone(zone);
                if (exps.length === 0) return null;
                const meta = ZONE_META[zone];
                return (
                  <div key={zone} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{meta.icon}</span>
                      <h2 className="text-lg font-display font-semibold"
                        style={{ color: meta.color }}>
                        {meta.label}
                      </h2>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: meta.color + "15", color: meta.color }}>
                        {exps.length}
                      </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {exps.map((exp, i) => (
                        <ExperimentCard key={exp.id} exp={exp} index={i} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <motion.div
              key={activeZone}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {experiments.map((exp, i) => (
                <ExperimentCard key={exp.id} exp={exp} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
