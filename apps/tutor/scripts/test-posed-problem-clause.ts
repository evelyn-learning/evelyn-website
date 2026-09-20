/**
 * Unit test — tutor-posed problems render on the board + parametric
 * LHS distinctness (live regressions 2026-07-09, portal-abc8df2d).
 *
 * (a) The tutor SPOKE a new problem ("the curve x equals t squared
 *     minus 4, y equals t cubed minus 3t") but never wrote it until the
 *     student asked — every existing MUST-write rule was gated on the
 *     STUDENT asking. New rule: a problem the TUTOR poses renders the
 *     same turn.
 * (b) A parametric pair was written as "x(t) = cos t, x(t) = sin t"
 *     (duplicate LHS; second should be y(t)). New rule pins LHS
 *     distinctness for parametric definitions specifically.
 *
 * Run: npx tsx scripts/test-posed-problem-clause.ts
 * No framework — matches the test:pedagogy-board-truth pattern.
 */

import { strict as assert } from 'node:assert';
import { buildSystemPrompt, type SystemPromptContext } from '../src/lib/tutor/ai/system-prompt-builder';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const baseCtx: SystemPromptContext = {
  module: null,
  studentName: 'Ravi',
};

function main() {
  console.log('Tutor-posed problem + parametric LHS clauses\n');

  const prompt = buildSystemPrompt(baseCtx);

  test('posed-problem clause present: a problem YOU pose renders the same turn', () => {
    assert.ok(prompt.includes('a problem YOU pose'), 'clause header missing');
    assert.ok(prompt.includes('the SAME turn you pose it'), 'same-turn mandate missing');
  });

  test('posed-problem clause covers speaking-without-writing explicitly', () => {
    assert.ok(prompt.includes('Speaking a problem without writing it'));
  });

  test('parametric LHS clause present and scoped to parametric definitions', () => {
    assert.ok(prompt.includes('Parametric definitions'), 'clause header missing');
    assert.ok(prompt.includes('each equation a DIFFERENT dependent variable'), 'distinct-LHS mandate missing');
    assert.ok(prompt.includes('x(t) = cos t, x(t) = sin t'), 'the observed duplicate-LHS failure example missing');
  });

  // 2026-07-10 (session-1783659462609): the tutor made a student hand-
  //    multiply 792 x 128 x 243 for a binomial-theorem lesson, and kept
  //    quizzing after the student twice asked it to just compute.
  // Pin updated 2026-09-06: R29 (85ce9abb) deliberately broadened this
  // clause's trigger from "bulky"/large arithmetic to ANY calculator-
  // reachable evaluation regardless of size, and re-worded the header to
  // "CRITICAL — incidental arithmetic is not the lesson" to match — without
  // updating this pin. Intent (tutor computes it, honors "just tell me"
  // immediately) is unchanged, so re-pin to the current, broader header.
  test('arithmetic-grind clause: bulky arithmetic is not the lesson', () => {
    assert.ok(prompt.includes('incidental arithmetic is not the lesson'), 'clause header missing');
    assert.ok(prompt.includes('compute it YOURSELF'), 'tutor-computes mandate missing');
    assert.ok(prompt.includes('immediately'), 'honor just-tell-me immediately missing');
  });

  // 2026-07-10 (session-1783693044096): an auto-assist drew a "kneading
  //    dough" doodle during a Calvin-cycle lesson with no ATP/NADPH labels.
  //    The assist is retired; the brain now owns show_sketch, so the prompt
  //    must require the analogy be MAPPED to the lesson's own entities.
  test('analogy-sketch clause: a sketched analogy must be labelled with what it maps to', () => {
    assert.ok(prompt.includes('An analogy on the board must be MAPPED'), 'clause header missing');
    assert.ok(prompt.includes('labels'), 'must tell the brain to pass labels');
    assert.ok(prompt.includes('unlabelled doodle'), 'must name the failure mode');
  });

  // Task X4 (2026-07-16): try-yourself/show_problem cards described tables
  //    in prose and referenced "the curve up there" with nothing drawn — the
  //    brain believed artifacts existed that were never rendered. New rule:
  //    render the companion artifact FIRST, same turn, before the card; never
  //    reference an artifact off the current page; no prose-described tables.
  test('companion-artifact clause: render the table/graph/diagram FIRST, same turn, before the card', () => {
    assert.ok(prompt.includes('renders that artifact FIRST, same turn'), 'clause header missing');
    assert.ok(prompt.includes('show_try_yourself` has no attachment field'), 'schema-gap explanation missing');
    assert.ok(prompt.includes('two-tool-call turn'), 'ordering mandate missing');
  });

  test('companion-artifact clause: never reference an off-page artifact', () => {
    assert.ok(prompt.includes('Never reference an artifact that isn\'t on the current board page'), 'clause header missing');
    assert.ok(prompt.includes('cannot scroll to something you only asserted exists'), 'failure-mode framing missing');
  });

  test('companion-artifact clause: no prose-described tables', () => {
    assert.ok(prompt.includes('No prose-described tables'), 'clause header missing');
    assert.ok(prompt.includes('reconstruct a grid from a sentence'), 'failure-mode framing missing');
  });

  // Task X4 IMG-14 finding: show_function_graph's schema only requires
  //    `title` — a `points`-only call (no functions/functionsOfY) is valid
  //    and renders two floating labeled dots with no curve, often with the
  //    viewport locked so tight the axes are out of frame too.
  test('graph-points clause: points must accompany a plotted function, not stand alone', () => {
    assert.ok(prompt.includes('never send `points` alone'), 'clause header missing');
    assert.ok(prompt.includes('show_scatter_plot` instead'), 'bare-data redirect missing');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
