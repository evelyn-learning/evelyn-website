/** GreenApple T2 figure items — group "newer-math". Items: see author-t2-figure-items.ts for the rules. */
import { compileExpression } from '../../../src/lib/tutor/practice-figure/expr';
import { Ctx, G, PI, arr, falseOne, fgraph, fOf, knotsOf, near, pgraph, pick, plin, round, S, tgraph, turnsOf, type Item, type P } from './kit';

// ── helpers on the spec of a function graph drawn in pieces ─────────────────

interface Pc { f: (x: number) => number; d0: number; d1: number; from?: string; to?: string }
/** The pieces of a function graph, from the spec's own expressions, domains and end flags. */
const piecesOf = (c: Ctx): Pc[] => arr(c.p.curves).map((k) => {
  const d = (k.domain ?? c.p.xRange) as number[];
  return { f: compileExpression(k.expr as string), d0: d[0], d1: d[1], from: k.from as string | undefined, to: k.to as string | undefined };
});
/** One-sided limit of a piece at x0 (±Infinity when it grows without bound). */
const side = (f: (x: number) => number, x0: number, s: -1 | 1): number => {
  // The piece's own formula is continuous up to its end, so its value there is the one-sided limit — unless it blows up.
  const v = f(x0);
  if (!Number.isFinite(v) || Math.abs(v) > 1e5) return (f(x0 + s * 1e-6) > 0 ? 1 : -1) * Infinity;
  return round(v, 9);
};
/** Left limit, right limit and value of the drawn function at x0 (value undefined when f(x0) is not defined). */
const limsAt = (c: Ctx, x0: number): { L: number; R: number; V?: number; pl: Pc; pr: Pc } => {
  const ps = piecesOf(c);
  const pl = ps.find((p) => p.d0 < x0 - 1e-12 && p.d1 >= x0 - 1e-12);
  const pr = ps.find((p) => p.d0 <= x0 + 1e-12 && p.d1 > x0 + 1e-12);
  if (!pl || !pr) throw new Error(`no piece on both sides of x = ${x0}`);
  let V: number | undefined;
  const dot = arr(c.p.points ?? []).find((k) => near(k.x as number, x0) && k.open !== true);
  if (dot) V = dot.y as number;
  else {
    for (const p of ps) {
      const inside = x0 > p.d0 + 1e-12 && x0 < p.d1 - 1e-12;
      const atEnd = (near(x0, p.d1) && p.to !== 'open') || (near(x0, p.d0) && p.from !== 'open');
      if ((inside || atEnd) && Number.isFinite(p.f(x0))) { V = round(p.f(x0), 6); break; }
    }
  }
  return { L: side(pl.f, x0, -1), R: side(pr.f, x0, 1), V, pl, pr };
};
type Feature = 'infinite' | 'jump' | 'hole' | 'vertical tangent' | 'corner' | 'smooth';
/** What happens to the drawn function at x0, tested in the lesson's order: continuity first, then corner, then vertical tangent. */
const featureAt = (c: Ctx, x0: number): Feature => {
  const { L, R, V, pl, pr } = limsAt(c, x0);
  if (!Number.isFinite(L) || !Number.isFinite(R)) return 'infinite';
  if (Math.abs(L - R) > 1e-6) return 'jump';
  if (V === undefined || Math.abs(V - L) > 1e-6) return 'hole';
  const h = 1e-7;
  const sL = (L - pl.f(x0 - h)) / h;
  const sR = (pr.f(x0 + h) - R) / h;
  if (Math.abs(sL) > 100 || Math.abs(sR) > 100) return 'vertical tangent';
  if (Math.abs(sL - sR) > 1e-3) return 'corner';
  return 'smooth';
};
const continuousAt = (c: Ctx, x0: number): boolean => ['vertical tangent', 'corner', 'smooth'].includes(featureAt(c, x0));
const differentiableAt = (c: Ctx, x0: number): boolean => featureAt(c, x0) === 'smooth';
/** The domain of the drawn function in interval notation, from the pieces' domains and end flags (pieces that meet are joined). */
const mn = (v: number): string => (v < 0 ? `−${-v}` : `${v}`);
const domainText = (c: Ctx): string => {
  const ps = piecesOf(c).sort((a, b) => a.d0 - b.d0);
  const parts: Array<{ a: number; b: number; oa: boolean; ob: boolean }> = [];
  for (const p of ps) {
    const last = parts[parts.length - 1];
    if (last && near(last.b, p.d0) && !(last.ob && p.from === 'open')) { last.b = p.d1; last.ob = p.to === 'open'; continue; }
    parts.push({ a: p.d0, b: p.d1, oa: p.from === 'open', ob: p.to === 'open' });
  }
  return parts.map((q) => `${q.oa ? '(' : '['}${mn(q.a)}, ${mn(q.b)}${q.ob ? ')' : ']'}`).join(' ∪ ');
};
/** Whether v is a value of the drawn function: each piece is monotone (checked), so its values run between its end values, an open end left out. */
const inRange = (c: Ctx, v: number): boolean => piecesOf(c).some((p) => {
  const ys = Array.from({ length: 201 }, (_, i) => p.f(p.d0 + ((p.d1 - p.d0) * i) / 200));
  const up = ys.every((y, i) => i === 0 || y > ys[i - 1]); const down = ys.every((y, i) => i === 0 || y < ys[i - 1]);
  if (!up && !down) throw new Error('a piece is not monotone');
  const y0 = p.f(p.d0); const y1 = p.f(p.d1);
  if (near(v, y0)) return p.from !== 'open';
  if (near(v, y1)) return p.to !== 'open';
  return v > Math.min(y0, y1) && v < Math.max(y0, y1);
});

