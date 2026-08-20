/**
 * Unit tests for stripStageDirections (live 2026-07-30, session
 * portal-589b451a: the brain wrote "…what does that give
 * you?(waiting for the student's answer)" and TTS spoke the
 * parenthetical). No framework — node:assert + tiny test() harness,
 * matching test-sentence-spacing.ts. Run: npm run test:stage-direction-strip
 */

import { strict as assert } from 'node:assert';
import { stripStageDirections, stripMetaNarration } from '../src/lib/tutor/voice/sentence-spacing';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}\n      ${(err as Error).message}`);
    failed++;
  }
}

console.log('stripStageDirections');

// — The live leak, verbatim —

test('strips the live "(waiting for the student\'s answer)" leak', () => {
  assert.equal(
    stripStageDirections("So $3(x-2)$ becomes $3 \\cdot x$ minus $3 \\cdot 2$ — what does that give you?(waiting for the student's answer)"),
    'So $3(x-2)$ becomes $3 \\cdot x$ minus $3 \\cdot 2$ — what does that give you?',
  );
});

// — Same class, other spellings —

test('strips "(pause)"', () => {
  assert.equal(stripStageDirections('What do you get? (pause)'), 'What do you get?');
});

test('strips "(pauses for the student)"', () => {
  assert.equal(stripStageDirections('Try it. (pauses for the student)'), 'Try it.');
});

test('strips "(waits for response)"', () => {
  assert.equal(stripStageDirections('Your move. (waits for response)'), 'Your move.');
});

test('strips "(awaiting the answer)"', () => {
  assert.equal(stripStageDirections('Go ahead. (awaiting the answer)'), 'Go ahead.');
});

test('strips "(silence)" and "(beat)"', () => {
  assert.equal(stripStageDirections('Think about it. (silence)'), 'Think about it.');
  assert.equal(stripStageDirections('Think about it. (beat)'), 'Think about it.');
});

test('strips "(student responds)"', () => {
  assert.equal(stripStageDirections('What is 7 + 1? (student responds)'), 'What is 7 + 1?');
});

test('strips "(no response)"', () => {
  assert.equal(stripStageDirections('Still there? (no response)'), 'Still there?');
});

test('strips "(listening)"', () => {
  assert.equal(stripStageDirections('Walk me through it. (listening)'), 'Walk me through it.');
});

test('a sentence that is ONLY a stage direction strips to empty', () => {
  assert.equal(stripStageDirections("(waiting for the student's answer)"), '');
});

test('collapses the double space a mid-sentence strip leaves behind', () => {
  assert.equal(
    stripStageDirections('Take your time (pause) and check the sign.'),
    'Take your time and check the sign.',
  );
});

// — Must NOT touch legitimate parentheticals —

test('keeps math parentheticals', () => {
  assert.equal(stripStageDirections('Distribute the 3 in $3(x-2)$ first.'), 'Distribute the 3 in $3(x-2)$ first.');
  assert.equal(stripStageDirections('So 3(x - 2) + 5 = 2x + 7.'), 'So 3(x - 2) + 5 = 2x + 7.');
});

test('keeps ordinary asides', () => {
  assert.equal(
    stripStageDirections('That allowance (about an hour a day) resets monthly.'),
    'That allowance (about an hour a day) resets monthly.',
  );
});

test('keeps content that merely mentions waiting outside parens', () => {
  assert.equal(
    stripStageDirections('The bus is waiting for the student.'),
    'The bus is waiting for the student.',
  );
});

test('keeps a parenthetical where a stage verb appears mid-content', () => {
  assert.equal(
    stripStageDirections('Newton kept working (his rivals were waiting) and published anyway.'),
    'Newton kept working (his rivals were waiting) and published anyway.',
  );
});

test('no-op on empty / plain text', () => {
  assert.equal(stripStageDirections(''), '');
  assert.equal(stripStageDirections('Right — 8.'), 'Right — 8.');
});

// ── R49b: third-person meta-narration leak (live portal-2d53e403, 288.4s) ──
// The tutor SPOKE its own adjudication reasoning: `Their reply "10.5"
// answers an earlier question (After Tuesday), but the active question asks
// for ten fifty minus six seventy-five. Hang on — ...`. Not a template — no
// such string exists in the codebase; the BRAIN wrote it, prompted by the
// stale-card rule at claude-brain.ts:1213. It passed `judge_pass grounded`
// and sailed through stripStageDirections, which only removes PARENTHETICALS.
// Counted as 4 sentences / 62 words of real turn.
//
// The tutor addresses the student in the SECOND person. A sentence about
// "their reply" / "the student's answer" is machinery talking to itself.
// The gate is deliberately two-part — third-person-student subject AND an
// adjudication marker — because "their reply" alone is ordinary prose in a
// history or literature lesson.
const LIVE_LEAK = 'Their reply "10.5" answers an earlier question (After Tuesday), but the active question asks for ten fifty minus six seventy-five.';

test('strips the exact live leak and keeps the real teaching that followed', () => {
  const input = LIVE_LEAK + ' Hang on — that ten fifty was the number after Tuesday.';
  const out = stripMetaNarration(input);
  assert.ok(!out.includes('Their reply'), 'meta sentence must be gone');
  assert.ok(!out.includes('active question'), 'adjudication phrasing must be gone');
  assert.equal(out, 'Hang on — that ten fifty was the number after Tuesday.');
});

test('strips a meta sentence that is the ENTIRE turn (caller drops empty)', () => {
  assert.equal(stripMetaNarration(LIVE_LEAK), '');
});

test('strips the-students-answer phrasing', () => {
  const out = stripMetaNarration("The student's answer matches the expected answer. Right, nice work.");
  assert.equal(out, 'Right, nice work.');
});

// ── false-positive guards: ordinary teaching prose must survive ──
test('KEEPS ordinary third-person prose with no adjudication marker', () => {
  const s = 'Their reply to the king was open defiance.';
  assert.equal(stripMetaNarration(s), s);
});

test('KEEPS second-person speech even when it names the active question', () => {
  const s = 'You answered an earlier question there, but the active question asks for something else.';
  assert.equal(stripMetaNarration(s), s, 'talking TO the student is legitimate teaching');
});

test('KEEPS a history sentence that merely contains their answer', () => {
  const s = 'The colonists sent their answer, and it did not match what London expected.';
  assert.equal(stripMetaNarration(s), s);
});

test('KEEPS normal math prose untouched', () => {
  const s = 'Ten fifty minus six seventy-five leaves three seventy-five.';
  assert.equal(stripMetaNarration(s), s);
});

// Regression pin for a bug found WHILE implementing this guard: the first
// splitter used /[.!?]/ and cut "10.5" at the decimal, stranding the subject
// in one fragment and the adjudication marker in the other so neither
// matched. Decimals inside sentences are routine in a math tutor, so this
// invariant is pinned separately from the live-leak case that exposed it.
test('decimal-safe: sentences containing decimals are not split at the point', () => {
  const s = 'Ten fifty minus six seventy-five is 3.75 and 0.5 of that is 1.875.';
  assert.equal(stripMetaNarration(s), s, 'no meta here — must pass through whole');
  const leak = 'Their answer 3.75 matches the expected answer. Nice, 3.75 it is.';
  assert.equal(stripMetaNarration(leak), 'Nice, 3.75 it is.', 'decimals survive the split on both sides');
});

test('empty / whitespace input is total, never throws', () => {
  assert.equal(stripMetaNarration(''), '');
  assert.equal(stripMetaNarration('   '), '');
});


console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
