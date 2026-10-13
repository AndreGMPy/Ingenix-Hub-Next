import Image from "next/image";
import { Check } from "lucide-react";
import { NixButton } from "@/components/ui/NixButton";
import { NixConversation } from "./NixConversation";
export function NixSection() {
  return <section id="nix" className="nix-section section-pad" aria-labelledby="nix-title">
    <div className="container nix-layout">
      <div className="nix-portrait"><div className="nix-orbit" aria-hidden="true" /><Image src="/nix/nix.webp" alt="Nix, la mascota y asistente de inteligencia artificial de Ingenix Hub" width={380} height={380} sizes="(max-width:767px) 260px, 380px" className="nix-mascot" />
        <span className="nix-sensor nix-sensor-one mono" aria-hidden="true"><i/>ENTENDER TU IDEA</span><span className="nix-sensor nix-sensor-two mono" aria-hidden="true"><i/>ENCONTRAR EL CAMINO</span><div className="nix-identity"><span className="status-dot" /><span>Nix<span className="nix-identity-small">Tu punto de partida.</span></span></div>
      </div>
      <div className="nix-copy">
        <p className="eyebrow">05 / Inteligencia artificial, en acción</p>
        <h2 id="nix-title"><span className="nix-name">Nix.</span> Tu asistente de IA.<br />Tu idea empieza aquí.</h2>
        <p className="section-lead">Cuéntasela a Nix. Nuestro asistente de IA te ayuda a ordenar lo que necesitas y encontrar por dónde empezar.</p>
        <NixConversation />
        <ol className="nix-flow"><li><Check size={14} aria-hidden="true" />Entiende</li><li>Analiza</li><li>Orienta</li><li>Propone</li><li>Contacto</li></ol>
        <NixButton className="button">Hablar con Nix</NixButton><p className="nix-disclosure">Es una IA. La cotización y las decisiones finales las hacemos contigo.</p>
      </div>
    </div>
  </section>;
}

