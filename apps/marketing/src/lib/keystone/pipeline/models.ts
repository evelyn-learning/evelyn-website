// The pipeline's one door to the models: callModel(role, system, user, images,
// schema) → the reply as JSON matching the schema, with its cost, or a typed
// failure. Later pipeline steps never talk to a vendor SDK directly.
// No `next/*` imports: this runs from tsx scripts on a laptop too.

import type { ModelCall, ModelDeps, ModelFailureReason, ModelReply, ModelSpec, Role, Vendor } from "./types";
import { assertSchemaSupported, parseJsonReply, validate } from "./schema";
import { IMAGE_TYPES, TransportError, type VendorReply } from "./vendors/common";
import { callAnthropic } from "./vendors/anthropic";
import { callOpenAICompatible } from "./vendors/openai";
import { callGemini } from "./vendors/gemini";

export type { ModelCall, ModelReply, Role } from "./types";

// Model per role. Prices are USD per million tokens at the vendor's standard
// (non-batch, short-context) rate. Checked 2026-11-17 against each source URL.
const ANTHROPIC: ModelSpec = {
  // Claude Fable 5.2 — Anthropic's most capable widely released model; $8 in / $40 out.
  // Source: claude-api skill model table (cached 2026-11-03), checked 2026-11-17;
  // https://platform.claude.com/docs/en/about-claude/pricing
  vendor: "anthropic", model: "claude-fable-5-2", pricePerMTokIn: 8, pricePerMTokOut: 40,
};
const OPENAI: ModelSpec = {
  // GPT-6.2 Astra — "our most capable model"; text+image in, structured outputs,
  // reasoning, Chat Completions supported; $8 in / $40 out (<272K input).
  // Checked 2026-11-17: https://developers.openai.com/api/docs/models/gpt-6.2-astra
  // and https://developers.openai.com/api/docs/pricing
  vendor: "openai", model: "gpt-6.2-astra", pricePerMTokIn: 8, pricePerMTokOut: 40,
};
const DEEPSEEK: ModelSpec = {
  // DeepSeek V4 Pro — thinking on by default, text only (no vision), JSON output
  // via response_format json_object. PEAK rates (cache miss) $1.32 in / $3.96 out;
  // off-peak is half, so cost here is an upper bound.
  // Checked 2026-11-17: https://api-docs.deepseek.com/quick_start/pricing
  // and https://api-docs.deepseek.com/guides/thinking_mode
  vendor: "deepseek", model: "deepseek-v4-pro", pricePerMTokIn: 1.32, pricePerMTokOut: 3.96,
};
const GEMINI: ModelSpec = {
  // Gemini 4 Carbon — strongest model in the stable Gemini 4 family; text/image/PDF
  // in, structured outputs, thinking. $2 in / $10 out (<=200K prompt); the pricing
  // page says this DOUBLES to $4 / $20 on 2026-12-01 (priceChanges below).
  // Checked 2026-11-17: https://aistudio.google.com/docs/models/gemini-4-carbon
  // and https://aistudio.google.com/docs/pricing
  vendor: "gemini", model: "gemini-4-carbon", pricePerMTokIn: 2, pricePerMTokOut: 10,
  priceChanges: [{ from: "2026-12-01", pricePerMTokIn: 4, pricePerMTokOut: 20 }],
};

// Rates for the Claude models Anthropic's refusal fallback may serve a reply
// with, so a fallen-back reply is priced at the serving model's rates. An
// unknown serving model is priced at the requested model's rates.
// Source: claude-api skill (bundled 2.1.326) model table in SKILL.md and
// shared/models.md, checked 2026-11-17: Opus 5.5 $4/$20, Opus 5 and Opus 4.8
// $5/$25, Sonnet 5.5 and Sonnet 5 $2/$10, Fable 5.1 $10/$50 ("the same per-token
// price" as Fable 5; Fable 5.2 is "at a lower price ($8 / $40)").
const CLAUDE_FALLBACK_PRICES: Record<string, { pricePerMTokIn: number; pricePerMTokOut: number }> = {
  "claude-opus-5-5": { pricePerMTokIn: 4, pricePerMTokOut: 20 },
  "claude-opus-5": { pricePerMTokIn: 5, pricePerMTokOut: 25 },
  "claude-opus-4-8": { pricePerMTokIn: 5, pricePerMTokOut: 25 },
  "claude-sonnet-5-5": { pricePerMTokIn: 2, pricePerMTokOut: 10 },
  "claude-sonnet-5": { pricePerMTokIn: 2, pricePerMTokOut: 10 },
  "claude-fable-5-1": { pricePerMTokIn: 10, pricePerMTokOut: 50 },
};

export const MODEL_FOR: Record<Role, ModelSpec> = {
  solver1: ANTHROPIC,
  author: ANTHROPIC,
  solver2: OPENAI,
  working: OPENAI,
  audit: OPENAI,
  solver3Text: DEEPSEEK,
  solver3Image: GEMINI,
  compare: GEMINI,
  intake: GEMINI,
};

const ALL_ROLES = Object.keys(MODEL_FOR) as Role[];

/** Env variable names per vendor, first match wins. */
const KEY_ENV: Record<Vendor, string[]> = {
  anthropic: ["ANTHROPIC_API_KEY"],
  openai: ["OPENAI_API_KEY"],
  deepseek: ["DEEPSEEK_API_KEY"],
  gemini: ["GEMINI_API_KEY", "NEXT_PUBLIC_GEMINI_API_KEY"],
};

