/**
 * Verdict pre-check — the parts both sides use (TEXT mode, 2026-10-06).
 *
 * The pre-check itself is a small model call made on the server before the
 * brain call of an answer-shaped text turn (./verdict-precheck.ts). This file
 * is what the server AND the browser need of it, with no SDK import:
 *   - the result types, and the reduced "public" form that is sent to the
 *     browser (it never carries the correct value — the browser must not hold
 *     the answer to the student's homework);
 *   - the per-turn <answer_check> block the brain reads;
 *   - the two uses the browser makes of the result BEFORE and AFTER display:
 *       `precheckOpenerContradiction` — a tutor opener that contradicts a
 *         high-confidence check is killed and retried once, never shown;
 *       `precheckCreditOverride` — the counting path (pacing streaks, the
 *         struggle ledger) does not count a correct answer the tutor denied
 *         as wrong, nor a wrong or off-target one it praised as correct.
 *
 * Only a HIGH-confidence check kills or moves a count. A medium one informs
 * the brain and nothing else; a low one, a failure or a timeout is as if the
 * check had never run.
 *
 * Wording is generic — no subject content, no example values (repo rule).
 * Pure; never throws. `npm run test:verdict-precheck`.
 */
import { opensWithAffirmingVerdict } from '@/lib/tutor/voice/nonanswer-praise';
import { TUTOR_OTHER_PART_NO_GIVEAWAY, TUTOR_PRECHECK_DIFFERS_AT, TUTOR_WRONG_WHOLE_ANSWER_NO_REVEAL } from '@/lib/tutor/orchestrator/turn-round-flags';

/** Which question the student's message answers. */
export type PrecheckTarget =
  /** The tutor's last question, as asked. */
  | 'open_question'
  /** The problem being worked — its final answer or a named part of it —
   *  rather than the step the tutor had just asked about. */
  | 'overall_problem'
  /** A different problem or part from the one being worked. */
  | 'other_part'
  /** None of them. */
  | 'neither';

export type PrecheckVerdict = 'correct' | 'incorrect' | 'partly_correct' | 'cannot_determine';
export type PrecheckConfidence = 'high' | 'medium' | 'low';

/** What the browser is told (and echoes back on a retry of the same turn). */
export interface PublicVerdictPrecheck {
  answers: PrecheckTarget;
  /** Short name of the question it answers ("the final answer of part (b)"). */
  target: string;
  /** What the student's message proposes. */
  proposed: string;
  verdict: PrecheckVerdict;
  confidence: PrecheckConfidence;
  /** What a wrong answer does not agree with — a condition, quantity or
   *  relationship of the problem, by name. Carries no value (see
   *  verdict-precheck.ts `safeDiffersAt`). Absent when the check named none. */
  differsAt?: string;
  /** 2026-10-19 (homework ledger, lesson-plan/homework-ledger.ts): the list
   *  POSITION (1-based) of the student's homework problem whose complete
   *  final answer the message states, as the check found it. A problem
   *  number reveals nothing. Absent unless the ledger is on for the session
   *  and the check named one. */
  solvedProblem?: number;
  /** 2026-10-15: EVERY position the check found solved (one message can
   *  complete several; `solvedProblem` is the first of them). */
  solvedProblems?: number[];
  /** 2026-10-15: the list position of the homework problem the message is
   *  about, when the check named one. Ledger only. */
  aboutProblem?: number;
  /** 2026-10-15 (GAC v7 audit): the list positions of the problems this
   *  message stated an answer for that the check judged WRONG (its
   *  `stated_answers`). A problem number reveals nothing. Ledger only. */
  wrongProblems?: number[];
  /** 2026-10-16 (GAC v12, Precalc): the stated value is a decimal rounding of
   *  the exact answer — the right value, not yet in the form asked for. The
   *  flag reveals nothing (the student wrote the decimal). Ledger only. */
  roundedDecimal?: true;
  /** 2026-10-16 (GAC v12): two independent checks disagreed about a CORRECT
   *  finding — no verdict either way; the student shows how they got it. */
  disputed?: true;
  /** 2026-10-16 (GAC v16): the first wrong operation of the student's own
   *  working, in their numbers, with no result. Ledger only. */
  wrongStep?: string;
}

/** The full result; `correctValue` stays on the server. */
export interface VerdictPrecheckResult extends PublicVerdictPrecheck {
  correctValue: string;
  /** The check's own test behind `differsAt` (it carries values): logs only. */
  differsTest?: string;
  model: string;
  ms: number;
  inputTokens: number;
  outputTokens: number;
}

const TARGETS: ReadonlySet<string> = new Set(['open_question', 'overall_problem', 'other_part', 'neither']);
const VERDICTS: ReadonlySet<string> = new Set(['correct', 'incorrect', 'partly_correct', 'cannot_determine']);
const CONFIDENCES: ReadonlySet<string> = new Set(['high', 'medium', 'low']);

