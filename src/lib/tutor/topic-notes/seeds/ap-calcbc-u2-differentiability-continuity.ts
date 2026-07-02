/**
 * AP Calculus BC — Unit 2 CED 2.4: Connecting Differentiability and
 * Continuity — Determining When Derivatives Do and Do Not Exist.
 *
 * Curated from evelyn.ap.calcbc.differentiability-continuity.v1 to the gold
 * standard of seeds/ap-calcbc-u1-defining-limits.ts.
 *
 * KaTeX rule: inline math must NOT start with a digit — every $...$ opens with
 * a non-digit.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apcalcbc.differentiability-continuity';

export const BASELINE_AP_CALCBC_DIFFERENTIABILITY_CONTINUITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.differentiability-continuity.v1',
  course: 'AP Calculus BC',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Connecting Differentiability and Continuity',
  planId: 'evelyn.ap.calcbc.differentiability-continuity.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.differentiability-continuity.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'theorem',
      title: 'Differentiability implies continuity',
      content:
        'If $f$ is DIFFERENTIABLE at $a$, then $f$ is CONTINUOUS at $a$. Differentiability is the STRONGER property — every differentiable point is automatically continuous.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The converse FAILS',
      content:
        'Continuity at $a$ does NOT imply differentiability at $a$. A function can be continuous yet have no well-defined tangent slope at a point. The canonical counterexample is $f(x)=|x|$ at $x=0$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Three failure modes (continuous but not differentiable)',
      content:
        'CORNER — one-sided slopes disagree, e.g. $f(x)=|x|$ at $x=0$ (left slope $-1$, right slope $+1$). CUSP — both side slopes diverge to $\\pm\\infty$ in opposite directions, e.g. $f(x)=x^{2/3}$ at $x=0$. VERTICAL TANGENT — the tangent is vertical (slope $\\pm\\infty$ from both sides), e.g. $f(x)=x^{1/3}$ at $x=0$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Operational test for differentiability',
      content:
        '$f$ is differentiable at $a$ iff $\\lim_{h\\to 0}\\dfrac{f(a+h)-f(a)}{h}$ exists as a FINITE real. Failures: one-sided limits exist but disagree (corner); the limit is $\\pm\\infty$ (cusp or vertical tangent); the limit oscillates (rare in AP).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'corner',
      content: 'a point where the left-hand and right-hand derivatives both exist but are unequal, so $f\'(a)$ DNE (e.g. $|x|$ at $x=0$).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'cusp',
      content: 'a sharp point where the one-sided slopes diverge to $+\\infty$ and $-\\infty$ (opposite infinities), so $f\'(a)$ DNE (e.g. $x^{2/3}$ at $x=0$).',
    },
  ],
  methods: [
    {
      title: 'Classify a point as continuous / differentiable (and name the failure)',
      when_to_use:
        'When asked whether $f$ is continuous and/or differentiable at a point, or to identify the type of non-differentiability from a formula or graph.',
      steps: [
        'Check continuity FIRST: is $\\lim_{x\\to a} f(x) = f(a)$ (both one-sided limits equal the value)? If not, $f$ is discontinuous and automatically not differentiable.',
        'If continuous, test the derivative limit $\\lim_{h\\to 0}\\dfrac{f(a+h)-f(a)}{h}$ from both sides.',
        'If the one-sided slopes are finite but UNEQUAL → CORNER (not differentiable).',
        'If both one-sided slopes head to $\\pm\\infty$ in OPPOSITE directions → CUSP; if to the SAME $\\pm\\infty$ → VERTICAL TANGENT.',
        'If the two-sided limit is a single finite number → differentiable, and that number is $f\'(a)$.',
      ],
      example: {
        problem: 'Is $f(x)=|x|$ continuous and differentiable at $x=0$?',
        solution:
          'Continuity: $\\lim_{x\\to 0}|x| = 0 = f(0)$, so continuous. Derivative: $\\lim_{h\\to 0}\\dfrac{|h|}{h}$ equals $+1$ from the right and $-1$ from the left — unequal, so the limit DNE and $f\'(0)$ DNE. Thus $f$ is continuous but NOT differentiable at $x=0$ — a CORNER.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Find a parameter making a piecewise function differentiable',
      when_to_use:
        'When a piecewise $f$ has unknown constants and you must make it continuous and/or differentiable at the seam.',
      steps: [
        'CONTINUITY: set the two branch VALUES equal at the seam $x=c$ (and equal to $f(c)$).',
        'DIFFERENTIABILITY: set the two branch DERIVATIVES equal at $x=c$ (slopes must match).',
        'Solve the resulting system; differentiability at a seam requires BOTH conditions to hold simultaneously.',
        'If the conditions are inconsistent, no parameter value works — state that explicitly.',
      ],
      example: {
        problem:
          'For $f(x)=x^2$ ($x\\le 1$) and $f(x)=kx$ ($x>1$), is there a $k$ making $f$ both continuous and differentiable at $x=1$?',
        solution:
          'Continuity needs $k = 1$. Differentiability needs the slopes to match: left slope $=2x|_{x=1}=2$, right slope $=k$, so $k=2$. Continuity wants $k=1$ but differentiability wants $k=2$ — inconsistent, so NO single $k$ makes $f$ both continuous and differentiable at $x=1$.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Always check CONTINUITY first: a discontinuity at $a$ makes $f$ automatically non-differentiable there — you can stop.', kind: 'tip' },
    { content: 'The implication is ONE-WAY: differentiable $\\Rightarrow$ continuous, but continuous $\\not\\Rightarrow$ differentiable. Reversing it is a classic exam trap.', kind: 'common-error' },
    { content: 'For a piecewise seam, "smooth" needs TWO equations: matching values (continuity) AND matching slopes (differentiability). Matching only values leaves a corner.', kind: 'gotcha' },
    { content: 'Cusp vs. vertical tangent: both have infinite slope, but a cusp\'s sides diverge to OPPOSITE infinities while a vertical tangent\'s sides go to the SAME infinity.', kind: 'edge-case' },
    { content: 'FRQ justification: to argue non-differentiability at a corner, show the left- and right-hand values of $\\dfrac{f(a+h)-f(a)}{h}$ differ; naming "corner" alone is not full credit.', kind: 'frq-vocab' },
  ],
};
