/**
 * Tutor brain v2 — figures drawn here, from a few numbers, as one SVG.
 *
 * For pictures the board had no figure for at all. An optics lesson opened on "a pencil in a glass of water"
 * with nothing to look at, and when the student asked to see it the tutor drew light rays as labelled segments
 * on a coordinate grid, the labels over one another (Praveen, embed-1794593747478). Each figure is computed:
 * the angles drawn are the angles the physics gives, so the picture cannot disagree with the working.
 *
 * Pure and small: used by the server to refuse parameters that cannot be drawn, and by the browser to draw.
 */
import { FIGURE_WIDTH, svgDocument } from '../practice-figure/plot-frame';
import { Reader, type Drawn } from '../practice-figure/spec';
import { renderGeometry } from '../practice-figure/kinds/geometry';
import { renderPhyloTree } from '../practice-figure/kinds/phylo-tree';
import { renderEnergyLevels } from '../practice-figure/kinds/energy-levels';
import { renderSpectrum } from '../practice-figure/kinds/spectrum';
import { renderPhotoelectricSetup } from '../practice-figure/kinds/photoelectric';
import { renderHeatingCurve } from '../practice-figure/kinds/heating-curve';
import { renderBioSchematic } from '../practice-figure/kinds/bio-schematic';
import { renderMechanicsSetup } from '../practice-figure/kinds/mechanics';
import { renderProbabilityTree } from '../practice-figure/kinds/venn-tree';

