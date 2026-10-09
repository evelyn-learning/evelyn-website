/**
 * circuit_diagram — a DC circuit drawn from a nested series / parallel tree,
 * laid out automatically as a ladder on one rectangular loop.
 *
 * { battery: { emf: number;                       // volts
 *              name?: string;                     // "ε", "V₀"
 *              show?: 'value' | 'name' | 'both' | 'blank' | 'none';   // what is printed beside it
 *              positive?: 'top' | 'bottom' ('top');
 *              current?: string };                // an arrow on the wire leaving the + terminal, with this label ("I", "2 A", "?")
 *   circuit: Node;
 *   nodeDots?: boolean (true);                    // dots where wires join
 *   title?: string }
 *
 * Node = { series: Node[] }                       // 2–8, drawn left to right along the loop
 *      | { parallel: Node[] }                     // 2–4 branches, drawn one under another
 *      | Component
 * Component = {
 *   type: 'resistor' | 'bulb' | 'capacitor' | 'switch' | 'ammeter' | 'voltmeter' | 'wire';
 *   name?: string;                                // "R₁", "A", "S" — unique; how checkers refer to it
 *   value?: number;                               // Ω (resistor, bulb) or `unit` (capacitor)
 *   unit?: string;                                // capacitor only ('μF')
 *   show?: 'value' | 'name' | 'both' | 'blank' | 'none';
 *                                                 // default: both when both are given. 'blank' prints "R₁ = ?" (or a "?" box)
 *   closed?: boolean (true);                      // switch
 *   current?: string }                            // an arrow on its lead, with this label
 *
 * Conventional current leaves the + terminal: clockwise when + is on top.
 * The top-level series runs along the top wire and, when it does not fit,
 * on along the bottom wire (right to left). A voltmeter is a branch in
 * parallel with what it measures; an ammeter is in series.
 *
 * `solveCircuit` is the exact steady-state solution of the tree (rational
 * arithmetic): an ammeter and a closed switch are 0 Ω, a voltmeter, an open
 * switch and a capacitor carry no current.
 */
import { FIGURE_WIDTH, TICK_FS, estWidth, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, text, titleBlock } from './draw';
import { facts, head, lab, numStr, stroke, type Notes } from './draw2';

export const CIRCUIT_TYPES = ['resistor', 'bulb', 'capacitor', 'switch', 'ammeter', 'voltmeter', 'wire'] as const;
export type CircuitType = (typeof CIRCUIT_TYPES)[number];
const SHOW = ['value', 'name', 'both', 'blank', 'none'] as const;

export interface CircuitLeaf {
  kind: 'leaf';
  type: CircuitType;
  name?: string;
  value?: number;
  unit: string;
  closed: boolean;
  /** What is printed beside the symbol ('' = nothing; a lone "?" = a blank box). */
  shown: string;
  current?: string;
  /** "circuit.series[1].parallel[0]" — for messages. */
  at: string;
}
export interface CircuitGroup {
  kind: 'series' | 'parallel';
  children: CircuitNode[];
}
export type CircuitNode = CircuitLeaf | CircuitGroup;

export interface CircuitModel {
  root: CircuitNode;
  leaves: CircuitLeaf[];
  battery: { emf: number; name?: string; shown: string; positiveTop: boolean; current?: string };
  nodeDots: boolean;
  title?: string;
}

function printed(show: (typeof SHOW)[number], name: string | undefined, value: string | undefined): string {
  switch (show) {
    case 'none': return '';
    case 'name': return name ?? '';
    case 'value': return value ?? '';
    case 'blank': return name ? `${name} = ?` : '?';
    default: return name && value ? `${name} = ${value}` : name ?? value ?? '';
  }
}

