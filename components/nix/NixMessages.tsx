import { RotateCcw } from "lucide-react";
import type { ChatMessage } from "@/lib/chat";
export const welcome = "Hola, soy Nix, la IA de Ingenix Hub. Cuéntame qué quieres crear y te ayudaré a encontrar el punto de partida.";
export function NixMessages({ messages, busy = false, onRetry }: { messages: readonly ChatMessage[]; busy?: boolean; onRetry?: () => void }) {
  return <div className="nix-messages-content" role="log" aria-label="Conversación con Nix" aria-live="polite" aria-relevant="additions text" aria-busy={busy}>
    {!messages.length && <div className="chat-message model"><span className="message-author">Nix</span><p>{welcome}</p></div>}
    {messages.map(message => <div key={message.id} className={"chat-message " + message.role + (message.error ? " message-error" : "")}>
      <span className="message-author">{message.role === "user" ? "Tú" : "Nix"}</span><p>{message.text}</p>
      {message.error && onRetry && <button type="button" className="chat-retry" onClick={onRetry}><RotateCcw size={14} aria-hidden="true" />Reintentar</button>}
    </div>)}
    {busy && <div className="chat-message model chat-typing" role="status"><span className="message-author">Nix</span><span className="typing-indicator" aria-hidden="true"><i/><i/><i/></span><span>Estoy pensando en tu proyecto…</span></div>}
  </div>;
}

