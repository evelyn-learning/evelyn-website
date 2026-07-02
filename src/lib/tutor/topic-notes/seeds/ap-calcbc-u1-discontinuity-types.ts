/**
 * AP Calculus BC — Unit 1 CED 1.10: Exploring Types of Discontinuities.
 *
 * Hand-curated from the source plan evelyn.ap.calcbc.discontinuity-types.v1 to
 * the gold standard set by seeds/ap-calcbc-u1-defining-limits.ts: every theory
 * entry carries kind+title, methods are humanized with when_to_use + a worked
 * example, pointers are a kind mix (tip / frq-vocab / gotcha / edge-case /
 * common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so bounds/values open with a non-digit (\lim, \le, a variable, a minus sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.discontinuity-types';

export const BASELINE_AP_CALCBC_DISCONTINUITY_TYPES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.discontinuity-types.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.10',
  cedTitle: 'Exploring Types of Discontinuities',
  planId: 'evelyn.ap.calcbc.discontinuity-types.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.discontinuity-types.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Removable discontinuity (a "hole")',
      content:
        'A removable discontinuity at $x=a$ occurs when the two-sided limit $\\lim_{x\\to a} f(x)$ EXISTS as a finite number, but $f(a)$ is either undefined or unequal to that limit. Graphically it is a single missing/misplaced point — an open circle. It is "removable" because redefining $f(a)$ to equal the limit patches it.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Jump discontinuity',
      content:
        'A jump discontinuity at $x=a$ occurs when the left-hand limit and right-hand limit both EXIST but are UNEQUAL: $\\lim_{x\\to a^-} f(x)\\ne \\lim_{x\\to a^+} f(x)$. The two-sided limit therefore does not exist. Graphically the curve leaps from one $y$-value to another. Example: the signum function jumps from $-1$ to $+1$ at $x=0$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Infinite (essential) discontinuity',
      content:
        'An infinite discontinuity at $x=a$ occurs when at least one one-sided limit is $\\pm\\infty$ — the function has a vertical asymptote at $x=a$. Example: $f(x)=\\tfrac{1}{x}$ at $x=0$ has $\\lim_{x\\to 0^-} f(x)=-\\infty$ and $\\lim_{x\\to 0^+} f(x)=+\\infty$. This cannot be removed by redefining a single value.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The 0/0 vs finite/0 signal',
      content:
        'For a rational function, direct substitution reveals the type. A $\\tfrac{0}{0}$ form signals a common factor that cancels — usually a REMOVABLE hole. A $\\tfrac{k}{0}$ form with $k\\ne 0$ signals a genuine blow-up — an INFINITE discontinuity (vertical asymptote). Piecewise or step functions at their breaks typically give a JUMP.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Classification algorithm',
      content:
        'At $x=a$: compute the one-sided limits, the two-sided limit, and $f(a)$. Then: if the two-sided limit EXISTS but $\\ne f(a)$ (or $f(a)$ undefined) → REMOVABLE; if the one-sided limits exist but disagree → JUMP; if at least one one-sided limit is infinite → INFINITE. A function that oscillates without settling (e.g. $\\sin(\\tfrac{1}{x})$ as $x\\to 0$) is usually reported as "DNE by oscillation".',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Does the limit exist? — the dividing line',
      content:
        'The single fact that separates the types: for a REMOVABLE discontinuity the two-sided limit EXISTS; for JUMP and INFINITE discontinuities the two-sided limit does NOT exist. This is why only removable discontinuities can be patched — there is a finite limit value to assign.',
    },
  ],
  methods: [
    {
      title: 'Classify the discontinuity at a point',
      when_to_use:
        'When asked whether $f$ has a discontinuity at $x=a$ and, if so, to name it removable, jump, or infinite.',
      steps: [
        'Substitute $x=a$. If $f(a)$ is defined and the function is a standard continuous family, there is no discontinuity — stop.',
        'For a rational function read the form: $\\tfrac{0}{0}$ suggests removable (factor and cancel); $\\tfrac{k}{0}$ with $k\\ne 0$ suggests infinite.',
        'Compute the one-sided limits. If they are finite and equal but $\\ne f(a)$ (or $f(a)$ undefined) → REMOVABLE.',
        'If the one-sided limits are finite but unequal → JUMP.',
        'If at least one one-sided limit is $\\pm\\infty$ → INFINITE (vertical asymptote).',
      ],
      example: {
        problem:
          'Classify the discontinuity at the given point: (a) $f(x)=\\dfrac{x^2-9}{x-3}$ at $x=3$; (b) $f(x)=\\dfrac{x+2}{x-1}$ at $x=1$; (c) $f(x)=-2$ for $x<5$ and $f(x)=7$ for $x\\ge 5$, at $x=5$.',
        solution:
          '(a) Direct sub gives $\\tfrac{0}{0}$; factor $\\tfrac{(x-3)(x+3)}{x-3}=x+3$, so $\\lim_{x\\to 3} f(x)=6$ while $f(3)$ is undefined — REMOVABLE. (b) Direct sub gives $\\tfrac{3}{0}$ (finite/0): $\\lim_{x\\to 1^-} f(x)=-\\infty$, $\\lim_{x\\to 1^+} f(x)=+\\infty$ — INFINITE (vertical asymptote). (c) $\\lim_{x\\to 5^-} f(x)=-2$ and $\\lim_{x\\to 5^+} f(x)=7$ exist but disagree — JUMP.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'A $\\tfrac{0}{0}$ form is NOT automatically "no limit" — it is the classic removable case: factor and cancel to find the finite limit.', kind: 'common-error' },
    { content: 'On an FRQ, name the type AND justify it with the limit behavior: "removable because $\\lim_{x\\to a} f(x)$ exists but $f(a)$ is undefined", etc.', kind: 'frq-vocab' },
    { content: 'A $\\tfrac{k}{0}$ form with $k\\ne 0$ means INFINITE, not removable — do not try to cancel a factor that is not shared.', kind: 'gotcha' },
    { content: 'Oscillation (e.g. $\\sin(\\tfrac{1}{x})$ near $x=0$) is a fourth flavor some texts fold into "essential"; AP usually just calls it "DNE by oscillation".', kind: 'edge-case' },
    { content: 'Only removable discontinuities have an existing two-sided limit — jump and infinite are "essential" and cannot be patched.', kind: 'tip' },
  ],
};
