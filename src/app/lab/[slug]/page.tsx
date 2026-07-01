// src/app/lab/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Target } from "lucide-react";
import {
  LAB_EXPERIMENTS,
  getExperimentBySlug,
  ZONE_META,
} from "@/lib/constants/lab-data";
import { DIFFICULTY_META } from "@/lib/utils";
import { LabExperimentShell } from "@/components/labs/LabExperimentShell";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return LAB_EXPERIMENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp      = getExperimentBySlug(slug);
  if (!exp) return { title: "Experiment Not Found" };
  return {
    title:       `${exp.title} | Physics Lab`,
    description: exp.description,
  };
}

export default async function ExperimentPage({ params }: Props) {
  const { slug } = await params;
  const exp      = getExperimentBySlug(slug);
  if (!exp) notFound();

  const zone = ZONE_META[exp.zone];
  const diff = DIFFICULTY_META[exp.difficulty];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Zone colour bar */}
      <div className="h-1" style={{ background: zone.color }} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">

          {/* ── Left: Simulation ── */}
          <div className="space-y-5">
            {/* Back + header */}
            <div className="space-y-3">
              <Link href="/lab"
                className="inline-flex items-center gap-2 text-sm transition-colors hover:underline"
                style={{ color: "var(--color-text-muted)" }}>
                <ArrowLeft size={14} /> Physics Lab
              </Link>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: zone.color + "18", color: zone.color }}>
                    {zone.icon} {zone.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: diff.color + "15", color: diff.color }}>
                    {diff.label}
                  </span>
                  <span className="flex items-center gap-1 text-xs"
                    style={{ color: "var(--color-text-muted)" }}>
                    <Clock size={11} /> {exp.duration} min
                  </span>
                </div>

                <h1 className="text-2xl font-display font-bold"
                  style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
                  {exp.title}
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                  {exp.description}
                </p>
              </div>
            </div>

            {/* Simulation */}
            <LabExperimentShell slug={exp.slug} />
          </div>

          {/* ── Right: Info sidebar ── */}
          <div className="space-y-4 lg:sticky lg:top-20">

            {/* Learning objectives */}
            <div className="rounded-2xl border p-4 space-y-3"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
              <div className="flex items-center gap-2">
                <Target size={15} style={{ color: zone.color }} />
                <p className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}>
                  Learning Objectives
                </p>
              </div>
              <ul className="space-y-2">
                {exp.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs"
                    style={{ color: "var(--color-text-secondary)" }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold"
                      style={{ background: zone.color + "18", color: zone.color }}>
                      {i + 1}
                    </span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Related chapter */}
            {exp.relatedChapterSlug && (
              <Link href={`/learn/${exp.relatedChapterSlug}`}
                className="flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.01]"
                style={{
                  background:  "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}>
                <div className="flex items-center gap-2">
                  <BookOpen size={15} style={{ color: zone.color }} />
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    Related Chapter
                  </p>
                </div>
                <ArrowLeft size={13} className="rotate-180" style={{ color: "var(--color-text-muted)" }} />
              </Link>
            )}

            {/* Related formula */}
            {exp.relatedFormulaSlug && (
              <Link href={`/formulas/${exp.relatedFormulaSlug}`}
                className="flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.01]"
                style={{
                  background:  "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}>
                <div className="flex items-center gap-2">
                  <span style={{ color: zone.color, fontSize: 16 }}>∑</span>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    Interactive Formula
                  </p>
                </div>
                <ArrowLeft size={13} className="rotate-180" style={{ color: "var(--color-text-muted)" }} />
              </Link>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
