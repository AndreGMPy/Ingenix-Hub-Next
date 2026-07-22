import { BriefcaseBusiness, CalendarCheck, Camera, Gauge, Layers3, Mail, MessageCircle, Monitor, Share2, Smartphone } from "lucide-react";
import { ExperienceLab } from "@/components/home/ExperienceLab";
import { HeroExperience } from "@/components/home/HeroExperience";
import { IntroLoader } from "@/components/home/IntroLoader";
import { SystemBlueprint } from "@/components/home/SystemBlueprint";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { PortfolioCarousel } from "@/components/portfolio/PortfolioCarousel";
import { PageEnhancements } from "@/components/ui/PageEnhancements";
import { faq, links, processSteps, services } from "@/data/site";

const serviceIcons = [Monitor, Layers3, Smartphone, Gauge];

export default function HomePage() {
  return (
    <>
      <IntroLoader />
      <Header />
      <PageEnhancements />
      <main id="main">
        <HeroExperience />

        <section className="mobile-proof" aria-label="Ventajas principales"><div className="container proof-row">
          <div data-reveal><strong>Mobile-first</strong><span>Diseñada para clientes que te ven desde el teléfono.</span></div>
          <div data-reveal><strong>Sin plantillas</strong><span>Diseño adaptado a tu marca y objetivo real.</span></div>
          <div data-reveal><strong>Cotización directa</strong><span>Hablamos tu idea y te propongo el mejor alcance.</span></div>
        </div></section>

        <section className="section services-section" id="services"><div className="container">
          <div className="section-heading" data-reveal><span className="section-pill">Servicios</span><h2>Soluciones digitales que se sienten hechas para tu negocio</h2><p>No se trata de llenar una página de efectos. Se trata de que tu cliente entienda, confíe y te contacte rápido.</p></div>
          <div className="services-grid">{services.map((service, index) => { const Icon = serviceIcons[index]; return <article key={service.code} className="service-card tilt-card scan-card" data-reveal><span className="card-code">{service.code}</span><div className="service-icon"><Icon aria-hidden="true" /></div><h3>{service.title}</h3><p>{service.description}</p></article>; })}</div>
        </div></section>

        <section className="section architecture-section" id="architecture"><div className="container architecture-layout">
          <div className="section-heading architecture-heading" data-reveal><span className="section-pill">Sistema conectado</span><h2>No solo diseño: conectamos cada parte de tu negocio</h2><p>Unimos tu presencia digital, atención, información y procesos para que todo trabaje como un solo sistema.</p></div>
          <div data-reveal><SystemBlueprint /></div>
        </div></section>

        <section className="section wow-section" id="experience-lab"><div className="container" data-reveal><ExperienceLab /></div></section>

        <section className="section portfolio-section" id="portfolio"><div className="container">
          <div className="section-heading" data-reveal><span className="section-pill">Portafolio</span><h2>Proyectos con estilo, estructura y contacto claro</h2><p>Un carrusel 3D con algunos trabajos desarrollados para negocios y proyectos reales.</p></div>
          <div data-reveal><PortfolioCarousel /></div>
        </div></section>

        <section className="section process-section" id="process"><div className="container">
          <div className="section-heading" data-reveal><span className="section-pill">Proceso</span><h2>Cotización directa, sin paquetes cerrados</h2><p>Cada negocio necesita algo diferente. Primero entiendo tu idea y después te digo qué conviene construir.</p></div>
          <div className="process-grid">{processSteps.map(step => <article className="process-card" key={step.number} data-reveal><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
        </div></section>

        <section className="quote-section" id="quote"><div className="container quote-panel" data-reveal>
          <div className="quote-copy"><span className="section-pill">Cotización</span><h2>No vendo paquetes genéricos. Te cotizo lo que tu negocio realmente necesita.</h2><p>Así evitas pagar por funciones que no usarás y tienes una propuesta más clara para tu presupuesto, etapa y objetivo.</p></div>
          <div className="quote-actions"><a className="btn btn-primary" href={links.quote} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />Cotizar por WhatsApp</a><a className="btn btn-ghost" href={links.calendly} target="_blank" rel="noopener noreferrer"><CalendarCheck aria-hidden="true" />Agendar llamada</a></div>
        </div></section>

        <section className="section faq-section" id="faq"><div className="container faq-layout">
          <div className="section-heading section-heading-left" data-reveal><span className="section-pill">FAQ</span><h2>Antes de empezar</h2><p>Respuestas rápidas para que sepas cómo se trabaja una cotización personalizada.</p></div>
          <div className="faq-list" data-reveal>{faq.map((item, index) => <details className="faq-item" open={index === 0} key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
        </div></section>

        <section className="section contact-section" id="contact"><div className="container">
          <div className="section-heading" data-reveal><span className="section-pill">Contacto</span><h2>Hablemos de tu proyecto</h2><p>Envíame tu idea por WhatsApp o agenda una llamada. Te ayudo a aterrizarla aunque todavía no sepas exactamente qué pedir.</p></div>
          <div className="contact-grid">
            <div className="contact-card" data-reveal>
              <a className="contact-row" href={links.contact} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" /><span><strong>WhatsApp</strong><small>+52 445 182 0808</small></span></a>
              <a className="contact-row" href={links.email}><Mail aria-hidden="true" /><span><strong>Correo</strong><small>ingenixhub@gmail.com</small></span></a>
              <a className="contact-row" href={links.instagram} target="_blank" rel="noopener noreferrer"><Camera aria-hidden="true" /><span><strong>Instagram</strong><small>@ingenixhub</small></span></a>
              <a className="contact-row" href={links.facebook} target="_blank" rel="noopener noreferrer"><Share2 aria-hidden="true" /><span><strong>Facebook</strong><small>Ingenix Hub</small></span></a>
              <a className="contact-row" href={links.linkedin} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness aria-hidden="true" /><span><strong>LinkedIn</strong><small>Brandon André Gordillo Moreno</small></span></a>
            </div>
            <div className="calendar-card" data-reveal><div className="calendar-placeholder"><div className="calendar-matrix" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <span key={index} />)}</div><strong>Agenda una llamada de diagnóstico</strong><p>Si el calendario tarda en cargar, puedes abrir Calendly directamente.</p><a className="btn btn-ghost" href={links.calendly} target="_blank" rel="noopener noreferrer">Abrir Calendly</a></div><iframe className="calendly-inline-widget calendar-frame" title="Agenda una llamada con Ingenix Hub" src={`${links.calendly}?hide_gdpr_banner=1`} loading="lazy" /></div>
          </div>
        </div></section>
      </main>
      <Footer />
      <SiteChrome />
    </>
  );
}
