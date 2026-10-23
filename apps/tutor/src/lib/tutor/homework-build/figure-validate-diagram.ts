/**
 * Validators for the showDiagram homework figures (catalog kinds). The
 * catalog solvers are forgiving by design for the live tutor: solid_3d maps
 * aliases (`pyramid`, `ball`), falls back to a rectangular prism for an
 * unknown shape, and fills a missing dimension from its defaults. A homework
 * figure must never draw a guess, so the gate here is exact: the shape is one
 * of the solver's own keys, the dims are exactly that shape's keys, and every
 * dimension is a number the problem text states. tape_diagram and
 * area_model are gated the same way, structure and provenance first, before
 * their solver runs: area_model's solver defaults showProducts to true, so a
 * figure that leaves it out would print every partial product, the very
 * numbers the student is asked to find. inequality_graph and coordinate_grid
 * are gated the same way (the inequality solver defaults its variable to x;
 * the grid solver auto-fits and clamps its bounds). The catalog
 * `transformation` kind is not in the vocabulary: its solver computes the
 * image, the student's answer. The solvers themselves are not
 * changed (shared live code, GAC freeze). Pure.
 */

import { solveDiagram } from '../diagrams/catalog/manifest';
import { normalise, numberIsFromText, parseNumberCell, textFieldIsFromText, textFieldReasons } from './figure-text';
import type { FigureContext } from './figure-validate';
import type { DiagramFigure } from './types';

export type SolidShapeKey = 'cube' | 'rectangular_prism' | 'triangular_prism' | 'cylinder' | 'cone' | 'sphere' | 'square_pyramid';

/** The dims the catalog's solid_3d draws (and labels) for each shape, in its own key names. */
export const SOLID_DIMS: Record<SolidShapeKey, readonly string[]> = {
  cube: ['side'],
  rectangular_prism: ['length', 'width', 'height'],
  triangular_prism: ['base', 'triHeight', 'length'],
  cylinder: ['radius', 'height'],
  cone: ['radius', 'height'],
  sphere: ['radius'],
  square_pyramid: ['base', 'height'],
};

/** The params solid_3d reads in a homework figure; the solver's aliases (`dimensions`, `net`) are not taken. */
const SOLID_PARAMS = ['shape', 'dims', 'showNet', 'title'];

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

function validateSolid3D(params: Record<string, unknown>, ctx: FigureContext): string[] {
  const text = ctx.problemText;
  const reasons: string[] = [];
  for (const k of Object.keys(params)) {
    if (params[k] !== undefined && !SOLID_PARAMS.includes(k)) reasons.push(`solid_3d param "${k}" is not used by a solid_3d`);
  }
  reasons.push(...textFieldReasons([{ value: params.title }], text));
  if (params.showNet !== undefined && typeof params.showNet !== 'boolean') reasons.push('solid_3d showNet must be true or false');

  const shape = params.shape;
  if (typeof shape !== 'string' || !Object.prototype.hasOwnProperty.call(SOLID_DIMS, shape)) {
    return [...reasons, `solid_3d shape "${String(shape)}" is not one of ${Object.keys(SOLID_DIMS).join(', ')}`];
  }
  const keys = SOLID_DIMS[shape as SolidShapeKey];
  if (shape === 'sphere' && params.showNet === true) reasons.push('a sphere has no net');

  const dims = params.dims;
  if (!dims || typeof dims !== 'object' || Array.isArray(dims)) return [...reasons, `solid_3d ${shape} needs dims ${keys.join(', ')}`];
  const d = dims as Record<string, unknown>;
  if (keys.some((k) => d[k] === undefined)) reasons.push(`solid_3d ${shape} needs dims ${keys.join(', ')}`);
  for (const [k, v] of Object.entries(d)) {
    if (!keys.includes(k)) { reasons.push(`solid_3d dim "${k}" is not drawn for a ${shape}`); continue; }
    if (!isNum(v) || v <= 0) { reasons.push(`solid_3d dim "${k}" must be a number > 0`); continue; }
    if (!numberIsFromText(v, text)) reasons.push(`number ${v} in params.dims.${k} does not come from the problem text`);
  }
  if (reasons.length) return reasons;

  try {
    solveDiagram('solid_3d', params);
  } catch (e) {
    reasons.push(`solid_3d does not solve: ${(e as Error).message}`);
  }
  return reasons;
}

