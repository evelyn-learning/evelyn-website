import assert from "node:assert/strict";
import { ALWAYS_ROLES, MODEL_FOR, assertKeys, callModel, costOf, redact, runKeyCheck, vendorOfModel } from "./models";
import { assertSchemaSupported, isStrictSchema, parseJsonReply, validate } from "./schema";
import type { ModelCall, Role } from "./types";
import { sameModel } from "./vendors/anthropic";

// Fake keys for this process only: every request goes to a fake fetch.
for (const k of ["ANTHROPIC_API_KEY", "OPENAI_API_KEY", "DEEPSEEK_API_KEY", "GEMINI_API_KEY"]) process.env[k] = "test-key";
delete process.env.KEYSTONE_PIPELINE_LIVE;

type Canned = { status: number; body: unknown } | Error;
type Seen = { url: string; body: any; headers: Headers };

function fakeFetch(replies: Canned[]) {
  const seen: Seen[] = [];
  const fn = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    seen.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null, headers: new Headers(init?.headers) });
    const r = replies[Math.min(seen.length - 1, replies.length - 1)];
    if (r instanceof Error) throw r;
    return new Response(JSON.stringify(r.body), { status: r.status, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  return { fn, seen };
}

const schema = { type: "object", properties: { ok: { type: "boolean" }, n: { type: "number" } }, required: ["ok"], additionalProperties: false };
const call = (role: Role, extra: Partial<ModelCall> = {}): ModelCall => ({ role, system: "sys", user: "reply with json", schema, ...extra });
const deps = (fn: typeof fetch) => ({ fetch: fn, backoffMs: 0 });

const anthropicMsg = (content: unknown[], stop_reason = "end_turn", usage = { input_tokens: 1000, output_tokens: 500 }, extra = {}) =>
  ({ status: 200, body: { id: "msg_1", type: "message", role: "assistant", model: MODEL_FOR.solver1.model, content, stop_reason, stop_sequence: null, usage, ...extra } });
const openaiMsg = (message: Record<string, unknown>, finish_reason = "stop", usage = { prompt_tokens: 2000, completion_tokens: 300 }) =>
  ({ status: 200, body: { id: "c1", object: "chat.completion", created: 1, model: MODEL_FOR.solver2.model, choices: [{ index: 0, message: { role: "assistant", content: null, ...message }, finish_reason }], usage } });
const geminiMsg = (body: Record<string, unknown>) => ({ status: 200, body: { usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 20, thoughtsTokenCount: 30 }, modelVersion: MODEL_FOR.intake.model, ...body } });
const geminiText = (text: string, finishReason = "STOP") => geminiMsg({ candidates: [{ content: { role: "model", parts: [{ text }] }, finishReason }] });

// schema validator
{
  assert.equal(validate({ ok: true }, schema), null);
  assert.match(validate({}, schema)!, /missing required field "ok"/);
  assert.match(validate({ ok: "yes" }, schema)!, /\$\.ok: expected boolean/);
  assert.match(validate({ ok: true, x: 1 }, schema)!, /unexpected field "x"/);
  const s2 = { type: "array", items: { type: "object", properties: { k: { enum: ["a", "b"] }, v: { type: ["string", "null"] } }, required: ["k"] } };
  assert.equal(validate([{ k: "a", v: null }, { k: "b", v: "x", extra: 1 }], s2), null, "extra allowed without additionalProperties:false");
  assert.match(validate([{ k: "c" }], s2)!, /\$\[0\]\.k: "c" is not one of/);
  assert.match(validate("x", { type: "number" })!, /expected number, got string/);
  assert.match(validate(1.5, { type: "integer" })!, /expected integer/);
  // own properties only: nothing comes from the prototype chain
  assert.match(validate(JSON.parse('{"ok":true,"constructor":1}'), schema)!, /unexpected field "constructor"/);
  const ts = { type: "object", properties: { toString: { type: "string" } }, required: ["toString"], additionalProperties: false };
  assert.match(validate({}, ts)!, /missing required field "toString"/);
  assert.match(validate(new Date(), { type: "object" })!, /expected object/, "non-plain object rejected");
  // the supported subset, additionalProperties:false on every object
  assert.doesNotThrow(() => assertSchemaSupported(schema));
  assert.doesNotThrow(() => assertSchemaSupported({ type: "array", items: { type: "object", properties: { k: { type: "string", enum: ["a"] }, v: { type: ["string", "null"], description: "d" } }, required: ["k"], additionalProperties: false } }));
  assert.throws(() => assertSchemaSupported({ type: "object", properties: { a: { anyOf: [{ type: "string" }] } }, additionalProperties: false }), /anyOf.*\$\.properties\.a/);
  assert.throws(() => assertSchemaSupported({ type: "array", items: { type: "string" }, minItems: 1 }), /minItems/);
  assert.throws(() => assertSchemaSupported({ type: "object", properties: {} }), /additionalProperties: false/);
  assert.throws(() => assertSchemaSupported({ type: "array", items: { type: "object", properties: {}, additionalProperties: true } }), /additionalProperties: false/);
  assert.throws(() => assertSchemaSupported({ type: "date" }), /type "date"/);
  // every node with properties/required/items/enum names its type
  assert.throws(() => assertSchemaSupported({ properties: { a: { type: "string" } }, additionalProperties: false }), /needs an explicit type/);
  assert.throws(() => assertSchemaSupported({ type: "object", properties: { a: { enum: ["x"] } }, additionalProperties: false }), /needs an explicit type.*\$\.properties\.a/);
  assert.throws(() => assertSchemaSupported({ items: { type: "string" } }), /needs an explicit type/);
  assert.equal(isStrictSchema({ type: "object", properties: { ok: { type: "boolean" } }, required: ["ok"], additionalProperties: false }), true);
  assert.equal(isStrictSchema(schema), false, "optional n → not strict");
  assert.equal(isStrictSchema({ type: "array", items: { type: "object", properties: {}, required: [] } }), false, "no additionalProperties:false");
}

