"use client";

// src/app/practice/PracticeClient.tsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Zap, Clock, BookOpen, BarChart2, RefreshCw,
} from "lucide-react";
import {
  ALL_QUESTIONS, getQuestionsByDomain, getQuestionsByLevel,
  getQuestionsByType, type ExamLevel, type QuestionType,
} from "@/lib/constants/practice-data";
import { DOMAIN_NODES } from "@/lib/constants/physics-data";
import { DOMAIN_META } from "@/lib/utils";
import { TabBar, SectionHeader, Badge } from "@/components/ui";
import { QuestionCard }    from "@/components/practice/QuestionCard";
import { PracticeSession } from "@/components/practice/PracticeSession";
import { DailyChallenge }  from "@/components/practice/DailyChallenge";
import { MockExam }        from "@/components/practice/MockExam";
import { usePractice }     from "@/lib/hooks/usePractice";
import type { PhysicsDomain } from "@/types";

const TABS = [
  { id: "browse",    label: "Browse",    icon: <BookOpen  size={13} /> },
  { id: "daily",     label: "Daily",     icon: <Zap       size={13} /> },
  { id: "session",   label: "Session",   icon: <Target    size={13} /> },
  { id: "mock",      label: "Mock Exam", icon: <Clock     size={13} /> },
  { id: "stats",     label: "My Stats",  icon: <BarChart2 size={13} /> },
] as const;

type TabId = typeof TABS[number]["id"];

