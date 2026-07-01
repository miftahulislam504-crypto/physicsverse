// src/app/formulas/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  ALL_FORMULAS,
  getFormulaBySlug,
} from "@/lib/constants/formulas-data";
import { DOMAIN_META } from "@/lib/utils";
import { FormulaExplorer } from "@/components/physics/FormulaExplorer";

interface Props {
  params: Promise<{ slug: string }>;
}

// ── Static params ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return ALL_FORMULAS.map((f) => ({ slug: f.slug }));
}

// ── Dynamic metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const formula  = getFormulaBySlug(slug);
  if (!formula) return { title: "Formula Not Found" };

  const domain = DOMAIN_META[formula.domain];
  return {
    title:       `${formula.name} | Formula Explorer`,
    description: formula.description,
    keywords:    [...formula.tags, domain.label, "physics formula", "interactive"],
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function FormulaPage({ params }: Props) {
  const { slug } = await params;
  const formula  = getFormulaBySlug(slug);
  if (!formula)  notFound();

  const domain = DOMAIN_META[formula.domain];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Domain colour bar */}
      <div className="h-1" style={{ background: domain.color }} />

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Back */}
        <Link
          href="/formulas"
          className="inline-flex items-center gap-2 text-sm transition-colors hover:underline"
          style={{ color: "var(--color-text-muted)" }}
        >
          <ArrowLeft size={14} /> Formula Explorer
        </Link>

        {/* Interactive explorer */}
        <FormulaExplorer formula={formula} />
      </div>
    </div>
  );
}
