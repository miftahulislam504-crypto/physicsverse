// src/app/community/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ThumbsUp, CheckCircle2, MessageCircle } from "lucide-react";
import { SEED_POSTS, getPostById, formatRelative } from "@/lib/constants/community-data";
import { DOMAIN_META } from "@/lib/utils";

interface Props { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return SEED_POSTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.content.slice(0, 160) };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post   = getPostById(id);
  if (!post) notFound();

  const domain = post.domain ? DOMAIN_META[post.domain] : null;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Link href="/community" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: "var(--color-text-muted)" }}>
          <ArrowLeft size={14} /> Community
        </Link>

        {/* Post */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1 w-12 flex-shrink-0">
            <ThumbsUp size={18} style={{ color: "var(--color-text-muted)" }} />
            <span className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>{post.upvotes}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {domain && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: domain.color + "15", color: domain.color }}>
                  {domain.icon} {domain.label}
                </span>
              )}
              {post.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>
                  {t}
                </span>
              ))}
            </div>
            <h1 className="text-xl font-display font-bold" style={{ color: "var(--color-text-primary)" }}>{post.title}</h1>
            <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{post.content}</p>
            <div className="flex items-center gap-2 mt-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <span>{post.avatar}</span> {post.author} · {formatRelative(post.createdAt)}
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="space-y-3 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
            <MessageCircle size={15} /> {post.answers.length} Answer{post.answers.length !== 1 ? "s" : ""}
          </p>
          {post.answers.map((ans) => (
            <div key={ans.id} className="flex gap-4 p-4 rounded-2xl border"
              style={{
                background:  ans.isAccepted ? "rgba(34,197,94,0.05)" : "var(--color-surface)",
                borderColor: ans.isAccepted ? "rgba(34,197,94,0.3)" : "var(--color-border)",
              }}>
              <div className="flex flex-col items-center gap-1 w-10 flex-shrink-0">
                <ThumbsUp size={14} style={{ color: "var(--color-text-muted)" }} />
                <span className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>{ans.upvotes}</span>
                {ans.isAccepted && <CheckCircle2 size={16} style={{ color: "#22c55e" }} />}
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{ans.content}</p>
                <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  <span>{ans.avatar}</span> {ans.author} · {formatRelative(ans.createdAt)}
                  {ans.isAccepted && <span style={{ color: "#22c55e" }}>· ✓ Accepted Answer</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply box (UI only) */}
        <div className="pt-4 border-t space-y-2" style={{ borderColor: "var(--color-border)" }}>
          <textarea placeholder="Write your answer..."
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-primary)", minHeight: 80 }} />
          <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: "var(--color-primary)" }}>
            Post Answer
          </button>
        </div>
      </div>
    </div>
  );
}
