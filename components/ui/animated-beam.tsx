"use client";

import { motion, useReducedMotion } from "motion/react";
import { RefObject, useId, useLayoutEffect, useState } from "react";

type ElementRef = RefObject<HTMLElement | null>;

export type AnimatedBeamProps = {
  containerRef: ElementRef;
  fromRef: ElementRef;
  toRef: ElementRef;
  className?: string;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
};

type BeamPath = { d: string; width: number; height: number };

/**
 * Adaptación local del patrón Animated Beam de Magic UI.
 * Calcula una curva entre dos referencias y anima un trazo corto sobre la ruta base.
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  className = "",
  curvature = 0,
  reverse = false,
  duration = 7,
  delay = 0,
  pathColor = "currentColor",
  pathWidth = 1.5,
  pathOpacity = 0.2,
  gradientStartColor = "#1d4ed8",
  gradientStopColor = "#22d3ee",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const reduceMotion = useReducedMotion();
  const gradientId = useId().replace(/:/g, "");
  const [path, setPath] = useState<BeamPath | null>(null);

  useLayoutEffect(() => {
    const updatePath = () => {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;
      if (!container || !from || !to) return;

      const containerRect = container.getBoundingClientRect();
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();
      const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
      const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
      const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;
      const horizontal = Math.abs(endX - startX) >= Math.abs(endY - startY);
      const midpoint = horizontal ? Math.abs(endX - startX) * 0.5 : Math.abs(endY - startY) * 0.5;
      const direction = horizontal ? Math.sign(endX - startX || 1) : Math.sign(endY - startY || 1);
      const controlA = horizontal
        ? `${startX + direction * midpoint},${startY + curvature}`
        : `${startX + curvature},${startY + direction * midpoint}`;
      const controlB = horizontal
        ? `${endX - direction * midpoint},${endY - curvature}`
        : `${endX - curvature},${endY - direction * midpoint}`;
      setPath({ d: `M ${startX},${startY} C ${controlA} ${controlB} ${endX},${endY}`, width: containerRect.width, height: containerRect.height });
    };

    updatePath();
    const observer = new ResizeObserver(updatePath);
    [containerRef.current, fromRef.current, toRef.current].forEach(element => { if (element) observer.observe(element); });
    window.addEventListener("resize", updatePath);
    window.addEventListener("scroll", updatePath, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePath);
      window.removeEventListener("scroll", updatePath, true);
    };
  }, [containerRef, endXOffset, endYOffset, fromRef, startXOffset, startYOffset, toRef, curvature]);

  if (!path) return null;
  const dashOffset = reverse ? 46 : -46;

  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`} width={path.width} height={path.height} viewBox={`0 0 ${path.width} ${path.height}`} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" x2={path.width} y1="0" y2="0">
          <stop stopColor={reverse ? gradientStopColor : gradientStartColor} />
          <stop offset="1" stopColor={reverse ? gradientStartColor : gradientStopColor} />
        </linearGradient>
      </defs>
      <path d={path.d} stroke={pathColor} strokeWidth={pathWidth} strokeOpacity={pathOpacity} />
      <motion.path
        d={path.d}
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
        strokeWidth={pathWidth + 1}
        strokeDasharray="8 38"
        initial={false}
        animate={reduceMotion ? { opacity: 0.52 } : { strokeDashoffset: [0, dashOffset], opacity: [0.38, 1, 0.38] }}
        transition={reduceMotion ? { duration: 0 } : { duration, delay, ease: "linear", repeat: Infinity }}
      />
    </svg>
  );
}
