/**
 * AP Calculus BC — Unit 5 CED 5.10+5.11: Optimization problems — modeling a
 * real-world quantity, reducing to one variable via a constraint, and finding
 * the extremum with critical points.
 *
 * Baseline curated from evelyn.ap.calcbc.optimization.v1 to the gold standard
 * set by seeds/ap-calcbc-u1-defining-limits.ts +
 * seeds/ap-calcbc-u3-chain-rule.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (a letter, \dfrac, a sign, or "=").
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.optimization';

export const BASELINE_AP_CALCBC_OPTIMIZATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.optimization.v1',
  course: 'AP Calculus BC',
  cedUnit: 5,
  cedTopic: '5.10-5.11',
  cedTitle: 'Optimization Problems',
  planId: 'evelyn.ap.calcbc.optimization.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.optimization.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'objective and constraint',
      content:
        'The OBJECTIVE FUNCTION is the quantity to be maximized or minimized (area, volume, cost, distance, profit). A CONSTRAINT is an equation relating the variables; it is used to eliminate variables so the objective becomes a function of a SINGLE variable.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The optimization recipe',
      content:
        'Standard workflow: (1) IDENTIFY what to optimize; (2) NAME variables and draw a picture; (3) WRITE the objective; (4) USE the constraint to reduce to one variable; (5) DETERMINE the physical DOMAIN; (6) find CRITICAL POINTS via the derivative $= 0$; (7) VERIFY min vs. max with a derivative test or the Candidates Test; (8) ANSWER exactly what is asked.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Verifying the optimum',
      content:
        'A critical point is not automatically the desired extreme. Confirm it: the FIRST DERIVATIVE TEST (sign change of the objective\'s derivative), the SECOND DERIVATIVE TEST ($<0$ for a max, $>0$ for a min), or the CANDIDATES TEST if the domain is a closed interval (compare critical points against endpoints).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Watch the domain and boundaries',
      content:
        'Variables must be physically meaningful — lengths, areas, and volumes satisfy $x \\ge 0$, and the constraint may cap the range further. Sometimes the optimum sits on the BOUNDARY of the domain rather than at an interior critical point, so always check the endpoints.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Common problem types',
      content:
        'Recurring setups: maximize AREA for a fixed perimeter ($P = 2L + 2W$, $A = LW$); optimize BOX volume or surface area; MINIMIZE DISTANCE from a point to a curve (minimize the squared distance to avoid the root); maximize PROFIT $= $ revenue $-$ cost. For a closed cylinder of fixed volume, minimum surface area occurs when $h = 2r$.',
    },
  ],
  methods: [
    {
      title: 'Solve an optimization word problem end to end',
      when_to_use:
        'Any "largest / smallest / cheapest / closest" problem giving a scenario, a quantity to optimize, and a constraint.',
      steps: [
        'IDENTIFY the objective (what to maximize or minimize) and NAME the variables; sketch the figure.',
        'WRITE the objective function and the CONSTRAINT equation.',
        'Solve the constraint for one variable and SUBSTITUTE to make the objective a function of ONE variable; state its DOMAIN.',
        'Differentiate, set the derivative $= 0$, and solve for the CRITICAL POINT(S) inside the domain.',
        'VERIFY it is the intended extreme (first/second derivative test or endpoints), then ANSWER the exact question (dimensions and/or optimal value).',
      ],
      example: {
        problem:
          'A farmer has 200 ft of fencing to enclose a rectangular field along a straight river (no fence needed on the river side). Maximize the area.',
        solution:
          'Let $x$ be the depth perpendicular to the river and $y$ the length parallel to it. Only three sides are fenced: $y + 2x = 200$, so $y = 200 - 2x$. Objective $A = xy = x(200 - 2x) = 200x - 2x^2$ on $x \\in [0, 100]$. Then $A\'(x) = 200 - 4x = 0$ gives $x = 50$; $A\'\'(x) = -4 < 0$ confirms a max. So $y = 100$ and $A = 5000$ sq ft.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Optimize with a geometric (area/volume) constraint',
      when_to_use:
        'When a fixed volume or surface area (or an inscribed-figure condition) links two dimensions and you optimize the other quantity.',
      steps: [
        'Write BOTH the objective and the geometric constraint (e.g. $V = \\pi r^2 h$, $SA = 2\\pi r^2 + 2\\pi r h$).',
        'Solve the constraint for one dimension and substitute so the objective depends on ONE variable.',
        'Differentiate, set $= 0$, and solve; simplify the resulting equation carefully.',
        'Confirm min/max via the second derivative and back-substitute to recover every requested dimension.',
      ],
      example: {
        problem:
          'Find the dimensions of a closed cylindrical can of fixed volume $V = 1000$ cm³ that MINIMIZE surface area, where $SA = 2\\pi r^2 + 2\\pi r h$.',
        solution:
          'Constraint $\\pi r^2 h = 1000$ gives $h = \\dfrac{1000}{\\pi r^2}$. Substituting, $SA(r) = 2\\pi r^2 + \\dfrac{2000}{r}$. Then $SA\'(r) = 4\\pi r - \\dfrac{2000}{r^2} = 0 \\Rightarrow r^3 = \\dfrac{500}{\\pi} \\Rightarrow r = \\left(\\dfrac{500}{\\pi}\\right)^{1/3} \\approx 5.42$ cm, and $h \\approx 10.84$ cm. Since $SA\'\'(r) > 0$ this is a minimum, and note $h \\approx 2r$ — the optimal can\'s height equals its diameter.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'You cannot differentiate a two-variable objective — always USE the constraint to reduce to ONE variable first.', kind: 'common-error' },
    { content: 'State the DOMAIN and check the endpoints: the optimum can lie on the boundary, and the Candidates Test settles it on a closed interval.', kind: 'gotcha' },
    { content: 'For minimum-distance problems, minimize the SQUARED distance $d^2$ — same minimizer, but no square root to differentiate.', kind: 'tip' },
    { content: 'Answer exactly what is asked: sometimes the optimal $x$, sometimes the optimal VALUE, often BOTH — re-read the prompt before finishing.', kind: 'frq-vocab' },
    { content: 'Always justify the extremum (sign change, $SA\'\' > 0$, or endpoints). An unjustified critical point loses the verification point on an FRQ.', kind: 'edge-case' },
  ],
};
