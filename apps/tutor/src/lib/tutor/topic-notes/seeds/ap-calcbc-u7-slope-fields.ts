/**
 * AP Calculus BC — Unit 7 CED 7.3–7.4: Sketching Slope Fields and Reasoning
 * Using Slope Fields.
 *
 * Baseline curated from evelyn.ap.calcbc.slope-fields.v1 to the gold standard
 * set by seeds/ap-calcbc-u1-defining-limits.ts and
 * seeds/ap-calcbc-u3-chain-rule.ts: every theory entry carries kind+title,
 * methods are humanized with when_to_use + a worked example, pointers are a
 * kind mix (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * Carries a slope_field diagram (dy/dx = y with the integral curve y = e^x
 * through (0, 1)); params match solveSlopeField's samples/[x,y,slope] shape.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe
 * renderer), so any span opens with a non-digit (\dfrac, a letter, a sign).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.slope-fields';

export const BASELINE_AP_CALCBC_SLOPE_FIELDS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.slope-fields.v1',
  course: 'AP Calculus BC',
  cedUnit: 7,
  cedTopic: '7.3-7.4',
  cedTitle: 'Slope Fields',
  planId: 'evelyn.ap.calcbc.slope-fields.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.slope-fields.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Slope field (direction field)',
      content:
        'A SLOPE FIELD is the graphical portrait of a DE $\\dfrac{dy}{dx} = f(x, y)$: at a grid of points $(x, y)$ you draw a short segment whose slope equals $f(x, y)$. The picture shows the DIRECTION every solution curve must travel through each point, so the whole FAMILY of solutions appears at once.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Constructing a slope field by hand',
      content:
        'Pick a lattice of points $(x, y)$. At each, evaluate $f(x, y)$ to get the slope, then draw a small dash with that slope (steeper for larger $|f|$, horizontal where $f = 0$, and effectively vertical where $f$ is undefined). You are NOT plotting points of a curve — you are seeding tangent directions.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Reading structure from the dependence of f',
      content:
        'If $\\dfrac{dy}{dx} = f(x)$ depends on $x$ only, the field forms VERTICAL COLUMNS of identical slopes (same in every row). If $\\dfrac{dy}{dx} = g(y)$ depends on $y$ only, it forms HORIZONTAL ROWS of identical slopes. If it depends on both, slopes vary in every direction. This is the fastest way to MATCH a DE to a field.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Tracing a solution curve through a point',
      content:
        'A solution through an initial point $(x_0, y_0)$ is a curve that is TANGENT to the field everywhere: start at $(x_0, y_0)$ and move so your direction always matches the nearby segments. For $\\dfrac{dy}{dx} = y$ through $(0, 1)$ the traced curve is $y = e^{x}$ — verify: $\\dfrac{dy}{dx} = e^{x} = y$.',
      diagram: {
        type: 'slope_field',
        params: {
          title: 'Slope field for dy/dx = y with solution y = e^x through (0, 1)',
          exprLabel: 'dy/dx = y',
          xMin: -2.5,
          xMax: 2.5,
          yMin: -2.5,
          yMax: 3,
          highlightPoint: { x: 0, y: 1 },
          // samples: [x, y, slope] with slope = y (depends on y only → rows)
          samples: [
            [-2, -2, -2], [-1, -2, -2], [0, -2, -2], [1, -2, -2], [2, -2, -2],
            [-2, -1, -1], [-1, -1, -1], [0, -1, -1], [1, -1, -1], [2, -1, -1],
            [-2, 0, 0], [-1, 0, 0], [0, 0, 0], [1, 0, 0], [2, 0, 0],
            [-2, 1, 1], [-1, 1, 1], [0, 1, 1], [1, 1, 1], [2, 1, 1],
            [-2, 2, 2], [-1, 2, 2], [0, 2, 2], [1, 2, 2], [2, 2, 2],
          ],
          solutionCurve: [
            [-2, 0.135], [-1.5, 0.223], [-1, 0.368], [-0.5, 0.607],
            [0, 1], [0.5, 1.649], [1, 2.718],
          ],
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Equilibria and asymptotic behavior',
      content:
        'Where $f(x, y) = 0$ the segments are horizontal — constant (EQUILIBRIUM) solutions. An equilibrium is ATTRACTING if nearby slopes point toward it and REPELLING if they point away. For $\\dfrac{dy}{dx} = -y$, $y = 0$ is attracting (solutions $y = Ce^{-x}$ decay to it); for $\\dfrac{dy}{dx} = y$, $y = 0$ is repelling.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'slope field (one-line)',
      content: 'a grid of short segments with slope $f(x, y)$ at each $(x, y)$; solution curves flow tangent to it.',
    },
  ],
  methods: [
    {
      title: 'Match a differential equation to its slope field',
      when_to_use:
        'Multiple-choice items showing several fields (or several DEs) and asking which pair up.',
      steps: [
        'Test $x$-dependence: are the slopes the same down each vertical column? If yes, $\\dfrac{dy}{dx}$ depends on $x$ only.',
        'Test $y$-dependence: are the slopes the same across each horizontal row? If yes, it depends on $y$ only.',
        'Locate the ZERO-slope (horizontal) segments — set $f = 0$ and see which DE has equilibria there.',
        'Check a couple of SIGNS: pick one point, compute $f$, and confirm the segment tilts the right way (up for positive, down for negative).',
      ],
      example: {
        problem: 'A field has horizontal segments exactly along the $x$-axis, tilting up above it and down below it, with steepness growing away from the axis. Which DE?',
        solution:
          'Horizontal on $y = 0$ and steeper as $|y|$ grows means the slope tracks $y$: $\\dfrac{dy}{dx} = y$. Above the axis ($y > 0$) slopes are positive (up); below, negative (down) — consistent, so $\\dfrac{dy}{dx} = y$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Sketch a solution curve through a given point',
      when_to_use:
        'When a field is provided with an initial condition and you must draw the particular solution.',
      steps: [
        'MARK the initial point $(x_0, y_0)$.',
        'From that point, draw a short curve MATCHING the local segment direction.',
        'Continue in both directions, continuously re-aligning to the nearest segments; keep the curve TANGENT to the field, never crossing an equilibrium line.',
        'Sanity-check end behavior against the field (toward an attractor, away from a repeller, or unbounded).',
      ],
      example: {
        problem: 'On the field for $\\dfrac{dy}{dx} = y$, sketch the solution through $(0, 1)$.',
        solution:
          'Starting at $(0, 1)$ with slope $= 1$, the curve rises ever more steeply to the right and flattens toward $y = 0$ on the left — the exponential $y = e^{x}$, which never touches the equilibrium $y = 0$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'A slope field shows DIRECTIONS, not a single curve — do not "connect the dashes." Each solution is one curve flowing tangent to the whole field.', kind: 'common-error' },
    { content: 'To match fast: same slopes down a column $\\Rightarrow$ $\\dfrac{dy}{dx} = f(x)$; same slopes across a row $\\Rightarrow$ $\\dfrac{dy}{dx} = g(y)$.', kind: 'tip' },
    { content: 'Horizontal segments mark where $f(x, y) = 0$ — candidate EQUILIBRIUM (constant) solutions. Classify them as attracting or repelling from the nearby tilt.', kind: 'frq-vocab' },
    { content: 'Solution curves cannot cross an equilibrium line (uniqueness) — a traced curve approaches it asymptotically but never touches it.', kind: 'edge-case' },
    { content: 'Where $f$ is undefined (e.g. $\\dfrac{dy}{dx} = \\dfrac{x}{y}$ at $y = 0$) the segments go vertical or are absent — do not read those as slope $= 0$.', kind: 'gotcha' },
  ],
};
