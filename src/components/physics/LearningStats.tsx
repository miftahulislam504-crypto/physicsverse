"use client";

// src/components/physics/LearningStats.tsx
import { motion } from "framer-motion";
import { Flame, BookCheck, Clock, Zap } from "lucide-react";
import { useProgress } from "@/lib/hooks/useProgress";
import { ALL_CHAPTERS } from "@/lib/constants/chapters-data";

export function LearningStats() {
  const { completedIds, loading } = useProgress();

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1,2,3,4].map((i) => (
          <div
            key={i}
            className="h-20 rounded-2xl shimmer"
            style={{ background: "var(--color-surface)" }}
          />
        ))}
      </div>
    );
  }

  const completed  = completedIds.length;
  const total      = ALL_CHAPTERS.length;
  const pct        = total > 0 ? Math.round((completed / total) * 100) : 0;
  const totalMins  = ALL_CHAPTERS
    .filter((c) => completedIds.includes(c.id))
    .reduce((acc, c) => acc + c.estimatedMinutes, 0);

  const stats = [
    {
      icon:  <BookCheck size={18} />,
      value: `${completed}/${total}`,
      label: "Chapters Done",
      color: "#0090f0",
    },
    {
      icon:  <Zap size={18} />,
      value: `${pct}%`,
      label: "Progress",
      color: "#7c4ef5",
    },
    {
      icon:  <Clock size={18} />,
      value: totalMins >= 60
        ? `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`
        : `${totalMins}m`,
      label: "Time Learned",
      color: "#34d399",
    },
    {
      icon:  <Flame size={18} />,
      value: completed * 50,
      label: "XP Earned",
      color: "#f59e0b",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-4 rounded-2xl border"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
              style={{ background: s.color + "15", color: s.color }}
            >
              {s.icon}
            </div>
            <p
              className="text-xl font-bold font-display"
              style={{ color: s.color }}
            >
              {s.value}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div
        className="p-4 rounded-2xl border"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <div className="flex justify-between text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>
          <span>Overall Progress</span>
          <span style={{ color: "var(--color-primary)" }}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #0090f0, #7c4ef5)" }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
