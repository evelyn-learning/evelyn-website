/**
 * electrochemical_cell — batch 4 (2026-10-14): a galvanic (voltaic) cell or
 * an electrolytic cell as a labelled apparatus sketch.
 *
 *   { variant?: 'galvanic' | 'electrolytic' ('galvanic');
 *     left:  { electrode: string;             // "Zn", "Cu(s)", "Pt", "?" (a blank box)
 *              solution?: string };           // "1.0 M ZnSO₄", "Zn²⁺(aq)" — under the beaker ("?" = blank)
 *     right: { electrode: string; solution?: string };
 *     anode: 'left' | 'right';                // where oxidation happens — the MODEL; printed only as asked below
 *     roles?: 'value' | 'blank' | 'none' ('none');          // "anode" / "cathode" over the electrodes ("?" boxes when blank)
 *     electronFlow?: 'value' | 'blank' | 'none' ('none');   // an arrow labelled e⁻ along the wire, from anode to cathode
 *     polarity?: 'value' | 'none' ('none');                 // "+" / "−" beside the electrode tops
 *     container?: 'two' | 'one';              // two beakers joined by a salt bridge (galvanic default),
 *                                             //   or one beaker holding both electrodes (electrolytic default);
 *                                             //   with 'one', give the solution on `left` only
 *     saltBridge?: string | false ('salt bridge');          // its label; false ⇒ unlabelled (two beakers only)
 *     bridgeIons?: { anion?: string; cation?: string };     // drawn under the bridge with arrows: anions toward
 *                                             //   the anode, cations toward the cathode (this SHOWS which is which)
 *     meterLabel?: string;                    // a reading beside the voltmeter, e.g. "1.10 V" or "?" (galvanic)
 *     title?: string }
 *   Galvanic: a voltmeter (circle, "V") in the wire. Electrolytic: a battery
 *   in its place — the long thin plate is the positive terminal and faces
 *   the anode; `polarity` also marks the battery's terminals.
 *
 * Nothing says which electrode is the anode unless roles, electronFlow,
 * polarity, bridgeIons or (electrolytic) the battery shows it.
 */
import { FIGURE_WIDTH, LABEL_FS, TICK_FS, estWidth, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, arrow, blank, text, titleBlock } from './draw';
import { facts, lab, seg, stroke, type Notes, type Show, SHOWS } from './draw2';

export type Side = 'left' | 'right';
export interface CellModel {
  variant: 'galvanic' | 'electrolytic';
  left: { electrode: string; solution?: string };
  right: { electrode: string; solution?: string };
  anode: Side;
  roles: Show;
  electronFlow: Show;
  polarity: 'value' | 'none';
  container: 'two' | 'one';
  saltBridge?: string;
  bridgeIons?: { anion?: string; cation?: string };
  meterLabel?: string;
  title?: string;
}

export function cellModel(r: Reader): CellModel {
  const p = r.p;
  const pick = <T extends string>(v: unknown, name: string, allowed: readonly T[], dflt: T): T => {
    if (v === undefined || v === null) return dflt;
    if (typeof v !== 'string' || !allowed.includes(v as T)) r.fail(`${name} must be one of ${allowed.join(', ')}`);
    return v as T;
  };
  const variant = pick(p.variant, 'variant', ['galvanic', 'electrolytic'] as const, 'galvanic');
  const container = pick(p.container, 'container', ['two', 'one'] as const, variant === 'galvanic' ? 'two' : 'one');
  const half = (name: Side) => {
    const o = r.obj(p[name], name);
    return { electrode: r.str(o.electrode, `${name}.electrode`, 10), solution: r.optStr(o.solution, `${name}.solution`, container === 'one' ? 30 : 18) };
  };
  const left = half('left');
  const right = half('right');
  if (container === 'one' && right.solution) r.fail('right.solution: with one container the solution is given on left only');
  if (p.anode !== 'left' && p.anode !== 'right') r.fail('anode must be one of left, right');
  let saltBridge: string | undefined;
  if (container === 'two') saltBridge = p.saltBridge === false ? undefined : r.optStr(p.saltBridge, 'saltBridge', 14) ?? 'salt bridge';
  else if (p.saltBridge !== undefined && p.saltBridge !== null && p.saltBridge !== false) r.fail('saltBridge: one container has no salt bridge');
  let bridgeIons: CellModel['bridgeIons'];
  if (p.bridgeIons !== undefined && p.bridgeIons !== null) {
    if (container !== 'two') r.fail('bridgeIons needs two containers (a salt bridge)');
    const o = r.obj(p.bridgeIons, 'bridgeIons');
    bridgeIons = { anion: r.optStr(o.anion, 'bridgeIons.anion', 6), cation: r.optStr(o.cation, 'bridgeIons.cation', 6) };
    if (!bridgeIons.anion && !bridgeIons.cation) r.fail('bridgeIons must name an anion, a cation or both');
  }
  const meterLabel = r.optStr(p.meterLabel, 'meterLabel', 10);
  if (meterLabel && variant !== 'galvanic') r.fail('meterLabel: only a galvanic cell has a voltmeter');
  return {
    variant, left, right, anode: p.anode as Side, roles: pick(p.roles, 'roles', SHOWS, 'none'), electronFlow: pick(p.electronFlow, 'electronFlow', SHOWS, 'none'),
    polarity: pick(p.polarity, 'polarity', ['value', 'none'] as const, 'none'), container, saltBridge, bridgeIons, meterLabel, title: r.optStr(p.title, 'title', 160),
  };
}

