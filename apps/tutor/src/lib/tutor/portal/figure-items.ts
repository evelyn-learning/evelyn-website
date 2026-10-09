/**
 * Figure items — practice items that cannot be answered without a picture.
 *
 * A ProblemBank row may carry `figure { svg, alt, spec? }` (contract v1.21.0
 * `PracticeFigureSchema`). Its question text says "the graph shows…", so
 * showing it WITHOUT the figure hands a student an unanswerable question that
 * is then machine-graded. The rule is therefore DEFAULT-DENY:
 *
 *   a figure item is served by exactly one path — a practice retrieval whose
 *   request lists `figure` in `accepts` — and then only with a figure that
 *   passes the safety check attached. Every other reader of the bank drops
 *   the row: a practice request without `accepts`, assessments / quizzes /
 *   unit tests / diagnostics, assigned practice, the in-session bank query
 *   (show_problem), generation anchors and avoid-lists, mock-exam forms.
 *
 * Like the withdrawn list (withdrawn-items.ts) this is about SERVING only:
 * the answer-key resolvers (adapters.ts `resolveGradeItem` /
 * `resolveAssessmentItem`) do not consult it, because an id already issued to
 * a caller that accepted the figure must still resolve when the answer comes
 * back.
 *
 * A row "carries a figure" when it has a `figure` value at all — including a
 * malformed one (`null`, a string, an object with no `svg`). Fail closed: a
 * row someone meant to be a figure item is never mistaken for a text item.
 *
 * Pure apart from the skip log lines. No kill switch on purpose: there is no
 * setting under which showing the question without its picture is right.
 */
// Relative on purpose: voice/problem-generator.ts (relative-import-only) loads this too.
import { MAX_FIGURE_SVG_CHARS, validateFigureSvg } from '../practice-figure/svg-safety';

/** `PracticeFigureSchema.alt` max length (@evelyn/portal-contract v1.21.0). */
export const MAX_FIGURE_ALT_CHARS = 600;

/** The wire shape (contract `PracticeFigure`), repeated so this module stays
 *  importable by relative path alone; scripts/test-practice-figure-items.ts
 *  pins it against the contract schema. */
export interface ServableFigure {
  svg: string;
  alt: string;
  spec?: { type: string; params: Record<string, unknown> };
}

/** Mongo filter fragment for a reader that never serves figure items — the
 *  rows are left out by the query, so they take none of its `limit` and their
 *  SVG is never loaded. Matches the in-memory rule (`carriesFigure`) for
 *  every stored shape except an explicit `figure: null`, which the query
 *  returns and `withoutFigureItems` then drops. */
export const NO_FIGURE_FILTER: Readonly<Record<string, unknown>> = Object.freeze({ figure: { $exists: false } });

/** Does this row / item carry a figure (of any shape, valid or not)? */
export function carriesFigure(row: unknown): boolean {
  return !!row && typeof row === 'object' && (row as { figure?: unknown }).figure !== undefined;
}

export function logFigureItemSkip(id: string, where: string): void {
  console.log(`[practice] figure item not served ${id} where=${where}`);
}

/** Drop figure items, logging one line per skipped id. `where` names the
 *  reader for the log (`practice-lo`, `session-generate-problem`, …). */
export function withoutFigureItems<T extends { id: string }>(rows: readonly T[], where: string): T[] {
  return rows.filter((r) => {
    if (!carriesFigure(r)) return true;
    logFigureItemSkip(r.id, where);
    return false;
  });
}

/** Does the request list `figure` among the features its caller can display? */
export function acceptsFigures(req: { accepts?: readonly string[] | null } | null | undefined): boolean {
  return Array.isArray(req?.accepts) && req.accepts.includes('figure');
}

/**
 * The figure to put on the wire for a stored row, or null when the row must
 * be WITHHELD (the caller drops the whole item — never serves it bare):
 *   - `svg` is not a string, is empty or over the contract bound, or fails
 *     `validateFigureSvg` (script, external reference, not one `<svg>` root…);
 *   - `alt` is missing, blank or over the contract bound;
 *   - `spec` is present but not `{ type: string, params: object }` — the spec
 *     is optional, so a bad one is dropped rather than failing the item.
 * One warning per withheld item.
 */
export function servableFigure(id: string, figure: unknown): ServableFigure | null {
  const withhold = (why: string): null => {
    console.warn(`[practice] figure item withheld ${id}: ${why}`);
    return null;
  };
  if (!figure || typeof figure !== 'object') return withhold('figure is not an object');
  const f = figure as { svg?: unknown; alt?: unknown; spec?: unknown };
  if (typeof f.svg !== 'string' || f.svg.length === 0) return withhold('no svg');
  if (f.svg.length > MAX_FIGURE_SVG_CHARS) return withhold(`svg over ${MAX_FIGURE_SVG_CHARS} characters`);
  const safety = validateFigureSvg(f.svg);
  if (!safety.ok) return withhold(`unsafe svg (${safety.issues.join(', ')})`);
  if (typeof f.alt !== 'string' || f.alt.trim().length === 0) return withhold('no alt text');
  if (f.alt.length > MAX_FIGURE_ALT_CHARS) return withhold(`alt over ${MAX_FIGURE_ALT_CHARS} characters`);
  const spec = f.spec as { type?: unknown; params?: unknown } | null | undefined;
  const specOk = !!spec && typeof spec === 'object' && typeof spec.type === 'string'
    && !!spec.params && typeof spec.params === 'object' && !Array.isArray(spec.params);
  return {
    svg: f.svg,
    alt: f.alt,
    ...(specOk ? { spec: { type: spec.type as string, params: spec.params as Record<string, unknown> } } : {}),
  };
}
