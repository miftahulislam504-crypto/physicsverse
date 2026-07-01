"use client";

// src/components/physics/ChapterCard.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { type ChapterMeta } from "@/lib/constants/chapters-data";
import { DOMAIN_META, DIFFICULTY_META, formatReadTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ChapterCardProps {
  chapter: ChapterMeta;
  index?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  compact?: boolean;
}

export function ChapterCard({
  chapter,
  index = 0,
  isCompleted = false,
  isLocked = false,
  compact = false,
}: ChapterCardProps) {
  const domain     = DOMAIN_META[chapter.domain];
  const difficulty = DIFFICULTY_META[chapter.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      <Link
        href={isLocked ? "#" : `/learn/${chapter.slug}`}
        className={cn(
          "group block rounded-2xl border transition-all duration-200",
          compact ? "p-3" : "p-5",
          isLocked && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
        style={{
          background:  "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
        onMouseEnter={(e) => {
          if (isLocked) return;
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = domain.color + "45";
          el.style.boxShadow   = `0 4px 20px ${domain.color}12`;
          el.style.transform   = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--color-border)";
          el.style.boxShadow   = "none";
          el.style.transform   = "translateY(0)";
        }}
      >
        <div className="flex items-start gap-3">
          {/* Domain icon */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ background: domain.color + "15" }}
          >
            {isCompleted
              ? <CheckCircle2 size={18} style={{ color: "#22c55e" }} />
              : <span>{domain.icon}</span>
            }
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className="text-sm font-semibold font-display leading-snug"
                style={{ color: "var(--color-text-primary)" }}
              >
                {chapter.title}
              </h3>
              <ArrowRight
                size={15}
                className="flex-shrink-0 transition-transform group-hover:translate-x-1 mt-0.5"
                style={{ color: domain.color, opacity: 0.7 }}
              />
            </div>

            {!compact && (
              <p
                className="text-xs mt-1 leading-relaxed line-clamp-2"
                style={{ color: "var(--color-text-muted)" }}
              >
                {chapter.description}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* Difficulty */}
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: difficulty.color + "15",
                  color:      difficulty.color,
                }}
              >
                {difficulty.label}
              </span>

              {/* Read time */}
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                <Clock size={11} />
                {formatReadTime(chapter.estimatedMinutes)}
              </span>

              {/* Domain badge */}
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: domain.color + "12",
                  color:      domain.color,
                }}
              >
                {domain.label}
              </span>

              {/* Formulas count */}
              {chapter.formulas.length > 0 && (
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <Star size={10} />
                  {chapter.formulas.length} formula{chapter.formulas.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
