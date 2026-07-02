// src/app/realworld/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Lightbulb, FlaskConical } from "lucide-react";
import { REALWORLD_ARTICLES, getArticleBySlug } from "@/lib/constants/realworld-data";
import { DOMAIN_META } from "@/lib/utils";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return REALWORLD_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article  = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return { title: article.title, description: article.summary.slice(0, 160) };
}

export default async function RealWorldArticlePage({ params }: Props) {
  const { slug } = await params;
  const article  = getArticleBySlug(slug);
  if (!article) notFound();

  const domain = DOMAIN_META[article.domain];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="h-1" style={{ background: domain.color }} />

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <Link href="/realworld"
          className="inline-flex items-center gap-2 text-sm hover:underline"
          style={{ color: "var(--color-text-muted)" }}>
          <ArrowLeft size={14} /> Real World Physics
        </Link>

        {/* Hero */}
        <div className="space-y-3">
          <span className="text-5xl">{article.icon}</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: domain.color + "18", color: domain.color }}>
              {domain.label}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "var(--color-surface)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
              {article.category}
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold"
            style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
            {article.title}
          </h1>
          <p className="text-lg italic" style={{ color: "var(--color-text-muted)" }}>
            {article.question}
          </p>
          <div className="flex items-center gap-2 text-sm"
            style={{ color: "var(--color-text-secondary)" }}>
            <span className="font-medium" style={{ color: domain.color }}>Principle:</span>
            {article.principle}
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border p-5 space-y-2"
          style={{ background: "var(--color-surface)", borderColor: domain.color + "25" }}>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            {article.summary}
          </p>
        </div>

        {/* Key points */}
        <div className="space-y-3">
          <h2 className="text-lg font-display font-semibold flex items-center gap-2"
            style={{ color: "var(--color-text-primary)" }}>
            <span style={{ color: domain.color }}>⭐</span> Key Physics Points
          </h2>
          <div className="space-y-2">
            {article.keyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "var(--color-surface)" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 text-white"
                  style={{ background: domain.color }}>
                  {i + 1}
                </div>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fun fact */}
        <div className="flex items-start gap-3 p-4 rounded-2xl border"
          style={{ background: "rgba(245,158,11,0.07)", borderColor: "rgba(245,158,11,0.25)" }}>
          <Lightbulb size={18} style={{ color: "#f59e0b", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "#f59e0b" }}>Fun Fact</p>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{article.funFact}</p>
          </div>
        </div>

        {/* Related links */}
        <div className="flex flex-wrap gap-3">
          {article.chapterSlug && (
            <Link href={`/learn/${article.chapterSlug}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{ background: domain.color + "12", color: domain.color }}>
              <BookOpen size={14} /> Read the Chapter
            </Link>
          )}
          {article.formulaSlug && (
            <Link href={`/formulas/${article.formulaSlug}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all hover:scale-105"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              ∑ Interactive Formula
            </Link>
          )}
          <Link href="/lab"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all hover:scale-105"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
            <FlaskConical size={14} /> Try in Lab
          </Link>
        </div>
      </div>
    </div>
  );
}
