/**
 * replication_fork — batch 5 (2026-10-16): a DNA replication fork. The
 * parental duplex is on one side, its two strands part at the fork and each
 * arm carries its new strand on the inside: the LEADING strand as one
 * continuous arrow growing toward the fork, the LAGGING strand as Okazaki
 * fragments, each an arrow growing away from it.
 *
 *   { leading?: 'top' | 'bottom' ('top');        // which arm carries the leading strand
 *     forkDirection?: 'right' | 'left' ('right'); // the side the parental duplex is on (the fork moves that way)
 *     fragments?: number (3);                     // 1–4 Okazaki fragments (the newest is nearest the fork)
 *     arrows?: boolean (true);                    // arrowheads on the new strands (false ⇒ plain lines: the direction is asked)
 *     templateEnds?: 'value' | 'blank' | 'none' ('value');   // 5′ / 3′ at the four ends of the parental strands
 *     newEnds?: 'value' | 'blank' | 'none' ('none');         // 5′ / 3′ at the ends of the new strands
 *     ends?: { [end]: 'value' | 'blank' | 'none' };          // one end at a time, over the two defaults:
 *            // template_leading_open | template_leading_parental | template_lagging_open | template_lagging_parental
 *            // | leading_start | leading_tip | lagging_start (the newest fragment) | lagging_tip (the oldest fragment)
 *     strandLabels?: { leading?: string; lagging?: string };  // a name beside each new strand ("leading strand", "X", "?")
 *     fragmentLabel?: string;                     // a name on a leader to one fragment ("Okazaki fragment", "Z", "?")
 *     enzymes?: Array<{ type: 'helicase' | 'primase' | 'polymerase' | 'ligase';
 *                       label?: string | null }>; // a marker where the enzyme acts; the label defaults to its name —
 *                                                 //   give "1", "2", … or "?" to ask for it, null for a bare marker
 *     primers?: boolean (false);                  // the RNA primer at the 5′ start of every new piece, as a thick block
 *     primerKey?: boolean (true);                 // "= RNA primer" under the figure
 *     title?: string }
 *
 * The markers are told apart by SHAPE: helicase a wedge in the mouth of the
 * fork, DNA polymerase a disc at the growing end of the leading strand,
 * primase a square on the lagging-strand template where the newest fragment
 * starts, ligase a diamond over the gap between the two oldest fragments.
 * Nothing is named unless asked: no strand names, no fragment name.
 */
import { FIGURE_WIDTH, SERIES_COLORS, TICK_FS, estWidth, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, arrow, text, titleBlock, type Anchor } from './draw';
import { SHOWS, facts, lab, seg, type Notes, type Show } from './draw2';

export const FORK_ENDS = ['template_leading_open', 'template_leading_parental', 'template_lagging_open', 'template_lagging_parental', 'leading_start', 'leading_tip', 'lagging_start', 'lagging_tip'] as const;
export type ForkEnd = (typeof FORK_ENDS)[number];
export const FORK_ENZYMES = ['helicase', 'primase', 'polymerase', 'ligase'] as const;
export type ForkEnzyme = (typeof FORK_ENZYMES)[number];
export const ENZYME_NAME: Record<ForkEnzyme, string> = { helicase: 'helicase', primase: 'primase', polymerase: 'DNA polymerase', ligase: 'DNA ligase' };
/** What each end IS: a new strand grows 5′ → 3′, its template runs the other way. */
export const END_TRUTH: Record<ForkEnd, '5′' | '3′'> = {
  template_leading_open: '3′', template_leading_parental: '5′', template_lagging_open: '5′', template_lagging_parental: '3′',
  leading_start: '5′', leading_tip: '3′', lagging_start: '5′', lagging_tip: '3′',
};

export interface ForkModel {
  leading: 'top' | 'bottom';
  direction: 'right' | 'left';
  fragments: number;
  arrows: boolean;
  ends: Record<ForkEnd, Show>;
  strandLabels: { leading?: string; lagging?: string };
  fragmentLabel?: string;
  /** In the order given. `label: null` is a bare marker. */
  enzymes: Array<{ type: ForkEnzyme; label: string | null }>;
  primers: boolean;
  primerKey: boolean;
  title?: string;
}

