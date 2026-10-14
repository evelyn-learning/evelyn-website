/** GreenApple T2 figure items — group "calcbc". Items: see author-t2-figure-items.ts for the rules. */
import { compileExpression } from '../../../src/lib/tutor/practice-figure/expr';
import { G, S, fgraph, plin, integ, near, round, arr, pick, falseOne, PI, Ctx, type Item, type P, type Spec } from './kit';

// ── helpers: one function drawn in pieces ───────────────────────────────────

type Piece = { expr: string; domain?: number[]; from?: string; to?: string };
const piecesOf = (c: Ctx): Piece[] => arr(c.p.curves) as unknown as Piece[];
const domOf = (c: Ctx, k: Piece): number[] => (k.domain ?? (c.p.xRange as number[])) as number[];
/** The one-sided limit at a: the piece that reaches a from that side, evaluated at a (its own expression). */
const sideLim = (c: Ctx, a: number, s: -1 | 1): number => {
  for (const k of piecesOf(c)) {
    const d = domOf(c, k);
    const hit = s < 0 ? d[0] < a - 1e-9 && d[1] >= a - 1e-9 : d[0] <= a + 1e-9 && d[1] > a + 1e-9;
    if (hit) return compileExpression(k.expr)(a);
  }
  throw new Error(`no piece reaches x = ${a} from the ${s < 0 ? 'left' : 'right'}`);
};
/** The two-sided limit, or NaN when the sides disagree. */
const lim2 = (c: Ctx, a: number): number => { const l = sideLim(c, a, -1); const r = sideLim(c, a, 1); return near(l, r, 1e-9) ? l : NaN; };
/** f at a point strictly inside a piece. */
const evalAt = (c: Ctx, x: number): number => {
  for (const k of piecesOf(c)) { const d = domOf(c, k); if (x > d[0] + 1e-12 && x < d[1] - 1e-12) return compileExpression(k.expr)(x); }
  throw new Error(`no piece is drawn at x = ${x}`);
};
/** f(a) as the figure shows it: a filled dot, else a piece whose end there is not open (or that runs through a). */
const valueAt = (c: Ctx, a: number): number | null => {
  const pt = arr(c.p.points ?? []).find((q) => near(q.x as number, a) && !q.open);
  if (pt) return pt.y as number;
  for (const k of piecesOf(c)) {
    const d = domOf(c, k);
    if (a > d[0] + 1e-9 && a < d[1] - 1e-9) return compileExpression(k.expr)(a);
    if (near(a, d[0]) && k.from !== 'open') return compileExpression(k.expr)(a);
    if (near(a, d[1]) && k.to !== 'open') return compileExpression(k.expr)(a);
  }
  return null;
};
type Kind = 'discontinuous' | 'differentiable' | 'corner' | 'cusp' | 'vertical';
/** Continuity and the kind of failure of differentiability at a, from the one-sided difference quotients. */
const classify = (c: Ctx, a: number): Kind => {
  const v = valueAt(c, a);
  if (v === null || !near(sideLim(c, a, -1), v, 1e-9) || !near(sideLim(c, a, 1), v, 1e-9)) return 'discontinuous';
  const q = (s: number, h: number) => (evalAt(c, a + s * h) - v) / (s * h);
  const grows = (s: number) => Math.abs(q(s, 1e-9)) > 100 && Math.abs(q(s, 1e-9)) > 5 * Math.abs(q(s, 1e-6));
  if (grows(-1) && grows(1)) return Math.sign(q(-1, 1e-9)) === Math.sign(q(1, 1e-9)) ? 'vertical' : 'cusp';
  return near(q(-1, 1e-7), q(1, 1e-7), 1e-4) ? 'differentiable' : 'corner';
};
const curveFn = (c: Ctx, i = 0): ((x: number) => number) => compileExpression(arr(c.p.curves)[i].expr as string);
/** Slope of a single curve at x, by a centred quotient with a tiny step. */
const dAt = (f: (x: number) => number, x: number): number => (f(x + 1e-6) - f(x - 1e-6)) / 2e-6;
/** The x-values at which a piecewise-linear graph's slope changes sign (its turning points), from its pieces. */
const turnsAt = (c: Ctx): number[] => {
  const ps = piecesOf(c);
  const slope = (k: Piece) => { const d = domOf(c, k); const f = compileExpression(k.expr); return (f(d[1]) - f(d[0])) / (d[1] - d[0]); };
  const out: number[] = [];
  for (let i = 1; i < ps.length; i++) if (slope(ps[i - 1]) * slope(ps[i]) < 0) out.push(domOf(c, ps[i])[0]);
  return out;
};
/** The zeros of a piecewise-linear graph inside (a, b) at which it changes sign. */
const signChanges = (c: Ctx, a: number, b: number): number[] => {
  const out: number[] = [];
  const n = 8000;
  for (let i = 1; i < n; i++) {
    const x0 = a + ((b - a) * (i - 1)) / n; const x1 = a + ((b - a) * i) / n;
    const y0 = evalAt(c, x0 + 1e-7); const y1 = evalAt(c, x1 + 1e-7);
    if (y0 * y1 < 0) out.push(round((x0 + x1) / 2, 2));
  }
  return out;
};

// ── helpers: tables, slope fields, polar curves ─────────────────────────────

