/**
 * Shared circuit-graph helpers used by BOTH the renderer
 * (CircuitRenderer.tsx) and the validator (circuit-validator.ts).
 *
 * Keeping these in one place prevents the validator from accepting
 * netlists that the renderer can't lay out (the bug class that bit
 * us with parallel circuits on 2026-04-26: Sonnet emitted netlists
 * that BFS-passed but defeated findSimplePath, and the validator
 * had no idea).
 *
 * `collapseRailWires` is the new piece — handles Sonnet's preferred
 * emission style for parallel circuits, where the brain wires each
 * battery terminal to a "rail" node via a short lead wire and then
 * hangs parallel components between the rails. The renderer's path
 * decomposition consumes those rail wires on the first parallel
 * branch and orphans the rest. Collapsing the leads first turns
 * the netlist into the form the renderer expects — direct edges
 * between battery terminals.
 */

export interface CircuitComponent {
  type: string;
  from: string;
  to: string;
  value?: string;
  unit?: string;
  label?: string;
}

/**
 * Find the two endpoints of a series chain of batteries, plus the
 * components that form the chain. Returns null if the batteries don't
 * form a simple chain (branching, cycles, or disconnected groups).
 */
export function chainBatteries(batteries: CircuitComponent[]): {
  chain: CircuitComponent[];
  start: string;
  end: string;
} | null {
  if (batteries.length === 0) return null;
  if (batteries.length === 1) {
    return { chain: [batteries[0]], start: batteries[0].from, end: batteries[0].to };
  }
  const degree = new Map<string, number>();
  for (const b of batteries) {
    degree.set(b.from, (degree.get(b.from) ?? 0) + 1);
    degree.set(b.to, (degree.get(b.to) ?? 0) + 1);
  }
  const endpoints = [...degree.entries()].filter(([, d]) => d === 1).map(([n]) => n);
  if (endpoints.length !== 2) return null;
  const [start] = endpoints;
  const chain: CircuitComponent[] = [];
  const used = new Set<CircuitComponent>();
  let current = start;
  while (used.size < batteries.length) {
    const next = batteries.find((b) => !used.has(b) && (b.from === current || b.to === current));
    if (!next) break;
    chain.push(next);
    current = next.from === current ? next.to : next.from;
    used.add(next);
  }
  if (chain.length !== batteries.length) return null;
  return { chain, start, end: current };
}

/**
 * Find a simple (no repeated nodes/edges) path from `start` to `end`
 * in the given component graph. DFS-based; returns the components on
 * the path or null if no path exists.
 */
export function findSimplePath(
  components: CircuitComponent[],
  start: string,
  end: string,
): CircuitComponent[] | null {
  if (start === end) return null;
  const adj = new Map<string, Array<{ to: string; comp: CircuitComponent }>>();
  for (const c of components) {
    if (!adj.has(c.from)) adj.set(c.from, []);
    if (!adj.has(c.to)) adj.set(c.to, []);
    adj.get(c.from)!.push({ to: c.to, comp: c });
    adj.get(c.to)!.push({ to: c.from, comp: c });
  }
  const visitedNodes = new Set<string>();
  const visitedEdges = new Set<CircuitComponent>();
  function dfs(node: string): CircuitComponent[] | null {
    if (node === end) return [];
    visitedNodes.add(node);
    for (const { to, comp } of adj.get(node) || []) {
      if (visitedEdges.has(comp)) continue;
      if (visitedNodes.has(to) && to !== end) continue;
      visitedEdges.add(comp);
      const rest = dfs(to);
      if (rest !== null) return [comp, ...rest];
      visitedEdges.delete(comp);
    }
    visitedNodes.delete(node);
    return null;
  }
  return dfs(start);
}

/**
 * Extend the battery chain through "trunk" non-battery components.
 * If exactly one non-battery non-meter component connects to the
 * chain endpoint A, that component is in series with the source —
 * absorb it into the source rung and update A. Same for B. Repeat
 * until each endpoint has either zero or >1 outward edges (junction).
 *
 * Without this step, a switch in series with a parallel block (e.g.
 * battery-switch-[R1||R2]-battery) defeats path decomposition: the
 * switch is on the unique path from B to the parallel rails, and
 * the first parallel branch consumes it. The second parallel branch
 * is then orphaned. Promoting the switch to the source rung means
 * decomposition runs over just the parallel block, which works.
 *
 * Voltmeters / galvanometers / ground are excluded from the
 * extension walk — they're sampling-only and don't carry trunk
 * current. Probe-style attachments don't extend the source rung.
 */
