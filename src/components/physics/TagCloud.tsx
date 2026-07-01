"use client";

// src/components/physics/TagCloud.tsx
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ALL_CHAPTERS } from "@/lib/constants/chapters-data";

export function TagCloud() {
  const router    = useRouter();
  const [active, setActive] = useState<string | null>(null);

  // Count tag frequency
  const tags = useMemo(() => {
    const map = new Map<string, number>();
    for (const ch of ALL_CHAPTERS) {
      for (const tag of ch.tags) {
        map.set(tag, (map.get(tag) ?? 0) + 1);
      }
    }
    // Sort by frequency desc, take top 30
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30);
  }, []);

  const maxCount = tags[0]?.[1] ?? 1;

  function handleTag(tag: string) {
    setActive(tag === active ? null : tag);
    // In a real app this would trigger a filter on the learn page
    router.push(`/learn?q=${encodeURIComponent(tag)}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(([tag, count]) => {
        const weight   = count / maxCount; // 0–1
        const fontSize = 11 + weight * 6;  // 11px–17px
        const opacity  = 0.5 + weight * 0.5;

        return (
          <button
            key={tag}
            onClick={() => handleTag(tag)}
            className="px-2.5 py-1 rounded-full border transition-all hover:scale-105"
            style={{
              fontSize,
              opacity,
              background:  active === tag ? "var(--color-primary-subtle)" : "var(--color-surface)",
              borderColor: active === tag ? "rgba(0,144,240,0.4)" : "var(--color-border)",
              color:       active === tag ? "var(--color-primary)" : "var(--color-text-secondary)",
            }}
          >
            {tag}
            <span className="ml-1 text-xs opacity-60">({count})</span>
          </button>
        );
      })}
    </div>
  );
}
