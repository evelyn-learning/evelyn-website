/**
 * Tree diagrams (show_tree): a tree the model can actually send must render,
 * and sibling branch labels must not sit on top of each other.
 *
 * Fixtures are the trees from two live sessions on 2026-10-09
 * (embed-1791563451824, embed-1791566042708): the numeric-probability ones
 * showed "This part of the board couldn't be shown", the others drew both
 * branches' labels over each other.
 *
 * Run: npm run test:tree-renderer
 */
import { strict as assert } from 'node:assert';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TreeRenderer, buildTreeManifest, normalizeTreeNode } from '../src/app/tutor/components/whiteboard/TreeRenderer';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`PASS  ${name}`); passed++; }
  catch (err) { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const render = (root: any, extra: Record<string, unknown> = {}) =>
  renderToStaticMarkup(<TreeRenderer root={root} type="probability" {...extra} />);

/** Horizontal extent of every <text> that carries a text-anchor of start/end (the branch labels). */
function branchLabelExtents(svg: string): Array<{ text: string; branch: string; y: number; from: number; to: number }> {
  const out: Array<{ text: string; branch: string; y: number; from: number; to: number }> = [];
  const ext = (branch: string, anchor: string, x: number, y: number, text: string) => {
    const w = text.length * 11 * 0.55;
    out.push({ text, branch, y, from: anchor === 'end' ? x - w : x, to: anchor === 'end' ? x : x + w });
  };
  const re = /<text data-branch="([^"]+)" x="([-\d.]+)" y="([-\d.]+)" text-anchor="(start|end)"[^>]*>(.*?)<\/text>/g;
  for (let m = re.exec(svg); m; m = re.exec(svg)) {
    const y = Number(m[3]);
    if (!m[5].includes('<tspan')) { ext(m[1], m[4], Number(m[2]), y, m[5]); continue; }
    let li = 0;
    for (const t of m[5].matchAll(/<tspan x="([-\d.]+)"[^>]*>(.*?)<\/tspan>/g)) ext(m[1], m[4], Number(t[1]), y + 13 * li++, t[2]);
  }
  return out;
}

function assertNoOverlap(svg: string) {
  const labels = branchLabelExtents(svg);
  assert.ok(labels.length >= 4, `found ${labels.length} branch label lines`);
  for (let i = 0; i < labels.length; i++) {
    for (let j = i + 1; j < labels.length; j++) {
      const a = labels[i]; const b = labels[j];
      if (a.branch === b.branch) continue; // one branch's own stacked lines
      if (Math.abs(a.y - b.y) > 11) continue; // different rows
      assert.ok(a.to <= b.from || b.to <= a.from, `"${a.text}" [${a.from.toFixed(0)}..${a.to.toFixed(0)}] overlaps "${b.text}" [${b.from.toFixed(0)}..${b.to.toFixed(0)}]`);
    }
  }
}

const WORDS = { label: 'Item Box', children: [
  { label: 'Banana', probability: 'more likely', node: { label: '😐' } },
  { label: 'Red Shell', probability: 'less likely', node: { label: '🔴' } },
] };
const NUMERIC = { label: 'Item Box', children: [
  { label: '😐 banana (3 slots)', probability: 0.75, node: { label: '75% chance' } },
  { label: '🔴 red shell (1 slot)', probability: 0.25, node: { label: '25% chance' } },
] };
const PERCENT = { label: 'Item Box', children: [
  { label: 'likely outcome', probability: '75%', node: { label: 'Banana', color: '#eab308' } },
  { label: 'unlikely outcome', probability: '25%', node: { label: 'Red Shell', color: '#dc2626' } },
] };

test('numeric probabilities render (they used to throw and blank the item)', () => {
  const svg = render(NUMERIC);
  assert.match(svg, />0\.75</);
  assert.match(svg, />0\.25</);
  assert.doesNotThrow(() => render(NUMERIC, { showLeafProbabilities: true }));
  assert.doesNotThrow(() => buildTreeManifest({ root: NUMERIC as never, type: 'probability' } as never));
});

test('two-branch trees from the live sessions: sibling labels do not overlap', () => {
  for (const t of [WORDS, NUMERIC, PERCENT]) assertNoOverlap(render(t));
});

test('a wrapped label follows the slanted branch instead of running into it', () => {
  const svg = render(NUMERIC);
  const branchTexts = Array.from(svg.matchAll(/<text data-branch="[^"]+"[^>]*>(.*?)<\/text>/g)).map((m) => m[1]).join('');
  const xs = Array.from(branchTexts.matchAll(/<tspan x="([-\d.]+)"/g)).map((m) => Number(m[1]));
  assert.equal(xs.length, 4, 'two wrapped labels of two lines');
  assert.ok(xs[1] < xs[0], 'left branch: the lower line sits further left');
  assert.ok(xs[3] > xs[2], 'right branch: the lower line sits further right');
});

test('labels sit outside the fan: left branch ends at it, right branch starts at it', () => {
  const svg = render(PERCENT);
  assert.match(svg, /text-anchor="end"[^>]*>75%</);
  assert.match(svg, /text-anchor="start"[^>]*>25%</);
});

test('three and four branches, long labels, a second level: still no overlap in a row', () => {
  const leaf = (l: string) => ({ label: l });
  assertNoOverlap(render({ label: 'Spin', children: [
    { label: 'lands on red', probability: '1/2', node: leaf('Red') },
    { label: 'lands on the blue section', probability: '1/3', node: leaf('Blue') },
    { label: 'lands on green', probability: '1/6', node: leaf('Green') },
  ] }));
  assertNoOverlap(render({ label: 'Draw', children: [
    { label: 'heart', probability: '1/4', node: { label: 'H', children: [{ label: 'face card', probability: '3/13', node: leaf('F') }, { label: 'number card', probability: '10/13', node: leaf('N') }] } },
    { label: 'diamond', probability: '1/4', node: leaf('D') },
    { label: 'a spade of any rank', probability: '1/4', node: leaf('S') },
    { label: 'club', probability: '1/4', node: leaf('C') },
  ] }));
});

test('malformed trees never throw', () => {
  for (const bad of [undefined, null, 7, 'x', [], {}, { label: 5 }, { label: 'a', children: 'no' }, { label: 'a', children: [null, 3, {}, { label: 9, probability: {}, node: null }, { probability: NaN, node: { label: ['x'] } }] }]) {
    assert.doesNotThrow(() => render(bad), JSON.stringify(bad));
  }
  assert.deepEqual(normalizeTreeNode({ label: 3, value: 0.5, children: [{ label: 1, probability: 0.2, node: { label: 'x' } }] }),
    { label: '3', value: '0.5', children: [{ label: '1', probability: '0.2', node: { label: 'x' } }] });
});

console.log(`\n${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
