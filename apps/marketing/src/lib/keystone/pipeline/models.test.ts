import assert from "node:assert/strict";
import { MODEL_FOR, assertKeys, callModel, costOf } from "./models";
import { assertSchemaSupported, isStrictSchema, parseJsonReply, validate } from "./schema";
import type { ModelCall, Role } from "./types";

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
  assert.doesNotThrow(() => assertSchemaSupported({ type: "array", items: { type: "object", properties: { k: { enum: ["a"] }, v: { type: ["string", "null"], description: "d" } }, required: ["k"], additionalProperties: false } }));
  assert.throws(() => assertSchemaSupported({ type: "object", properties: { a: { anyOf: [{ type: "string" }] } }, additionalProperties: false }), /anyOf.*\$\.properties\.a/);
  assert.throws(() => assertSchemaSupported({ type: "array", items: { type: "string" }, minItems: 1 }), /minItems/);
  assert.throws(() => assertSchemaSupported({ type: "object", properties: {} }), /additionalProperties: false/);
  assert.throws(() => assertSchemaSupported({ type: "array", items: { type: "object", properties: {}, additionalProperties: true } }), /additionalProperties: false/);
  assert.throws(() => assertSchemaSupported({ type: "date" }), /type "date"/);
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
  const want: Record<Role, string> = { solver1: "anthropic", author: "anthropic", solver2: "openai", working: "openai", audit: "openai", solver3Text: "deepseek", solver3Image: "gemini", compare: "gemini", intake: "gemini" };
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

    // HTTP 529 twice → transport
    const g = fakeFetch([overloaded, overloaded]);
    const r2 = await callModel(call("solver1"), deps(g.fn));
    assert.equal(!r2.ok && r2.reason, "transport");
    assert.equal(g.seen.length, 2);
    if (!r2.ok) { assert.equal(r2.cost, 0); assert.match(r2.detail, /529/); }
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

  // gemini: 503 twice → transport after two calls; 429 then 200 → ok
  {
    const f = fakeFetch([{ status: 503, body: { error: { message: "unavailable" } } }]);
    const r = await callModel(call("intake"), deps(f.fn));
    assert.equal(!r.ok && r.reason, "transport");
    assert.equal(f.seen.length, 2);
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
    const f = fakeFetch([{ status: 200, body: { id: "c1", object: "chat.completion", created: 1, model: "m", choices: [], usage: { prompt_tokens: 1, completion_tokens: 1 } } }]);
    const r = await callModel(call("solver2"), deps(f.fn));
    assert.equal(r.ok, false, "choices: [] is a failure");
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

  console.log("models.test: ok");
}

main().catch((e) => { console.error(e); process.exit(1); });
