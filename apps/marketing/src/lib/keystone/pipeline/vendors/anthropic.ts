import Anthropic from "@anthropic-ai/sdk";
import type { ModelCall, ModelSpec } from "../types";
import { REQUEST_TIMEOUT_MS, TransportError, UnreadableReply, retryAfterOf, retryableStatus, toBase64, type ImageType, type VendorReply } from "./common";

// Claude via the Messages API with JSON-schema structured output
// (output_config.format). Thinking is always on for this model; effort "high".
// Server-side refusal fallback ("default") is on, per the claude-api skill: a
// policy decline is retried on a fallback model inside the same call; only a
// refusal of the whole chain comes back as stop_reason "refusal". When a
// fallback ran, the content carries `fallback` blocks; the answer is the text
// after the last one, and res.model names the model that served it.
// Note: Anthropic's structured outputs need additionalProperties:false on every object.
/** Same model: identical ids, or one is the other plus "-" and an 8-digit date
 * (a dated snapshot). "claude-fable-5" vs "claude-fable-5-2" are different models. */
export function sameModel(a: string, b: string): boolean {
  const alias = (long: string, short: string) => long.startsWith(`${short}-`) && /^\d{8}$/.test(long.slice(short.length + 1));
  return a === b || alias(a, b) || alias(b, a);
}

/**
 * The Messages request for one call: model, prompt, images, output schema, effort. The live call and a Message
 * Batches request send exactly this (the live call adds the server-side refusal fallback, which a batch cannot carry).
 */
export function anthropicParams(spec: ModelSpec, call: ModelCall) {
  const content: Anthropic.Beta.BetaContentBlockParam[] = (call.images ?? []).map((img) => ({
    type: "image",
    source: { type: "base64", media_type: img.mime as ImageType, data: toBase64(img.data) }, // mime checked in callModel
  }));
  content.push({ type: "text", text: call.user });
  return {
    model: spec.model,
    max_tokens: call.maxTokens ?? 16000,
    // Parts: each one ends a cached prefix (a later call with the same leading parts reads them from the cache).
    system: call.systemParts?.length
      ? call.systemParts.slice(0, 4).map((text) => ({ type: "text" as const, text, cache_control: { type: "ephemeral" as const } }))
      : call.system,
    messages: [{ role: "user" as const, content }],
    output_config: { effort: "high" as const, format: { type: "json_schema" as const, schema: call.schema as Record<string, unknown> } },
  };
}

export async function callAnthropic(spec: ModelSpec, call: ModelCall, apiKey: string, f?: typeof fetch): Promise<VendorReply> {
  const client = new Anthropic({ apiKey, fetch: f, maxRetries: 0, timeout: REQUEST_TIMEOUT_MS });
  let res: Anthropic.Beta.BetaMessage;
  try {
    res = await client.beta.messages.create({
      ...anthropicParams(spec, call),
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });
  } catch (e) {
    if (e instanceof Anthropic.APIError) {
      const status = e instanceof Anthropic.APIConnectionError ? undefined : e.status;
      throw new TransportError(`anthropic ${status ? `HTTP ${status}` : "network error"}: ${e.message}`, retryableStatus(status), status, retryAfterOf((e as { headers?: unknown }).headers));
    }
    throw e;
  }
  return readAnthropicMessage(res, spec);
}

/** A Messages response (live, or the `message` of a succeeded batch result) as a VendorReply. Throws on an unreadable one. */
export function readAnthropicMessage(raw: unknown, spec: ModelSpec): VendorReply {
  const res = raw as Anthropic.Beta.BetaMessage;
  if (!res || typeof res !== "object" || !Array.isArray(res.content) || !res.usage) {
    const u = res && typeof res === "object" ? (res as { usage?: { input_tokens?: unknown; output_tokens?: unknown } }).usage : undefined;
    if (u && typeof u.input_tokens === "number" && typeof u.output_tokens === "number") {
      throw new UnreadableReply("anthropic: unreadable 200 response (no content)", u.input_tokens, u.output_tokens);
    }
    throw new Error("anthropic: unreadable 200 response (no content/usage)");
  }

  const u = res.usage;
  // tokensIn is every input token; the cached parts are reported beside it and priced by callModel (costOf).
  const cacheWriteTokens = u.cache_creation_input_tokens ?? 0;
  const cacheReadTokens = u.cache_read_input_tokens ?? 0;
  const tokensIn = u.input_tokens + cacheWriteTokens + cacheReadTokens;
  const blocks = res.content as { type: string; text?: string }[];
  let lastFallback = -1;
  blocks.forEach((b, i) => { if (b.type === "fallback") lastFallback = i; });
  const fellBack = lastFallback >= 0 || (!!res.model && !sameModel(res.model, spec.model));
  const base = { tokensIn, cacheWriteTokens, cacheReadTokens, tokensOut: u.output_tokens, model: res.model, fellBack };
  if (res.stop_reason === "refusal") {
    const d = (res as { stop_details?: { category?: string | null; explanation?: string | null } | null }).stop_details;
    return { ...base, text: "", refusal: [d?.category, d?.explanation].filter(Boolean).join(": ") || "stop_reason refusal" };
  }
  const text = blocks.slice(lastFallback + 1).map((b) => (b.type === "text" ? b.text ?? "" : "")).join("");
  return { ...base, text, truncated: res.stop_reason === "max_tokens" };
}
