import Image from "next/image";
export function EcosystemFallback(){
 return <div className="ecosystem-fallback isotope-fallback">
  <svg viewBox="0 0 620 480" fill="none" aria-hidden="true"><g stroke="#609de2" strokeWidth="1.5" opacity=".5"><path d="M310 240H210L160 160H65M310 240H410L460 160H555M310 240H215L165 330H65M310 240H405L455 330H555"/><circle cx="160" cy="160" r="4"/><circle cx="460" cy="160" r="4"/><circle cx="165" cy="330" r="4"/><circle cx="455" cy="330" r="4"/></g></svg>
  <div className="fallback-official-isotype"><Image src="/brand/ingenix-isotipo-square.png" alt="" width={180} height={180} sizes="(max-width:767px) 140px, 180px" priority/></div>
 </div>;
}