const table = (columns: Array<string | P>, rows: Array<Array<number | string>>, extra: P = {}): Spec => S('data_table', { columns, rows, ...extra });
const cell = (c: Ctx, row: number, column = 1): number => c.num('table_cell', { row, column });
const sfield = (expr: string, extra: P = {}): Spec => S('slope_field', { expr, xRange: [-3, 3], yRange: [-3, 3], xStep: 1, yStep: 1, gridStep: 1, ...extra });
const slopeFn = (expr: string): ((x: number, y: number) => number) => compileExpression(expr, ['x', 'y']) as (x: number, y: number) => number;
/** A solution of dy/dx = f(x, y) followed from (x0, y0) to x1 (Runge–Kutta, fine steps). */
const follow = (f: (x: number, y: number) => number, x0: number, y0: number, x1: number): number => {
  const n = 40000; const h = (x1 - x0) / n; let x = x0; let y = y0;
  for (let i = 0; i < n; i++) {
    const k1 = f(x, y); const k2 = f(x + h / 2, y + (h * k1) / 2); const k3 = f(x + h / 2, y + (h * k2) / 2); const k4 = f(x + h, y + h * k3);
    y += (h * (k1 + 2 * k2 + 2 * k3 + k4)) / 6; x += h;
  }
  return y;
};
const polar = (expr: string, rMax: number, extra: P = {}): Spec => S('polar_complex', { plane: 'polar', rMax, rStep: 1, angleStep: 30, angleLabels: 'radians', curve: { expr, ...extra } });
/** r(θ) of the drawn polar curve, from the spec's own expression (θ in radians). */
const rOf = (c: Ctx): ((t: number) => number) => compileExpression(((c.p.curve as P).expr as string).replace(/theta/g, 'x'));
/** The petal of the drawn curve that contains the ray θ0: the nearest zeros of r on either side of θ0. */
const petalAround = (c: Ctx, th0: number): [number, number] => {
  const r = rOf(c);
  const zero = (dir: number): number => {
    let t = th0; const step = 1e-4 * dir;
    while (r(t) * r(t + step) > 0) { t += step; if (Math.abs(t - th0) > PI) throw new Error('no zero'); }
    let lo = t; let hi = t + step;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (r(lo) * r(m) <= 0) hi = m; else lo = m; }
    return (lo + hi) / 2;
  };
  return [zero(-1), zero(1)];
};

