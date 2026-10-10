/**
 * Batch 4, part "math" (conic_graph, venn_diagram, probability_tree): the TEXT
 * transcription and the deterministic checkers. Conventions:
 * figure-core-batch4-kit.ts.
 *
 * A conic is transcribed as what a reader SEES — where the curve turns, its
 * extreme points, the points and dashed lines that are marked — never by the
 * name of the curve or by a / b / c: those are what the questions ask for.
 * A Venn region or a tree branch shown as "?" is transcribed as a blank.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { conicModel, lineConicIntersections, type Conic, type ConicLine, type ConicModel, type ConicPoint } from '../../src/lib/tutor/practice-figure/kinds/conic';
import { treeModel, vennModel, type TreeModel, type TreeNode, type VennModel } from '../../src/lib/tutor/practice-figure/kinds/venn-tree';
import { BLANK, approx, argIndex, fail, fmt, isNum, label, measured, modelOf, num, pick, plural, text, type Batch4CheckerDef, type Batch4Part, type P } from './figure-core-batch4-kit';

const art = (type: string): string => `${type === 'ellipse' ? 'an' : 'a'} ${type}`;
const pm = (v: number): string => fmt(Number(v.toFixed(4))).replace(/^-/, '−');
const xy = (x: number, y: number): string => `(${pm(x)}, ${pm(y)})`;
/** Exact when it terminates within four decimals or is a ratio of small whole numbers (so a key written as a fraction matches); else rounded. */
function ratioValue(v: number): ReturnType<typeof num> {
  if (Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-7) return num(Math.round(v * 1e4) / 1e4);
  for (let den = 2; den <= 2000; den++) if (Math.abs(v * den - Math.round(v * den)) < 1e-9) return num(v);
  return approx(v);
}

// ── conic_graph ─────────────────────────────────────────────────────────────

const OPENS = (c: Conic): string => (c.type === 'parabola' ? (c.axis === 'y' ? (c.p > 0 ? 'up' : 'down') : c.p > 0 ? 'right' : 'left') : c.axis === 'x' ? 'left and right' : 'up and down');
function lineWords(l: ConicLine): string {
  if (l.vertical) return `vertical, through x = ${pm(l.at)}`;
  if (Math.abs(l.slope) < 1e-12) return `horizontal, through y = ${pm(l.intercept)}`;
  return `through (0, ${pm(l.intercept)}), ${l.slope > 0 ? 'rising' : 'falling'} ${pm(Math.abs(l.slope))} for every 1 across`;
}

