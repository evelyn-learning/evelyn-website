/**
 * Post-emit validator for show_flowchart. Catches structural errors:
 * unknown ids in edges, duplicate node ids, no nodes, and the classic
 * loop-back-targets-the-body bug (an infinite loop because the back-edge
 * skips the condition check).
 */

export interface FlowchartNode {
  id?: string;
  type?: 'start' | 'end' | 'process' | 'decision' | 'io';
  label?: string;
  x?: number;
  y?: number;
}

export interface FlowchartEdge {
  from?: string;
  to?: string;
  label?: string;
}

export interface FlowchartInput {
  nodes?: FlowchartNode[];
  edges?: FlowchartEdge[];
}

export interface FlowchartValidationResult {
  ok: boolean;
  reason?: string;
}

export function validateFlowchart(input: FlowchartInput): FlowchartValidationResult {
  const nodes = Array.isArray(input.nodes) ? input.nodes : [];
  const edges = Array.isArray(input.edges) ? input.edges : [];

  if (nodes.length === 0) {
    return { ok: false, reason: 'show_flowchart was called with no nodes. Re-emit with at least a start and end node.' };
  }

  // Build id → node map; check uniqueness and well-formedness.
  const byId = new Map<string, FlowchartNode>();
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (typeof n.id !== 'string' || !n.id.trim()) {
      return { ok: false, reason: `nodes[${i}] is missing a string id.` };
    }
    if (byId.has(n.id)) {
      return { ok: false, reason: `Duplicate node id "${n.id}". Each node needs a unique id.` };
    }
    if (n.type !== 'start' && n.type !== 'end' && n.type !== 'process' && n.type !== 'decision' && n.type !== 'io') {
      return { ok: false, reason: `nodes[${i}] (id "${n.id}") has invalid type "${String(n.type)}". Must be one of: start, end, process, decision, io.` };
    }
    byId.set(n.id, n);
  }

  // Edges must reference known nodes.
  // Track incoming edges per node so we can find loop-back targets.
  const incoming = new Map<string, Array<{ from: string; idx: number }>>();
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    if (typeof e.from !== 'string' || !byId.has(e.from)) {
      return { ok: false, reason: `edges[${i}].from "${String(e.from)}" is not a known node id.` };
    }
    if (typeof e.to !== 'string' || !byId.has(e.to)) {
      return { ok: false, reason: `edges[${i}].to "${String(e.to)}" is not a known node id.` };
    }
    if (!incoming.has(e.to)) incoming.set(e.to, []);
    incoming.get(e.to)!.push({ from: e.from, idx: i });
  }

  // Loop-back rule: if any node is the target of more than one incoming
  // edge AND it's NOT a decision node, AND the second incoming edge
  // comes from "later" in the topological flow (a back-edge), it's
  // probably a loop targeting the body instead of the condition check.
  // Concretely: a process or io node with ≥2 incoming edges is suspect
  // unless one of the senders is the start. We flag the case where a
  // process/io receives a back-edge from a decision (the decision should
  // loop back to the prior condition node, not to the body it just ran).
  for (const [toId, ins] of incoming.entries()) {
    if (ins.length < 2) continue;
    const target = byId.get(toId)!;
    if (target.type === 'decision' || target.type === 'start' || target.type === 'end') continue;
    // process / io with multiple incoming edges. Check if any sender is a decision.
    const decisionSenders = ins.filter((e) => byId.get(e.from)?.type === 'decision');
    if (decisionSenders.length > 0) {
      const senderIds = decisionSenders.map((e) => `"${e.from}"`).join(', ');
      return {
        ok: false,
        reason: `Loop-back targets a non-decision node: ${senderIds} → "${toId}" (a ${target.type} node). Loop-back edges from a decision should target the condition-check (decision) node, not the loop body — otherwise the loop body re-runs without re-evaluating the exit condition. Re-route the loop edge to the decision node.`,
      };
    }
  }

  return { ok: true };
}
