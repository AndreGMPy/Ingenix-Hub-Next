# 002 — Evitar reinicios de entrada en selección rápida
- **Status**: DONE
- **Commit**: caa4351; V2 sin commit
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 1 archivo
## Problem
C:\Users\brand\OneDrive\Desktop\Proyectos trabajo\Proyectos paginas wb\Ingenix-hub\next-app-v2\\components\\home\\Capabilities.tsx:35 usa key={selected.id} con initial opacity0/translate6 y duración motionTokens.normal=.24; selecciones pointer consecutivas pueden reiniciar la entrada antes de acabar.
Current:
```tsx
const choose = (id: CapabilityId, immediate: boolean) => { setInstant(immediate); setActive(id); };
```
## Target
Ref lastSelection=0. En choose calcular now=performance.now(), immediate || now-lastSelection.current < motionTokens.normal*1000; guardar now. Conservar entrada240ms easeOut [.23,1,.32,1] únicamente para cambios aislados. Teclado siempre instantáneo.
## Repo conventions to follow
motionTokens.normal en lib/motion.ts; useRef ya importado; mismo data-instant y Motion full transform.
## Steps
1. Declarar ref lastSelection junto a buttons.
2. Actualizar choose con lógica exacta de Target.
## Boundaries
No AnimatePresence solapado, ni nuevos motores, ni cambiar datos/diseño. Sólo V2. No mover preview a GSAP.
## Verification
- Mechanical: lint + typecheck.
- Feel check: click0, click5 tras60ms y click0 tras60ms; última selección visible sin fade repetido. Flechas/Home/End instantáneos. Reduced conservado.
- Done when: tab correcto y preview último tiene data-instant tras segundo click en menos de240ms.

Implementación final: se usa event.timeStamp (finito y monótono verificado) en lugar de performance.now dentro del helper, evitando el hallazgo de purity del compilador React. Resultado equivalente, sin suprimir reglas de lint.
