/**
 * AP Calculus BC — Unit 1 CED 1.3: Estimating Limit Values from Graphs
 * and Tables.
 *
 * Baseline notes hand-curated from the source plan
 * evelyn.ap.calcbc.limits-graphs-tables.v1 to the standard set by
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

const LO = 'apcalcbc.limits-graphs-tables';

export const BASELINE_AP_CALCBC_LIMITS_GRAPHS_TABLES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.limits-graphs-tables.v1',
  course: 'AP Calculus BC',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Estimating Limit Values from Graphs and Tables',
  planId: 'evelyn.ap.calcbc.limits-graphs-tables.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.limits-graphs-tables.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Graphical estimation of a limit',
      content:
        'To estimate $\\lim_{x\\to a} f(x)$ from a graph, trace the curve as $x$ approaches $a$ from the LEFT ($x\\to a^-$) and from the RIGHT ($x\\to a^+$). The $y$-value the curve heads toward on each side is the one-sided limit; if both sides head to the same height, the two-sided limit equals that value.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Graph features to recognize',
      content:
        'An OPEN circle at $(a,L)$ typically marks the limit value $L$ while $f(a)\\ne L$ (or is undefined). A CLOSED circle at $(a,L)$ marks $f(a)=L$. A VERTICAL ASYMPTOTE at $x=a$ signals an infinite limit (no finite limit). A JUMP in the curve signals that the one-sided limits disagree, so the two-sided limit DNE.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Tabular estimation of a limit',
      content:
        'Build a table of $x$-values approaching $a$ from BOTH sides — e.g. $x=1.9,\\,1.99,\\,1.999$ from below and $x=2.001,\\,2.01,\\,2.1$ from above — and compute $f(x)$ at each. If the $f$-values converge to the same number from both sides, that shared value is your limit estimate.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why both sides — and good sampling — matter',
      content:
        'Sampling only one side (say only $x>a$) hides a disagreement on the other side, and AP regularly tests this. Sample size matters too: values progressively closer to $a$ (e.g. $x=1.9\\to 1.99\\to 1.999$) show convergence, whereas a couple of far-off points give weak evidence.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'When both methods fail',
      content:
        'A wildly oscillating function such as $\\sin\\!\\left(\\tfrac{1}{x}\\right)$ as $x\\to 0$ defeats both approaches: the graph oscillates infinitely fast near zero and the table jumps around for tiny changes in $x$. That behavior itself signals the limit DNE.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'open vs. closed circle',
      content: 'an OPEN circle at $(a,L)$ means $f$ does not take the value $L$ at $x=a$ (often the limit height); a CLOSED circle means $f(a)$ equals that marked $y$-value.',
    },
  ],
  methods: [
    {
      title: 'Estimate a limit from a table of values',
      when_to_use:
        'When you are handed a table of $f(x)$ for $x$ near $a$ and asked for $\\lim_{x\\to a} f(x)$ or whether the limit exists.',
      steps: [
        'Split the rows by side: those with $x<a$ give the LEFT approach, those with $x>a$ give the RIGHT approach.',
        'Order each side from farthest to closest to $a$ and read the trend of $f(x)$ — the value it converges toward is that one-sided limit.',
        'Compare the two one-sided estimates: if they agree, that shared value is $\\lim_{x\\to a} f(x)$; if they differ, the two-sided limit DNE.',
        'Remember the table does not reveal $f(a)$ itself and gives an ESTIMATE, not a proof — algebra or the $\\varepsilon$-$\\delta$ definition would be needed to confirm exactly.',
      ],
      example: {
        problem:
          'Estimate $\\lim_{x\\to 3} f(x)$ given $f(2.9)=5.97$, $f(2.99)=5.997$, $f(2.999)=5.9997$, $f(3.001)=6.0003$, $f(3.01)=6.003$, $f(3.1)=6.03$.',
        solution:
          'Left side ($x=2.9,\\,2.99,\\,2.999$): $f=5.97,\\,5.997,\\,5.9997$ converge to 6, so $\\lim_{x\\to 3^-} f(x)\\approx 6$. Right side ($x=3.001,\\,3.01,\\,3.1$): $f=6.0003,\\,6.003,\\,6.03$ also converge to 6, so $\\lim_{x\\to 3^+} f(x)\\approx 6$. Both sides agree, so $\\lim_{x\\to 3} f(x)\\approx 6$ — consistent with a continuous function or a removable discontinuity at $x=3$; the table alone does not tell us $f(3)$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Always tabulate BOTH sides with values progressively closer to $a$ (e.g. $x=1.9,\\,1.99,\\,1.999$). A one-sided or far-off sample gives weak, possibly misleading evidence.', kind: 'tip' },
    { content: 'On the graph, an OPEN circle marks the limit height (the curve approaches it) and a CLOSED circle marks the actual $f(a)$ — read them separately, because continuity needs limit $=f(a)$.', kind: 'frq-vocab' },
    { content: 'A table or graph gives an ESTIMATE, not a proof: it says what the limit is APPROACHING. Exact confirmation needs algebraic methods (Unit 1.5–1.6).', kind: 'gotcha' },
    { content: 'When the left-trend and right-trend head to different numbers, the two-sided limit DNE (a jump) — even though each one-sided limit exists.', kind: 'common-error' },
    { content: 'A deceptively "settled-looking" table can still hide oscillation: $\\sin\\!\\left(\\tfrac{1}{x}\\right)$ near $x=0$ can be sampled to look calm while the true behavior never settles.', kind: 'edge-case' },
  ],
};