/** Runs the catalog solver after the gate passed; it must not throw. */
function solves(kind: string, params: Record<string, unknown>): string[] {
  try {
    solveDiagram(kind, params);
    return [];
  } catch (e) {
    return [`${kind} does not solve: ${(e as Error).message}`];
  }
}

const unusedParams = (kind: string, params: Record<string, unknown>, used: readonly string[]) =>
  Object.keys(params).filter((k) => params[k] !== undefined && !used.includes(k)).map((k) => `${kind} param "${k}" is not used by a ${kind}`);

/** A drawn label: "?" (the unknown marker; it states nothing), a number the text states, or a phrase of the text. */
function drawnLabelReasons(value: unknown, where: string, text: string): string[] {
  if (value === undefined) return [];
  if (typeof value !== 'string') return [`${where} must be a string`];
  const v = value.trim();
  if (!v || v === '?') return [];
  const n = parseNumberCell(v);
  if (n !== null && numberIsFromText(n, text)) return [];
  return textFieldIsFromText(v, text) ? [] : [`label "${value}" in ${where} does not come from the problem text`];
}

/** Bounds for the homework gate (the thumbnail draws no more than this). */
export const TAPE_MAX_BARS = 6;
export const TAPE_MAX_SEGMENTS = 20;
export const AREA_MAX_SPLITS = 6;

/**
 * tape_diagram: at least one bar, each with at least one segment of length
 * > 0. A part's length sets its drawn width, so it is a number the text
 * states, unless the part is the unknown (unknown: true), whose width is only
 * a proportion; its label, bar names, totalLabel and title from the text.
 */
function validateTape(params: Record<string, unknown>, ctx: FigureContext): string[] {
  const text = ctx.problemText;
  const reasons = unusedParams('tape_diagram', params, ['bars', 'title', 'sharedScale']);
  reasons.push(...textFieldReasons([{ value: params.title }], text));
  if (params.sharedScale !== undefined && typeof params.sharedScale !== 'boolean') reasons.push('tape_diagram sharedScale must be true or false');
  const bars = params.bars;
  if (!Array.isArray(bars) || bars.length === 0) return [...reasons, 'tape_diagram needs at least one bar { segments: [...] }'];
  if (bars.length > TAPE_MAX_BARS) return [...reasons, `tape_diagram holds at most ${TAPE_MAX_BARS} bars`];
  bars.forEach((raw, i) => {
    const where = `params.bars[${i}]`;
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) { reasons.push(`${where} must be { name?, segments, totalLabel? }`); return; }
    const b = raw as Record<string, unknown>;
    for (const k of Object.keys(b).filter((x) => b[x] !== undefined && !['name', 'segments', 'totalLabel'].includes(x))) reasons.push(`${where} field "${k}" is not used`);
    reasons.push(...drawnLabelReasons(b.name, `${where}.name`, text), ...drawnLabelReasons(b.totalLabel, `${where}.totalLabel`, text));
    const segs = b.segments;
    if (!Array.isArray(segs) || segs.length === 0) { reasons.push(`tape_diagram bars[${i}] needs at least one segment`); return; }
    if (segs.length > TAPE_MAX_SEGMENTS) { reasons.push(`tape_diagram bars[${i}] holds at most ${TAPE_MAX_SEGMENTS} segments`); return; }
    segs.forEach((rawSeg, j) => {
      const sw = `${where}.segments[${j}]`;
      if (!rawSeg || typeof rawSeg !== 'object' || Array.isArray(rawSeg)) { reasons.push(`${sw} must be { length, label?, unknown? }`); return; }
      const sg = rawSeg as Record<string, unknown>;
      for (const k of Object.keys(sg).filter((x) => sg[x] !== undefined && !['length', 'label', 'unknown', 'color'].includes(x))) reasons.push(`${sw} field "${k}" is not used`);
      if (sg.unknown !== undefined && typeof sg.unknown !== 'boolean') reasons.push(`${sw}: unknown must be true or false`);
      if (sg.color !== undefined && typeof sg.color !== 'string') reasons.push(`${sw}: color must be a string`);
      reasons.push(...drawnLabelReasons(sg.label, `${sw}.label`, text));
      if (!isNum(sg.length) || sg.length <= 0) { reasons.push(`${sw}: length must be a number > 0`); return; }
      if (sg.unknown !== true && !numberIsFromText(sg.length, text)) reasons.push(`number ${sg.length} in ${sw}.length does not come from the problem text (mark a part the student finds unknown: true)`);
    });
  });
  return reasons.length ? reasons : solves('tape_diagram', params);
}

