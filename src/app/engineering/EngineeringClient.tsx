"use client";

// src/app/engineering/EngineeringClient.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { ENGINEERING_CASES, FIELDS, getEngineeringByField } from "@/lib/constants/engineering-data";
import { DOMAIN_META } from "@/lib/utils";

export function EngineeringClient() {
  const [field, setField] = useState<string | "all">("all");
  const cases = field === "all" ? ENGINEERING_CASES : getEngineeringByField(field);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>Phase 8</p>
          <h1 className="text-4xl font-display font-bold mt-1"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.03em" }}>
            Engineering Applications
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Physics in action — how real engineers use these principles to build the world.
          </p>
        </motion.div>

        {/* Field filter */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setField("all")}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: field === "all" ? "var(--color-primary)" : "var(--color-surface)",
              color:      field === "all" ? "#fff" : "var(--color-text-secondary)",
              border:     "1px solid " + (field === "all" ? "transparent" : "var(--color-border)"),
            }}>
            🌐 All ({ENGINEERING_CASES.length})
          </button>
          {FIELDS.map((f) => {
            const count = getEngineeringByField(f.id).length;
            const isActive = field === f.id;
            return (
              <button key={f.id} onClick={() => setField(f.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background:  isActive ? f.color + "20" : "var(--color-surface)",
                  color:       isActive ? f.color : "var(--color-text-secondary)",
                  border:      `1px solid ${isActive ? f.color + "45" : "var(--color-border)"}`,
                }}>
                {f.icon} {f.label} <span className="opacity-60 text-xs">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Cases grid */}
        <AnimatePresence mode="wait">
          <motion.div key={field} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 sm:grid-cols-2">
            {cases.map((c, i) => {
              const fieldMeta = FIELDS.find((f) => f.id === c.field)!;
              const domain = DOMAIN_META[c.domain];
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/engineering/${c.slug}`}
                    className="group flex flex-col gap-3 p-5 rounded-2xl border h-full transition-all duration-200 block"
                    style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = fieldMeta.color + "45"; el.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "var(--color-border)"; el.style.transform = "translateY(0)";
                    }}>
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{c.icon}</span>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: fieldMeta.color + "18", color: fieldMeta.color }}>
                        {fieldMeta.icon} {fieldMeta.label}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-base font-display font-semibold" style={{ color: "var(--color-text-primary)" }}>{c.title}</h2>
                      <p className="text-xs mt-1.5 line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>{c.problem}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: domain.color + "12", color: domain.color }}>
                        {domain.icon} {domain.label}
                      </span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color: fieldMeta.color, opacity: 0.7 }} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
