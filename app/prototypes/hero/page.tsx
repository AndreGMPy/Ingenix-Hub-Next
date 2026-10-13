import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { Capabilities } from "@/components/home/Capabilities";
import { SelectedWork } from "@/components/portfolio/SelectedWork";
import { NixSection } from "@/components/home/NixSection";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { NixChat } from "@/components/nix/NixChat";
import { HeroPicker } from "./HeroPicker";
import { EditorialHero } from "./EditorialHero";
import { BlueprintHero } from "./BlueprintHero";
import "./prototype.css";
export const metadata = { title: "Prototipos de Hero", robots: { index:false,follow:false } };
export default async function PrototypePage({searchParams}: {searchParams:Promise<{v?:string}>}) {
  if (process.env.NODE_ENV !== "development") notFound();
  const input=Number((await searchParams).v ?? 1);
  const initial=Number.isInteger(input) && input>=1 && input<=3 ? input-1 : 0;
  return <><Header/><main><HeroPicker initial={initial} variants={[<Hero key="ecosystem"/>,<EditorialHero key="editorial"/>,<BlueprintHero key="blueprint"/>]}/><Capabilities/><SelectedWork/><NixSection/><Contact/></main><Footer/><BottomNav/><NixChat/></>;
}

