import { RoundedBox, Billboard, useTexture } from "@react-three/drei";
function Slab({position=[0,0,0],size,color="#62d6ed"}:{position?:[number,number,number];size:[number,number,number];color?:string}) { return <mesh position={position}><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={.45}/></mesh>; }
function NixHologram(){const texture=useTexture("/nix/nix.webp");return <Billboard position={[0,.3,0]}><mesh><planeGeometry args={[.65,.65]}/><meshBasicMaterial map={texture} transparent depthWrite={false}/></mesh></Billboard>;}
export function SystemModule({index}:{index:number}){
 return <group>
  <RoundedBox args={[1.05,.12,.8]} radius={.05} smoothness={2}><meshStandardMaterial color="#7da3cf" metalness={.35} roughness={.4}/></RoundedBox>
  <Slab position={[0,.073,0]} size={[.95,.025,.7]} color="#102c50"/>
  {index===0&&<group rotation={[-.5,0,0]} position={[0,.18,-.12]}><Slab size={[.85,.045,.56]} color="#ecf5ff"/><Slab position={[0,.028,-.2]} size={[.7,.01,.035]} color="#597694"/><Slab position={[-.17,.035,.015]} size={[.32,.013,.21]} color="#236cdf"/><Slab position={[.2,.035,-.04]} size={[.25,.013,.06]}/><Slab position={[.2,.035,.08]} size={[.25,.013,.035]}/></group>}
  {index===1&&<group>{[-.27,0,.27].map((x,i)=><group key={x} position={[x,.18,0]}><Slab size={[.19,.18+i*.035,.23]} color={["#d7bce4","#87caf4","#efe0b2"][i]}/><Slab position={[0,-.08,.2]} size={[.14,.018,.025]}/></group>)}<Slab position={[0,.09,.3]} size={[.65,.015,.04]} color="#b3d3ff"/></group>}
  {index===2&&<group><Slab position={[-.35,.105,0]} size={[.15,.025,.57]} color="#2b65ae"/>{[.15,.32,.24,.4].map((h,i)=><Slab key={i} position={[-.13+i*.15,.1+h/2,.02]} size={[.09,h,.26]} color={i===3?"#5de1ed":"#3d83e6"}/>)}<Slab position={[.13,.12,.29]} size={[.5,.02,.02]} color="#d6edff"/></group>}
  {index===3&&<group position={[0,.17,0]}>{[0,.16,.32].map(y=><mesh key={y} position={[0,y,0]}><cylinderGeometry args={[.26,.26,.13,16]}/><meshStandardMaterial color={y===.32?"#79dcf1":"#3876bd"} metalness={.45} roughness={.3}/></mesh>)}</group>}
  {index===4&&<group>{[-.3,0,.3].map((x,i)=><group key={x}><Slab position={[x,.15,i%2?.14:-.1]} size={[.18,.09,.19]} color={i===1?"#e3f4ff":"#5abfdc"}/>{i<2&&<Slab position={[x+.15,.115,.02]} size={[.17,.025,.025]}/>}</group>)}</group>}
  {index===5&&<NixHologram/>}
  <mesh position={[.42,.105,.29]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.026,8]}/><meshBasicMaterial color="#66e5ef"/></mesh>
 </group>;
}

