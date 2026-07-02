/**
 * AP Calculus BC — Unit 2 CED 2.1+2.2: Defining the Derivative and Using
 * Derivative Notation.
 *
 * Curated from evelyn.ap.calcbc.derivative-definition.v1 to the standard set by
 * seeds/ap-calcbc-u1-defining-limits.ts: every theory entry carries kind+title,
 * methods carry when_to_use + a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so every $...$ opens with a non-digit (a command, a variable, or a sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.derivative-definition';

export const BASELINE_AP_CALCBC_DERIVATIVE_DEFINITION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.derivative-definition.v1',
  course: 'AP Calculus BC',
  cedUnit: 2,
  cedTopic: '2.1-2.2',
  cedTitle: 'The Derivative — Definition and Notation',
  planId: 'evelyn.ap.calcbc.derivative-definition.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.derivative-definition.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Derivative at a point — h-form',
      content:
        'The derivative of $f$ at $x=a$ is $f\'(a) = \\lim_{h\\to 0} \\dfrac{f(a+h)-f(a)}{h}$, when this limit exists (as a finite real). Here $h$ is the small offset from $a$. This is the instantaneous rate of change of $f$ at $a$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Derivative at a point — x-form',
      content:
        'An equivalent form is $f\'(a) = \\lim_{x\\to a} \\dfrac{f(x)-f(a)}{x-a}$. It is the same object as the h-form (just rename $h = x-a$, so $x\\to a$ becomes $h\\to 0$). AP problems use both — you should recognize each as a derivative.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'difference quotient',
      content:
        'The difference quotient $\\dfrac{f(x+h)-f(x)}{h}$ is the slope of the SECANT line through $(x,f(x))$ and $(x+h, f(x+h))$. The derivative is the limit of these secant slopes as $h\\to 0$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Geometric & physical meaning',
      content:
        'Geometrically, $f\'(a)$ is the SLOPE OF THE TANGENT LINE to $y=f(x)$ at $x=a$ — the limit of secant slopes as the second point slides into the first. Physically, if $s(t)$ is position then $s\'(t)$ is velocity; more generally $f\'(a)$ is the rate of change of $f$ per unit input at $a$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Notation — three equivalent forms',
      content:
        'LAGRANGE: $f\'(x)$, $f\'(a)$ (most common on the AP exam). LEIBNIZ: $\\dfrac{dy}{dx}$, $\\dfrac{df}{dx}$, or $\\left.\\dfrac{df}{dx}\\right|_{x=a}$ (emphasizes "rate of change with respect to $x$"; handy for chain rule and differential equations). NEWTON: $\\dot{y}$ (physics; rare in AP). All three name the same object.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'When the derivative fails to exist',
      content:
        'The defining limit need not exist at every point. $f\'(a)$ DNE if $f$ is not continuous at $a$, or the graph has a corner/cusp, or the tangent is vertical (slope $\\pm\\infty$). Formalized in CED 2.4 (differentiability vs. continuity).',
    },
  ],
  methods: [
    {
      title: 'Compute f\'(a) from the limit definition (h-form)',
      when_to_use:
        'When asked to find a derivative "using the definition" (no shortcut rules), or to prove a specific derivative value from first principles.',
      steps: [
        'Write the h-form: $f\'(a) = \\lim_{h\\to 0} \\dfrac{f(a+h)-f(a)}{h}$.',
        'Expand and simplify the numerator $f(a+h)-f(a)$ — every surviving term should contain a factor of $h$.',
        'Divide the numerator by $h$ (the $h$ that made it an indeterminate $\\tfrac{0}{0}$ form cancels).',
        'Take the limit $h\\to 0$ by direct substitution of the simplified expression.',
        'State $f\'(a)$; optionally sanity-check against the power/sum rules from CED 2.5.',
      ],
      example: {
        problem: 'Use the limit definition to find $f\'(2)$ for $f(x) = x^2 + 3x$.',
        solution:
          '$f(2+h) = (2+h)^2 + 3(2+h) = 4 + 4h + h^2 + 6 + 3h = 10 + 7h + h^2$ and $f(2) = 10$. Numerator $= 7h + h^2$; divide by $h$ to get $h + 7$. Then $\\lim_{h\\to 0}(7+h) = 7$, so $f\'(2) = 7$. (Check via rules: $f\'(x)=2x+3$, $f\'(2)=7$.)',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Recognize a limit as a derivative and read off f and a',
      when_to_use:
        'When a limit "in disguise" is really $f\'(a)$ — common on MCQ where evaluating directly is hard but naming the derivative is easy.',
      steps: [
        'Match the h-form: if you see $\\lim_{h\\to 0}\\dfrac{g(a+h)-g(a)}{h}$, the value is $g\'(a)$ — identify $g$ from $g(a+h)$ and $a$ from the constant $g(a)$.',
        'Match the x-form: if you see $\\lim_{x\\to a}\\dfrac{g(x)-g(a)}{x-a}$, read $a$ off where the denominator vanishes.',
        'Compute $g\'$ with known rules, then evaluate at $a$.',
      ],
      example: {
        problem: 'Evaluate $\\lim_{h\\to 0} \\dfrac{(2+h)^3 - 8}{h}$.',
        solution:
          'Here $g(2+h) = (2+h)^3$ and $g(2) = 8 = 2^3$, so $g(x) = x^3$ at $a=2$. Thus the limit is $g\'(2)$. Since $g\'(x) = 3x^2$, the value is $g\'(2) = 3\\cdot 4 = 12$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'The derivative is a LIMIT of secant slopes, not just a formula: if the limit fails, $f\'(a)$ does not exist even when the algebra "looks fine."', kind: 'tip' },
    { content: 'On an FRQ, say "$f\'(a)$ is the instantaneous rate of change of $f$ with respect to $x$ at $x=a$" and give correct UNITS (units of $f$ per unit of $x$).', kind: 'frq-vocab' },
    { content: 'When simplifying $\\dfrac{f(a+h)-f(a)}{h}$, expect every numerator term to carry a factor of $h$ so it cancels — a leftover constant means an algebra slip.', kind: 'common-error' },
    { content: 'The h-form and x-form are the SAME derivative; substituting $h=x-a$ converts one into the other. Recognize both on sight.', kind: 'gotcha' },
    { content: 'A limit of the form $\\lim_{h\\to 0}\\dfrac{g(a+h)-g(a)}{h}$ is $g\'(a)$ — you can evaluate it by differentiating $g$ instead of doing the limit directly.', kind: 'edge-case' },
  ],
};
