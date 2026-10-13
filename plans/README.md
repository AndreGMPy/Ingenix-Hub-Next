# Motion improvement plans
Commit de referencia: caa4351 (V2 creada sin commit).

Auditoría read-only de improve-animations. Dos auditorías paralelas, findings releídos y vetados. Implementación posterior autorizada por el usuario, exclusivamente dentro de V2. Sin worktree externo.

| Plan | Severidad | Estado |
| --- | --- | --- |
| 001-keyboard-chat.md | HIGH | DONE |
| 002-rapid-service-selection.md | MEDIUM | DONE |
| 003-press-feedback.md | LOW | DONE |
| 004-fallback-replacement.md | LOW | DONE |
| 005-render-on-demand.md | MEDIUM | DONE |

Orden recomendado:005,001,002,003,004. Planes independientes;005 se agregó después de medir laboratorio. Todos implementados y reconciliados con la suite final:22 checks dev y21 prod sin fallos, lint/build y siete tests.
El plan002 deriva tiempos de event.timeStamp para respetar pureza de React. El005 incluye inicialización tras paint/idle y readiness después del draw. Hardware físico permanece pendiente; no se atribuye como probado.


## V2.1
| Plan | Severidad | Estado |
| --- | --- | --- |
| 006-v21-carousel-intent.md | MEDIUM | DONE |
| 007-v21-header-observer.md | LOW | DONE |
| 008-v21-intro-gpu.md | MEDIUM | DONE |

Reconciliados con QA final V2.1: 17 comprobaciones dev y 16 prod PASS. Ver V21_QA_REPORT.md. La inicialización de intro espera visibilidad; prepara WebGL después de la intro sin bloquear HTML.
