"use client";
import { useEffect } from "react";
import { SHOWCASE_HOLD, SHOWCASE_INTRO, SHOWCASE_OUTRO, showcaseLayout, showcaseSteps, validRange, type ShowcasePose } from "@/lib/motion";
import { MOBILE_QUERY, SHOWCASE_QUERY } from "@/lib/use-media";
import { setHeroProgress } from "@/lib/scroll-progress";
type Gsap = typeof import("gsap").gsap;
type RefreshTarget = { start: number; end: number; disable: (reset?: boolean) => void };
const safeRange = (self: RefreshTarget) => { if (!validRange(self.start, self.end)) self.disable(true); };
/* Hero 3D: pin + scrub. El timeline mueve el DOM (copy, rótulos, brillo, mockup 2D) y publica su progreso para la escena WebGL. */
function heroShowcase(gsap: Gsap, mobile: boolean) {
 const hero = document.querySelector<HTMLElement>(".hero3d");
 const projects = gsap.utils.toArray<HTMLElement>(".hero3d-project", hero);
 const n = projects.length;
 if (!hero || !n) return;
 const q = gsap.utils.selector(hero);
 const counts = q(".hero3d-count>span"), glows = q(".hero3d-glow"), shots = q(".phone2d-shot"), phone = q(".phone2d");
 const front = q(".phone2d-front"), back = q(".phone2d-back");
 const steps = showcaseSteps(n), span = steps[1] - steps[0], fade = span * .12;
 const swap = span * (SHOWCASE_HOLD + (1 - SHOWCASE_HOLD) / 2);
 const layout = showcaseLayout(mobile), restYaw = mobile ? -7 : -18;
 // En táctil el scroll nativo ya trae inercia: menos suavizado para que el celular no "arrastre" detrás del dedo.
 const touch = window.matchMedia("(pointer: coarse)").matches;
 // pinSpacer = #inicio (ya en el SSR): sin reparentar la sección, que Chrome contaría como un LCP tardío.
 // Poses relativas a la capa del dispositivo: la misma caja que ocupa el canvas WebGL.
 const layer = hero.querySelector<HTMLElement>(".hero3d-device") ?? hero;
 const pose = (p: ShowcasePose) => ({ x: () => p.x * layer.clientWidth, y: () => p.y * layer.clientHeight, scale: p.scale });
 const header = () => document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
 hero.dataset.motion = "scroll";
 gsap.set(phone, { ...pose(layout.rest), rotationY: restYaw, transformPerspective: 1600 });
 gsap.set([...projects, ...counts, ...glows], { opacity: 0 });
 gsap.set(shots.slice(1), { opacity: 0 });
 gsap.set(q(".hero3d-progress"), { autoAlpha: 0 });
 gsap.set(q(".hero3d-final"), { autoAlpha: 0, y: 24 });
 const tl = gsap.timeline({ defaults: { ease: "none" }, onUpdate: () => setHeroProgress(tl.progress()), scrollTrigger: {
  trigger: hero, start: () => "top " + header(), end: () => "+=" + Math.round(innerHeight * (1 + n * .62)), pin: true, pinSpacer: hero.parentElement ?? undefined, scrub: touch ? .25 : .5,
  anticipatePin: 1, invalidateOnRefresh: true, onRefresh: safeRange,
  onToggle: self => document.documentElement.toggleAttribute("data-hero-pinned", self.isActive) } });
 tl.to(q(".hero3d-copy"), { autoAlpha: 0, y: -48, duration: SHOWCASE_INTRO * .8 }, 0)
  .to(q(".hero3d-hint"), { opacity: 0, duration: SHOWCASE_INTRO * .4 }, 0)
  .to(phone, { ...pose(layout.projects), duration: SHOWCASE_INTRO, ease: "power1.inOut" }, 0)
  .to(q(".hero3d-progress"), { autoAlpha: 1, duration: SHOWCASE_INTRO * .4 }, SHOWCASE_INTRO * .6)
  .fromTo(projects[0], { y: 32 }, { opacity: 1, y: 0, duration: SHOWCASE_INTRO * .4 }, SHOWCASE_INTRO * .6)
  .to([counts[0], glows[0]], { opacity: 1, duration: SHOWCASE_INTRO * .4 }, SHOWCASE_INTRO * .6);
 for (let i = 0; i < n - 1; i++) {
  const turn = steps[i] + span * SHOWCASE_HOLD, at = steps[i] + swap;
  // Cara visible decidida por el timeline (no sólo backface-visibility, que algunos motores ignoran al aplanar el 3D):
  // con power1.inOut el giro pasa por 90° y 270° en t≈.354 y t≈.646 de su duración.
  const turnDuration = span * (1 - SHOWCASE_HOLD);
  tl.set(back, { opacity: 1 }, turn + turnDuration * .354).set(front, { opacity: 0 }, turn + turnDuration * .354)
   .set(back, { opacity: 0 }, turn + turnDuration * .646).set(front, { opacity: 1 }, turn + turnDuration * .646);
  tl.to(phone, { rotationY: restYaw + 360 * (i + 1), duration: span * (1 - SHOWCASE_HOLD), ease: "power1.inOut" }, turn)
   .set(shots[i + 1], { opacity: 1 }, at).set(shots[i], { opacity: 0 }, at)
   .to(glows[i], { opacity: 0, duration: span * (1 - SHOWCASE_HOLD) }, turn).to(glows[i + 1], { opacity: 1, duration: span * (1 - SHOWCASE_HOLD) }, turn)
   .to(projects[i], { opacity: 0, y: -32, duration: fade }, at - fade).fromTo(projects[i + 1], { y: 32 }, { opacity: 1, y: 0, duration: fade }, at)
   .to(counts[i], { opacity: 0, duration: fade / 2 }, at - fade / 2).to(counts[i + 1], { opacity: 1, duration: fade / 2 }, at);
 }
 tl.to([projects[n - 1], ...q(".hero3d-progress")], { opacity: 0, y: -24, duration: fade }, steps[n])
  .to(phone, { ...pose(layout.outro), rotationY: 360 * (n - 1), duration: SHOWCASE_OUTRO, ease: "power1.inOut" }, steps[n])
  .to(q(".hero3d-final"), { autoAlpha: 1, y: 0, duration: SHOWCASE_OUTRO * .5 }, steps[n] + SHOWCASE_OUTRO * .45)
  .set({}, {}, 1);
 return () => { delete hero.dataset.motion; document.documentElement.removeAttribute("data-hero-pinned"); setHeroProgress(0); };
}
export function ScrollDirector() {
 useEffect(()=>{
  let disposed=false;let revert:(()=>void)|undefined;
  // GSAP (~44 KB) y la creación del pin, fuera de la carga: se inician con la primera interacción (o de inmediato si la página ya está desplazada). El layout [data-js] pinta el primer cuadro completo.
  const events=["pointermove","pointerdown","touchstart","wheel","scroll","keydown"] as const;
  const load=()=>{events.forEach(type=>window.removeEventListener(type,load));
  Promise.all([import("gsap"),import("gsap/ScrollTrigger")]).then(([{gsap},{ScrollTrigger}])=>{
   if(disposed)return;gsap.registerPlugin(ScrollTrigger);
   // iOS: la barra de dirección cambia el alto al desplazar; no recalcular el pin por eso (evita saltos a media animación).
   ScrollTrigger.config({ignoreMobileResize:true});
   const media=gsap.matchMedia();
   // El hero va primero: su pin desplaza a todos los triggers que vienen después.
   media.add({scroll:SHOWCASE_QUERY,mobile:MOBILE_QUERY},context=>{const {scroll,mobile}=context.conditions as {scroll:boolean;mobile:boolean};return scroll?heroShowcase(gsap,mobile):undefined;});
   media.add("(prefers-reduced-motion:no-preference)",()=>{
    const safe=safeRange;
    gsap.utils.toArray<SVGPathElement>(".flow-beams path").forEach(path=>gsap.fromTo(path,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,ease:"none",scrollTrigger:{trigger:".architecture-flow",start:"top 90%",end:"bottom 35%",scrub:.3,onRefresh:safe}}));
    gsap.utils.toArray<SVGPathElement>(".flow-signals path").forEach(path=>gsap.fromTo(path,{strokeDashoffset:1},{strokeDashoffset:0,ease:"none",scrollTrigger:{trigger:".architecture-story",start:"top 75%",end:"bottom 25%",scrub:.3,onRefresh:safe}}));
    gsap.fromTo(".architecture-track-progress",{scaleY:0,transformOrigin:"top"},{scaleY:1,ease:"none",scrollTrigger:{trigger:".architecture-stages",start:"top 70%",end:"bottom 65%",scrub:.3,onRefresh:safe}});
    gsap.fromTo(".process-route>span",{scaleX:0,transformOrigin:"left"},{scaleX:1,ease:"none",scrollTrigger:{trigger:".process-section",start:"top 75%",end:"bottom 70%",scrub:.3,onRefresh:safe}});
    gsap.utils.toArray<HTMLElement>(".architecture-stage").forEach(stage=>gsap.fromTo(stage.querySelector(".stage-dot"),{scale:.8},{scale:1.3,ease:"none",scrollTrigger:{trigger:stage,start:"top 75%",end:"top 40%",scrub:.3,onRefresh:safe}}));
   });
   media.add("(min-width:1024px) and (min-height:700px) and (prefers-reduced-motion:no-preference)",()=>{
    const intro=document.querySelector<HTMLElement>(".architecture-intro");
    if(intro&&intro.offsetHeight<innerHeight-180)ScrollTrigger.create({trigger:".architecture-story",pin:intro,pinSpacing:false,start:"top 116px",end:"bottom bottom-=64",invalidateOnRefresh:true,onRefresh:self=>{if(!validRange(self.start,self.end))self.disable(true);}});
    gsap.utils.toArray<HTMLElement>(".portfolio-full-list .portfolio-scroll-plane").forEach(plane=>gsap.fromTo(plane,{clipPath:"inset(4% 0% 4% 0%)",scale:.985},{clipPath:"inset(0% 0% 0% 0%)",scale:1,ease:"none",scrollTrigger:{trigger:plane,start:"top 95%",end:"top 50%",scrub:.3}}));
    gsap.fromTo(".contact-stamp",{rotation:-8},{rotation:4,ease:"none",scrollTrigger:{trigger:".contact-section",start:"top bottom",end:"bottom bottom",scrub:.5}});
   });
   revert=()=>media.revert();ScrollTrigger.refresh();
  }).catch(()=>{ /* El contenido permanece completo sin scroll enhancement. */ });
  };
  events.forEach(type=>window.addEventListener(type,load,{passive:true}));
  if(scrollY>0||location.hash)load();
  return()=>{disposed=true;revert?.();events.forEach(type=>window.removeEventListener(type,load));};
 },[]);
 return null;
}

