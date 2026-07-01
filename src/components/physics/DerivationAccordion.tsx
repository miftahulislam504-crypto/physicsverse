"use client";

// src/components/physics/DerivationAccordion.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FormulaRenderer } from "./FormulaRenderer";
import type { DerivationStep } from "@/lib/constants/formulas-data";

interface DerivationAccordionProps {
  steps: DerivationStep[];
  color?: string;
}

export function DerivationAccordion({ steps, color = "var(--color-primary)" }: DerivationAccordionProps) {
  const [open,    setOpen]    = useState(false);
  const [current, setCurrent] = useState(0);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full px-5 py-4 text-left transition-colors hover:bg-[var(--color-surface-2)]"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📐</span>
          <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
            Step-by-Step Derivation
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: color + "15", color }}
          >
            {steps.length} steps
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} style={{ color: "var(--color-text-muted)" }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: "var(--color-border)" }}>
              {/* Step navigator */}
              <div className="flex items-center gap-2 pt-4 overflow-x-auto">
                {steps.map((step, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="flex-shrink-0 w-8 h-8 rounded-full text-xs font-bold transition-all"
                    style={{
                      background: current === i ? color : (i < current ? color + "30" : "var(--color-surface-2)"),
                      color:      current === i ? "#fff"  : (i < current ? color : "var(--color-text-muted)"),
                      border:     `2px solid ${current === i ? color : "transparent"}`,
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Current step */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {/* LaTeX */}
                  <div
                    className="p-4 rounded-xl flex items-center justify-center overflow-x-auto"
                    style={{ background: color + "08", border: `1px solid ${color}20` }}
                  >
                    <FormulaRenderer latex={steps[current].latex} block />
                  </div>

                  {/* Explanation */}
                  <div
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: "var(--color-surface-2)" }}
                  >
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                      style={{ background: color }}
                    >
                      {current + 1}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                      {steps[current].explanation}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next */}
              <div className="flex justify-between pt-1">
                <button
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  disabled={current === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30"
                  style={{ color, background: color + "12" }}
                >
                  <ChevronRight size={13} className="rotate-180" /> Previous
                </button>
                <button
                  onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
                  disabled={current === steps.length - 1}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30"
                  style={{ color, background: color + "12" }}
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
