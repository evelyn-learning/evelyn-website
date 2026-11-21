import OpenAI from "openai";
import type { ModelCall, ModelSpec } from "../types";
import { isStrictSchema } from "../schema";
import { REQUEST_TIMEOUT_MS, TransportError, UnreadableReply, retryAfterOf, retryableStatus, toBase64, type VendorReply } from "./common";

const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
// deepseek-v4-pro maximum output, "MAXIMUM: 384K" (read as 384,000 to stay under it).
// Checked 2026-11-17: https://api-docs.deepseek.com/quick_start/pricing
const DEEPSEEK_MAX_TOKENS = 384_000;

// OpenAI (Chat Completions, json_schema structured output, reasoning effort high)
// and DeepSeek (OpenAI-compatible API; text only; JSON via json_object, which
// needs the word "json" in the prompt, so the schema is put in the system text).
/** The Chat Completions request for one call. The live call and a Batch API line send exactly this body. */
export function openaiBody(spec: ModelSpec, call: ModelCall, flavour: "openai" | "deepseek"): OpenAI.Chat.ChatCompletionCreateParamsNonStreaming {
  const userContent: OpenAI.Chat.ChatCompletionContentPart[] | string = call.images?.length
    ? [
        { type: "text", text: call.user },
        ...call.images.map((img) => ({ type: "image_url" as const, image_url: { url: `data:${img.mime};base64,${toBase64(img.data)}` } })),
      ]
    : call.user;

  const body: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming =
    flavour === "openai"
      ? {
          model: spec.model,
          messages: [{ role: "system", content: call.system }, { role: "user", content: userContent }],
          response_format: { type: "json_schema", json_schema: { name: "reply", strict: isStrictSchema(call.schema), schema: call.schema as Record<string, unknown> } },
          reasoning_effort: "high",
          max_completion_tokens: 32000,
        }
      : {
          model: spec.model,
          messages: [
            { role: "system", content: `${call.system}\n\nReply with only a JSON object that matches this JSON schema:\n${JSON.stringify(call.schema)}` },
            { role: "user", content: userContent },
          ],
          response_format: { type: "json_object" },
          max_tokens: DEEPSEEK_MAX_TOKENS,
        };

  return body;
}

export async function callOpenAICompatible(
  spec: ModelSpec, call: ModelCall, apiKey: string, f: typeof fetch | undefined, flavour: "openai" | "deepseek",
): Promise<VendorReply> {
  const client = new OpenAI({
    apiKey, fetch: f, maxRetries: 0, timeout: REQUEST_TIMEOUT_MS,
    ...(flavour === "deepseek" ? { baseURL: DEEPSEEK_BASE_URL } : {}),
  });
  const body = openaiBody(spec, call, flavour);

  let res: OpenAI.Chat.ChatCompletion;
  try {
    res = await client.chat.completions.create(body);
  } catch (e) {
    if (e instanceof OpenAI.APIError) {
      const status = e instanceof OpenAI.APIConnectionError ? undefined : e.status;
      throw new TransportError(`${flavour} ${status ? `HTTP ${status}` : "network error"}: ${e.message}`, retryableStatus(status), status, retryAfterOf((e as { headers?: unknown }).headers));
    }
    throw e;
  }

  return readOpenAICompletion(res, flavour);
}

/** A Chat Completions response (live, or the `response.body` of a batch output line) as a VendorReply. Throws on an unreadable one. */
export function readOpenAICompletion(raw: unknown, flavour: "openai" | "deepseek"): VendorReply {
  const res = raw as OpenAI.Chat.ChatCompletion;
  const usage = res && typeof res === "object" ? (res as { usage?: { prompt_tokens?: unknown; completion_tokens?: unknown } }).usage : undefined;
  const billed = usage && typeof usage.prompt_tokens === "number" && typeof usage.completion_tokens === "number" ? usage as { prompt_tokens: number; completion_tokens: number } : null;
  if (!res || typeof res !== "object" || !Array.isArray(res.choices) || !res.usage) {
    if (billed) throw new UnreadableReply(`${flavour}: unreadable 200 response (no choices)`, billed.prompt_tokens, billed.completion_tokens);
    throw new Error(`${flavour}: unreadable 200 response (no choices/usage)`);
  }
  // DeepSeek cache hits are priced at the cache-miss rate (an upper bound; see Minor 6 in the task-5 review).
  const base = { tokensIn: res.usage.prompt_tokens, tokensOut: res.usage.completion_tokens, model: res.model };
  const choice = res.choices[0];
  if (!choice?.message) {
    if (billed) throw new UnreadableReply(`${flavour}: 200 response with no choices`, billed.prompt_tokens, billed.completion_tokens);
    throw new Error(`${flavour}: 200 response with no choices`);
  }
  if (choice.message.refusal) return { ...base, text: "", refusal: choice.message.refusal };
  if (choice.finish_reason === "content_filter") return { ...base, text: "", refusal: "finish_reason content_filter" };
  return { ...base, text: choice.message.content ?? "", truncated: choice.finish_reason === "length" };
}
