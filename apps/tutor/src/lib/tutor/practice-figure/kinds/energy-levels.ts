/**
 * energy_levels — batch 4 (2026-10-14). Two variants.
 *
 * variant 'orbital_boxes' — electron-configuration box diagrams (one box per
 * orbital, a small arrow per electron):
 *   { diagrams: Array<{                       // 1–4, stacked; several are for "which diagram …" questions
 *       label?: string;                       // "I", "II", … on a plate at the left
 *       core?: 'He' | 'Ne' | 'Ar' | 'Kr';     // printed "[Ne]" in front of the boxes (its electrons count)
 *       config?: string;                      // "1s2 2s2 2p3" — filled by Hund's rule; OR
 *       subshells?: Array<{ name: string;     // "1s", "2p", "3d" …
 *                           electrons?: number;        // filled by Hund's rule; OR
 *                           boxes?: string[] }> }>;    // one entry per orbital (s 1, p 3, d 5, f 7):
 *                                             //   '' empty · 'u' up · 'd' down · 'ud' a pair ·
 *                                             //   'uu' / 'dd' two alike (a WRONG filling, drawn on purpose) ·
 *                                             //   '?' a blank box (what is in it is the question)
 *     subshellLabels?: 'value' | 'none' ('value');     // "1s", "2p" under each group
 *     layout?: 'row' | 'ladder' ('row');      // ladder: ONE diagram, subshells rising in filling order beside an Energy arrow
 *     title?: string }
 *   A diagram may be wrong on purpose (a pair beside an empty box, two arrows
 *   alike in a box, a higher subshell filled first): nothing is corrected.
 *
 * variant 'levels' — an energy-level ladder with lettered transitions:
 *   { hydrogen?: { nMax: 2..7;                // E = −13.6 eV / n², labelled "n = 1" …;
 *                  blank?: number[];          //   the n whose energy is a "?" box
 *                  hide?: number[] };         //   the n whose energy is not printed; OR
 *     levels?: Array<{ energy: number; label?: string; energy_shown?: 'value' | 'blank' | 'none' }>;  // 2–8, any order
 *     units?: string ('eV');
 *     energies?: 'value' | 'blank' | 'none' ('value');   // the default for every level ("?" = a blank box)
 *     levelLabels?: 'value' | 'none' ('value');
 *     transitions?: Array<{ from: number; to: number;   // level numbers counted from the LOWEST level, 1-based
 *                           label?: string }>;           //   (for hydrogen: n). from > to is drawn downward (emission)
 *     scale?: 'auto' | 'true' | 'even' ('auto');
 *     ionization?: boolean (false);           // a dashed line at E = 0, "n = ∞" (needs every energy < 0)
 *     axisLabel?: string ('Energy'); title?: string }
 *   Scale: 'true' spaces the lines in proportion to their energies; 'even'
 *   spaces them evenly and prints "not to scale". 'auto' is 'true' when every
 *   pair of lines is then far enough apart to label (the upper levels of
 *   hydrogen are not), else 'even'. 'true' with lines too close is still
 *   drawn — and reported as crowded.
 */
import { FIGURE_WIDTH, LABEL_FS, TICK_FS, estWidth, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, blank, text, titleBlock } from './draw';
import { facts, head, lab, numStr, seg, stroke, type Notes, type Show, SHOWS } from './draw2';

// ── orbital boxes ───────────────────────────────────────────────────────────

export const BOX_STATES = ['', 'u', 'd', 'ud', 'uu', 'dd', '?'] as const;
export type BoxState = (typeof BOX_STATES)[number];
export interface Subshell { name: string; n: number; l: number; boxes: BoxState[] }
export interface OrbitalDiagram { label?: string; core?: string; subshells: Subshell[] }
export interface OrbitalModel { variant: 'orbital_boxes'; diagrams: OrbitalDiagram[]; subshellLabels: 'value' | 'none'; layout: 'row' | 'ladder'; title?: string }

export const CORE_ELECTRONS: Record<string, number> = { He: 2, Ne: 10, Ar: 18, Kr: 36 };
const L_OF = 'spdf';
/** Hund's-rule filling of one subshell: singles (up) first, then pairs. */
export function hundFill(l: number, electrons: number): BoxState[] {
  const n = 2 * l + 1;
  return Array.from({ length: n }, (_, i) => (electrons >= n + i + 1 ? 'ud' : electrons >= i + 1 ? 'u' : ''));
}
/** Filling order (n + l, then n). */
export const madelung = (a: { n: number; l: number }, b: { n: number; l: number }): number => a.n + a.l - (b.n + b.l) || a.n - b.n;