function conicText(m: ConicModel, printed: string[], out: string[]): string {
  out.push(`  axes: x from ${pm(m.xRange[0])} to ${pm(m.xRange[1])}, y from ${pm(m.yRange[0])} to ${pm(m.yRange[1])}, the same scale on both`);
  const pointLine = (q: ConicPoint, show: string, what: string): void => {
    if (show === 'none') return;
    if (show === 'value') {
      printed.push(`point label: "${q.name} ${q.coords}"`);
      out.push(`  a marked point "${q.name}" (${what}), labelled with its coordinates ${q.coords}`);
    } else if (show === 'blank') {
      printed.push(`point label: "${q.name}" ${BLANK}`);
      out.push(`  a marked point "${q.name}" (${what}); its coordinates are a blank "?" box`);
    } else {
      printed.push(`point label: "${q.name}"`);
      out.push(`  a marked point "${q.name}" (${what}) at ${q.coords} on the grid, no coordinates printed`);
    }
  };
  const guideLine = (l: ConicLine, show: string, what: string): void => {
    if (show === 'none') return;
    if (show === 'value') printed.push(`line label: "${l.equation}"`);
    if (show === 'blank') printed.push(`line label: ${BLANK}`);
    out.push(`  a dashed line (${what}), ${lineWords(l)}${show === 'value' ? `, labelled "${l.equation}"` : show === 'blank' ? ', labelled with a blank "?" box' : ', not labelled'}`);
  };
  m.conics.forEach((c, i) => {
    const head = m.conics.length > 1 ? `curve ${i + 1}${c.label ? ` (legend: "${c.label}")` : ''}` : 'the curve';
    if (m.conics.length > 1 || c.label) printed.push(`legend entry: "${c.label ?? `curve ${i + 1}`}"`);
    if (c.type === 'circle' || c.type === 'ellipse') {
      const ex = c.type === 'circle' ? c.r : c.axis === 'x' ? c.a : c.b;
      const ey = c.type === 'circle' ? c.r : c.axis === 'x' ? c.b : c.a;
      out.push(`  ${head}: a closed curve; leftmost point ${xy(c.h - ex, c.k)}, rightmost ${xy(c.h + ex, c.k)}, highest ${xy(c.h, c.k + ey)}, lowest ${xy(c.h, c.k - ey)}`);
    } else if (c.type === 'hyperbola') {
      out.push(`  ${head}: two separate branches opening ${OPENS(c)}; they turn at ${c.vertices.map((v) => xy(v.x, v.y)).join(' and ')}`);
    } else {
      const ends = c.axis === 'y' ? [xy(c.h - 2 * c.p, c.k + c.p), xy(c.h + 2 * c.p, c.k + c.p)] : [xy(c.h + c.p, c.k - 2 * c.p), xy(c.h + c.p, c.k + 2 * c.p)];
      out.push(`  ${head}: one open curve opening ${OPENS(c)}; it turns at ${xy(c.h, c.k)} and passes through ${ends.join(' and ')}`);
    }
    if (c.type === 'parabola') {
      pointLine(c.vertices[0], c.show.vertex, 'where the curve turns');
      pointLine(c.foci[0], c.show.focus, 'on the axis of symmetry, inside the curve');
    } else {
      if (c.center) pointLine(c.center, c.show.center, 'the centre');
      for (const q of c.vertices) pointLine(q, c.show.vertices ?? 'none', c.type === 'ellipse' ? 'an end of the longer axis' : 'where a branch turns');
      for (const q of c.coVertices) pointLine(q, c.show.coVertices ?? 'none', c.type === 'ellipse' ? 'an end of the shorter axis' : 'on the central rectangle, off the curve');
      for (const q of c.foci) pointLine(q, c.show.foci ?? 'none', c.type === 'ellipse' ? 'on the longer axis, inside the curve' : 'on the line through the turning points, inside a branch');
    }
    if (c.show.box === 'mark') out.push(`  a dashed rectangle centred on ${xy(c.h, c.k)}, ${pm(2 * (c.axis === 'x' ? c.a : c.b))} wide and ${pm(2 * (c.axis === 'x' ? c.b : c.a))} tall`);
    for (const l of c.asymptotes) guideLine(l, c.show.asymptotes ?? 'none', 'the branches approach it');
    if (c.directrix) guideLine(c.directrix, c.show.directrix ?? 'none', 'on the outer side of the turning point, not touching the curve');
    if (c.symmetryAxis) guideLine(c.symmetryAxis, c.show.axis ?? 'none', 'the curve is symmetric about it');
    if (c.type === 'circle' && c.show.radius !== 'none') {
      const s = c.show.radius;
      if (s === 'value') printed.push(`segment label: "${pm(c.r)}"`);
      else if (s === 'mark') printed.push('segment label: "r"');
      else printed.push(`segment label: ${BLANK}`);
      out.push(`  a segment from the centre to the curve, labelled ${s === 'value' ? `"${pm(c.r)}"` : s === 'mark' ? '"r"' : 'with a blank "?" box'}`);
    }
  });
  m.lines.forEach((l, i) => {
    if (l.label) printed.push(`line label: "${l.label}"`);
    out.push(`  a solid straight line${l.label ? ` "${l.label}"` : m.lines.length > 1 ? ` ${i + 1}` : ''}, ${lineWords(l)}`);
  });
  for (const q of m.points) {
    if (q.label) printed.push(`point label: "${q.label}"`);
    out.push(`  a marked point${q.label ? ` "${q.label}"` : ''} at ${xy(q.x, q.y)}`);
  }
  return m.conics.length > 1 ? 'two curves on a coordinate grid' : 'a curve on a coordinate grid';
}

