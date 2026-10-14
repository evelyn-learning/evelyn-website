/**
 * Batch 6, part "polygon" (coordinate_polygon): the TEXT transcription and the
 * deterministic checkers. Conventions: figure-core-batch4-kit.ts.
 *
 * What the grid SETTLES: the coordinates of a vertex or marked point that
 * sits on a numbered gridline (or whose coordinates are printed); lengths,
 * perimeters and areas from those coordinates (a length is exact when it is
 * whole — a radical or a rounded value only when asked for); the image of a
 * vertex under a transformation the item STATES; the one transformation of
 * the four families that maps one drawn polygon onto another vertex by
 * vertex in list order (refused when none or several fit — the refusal
 * names every fit); whether a stated sequence does; the scale factor,
 * congruence and orientation of two drawn polygons; the lines and the order
 * of rotational symmetry of one.
 *
 * Vertex correspondence is by LIST ORDER (vertex i of one polygon ↔ vertex i
 * of the other); when both are labelled, the labels must agree with it once
 * primes are dropped (P ↔ P′), or the checker refuses.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import '../lib/no-db-env';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import {
  applySequence, identifyTransforms, mapsOnto, numText, onGrid, parseTransform, polygonModel, ptText, sequenceName, transformName,
  type PolygonModel, type Pt, type Transform,
} from '../../src/lib/tutor/practice-figure/kinds/coordinate-polygon';
import { approx, fail, isNum, label, modelOf, num, pick, text, type Batch4CheckerDef, type Batch4Part, type P } from './figure-core-batch4-kit';

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
const SHAPE = ['', '', 'segment', 'triangle', 'quadrilateral', 'pentagon', 'hexagon', 'heptagon', 'octagon'];
const shapeOf = (n: number): string => SHAPE[n];
const plural = (w: string): string => `${w}s`;
const model = (spec: PracticeFigureSpec): PolygonModel => modelOf(spec, polygonModel);

function kindPhrase(m: PolygonModel): string {
  const counts = new Map<string, number>();
  for (const g of m.polygons) counts.set(shapeOf(g.vertices.length), (counts.get(shapeOf(g.vertices.length)) ?? 0) + 1);
  const shapes = [...counts].map(([w, n]) => `${WORDS[n]} ${n === 1 ? w : plural(w)}`);
  const extra: string[] = [];
  if (m.lines.length) extra.push(`${WORDS[m.lines.length]} ${m.lines.length === 1 ? 'line' : 'lines'}`);
  if (m.arrows.length) extra.push(`${WORDS[m.arrows.length]} ${m.arrows.length === 1 ? 'arrow' : 'arrows'}`);
  const all = [...shapes, ...extra];
  const list = all.length === 1 ? all[0] : `${all.slice(0, -1).join(', ')} and ${all[all.length - 1]}`;
  return `a coordinate grid with ${list}`;
}

/** A coordinate as a reader can take it off the grid. */
const readOf = (m: PolygonModel, v: number): string => (onGrid(m, v) || m.showVertexCoordinates ? numText(v) : `about ${numText(v)} (between gridlines)`);

