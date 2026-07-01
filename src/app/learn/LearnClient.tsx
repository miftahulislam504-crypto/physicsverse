"use client";

// src/app/learn/LearnClient.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, BookOpen } from "lucide-react";
import { ALL_CHAPTERS, getChaptersByDomain } from "@/lib/constants/chapters-data";
import { DOMAIN_NODES } from "@/lib/constants/physics-data";
import { DOMAIN_META, DIFFICULTY_META } from "@/lib/utils";
import { ChapterCard } from "@/components/physics/ChapterCard";
import { SectionHeader } from "@/components/ui";
import type { PhysicsDomain, DifficultyLevel } from "@/types";

type FilterDomain     = PhysicsDomain | "all";
type FilterDifficulty = DifficultyLevel | "all";

export function LearnClient() {
  const [search,     setSearch]     = useState("");
  const [domain,     setDomain]     = useState<FilterDomain>("all");
  const [difficulty, setDifficulty] = useState<FilterDifficulty>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter + search
  const filtered = useMemo(() => {
    return ALL_CHAPTERS.filter((ch) => {
      const matchDomain = domain === "all" || ch.domain === domain;
      const matchDiff   = difficulty === "all" || ch.difficulty === difficulty;
      const q           = search.toLowerCase();
      const matchSearch =
        !q ||
        ch.title.toLowerCase().includes(q) ||
        ch.description.toLowerCase().includes(q) ||
        ch.tags.some((t) => t.includes(q));
      return matchDomain && matchDiff && matchSearch;
    });
  }, [search, domain, difficulty]);

  // Group by domain for "all" view
  const grouped = useMemo(() => {
    if (domain !== "all") return null;
    const map = new Map<PhysicsDomain, typeof ALL_CHAPTERS>();
    for (const ch of filtered) {
      if (!map.has(ch.domain)) map.set(ch.domain, []);
      map.get(ch.domain)!.push(ch);
    }
    return map;
  }, [filtered, domain]);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>
            Phase 2
          </p>
          <h1
            className="text-4xl font-display font-bold"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.03em" }}
          >
            Learn Physics
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            {ALL_CHAPTERS.length} chapters across 10 domains — from Newton to Quantum.
          </p>
        </motion.div>

        {/* Search + Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--color-text-muted)" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chapters, topics, formulas..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
              style={{
                background:   "var(--color-surface)",
                borderColor:  "var(--color-border)",
                color:        "var(--color-text-primary)",
              }}
              onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--color-primary)"; }}
              onBlur={(e)  => { (e.target as HTMLElement).style.borderColor = "var(--color-border)"; }}
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all"
            style={{
              background:  showFilters ? "var(--color-primary-subtle)" : "var(--color-surface)",
              borderColor: showFilters ? "rgba(0,144,240,0.4)" : "var(--color-border)",
              color:       showFilters ? "var(--color-primary)" : "var(--color-text-secondary)",
            }}
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
        </motion.div>

        {/* Filter dropdowns */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 p-4 rounded-2xl border"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            {/* Domain filter */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                Domain
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setDomain("all")}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    background:  domain === "all" ? "var(--color-primary)" : "var(--color-surface-2)",
                    color:       domain === "all" ? "#fff" : "var(--color-text-secondary)",
                  }}
                >
                  All
                </button>
                {DOMAIN_NODES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDomain(d.id)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                    style={{
                      background:  domain === d.id ? d.color + "25" : "var(--color-surface-2)",
                      color:       domain === d.id ? d.color : "var(--color-text-secondary)",
                      border:      domain === d.id ? `1px solid ${d.color}40` : "1px solid transparent",
                    }}
                  >
                    {d.icon} {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty filter */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                Difficulty
              </p>
              <div className="flex gap-1.5">
                {(["all", "beginner", "intermediate", "advanced", "olympiad"] as const).map((d) => {
                  const meta = d !== "all" ? DIFFICULTY_META[d] : null;
                  return (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-all capitalize"
                      style={{
                        background:  difficulty === d ? (meta?.color ?? "var(--color-primary)") + "20" : "var(--color-surface-2)",
                        color:       difficulty === d ? (meta?.color ?? "var(--color-primary)") : "var(--color-text-secondary)",
                      }}
                    >
                      {d === "all" ? "All Levels" : d}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {filtered.length} chapter{filtered.length !== 1 ? "s" : ""} found
          </p>
          {(search || domain !== "all" || difficulty !== "all") && (
            <button
              onClick={() => { setSearch(""); setDomain("all"); setDifficulty("all"); }}
              className="text-xs transition-colors hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Chapter listing */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" style={{ color: "var(--color-text-muted)" }} />
            <p className="font-medium" style={{ color: "var(--color-text-secondary)" }}>
              No chapters match your search.
            </p>
          </div>
        ) : grouped ? (
          // Grouped by domain
          <div className="space-y-10">
            {Array.from(grouped.entries()).map(([dom, chapters]) => {
              const meta = DOMAIN_META[dom];
              return (
                <div key={dom} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{meta.icon}</span>
                    <h2
                      className="text-lg font-display font-semibold"
                      style={{ color: meta.color }}
                    >
                      {meta.label}
                    </h2>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: meta.color + "15", color: meta.color }}
                    >
                      {chapters.length}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {chapters.map((ch, i) => (
                      <ChapterCard key={ch.id} chapter={ch} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Flat list (filtered by domain)
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((ch, i) => (
              <ChapterCard key={ch.id} chapter={ch} index={i} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
