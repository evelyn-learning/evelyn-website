/**
 * Phase 22 — Computer-Science data-structure & algorithm catalog kinds.
 * The canonical, must-be-precise CS figures that a freehand sketch cannot draw
 * legibly (nodes/pointers/buckets/call-trees must line up exactly):
 *
 *   data_structure  — a stack (vertical boxes, top/push-pop), a queue
 *                     (horizontal, front/rear + enqueue/dequeue), or a singly
 *                     linked list (value+next nodes with pointer arrows → null).
 *   graph_diagram   — nodes as circles on a ring layout, edges as lines/arrows
 *                     (directed optional), optional edge weights, optional
 *                     BFS/DFS traversal-order overlay.
 *   hash_table      — a bucket array (indices 0..size-1) with keys placed by a
 *                     simple hash and separate-chaining collision lists.
 *   recursion_tree  — the call tree of fibonacci(n) (branching) or factorial(n)
 *                     (a chain), leaves = base cases, optional return values.
 *
 * Each solver is pure: it validates + fills sane defaults + derives the layout
 * so a bare call still renders a clean textbook figure. The matching renderer
 * (CatalogCSStructuresRenderers.tsx) draws the SVG from these figures.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

function numOr(v: unknown, dflt: number): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  return Number.isFinite(n) ? n : dflt;
}
function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
function titleOf(params: Record<string, unknown>): string | undefined {
  return typeof params.title === 'string' && params.title.trim() ? params.title : undefined;
}
function toStrings(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v
    .map((x) => (typeof x === 'string' ? x : typeof x === 'number' ? String(x) : ''))
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return out.length ? out : undefined;
}

// ── data_structure ────────────────────────────────────────────────────────────
export type DataStructureKind = 'stack' | 'queue' | 'linked_list';
export interface DataStructureFigure {
  structure: DataStructureKind;
  items: string[];
  title?: string;
}

export function solveDataStructure(params: Record<string, unknown>): DataStructureFigure {
  const rawStruct = String(params.structure ?? params.kind ?? params.type ?? 'stack')
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
  const structure: DataStructureKind =
    rawStruct === 'queue' ? 'queue' : rawStruct === 'linked_list' || rawStruct === 'linkedlist' || rawStruct === 'list' ? 'linked_list' : 'stack';
  const defaults: Record<DataStructureKind, string[]> = {
    stack: ['12', '37', '5', '48'],
    queue: ['12', '37', '5', '48'],
    linked_list: ['12', '37', '5', '48'],
  };
  let items = toStrings(params.items ?? params.values ?? params.elements) ?? defaults[structure];
  // keep the figure legible
  items = items.slice(0, 7);
  return { structure, items, title: titleOf(params) };
}

export const dataStructureFeatureNames = {
  figure: 'data-structure',
  cells: 'data-structure-cells',
  entry: 'data-structure-entry',
  exit: 'data-structure-exit',
};

export function buildDataStructureManifest(figure: DataStructureFigure): FeatureManifestEntry[] {
  const N = dataStructureFeatureNames;
  const label =
    figure.structure === 'stack' ? 'Stack (LIFO)' : figure.structure === 'queue' ? 'Queue (FIFO)' : 'Linked list';
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `${label}: ${figure.title}` : `${label} data structure`,
      labels: [label.toLowerCase(), 'the ' + figure.structure, 'the diagram', 'the figure', 'the data structure'],
      displayName: figure.title || label,
      scribbleable: true,
    },
    {
      name: N.cells,
      kind: 'area',
      description: figure.structure === 'linked_list' ? 'the nodes (value + next pointer)' : 'the elements stored in the structure',
      labels: figure.structure === 'linked_list' ? ['the nodes', 'nodes', 'a node'] : ['the elements', 'the items', 'the values', 'the cells'],
      displayName: figure.structure === 'linked_list' ? 'Nodes' : 'Elements',
      scribbleable: true,
    },
  ];
  if (figure.structure === 'stack') {
    feats.push({
      name: N.entry,
      kind: 'point',
      description: 'the top of the stack — where push and pop happen (LIFO)',
      labels: ['the top', 'top', 'the top of the stack', 'push', 'pop'],
      displayName: 'Top (push / pop)',
      scribbleable: true,
    });
  } else if (figure.structure === 'queue') {
    feats.push(
      {
        name: N.entry,
        kind: 'point',
        description: 'the rear of the queue — where enqueue adds elements',
        labels: ['the rear', 'rear', 'the back', 'enqueue', 'the tail'],
        displayName: 'Rear (enqueue)',
        scribbleable: true,
      },
      {
        name: N.exit,
        kind: 'point',
        description: 'the front of the queue — where dequeue removes elements (FIFO)',
        labels: ['the front', 'front', 'the head', 'dequeue'],
        displayName: 'Front (dequeue)',
        scribbleable: true,
      },
    );
  } else {
    feats.push({
      name: N.exit,
      kind: 'point',
      description: 'the null terminator — the last node points to null',
      labels: ['null', 'the null terminator', 'nullptr', 'the end of the list'],
      displayName: 'null',
      scribbleable: true,
    });
  }
  return feats;
}

// ── graph_diagram ─────────────────────────────────────────────────────────────
export interface GraphNodeLayout {
  id: string;
  label: string;
  x: number; // 0..1 normalized within the drawing area
  y: number;
  order?: number; // traversal visit order (1-based)
}
export interface GraphEdgeLayout {
  from: string;
  to: string;
  weight?: number;
}
export interface GraphFigure {
  nodes: GraphNodeLayout[];
  edges: GraphEdgeLayout[];
  directed: boolean;
  traversal?: 'bfs' | 'dfs';
  title?: string;
}

function parseEdges(raw: unknown): { from: string; to: string; weight?: number }[] {
  if (!Array.isArray(raw)) return [];
  const out: { from: string; to: string; weight?: number }[] = [];
  for (const e of raw) {
    if (Array.isArray(e) && e.length >= 2) {
      out.push({ from: String(e[0]), to: String(e[1]), weight: e.length >= 3 ? numOr(e[2], NaN) : undefined });
    } else if (e && typeof e === 'object') {
      const o = e as Record<string, unknown>;
      const from = o.from ?? o.source ?? o.u ?? o.a;
      const to = o.to ?? o.target ?? o.v ?? o.b;
      if (from != null && to != null) {
        const w = o.weight ?? o.w ?? o.cost;
        out.push({ from: String(from), to: String(to), weight: w != null ? numOr(w, NaN) : undefined });
      }
    }
  }
  return out.map((e) => ({ ...e, weight: Number.isFinite(e.weight as number) ? e.weight : undefined }));
}

export function solveGraphDiagram(params: Record<string, unknown>): GraphFigure {
  let nodeLabels = toStrings(params.nodes ?? params.vertices);
  let edges = parseEdges(params.edges ?? params.links);

  if (!nodeLabels) {
    // Default: a small connected undirected graph.
    nodeLabels = ['A', 'B', 'C', 'D', 'E'];
    if (edges.length === 0) {
      edges = [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'C', to: 'D' },
        { from: 'C', to: 'E' },
        { from: 'D', to: 'E' },
      ];
    }
  }
  // Add any nodes that only appear in edges.
  const seen = new Set(nodeLabels);
  for (const e of edges) {
    if (!seen.has(e.from)) { seen.add(e.from); nodeLabels.push(e.from); }
    if (!seen.has(e.to)) { seen.add(e.to); nodeLabels.push(e.to); }
  }
  nodeLabels = nodeLabels.slice(0, 10);
  // drop edges that reference dropped nodes
  const nodeSet = new Set(nodeLabels);
  edges = edges.filter((e) => nodeSet.has(e.from) && nodeSet.has(e.to)).slice(0, 18);

  const directed = params.directed === true;
  const weights = params.weights === true || edges.some((e) => e.weight !== undefined);

  // Ring layout so any graph is legible without a physics solver.
  const n = nodeLabels.length;
  const nodes: GraphNodeLayout[] = nodeLabels.map((label, i) => {
    if (n === 1) return { id: label, label, x: 0.5, y: 0.5 };
    const theta = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return {
      id: label,
      label,
      x: 0.5 + 0.4 * Math.cos(theta),
      y: 0.5 + 0.42 * Math.sin(theta),
    };
  });

  // Optional traversal overlay (BFS or DFS from the first node).
  let traversal: 'bfs' | 'dfs' | undefined;
  const rawTrav = typeof params.traversal === 'string' ? params.traversal.toLowerCase() : undefined;
  if (rawTrav === 'bfs' || rawTrav === 'dfs') {
    traversal = rawTrav;
    const adj = new Map<string, string[]>();
    nodeLabels.forEach((l) => adj.set(l, []));
    for (const e of edges) {
      adj.get(e.from)!.push(e.to);
      if (!directed) adj.get(e.to)!.push(e.from);
    }
    const start = nodeLabels[0];
    const orderList: string[] = [];
    const visited = new Set<string>();
    if (traversal === 'bfs') {
      const q = [start];
      visited.add(start);
      while (q.length) {
        const u = q.shift()!;
        orderList.push(u);
        for (const v of adj.get(u)!) if (!visited.has(v)) { visited.add(v); q.push(v); }
      }
    } else {
      const stack = [start];
      while (stack.length) {
        const u = stack.pop()!;
        if (visited.has(u)) continue;
        visited.add(u);
        orderList.push(u);
        // push neighbors reversed so the first neighbor is explored first
        const neigh = adj.get(u)!.slice().reverse();
        for (const v of neigh) if (!visited.has(v)) stack.push(v);
      }
    }
    const orderMap = new Map(orderList.map((l, i) => [l, i + 1]));
    for (const nd of nodes) nd.order = orderMap.get(nd.id);
  }

  return {
    nodes,
    edges: weights ? edges : edges.map((e) => ({ from: e.from, to: e.to })),
    directed,
    traversal,
    title: titleOf(params),
  };
}

export const graphFeatureNames = {
  figure: 'graph',
  nodes: 'graph-nodes',
  edges: 'graph-edges',
  traversal: 'graph-traversal',
};

export function buildGraphManifest(figure: GraphFigure): FeatureManifestEntry[] {
  const N = graphFeatureNames;
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title
        ? `Graph: ${figure.title}`
        : `${figure.directed ? 'Directed' : 'Undirected'} graph with ${figure.nodes.length} vertices and ${figure.edges.length} edges`,
      labels: ['the graph', 'graph', 'the diagram', 'the figure', 'the network'],
      displayName: figure.title || 'Graph',
      scribbleable: true,
    },
    {
      name: N.nodes,
      kind: 'area',
      description: 'the vertices (nodes) of the graph',
      labels: ['the nodes', 'the vertices', 'nodes', 'vertices', 'a node', 'a vertex'],
      displayName: 'Vertices',
      scribbleable: true,
    },
    {
      name: N.edges,
      kind: 'area',
      description: figure.directed ? 'the directed edges (arrows) between vertices' : 'the edges connecting the vertices',
      labels: ['the edges', 'edges', 'an edge', 'the connections', 'the arrows'],
      displayName: 'Edges',
      scribbleable: true,
    },
  ];
  if (figure.traversal) {
    feats.push({
      name: N.traversal,
      kind: 'area',
      description: `the ${figure.traversal.toUpperCase()} visit order (numbered on each vertex)`,
      labels: [`the ${figure.traversal} order`, 'the traversal', 'the visit order', figure.traversal, 'the numbering'],
      displayName: `${figure.traversal.toUpperCase()} order`,
      scribbleable: true,
    });
  }
  return feats;
}

// ── hash_table ────────────────────────────────────────────────────────────────
export interface HashBucket {
  index: number;
  chain: { key: string; value: string }[];
}
export interface HashTableFigure {
  size: number;
  buckets: HashBucket[];
  title?: string;
}

/** A simple, transparent string hash: sum of char codes mod size. */
export function simpleHash(key: string, size: number): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h += key.charCodeAt(i);
  return ((h % size) + size) % size;
}

