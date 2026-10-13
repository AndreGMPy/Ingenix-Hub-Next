# Ingenix Hub V2 — Experience plan

## Rutas y alcance
WORKSPACE_ROOT = C:\Users\brand\OneDrive\Desktop\Proyectos trabajo\Proyectos paginas wb\Ingenix-hub
REFERENCE_APP = WORKSPACE_ROOT\next-app
NEW_V2_APP = WORKSPACE_ROOT\next-app-v2

next-app y legacy-site son sólo lectura. Sin push, deploy, cambios de remotes ni modificación de producción. Un snapshot SHA-256 de archivos de referencia permite comparar al terminar. Assets se copian/optimizan dentro de V2. .env.local local ignorado, sin valores en documentación ni logs.

## Auditoría de referencia
Conservar: logo horizontal oficial, screenshots de cinco proyectos, mascota Nix, contacto +52 493 263 6339, WhatsApp, correo ingenixhub@gmail.com, Instagram/Facebook reales, metadata de dominio y comportamiento comercial de Nix.
Portafolio real: Charly Alexa (e-commerce infantil, charlyalexa.com); Gama Studio MX; TextiBajío; Cuellos Textiles Goar; Demo de Ventas Online (identificada como demo). No Damaris. No clientes/métricas inventados. El dato de proyectos se reescribe como contenido tipado, no se importa desde la app anterior.
Nix: GoogleGenAI server-side, historial alternado, límites, timeout, respuesta del candidato principal. Env disponible: GEMINI_API_KEY, GEMINI_MODEL, ALLOWED_ORIGIN. Sólo nombres y presencia inspeccionados. Mejorar validación de objetos null/roles desconocidos, límite real del body y almacén de rate limit acotado.
Abandonar: layout, Hero, IntroLoader, CSS, cards, ArchitecturePipeline, StickyShowcase, ServicesCommandCenter, animaciones de la referencia. No se porta ningún componente visual.

## Narrativa
**Tu negocio. Bien conectado.** “Diseñamos y desarrollamos páginas web, tiendas en línea y software que conecta lo que tu negocio necesita.” Primero se entiende el negocio, luego se exploran capacidades, se explica la ingeniería y se muestra trabajo real. Cierre corto con contacto gratuito.

## Hero / 3D
Composición editorial con tipografía, CTA y un plano espacial de ingeniería: capas centrales azules + seis módulos WEB, E-COMMERCE, SOFTWARE, DATOS, AUTOMATIZACIÓN, IA. Geometría propia, conexiones y luz suave; no logo girando ni laptop. Etiquetas HTML legibles alrededor del canvas. Pointer inclina sutilmente el sistema; no React setState por frame. Botón para pausar movimiento. En mobile: geometría reducida, DPR 1, escena estática.

HTML/copy/CTA se envían desde Server Components. El Hero tiene ilustración SVG estática antes de cargar WebGL, del mismo ecosistema. La escena usa dynamic import ssr:false desde un client island. No fullscreen loader. El área reserva su dimensión. Contexto no disponible, fallo de chunk o context lost conserva fallback, sin tapar contenido.

## Capabilities
Explorador de seis capacidades con selección mouse, touch y teclado. La vista cambia de estructura: página editorial, catálogo/carrito, consola administrativa, teléfono/PWA, flujo de automatización, conversación IA. Vista conceptual etiquetada para evitar confundirla con un proyecto real. Sin precios/métricas ficticias. Contexto y enlace a cotización cambian junto con el sistema.

## Architecture story
Secuencia NEGOCIO > INTERFAZ > SOFTWARE/API > DATOS > AUTOMATIZACIÓN > IA > RESULTADO. Diagrama técnico vertical DOM/SVG, distinto al ecosistema espacial del Hero. GSAP/ScrollTrigger dibuja el recorrido y fija moderadamente la introducción en desktop alto. Texto siempre visible; el scroll no gobierna React state. En mobile/reduced-motion es una secuencia normal, sin pin. Sin wheel/touch hijacking. Rango start/end comprobado, fin posterior al inicio, sin arrays de offsets procedurales.