const INK = '#1e293b'; const MUTED = '#64748b'; const RAY = '#dc2626'; const SEEN = '#2563eb';
const esc = (s: unknown) => String(s ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] as string));
const r1 = (n: number) => Math.round(n * 10) / 10;
const num = (v: unknown) => (typeof v === 'number' ? v : typeof v === 'string' && v.trim() ? Number(v.replace(/[^\d.+-]/g, '')) : NaN);
const deg = (n: number) => `${Math.round(n * 10) / 10}°`;
const svg = (w: number, h: number, body: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" preserveAspectRatio="xMidYMid meet" font-family="Inter, system-ui, sans-serif">${body}</svg>`;
const label = (x: number, y: number, text: string, opts: { anchor?: string; fill?: string; size?: number; weight?: number } = {}) =>
  `<text x="${r1(x)}" y="${r1(y)}" font-size="${opts.size ?? 15}" text-anchor="${opts.anchor ?? 'start'}" fill="${opts.fill ?? INK}"${opts.weight ? ` font-weight="${opts.weight}"` : ''} paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">${esc(text)}</text>`;
/** A line with an arrowhead at its middle, pointing the way the light goes. */
function ray(x1: number, y1: number, x2: number, y2: number, colour: string, dashed = false): string {
  const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2; const a = Math.atan2(y2 - y1, x2 - x1); const s = 9;
  const head = dashed ? '' : `<path d="M ${r1(mx + s * Math.cos(a))} ${r1(my + s * Math.sin(a))} L ${r1(mx - s * Math.cos(a - 0.5))} ${r1(my - s * Math.sin(a - 0.5))} L ${r1(mx - s * Math.cos(a + 0.5))} ${r1(my - s * Math.sin(a + 0.5))} Z" fill="${colour}"/>`;
  return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${colour}" stroke-width="${dashed ? 2 : 3}"${dashed ? ' stroke-dasharray="7 6"' : ''} stroke-linecap="round"/>${head}`;
}
/** An arc about (cx, cy) from the vertical (up or down) round to a ray `angle` degrees away from it. */
function arc(cx: number, cy: number, radius: number, angleDeg: number, up: boolean, side: 1 | -1, colour: string): string {
  const t = (angleDeg * Math.PI) / 180; const dir = up ? -1 : 1;
  const x = cx + side * radius * Math.sin(t); const y = cy + dir * radius * Math.cos(t);
  const sweep = (up ? side === 1 : side === -1) ? 1 : 0;
  return `<path d="M ${r1(cx)} ${r1(cy + dir * radius)} A ${radius} ${radius} 0 0 ${sweep} ${r1(x)} ${r1(y)}" fill="none" stroke="${colour}" stroke-width="2"/>`;
}

export type DrawnFigure = { svg: string } | { refused: string };

/** A ray meeting a flat surface between two materials: the normal, the two rays and the two angles. */
function refraction(p: Record<string, unknown>): DrawnFigure {
  const n1 = num(p.n1); const n2 = num(p.n2); const a1 = num(p.angle ?? p.incidentAngle);
  if (!(n1 >= 1 && n1 <= 4) || !(n2 >= 1 && n2 <= 4)) return { refused: 'n1 and n2 are the refractive indices of the upper and lower material, each a number from 1 to 4' };
  if (!(a1 >= 1 && a1 <= 89)) return { refused: 'angle is the angle of the arriving ray from the normal, in degrees, from 1 to 89' };
  const media = Array.isArray(p.media) ? p.media.map((m) => String(m ?? '').trim()) : [];
  const hide = /^(?:\?|hidden|ask|unknown|true)$/i.test(String(p.find ?? p.hide ?? '')) || p.find === true;
  const W = 560; const H = 380; const cx = 280; const cy = 190; const L = 165;
  const t1 = (a1 * Math.PI) / 180; const s2 = (n1 * Math.sin(t1)) / n2; const total = s2 > 1; const t2 = total ? 0 : Math.asin(s2); const a2 = (t2 * 180) / Math.PI;
  const out: string[] = [
    `<rect x="0" y="0" width="${W}" height="${cy}" fill="#f8fafc"/><rect x="0" y="${cy}" width="${W}" height="${H - cy}" fill="#dbeafe"/>`,
    `<line x1="0" y1="${cy}" x2="${W}" y2="${cy}" stroke="${INK}" stroke-width="2"/>`,
    `<line x1="${cx}" y1="28" x2="${cx}" y2="${H - 28}" stroke="${MUTED}" stroke-width="1.5" stroke-dasharray="6 6"/>`,
    label(cx + 8, 40, 'normal', { fill: MUTED, size: 13 }),
    label(W - 16, 34, `${media[0] || 'first material'}, n = ${n1}`, { anchor: 'end', weight: 600 }),
    label(W - 16, H - 18, `${media[1] || 'second material'}, n = ${n2}`, { anchor: 'end', weight: 600 }),
    ray(cx - L * Math.sin(t1), cy - L * Math.cos(t1), cx, cy, RAY),
    arc(cx, cy, 48, a1, true, -1, RAY),
    // Each angle's value stands across the normal from its ray, where no line runs through it.
    label(cx + 14, cy - 58, `θ₁ = ${deg(a1)}`, { fill: RAY, weight: 600 }),
  ];
  if (total || p.reflected === true) out.push(ray(cx, cy, cx + L * Math.sin(t1), cy - L * Math.cos(t1), total ? RAY : MUTED), label(cx + L * Math.sin(t1) - 4, cy - L * Math.cos(t1) - 8, total ? 'all of it is reflected' : 'reflected', { anchor: 'middle', fill: total ? RAY : MUTED, size: 13 }));
  if (!total) {
    out.push(ray(cx, cy, cx + L * Math.sin(t2), cy + L * Math.cos(t2), RAY), arc(cx, cy, 48, a2, false, 1, RAY),
      label(cx - 14, cy + 70, hide ? 'θ₂ = ?' : `θ₂ = ${deg(a2)}`, { anchor: 'end', fill: RAY, weight: 600 }));
    // The path the ray would have kept to, so the bend can be seen.
    out.push(`<line x1="${cx}" y1="${cy}" x2="${r1(cx + L * 0.8 * Math.sin(t1))}" y2="${r1(cy + L * 0.8 * Math.cos(t1))}" stroke="${MUTED}" stroke-width="1.5" stroke-dasharray="3 6"/>`);
  }
  return { svg: svg(W, H, out.join('')) };
}

/** Something under water seen from above: its light bends at the surface, and the eye places it where the
 *  straight lines back from the eye meet, nearer the surface than it is. */
function apparentDepth(p: Record<string, unknown>): DrawnFigure {
  const n = Number.isFinite(num(p.n)) ? num(p.n) : 1.33;
  if (!(n > 1 && n <= 2.5)) return { refused: 'n is the refractive index of the lower material, above 1 and at most 2.5 (water is 1.33)' };
  const thing = String(p.object ?? 'object').trim().slice(0, 24) || 'object'; const lower = String(p.medium ?? 'water').trim().slice(0, 20) || 'water';
  const W = 560; const H = 400; const top = 150; const ox = 215; const oy = 340; const eyeY = 44;
  const out: string[] = [
    `<rect x="0" y="0" width="${W}" height="${top}" fill="#f8fafc"/><rect x="0" y="${top}" width="${W}" height="${H - top}" fill="#dbeafe"/>`,
    `<line x1="0" y1="${top}" x2="${W}" y2="${top}" stroke="${INK}" stroke-width="2"/>`,
    label(16, 30, 'air', { weight: 600 }), label(16, H - 16, lower, { weight: 600 }),
  ];
  const lines: Array<{ px: number; sx: number; sy: number }> = []; let endX = 0;
  for (const px of [270, 302]) {
    const tw = Math.atan((px - ox) / (oy - top)); const ta = Math.asin(Math.min(0.999, n * Math.sin(tw)));
    const ex = px + (top - eyeY) * Math.tan(ta); endX += ex / 2;
    out.push(ray(ox, oy, px, top, RAY), ray(px, top, ex, eyeY, RAY));
    lines.push({ px, sx: -Math.sin(ta), sy: Math.cos(ta) });
  }
  // Where the two lines back from the eye meet.
  const [a, b] = lines; const k = (b.px - a.px) / (a.sx / a.sy - b.sx / b.sy); const ix = a.px + (a.sx / a.sy) * k; const iy = top + k;
  for (const l of lines) out.push(ray(l.px, top, ix, iy, SEEN, true));
  out.push(`<circle cx="${ox}" cy="${oy}" r="7" fill="${INK}"/>`, label(ox - 14, oy + 5, `the ${thing}, where it really is`, { anchor: 'end' }),
    `<circle cx="${r1(ix)}" cy="${r1(iy)}" r="7" fill="#ffffff" stroke="${SEEN}" stroke-width="2.5"/>`, label(ix + 14, iy + 5, 'where it appears to be', { fill: SEEN, weight: 600 }),
    // The eye.
    `<path d="M ${r1(endX - 24)} ${eyeY - 14} Q ${r1(endX)} ${eyeY - 34} ${r1(endX + 24)} ${eyeY - 14} Q ${r1(endX)} ${eyeY + 2} ${r1(endX - 24)} ${eyeY - 14} Z" fill="#ffffff" stroke="${INK}" stroke-width="2"/><circle cx="${r1(endX)}" cy="${eyeY - 15}" r="5.5" fill="${INK}"/>`,
    label(endX + 32, eyeY - 10, 'your eye'),
    label(W - 16, top - 10, 'the light bends here', { anchor: 'end', fill: RAY, size: 13 }));
  return { svg: svg(W, H, out.join('')) };
}

/** Matter as particles: one box for each state asked for. A solid's particles sit in rows and touch, a liquid's
 *  touch without order, a gas's are far apart and moving. Placed by a fixed rule, so the same figure every time. */
function particles(p: Record<string, unknown>): DrawnFigure {
  const asked = (Array.isArray(p.states) ? p.states : typeof p.states === 'string' ? p.states.split(/[,|]/) : ['solid', 'liquid', 'gas']).map((x) => String(x).trim().toLowerCase()).filter(Boolean);
  const states = asked.filter((x) => ['solid', 'liquid', 'gas'].includes(x)).slice(0, 3);
  if (!states.length || states.length !== asked.length) return { refused: 'states is a list of one to three of: solid, liquid, gas' };
  const names = Array.isArray(p.labels) ? p.labels.map((x) => String(x ?? '')) : [];
  const box = 150; const gap = 34; const W = Math.max(400, states.length * box + (states.length + 1) * gap); const H = box + 84; const top = 20; const rad = 9;
  // A fixed sequence of numbers in [0, 1): the liquid's and the gas's disorder, the same on every draw.
  let seed = 7; const next = () => { seed = (seed * 16807) % 2147483647; return (seed % 10000) / 10000; };
  const out: string[] = [];
  states.forEach((state, i) => {
    const x0 = (W - (states.length * box + (states.length - 1) * gap)) / 2 + i * (box + gap);
    out.push(`<rect x="${x0}" y="${top}" width="${box}" height="${box}" rx="6" fill="#f8fafc" stroke="${INK}" stroke-width="2"/>`);
    const dots: Array<[number, number]> = [];
    if (state === 'solid') { for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) dots.push([x0 + 30 + c * 18, top + box - 14 - r * 18]); }
    else if (state === 'liquid') { for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) dots.push([x0 + 16 + c * 19.5 + (r % 2 ? 6 : 0) + (next() - 0.5) * 6, top + box - 13 - r * 18.5 + (next() - 0.5) * 5]); }
    else { for (let k = 0; k < 7; k++) { let q: [number, number] = [0, 0]; for (let tries = 0; tries < 40; tries++) { q = [x0 + 18 + next() * (box - 36), top + 18 + next() * (box - 36)]; if (dots.every((d) => Math.hypot(d[0] - q[0], d[1] - q[1]) > 38)) break; } dots.push(q); } }
    for (const [cx, cy] of dots) {
      out.push(`<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${rad}" fill="#93c5fd" stroke="${SEEN}" stroke-width="1.5"/>`);
      if (state === 'gas') { const a = next() * Math.PI * 2; out.push(`<line x1="${r1(cx + rad * Math.cos(a))}" y1="${r1(cy + rad * Math.sin(a))}" x2="${r1(cx + (rad + 13) * Math.cos(a))}" y2="${r1(cy + (rad + 13) * Math.sin(a))}" stroke="${MUTED}" stroke-width="1.5" stroke-linecap="round"/>`); }
    }
    out.push(label(x0 + box / 2, top + box + 28, names[i] || state, { anchor: 'middle', weight: 600, size: 17 }),
      label(x0 + box / 2, top + box + 50, state === 'solid' ? 'touching, in fixed places' : state === 'liquid' ? 'touching, sliding past' : 'far apart, moving fast', { anchor: 'middle', fill: MUTED, size: 13 }));
  });
  return { svg: svg(W, H, out.join('')) };
}

