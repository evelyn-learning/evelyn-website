/**
 * AP Calculus BC — Unit 1 CED 1.9: Connecting Multiple Representations
 * of Limits.
 *
 * Baseline notes hand-curated from the source plan
 * evelyn.ap.calcbc.limits-representations.v1 to the standard set by
 * seeds/ap-calcbc-u1-defining-limits.ts (the calibration reference):
 * every theory entry carries kind+title, methods are humanized with
 * when_to_use + a worked example, pointers are a kind mix
 * (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe
 * renderer), so values/bounds open with a non-digit (\lim, a variable).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.limits-representations';

export const BASELINE_AP_CALCBC_LIMITS_REPRESENTATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.limits-representations.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.9',
  cedTitle: 'Connecting Multiple Representations of Limits',
  planId: 'evelyn.ap.calcbc.limits-representations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.limits-representations.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'The three representations of a limit',
      content:
        'One limit $\\lim_{x\\to a} f(x)$ wears three costumes: (1) GRAPHICAL — trace the curve as $x\\to a$ from each side and see what height $y$ it heads toward; (2) NUMERICAL — a TABLE of $f(x)$ for $x$ creeping toward $a$ (e.g. $x=1.9,\\,1.99,\\,1.999$ and $x=2.1,\\,2.01,\\,2.001$); (3) ANALYTICAL — an algebraic rule for $f(x)$ evaluated via substitution, factoring, or manipulation.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The core principle — approach, not value at a',
      content:
        'Every representation reports the value $f(x)$ APPROACHES near $a$, not the value $f(a)$ actually is. The function may be undefined at $a$ or take a different value there (a hole or a jump) without changing the limit. All three costumes describe the same approach.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'One-sided limits in each form',
      content:
        'GRAPH: approach from the left ($x\\to a^-$) by tracing the curve from the left, from the right ($x\\to a^+$) by tracing from the right. TABLE: rows with $x$ BELOW $a$ give the left limit, rows ABOVE $a$ give the right limit. ANALYTICAL: piecewise rules or sign analysis (e.g. for $\\tfrac{1}{x-a}$) give each side.',
    },
    {
      loId: LO,
      kind: 'theorem',
      title: 'Existence rule',
      content:
        '$\\lim_{x\\to a} f(x)$ EXISTS $\\iff$ the left-hand limit and the right-hand limit are both finite and equal. If the two sides disagree, the two-sided limit DOES NOT EXIST (DNE), even though each one-sided limit may exist on its own.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'What DNE looks like in each form',
      content:
        'JUMP: the graph leaps between two heights / the table settles on two different values from the two sides. UNBOUNDED (vertical asymptote): the graph shoots to $\\pm\\infty$ / the table values grow without bound. OSCILLATION: the graph wiggles infinitely fast (e.g. $\\sin\\!\\left(\\tfrac{1}{x}\\right)$) / the table never settles.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Consistency check — and why tables can mislead',
      content:
        'The AP move: given any two representations, confirm they tell the same story — a table heading to $L$ should match a graph approaching height $L$ and algebra simplifying to $L$. Caution: a table samples only finitely many points, so a fast-oscillating function can look deceptively "settled." Treat a table as ESTIMATION evidence, confirmed by graph or algebra when available.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'one-sided limit',
      content: 'the value $f(x)$ approaches as $x\\to a$ from a single side — the left ($x\\to a^-$) or the right ($x\\to a^+$).',
    },
  ],
  methods: [
    {
      title: 'Translate a limit across graph, table, and algebra',
      when_to_use:
        'When a problem gives you one representation of $\\lim_{x\\to a} f(x)$ and asks you to predict or confirm another, or to decide whether the limit exists.',
      steps: [
        'Identify which representation you are given (graph, table, or algebraic rule) and read the limit from it, tracking the left and right sides separately.',
        'Apply the existence rule: if the two one-sided values agree, the two-sided limit is that shared value; if they disagree, it DNE.',
        'Predict the other representations: an analytical limit $L$ means the table marches to $L$ from both sides and the graph approaches height $L$.',
        'Cross-check for consistency; if a representation seems to disagree, suspect a hole, a jump, or a misread of which side you are on.',
      ],
      example: {
        problem:
          'For $f(x)=\\dfrac{x^2-4}{x-2}$: (a) find $\\lim_{x\\to 2} f(x)$ analytically, (b) predict what $f(1.99)$ and $f(2.01)$ show in a table, and (c) describe the graph at $x=2$.',
        solution:
          '(a) Factor and cancel: $\\dfrac{x^2-4}{x-2}=\\dfrac{(x-2)(x+2)}{x-2}=x+2$ for $x\\ne 2$, so $\\lim_{x\\to 2} f(x)=2+2=4$. (b) Since $f(x)=x+2$ away from $x=2$, $f(1.99)\\approx 3.99$ and $f(2.01)\\approx 4.01$ — both sides march to 4, confirming the algebra. (c) The graph is the line $y=x+2$ with a HOLE (open circle) at $(2,4)$, because the original $f$ is undefined at $x=2$ ($\\tfrac{0}{0}$). All three representations agree on the limit value 4; they differ only in how they display the hole.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Fluency across the three costumes is what separates a 5 from a 3: see a table and picture the graph; see a graph and predict the algebra. They must all agree on the same limit.', kind: 'tip' },
    { content: 'On an FRQ, justify a two-sided limit by citing the existence rule explicitly: state the left-hand and right-hand limits and that they are EQUAL (or that they disagree, so DNE).', kind: 'frq-vocab' },
    { content: 'The two-sided limit can DNE even when both one-sided limits exist AND $f(a)$ is defined — a jump. The function\'s value at the point is irrelevant to whether the limit exists.', kind: 'common-error' },
    { content: 'A cancelable $\\tfrac{0}{0}$ (like $\\tfrac{x^2-4}{x-2}$ at $x=2$) is a HOLE, not an asymptote — the graph is a plain curve with one open circle where the factor canceled.', kind: 'gotcha' },
    { content: 'A convenient-looking table can lie: sampling $\\cos\\!\\left(\\tfrac{1}{x}\\right)$ only where it equals $\\tfrac{1}{2}$ hides that it sweeps all of $[-1,1]$ between the points — the true limit at $x=0$ DNE.', kind: 'edge-case' },
  ],
};
