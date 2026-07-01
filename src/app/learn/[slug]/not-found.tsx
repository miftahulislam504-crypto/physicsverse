// src/app/learn/[slug]/not-found.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ChapterNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <p className="text-6xl">⚛️</p>
        <h1
          className="text-3xl font-display font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Chapter Not Found
        </h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          This chapter doesn&apos;t exist yet — or the URL might be wrong.
        </p>
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white mt-2"
          style={{ background: "var(--color-primary)" }}
        >
          <ArrowLeft size={15} /> Back to Learn
        </Link>
      </div>
    </div>
  );
}