function parseEntries(raw: unknown): { key: string; value: string }[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: { key: string; value: string }[] = [];
  for (const e of raw) {
    if (Array.isArray(e) && e.length >= 1) {
      out.push({ key: String(e[0]), value: e.length >= 2 ? String(e[1]) : '' });
    } else if (e && typeof e === 'object') {
      const o = e as Record<string, unknown>;
      if (o.key != null) out.push({ key: String(o.key), value: o.value != null ? String(o.value) : '' });
    }
  }
  return out.length ? out : undefined;
}

export function solveHashTable(params: Record<string, unknown>): HashTableFigure {
  const size = clamp(Math.round(numOr(params.size ?? params.buckets, 7)), 3, 11);
  // Default entries are chosen so at least one collision chain forms with size 7.
  const entries =
    parseEntries(params.entries ?? params.items ?? params.pairs) ??
    [
      { key: 'cat', value: '3' },
      { key: 'dog', value: '7' },
      { key: 'bird', value: '2' },
      { key: 'fish', value: '9' },
      { key: 'ant', value: '1' },
    ];
  const buckets: HashBucket[] = Array.from({ length: size }, (_, i) => ({ index: i, chain: [] }));
  for (const e of entries.slice(0, 12)) {
    const idx = simpleHash(e.key, size);
    buckets[idx].chain.push(e);
  }
  return { size, buckets, title: titleOf(params) };
}

