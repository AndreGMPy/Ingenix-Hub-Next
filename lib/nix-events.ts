export const OPEN_NIX = "ingenix-v2:open-nix";
export function openNix(instant = false) {
  window.dispatchEvent(new CustomEvent(OPEN_NIX, { detail: { instant } }));
}

