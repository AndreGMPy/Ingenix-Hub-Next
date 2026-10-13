import Image from "next/image";
import { MonitorSmartphone,Database,Workflow,BrainCircuit,ArrowDownRight } from "lucide-react";
const nodes=[{Icon:MonitorSmartphone,label:"Interfaz",detail:"Tu cliente entra"},{Icon:Database,label:"Datos",detail:"La información se organiza"},{Icon:Workflow,label:"Procesos",detail:"Las piezas trabajan juntas"},{Icon:BrainCircuit,label:"IA",detail:"El contexto orienta"}];
export function ArchitectureFlow(){return <div className="architecture-flow" aria-label="Información, Ingenix Hub y solución conectada">
 <div className="flow-top mono"><span>01 / TU NEGOCIO</span><ArrowDownRight size={18}/></div>
 <svg className="flow-circuit" viewBox="0 0 500 330" fill="none" aria-hidden="true"><g className="flow-paths"><path d="M100 65H165L200 100V165H250M400 65H335L300 100V165H250M100 265H165L200 230V165H250M400 265H335L300 230V165H250"/><path d="M250 0V105M250 225V330"/></g><g className="flow-beams"><path pathLength="1" d="M100 65H165L200 100V165H250M400 65H335L300 100V165H250M100 265H165L200 230V165H250M400 265H335L300 230V165H250"/><path pathLength="1" d="M250 0V105M250 225V330"/></g><g className="flow-signals"><path pathLength="1" d="M100 65H165L200 100V165H250"/><path pathLength="1" d="M250 165H300V230L335 265H400"/></g></svg>
 <div className="flow-brand"><Image src="/brand/logo.png" width={190} height={54} sizes="190px" alt="Ingenix Hub"/><span className="mono">CONEXIONES CON PROPÓSITO</span></div>
 {nodes.map(({Icon,label,detail},i)=><div className={"flow-node flow-node-"+i} key={label}><Icon size={21} aria-hidden="true"/><strong>{label}</strong><span>{detail}</span></div>)}
 <div className="flow-bottom mono"><span className="status-dot"/>02 / TU SOLUCIÓN CONECTADA</div></div>;}

