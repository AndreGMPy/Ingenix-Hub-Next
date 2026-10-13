# 006 — Mantener intención durante scroll suave
Status: DONE
Commit: caa4351
Severity: MEDIUM
Category: Interruptibility
Scope: components/portfolio/PortfolioCarousel.tsx únicamente.
Problema confirmado: select() cambiaba active antes del scroll, observer podía volver al anterior.
Target: pending useRef<number|null>; observer ignora índices distintos hasta llegar al target; pointerdown/wheel lo anulan. No nueva librería, state sólo al cambiar proyecto.
Verificación: taps positivos separados50ms llevan01→03; siguiente/anterior/Home/End y swipe mantienen contador y límites. Teclado instantáneo, prefers-reduced-motion instantáneo. Implementado bajo animate, no por el advisor read-only.