export function circuitModel(r: Reader): CircuitModel {
  const p = r.p;
  const leaves: CircuitLeaf[] = [];
  const showOf = (v: unknown, at: string, name: string | undefined, value: string | undefined): string => {
    if (v !== undefined && v !== null && !SHOW.includes(v as (typeof SHOW)[number])) r.fail(`${at}.show must be one of ${SHOW.join(', ')}`);
    return printed((v as (typeof SHOW)[number]) ?? 'both', name, value);
  };
  const read = (raw: unknown, at: string, depth: number): CircuitNode => {
    const o = r.obj(raw, at);
    if (depth > 4) r.fail(`${at}: nested more than four deep`);
    for (const g of ['series', 'parallel'] as const) {
      if (o[g] === undefined) continue;
      const list = r.list(o[g], `${at}.${g}`, 2, g === 'series' ? 8 : 4);
      const children = list.map((c, i) => read(c, `${at}.${g}[${i}]`, depth + 1));
      // A series inside a series (or parallel inside parallel) is the same thing written twice.
      return { kind: g, children: children.flatMap((c) => (c.kind === g ? c.children : [c])) };
    }
    if (!CIRCUIT_TYPES.includes(o.type as CircuitType)) r.fail(`${at}.type must be one of ${CIRCUIT_TYPES.join(', ')} (or give series / parallel)`);
    const type = o.type as CircuitType;
    const name = r.optStr(o.name, `${at}.name`, 8);
    const value = r.optNum(o.value, `${at}.value`);
    if (value !== undefined && !(value > 0)) r.fail(`${at}.value must be greater than 0`);
    if (value !== undefined && !['resistor', 'bulb', 'capacitor'].includes(type)) r.fail(`${at}.value: a ${type} has no value`);
    const unit = type === 'capacitor' ? r.optStr(o.unit, `${at}.unit`, 4) ?? 'μF' : 'Ω';
    if (name && leaves.some((l) => l.name === name)) r.fail(`${at}.name: "${name}" is used twice`);
    const leaf: CircuitLeaf = {
      kind: 'leaf', type, name, value, unit,
      closed: r.bool(o.closed, `${at}.closed`, true),
      shown: type === 'wire' ? '' : showOf(o.show, at, name, value === undefined ? undefined : `${numStr(value, 3)} ${unit}`),
      current: r.optStr(o.current, `${at}.current`, 8),
      at,
    };
    leaves.push(leaf);
    return leaf;
  };
  const root = read(p.circuit, 'circuit', 0);
  const b = r.obj(p.battery, 'battery');
  const emf = r.positive(b.emf, 'battery.emf');
  const bName = r.optStr(b.name, 'battery.name', 8);
  if (b.positive !== undefined && b.positive !== 'top' && b.positive !== 'bottom') r.fail("battery.positive must be 'top' or 'bottom'");
  if (leaves.filter((l) => l.type !== 'wire').length === 0) r.fail('circuit: nothing but wire');
  return {
    root, leaves,
    battery: { emf, name: bName, shown: showOf(b.show, 'battery', bName, `${numStr(emf, 3)} V`), positiveTop: b.positive !== 'bottom', current: r.optStr(b.current, 'battery.current', 8) },
    nodeDots: r.bool(p.nodeDots, 'nodeDots', true),
    title: r.optStr(p.title, 'title', 160),
  };
}

// ---------------------------------------------------------------------------
// Exact solution of the tree
// ---------------------------------------------------------------------------

/** A rational number (numerator / denominator, lowest terms, denominator > 0). */
export interface Frac { n: number; d: number }
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
export const frac = (n: number, d = 1): Frac => {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
};
/** A decimal with at most four places, as a fraction. */
export const fracOf = (v: number): Frac => frac(Math.round(v * 10000), 10000);
export const fAdd = (a: Frac, b: Frac): Frac => frac(a.n * b.d + b.n * a.d, a.d * b.d);
export const fMul = (a: Frac, b: Frac): Frac => frac(a.n * b.n, a.d * b.d);
export const fDiv = (a: Frac, b: Frac): Frac => frac(a.n * b.d, a.d * b.n);
export const fNum = (a: Frac): number => a.n / a.d;
const ZERO = frac(0);

