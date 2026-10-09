/**
 * free_body_diagram_v2 — one object and its force arrows, drawn here (the
 * older `free_body_diagram` reuses the board renderer, whose labels come
 * loose from their arrows with four or more forces).
 *
 * { object?: { shape?: 'box' | 'block' | 'dot' ('box'); label?: string };
 *   incline?: { angle: degrees (5–60); showAngle?: boolean (true); angleLabel?: string };
 *                                           // the slope rises to the right
 *   surface?: boolean (false);              // level ground under the object (no incline)
 *   forces: Array<{                         // 1–8
 *     label: string;                        // "N", "T", "?" …
 *     direction: degrees (counter-clockwise from the right)
 *              | 'up' | 'down' | 'left' | 'right'
 *              | 'up-slope' | 'down-slope' | 'normal' | 'into-surface';   // need `incline`
 *     magnitude?: number; unit?: string ('N');
 *     showMagnitude?: boolean (true when a magnitude is given) — prints "T = 40 N";
 *     showAngle?: boolean (false);          // an arc from the nearer horizontal
 *     angleFrom?: 'horizontal' | 'vertical' ('horizontal'); angleLabel?: string }>;
 *   lengths?: 'proportional' | 'equal';     // default: proportional when every force
 *                                           //   has a magnitude, else equal
 *   axes?: false | 'standard' | 'incline' (false);   // a small x / y indicator
 *   title?: string }
 *
 * ARROW LENGTHS. 'proportional': length ∝ magnitude (the longest is 74
 * units; one that would come out under 16 units is drawn at 16 and the
 * legibility report says so). SET `lengths: 'equal'` WHEN THE QUESTION ASKS
 * THE STUDENT TO COMPARE OR FIND FORCES — otherwise the picture gives the
 * answer away; hide the sizes with `showMagnitude: false` (or leave the
 * magnitude out) for the same reason.
 *
 * Every label sits at its arrow's tip and is placed clear of the other
 * labels, the arrows and the object.
 */
import { FIGURE_WIDTH, LABEL_FS, SERIES_COLORS, TICK_FS, n2 } from '../plot-frame';
import type { Drawn, FigureFacts, Reader } from '../spec';
import { INK, MUTED, Placer, arcPath, around, arrow, label, layoutText, numText, segmentBoxes, text, textBox, titleBlock, type Box, type Candidate } from './draw';

export interface FbdForce {
  label: string;
  /** Counter-clockwise from the right, 0 ≤ degrees < 360. */
  degrees: number;
  magnitude?: number;
  unit: string;
  showMagnitude: boolean;
  /** What is printed at the tip: "T" or "T = 40 N". */
  shownLabel: string;
  showAngle: boolean;
  angleFrom: 'horizontal' | 'vertical';
  /** What is printed at the angle arc ("35°", "θ"); '' without an arc. */
  shownAngle: string;
  /** The named direction as given, when it was a name. */
  named?: string;
}

export interface FreeBodyModel {
  shape: 'box' | 'block' | 'dot';
  objectLabel?: string;
  incline?: { angle: number; showAngle: boolean; shownAngle: string };
  surface: boolean;
  forces: FbdForce[];
  lengths: 'proportional' | 'equal';
  axes: false | 'standard' | 'incline';
  title?: string;
}

const NAMED: Record<string, number> = { right: 0, up: 90, left: 180, down: 270 };
const SLOPE_NAMED: Record<string, number> = { 'up-slope': 0, normal: 90, 'down-slope': 180, 'into-surface': 270 };
const norm = (d: number): number => Number(((((d % 360) + 360) % 360)).toFixed(6)) % 360;

/** The acute angle between a direction and the nearer horizontal / vertical. */
export function angleFromReference(degrees: number, from: 'horizontal' | 'vertical'): number {
  const d = norm(degrees) % 180;
  const toHorizontal = Math.min(d, 180 - d);
  return Number((from === 'horizontal' ? toHorizontal : 90 - toHorizontal).toFixed(6));
}

