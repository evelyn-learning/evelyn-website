/**
 * Unit suite for the SmoothDraw Phase-1 pure planner.
 * Run: npm run test:draw-on
 * Spec: docs/superpowers/specs/2026-07-10-smoothdraw-draw-on-board-design.md
 */
import {
  planSvgDrawOn,
  planHtmlWipe,
  IFRAME_FADE_MS,
  SERIAL_SPACING_MS,
  STROKE_BATCH,
  type Drawable,
} from '../apps/marketing/src/lib/tutor/whiteboard/draw-on';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const strokes = (n: number): Drawable[] =>
  Array.from({ length: n }, () => ({ kind: 'stroke' as const, length: 100 }));

// ── budget clamp ──────────────────────────────────────────────
{
  check('1 stroke → floor budget 800ms', planSvgDrawOn(strokes(1)).totalMs === 800);
  check('12 strokes → 12×80 = 960ms', planSvgDrawOn(strokes(12)).totalMs === 960);
  check('40 strokes → ceiling 1500ms', planSvgDrawOn(strokes(40)).totalMs === 1500);
  check('200 strokes → still ceiling 1500ms', planSvgDrawOn(strokes(200)).totalMs === 1500);
}

// ── stagger shape ─────────────────────────────────────────────
{
  const plan = planSvgDrawOn(strokes(5));
  check('one step per drawable', plan.steps.length === 5);
  check('first step starts at 0', plan.steps[0].delayMs === 0);
  const starts = plan.steps.map((s) => s.delayMs);
  check('starts are non-decreasing', starts.every((v, i) => i === 0 || v >= starts[i - 1]));
  const last = plan.steps[plan.steps.length - 1];
  check('last step ends at totalMs', last.delayMs + last.durMs === plan.totalMs);
  const overlaps = plan.steps.slice(1).map((s, i) => plan.steps[i].delayMs + plan.steps[i].durMs - s.delayMs);
  check('consecutive strokes overlap (continuous drawing)', overlaps.every((o) => o > 0));
}

// ── fills fade after their preceding stroke group ─────────────
{
  const mixed: Drawable[] = [
    { kind: 'stroke', length: 50 }, { kind: 'fill' },
    { kind: 'stroke', length: 50 }, { kind: 'fill' },
  ];
  const plan = planSvgDrawOn(mixed);
  check('fill steps use fade mode', plan.steps[1].mode === 'fade' && plan.steps[3].mode === 'fade');
  const s0 = plan.steps[0], f1 = plan.steps[1];
  check('fill starts when its preceding stroke completes', f1.delayMs >= s0.delayMs + s0.durMs - 1);
}

// ── batching above STROKE_BATCH ───────────────────────────────
{
  const plan = planSvgDrawOn(strokes(120));
  const uniqueStarts = new Set(plan.steps.filter((s) => s.mode === 'stroke').map((s) => s.delayMs));
  check(`>${STROKE_BATCH} strokes batch into shared slots`, uniqueStarts.size <= STROKE_BATCH);
  check('batched plan still fits ceiling', plan.totalMs === 1500);
}

// ── trailing fill never overshoots totalMs (queue-spacing contract) ──
{
  const trailing = planSvgDrawOn([
    { kind: 'stroke', length: 50 }, { kind: 'stroke', length: 50 }, { kind: 'fill' },
  ]);
  const maxEnd = Math.max(...trailing.steps.map((s) => s.delayMs + s.durMs));
  check('totalMs covers the trailing fill exactly', trailing.totalMs === maxEnd);
  check('trailing-fill totalMs = budget + fade', trailing.totalMs === 800 + 250);
}

// ── degenerate inputs ─────────────────────────────────────────
{
  check('zero drawables → empty plan, 0ms', planSvgDrawOn([]).totalMs === 0 && planSvgDrawOn([]).steps.length === 0);
  const fillsOnly = planSvgDrawOn([{ kind: 'fill' }, { kind: 'fill' }]);
  check('fills-only item fades within floor budget', fillsOnly.totalMs === 800 && fillsOnly.steps.every((s) => s.mode === 'fade'));
}

// ── HTML wipe ─────────────────────────────────────────────────
{
  const one = planHtmlWipe(1);
  check('single-region wipe uses floor budget', one.totalMs === 800 && one.steps.length === 1);
  const rows = planHtmlWipe(6);
  check('6 rows → 6 steps, staggered, ends at totalMs',
    rows.steps.length === 6
    && rows.steps[0].delayMs === 0
    && rows.steps[5].delayMs + rows.steps[5].durMs === rows.totalMs);
  check('row wipes budget scales with rows, capped', planHtmlWipe(30).totalMs === 1500);
}

// ── wipe rows keep a legible minimum duration ─────────────────
{
  const many = planHtmlWipe(30);
  check('30-row wipe: every row ≥120ms', many.steps.every((s) => s.durMs >= 120));
  check('30-row wipe still ends at totalMs', many.steps[29].delayMs + many.steps[29].durMs === many.totalMs);
}

// ── constants ─────────────────────────────────────────────────
{
  check('iframe fade is 300ms', IFRAME_FADE_MS === 300);
  check('serial spacing is 300ms', SERIAL_SPACING_MS === 300);
}

// ── Task 3.3 (humanlike-latency): audio-paced budget (targetMs) ──────────
{
  check('targetMs replaces the stroke budget (5 strokes, 2.5s of audio → 2500ms)',
    planSvgDrawOn(strokes(5), { targetMs: 2500 }).totalMs === 2500);
  check('targetMs clamps low → 600ms floor',
    planSvgDrawOn(strokes(5), { targetMs: 300 }).totalMs === 600);
  check('targetMs clamps high → 4000ms ceiling',
    planSvgDrawOn(strokes(5), { targetMs: 9000 }).totalMs === 4000);
  check('omitted targetMs → unchanged default budget',
    planSvgDrawOn(strokes(12)).totalMs === 960);
  check('non-finite/zero targetMs ignored → default budget',
    planSvgDrawOn(strokes(12), { targetMs: 0 }).totalMs === 960
    && planSvgDrawOn(strokes(12), { targetMs: Number.NaN }).totalMs === 960);
  const paced = planSvgDrawOn(strokes(5), { targetMs: 2500 });
  const pacedLast = paced.steps[paced.steps.length - 1];
  check('paced plan still ends exactly at totalMs', pacedLast.delayMs + pacedLast.durMs === paced.totalMs);
  const pacedStarts = paced.steps.map((s) => s.delayMs);
  check('paced starts remain non-decreasing', pacedStarts.every((v, i) => i === 0 || v >= pacedStarts[i - 1]));
  const pacedTrailing = planSvgDrawOn(
    [{ kind: 'stroke', length: 50 }, { kind: 'fill' }],
    { targetMs: 2000 },
  );
  const pacedMaxEnd = Math.max(...pacedTrailing.steps.map((s) => s.delayMs + s.durMs));
  check('paced trailing fill: totalMs still covers the true end', pacedTrailing.totalMs === pacedMaxEnd);
  check('HTML wipe honors targetMs with the same clamp',
    planHtmlWipe(6, { targetMs: 2500 }).totalMs === 2500
    && planHtmlWipe(6, { targetMs: 300 }).totalMs === 600
    && planHtmlWipe(6, { targetMs: 9000 }).totalMs === 4000);
  check('HTML wipe without targetMs unchanged', planHtmlWipe(6).totalMs === Math.max(800, Math.min(1500, 6 * 200)));
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
