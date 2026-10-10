/**
 * data_table — batch 5 (2026-10-16): a real table, drawn (not typed into the
 * question), so a cell can be left out as a "?" box and the card keeps one
 * layout: two-way frequency tables, rate / kinetics data, tables of values.
 *
 *   { columns: Array<string | { header: string; unit?: string;          // 2–6 columns; the unit is printed
 *                               align?: 'left' | 'center' | 'right' }>; //   after the header: "Time (s)"
 *     rows: Array<Array<number | string | null>>;                       // 1–8 rows, one cell per column:
 *                                                                       //   a number, a text, "?" (a dashed
 *                                                                       //   blank box) or null / "" (empty)
 *     rowHeaders?: boolean (false);     // the first column names the rows: bold, set left, a heavier rule after it
 *                                       //   (its own header may then be "" — an empty corner)
 *     totalsRow?: boolean (false);      // the LAST row holds totals: bold, a heavier rule above it
 *     totalsColumn?: boolean (false);   // the LAST column holds totals: bold, a heavier rule before it
 *     columnGroup?: string;             // a heading spanning the data columns (a two-way table's column variable)
 *     title?: string }
 *
 * A number is printed as written (a real minus sign); give a string to fix
 * the form ("0.010", "2.0 × 10⁻³"). A column whose cells are all numbers is
 * set right-aligned on a common edge, so the digits line up; a text column is
 * centred; the row-header column is set left.
 *
 * SIZE. The type is 12 units when the table fits and 11 (10.4 px at 340 px)
 * when it only fits so; a header wraps onto at most three lines. A table that
 * still does not fit the 344 units of a card is REFUSED, with the overshoot —
 * never drawn smaller. Nothing is emphasised by colour alone: headers and
 * totals are bold and set off by heavier rules.
 */
import { LABEL_FS, TICK_FS, TITLE_FS, FIGURE_WIDTH, estWidth, n2, wrapText } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, blank, text, type Anchor } from './draw';
import type { Notes } from './draw2';

export const TABLE_MAX_COLUMNS = 6;
export const TABLE_MAX_ROWS = 8;
/** The widest a table may be drawn (viewBox units of the 360-wide card). */
export const TABLE_MAX_WIDTH = FIGURE_WIDTH - 16;

export type TableCell =
  | { kind: 'value'; text: string; value?: number }
  | { kind: 'blank' }
  | { kind: 'empty' };
export interface TableColumn {
  header: string;
  unit?: string;
  /** The header as printed: "Time (s)". */
  text: string;
  align: 'left' | 'center' | 'right';
  /** Every filled cell of the column is a number (a blank does not count against it). */
  numeric: boolean;
}
export interface TableModel {
  columns: TableColumn[];
  rows: TableCell[][];
  rowHeaders: boolean;
  totalsRow: boolean;
  totalsColumn: boolean;
  columnGroup?: string;
  title?: string;
}

const SUPER: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+' };

