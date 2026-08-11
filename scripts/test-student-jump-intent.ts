/**
 * R44 (session portal-dc74208b): the student said "move to derivative
 * patterns" — an agenda item by name — the brain rerouted content but
 * never called its navigation tool, so the lesson cursor and agenda rail
 * froze. matchStudentJumpIntent is the pure inference: explicit move-verb
 * + high-confidence label match → target segment id. A FALSE match
 * corrupts pedagogical state (the applied advance auto-marks skipped
 * segments complete), so it must never fire without BOTH signals.
 * Run: npm run test:student-jump-intent
 */
import { matchStudentJumpIntent } from '../src/lib/tutor/orchestrator/student-jump-intent';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const items = [
  { segmentIds: ['seg-1a', 'seg-1b'], label: 'Notation & selection' },
  { segmentIds: ['seg-2'], label: 'Second derivative example' },
  { segmentIds: ['seg-3'], label: 'Second derivatives practice' },
  { segmentIds: ['seg-4a', 'seg-4b'], label: 'Derivative patterns' },
];

// ── from the brief (the live session's exact shape) ────────────────
check('explicit move-to by name', matchStudentJumpIntent("can we move to derivative patterns", items, 'seg-1a')?.targetSegmentId === 'seg-4a');
check('jump-to verb', matchStudentJumpIntent("let's jump to derivative patterns now", items, 'seg-1a')?.targetSegmentId === 'seg-4a');
check('switch-to partial label', matchStudentJumpIntent('switch to the derivative patterns one', items, 'seg-2')?.targetSegmentId === 'seg-4a');
check('backward jump allowed', matchStudentJumpIntent('go back to notation and selection', items, 'seg-3')?.targetSegmentId === 'seg-1a');
// negatives — every one must be null
check('no verb, label mentioned', matchStudentJumpIntent('is this like the derivative patterns thing?', items, 'seg-1a') === null);
check('verb, no label match', matchStudentJumpIntent("let's move to integration by parts", items, 'seg-1a') === null);
check('verb, weak overlap', matchStudentJumpIntent('move to the second one', items, 'seg-1a') === null);
check('already there', matchStudentJumpIntent('move to derivative patterns', items, 'seg-4a') === null);
check('also current when cursor on 2nd id of same item', matchStudentJumpIntent('move to derivative patterns', items, 'seg-4b') === null);
check('empty transcript', matchStudentJumpIntent('', items, 'seg-1a') === null);
check('empty items', matchStudentJumpIntent('move to derivative patterns', [], 'seg-1a') === null);
check('ambiguous two-label overlap is null', matchStudentJumpIntent('move to second derivative', items, 'seg-1a') === null); // matches both 'Second derivative example' and 'Second derivatives practice' equally-ish → refuse

// ── adversarial self-review probes ──────────────────────────────────
// "go over X again" is REVIEW phrasing, not a navigation jump — the
// current segment already covers X, no cursor move should be inferred.
check('review phrasing "go over ... again" → null (not a jump verb)', matchStudentJumpIntent('can we go over the derivative patterns again', items, 'seg-1a') === null);
// bare "let's move on" names no destination — must not crash, must be null.
check('move-on with no destination named → null', matchStudentJumpIntent("let's move on", items, 'seg-1a') === null);
check('move-on to nothance, trailing punctuation only → null', matchStudentJumpIntent("let's move on.", items, 'seg-1a') === null);
// spoken "and" for "&" in a label must still match via normalization.
check('spoken "and" matches "&" in label', matchStudentJumpIntent('move to notation and selection', items, 'seg-3')?.targetSegmentId === 'seg-1a');
// "go to" alone (no "back") should still work as a forward move-verb.
check('go-to forward (no "back")', matchStudentJumpIntent('go to derivative patterns', items, 'seg-1a')?.targetSegmentId === 'seg-4a');
// verb embedded mid-sentence after filler should still anchor correctly.
check('polite wrapper before verb still finds the tail', matchStudentJumpIntent('okay, can we move to derivative patterns please', items, 'seg-1a')?.targetSegmentId === 'seg-4a');
// case-insensitivity + punctuation noise.
check('case-insensitive + punctuation', matchStudentJumpIntent("MOVE TO DERIVATIVE PATTERNS!!", items, 'seg-1a')?.targetSegmentId === 'seg-4a');
// matchedLabel field sanity.
check('matchedLabel reflects the winning item label', matchStudentJumpIntent('move to derivative patterns', items, 'seg-1a')?.matchedLabel === 'Derivative patterns');
// whitespace-only transcript.
check('whitespace-only transcript → null', matchStudentJumpIntent('   ', items, 'seg-1a') === null);
// verb present but tail is pure stopwords (no content tokens) → null, no crash.
check('verb with stopword-only tail → null', matchStudentJumpIntent('move to the one', items, 'seg-1a') === null);

console.log(`\nstudent-jump-intent: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
