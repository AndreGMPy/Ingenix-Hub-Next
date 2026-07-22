"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const messages = [
  ["Inicializando interfaz…", 18],
  ["Conectando módulos…", 42],
  ["Verificando responsive…", 68],
  ["Optimizando experiencia móvil…", 88],
  ["Sistema listo.", 100],
] as const;

const INTRO_DURATION_MS = 3_200;
const REDUCED_MOTION_DURATION_MS = 160;
const SAFETY_TIMEOUT_MS = 5_000;

type IntroLoaderProps = { onComplete?: () => void };

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
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

  const finishIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearScheduledWork();
    document.documentElement.classList.remove("intro-active");
    setVisible(false);
    onComplete?.();
  }, [clearScheduledWork, onComplete]);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mediaQuery) return;

    const updateMotionPreference = () => setReduceMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    completedRef.current = false;
    document.documentElement.classList.add("intro-active");

    let active = true;
    const duration = reduceMotion ? REDUCED_MOTION_DURATION_MS : INTRO_DURATION_MS;
    const startedAt = performance.now();
    const finishIfActive = () => {
      if (active) finishIntro();
    };

    completionTimerRef.current = window.setTimeout(finishIfActive, duration);
    safetyTimerRef.current = window.setTimeout(finishIfActive, SAFETY_TIMEOUT_MS);

    if (reduceMotion || typeof window.requestAnimationFrame !== "function") {
      if (typeof window.requestAnimationFrame !== "function") finishIfActive();
      return () => {
        active = false;
        clearScheduledWork();
        document.documentElement.classList.remove("intro-active");
      };
    }

    const update = (now: number) => {
      if (!active || completedRef.current) return;

      const progress = Math.min(1, Math.max(0, (now - startedAt) / duration));
      const nextStep = Math.min(messages.length - 1, Math.floor(progress * messages.length));
      setStep((current) => current === nextStep ? current : nextStep);

      if (progress >= 1) {
        finishIfActive();
        return;
      }

      try {
        frameRef.current = window.requestAnimationFrame(update);
      } catch (error) {
        console.error("Intro animation failed:", error);
        finishIfActive();
      }
    };

    try {
      frameRef.current = window.requestAnimationFrame(update);
    } catch (error) {
      console.error("Intro animation failed:", error);
      finishIfActive();
    }

    return () => {
      active = false;
      clearScheduledWork();
      document.documentElement.classList.remove("intro-active");
    };
  }, [clearScheduledWork, finishIntro, reduceMotion]);

  if (!visible) return null;

  const activeMessage = messages[step] ?? messages[0];
  const line = activeMessage[0];
  const percent = activeMessage[1];

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
          <button className="skip-intro" type="button" onClick={finishIntro}>Saltar intro</button>
        </div>
      </div>
    </div>
  );
}
