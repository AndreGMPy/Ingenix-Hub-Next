import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://www.ingenixhub.com", changeFrequency: "monthly", priority: 1 }, { url: "https://www.ingenixhub.com/portafolio", changeFrequency: "monthly", priority: .8 }];
}

