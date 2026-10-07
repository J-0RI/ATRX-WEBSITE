import type { MetadataRoute } from "next";
import { productSection } from "@/content/nav";

const BASE = "https://atrx.tech";

// Preserve published URLs and add the independent product destinations.
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
  const productRoutes = productSection.groups.flatMap((group) => group.items).filter((item) => !routes.some((route) => route.path === item.href)).map((item) => ({ path: item.href, priority: 0.7, changeFrequency: "monthly" as const }));
  return [...routes, ...productRoutes].map((r) => ({
    url: `${BASE}${r.path === "/" ? "/" : r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
