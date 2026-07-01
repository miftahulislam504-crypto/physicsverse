// src/app/lab/[slug]/not-found.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LabNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <p className="text-6xl">🔬</p>
        <h1 className="text-3xl font-display font-bold"
          style={{ color: "var(--color-text-primary)" }}>
          Experiment Not Found
        </h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          This lab experiment doesn&apos;t exist yet or the URL is wrong.
        </p>
        <Link href="/lab"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: "var(--color-primary)" }}>
          <ArrowLeft size={14} /> Back to Lab
        </Link>
      </div>
    </div>
  );
}
