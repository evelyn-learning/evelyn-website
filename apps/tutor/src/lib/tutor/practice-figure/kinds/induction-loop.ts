/**
 * induction_loop — batch 5 (2026-10-16): a loop of wire whose magnetic flux
 * changes, for Faraday's and Lenz's laws. Two variants; in both the induced
 * current is `'value'` (drawn), `'blank'` (a dashed "?" box where its arrow
 * would be — the same picture whichever way the answer goes) or `'none'`.
 *
 * magnet — a bar magnet on the axis of a circular loop drawn in perspective
 *   { variant: 'magnet';
 *     pole: 'N' | 'S';                         // the pole that FACES the loop
 *     motion: 'toward' | 'away' | 'rest';      // the magnet's motion relative to the loop
 *     magnetSide?: 'left' | 'right' ('left');
 *     showPoles?: 'value' | 'blank' ('value'); // blank: both halves of the magnet are "?"
 *     current?: 'value' | 'blank' | 'none' ('none');
 *     turns?: number;                          // > 1 is drawn as a coil of three loops; printed "N = 200 turns"
 *     show?: { turns: 'value' | 'blank' | 'none' }; symbols?: { turns: string };
 *     meter?: boolean (false);                 // a galvanometer "G" joined to the loop
 *     velocityLabel?: string ('v'); title?: string }
 *   The loop is seen from in front and a little from the magnet's side: the half of the loop AWAY from
 *   the magnet is the near side (drawn heavier). The current arrow stands on that near side and points
 *   up or down the page. `sense` in the model is the direction seen FROM THE MAGNET, looking along the
 *   axis at the loop.
 *
 * field — a rectangular loop and a region of uniform field (crosses: into the page; dots: out of it)
 *   { variant: 'field';
 *     field: 'into' | 'out';
 *     position: 'entering' | 'inside' | 'leaving';
 *     direction?: 'left' | 'right';            // the loop's velocity — required unless it is inside
 *     change?: 'increasing' | 'decreasing';    // a loop at rest inside a field that is changing ("B increasing")
 *     showField?: 'value' | 'blank' ('value'); // blank: no dots or crosses — "field direction: ?"
 *     current?: 'value' | 'blank' | 'none' ('none');
 *     B?: number (T); length?: number (m) — the side of the loop that cuts the field; speed?: number (m/s);
 *     resistance?: number (Ω);
 *     show?: { B | length | speed | resistance: 'value' | 'blank' | 'none' }; symbols?: { … };
 *     lengthUnit?: string ('m'); speedUnit?: string ('m/s'); title?: string }
 *   `sense` in the model is the direction as drawn on the page.
 *
 * Lenz's law is worked from first principles in `inductionModel` (the sign of the flux change and the
 * right-hand rule), never tabulated. Legibility notes: a blank with nothing on the figure to find it from.
 */
import { FIGURE_WIDTH, LABEL_FS, TICK_FS, estWidth, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, arrow, blank, inkWidth, overlaps, text, textBox, titleBlock, type Box } from './draw';
import { SHOWS, facts, head, seg, stroke, type Notes, type Show } from './draw2';
import { emLabel, emQuantities, emWidth, type EmQuantity } from './transformer';

export const INDUCTION_VARIANTS = ['magnet', 'field'] as const;
export type Sense = 'clockwise' | 'counterclockwise' | 'none';

export interface MagnetLoopModel {
  variant: 'magnet';
  pole: 'N' | 'S';
  motion: 'toward' | 'away' | 'rest';
  magnetSide: 'left' | 'right';
  poles: 'value' | 'blank';
  current: Show;
  coil: boolean;
  meter: boolean;
  velocityLabel: string;
  q: { turns: EmQuantity };
  /** How the flux through the loop is changing. */
  flux: 'increasing' | 'decreasing' | 'steady';
  /** The induced current seen from the magnet, looking along the axis at the loop. */
  sense: Sense;
  /** Which way the current arrow on the near side of the loop points on the page. */
  nearSide: 'up' | 'down' | 'none';
  title?: string;
}
export interface FieldLoopModel {
  variant: 'field';
  field: 'into' | 'out';
  position: 'entering' | 'inside' | 'leaving';
  direction?: 'left' | 'right';
  change?: 'increasing' | 'decreasing';
  showField: 'value' | 'blank';
  current: Show;
  q: Record<'B' | 'length' | 'speed' | 'resistance', EmQuantity>;
  flux: 'increasing' | 'decreasing' | 'steady';
  /** The induced current as drawn on the page. */
  sense: Sense;
  title?: string;
}
export type InductionModel = MagnetLoopModel | FieldLoopModel;

