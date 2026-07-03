/**
 * AP Calculus BC — Unit 1 CED 1.5: Determining Limits Using Algebraic
 * Properties of Limits.
 *
 * Baseline curated from evelyn.ap.calcbc.limits-algebraic-properties.v1 to
 * the standard set by seeds/ap-calcbc-u1-defining-limits.ts: theory entries
 * carry kind+title, methods have when_to_use + a worked example, pointers
 * mix kinds (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe
 * renderer), so values open with a non-digit (\lim, a variable, =, an
 * operator, or a backslash macro).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.limits-algebraic-properties';

export const BASELINE_AP_CALCBC_LIMITS_ALGEBRAIC_PROPERTIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.limits-algebraic-properties.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.5',
  cedTitle: 'Determining Limits Using Algebraic Properties of Limits',
  planId: 'evelyn.ap.calcbc.limits-algebraic-properties.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.limits-algebraic-properties.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'The limit laws',
      content:
        'Suppose $\\lim_{x\\to a} f(x) = L$ and $\\lim_{x\\to a} g(x) = M$. Then limits distribute over the basic operations: SUM/DIFFERENCE $\\lim[f(x)\\pm g(x)] = L\\pm M$; CONSTANT MULTIPLE $\\lim[c\\,f(x)] = cL$; PRODUCT $\\lim[f(x)g(x)] = LM$; QUOTIENT $\\lim\\!\\left[\\tfrac{f(x)}{g(x)}\\right] = \\tfrac{L}{M}$ provided $M\\ne 0$; POWER $\\lim[f(x)]^n = L^n$; ROOT $\\lim\\sqrt[n]{f(x)} = \\sqrt[n]{L}$ (for even $n$, assuming $L\\ge 0$).',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Direct substitution for continuous functions',
      content:
        'If $f$ is continuous at $a$, then $\\lim_{x\\to a} f(x) = f(a)$ — just plug in. This covers all polynomials, rational functions where the denominator is $\\ne 0$ at $a$, $\\sin x$, $\\cos x$, $e^{x}$, $\\ln x$ (for $x>0$), and any composition/combination of these that stays continuous at $a$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Indeterminate form',
      content:
        'A limit expression whose value is NOT determined by direct substitution. The classic seven are $\\tfrac{0}{0}$, $\\tfrac{\\infty}{\\infty}$, $\\infty-\\infty$, $=0\\cdot\\infty$, $=0^{0}$, $\\infty^{0}$, and $=1^{\\infty}$. Getting one of these means you must manipulate algebraically (Topic 1.6) or use another technique — the answer could be anything until you do.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'When substitution succeeds vs. fails',
      content:
        'Substitution SUCCEEDS when it returns a real number: e.g. $\\lim_{x\\to 2}(3x^{2}+x-1) = 3(4)+2-1 = 13$. It FAILS (returns an indeterminate form) when both numerator and denominator vanish: e.g. $\\lim_{x\\to 2}\\tfrac{x^{2}-4}{x-2}$ gives $\\tfrac{4-4}{2-2} = \\tfrac{0}{0}$, which is indeterminate and needs more work.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Finite/0 is NOT indeterminate',
      content:
        'If substitution gives $\\tfrac{\\text{nonzero}}{0}$ — like $\\lim_{x\\to 1}\\tfrac{x+4}{x-1}$ giving $\\tfrac{5}{0}$ — this is NOT an indeterminate form. The magnitude blows up: the limit is infinite (a vertical asymptote), so the two-sided limit DNE as a finite number. Use one-sided analysis to pin the sign (Topic 1.14). Distinguish this from $\\tfrac{0}{0}$.',
    },
  ],
  methods: [
    {
      title: 'Evaluate a limit with the laws + direct substitution',
      when_to_use:
        'First move for ANY limit at a finite point $a$: try substitution before anything harder. Works whenever the function is continuous at $a$ (polynomials, rational functions with $\\ne 0$ denominator, $\\sin/\\cos/e^{x}/\\ln$, and their combinations).',
      steps: [
        'Confirm the function is built from continuous pieces via the limit laws (sum, product, quotient with nonzero denominator, power, root).',
        'Substitute $x=a$ into the expression.',
        'If you get a real number, that is the limit — done.',
        'If you get $\\tfrac{0}{0}$, STOP: it is indeterminate; switch to algebraic manipulation (Topic 1.6).',
        'If you get $\\tfrac{\\text{nonzero}}{0}$, the limit is infinite (vertical asymptote) — analyze one-sided behavior instead.',
      ],
      example: {
        problem:
          'Compute (a) $\\lim_{x\\to 2}(3x^{3}-x^{2}+4)$, (b) $\\lim_{x\\to 1}\\tfrac{x^{2}+1}{x+3}$, (c) $\\lim_{x\\to 0}\\sin(x)\\cos(x)$, (d) $\\lim_{x\\to 4}\\sqrt{x^{2}+9}$.',
        solution:
          '(a) Polynomial, continuous everywhere: $\\lim_{x\\to 2}(3x^{3}-x^{2}+4) = 3(8)-4+4 = 24$. (b) Rational; denominator at $x=1$ is $=4\\ne 0$, so substitute: $\\tfrac{1+1}{1+3} = \\tfrac{2}{4} = \\tfrac{1}{2}$. (c) $\\sin$ and $\\cos$ are continuous: $\\sin(0)\\cos(0) = (0)(1) = 0$. (d) Continuous since $x^{2}+9>0$: $\\sqrt{16+9} = \\sqrt{25} = 5$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'The quotient law $\\lim\\tfrac{f}{g} = \\tfrac{L}{M}$ REQUIRES $M\\ne 0$. If $M=0$ the law simply does not apply — do not write "$=\\tfrac{L}{0}$"; diagnose whether it is $\\tfrac{0}{0}$ (indeterminate) or $\\tfrac{\\text{nonzero}}{0}$ (asymptote).', kind: 'common-error' },
    { content: 'On an FRQ, name the form explicitly: say "direct substitution gives $\\tfrac{0}{0}$, an indeterminate form" before manipulating — graders reward showing you diagnosed it.', kind: 'frq-vocab' },
    { content: 'Getting $\\tfrac{5}{0}$ is NOT the same as $\\tfrac{0}{0}$. Nonzero-over-zero is an infinite limit / vertical asymptote; only zero-over-zero is indeterminate.', kind: 'gotcha' },
    { content: 'Even roots need the inside limit $\\ge 0$: $\\lim\\sqrt[n]{f(x)} = \\sqrt[n]{L}$ assumes $L\\ge 0$ when $n$ is even, or the real-valued limit does not exist.', kind: 'edge-case' },
    { content: 'Always TRY substitution first — most "easy" limits resolve immediately, and it tells you instantly whether you even have an indeterminate form to work on.', kind: 'tip' },
  ],
};
