/**
 * ray_diagram — a thin lens or a spherical mirror on its principal axis with
 * the object, the principal rays and the image; or a ray meeting a plane
 * interface between two media.
 *
 * Lens / mirror (the object is on the left, light travels left to right):
 * { element: 'converging_lens' | 'diverging_lens' | 'concave_mirror' | 'convex_mirror';
 *   focalLength: number;                 // its size (> 0); the sign comes from the element
 *   objectDistance: number;              // > 0
 *   objectHeight?: number;               // default a third of the focal length
 *   unit?: string ('cm');
 *   rays?: 'all' | 'none' | Array<1 | 2 | 3>;     // ('all') the principal rays:
 *                                        //   1 parallel to the axis; 2 through the centre of a lens /
 *                                        //   through (or towards) F of a mirror; 3 through (or towards)
 *                                        //   F of a lens / to the vertex of a mirror
 *   showImage?: boolean (true);          // the image arrow: solid when real, dashed when virtual
 *   show?: { objectDistance?, imageDistance?, focalLength?, objectHeight?, imageHeight?:
 *            'value' | 'blank' | 'none' };        // ('none') dimension lines under the figure, heights beside the arrows
 *   focalMarks?: boolean (true);         // F and 2F on both sides of a lens; F and C of a mirror
 *   title?: string }
 * The horizontal and vertical scales differ (as in any ray diagram); the
 * construction is exact in each. Refused when the image would be more than
 * five times the object's size or further than six focal lengths away.
 *
 * Plane interface (light arrives from the upper left):
 * { element: 'interface';
 *   n1: number; n2: number;              // refractive indices, upper and lower medium (≥ 1)
 *   incidentAngle: number;               // degrees from the normal, 1–89
 *   media?: [string, string];            // names printed in the two media
 *   show?: { n1?, n2?: 'value' | 'blank' | 'none' ('value') };
 *   reflected?: boolean (false); refracted?: boolean (true);
 *   angleLabels?: { incident?, reflected?, refracted?: 'auto' | string | '?' | null };
 *                                        // ('auto' incident, nothing else) an arc from the normal with the label
 *   title?: string }
 * Total internal reflection: no refracted ray is drawn (and `refracted: true`
 * with nothing else to draw is refused).
 */
import { FIGURE_WIDTH, SERIES_COLORS, TICK_FS, esc, estWidth, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, arcPath, text, titleBlock } from './draw';
import { SHOWS, deg, facts, head, lab, numStr, polyPath, stroke, type Notes, type Pt, type Show } from './draw2';

export const RAY_ELEMENTS = ['converging_lens', 'diverging_lens', 'concave_mirror', 'convex_mirror', 'interface'] as const;
export type RayElement = (typeof RAY_ELEMENTS)[number];

export interface OpticsModel {
  element: Exclude<RayElement, 'interface'>;
  mirror: boolean;
  /** Signed focal length: + converging lens / concave mirror. */
  f: number;
  dO: number;
  hO: number;
  /** Signed image distance: + real (far side of a lens, object side of a mirror); Infinity when the object is at F. */
  dI: number;
  hI: number;
  magnification: number;
  real: boolean;
  upright: boolean;
  unit: string;
  rays: number[];
  showImage: boolean;
  show: Record<'objectDistance' | 'imageDistance' | 'focalLength' | 'objectHeight' | 'imageHeight', Show>;
  focalMarks: boolean;
  title?: string;
}
export interface InterfaceModel {
  element: 'interface';
  n1: number;
  n2: number;
  theta1: number;
  /** Degrees; null on total internal reflection. */
  theta2: number | null;
  /** Degrees; null when n1 ≤ n2. */
  critical: number | null;
  media: [string, string] | null;
  showN: [Show, Show];
  reflected: boolean;
  refracted: boolean;
  labels: { incident: string | null; reflected: string | null; refracted: string | null };
  title?: string;
}
export type RayModel = OpticsModel | InterfaceModel;