const MAGNET_ONLY = ['pole', 'motion', 'magnetSide', 'showPoles', 'turns', 'meter', 'velocityLabel'];
const FIELD_ONLY = ['field', 'position', 'direction', 'change', 'showField', 'B', 'length', 'speed', 'resistance', 'lengthUnit', 'speedUnit'];

export function inductionModel(r: Reader): InductionModel {
  const p = r.p;
  const oneOf = <T extends string>(k: string, allowed: readonly T[], d?: T, why = ''): T => {
    const v = (p[k] === undefined || p[k] === null) && d !== undefined ? d : p[k];
    if (typeof v !== 'string' || !allowed.includes(v as T)) r.fail(`${k} must be one of ${allowed.join(', ')}${why}`);
    return v as T;
  };
  const variant = oneOf('variant', INDUCTION_VARIANTS);
  for (const k of variant === 'magnet' ? FIELD_ONLY : MAGNET_ONLY) if (p[k] !== undefined && p[k] !== null) r.fail(`${k} is for variant "${variant === 'magnet' ? 'field' : 'magnet'}" only`);
  const current = oneOf('current', SHOWS, 'none');
  const title = r.optStr(p.title, 'title', 160);

  if (variant === 'magnet') {
    const pole = oneOf('pole', ['N', 'S'] as const);
    const motion = oneOf('motion', ['toward', 'away', 'rest'] as const);
    const magnetSide = oneOf('magnetSide', ['left', 'right'] as const, 'left');
    let turns: number | undefined;
    if (p.turns !== undefined && p.turns !== null) {
      turns = r.num(p.turns, 'turns');
      if (!Number.isInteger(turns) || turns < 1) r.fail('turns must be a whole number of 1 or more');
    }
    const q = emQuantities(r, 'of this variant', [{ key: 'turns', symbol: 'N', unit: 'turns', value: turns, param: 'turns' }]) as { turns: EmQuantity };
    // Axes: x along the magnet's axis to the right, z toward the reader. The magnet stands at −s·x.
    const s = magnetSide === 'left' ? 1 : -1;
    // The field of the facing pole at the loop points away from an N pole, toward an S pole.
    const bx = s * (pole === 'N' ? 1 : -1);
    // Its flux grows as the magnet comes nearer.
    const dFlux = motion === 'rest' ? 0 : motion === 'toward' ? bx : -bx;
    // Lenz: the induced field opposes the CHANGE of flux.
    const induced = -dFlux;
    // Right-hand rule about +x: at the near point of the loop (+z) the current runs along x̂ × ẑ = −ŷ (down the page).
    const nearSide = induced === 0 ? 'none' : induced > 0 ? 'down' : 'up';
    // Seen from the magnet, an induced field that points AT the magnet (−s·x) is a counter-clockwise current.
    const sense: Sense = induced === 0 ? 'none' : induced * -s > 0 ? 'counterclockwise' : 'clockwise';
    return {
      variant, pole, motion, magnetSide, poles: oneOf('showPoles', ['value', 'blank'] as const, 'value'), current, coil: (turns ?? 1) > 1, meter: r.bool(p.meter, 'meter', false),
      velocityLabel: r.optStr(p.velocityLabel, 'velocityLabel', 14) ?? 'v', q, flux: motion === 'rest' ? 'steady' : motion === 'toward' ? 'increasing' : 'decreasing', sense, nearSide, title,
    };
  }

  const field = oneOf('field', ['into', 'out'] as const);
  const position = oneOf('position', ['entering', 'inside', 'leaving'] as const);
  const direction = position === 'inside' && (p.direction === undefined || p.direction === null) ? undefined
    : oneOf('direction', ['left', 'right'] as const, undefined, ' — a loop that is entering or leaving the region is moving');
  let change: 'increasing' | 'decreasing' | undefined;
  if (p.change !== undefined && p.change !== null) {
    if (position !== 'inside' || direction !== undefined) r.fail('change is for a loop at rest wholly inside the region (position "inside", no direction)');
    change = oneOf('change', ['increasing', 'decreasing'] as const);
  }
  const pos = (k: string): number | undefined => (p[k] === undefined || p[k] === null ? undefined : r.positive(p[k], k));
  const B = pos('B');
  const length = pos('length');
  const speed = pos('speed');
  const resistance = pos('resistance');
  const q = emQuantities(r, 'of this variant', [
    { key: 'B', symbol: 'B', unit: 'T', value: B, param: 'B' },
    { key: 'length', symbol: 'L', unit: r.optStr(p.lengthUnit, 'lengthUnit', 6) ?? 'm', value: length, param: 'length' },
    { key: 'speed', symbol: 'v', unit: r.optStr(p.speedUnit, 'speedUnit', 8) ?? 'm/s', value: speed, param: 'speed' },
    { key: 'resistance', symbol: 'R', unit: 'Ω', value: resistance, param: 'resistance' },
  ]) as FieldLoopModel['q'];
  const flux = position === 'entering' ? 'increasing' : position === 'leaving' ? 'decreasing' : change ?? 'steady';
  // z is out of the page. The flux through the loop has the sign of the field; it grows or shrinks in size.
  const bz = field === 'out' ? 1 : -1;
  const dFlux = flux === 'steady' ? 0 : flux === 'increasing' ? bz : -bz;
  // Lenz: the induced field opposes the change; a field out of the page (+z) is a counter-clockwise current on the page.
  const induced = -dFlux;
  const sense: Sense = induced === 0 ? 'none' : induced > 0 ? 'counterclockwise' : 'clockwise';
  return { variant, field, position, direction, change, showField: oneOf('showField', ['value', 'blank'] as const, 'value'), current, q, flux, sense, title };
}

