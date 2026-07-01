"use client";

// src/components/physics/DomainGrid.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DOMAIN_NODES } from "@/lib/constants/physics-data";
import { cn } from "@/lib/utils";

interface DomainGridProps {
  showAll?: boolean;
  className?: string;
}

export function DomainGrid({ showAll = false, className }: DomainGridProps) {
  const nodes = showAll ? DOMAIN_NODES : DOMAIN_NODES.slice(0, 6);

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3", className)}>
      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.35 }}
        >
          <Link
            href={`/learn?domain=${node.id}`}
            className="group flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-200 block"
            style={{
              background:  "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = node.color + "50";
              el.style.background  = node.color + "08";
              el.style.boxShadow   = `0 4px 20px ${node.color}15`;
              el.style.transform   = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--color-border)";
              el.style.background  = "var(--color-surface)";
              el.style.boxShadow   = "none";
              el.style.transform   = "translateY(0)";
            }}
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: node.color + "15" }}
            >
              {node.icon}
            </div>

            {/* Label */}
            <div className="flex-1">
              <p
                className="text-sm font-semibold font-display leading-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                {node.label}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-text-muted)" }}
              >
                {node.chapterCount} chapters · {node.labCount} labs
              </p>
            </div>

            {/* Arrow */}
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
              style={{ color: node.color, opacity: 0.7 }}
            />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
