"use client";

import Image from "next/image";
import { FolderKanban, Home, Layers3, Mail } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const destinations = [
  { id: "hero", label: "Inicio", icon: Home },
  { id: "services", label: "Servicios", icon: Layers3 },
  { id: "portfolio", label: "Proyectos", icon: FolderKanban },
  { id: "contact", label: "Contacto", icon: Mail },
] as const;

export function MobileBottomNav() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<(typeof destinations)[number]["id"]>("hero");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const sections = destinations
      .map(item => document.getElementById(item.id))
      .filter((item): item is HTMLElement => Boolean(item));
    if (!sections.length) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id as (typeof destinations)[number]["id"]);
    }, { rootMargin: "-18% 0px -58%", threshold: [0.02, 0.2, 0.5] });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateKeyboard = () => {
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      setKeyboardOpen(window.innerHeight - height > 150);
    };
    const onChatState = (event: Event) => setChatOpen(Boolean((event as CustomEvent<boolean>).detail));
    updateKeyboard();
    window.visualViewport?.addEventListener("resize", updateKeyboard);
    window.addEventListener("resize", updateKeyboard);
    window.addEventListener("ingenix:chat-state", onChatState);
    return () => {
      window.visualViewport?.removeEventListener("resize", updateKeyboard);
      window.removeEventListener("resize", updateKeyboard);
      window.removeEventListener("ingenix:chat-state", onChatState);
    };
  }, []);

  const goTo = (id: (typeof destinations)[number]["id"]) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav className={`mobile-bottom-nav${keyboardOpen ? " is-keyboard-open" : ""}`} aria-label="Navegación móvil">
      <div className="mobile-bottom-nav-inner">
        {destinations.slice(0, 2).map(item => <MobileNavItem key={item.id} item={item} active={active === item.id} onClick={() => goTo(item.id)} />)}
        <motion.button
          className={`mobile-nix-action${chatOpen ? " is-chat-open" : ""}`}
          type="button"
          aria-label={chatOpen ? "Chat de Nix abierto" : "Abrir chat con Nix"}
          aria-expanded={chatOpen}
          onClick={() => window.dispatchEvent(new CustomEvent("ingenix:open-chat"))}
          whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        >
          <span className="mobile-nix-image"><Image src="/mascota-ingenix/mascota-final.webp" alt="" width={72} height={72} /></span>
          <span>Nix</span>
        </motion.button>
        {destinations.slice(2).map(item => <MobileNavItem key={item.id} item={item} active={active === item.id} onClick={() => goTo(item.id)} />)}
      </div>
    </nav>
  );
}

function MobileNavItem({ item, active, onClick }: {
  item: (typeof destinations)[number];
  active: boolean;
  onClick: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const Icon = item.icon;
  return (
    <motion.button className={`mobile-nav-item${active ? " is-active" : ""}`} type="button" aria-current={active ? "page" : undefined} onClick={onClick} whileTap={reduceMotion ? undefined : { scale: 0.94 }}>
      {active && <motion.span className="mobile-nav-active" layoutId="mobile-nav-active" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
      <motion.span className="mobile-nav-icon" animate={active && !reduceMotion ? { y: -2 } : { y: 0 }} transition={{ duration: 0.18 }}><Icon aria-hidden="true" /></motion.span>
      <span>{item.label}</span>
    </motion.button>
  );
}