/** A block in a liquid with the two forces on it: its weight down, the liquid's push up. How deep it sits and
 *  which arrow is longer follow from the two densities. */
function buoyancy(p: Record<string, unknown>): DrawnFigure {
  const ro = num(p.objectDensity); const rf = Number.isFinite(num(p.fluidDensity)) ? num(p.fluidDensity) : 1000;
  if (!(ro > 0) || !(rf > 0)) return { refused: 'objectDensity and fluidDensity are densities in kg/m³, above 0 (water is 1000)' };
  const thing = String(p.object ?? 'block').trim().slice(0, 18) || 'block'; const fluid = String(p.fluid ?? 'water').trim().slice(0, 16) || 'water';
  const hide = /^(?:\?|true)$/i.test(String(p.find ?? ''));
  const W = 520; const H = 420; const surface = 170; const floorY = 370; const side = 96; const cx = 210;
  const frac = Math.min(1, ro / rf); const floats = ro < rf; const sinks = ro > rf;
  // With the verdict left out, the block is held over the liquid: where it would settle is the answer.
  const topY = hide ? surface - side - 16 : floats ? surface - side * (1 - frac) : sinks ? floorY - side : surface + 70;
  const out: string[] = [
    `<rect x="60" y="${surface}" width="400" height="${floorY - surface}" fill="#dbeafe"/>`,
    `<path d="M 60 56 L 60 ${floorY} L 460 ${floorY} L 460 56" fill="none" stroke="${INK}" stroke-width="2.5"/>`,
    `<line x1="60" y1="${surface}" x2="460" y2="${surface}" stroke="${SEEN}" stroke-width="2"/>`,
    label(W / 2, floorY + 26, `${fluid}, ${rf} kg/m³`, { anchor: 'middle', size: 14, weight: 600 }),
    `<rect x="${cx - side / 2}" y="${r1(topY)}" width="${side}" height="${side}" rx="4" fill="#fde68a" stroke="${INK}" stroke-width="2"/>`,
  ];
  // Both forces act on the block and are drawn from its middle, lengths in proportion: equal when it floats.
  const wLen = 62; const bLen = floats ? wLen : Math.max(22, Math.min(104, (wLen * rf) / ro));
  const arrow = (x: number, y1: number, y2: number, colour: string) => { const d = y2 > y1 ? 1 : -1; return `<line x1="${x}" y1="${r1(y1)}" x2="${x}" y2="${r1(y2 - d * 8)}" stroke="${colour}" stroke-width="4"/><path d="M ${x} ${r1(y2)} L ${x - 8} ${r1(y2 - d * 13)} L ${x + 8} ${r1(y2 - d * 13)} Z" fill="${colour}"/>`; };
  const midY = topY + side / 2;
  out.push(`<circle cx="${cx}" cy="${r1(midY)}" r="3.5" fill="${INK}"/>`);
  out.push(arrow(cx + 12, midY, midY + wLen, RAY), label(cx + side / 2 + 12, midY + 24, 'weight', { fill: RAY, weight: 600, size: 16 }));
  if (!hide) out.push(arrow(cx - 12, midY, midY - bLen, SEEN), label(cx + side / 2 + 12, midY - 22, 'buoyant force', { fill: SEEN, weight: 600, size: 16 }));
  out.push(label(W / 2, 30, `${thing}, ${ro} kg/m³${hide ? ': does it float or sink?' : floats ? `: floats, ${Math.round(frac * 100)}% under the surface` : sinks ? ': sinks, its weight is the larger force' : ': stays where it is put, the forces balance'}`, { anchor: 'middle', size: 15, weight: 600 }));
  return { svg: svg(W, H, out.join('')) };
}

