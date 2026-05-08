/**
 * AP Calculus BC — CED Unit 1.7: Selecting Procedures for Determining
 * Limits.
 *
 * Strategy / decision-tree plan. Builds on 1.5 + 1.6. Lighter-density
 * since most content is meta-cognitive: how to recognize which
 * technique applies.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_LIMITS_STRATEGY: LessonPlan = {
  id: 'evelyn.ap.calcbc.limits-strategy.v1',
  title: 'U1.7 Selecting Procedures for Determining Limits',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.limits-strategy',
      description:
        'Given an arbitrary limit expression, select the most efficient technique (direct substitution, factoring, conjugate, common denominator, trig identity, squeeze theorem, L\'Hôpital — referenced for later) and execute.',
      standard: 'AP-CALCBC-1.7',
    },
  ],
  prerequisites: ['apcalcbc.limits-algebraic-manipulation'],
  followUps: ['apcalcbc.squeeze-theorem'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame technique-selection as a routine that becomes automatic with practice.',
      script:
        "By now you have several techniques for limits. The hard part isn't applying any one — it's KNOWING WHICH ONE TO REACH FOR. Today's plan: a decision tree. Look at the limit, classify the situation, pick the technique, execute. With practice this gets fast.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Decision-tree strategy for limit problems.',
      keyIdeas: [
        'STEP 1 — TRY DIRECT SUBSTITUTION FIRST. Plug x = a into the function. If you get a real number (or "FINITE/0" or "0/FINITE"), you\'re done (or use ±∞ rules for the asymptote case). Most "easy" limits resolve here.',
        'STEP 2 — IF YOU GET 0/0, IDENTIFY WHAT MAKES IT 0/0. Look at the OFFENDING FACTOR — what cancels in numerator and denominator at x = a?',
        '(a) POLYNOMIAL 0/0 → FACTOR both numerator and denominator, cancel the common factor (often (x − a)).',
        '(b) SQUARE-ROOT 0/0 → MULTIPLY BY THE CONJUGATE; the difference-of-squares pattern eliminates radicals.',
        '(c) COMPLEX FRACTION 0/0 (a fraction inside the limit numerator) → COMBINE OVER A COMMON DENOMINATOR.',
        '(d) TRIG 0/0 → look for sin(x)/x or (1 − cos x)/x patterns; manipulate to expose them.',
        '(e) ANY OTHER 0/0 → consider L\'HÔPITAL (Unit 4.7) — derivative of numerator over derivative of denominator. Powerful but introduced later.',
        'STEP 3 — IF YOU GET ∞/∞ OR ∞ − ∞ AT INFINITY — divide by the highest power of x (rational functions); rationalize (radicals); or apply L\'Hôpital.',
        'STEP 4 — IF YOU GET FINITE/0 (e.g. 5/0): the limit is INFINITE (DNE as a finite number). Determine sign using one-sided behavior. Vertical asymptote case (Unit 1.14).',
        'STEP 5 — IF NONE OF THE ABOVE — squeeze theorem (Unit 1.8) for bounded oscillating functions; piecewise analysis with one-sided limits.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-decision-tree',
      kind: 'worked_example',
      problem:
        'For each limit, identify the situation type (substitution / 0/0 polynomial / 0/0 conjugate / 0/0 trig / finite/0 / ∞/∞), state the technique, and compute. (a) lim_{x→4} (3x² − 2x + 1). (b) lim_{x→1} (x² − 1)/(x − 1). (c) lim_{x→0} (√(1 + x) − 1)/x. (d) lim_{x→0} sin(4x)/x.',
      steps: [
        'STEP 1 — (a) "lim (3x² − 2x + 1) at x=4". DIRECT SUBSTITUTION (polynomial, continuous everywhere). 3(16) − 8 + 1 = 41.',
        'STEP 2 — (b) "lim (x² − 1)/(x − 1) at x=1". Direct sub: 0/0. Polynomial 0/0 → FACTOR. (x − 1)(x + 1)/(x − 1) = x + 1. Limit = 2.',
        'STEP 3 — (c) "lim (√(1 + x) − 1)/x at x=0". Direct sub: 0/0. Square root → CONJUGATE. Multiply by (√(1+x) + 1)/itself. Numerator: (1 + x) − 1 = x. Whole: x/(x · (√(1+x) + 1)) = 1/(√(1+x) + 1). Sub: 1/(1 + 1) = 1/2.',
        'STEP 4 — (d) "lim sin(4x)/x at x=0". Direct sub: 0/0. Sin in numerator → TRIG IDENTITY. Rewrite: 4 · sin(4x)/(4x). lim sin(4x)/(4x) = 1. Total: 4.',
        'STEP 5 — INTUITION. Each problem followed the decision tree: substitute → diagnose → apply matching technique. With practice this becomes fast.',
      ],
      answer: '(a) 41, substitution. (b) 2, factoring. (c) 1/2, conjugate. (d) 4, trig identity.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-classify',
      kind: 'try_yourself',
      problem:
        'For each limit, identify the BEST first move (substitute, factor, conjugate, common denominator, trig identity, vertical-asymptote analysis). Then compute. (a) lim_{x→2} (x² + 1)/(x + 1). (b) lim_{x→0} (1/(2+x) − 1/2)/x. (c) lim_{x→0} sin(x)/(x²). (d) lim_{x→3} (x − 3)/(x² − 9).',
      expectedAnswer:
        '(a) SUBSTITUTE. (4 + 1)/(2 + 1) = 5/3. (b) COMMON DENOMINATOR. Numerator: (1/(2+x) − 1/2) = (2 − (2+x))/(2(2+x)) = -x/(2(2+x)). Whole: -x/(2x(2+x)) = -1/(2(2+x)). Sub x = 0: -1/4. (c) WAIT — direct sub: sin(0)/0 = 0/0. But here we have sin(x)/x², which is sin(x)/x · 1/x. As x → 0, sin(x)/x → 1, but 1/x → ±∞. So lim DNE (specifically: -∞ from left, +∞ from right). Recognize as VERTICAL ASYMPTOTE / ONE-SIDED case. (d) FACTOR. Direct sub: 0/0. (x − 3)/[(x − 3)(x + 3)] = 1/(x + 3) (for x ≠ 3). Sub x = 3: 1/6.',
      responseFormat: 'free',
      hints: [
        'First try substitution; if the result is 0/0, diagnose the form.',
        'Sin/x² has trickier behavior: sin(x)/x · 1/x.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-self-train',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why is having a clear DECISION TREE for limits more efficient than just memorizing formulas? Use the difference between novice and experienced calculus students to motivate.',
      expectedAnswer:
        'A decision tree is a META-COGNITIVE TOOL — it tells you what KIND of problem you have and which technique to apply. Memorizing techniques in isolation leaves you with a list of moves but no idea WHEN to use which. NOVICE behavior: looks at every limit and tries random techniques. May try factoring on a square-root limit (won\'t work), then waste time trying L\'Hôpital before realizing direct sub works. Slow, error-prone, panic-inducing on the AP exam time pressure. EXPERIENCED behavior: glances at the limit, recognizes the pattern (square root → conjugate; sin/x → trig identity; polynomial 0/0 → factor), executes immediately. Fast and almost automatic. The decision tree is the BRIDGE from "knowing techniques" to "applying them efficiently." On the AP exam, students who can\'t classify quickly waste critical time. Strong answers explicitly: (i) describe novice "try everything" vs experienced "match-pattern", (ii) note the time/error cost of poor classification, (iii) frame the decision tree as the explicit path to expert intuition.',
      responseFormat: 'frq',
      hints: [
        'Knowing techniques ≠ knowing when to use them.',
        'Time pressure on the AP exam rewards quick pattern-matching.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'STEP 1: Always try direct substitution FIRST.',
        'STEP 2: 0/0 → match the form (polynomial / radical / fraction / trig).',
        'Polynomial 0/0 → factor. Radical 0/0 → conjugate. Fraction 0/0 → common denominator. Trig 0/0 → identity.',
        'Finite/0 → vertical asymptote (one-sided analysis).',
        'Speed comes from pattern recognition, not raw memorization.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.7',
    cedTitle: 'Selecting Procedures for Determining Limits',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Synthesizing limit techniques into a decision tree.' },
    ],
  },
};
