/**
 * AP Calculus BC — CED Unit 4.7: L'Hôpital's Rule.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U4_LHOPITAL: LessonPlan = {
  id: 'evelyn.ap.calcbc.lhopital.v1',
  title: 'U4.7 L\'Hôpital\'s Rule',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.lhopital',
      description:
        'State L\'Hôpital\'s rule (with hypotheses) and apply it to limits in 0/0 or ∞/∞ indeterminate form. Recognize how to convert other indeterminate forms (∞ − ∞, 0·∞, 1^∞, etc.) into 0/0 or ∞/∞.',
      standard: 'AP-CALCBC-4.7',
    },
  ],
  prerequisites: ['apcalcbc.linearization'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame L\'Hôpital as the powerful all-purpose tool for indeterminate forms.',
      script:
        "L'Hôpital's rule lets you take any 0/0 or ∞/∞ limit and replace it with the limit of the derivatives' ratio. Often resolves limits that algebra can't crack. Cleanest example: lim_{x→0} sin(x)/x = lim cos(x)/1 = 1. The rule has hypotheses, however — and applying it WITHOUT the indeterminate form is wrong.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-lhopital',
      kind: 'concept',
      goal: 'State the rule, hypotheses, and conversion of other indeterminate forms.',
      keyIdeas: [
        'L\'HÔPITAL\'S RULE: if lim_{x→a} f(x)/g(x) is in INDETERMINATE FORM 0/0 or ∞/∞, AND lim f\'(x)/g\'(x) exists (as a finite real or ±∞), THEN lim f(x)/g(x) = lim f\'(x)/g\'(x).',
        'KEY HYPOTHESIS — INDETERMINATE FORM. Direct substitution must give 0/0 or ∞/∞. Applying L\'Hôpital to a limit that is NOT indeterminate gives WRONG ANSWERS. Always verify the indeterminate form first.',
        'KEY HYPOTHESIS — DIFFERENTIABILITY. f and g must be differentiable in a neighborhood of a (except possibly at a itself).',
        'CAN BE APPLIED MULTIPLE TIMES. If the new limit f\'(x)/g\'(x) is also indeterminate, apply L\'Hôpital again. Continue until you get a determinate form.',
        'EXAMPLES — direct application:',
        '- lim_{x→0} sin(x)/x. 0/0 form. Apply L\'H: lim cos(x)/1 = cos(0)/1 = 1. ✓',
        '- lim_{x→∞} (e^x)/x. ∞/∞ form. Apply L\'H: lim e^x/1 = ∞. (Exponential beats linear.)',
        '- lim_{x→1} (x² − 1)/(x − 1). 0/0 form. Apply L\'H: lim 2x/1 = 2. (Could also factor.)',
        'OTHER INDETERMINATE FORMS — convert to 0/0 or ∞/∞ first.',
        '0 · ∞: rewrite as 0/(1/∞) = 0/0 or as (1/0)·something. E.g. lim_{x→0⁺} x · ln(x) — write as ln(x)/(1/x), now ∞/∞ → apply L\'H.',
        '∞ − ∞: combine fractions or rationalize to convert.',
        '1^∞, 0^0, ∞^0: take log to convert. y = f(x)^g(x), so ln(y) = g(x)·ln(f(x)). Compute lim ln(y) (now in 0·∞ form), then exponentiate.',
        'WHEN NOT TO USE L\'HÔPITAL. If direct substitution gives a finite number, just use direct substitution — L\'Hôpital is overkill. If the limit is "5/0" (vertical asymptote), L\'Hôpital gives nonsense — recognize the form first.',
      ],
      vocabulary: [{ term: 'L\'Hôpital\'s rule', definition: 'lim f/g = lim f\'/g\' when the original limit is in 0/0 or ∞/∞ indeterminate form.' }],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-lhopital',
      kind: 'worked_example',
      problem:
        'Compute (a) lim_{x→0} (e^x − 1)/x. (b) lim_{x→0} (1 − cos x)/x². (c) lim_{x→∞} (ln x)/x.',
      steps: [
        'STEP 1 — (a) Direct sub: (1 − 1)/0 = 0/0. Apply L\'H: lim e^x/1 = e^0/1 = 1.',
        'STEP 2 — (b) Direct sub: (1 − 1)/0 = 0/0. Apply L\'H: lim sin(x)/(2x). Still 0/0. Apply L\'H AGAIN: lim cos(x)/2 = cos(0)/2 = 1/2.',
        'STEP 3 — (c) Direct sub: ∞/∞. Apply L\'H: lim (1/x)/1 = lim 1/x = 0 (as x → ∞).',
      ],
      answer: '(a) 1. (b) 1/2. (c) 0.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-basic',
      kind: 'try_yourself',
      problem:
        'Compute. (a) lim_{x→0} (sin(2x))/x. (b) lim_{x→∞} (x²)/(e^x). (c) lim_{x→1} (ln x)/(x − 1).',
      expectedAnswer:
        '(a) 0/0. L\'H: lim 2cos(2x)/1 = 2·cos(0) = 2. (b) ∞/∞. L\'H: 2x/e^x. Still ∞/∞. L\'H again: 2/e^x → 0. (c) 0/0. L\'H: lim (1/x)/1 = 1/1 = 1.',
      responseFormat: 'numeric',
      hints: ['Verify indeterminate form, apply L\'H, repeat if still indeterminate.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-other-forms',
      kind: 'try_yourself',
      problem:
        'Compute lim_{x→0⁺} x · ln(x). (Form: 0 · -∞, indeterminate.)',
      expectedAnswer:
        'CONVERT 0 · ∞ to ∞/∞ form. Rewrite x · ln(x) = ln(x) / (1/x). As x → 0⁺: numerator → -∞, denominator → +∞. Form: -∞/∞ (still ∞/∞ in the absolute sense). Apply L\'H: lim (1/x)/(-1/x²) = lim x²·(-1)/x = lim -x = 0. So lim x · ln(x) = 0.',
      responseFormat: 'numeric',
      hints: ['Convert 0·∞ to a quotient. ln(x)/(1/x) is one common move.'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-misuse',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A student computes lim_{x→1} (x² + 1)/(x + 2) by applying L\'Hôpital. They get lim 2x/1 = 2 at x = 1. (a) Why is this WRONG? (b) What is the correct value of the limit?',
      expectedAnswer:
        '(a) WRONG because the limit is NOT in indeterminate form. Direct substitution at x = 1: (1 + 1)/(1 + 2) = 2/3 — a finite number, not 0/0 or ∞/∞. L\'Hôpital does NOT apply. The student\'s misuse gave the wrong answer.\n(b) Correct value: by direct substitution, lim_{x→1} (x² + 1)/(x + 2) = 2/3.\nLESSON: Always VERIFY THE INDETERMINATE FORM before applying L\'Hôpital. If direct sub gives a finite number, use that — don\'t apply the rule. AP exam questions reliably penalize this misuse.',
      responseFormat: 'frq',
      hints: ['Always check direct substitution first. L\'Hôpital is for indeterminate forms only.'],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'L\'HÔPITAL: lim f/g = lim f\'/g\' WHEN form is 0/0 or ∞/∞ AND limits exist.',
        'VERIFY INDETERMINATE FORM FIRST. Misuse on non-indeterminate gives wrong answers.',
        'Can apply repeatedly if still indeterminate.',
        'Other forms (0·∞, ∞−∞, 1^∞, etc.): convert to 0/0 or ∞/∞ first.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.7',
    cedTitle: 'L\'Hôpital\'s Rule',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '8', note: 'Standard L\'Hôpital treatment.' }],
  },
};
