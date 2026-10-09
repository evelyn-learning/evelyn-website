/**
 * Practice figures — what every kind's renderer shares: the spec shape, the
 * error a bad spec raises, the param reader (every failure names its param),
 * and the layout facts a renderer hands to the legibility report.
 *
 * Split out of render.ts so the kind modules under ./kinds can use them
 * without importing the module that imports them. render.ts re-exports the
 * public names, so existing imports are unchanged.
 */

export interface PracticeFigureSpec {
  type: string;
  params: Record<string, unknown>;
}

/** A spec this module cannot draw as written. The message names the param. */
export class PracticeFigureSpecError extends Error {
  constructor(public kind: string, message: string) {
    super(`[practice-figure:${kind}] ${message}`);
    this.name = 'PracticeFigureSpecError';
  }
}

// ---------------------------------------------------------------------------
// Param readers — every one fails with the param's name.
// ---------------------------------------------------------------------------

export type Params = Record<string, unknown>;

export class Reader {
  constructor(public kind: string, public p: Params) {}
  fail(message: string): never {
    throw new PracticeFigureSpecError(this.kind, message);
  }
  num(v: unknown, name: string): number {
    if (typeof v !== 'number' || !Number.isFinite(v)) this.fail(`${name} must be a finite number`);
    return v as number;
  }
  optNum(v: unknown, name: string): number | undefined {
    return v === undefined || v === null ? undefined : this.num(v, name);
  }
  positive(v: unknown, name: string): number {
    const n = this.num(v, name);
    if (!(n > 0)) this.fail(`${name} must be greater than 0`);
    return n;
  }
  optStep(v: unknown, name: string): number | undefined {
    return v === undefined || v === null ? undefined : this.positive(v, name);
  }
  range(v: unknown, name: string): [number, number] {
    if (!Array.isArray(v) || v.length !== 2) this.fail(`${name} must be [min, max]`);
    const a = this.num((v as unknown[])[0], `${name}[0]`);
    const b = this.num((v as unknown[])[1], `${name}[1]`);
    if (!(b > a)) this.fail(`${name} must have max greater than min`);
    return [a, b];
  }
  optRange(v: unknown, name: string): [number, number] | undefined {
    return v === undefined || v === null ? undefined : this.range(v, name);
  }
  str(v: unknown, name: string, max = 120): string {
    if (typeof v !== 'string' || v.trim().length === 0) this.fail(`${name} must be a non-empty string`);
    const s = (v as string).trim().replace(/\s+/g, ' ');
    if (s.length > max) this.fail(`${name} is longer than ${max} characters`);
    return s;
  }
  optStr(v: unknown, name: string, max = 120): string | undefined {
    return v === undefined || v === null || v === '' ? undefined : this.str(v, name, max);
  }
  bool(v: unknown, name: string, dflt: boolean): boolean {
    if (v === undefined || v === null) return dflt;
    if (typeof v !== 'boolean') this.fail(`${name} must be true or false`);
    return v as boolean;
  }
  list(v: unknown, name: string, min: number, max: number): unknown[] {
    if (!Array.isArray(v)) this.fail(`${name} must be an array`);
    const a = v as unknown[];
    if (a.length < min || a.length > max) this.fail(`${name} must have between ${min} and ${max} entries (has ${a.length})`);
    return a;
  }
  obj(v: unknown, name: string): Params {
    if (!v || typeof v !== 'object' || Array.isArray(v)) this.fail(`${name} must be an object`);
    return v as Params;
  }
  /** A colour is only ever a hex literal — never passed through as written. */
  color(v: unknown, fallback: string): string {
    return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v.trim()) ? v.trim() : fallback;
  }
}

/**
 * What a figure's layout came to, for `checkFigureLegibility` (legibility.ts)
 * — collected while drawing so the report can never disagree with the
 * picture. Canvas (viewBox) coordinates.
 */
export interface FigureFacts {
  plot?: { x: number; y: number; w: number; h: number };
  /** Distinct curves / line series; the pieces of one function count once. */
  curveCount: number;
  /** Every marked point, endpoint mark and series vertex, named by its param. */
  marks: Array<{ what: string; cx: number; cy: number }>;
  /** Per curve: the share of its domain that is inside the plot, and the
   *  branches the y-range cuts down to a stub. */
  curves: Array<{ what: string; visibleFraction: number; stubs: number }>;
  /** Kind-specific findings the renderer made while laying the figure out
   *  (too many elements for 340 px, a blank that leaves the figure ambiguous,
   *  an arrow drawn longer than to scale, …) — passed through as warnings. */
  notes?: Array<{ code: 'too_many_elements' | 'ambiguous_blank' | 'not_to_scale' | 'labels_overlap' | 'crowded'; message: string }>;
}

export interface Drawn {
  /** Everything inside the root, background excluded. */
  body: string;
  H: number;
  W?: number;
  facts?: FigureFacts;
}

export const HALO = 'stroke="#ffffff" stroke-width="3" paint-order="stroke" stroke-linejoin="round"';

