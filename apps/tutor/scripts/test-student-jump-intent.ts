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

// ── coordinator review round: negation guard ────────────────────────
// A negator governing the verb ("don't"/"do not"/"not"/"never", up to 2
// intervening words) must block the match entirely — firing here would
// jump AWAY from where the student explicitly said not to go.
check('negation: "don\'t move to X yet" → null', matchStudentJumpIntent("don't move to derivative patterns yet", items, 'seg-1a') === null);
check('negation: "let\'s not move to X" → null', matchStudentJumpIntent("let's not move to derivative patterns", items, 'seg-1a') === null);
check('negation: "I don\'t want to move to X" → null (2 intervening words)', matchStudentJumpIntent("I don't want to move to derivative patterns", items, 'seg-1a') === null);
// CAUTION case: a bare "no wait" / "wait" lead-in is a correction, not a
// negator — must NOT block.
check('correction lead-in "no wait, move to X" is NOT negation → resolves', matchStudentJumpIntent('no wait, move to derivative patterns', items, 'seg-1a')?.targetSegmentId === 'seg-4a');

// ── coordinator review round: self-correction re-anchoring ──────────
// The abandoned first-mentioned target must never win; a safe null beats
// a wrong target when the corrected destination itself is ambiguous.
check('self-correction via marker: "no wait" abandons first target → null, not the wrong one', matchStudentJumpIntent('move to derivative patterns, no wait, second derivatives', items, 'seg-1a') === null);
check('self-correction via re-issued verb: last "move to" wins', matchStudentJumpIntent('move to derivative patterns, actually move to second derivatives practice', items, 'seg-1a')?.targetSegmentId === 'seg-3');

// ── coordinator review round: bag-of-words scatter guard ────────────
// Token overlap alone is not enough — the label must be referenced as a
// unit (compact span), not assembled by coincidence from an unrelated
// sentence.
check('scattered tokens across an unrelated sentence → null', matchStudentJumpIntent("move to the second example, we'll cover the derivative next", items, 'seg-1a') === null);
check('compact partial-label span still resolves (regression guard)', matchStudentJumpIntent('switch to the derivative patterns one', items, 'seg-2')?.targetSegmentId === 'seg-4a');

// ── coordinator review round: near-collision ambiguity (reviewer-verified) ──
const chainItems = [
  { segmentIds: ['seg-c1'], label: 'Chain rule basics' },
  { segmentIds: ['seg-c2'], label: 'Chain rule practice' },
];
check('near-collision labels, true tie at 1.0 → null (tie-guard fires)', matchStudentJumpIntent('move to chain rule basics and practice', chainItems, 'seg-c1') === null);

// ── R46 (b): "get into" / "dig into" / "dive into" jump verbs ──────
// Live session portal-0c48edbb: "Uh, yeah, let's get into the direct
// substitution examples." — MOVE_VERB_RE had no verb for this phrasing,
// so the jump-matcher never fired. These verbs carry their own
// preposition ("into"), so they must NOT route through the existing
// "to|on to|onto|back to" tail — the alternation gains a second,
// self-contained branch.
const dsItems = [
  { segmentIds: ['seg-a'], label: 'Direct substitution examples' },
  { segmentIds: ['seg-b'], label: 'Quotient law restrictions' },
];
check(
  'get-into (live shape) matches',
  matchStudentJumpIntent("Uh, yeah, let's get into the direct substitution examples.", dsItems, 'seg-b')?.targetSegmentId === 'seg-a',
);
check(
  'dig-into matches',
  matchStudentJumpIntent('let\'s dig into quotient law restrictions', dsItems, 'seg-a')?.targetSegmentId === 'seg-b',
);
check(
  'dive-into matches',
  matchStudentJumpIntent('can we dive into direct substitution examples', dsItems, 'seg-b')?.targetSegmentId === 'seg-a',
);
check(
  'get-into with no label named → null',
  matchStudentJumpIntent("let's get into it", dsItems, 'seg-a') === null,
);
check(
  'dig (non-jump sense, no "into" destination) → null',
  matchStudentJumpIntent('I dig this topic', dsItems, 'seg-a') === null,
);

console.log(`\nstudent-jump-intent: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
