/**
 * Drawn practice items (contract v1.22.0) — the shared core of the T4 item
 * work: turn an authored item (t4-drawn-items/kit.ts) into the stored
 * ProblemBank row, serve it through the ENGINE's serve path
 * (drawn-items.ts `servableDrawn`: SVG + frame drawn now from the spec), and
 * PROVE it:
 *   - the key grades correct under the contract's `gradeDrawn`, on the spec
 *     as served;
 *   - the key follows from the problem (kit.ts: calc / on / holds);
 *   - every key value is reachable: a multiple of the snap step, on a drawn
 *     gridline / tick, inside the frame with room to spare; the snap step IS
 *     the finest gridline / tick spacing, so a snapped mark always lands on
 *     a line the student can see;
 *   - the writer's likely wrong answers and the near misses made here (one
 *     snap step off, coordinates swapped, an end flipped open / closed, a ray
 *     turned round …) all grade WRONG;
 *   - for a line, other pairs of points on it grade CORRECT.
 * Used by author-t4-drawn-items.ts (writes the rows) and by
 * scripts/test-practice-drawn-t4-items.ts (the committed proof).
 *
 * No database, no network, no model.
 */
import { DrawnSpecSchema, gradeDrawn, type DrawnSpec } from '@evelyn/portal-contract/v1';
import { drawnRowFields, servableDrawn, type ServableDrawn, type StoredDrawn, type StoredDrawnFigure } from '../../src/lib/tutor/portal/drawn-items';
import { checkFigureLegibility } from '../../src/lib/tutor/practice-figure/legibility';
import { validateFigureSvg } from '../../src/lib/tutor/practice-figure/svg-safety';
import { itemIdOf } from './core';
import type { DrawnItem, GridParams, Interval, LineParams, Pt } from './t4-drawn-items/kit';

export const EPS = 1e-9;
const MINUS = '−';
/** Plain number text with a true minus sign. */
export function fmt(v: number): string {
  const r = Math.round(v * 1e9) / 1e9;
  return (r < 0 ? MINUS : '') + String(Math.abs(r));
}

export const SOURCE_NAME = 'Evelyn (practice-extend offline job, drawn-answer track — hand-authored T4 drawn items, GreenApple 29-Oct release)';
export const VERIFIER = 'none — key proven in code (gradeDrawn on the served spec, truth check from the givens, near misses) + independent read';

export interface BuiltDrawn {
  id: string;
  item: DrawnItem;
  /** The DrawnSpec kind. */
  kind: DrawnSpec['kind'];
  stored: { drawn: StoredDrawn; figure: StoredDrawnFigure };
  served: ServableDrawn | null;
  /** The key as a student answer. */
  keyAnswer: unknown;
  /** Answers that must grade correct (key, reordered key, other pairs on the line). */
  mustPass: Array<{ why: string; answer: unknown }>;
  /** Answers that must grade wrong (writer misses + generated near misses). */
  mustFail: Array<{ why: string; answer: unknown }>;
  /** How the key was proven, and what came out. */
  proof: { how: string; result: string };
  problems: string[];
}

const isMultiple = (v: number, step: number) => Math.abs(v / step - Math.round(v / step)) < 1e-7;
/** Values read back from SVG coordinates (printed to 0.01 px) — merged within `tol` of each other. */
function uniqSorted(xs: number[], tol: number): number[] {
  const out: number[] = [];
  for (const v of [...xs].sort((a, b) => a - b)) if (!out.length || v - out[out.length - 1] > tol) out.push(v);
  return out;
}
const samePt = (a: Pt, b: Pt) => Math.abs(a[0] - b[0]) < 1e-7 && Math.abs(a[1] - b[1]) < 1e-7;

export function gridAlt(g: GridParams): string {
  const xl = g.xLabel ?? 'x';
  const yl = g.yLabel ?? 'y';
  const same = g.xRange[0] === g.yRange[0] && g.xRange[1] === g.yRange[1] && xl === 'x' && yl === 'y';
  return same
    ? `A blank coordinate grid; x and y each run from ${fmt(g.xRange[0])} to ${fmt(g.xRange[1])}.`
    : `A blank coordinate grid; ${xl} runs from ${fmt(g.xRange[0])} to ${fmt(g.xRange[1])} across and ${yl} from ${fmt(g.yRange[0])} to ${fmt(g.yRange[1])} up.`;
}

