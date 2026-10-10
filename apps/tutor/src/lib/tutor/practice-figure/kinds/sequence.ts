/**
 * sequence_strip — batch 4 (2026-10-14): a nucleic-acid sequence as a
 * textbook prints it, and a Sanger read-out.
 *
 * variant 'strands' (the default) — one to four rows of bases in fixed cells:
 *   { rows: Array<{ seq: string;                    // A C G T (DNA) or A C G U (RNA); "?" = a blank box in
 *                                                   //   that cell; "-" = a gap (a deleted position); spaces ignored
 *                   name?: string;                  // ≤ 14 characters, printed left of the row ("template", "mRNA")
 *                   fivePrime?: 'left' | 'right' | 'none' }>;   // which end is labelled 5′ (the other 3′); 'none' = no
 *                                                   //   end labels. Default: 'left' — but 'right' for the second row
 *                                                   //   when `pairTicks` is on (the strands are antiparallel)
 *     pairTicks?: boolean (false);                  // a short tick between each base of row 1 and row 2 (base pairs)
 *     codons?: { row?: index (0); start?: position (1); count?: number } | null;
 *                                                   // brackets under that row, three bases each, from the 1-based
 *                                                   //   position `start` (the reading frame); every row is spaced
 *                                                   //   in the same groups so the columns stay aligned
 *     aminoAcids?: Array<string | '?' | null>;      // under the brackets, one per codon ("Met", "Stop"; "?" = a
 *                                                   //   blank box; null = nothing) — needs `codons`
 *     numberEvery?: number;                         // position numbers over the first row: 1 and every multiple (≥ 3)
 *     highlight?: Array<{ row: index; pos: position }>;   // ≤ 12: a box round that base (a mutated position)
 *     perLine?: number;                             // bases per line (default: as many as fit; lines break
 *                                                   //   between codons)
 *     title?: string }
 *   Long sequences wrap over lines (the type never shrinks); at most 72 bases a row.
 *   NOT drawn unless asked: the amino acids, the reading frame, the complementary strand.
 *
 * variant 'chromatogram' — a Sanger sequencing read-out, one peak per base:
 *   { variant: 'chromatogram';
 *     seq: string;                                  // 4–20 bases, A C G T, in the order read (5′ → 3′)
 *     calls?: 'all' | 'none' ('all');               // the base letter printed over each peak — 'none' when
 *                                                   //   the question is to read the sequence
 *     blank?: number[];                             // 1-based positions whose call is a "?" box instead
 *     heights?: number[];                           // relative peak heights, 0.4–1, one per base (default: a
 *                                                   //   fixed gentle variation)
 *     positions?: boolean (true);                   // position numbers (1, 5, 10, …) under the baseline
 *     direction?: boolean (true);                   // "5′" and "3′" at the two ends, and an arrow
 *     title?: string }
 *   The four traces are told apart WITHOUT colour: each has its own stroke pattern AND its own
 *   marker on every peak top (A ● · C ■ · G ▲ · T ◆), repeated in the key under the plot.
 */
import { FIGURE_WIDTH, SERIES_COLORS, SERIES_DASHES, estWidth, n2, shapeMark, type SeriesShape } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, arrow, blank, text, titleBlock } from './draw';
import { facts, stroke, type Notes } from './draw2';

export type FivePrime = 'left' | 'right' | 'none';
export interface SeqRow {
  /** One character per cell: A C G T U, "?" (a blank box) or "-" (a gap). */
  seq: string;
  name?: string;
  fivePrime: FivePrime;
  /** 'DNA' when the row has a T, 'RNA' when it has a U, null when it has neither. */
  type: 'DNA' | 'RNA' | null;
}
export interface StrandsModel {
  variant: 'strands';
  rows: SeqRow[];
  pairTicks: boolean;
  /** `start` is 0-based here. */
  codons: { row: number; start: number; count: number } | null;
  aminoAcids: Array<string | null>;
  numberEvery: number;
  /** 0-based positions. */
  highlight: Array<{ row: number; pos: number }>;
  perLine?: number;
  title?: string;
}
export interface ChromatogramModel {
  variant: 'chromatogram';
  seq: string;
  calls: 'all' | 'none';
  /** 0-based positions whose call is a "?" box. */
  blank: number[];
  heights: number[];
  positions: boolean;
  direction: boolean;
  title?: string;
}
export type SequenceModel = StrandsModel | ChromatogramModel;