function describe(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  if (spec.type !== 'coordinate_polygon') return '';
  const m = model(spec);
  if (m.title) printed.push(`title: "${m.title}"`);
  printed.push(`axis label: "${m.xLabel}"`, `axis label: "${m.yLabel}"`);
  out.push(`Coordinate grid: x from ${numText(m.xRange[0])} to ${numText(m.xRange[1])}, y from ${numText(m.yRange[0])} to ${numText(m.yRange[1])}; gridlines every ${numText(m.step)} ${m.step === 1 ? 'unit' : 'units'} on both axes, numbered; the cells are squares.`);
  m.polygons.forEach((g, j) => {
    if (g.name) printed.push(`caption: "${g.name}"`);
    if (g.labels) g.labels.forEach((l) => printed.push(`vertex label: "${l}"`));
    if (m.showVertexCoordinates) g.vertices.forEach((v) => printed.push(`vertex coordinates: "${ptText(v)}"`));
    const vs = g.vertices.map((v, i) => `${g.labels ? `${g.labels[i]} ` : ''}(${readOf(m, v[0])}, ${readOf(m, v[1])})`).join(', ');
    out.push(`${shapeOf(g.vertices.length).replace(/^./, (c) => c.toUpperCase())} ${j + 1}${g.name ? ` (captioned "${g.name}" in the legend)` : ''}: ${g.style} outline${g.shade ? ', shaded' : ''}; vertices in order: ${vs}.`);
  });
  m.lines.forEach((l) => {
    if (l.label) printed.push(`line label: "${l.label}"`);
    const where = l.kind === 'vertical' ? `the vertical line x = ${numText(l.p1[0])}` : l.kind === 'horizontal' ? `the horizontal line y = ${numText(l.p1[1])}` : `the line through ${ptText(l.p1)} and ${ptText(l.p2)}`;
    out.push(`A dashed grey guide line: ${where}${l.label ? `, labelled "${l.label}"` : ''}.`);
  });
  m.points.forEach((q) => {
    printed.push(`point label: "${q.label}"`);
    out.push(`A black dot labelled ${q.label} at (${readOf(m, q.x)}, ${readOf(m, q.y)}).`);
  });
  m.arrows.forEach((a) => {
    if (a.label) printed.push(`arrow label: "${a.label}"`);
    out.push(`An arrow from ${ptText(a.from)} to ${ptText(a.to)}${a.label ? `, labelled "${a.label}"` : ''}.`);
  });
  return kindPhrase(m);
}

// ── arguments ───────────────────────────────────────────────────────────────

