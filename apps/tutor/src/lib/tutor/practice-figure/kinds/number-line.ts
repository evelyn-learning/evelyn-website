/**
 * number_line — points, intervals and rays on one numbered line; and
 * sign_chart — the sign of f, f′, f″ … on the intervals between critical
 * numbers.
 *
 * number_line
 * { min: number; max: number;
 *   step?: number;                  // spacing of the numbered ticks (default: a round step)
 *   minorStep?: number;             // unnumbered ticks between them
 *   denominator?: number (2–12);    // ticks every 1/denominator, labelled as fractions
 *                                   //   in lowest terms ("1/2", "3/4", "1"); replaces step
 *   labelOnly?: number[];           // number ONLY these ticks (the question asks for the rest)
 *   points?: Array<{ x: number; open?: boolean (false); label?: string }>;
 *   intervals?: Array<{ from: number | null; to: number | null;   // null = a ray, drawn with an arrow
 *                       fromOpen?: boolean (false); toOpen?: boolean (false) }>;
 *   title?: string }
 * A filled circle is an included end, an open circle an excluded one.
 *
 * sign_chart
 * { critical: Array<number | { value: number; label?: string }>;   // 1–6, increasing
 *   rows: Array<{ label: string;                     // "f′(x)"
 *                 signs: Array<'+' | '-' | ''>;      // the TRUE sign on each interval
 *                                                    //   (critical.length + 1 of them; '' = not shown)
 *                 at?: Array<'0' | 'und' | '+' | '-' | ''>;   // the value at each critical number
 *                 blankSigns?: number[];             // intervals whose sign is drawn as "?"
 *                 blankAt?: number[] }>;             // critical numbers whose value is drawn as "?"
 *   variable?: string ('x'); title?: string }
 * A blank is a dashed box with a question mark — the cell the item asks
 * for. The spec still carries the true sign under it, so the key can be
 * recomputed. The critical numbers are spaced EVENLY (a sign chart is not to
 * scale).
 */
import { FIGURE_WIDTH, LABEL_FS, SERIES_COLORS, TICK_FS, estWidth, n2, niceStep, tickTexts, ticksBetween } from '../plot-frame';
import type { Drawn, FigureFacts, Reader } from '../spec';
import { INK, MUTED, arrow, blank, fractionText, label, numText, text, titleBlock } from './draw';

/** The first and last tick sit this far in from the figure's sides. */
const LINE_INSET = 36;

export interface LinePoint {
  x: number;
  open: boolean;
  label?: string;
}
export interface LineInterval {
  from: number | null;
  to: number | null;
  fromOpen: boolean;
  toOpen: boolean;
}
export interface NumberLineModel {
  min: number;
  max: number;
  /** Every tick drawn, with the text under it ('' = unnumbered). */
  ticks: Array<{ x: number; text: string; major: boolean }>;
  tickSpacing: number;
  points: LinePoint[];
  intervals: LineInterval[];
  title?: string;
}

