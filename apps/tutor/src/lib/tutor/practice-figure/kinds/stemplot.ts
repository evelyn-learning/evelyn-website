/**
 * stemplot — batch 6 (2026-10-15, GreenApple T2): a stem-and-leaf plot, one
 * set of leaves or back-to-back, for AP Statistics (quantitative graphs,
 * distribution shape, comparing distributions). Every leaf is a value, so the
 * plot is data the student reads exactly: the checkers
 * (scripts/practice-extend/figure-core-batch6-stemplot.ts) read the very model
 * drawn here (`stemplotModel`).
 *
 *   { key: { stem: number; leaf: number; leftLeaf?: number };  // REQUIRED — always printed:
 *                                      //   "Key: 3 | 4 = 34 minutes"; back-to-back:
 *                                      //   "Key: 1 | 3 | 4 means 31 minutes for A and 34 minutes for B"
 *                                      //   (leftLeaf, default = leaf, is the left side's example leaf)
 *     units?: string;                  // printed after the values of the key ("minutes")
 *     leafUnit?: number (1);           // the place value of a leaf: a power of ten, 0.001–1000.
 *                                      //   value = (stem × 10 + leaf) × leafUnit — 1 → 3|4 = 34;
 *                                      //   0.1 → 3|4 = 3.4; 10 → 3|4 = 340
 *     stems: number[];                 // ONE ENTRY PER ROW, top to bottom: whole numbers ≥ 0, increasing
 *                                      //   by 1 — an empty stem is still listed (and drawn). 1–14 rows.
 *     split?: boolean (false);         // split stems: each stem on two rows, leaves 0–4 then 5–9 — list
 *                                      //   the stem twice ([3, 3, 4, 4]); the first row may be a stem's
 *                                      //   upper half and the last row a stem's lower half ([3, 4, 4, 5])
 *     leaves: Array<Array<0–9 | "?">>; // one set: one array per row, leaves in increasing order
 *     — or, back-to-back —
 *     left:  { label: string; leaves: Array<Array<0–9 | "?">> };  // drawn to the LEFT of the stems,
 *     right: { label: string; leaves: Array<Array<0–9 | "?">> };  //   increasing OUTWARD from the stem
 *     ordered?: boolean (true);        // false: leaves drawn in the order given (an unordered plot);
 *                                      //   otherwise unordered leaves are refused
 *     stemLabel?: string; leafLabel?: string;   // column headings ("Stem", "Leaf"); back-to-back
 *                                      //   plots head each side with its label instead of leafLabel
 *     title?: string }
 *
 * A "?" leaf is ONE value left out (a dashed box) — at most one per plot.
 *
 * LAYOUT. Stems are bold, set right against a vertical rule; each leaf is its
 * own text on an even grid, so leaves line up in columns from row to row (a
 * hand-drawn stemplot's "monospace" look, so a row's length shows its count).
 * The spacing tightens (11 → 9.6 → 8.4 units) to fit the longest row; a row
 * that still does not fit the 340 px card is refused. A row of more than 25
 * leaves is noted 'crowded' (too many to count by eye — split the stems).
 * The first and last rows must hold a leaf (the stems start and end at the
 * data); more than 14 rows are refused.
 */
import { FIGURE_WIDTH, INK, LABEL_FS, MUTED, TICK_FS, estWidth, n2, wrapText } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { blank, text, titleBlock } from './draw';
import type { Notes } from './draw2';

export const STEMPLOT_MAX_ROWS = 14;
/** A row with more leaves than this is too long to count by eye. */
export const STEMPLOT_CROWDED_ROW = 25;
const SPACINGS = [11, 9.6, 8.4] as const;
const LEAF_UNITS = [1000, 100, 10, 1, 0.1, 0.01, 0.001];

export type StemLeaf = number | '?';
export interface StemRow { stem: number; half?: 'low' | 'high' }
export interface StemSide { label?: string; leaves: StemLeaf[][] }
export interface StemplotModel {
  title?: string;
  leafUnit: number;
  units?: string;
  key: { stem: number; leaf: number; leftLeaf: number };
  keyText: string;
  split: boolean;
  ordered: boolean;
  rows: StemRow[];
  backToBack: boolean;
  /** One set: [the set]. Back-to-back: [left, right]. */
  sides: StemSide[];
  stemLabel?: string;
  leafLabel?: string;
}

/** The value a stem and a leaf stand for. */
export function stemValue(m: Pick<StemplotModel, 'leafUnit'>, stem: number, leaf: number): number {
  const v = Number(((stem * 10 + leaf) * m.leafUnit).toPrecision(12));
  return Object.is(v, -0) ? 0 : v;
}
const valueText = (v: number): string => String(Number(v.toPrecision(12)));

