"use client";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowUp, ArrowUpRight, MessageCircle, Minus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { site } from "@/data/site";
import { MAX_INPUT, parseStoredHistory, recentTurns, requestTurns, whatsappSummary, type ChatMessage } from "@/lib/chat";
import { OPEN_NIX } from "@/lib/nix-events";
import { MOBILE_QUERY, useMedia } from "@/lib/use-media";
import { NixMessages } from "./NixMessages";
const prompts = [
  ["Una página web", "Quiero una página web para mi negocio. ¿Por dónde empiezo?"],
  ["Una tienda en línea", "Quiero vender mis productos en una tienda en línea."],
  ["Un sistema", "Necesito un sistema para administrar mi negocio."],
  ["Automatizar", "Quiero automatizar un proceso. ¿Qué necesitas saber?"],
] as const;
function id() { return crypto.randomUUID(); }
export function NixChat() {
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const mobile = useMedia(MOBILE_QUERY);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const sending = useRef(false);
  const activeRequest = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const timer = window.setTimeout(() => {
      let raw: string | null = null;
      try { raw = sessionStorage.getItem("ingenix-v2-nix-history"); } catch {}
      setHistory(parseStoredHistory(raw)); setLoaded(true);
    }, 0);
    const externalOpen = (event: Event) => {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setInstant((event as CustomEvent<{ instant?: boolean }>).detail?.instant === true);
      setOpen(true);
    };
    window.addEventListener(OPEN_NIX, externalOpen);
    return () => { mounted.current = false; window.clearTimeout(timer); window.removeEventListener(OPEN_NIX, externalOpen); activeRequest.current?.abort(); };
  }, []);
  useEffect(() => {
    if (loaded) { try { sessionStorage.setItem("ingenix-v2-nix-history", JSON.stringify(recentTurns(history))); } catch {} }
  }, [history, loaded]);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
  }, [history,busy,open]);
  useEffect(() => {
    if (!open || !mobile) return;
    const viewport = window.visualViewport;
    let viewportPopup: HTMLDivElement | null = null;
    const update = () => {
      const popup = popupRef.current;
      if (!popup) return;
      viewportPopup = popup;
      popup.style.height = (viewport?.height ?? window.innerHeight) + "px";
      popup.style.top = (viewport?.offsetTop ?? 0) + "px";
    };
    const frame = requestAnimationFrame(update);
    viewport?.addEventListener("resize",update);
    viewport?.addEventListener("scroll",update);
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize",update);
      viewport?.removeEventListener("scroll",update);
      viewportPopup?.style.removeProperty("height");
      viewportPopup?.style.removeProperty("top");
    };
  }, [open,mobile]);
  const whatsapp = useMemo(() => site.whatsapp + "?text=" + encodeURIComponent(whatsappSummary(history)), [history]);
  async function send(raw: string) {
    const clean = raw.trim();
    if (!clean || clean.length > MAX_INPUT || sending.current) return;
    const user: ChatMessage = { id: id(), role: "user", text: clean };
    const base = history.filter(message => !message.error && !message.failed);
    const request = requestTurns(base,user);
    const controller = new AbortController();
    activeRequest.current = controller;
    sending.current = true;
    const timeout = window.setTimeout(() => controller.abort(), 48_000);
    setHistory([...base,user]); setInput(""); setBusy(true);
    if (inputRef.current) inputRef.current.style.height = "";
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ messages:request }), signal: controller.signal });
      const payload: unknown = await response.json();
      const data = payload && typeof payload === "object" ? payload as Record<string,unknown> : {};
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "No pude responder ahora. Puedes reintentar.");
      if (typeof data.reply !== "string" || !data.reply.trim()) throw new Error("Nix no devolvió una respuesta. Puedes reintentar.");
      if (mounted.current) setHistory(current => recentTurns([...current, { id:id(), role:"model", text:data.reply as string }]));
    } catch (error) {
      if (mounted.current) {
        const message = controller.signal.aborted ? "La respuesta tardó demasiado. Puedes reintentar o continuar por WhatsApp." : error instanceof Error ? error.message : "No pude conectar. Puedes reintentar.";
        setHistory(current => [...current.map(item => item.id === user.id ? { ...item,failed:true } : item), { id:id(),role:"model",text:message,error:true }]);
      }
    } finally {
      window.clearTimeout(timeout);
      if (activeRequest.current === controller) activeRequest.current = null;
      sending.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  function submit(event: FormEvent) { event.preventDefault(); void send(input); }
  const retry = () => { const failed = history.findLast(message => message.role === "user" && message.failed); if (failed) void send(failed.text); };
  return <Dialog.Root open={open} onOpenChange={(value, details) => { if (details.event instanceof KeyboardEvent) setInstant(true); setOpen(value); }} modal={mobile} disablePointerDismissal={!mobile}>
    <Dialog.Trigger ref={triggerRef} className="nix-launcher" aria-label="Abrir chat con Nix" onClick={event => { returnFocus.current = triggerRef.current; setInstant(event.detail === 0); }}><Image src="/nix/nix.webp" alt="" width={56} height={56} sizes="56px"/><span>Habla con Nix<small>Asistente IA</small></span><MessageCircle size={17} aria-hidden="true" /></Dialog.Trigger>
    <Dialog.Portal>{mobile && <Dialog.Backdrop className="nix-backdrop" data-instant={instant || undefined}/>}
      <Dialog.Popup ref={popupRef} className="nix-popup" data-instant={instant || undefined} initialFocus={mobile ? closeRef : inputRef} finalFocus={() => returnFocus.current ?? triggerRef.current}>
        <header className="nix-chat-header"><div className="nix-header-identity"><Image src="/nix/nix.webp" width={52} height={52} alt="" sizes="52px"/><div><Dialog.Title>Nix</Dialog.Title><span><i className="status-dot"/>Asistente IA · Ingenix Hub</span></div></div><div className="nix-header-actions">
          {!mobile && <Dialog.Close className="icon-button" aria-label="Minimizar chat" onClick={event => setInstant(event.detail === 0)}><Minus size={19} aria-hidden="true"/></Dialog.Close>}<Dialog.Close ref={closeRef} className="icon-button" aria-label="Cerrar chat" onClick={event => setInstant(event.detail === 0)}><X size={20} aria-hidden="true"/></Dialog.Close>
        </div></header>
        <Dialog.Description className="chat-description">De tu idea al siguiente paso.</Dialog.Description>
        <div className="nix-messages-scroll" ref={scrollRef} tabIndex={0} role="region" aria-label="Mensajes de la conversación"><NixMessages messages={history} busy={busy} onRetry={retry}/></div>
        {history.length === 0 && <div className="chat-quick-prompts" aria-label="Preguntas para comenzar">{prompts.map(([label,prompt]) => <button type="button" key={label} disabled={busy} onClick={() => void send(prompt)}>{label}<ArrowUpRight size={12} aria-hidden="true"/></button>)}</div>}
        <form className="nix-chat-form" onSubmit={submit}><label className="sr-only" htmlFor="nix-input">Cuéntale tu proyecto a Nix</label><div className="chat-composer"><textarea ref={inputRef} id="nix-input" name="message" value={input} rows={2} maxLength={MAX_INPUT} placeholder="Cuéntame qué quieres crear…" autoComplete="off" enterKeyHint="send" onChange={event => { setInput(event.target.value); event.target.style.height="auto"; event.target.style.height=Math.min(event.target.scrollHeight,112)+"px"; }} onKeyDown={event => { if(event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (!busy) event.currentTarget.form?.requestSubmit(); } }} /><button type="submit" aria-label="Enviar mensaje" disabled={busy || !input.trim()}><ArrowUp size={20} aria-hidden="true"/></button></div><div className="composer-hint"><span>Shift + Enter: nueva línea</span><span>{input.length.toLocaleString("es-MX")} / 1,200</span></div></form>
        <footer className="nix-chat-footer"><a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true"/>Continuar por WhatsApp<ArrowUpRight size={14} aria-hidden="true"/></a><p>Nix es una IA y puede equivocarse. No compartas datos sensibles.</p></footer>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>;
}

