"use client";

// src/components/layout/NavbarWithSearch.tsx
// Drop-in replacement for Navbar that wires up the search modal
// Import this in layout.tsx instead of Navbar if you want the search shortcut

import { useEffect, useState } from "react";
import { SearchModal } from "@/components/shared/SearchModal";

export function SearchTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[var(--color-surface)]"
        style={{ color: "var(--color-text-muted)" }}
        aria-label="Search (⌘K)"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <span className="text-xs">⌘K</span>
      </button>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
