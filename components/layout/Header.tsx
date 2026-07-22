"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

const items = [
  ["Inicio", "hero"], ["Servicios", "services"], ["Portafolio", "portfolio"],
  ["Proceso", "process"], ["Cotización", "quote"], ["Contacto", "contact"],
];

export function Header({ portfolio = false }: { portfolio?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const dark = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("ingenix-theme-change", onChange);
      window.addEventListener("storage", onChange);
      return () => {
        window.removeEventListener("ingenix-theme-change", onChange);
        window.removeEventListener("storage", onChange);
      };
    },
    () => { try { return localStorage.getItem("ingenix-theme") === "dark"; } catch { return false; } },
    () => false,
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);
    try { localStorage.setItem("ingenix-theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  useEffect(() => {
    const progress = document.getElementById("scroll-progress");
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
      setScrolled(value => {
        const next = window.scrollY > 12;
        return value === next ? value : next;
      });
    };
    const spotlight = document.getElementById("cursor-spotlight");
    const onPointer = (event: PointerEvent) => {
      if (spotlight) spotlight.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [reduceMotion]);

  const hrefFor = (anchor: string) => portfolio ? `/#${anchor}` : `#${anchor}`;
  const toggleTheme = () => {
    try { localStorage.setItem("ingenix-theme", dark ? "light" : "dark"); } catch {}
    window.dispatchEvent(new Event("ingenix-theme-change"));
  };

  return (
    <>
      <a href="#main" className="skip-link">Saltar al contenido</a>
      <div className="scroll-progress" id="scroll-progress" aria-hidden="true" />
      <div className="cursor-spotlight" id="cursor-spotlight" aria-hidden="true" />
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`} id="site-header">
        <div className="top-ribbon"><Link href={portfolio ? "/#quote" : "#quote"}><strong>{portfolio ? "Portafolio:" : "Diagnóstico gratis:"}</strong>{" "}{portfolio ? "algunos proyectos públicos y vistas previas autorizadas." : "platícame tu idea y te digo qué tipo de web, catálogo o app te conviene."}</Link></div>
        <nav className="site-nav" aria-label="Navegación principal">
          <Link href={portfolio ? "/#hero" : "#hero"} className="logo-link" aria-label="Ir al inicio de Ingenix Hub"><Image src="/images/logo_no_bg.png" alt="Ingenix Hub" className="logo-img" width={1254} height={357} priority /></Link>
          <ul className="nav-links" id="nav-links">
            {items.map(([label, anchor]) => <li key={anchor}><Link className="nav-item" href={hrefFor(anchor)}>{label}</Link></li>)}
          </ul>
          <button className="theme-toggle" type="button" aria-label={dark ? "Activar tema claro" : "Activar tema oscuro"} onClick={toggleTheme}>{dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</button>
        </nav>
      </header>
    </>
  );
}