/** Liquid flowing from a wide pipe into a narrow one: the same volume passes each second, so it speeds up. */
function pipeFlow(p: Record<string, unknown>): DrawnFigure {
  const a1 = num(p.area1); const a2 = num(p.area2);
  if (!(a1 > 0) || !(a2 > 0)) return { refused: 'area1 and area2 are the cross-sections of the two parts of the pipe, each above 0' };
  const v1 = num(p.speed1); const unitA = String(p.areaUnit ?? 'cm²').slice(0, 6); const unitV = String(p.speedUnit ?? 'm/s').slice(0, 6);
  const hide = /^(?:\?|true)$/i.test(String(p.find ?? ''));
  const W = 560; const H = 250; const mid = 128; const big = Math.max(a1, a2);
  const half = (a: number) => 22 + 48 * Math.sqrt(a / big); const h1 = half(a1); const h2 = half(a2);
  const edge = (s: 1 | -1) => `M 30 ${r1(mid + s * h1)} L 220 ${r1(mid + s * h1)} C 270 ${r1(mid + s * h1)} 290 ${r1(mid + s * h2)} 340 ${r1(mid + s * h2)} L 530 ${r1(mid + s * h2)}`;
  const flow = (x: number, len: number) => `<line x1="${x}" y1="${mid}" x2="${r1(x + len - 8)}" y2="${mid}" stroke="${SEEN}" stroke-width="3.5"/><path d="M ${r1(x + len)} ${mid} L ${r1(x + len - 12)} ${mid - 7} L ${r1(x + len - 12)} ${mid + 7} Z" fill="${SEEN}"/>`;
  const l1 = 46; const l2 = Math.max(24, Math.min(150, (l1 * a1) / a2)); const v2 = Number.isFinite(v1) ? (v1 * a1) / a2 : NaN;
  const out = [
    `<path d="${edge(-1)} L 530 ${r1(mid + h2)} L 340 ${r1(mid + h2)} C 290 ${r1(mid + h2)} 270 ${r1(mid + h1)} 220 ${r1(mid + h1)} L 30 ${r1(mid + h1)} Z" fill="#dbeafe"/>`,
    `<path d="${edge(-1)}" fill="none" stroke="${INK}" stroke-width="2.5"/><path d="${edge(1)}" fill="none" stroke="${INK}" stroke-width="2.5"/>`,
    flow(70, l1), flow(370, l2),
    label(125, mid - h1 - 12, `A₁ = ${a1} ${unitA}`, { anchor: 'middle', weight: 600 }), label(435, mid - h2 - 12, `A₂ = ${a2} ${unitA}`, { anchor: 'middle', weight: 600 }),
    label(125, mid + h1 + 24, Number.isFinite(v1) ? `v₁ = ${v1} ${unitV}` : 'v₁', { anchor: 'middle', fill: SEEN, weight: 600 }),
    label(435, mid + h2 + 24, hide || !Number.isFinite(v2) ? 'v₂ = ?' : `v₂ = ${Math.round(v2 * 100) / 100} ${unitV}`, { anchor: 'middle', fill: SEEN, weight: 600 }),
  ];
  return { svg: svg(W, H, out.join('')) };
}

