import { allCities, site, zone } from "../data/site.ts";

/* JSON-LD (schema.org). Se serializa escapando "<" según la guía de Next (01-app/02-guides/json-ld.md). */
export type JsonLd = Record<string, unknown>;
export function jsonLdScript(data: JsonLd | JsonLd[]) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
const ID = { business: site.domain + "/#business", organization: site.domain + "/#organization", website: site.domain + "/#website" };
const area = allCities.map(name => ({ "@type": "City", name, containedInPlace: { "@type": "State", name: zone.base.region } }));

export function siteGraph(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization", "@id": ID.organization, name: site.name, url: site.domain,
        logo: { "@type": "ImageObject", url: site.logo, width: 220, height: 63 },
        email: site.email, telephone: site.phone, sameAs: [site.instagram, site.facebook],
      },
      {
        "@type": "ProfessionalService", "@id": ID.business, name: site.name, url: site.domain,
        image: site.logo, logo: site.logo, telephone: site.phone, email: site.email,
        description: "Estudio de software y diseño en Moroleón, Guanajuato: páginas web, tiendas en línea, sistemas web, apps, automatización, inteligencia artificial y experiencias inmersivas.",
        address: { "@type": "PostalAddress", addressLocality: zone.base.city, addressRegion: zone.base.region, addressCountry: zone.base.country },
        areaServed: [...area, { "@type": "Country", name: "México" }],
        sameAs: [site.instagram, site.facebook], parentOrganization: { "@id": ID.organization },
      },
      { "@type": "WebSite", "@id": ID.website, name: site.name, url: site.domain, inLanguage: "es-MX", publisher: { "@id": ID.organization } },
    ],
  };
}
export function faqPage(faqs: readonly { q: string; a: string }[]): JsonLd {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
}
export function serviceLd(name: string, description: string, path: string): JsonLd {
  return { "@context": "https://schema.org", "@type": "Service", name, description, url: site.domain + path, serviceType: name, provider: { "@id": ID.business }, areaServed: area };
}
export function breadcrumbs(items: readonly [string, string][]): JsonLd {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: site.domain + path })) };
}
export function creativeWork(p: { title: string; description: string; image: string; href: string; slug: string; technologies: readonly string[]; kind: string; category: string }): JsonLd {
  return {
    "@context": "https://schema.org", "@type": "CreativeWork", name: p.title, description: p.description,
    url: site.domain + "/portafolio/" + p.slug, image: site.domain + p.image, genre: p.category,
    ...(p.href ? { sameAs: p.href } : {}), ...(p.technologies.length ? { keywords: p.technologies.join(", ") } : {}),
    creator: { "@id": ID.organization }, inLanguage: "es-MX",
    ...(p.kind !== "project" ? { creativeWorkStatus: p.kind === "demo" ? "Demo" : "Concepto" } : {}),
  };
}
