"use client";

// src/components/layout/Navbar.tsx
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical, BookOpen, Zap, Target, Compass,
  BookMarked, Users, Bot, LayoutDashboard,
  Sun, Moon, Monitor, Globe, Menu, X, ChevronDown,
  Search, LogIn,
} from "lucide-react";
import { useStore, useUser } from "@/lib/store";
import { signOut } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: "/explore",      label: "Explore",      icon: Compass      },
  { href: "/learn",        label: "Learn",         icon: BookOpen     },
  { href: "/lab",          label: "Lab",           icon: FlaskConical },
  { href: "/playground",   label: "Playground",    icon: Zap          },
  { href: "/practice",     label: "Practice",      icon: Target       },
  { href: "/encyclopedia", label: "Encyclopedia",  icon: BookMarked   },
  { href: "/community",    label: "Community",     icon: Users        },
  { href: "/ai-tutor",     label: "AI Tutor",      icon: Bot          },
] as const;

const THEME_OPTIONS = [
  { value: "light",  label: "Light",  icon: Sun     },
  { value: "dark",   label: "Dark",   icon: Moon    },
  { value: "system", label: "System", icon: Monitor },
] as const;

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
      {/* Atom icon — simple SVG */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <ellipse cx="14" cy="14" rx="12" ry="5" stroke="#0090f0" strokeWidth="1.5" fill="none" />
        <ellipse cx="14" cy="14" rx="12" ry="5" stroke="#0090f0" strokeWidth="1.5" fill="none"
          transform="rotate(60 14 14)" />
        <ellipse cx="14" cy="14" rx="12" ry="5" stroke="#0090f0" strokeWidth="1.5" fill="none"
          transform="rotate(120 14 14)" />
        <circle cx="14" cy="14" r="2.5" fill="#7c4ef5" />
      </svg>
      <span
        className="font-display font-700 text-lg tracking-tight"
        style={{ letterSpacing: "-0.03em" }}
      >
        <span className="text-gradient-primary">Physics</span>
        <span style={{ color: "var(--color-text-primary)" }}>Verse</span>
      </span>
    </Link>
  );
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
function ThemeMenu() {
  const { theme, setTheme } = useStore();
  const [open, setOpen] = useState(false);

  const current = THEME_OPTIONS.find((o) => o.value === theme);
  const Icon    = current?.icon ?? Monitor;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-lg transition-colors hover:bg-[var(--color-surface)]"
        aria-label="Change theme"
      >
        <Icon size={18} style={{ color: "var(--color-text-secondary)" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 w-36 rounded-xl border py-1 z-50"
            style={{
              background:   "var(--color-surface)",
              borderColor:  "var(--color-border)",
              boxShadow:    "var(--shadow-lg)",
            }}
          >
            {THEME_OPTIONS.map(({ value, label, icon: Ic }) => (
              <button
                key={value}
                onClick={() => { setTheme(value as typeof theme); setOpen(false); }}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors",
                  theme === value
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]"
                )}
              >
                <Ic size={14} />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Locale Toggle ────────────────────────────────────────────────────────────
function LocaleToggle() {
  const { locale, setLocale } = useStore();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "bn" : "en")}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--color-surface)]"
      style={{ color: "var(--color-text-secondary)" }}
      aria-label="Switch language"
    >
      <Globe size={15} />
      <span>{locale === "en" ? "বাংলা" : "English"}</span>
    </button>
  );
}

// ─── Auth Button ──────────────────────────────────────────────────────────────
function AuthSection() {
  const user   = useUser();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
        style={{ background: "var(--color-primary)" }}
      >
        <LogIn size={15} />
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 p-1 rounded-xl transition-colors hover:bg-[var(--color-surface)]"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #0090f0, #7c4ef5)" }}
        >
          {user.displayName?.[0]?.toUpperCase() ?? "P"}
        </div>
        <ChevronDown size={14} style={{ color: "var(--color-text-muted)" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-48 rounded-xl border py-1 z-50"
            style={{
              background:  "var(--color-surface)",
              borderColor: "var(--color-border)",
              boxShadow:   "var(--shadow-lg)",
            }}
          >
            <div className="px-3 py-2 border-b" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                {user.displayName}
              </p>
              <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
                {user.email}
              </p>
            </div>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-[var(--color-surface-2)]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-[var(--color-surface-2)]"
              style={{ color: "#ef4444" }}
            >
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 navbar"
        style={{ height: "var(--navbar-height)" }}
      >
        <div className="h-full max-w-[1400px] mx-auto px-4 flex items-center gap-4">
          <Logo />

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 ml-4">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "text-[var(--color-primary)] bg-[var(--color-primary-subtle)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
                  )}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 ml-auto">
            {/* Search shortcut */}
            <button
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[var(--color-surface)]"
              style={{ color: "var(--color-text-muted)" }}
              aria-label="Search"
            >
              <Search size={16} />
              <span className="text-xs">⌘K</span>
            </button>

            <LocaleToggle />
            <ThemeMenu />
            <AuthSection />

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg transition-colors hover:bg-[var(--color-surface)]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen
                ? <X size={20} style={{ color: "var(--color-text-primary)" }} />
                : <Menu size={20} style={{ color: "var(--color-text-primary)" }} />
              }
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-y-0 right-0 w-72 z-50 lg:hidden flex flex-col"
            style={{
              background:  "var(--color-bg)",
              borderLeft:  "1px solid var(--color-border)",
              paddingTop:  "var(--navbar-height)",
            }}
          >
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      active
                        ? "text-[var(--color-primary)] bg-[var(--color-primary-subtle)]"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
