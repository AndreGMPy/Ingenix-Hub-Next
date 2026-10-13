import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { NixChat } from "@/components/nix/NixChat";
import { CaseStudy } from "@/components/portfolio/SelectedWork";
import { projects } from "@/data/projects";
export const metadata:Metadata={title:"Portafolio",description:"Explora proyectos reales de Ingenix Hub: e-commerce, sitios web y catálogos digitales.",alternates:{canonical:"/portafolio"}};
export default function PortfolioPage(){return <><Header/><main className="container portfolio-full section-pad"><p className="eyebrow">Ingenix Hub / Portafolio</p><h1>Trabajo que puedes explorar.</h1><p className="section-lead">Sitios, tiendas y plataformas. Abre cada proyecto y conoce su alcance.</p><Link href="/#proyectos" className="text-link">← Volver a Ingenix Hub</Link><div className="portfolio-full-list">{projects.map((project,index)=><CaseStudy key={project.slug} project={project} index={index} total={projects.length} eager={index===0}/>)}</div></main><Footer/><BottomNav/><NixChat/></>;}

