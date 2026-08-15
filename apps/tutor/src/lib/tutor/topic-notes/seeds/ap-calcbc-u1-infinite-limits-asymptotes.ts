/**
 * AP Calculus BC — Unit 1 CED 1.14: Connecting Infinite Limits and Vertical
 * Asymptotes.
 *
 * Baseline curated from the source plan
 * evelyn.ap.calcbc.infinite-limits-vertical-asymptotes.v1, matched to the gold
 * calibration seeds/ap-calcbc-u1-defining-limits.ts: theory entries carry
 * kind+title, methods are humanized with when_to_use + a worked example, and
 * pointers mix kinds (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so bounds/values open with a non-digit (\lim, a variable, or a sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.infinite-limits-vertical-asymptotes';

export const BASELINE_AP_CALCBC_INFINITE_LIMITS_ASYMPTOTES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.infinite-limits-vertical-asymptotes.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.14',
  cedTitle: 'Infinite Limits and Vertical Asymptotes',
  planId: 'evelyn.ap.calcbc.infinite-limits-vertical-asymptotes.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.infinite-limits-vertical-asymptotes.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Infinite limit notation',
      content:
        '$\\lim_{x\\to a} f(x) = +\\infty$ means that as $x$ approaches $a$, $f(x)$ grows without bound (positively); $\\lim_{x\\to a} f(x) = -\\infty$ means it decreases without bound. Both technically mean the limit does not exist as a finite number, but the $\\pm\\infty$ notation precisely describes the UNBOUNDED behavior rather than just declaring DNE.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'One-sided infinite limits',
      content:
        'The two sides can blow up differently. $\\lim_{x\\to a^+} f(x) = +\\infty$ means $f$ blows up positively from the right; $\\lim_{x\\to a^-} f(x) = -\\infty$ means it blows down from the left. A classic split: $f(x)=\\tfrac{1}{x}$ at $x=0$ has $\\lim_{x\\to 0^-}=-\\infty$ but $\\lim_{x\\to 0^+}=+\\infty$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Vertical asymptote',
      content:
        'The line $x=a$ is a VERTICAL ASYMPTOTE of $f$ if AT LEAST ONE of the one-sided limits at $a$ is $+\\infty$ or $-\\infty$. Geometrically, the curve hugs the vertical line $x=a$ but never crosses it, shooting up or down.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Where rational functions have vertical asymptotes',
      content:
        'For $f(x)=\\dfrac{N(x)}{D(x)}$, the line $x=a$ is a vertical asymptote when $D(a)=0$ AND $N(a)\\ne 0$ — a nonzero-over-zero form forces the ratio to blow up. Example: $f(x)=\\dfrac{1}{x-3}$ has a vertical asymptote at $x=3$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Sign analysis for the direction of blow-up',
      content:
        'To decide $+\\infty$ vs $-\\infty$ for $f=\\dfrac{N}{D}$ with $D(a)=0$, $N(a)\\ne 0$: (1) find the sign of $N$ near $a$ (just evaluate $N(a)$); (2) find the sign of $D$ on each side as $x\\to a^\\pm$; (3) the limit is $+\\infty$ when the signs AGREE and $-\\infty$ when they DIFFER.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Not every denominator zero is an asymptote',
      content:
        'If $N(a)=0$ and $D(a)=0$ (a $\\tfrac{0}{0}$ indeterminate form), you may have a REMOVABLE discontinuity instead of an asymptote. Always factor and cancel FIRST: if the reduced form has a finite limit at $a$, it is a hole, not a vertical asymptote.',
    },
  ],
  methods: [
    {
      title: 'Find all vertical asymptotes of a rational function and sign each side',
      when_to_use:
        'When asked to locate the vertical asymptotes of $f(x)=\\dfrac{N(x)}{D(x)}$ and/or to give the one-sided limits $\\lim_{x\\to a^\\pm} f(x)$ at each.',
      steps: [
        'Factor the denominator $D(x)$ fully and list its zeros $x=a$.',
        'At each zero, evaluate the numerator: if $N(a)\\ne 0$ it is a vertical asymptote; if $N(a)=0$ it is $\\tfrac{0}{0}$ — cancel the common factor and re-check for a finite limit (a hole) before deciding.',
        'For each true asymptote, run sign analysis: fix the sign of $N$ near $a$, then track the sign of each denominator factor as $x\\to a^-$ and $x\\to a^+$.',
        'Combine signs: matching signs give $+\\infty$, opposite signs give $-\\infty$, for each side.',
        'State each vertical asymptote with its left and right one-sided limits.',
      ],
      example: {
        problem:
          'Determine all vertical asymptotes of $f(x)=\\dfrac{x+1}{x^2-4x+3}$, and find the one-sided limits at each.',
        solution:
          'Factor: $x^2-4x+3=(x-1)(x-3)$, so the zeros are $x=1$ and $x=3$. Numerator at $x=1$ is $N(1)=2\\ne 0$ and at $x=3$ is $N(3)=4\\ne 0$ — neither is $\\tfrac{0}{0}$, so both are vertical asymptotes. At $x=1$: numerator $\\approx 2>0$; as $x\\to 1^-$, $(x-1)<0$ and $(x-3)\\approx -2<0$ give a positive denominator, so $\\lim_{x\\to 1^-} f=+\\infty$; as $x\\to 1^+$, $(x-1)>0$ and $(x-3)<0$ give a negative denominator, so $\\lim_{x\\to 1^+} f=-\\infty$. At $x=3$: numerator $\\approx 4>0$, $(x-1)\\approx 2>0$; as $x\\to 3^-$, $(x-3)<0$ so $\\lim_{x\\to 3^-} f=-\\infty$; as $x\\to 3^+$, $(x-3)>0$ so $\\lim_{x\\to 3^+} f=+\\infty$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Before declaring a vertical asymptote at a denominator zero, check whether the form is $\\tfrac{0}{0}$ and cancels — that case is a removable hole, not an asymptote.', kind: 'common-error' },
    { content: 'On an FRQ, justify a vertical asymptote by naming the one-sided limit as $+\\infty$ or $-\\infty$, not just by saying "the denominator is zero."', kind: 'frq-vocab' },
    { content: 'A squared denominator like $(x-2)^2$ is non-negative on both sides, so $f=\\dfrac{x-5}{(x-2)^2}$ blows up to the SAME sign of infinity ($-\\infty$) from both directions.', kind: 'edge-case' },
    { content: 'Vertical asymptotes are not only a rational-function thing: $\\ln(x)\\to -\\infty$ as $x\\to 0^+$, and $\\tan(x)$ blows up at $x=\\tfrac{\\pi}{2}+n\\pi$.', kind: 'tip' },
    { content: 'Writing $\\lim = +\\infty$ describes unbounded growth but is not a finite value — say whether the prompt wants "$=+\\infty$" or "DNE."', kind: 'gotcha' },
  ],
};
