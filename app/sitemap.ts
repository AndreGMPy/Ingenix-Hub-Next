import type { MetadataRoute } from "next";
import { cities, services } from "@/data/landings";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => site.domain + path;
  return [
    { url: url(""), changeFrequency: "monthly", priority: 1 },
    ...services.map(s => ({ url: url("/" + s.slug), changeFrequency: "monthly" as const, priority: .9 })),
    ...cities.map(c => ({ url: url("/" + c.slug), changeFrequency: "monthly" as const, priority: .9 })),
    { url: url("/portafolio"), changeFrequency: "monthly", priority: .8 },
    ...projects.map(p => ({ url: url("/portafolio/" + p.slug), changeFrequency: "yearly" as const, priority: p.kind === "demo" ? .4 : .6, images: [url(p.image)] })),
  ];
}
