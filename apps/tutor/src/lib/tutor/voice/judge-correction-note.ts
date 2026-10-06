/**
 * Judge → next-turn correction note (2026-08-07 triage, session-1786064015703).
 *
 * The post-stream judge is ADVISORY-ONLY (Pillar 2b, commit e263e7ba): a
 * kill-class verdict used to end at a console.warn + `judge_advisory_was_kill`
 * debug event — no student-visible effect. In the triaged session the judge
 * correctly caught a false reject ("an ellipse" graded against a stale card
 * question) ~3.5s after the verdict aired, and the wrong "Not quite" simply
 * stood, seeding a 3-minute contradiction loop.
 *
 * This note is the cheap middle path between "advisory-only" and the retired
 * post-stream performKill (whose spoke-then-corrected UX is why it was
 * removed): ride the NEXT brain call's transcript via the same
 * "[… — not from the student]" convention as pendingCadenceNoteRef, so the
 * tutor re-checks its last verdict WITH the student's next utterance in hand
 * and can own the correction naturally ("Actually — hold on, ellipse was
 * right…"). Zero added latency, no audio chop, and — because Haiku judges
 * fabricate (the reason kills were retired) — the note carries an explicit
 * safety valve: if the brain re-checks and stands by its verdict, it
 * continues silently and never mentions the review.
 *
 * Pure module so the note text is unit-testable:
 * npx tsx scripts/test-judge-correction-note.ts
 */

import { TUTOR_JUDGE_NOTE_FALSE_PRAISE } from '@/lib/tutor/orchestrator/turn-round-flags';

const MAX_CLAIMS = 2;
const MAX_CLAIM_CHARS = 160;

/**
 * Planting-policy predicate (2026-08-10 root cause, session
 * portal-7cfa226c): kill-class judge issues always plant a correction note
 * (see the VoiceTutorRealtime.tsx killIssues branch), but advisory-class
 * issues previously never did — logged via `judge_advisory_flag` and
 * dropped, even when the flagged claim was a genuine board-contradiction
 * carrying an actual math expression (the incident shape: a board card
 * whose math contradicted the tutor's own correct narration). This
 * extends planting to advisory issues, but ONLY when the claim text
 * contains a math expression — a bare tone/phrasing/common-knowledge
 * advisory (the majority of advisory issues, and the class Pillar 2b's
 * advisory-only default exists to protect) still gets no note.
 *
 * Extracted as a pure predicate so the "which claims count as math" line
 * is unit-testable independent of the VoiceTutorRealtime.tsx wiring.
 */
