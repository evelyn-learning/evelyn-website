/**
 * Task 5 probe: prints + asserts the `<homework_session>` block that
 * formatHomeworkSessionBlock injects, and the set_current_problem tool
 * plumbing (mapFunctionCallToCommand).
 *
 * Confirms:
 *   - homework absent (undefined) renders NOTHING (block omitted ⇒
 *     userContent byte-identical for every non-homework session).
 *   - a populated homework context renders `<homework_session>`, the
 *     "Problem {label} ({current} of {N})" progress line (current = list
 *     POSITION, label = that problem's own number), the VERBATIM problem text
 *     (no escaping), the "never state" ask-never-tell rule, and mentions
 *     set_current_problem as the announce mechanism.
 *   - mapFunctionCallToCommand('set_current_problem', { n }) maps to the
 *     { action: 'setCurrentProblem', n } WhiteboardCommand.
 *
 * Run:
 *   npx tsx scripts/test-homework-session-block.ts
 */
import { formatHomeworkSessionBlock, formatActiveProblemBlock, ACTIVE_PROBLEM_HOMEWORK_REVEAL_SUFFIX } from '../src/lib/tutor/voice/claude-brain';
import { mapFunctionCallToCommand } from '../src/app/tutor/hooks/toolDefinitions';

let failed = false;
const fail = (msg: string) => { console.error(`FAIL: ${msg}`); failed = true; };

// ── 1. Omitted when absent ─────────────────────────────────────────────
const emptyBlock = formatHomeworkSessionBlock(undefined);
console.log('=== homework=undefined (should be empty) ===');
console.log(emptyBlock === '' ? '(empty string — block omitted)' : emptyBlock);
if (emptyBlock !== '') fail('homework=undefined must omit the block entirely');

// ── 2. Rendered block with problems + current pointer ─────────────────
const hw = {
  problems: [
    { n: 1, text: 'x+2=5' },
    { n: 2, text: '2y=8' },
  ],
  current: 2,
};
const block = formatHomeworkSessionBlock(hw);
console.log('\n=== homework={problems:[x+2=5, 2y=8], current:2} ===');
console.log(block);

if (block === '') fail('a populated homework context must render a block');

const checks: Array<[RegExp | string, string]> = [
  ['<homework_session>', 'must open the <homework_session> tag'],
  ['Current: Problem 2 (2 of 2).', 'must state the current-problem progress line'],
  ['put Problem 1 on the board, call set_current_problem with 1,', 'opener must name the FIRST problem by its number'],
  ['x+2=5', 'must include the first problem VERBATIM'],
  ['2y=8', 'must include the second problem VERBATIM'],
  [/never state/i, 'must carry the ask-never-tell "never state" rule'],
  ['set_current_problem', 'must name set_current_problem as the announce mechanism'],
];
for (const [needle, desc] of checks) {
  const ok = typeof needle === 'string' ? block.includes(needle) : needle.test(block);
  if (!ok) fail(`rendered block ${desc}`);
}

// ── 2b. Non-sequential worksheet labels: current is a POSITION ───────
const hwLabels = {
  problems: [
    { n: 3, text: 'a+1=4' },
    { n: 7, text: 'b-2=9' },
    { n: 11, text: '3c=12' },
  ],
  current: 2,
};
const labelBlock = formatHomeworkSessionBlock(hwLabels);
console.log('\n=== homework={labels 3,7,11, current:2} ===');
console.log(labelBlock);
if (!labelBlock.includes('Current: Problem 7 (2 of 3).')) {
  fail('non-sequential labels: position 2 must render as "Problem 7 (2 of 3)"');
}
if (!labelBlock.includes('put Problem 3 on the board, call set_current_problem with 3,')) {
  fail('non-sequential labels: opener must use the first problem\'s own number (3), not 1');
}
if (!labelBlock.includes('7. b-2=9')) fail('non-sequential labels: list must keep the worksheet numbers');

// ── 3. mapFunctionCallToCommand wiring ─────────────────────────────────
console.log('\n=== mapFunctionCallToCommand(set_current_problem) ===');
const cmd = mapFunctionCallToCommand('set_current_problem', { n: 3 });
console.log(JSON.stringify(cmd));
if (JSON.stringify(cmd) !== JSON.stringify({ action: 'setCurrentProblem', n: 3 })) {
  fail(`set_current_problem must map to { action: 'setCurrentProblem', n: 3 } — got ${JSON.stringify(cmd)}`);
}

// ── 4. <active_problem> reveal licence is overridden only in homework ─
console.log('\n=== <active_problem> homework reveal suffix ===');
const variants: Array<[string, Parameters<typeof formatActiveProblemBlock>[0]]> = [
  ['student', { statement: 'x+2=5', expectedAnswer: 'x=3', source: 'student' }],
  ['card', { statement: 'x+2=5', expectedAnswer: 'x=3', source: 'card' }],
  ['pipeline', { statement: 'x+2=5', expectedAnswer: 'x=3' }],
];
for (const [label, active] of variants) {
  const plain = formatActiveProblemBlock(active);
  const plainFalse = formatActiveProblemBlock(active, { homework: false });
  const withHw = formatActiveProblemBlock(active, { homework: true });
  if (plain.includes(ACTIVE_PROBLEM_HOMEWORK_REVEAL_SUFFIX)) fail(`${label}: suffix must NOT appear without homework`);
  if (plain !== plainFalse) fail(`${label}: homework:false must render byte-identical to no opts`);
  if (!withHw.includes(`given up.${ACTIVE_PROBLEM_HOMEWORK_REVEAL_SUFFIX}\n`)) fail(`${label}: suffix must follow the reveal sentence in homework`);
  if (withHw.replace(ACTIVE_PROBLEM_HOMEWORK_REVEAL_SUFFIX, '') !== plain) fail(`${label}: homework must differ ONLY by the suffix`);
}
// No expected answer → no reveal sentence → nothing to override.
const noAns = formatActiveProblemBlock({ statement: 'x+2=5' }, { homework: true });
if (noAns.includes(ACTIVE_PROBLEM_HOMEWORK_REVEAL_SUFFIX)) fail('no expectedAnswer: suffix must not appear (no reveal sentence)');

if (failed) {
  console.error('\ntest-homework-session-block: FAILED');
  process.exit(1);
} else {
  console.log('\ntest-homework-session-block: all cases OK (omission + block content + tool mapping)');
}