export function rayModel(r: Reader): RayModel {
  const p = r.p;
  if (!RAY_ELEMENTS.includes(p.element as RayElement)) r.fail(`element must be one of ${RAY_ELEMENTS.join(', ')}`);
  const element = p.element as RayElement;
  const title = r.optStr(p.title, 'title', 160);
  const showObj = p.show === undefined || p.show === null ? {} : r.obj(p.show, 'show');
  const showOf = (k: string, dflt: Show): Show => {
    const v = showObj[k];
    if (v === undefined || v === null) return dflt;
    if (!SHOWS.includes(v as Show)) r.fail(`show.${k} must be 'value', 'blank' or 'none'`);
    return v as Show;
  };
  if (element === 'interface') {
    const n1 = r.num(p.n1, 'n1');
    const n2v = r.num(p.n2, 'n2');
    if (n1 < 1 || n2v < 1 || n1 > 4 || n2v > 4) r.fail('n1 and n2 must be between 1 and 4');
    const theta1 = r.num(p.incidentAngle, 'incidentAngle');
    if (theta1 < 1 || theta1 > 89) r.fail('incidentAngle must be between 1 and 89 degrees (measured from the normal)');
    const s = (n1 * Math.sin(deg(theta1))) / n2v;
    const theta2 = s >= 1 ? null : (Math.asin(s) * 180) / Math.PI;
    const reflected = r.bool(p.reflected, 'reflected', false);
    const refracted = r.bool(p.refracted, 'refracted', true) && theta2 !== null;
    if (theta2 === null && !reflected) r.fail(`incidentAngle: at ${theta1}° the light is totally internally reflected (n1 sin θ1 > n2) — there is no refracted ray; set reflected: true`);
    const lo = p.angleLabels === undefined || p.angleLabels === null ? {} : r.obj(p.angleLabels, 'angleLabels');
    const one = (k: string, auto: string, dflt: string | null): string | null => (lo[k] === undefined ? dflt : lo[k] === null ? null : lo[k] === 'auto' ? auto : r.str(lo[k], `angleLabels.${k}`, 14));
    const a1 = `${numStr(theta1, 1)}°`;
    let media: [string, string] | null = null;
    if (p.media !== undefined && p.media !== null) media = r.list(p.media, 'media', 2, 2).map((x, i) => r.str(x, `media[${i}]`, 16)) as [string, string];
    return {
      element, n1, n2: n2v, theta1, theta2, critical: n1 > n2v ? (Math.asin(n2v / n1) * 180) / Math.PI : null, media,
      showN: [showOf('n1', 'value'), showOf('n2', 'value')], reflected, refracted,
      labels: { incident: one('incident', a1, a1), reflected: reflected ? one('reflected', a1, null) : null, refracted: refracted ? one('refracted', `${numStr(theta2 as number, 1)}°`, null) : null },
      title,
    };
  }
  const fMag = r.positive(p.focalLength, 'focalLength');
  const dO = r.positive(p.objectDistance, 'objectDistance');
  const hO = p.objectHeight === undefined || p.objectHeight === null ? fMag / 3 : r.positive(p.objectHeight, 'objectHeight');
  const f = element === 'converging_lens' || element === 'concave_mirror' ? fMag : -fMag;
  const atF = Math.abs(dO - f) < 1e-9;
  const dI = atF ? Infinity : 1 / (1 / f - 1 / dO);
  const mag = atF ? Infinity : -dI / dO;
  let rays: number[] = [1, 2, 3];
  if (p.rays === 'none') rays = [];
  else if (p.rays !== undefined && p.rays !== null && p.rays !== 'all') {
    rays = r.list(p.rays, 'rays', 0, 3).map((x, i) => {
      if (x !== 1 && x !== 2 && x !== 3) r.fail(`rays[${i}] must be 1, 2 or 3`);
      return x as number;
    });
  }
  const showImage = r.bool(p.showImage, 'showImage', true);
  const show = {
    objectDistance: showOf('objectDistance', 'none'), imageDistance: showOf('imageDistance', 'none'), focalLength: showOf('focalLength', 'none'),
    objectHeight: showOf('objectHeight', 'none'), imageHeight: showOf('imageHeight', 'none'),
  };
  const needsImage = showImage || rays.length > 0 || show.imageDistance !== 'none' || show.imageHeight !== 'none';
  if (needsImage && atF) r.fail('objectDistance equals the focal length: the image is at infinity and cannot be drawn');
  if (needsImage && (Math.abs(mag) > 5 || Math.abs(dI) > 6 * fMag)) r.fail(`the image would be ${numStr(Math.abs(mag), 1)} times the object's size, ${numStr(Math.abs(dI), 1)} from the ${element.endsWith('lens') ? 'lens' : 'mirror'} — too large or too far to draw (move the object further from F)`);
  return {
    element, mirror: element.endsWith('mirror'), f, dO, hO, dI, hI: mag * hO, magnification: mag, real: dI > 0, upright: mag > 0,
    unit: r.optStr(p.unit, 'unit', 4) ?? 'cm', rays, showImage, show, focalMarks: r.bool(p.focalMarks, 'focalMarks', true), title,
  };
}

