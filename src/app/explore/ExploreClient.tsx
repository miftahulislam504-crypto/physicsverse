"use client";

// src/app/explore/ExploreClient.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network, Clock, Map, Sparkles, BookOpen,
} from "lucide-react";
import { PhysicsMap }      from "@/components/physics/PhysicsMap";
import { PhysicsTimeline } from "@/components/physics/PhysicsTimeline";
import { PhysicsRoadmap }  from "@/components/physics/PhysicsRoadmap";
import { DailyFact }       from "@/components/physics/DailyFact";
import { DomainGrid }      from "@/components/physics/DomainGrid";
import { TabBar, SectionHeader } from "@/components/ui";

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: "map",      label: "Physics Map",  icon: <Network   size={14} /> },
  { id: "timeline", label: "Timeline",     icon: <Clock     size={14} /> },
  { id: "roadmap",  label: "Roadmap",      icon: <Map       size={14} /> },
  { id: "domains",  label: "All Domains",  icon: <BookOpen  size={14} /> },
];

export function ExploreClient() {
  const [activeTab, setActiveTab] = useState("map");

  return (
    <div className="min-h-screen bg-physics-grid" style={{ backgroundSize: "40px 40px" }}>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

        {/* ── Hero header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-primary)" }}
          >
            Phase 1 — World Explorer
          </p>
          <h1
            className="text-4xl sm:text-5xl font-display font-bold"
            style={{ letterSpacing: "-0.03em", color: "var(--color-text-primary)" }}
          >
            Explore the{" "}
            <span className="text-gradient-primary">Physics Universe</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            Navigate the map of physics. Trace history. Pick your learning path.
          </p>
        </motion.div>

        {/* ── Daily fact — always visible ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <DailyFact />
        </motion.div>

        {/* ── Tab navigation ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex justify-center"
        >
          <TabBar
            tabs={TABS}
            active={activeTab}
            onChange={setActiveTab}
          />
        </motion.div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">
          {activeTab === "map" && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <SectionHeader
                eyebrow="Interactive Map"
                title="Physics Knowledge Graph"
                description="Every domain of physics and how they connect. Click a node to explore."
              />
              <PhysicsMap />
            </motion.div>
          )}

          {activeTab === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <SectionHeader
                eyebrow="History of Physics"
                title="Physics Timeline"
                description="From Archimedes to gravitational waves — 24 landmark moments that changed science."
              />
              <PhysicsTimeline />
            </motion.div>
          )}

          {activeTab === "roadmap" && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <SectionHeader
                eyebrow="Learning Paths"
                title="Your Physics Roadmap"
                description="Pick a path — SSC, HSC, Admission prep, Olympiad, or just curious exploration."
              />
              <PhysicsRoadmap />
            </motion.div>
          )}

          {activeTab === "domains" && (
            <motion.div
              key="domains"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <SectionHeader
                eyebrow="All Domains"
                title="Browse by Domain"
                description="10 domains of physics — each with chapters, labs, and simulations."
              />
              <DomainGrid showAll />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stats strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { value: "10",  label: "Physics Domains",     icon: "🌐" },
            { value: "65+", label: "Total Chapters",      icon: "📖" },
            { value: "49",  label: "Lab Experiments",     icon: "🧪" },
            { value: "24",  label: "Timeline Events",     icon: "🕰️" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-2xl border text-center"
              style={{
                background:  "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <span className="text-2xl">{stat.icon}</span>
              <p
                className="text-xl font-bold font-display mt-1"
                style={{ color: "var(--color-primary)" }}
              >
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
