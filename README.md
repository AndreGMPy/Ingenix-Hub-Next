# Ingenix Hub V2
V2 aprobada, creada desde cero y promovida a la carpeta oficial `next-app`. La aplicación anterior se conserva en `../next-app-backup`; no eliminarla hasta la revisión manual.

## Local
npm install
npm run dev
Desarrollo: http://127.0.0.1:4173

npm run lint
npm test
npm run build
npm run start
Producción local: http://127.0.0.1:4174

.env.local conserva GEMINI_API_KEY, GEMINI_MODEL y ALLOWED_ORIGIN del entorno aprobado. La clave permanece server-side y el archivo sigue ignorado por Git.
La aplicación utiliza sus propios assets, código, configuración y dependencias. No necesita archivos del backup para funcionar.

## Revisión
Home completa: /
Exploración de Hero, sólo desarrollo: /prototypes/hero
Stress test, sólo desarrollo: /qa
Documentación: V2_DESIGN_SYSTEM.md, V2_EXPERIENCE_PLAN.md, V2_QA_REPORT.md
Sin push ni deploy.

V2.1: intro de marca no bloqueante, núcleo con isotipo oficial, portafolio interactivo con swipe y /portafolio completo. Evidencia comparativa: V21_VISUAL_COMPARISON.md. QA final: V21_QA_REPORT.md.
