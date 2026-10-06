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
}

/** The full result; `correctValue` stays on the server. */
export interface VerdictPrecheckResult extends PublicVerdictPrecheck {
  correctValue: string;
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
  };
}

export function toPublicPrecheck(r: VerdictPrecheckResult): PublicVerdictPrecheck {
  return { answers: r.answers, target: line(r.target, 160), proposed: line(r.proposed, 200), verdict: r.verdict, confidence: r.confidence };
}

/** Does this check say anything the brain should be told? Low confidence and
 *  "cannot determine" say nothing — the turn then runs as it did before. */
export function precheckInforms(p: PublicVerdictPrecheck | null | undefined): p is PublicVerdictPrecheck {
  if (!p || p.confidence === 'low') return false;
  if (p.answers === 'neither') return true;
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
  opts?: { correctValue?: string },
): string {
  if (!precheckInforms(p)) return '';
  const proposed = p.proposed ? `- The student's message proposes: ${q(p.proposed)}.\n` : '';
  const named = p.target ? ` (${p.target})` : '';
  const head = '<answer_check>\n'
    + 'Before this turn the student\'s message was checked independently, from their own problem and data. The student does not see this.\n';
  const tail = 'If your own working disagrees with this check, redo it once from the student\'s own problem. If you still disagree, give no verdict either way: ask them to show how they got it.\n'
    + 'Never mention this check to the student.\n'
    + '</answer_check>\n\n';
  if (p.answers === 'neither') {
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
          ? 'What to do: it is right for THAT, and it is not an answer to the question you asked just now. Say both, briefly — never "Not quite" about a value that is right for what it answers, and no praise as though it answered your question — then return to the question you asked.\n'
          : 'What to do: open by telling them it is right. Never "Not quite", and do not ask them to check it again.\n')
      + tail;
  }
  if (p.verdict === 'incorrect') {
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
    + 'What to do: say exactly what is right and what is missing or wrong. Do not open with unqualified praise, and do not open with a flat denial.\n'
    + tail;
}

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