const conicArg = (m: ConicModel, a: P): Conic => m.conics[argIndex(a, 'conic', m.conics.length, 'conic')];
/** The implicit function of a conic: zero on the curve. */
function implicit(c: Conic): (x: number, y: number) => number {
  if (c.type === 'circle') return (x, y) => (x - c.h) ** 2 + (y - c.k) ** 2 - c.r * c.r;
  if (c.type === 'parabola') return c.axis === 'y' ? (x, y) => (x - c.h) ** 2 - 4 * c.p * (y - c.k) : (x, y) => (y - c.k) ** 2 - 4 * c.p * (x - c.h);
  const [sx, sy] = c.axis === 'x' ? [c.a, c.b] : [c.b, c.a];
  if (c.type === 'ellipse') return (x, y) => ((x - c.h) / sx) ** 2 + ((y - c.k) / sy) ** 2 - 1;
  return c.axis === 'x' ? (x, y) => ((x - c.h) / sx) ** 2 - ((y - c.k) / sy) ** 2 - 1 : (x, y) => ((y - c.k) / sy) ** 2 - ((x - c.h) / sx) ** 2 - 1;
}
/** Points along a conic that lie inside the plot, branch by branch. */
function traced(c: Conic, m: ConicModel): Array<Array<[number, number]>> {
  const N = 4000;
  const out: Array<Array<[number, number]>> = [];
  const reach = Math.max(m.xRange[1] - m.xRange[0], m.yRange[1] - m.yRange[0]) * 1.5 + Math.abs(c.h) + Math.abs(c.k);
  if (c.type === 'circle' || c.type === 'ellipse') {
    const [sx, sy] = c.type === 'circle' ? [c.r, c.r] : c.axis === 'x' ? [c.a, c.b] : [c.b, c.a];
    // Started off the axes (no sample lands exactly on a symmetric touching point) and run one step past closing.
    out.push(Array.from({ length: N + 2 }, (_, j) => [c.h + sx * Math.cos(0.37 + (2 * Math.PI * j) / N), c.k + sy * Math.sin(0.37 + (2 * Math.PI * j) / N)] as [number, number]));
  } else if (c.type === 'hyperbola') {
    const T = Math.asinh(reach / c.b);
    for (const s of [-1, 1]) out.push(Array.from({ length: N + 1 }, (_, j) => { const t = -T + (2 * T * j) / N; return (c.axis === 'x' ? [c.h + s * c.a * Math.cosh(t), c.k + c.b * Math.sinh(t)] : [c.h + c.b * Math.sinh(t), c.k + s * c.a * Math.cosh(t)]) as [number, number]; }));
  } else {
    out.push(Array.from({ length: N + 1 }, (_, j) => { const s = -reach + (2 * reach * j) / N; return (c.axis === 'y' ? [c.h + s, c.k + (s * s) / (4 * c.p)] : [c.h + (s * s) / (4 * c.p), c.k + s]) as [number, number]; }));
  }
  return out;
}

const MEASURES = ['a', 'b', 'c', 'radius', 'diameter', 'major_axis', 'minor_axis', 'transverse_axis', 'conjugate_axis', 'focal_distance', 'eccentricity', 'p', 'focal_width'] as const;

