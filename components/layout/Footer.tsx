import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { site, zone } from "@/data/site";
import { services } from "@/data/landings";
export function Footer() {
 return <footer className="site-footer"><div className="container footer-top"><div className="footer-brand-block"><Link href="/#inicio" aria-label="Ingenix Hub · Inicio"><Image src="/brand/logo.png" width={220} height={63} sizes="220px" alt="Ingenix Hub" className="footer-official-logo"/></Link><p>Lo que imaginas.<br/>Lo que diseñamos. Lo que funciona.</p><span className="footer-signature mono"><span className="status-dot"/>DISEÑO + CÓDIGO + CRITERIO</span></div>
  <div className="footer-column"><span className="mono">EXPLORA</span><Link href="/#servicios">Lo que hacemos</Link><Link href="/portafolio">Portafolio</Link><Link href="/#nix">Conoce a Nix</Link><Link href="/#contacto">Empezar un proyecto<ArrowUpRight size={14}/></Link></div>
  <div className="footer-column"><span className="mono">CONSTRUIMOS</span>{services.map(service=><Link key={service.slug} href={"/"+service.slug}>{service.name}</Link>)}</div>
  <div className="footer-column"><span className="mono">CONECTEMOS</span><a href={site.telephone}>{site.phone}</a><a href={"mailto:"+site.email}>{site.email}</a><div className="footer-social"><a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram<ArrowUpRight size={14}/></a><a href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook<ArrowUpRight size={14}/></a></div></div></div>
  <nav className="container footer-cities" aria-label="Ciudades que atendemos"><span>Atendemos:</span>{zone.primary.map((city,index)=><span key={city.slug}><Link href={"/"+city.slug}>{city.name}</Link>{index<zone.primary.length-1&&<i aria-hidden="true">·</i>}</span>)}<small>y {zone.extended.join(", ")} · en línea para todo México</small></nav>
  <div className="container footer-bottom"><span>© {new Date().getFullYear()} Ingenix Hub · Hecho en México</span><a href={site.domain}>ingenixhub.com</a><Link href="/#inicio">Volver al inicio<ArrowUp size={15} aria-hidden="true"/></Link></div>
 </footer>;
}

