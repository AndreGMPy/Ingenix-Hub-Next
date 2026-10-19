export const motionTokens = {
  press: 0.12,
  fast: 0.16,
  normal: 0.24,
  slow: 0.6,
  stagger: 0.05,
  easeOut: [0.23, 1, 0.32, 1] as const,
  easeInOut: [0.77, 0, 0.175, 1] as const,
  drawer: [0.32, 0.72, 0, 1] as const,
  spring: { type: "spring" as const, duration: 0.4, bounce: 0 },
};
export function clamp01(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}
export function validRange(start: number, end: number): boolean {
  return Number.isFinite(start) && Number.isFinite(end) && end > start;
}
export function validateOffsets(offsets: readonly number[]): boolean {
  return offsets.every((value, index) => Number.isFinite(value) && value >= 0 &&
    value <= 1 && (index === 0 || value > offsets[index - 1]));
}


/* Hero showcase: una sola fuente de verdad para el timeline GSAP, la escena 3D y el mockup 2D. */
export const SHOWCASE_INTRO = 0.1;
export const SHOWCASE_OUTRO = 0.16;
/** Fracción de cada paso de proyecto que el celular permanece quieto antes de girar al siguiente. */
export const SHOWCASE_HOLD = 0.5;
export function smoothstep(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}
/** Inicio (0–1) de cada paso de proyecto dentro del pin, más el inicio del cierre al final. */
export function showcaseSteps(count: number): number[] {
  const n = Math.max(1, Math.floor(count));
  const span = (1 - SHOWCASE_INTRO - SHOWCASE_OUTRO) / n;
  return Array.from({ length: n + 1 }, (_, index) => SHOWCASE_INTRO + span * index);
}
export type ShowcaseFrame = {
  /** 0–1 durante la salida del titular. */ intro: number;
  /** Giro acumulado en vueltas: 2.5 = media vuelta entre el proyecto 3 y el 4. */ spin: number;
  /** Proyecto visible en pantalla (cambia cuando el celular está de espaldas). */ screen: number;
  /** 0–1 durante el cierre con CTA. */ outro: number;
};
export function showcaseFrame(progress: number, count: number): ShowcaseFrame {
  const n = Math.max(1, Math.floor(count));
  const p = clamp01(progress);
  const steps = showcaseSteps(n);
  const span = steps[1] - steps[0];
  const intro = clamp01(p / SHOWCASE_INTRO);
  const outro = clamp01((p - steps[n]) / SHOWCASE_OUTRO);
  const q = Math.max(0, Math.min(n, (p - SHOWCASE_INTRO) / span));
  const index = Math.min(n - 1, Math.floor(q));
  const turn = index < n - 1 ? smoothstep((q - index - SHOWCASE_HOLD) / (1 - SHOWCASE_HOLD)) : 0;
  const spin = index + turn;
  return { intro, spin, screen: Math.min(n - 1, turn >= 0.5 ? index + 1 : index), outro };
}
/** Posición del celular en fracciones del viewport (x,y desde el centro; y positivo hacia abajo) y escala relativa. */
export type ShowcasePose = { x: number; y: number; scale: number };
export function showcaseLayout(mobile: boolean): { rest: ShowcasePose; projects: ShowcasePose; outro: ShowcasePose } {
  return mobile
    ? { rest: { x: 0, y: 0.4, scale: 0.56 }, projects: { x: 0, y: 0.1, scale: 0.92 }, outro: { x: 0, y: -0.2, scale: 0.5 } }
    : { rest: { x: 0.24, y: 0.04, scale: 1 }, projects: { x: 0.2, y: 0.02, scale: 1 }, outro: { x: 0, y: -0.1, scale: 0.72 } };
}