/** The number a cell's text states — "12", "−0.5", "1,200", "2.0 × 10⁻³", "3.1e-4", "25%" is NOT one — or undefined. */
export function cellNumber(s: string): number | undefined {
  const t = s.trim().replace(/[−–]/g, '-').replace(/(\d),(?=\d{3}\b)/g, '$1');
  if (/^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(t)) return Number(t);
  const sci = /^([-+]?(?:\d+\.?\d*|\.\d+))\s*[×x]\s*10\s*([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+|\^\s*[-+]?\d+)$/.exec(t);
  if (sci) {
    const exp = Number(sci[2].startsWith('^') ? sci[2].slice(1).trim() : [...sci[2]].map((c) => SUPER[c]).join(''));
    if (Number.isFinite(exp)) return Number(`${sci[1]}e${exp}`);
  }
  return undefined;
}

/** A number as a cell prints it: as written, with a real minus sign. */
function numberText(v: number): string {
  const r = Number(v.toPrecision(12));
  return String(Object.is(r, -0) ? 0 : r).replace(/^-/, '−');
}

export function tableModel(r: Reader): TableModel {
  const p = r.p;
  const rowHeaders = r.bool(p.rowHeaders, 'rowHeaders', false);
  const totalsRow = r.bool(p.totalsRow, 'totalsRow', false);
  const totalsColumn = r.bool(p.totalsColumn, 'totalsColumn', false);
  const rawCols = r.list(p.columns, 'columns', 2, TABLE_MAX_COLUMNS);
  const n = rawCols.length;
  const rawRows = r.list(p.rows, 'rows', 1, TABLE_MAX_ROWS);
  if (totalsRow && rawRows.length < 2) r.fail('totalsRow needs at least one row above the totals');
  if (totalsColumn && n < (rowHeaders ? 3 : 2)) r.fail('totalsColumn needs at least one data column before the totals');
  const rows = rawRows.map((raw, i) => {
    if (!Array.isArray(raw) || raw.length !== n) r.fail(`rows[${i}] must have one cell per column (${n})`);
    return (raw as unknown[]).map((c, j): TableCell => {
      if (c === null || c === undefined || c === '') return { kind: 'empty' };
      if (typeof c === 'number') return { kind: 'value', text: numberText(r.num(c, `rows[${i}][${j}]`)), value: c };
      const s = r.str(c, `rows[${i}][${j}]`, 40);
      if (s === '?') return { kind: 'blank' };
      const v = cellNumber(s);
      return { kind: 'value', text: s.replace(/^-(?=[\d.])/, '−'), ...(v === undefined ? {} : { value: v }) };
    });
  });
  const columns = rawCols.map((raw, j): TableColumn => {
    const o = typeof raw === 'string' ? { header: raw } : r.obj(raw, `columns[${j}]`);
    // The corner over the row names may be left empty.
    const header = rowHeaders && j === 0 && (o.header === '' || o.header === null || o.header === undefined) ? '' : r.str(o.header, `columns[${j}]${typeof raw === 'string' ? '' : '.header'}`, 48);
    if (header === '?') r.fail(`columns[${j}]: a header cannot be left out — leave out a cell instead`);
    const unit = r.optStr((o as { unit?: unknown }).unit, `columns[${j}].unit`, 16);
    const filled = rows.map((row) => row[j]).filter((c): c is Extract<TableCell, { kind: 'value' }> => c.kind === 'value');
    const numeric = !(rowHeaders && j === 0) && filled.length > 0 && filled.every((c) => c.value !== undefined);
    const a = (o as { align?: unknown }).align;
    if (a !== undefined && a !== null && a !== 'left' && a !== 'center' && a !== 'right') r.fail(`columns[${j}].align must be left, center or right`);
    const align = (a as TableColumn['align'] | undefined | null) ?? (rowHeaders && j === 0 ? 'left' : numeric ? 'right' : 'center');
    return { header, unit, text: unit ? `${header} (${unit})` : header, align, numeric };
  });
  if (rows.every((row) => row.every((c) => c.kind !== 'value'))) r.fail('rows: every cell is empty or left out — there is nothing to read');
  if (rowHeaders) {
    rows.forEach((row, i) => { if (row[0].kind !== 'value') r.fail(`rows[${i}][0]: with rowHeaders the first cell of a row is its name — it cannot be empty or "?"`); });
    const names = rows.map((row) => (row[0] as { text: string }).text);
    if (new Set(names).size !== names.length) r.fail('rows: two rows have the same name in the first column');
  }
  if (new Set(columns.map((c) => c.text)).size !== n) r.fail('columns: two columns have the same header');
  const columnGroup = r.optStr(p.columnGroup, 'columnGroup', 48);
  return { columns, rows, rowHeaders, totalsRow, totalsColumn, columnGroup, title: r.optStr(p.title, 'title', 160) };
}

/** The bold weight used for headers and totals; bold type runs a little wider than `estWidth` says. */
const BOLD = 700;
const boldWidth = (s: string, fs: number): number => estWidth(s, fs) * 1.04;
const BLANK_W = 21;

/** A header on lines no wider than `w`: when it has to wrap, the unit starts a line of its own if that costs no extra line. */
function headerWrap(c: TableColumn, w: number, fs: number): string[] {
  const greedy = wrapText(c.text, w, fs);
  if (!c.unit || greedy.length <= 1) return greedy;
  const unit = `(${c.unit})`;
  const split = [...wrapText(c.header, w, fs), unit];
  return split.length <= greedy.length && estWidth(unit, fs) <= w ? split : greedy;
}

interface Layout {
  fs: number;
  pad: number;
  widths: number[];
  headerLines: string[][];
}

/** Column widths at one type size and padding, or the overshoot when the table cannot fit. */
function layoutAt(m: TableModel, fs: number, pad: number): Layout | { over: number } {
  const cellW = (c: TableCell, bold: boolean): number => (c.kind === 'blank' ? BLANK_W : c.kind === 'empty' ? 0 : bold ? boldWidth(c.text, fs) : estWidth(c.text, fs));
  const nRows = m.rows.length;
  const nCols = m.columns.length;
  const isBold = (i: number, j: number): boolean => (m.rowHeaders && j === 0) || (m.totalsRow && i === nRows - 1) || (m.totalsColumn && j === nCols - 1);
  const body = m.columns.map((_, j) => Math.max(0, ...m.rows.map((row, i) => cellW(row[j], isBold(i, j)))));
  /** The narrowest column `j` can be with its header on at most `lines` lines. */
  const headW = (c: TableColumn, lines: number): number => {
    let w = Math.max(...c.text.split(/\s+/).map((x) => boldWidth(x, fs)));
    while (headerWrap(c, w / 1.04 + 0.01, fs).length > lines) w += 2;
    return w;
  };
  const span = (min: number[]): number[] => {
    if (!m.columnGroup) return min;
    // The spanning heading needs the columns it spans to be at least as wide as it is.
    const a = m.rowHeaders ? 1 : 0;
    const b = nCols - (m.totalsColumn ? 1 : 0);
    const short = boldWidth(m.columnGroup, fs) + 2 * pad - min.slice(a, b).reduce((x, y) => x + y, 0);
    return short > 0 ? min.map((w, j) => (j >= a && j < b ? w + short / (b - a) : w)) : min;
  };
  // Every header on one line when that fits; else all of them on at most two; else three. One rule for
  // the whole header row, so sibling columns ("[A] (M)", "[B] (M)") are never set differently.
  let widths: number[] = [];
  let total = Infinity;
  for (const lines of [1, 2, 3]) {
    widths = span(m.columns.map((c, j) => Math.max(body[j], headW(c, lines), 18) + 2 * pad));
    total = widths.reduce((a, b) => a + b, 0);
    if (total <= TABLE_MAX_WIDTH + 1e-9) break;
  }
  if (total > TABLE_MAX_WIDTH + 1e-9) return { over: total - TABLE_MAX_WIDTH };
  // Spare room is shared out evenly — up to a comfortable column.
  const comfy = Math.min((TABLE_MAX_WIDTH - total) / nCols, 14);
  widths = widths.map((w) => Math.floor((w + comfy) * 100) / 100);
  const headerLines = m.columns.map((c, j) => headerWrap(c, (widths[j] - 2 * pad) / 1.04 + 0.01, fs));
  return { fs, pad, widths, headerLines };
}

export function tableLayout(m: TableModel, r: Reader): Layout {
  let over = 0;
  for (const [fs, pad] of [[LABEL_FS, 7], [LABEL_FS, 5], [TICK_FS, 5], [TICK_FS, 4]] as const) {
    const l = layoutAt(m, fs, pad);
    if (!('over' in l)) return l;
    over = l.over;
  }
  return r.fail(`the table is ${Math.ceil(over)} units too wide for a 340 px card at 10 px type (${m.columns.length} columns) — shorten the headers or the cell texts, or use fewer columns`);
}

export function renderDataTable(r: Reader, _uid?: string): Drawn {
  const m = tableModel(r);
  const L = tableLayout(m, r);
  const notes: Notes = [];
  const { fs, pad, widths, headerLines } = L;
  const nCols = m.columns.length;
  const nRows = m.rows.length;
  const W = FIGURE_WIDTH;
  const tableW = widths.reduce((a, b) => a + b, 0);
  const x0 = (W - tableW) / 2;
  const xs = widths.reduce<number[]>((acc, w) => [...acc, acc[acc.length - 1] + w], [x0]);
  const parts: string[] = [];
  let y = 8;
  if (m.title) {
    const lines = wrapText(m.title, W - 20, TITLE_FS);
    lines.forEach((line, i) => parts.push(text(W / 2, 10 + TITLE_FS + i * (TITLE_FS + 3), line, { fs: TITLE_FS, anchor: 'middle', weight: 600 })));
    y = 10 + lines.length * (TITLE_FS + 3) + 6;
  }
  const lineH = fs + 2;
  const rowH = fs + 11;
  const top = y;
  // The spanning heading over the data columns.
  const firstData = m.rowHeaders ? 1 : 0;
  const lastData = nCols - (m.totalsColumn ? 1 : 0);
  let groupH = 0;
  if (m.columnGroup) {
    const room = xs[lastData] - xs[firstData] - 2 * pad;
    if (boldWidth(m.columnGroup, fs) > room) r.fail(`columnGroup is ${Math.ceil(boldWidth(m.columnGroup, fs) - room)} units wider than the columns it spans — shorten it`);
    groupH = fs + 9;
  }
  const headH = Math.max(...headerLines.map((l) => l.length)) * lineH + 10;
  const headTop = top + groupH;
  const bodyTop = headTop + headH;
  const bottom = bodyTop + nRows * rowH;
  // Header band (a light tint; the bold type and the heavy rule carry the meaning).
  parts.push(`<rect x="${n2(x0)}" y="${n2(top)}" width="${n2(tableW)}" height="${n2(groupH + headH)}" fill="#f1f5f9"/>`);
  if (m.columnGroup) {
    parts.push(text((xs[firstData] + xs[lastData]) / 2, top + groupH / 2 + fs * 0.36, m.columnGroup, { fs, anchor: 'middle', weight: BOLD }));
    parts.push(`<path d="M${n2(xs[firstData])},${n2(headTop)}H${n2(xs[lastData])}" fill="none" stroke="${MUTED}" stroke-width="1"/>`);
  }
  // Thin rules: between body rows, between columns.
  const thin: string[] = [];
  for (let i = 1; i < nRows; i++) if (!(m.totalsRow && i === nRows - 1)) thin.push(`M${n2(x0)},${n2(bodyTop + i * rowH)}H${n2(x0 + tableW)}`);
  for (let j = 1; j < nCols; j++) {
    if ((m.rowHeaders && j === 1) || (m.totalsColumn && j === nCols - 1)) continue;
    // Inside the spanned block a column rule starts under the spanning heading.
    const from = m.columnGroup && j > firstData && j < lastData ? headTop : top;
    thin.push(`M${n2(xs[j])},${n2(from)}V${n2(bottom)}`);
  }
  if (thin.length) parts.push(`<path d="${thin.join('')}" fill="none" stroke="#94a3b8" stroke-width="0.9"/>`);
  // Heavy rules: under the header, after the row names, before the totals.
  const heavy: string[] = [`M${n2(x0)},${n2(bodyTop)}H${n2(x0 + tableW)}`];
  if (m.rowHeaders) heavy.push(`M${n2(xs[1])},${n2(top)}V${n2(bottom)}`);
  if (m.totalsColumn) heavy.push(`M${n2(xs[nCols - 1])},${n2(top)}V${n2(bottom)}`);
  if (m.totalsRow) heavy.push(`M${n2(x0)},${n2(bottom - rowH)}H${n2(x0 + tableW)}`);
  parts.push(`<path d="${heavy.join('')}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
  parts.push(`<rect x="${n2(x0)}" y="${n2(top)}" width="${n2(tableW)}" height="${n2(bottom - top)}" fill="none" stroke="${INK}" stroke-width="1.2"/>`);

  // Where a column's text sits: left edge, centre, or a common right edge centred on the column.
  const isBold = (i: number, j: number): boolean => (m.rowHeaders && j === 0) || (m.totalsRow && i === nRows - 1) || (m.totalsColumn && j === nCols - 1);
  const widthOf = (c: TableCell, bold: boolean): number => (c.kind === 'value' ? (bold ? boldWidth(c.text, fs) : estWidth(c.text, fs)) : 0);
  const anchors = m.columns.map((c, j): { x: number; anchor: Anchor } => {
    const cx = (xs[j] + xs[j + 1]) / 2;
    if (c.align === 'left') return { x: xs[j] + pad, anchor: 'start' };
    if (c.align === 'center') return { x: cx, anchor: 'middle' };
    const widest = Math.max(0, ...m.rows.map((row, i) => widthOf(row[j], isBold(i, j))));
    return { x: cx + widest / 2, anchor: 'end' };
  });
  m.columns.forEach((c, j) => {
    const lines = headerLines[j];
    const cx = c.align === 'left' ? xs[j] + pad : (xs[j] + xs[j + 1]) / 2;
    const yMid = headTop + headH / 2;
    lines.forEach((line, k) => parts.push(text(cx, yMid + (k - (lines.length - 1) / 2) * lineH + fs * 0.36, line, { fs, anchor: c.align === 'left' ? 'start' : 'middle', weight: BOLD })));
  });
  let blanks = 0;
  m.rows.forEach((row, i) => {
    const cy = bodyTop + i * rowH + rowH / 2;
    row.forEach((c, j) => {
      if (c.kind === 'empty') return;
      if (c.kind === 'blank') {
        blanks++;
        parts.push(blank((xs[j] + xs[j + 1]) / 2, cy, 19, fs + 5, fs));
        return;
      }
      parts.push(text(anchors[j].x, cy + fs * 0.36, c.text, { fs, anchor: anchors[j].anchor, ...(isBold(i, j) ? { weight: BOLD } : {}) }));
    });
  });
  if (headerLines.some((l) => l.length >= 3)) notes.push({ code: 'crowded', message: 'a column header runs over three lines — shorten it (put the unit in `unit`, abbreviate the name)' });
  if (blanks > 4) notes.push({ code: 'ambiguous_blank', message: `${blanks} cells are left out — a question can ask for one or two; the rest only hide the table` });
  return { body: parts.join(''), H: bottom + 8, facts: { curveCount: 0, marks: [], curves: [], notes } };
}
