/**
 * transformer — batch 5 (2026-10-16): two coils wound on opposite limbs of a
 * rectangular core, the primary joined to a source and the secondary to a
 * load, with the turns, the voltage and the current of each coil printed,
 * left blank ("?") or left out.
 *
 *   { primary:   { turns?: number; voltage?: number; current?: number; label?: string ('Primary') };
 *     secondary: { turns?: number; voltage?: number; current?: number; label?: string ('Secondary') };
 *     show?: { Np | Ns | Vp | Vs | Ip | Is: 'value' | 'blank' | 'none' };   // default: 'value' when the
 *                                         //   value is given, else 'none'. 'blank' draws "N₂ = ?" — also for a
 *                                         //   value that is not given at all (the thing asked for).
 *     symbols?: { Np | Ns | Vp | Vs | Ip | Is: string };   // default N₁ N₂ V₁ V₂ I₁ I₂ ('' = a bare value)
 *     windings?: 'schematic' | 'equal' | 'counted' ('schematic');
 *         // schematic: the coil with more turns is drawn with 8 loops, the other with 4 (6 and 6 when they
 *         //   are equal) — which coil has more, never how many; equal: 6 and 6 whatever the turns are (the
 *         //   picture says nothing); counted: every turn is drawn (≤ 10 per coil) — the loops ARE the turns.
 *     source?: 'ac' | 'dc' | 'none' ('ac');        // none: two open terminals. dc: a battery — a steady
 *                                                  //   current induces nothing, so the secondary voltage and
 *                                                  //   current must be 0 or left out.
 *     load?: 'resistor' | 'lamp' | 'none' ('resistor'); loadLabel?: string;   // "R = 8 Ω", under the secondary
 *     coreLabel?: string;                          // "iron core", over the core
 *     efficiency?: number (1; 0 < e ≤ 1);          // never printed — only loosens the consistency check
 *     voltageUnit?: string ('V'); currentUnit?: string ('A'); title?: string }
 *
 * The numbers given must describe ONE transformer or the spec is refused: Vs/Vp = Ns/Np, and
 * Vs·Is = efficiency × Vp·Ip (so Is/Ip = Np/Ns when it is ideal) — each to 0.5 %.
 * Nothing is printed that was not asked for: no "step-up" / "step-down", no ratio, no power.
 * Legibility note: a value too long for its column beside the core.
 */
import { FIGURE_WIDTH, LABEL_FS, TICK_FS, estWidth, n2 } from '../plot-frame';
import type { Drawn, Params, Reader } from '../spec';
import { INK, MUTED, blank, text, titleBlock, type Anchor } from './draw';
import { SHOWS, facts, lab, numStr, polyPath, stroke, type Notes, type Pt, type Show } from './draw2';

/** One printable quantity of an electromagnetism figure (transformer, induction loop). */
export interface EmQuantity {
  key: string;
  /** The value the spec holds; undefined when it is not given. */
  value?: number;
  show: Show;
  /** The letter printed before "=" — '' for a bare value. */
  symbol: string;
  unit: string;
  /** Exactly what is printed: "N₁ = 500 turns", "V₂ = ?", "?" — '' when nothing is. */
  printed: string;
}

/**
 * The quantities of a figure from its `show` and `symbols` params. A quantity that is given is
 * printed unless `show` says otherwise; one that is not given can still be a blank.
 * `param` is the name the value has in the spec (for the refusal); `of` ends "is not a quantity …".
 */
