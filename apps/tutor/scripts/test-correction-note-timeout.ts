/**
 * R50 T3 — a planted judge correction note must not depend on the student
 * speaking again.
 *
 * Live trace, portal-1f44f0eb (Grade 7 integers, 2026-08-21):
 *   347.5s  student: "1."                       <- CORRECT
 *   351.0s  tutor:   "Not quite. One would be a floor number, not the
 *                     distance we're measuring here."      <- false denial
 *   354.9s  judge_advisory_was_kill  +  judge_correction_note_planted
 *   387.7s  student: "floor 1."                 <- student repeats THEMSELVES
 *   387.7s  judge_correction_note_consumed
 *   391.7s  tutor:   "Actually, hold on — you were right."
 * The repair took ~40s and happened only because the student pushed back.
 * The judge is advisory-only by design (Pillar 2b), so this note is the only
 * repair path in the system — and it had no delivery path at all for a
 * student who accepts the rejection and goes quiet.
 *
 * Run: npx tsx scripts/test-correction-note-timeout.ts
 */
import { strict as assert } from 'node:assert';
import {
  shouldConsumeJudgeCorrectionNote,
  buildJudgeCorrectionNote,
  CORRECTION_DUE_DIRECTIVE,
  CORRECTION_DUE_PREFIX,
} from '../src/lib/tutor/voice/judge-correction-note';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`); }
}

console.log('\nR50 T3 — correction-note delivery');

test('a real student turn still consumes the note (unchanged behaviour)', () => {
  assert.equal(shouldConsumeJudgeCorrectionNote('floor 1.'), true);
  assert.equal(shouldConsumeJudgeCorrectionNote('1.'), true);
});

test('ordinary synthetic dispatches still do NOT consume it', () => {
  // The whole point of holding the note is to spend it with the student's
  // words in hand. Every bracketed dispatch except the new sentinel must
  // still be refused, or the note gets burned on an idle nudge.
  assert.equal(shouldConsumeJudgeCorrectionNote('[start lesson]'), false);
  assert.equal(shouldConsumeJudgeCorrectionNote('[Session-resumed at 12:04]'), false);
  assert.equal(shouldConsumeJudgeCorrectionNote('[Skip-button-clicked]'), false);
  assert.equal(shouldConsumeJudgeCorrectionNote('  [Continuation-after-cutoff]'), false);
});

test('the correction-due sentinel DOES consume it', () => {
  assert.equal(shouldConsumeJudgeCorrectionNote(CORRECTION_DUE_DIRECTIVE), true);
});

test('the sentinel is itself a bracketed dispatch', () => {
  // If it ever stopped being bracketed it would reach the brain as if the
  // student had typed it, which is a different and worse bug.
  assert.ok(CORRECTION_DUE_DIRECTIVE.startsWith('['));
  assert.ok(CORRECTION_DUE_DIRECTIVE.startsWith(CORRECTION_DUE_PREFIX));
});

test('the sentinel is the ONLY bracketed prefix accepted', () => {
  // Guards against the predicate being loosened to "any bracketed turn".
  assert.equal(shouldConsumeJudgeCorrectionNote('[Correction-something-else] hi'), false);
  assert.equal(shouldConsumeJudgeCorrectionNote('[correction note — not from the student] x'), false);
});

test('the directive tells the brain to act now, and to stay silent if right', () => {
  assert.ok(/gone quiet/i.test(CORRECTION_DUE_DIRECTIVE));
  assert.ok(/own it/i.test(CORRECTION_DUE_DIRECTIVE));
  // The safety valve from buildJudgeCorrectionNote must survive here too:
  // a brain that re-checks and stands by its call must not narrate a review.
  assert.ok(/stand by/i.test(CORRECTION_DUE_DIRECTIVE));
});

test('the live false-denial claim still builds a note', () => {
  const note = buildJudgeCorrectionNote([
    'Not quite. One would be a floor number, not the distance we’re measuring here.',
  ]);
  assert.ok(note && note.length > 0);
  assert.ok(note!.startsWith('[correction note'));
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
