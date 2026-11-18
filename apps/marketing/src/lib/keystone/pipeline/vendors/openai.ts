import OpenAI from "openai";
import type { ModelCall, ModelSpec } from "../types";
import { isStrictSchema } from "../schema";
import { REQUEST_TIMEOUT_MS, TransportError, retryableStatus, toBase64, type VendorReply } from "./common";

const DEEPSEEK_BASE_URL = "https://api.deepseek.com";

// OpenAI (Chat Completions, json_schema structured output, reasoning effort high)
// and DeepSeek (OpenAI-compatible API; text only; JSON via json_object, which
// needs the word "json" in the prompt, so the schema is put in the system text).
export async function callOpenAICompatible(
  spec: ModelSpec, call: ModelCall, apiKey: string, f: typeof fetch | undefined, flavour: "openai" | "deepseek",
): Promise<VendorReply> {
  const client = new OpenAI({
    apiKey, fetch: f, maxRetries: 0, timeout: REQUEST_TIMEOUT_MS,
    ...(flavour === "deepseek" ? { baseURL: DEEPSEEK_BASE_URL } : {}),
  });

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
        };

  let res: OpenAI.Chat.ChatCompletion;
  try {
    res = await client.chat.completions.create(body);
  } catch (e) {
    if (e instanceof OpenAI.APIError) {
      const status = e instanceof OpenAI.APIConnectionError ? undefined : e.status;
      throw new TransportError(`${flavour} ${status ? `HTTP ${status}` : "network error"}: ${e.message}`, retryableStatus(status));
    }
    throw e;
  }

  const base = { tokensIn: res.usage?.prompt_tokens ?? 0, tokensOut: res.usage?.completion_tokens ?? 0, model: res.model };
  const choice = res.choices[0];
  if (!choice) return { ...base, text: "" };
  if (choice.message.refusal) return { ...base, text: "", refusal: choice.message.refusal };
  if (choice.finish_reason === "content_filter") return { ...base, text: "", refusal: "finish_reason content_filter" };
  return { ...base, text: choice.message.content ?? "", truncated: choice.finish_reason === "length" };
}