export function numberLineModel(r: Reader): NumberLineModel {
  const p = r.p;
  const min = r.num(p.min, 'min');
  const max = r.num(p.max, 'max');
  if (!(max > min)) r.fail('max must be greater than min');
  const span = max - min;
  let ticks: NumberLineModel['ticks'];
  let tickSpacing: number;
  const labelOnly = p.labelOnly === undefined || p.labelOnly === null ? null : r.list(p.labelOnly, 'labelOnly', 0, 40).map((v, i) => r.num(v, `labelOnly[${i}]`));
  if (p.denominator !== undefined && p.denominator !== null) {
    const den = r.num(p.denominator, 'denominator');
    if (!Number.isInteger(den) || den < 2 || den > 12) r.fail('denominator must be a whole number from 2 to 12');
    if (p.step !== undefined && p.step !== null) r.fail('give step or denominator, not both');
    tickSpacing = 1 / den;
    const first = Math.ceil(min * den - 1e-9);
    const last = Math.floor(max * den + 1e-9);
    if (last - first > 60) r.fail(`denominator ${den} over ${numText(min)}…${numText(max)} gives ${last - first + 1} ticks — more than 61 cannot be drawn`);
    ticks = [];
    for (let k = first; k <= last; k++) ticks.push({ x: k / den, text: fractionText(k, den), major: k % den === 0 });
  } else {
    const step = r.optStep(p.step, 'step') ?? niceStep(span, 12);
    const minor = r.optStep(p.minorStep, 'minorStep');
    if (span / step > 40) r.fail(`step ${step} gives more than 40 numbered ticks`);
    tickSpacing = minor ?? step;
    const majors = ticksBetween(min, max, step);
    const majorTexts = tickTexts(majors, step);
    ticks = majors.map((x, i) => ({ x, text: majorTexts[i], major: true }));
    if (minor) {
      if (span / minor > 80) r.fail(`minorStep ${minor} gives more than 80 ticks`);
      for (const x of ticksBetween(min, max, minor)) if (!majors.some((v) => Math.abs(v - x) < minor * 1e-6)) ticks.push({ x, text: '', major: false });
      ticks.sort((a, b) => a.x - b.x);
    }
  }
  if (labelOnly) {
    for (const [i, v] of labelOnly.entries()) if (!ticks.some((t) => Math.abs(t.x - v) < 1e-9)) r.fail(`labelOnly[${i}] (${v}) is not a tick of the line`);
    ticks = ticks.map((t) => (labelOnly.some((v) => Math.abs(v - t.x) < 1e-9) ? { ...t, text: p.denominator ? t.text : numText(t.x, 6) } : { ...t, text: '' }));
  }
  // Numbers thinned so that neighbours never touch (anchored on zero when it is a
  // numbered tick). Done HERE, not while drawing, so `ticks[].text` is exactly what is printed.
  const labelled = ticks.filter((k) => k.text);
  if (labelled.length > 1) {
    const perUnit = (FIGURE_WIDTH - 2 * LINE_INSET) / span;
    const widest = Math.max(...labelled.map((k) => estWidth(k.text, TICK_FS)));
    const gap = Math.min(...labelled.slice(1).map((k, i) => (k.x - labelled[i].x) * perUnit));
    const every = Math.max(1, Math.ceil((widest + 5) / gap));
    if (every > 1) {
      const zero = labelled.findIndex((k) => Math.abs(k.x) < 1e-9);
      const anchor = zero >= 0 ? zero % every : 0;
      const keep = new Set(labelled.filter((_, i) => (i - anchor) % every === 0));
      ticks = ticks.map((k) => (k.text && !keep.has(k) ? { ...k, text: '' } : k));
    }
  }
  const inRange = (v: number) => v >= min - 1e-9 && v <= max + 1e-9;
  const points = (p.points === undefined || p.points === null ? [] : r.list(p.points, 'points', 0, 12)).map((raw, i): LinePoint => {
    const o = r.obj(raw, `points[${i}]`);
    const x = r.num(o.x, `points[${i}].x`);
    if (!inRange(x)) r.fail(`points[${i}].x lies outside min..max`);
    return { x, open: r.bool(o.open, `points[${i}].open`, false), label: r.optStr(o.label, `points[${i}].label`, 12) };
  });
  const intervals = (p.intervals === undefined || p.intervals === null ? [] : r.list(p.intervals, 'intervals', 0, 6)).map((raw, i): LineInterval => {
    const o = r.obj(raw, `intervals[${i}]`);
    const at = `intervals[${i}]`;
    const from = o.from === null || o.from === undefined ? null : r.num(o.from, `${at}.from`);
    const to = o.to === null || o.to === undefined ? null : r.num(o.to, `${at}.to`);
    if (from !== null && to !== null && !(to > from)) r.fail(`${at}.to must be greater than from`);
    if ((from !== null && !inRange(from)) || (to !== null && !inRange(to))) r.fail(`${at}: an end lies outside min..max`);
    if ((from === null && o.fromOpen !== undefined && o.fromOpen !== null) || (to === null && o.toOpen !== undefined && o.toOpen !== null)) r.fail(`${at}: an end that runs on as a ray has no open / closed circle — leave fromOpen / toOpen out`);
    return { from, to, fromOpen: r.bool(o.fromOpen, `${at}.fromOpen`, false), toOpen: r.bool(o.toOpen, `${at}.toOpen`, false) };
  });
  return { min, max, ticks, tickSpacing, points, intervals, title: r.optStr(p.title, 'title', 160) };
}

const BLUE = SERIES_COLORS[0];

