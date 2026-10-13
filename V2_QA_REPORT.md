# Ingenix Hub V2 — validación local

## Resultado
Home completa, independiente, lista para revisión humana local. Sin push ni deploy.
Desarrollo: http://127.0.0.1:4173
Producción local: http://127.0.0.1:4174

WORKSPACE_ROOT = C:\\Users\\brand\\OneDrive\\Desktop\\Proyectos trabajo\\Proyectos paginas wb\\Ingenix-hub
REFERENCE_APP = WORKSPACE_ROOT\\next-app
NEW_V2_APP = WORKSPACE_ROOT\\next-app-v2

## Comprobaciones ejecutadas
npm run dev, npm run lint, npm run typecheck, npm test, npm run build, npm run start.
Chrome instalado, Playwright headless, WebGL real con SwiftShader para reproducibilidad. No se usó sólo un build como evidencia de runtime.
Siete tests de contrato/historial/rangos pasan. Veintidós comprobaciones de runtime dev y veintiuna prod. Logs completos: qa-results/dev-runtime.json, prod-runtime.json. Cada comprobación está registrada por nombre. Los resultados anteriores con fallos de desarrollo fueron sustituidos tras corregir y repetir.

| Viewport | Light | Dark | Servicios | Capturas/overflow |
| --- | --- | --- | --- | --- |
| 375x667 | PASS | PASS | Seis | PASS / 0 |
| 390x844 | PASS | PASS | Seis | PASS / 0 |
| 430x932 | PASS | PASS | Seis | PASS / 0 |
| 768x1024 | PASS | PASS | Seis | PASS / 0 |
| 1024x768 | PASS | PASS | Seis | PASS / 0 |
| 1280x720 | PASS | PASS | Seis | PASS / 0 |
| 1366x768 | PASS | PASS | Seis | PASS / 0 |
| 1440x900 | PASS | PASS | Seis | PASS / 0 |
| 1920x1080 | PASS | PASS | Seis | PASS / 0 |

También se prueban 320px con fixtures y texto200%, orientación táctil844x390, viewport de teclado390x420 y reflow equivalente a zoom125/150% mediante CSS zoom. No se presenta ese reflow como un test de zoom del navegador físico.

## Runtime e interacción
HTML y CTA visibles antes de WebGL; sin intro ni pantalla de porcentaje.
Escena ready, pausa de interacción, ausencia de GPU forzada y ?webgl=off; fallback completo. Dynamic import sólo en Hero. Renderer demand; sin ciclo continuo en reposo, DPR1/1.5máximo. Inicialización tras paint/idle; fallback se sustituye después de dibujar.
Scroll wheel hacia abajo/arriba y navegación a los cuatro anchors móviles. Story GSAP desktop con rangos finitos, pin moderado, sin bloquear wheel/touch. En reduced se retira pin y transformación, manteniendo contenido y controles.
Servicios mouse/touch y teclado Home/End/flechas con límites primero/último; cambio rápido no reinicia fade. Seis previews estructuralmente diferentes.
Portfolio: cinco casos reales, dimensiones originales, lazy load optimizado, links reales; sin Damaris ni métricas inventadas. Screenshots se verifican cargados, no placeholders.
Nix real: POST200 mediante Gemini server-side en dev y prod. Se prueba multiline, envío, thinking, respuesta, minimizar/cerrar/reabrir, historial tras reload. El contador de caracteres y Enter/Shift+Enter funcionan.
Red/API503 simulada sólo para el test de error/reintento. Respuesta larga de más de4000caracteres íntegra, scroll interno, inicio/final accesibles. No se confunde esa respuesta fixture con la llamada real.
Mobile: diálogo100dvh/VisualViewport, foco inicial en Cerrar sin abrir teclado, trap de foco, Escape, retorno a BottomNav, safe areas y targets>=44px. Landscape táctil conserva sheet y BottomNav.
Temas diseñados y persistentes; contraste y semántica axe pasan en375/1440 light/dark y chat móvil.
No-JS conserva narrativa, screenshot/portfolio, contacto y fallback. Los controles avanzados requieren JS.
Prototipos funcionales tres variantes, teclas/replay/URL. Fixtures Demo/Worst/Empty/One. Ambas rutas dan404 en producción.

## Motion review / improve
V2_ANIMATION_REVIEW.md y plans/ documentan recon, findings y cinco planes. Dos auditorías read-only paralelas, hallazgos vetados.
Corregidos: Close por teclado, backdrop instantáneo, selección rápida, press con reduced, doble contorno fallback, loop3D innecesario. No se añadieron efectos por cantidad. GSAP, Motion y R3F conservan propiedades/áreas independientes.

## Rendimiento de laboratorio
qa-results/performance.json: producción local, cache de navegador desactivado, red20Mbps/40ms, CPU4x, GPU software. No son métricas de usuarios ni Lighthouse publicado.
- Desktop1440x900: LCP/FCP2292ms, CLS0, interacción máxima registrada216ms.
- Mobile390x844: LCP/FCP912ms, CLS0.0000193, interacción máxima168ms.
- Recursos transferidos en esa carga: aproximadamente545KB, incluyendo fuentes y escena. La variante sin WebGL evita los chunks de escena.
- El ciclo de render continuo elevó una interacción anterior de laboratorio a2224ms; al pasar a demand se redujo a216ms. No se interpreta una muestra sin LCP como0ms exitoso.
FPS y CWV en hardware/red reales pendientes de revisión. El dato de interacción no equivale a INP de campo.

## Seguridad / integridad
Gemini SDK sólo en route handler; server-only para prompt/rate limiting. Sin NEXT_PUBLIC_GEMINI_API_KEY. Env ignorado por Git. Body<=32000bytes, turnos/roles/límites validados, timeout, origen y rate limit acotado. Historial solicitado retira pares antiguos completos según bytes; la UI no trunca mensajes.
qa-results/integrity.json compara SHA256 de69 archivos de referencia y detecta nuevos archivos fuera de V2. NONE. next-app y legacy-site existen y conservan exactamente los archivos de la línea base. La búsqueda del valor de la clave en static JS/HTML/maps no detectó exposición; ningún valor se imprime.
Auditoría npm --omit=dev:0 avisos. Full npm audit:5 entradas high de herramientas de lint provenientes de braces<=3.0.3 (un mismo aviso transitivo). npm view braces confirma3.0.3 al verificar. No se aplica audit fix --force que degradaría la plataforma. ESLint9.39.5 alinea los peers actuales de eslint-config-next; su soporte upstream es un pendiente de herramientas, no del runtime público.
Three0.182.0 está fijado y es compatible con R3F9; evita la API Clock deprecada de r183 en ese motor. Consola final sin warnings ni errores en la suite completa.

## Pendientes
P0 = NONE
P1 = NONE
P2 = Avisos transitivos de lint/dev (producción audit0); revisar actualización compatible cuando exista.
P3 = Safari/iOS en dispositivo real, teclado/safe areas físicos, zoom nativo y CWV/FPS de campo. Chrome móvil emulado se probó; no se declara hardware probado.
Revisión humana solicitada: composición, marca, preferencias entre los prototipos y contenido comercial.

## Evidencia
Capturas qa-results/dev-<width>-light/dark.png y prod equivalentes; full-ready.png; mobile-chat-long.png; prototype-1/2/3.png; break-ui-worst-320.png; zoom1.25/1.5.
Archivos fuente/config/assets/documentos creados: V2_FILES_CREATED.txt. node_modules y .next son artefactos generados y qa-results conserva evidencias.
No modificación de apps anteriores, remotes, producción, push o deploy.