export function emQuantities(r: Reader, of: string, defs: Array<{ key: string; symbol: string; unit: string; value?: number; param: string }>): Record<string, EmQuantity> {
  const show = r.p.show === undefined || r.p.show === null ? {} : r.obj(r.p.show, 'show');
  const symbols = r.p.symbols === undefined || r.p.symbols === null ? {} : r.obj(r.p.symbols, 'symbols');
  const keys = defs.map((d) => d.key);
  for (const k of Object.keys(show)) if (!keys.includes(k)) r.fail(`show.${k} is not a quantity ${of} — one of ${keys.join(', ')}`);
  for (const k of Object.keys(symbols)) if (!keys.includes(k)) r.fail(`symbols.${k} is not a quantity ${of} — one of ${keys.join(', ')}`);
  const out: Record<string, EmQuantity> = {};
  for (const d of defs) {
    let s: Show = d.value === undefined ? 'none' : 'value';
    if (show[d.key] !== undefined && show[d.key] !== null) {
      if (!SHOWS.includes(show[d.key] as Show)) r.fail(`show.${d.key} must be one of ${SHOWS.join(', ')}`);
      s = show[d.key] as Show;
    }
    if (s === 'value' && d.value === undefined) r.fail(`show.${d.key} is "value" but ${d.param} is not given`);
    const symbol = symbols[d.key] === undefined || symbols[d.key] === null ? d.symbol : symbols[d.key] === '' ? '' : r.str(symbols[d.key], `symbols.${d.key}`, 8);
    const val = d.value === undefined ? '' : `${numStr(d.value, 4)}${d.unit ? ` ${d.unit}` : ''}`;
    out[d.key] = { key: d.key, value: d.value, show: s, symbol, unit: d.unit, printed: s === 'none' ? '' : `${symbol ? `${symbol} = ` : ''}${s === 'blank' ? '?' : val}` };
  }
  return out;
}

/** The width a quantity's label takes when drawn by `emLabel`. */
export function emWidth(q: EmQuantity, fs: number = TICK_FS): number {
  if (q.show === 'none') return 0;
  if (q.show === 'value') return estWidth(q.printed, fs);
  return q.symbol ? estWidth(`${q.symbol} =`, fs) + 25 : 20;
}

/** A quantity's label with its baseline at (x, y): the text, or "sym =" and a dashed "?" box. */
export function emLabel(q: EmQuantity, x: number, y: number, anchor: Anchor, o: { fs?: number; halo?: boolean } = {}): string {
  const fs = o.fs ?? TICK_FS;
  if (q.show === 'none') return '';
  if (q.show === 'value') return text(x, y, q.printed, { fs, anchor, halo: o.halo });
  if (!q.symbol) return lab(x, y, '?', anchor, { fs });
  const lead = `${q.symbol} =`;
  const w1 = estWidth(lead, fs) + 5;
  const total = w1 + 20;
  const left = anchor === 'middle' ? x - total / 2 : anchor === 'end' ? x - total : x;
  return text(left, y, lead, { fs, anchor: 'start', halo: o.halo }) + blank(left + w1 + 10, y - fs * 0.36, 19, fs + 5, fs);
}

export const TRANSFORMER_KEYS = ['Np', 'Ns', 'Vp', 'Vs', 'Ip', 'Is'] as const;
export type TransformerKey = (typeof TRANSFORMER_KEYS)[number];
export type TransformerKind = 'step-up' | 'step-down' | 'one-to-one';

export interface TransformerModel {
  q: Record<TransformerKey, EmQuantity>;
  /** From the turns when both are given, else from the voltages; undefined when neither pair is. */
  kind?: TransformerKind;
  windings: 'schematic' | 'equal' | 'counted';
  /** Loops DRAWN on the primary and on the secondary limb. */
  loops: [number, number];
  source: 'ac' | 'dc' | 'none';
  load: 'resistor' | 'lamp' | 'none';
  loadLabel?: string;
  coreLabel?: string;
  labels: [string, string];
  efficiency: number;
  title?: string;
}

const CORE_FILL = '#e5e7eb';
const MAX_COUNTED = 10;
const close = (a: number, b: number): boolean => Math.abs(a - b) <= 0.005 * Math.max(Math.abs(a), Math.abs(b), 1e-12);

