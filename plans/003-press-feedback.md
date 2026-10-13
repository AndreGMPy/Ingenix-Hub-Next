# 003 — Conservar feedback de presión con movimiento reducido
- **Status**: DONE
- **Commit**: caa4351; V2 sin commit
- **Severity**: LOW
- **Category**: Physicality / accessibility
- **Estimated scope**: 2 CSS
## Problem
C:\Users\brand\OneDrive\Desktop\Proyectos trabajo\Proyectos paginas wb\Ingenix-hub\next-app-v2\\app\\globals.css:119 define transform:none con reduced pero no un color :active. C:\Users\brand\OneDrive\Desktop\Proyectos trabajo\Proyectos paginas wb\Ingenix-hub\next-app-v2\\app\\chat.css:1,39 launcher/send no tienen feedback.
## Target
.button:active usa background:color-mix(in srgb,var(--accent) 88%,var(--text)); .button-secondary:active y .icon-button:active usan background:var(--surface-2).
Launcher:active usa background:var(--surface-2), send:not(:disabled):active background:color-mix(in srgb,var(--accent) 88%,var(--text)).
Con no-preference y hover:hover pointer:fine aplicar launcher/send pointer :active:not(:focus-visible) transform scale(.97) y transition transform120ms var(--ease-out); teclado/reduced quedan sólo color. Curva token exacta .23/1/.32/1.
## Repo conventions to follow
globals.css:47-52 --duration-press=120ms, --ease-out. No filter ni transform de ancestros.
## Steps
1. Añadir estados de background sin modificar las superficies por defecto.
2. Añadir regla @media para escala de launcher/send.
## Boundaries
No agregar movimiento a touch reduced, no reglas transition:all, no cambiar propiedades GSAP.
## Verification
- Mechanical lint; axe ambas paletas.
- Feel check: pulsar touch con reduced, observar color inmediato. Con pointer normal presión pequeña y reversible. Revisar lento sin keyframes que reinicien.
- Done when: color :active distinto y transform=none bajo reduced.

