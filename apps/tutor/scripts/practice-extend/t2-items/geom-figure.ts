/** GreenApple T2 figure items — group "geom-figure". Items: see author-t2-figure-items.ts for the rules. */
import { G, S, arr, falseOne, near, round, type Ctx, type Item, type P, type Spec } from './kit';

// ── spec helpers ────────────────────────────────────────────────────────────

const circle = (params: P): Spec => S('geometric_figure', { shape: 'circle', ...params });
const deg = (d: number): number => (d * Math.PI) / 180;
/** A quadrilateral from its true points (side i runs from vertex i to vertex i + 1). */
const quad = (points: number[][], vertices: string[], angleLabels: Array<string | null>): Spec =>
  S('geometric_figure', { shape: 'polygon', points, vertices, angleLabels });
/** Whether sides i and j of the polygon in the spec are parallel (from its points). */
const sidesParallel = (c: Ctx, i: number, j: number): boolean => {
  const pts = c.p.points as number[][]; const n = pts.length;
  const d = (k: number) => [pts[(k + 1) % n][0] - pts[k][0], pts[(k + 1) % n][1] - pts[k][1]];
  const u = d(i); const w = d(j);
  return Math.abs(u[0] * w[1] - u[1] * w[0]) <= 1e-9 * Math.hypot(u[0], u[1]) * Math.hypot(w[0], w[1]);
};
/** Two parallels cut by a transversal rising to the right at `angle`°; positions 1–4 round the upper crossing
 *  (1 upper left, 2 upper right, 3 lower left, 4 lower right), 5–8 the same round the lower crossing. */
const par = (angle: number, labels: Record<number, string>, lineNames: [string, string, string]): Spec =>
  S('geometric_figure', { shape: 'parallel_lines', angle, labels, lineNames });

/** The true size of the angle at a parallel-lines position (figure-core checker). */
const pos = (c: Ctx, position: number): number => c.num('geo_angle', { position });
/** The position (1–8) whose printed label is `label`, from the spec. */
const posOf = (c: Ctx, label: string): number => {
  const hit = Object.entries(c.p.labels as Record<string, string>).find(([, v]) => v === label);
  if (!hit) throw new Error(`no angle is labelled ${label}`);
  return Number(hit[0]);
};
/** Where a position sits: which crossing, above or below its line, left or right of the transversal, between the parallels or not. */
const place = (p: number) => {
  const crossing = p <= 4 ? 0 : 1;
  const local = ((p - 1) % 4) + 1;
  const above = local <= 2;
  const left = local % 2 === 1;
  const interior = crossing === 0 ? !above : above;
  return { crossing, above, left, interior };
};
const altExterior = (a: number, b: number): boolean => { const x = place(a); const y = place(b); return x.crossing !== y.crossing && !x.interior && !y.interior && x.left !== y.left; };
/** Two angles at ONE crossing that are opposite each other (no shared side). */
const vertical = (a: number, b: number): boolean => { const x = place(a); const y = place(b); return x.crossing === y.crossing && x.above !== y.above && x.left !== y.left; };

/** Circle points, from the spec. */
const cpt = (c: Ctx, name: string): { at: number; xy: [number, number] } => {
  const q = arr(c.p.points).find((k) => k.name === name);
  if (!q) throw new Error(`no point ${name}`);
  const r = c.p.radius as number; const t = ((q.at as number) * Math.PI) / 180;
  return { at: q.at as number, xy: [r * Math.cos(t), r * Math.sin(t)] };
};
/** The angle at vertex v between the rays to a and b, from coordinates ('O' = the centre). */
const angAt = (c: Ctx, v: string, a: string, b: string): number => {
  const xy = (n: string): [number, number] => (n === 'O' ? [0, 0] : cpt(c, n).xy);
  const V = xy(v); const A = xy(a); const B = xy(b);
  const u = [A[0] - V[0], A[1] - V[1]]; const w = [B[0] - V[0], B[1] - V[1]];
  return (Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(w[0], w[1]))) * 180) / Math.PI;
};
/** Counter-clockwise sweep in degrees from one circle point to another. */
const sweep = (c: Ctx, from: string, to: string): number => ((((cpt(c, to).at - cpt(c, from).at) % 360) + 360) % 360) || 360;

