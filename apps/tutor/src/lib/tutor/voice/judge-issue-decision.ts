/**
 * What one flagged judge issue is allowed to do.
 *
 * 2026-10-04 (live, student gac-test-001). Three times the tutor correctly
 * said "Not quite. Close though." and the judge returned an issue whose own
 * "why" said the student WAS wrong — it objected to "Close though". The
 * orchestrator treated any flagged claim that opens with a denial as a
 * suspected FALSE denial: it planted a "[correction note — not from the
 * student]" telling the brain to own a correction ("you were right: …") and
 * withheld the incorrect credit. It keyed on the claim's text, not on what
 * the judge had concluded. Six notes were consumed in thirteen turns, four of
 * them on correct behaviour; one produced a self-contradicting killed turn,
 * one the leak "let me fix that label… Good catch".
 *
 * The judge now states its conclusion in two structured fields per issue
 * (judge-prompt.ts), and this module decides from them.
 *
 * DECISION TABLE (review of the first cut, same day — with the fields now
 * always present, an UNSURE judge had silenced the re-check note that every
 * flagged denial used to get):
 *
 *   claim is a DENIAL
 *     verdict correct (kind ≠ false_praise) → retraction note, credit withheld.
 *                                             Denial here = isDenialClaim: an
 *                                             opening denial word, or the
 *                                             widened forms the pacing read
 *                                             uses ("that doesn't work",
 *                                             "let's try that again").
 *     verdict unsure / missing              → the LEGACY re-check note, credit
 *                                             withheld (what happened before
 *                                             the fields existed) — ONLY when
 *                                             the claim matches HEAD's
 *                                             DENIAL_RE. The widened forms
 *                                             are ordinary English; with no
 *                                             "student was right" from the
 *                                             judge they do what they did at
 *                                             HEAD (second review pass).
 *     verdict incorrect / not_an_answer     → no retraction, nothing withheld
 *   kind false_denial with incorrect / not_an_answer → the judge contradicts
 *                                             itself: nothing
 *   kind tone_or_wording (answer not judged correct) → nothing
 *   kind wrong_math / grounding / other / false_praise → the NEUTRAL note
 *     (correct your own statement; do not attribute it to the student)
 *     whenever the severity is kill-class or the claim carries maths — the
 *     plant rule at HEAD; nothing withheld.
 *
 * A response with NEITHER field is handled exactly as before.
 *
 * Pure; never throws.
 */
import { DENIAL_RE } from '@/lib/tutor/voice/simplification-verdict-check';
import { buildJudgeCorrectionNote, hasMathExpression } from '@/lib/tutor/voice/judge-correction-note';
import { isDenialClaim } from '@/lib/tutor/voice/pacing-verdict';

export const JUDGE_STUDENT_ANSWER_VERDICTS = ['correct', 'incorrect', 'unsure', 'not_an_answer'] as const;
export type JudgeStudentAnswerVerdict = (typeof JUDGE_STUDENT_ANSWER_VERDICTS)[number];

export const JUDGE_ISSUE_KINDS = ['false_denial', 'false_praise', 'wrong_math', 'tone_or_wording', 'grounding', 'other'] as const;
export type JudgeIssueKind = (typeof JUDGE_ISSUE_KINDS)[number];

export interface JudgeIssueFields {
  studentAnswerVerdict?: JudgeStudentAnswerVerdict;
  issueKind?: JudgeIssueKind;
}

function norm(v: unknown): string {
  return typeof v === 'string' ? v.trim().toLowerCase().replace(/[\s-]+/g, '_') : '';
}

/** Read the two structured fields off a raw issue. Anything unrecognised is
 *  dropped, which makes that field "missing". */
export function readJudgeIssueFields(issue: unknown): JudgeIssueFields {
  if (!issue || typeof issue !== 'object') return {};
  const raw = issue as { studentAnswerVerdict?: unknown; issueKind?: unknown };
  const v = norm(raw.studentAnswerVerdict);
  const k = norm(raw.issueKind);
  return {
    ...((JUDGE_STUDENT_ANSWER_VERDICTS as readonly string[]).includes(v) ? { studentAnswerVerdict: v as JudgeStudentAnswerVerdict } : {}),
    ...((JUDGE_ISSUE_KINDS as readonly string[]).includes(k) ? { issueKind: k as JudgeIssueKind } : {}),
  };
}

export type JudgeNoteMode = 'legacy' | 'retraction' | 'neutral';

