# Ingenix Hub V2 — Design system

## Filosofía
**Ingeniería visible, claridad comercial.** Un estudio de software y producto digital, con precisión editorial y un ecosistema conectado. La interfaz demuestra capacidad sin pedir al visitante aprender a navegar una demo. Cada sección cambia de composición: ecosistema, explorador, recorrido técnico, casos reales, conversación, proceso y contacto.

La búsqueda local de UI/UX Pro Max se ejecutó dos veces. El primer resultado orientado a e-commerce se descartó por falta de ajuste. El segundo, “software development agency minimal”, devolvió Minimalism & Swiss Style: se adoptan jerarquía, grid, espacio y legibilidad. Su paleta negra/dorada y su estructura genérica NO sustituyen la identidad azul existente. La tipografía recomendada se contrasta con Apple Design: una sola familia variable local evita solicitudes externas y crea continuidad.

## Tokens de color
| Rol | Light | Dark |
| --- | --- | --- |
| Fondo | #F7F9FC | #080F1D |
| Superficie | #FFFFFF | #111D30 |
| Superficie secundaria | #EDF2F8 | #17263D |
| Texto principal | #10233F | #EEF4FF |
| Texto secundario | #53647B | #A8B8CF |
| Azul de acción | #075BE8 | #80B4FF |
| Texto sobre CTA | #FFFFFF | #07182E |
| Cian | #087F98 | #55D9EF |
| Línea | #D5DFEB | #2B3E59 |
| Navy editorial | #10233F | #0C1729 |
| Error | #A32232 | #FFADB8 |
| Focus | #075BE8 | #80B4FF |

Cian es señal y acento, no texto sobre fondo blanco a baja opacidad. Colores semánticos en CSS; colores de materiales 3D centralizados dentro de la escena. Fotografías no se invierten. V2.1: logo horizontal oficial transparente libre de superficie; filtro sólo del logo para blanco en dark, sin alterar fotos ni mascota.

## Superficies y profundidad
Página abierta sin colección de cards. Contenedores sólo donde hay una interfaz, un screenshot o un chat. Translucencia limitada a navegación flotante. Las superficies de lectura son sólidas. Fondo con línea continua, trama localizada en Hero y gradientes muy suaves; no partículas, filtros globales ni glassmorphism generalizado.

Sombras: small 0 4px 18px rgba(16,35,63,.06); medium 0 18px 60px rgba(16,35,63,.10); floating 0 24px 80px rgba(2,12,30,.24). En dark se refuerzan las líneas y se reduce sombra decorativa. Glow sólo un radial localizado en el núcleo y un halo pequeño en Nix; ningún blur grande repetido.

## Tipografía
Manrope variable local, con fallback system-ui. Una familia para título y texto, monospace del sistema para índices y etiquetas técnicas. No Google Fonts remoto en runtime.
- Display: clamp(2.625rem, 5.5vw, 4.75rem), peso 650, leading 1.07, tracking -.045em.
- H2: clamp(2rem, 3.6vw, 3.25rem), peso 600, leading 1.14, tracking -.035em.
- H3: clamp(1.35rem, 2vw, 1.75rem), peso 600.
- Body: 1rem/1.65; lead clamp(1.0625rem,1.4vw,1.1875rem).
- Small: .8125rem/1.5; etiquetas .75rem, tracking .12em; no texto principal menor a 16px.
Balance de headings progresivo, long tokens con overflow-wrap:anywhere. Texto crece con rem; no cajas que recortan títulos.

## Espacio, geometría y grid
Escala 4/8: 4,8,12,16,24,32,48,64,96,128px expresados en rem. Gutter clamp(20px,4vw,64px). Secciones 80–120px desktop, 64–80px mobile. Contenedor máximo 1320px; lectura 62ch. Grid desktop de 12 columnas implícitas, principales 5/7 y 4/8. Minmax(0,1fr) y min-width:0 en hijos.

Radii: 6px detalles; 12px superficies de UI; 20px chat/preview; pill sólo controles compactos. Portfolio se apoya en grandes planos de imagen y líneas editoriales, no miniaturas flotando en cards.

Breakpoints: 480,768,1024,1440px. Tablet usa composición intermedia y BottomNav hasta 767px. Desktop corto y landscape evitan pinning largo. Ninguna sección agrega 500vh.

## Z-index
base 0, detalles 1, sticky técnico 5, header 30, BottomNav 40, chat trigger 45, backdrop 70, chat 80, dev harness 100 (picker aislado usa el valor literal exigido por su skill). No transform en ancestros del portal. Main y footer reservan espacio para BottomNav.

## Controles
CTA principal sólido azul, min-height 48px, ícono de flecha. Secundario link con subrayado/arrow, misma área de toque. No hover como única acción. Focus visible 3px con offset 4px. Active escala .97 en 120ms. Links externos con rel noopener noreferrer; botón para acciones y anchor para navegación. Tabs con roving tabindex, Arrow keys, Home/End, seleccionado anunciado.

## Motion tokens
CSS y lib/motion.ts comparten:
- fast 160ms, press 120ms;
- normal 240ms; exit 160ms;
- slow/explanation 600ms;
- stagger 50ms;
- ease-out cubic-bezier(.23,1,.32,1);
- ease-in-out cubic-bezier(.77,0,.175,1);
- drawer cubic-bezier(.32,.72,0,1).
Spring sólo si se necesita respuesta interruptible: duración .4, bounce 0. No bounce en lectura o tabs. UI <300ms. Full transform strings en Motion. CSS para press y hover. ScrollTrigger controla únicamente elementos narrativos propios. R3F sólo objetos WebGL.

Keyboard cambia tabs y abre/cierra chat inmediatamente. Reduced-motion conserva todas las secciones y controles, usa color/opacity breve, elimina parallax, pinning, oscilaciones y drift. Hover sólo (hover:hover) and (pointer:fine). Prefers-reduced-transparency solidifica chrome; prefers-contrast:more refuerza bordes.

## Mobile
Hero con texto y CTA antes del plano 3D compacto. DPR 1, menos módulos y sin movimiento continuo. Servicios reflow con lista tocable + vista conceptual, portfolio stack completo. BottomNav de cinco destinos con Nix al centro. Targets >=44px, input 16px, viewport-fit cover, 100dvh en sheet, safe-area superior/inferior y VisualViewport para teclado. Zoom nunca deshabilitado. Chat es modal en móvil y panel no modal en escritorio. El contenido sigue siendo seleccionable.

## Cards
Sólo se utilizan para interfaces internas de previews y burbujas del chat. Servicios, proceso y portfolio no se resuelven con seis cards idénticas. Lo que agrupa información debe tener una razón funcional.

Ajustes finales: modo móvil también con pointer:coarse/hover:none/max-height500px para teléfonos en horizontal; gutters y navegación incluyen safe areas laterales. Escena demand con damping de cursor, sin oscilación permanente.

## Evolución V2.1
Cuatro firmas: circuitos de isotipo, nodos cian, grid técnico localizado y etiquetas compactas. Mayor profundidad mediante luz y superficies azules diferenciadas. Titular Una marca grande. Desde tu celular. Intro1350ms una vez por sesión visible, sin locks. Carrusel scroll-snap88% desktop/94% mobile; portafolio completo editorial. Nix mantiene transparencia y recibe contexto de marca. Ver V21_VISUAL_COMPARISON.md y V21_ANIMATION_REVIEW.md.