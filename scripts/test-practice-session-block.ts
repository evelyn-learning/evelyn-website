/**
 * Task X2 probe: prints + asserts the `<practice_session>` block that
 * formatPracticeSessionBlock injects, and proves the resume-durability
 * contract at the unit level.
 *
 * Confirms:
 *   - practiceMode falsy (undefined / false) renders NOTHING (block omitted
 *     ⇒ userContent byte-identical for every non-practice session).
 *   - practiceMode === true renders a directive block carrying the mandate's
 *     load-bearing invariants: practice-only, NO new-concept teaching,
 *     problem→attempt→feedback loop, brief-prereq-remediation-allowed, and
 *     an explicit DEMOTE of the competing <lesson_plan>/<segment_truth>
 *     mandates (the drift this task fixes).
 *   - RESUME DURABILITY: the mode is derived from the embed token's
 *     session_goal, a boot flag that rides EVERY mint (initial + resume).
 *     Deriving practiceMode from a mock "fresh" mint and a mock "resume"
 *     mint yields the IDENTICAL non-empty block — the mode is re-asserted
 *     from the boot flag, never from transient turn state a resume could
 *     drop (contrast the one-shot "Give me some practice problems." chip).
 *
 * Run:
 *   npx tsx scripts/test-practice-session-block.ts
 */
import { formatPracticeSessionBlock } from '../src/lib/tutor/voice/claude-brain';
import { derivePracticeMode } from '../src/lib/tutor/voice/practice-mode';

let failed = false;
const fail = (msg: string) => { console.error(`FAIL: ${msg}`); failed = true; };

// ── 1. Omitted for non-practice sessions ──────────────────────────────
for (const off of [undefined, false] as const) {
  const block = formatPracticeSessionBlock(off);
  console.log(`\n=== practiceMode=${String(off)} (should be empty) ===`);
  console.log(block === '' ? '(empty string — block omitted)' : block);
  if (block !== '') fail(`practiceMode=${String(off)} must omit the block entirely`);
}

// ── 2. Rendered mandate + invariants ──────────────────────────────────
const block = formatPracticeSessionBlock(true);
console.log('\n=== practiceMode=true ===');
console.log(block);

if (block === '') fail('practiceMode=true must render a block');
if (!/^<practice_session>\n/.test(block)) fail('block must open with the <practice_session> tag');
if (!/<\/practice_session>\n\n$/.test(block)) fail('block must close with </practice_session> + blank line');

const invariants: Array<[RegExp, string]> = [
  [/practice session/i, 'declares it is a PRACTICE session'],
  [/no new-concept teaching/i, 'forbids new-concept teaching'],
  [/problem\s*→\s*student attempt\s*→\s*targeted feedback/i, 'states the problem→attempt→feedback loop'],
  [/prerequisite remediation/i, 'allows brief prerequisite remediation'],
  [/demote/i, 'DEMOTEs the competing lesson_plan / segment_truth mandate'],
  [/<lesson_plan>|<segment_truth>/i, 'names the segment mandates it out-ranks'],
];
for (const [re, desc] of invariants) {
  if (!re.test(block)) fail(`rendered block must ${desc}`);
}

// ── 3. Resume-durability contract ─────────────────────────────────────
// The client derives practiceMode := (session_goal === 'practice') OR'd with
// the (Y1) chip override. Model a fresh mint and a resume mint of the SAME
// session; both carry session_goal, so both derive true and both produce
// the identical block. No override on either mint here — that's covered by
// the dedicated Y1 precedence section (#4) below.
type MintedToken = { session_goal?: string; resume?: boolean };
const deriveModeFromMint = (t: MintedToken) => derivePracticeMode(t.session_goal as 'practice' | 'concept-review' | undefined, undefined);

const freshMint: MintedToken = { session_goal: 'practice' };
const resumeMint: MintedToken = { session_goal: 'practice', resume: true };

const freshBlock = formatPracticeSessionBlock(deriveModeFromMint(freshMint));
const resumeBlock = formatPracticeSessionBlock(deriveModeFromMint(resumeMint));

console.log('\n=== resume-durability: fresh mint vs resume mint ===');
console.log(`fresh derives practiceMode=${deriveModeFromMint(freshMint)}, resume derives practiceMode=${deriveModeFromMint(resumeMint)}`);
if (!deriveModeFromMint(freshMint)) fail('fresh mint with session_goal=practice must derive practiceMode=true');
if (!deriveModeFromMint(resumeMint)) fail('resume mint with session_goal=practice must derive practiceMode=true');
if (freshBlock === '' || resumeBlock === '') fail('both mints must render a non-empty block');
if (freshBlock !== resumeBlock) fail('resume block must be BYTE-IDENTICAL to the fresh block — mode is re-asserted from the boot flag, not dropped on resume');
else console.log('OK: resume block is byte-identical to the fresh block (durable across resume)');