export function renderNumberLine(r: Reader): Drawn {
  const m = numberLineModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: NonNullable<FigureFacts['notes']> = [];
  const hasLabels = m.points.some((q) => q.label);
  const y = t.top + (hasLabels ? 36 : 20);
  const xa = LINE_INSET;
  const xb = W - LINE_INSET;
  const X = (v: number) => xa + ((v - m.min) / (m.max - m.min)) * (xb - xa);
  const parts: string[] = [t.svg];
  // The line runs on past both ends.
  parts.push(arrow(W / 2, y, 8, y, { width: 1.5, head: 8 }), arrow(W / 2, y, W - 8, y, { width: 1.5, head: 8 }));
  const tickPx = m.tickSpacing * ((xb - xa) / (m.max - m.min));
  if (tickPx < 10) notes.push({ code: 'too_many_elements', message: `the ticks are ${numText(tickPx, 1)} units apart — closer than 10 cannot be counted at 340 px` });
  for (const k of m.ticks) if (k.text) parts.push(text(X(k.x), y + 10 + TICK_FS, k.text, { anchor: 'middle', fill: INK }));
  for (const k of m.ticks) {
    const h = k.major || k.text ? 6 : 3.5;
    parts.push(`<line x1="${n2(X(k.x))}" y1="${n2(y - h)}" x2="${n2(X(k.x))}" y2="${n2(y + h)}" stroke="${INK}" stroke-width="${k.major ? 1.4 : 1}"/>`);
  }
  const circle = (x: number, open: boolean): string => `<circle cx="${n2(X(x))}" cy="${n2(y)}" r="5.2" fill="${open ? '#ffffff' : BLUE}" stroke="${BLUE}" stroke-width="2"/>`;
  const ends: string[] = [];
  for (const iv of m.intervals) {
    const a = iv.from === null ? 15 : X(iv.from);
    const b = iv.to === null ? W - 15 : X(iv.to);
    parts.push(`<path d="M${n2(a)},${n2(y)}H${n2(b)}" fill="none" stroke="${BLUE}" stroke-width="4.5"/>`);
    if (iv.from === null) parts.push(`<polygon points="${n2(4)},${n2(y)} ${n2(17)},${n2(y - 7)} ${n2(17)},${n2(y + 7)}" fill="${BLUE}"/>`);
    else ends.push(circle(iv.from, iv.fromOpen));
    if (iv.to === null) parts.push(`<polygon points="${n2(W - 4)},${n2(y)} ${n2(W - 17)},${n2(y - 7)} ${n2(W - 17)},${n2(y + 7)}" fill="${BLUE}"/>`);
    else ends.push(circle(iv.to, iv.toOpen));
  }
  parts.push(...ends);
  for (const q of m.points) {
    parts.push(circle(q.x, q.open));
    if (q.label) parts.push(label({ x: X(q.x), y: y - 13, anchor: 'middle' }, q.label, { fs: LABEL_FS, weight: 700, fill: BLUE }));
  }
  return { body: parts.join(''), H: y + 10 + TICK_FS + 16, facts: { curveCount: 0, marks: [], curves: [], notes } };
}

// ---------------------------------------------------------------------------
// sign_chart
// ---------------------------------------------------------------------------

export type SignCell = '+' | '-' | '';
export type AtCell = '0' | 'und' | '+' | '-' | '';

export interface SignChartModel {
  critical: Array<{ value: number; label: string }>;
  rows: Array<{ label: string; signs: SignCell[]; at: AtCell[]; blankSigns: boolean[]; blankAt: boolean[] }>;
  variable: string;
  title?: string;
}

export function signChartModel(r: Reader): SignChartModel {
  const p = r.p;
  const critical = r.list(p.critical, 'critical', 1, 6).map((raw, i) => {
    if (typeof raw === 'number') return { value: r.num(raw, `critical[${i}]`), label: numText(raw, 4) };
    const o = r.obj(raw, `critical[${i}]`);
    const value = r.num(o.value, `critical[${i}].value`);
    return { value, label: r.optStr(o.label, `critical[${i}].label`, 8) ?? numText(value, 4) };
  });
  critical.forEach((c, i) => {
    if (i > 0 && !(c.value > critical[i - 1].value)) r.fail('critical numbers must be in increasing order');
  });
  const n = critical.length;
  const rows = r.list(p.rows, 'rows', 1, 4).map((raw, i) => {
    const o = r.obj(raw, `rows[${i}]`);
    const at = `rows[${i}]`;
    const signs = Array.isArray(o.signs) ? (o.signs as unknown[]) : r.fail(`${at}.signs must be an array`);
    if (signs.length !== n + 1) r.fail(`${at}.signs must have ${n + 1} entries (one per interval), it has ${signs.length}`);
    signs.forEach((s, k) => {
      if (s !== '+' && s !== '-' && s !== '') r.fail(`${at}.signs[${k}] must be '+', '-' or '' (a blank is asked for with blankSigns)`);
    });
    const atIn = o.at === undefined || o.at === null ? new Array(n).fill('') : Array.isArray(o.at) ? (o.at as unknown[]) : r.fail(`${at}.at must be an array`);
    if (atIn.length !== n) r.fail(`${at}.at must have ${n} entries (one per critical number), it has ${atIn.length}`);
    atIn.forEach((s, k) => {
      if (!['0', 'und', '+', '-', ''].includes(s as string)) r.fail(`${at}.at[${k}] must be '0', 'und', '+', '-' or '' (a blank is asked for with blankAt)`);
    });
    const flags = (v: unknown, name: string, len: number, cells: unknown[]): boolean[] => {
      const out: boolean[] = new Array(len).fill(false);
      if (v === undefined || v === null) return out;
      r.list(v, name, 0, len).forEach((raw, k) => {
        const idx = r.num(raw, `${name}[${k}]`);
        if (!Number.isInteger(idx) || idx < 0 || idx >= len) r.fail(`${name}[${k}] must be an index from 0 to ${len - 1}`);
        if (cells[idx] === '') r.fail(`${name}[${k}]: that cell is empty in the spec — give its true value, the blank is drawn over it`);
        out[idx] = true;
      });
      return out;
    };
    return { label: r.str(o.label, `${at}.label`, 10), signs: signs as SignCell[], at: atIn as AtCell[], blankSigns: flags(o.blankSigns, `${at}.blankSigns`, n + 1, signs), blankAt: flags(o.blankAt, `${at}.blankAt`, n, atIn) };
  });
  return { critical, rows, variable: r.optStr(p.variable, 'variable', 4) ?? 'x', title: r.optStr(p.title, 'title', 160) };
}