export function hasMathExpression(claim: string): boolean {
  return /\$|\\\(|=/.test(claim);
}

/** Filters a claim list down to the ones that qualify for note-planting
 * under the advisory math-expression policy (see hasMathExpression). */
export function claimsWithMathExpression(claims: string[]): string[] {
  return claims.filter(hasMathExpression);
}

/**
 * Consumption-gating predicate (2026-08-10 root cause, session
 * portal-cb2addf5): a planted correction note used to be consumed by
 * WHICHEVER brain call happened to run next, including synthetic
 * dispatches that carry no student content at all — an idle-nudge
 * ("Take your time. Here's a fresh one…") or a bracketed cover/system-note
 * turn. Consuming the note there means it's gone (pendingJudgeCorrectionNoteRef
 * is cleared unconditionally on delivery) without ever reaching a turn
 * where the tutor could actually voice the correction to the student —
 * observed twice in one session (planted at 787.8s, burned by an idle
 * nudge at 880.5s; planted at 2143.4s, burned at 2241.7s).
 *
 * The note must hold until the NEXT REAL student-turn response. Synthetic
 * dispatches use the same bracketed `[…]` convention as every other
 * system-originated transcript in this codebase (idle-nudge directive,
 * `[start lesson]`, cover turns, etc.) — see the `isSynthetic` check
 * VoiceTutorRealtime already uses at its cover-arm site.
 */
/** R50 T3: the one bracketed dispatch that MAY consume a pending note.
 *
 *  Every other synthetic dispatch is excluded on purpose — burning the note
 *  on an idle nudge or a resume would spend it without the student's words
 *  in hand, which is the whole point of holding it. But excluding ALL
 *  bracketed turns left the note with no delivery path when the student
 *  simply stops talking, which is the failure this sentinel closes. */
export const CORRECTION_DUE_PREFIX = '[Correction-due]';

/** Dispatched when a planted note has gone undelivered past its deadline.
 *  Deliberately does NOT restate the flagged claim — the note itself is
 *  prepended to this same turn and already carries it. */
export const CORRECTION_DUE_DIRECTIVE =
  `${CORRECTION_DUE_PREFIX} The student has gone quiet since your last turn. ` +
  `Act on the correction note above now rather than waiting for them to speak: ` +
  `if you got it wrong, own it in one short sentence and re-ask the question. ` +
  `If on re-checking you stand by what you said, say nothing about the review and ` +
  `simply offer the student a way back in. Never narrate the act of checking ` +
  `("that check was correct", "no correction needed") — the student must never ` +
  `learn a check happened.`;

/**
 * A note is consumed by a REAL student turn, never by an ordinary synthetic
 * dispatch — with the single exception of the correction-due sentinel above.
 *
 * R50 T3 (live, portal-1f44f0eb 347-392s): the tutor falsely rejected a
 * correct answer ("1" for the floor closest to the lobby) at 351.0s. The
 * judge flagged it 3.9s later and planted a note — but the note sat unspent
 * until the student REPEATED THEMSELVES at 387.7s, so the correction landed
 * ~40s after the error and only because the student pushed back. A student
 * who accepts the false rejection and stays quiet never gets corrected at
 * all, and that is the common case: the judge is advisory-only by design
 * (Pillar 2b), so this note is the ONLY repair path in the system.
 */
export function shouldConsumeJudgeCorrectionNote(transcript: string): boolean {
  if (transcript.trimStart().startsWith(CORRECTION_DUE_PREFIX)) return true;
  return !/^\s*\[/.test(transcript);
}

/**
 * May the judge plant its note in the shared correction-note slot?
 *
 * 2026-10-03: the slot is shared with two DETERMINISTIC notes — the
 * relation-step witness note (relation-step-note.ts) and the answer-dispute
 * note decided by exact substitution (answer-dispute-tiebreak.ts). Both are
 * planted while a turn streams; the judge runs after the same turn and used
 * to assign the slot unconditionally, replacing an exact note with one from
 * a reviewer that has a known false-positive rate (and the witness note is
 * never re-planted: its equation is already marked as noted).
 *
 * `deterministicNote` is the text of the last deterministic note planted.
 * It is protected only while it is still the note in the slot (string
 * identity) — once delivered or withdrawn the slot no longer equals it and
 * the judge plants as before. Judge-over-judge replacement is unchanged.
 */
export function decideJudgeNotePlant(input: {
  /** TUTOR_JUDGE_NOTE_KEEP_DETERMINISTIC. */
  enabled: boolean;
  pendingNote: string | null | undefined;
  deterministicNote: string | null | undefined;
}): { plant: true } | { plant: false; reason: 'deterministic-note-pending' } {
  if (input?.enabled !== true) return { plant: true };
  const pending = input.pendingNote;
  if (!pending || !input.deterministicNote || pending !== input.deterministicNote) return { plant: true };
  return { plant: false, reason: 'deterministic-note-pending' };
}

/** The clause every mode ends on (R58): the check itself is never narrated. */
const NEVER_NARRATE =
  `Either way, NEVER narrate the act of checking — no "re-checking my last correction", "that check was correct", "nothing to walk back", "no correction needed", and never refer to the student in the third person. The student must never learn a check happened; they only ever hear normal tutoring.`;

/** 2026-10-04 (live, student gac-test-001): a note consumed on a turn where
 *  the student had said nothing of the kind produced "let me fix that label…
 *  Good catch". The correction is the tutor's own; the student caught nothing. */
const NO_ATTRIBUTION =
  `The student did not point this out — the mistake and the correction are yours alone: never thank or credit them for catching it (no "good catch", "thanks for flagging that", "well spotted").`;

/**
 * Which wording the note uses.
 *
 *  - 'legacy'     the text as it was before 2026-10-04 (used when the judge
 *                 response carries no structured fields, the flag is off, or
 *                 the judge flagged a denial without settling whether the
 *                 student was right).
 *  - 'retraction' the judge SAID the student's answer was correct and the
 *                 tutor rejected it. The only mode that may tell the student
 *                 they were right.
 *  - 'neutral'    any other flagged statement (wrong maths, grounding, false
 *                 praise): correct your own earlier statement plainly, and do
 *                 not attribute the correction to the student.
 *  - 'false_praise' (2026-10-05) the tutor AFFIRMED the student's answer and
 *                 the review says that answer was wrong or was not an answer
 *                 to the question. The error is the affirmation, so the note
 *                 is about the STUDENT's answer: tell them plainly it was not
 *                 right. The neutral wording pointed the tutor at "your own
 *                 statement" and it re-affirmed the right value it had
 *                 written without ever telling the student theirs was wrong.
 */
export type JudgeCorrectionNoteMode = 'legacy' | 'retraction' | 'neutral' | 'false_praise';

/** 2026-10-05 (21 scripted sessions): six sessions spoke the literal "Let me
 *  correct something I said: …" — the note handed the tutor a sentence and it
 *  recited it, three times with nothing to correct, once attributing the
 *  STUDENT's number to itself ("…gives 17, not 41 — that's on me"). The note
 *  now describes the task; it never supplies the words. */
const OWN_STATEMENT_TASK =
  `If it was wrong, say in one short sentence, in your own words, what the right statement is, and continue. ` +
  `It is your own statement: a value the student gave is THEIR value — never present it as something you said, and never present your correct value as if the student had given it.`;

/** The "another statement in that turn" rider for retraction / legacy notes. */
export function otherClaimsRider(quotedOthers: string[], scriptless: boolean): string {
  if (quotedOthers.length === 0) return '';
  return scriptless
    ? `Separately, the same review flagged another statement in that turn as likely wrong: ${quotedOthers.join(' and ')}. ` +
      `Silently re-check it against the problem and the board. ${OWN_STATEMENT_TASK} That part is not something the student was right about. `
    : `Separately, the same review flagged another statement in that turn as likely wrong: ${quotedOthers.join(' and ')}. ` +
      `Silently re-check it against the problem and the board; if it was wrong, correct your own statement plainly in one short sentence ("Let me correct something I said: …") — that part is not something the student was right about. `;
}

export function buildJudgeCorrectionNote(
  claims: string[],
  studentAnswer?: string,
  opts?: {
    mode?: JudgeCorrectionNoteMode;
    /** Append the no-attribution sentence to the LEGACY text (the other two
     *  modes always carry it). */
    guardAttribution?: boolean;
    /** 'retraction' mode only: OTHER statements of the same turn the review
     *  flagged (wrong maths, grounding). They ride the same note after the
     *  retraction text, worded as the tutor's own correction — the judge
     *  decision used to drop them when a retraction was present. */
    otherClaims?: string[];
    /** No sentence to recite, and never "keep your verdict". Unset ⇒
     *  TUTOR_JUDGE_NOTE_FALSE_PRAISE. False ⇒ the 2026-10-04 texts. */
    scriptless?: boolean;
  },
): string | null {
  const quote = (list: string[]) => list
    .slice(0, MAX_CLAIMS)
    .map((c) => `"${c.slice(0, MAX_CLAIM_CHARS).replace(/\s+/g, ' ').trim()}"`)
    .filter((c) => c.length > 2);
  const quoted = quote(claims);
  if (quoted.length === 0) return null;
  const quotedOthers = quote(opts?.otherClaims ?? []);
  const mode = opts?.mode ?? 'legacy';
  const graded = studentAnswer && studentAnswer.trim()
    ? studentAnswer.trim().slice(0, 80).replace(/\s+/g, ' ')
    : '';
  const scriptless = opts?.scriptless ?? TUTOR_JUDGE_NOTE_FALSE_PRAISE;
  if (mode === 'false_praise') {
    return (
      `[correction note — not from the student] An automated review found that your previous turn affirmed the student's answer` +
      (graded ? ` "${graded}"` : '') +
      ` as correct (${quoted.join(' and ')}), and that this answer was wrong, or was not an answer to the question you had asked. ` +
      `Silently check THAT answer — the student's, not whatever they say next — against the question you had actually asked. ` +
      `If it does not answer that question correctly: open this turn by saying so plainly and kindly in one short sentence (their answer was not right, or did not answer the question), make clear what is right, and then re-ask or move on. ` +
      `A value the student gave is THEIR value: never present it as something you said, and never present the correct value as if the student had given it. ` +
      `If on re-checking the student's answer was correct, continue naturally and do not mention this review. ` +
      (quotedOthers.length > 0 ? otherClaimsRider(quotedOthers, true) : '') +
      NEVER_NARRATE
    );
  }
  if (mode === 'retraction') {
    return (
      `[correction note — not from the student] An automated review found that the student's answer was correct and that your previous turn rejected it: ${quoted.join(' and ')}. ` +
      `Silently re-check that verdict against the question you actually asked and the student's exact words. ` +
      (graded ? `The answer you graded was "${graded}" — re-check THAT answer, not whatever they say next. ` : '') +
      `If you did reject a correct answer, open this turn by briefly owning the correction ("Actually, hold on — you were right: …") before continuing. ` +
      `If on re-checking you stand by what you said, continue naturally and do not mention this review. ` +
      otherClaimsRider(quotedOthers, scriptless) +
      `${NO_ATTRIBUTION} ` +
      NEVER_NARRATE
    );
  }
  if (mode === 'neutral' && scriptless) {
    return (
      `[correction note — not from the student] An automated review flagged a statement in your previous turn as likely wrong: ${quoted.join(' and ')}. ` +
      `Silently re-check that statement against the problem and the board. ` +
      `${OWN_STATEMENT_TASK} ` +
      `Do not credit the student for the correction: the review did not find that they were right about anything, so do not say "you were right" or "good catch". ` +
      `If on re-checking you stand by what you said, continue naturally and do not mention this review. ` +
      NEVER_NARRATE
    );
  }
  if (mode === 'neutral') {
    return (
      `[correction note — not from the student] An automated review flagged a statement in your previous turn as likely wrong: ${quoted.join(' and ')}. ` +
      `Silently re-check that statement against the problem and the board. ` +
      `If it was wrong, correct your own earlier statement plainly in one short sentence ("Let me correct something I said: …") and continue. ` +
      `Do not attribute the correction to the student: the review did not find that they were right about anything, so do not say "you were right" or "good catch", and do not change your verdict on their answer unless your own re-check shows that verdict was wrong. ` +
      `If on re-checking you stand by what you said, continue naturally and do not mention this review. ` +
      NEVER_NARRATE
    );
  }
  return (
    `[correction note — not from the student] An automated review flagged your previous turn as likely mis-grading or contradicting the facts: ${quoted.join(' and ')}. ` +
    `Silently re-check that claim against the question you actually asked and the student's exact words. ` +
    // Live 2026-09-06 (Noah): the note rode the student's NEXT utterance and the
    // brain "owned the correction" about that new (correct) answer — "you were
    // right: 3 groups of 7" to a student whose flagged answer had been "2".
    // Pin the note to the answer that was actually graded.
    (studentAnswer && studentAnswer.trim()
      ? `The answer you graded was "${studentAnswer.trim().slice(0, 80).replace(/\s+/g, ' ')}" — re-check THAT answer, not whatever they say next. `
      : '') +
    `If you were wrong — especially if you rejected a correct answer — open this turn by briefly owning the correction ("Actually, hold on — you were right: …") before continuing. ` +
    `If on re-checking you stand by what you said, continue naturally and do not mention this review. ` +
    // R58 (live, two evelyntutor sessions): the brain narrated the re-check
    // itself aloud ("Re-checking my last correction — the student had
    // actually written… nothing to walk back there"). The stand-by branch's
    // "do not mention this review" read as permission to describe the check
    // as long as the word "review" was avoided. Close that read explicitly.
    NEVER_NARRATE +
    (opts?.guardAttribution ? ` ${NO_ATTRIBUTION}` : '')
  );
}