export interface JudgeIssueDecision {
  plantNote: boolean;
  /** Which note wording; meaningful only when plantNote. */
  noteMode: JudgeNoteMode;
  /** Sets judgeFlaggedDenialThisTurnRef → `pacing_credit_withheld`. */
  withholdCredit: boolean;
  reason:
    | 'flag-off'
    | 'unstructured'
    | 'false-denial'
    | 'student-correct-denied'
    | 'denial-unverified'
    | 'judge-self-contradiction'
    | 'tone-or-wording'
    | 'denial-of-incorrect-answer'
    | 'own-statement'
    | 'not-noteworthy';
  fields: JudgeIssueFields;
}

/** The pre-2026-10-04 rule, keyed on the claim's text. */
function legacyDecision(claim: string, severity: 'kill' | 'advisory', reason: 'flag-off' | 'unstructured', fields: JudgeIssueFields): JudgeIssueDecision {
  const denial = DENIAL_RE.test(claim);
  return {
    // Kill-class issues always planted; advisory ones only when math- or
    // denial-bearing.
    plantNote: severity === 'kill' || hasMathExpression(claim) || denial,
    noteMode: 'legacy',
    withholdCredit: denial,
    reason,
    fields,
  };
}

/**
 * @param enabled  TUTOR_JUDGE_STRUCTURED_VERDICT.
 * @param severity the issue's class AFTER the orchestrator's overrides
 *   ('kill' = it would have been a kill before Pillar 2b made the judge
 *   advisory; those always planted a note).
 */
export function decideJudgeIssue(input: {
  enabled: boolean;
  issue: { claim: string; studentAnswerVerdict?: unknown; issueKind?: unknown };
  severity: 'kill' | 'advisory';
}): JudgeIssueDecision {
  const claim = input?.issue?.claim ?? '';
  const severity = input?.severity === 'kill' ? 'kill' : 'advisory';
  if (input?.enabled !== true) return legacyDecision(claim, severity, 'flag-off', {});
  const fields = readJudgeIssueFields(input.issue);
  const { studentAnswerVerdict: verdict, issueKind: kind } = fields;
  if (!verdict && !kind) return legacyDecision(claim, severity, 'unstructured', fields);

  // One predicate with the pacing read (pacing-verdict.ts). The unstructured
  // path above keeps DENIAL_RE alone — it must stay exactly as it was.
  const claimIsDenial = isDenialClaim(claim);
  /** HEAD's own denial test — the only one the re-check path may use. */
  const claimOpensWithDenial = DENIAL_RE.test(claim);
  const none = (reason: JudgeIssueDecision['reason']): JudgeIssueDecision =>
    ({ plantNote: false, noteMode: 'neutral', withholdCredit: false, reason, fields });
  const answerJudgedWrong = verdict === 'incorrect' || verdict === 'not_an_answer';
  /** The pre-fields behaviour for a flagged denial: re-check, own it only if
   *  the re-check says so; the incorrect credit is not counted meanwhile. */
  const recheck = (): JudgeIssueDecision =>
    ({ plantNote: true, noteMode: 'legacy', withholdCredit: true, reason: 'denial-unverified', fields });

  // The judge says the tutor rejected a correct answer.
  if (kind === 'false_denial') {
    // …and, in the same breath, that the student was wrong or gave no answer:
    // the production shape. The explicit verdict on the answer wins.
    if (answerJudgedWrong) return none('judge-self-contradiction');
    if (verdict === 'correct') {
      return { plantNote: true, noteMode: 'retraction', withholdCredit: true, reason: 'false-denial', fields };
    }
    // It did not commit to the student being right: no "you were right" —
    // and a re-check only for a claim HEAD itself read as a denial.
    if (claimOpensWithDenial) return recheck();
  }
  if (verdict === 'correct' && claimIsDenial && kind !== 'false_praise') {
    return { plantNote: true, noteMode: 'retraction', withholdCredit: true, reason: 'student-correct-denied', fields };
  }
  // Wording on a verdict that was itself right ("close though" on an answer
  // that was not close): logged by the caller, nothing else.
  if (kind === 'tone_or_wording') return none('tone-or-wording');
  // A flagged denial the judge could not settle either way.
  if (claimOpensWithDenial && !answerJudgedWrong && verdict !== 'correct' && kind !== 'false_praise') return recheck();
  // A flagged denial of an answer the judge itself calls incorrect, with no
  // fault named: the tutor was doing its job.
  const denialOfWrongAnswer = claimIsDenial && answerJudgedWrong;
  if (denialOfWrongAnswer && !kind) return none('denial-of-incorrect-answer');
  // Everything else (false_praise, wrong_math, grounding, other): the plant
  // rule that applied before the fields existed, in the neutral wording.
  // Credit is never withheld here — the judge did not say the student was
  // right.
  const plant = severity === 'kill' || hasMathExpression(claim);
  if (plant) return { plantNote: true, noteMode: 'neutral', withholdCredit: false, reason: 'own-statement', fields };
  return none(denialOfWrongAnswer ? 'denial-of-incorrect-answer' : 'not-noteworthy');
}

