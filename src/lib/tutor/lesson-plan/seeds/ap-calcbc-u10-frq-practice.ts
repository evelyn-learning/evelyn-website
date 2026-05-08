/**
 * AP Calculus BC — Unit 10 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U10_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.calcbc.u10-frq-practice.v1', title: 'U10 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.u10-frq-practice', description: 'Apply Unit 10 series, Taylor, and convergence techniques.', standard: 'AP-CALCBC-10-FRQ' }],
  prerequisites: ['apcalcbc.maclaurin-series'], followUps: [], estimatedMinutes: 28,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Unit 10 FRQs combine Taylor polynomials, error bounds, and series manipulation. Three problems incoming.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'Taylor poly: T_n(x) = Σ f^{(k)}(c)(x−c)^k/k!.',
      'Lagrange error: |R_n| ≤ M·|x−c|^{n+1}/(n+1)!.',
      'Power series IOC: ratio test + endpoint check.',
      'Manipulating series: substitute, differentiate, integrate.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-taylor', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Taylor Polynomial. Let f(x) = e^{2x}. (a) Find the third-degree Maclaurin polynomial T_3(x) for f. (b) Use T_3 to approximate f(0.1). (c) Find an upper bound for |f(0.1) − T_3(0.1)| using the Lagrange error formula.',
      expectedAnswer: '(a) f(x) = e^{2x}. f^{(k)}(x) = 2^k e^{2x}. f^{(k)}(0) = 2^k. T_3(x) = 1 + 2x + (2²/2!)x² + (2³/3!)x³ = 1 + 2x + 2x² + (4/3)x³. (2 pts)\n(b) T_3(0.1) = 1 + 0.2 + 0.02 + (4/3)(0.001) = 1 + 0.2 + 0.02 + 0.00133 ≈ 1.22133. (1.5 pts)\n(c) f^(4)(x) = 16 e^{2x}. On [0, 0.1], max is at x = 0.1: 16 e^{0.2} < 16·1.222 ≈ 19.55 < 20. M = 20. |R_3(0.1)| ≤ 20·(0.1)^4/4! = 20·0.0001/24 ≈ 8.33×10^-5. (2.5 pts)\nTotal: 6 points.',
      responseFormat: 'frq', hints: ['Compute derivatives at 0; bound 4th derivative.'], estimatedMinutes: 6 },
    { id: 'try-frq-power-series', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Power Series. Consider Σ_{n=1}^∞ (x − 2)^n/(n·3^n). (a) Find the radius of convergence. (b) Find the interval of convergence (with endpoint checks).',
      expectedAnswer: '(a) Apply ratio test. |a_{n+1}/a_n| = |(x−2)^{n+1}/((n+1)·3^{n+1})| · |n·3^n/(x−2)^n| = |x−2|·n/(3(n+1)). lim = |x−2|/3. Converges when |x−2|/3 < 1, i.e., |x−2| < 3, i.e., -1 < x < 5. R = 3. (3 pts)\n(b) Endpoints. x = 5: Σ 3^n/(n·3^n) = Σ 1/n. Harmonic, DIVERGES. x = -1: Σ (-3)^n/(n·3^n) = Σ (-1)^n/n. Alternating harmonic, AST applies (b_n = 1/n decreasing → 0), CONVERGES. IOC: [-1, 5). (3 pts)\nTotal: 6 points.',
      responseFormat: 'frq', hints: ['Ratio test for R; check both endpoints.'], estimatedMinutes: 6 },
    { id: 'try-frq-manipulation', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Series Manipulation. Use the known Maclaurin series for cos x to (a) find the Maclaurin series for f(x) = x · cos(x²), (b) evaluate ∫_0^1 cos(x²) dx as a series, (c) approximate this integral to within 0.001.',
      expectedAnswer: '(a) cos(u) = Σ (-1)^n u^{2n}/(2n)!. Sub u = x²: cos(x²) = Σ (-1)^n x^{4n}/(2n)!. Multiply by x: x·cos(x²) = Σ (-1)^n x^{4n+1}/(2n)!. (2 pts)\n(b) ∫_0^1 cos(x²) dx. Use cos(x²) = Σ (-1)^n x^{4n}/(2n)!. Integrate term-by-term: ∫_0^1 [Σ (-1)^n x^{4n}/(2n)!] dx = Σ (-1)^n /[(4n+1)(2n)!]. Expanded: 1 − 1/(5·2!) + 1/(9·4!) − 1/(13·6!) + ... = 1 − 1/10 + 1/216 − 1/9360 + .... (2 pts)\n(c) Alternating series; error bound by next omitted term. b_3 = 1/(13·720) = 1/9360 < 0.001. So S_2 = 1 − 1/10 + 1/216 = 1 − 0.1 + 0.00463 ≈ 0.9046 has error < 0.001. (2 pts)\nTotal: 6 points.',
      responseFormat: 'frq', hints: ['Substitute x² in cos series; integrate; use AST error bound.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Taylor polynomials and Lagrange error.',
      'Power series radius and interval of convergence (with endpoints).',
      'Substitute, differentiate, integrate Maclaurin series.',
      'AST error bound for approximating sums.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '10', cedTopic: '10-FRQ', cedTitle: 'Unit 10 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on past AP Calc BC Unit-10.' }] },
};
