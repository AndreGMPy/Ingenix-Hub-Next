import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Capabilities } from "@/components/home/Capabilities";
import { ArchitectureStory } from "@/components/home/ArchitectureStory";
import { SelectedWork } from "@/components/portfolio/SelectedWork";
import { NixSection } from "@/components/home/NixSection";
import { Process } from "@/components/home/Process";
import { Contact } from "@/components/home/Contact";
import { NixChat } from "@/components/nix/NixChat";
import { ScrollDirector } from "@/components/home/ScrollDirector";
import { BrandIntro } from "@/components/layout/BrandIntro";
export default function Home() {
  return <><a className="skip-link" href="#contenido">Ir al contenido</a><Header /><main id="contenido">
    <Hero /><Capabilities /><ArchitectureStory /><SelectedWork /><NixSection /><Process /><Contact />
  </main><Footer /><BottomNav /><NixChat /><ScrollDirector /><BrandIntro /></>;
}

