"use client";

// src/components/city/BuildingModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ArrowRight, Lock } from "lucide-react";
import type { CityBuilding } from "@/lib/constants/city-data";

interface BuildingModalProps {
  building: CityBuilding | null;
  isLocked: boolean;
  requiredLevel: string;
  onClose: () => void;
}

export function BuildingModal({ building, isLocked, requiredLevel, onClose }: BuildingModalProps) {
  return (
    <AnimatePresence>
      {building && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative max-w-sm w-full rounded-3xl border p-6"
              style={{
                background: "var(--color-surface)",
                borderColor: building.color + "50",
                boxShadow: `0 0 50px ${building.color}25`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-2)]">
                <X size={16} style={{ color: "var(--color-text-muted)" }} />
              </button>

              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-4"
                style={{ background: building.color + "18" }}>
                {building.icon}
              </div>

              <h2 className="text-xl font-display font-bold" style={{ color: "var(--color-text-primary)" }}>
                {building.name}
              </h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {building.description}
              </p>

              {isLocked ? (
                <div className="mt-5 flex items-center gap-3 p-4 rounded-2xl"
                  style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
                  <Lock size={18} style={{ color: "#f59e0b", flexShrink: 0 }} />
                  <p className="text-xs" style={{ color: "#f59e0b" }}>
                    Reach <strong>{requiredLevel}</strong> level to unlock this building.
                  </p>
                </div>
              ) : (
                <Link href={building.linkHref}
                  className="mt-5 flex items-center justify-between px-5 py-3 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${building.color}, ${building.color}cc)`,
                    boxShadow: `0 4px 16px ${building.color}40`,
                  }}>
                  Enter {building.name} <ArrowRight size={16} />
                </Link>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