/**
 * area_model: rows and cols, each a non-empty list of stated side lengths
 * > 0 (at most 6). The board prints each cell's product rows[i] × cols[j]
 * unless showProducts is false or cellLabels relabels every cell; a printed
 * product must be stated, else it is the student's work. cellLabels (a full
 * rows × cols matrix, as the solver requires) and the title from the text.
 */
function validateAreaModel(params: Record<string, unknown>, ctx: FigureContext): string[] {
  const text = ctx.problemText;
  const reasons = unusedParams('area_model', params, ['rows', 'cols', 'cellLabels', 'showProducts', 'title']);
  reasons.push(...textFieldReasons([{ value: params.title }], text));
  if (params.showProducts !== undefined && typeof params.showProducts !== 'boolean') reasons.push('area_model showProducts must be true or false');
  const sides = (key: 'rows' | 'cols'): number[] | null => {
    const v = params[key];
    if (!Array.isArray(v) || v.length === 0) { reasons.push(`area_model ${key} must be a non-empty array of side lengths`); return null; }
    if (v.length > AREA_MAX_SPLITS) { reasons.push(`area_model ${key} holds at most ${AREA_MAX_SPLITS} parts`); return null; }
    let ok = true;
    v.forEach((x, i) => {
      if (!isNum(x) || x <= 0) { reasons.push(`area_model ${key}[${i}] must be a number > 0`); ok = false; return; }
      if (!numberIsFromText(x, text)) reasons.push(`number ${x} in params.${key}[${i}] does not come from the problem text`);
    });
    return ok ? (v as number[]) : null;
  };
  const rows = sides('rows'), cols = sides('cols');
  if (!rows || !cols) return reasons;
  const cl = params.cellLabels;
  if (cl !== undefined) {
    if (!Array.isArray(cl) || cl.length !== rows.length || cl.some((r) => !Array.isArray(r) || r.length !== cols.length)) {
      return [...reasons, `area_model cellLabels must be a ${rows.length}×${cols.length} matrix`];
    }
    (cl as unknown[][]).forEach((r, i) => r.forEach((v, j) => reasons.push(...drawnLabelReasons(v, `params.cellLabels[${i}][${j}]`, text))));
  }
  // The renderer prints cellLabels[i][j] when given, else the product (showProducts defaults to true in the solver).
  if (params.showProducts !== false && cl === undefined && !rows.every((r) => cols.every((c) => numberIsFromText(r * c, text)))) {
    reasons.push('area model products are computed, not stated; set showProducts false');
  }
  return reasons.length ? reasons : solves('area_model', params);
}

const INEQUALITY_OPERATORS = ['<', '>', '<=', '>='] as const;
type InequalityOperator = (typeof INEQUALITY_OPERATORS)[number];
/** How a sheet may write each operator (plain, Unicode, LaTeX), and its mirror for the reversed form "3 ≤ x". */
const OPERATOR_SPELLINGS: Record<InequalityOperator, readonly string[]> = {
  '<': ['<', '\\lt'],
  '>': ['>', '\\gt'],
  '<=': ['<=', '≤', '⩽', '\\leq', '\\le'],
  '>=': ['>=', '≥', '⩾', '\\geq', '\\ge'],
};
const MIRROR: Record<InequalityOperator, InequalityOperator> = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
const reEsc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NUM_RE = String.raw`(-?\d[\d,]*(?:\.\d+)?(?:\/\d+)?)`;