export function forkModel(r: Reader): ForkModel {
  const p = r.p;
  const pick = <T extends string>(v: unknown, name: string, allowed: readonly T[], dflt: T): T => {
    if (v === undefined || v === null) return dflt;
    if (typeof v !== 'string' || !allowed.includes(v as T)) r.fail(`${name} must be one of ${allowed.join(', ')}`);
    return v as T;
  };
  const leading = pick(p.leading, 'leading', ['top', 'bottom'] as const, 'top');
  const direction = pick(p.forkDirection, 'forkDirection', ['right', 'left'] as const, 'right');
  const fragments = p.fragments === undefined || p.fragments === null ? 3 : r.num(p.fragments, 'fragments');
  if (!Number.isInteger(fragments) || fragments < 1 || fragments > 4) r.fail('fragments must be a whole number from 1 to 4');
  const templateEnds = pick(p.templateEnds, 'templateEnds', SHOWS, 'value');
  const newEnds = pick(p.newEnds, 'newEnds', SHOWS, 'none');
  const over = p.ends === undefined || p.ends === null ? {} : r.obj(p.ends, 'ends');
  for (const k of Object.keys(over)) if (!(FORK_ENDS as readonly string[]).includes(k)) r.fail(`ends.${k} is not an end of the figure — one of ${FORK_ENDS.join(', ')}`);
  const ends = Object.fromEntries(FORK_ENDS.map((e) => [e, pick(over[e], `ends.${e}`, SHOWS, e.startsWith('template_') ? templateEnds : newEnds)])) as Record<ForkEnd, Show>;
  const sl = p.strandLabels === undefined || p.strandLabels === null ? {} : r.obj(p.strandLabels, 'strandLabels');
  for (const k of Object.keys(sl)) if (k !== 'leading' && k !== 'lagging') r.fail(`strandLabels.${k}: only "leading" and "lagging" can be named`);
  const strandLabels = { leading: r.optStr(sl.leading, 'strandLabels.leading', 16), lagging: r.optStr(sl.lagging, 'strandLabels.lagging', 16) };
  if (strandLabels.leading && strandLabels.leading !== '?' && strandLabels.leading === strandLabels.lagging) r.fail('strandLabels: the two strands carry the same name');
  const seen = new Set<string>();
  const enzymes = (p.enzymes === undefined || p.enzymes === null ? [] : r.list(p.enzymes, 'enzymes', 0, 4)).map((v, i) => {
    const o = r.obj(v, `enzymes[${i}]`);
    const type = pick(o.type, `enzymes[${i}].type`, FORK_ENZYMES, 'helicase');
    if (o.type === undefined || o.type === null) r.fail(`enzymes[${i}].type must be one of ${FORK_ENZYMES.join(', ')}`);
    if (seen.has(type)) r.fail(`enzymes[${i}]: ${type} is marked twice`);
    seen.add(type);
    if (type === 'ligase' && fragments < 2) r.fail(`enzymes[${i}]: ligase joins two fragments — give fragments ≥ 2`);
    return { type, label: o.label === null ? null : r.optStr(o.label, `enzymes[${i}].label`, 16) ?? ENZYME_NAME[type] };
  });
  const names = enzymes.map((e) => e.label).filter((l): l is string => l !== null && l !== '?');
  if (new Set(names).size !== names.length) r.fail('enzymes: two markers carry the same label');
  return {
    leading, direction, fragments, arrows: r.bool(p.arrows, 'arrows', true), ends, strandLabels,
    fragmentLabel: r.optStr(p.fragmentLabel, 'fragmentLabel', 18), enzymes,
    primers: r.bool(p.primers, 'primers', false), primerKey: r.bool(p.primerKey, 'primerKey', true), title: r.optStr(p.title, 'title', 160),
  };
}

/** Does the figure fix which way the strands run: an end printed as a value, or the arrowheads. */
export const forkPolaritySettled = (m: ForkModel): boolean => m.arrows || FORK_ENDS.some((e) => m.ends[e] === 'value');

