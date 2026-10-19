import { test } from "node:test";
import assert from "node:assert/strict";
import { breadcrumbs, creativeWork, faqPage, jsonLdScript, serviceLd, siteGraph, type JsonLd } from "../lib/schema.ts";
import { cities, landings, services } from "../data/landings.ts";
import { caseDetails, projects } from "../data/projects.ts";
import { allCities, site } from "../data/site.ts";

/** Recorre el JSON-LD: sin undefined/null, @type en todo objeto con @id o @context, URLs absolutas. */
function walk(value: unknown, path = "$"): void {
  assert.notEqual(value, undefined, path + " undefined");
  assert.notEqual(value, null, path + " null");
  if (Array.isArray(value)) return value.forEach((v, i) => walk(v, `${path}[${i}]`));
  if (typeof value === "object") {
    const o = value as JsonLd;
    if ("@context" in o) assert.equal(o["@context"], "https://schema.org");
    for (const [k, v] of Object.entries(o)) {
      if (["url", "item", "logo", "image", "sameAs"].includes(k) && typeof v === "string") assert.match(v, /^https:\/\//, `${path}.${k} absoluta`);
      walk(v, `${path}.${k}`);
    }
  } else if (typeof value === "string") assert.ok(value.trim().length > 0, path + " vacío");
}
const roundTrip = (data: JsonLd | JsonLd[]) => JSON.parse(jsonLdScript(data).__html.replace(/\\u003c/g, "<"));

test("JSON-LD global: ProfessionalService, Organization y WebSite con la zona completa", () => {
  const graph = roundTrip(siteGraph())["@graph"] as JsonLd[];
  walk(graph);
  const types = graph.map(n => n["@type"]);
  assert.deepEqual(types, ["Organization", "ProfessionalService", "WebSite"]);
  const business = graph[1];
  assert.deepEqual(business.address, { "@type": "PostalAddress", addressLocality: "Moroleón", addressRegion: "Guanajuato", addressCountry: "MX" });
  assert.equal(business.telephone, "+52 493 263 6339");
  assert.equal(business.email, "ingenixhub@gmail.com");
  assert.deepEqual(business.sameAs, [site.instagram, site.facebook]);
  const served = (business.areaServed as JsonLd[]).map(a => a.name);
  for (const city of allCities) assert.ok(served.includes(city), "falta " + city);
  assert.equal(allCities.length, 7);
});
test("JSON-LD por página: FAQPage, Service, BreadcrumbList y CreativeWork válidos", () => {
  for (const item of landings) {
    const faq = roundTrip(faqPage(item.faqs));
    walk(faq);
    assert.ok(faq.mainEntity.length >= 3);
    for (const q of faq.mainEntity) { assert.equal(q["@type"], "Question"); assert.equal(q.acceptedAnswer["@type"], "Answer"); }
    walk(roundTrip(breadcrumbs([["Inicio", "/"], [item.slug, "/" + item.slug]])));
  }
  for (const s of services) walk(roundTrip(serviceLd(s.name, s.description, "/" + s.slug)));
  for (const p of projects) {
    const work = roundTrip(creativeWork(p));
    walk(work);
    assert.equal(work["@type"], "CreativeWork");
    if (p.kind === "demo") assert.equal(work.creativeWorkStatus, "Demo");
    assert.ok(caseDetails[p.slug], "caso sin reto/solución: " + p.slug);
  }
  assert.equal(jsonLdScript({ x: "</script>" }).__html.includes("</script>"), false);
});
test("Metadatos únicos y con longitud razonable; sin precios ni plazos inventados", () => {
  assert.deepEqual(services.map(s => s.slug), ["paginas-web", "tiendas-en-linea", "sistemas-web", "apps-pwa", "automatizacion", "inteligencia-artificial", "experiencias-inmersivas"]);
  assert.deepEqual(cities.map(c => c.slug), ["moroleon", "uriangato", "salamanca", "irapuato"]);
  const titles = new Set(landings.map(l => l.metaTitle)), descriptions = new Set(landings.map(l => l.description)), h1s = new Set(landings.map(l => l.h1));
  assert.equal(titles.size, landings.length); assert.equal(descriptions.size, landings.length); assert.equal(h1s.size, landings.length);
  for (const l of landings) {
    assert.ok((l.metaTitle + " | Ingenix Hub").length <= 65, "title largo: " + l.metaTitle);
    assert.ok(l.description.length >= 110 && l.description.length <= 165, `description ${l.slug}: ${l.description.length}`);
    assert.doesNotMatch(JSON.stringify(l), /\$\s?\d|\d+\s?(días|semanas|meses)\b/i, "precio o plazo exacto en " + l.slug);
  }
  for (const c of cities) assert.ok(c.h1.startsWith("Páginas web y software en " + c.city));
});
test("Páginas de ciudad con contenido propio (no la misma página con otro nombre)", () => {
  const body = (c: typeof cities[number]) => [c.lead, ...c.economy.map(b => b.text), ...c.howWeHelp.map(b => b.text), c.nearby, c.projectsNote].join(" ").replaceAll(c.city, "");
  const words = (text: string) => new Set(text.toLowerCase().match(/[a-záéíóúñ]{5,}/g));
  for (let i = 0; i < cities.length; i++) for (let j = i + 1; j < cities.length; j++) {
    const a = words(body(cities[i])), b = words(body(cities[j]));
    const shared = [...a].filter(w => b.has(w)).length / Math.min(a.size, b.size);
    assert.ok(shared < 0.5, `${cities[i].slug} y ${cities[j].slug} comparten ${(shared * 100).toFixed(0)}% del vocabulario`);
  }
});
