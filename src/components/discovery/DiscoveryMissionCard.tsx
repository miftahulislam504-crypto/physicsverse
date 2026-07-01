"use client";

// src/components/discovery/DiscoveryMissionCard.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles, Search } from "lucide-react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { FormulaRenderer } from "@/components/physics/FormulaRenderer";
import { DOMAIN_META } from "@/lib/utils";
import type { DiscoveryMission } from "@/lib/constants/discovery-data";

export function DiscoveryMissionCard({ mission }: { mission: DiscoveryMission }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const domain = DOMAIN_META[mission.domain];

  const isCorrect = selected === mission.correctAnswer;

  function handleSelect(id: string) {
    if (revealed) return;
    setSelected(id);
    setRevealed(true);
  }

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--color-surface)", borderColor: domain.color + "30" }}>

      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center gap-3"
        style={{ borderColor: "var(--color-border)", background: domain.color + "06" }}>
        <span className="text-2xl">{mission.icon}</span>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{mission.title}</p>
          <span className="text-xs px-2 py-0.5 rounded-full inline-block mt-0.5"
            style={{ background: domain.color + "15", color: domain.color }}>
            {mission.type === "pattern" ? "🔍 Pattern Finding" : "🧪 Hypothesis Testing"}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Scenario */}
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {mission.scenario}
        </p>

        {/* Data table + chart */}
        {mission.data && (
          <div className="grid sm:grid-cols-2 gap-3">
            {/* Data table */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: "var(--color-surface-2)" }}>
                    <th className="px-3 py-2 text-left font-medium" style={{ color: "var(--color-text-muted)" }}>{mission.xLabel}</th>
                    <th className="px-3 py-2 text-left font-medium" style={{ color: "var(--color-text-muted)" }}>{mission.yLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {mission.data.map((d, i) => (
                    <tr key={i} style={{ borderTop: "1px solid var(--color-border)" }}>
                      <td className="px-3 py-1.5 font-mono" style={{ color: "var(--color-text-secondary)" }}>{d.x}</td>
                      <td className="px-3 py-1.5 font-mono" style={{ color: "var(--color-text-secondary)" }}>{d.y}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Scatter chart */}
            <div className="rounded-xl border p-2" style={{ borderColor: "var(--color-border)" }}>
              <ResponsiveContainer width="100%" height={160}>
                <ScatterChart margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
                  <XAxis dataKey="x" type="number" tick={{ fontSize: 9, fill: "var(--color-text-muted)" }}
                    label={{ value: mission.xLabel, position: "insideBottom", offset: -2, fontSize: 9, fill: "var(--color-text-muted)" }} />
                  <YAxis dataKey="y" type="number" tick={{ fontSize: 9, fill: "var(--color-text-muted)" }} width={35} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: `1px solid ${domain.color}40`, borderRadius: 8, fontSize: 10 }} />
                  <Scatter data={mission.data} fill={domain.color} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Question */}
        <div className="flex items-start gap-2">
          <Search size={15} style={{ color: domain.color, flexShrink: 0, marginTop: 2 }} />
          <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{mission.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {mission.options.map((opt) => {
            const isSel = selected === opt.id;
            const isCorrectOpt = opt.id === mission.correctAnswer;
            let bg = "var(--color-surface-2)"; let border = "var(--color-border)"; let color = "var(--color-text-secondary)";

            if (revealed) {
              if (isCorrectOpt) { bg = "rgba(34,197,94,0.12)"; border = "rgba(34,197,94,0.4)"; color = "#22c55e"; }
              else if (isSel) { bg = "rgba(239,68,68,0.1)"; border = "rgba(239,68,68,0.35)"; color = "#ef4444"; }
            }

            return (
              <button key={opt.id} onClick={() => handleSelect(opt.id)} disabled={revealed}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all"
                style={{ background: bg, borderColor: border, color }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: color + "20", color }}>
                  {opt.id}
                </span>
                {opt.text}
                {revealed && isCorrectOpt && <CheckCircle2 size={14} className="ml-auto flex-shrink-0" style={{ color: "#22c55e" }} />}
                {revealed && isSel && !isCorrectOpt && <XCircle size={14} className="ml-auto flex-shrink-0" style={{ color: "#ef4444" }} />}
              </button>
            );
          })}
        </div>

        {/* Explanation + revealed law */}
        <AnimatePresence>
          {revealed && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3 overflow-hidden">
              <div className="p-3 rounded-xl text-xs" style={{ background: "var(--color-surface-2)", color: "var(--color-text-secondary)" }}>
                {mission.explanation}
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl border"
                style={{ background: domain.color + "0c", borderColor: domain.color + "35" }}>
                <Sparkles size={18} style={{ color: domain.color, flexShrink: 0 }} />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: domain.color }}>YOU DISCOVERED:</p>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{mission.revealedLaw}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
