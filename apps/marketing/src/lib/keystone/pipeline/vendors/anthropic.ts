import Anthropic from "@anthropic-ai/sdk";
import type { ModelCall, ModelSpec } from "../types";
import { InputError, REQUEST_TIMEOUT_MS, TransportError, retryableStatus, toBase64, type VendorReply } from "./common";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
type ImageType = (typeof IMAGE_TYPES)[number];

// Claude via the Messages API with JSON-schema structured output
// (output_config.format). Thinking is always on for this model; effort "high".
// Server-side refusal fallback ("default") is on, per the claude-api skill: a
// policy decline is retried on a fallback model inside the same call; only a
// refusal of the whole chain comes back as stop_reason "refusal".
// Note: Anthropic's structured outputs need additionalProperties:false on every object.
export async function callAnthropic(spec: ModelSpec, call: ModelCall, apiKey: string, f?: typeof fetch): Promise<VendorReply> {
  const client = new Anthropic({ apiKey, fetch: f, maxRetries: 0, timeout: REQUEST_TIMEOUT_MS });
  const content: Anthropic.Beta.BetaContentBlockParam[] = [];
  for (const img of call.images ?? []) {
    if (!(IMAGE_TYPES as readonly string[]).includes(img.mime)) throw new InputError(`image type ${img.mime} is not accepted by this model`);
    content.push({ type: "image", source: { type: "base64", media_type: img.mime as ImageType, data: toBase64(img.data) } });
  }
  content.push({ type: "text", text: call.user });

  let res: Anthropic.Beta.BetaMessage;
  try {
    res = await client.beta.messages.create({
      model: spec.model,
      max_tokens: 16000,
      system: call.system,
      messages: [{ role: "user", content }],
      output_config: { effort: "high", format: { type: "json_schema", schema: call.schema as Record<string, unknown> } },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });
  } catch (e) {
    if (e instanceof Anthropic.APIError) {
      const status = e instanceof Anthropic.APIConnectionError ? undefined : e.status;
      throw new TransportError(`anthropic ${status ? `HTTP ${status}` : "network error"}: ${e.message}`, retryableStatus(status));
    }
    throw e;
  }

  const u = res.usage;
  const tokensIn = u.input_tokens + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0);
  const base = { tokensIn, tokensOut: u.output_tokens, model: res.model };
  if (res.stop_reason === "refusal") {
    const d = (res as { stop_details?: { category?: string | null; explanation?: string | null } | null }).stop_details;
    return { ...base, text: "", refusal: [d?.category, d?.explanation].filter(Boolean).join(": ") || "stop_reason refusal" };
  }
  const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  return { ...base, text, truncated: res.stop_reason === "max_tokens" };
}
