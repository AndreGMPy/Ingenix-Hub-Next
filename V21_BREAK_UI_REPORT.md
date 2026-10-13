# V2.1 — break-ui
Surface: Project.title/category/summary/description/domain/technologies/scope/image y colección; Capability nombre/título/includes; chat texto hasta1200 usuario y8000 IA. Proyectos comerciales son contenido estático tipado (sin entrada libre); strings sin límite de esquema. QA usa valores plausibles del CATALOG.md.
Fixtures existentes ampliadas por el nuevo carousel, dev-only /qa?data=worst: nombre Cooperativa de Productores Textiles del Bajío — División Internacional, dominio largo, descripción/tecnologías/alcance ausentes, chat largo/multilingüe/HTML literal; Empty/One/Demo. No se modifican datos comerciales para forzar el test.
| Severity | Field | Worst case | What happens | Fix |
| --- | --- | --- | --- | --- |
| Fragile, corregido | Índice del carousel | Cambiar lista5→1 después de navegar | Índice anterior podía exceder nueva colección | components/portfolio/PortfolioCarousel.tsx: current acotado, selección clamp, Empty desmonta carrusel |
| Fragile, corregido | Destino rápido | Dos taps50ms | Observer podía devolver contador al anterior | Pending ref; gestos interrumpen |
| Ugly, corregido | Hero móvil | 390px | Figure se encogía al ancho intrínseco | app/v21.css: width100%;align-self:stretch |

Held up: títulos largos se envuelven; metadatos incompletos se omiten; Empty útil; One01/01 con límites; 320px y texto200% sin overflow; screenshots conservan relación; imágenes reales cargan; mensajes no se truncan; BottomNav44px y sheet16px.
No decisión de truncado pendiente: nombre/descripción completos. Toggle disponible sólo desarrollo; producción devuelve404.

