# 008 — Separar marca y preparación GPU
Status: DONE
Commit: caa4351
Severity: MEDIUM
Category: Performance
Scope: components/layout/BrandIntro.tsx, components/three/HeroEcosystem.tsx.
Target: intro CSS1350ms, safety1450ms; start visible-only; storage flag se registra al comenzar. HTML visible debajo, pointer-events:none, skip pointer-events:auto, sin body lock.
probeWebGL consulta .brand-intro:not([hidden]) y reintenta1600ms después; intro jamás consulta Canvas ni Gemini. Preserve dynamic ssr:false/DPR/demand/fallback.
Verificación: primera carga, refresh, nueva pestaña visible, storage que lanza excepción, reduced motion, webgl=off, WebGL2 real. Captura circuito/logo durante fase media, no screenshot de frame inicial vacío.