// A non-practice goal (the portal's current hardcoded default) stays off
// across resume too — no accidental practice-mode leakage.
const conceptReviewResume: MintedToken = { session_goal: 'concept-review', resume: true };
if (formatPracticeSessionBlock(deriveModeFromMint(conceptReviewResume)) !== '') {
  fail('a non-practice goal must not render the block, even on resume');
}

// ── 4. Task Y1: starter-chip practiceOverride derivation ──────────────
// derivePracticeMode(sessionGoal, practiceOverride) is the pure fn the
// client calls every turn (VoiceTutorRealtime.tsx) to fold the token's
// launch-context goal together with the student's in-session chip intent.
// Precedence: token = launch context; override = in-session intent, wins
// WHILE SET, but can only force practiceMode ON (never off) — clearing it
// always falls back to the token, never fights it.
console.log('\n=== derivePracticeMode precedence ===');

// token-practice + no-override -> on (X2's existing contract, unaffected).
if (derivePracticeMode('practice', undefined) !== true) {
  fail('token=practice, no override must derive practiceMode=true');
}
if (derivePracticeMode('practice', false) !== true) {
  fail('token=practice, override=false must derive practiceMode=true');
}

// token-review + override -> on (the chip's whole point: force practice
// mode on top of a non-practice launch goal).
if (derivePracticeMode('concept-review', true) !== true) {
  fail('token=concept-review, override=true must derive practiceMode=true (chip forces it on)');
}

// override cleared -> token wins (no forced-off state: clearing the
// override just removes the force, so a non-practice token reverts off).
if (derivePracticeMode('concept-review', false) !== false) {
  fail('token=concept-review, override cleared must derive practiceMode=false (token governs)');
}
// ...and a practice token stays on even after the override is cleared —
// the chip never fights the token, it can only add to it.
if (derivePracticeMode('practice', false) !== true) {
  fail('token=practice, override cleared must still derive practiceMode=true (token untouched)');
}

// blob restore on RESUME vs FRESH: the pacing-v2 blob only ever persists
// `practiceOverride: true` when set (VoiceTutorRealtime.persistPacingState
// omits the key entirely when false — see the comment there). Y1 fix:
// restore practiceOverride (mode, the "Practice problems" chip) ONLY on
// genuine RESUME; fresh sessions re-invite the choice. paceBias/speakingRate
// (comfort settings) persist across fresh loads — that's fine. A blob
// restored on resume must behave exactly like a fresh chip click.
type PacingV2Blob = { paceBias?: number; speakingRate?: 'slow' | 'normal'; practiceOverride?: boolean };
const blobWithOverride: PacingV2Blob = { paceBias: 0, practiceOverride: true };
const blobWithoutOverride: PacingV2Blob = { paceBias: -1 };

// resumed + blob-override -> ON: the override survives the resume.
if (derivePracticeMode('concept-review', blobWithOverride.practiceOverride === true) !== true) {
  fail('resumed session: restoring a blob with practiceOverride=true must derive practiceMode=true even on a non-practice token');
}

// fresh + blob-override -> OFF: a stale blob override from 20 days ago on
// a fresh session should NOT force practice mode (the blob is ignored on
// fresh loads per Y1 fix). Fresh sessions re-invite the choice.
// On fresh load, the blob restoration code is guarded by `if (resumeState)`,
// so practiceOverride is never read from the blob. Simulating that:
if (derivePracticeMode('concept-review', false) !== false) {
  fail('fresh session: blob override must be ignored (resumeState falsy), so token=concept-review must derive practiceMode=false');
}

// blob without override on either fresh or resumed: must derive from token.
if (derivePracticeMode('concept-review', blobWithoutOverride.practiceOverride === true) !== false) {
  fail('blob with no practiceOverride key must derive practiceMode=false (token governs)');
}
console.log('OK: derivePracticeMode precedence (token-practice+no-override, token-review+override, override-cleared, resumed+blob-override→ON, fresh+blob-override→OFF) all correct');

if (failed) {
  console.error('\ntest-practice-session-block: FAILED');
  process.exit(1);
} else {
  console.log('\ntest-practice-session-block: all cases OK (omission + mandate invariants + resume durability + Y1 override precedence)');
}