function readSubshellName(r: Reader, v: unknown, name: string): { name: string; n: number; l: number } {
  const s = r.str(v, name, 4);
  const m = /^([1-7])([spdf])$/.exec(s);
  if (!m) r.fail(`${name} must be a subshell such as 1s, 2p, 3d (got "${s}")`);
  const n = Number((m as RegExpExecArray)[1]);
  const l = L_OF.indexOf((m as RegExpExecArray)[2]);
  if (l >= n) r.fail(`${name}: there is no ${s} subshell (l must be less than n)`);
  return { name: s, n, l };
}

function orbitalModel(r: Reader): OrbitalModel {
  const p = r.p;
  const subshellLabels = p.subshellLabels === undefined || p.subshellLabels === null ? 'value' : p.subshellLabels;
  if (subshellLabels !== 'value' && subshellLabels !== 'none') r.fail('subshellLabels must be one of value, none');
  const layout = p.layout === undefined || p.layout === null ? 'row' : p.layout;
  if (layout !== 'row' && layout !== 'ladder') r.fail('layout must be one of row, ladder');
  const raw = r.list(p.diagrams, 'diagrams', 1, 4);
  if (layout === 'ladder' && raw.length !== 1) r.fail('layout "ladder" draws one diagram — give a single entry in diagrams, or use layout "row"');
  const diagrams = raw.map((dv, i): OrbitalDiagram => {
    const d = r.obj(dv, `diagrams[${i}]`);
    const label = r.optStr(d.label, `diagrams[${i}].label`, 12);
    const core = r.optStr(d.core, `diagrams[${i}].core`, 2);
    if (core !== undefined && !(core in CORE_ELECTRONS)) r.fail(`diagrams[${i}].core must be one of ${Object.keys(CORE_ELECTRONS).join(', ')}`);
    let subshells: Subshell[];
    if (typeof d.config === 'string') {
      if (d.subshells !== undefined && d.subshells !== null) r.fail(`diagrams[${i}]: give config or subshells, not both`);
      const parts = r.str(d.config, `diagrams[${i}].config`, 120).split(' ');
      subshells = parts.map((part, j) => {
        const m = /^([1-7][spdf])(\d{1,2})$/.exec(part);
        if (!m) r.fail(`diagrams[${i}].config: "${part}" is not a subshell with its electrons, such as 2p3`);
        const s = readSubshellName(r, (m as RegExpExecArray)[1], `diagrams[${i}].config part ${j + 1}`);
        const e = Number((m as RegExpExecArray)[2]);
        if (e > 2 * (2 * s.l + 1)) r.fail(`diagrams[${i}].config: ${part} — a ${s.name} subshell holds at most ${2 * (2 * s.l + 1)} electrons`);
        return { ...s, boxes: hundFill(s.l, e) };
      });
    } else {
      subshells = r.list(d.subshells, `diagrams[${i}].subshells`, 1, 12).map((sv, j) => {
        const at = `diagrams[${i}].subshells[${j}]`;
        const so = r.obj(sv, at);
        const s = readSubshellName(r, so.name, `${at}.name`);
        const cap = 2 * s.l + 1;
        if (so.boxes !== undefined && so.boxes !== null) {
          if (so.electrons !== undefined && so.electrons !== null) r.fail(`${at}: give electrons or boxes, not both`);
          const boxes = r.list(so.boxes, `${at}.boxes`, cap, cap).map((b, k) => {
            if (typeof b !== 'string' || !(BOX_STATES as readonly string[]).includes(b)) r.fail(`${at}.boxes[${k}] must be one of '', u, d, ud, uu, dd, ?`);
            return b as BoxState;
          });
          return { ...s, boxes };
        }
        const e = r.num(so.electrons, `${at}.electrons`);
        if (!Number.isInteger(e) || e < 0 || e > 2 * cap) r.fail(`${at}.electrons must be a whole number from 0 to ${2 * cap}`);
        return { ...s, boxes: hundFill(s.l, e) };
      });
    }
    const names = subshells.map((s) => s.name);
    if (new Set(names).size !== names.length) r.fail(`diagrams[${i}]: a subshell is listed twice`);
    return { label, core, subshells };
  });
  if (layout === 'ladder' && diagrams[0].subshells.length > 9) r.fail('layout "ladder" has room for at most 9 subshells');
  return { variant: 'orbital_boxes', diagrams, subshellLabels, layout, title: r.optStr(p.title, 'title', 160) };
}

