/**
 * Unit test — Task E2 (UI half): the demo session-end enrol CTA gate.
 *
 * shouldShowDemoCta is the pure helper the /tutor summary surface consumes
 * — the card renders ONLY when (flag on) AND (no studentId ⇒ demo) AND
 * (session ended). This suite pins the full truth table plus the studentId
 * edge shapes (undefined / null / empty string all mean "demo").
 *
 * The prompt half of E2 (the demo close directive) is pinned by
 * scripts/test-plan-seed-framing.ts (npm run test:pedagogy-c1).
 *
 * Run: npx tsx scripts/test-demo-cta.ts   (npm run test:pedagogy-e2)
 */

import { strict as assert } from 'node:assert';
import { shouldShowDemoCta } from '../apps/marketing/src/lib/tutor/demo-cta';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

function main() {
  console.log('Task E2 — shouldShowDemoCta gate\n');

  test('shows ONLY for flag-on demo session end', () => {
    assert.equal(shouldShowDemoCta({ flagOn: true, studentId: undefined, sessionEnded: true }), true);
  });

  test('flag off ⇒ never shows (byte-identical flag-off render)', () => {
    assert.equal(shouldShowDemoCta({ flagOn: false, studentId: undefined, sessionEnded: true }), false);
    assert.equal(shouldShowDemoCta({ flagOn: false, studentId: 'stu-1', sessionEnded: true }), false);
    assert.equal(shouldShowDemoCta({ flagOn: false, studentId: undefined, sessionEnded: false }), false);
  });

  test('studentId present ⇒ never shows (subscribed sessions get no CTA)', () => {
    assert.equal(shouldShowDemoCta({ flagOn: true, studentId: 'stu-1', sessionEnded: true }), false);
  });

  test('session not ended ⇒ never shows (end surface only)', () => {
    assert.equal(shouldShowDemoCta({ flagOn: true, studentId: undefined, sessionEnded: false }), false);
  });

  test('studentId null / empty string both count as demo', () => {
    assert.equal(shouldShowDemoCta({ flagOn: true, studentId: null, sessionEnded: true }), true);
    assert.equal(shouldShowDemoCta({ flagOn: true, studentId: '', sessionEnded: true }), true);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