export function transformerModel(r: Reader): TransformerModel {
  const p = r.p;
  const oneOf = <T extends string>(k: string, allowed: readonly T[], d: T): T => {
    const v = p[k] === undefined || p[k] === null ? d : p[k];
    if (!allowed.includes(v as T)) r.fail(`${k} must be one of ${allowed.join(', ')}`);
    return v as T;
  };
  const side = (name: 'primary' | 'secondary', dflt: string) => {
    const o: Params = r.obj(p[name], name);
    const opt = (k: string, zeroOk = false): number | undefined => {
      if (o[k] === undefined || o[k] === null) return undefined;
      const v = r.num(o[k], `${name}.${k}`);
      if (!(v > 0) && !(zeroOk && v === 0)) r.fail(`${name}.${k} must be greater than 0`);
      return v;
    };
    const turns = opt('turns');
    if (turns !== undefined && !Number.isInteger(turns)) r.fail(`${name}.turns must be a whole number`);
    return { turns, voltage: opt('voltage', name === 'secondary'), current: opt('current', name === 'secondary'), label: r.optStr(o.label, `${name}.label`, 16) ?? dflt };
  };
  const pr = side('primary', 'Primary');
  const se = side('secondary', 'Secondary');
  const source = oneOf('source', ['ac', 'dc', 'none'] as const, 'ac');
  const load = oneOf('load', ['resistor', 'lamp', 'none'] as const, 'resistor');
  const windings = oneOf('windings', ['schematic', 'equal', 'counted'] as const, 'schematic');
  const efficiency = p.efficiency === undefined || p.efficiency === null ? 1 : r.num(p.efficiency, 'efficiency');
  if (!(efficiency > 0 && efficiency <= 1)) r.fail('efficiency must be greater than 0 and at most 1');

  if (source === 'dc') {
    for (const k of ['voltage', 'current'] as const) if (se[k] !== undefined && se[k] !== 0) r.fail(`source: "dc" — a steady current induces nothing: secondary.${k} must be 0 or left out`);
  } else {
    for (const k of ['voltage', 'current'] as const) if (se[k] === 0) r.fail(`secondary.${k} must be greater than 0`);
    const bothN = pr.turns !== undefined && se.turns !== undefined;
    const bothV = pr.voltage !== undefined && se.voltage !== undefined;
    const bothI = pr.current !== undefined && se.current !== undefined;
    if (bothN && bothV) {
      const want = ((pr.voltage as number) * (se.turns as number)) / (pr.turns as number);
      if (!close(se.voltage as number, want)) r.fail(`secondary.voltage (${numStr(se.voltage as number, 4)}) does not fit the turns: an ideal transformer gives ${numStr(want, 4)}`);
    }
    if (bothV && bothI) {
      const pin = (pr.voltage as number) * (pr.current as number);
      const want = (efficiency * pin) / (se.voltage as number);
      if (!close(se.current as number, want)) r.fail(`secondary.current (${numStr(se.current as number, 4)}) does not fit the power: ${numStr(pr.voltage as number, 4)} × ${numStr(pr.current as number, 4)} = ${numStr(pin, 4)} on the primary side gives ${numStr(want, 4)}${efficiency < 1 ? ` at an efficiency of ${numStr(efficiency, 4)}` : ''}`);
    } else if (bothN && bothI && efficiency === 1) {
      const want = ((pr.current as number) * (pr.turns as number)) / (se.turns as number);
      if (!close(se.current as number, want)) r.fail(`secondary.current (${numStr(se.current as number, 4)}) does not fit the turns: an ideal transformer gives ${numStr(want, 4)}`);
    }
  }
  const ratio = pr.turns !== undefined && se.turns !== undefined ? se.turns / pr.turns
    : pr.voltage !== undefined && se.voltage !== undefined && se.voltage > 0 ? se.voltage / pr.voltage : undefined;
  const kind: TransformerKind | undefined = ratio === undefined ? undefined : close(ratio, 1) ? 'one-to-one' : ratio > 1 ? 'step-up' : 'step-down';
  let loops: [number, number];
  if (windings === 'equal') loops = [6, 6];
  else if (windings === 'counted') {
    for (const [name, s] of [['primary', pr], ['secondary', se]] as const) {
      if (s.turns === undefined) r.fail(`windings: "counted" draws every turn — give ${name}.turns`);
      if ((s.turns as number) > MAX_COUNTED) r.fail(`windings: "counted" draws every turn — at most ${MAX_COUNTED} per coil (${name}.turns is ${s.turns})`);
    }
    loops = [pr.turns as number, se.turns as number];
  } else {
    if (kind === undefined) r.fail('windings: "schematic" needs both turn counts or both voltages to know which coil has more turns — give them, or set windings: "equal"');
    loops = kind === 'one-to-one' ? [6, 6] : kind === 'step-up' ? [4, 8] : [8, 4];
  }
  const vUnit = r.optStr(p.voltageUnit, 'voltageUnit', 6) ?? 'V';
  const iUnit = r.optStr(p.currentUnit, 'currentUnit', 6) ?? 'A';
  const q = emQuantities(r, 'of a transformer', [
    { key: 'Np', symbol: 'N₁', unit: 'turns', value: pr.turns, param: 'primary.turns' },
    { key: 'Ns', symbol: 'N₂', unit: 'turns', value: se.turns, param: 'secondary.turns' },
    { key: 'Vp', symbol: 'V₁', unit: vUnit, value: pr.voltage, param: 'primary.voltage' },
    { key: 'Vs', symbol: 'V₂', unit: vUnit, value: se.voltage, param: 'secondary.voltage' },
    { key: 'Ip', symbol: 'I₁', unit: iUnit, value: pr.current, param: 'primary.current' },
    { key: 'Is', symbol: 'I₂', unit: iUnit, value: se.current, param: 'secondary.current' },
  ]) as Record<TransformerKey, EmQuantity>;
  return {
    q, kind, windings, loops, source, load, efficiency, labels: [pr.label, se.label],
    loadLabel: r.optStr(p.loadLabel, 'loadLabel', 14), coreLabel: r.optStr(p.coreLabel, 'coreLabel', 14), title: r.optStr(p.title, 'title', 160),
  };
}

