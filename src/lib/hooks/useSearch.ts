"use client";

// src/lib/hooks/useSearch.ts
import { useState, useMemo, useCallback } from "react";
import { ALL_CHAPTERS } from "@/lib/constants/chapters-data";
import { DOMAIN_NODES } from "@/lib/constants/physics-data";

export interface SearchResult {
  id:          string;
  type:        "chapter" | "domain" | "formula" | "tag";
  title:       string;
  description: string;
  href:        string;
  icon:        string;
  color:       string;
}

export function useSearch() {
  const [query, setQuery]     = useState("");
  const [isOpen, setIsOpen]   = useState(false);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const out: SearchResult[] = [];

    // Chapters
    for (const ch of ALL_CHAPTERS) {
      const match =
        ch.title.toLowerCase().includes(q) ||
        ch.description.toLowerCase().includes(q) ||
        ch.tags.some((t) => t.includes(q));
      if (match) {
        const node = DOMAIN_NODES.find((d) => d.id === ch.domain);
        out.push({
          id:          ch.id,
          type:        "chapter",
          title:       ch.title,
          description: ch.description.slice(0, 80) + "…",
          href:        `/learn/${ch.slug}`,
          icon:        node?.icon ?? "📖",
          color:       node?.color ?? "#0090f0",
        });
      }
    }

    // Formulas inside chapters
    for (const ch of ALL_CHAPTERS) {
      for (const f of ch.formulas) {
        if (f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)) {
          const node = DOMAIN_NODES.find((d) => d.id === ch.domain);
          out.push({
            id:          `formula-${ch.id}-${f.name}`,
            type:        "formula",
            title:       f.name,
            description: f.description.slice(0, 80) + "…",
            href:        `/learn/${ch.slug}#formulas`,
            icon:        "∑",
            color:       "#0090f0",
          });
        }
      }
    }

    // Domains
    for (const d of DOMAIN_NODES) {
      if (d.label.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)) {
        out.push({
          id:          d.id,
          type:        "domain",
          title:       d.label,
          description: d.description,
          href:        `/learn?domain=${d.id}`,
          icon:        d.icon,
          color:       d.color,
        });
      }
    }

    return out.slice(0, 10); // Max 10 results
  }, [query]);

  const open  = useCallback(() => setIsOpen(true),  []);
  const close = useCallback(() => { setIsOpen(false); setQuery(""); }, []);

  return { query, setQuery, results, isOpen, open, close };
}
