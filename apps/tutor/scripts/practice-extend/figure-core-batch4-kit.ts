/**
 * What the parts of figure-core-batch4.ts share (figure-core-batch4-<part>.ts):
 * the refusal, the model reader, the `Derived` builders and the argument
 * readers — the same helpers figure-core-batch3.ts keeps to itself.
 *
 * A part exports one `Batch4Part`: the kinds it speaks for, `describe` (the
 * TEXT transcription — exactly what is visible; returns the "a … diagram"
 * phrase for "The figure is …", or '' when the spec is not its own) and its
 * deterministic checkers. figure-core-batch4.ts collects the parts.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import '../lib/no-db-env';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { PracticeFigureSpecError, Reader } from '../../src/lib/tutor/practice-figure/spec';
import type { Derived } from './figure-core';
import { Batch2RuleError } from './figure-core-batch2';

export type P = Record<string, unknown>;
/** A refusal: thrown as figure-core-batch2.ts's `Batch2RuleError`, which figure-core.ts rethrows as its `FigureRuleError`. */
export function fail(m: string): never {
  throw new Batch2RuleError(m);
}
export const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
export const fmt = (v: number): string => { const r = Number(v.toPrecision(10)); return String(Object.is(r, -0) ? 0 : r); };
export const BLANK = '(blank — a "?" box)';
/** A printed label as a transcription quotes it; a "?" is a blank, never the value under it. */
export const shown = (s: string): string => (s === '?' ? BLANK : `"${s}"`);
export const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;

/** The model the renderer draws from; a spec the renderer refuses is refused here in the same words. */
export function modelOf<T>(spec: PracticeFigureSpec, build: (r: Reader) => T): T {
  try {
    return build(new Reader(spec.type, spec.params));
  } catch (e) {
    if (e instanceof PracticeFigureSpecError) return fail(e.message.replace(/^\[practice-figure:[^\]]+\]\s*/, ''));
    throw e;
  }
}
export const num = (v: number): Derived => ({ kind: 'number', value: Number(v.toPrecision(12)) });
export const approx = (v: number): Derived => ({ kind: 'number', value: Number(v.toPrecision(12)), approx: true });
export const nums = (values: number[]): Derived => ({ kind: 'numbers', values: values.map((v) => Number(v.toPrecision(12))) });
export const text = (value: string): Derived => ({ kind: 'text', value });
export const label = (value: string): Derived => ({ kind: 'label', value });
/** Exact when it has at most four decimals, otherwise a rounded value. */
export const measured = (v: number): Derived => (Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-6 ? num(Math.round(v * 1e4) / 1e4) : approx(v));
export function argIndex(a: P, k: string, n: number, what: string): number {
  const v = a[k] === undefined ? 0 : a[k];
  if (!isNum(v) || !Number.isInteger(v) || v < 0 || v >= n) return fail(`derivation argument "${k}" must be the 0-based index of a ${what} (0 to ${n - 1})`);
  return v;
}
export function argStr(a: P, k: string): string {
  const v = a[k];
  if (typeof v !== 'string' || !v.trim()) return fail(`derivation argument "${k}" must be a name printed on (or given in) the figure`);
  return v.trim();
}
export function argNum(a: P, k: string): number {
  const v = a[k];
  if (!isNum(v)) return fail(`derivation argument "${k}" must be a number`);
  return v;
}
export const pick = <T extends string>(a: P, k: string, allowed: readonly T[], dflt?: T): T => {
  const v = a[k] === undefined && dflt !== undefined ? dflt : a[k];
  if (typeof v !== 'string' || !allowed.includes(v as T)) return fail(`derivation argument "${k}" must be one of ${allowed.join(' | ')}`);
  return v as T;
};

export interface Batch4CheckerDef {
  /** The figure kinds (spec.type) the checker reads. */
  kinds: string[];
  args: string;
  returns: string;
  run: (spec: PracticeFigureSpec, args: P) => Derived;
}
export interface Batch4Part {
  kinds: readonly string[];
  /** Fills `printed` ('role: "text"' lines, as the other batches) and `out`; returns the kind phrase, or '' when the spec is not this part's. */
  describe: (spec: PracticeFigureSpec, printed: string[], out: string[]) => string;
  checkers: Record<string, Batch4CheckerDef>;
}