export function renderSignChart(r: Reader): Drawn {
  const m = signChartModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: NonNullable<FigureFacts['notes']> = [];
  const n = m.critical.length;
  const left = Math.max(46, Math.max(...m.rows.map((row) => estWidth(row.label, LABEL_FS))) + 16);
  const right = W - 22;
  const cell = (right - left) / (n + 1);
  const xc = (k: number) => left + (k + 1) * cell;
  const yLine = t.top + 22;
  const rowH = 32;
  const rowY = (i: number) => yLine + 14 + i * rowH;
  const bottom = rowY(m.rows.length);
  const parts: string[] = [t.svg];
  // The line with the critical numbers above it.
  parts.push(arrow(left + 20, yLine, left - 4, yLine, { width: 1.5, head: 7 }), arrow(left + 20, yLine, right + 8, yLine, { width: 1.5, head: 7 }));
  parts.push(text(right + 12, yLine + 4, m.variable, { fs: LABEL_FS, italic: true, weight: 600 }));
  m.critical.forEach((c, k) => {
    parts.push(`<line x1="${n2(xc(k))}" y1="${n2(yLine - 5)}" x2="${n2(xc(k))}" y2="${n2(yLine + 5)}" stroke="${INK}" stroke-width="1.5"/>`);
    parts.push(text(xc(k), yLine - 9, c.label, { fs: LABEL_FS, anchor: 'middle', weight: 600 }));
    parts.push(`<path d="M${n2(xc(k))},${n2(yLine + 5)}V${n2(bottom)}" fill="none" stroke="${MUTED}" stroke-width="1" stroke-dasharray="4 3"/>`);
  });
  m.rows.forEach((row, i) => {
    const y0 = rowY(i);
    const cy = y0 + rowH / 2;
    parts.push(`<line x1="8" y1="${n2(y0)}" x2="${n2(W - 8)}" y2="${n2(y0)}" stroke="#cbd5e1" stroke-width="1"/>`);
    parts.push(text(left - 10, cy + LABEL_FS * 0.36, row.label, { fs: LABEL_FS, anchor: 'end', weight: 600 }));
    row.signs.forEach((s, k) => {
      const cx = left + (k + 0.5) * cell;
      if (row.blankSigns[k]) parts.push(blank(cx, cy, 22, 20, 13));
      else if (s) parts.push(text(cx, cy + 5.5, s === '-' ? '−' : '+', { fs: 16, anchor: 'middle', weight: 700 }));
    });
    row.at.forEach((s, k) => {
      if (row.blankAt[k]) parts.push(blank(xc(k), cy, 20, 18, 12));
      else if (s) parts.push(text(xc(k), cy + TICK_FS * 0.36, s === '-' ? '−' : s, { fs: s === 'und' ? TICK_FS : LABEL_FS, anchor: 'middle', weight: 600, halo: true }));
    });
    if (row.signs.every((s, k) => s === '' || row.blankSigns[k]) && row.at.every((s, k) => s === '' || row.blankAt[k])) {
      notes.push({ code: 'ambiguous_blank', message: `rows[${i}] ("${row.label}") shows no sign at all — nothing on the chart fixes the blank cells` });
    }
  });
  parts.push(`<line x1="8" y1="${n2(bottom)}" x2="${n2(W - 8)}" y2="${n2(bottom)}" stroke="#cbd5e1" stroke-width="1"/>`);
  return { body: parts.join(''), H: bottom + 8, facts: { curveCount: 0, marks: [], curves: [], notes } };
}