const disc = (cx: number, cy: number, rad: number, fill: string, w = 1.6): string => `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(rad)}" fill="${fill}" stroke="${INK}" stroke-width="${n2(w)}"/>`;
const wire = (pts: Pt[]): string => `<path d="${polyPath(pts)}" ${stroke(INK, 1.5)} stroke-linejoin="round"/>`;

export function renderTransformer(r: Reader, _uid?: string): Drawn {
  const m = transformerModel(r);
  const notes: Notes = [];
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const top = t.top;
  const headY = top + 14;
  // The core: a rectangular ring, its two upright limbs carrying the coils.
  const X0 = 134;
  const X1 = 226;
  const LIMB = 24;
  const Y0 = top + 30;
  const Y1 = top + 170;
  const cy = (Y0 + Y1) / 2;
  const rowTop = cy - 44;
  const rowBot = cy + 44;
  const srcX = 24;
  const loadX = W - 24;
  const parts: string[] = [t.svg];
  parts.push(`<path d="M${X0},${n2(Y0)}H${X1}V${n2(Y1)}H${X0}zM${X0 + LIMB},${n2(Y0 + LIMB)}V${n2(Y1 - LIMB)}H${X1 - LIMB}V${n2(Y0 + LIMB)}z" fill="${CORE_FILL}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`);

  // A coil: slanted strokes across the front of its limb, a lead from each end out to the circuit beside it.
  const coil = (xl: number, loops: number, out: -1 | 1): { top: Pt; bot: Pt } => {
    const pitch = Math.min(10, 86 / loops);
    const ys = Array.from({ length: loops }, (_, i) => cy - ((loops - 1) * pitch) / 2 + i * pitch);
    const slant = Math.min(2.6, pitch * 0.26);
    // Every stroke leans the same way on both limbs: from its lower-left end to its upper-right end.
    for (const y of ys) parts.push(`<path d="M${n2(xl - 5)},${n2(y + slant)}L${n2(xl + LIMB + 5)},${n2(y - slant)}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`);
    const ex = out < 0 ? xl - 5 : xl + LIMB + 5;
    const dy = out < 0 ? slant : -slant;
    return { top: [ex, ys[0] + dy], bot: [ex, ys[loops - 1] + dy] };
  };
  const pc = coil(X0, m.loops[0], -1);
  const sc = coil(X1 - LIMB, m.loops[1], 1);
  const elbowL = X0 - 18;
  const elbowR = X1 + 18;
  parts.push(wire([pc.top, [elbowL, pc.top[1]], [elbowL, rowTop], [srcX, rowTop]]), wire([pc.bot, [elbowL, pc.bot[1]], [elbowL, rowBot], [srcX, rowBot]]));
  parts.push(wire([sc.top, [elbowR, sc.top[1]], [elbowR, rowTop], [loadX, rowTop]]), wire([sc.bot, [elbowR, sc.bot[1]], [elbowR, rowBot], [loadX, rowBot]]));

  // The source on the primary side.
  if (m.source === 'none') parts.push(disc(srcX, rowTop, 3.2, '#ffffff'), disc(srcX, rowBot, 3.2, '#ffffff'));
  else if (m.source === 'ac') {
    parts.push(wire([[srcX, rowTop], [srcX, rowBot]]), disc(srcX, cy, 12, '#ffffff'));
    parts.push(`<path d="M${n2(srcX - 7)},${n2(cy)}C${n2(srcX - 4)},${n2(cy - 8)} ${n2(srcX - 2)},${n2(cy - 8)} ${n2(srcX)},${n2(cy)}C${n2(srcX + 2)},${n2(cy + 8)} ${n2(srcX + 4)},${n2(cy + 8)} ${n2(srcX + 7)},${n2(cy)}" ${stroke(INK, 1.5)}/>`);
  } else {
    // A battery: a long thin plate (+) over a short thick one (−).
    parts.push(wire([[srcX, rowTop], [srcX, cy - 4]]), wire([[srcX, cy + 4], [srcX, rowBot]]));
    parts.push(`<path d="M${n2(srcX - 11)},${n2(cy - 4)}h22" ${stroke(INK, 1.6)}/>`, `<path d="M${n2(srcX - 6)},${n2(cy + 4)}h12" ${stroke(INK, 3.4)}/>`);
  }
  // The load on the secondary side.
  if (m.load === 'none') parts.push(disc(loadX, rowTop, 3.2, '#ffffff'), disc(loadX, rowBot, 3.2, '#ffffff'));
  else if (m.load === 'lamp') {
    const k = 12 * Math.SQRT1_2;
    parts.push(wire([[loadX, rowTop], [loadX, rowBot]]), disc(loadX, cy, 12, '#ffffff'));
    parts.push(`<path d="M${n2(loadX - k)},${n2(cy - k)}L${n2(loadX + k)},${n2(cy + k)}M${n2(loadX - k)},${n2(cy + k)}L${n2(loadX + k)},${n2(cy - k)}" ${stroke(INK, 1.4)}/>`);
  } else {
    const zig: Pt[] = [[loadX, rowTop], [loadX, cy - 21]];
    for (let i = 0; i < 6; i++) zig.push([loadX + (i % 2 === 0 ? 6 : -6), cy - 17.5 + i * 7]);
    zig.push([loadX, cy + 21], [loadX, rowBot]);
    parts.push(wire(zig));
  }

  // Labels: a column on each side of the core — name, current over the upper lead, voltage between
  // the leads beside the source / load, turns under the lower lead.
  const colL = (srcX + elbowL) / 2 + 6;
  const colR = (loadX + elbowR) / 2 - 6;
  parts.push(text(colL, headY, m.labels[0], { fs: LABEL_FS, anchor: 'middle', weight: 600 }), text(colR, headY, m.labels[1], { fs: LABEL_FS, anchor: 'middle', weight: 600 }));
  if (m.coreLabel) parts.push(text((X0 + X1) / 2, headY, m.coreLabel, { anchor: 'middle', fill: MUTED }));
  parts.push(emLabel(m.q.Ip, colL, rowTop - 7, 'middle'), emLabel(m.q.Is, colR, rowTop - 7, 'middle'));
  parts.push(emLabel(m.q.Vp, srcX + 18, cy + 4, 'start'), emLabel(m.q.Vs, loadX - 18, cy + 4, 'end'));
  parts.push(emLabel(m.q.Np, colL, rowBot + 17, 'middle'), emLabel(m.q.Ns, colR, rowBot + 17, 'middle'));
  if (m.loadLabel) parts.push(text(colR, rowBot + 33, m.loadLabel, { anchor: 'middle' }));
  const room: Array<[TransformerKey, number]> = [['Vp', elbowL - 4 - (srcX + 18)], ['Vs', elbowL - 4 - (srcX + 18)], ['Ip', elbowL - srcX + 6], ['Is', elbowL - srcX + 6], ['Np', 2 * (X0 - 6 - colL)], ['Ns', 2 * (X0 - 6 - colL)]];
  for (const [k, w] of room) {
    if (emWidth(m.q[k]) > w) notes.push({ code: 'crowded', message: `the label of ${k} ("${m.q[k].printed}") is wider than the ${Math.round(w)} units beside the core — use a shorter unit or symbol, or fewer digits` });
  }
  return { body: parts.join(''), H: Math.round(Y1 + (m.loadLabel ? 26 : 14)), facts: facts(notes) };
}