export const TRACE_BASES = ['A', 'C', 'G', 'T'] as const;
const TRACE_SHAPES: SeriesShape[] = ['circle', 'square', 'triangle', 'diamond'];
export const TRACE_SHAPE_WORDS = ['a round dot', 'a square', 'a triangle', 'a diamond'];
const MAX_BASES = 72;
const MAX_READ = 20;

export function sequenceModel(r: Reader): SequenceModel {
  const p = r.p;
  const variant = p.variant === undefined || p.variant === null ? 'strands' : p.variant;
  if (variant !== 'strands' && variant !== 'chromatogram') r.fail('variant must be one of strands, chromatogram');
  const title = r.optStr(p.title, 'title', 80);
  if (variant === 'chromatogram') {
    const raw = r.str(p.seq, 'seq', 60).replace(/\s+/g, '').toUpperCase();
    const bad = [...raw].findIndex((c) => !'ACGT'.includes(c));
    if (bad >= 0) r.fail(`seq: "${raw[bad]}" at position ${bad + 1} is not a base a sequencing read-out calls (A, C, G or T)`);
    if (raw.length < 4 || raw.length > MAX_READ) r.fail(`seq must have between 4 and ${MAX_READ} bases (has ${raw.length}) — a longer read-out does not fit a 340 px card`);
    const calls = p.calls === undefined || p.calls === null ? 'all' : p.calls;
    if (calls !== 'all' && calls !== 'none') r.fail('calls must be one of all, none');
    const blankAt = (p.blank === undefined || p.blank === null ? [] : r.list(p.blank, 'blank', 0, raw.length)).map((v, i) => {
      const n = r.num(v, `blank[${i}]`);
      if (!Number.isInteger(n) || n < 1 || n > raw.length) r.fail(`blank[${i}] must be a position from 1 to ${raw.length}`);
      return n - 1;
    });
    const heights = p.heights === undefined || p.heights === null
      ? [...raw].map((_, i) => [0.92, 0.74, 1, 0.82, 0.68, 0.96, 0.78][(i * 3 + raw.charCodeAt(i)) % 7])
      : r.list(p.heights, 'heights', raw.length, raw.length).map((v, i) => {
        const h = r.num(v, `heights[${i}]`);
        if (h < 0.4 || h > 1) r.fail(`heights[${i}] must be between 0.4 and 1`);
        return h;
      });
    return { variant, seq: raw, calls, blank: [...new Set(blankAt)].sort((a, b) => a - b), heights, positions: r.bool(p.positions, 'positions', true), direction: r.bool(p.direction, 'direction', true), title };
  }
  const pairTicks = r.bool(p.pairTicks, 'pairTicks', false);
  const rows: SeqRow[] = r.list(p.rows, 'rows', 1, 4).map((raw, i) => {
    const o = r.obj(raw, `rows[${i}]`);
    const seq = r.str(o.seq, `rows[${i}].seq`, 200).replace(/\s+/g, '').toUpperCase().replace(/[−–]/g, '-');
    const bad = [...seq].findIndex((c) => !'ACGTU?-'.includes(c));
    if (bad >= 0) r.fail(`rows[${i}].seq: "${seq[bad]}" at position ${bad + 1} is not a base (A, C, G, T or U), "?" or "-"`);
    if (seq.length < 3 || seq.length > MAX_BASES) r.fail(`rows[${i}].seq must have between 3 and ${MAX_BASES} positions (has ${seq.length})`);
    if (seq.includes('T') && seq.includes('U')) r.fail(`rows[${i}].seq has both T and U — a strand is DNA (T) or RNA (U)`);
    const fp = o.fivePrime === undefined || o.fivePrime === null ? (pairTicks && i === 1 ? 'right' : 'left') : o.fivePrime;
    if (fp !== 'left' && fp !== 'right' && fp !== 'none') r.fail(`rows[${i}].fivePrime must be one of left, right, none`);
    return { seq, name: r.optStr(o.name, `rows[${i}].name`, 14), fivePrime: fp as FivePrime, type: seq.includes('T') ? 'DNA' : seq.includes('U') ? 'RNA' : null };
  });
  if (pairTicks) {
    if (rows.length < 2) r.fail('pairTicks needs two rows (the ticks join the bases of the first and the second)');
    if (rows[0].seq.length !== rows[1].seq.length) r.fail(`pairTicks: the first two rows must be the same length (they have ${rows[0].seq.length} and ${rows[1].seq.length})`);
  }
  let codons: StrandsModel['codons'] = null;
  if (p.codons !== undefined && p.codons !== null && p.codons !== false) {
    const o = p.codons === true ? {} : r.obj(p.codons, 'codons');
    const row = o.row === undefined || o.row === null ? 0 : r.num(o.row, 'codons.row');
    if (!Number.isInteger(row) || row < 0 || row >= rows.length) r.fail(`codons.row must be the 0-based index of a row (0 to ${rows.length - 1})`);
    const len = rows[row].seq.length;
    const start = o.start === undefined || o.start === null ? 1 : r.num(o.start, 'codons.start');
    if (!Number.isInteger(start) || start < 1 || start > len - 2) r.fail(`codons.start must be a position from 1 to ${len - 2} (three bases must follow it)`);
    const most = Math.floor((len - (start - 1)) / 3);
    const count = o.count === undefined || o.count === null ? most : r.num(o.count, 'codons.count');
    if (!Number.isInteger(count) || count < 1 || count > most) r.fail(`codons.count must be between 1 and ${most} (the complete codons from position ${start})`);
    codons = { row, start: start - 1, count };
  }
  const aminoAcids = (p.aminoAcids === undefined || p.aminoAcids === null ? [] : r.list(p.aminoAcids, 'aminoAcids', 0, 24)).map((v, i) => (v === null || v === undefined || v === '' ? null : r.str(v, `aminoAcids[${i}]`, 4)));
  if (aminoAcids.length > 0 && !codons) r.fail('aminoAcids needs codons (each name stands under a codon bracket)');
  if (codons && aminoAcids.length > codons.count) r.fail(`aminoAcids has ${aminoAcids.length} entries for ${codons.count} codons`);
  const numberEvery = p.numberEvery === undefined || p.numberEvery === null || p.numberEvery === 0 ? 0 : r.num(p.numberEvery, 'numberEvery');
  if (numberEvery !== 0 && (!Number.isInteger(numberEvery) || numberEvery < 3)) r.fail('numberEvery must be a whole number of at least 3 (closer numbers run into each other)');
  const highlight = (p.highlight === undefined || p.highlight === null ? [] : r.list(p.highlight, 'highlight', 0, 12)).map((raw, i) => {
    const o = r.obj(raw, `highlight[${i}]`);
    const row = r.num(o.row, `highlight[${i}].row`);
    if (!Number.isInteger(row) || row < 0 || row >= rows.length) r.fail(`highlight[${i}].row must be the 0-based index of a row (0 to ${rows.length - 1})`);
    const pos = r.num(o.pos, `highlight[${i}].pos`);
    if (!Number.isInteger(pos) || pos < 1 || pos > rows[row].seq.length) r.fail(`highlight[${i}].pos must be a position from 1 to ${rows[row].seq.length}`);
    return { row, pos: pos - 1 };
  });
  const perLine = r.optNum(p.perLine, 'perLine');
  if (perLine !== undefined && (!Number.isInteger(perLine) || perLine < 3)) r.fail('perLine must be a whole number of at least 3');
  return { variant: 'strands', rows, pairTicks, codons, aminoAcids, numberEvery, highlight, perLine, title };
}

