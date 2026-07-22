import Link from "next/link";
import { BriefcaseBusiness, Camera, MessageCircle, Share2 } from "lucide-react";
import { links } from "@/data/site";

export function Footer({ portfolio = false }: { portfolio?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© 2026 Ingenix Hub.{portfolio ? "" : " Desarrollo web, apps web y sistemas para negocios."}</p>
        <div className="footer-actions">
          <nav className="footer-socials" aria-label="Redes sociales de Ingenix Hub">
            <a href={links.contact} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><MessageCircle aria-hidden="true" /></a>
            <a href={links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Camera aria-hidden="true" /></a>
            <a href={links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Share2 aria-hidden="true" /></a>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><BriefcaseBusiness aria-hidden="true" /></a>
          </nav>
          <Link href={portfolio ? "/" : "#hero"}>{portfolio ? "Inicio" : "Volver arriba"}</Link>
        </div>
      </div>
    </footer>
  );
}
