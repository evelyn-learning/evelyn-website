/**
 * AP Calculus BC — Unit 1 CED 1.7: Selecting Procedures for Determining
 * Limits.
 *
 * Strategy / decision-tree baseline curated from
 * evelyn.ap.calcbc.limits-strategy.v1 to the standard set by
 * seeds/ap-calcbc-u1-defining-limits.ts: theory entries carry kind+title,
 * methods have when_to_use + a worked example, pointers mix kinds. Meta-
 * cognitive: how to recognize WHICH technique applies.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe
 * renderer), so values open with a non-digit (\lim, a variable, =, an
 * operator, or a backslash macro).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.limits-strategy';

export const BASELINE_AP_CALCBC_LIMITS_STRATEGY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.limits-strategy.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.7',
  cedTitle: 'Selecting Procedures for Determining Limits',
  planId: 'evelyn.ap.calcbc.limits-strategy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.limits-strategy.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Step 1 — Always try direct substitution first',
      content:
        'Plug $x=a$ into the function. If you get a real number, you are done. If you get $\\tfrac{\\text{finite}}{0}$ (asymptote) or $\\tfrac{0}{\\text{finite}}$ (equals zero), you are also essentially done. Most "easy" limits resolve right here — never skip this step.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Step 2 — Diagnose a 0/0 by its offending factor',
      content:
        'If substitution gives $\\tfrac{0}{0}$, identify what cancels at $x=a$ and match the technique: (a) POLYNOMIAL $\\tfrac{0}{0}\\Rightarrow$ FACTOR and cancel $(x-a)$; (b) SQUARE-ROOT $\\tfrac{0}{0}\\Rightarrow$ multiply by the CONJUGATE; (c) COMPLEX FRACTION $\\tfrac{0}{0}\\Rightarrow$ COMMON DENOMINATOR; (d) TRIG $\\tfrac{0}{0}\\Rightarrow$ expose $\\tfrac{\\sin(x)}{x}$ or $\\tfrac{1-\\cos(x)}{x}$; (e) any other $\\Rightarrow$ consider L\'HÔPITAL (Topic 4.7).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Step 3 — Handle infinity forms',
      content:
        'If you get $\\tfrac{\\infty}{\\infty}$ or $\\infty-\\infty$ as $x\\to\\pm\\infty$: for rational functions, divide numerator and denominator by the highest power of $x$; for radicals, rationalize; or apply L\'Hôpital. These are limits AT infinity, distinct from finite-point $\\tfrac{0}{0}$ work.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Step 4 — Finite/0 means an infinite limit',
      content:
        'If substitution gives $\\tfrac{\\text{nonzero}}{0}$ (e.g. $\\tfrac{5}{0}$), the limit is infinite — DNE as a finite number. Determine the sign by checking one-sided behavior; this is the vertical-asymptote case (Topic 1.14). Do not confuse it with the indeterminate $\\tfrac{0}{0}$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Step 5 — Last-resort techniques',
      content:
        'If none of the above fit: use the SQUEEZE THEOREM (Topic 1.8) for bounded oscillating functions like $x^{2}\\sin\\!\\left(\\tfrac{1}{x}\\right)$, or do PIECEWISE analysis with one-sided limits when the function is defined by cases around $a$.',
    },
  ],
  methods: [
    {
      title: 'Run the limit decision tree',
      when_to_use:
        'For ANY limit problem where the technique is not obvious. The tree turns "knowing techniques" into "knowing which one to reach for" — the skill AP tests in Topic 1.7.',
      steps: [
        'Try DIRECT SUBSTITUTION. If it returns a real number, stop — that is the answer.',
        'If you get $\\tfrac{0}{0}$, look at the offending factor and pick: polynomial $\\to$ factor; square root $\\to$ conjugate; complex fraction $\\to$ common denominator; $\\sin/\\cos$ $\\to$ trig identity.',
        'If you get $\\tfrac{\\text{nonzero}}{0}$, it is an infinite limit (vertical asymptote) — analyze each side.',
        'If you get $\\tfrac{\\infty}{\\infty}$ or $\\infty-\\infty$, divide by the top power / rationalize / L\'Hôpital.',
        'Execute the chosen technique, then re-substitute into the simplified expression to finish.',
      ],
      example: {
        problem:
          'Classify and compute: (a) $\\lim_{x\\to 4}(3x^{2}-2x+1)$, (b) $\\lim_{x\\to 1}\\tfrac{x^{2}-1}{x-1}$, (c) $\\lim_{x\\to 0}\\tfrac{\\sqrt{1+x}-1}{x}$, (d) $\\lim_{x\\to 0}\\tfrac{\\sin(4x)}{x}$.',
        solution:
          '(a) SUBSTITUTION (polynomial): $\\lim_{x\\to 4}(3x^{2}-2x+1) = 3(16)-8+1 = 41$. (b) Substitution gives $\\tfrac{0}{0}$; FACTOR: $\\tfrac{(x-1)(x+1)}{x-1} = x+1\\to 2$. (c) $\\tfrac{0}{0}$; CONJUGATE by $\\sqrt{1+x}+1$: numerator $\\to x$, expression $\\to\\tfrac{1}{\\sqrt{1+x}+1}\\to\\tfrac{1}{2}$. (d) $\\tfrac{0}{0}$; TRIG IDENTITY: $\\tfrac{\\sin(4x)}{x} = 4\\cdot\\tfrac{\\sin(4x)}{4x}\\to 4$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Speed on the AP exam comes from pattern recognition, not raw memorization. Glance, classify (square root $\\to$ conjugate, $\\sin/x \\to$ trig identity, polynomial $\\tfrac{0}{0}\\to$ factor), then execute — do not try techniques at random.', kind: 'tip' },
    { content: 'On an FRQ, state your diagnosis in words: "substitution gives $\\tfrac{0}{0}$; since the numerator is a polynomial I factor." Naming the form and the reason for the technique earns method credit.', kind: 'frq-vocab' },
    { content: 'Watch $\\tfrac{\\sin(x)}{x^{2}}$: it is $\\tfrac{\\sin(x)}{x}\\cdot\\tfrac{1}{x}\\to 1\\cdot(\\pm\\infty)$, so the two-sided limit DNE — the trig identity alone does not finish it. Check one-sided behavior.', kind: 'gotcha' },
    { content: 'Substitution can succeed even when the algebra looks scary: if the denominator is $\\ne 0$ at $a$, just plug in. Do not reach for factoring on a limit that was never indeterminate.', kind: 'edge-case' },
    { content: 'Do not treat $\\tfrac{\\text{nonzero}}{0}$ as $\\tfrac{0}{0}$. Only zero-over-zero is indeterminate and cancelable; nonzero-over-zero is an infinite limit needing sign analysis.', kind: 'common-error' },
  ],
};
