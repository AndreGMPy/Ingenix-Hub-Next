# Ingenix Hub V2.1 — QA final
Fecha: 2026-10-10. Exclusivamente local. Sin push ni deploy.

## Resultado
DEV_RUNTIME = PASS — http://127.0.0.1:4173
PROD_RUNTIME = PASS — http://127.0.0.1:4174
LINT = PASS
BUILD = PASS
UNIT_TESTS = PASS — 7 pruebas.
READY_FOR_HUMAN_REVIEW = YES

Next dev y next start ejecutados realmente. Build de producción final validado en Chrome, no sólo compilado. Evidencia: qa-results/v21/dev-runtime.json (17 comprobaciones PASS), qa-results/v21/prod-runtime.json (16 PASS). Reportes incluyen consola, respuestas HTTP, WebGL y axe. Ningún error de consola/hydration/WAAPI, asset faltante ni overflow horizontal detectado.

## Cobertura
375×667, 390×844, 430×932, 768×1024, 1024×768, 1280×720, 1366×768, 1440×900 y 1920×1080. En cada viewport: seis servicios, cinco proyectos, light/dark, WebGL listo, overflow 0. Capturas dev/prod en qa-results/v21.
Axe WCAG2A/AA/2.1AA: cero violaciones detectadas en 390/1440, light/dark. Esto complementa teclado y foco; no reemplaza auditoría humana.

Intro: primera carga, skip, HTML detrás disponible, ausencia de scroll lock, misma sesión, nueva pestaña, storage indisponible, reduced motion. Compositor normal de Chrome para capturas CSS; SwiftShader se usa separadamente para WebGL porque sus animaciones CSS en pestañas secundarias pueden congelarse en headless. Intro no depende de GPU/API.
Hero: geometría real R3F, isótipo oficial, versión reducida móvil, fallback SVG forzado con ?webgl=off y contenido sin JavaScript.
Scroll: ida/vuelta natural, GSAP con rangos válidos y sin hijacking; navegación activa; Nix replay por teclado inmediato.
Portfolio: cinco imágenes reales completas, flechas, indicadores, límites, Home/End/Left/Right, doble tap rápido y reversión, gesto táctil nativo CDP, ruta /portafolio y navegación de regreso.
Mobile: BottomNav, targets de 44px, portrait/landscape; CSS zoom 125/150%; texto 200% a 320px. No se atribuye prueba en iPhone físico.
Reduced motion conserva contenido y controles, omite intro y coreografías.
Break UI: Worst/Empty/One/Demo y tres prototipos probados en desarrollo; harness no disponible en producción.

## Nix real y regresiones
qa-results/dev-targeted-runtime.json: seis comprobaciones PASS.
qa-results/prod-targeted-runtime.json: siete PASS.
Gemini server-side: solicitud real con respuesta satisfactoria. Abrir/cerrar/reabrir, sesión, multiline, quick prompts, error 503 controlado/reintento, respuesta larga y scroll interno, viewport de teclado y landscape. Validación API 400/413/403; ninguna clave expuesta. Código server-side de Nix conservado, sin cambios posteriores a esa comprobación.

## Rendimiento medido
qa-results/performance.json: medición local de producción con caché desactivada, red 20Mbps/40ms y CPU limitada 4×, WebGL por software.
| Viewport | LCP/FCP | CLS | Mayor interacción registrada |
| --- | --- | --- | --- |
| 1440×900 | 3800ms | 0 | 432ms |
| 390×844 | 972ms | 0 | 192ms |
Transferencia inicial observada ~808KB. La interacción medida no es INP de campo. El escritorio requiere optimización/verificación en GPU real; no se declara presupuesto de rendimiento aprobado. Canvas demanda frames, sin render continuo inactivo; Three dinámico, DPR limitado y fallback sin escena.

## Integridad y pendientes
Verificación SHA de 69 archivos protegidos: referencia y legacy intactos, archivos modificados fuera de V2 = NONE; secretos en bundles cliente = NONE. Manifiesto en qa-results/integrity.json y V2_FILES_CREATED.txt.
P0 = NONE
P1 = NONE
P2 = Rendimiento desktop de laboratorio anterior; cinco findings high en dependencias de herramientas dev, npm audit --omit=dev = 0. No se fuerzan versiones incompatibles.
P3 = Safari/iPhone físico, zoom nativo del navegador y métricas de campo pendientes. .qa-v1 es una copia temporal ignorada, no importada ni distribuida; la revisión automática bloqueó su eliminación por política. Originales intactos.

Documentación de diseño: V21_VISUAL_COMPARISON.md, V21_MOTION_OPPORTUNITIES.md, V21_ANIMATION_REVIEW.md, V21_BREAK_UI_REPORT.md, V21_SKILL_LOG.md. Lista de cambios: V21_FILES_CHANGED.txt.

