import type { MetadataRoute } from "next";

const BASE = "https://atrx.tech";

// Mirrors the published atrx.tech sitemap, plus /instruments.
const routes: { path: string; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/philosophy", priority: 0.8, changeFrequency: "monthly" },
  { path: "/architecture", priority: 0.8, changeFrequency: "monthly" },
  { path: "/performance", priority: 0.8, changeFrequency: "monthly" },
  { path: "/partnerships", priority: 0.8, changeFrequency: "monthly" },
  { path: "/access", priority: 0.8, changeFrequency: "monthly" },
  { path: "/instruments", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/documentation", priority: 0.5, changeFrequency: "yearly" },
  { path: "/risk", priority: 0.5, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${BASE}${r.path === "/" ? "/" : r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
