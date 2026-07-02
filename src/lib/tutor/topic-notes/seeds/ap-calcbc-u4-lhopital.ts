/**
 * AP Calculus BC — Unit 4 CED 4.7: L'Hôpital's Rule.
 *
 * Baseline curated from evelyn.ap.calcbc.lhopital.v1 to the gold standard set
 * by seeds/ap-calcbc-u1-defining-limits.ts: every theory entry carries
 * kind+title, methods are humanized with when_to_use + a worked example,
 * pointers are a kind mix (tip / frq-vocab / gotcha / edge-case / common-error).
 *
 * KaTeX rule: inline math must NOT start with a digit (currency-safe renderer),
 * so any span opens with a non-digit (\lim, \tfrac, a letter, a sign, or "=").
 * Indeterminate forms are written \tfrac{0}{0}, never a bare 0/0.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.lhopital';

export const BASELINE_AP_CALCBC_LHOPITAL: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.lhopital.v1',
  course: 'AP Calculus BC',
  cedUnit: 4,
  cedTopic: '4.7',
  cedTitle: "L'Hôpital's Rule",
  planId: 'evelyn.ap.calcbc.lhopital.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.lhopital.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'theorem',
      title: "L'Hôpital's rule",
      content:
        'If $\\lim_{x\\to a}\\dfrac{f(x)}{g(x)}$ has the INDETERMINATE FORM $\\tfrac{0}{0}$ or $\\tfrac{\\infty}{\\infty}$, and $\\lim_{x\\to a}\\dfrac{f\'(x)}{g\'(x)}$ exists (finite or $\\pm\\infty$), THEN $\\lim_{x\\to a}\\dfrac{f(x)}{g(x)}=\\lim_{x\\to a}\\dfrac{f\'(x)}{g\'(x)}$. You differentiate NUMERATOR and DENOMINATOR SEPARATELY — this is not the quotient rule.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Check the indeterminate form FIRST',
      content:
        'The rule applies ONLY when direct substitution gives $\\tfrac{0}{0}$ or $\\tfrac{\\infty}{\\infty}$. Verify this before differentiating. Applying the rule to a limit that is already determinate (e.g. direct substitution gives a finite value, or a form like "nonzero over zero") produces a WRONG answer.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Repeat while still indeterminate',
      content:
        'If the new quotient $\\dfrac{f\'(x)}{g\'(x)}$ is STILL $\\tfrac{0}{0}$ or $\\tfrac{\\infty}{\\infty}$, apply the rule again — and continue until you reach a determinate form. Example: $\\lim_{x\\to 0}\\dfrac{1-\\cos x}{x^2}=\\lim_{x\\to 0}\\dfrac{\\sin x}{2x}=\\lim_{x\\to 0}\\dfrac{\\cos x}{2}=\\tfrac{1}{2}$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Converting other indeterminate forms',
      content:
        'Only $\\tfrac{0}{0}$ and $\\tfrac{\\infty}{\\infty}$ feed the rule directly, so REWRITE the rest: for a product of type 0·∞, turn it into a quotient (e.g. $x\\ln x=\\dfrac{\\ln x}{1/x}$); for ∞−∞, combine into a single fraction; for 1^∞, 0^0, or ∞^0, take a logarithm $\\ln y=g(x)\\ln f(x)$, find $\\lim\\ln y$, then exponentiate.',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'When NOT to use it',
      content:
        'If direct substitution already gives a finite number, just USE that value — the rule is overkill and its misuse can mislead. A form like "nonzero over zero" signals a vertical asymptote / infinite limit, NOT an indeterminate form, so the rule does not apply there either.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: "L'Hôpital's rule (one-line)",
      content:
        '$\\lim\\dfrac{f}{g}=\\lim\\dfrac{f\'}{g\'}$ WHEN the original limit is $\\tfrac{0}{0}$ or $\\tfrac{\\infty}{\\infty}$ and the right-hand limit exists.',
    },
  ],
  methods: [
    {
      title: "Evaluate a 0/0 or ∞/∞ limit with L'Hôpital's rule",
      when_to_use:
        'When direct substitution into a quotient limit yields $\\tfrac{0}{0}$ or $\\tfrac{\\infty}{\\infty}$.',
      steps: [
        'SUBSTITUTE to confirm the form is $\\tfrac{0}{0}$ or $\\tfrac{\\infty}{\\infty}$ (if not, stop — the rule does not apply).',
        'DIFFERENTIATE the numerator and the denominator SEPARATELY.',
        'EVALUATE the new limit $\\lim\\dfrac{f\'}{g\'}$ by substitution.',
        'If it is STILL indeterminate, repeat from the top on the new quotient.',
        'STATE the resulting value as the original limit.',
      ],
      example: {
        problem:
          'Compute $\\lim_{x\\to 0}\\dfrac{1-\\cos x}{x^2}$.',
        solution:
          'Substitution gives $\\tfrac{0}{0}$. Apply the rule: $\\lim_{x\\to 0}\\dfrac{\\sin x}{2x}$, still $\\tfrac{0}{0}$. Apply again: $\\lim_{x\\to 0}\\dfrac{\\cos x}{2}=\\dfrac{\\cos 0}{2}=\\dfrac{1}{2}$. So the limit is $\\tfrac{1}{2}$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Convert a product / power indeterminate form, then apply the rule',
      when_to_use:
        'For limits of the shape 0·∞, ∞−∞, 1^∞, 0^0, or ∞^0 — none of which the rule accepts directly.',
      steps: [
        'IDENTIFY the form by substitution.',
        'For a 0·∞ form: rewrite the product as a quotient to reach $\\tfrac{0}{0}$ or $\\tfrac{\\infty}{\\infty}$.',
        'For a power form (1^∞, 0^0, ∞^0): set $y$ equal to the expression and take $\\ln y=g(x)\\ln f(x)$.',
        'APPLY the rule to the converted quotient limit.',
        'For a power form, EXPONENTIATE at the end: the answer is $e^{\\lim \\ln y}$.',
      ],
      example: {
        problem:
          'Compute $\\lim_{x\\to 0^+} x\\ln x$.',
        solution:
          'The form is 0·(−∞). Rewrite as a quotient: $x\\ln x=\\dfrac{\\ln x}{1/x}$, now $\\tfrac{-\\infty}{\\infty}$. Apply the rule: $\\dfrac{1/x}{-1/x^2}=-x$, and $\\lim_{x\\to 0^+}(-x)=0$. So $\\lim_{x\\to 0^+} x\\ln x=0$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'ALWAYS confirm $\\tfrac{0}{0}$ or $\\tfrac{\\infty}{\\infty}$ before differentiating. Applying the rule to a determinate limit (e.g. direct substitution gives $\\tfrac{2}{3}$) yields a wrong answer — a reliably penalized AP misuse.', kind: 'common-error' },
    { content: "Differentiate the top and bottom SEPARATELY — L'Hôpital is NOT the quotient rule. Using $\\dfrac{g f'-f g'}{g^2}$ here is a classic mistake.", kind: 'gotcha' },
    { content: 'On an FRQ, explicitly WRITE the indeterminate form ("this is $\\tfrac{0}{0}$") before applying the rule; that line earns the justification point.', kind: 'frq-vocab' },
    { content: 'A "nonzero over zero" form (e.g. $\\tfrac{5}{0}$) is NOT indeterminate — it signals an infinite limit / vertical asymptote, so the rule does not apply; classify the form first.', kind: 'edge-case' },
    { content: 'If substitution already gives a finite number, just report it — reach for the rule only when a genuine indeterminate form blocks direct evaluation.', kind: 'tip' },
  ],
};
