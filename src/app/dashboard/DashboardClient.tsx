"use client";

// src/app/dashboard/DashboardClient.tsx
import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Flame, BookCheck, FlaskConical, Target, ArrowRight,
  Star, TrendingUp, Bookmark, Award,
} from "lucide-react";
import { useUser } from "@/lib/store";
import { useProgress } from "@/lib/hooks/useProgress";
import { usePractice } from "@/lib/hooks/usePractice";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { ALL_CHAPTERS } from "@/lib/constants/chapters-data";
import { LAB_EXPERIMENTS } from "@/lib/constants/lab-data";
import { DOMAIN_META, xpToNextLevel, LEVEL_META } from "@/lib/utils";

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: color + "15", color }}>
        {icon}
      </div>
      <p className="text-2xl font-bold font-display" style={{ color }}>{value}</p>
      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{label}</p>
    </motion.div>
  );
}

export function DashboardClient() {
  const user      = useUser();
  const { completedIds, loading: progLoading } = useProgress();
  const { totalSolved, totalCorrect, accuracy } = usePractice();
  const { bookmarks } = useBookmarks();

  // Calculate XP and level
  const chapterXP = completedIds.length * 50;
  const practiceXP = totalCorrect * 20;
  const totalXP = chapterXP + practiceXP;
  const { current, next, progress } = xpToNextLevel(totalXP);
  const levelMeta = LEVEL_META[current];

  // Weak topics (domains with low completion)
  const domainStats = useMemo(() => {
    const map = new Map<string, { total: number; done: number }>();
    for (const ch of ALL_CHAPTERS) {
      const cur = map.get(ch.domain) ?? { total: 0, done: 0 };
      cur.total++;
      if (completedIds.includes(ch.id)) cur.done++;
      map.set(ch.domain, cur);
    }
    return Array.from(map.entries())
      .map(([domain, stats]) => ({ domain, ...stats, pct: stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0 }))
      .sort((a, b) => a.pct - b.pct);
  }, [completedIds]);

  // Recommended next chapter
  const recommended = ALL_CHAPTERS.find((c) => !completedIds.includes(c.id) && c.prerequisites.every((p) => completedIds.includes(p)));

  // Continue learning (last incomplete domain with progress)
  const continueChapter = ALL_CHAPTERS.find((c) => !completedIds.includes(c.id));

  const totalChapters = ALL_CHAPTERS.length;
  const totalLabs      = LAB_EXPERIMENTS.length;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>
              Phase 14
            </p>
            <h1 className="text-4xl font-display font-bold mt-1"
              style={{ color: "var(--color-text-primary)", letterSpacing: "-0.03em" }}>
              {user ? `Welcome back, ${user.displayName?.split(" ")[0]}!` : "My Dashboard"}
            </h1>
          </div>

          {/* Level badge */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
            style={{ background: levelMeta.color + "10", borderColor: levelMeta.color + "30" }}>
            <span className="text-2xl">{levelMeta.icon}</span>
            <div>
              <p className="text-sm font-bold" style={{ color: levelMeta.color }}>{levelMeta.label}</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{totalXP} XP</p>
            </div>
          </div>
        </motion.div>

        {/* Level progress bar */}
        {next && (
          <div className="p-4 rounded-2xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <div className="flex justify-between text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>
              <span>{levelMeta.icon} {LEVEL_META[current].label}</span>
              <span>{progress}% to {LEVEL_META[next].icon} {LEVEL_META[next].label}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
              <motion.div className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${levelMeta.color}, ${LEVEL_META[next].color})` }}
                initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} />
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={<BookCheck size={16} />} label="Chapters Done" value={`${completedIds.length}/${totalChapters}`} color="#0090f0" />
          <StatCard icon={<Target size={16} />}    label="Problems Solved" value={totalSolved} color="#22c55e" />
          <StatCard icon={<TrendingUp size={16} />} label="Accuracy"       value={`${accuracy}%`} color="#f59e0b" />
          <StatCard icon={<Bookmark size={16} />}   label="Bookmarks"      value={bookmarks.length} color="#a78bfa" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left: Continue + Recommended */}
          <div className="lg:col-span-2 space-y-6">

            {/* Continue Learning */}
            {continueChapter && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                  Continue Learning
                </p>
                <Link href={`/learn/${continueChapter.slug}`}
                  className="flex items-center justify-between p-5 rounded-2xl border transition-all hover:scale-[1.01]"
                  style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{DOMAIN_META[continueChapter.domain].icon}</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{continueChapter.title}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{continueChapter.estimatedMinutes} min · {DOMAIN_META[continueChapter.domain].label}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--color-primary)" }} />
                </Link>
              </div>
            )}

            {/* Recommended for you */}
            {recommended && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                  AI Recommended — What to study today
                </p>
                <Link href={`/learn/${recommended.slug}`}
                  className="flex items-center justify-between p-5 rounded-2xl border transition-all hover:scale-[1.01]"
                  style={{ background: "rgba(124,78,245,0.06)", borderColor: "rgba(124,78,245,0.25)" }}>
                  <div className="flex items-center gap-3">
                    <Star size={20} style={{ color: "#7c4ef5" }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{recommended.title}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        All prerequisites complete — ready for you
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={16} style={{ color: "#7c4ef5" }} />
                </Link>
              </div>
            )}

            {/* Domain progress breakdown */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                Progress by Domain
              </p>
              <div className="space-y-2">
                {domainStats.map((d) => {
                  const meta = DOMAIN_META[d.domain as keyof typeof DOMAIN_META];
                  return (
                    <div key={d.domain} className="p-3 rounded-xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: "var(--color-text-secondary)" }}>
                          {meta.icon} {meta.label}
                        </span>
                        <span className="text-xs" style={{ color: meta.color }}>{d.done}/{d.total}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
                        <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: meta.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Bookmarks + Achievements */}
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                Recent Bookmarks
              </p>
              {bookmarks.length === 0 ? (
                <div className="p-4 rounded-2xl border text-center" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                  <Bookmark size={20} className="mx-auto mb-2" style={{ color: "var(--color-text-muted)", opacity: 0.5 }} />
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No bookmarks yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bookmarks.slice(0, 5).map((b) => (
                    <div key={b.id} className="p-3 rounded-xl text-xs" style={{ background: "var(--color-surface)" }}>
                      <p style={{ color: "var(--color-text-primary)" }}>{b.title}</p>
                      <p style={{ color: "var(--color-text-muted)" }}>{b.type}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Achievement badges */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                Achievements
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: "📖", label: "First Chapter", unlocked: completedIds.length >= 1 },
                  { icon: "🎯", label: "10 Problems",    unlocked: totalSolved >= 10 },
                  { icon: "🔥", label: "5 Chapters",     unlocked: completedIds.length >= 5 },
                  { icon: "💯", label: "90% Accuracy",   unlocked: accuracy >= 90 },
                  { icon: "🧪", label: "Lab Explorer",   unlocked: false },
                  { icon: "⭐", label: "Bookworm",       unlocked: bookmarks.length >= 5 },
                ].map((badge) => (
                  <div key={badge.label}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl text-center"
                    style={{
                      background: badge.unlocked ? "rgba(245,158,11,0.1)" : "var(--color-surface)",
                      opacity:    badge.unlocked ? 1 : 0.4,
                    }}>
                    <span className="text-xl">{badge.icon}</span>
                    <span className="text-xs" style={{ color: badge.unlocked ? "#f59e0b" : "var(--color-text-muted)" }}>
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
