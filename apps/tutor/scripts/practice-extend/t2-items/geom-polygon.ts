/** GreenApple T2 figure items — group "geom-polygon". Items: see author-t2-figure-items.ts for the rules. */
import { G, S, falseOne, near, pick, type Ctx, type Item, type P, type Spec } from './kit';
import { ptText, sequenceName, transformName, type Pt, type Transform } from '../../../src/lib/tutor/practice-figure/kinds/coordinate-polygon';

// ── spec helpers ────────────────────────────────────────────────────────────

const poly = (params: P): Spec => S('coordinate_polygon', params);
/** The coordinates of a labelled vertex or point, read through the figure-core checker. */
const at = (c: Ctx, label: string): Pt => [c.num('poly_vertex', { vertex: label, coordinate: 'x' }), c.num('poly_vertex', { vertex: label, coordinate: 'y' })];
const dist2 = (a: Pt, b: Pt): number => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
const tr = (dx: number, dy: number): Transform => ({ kind: 'translate', dx, dy });
const rot = (deg: 90 | 180 | 270, cx = 0, cy = 0): Transform => ({ kind: 'rotate', deg, cx, cy });
const refl = (line: 'v' | 'h' | 'up' | 'down', c = 0): Transform => ({ kind: 'reflect', line, c });
const name = (t: Transform): string => transformName(t);
const rule = (t: Transform): string => transformName(t, 'rule');
/** The x of a labelled vertical guide line, from the spec. */
const lineX = (c: Ctx, label: string): number => {
  const l = (c.p.lines as P[]).find((k) => k.label === label);
  if (!l || l.kind !== 'vertical') throw new Error(`no vertical line ${label}`);
  return l.x as number;
};

