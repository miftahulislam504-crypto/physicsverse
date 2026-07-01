// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { ALL_CHAPTERS } from "@/lib/constants/chapters-data";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://physicsverse.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                     lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/explore`,        lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/learn`,          lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/lab`,            lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/playground`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/practice`,       lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE_URL}/encyclopedia`,   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/community`,      lastModified: new Date(), changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE_URL}/ai-tutor`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const chapterRoutes: MetadataRoute.Sitemap = ALL_CHAPTERS.map((ch) => ({
    url:             `${BASE_URL}/learn/${ch.slug}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.8,
  }));

  return [...staticRoutes, ...chapterRoutes];
}
