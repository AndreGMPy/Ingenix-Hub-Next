import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight,Plus,ArrowRight } from "lucide-react";
import { projects,type Project } from "@/data/projects";
import { PortfolioCarousel } from "./PortfolioCarousel";
export function CaseStudy({project,index,total,eager=false}:{project:Project;index:number;total:number;eager?:boolean}){
 return <article className={"case-study case-"+project.slug} data-project-index={index} aria-labelledby={"case-"+project.slug} aria-roledescription="proyecto" aria-label={String(index+1)+" de "+total}>
  <a draggable={false} className="case-media-link" href={project.href} target="_blank" rel="noopener noreferrer" aria-label={"Visitar "+project.title}><div className="portfolio-scroll-plane"><div className="browser-chrome" aria-hidden="true"><span className="browser-dots"><i/><i/><i/></span><span>{project.domain}</span><ArrowUpRight size={14}/></div><Image draggable={false} src={project.image} alt={"Screenshot real de "+project.title} width={project.width} height={project.height} sizes="(max-width:767px) 90vw, (max-width:1440px) 78vw, 1100px" quality={85} loading={eager?"eager":"lazy"} className="case-screenshot"/></div></a>
  <div className="case-caption"><div className="case-title-row"><div><p className="mono case-category">{project.category}</p><h3 id={"case-"+project.slug}>{project.title}</h3></div><a className="button button-small case-visit" href={project.href} target="_blank" rel="noopener noreferrer">Visitar sitio<ArrowUpRight size={17} aria-hidden="true"/></a></div><p className="case-summary">{project.summary}</p>{project.description&&<p className="case-description">{project.description}</p>}
  {!!project.technologies.length&&<div className="case-tech">{project.technologies.map(item=><span key={item}>{item}</span>)}</div>}
  {!!project.scope.length&&<details className="case-details"><summary>Ver alcance<Plus size={16} aria-hidden="true"/></summary><ul>{project.scope.map(item=><li key={item}>{item}</li>)}</ul></details>}</div>
 </article>;
}
export function SelectedWork({items=projects}:{items?:readonly Project[]}){
 return <section id="proyectos" className="selected-work section-pad" aria-labelledby="work-title"><div className="container"><div className="section-heading work-heading"><div><p className="eyebrow">04 / Construido por Ingenix Hub</p><h2 id="work-title">No hace falta imaginarlo.<br/><span className="accent-text">Ya está en la web.</span></h2></div><p>Explora nuestros proyectos.<br/>Cada uno tiene su propia historia.</p></div>
 {items.length?<PortfolioCarousel names={items.map(p=>p.title)}>{items.map((project,index)=><CaseStudy key={project.slug} project={project} index={index} total={items.length}/>)}</PortfolioCarousel>:<p className="empty-state">Pronto podrás explorar más proyectos. Mientras tanto, conversemos sobre el tuyo.</p>}
 <div className="work-all"><Link href="/portafolio" className="text-link">Ver portafolio completo<ArrowRight size={18} aria-hidden="true"/></Link><span className="mono">DISEÑO PROPIO · PROYECTOS REALES</span></div></div></section>;
}