function keyFor(vendor: Vendor): string | undefined {
  for (const name of KEY_ENV[vendor]) {
    const v = process.env[name];
    if (v) return v;
  }
  return undefined;
}

/** Throws, naming the missing variables (never their values), when any key the
 * given roles need is absent. Scripts call this before doing any work. */
export function assertKeys(roles: Role[] = ALL_ROLES): void {
  const vendors = [...new Set(roles.map((r) => MODEL_FOR[r].vendor))];
  const missing = vendors.filter((v) => !keyFor(v)).map((v) => KEY_ENV[v].join(" or "));
  if (missing.length) throw new Error(`missing API key env: ${missing.join(", ")}`);
}

/** The spec's prices in force at `now` (the latest priceChanges entry whose day has begun, UTC). */
export function pricesAt(spec: ModelSpec, now: Date = new Date()): { pricePerMTokIn: number; pricePerMTokOut: number } {
  let p = { pricePerMTokIn: spec.pricePerMTokIn, pricePerMTokOut: spec.pricePerMTokOut };
  let from = "";
  const today = now.toISOString().slice(0, 10);
  for (const c of spec.priceChanges ?? []) {
    if (c.from <= today && c.from >= from) { p = c; from = c.from; }
  }
  return p;
}

export function costOf(spec: ModelSpec, tokensIn: number, tokensOut: number, now?: Date): number {
  const p = pricesAt(spec, now);
  return (tokensIn / 1e6) * p.pricePerMTokIn + (tokensOut / 1e6) * p.pricePerMTokOut;
}

/** Remove configured key values, and key-shaped tokens (sk-…, AIza…, Bearer …),
 * from text that leaves this module. Ordinary words and field names are kept. */
export function redact(text: string): string {
  let out = text;
  for (const names of Object.values(KEY_ENV)) {
    for (const name of names) {
      const v = process.env[name];
      if (v && v.length >= 8) out = out.split(v).join("[redacted]");
    }
  }
  return out.replace(/\b(?:sk-|AIza)[A-Za-z0-9_*.-]{8,}/g, "[redacted]").replace(/\bBearer\s+\S+/gi, "[redacted]");
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function send(spec: ModelSpec, call: ModelCall, key: string, f: typeof fetch | undefined): Promise<VendorReply> {
  switch (spec.vendor) {
    case "anthropic": return callAnthropic(spec, call, key, f);
    case "openai": return callOpenAICompatible(spec, call, key, f, "openai");
    case "deepseek": return callOpenAICompatible(spec, call, key, f, "deepseek");
    case "gemini": return callGemini(spec, call, key, f);
  }
}

export async function callModel<T>(call: ModelCall, deps: ModelDeps = {}): Promise<ModelReply<T>> {
  // Throws only for programmer/config errors: live switch, unknown role, bad schema, missing key.
  if (process.env.KEYSTONE_PIPELINE_LIVE !== "1" && !deps.fetch) throw new Error("live model calls are off");
  const spec = MODEL_FOR[call.role];
  if (!spec) throw new Error(`unknown role ${String(call.role)}`);
  assertSchemaSupported(call.schema);
  assertKeys([call.role]);
  const key = keyFor(spec.vendor)!;

  const failed = (reason: ModelFailureReason, detail: string, cost = 0, model = spec.model): ModelReply<T> =>
    ({ ok: false, reason, detail: redact(detail), cost, model });

  if (call.images?.length) {
    if (spec.vendor === "deepseek") return failed("shape", "this model cannot read images");
    const bad = call.images.find((img) => !(IMAGE_TYPES as readonly string[]).includes(img.mime));
    if (bad) return failed("shape", `unsupported image type ${bad.mime}`);
  }

  const started = Date.now();
  let reply: VendorReply | undefined;
  for (let attempt = 0; ; attempt++) {
    try {
      reply = await send(spec, call, key, deps.fetch);
      break;
    } catch (e) {
      if (e instanceof TransportError) {
        if (e.retryable && attempt === 0) {
          await sleep(deps.backoffMs ?? 2000);
          continue;
        }
        return failed("transport", e.message);
      }
      // Anything else from an adapter (an unreadable 200, a missing field): no retry.
      return failed("transport", `${spec.vendor}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const model = reply.model || spec.model;
  const fellBack = reply.fellBack ?? false;
  const served = fellBack ? CLAUDE_FALLBACK_PRICES[model] : undefined;
  const cost = costOf(served ? { ...spec, ...served, priceChanges: undefined } : spec, reply.tokensIn, reply.tokensOut, deps.now);

  if (reply.refusal !== undefined) return failed("refusal", reply.refusal || "refused", cost, model);
  if (!reply.text.trim()) return failed("empty", reply.truncated ? "no text before the output token limit" : "no text in reply", cost, model);
  const parsed = parseJsonReply(reply.text);
  if (!parsed.ok) return failed("shape", reply.truncated ? `${parsed.detail} (hit the output token limit)` : parsed.detail, cost, model);
  const err = validate(parsed.value, call.schema);
  if (err) return failed("shape", err, cost, model);
  return { ok: true, value: parsed.value as T, cost, model, ms: Date.now() - started, fellBack };
}
