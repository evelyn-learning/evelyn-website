// The pipeline's one door to the models: callModel(role, system, user, images,
// schema) → the reply as JSON matching the schema, with its cost, or a typed
// failure. Later pipeline steps never talk to a vendor SDK directly.
// No `next/*` imports: this runs from tsx scripts on a laptop too.

import type { BatchServe, ModelCall, ModelDeps, ModelFailureReason, ModelReply, ModelSpec, Role, TokenUse, Vendor } from "./types";
import { batchBody, pollBatch, submitBatch, type BatchPoll, type BatchRequest, type BatchVendor } from "./vendors/batch";
import { assertSchemaSupported, parseJsonReply, validate } from "./schema";
import { IMAGE_TYPES, TransportError, UnreadableReply, retryableStatus, type VendorReply } from "./vendors/common";
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
// Cost tier chosen 2026-11-17 after the first live dry runs (the writer was 51% of the cost, the audit 25%,
// the two solvers 6%): one tier below each vendor's top model. Set KEYSTONE_MODEL_TIER=top to use the top models.
const OPUS: ModelSpec = {
  // Claude Opus 5.5: $4 in / $20 out. Checked 2026-11-17: https://platform.claude.com/docs/en/about-claude/pricing
  vendor: "anthropic", model: "claude-opus-5-5", pricePerMTokIn: 4, pricePerMTokOut: 20,
};
const SOL: ModelSpec = {
  // GPT-6.2 Sol: $2 in / $10 out. Checked 2026-11-17: https://developers.openai.com/api/docs/pricing
  vendor: "openai", model: "gpt-6.2-sol", pricePerMTokIn: 2, pricePerMTokOut: 10,
};
const TOP = process.env.KEYSTONE_MODEL_TIER === "top";
const CLAUDE = TOP ? ANTHROPIC : OPUS;
const GPT = TOP ? OPENAI : SOL;
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
  "claude-fable-5": { pricePerMTokIn: 10, pricePerMTokOut: 50 }, // shared/models.md line 81: same per-token pricing as Fable 5.1
};

export const MODEL_FOR: Record<Role, ModelSpec> = {
  solver1: CLAUDE,
  author: CLAUDE,
  solver2: GPT,
  working: GPT,
  audit: GPT,
  solver3Text: DEEPSEEK,
  solver3Image: GEMINI,
  compare: GEMINI,
  intake: GEMINI,
  // Animated solutions: writes one item's spec.json + figure.svg (+ board.js) (animated/author.ts).
  animator: CLAUDE,
};

const ALL_ROLES = Object.keys(MODEL_FOR) as Role[];

/** Env variable names per vendor, first match wins. */
const KEY_ENV: Record<Vendor, string[]> = {
  anthropic: ["ANTHROPIC_API_KEY"],
  openai: ["OPENAI_API_KEY"],
  deepseek: ["DEEPSEEK_API_KEY"],
  gemini: ["GEMINI_API_KEY", "NEXT_PUBLIC_GEMINI_API_KEY"],
};

function keyFor(vendor: Vendor, env: Record<string, string | undefined> = process.env): string | undefined {
  for (const name of KEY_ENV[vendor]) {
    const v = env[name];
    if (v) return v;
  }
  return undefined;
}

/** Throws, naming the missing variables (never their values), when any key the
 * given roles need is absent. Scripts call this before doing any work. */
export function assertKeys(roles: Role[] = ALL_ROLES, env: Record<string, string | undefined> = process.env): void {
  const vendors = [...new Set(roles.map((r) => MODEL_FOR[r].vendor))];
  const missing = vendors.filter((v) => !keyFor(v, env)).map((v) => KEY_ENV[v].join(" or "));
  if (missing.length) throw new Error(`missing API key env: ${missing.join(", ")}`);
}

/** The roles every item uses (run.ts realSteps: intake; solver1 + solver2 on every item; author; working; audit; compare on a written response). A key missing for these blocks the run. */
export const ALWAYS_ROLES: Role[] = ["intake", "solver1", "solver2", "author", "working", "audit", "compare"];
/** The roles used only when the first two solvers disagree (solve.ts agreeOnAnswer). A key missing for these holds the split item instead. */
export const TIEBREAK_ROLES: Role[] = ["solver3Text", "solver3Image"];

/** Whether the key the role's vendor needs is set (never reads or returns the value out). */
export function hasKeyFor(role: Role, env: Record<string, string | undefined> = process.env): boolean {
  return !!keyFor(MODEL_FOR[role].vendor, env);
}

/**
 * The up-front key check of a run: throws (naming variables, never values) when a key an always-used role needs is
 * missing; returns one warning line per missing tie-break key, for the script to print loudly and carry on.
 */
