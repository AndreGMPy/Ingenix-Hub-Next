import { ArrowDownRight, Check } from "lucide-react";
import { architecture } from "@/data/site";
import { ArchitectureFlow } from "./ArchitectureFlow";
export function ArchitectureStory() {
  return <section className="architecture-story section-pad" aria-labelledby="architecture-title"><div className="container architecture-layout">
    <div className="architecture-intro"><p className="eyebrow">03 / Lo que hay detrás</p><h2 id="architecture-title">Una buena interfaz<br />es el comienzo.</h2><p className="section-lead">Debajo hay decisiones, conexiones y procesos. Construimos las piezas que hacen útil a tu producto.</p><ArchitectureFlow /><span className="architecture-direction mono">DE TU NEGOCIO AL RESULTADO<ArrowDownRight size={24} aria-hidden="true" /></span><div className="architecture-notice"><Check size={16} aria-hidden="true" />Cada proyecto incorpora las capas que necesita.</div></div>
    <div className="architecture-stages"><div className="architecture-track" aria-hidden="true"><span className="architecture-track-progress" /></div><ol>
      {architecture.map(stage => <li className="architecture-stage" key={stage.number}><span className="stage-dot" aria-hidden="true" /><div className="stage-number mono">{stage.number}</div><div className="stage-body"><span className="stage-label">{stage.label}</span><h3>{stage.name}</h3><p>{stage.description}</p><div className="stage-tags">{stage.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></li>)}
    </ol></div>
  </div></section>;
}

