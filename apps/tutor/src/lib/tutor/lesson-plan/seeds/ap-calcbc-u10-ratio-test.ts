/**
 * AP Calculus BC — CED Unit 10.8+10.9: Ratio Test, Absolute and Conditional
 * Convergence.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U10_RATIO_TEST: LessonPlan = {
  id: 'evelyn.ap.calcbc.ratio-test.v1', title: 'U10.8 Ratio Test, Absolute and Conditional Convergence',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.ratio-test', description: 'Apply the ratio test to determine convergence. Distinguish absolute convergence (Σ |a_n| converges), conditional convergence (Σ a_n converges but Σ |a_n| diverges), and divergence.', standard: 'AP-CALCBC-10.8-10.9' }],
  prerequisites: ['apcalcbc.alternating-series'], followUps: ['apcalcbc.power-series'], estimatedMinutes: 20,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame the ratio test as the workhorse.', script: "The ratio test is the most powerful test in our toolkit. It works on factorials, exponentials, and power series. AP loves it. Definitive answer when limit ≠ 1; inconclusive only at exactly 1.", estimatedMinutes: 2 },
    { id: 'concept-ratio', kind: 'concept', goal: 'Cover ratio test + abs/cond convergence.',
      keyIdeas: [
        'RATIO TEST: For Σ a_n with a_n ≠ 0, compute L = lim_{n→∞} |a_{n+1}/a_n|.',
        '  • If L < 1: series CONVERGES ABSOLUTELY.',
        '  • If L > 1 (or L = ∞): series DIVERGES.',
        '  • If L = 1: TEST IS INCONCLUSIVE. (Try another test.)',
        'WHEN TO USE: factorials (n!), exponentials (a^n), or any series where ratio simplifies. Most useful for POWER SERIES.',
        'EXAMPLE — Σ n!/n^n. a_{n+1}/a_n = (n+1)!/(n+1)^{n+1} · n^n/n! = (n+1)·n^n/(n+1)^{n+1} = n^n/(n+1)^n = 1/(1 + 1/n)^n. Limit = 1/e ≈ 0.368 < 1. ✓ Converges.',
        'ABSOLUTE CONVERGENCE: Σ |a_n| converges. Strong form. Implies Σ a_n also converges.',
        'CONDITIONAL CONVERGENCE: Σ a_n converges BUT Σ |a_n| DIVERGES. Weak form. Only happens for alternating-style series whose magnitudes diverge.',
        'EXAMPLE — Alternating harmonic Σ (-1)^{n+1}/n: converges (by AST) but Σ 1/n diverges. CONDITIONAL.',
        'EXAMPLE — Σ (-1)^n/n²: converges, AND Σ 1/n² converges (p-series, p=2). ABSOLUTE.',
        'STRATEGY: when given an alternating series, check whether Σ |a_n| converges (using positive-term tests). If yes → absolute. If no but original converges → conditional.',
      ],
      vocabulary: [
        { term: 'absolute convergence', definition: 'Σ |a_n| converges.' },
        { term: 'conditional convergence', definition: 'Σ a_n converges, Σ |a_n| diverges.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-ratio', kind: 'worked_example', problem: 'Use the ratio test on Σ 2^n/n!.',
      steps: [
        'STEP 1 — a_n = 2^n/n!. a_{n+1} = 2^{n+1}/(n+1)!.',
        'STEP 2 — a_{n+1}/a_n = [2^{n+1}/(n+1)!] · [n!/2^n] = 2/(n+1).',
        'STEP 3 — L = lim 2/(n+1) = 0 < 1.',
        'STEP 4 — CONVERGES ABSOLUTELY.',
      ],
      answer: 'Converges absolutely (L = 0).', estimatedMinutes: 4 },
    { id: 'try-ratio', kind: 'try_yourself', problem: 'Apply the ratio test to Σ n²/3^n.',
      expectedAnswer: 'a_{n+1}/a_n = (n+1)²/3^{n+1} · 3^n/n² = (n+1)²/(3n²). lim = 1/3 < 1. CONVERGES ABSOLUTELY.',
      responseFormat: 'free', hints: ['Set up ratio; cancel; take limit.'], estimatedMinutes: 3 },
    { id: 'try-abs-cond', kind: 'try_yourself', problem: 'Determine if Σ (-1)^n/(n + 1) converges absolutely, conditionally, or diverges.',
      expectedAnswer: 'Original Σ (-1)^n/(n+1): AST applies (1/(n+1) decreasing, → 0). Converges. \nNow check Σ |a_n| = Σ 1/(n+1). Compare with Σ 1/n (harmonic, diverges). 1/(n+1) and 1/n differ by a constant shift; both diverge. \n→ Original converges but absolute series diverges. CONDITIONALLY CONVERGENT.',
      responseFormat: 'free', hints: ['Check both: original (AST) and absolute (positive-term tests).'], estimatedMinutes: 4 },
    { id: 'try-synthesis', kind: 'try_yourself', problem: 'AP-style synthesis. Use the ratio test to determine convergence of Σ (-1)^n · n/2^n.',
      expectedAnswer: 'a_n = (-1)^n · n/2^n. |a_{n+1}/a_n| = (n+1)/2^{n+1} · 2^n/n = (n+1)/(2n). lim = 1/2 < 1. By the ratio test, CONVERGES ABSOLUTELY.',
      responseFormat: 'free', hints: ['Ratio test ignores signs (uses |·|).'], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Ratio test: L = lim |a_{n+1}/a_n|. L < 1 → converges abs. L > 1 → diverges. L = 1 → inconclusive.',
      'Absolute convergence: Σ |a_n| converges (implies Σ a_n converges).',
      'Conditional convergence: Σ a_n converges, Σ |a_n| diverges (weaker form).',
      'Use ratio test for factorials, exponentials, power series.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '10', cedTopic: '10.8-10.9', cedTitle: 'Ratio Test', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '9', note: 'Standard ratio test.' }] },
};
