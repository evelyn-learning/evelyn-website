/**
 * Unit test — Task E1: budget-aware satisfying stop (`<demo_stop>` block).
 *
 * formatDemoStopBlock is the pure block renderer both userContent
 * composition twins (runBrainTurn / streamBrainTurn) concatenate. This
 * suite pins:
 *   1. absent input ⇒ '' (the flag-off / subscribed guarantee: '' is the
 *      concatenation identity, so userContent is byte-identical),
 *   2. time mode: remaining = budget - elapsed, clamped at 0, both numbers
 *      surfaced, plus the key pacing phrases,
 *   3. milestone mode: the first-concept-boxed phrases, no clock talk,
 *   4. block wrapper shape (<demo_stop>…</demo_stop> + trailing \n\n, the
 *      same convention as every other user-content block).
 *
 * Run: npx tsx scripts/test-demo-stop.ts   (npm run test:pedagogy-e1)
 * No framework — matches the test:pedagogy-c1 pattern.
 */

import { strict as assert } from 'node:assert';
import { formatDemoStopBlock } from '../apps/marketing/src/lib/tutor/voice/claude-brain';
import { selectDemoStopPayload } from '../apps/marketing/src/lib/tutor/voice/demo-stop-mode';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

function main() {
  console.log('Task E1 — <demo_stop> block rendering\n');

  // -- 1. absent ⇒ empty string (userContent unchanged) ----------------------
  test('absent input renders the empty string (concatenation identity)', () => {
    assert.equal(formatDemoStopBlock(undefined), '');
    // '' + block === block: the flag-off / subscribed composition is
    // byte-identical because the twins concatenate this result directly.
    const other = '<student_said>\nhi\n</student_said>';
    assert.equal(formatDemoStopBlock(undefined) + other, other);
  });

  // -- 2. time mode -----------------------------------------------------------
  test('time mode: remaining = budget - elapsed, both numbers surfaced', () => {
    const out = formatDemoStopBlock({ mode: 'time', budgetMinutes: 30, minutesElapsed: 12 });
    assert.ok(out.includes('You have about 18 of 30 minutes left with this student.'), out);
  });

  test('time mode: remaining clamps at 0 when elapsed exceeds budget', () => {
    const out = formatDemoStopBlock({ mode: 'time', budgetMinutes: 30, minutesElapsed: 45 });
    assert.ok(out.includes('You have about 0 of 30 minutes left'), out);
    assert.ok(!out.includes('-15'), 'no negative remaining minutes');
  });

  test('time mode: zero elapsed leaves the full budget', () => {
    const out = formatDemoStopBlock({ mode: 'time', budgetMinutes: 30, minutesElapsed: 0 });
    assert.ok(out.includes('You have about 30 of 30 minutes left'));
  });

  test('time mode: key pacing phrases present', () => {
    const out = formatDemoStopBlock({ mode: 'time', budgetMinutes: 30, minutesElapsed: 5 });
    assert.ok(out.includes('one genuine "I get it now" moment AND a clean stopping point'));
    assert.ok(out.includes('never end mid-concept or mid-example'));
    assert.ok(out.includes('through the RIGHT visual and by adapting when they\'re confused, not by drawing extra pictures'));
  });

  // -- 3. milestone mode -------------------------------------------------------
  test('milestone mode: first-concept-boxed phrases present', () => {
    const out = formatDemoStopBlock({ mode: 'milestone' });
    assert.ok(out.includes('win must land ON completing the first concept'));
    assert.ok(out.includes('one genuinely-earned "I get it now" moment that completes a concept'));
    assert.ok(out.includes("the session's value is boxed to that moment"));
    assert.ok(out.includes('never end mid-concept'));
  });

  test('milestone mode: carries no minute/clock numbers', () => {
    const out = formatDemoStopBlock({ mode: 'milestone' });
    assert.ok(!/\bminutes?\b/i.test(out), 'milestone block should not talk about minutes');
    assert.ok(!/\d/.test(out), 'milestone block should carry no numbers');
  });

  // -- 4. wrapper shape ---------------------------------------------------------
  test('both modes: <demo_stop> wrapper + trailing blank line (block convention)', () => {
    for (const input of [
      { mode: 'time' as const, budgetMinutes: 30, minutesElapsed: 10 },
      { mode: 'milestone' as const },
    ]) {
      const out = formatDemoStopBlock(input);
      assert.ok(out.startsWith('<demo_stop>\n'), `starts with the opening tag: ${out.slice(0, 30)}`);
      assert.ok(out.endsWith('\n</demo_stop>\n\n'), 'ends with the closing tag + \\n\\n separator');
    }
  });

  // -- 5. graceful wrap phase (demo time-box P3) -------------------------------
  test('time mode: below the wrap threshold keeps the pre-wrap pacing text', () => {
    const out = formatDemoStopBlock({ mode: 'time', budgetMinutes: 15, minutesElapsed: 10, wrapAtMinutes: 13 });
    assert.ok(out.includes('You have about 5 of 15 minutes left'), out);
    assert.ok(!/Wrap up NOW/i.test(out), 'must not wrap before the threshold');
  });

  test('time mode: at/after the wrap threshold switches to the wrap directive', () => {
    for (const elapsed of [13, 14, 30]) {
      const out = formatDemoStopBlock({ mode: 'time', budgetMinutes: 15, minutesElapsed: elapsed, wrapAtMinutes: 13 });
      assert.ok(out.includes('Wrap up NOW'), `elapsed=${elapsed}: ${out}`);
      assert.ok(out.includes('land the "I get it" moment'), out);
      assert.ok(out.includes('Do not start new material'), out);
      assert.ok(!/minutes left/.test(out), 'wrap directive drops the remaining-minutes pacing line');
    }
  });

  test('time mode: no wrapAtMinutes ⇒ never wraps (untimed-demo behavior unchanged)', () => {
    const out = formatDemoStopBlock({ mode: 'time', budgetMinutes: 30, minutesElapsed: 29 });
    assert.ok(out.includes('You have about 1 of 30 minutes left'), out);
    assert.ok(!/Wrap up NOW/i.test(out));
  });

  test('wrap directive still respects the block wrapper convention', () => {
    const out = formatDemoStopBlock({ mode: 'time', budgetMinutes: 15, minutesElapsed: 14, wrapAtMinutes: 13 });
    assert.ok(out.startsWith('<demo_stop>\n'));
    assert.ok(out.endsWith('\n</demo_stop>\n\n'));
  });

  // -- 6. mode selection matrix (is_trial × explicit-duration) -----------------
  test('trial WITHOUT explicit time box ⇒ milestone (today\'s behavior)', () => {
    const p = selectDemoStopPayload({
      isTrial: true, maxDurationExplicit: false, budgetMinutes: 30, minutesElapsed: 5,
    });
    assert.deepEqual(p, { mode: 'milestone' });
  });

  test('trial WITH explicit time box ⇒ time mode + wrap (the homepage timed demo)', () => {
    const p = selectDemoStopPayload({
      isTrial: true, maxDurationExplicit: true, budgetMinutes: 15, minutesElapsed: 4, wrapAtMinutes: 13,
    });
    assert.deepEqual(p, { mode: 'time', budgetMinutes: 15, minutesElapsed: 4, wrapAtMinutes: 13 });
  });

  test('non-trial demo ⇒ time mode (unchanged); wrapAtMinutes omitted when absent', () => {
    const p = selectDemoStopPayload({
      isTrial: false, maxDurationExplicit: false, budgetMinutes: 30, minutesElapsed: 8,
    });
    assert.deepEqual(p, { mode: 'time', budgetMinutes: 30, minutesElapsed: 8 });
    assert.ok(!('wrapAtMinutes' in p), 'no wrap key when the threshold is undefined');
  });

  test('non-trial demo WITH explicit duration + wrap ⇒ time mode carrying wrap', () => {
    const p = selectDemoStopPayload({
      isTrial: false, maxDurationExplicit: true, budgetMinutes: 20, minutesElapsed: 0, wrapAtMinutes: 18,
    });
    assert.deepEqual(p, { mode: 'time', budgetMinutes: 20, minutesElapsed: 0, wrapAtMinutes: 18 });
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