export const ITEMS: Item[] = [
  // ── Translations ──────────────────────────────────────────────────────────
  ...G('geom.translations', 'Translations read off a coordinate grid', [
    {
      t: 'read the translation rule from a drawn pre-image and image', d: 2, need: 'reason',
      spec: poly({
        xRange: [-6, 6], yRange: [-6, 6],
        polygons: [
          { vertices: [[-5, 1], [-1, 2], [-3, 5]], labels: ['P', 'Q', 'R'] },
          { vertices: [[0, -3], [4, -2], [2, 1]], labels: ['P′', 'Q′', 'R′'], style: 'dashed' },
        ],
      }),
      alt: 'Triangle PQR (solid) sits in the upper left of the grid and its translated image P′Q′R′ (dashed) sits lower and to the right.',
      q: 'Triangle PQR in the figure is translated to triangle P′Q′R′. Which rule describes the translation?',
      o: [
        [rule(tr(5, -4)), 'correct'],
        [rule(tr(-5, 4)), 'subtracts image from pre-image the wrong way round, giving the translation that undoes the move'],
        [rule(tr(5, 4)), 'treats the move of 4 units down as +4 (sign error on the vertical part)'],
        [rule(tr(4, -5)), 'swaps the horizontal and vertical parts of the move'],
      ],
      ck: ['poly_identify', { from: 0, to: 1, form: 'rule' }],
      h: ['Pick one vertex and its image, and count how far right or left and how far up or down it moved.', 'Compute image minus pre-image for each coordinate, then test the rule on a second vertex.'],
      s: 'Read from the figure: P(−5, 1) and P′(0, −3); Q(−1, 2) and Q′(4, −2). Image minus pre-image: a = 0 − (−5) = 5 and b = −3 − 1 = −4, and Q gives the same: 4 − (−1) = 5, −2 − 2 = −4. So the translation is (x, y) → (x + 5, y − 4): 5 units right and 4 units down.',
    },
    {
      t: 'work backwards from the image along a drawn vector', d: 3, need: 'calc',
      spec: poly({
        xRange: [-6, 6], yRange: [-6, 7],
        polygons: [{ vertices: [[2, 3], [5, 4], [3, 6]], labels: ['J′', 'K′', 'L′'] }],
        arrows: [{ from: [-5, -5], to: [-2, -1], label: 'v' }],
      }),
      alt: 'Only the image triangle J′K′L′ is drawn, in the upper right; the translation vector v is drawn as an arrow in the lower left.',
      q: 'Triangle JKL (not drawn) was translated along vector v, shown as an arrow, to give triangle J′K′L′. What were the coordinates of K?',
      o: [
        [ptText([2, 0]), 'correct'],
        [ptText([8, 8]), 'applies the vector forward to K′ instead of undoing it'],
        [ptText([2, 8]), 'moves K′ further up instead of back down'],
        [ptText([8, 0]), 'shifts K′ more to the right rather than leftward'],
      ],
      ck: ['poly_image_vertex', { vertex: 'K′', transform: { translate: [-3, -4] } }],
      h: ['Read the vector from the arrow: count the units right or left and up or down from its tail to its tip.', 'K′ = K + v, so to recover K, subtract the vector from the coordinates of K′.'],
      s: 'Read from the figure: the arrow runs from (−5, −5) to (−2, −1), so v has components 3 and 4 (3 right, 4 up); K′ is at (5, 4). Since K′ = (x + 3, y + 4), undo the move: K = (5 − 3, 4 − 4) = (2, 0).',
    },
    {
      t: 'which statement about a drawn translation is false', d: 2, need: 'reason',
      spec: poly({
        xRange: [-10, 8], yRange: [-8, 10], xStep: 2, yStep: 2,
        polygons: [
          { vertices: [[-8, 2], [-4, 2], [-2, 6], [-6, 8]], labels: ['P', 'Q', 'R', 'S'] },
          { vertices: [[-2, -6], [2, -6], [4, -2], [0, 0]], labels: ['P′', 'Q′', 'R′', 'S′'], style: 'dashed' },
        ],
      }),
      alt: 'Quadrilateral PQRS (solid) is in the upper left; its image P′Q′R′S′ (dashed) is lower and to the right. Gridlines are every 2 units.',
      q: 'In the figure, quadrilateral PQRS is translated to quadrilateral P′Q′R′S′. Which statement is FALSE?',
      o: [
        ['The rule is (x, y) → (x + 6, y + 8).', 'correct'],
        ['Segments PP′ and RR′ are parallel and equal.', 'true: every point moves along a parallel track of the same length'],
        ['P′Q′R′S′ is lettered the same way round as PQRS.', 'true: a translation preserves orientation'],
        ['Side R′S′ is exactly as long as side RS.', 'true: a translation preserves distance'],
      ],
      holds: falseOne('each statement tested on the vertices read from the spec', [
        (c) => rule(tr(6, 8)) === c.txt('poly_identify', { from: 0, to: 1, form: 'rule' }),
        (c) => {
          const [p, pp, r, rr] = [at(c, 'P'), at(c, 'P′'), at(c, 'R'), at(c, 'R′')];
          const u = [pp[0] - p[0], pp[1] - p[1]]; const w = [rr[0] - r[0], rr[1] - r[1]];
          return near(u[0] * w[1] - u[1] * w[0], 0) && near(dist2(p, pp), dist2(r, rr));
        },
        (c) => c.txt('poly_orientation', { from: 0, to: 1 }) === 'preserved',
        (c) => near(dist2(at(c, 'R'), at(c, 'S')), dist2(at(c, 'R′'), at(c, 'S′'))),
      ]),
      h: ['Find the move of one vertex: image minus pre-image, horizontally and then vertically, and watch the signs.', 'Recall what a translation always keeps: lengths, angle measures and the direction the vertices are lettered round.'],
      s: 'Read from the figure: P(−8, 2) and P′(−2, −6), so the move is 6 right and 8 DOWN: (x, y) → (x + 6, y − 8). The statement giving y + 8 is false. The others are true for every translation: PP′ and RR′ are parallel tracks of equal length, orientation is kept, and R′S′ = RS.',
    },
  ]),

  // ── Reflections ───────────────────────────────────────────────────────────
  ...G('geom.reflections', 'Reflections on a coordinate grid', [
    {
      t: 'identify the mirror line from a drawn pre-image and image', d: 2, need: 'reason',
      spec: poly({
        xRange: [-3, 7], yRange: [-7, 5],
        polygons: [
          { vertices: [[1, 1], [4, 2], [2, 4]], labels: ['J', 'K', 'L'] },
          { vertices: [[1, -3], [4, -4], [2, -6]], labels: ['J′', 'K′', 'L′'], style: 'dashed' },
        ],
      }),
      alt: 'Triangle JKL (solid) lies above the x-axis and its mirror image J′K′L′ (dashed) lies below it; no mirror line is drawn.',
      q: 'In the figure, a single reflection maps triangle JKL onto triangle J′K′L′. Which reflection is it?',
      o: [
        [name(refl('h', -1)), 'correct'],
        [name(refl('h', 0)), 'assumes the mirror is the x-axis without checking that each point and its image are equally far from it'],
        [name(refl('h', -2)), 'puts the mirror partway between the triangles by eye instead of at the midpoint of JJ′'],
        [name(refl('v', -1)), 'finds the right number but uses a vertical line, though the points moved straight down'],
      ],
      ck: ['poly_identify', { from: 0, to: 1 }],
      h: ['The mirror line is the perpendicular bisector of the segment joining a point to its image.', 'Find the midpoint of one vertex and its image; check a second pair crosses the mirror at the same height.'],
      s: 'Read from the figure: J(1, 1) and J′(1, −3); K(4, 2) and K′(4, −4). Each point moved straight down, so the mirror is horizontal. The midpoint of JJ′ has y = (1 + (−3))/2 = −1, and of KK′ y = (2 + (−4))/2 = −1. The mirror is the line y = −1.',
    },
    {
      t: 'reflect a vertex across a drawn vertical line', d: 2, need: 'calc',
      spec: poly({
        xRange: [-4, 8], yRange: [-1, 7],
        polygons: [{ vertices: [[-3, 1], [0, 1], [1, 4], [-2, 5]], labels: ['P', 'Q', 'R', 'S'], shade: true }],
        lines: [{ kind: 'vertical', x: 2, label: 'm' }],
      }),
      alt: 'Shaded quadrilateral PQRS lies to the left of a vertical dashed line labelled m; the image is not drawn.',
      q: 'Quadrilateral PQRS is reflected across line m. Type the x-coordinate of S′ as a number.',
      n: '6',
      ck: ['poly_image_vertex', { vertex: 'S', transform: { reflect: 'x = 2' }, coordinate: 'x' }],
      h: ['Read where line m crosses the x-axis, then count how far S is from the line horizontally.', 'Count the same distance on the other side of the line; the y-coordinate does not change.'],
      s: 'Read from the figure: line m is the vertical line x = 2 and S is at (−2, 5). S is 2 − (−2) = 4 units left of m, so S′ is 4 units right of m: x = 2 + 4 = 6 (the rule across x = h is (2h − x, y): 2·2 − (−2) = 6). S′ = (6, 5).',
    },
    {
      t: 'which statement about a reflection in y = x is false', d: 3, need: 'reason',
      spec: poly({
        xRange: [-5, 5], yRange: [-5, 5],
        polygons: [
          { vertices: [[-3, 1], [-1, 4], [1, 2]], labels: ['P', 'Q', 'R'] },
          { vertices: [[1, -3], [4, -1], [2, 1]], labels: ['P′', 'Q′', 'R′'], style: 'dashed' },
        ],
        lines: [{ kind: 'through', points: [[0, 0], [1, 1]], label: 'y = x' }],
      }),
      alt: 'Triangle PQR (solid) lies above the dashed line y = x and its image P′Q′R′ (dashed) lies below it.',
      q: 'Triangle PQR is reflected across the line y = x to give triangle P′Q′R′. Which statement is FALSE?',
      o: [
        ['P′ → Q′ → R′ runs the same way round as P → Q → R.', 'correct'],
        ['The line y = x is the perpendicular bisector of QQ′.', 'true: that is the definition of a reflection'],
        ['Segment RR′ is perpendicular to the line y = x.', 'true: every point-to-image segment is perpendicular to the mirror'],
        ['Side Q′R′ is exactly as long as side QR.', 'true: a reflection preserves distance'],
      ],
      holds: falseOne('each statement tested on the vertices read from the spec', [
        (c) => c.txt('poly_orientation', { from: 0, to: 1 }) === 'preserved',
        (c) => { const [q, qq] = [at(c, 'Q'), at(c, 'Q′')]; const m = [(q[0] + qq[0]) / 2, (q[1] + qq[1]) / 2]; return near(m[0], m[1]) && near((qq[0] - q[0]) + (qq[1] - q[1]), 0); },
        (c) => { const [r, rr] = [at(c, 'R'), at(c, 'R′')]; return near((rr[0] - r[0]) + (rr[1] - r[1]), 0); },
        (c) => near(dist2(at(c, 'Q'), at(c, 'R')), dist2(at(c, 'Q′'), at(c, 'R′'))),
      ]),
      h: ['Trace each triangle in letter order and note whether you turn clockwise or counterclockwise.', 'Recall the definition: the mirror is the perpendicular bisector of every point-to-image segment, and lengths are kept.'],
      s: 'Read from the figure: P(−3, 1), Q(−1, 4), R(1, 2) and P′(1, −3), Q′(4, −1), R′(2, 1). P → Q → R turns clockwise, but P′ → Q′ → R′ turns counterclockwise — a reflection reverses orientation, so that statement is false. QQ′ has midpoint (1.5, 1.5) on y = x and is perpendicular to it, RR′ runs from (1, 2) to (2, 1) (perpendicular to y = x), and Q′R′ = QR.',
    },
  ]),

  // ── Rotations ─────────────────────────────────────────────────────────────
  ...G('geom.rotations', 'Rotations on a coordinate grid', [
    {
      t: 'identify the rotation about the origin from a drawn image', d: 2, need: 'reason',
      spec: poly({
        xRange: [-6, 6], yRange: [-6, 6],
        polygons: [
          { vertices: [[-5, 1], [-2, 1], [-1, 4], [-4, 5]], labels: ['K', 'L', 'M', 'N'] },
          { vertices: [[1, 5], [1, 2], [4, 1], [5, 4]], labels: ['K′', 'L′', 'M′', 'N′'], style: 'dashed' },
        ],
      }),
      alt: 'Quadrilateral KLMN (solid) is in the second quadrant and its image K′L′M′N′ (dashed) is in the first quadrant.',
      q: 'A rotation about the origin maps quadrilateral KLMN onto quadrilateral K′L′M′N′ in the figure. Which rotation is it?',
      o: [
        [name(rot(270)), 'correct'],
        [name(rot(90)), 'uses the counterclockwise direction — the two quarter-turn rules swapped'],
        [name(rot(180)), 'negates both coordinates, which is the half-turn rule'],
        [name(refl('up', 0)), 'swaps the coordinates without negating either'],
      ],
      ck: ['poly_identify', { from: 0, to: 1 }],
      h: ['Read one vertex and its image and compare the coordinates: were they swapped, and which one changed sign?', 'Match the pattern to an origin rule: (−y, x) for 90° counterclockwise, (y, −x) for 90° clockwise, (−x, −y) for 180°.'],
      s: 'Read from the figure: K(−5, 1) → K′(1, 5) and L(−2, 1) → L′(1, 2). In each, the image is (y, −x): the coordinates swap and the new y is the old x negated. That is the rule for 90° clockwise (270° counterclockwise) about the origin; M(−1, 4) → M′(4, 1) agrees.',
    },
    {
      t: 'rotate a vertex about a marked centre that is not the origin', d: 3, need: 'calc',
      spec: poly({
        xRange: [-4, 6], yRange: [-4, 6],
        polygons: [{ vertices: [[2, 2], [5, 2], [4, 4]], labels: ['P', 'Q', 'R'], shade: true }],
        points: [{ x: 1, y: 1, label: 'M' }],
      }),
      alt: 'Shaded triangle PQR lies in the first quadrant and a single point M is marked just below and to the left of it; the image is not drawn.',
      q: 'Triangle PQR in the figure is rotated 90° counterclockwise about the marked point M. What are the coordinates of Q′?',
      o: [
        [ptText([0, 5]), 'correct'],
        [ptText([-2, 5]), 'applies the origin rule (−y, x) although the centre is M, not the origin'],
        [ptText([2, -3]), 'turns 90° clockwise about M instead of counterclockwise'],
        [ptText([-3, 0]), 'turns 180° about M instead of 90°'],
      ],
      ck: ['poly_image_vertex', { vertex: 'Q', transform: { rotate: 90, direction: 'ccw', about: [1, 1] } }],
      h: ['Subtract the centre from Q so the turn can be done as if about the origin.', 'Apply the 90° counterclockwise origin rule to that difference, then add the centre back.'],
      s: 'Read from the figure: M = (1, 1) and Q = (5, 2). Subtract the centre: (5 − 1, 2 − 1) = (4, 1). Turn 90° counterclockwise with (x, y) → (−y, x): (−1, 4). Add the centre back: (−1 + 1, 4 + 1) = (0, 5). So Q′ = (0, 5).',
    },
    {
      t: 'find the centre of a half-turn from a drawn pre-image and image', d: 3, need: 'reason',
      spec: poly({
        xRange: [-5, 7], yRange: [-6, 4],
        polygons: [
          { vertices: [[-4, 0], [-1, 1], [-3, 3]], labels: ['J', 'K', 'L'] },
          { vertices: [[6, -2], [3, -3], [5, -5]], labels: ['J′', 'K′', 'L′'], style: 'dashed' },
        ],
      }),
      alt: 'Triangle JKL (solid) is in the upper left of the grid and its image J′K′L′ (dashed) is in the lower right, turned upside down.',
      q: 'In the figure, a rotation maps triangle JKL onto triangle J′K′L′. Which rotation is it?',
      o: [
        [name(rot(180, 1, -1)), 'correct'],
        [name(rot(180, 0, 0)), 'assumes the centre is the origin, which would send J to (4, 0)'],
        [name(rot(180, 2, -2)), 'adds a point and its image without halving — the centre is their midpoint'],
        [name(rot(270, 1, -1)), 'finds the centre but takes the turn as a quarter-turn'],
      ],
      ck: ['poly_identify', { from: 0, to: 1 }],
      h: ['Compare the direction of each side before and after: a side that points the opposite way suggests a half-turn.', 'Under a 180° turn the centre is the midpoint of every point and its image; average one pair and check a second.'],
      s: 'Read from the figure: J(−4, 0) → J′(6, −2) and K(−1, 1) → K′(3, −3). Every side now points the opposite way, so this is a 180° turn. Midpoint of JJ′: ((−4 + 6)/2, (0 − 2)/2) = (1, −1); midpoint of KK′: ((−1 + 3)/2, (1 − 3)/2) = (1, −1). The rotation is 180° about (1, −1).',
    },
  ]),

  // ── Compositions & symmetry ───────────────────────────────────────────────
  ...G('geom.compositions-symmetry', 'Compositions of rigid motions and symmetry on a grid', [
    {
      t: 'line and rotational symmetry of a drawn parallelogram', d: 2, need: 'reason',
      spec: poly({
        xRange: [-5, 5], yRange: [-4, 4],
        polygons: [{ vertices: [[-4, -2], [2, -2], [4, 2], [-2, 2]], shade: true }],
      }),
      alt: 'One shaded slanted parallelogram is centred on the origin; its horizontal sides are longer than its slanted sides.',
      q: 'How many lines of symmetry does the shaded parallelogram have, and what is the smallest rotation about its centre (more than 0° and less than 360°) that maps it onto itself?',
      o: [
        ['0 lines; the smallest turn is 180°', 'correct'],
        ['2 lines; the smallest turn is 180°', 'assumes the lines through the midpoints of opposite sides are mirrors, as in a rectangle'],
        ['0 lines; no turn under 360° works', 'thinks a figure with no line of symmetry can have no rotational symmetry either'],
        ['2 lines; the smallest turn is 90°', 'treats the parallelogram like a square'],
      ],
      holds: pick('[number of lines of symmetry, smallest turn = 360° ÷ order of rotational symmetry (360 when the order is 1)] from the figure-core checkers', (c) => [c.num('poly_symmetry_lines', {}), 360 / c.num('poly_rotational_symmetry', {})], [[0, 180], [2, 180], [0, 360], [2, 90]]),
      h: ['For a line of symmetry, ask whether folding along that line would put every corner exactly on another corner.', 'For rotational symmetry, turn the shape about its centre and look for the first angle at which it lands on itself.'],
      s: 'Read from the figure: the vertices are (−4, −2), (2, −2), (4, 2), (−2, 2), centred on the origin. Folding along the vertical or horizontal line through the centre does not match the slanted corners, and neither does folding along a diagonal, so there are 0 lines of symmetry. A 180° turn sends (x, y) to (−x, −y), which carries each vertex to the opposite one, so the smallest turn is 180°.',
    },
    {
      t: 'choose the two-step sequence that maps one drawn triangle onto another', d: 2, need: 'reason',
      spec: poly({
        xRange: [-6, 6], yRange: [-6, 6],
        polygons: [
          { vertices: [[-5, 2], [-2, 2], [-4, 5]], labels: ['P', 'Q', 'R'] },
          { vertices: [[1, -1], [4, -1], [2, -4]], labels: ['P′', 'Q′', 'R′'], style: 'dashed' },
        ],
      }),
      alt: 'Triangle PQR (solid) is in the second quadrant and triangle P′Q′R′ (dashed), flipped upside down, is in the fourth quadrant.',
      q: 'Which sequence of rigid motions maps triangle PQR onto triangle P′Q′R′, as shown in the figure?',
      o: [
        [sequenceName([refl('h', 0), tr(6, 1)]), 'correct'],
        [sequenceName([tr(6, 1), refl('h', 0)]), 'does the two steps in the reverse order — composition is not commutative'],
        [sequenceName([refl('h', 0), tr(6, -1)]), 'gets the sign of the vertical slide wrong'],
        [sequenceName([rot(180), tr(6, 1)]), 'uses a half-turn, which keeps the lettering direction instead of reversing it'],
      ],
      ck: ['poly_which_sequence', { from: 0, to: 1, candidates: [[{ reflect: 'x-axis' }, { translate: [6, 1] }], [{ translate: [6, 1] }, { reflect: 'x-axis' }], [{ reflect: 'x-axis' }, { translate: [6, -1] }], [{ rotate: 180 }, { translate: [6, 1] }]] }],
      h: ['Apply each sequence to one vertex, step by step in the order written, and compare with its image.', 'Check a second vertex for any sequence that survives the first test.'],
      s: 'Read from the figure: P(−5, 2) and P′(1, −1). Reflect across the x-axis: (−5, −2); then translate by (6, 1): (1, −1) = P′. Q(−2, 2) → (−2, −2) → (4, −1) = Q′ as well. In the reverse order, P → (1, 3) → (1, −3), which misses P′; sliding by (6, −1) gives (1, −3); a half-turn then the slide gives (11, −1).',
    },
    {
      t: 'two reflections in drawn parallel lines as one motion', d: 3, need: 'calc',
      spec: poly({
        xRange: [-7, 5], yRange: [-2, 6],
        polygons: [{ vertices: [[-6, 1], [-4, 1], [-5, 4]], labels: ['P', 'Q', 'R'], shade: true }],
        lines: [{ kind: 'vertical', x: -3, label: 'm' }, { kind: 'vertical', x: 1, label: 'n' }],
      }),
      alt: 'Shaded triangle PQR lies to the left of two vertical dashed lines, m and then n further right; no image is drawn.',
      q: 'Triangle PQR is reflected across line m, and that image is then reflected across line n. Which single rigid motion has the same effect?',
      o: [
        [name(tr(8, 0)), 'correct'],
        [name(tr(4, 0)), 'slides by the distance between the lines instead of twice that distance'],
        [name(tr(-8, 0)), 'slides from n toward m instead of from m toward n'],
        [name(tr(0, 8)), 'slides along the lines instead of perpendicular to them'],
      ],
      calc: ['each vertex reflected across x = (m from the spec) then x = (n from the spec) by poly_image_vertex; the moves agree and give one translation, named', (c) => {
        const [xm, xn] = [lineX(c, 'm'), lineX(c, 'n')];
        const moves = ['P', 'Q', 'R'].map((v) => {
          const p = at(c, v);
          const q: Pt = (['x', 'y'] as const).map((k) => c.num('poly_image_vertex', { vertex: v, steps: [{ reflect: `x = ${xm}` }, { reflect: `x = ${xn}` }], coordinate: k })) as Pt;
          return [q[0] - p[0], q[1] - p[1]];
        });
        if (!moves.every((d) => near(d[0], moves[0][0]) && near(d[1], moves[0][1]))) throw new Error('not one translation');
        return name(tr(moves[0][0], moves[0][1]));
      }],
      h: ['Read where each line crosses the x-axis and find the distance between the two lines.', 'Two reflections in parallel lines make a translation perpendicular to them; track one vertex through both reflections to check the distance.'],
      s: 'Read from the figure: m is x = −3 and n is x = 1, so the lines are parallel and 4 units apart. Two reflections in parallel lines give a translation of twice that distance, from m toward n: 8 units right. Check with P(−6, 1): across m → (0, 1); across n → (2, 1), a move of (8, 0).',
    },
  ]),

  // ── Congruence via rigid motions ──────────────────────────────────────────
  ...G('geom.congruence-rigid-motions', 'Congruence through rigid motions on a grid', [
    {
      t: 'write the congruence statement for two drawn triangles', d: 3, need: 'reason',
      spec: poly({
        xRange: [-6, 6], yRange: [-6, 6],
        polygons: [
          { vertices: [[-5, 1], [-1, 1], [-5, 3]], labels: ['P', 'Q', 'R'] },
          { vertices: [[5, -2], [5, -4], [1, -4]], labels: ['J', 'K', 'L'], style: 'dashed' },
        ],
      }),
      alt: 'Right triangle PQR (solid) is in the upper left and right triangle JKL (dashed), a mirror image of it, is in the lower right.',
      q: 'In the figure, a sequence of rigid motions maps triangle PQR onto triangle JKL. Which congruence statement records the correspondence correctly?',
      o: [
        ['△PQR ≅ △KLJ', 'correct'],
        ['△PQR ≅ △JKL', 'matches the vertices in alphabetical order instead of by the motion'],
        ['△PQR ≅ △LKJ', 'matches the right angles wrongly: L is not the right-angle vertex'],
        ['△PQR ≅ △JLK', 'pairs the 4-unit leg PQ with the slanted side JL'],
      ],
      calc: ['the one ordering of J, K, L whose side lengths match PQ, QR, RP (vertices read by poly_vertex)', (c) => {
        const [p, q, r] = ['P', 'Q', 'R'].map((v) => at(c, v));
        const tri = { J: at(c, 'J'), K: at(c, 'K'), L: at(c, 'L') } as Record<string, Pt>;
        const perms = ['JKL', 'JLK', 'KJL', 'KLJ', 'LJK', 'LKJ'].filter((s) => {
          const [a, b, d] = s.split('').map((k) => tri[k]);
          return near(dist2(p, q), dist2(a, b)) && near(dist2(q, r), dist2(b, d)) && near(dist2(r, p), dist2(d, a));
        });
        if (perms.length !== 1) throw new Error(`orderings that fit: ${perms.join(', ')}`);
        return `△PQR ≅ △${perms[0]}`;
      }],
      h: ['Find the side lengths of each triangle by counting squares along the legs.', 'Match the right angles first, then match the longer leg with the longer leg; write the image vertices in the order P, Q, R go to.'],
      s: 'Read from the figure: PQR has the right angle at P, PQ = 4 (horizontal) and PR = 2 (vertical). JKL has the right angle at K(5, −4), KL = 4 (horizontal, to L(1, −4)) and KJ = 2 (vertical, to J(5, −2)). So P → K, Q → L and R → J, and the statement is △PQR ≅ △KLJ.',
    },
    {
      t: 'choose the rigid-motion sequence that proves two triangles congruent', d: 2, need: 'reason',
      spec: poly({
        xRange: [-6, 6], yRange: [-6, 6],
        polygons: [
          { vertices: [[1, 2], [4, 3], [2, 5]], labels: ['P', 'Q', 'R'] },
          { vertices: [[-1, -4], [-4, -3], [-2, -1]], labels: ['P′', 'Q′', 'R′'], style: 'dashed' },
        ],
      }),
      alt: 'Triangle PQR (solid) is in the first quadrant and triangle P′Q′R′ (dashed) is in the third quadrant, facing the other way.',
      q: 'Which sequence of rigid motions maps triangle PQR onto triangle P′Q′R′ in the figure, showing that the triangles are congruent?',
      o: [
        [sequenceName([refl('v', 0), tr(0, -6)]), 'correct'],
        [sequenceName([refl('v', 0), tr(0, 6)]), 'slides up instead of down (sign error)'],
        [sequenceName([rot(180), tr(0, -6)]), 'uses a half-turn, which cannot reverse the lettering direction'],
        [sequenceName([refl('h', 0), tr(-2, 0)]), 'reflects across the wrong axis'],
      ],
      ck: ['poly_which_sequence', { from: 0, to: 1, candidates: [[{ reflect: 'y-axis' }, { translate: [0, -6] }], [{ reflect: 'y-axis' }, { translate: [0, 6] }], [{ rotate: 180 }, { translate: [0, -6] }], [{ reflect: 'x-axis' }, { translate: [-2, 0] }]] }],
      h: ['Read P → Q → R and P′ → Q′ → R′ round each triangle: if the directions differ, the sequence needs a reflection.', 'Apply each candidate to one vertex in the order written and compare with its image; check a second vertex.'],
      s: 'Read from the figure: P(1, 2) → P′(−1, −4), Q(4, 3) → Q′(−4, −3). PQR is lettered counterclockwise and P′Q′R′ clockwise, so a reflection is needed. Reflect across the y-axis: P → (−1, 2), then translate by (0, −6): (−1, −4) = P′; Q → (−4, 3) → (−4, −3) = Q′. The sequence maps PQR onto P′Q′R′, so the triangles are congruent.',
    },
    {
      t: 'decide congruence when the mapping is a dilation', d: 2, need: 'reason',
      spec: poly({
        xRange: [-6, 6], yRange: [-6, 4],
        polygons: [
          { vertices: [[-5, -4], [-3, -4], [-5, -1]], name: 'Triangle T', shade: true },
          { vertices: [[1, -4], [5, -4], [1, 2]], name: 'Triangle W', style: 'dashed' },
        ],
      }),
      alt: 'Two right triangles are drawn: triangle T (shaded, solid outline) at the lower left and triangle W (dashed outline) to its right; the legend names them.',
      q: 'In the figure, is triangle W congruent to triangle T?',
      o: [
        ['No — W is an enlargement of T: similar, not congruent', 'correct'],
        ['Yes — the angles of T and W match', 'equal angles show the same shape (similarity), not congruence'],
        ['No — W is a reduction of T: similar, not congruent', 'divides old by new, flipping the scale factor so it looks less than 1'],
        ['Yes — a dilation is a rigid motion', 'a dilation changes lengths, so it is not a rigid motion'],
      ],
      holds: ['congruence (poly_congruent, any matching) and the scale factor (poly_scale_factor, list order) from the spec; each option holds when its verdict and reason fit', [
        (c) => c.txt('poly_congruent', { a: 0, b: 1, match: 'any' }) === 'no' && c.num('poly_scale_factor', { from: 0, to: 1 }) > 1,
        (c) => c.txt('poly_congruent', { a: 0, b: 1, match: 'any' }) === 'yes',
        (c) => c.txt('poly_congruent', { a: 0, b: 1, match: 'any' }) === 'no' && c.num('poly_scale_factor', { from: 0, to: 1 }) < 1,
        (c) => c.txt('poly_congruent', { a: 0, b: 1, match: 'any' }) === 'yes',
      ]],
      h: ['Count the lengths of the legs of each triangle and compare them pair by pair.', 'Ask whether a rigid motion could do it: rigid motions keep every length the same.'],
      s: 'Read from the figure: T has legs 2 and 3; W has legs 4 and 6. Each length is doubled (new ÷ old = 4/2 = 6/3 = 2), so W is an enlargement of T: a dilation by scale factor 2. A dilation is not a rigid motion, so the triangles are similar but NOT congruent.',
    },
  ]),

  // ── Dilations & scale factor ──────────────────────────────────────────────
  ...G('geom.dilations-scale-factor', 'Dilations and scale factor on a grid', [
    {
      t: 'read the scale factor from a drawn pre-image and image', d: 2, need: 'calc',
      spec: poly({
        xRange: [-7, 6], yRange: [-5, 7],
        polygons: [
          { vertices: [[-4, -2], [-2, -2], [-4, 0]], labels: ['S', 'T', 'U'], shade: true },
          { vertices: [[-1, 1], [4, 1], [-1, 6]], labels: ['S′', 'T′', 'U′'], style: 'dashed' },
        ],
        points: [{ x: -6, y: -4, label: 'H' }],
      }),
      alt: 'Small shaded triangle STU and a larger dashed triangle S′T′U′ to its upper right, with the centre of dilation H marked at the lower left.',
      q: 'In the figure, triangle STU is dilated about the marked point H to give triangle S′T′U′. Type the scale factor as a number.',
      n: '2.5',
      ck: ['poly_scale_factor', { from: 0, to: 1 }],
      h: ['Choose one side of the pre-image and the matching side of the image and count both lengths.', 'Divide image length by pre-image length (new over old), then confirm with a second pair of sides.'],
      s: 'Read from the figure: ST runs from (−4, −2) to (−2, −2), length 2; S′T′ runs from (−1, 1) to (4, 1), length 5. k = image ÷ pre-image = 5 ÷ 2 = 2.5. Check: SU = 2 and S′U′ = 5, again 2.5.',
    },
    {
      t: 'dilate a vertex about a marked centre that is not the origin', d: 3, need: 'calc',
      spec: poly({
        xRange: [-5, 5], yRange: [-3, 5],
        polygons: [{ vertices: [[0, -2], [4, 0], [2, 4], [-2, 2]], labels: ['P', 'Q', 'R', 'S'], shade: true }],
        points: [{ x: -4, y: -2, label: 'H' }],
      }),
      alt: 'Shaded quadrilateral PQRS with a single point H marked to its lower left; the image is not drawn.',
      q: 'Quadrilateral PQRS in the figure is dilated about the marked point H with scale factor 1/2. What are the coordinates of R′?',
      o: [
        [ptText([-1, 1]), 'correct'],
        [ptText([1, 2]), 'multiplies R by 1/2 as if the centre were the origin'],
        [ptText([3, 3]), 'halves the trip from H to R but forgets to start again at H'],
        [ptText([8, 10]), 'doubles the trip from H instead of halving it'],
      ],
      ck: ['poly_image_vertex', { vertex: 'R', transform: { dilate: 0.5, about: [-4, -2] } }],
      h: ['Measure the trip from H to R: how far right and how far up.', 'Scale that trip by the factor, then start again at H.'],
      s: 'Read from the figure: H = (−4, −2) and R = (2, 4). The trip from H to R is (2 − (−4), 4 − (−2)) = (6, 6). Scale by 1/2: (3, 3). Start again at H: (−4 + 3, −2 + 3) = (−1, 1). So R′ = (−1, 1).',
    },
    {
      t: 'area of the image from a drawn pre-image and a stated scale factor', d: 3, need: 'calc',
      spec: poly({
        xRange: [-4, 4], yRange: [-2, 4],
        polygons: [{ vertices: [[-3, 0], [3, 0], [1, 2], [-2, 2]], labels: ['J', 'K', 'L', 'M'], shade: true }],
      }),
      alt: 'One shaded trapezoid JKLM with its longer base JK on the x-axis and its shorter base LM along the line y = 2.',
      q: 'The shaded trapezoid JKLM in the figure is dilated with scale factor 3 to give trapezoid J′K′L′M′ (not drawn). What is the area of J′K′L′M′, in square units?',
      n: '81',
      calc: ['area of JKLM (poly_area) × 3²', (c) => c.num('poly_area', {}) * 9],
      h: ['Find the area of the drawn trapezoid from its two parallel sides and its height, counted on the grid.', 'A dilation multiplies every length by the scale factor, so it multiplies area by the square of the scale factor.'],
      s: 'Read from the figure: JK runs from (−3, 0) to (3, 0), length 6; LM runs from (−2, 2) to (1, 2), length 3; the height is 2. Area = (6 + 3) ÷ 2 × 2 = 9 square units. Area scales by k² = 3² = 9, so the image has area 9 × 9 = 81 square units.',
    },
  ]),
];
