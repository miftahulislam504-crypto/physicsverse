"use client";

// src/app/encyclopedia/EncyclopediaClient.tsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search, Users, Scale, Trophy, Wrench, Sparkles, BookA, ArrowRight,
} from "lucide-react";
import {
  SCIENTISTS, PHYSICS_LAWS, NOBEL_PRIZES, INSTRUMENTS, PHENOMENA, GLOSSARY,
} from "@/lib/constants/encyclopedia-data";
import { DOMAIN_META } from "@/lib/utils";
import { TabBar, SectionHeader } from "@/components/ui";
import { FormulaRenderer } from "@/components/physics/FormulaRenderer";

const TABS = [
  { id: "scientists",  label: "Scientists",  icon: <Users    size={13} /> },
  { id: "laws",        label: "Laws",        icon: <Scale    size={13} /> },
  { id: "nobel",       label: "Nobel",       icon: <Trophy   size={13} /> },
  { id: "instruments", label: "Instruments", icon: <Wrench   size={13} /> },
  { id: "phenomena",   label: "Phenomena",   icon: <Sparkles size={13} /> },
  { id: "glossary",    label: "Glossary",    icon: <BookA    size={13} /> },
] as const;
type TabId = typeof TABS[number]["id"];

// ── Scientists Tab ──────────────────────────────────────────────────────────
function ScientistsTab() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {SCIENTISTS.map((s, i) => (
        <motion.div key={s.id}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Link href={`/encyclopedia/scientists/${s.id}`}
            className="group flex gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.01] block"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: "var(--color-surface-2)" }}>
              {s.portrait}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold font-display" style={{ color: "var(--color-text-primary)" }}>
                  {s.name}
                </p>
                <span>{s.flag}</span>
              </div>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {s.born} – {s.died ?? "present"} · {s.nationality}
              </p>
              {s.nobelYear && (
                <span className="inline-flex items-center gap-1 text-xs mt-1 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                  🏆 Nobel {s.nobelYear}
                </span>
              )}
              <p className="text-xs mt-1.5 line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>
                {s.bio}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

// ── Laws Tab ────────────────────────────────────────────────────────────────
function LawsTab() {
  return (
    <div className="space-y-3">
      {PHYSICS_LAWS.map((law, i) => {
        const meta = DOMAIN_META[law.domain];
        return (
          <motion.div key={law.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border p-5 space-y-3"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: meta.color + "18", color: meta.color }}>
                    {meta.icon} {meta.label}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{law.year}</span>
                </div>
                <p className="text-base font-display font-semibold mt-1" style={{ color: "var(--color-text-primary)" }}>
                  {law.name}
                </p>
                <p className="text-xs" style={{ color: meta.color }}>{law.scientist}</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {law.statement}
            </p>

            {law.latex && (
              <div className="px-4 py-3 rounded-xl flex justify-center" style={{ background: meta.color + "08" }}>
                <FormulaRenderer latex={law.latex} block />
              </div>
            )}

            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--color-text-muted)" }}>APPLICATIONS</p>
              <div className="flex flex-wrap gap-1.5">
                {law.applications.map((a) => (
                  <span key={a} className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--color-surface-2)", color: "var(--color-text-secondary)" }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs italic" style={{ color: "var(--color-text-muted)" }}>
              ⚠️ Limitation: {law.limitations}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Nobel Tab ───────────────────────────────────────────────────────────────
function NobelTab() {
  return (
    <div className="space-y-3">
      {NOBEL_PRIZES.map((prize, i) => {
        const meta = DOMAIN_META[prize.domain];
        return (
          <motion.div key={prize.year}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex gap-4 p-4 rounded-2xl border"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
              style={{ background: "rgba(245,158,11,0.12)" }}>
              <Trophy size={18} style={{ color: "#f59e0b" }} />
              <span className="text-xs font-bold mt-0.5" style={{ color: "#f59e0b" }}>{prize.year}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                {prize.discovery}
              </p>
              <p className="text-xs mt-0.5" style={{ color: meta.color }}>
                {prize.laureates.join(", ")} · {prize.country}
              </p>
              <p className="text-xs mt-1.5" style={{ color: "var(--color-text-secondary)" }}>
                {prize.significance}
              </p>
              <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-2"
                style={{ background: meta.color + "15", color: meta.color }}>
                {meta.icon} {meta.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Instruments Tab ─────────────────────────────────────────────────────────
function InstrumentsTab() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {INSTRUMENTS.map((inst, i) => {
        const meta = DOMAIN_META[inst.domain];
        return (
          <motion.div key={inst.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-2xl border space-y-2"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{inst.icon}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{inst.name}</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{inst.invented}</p>
              </div>
            </div>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{inst.purpose}</p>
            <p className="text-xs italic" style={{ color: "var(--color-text-muted)" }}>{inst.principle}</p>
            <div className="flex flex-wrap gap-1">
              {inst.applications.map((a) => (
                <span key={a} className="text-xs px-1.5 py-0.5 rounded" style={{ background: meta.color + "12", color: meta.color }}>
                  {a}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Phenomena Tab ───────────────────────────────────────────────────────────
function PhenomenaTab() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PHENOMENA.map((p, i) => {
        const meta = DOMAIN_META[p.domain];
        return (
          <motion.div key={p.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-2xl border space-y-2"
            style={{ background: "var(--color-surface)", borderColor: meta.color + "20" }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{p.icon}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{p.name}</p>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: meta.color + "15", color: meta.color }}>
                  {meta.label}
                </span>
              </div>
            </div>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{p.description}</p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{p.physics}</p>
            <p className="text-xs italic" style={{ color: meta.color }}>📍 {p.example}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Glossary Tab ────────────────────────────────────────────────────────────
function GlossaryTab() {
  const [search, setSearch] = useState("");
  const filtered = GLOSSARY.filter((g) =>
    g.term.toLowerCase().includes(search.toLowerCase()) ||
    g.definition.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
      </div>
      <div className="space-y-2">
        {filtered.map((g) => {
          const meta = DOMAIN_META[g.domain];
          return (
            <div key={g.term} className="p-3 rounded-xl" style={{ background: "var(--color-surface)" }}>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{g.term}</p>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: meta.color + "15", color: meta.color }}>
                  {meta.label}
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>{g.definition}</p>
              {g.latex && (
                <div className="mt-1.5"><FormulaRenderer latex={g.latex} /></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
export function EncyclopediaClient() {
  const [tab, setTab] = useState<TabId>("scientists");

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>Phase 11</p>
          <h1 className="text-4xl font-display font-bold mt-1"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.03em" }}>
            Physics Encyclopedia
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Scientists, laws, Nobel prizes, instruments, phenomena, and glossary.
          </p>
        </motion.div>

        <div className="flex justify-center overflow-x-auto pb-1">
          <TabBar tabs={TABS} active={tab} onChange={(id) => setTab(id as TabId)} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {tab === "scientists"  && <ScientistsTab />}
            {tab === "laws"        && <LawsTab />}
            {tab === "nobel"       && <NobelTab />}
            {tab === "instruments" && <InstrumentsTab />}
            {tab === "phenomena"   && <PhenomenaTab />}
            {tab === "glossary"    && <GlossaryTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
