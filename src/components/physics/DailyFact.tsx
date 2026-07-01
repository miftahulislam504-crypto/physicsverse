"use client";

// src/components/physics/DailyFact.tsx
import { motion } from "framer-motion";
import { Sparkles, Share2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { DAILY_FACTS, getDailyFact } from "@/lib/constants/physics-data";
import { DOMAIN_META } from "@/lib/utils";
import { useStore } from "@/lib/store";

export function DailyFact() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    return new Date().getDate() % DAILY_FACTS.length;
  });
  const { addToast } = useStore();

  const fact = DAILY_FACTS[currentIndex];
  const meta = DOMAIN_META[fact.domain];

  function nextFact() {
    setCurrentIndex((i) => (i + 1) % DAILY_FACTS.length);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: "Physics Fact — PhysicsVerse",
        text: fact.fact,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(fact.fact);
      addToast({ type: "success", message: "Copied to clipboard!" });
    }
  }

  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl border p-5"
      style={{
        background: `linear-gradient(135deg, ${meta.color}14, ${meta.color}06)`,
        borderColor: meta.color + "30",
      }}
    >
      {/* Decorative glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${meta.color}18, transparent 70%)` }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: meta.color + "20" }}
          >
            {meta.icon}
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: meta.color }}>
              Today&apos;s Physics Fact
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {meta.label}
            </p>
          </div>
        </div>
        <Sparkles size={16} style={{ color: meta.color, opacity: 0.7 }} />
      </div>

      {/* Fact text */}
      <p
        className="text-sm leading-relaxed relative z-10"
        style={{ color: "var(--color-text-primary)" }}
      >
        {fact.fact}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: "var(--color-text-muted)" }}
        >
          <Share2 size={12} /> Share
        </button>
        <button
          onClick={nextFact}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: "var(--color-text-muted)" }}
        >
          <RefreshCw size={12} /> Next fact
        </button>
      </div>
    </motion.div>
  );
}