export function extendSourceRung(
  components: CircuitComponent[],
  batteries: CircuitComponent[],
): { sourceRung: CircuitComponent[]; A: string; B: string } | null {
  if (batteries.length === 0) return null;
  const chain = chainBatteries(batteries);
  if (!chain) return null;

  const inSource = new Set<CircuitComponent>(chain.chain);
  const isExtensible = (c: CircuitComponent): boolean =>
    c.type !== 'battery' &&
    c.type !== 'voltmeter' &&
    c.type !== 'galvanometer' &&
    c.type !== 'ground';

  const walk = (endpoint: string): string => {
    let current = endpoint;
    while (true) {
      const candidates = components.filter(
        (c) => isExtensible(c) && !inSource.has(c) && (c.from === current || c.to === current),
      );
      if (candidates.length !== 1) break;  // junction or dead end
      const c = candidates[0];
      inSource.add(c);
      current = c.from === current ? c.to : c.from;
    }
    return current;
  };

  const A = walk(chain.start);
  const B = walk(chain.end);
  return { sourceRung: [...inSource], A, B };
}

/**
 * Iteratively collapse "rail-extension" wires. A wire w(X, Y) is
 * collapsible when one of its endpoints has degree 2 — meaning that
 * endpoint touches ONLY the wire and one other component, so the
 * wire is just a lead and X, Y are electrically the same node.
 * After collapse, the surviving node absorbs all of the merged
 * node's connections; the wire is removed from the netlist.
 *
 * Sonnet's preferred parallel-circuit style:
 *   battery: A↔B (or chain through C)
 *   wire:    A↔bot, B↔top   (lead extensions)
 *   R1, R2, R3: top↔bot      (parallel branches between rails)
 *
 * After collapseRailWires:
 *   battery: bot↔top (or bot↔C↔top)
 *   R1, R2, R3: top↔bot
 *
 * The renderer's path decomposition then lays this out cleanly as
 * a source rung + 3 parallel resistor rungs. Without collapse, the
 * decomposition would consume the rail wires on the first parallel
 * path and orphan R2, R3.
 *
 * Self-loop wires (w(X, X)) and wires whose collapse would create
 * a self-loop are skipped.
 */
export function collapseRailWires(components: CircuitComponent[]): CircuitComponent[] {
  let work = components.map((c) => ({ ...c }));
  // Cap iterations to prevent runaway on pathological input.
  for (let iter = 0; iter < work.length + 5; iter++) {
    const degree = new Map<string, number>();
    for (const c of work) {
      degree.set(c.from, (degree.get(c.from) ?? 0) + 1);
      degree.set(c.to, (degree.get(c.to) ?? 0) + 1);
    }
    let collapsedThisPass = false;
    for (let i = 0; i < work.length; i++) {
      const c = work[i];
      if (c.type !== 'wire') continue;
      if (c.from === c.to) continue;  // self-loop, skip
      const fromDeg = degree.get(c.from) ?? 0;
      const toDeg = degree.get(c.to) ?? 0;
      let keepNode: string;
      let mergeNode: string;
      if (fromDeg === 2) {
        keepNode = c.to;
        mergeNode = c.from;
      } else if (toDeg === 2) {
        keepNode = c.from;
        mergeNode = c.to;
      } else {
        continue;
      }
      // Apply: drop the wire, rename mergeNode → keepNode everywhere.
      const next: CircuitComponent[] = [];
      for (let j = 0; j < work.length; j++) {
        if (j === i) continue;
        const cc = work[j];
        const renamedFrom = cc.from === mergeNode ? keepNode : cc.from;
        const renamedTo = cc.to === mergeNode ? keepNode : cc.to;
        // Skip components that became self-loops (e.g. a wire between
        // two nodes that just got merged) — they're degenerate.
        if (renamedFrom === renamedTo && cc.type === 'wire') continue;
        next.push({ ...cc, from: renamedFrom, to: renamedTo });
      }
      work = next;
      collapsedThisPass = true;
      break;
    }
    if (!collapsedThisPass) break;
  }
  return work;
}
