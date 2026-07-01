// src/app/learn/domain/[domain]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getChaptersByDomain } from "@/lib/constants/chapters-data";
import { DOMAIN_META } from "@/lib/utils";
import { ChapterCard } from "@/components/physics/ChapterCard";
import type { PhysicsDomain } from "@/types";

const VALID_DOMAINS: PhysicsDomain[] = [
  "mechanics", "thermodynamics", "electricity", "magnetism",
  "waves", "optics", "modern", "astrophysics", "quantum", "relativity",
];

interface Props {
  params: Promise<{ domain: string }>;
}

export async function generateStaticParams() {
  return VALID_DOMAINS.map((d) => ({ domain: d }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params;
  const meta       = DOMAIN_META[domain as PhysicsDomain];
  if (!meta) return { title: "Domain Not Found" };
  return {
    title:       `${meta.label} — Learn Physics`,
    description: `All ${meta.label} chapters on PhysicsVerse.`,
  };
}

export default async function DomainPage({ params }: Props) {
  const { domain } = await params;

  if (!VALID_DOMAINS.includes(domain as PhysicsDomain)) notFound();

  const dom      = domain as PhysicsDomain;
  const meta     = DOMAIN_META[dom];
  const chapters = getChaptersByDomain(dom);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Domain colour header bar */}
      <div className="h-1" style={{ background: meta.color }} />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-sm transition-colors hover:underline"
          style={{ color: "var(--color-text-muted)" }}
        >
          <ArrowLeft size={14} /> All Domains
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: meta.color + "18" }}
            >
              {meta.icon}
            </div>
            <div>
              <h1
                className="text-3xl font-display font-bold"
                style={{ color: meta.color, letterSpacing: "-0.02em" }}
              >
                {meta.label}
              </h1>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Chapter grid */}
        {chapters.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🚧</p>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Chapters for this domain are coming soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {chapters.map((ch, i) => (
              <ChapterCard key={ch.id} chapter={ch} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
