/**
 * AP Calculus BC — Unit 7 CED 7.5: Approximating Solutions Using Euler's
 * Method (BC only).
 *
 * Baseline curated from evelyn.ap.calcbc.eulers-method.v1 to the gold standard
 * set by seeds/ap-calcbc-u1-defining-limits.ts and
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

const LO = 'apcalcbc.eulers-method';

export const BASELINE_AP_CALCBC_EULERS_METHOD: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.eulers-method.v1',
  course: 'AP Calculus BC',
  cedUnit: 7,
  cedTopic: '7.5',
  cedTitle: "Euler's Method (BC)",
  planId: 'evelyn.ap.calcbc.eulers-method.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.eulers-method.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: "Euler's method iteration",
      content:
        'Given $\\dfrac{dy}{dx} = f(x, y)$, an initial point $(x_0, y_0)$, and a step size $h$, Euler\'s method steps forward by $x_{n+1} = x_n + h$ and $y_{n+1} = y_n + h\\,f(x_n, y_n)$. Each new $y$ is the old $y$ plus (step size) $\\times$ (current slope).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Tangent-line interpretation',
      content:
        'At the current point the DE gives the slope $f(x_n, y_n)$; Euler follows that TANGENT LINE a horizontal distance $h$ to land at the next point, then recomputes the slope and repeats. It is repeated LOCAL LINEARIZATION — the numerical answer to a DE you cannot (or need not) solve exactly.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Reaching a target x-value',
      content:
        'To estimate $y$ at $x = X$ from $(x_0, y_0)$, choose the number of steps $n$ so that $X = x_0 + n h$, i.e. $n = \\dfrac{X - x_0}{h}$, then iterate $n$ times. Keep a running table of $(x_n, y_n)$ and the slope $f(x_n, y_n)$ used at each step — this is exactly the FRQ-expected work.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Accuracy and step size',
      content:
        'Euler ignores curvature between grid points, so it carries error. The error introduced per step scales like $h^{2}$, and the accumulated (global) error over a fixed interval scales like $h$. Halving $h$ roughly halves the total error — a smaller step is more accurate but takes more iterations.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Under- vs. overestimate from concavity',
      content:
        'Because each step rides a tangent line, Euler UNDERESTIMATES where the true solution is CONCAVE UP ($y\'\' > 0$, tangent lies below the curve) and OVERESTIMATES where it is CONCAVE DOWN ($y\'\' < 0$). Find $y\'\'$ by differentiating the DE; its sign along the path settles the direction of the error.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: "Euler's method (one-line)",
      content: 'a numerical DE solver: $y_{n+1} = y_n + h\\,f(x_n, y_n)$, stepping along tangent lines.',
    },
  ],
  methods: [
    {
      title: "Run Euler's method to a target x",
      when_to_use:
        'When a DE and initial condition are given and you must APPROXIMATE $y$ at a specific $x$ with a stated step size $h$.',
      steps: [
        'Count the steps: $n = \\dfrac{X - x_0}{h}$.',
        'At the current $(x_n, y_n)$ compute the slope $m = f(x_n, y_n)$.',
        'Update: $y_{n+1} = y_n + h\\,m$ and $x_{n+1} = x_n + h$.',
        'Repeat until $x = X$; the last $y$ is the approximation. Show every step in a table.',
      ],
      example: {
        problem: 'Approximate $y(2)$ for $\\dfrac{dy}{dx} = x + y$, $y(0) = 1$, using $h = 0.5$.',
        solution:
          'Four steps. $(0, 1)$: slope $= 1$, $y = 1 + 0.5(1) = 1.5$. $(0.5, 1.5)$: slope $= 2$, $y = 1.5 + 0.5(2) = 2.5$. $(1, 2.5)$: slope $= 3.5$, $y = 2.5 + 0.5(3.5) = 4.25$. $(1.5, 4.25)$: slope $= 5.75$, $y = 4.25 + 0.5(5.75) = 7.125$. So $y(2) \\approx 7.125$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Decide whether an Euler estimate is an under- or overestimate',
      when_to_use:
        'When a follow-up asks whether your approximation is too big or too small, with justification.',
      steps: [
        'Differentiate the DE to get $y\'\'$ (use the chain/product rules on $f(x, y)$, substituting $y\' = f$).',
        'Determine the SIGN of $y\'\'$ along the stepping interval.',
        'Concave up ($y\'\' > 0$) $\\Rightarrow$ tangents below the curve $\\Rightarrow$ Euler UNDERESTIMATES; concave down $\\Rightarrow$ OVERESTIMATES.',
        'State the concavity and the resulting direction of the error.',
      ],
      example: {
        problem: 'For $\\dfrac{dy}{dx} = y$, $y(0) = 1$, Euler with $h = 0.5$ gives $y(1) \\approx 2.25$. Under- or overestimate?',
        solution:
          'The exact solution is $y = e^{x}$, so $y(1) = e \\approx 2.718$ — the estimate is LOW. Justify structurally: $y\'\' = y\' = y > 0$, so the curve is concave up and the tangent lines lie below it, making Euler an UNDERESTIMATE.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Use the slope at the CURRENT point $f(x_n, y_n)$ for the step you are about to take — do not update $x$ before computing the slope.', kind: 'common-error' },
    { content: 'Show the table: each row lists $x_n$, $y_n$, the slope $f(x_n, y_n)$, and $y_{n+1}$. FRQ readers want the intermediate steps, not just the final number.', kind: 'frq-vocab' },
    { content: 'Concave up along the path $\\Rightarrow$ underestimate; concave down $\\Rightarrow$ overestimate. Get concavity from the SIGN of $y\'\'$, not from guessing.', kind: 'tip' },
    { content: 'A given step size that does not divide $X - x_0$ evenly means your last landing is not at $X$ — re-read $h$ and $n$ before iterating.', kind: 'gotcha' },
    { content: 'Euler is only first-order accurate ($O(h)$ global error); even with small $h$ it is an approximation, not the exact solution, so never present it as exact.', kind: 'edge-case' },
  ],
};
