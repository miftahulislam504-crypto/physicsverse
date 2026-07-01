"use client";

// src/components/physics/FormulaExplorer.tsx
import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  RotateCcw, BookOpen, FlaskConical, ArrowRight,
  Lightbulb, Ruler,
} from "lucide-react";
import { FormulaRenderer } from "./FormulaRenderer";
import { FormulaSlider }   from "./FormulaSlider";
import { FormulaGraph }    from "./FormulaGraph";
import { DerivationAccordion } from "./DerivationAccordion";
import { DOMAIN_META }     from "@/lib/utils";
import type { FormulaData } from "@/lib/constants/formulas-data";

interface FormulaExplorerProps {
  formula: FormulaData;
}

export function FormulaExplorer({ formula }: FormulaExplorerProps) {
  const domain = DOMAIN_META[formula.domain];

  // ── Initial values from formula defaults ────────────────────────────────────
  const initialValues = useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of formula.variables) map[v.symbol] = v.defaultValue;
    return map;
  }, [formula]);

  const [values, setValues] = useState<Record<string, number>>(initialValues);
  const [activeTab, setActiveTab] = useState<"sliders" | "graph" | "derivation" | "uses">("sliders");

  const handleChange = useCallback((symbol: string, value: number) => {
    setValues((prev) => ({ ...prev, [symbol]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const hasChanged = useMemo(
    () => formula.variables.some((v) => values[v.symbol] !== v.defaultValue),
    [formula.variables, values]
  );

  const TABS = [
    { id: "sliders",    label: "Sliders",    emoji: "🎚️" },
    { id: "graph",      label: "Graph",      emoji: "📈" },
    { id: "derivation", label: "Derivation", emoji: "📐" },
    { id: "uses",       label: "Real World", emoji: "🌍" },
  ] as const;

  return (
    <div className="space-y-5">

      {/* ── Formula display ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: domain.color + "35" }}
      >
        {/* Coloured top strip */}
        <div className="h-1" style={{ background: domain.color }} />

        <div
          className="p-6"
          style={{
            background: `linear-gradient(135deg, ${domain.color}0a, transparent)`,
          }}
        >
          {/* Domain badge */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: domain.color + "18", color: domain.color }}
            >
              {domain.icon} {domain.label}
            </span>

            {/* SI unit + dimensional formula */}
            <div className="text-right">
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Unit: <span style={{ color: domain.color }}>{formula.siUnit}</span>
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                [{formula.dimensionalFormula}]
              </p>
            </div>
          </div>

          {/* Formula name */}
          <h2
            className="text-xl font-display font-bold mb-1"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}
          >
            {formula.name}
          </h2>
          <p className="text-sm mb-5" style={{ color: "var(--color-text-secondary)" }}>
            {formula.description}
          </p>

          {/* Big KaTeX formula */}
          <div
            className="flex items-center justify-center py-5 px-4 rounded-2xl overflow-x-auto"
            style={{
              background:  domain.color + "0c",
              border:      `1px solid ${domain.color}25`,
            }}
          >
            <div className="text-2xl">
              <FormulaRenderer latex={formula.latexExpanded} block={false} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Tab navigation ── */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl"
        style={{ background: "var(--color-surface)" }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{ color: isActive ? "var(--color-text-primary)" : "var(--color-text-muted)" }}
            >
              {isActive && (
                <motion.div
                  layoutId="formula-tab"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "var(--color-bg)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{tab.emoji}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">

        {/* SLIDERS TAB */}
        {activeTab === "sliders" && (
          <motion.div
            key="sliders"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Reset button */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-text-muted)" }}>
                Adjust Variables
              </p>
              {hasChanged && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: "var(--color-surface)",
                    color:       "var(--color-text-secondary)",
                    border:      "1px solid var(--color-border)",
                  }}
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>

            {/* Sliders */}
            <div className="space-y-3">
              {formula.variables.map((variable) => (
                <FormulaSlider
                  key={variable.symbol}
                  variable={variable}
                  value={values[variable.symbol] ?? variable.defaultValue}
                  onChange={handleChange}
                  color={domain.color}
                  disabled={variable.step === 0} // constants
                />
              ))}
            </div>

            {/* Hint */}
            <div
              className="flex items-start gap-2 p-3 rounded-xl text-xs"
              style={{
                background:  domain.color + "08",
                border:      `1px solid ${domain.color}20`,
                color:       "var(--color-text-muted)",
              }}
            >
              <Lightbulb size={13} style={{ color: domain.color, flexShrink: 0, marginTop: 1 }} />
              Drag the sliders to see how changing each variable affects the others.
              Switch to the <strong style={{ color: domain.color }}>Graph</strong> tab to visualise the relationship.
            </div>
          </motion.div>
        )}

        {/* GRAPH TAB */}
        {activeTab === "graph" && (
          <motion.div
            key="graph"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <FormulaGraph formula={formula} values={values} color={domain.color} />

            {/* Quick variable reminder */}
            <div
              className="p-4 rounded-xl border"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-text-muted)" }}>
                CURRENT VALUES
              </p>
              <div className="flex flex-wrap gap-2">
                {formula.variables.map((v) => (
                  <div
                    key={v.symbol}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                    style={{
                      background:  v.symbol === formula.xVar ? domain.color + "18" : "var(--color-surface-2)",
                      color:       v.symbol === formula.xVar ? domain.color : "var(--color-text-secondary)",
                      border:      `1px solid ${v.symbol === formula.xVar ? domain.color + "30" : "transparent"}`,
                    }}
                  >
                    <FormulaRenderer latex={v.symbol} />
                    <span>=</span>
                    <span className="font-mono">{values[v.symbol]?.toPrecision(3)}</span>
                    <span className="opacity-60">{v.unit}</span>
                    {v.symbol === formula.xVar && (
                      <span className="text-xs opacity-70">(x-axis)</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
                Go to <strong>Sliders</strong> to change values and see the graph update live.
              </p>
            </div>
          </motion.div>
        )}

        {/* DERIVATION TAB */}
        {activeTab === "derivation" && (
          <motion.div
            key="derivation"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {formula.derivationSteps.length > 0 ? (
              <DerivationAccordion
                steps={formula.derivationSteps}
                color={domain.color}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-3xl mb-2">📐</p>
                <p style={{ color: "var(--color-text-muted)" }}>
                  Derivation coming soon.
                </p>
              </div>
            )}

            {/* Dimensional analysis */}
            <div
              className="p-4 rounded-2xl border"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Ruler size={15} style={{ color: domain.color }} />
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  Dimensional Analysis
                </p>
              </div>
              <div
                className="flex items-center justify-center py-3 px-4 rounded-xl text-sm font-mono"
                style={{ background: domain.color + "08", color: domain.color }}
              >
                [{formula.name.split(" ")[0]}] = {formula.dimensionalFormula}
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
                M = mass, L = length, T = time, A = current. Verify equations by checking dimensional consistency.
              </p>
            </div>
          </motion.div>
        )}

        {/* REAL WORLD TAB */}
        {activeTab === "uses" && (
          <motion.div
            key="uses"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {formula.realWorldUses.map((use, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-xl border"
                style={{
                  background:  "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <span className="text-xl flex-shrink-0">🌍</span>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {use}
                </p>
              </motion.div>
            ))}

            {/* Link to chapter */}
            <Link
              href={`/learn/${formula.chapterSlug}`}
              className="flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.01]"
              style={{
                background:  domain.color + "08",
                borderColor: domain.color + "30",
              }}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={15} style={{ color: domain.color }} />
                <p className="text-sm font-medium" style={{ color: domain.color }}>
                  Study the full chapter →
                </p>
              </div>
              <ArrowRight size={14} style={{ color: domain.color }} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Related formulas ── */}
      {formula.relatedFormulas.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}>
            Related Formulas
          </p>
          <div className="flex flex-wrap gap-2">
            {formula.relatedFormulas.map((id) => (
              <Link
                key={id}
                href={`/formulas/${id.replace("f-", "")}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all hover:scale-105"
                style={{
                  background:  "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  color:       "var(--color-text-secondary)",
                }}
              >
                <FlaskConical size={11} />
                {id.replace("f-", "").replace(/-/g, " ")}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
