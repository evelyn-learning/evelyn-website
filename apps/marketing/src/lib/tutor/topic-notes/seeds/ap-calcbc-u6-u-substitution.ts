/**
 * AP Calculus BC — Unit 6 CED 6.9: Integration by Substitution.
 *
 * Baseline curated from evelyn.ap.calcbc.u-substitution.v1 to the gold standard
 * set by seeds/ap-calcbc-u1-defining-limits.ts + ap-calcbc-u3-chain-rule.ts:
 * theory entries carry kind+title, methods are humanized with when_to_use +
 * a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\int, \dfrac, a letter, "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.u-substitution';

export const BASELINE_AP_CALCBC_U_SUBSTITUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.u-substitution.v1',
  course: 'AP Calculus BC',
  cedUnit: 6,
  cedTopic: '6.9',
  cedTitle: 'Integration by Substitution',
  planId: 'evelyn.ap.calcbc.u-substitution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.u-substitution.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'u-substitution is the chain rule reversed',
      content:
        'If an integral has the form $\\displaystyle\\int f(g(x))\\,g\'(x)\\,dx$, set $u=g(x)$ so $du = g\'(x)\\,dx$ and it collapses to $\\displaystyle\\int f(u)\\,du$. This exactly undoes $\\dfrac{d}{dx}F(g(x)) = F\'(g(x))\\,g\'(x)$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The five-step procedure',
      content:
        'CHOOSE $u=g(x)$, an inner function whose derivative also appears; COMPUTE $du = g\'(x)\\,dx$ and solve for the $dx$-piece; SUBSTITUTE to rewrite the whole integral in $u$; INTEGRATE in $u$; BACK-SUBSTITUTE $u=g(x)$ to return to $x$ (indefinite integrals only).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Definite integrals: change the limits',
      content:
        'For $\\displaystyle\\int_a^b$, convert the bounds along with the variable: new limits are $u=g(a)$ and $u=g(b)$. Then evaluate entirely in $u$ — there is NO need to back-substitute to $x$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Balancing a missing constant',
      content:
        'If the outside factor is off by a constant, fix it algebraically. For $\\displaystyle\\int x\\,e^{x^2}\\,dx$ with $u=x^2$, $du=2x\\,dx$, so $x\\,dx = \\tfrac{1}{2}\\,du$: the integral becomes $\\tfrac{1}{2}\\displaystyle\\int e^{u}\\,du = \\tfrac{1}{2}e^{x^2}+C$. You may only pull CONSTANTS across the integral sign this way, never variables.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Recognizing the u-sub signature',
      content:
        'Look for a COMPOSITE $f(g(x))$ paired with (a constant multiple of) $g\'(x)$: e.g. $\\displaystyle\\int \\cos x\\,e^{\\sin x}\\,dx$ ($u=\\sin x$), $\\displaystyle\\int \\dfrac{2x}{x^2+5}\\,dx$ ($u=x^2+5$). The presence of the inner function\'s derivative is the trigger.',
    },
  ],
  methods: [
    {
      title: 'Evaluate an indefinite integral by u-substitution',
      when_to_use:
        'When you can spot an inner function $g(x)$ whose derivative (up to a constant) multiplies the rest of the integrand.',
      steps: [
        'Choose $u=g(x)$ and compute $du = g\'(x)\\,dx$.',
        'Solve for the $dx$-piece and replace every $x$-expression with its $u$-equivalent.',
        'Simplify to $\\int (\\text{function of } u)\\,du$ — pull out any constant factor.',
        'Integrate in $u$.',
        'Back-substitute $u=g(x)$ and add $+C$.',
      ],
      example: {
        problem: 'Compute $\\displaystyle\\int 2x\\,e^{x^2}\\,dx$.',
        solution:
          'Let $u=x^2$, so $du=2x\\,dx$ — exactly the outside factor. The integral becomes $\\int e^{u}\\,du = e^{u}+C$; back-substitute to get $e^{x^2}+C$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Evaluate a definite integral by changing the limits',
      when_to_use:
        'For a numerical $\\int_a^b$ where a substitution simplifies the integrand — convert the bounds to avoid back-substituting.',
      steps: [
        'Pick $u=g(x)$ and compute $du$.',
        'Convert the limits: lower becomes $g(a)$, upper becomes $g(b)$.',
        'Rewrite the integral fully in $u$ with the new limits.',
        'Integrate and evaluate at the new $u$-limits directly.',
      ],
      example: {
        problem: 'Compute $\\displaystyle\\int_0^2 x\\sqrt{x^2+1}\\,dx$.',
        solution:
          'Let $u=x^2+1$, $du=2x\\,dx$, so $x\\,dx=\\tfrac{1}{2}\\,du$. Limits: $x=0\\Rightarrow u=1$, $x=2\\Rightarrow u=5$. Then $\\tfrac{1}{2}\\int_1^5 u^{1/2}\\,du = \\tfrac{1}{2}\\cdot\\tfrac{2}{3}\\big[u^{3/2}\\big]_1^5 = \\tfrac{1}{3}(5\\sqrt{5}-1)$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'For a DEFINITE integral you must either change the limits to $u$-values OR back-substitute before plugging in $x$ — never evaluate $u$-limits against an $x$-antiderivative.', kind: 'common-error' },
    { content: 'Only CONSTANTS may cross the integral sign; you cannot pull a stray $x$ outside to make $du$ match.', kind: 'gotcha' },
    { content: 'A leftover $x$ after substituting means the choice of $u$ was wrong (or you must solve $u=g(x)$ for the leftover $x$ and substitute it too).', kind: 'edge-case' },
    { content: '$\\displaystyle\\int \\tan x\\,dx = -\\ln|\\cos x| + C = \\ln|\\sec x| + C$ via $u=\\cos x$ — a standard result worth memorizing for the exam.', kind: 'frq-vocab' },
    { content: 'Choose $u$ as the inner function of a composition or the messiest denominator; the right pick makes $du$ appear in the integrand.', kind: 'tip' },
  ],
};
