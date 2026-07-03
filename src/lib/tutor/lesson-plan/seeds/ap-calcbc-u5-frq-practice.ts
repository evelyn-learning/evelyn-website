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
      expectedAnswer: '(a) f\' = 3x² − 6x = 3x(x − 2). Critical: x = 0, x = 2. (2)\n(b) f\'\' = 6x − 6. f\'\'(0) = -6 < 0 → local max at x=0; f(0) = 2. f\'\'(2) = 6 > 0 → local min; f(2) = 8 − 12 + 2 = -2. (3)\n(c) f\'\' = 0 at x = 1; sign changes -→+. Inflection at x = 1; f(1) = 1 − 3 + 2 = 0. Inflection point (1, 0). (1)\n(d) Candidates on [-1, 4]: f(-1) = -1 − 3 + 2 = -2; f(0) = 2; f(2) = -2; f(4) = 64 − 48 + 2 = 18. Absolute max 18 at x = 4. Absolute min -2 (tied at x = -1 and x = 2). (3)\nTotal: 9 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 2, scoringCriteria: 'Computes f\'(x) = 3x² − 6x, factors it, and solves f\'(x) = 0 to report both critical points x = 0 and x = 2. (Setup: correct derivative; Execution: both critical x-values.)', modelResponse: 'f\'(x) = 3x² − 6x = 3x(x − 2). Setting f\'(x) = 0 gives critical points x = 0 and x = 2.' },
        { criterionId: 'b', maxPoints: 3, scoringCriteria: 'Finds f\'\'(x) = 6x − 6 and applies the second derivative test: f\'\'(0) < 0 → local max at x = 0 (f(0) = 2); f\'\'(2) > 0 → local min at x = 2 (f(2) = -2). Full credit requires both the sign of f\'\' AND the classification/justification for each critical point.', modelResponse: 'f\'\'(x) = 6x − 6. f\'\'(0) = -6 < 0, so by the Second Derivative Test f has a local MAX at x = 0, with f(0) = 2. f\'\'(2) = 6 > 0, so f has a local MIN at x = 2, with f(2) = 8 − 12 + 2 = -2.' },
        { criterionId: 'c', maxPoints: 1, scoringCriteria: 'Solves f\'\'(x) = 0 to get x = 1, justifies it is an inflection point by a sign change of f\'\' (− → +), and reports the point (1, 0).', modelResponse: 'f\'\'(x) = 6x − 6 = 0 at x = 1. f\'\' changes from negative to positive there, so concavity changes and x = 1 is an inflection point: (1, f(1)) = (1, 0).' },
        { criterionId: 'd', maxPoints: 3, scoringCriteria: 'Uses the Candidates Test on [-1, 4]: evaluates f at the critical points and both endpoints (f(-1) = -2, f(0) = 2, f(2) = -2, f(4) = 18), then identifies absolute max 18 at x = 4 and absolute min -2 (at x = -1 and x = 2). Requires evaluating endpoints AND critical points.', modelResponse: 'Candidates on [-1, 4]: f(-1) = -2, f(0) = 2, f(2) = -2, f(4) = 64 − 48 + 2 = 18. Absolute maximum is 18 at x = 4; absolute minimum is -2, attained at both x = -1 and x = 2.' },
      ] },
      modelResponse: '(a) f\'(x) = 3x(x − 2) → critical points x = 0, 2. (b) f\'\' = 6x − 6: f\'\'(0) = -6 < 0 → local max, f(0) = 2; f\'\'(2) = 6 > 0 → local min, f(2) = -2. (c) f\'\' = 0 at x = 1 with a − → + sign change → inflection point (1, 0). (d) Candidates on [-1, 4]: f(-1) = -2, f(0) = 2, f(2) = -2, f(4) = 18 → absolute max 18 at x = 4, absolute min -2 at x = -1 and x = 2.',
      responseFormat: 'frq',
      hints: ['Critical points → 2nd deriv test → inflection → candidates.'],
      estimatedMinutes: 8,
    },
    { id: 'try-frq-optimization', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Optimization. A box with a SQUARE BASE and OPEN TOP must have a volume of 32000 cm³. Find the dimensions that minimize the amount of material used (surface area).',
      expectedAnswer: 'Let x = side of square base, h = height. V = x²h = 32000 → h = 32000/x². Surface area (open top): SA = x² + 4xh. Substitute: SA(x) = x² + 4x·(32000/x²) = x² + 128000/x. SA\'(x) = 2x − 128000/x². Set = 0: 2x = 128000/x² → 2x³ = 128000 → x³ = 64000 → x = 40. Then h = 32000/1600 = 20. Verify: SA\'\'(x) = 2 + 256000/x³ > 0 → concave up → MIN. Min surface area: SA(40) = 1600 + 3200 = 4800 cm². (setup 2, reduce 2, solve 3, verify 2 — 9 points)',
      rubric: { parts: [
        { criterionId: 'setup', maxPoints: 2, scoringCriteria: 'Defines variables and states BOTH the objective (open-top surface area SA = x² + 4xh) and the constraint (volume x²h = 32000). Full credit needs the correct open-top area expression (square base + 4 sides, no top).', modelResponse: 'Let x = side of the square base and h = height. Objective: minimize surface area SA = x² + 4xh (open top: base + 4 sides). Constraint: V = x²h = 32000.' },
        { criterionId: 'reduce', maxPoints: 2, scoringCriteria: 'Uses the constraint to solve h = 32000/x² and substitutes to reduce SA to a single-variable function SA(x) = x² + 128000/x.', modelResponse: 'From the constraint h = 32000/x². Substituting: SA(x) = x² + 4x·(32000/x²) = x² + 128000/x.' },
        { criterionId: 'solve', maxPoints: 3, scoringCriteria: 'Differentiates SA\'(x) = 2x − 128000/x², sets it equal to 0, and solves for the critical dimension x = 40 (and h = 20).', modelResponse: 'SA\'(x) = 2x − 128000/x². Setting SA\'(x) = 0: 2x³ = 128000 → x³ = 64000 → x = 40. Then h = 32000/40² = 20.' },
        { criterionId: 'verify', maxPoints: 2, scoringCriteria: 'Justifies the critical point is a MINIMUM (e.g., SA\'\'(x) = 2 + 256000/x³ > 0, concave up) and reports the minimum surface area SA(40) = 4800 cm². Justification of the minimum is required for full credit.', modelResponse: 'SA\'\'(x) = 2 + 256000/x³ > 0 for x > 0, so SA is concave up and x = 40 gives a minimum. Minimum material: SA(40) = 1600 + 3200 = 4800 cm² (base 40×40 cm, height 20 cm).' },
      ] },
      modelResponse: 'x = base side, h = height. Objective SA = x² + 4xh, constraint x²h = 32000 → h = 32000/x². SA(x) = x² + 128000/x, SA\'(x) = 2x − 128000/x² = 0 → x³ = 64000 → x = 40, h = 20. SA\'\'(x) = 2 + 256000/x³ > 0 confirms a minimum. Minimum surface area SA(40) = 4800 cm² (40 cm × 40 cm base, 20 cm height).',
      responseFormat: 'frq',
      hints: ['Express SA in x alone via h = 32000/x². Differentiate, solve, verify.'],
      estimatedMinutes: 7,
    },
    { id: 'try-frq-graphical', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Graphical f\'. The graph of f\' (NOT f) has the following features: f\'(x) is positive on (-∞, 0), zero at x = 0, negative on (0, 3), zero at x = 3, positive on (3, ∞). Additionally, f\' has its MINIMUM value at x = 1.5 and is INCREASING for x > 1.5. (a) Find intervals where f is increasing and decreasing. (b) Find local extrema of f. (c) Find inflection points of f. (d) Find concavity intervals of f.',
      expectedAnswer: '(a) f\' > 0 on (-∞, 0) → f increasing. f\' < 0 on (0, 3) → f decreasing. f\' > 0 on (3, ∞) → f increasing. (2)\n(b) f\' changes + → - at x = 0 → local MAX. f\' changes - → + at x = 3 → local MIN. (3)\n(c) f\'\' = derivative of f\' = slope of f\' graph. f\' is decreasing on (-∞, 1.5), increasing on (1.5, ∞). So f\'\' < 0 on (-∞, 1.5), f\'\' > 0 on (1.5, ∞). f\'\' changes sign at x = 1.5 → INFLECTION POINT at x = 1.5. (2)\n(d) Concave DOWN on (-∞, 1.5); concave UP on (1.5, ∞). (2)\nTotal: 9 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 2, scoringCriteria: 'Reads the SIGN of f\' to determine where f is increasing/decreasing: increasing on (-∞, 0) and (3, ∞) where f\' > 0, decreasing on (0, 3) where f\' < 0. Reasoning from the sign of f\' is required.', modelResponse: 'f is increasing where f\' > 0: on (-∞, 0) and (3, ∞). f is decreasing where f\' < 0: on (0, 3).' },
        { criterionId: 'b', maxPoints: 3, scoringCriteria: 'Identifies local extrema of f by SIGN CHANGES of f\': local max at x = 0 (f\' goes + → -) and local min at x = 3 (f\' goes - → +). Must justify by the sign change, not merely list zeros of f\'.', modelResponse: 'At x = 0, f\' changes from + to -, so f has a local MAXIMUM. At x = 3, f\' changes from - to +, so f has a local MINIMUM. (x = 1.5 is a min of f\', not a critical point of f.)' },
        { criterionId: 'c', maxPoints: 2, scoringCriteria: 'Recognizes f\'\' is the SLOPE of the f\' graph: since f\' has its minimum at x = 1.5 (decreasing then increasing), f\'\' changes from negative to positive there, giving an inflection point of f at x = 1.5.', modelResponse: 'f\'\' equals the slope of the f\' graph. f\' decreases on (-∞, 1.5) and increases on (1.5, ∞), so f\'\' < 0 then f\'\' > 0. The sign change of f\'\' at x = 1.5 makes it an INFLECTION POINT of f.' },
        { criterionId: 'd', maxPoints: 2, scoringCriteria: 'States concavity of f from the sign of f\'\' (slope of f\'): concave DOWN on (-∞, 1.5) and concave UP on (1.5, ∞).', modelResponse: 'f is concave DOWN on (-∞, 1.5) (f\' decreasing) and concave UP on (1.5, ∞) (f\' increasing).' },
      ] },
      modelResponse: '(a) f increasing on (-∞, 0) and (3, ∞), decreasing on (0, 3) (sign of f\'). (b) Local max at x = 0 (f\': + → -), local min at x = 3 (f\': - → +). (c) f\'\' = slope of f\'; f\' has a min at x = 1.5, so f\'\' changes - → + there → inflection point at x = 1.5. (d) Concave down on (-∞, 1.5), concave up on (1.5, ∞).',
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