// JSON reply parsing: one fence stripped, otherwise pure JSON only
{
  assert.deepEqual(parseJsonReply('{"ok":true}'), { ok: true, value: { ok: true } });
  assert.deepEqual(parseJsonReply('```json\n{"ok":true}\n```'), { ok: true, value: { ok: true } });
  assert.deepEqual(parseJsonReply('  ```\n{"ok":true}\n```  '), { ok: true, value: { ok: true } });
  assert.equal(parseJsonReply('Here you go:\n```json\n{"ok":true}\n```\nDone.').ok, false, "prose around a fence is rejected");
  assert.equal(parseJsonReply('Sure! {"ok":true}').ok, false);
  assert.deepEqual(parseJsonReply('{"md":"```js\\nx\\n```"}'), { ok: true, value: { md: "```js\nx\n```" } }, "``` inside a JSON string");
}

// MODEL_FOR: vendor by role (spec §5, §12)
{
  const want: Record<Role, string> = { solver1: "anthropic", author: "anthropic", solver2: "openai", working: "openai", audit: "openai", solver3Text: "deepseek", solver3Image: "gemini", compare: "gemini", intake: "gemini", animator: "anthropic" };
  for (const [r, v] of Object.entries(want)) assert.equal(MODEL_FOR[r as Role].vendor, v, r);
  for (const spec of Object.values(MODEL_FOR)) assert.ok(spec.model && spec.pricePerMTokIn > 0 && spec.pricePerMTokOut > 0);
}

// assertKeys names the missing variables; GEMINI falls back to NEXT_PUBLIC_GEMINI_API_KEY
{
  const saved = { ...process.env };
  delete process.env.DEEPSEEK_API_KEY;
  delete process.env.GEMINI_API_KEY;
  assert.throws(() => assertKeys(), /DEEPSEEK_API_KEY.*GEMINI_API_KEY|GEMINI_API_KEY.*DEEPSEEK_API_KEY/);
  assert.doesNotThrow(() => assertKeys(["solver1", "solver2"]));
  process.env.NEXT_PUBLIC_GEMINI_API_KEY = "test-key";
  assert.doesNotThrow(() => assertKeys(["intake"]));
  assert.throws(() => assertKeys(["solver3Text"]), (e: Error) => e.message.includes("DEEPSEEK_API_KEY") && !e.message.includes("GEMINI"));
  process.env.DEEPSEEK_API_KEY = saved.DEEPSEEK_API_KEY;
  process.env.GEMINI_API_KEY = saved.GEMINI_API_KEY;
  delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;
}

