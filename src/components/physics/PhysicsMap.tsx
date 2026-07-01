"use client";

// src/components/physics/PhysicsMap.tsx
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, FlaskConical } from "lucide-react";
import { DOMAIN_NODES, type DomainNode } from "@/lib/constants/physics-data";
import { cn } from "@/lib/utils";
import type { PhysicsDomain } from "@/types";

// ─── Connection lines between nodes ──────────────────────────────────────────
function ConnectionLines({ active }: { active: PhysicsDomain | null }) {
  const rendered = new Set<string>();

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="4"
          refX="3" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="rgba(0,144,240,0.4)" />
        </marker>
      </defs>
      {DOMAIN_NODES.map((node) =>
        node.connections.map((targetId) => {
          const key = [node.id, targetId].sort().join("-");
          if (rendered.has(key)) return null;
          rendered.add(key);

          const target = DOMAIN_NODES.find((n) => n.id === targetId);
          if (!target) return null;

          const isHighlighted =
            active === node.id || active === targetId;

          return (
            <line
              key={key}
              x1={`${node.x}%`}   y1={`${node.y}%`}
              x2={`${target.x}%`} y2={`${target.y}%`}
              stroke={isHighlighted ? "rgba(0,144,240,0.6)" : "rgba(0,144,240,0.12)"}
              strokeWidth={isHighlighted ? 1.5 : 1}
              strokeDasharray={isHighlighted ? "none" : "4 4"}
              style={{ transition: "all 0.3s ease" }}
            />
          );
        })
      )}
    </svg>
  );
}

// ─── Single domain node ───────────────────────────────────────────────────────
function DomainNodeItem({
  node,
  isActive,
  isConnected,
  onClick,
}: {
  node: DomainNode;
  isActive: boolean;
  isConnected: boolean;
  onClick: (id: PhysicsDomain) => void;
}) {
  return (
    <motion.button
      onClick={() => onClick(node.id)}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group"
      style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex: 2 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        opacity: isActive || isConnected || !isActive ? 1 : 0.35,
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Node circle */}
      <div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl",
          "border-2 transition-all duration-200",
          isActive
            ? "shadow-lg scale-110"
            : "border-transparent group-hover:border-opacity-60"
        )}
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${node.color}30, ${node.color}15)`
            : `${node.color}12`,
          borderColor: isActive ? node.color : `${node.color}40`,
          boxShadow: isActive ? `0 0 20px ${node.color}40` : undefined,
        }}
      >
        <span role="img" aria-label={node.label}>{node.icon}</span>
      </div>

      {/* Label */}
      <span
        className="text-xs font-medium text-center leading-tight max-w-[80px] transition-colors duration-200"
        style={{
          color: isActive
            ? node.color
            : "var(--color-text-secondary)",
          fontFamily: "var(--font-display)",
        }}
      >
        {node.label}
      </span>
    </motion.button>
  );
}

// ─── Detail panel ─────────────────────────────────────────────────────────────
function DetailPanel({ node, onClose }: { node: DomainNode; onClose: () => void }) {
  const router = useRouter();

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      className="absolute right-4 top-4 bottom-4 w-64 rounded-2xl border flex flex-col overflow-hidden"
      style={{
        background: "var(--color-surface)",
        borderColor: node.color + "40",
        boxShadow: `0 0 24px ${node.color}20`,
        zIndex: 10,
      }}
    >
      {/* Header */}
      <div
        className="p-4 border-b"
        style={{
          background: `linear-gradient(135deg, ${node.color}18, ${node.color}08)`,
          borderColor: node.color + "30",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl">{node.icon}</span>
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: "var(--color-text-muted)" }}
          >
            ✕
          </button>
        </div>
        <h3
          className="font-display font-semibold text-base"
          style={{ color: node.color }}
        >
          {node.label}
        </h3>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {node.description}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 p-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="text-center">
          <p className="text-xl font-bold font-display" style={{ color: node.color }}>
            {node.chapterCount}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Chapters</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold font-display" style={{ color: node.color }}>
            {node.labCount}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Labs</p>
        </div>
      </div>

      {/* Connections */}
      <div className="p-4 flex-1">
        <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
          CONNECTED TO
        </p>
        <div className="flex flex-wrap gap-1.5">
          {node.connections.map((cid) => {
            const n = DOMAIN_NODES.find((x) => x.id === cid);
            if (!n) return null;
            return (
              <span
                key={cid}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: n.color + "15", color: n.color }}
              >
                {n.icon} {n.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2 border-t" style={{ borderColor: "var(--color-border)" }}>
        <button
          onClick={() => router.push(`/learn?domain=${node.id}`)}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: node.color + "18", color: node.color }}
        >
          <span className="flex items-center gap-2">
            <BookOpen size={14} /> Learn
          </span>
          <ArrowRight size={14} />
        </button>
        <button
          onClick={() => router.push(`/lab?zone=${node.id}`)}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--color-surface-2)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <span className="flex items-center gap-2">
            <FlaskConical size={14} /> Lab Experiments
          </span>
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main PhysicsMap ──────────────────────────────────────────────────────────
export function PhysicsMap() {
  const [activeId, setActiveId] = useState<PhysicsDomain | null>(null);
  const activeNode = DOMAIN_NODES.find((n) => n.id === activeId);

  const connectedIds = activeNode
    ? new Set(activeNode.connections)
    : new Set<string>();

  function handleNodeClick(id: PhysicsDomain) {
    setActiveId((prev) => (prev === id ? null : id));
  }

  return (
    <div
      className="relative w-full rounded-2xl border overflow-hidden"
      style={{
        height: 520,
        background: "var(--color-bg-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 bg-physics-grid opacity-60"
        style={{ backgroundSize: "30px 30px" }}
      />

      {/* Subtle center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,144,240,0.04), transparent)",
        }}
      />

      {/* Connection lines */}
      <ConnectionLines active={activeId} />

      {/* Domain nodes */}
      {DOMAIN_NODES.map((node) => (
        <DomainNodeItem
          key={node.id}
          node={node}
          isActive={activeId === node.id}
          isConnected={connectedIds.has(node.id)}
          onClick={handleNodeClick}
        />
      ))}

      {/* Detail panel */}
      <AnimatePresence>
        {activeNode && (
          <DetailPanel node={activeNode} onClose={() => setActiveId(null)} />
        )}
      </AnimatePresence>

      {/* Hint text */}
      {!activeId && (
        <p
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          Click any domain to explore
        </p>
      )}
    </div>
  );
}
