// Time-box lines (demo-polish, 2026-10-29): the prompt-only <demo_stop> wrap
// directive was ignored twice by the brain in embed-1793240679836 and the
// hard stop then cut the session at 10:00 with no goodbye. The client now
// speaks a fixed "two minutes left" line at the wrap minute and a goodbye
// before the hard stop ends the session.
import { WRAP_LINE, goodbyeLine, decideWrapLine, WRAP_LINE_MIN_REMAINING_MS, WRAP_LINE_FLOOR_FREE_MS } from '../src/lib/tutor/voice/timebox-lines';

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) { failures++; console.error(`FAIL ${name}`); } else console.log(`ok ${name}`);
}

check('wrap line copy', WRAP_LINE === "We've got about two minutes left, so let's finish this one.");
check('goodbye with name', goodbyeLine('Praveen Tyagi') === "That's our time for today, Praveen. Nice work.");
check('goodbye without name', goodbyeLine(undefined) === "That's our time for today. Nice work.");
check('goodbye with blank name', goodbyeLine('  ') === "That's our time for today. Nice work.");
check('wrap: not in phase', decideWrapLine({ wrapPhase: false, spoken: false, busy: false, midUtterance: false }) === 'none');
check('wrap: speaks when free', decideWrapLine({ wrapPhase: true, spoken: false, busy: false, midUtterance: false }) === 'speak');
check('wrap: waits while busy', decideWrapLine({ wrapPhase: true, spoken: false, busy: true, midUtterance: false }) === 'wait');
check('wrap: waits mid-utterance', decideWrapLine({ wrapPhase: true, spoken: false, busy: false, midUtterance: true }) === 'wait');
check('wrap: once', decideWrapLine({ wrapPhase: true, spoken: true, busy: false, midUtterance: false }) === 'none');
// Live embed-1793249649483: the line glued itself to the end of the tutor's own
// question (the floor freed that instant) and landed 40 s before the cap.
check('wrap: none under 30 s remaining', decideWrapLine({ wrapPhase: true, spoken: false, busy: false, midUtterance: false, remainingMs: 20_000 }) === 'none');
check('wrap: speaks with 30 s remaining', decideWrapLine({ wrapPhase: true, spoken: false, busy: false, midUtterance: false, remainingMs: 30_000 }) === 'speak');
check('wrap: fallback waits until the floor has been free 3 s', decideWrapLine({ wrapPhase: true, spoken: false, busy: false, midUtterance: false, floorFreeMs: 1_000 }) === 'wait');
check('wrap: fallback speaks after 3 s of free floor', decideWrapLine({ wrapPhase: true, spoken: false, busy: false, midUtterance: false, floorFreeMs: 3_000 }) === 'speak');
check('constants', WRAP_LINE_MIN_REMAINING_MS === 30_000 && WRAP_LINE_FLOOR_FREE_MS === 3_000);

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('all timebox-lines checks passed');
