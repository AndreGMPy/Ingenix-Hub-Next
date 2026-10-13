# 007 — Usar altura real para franja de lectura
Status: DONE
Commit: caa4351
Severity: MEDIUM
Category: Accessibility
Scope: components/layout/HeaderState.tsx únicamente.
Problema: rootMargin -20%/-60% se resuelve sobre ancho y puede colapsar en1440×900.
Target: rootMargin="-90px 0px -"+Math.round(innerHeight*.45)+"px 0px"; reconstruir observer sólo en resize, desconectar ambos y listeners en cleanup.
Verificación: servicios/proyectos/nix reciben aria-current=location en desktop; sin setState por scroll. No modificar API/chat/reference.