// ---------------------------------------------------------------------------
// strands
// ---------------------------------------------------------------------------

const CW = 13; // one base cell
const CG = 6; // the extra space between two codons
const BASE_FS = 13;
const SMALL_FS = 11;

/** The lines a strands figure wraps into: each the [from, to) columns it holds. */
export function strandLines(m: StrandsModel, avail: number): Array<[number, number]> {
  const L = Math.max(...m.rows.map((q) => q.seq.length));
  const c = m.codons;
  /** A codon boundary lies before column i (inside the bracketed stretch, its two ends included). */
  const boundary = (i: number): boolean => !!c && i >= c.start && i <= c.start + 3 * c.count && (i - c.start) % 3 === 0;
  const lines: Array<[number, number]> = [];
  let from = 0;
  while (from < L) {
    let w = 0;
    let to = from;
    let lastBreak = -1;
    while (to < L) {
      const add = CW + (to > from && boundary(to) ? CG : 0);
      if (m.perLine !== undefined ? to - from >= m.perLine : w + add > avail) break;
      w += add;
      to++;
      if (boundary(to)) lastBreak = to;
    }
    // Break between codons, not inside one.
    if (to < L && c && !boundary(to) && lastBreak > from) to = lastBreak;
    lines.push([from, to]);
    from = to;
  }
  return lines;
}

