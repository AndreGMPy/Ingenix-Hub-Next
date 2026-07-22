"use client";

import { ChartNoAxesCombined, ClipboardList, Database, LayoutDashboard, MessageCircle, Monitor, Network, ShoppingBag, Workflow } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { RefObject, useRef, useState } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";

type Module = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
};

const inputs: Module[] = [
  { id: "web", title: "Página web", shortTitle: "Página", description: "Tu escaparate digital para atraer y convertir clientes.", icon: Monitor },
  { id: "whatsapp", title: "WhatsApp", shortTitle: "WhatsApp", description: "Atención directa y seguimiento desde el canal que ya utilizan tus clientes.", icon: MessageCircle },
  { id: "forms", title: "Formularios", shortTitle: "Formularios", description: "Captura solicitudes, registros y datos sin procesos manuales.", icon: ClipboardList },
  { id: "store", title: "Tienda en línea", shortTitle: "Tienda", description: "Muestra, organiza y recibe pedidos desde un punto claro de venta.", icon: ShoppingBag },
];

const outputs: Module[] = [
  { id: "dashboard", title: "Panel administrativo", shortTitle: "Panel", description: "Controla contenido, pedidos, clientes o información desde un solo lugar.", icon: LayoutDashboard },
  { id: "automation", title: "Automatizaciones", shortTitle: "Automatización", description: "Reduce tareas repetitivas y conecta procesos.", icon: Workflow },
  { id: "data", title: "Datos organizados", shortTitle: "Datos", description: "Información disponible y preparada para tomar decisiones.", icon: Database },
  { id: "reports", title: "Seguimiento y reportes", shortTitle: "Seguimiento", description: "Mantén el control de contactos, solicitudes y resultados.", icon: ChartNoAxesCombined },
];

const modules = [...inputs, ...outputs];
type ButtonRef = RefObject<HTMLButtonElement | null>;

