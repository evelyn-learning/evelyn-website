/**
 * Phase 5 ship-gate test — CS manifests + renderer DOM wiring
 * (flowchart_simple, state_machine, binary_tree, truth_table,
 * logic_gate).
 *
 * Run with:
 *   TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register \
 *     --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/test-phase5-cs.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  buildFlowchartSimpleManifest,
  buildStateMachineManifest,
  buildBinaryTreeManifest,
  buildTruthTableManifest,
  buildLogicGateManifest,
  flowchartSimpleFeatureNames,
  stateMachineFeatureNames,
  binaryTreeFeatureNames,
  truthTableFeatureNames,
  logicGateFeatureNames,
  solveFlowchartSimple,
  solveStateMachine,
  solveBinaryTree,
  solveTruthTable,
  solveLogicGate,
} from '../apps/marketing/src/lib/tutor/diagrams/catalog/kinds/cs';

type Fail = { msg: string };
const failures: Fail[] = [];

function expect(cond: boolean, msg: string): void {
  if (!cond) failures.push({ msg });
}

const rendererSource = readFileSync(
  join(__dirname, '..', 'apps/marketing/src/app/tutor/components/whiteboard/CatalogCSRenderers.tsx'),
  'utf8',
);
const dispatcherSource = readFileSync(
  join(__dirname, '..', 'apps/marketing/src/lib/tutor/diagrams/manifests.ts'),
  'utf8',
);
const toolDefsSource = readFileSync(
  join(__dirname, '..', 'apps/marketing/src/app/tutor/hooks/toolDefinitions.ts'),
  'utf8',
);

// ── 1. flowchart_simple ─────────────────────────────────────────────────────
{
  const figure = solveFlowchartSimple({
    nodes: [
      { id: 's', type: 'start', text: 'Start' },
      { id: 'n', type: 'decision', text: 'x > 0?' },
      { id: 'e', type: 'end', text: 'End' },
    ],
    edges: [
      { from: 's', to: 'n' },
      { from: 'n', to: 'e', label: 'yes' },
    ],
    title: 'Sign Check',
  });
  const manifest = buildFlowchartSimpleManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(flowchartSimpleFeatureNames.chart), 'flowchart manifest has root');
  expect(names.has(flowchartSimpleFeatureNames.node('s')), 'flowchart manifest has node-s');
  expect(names.has(flowchartSimpleFeatureNames.node('n')), 'flowchart manifest has node-n');
  expect(names.has(flowchartSimpleFeatureNames.edge('n', 'e')), 'flowchart manifest has edge-n-e');
  const decision = manifest.find((f) => f.name === flowchartSimpleFeatureNames.node('n'));
  expect(decision?.displayName === 'x > 0?', 'decision node displayName is its text');
  expect(
    !!decision?.labels?.includes('decision node: "x > 0?"'),
    'decision node carries the verbose `decision node: "..."` label form (brain copies from description)',
  );
  const edge = manifest.find((f) => f.name === flowchartSimpleFeatureNames.edge('n', 'e'));
  expect(edge?.displayName === 'yes', 'labeled edge displayName is its label');
  expect(rendererSource.includes('flowchartSimpleFeatureNames'), 'renderer imports flowchart helper');
  expect(rendererSource.includes('data-feature={N.chart}'), 'renderer sets data-feature on chart root');
  expect(rendererSource.includes('N.node(n.id)'), 'renderer passes per-node data-feature');
  expect(rendererSource.includes('N.edge(e.from, e.to)'), 'renderer sets data-feature on each edge');
}

// ── 1b. flowchart layout — forking decision should stagger branches ────────
{
  // Test the renderer's layout helper by importing the renderer source
  // and looking for the new topo layout signature. We don't execute the
  // React renderer here — instead we assert the algorithm is wired in.
  expect(
    rendererSource.includes('function layoutFlowchart'),
    'flowchart renderer exports a topo layoutFlowchart helper (replaces single-column layout)',
  );
  expect(
    rendererSource.includes('HORIZ_GAP'),
    'flowchart layout applies a horizontal gap to stagger decision branches',
  );
  // The old single-column layout had `nodes.forEach((n, i) => positions.set(n.id, { x: boxCenterX, y: ... }))`.
  // The new layout should NOT hard-code positions in that pattern.
  expect(
    !rendererSource.includes('nodes.forEach((n, i) => positions.set(n.id, { x: boxCenterX'),
    'old single-column flowchart layout has been removed',
  );
}

// ── 2. state_machine ────────────────────────────────────────────────────────
{
  const figure = solveStateMachine({
    states: [
      { id: 'q0', label: 'Idle', isStart: true },
      { id: 'q1', label: 'Working' },
      { id: 'q2', label: 'Done', isAccept: true },
    ],
    transitions: [
      { from: 'q0', to: 'q1', label: 'go' },
      { from: 'q1', to: 'q1', label: 'tick' },
      { from: 'q1', to: 'q2', label: 'finish' },
    ],
    title: 'Worker FSM',
  });
  const manifest = buildStateMachineManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(stateMachineFeatureNames.machine), 'state_machine has root');
  expect(names.has(stateMachineFeatureNames.state('q0')), 'state_machine has state q0');
  expect(names.has(stateMachineFeatureNames.transition('q1', 'q1', 'tick')), 'state_machine has self-loop transition');
  const q0 = manifest.find((f) => f.name === stateMachineFeatureNames.state('q0'));
  expect(q0?.displayName === 'Idle', 'state q0 displayName is "Idle"');
  expect(!!q0?.labels?.includes('start state'), 'start state carries "start state" label');
  expect(
    !!q0?.labels?.includes('state "Idle" (start state)'),
    'start state carries verbose `state "Idle" (start state)` label (brain copies from description)',
  );
  const q2 = manifest.find((f) => f.name === stateMachineFeatureNames.state('q2'));
  expect(
    !!q2?.labels?.includes('state "Done" (accept state)'),
    'accept state carries verbose `state "Done" (accept state)` label',
  );
  expect(rendererSource.includes('stateMachineFeatureNames'), 'renderer imports state_machine helper');
  expect(rendererSource.includes('data-feature={N.machine}'), 'renderer sets data-feature on machine root');
  expect(rendererSource.includes('N.state(s.id)'), 'renderer sets data-feature on each state');
}

// ── 3. binary_tree ──────────────────────────────────────────────────────────
{
  const figure = solveBinaryTree({
    root: {
      value: '5',
      left: { value: '3', left: { value: '1' }, right: { value: '4' } },
      right: { value: '8' },
    },
    title: 'Sample BST',
  });
  const manifest = buildBinaryTreeManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(binaryTreeFeatureNames.tree), 'binary_tree has root region');
  expect(names.has(binaryTreeFeatureNames.node('')), 'binary_tree has root node (path "")');
  expect(names.has(binaryTreeFeatureNames.node('L')), 'binary_tree has root.left (path "L")');
  expect(names.has(binaryTreeFeatureNames.node('LR')), 'binary_tree has root.left.right (path "LR")');
  expect(names.has(binaryTreeFeatureNames.node('R')), 'binary_tree has root.right (path "R")');
  const root = manifest.find((f) => f.name === binaryTreeFeatureNames.node(''));
  expect(root?.displayName === '5', 'root node displayName is its value');
  expect(!!root?.labels?.includes('root'), 'root carries "root" label');
  expect(
    !!root?.labels?.includes('node "5" (root)'),
    'root carries verbose `node "5" (root)` label (brain copies from description)',
  );
  const leaf = manifest.find((f) => f.name === binaryTreeFeatureNames.node('LL'));
  expect(!!leaf?.labels?.includes('leaf 1'), 'leaf node carries "leaf <value>" label');
  expect(
    !!leaf?.labels?.includes('node "1" (leaf)'),
    'leaf carries verbose `node "1" (leaf)` label',
  );
  expect(rendererSource.includes('binaryTreeFeatureNames'), 'renderer imports binary_tree helper');
  expect(rendererSource.includes('data-feature={N.tree}'), 'renderer sets data-feature on tree root');
  expect(rendererSource.includes('N.node(p.path)'), 'renderer sets data-feature on each tree node');
}

// ── 4. truth_table ──────────────────────────────────────────────────────────
{
  const figure = solveTruthTable({
    inputs: ['A', 'B'],
    outputColumns: [{ label: 'A AND B', values: [false, false, false, true] }],
    title: 'AND',
  });
  const manifest = buildTruthTableManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(truthTableFeatureNames.table), 'truth_table has root');
  expect(names.has(truthTableFeatureNames.inputCol('A')), 'truth_table has input col A');
  expect(names.has(truthTableFeatureNames.inputCol('B')), 'truth_table has input col B');
  expect(names.has(truthTableFeatureNames.outputCol('A AND B')), 'truth_table has output col');
  expect(names.has(truthTableFeatureNames.row(0)), 'truth_table has row 0');
  expect(names.has(truthTableFeatureNames.row(3)), 'truth_table has row 3 (last for 2 inputs)');
  const row3 = manifest.find((f) => f.name === truthTableFeatureNames.row(3));
  expect(row3?.displayName === 'row 4', 'row index 3 has displayName "row 4" (1-indexed)');
  expect(rendererSource.includes('truthTableFeatureNames'), 'renderer imports truth_table helper');
  expect(rendererSource.includes('data-feature={N.table}'), 'renderer sets data-feature on table root');
  expect(rendererSource.includes('N.inputCol(c)'), 'renderer sets data-feature on each input header');
  expect(rendererSource.includes('N.row(ri)'), 'renderer sets data-feature on each row');
}

// ── 5. logic_gate ───────────────────────────────────────────────────────────
{
  const figure = solveLogicGate({ gate: 'NAND', inputs: ['A', 'B'], output: 'Q' });
  const manifest = buildLogicGateManifest(figure);
  const names = new Set(manifest.map((f) => f.name));
  expect(names.has(logicGateFeatureNames.gate), 'logic_gate has root');
  expect(names.has(logicGateFeatureNames.body), 'logic_gate has body');
  expect(names.has(logicGateFeatureNames.input('A')), 'logic_gate has input A');
  expect(names.has(logicGateFeatureNames.input('B')), 'logic_gate has input B');
  expect(names.has(logicGateFeatureNames.output), 'logic_gate has output');
  const body = manifest.find((f) => f.name === logicGateFeatureNames.body);
  expect(body?.displayName === 'NAND', 'body displayName is gate type');
  expect(rendererSource.includes('logicGateFeatureNames'), 'renderer imports logic_gate helper');
  expect(rendererSource.includes('data-feature={N.gate}'), 'renderer sets data-feature on gate root');
  expect(rendererSource.includes('N.input(label)'), 'renderer sets data-feature on each input');
  expect(rendererSource.includes('data-feature={N.output}'), 'renderer sets data-feature on output');
}

// ── 6. dispatcher cases ─────────────────────────────────────────────────────
for (const kind of [
  'flowchart_simple',
  'state_machine',
  'binary_tree',
  'truth_table',
  'logic_gate',
]) {
  expect(
    dispatcherSource.includes(`case '${kind}'`),
    `manifests.ts dispatcher has case for '${kind}'`,
  );
}

// ── 7. legacy show_flowchart deprecation ────────────────────────────────────
{
  // Brain frequently picks legacy show_* tools when the catalog
  // counterpart exists. Phase 3 deprecated 4 legacy tools; Phase 5
  // deprecates show_flowchart.
  const flowchartDef = toolDefsSource.match(/name:\s*'show_flowchart',[\s\S]{0,300}?description:\s*'([^']+)'/);
  expect(!!flowchartDef, 'show_flowchart tool definition is findable');
  if (flowchartDef) {
    expect(
      flowchartDef[1].startsWith('⚠️ DEPRECATED') || flowchartDef[1].includes('DEPRECATED'),
      'show_flowchart description carries DEPRECATED prefix',
    );
    expect(
      flowchartDef[1].includes('flowchart_simple'),
      'show_flowchart description points at the catalog kind "flowchart_simple"',
    );
  }
}

// ── Report ──
if (failures.length === 0) {
  console.log('✓ Phase 5 CS: 5 kinds × manifest + renderer wiring + dispatcher + legacy deprecation, all checks passed.');
  process.exit(0);
} else {
  console.error(`✗ ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f.msg}`);
  process.exit(1);
}
