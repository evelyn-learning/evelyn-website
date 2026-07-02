/**
 * AP Calculus BC — Unit 6 CED 6.6: Properties of Definite Integrals.
 *
 * Baseline curated from evelyn.ap.calcbc.integral-properties.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts +
 * ap-calcbc-u3-chain-rule.ts: theory entries carry kind+title, methods are
 * humanized with when_to_use + a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\int, \dfrac, a letter, "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.integral-properties';

export const BASELINE_AP_CALCBC_INTEGRAL_PROPERTIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.integral-properties.v1',
  course: 'AP Calculus BC',
  cedUnit: 6,
  cedTopic: '6.6',
  cedTitle: 'Properties of Definite Integrals',
  planId: 'evelyn.ap.calcbc.integral-properties.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.integral-properties.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Linearity',
      content:
        'Constants pull out and sums split: $\\displaystyle\\int_a^b \\big[c\\,f(x) + d\\,g(x)\\big]\\,dx = c\\int_a^b f(x)\\,dx + d\\int_a^b g(x)\\,dx$. This is the workhorse for breaking a complicated integrand into standard pieces.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Additivity over adjacent intervals',
      content:
        'Areas over touching intervals add: $\\displaystyle\\int_a^b f + \\int_b^c f = \\int_a^c f$. Use it to combine or split at an interior point — essential for piecewise integrands and for reading values off an area table.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Reversed limits and zero width',
      content:
        'Swapping the limits flips the sign, $\\displaystyle\\int_b^a f(x)\\,dx = -\\int_a^b f(x)\\,dx$, and a collapsed interval gives zero, $\\displaystyle\\int_a^a f(x)\\,dx = 0$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Bounding and domination',
      content:
        'If $m \\le f(x) \\le M$ on $[a,b]$ then $m(b-a) \\le \\displaystyle\\int_a^b f(x)\\,dx \\le M(b-a)$ (bounding). If $f(x) \\ge g(x)$ on $[a,b]$ then $\\displaystyle\\int_a^b f(x)\\,dx \\ge \\int_a^b g(x)\\,dx$ (domination). Both let you estimate an integral you cannot evaluate.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Even/odd symmetry on symmetric intervals',
      content:
        'On $[-a,a]$: if $f$ is EVEN, $\\displaystyle\\int_{-a}^{a} f(x)\\,dx = 2\\int_0^a f(x)\\,dx$; if $f$ is ODD, $\\displaystyle\\int_{-a}^{a} f(x)\\,dx = 0$ because the signed areas cancel. Spotting parity can turn a hard integral into zero.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Average value of a function',
      content:
        'The AVERAGE VALUE of $f$ on $[a,b]$ is $\\dfrac{1}{b-a}\\displaystyle\\int_a^b f(x)\\,dx$ — the constant height whose rectangle has the same area as the region under $f$.',
    },
  ],
  methods: [
    {
      title: 'Manipulate integrals symbolically with the properties',
      when_to_use:
        'When given values of some integrals and asked for another, WITHOUT evaluating any integrand — the AP staple "given $\\int f$, find $\\ldots$".',
      steps: [
        'Rewrite the target integral so its limits/pieces match the given data (split with additivity, flip with reversed limits).',
        'Pull constants out and distribute sums using linearity.',
        'Substitute the known numerical values.',
        'Simplify to a single number, watching signs from any limit reversals.',
      ],
      example: {
        problem:
          'Given $\\displaystyle\\int_0^5 f(x)\\,dx = 12$ and $\\displaystyle\\int_0^3 f(x)\\,dx = 7$, find $\\displaystyle\\int_3^5 f(x)\\,dx$ and $\\displaystyle\\int_5^0 f(x)\\,dx$.',
        solution:
          'Additivity: $\\int_3^5 f = \\int_0^5 f - \\int_0^3 f = 12 - 7 = 5$. Reversed limits: $\\int_5^0 f = -\\int_0^5 f = -12$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Evaluate an integral by exploiting symmetry',
      when_to_use:
        'When the interval is symmetric $[-a,a]$ and the integrand is clearly even or odd.',
      steps: [
        'Test parity: compute $f(-x)$. Even if $f(-x)=f(x)$; odd if $f(-x)=-f(x)$.',
        'If odd on a symmetric interval, the integral is 0 — stop.',
        'If even, halve the work: $\\int_{-a}^{a} f = 2\\int_0^a f$.',
        'Evaluate the (simpler) remaining integral with an antiderivative.',
      ],
      example: {
        problem:
          'Compute $\\displaystyle\\int_{-2}^{2} x^3\\,dx$ and $\\displaystyle\\int_{-3}^{3} (x^2 + 1)\\,dx$.',
        solution:
          '$x^3$ is odd on $[-2,2]$, so the first integral is 0. $x^2+1$ is even, so $\\int_{-3}^{3}(x^2+1) = 2\\int_0^3 (x^2+1)\\,dx = 2\\big[\\tfrac{x^3}{3}+x\\big]_0^3 = 2(9+3) = 24$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Linearity applies to sums and constant multiples ONLY — there is no product or quotient rule for integrals: $\\int fg \\ne \\int f\\cdot\\int g$.', kind: 'common-error' },
    { content: 'A reversed limit flips the sign; losing that minus when you rewrite $\\int_b^a$ as $\\int_a^b$ is a frequent slip on area-table problems.', kind: 'gotcha' },
    { content: 'Odd-function symmetry gives 0 only when the interval is symmetric about the origin; on $[1,3]$ an odd function has no special value.', kind: 'edge-case' },
    { content: 'To estimate an integral you cannot compute, quote the bounding property $m(b-a)\\le\\int\\le M(b-a)$ with the interval min/max of $f$.', kind: 'frq-vocab' },
    { content: 'Sketch or note the area picture: additivity and symmetry are easiest to apply when you can see the regions being combined or cancelled.', kind: 'tip' },
  ],
};
