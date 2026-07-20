/**
 * Digital SAT — Math / Advanced Math: Exponential Functions, Growth & Decay.
 *
 * Nonlinear-functions questions on the digital SAT lean heavily on
 * y = a·bᵗ models: writing the equation from a word problem, reading off
 * the growth/decay rate, and — the recurring trap — rewriting a
 * compounded exponent like (1.03)^(4t) to find the true per-period rate.
 * Desmos is allowed on every math question; it's the fastest way to check
 * a table against a candidate model.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U2_EXPONENTIAL_FUNCTIONS: LessonPlan = {
  id: 'evelyn.testprep.dsat.exponential-functions.v1',
  title: 'Exponential Functions, Growth & Decay',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.exponential-functions',
      standard: 'DSAT-2.4',
      description:
        'Write and interpret exponential models y = a·bᵗ for growth and decay, identify growth/decay rate from a formula or table, and rewrite compounded exponents to find an effective per-period rate.',
    },
  ],
  prerequisites: ['dsat.linear-functions'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame exponential models as a recurring Advanced Math pattern — population, investment, and decay questions all reduce to the same y = a·bᵗ setup.',
      script:
        'Advanced Math is roughly 35 percent of SAT Math, and nonlinear-function questions inside it show up on nearly every test — usually as an exponential growth or decay model dressed up as a population, investment, or radioactive-decay story. Every one of these questions reduces to the same equation, y = a times b to the t. Learn to read off a and b, and these become quick points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-exponential-models',
      kind: 'concept',
      goal: 'The y = a·bᵗ form, growth vs. decay, writing the model from a word problem, the compounded-rate trap, and telling exponential apart from linear in a table.',
      keyIdeas: [
        'BASE FORM — y = a · bᵗ. a is the INITIAL value (t = 0). b is the growth/decay FACTOR applied every unit of t.',
        'GROWTH vs. DECAY — b > 1 means growth; 0 < b < 1 means decay. From a percent rate r: growth uses b = 1 + r, decay uses b = 1 − r.',
        'WRITING THE MODEL — pull the initial amount straight from the problem for a, and convert the stated percent change into b using b = 1 ± r. "Decreases 15% per year, starts at 2000" → V(t) = 2000(0.85)ᵗ.',
        'TRAP — COMPOUNDED EXPONENT. The SAT often gives something like B(t) = 5000(1.03)^(4t) and asks for the ANNUAL rate. Do NOT just multiply 3% by 4. Rewrite the exponent as a product first: (1.03)^(4t) = (1.03⁴)ᵗ. Compute 1.03⁴ ≈ 1.1255 — the true annual growth rate is about 12.6%, not 12%.',
        'LINEAR vs. EXPONENTIAL FROM A TABLE — constant DIFFERENCE between consecutive outputs signals linear; constant RATIO signals exponential. Divide, don\'t subtract, to test for exponential.',
        'GRAPH BEHAVIOR — for a > 0, the graph never touches y = 0 (horizontal asymptote) and the y-intercept is a. Growth curves rise faster and faster; decay curves flatten toward zero.',
        'COMPOUND INTEREST is the same model dressed up: A = P(1 + r/n)^(nt). It rewrites to the a·bᵗ form with a = P and b = (1 + r/n)ⁿ per year.',
        'DESMOS CHECK — type the candidate equation and a few (t, y) pairs from the problem as a table; if the points sit on the curve, the model is right. Fast way to eliminate wrong choices.',
      ],
      vocabulary: [
        { term: 'growth factor', definition: 'the base b in y = a·bᵗ when b > 1; multiplying the previous value by b each unit of t increases it.' },
        { term: 'decay factor', definition: 'the base b in y = a·bᵗ when 0 < b < 1; multiplying by b each unit of t decreases the value toward (but never reaching) zero.' },
        { term: 'horizontal asymptote', definition: 'the line the graph approaches but never reaches — for a > 0 in y = a·bᵗ, that line is y = 0.' },
        { term: 'compounding period', definition: 'the fixed interval (year, quarter, month) over which the growth/decay factor is applied once.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-basic-decay',
      kind: 'worked_example',
      problem:
        "A car's value depreciates 12% per year from an initial value of $28,000. Write a function V(t) for its value after t years, and find its value after 5 years.",
      steps: [
        'Decay rate r = 0.12, so the decay factor is b = 1 − 0.12 = 0.88.',
        'Model: V(t) = 28000(0.88)ᵗ.',
        'Evaluate at t = 5: 0.88⁵ = 0.7744 · 0.7744 ≈ 0.527732 (0.88² = 0.7744, 0.88⁴ = 0.7744² ≈ 0.599695, ×0.88 again).',
        'V(5) = 28000 × 0.527732 ≈ 14,776.49.',
      ],
      answer: 'V(t) = 28000(0.88)ᵗ; V(5) ≈ $14,776',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-compounded-rate',
      kind: 'worked_example',
      problem:
        'A savings account balance is modeled by B(t) = 5000(1.03)^(4t), where t is measured in years. To the nearest tenth of a percent, what is the effective ANNUAL growth rate?',
      steps: [
        'Rewrite the exponent as a product so t stands alone: B(t) = 5000 · (1.03⁴)ᵗ.',
        'Compute 1.03⁴: 1.03² = 1.0609; 1.0609² = 1.12550881.',
        'The annual growth factor is ≈ 1.1255, so the annual rate is 1.1255 − 1 = 0.1255 → 12.6% (nearest tenth).',
        'TRAP check: 3% × 4 = 12% is close but WRONG — compounding four times a year at 3% compounds to slightly more than 12% annually.',
      ],
      answer: '≈ 12.6% per year',
      estimatedMinutes: 4,
    },
    {
      id: 'try-identify-rate',
      kind: 'try_yourself',
      problem:
        'A population of foxes in a preserve is modeled by P(t) = 240(1.06)ᵗ, where t is the number of years since 2020. Which of the following best describes the model?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The population is decreasing by 6% per year.' },
        { id: 'b', text: 'The population is increasing by 6% per year.', correct: true },
        { id: 'c', text: 'The population is increasing by 60% per year.' },
        { id: 'd', text: 'The initial population was 1.06.' },
      ],
      expectedAnswer: 'The population is increasing by 6% per year.',
      hints: ['Compare the base b = 1.06 to 1: greater than 1 means growth, not decay.', 'b = 1 + r, so 1.06 = 1 + 0.06 → r = 6%.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-table-vs-linear',
      kind: 'try_yourself',
      problem:
        'The table shows the value of an investment for several years: t = 0 gives $1000, t = 1 gives $1050, t = 2 gives $1102.50, t = 3 gives $1157.625. Which type of function best models the value as a function of t?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Linear, because the value increases by a constant amount each year.' },
        { id: 'b', text: 'Exponential, because the value increases by a constant ratio each year.', correct: true },
        { id: 'c', text: 'Quadratic, because the value increases by increasing amounts each year.' },
        { id: 'd', text: 'Linear, because all the differences are positive.' },
      ],
      expectedAnswer: 'Exponential, because the value increases by a constant ratio each year.',
      hints: [
        'Check whether consecutive DIFFERENCES are constant (linear) or consecutive RATIOS are constant (exponential).',
        'Divide: 1050/1000, 1102.50/1050, 1157.625/1102.50 — each equals 1.05.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spr-decay',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): An isotope decays according to the function A(t) = 80(0.5)^(t/12), where t is measured in days and A(t) is measured in grams. What is the value of A(t), in grams, after 24 days?',
      responseFormat: 'numeric',
      expectedAnswer: '20',
      hints: ['Substitute t = 24 into the exponent first: 24/12 = 2.', 'A(24) = 80 · 0.5² = 80 · 0.25.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rate-as-base',
      kind: 'misconception_check',
      question:
        'A student is asked to write a function for a value that decreases by 15% each year, starting at 2000. They write V(t) = 2000(0.15)ᵗ. What went wrong?',
      commonErrors: [
        {
          answer: 'V(t) = 2000(0.15)ᵗ',
          misconception: 'Using the percent decrease itself (0.15) as the base b, instead of 1 minus the rate.',
          correctsTo:
            'The decay factor is b = 1 − r = 1 − 0.15 = 0.85, so the correct model is V(t) = 2000(0.85)ᵗ. Using 0.15 as the base would mean losing 85% of the value every single year — a far steeper drop than the problem describes.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y = a·bᵗ: a is the initial value, b is the growth/decay factor. b = 1 + r for growth, b = 1 − r for decay.',
        'A constant RATIO between consecutive outputs signals exponential; a constant DIFFERENCE signals linear.',
        'For a compounded exponent like (1.03)^(4t), rewrite it as (1.03⁴)ᵗ before reading off the per-period rate — don\'t just multiply the rate by the count.',
        'Desmos can graph the model or table the given points to verify a candidate equation fast.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Exponential Functions, Growth & Decay' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
