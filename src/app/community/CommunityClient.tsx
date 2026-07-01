"use client";

// src/app/community/CommunityClient.tsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MessageCircle, ThumbsUp, Eye, CheckCircle2, Pin,
  TrendingUp, Clock, HelpCircle, Plus, Sparkles,
} from "lucide-react";
import { SEED_POSTS, formatRelative, type CommunityPost } from "@/lib/constants/community-data";
import { DOMAIN_META } from "@/lib/utils";
import { TabBar } from "@/components/ui";

const TABS = [
  { id: "trending",   label: "Trending",   icon: <TrendingUp  size={13} /> },
  { id: "recent",     label: "Recent",     icon: <Clock       size={13} /> },
  { id: "unanswered", label: "Unanswered", icon: <HelpCircle  size={13} /> },
] as const;
type TabId = typeof TABS[number]["id"];

const TYPE_META = {
  question:   { label: "Question",   icon: "❓", color: "#0090f0" },
  discussion: { label: "Discussion", icon: "💬", color: "#7c4ef5" },
  showcase:   { label: "Showcase",   icon: "🏆", color: "#f59e0b" },
};

function PostCard({ post, index }: { post: CommunityPost; index: number }) {
  const typeMeta = TYPE_META[post.type];
  const domain   = post.domain ? DOMAIN_META[post.domain] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/community/${post.id}`}
        className="group flex gap-4 p-4 rounded-2xl border transition-all duration-200 block"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = typeMeta.color + "40";
          el.style.transform   = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--color-border)";
          el.style.transform   = "translateY(0)";
        }}
      >
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0 w-12">
          <ThumbsUp size={14} style={{ color: "var(--color-text-muted)" }} />
          <span className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>{post.upvotes}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {post.isPinned && <Pin size={12} style={{ color: "#f59e0b" }} />}
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: typeMeta.color + "15", color: typeMeta.color }}>
              {typeMeta.icon} {typeMeta.label}
            </span>
            {domain && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: domain.color + "12", color: domain.color }}>
                {domain.icon} {domain.label}
              </span>
            )}
            {post.isSolved && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                <CheckCircle2 size={10} /> Solved
              </span>
            )}
          </div>

          <p className="text-sm font-semibold leading-snug" style={{ color: "var(--color-text-primary)" }}>
            {post.title}
          </p>
          <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--color-text-muted)" }}>
            {post.content}
          </p>

          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <span>{post.avatar}</span> {post.author}
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>· {formatRelative(post.createdAt)}</span>
            <span className="flex items-center gap-1 text-xs ml-auto" style={{ color: "var(--color-text-muted)" }}>
              <MessageCircle size={11} /> {post.answers.length}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <Eye size={11} /> {post.views}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function CommunityClient() {
  const [tab, setTab] = useState<TabId>("trending");

  const posts = useMemo(() => {
    const arr = [...SEED_POSTS];
    if (tab === "trending")   return arr.sort((a, b) => b.upvotes - a.upvotes);
    if (tab === "recent")     return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (tab === "unanswered") return arr.filter((p) => p.answers.length === 0);
    return arr;
  }, [tab]);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>Phase 12</p>
            <h1 className="text-4xl font-display font-bold mt-1"
              style={{ color: "var(--color-text-primary)", letterSpacing: "-0.03em" }}>
              Community
            </h1>
            <p style={{ color: "var(--color-text-secondary)" }}>
              {SEED_POSTS.length} posts · Ask questions, share projects, discuss physics
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0090f0, #7c4ef5)" }}>
            <Plus size={16} /> New Post
          </button>
        </motion.div>

        {/* Weekly Challenge banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 px-5 py-4 rounded-2xl border"
          style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.1), rgba(232,121,249,0.06))", borderColor: "rgba(167,139,250,0.3)" }}>
          <Sparkles size={20} style={{ color: "#a78bfa" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "#a78bfa" }}>This Week's Physics Mission</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Solve 5 rotational dynamics problems for a special badge
            </p>
          </div>
          <Link href="/practice" className="ml-auto text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>
            Join →
          </Link>
        </motion.div>

        {/* Tabs */}
        <TabBar tabs={TABS} active={tab} onChange={(id) => setTab(id as TabId)} />

        {/* Posts */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-3xl mb-2">🎉</p>
                <p style={{ color: "var(--color-text-secondary)" }}>All questions have been answered!</p>
              </div>
            ) : (
              posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
