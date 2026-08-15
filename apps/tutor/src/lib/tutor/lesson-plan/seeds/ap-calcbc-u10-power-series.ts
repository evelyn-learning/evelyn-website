/**
 * AP Calculus BC — CED Unit 10.13: Power Series, Radius and Interval of
 * Convergence.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U10_POWER_SERIES: LessonPlan = {
  id: 'evelyn.ap.calcbc.power-series.v1', title: 'U10.13 Power Series — Radius and Interval of Convergence',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.power-series', description: 'Find the radius of convergence R and interval of convergence (IOC) for a power series Σ a_n (x − c)^n using the ratio test, including endpoint analysis.', standard: 'AP-CALCBC-10.13' }],
  prerequisites: ['apcalcbc.taylor-polynomial'], followUps: ['apcalcbc.maclaurin-series'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame power series.', script: "A power series Σ a_n(x − c)^n is a series with a VARIABLE x. It converges for some values of x and diverges for others. The set of x-values where it converges is the INTERVAL OF CONVERGENCE — always centered at c with some radius R.", estimatedMinutes: 2 },
    { id: 'concept-power', kind: 'concept', goal: 'Cover power series + R + IOC.',
      keyIdeas: [
        'POWER SERIES centered at c: Σ_{n=0}^∞ a_n (x − c)^n.',
        'CONVERGENCE STRUCTURE: There exists R ∈ [0, ∞] (the RADIUS OF CONVERGENCE) such that:',
        '  • Series converges for |x − c| < R (open interval).',
        '  • Series diverges for |x − c| > R.',
        '  • At |x − c| = R (endpoints): MUST CHECK SEPARATELY — could converge or diverge.',
        'INTERVAL OF CONVERGENCE (IOC): the actual set of x where it converges. Always one of: (c−R, c+R), [c−R, c+R), (c−R, c+R], or [c−R, c+R].',
        'FINDING R via ratio test: Compute lim |a_{n+1}(x−c)^{n+1}/[a_n (x−c)^n]| = |x − c| · lim |a_{n+1}/a_n|. Set < 1 and solve.',
        'EXAMPLE — Σ x^n/n. Ratio: |x|·n/(n+1) → |x|. Converges when |x| < 1, diverges |x| > 1. R = 1. \nEndpoints: x = 1 → Σ 1/n harmonic, DIVERGES. x = -1 → Σ (-1)^n/n alternating harmonic, CONVERGES (AST). \nIOC: [-1, 1).',
        'SPECIAL CASES of R:',
        '  • R = 0: converges only at x = c (rare; usually n!-style coefficients).',
        '  • R = ∞: converges for all real x (e.g., e^x, sin x, cos x Maclaurin series).',
      ],
      vocabulary: [
        { term: 'radius of convergence', definition: 'R such that series converges for |x − c| < R.' },
        { term: 'interval of convergence', definition: 'Set of x where series converges (with endpoint analysis).' },
      ],
      estimatedMinutes: 6 },
    { id: 'worked-power', kind: 'worked_example', problem: 'Find the radius and interval of convergence of Σ_{n=1}^∞ (x − 2)^n / n².',
      steps: [
        'STEP 1 — Apply ratio test. |a_{n+1}/a_n| = |(x−2)^{n+1}/(n+1)²| · |n²/(x−2)^n| = |x − 2|·n²/(n+1)².',
        'STEP 2 — lim = |x − 2|·1 = |x − 2|. Series converges when |x − 2| < 1, i.e., 1 < x < 3.',
        'STEP 3 — R = 1. Endpoints: x = 1 → Σ (-1)^n/n². AST or absolute (Σ 1/n² converges). CONVERGES. x = 3 → Σ 1/n² (p-series, p = 2). CONVERGES.',
        'STEP 4 — IOC: [1, 3].',
      ],
      answer: 'R = 1; IOC = [1, 3].', estimatedMinutes: 6 },
    { id: 'try-radius', kind: 'try_yourself', problem: 'Find the radius of convergence of Σ (x − 1)^n / n!.',
      expectedAnswer: '|a_{n+1}/a_n| = |x−1|^{n+1}/(n+1)! · n!/|x−1|^n = |x−1|/(n+1). lim = 0 for ALL x. Converges everywhere. R = ∞. IOC = (-∞, ∞).',
      responseFormat: 'free', hints: ['Factorials: limit goes to 0 → R = ∞.'], estimatedMinutes: 3 },
    { id: 'try-ioc', kind: 'try_yourself', problem: 'Find R and IOC of Σ x^n / n.',
      expectedAnswer: '|a_{n+1}/a_n| = |x|·n/(n+1). lim = |x|. Converges |x| < 1. R = 1. \nEndpoints: x = 1 → Σ 1/n (harmonic) DIVERGES. x = -1 → Σ (-1)^n/n alternating harmonic CONVERGES. \nIOC: [-1, 1).',
      responseFormat: 'free', hints: ['Always check endpoints separately.'], estimatedMinutes: 4 },
    { id: 'try-synthesis', kind: 'try_yourself', problem: 'AP-style synthesis. Find R and IOC of Σ_{n=1}^∞ n²(x + 3)^n.',
      expectedAnswer: '|a_{n+1}/a_n| = (n+1)²|x+3|^{n+1}/(n²|x+3|^n) = |x+3|·(n+1)²/n². lim = |x+3|. Converges when |x+3| < 1, i.e., -4 < x < -2. R = 1. \nEndpoints: x = -2 → Σ n²·1^n = Σ n². lim n² = ∞ → DIVERGES (nth-term test). x = -4 → Σ n²(-1)^n. lim ≠ 0 → DIVERGES. \nIOC: (-4, -2). (Both endpoints excluded.)',
      responseFormat: 'frq', hints: ['Endpoint check: nth-term test catches obvious divergence.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Power series converges on |x − c| < R and diverges on |x − c| > R.',
      'Find R using ratio test: |x − c|·lim|a_{n+1}/a_n| < 1.',
      'CHECK ENDPOINTS SEPARATELY (could be open, closed, or half-open).',
      'R = 0 only at c. R = ∞ converges everywhere.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '10', cedTopic: '10.13', cedTitle: 'Power Series', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '9', note: 'Standard power series.' }] },
};
