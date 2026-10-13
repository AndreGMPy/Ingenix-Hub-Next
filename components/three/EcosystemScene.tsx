"use client";
import { Canvas,useFrame,useThree } from "@react-three/fiber";
import { Billboard,useTexture } from "@react-three/drei";
import { useEffect,useLayoutEffect,useMemo,useRef,type RefObject } from "react";
import { CatmullRomCurve3,Group,MathUtils,Mesh,MeshStandardMaterial,TubeGeometry,Vector3,SRGBColorSpace,PerspectiveCamera } from "three";
import { SystemModule } from "./SystemModule";
type Props={mobile:boolean;moving:boolean;reduced:boolean;progress:RefObject<number>;onReady:()=>void;onFailure:()=>void};
const points:[number,number,number][]=[[-2.15,0,-1.45],[1.95,.12,-1.6],[-2.3,.08,1],[2.1,.12,1.12],[.1,.02,2.3],[.15,.02,-2.4]];
function Circuit({end,index,time,moving}:{end:[number,number,number];index:number;time:RefObject<number>;moving:boolean}){
 const signal=useRef<Mesh>(null);
 const curve=useMemo(()=>new CatmullRomCurve3([new Vector3(0,.04,0),new Vector3(end[0]*.62,.04,0),new Vector3(end[0]*.62,.04,end[2]),new Vector3(...end)],false,"catmullrom",0),[end]);
 const geometry=useMemo(()=>new TubeGeometry(curve,16,.017,5,false),[curve]);
 const position=useMemo(()=>new Vector3(),[]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 useFrame(()=>{if(!moving||!signal.current)return;const phase=(time.current+index*2)%8;signal.current.visible=phase<2;if(phase<2){curve.getPointAt(phase/2,position);signal.current.position.copy(position);signal.current.position.y+=.025;}});
 return <group><mesh geometry={geometry}><meshBasicMaterial color="#55c9ec"/></mesh><mesh ref={signal} visible={false}><sphereGeometry args={[.04,6,4]}/><meshBasicMaterial color="#bdffff"/></mesh></group>;
}
function BrandSymbol(){
 const source=useTexture("/brand/ingenix-isotipo.png");
 const texture=useMemo(()=>{const map=source.clone();map.colorSpace=SRGBColorSpace;map.needsUpdate=true;return map;},[source]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <Billboard position={[0,1.04,0]}><mesh><planeGeometry args={[1.03*1234/1419,1.03]}/><meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false}/></mesh></Billboard>;
}
function System({mobile,moving,reduced,progress,onReady,onFailure}:Props){
 const group=useRef<Group>(null),modules=useRef<(Group|null)[]>([]),coreLight=useRef<MeshStandardMaterial>(null);
 const announced=useRef(false),readyFrame=useRef<number|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const elapsed=useRef(0),smoothProgress=useRef(0),settledDraws=useRef(0),lastView=useRef("");
 const {gl,invalidate,pointer,size,camera}=useThree();
 useLayoutEffect(()=>{
  camera.position.set(6.2,6.2,8);camera.lookAt(0,0,0);camera.updateMatrixWorld(true);
  group.current?.updateMatrixWorld(true);
 },[camera]);
 const afterCoreDraw=()=>{
  if(announced.current||!group.current||size.width<=0||size.height<=0)return;
  const valid=Number.isFinite((camera instanceof PerspectiveCamera?camera.aspect:1))&&(camera instanceof PerspectiveCamera?camera.aspect:1)>0&&group.current.matrixWorld.elements.every(Number.isFinite);
  if(!valid){settledDraws.current=0;return;}
  const view=size.width+":"+size.height+":"+(camera instanceof PerspectiveCamera?camera.aspect:1).toFixed(6);
  settledDraws.current=view===lastView.current?settledDraws.current+1:1;lastView.current=view;
  if(settledDraws.current>=2){announced.current=true;readyFrame.current=requestAnimationFrame(onReady);}
  else readyFrame.current=requestAnimationFrame(()=>invalidate());
 };
 useEffect(()=>{const lost=(e:Event)=>{e.preventDefault();onFailure();};gl.domElement.addEventListener("webglcontextlost",lost);invalidate();
 return()=>{gl.domElement.removeEventListener("webglcontextlost",lost);if(readyFrame.current!==null)cancelAnimationFrame(readyFrame.current);if(timer.current)clearTimeout(timer.current);announced.current=false;};},[gl,invalidate,onFailure]);
 useEffect(()=>{
  if(timer.current){clearTimeout(timer.current);timer.current=null;}
  gl.domElement.setAttribute("data-scene-mode",reduced?"reduced":!moving?"paused":mobile?"ambient":"pointer");
  // Numeric snapshots for technical QA; no DOM writes or React updates per frame.
  Object.defineProperty(gl.domElement,"ingenixMotion",{configurable:true,get:()=>({elapsed:elapsed.current,progress:smoothProgress.current,rotation:group.current?.rotation.y,frames:gl.info.render.frame,settledDraws:settledDraws.current,cameraAspect:(camera instanceof PerspectiveCamera?camera.aspect:1),mode:gl.domElement.dataset.sceneMode})});
  if(reduced&&group.current){group.current.rotation.set(0,0,0);group.current.position.y=0;group.current.scale.setScalar(1);camera.position.set(6.2,6.2,8);modules.current.forEach((node,index)=>node?.position.set(...points[index]));}
  invalidate();return()=>{if(timer.current)clearTimeout(timer.current);Reflect.deleteProperty(gl.domElement,"ingenixMotion");};
 },[mobile,moving,reduced,gl,invalidate,camera]);
 useEffect(()=>{
  if(mobile||!moving||size.width<=0||size.height<=0)return;
  const move=(e:PointerEvent)=>{pointer.set(e.offsetX/size.width*2-1,-e.offsetY/size.height*2+1);invalidate();};
  const leave=()=>{pointer.set(0,0);invalidate();};
  gl.domElement.addEventListener("pointermove",move);gl.domElement.addEventListener("pointerleave",leave);
  return()=>{gl.domElement.removeEventListener("pointermove",move);gl.domElement.removeEventListener("pointerleave",leave);};
 },[gl,invalidate,mobile,moving,pointer,size.width,size.height]);
 useFrame((state,delta)=>{

  if(!group.current||!moving||reduced)return;
  const dt=Math.min(delta,.06);
  if(mobile){
   elapsed.current+=dt;const t=elapsed.current;
   smoothProgress.current=MathUtils.damp(smoothProgress.current,Math.max(0,Math.min(1,progress.current)),4,dt);
   const p=smoothProgress.current,spread=Math.sin(p*Math.PI);
   group.current.rotation.y=Math.sin(t*.28)*.065+p*.065;group.current.rotation.x=Math.sin(t*.21)*.025;
   group.current.position.y=Math.sin(t*.32)*.032;group.current.scale.setScalar(1+spread*.045);
   modules.current.forEach((node,index)=>{if(node)node.position.y=points[index][1]+Math.sin(t*.45+index*1.7)*.022+spread*.1;});
   camera.position.set(6.2+Math.sin(t*.22)*.035,6.2+Math.sin(t*.28)*.018,8);
   if(coreLight.current)coreLight.current.emissiveIntensity=.15+(Math.sin(t*.4)+1)*.035;
   // Demand rendering at a capped cadence while visible, never an always-on mobile loop.
   if(!timer.current)timer.current=setTimeout(()=>{timer.current=null;invalidate();},33);
  }else{
   group.current.rotation.y=MathUtils.damp(group.current.rotation.y,state.pointer.x*.12,4,dt);group.current.rotation.x=MathUtils.damp(group.current.rotation.x,-state.pointer.y*.045,4,dt);
   if(Math.abs(group.current.rotation.y-state.pointer.x*.12)+Math.abs(group.current.rotation.x+state.pointer.y*.045)>.0002)invalidate();
  }
  group.current.updateMatrixWorld(true);camera.updateMatrixWorld(true);
 },-1);
 return <group ref={group} position={[0,0,0]} rotation={[0,0,0]} scale={1}>
  <mesh position={[0,.08,0]}><cylinderGeometry args={[1.07,1.07,.09,6]}/><meshStandardMaterial color="#8dbafa" metalness={.4} roughness={.3}/></mesh>
  <mesh position={[0,.24,0]}><cylinderGeometry args={[.94,.94,.09,6]}/><meshStandardMaterial ref={coreLight} color="#42c9ea" emissive="#42c9ea" emissiveIntensity={.15}/></mesh>
  <mesh position={[0,.49,0]}><cylinderGeometry args={[.82,.96,.42,6]}/><meshStandardMaterial color="#124d9d" metalness={.45} roughness={.3}/></mesh>
  <mesh position={[0,.72,0]} onAfterRender={afterCoreDraw}><cylinderGeometry args={[.8,.8,.04,6]}/><meshStandardMaterial color="#0b264b" roughness={.25}/></mesh>
  <BrandSymbol/>
  {(mobile?points.slice(0,4):points).map((point,index)=><group key={index}><Circuit end={point} index={index} time={elapsed} moving={mobile&&moving&&!reduced}/><group position={point} ref={node=>{modules.current[index]=node;}}><SystemModule index={index}/></group></group>)}
 </group>;
}
export default function EcosystemScene(props:Props){
 return <Canvas dpr={props.mobile?1:[1,1.5]} camera={{position:[6.2,6.2,8],fov:35}} frameloop="demand" gl={{alpha:true,antialias:!props.mobile,powerPreference:"low-power"}} resize={{scroll:false}} fallback={null} aria-hidden="true"><ambientLight intensity={1.8}/><directionalLight position={[3,6,5]} intensity={3}/>{!props.mobile&&<directionalLight position={[-4,2,-2]} intensity={1.5} color="#7fb7ff"/>}<System {...props}/></Canvas>;
}

