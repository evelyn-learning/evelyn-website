/**
 * Batch 6, part "stemplot" (stemplot): the TEXT transcription and the
 * deterministic checkers. Conventions: figure-core-batch4-kit.ts.
 *
 * A stemplot is DATA: every leaf is a value, so the transcription gives the
 * key, the headings and every row exactly as printed, and the checkers
 * compute from the very model the renderer draws (`stemplotModel`).
 *
 * Statistics follow AP Statistics:
 *   - quartiles by the AP method — Q1 / Q3 are the medians of the lower /
 *     upper half; when n is odd the overall median is in neither half;
 *   - outliers by the 1.5 × IQR rule — strictly below Q1 − 1.5·IQR or above
 *     Q3 + 1.5·IQR; a value exactly ON a fence is refused (students split on it);
 *   - shape only by an explicit rule (stem_shape), refusing what is borderline.
 *
 * A back-to-back plot needs `side`: "left", "right", a group label, or "all"
 * (both groups pooled). A "?" leaf (one value left out) is known only to lie
 * between its neighbours on its row: a count it cannot change is read; every
 * other statistic is refused, except stem_missing_leaf, which solves it from
 * a stated mean.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import '../lib/no-db-env';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { stemplotModel, type StemplotModel } from '../../src/lib/tutor/practice-figure/kinds/stemplot';
import { argNum, fail, fmt, label, measured, modelOf, num, nums, pick, type Batch4CheckerDef, type Batch4Part, type P } from './figure-core-batch4-kit';

const model = (spec: PracticeFigureSpec): StemplotModel => modelOf(spec, stemplotModel);

// ── transcription ───────────────────────────────────────────────────────────

const halfNote = (h?: 'low' | 'high'): string => (h === 'low' ? '   (leaves 0–4)' : h === 'high' ? '   (leaves 5–9)' : '');

function describe(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  if (spec.type !== 'stemplot') return '';
  const m = model(spec);
  if (m.title) printed.push(`title: "${m.title}"`);
  printed.push(`key: "${m.keyText}"`);
  // A back-to-back plot's group labels are named in the kind phrase (returned below), not listed again.
  if (m.stemLabel) printed.push(`column heading: "${m.stemLabel}"`);
  if (m.leafLabel) printed.push(`column heading: "${m.leafLabel}"`);
  for (const st of [...new Set(m.rows.map((r) => r.stem))]) printed.push(`stem: "${st}"`);
  const counts = m.sides.map((s) => s.leaves.flat().length);
  const blank = m.sides.some((s) => s.leaves.some((l) => l.includes('?')));
  const stems = `stems ${m.rows[0].stem} to ${m.rows[m.rows.length - 1].stem}${m.split ? ', split (each stem on two rows: leaves 0–4, then 5–9)' : ''}`;
  if (!m.backToBack) {
    out.push(`A stem-and-leaf plot of ${counts[0]} values${blank ? ' (one of them hidden)' : ''} on ${m.rows.length} rows (${stems}); each leaf is one value, value = (stem × 10 + leaf) × ${fmt(m.leafUnit)}.`);
  } else {
    out.push(`A back-to-back stem-and-leaf plot on ${m.rows.length} shared rows (${stems}): ${counts[0]} values of "${m.sides[0].label}" to the left of the stems (read outward from the stem, increasing to the left) and ${counts[1]} values of "${m.sides[1].label}" to the right${blank ? '; one value is hidden' : ''}; value = (stem × 10 + leaf) × ${fmt(m.leafUnit)}.`);
  }
  out.push(`Key, printed under the plot: "${m.keyText}".`);
  if (!m.ordered) out.push('The leaves are NOT in order on their rows (drawn as given).');
  out.push(m.backToBack ? 'Rows, top to bottom, as printed (left leaves | stem | right leaves):' : 'Rows, top to bottom, as printed (stem | leaves):');
  m.rows.forEach((row, i) => {
    const right = m.sides[m.backToBack ? 1 : 0].leaves[i].join(' ');
    const line = m.backToBack ? `${[...m.sides[0].leaves[i]].reverse().join(' ')} | ${row.stem} | ${right}` : `${row.stem} | ${right}`;
    out.push(`  ${line}${halfNote(row.half)}`);
  });
  if (blank) out.push('One leaf is left out and shown as a "?" box; no value is printed there.');
  return m.backToBack
    ? `a back-to-back stem-and-leaf plot, "${m.sides[0].label}" on the left and "${m.sides[1].label}" on the right`
    : 'a stem-and-leaf plot';
}

// ── data ────────────────────────────────────────────────────────────────────

/** The values of the chosen side(s), in leaf units (stem × 10 + leaf), sorted; the "?" leaf as the range it can take. */
interface Data { m: StemplotModel; units: number[]; blank?: { lo: number; hi: number }; n: number }