export const ITEMS: Item[] = [
  // ── Parallel lines & transversals ─────────────────────────────────────────
  ...G('geom.parallel-lines-transversals', 'Angle chases on a drawn pair of parallels and a transversal', [
    {
      t: 'two-hop chase from one marked angle to an unmarked one', d: 2, need: 'calc',
      spec: par(58, { 2: 'auto', 5: '?' }, ['m', 'n', 't']),
      alt: 'Parallel lines m (upper) and n (lower) cut by transversal t. One angle at the crossing with m, above m and right of t, carries its measure; the angle above n and left of t is marked with a question mark.',
      q: 'Lines m and n are parallel and are cut by transversal t. One angle at the crossing with m is marked with its measure. What is the measure, in degrees, of the angle marked ? at the crossing with n?',
      n: '122',
      ck: ['geo_angle', { position: 5 }],
      h: ['First hop across the transversal: find the angle at the crossing with n that sits in the same position as the marked angle.', 'Then compare that angle with the one marked ?: they lie side by side along line n, so use the linear-pair relationship.'],
      s: 'Read from the figure: the angle above m and to the right of t measures 58°, and the angle marked ? is above n and to the left of t. The angle above n and to the right of t corresponds to the 58° angle, so it is 58° (corresponding angles, m ∥ n). It forms a linear pair with the angle marked ?, so ? = 180° − 58° = 122° (linear pair).',
    },
    {
      t: 'classify a labelled pair, solve for x, then carry to a third angle', d: 3, need: 'calc',
      spec: par(104, { 3: '(3x − 1)°', 5: '(2x + 6)°', 2: '?' }, ['m', 'n', 't']),
      alt: 'Parallel lines m (upper) and n (lower) cut by transversal t. Two angles are labelled with expressions in x: one below m left of t, one above n left of t. The angle above m and right of t is marked with a question mark.',
      q: 'Lines m and n are parallel and are cut by transversal t. Two angles in the figure are labelled with expressions in x. What is the measure, in degrees, of the angle marked ?',
      n: '104',
      calc: ['same-side interior (positions 3 and 5): (2x + 6) + (3x − 1) = 180 → x from the spec\'s true angle at 3; both labels checked against the true angles; the key is the true angle at position 2', (c) => {
        const x = (pos(c, 3) + 1) / 3;
        if (!near(2 * x + 6, pos(c, 5)) || !near(2 * x + 6 + 3 * x - 1, 180)) throw new Error('labels do not fit the drawn angles');
        return pos(c, 2);
      }],
      h: ['Decide where the two labelled angles sit — between the parallels or outside, and on which side of t — and write the equation that placement gives.', 'Solve for x and substitute back; then move that measure to the marked angle with a vertical-angle or corresponding-angle step.'],
      s: 'Read from the figure: (3x − 1)° is below m and left of t, (2x + 6)° is above n and left of t — both between the parallels on the same side of t, so they are same-side interior angles and are supplementary: 2x + 6 + 3x − 1 = 180, 5x = 175, x = 35. Then 2x + 6 = 76° and 3x − 1 = 104°. The angle marked ? (above m, right of t) is vertical to the 104° angle below m left of t, so it measures 104°.',
    },
    {
      t: 'name the alternate exterior pair among numbered angles', d: 2, need: 'reason',
      spec: par(52, { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8' }, ['m', 'n', 't']),
      hide: ['1', '2', '3', '4', '5', '6', '7', '8'],
      alt: 'Parallel lines m (upper) and n (lower) cut by transversal t, with each of the eight angles at the two crossings marked with its own number.',
      q: 'Lines m and n are parallel and are cut by transversal t, and the eight angles are numbered. Which pair of numbered angles is a pair of alternate exterior angles?',
      o: [
        ['∠1 and ∠8', 'correct'],
        ['∠1 and ∠5', 'corresponding angles — the same position at each crossing, one interior and one exterior'],
        ['∠3 and ∠6', 'alternate interior angles — both lie between the parallels'],
        ['∠2 and ∠8', 'both exterior, but on the SAME side of t, not on opposite sides'],
      ],
      holds: ['each option\'s angles are found by their printed labels in the spec; a pair is alternate exterior when the two lie at different crossings, both outside the parallels, on opposite sides of t', [
        (c) => altExterior(posOf(c, '1'), posOf(c, '8')),
        (c) => altExterior(posOf(c, '1'), posOf(c, '5')),
        (c) => altExterior(posOf(c, '3'), posOf(c, '6')),
        (c) => altExterior(posOf(c, '2'), posOf(c, '8')),
      ]],
      h: ['Exterior angles lie outside the region between m and n; pick out the four of them first.', 'Alternate means on opposite sides of t, one at each crossing.'],
      s: 'Read from the figure: ∠1 and ∠2 are above m and ∠7 and ∠8 are below n, so these four are the exterior angles. ∠1 is above m to the left of t; ∠8 is below n to the right of t — one at each crossing, opposite sides of t, both exterior: alternate exterior angles. ∠2 and ∠8 are both right of t (same side); ∠1 and ∠5 are corresponding; ∠3 and ∠6 are alternate interior.',
    },
  ]),

  // ── Proving lines parallel ────────────────────────────────────────────────
  // The parallel_lines shape always prints parallel chevrons (the lines are GIVEN parallel), so a figure for the
  // converse direction is a quadrilateral or a triangle cut by a segment, where nothing marks a pair of sides parallel.
  ...G('geom.proving-lines-parallel', 'The angle or value that certifies two drawn sides parallel', [
    {
      t: 'measure the second angle must have to certify two sides parallel', d: 2, need: 'calc',
      spec: quad([[-5 * Math.cos(deg(64)), 5 * Math.sin(deg(64))], [7, 5 * Math.sin(deg(64))], [10, 0], [0, 0]], ['P', 'Q', 'R', 'S'], ['auto', null, null, '?']),
      alt: 'Quadrilateral PQRS with P at the upper left, Q at the upper right, R at the lower right and S at the lower left. The angle at P carries its measure and the angle at S is marked with a question mark.',
      q: 'In quadrilateral PQRS shown, the angle at P is marked with its measure. What must m∠S be, in degrees, for side PQ to be parallel to side SR?',
      n: '116',
      calc: ['the drawn quadrilateral has PQ ∥ SR (checked on the spec\'s points); the key is its true angle at S', (c) => {
        if (!sidesParallel(c, 0, 2)) throw new Error('PQ is not drawn parallel to SR');
        return round(c.num('geo_angle', { vertex: 3 }), 6);
      }],
      h: ['Name the transversal first: which side of the quadrilateral joins the two sides you want parallel, and holds both angle vertices?', 'Classify ∠P and ∠S as a pair along that transversal, then decide whether its converse wants them congruent or supplementary.'],
      s: 'Read from the figure: ∠P measures 64° and the angle at S is the unknown. Side PS joins P (on PQ) to S (on SR), so PS is the transversal of lines PQ and SR, and ∠P and ∠S are both between those lines on the same side of PS — same-side interior angles. By the Converse of the Same-Side Interior Angles Theorem, PQ ∥ SR when they are supplementary: m∠S = 180° − 64° = 116°.',
    },
    {
      t: 'which pair of opposite sides the four angles certify parallel', d: 3, need: 'reason',
      spec: quad([[5 * Math.cos(deg(70)), 5 * Math.sin(deg(70))], [9 + (5 * Math.sin(deg(70)) / Math.sin(deg(75))) * Math.cos(deg(75)), 5 * Math.sin(deg(70))], [9, 0], [0, 0]], ['J', 'K', 'L', 'M'], ['auto', 'auto', 'auto', 'auto']),
      alt: 'Quadrilateral JKLM with J at the upper left, K at the upper right, L at the lower right and M at the lower left; each of its four angles carries its measure.',
      q: 'In quadrilateral JKLM shown, all four angles are marked with their measures. Which conclusion about its sides do the angle measures prove?',
      o: [
        ['JK ∥ ML only', 'correct'],
        ['JM ∥ KL only', 'pairs the angles along the wrong transversal — ∠J and ∠K are not supplementary'],
        ['JK ∥ ML and JM ∥ KL', 'assumes one supplementary pair makes both pairs of sides parallel'],
        ['Neither pair', 'looks for congruent angles — same-side interior angles need to be supplementary, not equal'],
      ],
      holds: ['parallel sides tested on the spec\'s points (side 0 = JK, 1 = KL, 2 = LM, 3 = MJ); the angle labels are the drawn angles', [
        (c) => sidesParallel(c, 0, 2) && !sidesParallel(c, 1, 3),
        (c) => !sidesParallel(c, 0, 2) && sidesParallel(c, 1, 3),
        (c) => sidesParallel(c, 0, 2) && sidesParallel(c, 1, 3),
        (c) => !sidesParallel(c, 0, 2) && !sidesParallel(c, 1, 3),
      ]],
      h: ['For each pair of opposite sides, the transversal is a side that joins them; the two angles on that transversal are same-side interior angles.', 'Add each such pair of angles: the converse needs a sum of exactly 180°.'],
      s: 'Read from the figure: ∠J = 110°, ∠K = 75°, ∠L = 105°, ∠M = 70°. For JK and ML, the transversal JM gives same-side interior angles ∠J and ∠M: 110° + 70° = 180°, supplementary, so JK ∥ ML (Converse of the Same-Side Interior Angles Theorem). For JM and KL, the transversal JK gives ∠J and ∠K: 110° + 75° = 185° ≠ 180°, so JM and KL are not parallel. Only JK ∥ ML.',
    },
    {
      t: 'value of x that makes the leg angles of a quadrilateral certify parallel', d: 2, need: 'calc',
      spec: quad([[2, 5 * Math.sin(deg(97))], [10 + 5 * Math.cos(deg(97)), 5 * Math.sin(deg(97))], [10, 0], [0, 0]], ['W', 'X', 'Y', 'Z'], [null, '(4x + 5)°', '(3x + 14)°', null]),
      alt: 'Quadrilateral WXYZ with W at the upper left, X at the upper right, Y at the lower right and Z at the lower left. The angles at X and at Y, the two ends of side XY, are labelled with expressions in x.',
      q: 'In quadrilateral WXYZ shown, the angles at X and Y are labelled with expressions in x. What value of x makes side WX parallel to side ZY?',
      n: '23',
      calc: ['∠X and ∠Y are same-side interior along transversal XY: (4x + 5) + (3x + 14) = 180; x from the drawn angle at X (the figure is drawn with WX ∥ ZY, checked on its points), the other label checked at Y', (c) => {
        if (!sidesParallel(c, 0, 2)) throw new Error('WX is not drawn parallel to ZY');
        const x = (c.num('geo_angle', { vertex: 1 }) - 5) / 4;
        if (!near(3 * x + 14, c.num('geo_angle', { vertex: 2 })) || !near(4 * x + 5 + 3 * x + 14, 180)) throw new Error('labels do not fit');
        return round(x, 6);
      }],
      h: ['Name the transversal first: the side of the quadrilateral that contains both labelled vertices.', 'Classify the two angles along it, then choose the equation — equal expressions, or a sum of 180.'],
      s: 'Read from the figure: (4x + 5)° is the angle at X and (3x + 14)° the angle at Y. Side XY joins WX to ZY, so it is the transversal, and the two angles lie between WX and ZY on the same side of XY — same-side interior angles. By the Converse of the Same-Side Interior Angles Theorem, WX ∥ ZY when they are supplementary: 4x + 5 + 3x + 14 = 180, 7x = 161, x = 23 (the angles are then 97° and 83°).',
    },
  ]),

  // ── Central & inscribed angles ────────────────────────────────────────────
  ...G('geom.central-inscribed-angles', 'Inscribed and central angles read off a drawn circle', [
    {
      t: 'central angle from the inscribed angle on the same arc', d: 2, need: 'calc',
      spec: circle({ radius: 5, points: [{ name: 'P', at: 232 }, { name: 'Q', at: 308 }, { name: 'R', at: 90 }], radii: [{ to: 'P' }, { to: 'Q' }], chords: [{ from: 'R', to: 'P' }, { from: 'R', to: 'Q' }], angles: [{ vertex: 'R', from: 'P', to: 'Q', label: 'auto' }, { vertex: 'center', from: 'P', to: 'Q', label: '?' }] }),
      alt: 'Circle O with P and Q on the lower part of the circle and R at the top. Chords RP and RQ form an inscribed angle at R, which carries its measure; radii OP and OQ form a central angle marked with a question mark.',
      q: 'In the circle O shown, the inscribed angle ∠PRQ is marked with its measure. What is the measure, in degrees, of the central angle ∠POQ, marked ?',
      n: '76',
      ck: ['geo_angle', { angle: 1 }],
      h: ['Both angles open onto the same arc PQ: find that arc from the inscribed angle first.', 'Going from an inscribed angle to its arc you double; a central angle equals its arc.'],
      s: 'Read from the figure: the inscribed angle ∠PRQ measures 38°, and R lies on the major arc, so ∠PRQ intercepts minor arc PQ. An inscribed angle is half its intercepted arc, so arc PQ = 2 × 38° = 76°. The central angle ∠POQ cuts off the same arc and equals it: m∠POQ = 76°.',
    },
    {
      t: 'angle at the end of a diameter from a central angle', d: 3, need: 'calc',
      spec: circle({ radius: 5, points: [{ name: 'P', at: 180 }, { name: 'Q', at: 0 }, { name: 'R', at: 64 }], radii: [{ to: 'R' }], chords: [{ from: 'P', to: 'Q' }, { from: 'P', to: 'R' }, { from: 'R', to: 'Q' }], angles: [{ vertex: 'center', from: 'Q', to: 'R', label: 'auto' }, { vertex: 'Q', from: 'P', to: 'R', label: '?' }] }),
      alt: 'Circle O with diameter PQ drawn horizontally and point R on the upper half. Chords PR and RQ form triangle PRQ, and radius OR is drawn; the central angle between OQ and OR carries its measure, and the angle of the triangle at Q is marked with a question mark.',
      q: 'In the circle O shown, PQ is a diameter and the central angle ∠QOR is marked with its measure. What is the measure, in degrees, of ∠PQR, marked ?',
      n: '58',
      ck: ['geo_angle', { angle: 1 }],
      h: ['Find the arc that ∠PQR intercepts: it runs from P to R the way that does not pass through Q, and PQ cuts the circle into two semicircles.', 'An inscribed angle is half its intercepted arc (or: the angle at R is inscribed in a semicircle — use the triangle).'],
      s: 'Read from the figure: PQ is a diameter and the central angle ∠QOR measures 64°, so arc QR = 64°. Arc PR (not containing Q) is the rest of the semicircle: 180° − 64° = 116°. ∠PQR is inscribed and intercepts arc PR, so m∠PQR = ½ × 116° = 58°. (Check: ∠PRQ = 90° by the semicircle corollary and ∠RPQ = ½ × 64° = 32°, and 90 + 32 + 58 = 180.)',
    },
    {
      t: 'which statement is false about angles on one arc', d: 2, need: 'reason',
      spec: circle({ radius: 5, points: [{ name: 'P', at: 150 }, { name: 'Q', at: 30 }, { name: 'R', at: 288 }, { name: 'S', at: 252 }], radii: [{ to: 'P' }, { to: 'Q' }], chords: [{ from: 'R', to: 'P' }, { from: 'R', to: 'Q' }, { from: 'S', to: 'P' }, { from: 'S', to: 'Q' }], angles: [{ vertex: 'center', from: 'Q', to: 'P', label: 'auto' }] }),
      alt: 'Circle O with P and Q on the upper part of the circle and R and S on the lower part. Radii OP and OQ form a central angle that carries its measure; chords from R and from S to P and Q form two inscribed angles.',
      q: 'In the circle O shown, points P, Q, R and S lie on the circle and the central angle ∠POQ is marked with its measure. Which statement is FALSE?',
      o: [
        ['m∠PRQ = m∠POQ', 'correct'],
        ['m∠PRQ = 60°', 'true: an inscribed angle is half of its 120° arc'],
        ['m∠PRQ = m∠PSQ', 'true: both inscribed angles intercept the same arc PQ'],
        ['minor arc PQ = 120°', 'true: a central angle equals its arc'],
      ],
      holds: falseOne('each statement is tested on the angles and arc computed from the spec\'s point positions', [
        (c) => near(angAt(c, 'R', 'P', 'Q'), angAt(c, 'O', 'P', 'Q'), 1e-6),
        (c) => near(angAt(c, 'R', 'P', 'Q'), 60, 1e-6),
        (c) => near(angAt(c, 'R', 'P', 'Q'), angAt(c, 'S', 'P', 'Q'), 1e-6),
        (c) => near(Math.min(sweep(c, 'P', 'Q'), 360 - sweep(c, 'P', 'Q')), 120, 1e-6),
      ]),
      h: ['A central angle and its arc have the same measure; an inscribed angle on that arc is half as large.', 'R and S are both on the far side from arc PQ — check what that says about their two angles.'],
      s: 'Read from the figure: the central angle ∠POQ measures 120°, so minor arc PQ = 120°. R and S both lie on the major arc, so ∠PRQ and ∠PSQ both intercept arc PQ and each measures ½ × 120° = 60°; they are equal. So "m∠PRQ = m∠POQ" is false — the inscribed angle is half the central angle on the same arc, 60° against 120°.',
    },
  ]),

  // ── Angle pair relationships ──────────────────────────────────────────────
  ...G('geom.angle-pair-relationships', 'Vertical angles, linear pairs and complements at one crossing', [
    {
      t: 'vertical pair equation, then the linear-pair neighbour', d: 3, need: 'calc',
      spec: par(78, { 6: '(4x + 6)°', 7: '(6x − 30)°' }, ['m', 'n', 't']),
      alt: 'Line t crosses line m (upper) and line n (lower). At the crossing with n, the angle above n right of t and the angle below n left of t are labelled with expressions in x; the other two angles at that crossing are not marked.',
      q: 'Line t crosses line n. Two angles at that crossing are labelled with expressions in x. What is the measure, in degrees, of the angle above line n and to the left of t?',
      n: '102',
      calc: ['positions 6 and 7 are vertical: 4x + 6 = 6x − 30; x from the true angle at 6, the other label checked at 7; the key is the true angle at position 5', (c) => {
        const x = (pos(c, 6) - 6) / 4;
        if (!near(6 * x - 30, pos(c, 7)) || !vertical(6, 7)) throw new Error('labels do not fit');
        return pos(c, 5);
      }],
      h: ['Name the relationship between the two labelled angles from where they sit at the crossing, then write its equation.', 'Solve for x, substitute back, and use the fact that the angle asked for shares a side with a labelled one along a straight line.'],
      s: 'Read from the figure: (4x + 6)° is above n and right of t, (6x − 30)° is below n and left of t — opposite each other at the crossing, so they are vertical angles and congruent: 4x + 6 = 6x − 30, 2x = 36, x = 18, and each measures 78°. The angle above n and left of t forms a linear pair with the 78° angle above n right of t, so it measures 180° − 78° = 102°.',
    },
    {
      t: 'pick the vertical pair among four numbered angles', d: 2, need: 'reason',
      spec: par(63, { 1: '1', 2: '2', 4: '3', 3: '4' }, ['m', 'n', 't']),
      hide: ['1', '2', '3', '4'],
      alt: 'Line t crosses line m (upper) and line n (lower). Each of the four angles at the crossing with m carries its own number; no angles are marked at the crossing with n.',
      q: 'Line t crosses line m, and the four angles at that crossing are numbered. Which pair of numbered angles in the figure is a pair of vertical angles?',
      o: [
        ['∠2 and ∠4', 'correct'],
        ['∠1 and ∠2', 'they share a side along t and lie on a straight line — a linear pair'],
        ['∠3 and ∠4', 'they share the lower ray of t — a linear pair, not opposite angles'],
        ['∠1 and ∠4', 'they share the left ray of m — a linear pair'],
      ],
      holds: ['each option\'s angles are found by their printed labels in the spec; vertical = at one crossing, on opposite sides of both lines (no shared side)', [
        (c) => vertical(posOf(c, '2'), posOf(c, '4')),
        (c) => vertical(posOf(c, '1'), posOf(c, '2')),
        (c) => vertical(posOf(c, '3'), posOf(c, '4')),
        (c) => vertical(posOf(c, '1'), posOf(c, '4')),
      ]],
      h: ['Vertical angles share only the vertex — no side — and sit opposite each other across the crossing.', 'Two angles that share a side and together make a straight line are a linear pair; rule those out.'],
      s: 'Read from the figure: going round the crossing, ∠1 is above m left of t, ∠2 above m right of t, ∠3 below m right of t, ∠4 below m left of t. ∠2 and ∠4 are opposite each other and share no side, so they are vertical angles. Each other pair listed shares a ray and forms a linear pair.',
    },
    {
      t: 'complement of an angle found through a vertical pair', d: 2, need: 'calc',
      spec: par(52, { 7: 'auto', 6: '?' }, ['m', 'n', 't']),
      alt: 'Line t crosses line m (upper) and line n (lower). At the crossing with n, the angle below n left of t carries its measure and the angle above n right of t is marked with a question mark.',
      q: 'Line t crosses line n. ∠Z (not shown) is complementary to the angle marked ?. What is the measure of ∠Z, in degrees?',
      n: '38',
      calc: ['the marked angle is the true angle at position 6 (vertical to position 7); its complement is 90° minus it', (c) => { if (!vertical(6, 7)) throw new Error('not vertical'); return 90 - pos(c, 6); }],
      h: ['First find the angle marked ?: decide how it is related to the measured angle at the same crossing.', 'Complementary angles add to 90°, wherever they sit.'],
      s: 'Read from the figure: the angle below n and left of t measures 52°, and the angle marked ? is above n and right of t — opposite it at the crossing, so they are vertical angles and ? = 52°. ∠Z is complementary to it, so m∠Z = 90° − 52° = 38°.',
    },
  ]),

  // ── Circles: radii, chords & arcs ─────────────────────────────────────────
  ...G('geom.circle-basics-arcs', 'Parts of a drawn circle and arcs from its central angles', [
    {
      t: 'pick the chord that is not a diameter', d: 2, need: 'reason',
      spec: circle({ radius: 5, points: [{ name: 'P', at: 110 }, { name: 'S', at: 170 }, { name: 'T', at: 350 }, { name: 'Q', at: 225 }, { name: 'R', at: 295 }, { name: 'U', at: 45 }], radii: [{ to: 'P' }], chords: [{ from: 'S', to: 'T' }, { from: 'Q', to: 'R' }], tangent: { at: 'U', length: 4, end: 'V' } }),
      alt: 'Circle O with points P, Q, R, S, T and U on the circle and V outside it: segment OP from the centre to the circle, segment ST through the centre, segment QR across the lower part of the circle, segment UV touching the circle only at U, and a dashed line from O to V.',
      q: 'Which segment in the figure is a chord of circle O but NOT a diameter?',
      o: [
        ['QR', 'correct'],
        ['ST', 'it is a chord, but it passes through the centre O, so it is a diameter'],
        ['OP', 'a radius — only one of its endpoints is on the circle'],
        ['UV', 'a tangent segment — it meets the circle at only one point'],
      ],
      holds: ['a chord is a drawn segment with both ends among the circle\'s points; a diameter is a chord of length 2r — both tested on the spec', (() => {
        const isChordNotDiameter = (c: Ctx, a: string, b: string): boolean => {
          const ch = arr(c.p.chords).find((k) => (k.from === a && k.to === b) || (k.from === b && k.to === a));
          if (!ch) return false;
          const A = cpt(c, a).xy; const B = cpt(c, b).xy;
          return !near(Math.hypot(A[0] - B[0], A[1] - B[1]), 2 * (c.p.radius as number), 1e-6);
        };
        return [
          (c: Ctx) => isChordNotDiameter(c, 'Q', 'R'),
          (c: Ctx) => isChordNotDiameter(c, 'S', 'T'),
          (c: Ctx) => isChordNotDiameter(c, 'O', 'P'),
          (c: Ctx) => isChordNotDiameter(c, 'U', 'V'),
        ];
      })()],
      h: ['A chord has BOTH endpoints on the circle; check each segment\'s two ends.', 'A diameter is the special chord that passes through the centre.'],
      s: 'Read from the figure: OP runs from the centre to the circle (a radius); ST has both ends on the circle and passes through O (a diameter); UV touches the circle only at U (a tangent); QR has both ends on the circle and misses the centre. So QR is the chord that is not a diameter.',
    },
    {
      t: 'major arc named with three letters from a diameter and a central angle', d: 3, need: 'calc',
      spec: circle({ radius: 5, points: [{ name: 'P', at: 180 }, { name: 'R', at: 0 }, { name: 'Q', at: 128 }], radii: [{ to: 'Q' }], chords: [{ from: 'P', to: 'R' }], angles: [{ vertex: 'center', from: 'Q', to: 'P', label: 'auto' }] }),
      alt: 'Circle O with diameter PR drawn horizontally, P on the left and R on the right, and radius OQ to a point Q on the upper half, nearer P; the central angle between OQ and OP carries its measure.',
      q: 'In the circle O shown, PR is a diameter and the central angle ∠QOP is marked with its measure. What is the measure, in degrees, of arc QPR?',
      n: '232',
      calc: ['arc from Q through P to R: the counter-clockwise sweeps Q → P and P → R from the spec\'s point positions (P is checked to lie on that way round)', (c) => {
        const total = sweep(c, 'Q', 'P') + sweep(c, 'P', 'R');
        if (!(total < 360) || !near(sweep(c, 'P', 'R'), 180)) throw new Error('P is not on the arc / PR is not a diameter');
        return total;
      }],
      h: ['Arc QPR starts at Q, passes through P, and ends at R — the long way round; split it at P.', 'One piece comes from the central angle; the other piece ends at the two ends of a diameter.'],
      s: 'Read from the figure: PR is a diameter and ∠QOP measures 52°, so arc QP = 52°. Arc PR on the side away from Q is a semicircle, 180°. Arc QPR runs from Q through P to R, so by arc addition it is 52° + 180° = 232° — a major arc, which is why it needs three letters.',
    },
    {
      t: 'base angle of the isosceles triangle built by two radii', d: 2, need: 'calc',
      spec: circle({ radius: 5, points: [{ name: 'P', at: 300 }, { name: 'Q', at: 20 }], radii: [{ to: 'P' }, { to: 'Q' }], chords: [{ from: 'P', to: 'Q' }], angles: [{ vertex: 'center', from: 'P', to: 'Q', label: 'auto' }] }),
      alt: 'Circle O with radii OP and OQ and chord PQ forming a triangle on the right-hand side of the circle; the central angle between the two radii carries its measure.',
      q: 'In the circle O shown, radii OP and OQ and chord PQ are drawn, and the central angle ∠POQ is marked with its measure. What is m∠OPQ, in degrees?',
      n: '50',
      calc: ['the angle at P between the rays to O and to Q, from the coordinates of the spec\'s points', (c) => round(angAt(c, 'P', 'O', 'Q'), 6)],
      h: ['Every radius of a circle has the same length — what kind of triangle do OP, OQ and PQ make?', 'Its two base angles are equal and the three angles of the triangle add to 180°.'],
      s: 'Read from the figure: the central angle ∠POQ measures 80°. OP and OQ are both radii, so OP = OQ and triangle OPQ is isosceles, with equal base angles at P and Q. So m∠OPQ = (180° − 80°) ÷ 2 = 50°.',
    },
  ]),
];

