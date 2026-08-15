/**
 * Dedup-skip → scroll-to-existing decision.
 *
 * Regression under test (session-1783693044096, 2026-07-10): the brain
 * called show_diagram(photosynthesis) to bring back the figure it was
 * narrating. That figure was already on the board — two pages back — so
 * the dedup filter dropped the command and NOTHING happened. The student
 * heard a full description of a diagram they could not see.
 *
 * When a deduped re-show targets an item on a DIFFERENT page than the one
 * the student is looking at, scroll there. When it's already the current
 * page, do nothing — yanking the view on every duplicate would be worse
 * than the bug.
 *
 * Run: npx tsx scripts/test-dedup-scroll.ts
 */
import { shouldScrollToDedupedItem } from '../apps/marketing/src/lib/tutor/whiteboard/dedup-scroll';

let failures = 0;
function check(name: string, actual: boolean, expected: boolean) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name} (expected ${expected}, got ${actual})`);
}

// The production case: figure lives on page "Next", student is on the Calvin page.
check(
  'existing item on another page → scroll to it',
  shouldScrollToDedupedItem({ itemPageTitle: 'Next', currentPageTitle: 'Concept: Calvin cycle' }),
  true,
);

check(
  'existing item on the current page → do not yank the view',
  shouldScrollToDedupedItem({ itemPageTitle: 'Concept: Calvin cycle', currentPageTitle: 'Concept: Calvin cycle' }),
  false,
);

// Unknowable page → never scroll (fail safe to today's silent-drop behaviour).
check(
  'item has no page (pre-newPage render) → no scroll',
  shouldScrollToDedupedItem({ itemPageTitle: undefined, currentPageTitle: 'Concept: Calvin cycle' }),
  false,
);
check(
  'no current page yet → no scroll',
  shouldScrollToDedupedItem({ itemPageTitle: 'Next', currentPageTitle: '' }),
  false,
);

// Titles are compared as the catalog stores them; whitespace/case drift on the
// same page must not read as "a different page" and trigger a pointless scroll.
check(
  'same page with case/whitespace drift → no scroll',
  shouldScrollToDedupedItem({ itemPageTitle: '  next ', currentPageTitle: 'Next' }),
  false,
);

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll dedup-scroll checks passed.');