export const ITEMS: Item[] = [
  // ════════════════════════════════════════════════════════════════════════
  ...G('apcalcbc.limits-graphs-tables', 'Estimating limits from graphs and tables', [
    {
      t: 'a right-hand limit read past a jump and a marked value', d: 2, need: 'reason',
      spec: fgraph({ xRange: [0, 6], yRange: [0, 6], curves: [{ expr: 'x + 1', domain: [0, 3], to: 'open' }, { expr: '0.5x - 0.5', domain: [3, 6], from: 'open' }], points: [{ x: 3, y: 2 }] }),
      alt: 'The graph of f in two straight pieces with a break at x = 3: the left piece ends in an open circle, the right piece begins at an open circle, and a filled dot sits between them on the line x = 3.',
      q: 'The graph of f is shown. What is the value of the limit of f(x) as x → 3⁺ (x approaching 3 from the right)?',
      n: '1',
      calc: ['the right-hand piece of the spec (the one whose domain starts at 3) evaluated at x = 3', (c) => round(sideLim(c, 3, 1), 9)],
      h: ['Trace the curve toward x = 3 using only the piece that lies to the right of x = 3.', 'An open circle marks a height the curve approaches; a filled dot marks the value of f itself, which does not decide a limit.'],
      s: 'Read from the figure: coming from the right, the right-hand piece falls toward the open circle at (3, 1). The left piece heads to (3, 4) and the filled dot gives f(3) = 2, but neither belongs to the approach from the right. So the limit of f(x) as x → 3⁺ is 1.',
    },
    {
      t: 'the false statement about limits and values at a hole and a jump', d: 3, need: 'reason',
      spec: fgraph({ xRange: [0, 6], yRange: [0, 6], curves: [{ expr: '0.5x + 2', domain: [0, 2], to: 'open' }, { expr: '5 - x', domain: [2, 4], from: 'open', to: 'closed' }, { expr: 'x - 1', domain: [4, 6], from: 'open' }], points: [{ x: 2, y: 5 }] }),
      alt: 'The graph of f in three straight pieces. At x = 2 both neighbouring pieces end at open circles at the same height and a filled dot sits above them; at x = 4 one piece ends at a filled dot and the next starts higher at an open circle.',
      q: 'The graph of f is shown. Which statement about f is FALSE?',
      o: [
        ['lim x→4 f(x) = 1', 'correct'],
        ['lim x→2 f(x) = 3', 'takes the filled dot f(2) as the limit instead of the height both sides approach'],
        ['f(4) = 1', 'reads the open circle at x = 4 as the value of f'],
        ['lim x→4⁺ f(x) = 3', 'reads the right-hand limit from the left piece'],
      ],
      holds: falseOne('each limit and value computed from the pieces and points of the spec', [
        (c) => near(lim2(c, 4), 1, 1e-9),
        (c) => near(lim2(c, 2), 3, 1e-9),
        (c) => near(valueAt(c, 4) ?? NaN, 1, 1e-9),
        (c) => near(sideLim(c, 4, 1), 3, 1e-9),
      ]),
      h: ['At each break, trace the curve from the left and from the right separately and note the height each side approaches.', 'A two-sided limit exists only when the two one-sided limits agree; the filled dot gives the value of f, not the limit.'],
      s: 'Read from the figure: at x = 2 both sides approach height 3 (open circles), and the filled dot gives f(2) = 5, so lim x→2 f(x) = 3 is true. At x = 4 the left piece ends at the filled dot (4, 1), so f(4) = 1 and the left-hand limit is 1; the right piece starts at the open circle (4, 3), so lim x→4⁺ f(x) = 3. The one-sided limits at 4 disagree (1 ≠ 3), so lim x→4 f(x) does not exist, and the statement that it equals 1 is false.',
    },
    {
      t: 'a limit estimated from a table that also prints a different f(a)', d: 2, need: 'reason',
      spec: table(['x', 'f(x)'], [[1.9, 4.7], [1.99, 4.97], [1.999, 4.997], [2, 9], [2.001, 5.003], [2.01, 5.03], [2.1, 5.3]]),
      alt: 'A table of values of f with x creeping toward 2 from below and from above, three rows on each side, and a middle row for x = 2 itself.',
      q: 'The table gives values of a function f for x near 2. Based on the table, what is the best estimate of the limit of f(x) as x → 2?',
      n: '5',
      calc: ['the f-values of the spec\'s rows nearest x = 2 on each side (rows 3 and 5), checked to close in from both sides; their common target', (c) => {
        const left = [0, 1, 2].map((i) => cell(c, i)); const right = [6, 5, 4].map((i) => cell(c, i));
        const target = round((left[2] + right[2]) / 2, 6);
        for (const s of [left, right]) if (!(Math.abs(s[2] - target) < Math.abs(s[1] - target) && Math.abs(s[1] - target) < Math.abs(s[0] - target) && Math.abs(s[2] - target) <= 0.01)) throw new Error('the sides do not close in on one value');
        return target;
      }],
      h: ['Look only at the rows with x below 2, then only at the rows with x above 2: what number does each side close in on?', 'The row for x = 2 itself gives the value of f there, which need not equal the limit.'],
      s: 'Read from the table: from the left, f(1.9) = 4.7, f(1.99) = 4.97, f(1.999) = 4.997 — closing in on 5. From the right, f(2.1) = 5.3, f(2.01) = 5.03, f(2.001) = 5.003 — also closing in on 5. Both sides agree, so the limit is estimated as 5. The row f(2) = 9 is the value of the function at 2, not the limit.',
    },
  ]),

  // ════════════════════════════════════════════════════════════════════════
  ...G('apcalcbc.limits-representations', 'Moving between graph, table and algebra', [
    {
      t: 'the table values that agree with a graph near a jump', d: 2, need: 'reason',
      spec: fgraph({ xRange: [-1, 4], yRange: [0, 5], curves: [{ expr: 'x + 1', domain: [-1, 1], to: 'open' }, { expr: '5 - x', domain: [1, 4], from: 'closed' }] }),
      alt: 'The graph of f in two straight pieces with a break at x = 1: the rising left piece ends at an open circle and the falling right piece begins at a filled dot at a different height.',
      q: 'The graph of f is shown. Which pair of values from a table of f is consistent with the graph?',
      o: [
        ['f(0.999) ≈ 2 and f(1.001) ≈ 4', 'correct'],
        ['f(0.999) ≈ 4 and f(1.001) ≈ 2', 'swaps the left and right sides of x = 1'],
        ['f(0.999) ≈ 3 and f(1.001) ≈ 3', 'averages the two heights as if the graph had no jump'],
        ['f(0.999) ≈ 4 and f(1.001) ≈ 4', 'lets the filled dot f(1) decide the values on both sides'],
      ],
      holds: pick('f(0.999) and f(1.001) from the pieces of the spec, each rounded to a whole number', (c) => [Math.round(evalAt(c, 0.999)), Math.round(evalAt(c, 1.001))], [[2, 4], [4, 2], [3, 3], [4, 4]]),
      h: ['x = 0.999 is just to the left of 1 and x = 1.001 just to the right: decide which piece of the graph each one lies on.', 'Read the height that piece approaches at x = 1.'],
      s: 'Read from the figure: the left piece rises toward the open circle at (1, 2), and the right piece starts at the filled dot (1, 4). A table row with x = 0.999 lies on the left piece, so f(0.999) ≈ 2; a row with x = 1.001 lies on the right piece, so f(1.001) ≈ 4. The table would show the jump the graph shows.',
    },
    {
      t: 'a limit of a sum: one part from a graph, one part by algebra', d: 3, need: 'calc',
      spec: fgraph({ xRange: [0, 6], yRange: [0, 6], curves: [{ expr: 'x + 1', domain: [0, 2], to: 'open' }, { expr: '0.5x + 2', domain: [2, 6], from: 'open' }], points: [{ x: 2, y: 1 }] }),
      alt: 'The graph of f in two straight pieces that meet at an open circle on the line x = 2; a separate filled dot lies lower down on the same vertical line.',
      q: 'The graph of f is shown. Let g(x) = (x² − 4)/(x − 2) for x ≠ 2. What is the value of the limit of [f(x) + g(x)] as x → 2?',
      n: '7',
      calc: ['the two-sided limit of the spec\'s pieces at x = 2 (both sides must agree) plus the limit of (x² − 4)/(x − 2), from values just either side of 2', (c) => {
        const g = (x: number) => (x * x - 4) / (x - 2);
        const lg = round((g(2 - 1e-7) + g(2 + 1e-7)) / 2, 6);
        const lf = lim2(c, 2);
        if (!Number.isFinite(lf)) throw new Error('f has no limit at 2');
        return round(lf + lg, 6);
      }],
      h: ['For f, trace the graph toward x = 2 from both sides; a separate filled dot gives only the value of f there.', 'For g, factor the numerator and cancel the common factor before substituting.'],
      s: 'Read from the figure: both pieces of f approach the open circle at (2, 3), so lim x→2 f(x) = 3; the filled dot (2, 1) is f(2), which does not matter for the limit. Algebraically, g(x) = (x − 2)(x + 2)/(x − 2) = x + 2 for x ≠ 2, so lim x→2 g(x) = 4. The limit of the sum is 3 + 4 = 7.',
    },
    {
      t: 'the graph feature and limit a table of exploding values shows', d: 2, need: 'reason',
      spec: table(['x', 'f(x)'], [[1.9, 10], [1.99, 100], [1.999, 1000], [2.001, -1000], [2.01, -100], [2.1, -10]]),
      alt: 'A table of values of f with two columns, x and f(x), and six rows: three with x just below the x-value the question asks about and three just above it.',
      q: 'The table gives values of a function f for x near 2. What do these values show about the graph of f and the limit of f(x) as x → 2?',
      o: [
        ['A vertical asymptote at x = 2; the limit does not exist', 'correct'],
        ['A hole at x = 2; the limit is 0', 'averages the two sides, whose values cancel, instead of following each side'],
        ['A jump at x = 2; the one-sided limits are 1000 and −1000', 'takes the last rows as limits although the values keep growing'],
        ['No break at x = 2; the limit is 1000', 'reads only the rows below 2'],
      ],
      holds: pick('the spec\'s f-values on each side toward x = 2: unbounded when each step multiplies the size by 5 or more', (c) => {
        const v = [0, 1, 2, 3, 4, 5].map((i) => cell(c, i));
        const unb = (s: number[]) => s.every((y, i) => i === 0 || Math.abs(y) >= 5 * Math.abs(s[i - 1]));
        return unb([v[0], v[1], v[2]]) && unb([v[5], v[4], v[3]]) ? 'asymptote' : 'bounded';
      }, ['asymptote', 'hole', 'jump', 'none']),
      h: ['Follow the f-values down the rows below 2, then up the rows above 2: do they settle near a number?', 'Values whose size grows without bound as x gets closer to a number point to an unbounded limit on the graph.'],
      s: 'Read from the table: as x → 2⁻ the values go 10, 100, 1000 — each ten times the last — so f(x) grows without bound. As x → 2⁺ they go −10, −100, −1000, falling without bound. Neither side settles on a number, so the graph has a vertical asymptote at x = 2 and the limit of f(x) as x → 2 does not exist.',
    },
  ]),

  // ════════════════════════════════════════════════════════════════════════
  ...G('apcalcbc.differentiability-continuity', 'Where a graph fails to be differentiable', [
    {
      t: 'count the points where a graph is not differentiable', d: 2, need: 'reason',
      spec: fgraph({ xRange: [0, 7], yRange: [0, 6], curves: [{ expr: 'x + 1', domain: [0, 2], to: 'none' }, { expr: '5 - x', domain: [2, 4], from: 'none', to: 'closed' }, { expr: 'x - 1', domain: [4, 7], from: 'open' }] }),
      alt: 'The graph of f in three straight pieces: it rises, turns sharply and falls without a break, then ends at a filled dot, and the last piece starts higher at an open circle and rises to the right-hand edge.',
      q: 'The graph of f is shown for 0 ≤ x ≤ 7. At how many x-values in the open interval 0 < x < 7 is f NOT differentiable?',
      n: '2',
      calc: ['each knot of the spec\'s pieces inside (0, 7) classified from one-sided limits and one-sided difference quotients; the number that are not differentiable', (c) => [2, 4].filter((a) => classify(c, a) !== 'differentiable').length],
      h: ['Look for every place where the graph turns sharply or breaks.', 'A function that is not continuous at a point cannot be differentiable there either.'],
      s: 'Read from the figure: at x = 2 the graph has a corner — the slope changes from 1 to −1 with no break — so f is continuous but not differentiable there. At x = 4 the graph jumps from the filled dot (4, 1) to the open circle (4, 3), so f is not continuous there, and therefore not differentiable. Everywhere else the pieces are straight lines. That makes 2 x-values.',
    },
    {
      t: 'classify the failure at a pointed turn of a curved graph', d: 2, need: 'reason',
      spec: fgraph({ xRange: [-1, 5], yRange: [-1, 4], curves: [{ expr: '2*abs(x - 2)^(2/3)' }] }),
      alt: 'A curved graph of f that comes down to the x-axis at a sharp point and rises again on the other side; it passes through (1, 2) and (3, 2).',
      q: 'The graph of f is shown. Which statement describes f at x = 2?',
      o: [
        ['Continuous, not differentiable: a cusp', 'correct'],
        ['Continuous, not differentiable: a corner', 'misses that the slopes on both sides grow without bound instead of settling on two finite values'],
        ['Continuous, not differentiable: a vertical tangent', 'misses that the slopes on the two sides head to infinities of opposite sign'],
        ['Continuous and differentiable', 'assumes continuity brings differentiability, the converse of the theorem, which is false'],
      ],
      holds: pick('continuity and the one-sided difference quotients of the spec\'s curve at x = 2 (h = 10⁻⁶ and 10⁻⁹)', (c) => classify(c, 2), ['cusp', 'corner', 'vertical', 'differentiable']),
      h: ['First check for a break: does the graph pass through x = 2 without lifting the pencil?', 'Then compare the steepness just to the left and just to the right of x = 2: do the slopes settle on numbers, or grow without bound, and with which signs?'],
      s: 'Read from the figure: the graph has no break at x = 2, so f is continuous there. Near x = 2 the curve becomes steeper and steeper on both sides: falling toward the point from the left (slopes → −∞) and rising away from it on the right (slopes → +∞). The one-sided slopes diverge in opposite directions, which is a cusp, so f is not differentiable at x = 2.',
    },
    {
      t: 'the false statement about a one-formula graph that meets the x-axis twice', d: 3, need: 'reason',
      spec: fgraph({ xRange: [-2, 2], yRange: [0, 6], curves: [{ expr: '2*abs(x^2 - 1)' }] }),
      alt: 'The curve falls from (−2, 6) to meet the x-axis at x = −1, rises to height 2 at x = 0, falls to meet the x-axis again at x = 1, and rises to (2, 6).',
      q: 'The graph of f is shown for −2 ≤ x ≤ 2. Which statement about f is FALSE?',
      o: [
        ['f is differentiable at x = 1', 'correct'],
        ['f is continuous at x = 1', 'thinks a sharp point on the x-axis is a break in the graph'],
        ['f is differentiable at x = 0', 'mistakes the rounded top at x = 0 for a sharp point'],
        ['f′(1.5) is positive', 'reads the height of the graph near x = 1 instead of the direction it is heading'],
      ],
      holds: falseOne('continuity and one-sided difference quotients of the spec\'s curve at x = 1 and x = 0; the slope at x = 1.5 from the curve itself', [
        (c) => classify(c, 1) === 'differentiable',
        (c) => classify(c, 1) !== 'discontinuous',
        (c) => classify(c, 0) === 'differentiable',
        (c) => dAt(curveFn(c), 1.5) > 0,
      ]),
      h: ['At each x-value named, ask two questions: is there a break, and is there a single tangent direction?', 'A sharp point where the slope jumps from one value to another is continuous but not differentiable.'],
      s: 'Read from the figure: the curve has no break anywhere, so f is continuous at x = 1. At x = 0 the top is rounded, with a level tangent, so f is differentiable there. To the right of x = 1 the curve rises, so f′(1.5) is positive. At x = 1 the curve comes down to the x-axis and turns sharply upward: the slope just to the left is about −4 and just to the right about +4, a corner. So f is not differentiable at x = 1, and that statement is the false one.',
    },
  ]),

  // ════════════════════════════════════════════════════════════════════════
  ...G('apcalcbc.estimating-derivatives', 'Difference quotients from tables and graphs', [
    {
      t: 'symmetric difference quotient from a drawn table with units', d: 2, need: 'calc',
      spec: table(['Time t (min)', 'Temperature T (°C)'], [[0, 70], [4, 62], [8, 55], [12, 50], [16, 46]]),
      alt: 'A table of the temperature of a cooling cup of tea, in degrees Celsius, at five equally spaced times in minutes.',
      q: 'The table gives the temperature T of a cup of tea at times t. Using the symmetric difference quotient, estimate T′(8), in °C per minute.',
      n: '-1.5',
      ck: ['table_average_rate', { x: 0, y: 1, from: 1, to: 3 }],
      h: ['The symmetric quotient uses the two table rows one step before and one step after the time you want.', 'Divide the change in temperature between those rows by the change in time between them.'],
      s: 'Read from the table: T(4) = 62 and T(12) = 50, the rows either side of t = 8. The symmetric difference quotient is [T(12) − T(4)] / (12 − 4) = (50 − 62)/8 = −12/8 = −1.5. So T′(8) ≈ −1.5 °C per minute: the tea is cooling by about 1.5 degrees a minute at t = 8.',
    },
    {
      t: 'symmetric difference quotient from two points read off a curve', d: 2, need: 'calc',
      spec: fgraph({ xRange: [0, 7], yRange: [0, 10], curves: [{ expr: '0.25*x^2' }] }),
      alt: 'A curve of f rising from the origin and getting steeper to the right, drawn on a square grid.',
      q: 'The graph of f is shown. Using the points of the graph at x = 2 and x = 6, estimate f′(4) with the symmetric difference quotient.',
      n: '2',
      calc: ['[f(6) − f(2)] / 4 with f(6) and f(2) from the curve_value checker', (c) => (c.num('curve_value', { curve: 0, x: 6 }) - c.num('curve_value', { curve: 0, x: 2 })) / 4],
      h: ['Read the heights of the graph at the two given x-values.', 'Divide the change in height by the change in x between those two points.'],
      s: 'Read from the figure: the graph passes through (2, 1) and (6, 9). The symmetric difference quotient centred at x = 4 is [f(6) − f(2)] / (6 − 2) = (9 − 1)/4 = 8/4 = 2. So f′(4) ≈ 2.',
    },
    {
      t: 'a forward estimate compared with the slope of a drawn tangent', d: 3, need: 'calc',
      spec: fgraph({ xRange: [0, 6], yRange: [-3, 8], curves: [{ expr: '6 - 0.5*(x - 1)^2', label: 'f' }, { expr: '10 - 2x', domain: [1, 5], to: 'none', from: 'none', label: 'tangent', dashed: true }] }),
      alt: 'A downward-opening curve f with its highest point at (1, 6), and a dashed straight line that touches the curve at the point where x = 3.',
      q: 'The graph of f and the line tangent to it at x = 3 are shown. A student estimates f′(3) with the forward difference quotient using the points of the curve at x = 3 and x = 5. What is the student\'s estimate minus the slope of the tangent line?',
      n: '-1',
      calc: ['forward quotient [f(5) − f(3)]/2 from curve_value on the curve, minus the tangent\'s slope from curve_slope; the line is checked to touch the curve at x = 3', (c) => {
        const f = curveFn(c, 0); const t = curveFn(c, 1);
        const m = c.num('curve_slope', { curve: 1, x1: 3, x2: 5 });
        if (!near(f(3), t(3), 1e-9) || !near(dAt(f, 3), m, 1e-6)) throw new Error('the line is not tangent at x = 3');
        return (c.num('curve_value', { curve: 0, x: 5 }) - c.num('curve_value', { curve: 0, x: 3 })) / 2 - m;
      }],
      h: ['Find the slope of the dashed line from two grid points it passes through.', 'For the forward quotient, read the heights of the curve at the two given x-values and divide the change in height by the change in x.'],
      s: 'Read from the figure: the tangent line passes through (3, 4) and (5, 0), so its slope is (0 − 4)/(5 − 3) = −2. The curve passes through (3, 4) and (5, −2), so the forward estimate is (−2 − 4)/(5 − 3) = −3. The estimate minus the tangent slope is −3 − (−2) = −1: on this concave-down curve the forward quotient comes out too low.',
    },
  ]),

  // ════════════════════════════════════════════════════════════════════════
  ...G('apcalcbc.graphing-f-fp-fpp', 'Reading f from the graph of f′ or f″', [
    {
      t: 'count the inflection points of f from a graph of f′', d: 2, need: 'reason',
      spec: fgraph({ xRange: [0, 8], yRange: [-3, 3], yLabel: 'y', curves: [{ ...plin([[0, 2], [2, -2], [4, -1], [6, -3], [8, 3]])[0], label: 'f′' }, ...plin([[0, 2], [2, -2], [4, -1], [6, -3], [8, 3]]).slice(1)] }),
      alt: 'The graph of the DERIVATIVE f′ in four straight pieces: it falls, rises a little, falls again and then rises steeply, crossing the x-axis twice.',
      q: 'The graph shown is the graph of f′, the derivative of f, for 0 ≤ x ≤ 8. How many points of inflection does the graph of f have for 0 < x < 8?',
      n: '3',
      calc: ['the knots of the spec\'s pieces where the slope of f′ changes sign (f″ changes sign), counted', (c) => turnsAt(c).filter((x) => x > 0 && x < 8).length],
      h: ['An inflection point of f is where f″ changes sign, and f″ is the slope of the f′ graph.', 'So look for the places where the f′ graph switches between rising and falling — not where it crosses the x-axis.'],
      s: 'Read from the figure: the graph of f′ falls on (0, 2), rises on (2, 4), falls on (4, 6) and rises on (6, 8). Its slope, f″, changes sign at x = 2, x = 4 and x = 6, so f changes concavity at each: 3 inflection points. The crossings of the x-axis (at x = 1 and x = 7) are local extrema of f, not inflection points.',
    },
    {
      t: 'the inflection point of f from a graph of f″ that touches zero', d: 3, need: 'reason',
      spec: fgraph({ xRange: [0, 6], yRange: [-3, 3], curves: [{ ...plin([[0, -2], [2, 2], [4, 0], [6, 2]])[0], label: 'f″' }, ...plin([[0, -2], [2, 2], [4, 0], [6, 2]]).slice(1)] }),
      alt: 'The graph of the SECOND derivative f″ in three straight pieces: it rises through the x-axis, comes down to touch the x-axis at a corner, and rises again.',
      q: 'The graph shown is the graph of f″, the second derivative of f, for 0 ≤ x ≤ 6. At what value of x does the graph of f have a point of inflection?',
      n: '1',
      calc: ['the zeros of the spec\'s f″ pieces in (0, 6) at which f″ changes sign; exactly one', (c) => { const z = signChanges(c, 0, 6); if (z.length !== 1) throw new Error(`${z.length} sign changes`); return z[0]; }],
      h: ['f has an inflection point where f″ changes sign, not merely where f″ equals zero.', 'Check the sign of f″ just before and just after each place the graph meets the x-axis.'],
      s: 'Read from the figure: f″ is zero at x = 1 and at x = 4. At x = 1 the graph crosses the axis, from negative to positive, so f changes from concave down to concave up: an inflection point. At x = 4 the graph only touches the axis and stays non-negative on both sides, so the concavity does not change there. The only inflection point is at x = 1.',
    },
    {
      t: 'the interval where f is increasing and concave down, from f′', d: 3, need: 'reason',
      spec: fgraph({ xRange: [0, 8], yRange: [-3, 3], curves: [{ ...plin([[0, -2], [2, 2], [5, -1], [8, 2]])[0], label: 'f′' }, ...plin([[0, -2], [2, 2], [5, -1], [8, 2]]).slice(1)] }),
      alt: 'The graph of the DERIVATIVE f′ in three straight pieces: it rises through the x-axis to a peak, falls back through the x-axis to a low point, and rises through the axis again.',
      q: 'The graph shown is the graph of f′, the derivative of f, for 0 ≤ x ≤ 8. On which interval is f both increasing and concave down?',
      o: [
        ['2 < x < 4', 'correct'],
        ['1 < x < 4', 'includes 1 < x < 2, where f′ is still rising, so f is concave up there'],
        ['2 < x < 5', 'includes 4 < x < 5, where f′ is below the axis, so f is decreasing there'],
        ['0 < x < 2', 'reads the rising f′ graph as f increasing and concave down'],
      ],
      holds: [
        'the option holds when f′ > 0 and f′ is falling at every point inside it (sampled every 0.01 from the spec\'s pieces) and at neither point 0.05 outside its ends',
        ([[2, 4], [1, 4], [2, 5], [0, 2]] as Array<[number, number]>).map(([a, b]) => (c: Ctx) => {
          const ok = (x: number) => evalAt(c, x) > 0 && evalAt(c, x + 0.001) < evalAt(c, x - 0.001);
          const inside: number[] = [];
          for (let x = a + 0.01; x < b - 0.005; x += 0.01) inside.push(x);
          return inside.every(ok) && !(a - 0.05 > 0 && ok(a - 0.05)) && !(b + 0.05 < 8 && ok(b + 0.05));
        }),
      ],
      h: ['f is increasing where the f′ graph lies above the x-axis.', 'f is concave down where the f′ graph is falling; find where both are true at once.'],
      s: 'Read from the figure: f′ > 0 (above the x-axis) for 1 < x < 4 and for 6 < x < 8, so f is increasing there. f′ is falling for 2 < x < 5 (from its peak at x = 2 to its low point at x = 5), so f is concave down there. Both hold together only for 2 < x < 4.',
    },
  ]),

  // ════════════════════════════════════════════════════════════════════════
  ...G('apcalcbc.slope-fields', 'Reading slope fields', [
    {
      t: 'match a drawn slope field to its differential equation', d: 2, need: 'reason',
      spec: sfield('x - y'),
      alt: 'A slope field on a coordinate grid: one short segment at every point with whole-number coordinates from −3 to 3. The segments are level along one slanted line through the origin and tilt more the further they are from it.',
      q: 'The slope field shown belongs to one of these differential equations. Which one?',
      o: [
        ['dy/dx = x − y', 'correct'],
        ['dy/dx = y − x', 'has every slope with the wrong sign: the segments below the level line would fall'],
        ['dy/dx = x + y', 'puts the level segments on the line y = −x'],
        ['dy/dx = xy', 'puts the level segments along both axes'],
      ],
      ck: ['slope_match_equation', { options: ['dy/dx = x − y', 'dy/dx = y − x', 'dy/dx = x + y', 'dy/dx = xy'] }],
      h: ['Find where the segments are level: there dy/dx = 0, so the right-hand side must be zero along that line.', 'Then check the sign of the slope at one point off that line, for example at (2, 0).'],
      s: 'Read from the figure: the segments are level along the line y = x (at (0, 0), (1, 1), (2, 2), …), so dy/dx = 0 when y = x. At (2, 0), below that line, the segment rises with slope 2, and at (0, 2) it falls with slope −2. dy/dx = x − y gives 0 on y = x, 2 at (2, 0) and −2 at (0, 2), so it matches.',
    },
    {
      t: 'long-run value of the solution through a given point', d: 3, need: 'reason',
      spec: sfield('(y - 1)*(3 - y)/2', { yRange: [-1, 4] }),
      alt: 'A slope field on a coordinate grid from x = −3 to 3 and y = −1 to 4. Within each horizontal row every segment has the same tilt; two rows have level segments.',
      q: 'The slope field of a differential equation is shown. A solution curve passes through the point (0, 2). According to the slope field, what value does y approach on this solution as x increases without bound?',
      n: '3',
      calc: ['the spec\'s equation followed numerically from (0, 2) to x = 40 (Runge–Kutta); its slope there must have died away', (c) => { const f = slopeFn(c.p.expr as string); const y = follow(f, 0, 2, 40); if (Math.abs(f(40, y)) > 1e-6) throw new Error('not settled'); return round(y, 4); }],
      h: ['Find the rows in which every segment is level: those horizontal lines are solutions, and other solutions cannot cross them.', 'Look at the sign of the slope at the starting point to see which way the solution moves from there.'],
      s: 'Read from the figure: the segments are level along y = 1 and along y = 3, so these constant functions are solutions. At (0, 2), between them, the segments rise, and they rise everywhere between the two lines, flattening near y = 3. So the solution through (0, 2) climbs and levels off toward y = 3 without crossing it.',
    },
    {
      t: 'the line along which every segment is level', d: 2, need: 'reason',
      spec: sfield('y - x + 1'),
      alt: 'A slope field on a coordinate grid: one short segment at every point with whole-number coordinates from −3 to 3. The tilt changes with both x and y, and the level segments line up along one slanted line.',
      q: 'In the slope field shown, along which line is every segment horizontal?',
      o: [
        ['y = x − 1', 'correct'],
        ['y = x + 1', 'shifts the line of level segments the wrong way'],
        ['y = −x + 1', 'slants the line the wrong way'],
        ['x = 1', 'looks only at one column of segments'],
      ],
      ck: ['slope_isocline', { slope: 0 }],
      h: ['Find two or three lattice points where the segment is exactly horizontal.', 'Those points lie on one straight line; read its slope and intercept from the grid.'],
      s: 'Read from the figure: the segments are horizontal at (1, 0), (2, 1), (3, 2), (0, −1) and (−2, −3). These points lie on the line with slope 1 through (0, −1), which is y = x − 1. Above that line the segments rise, below it they fall.',
    },
  ]),

  // ════════════════════════════════════════════════════════════════════════
  ...G('apcalcbc.polar-area', 'Areas enclosed by polar curves', [
    {
      t: 'total area of a four-petal rose read off a polar grid', d: 2, need: 'calc',
      spec: polar('4*sin(2*theta)', 5),
      alt: 'A polar grid of numbered circles and rays every π/6, with a rose curve of four equal petals drawn on it, one petal in each quadrant.',
      q: 'The polar curve shown is the rose r = a·sin(2θ) with a > 0. The total area enclosed by all four petals is kπ. What is the value of k?',
      n: '8',
      calc: ['(1/2)∫ r² dθ over 0 ≤ θ ≤ 2π for the spec\'s curve, divided by π', (c) => { const r = rOf(c); return round((0.5 * integ((t) => r(t) ** 2, 0, 2 * PI)) / PI, 6); }],
      h: ['Read the value of a from the length of a petal on the numbered circles.', 'Use A = (1/2)∫ r² dθ over a full turn, with sin²(2θ) = (1 − cos 4θ)/2.'],
      s: 'Read from the figure: each petal reaches out to the circle numbered 4, so a = 4 and r = 4 sin(2θ). As θ goes from 0 to 2π the four petals are each traced once. A = (1/2)∫₀^{2π} 16 sin²(2θ) dθ = 8∫₀^{2π} (1 − cos 4θ)/2 dθ = 8 · π = 8π. So k = 8 (each petal has area 2π).',
    },
    {
      t: 'area inside a cardioid and outside a grid circle', d: 3, need: 'calc',
      spec: polar('3 + 3*cos(theta)', 6),
      alt: 'A polar grid of numbered circles and rays every π/6, with a heart-shaped cardioid drawn on it whose point is at the pole and which bulges out along the polar axis.',
      q: 'The polar curve shown is the cardioid r = a + a·cos θ with a > 0. Find the area of the region inside the cardioid and outside the circle r = 3. Give your answer to one decimal place.',
      n: '25.1',
      calc: ['(1/2)∫ (r² − 9) dθ over the angles where the spec\'s r exceeds 3 (integrand max(0, r² − 9) over a full turn)', (c) => { const r = rOf(c); return round(0.5 * integ((t) => Math.max(0, r(t) ** 2 - 9), 0, 2 * PI, [PI / 2, 1.5 * PI]), 4); }],
      alts: ['π taken as 3.14 or 22/7 in 18 + 9π/4', () => [18 + (9 * 3.14) / 4, 18 + (9 * 22) / 7 / 4]],
      h: ['Read a from where the cardioid crosses the polar axis farthest from the pole, then find the angles where the cardioid meets the circle r = 3.', 'Use A = (1/2)∫ (outer² − inner²) dθ between those angles, with cos²θ = (1 + cos 2θ)/2.'],
      s: 'Read from the figure: the cardioid reaches r = 6 on the polar axis, so 2a = 6 and a = 3: r = 3 + 3 cos θ. It meets the circle r = 3 where cos θ = 0, at θ = −π/2 and π/2 (the vertical ray), and lies outside the circle between them. A = (1/2)∫_{−π/2}^{π/2} [(3 + 3cos θ)² − 9] dθ = (1/2)∫ (18 cos θ + 9 cos²θ) dθ = (1/2)(36 + 9π/2) = 18 + 9π/4 ≈ 25.1.',
    },
    {
      t: 'the integral for one petal: bounds and coefficient from the figure', d: 3, need: 'reason',
      spec: polar('2*sin(3*theta)', 3, { thetaRange: [0, 180] }),
      alt: 'A polar grid of numbered circles and rays every π/6, with a rose curve of three equal petals; one petal lies in the first quadrant, one in the second and one points straight down.',
      q: 'The polar curve shown is the rose r = a·sin(3θ) with a > 0. Which integral gives the area of ONE petal — the petal in the first quadrant?',
      o: [
        ['(1/2)∫ from 0 to π/3 of 4sin²(3θ) dθ', 'correct'],
        ['∫ from 0 to π/3 of 4sin²(3θ) dθ', 'leaves out the 1/2 of the sector formula'],
        ['(1/2)∫ from 0 to π/6 of 4sin²(3θ) dθ', 'stops at the tip of the petal, so covers only half of it'],
        ['(1/2)∫ from 0 to π/3 of 2sin²(3θ) dθ', 'squares sin(3θ) but not a'],
      ],
      holds: ['each integral evaluated numerically and compared with (1/2)∫ r² dθ over the petal of the spec\'s curve that holds the ray θ = π/6 (between its nearest zeros)', (() => {
        const petal = (c: Ctx) => { const [a, b] = petalAround(c, PI / 6); const r = rOf(c); return 0.5 * integ((t) => r(t) ** 2, a, b); };
        const opt = (k: number, lo: number, hi: number, coef: number) => (c: Ctx) => near(k * integ((t) => coef * Math.sin(3 * t) ** 2, lo, hi), petal(c), 1e-6);
        return [opt(0.5, 0, PI / 3, 4), opt(1, 0, PI / 3, 4), opt(0.5, 0, PI / 6, 4), opt(0.5, 0, PI / 3, 2)];
      })()],
      h: ['Find the two rays on which this petal starts and ends at the pole; those angles are the limits of integration.', 'Read a from the tip of the petal on the numbered circles, then use A = (1/2)∫ r² dθ.'],
      s: 'Read from the figure: the first-quadrant petal reaches the circle numbered 2 along the ray θ = π/6, so a = 2 and r² = 4sin²(3θ); it leaves the pole along the ray θ = 0 and returns to it along θ = π/3. So its area is (1/2)∫ from 0 to π/3 of 4sin²(3θ) dθ (which equals π/3).',
    },
  ]),
];
