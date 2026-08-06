/**
 * buildShowSignature() regression test (C2 — false dedup collision).
 *
 * Root cause (2026-08 investigation): the STRIP set (title/heading/label/...)
 * was applied at EVERY recursion depth inside canon(), so a flowchart_simple
 * command's node/edge `label`s — SEMANTIC content, see
 * src/lib/tutor/diagrams/catalog/kinds/cs.ts FlowchartEdge.label — got
 * stripped right alongside the top-level `title`. Two different flowcharts
 * (same topology, different edge/node text) hashed to the SAME signature, so
 * the catalog treated the new figure as a duplicate of the old one and
 * dropped it — the brain narrated a new diagram while the board scrolled to
 * an unrelated old one.
 *
 * Fix: STRIP applies only to the top-level command object's own keys.
 * Nested objects/arrays (params.nodes[], params.edges[]) keep every key.
 *
 * Run: npx tsx scripts/test-show-signature.ts
 */
import { buildShowSignature } from '../src/lib/tutor/whiteboard/catalog';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

function flowchart(opts: {
  title?: string;
  nodeText?: string;
  edgeLabel?: string;
}): Record<string, unknown> {
  return {
    action: 'showDiagram',
    type: 'flowchart_simple',
    params: {
      title: opts.title ?? 'Tokenizer pipeline',
      nodes: [
        { id: 'start', type: 'start', text: 'Start' },
        { id: 'a', type: 'process', text: opts.nodeText ?? 'Tokenize input' },
        { id: 'b', type: 'process', text: 'Parse tokens' },
        { id: 'end', type: 'end', text: 'End' },
      ],
      edges: [
        { from: 'start', to: 'a' },
        { from: 'a', to: 'b', label: opts.edgeLabel ?? 'ok' },
        { from: 'b', to: 'end' },
      ],
    },
  };
}

// (a) identical topology, different node/edge labels → DIFFERENT signatures.
{
  const base = flowchart({});
  const diffNode = flowchart({ nodeText: 'Normalize input' });
  const diffEdge = flowchart({ edgeLabel: 'error' });
  const sigBase = buildShowSignature('showDiagram', base);
  const sigDiffNode = buildShowSignature('showDiagram', diffNode);
  const sigDiffEdge = buildShowSignature('showDiagram', diffEdge);
  check('different node text → different signature', sigBase !== sigDiffNode);
  check('different edge label → different signature', sigBase !== sigDiffEdge);
}

// (b) only the top-level title changes → SAME signature.
{
  const cmdA = { ...flowchart({}), title: 'Compilers unit — tokenizer' };
  const cmdB = { ...flowchart({}), title: 'Review: how tokenizers work' };
  check(
    'top-level title change alone → same signature',
    buildShowSignature('showDiagram', cmdA) === buildShowSignature('showDiagram', cmdB),
  );
}

// (c) exact re-emission → same signature.
{
  const cmd1 = flowchart({});
  const cmd2 = flowchart({});
  check(
    'exact re-emission → same signature',
    buildShowSignature('showDiagram', cmd1) === buildShowSignature('showDiagram', cmd2),
  );
}

// Sanity: nested params.title (not top-level) still participates in the
// hash — only the TOP level is stripped, not every field named title/label.
{
  const cmd1 = flowchart({ title: 'Version A' });
  const cmd2 = flowchart({ title: 'Version B' });
  check(
    'nested params.title differs → different signature (only top-level is stripped)',
    buildShowSignature('showDiagram', cmd1) !== buildShowSignature('showDiagram', cmd2),
  );
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
