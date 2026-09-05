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
import { repairJudgeJson } from '@/lib/tutor/voice/judge-json-repair';
import { getModelClient, prepareParams } from '@/lib/tutor/ai/model-registry';
import { JUDGE_SYSTEM_PROMPT, buildJudgeUserContent } from '@/lib/tutor/judge-prompt';

export const runtime = 'nodejs';

const { client: anthropic, model: JUDGE_MODEL_ID } = getModelClient('judge');
const MAX_TOKENS = 600;

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
  /** Optional STUDENT_ANSWER — the student message that triggered this
   *  brain turn. When the tutor's speech opens with an affirmation
   *  ("Exactly", "Right", "Correct", "Perfect", "Yes that's right"),
   *  the judge cross-checks: is the student's answer actually correct?
   *  Catches the wrong-answer affirmation failure mode observed
   *  2026-05-14 (truth table: student "1" for AND with A=true B=false,
   *  brain "Exactly — A AND B is false when B is false…"). Without
   *  this, the judge sees the affirmation as a benign restatement and
   *  passes. */
  studentAnswer?: string;
  /** Optional TUTOR_QUESTION — the tutor's previous turn, i.e. the
   *  question <student_answer> responds to. Added 2026-07-29
   *  (portal-efe6b838-5bbb-49d4-9824-6245a656ddf8): without it the
   *  judge passed a false "Not quite" on a correct answer — it had no
   *  way to know what was asked. */
  questionContext?: string;
}

interface JudgeIssue {
  claim: string;
  why: string;
  /** "kill" → orchestrator kills the attempt + retries. Reserved for
   *  CONCRETE numeric / dataset / literal contradictions of board
   *  content that produce an obvious chat-board mismatch. "advisory"
   *  → logged, no kill (default). Older judge responses without
   *  severity default to "advisory" client-side. */
  severity?: 'kill' | 'advisory';
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

// System prompt + user-content assembly live in @/lib/tutor/judge-prompt
// (route files may only export HTTP handlers; the lib is unit-testable).

function badRequest(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Find the first balanced {...} object in a string, ignoring braces
 *  inside string literals. Returns the substring or null if none.
 *  Used to pull JSON out of Haiku responses that sometimes wrap the
 *  JSON in code fences AND add explanation prose around it (observed
 *  2026-04-29 geometry session). */
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

  const userContent = buildJudgeUserContent(body);

  const t0 = Date.now();
  try {
    const resp = await anthropic.messages.create(prepareParams('judge', {
      model: JUDGE_MODEL_ID,
      max_tokens: MAX_TOKENS,
      system: [
        { type: 'text' as const, text: JUDGE_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' as const } },
      ],
      messages: [{ role: 'user' as const, content: userContent }],
    }));
    const ms = Date.now() - t0;

    // Pull the first text block out of the response.
    const textBlock = resp.content.find((b) => b.type === 'text');
    const raw = (textBlock && textBlock.type === 'text') ? textBlock.text.trim() : '';

    let parsed: { grounded?: boolean; issues?: JudgeIssue[] } | null = null;
    try {
      // Robust extraction: walk the raw string and pull out the first
      // top-level {...} object via a brace counter that respects string
      // literals. Handles every observed failure mode:
      //   - prose before JSON
      //   - prose after JSON
      //   - fenced code blocks (with or without `json` tag)
      //   - fenced JSON followed by explanation prose (the 2026-04-29
      //     geometry session: ```json\n{...}\n```\n\nThe tutor's...)
      //   - nested braces inside the JSON itself
      //   - braces inside string literals (e.g., {"claim":"x = {3}"})
      const jsonStr = extractFirstJsonObject(raw);
      if (jsonStr) parsed = JSON.parse(jsonStr);
    } catch {
      // Live 2026-09-05: unescaped inner quotes in a claim string. Repair
      // before failing open — a flagged issue was lost that way.
      const repaired = repairJudgeJson(raw);
      if (repaired) {
        parsed = { ...(repaired.grounded !== undefined ? { grounded: repaired.grounded } : {}), issues: repaired.issues as JudgeIssue[] | undefined };
        console.warn(`[tutor/judge] parse failed; repaired via ${repaired.method} (issues=${repaired.issues?.length ?? 0})`);
      } else {
        console.warn('[tutor/judge] failed to parse JSON; raw=', raw.slice(0, 200));
      }
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