function sidesOf(m: StemplotModel, a: P): number[] {
  const v = a.side;
  if (!m.backToBack) {
    if (v === undefined || v === null || v === 'all') return [0];
    return fail('the plot has one set of leaves — leave out "side"');
  }
  const labels = m.sides.map((s) => `"${s.label}"`).join(', ');
  if (v === undefined || v === null) return fail(`a back-to-back plot needs "side": "left", "right", "all" or a group label (${labels})`);
  if (typeof v === 'string') {
    const s = v.trim();
    if (s === 'left') return [0];
    if (s === 'right') return [1];
    if (s === 'all') return [0, 1];
    const hit = m.sides.findIndex((x) => x.label === s);
    if (hit >= 0) return [hit];
  }
  return fail(`derivation argument "side" must be "left", "right", "all" or a group label (${labels})`);
}

function dataOf(spec: PracticeFigureSpec, a: P): Data {
  const m = model(spec);
  const units: number[] = [];
  let blank: Data['blank'];
  for (const k of sidesOf(m, a)) {
    m.sides[k].leaves.forEach((row, i) => {
      const base = m.rows[i].stem * 10;
      const h = m.rows[i].half;
      const [lo0, hi0] = h === 'low' ? [0, 4] : h === 'high' ? [5, 9] : [0, 9];
      row.forEach((l, j) => {
        if (l !== '?') { units.push(base + l); return; }
        const before = row.slice(0, j).filter((x): x is number => x !== '?');
        const after = row.slice(j + 1).filter((x): x is number => x !== '?');
        blank = m.ordered
          ? { lo: base + Math.max(lo0, ...before), hi: base + Math.min(hi0, ...after) }
          : { lo: base + lo0, hi: base + hi0 };
      });
    });
  }
  units.sort((x, y) => x - y);
  return { m, units, blank, n: units.length + (blank ? 1 : 0) };
}
/** The value of a number of leaf units. */
const val = (d: Data, u: number): number => Number((u * d.m.leafUnit).toPrecision(12));
const sum = (xs: number[]): number => xs.reduce((t, v) => t + v, 0);

function complete(d: Data): number[] {
  if (d.blank) return fail(`a leaf is left out on the figure (a "?" box, a value from ${fmt(val(d, d.blank.lo))} to ${fmt(val(d, d.blank.hi))}) — this cannot be read from the plot; use stem_missing_leaf when a mean is given`);
  if (d.units.length === 0) return fail('this side of the plot has no values');
  return d.units;
}
const medianOf = (xs: number[]): number => (xs.length % 2 ? xs[(xs.length - 1) / 2] : (xs[xs.length / 2 - 1] + xs[xs.length / 2]) / 2);
/** Q1 and Q3 by the AP method (in leaf units). */
function quartiles(xs: number[]): [number, number] {
  if (xs.length < 4) return fail(`quartiles need at least 4 values (has ${xs.length})`);
  const h = Math.floor(xs.length / 2);
  return [medianOf(xs.slice(0, h)), medianOf(xs.slice(xs.length - h))];
}

