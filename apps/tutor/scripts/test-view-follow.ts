/**
 * View-follow anti-yank grace (Task X5).
 *
 * Regression under test: the tutor revealed a try-yourself ANSWER as a new
 * item on page 3 while the student sat on page 2 — the board never
 * followed. New tutor-rendered content should pull the view to it UNLESS
 * the student interacted with the board (page flip, pen, panel tap) in the
 * last ~10s (anti-yank grace).
 *
 * Run: npx tsx scripts/test-view-follow.ts
 */
import { shouldFollowNewRender, trailingNavSuppressesFollow } from '../src/lib/tutor/whiteboard/view-follow';

let failures = 0;
function check(name: string, actual: boolean, expected: boolean) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name} (expected ${expected}, got ${actual})`);
}

const NOW = 1_000_000;

// The X5 evidence case: student parked on page 2 (never interacted this
// session), a new render lands on page 3 → follow.
check(
  'student on old page, no interaction on record → advances',
  shouldFollowNewRender({ targetIndex: 2, currentIndex: 1, lastInteractionAt: null, now: NOW }),
  true,
);

// Student flipped pages 3s ago (well inside the 10s grace) → hold position.
check(
  'student flipped pages 3s ago, new item elsewhere → stays',
  shouldFollowNewRender({ targetIndex: 2, currentIndex: 1, lastInteractionAt: NOW - 3_000, now: NOW }),
  false,
);

// Student interacted long ago (grace elapsed) → the honest default (follow)
// resumes.
check(
  'student interacted 11s ago (grace elapsed) → advances',
  shouldFollowNewRender({ targetIndex: 2, currentIndex: 1, lastInteractionAt: NOW - 11_000, now: NOW }),
  true,
);

// Exact boundary: grace window is a HALF-open [0, graceMs) hold — at
// exactly graceMs the interaction no longer counts as "recent".
check(
  'interaction exactly at the grace boundary (10s) → advances',
  shouldFollowNewRender({ targetIndex: 2, currentIndex: 1, lastInteractionAt: NOW - 10_000, now: NOW }),
  true,
);
check(
  'interaction 1ms inside the grace boundary → stays',
  shouldFollowNewRender({ targetIndex: 2, currentIndex: 1, lastInteractionAt: NOW - 9_999, now: NOW }),
  false,
);

// Already on the target page — no-op regardless of interaction recency.
check(
  'new render lands on the CURRENT page → no-op (already there)',
  shouldFollowNewRender({ targetIndex: 1, currentIndex: 1, lastInteractionAt: NOW - 500, now: NOW }),
  false,
);

// Custom grace window (e.g. a caller wanting a tighter/looser policy).
check(
  'custom graceMs respected',
  shouldFollowNewRender({ targetIndex: 2, currentIndex: 1, lastInteractionAt: NOW - 2_000, now: NOW, graceMs: 1_000 }),
  true,
);

// --- Round-28 (live 2026-07-18, session portal-f31017f0): caught-up viewer
// exemption. The student was ON the then-newest page when the tutor's
// DEFERRED auto-newPage flushed a brand-new page — but a page flip inside
// the 10s grace held the view, leaving only the badge. A viewer sitting on
// the newest page hasn't "flipped back to re-read" anything; for a NEW
// page beyond them, only a short mid-stroke guard (3s default) applies. ---

check(
  'caught-up viewer, flipped to live page 5s ago, NEW page appears → follows',
  shouldFollowNewRender({ targetIndex: 3, currentIndex: 2, lastInteractionAt: NOW - 5_000, now: NOW, onLatestPage: true }),
  true,
);
check(
  'caught-up viewer but mid-stroke 1s ago → still held (short guard)',
  shouldFollowNewRender({ targetIndex: 3, currentIndex: 2, lastInteractionAt: NOW - 1_000, now: NOW, onLatestPage: true }),
  false,
);
check(
  'viewer flipped BACK (not on newest page), 5s ago → held (unchanged policy)',
  shouldFollowNewRender({ targetIndex: 3, currentIndex: 1, lastInteractionAt: NOW - 5_000, now: NOW, onLatestPage: false }),
  false,
);
check(
  'caught-up flag with a BACKWARD target → full grace still applies',
  shouldFollowNewRender({ targetIndex: 1, currentIndex: 2, lastInteractionAt: NOW - 5_000, now: NOW, onLatestPage: true }),
  false,
);
check(
  'caught-up custom short guard respected',
  shouldFollowNewRender({ targetIndex: 3, currentIndex: 2, lastInteractionAt: NOW - 2_000, now: NOW, onLatestPage: true, caughtUpGraceMs: 1_000 }),
  true,
);

// --- trailingNavSuppressesFollow: the order-only "does the batch's trailing
// nav win over the newest render" call, lifted out of WhiteboardCanvas's
// view-follow effect (Task X5 fix-wave, Finding 1). ---

// A batch containing ONLY a fresh render (no nav at all in THIS slice) must
// never be suppressed — this is the wiring-level guarantee that closes the
// cross-turn incident shape: as long as the caller correctly scopes
// `addedActions` to commands added since its own last-processed watermark
// (never the full history), a stale nav from an earlier, already-processed
// turn cannot appear here to silently pin a later turn's brand-new reveal.
check(
  'batch with only a new render, no nav in this slice → does not suppress',
  trailingNavSuppressesFollow(['render']),
  false,
);

// goToPage/scrollTo BEFORE the render in the same batch — the render is the
// batch's final visual intent → follow it (2026-06-19 Img13 shape, and the
// straightforward turn-order case the original design targeted).
check(
  'nav precedes render in the batch → does not suppress (render wins)',
  trailingNavSuppressesFollow(['goToPage', 'render']),
  false,
);

// render THEN a trailing nav — the nav is the batch's final visual intent,
// and the scrollTo/goToPage-handling effect already positioned the view
// there → suppress (legitimate same-batch case the X5 order-check exists
// for).
check(
  'render precedes a trailing nav in the batch → suppresses (nav wins)',
  trailingNavSuppressesFollow(['render', 'goToPage']),
  true,
);

// The exact regression shape from the 2026-07-08 portal-9549e3af session:
// scrollTo(earlier figure) … scribble (meta, ignored) … NEW render. The
// render is what the turn ends on → follow it.
check(
  'scrollTo(earlier figure) … scribble … NEW render → does not suppress',
  trailingNavSuppressesFollow(['scrollTo', 'scribble', 'render']),
  false,
);

// A nav with nothing to follow at all (no render in the slice) — suppression
// is moot but the function should still report the order honestly.
check(
  'nav-only batch, no render present → reports suppress (nothing to follow anyway)',
  trailingNavSuppressesFollow(['goToPage']),
  true,
);

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll view-follow checks passed.');
