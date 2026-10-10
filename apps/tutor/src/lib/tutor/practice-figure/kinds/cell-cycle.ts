/**
 * cell_cycle_wheel — batch 5 (2026-10-16): the cell cycle as a ring of
 * sectors read CLOCKWISE from the top (an arrow in the hole shows the
 * direction), each sector as wide as its share of the cycle.
 *
 *   { phases?: Array<{ name: string;               // what the phase IS ("G1", "S", "G2", "M", … ≤ 10 characters)
 *                      duration: number;           // > 0, in `unit`
 *                      label?: string | null;      // what is PRINTED for it (default: the name; "?" = a blank box;
 *                                                  //   "X", "1"; null = nothing)
 *                      showDuration?: 'value' | 'blank' | 'none' }>;   // over `durations` for this phase
 *                                                  // 3–6 phases; default G1 11, S 8, G2 4, M 1 (a 24-hour cycle)
 *     unit?: string ('h');
 *     durations?: 'value' | 'blank' | 'none' ('value');   // "11 h" outside each sector
 *     total?: 'value' | 'blank' | 'none' ('none');        // "one cycle / 24 h" in the hole
 *     scale?: 'proportional' | 'equal' ('proportional');  // 'equal': same-size sectors and "not to scale" printed —
 *                                                          //   a hidden duration cannot be judged by eye
 *     checkpoints?: Array<{ at: string;            // "G1/S", "G2/M" (the boundary between two neighbours) or a
 *                                                  //   phase name ("M": the middle of that phase)
 *                           label?: string | null }>;      // default "<at> checkpoint"; "1", "?"; null = a bare marker
 *     interphase?: string | boolean;               // an arc outside G1 + S + G2 with this label (true = "interphase")
 *     title?: string }
 *
 * Sectors are told apart without colour: each has its own hatching (the
 * first is plain). A checkpoint is a filled triangle on the rim.
 */
import { FIGURE_WIDTH, LABEL_FS, TICK_FS, estWidth, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, arcPath, blank, hatched, overlaps, text, titleBlock, type Anchor, type Box, type HatchStyle } from './draw';
import { SHOWS, deg, facts, head, numStr, seg, stroke, type Notes, type Show } from './draw2';

export interface CyclePhase { name: string; duration: number; label: string | null; showDuration: Show }
export interface CycleCheckpoint { at: string; /** Fraction of the cycle (0 = the top, clockwise) at which the marker stands. */ fraction: number; label: string | null }
export interface CycleModel {
  phases: CyclePhase[];
  unit: string;
  total: number;
  showTotal: Show;
  scale: 'proportional' | 'equal';
  checkpoints: CycleCheckpoint[];
  interphase?: string;
  title?: string;
}

const DEFAULT_PHASES = [{ name: 'G1', duration: 11 }, { name: 'S', duration: 8 }, { name: 'G2', duration: 4 }, { name: 'M', duration: 1 }];

/** The share of the ring each phase is DRAWN with: [start, end] as fractions of the turn. */
export function cycleSpans(m: Pick<CycleModel, 'phases' | 'scale' | 'total'>): Array<[number, number]> {
  let acc = 0;
  return m.phases.map((ph) => {
    const f = m.scale === 'equal' ? 1 / m.phases.length : ph.duration / m.total;
    const span: [number, number] = [acc, acc + f];
    acc += f;
    return span;
  });
}

