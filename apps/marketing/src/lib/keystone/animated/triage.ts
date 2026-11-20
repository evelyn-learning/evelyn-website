// Animated solutions: does this item need one? One small model call per item decides, and writes the one-sentence
// reason Castle Rock reads on the item page when the answer is no. The owner can always put an item back on the
// To animate list. No `next/*` imports: this runs from tsx scripts. Role "animator" (pipeline/models.ts).
import { callModel } from "../pipeline/models";
import type { ModelDeps, ModelReply } from "../pipeline/types";

export type TriageInput = { subject: string; course: string; itemType?: string; questionText: string; hasImages: boolean; written: string };
export type TriageResult = { ok: true; animate: boolean; reason: string; cost: number; model: string } | { ok: false; error: string; cost: number };
export type TriageDeps = { model?: (call: { system: string; user: string }) => Promise<ModelReply<unknown>>; modelDeps?: ModelDeps };

export const REASON_MAX = 240;
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["animate", "reason"],
  properties: { animate: { type: "boolean" }, reason: { type: "string" } },
};

export const TRIAGE_SYSTEM = `You decide whether an exam question's worked solution should also get an animated, voiced walk-through, in which a tutor's narration is timed to a figure that builds on a board.

Animate when there is something to WATCH that the written solution cannot show as well: a diagram, graph or geometric figure to build or mark up; a movement, rotation or change over time; a process with stages; a structure, map, web or apparatus whose parts must be pointed at; a picture in the question that the solution has to be read against.

Do not animate when the board would only retype the written solution: pure symbol manipulation (evaluating, simplifying or solving with a few algebra steps), a single formula with numbers put in, a definition or recall answer, reading comprehension and language questions whose work is finding a sentence in a passage, or a one-idea calculation of two or three lines. For these a student reads the written steps faster than a voice can say them.

When unsure, choose animate.

Reply with:
- animate: true or false
- reason: ONE plain sentence, at most 30 words, written to the teacher reviewing the item. If animate is false it completes the thought "No animated version, because …" without those words, e.g. "The solution is three lines of logarithm laws with nothing to draw, so a voiced board would only repeat the written steps." If animate is true, say what the board would show. Describe the item only. Never mention models, AI, automation, cost or effort.`;

export function triageUser(i: TriageInput, decided?: "none"): string {
  return [
    `Subject: ${i.subject || "–"}  Course: ${i.course || "–"}  Type: ${i.itemType || "–"}  Question has pictures: ${i.hasImages ? "yes" : "no"}`,
    `QUESTION\n${i.questionText.slice(0, 4000)}`,
    `WRITTEN SOLUTION\n${i.written.slice(0, 8000)}`,
    decided === "none" ? "It has already been decided that this item gets NO animation. Reply with animate: false and write the reason." : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Reads the model's reply; a reason that is empty, too long or names how it was made is refused. Pure. */
export function readTriage(value: unknown): { animate: boolean; reason: string } | string {
  const v = value as { animate?: unknown; reason?: unknown };
  if (!v || typeof v.animate !== "boolean" || typeof v.reason !== "string") return "the reply is not { animate, reason }";
  const reason = v.reason.replace(/\s+/g, " ").trim();
  if (!reason) return "the reason is empty";
  if (reason.length > REASON_MAX) return `the reason is longer than ${REASON_MAX} characters`;
  if (/\b(AI|LLM|model|models|automat\w*|algorithm|Claude|GPT|cost|budget)\b/i.test(reason)) return "the reason mentions how the decision was made";
  return { animate: v.animate, reason };
}

/** One call (one retry when the reply is unusable). `decided: "none"` only writes the reason for a decision already made. */
export async function triageItem(input: TriageInput, deps: TriageDeps = {}, decided?: "none"): Promise<TriageResult> {
  const model = deps.model ?? ((c: { system: string; user: string }) => callModel<unknown>({ role: "animator", system: c.system, user: c.user, schema: SCHEMA, maxTokens: 2000 }, deps.modelDeps));
  let cost = 0;
  let last = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const r = await model({ system: TRIAGE_SYSTEM, user: triageUser(input, decided) + (last ? `\n\nYour last reply was refused: ${last}. Write it again.` : "") });
    cost += r.cost ?? 0;
    if (!r.ok) {
      last = `model call failed (${r.reason})`;
      continue;
    }
    const t = readTriage(r.value);
    if (typeof t === "string") {
      last = t;
      continue;
    }
    return { ok: true, animate: decided === "none" ? false : t.animate, reason: t.reason, cost, model: r.model };
  }
  return { ok: false, error: last, cost };
}
