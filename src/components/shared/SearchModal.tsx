"use client";

// src/components/shared/SearchModal.tsx
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, X, ArrowRight, BookOpen, Layers, Hash } from "lucide-react";
import { useSearch, type SearchResult } from "@/lib/hooks/useSearch";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<SearchResult["type"], React.ReactNode> = {
  chapter: <BookOpen size={13} />,
  domain:  <Layers   size={13} />,
  formula: <span className="text-xs font-bold">∑</span>,
  tag:     <Hash     size={13} />,
};

const TYPE_LABEL: Record<SearchResult["type"], string> = {
  chapter: "Chapter",
  domain:  "Domain",
  formula: "Formula",
  tag:     "Tag",
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { query, setQuery, results } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard: Escape to close
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl mx-auto px-4"
          >
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                background:  "var(--color-surface)",
                borderColor: "var(--color-border)",
                boxShadow:   "var(--shadow-xl)",
              }}
            >
              {/* Search input */}
              <div
                className="flex items-center gap-3 px-4 py-3.5 border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Search size={18} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search chapters, formulas, domains..."
                  className="flex-1 bg-transparent outline-none text-base"
                  style={{ color: "var(--color-text-primary)" }}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 rounded-lg transition-colors hover:bg-[var(--color-surface-2)]"
                  >
                    <X size={14} style={{ color: "var(--color-text-muted)" }} />
                  </button>
                )}
                <kbd
                  className="hidden sm:flex items-center px-2 py-1 rounded text-xs border"
                  style={{
                    background:  "var(--color-surface-2)",
                    borderColor: "var(--color-border)",
                    color:       "var(--color-text-muted)",
                  }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[420px] overflow-y-auto">
                {query.length < 2 ? (
                  /* Quick links when no query */
                  <div className="p-4 space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider px-2 mb-3"
                      style={{ color: "var(--color-text-muted)" }}>
                      Quick Access
                    </p>
                    {[
                      { href: "/learn",        label: "Browse all chapters",    icon: "📖" },
                      { href: "/lab",          label: "Physics Lab",            icon: "🧪" },
                      { href: "/explore",      label: "Explore physics map",    icon: "🗺️" },
                      { href: "/practice",     label: "Practice problems",      icon: "🎯" },
                      { href: "/ai-tutor",     label: "Ask AI Tutor",           icon: "🤖" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-[var(--color-surface-2)]"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <span className="text-base">{item.icon}</span>
                        {item.label}
                        <ArrowRight size={13} className="ml-auto" style={{ color: "var(--color-text-muted)" }} />
                      </Link>
                    ))}
                  </div>
                ) : results.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-2xl mb-2">🔍</p>
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                      No results for &quot;{query}&quot;
                    </p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {results.map((result) => (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors hover:bg-[var(--color-surface-2)] group"
                      >
                        {/* Icon */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                          style={{ background: result.color + "18", color: result.color }}
                        >
                          {result.icon === "∑" ? "∑" : result.icon}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium truncate"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {result.title}
                          </p>
                          <p
                            className="text-xs truncate mt-0.5"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {result.description}
                          </p>
                        </div>

                        {/* Type badge */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span
                            className={cn(
                              "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                            )}
                            style={{
                              background: result.color + "15",
                              color:      result.color,
                            }}
                          >
                            {TYPE_ICON[result.type]}
                            {TYPE_LABEL[result.type]}
                          </span>
                          <ArrowRight
                            size={13}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "var(--color-text-muted)" }}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {results.length > 0 && (
                <div
                  className="px-4 py-2.5 border-t flex items-center justify-between"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {results.length} result{results.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    Press <kbd className="px-1 py-0.5 rounded border text-xs"
                      style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}>↵</kbd> to open
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
