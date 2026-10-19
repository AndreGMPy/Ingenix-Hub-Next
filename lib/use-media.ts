"use client";
export const MOBILE_QUERY = "(max-width:767px), (hover:none) and (pointer:coarse) and (max-height:500px)";
/** Hero con pin y scrub: sin reduced motion y con alto suficiente (teléfono horizontal queda estático). */
export const SHOWCASE_QUERY = "(prefers-reduced-motion:no-preference) and (min-height:501px)";
import { useCallback, useSyncExternalStore } from "react";
export function useMedia(query: string) {
  const subscribe = useCallback((listener: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  const snapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, snapshot, () => false);
}

