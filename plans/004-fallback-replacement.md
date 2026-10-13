# 004 — Sustituir el fallback sin doble contorno
- **Status**: DONE
- **Commit**: caa4351; V2 sin commit
- **Severity**: LOW
- **Category**: Cohesion
- **Estimated scope**: 1 CSS
## Problem
C:\Users\brand\OneDrive\Desktop\Proyectos trabajo\Proyectos paginas wb\Ingenix-hub\next-app-v2\\app\\home.css:14-17 crossfadea SVG y escena durante240ms; captura inmediata muestra ambos contornos distintos.
Current:
```css
.fallback-layer.is-ready { opacity:0; }
.canvas-layer.is-ready { opacity:1; }
```
## Target
.fallback-layer.is-ready { opacity:0; visibility:hidden; }
.canvas-layer { opacity:0; transition:opacity var(--duration-fast) var(--ease-out); }
160ms cubic-bezier(.23,1,.32,1), sin blur ni nuevo loading.
## Repo conventions to follow
Tokens globals.css, siempre fallback en HTML SSR. Sólo se oculta cuando onReady y !failed.
## Steps
1. Añadir visibility:hidden al fallback ready.
2. Reducir fade de canvas a160ms en propia regla.
## Boundaries
No loader fullscreen, no esperar WebGL para copy/CTA, no quitar SVG, no alterar geometrías ni librerías.
## Verification
- Mechanical lint + build al terminar todos los planes.
- Feel check: recargar con slow network, copy visible desde principio. Ready sin doble contorno. ?webgl=off y contextlost restituyen fallback instantáneo.
- Done when: fallback computed visibility hidden en ready y visible en fallo.

