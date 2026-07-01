"use client";

// src/components/physics/PhysicsTimeline.tsx
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { TIMELINE_EVENTS, type TimelineEvent } from "@/lib/constants/physics-data";
import { DOMAIN_META } from "@/lib/utils";
import type { PhysicsDomain } from "@/types";

const SIGNIFICANCE_SIZE = {
  major:         { dot: 10, ring: 18, label: "Discovery"    },
  landmark:      { dot: 14, ring: 24, label: "Landmark"     },
  revolutionary: { dot: 18, ring: 30, label: "Revolutionary" },
};

// ─── Filter Bar ───────────────────────────────────────────────────────────────
const FILTER_DOMAINS: (PhysicsDomain | "all")[] = [
  "all", "mechanics", "electricity", "magnetism",
  "waves", "optics", "thermodynamics", "modern",
  "quantum", "relativity", "astrophysics",
];

function FilterBar({
  active,
  onChange,
}: {
  active: PhysicsDomain | "all";
  onChange: (v: PhysicsDomain | "all") => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {FILTER_DOMAINS.map((d) => {
        const meta = d !== "all" ? DOMAIN_META[d] : null;
        const isActive = active === d;
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: isActive
                ? meta ? meta.color + "25" : "var(--color-primary-subtle)"
                : "var(--color-surface)",
              color: isActive
                ? meta ? meta.color : "var(--color-primary)"
                : "var(--color-text-muted)",
              border: `1px solid ${isActive ? (meta?.color ?? "var(--color-primary)") + "40" : "var(--color-border)"}`,
            }}
          >
            {meta ? `${meta.icon} ${meta.label}` : "All Domains"}
          </button>
        );
      })}
    </div>
  );
}

// ─── Event detail modal ───────────────────────────────────────────────────────
function EventModal({
  event,
  onClose,
}: {
  event: TimelineEvent;
  onClose: () => void;
}) {
  const meta = DOMAIN_META[event.domain];
  const sig  = SIGNIFICANCE_SIZE[event.significance];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative max-w-md w-full rounded-2xl border p-6"
        style={{
          background:  "var(--color-surface)",
          borderColor: meta.color + "40",
          boxShadow:   `0 0 40px ${meta.color}20`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-2)]"
        >
          <X size={16} style={{ color: "var(--color-text-muted)" }} />
        </button>

        {/* Year badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-4"
          style={{ background: meta.color + "20", color: meta.color }}
        >
          <span>{meta.icon}</span>
          <span>{event.year}</span>
          <span className="text-xs font-normal opacity-70">{sig.label}</span>
        </div>

        <h3
          className="text-xl font-display font-semibold mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          {event.title}
        </h3>
        <p className="text-sm mb-3" style={{ color: meta.color }}>
          {event.scientist}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {event.description}
        </p>

        <div
          className="mt-4 pt-4 border-t flex items-center gap-2 text-xs"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
        >
          <span
            className="px-2 py-0.5 rounded-full"
            style={{ background: meta.color + "15", color: meta.color }}
          >
            {meta.label}
          </span>
          <span>Physics History</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Timeline ────────────────────────────────────────────────────────────
export function PhysicsTimeline() {
  const [filter, setFilter]   = useState<PhysicsDomain | "all">("all");
  const [selected, setSelected] = useState<TimelineEvent | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = filter === "all"
    ? TIMELINE_EVENTS
    : TIMELINE_EVENTS.filter((e) => e.domain === filter);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  }

  return (
    <div className="space-y-4">
      <FilterBar active={filter} onChange={setFilter} />

      <div className="relative">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:scale-110"
          style={{
            background:  "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow:   "var(--shadow-md)",
          }}
        >
          <ChevronLeft size={16} style={{ color: "var(--color-text-secondary)" }} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:scale-110"
          style={{
            background:  "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow:   "var(--shadow-md)",
          }}
        >
          <ChevronRight size={16} style={{ color: "var(--color-text-secondary)" }} />
        </button>

        {/* Timeline scroll container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto pb-4 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="relative flex items-center" style={{ minWidth: `${filtered.length * 160}px`, padding: "40px 60px" }}>
            {/* Horizontal line */}
            <div
              className="absolute left-0 right-0 h-px"
              style={{
                top: "50%",
                background: "linear-gradient(90deg, transparent, var(--color-border) 5%, var(--color-border) 95%, transparent)",
              }}
            />

            {/* Events */}
            {filtered.map((event, i) => {
              const meta = DOMAIN_META[event.domain];
              const sig  = SIGNIFICANCE_SIZE[event.significance];
              const above = i % 2 === 0;

              return (
                <div
                  key={event.id}
                  className="relative flex-shrink-0 flex flex-col items-center"
                  style={{ width: 150, margin: "0 5px" }}
                >
                  {/* Card — above or below the line */}
                  <motion.button
                    onClick={() => setSelected(event)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`absolute w-[136px] rounded-xl border p-2.5 text-left transition-all ${above ? "bottom-[calc(50%+16px)]" : "top-[calc(50%+16px)]"}`}
                    style={{
                      background:  "var(--color-surface)",
                      borderColor: meta.color + "30",
                      boxShadow:   "var(--shadow-sm)",
                    }}
                  >
                    <p
                      className="text-xs font-bold mb-0.5"
                      style={{ color: meta.color, fontFamily: "var(--font-display)" }}
                    >
                      {event.year}
                    </p>
                    <p
                      className="text-xs font-medium leading-tight"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {event.title}
                    </p>
                    <p
                      className="text-xs mt-1 truncate"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {event.scientist}
                    </p>
                  </motion.button>

                  {/* Dot on the line */}
                  <div className="relative" style={{ marginTop: 0 }}>
                    {/* Outer ring */}
                    <div
                      className="rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width:      sig.ring,
                        height:     sig.ring,
                        background: meta.color + "18",
                        border:     `1px solid ${meta.color}30`,
                      }}
                    />
                    {/* Inner dot */}
                    <div
                      className="rounded-full relative z-10"
                      style={{
                        width:      sig.dot,
                        height:     sig.dot,
                        background: meta.color,
                        boxShadow:  `0 0 8px ${meta.color}60`,
                        margin:     `${(sig.ring - sig.dot) / 2}px`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event count */}
      <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
        {filtered.length} events · Click any to learn more
      </p>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <EventModal event={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
