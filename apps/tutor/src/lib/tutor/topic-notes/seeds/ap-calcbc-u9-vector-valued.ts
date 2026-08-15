/**
 * AP Calculus BC — Unit 9 CED 9.4+9.5+9.6: Vector-Valued Functions and
 * Motion in Two Dimensions.
 *
 * Baseline curated from evelyn.ap.calcbc.vector-valued.v1 to the gold standard
 * set by seeds/ap-calcbc-u1-defining-limits.ts + ap-calcbc-u3-chain-rule.ts:
 * every theory entry carries kind+title, methods are humanized with
 * when_to_use + a worked example, pointers are a kind mix.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\langle, \sqrt, a letter, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.vector-valued';

export const BASELINE_AP_CALCBC_VECTOR_VALUED: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.vector-valued.v1',
  course: 'AP Calculus BC',
  cedUnit: 9,
  cedTopic: '9.4-9.6',
  cedTitle: 'Vector-Valued Functions',
  planId: 'evelyn.ap.calcbc.vector-valued.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.vector-valued.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Vector-valued function',
      content:
        'A VECTOR-VALUED function $\\mathbf{r}(t) = \\langle x(t),\\, y(t)\\rangle$ gives the POSITION of a point in the plane at time $t$. Differentiation and integration act COMPONENT-WISE: you handle the $x$-component and $y$-component independently.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Velocity, acceleration, and speed',
      content:
        'VELOCITY is $\\mathbf{v}(t) = \\mathbf{r}\'(t) = \\langle x\'(t),\\, y\'(t)\\rangle$ (a vector). ACCELERATION is $\\mathbf{a}(t) = \\mathbf{r}\'\'(t) = \\langle x\'\'(t),\\, y\'\'(t)\\rangle$ (a vector). SPEED is the MAGNITUDE $|\\mathbf{v}(t)| = \\sqrt{\\big(x\'(t)\\big)^2 + \\big(y\'(t)\\big)^2}$ (a scalar).',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Recovering position from velocity',
      content:
        'Integrate component-wise: $\\mathbf{r}(t) = \\mathbf{r}(t_0) + \\displaystyle\\int_{t_0}^{t} \\mathbf{v}(\\tau)\\,d\\tau$. Concretely $x(t) = x(t_0) + \\displaystyle\\int_{t_0}^{t} x\'(\\tau)\\,d\\tau$, and likewise for $y$. The initial position $\\mathbf{r}(t_0)$ supplies the constant of integration.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Total distance vs. displacement',
      content:
        'TOTAL DISTANCE traveled on $[a, b]$ is $\\displaystyle\\int_a^b |\\mathbf{v}(t)|\\,dt = \\displaystyle\\int_a^b \\sqrt{(x\')^2 + (y\')^2}\\,dt$ (a nonnegative scalar — same integrand as parametric arc length). DISPLACEMENT is the VECTOR $\\mathbf{r}(b) - \\mathbf{r}(a)$, the straight-line change from start to end.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Vector vs. scalar — keep them straight',
      content:
        'Velocity, acceleration, position, and displacement are VECTORS (report both components, in $\\langle\\ ,\\ \\rangle$). Speed and total distance are SCALARS (single nonnegative numbers). "How fast" $\\Rightarrow$ speed; "in what direction / where" $\\Rightarrow$ vector.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'speed (one-line)',
      content: 'the magnitude of velocity, $|\\mathbf{v}(t)| = \\sqrt{(x\')^2 + (y\')^2}$ — a scalar, never negative.',
    },
  ],
  methods: [
    {
      title: 'Find velocity, speed, and acceleration from position',
      when_to_use:
        'Given $\\mathbf{r}(t) = \\langle x(t), y(t)\\rangle$ and asked for $\\mathbf{v}$, speed, or $\\mathbf{a}$ at a time.',
      steps: [
        'Differentiate each component: $\\mathbf{v}(t) = \\langle x\'(t),\\, y\'(t)\\rangle$.',
        'Differentiate again for acceleration: $\\mathbf{a}(t) = \\langle x\'\'(t),\\, y\'\'(t)\\rangle$.',
        'For speed, compute $|\\mathbf{v}(t)| = \\sqrt{(x\')^2 + (y\')^2}$.',
        'Substitute the requested time LAST.',
      ],
      example: {
        problem: 'A particle has $\\mathbf{r}(t) = \\langle t^2,\\, 2t\\rangle$ for $t \\ge 0$. Find $\\mathbf{v}(t)$, the speed at $t = 2$, and $\\mathbf{a}(t)$.',
        solution:
          '$\\mathbf{v}(t) = \\langle 2t,\\, 2\\rangle$. Speed $= \\sqrt{(2t)^2 + 4} = \\sqrt{4t^2 + 4} = 2\\sqrt{t^2 + 1}$; at $t = 2$, $|\\mathbf{v}| = 2\\sqrt{5}$. Acceleration $\\mathbf{a}(t) = \\langle 2,\\, 0\\rangle$ (constant, purely horizontal).',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Recover position from velocity and an initial point',
      when_to_use:
        'Given $\\mathbf{v}(t)$ and $\\mathbf{r}(t_0)$ and asked for $\\mathbf{r}(t)$ (or a specific position).',
      steps: [
        'Integrate each velocity component to get an antiderivative.',
        'Use $\\mathbf{r}(t) = \\mathbf{r}(t_0) + \\displaystyle\\int_{t_0}^{t} \\mathbf{v}(\\tau)\\,d\\tau$ so the bounds carry the initial condition automatically.',
        'Evaluate the definite integral for each component.',
        'Assemble the components into $\\langle x(t),\\, y(t)\\rangle$.',
      ],
      example: {
        problem: 'A particle has $\\mathbf{v}(t) = \\langle \\cos t,\\, \\sin t\\rangle$ and $\\mathbf{r}(0) = \\langle 0, 0\\rangle$. Find $\\mathbf{r}(t)$.',
        solution:
          '$\\mathbf{r}(t) = \\langle 0, 0\\rangle + \\left\\langle \\displaystyle\\int_0^t \\cos\\tau\\,d\\tau,\\ \\displaystyle\\int_0^t \\sin\\tau\\,d\\tau\\right\\rangle = \\langle \\sin t,\\ 1 - \\cos t\\rangle$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Distinguish total distance from displacement',
      when_to_use:
        'Asked for BOTH how far a 2D particle travels and its net change in position.',
      steps: [
        'DISPLACEMENT: integrate each velocity component over $[a, b]$ to get the vector $\\langle \\int_a^b x\'\\,dt,\\ \\int_a^b y\'\\,dt\\rangle = \\mathbf{r}(b) - \\mathbf{r}(a)$.',
        'TOTAL DISTANCE: compute the speed $|\\mathbf{v}(t)| = \\sqrt{(x\')^2 + (y\')^2}$.',
        'Integrate the speed over $[a, b]$; this is a nonnegative scalar.',
        'Report displacement as a vector and total distance as a number — they are different.',
      ],
      example: {
        problem: 'A particle has $\\mathbf{v}(t) = \\langle 2\\sin t,\\, 2\\cos t\\rangle$ on $[0, \\tfrac{\\pi}{2}]$. Find the total distance traveled.',
        solution:
          'Speed $= \\sqrt{(2\\sin t)^2 + (2\\cos t)^2} = \\sqrt{4} = 2$ (constant). Total distance $= \\displaystyle\\int_0^{\\pi/2} 2\\,dt = \\pi$ — the particle moves at constant speed $|\\mathbf{v}| = 2$ along a circular arc.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Speed is a SCALAR $|\\mathbf{v}| = \\sqrt{(x\')^2 + (y\')^2}$; velocity is a VECTOR $\\langle x\', y\'\\rangle$. Reporting one when the prompt wants the other is the classic 2D-motion error.', kind: 'common-error' },
    { content: 'Total distance uses $\\displaystyle\\int |\\mathbf{v}|\\,dt$ (always $\\ge 0$); displacement uses $\\mathbf{r}(b) - \\mathbf{r}(a)$ (can have negative or zero components). Never substitute one for the other.', kind: 'gotcha' },
    { content: 'On the "particle in the $xy$-plane" FRQ, "the position at time $b$" wants $\\mathbf{r}(a) + \\int_a^b \\mathbf{v}\\,dt$ — set up the integral WITH the initial position, not just an antiderivative.', kind: 'frq-vocab' },
    { content: 'Acceleration is $\\mathbf{r}\'\'$, the derivative of VELOCITY — not the derivative of speed. The magnitude of acceleration and the rate of change of speed are different quantities.', kind: 'edge-case' },
    { content: 'Because the distance integrand equals the parametric-arc-length integrand, any speed simplification (e.g. Pythagorean identity) carries straight over from Unit 9.3.', kind: 'tip' },
  ],
};
