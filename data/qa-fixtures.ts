import { capabilities, type Capability } from "./site";
import { projects, type Project } from "./projects";
import type { ChatMessage } from "../lib/chat";
export type FixtureName = "demo" | "worst" | "empty" | "one";
const longUser="Soy Aleksandra Wiśniewska-Kowalczyk. Tenemos un catálogo de productos textiles y recibimos pedidos por WhatsApp. Nuestro contacto es bartholomew.fitzgerald@northwind-industries-holdings.example.com. Necesitamos organizar productos, variantes, inventario y pedidos. ";
const longReply="Podemos separar el catálogo público de la administración.\n• Catálogo: categorías, imágenes y búsqueda.\n• Pedidos: revisión, preparación y entrega.\n• Equipo: permisos según su trabajo.\nTambién revisaremos si tus herramientas actuales permiten conectarse por API.\n";
export const chatFixtures: Record<FixtureName,readonly ChatMessage[]> = {
  demo:[{id:"demo-u",role:"user",text:"Quiero una tienda en línea."},{id:"demo-m",role:"model",text:"Podemos empezar con catálogo, carrito y pagos. ¿Qué tipo de productos vendes?"}],
  worst:[{id:"long-u",role:"user",text:(longUser.repeat(5)).slice(0,1200)},{id:"long-m",role:"model",text:longReply.repeat(20)},{id:"short-u",role:"user",text:"Jo 👩🏽‍💻 · Nguyễn Thị Minh Khánh · مرحبًا"},{id:"literal-m",role:"model",text:'Texto literal: <script>alert(1)</script>, **sin HTML**, &amp;.\nhttps://example.com/workspaces/acme/projects/q3-launch/docs/9f8e7d6c5b4a?tab=comments&filter=unresolved'}],
  empty:[],
  one:[{id:"one-u",role:"user",text:"Una web."}],
};
export function fixtureCapabilities(name:FixtureName):readonly Capability[] {
  if(name==="empty")return [];
  if(name==="one")return capabilities.slice(0,1);
  if(name==="worst")return capabilities.map((cap,index)=>({...cap,name:index===3?"Aplicaciones web y herramientas para equipos distribuidos":cap.name,title:index===0?"Una presencia digital para Cooperativa de Productores Textiles del Bajío":cap.title,description:cap.description+" Definimos juntos contenidos, roles, funciones y la integración con las herramientas que ya utilizas.",includes:index===2?[]:cap.includes}));
  return capabilities;
}
export function fixtureProjects(name:FixtureName):readonly Project[] {
  if(name==="empty")return [];
  if(name==="one")return projects.slice(0,1);
  if(name==="worst")return projects.map((project,index)=>({...project,title:index===1?"Cooperativa de Productores Textiles del Bajío — División Internacional":project.title,domain:index===2?"productos.catalogo.cooperativa-textil-region-bajio.example.com":project.domain,description:index===3?"":project.description,scope:index===4?[]:project.scope,technologies:index===4?[]:project.technologies}));
  return projects;
}

