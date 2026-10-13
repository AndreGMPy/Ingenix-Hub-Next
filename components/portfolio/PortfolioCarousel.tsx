"use client";
import { Children,useEffect,useRef,useState,type PointerEvent } from "react";
import { motion,useMotionValue,useTransform,animate } from "motion/react";
import { ArrowLeft,ArrowRight } from "lucide-react";
import { useMedia,MOBILE_QUERY } from "@/lib/use-media";
import { motionTokens } from "@/lib/motion";
export function PortfolioCarousel({children,names}:{children:React.ReactNode;names:readonly string[]}) {
 const slides=Children.toArray(children),[active,setActive]=useState(0),[instant,setInstant]=useState(true);
 const current=Math.min(active,Math.max(0,names.length-1)),mobile=useMedia(MOBILE_QUERY),reduced=useMedia("(prefers-reduced-motion:reduce)");
 const stage=useRef<HTMLDivElement>(null),width=useRef(600),gesture=useRef<{id:number;x:number;y:number;lastX:number;lastTime:number;velocity:number;horizontal:boolean}|null>(null);
 const suppressClick=useRef(false),settle=useRef<ReturnType<typeof animate>|null>(null);
 const drag=useMotionValue(0),dragTransform=useTransform(drag,value=>"translate3d("+value+"px,0,0)");
 useEffect(()=>{const element=stage.current;if(!element)return;const observer=new ResizeObserver(entries=>{width.current=entries[0]?.contentRect.width||600;});observer.observe(element);return()=>{observer.disconnect();settle.current?.stop();};},[]);
 useEffect(()=>{
  const element=stage.current,content=element?.querySelector<HTMLElement>('.coverflow-slide[data-active="true"]>div');
  if(!element||!content)return;
  // Content-sized safety floor: long names and enlarged text remain reachable.
  const observer=new ResizeObserver(()=>element.style.setProperty("min-height",(content.offsetHeight+32)+"px"));
  observer.observe(content);return()=>observer.disconnect();
 },[current,names.length]);
 function select(index:number,immediate=false) {
  if(!names.length)return;
  setInstant(immediate);setActive(((index%names.length)+names.length)%names.length);
 }
 function reset(immediate=false){settle.current?.stop();if(immediate||reduced)drag.set(0);else settle.current=animate(drag,0,motionTokens.spring);}
 function down(e:PointerEvent<HTMLDivElement>){
  suppressClick.current=false;
  if(names.length<2||e.button!==0||!e.isPrimary||(e.target as HTMLElement).closest("button,summary"))return;
  settle.current?.stop();suppressClick.current=false;
  gesture.current={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastTime:e.timeStamp,velocity:0,horizontal:false};
 }
 function move(e:PointerEvent<HTMLDivElement>){
  const g=gesture.current;if(!g||g.id!==e.pointerId)return;
  const dx=e.clientX-g.x,dy=e.clientY-g.y;
  if(!g.horizontal){if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8){gesture.current=null;reset();return;}if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy)*1.2)return;g.horizontal=true;e.currentTarget.setPointerCapture(e.pointerId);}
  const dt=e.timeStamp-g.lastTime;if(dt>0)g.velocity=(e.clientX-g.lastX)/dt;
  g.lastX=e.clientX;g.lastTime=e.timeStamp;
  const limit=width.current*.28;drag.set(Math.max(-limit,Math.min(limit,dx)));suppressClick.current=true;
 }
 function up(e:PointerEvent<HTMLDivElement>){
  const g=gesture.current;if(!g||g.id!==e.pointerId)return;gesture.current=null;
  if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
  const distance=e.clientX-g.x,velocity=e.timeStamp-g.lastTime>100?0:g.velocity;
  if(g.horizontal&&(Math.abs(distance)>width.current*.12||Math.abs(velocity)>.11))select(current+(distance<0?1:-1));
  reset();
 }
 return <div className="portfolio-carousel portfolio-coverflow" role="region" aria-roledescription="carrusel" aria-label="Proyectos de Ingenix Hub">
  <div className="portfolio-controls"><p className="portfolio-count mono" aria-live="polite"><strong>{String(current+1).padStart(2,"0")}</strong><span>/ {String(names.length).padStart(2,"0")}</span><span className="portfolio-current-name">{names[current]}</span></p><div className="portfolio-arrows"><button type="button" className="icon-button" aria-label="Proyecto anterior" disabled={names.length<2} onClick={e=>select(current-1,e.detail===0)}><ArrowLeft size={20} aria-hidden="true"/></button><button type="button" className="icon-button" aria-label="Proyecto siguiente" disabled={names.length<2} onClick={e=>select(current+1,e.detail===0)}><ArrowRight size={20} aria-hidden="true"/></button></div></div>
  <div ref={stage} className="portfolio-track coverflow-stage" tabIndex={0} aria-label="Desliza para explorar proyectos; usa flechas izquierda y derecha" onKeyDown={e=>{
   if((e.target as HTMLElement).closest("a,button,summary"))return;
   if(e.key==="ArrowRight"){e.preventDefault();select(current+1,true);}
   else if(e.key==="ArrowLeft"){e.preventDefault();select(current-1,true);}
   else if(e.key==="Home"){e.preventDefault();select(0,true);}
   else if(e.key==="End"){e.preventDefault();select(names.length-1,true);}
  }}>
   <motion.div className="coverflow-drag-plane" style={{transform:dragTransform}} onDragStartCapture={event=>event.preventDefault()} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={()=>{gesture.current=null;reset();}} onClickCapture={e=>{if(suppressClick.current&&e.detail>0){e.preventDefault();e.stopPropagation();suppressClick.current=false;}}}>
   {slides.map((slide,index)=>{
    let offset=(index-current+names.length)%names.length;if(offset>names.length/2)offset-=names.length;
    const selected=offset===0,neighbor=Math.abs(offset)===1,side=offset<0?-1:1;
    const transform=selected?"translate3d(-50%,0,0) rotateY(0deg) scale(1)":"translate3d("+(-50+offset*(mobile?85:74))+"%,0,"+(mobile?-60:-150)+"px) rotateY("+(-side*(mobile?7:14))+"deg) scale("+(mobile?.9:.86)+")";
    return <motion.div key={names[index]+index} className="coverflow-slide" data-active={selected?"true":"false"} data-side={offset} initial={false} animate={{transform,opacity:selected?1:neighbor?.68:0}} transition={instant||reduced?{duration:0}:motionTokens.spring} style={{zIndex:selected?4:neighbor?2:0,pointerEvents:selected||neighbor?"auto":"none"}} aria-hidden={!selected&&!neighbor?true:undefined}>
     <div inert={!selected} aria-hidden={!selected?true:undefined}>{slide}</div>
     {neighbor&&<button className="coverflow-neighbor" type="button" aria-label={"Activar "+names[index]} onClick={e=>select(index,e.detail===0)}><span className="sr-only">{names[index]}</span></button>}
    </motion.div>;
   })}
   </motion.div>
  </div>
  <div className="portfolio-pagination" aria-label="Elegir proyecto">{names.map((name,index)=><button type="button" key={name+index} aria-label={"Ver "+name} aria-current={index===current?"true":undefined} onClick={e=>select(index,e.detail===0)}><span/><span className="sr-only">{index+1}</span></button>)}</div>
  <p className="portfolio-gesture mono">DESLIZA / EXPLORA / ABRE EL PROYECTO</p>
 </div>;
}

