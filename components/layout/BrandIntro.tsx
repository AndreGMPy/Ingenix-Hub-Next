"use client";
import Image from "next/image";
import { useEffect,useRef } from "react";
const SESSION_KEY="ingenix-tech-intro-v1";
export function BrandIntro(){
 const root=useRef<HTMLDivElement>(null),started=useRef(false);
 useEffect(()=>{
  const element=root.current;
  if(!element||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  let launched=false,timer=0;
  const finish=()=>{element.hidden=true;};
  const begin=()=>{
   if(launched||document.hidden)return;launched=true;
   try{if(sessionStorage.getItem(SESSION_KEY)&&!started.current)return;sessionStorage.setItem(SESSION_KEY,"seen");}catch{ /* Local duration remains independent of storage and resources. */ }
   started.current=true;element.hidden=false;
   timer=window.setTimeout(finish,matchMedia("(max-width:767px)").matches?1100:1400);
  };
  const key=(event:KeyboardEvent)=>{if(event.key==="Escape"||event.key==="Tab")finish();};
  const motion=matchMedia("(prefers-reduced-motion:reduce)");
  const preference=()=>{if(motion.matches)finish();};
  document.addEventListener("visibilitychange",begin);document.addEventListener("keydown",key);motion.addEventListener("change",preference);begin();
  return()=>{clearTimeout(timer);document.removeEventListener("visibilitychange",begin);document.removeEventListener("keydown",key);motion.removeEventListener("change",preference);element.hidden=true;};
 },[]);
 return <div ref={root} hidden className="brand-intro tech-intro" data-testid="brand-intro" aria-label="Presentación de Ingenix Hub">
  <div className="intro-scene"><div className="intro-halo" aria-hidden="true"/>
   <svg viewBox="0 0 700 420" fill="none" aria-hidden="true" className="intro-circuit"><path d="M0 210H160L230 140H285M700 210H540L470 280H415M350 0V90M350 420V335"/><circle cx="230" cy="140" r="4"/><circle cx="470" cy="280" r="4"/><circle cx="350" cy="90" r="4"/></svg>
   <Image src="/brand/ingenix-isotipo-square.png" width={200} height={200} sizes="(max-width:767px) 150px, 200px" alt="" className="intro-isotope" priority/>
   <span className="intro-wordmark mono">INGENIX HUB</span><span className="intro-caption mono">DISEÑO · SOFTWARE · CONEXIONES</span>
  </div><div className="intro-scan" aria-hidden="true"/>
  <button type="button" className="intro-skip" onClick={()=>{if(root.current)root.current.hidden=true;}}>Saltar intro ↗</button>
 </div>;
}

