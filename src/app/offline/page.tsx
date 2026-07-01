// src/app/offline/page.tsx
import Link from "next/link";
import { WifiOff, RefreshCw } from "lucide-react";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-sm">
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.1)" }}>
          <WifiOff size={28} style={{ color: "#ef4444" }} />
        </div>
        <h1 className="text-2xl font-display font-bold" style={{ color: "var(--color-text-primary)" }}>
          You're Offline
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          This page hasn't been cached yet. Check your connection and try again — or browse pages you've already visited.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--color-primary)" }}
          >
            <RefreshCw size={14} /> Retry
          </button>
          <Link href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm border"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
