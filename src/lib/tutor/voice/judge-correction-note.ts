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
