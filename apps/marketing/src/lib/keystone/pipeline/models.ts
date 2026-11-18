// The pipeline's one door to the models: callModel(role, system, user, images,
// schema) → the reply as JSON matching the schema, with its cost, or a typed
// failure. Later pipeline steps never talk to a vendor SDK directly.
// No `next/*` imports: this runs from tsx scripts on a laptop too.

import type { ModelCall, ModelDeps, ModelReply, ModelSpec, Role, Vendor } from "./types";
import { parseJsonReply, validate } from "./schema";
import { InputError, TransportError, type VendorReply } from "./vendors/common";
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
  // page says this DOUBLES to $4 / $20 on 2026-12-01 — update then.
  // Checked 2026-11-17: https://aistudio.google.com/docs/models/gemini-4-carbon
  // and https://aistudio.google.com/docs/pricing
  vendor: "gemini", model: "gemini-4-carbon", pricePerMTokIn: 2, pricePerMTokOut: 10,
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

export function costOf(spec: ModelSpec, tokensIn: number, tokensOut: number): number {
  return (tokensIn / 1e6) * spec.pricePerMTokIn + (tokensOut / 1e6) * spec.pricePerMTokOut;
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
  if (process.env.KEYSTONE_PIPELINE_LIVE !== "1" && !deps.fetch) throw new Error("live model calls are off");
  const spec = MODEL_FOR[call.role];
  if (!spec) throw new Error(`unknown role ${String(call.role)}`);
  if (spec.vendor === "deepseek" && call.images?.length) {
    return { ok: false, reason: "shape", detail: "this model cannot read images", cost: 0, model: spec.model };
  }
  assertKeys([call.role]);
  const key = keyFor(spec.vendor)!;
  const started = Date.now();

  let reply: VendorReply | undefined;
  for (let attempt = 0; ; attempt++) {
    try {
      reply = await send(spec, call, key, deps.fetch);
      break;
    } catch (e) {
      if (e instanceof InputError) return { ok: false, reason: "shape", detail: e.message, cost: 0, model: spec.model };
      if (!(e instanceof TransportError)) throw e;
      if (e.retryable && attempt === 0) {
        await sleep(deps.backoffMs ?? 2000);
        continue;
      }
      return { ok: false, reason: "transport", detail: e.message, cost: 0, model: spec.model };
    }
  }

  const cost = costOf(spec, reply.tokensIn, reply.tokensOut);
  const model = reply.model || spec.model;
  const fail = (reason: "shape" | "refusal" | "empty", detail: string): ModelReply<T> => ({ ok: false, reason, detail, cost, model });

  if (reply.refusal !== undefined) return fail("refusal", reply.refusal || "refused");
  if (!reply.text.trim()) return fail("empty", reply.truncated ? "no text before the output token limit" : "no text in reply");
  const parsed = parseJsonReply(reply.text);
  if (!parsed.ok) return fail("shape", reply.truncated ? `${parsed.detail} (hit the output token limit)` : parsed.detail);
  const err = validate(parsed.value, call.schema);
  if (err) return fail("shape", err);
  return { ok: true, value: parsed.value as T, cost, model, ms: Date.now() - started };
}
