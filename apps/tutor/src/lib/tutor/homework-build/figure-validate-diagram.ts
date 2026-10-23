/**
 * Validators for the showDiagram homework figures (catalog kinds). The
 * catalog solvers are forgiving by design for the live tutor: solid_3d maps
 * aliases (`pyramid`, `ball`), falls back to a rectangular prism for an
 * unknown shape, and fills a missing dimension from its defaults. A homework
 * figure must never draw a guess, so the gate here is exact: the shape is one
 * of the solver's own keys, the dims are exactly that shape's keys, and every
 * dimension is a number the problem text states. The solver itself is not
 * changed (shared live code). Pure.
 */

import { solveDiagram } from '../diagrams/catalog/manifest';
import { numberIsFromText, textFieldReasons } from './figure-text';
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

/** Dispatches on the catalog kind; a kind with no case here is not reached (the vocabulary gate names it first). */
export function validateDiagramFigure(fig: DiagramFigure, ctx: FigureContext): string[] {
  const params = fig.params;
  if (!params || typeof params !== 'object' || Array.isArray(params)) return [`showDiagram ${String(fig.type)} needs params`];
  const extra = Object.keys(fig as unknown as Record<string, unknown>).filter((k) => !['action', 'type', 'params'].includes(k) && (fig as unknown as Record<string, unknown>)[k] !== undefined);
  const reasons = extra.map((k) => `showDiagram field "${k}" is not used (put it in params)`);
  switch (fig.type) {
    case 'solid_3d': return [...reasons, ...validateSolid3D(params, ctx)];
    default: return [...reasons, `unsupported figure kind "showDiagram:${String(fig.type)}"`];
  }
}