const STATS = ['n', 'min', 'max', 'range', 'median', 'q1', 'q3', 'iqr', 'mean', 'sum'] as const;
type Stat = (typeof STATS)[number];
/** A statistic, in VALUE units (not leaf units). */
function statOf(d: Data, stat: Stat): number {
  if (stat === 'n') return d.n;
  const xs = complete(d);
  const u = ((): number => {
    switch (stat) {
      case 'min': return xs[0];
      case 'max': return xs[xs.length - 1];
      case 'range': return xs[xs.length - 1] - xs[0];
      case 'median': return medianOf(xs);
      case 'q1': return quartiles(xs)[0];
      case 'q3': return quartiles(xs)[1];
      case 'iqr': { const [q1, q3] = quartiles(xs); return q3 - q1; }
      case 'mean': return sum(xs) / xs.length;
      case 'sum': return sum(xs);
      default: return fail(`unknown statistic ${String(stat)}`);
    }
  })();
  return stat === 'mean' ? (u * d.m.leafUnit) : val(d, u);
}
const statDerived = (d: Data, stat: Stat) => (stat === 'mean' ? measured(statOf(d, stat)) : num(statOf(d, stat)));

const OPS: Record<string, 'gt' | 'ge' | 'lt' | 'le' | 'eq' | 'between'> = { gt: 'gt', '>': 'gt', ge: 'ge', '>=': 'ge', '≥': 'ge', lt: 'lt', '<': 'lt', le: 'le', '<=': 'le', '≤': 'le', eq: 'eq', '=': 'eq', between: 'between' };

function fences(d: Data): { lower: number; upper: number; xs: number[] } {
  const xs = complete(d);
  const [q1, q3] = quartiles(xs);
  const iqr = q3 - q1;
  return { lower: val(d, q1 - 1.5 * iqr), upper: val(d, q3 + 1.5 * iqr), xs: xs.map((u) => val(d, u)) };
}

/** The shape word, or a refusal. See stem_shape's `returns`. */
function shapeOf(d: Data): string {
  const xs = complete(d);
  if (xs.length < 10) return fail(`a shape word needs at least 10 values (has ${xs.length})`);
  const [q1, q3] = quartiles(xs);
  const iqr = q3 - q1;
  const med = medianOf(xs);
  const mean = sum(xs) / xs.length;
  const a = q1 - xs[0];
  const b = xs[xs.length - 1] - q3;
  if (!(iqr > 0) || !(a + b > 0)) return fail('the middle half (or the tails) of the data have no spread — the figure does not settle a shape word');
  const s1 = (mean - med) / iqr;
  const s2 = (b - a) / (b + a);
  if (Math.abs(s1) < 0.1 && Math.abs(s2) <= 0.2) return 'symmetric';
  if (s1 >= 0.1 && s2 >= 1 / 3) return 'skewed right';
  if (s1 <= -0.1 && s2 <= -1 / 3) return 'skewed left';
  return fail(`the shape is borderline — (mean − median) / IQR = ${s1.toFixed(2)} and the tail balance (upper − lower) / (upper + lower) = ${s2.toFixed(2)} do not clearly agree on one word; do not key a shape for this plot`);
}

function needBackToBack(m: StemplotModel, name: string): void {
  if (!m.backToBack) fail(`${name} needs a back-to-back plot (left and right)`);
}

// ── checkers ────────────────────────────────────────────────────────────────