function digit(r: Reader, v: unknown, name: string): number {
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > 9) r.fail(`${name} must be a whole number from 0 to 9`);
  return v as number;
}

export function stemplotModel(r: Reader): StemplotModel {
  const p = r.p;
  const title = r.optStr(p.title, 'title', 100);
  const units = r.optStr(p.units, 'units', 24);
  const leafUnit = p.leafUnit === undefined || p.leafUnit === null ? 1 : r.num(p.leafUnit, 'leafUnit');
  if (!LEAF_UNITS.some((u) => Math.abs(u - leafUnit) < u * 1e-9)) r.fail('leafUnit must be a power of ten (0.001 to 1000)');
  const split = r.bool(p.split, 'split', false);
  const ordered = r.bool(p.ordered, 'ordered', true);
  // Rows.
  const rawStems = r.list(p.stems, 'stems', 1, STEMPLOT_MAX_ROWS);
  const stems = rawStems.map((s, i) => {
    if (typeof s !== 'number' || !Number.isInteger(s) || s < 0) r.fail(`stems[${i}] must be a whole number ≥ 0`);
    return s as number;
  });
  let rows: StemRow[];
  if (!split) {
    stems.forEach((s, i) => { if (i > 0 && s !== stems[i - 1] + 1) r.fail('stems must be consecutive whole numbers, increasing by 1 — list an empty stem too (or set split: true and list each stem twice)'); });
    rows = stems.map((stem) => ({ stem }));
  } else {
    if (stems.length < 2) r.fail('split stems need at least two rows');
    let cur: StemRow = { stem: stems[0], half: stems[1] === stems[0] ? 'low' : 'high' };
    rows = [cur];
    for (let i = 1; i < stems.length; i++) {
      cur = cur.half === 'low' ? { stem: cur.stem, half: 'high' } : { stem: cur.stem + 1, half: 'low' };
      if (stems[i] !== cur.stem) r.fail(`split stems must run ${stems[0]}, ${stems[0]}, ${stems[0] + 1}, ${stems[0] + 1}, … — each stem on two rows (leaves 0–4, then 5–9); stems[${i}] should be ${cur.stem}`);
      rows.push(cur);
    }
  }
  // Leaves.
  let blanks = 0;
  const readLeaves = (v: unknown, name: string): StemLeaf[][] => {
    if (!Array.isArray(v)) r.fail(`${name} must be an array`);
    const a = v as unknown[];
    if (a.length !== rows.length) r.fail(`${name} must have one array per stem row (${rows.length})`);
    return a.map((row, i) => {
      if (!Array.isArray(row)) r.fail(`${name}[${i}] must be an array of leaves`);
      const out = (row as unknown[]).map((l, j): StemLeaf => {
        if (l === '?') { blanks++; return '?'; }
        const d = digit(r, l, `${name}[${i}][${j}]`);
        const h = rows[i].half;
        if (h === 'low' && d > 4) r.fail(`${name}[${i}][${j}]: a split stem's first row holds leaves 0–4 (this leaf is ${d})`);
        if (h === 'high' && d < 5) r.fail(`${name}[${i}][${j}]: a split stem's second row holds leaves 5–9 (this leaf is ${d})`);
        return d;
      });
      if (ordered) {
        const ds = out.filter((l): l is number => l !== '?');
        if (ds.some((d, k) => k > 0 && d < ds[k - 1])) r.fail(`${name}[${i}] must be in increasing order (a stemplot's leaves are ordered) — or set ordered: false`);
      }
      return out;
    });
  };
  const b2b = p.left !== undefined || p.right !== undefined;
  if (b2b && p.leaves !== undefined) r.fail('give either `leaves` (one set) or `left` and `right` (back-to-back), not both');
  let sides: StemSide[];
  if (!b2b) {
    if (p.leaves === undefined) r.fail('leaves is required (or left and right for a back-to-back plot)');
    sides = [{ leaves: readLeaves(p.leaves, 'leaves') }];
  } else {
    sides = (['left', 'right'] as const).map((k) => {
      const o = r.obj(p[k], k);
      return { label: r.str(o.label, `${k}.label`, 28), leaves: readLeaves(o.leaves, `${k}.leaves`) };
    });
    if (sides[0].label === sides[1].label) r.fail('the two sides have the same label');
  }
  if (blanks > 1) r.fail(`${blanks} leaves are "?" — at most one leaf may be left out`);
  const rowEmpty = (i: number): boolean => sides.every((s) => s.leaves[i].length === 0);
  if (rowEmpty(0)) r.fail('the first stem row has no leaves — start the stems at the smallest value');
  if (rowEmpty(rows.length - 1)) r.fail('the last stem row has no leaves — end the stems at the largest value');
  // The key.
  if (p.key === undefined || p.key === null) r.fail('key is required — a stemplot always prints its key, e.g. { stem: 3, leaf: 4 }');
  const k = r.obj(p.key, 'key');
  if (typeof k.stem !== 'number' || !Number.isInteger(k.stem) || (k.stem as number) < 0) r.fail('key.stem must be a whole number ≥ 0');
  const key = { stem: k.stem as number, leaf: digit(r, k.leaf, 'key.leaf'), leftLeaf: k.leftLeaf === undefined || k.leftLeaf === null ? digit(r, k.leaf, 'key.leaf') : digit(r, k.leftLeaf, 'key.leftLeaf') };
  const u = units ? ` ${units}` : '';
  const m = { leafUnit };
  const keyText = !b2b
    ? `Key: ${key.stem} | ${key.leaf} = ${valueText(stemValue(m, key.stem, key.leaf))}${u}`
    : `Key: ${key.leftLeaf} | ${key.stem} | ${key.leaf} means ${valueText(stemValue(m, key.stem, key.leftLeaf))}${u} for ${sides[0].label} and ${valueText(stemValue(m, key.stem, key.leaf))}${u} for ${sides[1].label}`;
  return {
    title, leafUnit, units, key, keyText, split, ordered, rows, backToBack: b2b, sides,
    stemLabel: r.optStr(p.stemLabel, 'stemLabel', 12), leafLabel: b2b ? undefined : r.optStr(p.leafLabel, 'leafLabel', 16),
  };
}