export function cycleModel(r: Reader): CycleModel {
  const p = r.p;
  const pick = <T extends string>(v: unknown, name: string, allowed: readonly T[], dflt: T): T => {
    if (v === undefined || v === null) return dflt;
    if (typeof v !== 'string' || !allowed.includes(v as T)) r.fail(`${name} must be one of ${allowed.join(', ')}`);
    return v as T;
  };
  const durations = pick(p.durations, 'durations', SHOWS, 'value');
  const raw = p.phases === undefined || p.phases === null ? DEFAULT_PHASES : r.list(p.phases, 'phases', 3, 6);
  const phases = raw.map((v, i): CyclePhase => {
    const o = r.obj(v, `phases[${i}]`);
    const name = r.str(o.name, `phases[${i}].name`, 10);
    return { name, duration: r.positive(o.duration, `phases[${i}].duration`), label: o.label === null ? null : r.optStr(o.label, `phases[${i}].label`, 10) ?? name, showDuration: pick(o.showDuration, `phases[${i}].showDuration`, SHOWS, durations) };
  });
  const names = phases.map((ph) => ph.name);
  if (new Set(names).size !== names.length) r.fail('phases: two phases have the same name');
  const printed = phases.map((ph) => ph.label).filter((l): l is string => l !== null && l !== '?');
  if (new Set(printed).size !== printed.length) r.fail('phases: two sectors print the same label');
  const total = phases.reduce((s, ph) => s + ph.duration, 0);
  const scale = pick(p.scale, 'scale', ['proportional', 'equal'] as const, 'proportional');
  const spans = cycleSpans({ phases, scale, total });
  const checkpoints = (p.checkpoints === undefined || p.checkpoints === null ? [] : r.list(p.checkpoints, 'checkpoints', 0, 4)).map((v, i): CycleCheckpoint => {
    const o = r.obj(v, `checkpoints[${i}]`);
    const at = r.str(o.at, `checkpoints[${i}].at`, 24);
    let fraction: number;
    const parts = at.split('/').map((s) => s.trim());
    if (parts.length === 2) {
      const a = names.indexOf(parts[0]);
      const b = names.indexOf(parts[1]);
      if (a < 0 || b < 0 || b !== (a + 1) % names.length) r.fail(`checkpoints[${i}].at ("${at}") must name two phases that follow one another (${names.map((n, k) => `${n}/${names[(k + 1) % names.length]}`).join(', ')}) or one phase`);
      fraction = spans[a][1] > 1 - 1e-9 ? 0 : spans[a][1];   // the boundary that closes the ring is the top
    } else {
      const a = names.indexOf(at);
      if (a < 0) r.fail(`checkpoints[${i}].at ("${at}") must name a phase (${names.join(', ')}) or a boundary such as "${names[0]}/${names[1]}"`);
      fraction = (spans[a][0] + spans[a][1]) / 2;
    }
    return { at, fraction, label: o.label === null ? null : r.optStr(o.label, `checkpoints[${i}].label`, 20) ?? `${at} checkpoint` };
  });
  if (new Set(checkpoints.map((c) => c.at)).size !== checkpoints.length) r.fail('checkpoints: the same place is marked twice');
  let interphase: string | undefined;
  if (p.interphase !== undefined && p.interphase !== null && p.interphase !== false) {
    interphase = p.interphase === true ? 'interphase' : r.str(p.interphase, 'interphase', 12);
    const g1 = names.indexOf('G1');
    if (g1 < 0 || names[(g1 + 1) % names.length] !== 'S' || names[(g1 + 2) % names.length] !== 'G2' || g1 + 2 >= names.length) r.fail('interphase: the arc spans G1, S and G2 — the phases must hold them, in that order');
  }
  const unit = r.optStr(p.unit, 'unit', 6) ?? 'h';
  return { phases, unit, total, showTotal: pick(p.total, 'total', SHOWS, 'none'), scale, checkpoints, interphase, title: r.optStr(p.title, 'title', 160) };
}

const R_OUT = 76;
const R_IN = 42;
const HATCHES: Array<HatchStyle | null> = [null, '/', '-', 'x', '\\', '|'];
const HATCH_INK = '#9ca3af';