export function freeBodyModel(r: Reader): FreeBodyModel {
  const p = r.p;
  const object = p.object === undefined || p.object === null ? {} : r.obj(p.object, 'object');
  const shape = (object.shape ?? 'box') as FreeBodyModel['shape'];
  if (!['box', 'block', 'dot'].includes(shape)) r.fail("object.shape must be 'box', 'block' or 'dot'");
  let incline: FreeBodyModel['incline'];
  if (p.incline !== undefined && p.incline !== null) {
    const inc = r.obj(p.incline, 'incline');
    const angle = r.num(inc.angle, 'incline.angle');
    if (angle < 5 || angle > 60) r.fail('incline.angle must be between 5 and 60 degrees');
    const showAngle = r.bool(inc.showAngle, 'incline.showAngle', true);
    incline = { angle, showAngle, shownAngle: showAngle ? r.optStr(inc.angleLabel, 'incline.angleLabel', 10) ?? `${numText(angle)}°` : '' };
  }
  const forces = r.list(p.forces, 'forces', 1, 8).map((raw, i): FbdForce => {
    const f = r.obj(raw, `forces[${i}]`);
    const at = `forces[${i}]`;
    let degrees: number;
    let named: string | undefined;
    if (typeof f.direction === 'number') degrees = norm(r.num(f.direction, `${at}.direction`));
    else if (typeof f.direction === 'string' && f.direction in NAMED) {
      named = f.direction;
      degrees = NAMED[f.direction];
    } else if (typeof f.direction === 'string' && f.direction in SLOPE_NAMED) {
      if (!incline) return r.fail(`${at}.direction '${f.direction}' needs an incline`);
      named = f.direction;
      degrees = norm(incline.angle + SLOPE_NAMED[f.direction]);
    } else return r.fail(`${at}.direction must be an angle in degrees or one of ${[...Object.keys(NAMED), ...Object.keys(SLOPE_NAMED)].join(', ')}`);
    const label = r.str(f.label, `${at}.label`, 20);
    const magnitude = f.magnitude === undefined || f.magnitude === null ? undefined : r.positive(f.magnitude, `${at}.magnitude`);
    const unit = r.optStr(f.unit, `${at}.unit`, 8) ?? 'N';
    const showMagnitude = r.bool(f.showMagnitude, `${at}.showMagnitude`, magnitude !== undefined);
    if (showMagnitude && magnitude === undefined) r.fail(`${at}.showMagnitude needs a magnitude`);
    const showAngle = r.bool(f.showAngle, `${at}.showAngle`, false);
    const angleFrom = (f.angleFrom ?? 'horizontal') as FbdForce['angleFrom'];
    if (angleFrom !== 'horizontal' && angleFrom !== 'vertical') r.fail(`${at}.angleFrom must be 'horizontal' or 'vertical'`);
    const ang = angleFromReference(degrees, angleFrom);
    if (showAngle && (ang < 8 || ang > 82)) r.fail(`${at}.showAngle: the arrow is within 8° of the ${ang < 8 ? angleFrom : angleFrom === 'horizontal' ? 'vertical' : 'horizontal'} — there is no room for an angle arc`);
    return {
      label, degrees, magnitude, unit, showMagnitude,
      shownLabel: showMagnitude ? `${label} = ${numText(magnitude as number, 3)} ${unit}` : label,
      showAngle, angleFrom,
      shownAngle: showAngle ? r.optStr(f.angleLabel, `${at}.angleLabel`, 10) ?? `${numText(ang, 1)}°` : '',
      named,
    };
  });
  const allSized = forces.every((f) => f.magnitude !== undefined);
  const lengths = (p.lengths ?? (allSized ? 'proportional' : 'equal')) as FreeBodyModel['lengths'];
  if (lengths !== 'proportional' && lengths !== 'equal') r.fail("lengths must be 'proportional' or 'equal'");
  if (lengths === 'proportional' && !allSized) r.fail("lengths: 'proportional' — every force needs a magnitude (or use lengths: 'equal')");
  const axes = (p.axes ?? false) as FreeBodyModel['axes'];
  if (axes !== false && axes !== 'standard' && axes !== 'incline') r.fail("axes must be false, 'standard' or 'incline'");
  if (axes === 'incline' && !incline) r.fail("axes: 'incline' needs an incline");
  const surface = r.bool(p.surface, 'surface', false);
  if (surface && incline) r.fail('give surface or incline, not both');
  return { shape, objectLabel: r.optStr(object.label, 'object.label', 16), incline, surface, forces, lengths, axes, title: r.optStr(p.title, 'title', 160) };
}

