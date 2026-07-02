"use client";

// src/app/realworld/RealWorldClient.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import {
  REALWORLD_ARTICLES, CATEGORIES,
  getArticlesByCategory,
} from "@/lib/constants/realworld-data";
import { DOMAIN_META } from "@/lib/utils";

export function RealWorldClient() {
  const [cat, setCat] = useState<string | "all">("all");

  const articles = cat === "all" ? REALWORLD_ARTICLES : getArticlesByCategory(cat);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-primary)" }}>Phase 7</p>
          <h1 className="text-4xl font-display font-bold mt-1"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.03em" }}>
            Real World Physics
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Physics isn't just textbook theory — it explains everything around you.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCat("all")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: cat === "all" ? "var(--color-primary)" : "var(--color-surface)",
              color:      cat === "all" ? "#fff" : "var(--color-text-secondary)",
              border:     "1px solid " + (cat === "all" ? "transparent" : "var(--color-border)"),
            }}>
            🌐 All ({REALWORLD_ARTICLES.length})
          </button>
          {CATEGORIES.map((c) => {
            const count   = getArticlesByCategory(c.id).length;
            const isActive = cat === c.id;
            return (
              <button key={c.id} onClick={() => setCat(c.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background:  isActive ? "rgba(0,144,240,0.15)" : "var(--color-surface)",
                  color:       isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                  border:      `1px solid ${isActive ? "rgba(0,144,240,0.4)" : "var(--color-border)"}`,
                }}>
                {c.icon} {c.label}
                <span className="opacity-60 text-xs">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Article grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {articles.map((article, i) => {
              const domain = DOMAIN_META[article.domain];
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/realworld/${article.slug}`}
                    className="group flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-200 block h-full"
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
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{article.icon}</span>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: domain.color + "15", color: domain.color }}
                      >
                        {domain.label}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-base font-display font-semibold"
                        style={{ color: "var(--color-text-primary)" }}>
                        {article.title}
                      </h2>
                      <p className="text-sm mt-1 italic"
                        style={{ color: "var(--color-text-muted)" }}>
                        {article.question}
                      </p>
                      <p className="text-xs mt-2 leading-relaxed line-clamp-2"
                        style={{ color: "var(--color-text-secondary)" }}>
                        {article.summary.slice(0, 100)}...
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>
                        {article.principle.split("+")[0].trim()}
                      </span>
                      <ArrowRight size={14}
                        className="transition-transform group-hover:translate-x-1"
                        style={{ color: domain.color, opacity: 0.7 }} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
