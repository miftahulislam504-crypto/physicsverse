// src/app/engineering/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lightbulb, Briefcase, ArrowRight } from "lucide-react";
import { ENGINEERING_CASES, FIELDS, getEngineeringBySlug } from "@/lib/constants/engineering-data";
import { DOMAIN_META } from "@/lib/utils";
import { FormulaRenderer } from "@/components/physics/FormulaRenderer";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return ENGINEERING_CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getEngineeringBySlug(slug);
  if (!c) return { title: "Not Found" };
  return { title: c.title, description: c.problem };
}

export default async function EngineeringCasePage({ params }: Props) {
  const { slug } = await params;
  const c = getEngineeringBySlug(slug);
  if (!c) notFound();

  const fieldMeta = FIELDS.find((f) => f.id === c.field)!;
  const domain = DOMAIN_META[c.domain];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="h-1" style={{ background: fieldMeta.color }} />
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Link href="/engineering" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--color-text-muted)" }}>
          <ArrowLeft size={14} /> Engineering Applications
        </Link>

        <div className="space-y-3">
          <span className="text-5xl">{c.icon}</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: fieldMeta.color + "18", color: fieldMeta.color }}>
              {fieldMeta.icon} {fieldMeta.label} Engineering
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: domain.color + "12", color: domain.color }}>
              {domain.icon} {domain.label}
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>{c.title}</h1>
        </div>

        {/* Problem */}
        <div className="p-4 rounded-2xl border" style={{ background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "#ef4444" }}>THE PROBLEM</p>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{c.problem}</p>
        </div>

        {/* Principle */}
        <div className="p-4 rounded-2xl border" style={{ background: "rgba(0,144,240,0.05)", borderColor: "rgba(0,144,240,0.2)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-primary)" }}>PHYSICS PRINCIPLE</p>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{c.principle}</p>
        </div>

        {/* Solution */}
        <div className="space-y-3">
          <p className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
            <Lightbulb size={15} style={{ color: "#f59e0b" }} /> How Engineers Solve It
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{c.solution}</p>
        </div>

        {/* Formula */}
        {c.formula && (
          <div className="p-4 rounded-2xl flex justify-center" style={{ background: "var(--color-surface)" }}>
            <FormulaRenderer latex={c.formula} block />
          </div>
        )}

        {/* Career path */}
        <div className="flex items-start gap-3 p-4 rounded-2xl border" style={{ background: "rgba(34,197,94,0.05)", borderColor: "rgba(34,197,94,0.2)" }}>
          <Briefcase size={16} style={{ color: "#22c55e", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>CAREER PATH</p>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{c.careerPath}</p>
          </div>
        </div>

        {c.formulaSlug && (
          <Link href={`/formulas/${c.formulaSlug}`}
            className="flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.01]"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>∑ Try the interactive formula</span>
            <ArrowRight size={14} style={{ color: "var(--color-primary)" }} />
          </Link>
        )}
      </div>
    </div>
  );
}
