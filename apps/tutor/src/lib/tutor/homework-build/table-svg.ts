/**
 * Static SVG thumbnail of a homework table figure (showTable): a plain grid,
 * the header row plus the first 6 body rows, then one row of "…" when the
 * table has more (spec 2026-10-21 §4.6). Columns are sized from their text;
 * a long cell is clipped with an ellipsis, and at most 8 columns are drawn
 * (a ninth "…" column stands for the rest), so the svg stays small whatever
 * the table holds. Never throws: a table it cannot draw gives null.
 */

import { DIAGRAM_COLORS as C } from '../diagrams/theme';
import { clip, esc, fmt, svgDoc } from './svg-util';
import type { FigureCommand } from './types';

type Table = Extract<FigureCommand, { action: 'showTable' }>;

export const TABLE_SVG_MAX_ROWS = 6;
const MAX_COLS = 8;
const CELL_CHARS = 22;
const ROW_H = 26, PAD = 10, CHAR_W = 7.2, FONT = 13;

export function tableToSvg(fig: Table): string | null {
  try {
    const headers = fig?.headers, rows = fig?.rows;
    if (!Array.isArray(headers) || !headers.length || !Array.isArray(rows) || !rows.every(Array.isArray)) return null;
    const moreCols = headers.length > MAX_COLS;
    const nCols = Math.min(headers.length, MAX_COLS) + (moreCols ? 1 : 0);
    const cell = (r: unknown[], c: number) => (moreCols && c === nCols - 1 ? '…' : clip(r[c] ?? '', CELL_CHARS));
    const head = Array.from({ length: nCols }, (_, c) => cell(headers, c));
    const body = rows.slice(0, TABLE_SVG_MAX_ROWS).map((r) => Array.from({ length: nCols }, (_, c) => cell(r, c)));
    if (rows.length > TABLE_SVG_MAX_ROWS) body.push(Array.from({ length: nCols }, () => '…'));
    const widths = head.map((h, c) => PAD * 2 + CHAR_W * Math.max(1, h.length, ...body.map((r) => r[c].length)));
    const xs = widths.reduce<number[]>((acc, w) => [...acc, acc[acc.length - 1] + w], [1]);
    const W = xs[nCols] + 1, H = ROW_H * (body.length + 1) + 2;
    const text = (s: string, c: number, y: number, bold: boolean) =>
      `<text x="${fmt(xs[c] + widths[c] / 2)}" y="${fmt(y + ROW_H / 2 + FONT * 0.35)}" text-anchor="middle" font-size="${FONT}"${bold ? ' font-weight="600"' : ''} fill="${C.text}">${esc(s)}</text>`;
    const out: string[] = [
      `<rect x="1" y="1" width="${fmt(W - 2)}" height="${fmt(H - 2)}" fill="${C.white}" stroke="${C.border}" stroke-width="1"></rect>`,
      `<rect x="1" y="1" width="${fmt(W - 2)}" height="${ROW_H}" fill="${C.panel}"></rect>`,
      ...head.map((h, c) => text(h, c, 1, true)),
    ];
    body.forEach((r, i) => {
      const y = 1 + ROW_H * (i + 1);
      out.push(`<g data-row="${i}"><line x1="1" y1="${fmt(y)}" x2="${fmt(W - 1)}" y2="${fmt(y)}" stroke="${i === 0 ? C.axis : C.border}" stroke-width="1"></line>${r.map((s, c) => text(s, c, y, false)).join('')}</g>`);
    });
    for (let c = 1; c < nCols; c++) out.push(`<line x1="${fmt(xs[c])}" y1="1" x2="${fmt(xs[c])}" y2="${fmt(H - 1)}" stroke="${C.border}" stroke-width="1"></line>`);
    return svgDoc(W, H, out);
  } catch {
    return null;
  }
}
