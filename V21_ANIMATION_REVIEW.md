# V2.1 — review-animations
CSS: press120ms, fast160ms, normal240ms, ease-out cubic-bezier(.23,1,.32,1). Motion sólo selección y demostración. GSAP sólo scroll. R3F sólo escena.
STANDARDS.md y RECIPES.md leídos. SVG strokeDashoffset es excepción explicativa pequeña y solicitada; no anima layout ni utiliza React por frame.

| Before | After | Why |
| --- | --- | --- |
| Replay teclado montaba respuesta con 240ms | initial:false y duration:0 para teclado / reduced | Respuesta directa sin movimiento involuntario |
| Observer de carrusel podía restaurar slide saliente | Ref de destino pendiente; gestos cancelan intención | Taps rápidos conservan destino y permiten interrupción |
| Header rootMargin porcentual dependía del ancho | Margen vertical en px derivado de altura; actualiza en resize | Indicador funciona en panorámico |
| GPU podía iniciar durante intro | WebGL espera a intro; HTML/SVG no esperan a GPU | Separación del coste de preparación |
| Intro comenzaba en pestaña invisible | Comienza sólo cuando document.hidden=false | La marca se presenta al abrir la pestaña |

Entrada marca1350ms + fail-safe1450ms por sesión. No focus trap, bloqueo body, porcentajes ni dependencia API. Skip/Tab/Escape terminan instantáneo. Sesión sin storage soportada.
Carrusel usa física y scroll-snap del navegador, sin animación autoral por pointermove; teclado/reduced instantáneo, no autoplay. Hover160ms sólo hover:hover/pointer:fine.
Nix: secuencia una vista, replay explícito, sin texto que se escribe por carácter; conversación real no se anima ni recorta.
3D: demand, damping por pointer; cero idle continuo, sin state por frame. Context lost conserva SVG.
Review = APPROVE tras comprobar runtime y corregir los hallazgos anteriores. Hardware Safari y feel-check de swipe en iPhone siguen pendientes de revisión humana.

