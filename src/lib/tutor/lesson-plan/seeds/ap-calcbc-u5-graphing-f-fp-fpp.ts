/**
 * AP Calculus BC — CED Unit 5.8+5.9: Graphing f, f', f'' (combined).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U5_GRAPHING_F_FP_FPP: LessonPlan = {
  id: 'evelyn.ap.calcbc.graphing-f-fp-fpp.v1',
  title: 'U5.8 Connecting f, f\', f\'\' through Graphs',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.graphing-f-fp-fpp',
      description:
        'Read information about f from graphs of f\' or f\'\'. Sketch f given f\' and possibly f\'\'. Identify maxima, minima, inflection points, and concavity from graphical data.',
      standard: 'AP-CALCBC-5.8-5.9',
    },
  ],
  prerequisites: ['apcalcbc.concavity-second-derivative'],
  followUps: ['apcalcbc.optimization'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook', kind: 'hook',
      goal: 'Frame graphical analysis as the most-tested AP exam skill.',
      script: "AP exam questions love giving you the GRAPH OF f' and asking you about f. The connections — f's shape from f''s sign, f's curvature from f''\\''s sign, inflection points — are everything in graphical-analysis FRQs.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-graphical', kind: 'concept',
      goal: 'Cover the graphical relationships and the readable features.',
      keyIdeas: [
        'CONNECTING THE THREE: f, f\', f\'\' encode complementary information about a function.',
        'FROM f\' GRAPH READ:',
        '- INTERVALS WHERE f IS INCREASING: where f\' > 0 (f\' graph is ABOVE x-axis).',
        '- INTERVALS WHERE f IS DECREASING: where f\' < 0 (below x-axis).',
        '- LOCAL MAXIMA OF f: where f\' changes from + to - (f\' graph crosses x-axis from above).',
        '- LOCAL MINIMA OF f: where f\' changes from - to + (crosses from below).',
        '- INFLECTION POINTS OF f: where f\'\' changes sign — equivalently, where f\' has a LOCAL EXTREMUM (peak/valley of f\' graph).',
        '- INTERVALS WHERE f IS CONCAVE UP: where f\' is INCREASING (f\'\' > 0).',
        '- INTERVALS WHERE f IS CONCAVE DOWN: where f\' is DECREASING (f\'\' < 0).',
        'FROM f\'\' GRAPH READ:',
        '- f CONCAVE UP: f\'\' > 0.',
        '- f CONCAVE DOWN: f\'\' < 0.',
        '- INFLECTION POINTS OF f: f\'\' = 0 with sign change.',
        'COMMON CONFUSION — keep clear which graph you\'re looking at. AP exam typically labels graphs explicitly. Reading f\' as if it were f is the #1 error.',
        'SKETCHING f from f\': use the sign of f\' to draw the rising/falling pattern; mark local extrema where f\' crosses zero with sign change; use slopes from the y-values of f\' to set the steepness.',
      ],
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-graph-f-prime', kind: 'worked_example',
      problem: 'You are shown the graph of f\'(x) (NOT f). The graph: f\' starts at +5 on the y-axis (at x = 0), decreases to 0 at x = 2, becomes negative reaching a minimum of -3 at x = 4, then increases back to 0 at x = 6, then continues increasing. Describe the behavior of f.',
      steps: [
        'STEP 1 — INCREASING/DECREASING. f\' > 0 for 0 ≤ x < 2: f INCREASING there. f\' < 0 for 2 < x < 6: f DECREASING. f\' > 0 for x > 6: f INCREASING.',
        'STEP 2 — LOCAL EXTREMA. f\' = 0 at x = 2 and x = 6. At x = 2: f\' goes + → - (local MAX of f). At x = 6: f\' goes - → + (local MIN of f).',
        'STEP 3 — CONCAVITY. f\'\' = derivative of f\'. f\' is DECREASING on (0, 4) → f\'\' < 0 there → f CONCAVE DOWN. f\' is INCREASING on (4, ∞) → f\'\' > 0 → f CONCAVE UP.',
        'STEP 4 — INFLECTION POINTS. f\' has its minimum at x = 4 (where f\'\' = 0 and changes sign from - to +). So f has an INFLECTION POINT at x = 4.',
      ],
      answer: 'f increasing (0,2), (6,∞); decreasing (2,6). Local max at x=2; local min at x=6. Concave down (0,4); concave up (4,∞). Inflection at x=4.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-read-graph', kind: 'try_yourself',
      problem: 'Suppose f\'(x) > 0 on (-∞, 0) and (3, ∞), f\'(x) < 0 on (0, 3), f\'\'(x) > 0 on (-∞, 1) and (4, ∞), f\'\'(x) < 0 on (1, 4). (a) Identify intervals where f is increasing/decreasing. (b) Identify local extrema of f. (c) Identify intervals of concavity. (d) Identify inflection points of f.',
      expectedAnswer: '(a) Increasing on (-∞, 0) ∪ (3, ∞); decreasing on (0, 3). (b) Local max at x = 0 (f\' changes + → -); local min at x = 3 (f\' changes - → +). (c) Concave up on (-∞, 1) ∪ (4, ∞); concave down on (1, 4). (d) Inflection at x = 1 and x = 4 (where f\'\' changes sign).',
      responseFormat: 'free',
      hints: ['Read each piece of info; convert sign of f\' to inc/dec; sign of f\'\' to concavity.'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-sketch', kind: 'try_yourself',
      problem: 'AP-style synthesis. The graph of f\' is a parabola opening upward, with vertex at (2, -1) and zeros at x = 1 and x = 3. Describe the shape of f including local extrema, increasing/decreasing intervals, concavity, and inflection points.',
      expectedAnswer: 'f\'(x) is an upward parabola with f\'(1) = f\'(3) = 0 and minimum at (2, -1). So f\'(x) < 0 on (1, 3); f\'(x) > 0 on (-∞, 1) ∪ (3, ∞). \nINC/DEC: f increasing on (-∞, 1) ∪ (3, ∞); decreasing on (1, 3). LOCAL EXTREMA: local max at x = 1; local min at x = 3.\nCONCAVITY: f\'\' = derivative of f\' = slope of f\'. The parabola has slope 0 at its vertex (x = 2), negative slope for x < 2, positive slope for x > 2. So f\'\' < 0 for x < 2 (f concave DOWN); f\'\' > 0 for x > 2 (f concave UP). INFLECTION at x = 2 (where f\' has its minimum).\nStrong answers: convert f\' info into f facts systematically; identify slope of f\' graph as f\'\'.',
      responseFormat: 'frq',
      hints: ['Slope of f\' graph IS f\'\'. Read the parabola\'s slope to deduce concavity.'],
      estimatedMinutes: 4,
    },
    {
      id: 'recap', kind: 'recap',
      mustRemember: [
        'f\' > 0 → f increasing. f\' < 0 → f decreasing.',
        'f\' changes sign + → - = local max. - → + = local min.',
        'f\'\' > 0 → concave up. f\'\' < 0 → concave down.',
        'f\'\' changes sign = inflection.',
        'Slope of f\' graph IS f\'\'.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5', cedTopic: '5.8-5.9', cedTitle: 'Connecting f, f\', f\'\' through Graphs',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '4', note: 'Standard graphical relationships.' }],
  },
};