const BOX = 22;
const GROUP_GAP = 8;

/** A box with its half-arrows (or the dashed "?" in place of the box). */
function boxSvg(x: number, y: number, state: BoxState): string {
  if (state === '?') return blank(x + BOX / 2, y + BOX / 2, BOX, BOX, 12);
  const out = [`<rect x="${n2(x)}" y="${n2(y)}" width="${BOX}" height="${BOX}" fill="#ffffff" stroke="${INK}" stroke-width="1.3"/>`];
  const arrows = state === 'ud' ? 'ud' : state;
  const xs = arrows.length === 2 ? [x + BOX / 2 - 4.5, x + BOX / 2 + 4.5] : [x + BOX / 2];
  [...arrows].forEach((a, i) => {
    const ax = xs[i];
    const top = y + 3.5;
    const bot = y + BOX - 3.5;
    // A small full arrow: the head carries the direction without colour.
    out.push(a === 'u'
      ? `<path d="M${n2(ax)},${n2(bot)}V${n2(top + 5)}" ${stroke(INK, 1.5)}/><polygon points="${n2(ax)},${n2(top)} ${n2(ax - 3.2)},${n2(top + 6.5)} ${n2(ax + 3.2)},${n2(top + 6.5)}" fill="${INK}"/>`
      : `<path d="M${n2(ax)},${n2(top)}V${n2(bot - 5)}" ${stroke(INK, 1.5)}/><polygon points="${n2(ax)},${n2(bot)} ${n2(ax - 3.2)},${n2(bot - 6.5)} ${n2(ax + 3.2)},${n2(bot - 6.5)}" fill="${INK}"/>`);
  });
  return out.join('');
}

/** The label of a diagram ("I", "II") on a plate, so a lone "I" does not read as a stroke. */
function plate(x: number, cy: number, s: string): { svg: string; w: number } {
  const w = Math.max(22, estWidth(s, LABEL_FS) + 12);
  return {
    w,
    svg: `<rect x="${n2(x)}" y="${n2(cy - 10)}" width="${n2(w)}" height="20" rx="4" fill="#ffffff" stroke="${MUTED}" stroke-width="1"/>`
      + text(x + w / 2, cy + LABEL_FS * 0.36, s, { fs: LABEL_FS, anchor: 'middle', weight: 700 }),
  };
}

