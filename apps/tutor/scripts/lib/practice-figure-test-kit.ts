/**
 * What the batch-4 renderer tests share (scripts/test-practice-figure-batch4*.ts):
 * the tiny runner, the SVG probes, and the invariants EVERY fixture of the
 * round must hold — the pinned client vocabulary, no type under 10 px at
 * 340 px, clean legibility unless the note says "warns", the fixture
 * conventions (simple / dense / blank), and the academy client's own
 * sanitiser under jsdom, unaltered.
 *
 * Pure: no database, no network, no model.
 */
import './no-db-env';
import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { PracticeFigureSpecError, renderPracticeFigure, type PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { checkFigureLegibility } from '../../src/lib/tutor/practice-figure/legibility';
import { Reader } from '../../src/lib/tutor/practice-figure/spec';
import type { FigureFixture } from './practice-figure-fixtures';

export type Params = Record<string, unknown>;

/** A runner: `test(name, fn)` (sync or async) and `finish()` — prints the totals, exits 1 on a failure. */
export function makeRunner(): { test: (name: string, fn: () => void | Promise<void>) => void; finish: () => Promise<void> } {
  let passed = 0;
  let failed = 0;
  const pending: Array<Promise<void>> = [];
  const test = (name: string, fn: () => void | Promise<void>): void => {
    const done = (e?: unknown) => {
      if (e === undefined) { passed++; console.log(`  ok - ${name}`); } else { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
    };
    try {
      const r = fn();
      if (r instanceof Promise) pending.push(r.then(() => done(), (e) => done(e ?? new Error('rejected'))));
      else done();
    } catch (e) {
      done(e);
    }
  };
  const finish = (): Promise<void> => Promise.all(pending).then(() => {
    console.log(`\n${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
  });
  return { test, finish };
}

export const svgOf = (type: string, params: Params): string => renderPracticeFigure({ type, params }).svg;
/** The text of every <text> element, in document order, entities decoded. */
export const texts = (svg: string): string[] => [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)]
  .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
export const has = (svg: string, s: string): boolean => texts(svg).includes(s);
export const count = (svg: string, re: RegExp): number => (svg.match(re) ?? []).length;
export const throwsSpec = (type: string, params: Params, re: RegExp): void => {
  assert.throws(() => renderPracticeFigure({ type, params }), (e: unknown) => e instanceof PracticeFigureSpecError && re.test(e.message), `${type}: ${re}`);
};
/** The legibility warning codes of a spec. */
export const warn = (type: string, params: Params): string[] => checkFigureLegibility({ type, params }).map((w) => w.code);
export const reader = (type: string, params: Params): Reader => new Reader(type, params);
export const near = (a: number, b: number, tol = 1e-9): void => assert.ok(Math.abs(a - b) <= tol, `${a} ≠ ${b}`);

export const PINNED_ELEMENTS = ['circle', 'clipPath', 'defs', 'g', 'line', 'marker', 'path', 'polygon', 'rect', 'svg', 'text', 'tspan'];
export const PINNED_ATTRS = ['clip-path', 'cx', 'cy', 'd', 'dominant-baseline', 'dy', 'fill', 'font-family', 'font-size', 'font-style', 'font-weight', 'height', 'id', 'marker-end', 'markerHeight', 'markerWidth', 'orient', 'paint-order', 'points', 'preserveAspectRatio', 'r', 'refX', 'refY', 'role', 'rx', 'stroke', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'text-anchor', 'transform', 'viewBox', 'width', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2'];

/** Elements and attributes of an SVG outside the pinned client vocabulary ([] when there are none). */
export function outsideVocabulary(svg: string): string[] {
  const out: string[] = [];
  for (const m of svg.matchAll(/<([A-Za-z][\w:-]*)((?:\s+[\w:-]+="[^"]*")*)\s*\/?>/g)) {
    if (!PINNED_ELEMENTS.includes(m[1])) out.push(`element <${m[1]}>`);
    for (const a of m[2].matchAll(/\s([\w:-]+)="/g)) if (!PINNED_ATTRS.includes(a[1])) out.push(`attribute ${a[1]} on <${m[1]}>`);
  }
  if (/opacity|<style|<title|<desc|data-|aria-|href|<pattern|Gradient|<image|<use/.test(svg)) out.push('a forbidden construct (opacity, style, title, desc, data-*, aria-*, href, pattern, gradient, image, use)');
  if (!(/^<svg [^>]*viewBox="0 0 360 \d+" role="img"/.test(svg) && svg.includes('fill="#ffffff"/>'))) out.push('root without the 360-wide viewBox, role="img" and the white background');
  return out;
}

/** The smallest type of an SVG as it prints at 340 px (the lowered 8-unit subscript letter apart). */
export function minTypeAt340(svg: string): number {
  const sizes = [...svg.matchAll(/<(?:text|tspan)\b[^>]*\sfont-size="([\d.]+)"/g)].map((m) => Number(m[1])).filter((s) => s !== 8);
  return sizes.length ? (Math.min(...sizes) * 340) / 360 : Infinity;
}

export const ACADEMY = '/Users/luke/Dev/academy/.claude/worktrees/greenapple-pilot';
/** The academy client's own figure-svg.ts (read-only import, under jsdom), or null when that worktree is not on this machine. */
export async function academySanitiser(): Promise<((svg: string) => { svg: string } | { problem: string }) | null> {
  if (!fs.existsSync(path.join(ACADEMY, 'apps/web/lib/figure-svg.ts'))) return null;
  const req = createRequire(path.join(ACADEMY, 'package.json'));
  const { JSDOM } = req('jsdom') as { JSDOM: new (html: string) => { window: Record<string, unknown> } };
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  const g = globalThis as Record<string, unknown>;
  for (const k of ['document', 'DOMParser', 'Node', 'Element', 'NodeFilter', 'HTMLTemplateElement', 'DocumentFragment', 'NamedNodeMap', 'HTMLFormElement']) g[k] = dom.window[k];
  g.window = dom.window;
  const client = (await import(path.join(ACADEMY, 'apps/web/lib/figure-svg.ts'))) as { inspectFigureSvg(svg: string): { svg: string } | { problem: string } };
  return (svg) => client.inspectFigureSvg(svg);
}

/**
 * The invariants of a set of fixtures, as tests on `test`:
 * `groups` maps a new kind or variant to the id prefix of its fixtures (≥ 3:
 * a "simple" note, a "dense" note, a "blank" id that shows a "?");
 * `fixes` lists the to-do letters that must each have a `fix4-<letter>-` fixture whose note starts "<letter>: ".
 */
export function fixtureInvariants(test: (name: string, fn: () => void | Promise<void>) => void, fixtures: FigureFixture[], groups: Record<string, string>, fixes: string[] = []): Map<string, string> {
  const rendered = new Map<string, string>(fixtures.map((f) => [f.id, renderPracticeFigure(f.spec).svg]));
  test('fixture conventions: every new kind / variant has ≥ 3 fixtures (simple, dense, a blank that shows "?"); every fix has one; every fixture belongs to a group or a fix', () => {
    for (const [what, prefix] of Object.entries(groups)) {
      const mine = fixtures.filter((f) => f.id.startsWith(prefix));
      assert.ok(mine.length >= 3, `${what}: ${mine.length} fixtures`);
      assert.ok(mine.some((f) => /^simple/.test(f.note)), `${what}: a simple fixture`);
      assert.ok(mine.some((f) => /dense/.test(f.note)), `${what}: a dense fixture`);
      const blank = mine.filter((f) => /blank/.test(f.id));
      assert.ok(blank.length >= 1, `${what}: a fixture with a blank`);
      for (const b of blank) assert.ok(texts(rendered.get(b.id) as string).some((t) => t.includes('?')), `${b.id} shows a "?"`);
    }
    for (const letter of fixes) assert.ok(fixtures.some((f) => f.id.startsWith(`fix4-${letter}-`) && f.note.startsWith(`${letter}: `)), `fix ${letter} has a fixture`);
    for (const f of fixtures) assert.ok(/^fix4-[a-h]-/.test(f.id) || Object.values(groups).some((p) => f.id.startsWith(p)), `${f.id} belongs to no group`);
    for (const f of fixtures) assert.ok(f.question.trim() && f.alt.trim() && f.note.trim(), `${f.id}: note, question and alt`);
  });
  test('only the pinned client vocabulary — no <ellipse>, <polyline>, opacity, style, data-*, aria-*, title, pattern, gradient, image, link', () => {
    for (const f of fixtures) assert.deepEqual(outsideVocabulary(rendered.get(f.id) as string), [], f.id);
  });
  test('no type under 10 px at 340 px (a lowered subscript letter apart)', () => {
    for (const f of fixtures) assert.ok(minTypeAt340(rendered.get(f.id) as string) >= 10, `${f.id}: ${minTypeAt340(rendered.get(f.id) as string)}`);
  });
  test('every fixture is clean under checkFigureLegibility unless its note says it warns', () => {
    for (const f of fixtures) {
      const w = checkFigureLegibility(f.spec);
      if (/warns/.test(f.note)) assert.ok(w.length > 0, `${f.id} should warn`);
      else assert.deepEqual(w, [], `${f.id}: ${w.map((x) => `${x.code}: ${x.message}`).join(' | ')}`);
    }
  });
  test('deterministic: the same spec gives the same string, and a deep copy of it too', () => {
    for (const f of fixtures) assert.equal(renderPracticeFigure(JSON.parse(JSON.stringify(f.spec)) as PracticeFigureSpec).svg, rendered.get(f.id), f.id);
  });
  test("the academy client's own sanitiser (apps/web/lib/figure-svg.ts, unaltered, under jsdom) accepts every fixture (it reports a problem for any figure it would have to alter)", async () => {
    const inspect = await academySanitiser();
    if (!inspect) {
      console.log('    (skipped: the academy worktree is not on this machine)');
      return;
    }
    for (const f of fixtures) {
      const res = inspect(rendered.get(f.id) as string);
      assert.ok(!('problem' in res), `${f.id}: ${'problem' in res ? res.problem : ''}`);
    }
  });
  return rendered;
}
