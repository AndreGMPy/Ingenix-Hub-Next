import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { NixChat } from "@/components/nix/NixChat";
import { NixButton } from "@/components/ui/NixButton";
import { caseDetails, projectBySlug, projects, type Project } from "@/data/projects";
import { services } from "@/data/landings";
import { site } from "@/data/site";
import { breadcrumbs, creativeWork, jsonLdScript } from "@/lib/schema";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map(project => ({ slug: project.slug }));
}
/** Servicios relacionados según la categoría del proyecto (enlaces internos). */
function relatedServices(project: Project) {
  const c = project.category.toLowerCase();
  const slugs = c.includes("e-commerce") || c.includes("catálogo") ? ["tiendas-en-linea", "paginas-web"] : c.includes("plataforma") ? ["sistemas-web", "paginas-web"] : ["paginas-web", "tiendas-en-linea"];
  return services.filter(s => slugs.includes(s.slug));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  const title = `${project.title}: caso de estudio${project.kind === "demo" ? " (demo)" : ""}`;
  const description = `${project.summary} ${project.description}`.slice(0, 158).replace(/\s+\S*$/, "") + "…";
  return {
    title, description, alternates: { canonical: "/portafolio/" + slug },
    openGraph: { type: "article", locale: "es_MX", siteName: "Ingenix Hub", url: "/portafolio/" + slug, title, description, images: [{ url: project.image, width: project.width, height: project.height, alt: caseDetails[slug]?.alt ?? project.title }] },
    twitter: { card: "summary_large_image", title, description, images: [project.image] },
  };
}
export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();
  const detail = caseDetails[slug];
  const index = projects.indexOf(project), next = projects[(index + 1) % projects.length];
  const ld = [creativeWork(project), breadcrumbs([["Inicio", "/"], ["Portafolio", "/portafolio"], [project.title, "/portafolio/" + slug]])];
  return <><a className="skip-link" href="#contenido">Ir al contenido</a><Header />
    <main id="contenido" className="landing case-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(ld)} />
      <div className="container">
        <nav className="landing-crumbs mono" aria-label="Ruta de navegación"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><Link href="/portafolio">Portafolio</Link><span aria-hidden="true">/</span><span aria-current="page">{project.title}</span></nav>
        <header className="landing-hero">
          <p className="eyebrow"><span className="status-dot" />{project.category}</p>
          {project.kind === "demo" && <p className="case-badge mono">Demo · no es un cliente</p>}
          <h1>{project.title}</h1>
          <p className="section-lead">{project.summary}</p>
          <div className="landing-actions">{project.href && <a href={project.href} target="_blank" rel="noopener noreferrer" className="button">Visitar {project.domain}<ArrowUpRight size={18} aria-hidden="true" /></a>}<a href={site.whatsapp + "?text=" + encodeURIComponent("Hola, vi el proyecto " + project.title + " y quiero algo similar.")} target="_blank" rel="noopener noreferrer" className="text-link">Quiero algo similar<ArrowUpRight size={16} aria-hidden="true" /></a></div>
        </header>
        <figure className="case-figure">
          <div className="browser-chrome" aria-hidden="true"><span className="browser-dots"><i /><i /><i /></span><span>{project.domain}</span></div>
          <Image src={project.image} alt={detail?.alt ?? "Captura del sitio " + project.title} width={project.width} height={project.height} sizes="(max-width:1320px) 92vw, 1240px" quality={85} priority />
          <figcaption className="landing-note">Captura de {project.domain}{project.kind === "demo" ? " · demo con marca ficticia" : ""}.</figcaption>
        </figure>
        <div className="landing-section landing-split">
          {detail && <section aria-labelledby="reto"><p className="eyebrow">El reto</p><h2 id="reto">Lo que había que resolver</h2><p className="case-text">{detail.challenge}</p></section>}
          <section aria-labelledby="solucion"><p className="eyebrow">La solución</p><h2 id="solucion">Lo que construimos</h2><p className="case-text">{detail?.solution ?? project.description}</p>
            {!!project.scope.length && <ul className="landing-list">{project.scope.map(item => <li key={item}>{item}</li>)}</ul>}</section>
        </div>
        {!!project.technologies.length && <section className="landing-section" aria-labelledby="tecnologia"><p className="eyebrow">Tecnología</p><h2 id="tecnologia">Con qué está hecho</h2><div className="case-tech">{project.technologies.map(item => <span key={item}>{item}</span>)}</div></section>}
        <nav className="landing-section landing-explore" aria-label="Servicios relacionados y siguiente proyecto">
          <div><p className="eyebrow">Servicios relacionados</p><ul>{relatedServices(project).map(s => <li key={s.slug}><Link href={"/" + s.slug}>{s.name}<ArrowRight size={14} aria-hidden="true" /></Link></li>)}</ul></div>
          <div><p className="eyebrow">Siguiente proyecto</p><ul><li><Link href={"/portafolio/" + next.slug}>{next.title}<ArrowRight size={14} aria-hidden="true" /></Link></li><li><Link href="/portafolio"><ArrowLeft size={14} aria-hidden="true" />Todo el portafolio</Link></li></ul></div>
        </nav>
        <section className="landing-section landing-cta" aria-labelledby="cta-title"><h2 id="cta-title">¿Tienes una idea? <span className="accent-text">Construyámosla.</span></h2>
          <div className="landing-actions"><a href={site.quote} target="_blank" rel="noopener noreferrer" className="button">Escríbenos por WhatsApp<ArrowUpRight size={18} aria-hidden="true" /></a><NixButton /></div></section>
      </div>
    </main><Footer /><BottomNav /><NixChat /></>;
}
