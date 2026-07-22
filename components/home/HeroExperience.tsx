"use client";

import { ChartNoAxesCombined, Globe2, Layers3, MessageCircle, Store, Zap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { PointerEvent, useEffect, useRef, useState } from "react";
import { links } from "@/data/site";

const modes = {
  web: { url: "ingenixhub.com/web", kicker: "PÁGINA WEB", title: "Tu negocio listo para recibir clientes", copy: "Diseño responsive · WhatsApp · SEO básico", statA: "24/7", labelA: "Presencia", statB: "100%", labelB: "Responsive", top: "Carga rápida", bottom: "Contacto directo", hud: "READY" },
  catalog: { url: "ingenixhub.com/catalogo", kicker: "CATÁLOGO DIGITAL", title: "Productos ordenados y fáciles de consultar", copy: "Categorías · Fotos · Consultas por WhatsApp", statA: "+40", labelA: "Elementos", statB: "1 CLIC", labelB: "Contacto", top: "Filtros claros", bottom: "Pedido rápido", hud: "SYNCED" },
  panel: { url: "app.ingenixhub.com/panel", kicker: "PANEL PRIVADO", title: "Controla contenido y operación desde un solo lugar", copy: "Productos · Ventas · Inventario · Reportes", statA: "LIVE", labelA: "Datos", statB: "SECURE", labelB: "Acceso", top: "Datos en vivo", bottom: "Control privado", hud: "ONLINE" },
};

type Mode = keyof typeof modes;
const ease = [0.2, 0.8, 0.2, 1] as const;

export function HeroExperience() {
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>("web");
  const visualRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const current = modes[mode];
  const hidden = reduceMotion ? false : { opacity: 0, y: 22 };

  function parallax(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !window.matchMedia("(pointer: fine) and (min-width: 701px)").matches || !visualRef.current || !phoneRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    phoneRef.current.style.setProperty("--phone-rx", `${(-y * 3.6).toFixed(2)}deg`);
    phoneRef.current.style.setProperty("--phone-ry", `${(x * 4.8).toFixed(2)}deg`);
    phoneRef.current.style.setProperty("--phone-tx", `${(x * 5).toFixed(2)}px`);
    phoneRef.current.style.setProperty("--phone-ty", `${(y * 5).toFixed(2)}px`);
  }

  function resetParallax() {
    if (!phoneRef.current) return;
    phoneRef.current.style.setProperty("--phone-rx", "0deg"); phoneRef.current.style.setProperty("--phone-ry", "0deg");
    phoneRef.current.style.setProperty("--phone-tx", "0px"); phoneRef.current.style.setProperty("--phone-ty", "0px");
  }

  return (
    <section className="hero" id="hero">
      <HeroCanvas />
      <div className="hero-light hero-light-one" aria-hidden="true" /><div className="hero-light hero-light-two" aria-hidden="true" />
      <div className="container hero-layout">
        <div className="hero-copy visible">
          <motion.span className="section-pill" initial={hidden} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52, ease }}>Diseño web</motion.span>
          <motion.h1 initial={hidden} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 0.1, duration: 0.62, ease }}>Tu negocio puede verse como una marca grande desde el celular.</motion.h1>
          <motion.p initial={hidden} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 0.2, duration: 0.58, ease }}>Diseño páginas web, catálogos digitales, apps web y paneles administrables que se sienten modernos, cargan rápido y llevan a tus clientes directo a contactarte.</motion.p>
          <motion.div className="hero-actions" initial={hidden} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 0.3, duration: 0.54, ease }}>
            <a className="btn btn-primary magnetic" href={links.diagnostic} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />Pedir diagnóstico gratis</a>
            <a className="btn btn-ghost magnetic" href="#portfolio"><Layers3 aria-hidden="true" />Ver trabajos</a>
          </motion.div>
          <motion.div className="hero-tags phone-demo-controls" aria-label="Prueba la vista previa del teléfono" initial={hidden} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 0.42, duration: 0.5, ease }}>
            <button className={`phone-mode${mode === "web" ? " active" : ""}`} type="button" onClick={() => setMode("web")}><Globe2 aria-hidden="true" /> Web</button>
            <button className={`phone-mode${mode === "catalog" ? " active" : ""}`} type="button" onClick={() => setMode("catalog")}><Store aria-hidden="true" /> Catálogo</button>
            <button className={`phone-mode${mode === "panel" ? " active" : ""}`} type="button" onClick={() => setMode("panel")}><ChartNoAxesCombined aria-hidden="true" /> Panel</button>
          </motion.div>
        </div>

        <motion.div ref={visualRef} className="hero-visual visible" onPointerMove={parallax} onPointerLeave={resetParallax} initial={reduceMotion ? false : { opacity: 0, y: 34, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: reduceMotion ? 0 : 0.18, duration: 0.7, ease }}>
          <div ref={phoneRef} className="phone-parallax-wrap">
            <div className="phone-shell floating-device"><div className="phone-speaker" /><div className="phone-screen">
              <div className="mini-browser"><span /><span /><span /><small>{current.url}</small></div>
              <div className="phone-live-status"><i /><span>LIVE PREVIEW</span></div>
              <motion.div key={mode} className="mini-hero-card" initial={reduceMotion ? false : { opacity: 0.35, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}><small>{current.kicker}</small><strong>{current.title}</strong><p>{current.copy}</p></motion.div>
              <div className="mini-stats"><div><strong>{current.statA}</strong><span>{current.labelA}</span></div><div><strong>{current.statB}</strong><span>{current.labelB}</span></div></div>
              <div className="mini-list" aria-hidden="true"><span /><span /><span /></div><div className="phone-data-stream" aria-hidden="true"><span /><span /><span /></div>
            </div></div>
          </div>
          <motion.div className="orbit-card card-top" initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 0.74, duration: 0.4, ease }}><Zap aria-hidden="true" /><span>{current.top}</span></motion.div>
          <motion.div className="orbit-card card-bottom" initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 0.84, duration: 0.4, ease }}><MessageCircle aria-hidden="true" /><span>{current.bottom}</span></motion.div>
          <div className="orbit-ring" aria-hidden="true" /><div className="engineering-hud hud-a"><span /><small>UI SYSTEM</small><strong>{current.hud}</strong></div><div className="engineering-hud hud-b"><span /><small>RENDER</small><strong>60 FPS</strong></div><div className="scan-line" aria-hidden="true" /><div className="hero-connectors" aria-hidden="true"><span /><span /><span /></div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const connection = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (!canvas || !context || reduceMotion || window.innerWidth < 701 || connection.connection?.saveData || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)) return;
    let frame = 0;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr; canvas.height = canvas.offsetHeight * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: 42 }, () => ({ x: Math.random() * canvas.offsetWidth, y: Math.random() * canvas.offsetHeight, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.7 + 0.7 }));
    };
    const draw = () => {
      context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const dark = document.body.classList.contains("dark-mode");
      context.fillStyle = dark ? "rgba(96,165,250,.38)" : "rgba(29,78,216,.28)";
      context.strokeStyle = dark ? "rgba(96,165,250,.08)" : "rgba(29,78,216,.075)";
      particles.forEach((p, index) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1; if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;
        context.beginPath(); context.arc(p.x, p.y, p.r, 0, Math.PI * 2); context.fill();
        for (let next = index + 1; next < particles.length; next += 1) {
          const q = particles[next]; const distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance < 120) { context.globalAlpha = 1 - distance / 120; context.beginPath(); context.moveTo(p.x, p.y); context.lineTo(q.x, q.y); context.stroke(); context.globalAlpha = 1; }
        }
      });
      frame = requestAnimationFrame(draw);
    };
    resize(); draw(); window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, [reduceMotion]);
  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
