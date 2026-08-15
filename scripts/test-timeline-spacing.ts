/**
 * Regression test for the historical_timeline spacing fix.
 * Bug: "Today" parsed to year 0 → sorted to front → real events squished/overlapping.
 *   npm run test:timeline
 */
import assert from 'node:assert';
import { solveHistoricalTimeline } from '../apps/marketing/src/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';

let passed = 0;
function check(label: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${label}`); }
  catch (e) { console.error(`  ✗ ${label}\n    ${e instanceof Error ? e.message : e}`); process.exitCode = 1; }
}

console.log('historical_timeline spacing');
check('mixed/imprecise dates → evenSpace + author (chronological) order preserved', () => {
  const f = solveHistoricalTimeline({ title: 'x', events: [
    { date: '1958', label: 'a' }, { date: '1960s', label: 'b' }, { date: '1970s', label: 'c' }, { date: 'Today', label: 'd' },
  ] });
  assert.equal(f.evenSpace, true);
  assert.deepEqual(f.events.map((e) => e.date), ['1958', '1960s', '1970s', 'Today']); // NOT reordered; "Today" stays last
});
check('all-numeric dates → sorted ascending, proportional (no evenSpace)', () => {
  const f = solveHistoricalTimeline({ events: [
    { date: '1776', label: 'a' }, { date: '1492', label: 'b' }, { date: '1865', label: 'c' },
  ] });
  assert.ok(!f.evenSpace);
  assert.deepEqual(f.events.map((e) => e.year), [1492, 1776, 1865]);
});
check('"10 Jul 1776" parses year 1776, not 10', () => {
  const f = solveHistoricalTimeline({ events: [
    { date: '10 Jul 1776', label: 'a' }, { date: '1800', label: 'b' },
  ] });
  assert.equal(f.events.find((e) => e.date === '10 Jul 1776')?.year, 1776);
});

console.log(`\n${passed} checks passed`);
