"use client";
import { useEffect } from "react";
import { validRange } from "@/lib/motion";
export function ScrollDirector() {
 useEffect(()=>{
  let disposed=false;let revert:(()=>void)|undefined;
  Promise.all([import("gsap"),import("gsap/ScrollTrigger")]).then(([{gsap},{ScrollTrigger}])=>{
   if(disposed)return;gsap.registerPlugin(ScrollTrigger);const media=gsap.matchMedia();
   media.add("(prefers-reduced-motion:no-preference)",()=>{
    const safe=(self:{start:number;end:number;disable:(reset?:boolean)=>void})=>{if(!validRange(self.start,self.end))self.disable(true);};
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
  return()=>{disposed=true;revert?.();};
 },[]);
 return null;
}

