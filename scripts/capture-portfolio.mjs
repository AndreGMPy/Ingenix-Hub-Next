// Medios del portafolio y del hero, sin dependencias nuevas (codifica WebP en el navegador):
//  - Capturas de escritorio de cada demo de data/projects.ts → public/projects/<slug>.webp (1872×915)
//  - Poster de cada video del hero (data/showcase.ts) → public/projects/videos/<slug>.webp
// Uso: node scripts/capture-portfolio.mjs [shots|posters] [slug...]
import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { projects } from "../data/projects.ts";
import { showcase } from "../data/showcase.ts";

const [mode = "all", ...only] = process.argv.slice(2);
const pick = slug => !only.length || only.includes(slug);
const browser = await chromium.launch({ channel: "chrome" });
const encoder = await browser.newPage();
async function toWebp(dataUrl, width, height, quality = 0.82, at = 0) {
  return Buffer.from(await encoder.evaluate(async ({ dataUrl, width, height, quality, at }) => {
    let source;
    if (dataUrl.startsWith("data:video")) {
      source = document.createElement("video"); source.muted = true; source.src = dataUrl;
      await new Promise(ok => { source.onloadeddata = ok; });
      source.currentTime = at; await new Promise(ok => { source.onseeked = ok; });
    } else { source = new Image(); source.src = dataUrl; await source.decode(); }
    const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d"); ctx.imageSmoothingQuality = "high";
    const sw = source.videoWidth || source.width, sh = source.videoHeight || source.height;
    // Recorta desde arriba para conservar la proporción de destino.
    const scale = Math.max(width / sw, height / sh);
    ctx.drawImage(source, (width - sw * scale) / 2, 0, sw * scale, sh * scale);
    return canvas.toDataURL("image/webp", quality).split(",")[1];
  }, { dataUrl, width, height, quality, at }), "base64");
}
if (mode !== "posters") {
  const context = await browser.newContext({ viewport: { width: 1440, height: 704 }, deviceScaleFactor: 1.3, colorScheme: "light", locale: "es-MX" });
  for (const project of projects.filter(p => pick(p.slug))) {
    const page = await context.newPage();
    await page.goto(project.href, { waitUntil: "networkidle", timeout: 60000 }).catch(() => console.log("timeout " + project.slug));
    await page.waitForTimeout(1500);
    // Sitios con intro (p. ej. Gama Studio): saltarla para capturar el inicio real.
    await page.getByRole("button", { name: /saltar/i }).first().click({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(3500);
    const png = await page.screenshot({ type: "png" });
    await writeFile(`public${project.image}`, await toWebp("data:image/png;base64," + png.toString("base64"), project.width, project.height));
    console.log("shot " + project.slug);
    await page.close();
  }
}
if (mode !== "shots") {
  for (const item of showcase.filter(i => pick(i.slug))) {
    const video = await readFile("public" + item.video);
    await writeFile("public" + item.screen, await toWebp("data:video/mp4;base64," + video.toString("base64"), 472, 1024, 0.8, 0.4));
    console.log("poster " + item.slug);
  }
}
await browser.close();
