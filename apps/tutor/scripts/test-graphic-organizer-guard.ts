/**
 * show_graphic_organizer input guard — normalizeGraphicOrganizerSpec /
 * toOrganizerItems (src/lib/tutor/validation/graphic-organizer-guard.ts) and
 * the renderer's own never-throw contract.
 *
 * 2026-10-05 (live text session): the brain called show_graphic_organizer
 * without the arrays its layout needs, the renderer did `spec.<field>.map`
 * on undefined, and the whole page fell over ("This page couldn't load").
 *
 * Pure/deterministic. No DB, no LLM calls.
 *
 * Usage: npx tsx scripts/test-graphic-organizer-guard.ts
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  normalizeGraphicOrganizerSpec,
  toOrganizerItems,
} from '../src/lib/tutor/validation/graphic-organizer-guard';
import GraphicOrganizerRenderer from '../src/app/tutor/components/whiteboard/GraphicOrganizerRenderer';

let passed = 0;
let failed = 0;
function assert(cond: boolean, name: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`); }
}
function eq(a: unknown, b: unknown, name: string) {
  const ok = JSON.stringify(a) === JSON.stringify(b);
  if (!ok) console.log(`    got      ${JSON.stringify(a)}\n    expected ${JSON.stringify(b)}`);
  assert(ok, name);
}
const norm = (raw: unknown) => normalizeGraphicOrganizerSpec(raw);
const dropped = (raw: unknown, reason: string, name: string) => {
  const r = norm(raw);
  if (r.ok || r.reason !== reason) console.log(`    got ${JSON.stringify(r)}`);
  assert(!r.ok && r.reason === reason, name);
};

console.log('\ntoOrganizerItems');
eq(toOrganizerItems(undefined), [], 'undefined → []');
eq(toOrganizerItems(null), [], 'null → []');
eq(toOrganizerItems({ a: 1 }), [], 'plain object → []');
eq(toOrganizerItems(42), ['42'], 'a lone number → one item');
eq(toOrganizerItems('just one'), ['just one'], 'a lone string → one item');
eq(toOrganizerItems('["a","b"]'), ['a', 'b'], 'a JSON-encoded array string is unpacked');
eq(toOrganizerItems('[not json'), ['[not json'], 'a string that only looks like JSON stays one item');
eq(toOrganizerItems(['a', ' b ', '', '   ']), ['a', 'b'], 'strings trimmed, blanks removed');
eq(toOrganizerItems(['a', 3, true, null, undefined]), ['a', '3', 'true'], 'numbers / booleans stringified, null / undefined removed');
eq(toOrganizerItems([{ text: 'from text' }, { label: 'from label' }, { foo: 'x' }, ['nested']]), ['from text', 'from label'], 'objects contribute their text / label, anything else is removed');
eq(toOrganizerItems([NaN, Infinity]), [], 'non-finite numbers removed');

console.log('\nDropped: not an organizer at all');
dropped(undefined, 'not-an-object', 'undefined');
dropped(null, 'not-an-object', 'null');
dropped('t_chart', 'not-an-object', 'a string');
dropped(['t_chart'], 'not-an-object', 'an array');
dropped({}, 'unknown-kind', 'no kind');
dropped({ kind: 'venn', leftItems: ['a'] }, 'unknown-kind', 'a kind the renderer has no layout for');
dropped({ kind: 7 }, 'unknown-kind', 'non-string kind');

console.log('\nDropped: the arrays the layout requires are missing');
dropped({ kind: 't_chart', leftHeader: 'Pros', rightHeader: 'Cons' }, 'missing-required', 't_chart with headers but no items on either side (the crash shape)');
dropped({ kind: 't_chart', leftItems: [], rightItems: [null, ''] }, 'missing-required', 't_chart whose items are all unusable');
dropped({ kind: 'sequence' }, 'missing-required', 'sequence with no steps');
dropped({ kind: 'sequence', steps: {} }, 'missing-required', 'sequence with a non-array steps');
dropped({ kind: 'cause_effect' }, 'missing-required', 'cause_effect with neither side');
dropped({ kind: 'cause_effect', causes: ['rain'] }, 'missing-required', 'cause_effect with causes but no effects');
dropped({ kind: 'cause_effect', effects: ['flood'] }, 'missing-required', 'cause_effect with effects but no causes');
dropped({ kind: 'kwl' }, 'missing-required', 'kwl with none of the three columns');
dropped({ kind: 'kwl', know: [], want: 'x'.repeat(0), learned: [{}] }, 'missing-required', 'kwl whose columns are all empty / unusable');
dropped({ kind: 'story_map', title: 'Only a title' }, 'missing-required', 'story_map with none of the four boxes');
dropped({ kind: 'story_map', character: '   ', setting: 5 }, 'missing-required', 'story_map with only blank / non-text boxes');

console.log('\nNormalized: renderable, optional parts filled in');
eq(norm({ kind: 't_chart', leftItems: ['a'] }),
  { ok: true, spec: { kind: 't_chart', leftHeader: '', rightHeader: '', leftItems: ['a'], rightItems: [] } },
  't_chart with one side only → other side [] and blank headers');
eq(norm({ kind: 't_chart', title: ' Compare ', leftHeader: 'Pros', rightHeader: 9, leftItems: 'one', rightItems: ['x', 2, null] }),
  { ok: true, spec: { kind: 't_chart', title: 'Compare', leftHeader: 'Pros', rightHeader: '9', leftItems: ['one'], rightItems: ['x', '2'] } },
  't_chart: title trimmed, numeric header stringified, lone string item wrapped, bad items removed');
eq(norm({ kind: 'kwl', know: ['plants need light'] }),
  { ok: true, spec: { kind: 'kwl', know: ['plants need light'], want: [], learned: [] } },
  'kwl with only K (the usual opening state) → W and L become []');
eq(norm({ kind: 'sequence', steps: ['first', { text: 'second' }, 3] }),
  { ok: true, spec: { kind: 'sequence', steps: ['first', 'second', '3'] } },
  'sequence: mixed step items coerced to text');
eq(norm({ kind: 'cause_effect', causes: 'heavy rain', effects: ['flood'] }),
  { ok: true, spec: { kind: 'cause_effect', causes: ['heavy rain'], effects: ['flood'] } },
  'cause_effect: a lone-string side is wrapped');
eq(norm({ kind: 'story_map', character: 'Max', problem: 42, title: {} }),
  { ok: true, spec: { kind: 'story_map', character: 'Max' } },
  'story_map with one usable box: non-text boxes and a non-text title are removed');
eq(norm({ kind: ' T-Chart ', leftItems: ['a'], rightItems: ['b'] }).ok, true, 'kind spelling is forgiven (case / hyphen / spaces)');
eq((norm({ kind: 'Cause Effect', causes: ['a'], effects: ['b'] }) as { spec?: { kind: string } }).spec?.kind, 'cause_effect', '"Cause Effect" → cause_effect');
eq(norm({ kind: 'sequence', steps: ['a'], leftItems: 'junk', bogus: { deep: 1 } }),
  { ok: true, spec: { kind: 'sequence', steps: ['a'] } },
  'fields that belong to another layout / unknown fields are not carried over');

console.log('\nValid specs pass through unchanged');
const valid: unknown[] = [
  { kind: 'story_map', title: 'T', character: 'c', setting: 's', problem: 'p', solution: 'so' },
  { kind: 'kwl', title: 'T', know: ['k'], want: ['w'], learned: ['l'] },
  { kind: 't_chart', title: 'T', leftHeader: 'L', rightHeader: 'R', leftItems: ['a'], rightItems: ['b'] },
  { kind: 'sequence', title: 'T', steps: ['a', 'b', 'c'] },
  { kind: 'cause_effect', title: 'T', causes: ['a'], effects: ['b'] },
];
for (const v of valid) {
  const r = norm(v);
  eq(r.ok ? r.spec : r, v, `${(v as { kind: string }).kind} unchanged`);
}
{
  const input = { kind: 'sequence', steps: ['a', 2] };
  norm(input);
  eq(input, { kind: 'sequence', steps: ['a', 2] }, 'the input object is never mutated');
}

console.log('\nNever throws');
{
  const hostile: unknown[] = [
    Object.create(null),
    new Proxy({}, { get() { throw new Error('boom'); } }),
    { kind: 't_chart', get leftItems() { throw new Error('boom'); } },
    { kind: 'sequence', steps: [{ get text() { throw new Error('boom'); } }] },
    Symbol('x'), 12n, () => 1,
  ];
  let threw = false;
  for (const h of hostile) {
    try { const r = norm(h); if (r.ok !== true && r.ok !== false) threw = true; } catch { threw = true; }
  }
  assert(!threw, 'hostile inputs yield a decision, not an exception');
}

console.log('\nRenderer: any spec renders without throwing');
{
  const render = (spec: unknown) =>
    renderToStaticMarkup(React.createElement(GraphicOrganizerRenderer, { spec: spec as never }));
  const malformed: unknown[] = [
    undefined, null, 'x', 7, [], {},
    { kind: 'venn' },
    { kind: 't_chart' },
    { kind: 't_chart', leftHeader: 'Pros', rightHeader: 'Cons' },
    { kind: 't_chart', leftItems: 'oops', rightItems: { a: 1 } },
    { kind: 't_chart', leftHeader: { a: 1 }, leftItems: [{ a: 1 }, null, ['x'], 3] },
    { kind: 'kwl' },
    { kind: 'kwl', know: [{ nested: true }], want: null, learned: 5 },
    { kind: 'sequence' },
    { kind: 'sequence', steps: [] },
    { kind: 'sequence', steps: [{ a: 1 }, null] },
    { kind: 'cause_effect' },
    { kind: 'cause_effect', causes: ['a'] },
    { kind: 'cause_effect', effects: [{ x: 1 }] },
    { kind: 'story_map', character: { a: 1 }, setting: ['x'], title: { t: 1 } },
  ];
  for (const m of malformed) {
    let ok = true;
    let html = '';
    try { html = render(m); } catch (e) { ok = false; console.log(`    threw: ${(e as Error).message}`); }
    assert(ok, `renders: ${JSON.stringify(m) ?? String(m)}`);
    assert(!/NaN|Infinity|\[object Object\]/.test(html), `  …and paints no NaN / [object Object]: ${JSON.stringify(m) ?? String(m)}`);
  }
  eq(render(undefined), '', 'no spec → renders nothing');
  eq(render({ kind: 'sequence' }), '', 'a spec with nothing to show → renders nothing (no empty frame)');
  const good = render({ kind: 't_chart', leftHeader: 'Pros', rightHeader: 'Cons', leftItems: ['cheap'], rightItems: ['slow'] });
  assert(good.includes('Pros') && good.includes('Cons') && good.includes('cheap') && good.includes('slow'), 'a valid t_chart still paints its headers and items');
  const partial = render({ kind: 't_chart', leftHeader: 'Pros', leftItems: ['cheap', 4] });
  assert(partial.includes('cheap') && partial.includes('• 4'), 'a one-sided t_chart with a numeric item paints what it has');
  const seq = render({ kind: 'sequence', steps: ['one', 'two'] });
  assert(seq.includes('step 1') && seq.includes('step 2') && seq.includes('two'), 'a valid sequence still paints its steps');
}

console.log('\nWiring');
{
  const root = join(__dirname, '..');
  const vtr = readFileSync(join(root, 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert(vtr.includes("from '@/lib/tutor/validation/graphic-organizer-guard'"), 'VoiceTutorRealtime imports the guard');
  assert(vtr.includes("onDebugEvent?.('tool_call_soft_drop', `show_graphic_organizer ("), 'a malformed organizer is a soft drop (debug event), not a rejection — the turn continues');
  const canvas = readFileSync(join(root, 'src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx'), 'utf8');
  const wrapped = canvas.match(/<BoardItemErrorBoundary[^>]*>\s*<CommandRenderer /g) ?? [];
  const bare = canvas.match(/<CommandRenderer /g) ?? [];
  assert(wrapped.length >= 1 && wrapped.length === bare.length, `every board item is rendered inside the error boundary (${wrapped.length}/${bare.length})`);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
