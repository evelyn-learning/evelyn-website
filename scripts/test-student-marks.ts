/**
 * Unit tests for student-marks resolution + formatting (Phase 1: points).
 * Run: npm run test:student-marks
 * Design: docs/superpowers/specs/2026-07-05-student-whiteboard-marks-design.md
 */
import {
  resolvePointMark,
  formatStudentMarks,
  MAX_PENDING_MARKS,
  type CapturedRect,
  type StudentMarkEvent,
  type ResolvedMark,
} from '../src/lib/tutor/whiteboard/student-marks';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const item1: CapturedRect = { x: 0.1, y: 0.1, w: 0.8, h: 0.4, itemIndex: 1, itemId: 'showTable-1' };
const cell: CapturedRect = { x: 0.4, y: 0.2, w: 0.2, h: 0.05, itemIndex: 1, itemId: 'showTable-1', feature: 'cell-r2-c3' };
const row: CapturedRect = { x: 0.1, y: 0.2, w: 0.8, h: 0.05, itemIndex: 1, itemId: 'showTable-1', feature: 'row-2' };
const item2: CapturedRect = { x: 0.1, y: 0.6, w: 0.8, h: 0.3, itemIndex: 2, itemId: 'showEquation-1' };

function ev(x: number, y: number, rects: CapturedRect[]): StudentMarkEvent {
  return { type: 'point', pageIndex: 1, pageTitle: 'Practice', point: { x, y }, rects };
}

// ── resolution ────────────────────────────────────────────────────
{
  const r = resolvePointMark(ev(0.45, 0.22, [item1, row, cell, item2]));
  check('smallest containing feature wins (cell over row)', r.feature === 'cell-r2-c3' && r.itemIndex === 1);
}
{
  const r = resolvePointMark(ev(0.15, 0.22, [item1, row, cell, item2]));
  check('point in row but not cell resolves to row', r.feature === 'row-2');
}
{
  // (0.62, 0.27) is OUTSIDE every feature rect (row/cell end at y=0.25) but
  // only 0.02 below the row's bottom edge — a true tier-2 snap. It IS inside
  // item1's wrapper rect, which proves tier 2 (nearest feature) is checked
  // BEFORE tier 3 (containing item).
  const r = resolvePointMark(ev(0.62, 0.27, [item1, row, cell]));
  check('near-miss within threshold snaps to nearest feature (beats containing item)', r.feature === 'row-2');
}
{
  // (0.62, 0.30) is 0.05 below the row — beyond the 0.03 threshold — and
  // inside item1: falls through to the whole-item tier.
  const r = resolvePointMark(ev(0.62, 0.3, [item1, row, cell]));
  check('beyond threshold falls through to containing item', r.itemIndex === 1 && r.feature === undefined);
}
{
  const r = resolvePointMark(ev(0.5, 0.45, [item1, row, cell, item2]));
  check('point in item but no feature → whole item', r.itemIndex === 1 && r.feature === undefined);
}
{
  const r = resolvePointMark(ev(0.95, 0.95, [item1, row, cell, item2]));
  check('point outside everything → page-only', r.itemIndex === undefined && r.feature === undefined);
  check('page metadata carried', r.pageIndex === 1 && r.pageTitle === 'Practice');
}
{
  const r = resolvePointMark(ev(0.5, 0.7, [item1, item2]));
  check('second item resolves by containment', r.itemIndex === 2 && r.itemId === 'showEquation-1');
}

// ── formatting ────────────────────────────────────────────────────
const mk = (over: Partial<ResolvedMark>): ResolvedMark => ({
  kind: 'point', pageIndex: 0, point: { x: 0.5, y: 0.5 }, ...over,
});
{
  const text = formatStudentMarks(
    [mk({ itemIndex: 1, itemId: 'showTable-1', feature: 'row-2', pageTitle: 'States' })],
    () => ({ featureLabel: 'the "Compressibility" row', itemLabel: 'the comparison table' }),
  );
  check('feature wording', text === 'The student pointed at the "Compressibility" row of the comparison table (page 1, "States").');
}
{
  const text = formatStudentMarks(
    [mk({ itemIndex: 2, itemId: 'showEquation-1' })],
    () => ({ itemLabel: 'the equation' }),
  );
  check('whole-item wording', text === 'The student pointed at the equation (page 1).');
}
{
  const text = formatStudentMarks([mk({})], () => null);
  check('page-only wording', text === 'The student pointed at empty space on page 1.');
}
{
  const text = formatStudentMarks(
    [mk({ itemIndex: 3, itemId: 'gone-1', feature: 'step-2' })],
    () => null,
  );
  check('stale lookup degrades to page wording', text === 'The student pointed at something on page 1.');
}
{
  const a = mk({ itemIndex: 1, feature: 'row-2' });
  const text = formatStudentMarks([a, { ...a }, mk({ itemIndex: 2 })], (m) =>
    m.itemIndex === 1 ? { featureLabel: 'the second row', itemLabel: 'the table' } : { itemLabel: 'the graph' },
  );
  check('consecutive duplicate marks collapse to one line', text.split('\n').length === 2);
  check('distinct marks keep their own lines', text.includes('the graph'));
}
{
  check('MAX_PENDING_MARKS is 12', MAX_PENDING_MARKS === 12);
}

console.log(`\nstudent-marks: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
