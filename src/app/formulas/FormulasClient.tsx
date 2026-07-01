"use client";

// src/app/formulas/FormulasClient.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ALL_FORMULAS, getFormulasByDomain } from "@/lib/constants/formulas-data";
import { DOMAIN_NODES } from "@/lib/constants/physics-data";
import { DOMAIN_META } from "@/lib/utils";
import { FormulaListCard } from "@/components/physics/FormulaListCard";
import { SectionHeader } from "@/components/ui";
import type { PhysicsDomain } from "@/types";

export function FormulasClient() {
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState<PhysicsDomain | "all">("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_FORMULAS.filter((f) => {
      const matchDomain = domain === "all" || f.domain === domain;
      const matchSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.tags.some((t) => t.includes(q)) ||
        f.latex.toLowerCase().includes(q);
      return matchDomain && matchSearch;
    });
  }, [search, domain]);

  // Group by domain when "all" selected
  const grouped = useMemo(() => {
    if (domain !== "all") return null;
    const map = new Map<PhysicsDomain, typeof ALL_FORMULAS>();
    for (const f of filtered) {
      if (!map.has(f.domain)) map.set(f.domain, []);
      map.get(f.domain)!.push(f);
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
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-primary)" }}>
            Phase 3
          </p>
          <h1
            className="text-4xl font-display font-bold"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.03em" }}
          >
            Formula Explorer
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            {ALL_FORMULAS.length} interactive formulas — adjust variables, see live graphs, study derivations.
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--color-text-muted)" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search formulas, variables, topics..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
            style={{
              background:  "var(--color-surface)",
              borderColor: "var(--color-border)",
              color:       "var(--color-text-primary)",
            }}
            onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--color-primary)"; }}
            onBlur={(e)  => { (e.target as HTMLElement).style.borderColor = "var(--color-border)"; }}
          />
        </div>

        {/* Domain filter chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDomain("all")}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background:  domain === "all" ? "var(--color-primary)" : "var(--color-surface)",
              color:       domain === "all" ? "#fff" : "var(--color-text-secondary)",
              border:      "1px solid " + (domain === "all" ? "transparent" : "var(--color-border)"),
            }}
          >
            All ({ALL_FORMULAS.length})
          </button>
          {DOMAIN_NODES.map((d) => {
            const count = getFormulasByDomain(d.id).length;
            if (count === 0) return null;
            const isActive = domain === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setDomain(d.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background:  isActive ? d.color + "22" : "var(--color-surface)",
                  color:       isActive ? d.color : "var(--color-text-secondary)",
                  border:      `1px solid ${isActive ? d.color + "40" : "var(--color-border)"}`,
                }}
              >
                {d.icon} {d.label}
                <span className="opacity-60 ml-0.5">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Count */}
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {filtered.length} formula{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl mb-3">∑</p>
            <p style={{ color: "var(--color-text-secondary)" }}>No formulas match your search.</p>
          </div>
        ) : grouped ? (
          <div className="space-y-10">
            {Array.from(grouped.entries()).map(([dom, formulas]) => {
              const meta = DOMAIN_META[dom];
              return (
                <div key={dom} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{meta.icon}</span>
                    <h2 className="text-lg font-display font-semibold" style={{ color: meta.color }}>
                      {meta.label}
                    </h2>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: meta.color + "15", color: meta.color }}
                    >
                      {formulas.length}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {formulas.map((f, i) => (
                      <FormulaListCard key={f.id} formula={f} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((f, i) => (
              <FormulaListCard key={f.id} formula={f} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