const CONIC_CHECKERS: Record<string, Batch4CheckerDef> = {
  conic_type: {
    kinds: ['conic_graph'], args: '{ conic?: index (0) }', returns: 'the kind of conic section: circle, ellipse, hyperbola or parabola',
    run: (s, a) => label(conicArg(modelOf(s, conicModel), a).type),
  },
  conic_center: {
    kinds: ['conic_graph'], args: '{ conic?: index (0) }', returns: 'the centre of a circle, ellipse or hyperbola as "(h, k)"',
    run: (s, a) => {
      const c = conicArg(modelOf(s, conicModel), a);
      if (!c.center) return fail('a parabola has no centre — use conic_point with feature "vertex"');
      return text(c.center.coords);
    },
  },
  conic_point: {
    kinds: ['conic_graph'], args: '{ conic?: index (0), feature: vertex | co_vertex | focus, which?: 0 | 1 (0 = the left / lower one) }',
    returns: 'the coordinates of a vertex, co-vertex or focus as "(x, y)" — exact ("(√7, 0)") when its square is a whole number, else to two decimals',
    run: (s, a) => {
      const c = conicArg(modelOf(s, conicModel), a);
      const feature = pick(a, 'feature', ['vertex', 'co_vertex', 'focus'] as const);
      const list = feature === 'vertex' ? c.vertices : feature === 'co_vertex' ? c.coVertices : c.foci;
      if (list.length === 0) return fail(`${art(c.type)} has no ${feature.replace('_', '-')}`);
      return text(list[argIndex(a, 'which', list.length, `${feature.replace('_', '-')} of the ${c.type}`)].coords);
    },
  },
  conic_measure: {
    kinds: ['conic_graph'], args: `{ conic?: index (0), want: ${MEASURES.join(' | ')} }`,
    returns: 'a length or ratio of the conic: a, b, c (centre to focus), a circle\'s radius / diameter, the full axis lengths, the distance between the foci, the eccentricity (a ratio of whole numbers is exact — key it as a fraction), a parabola\'s p (signed: negative when it opens down or left) or focal width |4p|',
    run: (s, a) => {
      const c = conicArg(modelOf(s, conicModel), a);
      const want = pick(a, 'want', MEASURES);
      const no = (): never => fail(`"${want}" is not a measure of ${art(c.type)}`);
      switch (want) {
        case 'radius': return c.type === 'circle' ? measured(c.r) : no();
        case 'diameter': return c.type === 'circle' ? measured(2 * c.r) : no();
        case 'a': return c.type === 'ellipse' || c.type === 'hyperbola' ? measured(c.a) : no();
        case 'b': return c.type === 'ellipse' || c.type === 'hyperbola' ? measured(c.b) : no();
        case 'c': return c.type === 'ellipse' || c.type === 'hyperbola' ? measured(c.c) : no();
        case 'major_axis': return c.type === 'ellipse' ? measured(2 * c.a) : no();
        case 'minor_axis': return c.type === 'ellipse' ? measured(2 * c.b) : no();
        case 'transverse_axis': return c.type === 'hyperbola' ? measured(2 * c.a) : no();
        case 'conjugate_axis': return c.type === 'hyperbola' ? measured(2 * c.b) : no();
        case 'focal_distance': return c.type === 'ellipse' || c.type === 'hyperbola' ? measured(2 * c.c) : no();
        case 'eccentricity': return c.type === 'circle' ? num(0) : c.type === 'parabola' ? num(1) : ratioValue(c.c / c.a);
        case 'p': return c.type === 'parabola' ? measured(c.p) : no();
        default: return c.type === 'parabola' ? measured(Math.abs(4 * c.p)) : no();
      }
    },
  },
  conic_orientation: {
    kinds: ['conic_graph'], args: '{ conic?: index (0) }', returns: 'the way a parabola opens (up / down / left / right), the way a hyperbola opens (left and right / up and down), or the direction of an ellipse\'s major axis (horizontal / vertical)',
    run: (s, a) => {
      const c = conicArg(modelOf(s, conicModel), a);
      if (c.type === 'circle') return fail('a circle has no orientation');
      return label(c.type === 'ellipse' ? (c.axis === 'x' ? 'horizontal' : 'vertical') : OPENS(c));
    },
  },
  conic_asymptote: {
    kinds: ['conic_graph'], args: '{ conic?: index (0), which: positive | negative (the sign of its slope), want?: slope | equation (slope) }', returns: 'the slope of one asymptote of a hyperbola (exact — key a non-terminating slope as a fraction), or its equation as "y = …"',
    run: (s, a) => {
      const c = conicArg(modelOf(s, conicModel), a);
      if (c.type !== 'hyperbola') return fail(`${art(c.type)} has no asymptotes`);
      const l = c.asymptotes[pick(a, 'which', ['positive', 'negative'] as const) === 'positive' ? 0 : 1];
      return pick(a, 'want', ['slope', 'equation'] as const, 'slope') === 'slope' ? ratioValue(l.slope) : text(l.equation);
    },
  },
  conic_line: {
    kinds: ['conic_graph'], args: '{ conic?: index (0), want: directrix | axis }', returns: 'the equation of a parabola\'s directrix, or of the axis of symmetry (the major / transverse axis of an ellipse / hyperbola), as "x = …" or "y = …"',
    run: (s, a) => {
      const c = conicArg(modelOf(s, conicModel), a);
      const want = pick(a, 'want', ['directrix', 'axis'] as const);
      const l = want === 'directrix' ? c.directrix : c.symmetryAxis;
      if (!l) return fail(`${art(c.type)} has no ${want === 'directrix' ? 'directrix in this figure' : 'single axis of symmetry'}`);
      return text(l.equation);
    },
  },
  conic_equation: {
    kinds: ['conic_graph'], args: '{ conic?: index (0) }', returns: 'the standard-form equation as text, e.g. "(x − 2)² + (y + 1)² = 16", "x²/25 + y²/9 = 1", "(y − 1)²/9 − (x − 3)²/4 = 1", "(x − 1)² = 12(y + 2)"',
    run: (s, a) => text(conicArg(modelOf(s, conicModel), a).equation),
  },
  conic_line_intersections: {
    kinds: ['conic_graph'], args: '{ conic?: index (0), line?: index (0), want?: count | point (count), which?: 0 | 1 (0 = the one further left) }',
    returns: 'how many points a drawn line shares with the conic (0, 1 or 2), or one of those points as "(x, y)" — a point is refused unless its coordinates terminate within four decimals',
    run: (s, a) => {
      const m = modelOf(s, conicModel);
      const c = conicArg(m, a);
      if (m.lines.length === 0) return fail('the figure has no line (lines: [])');
      const pts = lineConicIntersections(c, m.lines[argIndex(a, 'line', m.lines.length, 'line')]);
      if (pick(a, 'want', ['count', 'point'] as const, 'count') === 'count') return num(pts.length);
      if (pts.length === 0) return fail('the line does not meet the conic');
      const [x, y] = pts[argIndex(a, 'which', pts.length, 'intersection point')];
      const exact = (v: number): boolean => Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-6;
      if (!exact(x) || !exact(y)) return fail(`the intersection is at about ${xy(x, y)} — not a point that can be read exactly`);
      return text(xy(Math.round(x * 1e4) / 1e4, Math.round(y * 1e4) / 1e4));
    },
  },
  conic_conic_intersections: {
    kinds: ['conic_graph'], args: '{}', returns: 'how many points the two conics of the figure share inside the plot — refused when they touch (or nearly touch) without crossing, which a drawing cannot settle',
    run: (s) => {
      const m = modelOf(s, conicModel);
      if (m.conics.length !== 2) return fail('this needs a figure with two conics');
      const F = implicit(m.conics[1]);
      const inside = (x: number, y: number): boolean => x >= m.xRange[0] && x <= m.xRange[1] && y >= m.yRange[0] && y <= m.yRange[1];
      const scale = Math.max(m.xRange[1] - m.xRange[0], m.yRange[1] - m.yRange[0]);
      let crossings = 0;
      for (const branch of traced(m.conics[0], m)) {
        const vals = branch.map(([x, y]) => F(x, y));
        const closed = m.conics[0].type === 'circle' || m.conics[0].type === 'ellipse';
        for (let j = 1; j < branch.length - (closed ? 1 : 0); j++) {
          const [x, y] = branch[j];
          if (!inside(x, y)) continue;
          if (vals[j - 1] === 0) continue;
          if (vals[j] === 0 || vals[j - 1] * vals[j] < 0) crossings++;
          // A local minimum of |F| that does not change sign but comes very close: a tangency.
          else if (j + 1 < branch.length && vals[j] * vals[j + 1] > 0 && Math.abs(vals[j]) < Math.abs(vals[j - 1]) && Math.abs(vals[j]) <= Math.abs(vals[j + 1])) {
            const g = Math.hypot((F(x + 1e-6, y) - F(x, y)) / 1e-6, (F(x, y + 1e-6) - F(x, y)) / 1e-6) || 1;
            if (Math.abs(vals[j]) / g < scale * 0.012) return fail(`the two curves touch or nearly touch near ${xy(x, y)} without crossing — the drawing cannot settle how many points they share`);
          }
        }
      }
      return num(crossings);
    },
  },
};