// ─── Browse Tab ───────────────────────────────────────────────────────────────
function BrowseTab() {
  const [domain,     setDomain]     = useState<PhysicsDomain | "all">("all");
  const [level,      setLevel]      = useState<ExamLevel | "all">("all");
  const [type,       setType]       = useState<QuestionType | "all">("all");
  const [page,       setPage]       = useState(0);
  const PER_PAGE = 5;

  const filtered = useMemo(() => {
    return ALL_QUESTIONS.filter((q) => {
      const d = domain === "all" || q.domain === domain;
      const l = level  === "all" || q.examLevels.includes(level as ExamLevel);
      const t = type   === "all" || q.type === type;
      return d && l && t;
    });
  }, [domain, level, type]);

  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div
        className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        {/* Domain */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}>Domain</p>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => { setDomain("all"); setPage(0); }}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{ background: domain === "all" ? "var(--color-primary)" : "var(--color-surface-2)",
                       color:  domain === "all" ? "#fff" : "var(--color-text-muted)" }}>
              All
            </button>
            {DOMAIN_NODES.filter((d) => getQuestionsByDomain(d.id).length > 0).map((d) => (
              <button key={d.id} onClick={() => { setDomain(d.id); setPage(0); }}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  background:  domain === d.id ? d.color + "22" : "var(--color-surface-2)",
                  color:       domain === d.id ? d.color : "var(--color-text-muted)",
                  border:      `1px solid ${domain === d.id ? d.color + "40" : "transparent"}`,
                }}>
                {d.icon} {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Level + Type */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}>Exam Level</p>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "ssc", "hsc", "admission", "olympiad"] as const).map((l) => (
                <button key={l} onClick={() => { setLevel(l); setPage(0); }}
                  className="px-2.5 py-1 rounded-full text-xs capitalize transition-all"
                  style={{
                    background:  level === l ? "rgba(0,144,240,0.15)" : "var(--color-surface-2)",
                    color:       level === l ? "var(--color-primary)" : "var(--color-text-muted)",
                  }}>
                  {l === "all" ? "All" : l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}>Type</p>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "mcq", "numerical", "conceptual"] as const).map((t) => (
                <button key={t} onClick={() => { setType(t); setPage(0); }}
                  className="px-2.5 py-1 rounded-full text-xs capitalize transition-all"
                  style={{
                    background:  type === t ? "rgba(124,78,245,0.15)" : "var(--color-surface-2)",
                    color:       type === t ? "#7c4ef5" : "var(--color-text-muted)",
                  }}>
                  {t === "all" ? "All" : t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        {filtered.length} question{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Questions */}
      <div className="space-y-4">
        {paginated.map((q, i) => (
          <QuestionCard key={q.id} question={q} showNumber={page * PER_PAGE + i + 1} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
            className="px-4 py-2 rounded-xl text-sm border transition-all disabled:opacity-30 hover:scale-105"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
            ← Prev
          </button>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {page + 1} / {totalPages}
          </span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="px-4 py-2 rounded-xl text-sm border transition-all disabled:opacity-30 hover:scale-105"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Session Tab ──────────────────────────────────────────────────────────────
function SessionTab() {
  const [level, setLevel]   = useState<ExamLevel | null>(null);
  const [started, setStarted] = useState(false);
  const [result, setResult]   = useState<any>(null);

  const sessionQ = useMemo(() => {
    if (!level) return [];
    const qs = getQuestionsByLevel(level);
    return qs.sort(() => Math.random() - 0.5).slice(0, 10);
  }, [level]);

  if (started && sessionQ.length > 0) {
    return (
      <PracticeSession
        questions={sessionQ}
        title={`${level?.toUpperCase()} Practice Session`}
        onComplete={(r) => { setResult(r); setStarted(false); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Pick a level and start a 10-question practice session.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {([
          { id: "ssc",      label: "SSC",              color: "#22c55e", icon: "📘" },
          { id: "hsc",      label: "HSC",              color: "#0090f0", icon: "📗" },
          { id: "admission",label: "University Admission", color: "#f59e0b", icon: "🎯" },
          { id: "olympiad", label: "Physics Olympiad", color: "#a78bfa", icon: "🏆" },
        ] as const).map((l) => (
          <motion.button key={l.id}
            onClick={() => setLevel(l.id)}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all"
            style={{
              background:  level === l.id ? l.color + "15" : "var(--color-surface)",
              borderColor: level === l.id ? l.color + "50" : "var(--color-border)",
            }}>
            <span className="text-2xl">{l.icon}</span>
            <span className="text-sm font-semibold" style={{ color: level === l.id ? l.color : "var(--color-text-primary)" }}>
              {l.label}
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {getQuestionsByLevel(l.id).length} questions
            </span>
          </motion.button>
        ))}
      </div>

      {level && (
        <motion.button
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => setStarted(true)}
          className="w-full py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:scale-[1.01]"
          style={{ background: "linear-gradient(135deg, #0090f0, #7c4ef5)", boxShadow: "0 4px 16px rgba(0,144,240,0.25)" }}>
          Start 10-Question Session →
        </motion.button>
      )}
    </div>
  );
}

// ─── Stats Tab ────────────────────────────────────────────────────────────────
function StatsTab() {
  const { totalSolved, totalCorrect, accuracy, dueForReview, loading } = usePractice();

  if (loading) return <div className="text-center py-10" style={{ color: "var(--color-text-muted)" }}>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Attempted",   value: totalSolved,             color: "var(--color-primary)" },
          { label: "Correct",     value: totalCorrect,            color: "#22c55e" },
          { label: "Accuracy",    value: `${accuracy}%`,          color: "#f59e0b" },
          { label: "Due Review",  value: dueForReview.length,     color: "#ef4444" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl border text-center"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <p className="text-2xl font-bold font-display" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {dueForReview.length > 0 && (
        <div className="p-4 rounded-2xl border" style={{ background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}>
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw size={14} style={{ color: "#ef4444" }} />
            <p className="text-sm font-semibold" style={{ color: "#ef4444" }}>
              {dueForReview.length} question{dueForReview.length > 1 ? "s" : ""} due for review
            </p>
          </div>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            These are questions you got wrong earlier. Reviewing them boosts retention.
          </p>
        </div>
      )}

      {totalSolved === 0 && (
        <div className="text-center py-12">
          <p className="text-3xl mb-2">📊</p>
          <p style={{ color: "var(--color-text-secondary)" }}>No attempts yet. Start practicing!</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Practice Client ─────────────────────────────────────────────────────
export function PracticeClient() {
  const [tab, setTab] = useState<TabId>("browse");

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-primary)" }}>Phase 5</p>
          <h1 className="text-4xl font-display font-bold mt-1"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.03em" }}>
            Practice Zone
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            {ALL_QUESTIONS.length} questions — MCQ, Numerical, Conceptual, Olympiad
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center">
          <TabBar tabs={TABS} active={tab} onChange={(id) => setTab(id as TabId)} />
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "browse"  && <BrowseTab />}
            {tab === "daily"   && <DailyChallenge />}
            {tab === "session" && <SessionTab />}
            {tab === "mock"    && <MockExam />}
            {tab === "stats"   && <StatsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
