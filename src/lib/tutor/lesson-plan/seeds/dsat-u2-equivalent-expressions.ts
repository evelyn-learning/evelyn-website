/**
 * Digital SAT — Math / Advanced Math: Equivalent Expressions.
 *
 * The opening skill of the Advanced Math domain: rewriting an algebraic
 * expression in an equivalent form via factoring (GCF, difference of
 * squares, trinomial factoring) and rational-exponent / radical rules, plus
 * simplifying rational expressions by factoring and canceling. Desmos is
 * allowed on every math question — teach when plugging in a test number
 * beats symbol-pushing.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U2_EQUIVALENT_EXPRESSIONS: LessonPlan = {
  id: 'evelyn.testprep.dsat.equivalent-expressions.v1',
  title: 'Equivalent Expressions: Factoring & Rational Exponents',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.equivalent-expressions',
      standard: 'DSAT-2.1',
      description:
        'Rewrite algebraic expressions in equivalent forms by factoring (GCF, difference of squares, trinomials) and applying rational-exponent/radical rules, and simplify rational expressions by factoring and canceling common factors.',
    },
  ],
  prerequisites: [],
  followUps: ['dsat.nonlinear-equations-one-var'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame equivalent expressions as the opening — and most frequent — skill in Advanced Math, the domain worth about a third of SAT Math.',
      script:
        'Advanced Math is roughly 35 percent of SAT Math, and "which expression is equivalent to..." questions are its most common single pattern — about a third of that domain. There\'s no equation to solve here, just algebraic identity: factor it, apply an exponent rule, or simplify a fraction, and match it to a choice.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-equivalence',
      kind: 'concept',
      goal: 'The factoring toolkit, rational-exponent rules, and rational-expression simplification, plus the traps the SAT builds into each.',
      keyIdeas: [
        'THE QUESTION FORMAT — "Which of the following is equivalent to ___?" There is nothing to solve for; you are rewriting one expression as another that means the same thing for every value of the variable.',
        'FACTORING TOOLKIT — pull out the GCF first. Difference of squares: a² − b² = (a − b)(a + b). Trinomial x² + bx + c = (x + m)(x + n) where m·n = c and m + n = b. Non-monic or 4-term expressions: factor by grouping.',
        'TRAP — SUM OF SQUARES DOES NOT FACTOR. a² + b² has no real factorization. The SAT plants this as a distractor pattern that LOOKS like difference of squares.',
        'RATIONAL EXPONENTS — x^(1/n) = ⁿ√x (nth root). x^(p/q) = (ⁿ√x)^p, i.e. the qth root raised to the p power. All the integer exponent rules (product, quotient, power-of-power) apply unchanged to fractional exponents.',
        'POWER-OF-POWER ON A COEFFICIENT — (27x⁶)^(1/3) applies the (1/3) power to BOTH factors: 27^(1/3) = 3 and x^(6·1/3) = x². Forgetting to apply the exponent to the numeric coefficient is a very common miss.',
        'SIMPLIFYING RATIONAL EXPRESSIONS — factor the numerator and denominator completely, then cancel COMMON FACTORS only. A factor is something multiplied; you can never cancel a term that is added or subtracted.',
        'TRAP — CANCELING TERMS INSTEAD OF FACTORS. (x + 5)/x is NOT 5 — the x in the numerator is added to 5, not multiplied, so nothing cancels. This is the single most common equivalent-expressions error.',
        'DESMOS CHECK — plug a convenient test number (avoid 0 and 1) into the original expression and into each answer choice; the one that matches is equivalent. Fast and reliable when factoring stalls.',
      ],
      vocabulary: [
        { term: 'GCF (greatest common factor)', definition: 'the largest expression that divides every term of a polynomial evenly.' },
        { term: 'rational exponent', definition: 'an exponent written as a fraction; x^(p/q) means the qth root of x, raised to the p power.' },
        { term: 'excluded value', definition: 'a value of the variable that makes a rational expression\'s denominator zero, so it is excluded from the domain.' },
        { term: 'difference of squares', definition: 'a² − b² = (a − b)(a + b); a factoring pattern that only applies to a MINUS between two perfect squares.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-rational-expression',
      kind: 'worked_example',
      problem: 'Which expression is equivalent to (x² + 5x + 6)/(x + 2)?',
      steps: [
        'Factor the numerator: x² + 5x + 6 = (x + 2)(x + 3), since 2 · 3 = 6 and 2 + 3 = 5.',
        'Rewrite the fraction: (x + 2)(x + 3) / (x + 2).',
        'Cancel the common FACTOR (x + 2) from numerator and denominator — this is valid because it is multiplied, not added.',
        'What remains is x + 3, for x ≠ −2 (the excluded value that would have made the original denominator zero).',
      ],
      answer: 'x + 3 (x ≠ −2)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-rational-exponent',
      kind: 'worked_example',
      problem: 'Which expression is equivalent to (27x⁶)^(1/3)?',
      steps: [
        'The outer exponent (1/3) applies to EVERY factor inside the parentheses — both the 27 and the x⁶.',
        '27^(1/3) is the cube root of 27, which is 3 (since 3³ = 27).',
        '(x⁶)^(1/3) uses the power-of-power rule: multiply exponents, 6 · (1/3) = 2, giving x².',
        'Combine: 3x². (A common miss is leaving the 27 unresolved, or multiplying 6 by 3 instead of by 1/3.)',
      ],
      answer: '3x²',
      estimatedMinutes: 3,
    },
    {
      id: 'try-factoring',
      kind: 'try_yourself',
      problem: 'Which expression is equivalent to x² − 4x − 12?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(x + 6)(x − 2)' },
        { id: 'b', text: '(x − 6)(x + 2)', correct: true },
        { id: 'c', text: '(x − 4)(x + 3)' },
        { id: 'd', text: '(x − 3)(x + 4)' },
      ],
      expectedAnswer: '(x − 6)(x + 2)',
      hints: [
        'You need two numbers that multiply to −12 and add to −4.',
        '−6 and 2 work: −6 · 2 = −12 and −6 + 2 = −4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rational-exponent',
      kind: 'try_yourself',
      problem: 'Which expression is equivalent to (27x⁶)^(1/3) after the exponent has been applied correctly? (Same setup as the worked example — verify you can rebuild it.)',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '9x²' },
        { id: 'b', text: '3x²', correct: true },
        { id: 'c', text: '27x¹⁸' },
        { id: 'd', text: '27x²' },
      ],
      expectedAnswer: '3x²',
      hints: [
        'Apply the (1/3) power to the 27 and to the x⁶ separately.',
        '27^(1/3) = 3 (cube root of 27); x⁶ raised to the 1/3 power multiplies exponents: 6 · (1/3) = 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spr',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): for what value of k does 3x² + kx − 20 factor as (3x − 4)(x + 5)?',
      responseFormat: 'numeric',
      expectedAnswer: '11',
      hints: [
        'Expand (3x − 4)(x + 5) using FOIL.',
        '3x² + 15x − 4x − 20 = 3x² + 11x − 20, so match kx to 11x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cancel-term',
      kind: 'misconception_check',
      question: 'A student simplifies (x + 5)/x and answers 5. What went wrong?',
      commonErrors: [
        {
          answer: '5',
          misconception: 'Canceled the x in the numerator against the x in the denominator, treating it like a common factor.',
          correctsTo:
            'The x in (x + 5) is ADDED to 5, not multiplied — it is a term, not a factor, so it cannot cancel. The expression is already fully simplified as (x + 5)/x (equivalently 1 + 5/x); nothing further reduces.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Factor first: pull the GCF, then look for difference of squares or a trinomial pattern (m·n = c, m+n = b).',
        'Sum of squares (a² + b²) never factors over the reals — a favorite SAT distractor shape.',
        'Rational exponent x^(p/q) means the qth root of x raised to the p power; product/quotient/power rules apply exactly as with integer exponents, including to numeric coefficients.',
        'Simplify rational expressions by factoring fully, then canceling common FACTORS only — never a term that is added or subtracted.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Equivalent Expressions: Factoring & Rational Exponents' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
