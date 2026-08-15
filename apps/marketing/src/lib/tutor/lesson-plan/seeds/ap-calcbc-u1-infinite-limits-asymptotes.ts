/**
 * AP Calculus BC — CED Unit 1.14: Connecting Infinite Limits and
 * Vertical Asymptotes.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_INFINITE_LIMITS_ASYMPTOTES: LessonPlan = {
  id: 'evelyn.ap.calcbc.infinite-limits-vertical-asymptotes.v1',
  title: 'U1.14 Infinite Limits and Vertical Asymptotes',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.infinite-limits-vertical-asymptotes',
      description:
        'Identify infinite limits at finite x-values, connect them to vertical asymptotes, determine the sign (±∞) of one-sided infinite limits, and identify vertical asymptotes of rational and other functions.',
      standard: 'AP-CALCBC-1.14',
    },
  ],
  prerequisites: ['apcalcbc.removing-discontinuities'],
  followUps: ['apcalcbc.limits-at-infinity'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Connect "limit is infinite" with the visual of a vertical asymptote.',
      script:
        "When a function blows up to infinity as x approaches some specific value, the graph has a VERTICAL ASYMPTOTE there — a vertical line the curve hugs but never crosses. Algebraically: the limit is ±∞. Geometrically: the curve shoots up or down. AP wants you to (a) detect them, (b) sign them correctly, (c) connect algebra and graph.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-vertical-asymptote',
      kind: 'concept',
      goal: 'Cover infinite-limit notation, sign analysis, vertical asymptote detection.',
      keyIdeas: [
        'INFINITE LIMIT NOTATION. lim_{x→a} f(x) = +∞ means as x approaches a, f(x) grows without bound (positively). lim_{x→a} f(x) = -∞ means it decreases without bound. Both technically mean "limit DNE as a finite number," but the +∞ / -∞ notation precisely describes the unbounded behavior.',
        'ONE-SIDED VARIANTS. lim_{x→a⁺} = +∞: function blows up positively from the right. lim_{x→a⁻} = -∞: function blows down negatively from the left. The two sides can disagree: 1/x at x = 0 has -∞ from left, +∞ from right.',
        'VERTICAL ASYMPTOTE: x = a is a vertical asymptote of f if AT LEAST ONE of the one-sided limits at a is +∞ or -∞.',
        'STANDARD SOURCE: rational functions where the denominator has a zero at x = a but the numerator does NOT (or has a smaller-order zero). Example: f(x) = 1/(x − 3) has a vertical asymptote at x = 3.',
        'SIGN ANALYSIS for one-sided infinite limits — for f(x) = N(x)/D(x) where D(a) = 0, N(a) ≠ 0: (1) determine the sign of N near a (just plug in N(a)). (2) determine the sign of D as x approaches a from each side. (3) the limit is +∞ if signs agree, -∞ if they differ.',
        'EXAMPLE OF SIGN ANALYSIS. f(x) = 5/(x − 3). At x = 3: N = 5 > 0. From x → 3⁺ (x slightly larger than 3): D = x − 3 is slightly positive. So 5/positive = +∞. From x → 3⁻: D is slightly negative. 5/negative = -∞. Both signs of infinity present (left and right different).',
        'NOT ALL DENOMINATOR ZEROS ARE VERTICAL ASYMPTOTES. If both numerator and denominator are zero at x = a (0/0 indeterminate), there might be a REMOVABLE discontinuity instead of an asymptote — depending on whether the limit is finite. Always check 0/0 cases by factoring/canceling FIRST before claiming asymptote.',
      ],
      vocabulary: [
        { term: 'vertical asymptote', definition: 'a vertical line x = a that the graph of f approaches but never crosses; identified by an infinite one-sided limit at x = a.' },
      ],
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-asymptote-sign',
      kind: 'worked_example',
      problem:
        'Determine all vertical asymptotes of f(x) = (x + 1)/(x² − 4x + 3). For each, find the one-sided limits.',
      steps: [
        'STEP 1 — FACTOR DENOMINATOR. x² − 4x + 3 = (x − 1)(x − 3). Zeros at x = 1 and x = 3.',
        'STEP 2 — CHECK NUMERATOR at each zero. Numerator at x = 1: 1 + 1 = 2 (nonzero). Numerator at x = 3: 3 + 1 = 4 (nonzero). NEITHER is 0/0. Both are FINITE/0 → both are VERTICAL ASYMPTOTES.',
        'STEP 3 — SIGN ANALYSIS at x = 1. f(x) = (x + 1)/[(x − 1)(x − 3)]. At x = 1: numerator = 2 (positive). Denominator factors: (x − 1) is small near 0 and changes sign across x = 1; (x − 3) at x = 1 is -2 (negative). So denominator near x = 1 has sign = (sign of x − 1) · (-) = -(sign of x − 1). For x → 1⁻: x − 1 < 0, so denominator = (-)(-2) = +2... wait let me redo. Specifically, as x approaches 1 from the LEFT (x slightly less than 1): (x − 1) is slightly negative, (x − 3) is approximately -2. Product: negative · negative = positive (small). So denominator is small positive, numerator is positive (2). f is +/+ = positive large. lim_{x→1⁻} f = +∞.',
        'STEP 4 — Continued for x → 1⁺. (x − 1) slightly positive, (x − 3) ≈ -2 (negative). Product: positive · negative = small negative. Numerator 2 / small negative = negative large. lim_{x→1⁺} = -∞.',
        'STEP 5 — Sign analysis at x = 3. Numerator at 3: 3 + 1 = 4 (positive). (x − 1) at 3 is 2 (positive). (x − 3) is small near 0. As x → 3⁻: (x − 3) slightly negative. Denominator = positive · negative = small negative. f = positive / negative = negative large. lim_{x→3⁻} = -∞. As x → 3⁺: (x − 3) slightly positive. Denominator = positive. f = positive / small positive = positive large. lim_{x→3⁺} = +∞.',
        'STEP 6 — SUMMARY. Two vertical asymptotes: x = 1 (lim from left = +∞, from right = -∞) and x = 3 (lim from left = -∞, from right = +∞).',
      ],
      answer: 'VAs at x = 1 (left +∞, right -∞) and x = 3 (left -∞, right +∞).',
      estimatedMinutes: 6,
    },
    {
      id: 'try-find-vas',
      kind: 'try_yourself',
      problem:
        'Find all vertical asymptotes of f(x) = (x − 2)/(x² − 5x + 6). Be careful — one of the denominator zeros is removable.',
      expectedAnswer:
        'Factor denominator: x² − 5x + 6 = (x − 2)(x − 3). Zeros at x = 2 and x = 3. Check numerator at each: x = 2 → numerator = 0 (also zero!). 0/0 — could be removable. Factor: (x − 2)/[(x − 2)(x − 3)] = 1/(x − 3) (for x ≠ 2). At x = 2 the limit is 1/(2 − 3) = -1, finite → REMOVABLE discontinuity, NOT a vertical asymptote. At x = 3: numerator = 1 ≠ 0; denominator = 0 → VERTICAL ASYMPTOTE. Only ONE vertical asymptote: x = 3.',
      responseFormat: 'free',
      hints: [
        'Always check whether 0/0 cancels before declaring a vertical asymptote.',
        'After cancellation, only the truly-finite/0 cases give VAs.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-sign-analysis',
      kind: 'try_yourself',
      problem:
        'For f(x) = (x − 5)/(x − 2)², determine the one-sided limits as x → 2⁻ and x → 2⁺. Is x = 2 a vertical asymptote?',
      expectedAnswer:
        'Denominator (x − 2)² = 0 at x = 2; numerator at x = 2 = -3 ≠ 0. NOT 0/0. Vertical asymptote at x = 2. Sign: numerator near x = 2 is approximately -3 (negative). Denominator (x − 2)² is ALWAYS NON-NEGATIVE (squared); it\'s positive on both sides of x = 2 (except exactly at 2 where it\'s 0). So f → negative / positive small = -∞ from BOTH sides. Same sign of infinity: lim_{x→2⁻} = -∞ AND lim_{x→2⁺} = -∞.',
      responseFormat: 'free',
      hints: [
        '(x − 2)² is non-negative. The squared denominator forces same sign on both sides.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-not-rational',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Vertical asymptotes can also occur in non-rational functions. Identify the vertical asymptote(s) of f(x) = ln(x), and explain.',
      expectedAnswer:
        'ln(x) is defined only for x > 0. As x → 0⁺ (from the right), ln(x) → -∞. So x = 0 is a VERTICAL ASYMPTOTE of ln(x) (one-sided: only from the right because ln(x) is undefined for x ≤ 0). Note: there is no LEFT-side limit at x = 0 because the function isn\'t defined there. The asymptote exists on the right side only. This illustrates that vertical asymptotes can come from (a) rational functions with denominator zeros, (b) logarithms where the argument approaches 0, (c) trig functions like tan(x) at π/2, 3π/2, etc., (d) any function that grows without bound at a finite x. Strong answers: identify x = 0, explain ln domain, note one-sided behavior.',
      responseFormat: 'frq',
      hints: [
        'Where is ln(x) defined?',
        'What happens at the boundary of its domain?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Infinite limit: lim_{x→a} f(x) = ±∞ describes unbounded behavior; technically DNE finitely.',
        'VERTICAL ASYMPTOTE at x = a ⟺ at least one one-sided limit is ±∞.',
        'For rationals: VA wherever DENOMINATOR = 0 AND NUMERATOR ≠ 0. (0/0 cases: check for removable cancellation FIRST.)',
        'Sign analysis: combine signs of numerator + signs of denominator factors near a.',
        'Other VA sources: ln(x) at 0, tan(x) at π/2 + nπ, any function blowing up at finite x.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.14',
    cedTitle: 'Connecting Infinite Limits and Vertical Asymptotes',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Vertical asymptotes via infinite limits.' },
    ],
  },
};
