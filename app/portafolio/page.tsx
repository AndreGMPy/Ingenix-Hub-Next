import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { NixChat } from "@/components/nix/NixChat";
import { CaseStudy } from "@/components/portfolio/SelectedWork";
import { projects } from "@/data/projects";
import { creativeWork, jsonLdScript } from "@/lib/schema";
export const metadata:Metadata={title:"Portafolio: demos de páginas web y tiendas en línea",description:"Demos interactivos de Ingenix Hub: tiendas en línea, catálogos y sitios para moda, mezclilla, uniformes y estética médica, con pedido por WhatsApp. Marcas ficticias.",alternates:{canonical:"/portafolio"}};
export default function PortfolioPage(){return <><Header/><main id="contenido" className="container portfolio-full section-pad"><script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript({"@context":"https://schema.org","@type":"ItemList",name:"Portafolio de Ingenix Hub",itemListElement:projects.map((project,index)=>({"@type":"ListItem",position:index+1,item:creativeWork(project)}))})}/><p className="eyebrow">Ingenix Hub / Portafolio</p><h1>Trabajo que puedes explorar.</h1><p className="section-lead">Demos interactivos de tiendas, catálogos y sitios. Son marcas ficticias con fotografía generada con IA: ábrelos y pruébalos como lo haría tu cliente.</p><Link href="/#proyectos" className="text-link">← Volver a Ingenix Hub</Link><div className="portfolio-full-list">{projects.map((project,index)=><CaseStudy key={project.slug} project={project} index={index} total={projects.length} eager={index===0} level={2}/>)}</div></main><Footer/><BottomNav/><NixChat/></>;}

