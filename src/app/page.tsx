"use client";

// src/app/page.tsx — PhysicsVerse Homepage (Phase 1)
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FlaskConical, Bot, Zap, Network } from "lucide-react";
import { DomainGrid }    from "@/components/physics/DomainGrid";
import { DailyFact }     from "@/components/physics/DailyFact";
import { SectionHeader } from "@/components/ui";

function AtomHero() {
  return (
    <div className="relative flex items-center justify-center">
      <motion.svg width="120" height="120" viewBox="0 0 120 120" fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
        <ellipse cx="60" cy="60" rx="52" ry="20" stroke="#0090f0" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
        <ellipse cx="60" cy="60" rx="52" ry="20" stroke="#0090f0" strokeWidth="1.5" fill="none" transform="rotate(60 60 60)" strokeDasharray="4 2" />
        <ellipse cx="60" cy="60" rx="52" ry="20" stroke="#7c4ef5" strokeWidth="1.5" fill="none" transform="rotate(120 60 60)" strokeDasharray="4 2" />
      </motion.svg>
      <div className="absolute w-10 h-10 rounded-full"
        style={{ background: "radial-gradient(circle, #7c4ef5, #0090f0)", boxShadow: "0 0 24px rgba(124,78,245,0.5)" }} />
    </div>
  );
}

const FEATURES = [
  { icon: <FlaskConical size={14} />, label: "49 Virtual Labs"    },
  { icon: <Bot          size={14} />, label: "AI Physics Tutor"   },
  { icon: <Zap          size={14} />, label: "Live Simulations"   },
  { icon: <Network      size={14} />, label: "3D Science City"    },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 px-4" style={{ background: "var(--color-bg)" }}>
        <div className="absolute inset-0 bg-physics-grid opacity-50" style={{ backgroundSize: "40px 40px" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,144,240,0.12), transparent)" }} />
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-center">
            <AtomHero />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>Physics Learning Ecosystem</p>
            <h1 className="text-5xl sm:text-6xl font-display font-bold leading-tight" style={{ letterSpacing: "-0.03em" }}>
              <span className="text-gradient-hero">See Physics.</span><br />
              <span style={{ color: "var(--color-text-primary)" }}>Feel Physics. Master Physics.</span>
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
              Interactive simulations, AI tutoring, virtual labs, and a 3D science city — the complete physics learning ecosystem.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/explore" className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #0090f0, #7c4ef5)", boxShadow: "0 4px 20px rgba(0,144,240,0.35)" }}>
              Start Exploring <ArrowRight size={16} />
            </Link>
            <Link href="/lab" className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:scale-105"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}>
              <FlaskConical size={16} /> Open the Lab
            </Link>
            <Link href="/city" className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:scale-105"
              style={{ background: "var(--color-surface)", borderColor: "rgba(124,78,245,0.4)", color: "#7c4ef5" }}>
              🌆 Explore 3D City
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="flex flex-wrap items-center justify-center gap-2">
            {FEATURES.map((f) => (
              <span key={f.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
                <span style={{ color: "var(--color-primary)" }}>{f.icon}</span>{f.label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-14 px-4 max-w-6xl mx-auto space-y-6">
        <SectionHeader eyebrow="10 Domains" title="Every Branch of Physics"
          description="From Classical Mechanics to Quantum Mechanics — all covered."
          action={<Link href="/explore" className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--color-primary)" }}>View all <ArrowRight size={14} /></Link>} />
        <DomainGrid />
      </section>

      <section className="py-6 px-4 max-w-6xl mx-auto"><DailyFact /></section>

      <section className="py-14 px-4" style={{ background: "var(--color-bg-secondary)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "65+",  label: "Chapters",          color: "#0090f0" },
            { value: "49",   label: "Lab Simulations",   color: "#34d399" },
            { value: "500+", label: "Practice Problems", color: "#f59e0b" },
            { value: "24",   label: "Timeline Events",   color: "#a78bfa" },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-4xl font-display font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