export const hashTableFeatureNames = {
  figure: 'hash-table',
  buckets: 'hash-table-buckets',
  chain: 'hash-table-chain',
};

export function buildHashTableManifest(figure: HashTableFigure): FeatureManifestEntry[] {
  const N = hashTableFeatureNames;
  const hasCollision = figure.buckets.some((b) => b.chain.length > 1);
  const feats: FeatureManifestEntry[] = [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title ? `Hash table: ${figure.title}` : `Hash table (${figure.size} buckets, separate chaining)`,
      labels: ['the hash table', 'hash table', 'the diagram', 'the figure', 'the table'],
      displayName: figure.title || 'Hash table',
      scribbleable: true,
    },
    {
      name: N.buckets,
      kind: 'area',
      description: `the bucket array — indices 0 to ${figure.size - 1}`,
      labels: ['the buckets', 'the bucket array', 'the slots', 'buckets', 'the array', 'the indices'],
      displayName: 'Buckets',
      scribbleable: true,
    },
  ];
  if (hasCollision) {
    feats.push({
      name: N.chain,
      kind: 'area',
      description: 'a collision chain — two keys hash to the same bucket (separate chaining)',
      labels: ['the collision', 'the chain', 'the collision chain', 'the linked list', 'a collision'],
      displayName: 'Collision chain',
      scribbleable: true,
    });
  }
  return feats;
}

