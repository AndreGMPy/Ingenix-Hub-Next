import { test } from "node:test";
import assert from "node:assert/strict";
import { clamp01, validRange, validateOffsets } from "../lib/motion.ts";
test("rangos finitos y ordenados, incluyendo extremos", () => {
  assert.equal(validRange(0,1),true);
  for(const [start,end] of [[0,0],[1,0],[NaN,1],[0,Infinity]]) assert.equal(validRange(start,end),false);
  assert.equal(validateOffsets([0,.3,.8,1]),true);
  for(const values of [[-.05,0,.3],[.8,1,.95],[0,NaN,1],[0,Infinity],[0,0,1]]) assert.equal(validateOffsets(values),false);
  assert.equal(clamp01(-1),0); assert.equal(clamp01(2),1); assert.equal(clamp01(NaN),0);
});

