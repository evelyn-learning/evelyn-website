/**
 * Digital SAT — Unit 2 CED 2.4: Exponential Functions, Growth & Decay.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.exponential-functions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U2_EXPONENTIAL_FUNCTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.exponential-functions.v1',
  course: 'Digital SAT',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Exponential Functions, Growth & Decay',
  planId: 'evelyn.testprep.dsat.exponential-functions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.exponential-functions.v1' }],
  theory: [
    { loId: 'dsat.exponential-functions', kind: 'framework', title: 'Base form', content: `BASE FORM — y = a · bᵗ. a is the INITIAL value (t = 0). b is the growth/decay FACTOR applied every unit of t.` },
    { loId: 'dsat.exponential-functions', content: `GROWTH vs. DECAY — b > 1 means growth; 0 < b < 1 means decay. From a percent rate r: growth uses b = 1 + r, decay uses b = 1 − r.` },
    { loId: 'dsat.exponential-functions', kind: 'framework', title: 'Writing the model', content: `WRITING THE MODEL — pull the initial amount straight from the problem for a, and convert the stated percent change into b using b = 1 ± r. "Decreases 15% per year, starts at 2000" → V(t) = 2000(0.85)ᵗ.` },
    { loId: 'dsat.exponential-functions', kind: 'framework', title: 'Trap', content: `TRAP — COMPOUNDED EXPONENT. The SAT often gives something like B(t) = 5000(1.03)^(4t) and asks for the ANNUAL rate. Do NOT just multiply 3% by 4. Rewrite the exponent as a product first: (1.03)^(4t) = (1.03⁴)ᵗ. Compute 1.03⁴ ≈ 1.1255 — the true annual growth rate is about 12.6%, not 12%.` },
    { loId: 'dsat.exponential-functions', content: `LINEAR vs. EXPONENTIAL FROM A TABLE — constant DIFFERENCE between consecutive outputs signals linear; constant RATIO signals exponential. Divide, don't subtract, to test for exponential.` },
    { loId: 'dsat.exponential-functions', kind: 'framework', title: 'Graph behavior', content: `GRAPH BEHAVIOR — for a > 0, the graph never touches y = 0 (horizontal asymptote) and the y-intercept is a. Growth curves rise faster and faster; decay curves flatten toward zero.` },
    { loId: 'dsat.exponential-functions', content: `COMPOUND INTEREST is the same model dressed up: A = P(1 + r/n)^(nt). It rewrites to the a·bᵗ form with a = P and b = (1 + r/n)ⁿ per year.` },
    { loId: 'dsat.exponential-functions', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — type the candidate equation and a few (t, y) pairs from the problem as a table; if the points sit on the curve, the model is right. Fast way to eliminate wrong choices.` },
    { loId: 'dsat.exponential-functions', kind: 'definition', title: 'growth factor', content: `the base b in y = a·bᵗ when b > 1; multiplying the previous value by b each unit of t increases it.` },
    { loId: 'dsat.exponential-functions', kind: 'definition', title: 'decay factor', content: `the base b in y = a·bᵗ when 0 < b < 1; multiplying by b each unit of t decreases the value toward (but never reaching) zero.` },
    { loId: 'dsat.exponential-functions', kind: 'definition', title: 'horizontal asymptote', content: `the line the graph approaches but never reaches — for a > 0 in y = a·bᵗ, that line is y = 0.` },
    { loId: 'dsat.exponential-functions', kind: 'definition', title: 'compounding period', content: `the fixed interval (year, quarter, month) over which the growth/decay factor is applied once.` },
  ],
  methods: [
    {
      title: 'Worked basic decay',
      steps: [
        'Decay rate r = 0.12, so the decay factor is b = 1 − 0.12 = 0.88.',
        'Model: V(t) = 28000(0.88)ᵗ.',
        `Evaluate at t = 5: 0.88⁵ = 0.7744 · 0.7744 ≈ 0.527732 (0.88² = 0.7744, 0.88⁴ = 0.7744² ≈ 0.599695, ×0.88 again).`,
        'V(5) = 28000 × 0.527732 ≈ 14,776.49.',
      ],
      example: { problem: `A car's value depreciates 12% per year from an initial value of $28,000. Write a function V(t) for its value after t years, and find its value after 5 years.`, solution: 'V(t) = 28000(0.88)ᵗ; V(5) ≈ $14,776' },
      relatedLoIds: ['dsat.exponential-functions'],
    },
    {
      title: 'Worked compounded rate',
      steps: [
        'Rewrite the exponent as a product so t stands alone: B(t) = 5000 · (1.03⁴)ᵗ.',
        'Compute 1.03⁴: 1.03² = 1.0609; 1.0609² = 1.12550881.',
        `The annual growth factor is ≈ 1.1255, so the annual rate is 1.1255 − 1 = 0.1255 → 12.6% (nearest tenth).`,
        `TRAP check: 3% × 4 = 12% is close but WRONG — compounding four times a year at 3% compounds to slightly more than 12% annually.`,
      ],
      example: { problem: `A savings account balance is modeled by B(t) = 5000(1.03)^(4t), where t is measured in years. To the nearest tenth of a percent, what is the effective ANNUAL growth rate?`, solution: '≈ 12.6% per year' },
      relatedLoIds: ['dsat.exponential-functions'],
    },
  ],
  pointers: [
    { content: `The decay factor is b = 1 − r = 1 − 0.15 = 0.85, so the correct model is V(t) = 2000(0.85)ᵗ. Using 0.15 as the base would mean losing 85% of the value every single year — a far steeper drop than the problem describes.`, kind: 'common-error' },
    { content: `y = a·bᵗ: a is the initial value, b is the growth/decay factor. b = 1 + r for growth, b = 1 − r for decay.`, kind: 'tip' },
    { content: `A constant RATIO between consecutive outputs signals exponential; a constant DIFFERENCE signals linear.`, kind: 'tip' },
    { content: `For a compounded exponent like (1.03)^(4t), rewrite it as (1.03⁴)ᵗ before reading off the per-period rate — don't just multiply the rate by the count.`, kind: 'tip' },
    { content: `Desmos can graph the model or table the given points to verify a candidate equation fast.`, kind: 'tip' },
    { content: `Watch the units on t. In A(t) = 80(0.5)^(t/12) with t in days, the base 0.5 applies once per **12 days**, not per day. A fractional exponent like t/12 or t/5 always signals "one full factor per that many units" — divide first, then raise.`, kind: 'gotcha' },
    { content: `"Increases by 30%" ≠ "increases *to* 30%" ≠ "is 30% *of*." Growth to 130% → b = 1.3; a value that becomes 30% of the previous → b = 0.30. Read the preposition before you write b.`, kind: 'vocab-note' },
    { content: `When the question asks for a rate from a formula, subtract 1 from the base and convert — the answer is b − 1, not b. From (1.1255)ᵗ the rate is 12.55%, not 112.6% or 1.1%. For decay, 1 − b gives the percent DECREASE.`, kind: 'common-error' },
    { content: `Interpretation questions often bury the trap in the *time unit*, not the rate. For P(t) = 240(1.06)^t with t in years since 2020, "6% every year" is right; "6% every month" or "6% since 2020" are the distractors. Match the rate to one unit of t.`, kind: 'gotcha' },
    { content: `Test a table for exponential by dividing consecutive outputs — but only if the t-values are evenly spaced. If t jumps 0, 1, 3, 4, the constant-ratio test fails even for a true exponential. Check spacing first.`, kind: 'edge-case' },
    { content: `Percent increase then equal percent decrease does NOT return you to the start. A 20% rise then 20% drop gives 1.2 × 0.8 = 0.96 — a 4% net loss. Multiply factors; never add or cancel percents.`, kind: 'common-error' },
    { content: `In A = P(1 + r/n)^(nt), r is the annual rate and n the compoundings per year — so r/n, not r, sits in the parentheses. If a stem says "6% annual interest compounded quarterly," the base is 1.015, not 1.06.`, kind: 'gotcha' },
    { content: `Desmos check: enter your equation, then type the stem's given pair (e.g. t = 5, y = 14776) as a table point. If it lands on the curve, the model is right — faster than grinding out 0.88⁵ by hand.`, kind: 'tip' },
  ],
};
