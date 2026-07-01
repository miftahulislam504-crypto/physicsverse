"use client";

// src/components/practice/QuestionCard.tsx
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2, XCircle, Lightbulb, BookOpen,
  ChevronDown, ChevronUp, ArrowRight,
} from "lucide-react";
import { FormulaRenderer } from "@/components/physics/FormulaRenderer";
import { DOMAIN_META, DIFFICULTY_META } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Question } from "@/lib/constants/practice-data";

interface QuestionCardProps {
  question:       Question;
  onAnswer?:      (correct: boolean) => void;
  showNumber?:    number;
  initialRevealed?: boolean;
}

export function QuestionCard({
  question, onAnswer, showNumber, initialRevealed = false,
}: QuestionCardProps) {
  const [selected,     setSelected]     = useState<string | null>(null);
  const [numInput,     setNumInput]     = useState("");
  const [revealed,     setRevealed]     = useState(initialRevealed);
  const [showHint,     setShowHint]     = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const domain = DOMAIN_META[question.domain];
  const diff   = DIFFICULTY_META[question.difficulty];

  const isAnswered = revealed || selected !== null || (question.type === "numerical" && numInput !== "");

  // Check numerical answer
  const checkNumerical = useCallback(() => {
    const userVal  = parseFloat(numInput);
    const correct  = parseFloat(question.correctAnswer);
    const tol      = question.tolerance ?? 2;
    const pctError = Math.abs((userVal - correct) / correct) * 100;
    return pctError <= tol;
  }, [numInput, question.correctAnswer, question.tolerance]);

  const handleMCQSelect = (optId: string) => {
    if (revealed) return;
    setSelected(optId);
    const correct = optId === question.correctAnswer;
    setRevealed(true);
    setShowSolution(true);
    onAnswer?.(correct);
  };

  const handleNumericalSubmit = () => {
    if (!numInput || revealed) return;
    const correct = checkNumerical();
    setRevealed(true);
    setShowSolution(true);
    onAnswer?.(correct);
  };

  const isCorrect = revealed && (
    question.type === "numerical"
      ? checkNumerical()
      : selected === question.correctAnswer
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background:  "var(--color-surface)",
        borderColor: revealed
          ? isCorrect ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"
          : "var(--color-border)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-start justify-between gap-3"
        style={{ borderColor: "var(--color-border)", background: domain.color + "06" }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {showNumber && (
            <span className="text-sm font-bold font-mono" style={{ color: domain.color }}>
              Q{showNumber}.
            </span>
          )}
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: domain.color + "18", color: domain.color }}
          >
            {domain.icon} {domain.label}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: diff.color + "15", color: diff.color }}
          >
            {diff.label}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full capitalize"
            style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}
          >
            {question.type === "mcq" ? "MCQ" : question.type === "numerical" ? "Numerical" : "Conceptual"}
          </span>
          {question.source && (
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {question.source}
            </span>
          )}
        </div>

        {/* Result badge */}
        {revealed && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-shrink-0"
          >
            {isCorrect
              ? <CheckCircle2 size={22} style={{ color: "#22c55e" }} />
              : <XCircle      size={22} style={{ color: "#ef4444" }} />
            }
          </motion.div>
        )}
      </div>

      {/* Question text */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
          {question.question}
        </p>
        {question.questionLatex && (
          <div className="mt-2">
            <FormulaRenderer latex={question.questionLatex} block />
          </div>
        )}
      </div>

      {/* Answer area */}
      <div className="px-5 pb-4 space-y-2">
        {/* MCQ options */}
        {(question.type === "mcq" || question.type === "conceptual") && question.options && (
          <div className="space-y-2 mt-2">
            {question.options.map((opt) => {
              const isSelected = selected === opt.id;
              const isCorrectOpt = opt.id === question.correctAnswer;
              let bg    = "var(--color-surface-2)";
              let border = "var(--color-border)";
              let color  = "var(--color-text-secondary)";

              if (revealed) {
                if (isCorrectOpt) { bg = "rgba(34,197,94,0.12)"; border = "rgba(34,197,94,0.4)"; color = "#22c55e"; }
                else if (isSelected && !isCorrectOpt) { bg = "rgba(239,68,68,0.1)"; border = "rgba(239,68,68,0.35)"; color = "#ef4444"; }
              } else if (isSelected) {
                bg = domain.color + "12"; border = domain.color + "50"; color = domain.color;
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleMCQSelect(opt.id)}
                  disabled={revealed}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all text-sm",
                    !revealed && "hover:scale-[1.01]",
                    revealed && "cursor-default"
                  )}
                  style={{ background: bg, borderColor: border, color }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: color + "20", color }}
                  >
                    {opt.id}
                  </span>
                  {opt.text}
                  {revealed && isCorrectOpt && (
                    <CheckCircle2 size={15} className="ml-auto flex-shrink-0" style={{ color: "#22c55e" }} />
                  )}
                  {revealed && isSelected && !isCorrectOpt && (
                    <XCircle size={15} className="ml-auto flex-shrink-0" style={{ color: "#ef4444" }} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Numerical input */}
        {question.type === "numerical" && (
          <div className="flex gap-2 mt-3">
            <div className="relative flex-1">
              <input
                value={numInput}
                onChange={(e) => setNumInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNumericalSubmit()}
                placeholder="Enter your answer..."
                disabled={revealed}
                type="number"
                className="w-full px-4 py-2.5 rounded-xl border text-sm font-mono outline-none"
                style={{
                  background:   "var(--color-surface-2)",
                  borderColor:  revealed ? (isCorrect ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)") : "var(--color-border)",
                  color:        revealed ? (isCorrect ? "#22c55e" : "#ef4444") : "var(--color-text-primary)",
                }}
              />
              {question.unit && (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {question.unit}
                </span>
              )}
            </div>
            {!revealed && (
              <button
                onClick={handleNumericalSubmit}
                disabled={!numInput}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105 disabled:opacity-40"
                style={{ background: domain.color }}
              >
                Submit
              </button>
            )}
            {revealed && (
              <div
                className="px-4 py-2.5 rounded-xl text-sm font-mono"
                style={{
                  background:  isCorrect ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)",
                  color:       isCorrect ? "#22c55e" : "#ef4444",
                  border:      `1px solid ${isCorrect ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                }}
              >
                {isCorrect ? "✓ Correct" : `Answer: ${question.correctAnswer} ${question.unit ?? ""}`}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hint + Solution */}
      <div
        className="px-5 pb-4 pt-2 border-t space-y-2"
        style={{ borderColor: "var(--color-border)" }}
      >
        {/* Hint toggle */}
        {!revealed && (
          <button
            onClick={() => setShowHint((v) => !v)}
            className="flex items-center gap-1.5 text-xs transition-colors hover:underline"
            style={{ color: "#f59e0b" }}
          >
            <Lightbulb size={13} />
            {showHint ? "Hide hint" : "Show hint"}
          </button>
        )}
        {showHint && !revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="px-3 py-2 rounded-lg text-xs"
            style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}
          >
            💡 {question.hint}
          </motion.div>
        )}

        {/* Solution (after answering) */}
        {revealed && (
          <>
            <button
              onClick={() => setShowSolution((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: domain.color }}
            >
              <BookOpen size={13} />
              {showSolution ? "Hide" : "Show"} step-by-step solution
              {showSolution ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            <AnimatePresence>
              {showSolution && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pt-1">
                    {question.solution.map((step) => (
                      <div
                        key={step.order}
                        className="flex items-start gap-2.5 p-3 rounded-xl"
                        style={{ background: "var(--color-surface-2)" }}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 text-white"
                          style={{ background: domain.color }}
                        >
                          {step.order}
                        </span>
                        <div className="space-y-1">
                          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                            {step.explanation}
                          </p>
                          {step.latex && (
                            <div className="overflow-x-auto">
                              <FormulaRenderer latex={step.latex} block={false} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Related links */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {question.chapterSlug && (
                      <Link
                        href={`/learn/${question.chapterSlug}`}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ background: domain.color + "12", color: domain.color }}
                      >
                        <BookOpen size={11} /> Read Chapter <ArrowRight size={10} />
                      </Link>
                    )}
                    {question.formulaSlug && (
                      <Link
                        href={`/formulas/${question.formulaSlug}`}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}
                      >
                        ∑ Interactive Formula <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
}
