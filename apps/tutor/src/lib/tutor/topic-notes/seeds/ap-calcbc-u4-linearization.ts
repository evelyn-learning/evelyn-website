/**
 * AP Calculus BC — Unit 4 CED 4.6: Approximating Function Values Using Local
 * Linearity (Linearization).
 *
 * Baseline curated from evelyn.ap.calcbc.linearization.v1 to the gold standard
 * set by seeds/ap-calcbc-u1-defining-limits.ts: every theory entry carries
 * kind+title, methods are humanized with when_to_use + a worked example,
 * pointers are a kind mix (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (a letter, \sqrt, \tfrac, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.linearization';

export const BASELINE_AP_CALCBC_LINEARIZATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.linearization.v1',
  course: 'AP Calculus BC',
  cedUnit: 4,
  cedTopic: '4.6',
  cedTitle: 'Linearization',
  planId: 'evelyn.ap.calcbc.linearization.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.linearization.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'The linearization (tangent-line approximation)',
      content:
        'For $x$ close to $a$, $f(x)\\approx L(x)$ where $L(x)=f(a)+f\'(a)\\,(x-a)$. This $L$ is exactly the equation of the TANGENT LINE to $f$ at $x=a$: near the point of tangency the curve and its tangent agree, so the line\'s value stands in for the function\'s.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why and when it works',
      content:
        'Local linearity: a differentiable function looks straight under enough zoom, so its tangent tracks it well for small $|x-a|$. The approximation DEGRADES as $x$ moves away from $a$ and as the curve bends more sharply — the error is governed by the second derivative, roughly $\\tfrac{1}{2}f\'\'(a)(x-a)^2$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Over- vs. under-estimate from concavity',
      content:
        'The sign of $f\'\'$ decides which way the estimate errs. CONCAVE UP ($f\'\'>0$): the tangent lies BELOW the curve, so $L(x)$ UNDERESTIMATES $f(x)$. CONCAVE DOWN ($f\'\'<0$): the tangent lies ABOVE the curve, so $L(x)$ OVERESTIMATES. Reading concavity at $a$ tells you the direction of the error before computing it.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Differential notation',
      content:
        'The same idea in differentials: $dy=f\'(a)\\,dx$, where $dx$ is a small input change and $dy$ approximates the resulting output change. Then $f(a+dx)\\approx f(a)+dy$. This is just $L$ rewritten with $dx=x-a$ and $dy=L(x)-f(a)$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Connection to Taylor (Unit 10)',
      content:
        'Linearization is the FIRST-ORDER Taylor polynomial of $f$ at $a$: $P_1(x)=f(a)+f\'(a)(x-a)$. Adding a quadratic term $\\tfrac{1}{2}f\'\'(a)(x-a)^2$, then higher-degree terms, produces successively better approximations — the Taylor series developed later in the course.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'linearization (one-line)',
      content:
        '$L(x)=f(a)+f\'(a)\\,(x-a)$ — the tangent-line approximation to $f$ for $x$ near $a$.',
    },
  ],
  methods: [
    {
      title: 'Estimate a function value with a linearization',
      when_to_use:
        'When asked to approximate $f(x)$ (a root, power, or transcendental value) for $x$ near a convenient point where $f$ and $f\'$ are easy.',
      steps: [
        'CHOOSE a base point $a$ near the target $x$ where $f(a)$ and $f\'(a)$ are easy to compute.',
        'COMPUTE $f(a)$ and $f\'(a)$.',
        'FORM $L(x)=f(a)+f\'(a)(x-a)$.',
        'EVALUATE $L$ at the target $x$; report $f(x)\\approx L(x)$.',
        'OPTIONAL: use concavity at $a$ to state whether the estimate is an over- or under-estimate.',
      ],
      example: {
        problem:
          'Estimate $\\sqrt{4.02}$ using a linearization.',
        solution:
          'Take $f(x)=\\sqrt{x}$, $a=4$. Then $f(4)=2$ and $f\'(x)=\\tfrac{1}{2\\sqrt{x}}$, so $f\'(4)=\\tfrac{1}{4}$. Thus $L(x)=2+\\tfrac{1}{4}(x-4)$, and $L(4.02)=2+\\tfrac{1}{4}(0.02)=2.005$. Since $f\'\'<0$ (concave down), this slightly OVERESTIMATES; the true value is about 2.00499.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Predict the direction of the error from concavity',
      when_to_use:
        'When a problem asks whether a tangent-line estimate is too big or too small, or to explain the source of linearization error.',
      steps: [
        'Determine the sign of $f\'\'$ near the base point $a$.',
        'If $f\'\'>0$ (concave up), the tangent is BELOW the curve $\\Rightarrow$ the estimate UNDERSHOOTS.',
        'If $f\'\'<0$ (concave down), the tangent is ABOVE the curve $\\Rightarrow$ the estimate OVERSHOOTS.',
        'Attribute the size of the error to the $\\tfrac{1}{2}f\'\'(a)(x-a)^2$ term: larger $|f\'\'|$ or $|x-a|$ means larger error.',
      ],
      example: {
        problem:
          'For a function $f$ that is concave up near $a$, does the linearization over- or under-estimate $f(x)$, and what controls the error?',
        solution:
          'Concave up means $f\'\'>0$, so the tangent line lies BELOW the curve for $x\\ne a$ nearby — the linearization UNDERESTIMATES $f(x)$. The error is dominated by the second-derivative term $\\tfrac{1}{2}f\'\'(a)(x-a)^2$, which grows with curvature $|f\'\'|$ and with distance $|x-a|$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Anchor the tangent at a point $a$ where $f(a)$ and $f\'(a)$ are EASY (a perfect square, $x=0$, etc.); the whole payoff of linearization is dodging a hard direct computation.', kind: 'tip' },
    { content: 'Concave up $\\Rightarrow$ tangent below curve $\\Rightarrow$ UNDERESTIMATE; concave down $\\Rightarrow$ tangent above $\\Rightarrow$ OVERESTIMATE. Cite the sign of $f\'\'$ to justify the direction on an FRQ.', kind: 'frq-vocab' },
    { content: 'Use $L(x)=f(a)+f\'(a)(x-a)$, NOT $f(a)+f\'(a)\\,x$ — forgetting the $(x-a)$ shift centers the line at the wrong place.', kind: 'common-error' },
    { content: 'The estimate is only trustworthy for SMALL $|x-a|$; far from $a$ (or where $f$ bends sharply) the second-derivative error term blows up.', kind: 'gotcha' },
    { content: 'A perfectly linear $f$ has $f\'\'=0$, so its linearization is EXACT everywhere — the error term vanishes; nonzero error is precisely the curvature the line ignores.', kind: 'edge-case' },
  ],
};