/** Resistance of a node: a fraction, or null when no current can pass (open). */
type Res = Frac | null;
export interface LeafState { I: Frac; V: Frac; P: Frac }
export interface CircuitSolution {
  /** Equivalent resistance seen by the battery; null when the circuit is open. */
  resistance: Res;
  /** Current through the battery. */
  current: Frac;
  /** Per leaf (same order as `model.leaves`). A voltage that the tree does not fix is NaN. */
  leaves: LeafState[];
}

/**
 * Steady-state solution. `switches` overrides switch states by name
 * (true = closed). Throws an Error with a plain message for a short circuit
 * or a component that needs a value and has none.
 */
export function solveCircuit(m: CircuitModel, switches: Record<string, boolean> = {}): CircuitSolution {
  const leafR = (l: CircuitLeaf): Res => {
    switch (l.type) {
      case 'wire': case 'ammeter': return ZERO;
      case 'voltmeter': case 'capacitor': return null;
      case 'switch': return (l.name !== undefined && l.name in switches ? switches[l.name] : l.closed) ? ZERO : null;
      default:
        if (l.value === undefined) throw new Error(`${l.at}${l.name ? ` ("${l.name}")` : ''} has no value (resistance), so the circuit cannot be solved`);
        return fracOf(l.value);
    }
  };
  const R = (n: CircuitNode): Res => {
    if (n.kind === 'leaf') return leafR(n);
    const rs = n.children.map(R);
    if (n.kind === 'series') return rs.some((x) => x === null) ? null : (rs as Frac[]).reduce(fAdd, ZERO);
    const closed = rs.filter((x): x is Frac => x !== null);
    if (closed.length === 0) return null;
    if (closed.some((x) => x.n === 0)) return ZERO;
    return fDiv(frac(1), closed.map((x) => fDiv(frac(1), x)).reduce(fAdd, ZERO));
  };
  const state = new Map<CircuitLeaf, LeafState>();
  const NAN: Frac = { n: NaN, d: 1 };
  /** Put voltage V across node n (V may be NaN: not fixed by the tree). */
  const apply = (n: CircuitNode, V: Frac): void => {
    const rn = R(n);
    if (n.kind === 'leaf') {
      const I = rn === null ? ZERO : rn.n === 0 ? NAN : fDiv(V, rn);
      state.set(n, { I, V, P: Number.isNaN(I.n) || Number.isNaN(V.n) ? NAN : fMul(I, V) });
      return;
    }
    if (n.kind === 'parallel') {
      const rs = n.children.map(R);
      const shorts = rs.filter((x) => x !== null && x.n === 0).length;
      if (shorts > 1 && V.n !== 0) throw new Error('two branches of a parallel group have no resistance — the current between them is not fixed');
      n.children.forEach((c) => apply(c, V));
      return;
    }
    const rs = n.children.map(R);
    const open = rs.filter((x) => x === null).length;
    if (open === 0) {
      const total = (rs as Frac[]).reduce(fAdd, ZERO);
      n.children.forEach((c, i) => apply(c, total.n === 0 ? ZERO : fMul(V, fDiv(rs[i] as Frac, total))));
    } else {
      // No current: everything that conducts has no voltage; one open element takes it all.
      n.children.forEach((c, i) => apply(c, rs[i] !== null ? ZERO : open === 1 ? V : NAN));
    }
  };
  const total = R(m.root);
  if (total !== null && total.n === 0) throw new Error('the battery is short-circuited (a path with no resistance joins its terminals)');
  const emf = fracOf(m.battery.emf);
  apply(m.root, emf);
  // Currents through 0 Ω elements (ammeters, switches, wires): what the rest of their series chain carries.
  const current = total === null ? ZERO : fDiv(emf, total);
  const flow = (n: CircuitNode, I: Frac): void => {
    if (n.kind === 'leaf') {
      const s = state.get(n) as LeafState;
      if (Number.isNaN(s.I.n)) state.set(n, { I, V: s.V, P: ZERO });
      return;
    }
    if (n.kind === 'series') { n.children.forEach((c) => flow(c, I)); return; }
    const rs = n.children.map(R);
    const short = rs.findIndex((x) => x !== null && x.n === 0);
    const g = rs.map((x) => (x === null || x.n === 0 ? ZERO : fDiv(frac(1), x)));
    const sum = g.reduce(fAdd, ZERO);
    n.children.forEach((c, i) => flow(c, rs[i] === null || sum.n === 0 && short < 0 ? ZERO : short >= 0 ? (i === short ? I : ZERO) : fMul(I, fDiv(g[i], sum))));
  };
  flow(m.root, current);
  return { resistance: total, current, leaves: m.leaves.map((l) => state.get(l) as LeafState) };
}