// ── venn_diagram ────────────────────────────────────────────────────────────

const VENN_WANTS = ['set', 'only', 'union', 'intersection', 'neither', 'total', 'exactly_one', 'complement'] as const;
type VennWant = (typeof VENN_WANTS)[number];

function vennText(m: VennModel, printed: string[], out: string[]): string {
  for (const s of m.sets) printed.push(`set name: "${s}"`);
  if (m.universeLabel) printed.push(`corner label: "${m.universeLabel}"`);
  out.push(`  ${m.sets.length === 2 ? 'two' : 'three'} overlapping circles inside a rectangle, named ${m.sets.map((s) => `"${s}"`).join(', ')}${m.universeLabel ? `; "${m.universeLabel}" is printed in a corner of the rectangle` : ''}`);
  const where = (g: VennModel['regions'][number]): string => {
    if (g.mask === 0) return 'outside every circle';
    const others = m.sets.filter((s) => !g.in.includes(s));
    return `inside ${g.in.map((s) => `"${s}"`).join(' and ')}${others.length ? ` but outside ${others.map((s) => `"${s}"`).join(' and ')}` : ''}`;
  };
  for (let mask = 0; mask < 1 << m.sets.length; mask++) {
    const g = m.regions.find((x) => x.mask === mask);
    const fake = { mask, in: m.sets.filter((_, i) => mask & (1 << i)), value: 0, show: 'none' as const, shade: false };
    const shade = g?.shade ? ' (this region is hatched)' : '';
    if (!g || g.show === 'none') out.push(`  the region ${where(g ?? fake)}: no number${shade}`);
    else if (g.show === 'blank') {
      printed.push(`region value: ${BLANK}`);
      out.push(`  the region ${where(g)}: a blank "?" box${shade}`);
    } else {
      printed.push(`region value: "${pm(g.value)}"`);
      out.push(`  the region ${where(g)}: ${pm(g.value)}${shade}`);
    }
  }
  return 'a Venn diagram';
}