/** The electrode joined to the positive terminal / that is positive: the cathode of a galvanic cell, the anode of an electrolytic one. */
export const positiveSide = (m: CellModel): Side => {
  const cathode: Side = m.anode === 'left' ? 'right' : 'left';
  return m.variant === 'galvanic' ? cathode : m.anode;
};
/** Does the drawing itself show which electrode is the anode? (roles printed, the electron arrow, the signs, the ion arrows, a battery) */
export const showsAnode = (m: CellModel): boolean =>
  m.roles === 'value' || m.electronFlow === 'value' || m.polarity === 'value' || !!m.bridgeIons || m.variant === 'electrolytic';

const SOLUTION = '#e8f1fb';

export function renderElectrochemicalCell(r: Reader, _uid?: string): Drawn {
  const m = cellModel(r);
  const W = FIGURE_WIDTH;
  const notes: Notes = [];
  const t = titleBlock(m.title, W);
  const parts: string[] = [t.svg];
  const top = t.top + (m.roles !== 'none' ? 18 : 0);
  const wireY = top + 22;
  const rimY = top + 112;
  const surfY = rimY + 20;
  const floorY = rimY + 104;
  const two = m.container === 'two';
  const ex = two ? { left: 82, right: 278 } : { left: 112, right: 248 };
  const beakers = two ? [{ x0: 44, x1: 158 }, { x0: 202, x1: 316 }] : [{ x0: 70, x1: 290 }];
  const elTop = top + 78;
  const elBot = floorY - 22;

  // Beakers and their solutions.
  for (const b of beakers) {
    parts.push(`<rect x="${n2(b.x0 + 1)}" y="${n2(surfY)}" width="${n2(b.x1 - b.x0 - 2)}" height="${n2(floorY - surfY - 1)}" fill="${SOLUTION}"/>`);
    parts.push(seg(b.x0, surfY, b.x1, surfY, MUTED, 1));
    parts.push(`<path d="M${n2(b.x0)},${n2(rimY)}V${n2(floorY)}H${n2(b.x1)}V${n2(rimY)}" ${stroke(INK, 1.8)}/>`);
  }
  // Salt bridge: an inverted U tube (two parallel lines), its ends under the surface.
  if (two) {
    const bx0 = 136;
    const bx1 = 224;
    const by = rimY - 26;
    const d = `M${bx0},${n2(surfY + 34)}V${n2(by + 10)}Q${bx0},${n2(by)} ${bx0 + 10},${n2(by)}H${bx1 - 10}Q${bx1},${n2(by)} ${bx1},${n2(by + 10)}V${n2(surfY + 34)}`;
    parts.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="13" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ffffff" stroke-width="10" stroke-linejoin="round"/>`);
    // Open ends (the white core runs out through the stroke ends).
    for (const x of [bx0, bx1]) parts.push(seg(x - 5, surfY + 34.6, x + 5, surfY + 34.6, '#ffffff', 2.2));
    if (m.saltBridge) parts.push(lab(W / 2, by - 12, m.saltBridge, 'middle', { fs: TICK_FS }));
    if (m.bridgeIons) {
      // Anions drift toward the anode, cations toward the cathode: text with a drawn arrow beside it.
      const toLeft = (side: Side) => side === 'left';
      const rows: Array<{ s: string; left: boolean }> = [];
      if (m.bridgeIons.anion) rows.push({ s: m.bridgeIons.anion, left: toLeft(m.anode) });
      if (m.bridgeIons.cation) rows.push({ s: m.bridgeIons.cation, left: !toLeft(m.anode) });
      rows.forEach((row, i) => {
        const y = by + 24 + i * 17;
        const w = estWidth(row.s, TICK_FS);
        const total = w + 22;
        const x0 = W / 2 - total / 2;
        if (row.left) {
          parts.push(arrow(x0 + 18, y - 4, x0, y - 4, { width: 1.4, head: 7 }) + text(x0 + 22, y, row.s));
        } else {
          parts.push(text(x0, y, row.s) + arrow(x0 + w + 4, y - 4, x0 + w + 22, y - 4, { width: 1.4, head: 7 }));
        }
      });
      if (rows.some((row) => estWidth(row.s, TICK_FS) + 22 > 72)) notes.push({ code: 'crowded', message: 'bridgeIons: an ion label is too long for the room under the salt bridge — use the bare formula (e.g. "NO₃⁻")' });
    }
  }
  // Electrodes (drawn over the solution), wire, meter or battery.
  for (const side of ['left', 'right'] as const) {
    const x = ex[side];
    parts.push(`<rect x="${n2(x - 6)}" y="${n2(elTop)}" width="12" height="${n2(elBot - elTop)}" fill="#d1d5db" stroke="${INK}" stroke-width="1.5"/>`);
    parts.push(`<path d="M${n2(x)},${n2(elTop)}V${n2(wireY)}" ${stroke(INK, 1.6)}/>`);
  }
  const cx = W / 2;
  if (m.variant === 'galvanic') {
    parts.push(seg(ex.left, wireY, cx - 15, wireY) + seg(cx + 15, wireY, ex.right, wireY));
    parts.push(`<circle cx="${n2(cx)}" cy="${n2(wireY)}" r="15" fill="#ffffff" stroke="${INK}" stroke-width="1.6"/>` + text(cx, wireY + 13 * 0.36, 'V', { fs: 13, anchor: 'middle', weight: 600 }));
    if (m.meterLabel) parts.push(lab(cx, wireY + 15 + TICK_FS + 3, m.meterLabel, 'middle'));
  } else {
    // Battery: long thin plate = positive, on the anode's side.
    const posLeft = positiveSide(m) === 'left';
    const xp = posLeft ? cx - 4 : cx + 4;
    const xn = posLeft ? cx + 4 : cx - 4;
    parts.push(seg(ex.left, wireY, cx - 4, wireY) + seg(cx + 4, wireY, ex.right, wireY));
    parts.push(seg(xp, wireY - 13, xp, wireY + 13, INK, 1.6) + seg(xn, wireY - 7, xn, wireY + 7, INK, 4));
    if (m.polarity === 'value') {
      parts.push(text(xp + (posLeft ? -9 : 9), wireY - 8, '+', { fs: LABEL_FS, anchor: 'middle', weight: 700 }) + text(xn + (posLeft ? 9 : -9), wireY - 8, '−', { fs: LABEL_FS, anchor: 'middle', weight: 700 }));
    }
  }
  // Electron flow along the wire, on the anode's half: anode → cathode.
  if (m.electronFlow !== 'none') {
    const aL = m.anode === 'left';
    const xa = aL ? ex.left : ex.right;
    const mid = (xa + (aL ? cx - 15 : cx + 15)) / 2;
    const y = wireY - 9;
    if (m.electronFlow === 'value') {
      const dir = aL ? 1 : -1;
      parts.push(arrow(mid - dir * 13, y, mid + dir * 13, y, { width: 1.6, head: 8 }) + text(mid, y - 6, 'e⁻', { fs: LABEL_FS, anchor: 'middle' }));
    } else {
      // The direction is the question: the label and a "?" box, the same on whichever side the anode is.
      const leftMid = (ex.left + cx - 15) / 2;
      parts.push(text(leftMid - 14, y - 2, 'e⁻', { fs: LABEL_FS, anchor: 'middle' }) + blank(leftMid + 10, y - 6, 19, TICK_FS + 5, TICK_FS));
    }
  }
  // Electrode names beside the electrode tops (outer side), signs on the inner side, roles above the wire ends.
  for (const side of ['left', 'right'] as const) {
    const x = ex[side];
    const out = side === 'left' ? -1 : 1;
    const name = m[side].electrode;
    const ny = (elTop + rimY) / 2 + 2;
    parts.push(name === '?' ? blank(x + out * 20, ny - 4, 19, TICK_FS + 5, TICK_FS) : text(x + out * 10, ny, name, { fs: LABEL_FS, anchor: out < 0 ? 'end' : 'start', weight: 600 }));
    if (m.polarity === 'value' && m.variant === 'galvanic') parts.push(text(x - out * 12, elTop - 6, positiveSide(m) === side ? '+' : '−', { fs: 13, anchor: 'middle', weight: 700 }));
    if (m.roles !== 'none') {
      const role = m.anode === side ? 'anode' : 'cathode';
      parts.push(m.roles === 'blank' ? lab(x, wireY - 10, '?', 'middle', { fs: TICK_FS }) : text(x - out * 5, wireY - 10, role, { anchor: out < 0 ? 'end' : 'start' }));
    }
  }
  // Solution labels under the beakers.
  let bottom = floorY + 8;
  const sols = two ? [{ s: m.left.solution, x: (beakers[0].x0 + beakers[0].x1) / 2 }, { s: m.right.solution, x: (beakers[1].x0 + beakers[1].x1) / 2 }] : [{ s: m.left.solution, x: W / 2 }];
  if (sols.some((q) => q.s)) {
    for (const q of sols) if (q.s) parts.push(lab(q.x, floorY + TICK_FS + 7, q.s, 'middle'));
    bottom = floorY + TICK_FS + 14;
  }
  return { body: parts.join(''), H: bottom, facts: facts(notes) };
}
