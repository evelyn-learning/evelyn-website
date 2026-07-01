/**
 * AP Statistics — Unit 6 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U6_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.stats.u6-frq-practice.v1', title: 'U6 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.u6-frq-practice', description: 'Apply Unit 6 inference techniques for proportions in AP-style FRQs.', standard: 'AP-STATS-6-FRQ' }],
  prerequisites: ['apstats.two-prop-test'], followUps: [], estimatedMinutes: 28,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Three Unit 6 FRQs: one-prop CI, one-prop test, two-prop test. AP graders reward complete steps: hypotheses, conditions, calculations, conclusion in context.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'CI: p̂ ± z*·√(p̂(1−p̂)/n). Use p̂ in SE.',
      'Test (one-prop): use p_0 in SE: z = (p̂ − p_0)/√(p_0(1−p_0)/n).',
      'Test (two-prop): pool p̂_c = (x_1+x_2)/(n_1+n_2); SE uses p̂_c.',
      'Conditions: Random, Large Counts (use p_0 or p̂_c for tests, p̂ for CI), 10%.',
      'Conclusion: compare p-value to α; never accept H_0; always state in context.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-ci', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — One-Proportion CI. A consumer protection group surveyed 150 randomly selected products at a major retailer. 33 had pricing errors. (a) Construct a 95% CI for the population proportion of products with pricing errors. (b) Verify all conditions. (c) Interpret your interval and confidence level. (d) The retailer claims fewer than 15% of products have pricing errors. Does your interval support or contradict this claim? Explain.',
      expectedAnswer: '(a) p̂ = 33/150 = 0.22. SE = √(0.22·0.78/150) = √0.001144 ≈ 0.03383. z* = 1.96. ME = 1.96(0.03383) ≈ 0.0663. CI: 0.22 ± 0.0663 = (0.1537, 0.2863). (3)\n(b) Random ✓. Large Counts: 150(0.22) = 33 ≥ 10 ✓; 150(0.78) = 117 ≥ 10 ✓. 10%: assume retailer carries > 1500 products ✓. (1.5)\n(c) Interpretation of interval: "We are 95% confident that the true proportion of products with pricing errors is between 15.37% and 28.63%." Confidence level: "If we repeated this procedure many times, about 95% of resulting intervals would capture the true proportion." (2)\n(d) The interval (0.1537, 0.2863) lies ENTIRELY ABOVE 0.15. Therefore, the data CONTRADICT the retailer\'s claim that fewer than 15% of products have pricing errors — at the 95% confidence level, the true proportion appears to exceed 15%. (2)\nTotal: 8.5 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 3, scoringCriteria: 'Correct p̂, SE, z*, margin of error, and resulting confidence interval (0.1537, 0.2863).',
          modelResponse: 'p̂ = 33/150 = 0.22. SE = √(0.22·0.78/150) = √0.001144 ≈ 0.03383. z* = 1.96. ME = 1.96(0.03383) ≈ 0.0663. CI: 0.22 ± 0.0663 = (0.1537, 0.2863).' },
        { criterionId: 'b', maxPoints: 1.5, scoringCriteria: 'States and verifies all three conditions: Random, Large Counts (both n·p̂ and n(1−p̂) ≥ 10), and the 10% condition.',
          modelResponse: 'Random ✓. Large Counts: 150(0.22) = 33 ≥ 10 ✓; 150(0.78) = 117 ≥ 10 ✓. 10%: assume retailer carries > 1500 products ✓.' },
        { criterionId: 'c', maxPoints: 2, scoringCriteria: 'Gives a correct interval interpretation in context (95% confident the true proportion is between the interval bounds) AND a correct confidence-level interpretation (long-run capture rate).',
          modelResponse: 'Interpretation of interval: "We are 95% confident that the true proportion of products with pricing errors is between 15.37% and 28.63%." Confidence level: "If we repeated this procedure many times, about 95% of resulting intervals would capture the true proportion."' },
        { criterionId: 'd', maxPoints: 2, scoringCriteria: 'Correctly links the interval to the claim (notes the entire interval lies above 0.15) and draws the correct contradict/support conclusion in context.',
          modelResponse: 'The interval (0.1537, 0.2863) lies entirely above 0.15. Therefore, the data contradict the retailer\'s claim that fewer than 15% of products have pricing errors — at the 95% confidence level, the true proportion appears to exceed 15%.' },
      ] },
      responseFormat: 'frq', hints: ['CI; conditions; interpret both correctly; compare to claim.'], estimatedMinutes: 7 },
    { id: 'try-frq-test', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — One-Proportion Test. A teacher claims at least 80% of students complete homework on time. A SRS of 100 students shows 70 completed on time. At α = 0.05, test the teacher\'s claim. State Type I and Type II errors in context.',
      expectedAnswer: 'p̂ = 70/100 = 0.70. \nH_0: p = 0.80. H_a: p < 0.80 (testing whether claim is overstated). \nConditions: Random ✓; Large Counts: 100(0.8) = 80 ≥ 10, 100(0.2) = 20 ≥ 10 ✓; 10% ✓. (1.5)\nSE = √(0.8·0.2/100) = √0.0016 = 0.04. z = (0.70 − 0.80)/0.04 = -2.50. (2)\np-value = P(Z ≤ -2.50) ≈ 0.00621. (1)\n0.00621 < α = 0.05 → REJECT H_0. (1)\nConclusion: "Because p = 0.0062 < α = 0.05, we reject H_0. There IS convincing statistical evidence that less than 80% of students complete homework on time." (1.5)\nType I error: rejecting H_0 when p = 0.80. Wrongly concluding the teacher overstated when they didn\'t. \nType II error: failing to reject H_0 when p < 0.80. Missing the fact that the true rate is below 80%. (2)\nTotal: 9 points.',
      rubric: { parts: [
        { criterionId: 'hypotheses-conditions', maxPoints: 1.5, scoringCriteria: 'States correct hypotheses in terms of the population proportion (H_0: p = 0.80, H_a: p < 0.80) and verifies Random, Large Counts, and 10% conditions.',
          modelResponse: 'H_0: p = 0.80. H_a: p < 0.80 (testing whether claim is overstated). Conditions: Random ✓; Large Counts: 100(0.8) = 80 ≥ 10, 100(0.2) = 20 ≥ 10 ✓; 10% ✓.' },
        { criterionId: 'mechanics', maxPoints: 3, scoringCriteria: 'Correct SE using p_0 = 0.80, correct test statistic z = -2.50, and correct one-sided p-value ≈ 0.0062.',
          modelResponse: 'SE = √(0.8·0.2/100) = √0.0016 = 0.04. z = (0.70 − 0.80)/0.04 = -2.50. p-value = P(Z ≤ -2.50) ≈ 0.00621.' },
        { criterionId: 'conclusion', maxPoints: 2.5, scoringCriteria: 'Correct decision (reject H_0 since p-value < α) and a conclusion stated in context comparing p-value to α, addressing the original claim about homework completion.',
          modelResponse: '0.00621 < α = 0.05 → reject H_0. Because p = 0.0062 < α = 0.05, we reject H_0. There is convincing statistical evidence that less than 80% of students complete homework on time.' },
        { criterionId: 'errors', maxPoints: 2, scoringCriteria: 'Correctly describes Type I error (rejecting a true H_0, in context) and Type II error (failing to reject a false H_0, in context).',
          modelResponse: 'Type I error: rejecting H_0 when p = 0.80. Wrongly concluding the teacher overstated when they didn\'t. Type II error: failing to reject H_0 when p < 0.80. Missing the fact that the true rate is below 80%.' },
      ] },
      responseFormat: 'frq', hints: ['Hypotheses; conditions; z-stat; p-value; conclude; describe both errors.'], estimatedMinutes: 7 },
    { id: 'try-frq-twoprop', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Two-Proportion Test. A study compares cell phone use while driving in two cities. City A: 65 of 250 drivers observed using a phone. City B: 80 of 300 drivers observed using a phone. At α = 0.05, test whether the proportion of drivers using cell phones differs between the two cities.',
      expectedAnswer: 'p̂_A = 65/250 = 0.26; p̂_B = 80/300 ≈ 0.267. \nH_0: p_A = p_B; H_a: p_A ≠ p_B. \np̂_c = (65 + 80)/(250 + 300) = 145/550 ≈ 0.2636. \nConditions: Random (assume) ✓; Large Counts (using p̂_c): 250(0.2636) ≈ 65.9 ≥ 10, 250(0.7364) ≈ 184.1 ≥ 10, 300(0.2636) ≈ 79.1 ≥ 10, 300(0.7364) ≈ 220.9 ≥ 10 ✓; 10% ✓. (2)\nSE = √(0.2636·0.7364·(1/250 + 1/300)) = √(0.1942·0.00733) = √0.001423 ≈ 0.0377. \nz = (0.26 − 0.2667)/0.0377 ≈ -0.177. (2)\np-value = 2·P(Z ≤ -0.177) ≈ 2·0.4297 ≈ 0.859. (1.5)\n0.859 > α = 0.05 → fail to reject H_0. (1)\nConclusion: "Because p = 0.86 > α = 0.05, we fail to reject H_0. There is NOT convincing statistical evidence that the proportion of drivers using cell phones differs between the two cities." (1.5)\nTotal: 8 points.',
      rubric: { parts: [
        { criterionId: 'hypotheses-conditions', maxPoints: 2, scoringCriteria: 'States correct hypotheses (H_0: p_A = p_B, H_a: p_A ≠ p_B), computes the correct pooled proportion p̂_c, and verifies Random, Large Counts (using p̂_c for all four counts), and 10% conditions.',
          modelResponse: 'p̂_A = 65/250 = 0.26; p̂_B = 80/300 ≈ 0.267. H_0: p_A = p_B; H_a: p_A ≠ p_B. p̂_c = (65 + 80)/(250 + 300) = 145/550 ≈ 0.2636. Conditions: Random (assume) ✓; Large Counts (using p̂_c): 250(0.2636) ≈ 65.9 ≥ 10, 250(0.7364) ≈ 184.1 ≥ 10, 300(0.2636) ≈ 79.1 ≥ 10, 300(0.7364) ≈ 220.9 ≥ 10 ✓; 10% ✓.' },
        { criterionId: 'mechanics', maxPoints: 3.5, scoringCriteria: 'Correct pooled SE, correct two-sample z test statistic ≈ -0.18, and correct two-sided p-value ≈ 0.86.',
          modelResponse: 'SE = √(0.2636·0.7364·(1/250 + 1/300)) = √(0.1942·0.00733) = √0.001423 ≈ 0.0377. z = (0.26 − 0.2667)/0.0377 ≈ -0.177. p-value = 2·P(Z ≤ -0.177) ≈ 2·0.4297 ≈ 0.859.' },
        { criterionId: 'conclusion', maxPoints: 2.5, scoringCriteria: 'Correct decision (fail to reject H_0 since p-value > α) and a conclusion stated in context comparing p-value to α, addressing whether the proportions differ.',
          modelResponse: '0.859 > α = 0.05 → fail to reject H_0. Because p = 0.86 > α = 0.05, we fail to reject H_0. There is not convincing statistical evidence that the proportion of drivers using cell phones differs between the two cities.' },
      ] },
      responseFormat: 'frq', hints: ['Pool; verify; z-stat; two-sided p; conclude.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'CI uses sample p̂; one-prop test uses p_0; two-prop test uses pooled p̂_c.',
      'Conditions: Random, Large Counts, 10%.',
      'Conclusion in context comparing p to α; describe Type I/II in context.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '6', cedTopic: '6-FRQ', cedTitle: 'Unit 6 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Stats Unit-6 FRQs.' }] },
};