/**
 * Is this flagged issue a DENIAL for the verified-key suppression
 * (`judge_advisory_suppressed`: the judge flagged a denial, and the
 * deterministic key says the student really did disagree with it — the judge
 * is the one that is wrong, so its note is not planted)?
 *
 * At HEAD: a noteworthy issue whose claim matches DENIAL_RE. Deriving this
 * from `withholdCredit` (first cut) dropped a maths-bearing denial of an
 * answer the judge itself called INCORRECT — that decision plants a neutral
 * note and withholds nothing, so the suppression never ran. Now: HEAD's test,
 * plus every decision that withholds credit.
 */
export function isSuppressibleDenial(item: { claim: string; decision: JudgeIssueDecision }): boolean {
  const d = item?.decision;
  if (!d?.plantNote) return false;
  return d.withholdCredit === true || DENIAL_RE.test(item.claim ?? '');
}

/**
 * One note per judge pass.
 *  - A retraction is worded for the denial(s) only; any OTHER planted claim of
 *    the same pass rides the same note as `otherClaims` (its own correction,
 *    in the neutral wording) instead of being dropped.
 *  - Legacy claims (no structured fields, or an unverified denial) ride the
 *    legacy wording; NEUTRAL claims of the same pass are appended the same
 *    way, as `otherClaims` — the legacy text ("you were right…", "The answer
 *    you graded was…") is about the student's answer and must not be applied
 *    to the tutor's own maths statement.
 *  - Otherwise every planted claim rides one neutral note.
 */
export function planJudgeNote(
  items: Array<{ claim: string; decision: JudgeIssueDecision }>,
): { claims: string[]; mode: JudgeNoteMode; otherClaims?: string[] } | null {
  const planted = (items ?? []).filter((i) => i?.decision?.plantNote);
  if (planted.length === 0) return null;
  const retractions = planted.filter((i) => i.decision.noteMode === 'retraction');
  if (retractions.length > 0) {
    const others = planted.filter((i) => i.decision.noteMode !== 'retraction').map((i) => i.claim);
    return {
      claims: retractions.map((i) => i.claim),
      mode: 'retraction',
      ...(others.length > 0 ? { otherClaims: others } : {}),
    };
  }
  const legacy = planted.filter((i) => i.decision.noteMode === 'legacy');
  if (legacy.length > 0) {
    const others = planted.filter((i) => i.decision.noteMode !== 'legacy').map((i) => i.claim);
    return {
      claims: legacy.map((i) => i.claim),
      mode: 'legacy',
      ...(others.length > 0 ? { otherClaims: others } : {}),
    };
  }
  return { claims: planted.map((i) => i.claim), mode: 'neutral' };
}

/**
 * The note text for a plan. Identical to buildJudgeCorrectionNote for every
 * plan except a LEGACY one with `otherClaims`: buildJudgeCorrectionNote
 * carries otherClaims only in its retraction wording, so the neutral claims
 * are appended here, in the same words it uses there.
 */
export function buildPlannedJudgeNote(
  plan: { claims: string[]; mode: JudgeNoteMode; otherClaims?: string[] } | null,
  studentAnswer?: string,
  opts?: { guardAttribution?: boolean },
): string | null {
  if (!plan) return null;
  const base = buildJudgeCorrectionNote(plan.claims, studentAnswer, {
    mode: plan.mode,
    otherClaims: plan.otherClaims,
    guardAttribution: opts?.guardAttribution,
  });
  if (!base || plan.mode !== 'legacy') return base;
  const others = (plan.otherClaims ?? [])
    .slice(0, 2)
    .map((c) => `"${String(c ?? '').slice(0, 160).replace(/\s+/g, ' ').trim()}"`)
    .filter((c) => c.length > 2);
  if (others.length === 0) return base;
  return (
    `${base} Separately, the same review flagged another statement in that turn as likely wrong: ${others.join(' and ')}. ` +
    `Silently re-check it against the problem and the board; if it was wrong, correct your own statement plainly in one short sentence ("Let me correct something I said: …") — that part is not something the student was right about.`
  );
}

/** One short line for the `judge_issue_decision` debug event. */
export function describeJudgeIssueDecision(d: JudgeIssueDecision): string {
  return `kind=${d.fields.issueKind ?? '-'} verdict=${d.fields.studentAnswerVerdict ?? '-'} → ` +
    `${d.plantNote ? `note:${d.noteMode}` : 'no-note'} ${d.withholdCredit ? 'withhold' : 'no-withhold'} (${d.reason})`;
}
