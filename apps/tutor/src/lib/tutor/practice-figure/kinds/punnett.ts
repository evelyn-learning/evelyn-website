/**
 * punnett_square — a grid of offspring genotypes with the parents' gametes
 * along the top and down the side.
 *
 * { top: string[]; side: string[];        // gametes, 2–4 each ("A", "a" · "RY", "Ry", "rY", "ry")
 *   topLabel?: string; sideLabel?: string;   // the parents ("Father  Aa")
 *   cells?: string[][];                   // side.length rows × top.length columns; default: the
 *                                         //   side and top alleles of each gene paired, the
 *                                         //   capital (dominant) one first — "Aa", "RrYy".
 *                                         //   Give them for anything else (X-linked: "XᴬXᵃ", "XᵃY")
 *   blankCells?: Array<[row, col]>;       // drawn as a dashed "?" box
 *   blankTop?: number[]; blankSide?: number[];   // gamete headers drawn as "?"
 *   phenotypes?: Array<{ label: string; genotypes: string[] }>;   // up to 4 classes: each cell is
 *                                         //   hatched by its class, with a legend
 *   title?: string }
 *
 * A blank cell is never hatched (its hatch would give its class away).
 */
import { FIGURE_WIDTH, LABEL_FS, TICK_FS, TITLE_FS, esc, estWidth, n2 } from '../plot-frame';
import type { Drawn, FigureFacts, Reader } from '../spec';
import { INK, blank, hatchPath, inkWidth, text, titleBlock, type HatchStyle } from './draw';

export interface PunnettCell {
  genotype: string;
  blank: boolean;
  /** Index into `phenotypes`, or −1. */
  phenotype: number;
}
export interface PunnettModel {
  top: string[];
  side: string[];
  blankTop: boolean[];
  blankSide: boolean[];
  topLabel?: string;
  sideLabel?: string;
  cells: PunnettCell[][];
  phenotypes: Array<{ label: string; genotypes: string[] }>;
  title?: string;
}

/** One gene's two alleles in the conventional order: the capital first. */
function pairAlleles(a: string, b: string): string {
  const upper = (c: string) => c !== c.toLowerCase();
  if (upper(a) !== upper(b)) return upper(a) ? a + b : b + a;
  return a <= b ? a + b : b + a;
}

export function punnettModel(r: Reader): PunnettModel {
  const p = r.p;
  const top = r.list(p.top, 'top', 2, 4).map((g, i) => r.str(g, `top[${i}]`, 6));
  const side = r.list(p.side, 'side', 2, 4).map((g, i) => r.str(g, `side[${i}]`, 6));
  let genotypes: string[][];
  if (p.cells !== undefined && p.cells !== null) {
    const rows = r.list(p.cells, 'cells', side.length, side.length);
    genotypes = rows.map((row, i) => r.list(row, `cells[${i}]`, top.length, top.length).map((c, j) => r.str(c, `cells[${i}][${j}]`, 10)));
  } else {
    const len = top[0].length;
    if ([...top, ...side].some((g) => [...g].length !== len)) r.fail('every gamete must carry the same number of alleles (one letter per gene) — or give cells');
    genotypes = side.map((s) => top.map((t) => [...s].map((allele, k) => pairAlleles(allele, [...t][k])).join('')));
  }
  const flags = (v: unknown, name: string, n: number): boolean[] => {
    const out: boolean[] = new Array(n).fill(false);
    if (v === undefined || v === null) return out;
    r.list(v, name, 0, n).forEach((raw, i) => {
      const k = r.num(raw, `${name}[${i}]`);
      if (!Number.isInteger(k) || k < 0 || k >= n) r.fail(`${name}[${i}] must be an index from 0 to ${n - 1}`);
      out[k] = true;
    });
    return out;
  };
  const blankCell = side.map(() => top.map(() => false));
  if (p.blankCells !== undefined && p.blankCells !== null) {
    r.list(p.blankCells, 'blankCells', 0, 16).forEach((raw, i) => {
      if (!Array.isArray(raw) || raw.length !== 2 || !Number.isInteger(raw[0]) || !Number.isInteger(raw[1]) || raw[0] < 0 || raw[0] >= side.length || raw[1] < 0 || raw[1] >= top.length) r.fail(`blankCells[${i}] must be [row, col] inside the ${side.length} × ${top.length} grid`);
      blankCell[(raw as number[])[0]][(raw as number[])[1]] = true;
    });
  }
  const phenotypes = (p.phenotypes === undefined || p.phenotypes === null ? [] : r.list(p.phenotypes, 'phenotypes', 1, 4)).map((raw, i) => {
    const o = r.obj(raw, `phenotypes[${i}]`);
    return { label: r.str(o.label, `phenotypes[${i}].label`, 28), genotypes: r.list(o.genotypes, `phenotypes[${i}].genotypes`, 1, 16).map((g, k) => r.str(g, `phenotypes[${i}].genotypes[${k}]`, 10)) };
  });
  const cells = genotypes.map((row, i) => row.map((genotype, j): PunnettCell => {
    const phenotype = phenotypes.findIndex((ph) => ph.genotypes.includes(genotype));
    if (phenotypes.length > 0 && phenotype < 0) r.fail(`phenotypes do not cover the genotype "${genotype}" (row ${i}, column ${j})`);
    return { genotype, blank: blankCell[i][j], phenotype };
  }));
  return {
    top, side,
    blankTop: flags(p.blankTop, 'blankTop', top.length),
    blankSide: flags(p.blankSide, 'blankSide', side.length),
    topLabel: r.optStr(p.topLabel, 'topLabel', 40), sideLabel: r.optStr(p.sideLabel, 'sideLabel', 40),
    cells, phenotypes, title: r.optStr(p.title, 'title', 160),
  };
}

