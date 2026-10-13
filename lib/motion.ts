export const motionTokens = {
  press: 0.12,
  fast: 0.16,
  normal: 0.24,
  slow: 0.6,
  stagger: 0.05,
  easeOut: [0.23, 1, 0.32, 1] as const,
  easeInOut: [0.77, 0, 0.175, 1] as const,
  drawer: [0.32, 0.72, 0, 1] as const,
  spring: { type: "spring" as const, duration: 0.4, bounce: 0 },
};
export function clamp01(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}
export function validRange(start: number, end: number): boolean {
  return Number.isFinite(start) && Number.isFinite(end) && end > start;
}
export function validateOffsets(offsets: readonly number[]): boolean {
  return offsets.every((value, index) => Number.isFinite(value) && value >= 0 &&
    value <= 1 && (index === 0 || value > offsets[index - 1]));
}

