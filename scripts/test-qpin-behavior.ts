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

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
