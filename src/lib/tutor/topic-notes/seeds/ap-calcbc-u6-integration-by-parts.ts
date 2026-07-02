/**
 * AP Calculus BC — Unit 6 CED 6.11: Integration by Parts (BC only).
 *
 * Baseline curated from evelyn.ap.calcbc.integration-by-parts.v1 to the gold
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

const LO = 'apcalcbc.integration-by-parts';

export const BASELINE_AP_CALCBC_INTEGRATION_BY_PARTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.integration-by-parts.v1',
  course: 'AP Calculus BC',
  cedUnit: 6,
  cedTopic: '6.11',
  cedTitle: 'Integration by Parts (BC)',
  planId: 'evelyn.ap.calcbc.integration-by-parts.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.integration-by-parts.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'The integration-by-parts formula',
      content:
        'Integration by parts is the product rule reversed: $\\displaystyle\\int u\\,dv = uv - \\int v\\,du$. You trade the integral $\\int u\\,dv$ for the (hopefully easier) integral $\\int v\\,du$.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Where it comes from',
      content:
        'Start from the product rule $\\dfrac{d}{dx}(uv) = u\'v + uv\'$ and integrate both sides: $uv = \\displaystyle\\int u\'v\\,dx + \\int uv\'\\,dx$. Rearranging with $dv=v\'\\,dx$ and $du=u\'\\,dx$ gives $\\displaystyle\\int u\\,dv = uv - \\int v\\,du$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Choosing u with LIATE',
      content:
        'Pick $u$ as the function highest on the LIATE list — Logarithmic, Inverse trig, Algebraic, Trig, Exponential — and let $dv$ be the rest. The idea: choose $u$ so that $du$ is SIMPLER than $u$, driving the new integral toward something you can finish.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Repeated and circular parts',
      content:
        'Some integrals need parts MORE THAN ONCE. For $\\displaystyle\\int x^2 e^x\\,dx$, apply parts twice, peeling one power of $x$ each time. For a CIRCULAR integral like $\\displaystyle\\int e^x \\sin x\\,dx$, two applications reproduce the original integral $I$; then SOLVE algebraically for $I$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'A result worth memorizing',
      content:
        '$\\displaystyle\\int \\ln x\\,dx = x\\ln x - x + C$, obtained by taking $u=\\ln x$ (an $L$ that has no elementary antiderivative on its own) and $dv=dx$.',
    },
  ],
  methods: [
    {
      title: 'Integrate a product of two different function types by parts',
      when_to_use:
        'When the integrand is a product like $x e^x$, $x\\sin x$, or $\\ln x$ that will not simplify by $u$-substitution.',
      steps: [
        'Use LIATE to choose $u$ (highest on the list) and let $dv$ be the remaining factor (including $dx$).',
        'Differentiate to get $du$ and antidifferentiate $dv$ to get $v$.',
        'Apply $\\int u\\,dv = uv - \\int v\\,du$.',
        'Evaluate the new integral $\\int v\\,du$ (apply parts again if needed).',
        'Add $+C$ and, where possible, factor the result.',
      ],
      example: {
        problem: 'Compute $\\displaystyle\\int x e^x\\,dx$.',
        solution:
          'LIATE: Algebraic before Exponential, so $u=x$, $dv=e^x\\,dx$; then $du=dx$, $v=e^x$. Parts: $x e^x - \\int e^x\\,dx = x e^x - e^x + C = e^x(x-1)+C$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Solve a circular integral by applying parts twice',
      when_to_use:
        'When the integrand is a product of an exponential with a sine or cosine — parts reproduces the original integral.',
      steps: [
        'Name the integral $I = \\int (\\text{integrand})\\,dx$ and apply parts once.',
        'Apply parts a second time to the leftover integral.',
        'Recognize that the ORIGINAL integral $I$ has reappeared on the right side.',
        'Solve the resulting equation algebraically for $I$ and add $+C$.',
      ],
      example: {
        problem: 'Compute $\\displaystyle\\int e^x \\sin x\\,dx$.',
        solution:
          'Let $I = \\int e^x\\sin x\\,dx$. Applying parts twice (keeping $dv=e^x\\,dx$) gives $I = e^x\\sin x - e^x\\cos x - I$. Adding $I$ to both sides and halving yields $I = \\tfrac{e^x}{2}(\\sin x - \\cos x) + C$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Keep the minus sign in $uv - \\int v\\,du$; dropping it (writing $uv + \\int v\\,du$) is the single most common parts error.', kind: 'common-error' },
    { content: 'Choosing $u$ wrong makes $\\int v\\,du$ HARDER than the original — if that happens, swap your $u$ and $dv$.', kind: 'gotcha' },
    { content: 'For $\\int \\ln x\\,dx$ or $\\int \\arctan x\\,dx$ there is only one visible factor; take $u$ = that function and $dv = dx$.', kind: 'edge-case' },
    { content: 'On a circular integral, the payoff is ALGEBRAIC: once the original $I$ reappears, move it to the left and divide — do not keep integrating.', kind: 'frq-vocab' },
    { content: 'Tabular integration streamlines repeated parts when $u$ is a polynomial (its derivatives eventually hit 0) and $dv$ integrates cleanly.', kind: 'tip' },
  ],
};