// ---------------------------------------------------------------------------
// Layout and drawing
// ---------------------------------------------------------------------------

const ROW = 48;
const BUS = 14;
const MIN_W: Record<CircuitType, number> = { resistor: 52, bulb: 44, capacitor: 40, switch: 50, ammeter: 46, voltmeter: 46, wire: 26 };

interface Size { w: number; h: number }
function sizeOf(n: CircuitNode): Size {
  if (n.kind === 'leaf') return { w: Math.max(MIN_W[n.type], estWidth(n.shown === '?' ? '???' : n.shown, TICK_FS) + 10, n.current ? 58 : 0), h: ROW };
  const cs = n.children.map(sizeOf);
  return n.kind === 'series'
    ? { w: cs.reduce((a, c) => a + c.w, 0), h: Math.max(...cs.map((c) => c.h)) }
    : { w: Math.max(...cs.map((c) => c.w)) + 2 * BUS, h: cs.reduce((a, c) => a + c.h, 0) };
}

function symbol(l: CircuitLeaf, cx: number, y: number): { svg: string; half: number; top: number } {
  const S = `fill="none" stroke="${INK}" stroke-width="1.8"`;
  switch (l.type) {
    case 'resistor': {
      const xs = [-15, -12.5, -7.5, -2.5, 2.5, 7.5, 12.5, 15];
      const ys = [0, -6, 6, -6, 6, -6, 6, 0];
      return { svg: `<path d="${xs.map((dx, i) => `${i ? 'L' : 'M'}${n2(cx + dx)},${n2(y + ys[i])}`).join('')}" ${S} stroke-linejoin="round"/>`, half: 15, top: 7 };
    }
    case 'bulb': {
      const k = 9 * Math.SQRT1_2;
      return { svg: `<circle cx="${n2(cx)}" cy="${n2(y)}" r="9" fill="#ffffff" stroke="${INK}" stroke-width="1.8"/><path d="M${n2(cx - k)},${n2(y - k)}L${n2(cx + k)},${n2(y + k)}M${n2(cx - k)},${n2(y + k)}L${n2(cx + k)},${n2(y - k)}" ${S}/>`, half: 9, top: 10 };
    }
    case 'capacitor':
      return { svg: `<path d="M${n2(cx - 3.5)},${n2(y - 10)}v20M${n2(cx + 3.5)},${n2(y - 10)}v20" fill="none" stroke="${INK}" stroke-width="2.4"/>`, half: 3.5, top: 11 };
    case 'switch': {
      const arm = l.closed ? `M${n2(cx - 11)},${n2(y)}L${n2(cx + 11)},${n2(y)}` : `M${n2(cx - 11)},${n2(y)}L${n2(cx + 9)},${n2(y - 12)}`;
      return { svg: `<path d="${arm}" ${S}/><circle cx="${n2(cx - 11)}" cy="${n2(y)}" r="2.6" fill="#ffffff" stroke="${INK}" stroke-width="1.6"/><circle cx="${n2(cx + 11)}" cy="${n2(y)}" r="2.6" fill="#ffffff" stroke="${INK}" stroke-width="1.6"/>`, half: 13.6, top: l.closed ? 5 : 14 };
    }
    case 'ammeter': case 'voltmeter':
      return { svg: `<circle cx="${n2(cx)}" cy="${n2(y)}" r="10" fill="#ffffff" stroke="${INK}" stroke-width="1.8"/>${text(cx, y + 4.3, l.type === 'ammeter' ? 'A' : 'V', { fs: 12, anchor: 'middle', weight: 700 })}`, half: 10, top: 11 };
    default:
      return { svg: '', half: 0, top: 0 };
  }
}

