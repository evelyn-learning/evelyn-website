/** Spec §A.2/A.5 — pure per-LO struggle ledger. Usage: npx tsx scripts/test-struggle-ledger.ts */
import {
  createLedger, applyLedgerEvent, markRecovered, LEDGER_TUNING, STUCK_CUE_RE, CONFUSION_RE, prereqKey,
} from '../src/lib/tutor/orchestrator/struggle-ledger';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}
const ev = (kind: Parameters<typeof applyLedgerEvent>[1]['kind'], loId = 'lo1', segId = 's1', atMs = 0) => ({ kind, loId, segId, atMs });

{ // one wrong answer is not a detection
  const L = createLedger();
  check('single wrong → no detection', applyLedgerEvent(L, ev('wrong')) === null);
}
{ // two wrongs cross the threshold with INCORRECT_STREAK_2_PLUS
  const L = createLedger();
  applyLedgerEvent(L, ev('wrong'));
  const d = applyLedgerEvent(L, ev('wrong', 'lo1', 's1', 1000));
  check('two wrongs → detection', d !== null && d.count === 1 && d.recurrence === false, JSON.stringify(d));
  check('signals carry INCORRECT_STREAK_2_PLUS', !!d && d.signals.includes('INCORRECT_STREAK_2_PLUS'));
  check('score resets after detection', L.get('lo1')!.score === 0);
}
{ // brain_gap alone (weight 2) detects immediately and marks sawBrainGapThisSegment
  const L = createLedger();
  const d = applyLedgerEvent(L, ev('brain_gap'));
  check('brain_gap → detection with sawBrainGapThisSegment', !!d && d.sawBrainGapThisSegment === true);
}
{ // cooldown: same segment within 90s does not produce a second detection
  const L = createLedger();
  applyLedgerEvent(L, ev('wrong')); applyLedgerEvent(L, ev('wrong', 'lo1', 's1', 1000));
  applyLedgerEvent(L, ev('wrong', 'lo1', 's1', 2000));
  const d = applyLedgerEvent(L, ev('wrong', 'lo1', 's1', 3000));
  check('second detection blocked by cooldown (same seg, <90s)', d === null);
  const d2 = applyLedgerEvent(L, ev('confusion', 'lo1', 's2', 4000));
  check('different segment → recurrence (count 2)', !!d2 && d2.count === 2 && d2.recurrence === true, JSON.stringify(d2));
  check('recurrence signals include STUDENT_VERBALIZED_CONFUSION', !!d2 && d2.signals.includes('STUDENT_VERBALIZED_CONFUSION'));
}
{ // cooldown by time in the same segment
  const L = createLedger();
  applyLedgerEvent(L, ev('wrong')); applyLedgerEvent(L, ev('wrong', 'lo1', 's1', 1000));
  applyLedgerEvent(L, ev('stuck_cue', 'lo1', 's1', 100_000));
  const d = applyLedgerEvent(L, ev('no_recovery', 'lo1', 's1', 101_000));
  check('≥90s later in same segment → recurrence', !!d && d.recurrence === true);
  check('signals include STUCK_CUE and NO_RECOVERY', !!d && d.signals.includes('STUCK_CUE') && d.signals.includes('NO_RECOVERY'));
}
{ // slow_segment weighs 0.5
  const L = createLedger();
  applyLedgerEvent(L, ev('slow_segment')); applyLedgerEvent(L, ev('slow_segment', 'lo1', 's2'));
  check('two slow segments (1.0) < threshold', applyLedgerEvent(L, ev('slow_segment', 'lo1', 's3')) === null);
  check('weights as specified', LEDGER_TUNING.weights.slow_segment === 0.5 && LEDGER_TUNING.weights.brain_gap === 2 && LEDGER_TUNING.detectThreshold === 2);
}
{ // LOs are independent; recovered flag
  const L = createLedger();
  applyLedgerEvent(L, ev('wrong', 'a')); applyLedgerEvent(L, ev('wrong', 'b'));
  check('events on different LOs do not sum', applyLedgerEvent(L, ev('slow_segment', 'a')) === null);
  markRecovered(L, 'a');
  check('markRecovered sets recovered', L.get('a')!.recovered === true);
  markRecovered(L, 'zzz');
  check('markRecovered on unknown LO is a no-op', !L.has('zzz'));
}
{ // recovered flag is reset by applyLedgerEvent
  const L = createLedger();
  applyLedgerEvent(L, ev('wrong')); applyLedgerEvent(L, ev('wrong', 'lo1', 's1', 1000));
  markRecovered(L, 'lo1');
  check('recovered is true after markRecovered', L.get('lo1')!.recovered === true);
  applyLedgerEvent(L, ev('wrong', 'lo1', 's2', 200_000));
  check('applyLedgerEvent resets recovered to false', L.get('lo1')!.recovered === false);
}
check('STUCK_CUE_RE matches "I don\'t know"', STUCK_CUE_RE.test("I don't know"));
check('STUCK_CUE_RE does not match "I know this"', !STUCK_CUE_RE.test('I know this one'));
check('CONFUSION_RE matches "I\'m confused"', CONFUSION_RE.test("I'm confused about this"));
check('CONFUSION_RE matches "doesn\'t make sense"', CONFUSION_RE.test("that doesn't make sense"));
check('CONFUSION_RE does not match a plain answer', !CONFUSION_RE.test('the answer is twelve'));
check('prereqKey lowercases and prefixes', prereqKey('Times Tables') === 'prereq:times tables');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