export function runKeyCheck(env: Record<string, string | undefined> = process.env): string[] {
  assertKeys(ALWAYS_ROLES, env);
  const lines: string[] = [];
  const seen = new Set<Vendor>();
  for (const r of TIEBREAK_ROLES) {
    const v = MODEL_FOR[r].vendor;
    if (keyFor(v, env) || seen.has(v)) continue;
    seen.add(v);
    lines.push(`No key for the tie-break solver (${KEY_ENV[v].join(" or ")}): an item whose two solvers disagree will be held for the owner instead of settled`);
  }
  return lines;
}

/** The vendor a recorded model id belongs to (the five specs' models and the Claude fallback models), else undefined. */
export function vendorOfModel(model: string): Vendor | undefined {
  const id = model.trim();
  for (const spec of [...Object.values(MODEL_FOR), ANTHROPIC, OPENAI, OPUS, SOL]) if (spec.model === id) return spec.vendor;
  if (id in CLAUDE_FALLBACK_PRICES) return "anthropic";
  return undefined;
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

/** Prompt-cache multipliers on the input rate (Claude, 5-minute cache): a write costs 1.25×, a read 0.1×.
 * Checked 2026-11-18: https://platform.claude.com/docs/en/build-with-claude/prompt-caching */
export const CACHE_WRITE_RATE = 1.25;
export const CACHE_READ_RATE = 0.1;

/**
 * What a call made through a vendor's batch endpoint costs, as a share of the standard price: half, on both vendors
 * bulk mode uses, input and output alike. On Claude the prompt-cache multipliers stack with it.
 * Checked 2026-11-18: https://platform.claude.com/docs/en/build-with-claude/batch-processing ("All usage is charged
 * at 50 percent of the standard API prices"; "The pricing discounts from prompt caching and Message Batches can
 * stack") and https://developers.openai.com/api/docs/guides/batch ("50% cost discount compared to synchronous APIs").
 */
export const BATCH_RATE = 0.5;

/** `tokensIn` is every input token; `cache` says how many of them were cache writes / reads (none by default);
 * `batch`: the call ran in a vendor batch (BATCH_RATE). */
export function costOf(spec: ModelSpec, tokensIn: number, tokensOut: number, now?: Date, cache: { write?: number; read?: number } = {}, opts: { batch?: boolean } = {}): number {
  const p = pricesAt(spec, now);
  const write = cache.write ?? 0;
  const read = cache.read ?? 0;
  const billedIn = tokensIn - write - read + write * CACHE_WRITE_RATE + read * CACHE_READ_RATE;
  const list = (billedIn / 1e6) * p.pricePerMTokIn + (tokensOut / 1e6) * p.pricePerMTokOut;
  return opts.batch ? list * BATCH_RATE : list;
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

/** The spec a recorded model id was called with (the roles' specs and the two tiers), else undefined. */
export function specOfModel(model: string): ModelSpec | undefined {
  return [...Object.values(MODEL_FOR), ANTHROPIC, OPENAI, OPUS, SOL].find((spec) => spec.model === model);
}

function bulkKey(vendor: BatchVendor, deps: ModelDeps): string {
  if (process.env.KEYSTONE_PIPELINE_LIVE !== "1" && !deps.fetch) throw new Error("live model calls are off");
  const key = keyFor(vendor);
  if (!key) throw new Error(`missing API key env: ${KEY_ENV[vendor].join(" or ")}`);
  return key;
}

/** Bulk mode: submits one vendor batch (vendors/batch.ts). Throws TransportError when the vendor cannot be reached or refuses it. */
export function submitBulk(vendor: BatchVendor, requests: BatchRequest[], deps: ModelDeps = {}): Promise<{ vendorBatchId: string }> {
  return submitBatch(vendor, requests, bulkKey(vendor, deps), deps.fetch);
}

/** Bulk mode: where a submitted vendor batch stands and, once over, each request's outcome. */
export function pollBulk(vendor: BatchVendor, model: string, vendorBatchId: string, deps: ModelDeps = {}): Promise<BatchPoll> {
  const spec = specOfModel(model) ?? { vendor, model, pricePerMTokIn: 0, pricePerMTokOut: 0 };
  return pollBatch(vendor, spec, vendorBatchId, bulkKey(vendor, deps), deps.fetch);
}

const realSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Attempts per call for a transient failure (network error, 429, 500, 502, 503, 504, 529). */
export const MAX_ATTEMPTS = 4;
/** The longest a Retry-After header is honoured for. */
export const RETRY_AFTER_CAP_MS = 60_000;

/** A Retry-After header (seconds, or an HTTP date) as milliseconds from `now`, capped at 60 s; null when absent or unreadable. */
export function retryAfterMs(header: string | null | undefined, now = Date.now()): number | null {
  const v = (header ?? "").trim();
  if (!v) return null;
  const ms = /^\d+(?:\.\d+)?$/.test(v) ? Number(v) * 1000 : Date.parse(v) - now;
  if (!Number.isFinite(ms)) return null;
  return Math.min(RETRY_AFTER_CAP_MS, Math.max(0, ms));
}

/** The wait before attempt `attempt + 1` (attempt 0 is the first call): base, ×3, ×9 (2 s, 6 s, 18 s), ±25 % jitter; Retry-After wins when given. */
export function backoffFor(attempt: number, base: number, retryAfter: number | null, random: () => number = Math.random): number {
  if (retryAfter !== null) return retryAfter;
  const plain = base * 3 ** attempt;
  return Math.round(plain * (0.75 + 0.5 * random()));
}

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

  let tokens: TokenUse | undefined;
  // Bulk mode: set below once the batch has been asked. `extra` is what the batch charged before a live call replaced it.
  let served: BatchServe | undefined;
  let fromBatch = false;
  const failed = (reason: ModelFailureReason, detail: string, cost = 0, model = spec.model): ModelReply<T> =>
    ({ ok: false, reason, detail: redact(detail), cost: cost + (served?.extraCost ?? 0), model, ...(tokens ? { tokens } : {}), ...(fromBatch ? { batch: true } : {}) });

  if (call.images?.length) {
    if (spec.vendor === "deepseek") return failed("shape", "this model cannot read images");
    const bad = call.images.find((img) => !(IMAGE_TYPES as readonly string[]).includes(img.mime));
    if (bad) return failed("shape", `unsupported image type ${bad.mime}`);
  }

  const started = Date.now();
  const sleep = deps.sleep ?? realSleep;
  let reply: VendorReply | undefined;
  // Bulk mode: the same request, answered from a vendor batch. serve() throws BatchPending while the batch is out
  // (the run stops there, unfinished); it says "live" when the batch gave nothing usable, and the call below is made once.
  if (deps.batch?.takes(call.role, spec.vendor)) {
    served = deps.batch.serve(call.role, spec, batchBody(spec, call));
    if (served.kind === "reply") {
      reply = served.reply;
      fromBatch = served.pricing === "batch";
    }
  }
  for (let attempt = 0; !reply; attempt++) {
    try {
      reply = await send(spec, call, key, deps.fetch);
      break;
    } catch (e) {
      if (e instanceof TransportError) {
        // Transient: a network error or 429 / 500 / 502 / 503 / 504 / 529; never 400 / 401 / 403 / 404.
        const transient = e.retryable && (e.status === undefined || retryableStatus(e.status));
        if (transient && attempt + 1 < MAX_ATTEMPTS) {
          await sleep(backoffFor(attempt, deps.backoffMs ?? 2000, retryAfterMs(e.retryAfter)));
          continue;
        }
        return { ...failed("transport", e.message), ...(transient ? { transient: true } : {}) };
      }
      // A 200 whose content cannot be read but whose usage can: billed, so its cost is recorded. No retry.
      if (e instanceof UnreadableReply) return failed("transport", `${spec.vendor}: ${e.message}`, costOf(spec, e.tokensIn, e.tokensOut, deps.now));
      // Anything else from an adapter (an unreadable 200 with no usage, a missing field): no retry.
      return failed("transport", `${spec.vendor}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const model = reply.model || spec.model;
  const fellBack = reply.fellBack ?? false;
  const servedBy = fellBack ? CLAUDE_FALLBACK_PRICES[model] : undefined;
  const cache = { write: reply.cacheWriteTokens ?? 0, read: reply.cacheReadTokens ?? 0 };
  const priced = servedBy ? { ...spec, ...servedBy, priceChanges: undefined } : spec;
  const listCost = costOf(priced, reply.tokensIn, reply.tokensOut, deps.now, cache);
  const own = fromBatch ? costOf(priced, reply.tokensIn, reply.tokensOut, deps.now, cache, { batch: true }) : listCost;
  if (served?.kind === "live") await served.settle(reply, own);
  if (served) deps.batch!.record({ id: served.id, batch: fromBatch, saved: listCost - own });
  // The item's record carries what was paid: the batch rate for a batch reply, plus (added by `failed` and on the
  // last line) anything the batch charged before a live call replaced it.
  const cost = own;
  tokens = { in: reply.tokensIn, out: reply.tokensOut, cacheWrite: cache.write, cacheRead: cache.read };

  if (reply.refusal !== undefined) return failed("refusal", reply.refusal || "refused", cost, model);
  if (!reply.text.trim()) return failed("empty", reply.truncated ? "no text before the output token limit" : "no text in reply", cost, model);
  const parsed = parseJsonReply(reply.text);
  if (!parsed.ok) return failed("shape", reply.truncated ? `${parsed.detail} (hit the output token limit)` : parsed.detail, cost, model);
  const err = validate(parsed.value, call.schema);
  if (err) return failed("shape", err, cost, model);
  return { ok: true, value: parsed.value as T, cost: cost + (served?.extraCost ?? 0), model, ms: Date.now() - started, fellBack, tokens, ...(fromBatch ? { batch: true } : {}) };
}
