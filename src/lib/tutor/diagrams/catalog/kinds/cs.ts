/** Phase 5 — CS solvers + manifests (whiteboard markup initiative). */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

function slug(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ── flowchart_simple ──────────────────────────────────────────────────────
export interface FlowchartNode {
  id: string;
  type: 'start' | 'end' | 'process' | 'decision' | 'io';
  text: string;
}
export interface FlowchartEdge {
  from: string;
  to: string;
  label?: string;
}
export interface FlowchartFigure {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  title?: string;
}
export function solveFlowchartSimple(params: Record<string, unknown>): FlowchartFigure {
  if (!Array.isArray(params.nodes) || params.nodes.length === 0) {
    throw new Error('flowchart_simple: nodes required');
  }
  if (!Array.isArray(params.edges)) {
    throw new Error('flowchart_simple: edges required');
  }
  const validTypes = new Set(['start', 'end', 'process', 'decision', 'io']);
  const nodes: FlowchartNode[] = (params.nodes as Array<Record<string, unknown>>).map((n, i) => {
    if (typeof n.id !== 'string') throw new Error(`flowchart: nodes[${i}].id required`);
    if (typeof n.type !== 'string' || !validTypes.has(n.type)) throw new Error(`flowchart: nodes[${i}].type invalid`);
    if (typeof n.text !== 'string') throw new Error(`flowchart: nodes[${i}].text required`);
    return { id: n.id, type: n.type as FlowchartNode['type'], text: n.text };
  });
  const ids = new Set(nodes.map((n) => n.id));
  const edges: FlowchartEdge[] = (params.edges as Array<Record<string, unknown>>).map((e, i) => {
    if (typeof e.from !== 'string' || !ids.has(e.from)) throw new Error(`flowchart: edges[${i}].from invalid`);
    if (typeof e.to !== 'string' || !ids.has(e.to)) throw new Error(`flowchart: edges[${i}].to invalid`);
    return {
      from: e.from,
      to: e.to,
      label: typeof e.label === 'string' ? e.label : undefined,
    };
  });
  return { nodes, edges, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── state_machine ─────────────────────────────────────────────────────────
export interface StateMachineFigure {
  states: Array<{ id: string; label?: string; isStart?: boolean; isAccept?: boolean }>;
  transitions: Array<{ from: string; to: string; label: string }>;
  title?: string;
}
export function solveStateMachine(params: Record<string, unknown>): StateMachineFigure {
  if (!Array.isArray(params.states) || params.states.length === 0) {
    throw new Error('state_machine: states required');
  }
  if (!Array.isArray(params.transitions)) {
    throw new Error('state_machine: transitions required');
  }
  const states = (params.states as Array<Record<string, unknown>>).map((s, i) => {
    if (typeof s.id !== 'string') throw new Error(`state_machine: states[${i}].id required`);
    return {
      id: s.id,
      label: typeof s.label === 'string' ? s.label : undefined,
      isStart: s.isStart === true,
      isAccept: s.isAccept === true,
    };
  });
  const ids = new Set(states.map((s) => s.id));
  const transitions = (params.transitions as Array<Record<string, unknown>>).map((t, i) => {
    if (typeof t.from !== 'string' || !ids.has(t.from)) throw new Error(`state_machine: transitions[${i}].from invalid`);
    if (typeof t.to !== 'string' || !ids.has(t.to)) throw new Error(`state_machine: transitions[${i}].to invalid`);
    if (typeof t.label !== 'string') throw new Error(`state_machine: transitions[${i}].label required`);
    return { from: t.from, to: t.to, label: t.label };
  });
  return { states, transitions, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── binary_tree ───────────────────────────────────────────────────────────
export interface BinaryTreeNode { value: string; left?: BinaryTreeNode; right?: BinaryTreeNode }
export interface BinaryTreeFigure { root: BinaryTreeNode; title?: string }
export function solveBinaryTree(params: Record<string, unknown>): BinaryTreeFigure {
  function parse(n: unknown, path: string): BinaryTreeNode {
    if (!n || typeof n !== 'object') throw new Error(`binary_tree: ${path} must be a node`);
    const node = n as Record<string, unknown>;
    if (typeof node.value !== 'string' && typeof node.value !== 'number') {
      throw new Error(`binary_tree: ${path}.value required`);
    }
    return {
      value: String(node.value),
      left: node.left !== undefined ? parse(node.left, `${path}.left`) : undefined,
      right: node.right !== undefined ? parse(node.right, `${path}.right`) : undefined,
    };
  }
  if (!params.root) throw new Error('binary_tree: root required');
  return {
    root: parse(params.root, 'root'),
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── truth_table ───────────────────────────────────────────────────────────
export interface TruthTableFigure {
  inputs: string[];
  outputColumns: Array<{ label: string; values: boolean[] }>;
  rows: boolean[][];
  title?: string;
}
export function solveTruthTable(params: Record<string, unknown>): TruthTableFigure {
  if (!Array.isArray(params.inputs) || params.inputs.length === 0) {
    throw new Error('truth_table: inputs required');
  }
  const inputs = (params.inputs as unknown[]).map((v, i) => {
    if (typeof v !== 'string') throw new Error(`truth_table: inputs[${i}] must be string`);
    return v;
  });
  const n = inputs.length;
  const rows: boolean[][] = [];
  for (let i = 0; i < (1 << n); i++) {
    const r: boolean[] = [];
    for (let j = n - 1; j >= 0; j--) r.push(((i >> j) & 1) === 1);
    rows.push(r);
  }
  let outputColumns: TruthTableFigure['outputColumns'] = [];
  if (Array.isArray(params.outputColumns)) {
    outputColumns = (params.outputColumns as Array<Record<string, unknown>>).map((o, i) => {
      if (typeof o.label !== 'string') throw new Error(`truth_table: outputColumns[${i}].label required`);
      if (!Array.isArray(o.values) || o.values.length !== rows.length) {
        throw new Error(`truth_table: outputColumns[${i}].values must be ${rows.length} booleans`);
      }
      return { label: o.label, values: (o.values as unknown[]).map((b) => Boolean(b)) };
    });
  }
  return { inputs, outputColumns, rows, title: typeof params.title === 'string' ? params.title : undefined };
}

// ── logic_gate ────────────────────────────────────────────────────────────
export interface LogicGateFigure {
  gate: 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';
  inputs: string[];
  output: string;
  title?: string;
}
export function solveLogicGate(params: Record<string, unknown>): LogicGateFigure {
  const valid = new Set(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR']);
  const gate = params.gate;
  if (typeof gate !== 'string' || !valid.has(gate)) {
    throw new Error(`logic_gate: gate must be one of ${Array.from(valid).join('|')}`);
  }
  const inputs = Array.isArray(params.inputs) ? params.inputs.map((v, i) => {
    if (typeof v !== 'string') throw new Error(`logic_gate: inputs[${i}] must be string`);
    return v;
  }) : ['A', 'B'];
  if (gate === 'NOT' && inputs.length !== 1) throw new Error('logic_gate: NOT takes exactly 1 input');
  const output = typeof params.output === 'string' ? params.output : 'Y';
  return {
    gate: gate as LogicGateFigure['gate'],
    inputs,
    output,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ═══════════════════════════════════════════════════════════════════
// Phase 5 manifests (whiteboard markup initiative). Each builder is
// colocated with its solver.
// ═══════════════════════════════════════════════════════════════════

// ── flowchart_simple ──────────────────────────────────────────────
export const flowchartSimpleFeatureNames = {
  chart: 'flowchart',
  node: (id: string): string => `node-${slug(id)}`,
  edge: (from: string, to: string): string => `edge-${slug(from)}-${slug(to)}`,
};

export function buildFlowchartSimpleManifest(figure: FlowchartFigure): FeatureManifestEntry[] {
  const N = flowchartSimpleFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.chart,
      kind: 'region',
      description: 'flowchart diagram',
      labels: ['flowchart', 'the flowchart', 'the diagram'],
      displayName: figure.title || 'flowchart',
      scribbleable: true,
    },
  ];
  for (const node of figure.nodes) {
    features.push({
      name: N.node(node.id),
      kind: node.type === 'decision' ? 'area' : 'label',
      description: `${node.type} node: "${node.text}"`,
      labels: [
        node.text, `the ${node.text}`, `"${node.text}"`,
        `${node.type} node`, `the ${node.type} node`,
        // Verbose description-format variants — brain commonly emits
        // these copied from the manifest description field.
        `${node.type} node: "${node.text}"`,
        `the ${node.type} node "${node.text}"`,
        `${node.type} "${node.text}"`,
        node.id, `node ${node.id}`,
      ],
      displayName: node.text,
      scribbleable: true,
    });
  }
  for (const edge of figure.edges) {
    const labelText = edge.label || `${edge.from} → ${edge.to}`;
    features.push({
      name: N.edge(edge.from, edge.to),
      kind: 'label',
      description: `edge ${edge.from} → ${edge.to}${edge.label ? ` (${edge.label})` : ''}`,
      labels: [
        ...(edge.label ? [edge.label, `"${edge.label}"`, `the ${edge.label} edge`] : []),
        `${edge.from} to ${edge.to}`,
        `edge from ${edge.from} to ${edge.to}`,
      ],
      displayName: labelText,
      scribbleable: true,
    });
  }
  return features;
}

// ── state_machine ─────────────────────────────────────────────────
export const stateMachineFeatureNames = {
  machine: 'state-machine',
  state: (id: string): string => `state-${slug(id)}`,
  transition: (from: string, to: string, label: string): string => `transition-${slug(from)}-${slug(to)}-${slug(label)}`,
};

export function buildStateMachineManifest(figure: StateMachineFigure): FeatureManifestEntry[] {
  const N = stateMachineFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.machine,
      kind: 'region',
      description: 'state machine diagram',
      labels: ['state machine', 'the state machine', 'the diagram', 'the FSM', 'the automaton'],
      displayName: figure.title || 'state machine',
      scribbleable: true,
    },
  ];
  for (const state of figure.states) {
    const label = state.label || state.id;
    const tags: string[] = [];
    if (state.isStart) tags.push('start state');
    if (state.isAccept) tags.push('accept state');
    features.push({
      name: N.state(state.id),
      kind: 'label',
      description: `state "${label}"${tags.length ? ` (${tags.join(', ')})` : ''}`,
      labels: [
        label, `the ${label}`, `"${label}"`,
        `state ${label}`, `the ${label} state`,
        `state "${label}"`,
        state.id, `state ${state.id}`,
        ...(state.isStart ? [
          'start state', 'the start state', 'initial state',
          `state "${label}" (start state)`,
          `${label} (start state)`,
        ] : []),
        ...(state.isAccept ? [
          'accept state', 'the accept state', 'final state', 'the final state',
          `state "${label}" (accept state)`,
          `state "${label}" (final state)`,
          `${label} (accept state)`,
          `${label} (final state)`,
        ] : []),
      ],
      displayName: label,
      scribbleable: true,
    });
  }
  for (const t of figure.transitions) {
    features.push({
      name: N.transition(t.from, t.to, t.label),
      kind: 'label',
      description: `transition ${t.from} → ${t.to} on "${t.label}"`,
      labels: [
        t.label, `"${t.label}"`, `the ${t.label} transition`,
        `${t.from} to ${t.to}`,
        `transition from ${t.from} to ${t.to}`,
        ...(t.from === t.to ? [`${t.from} self-loop`, 'self loop', 'self-loop'] : []),
      ],
      displayName: t.label,
      scribbleable: true,
    });
  }
  return features;
}

// ── binary_tree ───────────────────────────────────────────────────
export const binaryTreeFeatureNames = {
  tree: 'binary-tree',
  // path: '' = root, 'L' = root.left, 'LR' = root.left.right, etc.
  node: (path: string): string => path === '' ? 'node-root' : `node-${path.toLowerCase()}`,
};

export function buildBinaryTreeManifest(figure: BinaryTreeFigure): FeatureManifestEntry[] {
  const N = binaryTreeFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.tree,
      kind: 'region',
      description: 'binary tree diagram',
      labels: ['binary tree', 'the binary tree', 'the tree', 'the diagram'],
      displayName: figure.title || 'binary tree',
      scribbleable: true,
    },
  ];
  function walk(
    n: BinaryTreeNode,
    path: string,
    depth: number,
    parent: BinaryTreeNode | null,
    side: 'left' | 'right' | null,
  ) {
    const isRoot = path === '';
    const isLeaf = !n.left && !n.right;
    // Tag order: position (parent/side) first so the description reads
    // structurally ("node X (right child of Y, leaf)" not "(leaf, right
    // child of Y)"). Position is what the judge needs to reason about
    // BST structure — without it, the board summary is a flat depth
    // list and the judge guesses (often wrong, observed Phase 5
    // session 2026-05-14 where it consistently inverted left/right).
    const tags: string[] = [];
    if (!isRoot && parent && side) tags.push(`${side} child of node "${parent.value}"`);
    if (isRoot) tags.push('root');
    if (isLeaf) tags.push('leaf');
    const tagStr = tags.length ? ` (${tags.join(', ')})` : '';
    const positionLabels: string[] = [];
    if (!isRoot && parent && side) {
      positionLabels.push(
        `${side} child of ${parent.value}`,
        `the ${side} child of ${parent.value}`,
        `${side} child of node ${parent.value}`,
        `${side} child of node "${parent.value}"`,
        `the ${side} child of node "${parent.value}"`,
        `node "${n.value}" (${side} child of node "${parent.value}")`,
      );
      if (isLeaf) {
        positionLabels.push(
          `node "${n.value}" (${side} child of node "${parent.value}", leaf)`,
        );
      }
    }
    features.push({
      name: N.node(path),
      kind: 'label',
      description: `node "${n.value}"${tagStr} at depth ${depth}`,
      labels: [
        n.value, `the ${n.value}`, `"${n.value}"`,
        `node ${n.value}`, `the node ${n.value}`,
        `node "${n.value}"`,
        ...(isRoot ? [
          'root', 'the root', 'root node',
          `node "${n.value}" (root)`,
          `${n.value} (root)`,
        ] : []),
        ...(isLeaf ? [
          `leaf ${n.value}`, `the ${n.value} leaf`,
          `node "${n.value}" (leaf)`,
          `${n.value} (leaf)`,
        ] : []),
        ...(isRoot && isLeaf ? [
          `node "${n.value}" (root, leaf)`,
        ] : []),
        ...positionLabels,
      ],
      displayName: n.value,
      scribbleable: true,
    });
    if (n.left) walk(n.left, path + 'L', depth + 1, n, 'left');
    if (n.right) walk(n.right, path + 'R', depth + 1, n, 'right');
  }
  walk(figure.root, '', 0, null, null);
  return features;
}

// ── truth_table ───────────────────────────────────────────────────
export const truthTableFeatureNames = {
  table: 'truth-table',
  inputCol: (name: string): string => `input-${slug(name)}`,
  outputCol: (label: string): string => `output-${slug(label)}`,
  cell: (r: number, c: number): string => `cell-r${r}-c${c}`,
  row: (r: number): string => `row-${r}`,
};

export function buildTruthTableManifest(figure: TruthTableFigure): FeatureManifestEntry[] {
  const N = truthTableFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.table,
      kind: 'region',
      description: 'truth table',
      labels: ['table', 'the table', 'truth table', 'the truth table'],
      displayName: figure.title || 'truth table',
      scribbleable: true,
    },
  ];
  for (const name of figure.inputs) {
    features.push({
      name: N.inputCol(name),
      kind: 'label',
      description: `input column "${name}"`,
      labels: [name, `the ${name}`, `"${name}"`, `${name} column`, `input ${name}`],
      displayName: name,
      scribbleable: true,
    });
  }
  for (const col of figure.outputColumns) {
    features.push({
      name: N.outputCol(col.label),
      kind: 'label',
      description: `output column "${col.label}"`,
      labels: [col.label, `"${col.label}"`, `the ${col.label} column`, `output ${col.label}`],
      displayName: col.label,
      scribbleable: true,
    });
  }
  // Per-row hit targets so brain can scribble "row 3" / "the third row".
  figure.rows.forEach((_, r) => {
    const ordinal = r + 1;
    features.push({
      name: N.row(r),
      kind: 'label',
      description: `row ${ordinal}`,
      labels: [`row ${ordinal}`, `the ${ordinal}th row`, `row${ordinal}`, `r${r}`],
      displayName: `row ${ordinal}`,
      scribbleable: true,
    });
  });
  return features;
}

// ── logic_gate ────────────────────────────────────────────────────
export const logicGateFeatureNames = {
  gate: 'logic-gate',
  body: 'gate-body',
  input: (label: string): string => `input-${slug(label)}`,
  output: 'output',
};

export function buildLogicGateManifest(figure: LogicGateFigure): FeatureManifestEntry[] {
  const N = logicGateFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.gate,
      kind: 'region',
      description: `${figure.gate} logic gate`,
      labels: ['gate', 'the gate', 'the diagram', `${figure.gate} gate`, `the ${figure.gate} gate`],
      displayName: figure.title || `${figure.gate} gate`,
      scribbleable: true,
    },
    {
      name: N.body,
      kind: 'label',
      description: `${figure.gate} gate body`,
      labels: [figure.gate, `"${figure.gate}"`, `${figure.gate} gate body`, 'gate body', 'the gate body'],
      displayName: `${figure.gate}`,
      scribbleable: true,
    },
  ];
  for (const label of figure.inputs) {
    features.push({
      name: N.input(label),
      kind: 'label',
      description: `input "${label}"`,
      labels: [label, `the ${label}`, `"${label}"`, `input ${label}`, `${label} input`],
      displayName: label,
      scribbleable: true,
    });
  }
  features.push({
    name: N.output,
    kind: 'label',
    description: `output "${figure.output}"`,
    labels: [figure.output, `the ${figure.output}`, `"${figure.output}"`, 'output', 'the output', 'output line', `${figure.output} output`],
    displayName: figure.output,
    scribbleable: true,
  });
  return features;
}
