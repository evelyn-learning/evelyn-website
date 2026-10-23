/**
 * Static SVG thumbnail of a homework number line (showNumberLine), at natural
 * height like the board (spec 2026-10-21 §4.5–4.6). Ticks at the figure's
 * step (scaffolding, as the validator treats it), marked points (filled or
 * open), shaded intervals and labelled segments. An interval end at the
 * line's min or max is a ray (the validator lets such an end through
 * unstated for that reason): it runs on to the edge with an arrowhead and has
 * no circle there. An interval end inside the line is a circle, closed when
 * inclusive and open otherwise (the board's default); where a marked point
 * sits on that end, the point's own circle stands for it. Never throws: a
 * line it cannot draw gives null.
 */

import { DIAGRAM_COLORS as C } from '../diagrams/theme';
import { clip, esc, fmt, isNum, niceStep, num, svgDoc, ticks } from './svg-util';
import type { FigureCommand } from './types';

type NumberLine = Extract<FigureCommand, { action: 'showNumberLine' }>;

const W = 400, PAD = 30, EDGE = 8;

const arrow = (x: number, y: number, dir: 1 | -1, color: string) =>
  `<path d="M ${fmt(x)} ${fmt(y)} L ${fmt(x - dir * 9)} ${fmt(y - 5)} L ${fmt(x - dir * 9)} ${fmt(y + 5)} Z" fill="${color}"></path>`;

