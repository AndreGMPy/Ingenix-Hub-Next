"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, MoveRight } from "lucide-react";
import { motion, PanInfo, useReducedMotion } from "motion/react";
import { useState } from "react";
import { projects } from "@/data/site";

function positionClass(index: number, current: number, total: number) {
  const offset = (index - current + total) % total;
  if (offset === 0) return "active";
  if (offset === 1) return "next";
  if (offset === 2) return "far-next";
  if (offset === total - 1) return "prev";
  if (offset === total - 2) return "far-prev";
  return "hidden";
}

export function PortfolioCarousel() {
  const [current, setCurrent] = useState(0);
  const reduceMotion = useReducedMotion();
  const active = projects[current];
  const update = (index: number) => setCurrent((index + projects.length) % projects.length);

  return (
    <>
      <div className="carousel-shell">
        <button className="carousel-btn prev" type="button" aria-label="Proyecto anterior" onClick={() => update(current - 1)}><ChevronLeft aria-hidden="true" /></button>
        <motion.div className="carousel-stage" tabIndex={0} aria-label="Carrusel de proyectos" drag={reduceMotion ? false : "x"} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.12} onDragEnd={(_event, info: PanInfo) => { if (Math.abs(info.offset.x) > 56) update(current + (info.offset.x < 0 ? 1 : -1)); }} onKeyDown={event => { if (event.key === "ArrowLeft") update(current - 1); if (event.key === "ArrowRight") update(current + 1); }}>
          {projects.map((project, index) => {
            const position = positionClass(index, current, projects.length);
            const isActive = index === current;
            return (
              <article key={project.title} className={`project-card carousel-card ${position}`} aria-hidden={!isActive} onClick={event => { if (!isActive) { event.preventDefault(); update(index); } }}>
                <div className="browser-mockup"><div className="browser-bar"><span /><span /><span /><small>{project.browser}</small></div><Image src={project.image} alt={project.alt} width={1850} height={880} sizes="(max-width: 700px) 88vw, 620px" loading={index === 0 ? "eager" : "lazy"} /></div>
                <div className="project-info"><small>{project.type}</small><h3>{project.title}</h3><p>{project.description}</p><div className="tech-tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>
                  {project.href ? <a href={project.href} target="_blank" rel="noopener noreferrer" tabIndex={isActive ? 0 : -1}>Visitar sitio <ExternalLink aria-hidden="true" /></a> : <span className="private-label">Vista previa privada</span>}
                </div>
              </article>
            );
          })}
        </motion.div>
        <button className="carousel-btn next" type="button" aria-label="Proyecto siguiente" onClick={() => update(current + 1)}><ChevronRight aria-hidden="true" /></button>
      </div>
      <div className="carousel-dots" aria-label="Indicadores de proyectos">{projects.map((project, index) => {
        const selected = index === current;
        return <button key={project.title} className={selected ? "active" : ""} type="button" aria-label={`Ver ${project.title}`} aria-current={selected ? "true" : undefined} onClick={() => update(index)}>{selected && <motion.span layoutId="portfolio-position-indicator" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}</button>;
      })}</div>
      <motion.div key={active.title} className="project-inspector" initial={reduceMotion ? false : { opacity: 0.55, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
        <div className="inspector-status"><i /><span>PROJECT INSPECTOR</span></div>
        <div className="inspector-copy"><small>PROYECTO {String(current + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</small><strong>{active.title}</strong><p>{active.description}</p></div>
        <div className="inspector-tech">{active.technologies.map(tech => <span key={tech}>{tech}</span>)}</div><div className="inspector-progress"><motion.span key={current} initial={reduceMotion ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 4.5, ease: "linear" }} /></div>
      </motion.div>
      <div className="center-actions"><Link className="btn btn-ghost" href="/portafolio">Ver portafolio completo <MoveRight aria-hidden="true" /></Link></div>
    </>
  );
}
