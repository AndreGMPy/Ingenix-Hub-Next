"use client";
import { ArrowUpRight } from "lucide-react";
import { openNix } from "@/lib/nix-events";
export function NixButton({ children = "Hablar con Nix", className = "button button-secondary" }: { children?: React.ReactNode; className?: string }) {
  return <button type="button" className={className} onClick={(event) => openNix(event.detail === 0)}>{children}<ArrowUpRight size={18} aria-hidden="true" /></button>;
}

