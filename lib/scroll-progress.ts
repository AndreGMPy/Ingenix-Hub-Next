/* Puente sin React entre ScrollDirector (GSAP) y las escenas que leen el progreso del hero. */
type Listener = () => void;
const listeners = new Set<Listener>();
export const heroProgress = { value: 0 };
export function setHeroProgress(value: number) {
  if (value === heroProgress.value) return;
  heroProgress.value = value;
  listeners.forEach(listener => listener());
}
export function subscribeHeroProgress(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
