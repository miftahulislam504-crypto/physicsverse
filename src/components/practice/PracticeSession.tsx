"use client";

// src/components/practice/PracticeSession.tsx
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { QuestionCard } from "./QuestionCard";
import { usePractice } from "@/lib/hooks/usePractice";
import { DOMAIN_META } from "@/lib/utils";
import type { Question } from "@/lib/constants/practice-data";

interface PracticeSessionProps {
  questions:  Question[];
  title:      string;
  timed?:     boolean;
  timeLimit?: number;   // minutes
  onComplete?: (results: SessionResult) => void;
}

export interface SessionResult {
  total:      number;
  correct:    number;
  incorrect:  number;
  skipped:    number;
  timeTaken:  number;  // seconds
  accuracy:   number;
  xpEarned:   number;
}

export function PracticeSession({
  questions, title, timed = false, timeLimit = 30, onComplete,
}: PracticeSessionProps) {
  const { recordAttempt } = usePractice();
  const [currentIdx,  setCurrentIdx]  = useState(0);
  const [answers,     setAnswers]     = useState<Record<number, boolean>>({});
  const [finished,    setFinished]    = useState(false);
  const [startTime]                   = useState(Date.now());
  const [timeLeft,    setTimeLeft]    = useState(timed ? timeLimit * 60 : 0);

  const current = questions[currentIdx];

  // Timer
  useEffect(() => {
    if (!timed || finished) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); handleFinish(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timed, finished]);

  const handleAnswer = useCallback(async (correct: boolean) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: correct }));
    await recordAttempt(current.id, correct);
  }, [currentIdx, current?.id, recordAttempt]);

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = useCallback(() => {
    setFinished(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const total     = questions.length;
    const correct   = Object.values(answers).filter(Boolean).length;
    const incorrect = Object.values(answers).filter((v) => !v).length;
    const skipped   = total - Object.keys(answers).length;
    const accuracy  = total > 0 ? Math.round((correct / total) * 100) : 0;
    const xpEarned  = correct * 20 + (accuracy >= 80 ? 50 : 0);

    const result: SessionResult = { total, correct, incorrect, skipped, timeTaken, accuracy, xpEarned };
    onComplete?.(result);
  }, [answers, questions.length, startTime, onComplete]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const isAnswered = currentIdx in answers;

  if (finished) {
    const total    = questions.length;
    const correct  = Object.values(answers).filter(Boolean).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const xp       = correct * 20 + (accuracy >= 80 ? 50 : 0);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border p-8 text-center space-y-6"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        >
          <Trophy size={48} className="mx-auto" style={{ color: accuracy >= 70 ? "#f59e0b" : "var(--color-text-muted)" }} />
        </motion.div>

        <div>
          <h2 className="text-2xl font-display font-bold" style={{ color: "var(--color-text-primary)" }}>
            Session Complete!
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>{title}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Correct",   value: correct,           color: "#22c55e", icon: <CheckCircle2 size={16} /> },
            { label: "Wrong",     value: total - correct,   color: "#ef4444", icon: <XCircle size={16} /> },
            { label: "Accuracy",  value: `${accuracy}%`,    color: "#0090f0", icon: null },
            { label: "XP Earned", value: `+${xp}`,          color: "#f59e0b", icon: null },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border text-center"
              style={{ background: "var(--color-surface-2)", borderColor: `${s.color}25` }}>
              <div className="flex items-center justify-center gap-1 mb-1" style={{ color: s.color }}>
                {s.icon}
              </div>
              <p className="text-xl font-bold font-display" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
          <Clock size={14} />
          Time taken: {formatTime(timeTaken)}
        </div>

        {/* Per-question review */}
        <div className="text-left space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
            Question Review
          </p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => {
              const ans = answers[i];
              const dom = DOMAIN_META[q.domain];
              return (
                <div
                  key={i}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{
                    background: ans === undefined
                      ? "var(--color-surface-2)"
                      : ans ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.12)",
                    color: ans === undefined
                      ? "var(--color-text-muted)"
                      : ans ? "#22c55e" : "#ef4444",
                    border: `1px solid ${ans === undefined ? "var(--color-border)" : ans ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                  }}
                  title={`Q${i + 1}: ${q.question.slice(0, 40)}...`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setCurrentIdx(0);
              setAnswers({});
              setFinished(false);
              setTimeLeft(timed ? timeLimit * 60 : 0);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all hover:scale-105"
            style={{ background: "var(--color-surface-2)", color: "var(--color-text-secondary)", borderColor: "var(--color-border)" }}
          >
            <RotateCcw size={15} /> Try Again
          </button>
          <button
            onClick={() => window.location.href = "/practice"}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
            style={{ background: "var(--color-primary)" }}
          >
            More Practice <ArrowRight size={15} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Progress header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span style={{ color: "var(--color-text-muted)" }}>
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span style={{ color: "var(--color-text-muted)" }}>
              {Object.values(answers).filter(Boolean).length} correct
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #0090f0, #7c4ef5)" }}
              animate={{ width: `${((currentIdx + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Timer */}
        {timed && (
          <div
            className="flex items-center gap-1.5 text-sm font-mono px-3 py-1.5 rounded-xl"
            style={{
              background:  timeLeft < 60 ? "rgba(239,68,68,0.12)" : "var(--color-surface)",
              color:       timeLeft < 60 ? "#ef4444" : "var(--color-text-secondary)",
              border:      "1px solid var(--color-border)",
            }}
          >
            <Clock size={13} />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <QuestionCard
            question={current}
            onAnswer={handleAnswer}
            showNumber={currentIdx + 1}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 rounded-xl text-sm border transition-all hover:scale-105 disabled:opacity-30"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
        >
          ← Prev
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
          style={{ background: "var(--color-primary)" }}
        >
          {currentIdx === questions.length - 1 ? "Finish" : "Next"} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
