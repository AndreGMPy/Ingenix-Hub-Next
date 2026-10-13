# V2 — break-ui
SKILL.md y CATALOG.md leídos; la ruta /qa sólo existe en desarrollo. El usuario autorizó encontrar y corregir sin detener la implementación.

## Superficie
| Campo | Fuente | Límite | Opcional |
| --- | --- | --- | --- |
| Nombre, título, dominio, descripción | data/projects.ts | Datos editoriales estáticos; no schema externo | Descripción y alcance sí |
| Servicio y subtítulo | data/site.ts | Seis registros estáticos | Lista puede estar vacía en fixture |
| Mensaje de usuario | lib/chat.ts, API | 1.200 caracteres | Vacío rechazado |
| Respuesta IA | lib/chat.ts | 8.000 caracteres conservados | Error explícito si vacía |
| Historial | lib/chat.ts | Seis turnos; petición hasta once mensajes | Sesión vacía válida |

Fixtures plausibles: cooperativa con nombre largo, dominio corporativo largo, correo internacional, nombre corto Jo, árabe/vietnamita/emoji, texto literal con caracteres HTML, datos ausentes, listas vacías y un único proyecto. Mensaje de usuario probado exactamente al límite. Respuesta de más de 4.000 caracteres. No se inventan métricas o clientes en la Home.

## Hallazgos iniciales antes de las correcciones
| Elemento | Caso | Rotura | Corrección propuesta |
| --- | --- | --- | --- |
| Chat | Respuesta larga, navegación de teclado | Región que hace scroll sin foco, falla axe scrollable-region-focusable | Añadir tabIndex=0 y nombre a la región |
| Portfolio | Scope y technologies vacíos | Ver alcance abre contenido vacío | Mostrar details sólo si contiene información |
| Harness automatizado | /qa sin footer | Test esperaba footer inexistente | Adaptar test a presencia opcional del footer |
| Cambio de tema | Axe durante los primeros 240ms | Colores intermedios de una transición causaron falso positivo de contraste | Esperar estado estable y verificar ambos temas; no aclarar/diluir los colores |

Las correcciones y resultados finales se anexan después de repetir las pruebas.

| Historial largo | Once mensajes válidos sumaron 43.031 bytes (límite 32.000) | Un historial aceptado podía bloquear el siguiente envío con 413 | Limitar contexto por bytes, retirando pares antiguos completos; conservar mensajes íntegros visibles |
| Chat móvil | Tab inmediatamente tras abrir el sheet | El foco inicial quedaba fuera del diálogo | Enfocar Cerrar (sin activar teclado) al abrir; conservar trap de Base UI |
| Orientación de teléfono | 844x390 con puntero táctil | El breakpoint por ancho convertía el chat en panel desktop | Mantener modo móvil en orientación horizontal táctil, con safe areas y escena compacta |
Resultado final: todos los hallazgos corregidos. Demo/Worst/Empty/One, 320px/texto200%, respuesta larga, teclado, orientación, zoom reflow y temas pasan; consola/axe/overflow0. Historial por bytes probado sin recortar mensajes. Las pruebas se repitieron después de cada corrección.