const BLANK_NOTE = (what: string, need: string): Notes[number] => ({ code: 'ambiguous_blank', message: `${what} left blank, but ${need} — nothing on the figure settles it` });

// ---------------------------------------------------------------------------
// magnet
// ---------------------------------------------------------------------------

function drawMagnet(m: MagnetLoopModel, top: number, notes: Notes): { svg: string; bottom: number } {
  const W = FIGURE_WIDTH;
  const s = m.magnetSide === 'left' ? 1 : -1; // +1: the loop is to the right of the magnet
  const flip = (x: number): number => (s > 0 ? x : W - x);
  const RX = 20;
  const RY = 56;
  const cy = top + 14 + RY + 16;
  const lx = flip(254);
  const mcx = flip(98);
  const MW = 104;
  const MH = 30;
  const loops = m.coil ? [0, 9, 18] : [0];
  const parts: string[] = [];
  // Half an ellipse: the side toward the magnet (far, lighter) or away from it (near, heavier).
  const half = (cx: number, near: boolean): string => {
    const right = near ? s > 0 : s < 0;
    return `<path d="M${n2(cx)},${n2(cy - RY)}A${RX},${RY} 0 0 ${right ? 1 : 0} ${n2(cx)},${n2(cy + RY)}" ${stroke(INK, near ? 2.6 : 1.3)}/>`;
  };
  for (const off of loops) parts.push(half(lx + s * off, false));
  // The axis the magnet moves along, as far as the loop.
  parts.push(seg(mcx + s * (MW / 2 + 4), cy, lx + s * loops[loops.length - 1] - s * 2, cy, MUTED, 1, '4 3'));
  for (const off of loops) parts.push(half(lx + s * off, true));
  const lastX = lx + s * loops[loops.length - 1];
  const nearX = lastX + s * RX;
  let bottom = cy + RY + 6;
  if (m.meter) {
    const gy = cy + RY + 30;
    const gx = (lx + lastX) / 2;
    const spread = m.coil ? 0 : 3;
    parts.push(seg(lx - s * spread, cy + RY, gx - s * 6, gy - 9, INK, 1.4), seg(lastX + s * spread, cy + RY, gx + s * 6, gy - 9, INK, 1.4));
    parts.push(`<circle cx="${n2(gx)}" cy="${n2(gy)}" r="12" fill="#ffffff" stroke="${INK}" stroke-width="1.6"/>`, text(gx, gy + LABEL_FS * 0.36, 'G', { fs: LABEL_FS, anchor: 'middle', weight: 600 }));
    bottom = gy + 16;
  }
  // The magnet: two halves drawn alike, the facing pole on the loop's side.
  const x0 = mcx - MW / 2;
  parts.push(`<rect x="${n2(x0)}" y="${n2(cy - MH / 2)}" width="${MW}" height="${MH}" fill="#ffffff" stroke="${INK}" stroke-width="2"/>`, seg(mcx, cy - MH / 2, mcx, cy + MH / 2, INK, 1.4));
  const other = m.pole === 'N' ? 'S' : 'N';
  const letters: Array<[number, string]> = s > 0 ? [[mcx - MW / 4, other], [mcx + MW / 4, m.pole]] : [[mcx - MW / 4, m.pole], [mcx + MW / 4, other]];
  // The motion arrow over the magnet (text first, so the document order is label, then poles).
  const ay = cy - MH / 2 - 14;
  if (m.motion === 'rest') parts.push(text(mcx, ay + 4, 'at rest', { anchor: 'middle', fill: MUTED }));
  else {
    const d = (m.motion === 'toward' ? 1 : -1) * s;
    parts.push(text(mcx, ay - 9, m.velocityLabel, { fs: LABEL_FS, anchor: 'middle', weight: 600 }), arrow(mcx - d * 24, ay, mcx + d * 24, ay, { width: 2.2 }));
  }
  for (const [hx, letter] of letters) parts.push(m.poles === 'value' ? text(hx, cy + 5, letter, { fs: 14, anchor: 'middle', weight: 700 }) : blank(hx, cy, 19, 17, 12));
  // The induced current, on the near side of the loop.
  if (m.current === 'blank') parts.push(blank(nearX, cy, 20, 17, 12));
  else if (m.current === 'value') {
    if (m.nearSide === 'none') parts.push(text(nearX + s * 10, cy + 4, 'I = 0', { fs: LABEL_FS, anchor: s > 0 ? 'start' : 'end', weight: 600 }));
    else {
      const up = m.nearSide === 'up' ? -1 : 1;
      parts.push(head(nearX, cy + up * 7, 0, up, 13, INK), text(nearX + s * 12, cy + 4, 'I', { fs: 13, anchor: s > 0 ? 'start' : 'end', weight: 700, italic: true }));
    }
  }
  if (m.q.turns.show !== 'none') {
    parts.push(emLabel(m.q.turns, (lx + lastX) / 2, bottom + 12, 'middle'));
    bottom += 18;
  }
  if (m.poles === 'blank' && (m.current !== 'value' || m.sense === 'none')) notes.push(BLANK_NOTE('the poles of the magnet are', 'the induced current is not drawn'));
  return { svg: parts.join(''), bottom: bottom + 6 };
}

