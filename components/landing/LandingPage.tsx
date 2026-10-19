import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { NixChat } from "@/components/nix/NixChat";
import { NixButton } from "@/components/ui/NixButton";
import { Process } from "@/components/home/Process";
import { Contact } from "@/components/home/Contact";
import { caseDetails, projectBySlug } from "@/data/projects";
import { cities, services, type Block, type Faq, type Landing } from "@/data/landings";
import { site, zone } from "@/data/site";
import { breadcrumbs, faqPage, jsonLdScript, serviceLd } from "@/lib/schema";

function whatsapp(text: string) { return site.whatsapp + "?text=" + encodeURIComponent(text); }

function Blocks({ items, numbered = false }: { items: readonly Block[]; numbered?: boolean }) {
  return <ol className={"landing-blocks" + (numbered ? " is-numbered" : "")}>{items.map((item, index) => <li key={item.title}>
    {numbered && <span className="mono">{String(index + 1).padStart(2, "0")}</span>}<h3>{item.title}</h3><p>{item.text}</p>
  </li>)}</ol>;
}
function Faqs({ items }: { items: readonly Faq[] }) {
  return <section className="landing-section landing-faq" aria-labelledby="faq-title">
    <div className="landing-heading"><p className="eyebrow">Preguntas frecuentes</p><h2 id="faq-title">Lo que suelen preguntarnos.</h2></div>
    <div className="landing-faq-list">{items.map(item => <details key={item.q}><summary><span>{item.q}</span><Plus size={18} aria-hidden="true" /></summary><p>{item.a}</p></details>)}</div>
  </section>;
}
function RelatedProjects({ slugs, note, title }: { slugs: readonly string[]; note?: string; title: string }) {
  const items = slugs.map(projectBySlug).filter(project => !!project);
  return <section className="landing-section" aria-labelledby="related-title">
    <div className="landing-heading"><p className="eyebrow">Portafolio</p><h2 id="related-title">{title}</h2>{note && <p className="landing-note">{note}</p>}</div>
    {!!items.length && <ul className="landing-projects">{items.map(project => <li key={project.slug}>
      <Link href={"/portafolio/" + project.slug} className="landing-project">
        <span className="landing-project-media"><Image src={project.image} alt={caseDetails[project.slug]?.alt ?? "Captura del sitio " + project.title} width={project.width} height={project.height} sizes="(max-width:767px) 90vw, 420px" quality={75} /></span>
        <span className="mono">{project.category}{project.kind === "demo" ? " · Demo" : ""}</span>
        <strong>{project.title}</strong><span className="landing-project-summary">{project.summary}</span>
        <span className="text-link">Ver caso<ArrowRight size={16} aria-hidden="true" /></span>
      </Link></li>)}</ul>}
    <Link href="/portafolio" className="text-link">Ver todo el portafolio<ArrowRight size={16} aria-hidden="true" /></Link>
  </section>;
}
function Explore({ current }: { current: string }) {
  return <nav className="landing-section landing-explore" aria-label="Más servicios y ciudades">
    <div><p className="eyebrow">Otros servicios</p><ul>{services.filter(s => s.slug !== current).map(s => <li key={s.slug}><Link href={"/" + s.slug}>{s.name}<ArrowRight size={14} aria-hidden="true" /></Link></li>)}</ul></div>
    <div><p className="eyebrow">Atendemos</p><ul>{cities.filter(c => c.slug !== current).map(c => <li key={c.slug}><Link href={"/" + c.slug}>{c.city}<ArrowRight size={14} aria-hidden="true" /></Link></li>)}</ul>
      <p className="landing-note">Zona extendida: {zone.extended.join(", ")}. {zone.online}.</p></div>
  </nav>;
}