const normLabel = (s: string): string => s.trim().replace(/''/g, '″').replace(/'/g, '′');
const stripPrimes = (s: string): string => s.replace(/[′″‴]/g, '');

/** A polygon by its index or its caption; with one polygon it may be left out. */
function polyArg(m: PolygonModel, a: P, k: string): number {
  const v = a[k];
  if (v === undefined && m.polygons.length === 1) return 0;
  if (isNum(v) && Number.isInteger(v) && v >= 0 && v < m.polygons.length) return v;
  if (typeof v === 'string') {
    const hit = m.polygons.findIndex((g) => g.name === v.trim());
    if (hit >= 0) return hit;
  }
  if (v === undefined) return fail(`name the polygon: derivation argument "${k}" must be its 0-based index (0 to ${m.polygons.length - 1}) or its caption`);
  return fail(`derivation argument "${k}" must be the 0-based index (0 to ${m.polygons.length - 1}) or the caption of a polygon${m.polygons.some((g) => g.name) ? ` (${m.polygons.filter((g) => g.name).map((g) => `"${g.name}"`).join(', ')})` : ''}`);
}

/** A place on the figure: a vertex label, a point label, or { polygon, index }. */
function placeArg(m: PolygonModel, a: P, k = 'vertex'): { at: Pt; polygon: number | null; index: number; name: string } {
  if (a[k] !== undefined) {
    if (typeof a[k] !== 'string') return fail(`derivation argument "${k}" must be a vertex or point label printed on the figure`);
    const want = normLabel(a[k] as string);
    for (let j = 0; j < m.polygons.length; j++) {
      const i = m.polygons[j].labels?.indexOf(want) ?? -1;
      if (i >= 0) return { at: m.polygons[j].vertices[i], polygon: j, index: i, name: want };
    }
    const q = m.points.find((p) => p.label === want);
    if (q) return { at: [q.x, q.y], polygon: null, index: -1, name: want };
    return fail(`no vertex or point is labelled "${want}" — the labels are ${[...m.polygons.flatMap((g) => g.labels ?? []), ...m.points.map((p) => p.label)].map((l) => `"${l}"`).join(', ') || '(none)'}`);
  }
  const j = polyArg(m, a, 'polygon');
  const g = m.polygons[j];
  const v = a.index;
  if (!isNum(v) || !Number.isInteger(v) || v < 0 || v >= g.vertices.length) return fail(`give "${k}" (a label) or "polygon" and "index" (the 0-based index of a vertex, 0 to ${g.vertices.length - 1})`);
  return { at: g.vertices[v], polygon: j, index: v, name: g.labels ? g.labels[v] : `vertex ${v} of polygon ${j}` };
}

/** The coordinates of a place, refused when the grid cannot settle them. */
function readable(m: PolygonModel, at: Pt, name: string): Pt {
  if (!m.showVertexCoordinates && (!onGrid(m, at[0]) || !onGrid(m, at[1]))) fail(`${name} lies between gridlines — its coordinates can only be estimated (put it on a gridline, or set showVertexCoordinates)`);
  return at;
}
const readPoly = (m: PolygonModel, j: number): Pt[] => m.polygons[j].vertices.map((v, i) => readable(m, v, `vertex ${m.polygons[j].labels?.[i] ?? i} of polygon ${j}`));

function transformArg(v: unknown, name: string): Transform {
  try { return parseTransform(v, name); } catch (e) { return fail(`derivation argument ${(e as Error).message}`); }
}
function stepsArg(v: unknown, name: string): Transform[] {
  if (!Array.isArray(v) || v.length < 1 || v.length > 4) return fail(`derivation argument "${name}" must be a list of 1 to 4 transformations, applied in order`);
  return v.map((t, i) => transformArg(t, `${name}[${i}]`));
}
/** The image under the stated `transform` or `steps`. */
function stated(a: P): Transform[] {
  if (a.transform !== undefined && a.steps !== undefined) return fail('give "transform" or "steps", not both');
  if (a.transform !== undefined) return [transformArg(a.transform, 'transform')];
  if (a.steps !== undefined) return stepsArg(a.steps, 'steps');
  return fail('give the transformation the item states: derivation argument "transform" (one) or "steps" (a list, in order)');
}

/** The pair (from, to) of two different polygons with the same number of vertices whose labels (if any) correspond. */
function pairArg(m: PolygonModel, a: P, kf = 'from', kt = 'to'): { i: number; j: number; from: Pt[]; to: Pt[] } {
  const i = polyArg(m, a, kf);
  const j = polyArg(m, a, kt);
  if (i === j) return fail(`"${kf}" and "${kt}" must name two different polygons`);
  const [A, B] = [m.polygons[i], m.polygons[j]];
  if (A.vertices.length !== B.vertices.length) return fail(`polygon ${i} has ${A.vertices.length} vertices and polygon ${j} has ${B.vertices.length} — no transformation matches them vertex for vertex`);
  if (A.labels && B.labels && A.labels.some((l, k) => stripPrimes(l) !== stripPrimes((B.labels as string[])[k]))) {
    return fail(`the vertex labels do not correspond in list order (${A.labels.join(', ')} → ${B.labels.join(', ')}) — list the image's vertices in the order of the pre-image's`);
  }
  return { i, j, from: readPoly(m, i), to: readPoly(m, j) };
}

const d2 = (a: Pt, b: Pt): number => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
const close = (a: number, b: number): boolean => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
const signedArea = (vs: Pt[]): number => vs.reduce((t, v, i) => t + v[0] * vs[(i + 1) % vs.length][1] - vs[(i + 1) % vs.length][0] * v[1], 0) / 2;

/** √n simplified ("2√5"), for a whole n; null when n is not whole. */
function radical(n: number): string | null {
  const N = Math.round(n);
  if (!close(N, n) || N <= 0) return null;
  let out = 1;
  let rest = N;
  for (let f = 2; f * f <= rest; f++) while (rest % (f * f) === 0) { out *= f; rest /= f * f; }
  return rest === 1 ? String(out) : `${out === 1 ? '' : out}√${rest}`;
}
/** A length from its square: exact when whole (or a terminating decimal), else as `allow` says. */
function lengthOf(sq: number, allow: string, what: string): ReturnType<typeof num> {
  const L = Math.sqrt(sq);
  if (close(Math.round(L * 1e4) / 1e4, L) && close((Math.round(L * 1e4) / 1e4) ** 2, sq)) return num(Math.round(L * 1e4) / 1e4);
  if (allow === 'approx') return approx(L);
  if (allow === 'radical') {
    const r = radical(sq);
    return r ? text(r) : fail(`${what} is √${numText(sq)} — not a whole number under the root; use allow: "approx"`);
  }
  return fail(`${what} is ${radical(sq) ?? `√${numText(sq)}`}, not a whole number — pass allow: "radical" (key "${radical(sq) ?? ''}") or allow: "approx" (a rounded key)`);
}

/** Similar in list order: every pairwise distance scaled by one factor. Returns the factor, or null. */
function ratioInOrder(a: Pt[], b: Pt[]): number | null {
  let k: number | null = null;
  for (let i = 0; i < a.length; i++) {
    for (let j = i + 1; j < a.length; j++) {
      const r = Math.sqrt(d2(b[i], b[j]) / d2(a[i], a[j]));
      if (k === null) k = r;
      else if (!close(k, r)) return null;
    }
  }
  return k;
}

/** The sides of a polygon as unordered pairs of points. */
const edgesOf = (vs: Pt[]): Array<[Pt, Pt]> => (vs.length === 2 ? [[vs[0], vs[1]]] : vs.map((v, i) => [v, vs[(i + 1) % vs.length]] as [Pt, Pt]));
const samePt = (a: Pt, b: Pt): boolean => Math.abs(a[0] - b[0]) < 1e-7 && Math.abs(a[1] - b[1]) < 1e-7;
/** Does the map carry the polygon's set of sides onto itself? */
function selfMap(vs: Pt[], f: (p: Pt) => Pt): boolean {
  const E = edgesOf(vs);
  return E.every(([a, b]) => {
    const [fa, fb] = [f(a), f(b)];
    return E.some(([c, d]) => (samePt(fa, c) && samePt(fb, d)) || (samePt(fa, d) && samePt(fb, c)));
  });
}
function noStraightVertex(vs: Pt[]): void {
  if (vs.length < 3) return;
  vs.forEach((v, i) => {
    const [p, q] = [vs[(i + vs.length - 1) % vs.length], vs[(i + 1) % vs.length]];
    if (Math.abs((v[0] - p[0]) * (q[1] - p[1]) - (v[1] - p[1]) * (q[0] - p[0])) < 1e-9) fail(`vertex ${i} lies on a straight side — the symmetry of the drawn shape is not settled by its vertex list; leave that vertex out`);
  });
}
const centroid = (vs: Pt[]): Pt => [vs.reduce((t, v) => t + v[0], 0) / vs.length, vs.reduce((t, v) => t + v[1], 0) / vs.length];

function symmetryLines(vs: Pt[]): number {
  const g = centroid(vs);
  // A line of symmetry passes through the centroid, and either through a vertex or across the
  // perpendicular bisector of vertex 0 and its image.
  const dirs: Pt[] = [];
  for (const v of vs) if (!samePt(v, g)) dirs.push([v[0] - g[0], v[1] - g[1]]);
  for (const v of vs.slice(1)) dirs.push([-(v[1] - vs[0][1]), v[0] - vs[0][0]]);
  const found: Pt[] = [];
  for (const [dx, dy] of dirs) {
    const L = Math.hypot(dx, dy);
    if (L < 1e-12) continue;
    const u: Pt = [dx / L, dy / L];
    if (found.some((w) => Math.abs(w[0] * u[1] - w[1] * u[0]) < 1e-9)) continue;
    const refl = (p: Pt): Pt => {
      const [x, y] = [p[0] - g[0], p[1] - g[1]];
      const dot = x * u[0] + y * u[1];
      return [g[0] + 2 * dot * u[0] - x, g[1] + 2 * dot * u[1] - y];
    };
    if (selfMap(vs, refl)) found.push(u);
  }
  return found.length;
}
function rotationOrder(vs: Pt[]): number {
  const g = centroid(vs);
  const a0 = Math.atan2(vs[0][1] - g[1], vs[0][0] - g[0]);
  const r0 = Math.hypot(vs[0][0] - g[0], vs[0][1] - g[1]);
  const angles: number[] = [];
  for (const v of vs) {
    if (!close(Math.hypot(v[0] - g[0], v[1] - g[1]), r0)) continue;
    const th = Math.atan2(v[1] - g[1], v[0] - g[0]) - a0;
    const rot = (p: Pt): Pt => {
      const [x, y] = [p[0] - g[0], p[1] - g[1]];
      return [g[0] + x * Math.cos(th) - y * Math.sin(th), g[1] + x * Math.sin(th) + y * Math.cos(th)];
    };
    const norm = ((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    if (selfMap(vs, rot) && !angles.some((a) => Math.abs(a - norm) < 1e-7 || Math.abs(Math.abs(a - norm) - 2 * Math.PI) < 1e-7)) angles.push(norm);
  }
  return angles.length;
}

const yesNo = (b: boolean) => label(b ? 'yes' : 'no');
/** A coordinate pair as a key writes it, or one coordinate of it. */
function coordOut(at: Pt, a: P) {
  if (a.coordinate === undefined) return text(ptText(at));
  return num(pick(a, 'coordinate', ['x', 'y'] as const) === 'x' ? at[0] : at[1]);
}

const K = ['coordinate_polygon'];
const checkers: Record<string, Batch4CheckerDef> = {
  poly_vertex: {
    kinds: K, args: '{ vertex: label (of a vertex or a marked point) } or { polygon: index or caption, index: 0-based vertex }, coordinate?: "x" | "y"', returns: 'the coordinates "(x, y)" (text; minus signs and spacing are free), or one coordinate as a number; refused for a place between gridlines unless coordinates are printed',
    run: (s, a) => {
      const m = model(s);
      const p = placeArg(m, a);
      return coordOut(readable(m, p.at, `"${p.name}"`), a);
    },
  },
  poly_side_length: {
    kinds: K, args: '{ from: vertex label, to: vertex label } or { polygon, side: i (from vertex i to vertex i + 1) }, allow?: "exact" (default) | "radical" | "approx"', returns: 'the length of a side or segment between two vertices of one polygon: a whole (or terminating) number; else "√13" / "2√5" text with allow "radical", a rounded value with allow "approx"; refused otherwise',
    run: (s, a) => {
      const m = model(s);
      const allow = pick(a, 'allow', ['exact', 'radical', 'approx'] as const, 'exact');
      let A: Pt;
      let B: Pt;
      let what: string;
      if (a.from !== undefined || a.to !== undefined) {
        const p = placeArg(m, a, 'from');
        const q = placeArg(m, a, 'to');
        if (p.polygon === null || p.polygon !== q.polygon) return fail(`"${p.name}" and "${q.name}" are not on one polygon`);
        [A, B, what] = [readable(m, p.at, `"${p.name}"`), readable(m, q.at, `"${q.name}"`), `${p.name}${q.name}`];
      } else {
        const j = polyArg(m, a, 'polygon');
        const vs = readPoly(m, j);
        const i = a.side;
        const sides = vs.length === 2 ? 1 : vs.length;
        if (!isNum(i) || !Number.isInteger(i) || i < 0 || i >= sides) return fail(`derivation argument "side" must be 0 to ${sides - 1} (side i joins vertex i to vertex i + 1)`);
        [A, B, what] = [vs[i], vs[(i + 1) % vs.length], `side ${i}`];
      }
      return lengthOf(d2(A, B), allow, `the length of ${what}`);
    },
  },
  poly_perimeter: {
    kinds: K, args: '{ polygon?: index or caption, allow?: "exact" | "approx" }', returns: 'the perimeter (sum of the sides); exact when every side is a whole number, a rounded value with allow "approx"; refused otherwise',
    run: (s, a) => {
      const m = model(s);
      const j = polyArg(m, a, 'polygon');
      const vs = readPoly(m, j);
      if (vs.length < 3) return fail('a segment has no perimeter — use poly_side_length');
      const allow = pick(a, 'allow', ['exact', 'approx'] as const, 'exact');
      const sides = edgesOf(vs).map(([p, q]) => Math.sqrt(d2(p, q)));
      const exact = sides.every((L) => close(Math.round(L * 1e4) / 1e4, L));
      const total = sides.reduce((t, L) => t + L, 0);
      if (exact) return num(Math.round(total * 1e4) / 1e4);
      return allow === 'approx' ? approx(total) : fail('a side of the polygon is not a whole number, so neither is the perimeter — pass allow: "approx" for a rounded key');
    },
  },
  poly_area: {
    kinds: K, args: '{ polygon?: index or caption }', returns: 'the area enclosed (shoelace formula, exact)',
    run: (s, a) => {
      const m = model(s);
      const vs = readPoly(m, polyArg(m, a, 'polygon'));
      if (vs.length < 3) return fail('a segment has no area');
      return num(Math.abs(signedArea(vs)));
    },
  },
  poly_image_vertex: {
    kinds: K, args: '{ vertex: label (or polygon + index), transform: T or steps: [T, …], coordinate?: "x" | "y" } — T is { translate: [a, b] } | { reflect: "x-axis" | "y-axis" | "y = x" | "y = −x" | "x = a" | "y = b" | "y = x + c" | "y = −x + c" } | { rotate: 90 | 180 | 270 | −90, direction?: "ccw" | "cw", about?: [x, y] } | { dilate: k, about?: [x, y] }', returns: 'the image "(x, y)" of the vertex under the transformation(s) the item STATES (or one coordinate as a number); counterclockwise is positive',
    run: (s, a) => {
      const m = model(s);
      const p = placeArg(m, a);
      return coordOut(applySequence(stated(a), readable(m, p.at, `"${p.name}"`)), a);
    },
  },
  poly_identify: {
    kinds: K, args: '{ from: polygon, to: polygon, form?: "name" (default) | "rule" | "type" }', returns: 'the ONE transformation mapping "from" onto "to" vertex for vertex: name "translation by (6, −4)" / "reflection across the line y = x" / "reflection across the x-axis" / "rotation 90° counterclockwise about (0, 0)" / "rotation 180° about (0, 0)" / "rotation 90° clockwise about (0, 0)" / "dilation by scale factor 1/2 about (0, 0)"; rule "(x, y) → (−y, x)"; type "translation" | "reflection" | "rotation" | "dilation". Refused when none fits, or several (all named)',
    run: (s, a) => {
      const m = model(s);
      const { i, j, from, to } = pairArg(m, a);
      const form = pick(a, 'form', ['name', 'rule', 'type'] as const, 'name');
      if (from.every((p, k) => samePt(p, to[k]))) return fail(`polygons ${i} and ${j} coincide vertex for vertex`);
      const fits = identifyTransforms(from, to);
      if (fits.length === 0) return fail(`no single translation, reflection, rotation or dilation maps polygon ${i} onto polygon ${j} vertex for vertex — test a sequence with poly_sequence_maps`);
      if (fits.length > 1) return fail(`several transformations map polygon ${i} onto polygon ${j}: ${fits.map((t) => transformName(t)).join('; ')} — the figure does not settle which one is meant`);
      return form === 'type' ? label(transformName(fits[0], 'type')) : text(transformName(fits[0], form));
    },
  },
  poly_sequence_maps: {
    kinds: K, args: '{ from: polygon, to: polygon, steps: [T, …] (1–4, in order; T as for poly_image_vertex) }', returns: '"yes" when the stated sequence carries every vertex of "from" onto the matching vertex of "to", else "no"',
    run: (s, a) => {
      const m = model(s);
      const { from, to } = pairArg(m, a);
      return yesNo(mapsOnto(stepsArg(a.steps, 'steps'), from, to));
    },
  },
  poly_which_sequence: {
    kinds: K, args: '{ from: polygon, to: polygon, candidates: [[T, …], …] (the options, each a sequence) }', returns: 'the ONE candidate that maps "from" onto "to", in words ("reflection across the x-axis, then translation by (2, 0)" — write the options this way); refused when none or several do',
    run: (s, a) => {
      const m = model(s);
      const { from, to } = pairArg(m, a);
      if (!Array.isArray(a.candidates) || a.candidates.length < 1 || a.candidates.length > 6) return fail('derivation argument "candidates" must be a list of 1 to 6 sequences');
      const seqs = a.candidates.map((c, k) => stepsArg(c, `candidates[${k}]`));
      const ok = seqs.map((q, k) => (mapsOnto(q, from, to) ? k : -1)).filter((k) => k >= 0);
      if (ok.length === 0) return fail('none of the candidates maps the polygon onto the other');
      if (ok.length > 1) return fail(`candidates ${ok.join(' and ')} both map the polygon onto the other`);
      return text(sequenceName(seqs[ok[0]]));
    },
  },
  poly_scale_factor: {
    kinds: K, args: '{ from: polygon, to: polygon }', returns: 'the scale factor from "from" to "to" (image length ÷ pre-image length, the same for every pair of vertices); refused when they are not similar in list order',
    run: (s, a) => {
      const m = model(s);
      const { from, to } = pairArg(m, a);
      const k = ratioInOrder(from, to);
      if (k === null) return fail('the polygons are not similar with their vertices matched in list order');
      return num(k);
    },
  },
  poly_congruent: {
    kinds: K, args: '{ a: polygon, b: polygon, match?: "order" (default: vertex i ↔ vertex i) | "any" (any starting vertex, either direction) }', returns: '"yes" when the two are congruent (every distance between vertices equal under the matching), else "no"',
    run: (s, a) => {
      const m = model(s);
      const i = polyArg(m, a, 'a');
      const j = polyArg(m, a, 'b');
      if (i === j) return fail('"a" and "b" must name two different polygons');
      const [A, B] = [readPoly(m, i), readPoly(m, j)];
      if (A.length !== B.length) return label('no');
      const match = pick(a, 'match', ['order', 'any'] as const, 'order');
      const same = (b: Pt[]): boolean => ratioInOrder(A, b) !== null && close(ratioInOrder(A, b) as number, 1);
      if (match === 'order') return yesNo(same(B));
      const n = B.length;
      const variants: Pt[][] = [];
      for (let k = 0; k < n; k++) {
        variants.push(B.map((_, t) => B[(t + k) % n]));
        variants.push(B.map((_, t) => B[(k - t + n) % n]));
      }
      return yesNo(variants.some(same));
    },
  },
  poly_orientation: {
    kinds: K, args: '{ from: polygon, to: polygon }', returns: '"preserved" when the vertex order runs the same way round both polygons (a translation, rotation or dilation), "reversed" when it does not (a reflection); refused unless they are similar in list order',
    run: (s, a) => {
      const m = model(s);
      const { from, to } = pairArg(m, a);
      if (from.length < 3) return fail('orientation needs polygons with at least three vertices');
      if (ratioInOrder(from, to) === null) return fail('the polygons are not similar with their vertices matched in list order — no transformation pairs them');
      return label(Math.sign(signedArea(from)) === Math.sign(signedArea(to)) ? 'preserved' : 'reversed');
    },
  },
  poly_symmetry_lines: {
    kinds: K, args: '{ polygon?: index or caption }', returns: 'the number of lines of symmetry of the polygon as drawn (exact geometry; a segment has 2)',
    run: (s, a) => {
      const m = model(s);
      const vs = readPoly(m, polyArg(m, a, 'polygon'));
      noStraightVertex(vs);
      return num(symmetryLines(vs));
    },
  },
  poly_rotational_symmetry: {
    kinds: K, args: '{ polygon?: index or caption }', returns: 'the order of rotational symmetry: how many turns of less than 360° (counting the full turn once) map the polygon onto itself — 1 means none',
    run: (s, a) => {
      const m = model(s);
      const vs = readPoly(m, polyArg(m, a, 'polygon'));
      noStraightVertex(vs);
      return num(rotationOrder(vs));
    },
  },
};

export const PART: Batch4Part = { kinds: ['coordinate_polygon'], describe, checkers };