const BLUE = '#1d4ed8';

export const ITEMS: Item[] = [
  // ── Amplitude from graphs ─────────────────────────────────────────────────
  ...G('gen-048bb219-e08d-428f-9d1e-4836b72fc38a.lo-2', 'Amplitude read in context and compared', [
    {
      t: 'amplitude of a tide wave in context', d: 2, need: 'calc',
      spec: pgraph('Time (h)', 'Water depth (m)', [0, 24], 3, [0, 12], 2, [{ expr: '6 - 4*cos(pi*x/6)' }]),
      alt: 'Two full cycles of a smooth wave of water depth against time over one day, starting and ending at a low point.',
      q: 'The graph shows the depth of water in a harbour over one day, modelled by a cosine wave. What is the amplitude of the wave, in metres?',
      n: '4',
      calc: ['(max − min) ÷ 2 with max and min from curve_extremum', (c) => (c.num('curve_extremum', { curve: 0, which: 'max', want: 'value' }) - c.num('curve_extremum', { curve: 0, which: 'min', want: 'value' })) / 2],
      h: ['Read the greatest depth (high tide) and the least depth (low tide) from the graph.', 'The amplitude is half the distance from the maximum to the minimum.'],
      s: 'Read from the graph: the greatest depth is 10 m and the least depth is 2 m. Amplitude = (max − min) ÷ 2 = (10 − 2) ÷ 2 = 4 m. The midline, 6 m, is not the amplitude.',
    },
    {
      t: 'the false statement about the amplitudes of two waves', d: 3, need: 'reason',
      spec: tgraph([0, 2 * PI], 2, [-5, 5], [{ expr: '2*sin(x) + 2', label: 'P' }, { expr: '3*cos(x) - 1', label: 'Q' }]),
      alt: 'Two waves, P and Q, each over one full cycle, with the horizontal axis marked in multiples of π/2. P lies wholly on or above the x-axis; Q dips well below it.',
      q: 'Two waves, P and Q, are shown. Which statement is FALSE?',
      o: [
        ['P has a greater amplitude than Q', 'correct'],
        ['The amplitude of Q is 3', 'takes the maximum of Q as its amplitude, without using the minimum'],
        ['P reaches a higher maximum than Q', 'misreads the maximum of one of the waves'],
        ['The amplitude of P is 2', 'takes the maximum of P as its amplitude, measuring from the x-axis instead of the midline'],
      ],
      holds: falseOne('amplitude = (max − min) ÷ 2 for each curve, from curve_extremum', (() => {
        const ex = (c: Ctx, curve: number, which: 'max' | 'min') => c.num('curve_extremum', { curve, which, want: 'value' });
        const amp = (c: Ctx, curve: number) => (ex(c, curve, 'max') - ex(c, curve, 'min')) / 2;
        return [(c) => amp(c, 0) > amp(c, 1) + 1e-9, (c) => near(amp(c, 1), 3), (c) => ex(c, 0, 'max') > ex(c, 1, 'max') + 1e-9, (c) => near(amp(c, 0), 2)];
      })()),
      h: ['For each wave, read its maximum and its minimum.', 'Amplitude is half the distance from the maximum to the minimum; a wave that reaches higher need not have the greater amplitude.'],
      s: 'Read from the graph: P has maximum 4 and minimum 0, so its amplitude is (4 − 0) ÷ 2 = 2. Q has maximum 2 and minimum −4, so its amplitude is (2 − (−4)) ÷ 2 = 3. P reaches the higher maximum, but Q has the greater amplitude, so "P has a greater amplitude than Q" is false.',
    },
  ]),

  // ── Period from graphs ────────────────────────────────────────────────────
  ...G('gen-048bb219-e08d-428f-9d1e-4836b72fc38a.lo-4', 'Period from zeros and in context', [
    {
      t: 'period of a part of a wave from two consecutive zeros', d: 3, need: 'calc',
      spec: fgraph({ xRange: [-2, 8], yRange: [-5, 5], curves: [{ expr: '4*sin(pi*x/6)', domain: [-1, 7] }] }),
      alt: 'A short piece of a wave with a dot at each end: it rises through the x-axis, reaches one peak, and falls back through the x-axis before it stops.',
      q: 'Only part of a sine wave is drawn on the grid shown; the midline of the wave is the x-axis. What is the period of the wave?',
      n: '12',
      calc: ['2 × (distance between the two consecutive zeros), zeros from curve_zeros', (c) => { const z = c.txt('curve_zeros', { curve: 0, want: 'all' }).split(',').map(Number); if (z.length !== 2) throw new Error(`zeros ${z}`); return 2 * (z[1] - z[0]); }],
      h: ['Only one peak is drawn, so peak to peak cannot be used. Find where the wave crosses its midline instead.', 'From one midline crossing to the next is half a cycle; double it.'],
      s: 'Read from the graph: the wave crosses its midline (the x-axis) at x = 0 and next at x = 6. Zero to next zero is half a cycle, so the period is 2 × (6 − 0) = 12.',
    },
    {
      t: 'number of turns of a Ferris wheel from the period', d: 3, need: 'calc',
      spec: pgraph('Time (s)', 'Height (m)', [0, 100], 10, [0, 22], 2, [{ expr: '11 - 9*cos(pi*x/20)' }]),
      alt: 'A smooth wave of the height of a seat against time, starting at a low point and rising and falling repeatedly across the grid.',
      q: 'The graph shows the height of a seat on a Ferris wheel that turns at a steady rate; one full turn of the wheel is one period of the graph. How many complete turns does the wheel make in 10 minutes?',
      n: '15',
      calc: ['600 s ÷ period, the period = distance between consecutive maxima of the spec\'s curve (fine scan)', (c) => { const m = turnsOf(fOf(c), 0, 100).filter((t) => t.kind === 'max'); return 600 / (m[1].x - m[0].x); }],
      h: ['Locate one peak, then the next peak; the difference of their times is the period.', 'Change 10 minutes into seconds and divide by the time for one turn.'],
      s: 'Read from the graph: the seat is highest at t = 20 s and next at t = 60 s, so the period is 60 − 20 = 40 s, the time for one turn. 10 minutes = 600 s, and 600 ÷ 40 = 15 complete turns.',
    },
  ]),

  // ── Midline from graphs ───────────────────────────────────────────────────
  ...G('gen-048bb219-e08d-428f-9d1e-4836b72fc38a.lo-6', 'Midline as the constant d and as a shift', [
    {
      t: 'the constant d of y = a·sin(2x) + d', d: 2, need: 'calc',
      spec: tgraph([0, 2 * PI], 4, [-4, 2], [{ expr: '2*sin(2*x) - 1' }]),
      alt: 'A smooth wave over two full cycles, with the horizontal axis marked in multiples of π/4; most of the wave lies below the x-axis.',
      q: 'The graph shown has an equation of the form y = a·sin(2x) + d, with a > 0. What is the value of d?',
      n: '-1',
      calc: ['d = midline = (max + min) ÷ 2 from curve_extremum', (c) => (c.num('curve_extremum', { curve: 0, which: 'max', want: 'value' }) + c.num('curve_extremum', { curve: 0, which: 'min', want: 'value' })) / 2],
      h: ['In y = a·sin(2x) + d, the constant d is the height of the midline.', 'Read the maximum and the minimum and take the value halfway between them.'],
      s: 'Read from the graph: the maximum is 1 and the minimum is −3. The midline is y = (1 + (−3)) ÷ 2 = −1, and d is the height of the midline, so d = −1.',
    },
    {
      t: 'vertical shift that puts the midline on the x-axis', d: 3, need: 'calc',
      spec: fgraph({ xRange: [0, 8], yRange: [-2, 6], curves: [{ expr: '3*cos(pi*x/4) + 2', label: 'f' }] }),
      alt: 'One full cycle of a wave f, starting and ending at a high point, with its low point in the middle of the window; most of the wave lies above the x-axis.',
      q: 'The graph of a wave f is shown. The graph of g(x) = f(x) + c, for a constant c, is the same wave moved up or down so that the midline of g is the x-axis. What is the value of c?',
      n: '-2',
      calc: ['c = −(midline of f) = −(max + min) ÷ 2 from curve_extremum', (c) => -(c.num('curve_extremum', { curve: 0, which: 'max', want: 'value' }) + c.num('curve_extremum', { curve: 0, which: 'min', want: 'value' })) / 2],
      h: ['Find the midline of f first: halfway between its maximum and its minimum.', 'Adding c moves the midline by c; choose c so the midline lands at height 0.'],
      s: 'Read from the graph: f has maximum 5 and minimum −1, so its midline is y = (5 + (−1)) ÷ 2 = 2. Adding c moves the midline to 2 + c, and 2 + c = 0 gives c = −2.',
    },
  ]),

  // ── Feasible regions ──────────────────────────────────────────────────────
  ...G('gen-739c0ae5-de9d-428b-8319-f488ff6c76e5.lo-1', 'Points in the region and the system behind it', [
    {
      t: 'which point satisfies every inequality, boundaries included or not', d: 2, need: 'reason',
      spec: S('shaded_region', { xRange: [-1, 8], yRange: [-1, 6], xStep: 1, yStep: 1, region: { type: 'inequalities', inequalities: [{ a: 1, b: 0, op: '>=', c: 0 }, { a: 0, b: 1, op: '>=', c: 0 }, { a: 1, b: 2, op: '<=', c: 8 }, { a: 1, b: 1, op: '<', c: 6 }] } }),
      alt: 'A shaded four-sided region in the first quadrant, bounded by the two axes, one solid sloping line and one dashed sloping line.',
      q: 'The shaded region in the graph is the feasible region of a system of linear inequalities: a solid boundary is part of the region and a dashed boundary is not. Which of these points satisfies every inequality of the system?',
      o: [
        ['(2, 3)', 'correct'],
        ['(5, 1)', 'counts a point on the dashed boundary as part of the region'],
        ['(1, 4)', 'misreads where the solid boundary runs, taking a point just beyond it'],
        ['(4, 3)', 'picks a point on the wrong side of both sloping boundaries'],
      ],
      holds: ['region_contains for each option point', [[2, 3], [5, 1], [1, 4], [4, 3]].map(([x, y]) => (c: Ctx) => c.txt('region_contains', { x, y }) === 'yes')],
      h: ['A point is a solution only when it lies in the shaded region or on a SOLID part of its boundary.', 'Locate each point on the grid and check which side of each sloping line it falls on, and whether it sits on a dashed line.'],
      s: 'Read from the graph: the solid line passes through (0, 4), (2, 3) and (8, 0); the dashed line through (0, 6), (5, 1) and (6, 0). (2, 3) lies on the solid line, below the dashed one, so it is in the region. (5, 1) lies on the dashed line, which is excluded; (1, 4) and (4, 3) lie outside the shading.',
    },
    {
      t: 'the system of inequalities that a shaded region shows', d: 3, need: 'reason',
      spec: S('shaded_region', { xRange: [-1, 7], yRange: [-2, 6], xStep: 1, yStep: 1, region: { type: 'inequalities', inequalities: [{ a: 1, b: 0, op: '>=', c: 1 }, { a: 1, b: 1, op: '<=', c: 6 }, { a: -1, b: 1, op: '>', c: -2 }] } }),
      alt: 'A shaded triangle bounded by a solid vertical line, a solid line sloping down to the right and a dashed line sloping up to the right.',
      q: 'The shaded region in the graph is the feasible region of a system of linear inequalities: a solid boundary is part of the region and a dashed boundary is not. Which system does the graph show?',
      o: [
        ['x ≥ 1, x + y ≤ 6, y > x − 2', 'correct'],
        ['x ≥ 1, x + y ≤ 6, y ≥ x − 2', 'treats the dashed boundary as included'],
        ['x ≥ 1, x + y ≥ 6, y > x − 2', 'takes the wrong side of the line x + y = 6'],
        ['x ≤ 1, x + y ≤ 6, y > x − 2', 'takes the wrong side of the vertical line x = 1'],
      ],
      holds: ['each option\'s system compared with the spec\'s inequalities at every point of a 0.25 lattice over the plot (boundaries included)', (() => {
        const ok = (op: string, l: number, r: number) => (op === '<' ? l < r - 1e-9 : op === '<=' ? l <= r + 1e-9 : op === '>' ? l > r + 1e-9 : l >= r - 1e-9);
        const same = (sys: (x: number, y: number) => boolean) => (c: Ctx) => {
          const ineqs = arr((c.p.region as P).inequalities);
          for (let x = -1; x <= 7; x += 0.25) for (let y = -2; y <= 6; y += 0.25) {
            const inSpec = ineqs.every((q) => ok(q.op as string, (q.a as number) * x + (q.b as number) * y, q.c as number));
            if (inSpec !== sys(x, y)) return false;
          }
          return true;
        };
        return [
          same((x, y) => x >= 1 && x + y <= 6 && y > x - 2),
          same((x, y) => x >= 1 && x + y <= 6 && y >= x - 2),
          same((x, y) => x >= 1 && x + y >= 6 && y > x - 2),
          same((x, y) => x <= 1 && x + y <= 6 && y > x - 2),
        ];
      })()],
      h: ['Find each boundary line from two grid points it passes through; solid means ≤ or ≥, dashed means < or >.', 'Test a point inside the shading, such as (2, 1), in each inequality to decide which side is shaded.'],
      s: 'Read from the graph: the solid vertical line is x = 1, with the shading to its right, so x ≥ 1. The solid line through (0, 6) and (6, 0) is x + y = 6, with the shading below it, so x + y ≤ 6. The dashed line through (2, 0) and (4, 2) is y = x − 2, with the shading above it and the line excluded, so y > x − 2. The test point (2, 1) satisfies all three.',
    },
  ]),

  // ── Discontinuities that prevent differentiability ────────────────────────
  ...G('gen-7120b2e6-6d44-4830-b3c9-17911a809550.lo-3', 'Breaks of three kinds told from corners', [
    {
      t: 'which points of non-differentiability are discontinuities', d: 3, need: 'reason',
      spec: fgraph({ xRange: [-6, 6], yRange: [-4, 4], curves: [
        { expr: 'x + 4', domain: [-5, -2], from: 'closed', to: 'open', color: BLUE },
        { expr: '-x', domain: [-2, 1], from: 'open', to: 'closed', color: BLUE },
        { expr: '2x - 3', domain: [1, 3], from: 'closed', to: 'open', color: BLUE },
        { expr: '2 - x', domain: [3, 5], from: 'closed', to: 'closed', color: BLUE },
      ], points: [{ x: -2, y: -1 }] }),
      alt: 'A graph made of four straight pieces, with an open circle and a separate filled dot at one x-value and a gap between two pieces at another.',
      q: 'The graph of a function f is shown for −5 ≤ x ≤ 5; f is not differentiable at x = −2, x = 1 and x = 3. At which of these x-values is f not differentiable because f is not continuous there?',
      o: [
        ['x = −2 and x = 3 only', 'correct'],
        ['x = 3 only', 'misses the misplaced point: a hole is a discontinuity too'],
        ['x = 1 only', 'takes the corner, where the graph is unbroken, for a discontinuity'],
        ['x = −2, x = 1 and x = 3', 'takes every point where f is not differentiable to be a break'],
      ],
      holds: pick('the x-values among −2, 1, 3 where the spec\'s pieces are not continuous (left limit, right limit and value compared)', (c) => [-2, 1, 3].filter((x) => !continuousAt(c, x)), [[-2, 3], [3], [1], [-2, 1, 3]]),
      h: ['At each x-value, first check continuity: do the pieces meet, and is the value of f at that x on the curve?', 'A jump or a single misplaced point is a discontinuity; a corner is not.'],
      s: 'Read from the graph: at x = −2 both sides approach 2 but the filled dot puts f(−2) at −1, a hole with a misplaced point, so f is not continuous. At x = 3 the graph jumps from 3 to −1, a jump discontinuity. At x = 1 the pieces meet at (1, −1): f is continuous there and fails only because of a corner. So the answer is x = −2 and x = 3 only.',
    },
    {
      t: 'an infinite discontinuity with a defined value', d: 2, need: 'reason',
      spec: fgraph({ xRange: [-2, 6], yRange: [-4, 6], curves: [{ expr: '1/(x - 2) + 1', label: 'f' }], asymptotes: [{ x: 2 }], points: [{ x: 2, y: 3 }] }),
      alt: 'A curve f in two branches on either side of a dashed vertical guide line, one branch dropping steeply down beside the line and the other shooting steeply up beside it, with a filled dot on the guide line.',
      q: 'The graph of a function f is shown; the filled dot gives the value of f at x = 2. Which statement about f at x = 2 is correct?',
      o: [
        ['f is neither continuous nor differentiable', 'correct'],
        ['f is continuous but not differentiable', 'takes the defined value f(2) to make f continuous'],
        ['f is both continuous and differentiable', 'takes a defined value to be enough for a derivative'],
        ['f is differentiable but not continuous', 'forgets that differentiability needs continuity first'],
      ],
      holds: ['continuity and differentiability at x = 2 from the spec (one-sided limits of the curve, the dot\'s value)', [
        (c) => !continuousAt(c, 2) && !differentiableAt(c, 2),
        (c) => continuousAt(c, 2) && !differentiableAt(c, 2),
        (c) => continuousAt(c, 2) && differentiableAt(c, 2),
        (c) => !continuousAt(c, 2) && differentiableAt(c, 2),
      ]],
      h: ['Check continuity first: do the two sides of the graph approach the same finite height at x = 2?', 'Differentiability requires continuity; a vertical asymptote is an infinite discontinuity.'],
      s: 'Read from the graph: as x approaches 2 from the left the curve falls without bound, and from the right it rises without bound; the line x = 2 is a vertical asymptote. Having a dot at f(2) = 3 does not help: the limit does not exist, so f is not continuous at x = 2, and therefore not differentiable there either.',
    },
  ]),

  // ── Differentiability analysed systematically ─────────────────────────────
  ...G('gen-7120b2e6-6d44-4830-b3c9-17911a809550.lo-4', 'The three tests applied in order', [
    {
      t: 'the reason at each of three points, in the lesson\'s order of tests', d: 3, need: 'reason',
      spec: fgraph({ xRange: [-5, 5], yRange: [-2, 4], curves: [
        { expr: '-x - 3', domain: [-5, -3], color: BLUE },
        { expr: '2 - sqrt(1 - x)', domain: [-3, 1], color: BLUE },
        { expr: '2 + sqrt(x - 1)', domain: [1, 2], to: 'closed', color: BLUE },
        { expr: 'x - 3', domain: [2, 5], from: 'open', color: BLUE },
      ] }),
      alt: 'A graph made of four pieces: a straight piece on the left, a curved rising piece, a short steep curved piece, and a straight piece on the right that starts with an open circle.',
      q: 'The graph of a function f is shown for −5 ≤ x ≤ 5; f is not differentiable at x = −3, x = 1 and x = 2. Which list gives the reason at x = −3, x = 1 and x = 2, in that order?',
      o: [
        ['corner, vertical tangent, jump', 'correct'],
        ['vertical tangent, corner, jump', 'exchanges the corner and the vertical tangent'],
        ['corner, jump, vertical tangent', 'takes the steep rise at x = 1 for a break'],
        ['corner, vertical tangent, hole', 'takes the gap between two pieces for a single missing point'],
      ],
      holds: pick('featureAt on the spec\'s pieces at x = −3, 1, 2 (continuity, then one-sided slopes)', (c) => [-3, 1, 2].map((x) => featureAt(c, x)).join(', '), ['corner, vertical tangent, jump', 'vertical tangent, corner, jump', 'corner, jump, vertical tangent', 'corner, vertical tangent, hole']),
      h: ['Test each x-value in order: is f continuous there? If so, do the slopes on the two sides match? If so, is the tangent vertical?', 'A jump and a hole differ: at a hole both sides approach the same height.'],
      s: 'Read from the graph: at x = −3 the pieces meet at (−3, 0), but the line falls to the left while the curve rises to the right: a corner. At x = 1 the graph is unbroken at (1, 2), but it rises straight up there: a vertical tangent. At x = 2 the graph leaps from 3 down to −1: a jump. So: corner, vertical tangent, jump.',
    },
    {
      t: 'the false statement about an absolute-value graph', d: 2, need: 'reason',
      spec: fgraph({ xRange: [-4, 4], yRange: [-1, 6], curves: [{ expr: 'abs(x^2 - 4)', label: 'f' }] }),
      alt: 'A curve f that comes down to touch the x-axis at two points, with a rounded arch between them and both outer arms leaving the grid through the top.',
      q: 'The graph of a function f is shown. Which statement about f is FALSE?',
      o: [
        ['f is differentiable at x = −2', 'correct'],
        ['f is continuous at x = 2', 'takes a corner for a break in the graph'],
        ['f is differentiable at x = 0', 'takes the rounded top of the arch for a corner'],
        ['f is not differentiable at x = 2', 'forgets that a corner prevents a derivative'],
      ],
      holds: falseOne('continuity and differentiability from the spec\'s curve (one-sided slopes)', [
        (c) => differentiableAt(c, -2),
        (c) => continuousAt(c, 2),
        (c) => differentiableAt(c, 0),
        (c) => !differentiableAt(c, 2),
      ]),
      h: ['First check where the graph is unbroken, then look for points where the slopes on the two sides do not match.', 'A smooth rounded turning point has a horizontal tangent; a sharp turn does not have one tangent at all.'],
      s: 'Read from the graph: f is unbroken everywhere. At x = −2 and x = 2 the graph meets the x-axis in a sharp corner, so f is continuous but not differentiable there. At x = 0 the arch is rounded, with a horizontal tangent, so f is differentiable there. The false statement is "f is differentiable at x = −2".',
    },
  ]),

  // ── f from the graph of f′ ────────────────────────────────────────────────
  ...G('gen-308a36ab-a61c-4343-a33b-3722d34f4f34.lo-5', 'The graph of f told from the graph of f′', [
    {
      t: 'local minimum of f read from the graph of f′', d: 2, need: 'reason',
      spec: fgraph({ xRange: [-3, 4], yRange: [-3, 5], curves: [{ expr: 'x^2 - x - 2', label: 'f′' }] }),
      alt: 'A U-shaped curve labelled f′ that crosses the x-axis twice, with its lowest point below the x-axis between the crossings.',
      q: 'The graph shown is the graph of y = f′(x), the derivative of a function f; it is not the graph of f. At what value of x does f have a local minimum?',
      offGridOk: 'only the zeros of f′ (x = −1 and x = 2, on gridlines) and the sign of f′ between them are read; the height of the lowest point of f′ plays no part',
      n: '2',
      calc: ['the zero of f′ (curve_zeros) at which f′ changes from negative to positive', (c) => {
        const f = fOf(c); const z = c.txt('curve_zeros', { curve: 0, want: 'all' }).split(',').map(Number).filter((x) => f(x - 0.01) < 0 && f(x + 0.01) > 0);
        if (z.length !== 1) throw new Error(`minima at ${z}`); return z[0];
      }],
      h: ['f is decreasing where f′ is below the x-axis and increasing where f′ is above it.', 'A local minimum of f is where f′ changes from negative to positive.'],
      s: 'Read from the graph: f′ crosses the x-axis at x = −1 and x = 2. f′ is negative between them and positive to the right of 2, so f falls and then rises: f has a local minimum at x = 2. At x = −1, f′ changes from positive to negative, which gives a local maximum.',
    },
    {
      t: 'inflection points of f from where f′ turns', d: 3, need: 'reason',
      spec: fgraph({ xRange: [-4, 4], yRange: [-3, 3], curves: plin([[-4, 2], [-2, -2], [1, 1], [4, -2]]).map((k, i) => (i === 0 ? { ...k, label: 'f′' } : k)) }),
      alt: 'A graph labelled f′ made of three straight segments: down, then up, then down again, crossing the x-axis three times.',
      q: 'The graph shown is the graph of y = f′(x), the derivative of a function f, for −4 ≤ x ≤ 4. At which values of x does the graph of f have an inflection point?',
      o: [
        ['x = −2 and x = 1', 'correct'],
        ['x = −3, x = 0 and x = 2', 'gives the zeros of f′, where f has its local extrema'],
        ['x = −3 and x = 2', 'gives the local maxima of f'],
        ['x = 0 only', 'gives the local minimum of f'],
      ],
      holds: pick('the knots of the spec\'s f′ at which its slope changes sign (f′ turns from decreasing to increasing or back)', (c) => {
        const ps = piecesOf(c); const slope = (p: Pc) => (p.f(p.d1) - p.f(p.d0)) / (p.d1 - p.d0);
        return knotsOf(c).filter((x) => { const l = ps.find((p) => near(p.d1, x)); const r = ps.find((p) => near(p.d0, x)); return !!l && !!r && slope(l) * slope(r) < 0; });
      }, [[-2, 1], [-3, 0, 2], [-3, 2], [0]]),
      h: ['f″ is the slope of f′: f is concave up where f′ is increasing and concave down where f′ is decreasing.', 'An inflection point of f is where f′ changes from increasing to decreasing, or the other way round — not where f′ is zero.'],
      s: 'Read from the graph: f′ decreases on (−4, −2), increases on (−2, 1) and decreases on (1, 4). So f is concave down, then concave up, then concave down again, and its concavity changes at x = −2 and x = 1: those are the inflection points. The zeros of f′ at −3, 0 and 2 are where f has local extrema.',
    },
  ]),

  // ── Domain and range from a graph ─────────────────────────────────────────
  ...G('gen-61afb8a2-e9b4-419e-881e-64aaac359d87.lo-5', 'Domains with gaps, ranges with open ends', [
    {
      t: 'domain of a function in two pieces with a gap', d: 2, need: 'reason',
      spec: fgraph({ xRange: [-6, 6], yRange: [-2, 4], curves: [
        { expr: '-x - 2', domain: [-5, -2], from: 'closed', to: 'closed', color: BLUE },
        { expr: '(x - 2)^2 - 1', domain: [0, 4], from: 'open', to: 'closed', color: BLUE },
      ] }),
      alt: 'The whole graph of a function in two separate pieces: a straight segment with a filled dot at each end, and a U-shaped piece that starts with an open circle and ends with a filled dot.',
      q: 'The graph shows the whole of a function f. Which is the domain of f?',
      o: [
        ['[−5, −2] ∪ (0, 4]', 'correct'],
        ['[−5, 4]', 'ignores the gap between the two pieces'],
        ['[−5, −2) ∪ [0, 4]', 'reads the open and the filled ends the wrong way round'],
        ['[−1, 3]', 'gives the range, the vertical extent, instead of the domain'],
      ],
      holds: pick('the domain from the spec\'s pieces and end flags, in interval notation', (c) => domainText(c), ['[−5, −2] ∪ (0, 4]', '[−5, 4]', '[−5, −2) ∪ [0, 4]', '[−1, 3]']),
      h: ['The domain is the horizontal extent of the graph: the x-values that have a point above or below them.', 'A filled dot includes its x-value; an open circle leaves it out; a gap leaves out a whole stretch.'],
      s: 'Read from the graph: the first piece runs from x = −5 to x = −2, with filled dots at both ends, giving [−5, −2]. Nothing is drawn between x = −2 and x = 0. The second piece starts with an open circle at x = 0 and ends with a filled dot at x = 4, giving (0, 4]. Domain: [−5, −2] ∪ (0, 4].',
    },
    {
      t: 'the value missing from a range with open ends', d: 3, need: 'reason',
      spec: fgraph({ xRange: [-4, 5], yRange: [-3, 4], curves: [
        { expr: 'x + 1', domain: [-3, 1], from: 'closed', to: 'open', color: BLUE },
        { expr: '4 - x', domain: [1, 4], from: 'open', to: 'closed', color: BLUE },
      ] }),
      alt: 'The whole graph of a function in two straight pieces that end on either side of the same x-value at different heights, each with an open circle there; the outer ends carry filled dots.',
      q: 'The graph shows the whole of a function f. Which of these values is NOT in the range of f?',
      o: [
        ['3', 'correct'],
        ['2', 'takes the open circle at height 2 to remove 2, though the other piece reaches that height'],
        ['−2', 'takes the filled end of the graph to be left out'],
        ['2.5', 'thinks the heights between the two open circles are not reached'],
      ],
      holds: ['each option value tested against the values of the spec\'s pieces (monotone pieces, open ends left out); an option answers when its value is not reached', [3, 2, -2, 2.5].map((v) => (c: Ctx) => !inRange(c, v))],
      h: ['The range is the vertical extent: every height that some point of the graph reaches.', 'An open circle leaves out its height only if no other point of the graph has that height.'],
      s: 'Read from the graph: the left piece reaches every height from −2 (filled dot) up to, but not including, 2 (open circle). The right piece reaches every height from 0 (filled dot at x = 4) up to, but not including, 3 (open circle at x = 1). Height 2 is reached by the right piece at x = 2, and 2.5 at x = 1.5, but no point has height 3. Range [−2, 3); 3 is not in it.',
    },
  ]),

  // ── Two-sided limits from a graph ─────────────────────────────────────────
  ...G('gen-9f2a3bed-994b-4679-91d1-1092cccf4dc7.lo-3', 'Limits at a jump and a hole, and worked back', [
    {
      t: 'the false statement about limits at a jump and at a hole', d: 3, need: 'reason',
      spec: fgraph({ xRange: [-5, 6], yRange: [-3, 4], curves: [
        { expr: 'x + 2', domain: [-4, 1], from: 'closed', to: 'closed', color: BLUE },
        { expr: '0.5*(x - 3)^2 - 1', domain: [1, 3], from: 'open', to: 'open', color: BLUE },
        { expr: '0.5*(x - 3)^2 - 1', domain: [3, 5], from: 'open', to: 'closed', color: BLUE },
      ], points: [{ x: 3, y: 2 }] }),
      alt: 'A graph made of a straight segment and a curved U-shaped piece; there are open circles where the pieces part and at the bottom of the U, and a separate filled dot above the bottom of the U.',
      q: 'The graph of a function f is shown. Which statement is FALSE?',
      o: [
        ['The limit of f(x) as x approaches 1 is 3', 'correct'],
        ['The limit of f(x) as x approaches 3 is −1', 'takes the filled dot, the value f(3), for the limit'],
        ['f(3) is not equal to the limit of f(x) as x approaches 3', 'takes the value of f at x = 3 for its limit'],
        ['The limit of f(x) as x approaches −2 is 0', 'misreads the height of the line at x = −2'],
      ],
      holds: falseOne('one-sided limits and values of the spec\'s pieces and dot', [
        (c) => { const { L, R } = limsAt(c, 1); return near(L, R) && near(L, 3); },
        (c) => { const { L, R } = limsAt(c, 3); return near(L, R) && near(L, -1); },
        (c) => { const { L, R, V } = limsAt(c, 3); return near(L, R) && V !== undefined && !near(V, L); },
        (c) => { const { L, R } = limsAt(c, -2); return near(L, R) && near(L, 0); },
      ]),
      h: ['For each statement, trace the curve toward the x-value from the left and from the right.', 'A two-sided limit exists only when both sides approach the same height; the value of f at the point does not matter.'],
      s: 'Read from the graph: at x = 1 the line approaches 3 from the left but the curve approaches 1 from the right, so the limit does not exist and the statement that it is 3 is false. At x = 3 both sides approach −1, so the limit is −1, while the dot gives f(3) = 2. At x = −2 the line passes through height 0.',
    },
    {
      t: 'the x-value where the limit is 3 but the value is not', d: 3, need: 'calc',
      spec: fgraph({ xRange: [-2, 4], yRange: [-2, 5], curves: [
        { expr: '4 - (x - 1)^2', domain: [-2, 2], from: 'none', to: 'open', color: BLUE },
        { expr: '4 - (x - 1)^2', domain: [2, 4], from: 'open', to: 'none', color: BLUE },
      ], points: [{ x: 2, y: -1 }] }),
      alt: 'An upside-down U-shaped curve with one open circle on its right-hand side and a separate filled dot lower down, below the x-axis.',
      q: 'The graph of a function f is shown. For one value a, the limit of f(x) as x approaches a is 3 but f(a) is not 3. What is a?',
      n: '2',
      calc: ['the gridline x-values where both one-sided limits of the spec\'s pieces equal 3 and the value of f is not 3', (c) => {
        const a = [-1, 0, 1, 2, 3].filter((x) => { const { L, R, V } = limsAt(c, x); return near(L, 3) && near(R, 3) && !(V !== undefined && near(V, 3)); });
        if (a.length !== 1) throw new Error(`a = ${a}`); return a[0];
      }],
      h: ['Find every x-value at which the curve approaches height 3 from both sides.', 'Then check the value of f at each of them: a filled dot elsewhere gives the value, not the curve.'],
      s: 'Read from the graph: the curve reaches height 3 at x = 0 and approaches height 3 at x = 2. At x = 0 the curve is unbroken, so f(0) = 3 as well. At x = 2 there is an open circle at height 3 and the filled dot gives f(2) = −1. So the limit is 3 but f(a) ≠ 3 only at a = 2.',
    },
  ]),
];
