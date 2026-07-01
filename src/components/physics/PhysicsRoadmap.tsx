"use client";

// src/components/physics/PhysicsRoadmap.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2, Lock, ArrowRight, Clock, BookOpen, Star } from "lucide-react";
import { ROADMAP_PATHS, type RoadmapPath, type RoadmapStep } from "@/lib/constants/physics-data";
import { DOMAIN_META } from "@/lib/utils";
import { useUser } from "@/lib/store";
import { cn } from "@/lib/utils";

// ─── Path selector cards ──────────────────────────────────────────────────────
function PathCard({
  path,
  isActive,
  onClick,
}: {
  path: RoadmapPath;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col items-start gap-2 p-4 rounded-2xl border text-left transition-all"
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${path.color}18, ${path.color}08)`
          : "var(--color-surface)",
        borderColor: isActive ? path.color + "50" : "var(--color-border)",
        boxShadow:   isActive ? `0 0 20px ${path.color}15` : undefined,
      }}
    >
      <span className="text-2xl">{path.icon}</span>
      <div>
        <p
          className="text-sm font-semibold font-display"
          style={{ color: isActive ? path.color : "var(--color-text-primary)" }}
        >
          {path.label}
        </p>
        {path.totalChapters > 0 && (
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {path.totalChapters} chapters · {path.estimatedWeeks}w
          </p>
        )}
      </div>
    </motion.button>
  );
}

// ─── Single step in the roadmap ───────────────────────────────────────────────
function RoadmapStepItem({
  step,
  index,
  isCompleted,
  isCurrent,
  isLocked,
  pathColor,
  onClick,
}: {
  step: RoadmapStep;
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  pathColor: string;
  onClick: () => void;
}) {
  const meta = DOMAIN_META[step.domain];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="flex items-start gap-4"
    >
      {/* Step connector line + circle */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
          style={{
            background: isCompleted
              ? pathColor
              : isCurrent
              ? pathColor + "20"
              : "var(--color-surface)",
            borderColor: isCompleted || isCurrent ? pathColor : "var(--color-border)",
            boxShadow: isCurrent ? `0 0 12px ${pathColor}40` : undefined,
          }}
        >
          {isCompleted ? (
            <CheckCircle2 size={18} color="white" />
          ) : isLocked ? (
            <Lock size={14} style={{ color: "var(--color-text-muted)" }} />
          ) : (
            <span
              className="text-sm font-bold font-display"
              style={{ color: isCurrent ? pathColor : "var(--color-text-muted)" }}
            >
              {index + 1}
            </span>
          )}
        </div>

        {/* Vertical connector */}
        <div
          className="w-0.5 flex-1 mt-1"
          style={{
            minHeight: 32,
            background: isCompleted
              ? pathColor + "60"
              : "var(--color-border)",
          }}
        />
      </div>

      {/* Step card */}
      <motion.button
        onClick={onClick}
        disabled={isLocked}
        whileHover={!isLocked ? { x: 4 } : {}}
        className={cn(
          "flex-1 mb-4 p-4 rounded-xl border text-left transition-all",
          isLocked && "opacity-50 cursor-not-allowed"
        )}
        style={{
          background: isCurrent
            ? `linear-gradient(135deg, ${pathColor}12, ${pathColor}06)`
            : "var(--color-surface)",
          borderColor: isCurrent ? pathColor + "40" : "var(--color-border)",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {/* Domain badge */}
            <span
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-2"
              style={{ background: meta.color + "15", color: meta.color }}
            >
              {meta.icon} {meta.label}
            </span>

            <p
              className="text-sm font-semibold font-display"
              style={{ color: "var(--color-text-primary)" }}
            >
              {step.title}
            </p>

            <div className="flex items-center gap-3 mt-1.5">
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                <BookOpen size={11} />
                {step.chaptersCount} chapter{step.chaptersCount > 1 ? "s" : ""}
              </span>
              {step.isCore && (
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "#f59e0b" }}
                >
                  <Star size={11} fill="#f59e0b" /> Core
                </span>
              )}
            </div>
          </div>

          {!isLocked && (
            <ArrowRight
              size={16}
              style={{ color: isCurrent ? pathColor : "var(--color-text-muted)", flexShrink: 0 }}
            />
          )}
        </div>

        {/* Progress bar for current step */}
        {isCurrent && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
              <span>In Progress</span>
              <span>0 / {step.chaptersCount}</span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "var(--color-border)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: "0%", background: pathColor }}
              />
            </div>
          </div>
        )}
      </motion.button>
    </motion.div>
  );
}

// ─── Main PhysicsRoadmap ──────────────────────────────────────────────────────
export function PhysicsRoadmap() {
  const user    = useUser();
  const router  = useRouter();
  const [activePathId, setActivePathId] = useState(
    user?.learningPath ?? "curious"
  );

  const activePath = ROADMAP_PATHS.find((p) => p.id === activePathId)
    ?? ROADMAP_PATHS[0];

  // For demo: first step is "current", rest are locked
  // In production: derive from user's Firestore progress
  const completedSteps = new Set<number>();
  const currentStep    = 0;

  function handleStepClick(step: RoadmapStep, idx: number) {
    if (idx > currentStep) return;
    router.push(`/learn?domain=${step.domain}`);
  }

  return (
    <div className="space-y-6">
      {/* Path selector grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ROADMAP_PATHS.map((path) => (
          <PathCard
            key={path.id}
            path={path}
            isActive={activePathId === path.id}
            onClick={() => setActivePathId(path.id)}
          />
        ))}
      </div>

      {/* Path description */}
      <div
        className="flex items-center justify-between p-4 rounded-xl border"
        style={{ background: activePath.color + "08", borderColor: activePath.color + "30" }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: activePath.color }}>
            {activePath.icon} {activePath.label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            {activePath.description}
          </p>
        </div>
        {activePath.totalChapters > 0 && (
          <div className="text-right flex-shrink-0 ml-4">
            <div className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <Clock size={12} />
              {activePath.estimatedWeeks} weeks
            </div>
            <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              <BookOpen size={12} />
              {activePath.totalChapters} chapters
            </div>
          </div>
        )}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePathId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pl-2"
        >
          {activePath.steps.map((step, idx) => (
            <RoadmapStepItem
              key={step.order}
              step={step}
              index={idx}
              isCompleted={completedSteps.has(idx)}
              isCurrent={idx === currentStep}
              isLocked={idx > currentStep && !completedSteps.has(idx - 1) && idx !== 0}
              pathColor={activePath.color}
              onClick={() => handleStepClick(step, idx)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
