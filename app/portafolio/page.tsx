import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MessageCircle } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { PageEnhancements } from "@/components/ui/PageEnhancements";
import { links, projects } from "@/data/site";

export const metadata: Metadata = {
  title: "Portafolio",
  description: "Portafolio de Ingenix Hub: páginas web, catálogos digitales, apps web y sistemas para negocios.",
};

export default function PortfolioPage() {
  return (
    <>
      <Header portfolio />
      <PageEnhancements />
      <main id="main">
        <section className="hero portfolio-hero">
          <div className="hero-light hero-light-one" aria-hidden="true" />
          <div className="container hero-layout portfolio-hero-layout">
            <div className="hero-copy" data-reveal><span className="section-pill">Portafolio</span><h1>Proyectos digitales con diseño, estructura y enfoque comercial.</h1><p>Estos proyectos muestran distintos niveles de trabajo: páginas informativas, catálogos, demos comerciales y sistemas privados para control interno.</p>
              <div className="hero-actions"><a className="btn btn-primary magnetic" href={links.portfolioQuote} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />Cotizar algo similar</a><Link className="btn btn-ghost magnetic" href="/"><ArrowLeft aria-hidden="true" />Volver al inicio</Link></div>
            </div>
          </div>
        </section>

        <section className="section portfolio-list-section"><div className="container portfolio-grid-page">
          {projects.map(project => <article className="portfolio-page-card tilt-card scan-card" data-reveal key={project.title}>
            <div className="browser-mockup"><div className="browser-bar"><span /><span /><span /><small>{project.browser}</small></div><Image src={project.image} alt={project.alt} width={1850} height={880} sizes="(max-width: 700px) 92vw, 46vw" /></div>
            <div className="project-info"><small>{project.type}</small><h3>{project.title}</h3><p>{project.description}</p><div className="tech-tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>{project.href ? <a href={project.href} target="_blank" rel="noopener noreferrer">Visitar sitio <ExternalLink aria-hidden="true" /></a> : <span className="private-label">Vista previa privada</span>}</div>
          </article>)}
        </div></section>

        <section className="quote-section"><div className="container quote-panel" data-reveal>
          <div className="quote-copy"><span className="section-pill">Cotización</span><h2>¿Quieres algo parecido para tu negocio?</h2><p>Mándame tu idea y te digo qué tipo de proyecto te conviene: web, catálogo, panel, app o sistema a medida.</p></div>
          <div className="quote-actions"><a className="btn btn-primary magnetic" href={links.portfolioFloat} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />Cotizar por WhatsApp</a><Link className="btn btn-ghost magnetic" href="/#contact">Ver contacto</Link></div>
        </div></section>
      </main>
      <Footer portfolio />
      <SiteChrome portfolio />
    </>
  );
}
