/**
 * Unit test — Task E3: demo-intent capture (detectDemoIntent).
 *
 * The detector is deliberately conservative (few, high-precision patterns;
 * recall intentionally low), so the NEGATIVE cases here are as load-bearing
 * as the positives — they pin that ordinary tutoring talk ("solve more
 * problems", "join these points", "the sign of the number", prices inside
 * math problems) never produces a funnel label.
 *
 * Run: npx tsx scripts/test-demo-intent.ts   (npm run test:pedagogy-e3)
 */

import { strict as assert } from 'node:assert';
import { detectDemoIntent } from '../apps/marketing/src/lib/tutor/demo-intent';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

function main() {
  console.log('Task E3 — detectDemoIntent\n');

  // -- considering-enrolling --------------------------------------------------
  test('enrolment phrasings → considering-enrolling', () => {
    assert.equal(detectDemoIntent(['how do I sign up for this?']), 'considering-enrolling');
    assert.equal(detectDemoIntent(['can I enroll my daughter?']), 'considering-enrolling');
    assert.equal(detectDemoIntent(['is there a subscription?']), 'considering-enrolling');
    assert.equal(detectDemoIntent(['thinking about this for my kid']), 'considering-enrolling');
    assert.equal(detectDemoIntent(['we already signed up']), 'considering-enrolling');
    assert.equal(detectDemoIntent(['what does enrolment involve']), 'considering-enrolling');
  });

  // -- curious-how-ai-teaches ---------------------------------------------------
  test('AI-curiosity phrasings → curious-how-ai-teaches', () => {
    assert.equal(detectDemoIntent(['how does the AI decide what to teach?']), 'curious-how-ai-teaches');
    assert.equal(detectDemoIntent(['wait, are you a robot?']), 'curious-how-ai-teaches');
    assert.equal(detectDemoIntent(['is this a real person or an AI']), 'curious-how-ai-teaches');
    assert.equal(detectDemoIntent(['how do you work under the hood']), 'curious-how-ai-teaches');
    assert.equal(detectDemoIntent(['how were you trained?']), 'curious-how-ai-teaches');
  });

  // -- exploring ---------------------------------------------------------------
  test('browsing phrasings → exploring', () => {
    assert.equal(detectDemoIntent(["i'm just looking around"]), 'exploring');
    assert.equal(detectDemoIntent(['just checking it out']), 'exploring');
    assert.equal(detectDemoIntent(['just browsing to see what this is']), 'exploring');
    assert.equal(detectDemoIntent(['just trying this out before class']), 'exploring');
  });

  // -- precedence ---------------------------------------------------------------
  test('enrolling beats AI-curiosity beats exploring (across turns)', () => {
    assert.equal(
      detectDemoIntent(['just looking around', 'are you a robot?', 'how do I sign up?']),
      'considering-enrolling',
    );
    assert.equal(
      detectDemoIntent(['just checking it out', 'how does the AI pick problems?']),
      'curious-how-ai-teaches',
    );
  });

  // -- negatives / precision guards ----------------------------------------------
  test('ordinary tutoring talk → null', () => {
    assert.equal(detectDemoIntent(['I want to solve more problems']), null);
    assert.equal(detectDemoIntent(['can we do a harder one?']), null);
    assert.equal(detectDemoIntent(['join these two points with a line']), null);
    assert.equal(detectDemoIntent(['what is the sign of the derivative here?']), null);
    assert.equal(detectDemoIntent(['the price of the shirt is $20, find the discount']), null);
    assert.equal(detectDemoIntent(['looking at the graph, it goes up']), null);
  });

  test('empty / whitespace / no student turns → null', () => {
    assert.equal(detectDemoIntent([]), null);
    assert.equal(detectDemoIntent(['']), null);
    assert.equal(detectDemoIntent(['   ']), null);
  });

  test('non-string entries are ignored, not thrown on', () => {
    // Transcript plumbing should never crash session end.
    assert.equal(detectDemoIntent([undefined as unknown as string, 'hello']), null);
    assert.equal(
      detectDemoIntent([undefined as unknown as string, 'how do I sign up']),
      'considering-enrolling',
    );
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
