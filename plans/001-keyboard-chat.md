# 001 — Resolver inmediatamente el chat por teclado
- **Status**: DONE
- **Commit**: caa4351; V2 sin commit
- **Severity**: HIGH
- **Category**: Purpose & frequency
- **Estimated scope**: 2 archivos
## Problem
C:\Users\brand\OneDrive\Desktop\Proyectos trabajo\Proyectos paginas wb\Ingenix-hub\next-app-v2\\components\\nix\\NixChat.tsx:112 comprueba details.event instanceof KeyboardEvent. Los Dialog.Close en línea117 no reconocen el click sintetizado por Enter/Space. C:\Users\brand\OneDrive\Desktop\Proyectos trabajo\Proyectos paginas wb\Ingenix-hub\next-app-v2\\app\\chat.css:8 sólo define:
```css
.nix-popup[data-instant] { transition:none; }
```
## Target
Ambos Dialog.Close usan onClick={event => setInstant(event.detail === 0)}. Añadir exactamente:
```css
.nix-backdrop[data-instant] { transition:none; }
```
Popup pointer conserva 240ms cubic-bezier(.23,1,.32,1); salida160ms. Teclado no anima.
## Repo conventions to follow
Dialog.Trigger ya usa detail===0 en NixChat.tsx:113. data-instant del backdrop ya está en línea114; conservar Base UI.
## Steps
1. Añadir onClick al Close de minimizar y cerrar.
2. Añadir selector del backdrop junto al popup[data-instant].
## Boundaries
Sólo V2; no dependencias nuevas, API, estructura de diálogo, refocus ni lógica Gemini. Si cambia el fragmento, revisar drift antes de tocarlo.
## Verification
- Mechanical: npm run lint y npm run typecheck sin errores.
- Feel check: abrir pointer, enfocar Close, Enter/Space; popup y backdrop sin animaciones activas. Escape también inmediato. Apertura pointer conserva origen bottom right. Revisar en panel Animations al10% como inspección humana adicional.
- Done when: suite runtime observa data-instant y transitionDuration=0s en apertura/cierre teclado móvil y desktop.