/** "d" with a small lowered letter, then the rest — `d<sub>o</sub> = 30 cm` — on a white plate. */
function subLabel(x: number, y: number, sym: string, sub: string, rest: string, anchor: 'start' | 'middle' | 'end' = 'middle'): string {
  const w = estWidth(sym + rest, TICK_FS) * 0.86 + (sub ? 5 : 0) + 6;
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'start' ? x - 3 : x - w + 3;
  return `<rect x="${n2(x0)}" y="${n2(y - TICK_FS + 1)}" width="${n2(w)}" height="${TICK_FS + 4}" fill="#ffffff"/>`
    + `<text x="${n2(x)}" y="${n2(y)}" font-size="${TICK_FS}" text-anchor="${anchor}" fill="${INK}">`
    + `<tspan font-style="italic">${esc(sym)}</tspan>${sub ? `<tspan font-size="8" dy="3">${esc(sub)}</tspan><tspan dy="-3">${esc(rest)}</tspan>` : esc(rest)}</text>`;
}

function renderInterface(m: InterfaceModel, W: number, t: { svg: string; top: number }): Drawn {
  const notes: Notes = [];
  const parts: string[] = [];
  const xc = W / 2;
  const half = 96;
  const yc = t.top + half + 6;
  const L = 92;
  parts.push(`<rect x="14" y="${n2(yc)}" width="${W - 28}" height="${half}" fill="#e8edf3"/>`);
  parts.push(`<path d="M14,${n2(yc)}H${W - 14}" ${stroke(INK, 2)}/>`);
  parts.push(`<path d="M${n2(xc)},${n2(yc - half)}V${n2(yc + half)}" ${stroke(MUTED, 1.1, '5 4')}/>`);
  parts.push(text(xc + 4, yc - half + 10, 'normal', { fill: MUTED }));
  const ray = (ang: number, up: boolean, towards: boolean, side: -1 | 1, color: string, dash?: string) => {
    const ex = xc + side * L * Math.sin(deg(ang));
    const ey = yc + (up ? -1 : 1) * L * Math.cos(deg(ang));
    parts.push(`<path d="${polyPath([[ex, ey], [xc, yc]])}" ${stroke(color, 2, dash)}/>`);
    const mx = (ex + xc) / 2;
    const my = (ey + yc) / 2;
    parts.push(towards ? head(mx + (xc - ex) * 0.06, my + (yc - ey) * 0.06, xc - ex, yc - ey, 9, color) : head(mx + (ex - xc) * 0.06, my + (ey - yc) * 0.06, ex - xc, ey - yc, 9, color));
  };
  /** An arc from the normal to a ray at `ang`, with its label on the far side of the ray from the normal. */
  const mark = (ang: number, up: boolean, side: -1 | 1, label: string | null, rr: number) => {
    if (label === null) return;
    const base = up ? Math.PI / 2 : -Math.PI / 2;
    const dir = up ? -side : side;
    parts.push(`<path d="${arcPath(xc, yc, rr, base, base + dir * deg(ang))}" ${stroke(INK, 1.3)}/>`);
    // Inside the angle when it is wide enough to hold the text, else just outside the ray.
    if (ang >= 38) {
      const a = base + dir * deg(ang / 2);
      parts.push(lab(xc + (rr + 16) * Math.cos(a), yc - (rr + 16) * Math.sin(a) + 4, label, 'middle', { fs: 12, halo: true }));
    } else {
      const a = base + dir * deg(ang + 9);
      const right = Math.cos(a) > 0;
      parts.push(lab(xc + (rr + 12) * Math.cos(a) + (right ? 3 : -3), yc - (rr + 12) * Math.sin(a) + 4, label, right ? 'start' : 'end', { fs: 12, halo: true }));
    }
  };
  ray(m.theta1, true, true, -1, INK);
  if (m.reflected) ray(m.theta1, true, false, 1, INK);
  if (m.refracted && m.theta2 !== null) ray(m.theta2, false, false, 1, INK);
  mark(m.theta1, true, -1, m.labels.incident, 30);
  if (m.reflected) mark(m.theta1, true, 1, m.labels.reflected, 30);
  if (m.refracted && m.theta2 !== null) mark(m.theta2, false, 1, m.labels.refracted, 34);
  const medium = (i: 0 | 1, y: number) => {
    const n = i === 0 ? m.n1 : m.n2;
    const idx = m.showN[i] === 'none' ? '' : `n = ${m.showN[i] === 'blank' ? '?' : n.toFixed(2)}`;
    const name = m.media ? m.media[i] : '';
    if (name) parts.push(text(20, y, name, { fs: 12, weight: 600 }));
    if (idx) parts.push(text(20, y + (name ? 15 : 0), idx, { fs: 12 }));
  };
  medium(0, yc - half + 14);
  medium(1, yc + half - (m.media && m.showN[1] !== 'none' ? 24 : 9));
  if (m.reflected && m.labels.reflected === null && m.labels.incident === null && !m.refracted) notes.push({ code: 'ambiguous_blank', message: 'angleLabels: no angle is labelled — nothing fixes the rays' });
  return { body: t.svg + parts.join(''), H: yc + half + 10, facts: facts(notes) };
}