export function SystemBlueprint() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState("web");
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const inputGroupRef = useRef<HTMLDivElement>(null);
  const outputGroupRef = useRef<HTMLDivElement>(null);
  const webRef = useRef<HTMLButtonElement>(null);
  const whatsappRef = useRef<HTMLButtonElement>(null);
  const formsRef = useRef<HTMLButtonElement>(null);
  const storeRef = useRef<HTMLButtonElement>(null);
  const dashboardRef = useRef<HTMLButtonElement>(null);
  const automationRef = useRef<HTMLButtonElement>(null);
  const dataRef = useRef<HTMLButtonElement>(null);
  const reportsRef = useRef<HTMLButtonElement>(null);
  const selected = modules.find(module => module.id === active) ?? modules[0];

  return (
    <div className="connection-map" aria-label="Mapa de conexiones de Ingenix Hub">
      <div ref={containerRef} className="connection-map-surface">
        <div ref={inputGroupRef} className="connection-map-group connection-map-inputs" aria-label="Entradas del negocio">
          <p className="connection-map-group-label">Entradas del negocio</p>
          <div className="connection-map-nodes">
            <ConnectionNode module={inputs[0]} nodeRef={webRef} active={active === inputs[0].id} onSelect={setActive} />
            <ConnectionNode module={inputs[1]} nodeRef={whatsappRef} active={active === inputs[1].id} onSelect={setActive} />
            <ConnectionNode module={inputs[2]} nodeRef={formsRef} active={active === inputs[2].id} onSelect={setActive} />
            <ConnectionNode module={inputs[3]} nodeRef={storeRef} active={active === inputs[3].id} onSelect={setActive} />
          </div>
        </div>

        <div ref={centerRef} className="connection-map-center" aria-label="Ingenix Hub, sistema central">
          <span className="connection-map-center-icon"><Network aria-hidden="true" /></span>
          <strong>INGENIX HUB</strong>
          <small>Sistema central</small>
        </div>

        <div ref={outputGroupRef} className="connection-map-group connection-map-outputs" aria-label="Resultados conectados">
          <p className="connection-map-group-label">Todo conectado</p>
          <div className="connection-map-nodes">
            <ConnectionNode module={outputs[0]} nodeRef={dashboardRef} active={active === outputs[0].id} onSelect={setActive} />
            <ConnectionNode module={outputs[1]} nodeRef={automationRef} active={active === outputs[1].id} onSelect={setActive} />
            <ConnectionNode module={outputs[2]} nodeRef={dataRef} active={active === outputs[2].id} onSelect={setActive} />
            <ConnectionNode module={outputs[3]} nodeRef={reportsRef} active={active === outputs[3].id} onSelect={setActive} />
          </div>
        </div>

        <div className="connection-map-desktop-beams">
          <AnimatedBeam containerRef={containerRef} fromRef={webRef} toRef={centerRef} curvature={-51} duration={7.2} pathColor="var(--primary)" pathOpacity={.16} gradientStartColor="#1d4ed8" gradientStopColor="#22d3ee" />
          <AnimatedBeam containerRef={containerRef} fromRef={whatsappRef} toRef={centerRef} curvature={-17} duration={7.55} delay={.42} pathColor="var(--primary)" pathOpacity={.16} gradientStartColor="#1d4ed8" gradientStopColor="#22d3ee" />
          <AnimatedBeam containerRef={containerRef} fromRef={formsRef} toRef={centerRef} curvature={17} duration={7.9} delay={.84} pathColor="var(--primary)" pathOpacity={.16} gradientStartColor="#1d4ed8" gradientStopColor="#22d3ee" />
          <AnimatedBeam containerRef={containerRef} fromRef={storeRef} toRef={centerRef} curvature={51} duration={8.25} delay={1.26} pathColor="var(--primary)" pathOpacity={.16} gradientStartColor="#1d4ed8" gradientStopColor="#22d3ee" />
          <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={dashboardRef} curvature={-51} reverse duration={7.4} delay={.3} pathColor="var(--primary)" pathOpacity={.16} gradientStartColor="#1d4ed8" gradientStopColor="#22d3ee" />
          <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={automationRef} curvature={-17} reverse duration={7.75} delay={.72} pathColor="var(--primary)" pathOpacity={.16} gradientStartColor="#1d4ed8" gradientStopColor="#22d3ee" />
          <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={dataRef} curvature={17} reverse duration={8.1} delay={1.14} pathColor="var(--primary)" pathOpacity={.16} gradientStartColor="#1d4ed8" gradientStopColor="#22d3ee" />
          <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={reportsRef} curvature={51} reverse duration={8.45} delay={1.56} pathColor="var(--primary)" pathOpacity={.16} gradientStartColor="#1d4ed8" gradientStopColor="#22d3ee" />
        </div>
        <div className="connection-map-mobile-beams">
          <AnimatedBeam containerRef={containerRef} fromRef={inputGroupRef} toRef={centerRef} duration={7} pathColor="var(--primary)" pathOpacity={.2} gradientStartColor="#1d4ed8" gradientStopColor="#22d3ee" />
          <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={outputGroupRef} reverse duration={7.2} delay={.45} pathColor="var(--primary)" pathOpacity={.2} gradientStartColor="#1d4ed8" gradientStopColor="#22d3ee" />
        </div>
      </div>

      <div className="connection-map-detail" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={selected.id} initial={reduceMotion ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -7 }} transition={{ duration: .2 }}><strong>{selected.title}:</strong> {selected.description}</motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ConnectionNode({ module, nodeRef, active, onSelect }: {
  module: Module;
  nodeRef: ButtonRef;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = module.icon;
  return (
    <button ref={nodeRef} className={`connection-map-node${active ? " is-active" : ""}`} type="button" aria-pressed={active} onClick={() => onSelect(module.id)} onFocus={() => onSelect(module.id)} onMouseEnter={() => onSelect(module.id)}>
      {active && <motion.span className="connection-map-node-indicator" layoutId="connection-map-node-indicator" transition={{ type: "spring", stiffness: 410, damping: 32 }} />}
      <span className="connection-map-node-icon"><Icon aria-hidden="true" /></span>
      <span className="connection-map-node-title"><span className="connection-map-node-title-desktop">{module.title}</span><span className="connection-map-node-title-mobile">{module.shortTitle}</span></span>
    </button>
  );
}
