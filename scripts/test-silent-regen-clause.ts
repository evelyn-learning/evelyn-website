/**
 * Round-28: silent problem-regeneration clause.
 *
 * Live 2026-07-18 (AP Calc BC session portal-f31017f0): the tutor spoke its
 * own deliberation while replacing a problem it had just generated —
 * "That's not the two-parameter piecewise jump I was picturing — let me
 * build a sharper one myself." The existing "Verify silently" HARD RULE
 * covers checking/judgment reversals but not the act of discarding and
 * regenerating a just-authored problem. This pins the extended clause into
 * the built prompt.
 *
 * Run: npx tsx scripts/test-silent-regen-clause.ts
 */
import { strict as assert } from 'node:assert';
import { buildSystemPrompt, type SystemPromptContext } from '../apps/marketing/src/lib/tutor/ai/system-prompt-builder';

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

console.log('Silent problem-regeneration clause — round-28\n');

const prompt = buildSystemPrompt(baseCtx);

test('the Verify-silently block still exists', () => {
  assert.ok(prompt.includes('Verify silently'), 'Verify silently block missing');
});

test('the block now covers discarding/regenerating your own problem', () => {
  assert.ok(
    prompt.includes('never narrate the discard'),
    'silent-regeneration extension missing from the Verify-silently block',
  );
});

test('the clause names the observed failure phrasing so the model recognizes the shape', () => {
  assert.ok(
    prompt.includes('let me build a sharper one'),
    'example failure phrasing missing',
  );
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
