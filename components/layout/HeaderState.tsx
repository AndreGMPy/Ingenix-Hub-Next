"use client";
import { useEffect } from "react";
export function HeaderState(){
 useEffect(()=>{
  const header=document.querySelector<HTMLElement>(".site-header"),marker=document.getElementById("inicio");
  if(!header||!marker)return;
  const observer=new IntersectionObserver(entries=>{header.dataset.scrolled=String(!entries[0]?.isIntersecting);},{rootMargin:"-85px 0px 0px 0px"});observer.observe(marker);
  const links=Array.from(header.querySelectorAll<HTMLAnchorElement>(".desktop-nav a"));
  const sections=links.map(a=>document.querySelector(a.hash)).filter((el):el is Element=>!!el);
  let sectionsObserver:IntersectionObserver;
  const observe=()=>{
   sectionsObserver?.disconnect();
   sectionsObserver=new IntersectionObserver(entries=>{const section=entries.find(e=>e.isIntersecting);if(!section)return;links.forEach(a=>{if(a.hash==="#"+section.target.id)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current");});},{rootMargin:"-90px 0px -"+Math.round(window.innerHeight*.45)+"px 0px"});
   sections.forEach(el=>sectionsObserver.observe(el));
  };observe();window.addEventListener("resize",observe);
  return()=>{observer.disconnect();sectionsObserver.disconnect();window.removeEventListener("resize",observe);};
 },[]);
 return null;
}

