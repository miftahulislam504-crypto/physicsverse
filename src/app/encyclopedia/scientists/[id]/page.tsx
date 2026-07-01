// src/app/encyclopedia/scientists/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Quote } from "lucide-react";
import { SCIENTISTS, getScientistById } from "@/lib/constants/encyclopedia-data";
import { DOMAIN_META } from "@/lib/utils";

interface Props { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return SCIENTISTS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const s = getScientistById(id);
  if (!s) return { title: "Scientist Not Found" };
  return { title: s.name, description: s.bio.slice(0, 160) };
}

export default async function ScientistPage({ params }: Props) {
  const { id } = await params;
  const s = getScientistById(id);
  if (!s) notFound();

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Link href="/encyclopedia"
          className="inline-flex items-center gap-2 text-sm hover:underline"
          style={{ color: "var(--color-text-muted)" }}>
          <ArrowLeft size={14} /> Encyclopedia
        </Link>

        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl flex-shrink-0"
            style={{ background: "var(--color-surface)" }}>
            {s.portrait}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-bold" style={{ color: "var(--color-text-primary)" }}>{s.name}</h1>
              <span className="text-xl">{s.flag}</span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {s.born} – {s.died ?? "present"} · {s.nationality}
            </p>
            {s.nobelYear && (
              <span className="inline-flex items-center gap-1 text-xs mt-2 px-3 py-1 rounded-full"
                style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                <Trophy size={12} /> Nobel Prize {s.nobelYear} — {s.nobelReason}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {s.domains.map((d) => {
            const meta = DOMAIN_META[d as keyof typeof DOMAIN_META];
            if (!meta) return null;
            return (
              <span key={d} className="text-xs px-2 py-0.5 rounded-full" style={{ background: meta.color + "15", color: meta.color }}>
                {meta.icon} {meta.label}
              </span>
            );
          })}
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{s.bio}</p>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
            Key Contributions
          </p>
          {s.contributions.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--color-primary)" }} />
              {c}
            </div>
          ))}
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
            Named After
          </p>
          <div className="flex flex-wrap gap-1.5">
            {s.namedAfter.map((n) => (
              <span key={n} className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--color-surface)", color: "var(--color-text-secondary)" }}>
                {n}
              </span>
            ))}
          </div>
        </div>

        {s.quote && (
          <div className="flex items-start gap-3 p-4 rounded-2xl border italic"
            style={{ background: "rgba(0,144,240,0.05)", borderColor: "rgba(0,144,240,0.2)" }}>
            <Quote size={16} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{s.quote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