/**
 * Is `variable operator value` written in the text: "x ≥ 3" (any spelling of
 * the operator, inside $…$ or not), or reversed, "3 ≤ x" (so each half of
 * "−2 < x ≤ 5" counts)? The value is compared as a number.
 */
export function inequalityIsStated(variable: string, operator: InequalityOperator, value: number, problemText: string): boolean {
  const text = normalise(problemText);
  const v = reEsc(variable);
  const ops = (op: InequalityOperator) => `(?:${[...OPERATOR_SPELLINGS[op]].sort((a, b) => b.length - a.length).map((o) => `${reEsc(o)}(?![A-Za-z=])`).join('|')})`;
  const forms = [
    new RegExp(String.raw`(?<![A-Za-z0-9_])${v}\s*${ops(operator)}\s*${NUM_RE}(?![\d])`, 'g'),
    new RegExp(String.raw`(?<![A-Za-z0-9.])${NUM_RE}\s*${ops(MIRROR[operator])}\s*${v}(?![A-Za-z0-9_])`, 'g'),
  ];
  return forms.some((re) => [...text.matchAll(re)].some((m) => {
    const n = parseNumberCell(m[1]);
    return n !== null && Math.abs(n - value) <= 1e-9 * Math.max(1, Math.abs(value));
  }));
}

/**
 * inequality_graph: the board draws the solution ray of `variable operator
 * value` on a number line, so the drawn inequality must be one the sheet
 * states, never one the student solves for: the boundary value is a stated
 * number, and the whole inequality (the solver's default variable "x"
 * included when variable is left out) is written in the text. The number
 * line's span and ticks are scaffolding.
 */
function validateInequalityGraph(params: Record<string, unknown>, ctx: FigureContext): string[] {
  const text = ctx.problemText;
  const reasons = unusedParams('inequality_graph', params, ['variable', 'operator', 'value', 'title']);
  reasons.push(...textFieldReasons([{ value: params.title }], text));
  if (params.variable !== undefined && (typeof params.variable !== 'string' || !/^[A-Za-z]$/.test(params.variable.trim()))) {
    reasons.push('inequality_graph variable must be a single letter');
  }
  const op = params.operator;
  if (!INEQUALITY_OPERATORS.includes(op as InequalityOperator)) reasons.push(`inequality_graph operator must be one of ${INEQUALITY_OPERATORS.join(', ')}`);
  const value = params.value;
  if (!isNum(value)) reasons.push('inequality_graph value must be a finite number');
  if (reasons.length) return reasons;
  const variable = typeof params.variable === 'string' ? params.variable.trim() : 'x';
  if (!numberIsFromText(value as number, text)) return [`number ${value} in params.value does not come from the problem text`];
  if (!inequalityIsStated(variable, op as InequalityOperator, value as number, text)) {
    return [`the inequality ${variable} ${String(op)} ${value} is not stated in the problem text (a solution the student finds is never drawn; for a number line the sheet draws, use showNumberLine)`];
  }
  return solves('inequality_graph', params);
}

/** Bounds for the homework gate (the thumbnail draws no more than this). */
export const GRID_MAX_POINTS = 40;

/**
 * coordinate_grid: every plotted point at stated coordinates (an unlabelled
 * point prints its own coordinates, which are then stated too), labels and
 * the title from the text. quadrants and the x/y bounds are scaffolding
 * (structure only). After the gate, the solved grid (its auto-fit, clamped
 * to a 30-unit span) must hold every point: a point off the grid is not drawn.
 */