function renderStrands(m: StrandsModel, r: Reader): Drawn {
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: Notes = [];
  const parts: string[] = [];
  const nameW = Math.max(0, ...m.rows.map((q) => (q.name ? estWidth(q.name, SMALL_FS) + 8 : 0)));
  const ends = m.rows.some((q) => q.fivePrime !== 'none');
  const endW = ends ? 17 : 0;
  const x0 = 8 + nameW + endW;
  const avail = W - x0 - endW - 8;
  const c = m.codons;
  const boundary = (i: number): boolean => !!c && i >= c.start && i <= c.start + 3 * c.count && (i - c.start) % 3 === 0;
  const lines = strandLines(m, avail);
  const widthOf = ([from, to]: [number, number]): number => { let w = 0; for (let i = from; i < to; i++) w += CW + (i > from && boundary(i) ? CG : 0); return w; };
  if (m.perLine !== undefined && lines.some((ln) => widthOf(ln) > avail + 1e-6)) r.fail(`perLine: ${m.perLine} bases do not fit one line at a legible size here (at most ${strandLines({ ...m, perLine: undefined }, avail)[0][1]})`);
  const hl = new Set(m.highlight.map((h) => `${h.row}:${h.pos}`));
  let y = t.top + 2;
  lines.forEach(([from, to], li) => {
    /** x of the centre of column i on this line. */
    const xs: number[] = [];
    let x = x0;
    for (let i = from; i < to; i++) { if (i > from && boundary(i)) x += CG; xs[i] = x + CW / 2; x += CW; }
    const right = x;
    if (m.numberEvery) {
      y += 12;
      for (let i = from; i < to; i++) if (i === 0 || (i + 1) % m.numberEvery === 0) parts.push(text(xs[i], y, String(i + 1), { fs: SMALL_FS, anchor: 'middle', fill: MUTED }));
      y += 3;
    }
    m.rows.forEach((row, ri) => {
      const by = y + 15; // baseline of the row
      const mid = by - BASE_FS * 0.36;
      const any = from < row.seq.length;
      if (row.name) parts.push(text(8, by - 1, row.name, { fs: SMALL_FS, fill: MUTED }));
      if (row.fivePrime !== 'none' && any) {
        const first = li === 0;
        const last = to >= row.seq.length;
        const [lt, rt] = row.fivePrime === 'left' ? ['5′', '3′'] : ['3′', '5′'];
        if (first) parts.push(text(x0 - 4, by - 1, lt, { fs: SMALL_FS, anchor: 'end', weight: 600 }));
        if (last) parts.push(text(xs[Math.min(to, row.seq.length) - 1] + CW / 2 + 4, by - 1, rt, { fs: SMALL_FS, weight: 600 }));
      }
      for (let i = from; i < Math.min(to, row.seq.length); i++) {
        const ch = row.seq[i];
        if (hl.has(`${ri}:${i}`)) parts.push(`<rect x="${n2(xs[i] - CW / 2 + 0.4)}" y="${n2(mid - 9.4)}" width="${n2(CW - 0.8)}" height="18.8" rx="2.5" fill="#ffffff" stroke="${INK}" stroke-width="1.6"/>`);
        if (ch === '?') parts.push(blank(xs[i], mid, 11.4, 16, 11));
        else if (ch === '-') parts.push(`<path d="M${n2(xs[i] - 3.4)},${n2(mid)}h6.8" ${stroke(MUTED, 1.6)}/>`);
        else parts.push(text(xs[i], by, ch, { fs: BASE_FS, anchor: 'middle', weight: 600 }));
      }
      y += 20;
      if (m.pairTicks && ri === 0) {
        const d: string[] = [];
        for (let i = from; i < Math.min(to, row.seq.length); i++) if (row.seq[i] !== '-' && m.rows[1].seq[i] !== '-') d.push(`M${n2(xs[i])},${n2(y + 1)}v6`);
        if (d.length) parts.push(`<path d="${d.join('')}" ${stroke(MUTED, 1.2)}/>`);
        y += 7;
      }
      if (c && c.row === ri) {
        const d: string[] = [];
        const names: string[] = [];
        for (let k = 0; k < c.count; k++) {
          const a = c.start + 3 * k;
          if (a < from || a >= to) continue;
          const xa = xs[a] - CW / 2 + 1.2;
          const xb = xs[a + 2] + CW / 2 - 1.2;
          d.push(`M${n2(xa)},${n2(y)}v4H${n2(xb)}v-4`);
          const aa = m.aminoAcids[k];
          if (aa === '?') names.push(blank(xs[a + 1], y + 14.5, 19, 15, 11));
          else if (aa) names.push(text(xs[a + 1], y + 18, aa, { fs: SMALL_FS, anchor: 'middle' }));
        }
        if (d.length) parts.push(`<path d="${d.join('')}" ${stroke(INK, 1.2)}/>`);
        parts.push(...names);
        y += m.aminoAcids.some((a) => a) ? 26 : 9;
      }
    });
    void right;
    y += li < lines.length - 1 ? 12 : 0;
  });
  const drawnRows = lines.length * m.rows.length;
  if (drawnRows > 9) notes.push({ code: 'too_many_elements', message: `${lines.length} lines of ${m.rows.length} rows each — a reader loses the place in more than nine rows of bases; shorten the sequence` });
  if (m.rows.every((q) => !/[ACGTU]/.test(q.seq))) notes.push({ code: 'ambiguous_blank', message: 'no base is printed — every position is a blank or a gap' });
  // A single short row is under the 60-unit minimum canvas: centre it in that height.
  const H = Math.max(60, y + 8);
  const drop = (H - (y + 8)) / 2;
  const content = t.svg + parts.join('');
  return { body: drop > 0 ? `<g transform="translate(0,${n2(drop)})">${content}</g>` : content, H, facts: facts(notes) };
}

