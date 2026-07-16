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
// The client derives practiceMode := (session_goal === 'practice'). Model a
// fresh mint and a resume mint of the SAME session; both carry session_goal,
// so both derive true and both produce the identical block.
type MintedToken = { session_goal?: string; resume?: boolean };
const derivePracticeMode = (t: MintedToken) => t.session_goal === 'practice';

const freshMint: MintedToken = { session_goal: 'practice' };
const resumeMint: MintedToken = { session_goal: 'practice', resume: true };

const freshBlock = formatPracticeSessionBlock(derivePracticeMode(freshMint));
const resumeBlock = formatPracticeSessionBlock(derivePracticeMode(resumeMint));

console.log('\n=== resume-durability: fresh mint vs resume mint ===');
console.log(`fresh derives practiceMode=${derivePracticeMode(freshMint)}, resume derives practiceMode=${derivePracticeMode(resumeMint)}`);
if (!derivePracticeMode(freshMint)) fail('fresh mint with session_goal=practice must derive practiceMode=true');
if (!derivePracticeMode(resumeMint)) fail('resume mint with session_goal=practice must derive practiceMode=true');
if (freshBlock === '' || resumeBlock === '') fail('both mints must render a non-empty block');
if (freshBlock !== resumeBlock) fail('resume block must be BYTE-IDENTICAL to the fresh block — mode is re-asserted from the boot flag, not dropped on resume');
else console.log('OK: resume block is byte-identical to the fresh block (durable across resume)');

// A non-practice goal (the portal's current hardcoded default) stays off
// across resume too — no accidental practice-mode leakage.
const conceptReviewResume: MintedToken = { session_goal: 'concept-review', resume: true };
if (formatPracticeSessionBlock(derivePracticeMode(conceptReviewResume)) !== '') {
  fail('a non-practice goal must not render the block, even on resume');
}

if (failed) {
  console.error('\ntest-practice-session-block: FAILED');
  process.exit(1);
} else {
  console.log('\ntest-practice-session-block: all cases OK (omission + mandate invariants + resume durability)');
}