/** Which regions (masks) an event covers. */
function vennSelect(m: VennModel, a: P, wantKey: string, setsKey: string): number[] {
  const want = pick(a, wantKey, VENN_WANTS) as VennWant;
  const raw = a[setsKey];
  const names = raw === undefined ? [] : Array.isArray(raw) ? raw.map(String) : [String(raw)];
  const bits = names.map((n) => {
    const k = m.sets.indexOf(n.trim());
    if (k < 0) fail(`derivation argument "${setsKey}" names "${n}", which is not one of the sets (${m.sets.join(', ')})`);
    return 1 << k;
  });
  const all = Array.from({ length: 1 << m.sets.length }, (_, k) => k);
  const need = (n: number, what: string): void => { if (bits.length < n) fail(`"${want}" needs ${what} in "${setsKey}"`); };
  const mine = bits.reduce((x, y) => x | y, 0);
  switch (want) {
    case 'total': return all;
    case 'neither': return bits.length ? all.filter((k) => (k & mine) === 0) : [0];
    case 'set': need(1, 'one set'); if (bits.length !== 1) fail('"set" takes exactly one set'); return all.filter((k) => k & bits[0]);
    case 'complement': need(1, 'one set'); if (bits.length !== 1) fail('"complement" takes exactly one set'); return all.filter((k) => !(k & bits[0]));
    case 'only': need(1, 'the set(s) the region is inside'); return [mine];
    case 'union': need(2, 'two or more sets'); return all.filter((k) => k & mine);
    case 'intersection': need(2, 'two or more sets'); return all.filter((k) => (k & mine) === mine);
    default: return all.filter((k) => [...Array(m.sets.length).keys()].filter((i) => k & (1 << i)).length === 1);
  }
}
/** The sum over regions; every one must be printed as a value (`allow`: the one region the question itself asks for). */
function vennSum(m: VennModel, masks: number[], allow?: number): number {
  let total = 0;
  for (const mask of masks) {
    const g = m.regions.find((x) => x.mask === mask);
    const name = mask === 0 ? 'outside every circle' : `inside ${m.sets.filter((_, i) => mask & (1 << i)).join(' and ')} only`;
    if (!g) return fail(`the region ${name} has no value in the figure — it cannot be counted`);
    if (g.show !== 'value' && mask !== allow) return fail(`the region ${name} is not printed (it is ${g.show === 'blank' ? 'a "?"' : 'left empty'}) — the figure does not settle this`);
    total += g.value;
  }
  return total;
}

const VENN_CHECKERS: Record<string, Batch4CheckerDef> = {
  venn_region: {
    kinds: ['venn_diagram'], args: '{ in: string[] (the sets the region is inside; [] = outside every set) }',
    returns: 'the number of ONE region — also when that region is the "?" of the figure (the stem must then give what settles it, e.g. the total)',
    run: (s, a) => {
      const m = modelOf(s, vennModel);
      const [mask] = vennSelect(m, { want: Array.isArray(a.in) && a.in.length === 0 ? 'neither' : 'only', sets: a.in ?? [] }, 'want', 'sets');
      if (m.regions.filter((g) => g.show !== 'value' && g.mask !== mask).length > 0 && m.regions.find((g) => g.mask === mask)?.show !== 'value') return fail('another region is hidden as well — one "?" cannot be worked out while a second number is missing');
      return ratioValue(vennSum(m, [mask], mask));
    },
  },
  venn_count: {
    kinds: ['venn_diagram'], args: `{ want: ${VENN_WANTS.join(' | ')}, sets?: string[] }`,
    returns: 'the total over the regions of an event — a whole set, only that part, a union, an intersection, neither, exactly one set, a complement, or everything; every region it needs must be printed',
    run: (s, a) => {
      const m = modelOf(s, vennModel);
      return ratioValue(vennSum(m, vennSelect(m, a, 'want', 'sets')));
    },
  },
  venn_probability: {
    kinds: ['venn_diagram'], args: `{ want: ${VENN_WANTS.join(' | ')}, sets?: string[], givenWant?: (the same list), givenSets?: string[] }`,
    returns: 'P(event), or P(event | given) when a condition is named — from counts (÷ the total) or from printed probabilities; a fraction that does not terminate is exact, so the key must be written as a fraction',
    run: (s, a) => {
      const m = modelOf(s, vennModel);
      const event = vennSelect(m, a, 'want', 'sets');
      if (a.givenWant === undefined) {
        const all = vennSelect(m, { want: 'total' }, 'want', 'sets');
        const whole = m.values === 'probability' ? 1 : vennSum(m, all);
        if (!(whole > 0)) return fail('the total is 0');
        return ratioValue(vennSum(m, event) / whole);
      }
      const given = vennSelect(m, a, 'givenWant', 'givenSets');
      const base = vennSum(m, given);
      if (!(base > 0)) return fail('the condition has probability 0');
      return ratioValue(vennSum(m, event.filter((k) => given.includes(k))) / base);
    },
  },
};

