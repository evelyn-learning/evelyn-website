/**
 * Unit test for Task B5 — self-report two-channel routing clause
 * (src/lib/tutor/ai/system-prompt-builder.ts — buildSelfReportClause +
 * buildSystemPrompt gating). See project_tutor_pedagogy_opener_calibration.
 *
 * Run: npx tsx scripts/test-self-report-clause.ts
 * No framework — matches the test:conic / test:opener-calibration-prompt pattern.
 */

import { strict as assert } from 'node:assert';
import {
  buildSelfReportClause,
  buildSystemPrompt,
  type SystemPromptContext,
} from '../apps/marketing/src/lib/tutor/ai/system-prompt-builder';

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
  console.log('Self-report two-channel routing clause — Task B5\n');

  // ── buildSelfReportClause gating ─────────────────────────────────────────
  test('buildSelfReportClause: returns null when selfReportRouting is absent', () => {
    assert.equal(buildSelfReportClause({ ...baseCtx }), null);
  });

  test('buildSelfReportClause: returns null when selfReportRouting is explicitly false', () => {
    assert.equal(buildSelfReportClause({ ...baseCtx, selfReportRouting: false }), null);
  });

  test('buildSelfReportClause: returns the clause when selfReportRouting is true', () => {
    const clause = buildSelfReportClause({ ...baseCtx, selfReportRouting: true });
    assert.ok(clause, 'clause should not be null');
  });

  // ── both channels present ────────────────────────────────────────────────
  test('clause contains the about-them channel (rapport / theming)', () => {
    const clause = buildSelfReportClause({ ...baseCtx, selfReportRouting: true });
    assert.ok(clause);
    assert.match(clause!, /rapport/i);
    assert.match(clause!, /theming your examples/i);
  });

  test('clause contains the knowledge-claim channel (confirm, not proof of mastery)', () => {
    const clause = buildSelfReportClause({ ...baseCtx, selfReportRouting: true });
    assert.ok(clause);
    assert.match(clause!, /NOT proof they've learned it/);
    assert.match(clause!, /CONFIRM by what they actually demonstrate/);
    assert.match(clause!, /count it as learned or skip teaching it\.$/); // clean sentence ending, no trailing garbage
  });

  test('clause is generic — no topic-specific examples (e.g. no math/chem/bio nouns)', () => {
    const clause = buildSelfReportClause({ ...baseCtx, selfReportRouting: true });
    assert.ok(clause);
    assert.doesNotMatch(clause!, /algebra|photosynthesis|derivative|equation|calculus/i);
  });

  // ── buildSystemPrompt wiring ──────────────────────────────────────────────
  test('buildSystemPrompt: legacy callers (selfReportRouting absent) are byte-for-byte unchanged', () => {
    const legacyCtx: SystemPromptContext = { module: null, studentName: 'Ravi', sessionGoal: 'general' };
    const withUnsetNewField: SystemPromptContext = {
      module: null,
      studentName: 'Ravi',
      sessionGoal: 'general',
      selfReportRouting: undefined,
    };
    const a = buildSystemPrompt(legacyCtx);
    const b = buildSystemPrompt(withUnsetNewField);
    assert.equal(a, b, 'prompt must be byte-identical when selfReportRouting is absent/undefined');
    assert.doesNotMatch(a, /Self-Report Routing/i);
  });

  test('buildSystemPrompt: includes the self-report clause when selfReportRouting is true', () => {
    const ctx: SystemPromptContext = {
      module: null,
      studentName: 'Ravi',
      sessionGoal: 'general',
      selfReportRouting: true,
    };
    const prompt = buildSystemPrompt(ctx);
    assert.match(prompt, /Self-Report Routing/i);
    assert.match(prompt, /rapport/i);
    assert.match(prompt, /NOT proof they've learned it/);
  });

  test('buildSystemPrompt: self-report clause coexists with the opener clause when both are gated on', () => {
    const ctx: SystemPromptContext = {
      module: null,
      studentName: 'Ravi',
      sessionGoal: 'general',
      openingPhase: true,
      sessionMode: 'demo',
      entryMode: 'button',
      selfReportRouting: true,
    };
    const prompt = buildSystemPrompt(ctx);
    assert.match(prompt, /This Turn: Session Opener/);
    assert.match(prompt, /Self-Report Routing/i);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
