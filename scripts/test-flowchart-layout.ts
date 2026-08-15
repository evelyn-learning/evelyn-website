/**
 * layoutFlowchart() regression test (C3 — flowchart blank gap).
 *
 * Root cause: the longest-path depth-propagation loop walked EVERY outgoing
 * edge, including loop-back edges. Around a cycle, each iteration bumps the
 * loop members' depth again, so depth keeps climbing until the safety cap
 * (nodes.length * 4) — inflating the loop target's rank into a huge blank
 * gap on the board (plus forcing far-right gutter routing for what should
 * be an adjacent row).
 *
 * Fix: classify structural back-edges (DFS from the start node; an edge to
 * a node still on the current DFS stack) BEFORE the depth loop, and exclude
 * them from propagation. The existing position-based back-edge routing used
 * for DRAWING (CatalogCSRenderers.tsx) is untouched.
 *
 * Run: npx tsx scripts/test-flowchart-layout.ts
 */
import { layoutFlowchart, classifyFlowchartBackEdges, edgeKey } from '../apps/marketing/src/app/tutor/components/whiteboard/flowchart-layout';
import type { FlowchartNode } from '../apps/marketing/src/lib/tutor/diagrams/catalog/kinds/cs';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const ROW_H = 90;
const GAP = 28;

function node(id: string, type: FlowchartNode['type'], text?: string): FlowchartNode {
  return { id, type, text: text ?? id };
}

function widthsFor(nodes: FlowchartNode[]): Map<string, number> {
  return new Map(nodes.map((n) => [n.id, Math.max(140, n.text.length * 7 + 28)]));
}

function depthsOf(nodes: FlowchartNode[], positions: Map<string, { x: number; y: number }>): Map<string, number> {
  const out = new Map<string, number>();
  for (const n of nodes) out.set(n.id, Math.round((positions.get(n.id)!.y - 60) / ROW_H));
  return out;
}

// ── (a) minimal cycle: start → a → b → a ────────────────────────────────
{
  const nodes = [node('start', 'start'), node('a', 'process'), node('b', 'process')];
  const edges = [
    { from: 'start', to: 'a' },
    { from: 'a', to: 'b' },
    { from: 'b', to: 'a' }, // back-edge
  ];
  const { positions, maxDepth } = layoutFlowchart(nodes, edges, widthsFor(nodes), ROW_H, GAP);
  const depths = depthsOf(nodes, positions);
  check('cycle: start at depth 0', depths.get('start') === 0);
  check('cycle: a at depth 1', depths.get('a') === 1);
  check('cycle: b at depth 2 (converged, not inflated by the loop)', depths.get('b') === 2);
  check('cycle: no node deeper than node count', maxDepth < nodes.length);
}

// ── (b) acyclic chain: depths unchanged from the no-cycle case ──────────
{
  const nodes = [node('start', 'start'), node('a', 'process'), node('b', 'process'), node('end', 'end')];
  const edges = [
    { from: 'start', to: 'a' },
    { from: 'a', to: 'b' },
    { from: 'b', to: 'end' },
  ];
  const { positions } = layoutFlowchart(nodes, edges, widthsFor(nodes), ROW_H, GAP);
  const depths = depthsOf(nodes, positions);
  check('acyclic: start=0, a=1, b=2, end=3',
    depths.get('start') === 0 && depths.get('a') === 1 && depths.get('b') === 2 && depths.get('end') === 3);
}

// ── (c) demo shape: start→tokens→numbers→add→(back to tokens), numbers→end ─
{
  const nodes = [
    node('start', 'start'),
    node('tokens', 'process', 'Tokenize input'),
    node('numbers', 'process', 'Parse numbers'),
    node('add', 'process', 'Add tokens'),
    node('end', 'end'),
  ];
  const edges = [
    { from: 'start', to: 'tokens' },
    { from: 'tokens', to: 'numbers' },
    { from: 'numbers', to: 'add' },
    { from: 'add', to: 'tokens', label: 'more tokens' }, // back-edge (loop)
    { from: 'numbers', to: 'end' },
  ];
  const { positions, maxDepth } = layoutFlowchart(nodes, edges, widthsFor(nodes), ROW_H, GAP);
  const depths = depthsOf(nodes, positions);
  const numbersDepth = depths.get('numbers')!;
  const addDepth = depths.get('add')!;
  check(
    '"add" sits adjacent to "numbers" (depth diff 1), not inflated',
    Math.abs(addDepth - numbersDepth) === 1,
  );
  check('demo shape: no node deeper than node count', maxDepth < nodes.length);
}

// ── (d) diamond: a→b, a→c, b→d, c→d → zero back-edges ───────────────────
// Two forward paths converging on `d` is NOT a cycle — classifyBackEdges
// must not mistake a diamond's re-converging paths for a loop.
{
  const nodes = [node('a', 'start'), node('b', 'process'), node('c', 'process'), node('d', 'end')];
  const edges = [
    { from: 'a', to: 'b' },
    { from: 'a', to: 'c' },
    { from: 'b', to: 'd' },
    { from: 'c', to: 'd' },
  ];
  const backEdges = classifyFlowchartBackEdges(nodes, edges);
  check('diamond: zero back-edges', backEdges.size === 0);
}

// ── (e) disconnected component with an internal cycle ───────────────────
// `start`→`a` is the reachable graph; `x`↔`y` is a SEPARATE component never
// reached from `start`. Its internal cycle must still be classified (one of
// x→y / y→x is a back-edge) so the depth loop can't spin on it either.
{
  const nodes = [node('start', 'start'), node('a', 'end'), node('x', 'process'), node('y', 'process')];
  const edges = [
    { from: 'start', to: 'a' },
    { from: 'x', to: 'y' },
    { from: 'y', to: 'x' },
  ];
  const backEdges = classifyFlowchartBackEdges(nodes, edges);
  check(
    'disconnected component: its internal cycle has exactly one back-edge',
    backEdges.has(edgeKey('x', 'y')) !== backEdges.has(edgeKey('y', 'x')) // exactly one, not both/neither
    && (backEdges.has(edgeKey('x', 'y')) || backEdges.has(edgeKey('y', 'x'))),
  );
  check('disconnected component: the reachable start→a edge is not a back-edge', !backEdges.has(edgeKey('start', 'a')));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
