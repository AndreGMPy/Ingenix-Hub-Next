# V2 motion audit
Recon: Next16.4/React19; Motion para preview; CSS para feedback y Dialog; GSAP para scroll; R3F para escena; Base UI para dialog. Tokens en globals.css y lib/motion.ts, 120/160/240/600ms; ease-out(.23,1,.32,1). Sitio comercial sobrio. Tabs y teclado frecuentes; chat ocasional; Hero primera visita.

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Purpose & frequency | NixChat.tsx:112,117; chat.css:8-10 | Close activado por Enter genera click detail=0; backdrop no respeta instant | Detectar detail en Close y desactivar transición de backdrop |
| 2 | MEDIUM | Interruptibility | Capabilities.tsx:35 | Remount reinicia opacity en selecciones rápidas | Cambios dentro de 240ms se resuelven instantáneamente |
| 3 | LOW | Physicality/accessibility | globals.css:50,119; chat.css:1,39 | Sin estado de presión cuando reduced; launcher/send sin feedback | Feedback de color estático para todos; scale sólo pointer no reduced |
| 4 | LOW | Cohesion | home.css:14-17 | Captura inicial mezcla fallback SVG y escena, contornos diferentes | Retirar SVG al ready; fade sólo canvas de 160ms |

La revisión paralela de performance confirma refs por frame, DPR acotado, pausa demand y sin transition:all. No se ha inventado un requisito de postprocessing ni un objetivo FPS sin medir hardware.

Oportunidades valoradas: (1) Rotar el icono de alcance con transición; se mantiene cambio instantáneo por frecuencia y teclado. (2) Dar una celebración al primer mensaje exitoso; se descarta, el contenido y feedback de estado ya comunican el resultado. (3) Pointer magnetic global; se descarta por repetición y touch. No añadir movimiento para llenar una lista.

| 5 | MEDIUM | Performance | EcosystemScene.tsx y HeroEcosystem.tsx | Loop continuo competía con UI en CPU4x/SwiftShader | Renderer demand, pointer damping, carga tras paint/idle; laboratorio216ms tras2224ms |
