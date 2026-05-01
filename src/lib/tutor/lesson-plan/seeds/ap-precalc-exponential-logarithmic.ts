/**
 * AP Pre-Calculus — Unit 2: Exponential and Logarithmic Functions.
 *
 * Aligned with the 2025-26 College Board CED. Unit 2 weight: 27-40%
 * of the multiple-choice section.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PRECALC_EXPONENTIAL_LOGARITHMIC: LessonPlan = {
  id: 'evelyn.ap.precalc.exponential-logarithmic.v1',
  title: 'Exponential and Logarithmic Functions',
  curriculum: 'CollegeBoard',
  grade: 'ap',
  subject: 'math',
  topic: 'ap-precalculus',
  locale: 'en',
  los: [
    {
      id: 'apprecalc.exponential-logarithmic',
      description: 'Model exponential growth and decay, manipulate logarithmic expressions, recognize the inverse relationship between exponential and logarithmic functions, and apply log/exp rules.',
      standard: 'AP-PRECALC-2',
    },
  ],
  prerequisites: ['apprecalc.polynomial-rational'],
  followUps: ['apprecalc.trigonometric-polar'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Why exponentials describe so much of the real world.',
      script: 'Compound interest, viral spread, radioactive decay, drug clearance, Moore\'s Law — all exponentials. The defining feature: the rate of change is PROPORTIONAL to the current amount, so things accelerate (or decelerate) the more you have. Once you can read an exponential function and see the starting value, the growth or decay rate, and how to flip it into a logarithm, you can model most processes biologists and economists care about.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-toolkit',
      kind: 'concept',
      goal: 'Exponential structure, log-exp inverse pair, log rules, modeling.',
      keyIdeas: [
        'EXPONENTIAL FORM: f(x) = a · b^x. a is the y-intercept (value at x = 0). b is the base (growth/decay factor per unit x).',
        'GROWTH if b > 1; DECAY if 0 < b < 1. PERCENT growth rate = (b − 1) · 100% per unit x. (b = 1.05 → 5% growth; b = 0.9 → 10% decay.)',
        'NATURAL EXPONENTIAL: e^x where e ≈ 2.718. Continuous compounding: A = P · e^(rt) where r is the continuous rate.',
        'LOG-EXP INVERSE PAIR: log_b(b^x) = x. b^(log_b x) = x. Plotting f(x) = b^x and g(x) = log_b(x) gives mirror images across y = x.',
        'LOG PROPERTIES: log(MN) = log M + log N. log(M/N) = log M − log N. log(M^k) = k·log M. log_b(1) = 0. log_b(b) = 1. CHANGE OF BASE: log_b x = ln x / ln b.',
        'COMMON LOG: log(x) usually means base 10. NATURAL LOG: ln(x) means base e.',
        'SOLVING EXPONENTIAL EQUATIONS: take log of both sides, use power rule to bring exponent down. b^x = c → x = log_b(c) = ln(c)/ln(b).',
        'HALF-LIFE: time for amount to drop by half. Decay model: A = A₀ · (1/2)^(t/T) where T is the half-life.',
        'AP TIP: read exponential models in CONTEXT. If the model is P = 200·1.03^t, immediately say "200 starting, 3% growth per unit time." If it\'s 5000·0.92^t, say "5000 starting, 8% decay per unit time."',
      ],
      vocabulary: [
        { term: 'exponential function', definition: 'a function of the form f(x) = a·b^x; rate of change is proportional to the current value.' },
        { term: 'logarithm', definition: 'the inverse of an exponential — log_b(c) = the exponent x such that b^x = c.' },
        { term: 'half-life', definition: 'the time for an exponentially decaying quantity to fall to half its starting value.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-half-life',
      kind: 'worked_example',
      problem: 'A radioactive substance decays with a half-life of 8 days. If the initial amount is 200 grams, find the amount remaining after 24 days.',
      steps: [
        'Half-life model: A(t) = A₀ · (1/2)^(t/T). Here A₀ = 200, T = 8.',
        'A(24) = 200 · (1/2)^(24/8) = 200 · (1/2)³ = 200 · 1/8 = 25.',
        'INTUITION: 24 days is THREE half-lives. After each half-life, the amount halves: 200 → 100 → 50 → 25.',
        'GENERAL: after n half-lives, amount = A₀ · (1/2)ⁿ.',
      ],
      answer: '25 grams remain after 24 days.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve for x: 3^(x+1) = 81.',
      expectedAnswer: '3',
      responseFormat: 'numeric',
      hints: [
        '81 = 3⁴. So 3^(x+1) = 3⁴.',
        'When bases match, equate exponents: x + 1 = 4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-log-rules',
      kind: 'misconception_check',
      question: 'log(M + N) = log M + log N. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Confusing the product rule with addition.',
          correctsTo: 'FALSE. log(M·N) = log M + log N (product rule). But log(M + N) does NOT simplify — there\'s no rule that breaks log of a sum into separate terms. Same trap with log(M − N) ≠ log M − log N. Only PRODUCTS, QUOTIENTS, and POWERS inside the log can be split. Sums and differences inside a log have to stay together. The College Board loves to put this distractor in MC questions.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'a · b^x: a = start, b = factor per unit. Growth b > 1, decay 0 < b < 1.',
        'log_b is the inverse of b^x. Plots are reflections across y = x.',
        'log rules: product → sum, quotient → difference, power → coefficient. NO rule for log(M + N).',
        'Half-life: A = A₀ · (1/2)^(t/T).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A bank offers 6% annual interest. Which gives a larger final balance after 10 years on a $1000 deposit: simple interest, annual compounding, or continuous compounding?',
      hint: 'Simple: 1000(1 + 0.06·10) = $1600. Annual compound: 1000·1.06¹⁰ ≈ $1791. Continuous: 1000·e^(0.06·10) ≈ 1000·e^0.6 ≈ $1822. Continuous wins. The gap between annual and continuous is small (~2%) but real.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