// ── recursion_tree ────────────────────────────────────────────────────────────
export type RecursionKind = 'fibonacci' | 'factorial';
export interface RecursionTreeNode {
  id: string;
  label: string;
  value: number;
  depth: number;
  x: number; // leaf-slot x coordinate (0-based, in units of leaf columns)
  isBase: boolean;
}
export interface RecursionTreeFigure {
  kind: RecursionKind;
  n: number;
  nodes: RecursionTreeNode[];
  edges: [string, string][];
  showValues: boolean;
  maxDepth: number;
  maxX: number;
  title?: string;
}

export function solveRecursionTree(params: Record<string, unknown>): RecursionTreeFigure {
  const rawKind = String(params.kind ?? params.function ?? params.type ?? 'fibonacci').toLowerCase();
  const kind: RecursionKind = rawKind.startsWith('fact') ? 'factorial' : 'fibonacci';
  const n =
    kind === 'fibonacci'
      ? clamp(Math.round(numOr(params.n ?? params.value, 5)), 2, 6)
      : clamp(Math.round(numOr(params.n ?? params.value, 5)), 1, 7);
  const showValues = params.showValues !== false && params.showReturns !== false;

  const nodes: RecursionTreeNode[] = [];
  const edges: [string, string][] = [];
  let idc = 0;
  let leafSlot = 0;
  let maxDepth = 0;

  function fib(k: number): number {
    let a = 0, b = 1;
    for (let i = 0; i < k; i++) { const t = a + b; a = b; b = t; }
    return a;
  }
  function fact(k: number): number {
    let r = 1;
    for (let i = 2; i <= k; i++) r *= i;
    return r;
  }

  function build(arg: number, depth: number, parentId: string | null): string {
    const id = `n${idc++}`;
    maxDepth = Math.max(maxDepth, depth);
    let node: RecursionTreeNode;
    if (kind === 'fibonacci') {
      const isBase = arg <= 1;
      node = { id, label: `fib(${arg})`, value: fib(arg), depth, x: 0, isBase };
      nodes.push(node);
      if (parentId) edges.push([parentId, id]);
      if (isBase) {
        node.x = leafSlot++;
      } else {
        const c1 = build(arg - 1, depth + 1, id);
        const c2 = build(arg - 2, depth + 1, id);
        const x1 = nodes.find((nd) => nd.id === c1)!.x;
        const x2 = nodes.find((nd) => nd.id === c2)!.x;
        node.x = (x1 + x2) / 2;
      }
    } else {
      const isBase = arg <= 1;
      node = { id, label: `fact(${arg})`, value: fact(arg), depth, x: 0, isBase };
      nodes.push(node);
      if (parentId) edges.push([parentId, id]);
      if (isBase) {
        node.x = leafSlot++;
      } else {
        const c1 = build(arg - 1, depth + 1, id);
        node.x = nodes.find((nd) => nd.id === c1)!.x;
      }
    }
    return id;
  }

  build(n, 0, null);
  const maxX = Math.max(1, leafSlot - 1);
  return { kind, n, nodes, edges, showValues, maxDepth, maxX, title: titleOf(params) };
}

export const recursionTreeFeatureNames = {
  figure: 'recursion-tree',
  root: 'recursion-tree-root',
  leaves: 'recursion-tree-leaves',
};

