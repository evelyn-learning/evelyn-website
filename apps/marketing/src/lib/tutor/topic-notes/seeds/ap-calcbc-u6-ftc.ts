/**
 * AP Calculus BC — Unit 6 CED 6.4–6.7: The Fundamental Theorem of Calculus
 * (accumulation + evaluation forms).
 *
 * Baseline curated from evelyn.ap.calcbc.ftc.v1 to the gold standard set by
 * seeds/ap-calcbc-u1-defining-limits.ts + ap-calcbc-u3-chain-rule.ts: every
 * theory entry carries kind+title, methods are humanized with when_to_use +
 * a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\int, \dfrac, a letter, "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.ftc';

export const BASELINE_AP_CALCBC_FTC: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.ftc.v1',
  course: 'AP Calculus BC',
  cedUnit: 6,
  cedTopic: '6.4-6.7',
  cedTitle: 'The Fundamental Theorem of Calculus',
  planId: 'evelyn.ap.calcbc.ftc.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.ftc.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Accumulation function',
      content:
        'An ACCUMULATION FUNCTION $F(x) = \\displaystyle\\int_a^x f(t)\\,dt$ measures the signed area collected under $f$ from a fixed $a$ up to a moving upper limit $x$. The dummy variable $t$ runs inside; the output depends only on $x$.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'FTC Part 1 — differentiating an accumulation',
      content:
        'If $f$ is continuous, then $\\dfrac{d}{dx}\\displaystyle\\int_a^x f(t)\\,dt = f(x)$: differentiating an accumulation function just re-evaluates the integrand at the upper limit. Differentiation UNDOES integration.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'FTC Part 1 with the chain rule',
      content:
        'When the upper limit is itself a function $g(x)$, the chain rule contributes a factor: $\\dfrac{d}{dx}\\displaystyle\\int_a^{g(x)} f(t)\\,dt = f(g(x))\\,g\'(x)$. If BOTH limits vary, split additively $\\int_{u(x)}^{v(x)} = \\int_a^{v(x)} - \\int_a^{u(x)}$ and differentiate each piece.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'FTC Part 2 — evaluating a definite integral',
      content:
        'If $F$ is ANY antiderivative of $f$ (so $F\'=f$), then $\\displaystyle\\int_a^b f(x)\\,dx = F(b) - F(a)$, also written $\\big[F(x)\\big]_a^b$. Find one antiderivative, plug in the top limit, subtract the bottom limit — no Riemann sums needed.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why the two parts unify calculus',
      content:
        'Part 1 says an integral (accumulation) can DEFINE an antiderivative; Part 2 says an antiderivative EVALUATES an integral. Together they make differentiation and integration inverse operations — the bridge that makes definite integrals computable.',
    },
  ],
  methods: [
    {
      title: 'Evaluate a definite integral with FTC Part 2',
      when_to_use:
        'Whenever you must compute a numerical definite integral $\\displaystyle\\int_a^b f(x)\\,dx$ and $f$ has a findable antiderivative.',
      steps: [
        'Find an antiderivative $F$ of the integrand (any one — the $+C$ cancels).',
        'Evaluate $F(b)$ at the upper limit.',
        'Evaluate $F(a)$ at the lower limit.',
        'Subtract: the value is $F(b) - F(a)$.',
      ],
      example: {
        problem: 'Evaluate $\\displaystyle\\int_1^3 (3x^2 - 4x + 1)\\,dx$.',
        solution:
          'Antiderivative: $F(x) = x^3 - 2x^2 + x$. Then $F(3) = 27 - 18 + 3 = 12$ and $F(1) = 1 - 2 + 1 = 0$, so the integral is $F(3) - F(1) = 12$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Differentiate an accumulation function (FTC Part 1)',
      when_to_use:
        'When asked for $F\'(x)$ where $F$ is written as an integral with a variable upper (and/or lower) limit.',
      steps: [
        'Confirm the integrand is continuous and identify the upper-limit function $g(x)$.',
        'Substitute the upper limit into the integrand: form $f(g(x))$.',
        'Multiply by the derivative of the upper limit $g\'(x)$ (this factor is 1 when the limit is just $x$).',
        'If the lower limit also varies, subtract the corresponding term for that limit.',
      ],
      example: {
        problem: 'Find $F\'(x)$ for $F(x) = \\displaystyle\\int_2^{x^2} \\sin(t)\\,dt$.',
        solution:
          'The upper limit is $g(x)=x^2$ with $g\'(x)=2x$. FTC Part 1 plus the chain rule gives $F\'(x) = \\sin(x^2)\\cdot 2x = 2x\\sin(x^2)$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'FTC Part 1 needs the integrand CONTINUOUS on the interval; a discontinuity between the limits breaks the theorem (revisit as an improper integral, Topic 6.13).', kind: 'edge-case' },
    { content: 'When the upper limit is $g(x)\\ne x$, do not forget the $\\cdot\\,g\'(x)$ factor — dropping the chain-rule multiplier is the top FTC Part 1 error.', kind: 'common-error' },
    { content: 'The dummy variable in $\\int_a^x f(t)\\,dt$ must differ from the limit $x$; write $t$ (or $u$) inside, never $x$ in both roles.', kind: 'gotcha' },
    { content: 'On FRQs, "the antiderivative of the rate is the total change": $\\int_a^b f\'(x)\\,dx = f(b)-f(a)$ is the Net Change Theorem, a direct restatement of FTC Part 2.', kind: 'frq-vocab' },
    { content: 'Any antiderivative works in Part 2 — pick the simplest and skip the $+C$, since it cancels in $F(b)-F(a)$.', kind: 'tip' },
  ],
};
