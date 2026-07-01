/**
 * AP Statistics — Unit 4 CED 4.1–4.3: Probability Basics.
 *
 * Curated from the source lesson plan (evelyn.ap.stats.probability-basics.v1).
 * Theory tagged with kind/title to the calibration standard set by
 * ap-stats-u1-normal-distribution.ts / ap-stats-u2-correlation.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.probability-basics';

export const BASELINE_AP_STATS_PROBABILITY_BASICS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.probability-basics.v1',
  course: 'AP Statistics',
  cedUnit: 4,
  cedTopic: '4.1-4.3',
  cedTitle: 'Probability Basics',
  planId: 'evelyn.ap.stats.probability-basics.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.probability-basics.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Probability as long-run relative frequency',
      content:
        'PROBABILITY $P(A)$ is the long-run proportion of times event A occurs in many repeated random trials — flip a fair coin over and over and the proportion of heads converges to 0.5. The SAMPLE SPACE S is the set of all possible outcomes, so $P(S) = 1$ (something must happen). Every probability satisfies $P(A) \\ge 0$ and $P(A) \\le 1$.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Complement rule',
      content:
        '$P(A^c) = 1 - P(A)$, where $A^c$ ("not A") is everything in S outside A. Use this whenever a problem asks for "at least one" — it is almost always faster to find the complement ("none") and subtract from 1.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Addition rule (general and mutually exclusive)',
      content:
        'GENERAL ADDITION RULE: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ — add the two probabilities, then subtract the overlap so it is not double-counted. If A and B are MUTUALLY EXCLUSIVE (disjoint, cannot occur together), $P(A \\cap B) = 0$ and the rule simplifies to $P(A \\cup B) = P(A) + P(B)$.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Simulation to estimate a probability',
      content:
        'A SIMULATION estimates a probability by repeating a random process many times: (1) describe the random process, (2) define the EVENT of interest, (3) assign random digits to outcomes matching the true proportions (e.g. digits 00–07 = "defective" for an 8% rate), (4) run many trials (n = 100, 1000, …) and count how often the event occurs, (5) estimate $P(\\text{event}) = \\dfrac{\\text{count}}{n}$. By the LAW OF LARGE NUMBERS, the simulated proportion converges to the true probability as n grows.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'mutually exclusive (disjoint) events',
      content: 'events that cannot both occur on the same trial — $P(A \\cap B) = 0$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'sample space',
      content: 'the set S of all possible outcomes of a random process; $P(S) = 1$.',
    },
  ],
  methods: [
    {
      title: 'Apply the general addition rule',
      when_to_use:
        'When asked for $P(A \\cup B)$ and the two events might overlap — the default FRQ move unless the problem states the events are mutually exclusive.',
      steps: [
        'Identify P(A), P(B), and P(A and B) (the overlap) from the problem.',
        'Decide whether A and B are mutually exclusive — if so, P(A and B) = 0.',
        'Apply P(A or B) = P(A) + P(B) − P(A and B).',
        'Sanity-check with a Venn diagram or by counting outcomes directly when possible.',
      ],
      example: {
        problem:
          'In a deck of 52 cards: P(face card) = 12/52, P(red) = 26/52, P(face card and red) = 6/52. Find P(face card or red).',
        solution:
          'P(face or red) = 12/52 + 26/52 − 6/52 = 32/52 = 8/13. Check: red face cards (6) + non-face red (20) + black face cards (6) = 32 cards, confirming 32/52.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Design and run a probability simulation',
      when_to_use:
        'When asked to estimate a probability via simulation (a common AP FRQ format) rather than compute it analytically.',
      steps: [
        'State the random process in words (e.g. "select 5 widgets at random").',
        'Define the event of interest precisely.',
        'Assign random digits proportional to the true probability (e.g. 00–07 = defective for 8%, since that is 8 of 100 two-digit outcomes).',
        'Describe one trial: how many digits are read, and what outcome makes the trial a "success."',
        'Repeat many trials (state a number, e.g. 1000) and estimate P(event) = count of successes ÷ number of trials.',
      ],
      example: {
        problem:
          'A factory finds 8% of widgets are defective. Estimate the probability that at least one of 5 randomly selected widgets is defective, via simulation.',
        solution:
          'Assign digits 00–07 = "defective," 08–99 = "not defective." For each trial, generate 5 two-digit random numbers; if any falls in 00–07, count the trial as "yes." Repeat 1000 trials; estimate = (number of yes trials) / 1000. Analytic check: P(at least 1 defective) = 1 − (0.92)⁵ ≈ 0.341, so the simulation should land near 34%.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'P(A) always lies between 0 and 1, and P(S) = 1. The general addition rule always subtracts the overlap.', kind: 'tip' },
    { content: 'FRQ vocab for a simulation: name the digit assignment, describe one trial precisely, state the number of repetitions, and give the estimate formula.', kind: 'frq-vocab' },
    { content: 'Forgetting to subtract P(A and B) when events are NOT mutually exclusive over-counts the overlap — check for overlap before adding.', kind: 'common-error' },
    { content: '"At least one" almost always means: find the complement ("none") first, then subtract from 1.', kind: 'gotcha' },
    { content: 'When A and B are mutually exclusive, P(A and B) = 0 and the general addition rule reduces to simple addition — it still applies, just with a zero overlap term.', kind: 'edge-case' },
  ],
};