/** One line of plain text, bounded: nothing that could close or open a block. */
function line(v: unknown, max: number): string {
  return String(v ?? '').replace(/[<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

/** Validate a public pre-check that came over the wire (the SSE frame on the
 *  browser, the echoed body field on the server). Null when it is not one. */
export function sanitizePublicPrecheck(v: unknown): PublicVerdictPrecheck | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const o = v as Record<string, unknown>;
  if (!TARGETS.has(String(o.answers)) || !VERDICTS.has(String(o.verdict)) || !CONFIDENCES.has(String(o.confidence))) return null;
  return {
    answers: o.answers as PrecheckTarget,
    target: line(o.target, 160),
    proposed: line(o.proposed, 200),
    verdict: o.verdict as PrecheckVerdict,
    confidence: o.confidence as PrecheckConfidence,
    ...differsAtField(o.differsAt),
    ...solvedProblemField(o.solvedProblem),
    ...solvedProblemsField(o.solvedProblems),
    ...aboutProblemField(o.aboutProblem),
    ...wrongProblemsField(o.wrongProblems),
    ...(o.roundedDecimal === true ? { roundedDecimal: true as const } : {}),
    ...(o.disputed === true ? { disputed: true as const } : {}),
    ...wrongStepField(o.wrongStep),
  };
}

function isPosition(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 25;
}

function solvedProblemsField(v: unknown): { solvedProblems?: number[] } {
  if (!Array.isArray(v) || v.length > 25 || !v.every(isPosition)) return {};
  const list = [...new Set(v)].sort((a, b) => a - b);
  return list.length ? { solvedProblems: list } : {};
}

function wrongProblemsField(v: unknown): { wrongProblems?: number[] } {
  if (!Array.isArray(v) || v.length > 25 || !v.every(isPosition)) return {};
  const list = [...new Set(v)].sort((a, b) => a - b);
  return list.length ? { wrongProblems: list } : {};
}

function wrongStepField(v: unknown): { wrongStep?: string } {
  const at = typeof v === 'string' ? line(v, 160) : '';
  return at ? { wrongStep: at } : {};
}

function aboutProblemField(v: unknown): { aboutProblem?: number } {
  return isPosition(v) ? { aboutProblem: v } : {};
}

function solvedProblemField(v: unknown): { solvedProblem?: number } {
  return typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 25 ? { solvedProblem: v } : {};
}

function differsAtField(v: unknown): { differsAt?: string } {
  const at = typeof v === 'string' ? line(v, 160) : '';
  return at ? { differsAt: at } : {};
}

export function toPublicPrecheck(r: VerdictPrecheckResult): PublicVerdictPrecheck {
  return { answers: r.answers, target: line(r.target, 160), proposed: line(r.proposed, 200), verdict: r.verdict, confidence: r.confidence, ...differsAtField(r.differsAt), ...solvedProblemField(r.solvedProblem), ...solvedProblemsField(r.solvedProblems), ...aboutProblemField(r.aboutProblem), ...wrongProblemsField(r.wrongProblems), ...(r.roundedDecimal === true ? { roundedDecimal: true as const } : {}), ...(r.disputed === true ? { disputed: true as const } : {}), ...wrongStepField(r.wrongStep) };
}

/** Does this check say anything the brain should be told? Low confidence and
 *  "cannot determine" say nothing — the turn then runs as it did before. */
export function precheckInforms(p: PublicVerdictPrecheck | null | undefined): p is PublicVerdictPrecheck {
  if (!p || p.confidence === 'low') return false;
  if (p.answers === 'neither' || p.disputed === true) return true;
  return p.verdict !== 'cannot_determine';
}

/** Is this check strong enough to kill a reply or move a count? */
export function precheckDecides(p: PublicVerdictPrecheck | null | undefined): p is PublicVerdictPrecheck {
  return precheckInforms(p) && p.confidence === 'high' && (p.answers === 'neither' || p.verdict === 'correct' || p.verdict === 'incorrect');
}

function q(s: string): string {
  return `"${s.replace(/"/g, "'")}"`;
}

/**
 * The per-turn <answer_check> block. '' when the check does not inform.
 * `correctValue` is rendered only when given (the first attempt of the turn;
 * a retry re-renders from the public form and has none).
 */
export function formatAnswerCheckBlock(
  p: PublicVerdictPrecheck | null | undefined,
  opts?: {
    correctValue?: string;
    /** "Work it, then match" (./work-then-match.ts): the reply opens with the
     *  working, so the block asks for working that reaches the checked value
     *  and a match statement that agrees with the check — not for a verdict
     *  opener. Unset/false ⇒ the block as before. */
    workThenMatch?: boolean;
    /** Unset ⇒ TUTOR_OTHER_PART_NO_GIVEAWAY; false ⇒ the other-part wording
     *  of 2b58aacf. */
    otherPartNoGiveaway?: boolean;
    /** Unset ⇒ TUTOR_WRONG_WHOLE_ANSWER_NO_REVEAL; false ⇒ a wrong answer to
     *  the whole problem is worded like a wrong step (2026-10-06). Read only
     *  under `workThenMatch`. */
    wrongWholeAnswerNoReveal?: boolean;
    /** Unset ⇒ TUTOR_PRECHECK_DIFFERS_AT; false ⇒ what the answer does not
     *  agree with is not rendered. Read only on the wrong-whole-answer
     *  branch. */
    differsAt?: boolean;
    /** 2026-10-19 (no-reveal-ledger-gate.ts): a wrong answer at ANY step —
     *  not only to the whole problem — gets no correct value and the
     *  `WRONG_STEP_NO_REVEAL_RULE`. Unset/false ⇒ the block as before. */
    noRevealAnyStep?: boolean;
    /** 2026-10-19: a non-answer that states a FALSE claim gets the
     *  `FALSE_CLAIM_RULE` instead of the non-answer rule. Unset/false ⇒ as
     *  before. */
    claimCorrection?: boolean;
    /** 2026-10-15: under the ledger, every listed problem is solved — a
     *  correct repeat of one of their answers gets `ALL_SOLVED_CORRECT_RULE`. */
    allSolved?: boolean;
    /** 2026-10-15: the ledger's solved positions before this message — a
     *  wrong answer to one of them gets `SOLVED_PROBLEM_WRONG_RULE`. */
    solved?: readonly number[];
    /** 2026-10-15 (GAC v7): the listed problems' numbers, by position. */
    labels?: readonly number[];
    /** 2026-10-15 (GAC v8): the position of the problem being worked. */
    current?: number;
  },
): string {
  if (!precheckInforms(p)) return '';
  if (p.disputed === true) {
    return '<answer_check>\n'
      + 'Before this turn the student\'s message was checked twice, independently, from their own problem and data. The student does not see this.\n'
      + (p.proposed ? `- The student's message proposes: ${q(p.proposed)}.\n` : '')
      + DISPUTED_CHECK_RULE
      + 'Never mention this check to the student.\n'
      + '</answer_check>\n\n';
  }
  p = asCurrentProblem(p, opts);
  if (opts?.workThenMatch === true) return formatAnswerCheckBlockWorkThenMatch(p, opts.correctValue, opts);
  const proposed = (p.proposed ? `- The student's message proposes: ${q(p.proposed)}.\n` : '') + perProblemLines(p, opts);
  const named = p.target ? ` (${p.target})` : '';
  const head = '<answer_check>\n'
    + 'Before this turn the student\'s message was checked independently, from their own problem and data. The student does not see this.\n';
  const tail = 'If your own working disagrees with this check, redo it once from the student\'s own problem. If you still disagree, give no verdict either way: ask them to show how they got it.\n'
    + 'Never mention this check to the student.\n'
    + '</answer_check>\n\n';
  // 2026-10-15 (GAC staging v6): checked first — a wrong doubt about a solved
  // problem came back as a wrong WHOLE answer or a false claim, and those
  // branches reopened the problem.
  if (opts?.noRevealAnyStep === true && wrongOnSolvedProblem(p, opts)) {
    return head + proposed + '- Checked: it is NOT right.\n' + SOLVED_PROBLEM_WRONG_RULE + tail;
  }
  if (p.answers === 'neither') {
    if (falseClaimChecked(p, opts)) return head + proposed + FALSE_CLAIM_RULE + tail;
    return head + proposed
      + `- It does NOT answer the question you last asked, nor the problem being worked${named}.\n`
      + 'What to do: no verdict or praise word. Do not treat the message as an answer and do not answer your open question for them — respond to what they wrote: ask what it refers to, or ask the open question again. Do not tell them it "is not an answer" — just ask.\n'
      + tail;
  }
  const where = p.answers === 'open_question'
    ? `- It answers: the question you last asked${named}.\n`
    : p.answers === 'overall_problem'
      ? `- It answers: the problem being worked${named} — NOT the smaller step you had just asked about.\n`
      : `- It answers: a different problem or part from the one you were on${named}.\n`;
  const elsewhere = p.answers !== 'open_question';
  if (p.verdict === 'correct') {
    return head + proposed + where
      + '- Checked for that question: CORRECT.\n'
      + (p.answers === 'overall_problem'
        ? 'What to do: open by crediting it explicitly as the right answer to that — never "Not quite", and never a correction for not answering the step you asked about. Then decide whether the step is still worth doing (for instance to have them show how they got there) or whether to move on.\n'
        : elsewhere
          ? (otherPartNoGiveaway(opts)
            ? OTHER_PART_CORRECT_RULE
            : 'What to do: it is right for THAT, and it is not an answer to the question you asked just now. Say both, briefly — never "Not quite" about a value that is right for what it answers, and no praise as though it answered your question — then return to the question you asked.\n')
          : 'What to do: open by telling them it is right. Never "Not quite", and do not ask them to check it again.\n')
      + tail;
  }
  if (p.verdict === 'incorrect') {
    if (opts?.noRevealAnyStep === true) {
      return head + proposed + where + '- Checked for that question: INCORRECT.\n' + WRONG_STEP_NO_REVEAL_RULE + tail;
    }
    const value = opts?.correctValue
      ? ` The correct value is ${q(line(opts.correctValue, 200))} — this is for your judgement only; the session's rules about not giving answers away still apply.`
      : '';
    return head + proposed + where
      + `- Checked for that question: INCORRECT.${value}\n`
      + 'What to do: say plainly and kindly that it is not right — no praise word first, and no "Right" followed by a correction — then guide them toward it.\n'
      + tail;
  }
  return head + proposed + where
    + '- Checked for that question: PARTLY correct — part of what the question asks for is right, and something is missing or wrong.\n'
    + (opts?.noRevealAnyStep === true && partlyWrongOnSolvedProblem(p, opts)
      ? PARTLY_SOLVED_DOUBT_RULE
      : 'What to do: say exactly what is right and what is missing or wrong. Do not open with unqualified praise, and do not open with a flat denial.\n')
    + tail;
}

// ── 2026-10-06c: right for another part — never a give-away ────────────────
//
// portal-c301c9ad @77.3 s: the tutor had just introduced the next part; the
// student offered a value for it that is right only for a LATER part. The
// block said "state both as facts", and the reply wrote "<that part> = <their
// value>, but …" on the board — a false equation — and then supplied that
// part's real answer. The student is working the part they offered it for.

/** Unset ⇒ TUTOR_OTHER_PART_NO_GIVEAWAY. */
function otherPartNoGiveaway(opts?: { otherPartNoGiveaway?: boolean }): boolean {
  return opts?.otherPartNoGiveaway ?? TUTOR_OTHER_PART_NO_GIVEAWAY;
}

const OTHER_PART_GUARD =
  'If they offered it for the part you had just introduced or are working on, that part is the one to judge it against: their value is not its answer. Never state or write the answer to the part the student is working on, and never write their value as that part\'s result — no equation, board line or sentence that gives that part\'s result as their value. Ask one guiding question about what is different in that part instead.';

export const OTHER_PART_CORRECT_RULE =
  `What to do: it is right for THAT, and it is not an answer to the question you asked just now — no "Not quite" about the value itself, and no praise as though it answered your question. ${OTHER_PART_GUARD} Otherwise (they meant THAT), say briefly that it is right for THAT and return to the question you asked.\n`;

export const OTHER_PART_CORRECT_RULE_WORK_THEN_MATCH =
  `What to do: your match statement must agree with the check — it is the right value for THAT, and it is not an answer to the question you asked just now. ${OTHER_PART_GUARD} Otherwise (they meant THAT), say briefly that it is right for THAT and return to the question you asked.\n`;

// 2026-10-15 (GreenApple staging, AP Chemistry): both problems were solved and
// the tutor had said so; the student repeated problem 1's answer, the check
// classed it "other_part / correct", and "return to the question you asked"
// brought back a question about the solved problem ("what's 180 divided by
// 30?"). Under the ledger there may be nothing to return to.
export const OTHER_PART_NOTHING_OPEN_RULE =
  'Return to a question only if it is still open: if your last message asked nothing, or what you asked was about a problem the software already records as solved, there is nothing to return to — say briefly that it is right and already done, then carry on with the next unsolved problem, or, when none is left, say the homework is done.\n';

// 2026-10-15 (staging, Algebra II and AP Chemistry, second run): every
// problem was solved and recorded; the student repeated an earlier answer, and
// the reply said it was done — then asked again for a step of a solved
// problem ("what do you get when you solve …?").
/**
 * 2026-10-15 (GAC staging v5, AP Biology): both problems were recorded solved;
 * the student then doubted one with a wrong alternative, and the tutor taught
 * that problem again from its first step and kept asking about it until the
 * session ended. A wrong answer to a problem the ledger holds as solved does
 * not reopen it. The earlier answer is not restated (it is also the check's
 * withheld value). Generic.
 */
export const SOLVED_PROBLEM_WRONG_RULE =
  'What to do: the software\'s record shows the student already solved THAT problem correctly earlier in the session, so their earlier answer stands and the problem stays finished. Say kindly, in a sentence or two, that this new answer is not right and that the answer they gave before was — with one short reason in general terms — but do not write out the earlier answer or any value. When their message is a question or a wrong claim about a DETAIL of that solved answer — its unit, its sign, its form or its wording — answer the detail plainly in one sentence with its reason (the unit follows from the quantity, the sign from the direction): the problem is solved, so this gives nothing away, and leaving a wrong belief uncorrected is a teaching failure. Never wave it off as already settled. Do not reopen the problem: ask no question about it and do not ask them to work any step of it again. Then carry on with the next unsolved problem, or, when every problem is solved, offer to stop or to look at something else.\n';

/**
 * 2026-10-15 (GAC v7, Physics): "<right answer to b> and <wrong answer to c>"
 * came back PARTLY correct for "the problem being worked" (b), and the reply
 * told the student their answer to b was wrong. Under the ledger, a message
 * that answers more than one problem gets one line per problem. Positions
 * only; no values.
 */
export function perProblemLines(p: PublicVerdictPrecheck, opts?: { noRevealAnyStep?: boolean; solved?: readonly number[]; labels?: readonly number[] }): string {
  if (opts?.noRevealAnyStep !== true) return '';
  const before = opts.solved ?? [];
  const right = (p.solvedProblems ?? []).filter((pos) => !before.includes(pos));
  const wrong = (p.wrongProblems ?? []).filter((pos) => !right.includes(pos));
  if (right.length + wrong.length < 2) return '';
  const label = (pos: number) => opts.labels?.[pos - 1] ?? pos;
  return right.map((pos) => `- Problem ${label(pos)}: its answer in this message is RIGHT, and it is now solved — credit it by its number.\n`).join('')
    + wrong.map((pos) => `- Problem ${label(pos)}: its answer in this message is NOT right${before.includes(pos) ? ' (it was already solved earlier)' : ''}.\n`).join('')
    + '- Each problem is judged on its own in the lines above; what follows is about the message as a whole. Never call a problem marked RIGHT above wrong.\n';
}

/**
 * 2026-10-15 (GAC v8, Algebra II): the tutor's question was a step of its own
 * method ("which two numbers multiply to … and add to …?"); the student gave
 * one value of the final answer of that same problem ("a is 3"). The check
 * classed it "other_part", the block said "a different problem or part", and
 * the reply took the value for a step of its method and called the student's
 * other value wrong. Under the ledger, an answer about the problem being
 * worked is rendered as an answer to that problem.
 */
function asCurrentProblem(p: PublicVerdictPrecheck, opts?: { noRevealAnyStep?: boolean; current?: number }): PublicVerdictPrecheck {
  if (opts?.noRevealAnyStep !== true || p.answers !== 'other_part' || !opts.current || p.aboutProblem !== opts.current) return p;
  return { ...p, answers: 'overall_problem' };
}

/** A wrong answer, under the ledger, to a problem the ledger holds as solved.
 *  2026-10-15 (GAC v7 audit): also when the message is about several problems
 *  (no `aboutProblem`) and every answer judged wrong in it is for a solved one. */
function wrongOnSolvedProblem(p: PublicVerdictPrecheck, opts?: { solved?: readonly number[] }): boolean {
  if (p.verdict !== 'incorrect') return false;
  if (p.aboutProblem !== undefined && !!opts?.solved?.includes(p.aboutProblem)) return true;
  return !!p.wrongProblems?.length && p.wrongProblems.every((pos) => !!opts?.solved?.includes(pos));
}

/**
 * 2026-10-15 (GAC v7 audit): "<a right answer to an open problem>, also was
 * <a solved one> really <something else>?" is PARTLY correct as a whole, and
 * the partly rule asks one question to redo the wrong part — which reopened
 * the solved problem (the v6 bug through another branch). True when some
 * answer judged wrong in the message is for a problem the ledger holds as
 * solved.
 */
function partlyWrongOnSolvedProblem(p: PublicVerdictPrecheck, opts?: { solved?: readonly number[] }): boolean {
  return p.verdict === 'partly_correct' && !!p.wrongProblems?.some((pos) => !!opts?.solved?.includes(pos));
}

export const PARTLY_SOLVED_DOUBT_RULE =
  'Part of what it states is about a problem the software\'s record shows the student already solved correctly earlier: their earlier answer to THAT problem stands and it stays finished. Credit what is right, and say in a few words that their earlier answer to the solved one stands — without writing out that answer or any value. Ask no question about the solved problem and do not ask them to work any step of it again. If something is still missing or wrong on a problem that is NOT solved, ask about that one only. When every listed problem is solved, ask about none of them: offer to stop or to look at something else.\n';

export const ALL_SOLVED_CORRECT_RULE =
  'What to do: every one of the student\'s problems is already solved (the software\'s record), so this repeats an answer they already gave. Say in a few words that it is right and already done. Ask NO question about any problem, part or step of this homework — not one you asked earlier, and not a check of it. Offer to stop or to look at something else.\n';

// ── 2026-10-08: a wrong answer to the WHOLE problem — never the result ─────
//
// portal-09624999 @18.0 s: the student opened a homework session with a wrong
// final answer. The block gave the model the correct value "so that your own
// working can be held to it" and asked it to work "as far as the step where
// their working and yours part" and state that step's result. For an answer
// to the whole problem that step IS the final result, so the reply worked the
// problem and stated its answer. On this branch the value is not rendered at
// all — what the model is not given it cannot be led to state — and the reply
// says only that the working does not give what they wrote, then asks about
// the first thing in their reasoning to look at again.

/** Does the check say the student proposed a WRONG answer to the whole
 *  problem? True whenever the block for it is rendered (`precheckInforms`). */
export function wrongWholeAnswerChecked(p: PublicVerdictPrecheck | null | undefined, opts?: { enabled?: boolean }): boolean {
  if (!(opts?.enabled ?? TUTOR_WRONG_WHOLE_ANSWER_NO_REVEAL)) return false;
  return precheckInforms(p) && p.answers === 'overall_problem' && p.verdict === 'incorrect';
}

export const WRONG_WHOLE_ANSWER_RULE_WORK_THEN_MATCH =
  'What to do: your reply is two sentences, in this order, and it contains NO working at all — no step, no formula, no intermediate value and no result, in the reply or on the board. FIRST sentence: your match statement must agree with the check — state plainly, in everyday words, as a fact about THEIR answer, that it is not what the problem gives — naming no source other than the problem. Only that: do not describe, narrate or begin to show how the problem is worked. It comes before anything else, it is never left out, and it is not folded into the question. SECOND sentence: one question that points them to the first step in their reasoning that does not hold — never a step they did correctly. If they gave only a result, with none of the working behind it, there is no step of theirs to point to: ask how they got it instead — never send them to a step, quantity or value they did not write. Do NOT state the correct result — not in the reply and not on the board, and in no form: not the value, not a formula or expression evaluated to it, not a line of working that ends in it. Work the problem silently. The result stays theirs to find. This changes nothing in what the session\'s rules say about a student who asks outright to be given the answer.\n';

/** What a reply under that rule consists of — shared by every retry feedback
 *  for it (the opener kill in work-then-match.ts, the reveal guard in
 *  whole-answer-reveal.ts). Carries no value. */
export const WRONG_WHOLE_ANSWER_REEMIT =
  'Your reply is two sentences and contains no working at all — no step, no formula, no intermediate value and no result, in the reply or on the board: '
  + 'the first sentence states plainly, as a fact about their answer, that it is not what the problem gives; '
  // 2026-10-18 (GAC Chemistry, portal-484b007a): "the first thing in their
  // reasoning" sent the student back to their first step, which was right
  // (30 g/mol), when the slip was the division after it.
  + 'the second asks one question about the step in their working that does not hold — recompute each step they wrote, in order, and ask about the first one that is wrong; never question a step they did correctly. '
  // 2026-10-19 (GAC AP Chemistry portal-00153d15): told the slip was the
  // division, the retry said "that division itself isn't quite the issue".
  + 'You may quote that step in their own words and numbers to point at it — that shows nothing of yours. Never say that the step where their working goes wrong is fine or is not the issue. If they gave only a result, with none of the working behind it, there is no step of theirs to point to: ask how they got it instead — never send them to a step, quantity or value they did not write. ';

/** 2026-10-12 (portal-2000fd6a @73.3 s): told only INCORRECT and asked for
 *  "the first thing to re-examine", the reply sent the student to a condition
 *  their answer satisfied. When the check names what the answer does not
 *  agree with, the question goes there. */
export const WRONG_WHOLE_ANSWER_POINT_THERE =
  'The check names above what their answer does not agree with: your second sentence points them to THAT — by name, with no value — and to nothing else. Never send them to a part of the problem their answer already satisfies. When they wrote only a result with no working, ask how they got it, naming that part only as what to think about — never as a value they used.\n';

// ── 2026-10-19: a wrong answer at ANY step — never its result ──────────────
//
// GreenApple scripted sessions 2026-10-14, 5 of 13: the student answered the
// next part wrong; the check classed it "open_question / incorrect" (the
// tutor had just asked whether they were ready for that part), and the block
// said "work as far as the step where their working and yours part, state
// that step's result". When the step where they part is the last one, that
// result IS the answer — and the reply stated it ("… gives <value>, not
// <theirs>"). The same rule produced corrected intermediate lines. Under this
// rule no result is stated at any step: the reply names WHERE the working
// goes wrong and asks the student to redo it. The value is not rendered, and
// the server's reveal guard is armed for the turn (whole-answer-reveal.ts,
// `anyTarget`). Partner-gated: no-reveal-ledger-gate.ts.

/** 2026-10-16 (GAC v16): where THEIR working first goes wrong, as the check
 *  found it — the reply points there and nowhere else. */
function wrongStepLines(p: PublicVerdictPrecheck): string {
  if (!p.wrongStep) return '';
  return `- Where their working first goes wrong: ${q(line(p.wrongStep, 160))}.\n`
    + 'Point to exactly that step — not to an earlier step they did correctly — and ask them to redo it. Do not state its result. If they gave only a result, with none of the working behind it, there is no step of theirs to point to: ask how they got it instead — never send them to a step, quantity or value they did not write.\n';
}

export const WRONG_STEP_NO_REVEAL_RULE =
  'What to do: work it out silently and state no result of your own. FIRST sentence: say plainly, as a fact about THEIR answer, that it is not right — no praise word first. You may confirm a step of THEIR working that is right, in their own words and values. Then name the step or idea where their working goes wrong — what that step does, by name — without its result. If they gave only a result, with none of the working behind it, there is no step of theirs to point to: ask how they got it instead — never send them to a step, quantity or value they did not write. End with ONE question that has them redo that step themselves. Never state the correct result of that step, of any step after it, or of the question — not in the reply and not on the board, and in no form: not the value, not a corrected line of working that contains it, not an expression evaluated to it. The result stays theirs to find. When the answer is a word rather than a number (a term, a name, a structure, a category or a choice), naming the right one IS the result: do not name it, not even as a contrast with what they wrote. The same holds for a decision or conclusion (reject or not, converges or not, spontaneous or not, true or false): do not state which way it goes, and never assert one — ask what their own result says about it. This changes nothing in what the session\'s rules say about a student who asks outright to be given the answer.\n';

// ── 2026-10-19: a stated FALSE claim is corrected, not passed over ─────────
//
// GreenApple Biology 2026-10-14: "can you check my answer: <a false claim
// about the topic>". The check classed it "neither" (it answers none of the
// questions) — and the non-answer rule says "ask the open question again",
// so the tutor moved on and the misconception stood. The check now judges a
// stated claim even when it answers nothing (verdict-precheck.ts
// `CLAIM_VERDICT_RULE`), and a false one gets this rule.

export function falseClaimChecked(p: PublicVerdictPrecheck, opts?: { claimCorrection?: boolean }): boolean {
  return opts?.claimCorrection === true && p.answers === 'neither' && p.verdict === 'incorrect' && p.confidence !== 'low';
}

export const FALSE_CLAIM_RULE =
  '- It does not answer the question you last asked, nor one of the problems — but it states something about the subject that is NOT true.\n'
  + 'What to do: do not let it pass, and do not simply return to your question. Say plainly and kindly that the statement is not right — no praise word first — and correct it in a sentence or two with the reason, or ask one question that leads them to test it. Then return to where you were. Never treat it as an answer to your open question.\n'
  // 2026-10-15 (staging, Geometry): "check my answer" to an extra problem of
  // their own came here, and the reply worked that problem to its result.
  + 'If what they stated is their answer to a problem (a value or result), not a statement about the subject: do not give the right answer or the working that reaches it — say it is not right, name the step to look at again, and ask them to redo it.\n'
  // 2026-10-19 (GAC Biology portal-3f855241): "can you check my answer:
  // enzymes get used up in the reaction" got the true statement and its reason
  // in full — the answer they were asking about (TEST-CASES §2 7b).
  + 'If they asked you to check it as their answer: say plainly that it is not right, but do not state the true version or the fact that settles it — that is the answer. Ask one question that leads them to test their claim themselves.\n';

/** The same findings, worded for a reply that opens with the working. */
function formatAnswerCheckBlockWorkThenMatch(p: PublicVerdictPrecheck, correctValue?: string, opts?: { otherPartNoGiveaway?: boolean; wrongWholeAnswerNoReveal?: boolean; differsAt?: boolean; noRevealAnyStep?: boolean; claimCorrection?: boolean; allSolved?: boolean; solved?: readonly number[]; labels?: readonly number[]; current?: number }): string {
  p = asCurrentProblem(p, opts);
  const proposed = (p.proposed ? `- The student's message proposes: ${q(p.proposed)}.\n` : '') + perProblemLines(p, opts);
  const named = p.target ? ` (${p.target})` : '';
  const head = '<answer_check>\n'
    + 'Before this turn the student\'s message was checked independently, from their own problem and data. The student does not see this.\n';
  const tail = 'If your own working disagrees with this check, redo it once from the student\'s own problem. If you still disagree, state no match either way: ask them to show how they got it.\n'
    + 'Never mention this check to the student.\n'
    + '</answer_check>\n\n';
  // 2026-10-15 (GAC staging v6): checked first — a wrong doubt about a solved
  // problem came back as a wrong WHOLE answer or a false claim, and those
  // branches reopened the problem.
  if (opts?.noRevealAnyStep === true && wrongOnSolvedProblem(p, opts)) {
    return head + proposed + '- Checked: it is NOT right.\n' + SOLVED_PROBLEM_WRONG_RULE + tail;
  }
  if (p.answers === 'neither') {
    if (falseClaimChecked(p, opts)) return head + proposed + FALSE_CLAIM_RULE + tail;
    return head + proposed
      + `- It does NOT answer the question you last asked, nor the problem being worked${named}.\n`
      + 'What to do: no verdict of any kind, and no working-out of your open question on their behalf — respond to what they wrote: ask what it refers to, or ask the open question again. Do not tell them it "is not an answer" — just ask.\n'
      + tail;
  }
  const where = p.answers === 'open_question'
    ? `- It answers: the question you last asked${named}.\n`
    : p.answers === 'overall_problem'
      ? `- It answers: the problem being worked${named} — NOT the smaller step you had just asked about.\n`
      : `- It answers: a different problem or part from the one you were on${named}.\n`;
  if (p.verdict === 'correct') {
    // The student gave this value themselves, so stating it reveals nothing:
    // it is what the reply's own working has to arrive at.
    const checked = correctValue ? ` The check's own result: ${q(line(correctValue, 200))}.` : '';
    // Only for a repeat of a listed problem's answer — not for work on an
    // extra problem the student brought after the list was done.
    if (opts?.noRevealAnyStep === true && opts.allSolved === true && (p.solvedProblem !== undefined || p.answers === 'other_part')) {
      return head + proposed + where + `- Checked for that question: CORRECT.${checked}\n` + ALL_SOLVED_CORRECT_RULE + tail;
    }
    // 2026-10-19 (GAC AP Chemistry portal-00153d15): "check my answer x = 4"
    // on a formula question was checked CORRECT at medium confidence; the
    // reply wrote the whole solution on the board and called 4 "exactly
    // right". A whole answer the check is not sure of is not credited.
    if (opts?.noRevealAnyStep === true && p.answers === 'overall_problem' && p.confidence === 'medium') {
      return head + proposed + where + '- Checked for that question: PROBABLY correct, but the check is not sure what their answer means.\n' + UNSURE_CORRECT_RULE + tail;
    }
    if (opts?.noRevealAnyStep === true && (p.answers === 'overall_problem' || p.answers === 'open_question')) {
      return head + proposed + where + `- Checked for that question: CORRECT.${checked}\n` + CORRECT_GO_NO_FURTHER_RULE + tail;
    }
    return head + proposed + where
      + `- Checked for that question: CORRECT.${checked}\n`
      + (p.answers === 'overall_problem'
        ? 'What to do: your working must reach the checked value and your match statement must agree with the check — show the remaining step or steps briefly, reach the result, and say that it is the value they gave and that it is the final answer. Never send them back to the smaller step as though the value were wrong.\n'
        : p.answers === 'other_part'
          ? (otherPartNoGiveaway(opts)
            ? OTHER_PART_CORRECT_RULE_WORK_THEN_MATCH
            : 'What to do: your match statement must agree with the check — it is the right value for THAT, and it is not an answer to the question you asked just now. State both as facts, briefly, then return to the question you asked.\n')
            + (opts?.noRevealAnyStep === true ? OTHER_PART_NOTHING_OPEN_RULE : '')
          : 'What to do: your working must reach the checked value and your match statement must agree with the check — say that the result is the value they gave. Do not ask them to check it again.\n')
      + tail;
  }
  if (p.verdict === 'incorrect') {
    if (wrongWholeAnswerChecked(p, { enabled: opts?.wrongWholeAnswerNoReveal })) {
      // No correct value here, on the first attempt or on a retry.
      const at = (opts?.differsAt ?? TUTOR_PRECHECK_DIFFERS_AT) && p.differsAt ? line(p.differsAt, 160) : '';
      return head + proposed + where
        + '- Checked for that question: INCORRECT.\n'
        + (at ? `- What their answer does not agree with: ${q(at)}.\n` : '')
        + wrongStepLines(p)
        + WRONG_WHOLE_ANSWER_RULE_WORK_THEN_MATCH
        + (at ? WRONG_WHOLE_ANSWER_POINT_THERE : '')
        + tail;
    }
    if (opts?.noRevealAnyStep === true) {
      // 2026-10-19: no correct value, on the first attempt or on a retry.
      return head + proposed + where
        + '- Checked for that question: INCORRECT.\n'
        + (p.answers === 'other_part' ? '- It is an attempt at THAT problem or part, not at the question you asked just now.\n' : '')
        + wrongStepLines(p)
        + WRONG_STEP_NO_REVEAL_RULE
        + tail;
    }
    const value = correctValue
      ? ` The correct value is ${q(line(correctValue, 200))} — it is there so that your own working can be held to it.`
      : '';
    return head + proposed + where
      + `- Checked for that question: INCORRECT.${value}\n`
      + (p.answers === 'other_part'
        ? 'What to do: your working must reach the checked value and your match statement must agree with the check — it is an attempt at THAT problem or part, not at the question you asked just now. Work THAT as far as the step where their working and yours part, state that step\'s result, and say that it is not what they wrote and which step the difference is in. Do not state the result of the question you had asked.\n'
        : 'What to do: your working must reach the checked value and your match statement must agree with the check — work as far as the step where their working and yours part, state that step\'s result, and say that it is not what they wrote and which step the difference is in. The steps after that one stay with the student.\n')
      + tail;
  }
  if (opts?.noRevealAnyStep === true && p.roundedDecimal === true && !partlyWrongOnSolvedProblem(p, opts)) {
    return head + proposed + where
      + '- Checked for that question: the RIGHT VALUE as a rounded decimal; the problem asks for an exact form.\n'
      + ROUNDED_DECIMAL_RULE
      + tail;
  }
  if (opts?.noRevealAnyStep === true) {
    return head + proposed + where
      + '- Checked for that question: PARTLY correct — part of what the question asks for is right, and something is missing or wrong.\n'
      + (partlyWrongOnSolvedProblem(p, opts) ? PARTLY_SOLVED_DOUBT_RULE : PARTLY_NO_REVEAL_RULE)
      + tail;
  }
  return head + proposed + where
    + '- Checked for that question: PARTLY correct — part of what the question asks for is right, and something is missing or wrong.\n'
    + 'What to do: your working must reach the checked value and your match statement must agree with the check — state as facts which part your working confirms, and that the question asks for more or that a part differs. Ask for what is missing; do not supply it.\n'
    + tail;
}

/** 2026-10-19 (GAC APES portal-4b144435, AP Chemistry portal-00153d15): told
 *  to reach the checked value, the reply went past it — the student gave the
 *  formula and the reply worked out the number ("1000 − 600 = 400. That
 *  matches what you gave"); the student gave the multiplier and the reply
 *  built the molecular formula. Under the ledger, a right answer is confirmed
 *  and the next step stays the student's. */
export const CORRECT_GO_NO_FURTHER_RULE =
  'What to do: say plainly that it is right — a short reason is fine, in their own values. Go no further than what they wrote: do not work the next step, a value computed from theirs, or a final form built from it, in the reply or on the board, and never say they gave something they did not write. If the problem asks for more than what they wrote, ask them for that next step in one question. If what they wrote is the whole answer, say it is the final answer; if it is only the value, with none of the working that reaches it, ask them to show the step that gets there — do not show it yourself. Never send them back to a smaller step as though the value were wrong.\n';

/** 2026-10-19 (GAC AP Chemistry portal-00153d15): see above — a whole answer
 *  the check is not sure about. */
export const UNSURE_CORRECT_RULE =
  'What to do: give no verdict either way — do not say it is right, wrong or close. Ask them, in one short question, what their answer stands for or how they got it. Show no working, value, step or result of your own, in the reply or on the board.\n';

/** 2026-10-16 (GAC v12, AP Macro): a check found a wrong answer CORRECT
 *  (high confidence); a second, independent check of a correct finding now
 *  has to agree before anything is credited or recorded. */
export const DISPUTED_CHECK_RULE =
  '- The two checks DISAGREE about whether it is right.\n'
  + 'What to do: give no verdict either way — do not say it is right, wrong, close or almost, and do not praise it. Ask the student to show how they got it (the steps, or the reasoning in a sentence or two), so you can follow their thinking. State no value, result or step of your own.\n';

/** 2026-10-16 (GAC v12, Precalc): "0.2588" for an exact cos 75° was answered
 *  "0.2588 is the value of sin 15°, not cos 75°" — the two are equal, so the
 *  student was told a right value was wrong. */
export const ROUNDED_DECIMAL_RULE =
  'What to do: work it out silently. Say plainly that their decimal is the right value — never that it is wrong, belongs to something else, or "is not what the problem gives". Then say the problem asks for the exact value, and ask ONE question that has them find it (for instance which identity, angles or form to use). Do not write the exact form, or any expression that evaluates to it, in the reply or on the board.\n';

/** 2026-10-15 (staging, Algebra II): a half-right answer; the reply wrote out
 *  the setup of the missing half before asking for it. */
export const PARTLY_NO_REVEAL_RULE =
  'What to do: work it out silently. Confirm the part of THEIR answer that is right, in their own words and values, as what THEY offered it as (it answers what the check names above): never recast it as something else, such as a step, a factor or an intermediate number, and never call any part of it wrong that the check found right. Then say that something is still missing or wrong and name WHICH part, by what it is — without writing it out: no setup, no equation, no inequality or value for that part, not in the reply and not on the board. When the wrong part is a word or an idea (a process, a direction, a term), saying the right one IS writing it out — not even as a contrast with theirs. End with ONE question that has them write that part themselves.\n';

// ── before display: an opener that contradicts the check ───────────────────

/** A DENYING opener: "Not quite", "Close, but", "That's not it", "Almost". */
const DENIAL_OPENER_RE = new RegExp(
  '^[*_~`\\s"\'“(]*(?:(?:hmm+|ah|oh|ok(?:ay)?|so|well)[,.!—–\\-\\s]+)?(?:' +
    'not\\s+(?:quite|exactly|really|yet|right|correct|there)\\b' +
    '|close\\b(?=\\s*[,.!—–-])|so\\s+close\\b|almost\\b(?=\\s*[,.!—–-])|nearly\\b(?=\\s*[,.!—–-])' +
    '|nope\\b|no\\b(?=\\s*[,.!—–-])' +
    '|that(?:\'?s|\\s+is)\\s+not\\b|that(?:\'?s|\\s+is)\\s+(?:incorrect|wrong)\\b|that\\s+isn\'?t\\b|that\\s+doesn\'?t\\b' +
    '|incorrect\\b|wrong\\b|careful\\b|not\\s+this\\s+time\\b' +
    '|(?:good|nice)\\s+(?:try|attempt|guess|effort)\\b' +
  ')',
  'i',
);
export function opensWithDenial(attemptText: string): boolean {
  return DENIAL_OPENER_RE.test(attemptText ?? '');
}

export type PrecheckContradiction =
  /** The check found the answer correct; the reply opens by denying it. */
  | 'denied_correct'
  /** The check found the answer incorrect; the reply opens by affirming it. */
  | 'praised_incorrect'
  /** The check found the message answers nothing; the reply opens by affirming it. */
  | 'praised_non_answer';

/** Does the reply's opening contradict a deciding check? Null ⇒ no. */
export function precheckOpenerContradiction(
  p: PublicVerdictPrecheck | null | undefined,
  attemptText: string,
  opts?: { enabled?: boolean },
): PrecheckContradiction | null {
  if (opts?.enabled === false || !precheckDecides(p)) return null;
  const affirm = opensWithAffirmingVerdict(attemptText);
  const deny = !affirm && opensWithDenial(attemptText);
  if (p.answers === 'neither') return affirm ? 'praised_non_answer' : null;
  // Right for a DIFFERENT problem or part: a "not quite" about the question
  // actually asked is not a contradiction, so nothing is killed.
  if (p.verdict === 'correct') return deny && p.answers !== 'other_part' ? 'denied_correct' : null;
  return affirm ? 'praised_incorrect' : null;
}

/** Retry feedback via the standard rejection channel. Carries no value. */
export function precheckContradictionFeedback(kind: PrecheckContradiction, p: PublicVerdictPrecheck, studentText: string): string {
  const said = `The student wrote "${(studentText ?? '').trim().slice(0, 120)}"`;
  const named = p.target ? ` (${p.target})` : '';
  const quiet = ' Do not mention this check or narrate the correction — just reply naturally.';
  if (kind === 'denied_correct') {
    return p.answers === 'open_question'
      ? `${said}. An independent check of their message found it CORRECT for the question you asked${named}, but you opened by denying it. `
        + 'Re-emit your response: open by telling them it is right, then continue.' + quiet
      : `${said}. An independent check found it is the CORRECT answer to the problem being worked${named} — they answered the problem rather than the smaller step you had asked about — but you opened by denying it. `
        + 'Re-emit your response: open by crediting it explicitly as the right answer to that, never "Not quite"; then decide whether the step you asked about is still worth doing or whether to move on.' + quiet;
  }
  if (kind === 'praised_incorrect') {
    return `${said}. An independent check of their message found it INCORRECT for the question it answers${named}, but you opened by affirming it. `
      + 'Re-emit your response: work it out again from their own problem, say plainly and kindly that it is not right — no praise word first — and guide them toward it without giving the answer away.' + quiet;
  }
  return `${said}. An independent check found that this does NOT answer the question you asked, nor the problem being worked, but you opened with an affirming verdict as if it did. `
    + 'Re-emit your response: no verdict or praise word, and do not answer your own question for them — say briefly that you are not sure what it refers to, or ask the open question again.' + quiet;
}

// ── after display: counting ────────────────────────────────────────────────

export interface PrecheckCreditOverride {
  /** The tutor's affirmation must not be counted as a correct answer. */
  suppressCorrect: boolean;
  /** The tutor's correction must not be counted as a wrong answer. */
  suppressIncorrect: boolean;
  /** The check independently found the answer wrong (confirms a denial of a
   *  hedged answer — answer-attempt.ts `hedgedDenialCounts.verifiedWrong`). */
  verifiedWrong: boolean;
  reason: 'none' | 'checked_correct' | 'checked_incorrect' | 'checked_non_answer';
}

const NO_OVERRIDE: PrecheckCreditOverride = { suppressCorrect: false, suppressIncorrect: false, verifiedWrong: false, reason: 'none' };

/**
 * How a deciding check bounds the counting path:
 *   correct     ⇒ never counted wrong, whatever the tutor said;
 *   incorrect   ⇒ never counted correct, and the denial is confirmed;
 *   non-answer  ⇒ counted neither way.
 * It only ever WITHHOLDS a count the tutor's words would have produced; it
 * never adds one the tutor's words did not.
 */
export function precheckCreditOverride(
  p: PublicVerdictPrecheck | null | undefined,
  opts?: { enabled?: boolean },
): PrecheckCreditOverride {
  if (opts?.enabled === false || !precheckDecides(p)) return NO_OVERRIDE;
  if (p.answers === 'neither') return { suppressCorrect: true, suppressIncorrect: true, verifiedWrong: false, reason: 'checked_non_answer' };
  if (p.verdict === 'correct') return { suppressCorrect: false, suppressIncorrect: true, verifiedWrong: false, reason: 'checked_correct' };
  return { suppressCorrect: true, suppressIncorrect: false, verifiedWrong: true, reason: 'checked_incorrect' };
}
