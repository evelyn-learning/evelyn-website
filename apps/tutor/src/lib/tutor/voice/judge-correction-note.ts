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
  `simply offer the student a way back in.`;

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

export function buildJudgeCorrectionNote(claims: string[]): string | null {
  const quoted = claims
    .slice(0, MAX_CLAIMS)
    .map((c) => `"${c.slice(0, MAX_CLAIM_CHARS).replace(/\s+/g, ' ').trim()}"`)
    .filter((c) => c.length > 2);
  if (quoted.length === 0) return null;
  return (
    `[correction note — not from the student] An automated review flagged your previous turn as likely mis-grading or contradicting the facts: ${quoted.join(' and ')}. ` +
    `Silently re-check that claim against the question you actually asked and the student's exact words. ` +
    `If you were wrong — especially if you rejected a correct answer — open this turn by briefly owning the correction ("Actually, hold on — you were right: …") before continuing. ` +
    `If on re-checking you stand by what you said, continue naturally and do not mention this review.`
  );
}
