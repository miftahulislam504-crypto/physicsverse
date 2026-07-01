"use client";

// src/app/playground/PlaygroundClient.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PLAYGROUND_ITEMS } from "@/lib/constants/playground-data";

export function PlaygroundClient() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>Phase 6</p>
          <h1 className="text-4xl font-display font-bold mt-1"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.03em" }}>
            Physics Playground
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            No worksheets, no pressure — just play and discover physics through experimentation.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYGROUND_ITEMS.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link href={`/playground/${item.slug}`}
                className="group flex flex-col gap-3 p-5 rounded-2xl border h-full transition-all duration-200 block"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = item.color + "50";
                  el.style.boxShadow   = `0 4px 20px ${item.color}15`;
                  el.style.transform   = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--color-border)";
                  el.style.boxShadow   = "none";
                  el.style.transform   = "translateY(0)";
                }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: item.color + "15" }}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-base font-display font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {item.title}
                  </p>
                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize"
                    style={{ background: item.color + "12", color: item.color }}>
                    {item.category}
                  </span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1"
                    style={{ color: item.color, opacity: 0.7 }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
