/** Phase 5 — CS solvers. */

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
