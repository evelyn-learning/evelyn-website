/**
 * AP Calculus BC — Unit 7 CED 7.6–7.7: Finding General and Particular
 * Solutions Using Separation of Variables.
 *
 * Baseline curated from evelyn.ap.calcbc.separation-of-variables.v1 to the
 * gold standard set by seeds/ap-calcbc-u1-defining-limits.ts and
 * seeds/ap-calcbc-u3-chain-rule.ts: every theory entry carries kind+title,
 * methods are humanized with when_to_use + a worked example, pointers are a
 * kind mix (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe
 * renderer), so any span opens with a non-digit (\dfrac, a letter, a sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.separation-of-variables';

export const BASELINE_AP_CALCBC_SEPARATION_OF_VARIABLES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.separation-of-variables.v1',
  course: 'AP Calculus BC',
  cedUnit: 7,
  cedTopic: '7.6-7.7',
  cedTitle: 'Separation of Variables',
  planId: 'evelyn.ap.calcbc.separation-of-variables.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.separation-of-variables.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Separable differential equation',
      content:
        'A DE is SEPARABLE when it can be written as $\\dfrac{dy}{dx} = f(x)\\,g(y)$ — an $x$-only factor MULTIPLIED by a $y$-only factor. The test is multiplication, not addition: $\\dfrac{dy}{dx} = e^{x}\\cos y$ is separable, but $\\dfrac{dy}{dx} = x + y$ is not.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The separation technique',
      content:
        'Collect all $y$ on one side and all $x$ on the other, then integrate both sides: from $\\dfrac{dy}{dx} = f(x)\\,g(y)$ move to $\\dfrac{dy}{g(y)} = f(x)\\,dx$, then $\\displaystyle\\int \\dfrac{dy}{g(y)} = \\int f(x)\\,dx + C$. Add the constant $C$ ONCE, on the $x$-side. Finally solve for $y$ when possible.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Canonical case: dy/dt = ky',
      content:
        'The exponential DE $\\dfrac{dy}{dt} = ky$ is separable. Separate: $\\dfrac{dy}{y} = k\\,dt$. Integrate: $\\ln|y| = kt + C$. Exponentiate: $|y| = e^{kt + C}$, so $y = Ae^{kt}$ where $A = \\pm e^{C}$ absorbs the constant. This is the backbone of every exponential model in 7.8.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Particular solution from an initial condition',
      content:
        'Integrating gives a GENERAL solution with an arbitrary constant. An INITIAL CONDITION $y(x_0) = y_0$ is substituted to solve for that constant, producing the single PARTICULAR solution. For $y = Ae^{kt}$ with $y(0) = 5$: $Ae^{0} = 5 \\Rightarrow A = 5$, so $y = 5e^{kt}$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Handling the constant and absolute values',
      content:
        'After $\\ln|y| = kt + C$, exponentiating turns $\\pm e^{C}$ into a single new constant $A$ — do not carry $\\pm$ and $C$ separately. Often it is cleaner to apply the initial condition BEFORE fully isolating $y$, and always confirm the result by differentiating and substituting back into the original DE.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'separation of variables (one-line)',
      content: 'for $\\dfrac{dy}{dx} = f(x)\\,g(y)$: write $\\dfrac{dy}{g(y)} = f(x)\\,dx$, integrate both sides, then solve for $y$.',
    },
  ],
  methods: [
    {
      title: 'Solve a separable DE with an initial condition',
      when_to_use:
        'When $\\dfrac{dy}{dx}$ factors as ($x$-stuff)$\\times$($y$-stuff) and a particular solution is wanted.',
      steps: [
        'SEPARATE: get every $y$ (with $dy$) on the left, every $x$ (with $dx$) on the right.',
        'INTEGRATE both sides, adding a single constant $C$.',
        'SOLVE for $y$ (exponentiate to clear a log; fold $\\pm e^{C}$ into one constant $A$).',
        'APPLY the initial condition to pin the constant.',
        'CHECK by differentiating your solution and substituting into the original DE.',
      ],
      example: {
        problem: 'Solve $\\dfrac{dy}{dx} = 2xy$ with $y(0) = 3$.',
        solution:
          'Separate: $\\dfrac{dy}{y} = 2x\\,dx$. Integrate: $\\ln|y| = x^{2} + C$. Exponentiate: $y = Ae^{x^{2}}$. Apply $y(0) = 3$: $Ae^{0} = 3 \\Rightarrow A = 3$. So $y = 3e^{x^{2}}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Decide whether a DE is separable',
      when_to_use:
        'Before attempting separation — some DEs only LOOK separable until you simplify.',
      steps: [
        'Try to factor $\\dfrac{dy}{dx}$ as (a function of $x$ alone) $\\times$ (a function of $y$ alone).',
        'If $x$ and $y$ appear ADDED (e.g. $x + y$) and cannot be factored apart, it is NOT separable.',
        'Simplify first: a quotient like $\\dfrac{xy + 1}{x}$ may split into $y + \\dfrac{1}{x}$ — an addition, hence not separable.',
        'If it factors, proceed to separate; if not, it is beyond the separable toolkit.',
      ],
      example: {
        problem: 'Which are separable? (a) $\\dfrac{dy}{dx} = x^{2}y$; (b) $\\dfrac{dy}{dx} = x + y$; (c) $\\dfrac{dy}{dx} = e^{x}\\cos y$; (d) $\\dfrac{dy}{dx} = \\dfrac{xy + 1}{x}$.',
        solution:
          '(a) Separable: $\\dfrac{dy}{y} = x^{2}\\,dx$. (b) NOT — $x$ and $y$ are added. (c) Separable: $\\dfrac{dy}{\\cos y} = e^{x}\\,dx$. (d) Rewrite as $y + \\dfrac{1}{x}$ — an addition, so NOT separable.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Separable means the $x$- and $y$-parts are MULTIPLIED. If they are added ($x + y$), separation fails — no amount of algebra fixes an inseparable sum.', kind: 'common-error' },
    { content: 'Add the constant $C$ exactly ONCE (put it on the $x$-side). Two constants or a forgotten one is the most common lost point on separation FRQs.', kind: 'frq-vocab' },
    { content: 'When you exponentiate $\\ln|y| = \\ldots$, collapse $\\pm e^{C}$ into a single constant $A$ rather than tracking sign and $e^{C}$ separately.', kind: 'tip' },
    { content: 'Applying the initial condition BEFORE fully isolating $y$ is often less error-prone — you solve for the constant with simpler algebra.', kind: 'tip' },
    { content: 'Dividing by $g(y)$ can hide EQUILIBRIUM solutions where $g(y) = 0$ (e.g. $y = 0$ for $\\dfrac{dy}{dx} = 2xy$) — note them separately if the problem needs all solutions.', kind: 'edge-case' },
  ],
};
