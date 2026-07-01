// src/app/learn/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_CHAPTERS, getChapterBySlug } from "@/lib/constants/chapters-data";
import { DOMAIN_META } from "@/lib/utils";
import { ChapterClient } from "./ChapterClient";

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── Static path generation ───────────────────────────────────────────────────
export async function generateStaticParams() {
  return ALL_CHAPTERS.map((ch) => ({ slug: ch.slug }));
}

// ─── Dynamic metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const chapter  = getChapterBySlug(slug);
  if (!chapter) return { title: "Chapter Not Found" };

  const domain = DOMAIN_META[chapter.domain];

  return {
    title:       chapter.title,
    description: chapter.description,
    openGraph: {
      title:       `${chapter.title} | PhysicsVerse`,
      description: chapter.description,
      type:        "article",
    },
    keywords: [...chapter.tags, domain.label, "physics", "learn"],
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ChapterPage({ params }: Props) {
  const { slug } = await params;
  const chapter  = getChapterBySlug(slug);

  if (!chapter) notFound();

  return <ChapterClient chapter={chapter} />;
}