// Logical layout (fork to the right, before mirroring): the fork point, the open end of the arms, the end of the duplex.
const XF = 236;
const XL = 34;
const XR = 322;
const HALF = 7;        // half the gap of the parental duplex
const SPREAD = 66;     // an arm's distance from the axis at its open end
const INSET = 9;       // a new strand runs this far inside its template
const N0 = 56;         // where the new strands begin at the open end
const TIP = XF - 64;   // the growing end of the leading strand
const LAG0 = XF - 70;  // where the newest fragment starts
const GAP = 8;
const NEW = SERIES_COLORS[0];
const ENZ_FILL = '#e5e7eb';
/** A template's distance from the axis at logical x (an arm left of the fork, the duplex right of it). */
const dT = (x: number): number => (x >= XF ? HALF : HALF + ((SPREAD - HALF) * (XF - x)) / (XF - XL));
const dN = (x: number): number => dT(x) - INSET;

/** The Okazaki fragments, newest first: [start (5′, nearer the fork), tip (3′)] in logical x. */
export function forkFragments(n: number): Array<[number, number]> {
  const len = (LAG0 - N0 - GAP * (n - 1)) / n;
  return Array.from({ length: n }, (_, i): [number, number] => [LAG0 - i * (len + GAP), LAG0 - i * (len + GAP) - len]);
}

