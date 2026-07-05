/**
 * Unit tests for student-marks resolution + formatting (Phase 1: points).
 * Run: npm run test:student-marks
 * Design: docs/superpowers/specs/2026-07-05-student-whiteboard-marks-design.md
 */
import {
  resolvePointMark,
  classifyStroke,
  resolveStudentMark,
  formatStudentMarks,
  MAX_PENDING_MARKS,
  type CapturedRect,
  type PointMarkEvent,
  type StudentMarkEvent,
  type StrokeMarkEvent,
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

function ev(x: number, y: number, rects: CapturedRect[]): PointMarkEvent {
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

// ── Phase 2: stroke classification ─────────────────────────────────
function stroke(polyline: { x: number; y: number }[], rects: CapturedRect[]): StrokeMarkEvent {
  return { type: 'stroke', pageIndex: 1, pageTitle: 'Practice', polyline, rects };
}
function loopAround(cx: number, cy: number, r: number, n = 16): { x: number; y: number }[] {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * 2 * Math.PI;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * 0.6 * Math.sin(a) });
  }
  return pts;
}

// circle around the cell (cell center 0.5, 0.225)
{
  const m = classifyStroke(stroke(loopAround(0.5, 0.225, 0.13), [item1, row, cell, item2]));
  check('closed loop around a feature → circle on that feature', m.kind === 'circle' && m.feature === 'cell-r2-c3');
}
// closed loop enclosing nothing (empty corner)
{
  const m = classifyStroke(stroke(loopAround(0.93, 0.93, 0.04), [item1, row, cell, item2]));
  check('closed loop over empty space → circle, page-only', m.kind === 'circle' && m.itemIndex === undefined);
}
// underline: flat stroke just under the cell (cell bottom = 0.25)
{
  const pts = Array.from({ length: 10 }, (_, i) => ({ x: 0.41 + i * 0.019, y: 0.262 + (i % 2) * 0.004 }));
  const m = classifyStroke(stroke(pts, [item1, row, cell, item2]));
  check('flat stroke under a feature → underline on it', m.kind === 'underline' && (m.feature === 'cell-r2-c3' || m.feature === 'row-2'));
}
// cross-out: zigzag back and forth across the cell
{
  const pts = [
    { x: 0.42, y: 0.21 }, { x: 0.58, y: 0.24 }, { x: 0.43, y: 0.22 },
    { x: 0.57, y: 0.21 }, { x: 0.44, y: 0.24 }, { x: 0.58, y: 0.22 },
  ];
  const m = classifyStroke(stroke(pts, [item1, row, cell, item2]));
  check('zigzag over a feature → cross-out', m.kind === 'cross-out' && m.feature === 'cell-r2-c3');
}
// arrow: straight line from the cell down into item2
{
  const pts = Array.from({ length: 8 }, (_, i) => ({ x: 0.5 + i * 0.01, y: 0.22 + i * 0.07 }));
  const m = classifyStroke(stroke(pts, [item1, row, cell, item2]));
  check('directional line feature→item → arrow with both ends', m.kind === 'arrow' && m.fromFeature === 'cell-r2-c3' && m.itemIndex === 2);
}
// open squiggle in empty space → ink, page-only
{
  const pts = [{ x: 0.91, y: 0.9 }, { x: 0.94, y: 0.93 }, { x: 0.92, y: 0.96 }];
  const m = classifyStroke(stroke(pts, [item1, row, cell, item2]));
  check('unresolved squiggle → ink, page-only', m.kind === 'ink' && m.itemIndex === undefined);
}
// dispatcher routes both event types
{
  const p = resolveStudentMark(ev(0.45, 0.22, [item1, row, cell]));
  const s = resolveStudentMark(stroke(loopAround(0.5, 0.225, 0.13), [item1, row, cell]));
  check('resolveStudentMark dispatches point and stroke', p.kind === 'point' && s.kind === 'circle');
}

// ── Phase 2: formatter wordings ────────────────────────────────────
{
  const text = formatStudentMarks(
    [{ kind: 'circle', pageIndex: 0, point: { x: 0.5, y: 0.2 }, itemIndex: 1, itemId: 'showTable-1', feature: 'row-2' }],
    () => ({ featureLabel: 'the second row', itemLabel: 'the table' }),
  );
  check('circle wording', text === 'The student circled the second row of the table (page 1).');
}
{
  const text = formatStudentMarks(
    [{ kind: 'cross-out', pageIndex: 0, point: { x: 0.5, y: 0.2 }, itemIndex: 1, feature: 'step-2' }],
    () => ({ featureLabel: 'step 2', itemLabel: 'the solution' }),
  );
  check('cross-out wording', text === 'The student crossed out step 2 of the solution (page 1).');
}
{
  const text = formatStudentMarks(
    [{ kind: 'arrow', pageIndex: 0, point: { x: 0.5, y: 0.4 }, itemIndex: 2, itemId: 'showEquation-1', fromItemIndex: 1, fromItemId: 'showTable-1', fromFeature: 'row-2' }],
    (m) => (m.itemIndex === 2 ? { itemLabel: 'the equation' } : { featureLabel: 'the second row', itemLabel: 'the table' }),
  );
  check('arrow wording names both ends', text === 'The student drew an arrow from the second row of the table to the equation (page 1).');
}
{
  const text = formatStudentMarks(
    [{ kind: 'ink', pageIndex: 2, point: { x: 0.9, y: 0.9 } }],
    () => null,
  );
  check('unresolved ink wording', text === 'The student drew something on page 3.');
}

console.log(`\nstudent-marks: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
