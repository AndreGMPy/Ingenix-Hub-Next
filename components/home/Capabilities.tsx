"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Check, ChevronRight } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { capabilities, site, type Capability, type CapabilityId } from "@/data/site";
import { useMedia } from "@/lib/use-media";
import { motionTokens } from "@/lib/motion";
import { CapabilityPreview } from "./CapabilityPreview";
export function Capabilities({ items = capabilities }: { items?: readonly Capability[] }) {
  const [active, setActive] = useState<CapabilityId>("web");
  const [instant, setInstant] = useState(true);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const lastSelection = useRef(0);
  const reduced = useMedia("(prefers-reduced-motion:reduce)");
  const selected = items.find(item => item.id === active) ?? items[0];
  const choose = (id: CapabilityId, immediate: boolean, timeStamp: number) => {
    const rapid = lastSelection.current > 0 && Number.isFinite(timeStamp) && timeStamp >= lastSelection.current && timeStamp - lastSelection.current < motionTokens.normal * 1000;
    setInstant(immediate || rapid);
    lastSelection.current = timeStamp;
    setActive(id);
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    choose(items[next].id, true, event.timeStamp);
    buttons.current[next]?.focus();
  };
  return <section id="servicios" className="capabilities-section section-pad container" aria-labelledby="capabilities-title">
    <div className="section-heading capabilities-heading"><div><p className="eyebrow">02 / Lo que podemos construir</p><h2 id="capabilities-title">La solución cambia.<br />El cuidado, no.</h2></div><p>Explora las piezas.<br />Imagina cómo encajan en tu negocio.</p></div>
    {selected ? <div className="capabilities-explorer"><div role="tablist" aria-label="Seleccionar servicio" aria-orientation="horizontal" className="capability-tabs">
      {items.map((item,index) => <button key={item.id} role="tab" type="button" id={"tab-" + item.id} aria-controls={"panel-" + selected.id} aria-selected={selected.id === item.id} tabIndex={selected.id === item.id ? 0 : -1} data-instant={instant || undefined} ref={element => { buttons.current[index] = element; }} onClick={event => choose(item.id, event.detail === 0, event.timeStamp)} onKeyDown={event => onKey(event,index)} className={selected.id === item.id ? "capability-tab is-active" : "capability-tab"}>
        <span className="tab-number mono">{item.number}</span><span className="tab-copy"><strong>{item.name}</strong><small>{item.short}</small></span><ChevronRight size={17} aria-hidden="true" />
      </button>)}
    </div><div className="capability-panel" id={"panel-" + selected.id} role="tabpanel" aria-labelledby={"tab-" + selected.id} tabIndex={0}>
      <div className="preview-toolbar"><span className="mono">VISTA CONCEPTUAL</span><span className="preview-toolbar-label">{selected.name}<span className="status-dot" /></span></div>
      <div className="preview-stage" aria-hidden="true"><motion.div key={selected.id} className="preview-transition" initial={instant || reduced ? false : { opacity: 0, transform: "translateY(6px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: instant || reduced ? 0 : motionTokens.normal, ease: motionTokens.easeOut }}><CapabilityPreview id={selected.id} /></motion.div></div>
      <div className="capability-detail"><h3>{selected.title}</h3><p>{selected.description}</p><ul>{selected.includes.map(item => <li key={item}><Check size={14} aria-hidden="true" />{item}</li>)}</ul><a href={site.whatsapp + "?text=" + encodeURIComponent("Hola, me interesa " + selected.name.toLowerCase() + " para mi negocio.")} target="_blank" rel="noopener noreferrer" className="text-link">Conversemos sobre tu proyecto<ArrowUpRight size={16} aria-hidden="true" /></a><Link href={selected.href} className="text-link">Más sobre {selected.name.toLowerCase()}<ChevronRight size={16} aria-hidden="true" /></Link></div>
    </div></div> : <p className="empty-state">Cuéntanos qué necesitas y definimos la solución contigo.</p>}
  </section>;
}

