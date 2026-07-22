"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUp, MessageCircle, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { whatsappNumber } from "@/data/site";

type ChatMessage = {
  id: string;
  role: "user" | "model";
  text: string;
  error?: boolean;
  sendFailed?: boolean;
};

const MAX_HISTORY_TURNS = 6;
const MAX_STORED_MESSAGE_CHARS = 1_200;
const CLIENT_TIMEOUT_MS = 45_000;

const quickPrompts = [
  ["Página web", "Quiero una página web para mi negocio"],
  ["App o sistema", "Necesito una app o sistema web"],
  ["Automatización IA", "Quiero automatizar un proceso con inteligencia artificial"],
  ["Cotizar proyecto", "Ayúdame a cotizar mi proyecto"],
] as const;

const welcome = "Hola, soy Nix 👋 La IA de Ingenix Hub. Cuéntame qué quieres crear y te ayudaré a definir la opción más conveniente para tu proyecto.";

function createMessageId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `nix-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function limitToRecentTurns(messages: ChatMessage[], maxTurns = MAX_HISTORY_TURNS) {
  const turns: ChatMessage[][] = [];

  for (const message of messages) {
    if (message.error || message.sendFailed) continue;
    if (message.role === "user") {
      turns.push([message]);
      continue;
    }

    const currentTurn = turns.at(-1);
    if (currentTurn?.length === 1 && currentTurn[0].role === "user") currentTurn.push(message);
  }

  return turns.slice(-maxTurns).flat();
}

function readHistory(): ChatMessage[] {
  try {
    const parsed = JSON.parse(sessionStorage.getItem("nix-chat-history") || "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    const messages = parsed
      .filter((item): item is Omit<ChatMessage, "id"> => Boolean(item) && (item.role === "user" || item.role === "model") && typeof item.text === "string" && item.text.trim().length > 0 && item.text.length <= MAX_STORED_MESSAGE_CHARS)
      .map((item) => ({ id: createMessageId(), role: item.role, text: item.text.trim() }));
    return limitToRecentTurns(messages);
  } catch { return []; }
}

export function NixChat({ floatHref }: { floatHref: string }) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);
  const [allowMascotVideo, setAllowMascotVideo] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [viewport, setViewport] = useState({ height: 0, top: 0 });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const isSendingRef = useRef(false);
  const activeRequestRef = useRef<{ controller: AbortController; timeoutId: number } | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), reduceMotion ? 0 : 180);
  }, [reduceMotion]);

  useEffect(() => {
    const id = window.setTimeout(() => { setHistory(readHistory()); setHydrated(true); }, 0);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    const openFromMobileNavigation = () => setOpen(true);
    window.addEventListener("ingenix:open-chat", openFromMobileNavigation);
    return () => window.removeEventListener("ingenix:open-chat", openFromMobileNavigation);
  }, []);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("ingenix:chat-state", { detail: open }));
  }, [open]);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 701px) and (hover: hover) and (pointer: fine)");
    const update = () => setAllowMascotVideo(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    const persistableHistory = limitToRecentTurns(history).map(({ role, text }) => ({ role, text }));
    try { sessionStorage.setItem("nix-chat-history", JSON.stringify(persistableHistory)); } catch {}
  }, [history, hydrated]);
  useEffect(() => { messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" }); }, [history, busy, open, reduceMotion]);

  useEffect(() => {
    const updateViewport = () => {
      const vv = window.visualViewport;
      setViewport({ height: vv?.height || window.innerHeight, top: vv?.offsetTop || 0 });
    };
    updateViewport();
    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);
    return () => {
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (open) {
      scrollRef.current = window.scrollY;
      document.body.classList.add("nix-chat-open");
      Object.assign(document.body.style, { position: "fixed", top: `-${scrollRef.current}px`, left: "0", right: "0", width: "100%", overflow: "hidden" });
      window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), reduceMotion ? 0 : 180);
    } else {
      document.body.classList.remove("nix-chat-open");
      if (document.body.style.position === "fixed") {
        Object.assign(document.body.style, { position: "", top: "", left: "", right: "", width: "", overflow: "" });
        window.scrollTo({ top: scrollRef.current, behavior: "instant" });
      }
    }
  }, [open, reduceMotion]);

  useEffect(() => {
    if (!open) return;
    const getFocusable = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], textarea:not([disabled])") ?? []);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); return; }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  useEffect(() => () => {
    document.body.classList.remove("nix-chat-open");
    Object.assign(document.body.style, { position: "", top: "", left: "", right: "", width: "", overflow: "" });
  }, []);

  useEffect(() => () => {
    const activeRequest = activeRequestRef.current;
    if (!activeRequest) return;
    window.clearTimeout(activeRequest.timeoutId);
    activeRequest.controller.abort();
    activeRequestRef.current = null;
  }, []);

  const whatsappHref = useMemo(() => {
    const userMessages = history.filter(message => message.role === "user" && !message.error).slice(-4).map(message => `• ${message.text.replace(/\s+/g, " ").trim()}`);
    const summary = userMessages.length
      ? `Hola, hablé con Nix en ingenixhub.com y quiero continuar mi cotización. Esto es lo que necesito:\n${userMessages.join("\n")}`
      : "Hola, quiero cotizar un proyecto con Ingenix Hub.";
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary.slice(0, 1400))}`;
  }, [history]);

  const resizeInput = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 108)}px`;
  };

  async function askNix(raw: string) {
    const clean = raw.trim();
    if (!clean || isSendingRef.current) return;
    const userMessage: ChatMessage = { id: createMessageId(), role: "user", text: clean };
    const requestHistory = [...limitToRecentTurns(history, MAX_HISTORY_TURNS - 1), userMessage];
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

    isSendingRef.current = true;
    activeRequestRef.current = { controller, timeoutId };
    setHistory(requestHistory);
    setInput("");
    if (inputRef.current) { inputRef.current.style.height = "auto"; }
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestHistory.map(({ role, text }) => ({ role, text })) }),
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({})) as { reply?: string; error?: string };
      if (!response.ok) throw new Error(payload.error || "No pude conectar con la IA en este momento.");
      const answer = String(payload.reply || "").trim();
      if (!answer) throw new Error("La IA no devolvió una respuesta. Intenta de nuevo.");
      const botMessage: ChatMessage = { id: createMessageId(), role: "model", text: answer };
      setHistory((current) => limitToRecentTurns([...current.filter((message) => !message.error && !message.sendFailed), botMessage]));
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === "AbortError";
      const message = timedOut
        ? "Nix tardó más de 45 segundos en responder. Intenta nuevamente."
        : error instanceof Error ? error.message : "No pude responder ahora. Puedes continuar por WhatsApp.";
      const errorMessage: ChatMessage = { id: createMessageId(), role: "model", text: message, error: true };
      setHistory((current) => [
        ...current.map((message) => message.id === userMessage.id ? { ...message, sendFailed: true } : message),
        errorMessage,
      ]);
    } finally {
      window.clearTimeout(timeoutId);
      if (activeRequestRef.current?.controller === controller) activeRequestRef.current = null;
      isSendingRef.current = false;
      setBusy(false);
      window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0);
    }
  }

  const submit = (event: FormEvent) => { event.preventDefault(); void askNix(input); };
  return (
    <>
      <button ref={triggerRef} className={`mascot-dock${finished ? " is-finished" : ""}${allowMascotVideo ? "" : " no-video"}`} id="nix-chat-trigger" type="button" aria-label="Abrir chat con Nix" aria-controls="nix-chat" aria-expanded={open} onClick={() => open ? close() : setOpen(true)}>
        <span className="mascot-dock-glow" />
        {allowMascotVideo && <video className="mascot-dock-video" autoPlay muted playsInline preload="auto" poster="/mascota-ingenix/mascota-poster.webp" disablePictureInPicture onEnded={() => setFinished(true)} onError={() => setFinished(true)}><source src="/mascota-ingenix/mascota-ingenix.webm" type="video/webm; codecs=vp9" /></video>}
        <Image className="mascot-dock-final" src="/mascota-ingenix/mascota-final.webp" alt="" width={512} height={512} decoding="async" />
        <span className="mascot-dock-label"><span />IA activada</span>
      </button>

      <motion.div className={`nix-chat-backdrop${open ? " is-open" : ""}`} aria-hidden={!open} onClick={close} animate={{ opacity: open ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.22 }} />
      <motion.aside
        ref={panelRef}
        className={`nix-chat${open ? " is-open" : ""}`}
        id="nix-chat"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nix-chat-title"
        aria-hidden={!open}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.22 }}
        style={{ "--nix-vv-height": `${viewport.height || 800}px`, "--nix-vv-top": `${viewport.top}px` } as React.CSSProperties}
      >
        <header className="nix-chat-header">
          <div className="nix-chat-identity">
            <span className="nix-avatar" aria-hidden="true"><Image src="/mascota-ingenix/mascota-final.webp" alt="" width={80} height={80} /></span>
            <span><strong id="nix-chat-title">Nix</strong><small><i /> Asistente IA de Ingenix Hub</small></span>
          </div>
          <button className="nix-chat-close" type="button" aria-label="Cerrar chat" onClick={close}><X aria-hidden="true" /></button>
        </header>
        <div className="nix-chat-intro">Puedo orientarte sobre páginas web, catálogos, apps, paneles y automatizaciones con IA.</div>
        <div ref={messagesRef} className="nix-chat-messages" aria-live="polite" aria-label="Conversación con Nix">
          {history.length === 0 && <ChatBubble message={{ id: "welcome", role: "model", text: welcome }} />}
          {history.map((message) => <ChatBubble key={message.id} message={message} />)}
          {busy && <div className="nix-message bot nix-typing"><span className="nix-message-avatar" aria-hidden="true"><Image src="/mascota-ingenix/mascota-final.webp" alt="" width={32} height={32} /></span><span className="nix-message-bubble" aria-label="Nix está escribiendo"><span className="nix-typing-label">Nix está escribiendo…</span><i className="nix-typing-dot" /><i className="nix-typing-dot" /><i className="nix-typing-dot" /></span></div>}
        </div>
        <div className="nix-chat-quick" aria-label="Preguntas rápidas">
          {quickPrompts.map(([label, prompt]) => <button key={label} type="button" disabled={busy} onClick={() => void askNix(prompt)}>{label}</button>)}
        </div>
        <form className="nix-chat-form" onSubmit={submit}>
          <label className="sr-only" htmlFor="nix-chat-input">Escribe tu mensaje</label>
          <textarea ref={inputRef} id="nix-chat-input" name="message" rows={1} maxLength={800} placeholder="Cuéntame qué quieres crear…" autoComplete="off" required value={input} disabled={busy} onChange={event => { setInput(event.target.value); resizeInput(event.target); }} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
          <button type="submit" disabled={busy || !input.trim()} aria-label="Enviar mensaje"><ArrowUp aria-hidden="true" /></button>
        </form>
        <footer className="nix-chat-footer">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />Continuar por WhatsApp</a>
          <small>Nix es una IA y puede equivocarse. No compartas datos sensibles.</small>
        </footer>
      </motion.aside>

      <a className="whatsapp-float" href={floatHref} target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp"><MessageCircle aria-hidden="true" /></a>
    </>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={`nix-message ${message.role === "user" ? "user" : "bot"}${message.error ? " error" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {message.role !== "user" && <span className="nix-message-avatar" aria-hidden="true"><Image src="/mascota-ingenix/mascota-final.webp" alt="" width={32} height={32} /></span>}
      <div className="nix-message-bubble">{message.text}</div>
    </motion.div>
  );
}
