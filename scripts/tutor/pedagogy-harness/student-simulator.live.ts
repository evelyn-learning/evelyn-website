/**
 * GATED live smoke test for the Haiku student-simulator (Task H3).
 *
 * Makes ONE real Haiku call each for leo (bluffer) and aria (beginner) and
 * asserts CATEGORY only (not exact wording) — real LLM output is not
 * byte-stable, so this is deliberately looser than student-simulator.test.ts
 * and may occasionally be flaky. That's acceptable for a gated live check;
 * it is NOT part of the default `npm run test:pedagogy-sim` suite.
 *
 * Needs ANTHROPIC_API_KEY (env or .env.local). SPENDS TOKENS — 2 real Haiku
 * calls per run.
 *
 * Run: npm run test:pedagogy-sim-live
 */
import { strict as assert } from 'node:assert';
import { loadPersona } from './fixtures/personas';
import { simulateStudent } from './student-simulator';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}\n      ${(err as Error).message}`);
    failed++;
  }
}

async function main() {
  console.log('[pedagogy-sim-live] NOTE: this makes 2 REAL Haiku API calls and spends tokens.');

  await test('leo (bluffer): answers "factor x^2 - 5x + 6" WRONG (not the correct (x-2)(x-3))', async () => {
    const leo = loadPersona('leo');
    const { text, ended } = await simulateStudent(
      leo,
      'Great — you said you know this cold. Quick check: can you factor x^2 - 5x + 6 for me?',
      [],
    );
    console.log(`      leo said: ${text}`);
    assert.equal(ended, false, 'a hard factoring check should not trigger disengage');
    const normalized = text.replace(/\s+/g, '');
    const correct = /\(x[-−]2\)\(x[-−]3\)/i.test(normalized) || /\(x[-−]3\)\(x[-−]2\)/i.test(normalized);
    assert.ok(!correct, `expected leo to get this WRONG (consistent with actualLevel), but got the correct factoring: "${text}"`);
  });

  await test('aria (beginner): expresses not-knowing when asked about fractions', async () => {
    const aria = loadPersona('aria');
    const { text, ended } = await simulateStudent(
      aria,
      'Before we start — what do you already know about fractions?',
      [],
    );
    console.log(`      aria said: ${text}`);
    assert.equal(ended, false);
    assert.ok(/don't know|dont know|not sure|no idea|never learned|not really/i.test(text), `expected aria to express not-knowing, got: "${text}"`);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
