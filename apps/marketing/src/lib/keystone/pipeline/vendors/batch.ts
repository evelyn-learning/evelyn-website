// The vendors' bulk (batch) endpoints, for the pipeline's bulk mode (../bulk.ts): the same request a live call
// sends, submitted in a batch at half price and collected later. Two vendors:
//
//   Anthropic, Message Batches API. Doc used (read 2026-11-18):
//     https://platform.claude.com/docs/en/build-with-claude/batch-processing
//     - POST /v1/messages/batches with { requests: [{ custom_id, params }] }; custom_id matches ^[a-zA-Z0-9_-]{1,64}$
//     - the batch's processing_status is in_progress → (canceling →) ended; results at results_url as JSONL, one
//       { custom_id, result: { type: succeeded | errored | canceled | expired, message | error } } per request,
//       in any order; a batch expires 24 h after creation; results are kept 29 days
//     - "All usage is charged at 50 percent of the standard API prices"; prompt-cache discounts stack with it
//     - `fallbacks` is not accepted in a batch; a refusal comes back as a succeeded result with stop_reason
//       "refusal" (https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback, "Refusals in
//       Message Batches"): bulk.ts sends such a request again as a live call, which has the fallback
//   OpenAI, Batch API. Doc used (read 2026-11-18): https://developers.openai.com/api/docs/guides/batch
//     - a JSONL file of { custom_id, method: "POST", url: "/v1/chat/completions", body } uploaded with purpose
//       "batch", then POST /v1/batches { input_file_id, endpoint, completion_window: "24h" }; one model per file
//     - status validating | in_progress | finalizing | completed | failed | expired | cancelling | cancelled;
//       output_file_id holds { custom_id, response: { status_code, body }, error } lines (any order), error_file_id
//       the failed ones (an expired request has error.code "batch_expired"); "50% cost discount"
//
// Gemini and DeepSeek stay live in bulk mode. Gemini has a batch mode (https://aistudio.google.com/docs/batch-api,
// read 2026-11-18) but that page does not say the model used here supports it, shows responseSchema where the live
// adapter sends responseJsonSchema, does not mention thinkingConfig, and gives two different shapes for reading
// inline results: not clear enough to rely on. DeepSeek's pricing page (https://api-docs.deepseek.com/quick_start/pricing,
// read 2026-11-18) lists no batch API (its discounts are off-peak hours and cache hits).
//
// Same style as the live adapters: the vendors' SDKs with an injectable fetch, no retries inside the SDK.

import Anthropic from "@anthropic-ai/sdk";
import OpenAI, { toFile } from "openai";
import type { ModelCall, ModelSpec } from "../types";
import { anthropicParams, readAnthropicMessage } from "./anthropic";
import { REQUEST_TIMEOUT_MS, TransportError, retryAfterOf, retryableStatus, type VendorReply } from "./common";
import { openaiBody, readOpenAICompletion } from "./openai";

export type BatchVendor = "anthropic" | "openai";
export const isBatchVendor = (v: string): v is BatchVendor => v === "anthropic" || v === "openai";

/** One request of a batch: our id for it and exactly the body the live call would send. */
export type BatchRequest = { customId: string; body: Record<string, unknown> };

/** One request's outcome in a finished batch. `detail` never carries a key (the caller redacts it as well). */
export type BatchLine =
  | { customId: string; type: "succeeded"; reply: VendorReply }
  | { customId: string; type: "errored" | "expired" | "canceled"; detail: string };

export type BatchPoll =
  | { state: "running"; detail: string }
  /** over: every request has an outcome (a request with no line in `lines` is treated as errored by the caller). */
  | { state: "over"; outcome: "ended" | "expired" | "failed" | "canceled"; finishedAt?: Date; lines: BatchLine[]; why?: string };

/** The request body of one call, as the vendor's live endpoint and its batch endpoint both take it. */
export function batchBody(spec: ModelSpec, call: ModelCall): Record<string, unknown> {
  if (spec.vendor === "anthropic") return anthropicParams(spec, call) as unknown as Record<string, unknown>;
  if (spec.vendor === "openai") return openaiBody(spec, call, "openai") as unknown as Record<string, unknown>;
  throw new Error(`no batch endpoint is used for ${spec.vendor}`);
}

function transport(vendor: string, e: unknown): never {
  if (e instanceof Anthropic.APIError || e instanceof OpenAI.APIError) {
    const network = e instanceof Anthropic.APIConnectionError || e instanceof OpenAI.APIConnectionError;
    const status = network ? undefined : (e as { status?: number }).status;
    throw new TransportError(`${vendor} batch ${status ? `HTTP ${status}` : "network error"}: ${e.message}`, retryableStatus(status), status, retryAfterOf((e as { headers?: unknown }).headers));
  }
  throw e;
}

const anthropic = (apiKey: string, f?: typeof fetch) => new Anthropic({ apiKey, fetch: f, maxRetries: 0, timeout: REQUEST_TIMEOUT_MS });
const openai = (apiKey: string, f?: typeof fetch) => new OpenAI({ apiKey, fetch: f, maxRetries: 0, timeout: REQUEST_TIMEOUT_MS });

