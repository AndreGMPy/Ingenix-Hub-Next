---
name: ingenix-motion
description: Reglas de animación de Ingenix Hub (GSAP ScrollTrigger con pin/scrub, R3F, Motion y CSS). Úsala antes de crear o cambiar cualquier animación, scroll, escena 3D o transición del sitio.
---

# Ingenix Motion

Reglas obligatorias para cualquier movimiento en `next-app`. Complementa `V2_DESIGN_SYSTEM.md` (tokens) y los reportes `V21_*.md` (decisiones previas). Si una regla choca con una petición explícita del usuario, gana la petición y se documenta la desviación en el reporte.

## 1. Un dueño por elemento
| Motor | Dueño de | Nunca |
| --- | --- | --- |
| CSS (`--duration-*`, `--ease-*`) | hover, press, focus, intro de marca | animar lo que ya mueve GSAP |
| Motion (`motion`) | micro UI interruptible (tabs, chat, previews) | scroll |
| GSAP + ScrollTrigger | todo lo ligado al scroll | elementos que no son narrativos |
| R3F (`useFrame`) | objetos WebGL | escribir DOM o `setState` por frame |

Dos motores no comparten la misma propiedad del mismo nodo.

## 2. Scroll: siempre en `ScrollDirector`
- Todos los `ScrollTrigger` se crean en `components/home/ScrollDirector.tsx`, dentro de `gsap.matchMedia()`, para que `media.revert()` limpie todo. No crear ScrollTriggers en otros componentes.
- Pin + scrub: `pin:true`, `scrub` entre `.3` y `.6`, `invalidateOnRefresh:true`, `anticipatePin:1` y `onRefresh` que desactiva el trigger cuando `validRange(start,end)` es falso.
- La matemática de progreso vive en `lib/motion.ts` como funciones puras con prueba en `tests/motion.test.ts` (p. ej. `showcaseFrame`). Ni la escena 3D ni el DOM reimplementan esa lógica.
- Para pasar el progreso a WebGL se usa `lib/scroll-progress.ts` (objeto mutable + suscriptores que llaman `invalidate`). Sin estado de React por frame.
- Las secciones pinned marcan su modo con `data-motion="scroll"`; el CSS por defecto (sin ese atributo) es la versión estática completa. Así no-JS, reduced-motion y fallos de GSAP comparten el mismo layout.
- Longitud de pin: la mínima que permita leer cada paso (≈60–70vh por paso). Teléfono horizontal / desktop bajo (`max-height:500px`) no se pinnea.

## 3. Sólo transform y opacity
- Animar `x`, `y`, `xPercent`, `scale`, `rotate*` y `opacity`. Nada de `top/left/width/height/margin`, `filter`, `box-shadow` ni `background` animados.
- Cambios de color de fondo = capas superpuestas con crossfade de opacidad.
- Contadores (01 / 05) = números apilados con opacidad, no texto reescrito por frame.
- `will-change` sólo en los nodos que se mueven dentro del pin, nunca global.

## 4. 60 fps en celular
- Canvas con DPR tope 1.5, sin `antialias` cuando la pantalla ya es densa (DPR ≥ 1.5) y resolución adaptativa con `setDpr` medida sólo durante render continuo.
- `frameloop="demand"`: 60 fps mientras hay scroll, arrastre o inclinación que converge; ~30 fps en reposo (flotación, video). Nunca un loop continuo inactivo.
- Nada con `backdrop-filter` encima de un canvas animado (se recalcula cada cuadro): quitarlo mientras la sección está fijada.
- Video como textura: un solo `<video>` por proyecto (DOM, `preload="none"`), sólo corre el activo; la capa 2D oculta usa `visibility:hidden`.
- Render pausado (`frameloop="never"`) cuando la sección no se ve o la pestaña está oculta (IntersectionObserver + `visibilitychange`).
- Texturas WebP ≤1024 px, `anisotropy` ≤4, geometrías y texturas liberadas en el cleanup.
- Sin postprocesado ni `transmission`: vidrio y desenfoque se simulan con texturas de canvas pre-desenfocadas y opacidad.
- Dispositivo débil (`deviceMemory<=2`, `hardwareConcurrency<=2`, `saveData`) o sin WebGL2 → versión 2D con la misma animación de scroll.
- Canvas cargado con `next/dynamic` + `ssr:false` dentro de un Client Component, con poster estático mientras carga.

## 5. Reduced motion y primer cuadro
- `prefers-reduced-motion: reduce` → sin pin, sin scrub, sin flotación ni vaivén; se muestra la versión estática con todo el contenido y controles.
- El primer cuadro (SSR, sin JS) ya es completo: titular, CTA, mockup con la primera captura y la lista de proyectos legible.
- El hero no lleva botón de pausa por decisión del cliente (2026-10-19); reduced motion sigue desactivando flotación, giro y video. Ojo: WCAG 2.2.2 pide pausa para movimiento automático de más de 5 s.
- Pantallas táctiles: celular CSS + `<video>` nativo, sin WebGL (`?webgl=on` para forzarlo). Capas grandes (brillos) a mitad de tamaño con `scale(2)`.

## 6. Tokens
fast 160ms · press 120ms · normal 240ms · slow 600ms · stagger 50ms · ease-out `cubic-bezier(.23,1,.32,1)` · ease-in-out `cubic-bezier(.77,0,.175,1)`. En GSAP: `"power3.out"` ≈ ease-out, `"none"` dentro de timelines con scrub. Damping R3F: `MathUtils.damp(..., 4–6, dt)` con `dt` acotado a `.06`.

## Checklist antes de entregar
1. ¿El trigger nuevo está en `ScrollDirector` y se limpia con `matchMedia`?
2. ¿Sólo transform/opacity? (buscar `gsap.to(... width|height|top|left|filter`).
3. ¿Reduced motion y `?webgl=off` muestran todo?
4. ¿El render se pausa fuera de pantalla?
5. `npm run lint && npm run typecheck && npm test && npm run qa`.
