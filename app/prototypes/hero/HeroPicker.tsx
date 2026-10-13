"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { MOBILE_QUERY, useMedia } from "@/lib/use-media";
const names=["Ecosistema","Editorial","Planos"];
export function HeroPicker({ initial,variants }: {initial:number;variants:ReactNode[]}) {
  const [current,setCurrent]=useState(initial);
  const [replay,setReplay]=useState(0);
  const [ready,setReady]=useState(false);
  const highlight=useRef<HTMLSpanElement>(null);
  const buttons=useRef<(HTMLButtonElement|null)[]>([]);
  const mobile=useMedia(MOBILE_QUERY);
  const select=useCallback((index:number)=>{
    if(index<0 || index>=variants.length) return;
    setCurrent(index);
    const url=new URL(window.location.href);url.searchParams.set("v",String(index+1));window.history.replaceState(null,"",url);
  },[variants.length]);
  useLayoutEffect(()=>{
    const measure=()=>{const el=buttons.current[current];if(el && highlight.current){highlight.current.style.width=el.offsetWidth+"px";highlight.current.style.transform="translateX("+el.offsetLeft+"px)";}};
    measure();window.addEventListener("resize",measure);return()=>window.removeEventListener("resize",measure);
  },[current]);
  useEffect(()=>{let second=0;const first=requestAnimationFrame(()=>{second=requestAnimationFrame(()=>setReady(true));});return()=>{cancelAnimationFrame(first);cancelAnimationFrame(second);};},[]);
  useEffect(()=>{
    const key=(event:KeyboardEvent)=>{
      if(event.defaultPrevented) return;
      const target=event.target as HTMLElement;
      if(/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable || event.metaKey || event.ctrlKey || event.altKey) return;
      const num=Number(event.key);
      if(num>=1&&num<=variants.length) select(num-1);
      else if(event.key==="ArrowRight"){event.preventDefault();select((current+1)%variants.length);}
      else if(event.key==="ArrowLeft"){event.preventDefault();select((current-1+variants.length)%variants.length);}
      else if(event.key.toLowerCase()==="r")setReplay(value=>value+1);
    };
    document.addEventListener("keydown",key);return()=>document.removeEventListener("keydown",key);
  },[current,select,variants.length]);
  return <><div key={current+"-"+replay} className="prototype-stage">{variants[current]}</div><nav className="proto-picker" aria-label="Prototype variants" data-ready={ready?"":undefined} data-position={mobile?"top":undefined}>
    <span className="proto-picker-highlight" aria-hidden="true" ref={highlight}/>{names.map((name,index)=><button className="proto-picker-item" key={name} ref={element=>{buttons.current[index]=element;}} data-active={current===index?"":undefined} aria-current={current===index?"true":undefined} onClick={()=>select(index)}>{name}</button>)}
    <span className="proto-picker-divider" aria-hidden="true"/><button className="proto-picker-item proto-picker-replay" aria-label="Replay animation (R)" onClick={()=>setReplay(value=>value+1)}>↻</button>
  </nav></>;
}