// ---------------------------------------------------------------------------
// field
// ---------------------------------------------------------------------------

function drawField(m: FieldLoopModel, top: number, notes: Notes): { svg: string; bottom: number } {
  const q = m.q;
  // The field symbols stand on a grid of STEP units anchored to the loop's centre, and the loop and the
  // region are sized in grid steps — so every side of the loop and every edge of the region runs midway
  // between two rows or columns of symbols, never through one.
  const STEP = 24;
  const LW = 4 * STEP;
  const LH = 3 * STEP;
  const ry0 = top + 26;
  const ry1 = ry0 + 7 * STEP;
  const cy = (ry0 + ry1) / 2;
  // Which edge of the region the loop straddles: moving right it enters over the left edge and leaves over the right one.
  const edge = m.position === 'inside' ? 'none' : (m.position === 'entering') === (m.direction === 'right') ? 'left' : 'right';
  const [rx0, rx1, cx] = edge === 'none' ? [180 - 5 * STEP, 180 + 5 * STEP, 180] : edge === 'left' ? [182, 182 + 7 * STEP, 182] : [178 - 7 * STEP, 178, 178];
  /** Where the current and the resistance are marked: the middle of the loop, or of its half outside the region. */
  const mx = edge === 'none' ? cx : edge === 'left' ? cx - LW / 4 : cx + LW / 4;
  const lx0 = cx - LW / 2;
  const lx1 = cx + LW / 2;
  const ly0 = cy - LH / 2;
  const ly1 = cy + LH / 2;
  const blocked: Box[] = [];
  const over: string[] = [];
  const put = (svg: string, box: Box): void => { over.push(svg); blocked.push(box); };
  const qBox = (k: EmQuantity, x: number, y: number, anchor: 'start' | 'middle' | 'end'): Box => {
    const w = emWidth(k);
    const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
    return { x0: left, y0: y - TICK_FS, x1: left + w, y1: y + 4 };
  };
  // The velocity arrow, out of the middle of the leading side.
  let trailing = lx0;
  if (m.direction) {
    const d = m.direction === 'right' ? 1 : -1;
    const ax = d > 0 ? lx1 : lx0;
    const tip = ax + d * 40;
    trailing = d > 0 ? lx0 : lx1;
    put(arrow(ax, cy, tip, cy, { width: 2.2 }), { x0: Math.min(ax, tip) - 2, y0: cy - 6, x1: Math.max(ax, tip) + 2, y1: cy + 6 });
    const anchor = d > 0 ? 'start' : 'end';
    const bare = q.speed.show === 'none';
    const w = bare ? estWidth('v', LABEL_FS) : emWidth(q.speed);
    // Inside the region the label follows the arrow on its own row of symbols when it fits there; otherwise it stands over the arrow.
    const inRegion = d > 0 ? ax >= rx0 && ax < rx1 : ax <= rx1 && ax > rx0;
    const after = inRegion && (d > 0 ? tip + 7 + w <= rx1 - 5 : tip - 7 - w >= rx0 + 5);
    const [vx, vy] = after ? [tip + d * 7, cy + 4] : [ax + d * 6, cy - 10];
    if (bare) put(text(vx, vy, 'v', { fs: LABEL_FS, anchor, weight: 600, halo: true }), ((b: Box): Box => ({ ...b, x0: b.x0 - 5, x1: b.x1 + 5 }))(textBox(vx, vy, 'v', LABEL_FS, anchor)));
    else put(emLabel(q.speed, vx, vy, anchor, { halo: true }), qBox(q.speed, vx, vy, anchor));
  } else if (q.speed.show !== 'none') notes.push({ code: 'crowded', message: 'show.speed is set but the loop has no direction — the speed is not drawn' });
  // The side that cuts the field: a dimension line beside the trailing side.
  if (q.length.show !== 'none') {
    const out = trailing === lx0 ? -1 : 1;
    const dx = trailing + out * 13;
    put(`<path d="M${n2(dx)},${n2(ly0)}V${n2(ly1)}M${n2(dx - 4)},${n2(ly0)}h8M${n2(dx - 4)},${n2(ly1)}h8" ${stroke(MUTED, 1)}/>`, { x0: dx - 5, y0: ly0 - 2, x1: dx + 5, y1: ly1 + 2 });
    const anchor = out < 0 ? 'end' : 'start';
    put(emLabel(q.length, dx + out * 7, cy + 4, anchor, { halo: true }), qBox(q.length, dx + out * 7, cy + 4, anchor));
  }
  if (q.resistance.show !== 'none') {
    // Under the loop: centred, or — when the loop straddles the edge — beside the edge, on the side outside the region.
    const [x, anchor] = edge === 'none' ? [cx, 'middle' as const] : edge === 'left' ? [cx - 8, 'end' as const] : [cx + 8, 'start' as const];
    put(emLabel(q.resistance, x, ly1 + 16, anchor, { halo: true }), qBox(q.resistance, x, ly1 + 16, anchor));
  }
  // The induced current: arrowheads on the top and bottom sides, or a "?" box on the top side.
  if (m.current === 'blank') put(blank(mx, ly0, 20, 17, 12), { x0: mx - 11, y0: ly0 - 9, x1: mx + 11, y1: ly0 + 9 });
  else if (m.current === 'value') {
    if (m.sense === 'none') put(text(cx, cy + 4, 'I = 0', { fs: LABEL_FS, anchor: 'middle', weight: 600, halo: true }), textBox(cx, cy + 4, 'I = 0', LABEL_FS, 'middle'));
    else {
      const d = m.sense === 'clockwise' ? 1 : -1; // along the top side
      over.push(head(mx + d * 7, ly0, d, 0, 13, INK) + head(mx - d * 7, ly1, -d, 0, 13, INK));
      put(text(mx, ly0 - 8, 'I', { fs: 13, anchor: 'middle', weight: 700, italic: true, halo: true }), { x0: mx - 5, y0: ly0 - 19, x1: mx + 5, y1: ly0 - 6 });
    }
  }
  const parts: string[] = [];
  // The region and its field symbols — none under a label or an arrow.
  parts.push(`<rect x="${n2(rx0)}" y="${n2(ry0)}" width="${n2(rx1 - rx0)}" height="${n2(ry1 - ry0)}" fill="none" stroke="${MUTED}" stroke-width="1.2" stroke-dasharray="6 4"/>`);
  if (m.showField === 'value') {
    for (let y = cy - 3 * STEP; y <= cy + 3 * STEP + 1e-9; y += STEP) {
      for (let k = -8; k <= 8; k++) {
        const x = cx + STEP / 2 + k * STEP;
        if (x < rx0 || x > rx1 || blocked.some((b) => overlaps(b, { x0: x - 4, y0: y - 4, x1: x + 4, y1: y + 4 }, 1))) continue;
        parts.push(m.field === 'into' ? `<path d="M${n2(x - 3.5)},${n2(y - 3.5)}l7,7m-7,0l7,-7" ${stroke(INK, 1.4)}/>` : `<circle cx="${n2(x)}" cy="${n2(y)}" r="2.4" fill="${INK}"/>`);
      }
    }
  }
  parts.push(`<rect x="${n2(lx0)}" y="${n2(ly0)}" width="${LW}" height="${LH}" fill="none" stroke="${INK}" stroke-width="2.4"/>`);
  parts.push(...over);
  // The caption over the region: the field strength, how it is changing, or the blank for its direction.
  const capY = ry0 - 8;
  if (m.showField === 'blank') {
    const lead = 'field direction:';
    // Set from its END, so the box follows the words closely however wide the words are estimated.
    const end = rx0 + inkWidth(lead, TICK_FS) + 4;
    parts.push(text(end, capY, lead, { anchor: 'end' }), blank(end + 15, capY - TICK_FS * 0.36, 19, TICK_FS + 5, TICK_FS));
    if (m.current !== 'value' || m.sense === 'none') notes.push(BLANK_NOTE('the direction of the field is', m.sense === 'none' ? 'no current is induced' : 'the induced current is not drawn'));
  } else {
    let x = rx0;
    if (q.B.show !== 'none') {
      parts.push(emLabel(q.B, x, capY, 'start'));
      x += emWidth(q.B) + 5;
      if (m.change) parts.push(text(x, capY, `(${m.change})`));
    } else if (m.change) parts.push(text(x, capY, `B ${m.change}`));
  }
  return { svg: parts.join(''), bottom: ry1 + 12 };
}

export function renderInductionLoop(r: Reader, _uid?: string): Drawn {
  const m = inductionModel(r);
  const notes: Notes = [];
  const t = titleBlock(m.title, FIGURE_WIDTH);
  const d = m.variant === 'magnet' ? drawMagnet(m, t.top, notes) : drawField(m, t.top, notes);
  return { body: t.svg + d.svg, H: Math.round(d.bottom), facts: facts(notes) };
}
