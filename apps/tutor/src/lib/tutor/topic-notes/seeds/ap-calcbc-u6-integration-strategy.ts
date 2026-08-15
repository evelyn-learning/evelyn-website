/**
 * AP Calculus BC — Unit 6 CED 6.14: Selecting Techniques for
 * Antidifferentiation.
 *
 * Baseline curated from evelyn.ap.calcbc.integration-strategy.v1 to the gold
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

const LO = 'apcalcbc.integration-strategy';

export const BASELINE_AP_CALCBC_INTEGRATION_STRATEGY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.integration-strategy.v1',
  course: 'AP Calculus BC',
  cedUnit: 6,
  cedTopic: '6.14',
  cedTitle: 'Selecting Techniques for Antidifferentiation',
  planId: 'evelyn.ap.calcbc.integration-strategy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.integration-strategy.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Start with a direct antiderivative',
      content:
        'Before anything clever, check whether the integrand matches a KNOWN form — power, trig, exponential, log, or the inverse-trig forms $\\dfrac{1}{1+x^2}\\to\\arctan x$ and $\\dfrac{1}{\\sqrt{1-x^2}}\\to\\arcsin x$. If it does, integrate directly.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Signature: inner function with its derivative → u-sub',
      content:
        'If you can see an inner function $g(x)$ AND (a constant multiple of) its derivative $g\'(x)$ in the integrand — the $f(g(x))\\,g\'(x)$ pattern — use $u$-substitution. Example: $\\displaystyle\\int x^2\\cos(x^3)\\,dx$ with $u=x^3$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Signature: product of different types → by parts',
      content:
        'A product of two DIFFERENT function types that will not simplify — typically polynomial $\\times$ (trig, exp, log, or inverse trig), like $x e^x$ or $x\\ln x$ — calls for integration by parts, with $u$ chosen by LIATE.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Signature: rational function → algebra first',
      content:
        'For a rational integrand: if IMPROPER ($\\deg\\text{top}\\ge\\deg\\text{bottom}$) long-divide first; if the denominator FACTORS into linear pieces use partial fractions; if it is an irreducible quadratic complete the square toward arctan/arcsin; if the numerator is the denominator\'s derivative, $u$-sub to a log.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Techniques combine',
      content:
        'Hard integrals often need a SEQUENCE of moves: $u$-sub then parts, parts applied twice, or parts then $u$-sub. Recognize the outer structure first, apply one technique, and re-assess what remains. Trig powers may first need identities such as $\\sin^2 x = \\tfrac{1-\\cos 2x}{2}$.',
    },
  ],
  methods: [
    {
      title: 'Classify an integral, then evaluate it',
      when_to_use:
        'On any "evaluate the integral" prompt where the technique is not pre-specified — decide the method from the integrand\'s shape.',
      steps: [
        'Try a direct antiderivative; if it matches a table form, you are done.',
        'Scan for an inner function with its derivative present → $u$-substitution.',
        'Scan for a product of different function types → integration by parts (LIATE).',
        'For a rational function, apply the algebra-first checklist (divide / factor / complete the square).',
        'If one technique leaves a new integral, re-classify and repeat until finished.',
      ],
      example: {
        problem:
          'Choose a method and evaluate: (a) $\\displaystyle\\int x^3\\sqrt{x^4+1}\\,dx$, (b) $\\displaystyle\\int x e^{-x}\\,dx$, (c) $\\displaystyle\\int \\dfrac{1}{x^2+4x+3}\\,dx$.',
        solution:
          '(a) $u$-sub, $u=x^4+1$: $\\tfrac{1}{6}(x^4+1)^{3/2}+C$. (b) By parts, $u=x$: $-e^{-x}(x+1)+C$. (c) Factor $x^2+4x+3=(x+1)(x+3)$, partial fractions: $\\tfrac{1}{2}\\ln|x+1| - \\tfrac{1}{2}\\ln|x+3| + C$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Name the signature features of each technique',
      when_to_use:
        'When an FRQ asks you to JUSTIFY the choice of method rather than only compute.',
      steps: [
        'For $u$-substitution, cite the composite-plus-its-derivative pattern $f(g(x))\\,g\'(x)$.',
        'For integration by parts, cite the product of two different function types (and name the LIATE choice of $u$).',
        'For partial fractions, cite a proper rational function with a factorable denominator.',
        'For algebra-first moves, cite improper degree (divide) or an irreducible quadratic (complete the square).',
      ],
      example: {
        problem: 'Why does $\\displaystyle\\int x^2\\cos(x^3)\\,dx$ call for $u$-substitution?',
        solution:
          'Because the inner function $x^3$ appears together with a constant multiple of its derivative: setting $u=x^3$, $du=3x^2\\,dx$ turns it into $\\tfrac{1}{3}\\int\\cos u\\,du = \\tfrac{1}{3}\\sin(x^3)+C$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Pattern-match BEFORE computing — identifying the structure ($u$-sub vs parts vs rational) is what separates fast, correct work from dead ends.', kind: 'tip' },
    { content: 'For a rational integrand always check the DEGREE first: an improper fraction must be long-divided before any other technique.', kind: 'common-error' },
    { content: 'A product does not automatically mean parts — if one factor is the derivative of the other\'s inner function, it is really a $u$-sub.', kind: 'gotcha' },
    { content: 'Some integrals need two techniques in sequence (e.g. $u$-sub then parts); do not expect one move to always finish the job.', kind: 'edge-case' },
    { content: 'On FRQs, naming the technique and WHY (the signature feature) can earn communication points even before the computation.', kind: 'frq-vocab' },
  ],
};
