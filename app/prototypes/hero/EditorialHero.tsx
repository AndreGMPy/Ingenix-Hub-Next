import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
export function EditorialHero() {
  return <section className="editorial-proto container" id="inicio"><p className="eyebrow">Ingenix Hub / Software & digital products</p><h1>El diseño atrae.<br /><span>El software hace el resto.</span></h1><div className="editorial-proto-intro"><p>Webs, tiendas en línea y sistemas hechos alrededor de tu negocio. De la primera conversación al producto funcionando.</p><a className="button" href={site.quote} target="_blank" rel="noopener noreferrer">Hablemos de tu proyecto<ArrowUpRight size={18} aria-hidden="true"/></a></div><div className="editorial-proto-work"><a href="https://charlyalexa.com" target="_blank" rel="noopener noreferrer"><Image src="/images/charly-alexa.webp" width={1892} height={917} sizes="90vw" loading="eager" alt="Screenshot real de la tienda Charly Alexa"/></a><div><span className="mono">UN PROYECTO REAL / CHARLY ALEXA</span><p>Catálogo, carrito, pagos y administración.</p><a href="#proyectos" className="text-link">Explorar selected work<ArrowUpRight size={16} aria-hidden="true"/></a></div></div></section>;
}

