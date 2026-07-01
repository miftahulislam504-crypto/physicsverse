"use client";

// src/components/practice/DailyChallenge.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Zap } from "lucide-react";
import { QuestionCard } from "./QuestionCard";
import { getDailyChallenge } from "@/lib/constants/practice-data";
import { usePractice } from "@/lib/hooks/usePractice";

export function DailyChallenge() {
  const { recordAttempt, getAttempt } = usePractice();
  const challenge  = getDailyChallenge();
  const attempt    = getAttempt(challenge.id);
  const [done, setDone] = useState(!!attempt);
  const [correct, setCorrect] = useState(attempt?.correct ?? null as boolean | null);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  async function handleAnswer(isCorrect: boolean) {
    await recordAttempt(challenge.id, isCorrect);
    setDone(true);
    setCorrect(isCorrect);
  }

  return (
    <div className="space-y-4">
      {/* Header banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-5 py-4 rounded-2xl border"
        style={{
          background:  "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.08))",
          borderColor: "rgba(245,158,11,0.3)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "rgba(245,158,11,0.2)" }}>
            🎯
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#f59e0b" }}>
              Daily Challenge
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{today}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs"
            style={{ color: "#f97316" }}>
            <Flame size={14} />
            <span className="font-bold">+30 XP</span>
          </div>
          {done && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: correct ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.1)" }}>
              {correct ? "✓" : "✗"}
            </div>
          )}
        </div>
      </motion.div>

      {/* The question */}
      <QuestionCard
        question={challenge}
        onAnswer={handleAnswer}
        initialRevealed={done}
      />

      {/* Completion message */}
      {done && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm"
          style={{
            background:  correct ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
            borderColor: correct ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)",
          }}
        >
          {correct
            ? <><Zap size={16} style={{ color: "#f59e0b" }} />
                <span style={{ color: "var(--color-text-secondary)" }}>
                  Excellent! <strong style={{ color: "#22c55e" }}>+30 XP</strong> earned. Come back tomorrow for the next challenge!
                </span>
              </>
            : <><span style={{ color: "var(--color-text-secondary)" }}>
                Not quite — but you'll get it next time! Review the solution above.
              </span>
              </>
          }
        </motion.div>
      )}
    </div>
  );
}
