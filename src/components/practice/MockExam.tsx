"use client";

// src/components/practice/MockExam.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import { PracticeSession } from "./PracticeSession";
import { ALL_QUESTIONS, MOCK_PAPERS, getQuestionById } from "@/lib/constants/practice-data";

export function MockExam() {
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const [started,       setStarted]       = useState(false);
  const [result,        setResult]        = useState<any>(null);

  if (started && selectedPaper) {
    const paper     = MOCK_PAPERS[selectedPaper];
    const questions = paper.questionIds.map(getQuestionById).filter(Boolean) as typeof ALL_QUESTIONS;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm"
          style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)" }}>
          <Clock size={14} style={{ color: "#ef4444" }} />
          <span style={{ color: "#ef4444" }}>
            {paper.title} — {paper.duration} minutes — {questions.length} questions
          </span>
        </div>

        <PracticeSession
          questions={questions}
          title={paper.title}
          timed
          timeLimit={paper.duration}
          onComplete={(r) => { setResult(r); setStarted(false); }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Choose a mock exam paper. Timer starts when you begin.
      </p>

      <div className="space-y-3">
        {Object.entries(MOCK_PAPERS).map(([id, paper]) => {
          const qs = paper.questionIds.map(getQuestionById).filter(Boolean);
          const isSelected = selectedPaper === id;

          return (
            <motion.button
              key={id}
              onClick={() => setSelectedPaper(id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all"
              style={{
                background:  isSelected ? "rgba(0,144,240,0.08)" : "var(--color-surface)",
                borderColor: isSelected ? "rgba(0,144,240,0.4)" : "var(--color-border)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: isSelected ? "rgba(0,144,240,0.15)" : "var(--color-surface-2)" }}>
                  📝
                </div>
                <div>
                  <p className="text-sm font-semibold"
                    style={{ color: isSelected ? "var(--color-primary)" : "var(--color-text-primary)" }}>
                    {paper.title}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                      <Clock size={10} /> {paper.duration} min
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                      <BookOpen size={10} /> {qs.length} questions
                    </span>
                  </div>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${isSelected ? "bg-primary-500" : ""}`}
                style={{ borderColor: isSelected ? "var(--color-primary)" : "var(--color-border)",
                         background:  isSelected ? "var(--color-primary)" : "transparent" }} />
            </motion.button>
          );
        })}
      </div>

      {selectedPaper && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setStarted(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:scale-[1.01]"
          style={{
            background: "linear-gradient(135deg, #0090f0, #7c4ef5)",
            boxShadow:  "0 4px 16px rgba(0,144,240,0.25)",
          }}
        >
          Start Exam <ArrowRight size={16} />
        </motion.button>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-2xl border"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
            Last Exam Result
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Score",    value: `${result.correct}/${result.total}`, color: "var(--color-primary)" },
              { label: "Accuracy", value: `${result.accuracy}%`,              color: result.accuracy >= 70 ? "#22c55e" : "#ef4444" },
              { label: "XP",       value: `+${result.xpEarned}`,              color: "#f59e0b" },
            ].map((s) => (
              <div key={s.label} className="py-2">
                <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