// ── probability_tree ────────────────────────────────────────────────────────

function treeText(m: TreeModel, printed: string[], out: string[]): string {
  for (const t of m.stageTitles) printed.push(`stage title: "${t}"`);
  out.push(`  a tree read left to right, ${plural(m.depth, 'stage')}${m.stageTitles.length ? ` headed ${m.stageTitles.map((t) => `"${t}"`).join(', ')}` : ''}`);
  const walk = (nodes: TreeNode[], from: string, indent: string): void => {
    for (const n of nodes) {
      printed.push(`branch label: "${n.label}"`);
      if (n.show === 'value') printed.push(`branch probability: "${n.pText}"`);
      if (n.show === 'blank') printed.push(`branch probability: ${BLANK}`);
      const leaf = n.children.length === 0
        ? `${n.outcome ? `; outcome "${n.outcome}" printed beside it` : ''}${n.product === 'value' ? `; "${n.pathText}" printed at the end of the path` : n.product === 'blank' ? '; a blank "?" box at the end of the path' : ''}`
        : '';
      if (n.outcome) printed.push(`outcome label: "${n.outcome}"`);
      if (n.children.length === 0 && n.product === 'value') printed.push(`path value: "${n.pathText}"`);
      if (n.children.length === 0 && n.product === 'blank') printed.push(`path value: ${BLANK}`);
      out.push(`${indent}from ${from}: a branch to "${n.label}", ${n.show === 'value' ? `with ${n.pText} on it` : n.show === 'blank' ? 'with a blank "?" box on it' : 'with nothing on it'}${leaf}`);
      walk(n.children, `"${n.label}"`, `${indent}  `);
    }
  };
  walk(m.branches, 'the start', '  ');
  return 'a probability tree diagram';
}

/** Every node of the tree with its siblings. */
function flat(m: TreeModel): Array<{ node: TreeNode; siblings: TreeNode[]; parent?: TreeNode }> {
  const out: Array<{ node: TreeNode; siblings: TreeNode[]; parent?: TreeNode }> = [];
  const walk = (nodes: TreeNode[], parent?: TreeNode): void => {
    for (const n of nodes) {
      out.push({ node: n, siblings: nodes, parent });
      walk(n.children, n);
    }
  };
  walk(m.branches);
  return out;
}
function nodeAt(m: TreeModel, a: P, key = 'path'): TreeNode {
  const raw = a[key];
  if (!Array.isArray(raw) || raw.length === 0) return fail(`derivation argument "${key}" must be the branch labels from the start, e.g. ["R", "G"]`);
  let nodes = m.branches;
  let node: TreeNode | undefined;
  for (const l of raw) {
    node = nodes.find((n) => n.label === String(l).trim());
    if (!node) return fail(`derivation argument "${key}": there is no branch "${String(l)}" at that point of the tree (branches there: ${nodes.map((n) => n.label).join(', ') || 'none'})`);
    nodes = node.children;
  }
  return node as TreeNode;
}
/** A branch's probability can be READ when it is printed, or when all its siblings are (they total 1). */
function readable(m: TreeModel, n: TreeNode): boolean {
  if (n.show === 'value') return true;
  const sib = flat(m).find((f) => f.node === n)?.siblings ?? [];
  return sib.every((x) => x === n || x.show === 'value');
}
function needPath(m: TreeModel, n: TreeNode): void {
  const all = flat(m);
  let cur: TreeNode | undefined = n;
  while (cur) {
    if (!readable(m, cur)) fail(`the probability on the branch to "${cur.label}" (path ${cur.path.join(' → ')}) is not printed and cannot be had from its neighbours — the figure does not settle this`);
    cur = all.find((f) => f.node === cur)?.parent;
  }
}
/** The nodes carrying `label` at a stage (1 = the first split). */
function atStage(m: TreeModel, a: P, labelKey: string, stageKey: string): TreeNode[] {
  const l = a[labelKey];
  if (typeof l !== 'string' || !l.trim()) return fail(`derivation argument "${labelKey}" must be a branch label printed on the tree`);
  const stage = a[stageKey] === undefined ? m.depth : a[stageKey];
  if (!isNum(stage) || !Number.isInteger(stage) || stage < 1 || stage > m.depth) return fail(`derivation argument "${stageKey}" must be a stage number, 1 to ${m.depth}`);
  const hits = flat(m).map((f) => f.node).filter((n) => n.path.length === stage && n.label === l.trim());
  if (hits.length === 0) return fail(`no branch of stage ${stage} is labelled "${l}"`);
  return hits;
}
const leavesUnder = (n: TreeNode): TreeNode[] => (n.children.length === 0 ? [n] : n.children.flatMap(leavesUnder));
const exactTree = (m: TreeModel): boolean => flat(m).every((f) => !!f.node.frac);
const treeValue = (m: TreeModel, v: number): ReturnType<typeof num> => (exactTree(m) ? ratioValue(v) : measured(v));

