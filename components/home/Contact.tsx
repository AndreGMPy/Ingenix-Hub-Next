import Image from "next/image";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { site } from "@/data/site";
import { NixButton } from "@/components/ui/NixButton";
export function Contact() {
 return <section id="contacto" className="contact-section section-pad" aria-labelledby="contact-title">
  <div className="contact-circuit" aria-hidden="true"><svg viewBox="0 0 1200 500" fill="none"><path d="M0 80H210L320 190H570L730 350H1200M0 400H300L440 260H810L990 80H1200"/><circle cx="570" cy="190" r="7"/><circle cx="810" cy="260" r="7"/></svg></div>
  <div className="container contact-layout"><div className="contact-main"><p className="eyebrow">07 / EL SIGUIENTE PROYECTO PUEDE SER EL TUYO</p><h2 id="contact-title">¿Tienes una idea?<br/><span>Construyámosla.</span></h2><p className="section-lead">Tu primera web o la herramienta que tu negocio lleva tiempo necesitando. Hagamos que pase.</p>
  <div className="contact-actions"><a href={site.quote} className="button" target="_blank" rel="noopener noreferrer"><MessageCircle size={19} aria-hidden="true"/>Escríbenos por WhatsApp<ArrowUpRight size={18} aria-hidden="true"/></a><NixButton className="text-link">Prefiero hablar con Nix</NixButton></div><p className="contact-note"><span className="status-dot"/>Diagnóstico inicial y cotización sin costo.</p></div>
  <div className="contact-stamp" aria-hidden="true"><Image src="/brand/logo.png" width={300} height={85} sizes="260px" alt=""/><span className="mono">DE LA IDEA A LO REAL</span><div className="stamp-corners">+<span>+</span></div></div>
  <div className="contact-direct"><span className="mono">HABLEMOS DIRECTO</span><a href={site.telephone}>{site.phone}<ArrowUpRight size={19} aria-hidden="true"/></a><a href={"mailto:"+site.email}><Mail size={18} aria-hidden="true"/>{site.email}</a><span>Ingenix Hub · México</span></div></div>
 </section>;
}

