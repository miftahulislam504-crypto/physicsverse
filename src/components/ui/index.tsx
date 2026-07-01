"use client";

// src/components/ui/index.tsx
// Shared reusable UI components used across all phases

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ─── SectionHeader ────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  eyebrow, title, description, action, className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        {eyebrow && (
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: "var(--color-primary)" }}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className="text-xl font-display font-semibold"
          style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}
        >
          {title}
        </h2>
        {description && (
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ─── TabBar ───────────────────────────────────────────────────────────────────
interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

interface TabBarProps {
  tabs: readonly TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function TabBar({ tabs, active, onChange, className }: TabBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 rounded-xl",
        className
      )}
      style={{ background: "var(--color-surface)" }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              color: isActive
                ? "var(--color-text-primary)"
                : "var(--color-text-muted)",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-lg"
                style={{ background: "var(--color-bg)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive
                      ? "var(--color-primary-subtle)"
                      : "var(--color-surface-2)",
                    color: isActive
                      ? "var(--color-primary)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  color?: string;
  trend?: { value: number; label: string };
  className?: string;
}

export function StatCard({ value, label, icon, color, trend, className }: StatCardProps) {
  return (
    <div
      className={cn("p-4 rounded-2xl border", className)}
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-start justify-between mb-2">
        {icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: color ? color + "15" : "var(--color-primary-subtle)" }}
          >
            {icon}
          </div>
        )}
        {trend && (
          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded"
            style={{
              background: trend.value >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color:      trend.value >= 0 ? "#22c55e" : "#ef4444",
            }}
          >
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p
        className="text-2xl font-bold font-display"
        style={{ color: color ?? "var(--color-text-primary)" }}
      >
        {value}
      </p>
      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </p>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {icon && <span className="text-4xl mb-4">{icon}</span>}
      <p className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
        {title}
      </p>
      {description && (
        <p className="text-sm mt-1 max-w-xs" style={{ color: "var(--color-text-muted)" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  rounded?: string;
}

export function Skeleton({ className, height, width, rounded = "rounded-lg" }: SkeletonProps) {
  return (
    <div
      className={cn("shimmer", rounded, className)}
      style={{ height, width, minHeight: height ?? 16 }}
    />
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={cn("zone-badge", className)}
      style={{
        background: color ? color + "15" : "var(--color-primary-subtle)",
        color:      color ?? "var(--color-primary)",
      }}
    >
      {children}
    </span>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

export function Button({
  children, variant = "primary", size = "md",
  onClick, disabled, className, type = "button", fullWidth,
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
  };

  const variantStyles = {
    primary:   { background: "var(--color-primary)", color: "#fff" },
    secondary: { background: "var(--color-surface)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)" },
    ghost:     { background: "transparent", color: "var(--color-text-secondary)" },
    danger:    { background: "rgba(239,68,68,0.1)", color: "#ef4444" },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-medium transition-all duration-150 flex items-center justify-center gap-2",
        "hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      style={variantStyles[variant]}
    >
      {children}
    </button>
  );
}