export function lineAlt(l: LineParams): string {
  const step = l.minorStep ?? l.step ?? 1;
  const marked = step === 1 ? 'marked in ones' : `marked every ${fmt(step)}`;
  const numbered = l.minorStep && l.step && l.step !== l.minorStep ? `, numbered every ${fmt(l.step)}` : '';
  return `A number line from ${fmt(l.min)} to ${fmt(l.max)}, ${marked}${numbered}.`;
}

/** Data values of the gridlines drawn on a coordinate-grid SVG (from its paths), by axis. */
function gridlineValues(svg: string, frame: { plot: { x: number; y: number; w: number; h: number }; xRange: [number, number]; yRange: [number, number] }): { xs: number[]; ys: number[] } {
  const xs: number[] = [];
  const ys: number[] = [];
  const { plot, xRange, yRange } = frame;
  for (const m of svg.matchAll(/M(-?[\d.]+),(-?[\d.]+)([HV])/g)) {
    const sx = Number(m[1]);
    const sy = Number(m[2]);
    if (m[3] === 'V') xs.push(xRange[0] + ((sx - plot.x) / plot.w) * (xRange[1] - xRange[0]));
    else ys.push(yRange[0] + ((plot.y + plot.h - sy) / plot.h) * (yRange[1] - yRange[0]));
  }
  return { xs: uniqSorted(xs, (xRange[1] - xRange[0]) * 1e-3), ys: uniqSorted(ys, (yRange[1] - yRange[0]) * 1e-3) };
}

/** Data values of the ticks drawn on a number-line SVG. */
function tickValues(svg: string, frame: { x0: number; x1: number; min: number; max: number }): number[] {
  const vs: number[] = [];
  for (const m of svg.matchAll(/<line x1="(-?[\d.]+)" y1="(-?[\d.]+)" x2="(-?[\d.]+)" y2="(-?[\d.]+)"/g)) {
    if (m[1] !== m[3]) continue;
    vs.push(frame.min + ((Number(m[1]) - frame.x0) / (frame.x1 - frame.x0)) * (frame.max - frame.min));
  }
  return uniqSorted(vs, (frame.max - frame.min) * 1e-3);
}

const onLines = (v: number, lines: number[], tol: number) => lines.some((l) => Math.abs(l - v) < tol);
function minGap(vs: number[]): number {
  let g = Infinity;
  for (let i = 1; i < vs.length; i++) g = Math.min(g, vs[i] - vs[i - 1]);
  return g;
}

export function inInterval(iv: Interval, x: number): boolean {
  const left = iv.from === null || x > iv.from + EPS || (Math.abs(x - iv.from) <= EPS && !iv.fromOpen);
  const right = iv.to === null || x < iv.to - EPS || (Math.abs(x - iv.to) <= EPS && !iv.toOpen);
  return left && right;
}

export function intervalText(iv: Interval): string {
  const l = iv.from === null ? '(−∞' : `${iv.fromOpen ? '(' : '['}${fmt(iv.from)}`;
  const r = iv.to === null ? '∞)' : `${fmt(iv.to)}${iv.toOpen ? ')' : ']'}`;
  return `${l}, ${r}`;
}

const LATEX = /\\[a-zA-Z]|\$/;

