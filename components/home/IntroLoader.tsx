"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const messages = [
  ["Inicializando interfaz…", 18],
  ["Conectando módulos…", 42],
  ["Verificando responsive…", 68],
  ["Optimizando experiencia móvil…", 88],
  ["Sistema listo.", 100],
] as const;

type IntroLoaderProps = { onComplete?: () => void };

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const completedRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  const safetyTimerRef = useRef<number | null>(null);

  const clearScheduledWork = useCallback(() => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current);
    if (safetyTimerRef.current !== null) window.clearTimeout(safetyTimerRef.current);
    frameRef.current = null;
    completionTimerRef.current = null;
    safetyTimerRef.current = null;
  }, []);

  const complete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearScheduledWork();
    document.documentElement.classList.remove("intro-active");
    try { onComplete?.(); } catch {}
    setVisible(false);
  }, [clearScheduledWork, onComplete]);

  useEffect(() => {
    completedRef.current = false;
    document.documentElement.classList.add("intro-active");
    const duration = reduceMotion ? 160 : 3200;
    const startedAt = performance.now();
    let cancelled = false;

    const update = (now: number) => {
      try {
        if (cancelled || completedRef.current) return;
        const progress = Math.min(1, (now - startedAt) / duration);
        const nextStep = Math.min(messages.length - 1, Math.floor(progress * messages.length));
        setStep(current => current === nextStep ? current : nextStep);
        if (progress < 1) frameRef.current = window.requestAnimationFrame(update);
      } catch {}
    };

    completionTimerRef.current = window.setTimeout(complete, duration);
    safetyTimerRef.current = window.setTimeout(complete, 5000);
    try { frameRef.current = window.requestAnimationFrame(update); } catch {}

    return () => {
      cancelled = true;
      clearScheduledWork();
      document.documentElement.classList.remove("intro-active");
    };
  }, [clearScheduledWork, complete, reduceMotion]);

  if (!visible) return null;
  const [line, percent] = messages[step];

  return (
    <div className="intro-loader" role="status" aria-live="polite" aria-label="Cargando Ingenix Hub">
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-circuit circuit-one" aria-hidden="true" /><div className="intro-circuit circuit-two" aria-hidden="true" />
      <div className="boot-terminal">
        <div className="terminal-topbar" aria-hidden="true"><span /><span /><span /><small>ingenix://system/boot</small></div>
        <div className="intro-logo-assembly"><span className="assembly-ring ring-one" /><span className="assembly-ring ring-two" /><span className="assembly-beam" /><Image src="/images/logo_no_bg.png" alt="Ingenix Hub" width={1254} height={357} priority /></div>
        <div className="boot-console">
          <strong>INGENIX ENGINEERING SYSTEM</strong>
          <p><span className="boot-prefix">&gt;</span> <span>{line}</span><i className="typing-cursor" /></p>
          <div className="boot-status-row"><div className="matrix-loader" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <span key={index} />)}</div><small>{String(percent).padStart(2, "0")}%</small></div>
          <div className="boot-track" aria-hidden="true"><span style={{ width: `${percent}%` }} /></div>
          <button className="skip-intro" type="button" onClick={complete}>Saltar intro</button>
        </div>
      </div>
    </div>
  );
}
