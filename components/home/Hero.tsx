import { ArrowDown, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { showcase } from "@/data/showcase";
import { HeroPhone } from "@/components/home/HeroPhone";
import { NixButton } from "@/components/ui/NixButton";
const pad = (value: number) => String(value).padStart(2, "0");
export function Hero() {
 const total = pad(showcase.length);
 // #inicio vive fuera del nodo pinned: tras el pin, GSAP deja la sección al final del pin-spacer y el ancla aterrizaría ahí.
 return <div id="inicio" className="hero3d-anchor"><section className="hero3d" aria-labelledby="hero-title">
  <div className="hero3d-glows" aria-hidden="true">{showcase.map((item, index) => <i key={item.slug} className="hero3d-glow" data-index={index} style={{ "--glow": item.color } as React.CSSProperties} />)}</div>
  <div className="hero3d-stage container">
   <div className="hero3d-copy">
    <p className="eyebrow"><span className="status-dot"/>INGENIX HUB — ESTUDIO DE SOFTWARE & DISEÑO</p>
    <h1 id="hero-title">Tu negocio.<br/><span>En otra dimensión.</span></h1>
    <p className="hero3d-description">Una web que se siente tuya. Una tienda lista para vender. Software que hace más fácil tu día.</p>
    <div className="hero3d-actions"><a href={site.quote} target="_blank" rel="noopener noreferrer" className="button">Hablemos de tu proyecto<ArrowUpRight size={18} aria-hidden="true"/></a><a href="#proyectos" className="text-link">Mira lo que construimos<ArrowDown size={16} aria-hidden="true"/></a></div>
   </div>
   <HeroPhone items={showcase}/>
   <div className="hero3d-projects">
    <p className="hero3d-progress mono" aria-hidden="true"><span className="hero3d-count">{showcase.map((item, index) => <span key={item.slug} data-index={index}>{pad(index + 1)}</span>)}</span><span>/ {total}</span></p>
    <ol className="hero3d-list" aria-label="Proyectos en el celular">
     {showcase.map((item, index) => <li key={item.slug} className="hero3d-project" data-index={index} style={{ "--project": item.color } as React.CSSProperties}>
      <span className="mono">{item.category}</span><strong>{item.title}</strong>
     </li>)}
    </ol>
    <p className="hero3d-hint mono" aria-hidden="true"><span/>Desliza para ver proyectos</p>
   </div>
   <div className="hero3d-final">
    <h2>¿Tienes una idea? <span>Construyámosla.</span></h2>
    <div className="hero3d-final-actions"><a href={site.quote} target="_blank" rel="noopener noreferrer" className="button">Escríbenos por WhatsApp<ArrowUpRight size={18} aria-hidden="true"/></a><NixButton/></div>
   </div>
  </div>
 </section></div>;
}