// ---------------------------------------------------------------------------
// chromatogram
// ---------------------------------------------------------------------------

/** The plot of a chromatogram: where each peak stands (canvas units) and how tall it is. */
export function chromatogramLayout(m: ChromatogramModel, top = 8): { xs: number[]; base: number; peakH: number[]; sigma: number; callY: number } {
  const n = m.seq.length;
  const left = m.direction ? 24 : 12;
  const dx = (FIGURE_WIDTH - 2 * left) / n;
  const anyCall = m.calls === 'all' || m.blank.length > 0;
  const callY = top + 14;
  const base = top + (anyCall ? 24 : 6) + 74;
  return { xs: [...m.seq].map((_, i) => left + (i + 0.5) * dx), base, peakH: m.heights.map((h) => h * 64), sigma: Math.min(7.5, dx * 0.2), callY };
}

function renderChromatogram(m: ChromatogramModel): Drawn {
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: Notes = [];
  const parts: string[] = [];
  const lay = chromatogramLayout(m, t.top);
  const n = m.seq.length;
  const left = lay.xs[0] - (lay.xs[1] - lay.xs[0]) / 2;
  const right = W - left;
  parts.push(`<path d="M${n2(left)},${n2(lay.base)}H${n2(right)}" ${stroke(MUTED, 1)}/>`);
  const marks: string[] = [];
  for (let i = 0; i < n; i++) {
    const k = TRACE_BASES.indexOf(m.seq[i] as (typeof TRACE_BASES)[number]);
    const cx = lay.xs[i];
    const h = lay.peakH[i];
    const pts: string[] = [];
    for (let s = -24; s <= 24; s++) {
      const u = (s / 24) * 2.6; // ± 2.6 σ
      pts.push(`${s === -24 ? 'M' : 'L'}${n2(cx + u * lay.sigma)},${n2(lay.base - h * Math.exp(-0.5 * u * u))}`);
    }
    parts.push(`<path d="${pts.join('')}" fill="none" stroke="${SERIES_COLORS[k]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${SERIES_DASHES[k] ? ` stroke-dasharray="${SERIES_DASHES[k]}"` : ''}/>`);
    marks.push(shapeMark(TRACE_SHAPES[k], cx, lay.base - h, 3.3, SERIES_COLORS[k]));
    if (m.blank.includes(i)) parts.push(blank(cx, lay.callY - 4.3, Math.min(15, lay.xs[1] - lay.xs[0] - 1.5), 16, 11));
    else if (m.calls === 'all') parts.push(text(cx, lay.callY, m.seq[i], { fs: 12, anchor: 'middle', weight: 700 }));
  }
  parts.push(...marks);
  let y = lay.base;
  if (m.positions) {
    const d: string[] = [];
    for (let i = 0; i < n; i++) {
      if (i !== 0 && (i + 1) % 5 !== 0) continue;
      d.push(`M${n2(lay.xs[i])},${n2(lay.base)}v4`);
      parts.push(text(lay.xs[i], lay.base + 15, String(i + 1), { fs: SMALL_FS, anchor: 'middle', fill: MUTED }));
    }
    parts.push(`<path d="${d.join('')}" ${stroke(MUTED, 1)}/>`);
    y += 18;
  }
  if (m.direction) {
    y += 14;
    parts.push(text(left, y + 4, '5′', { fs: SMALL_FS, anchor: 'end', weight: 600 }), text(right, y + 4, '3′', { fs: SMALL_FS, weight: 600 }));
    const lw = estWidth('direction of the read', SMALL_FS);
    parts.push(arrow(left + 6, y, right - 6, y, { color: MUTED, width: 1.3 }));
    parts.push(`<rect x="${n2(W / 2 - lw / 2 - 5)}" y="${n2(y - 8)}" width="${n2(lw + 10)}" height="16" fill="#ffffff"/>`, text(W / 2, y + 4, 'direction of the read', { fs: SMALL_FS, anchor: 'middle', fill: MUTED }));
    y += 8;
  }
  // The key: each trace's stroke pattern with its marker, then its letter.
  y += 18;
  const slot = (W - 24) / 4;
  TRACE_BASES.forEach((b, k) => {
    const x = 12 + k * slot + (slot - 62) / 2;
    parts.push(`<line x1="${n2(x + 1.2)}" y1="${n2(y)}" x2="${n2(x + 40 - 1.2)}" y2="${n2(y)}" stroke="${SERIES_COLORS[k]}" stroke-width="2.2" stroke-linecap="round"${SERIES_DASHES[k] ? ` stroke-dasharray="${SERIES_DASHES[k]}"` : ''}/>`,
      shapeMark(TRACE_SHAPES[k], x + 20, y, 3.3, SERIES_COLORS[k]), text(x + 46, y + 4.3, b, { fs: 12, weight: 700 }));
  });
  if (n > 16) notes.push({ code: 'crowded', message: `${n} peaks across 340 px — the stroke patterns of neighbouring peaks are hard to tell apart beyond 16; the markers on the peak tops still are` });
  return { body: t.svg + parts.join(''), H: y + 16, facts: facts(notes) };
}

export function renderSequenceStrip(r: Reader, _uid?: string): Drawn {
  const m = sequenceModel(r);
  return m.variant === 'chromatogram' ? renderChromatogram(m) : renderStrands(m, r);
}
