/**
 * AP Calculus BC — CED Unit 10.1+10.2: Series and Geometric Series.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U10_SERIES_CONVERGENCE: LessonPlan = {
  id: 'evelyn.ap.calcbc.series-convergence.v1', title: 'U10.1 Series, Sequences, and Geometric Series',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.series-convergence', description: 'Distinguish sequences vs series; understand convergence/divergence via partial sums; apply geometric series test (converges iff |r| < 1, sum = a/(1-r)).', standard: 'AP-CALCBC-10.1-10.2' }],
  prerequisites: [], followUps: ['apcalcbc.convergence-tests'], estimatedMinutes: 20,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame infinite series as a limit of partial sums.', script: "An infinite series Σ a_n adds infinitely many terms. Surprising fact: it can have a FINITE sum (if it converges). Today: how to tell. Geometric series is the simplest and most important case.", estimatedMinutes: 2 },
    { id: 'concept-series', kind: 'concept', goal: 'Cover sequences vs. series, partial sums, and geometric.',
      keyIdeas: [
        'SEQUENCE: a list a_1, a_2, a_3, ... — "what each term is."',
        'SERIES: a SUM Σ_{n=1}^∞ a_n = a_1 + a_2 + a_3 + ... — "what the cumulative addition is."',
        'PARTIAL SUM: S_N = Σ_{n=1}^N a_n. Just the first N terms added up.',
        'CONVERGENCE: A series Σ a_n CONVERGES if the limit lim_{N→∞} S_N exists and is finite. Otherwise it DIVERGES.',
        'GEOMETRIC SERIES: Σ_{n=0}^∞ a · r^n = a + ar + ar² + ar³ + ... where a is the first term and r is the common ratio.',
        'GEOMETRIC SERIES TEST: converges iff |r| < 1. SUM = a/(1 − r).',
        'EXAMPLE: Σ (1/2)^n = 1 + 1/2 + 1/4 + 1/8 + ... = 1/(1 − 1/2) = 2. (Here a = 1, r = 1/2.)',
        'COMMON MISTAKE: confusing GEOMETRIC SERIES (Σ r^n, sums to 1/(1-r) when |r| < 1) with HARMONIC SERIES (Σ 1/n, DIVERGES even though terms → 0).',
        'NTH-TERM DIVERGENCE TEST: if lim a_n ≠ 0 (or DNE), series DIVERGES. (Contrapositive: converging series ⇒ terms → 0; the converse is FALSE — terms going to 0 is NECESSARY but not SUFFICIENT.)',
      ],
      vocabulary: [
        { term: 'partial sum', definition: 'S_N = sum of first N terms.' },
        { term: 'geometric series', definition: 'Σ a · r^n. Converges iff |r| < 1; sum = a/(1−r).' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-geometric', kind: 'worked_example', problem: 'Determine if Σ_{n=0}^∞ 3·(2/3)^n converges. If so, find the sum.',
      steps: [
        'STEP 1 — Identify a and r. Geometric series Σ a · r^n with a = 3, r = 2/3.',
        'STEP 2 — |r| = 2/3 < 1. ✓ Converges.',
        'STEP 3 — Sum = a/(1 − r) = 3/(1 − 2/3) = 3/(1/3) = 9.',
      ],
      answer: 'Converges to 9.', estimatedMinutes: 4 },
    { id: 'try-geometric', kind: 'try_yourself', problem: 'Determine if Σ_{n=1}^∞ 4·(-1/2)^{n-1} converges. If so, find the sum.',
      expectedAnswer: 'Geometric series with a = 4 (first term, n = 1), r = -1/2. |r| = 1/2 < 1. Converges. Sum = 4/(1 − (-1/2)) = 4/(3/2) = 8/3.',
      responseFormat: 'numeric', hints: ['Identify a (first term) and r. Check |r| < 1.'], estimatedMinutes: 3 },
    { id: 'try-nth-term', kind: 'try_yourself', problem: 'Determine if Σ_{n=1}^∞ n/(2n + 1) converges or diverges using the nth-term test.',
      expectedAnswer: 'lim_{n→∞} n/(2n + 1) = 1/2 ≠ 0. By the nth-term divergence test, series DIVERGES.',
      responseFormat: 'free', hints: ['Compute lim a_n. If ≠ 0, diverges.'], estimatedMinutes: 3 },
    { id: 'try-synthesis', kind: 'try_yourself', problem: 'AP-style synthesis. Express 0.4444... as a geometric series and find its exact value.',
      expectedAnswer: '0.4444... = 0.4 + 0.04 + 0.004 + ... = Σ_{n=0}^∞ 0.4·(0.1)^n. Geometric: a = 0.4, r = 0.1. Sum = 0.4/(1 − 0.1) = 0.4/0.9 = 4/9.',
      responseFormat: 'numeric', hints: ['Repeating decimals are geometric series.'], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Convergence: lim of partial sums S_N exists and is finite.',
      'Geometric Σ a r^n: converges iff |r| < 1; sum = a/(1−r).',
      'nth-term test: if lim a_n ≠ 0, DIVERGES. (Converse FALSE.)',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '10', cedTopic: '10.1-10.2', cedTitle: 'Series and Geometric Series', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '9', note: 'Standard series intro.' }] },
};
