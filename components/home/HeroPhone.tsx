"use client";
import dynamic from "next/dynamic";
import { Pause, Play } from "lucide-react";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import type { ShowcaseItem } from "@/data/showcase";
import { showcaseFrame } from "@/lib/motion";
import { heroProgress, subscribeHeroProgress } from "@/lib/scroll-progress";
import { MOBILE_QUERY, SHOWCASE_QUERY, useMedia } from "@/lib/use-media";

const PhoneScene = dynamic(() => import("@/components/three/PhoneScene"), { ssr: false, loading: () => null });
class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}
type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
function capable3D() {
  if (new URLSearchParams(window.location.search).get("webgl") === "off") return false;
  const nav = navigator as Nav;
  if (nav.connection?.saveData || (nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2) return false;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch { return false; }
}

export type VideoRefs = RefObject<(HTMLVideoElement | null)[]>;
/** Mockup 2D: poster mientras carga el 3D, versión estática (reduced/no-JS) y fallback sin WebGL. ScrollDirector anima sus nodos.
 *  Cada pantalla = poster (LCP, en el HTML) + video sin audio que HeroPhone reproduce sólo cuando ese proyecto está activo. */
export function PhoneMockup({ items, warm = false, videos }: { items: readonly ShowcaseItem[]; warm?: boolean; videos?: VideoRefs }) {
  return <div className={"phone2d" + (warm ? " is-warm" : "")} aria-hidden="true">
    <div className="phone2d-face phone2d-front">
      <div className="phone2d-screen">
        {items.map((item, index) => <div key={item.slug} className="phone2d-shot" data-index={index}>
          {/* eslint-disable-next-line @next/next/no-img-element -- posters ya optimizados a 472px WebP */}
          <img src={item.screen} alt="" width={472} height={1024} decoding={index === 0 ? "sync" : "async"} fetchPriority={index === 0 ? "high" : "low"} loading={index === 0 ? "eager" : "lazy"} />
          {warm && <video ref={node => { if (videos) videos.current[index] = node; }} className="phone2d-video" muted playsInline loop preload="none" disablePictureInPicture tabIndex={-1}
            onPlaying={event => event.currentTarget.classList.add("is-playing")} />}
        </div>)}
        <span className="phone2d-island" />
      </div>
    </div>
    <div className="phone2d-face phone2d-back"><span className="phone2d-camera" /></div>
  </div>;
}

export function HeroPhone({ items }: { items: readonly ShowcaseItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dark, setDark] = useState(false);
  // Las capturas 2–5 esperan a la primera interacción para no competir con el LCP (la primera ya está en el HTML).
  const [warm, setWarm] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const mobile = useMedia(MOBILE_QUERY);
  const scroll = useMedia(SHOWCASE_QUERY);
  // Video del proyecto activo: se reproduce al desplazar (mismo índice que el giro), los demás se pausan; el siguiente se precarga.
  const playing = scroll && warm && visible && pageVisible && !paused;
  useEffect(() => {
    if (!warm) return;
    const list = videos.current;
    let active = -1;
    const sync = () => {
      const next = showcaseFrame(heroProgress.value, items.length).screen;
      if (next === active) return;
      active = next;
      list.forEach((video, index) => {
        if (!video) return;
        const near = index === active || index === active + 1;
        if (near && !video.getAttribute("src")) { video.preload = index === active ? "auto" : "metadata"; video.src = items[index].video; }
        if (index === active && playing) video.play().catch(() => { /* Sin autoplay: queda el poster. */ });
        else video.pause();
      });
    };
    sync();
    const stop = subscribeHeroProgress(sync);
    return () => { stop(); list.forEach(video => video?.pause()); };
  }, [warm, playing, items]);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailed(true); setReady(false); }, []);
  useEffect(() => {
    const section = root.current?.closest("section");
    if (!section) return;
    const observer = new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? false), { threshold: 0 });
    observer.observe(section);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility); onVisibility();
    const theme = new MutationObserver(() => setDark(document.documentElement.dataset.theme === "dark"));
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    setDark(document.documentElement.dataset.theme === "dark");
    let timer = 0, idle = 0;
    // La GPU espera a la intro de marca; la intro nunca espera al 3D.
    const probe = () => {
      if (document.querySelector(".brand-intro:not([hidden])")) { timer = window.setTimeout(probe, 600); return; }
      setSupported(capable3D());
    };
    // three.js (~1 MB) se descarga con la primera interacción: el primer cuadro y el LCP son el poster 2D, que ya responde al scroll.
    const events = ["pointermove", "pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;
    const start = () => {
      events.forEach(type => window.removeEventListener(type, start));
      setWarm(true);
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(probe, { timeout: 600 });
      else timer = window.setTimeout(probe, 60);
    };
    events.forEach(type => window.addEventListener(type, start, { passive: true, once: true }));
    return () => { observer.disconnect(); theme.disconnect(); document.removeEventListener("visibilitychange", onVisibility); events.forEach(type => window.removeEventListener(type, start)); window.clearTimeout(timer); if (idle) window.cancelIdleCallback(idle); };
  }, []);
  const use3D = scroll && supported && !failed;
  const live = use3D && ready;
  return <div className="hero3d-device" ref={root} data-webgl={live ? "ready" : "fallback"}>
    <div className={"phone2d-layer" + (live ? " is-hidden" : "")}><PhoneMockup items={items} warm={warm} videos={videos} /></div>
    {use3D && <SceneBoundary onFailure={onFailure}><div className={"hero3d-canvas" + (ready ? " is-ready" : "")}>
      <PhoneScene items={items} videos={videos} mobile={mobile} running={visible && pageVisible} animate={!paused} dark={dark} onReady={onReady} onFailure={onFailure} />
    </div></SceneBoundary>}
    {scroll && warm && <button type="button" className="hero3d-pause icon-button" aria-label={paused ? "Activar movimiento y video" : "Pausar movimiento y video"} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
      {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
    </button>}
  </div>;
}