/** Submits one batch (all requests for one vendor and one model). Returns the vendor's batch id. */
export async function submitBatch(vendor: BatchVendor, requests: BatchRequest[], apiKey: string, f?: typeof fetch): Promise<{ vendorBatchId: string }> {
  if (!requests.length) throw new Error("a batch needs at least one request");
  try {
    if (vendor === "anthropic") {
      const res = await anthropic(apiKey, f).messages.batches.create({
        requests: requests.map((r) => ({ custom_id: r.customId, params: r.body as unknown as Anthropic.Messages.MessageCreateParamsNonStreaming })),
      });
      if (!res?.id) throw new Error("anthropic batch: no id in the reply");
      return { vendorBatchId: res.id };
    }
    const client = openai(apiKey, f);
    const jsonl = requests.map((r) => JSON.stringify({ custom_id: r.customId, method: "POST", url: "/v1/chat/completions", body: r.body })).join("\n") + "\n";
    const file = await client.files.create({ file: await toFile(Buffer.from(jsonl, "utf8"), "keystone-bulk.jsonl", { type: "application/jsonl" }), purpose: "batch" });
    if (!file?.id) throw new Error("openai batch: no file id in the reply");
    const res = await client.batches.create({ input_file_id: file.id, endpoint: "/v1/chat/completions", completion_window: "24h" });
    if (!res?.id) throw new Error("openai batch: no id in the reply");
    return { vendorBatchId: res.id };
  } catch (e) {
    return transport(vendor, e);
  }
}

const errText = (e: unknown): string => {
  if (!e || typeof e !== "object") return String(e ?? "no detail");
  const o = e as { type?: unknown; code?: unknown; message?: unknown; error?: unknown };
  if (o.error && typeof o.error === "object") return errText(o.error);
  return [o.type ?? o.code, o.message].filter((x) => typeof x === "string" && x).join(": ").slice(0, 300) || "no detail";
};

function jsonLines(text: string): unknown[] {
  const out: unknown[] = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try { out.push(JSON.parse(line)); } catch { /* an unreadable line: its request gets no outcome, which the caller treats as errored */ }
  }
  return out;
}

/** Where the batch stands; once it is over, every request's outcome. Throws TransportError when the vendor cannot be asked. */
export async function pollBatch(vendor: BatchVendor, spec: ModelSpec, vendorBatchId: string, apiKey: string, f?: typeof fetch): Promise<BatchPoll> {
  try {
    if (vendor === "anthropic") {
      const client = anthropic(apiKey, f);
      const b = await client.messages.batches.retrieve(vendorBatchId);
      if (b.processing_status !== "ended") return { state: "running", detail: `${b.processing_status}, ${b.request_counts?.processing ?? "?"} still processing` };
      const lines: BatchLine[] = [];
      for await (const r of await client.messages.batches.results(vendorBatchId)) {
        const customId = r.custom_id;
        const res = r.result;
        if (res.type === "succeeded") {
          try {
            lines.push({ customId, type: "succeeded", reply: readAnthropicMessage(res.message, spec) });
          } catch (e) {
            lines.push({ customId, type: "errored", detail: e instanceof Error ? e.message : String(e) });
          }
        } else if (res.type === "errored") lines.push({ customId, type: "errored", detail: errText(res.error) });
        else lines.push({ customId, type: res.type === "expired" ? "expired" : "canceled", detail: `the batch ${res.type === "expired" ? "expired before this request ran" : "was canceled before this request ran"}` });
      }
      const c = b.request_counts;
      const outcome = c && c.expired > 0 && c.succeeded === 0 ? "expired" : c && c.canceled > 0 && c.succeeded === 0 ? "canceled" : "ended";
      return { state: "over", outcome, finishedAt: b.ended_at ? new Date(b.ended_at) : undefined, lines };
    }

    const client = openai(apiKey, f);
    const b = await client.batches.retrieve(vendorBatchId);
    if (b.status === "validating" || b.status === "in_progress" || b.status === "finalizing" || b.status === "cancelling") {
      return { state: "running", detail: `${b.status}, ${b.request_counts?.completed ?? "?"} of ${b.request_counts?.total ?? "?"} done` };
    }
    const lines: BatchLine[] = [];
    const read = async (fileId: string | undefined | null) => (fileId ? jsonLines(await (await client.files.content(fileId)).text()) : []);
    type Line = { custom_id?: string; response?: { status_code?: number; body?: unknown } | null; error?: { code?: string; message?: string } | null };
    for (const raw of [...(await read(b.output_file_id)), ...(await read(b.error_file_id))] as Line[]) {
      const customId = raw?.custom_id;
      if (typeof customId !== "string") continue;
      if (raw.error) {
        lines.push({ customId, type: raw.error.code === "batch_expired" ? "expired" : "errored", detail: errText(raw.error) });
      } else if (raw.response?.status_code === 200) {
        try {
          lines.push({ customId, type: "succeeded", reply: readOpenAICompletion(raw.response.body, "openai") });
        } catch (e) {
          lines.push({ customId, type: "errored", detail: e instanceof Error ? e.message : String(e) });
        }
      } else {
        lines.push({ customId, type: "errored", detail: `HTTP ${raw.response?.status_code ?? "?"}: ${errText(raw.response?.body)}` });
      }
    }
    const outcome = b.status === "completed" ? "ended" : b.status === "expired" ? "expired" : b.status === "cancelled" ? "canceled" : "failed";
    const at = b.completed_at ?? b.expired_at ?? b.failed_at ?? b.cancelled_at;
    if (outcome === "failed" && !lines.length) {
      // The whole file was refused (validation): no request ran. Each one is errored with the batch's own reason.
      const why = (b.errors?.data ?? []).map((x) => errText(x)).join("; ") || "the batch failed";
      return { state: "over", outcome, finishedAt: at ? new Date(at * 1000) : undefined, lines: [], why };
    }
    return { state: "over", outcome, finishedAt: at ? new Date(at * 1000) : undefined, lines };
  } catch (e) {
    return transport(vendor, e);
  }
}