function renderOrbitalBoxes(m: OrbitalModel): Drawn {
  const W = FIGURE_WIDTH;
  const notes: Notes = [];
  const t = titleBlock(m.title, W);
  const parts: string[] = [t.svg];
  const labelH = m.subshellLabels === 'value' ? TICK_FS + 5 : 0;
  let y = t.top + 4;

  if (m.layout === 'ladder') {
    const d = m.diagrams[0];
    const order = d.subshells.slice().sort(madelung);
    const rowH = BOX + 12;
    const H0 = y;
    const bottom = H0 + order.length * rowH;
    const colX = [84, 132, 222, 232];
    order.forEach((s, k) => {
      const by = bottom - (k + 1) * rowH + 6;
      const cap = s.boxes.length;
      const x0 = s.l === 3 ? 84 : s.l === 2 ? Math.min(colX[2], W - 10 - cap * BOX) : colX[s.l];
      s.boxes.forEach((b, j) => parts.push(boxSvg(x0 + j * BOX, by, b)));
      if (m.subshellLabels === 'value') parts.push(text(x0 - 6, by + BOX / 2 + TICK_FS * 0.36, s.name, { anchor: 'end' }));
    });
    // The energy arrow.
    parts.push(seg(26, bottom, 26, H0 + 12, INK, 1.4) + head(26, H0 + 4, 0, -1, 8));
    parts.push(`<text x="16" y="${n2((H0 + bottom) / 2)}" font-size="${LABEL_FS}" text-anchor="middle" fill="${INK}" transform="rotate(-90 16 ${n2((H0 + bottom) / 2)})">Energy</text>`);
    if (d.core) parts.push(text(W - 12, bottom - 4, `[${d.core}]`, { fs: LABEL_FS, anchor: 'end', weight: 600 }));
    if (d.label) parts.push(plate(W - 40, H0 + 12, d.label).svg);
    return { body: parts.join(''), H: bottom + 8, facts: facts(notes) };
  }

  const anyLabel = m.diagrams.some((d) => d.label);
  const left0 = 10 + (anyLabel ? Math.max(...m.diagrams.map((d) => (d.label ? Math.max(22, estWidth(d.label, LABEL_FS) + 12) : 0))) + 8 : 0);
  // First pass: where everything goes from the left edge; then the block of boxes is centred in the room it has.
  const items: Array<(dx: number) => string> = [];
  let widest = 0;
  let lines = 0;
  m.diagrams.forEach((d, di) => {
    if (di > 0) {
      y += 6;
      parts.push(seg(10, y, W - 10, y, '#d1d5db', 1));
      y += 10;
    }
    const firstY = y;
    let x = left0;
    if (d.core) {
      const [cx, cy] = [x, y + BOX / 2 + LABEL_FS * 0.36];
      items.push((dx) => text(cx + dx, cy, `[${d.core}]`, { fs: LABEL_FS, weight: 600 }));
      x += estWidth(`[${d.core}]`, LABEL_FS) + 8;
    }
    const indent = x;
    for (const s of d.subshells) {
      const w = s.boxes.length * BOX;
      if (x + w > W - 10 && x > indent) {
        x = indent;
        y += BOX + labelH + 10;
      }
      const [sx, sy] = [x, y];
      s.boxes.forEach((b, j) => items.push((dx) => boxSvg(sx + dx + j * BOX, sy, b)));
      if (m.subshellLabels === 'value') items.push((dx) => text(sx + dx + w / 2, sy + BOX + TICK_FS + 2, s.name, { anchor: 'middle' }));
      x += w + GROUP_GAP;
      widest = Math.max(widest, x - GROUP_GAP);
    }
    lines += 1 + Math.round((y - firstY) / (BOX + labelH + 10));
    if (d.label) parts.push(plate(10, firstY + BOX / 2, d.label).svg);
    y += BOX + labelH + 4;
  });
  const shift = Math.max(0, (W - 10 - widest) / 2);
  parts.push(...items.map((f) => f(shift)));
  if (lines > 6) notes.push({ code: 'too_many_elements', message: `${lines} lines of boxes — more than 6 make a tall figure on a phone; show fewer subshells (use core) or fewer diagrams` });
  return { body: parts.join(''), H: y + 6, facts: facts(notes) };
}

// ── levels ──────────────────────────────────────────────────────────────────

export interface Level { energy: number; label?: string; show: Show }
export interface Transition { from: number; to: number; label?: string }
export interface LevelsModel {
  variant: 'levels';
  hydrogen: boolean;
  /** Ascending in energy: levels[0] is the lowest (level number 1). */
  levels: Level[];
  units: string;
  levelLabels: 'value' | 'none';
  transitions: Transition[];
  scale: 'auto' | 'true' | 'even';
  ionization: boolean;
  axisLabel: string;
  title?: string;
}

const oneOf = <T extends string>(r: Reader, v: unknown, name: string, allowed: readonly T[], dflt: T): T => {
  if (v === undefined || v === null) return dflt;
  if (typeof v !== 'string' || !allowed.includes(v as T)) r.fail(`${name} must be one of ${allowed.join(', ')}`);
  return v as T;
};

