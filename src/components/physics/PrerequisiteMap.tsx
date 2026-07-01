"use client";

// src/components/physics/PrerequisiteMap.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { getPrerequisiteChapters, type ChapterMeta } from "@/lib/constants/chapters-data";
import { DOMAIN_META } from "@/lib/utils";

interface PrerequisiteMapProps {
  chapter: ChapterMeta;
  completedIds?: string[];
}

export function PrerequisiteMap({ chapter, completedIds = [] }: PrerequisiteMapProps) {
  const prereqs = getPrerequisiteChapters(chapter);

  if (prereqs.length === 0) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm"
        style={{
          background:  "rgba(34,197,94,0.08)",
          borderColor: "rgba(34,197,94,0.25)",
          color:       "#22c55e",
        }}
      >
        <CheckCircle2 size={15} />
        No prerequisites — this is a great starting point!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
        Prerequisites
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {prereqs.map((pre, i) => {
          const meta      = DOMAIN_META[pre.domain];
          const isDone    = completedIds.includes(pre.id);

          return (
            <motion.div
              key={pre.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2"
            >
              <Link
                href={`/learn/${pre.slug}`}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all hover:scale-105"
                style={{
                  background:  isDone ? "rgba(34,197,94,0.08)" : meta.color + "10",
                  borderColor: isDone ? "rgba(34,197,94,0.3)"  : meta.color + "30",
                  color:       isDone ? "#22c55e" : meta.color,
                }}
              >
                {isDone
                  ? <CheckCircle2 size={13} />
                  : <Lock size={13} />
                }
                <span>{meta.icon} {pre.title}</span>
              </Link>
              {i < prereqs.length - 1 && (
                <ArrowRight size={14} style={{ color: "var(--color-text-muted)" }} />
              )}
            </motion.div>
          );
        })}

        <ArrowRight size={14} style={{ color: "var(--color-text-muted)" }} />

        {/* Current chapter */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium"
          style={{
            background:  "var(--color-primary-subtle)",
            borderColor: "rgba(0,144,240,0.35)",
            color:       "var(--color-primary)",
          }}
        >
          {DOMAIN_META[chapter.domain].icon} {chapter.title}
        </div>
      </div>
    </div>
  );
}
