/**
 * Historical-timeline layout + collision rule (2026-08-17 triage,
 * portal-35b9a5d8): box x-positions are proportional to year, so 5 events
 * spanning 1781-1788 (two in the same year) MUST collide — the student
 * asked three times to fix the overlap and the brain re-rendered three
 * times with zero effect, because evenSpace was solver-internal and only
 * set for unparseable dates. The solver now auto-flips to even spacing
 * whenever the proportional layout collides.
 */
import {
  layoutTimelineEvents,
  timelineHasCollisions,
  shouldEvenSpaceTimeline,
} from '../src/lib/tutor/diagrams/catalog/kinds/historical-timeline-layout';
import { solveHistoricalTimeline } from '../src/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failures++;
    console.error(`  ✗ ${name}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  } else {
    console.log(`  ✓ ${name}`);
  }
}

const y = (...years: number[]) => years.map((yr) => ({ year: yr }));

// The 35b9a5d8 shape: Articles 1781, Shays 1786, Convention 1787,
// Federalist 1787, Ratification 1788 — 7-year span, two same-year events.
const DENSE = y(1781, 1786, 1787, 1787, 1788);
const SPREAD = y(1700, 1750, 1800, 1850);

console.log('collision detection');
check('dense 1781-1788 collides proportionally (the 35b9a5d8 bug)', timelineHasCollisions(DENSE, false), true);
check('the same dense events do NOT collide even-spaced', timelineHasCollisions(DENSE, true), false);
check('well-spread events do not collide proportionally', timelineHasCollisions(SPREAD, false), false);

console.log('shouldEvenSpaceTimeline');
check('dense span → flip to even spacing', shouldEvenSpaceTimeline(DENSE), true);
check('spread span → keep proportional', shouldEvenSpaceTimeline(SPREAD), false);

console.log('layout invariants');
{
  const boxes = layoutTimelineEvents(DENSE, true);
  check('even layout emits one box per event', boxes.length, DENSE.length);
  const inBounds = boxes.every((b) => b.boxX >= 0 && b.boxX + 156 <= 760 && b.labelY - 26 >= 0 && b.labelY + 26 <= 320);
  check('even layout boxes stay inside the viewBox', inBounds, true);
}
{
  // Degenerate: all events the same year — proportional math has no span.
  const boxes = layoutTimelineEvents(y(1787, 1787), false);
  check('same-year-only events fall back to even spacing (distinct x)', boxes[0].x !== boxes[1].x, true);
}

console.log('solver integration');
{
  const fig = solveHistoricalTimeline({
    events: [
      { date: '1781', label: 'Articles ratified' },
      { date: '1786', label: "Shays' Rebellion" },
      { date: '1787', label: 'Constitutional Convention' },
      { date: '1787', label: 'Federalist Papers begin' },
      { date: '1788', label: 'Constitution ratified' },
    ],
  });
  check('dense dates → solver sets evenSpace', fig.evenSpace, true);
}
{
  const fig = solveHistoricalTimeline({
    events: [
      { date: '1700', label: 'A' },
      { date: '1750', label: 'B' },
      { date: '1800', label: 'C' },
      { date: '1850', label: 'D' },
    ],
  });
  check('spread dates → solver keeps proportional', fig.evenSpace ?? false, false);
}
{
  // Pre-existing behavior preserved: an unparseable date still forces even.
  const fig = solveHistoricalTimeline({
    events: [
      { date: '1900', label: 'A' },
      { date: 'Today', label: 'B' },
    ],
  });
  check('unparseable date still forces evenSpace', fig.evenSpace, true);
}

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll timeline-layout checks passed.');
