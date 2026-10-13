import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { HeroEcosystem } from "@/components/three/HeroEcosystem";
export function Hero() {
 return <section id="inicio" className="hero container" aria-labelledby="hero-title">
  <div className="hero-copy">
   <p className="eyebrow"><span className="status-dot"/>INGENIX HUB — ESTUDIO DE SOFTWARE & DISEÑO</p>
   <div className="hero-editorial"><h1 id="hero-title">Tu negocio.<br/><span>En otra dimensión.</span></h1>
    <div className="hero-brief"><p className="hero-description">Una web que se siente tuya. Una tienda lista para vender. Software que hace más fácil tu día.</p>
     <div className="hero-actions"><a href={site.quote} target="_blank" rel="noopener noreferrer" className="button">Hablemos de tu proyecto<ArrowUpRight size={18} aria-hidden="true"/></a><a href="#proyectos" className="text-link">Mira lo que construimos<ArrowDown size={16} aria-hidden="true"/></a></div>
    </div>
   </div>
  </div>
  <div className="hero-workbench">
   <div className="workbench-rail mono" aria-hidden="true"><span>DISEÑO + INGENIERÍA</span><span>EST. MÉXICO / PARA TU NEGOCIO</span></div>
   <div className="hero-proof hero-proof-web"><div className="hero-proof-bar mono"><span className="status-dot"/>01 / EXPERIENCIAS REALES</div><Image src="/images/gama-studio.webp" width={1837} height={875} sizes="(max-width:767px) 160px, 300px" alt="Proyecto Gama Studio" quality={75}/><div className="hero-proof-caption"><span>De tu identidad<br/><strong>a tu sitio.</strong></span><ArrowUpRight size={20}/></div></div>
   <HeroEcosystem/>
   <div className="hero-proof hero-proof-commerce"><div className="hero-proof-bar mono"><span className="status-dot"/>02 / NEGOCIOS CONECTADOS</div><div className="hero-mini-order"><span className="mono">TU OPERACIÓN</span><strong>Una venta.<br/>Todo conectado.</strong><div><i/><span>Catálogo</span><span>→</span><span>Pedido</span></div><div><i/><span>Inventario</span><span>→</span><span>Equipo</span></div></div><div className="hero-proof-caption"><span>Software, automatización<br/><strong>e inteligencia artificial.</strong></span><ArrowUpRight size={20}/></div></div>
  </div>
  <div className="hero-bottom"><span>Tu identidad. Nuestra ingeniería.</span><span className="hero-bottom-tags">WEB <i/> E-COMMERCE <i/> SISTEMAS <i/> IA</span><a href="#servicios" aria-label="Continuar a servicios"><ArrowDown size={18} aria-hidden="true"/></a></div>
 </section>;
}