async function main() {
  // live switch: no injected fetch and KEYSTONE_PIPELINE_LIVE unset → throws
  await assert.rejects(callModel(call("solver1")), /live model calls are off/);

  // cost = tokensIn/1e6*priceIn + tokensOut/1e6*priceOut
  {
    const spec = MODEL_FOR.solver1;
    assert.equal(costOf(spec, 1000, 500), 1000 / 1e6 * spec.pricePerMTokIn + 500 / 1e6 * spec.pricePerMTokOut);
    const f = fakeFetch([anthropicMsg([{ type: "text", text: '{"ok":true}' }])]);
    const r = await callModel<{ ok: boolean }>(call("solver1"), deps(f.fn));
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.deepEqual(r.value, { ok: true });
      assert.equal(r.cost, costOf(spec, 1000, 500));
      assert.equal(r.model, spec.model);
      assert.ok(r.ms >= 0);
    }
    // request shape: model, system, JSON-schema output format
    const b = f.seen[0].body;
    assert.equal(b.model, spec.model);
    assert.equal(b.system, "sys");
    assert.deepEqual(b.output_config.format, { type: "json_schema", schema });
    assert.equal(f.seen[0].headers.get("x-api-key"), "test-key");
  }

  // animator role: Claude, the tier's model; cached system parts, a larger output limit, token use reported and
  // cache writes / reads priced at 1.25× / 0.1× the input rate
  {
    const spec = MODEL_FOR.animator;
    assert.equal(spec.model, MODEL_FOR.author.model, "animator follows the Claude tier");
    const usage = { input_tokens: 200, output_tokens: 500, cache_creation_input_tokens: 3000, cache_read_input_tokens: 5000 };
    const f = fakeFetch([anthropicMsg([{ type: "text", text: '{"ok":true}' }], "end_turn", usage)]);
    const r = await callModel<{ ok: boolean }>(call("animator", { system: "a\n\nb", systemParts: ["a", "b"], maxTokens: 32000 }), deps(f.fn));
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.deepEqual(r.tokens, { in: 8200, out: 500, cacheWrite: 3000, cacheRead: 5000 });
      const want = ((200 + 3000 * 1.25 + 5000 * 0.1) / 1e6) * spec.pricePerMTokIn + (500 / 1e6) * spec.pricePerMTokOut;
      assert.ok(Math.abs(r.cost - want) < 1e-12, `cache-aware cost (${r.cost} vs ${want})`);
    }
    const b = f.seen[0].body;
    assert.equal(b.max_tokens, 32000);
    assert.deepEqual(b.system, [
      { type: "text", text: "a", cache_control: { type: "ephemeral" } },
      { type: "text", text: "b", cache_control: { type: "ephemeral" } },
    ]);
    // without the options the request is as before
    const g = fakeFetch([anthropicMsg([{ type: "text", text: '{"ok":true}' }])]);
    const r2 = await callModel<{ ok: boolean }>(call("solver1"), deps(g.fn));
    assert.equal(g.seen[0].body.max_tokens, 16000);
    if (r2.ok) assert.deepEqual(r2.tokens, { in: 1000, out: 500, cacheWrite: 0, cacheRead: 0 });
  }

  // anthropic: reply that is not JSON → shape (cost still counted)
  {
    const f = fakeFetch([anthropicMsg([{ type: "text", text: "I think the answer is B." }])]);
    const r = await callModel(call("author"), deps(f.fn));
    assert.equal(r.ok, false);
    if (!r.ok) { assert.equal(r.reason, "shape"); assert.ok(r.cost > 0); }
  }

  // anthropic: empty content → empty
  {
    const f = fakeFetch([anthropicMsg([])]);
    const r = await callModel(call("solver1"), deps(f.fn));
    assert.equal(!r.ok && r.reason, "empty");
  }

  // anthropic: stop_reason refusal → refusal
  {
    const f = fakeFetch([anthropicMsg([], "refusal", undefined, { stop_details: { type: "refusal", category: "cyber", explanation: "x" } })]);
    const r = await callModel(call("solver1"), deps(f.fn));
    assert.equal(!r.ok && r.reason, "refusal");
    assert.equal(f.seen.length, 1, "refusal not retried");
  }

  // anthropic: HTTP 529 then 200 → ok, fetch called twice
  {
    const overloaded = { status: 529, body: { type: "error", error: { type: "overloaded_error", message: "Overloaded" } } };
    const f = fakeFetch([overloaded, anthropicMsg([{ type: "text", text: '{"ok":false}' }])]);
    const r = await callModel(call("solver1"), deps(f.fn));
    assert.equal(r.ok, true);
    assert.equal(f.seen.length, 2);

    // HTTP 529 every time → transport after MAX_ATTEMPTS (4) calls, marked transient
    const g = fakeFetch([overloaded, overloaded]);
    const r2 = await callModel(call("solver1"), deps(g.fn));
    assert.equal(!r2.ok && r2.reason, "transport");
    assert.equal(g.seen.length, 4, "529: four attempts");
    if (!r2.ok) { assert.equal(r2.cost, 0); assert.match(r2.detail, /529/); assert.equal(r2.transient, true, "529 exhausted: transient"); }
  }

  // anthropic: images go as base64 image blocks before the text
  {
    const f = fakeFetch([anthropicMsg([{ type: "text", text: '{"ok":true}' }])]);
    await callModel(call("solver1", { images: [{ mime: "image/png", data: new Uint8Array([1, 2, 3]) }] }), deps(f.fn));
    const content = f.seen[0].body.messages[0].content;
    assert.deepEqual(content[0], { type: "image", source: { type: "base64", media_type: "image/png", data: "AQID" } });
    assert.deepEqual(content[1], { type: "text", text: "reply with json" });
    // an image type Claude cannot take → shape, no HTTP
    const g = fakeFetch([anthropicMsg([{ type: "text", text: '{"ok":true}' }])]);
    const r = await callModel(call("solver1", { images: [{ mime: "image/heic", data: new Uint8Array([1]) }] }), deps(g.fn));
    assert.equal(!r.ok && r.reason, "shape");
    if (!r.ok) assert.equal(r.detail, "unsupported image type image/heic");
    assert.equal(g.seen.length, 0);
  }

  // openai: JSON missing a required field → shape
  {
    const f = fakeFetch([openaiMsg({ content: '{"n":3}' })]);
    const r = await callModel(call("solver2"), deps(f.fn));
    assert.equal(r.ok, false);
    if (!r.ok) { assert.equal(r.reason, "shape"); assert.match(r.detail, /"ok"/); assert.equal(r.cost, costOf(MODEL_FOR.solver2, 2000, 300)); }
    const b = f.seen[0].body;
    assert.equal(b.model, MODEL_FOR.solver2.model);
    assert.equal(b.response_format.type, "json_schema");
    assert.deepEqual(b.response_format.json_schema.schema, schema);
    assert.equal(b.response_format.json_schema.strict, false, "optional field → not strict");
  }

  // openai: message.refusal and finish_reason content_filter → refusal
  {
    const f = fakeFetch([openaiMsg({ refusal: "I can't help with that." })]);
    const r = await callModel(call("working"), deps(f.fn));
    assert.equal(!r.ok && r.reason, "refusal");
    const g = fakeFetch([openaiMsg({ content: "" }, "content_filter")]);
    const r2 = await callModel(call("audit"), deps(g.fn));
    assert.equal(!r2.ok && r2.reason, "refusal");
  }

  // openai: fenced JSON accepted; images as data URLs; network error then 200 → retried
  {
    const f = fakeFetch([new TypeError("fetch failed"), openaiMsg({ content: '```json\n{"ok":true}\n```' })]);
    const r = await callModel(call("solver2", { images: [{ mime: "image/jpeg", data: new Uint8Array([255]) }] }), deps(f.fn));
    assert.equal(r.ok, true);
    assert.equal(f.seen.length, 2);
    const parts = f.seen[1].body.messages[1].content;
    assert.deepEqual(parts[1], { type: "image_url", image_url: { url: "data:image/jpeg;base64,/w==" } });
  }

  // openai: HTTP 400 is not retried
  {
    const f = fakeFetch([{ status: 400, body: { error: { message: "bad", type: "invalid_request_error" } } }]);
    const r = await callModel(call("solver2"), deps(f.fn));
    assert.equal(!r.ok && r.reason, "transport");
    assert.equal(f.seen.length, 1);
  }

  // deepseek: images → shape without any HTTP; text goes to DeepSeek's base URL with json_object
  {
    const f = fakeFetch([openaiMsg({ content: '{"ok":true}' })]);
    const r = await callModel(call("solver3Text", { images: [{ mime: "image/png", data: new Uint8Array([1]) }] }), deps(f.fn));
    assert.equal(r.ok, false);
    if (!r.ok) { assert.equal(r.reason, "shape"); assert.equal(r.detail, "this model cannot read images"); }
    assert.equal(f.seen.length, 0);
    const r2 = await callModel(call("solver3Text"), deps(f.fn));
    assert.equal(r2.ok, true);
    assert.match(f.seen[0].url, /^https:\/\/api\.deepseek\.com\//);
    assert.equal(f.seen[0].body.model, MODEL_FOR.solver3Text.model);
    assert.deepEqual(f.seen[0].body.response_format, { type: "json_object" });
    assert.match(f.seen[0].body.messages[0].content, /json/i, "json_object mode needs the word json in the prompt");
  }

  // gemini: request shape, cost counts thoughts as output
  {
    const f = fakeFetch([geminiText('{"ok":true}')]);
    const r = await callModel(call("intake", { images: [{ mime: "image/png", data: new Uint8Array([1, 2, 3]) }] }), deps(f.fn));
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.cost, costOf(MODEL_FOR.intake, 100, 50));
    const s = f.seen[0];
    assert.equal(s.url, `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_FOR.intake.model}:generateContent`);
    assert.equal(s.headers.get("x-goog-api-key"), "test-key");
    assert.deepEqual(s.body.systemInstruction, { parts: [{ text: "sys" }] });
    assert.deepEqual(s.body.contents[0].parts[0], { inlineData: { mimeType: "image/png", data: "AQID" } });
    assert.equal(s.body.generationConfig.responseMimeType, "application/json");
    assert.deepEqual(s.body.generationConfig.responseJsonSchema, schema);
  }

  // gemini: finishReason SAFETY and a blocked prompt → refusal; no candidates → empty
  {
    const f = fakeFetch([geminiText("", "SAFETY")]);
    assert.equal(((await callModel(call("compare"), deps(f.fn))) as { reason?: string }).reason, "refusal");
    const g = fakeFetch([geminiMsg({ promptFeedback: { blockReason: "PROHIBITED_CONTENT" } })]);
    assert.equal(((await callModel(call("solver3Image"), deps(g.fn))) as { reason?: string }).reason, "refusal");
    const h = fakeFetch([geminiMsg({ candidates: [] })]);
    assert.equal(((await callModel(call("intake"), deps(h.fn))) as { reason?: string }).reason, "empty");
  }

  // gemini: 503 every time → transport after four calls; 429 then 200 → ok
  {
    const f = fakeFetch([{ status: 503, body: { error: { message: "unavailable" } } }]);
    const r = await callModel(call("intake"), deps(f.fn));
    assert.equal(!r.ok && r.reason, "transport");
    assert.equal(f.seen.length, 4, "503: four attempts");
    const g = fakeFetch([{ status: 429, body: { error: { message: "slow down" } } }, geminiText('{"ok":true}')]);
    assert.equal((await callModel(call("intake"), deps(g.fn))).ok, true);
    assert.equal(g.seen.length, 2);
  }

  // unsupported image type fails fast for every vendor, no HTTP
  for (const role of ["solver2", "intake", "author"] as Role[]) {
    const f = fakeFetch([openaiMsg({ content: '{"ok":true}' })]);
    const r = await callModel(call(role, { images: [{ mime: "image/tiff", data: new Uint8Array([1]) }] }), deps(f.fn));
    assert.equal(!r.ok && r.detail, "unsupported image type image/tiff", role);
    assert.equal(f.seen.length, 0, role);
  }

  // schema outside the subset, or an object without additionalProperties:false → throws at call time
  {
    const f = fakeFetch([openaiMsg({ content: '{"ok":true}' })]);
    await assert.rejects(callModel(call("solver2", { schema: { type: "object", properties: { ok: { anyOf: [{ type: "boolean" }] } }, additionalProperties: false } }), deps(f.fn)), /anyOf/);
    await assert.rejects(callModel(call("intake", { schema: { type: "object", properties: { ok: { type: "boolean" } } } }), deps(f.fn)), /additionalProperties: false/);
    assert.equal(f.seen.length, 0);
  }

  // shape: own properties only
  {
    const f = fakeFetch([openaiMsg({ content: '{"ok":true,"constructor":1}' })]);
    assert.equal(((await callModel(call("solver2"), deps(f.fn))) as { reason?: string }).reason, "shape");
  }

  // a 200 with a body the adapter cannot read → transport, not a throw, no retry
  {
    const html = async () => new Response("<html>gateway</html>", { status: 200, headers: { "content-type": "text/html" } });
    let n = 0;
    const counted = (async () => { n++; return html(); }) as unknown as typeof fetch;
    for (const role of ["solver1", "solver2"] as Role[]) {
      n = 0;
      const r = await callModel(call(role), deps(counted));
      assert.equal(!r.ok && r.reason, "transport", `${role} html body`);
      assert.equal(n, 1, `${role} html body not retried`);
    }
    // gemini: an unreadable 200 is a retryable transport failure in this adapter (one retry → 2 requests)
    n = 0;
    const rg = await callModel(call("intake"), deps(counted));
    assert.equal(!rg.ok && rg.reason, "transport", "gemini html body");
    assert.equal(n, 4, "gemini html body (no status: like a network error) retried up to four attempts");
    const f = fakeFetch([{ status: 200, body: { id: "c1", object: "chat.completion", created: 1, model: "m", choices: [], usage: { prompt_tokens: 1000, completion_tokens: 500 } } }]);
    const r = await callModel(call("solver2"), deps(f.fn));
    assert.equal(r.ok, false, "choices: [] is a failure");
    // M6: the usage block is readable, so the call's cost is recorded
    assert.ok(Math.abs(r.cost - costOf(MODEL_FOR.solver2, 1000, 500)) < 1e-12, `M6: unreadable 200 with readable usage is billed (${r.cost})`);
    assert.equal(f.seen.length, 1, "M6: not retried");
    const fa = fakeFetch([{ status: 200, body: { id: "msg_1", type: "message", role: "assistant", model: MODEL_FOR.solver1.model, stop_reason: "end_turn", usage: { input_tokens: 1000, output_tokens: 500 } } }]);
    const ra = await callModel(call("solver1"), deps(fa.fn));
    assert.ok(!ra.ok && Math.abs(ra.cost - costOf(MODEL_FOR.solver1, 1000, 500)) < 1e-12, `M6: anthropic content missing, usage readable: billed (${ra.cost})`);
    const g = fakeFetch([{ status: 200, body: { id: "msg_1", type: "message", role: "assistant", model: MODEL_FOR.solver1.model, content: [{ type: "text", text: '{"ok":true}' }], stop_reason: "end_turn" } }]);
    const r2 = await callModel(call("solver1"), deps(g.fn));
    assert.equal(!r2.ok && r2.reason, "transport", "missing usage");
    assert.equal(g.seen.length, 1);
  }

  // anthropic refusal fallback: text after the last fallback block, priced at the serving model, fellBack flagged
  {
    const f = fakeFetch([anthropicMsg([
      { type: "text", text: "partial from the first model" },
      { type: "fallback", from: { model: "claude-fable-5-2" }, to: { model: "claude-opus-5-5" } },
      { type: "text", text: '{"ok":true}' },
    ], "end_turn", { input_tokens: 1000, output_tokens: 500 }, { model: "claude-opus-5-5" })]);
    const r = await callModel<{ ok: boolean }>(call("solver1"), deps(f.fn));
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.deepEqual(r.value, { ok: true });
      assert.equal(r.model, "claude-opus-5-5");
      assert.equal(r.fellBack, true);
      assert.equal(r.cost, 1000 / 1e6 * 4 + 500 / 1e6 * 20, "priced at Opus 5.5 rates");
    }
    const g = fakeFetch([anthropicMsg([{ type: "text", text: '{"ok":true}' }])]);
    const r2 = await callModel(call("solver1"), deps(g.fn));
    assert.equal(r2.ok && r2.fellBack, false);
    // a dated alias of the requested model is not a fallback
    const h = fakeFetch([anthropicMsg([{ type: "text", text: '{"ok":true}' }], "end_turn", undefined, { model: `${MODEL_FOR.solver1.model}-20261101` })]);
    const r3 = await callModel(call("solver1"), deps(h.fn));
    assert.equal(r3.ok && r3.fellBack, false, "dated alias");
    if (r3.ok) assert.equal(r3.cost, costOf(MODEL_FOR.solver1, 1000, 500));
    // a fallback block sets it even when the served id is a dated alias
    const k = fakeFetch([anthropicMsg([
      { type: "fallback", from: { model: MODEL_FOR.solver1.model }, to: { model: MODEL_FOR.solver1.model } },
      { type: "text", text: '{"ok":true}' },
    ], "end_turn", undefined, { model: `${MODEL_FOR.solver1.model}-20261101` })]);
    const r4 = await callModel(call("solver1"), deps(k.fn));
    assert.equal(r4.ok && r4.fellBack, true, "fallback block");
    // a shorter id with trailing digits is a different model, not an alias
    assert.equal(sameModel("claude-fable-5-2", "claude-fable-5-2-20261101"), true);
    assert.equal(sameModel("claude-fable-5-2", "claude-fable-5"), false);
    assert.equal(sameModel("claude-fable-5-2", "claude-fable-5-1"), false);
    assert.equal(sameModel("claude-opus-5-5", "claude-opus-5"), false);
    assert.equal(sameModel("claude-sonnet-5", "claude-sonnet-5-5"), false);
    const p = fakeFetch([anthropicMsg([{ type: "text", text: '{"ok":true}' }], "end_turn", undefined, { model: "claude-fable-5" })]);
    const r6 = await callModel(call("solver1"), deps(p.fn));
    assert.equal(r6.ok && r6.fellBack, true, "served claude-fable-5");
    if (r6.ok) assert.equal(r6.cost, 1000 / 1e6 * 10 + 500 / 1e6 * 50, "priced at Fable 5 rates");
    const q = fakeFetch([anthropicMsg([{ type: "text", text: '{"ok":true}' }], "end_turn", undefined, { model: "claude-fable-5-1" })]);
    const r7 = await callModel(call("solver1"), deps(q.fn));
    assert.equal(r7.ok && r7.fellBack, true, "served claude-fable-5-1");
    // a different served model without a block is a fallback too
    const m = fakeFetch([anthropicMsg([{ type: "text", text: '{"ok":true}' }], "end_turn", undefined, { model: "claude-sonnet-5-5" })]);
    const r5 = await callModel(call("solver1"), deps(m.fn));
    assert.equal(r5.ok && r5.fellBack, true, "different model");
  }

  // redaction keeps ordinary words and field names, blanks key-shaped tokens
  {
    const d = 'unexpected field "key_steps" in keystone_item; skeleton keyboard';
    assert.equal(redact(d), d);
    assert.equal(redact("got sk-proj-****3456 here"), "got [redacted] here");
    assert.equal(redact("Authorization: Bearer abc.def"), "Authorization: [redacted]");
    assert.equal(redact("AIzaSyAbcdefgh12345"), "[redacted]");
    const f = fakeFetch([openaiMsg({ content: '{"ok":true,"key_steps":1}' })]);
    const r = await callModel(call("solver2"), deps(f.fn));
    assert.ok(!r.ok && r.detail.includes('"key_steps"'), "shape detail keeps the field name");
  }

  // a key echoed in an error message never reaches detail
  {
    const saved = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = "sk-proj-SECRETabcdef123456";
    const f = fakeFetch([{ status: 401, body: { error: { message: "Incorrect API key provided: sk-proj-SECRETabcdef123456. Also sk-proj-****3456", type: "invalid_request_error" } } }]);
    const r = await callModel(call("solver2"), deps(f.fn));
    process.env.OPENAI_API_KEY = saved;
    assert.equal(!r.ok && r.reason, "transport");
    if (!r.ok) {
      assert.ok(r.detail.includes("[redacted]"), r.detail);
      assert.ok(!r.detail.includes("SECRET") && !r.detail.includes("3456"), r.detail);
    }
  }

  // date-aware prices: Gemini doubles on 2026-12-01
  {
    const before = fakeFetch([geminiText('{"ok":true}')]);
    const r1 = await callModel(call("intake"), { ...deps(before.fn), now: new Date("2026-11-30T12:00:00Z") });
    const after = fakeFetch([geminiText('{"ok":true}')]);
    const r2 = await callModel(call("intake"), { ...deps(after.fn), now: new Date("2026-12-02T12:00:00Z") });
    assert.equal(r1.cost, 100 / 1e6 * 2 + 50 / 1e6 * 10);
    assert.equal(r2.cost, 100 / 1e6 * 4 + 50 / 1e6 * 20);
  }

  // deepseek gets an explicit max_tokens
  {
    const f = fakeFetch([openaiMsg({ content: '{"ok":true}' })]);
    await callModel(call("solver3Text"), deps(f.fn));
    assert.equal(typeof f.seen[0].body.max_tokens, "number");
  }

  // I7: transient failures: up to four attempts, 2 s / 6 s / 18 s with jitter, Retry-After honoured (capped at 60 s)
  {
    const waits: number[] = [];
    const sleep = async (ms: number) => { waits.push(ms); };
    const withHeaders = (status: number, headers: Record<string, string>) => (async () => new Response(JSON.stringify({ error: { message: "x" } }), { status, headers: { "content-type": "application/json", ...headers } })) as unknown as typeof fetch;
    // plain backoff, gemini 503 (fetch-based adapter)
    const r = await callModel(call("intake"), { fetch: withHeaders(503, {}), sleep });
    assert.equal(!r.ok && r.transient, true, "I7: exhausted 503 is transient");
    assert.equal(waits.length, 3, `I7: three waits for four attempts (${waits})`);
    [2000, 6000, 18000].forEach((base, k) => assert.ok(waits[k] >= base * 0.75 && waits[k] <= base * 1.25, `I7: wait ${k + 1} ≈ ${base} ms with jitter (${waits[k]})`));
    // Retry-After in seconds, and as an HTTP date, and capped at 60 s
    waits.length = 0;
    await callModel(call("intake"), { fetch: withHeaders(429, { "retry-after": "5" }), sleep });
    assert.deepEqual(waits, [5000, 5000, 5000], "I7: Retry-After seconds honoured");
    waits.length = 0;
    await callModel(call("intake"), { fetch: withHeaders(429, { "retry-after": "600" }), sleep });
    assert.deepEqual(waits, [60000, 60000, 60000], "I7: Retry-After capped at 60 s");
    const { retryAfterMs, backoffFor } = await import("./models");
    const now = Date.parse("2026-11-17T10:00:00Z");
    assert.equal(retryAfterMs("Tue, 17 Nov 2026 10:00:30 GMT", now), 30000, "I7: Retry-After HTTP date");
    assert.equal(retryAfterMs("garbage", now), null, "I7: unreadable Retry-After ignored");
    assert.equal(backoffFor(2, 2000, null, () => 0.5), 18000, "I7: third wait is 18 s at mid jitter");
    // SDK adapters (anthropic / openai) read the header too
    waits.length = 0;
    const r2 = await callModel(call("solver2"), { fetch: withHeaders(503, { "retry-after": "2" }), sleep });
    assert.ok(!r2.ok && r2.transient, "I7: openai 503 exhausted: transient");
    assert.deepEqual(waits, [2000, 2000, 2000], "I7: openai Retry-After honoured");
    // never retried: 400 / 401 / 403 / 404
    for (const status of [400, 401, 403, 404]) {
      for (const role of ["intake", "solver1", "solver2"] as Role[]) {
        let n = 0;
        const counted = (async () => { n++; return new Response(JSON.stringify({ error: { message: "no" } }), { status, headers: { "content-type": "application/json" } }); }) as unknown as typeof fetch;
        const rr = await callModel(call(role), { fetch: counted, sleep });
        assert.equal(n, 1, `I7: ${role} HTTP ${status} not retried`);
        assert.ok(!rr.ok && !rr.transient, `I7: ${role} HTTP ${status} is not transient`);
      }
    }
    // network errors retried, then transient
    let n = 0;
    const offline = (async () => { n++; throw new TypeError("fetch failed"); }) as unknown as typeof fetch;
    const r3 = await callModel(call("solver1"), { fetch: offline, sleep });
    assert.equal(n, 4, "I7: network error: four attempts");
    assert.ok(!r3.ok && r3.transient, "I7: network error exhausted: transient");
  }

  // --- the run's up-front key check (scripts/keystone-pipeline.ts) ---
  {
    const all = { ANTHROPIC_API_KEY: "k1", OPENAI_API_KEY: "k2", DEEPSEEK_API_KEY: "k3", GEMINI_API_KEY: "k4" };
    assert.deepEqual(runKeyCheck(all), [], "every key set: no warning");
    const noDeepseek = { ...all, DEEPSEEK_API_KEY: undefined };
    const warn = runKeyCheck(noDeepseek);
    assert.deepEqual(
      warn,
      ["No key for the tie-break solver (DEEPSEEK_API_KEY): an item whose two solvers disagree will be held for the owner instead of settled"],
      "a missing tie-break key is one loud line, not an error",
    );
    for (const gone of ["ANTHROPIC_API_KEY", "OPENAI_API_KEY", "GEMINI_API_KEY"]) {
      assert.throws(() => runKeyCheck({ ...all, [gone]: undefined }), new RegExp(gone), `a missing ${gone} blocks the run`);
    }
    assert.ok(!ALWAYS_ROLES.includes("solver3Text") && !ALWAYS_ROLES.includes("solver3Image"), "the tie-break roles are not required up front");
    let msg = "";
    try { runKeyCheck({ ...all, OPENAI_API_KEY: undefined, ANTHROPIC_API_KEY: undefined }); } catch (e) { msg = (e as Error).message; }
    assert.ok(!msg.includes("k3") && !msg.includes("k4"), "the error names variables, never values");
  }
  // --- model id -> vendor ---
  {
    for (const [role, spec] of Object.entries(MODEL_FOR)) assert.equal(vendorOfModel(spec.model), spec.vendor, `${role}: ${spec.model} maps to ${spec.vendor}`);
    assert.equal(vendorOfModel("claude-opus-5-5"), "anthropic", "a Claude fallback model is Anthropic's");
    assert.equal(vendorOfModel("mystery-9"), undefined, "an unknown model id belongs to no vendor");
  }
  console.log("models.test: ok");
}

main().catch((e) => { console.error(e); process.exit(1); });