## Selected work
Charly Alexa abre como caso destacado con screenshot ancho, explicación real y alcance. Gama Studio y TextiBajío forman una pareja editorial; Goar y la demo mantienen screenshots amplios. Cada proyecto tiene dominio, tipo, descripción, tecnologías y link real. No carousel ni cifras. next/image con dimensiones reales, sizes y carga lazy. ScrollTrigger sólo un reveal/expansión ligera del plano de screenshot, no pinning de todo el portfolio. Mobile stack, imagen completa sin deformación.

## Nix
Mascota original como identidad; secuencia entiende > analiza > orienta > propone > contacto. Conversación de ejemplo marcada como tal. Hablar con Nix abre el chat real.
Chat nuevo: Base UI Dialog para foco, Escape, portal y modal móvil; desktop modal:false. Compacto flotante, minimizar/cerrar, conserva sesión validada en sessionStorage. Estados loading, reply, retry, error, quick prompts, multiline, IME y mensajes largos. No Markdown interpretado como HTML. Server route /api/chat, clave jamás pública. WhatsApp sólo transmite un resumen si el usuario elige el enlace, no mensajes automáticos.

## Process / contact / footer
Idea > Diagnóstico > Diseño > Desarrollo > Pruebas > Lanzamiento, una franja breve.
CTA: “¿Tienes una idea? Construyámosla.” WhatsApp, Nix, teléfono/correo reales. Cotización sin costo; sin formulario largo. Footer compacto, dominio, enlaces sociales reales, sin LinkedIn.

## Mobile / temas
BottomNav: Inicio, Servicios, Nix, Proyectos, Contacto. Active section mediante IntersectionObserver, nunca state por scroll frame. Nix central y sheet a altura visible, safe areas, textarea 16px, scroll interno y teclado VisualViewport. Menos simultaneidad, no drift. Tablet mantiene contenido íntegro.
Light: blanco frío, navy, azul, sombras pequeñas. Dark: navy profundo, superficies diseñadas, texto claro, cian contenido. Theme antes del primer paint y persistencia local, theme-color sincronizado. No filter invert.

## Librerías y responsabilidades
Next.js App Router, React, TS estricto, CSS.
Motion: transición del preview y AnimatePresence de estados UI si necesaria.
GSAP + ScrollTrigger: arquitectura y screenshots exclusivamente.
Three + R3F + Drei RoundedBox: una escena del Hero. Sin postprocessing.
Base UI: primitive accesible del chat, elegida con pick-ui-library.
Lucide: una familia de íconos; Manrope variable local.
Playwright/axe dev-only para runtime, viewport y accesibilidad.

## Performance / accesibilidad
Static Server Components para narrativa, process, case studies, footer. Islas cliente separadas por interacción. Fallback SVG inmediato, canvas lazy y DPR desktop <=1.5/mobile 1. Pocas luces, sin sombras GPU/postprocesado/modelos externos. Se detiene fuera de viewport y con documento oculto; reduced-motion estático. Sin mouse/scroll state por frame. Sin listeners/observers sin cleanup.
CSS conserva tamaño de assets, screenshot lazy, fuente local. Objetivos LCP<2.5s, CLS<.1, INP<200ms; son objetivos, no puntuaciones inventadas. Se registra medición local y no se presenta como benchmark de producción real.
Semántica, heading hierarchy, skip link, contraste 4.5:1, targets, foco, teclado y reduced-motion. UI funciona sin WebGL; contenido/links principales funcionan sin JS. No-JS puede mostrar el preview web estático.

