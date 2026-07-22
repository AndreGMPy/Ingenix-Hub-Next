"use client";

import { Box, Gauge, MousePointerClick, Terminal } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PointerEvent, useRef, useState } from "react";

const modes = {
  depth: { kicker: "DEPTH ENGINE", title: "Interfaz con profundidad real", copy: "Capas, perspectiva y sombras que reaccionan sin sacrificar claridad.", a: "60 FPS", b: "8 MS", c: "STABLE", log: "depth_engine.initialize() → ready" },
  boot: { kicker: "BOOT SEQUENCE", title: "Una entrada que comunica ingeniería", copy: "Estados de carga con propósito, progreso visible y una transición rápida al contenido.", a: "1.2 S", b: "5 STEPS", c: "READY", log: "boot_sequence.complete() → content mounted" },
  touch: { kicker: "TOUCH FEEDBACK", title: "Cada toque responde de inmediato", copy: "Ondas, cambios de estado y microinteracciones que hacen sentir la interfaz viva.", a: "1 TAP", b: "12 MS", c: "ACTIVE", log: "pointer_event.dispatch() → feedback rendered" },
  performance: { kicker: "PERFORMANCE CORE", title: "Movimiento optimizado para no hacer lenta la web", copy: "Animaciones basadas en transform y opacity, menos trabajo para el navegador y adaptadas a cada dispositivo.", a: "A+", b: "GPU", c: "OPTIMIZED", log: "performance_audit.run() → no blocking animation" },
};
type LabKey = keyof typeof modes;
const controls: Array<{ key: LabKey; label: string; icon: typeof Box }> = [
  { key: "depth", label: "Profundidad 3D", icon: Box }, { key: "boot", label: "Entrada de sistema", icon: Terminal },
  { key: "touch", label: "Respuesta táctil", icon: MousePointerClick }, { key: "performance", label: "Rendimiento", icon: Gauge },
];

export function ExperienceLab() {
  const [active, setActive] = useState<LabKey>("depth");
  const reduceMotion = useReducedMotion();
  const consoleRef = useRef<HTMLDivElement>(null);
  const current = modes[active];

  function followPointer(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !window.matchMedia("(pointer: fine) and (min-width: 701px)").matches || !consoleRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    consoleRef.current.style.setProperty("--lab-rx", `${(-y * 2.4).toFixed(2)}deg`);
    consoleRef.current.style.setProperty("--lab-ry", `${(x * 3.2).toFixed(2)}deg`);
  }

  function resetPointer() {
    consoleRef.current?.style.setProperty("--lab-rx", "0deg");
    consoleRef.current?.style.setProperty("--lab-ry", "0deg");
  }

  return (
    <div className="wow-grid">
      <div className="wow-copy"><span className="section-pill">Laboratorio interactivo</span><h2>Prueba cómo se siente una interfaz construida con intención</h2><p>Selecciona un efecto. El panel cambia en tiempo real para mostrar profundidad, respuesta táctil, carga y movimiento optimizado.</p>
        <div className="wow-stack" aria-label="Demostraciones interactivas">{controls.map(control => {
          const Icon = control.icon;
          const selected = active === control.key;
          return <motion.button key={control.key} className={`stack-card lab-control${selected ? " active" : ""}`} type="button" aria-pressed={selected} onClick={() => setActive(control.key)} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
            {selected && <motion.span className="lab-control-indicator" layoutId="lab-control-indicator" transition={{ type: "spring", stiffness: 430, damping: 34 }} />}
            <Icon aria-hidden="true" /><span>{control.label}</span>
          </motion.button>;
        })}</div>
      </div>
      <div ref={consoleRef} className="experience-console" data-mode={active} onPointerMove={followPointer} onPointerLeave={resetPointer}>
        <div className="experience-toolbar"><span /><span /><span /><small>ingenix://experience-lab</small><b><i /> ONLINE</b></div>
        <div className="experience-stage"><div className="lab-orbit orbit-a" /><div className="lab-orbit orbit-b" />
          <AnimatePresence mode="wait" initial={false}><motion.div key={active} className="lab-demo-card" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.22 }}><small>{current.kicker}</small><strong>{current.title}</strong><p>{current.copy}</p><div className="lab-code-stream" aria-hidden="true"><span /><span /><span /><span /></div></motion.div></AnimatePresence>
          <div className="lab-matrix" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <span key={index} />)}</div>
          <div className="lab-readouts"><div><small>RENDER</small><strong>{current.a}</strong></div><div><small>INPUT</small><strong>{current.b}</strong></div><div><small>STATE</small><strong>{current.c}</strong></div></div>
        </div>
        <div className="experience-log"><span>&gt;</span><code>{current.log}</code><i /></div>
      </div>
    </div>
  );
}
