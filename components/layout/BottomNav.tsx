"use client";
import Link from "next/link";

import Image from "next/image";
import { Grid2X2, Home, Layers, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { openNix } from "@/lib/nix-events";
const destinations = [
  { id: "inicio", label: "Inicio", Icon: Home },
  { id: "servicios", label: "Servicios", Icon: Grid2X2 },
  { id: "nix", label: "Nix" },
  { id: "proyectos", label: "Proyectos", Icon: Layers },
  { id: "contacto", label: "Contacto", Icon: MessageCircle },
];
export function BottomNav() {
  const [active, setActive] = useState("inicio");
  useEffect(() => {
    const elements = destinations.map(d => document.getElementById(d.id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-10% 0px -48% 0px", threshold: [0, 0.15, 0.4] });
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <nav className="bottom-nav" aria-label="Navegación móvil">
    {destinations.map(({ id, label, Icon }) => id === "nix" ?
      <button type="button" key={id} className="bottom-nav-nix" onClick={event => openNix(event.detail === 0)} aria-label="Hablar con Nix"><span className="bottom-nix-avatar"><Image src="/nix/nix.webp" width={54} height={54} alt="" sizes="54px" /></span><span>Nix</span></button> :
      <Link key={id} href={"/#" + id} onClick={() => setActive(id)} aria-current={active === id ? "location" : undefined}>{Icon && <Icon size={21} aria-hidden="true" />}<span>{label}</span></Link>)}
  </nav>;
}