export function renderReplicationFork(r: Reader, _uid?: string): Drawn {
  const m = forkModel(r);
  const W = FIGURE_WIDTH;
  const notes: Notes = [];
  const t = titleBlock(m.title, W);
  const frags = forkFragments(m.fragments);
  const has = (type: ForkEnzyme) => m.enzymes.find((e) => e.type === type);
  // Which label rows are in use decides how much room each side takes.
  const lagRow2 = !!m.fragmentLabel || !!has('ligase')?.label;
  const extLead = SPREAD + 10;
  const extLag = lagRow2 ? SPREAD + 24 : SPREAD + 10;
  const sL = m.leading === 'top' ? -1 : 1;
  const yMid = t.top + 4 + (sL < 0 ? extLead : extLag);
  const X = (x: number): number => (m.direction === 'right' ? x : W - x);
  const flip = (a: Anchor): Anchor => (m.direction === 'right' || a === 'middle' ? a : a === 'start' ? 'end' : 'start');
  /** Canvas y at distance d from the axis, on the leading (`lead`) or the lagging side. */
  const Y = (d: number, lead: boolean): number => yMid + (lead ? sL : -sL) * d;
  const parts: string[] = [];
  const over: string[] = [];
  const labels: string[] = [];

  // Templates: arm, fork, duplex — one path each; rungs across the duplex.
  for (const lead of [true, false]) parts.push(`<path d="M${n2(X(XL))},${n2(Y(SPREAD, lead))}L${n2(X(XF))},${n2(Y(HALF, lead))}L${n2(X(XR))},${n2(Y(HALF, lead))}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`);
  const rungs: string[] = [];
  for (let x = XF + 9; x <= XR - 5; x += 10) rungs.push(`M${n2(X(x))},${n2(yMid - HALF + 1.6)}V${n2(yMid + HALF - 1.6)}`);
  parts.push(`<path d="${rungs.join('')}" fill="none" stroke="${MUTED}" stroke-width="1"/>`);

  // New strands.
  const strand = (x0: number, x1: number, lead: boolean): string => {
    const a: [number, number] = [X(x0), Y(dN(x0), lead)];
    const b: [number, number] = [X(x1), Y(dN(x1), lead)];
    return m.arrows ? arrow(a[0], a[1], b[0], b[1], { color: NEW, width: 2, head: 8 }) : seg(a[0], a[1], b[0], b[1], NEW, 2);
  };
  const primer = (x0: number, toward: 1 | -1, lead: boolean): string => seg(X(x0), Y(dN(x0), lead), X(x0 + toward * 7), Y(dN(x0 + toward * 7), lead), INK, 5.5);
  parts.push(strand(N0, TIP, true));
  for (const [a, b] of frags) parts.push(strand(a, b, false));
  if (m.primers) {
    parts.push(primer(N0, 1, true));
    for (const [a] of frags) parts.push(primer(a, -1, false));
  }

  // 5′ / 3′ at the ends.
  const endAt: Record<ForkEnd, { x: number; d: number; lead: boolean; anchor: Anchor }> = {
    template_leading_open: { x: XL - 6, d: SPREAD, lead: true, anchor: 'end' },
    template_lagging_open: { x: XL - 6, d: SPREAD, lead: false, anchor: 'end' },
    template_leading_parental: { x: XR + 6, d: HALF + 2, lead: true, anchor: 'start' },
    template_lagging_parental: { x: XR + 6, d: HALF + 2, lead: false, anchor: 'start' },
    leading_start: { x: N0 - 6, d: dN(N0), lead: true, anchor: 'end' },
    lagging_tip: { x: N0 - 6, d: dN(N0), lead: false, anchor: 'end' },
    leading_tip: { x: TIP + 6, d: 9, lead: true, anchor: 'start' },
    lagging_start: { x: LAG0 + 6, d: 9, lead: false, anchor: 'start' },
  };
  for (const e of FORK_ENDS) {
    if (m.ends[e] === 'none') continue;
    const q = endAt[e];
    labels.push(lab(X(q.x), Y(q.d, q.lead) + TICK_FS * 0.36, m.ends[e] === 'blank' ? '?' : END_TRUTH[e], flip(q.anchor), { fs: TICK_FS + 1, weight: 600 }));
  }
  if (!forkPolaritySettled(m) && FORK_ENDS.some((e) => m.ends[e] === 'blank')) notes.push({ code: 'ambiguous_blank', message: 'an end is asked for ("?") but no other end is printed and the new strands carry no arrowheads — nothing fixes which way the strands run' });

  // Strand names, in the mouth of the fork, each on a short leader to its strand.
  const FS = TICK_FS;
  for (const lead of [true, false]) {
    const s = lead ? m.strandLabels.leading : m.strandLabels.lagging;
    if (!s) continue;
    const w = s === '?' ? 20 : estWidth(s, FS);
    if (N0 + w > 146) notes.push({ code: 'crowded', message: `strandLabels.${lead ? 'leading' : 'lagging'} ("${s}") is too long for the mouth of the fork — keep it to about 14 characters` });
    const cy = Y(13, lead);
    labels.push(lab(X(N0), cy + FS * 0.36, s, flip('start'), { fs: FS }));
    const lx = Math.min(76, Math.max(60, N0 + w / 2));
    over.push(seg(X(lx), Y(21, lead), X(lx), Y(dN(lx) - 2.5, lead), MUTED, 1));
  }

  // Enzyme markers (shapes) and what their labels attach to.
  interface Tag { s: string; x: number; d: number; lead: boolean; row: 1 | 2; bold: boolean }
  const tags: Tag[] = [];
  const shape = (pts: Array<[number, number]>): string => `<polygon points="${pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join(' ')}" fill="${ENZ_FILL}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
  const isTag = (s: string): boolean => s === '?' || /^[0-9A-Z]{1,2}$/.test(s);
  for (const e of m.enzymes) {
    if (e.type === 'helicase') {
      over.push(shape([[X(XF - 22), yMid - 18], [X(XF - 22), yMid + 18], [X(XF + 14), yMid]]));
      if (e.label !== null) {
        const tx = XF + 8;
        const cy = Y(31, true);
        labels.push(lab(X(tx), cy + FS * 0.36, e.label, flip('start'), { fs: FS, weight: isTag(e.label) ? 700 : 400 }));
        over.push(seg(X(tx + 6), Y(23.5, true), X(XF - 5), Y(10.5, true), MUTED, 1));
      }
    } else if (e.type === 'polymerase') {
      const x = TIP - 19;
      const d = (dT(x) + dN(x)) / 2;
      over.push(`<circle cx="${n2(X(x))}" cy="${n2(Y(d, true))}" r="9.5" fill="${ENZ_FILL}" stroke="${INK}" stroke-width="1.5"/>`);
      if (e.label !== null) tags.push({ s: e.label, x, d: d + 9.5, lead: true, row: 1, bold: isTag(e.label) });
    } else if (e.type === 'primase') {
      const x = LAG0 + 3;
      const cy = Y(dT(x), false);
      over.push(`<rect x="${n2(X(x) - 6.5)}" y="${n2(cy - 6.5)}" width="13" height="13" fill="${ENZ_FILL}" stroke="${INK}" stroke-width="1.5"/>`);
      if (e.label !== null) tags.push({ s: e.label, x, d: dT(x) + 6.5, lead: false, row: 1, bold: isTag(e.label) });
    } else {
      const k = frags.length - 2;
      const x = (frags[k][1] + frags[k + 1][0]) / 2;
      const d = (dT(x) + dN(x)) / 2;
      const cx = X(x);
      const cy = Y(d, false);
      over.push(shape([[cx - 8.5, cy], [cx, cy - 8.5], [cx + 8.5, cy], [cx, cy + 8.5]]));
      if (e.label !== null) tags.push({ s: e.label, x, d: d + 8.5, lead: false, row: 2, bold: isTag(e.label) });
    }
  }
  if (m.fragmentLabel) {
    const k = Math.min(1, frags.length - 1);
    const x = (frags[k][0] + frags[k][1]) / 2 + (has('ligase') && k === frags.length - 2 ? 3 : 0);
    over.push(`<circle cx="${n2(X(x))}" cy="${n2(Y(dN(x), false))}" r="2.6" fill="${INK}"/>`);
    tags.push({ s: m.fragmentLabel, x, d: dN(x), lead: false, row: 2, bold: isTag(m.fragmentLabel) });
  }
  // Label rows outside the arms: row 1 (near the fork, where the arms are close to the axis) and row 2 (beyond the open end).
  const ROW_D = { 1: 57, 2: SPREAD + 15 } as const;
  for (const lead of [true, false]) {
    for (const row of [1, 2] as const) {
      const mine = tags.filter((g) => g.lead === lead && g.row === row).sort((a, b) => a.x - b.x);
      if (mine.length === 0) continue;
      const lo = row === 1 ? 120 : 10;
      const hi = row === 1 ? XR + 24 : W - 10;
      const widths = mine.map((g) => (g.s === '?' ? 20 : estWidth(g.s, FS)));
      const cx = mine.map((g, i) => Math.min(hi - widths[i] / 2, Math.max(lo + widths[i] / 2, g.x)));
      for (let i = 1; i < cx.length; i++) cx[i] = Math.max(cx[i], cx[i - 1] + widths[i - 1] / 2 + widths[i] / 2 + 10);
      for (let i = cx.length - 1; i >= 0; i--) cx[i] = Math.min(cx[i], (i === cx.length - 1 ? hi : cx[i + 1] - widths[i + 1] / 2 - 10) - widths[i] / 2);
      if (cx[0] - widths[0] / 2 < lo - 0.5) notes.push({ code: 'labels_overlap', message: `the labels ${mine.map((g) => `"${g.s}"`).join(', ')} do not fit side by side under the fork — use numbers for the markers` });
      mine.forEach((g, i) => {
        const cy = Y(ROW_D[row], lead);
        labels.push(lab(X(cx[i]), cy + FS * 0.36, g.s, 'middle', { fs: FS, weight: g.bold ? 700 : 400 }));
        // The leader meets the label at the point of it nearest the marker.
        const ax = Math.min(cx[i] + Math.max(0, widths[i] / 2 - 5), Math.max(cx[i] - Math.max(0, widths[i] / 2 - 5), g.x));
        over.push(seg(X(g.x), Y(g.d + 1, lead), X(ax), Y(ROW_D[row] - 8, lead), MUTED, 1));
      });
    }
  }

  let H = yMid + (sL < 0 ? extLag : extLead) + 4;
  if (m.primers && m.primerKey) {
    parts.push(seg(24, H + 6, 32, H + 6, INK, 5.5), text(38, H + 10, '= RNA primer', {}));
    H += 20;
  }
  return { body: t.svg + parts.join('') + over.join('') + labels.join(''), H: H + 2, facts: facts(notes) };
}
