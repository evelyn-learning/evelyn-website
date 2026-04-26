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

  // Loop-back rule. Distinguishes WHILE-loop bugs from valid DO-WHILE
  // topology:
  //
  //   while:    start → decision → body → decision  ← body has ONE
  //                                                    incoming edge
  //                                                    (from decision).
  //             A back-edge decision→body in this shape would put a
  //             SECOND incoming edge into body, ALSO from the decision.
  //             That's a bug — the body would re-run without re-
  //             evaluating the exit condition.
  //
  //   do-while: start → body → decision → body      ← body has TWO
  //                                                    incoming edges:
  //                                                    one from start
  //                                                    (non-decision),
  //                                                    one from
  //                                                    decision (back).
  //             This is correct do-while semantics.
  //
  // Heuristic: a process/io with ≥2 incoming edges is buggy ONLY when
  // ALL of its incoming edges come from decision nodes. If it has at
  // least one non-decision incoming edge (from the start path), the
  // second decision incoming is the do-while back-edge and should be
  // allowed.
  for (const [toId, ins] of incoming.entries()) {
    if (ins.length < 2) continue;
    const target = byId.get(toId)!;
    if (target.type === 'decision' || target.type === 'start' || target.type === 'end') continue;
    const decisionSenders = ins.filter((e) => byId.get(e.from)?.type === 'decision');
    if (decisionSenders.length === 0) continue;  // No decision back-edge — not our case.
    const nonDecisionSenders = ins.filter((e) => byId.get(e.from)?.type !== 'decision');
    if (nonDecisionSenders.length > 0) continue;  // do-while topology — allow.
    // Pure-decision incoming: the body is being re-run from the decision
    // without re-checking the condition. while-loop bug.
    const senderIds = decisionSenders.map((e) => `"${e.from}"`).join(', ');
    return {
      ok: false,
      reason: `Loop-back targets a non-decision node: ${senderIds} → "${toId}" (a ${target.type} node) and the body has no other incoming edge from the start path. For a WHILE loop, the back-edge must target the decision node so the condition is re-checked. For a DO-WHILE loop, the body should also have an incoming edge from the start path before the decision.`,
    };
  }

  return { ok: true };
}