const SIDE = 'side?: "left" | "right" | group label | "all" (required on a back-to-back plot)';
const K = ['stemplot'];
const checkers: Record<string, Batch4CheckerDef> = {
  stem_values: {
    kinds: K, args: `{ ${SIDE} }`, returns: 'every value on the plot (stem × 10 + leaf, times the leaf unit), smallest first',
    run: (s, a) => { const d = dataOf(s, a); return nums(complete(d).map((u) => val(d, u))); },
  },
  stem_stat: {
    kinds: K, args: `{ ${SIDE}, stat: ${STATS.join(' | ')} }`,
    returns: 'a statistic of the values: n (the count — read even with a "?" leaf), min, max, range (max − min), median, q1 / q3 / iqr by the AP method (the median of each half; when n is odd the overall median is in neither half), mean (exact when it terminates within 4 decimals, else a rounded value), sum',
    run: (s, a) => statDerived(dataOf(s, a), pick(a, 'stat', STATS)),
  },
  stem_five_number: {
    kinds: K, args: `{ ${SIDE} }`, returns: 'the five-number summary min, Q1, median, Q3, max (AP method)',
    run: (s, a) => { const d = dataOf(s, a); return nums((['min', 'q1', 'median', 'q3', 'max'] as const).map((k) => statOf(d, k))); },
  },
  stem_mode: {
    kinds: K, args: `{ ${SIDE} }`, returns: 'the mode(s): every value that appears most often; refused when every value appears once',
    run: (s, a) => {
      const d = dataOf(s, a);
      const xs = complete(d);
      const c = new Map<number, number>();
      for (const x of xs) c.set(x, (c.get(x) ?? 0) + 1);
      const top = Math.max(...c.values());
      if (top === 1) return fail('every value appears once — there is no mode');
      return nums([...c].filter(([, k]) => k === top).map(([u]) => val(d, u)));
    },
  },
  stem_count_where: {
    kinds: K, args: `{ ${SIDE}, op: gt | ge | lt | le | eq | between (or > >= < <= =), value: number, to?: number (between: value ≤ x ≤ to), as?: count | proportion | percent }`,
    returns: 'how many values satisfy the comparison (between is inclusive at both ends), or that count as a proportion / percent of n; a "?" leaf is counted only when every value it could be gives the same answer',
    run: (s, a) => {
      const d = dataOf(s, a);
      const op = OPS[String(a.op ?? '').trim()];
      if (!op) return fail(`derivation argument "op" must be one of gt, ge, lt, le, eq, between (or >, >=, <, <=, =)`);
      const v = argNum(a, 'value');
      let to = 0;
      if (op === 'between') {
        to = argNum(a, 'to');
        if (!(to > v)) return fail('derivation argument "to" must be greater than "value"');
      }
      const ok = (x: number): boolean => (op === 'gt' ? x > v : op === 'ge' ? x >= v : op === 'lt' ? x < v : op === 'le' ? x <= v : op === 'eq' ? Math.abs(x - v) < 1e-9 : x >= v - 1e-9 && x <= to + 1e-9);
      let k = d.units.filter((u) => ok(val(d, u))).length;
      if (d.blank) {
        const hits = new Set<boolean>();
        for (let u = d.blank.lo; u <= d.blank.hi; u++) hits.add(ok(val(d, u)));
        if (hits.size > 1) return fail(`a leaf is left out (a "?" box: a value from ${fmt(val(d, d.blank.lo))} to ${fmt(val(d, d.blank.hi))}) — the figure does not settle whether it counts`);
        if (hits.has(true)) k++;
      }
      const as = pick(a, 'as', ['count', 'proportion', 'percent'] as const, 'count');
      return as === 'count' ? num(k) : as === 'proportion' ? num(k / d.n) : num((100 * k) / d.n);
    },
  },
  stem_rank: {
    kinds: K, args: `{ ${SIDE}, rank: whole number (1 = the first), from?: smallest | largest }`, returns: 'the value at that rank, counting from the smallest (default) or the largest',
    run: (s, a) => {
      const d = dataOf(s, a);
      const xs = complete(d);
      const k = a.rank;
      if (typeof k !== 'number' || !Number.isInteger(k) || k < 1 || k > xs.length) return fail(`derivation argument "rank" must be a whole number from 1 to ${xs.length}`);
      const from = pick(a, 'from', ['smallest', 'largest'] as const, 'smallest');
      return num(val(d, from === 'smallest' ? xs[k - 1] : xs[xs.length - k]));
    },
  },
  stem_fence: {
    kinds: K, args: `{ ${SIDE}, which: lower | upper }`, returns: 'the outlier fence Q1 − 1.5 × IQR (lower) or Q3 + 1.5 × IQR (upper), AP quartiles',
    run: (s, a) => { const f = fences(dataOf(s, a)); return num(pick(a, 'which', ['lower', 'upper'] as const) === 'lower' ? f.lower : f.upper); },
  },
  stem_outliers: {
    kinds: K, args: `{ ${SIDE}, which?: both | low | high }`,
    returns: 'the outliers by the 1.5 × IQR rule (strictly beyond a fence; AP quartiles), or the label "none"; refused when a value sits exactly on a fence',
    run: (s, a) => {
      const f = fences(dataOf(s, a));
      const which = pick(a, 'which', ['both', 'low', 'high'] as const, 'both');
      const onLow = f.xs.find((x) => Math.abs(x - f.lower) < 1e-9);
      const onHigh = f.xs.find((x) => Math.abs(x - f.upper) < 1e-9);
      if (which !== 'high' && onLow !== undefined) return fail(`the value ${fmt(onLow)} sits exactly on the lower fence (${fmt(f.lower)}) — whether it is an outlier is a matter of convention; do not key it`);
      if (which !== 'low' && onHigh !== undefined) return fail(`the value ${fmt(onHigh)} sits exactly on the upper fence (${fmt(f.upper)}) — whether it is an outlier is a matter of convention; do not key it`);
      const out = f.xs.filter((x) => (which !== 'high' && x < f.lower) || (which !== 'low' && x > f.upper));
      return out.length ? nums(out) : label('none');
    },
  },
  stem_shape: {
    kinds: K, args: `{ ${SIDE} }`,
    returns: 'a shape word, ONLY when two measures agree clearly (n ≥ 10, AP quartiles): with s1 = (mean − median) / IQR and s2 = (upper tail − lower tail) / (upper tail + lower tail), tails max − Q3 and Q1 − min — "symmetric" when |s1| < 0.1 and |s2| ≤ 0.2; "skewed right" when s1 ≥ 0.1 and s2 ≥ 1/3; "skewed left" when s1 ≤ −0.1 and s2 ≤ −1/3; anything else is refused as borderline',
    run: (s, a) => label(shapeOf(dataOf(s, a))),
  },
  stem_compare: {
    kinds: K, args: `{ stat: ${STATS.filter((x) => x !== 'sum').join(' | ')}, which?: greater | less }`, returns: 'the group label of the side with the greater (default) or the lesser statistic (AP quartiles); refused on a tie',
    run: (s, a) => {
      const m = model(s);
      needBackToBack(m, 'stem_compare');
      const stat = pick(a, 'stat', STATS.filter((x) => x !== 'sum'));
      const which = pick(a, 'which', ['greater', 'less'] as const, 'greater');
      const [l, r] = [0, 1].map((k) => statOf(dataOf(s, { side: m.sides[k].label }), stat));
      if (Math.abs(l - r) < 1e-9) return fail(`both sides have the same ${stat} (${fmt(l)})`);
      const [A, B] = m.sides.map((x) => ` ${(x.label as string).toLowerCase()} `);
      if (A.includes(B.trim()) || B.includes(A.trim())) return fail('one group label contains the other — an answer naming one would name both');
      return label(m.sides[(l > r) === (which === 'greater') ? 0 : 1].label as string);
    },
  },
  stem_compare_difference: {
    kinds: K, args: `{ stat: ${STATS.filter((x) => x !== 'sum').join(' | ')} }`, returns: 'how much the two sides\' statistic differs: |left − right| (AP quartiles)',
    run: (s, a) => {
      const m = model(s);
      needBackToBack(m, 'stem_compare_difference');
      const stat = pick(a, 'stat', STATS.filter((x) => x !== 'sum'));
      const [l, r] = [0, 1].map((k) => statOf(dataOf(s, { side: m.sides[k].label }), stat));
      return measured(Math.abs(l - r));
    },
  },
  stem_missing_leaf: {
    kinds: K, args: `{ ${SIDE}, mean: number (the mean stated in the question) }`, returns: 'the value hidden by the "?" leaf: n × mean − the sum of the other values; refused when that is not a value its row can hold',
    run: (s, a) => {
      const d = dataOf(s, a);
      if (!d.blank) return fail('no leaf is left out on this plot (or on this side)');
      const mean = argNum(a, 'mean');
      const x = Number(((mean * d.n) / d.m.leafUnit - sum(d.units)).toPrecision(12));
      if (!Number.isInteger(x) || x < d.blank.lo || x > d.blank.hi) return fail(`the hidden value would be ${fmt(Number((x * d.m.leafUnit).toPrecision(12)))} — not a value the row's "?" can hold (${fmt(val(d, d.blank.lo))} to ${fmt(val(d, d.blank.hi))}); check the mean`);
      return num(val(d, x));
    },
  },
};

export const PART: Batch4Part = { kinds: ['stemplot'], describe, checkers };
