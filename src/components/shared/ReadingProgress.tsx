"use client";

// src/components/shared/ReadingProgress.tsx
import { useEffect, useState } from "react";

interface ReadingProgressProps {
  color?: string;
}

export function ReadingProgress({ color = "var(--color-primary)" }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollTop    = window.scrollY;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    }

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-0.5 pointer-events-none"
      style={{ background: "var(--color-border)" }}
    >
      <div
        className="h-full transition-[width] duration-100"
        style={{ width: `${progress}%`, background: color }}
      />
    </div>
  );
}
