/**
 * The two figures a student draws an answer on (contract v1.22.0 drawn items),
 * drawn WITHOUT the rest of render.ts. render.ts pulls in `react-dom/server`
 * (for the board-rendered free-body kind), which Next refuses in an App Route;
 * drawn items are drawn at serve time from `/api/portal/v1/practice`, so they
 * come through here instead. Same kind functions, same document wrapper and
 * safety check as `renderPracticeFigureWithFrame`, so the SVG and frame are the
 * same strings (render-drawn-base test pins that).
 */
import { FIGURE_WIDTH, svgDocument } from './plot-frame';
import { renderCoordinateGrid } from './kinds/coordinate-grid';
import { renderNumberLine } from './kinds/number-line';
import { validateFigureSvg } from './svg-safety';
import { PracticeFigureSpecError, Reader, type Drawn, type PracticeFigureSpec } from './spec';
import type { PracticeFigureFrame } from './render';

export const DRAWN_BASE_KINDS = ['coordinate_grid', 'number_line'] as const;

export function renderDrawnBaseFigure(spec: PracticeFigureSpec): { svg: string; frame?: PracticeFigureFrame } {
  const kind = typeof spec?.type === 'string' ? spec.type : String(spec?.type);
  if (!spec || typeof spec.params !== 'object' || spec.params === null || Array.isArray(spec.params)) {
    throw new PracticeFigureSpecError(kind, 'params must be an object');
  }
  const r = new Reader(kind, spec.params);
  let drawn: Drawn;
  if (kind === 'coordinate_grid') drawn = renderCoordinateGrid(r);
  else if (kind === 'number_line') drawn = renderNumberLine(r);
  else throw new PracticeFigureSpecError(kind, `not a drawn-answer base — one of ${DRAWN_BASE_KINDS.join(', ')}`);
  const svg = svgDocument(drawn.W ?? FIGURE_WIDTH, drawn.H, drawn.body);
  const safety = validateFigureSvg(svg);
  if (!safety.ok) throw new PracticeFigureSpecError(kind, `rendered SVG failed the safety check (${safety.issues.join(', ')})`);
  if (!drawn.frame) return { svg };
  return { svg, frame: { ...drawn.frame, viewBox: [drawn.W ?? FIGURE_WIDTH, Math.ceil(drawn.H)] } };
}
