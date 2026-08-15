/**
 * AP Calculus BC — Unit 1 CED 1.15: Connecting Limits at Infinity and
 * Horizontal Asymptotes.
 *
 * Baseline curated from the source plan
 * evelyn.ap.calcbc.limits-at-infinity-horizontal-asymptotes.v1, matched to the
 * gold calibration seeds/ap-calcbc-u1-defining-limits.ts: theory entries carry
 * kind+title, methods are humanized with when_to_use + a worked example, and
 * pointers mix kinds (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so bounds/values open with a non-digit (\lim, a variable, or a sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.limits-at-infinity-horizontal-asymptotes';

export const BASELINE_AP_CALCBC_LIMITS_AT_INFINITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.limits-at-infinity-horizontal-asymptotes.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.15',
  cedTitle: 'Limits at Infinity and Horizontal Asymptotes',
  planId: 'evelyn.ap.calcbc.limits-at-infinity-horizontal-asymptotes.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.limits-at-infinity-horizontal-asymptotes.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Limit at infinity',
      content:
        '$\\lim_{x\\to \\infty} f(x) = L$ means that as $x$ grows arbitrarily large in the positive direction, $f(x)$ approaches $L$; similarly $\\lim_{x\\to -\\infty} f(x) = L$ describes the behavior far to the left. These limits capture a function\'s LONG-RUN behavior.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Horizontal asymptote',
      content:
        'The line $y=L$ is a HORIZONTAL ASYMPTOTE of $f$ if $\\lim_{x\\to \\infty} f(x) = L$ OR $\\lim_{x\\to -\\infty} f(x) = L$. A function may have different horizontal asymptotes on the two sides, or one on only a single side.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Degree-comparison rule for rational functions',
      content:
        'For $f(x)=\\dfrac{N(x)}{D(x)}$ with $\\deg N = n$ and $\\deg D = d$: (a) if $n < d$, then $\\lim_{x\\to \\pm\\infty} f(x) = 0$, a horizontal asymptote at $y=0$; (b) if $n = d$, the limit is the RATIO OF LEADING COEFFICIENTS, a horizontal asymptote there; (c) if $n > d$, the limit is $\\pm\\infty$ and there is NO horizontal asymptote.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Divide by the highest power technique',
      content:
        'To evaluate a rational limit at infinity rigorously, divide numerator and denominator by $x^d$ (the highest power in the denominator). Every term becomes a constant over a power of $x$; as $x\\to \\infty$ each term with $x$ in its denominator $\\to 0$, and what survives is the limit. Example: $\\dfrac{3x+1}{x^2+5}=\\dfrac{3/x + 1/x^2}{1 + 5/x^2}\\to \\dfrac{0}{1}=0$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Non-rational behavior at infinity',
      content:
        '$e^x\\to \\infty$ as $x\\to \\infty$ and $e^x\\to 0$ as $x\\to -\\infty$; $\\ln(x)\\to \\infty$ as $x\\to \\infty$ (but slowly). $\\sin(x)$ and $\\cos(x)$ oscillate forever, so their limits at $\\pm\\infty$ do NOT exist. A bounded function over $x$, like $\\dfrac{\\sin(x)}{x}$, is squeezed to zero.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Square roots at negative infinity',
      content:
        'Handle signs carefully: $\\sqrt{x^2}=|x|$, which equals $-x$ when $x<0$. So factoring $x^2$ out of a radical as $x\\to -\\infty$ introduces a sign flip, e.g. $\\sqrt{x^2+1}=|x|\\sqrt{1+1/x^2}=-x\\,\\sqrt{1+1/x^2}$ for $x<0$.',
    },
  ],
  methods: [
    {
      title: 'Evaluate a rational limit at infinity via degree comparison',
      when_to_use:
        'When asked for $\\lim_{x\\to \\pm\\infty} \\dfrac{N(x)}{D(x)}$ or for the horizontal asymptotes of a rational function.',
      steps: [
        'Identify the degree $n$ of the numerator and the degree $d$ of the denominator.',
        'If $n < d$, the limit is zero (horizontal asymptote $y=0$).',
        'If $n = d$, the limit is the ratio of the leading coefficients (horizontal asymptote at that value).',
        'If $n > d$, the limit is $+\\infty$ or $-\\infty$ (no horizontal asymptote); for $x\\to -\\infty$, track the sign of the surviving leading term.',
        'When in doubt, confirm by dividing numerator and denominator by $x^d$ and sending the $\\tfrac{1}{x}$-type terms to zero.',
      ],
      example: {
        problem:
          'Compute each and give any horizontal asymptote. (a) $\\lim_{x\\to \\infty}\\dfrac{4x^2-3x+1}{2x^2+7}$. (b) $\\lim_{x\\to \\infty}\\dfrac{5x+2}{x^3-1}$. (c) $\\lim_{x\\to -\\infty}\\dfrac{3x^2+2}{x-4}$.',
        solution:
          '(a) Degrees are equal ($n=d=2$), so the limit is the ratio of leading coefficients $\\tfrac{4}{2}=2$; horizontal asymptote $y=2$. (b) Here $n=1<d=3$, so the limit is zero; horizontal asymptote $y=0$. (c) Here $n=2>d=1$, so the limit is infinite: the leading behavior is $\\dfrac{3x^2}{x}=3x\\to -\\infty$ as $x\\to -\\infty$, so $\\lim = -\\infty$ and there is no horizontal asymptote.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Match degrees before anything else: $\\deg N < \\deg D\\Rightarrow 0$, equal $\\Rightarrow$ ratio of leads, $\\deg N > \\deg D\\Rightarrow \\pm\\infty$.', kind: 'tip' },
    { content: 'When $n=d$, the horizontal asymptote is the ratio of LEADING coefficients only — the lower-order terms do not affect the limit at infinity.', kind: 'common-error' },
    { content: 'For $x\\to -\\infty$ with radicals, remember $\\sqrt{x^2}=|x|=-x$ when $x<0$; forgetting the sign flip flips the whole answer, e.g. $\\dfrac{\\sqrt{x^2+1}}{x}\\to -1$ as $x\\to -\\infty$.', kind: 'gotcha' },
    { content: 'On an FRQ, name the horizontal asymptote as a line $y=L$ and justify it with the limit $\\lim_{x\\to \\pm\\infty} f(x)=L$, not just the degree comparison.', kind: 'frq-vocab' },
    { content: 'A function can cross its horizontal asymptote (unlike a vertical one): $\\dfrac{\\sin(x)}{x}\\to 0$ yet touches $y=0$ infinitely often — the asymptote governs the tail, not every point.', kind: 'edge-case' },
  ],
};
