// Fluidez del scroll en el hero: node scripts/hero-fps.mjs [etiqueta] — requiere `npm run start` (4174).
// Recorre el pin con rueda (pasos de 60 px cada 16 ms) y mide la duración de cada cuadro con rAF.
// Variantes de diagnóstico vía HERO_FPS_TWEAK (CSS/JS inyectado): noblur, novideo, nocanvas, nocards.
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4174";
const label = process.argv[2] || "run";
const tweaks = (process.env.HERO_FPS_TWEAK || "").split(",").filter(Boolean);
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--enable-gpu", "--ignore-gpu-blocklist", "--use-angle=d3d11"] });
const results = {};
for (const [name, width, height, cpu] of [["desktop", 1440, 900, 1], ["mobile-4x", 390, 844, 4]]) {
  const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 768, hasTouch: width < 768, deviceScaleFactor: width < 768 ? 2 : Number(process.env.HERO_FPS_DPR || 1) });
  await context.addInitScript(() => {
    try { sessionStorage.setItem("ingenix-tech-intro-v1", "seen"); } catch {}
    // Un clear por render de three.js: cuenta renders del canvas.
    window.__clears = 0; const clear = WebGL2RenderingContext.prototype.clear;
    WebGL2RenderingContext.prototype.clear = function (...args) { window.__clears++; return clear.apply(this, args); };
  });
  const page = await context.newPage();
  await page.goto(origin + "/", { waitUntil: "networkidle" });
  if (tweaks.includes("noblur")) await page.addStyleTag({ content: "*{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}" });
  if (tweaks.includes("nocanvas")) await page.addStyleTag({ content: ".hero3d-canvas{display:none!important}" });
  await page.mouse.move(40, 40);
  await page.locator(".hero3d[data-motion]").waitFor({ timeout: 30000 });
  if (!tweaks.includes("nocanvas")) await page.locator("[data-webgl=ready]").waitFor({ timeout: 60000 }).catch(() => {});
  if (tweaks.includes("novideo")) await page.evaluate(() => { HTMLMediaElement.prototype.play = function () { return Promise.resolve(); }; document.querySelectorAll("video").forEach(v => v.pause()); });
  const renderer = await page.evaluate(() => { const gl = document.createElement("canvas").getContext("webgl2"); const ext = gl?.getExtension("WEBGL_debug_renderer_info"); return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "?"; });
  await page.waitForTimeout(1500);
  const idle = await page.evaluate(async () => { const a = window.__clears; await new Promise(r => setTimeout(r, 3000)); return (window.__clears - a) / 3; });
  const canvas = await page.evaluate(() => { const c = document.querySelector(".hero3d-canvas canvas"); return c ? { px: c.width * c.height, dpr: +(c.width / c.clientWidth).toFixed(2) } : null; });
  const cdp = await context.newCDPSession(page);
  if (cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
  const length = await page.evaluate(() => { const h = document.querySelector(".hero3d"); return h.parentElement.offsetHeight - h.offsetHeight; });
  const clearsBefore = await page.evaluate(() => window.__clears);
  await page.evaluate(() => { window.__frames = []; window.__long = 0; let last = performance.now(); const tick = t => { window.__frames.push(t - last); last = t; window.__raf = requestAnimationFrame(tick); }; window.__raf = requestAnimationFrame(tick);
    new PerformanceObserver(l => l.getEntries().forEach(e => { window.__long += e.duration; })).observe({ type: "longtask", buffered: false }); });
  const steps = Math.ceil(length / 60);
  for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, 60); await page.waitForTimeout(16); }
  await page.waitForTimeout(600);
  const frames = await page.evaluate(() => { cancelAnimationFrame(window.__raf); return { f: window.__frames.slice(2), long: Math.round(window.__long), clears: window.__clears }; });
  const f = frames.f.sort((a, b) => a - b), total = f.reduce((s, v) => s + v, 0);
  results[name] = { renderer, frames: f.length, fps: +(1000 * f.length / total).toFixed(1), p50: +f[Math.floor(f.length * .5)].toFixed(1), p95: +f[Math.floor(f.length * .95)].toFixed(1), jank: +(100 * f.filter(v => v > 25).length / f.length).toFixed(1), longTaskMs: frames.long, idleRendersPerSec: +idle.toFixed(1), scrollRenders: frames.clears - clearsBefore, canvas };
  console.log(label, name, JSON.stringify(results[name]));
  await context.close();
}
await browser.close();
await mkdir("qa-results/fps", { recursive: true });
await writeFile(`qa-results/fps/${label}.json`, JSON.stringify(results, null, 2));
