/**
 * AP Calculus BC — Unit 5 FRQ Practice.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U5_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.calcbc.u5-frq-practice.v1',
  title: 'U5 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.u5-frq-practice', description: 'Apply Unit 5 analytical applications in multi-part FRQs.', standard: 'AP-CALCBC-5-FRQ' }],
  prerequisites: ['apcalcbc.optimization'],
  followUps: [],
  estimatedMinutes: 30,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Set Unit 5 FRQ stakes.', script: "Unit 5 FRQs combine all of analytical applications: f, f', f'' analysis, optimization, and graphical reasoning. Three problems incoming.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresher on Unit 5 FRQ rubric.', keyIdeas: [
      'Always state hypotheses before applying MVT/EVT.',
      'For increasing/decreasing intervals: explicit sign analysis of f\'.',
      'For optimization: state objective + constraint + 1-variable reduction + verify max/min.',
      'For graphical f\': read sign for inc/dec; zeros + sign change for extrema; slope for f\'\'.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-fanalysis', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Function Analysis. Let f(x) = x³ − 3x² + 2. (a) Find all critical points. (b) Use the second derivative test to classify each. (c) Find inflection points. (d) Find absolute extrema on [-1, 4].',
      expectedAnswer: '(a) f\' = 3x² − 6x = 3x(x − 2). Critical: x = 0, x = 2. (1.5)\n(b) f\'\' = 6x − 6. f\'\'(0) = -6 < 0 → local max at x=0; f(0) = 2. f\'\'(2) = 6 > 0 → local min; f(2) = 8 − 12 + 2 = -2. (2.5)\n(c) f\'\' = 0 at x = 1; sign changes -→+. Inflection at x = 1; f(1) = 1 − 3 + 2 = 0. Inflection point (1, 0). (1.5)\n(d) Candidates on [-1, 4]: f(-1) = -1 − 3 + 2 = -2; f(0) = 2; f(2) = -2; f(4) = 64 − 48 + 2 = 18. Absolute max 18 at x = 4. Absolute min -2 (tied at x = -1 and x = 2). (2.5)\nTotal: 8 points.',
      responseFormat: 'frq',
      hints: ['Critical points → 2nd deriv test → inflection → candidates.'],
      estimatedMinutes: 8,
    },
    { id: 'try-frq-optimization', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Optimization. A box with a SQUARE BASE and OPEN TOP must have a volume of 32000 cm³. Find the dimensions that minimize the amount of material used (surface area).',
      expectedAnswer: 'Let x = side of square base, h = height. V = x²h = 32000 → h = 32000/x². Surface area (open top): SA = x² + 4xh. Substitute: SA(x) = x² + 4x·(32000/x²) = x² + 128000/x. SA\'(x) = 2x − 128000/x². Set = 0: 2x = 128000/x² → 2x³ = 128000 → x³ = 64000 → x = 40. Then h = 32000/1600 = 20. Verify: SA\'\'(x) = 2 + 256000/x³ > 0 → concave up → MIN. Min surface area: SA(40) = 1600 + 3200 = 4800 cm². (5 points)',
      responseFormat: 'frq',
      hints: ['Express SA in x alone via h = 32000/x². Differentiate, solve, verify.'],
      estimatedMinutes: 7,
    },
    { id: 'try-frq-graphical', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Graphical f\'. The graph of f\' (NOT f) has the following features: f\'(x) is positive on (-∞, 0), zero at x = 0, negative on (0, 3), zero at x = 3, positive on (3, ∞). Additionally, f\' has its MINIMUM value at x = 1.5 and is INCREASING for x > 1.5. (a) Find intervals where f is increasing and decreasing. (b) Find local extrema of f. (c) Find inflection points of f. (d) Find concavity intervals of f.',
      expectedAnswer: '(a) f\' > 0 on (-∞, 0) → f increasing. f\' < 0 on (0, 3) → f decreasing. f\' > 0 on (3, ∞) → f increasing. (1.5)\n(b) f\' changes + → - at x = 0 → local MAX. f\' changes - → + at x = 3 → local MIN. (2)\n(c) f\'\' = derivative of f\' = slope of f\' graph. f\' is decreasing on (-∞, 1.5), increasing on (1.5, ∞). So f\'\' < 0 on (-∞, 1.5), f\'\' > 0 on (1.5, ∞). f\'\' changes sign at x = 1.5 → INFLECTION POINT at x = 1.5. (2)\n(d) Concave DOWN on (-∞, 1.5); concave UP on (1.5, ∞). (1.5)\nTotal: 7 points.',
      responseFormat: 'frq',
      hints: ['Read sign of f\' for inc/dec. Sign changes for local extrema. Slope of f\' for f\'\'.'],
      estimatedMinutes: 6,
    },
    { id: 'recap', kind: 'recap', mustRemember: [
      'f\': sign for inc/dec; sign change for extrema.',
      'f\'\': sign for concavity; sign change for inflection.',
      'Optimization: objective + constraint + reduce + critical + verify.',
      'Graphical: slope of f\' is f\'\'.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '5', cedTopic: '5-FRQ', cedTitle: 'Unit 5 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on past AP Calc BC Unit-5 patterns.' }] },
};
