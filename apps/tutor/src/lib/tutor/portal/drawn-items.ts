/**
 * Drawn-answer items (contract v1.22.0) — practice items the student answers
 * by DRAWING on the figure: points or a line on a coordinate grid, an
 * interval or ray on a number line. Graded deterministically, in the academy,
 * by the contract's pure `gradeDrawn` (no model tokens).
 *
 * THE GATE (practice.ts `retrievePractice`). A drawn row is served only when
 * ALL of these hold, and is otherwise dropped:
 *   - the caller is the practice route (`options.allowFigures`) and the
 *     request lists `figure` in `accepts` (a drawn item IS a figure item);
 *   - the request also lists `drawn` in `accepts`;
 *   - the partner is on `PRACTICE_DRAWN_ANSWER_PARTNERS` (comma list, read
 *     at call time, trimmed, case-insensitive, whole ids). Unset or blank ⇒
 *     NO partner gets drawn items. This is a per-partner list, not a feature
 *     flag, so the "new flags default ON" rule does not apply: on is "listed".
 * Every other partner and request gets exactly what it got before drawn rows
 * existed (scripts/test-practice-drawn-items.ts proves it).
 *
 * STORED SHAPE (a ProblemBank row):
 *   responseFormat: 'drawn'
 *   drawn:  { kind, snap?, tolerance, key }   — `DrawnSpec` without its frame
 *   figure: { alt, spec }                      — NO svg
 * The SVG and its frame are drawn at SERVE time from `figure.spec`, by the
 * same renderer call, so the overlay always lines up with the picture. The
 * missing svg is also the old-build defence: every build before this one
 * default-denies a row that carries `figure` and withholds a figure with no
 * svg (figure-items.ts `servableFigure`), so a drawn row in the shared bank
 * can never reach a build — or, through it, a partner — that cannot take it.
 *
 * WHAT A DRAWN ROW MAY BE DRAWN ON (29-Oct scope): grid kinds on a blank
 * `coordinate_grid`; the number-line kind on a `number_line` showing no
 * interval and no point. Anything else is withheld: a base figure that draws
 * data could give the answer away.
 *
 * Like figure-items.ts this is about SERVING only; answer-key resolvers are
 * untouched.
 */
import { DrawnSpecSchema, gradeDrawn, type DrawnSpec } from '@evelyn/portal-contract/v1';
import { renderPracticeFigureWithFrame } from '../practice-figure/render';
import { MAX_FIGURE_SVG_CHARS } from '../practice-figure/svg-safety';
import { MAX_FIGURE_ALT_CHARS } from './figure-items';

export const DRAWN_ANSWER_PARTNERS_ENV = 'PRACTICE_DRAWN_ANSWER_PARTNERS';

/** Mongo filter fragment for a read that may not serve drawn rows. (A drawn
 *  row also carries `figure`, so a figure-free read excludes it already.) */
export const NO_DRAWN_FILTER: Readonly<Record<string, unknown>> = Object.freeze({ responseFormat: { $ne: 'drawn' }, drawn: { $exists: false } });

/** A row's stored drawn spec: `DrawnSpec` without the frame (added at serve). */
export type StoredDrawn = DrawnSpec extends infer S ? (S extends DrawnSpec ? Omit<S, 'frame'> : never) : never;
/** A drawn row's stored figure: the spec it is drawn from, and its alt text. */
export interface StoredDrawnFigure {
  alt: string;
  spec: { type: string; params: Record<string, unknown> };
}

export interface ServableDrawn {
  figure: { svg: string; alt: string; spec: { type: string; params: Record<string, unknown> } };
  drawn: DrawnSpec;
}

/** Is `partnerId` on `PRACTICE_DRAWN_ANSWER_PARTNERS`? See the module header. */
export function drawnAnswersForPartner(
  partnerId: string | null | undefined,
  env: Record<string, string | undefined> = process.env,
): boolean {
  const raw = env[DRAWN_ANSWER_PARTNERS_ENV];
  if (!raw) return false;
  const id = (partnerId ?? '').trim().toLowerCase();
  if (!id) return false;
  return raw.split(',').some((p) => p.trim().toLowerCase() === id);
}

/** Does the request list `drawn` among the features its caller can take? */
export function acceptsDrawn(req: { accepts?: readonly string[] | null } | null | undefined): boolean {
  return Array.isArray(req?.accepts) && req.accepts.includes('drawn');
}

/** Is this row a drawn item — `responseFormat: 'drawn'`, or any `drawn`
 *  value at all? Fail closed: a malformed one is never taken for text. */
