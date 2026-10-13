export const MAX_INPUT = 1200;
export const MAX_REPLY = 8000;
export const MAX_TURNS = 6;
export const MAX_REQUEST_BYTES = 32_000;
export type ChatTurn = { role: "user" | "model"; text: string };
export type ChatMessage = ChatTurn & { id: string; error?: boolean; failed?: boolean };
export function normalizeMessages(value: unknown): ChatTurn[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 11) return null;
  const messages: ChatTurn[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const record = item as Record<string, unknown>;
    if (record.role !== "user" && record.role !== "model") return null;
    if (typeof record.text !== "string") return null;
    const text = record.text.trim();
    if (!text || text.length > (record.role === "user" ? MAX_INPUT : MAX_REPLY)) return null;
    if (messages.length === 0 && record.role !== "user") return null;
    if (messages.at(-1)?.role === record.role) return null;
    messages.push({ role: record.role, text });
  }
  return messages.at(-1)?.role === "user" ? messages : null;
}
export function recentTurns(messages: readonly ChatMessage[], limit = MAX_TURNS): ChatMessage[] {
  const turns: ChatMessage[][] = [];
  for (const message of messages) {
    if (message.error || message.failed) continue;
    if (message.role === "user") { turns.push([message]); continue; }
    const turn = turns.at(-1);
    if (turn?.length === 1) turn.push(message);
  }
  return turns.slice(-Math.max(1, limit)).flat();
}
export function requestTurns(messages: readonly ChatMessage[], user: ChatMessage): ChatTurn[] {
  // Sólo pares completos: un error anterior nunca crea dos turnos user consecutivos.
  const complete = recentTurns(messages, MAX_TURNS).filter((message,index,array) =>
    message.role === "model" || array[index+1]?.role === "model");
  const request = [...complete.slice(-10),user].map(({ role,text }) => ({ role,text }));
  const encoder = new TextEncoder();
  while (request.length > 1 && encoder.encode(JSON.stringify({ messages: request })).byteLength > MAX_REQUEST_BYTES) request.splice(0,2);
  return request;
}
export function parseStoredHistory(raw: string | null): ChatMessage[] {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter((item): item is ChatMessage => !!item && typeof item === "object" &&
      (item.role === "user" || item.role === "model") && typeof item.text === "string" &&
      item.text.trim().length > 0 && item.text.length <= (item.role === "user" ? MAX_INPUT : MAX_REPLY));
    return recentTurns(valid.map((message,index) => ({ id: "stored-" + index, role: message.role, text: message.text, failed: message.failed === true, error: message.error === true })));
  } catch { return []; }
}
export function whatsappSummary(messages: readonly ChatMessage[]): string {
  const text = messages.filter(message => message.role === "user" && !message.failed).slice(-3)
    .map(message => message.text.replace(/\s+/g," ").trim()).join("\n• ");
  return text ? "Hola, hablé con Nix y quiero cotizar este proyecto:\n• " + text.slice(0,1200) : "Hola, quiero cotizar un proyecto con Ingenix Hub.";
}