export function LandingPage({ landing }: { landing: Landing }) {
  const path = "/" + landing.slug;
  const isService = landing.kind === "service";
  const label = isService ? landing.name : landing.city;
  const ld = [
    breadcrumbs([["Inicio", "/"], [isService ? "Servicios" : "Ciudades", isService ? "/#servicios" : "/"], [label, path]]),
    faqPage(landing.faqs),
    ...(isService ? [serviceLd(landing.name, landing.description, path)] : []),
  ];
  const message = isService ? `Hola, me interesa ${landing.name.toLowerCase()} para mi negocio.` : `Hola, tengo un negocio en ${landing.city} y quiero cotizar un proyecto.`;
  return <><a className="skip-link" href="#contenido">Ir al contenido</a><Header />
    <main id="contenido" className={"landing landing-" + landing.kind}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(ld)} />
      <div className="container">
        <nav className="landing-crumbs mono" aria-label="Ruta de navegación"><Link href="/">Inicio</Link><span aria-hidden="true">/</span>{isService ? <Link href="/#servicios">Servicios</Link> : <span>Ciudades</span>}<span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav>
        <header className="landing-hero">
          <p className="eyebrow"><span className="status-dot" />{isService ? "Servicio · " + zone.base.city + ", " + zone.base.region : landing.city + ", " + zone.base.region}</p>
          <h1>{landing.h1}</h1>
          <p className="section-lead">{landing.lead}</p>
          <div className="landing-actions"><a href={whatsapp(message)} target="_blank" rel="noopener noreferrer" className="button">Cotizar por WhatsApp<ArrowUpRight size={18} aria-hidden="true" /></a><NixButton className="text-link">Preguntarle a Nix</NixButton></div>
          <p className="landing-note"><span className="status-dot" />Diagnóstico y cotización sin costo.</p>
        </header>
        {isService ? <>
          <section className="landing-section" aria-labelledby="includes-title"><div className="landing-heading"><p className="eyebrow">Qué incluye</p><h2 id="includes-title">Lo que construimos contigo.</h2></div><Blocks items={landing.includes} numbered /></section>
          <section className="landing-section landing-split" aria-label="Para quién es y qué resuelve">
            <div><p className="eyebrow">Para quién es</p><h2>Pensado para</h2><ul className="landing-list">{landing.forWhom.map(item => <li key={item}>{item}</li>)}</ul></div>
            <div><p className="eyebrow">Qué resuelve</p><h2>Problemas que deja atrás</h2><Blocks items={landing.problems} /></div>
          </section>
          <RelatedProjects slugs={landing.projects} note={landing.projectsNote} title={landing.projects.length ? "Demos relacionados" : "Ejemplos"} />
        </> : <>
          <section className="landing-section" aria-labelledby="economy-title"><div className="landing-heading"><p className="eyebrow">Negocios de {landing.city}</p><h2 id="economy-title">Cómo se mueve la economía local.</h2></div><Blocks items={landing.economy} /></section>
          <section className="landing-section" aria-labelledby="help-title"><div className="landing-heading"><p className="eyebrow">Cómo ayudamos</p><h2 id="help-title">Web, tiendas, catálogos y sistemas.</h2></div><Blocks items={landing.howWeHelp} numbered />
            <p className="landing-links">Conoce más: <Link href="/paginas-web">páginas web</Link> · <Link href="/tiendas-en-linea">tiendas en línea</Link> · <Link href="/sistemas-web">sistemas web</Link></p></section>
          <RelatedProjects slugs={landing.projects} note={landing.projectsNote} title={landing.slug === "moroleon" || landing.slug === "uriangato" ? "Demos para el sector textil" : "Demos de referencia"} />
          <p className="landing-note landing-nearby">{landing.nearby}</p>
        </>}
      </div>
      <Process eyebrow="Cómo trabajamos" />
      <div className="container"><Faqs items={landing.faqs} /><Explore current={landing.slug} /></div>
      <Contact eyebrow="El siguiente proyecto puede ser el tuyo" />
    </main><Footer /><BottomNav /><NixChat /></>;
}