export function numberLineToSvg(fig: NumberLine): string | null {
  try {
    const { min, max } = fig ?? ({} as NumberLine);
    if (!isNum(min) || !isNum(max) || !(min < max)) return null;
    const list = <T,>(v: unknown): T[] | null => (v === undefined ? [] : Array.isArray(v) ? (v as T[]) : null);
    const points = list<NonNullable<NumberLine['points']>[number]>(fig.points);
    const intervals = list<NonNullable<NumberLine['intervals']>[number]>(fig.intervals);
    const segments = list<NonNullable<NumberLine['segments']>[number]>(fig.segments);
    if (!points || !intervals || !segments) return null;
    if (!points.every((p) => p && isNum(p.value))) return null;
    if (!intervals.every((iv) => iv && isNum(iv.from) && isNum(iv.to) && iv.from < iv.to)) return null;
    if (!segments.every((s) => s && isNum(s.from) && isNum(s.to))) return null;

    const top = fig.title ? 28 : 0;
    const hasAbove = segments.length > 0 || points.some((p) => p.label) || intervals.some((iv) => iv.label);
    const y = top + (hasAbove ? 52 : 30);
    const H = y + 34;
    const sx = (v: number) => PAD + ((v - min) / (max - min)) * (W - 2 * PAD);
    const out: string[] = [];
    if (fig.title) out.push(`<text x="${W / 2}" y="18" text-anchor="middle" font-size="14" font-weight="600" fill="${C.text}">${esc(clip(fig.title, 48))}</text>`);

    // The line, with arrows at both ends.
    out.push(`<line x1="${EDGE + 2}" y1="${fmt(y)}" x2="${W - EDGE - 2}" y2="${fmt(y)}" stroke="${C.axis}" stroke-width="1.5"></line>`);
    out.push(arrow(EDGE, y, -1, C.axis), arrow(W - EDGE, y, 1, C.axis));

    // Ticks: the figure's step when it gives a readable count, else a 1/2/5 step.
    const span = max - min;
    const step = isNum(fig.step) && fig.step > 0 && span / fig.step <= 40 ? fig.step : niceStep(span, 10);
    const tk = ticks(min, max, step, 41);
    const every = Math.max(1, Math.ceil(tk.length / 21));
    const den = fig.fractionTicks?.denominator;
    if (isNum(den) && den >= 1 && span * den <= 120) {
      for (const v of ticks(min, max, 1 / den, 121)) out.push(`<line x1="${fmt(sx(v))}" y1="${fmt(y - 4)}" x2="${fmt(sx(v))}" y2="${fmt(y + 4)}" stroke="${C.muted}" stroke-width="1"></line>`);
    }
    tk.forEach((v, i) => {
      out.push(`<line x1="${fmt(sx(v))}" y1="${fmt(y - 7)}" x2="${fmt(sx(v))}" y2="${fmt(y + 7)}" stroke="${C.axis}" stroke-width="1.2"></line>`);
      if (i % every === 0) out.push(`<text x="${fmt(sx(v))}" y="${fmt(y + 22)}" text-anchor="middle" font-size="11" fill="${C.muted}">${esc(num(v))}</text>`);
    });

    // Segments: a bracket (or, with arc, an arc) above the line with its label.
    segments.forEach((s, i) => {
      const a = sx(Math.min(s.from, s.to)), b = sx(Math.max(s.from, s.to));
      const color = s.color && /^#[0-9a-f]{3,8}$/i.test(s.color) ? s.color : C.cycle[(i + 1) % C.cycle.length];
      out.push(s.arc
        ? `<path d="M ${fmt(a)} ${fmt(y - 4)} Q ${fmt((a + b) / 2)} ${fmt(y - 34)} ${fmt(b)} ${fmt(y - 4)}" fill="none" stroke="${color}" stroke-width="1.8"></path>`
        : `<path d="M ${fmt(a)} ${fmt(y - 10)} L ${fmt(a)} ${fmt(y - 18)} L ${fmt(b)} ${fmt(y - 18)} L ${fmt(b)} ${fmt(y - 10)}" fill="none" stroke="${color}" stroke-width="1.8"></path>`);
      if (s.label) out.push(`<text x="${fmt((a + b) / 2)}" y="${fmt(y - 24)}" text-anchor="middle" font-size="11" fill="${color}">${esc(clip(s.label, 16))}</text>`);
    });

    // Intervals: a thick shaded run; an end at a bound is a ray to the edge.
    const pointAt = new Set(points.map((p) => p.value));
    intervals.forEach((iv) => {
      const color = C.primary;
      const leftRay = iv.from <= min, rightRay = iv.to >= max;
      const x0 = leftRay ? EDGE + 9 : sx(iv.from), x1 = rightRay ? W - EDGE - 9 : sx(iv.to);
      const ray = leftRay && rightRay ? ' data-ray="both"' : leftRay ? ' data-ray="left"' : rightRay ? ' data-ray="right"' : '';
      out.push(`<g${ray}><line x1="${fmt(x0)}" y1="${fmt(y)}" x2="${fmt(x1)}" y2="${fmt(y)}" stroke="${color}" stroke-width="5" stroke-opacity="0.85"></line>`);
      if (leftRay) out.push(arrow(EDGE, y, -1, color));
      if (rightRay) out.push(arrow(W - EDGE, y, 1, color));
      out.push('</g>');
      if (!leftRay && !pointAt.has(iv.from)) out.push(`<circle cx="${fmt(sx(iv.from))}" cy="${fmt(y)}" r="6" fill="${iv.fromInclusive ? color : C.white}" stroke="${color}" stroke-width="2.5"></circle>`);
      if (!rightRay && !pointAt.has(iv.to)) out.push(`<circle cx="${fmt(sx(iv.to))}" cy="${fmt(y)}" r="6" fill="${iv.toInclusive ? color : C.white}" stroke="${color}" stroke-width="2.5"></circle>`);
      if (iv.label) out.push(`<text x="${fmt((x0 + x1) / 2)}" y="${fmt(y - 14)}" text-anchor="middle" font-size="11" fill="${color}">${esc(clip(iv.label, 16))}</text>`);
    });

    // Points: filled by default, open when the sheet shows an open circle.
    for (const p of points) {
      if (p.value < min || p.value > max) continue;
      const open = p.style === 'open';
      out.push(`<circle cx="${fmt(sx(p.value))}" cy="${fmt(y)}" r="6" fill="${open ? C.white : C.primary}" stroke="${C.primary}" stroke-width="2.5"></circle>`);
      if (p.label) out.push(`<text x="${fmt(sx(p.value))}" y="${fmt(y - 12)}" text-anchor="middle" font-size="12" font-weight="600" fill="${C.text}">${esc(clip(p.label, 12))}</text>`);
    }
    return svgDoc(W, H, out);
  } catch {
    return null;
  }
}
