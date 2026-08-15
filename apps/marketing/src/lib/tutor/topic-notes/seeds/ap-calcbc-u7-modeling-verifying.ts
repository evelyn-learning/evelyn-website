/**
 * AP Calculus BC — Unit 7 CED 7.1–7.2: Modeling Situations with, and
 * Verifying Solutions of, Differential Equations.
 *
 * Baseline curated from evelyn.ap.calcbc.modeling-verifying-de.v1 to the gold
 * standard set by seeds/ap-calcbc-u1-defining-limits.ts and
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

const LO = 'apcalcbc.modeling-verifying-de';

export const BASELINE_AP_CALCBC_MODELING_VERIFYING_DE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.calcbc.modeling-verifying-de.v1',
  course: 'AP Calculus BC',
  cedUnit: 7,
  cedTopic: '7.1-7.2',
  cedTitle: 'Modeling and Verifying Differential Equations',
  planId: 'evelyn.ap.calcbc.modeling-verifying-de.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-02',
  sources: [{ type: 'plan', planId: 'evelyn.ap.calcbc.modeling-verifying-de.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Differential equation',
      content:
        'A DIFFERENTIAL EQUATION (DE) is an equation relating an unknown function to one or more of its derivatives. For example, $\\dfrac{dy}{dx} = 2y$ says "$y$\'s rate of change equals twice its current value." A DE describes HOW a quantity changes; solving it recovers the quantity itself.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Translating a rate statement into a DE',
      content:
        'Read the English, identify the RATE ($\\dfrac{dy}{dt}$ or $\\dfrac{dy}{dx}$), then express what it is proportional to or depends on. "Proportional to" introduces a constant $k$. Include a MINUS sign for decrease/decay. Classic templates: "grows proportional to size" $\\Rightarrow \\dfrac{dP}{dt} = kP$; "cools proportional to the temperature difference" $\\Rightarrow \\dfrac{dT}{dt} = -k(T - T_{\\text{amb}})$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Common modeling templates',
      content:
        'Three appear repeatedly on the exam: exponential $\\dfrac{dP}{dt} = kP$ (rate proportional to amount present); Newton\'s law of cooling $\\dfrac{dT}{dt} = -k(T - T_{\\text{amb}})$ (rate proportional to the gap from ambient); and logistic $\\dfrac{dP}{dt} = kP(M - P)$ (rate proportional to BOTH the amount present and the room left to grow toward capacity $M$).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Verifying a candidate solution',
      content:
        'To check that a function $y(x)$ SOLVES a DE, differentiate to get the needed derivatives, SUBSTITUTE $y$ and $y\'$ (and $y\'\'$ if present) into the equation, and confirm the two sides are identically equal for all $x$ in the interval. Verification never requires solving the DE — it is pure differentiate-and-compare.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'General vs. particular solution',
      content:
        'Solutions come in FAMILIES: the GENERAL solution carries an arbitrary constant (e.g. $y = Ce^{kx}$), so it is really infinitely many curves. An INITIAL CONDITION $y(x_0) = y_0$ pins down the constant, selecting the single PARTICULAR solution through that point.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'differential equation (one-line)',
      content: 'an equation involving a function $y$ and its derivatives $y\', y\'\', \\ldots$; a solution is any function that makes it hold identically.',
    },
  ],
  methods: [
    {
      title: 'Translate a verbal rate description into a differential equation',
      when_to_use:
        'When a problem describes a rate of change in words ("grows at a rate proportional to…", "decreases in proportion to…") and asks you to write the DE.',
      steps: [
        'IDENTIFY the changing quantity and name its rate: $\\dfrac{dy}{dt}$ (or $\\dfrac{dy}{dx}$).',
        'IDENTIFY what the rate is proportional to or depends on — the amount present, a difference, a product, a power.',
        'INTRODUCE a proportionality constant $k$ for "proportional to."',
        'FIX the SIGN: use $-k$ (or a negative rate) when the quantity DECREASES.',
        'WRITE the equation $\\dfrac{dy}{dt} = (\\text{that expression})$ and, if given, attach the initial condition.',
      ],
      example: {
        problem:
          'Water leaks from a tank at a rate proportional to the square root of the volume $V$ remaining. Write the DE.',
        solution:
          'The rate is $\\dfrac{dV}{dt}$; it is proportional to $\\sqrt{V}$; the volume DECREASES, so the sign is negative: $\\dfrac{dV}{dt} = -k\\sqrt{V}$ with $k > 0$.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Verify that a given function is a solution of a DE',
      when_to_use:
        'When handed a candidate function and a DE and asked to CONFIRM (not derive) that it is a solution.',
      steps: [
        'DIFFERENTIATE the candidate to obtain every derivative the DE mentions ($y\'$, and $y\'\'$ if it appears).',
        'SUBSTITUTE the function and its derivatives into the DE.',
        'SIMPLIFY both sides independently.',
        'CONCLUDE: if the two sides are equal for all $x$, the function is a solution; otherwise it is not.',
      ],
      example: {
        problem: 'Verify that $y = e^{2x}$ solves $\\dfrac{dy}{dx} = 2y$, and that $y = \\sin(2x)$ solves $y\'\' + 4y = 0$.',
        solution:
          'First: since $\\dfrac{dy}{dx} = 2e^{2x} = 2y$, the two sides agree, so $y = e^{2x}$ is a solution. Second: $y\' = 2\\cos(2x)$ and $y\'\' = -4\\sin(2x)$, so $y\'\' + 4y = -4\\sin(2x) + 4\\sin(2x) = 0$. Verified.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: '"Proportional to" is a signal to introduce a constant $k$ — do not omit it. "Grows/decays" fixes the sign of $k$ or of the rate.', kind: 'tip' },
    { content: 'To VERIFY a solution you never solve the DE — just differentiate the given function and substitute. Solving is a separate, later skill.', kind: 'frq-vocab' },
    { content: 'For a second-order DE like $y\'\' + 4y = 0$ you must substitute $y\'\'$, not just $y\'$ — read which derivatives the equation actually contains.', kind: 'gotcha' },
    { content: 'A general solution is a whole FAMILY (an arbitrary constant); only an initial condition selects the one particular curve. Do not report the family when a specific value is asked.', kind: 'common-error' },
    { content: 'Newton\'s cooling rate is proportional to the DIFFERENCE $T - T_{\\text{amb}}$, not to $T$ itself — a temperature at ambient has zero rate of change.', kind: 'edge-case' },
  ],
};