## Motion opportunities — find-animation-opportunities
| # | Ubicación planificada | Estado inicial | Propósito | Frecuencia | Receta |
| --- | --- | --- | --- | --- | --- |
| 1 | components/home/ArchitectureStory | Capas separadas | Explanation | Primera visita | Recorrido scaleY 0..1, ScrollTrigger scrub .5, rango finito, static reduced |
| 2 | components/home/Capabilities | Cambio de vista | Preventing a jarring change | Ocasional | Motion opacity + translateY(6px), .24s ease-out(.23,1,.32,1); teclado instantáneo |
| 3 | components/nix/NixChat | Panel aparece | Spatial consistency | Ocasional | CSS opacity + translateY(2%) scale(.97), 240ms entrada/160ms salida, origen bottom-right desktop; reduce sólo opacity 160ms |
| 4 | components/ui / controles | Press sin feedback | Feedback | Tens/day | CSS scale(.97), 120ms ease-out; reduced sólo color |
| 5 | components/three/Ecosystem | Ecosistema estático | Explanation | Primera visita | R3F perspectiva sutil, pausa visible/offscreen, reduced/mobile quiet |

Rechazados: movimiento de títulos mientras se leen (function); texto que aparece palabra a palabra (delay de lectura); hover global del cursor (sin propósito); animar navegación por teclado (frequency/keyboard); partículas repetidas (sin propósito).

## Prototype
Exploración aislada /prototypes/hero con picker literal: Ecosistema (profundidad), Editorial (texto/imagen real), Planos (interacción de arquitectura). Switching instantáneo, teclas 1–3/arrow/R y URL v. No código de prototypes se importa en Home. La instrucción explícita del usuario de continuar sin aprobación permite elegir una dirección inicial y dejar las alternativas disponibles para revisión humana.

## QA y riesgos
Dev 4173, producción local 4174; no publicar. Probar 375x667,390x844,430x932,768x1024,1024x768,1280x720,1366x768,1440x900,1920x1080; zoom125/150 y text200. Tests API/historial/rangos. Console/runtime/hydration/assets/WAAPI. WebGL fallback, scroll ida/vuelta, tabs, Nix real/error/retry, temas, keyboard y reduced.
Break-ui: dev-only /qa con fixture Demo/Worst/Empty/One y mensajes plausibles largos, URLs, emoji, límites de 1200 caracteres. Reportar antes de corregir; el usuario ya autoriza resolver errores y no detener la implementación. Informe conserva evidencia.
Review-animations y improve-animations al completar el diseño: barrido y tablas con archivo/línea; los planes read-only viven en plans/. Después implementar ajustes dentro del alcance autorizado y volver a comprobar.

Riesgos: GPU/driver no disponible (SVG + boundary); inestabilidad de red Gemini (timeout/error/retry/WhatsApp); cuota de IA (429 amigable); iOS keyboard/safe-area (VisualViewport + hardware pendiente si no hay teléfono conectado); motion al cambiar breakpoint (GSAP matchMedia y cleanup); estado corrupto en storage (schema/limit); fuente fallida (system fallback). No declarar hardware probado desde emulación.

## Fuentes técnicas
- https://r3f.docs.pmnd.rs/advanced/scaling-performance
- https://r3f.docs.pmnd.rs/api/canvas
- https://drei.docs.pmnd.rs/shapes/rounded-box
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://nextjs.org/docs/app/guides/lazy-loading
- https://base-ui.com/react/components/dialog

Pulido final: Three182 compatible con Clock de R3F9; renderer demand también en desktop, se invalida sólo al interactuar/resize y durante el asentamiento del cursor. Se retira drift permanente. Carga tras paint/idle. Chat inicia foco en Cerrar móvil y mantiene sheet en horizontal táctil. Contexto de mensajes se acota por bytes conservando mensajes completos visibles.
V2.1 supersede la presentación estática de proyectos: PortfolioCarousel nativo, /portafolio con cinco casos, intro no bloqueante independiente de GPU, logo integrado, isotipo en núcleo hexagonal, ArchitectureFlow y NixConversation. Conserva seguridad, server islands y fallback; ver V21_VISUAL_COMPARISON.md.
