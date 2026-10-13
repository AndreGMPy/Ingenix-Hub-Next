"use client";
import Link from "next/link";

import dynamic from "next/dynamic";
import { Pause, Play } from "lucide-react";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { MOBILE_QUERY, useMedia } from "@/lib/use-media";
import { EcosystemFallback } from "./EcosystemFallback";
const Scene = dynamic(() => import("./EcosystemScene"), { ssr: false, loading: () => null });
class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}
const labels = [
  ["web", "WEB"], ["commerce", "E-COMMERCE"], ["software", "SOFTWARE"],
  ["data", "DATOS"], ["automation", "AUTOMATIZACIÓN"], ["ai", "IA"],
] as const;
export function HeroEcosystem() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [supported, setSupported] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const mobile = useMedia(MOBILE_QUERY);
  const reduced = useMedia("(prefers-reduced-motion:reduce)");
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailed(true); setReady(false); }, []);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? false), { rootMargin: "0px", threshold: .02 });
    observer.observe(element);
    let timer = 0;
    let idle = 0;
    let secondFrame = 0;
    const probeWebGL = () => {
      if (new URLSearchParams(window.location.search).get("webgl") === "off") return;
      // La preparación GPU espera a la marca; la intro nunca espera al 3D.
      if (document.querySelector(".brand-intro:not([hidden])")) {
        timer = window.setTimeout(probeWebGL, 1600);
        return;
      }
      try {
        const probe = document.createElement("canvas");
        const gl = probe.getContext("webgl2");
        if (gl) { gl.getExtension("WEBGL_lose_context")?.loseContext(); setSupported(true); }
      } catch { setSupported(false); }
    };
    const firstFrame = requestAnimationFrame(() => { secondFrame = requestAnimationFrame(() => {
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(probeWebGL, { timeout:1500 });
      else timer = window.setTimeout(probeWebGL,180);
    }); });
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility); onVisibility();
    return () => { observer.disconnect(); cancelAnimationFrame(firstFrame); cancelAnimationFrame(secondFrame); window.clearTimeout(timer); if (idle) window.cancelIdleCallback(idle); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);
  useEffect(() => {
    if (!mobile || reduced) return;
    const element = root.current;
    if (!element) return;
    let top = 0, height = 1, frame = 0;
    const update = () => {
      frame = 0;
      progress.current = Math.max(0, Math.min(1, (scrollY - Math.max(0, top - innerHeight * .65)) / (height + innerHeight * .4)));
    };
    const measure = () => { const rect = element.getBoundingClientRect(); top = rect.top + scrollY; height = Math.max(1, rect.height); update(); };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(measure); observer.observe(element); measure();
    window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", measure); if (frame) cancelAnimationFrame(frame); };
  }, [mobile, reduced]);
  return <figure className="hero-system" aria-label="Ecosistema conectado: web, e-commerce, software, datos, automatización e inteligencia artificial">
    <div className="system-overline mono"><span>INGENIX / CONNECTED SYSTEMS</span><span className="system-cross">+</span></div>
    <div className="ecosystem-viewport" ref={root} data-webgl={ready && !failed ? "ready" : "fallback"}>
      <div className={"fallback-layer" + (ready && !failed ? " is-ready" : "")}><EcosystemFallback /></div>
      {supported && !failed && <SceneBoundary onFailure={onFailure}><div className={"canvas-layer" + (ready ? " is-ready" : "")}>
        <Scene mobile={mobile} moving={visible && pageVisible && !paused && !reduced} reduced={reduced} progress={progress} onReady={onReady} onFailure={onFailure} />
      </div></SceneBoundary>}
      <div className="system-micro-ui mono" aria-hidden="true"><i />INGENIX / SYSTEM CORE<i /></div><div className="system-labels">{labels.map(([key, label]) => <Link href="/#servicios" className={"system-label label-" + key} key={key} aria-label={"Explorar " + label}><i aria-hidden="true" />{label}</Link>)}</div>
      <span className="system-core-caption mono">INGENIX HUB</span>
    </div>
    <figcaption><span><span className="status-dot" />Un sistema. Todas las piezas conectadas.</span>{!reduced && supported && !failed && <button type="button" className="scene-control icon-button" aria-label={paused ? "Activar movimiento 3D" : "Pausar movimiento 3D"} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}</button>}</figcaption>
  </figure>;
}

