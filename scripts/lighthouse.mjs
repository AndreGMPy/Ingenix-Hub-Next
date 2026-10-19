// Lighthouse móvil sobre el build de producción: node scripts/lighthouse.mjs <etiqueta> [ruta...]
// Requiere `npm run start` (4174). Usa `npx lighthouse` como herramienta temporal, no como dependencia.
import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4174";
const [label = "run", ...paths] = process.argv.slice(2);
const routes = paths.length ? paths : ["/", "/paginas-web", "/moroleon", "/portafolio"];
const out = "qa-results/lighthouse";
await mkdir(out, { recursive: true });
const chrome = chromium.executablePath();
// Resuelve la CLI instalada por `npx -y lighthouse@13.5.0` (caché de npx) para llamarla sin shell.
async function lighthouseCli() {
  const cache = join(process.env.npm_config_cache || join(homedir(), "AppData/Local/npm-cache"), "_npx");
  for (const dir of existsSync(cache) ? await readdir(cache) : []) {
    const cli = join(cache, dir, "node_modules/lighthouse/cli/index.js");
    if (existsSync(cli) && JSON.parse(await readFile(join(cache, dir, "node_modules/lighthouse/package.json"), "utf8")).version === "13.5.0") return cli;
  }
  throw new Error("Ejecuta antes: npx -y lighthouse@13.5.0 --version");
}
const cli = await lighthouseCli();
const runs = Number(process.env.LH_RUNS || 3);
const summary = {};
for (const route of routes) {
  const scores = [];
  for (let i = 0; i < runs; i++) {
    const file = `${out}/${label}${route.replace(/\W+/g, "-") || "-home"}-${i}.json`;
    execFileSync(process.execPath, [cli, origin + route, "--quiet", "--output=json", `--output-path=${file}`,
      "--form-factor=mobile", "--only-categories=performance,accessibility,best-practices,seo",
      `--chrome-path=${chrome}`, "--chrome-flags=--headless=new --no-sandbox"], { stdio: "inherit" });
    const lhr = JSON.parse(await readFile(file, "utf8"));
    const c = lhr.categories, a = lhr.audits;
    scores.push({ performance: c.performance.score * 100, accessibility: c.accessibility.score * 100, bestPractices: c["best-practices"].score * 100, seo: c.seo.score * 100,
      lcp: Math.round(a["largest-contentful-paint"].numericValue), tbt: Math.round(a["total-blocking-time"].numericValue), cls: +a["cumulative-layout-shift"].numericValue.toFixed(3) });
  }
  // Mediana por rendimiento para reducir ruido de laboratorio.
  scores.sort((x, y) => x.performance - y.performance);
  summary[route] = { ...scores[Math.floor(scores.length / 2)], runs: scores.map(s => s.performance) };
  console.log(route, JSON.stringify(summary[route]));
}
await writeFile(`${out}/${label}-summary.json`, JSON.stringify(summary, null, 2));
