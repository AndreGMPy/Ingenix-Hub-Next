import { ApiError, FinishReason, GoogleGenAI, ThinkingLevel } from "@google/genai";
import { MAX_REQUEST_BYTES, normalizeMessages } from "@/lib/chat";
import { limited, NIX_SYSTEM_PROMPT } from "@/lib/nix-server";
export const runtime = "nodejs";
export const maxDuration = 60;
const MAX_BODY_BYTES = MAX_REQUEST_BYTES;
function json(status: number, body: object) { return Response.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
async function readBody(request: Request): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done,value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const combined = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { combined.set(chunk,offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(combined);
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = (process.env.ALLOWED_ORIGIN || "").split(",").map(value => value.trim()).filter(Boolean);
  if (origin && origin !== new URL(request.url).origin && !allowed.includes(origin)) return json(403, { error: "No pudimos autorizar esta solicitud." });
  if (!request.headers.get("content-type")?.includes("application/json")) return json(415, { error: "La solicitud debe enviarse como JSON." });
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) return json(413, { error: "La conversación es demasiado grande." });
  let body: unknown;
  try {
    const raw = await readBody(request);
    if (raw === null) return json(413, { error: "La conversación es demasiado grande." });
    body = JSON.parse(raw);
  } catch { return json(400, { error: "No pudimos leer el mensaje. Inténtalo otra vez." }); }
  const messages = normalizeMessages(body && typeof body === "object" ? (body as Record<string,unknown>).messages : null);
  if (!messages) return json(400, { error: "La conversación no es válida. Envía un mensaje de hasta 1,200 caracteres." });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return json(503, { error: "Nix no está disponible ahora. Puedes continuar por WhatsApp." });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  if (limited(ip)) return json(429, { error: "Has enviado varios mensajes. Espera unos minutos o continúa por WhatsApp." });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
      contents: messages.map(({ role,text }) => ({ role, parts: [{ text }] })),
      config: { systemInstruction: NIX_SYSTEM_PROMPT, temperature: .4, maxOutputTokens: 900, thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }, abortSignal: controller.signal },
    });
    const candidate = response.candidates?.[0];
    const answer = (candidate?.content?.parts ?? []).filter(part => typeof part.text === "string" && !part.thought && !part.functionCall && !part.toolCall).map(part => part.text).join("").trim();
    if (candidate?.finishReason === FinishReason.MAX_TOKENS) return json(502, { error: "Nix no alcanzó a completar la respuesta. Intenta una pregunta más concreta." });
    if (!answer) return json(502, { error: "Nix no pudo completar la respuesta. Puedes reintentar." });
    return json(200, { reply: answer });
  } catch (error) {
    if (controller.signal.aborted) return json(504, { error: "Nix tardó demasiado. Puedes reintentar o continuar por WhatsApp." });
    if (error instanceof ApiError && error.status === 429) return json(429, { error: "La IA está recibiendo muchas consultas. Inténtalo en un momento." });
    return json(502, { error: "No pude conectar con la IA ahora. Puedes reintentar o continuar por WhatsApp." });
  } finally { clearTimeout(timeout); }
}