export function buildRecursionTreeManifest(figure: RecursionTreeFigure): FeatureManifestEntry[] {
  const N = recursionTreeFeatureNames;
  const fnName = figure.kind === 'fibonacci' ? 'fib' : 'fact';
  return [
    {
      name: N.figure,
      kind: 'region',
      description: figure.title
        ? `Recursion tree: ${figure.title}`
        : `Recursion tree for ${fnName}(${figure.n})`,
      labels: ['the recursion tree', 'recursion tree', 'the call tree', 'the tree', 'the diagram', 'the figure'],
      displayName: figure.title || `Recursion tree — ${fnName}(${figure.n})`,
      scribbleable: true,
    },
    {
      name: N.root,
      kind: 'point',
      description: `the root call ${fnName}(${figure.n})`,
      labels: ['the root', 'root', 'the top call', 'the first call', `${fnName}(${figure.n})`],
      displayName: 'Root call',
      scribbleable: true,
    },
    {
      name: N.leaves,
      kind: 'area',
      description: 'the base cases (leaves) — where the recursion stops',
      labels: ['the base cases', 'the leaves', 'base case', 'the leaf nodes', 'the base'],
      displayName: 'Base cases',
      scribbleable: true,
    },
  ];
}

// ── sorting_steps ──────────────────────────────────────────────────────────────
// Phase 33 — a sorting algorithm shown as successive array states (one row per
// pass), heights ∝ value, with the locked-sorted tail highlighted. Deterministic
// bubble sort: the canonical "watch it sort" figure a freehand sketch can't keep
// aligned across rows.

export interface SortingStepRow {
  values: number[];
  sortedFrom: number; // indices >= sortedFrom are in their final (sorted) place
  label: string;      // "Start", "Pass 1", …, "Sorted"
}
export interface SortingStepsFigure {
  title?: string;
  algorithm: 'bubble';
  rows: SortingStepRow[];
  maxValue: number;
}

/** Bubble sort shown pass-by-pass. Records the array state after each pass with
 *  the sorted tail marked; stops early once a pass makes no swaps. Defaults to a
 *  small unsorted array so a bare call still renders a full worked example. */
export function solveSortingSteps(params: Record<string, unknown>): SortingStepsFigure {
  let values = toStrings(params.values)?.map((s) => Number(s)).filter((n) => Number.isFinite(n));
  if (!values || values.length < 2) {
    values = Array.isArray(params.values)
      ? (params.values as unknown[]).map((x) => numOr(x, NaN)).filter((n) => Number.isFinite(n))
      : [];
  }
  if (!values || values.length < 2) values = [5, 2, 8, 1, 9, 3];
  // Keep it legible: at most 10 bars.
  values = values.slice(0, 10).map((n) => Math.round(n));

  const n = values.length;
  const arr = [...values];
  const rows: SortingStepRow[] = [{ values: [...arr], sortedFrom: n, label: 'Start' }];

  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    for (let i = 0; i < n - 1 - pass; i++) {
      if (arr[i] > arr[i + 1]) {
        const t = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = t;
        swapped = true;
      }
    }
    const sortedFrom = n - 1 - pass; // the last (pass+1) elements are locked
    rows.push({ values: [...arr], sortedFrom, label: `Pass ${pass + 1}` });
    if (!swapped) break;
  }

  // Mark the final state as fully sorted.
  const last = rows[rows.length - 1];
  const isSorted = arr.every((v, i) => i === 0 || arr[i - 1] <= v);
  if (isSorted) {
    last.label = 'Sorted';
    last.sortedFrom = 0;
  }

  return {
    title: titleOf(params),
    algorithm: 'bubble',
    rows,
    maxValue: Math.max(1, ...values),
  };
}

export const sortingStepsFeatureNames = {
  figure: 'sorting-steps',
  result: 'sorted-result',
} as const;

export function buildSortingStepsManifest(figure: SortingStepsFigure): FeatureManifestEntry[] {
  const finalRow = figure.rows[figure.rows.length - 1];
  return [
    {
      name: sortingStepsFeatureNames.figure,
      kind: 'region',
      description: figure.title || 'bubble sort shown pass by pass',
      labels: ['the sorting steps', 'the bubble sort', 'the sort', 'the passes', 'the diagram'],
      displayName: figure.title || 'Sorting steps',
      scribbleable: true,
    },
    {
      name: sortingStepsFeatureNames.result,
      kind: 'label',
      description: `the sorted array [${finalRow.values.join(', ')}]`,
      labels: ['the sorted array', 'the result', 'the sorted list', 'the final array'],
      displayName: 'Sorted result',
      scribbleable: true,
    },
  ];
}

export const solveSortingStepsForManifest = solveSortingSteps;
