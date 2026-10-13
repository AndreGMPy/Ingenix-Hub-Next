import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";
import { HeaderState } from "./HeaderState";
export function Header() {
  return <header className="site-header">
    <div className="container header-inner">
      <Link className="brand" href="/#inicio" aria-label="Ingenix Hub · Inicio"><Image src="/brand/logo.png" alt="Ingenix Hub" width={176} height={50} priority sizes="176px" className="brand-logo" /><Image src="/brand/ingenix-isotipo-square.png" alt="" width={44} height={44} sizes="44px" className="brand-isotype" priority /></Link>
      <nav className="desktop-nav" aria-label="Navegación principal">
        <Link href="/#servicios">Lo que hacemos</Link><Link href="/#proyectos">Proyectos</Link><Link href="/#nix">Nix / IA</Link>
      </nav>
      <div className="header-actions"><ThemeToggle /><a className="button button-small header-cta" href={site.quote} target="_blank" rel="noopener noreferrer">Hablemos<ArrowUpRight size={16} aria-hidden="true" /></a></div>
    </div><HeaderState />
  </header>;
}

