/**
 * Unit tests for Q-pin collapse/drag behavior helpers (2026-07-23 spec:
 * docs/superpowers/specs/2026-07-23-qpin-collapse-drag-design.md).
 *
 * Run: npx tsx scripts/test-qpin-behavior.ts
 */
import {
  exceedsDragThreshold,
  qpinCollapseDeadline,
  clampQpinFraction,
  latestSubstantiveTutorEntry,
  shouldClearQpinOnSegmentChange,
  isQpinStaleByTurns,
  QPIN_MAX_TUTOR_TURNS_BEHIND,
  QPIN_POST_SPEECH_MS,
  QPIN_HARD_CAP_MS,
  QPIN_TOP_MIN_PX,
  QPIN_BOTTOM_RESERVED_PX,
  QPIN_SIDE_PX,
} from '../src/lib/tutor/qpin-behavior';

let pass = 0;
let fail = 0;

function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${ok ? '' : `  — got: ${JSON.stringify(got)}  want: ${JSON.stringify(want)}`}`);
  if (ok) pass++; else fail++;
}

// --- exceedsDragThreshold ---------------------------------------------
check('4px straight move is a tap', exceedsDragThreshold(4, 0), false);
check('exactly 5px is still a tap (strict >)', exceedsDragThreshold(5, 0), false);
check('6px straight move is a drag', exceedsDragThreshold(6, 0), true);
check('diagonal 4,4 (~5.7px) is a drag', exceedsDragThreshold(4, 4), true);
check('negative deltas use magnitude', exceedsDragThreshold(-6, 0), true);

// --- qpinCollapseDeadline ---------------------------------------------
const T0 = 1_000_000;
check('speech ended → end + 6s', qpinCollapseDeadline(T0, T0 + 2000), T0 + 2000 + QPIN_POST_SPEECH_MS);
check('no speech-end signal → hard cap 15s', qpinCollapseDeadline(T0, null), T0 + QPIN_HARD_CAP_MS);
check(
  'late speech end (14s) → capped at 15s',
  qpinCollapseDeadline(T0, T0 + 14_000),
  T0 + QPIN_HARD_CAP_MS,
);
check(
  'speech ended before show (re-expand while silent) → shownAt + 6s',
  qpinCollapseDeadline(T0, T0),
  T0 + QPIN_POST_SPEECH_MS,
);

// --- clampQpinFraction ------------------------------------------------
const STAGE = { width: 1000, height: 800 };
const PIN = { width: 400, height: 60 };

check(
  'in-bounds position unchanged',
  clampQpinFraction({ x: 0.3, y: 0.5 }, STAGE, PIN),
  { x: 0.3, y: 0.5 },
);
check(
  'left overflow clamps to side gutter',
  clampQpinFraction({ x: -0.5, y: 0.5 }, STAGE, PIN),
  { x: QPIN_SIDE_PX / STAGE.width, y: 0.5 },
);
check(
  'right overflow clamps so pin stays fully visible',
  clampQpinFraction({ x: 0.99, y: 0.5 }, STAGE, PIN),
  { x: (STAGE.width - PIN.width - QPIN_SIDE_PX) / STAGE.width, y: 0.5 },
);
check(
  'top overflow clamps below the floating header band',
  clampQpinFraction({ x: 0.3, y: 0 }, STAGE, PIN),
  { x: 0.3, y: QPIN_TOP_MIN_PX / STAGE.height },
);
check(
  'bottom overflow clamps above the floating tutor bar band',
  clampQpinFraction({ x: 0.3, y: 1 }, STAGE, PIN),
  { x: 0.3, y: (STAGE.height - PIN.height - QPIN_BOTTOM_RESERVED_PX) / STAGE.height },
);
check(
  'degenerate tiny stage: min bounds win (no NaN/negative)',
  clampQpinFraction({ x: 0.5, y: 0.5 }, { width: 100, height: 100 }, PIN),
  { x: QPIN_SIDE_PX / 100, y: QPIN_TOP_MIN_PX / 100 },
);

// --- latestSubstantiveTutorEntry (R38: pin persists across idle-nudge/board-only turns) ---
type Entry = { id: string; role: string; historyOnly?: boolean };
const e = (id: string, role: string, historyOnly?: boolean): Entry => ({ id, role, historyOnly });

check(
  'skips a trailing historyOnly (board-only) tutor entry, returns the last substantive one',
  latestSubstantiveTutorEntry([e('s1', 'student'), e('t1', 'tutor'), e('s2', 'student'), e('t2', 'tutor', true)])?.id,
  't1',
);
check(
  'idle-nudge line (a substantive, non-question tutor entry) IS the latest — returned as-is',
  latestSubstantiveTutorEntry([e('t1', 'tutor'), e('s1', 'student'), e('t2', 'tutor')])?.id,
  't2',
);
check('empty transcript → undefined', latestSubstantiveTutorEntry([]), undefined);
check('no tutor entries → undefined', latestSubstantiveTutorEntry([e('s1', 'student')]), undefined);
check(
  'multiple trailing historyOnly entries are all skipped',
  latestSubstantiveTutorEntry([e('t1', 'tutor'), e('t2', 'tutor', true), e('t3', 'tutor', true)])?.id,
  't1',
);
check(
  'all-historyOnly transcript → undefined (no substantive tutor entry at all)',
  latestSubstantiveTutorEntry([e('t1', 'tutor', true), e('t2', 'tutor', true)]),
  undefined,
);

// --- shouldClearQpinOnSegmentChange (R47 Task 3c: stale pin outlives its
// problem context across a segment advance) ---
check('same segment id (no advance) → do not clear', shouldClearQpinOnSegmentChange('recap', 'recap'), false);
check('advance to a new segment id → clear', shouldClearQpinOnSegmentChange('seg-a', 'seg-b'), true);
check(
  'release to free-conversation (to:"free", segId → "") → clear',
  shouldClearQpinOnSegmentChange('seg-a', ''),
  true,
);
check(
  'resume from free back into a segment ("" → segId) → clear',
  shouldClearQpinOnSegmentChange('', 'seg-a'),
  true,
);
check('both empty (never started a plan) → do not clear', shouldClearQpinOnSegmentChange('', ''), false);

// --- R50 T2: turn-distance staleness bound.
// Rebuilt from live session portal-14bbe45a (Grade 7 fractions, 2026-08-21).
// The pin was set on the t=630.3s turn ("what's 0.625 as a percent?") and was
// still showing it when the board had moved to "Two thirds" (t=899.5s). The
// lesson cursor did NOT advance between t=213 and t=1152.9, so R47's
// clear-on-segment-change could not fire, and six substantive tutor turns
// went by with the pin unmoved.
const T = (id: string, role: 'tutor' | 'student', historyOnly = false) => ({ id, role, historyOnly });
const LIVE_TRANSCRIPT = [
  T('t630', 'tutor'),          // <- pinned here ("what's 0.625 as a percent?")
  T('s1', 'student'),
  T('t664', 'tutor'),
  T('s2', 'student'),
  T('t700', 'tutor'),
  T('s3', 'student'),
  T('t723', 'tutor'),
  T('s4', 'student'),
  T('t897', 'tutor'),          // "Two thirds" turn — board has moved on
];

check('live stale pin (6 tutor turns behind) is stale', isQpinStaleByTurns(LIVE_TRANSCRIPT, 't630'), true);
check('the newest pin is never stale', isQpinStaleByTurns(LIVE_TRANSCRIPT, 't897'), false);
check(
  'one tutor turn behind is NOT stale (student may still be answering)',
  isQpinStaleByTurns([T('a', 'tutor'), T('b', 'student'), T('c', 'tutor')], 'a'),
  false,
);
check(
  'exactly at the bound is NOT stale',
  isQpinStaleByTurns([T('a', 'tutor'), T('b', 'tutor'), T('c', 'tutor')], 'a', 2),
  false,
);
check(
  'one past the bound IS stale',
  isQpinStaleByTurns([T('a', 'tutor'), T('b', 'tutor'), T('c', 'tutor'), T('d', 'tutor')], 'a', 2),
  true,
);
// R38 must survive: nudges and board-only turns cannot age a pin out. If this
// ever flips, an idle nudge starts killing questions the student is answering
// — the exact regression R38 existed to fix.
check(
  'historyOnly turns do NOT count toward staleness (R38 guarantee)',
  isQpinStaleByTurns(
    [T('a', 'tutor'), T('n1', 'tutor', true), T('n2', 'tutor', true), T('n3', 'tutor', true), T('n4', 'tutor', true)],
    'a',
  ),
  false,
);
check(
  'student turns do NOT count toward staleness',
  isQpinStaleByTurns([T('a', 'tutor'), T('s1', 'student'), T('s2', 'student'), T('s3', 'student')], 'a'),
  false,
);
// Totality: an unknown id must never clear a pin — losing a live question is
// worse than showing a stale one, so the unknown case fails toward keeping it.
check('unknown pin id → not stale', isQpinStaleByTurns(LIVE_TRANSCRIPT, 'nope'), false);
check('null pin id → not stale', isQpinStaleByTurns(LIVE_TRANSCRIPT, null), false);
check('empty transcript → not stale', isQpinStaleByTurns([], 't630'), false);
check('bound is a positive integer', Number.isInteger(QPIN_MAX_TUTOR_TURNS_BEHIND) && QPIN_MAX_TUTOR_TURNS_BEHIND > 0, true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
