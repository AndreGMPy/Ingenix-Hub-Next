import { test } from "node:test";
import assert from "node:assert/strict";
import { clamp01, validRange, validateOffsets, showcaseFrame, showcaseSteps} from "../lib/motion.ts";
test("rangos finitos y ordenados, incluyendo extremos", () => {
  assert.equal(validRange(0,1),true);
  for(const [start,end] of [[0,0],[1,0],[NaN,1],[0,Infinity]]) assert.equal(validRange(start,end),false);
  assert.equal(validateOffsets([0,.3,.8,1]),true);
  for(const values of [[-.05,0,.3],[.8,1,.95],[0,NaN,1],[0,Infinity],[0,0,1]]) assert.equal(validateOffsets(values),false);
  assert.equal(clamp01(-1),0); assert.equal(clamp01(2),1); assert.equal(clamp01(NaN),0);
});

test("showcase: primer cuadro completo, giro con cambio de pantalla de espaldas y cierre de frente", () => {
  const start = showcaseFrame(0, 5);
  assert.deepEqual(start, { intro: 0, spin: 0, screen: 0, outro: 0 });
  const steps = showcaseSteps(5);
  assert.equal(steps.length, 6); assert.equal(validateOffsets(steps), true);
  const mid = (steps[0] + steps[1]) / 2;
  const half = showcaseFrame(mid + (steps[1] - steps[0]) * 0.25, 5);
  assert.ok(Math.abs(half.spin - 0.5) < 1e-9); assert.equal(half.screen, 1);
  const end = showcaseFrame(1, 5);
  assert.equal(end.spin, 4); assert.equal(end.screen, 4); assert.equal(end.outro, 1); assert.equal(end.intro, 1);
  for (const value of [NaN, -1, 2]) { const frame = showcaseFrame(value, 5); assert.ok(Number.isFinite(frame.spin) && frame.screen >= 0 && frame.screen <= 4); }
  let last = -1; for (let p = 0; p <= 1; p += 0.01) { const { spin } = showcaseFrame(p, 5); assert.ok(spin >= last - 1e-9); last = spin; }
  assert.deepEqual(showcaseFrame(0.5, 1), { intro: 1, spin: 0, screen: 0, outro: 0 });
});
