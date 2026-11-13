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
const INK = '#1e293b'; const MUTED = '#64748b'; const RAY = '#dc2626'; const SEEN = '#2563eb';
const esc = (s: unknown) => String(s ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] as string));
const r1 = (n: number) => Math.round(n * 10) / 10;
const num = (v: unknown) => (typeof v === 'number' ? v : typeof v === 'string' && v.trim() ? Number(v.replace(/[^\d.+-]/g, '')) : NaN);
const deg = (n: number) => `${Math.round(n * 10) / 10}°`;
const svg = (w: number, h: number, body: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Inter, system-ui, sans-serif">${body}</svg>`;
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

const FIGURES: Record<string, (p: Record<string, unknown>) => DrawnFigure> = { refraction, apparent_depth: apparentDepth };
export const DRAWN_FIGURE_KINDS = Object.keys(FIGURES);

export function drawFigure(kind: unknown, params: unknown): DrawnFigure {
  const f = FIGURES[String(kind ?? '')];
  if (!f) return { refused: `no drawn figure of kind "${String(kind ?? '')}"` };
  return f(params && typeof params === 'object' ? (params as Record<string, unknown>) : {});
}