export function renderCircuit(r: Reader): Drawn {
  const m = circuitModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: Notes = [];
  const count = m.leaves.filter((l) => l.type !== 'wire').length;
  if (count > 8) notes.push({ code: 'too_many_elements', message: `circuit: ${count} components — more than 8 crowd the loop at 340 px` });

  const top = m.root.kind === 'series' ? [...m.root.children] : [m.root];
  const bottom: CircuitNode[] = [];
  const bx = 30;
  const xR = W - 14;
  const labelW = m.battery.shown ? estWidth(m.battery.shown === '?' ? '???' : m.battery.shown, TICK_FS) + 8 : 0;
  const widthOf = (list: CircuitNode[]) => list.reduce((a, n) => a + sizeOf(n).w, 0);
  const heightOf = (list: CircuitNode[]) => Math.max(ROW, ...list.map((n) => sizeOf(n).h));
  // The battery label sits inside the loop; it pushes the ladder right only when a branch row would run through it.
  const x0For = () => bx + 24 + (heightOf(top) > ROW || bottom.length > 0 ? labelW + 4 : 0);
  while (top.length > 1 && widthOf(top) > xR - 10 - x0For()) bottom.unshift(top.pop() as CircuitNode);
  const xL = x0For();
  const avail = xR - 10 - xL;
  if (widthOf(top) > avail || widthOf(bottom) > avail) r.fail(`circuit: too wide to draw at this size (${Math.ceil(Math.max(widthOf(top), widthOf(bottom)))} units needed, ${Math.floor(avail)} available) — fewer components in one row, or shorter labels`);
  const topH = heightOf(top);
  const botH = bottom.length ? heightOf(bottom) : 0;
  const yTop = t.top + (m.battery.current === '?' && m.battery.positiveTop ? 32 : 26);
  const yBot = yTop + Math.max(84, bottom.length ? topH + botH - ROW + 8 : topH);
  if (yBot + 16 > W * 1.55) r.fail('circuit: too many branches one under another to draw at this size');

  const wires: string[] = [];
  const syms: string[] = [];
  const dots: string[] = [];
  const labels: string[] = [];
  const dot = (x: number, y: number) => { if (m.nodeDots) dots.push(`<circle cx="${n2(x)}" cy="${n2(y)}" r="2.8" fill="${INK}"/>`); };
  /** Draw node n on the rail y from x to x + w; branches stack in direction dir (+1 down, −1 up); flow = +1 when current runs left to right. */
  const draw = (n: CircuitNode, x: number, y: number, w: number, dir: 1 | -1, flowDir: 1 | -1): void => {
    if (n.kind === 'leaf') {
      const cx = x + w / 2;
      const s = symbol(n, cx, y);
      wires.push(n.type === 'wire' ? `M${n2(x)},${n2(y)}H${n2(x + w)}` : `M${n2(x)},${n2(y)}H${n2(cx - s.half)}M${n2(cx + s.half)},${n2(y)}H${n2(x + w)}`);
      syms.push(s.svg);
      if (n.shown) labels.push(lab(cx, y - s.top - 5, n.shown, 'middle'));
      if (n.current) {
        const ax = flowDir > 0 ? x + Math.max(9, (w / 2 - s.half) / 2 + 4) : x + w - Math.max(9, (w / 2 - s.half) / 2 + 4);
        syms.push(head(ax, y, flowDir, 0, 8));
        labels.push(lab(flowDir > 0 ? Math.max(ax - 2, x + 2) : Math.min(ax + 2, x + w - 2), y + 15, n.current, flowDir > 0 ? 'start' : 'end'));
      }
      return;
    }
    if (n.kind === 'series') {
      const sizes = n.children.map(sizeOf);
      const extra = (w - sizes.reduce((a, c) => a + c.w, 0)) / sizes.length;
      let cx = x;
      const order = flowDir > 0 ? n.children.map((_, i) => i) : n.children.map((_, i) => n.children.length - 1 - i);
      for (const i of order) {
        draw(n.children[i], cx, y, sizes[i].w + extra, dir, flowDir);
        cx += sizes[i].w + extra;
      }
      return;
    }
    const xa = x + BUS;
    const xb = x + w - BUS;
    wires.push(`M${n2(x)},${n2(y)}H${n2(xa)}M${n2(xb)},${n2(y)}H${n2(x + w)}`);
    let cy = y;
    n.children.forEach((c, i) => {
      draw(c, xa, cy, xb - xa, dir, flowDir);
      if (i < n.children.length - 1) {
        dot(xa, cy);
        dot(xb, cy);
        const next = cy + dir * sizeOf(c).h;
        wires.push(`M${n2(xa)},${n2(cy)}V${n2(next)}M${n2(xb)},${n2(cy)}V${n2(next)}`);
        cy = next;
      }
    });
  };
  const rail = (list: CircuitNode[], y: number, dir: 1 | -1, flowDir: 1 | -1) => {
    if (list.length === 0) { wires.push(`M${n2(xL)},${n2(y)}H${n2(xR - 10)}`); return; }
    const sizes = list.map(sizeOf);
    const extra = (avail - sizes.reduce((a, c) => a + c.w, 0)) / list.length;
    let cx = xL;
    const order = flowDir > 0 ? list.map((_, i) => i) : list.map((_, i) => list.length - 1 - i);
    for (const i of order) {
      draw(list[i], cx, y, sizes[i].w + extra, dir, flowDir);
      cx += sizes[i].w + extra;
    }
  };
  const flowTop: 1 | -1 = m.battery.positiveTop ? 1 : -1;
  rail(top, yTop, 1, flowTop);
  rail(bottom, yBot, -1, flowTop > 0 ? -1 : 1);
  // The loop: battery side, the two corners on the right.
  const yc = (yTop + yBot) / 2;
  wires.push(`M${n2(xL)},${n2(yTop)}H${n2(bx)}V${n2(yc - 9)}M${n2(bx)},${n2(yc + 9)}V${n2(yBot)}H${n2(xL)}`);
  wires.push(`M${n2(xR - 10)},${n2(yTop)}H${n2(xR)}V${n2(yBot)}H${n2(xR - 10)}`);
  // Battery: two cells; the long thin plate is the positive one.
  const plate = (y: number, long: boolean) => `<path d="M${n2(bx - (long ? 11 : 6))},${n2(y)}h${long ? 22 : 12}" ${stroke(INK, long ? 1.6 : 3.6)}/>`;
  const ys = [yc - 9, yc - 3, yc + 3, yc + 9];
  ys.forEach((y, i) => syms.push(plate(y, m.battery.positiveTop ? i % 2 === 0 : i % 2 === 1)));
  labels.push(text(bx - 13, (m.battery.positiveTop ? ys[0] : ys[3]) + (m.battery.positiveTop ? -5 : 13), '+', { fs: 13, anchor: 'middle', weight: 700 }));
  labels.push(text(bx - 13, (m.battery.positiveTop ? ys[3] : ys[0]) + (m.battery.positiveTop ? 13 : -5), '−', { fs: 13, anchor: 'middle', weight: 700 }));
  if (m.battery.shown) labels.push(lab(bx + 15, yc + TICK_FS * 0.36, m.battery.shown, 'start'));
  if (m.battery.current) {
    const y = m.battery.positiveTop ? yTop : yBot;
    syms.push(head(bx + 16, y, 1, 0, 8));
    labels.push(lab(bx + 4, y + (m.battery.positiveTop ? (m.battery.current === '?' ? -10 : -7) : 16), m.battery.current, 'start'));
  }
  for (const l of m.leaves) {
    if (l.shown === '?' && !l.name) notes.push({ code: 'ambiguous_blank', message: `${l.at}: a blank with no name — the question cannot say which component it asks about` });
  }
  const body = t.svg + `<path d="${wires.join('')}" ${stroke(INK, 1.6)} stroke-linejoin="round"/>` + syms.join('') + dots.join('') + labels.join('');
  return { body, H: yBot + 18, facts: facts(notes) };
}