const L_MAX = 74;
const L_MIN = 16;
const L_EQUAL = 56;

/** Arrow lengths (viewBox units), and which arrows had to be drawn longer than to scale. */
export function fbdLayout(m: FreeBodyModel): { lengths: number[]; floored: number[] } {
  if (m.lengths === 'equal') return { lengths: m.forces.map(() => L_EQUAL), floored: [] };
  const max = Math.max(...m.forces.map((f) => f.magnitude as number));
  const floored: number[] = [];
  const lengths = m.forces.map((f, i) => {
    const l = (L_MAX * (f.magnitude as number)) / max;
    if (l < L_MIN) {
      floored.push(i);
      return L_MIN;
    }
    return l;
  });
  return { lengths, floored };
}

export function renderFreeBody(r: Reader): Drawn {
  const m = freeBodyModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const { lengths, floored } = fbdLayout(m);
  const notes: NonNullable<FigureFacts['notes']> = [];
  for (const i of floored) notes.push({ code: 'not_to_scale', message: `forces[${i}] ("${m.forces[i].label}") is under ${Math.round((L_MIN / L_MAX) * 100)} % of the largest force — its arrow is drawn at the minimum length, longer than to scale` });
  const theta = m.incline ? (m.incline.angle * Math.PI) / 180 : 0;
  const hw = m.shape === 'block' ? 36 : m.shape === 'dot' ? 5 : 21;
  const hh = m.shape === 'block' ? 18 : m.shape === 'dot' ? 5 : 21;
  const cx = W / 2;

  /** One pass with the object's centre at (cx, cy); returns the vertical extent used. */
  const draw = (cy: number): { svg: string; minY: number; maxY: number } => {
    const placer = new Placer({ x0: 4, y0: -1e6, x1: W - 4, y1: 1e6 });
    const boxes: Box[] = [];
    const keep = (...b: Box[]) => {
      boxes.push(...b);
      placer.block(...b);
    };
    const under: string[] = [];
    const shapes: string[] = [];
    const arrows: string[] = [];
    const labels: string[] = [];
    // Object frame: u along the surface (up-slope), n out of it. Screen y is down.
    const ux = Math.cos(theta);
    const uy = -Math.sin(theta);
    const nx = -Math.sin(theta);
    const ny = -Math.cos(theta);
    const corner = (a: number, b: number): [number, number] => [cx + a * ux + b * nx, cy + a * uy + b * ny];

    if (m.incline) {
      const [ax, ay] = corner(-118, -hh);
      const [bx, by] = corner(104, -hh);
      under.push(`<polygon points="${n2(ax)},${n2(ay)} ${n2(bx)},${n2(by)} ${n2(bx)},${n2(ay)}" fill="#f1f5f9" stroke="${MUTED}" stroke-width="1.4" stroke-linejoin="round"/>`);
      keep(...segmentBoxes(ax, ay, bx, by, 2), ...segmentBoxes(ax, ay, bx, ay, 2));
      if (m.incline.showAngle) {
        under.push(`<path d="${arcPath(ax, ay, 30, 0, theta)}" fill="none" stroke="${INK}" stroke-width="1.1"/>`);
        const lx = ax + 36 * Math.cos(theta / 2);
        const ly = ay - 36 * Math.sin(theta / 2) + TICK_FS * 0.36;
        labels.push(text(lx, ly, m.incline.shownAngle, { weight: 600, halo: true }));
        keep(textBox(lx, ly, m.incline.shownAngle, TICK_FS));
      }
    } else if (m.surface) {
      const y = cy + hh;
      const ticks: string[] = [];
      for (let x = cx - 96; x <= cx + 96; x += 12) ticks.push(`M${n2(x)},${n2(y)}l-6,7`);
      under.push(`<path d="M${n2(cx - 104)},${n2(y)}H${n2(cx + 104)}" fill="none" stroke="${MUTED}" stroke-width="1.6"/><path d="${ticks.join('')}" fill="none" stroke="${MUTED}" stroke-width="1"/>`);
      keep(...segmentBoxes(cx - 104, y + 2, cx + 104, y + 2, 4));
    }
    if (m.shape === 'dot') {
      shapes.push(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="5" fill="${INK}"/>`);
    } else {
      const pts = [corner(-hw, -hh), corner(hw, -hh), corner(hw, hh), corner(-hw, hh)];
      shapes.push(`<polygon points="${pts.map((q) => `${n2(q[0])},${n2(q[1])}`).join(' ')}" fill="#ffffff" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`);
    }
    const ext = Math.abs(hw * ux) + Math.abs(hh * nx);
    const exy = Math.abs(hw * uy) + Math.abs(hh * ny);
    keep({ x0: cx - ext, y0: cy - exy, x1: cx + ext, y1: cy + exy });
    if (m.objectLabel) {
      if (m.shape === 'dot') {
        // Placed after the arrows, beside the dot.
      } else {
        labels.push(text(cx, cy + TICK_FS * 0.36, m.objectLabel, { anchor: 'middle', fill: MUTED }));
      }
    }

    // Arrows that share a direction are set side by side, not on top of each other.
    const offsets = m.forces.map((f, i) => {
      const same = m.forces.map((g, j) => (Math.abs(((g.degrees - f.degrees + 540) % 360) - 180) < 4 ? j : -1)).filter((j) => j >= 0);
      return same.length > 1 ? (same.indexOf(i) - (same.length - 1) / 2) * 13 : 0;
    });
    const geom = m.forces.map((f, i) => {
      const a = (f.degrees * Math.PI) / 180;
      const dx = Math.cos(a);
      const dy = -Math.sin(a);
      // Where the ray from the centre leaves the object (in the object's own frame).
      let start = 5;
      if (m.shape !== 'dot') {
        const du = dx * ux + dy * uy;
        const dn = dx * nx + dy * ny;
        start = Math.min(Math.abs(du) > 1e-9 ? hw / Math.abs(du) : Infinity, Math.abs(dn) > 1e-9 ? hh / Math.abs(dn) : Infinity);
      }
      const ox = -dy * offsets[i];
      const oy = dx * offsets[i];
      const x1 = cx + dx * start + ox;
      const y1 = cy + dy * start + oy;
      return { dx, dy, x1, y1, x2: x1 + dx * lengths[i], y2: y1 + dy * lengths[i] };
    });
    geom.forEach((g) => keep(...segmentBoxes(g.x1, g.y1, g.x2, g.y2, 3)));
    m.forces.forEach((f, i) => {
      const g = geom[i];
      const color = SERIES_COLORS[i % SERIES_COLORS.length];
      arrows.push(arrow(g.x1, g.y1, g.x2, g.y2, { color, width: 2.6, head: 10 }));
      if (f.showAngle) {
        // The reference: the nearer horizontal (or vertical) through the arrow's foot.
        const quarter = f.angleFrom === 'horizontal' ? (Math.cos((f.degrees * Math.PI) / 180) >= 0 ? 0 : 180) : Math.sin((f.degrees * Math.PI) / 180) >= 0 ? 90 : 270;
        const ra = (quarter * Math.PI) / 180;
        let sweep = ((f.degrees - quarter + 540) % 360) - 180;
        sweep = (sweep * Math.PI) / 180;
        const rx = g.x1 + 40 * Math.cos(ra);
        const ry = g.y1 - 40 * Math.sin(ra);
        under.push(`<path d="M${n2(g.x1)},${n2(g.y1)}L${n2(rx)},${n2(ry)}" fill="none" stroke="${MUTED}" stroke-width="1" stroke-dasharray="4 3"/>`);
        arrows.push(`<path d="${arcPath(g.x1, g.y1, 24, ra, ra + sweep)}" fill="none" stroke="${INK}" stroke-width="1.1"/>`);
        keep(...segmentBoxes(g.x1, g.y1, rx, ry, 2));
        const mid = ra + sweep / 2;
        const cands: Candidate[] = [34, 40, 48].map((d) => ({ x: g.x1 + d * Math.cos(mid), y: g.y1 - d * Math.sin(mid) + TICK_FS * 0.36, anchor: Math.cos(mid) > 0.3 ? 'start' : Math.cos(mid) < -0.3 ? 'end' : 'middle' }));
        const c = placer.place(f.shownAngle, TICK_FS, cands);
        boxes.push(c.box);
        labels.push(text(c.x, c.y, f.shownAngle, { anchor: c.anchor, weight: 600, halo: true }));
      }
    });
    m.forces.forEach((f, i) => {
      const g = geom[i];
      const color = SERIES_COLORS[i % SERIES_COLORS.length];
      const c = placer.place(layoutText(f.shownLabel), LABEL_FS, around(g.x2, g.y2, LABEL_FS, g.dx, g.dy, [6, 10, 15, 22]));
      if (!c.clean) notes.push({ code: 'labels_overlap', message: `forces[${i}]: there is no clear place for "${f.shownLabel}" at its arrow's tip` });
      boxes.push(c.box);
      labels.push(label(c, f.shownLabel, { fs: LABEL_FS, weight: 700, fill: color, halo: true }));
    });
    if (m.objectLabel && m.shape === 'dot') {
      const c = placer.place(m.objectLabel, TICK_FS, around(cx, cy, TICK_FS, 0.7, 0.7, [10, 16, 24]));
      boxes.push(c.box);
      labels.push(text(c.x, c.y, m.objectLabel, { anchor: c.anchor, fill: MUTED, halo: true }));
    }
    let minY = Math.min(...boxes.map((b) => b.y0));
    let maxY = Math.max(...boxes.map((b) => b.y1));
    if (m.axes) {
      // A small indicator in the lower-left corner, below everything when that corner is taken.
      const a = m.axes === 'incline' ? theta : 0;
      const size = 26;
      const corner0 = { x0: 6, y0: maxY - 44, x1: 62, y1: maxY + 2 };
      const taken = boxes.some((b) => b.x0 < corner0.x1 && b.x1 > corner0.x0 && b.y0 < corner0.y1 && b.y1 > corner0.y0);
      const oy = taken ? maxY + 40 : maxY - 8;
      const ox = 22;
      const ex: [number, number] = [ox + size * Math.cos(a), oy - size * Math.sin(a)];
      const ey: [number, number] = [ox - size * Math.sin(a), oy - size * Math.cos(a)];
      arrows.push(arrow(ox, oy, ex[0], ex[1], { color: MUTED, width: 1.3, head: 6 }), arrow(ox, oy, ey[0], ey[1], { color: MUTED, width: 1.3, head: 6 }));
      labels.push(text(ex[0] + 4, ex[1] + 4, 'x', { fill: MUTED, italic: true }), text(ey[0] - 3, ey[1] - 4, 'y', { fill: MUTED, italic: true, anchor: 'middle' }));
      minY = Math.min(minY, ey[1] - 16);
      maxY = Math.max(maxY, oy + 6, ex[1] + 8);
    }
    return { svg: under.join('') + shapes.join('') + arrows.join('') + labels.join(''), minY, maxY };
  };

  const first = draw(0);
  const cy = t.top + 6 - first.minY;
  // The notes were collected in the first pass; the second repeats the same layout, shifted.
  const kept = [...notes];
  const second = draw(cy);
  notes.length = 0;
  notes.push(...kept);
  return { body: t.svg + second.svg, H: second.maxY + 10, facts: { curveCount: 0, marks: [], curves: [], notes } };
}
