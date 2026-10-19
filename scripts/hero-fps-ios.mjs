// Fluidez del hero en WebKit (motor de Safari) emulando iPhone 15 Pro Max: node scripts/hero-fps-ios.mjs [etiqueta] [query]
// Requiere `npm run start` (4174). Desplaza el pin en pasos de 24 px por cuadro (≈ scroll con el dedo) y mide cada cuadro con rAF.
// Es una aproximación: WebKit de Playwright en Windows no usa la GPU del iPhone; sirve para comparar versiones, no para cifras absolutas.
import { webkit, devices } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4174";
const [label = "run", query = ""] = process.argv.slice(2);
const browser = await webkit.launch();
const context = await browser.newContext({ ...devices["iPhone 15 Pro Max"] });
await context.addInitScript(() => { try { sessionStorage.setItem("ingenix-tech-intro-v1", "seen"); } catch {} });
const page = await context.newPage();
await page.goto(origin + "/" + query, { waitUntil: "networkidle" });
// Diagnóstico: HERO_CSS inyecta reglas para aislar costos (p. ej. ".hero3d-glows{display:none}").
if (process.env.HERO_CSS) await page.addStyleTag({ content: process.env.HERO_CSS });
await page.touchscreen.tap(200, 300);
await page.locator(".hero3d[data-motion]").waitFor({ timeout: 30000 });
await page.waitForTimeout(3000);
const mode = await page.evaluate(() => ({ webgl: document.querySelector("[data-webgl]")?.getAttribute("data-webgl"), canvas: !!document.querySelector(".hero3d-canvas canvas"), dpr: devicePixelRatio }));
const result = await page.evaluate(async () => {
  const hero = document.querySelector(".hero3d"), length = hero.parentElement.offsetHeight - hero.offsetHeight;
  const frames = []; let last = performance.now(), y = 0;
  await new Promise(done => {
    const step = t => { frames.push(t - last); last = t; y += 24; window.scrollTo(0, y); if (y < length) requestAnimationFrame(step); else done(); };
    requestAnimationFrame(step);
  });
  const videos = [...document.querySelectorAll("video")].map(v => ({ paused: v.paused, t: +v.currentTime.toFixed(1) }));
  return { frames: frames.slice(2), videos };
});
const f = result.frames.sort((a, b) => a - b), total = f.reduce((s, v) => s + v, 0);
const summary = { ...mode, frames: f.length, fps: +(1000 * f.length / total).toFixed(1), p50: +f[Math.floor(f.length * .5)].toFixed(1), p95: +f[Math.floor(f.length * .95)].toFixed(1), jank: +(100 * f.filter(v => v > 25).length / f.length).toFixed(1), worst: +f[f.length - 1].toFixed(0), videos: result.videos };
console.log(label, JSON.stringify(summary));
await browser.close();
await mkdir("qa-results/fps", { recursive: true });
await writeFile(`qa-results/fps/ios-${label}.json`, JSON.stringify(summary, null, 2));
