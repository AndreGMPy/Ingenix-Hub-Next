"use client";
import { useEffect,useRef,useState } from "react";
import { MessageSquare,Sparkles,RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { motionTokens } from "@/lib/motion";
import { useMedia } from "@/lib/use-media";
export function NixConversation(){
 const root=useRef<HTMLDivElement>(null);const timers=useRef<number[]>([]);const [step,setStep]=useState(0);
 const reduced=useMedia("(prefers-reduced-motion:reduce)");
 const [instant,setInstant]=useState(true);
 function replay(immediate=false){timers.current.forEach(clearTimeout);setInstant(immediate||reduced);if(immediate||reduced){setStep(3);return;}setStep(1);timers.current=[window.setTimeout(()=>setStep(2),700),window.setTimeout(()=>setStep(3),1500)];}
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const observer=new IntersectionObserver(entries=>{if(!entries[0]?.isIntersecting)return;observer.disconnect();setInstant(false);
   timers.current=[window.setTimeout(()=>setStep(1),100),window.setTimeout(()=>setStep(2),800),window.setTimeout(()=>setStep(3),1600)];
  },{threshold:.35});observer.observe(el);
  return()=>{observer.disconnect();timers.current.forEach(clearTimeout);};
 },[]);
 const complete=reduced||step===0||step===3;
 return <div className="nix-example" ref={root} aria-label="Demostración de conversación con Nix"><div className="nix-demo-toolbar"><span className="mono example-label">NIX / CONVERSACIÓN DE EJEMPLO</span><button className="icon-button" onClick={e=>replay(e.detail===0)} aria-label="Repetir ejemplo de Nix"><RotateCcw size={15}/></button></div>
 <p className="example-user"><MessageSquare size={17} aria-hidden="true"/>Tengo una tienda y recibo pedidos por WhatsApp.</p>
 <div className="nix-demo-response">{!complete?<div className="nix-demo-thinking" aria-hidden="true"><span/><span/><span/><span>{step<2?"Nix escucha tu idea":"Entiende · analiza · orienta"}</span></div>:<motion.p className="example-nix" initial={reduced||instant?false:{opacity:0,transform:"translateY(4px)"}} animate={{opacity:1,transform:"translateY(0px)"}} transition={{duration:reduced||instant?0:motionTokens.normal,ease:motionTokens.easeOut}}><Sparkles size={18} aria-hidden="true"/><span>Podemos empezar con un catálogo digital o una tienda en línea. ¿Quieres recibir pedidos o también cobrar desde la web?</span></motion.p>}</div></div>;
}

