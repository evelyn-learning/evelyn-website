/**
 * Tutor Judge — Lever B1 of the coherence redesign.
 *
 * Input: the current whiteboard state (catalog snapshot summary) + what
 * the tutor just said (free-form speech).
 * Output: { grounded: boolean, issues: Array<{ claim, why }> }.
 *
 * Calls Claude Haiku with a tight grounding-check prompt: identify any
 * concrete factual claims in the speech that contradict or aren't
 * supported by the whiteboard. The orchestrator uses a non-empty issues
 * list as a synthetic rejection so the existing validator-feedback retry
 * loop re-prompts the brain with the issues attached.
 *
 * Why Haiku: this is a small, well-scoped task — one model evaluating
 * another model's specific claims against specific evidence. Haiku is
 * fast (~80-200ms) and cheap (~$0.0003/turn at typical sizes), and the
 * task complexity doesn't warrant Sonnet. If false-positive rate
 * becomes a problem we'll either (a) lift to Sonnet, or (b) add a
 * second-opinion pass — but Haiku is the right starting default.
 *
 * This route is domain-agnostic by design: it works for math number
 * mismatches, chemistry diagram claims, ELA passage references, code
 * line numbers — anywhere the brain's speech makes a concrete claim
 * about board content.
 */
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

const JUDGE_MODEL_ID = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 600;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface JudgeRequestBody {
  /** Compact prose dump of what's currently on the board — same shape
   *  as buildWhiteboardSummary's output. Empty string means blank board. */
  boardSummary: string;
  /** Concatenated tutor speech for the turn being judged. */
  spokenText: string;
  /** Optional FOCUS card — the most recently rendered show_problem (or
   *  show_segment_card-resolved) statement. The student is most likely
   *  attending to this; the judge weights claims against it MORE than
   *  against other board items. Without focus, the judge can pass a
   *  speech claim that's grounded against ANY board item, even if it
   *  contradicts the card the student is looking at — exactly the
   *  failure mode in the 2026-04-29 algebra session where two coexisting
   *  problem cards (one free-form 16/8 and one authored 12/4) let the
   *  judge pass speech that matched ONE of them while the student
   *  attended to the OTHER. */
  focus?: string;
}

interface JudgeIssue {
  claim: string;
  why: string;
}

interface JudgeResponse {
  grounded: boolean;
  issues: JudgeIssue[];
  /** Latency + token telemetry for orchestrator logging. */
  meta?: {
    ms: number;
    inputTokens: number;
    outputTokens: number;
  };
}

const SYSTEM_PROMPT = `You are a fact-checker for a tutor's spoken explanation. The student is looking at a whiteboard. Your job: given (a) a description of what's currently on the whiteboard and (b) what the tutor just said, identify any concrete factual claims in the speech that contradict or aren't supported by the whiteboard.

A "concrete claim" is a specific factual assertion about board content — a number, an equation, a label, a structural property, a location. Examples:
- "The first equation is 3x + 2y = 12" (claim about an equation card's content)
- "The triangle has a 90-degree angle at C" (claim about a geometry diagram)
- "The protagonist is in Paris" (claim about an ELA passage card)
- "Line 7 returns null" (claim about a code card)

DO NOT flag:
- Pedagogical asides ("good question", "let's think about this", "exactly right")
- General-knowledge statements not referencing the board ("trigonometry was developed by ancient Greeks")
- Predictions, hypotheticals, or what-if questions ("what would happen if we doubled it?")
- Restatements of student input
- Procedural instructions ("now solve for y", "try plugging it in")
- Claims about the next step or future state
- Vague references ("this", "that result", "the answer")

ONLY flag claims that:
1. Reference specific concrete content (numbers, equations, names, structural facts), AND
2. Contradict OR are not supported by anything in the WHITEBOARD STATE.

Return STRICT JSON of the form:
{"grounded": true, "issues": []}
or
{"grounded": false, "issues": [{"claim": "<the spoken claim>", "why": "<board has X instead, or claim has no support in board>"}]}

If the whiteboard is empty, no claims can be grounded against it — but be permissive about general explanation; only flag claims that explicitly state board content (e.g., "the equation on the board is X" when the board is empty).

If a FOCUS section is provided, treat it as the single card the student is most likely attending to. A claim that contradicts FOCUS is ungrounded EVEN IF some other board item happens to support it — the student would experience the contradiction. A claim that contradicts a non-focus item but matches focus is grounded. When FOCUS isn't provided, treat all board items equally.

Output ONLY the JSON object. No prose before or after.`;

