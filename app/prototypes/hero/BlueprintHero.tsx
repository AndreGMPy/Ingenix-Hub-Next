"use client";
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { capabilities, site, type CapabilityId } from "@/data/site";
import { CapabilityPreview } from "@/components/home/CapabilityPreview";
export function BlueprintHero() {
  const [active,setActive]=useState<CapabilityId>("web");
  const selected=capabilities.find(item=>item.id===active)!;
  return <section className="blueprint-proto container" id="inicio"><p className="eyebrow">Ingenix Hub / Diseña tu siguiente paso</p><h1>¿Qué necesita<br /><span>tu negocio?</span></h1><p>Elige una pieza. Así podría empezar tu producto digital.</p><div className="blueprint-console"><div className="blueprint-controls">{capabilities.map(cap=><button type="button" key={cap.id} aria-pressed={active===cap.id} onClick={()=>setActive(cap.id)}><span className="mono">{cap.number}</span>{cap.name}<ArrowRight size={15} aria-hidden="true"/></button>)}</div><div className="blueprint-preview" aria-live="polite"><span className="mono">VISTA CONCEPTUAL / {selected.name}</span><div aria-hidden="true"><CapabilityPreview id={active}/></div><a className="button" href={site.whatsapp+"?text="+encodeURIComponent("Me interesa "+selected.name+" para mi negocio.")} target="_blank" rel="noopener noreferrer">Construyamos esta idea<ArrowUpRight size={18} aria-hidden="true"/></a></div></div></section>;
}

