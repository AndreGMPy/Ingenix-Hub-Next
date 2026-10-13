# V2 — review-animations
Revisión inicial: 2026-10-10. Base: C:\\Users\\brand\\.agents\\skills\\review-animations\\SKILL.md y STANDARDS.md, leídos. Continuación y correcciones autorizadas expresamente por el usuario.

| Área | Evidencia | Veredicto inicial |
| --- | --- | --- |
| Responsabilidad | ScrollDirector: GSAP sólo pin, progreso y máscara; Capabilities: Motion sólo cambio de panel; EcosystemScene: R3F sólo escena | Sin propiedad compartida entre motores |
| Teclado | Capabilities onKey + data-instant, NixButton detail=0, NixChat evento KeyboardEvent | Acción principal instantánea |
| Easing y tiempos | lib/motion.ts + globals.css, 120/160/240/600 ms, ease-out .23/1/.32/1 | UI bajo 300 ms; sin ease-in |
| Físico | Chat desktop origen bottom right, escala .97; móvil traslado 2% | Movimiento corto y comprensible |
| Interrupciones | Chat usa transición de Base UI; cambios de servicio sustituyen estado; busy ref evita doble envío | Verificar rápida apertura/cierre en runtime |
| Scroll | Narrativa completa en DOM; no wheel/touch intercept; pinSpacing=false; siete etapas sin alturas artificiales | Recorrido natural; rangos finitos |
| Performance | Pointer R3F por refs; no React state por frame; GPU limitado; materiales simples | Presupuesto razonable; FPS en hardware pendiente |
| Accesibilidad | Media queries y useMedia, móvil estático, reduced elimina pin/parallax y conserva feedback | Verificar runtime |
| Sustitución del fallback | Captura inmediatamente tras ready muestra un breve doble dibujo SVG + WebGL durante el crossfade | Pulir en improve-animations |
| Chrome de prototipo | PICKER.md copiado literalmente, transición width 250ms en ruta sólo dev | Excepción deliberada; no modificar el diseño literal de la skill |

Se rechazó añadir magnetic cursor a todos los controles, stagger repetido a cada sección y partículas decorativas. No ayudan al objetivo comercial.
La revisión final se registrará después de los planes de pulido y las comprobaciones en navegador.

Revisión final: planes001–005 implementados. Teclado instantáneo en popup/backdrop/Close; selección rápida sin fade repetido; reduced conserva feedback de color; fallback sin doble contorno; 3D demand responde al cursor y se detiene en reposo. Lectura clara, sin partículas ni entradas repetitivas. Lint, build y runtime pasan; hardware físico se documenta pendiente.
