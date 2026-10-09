/**
 * Practice figures — a legibility REPORT for authoring tools.
 *
 * `checkFigureLegibility(spec)` says what a person reading the figure at
 * 340 px would trip over, so the tool that wrote the spec (or the reviewer)
 * can change the SPEC — widen a range, move a point, drop a curve. It never
 * changes what is drawn: `renderPracticeFigure` gives the same picture
 * whether or not this was called.
 *
 * Warnings:
 *   - curve_barely_visible — the y-range lets through less than
 *     `MIN_VISIBLE_FRACTION` of a curve's domain (a steep curve cut to a sliver);
 *   - branch_stub — one branch of a curve (one side of a pole) shows for less
 *     than 4 % of the plot's width while the rest of it is cut off;
 *   - feature_on_border — a marked point, an endpoint mark or a series vertex
 *     sits on the plot border;
 *   - labels_overlap — two pieces of text overlap (estimated extents);
 *   - too_many_curves — more than `MAX_CURVES` curves / series (the pieces of
 *     one function count once);
 *   - not_renderable — the spec does not draw at all (the renderer's message).
 *
 * The facts come from the renderer's own layout (`inspectPracticeFigure`),
 * so the report cannot disagree with the picture. Pure, deterministic, never
 * throws.
 */
import { estWidth } from './plot-frame';
import { inspectPracticeFigure, type PracticeFigureSpec } from './render';

export type LegibilityWarningCode =
  | 'curve_barely_visible'
  | 'branch_stub'
  | 'feature_on_border'
  | 'labels_overlap'
  | 'too_many_curves'
  | 'not_renderable';

export interface LegibilityWarning {
  code: LegibilityWarningCode;
  /** What and where, naming the spec param when there is one. */
  message: string;
}

export const MIN_VISIBLE_FRACTION = 0.15;
export const MAX_CURVES = 4;
/** A mark this close to the border (viewBox units) is "on" it. */
const BORDER_TOLERANCE = 0.75;

interface TextBox {
  text: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** Estimated boxes of the figure's `<text>` elements. Text rotated a quarter
 *  turn (the y label) is boxed upright-swapped; other rotations (slanted bar
 *  labels, laid out by the renderer not to collide) are left out. */
function textBoxes(svg: string): TextBox[] {
  const out: TextBox[] = [];
  // A figure with a title over a board-rendered body shifts that body down as a group.
  const shift = /<g transform="translate\(0 ([\d.]+)\)">/.exec(svg);
  for (const m of svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
    const attr = (name: string): string | undefined => new RegExp(`\\s${name}="([^"]*)"`).exec(m[1])?.[1];
    const text = m[2].replace(/<[^>]+>/g, '').replace(/&(?:lt|gt|amp|quot);/g, 'x').trim();
    const x = Number(attr('x'));
    const y = Number(attr('y')) + (shift && (m.index as number) > shift.index ? Number(shift[1]) : 0);
    const fs = Number(attr('font-size') ?? 12);
    if (!text || !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(fs)) continue;
    // The width estimate runs wide on purpose (it sizes margins); nine tenths
    // of it is nearer the ink, and a report should not cry wolf.
    const w = estWidth(text, fs) * 0.9;
    const anchor = attr('text-anchor') ?? 'start';
    const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
    const box = { text, x0: left, y0: y - fs * 0.78, x1: left + w, y1: y + fs * 0.2 };
    const transform = attr('transform');
    if (!transform) out.push(box);
    else if (/^rotate\(-90 /.test(transform)) out.push({ text, x0: x - fs * 0.78, y0: y - w / 2, x1: x + fs * 0.2, y1: y + w / 2 });
  }
  return out;
}

export function checkFigureLegibility(spec: PracticeFigureSpec): LegibilityWarning[] {
  let svg: string;
  let facts: ReturnType<typeof inspectPracticeFigure>['facts'];
  try {
    ({ svg, facts } = inspectPracticeFigure(spec));
  } catch (err) {
    return [{ code: 'not_renderable', message: (err as Error)?.message ?? 'the spec could not be drawn' }];
  }
  const warnings: LegibilityWarning[] = [];
  const pct = (v: number) => `${Math.round(v * 100)} %`;

  for (const c of facts.curves) {
    if (c.visibleFraction < MIN_VISIBLE_FRACTION) {
      warnings.push({ code: 'curve_barely_visible', message: `${c.what} is inside the plot for only ${pct(c.visibleFraction)} of its domain — widen yRange or narrow its domain` });
    } else if (c.stubs > 0) {
      warnings.push({ code: 'branch_stub', message: `${c.what}: ${c.stubs} branch${c.stubs === 1 ? ' is' : 'es are'} cut by yRange to a stub under 4 % of the plot's width` });
    }
  }

  if (facts.plot) {
    const { x, y, w, h } = facts.plot;
    for (const mk of facts.marks) {
      const sides = [
        Math.abs(mk.cx - x) <= BORDER_TOLERANCE ? 'left' : '',
        Math.abs(mk.cx - (x + w)) <= BORDER_TOLERANCE ? 'right' : '',
        Math.abs(mk.cy - y) <= BORDER_TOLERANCE ? 'top' : '',
        Math.abs(mk.cy - (y + h)) <= BORDER_TOLERANCE ? 'bottom' : '',
      ].filter(Boolean);
      if (sides.length > 0) warnings.push({ code: 'feature_on_border', message: `${mk.what} sits on the ${sides.join(' and ')} border of the plot — widen the range past it` });
    }
  }

  const boxes = textBoxes(svg);
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      const dx = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
      const dy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
      if (dx > 1 && dy > 1) warnings.push({ code: 'labels_overlap', message: `"${a.text}" and "${b.text}" overlap` });
    }
  }

  if (facts.curveCount > MAX_CURVES) {
    warnings.push({ code: 'too_many_curves', message: `${facts.curveCount} curves in one figure — more than ${MAX_CURVES} cannot be told apart at 340 px` });
  }
  return warnings;
}
