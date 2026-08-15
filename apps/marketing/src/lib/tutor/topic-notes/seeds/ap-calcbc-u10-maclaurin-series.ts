/**
 * AP Calculus BC — Unit 10 CED 10.14–10.15: Common Maclaurin Series and
 * Manipulating Power Series.
 *
 * Baseline curated from evelyn.ap.calcbc.maclaurin-series.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts + ap-calcbc-u3-chain-rule.ts:
 * every theory entry carries kind+title, methods are humanized with when_to_use
 * + a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (e, \sin, \dfrac, \sum, a letter, or a sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.maclaurin-series';

export const BASELINE_AP_CALCBC_MACLAURIN_SERIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.maclaurin-series.v1',
  course: 'AP Calculus BC',
  cedUnit: 10,
  cedTopic: '10.14-10.15',
  cedTitle: 'Maclaurin Series & Manipulation',
  planId: 'evelyn.ap.calcbc.maclaurin-series.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.maclaurin-series.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Maclaurin series',
      content:
        'A MACLAURIN SERIES is the Taylor series about $x = 0$: $f(x) = \\sum_{n=0}^{\\infty} \\dfrac{f^{(n)}(0)}{n!}x^{n}$. When $f$ equals its Maclaurin series on an interval, that series IS the function there, so you can compute, differentiate, and integrate $f$ term-by-term.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Exponential and trig series',
      content:
        'Memorize (all with $R = \\infty$): $e^{x} = \\sum_{n=0}^{\\infty} \\dfrac{x^{n}}{n!} = 1 + x + \\dfrac{x^{2}}{2!} + \\cdots$;  $\\sin x = \\sum_{n=0}^{\\infty} \\dfrac{(-1)^{n} x^{2n+1}}{(2n+1)!} = x - \\dfrac{x^{3}}{3!} + \\dfrac{x^{5}}{5!} - \\cdots$;  $\\cos x = \\sum_{n=0}^{\\infty} \\dfrac{(-1)^{n} x^{2n}}{(2n)!} = 1 - \\dfrac{x^{2}}{2!} + \\dfrac{x^{4}}{4!} - \\cdots$. Note $\\sin x$ uses ODD powers, $\\cos x$ EVEN powers.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Geometric, log, and arctangent series',
      content:
        'Also memorize: $\\dfrac{1}{1 - x} = \\sum_{n=0}^{\\infty} x^{n} = 1 + x + x^{2} + \\cdots$ ($R = 1$);  $\\ln(1 + x) = \\sum_{n=1}^{\\infty} \\dfrac{(-1)^{n+1} x^{n}}{n} = x - \\dfrac{x^{2}}{2} + \\dfrac{x^{3}}{3} - \\cdots$ (IOC $(-1, 1]$);  $\\arctan x = \\sum_{n=0}^{\\infty} \\dfrac{(-1)^{n} x^{2n+1}}{2n + 1} = x - \\dfrac{x^{3}}{3} + \\dfrac{x^{5}}{5} - \\cdots$ (IOC $[-1, 1]$).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Manipulating known series',
      content:
        'Derive new series from the memorized ones by: SUBSTITUTION (replace $x$ with an expression, e.g. $e^{x^{2}} = \\sum \\tfrac{x^{2n}}{n!}$); TERM-BY-TERM DIFFERENTIATION or INTEGRATION (same $R$, though endpoints may change); and MULTIPLICATION BY A POWER OF $x$ (shifts every exponent, e.g. $x\\,e^{x} = \\sum \\tfrac{x^{n+1}}{n!}$). These beat computing derivatives from scratch.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Maclaurin coefficient formula',
      content:
        'The coefficient of $x^{k}$ in the Maclaurin series equals $\\dfrac{f^{(k)}(0)}{k!}$. Reading it backward lets you extract a derivative from a series: if the $x^{k}$ coefficient is $a_k$, then $f^{(k)}(0) = k!\\,a_k$. For example, a coefficient $\\tfrac{1}{120}$ on $x^{7}$ gives $f^{(7)}(0) = 7!\\cdot\\tfrac{1}{120} = 42$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'coefficient (one-line)',
      content: 'Coefficient of $x^{k}$ is $\\dfrac{f^{(k)}(0)}{k!}$; equivalently $f^{(k)}(0) = k!\\,a_k$.',
    },
  ],
  methods: [
    {
      title: 'Derive a series by substitution',
      when_to_use:
        'When the function is a memorized series with its argument replaced by another expression (e.g. $e^{-x^{2}}$, $\\sin(x^{2})$, $\\tfrac{1}{1 - x^{2}}$).',
      steps: [
        'Match the function to a known series and identify what plays the role of the variable.',
        'Substitute that expression everywhere the variable appears in the known series.',
        'Simplify the powers and signs; the radius transforms with the substitution.',
      ],
      example: {
        problem: 'Find the Maclaurin series for $e^{-x^{2}}$.',
        solution:
          'Start from $e^{u} = \\sum_{n=0}^{\\infty} \\dfrac{u^{n}}{n!}$ and substitute $u = -x^{2}$: $e^{-x^{2}} = \\sum_{n=0}^{\\infty} \\dfrac{(-x^{2})^{n}}{n!} = \\sum_{n=0}^{\\infty} \\dfrac{(-1)^{n} x^{2n}}{n!} = 1 - x^{2} + \\dfrac{x^{4}}{2!} - \\cdots$, with $R = \\infty$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Derive a series by differentiating or integrating',
      when_to_use:
        'When the target function is the derivative or antiderivative of a function whose series you know (e.g. get $\\arctan x$ from $\\tfrac{1}{1 + x^{2}}$).',
      steps: [
        'Write the series of the related function (often a geometric series after a substitution).',
        'Differentiate or integrate the series TERM-BY-TERM.',
        'For integration, fix the constant of integration using a known value (usually the value at $x = 0$).',
      ],
      example: {
        problem: 'Derive the Maclaurin series for $\\arctan x$ from $\\dfrac{1}{1 + x^{2}}$.',
        solution:
          '$\\dfrac{1}{1 + x^{2}} = \\sum_{n=0}^{\\infty} (-x^{2})^{n} = \\sum_{n=0}^{\\infty} (-1)^{n} x^{2n}$. Integrate term-by-term: $\\arctan x = \\sum_{n=0}^{\\infty} \\dfrac{(-1)^{n} x^{2n+1}}{2n + 1} + C$. Since $\\arctan 0 = 0$, $C = 0$: $\\arctan x = x - \\dfrac{x^{3}}{3} + \\dfrac{x^{5}}{5} - \\cdots$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Read a derivative off a Maclaurin series',
      when_to_use:
        'When asked for a high-order derivative $f^{(k)}(0)$ that would be painful to compute directly.',
      steps: [
        'Build the Maclaurin series of $f$ (usually by manipulating a known one).',
        'Find the coefficient $a_k$ of $x^{k}$.',
        'Apply $f^{(k)}(0) = k!\\,a_k$.',
      ],
      example: {
        problem: 'For $f(x) = x^{2}\\sin x$, find $f^{(7)}(0)$.',
        solution:
          '$\\sin x = x - \\dfrac{x^{3}}{6} + \\dfrac{x^{5}}{120} - \\cdots$, so $x^{2}\\sin x = x^{3} - \\dfrac{x^{5}}{6} + \\dfrac{x^{7}}{120} - \\cdots$. The $x^{7}$ coefficient is $\\tfrac{1}{120}$, so $f^{(7)}(0) = 7!\\cdot\\dfrac{1}{120} = \\dfrac{5040}{120} = 42$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Keep $\\sin x$ (odd powers, begins with $x$) and $\\cos x$ (even powers, begins with a constant term) straight — swapping their power parity is a frequent slip.', kind: 'common-error' },
    { content: 'Substitution changes the radius: $\\dfrac{1}{1 - x}$ has $R = 1$, so $\\dfrac{1}{1 - x^{2}} = \\sum x^{2n}$ converges for $|x^{2}| < 1$, i.e. $|x| < 1$.', kind: 'gotcha' },
    { content: 'Differentiation and integration preserve $R$ but can change ENDPOINT behavior — recheck endpoints if the IOC is asked for.', kind: 'edge-case' },
    { content: 'To extract a derivative, match powers exactly: $f^{(k)}(0) = k!\\times(\\text{coefficient of } x^{k})$; a missing power means that derivative is zero.', kind: 'tip' },
    { content: 'On an FRQ, give the general term with $\\sum$ notation and a couple of written-out terms — a few terms alone may not earn the "series" point.', kind: 'frq-vocab' },
  ],
};