const TREE_CHECKERS: Record<string, Batch4CheckerDef> = {
  tree_path: {
    kinds: ['probability_tree'], args: '{ path: string[] (branch labels from the start) }', returns: 'the product of the probabilities along one path',
    run: (s, a) => {
      const m = modelOf(s, treeModel);
      const n = nodeAt(m, a);
      needPath(m, n);
      return treeValue(m, n.pathP);
    },
  },
  tree_branch: {
    kinds: ['probability_tree'], args: '{ path: string[] (branch labels from the start, ending with the branch asked for) }',
    returns: 'the probability ON one branch — the one a "?" hides: 1 minus its printed neighbours, or the printed end-of-path value divided by the rest of the path',
    run: (s, a) => {
      const m = modelOf(s, treeModel);
      const n = nodeAt(m, a);
      if (readable(m, n)) return treeValue(m, n.p);
      const all = flat(m);
      const parent = all.find((f) => f.node === n)?.parent;
      if (n.children.length === 0 && n.product === 'value' && (!parent || (needPath(m, parent), true))) return treeValue(m, n.p);
      return fail(`the branch to "${n.label}" is hidden and so is one of its neighbours (and no end-of-path value is printed for it) — the figure does not settle it`);
    },
  },
  tree_outcome: {
    kinds: ['probability_tree'], args: '{ label: string, stage?: number (the last stage) }', returns: 'the total probability that the given stage ends on a branch with that label (the sum over every path that does)',
    run: (s, a) => {
      const m = modelOf(s, treeModel);
      const hits = atStage(m, a, 'label', 'stage');
      for (const n of hits) needPath(m, n);
      return treeValue(m, hits.reduce((t, n) => t + n.pathP, 0));
    },
  },
  tree_conditional: {
    kinds: ['probability_tree'], args: '{ label: string, stage?: number (last), givenLabel: string, givenStage?: number (last) }',
    returns: 'P(the stage `stage` branch is `label` | the stage `givenStage` branch is `givenLabel`) — read straight off the tree when the condition comes first, by Bayes\' rule when it comes later',
    run: (s, a) => {
      const m = modelOf(s, treeModel);
      const want = atStage(m, a, 'label', 'stage');
      const given = atStage(m, a, 'givenLabel', 'givenStage');
      const givenLeaves = new Set(given.flatMap(leavesUnder));
      const wantLeaves = want.flatMap(leavesUnder);
      // Leaves of a shorter branch count for the stages they pass through only.
      for (const n of [...givenLeaves, ...wantLeaves]) needPath(m, n);
      const base = [...givenLeaves].reduce((t, n) => t + n.pathP, 0);
      if (!(base > 0)) return fail('the condition has probability 0');
      return treeValue(m, wantLeaves.filter((n) => givenLeaves.has(n)).reduce((t, n) => t + n.pathP, 0) / base);
    },
  },
};

export const PART: Batch4Part = {
  kinds: ['conic_graph', 'venn_diagram', 'probability_tree'],
  describe: (spec: PracticeFigureSpec, printed: string[], out: string[]): string => {
    switch (spec.type) {
      case 'conic_graph': return conicText(modelOf(spec, conicModel), printed, out);
      case 'venn_diagram': return vennText(modelOf(spec, vennModel), printed, out);
      case 'probability_tree': return treeText(modelOf(spec, treeModel), printed, out);
      default: return '';
    }
  },
  checkers: { ...CONIC_CHECKERS, ...VENN_CHECKERS, ...TREE_CHECKERS },
};
