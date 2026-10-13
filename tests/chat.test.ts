import { test } from "node:test";
import assert from "node:assert/strict";
import { MAX_REQUEST_BYTES, normalizeMessages, parseStoredHistory, requestTurns, whatsappSummary, type ChatMessage } from "../lib/chat.ts";
test("rechaza null, roles desconocidos y turnos corruptos", () => {
  for(const value of [null, [], [null], [{role:"admin",text:"x"}], [{role:"model",text:"x"}], [{role:"user",text:""}], [{role:"user",text:"x"},{role:"user",text:"y"}]]) assert.equal(normalizeMessages(value),null);
});
test("límites exactos sin truncar respuestas anteriores", () => {
  assert.ok(normalizeMessages([{role:"user",text:"x".repeat(1200)}]));
  assert.equal(normalizeMessages([{role:"user",text:"x".repeat(1201)}]),null);
  const data = normalizeMessages([{role:"user",text:"Hola"}, {role:"model",text:"Respuesta completa. ".repeat(200)}, {role:"user",text:"Gracias"}]);
  assert.ok(data); assert.equal(data[1].text.length, "Respuesta completa. ".repeat(200).trim().length);
});
test("un reintento no crea turnos user consecutivos", () => {
  const history = [{id:"1",role:"user" as const,text:"A"},{id:"2",role:"model" as const,text:"B"},{id:"3",role:"user" as const,text:"C",failed:true},{id:"4",role:"model" as const,text:"Error",error:true}];
  const request=requestTurns(history,{id:"5",role:"user",text:"C"});
  assert.ok(normalizeMessages(request)); assert.equal(request.length,3);
});
test("storage corrupto y límite de contexto", () => {
  assert.deepEqual(parseStoredHistory("{broken"),[]);
  assert.deepEqual(parseStoredHistory('[null,{"role":"model","text":"orphan"}]'),[]);
  const history=Array.from({length:20},(_,i)=>({id:String(i),role:i%2===0?"user":"model",text:"mensaje"}));
  assert.equal(parseStoredHistory(JSON.stringify(history)).length,12);
});
test("WhatsApp sólo contiene mensajes válidos, resumidos", () => {
  const text=whatsappSummary([{id:"1",role:"user",text:"Quiero\nuna tienda"},{id:"2",role:"model",text:"interno"},{id:"3",role:"user",text:"fallido",failed:true}]);
  assert.match(text,/Quiero una tienda/); assert.doesNotMatch(text,/interno|fallido/);
});
test("historial largo respeta bytes sin truncar mensajes ni romper turnos", () => {
  const history: ChatMessage[] = Array.from({length:6},(_,index) => [
    {id:"u"+index,role:"user" as const,text:"Quiero revisar el catálogo."},
    {id:"m"+index,role:"model" as const,text:"Información del catálogo. 👩🏽‍💻 ".repeat(200)},
  ]).flat();
  const latest: ChatMessage = {id:"latest",role:"user",text:"¿Y los pedidos?"};
  const request = requestTurns(history,latest);
  assert.ok(new TextEncoder().encode(JSON.stringify({messages:request})).byteLength<=MAX_REQUEST_BYTES);
  assert.ok(normalizeMessages(request));
  assert.equal(request.at(-1)?.text,latest.text);
  assert.equal(request.at(-2)?.text,history.at(-1)?.text);
  assert.equal(history.length,12);
});

