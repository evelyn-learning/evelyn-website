/**
 * Perception Classifier — Haiku escalation endpoint
 *
 * Stage 1 of the Voice Perception Layer. Called by the client when the
 * heuristic classifier returns `verdict: 'escalate'` (mid-length
 * utterances during 'speaking' or 'thinking' where the heuristic can't
 * decide barge-in vs continuation vs filler from lexical cues alone).
 *
 * Returns one of: filler | new_turn | continuation | barge_in | noise.
 * No state-changing action is taken at Stage 1 — verdicts are logged
 * for the FP-rate review that gates advancement to Stage 2.
 *
 * Failure posture: fail-open to `noise` so the perception layer never
 * blocks the conversation if Haiku is slow / down (Q6 in the design).
 * The client-side circuit breaker (5 fails → 60s open → heuristics-only
 * fallback) lives in the wiring layer.
 */
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

const CLASSIFIER_MODEL_ID = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 80;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type PerceptionVerdict =
  | 'filler'
  | 'noise'
  | 'new_turn'
  | 'continuation'
  | 'barge_in';

interface RequestBody {
  /** What the perception WS just transcribed. */
  transcript: string;
  /** What the tutor is doing right now. */
  productionState: 'listening' | 'recording' | 'processing' | 'speaking' | string;
  /** Last ~8s of tutor speech (concatenated), for self-voice and
   *  continuation-vs-barge discrimination. */
  recentTutorScript?: string;
  /** Optional: the last student turn (for continuation context). */
  lastStudentTurn?: string;
}

interface ResponseBody {
  verdict: PerceptionVerdict;
  reason: string;
  meta?: {
    ms: number;
    inputTokens: number;
    outputTokens: number;
  };
}

const SYSTEM_PROMPT = `You classify a snippet of student speech captured by a parallel "perception" microphone during an AI voice tutoring session. The student is talking to a tutor; the tutor may be silent, thinking, or speaking. Your job is to label what the student just said so the tutor can react correctly.

Pick ONE label from this set:

- "filler" — the student made an ambient acknowledgement that does NOT call for any tutor action: "okay", "uh huh", "right", "got it", a sigh, a stray cough or sniff.
- "noise" — the transcript is not real student speech: blank, background noise hallucinated by Whisper, or fragments that don't form a coherent message.
- "new_turn" — the student said something substantive while the tutor was IDLE (waiting). The tutor should respond normally.
- "continuation" — the tutor was THINKING (a brain call is in flight from the student's PRIOR turn). The student is adding to that prior turn: clarifying, extending, or correcting their own previous answer. The tutor should merge this with the in-flight turn — NOT treat it as a barge-in.
- "barge_in" — the tutor was SPEAKING (or thinking and the student wants to redirect). The student is asking the tutor to stop, change direction, ask a different question, or correct the tutor. The tutor should stop and listen.

Tie-breaking rules:

1. If <production_state> is "listening" → almost always "new_turn" (rare exceptions: pure filler or pure noise).
2. If <production_state> is "processing" → the question is continuation vs barge_in. Default to continuation unless the student says STOP / WAIT / NO or asks a totally different question. Short additions to a prior numeric/short answer ("oh wait, I meant 12") are continuation.
3. If <production_state> is "speaking" → the question is filler vs barge_in. Default to filler for ambient acks. Treat as barge_in if the speech contains an instruction to stop, a corrective ("actually...", "no, but..."), or a new question.
4. If <recent_tutor_script> appears verbatim or near-verbatim in <transcript>, it's likely self-voice contamination — return "noise".

Return STRICT JSON of the form:
{"verdict":"<label>","reason":"<one short clause>"}

Output ONLY the JSON object. No prose before or after.`;

function extractFirstJsonObject(s: string): string | null {
  let depth = 0;
  let start = -1;
  let inStr = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (inStr) {
      if (c === '\\') escape = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && start >= 0) return s.slice(start, i + 1);
    }
  }
  return null;
}

const VALID_VERDICTS: ReadonlySet<PerceptionVerdict> = new Set([
  'filler', 'noise', 'new_turn', 'continuation', 'barge_in',
]);

function failOpen(reason: string): Response {
  const body: ResponseBody = { verdict: 'noise', reason };
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return failOpen('invalid JSON body');
  }
  const transcript = typeof body.transcript === 'string' ? body.transcript.trim() : '';
  if (!transcript) return failOpen('empty transcript');
  const productionState = typeof body.productionState === 'string' ? body.productionState : 'unknown';
  const tutorScript = typeof body.recentTutorScript === 'string' ? body.recentTutorScript.trim() : '';
  const lastStudent = typeof body.lastStudentTurn === 'string' ? body.lastStudentTurn.trim() : '';

  const userContent =
    `<production_state>${productionState}</production_state>\n\n` +
    (tutorScript ? `<recent_tutor_script>\n${tutorScript}\n</recent_tutor_script>\n\n` : '') +
    (lastStudent ? `<last_student_turn>\n${lastStudent}\n</last_student_turn>\n\n` : '') +
    `<transcript>\n${transcript}\n</transcript>`;

  const t0 = Date.now();
  try {
    const resp = await anthropic.messages.create({
      model: CLASSIFIER_MODEL_ID,
      max_tokens: MAX_TOKENS,
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
      ],
      messages: [{ role: 'user', content: userContent }],
    });
    const ms = Date.now() - t0;
    const textBlock = resp.content.find((b) => b.type === 'text');
    const raw = (textBlock && textBlock.type === 'text') ? textBlock.text.trim() : '';

    let parsed: { verdict?: string; reason?: string } | null = null;
    try {
      const jsonStr = extractFirstJsonObject(raw);
      if (jsonStr) parsed = JSON.parse(jsonStr);
    } catch {
      console.warn('[tutor/perception-classify] JSON parse failed; raw=', raw.slice(0, 200));
    }
    const verdict: PerceptionVerdict = (parsed?.verdict && VALID_VERDICTS.has(parsed.verdict as PerceptionVerdict))
      ? (parsed.verdict as PerceptionVerdict)
      : 'noise';
    const reason = typeof parsed?.reason === 'string' && parsed.reason.length > 0
      ? parsed.reason.slice(0, 240)
      : 'no reason';
    const out: ResponseBody = {
      verdict,
      reason,
      meta: {
        ms,
        inputTokens: resp.usage.input_tokens,
        outputTokens: resp.usage.output_tokens,
      },
    };
    console.log(
      `[tutor/perception-classify] ${ms}ms · ${verdict} · in=${resp.usage.input_tokens} out=${resp.usage.output_tokens}`,
    );
    return new Response(JSON.stringify(out), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[tutor/perception-classify] error:', err);
    return failOpen('haiku error');
  }
}
