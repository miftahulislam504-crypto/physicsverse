"use client";

// src/components/ui/Toaster.tsx
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToasts, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Toast } from "@/types";

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

const COLORS = {
  success: { bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.3)",  text: "#22c55e" },
  error:   { bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.3)",  text: "#ef4444" },
  warning: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", text: "#f59e0b" },
  info:    { bg: "rgba(0,144,240,0.1)",  border: "rgba(0,144,240,0.3)",  text: "#0090f0" },
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useStore();
  const Icon   = ICONS[toast.type];
  const colors = COLORS[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 32, scale: 0.9 }}
      animate={{ opacity: 1, y: 0,  scale: 1   }}
      exit={{    opacity: 0, y: 16, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="flex items-start gap-3 px-4 py-3 rounded-xl border max-w-sm w-full"
      style={{
        background:   colors.bg,
        borderColor:  colors.border,
        backdropFilter: "blur(12px)",
        boxShadow:    "var(--shadow-lg)",
      }}
    >
      <Icon size={18} style={{ color: colors.text, flexShrink: 0, marginTop: 1 }} />
      <p className="text-sm flex-1" style={{ color: "var(--color-text-primary)" }}>
        {toast.message}
      </p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 p-0.5 rounded transition-colors hover:bg-white/10"
        aria-label="Dismiss"
      >
        <X size={14} style={{ color: "var(--color-text-muted)" }} />
      </button>
    </motion.div>
  );
}

export function Toaster() {
  const toasts = useToasts();

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