const FS = LABEL_FS;
const ROW_H = 18;
/** From the rule to the centre of the first leaf. */
const LEAF_GAP = 10;
/** From the stems' right edge (or edges) to the rule. */
const STEM_GAP = 7;
const MARGIN = 10;
const BLANK_PAD = 2.5;

export function renderStemplot(r: Reader, _uid?: string): Drawn {
  const m = stemplotModel(r);
  const W = FIGURE_WIDTH;
  const notes: Notes = [];
  const parts: string[] = [];
  const tb = titleBlock(m.title, W);
  parts.push(tb.svg);
  const stemW = Math.max(...m.rows.map((row) => estWidth(String(row.stem), FS) * 1.04));
  const longest = m.sides.map((s) => Math.max(...s.leaves.map((l) => l.length)));
  if (m.sides.some((s) => s.leaves.some((l) => l.length > STEMPLOT_CROWDED_ROW))) {
    notes.push({ code: 'crowded', message: `a row holds more than ${STEMPLOT_CROWDED_ROW} leaves — too many to count by eye; split the stems (split: true) or use a finer stem` });
  }
  // Where things go, at the widest spacing that fits.
  let dx = 0;
  let x0 = 0; // single: the left edge of the stem column
  let room = 0;
  const need = (n: number, d: number): number => (n === 0 ? 0 : LEAF_GAP + (n - 1) * d + 5 + 2 * BLANK_PAD);
  if (!m.backToBack) {
    room = W - 2 * MARGIN - stemW - STEM_GAP;
    dx = SPACINGS.find((d) => need(longest[0], d) <= room) ?? 0;
    if (!dx) r.fail(`too many leaves on one row for a 340 px card (${longest[0]} leaves; at most ${Math.floor((room - LEAF_GAP - 5) / SPACINGS[2]) + 1} fit) — split the stems or use a coarser leaf unit`);
    const headW = m.leafLabel ? estWidth(m.leafLabel, FS) * 1.04 + 6 : 0;
    const blockW = stemW + STEM_GAP + Math.max(need(longest[0], dx), headW);
    x0 = Math.max(MARGIN, (W - blockW) / 2);
  } else {
    room = W / 2 - stemW / 2 - STEM_GAP - MARGIN;
    const n = Math.max(...longest);
    dx = SPACINGS.find((d) => need(n, d) <= room) ?? 0;
    if (!dx) r.fail(`too many leaves on one row for a 340 px card (${n} leaves on one side; at most ${Math.floor((room - LEAF_GAP - 5) / SPACINGS[2]) + 1} fit) — split the stems or use a coarser leaf unit`);
  }
  const ruleXs = !m.backToBack ? [x0 + stemW + STEM_GAP] : [W / 2 - stemW / 2 - STEM_GAP, W / 2 + stemW / 2 + STEM_GAP];
  const stemX = !m.backToBack ? x0 + stemW : W / 2;
  const stemAnchor = !m.backToBack ? 'end' : 'middle';
  // Headings.
  let y = tb.top + 2;
  const heads: string[] = [];
  let headLines = 0;
  if (!m.backToBack) {
    if (m.stemLabel || m.leafLabel) {
      headLines = 1;
      if (m.stemLabel) heads.push(text(stemX, y + FS, m.stemLabel, { fs: FS, anchor: 'end', weight: 700 }));
      if (m.leafLabel) heads.push(text(ruleXs[0] + 6, y + FS, m.leafLabel, { fs: FS, anchor: 'start', weight: 700 }));
    }
  } else {
    const sideRoom = room - 4;
    const lines = m.sides.map((s) => wrapText(s.label as string, sideRoom / 1.04, FS));
    headLines = Math.max(...lines.map((l) => l.length), 1);
    lines[0].forEach((line, i) => heads.push(text(ruleXs[0] - 6, y + FS + i * (FS + 3) + (headLines - lines[0].length) * (FS + 3), line, { fs: FS, anchor: 'end', weight: 700 })));
    lines[1].forEach((line, i) => heads.push(text(ruleXs[1] + 6, y + FS + i * (FS + 3) + (headLines - lines[1].length) * (FS + 3), line, { fs: FS, anchor: 'start', weight: 700 })));
    if (m.stemLabel) heads.push(text(stemX, y + FS + (headLines - 1) * (FS + 3), m.stemLabel, { fs: FS, anchor: 'middle', weight: 700 }));
  }
  parts.push(...heads);
  const blockL = !m.backToBack ? x0 : ruleXs[0] - need(longest[0], dx);
  const blockR = !m.backToBack ? ruleXs[0] + Math.max(need(longest[0], dx), m.leafLabel ? estWidth(m.leafLabel, FS) * 1.04 + 6 : 0) : ruleXs[1] + need(longest[1], dx);
  if (headLines > 0) {
    y += headLines * (FS + 3) + 4;
    const labW = (i: number): number => (m.backToBack ? Math.max(...wrapText(m.sides[i].label as string, (room - 4) / 1.04, FS).map((l) => estWidth(l, FS) * 1.04)) + 6 : 0);
    const hl = m.backToBack ? Math.min(blockL, ruleXs[0] - labW(0)) : blockL;
    const hr = m.backToBack ? Math.max(blockR, ruleXs[1] + labW(1)) : blockR;
    parts.push(`<path d="M${n2(hl)},${n2(y)}H${n2(hr)}" fill="none" stroke="${MUTED}" stroke-width="1"/>`);
  }
  const top = y + 2;
  // Rows.
  m.rows.forEach((row, i) => {
    const cy = top + i * ROW_H + ROW_H / 2;
    const base = cy + FS * 0.36;
    parts.push(text(stemX, base, String(row.stem), { fs: FS, anchor: stemAnchor, weight: 700 }));
    m.sides.forEach((s, k) => {
      const dir = m.backToBack && k === 0 ? -1 : 1;
      const rule = ruleXs[m.backToBack ? k : 0];
      // A "?" box gets BLANK_PAD more room on each side than a digit.
      const at = s.leaves[i].indexOf('?');
      s.leaves[i].forEach((l, j) => {
        const x = rule + dir * (LEAF_GAP + j * dx + (at < 0 || j < at ? 0 : j === at ? BLANK_PAD : 2 * BLANK_PAD));
        parts.push(l === '?' ? blank(x, cy, Math.min(dx + 1, 12), FS + 3, TICK_FS) : text(x, base, String(l), { fs: FS, anchor: 'middle' }));
      });
    });
  });
  const bottom = top + m.rows.length * ROW_H;
  parts.push(`<path d="${ruleXs.map((x) => `M${n2(x)},${n2(top - 2)}V${n2(bottom)}`).join('')}" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
  // The key, centred under the plot.
  const keyLines = wrapText(m.keyText, W - 2 * MARGIN - 4, TICK_FS);
  keyLines.forEach((line, i) => parts.push(text(W / 2, bottom + 16 + i * (TICK_FS + 3), line, { fs: TICK_FS, anchor: 'middle' })));
  const H = bottom + 16 + (keyLines.length - 1) * (TICK_FS + 3) + 9;
  return { body: parts.join(''), H, facts: { curveCount: 0, marks: [], curves: [], notes } };
}