/** Text rules every item keeps (the problems found, or none). */
function textProblems(it: DrawnItem): string[] {
  const p: string[] = [];
  const all = [it.q, it.a, it.s, ...it.h];
  if (all.some((x) => LATEX.test(x))) p.push('LaTeX or $ in the text');
  if (all.some((x) => /(^|[\s(=,\[])-\s?\d/.test(x) || /[\w)]\s-\s[\w(]/.test(x))) p.push('a hyphen used as a minus sign (use −)');
  if (it.h.length !== 2 || it.h.some((h) => h.trim().length < 15)) p.push('needs two real hints');
  if (it.s.trim().length < 60) p.push('the solution is too short');
  if (it.q.length > 420) p.push(`the stem is ${it.q.length} characters (420 at most)`);
  if (!/\b(plot|graph|mark|show|place|draw)\b/i.test(it.q)) p.push('the stem does not say what to plot / graph / mark / show');
  if (it.kind === 'interval' && !/number line/i.test(it.q)) p.push('the stem does not say "number line"');
  if (it.kind !== 'interval' && !/\b(grid|coordinate plane|plane)\b/i.test(it.q)) p.push('the stem does not say "grid" or "coordinate plane"');
  const ansCanon = it.a.replace(/\s+/g, '').toLowerCase();
  if (ansCanon.length > 3 && it.h.some((h) => h.replace(/\s+/g, '').toLowerCase().includes(ansCanon))) p.push('a hint contains the answer');
  if (![1, 2, 3].includes(it.d)) p.push('difficulty must be 1, 2 or 3');
  if (!it.t || !/^[a-z0-9-]+$/.test(it.t)) p.push('task kind t must be kebab-case');
  if (!it.sub || it.sub.length < 6) p.push('subtopic missing');
  return p;
}

/**
 * Build, serve and prove one authored drawn item. Never throws: everything
 * wrong is in `problems`.
 */
export function buildDrawnItem(it: DrawnItem): BuiltDrawn {
  const problems: string[] = textProblems(it);
  const id = itemIdOf(it.lo, it.q);
  const mustPass: BuiltDrawn['mustPass'] = [];
  const mustFail: BuiltDrawn['mustFail'] = [];
  let proof = { how: '', result: '' };
  let stored: BuiltDrawn['stored'];
  let keyAnswer: unknown;
  let kind: DrawnSpec['kind'];

  if (it.kind === 'interval') {
    kind = 'number-line-interval';
    if (it.line.step === undefined) problems.push('give the number line a step');
    const snap = it.snap ?? it.line.minorStep ?? it.line.step ?? 1;
    const params: Record<string, unknown> = { min: it.line.min, max: it.line.max, ...(it.line.step !== undefined ? { step: it.line.step } : {}), ...(it.line.minorStep !== undefined ? { minorStep: it.line.minorStep } : {}) };
    stored = {
      drawn: { kind, snap, tolerance: snap / 4, key: { ...it.key, fromOpen: it.key.from === null ? false : it.key.fromOpen, toOpen: it.key.to === null ? false : it.key.toOpen } } as StoredDrawn,
      figure: { alt: lineAlt(it.line), spec: { type: 'number_line', params } },
    };
    keyAnswer = { kind, ...it.key };
  } else {
    kind = it.kind === 'points' ? 'grid-points' : 'grid-line';
    const snap = it.snap ?? { x: 1, y: 1 };
    const g = it.grid;
    const params: Record<string, unknown> = { xRange: g.xRange, yRange: g.yRange };
    for (const k of ['xStep', 'yStep', 'xLabel', 'yLabel'] as const) if (g[k] !== undefined) params[k] = g[k];
    const key = it.kind === 'points' ? { points: it.key } : { through: it.key };
    stored = {
      drawn: { kind, snap, tolerance: { x: snap.x / 4, y: snap.y / 4 }, key } as StoredDrawn,
      figure: { alt: gridAlt(g), spec: { type: 'coordinate_grid', params } },
    };
    keyAnswer = { kind, points: it.key };
  }

  // ── the stored row must be servable, and serve through the engine's path ──
  try {
    drawnRowFields(stored.drawn, stored.figure);
  } catch (e) {
    problems.push(`not servable: ${(e as Error).message}`);
  }
  const warn = console.warn;
  console.warn = () => {};
  let served: ServableDrawn | null = null;
  try {
    served = servableDrawn(id, stored);
  } finally {
    console.warn = warn;
  }
  if (!served) {
    problems.push('the serve path withholds it');
    return { id, item: it, kind, stored, served, keyAnswer, mustPass, mustFail, proof, problems };
  }
  const spec = DrawnSpecSchema.parse(served.drawn);
  const safety = validateFigureSvg(served.figure.svg);
  if (!safety.ok) problems.push(`svg safety: ${JSON.stringify(safety.issues)}`);
  const legibility = checkFigureLegibility(stored.figure.spec as never);
  if (legibility.length) problems.push(`legibility: ${legibility.map((w) => `${w.code} ${w.message}`).join('; ')}`);

  mustPass.push({ why: 'the key', answer: keyAnswer });

  // ── reachability, proof, near misses ───────────────────────────────────────
  if (spec.kind === 'number-line-interval' && it.kind === 'interval') {
    const snap = spec.snap ?? 1;
    const ticks = tickValues(served.figure.svg, spec.frame);
    const tTol = (spec.frame.max - spec.frame.min) * 1e-3;
    if (Math.abs(minGap(ticks) - snap) > tTol) problems.push(`the snap step ${snap} is not the tick spacing ${fmt(minGap(ticks))}`);
    const { min, max } = spec.frame;
    for (const [end, v] of [['from', it.key.from], ['to', it.key.to]] as const) {
      if (v === null) continue;
      if (!isMultiple(v, snap)) problems.push(`${end} ${v} is not a multiple of the snap step ${snap}`);
      if (!onLines(v, ticks, tTol)) problems.push(`${end} ${v} is not on a drawn tick`);
      if (v < min + snap - EPS || v > max - snap + EPS) problems.push(`${end} ${v} is not at least one step inside the line (${min}..${max})`);
    }
    if (it.key.from !== null && it.key.to === null && it.key.from > max - 2 * snap + EPS) problems.push('the ray to the right shows less than two steps');
    if (it.key.to !== null && it.key.from === null && it.key.to < min + 2 * snap - EPS) problems.push('the ray to the left shows less than two steps');
    if (it.key.from === null && it.key.to === null) problems.push('the whole line is not a task');
    // Truth: the stated condition, sampled over and far beyond the frame.
    const [how, holds] = it.holds;
    const span = max - min;
    const xs: number[] = [];
    for (let x = min - 2 * span; x <= max + 2 * span + EPS; x += snap / 16) xs.push(Math.round(x * 1e9) / 1e9);
    xs.push(-1e3, 1e3, -1e5, 1e5);
    for (const v of [it.key.from, it.key.to]) if (v !== null) xs.push(v, v - 1e-6, v + 1e-6, v - snap / 3, v + snap / 3);
    const bad = xs.filter((x) => Boolean(holds(x)) !== inInterval(it.key, x));
    if (bad.length) problems.push(`the key ${intervalText(it.key)} does not match the stated condition at x = ${bad.slice(0, 5).map((v) => fmt(v)).join(', ')}${bad.length > 5 ? ` (+${bad.length - 5})` : ''}`);
    proof = { how, result: `the condition holds exactly on ${intervalText(it.key)} (${xs.length} sample points, endpoints exact)` };
    // Near misses.
    const iv = it.key;
    const nm = (why: string, v: Interval) => mustFail.push({ why: `near miss: ${why}`, answer: { kind, ...v } });
    if (iv.from !== null) {
      nm('left end flipped open/closed', { ...iv, fromOpen: !iv.fromOpen });
      if (iv.from - snap >= min - EPS) nm('left end one step left', { ...iv, from: iv.from - snap });
      if (iv.from + snap <= (iv.to ?? max) - EPS) nm('left end one step right', { ...iv, from: iv.from + snap });
      nm('left end made a ray', { ...iv, from: null, fromOpen: false });
    }
    if (iv.to !== null) {
      nm('right end flipped open/closed', { ...iv, toOpen: !iv.toOpen });
      if (iv.to + snap <= max + EPS) nm('right end one step right', { ...iv, to: iv.to + snap });
      if (iv.to - snap >= (iv.from ?? min) + EPS) nm('right end one step left', { ...iv, to: iv.to - snap });
      nm('right end made a ray', { ...iv, to: null, toOpen: false });
    }
    if (iv.from !== null && iv.to === null) nm('ray turned round', { from: null, to: iv.from, fromOpen: false, toOpen: iv.fromOpen });
    if (iv.to !== null && iv.from === null) nm('ray turned round', { from: iv.to, to: null, fromOpen: iv.toOpen, toOpen: false });
    // Ends given right-to-left are the same answer.
    if (iv.from !== null && iv.to !== null) mustPass.push({ why: 'ends given right to left', answer: { kind, from: iv.to, to: iv.from, fromOpen: iv.toOpen, toOpen: iv.fromOpen } });
    if (it.misses.length < 2) problems.push('needs at least two likely wrong answers');
    for (const [why, v] of it.misses) {
      mustFail.push({ why, answer: { kind, ...v } });
      const sample = xs.filter((x) => Math.abs(x) < 1e4);
      if (sample.every((x) => inInterval(v, x) === inInterval(iv, x))) problems.push(`the wrong answer "${why}" is the same set as the key`);
    }
  } else if (spec.kind !== 'number-line-interval' && it.kind !== 'interval') {
    const snap = spec.snap ?? { x: 1, y: 1 };
    const lines = gridlineValues(served.figure.svg, spec.frame);
    const [x0, x1] = spec.frame.xRange;
    const [y0, y1] = spec.frame.yRange;
    const xTol = (x1 - x0) * 1e-3;
    const yTol = (y1 - y0) * 1e-3;
    if (Math.abs(minGap(lines.xs) - snap.x) > xTol) problems.push(`the x snap ${snap.x} is not the gridline spacing ${fmt(minGap(lines.xs))}`);
    if (Math.abs(minGap(lines.ys) - snap.y) > yTol) problems.push(`the y snap ${snap.y} is not the gridline spacing ${fmt(minGap(lines.ys))}`);
    const reachable = ([x, y]: Pt, where: string, strict: boolean) => {
      if (!isMultiple(x, snap.x) || !isMultiple(y, snap.y)) problems.push(`${where} (${fmt(x)}, ${fmt(y)}) is not on the snap lattice`);
      if (!onLines(x, lines.xs, xTol) || !onLines(y, lines.ys, yTol)) problems.push(`${where} (${fmt(x)}, ${fmt(y)}) is not on drawn gridlines`);
      const inside = strict ? x > x0 + EPS && x < x1 - EPS && y > y0 + EPS && y < y1 - EPS : x >= x0 - EPS && x <= x1 + EPS && y >= y0 - EPS && y <= y1 + EPS;
      if (!inside) problems.push(`${where} (${fmt(x)}, ${fmt(y)}) is ${strict ? 'on or outside the border' : 'outside the frame'}`);
    };
    const lattice = (): Pt[] => {
      const out: Pt[] = [];
      for (let i = Math.ceil(x0 / snap.x - 1e-9); i * snap.x <= x1 + EPS; i++) for (let j = Math.ceil(y0 / snap.y - 1e-9); j * snap.y <= y1 + EPS; j++) out.push([Number((i * snap.x).toFixed(9)), Number((j * snap.y).toFixed(9))]);
      return out;
    };
    if (it.kind === 'points') {
      it.key.forEach((p, i) => reachable(p, `key point ${i + 1}`, true));
      for (let i = 0; i < it.key.length; i++) for (let j = i + 1; j < it.key.length; j++) if (samePt(it.key[i], it.key[j])) problems.push('two key points are the same point');
      const [how, calc] = it.calc;
      let got: Pt[] = [];
      try {
        got = calc();
      } catch (e) {
        problems.push(`calc threw: ${(e as Error).message}`);
      }
      const match = got.length === it.key.length && got.every((g) => it.key.some((k) => samePt(g, k))) && it.key.every((k) => got.some((g) => samePt(g, k)));
      if (!match) problems.push(`calc gives ${JSON.stringify(got)}, the key is ${JSON.stringify(it.key)}`);
      proof = { how, result: got.map(([x, y]) => `(${fmt(x)}, ${fmt(y)})`).join(', ') };
      const key = it.key;
      if (key.length > 1) mustPass.push({ why: 'the key in reverse order', answer: { kind, points: [...key].reverse() } });
      const nm = (why: string, pts: Pt[]) => mustFail.push({ why: `near miss: ${why}`, answer: { kind, points: pts } });
      const step = (v: number, s: number, lo: number, hi: number) => (v + s <= hi + EPS ? v + s : v - s);
      nm('first point one step off in x', key.map((p, i) => (i === 0 ? [step(p[0], snap.x, x0, x1), p[1]] : p)));
      nm('last point one step off in y', key.map((p, i) => (i === key.length - 1 ? [p[0], step(p[1], snap.y, y0, y1)] : p)));
      const swapAt = key.findIndex(([x, y]) => Math.abs(x - y) > EPS && x >= y0 && x <= y1 && y >= x0 && y <= x1);
      if (swapAt >= 0) nm(`coordinates of point ${swapAt + 1} swapped`, key.map((p, i) => (i === swapAt ? [p[1], p[0]] : p)));
      if (key.length > 1) nm('one point missing', key.slice(0, -1));
      const extra = lattice().find((q) => !key.some((k) => samePt(k, q)) && q[0] > x0 && q[1] > y0);
      if (extra) nm('one point too many', [...key, extra]);
      if (it.misses.length < 2) problems.push('needs at least two likely wrong answers');
      for (const [why, pts] of it.misses) {
        mustFail.push({ why, answer: { kind, points: pts } });
        if (pts.length === key.length && pts.every((q) => key.some((k) => samePt(k, q)))) problems.push(`the wrong answer "${why}" is the key`);
      }
    } else {
      const [p, q] = it.key;
      reachable(p, 'key point 1', false);
      reachable(q, 'key point 2', false);
      if (samePt(p, q)) problems.push('the two key points are the same');
      const [how, on] = it.on;
      const r1 = on(p[0], p[1]);
      const r2 = on(q[0], q[1]);
      const scale = Math.max(1, ...[p, q].flat().map(Math.abs));
      if (!(Math.abs(r1) < 1e-6 * scale && Math.abs(r2) < 1e-6 * scale)) problems.push(`the key points are not on the stated line (residuals ${r1}, ${r2})`);
      // The stated line must be the key's line: a third check point on the key line.
      const mid: Pt = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      if (Math.abs(on(mid[0], mid[1])) > 1e-6 * scale) problems.push('the stated line is not the line through the key points');
      const onKey = lattice().filter((c) => Math.abs((q[1] - p[1]) * (c[0] - p[0]) - (q[0] - p[0]) * (c[1] - p[1])) < 1e-7);
      if (onKey.length < 3) problems.push(`the line passes through only ${onKey.length} grid points of the frame (3 at least)`);
      proof = { how, result: `both key points satisfy the stated line; it passes through ${onKey.length} grid points of the frame: ${onKey.map(([x, y]) => `(${fmt(x)}, ${fmt(y)})`).join(' ')}` };
      mustPass.push({ why: 'the key points in reverse order', answer: { kind, points: [q, p] } });
      // Other pairs on the line: the two farthest apart, and two not both key points.
      if (onKey.length >= 2) {
        const far: [Pt, Pt] = [onKey[0], onKey[onKey.length - 1]];
        if (!(samePt(far[0], p) && samePt(far[1], q)) && !(samePt(far[0], q) && samePt(far[1], p))) mustPass.push({ why: 'the two grid points of the line farthest apart', answer: { kind, points: far } });
        const others = onKey.filter((c) => !samePt(c, p) && !samePt(c, q));
        if (others.length >= 2) mustPass.push({ why: 'two other grid points of the line', answer: { kind, points: [others[0], others[1]] } });
        else if (others.length === 1) mustPass.push({ why: 'one key point and another grid point of the line', answer: { kind, points: [p, others[0]] } });
      }
      const vertical = Math.abs(p[0] - q[0]) < EPS;
      const nm = (why: string, pts: [Pt, Pt]) => mustFail.push({ why: `near miss: ${why}`, answer: { kind, points: pts } });
      for (const [i, pt] of [p, q].entries()) {
        for (const dir of [1, -1]) {
          const moved: Pt = vertical ? [pt[0] + dir * snap.x, pt[1]] : [pt[0], pt[1] + dir * snap.y];
          if (moved[0] < x0 - EPS || moved[0] > x1 + EPS || moved[1] < y0 - EPS || moved[1] > y1 + EPS) continue;
          nm(`point ${i + 1} one step ${vertical ? (dir > 0 ? 'right' : 'left') : dir > 0 ? 'up' : 'down'}`, i === 0 ? [moved, q] : [p, moved]);
        }
      }
      if (it.misses.length < 2) problems.push('needs at least two likely wrong lines');
      for (const [why, pts] of it.misses) {
        mustFail.push({ why, answer: { kind, points: pts } });
        if (Math.abs(on(pts[0][0], pts[0][1])) < 1e-9 && Math.abs(on(pts[1][0], pts[1][1])) < 1e-9) problems.push(`the wrong line "${why}" is the key line`);
      }
    }
  } else {
    problems.push('the served kind does not match the authored kind');
  }

  // ── the grades ───────────────────────────────────────────────────────────
  for (const a of mustPass) {
    const g = gradeDrawn(spec, a.answer);
    if (!(g.gradable && g.correct)) problems.push(`must grade correct, got ${g.reason}: ${a.why} ${JSON.stringify(a.answer)}`);
  }
  for (const a of mustFail) {
    const g = gradeDrawn(spec, a.answer);
    if (!(g.gradable && !g.correct)) problems.push(`must grade wrong, got ${g.reason}: ${a.why} ${JSON.stringify(a.answer)}`);
  }
  return { id, item: it, kind, stored, served, keyAnswer, mustPass, mustFail, proof, problems };
}

/** The ProblemBank row (insert-only) for a built item. */
export function drawnBankRow(b: BuiltDrawn, topic: string, verifiedAt: string): Record<string, unknown> {
  const fields = drawnRowFields(b.stored.drawn, b.stored.figure);
  return {
    id: b.id,
    topic,
    topicId: topic,
    loId: b.item.lo,
    subtopic: b.item.sub,
    difficulty: b.item.d,
    problemText: b.item.q,
    answer: b.item.a,
    solutionText: b.item.s,
    hints: b.item.h,
    responseFormat: fields.responseFormat,
    choices: [],
    figure: fields.figure,
    drawn: fields.drawn,
    source: { name: SOURCE_NAME },
    license: 'internal-original',
    verifiedAt,
    verifierModel: VERIFIER,
  };
}

/** Items-level rules across a set: unique ids, unique task kinds per objective, caps and levels. */
export function setProblems(built: BuiltDrawn[], cap = 4): string[] {
  const p: string[] = [];
  const ids = built.map((b) => b.id);
  for (const id of ids.filter((x, i) => ids.indexOf(x) !== i)) p.push(`duplicate id ${id}`);
  const byLo = new Map<string, BuiltDrawn[]>();
  for (const b of built) byLo.set(b.item.lo, [...(byLo.get(b.item.lo) ?? []), b]);
  for (const [lo, bs] of byLo) {
    const ts = bs.map((b) => b.item.t);
    for (const t of ts.filter((x, i) => ts.indexOf(x) !== i)) p.push(`${lo}: task kind ${t} repeated`);
    if (bs.length > cap) p.push(`${lo}: ${bs.length} items (cap ${cap})`);
    if (bs.length >= 2 && new Set(bs.map((b) => b.item.d)).size < 2) p.push(`${lo}: all items are level ${bs[0].item.d} — mix the difficulty`);
    const specs = bs.map((b) => JSON.stringify(b.stored.drawn.key));
    for (const s of specs.filter((x, i) => specs.indexOf(x) !== i)) p.push(`${lo}: two items share the key ${s}`);
  }
  return p;
}
