"use client";

// src/components/physics/FormulaListCard.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FormulaRenderer } from "./FormulaRenderer";
import { DOMAIN_META } from "@/lib/utils";
import type { FormulaData } from "@/lib/constants/formulas-data";

interface FormulaListCardProps {
  formula: FormulaData;
  index?:  number;
}

export function FormulaListCard({ formula, index = 0 }: FormulaListCardProps) {
  const domain = DOMAIN_META[formula.domain];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link
        href={`/formulas/${formula.slug}`}
        className="group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 block"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        onMouseEnter={(e) => {
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
        {/* Domain icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: domain.color + "15" }}
        >
          {domain.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold font-display truncate"
            style={{ color: "var(--color-text-primary)" }}
          >
            {formula.name}
          </p>

          {/* KaTeX preview */}
          <div className="mt-1 text-sm overflow-hidden">
            <FormulaRenderer latex={formula.latex} />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {formula.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: "var(--color-surface-2)",
                  color:      "var(--color-text-muted)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Unit + arrow */}
        <div className="flex-shrink-0 text-right">
          <p
            className="text-xs mb-2"
            style={{ color: domain.color }}
          >
            {formula.siUnit.split(" ")[0]}
          </p>
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1 ml-auto"
            style={{ color: domain.color, opacity: 0.7 }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