function levelsModel(r: Reader): LevelsModel {
  const p = r.p;
  const dflt = oneOf(r, p.energies, 'energies', SHOWS, 'value');
  let levels: Level[];
  const hydrogen = p.hydrogen !== undefined && p.hydrogen !== null;
  if (hydrogen) {
    if (p.levels !== undefined && p.levels !== null) r.fail('give hydrogen or levels, not both');
    const nMax = r.num(r.obj(p.hydrogen, 'hydrogen').nMax, 'hydrogen.nMax');
    if (!Number.isInteger(nMax) || nMax < 2 || nMax > 7) r.fail('hydrogen.nMax must be a whole number from 2 to 7');
    const ns = (v: unknown, name: string): number[] => (v === undefined || v === null ? [] : r.list(v, name, 0, 7).map((x, i) => {
      const n = r.num(x, `${name}[${i}]`);
      if (!Number.isInteger(n) || n < 1 || n > nMax) r.fail(`${name}[${i}] must be a level n from 1 to ${nMax}`);
      return n;
    }));
    const blanks = ns((p.hydrogen as Record<string, unknown>).blank, 'hydrogen.blank');
    const hidden = ns((p.hydrogen as Record<string, unknown>).hide, 'hydrogen.hide');
    levels = Array.from({ length: nMax }, (_, i) => ({ energy: Number((-13.6 / (i + 1) ** 2).toPrecision(3)), label: `n = ${i + 1}`, show: blanks.includes(i + 1) ? 'blank' : hidden.includes(i + 1) ? 'none' : dflt }));
  } else {
    levels = r.list(p.levels, 'levels', 2, 8).map((lv, i) => {
      const o = r.obj(lv, `levels[${i}]`);
      return { energy: r.num(o.energy, `levels[${i}].energy`), label: r.optStr(o.label, `levels[${i}].label`, 14), show: oneOf(r, o.energy_shown, `levels[${i}].energy_shown`, SHOWS, dflt) };
    }).sort((a, b) => a.energy - b.energy);
    for (let i = 1; i < levels.length; i++) if (levels[i].energy === levels[i - 1].energy) r.fail(`levels: two levels have the same energy (${levels[i].energy})`);
  }
  const transitions = (p.transitions === undefined || p.transitions === null ? [] : r.list(p.transitions, 'transitions', 0, 6)).map((tv, i) => {
    const o = r.obj(tv, `transitions[${i}]`);
    const from = r.num(o.from, `transitions[${i}].from`);
    const to = r.num(o.to, `transitions[${i}].to`);
    for (const [k, v] of [['from', from], ['to', to]] as const) {
      if (!Number.isInteger(v) || v < 1 || v > levels.length) r.fail(`transitions[${i}].${k} must be a level number from 1 (the lowest level) to ${levels.length}`);
    }
    if (from === to) r.fail(`transitions[${i}]: from and to are the same level`);
    return { from, to, label: r.optStr(o.label, `transitions[${i}].label`, 6) };
  });
  const ionization = r.bool(p.ionization, 'ionization', false);
  if (ionization && levels[levels.length - 1].energy >= 0) r.fail('ionization: the E = 0 line needs every level energy to be below 0');
  return {
    variant: 'levels', hydrogen, levels, units: r.optStr(p.units, 'units', 10) ?? 'eV', levelLabels: oneOf(r, p.levelLabels, 'levelLabels', ['value', 'none'] as const, 'value'),
    transitions, scale: oneOf(r, p.scale, 'scale', ['auto', 'true', 'even'] as const, 'auto'), ionization, axisLabel: r.optStr(p.axisLabel, 'axisLabel', 30) ?? 'Energy', title: r.optStr(p.title, 'title', 160),
  };
}

const MIN_LEVEL_GAP = 19;
const LEVELS_H = 250;

/** How the lines are spaced: the y of each level (and of E = 0) in a band of `LEVELS_H`, and whether that is to scale. */
export function levelsLayout(m: LevelsModel): { ys: number[]; zeroY?: number; toScale: boolean; crowded: boolean } {
  const es = m.levels.map((l) => l.energy);
  const all = m.ionization ? [...es, 0] : es;
  const lo = all[0];
  const hi = all[all.length - 1];
  const trueY = (e: number) => LEVELS_H - ((e - lo) / (hi - lo)) * LEVELS_H;
  const gaps = all.slice(1).map((e, i) => trueY(all[i]) - trueY(e));
  const tight = gaps.some((g) => g < MIN_LEVEL_GAP);
  const toScale = m.scale === 'true' || (m.scale === 'auto' && !tight);
  const ys = toScale ? all.map(trueY) : all.map((_, i) => LEVELS_H - (i / (all.length - 1)) * LEVELS_H);
  return { ys: ys.slice(0, es.length), zeroY: m.ionization ? ys[ys.length - 1] : undefined, toScale, crowded: toScale && tight };
}

