/**
 * AP Calculus BC — CED Unit 1.13: Removing Discontinuities.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_REMOVING_DISCONTINUITIES: LessonPlan = {
  id: 'evelyn.ap.calcbc.removing-discontinuities.v1',
  title: 'U1.13 Removing Discontinuities',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.removing-discontinuities',
      description:
        'For a removable discontinuity at x = a, determine the value f(a) must take to make the function continuous (or the value of an unknown parameter that achieves continuity).',
      standard: 'AP-CALCBC-1.13',
    },
  ],
  prerequisites: ['apcalcbc.continuity'],
  followUps: ['apcalcbc.infinite-limits-asymptotes'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame removing discontinuities as the natural follow-up to identifying them.',
      script:
        "Once you've spotted a removable discontinuity, the natural next question: what value would PATCH it? The answer is always the limit. AP loves to test this — give a piecewise function with an undefined value or a missing parameter, ask what to plug in to make the function continuous.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-remove',
      kind: 'concept',
      goal: 'Cover the patching procedure + parameter-finding problems.',
      keyIdeas: [
        'CORE FACT: a discontinuity at x = a is REMOVABLE if and only if lim_{x→a} f(x) EXISTS as a finite real number. To "remove" the discontinuity, define (or redefine) f(a) to equal the limit value L.',
        'PATCHED FUNCTION: define f̃ identical to f except f̃(a) = L. Then f̃ is continuous at a (all three conditions: defined, limit exists, limit = value). This is the "removed" version of the function.',
        'PARAMETER PROBLEMS — common AP form: a piecewise or expression-with-unknown function is given, and you must find the parameter value(s) for which the function is continuous at a specific point.',
        'STRATEGY for finding c that makes f continuous at x = a: (1) Compute lim_{x→a⁻} f(x) (using the appropriate piecewise formula or expression). (2) Compute lim_{x→a⁺} f(x). (3) Set both equal to f(a). (4) Solve for the parameter.',
        'WHEN MULTIPLE PARAMETERS: with two unknowns and continuity required at two different x-values (or at one x-value with another constraint), you set up a system of equations and solve.',
        'NOT ALL DISCONTINUITIES ARE REMOVABLE. If the limit doesn\'t exist (jump or infinite type), no value of f(a) can make the function continuous. The discontinuity is ESSENTIAL — built into the function. AP exam questions sometimes ask "is this discontinuity removable?" and the answer can be NO.',
      ],
      vocabulary: [
        { term: 'patching', definition: 'redefining f(a) to equal lim_{x→a} f(x), thereby removing a removable discontinuity.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-find-c',
      kind: 'worked_example',
      problem:
        'Let f(x) = (x² − 1)/(x − 1) for x ≠ 1, f(x) = c for x = 1. Find the value of c that makes f continuous at x = 1.',
      steps: [
        'STEP 1 — IDENTIFY the discontinuity type. At x = 1: numerator = 0, denominator = 0; f(1) = c (defined as some constant); the issue is making f continuous via choice of c.',
        'STEP 2 — COMPUTE THE LIMIT. lim_{x→1} (x² − 1)/(x − 1) — direct sub gives 0/0. Factor: (x − 1)(x + 1)/(x − 1) = x + 1 (for x ≠ 1). lim → 2.',
        'STEP 3 — SET c = LIMIT. For continuity at x = 1: lim_{x→1} f = f(1). So c = 2.',
        'STEP 4 — VERIFY. With c = 2, f(1) = 2 = lim. All three continuity conditions satisfied. ✓',
      ],
      answer: 'c = 2',
      estimatedMinutes: 3,
    },
    {
      id: 'try-find-c',
      kind: 'try_yourself',
      problem:
        'For each function, determine the value(s) needed to make the function continuous at the given point. (a) f(x) = (x² − 25)/(x − 5) for x ≠ 5; f(x) = a for x = 5. Find a. (b) g(x) = (sin(3x))/x for x ≠ 0; g(x) = b for x = 0. Find b.',
      expectedAnswer:
        '(a) lim_{x→5} (x² − 25)/(x − 5) — factor: (x − 5)(x + 5)/(x − 5) = x + 5. lim = 10. So a = 10. (b) lim_{x→0} sin(3x)/x = 3 · sin(3x)/(3x) → 3 · 1 = 3 (special trig limit). So b = 3.',
      responseFormat: 'numeric',
      hints: [
        '(a) Factor the polynomial 0/0.',
        '(b) Use the special trig limit lim sin(x)/x = 1.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-piecewise-c',
      kind: 'try_yourself',
      problem:
        'Find the value of k that makes the following function continuous at x = 2: f(x) = x² for x < 2; f(x) = kx + 1 for x ≥ 2.',
      expectedAnswer:
        'Continuity at x = 2 requires lim_{x→2⁻} f = lim_{x→2⁺} f = f(2). Left limit: x² → 4. Right limit and f(2): kx + 1 → 2k + 1 at x = 2. Set equal: 4 = 2k + 1 → 2k = 3 → k = 3/2.',
      responseFormat: 'numeric',
      hints: ['Match left limit to right limit (= f(2)) and solve.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-not-removable',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. The function f(x) = (x − 4)/(x² − 16) has a discontinuity at x = -4. Is this discontinuity removable? Justify.',
      expectedAnswer:
        'Direct sub at x = -4: numerator (-4 − 4) = -8 (nonzero); denominator ((-4)² − 16) = 0. So we have FINITE/0, NOT 0/0. lim_{x→-4} f(x) = ±∞ (function blows up). Specifically: factor denominator x² − 16 = (x − 4)(x + 4). f(x) = (x − 4)/[(x − 4)(x + 4)] — wait, BOTH numerator and denominator have (x − 4). At x = -4 the (x − 4) terms are NOT zero — they\'re -8. So f(x) = 1/(x + 4) for all x ≠ 4. At x = -4, this expression IS infinite. Confirming: lim_{x→-4} 1/(x+4) = ±∞ (sign depends on side). NOT REMOVABLE — the discontinuity at x = -4 is INFINITE (vertical asymptote), not removable. (Note: at x = 4, the original function ALSO has a discontinuity. There: 0/0; factor and cancel; f → 1/(4+4) = 1/8 → that one IS removable.) Strong answers: distinguish that x = -4 has finite/0 form (infinite, NOT removable) while x = 4 has 0/0 (removable). Removability requires the limit to EXIST as a finite number; infinite limits don\'t qualify.',
      responseFormat: 'frq',
      hints: [
        'Plug in: is it 0/0 or finite/0?',
        'Removable requires the limit to exist as a FINITE number.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Removable discontinuity at a: lim_{x→a} f(x) = L exists. Patch by setting f(a) = L.',
        'Parameter problem: set lim = f(a) and solve for the parameter.',
        'Piecewise: match both one-sided limits to the value at the break point.',
        'NOT ALL discontinuities are removable. Jump and infinite types are essential — no patching possible.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.13',
    cedTitle: 'Removing Discontinuities',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Patching removable discontinuities.' },
    ],
  },
};
