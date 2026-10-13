import { ArrowUpRight, Lightbulb, ScanLine, PenTool, Code2, ShieldCheck, Rocket } from "lucide-react";
import { processSteps } from "@/data/site";
const icons=[Lightbulb,ScanLine,PenTool,Code2,ShieldCheck,Rocket];
export function Process() {
 return <section className="process-section section-pad container" aria-labelledby="process-title">
  <div className="section-heading process-heading"><p className="eyebrow">06 / DEL PRIMER MENSAJE AL LANZAMIENTO</p><h2 id="process-title">Tú traes la idea.<br/><span className="accent-text">Nosotros, el camino.</span></h2><p>No necesitas un documento técnico.<br/>Empecemos con lo que quieres resolver.</p></div>
  <div className="process-route" aria-hidden="true"><span/></div>
  <ol className="process-list">{processSteps.map((step,index)=>{const Icon=icons[index];return <li key={step.title}><div className="process-number mono"><span>0{index+1}</span><Icon size={22} aria-hidden="true"/></div><h3>{step.title}</h3><p>{step.description}</p><ArrowUpRight className="process-arrow" size={16} aria-hidden="true"/></li>;})}</ol>
 </section>;
}

