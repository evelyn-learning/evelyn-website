/**
 * Unit tests for the tutor-reactions situation counter (noise-nagging v1).
 * Run: npm run test:tutor-reactions
 * Design: docs/superpowers/specs/2026-07-05-noise-nagging-reaction-design.md
 *
 * Mechanism under test: situation counter → one-time spoken suggestion.
 * A reaction rule fires when `threshold` events land within a sliding
 * `windowMs`, at most `maxFiresPerSession` times; firing clears the window.
 */
import {
  createReactionState,
  recordReactionEvent,
  NOISE_INTERRUPTION_REACTION,
  type TutorReactionRule,
} from '../apps/marketing/src/lib/tutor/voice/tutor-reactions';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name}`);
  }
}

const RULE: TutorReactionRule = {
  id: 'test-rule',
  threshold: 3,
  windowMs: 180_000,
  maxFiresPerSession: 1,
  directive: '[test directive]',
};

console.log('tutor-reactions counter');

// 1. Below threshold → never fires.
{
  const s = createReactionState();
  check('1st event no fire', recordReactionEvent(s, RULE, 0) === false);
  check('2nd event no fire', recordReactionEvent(s, RULE, 10_000) === false);
}

// 2. Threshold crossing fires exactly once.
{
  const s = createReactionState();
  recordReactionEvent(s, RULE, 0);
  recordReactionEvent(s, RULE, 10_000);
  check('3rd event within window fires', recordReactionEvent(s, RULE, 20_000) === true);
  check('4th event no re-fire (maxFiresPerSession=1)', recordReactionEvent(s, RULE, 21_000) === false);
  check('burst much later still no re-fire', [30_000, 31_000, 32_000].map((t) => recordReactionEvent(s, RULE, 200_000 + t)).every((r) => r === false));
}

// 3. Sliding window: stale events prune — 3 events spread wider than the
//    window never fire.
{
  const s = createReactionState();
  check('event at t=0 no fire', recordReactionEvent(s, RULE, 0) === false);
  check('event at t=100s no fire', recordReactionEvent(s, RULE, 100_000) === false);
  check('event at t=200s no fire (t=0 pruned, only 2 in window)', recordReactionEvent(s, RULE, 200_000) === false);
  check('event at t=210s fires (100s, 200s, 210s all in window)', recordReactionEvent(s, RULE, 210_000) === true);
}

// 4. maxFiresPerSession=2 allows a second fire from FRESH events (window
//    cleared on fire — the same events never double-count).
{
  const s = createReactionState();
  const rule2: TutorReactionRule = { ...RULE, maxFiresPerSession: 2 };
  [0, 1_000, 2_000].forEach((t) => recordReactionEvent(s, rule2, t));
  check('4th event right after a fire does NOT immediately re-fire (events cleared)', recordReactionEvent(s, rule2, 3_000) === false);
  check('takes a fresh threshold-worth to fire again', (() => {
    recordReactionEvent(s, rule2, 4_000);
    return recordReactionEvent(s, rule2, 5_000) === true;
  })());
  check('third fire blocked at maxFiresPerSession=2', (() => {
    [6_000, 7_000, 8_000].forEach((t) => recordReactionEvent(s, rule2, t));
    return recordReactionEvent(s, rule2, 9_000) === false;
  })());
}

// 5. Independent states don't share counts.
{
  const a = createReactionState();
  const b = createReactionState();
  recordReactionEvent(a, RULE, 0);
  recordReactionEvent(a, RULE, 1_000);
  check('other state unaffected by first state events', recordReactionEvent(b, RULE, 2_000) === false);
  check('first state fires on its own 3rd', recordReactionEvent(a, RULE, 2_000) === true);
}

// 6. Shipped noise rule: sane config + generic directive.
{
  const r = NOISE_INTERRUPTION_REACTION;
  check('noise rule threshold 3', r.threshold === 3);
  check('noise rule window 3 minutes', r.windowMs === 180_000);
  check('noise rule fires once per session', r.maxFiresPerSession === 1);
  check('noise directive is bracketed system-style', r.directive.startsWith('[') && r.directive.endsWith(']'));
  check('noise directive mentions muting + typing', /mute/i.test(r.directive) && /typ/i.test(r.directive));
  check('noise directive tells the tutor to continue afterwards', /continue/i.test(r.directive));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
