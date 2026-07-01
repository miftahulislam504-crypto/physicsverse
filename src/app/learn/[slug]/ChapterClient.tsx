"use client";

// src/app/learn/[slug]/ChapterClient.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Clock, CheckCircle2, BookmarkPlus, Share2,
  ChevronDown, ChevronUp, FlaskConical, AlertCircle, Star,
  Lightbulb, ArrowRight,
} from "lucide-react";
import { type ChapterMeta, ALL_CHAPTERS } from "@/lib/constants/chapters-data";
import { DOMAIN_META, DIFFICULTY_META, formatReadTime } from "@/lib/utils";
import { FormulaCard } from "@/components/physics/FormulaRenderer";
import { PrerequisiteMap } from "@/components/physics/PrerequisiteMap";
import { ChapterCard } from "@/components/physics/ChapterCard";
import { useStore } from "@/lib/store";

// ─── Section: Key Points ──────────────────────────────────────────────────────
function KeyPointsSection({ points }: { points: string[] }) {
  return (
    <div
      className="rounded-2xl border p-5 space-y-3"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center gap-2">
        <Star size={16} style={{ color: "#f59e0b" }} />
        <h2 className="text-base font-semibold font-display" style={{ color: "var(--color-text-primary)" }}>
          Key Points
        </h2>
      </div>
      <ul className="space-y-2">
        {points.map((point, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-2.5 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
              style={{ background: "var(--color-primary)" }}
            />
            {point}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

// ─── Section: Misconceptions ──────────────────────────────────────────────────
function MisconceptionsSection({ items }: { items: { wrong: string; correct: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div
      className="rounded-2xl border p-5 space-y-3"
      style={{ background: "var(--color-surface)", borderColor: "rgba(239,68,68,0.2)" }}
    >
      <div className="flex items-center gap-2">
        <AlertCircle size={16} style={{ color: "#ef4444" }} />
        <h2 className="text-base font-semibold font-display" style={{ color: "var(--color-text-primary)" }}>
          Common Misconceptions
        </h2>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "rgba(239,68,68,0.15)" }}
          >
            {/* Wrong belief — always visible */}
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex items-start justify-between w-full p-3 text-left gap-2"
              style={{ background: "rgba(239,68,68,0.06)" }}
            >
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold mt-0.5" style={{ color: "#ef4444" }}>✗</span>
                <p className="text-sm" style={{ color: "var(--color-text-primary)" }}>
                  {item.wrong}
                </p>
              </div>
              {open === i
                ? <ChevronUp size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                : <ChevronDown size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
              }
            </button>

            {/* Correct explanation */}
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-3 border-t"
                style={{
                  borderColor: "rgba(34,197,94,0.2)",
                  background:  "rgba(34,197,94,0.06)",
                }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold mt-0.5" style={{ color: "#22c55e" }}>✓</span>
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {item.correct}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Real World Examples ────────────────────────────────────────────
function RealWorldSection({ examples }: { examples: string[] }) {
  return (
    <div
      className="rounded-2xl border p-5 space-y-3"
      style={{ background: "var(--color-surface)", borderColor: "rgba(124,78,245,0.2)" }}
    >
      <div className="flex items-center gap-2">
        <Lightbulb size={16} style={{ color: "#7c4ef5" }} />
        <h2 className="text-base font-semibold font-display" style={{ color: "var(--color-text-primary)" }}>
          Real World Examples
        </h2>
      </div>
      <div className="space-y-2">
        {examples.map((ex, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{ background: "rgba(124,78,245,0.06)" }}
          >
            <span className="text-base mt-0.5">🌍</span>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {ex}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ChapterClient ───────────────────────────────────────────────────────
export function ChapterClient({ chapter }: { chapter: ChapterMeta }) {
  const domain     = DOMAIN_META[chapter.domain];
  const difficulty = DIFFICULTY_META[chapter.difficulty];
  const { addToast } = useStore();

  // Related chapters: same domain, not same chapter
  const related = ALL_CHAPTERS
    .filter((c) => c.domain === chapter.domain && c.id !== chapter.id)
    .slice(0, 4);

  function handleBookmark() {
    addToast({ type: "success", message: "Chapter bookmarked!" });
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    addToast({ type: "success", message: "Link copied!" });
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* ── Domain color top bar ── */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${domain.color}, ${domain.color}60)` }} />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* ── Back button ── */}
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-sm transition-colors hover:underline"
          style={{ color: "var(--color-text-muted)" }}
        >
          <ArrowLeft size={15} /> Back to Learn
        </Link>

        {/* ── Chapter header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Domain + difficulty badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: domain.color + "18", color: domain.color }}
            >
              {domain.icon} {domain.label}
            </span>
            <span
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: difficulty.color + "18", color: difficulty.color }}
            >
              {difficulty.label}
            </span>
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              <Clock size={12} /> {formatReadTime(chapter.estimatedMinutes)}
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-display font-bold leading-tight"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}
          >
            {chapter.title}
          </h1>

          <p className="text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            {chapter.description}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBookmark}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all hover:scale-105"
              style={{
                background:  "var(--color-surface)",
                borderColor: "var(--color-border)",
                color:       "var(--color-text-secondary)",
              }}
            >
              <BookmarkPlus size={15} /> Bookmark
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all hover:scale-105"
              style={{
                background:  "var(--color-surface)",
                borderColor: "var(--color-border)",
                color:       "var(--color-text-secondary)",
              }}
            >
              <Share2 size={15} /> Share
            </button>
            {chapter.relatedLabIds.length > 0 && (
              <Link
                href={`/lab?chapter=${chapter.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: domain.color + "18",
                  color:      domain.color,
                }}
              >
                <FlaskConical size={15} /> Try in Lab
              </Link>
            )}
          </div>
        </motion.div>

        {/* ── Prerequisite map ── */}
        <PrerequisiteMap chapter={chapter} />

        {/* ── Key Points ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <KeyPointsSection points={chapter.keyPoints} />
        </motion.div>

        {/* ── Formulas ── */}
        {chapter.formulas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-3"
          >
            <h2
              className="text-lg font-display font-semibold flex items-center gap-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              <span style={{ color: "var(--color-primary)" }}>∑</span> Key Formulas
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {chapter.formulas.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                >
                  <FormulaCard
                    name={f.name}
                    latex={f.latex}
                    description={f.description}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Misconceptions ── */}
        {chapter.misconceptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MisconceptionsSection items={chapter.misconceptions} />
          </motion.div>
        )}

        {/* ── Real World Examples ── */}
        {chapter.realWorldExamples.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <RealWorldSection examples={chapter.realWorldExamples} />
          </motion.div>
        )}

        {/* ── Mark complete button ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <button
            onClick={() => addToast({ type: "success", message: `"${chapter.title}" marked as complete!` })}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-105"
            style={{
              background:  "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow:   "0 4px 16px rgba(34,197,94,0.3)",
            }}
          >
            <CheckCircle2 size={17} /> Mark as Complete
          </button>
        </motion.div>

        {/* ── Related Chapters ── */}
        {related.length > 0 && (
          <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <h2
                className="text-lg font-display font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                More in {domain.label}
              </h2>
              <Link
                href={`/learn?domain=${chapter.domain}`}
                className="flex items-center gap-1 text-sm transition-colors"
                style={{ color: "var(--color-primary)" }}
              >
                View all <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((ch, i) => (
                <ChapterCard key={ch.id} chapter={ch} index={i} compact />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
