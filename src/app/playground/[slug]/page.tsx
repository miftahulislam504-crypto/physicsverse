// src/app/playground/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PLAYGROUND_ITEMS, getPlaygroundBySlug } from "@/lib/constants/playground-data";
import { PlaygroundShell } from "@/components/playground/PlaygroundShell";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return PLAYGROUND_ITEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getPlaygroundBySlug(slug);
  if (!item) return { title: "Not Found" };
  return { title: item.title, description: item.description };
}

export default async function PlaygroundDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getPlaygroundBySlug(slug);
  if (!item) notFound();

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="h-1" style={{ background: item.color }} />
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <Link href="/playground" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--color-text-muted)" }}>
          <ArrowLeft size={14} /> Playground
        </Link>
        <div>
          <span className="text-4xl">{item.icon}</span>
          <h1 className="text-2xl font-display font-bold mt-2" style={{ color: "var(--color-text-primary)" }}>{item.title}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>{item.description}</p>
        </div>
        <PlaygroundShell slug={item.slug} />
      </div>
    </div>
  );
}