function badRequest(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  let body: JudgeRequestBody;
  try {
    body = (await req.json()) as JudgeRequestBody;
  } catch {
    return badRequest('Invalid JSON body');
  }
  if (typeof body.boardSummary !== 'string') return badRequest('boardSummary must be a string');
  if (typeof body.spokenText !== 'string' || body.spokenText.trim().length === 0) {
    // Nothing to judge → trivially grounded.
    return new Response(JSON.stringify({ grounded: true, issues: [] } satisfies JudgeResponse), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const focusBlock = (typeof body.focus === 'string' && body.focus.trim().length > 0)
    ? `<focus>\n${body.focus.trim()}\n</focus>\n\n`
    : '';
  const userContent =
    `<whiteboard_state>\n${body.boardSummary || '(whiteboard is empty)'}\n</whiteboard_state>\n\n` +
    focusBlock +
    `<tutor_said>\n${body.spokenText.trim()}\n</tutor_said>`;

  const t0 = Date.now();
  try {
    const resp = await anthropic.messages.create({
      model: JUDGE_MODEL_ID,
      max_tokens: MAX_TOKENS,
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
      ],
      messages: [{ role: 'user', content: userContent }],
    });
    const ms = Date.now() - t0;

    // Pull the first text block out of the response.
    const textBlock = resp.content.find((b) => b.type === 'text');
    const raw = (textBlock && textBlock.type === 'text') ? textBlock.text.trim() : '';

    let parsed: { grounded?: boolean; issues?: JudgeIssue[] } | null = null;
    try {
      // Tolerate fenced code blocks. Haiku occasionally wraps JSON in
      // ```json ... ``` even when told not to. Strip both forms (with
      // and without language tag, leading whitespace/newlines), AND
      // fall back to extracting the first {...} object if Haiku adds
      // prose around it.
      let jsonStr = raw.trim()
        .replace(/^```(?:json)?\s*\n?/i, '')
        .replace(/\n?\s*```\s*$/i, '')
        .trim();
      // Last-resort: grab the first balanced { ... } block.
      if (!jsonStr.startsWith('{')) {
        const m = jsonStr.match(/\{[\s\S]*\}/);
        if (m) jsonStr = m[0];
      }
      parsed = JSON.parse(jsonStr);
    } catch {
      console.warn('[tutor/judge] failed to parse JSON; raw=', raw.slice(0, 200));
    }
    const grounded = parsed?.grounded === false ? false : true;
    const issues = Array.isArray(parsed?.issues) ? parsed!.issues!.filter(
      (i): i is JudgeIssue => typeof i?.claim === 'string' && typeof i?.why === 'string',
    ) : [];
    const result: JudgeResponse = {
      grounded: grounded && issues.length === 0,
      issues,
      meta: {
        ms,
        inputTokens: resp.usage.input_tokens,
        outputTokens: resp.usage.output_tokens,
      },
    };
    console.log(
      `[tutor/judge] ${ms}ms · grounded=${result.grounded} · issues=${issues.length} · in=${resp.usage.input_tokens} out=${resp.usage.output_tokens}`,
    );
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[tutor/judge] error:', err);
    // On error, fall open (grounded:true) — we'd rather miss a drift than
    // block the conversation on a flaky judge call. The error is logged
    // for observability.
    return new Response(JSON.stringify({ grounded: true, issues: [] } satisfies JudgeResponse), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
