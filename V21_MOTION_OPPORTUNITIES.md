# find-animation-opportunities — reconocimiento antes de implementar
Next/React, CSS tokens + Motion micro UI, GSAP scroll, R3F escena. No motor compartirá propiedad del mismo elemento.

| # | Location | Today | Purpose | Frequency | Suggested motion |
| --- | --- | --- | --- | --- | --- |
| 1 | BrandIntro nuevo | Marca entra sin momento propio | Delight / continuidad | Una vez por sesión | CSS transform + opacity, 1350ms total, cubic-bezier(.23,1,.32,1); skip y reduced omite |
| 2 | PortfolioCarousel nuevo | Casos estáticos | Spatial consistency | Ocasional | scroll-snap nativo; scroll suave solo tap/flechas, teclado instantáneo; gestos 1:1 nativos |
| 3 | ArchitectureFlow nuevo | Lista sin lectura de conexiones | Explanation | Scroll ocasional | GSAP traza por scroll, sin pin adicional; reduced conserva circuito completo |
| 4 | NixConversation nuevo | Ejemplo fijo | Explanation | Una primera vista / replay voluntario | Tres estados 240ms opacity/translate4px easeOut; sin autoplay repetitivo |
| 5 | Nodos y Nix | Sin feedback | Feedback | Ocasional hover | transform translateY(-3px) 160ms easeOut, solo pointer fine; reduced color |

Rechazados: autoplay de proyectos (lectura), partículas continuas (sin propósito), movimiento de respuestas reales (lectura), transición en flechas teclado (frecuencia/input), scene render loop continuo (performance).
Mayor valor: carrusel manipulable y marca en el núcleo. Implementación posterior bajo animate, independiente del diagnóstico de esta skill.

