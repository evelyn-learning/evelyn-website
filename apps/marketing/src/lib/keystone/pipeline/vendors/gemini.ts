import type { ModelCall, ModelSpec } from "../types";
import { REQUEST_TIMEOUT_MS, TransportError, retryableStatus, toBase64, type VendorReply } from "./common";

// Gemini via plain REST generateContent (no Google SDK), JSON-schema output
// through generationConfig.responseJsonSchema, thinking level HIGH.
// Refusal = promptFeedback.blockReason, or a candidate stopped for a safety reason.
const BLOCKED = new Set(["SAFETY", "PROHIBITED_CONTENT", "BLOCKLIST", "SPII", "IMAGE_SAFETY"]);

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; thoughtsTokenCount?: number };
  modelVersion?: string;
};

export async function callGemini(spec: ModelSpec, call: ModelCall, apiKey: string, f?: typeof fetch): Promise<VendorReply> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${spec.model}:generateContent`;
  const body = {
    systemInstruction: { parts: [{ text: call.system }] },
    contents: [{
      role: "user",
      parts: [...(call.images ?? []).map((img) => ({ inlineData: { mimeType: img.mime, data: toBase64(img.data) } })), { text: call.user }],
    }],
    generationConfig: { responseMimeType: "application/json", responseJsonSchema: call.schema, thinkingConfig: { thinkingLevel: "HIGH" } },
  };

  let res: Response;
  try {
    res = await (f ?? fetch)(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (e) {
    throw new TransportError(`gemini network error: ${(e as Error).message}`, true);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new TransportError(`gemini HTTP ${res.status}: ${text.slice(0, 300)}`, retryableStatus(res.status));
  }
  let data: GeminiResponse;
  try {
    data = (await res.json()) as GeminiResponse;
  } catch (e) {
    // An unreadable 200 costs nothing here and is retried once (Minor 6 in the task-5 review: left as is).
    throw new TransportError(`gemini unreadable response: ${(e as Error).message}`, true);
  }

  const u = data.usageMetadata ?? {};
  const base = { tokensIn: u.promptTokenCount ?? 0, tokensOut: (u.candidatesTokenCount ?? 0) + (u.thoughtsTokenCount ?? 0), model: data.modelVersion };
  if (data.promptFeedback?.blockReason) return { ...base, text: "", refusal: `prompt blocked: ${data.promptFeedback.blockReason}` };
  const cand = data.candidates?.[0];
  if (!cand) return { ...base, text: "" };
  if (cand.finishReason && BLOCKED.has(cand.finishReason)) return { ...base, text: "", refusal: `finishReason ${cand.finishReason}` };
  const text = (cand.content?.parts ?? []).filter((p) => !p.thought && p.text).map((p) => p.text).join("");
  return { ...base, text, truncated: cand.finishReason === "MAX_TOKENS" };
}
