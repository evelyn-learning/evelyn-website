// Thin call layer over the Anthropic SDK for the research worker.
// Everything model-specific (model id, tools, prompts) lives in prompts.ts;
// this file owns the pause_turn resume loop, refusal handling, usage
// reporting, and JSON extraction. CallModel is the injection seam for tests.
import Anthropic from "@anthropic-ai/sdk";
import type { UsageLike } from "./cost";

export interface ResearchMessage {
  stop_reason: string | null;
  content: Array<Record<string, unknown>>;
  usage: UsageLike;
}

export type CallModel = (params: Record<string, unknown>) => Promise<ResearchMessage>;

export function realCallModel(): CallModel {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY
  return async (params) =>
    (await client.messages.create(
      params as unknown as Parameters<typeof client.messages.create>[0]
    )) as unknown as ResearchMessage;
}

const MAX_PAUSE_RESUMES = 8;

// Runs one logical request, transparently resuming server-tool pause_turn
// stops. onUsage fires once per underlying API response (cost accounting).
export async function callWithToolLoop(
  call: CallModel,
  params: Record<string, unknown>,
  onUsage: (u: UsageLike) => void
): Promise<ResearchMessage> {
  let current = { ...params };
  for (let i = 0; i <= MAX_PAUSE_RESUMES; i++) {
    const msg = await call(current);
    onUsage(msg.usage);
    if (msg.stop_reason === "refusal") throw new Error("RESEARCH_REFUSED");
    if (msg.stop_reason === "max_tokens") throw new Error("RESEARCH_TRUNCATED");
    if (msg.stop_reason !== "pause_turn") return msg;
    current = {
      ...current,
      messages: [
        ...(current.messages as Array<Record<string, unknown>>),
        { role: "assistant", content: msg.content },
      ],
    };
  }
  throw new Error("RESEARCH_PAUSE_LOOP");
}

export function extractJson(msg: ResearchMessage): unknown {
  const texts = msg.content.filter((b) => b.type === "text");
  const last = texts[texts.length - 1];
  if (last && typeof last.text === "string") {
    try {
      return JSON.parse(last.text);
    } catch {
      /* fall through */
    }
  }
  throw new Error("RESEARCH_BAD_JSON");
}
