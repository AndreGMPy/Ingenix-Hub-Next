# 005 — Renderizar 3D cuando cambie
- **Status**: DONE
- **Commit**: caa4351; V2 sin commit
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: EcosystemScene.tsx
## Problem
EcosystemScene.tsx:50 usa frameloop={props.moving ? "always" : "demand"}. Mientras Hero visible, dibuja continuamente por una oscilación decorativa de2.5cm. En el laboratorio Chrome/SwiftShader con CPU4x, el cambio de tema registró2224ms. Es una medición de interacción de laboratorio, no INP de usuarios reales; aun así hay trabajo eliminable.
## Target
Canvas frameloop="demand" en todas las plataformas. Pointermove/leave nativos actualizan vector y piden invalidate(), sin React state. useFrame amortigua rotación (damp4, delta<=.05) y vuelve a invalidate sólo mientras error total>.0002. Eliminar drift sinusoidal; profundidad y conexiones permanecen. Readiness se anuncia en el rAF posterior al primer draw, manteniendo fallback hasta entonces.
## Repo conventions
gl y invalidate de useThree, useRef existente. DPR1 mobile/[1,1.5] desktop. Pointer offsets normalizados por size.width/height finitos. No otras librerías ni postprocessing.
## Steps
1. Escuchar pointermove/leave sólo si moving, con cleanup. Conservar contextlost y pausar en hidden/offscreen/reduced.
2. Eliminar sin/core position continuo; amortiguar rotación y terminar loop cuando alcanza el cursor.
3. Canvas demand; rAF de readiness con cancelAnimationFrame y reset del ref en cleanup.
## Boundaries
Sólo escenaV2. No cambiar copy, posiciones, colores, assets, GSAP ni Motion. No state por frame, no getBoundingClientRect por frame.
## Verification
Lint/typecheck/tests/build. Scene ready/fallback y pointer desktop funcionan; mobile/reduced estáticos. Repetir performance-qa.mjs, registrar métricas disponibles y hardware usado. No informar LCP0 como éxito: significa sin muestra válida. Human hardware FPS pendiente.

Implementación adicional exacta en components/three/HeroEcosystem.tsx: programar dos requestAnimationFrame antes del probe; requestIdleCallback(probeWebGL,{timeout:1500}), fallback setTimeout(probeWebGL,180). Cleanup cancela ambos frames, timeout e idle callback. No se espera WebGL para renderizar HTML. Scope final: dos componentes de three. Runtime final PASS; métricas2292/912msLCP y216/168msinteracción de laboratorio.