/** Hatch per phenotype class. EVERY class is hatched, so a plain cell can only be a blank one. */
const CLASS_HATCH: Array<HatchStyle | ''> = ['/', '\\', '-', '|'];
const HATCH_COLOR = '#64748b';
/** Width of the "?" box that stands for a blank side gamete. */
const BLANK_SIDE_W = 22;

export function renderPunnett(r: Reader, uid: string): Drawn {
  const m = punnettModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const cols = m.top.length;
  const rows = m.side.length;
  const notes: NonNullable<FigureFacts['notes']> = [];
  const widest = Math.max(...m.cells.flat().map((c) => estWidth(c.genotype, TITLE_FS)), ...m.top.map((g) => estWidth(g, TITLE_FS)));
  // The side margin holds the gametes — and a blank one is a 22-unit "?" box, wider than a
  // one-letter gamete: without room for it the box ran into the rotated `sideLabel`.
  const sideW = Math.max(Math.max(...m.side.map((g) => estWidth(g, TITLE_FS))) + 14, m.blankSide.some(Boolean) ? BLANK_SIDE_W + 14 : 0);
  const leftPad = (m.sideLabel ? LABEL_FS + 10 : 6) + sideW;
  const cw = Math.min(78, (W - leftPad - 10) / cols);
  if (widest > cw - 8) notes.push({ code: 'crowded', message: `the widest genotype needs ${Math.ceil(widest)} units and a cell is ${Math.floor(cw)} wide — shorten the genotypes or use fewer gametes` });
  const ch = Math.min(cw, 46);
  const gridW = cw * cols;
  const x0 = Math.max(leftPad, (W - gridW) / 2 + (leftPad - 10) / 2);
  const y0 = t.top + (m.topLabel ? LABEL_FS + 8 : 0) + TITLE_FS + 12;
  const parts: string[] = [t.svg];
  const defs: string[] = [];
  if (m.topLabel) parts.push(text(x0 + gridW / 2, t.top + LABEL_FS, m.topLabel, { fs: LABEL_FS, anchor: 'middle', weight: 600 }));
  if (m.sideLabel) {
    const lx = x0 - sideW - 6;
    const ly = y0 + (ch * rows) / 2;
    parts.push(`<text x="${n2(lx)}" y="${n2(ly)}" font-size="${LABEL_FS}" font-weight="600" text-anchor="middle" fill="${INK}" transform="rotate(-90 ${n2(lx)} ${n2(ly)})">${esc(m.sideLabel)}</text>`);
  }
  // Phenotype hatching first (under the grid lines and the text): one clip path per class.
  m.phenotypes.forEach((_, k) => {
    const style = CLASS_HATCH[k];
    if (!style) return;
    const rects: string[] = [];
    m.cells.forEach((row, i) => row.forEach((c, j) => {
      if (c.phenotype === k && !c.blank) rects.push(`<rect x="${n2(x0 + j * cw)}" y="${n2(y0 + i * ch)}" width="${n2(cw)}" height="${n2(ch)}"/>`);
    }));
    if (rects.length === 0) return;
    defs.push(`<clipPath id="${uid}-ph${k}">${rects.join('')}</clipPath>`);
    parts.push(`<g clip-path="url(#${uid}-ph${k})"><path d="${hatchPath({ x0, y0, x1: x0 + gridW, y1: y0 + ch * rows }, style, 7)}" fill="none" stroke="${HATCH_COLOR}" stroke-width="1"/></g>`);
  });
  const grid: string[] = [];
  for (let i = 0; i <= rows; i++) grid.push(`M${n2(x0)},${n2(y0 + i * ch)}h${n2(gridW)}`);
  for (let j = 0; j <= cols; j++) grid.push(`M${n2(x0 + j * cw)},${n2(y0)}v${n2(ch * rows)}`);
  parts.push(`<path d="${grid.join('')}" fill="none" stroke="${INK}" stroke-width="1.5"/>`);
  m.top.forEach((g, j) => {
    const cx = x0 + (j + 0.5) * cw;
    if (m.blankTop[j]) parts.push(blank(cx, y0 - 13, 22, 18, 12));
    else parts.push(text(cx, y0 - 8, g, { fs: TITLE_FS, anchor: 'middle', weight: 700 }));
  });
  m.side.forEach((g, i) => {
    const cy = y0 + (i + 0.5) * ch;
    if (m.blankSide[i]) parts.push(blank(x0 - 7 - BLANK_SIDE_W / 2, cy, BLANK_SIDE_W, 18, 12));
    else parts.push(text(x0 - 8, cy + TITLE_FS * 0.36, g, { fs: TITLE_FS, anchor: 'end', weight: 700 }));
  });
  m.cells.forEach((row, i) => row.forEach((c, j) => {
    const cx = x0 + (j + 0.5) * cw;
    const cy = y0 + (i + 0.5) * ch;
    if (c.blank) parts.push(blank(cx, cy, Math.min(34, cw - 14), Math.min(24, ch - 12), 13));
    else {
      // Over a hatch the genotype sits on a small white plate, so no hatch line runs through a letter.
      if (c.phenotype >= 0 && CLASS_HATCH[c.phenotype]) {
        const w = inkWidth(c.genotype, TITLE_FS) + 8;
        parts.push(`<rect x="${n2(cx - w / 2)}" y="${n2(cy - TITLE_FS * 0.62)}" width="${n2(w)}" height="${n2(TITLE_FS * 1.3)}" rx="2" fill="#ffffff"/>`);
      }
      parts.push(text(cx, cy + TITLE_FS * 0.36, c.genotype, { fs: TITLE_FS, anchor: 'middle', weight: 600 }));
    }
  }));
  let H = y0 + ch * rows + 10;
  // Legend: a hatched swatch per class.
  if (m.phenotypes.length > 0) {
    let x = 12;
    let y = H + 2;
    m.phenotypes.forEach((ph, k) => {
      const w = 18 + 6 + estWidth(ph.label, TICK_FS) + 14;
      if (x > 12 && x + w > W - 6) {
        x = 12;
        y += 22;
      }
      const style = CLASS_HATCH[k];
      if (style) {
        defs.push(`<clipPath id="${uid}-lg${k}"><rect x="${n2(x)}" y="${n2(y)}" width="18" height="16"/></clipPath>`);
        parts.push(`<g clip-path="url(#${uid}-lg${k})"><path d="${hatchPath({ x0: x, y0: y, x1: x + 18, y1: y + 16 }, style, 7)}" fill="none" stroke="${HATCH_COLOR}" stroke-width="1"/></g>`);
      }
      parts.push(`<rect x="${n2(x)}" y="${n2(y)}" width="18" height="16" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
      parts.push(text(x + 24, y + 12, ph.label, { fill: INK }));
      x += w;
    });
    H = y + 16 + 10;
  }
  // The rotated side label runs the height of the grid: a longer one overhangs the top gametes
  // and the legend.
  if (m.sideLabel && estWidth(m.sideLabel, LABEL_FS) > ch * rows + 24) notes.push({ code: 'labels_overlap', message: `sideLabel "${m.sideLabel}" is longer than the grid is tall (${Math.floor(ch * rows)} units) — it overhangs the row of gametes above; shorten it` });
  // A blank header with nothing left in its row / column to recover it from.
  m.blankTop.forEach((b, j) => {
    if (b && m.cells.every((row) => row[j].blank)) notes.push({ code: 'ambiguous_blank', message: `blankTop: column ${j} has a blank header and every cell under it is blank — nothing fixes the gamete` });
  });
  m.blankSide.forEach((b, i) => {
    if (b && m.cells[i].every((c) => c.blank)) notes.push({ code: 'ambiguous_blank', message: `blankSide: row ${i} has a blank header and every cell in it is blank — nothing fixes the gamete` });
  });
  return { body: (defs.length ? `<defs>${defs.join('')}</defs>` : '') + parts.join(''), H, facts: { curveCount: 0, marks: [], curves: [], notes } };
}