export function isDrawnRow(row: unknown): boolean {
  if (!row || typeof row !== 'object') return false;
  const r = row as { responseFormat?: unknown; drawn?: unknown };
  return r.responseFormat === 'drawn' || r.drawn !== undefined;
}

export function logDrawnItemSkip(id: string, where: string): void {
  console.log(`[practice] drawn item not served ${id} where=${where}`);
}

/** The figure kind each drawn kind may be drawn on, and its frame. */
const BASE: Record<DrawnSpec['kind'], { figure: string; frame: 'grid' | 'number-line' }> = {
  'grid-points': { figure: 'coordinate_grid', frame: 'grid' },
  'grid-line': { figure: 'coordinate_grid', frame: 'grid' },
  'number-line-interval': { figure: 'number_line', frame: 'number-line' },
};

const isEmptyList = (v: unknown) => v === undefined || v === null || (Array.isArray(v) && v.length === 0);

/** Why `row` cannot be served as a drawn item, or the item parts. */
function buildDrawn(row: { figure?: unknown; drawn?: unknown }): ServableDrawn | string {
  const d = row.drawn as { kind?: unknown } | null | undefined;
  if (!d || typeof d !== 'object' || Array.isArray(d)) return 'drawn is not an object';
  const base = BASE[d.kind as DrawnSpec['kind']];
  if (!base) return `unknown drawn kind ${String(d.kind)}`;
  const f = row.figure as { alt?: unknown; spec?: { type?: unknown; params?: unknown } } | null | undefined;
  if (!f || typeof f !== 'object') return 'no figure';
  if (typeof f.alt !== 'string' || f.alt.trim().length === 0 || f.alt.length > MAX_FIGURE_ALT_CHARS) return 'bad alt text';
  const spec = f.spec;
  if (!spec || typeof spec !== 'object' || typeof spec.type !== 'string' || !spec.params || typeof spec.params !== 'object' || Array.isArray(spec.params)) return 'no figure spec';
  if (spec.type !== base.figure) return `${String(d.kind)} must be drawn on ${base.figure}, not ${spec.type}`;
  const params = spec.params as Record<string, unknown>;
  if (spec.type === 'number_line' && !(isEmptyList(params.intervals) && isEmptyList(params.points))) return 'the number line already shows an interval or point';
  let rendered: ReturnType<typeof renderPracticeFigureWithFrame>;
  try {
    rendered = renderPracticeFigureWithFrame({ type: spec.type, params });
  } catch (err) {
    return `figure does not render (${(err as Error).message})`;
  }
  if (rendered.svg.length > MAX_FIGURE_SVG_CHARS) return 'svg too large';
  const fr = rendered.frame;
  if (!fr || fr.kind !== base.frame) return 'figure has no frame of the right kind';
  const { kind: _frameKind, ...frame } = fr;
  const parsed = DrawnSpecSchema.safeParse({ ...d, frame });
  if (!parsed.success) return `bad drawn spec (${parsed.error.issues.map((i) => i.message).join('; ')})`;
  // The key must solve itself under the shared grader.
  const s = parsed.data;
  const key = s.kind === 'grid-points'
    ? { kind: s.kind, points: s.key.points }
    : s.kind === 'grid-line'
      ? { kind: s.kind, points: s.key.through }
      : { kind: s.kind, ...s.key };
  if (!gradeDrawn(s, key).correct) return 'the key does not grade as correct';
  return { figure: { svg: rendered.svg, alt: f.alt, spec: { type: spec.type, params } }, drawn: s };
}

/**
 * The figure (rendered now, with the frame) and drawn spec to put on the wire
 * for a stored drawn row — or null when the row must be WITHHELD (the caller
 * drops the whole item). One warning per withheld item.
 */
export function servableDrawn(id: string, row: { figure?: unknown; drawn?: unknown }): ServableDrawn | null {
  const out = buildDrawn(row);
  if (typeof out === 'string') {
    console.warn(`[practice] drawn item withheld ${id}: ${out}`);
    return null;
  }
  return out;
}

/**
 * The fields to store on a ProblemBank row for a drawn item (authoring
 * scripts). Throws when the row would be withheld at serve time — so a bad
 * row is refused before it is written, never discovered by a student.
 */
export function drawnRowFields(drawn: StoredDrawn, figure: StoredDrawnFigure): { responseFormat: 'drawn'; drawn: StoredDrawn; figure: StoredDrawnFigure } {
  const out = buildDrawn({ drawn, figure });
  if (typeof out === 'string') throw new Error(`[drawn-items] not servable: ${out}`);
  return { responseFormat: 'drawn', drawn, figure: { alt: figure.alt, spec: { type: figure.spec.type, params: figure.spec.params } } };
}
