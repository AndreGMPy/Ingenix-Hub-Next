"use client";

import { useReducedMotion } from "motion/react";
import { useEffect } from "react";

export function PageEnhancements() {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduceMotion || !("IntersectionObserver" in window)) revealItems.forEach(item => item.classList.add("visible"));
    const observer = !reduceMotion && "IntersectionObserver" in window ? new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer?.unobserve(entry.target); } }), { threshold: 0.16 }) : null;
    revealItems.forEach(item => observer?.observe(item));

    const cleanups: Array<() => void> = [];
    if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>(".tilt-card, .quote-panel, .contact-card").forEach(card => {
        const move = (event: PointerEvent) => { const rect = card.getBoundingClientRect(); const x = event.clientX - rect.left; const y = event.clientY - rect.top; card.style.setProperty("--rx", `${(-((y - rect.height / 2) / rect.height) * 6).toFixed(2)}deg`); card.style.setProperty("--ry", `${(((x - rect.width / 2) / rect.width) * 6).toFixed(2)}deg`); card.style.setProperty("--mx", `${x}px`); card.style.setProperty("--my", `${y}px`); };
        const leave = () => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); };
        card.addEventListener("pointermove", move); card.addEventListener("pointerleave", leave);
        cleanups.push(() => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); });
      });
      document.querySelectorAll<HTMLElement>(".magnetic, .btn").forEach(button => {
        const move = (event: PointerEvent) => { const rect = button.getBoundingClientRect(); button.style.setProperty("--magnetic-x", `${((event.clientX - rect.left - rect.width / 2) * 0.1).toFixed(2)}px`); button.style.setProperty("--magnetic-y", `${((event.clientY - rect.top - rect.height / 2) * 0.12).toFixed(2)}px`); };
        const leave = () => { button.style.setProperty("--magnetic-x", "0px"); button.style.setProperty("--magnetic-y", "0px"); };
        button.addEventListener("pointermove", move); button.addEventListener("pointerleave", leave);
        cleanups.push(() => { button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", leave); });
      });
    }
    document.querySelectorAll<HTMLDetailsElement>(".faq-item").forEach(item => {
      const toggle = () => { if (item.open) document.querySelectorAll<HTMLDetailsElement>(".faq-item[open]").forEach(openItem => { if (openItem !== item) openItem.open = false; }); };
      item.addEventListener("toggle", toggle); cleanups.push(() => item.removeEventListener("toggle", toggle));
    });
    return () => { observer?.disconnect(); cleanups.forEach(cleanup => cleanup()); };
  }, [reduceMotion]);
  return null;
}