/** Figures from the practice-question engine (practice-figure/kinds): exact, legible and already able to leave
 *  out what a question asks for ("?" as a label draws a blank). Each is drawn from the parameters documented at
 *  the top of its module; one that cannot be drawn as written is refused in the engine's own words, which name
 *  the parameter at fault. */
const ENGINE: Record<string, { type: string; draw: (r: Reader, uid: string) => Drawn }> = {
  geometry_figure: { type: 'geometric_figure', draw: (r, uid) => renderGeometry(r, uid) },
  cladogram: { type: 'phylogenetic_tree', draw: (r) => renderPhyloTree(r) },
  energy_levels: { type: 'energy_levels', draw: (r, uid) => renderEnergyLevels(r, uid) },
  spectrum: { type: 'spectrum', draw: (r) => renderSpectrum(r) },
  photoelectric: { type: 'photoelectric_setup', draw: (r, uid) => renderPhotoelectricSetup(r, uid) },
  heating_curve: { type: 'heating_curve', draw: (r, uid) => renderHeatingCurve(r, uid) },
  cell: { type: 'bio_schematic', draw: (r) => renderBioSchematic(r) },
  mechanics_setup: { type: 'mechanics_setup', draw: (r, uid) => renderMechanicsSetup(r, uid) },
  probability_tree: { type: 'probability_tree', draw: (r, uid) => renderProbabilityTree(r, uid) },
};

const FIGURES: Record<string, (p: Record<string, unknown>) => DrawnFigure> = { refraction, apparent_depth: apparentDepth, particles, buoyancy, pipe_flow: pipeFlow };
export const DRAWN_FIGURE_KINDS = [...Object.keys(FIGURES), ...Object.keys(ENGINE)];

export function drawFigure(kind: unknown, params: unknown): DrawnFigure {
  const k = String(kind ?? ''); const p = params && typeof params === 'object' && !Array.isArray(params) ? (params as Record<string, unknown>) : {};
  if (FIGURES[k]) return FIGURES[k](p);
  const e = ENGINE[k];
  if (!e) return { refused: `no drawn figure of kind "${k}"` };
  try {
    // The title stands over the card on the board, not inside the figure as well.
    const { title: _title, ...rest } = p; void _title;
    const uid = `v2${[...JSON.stringify(rest)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36)}`;
    const d = e.draw(new Reader(e.type, rest), uid);
    return { svg: svgDocument(d.W ?? FIGURE_WIDTH, d.H, d.body) };
  } catch (err) {
    return { refused: String((err as Error)?.message ?? err).slice(0, 300) };
  }
}