function validateCoordinateGrid(params: Record<string, unknown>, ctx: FigureContext): string[] {
  const text = ctx.problemText;
  const reasons = unusedParams('coordinate_grid', params, ['points', 'quadrants', 'xMin', 'xMax', 'yMin', 'yMax', 'connect', 'title']);
  reasons.push(...textFieldReasons([{ value: params.title }], text));
  if (params.quadrants !== undefined && params.quadrants !== 1 && params.quadrants !== 4) reasons.push('coordinate_grid quadrants must be 1 or 4');
  if (params.connect !== undefined && typeof params.connect !== 'boolean') reasons.push('coordinate_grid connect must be true or false');
  for (const k of ['xMin', 'xMax', 'yMin', 'yMax']) if (params[k] !== undefined && !isNum(params[k])) reasons.push(`coordinate_grid ${k} must be a finite number`);
  const pts = params.points;
  if (pts !== undefined && !Array.isArray(pts)) return [...reasons, 'coordinate_grid points must be an array of { x, y, label? }'];
  const points = (pts ?? []) as unknown[];
  if (points.length > GRID_MAX_POINTS) return [...reasons, `coordinate_grid holds at most ${GRID_MAX_POINTS} points`];
  points.forEach((raw, i) => {
    const where = `params.points[${i}]`;
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) { reasons.push(`${where} must be { x, y, label? }`); return; }
    const p = raw as Record<string, unknown>;
    for (const k of Object.keys(p).filter((x) => p[x] !== undefined && !['x', 'y', 'label', 'color'].includes(x))) reasons.push(`${where} field "${k}" is not used`);
    if (p.color !== undefined && typeof p.color !== 'string') reasons.push(`${where}: color must be a string`);
    if (p.label !== undefined && typeof p.label !== 'string') reasons.push(`${where}: label must be a string`);
    else reasons.push(...textFieldReasons([{ value: p.label }], text));
    if (!isNum(p.x) || !isNum(p.y)) { reasons.push(`${where}: x and y must be finite numbers`); return; }
    if (!numberIsFromText(p.x, text)) reasons.push(`number ${p.x} in ${where}.x does not come from the problem text`);
    if (!numberIsFromText(p.y, text)) reasons.push(`number ${p.y} in ${where}.y does not come from the problem text`);
  });
  if (reasons.length) return reasons;
  try {
    const g = solveDiagram('coordinate_grid', params) as unknown as { xMin: number; xMax: number; yMin: number; yMax: number };
    points.forEach((raw, i) => {
      const p = raw as { x: number; y: number };
      if (p.x < g.xMin || p.x > g.xMax || p.y < g.yMin || p.y > g.yMax) {
        reasons.push(`point (${p.x}, ${p.y}) in params.points[${i}] is off the grid (x ${g.xMin}..${g.xMax}, y ${g.yMin}..${g.yMax}); widen the bounds`);
      }
    });
    return reasons;
  } catch (e) {
    return [`coordinate_grid does not solve: ${(e as Error).message}`];
  }
}

/** Dispatches on the catalog kind; a kind with no case here is not reached (the vocabulary gate names it first). */
export function validateDiagramFigure(fig: DiagramFigure, ctx: FigureContext): string[] {
  const params = fig.params;
  if (!params || typeof params !== 'object' || Array.isArray(params)) return [`showDiagram ${String(fig.type)} needs params`];
  const extra = Object.keys(fig as unknown as Record<string, unknown>).filter((k) => !['action', 'type', 'params'].includes(k) && (fig as unknown as Record<string, unknown>)[k] !== undefined);
  const reasons = extra.map((k) => `showDiagram field "${k}" is not used (put it in params)`);
  switch (fig.type) {
    case 'solid_3d': return [...reasons, ...validateSolid3D(params, ctx)];
    case 'tape_diagram': return [...reasons, ...validateTape(params, ctx)];
    case 'area_model': return [...reasons, ...validateAreaModel(params, ctx)];
    case 'inequality_graph': return [...reasons, ...validateInequalityGraph(params, ctx)];
    case 'coordinate_grid': return [...reasons, ...validateCoordinateGrid(params, ctx)];
    default: return [...reasons, `unsupported figure kind "showDiagram:${String(fig.type)}"`];
  }
}