export function renderRayDiagram(r: Reader): Drawn {
  const m = rayModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  if (m.element === 'interface') return renderInterface(m, W, t);
  const notes: Notes = [];
  const fa = Math.abs(m.f);
  const imageX = m.mirror ? -m.dI : m.dI;
  const needsImage = m.showImage || m.rays.length > 0 || m.show.imageDistance !== 'none';
  // Horizontal extent in object units.
  const xs = [-m.dO, 0];
  if (needsImage) xs.push(imageX);
  if (m.focalMarks || m.show.focalLength !== 'none') {
    if (m.mirror) xs.push(m.f > 0 ? -2 * fa : 2 * fa);
    else xs.push(-2 * fa, 2 * fa);
  }
  let x0 = Math.min(...xs);
  let x1 = Math.max(...xs);
  const pad = (x1 - x0) * 0.09;
  x0 -= pad;
  x1 += m.mirror ? Math.max(pad, (x1 - x0) * 0.08) : pad;
  const left = 14;
  const right = W - 14;
  const X = (v: number) => left + ((v - x0) / (x1 - x0)) * (right - left);
  const yMax = Math.max(m.hO, needsImage ? Math.abs(m.hI) : 0) * 1.28;
  const half = 78;
  const yAxis = t.top + half + 4;
  const Y = (v: number) => yAxis - (v / yMax) * half;
  const parts: string[] = [];
  const under: string[] = [];
  /** Labels: drawn last, over the rays. */
  const over: string[] = [];
  // Axis.
  parts.push(`<path d="M${left},${n2(yAxis)}H${right}" ${stroke(MUTED, 1.1)}/>`);
  // The element.
  const eh = half - 2;
  const ex = X(0);
  if (m.element === 'converging_lens') under.push(`<path d="M${n2(ex)},${n2(yAxis - eh)}Q${n2(ex + 13)},${n2(yAxis)} ${n2(ex)},${n2(yAxis + eh)}Q${n2(ex - 13)},${n2(yAxis)} ${n2(ex)},${n2(yAxis - eh)}z" fill="#e8edf3" stroke="${MUTED}" stroke-width="1.4"/>`);
  else if (m.element === 'diverging_lens') under.push(`<path d="M${n2(ex - 8)},${n2(yAxis - eh)}H${n2(ex + 8)}Q${n2(ex + 1)},${n2(yAxis)} ${n2(ex + 8)},${n2(yAxis + eh)}H${n2(ex - 8)}Q${n2(ex - 1)},${n2(yAxis)} ${n2(ex - 8)},${n2(yAxis - eh)}z" fill="#e8edf3" stroke="${MUTED}" stroke-width="1.4"/>`);
  else {
    // A shallow arc; the short strokes are on the back (non-reflecting) side.
    const sag = m.f > 0 ? -1 : 1;
    const pts: Pt[] = [];
    const back: string[] = [];
    for (let i = -8; i <= 8; i++) {
      const y = (i / 8) * eh;
      const x = ex + sag * 10 * (i / 8) ** 2;
      pts.push([x, yAxis + y]);
      if (i > -8 && i < 8) back.push(`M${n2(x)},${n2(yAxis + y)}l6,5`);
    }
    under.push(`<path d="${back.join('')}" ${stroke(MUTED, 1)}/><path d="${polyPath(pts)}" ${stroke(INK, 2.2)}/>`);
  }
  // Focal marks.
  const marks: Array<[number, string]> = [];
  if (m.focalMarks) {
    if (m.mirror) marks.push([m.f > 0 ? -fa : fa, 'F'], [m.f > 0 ? -2 * fa : 2 * fa, 'C']);
    else marks.push([-fa, 'F'], [fa, 'F'], [-2 * fa, '2F'], [2 * fa, '2F']);
  }
  for (const [v, name] of marks) {
    const x = X(v);
    parts.push(`<circle cx="${n2(x)}" cy="${n2(yAxis)}" r="2.6" fill="${INK}"/>`);
    // Under the axis, or over it when an arrow stands (or hangs) there.
    const blockedBelow = Math.abs(x - X(imageX)) < 12 && m.showImage && m.hI < 0;
    const blockedAbove = Math.abs(x - X(-m.dO)) < 12 || (Math.abs(x - X(imageX)) < 12 && m.showImage && m.hI > 0);
    const y = blockedBelow && !blockedAbove ? yAxis - 7 : yAxis + 14;
    if (blockedBelow && blockedAbove) notes.push({ code: 'labels_overlap', message: `the mark "${name}" falls on both arrows` });
    over.push(text(x, y, name, { anchor: 'middle', weight: 600, halo: true }));
  }
  // Rays.
  const tip: Pt = [-m.dO, m.hO];
  const img: Pt = [imageX, m.hI];
  const C = (q: Pt): Pt => [X(q[0]), Y(q[1])];
  /** The point where the ray from a through b, continued past b, leaves the drawing. */
  const exit = (a: Pt, b: Pt): Pt => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    let tt = Infinity;
    if (dx > 0) tt = Math.min(tt, (x1 - a[0]) / dx);
    if (dx < 0) tt = Math.min(tt, (x0 - a[0]) / dx);
    const yLim = yMax * 0.98;
    if (dy > 0) tt = Math.min(tt, (yLim - a[1]) / dy);
    if (dy < 0) tt = Math.min(tt, (-yLim - a[1]) / dy);
    return [a[0] + dx * tt, a[1] + dy * tt];
  };
  const rayLine = (a: Pt, b: Pt, color: string, dash: boolean, arrowAt?: number) => {
    const ca = C(a);
    const cb = C(b);
    parts.push(`<path d="${polyPath([ca, cb])}" ${stroke(color, dash ? 1.2 : 1.7, dash ? '4 3' : undefined)}/>`);
    if (arrowAt !== undefined && Math.hypot(cb[0] - ca[0], cb[1] - ca[1]) > 22) parts.push(head(ca[0] + (cb[0] - ca[0]) * arrowAt, ca[1] + (cb[1] - ca[1]) * arrowAt, cb[0] - ca[0], cb[1] - ca[1], 7.5, color));
  };
  m.rays.forEach((k) => {
    const color = SERIES_COLORS[k - 1];
    const hit: Pt = [0, k === 1 ? m.hO : (m.mirror ? k === 3 : k === 2) ? 0 : m.hI];
    rayLine(tip, hit, color, false, 0.55);
    // Outgoing: through the real image, or away from the virtual one.
    const away: Pt = m.real ? img : [hit[0] + (hit[0] - img[0]), hit[1] + (hit[1] - img[1])];
    const horizontal = Math.abs(hit[1] - img[1]) < 1e-9;
    const dirX = m.mirror ? -1 : 1;
    const through: Pt = horizontal ? [hit[0] + dirX, hit[1]] : away;
    rayLine(hit, exit(hit, through), color, false, 0.5);
    if (!m.real) {
      // Traced back (dashed) to where it seems to come from.
      const centreRay = !m.mirror && k === 2;
      if (!centreRay) rayLine(hit, img, color, true);
      else if (Math.abs(img[0]) > m.dO) rayLine(tip, img, color, true);
    }
    // A ray aimed at a focal point behind the element: its aim, dashed.
    const aimed = (m.element === 'diverging_lens' && k === 3) ? [fa, 0] as Pt : (m.element === 'convex_mirror' && k === 2) ? [fa, 0] as Pt : null;
    if (aimed) rayLine(hit, aimed, color, true);
    const from = (m.element === 'diverging_lens' && k === 1) ? [-fa, 0] as Pt : (m.element === 'convex_mirror' && k === 1) ? [fa, 0] as Pt : null;
    if (from) rayLine(img, from, color, true);
  });
  // Object and image arrows.
  const arrowUp = (x: number, h: number, dashed: boolean) => {
    const xa = X(x);
    const yb = Y(h);
    const dir = h > 0 ? -1 : 1;
    parts.push(`<path d="M${n2(xa)},${n2(yAxis)}V${n2(yb - dir * 6)}" ${stroke(INK, 2.6, dashed ? '5 3' : undefined)}/>` + head(xa, yb, 0, dir, 10));
  };
  arrowUp(-m.dO, m.hO, false);
  if (m.showImage) arrowUp(imageX, m.hI, !m.real);
  const hLabel = (x: number, h: number, show: Show, sym: string) => {
    if (show === 'none') return;
    const s = `${sym} = ${show === 'blank' ? '?' : `${numStr(Math.abs(h), 2)} ${m.unit}`}`;
    const leftSide = X(x) > 70;
    // On a white plate: a ray that runs behind the label is interrupted, not struck through it.
    const w = estWidth(s, TICK_FS) * 0.9 + 6;
    const tx = X(x) + (leftSide ? -7 : 7);
    const ty = (Y(h) + yAxis) / 2 + 4;
    over.push(`<rect x="${n2(leftSide ? tx - w + 3 : tx - 3)}" y="${n2(ty - TICK_FS + 1)}" width="${n2(w)}" height="${TICK_FS + 4}" fill="#ffffff"/>` + text(tx, ty, s, { anchor: leftSide ? 'end' : 'start' }));
  };
  hLabel(-m.dO, m.hO, m.show.objectHeight, 'h');
  if (m.showImage) hLabel(imageX, m.hI, m.show.imageHeight, "h'");
  // Dimension lines under the figure.
  let y = yAxis + half + 14;
  const dim = (a: number, b: number, show: Show, sub: string, value: number, sym = 'd') => {
    if (show === 'none') return;
    const [xa, xb] = [X(Math.min(a, b)), X(Math.max(a, b))];
    const tick = (x: number) => `M${n2(x)},${n2(y - 4)}v8`;
    parts.push(`<path d="M${n2(xa)},${n2(y)}H${n2(xb)}${tick(xa)}${tick(xb)}" ${stroke(MUTED, 1)}/>`);
    const rest = ` = ${show === 'blank' ? '?' : `${numStr(Math.abs(value), 2)} ${m.unit}`}`;
    const need = estWidth(sym + rest, TICK_FS) + 22;
    // A span too short to hold its label carries it at one end.
    if (xb - xa >= need) over.push(subLabel((xa + xb) / 2, y + 4, sym, sub, rest));
    else if (xb + 8 + need < W) over.push(subLabel(xb + 9, y + 4, sym, sub, rest, 'start'));
    else over.push(subLabel(xa - 9, y + 4, sym, sub, rest, 'end'));
    y += 19;
  };
  dim(-m.dO, 0, m.show.objectDistance, 'o', m.dO);
  if (m.show.imageDistance !== 'none') dim(0, imageX, m.show.imageDistance, 'i', m.dI);
  dim(0, m.mirror ? (m.f > 0 ? -fa : fa) : fa, m.show.focalLength, '', fa, 'f');
  if (!m.showImage && m.rays.length === 0 && m.show.focalLength === 'none' && !m.focalMarks) notes.push({ code: 'ambiguous_blank', message: 'neither the focal points, the rays nor the image are shown — nothing fixes the image' });
  if (m.rays.length > 0 && Math.abs(X(-m.dO) - X(0)) < 34) notes.push({ code: 'crowded', message: 'the object is drawn under 34 units from the lens or mirror — the rays crowd together' });
  return { body: t.svg + under.join('') + parts.join('') + over.join(''), H: y + (y > yAxis + half + 14 ? 0 : -4), facts: facts(notes) };
}
