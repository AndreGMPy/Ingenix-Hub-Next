// Capturas y video del hero 3D: node scripts/hero3d-capture.mjs [origin] [outDir]
// Genera <out>/hero-<ancho>-<tema>-<paso>.png y <out>/hero-scroll-<ancho>.webm
import { chromium } from "@playwright/test";
import { mkdir, rename, rm } from "node:fs/promises";
import { join } from "node:path";

const origin = process.argv[2] || process.env.QA_ORIGIN || "http://127.0.0.1:4173";
const out = process.argv[3] || "qa-results/hero3d";
const only = process.env.HERO_ONLY; // "shots" | "video"
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const steps = [["00-reposo", 0], ["01-ambar", 0.16], ["02-giro", 0.205], ["03-brasa", 0.32], ["04-aura", 0.47], ["05-gama", 0.62], ["06-kroma", 0.79], ["07-cierre", 1]];

async function open(width, height, theme, video) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768, colorScheme: theme, ...(video ? { recordVideo: { dir: out + "/tmp", size: { width, height } } } : {}) });
  // Sin intro de marca: ya vista en la sesión.
  await context.addInitScript(() => { try { sessionStorage.setItem("ingenix-tech-intro-v1", "seen"); } catch {} });
  const page = await context.newPage();
  page.on("pageerror", e => console.log("pageerror", e.message));
  await page.goto(origin + "/", { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(() => document.querySelector(".brand-intro")?.setAttribute("hidden", ""));
  // WebGL, GSAP y videos se inician con la primera interacción.
  await page.mouse.move(30, 30);
  await page.locator(".hero3d[data-motion]").waitFor({ timeout: 30000 }).catch(() => console.log("pin not ready at", width));
  await page.locator("[data-webgl=ready]").waitFor({ timeout: 60000 }).catch(() => console.log("webgl not ready at", width));
  await page.waitForTimeout(800);
  return { context, page };
}
async function range(page) {
  return page.evaluate(() => {
    const spacer = document.querySelector(".hero3d")?.parentElement;
    const header = document.querySelector(".site-header")?.offsetHeight ?? 0;
    const hero = document.querySelector(".hero3d");
    const start = hero.getBoundingClientRect().top + scrollY - header;
    const pinned = spacer ? spacer.offsetHeight - hero.offsetHeight : 0;
    return { start: Math.max(0, start), length: pinned };
  });
}
if (only !== "video") for (const [width, height] of [[1440, 900], [375, 812]]) for (const theme of ["light", "dark"]) {
  const { context, page } = await open(width, height, theme, false);
  const { start, length } = await range(page);
  for (const [name, p] of steps) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), Math.round(p === 0 ? 0 : start + length * p));
    await page.waitForTimeout(1600);
    await page.screenshot({ path: join(out, `hero-${width}-${theme}-${name}.png`) });
  }
  console.log("shots", width, theme, { start, length });
  await context.close();
}
if (only !== "shots") for (const [width, height] of [[1440, 900], [375, 812]]) {
  const { context, page } = await open(width, height, "light", true);
  const { start, length } = await range(page);
  const total = start + length + 200, frames = 300;
  for (let i = 0; i <= frames; i++) { await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), Math.round(total * i / frames)); await page.waitForTimeout(40); }
  await page.waitForTimeout(800);
  const video = page.video(); await context.close();
  const tmp = await video.path(); await rename(tmp, join(out, `hero-scroll-${width}.webm`));
  console.log("video", width);
}
await rm(out + "/tmp", { recursive: true, force: true });
await browser.close();
