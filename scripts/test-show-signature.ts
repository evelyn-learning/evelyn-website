/**
 * buildShowSignature() regression test (C2 — false dedup collision).
 *
 * Round 1 root cause (2026-08 investigation): the STRIP set (title/heading/
 * label/...) was applied at EVERY recursion depth inside canon(), so a
 * flowchart_simple command's node/edge `label`s — SEMANTIC content, see
 * src/lib/tutor/diagrams/catalog/kinds/cs.ts FlowchartEdge.label — got
 * stripped right alongside the top-level `title`. Two different flowcharts
 * (same topology, different edge/node text) hashed to the SAME signature, so
 * the catalog treated the new figure as a duplicate of the old one and
 * dropped it — the brain narrated a new diagram while the board scrolled to
 * an unrelated old one.
 *
 * Round 1 FIX WAS TOO NARROW: it stripped only the command's own top-level
 * keys. Real commands wrap their payload a level (or two) down in a plain
 * object — show_diagram's `params.title`, show_problem's
 * `problem.difficultyLabel`/`problem.sourceTag` — so top-level-only
 * stripping broke the ORIGINAL decorative-field dedup those fields were
 * added for (the 2026-04-30 earth_layers-retitle incident and the
 * 2026-05-04 AP Precalc difficultyLabel incident, both cited in
 * catalog.ts's STRIP comment).
 *
 * Round 2 fix: STRIP applies to every object reached WITHOUT passing
 * through an array (root, and any plain-object nesting under it — params,
 * problem, ...). Once recursion passes through an array, stripping is
 * permanently off for everything under it (array items, and objects nested
 * inside them) — so nodes[].label / edges[].label keep every key, while
 * params.title / problem.difficultyLabel (reached via plain-object nesting,
 * never through an array) are still stripped.
 *
 * Run: npx tsx scripts/test-show-signature.ts
 */
import { buildShowSignature } from '../apps/marketing/src/lib/tutor/whiteboard/catalog';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

// Realistic show_diagram(flowchart_simple) shape: payload lives under
// `params` (matches structuralAxesFor's own `cmd.params` destructuring and
// diagrams/manifests.ts's `solveFlowchartSimple(params)` call).
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

// Realistic show_problem shape: payload lives under `problem`
// (VoiceTutorRealtime.tsx reads `cmd.problem.statement` /
// `cmd.problem.difficultyLabel` / `cmd.problem.sourceTag` / `cmd.problem.title`).
function problem(opts: {
  statement?: string;
  difficultyLabel?: string;
  sourceTag?: string;
}): Record<string, unknown> {
  return {
    action: 'showProblem',
    problem: {
      statement: opts.statement ?? 'Solve for x: 2x + 4 = 12',
      ...(opts.difficultyLabel ? { difficultyLabel: opts.difficultyLabel } : {}),
      ...(opts.sourceTag ? { sourceTag: opts.sourceTag } : {}),
    },
  };
}

// (a) flowchart: identical topology, different nodes[].label/edges[].label
// text → DIFFERENT signatures (the round-1 bug this harness exists for).
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

// (b) show_diagram: identical except nested params.title → SAME signature
// (2026-04-30 earth_layers retitle incident — params.title is decorative,
// reached via plain-object nesting, not an array, so STRIP must reach it).
{
  const cmdA = flowchart({ title: 'Compilers unit — tokenizer' });
  const cmdB = flowchart({ title: 'Review: how tokenizers work' });
  check(
    'params.title change alone → same signature',
    buildShowSignature('showDiagram', cmdA) === buildShowSignature('showDiagram', cmdB),
  );
}

// (c) show_problem: identical except nested problem.difficultyLabel → SAME
// signature (2026-05-04 AP Precalc incident this STRIP entry exists for).
{
  const cmdA = problem({ difficultyLabel: 'medium' });
  const cmdB = problem({}); // show_segment_card-style: no difficultyLabel at all
  check(
    'problem.difficultyLabel present/absent alone → same signature',
    buildShowSignature('showProblem', cmdA) === buildShowSignature('showProblem', cmdB),
  );
  const cmdC = problem({ sourceTag: 'homework-3' });
  check(
    'problem.sourceTag change alone → same signature',
    buildShowSignature('showProblem', cmdA) === buildShowSignature('showProblem', cmdC),
  );
}

// (d) show_problem: different problem.statement → DIFFERENT signature
// (sanity — the field STRIP must never touch, decorative or not).
{
  const cmdA = problem({ statement: 'Solve for x: 2x + 4 = 12' });
  const cmdB = problem({ statement: 'Solve for x: 3x - 6 = 9' });
  check(
    'different problem.statement → different signature',
    buildShowSignature('showProblem', cmdA) !== buildShowSignature('showProblem', cmdB),
  );
}

// (e) exact re-emission → same signature.
{
  const cmd1 = flowchart({});
  const cmd2 = flowchart({});
  check(
    'exact re-emission → same signature',
    buildShowSignature('showDiagram', cmd1) === buildShowSignature('showDiagram', cmd2),
  );
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
