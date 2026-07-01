"use client";

// src/components/physics/FormulaRenderer.tsx
// KaTeX-based formula rendering for inline and block equations

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FormulaRendererProps {
  latex: string;
  block?: boolean;
  className?: string;
  errorColor?: string;
}

export function FormulaRenderer({
  latex,
  block = false,
  className,
  errorColor = "#ef4444",
}: FormulaRendererProps) {
  const ref = useRef<HTMLSpanElement | HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Dynamically import KaTeX to avoid SSR issues
    import("katex").then((katex) => {
      try {
        katex.default.render(latex, el as HTMLElement, {
          displayMode:       block,
          throwOnError:      false,
          errorColor,
          trust:             false,
          strict:            false,
          output:            "htmlAndMathml",
          macros: {
            "\\vec":  "\\boldsymbol{#1}",
            "\\hbar": "\\hslash",
          },
        });
      } catch {
        if (el) el.textContent = latex;
      }
    });
  }, [latex, block, errorColor]);

  if (block) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={cn(
          "my-4 px-4 py-3 rounded-xl overflow-x-auto text-center",
          className
        )}
        style={{ background: "var(--color-primary-subtle)" }}
        aria-label={`Formula: ${latex}`}
      />
    );
  }

  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      className={cn("inline-block align-middle", className)}
      aria-label={`Formula: ${latex}`}
    />
  );
}

// ─── Formula Card — used in chapter content ───────────────────────────────────
interface FormulaCardProps {
  name: string;
  latex: string;
  description: string;
  className?: string;
}

export function FormulaCard({ name, latex, description, className }: FormulaCardProps) {
  return (
    <div
      className={cn("rounded-2xl border p-4 space-y-3", className)}
      style={{
        background:  "var(--color-surface)",
        borderColor: "rgba(0,144,240,0.25)",
      }}
    >
      {/* Name */}
      <div className="flex items-center gap-2">
        <div
          className="w-1 h-5 rounded-full"
          style={{ background: "var(--color-primary)" }}
        />
        <p
          className="text-sm font-semibold font-display"
          style={{ color: "var(--color-text-primary)" }}
        >
          {name}
        </p>
      </div>

      {/* LaTeX */}
      <div
        className="rounded-xl py-4 px-3 flex items-center justify-center overflow-x-auto"
        style={{ background: "var(--color-primary-subtle)" }}
      >
        <FormulaRenderer latex={latex} block={false} />
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        {description}
      </p>
    </div>
  );
}
