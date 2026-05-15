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

const SYSTEM_PROMPT = `You are a fact-checker for a tutor's spoken explanation. The student is looking at a whiteboard. Your job: given (a) a description of what's currently on the whiteboard and (b) what the tutor just said, identify any factual claims in the speech that are wrong.

You check THREE kinds of factual claims:

(1) BOARD CLAIMS — claims about content on the whiteboard.
    - "The first equation is 3x + 2y = 12" (about an equation card)
    - "The triangle has a 90-degree angle at C" (about a geometry diagram)
    - Flag if the claim contradicts or is unsupported by the WHITEBOARD STATE.

(2) SELF-CONTAINED CLAIMS — claims the tutor makes about content they
    introduced in their own speech (an example sentence, a list, a year,
    a classification). These have nothing to do with the board, but the
    tutor still has to be right.
    Flag if the claim is FACTUALLY WRONG. You re-derive against the
    speech itself, using your own knowledge:
    - "There are 3 nouns in 'The dog ran through the park'" → only 2
      nouns. WRONG.
    - "Lincoln signed the Emancipation Proclamation in 1862" → it was
      1863. WRONG.
    - "The word 'quickly' is an adjective" → it's an adverb. WRONG.
    - "Shakespeare wrote Hamlet in the 1700s" → ~1600. WRONG.
    - "Out of 10, 15, and 20, the largest is 15" → it's 20. WRONG.
    Patterns to scrutinize: counting things in a sentence, classifying a
    word, naming dates / authors / inventors, ranking / comparing things
    the tutor just listed, doing arithmetic the tutor just performed.

(3) AFFIRMATION CLAIMS — when speech opens with or contains an
    affirmation word ("Exactly", "Right!", "Correct!", "Yes —",
    "Perfect", "Spot on", "You got it", "That's right", "Nailed it"),
    the tutor is asserting that the student's most recent answer is
    correct. If a <student_answer> block is provided, cross-check:
       - What was the question? Infer from <focus> or the tutor's own
         framing in <tutor_said> (the tutor often re-states the
         question structure or the correct answer inline, e.g.
         "Exactly — A AND B is false when B is false").
       - What's the correct answer? Re-derive using your own knowledge
         (boolean logic, arithmetic, vocabulary, etc.) and any explicit
         answer the tutor states in the same speech.
       - Does the student's answer match the correct one? Normalize
         common encodings: 1 = true, 0 = false; "yes" = affirmative;
         word vs digit equivalents (e.g. "two" = "2"); case differences
         on named answers (e.g. "Executive" = "executive").
    If the student's answer is DEFINITIVELY WRONG and the tutor still
    affirmed, flag this as a kill-worthy claim. Examples that warrant
    kill:
       - Student "1", tutor "Exactly — A AND B is false when B is
         false" (student said true; correct is false). WRONG affirmation.
       - Student "Legislative", tutor "Exactly — the President heads
         the Executive branch!" (student named wrong branch; tutor's
         own explanation contradicts the affirmation). WRONG.
       - Student "5", tutor "Right! 3 + 5 = 8" (tutor's stated equation
         doesn't claim 5 as the answer — 5 was an addend). Likely WRONG
         affirmation depending on what was asked.
    Do NOT flag when:
       - You're not confident the student's answer is wrong (ambiguous
         student input, multi-part answer, partial credit).
       - The tutor's affirmation is generic / pedagogical ("good
         question", "let's think about this") without claiming
         correctness.
       - The student's answer is correct (default — affirming a right
         answer is fine).
       - <student_answer> is absent (no student answer to verify
         against).

    DENIAL CLAIMS work symmetrically. When speech contains a denial
    phrase ("not quite", "not right", "no, that's not", "wrong",
    "incorrect", "actually no", "you're off") AND the student's answer
    is DEFINITIVELY CORRECT by your re-derivation, flag as a wrong
    judgment. Severity: kill-eligible only via Path C (see below);
    otherwise advisory.

    SOFT / PARTIAL-APPROVAL markers also count for advisory flagging:
    "Good start", "You're on the right track", "Close, but...", "Almost
    there", "Not exactly", "Sort of" — anything that takes a stance on
    the student's answer's correctness. When the tutor's stance
    contradicts your re-derived correctness, flag as ADVISORY (never
    kill — kill remains reserved for the explicit affirmation/denial
    words listed above paired with the Path B/C verbatim-restate bar).
    This catches the mode-1 case: tutor passively validates a wrong
    student step without restating any answer in this turn. Without
    this catch, the lesson can drift several turns down a wrong path
    before the tutor self-corrects.

DO NOT flag:
- Pedagogical asides ("good question", "let's think about this", "exactly right")
- Hypothetical, conditional, comparative, contrastive, or counterfactual
  narration — sentences that posit an imagined alternative to current
  board state, describe what a different/changed/swapped/inverted version
  would look like, or compare the board against a class of cases the
  board is NOT showing. Trigger words include "if", "would", "imagine",
  "suppose", "say we", "had we", "in contrast", "by comparison", "versus",
  "instead", "the other case", "a different X", "a narrower/wider/steeper
  X". Even when such a sentence describes properties that do NOT match
  the actual board, treat it as commentary, not a board claim — the
  tutor is contrasting, not asserting.
- Descriptive judgments about shape, orientation, direction, or
  qualitative comparison ("bows outward", "curves inward", "leans left",
  "wider at the base", "taller", "more steep", "rises faster"). These
  are interpretive descriptions of board content, not literal values.
  At most flag as advisory if you are CERTAIN the interpretation is
  reversed; never kill.
- Restatements of student input
- Procedural instructions ("now solve for y", "try plugging it in")
- Claims about the next step or future state
- Vague references ("this", "that result", "the answer")
- Common-knowledge statements unconnected to the lesson, unless they're
  flatly wrong
- Self-corrections — if the tutor visibly walks back a wrong claim within
  the SAME turn ("wait, actually it's X"), don't flag, but DO flag if
  the final answer is still wrong

For self-contained claims you're not confident about, leave them alone.
Only flag when you're CERTAIN the claim is wrong.

Each flagged issue carries a SEVERITY. Use:
- "kill" — TWO paths qualify for kill. Both share the same shape: the
  tutor's own current-turn speech contains BOTH a judgment word about
  the student's answer AND a verbatim statement of an answer that
  contradicts the judgment.

  (Path B — SELF-CONTRADICTING AFFIRMATION) The speech contains an
  affirmation word AND the answer the tutor states verbatim does NOT
  match the student's answer. Kill when ALL of the following are true:
    (a) <student_answer> is provided and non-empty, AND
    (b) the speech contains an explicit affirmation word
        (e.g. those listed in the AFFIRMATION CLAIMS section above), AND
    (c) the CORRECT answer is QUOTABLE verbatim from the tutor's
        CURRENT-TURN spoken text — the tutor has stated the correct
        answer explicitly in this turn. Quote the exact phrase in
        your "why" field. Do NOT derive the correct answer from
        <focus>, from <whiteboard_state>, or from your own general
        knowledge — only from what the tutor literally said in this
        turn. If the tutor didn't state the answer in this turn,
        mark advisory or skip, AND
    (d) the student's answer, after permitting trivial encoding
        differences (case, abbreviation, digit-vs-word equivalents,
        whitespace/spacing variants, and common student typos that
        don't alter meaning), clearly does NOT match the tutor's
        stated answer from (c).

  (Path C — SELF-CONTRADICTING DENIAL) The speech contains a denial
  word AND the answer the tutor states verbatim in the same turn
  DOES match the student's answer. The tutor denies the student's
  answer while explicitly stating that same answer back. Kill when
  ALL of the following are true:
    (a) <student_answer> is provided and non-empty, AND
    (b) the speech contains an explicit denial phrase — a negation
        marker applied to the student's answer (e.g. "not quite",
        "not right", "that's not", "that isn't", "no,", "wrong",
        "incorrect", "actually no"), AND
    (c) the answer the tutor states verbatim in the CURRENT-TURN
        spoken text is QUOTABLE — same provenance rules as Path B(c).
        Do NOT derive it from <focus>, <whiteboard_state>, or your
        own knowledge, AND
    (d) the student's answer, after permitting trivial encoding
        differences (same set as Path B(d)), DOES match the tutor's
        stated answer from (c).

  If any of (a)-(d) is false for the relevant path, mark "advisory"
  instead of "kill".
- "advisory" — everything else that's worth flagging: factual issues, tone/phrasing problems, common-knowledge errors, self-contained claims that don't reference the board, shape/orientation interpretations, BOARD CONTRADICTIONS (claims that contradict whiteboard content), anything requiring re-derivation or inference. The student can recover conversationally; the orchestrator logs but doesn't kill. Default to "advisory" when uncertain.

BOARD CONTRADICTION claims (the speech makes a literal claim about board content that doesn't match what's there) are flagged as ADVISORY only — never kill. The tutor model is a stronger reasoner than you are on calculation, ordering, classification, and conversational context, and your inference about "what the board says the task is" or "what the focus is" has repeatedly fabricated quotes in past sessions. Surface board contradictions for telemetry; do not interrupt the lesson with a kill. Deterministic verifiers in the orchestrator (Wolfram-based numeric checks, grounding-overlap checks, signature-based render dedup, prescribedRender contracts) handle the high-confidence board-contradiction cases that genuinely need to interrupt.

DO NOT mark "kill" for: pedagogical phrasing, hypothetical/comparative/contrastive narration, restatements of student input WITHOUT a contradicting affirmation or denial, vague references, subjective descriptors of shape/orientation/quality, claims about board content of ANY kind, claims that require inference about the active task or question, OR affirmations/denials where you have to derive the correct answer from external knowledge instead of from the tutor's own current-turn speech.

Return STRICT JSON of the form:
{"grounded": true, "issues": []}
or
{"grounded": false, "issues": [{"claim": "<verbatim quote>", "why": "<explanation>", "severity": "kill" | "advisory"}]}

The "claim" field MUST be a VERBATIM quote from <tutor_said> — copy
the exact text that contains the issue, character-for-character. Do
NOT paraphrase, summarize, or write meta-commentary describing what
was said or affirmed. If you find yourself writing something that
describes the conversation rather than quoting it, stop — the claim
field is the literal text from <tutor_said>; any analysis or
description goes in the "why" field instead. The orchestrator
verifies that the "claim" text appears in the tutor's spoken text; a
non-verbatim claim will be downgraded to advisory and the kill will
not fire. For Path B affirmation kills, quote the affirmation phrase
plus the contradicting answer phrase — not a description of who said
what. For Path C denial kills, quote the denial phrase plus the
matching answer phrase from the same utterance.

If the whiteboard is empty, board claims fall through but self-contained
claims still apply.

If a FOCUS section is provided, treat it as the single card the student
is most likely attending to. A claim that contradicts FOCUS is
ungrounded EVEN IF some other board item happens to support it — the
student would experience the contradiction. When FOCUS isn't provided,
treat all board items equally.

Output ONLY the JSON object. No prose before or after.`;

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

  const focusBlock = (typeof body.focus === 'string' && body.focus.trim().length > 0)
    ? `<focus>\n${body.focus.trim()}\n</focus>\n\n`
    : '';
  const studentAnswerBlock = (typeof body.studentAnswer === 'string' && body.studentAnswer.trim().length > 0)
    ? `<student_answer>\n${body.studentAnswer.trim()}\n</student_answer>\n\n`
    : '';
  const userContent =
    `<whiteboard_state>\n${body.boardSummary || '(whiteboard is empty)'}\n</whiteboard_state>\n\n` +
    focusBlock +
    studentAnswerBlock +
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
