/**
 * LIVE smoke test for FRQ grading — exercises the real Sonnet 4.6 grader
 * (`defaultGradeDeps`) that CI cannot test. Manual gate before any student
 * sees an FRQ score.
 *
 * Run: `npm run smoke:portal-grading`   (requires ANTHROPIC_API_KEY in .env.local)
 *
 * It grades a realistic, ORIGINAL AP-Stats inference FRQ (one-proportion
 * z-test, 4-part / 4-point rubric) with three answers of known quality, then
 * the legacy single-answer path. Assertions are DIRECTIONAL (good > partial >
 * poor; good near full; poor near zero) because LLM grading has variance —
 * the goal is accuracy sanity, not exact-score pinning. Full per-part
 * breakdowns are printed for human inspection.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import assert from 'node:assert';
import {
  gradeFreeResponse,
  defaultGradeDeps,
  type GradeItem,
} from '@/lib/tutor/portal/grade-free-response';
import type { GradeFreeResponseRequest } from '@/lib/portal-contract/v1';

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY not found (.env.local). Aborting smoke test.');
  process.exit(2);
}

const deps = defaultGradeDeps();

// --- The FRQ (original; modeled on AP one-proportion z-test conventions) ----
//
// "A county health office claims 60% of adults exercise regularly. A
//  researcher suspects the true proportion differs. In an SRS of 200 adults,
//  102 report exercising regularly. At α = 0.05, is there convincing evidence
//  that the proportion differs from 0.60? Carry out an appropriate test."
//
// Correct work: H0: p=0.60 vs Ha: p≠0.60; one-proportion z-test; conditions
// (SRS, 10%, Large Counts np0=120 & n(1−p0)=80 ≥10); z=(0.51−0.60)/√(0.6·0.4/200)
// ≈ −2.60; two-sided p ≈ 0.009 < 0.05 → reject H0; convincing evidence the
// proportion differs from 0.60.

const rubricItem: GradeItem = {
  itemId: 'smoke.apstats.oneprop.frq',
  rubric: {
    parts: [
      {
        criterionId: 'a-hypotheses',
        maxPoints: 1,
        scoringCriteria:
          'States H0: p = 0.60 and Ha: p ≠ 0.60 (two-sided), defining p as the true proportion of county adults who exercise regularly.',
        modelResponse: 'H0: p = 0.60; Ha: p ≠ 0.60, where p is the true proportion of adults in the county who exercise regularly.',
      },
      {
        criterionId: 'b-test-and-conditions',
        maxPoints: 1,
        scoringCriteria:
          'Names a one-proportion z-test AND verifies conditions: Random (SRS), 10% (population > 2000), Large Counts (np0 = 120 ≥ 10 and n(1−p0) = 80 ≥ 10).',
        modelResponse: 'One-proportion z-test. Random: SRS stated. 10%: 200 < 10% of county adults. Large Counts: 200(0.6)=120 and 200(0.4)=80, both ≥ 10.',
      },
      {
        criterionId: 'c-statistic-pvalue',
        maxPoints: 1,
        scoringCriteria:
          'Computes the correct test statistic z ≈ −2.60 (from p̂ = 0.51, SE = √(0.6·0.4/200) ≈ 0.0346) and two-sided p-value ≈ 0.009.',
        modelResponse: 'p̂ = 102/200 = 0.51; z = (0.51 − 0.60)/√(0.6·0.4/200) ≈ −2.60; two-sided p-value ≈ 0.0094.',
      },
      {
        criterionId: 'd-conclusion',
        maxPoints: 1,
        scoringCriteria:
          'Makes a correct decision linking the p-value to α = 0.05 AND states a conclusion in context (reject H0; convincing evidence the proportion differs from 0.60).',
        modelResponse: 'Since p ≈ 0.009 < 0.05, reject H0. There is convincing evidence that the true proportion of adults who exercise regularly differs from 0.60.',
      },
    ],
  },
};

const ANSWERS: Record<'good' | 'partial' | 'poor', string> = {
  good:
    'Let p = true proportion of county adults who exercise regularly. H0: p = 0.60 vs Ha: p ≠ 0.60. ' +
    'I will use a one-proportion z-test. Conditions: the sample is an SRS (random); 200 is less than 10% of all county adults; ' +
    'Large Counts: 200(0.60) = 120 and 200(0.40) = 80 are both at least 10. ' +
    'p̂ = 102/200 = 0.51, SE = sqrt(0.60·0.40/200) ≈ 0.0346, so z = (0.51 − 0.60)/0.0346 ≈ −2.60. ' +
    'The two-sided p-value ≈ 0.009. Since 0.009 < 0.05, I reject H0. There is convincing evidence that the true ' +
    'proportion of county adults who exercise regularly is different from 0.60.',
  partial:
    'H0: p = 0.60, Ha: p ≠ 0.60. I would do a one-proportion z-test because the data are a random sample. ' +
    'The conditions seem fine. The sample proportion is 0.51, which is lower than 0.60, so it looks like fewer people ' +
    'exercise than claimed. The result is statistically significant, so the claim is probably wrong.',
  poor: "I'm not really sure how to set this up or which test to use, so I'll skip the calculations.",
};

const req = (text: string): GradeFreeResponseRequest => ({
  studentId: 'smoke:student',
  itemId: rubricItem.itemId,
  response: { text },
});

function printResult(label: string, r: Awaited<ReturnType<typeof gradeFreeResponse>>) {
  console.log(`\n── ${label}: ${r.totalPoints}/${r.maxPoints} ──`);
  for (const p of r.parts) {
    console.log(`   [${p.pointsAwarded}/${p.maxPoints}] ${p.criterionId}: ${p.feedback}`);
  }
}

(async () => {
  let failed = 0;
  const fail = (m: string) => {
    failed++;
    console.error(`   ✗ ${m}`);
  };

  console.log('LIVE FRQ grading smoke test — model: claude-sonnet-4-6\n');
  console.log('Rubric: AP-Stats one-proportion z-test, 4 parts × 1 pt = 4 max.');

  console.log('\nGrading three answers (live model calls)…');
  const good = await gradeFreeResponse(req(ANSWERS.good), rubricItem, deps);
  const partial = await gradeFreeResponse(req(ANSWERS.partial), rubricItem, deps);
  const poor = await gradeFreeResponse(req(ANSWERS.poor), rubricItem, deps);

  printResult('GOOD answer', good);
  printResult('PARTIAL answer', partial);
  printResult('POOR answer', poor);

  console.log('\nAccuracy checks (directional):');
  try {
    assert.strictEqual(good.maxPoints, 4, 'maxPoints should sum to 4');
    // bounds
    for (const r of [good, partial, poor]) {
      for (const p of r.parts) {
        assert.ok(p.pointsAwarded >= 0 && p.pointsAwarded <= p.maxPoints, `part ${p.criterionId} out of bounds`);
      }
    }
    if (good.totalPoints >= 3) console.log(`   ✓ GOOD scored high (${good.totalPoints}/4)`);
    else fail(`GOOD only scored ${good.totalPoints}/4 (expected ≥ 3)`);

    if (poor.totalPoints <= 1) console.log(`   ✓ POOR scored low (${poor.totalPoints}/4)`);
    else fail(`POOR scored ${poor.totalPoints}/4 (expected ≤ 1)`);

    if (good.totalPoints > partial.totalPoints) console.log(`   ✓ GOOD (${good.totalPoints}) > PARTIAL (${partial.totalPoints})`);
    else fail(`GOOD (${good.totalPoints}) not > PARTIAL (${partial.totalPoints})`);

    if (partial.totalPoints > poor.totalPoints) console.log(`   ✓ PARTIAL (${partial.totalPoints}) > POOR (${poor.totalPoints})`);
    else fail(`PARTIAL (${partial.totalPoints}) not > POOR (${poor.totalPoints})`);

    // GOOD should earn the hypotheses + conditions parts.
    const goodA = good.parts.find((p) => p.criterionId === 'a-hypotheses')!;
    if (goodA.pointsAwarded === 1) console.log('   ✓ GOOD earned the hypotheses part');
    else fail(`GOOD missed hypotheses part (${goodA.pointsAwarded}/1)`);
  } catch (err) {
    fail((err as Error).message);
  }

  // --- Legacy single-answer path (numeric) ---
  console.log('\nLegacy single-answer path (numeric z-score, expected 1.5):');
  const numItem: GradeItem = { itemId: 'smoke.numeric', expectedAnswer: '1.5' };
  const numGood = await gradeFreeResponse({ studentId: 's', itemId: 'smoke.numeric', response: { text: '1.5' } }, numItem, deps);
  const numBad = await gradeFreeResponse({ studentId: 's', itemId: 'smoke.numeric', response: { text: '0.5' } }, numItem, deps);
  console.log(`   correct '1.5' → ${numGood.totalPoints}/1 (${numGood.parts[0].feedback})`);
  console.log(`   wrong   '0.5' → ${numBad.totalPoints}/1 (${numBad.parts[0].feedback})`);
  if (numGood.totalPoints === 1) console.log('   ✓ correct numeric answer scored 1/1');
  else fail(`correct numeric answer scored ${numGood.totalPoints}/1`);
  if (numBad.totalPoints === 0) console.log('   ✓ wrong numeric answer scored 0/1');
  else fail(`wrong numeric answer scored ${numBad.totalPoints}/1`);

  console.log(`\n${failed === 0 ? '✅ SMOKE TEST PASSED' : `❌ ${failed} accuracy check(s) FAILED`}\n`);
  process.exit(failed === 0 ? 0 : 1);
})();