function renderLevels(m: LevelsModel): Drawn {
  const W = FIGURE_WIDTH;
  const notes: Notes = [];
  const t = titleBlock(m.title, W);
  const parts: string[] = [t.svg];
  const lay = levelsLayout(m);
  const top = t.top + 14;
  const Y = (i: number) => top + lay.ys[i];
  const energyText = (l: Level) => `${numStr(l.energy, 3)} ${m.units}`;
  const leftW = m.levelLabels === 'value' ? Math.max(0, ...m.levels.map((l) => (l.label ? estWidth(l.label, TICK_FS) : 0)), m.ionization ? estWidth('n = ∞', TICK_FS) : 0) : 0;
  const rightW = Math.max(0, ...m.levels.map((l) => (l.show === 'value' ? estWidth(energyText(l), TICK_FS) : l.show === 'blank' ? 22 : 0)), m.ionization ? estWidth(`0 ${m.units}`, TICK_FS) : 0);
  const x0 = 38 + (leftW ? leftW + 8 : 4);
  const x1 = W - 10 - (rightW ? rightW + 8 : 0);
  // Energy arrow.
  const axisText = `${m.axisLabel}${m.units && !/\(/.test(m.axisLabel) ? ` (${m.units})` : ''}`;
  parts.push(seg(28, top + LEVELS_H + 6, 28, top - 2, INK, 1.4) + head(28, top - 10, 0, -1, 8));
  parts.push(`<text x="16" y="${n2(top + LEVELS_H / 2)}" font-size="${LABEL_FS}" text-anchor="middle" fill="${INK}" transform="rotate(-90 16 ${n2(top + LEVELS_H / 2)})">${axisText.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`);
  m.levels.forEach((l, i) => {
    const y = Y(i);
    parts.push(seg(x0, y, x1, y, INK, 2));
    if (m.levelLabels === 'value' && l.label) parts.push(text(x0 - 8, y + TICK_FS * 0.36, l.label, { anchor: 'end' }));
    if (l.show !== 'none') parts.push(lab(x1 + 8, y + TICK_FS * 0.36, l.show === 'blank' ? '?' : energyText(l), 'start'));
  });
  if (lay.zeroY !== undefined) {
    const y = top + lay.zeroY;
    parts.push(seg(x0, y, x1, y, MUTED, 1.4, '6 4'));
    if (m.levelLabels === 'value') parts.push(text(x0 - 8, y + TICK_FS * 0.36, 'n = ∞', { anchor: 'end' }));
    parts.push(text(x1 + 8, y + TICK_FS * 0.36, `0 ${m.units}`));
  }
  // Transitions: evenly across the lines, each a vertical arrow with its letter beside the tail end.
  const k = m.transitions.length;
  m.transitions.forEach((tr, i) => {
    const x = x0 + ((x1 - x0) * (i + 0.6)) / (k + 0.2);
    const ya = Y(tr.from - 1);
    const yb = Y(tr.to - 1);
    const dir = yb > ya ? 1 : -1;
    parts.push(seg(x, ya, x, yb - dir * 8, INK, 1.8) + head(x, yb - dir * 1.2, 0, dir, 9));
    if (tr.label) {
      // Beside the shaft, in the widest gap between lines that the arrow crosses.
      const lo = Math.min(tr.from, tr.to) - 1;
      const hi = Math.max(tr.from, tr.to) - 1;
      let best = lo;
      for (let j = lo; j < hi; j++) if (Y(j) - Y(j + 1) > Y(best) - Y(best + 1)) best = j;
      const cy = (Y(best) + Y(best + 1)) / 2;
      parts.push(text(x + 6, cy + LABEL_FS * 0.36, tr.label, { fs: LABEL_FS, weight: 700, halo: true }));
    }
  });
  let bottom = top + LEVELS_H + 12;
  if (!lay.toScale) {
    parts.push(text(W / 2, bottom + TICK_FS, 'not to scale', { anchor: 'middle', fill: MUTED, italic: true }));
    bottom += TICK_FS + 6;
  }
  if (lay.crowded) notes.push({ code: 'crowded', message: 'drawn to scale, two levels are under 19 units apart and their labels run together — use scale "even" (or "auto"), or fewer levels' });
  if (k > 0 && (x1 - x0) / k < 26) notes.push({ code: 'crowded', message: `${k} transitions are under 26 units apart — their letters crowd; shorten the labels or draw fewer` });
  return { body: parts.join(''), H: bottom, facts: facts(notes) };
}

// ── entry ───────────────────────────────────────────────────────────────────

export type EnergyLevelsModel = OrbitalModel | LevelsModel;

export function energyLevelsModel(r: Reader): EnergyLevelsModel {
  const v = r.p.variant;
  if (v === 'orbital_boxes') return orbitalModel(r);
  if (v === 'levels') return levelsModel(r);
  return r.fail('variant must be one of orbital_boxes, levels');
}

export function renderEnergyLevels(r: Reader, _uid?: string): Drawn {
  const m = energyLevelsModel(r);
  return m.variant === 'orbital_boxes' ? renderOrbitalBoxes(m) : renderLevels(m);
}