export function renderCellCycleWheel(r: Reader, uid = 'cc'): Drawn {
  const m = cycleModel(r);
  const W = FIGURE_WIDTH;
  const notes: Notes = [];
  const t = titleBlock(m.title, W);
  const cx = W / 2;
  const spans = cycleSpans(m);
  const LH = TICK_FS + 3;
  const bracket = m.interphase ? 9 : 0;
  const rho = (R_OUT + R_IN) / 2;

  // What is printed OUTSIDE the ring, as blocks of one or two lines hung on a direction (a fraction of the turn).
  interface Block { f: number; lines: Array<{ s: string; bold: boolean }>; base: number; leaderFrom: number }
  const blocks: Block[] = [];
  const inside: Array<{ f: number; s: string }> = [];
  const names = m.phases.map((ph) => ph.name);
  let arc: [number, number] | null = null;
  if (m.interphase) {
    const g1 = names.indexOf('G1');
    arc = [spans[g1][0] + 0.006, spans[g1 + 2][1] - 0.006];
  }
  m.phases.forEach((ph, i) => {
    const [f0, f1] = spans[i];
    const mid = (f0 + f1) / 2;
    const dur = ph.showDuration === 'none' ? null : ph.showDuration === 'blank' ? '?' : `${numStr(ph.duration, 2)} ${m.unit}`;
    const outside: Block['lines'] = [];
    if (ph.label !== null) {
      const w = ph.label === '?' ? 22 : estWidth(ph.label, LABEL_FS) + 6;
      const chord = 2 * rho * Math.sin(Math.min(Math.PI / 2, (f1 - f0) * Math.PI));
      if (chord >= w + 6) inside.push({ f: mid, s: ph.label });
      else outside.push({ s: ph.label, bold: true });
    }
    if (dur !== null) outside.push({ s: dur, bold: false });
    // A checkpoint in the middle of the phase has its triangle there: the phase's own label stands a little further round.
    const shifted = m.checkpoints.some((c) => Math.abs(c.fraction - mid) < 1e-9) ? mid + 0.3 * (f1 - f0) : mid;
    if (outside.length) blocks.push({ f: shifted, lines: outside, base: R_OUT + 9 + bracket, leaderFrom: R_OUT + 1 + bracket });
    if ((f1 - f0) * 360 < 9) notes.push({ code: 'crowded', message: `phases[${i}] (${ph.name}) is drawn only ${Math.round((f1 - f0) * 360)}° wide — use scale: 'equal' when the durations differ this much` });
  });
  if (arc && m.interphase) blocks.push({ f: (arc[0] + arc[1]) / 2, lines: [{ s: m.interphase, bold: false }], base: R_OUT + 14, leaderFrom: R_OUT + 8 });
  // Checkpoint labels after the phases': a label that has to move stays tied to its triangle by a leader.
  m.checkpoints.forEach((c) => {
    if (c.label === null) return;
    const words = c.label.split(' ');
    const lines = c.label !== '?' && estWidth(c.label, TICK_FS) > 60 && words.length > 1 ? [words.slice(0, -1).join(' '), words[words.length - 1]] : [c.label];
    blocks.push({ f: c.fraction, lines: lines.map((s) => ({ s, bold: lines.length === 1 && /^[0-9A-Z]{1,2}$/.test(s) })), base: R_OUT + 19 + bracket, leaderFrom: R_OUT + 13 + bracket });
  });

  // Room over and under the ring for the tallest block.
  const PAD = Math.max(14 + bracket, ...blocks.map((b) => b.base - R_OUT + b.lines.length * LH + 6)) + (blocks.some((b) => b.lines.length > 1) && m.checkpoints.length > 1 ? 10 : 0);
  const cy = t.top + PAD + R_OUT;
  let H = cy + R_OUT + PAD;
  /** Angle (radians, y up) of a fraction of the turn: clockwise from the top. */
  const ang = (f: number): number => deg(90 - 360 * f);
  const at = (f: number, rr: number): [number, number] => [cx + rr * Math.cos(ang(f)), cy - rr * Math.sin(ang(f))];
  const defs: string[] = [];
  const parts: string[] = [];
  const over: string[] = [];

  // Sectors.
  spans.forEach(([f0, f1], i) => {
    const large = f1 - f0 > 0.5 ? 1 : 0;
    const [ax, ay] = at(f0, R_OUT);
    const [bx, by] = at(f1, R_OUT);
    const [px, py] = at(f1, R_IN);
    const [qx, qy] = at(f0, R_IN);
    const d = `M${n2(ax)},${n2(ay)}A${R_OUT},${R_OUT} 0 ${large} 1 ${n2(bx)},${n2(by)}L${n2(px)},${n2(py)}A${R_IN},${R_IN} 0 ${large} 0 ${n2(qx)},${n2(qy)}z`;
    parts.push(`<path d="${d}" fill="#ffffff"/>`);
    const style = HATCHES[i % HATCHES.length];
    if (style) {
      const h = hatched(`${uid}-s${i}`, `<path d="${d}"`, { x0: cx - R_OUT, y0: cy - R_OUT, x1: cx + R_OUT, y1: cy + R_OUT }, style, HATCH_INK, { gap: 7 });
      defs.push(h.def);
      parts.push(h.svg);
    }
    over.push(`<path d="${d}" ${stroke(INK, 1.8)} stroke-linejoin="round"/>`);
  });
  for (const q of inside) {
    const [x, y] = at(q.f, rho);
    over.push(q.s === '?' ? blank(x, y, 20, 16, LABEL_FS) : text(x, y + LABEL_FS * 0.36, q.s, { fs: LABEL_FS, anchor: 'middle', weight: 700, halo: true }));
  }

  // The direction of reading: an arrow round the hole; the length of the cycle inside it.
  const AR = R_IN - 8;
  const a1 = 90 - 30 - 300;
  parts.push(`<path d="${arcPath(cx, cy, AR, deg(60), deg(a1 + 8))}" ${stroke(MUTED, 1.5)}/>`, head(cx + AR * Math.cos(deg(a1)), cy - AR * Math.sin(deg(a1)), Math.sin(deg(a1)), Math.cos(deg(a1)), 8, MUTED));
  if (m.showTotal !== 'none') {
    parts.push(text(cx, cy - 3, 'one cycle', { fs: TICK_FS, anchor: 'middle' }));
    if (m.showTotal === 'blank') parts.push(blank(cx, cy + 9, 20, 16, TICK_FS));
    else parts.push(text(cx, cy + 12, `${numStr(m.total, 2)} ${m.unit}`, { fs: TICK_FS, anchor: 'middle', weight: 700 }));
  }

  // Interphase arc, just outside the ring; checkpoint triangles on the rim, pointing in.
  const taken: Box[] = [];
  if (arc) {
    const rb = R_OUT + 6;
    const tick = (f: number): string => { const [x0, y0] = at(f, rb - 3.5); const [x1, y1] = at(f, rb + 3.5); return seg(x0, y0, x1, y1, INK, 1.4); };
    parts.push(`<path d="${arcPath(cx, cy, rb, ang(arc[0]), ang(arc[1]))}" ${stroke(INK, 1.4)}/>`, tick(arc[0]), tick(arc[1]));
  }
  m.checkpoints.forEach((c) => {
    const tip = at(c.fraction, R_OUT + 1 + bracket);
    const mid = at(c.fraction, R_OUT + 7 + bracket);
    over.push(head(tip[0], tip[1], -Math.cos(ang(c.fraction)), Math.sin(ang(c.fraction)), 11, INK));
    taken.push({ x0: mid[0] - 7, y0: mid[1] - 7, x1: mid[0] + 7, y1: mid[1] + 7 });
  });

  // Place the blocks: on their own direction, else a little round or further out, on a leader.
  const bounds: Box = { x0: 4, y0: t.top, x1: W - 4, y1: H - 2 };
  const clearOfRing = (b: Box): boolean => Math.hypot(Math.max(b.x0 - cx, 0, cx - b.x1), Math.max(b.y0 - cy, 0, cy - b.y1)) >= R_OUT + bracket + 6;
  const boxOf = (b: Block, f: number, rr: number): { box: Box; anchor: Anchor; yTop: number } => {
    const ux = Math.cos(ang(f));
    const uy = -Math.sin(ang(f));
    const [px, py] = at(f, rr);
    const w = Math.max(...b.lines.map((l) => (l.s === '?' ? 20 : estWidth(l.s, TICK_FS))));
    const h = b.lines.length * LH;
    const anchor: Anchor = ux > 0.3 ? 'start' : ux < -0.3 ? 'end' : 'middle';
    const x0 = anchor === 'start' ? px : anchor === 'end' ? px - w : px - w / 2;
    const yTop = uy > 0.5 ? py : uy < -0.5 ? py - h : py - h / 2;
    return { box: { x0, y0: yTop, x1: x0 + w, y1: yTop + h }, anchor, yTop };
  };
  for (const b of blocks) {
    let chosen: (ReturnType<typeof boxOf> & { moved: boolean }) | null = null;
    search: for (const dr of [0, 8, 16, 26, 36]) {
      for (const df of [0, 0.025, -0.025, 0.05, -0.05, 0.075, -0.075, 0.1, -0.1]) {
        const c = boxOf(b, b.f + df, b.base + dr);
        const inFrame = c.box.x0 >= bounds.x0 && c.box.x1 <= bounds.x1 && c.box.y0 >= bounds.y0 && c.box.y1 <= bounds.y1;
        if (inFrame && clearOfRing(c.box) && !taken.some((k) => overlaps(c.box, k, 3))) {
          chosen = { ...c, moved: dr > 8 || Math.abs(df) > 0.03 };
          break search;
        }
      }
    }
    if (!chosen) {
      chosen = { ...boxOf(b, b.f, b.base), moved: false };
      notes.push({ code: 'labels_overlap', message: `the label ${b.lines.map((l) => `"${l.s}"`).join(' / ')} has no clear place outside the ring — shorten the labels or use scale: 'equal'` });
    }
    taken.push(chosen.box);
    const c = chosen;
    const mx = (c.box.x0 + c.box.x1) / 2;
    b.lines.forEach((l, k) => {
      const yc = c.yTop + LH * k + LH / 2;
      if (l.s === '?') over.push(blank(mx, yc, 19, LH - 1, TICK_FS));
      else over.push(text(c.anchor === 'start' ? c.box.x0 : c.anchor === 'end' ? c.box.x1 : mx, yc + TICK_FS * 0.36, l.s, { fs: TICK_FS, anchor: c.anchor, weight: l.bold ? 700 : 400 }));
    });
    if (c.moved) {
      const [lx, ly] = at(b.f, b.leaderFrom);
      const tx = Math.min(c.box.x1 + 2, Math.max(c.box.x0 - 2, lx));
      const ty = Math.min(c.box.y1 + 1, Math.max(c.box.y0 - 1, ly));
      if (Math.hypot(tx - lx, ty - ly) > 5) parts.push(seg(lx, ly, tx, ty, MUTED, 1));
    }
  }
  if (m.scale === 'equal') {
    over.push(text(cx, H + 8, 'not to scale', { fs: TICK_FS, anchor: 'middle', fill: MUTED, italic: true }));
    H += 16;
  }
  return { body: (defs.length ? `<defs>${defs.join('')}</defs>` : '') + t.svg + parts.join('') + over.join(''), H: H + 2, facts: facts(notes) };
}
