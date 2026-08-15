/**
 * Chemistry — Unit 2, Topic 2.3: Isotopes & Average Atomic Mass.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u2-average-atomic-mass.ts
 * (planId evelyn.hs.chem.average-atomic-mass.v1).
 *
 * Compressed reference notes — why the periodic table prints decimals,
 * the abundance-weighted average that produces them, and the star trap
 * of plain-averaging the isotope masses.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.average-atomic-mass';
const PLAN_ID = 'evelyn.hs.chem.average-atomic-mass.v1';

export const BASELINE_CHEM_U2_AVERAGE_ATOMIC_MASS: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Isotopes & Average Atomic Mass',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Isotopes — same element, different mass',
      content:
        'Atoms of the SAME element with different neutron counts. Carbon-12 and carbon-14 both carry 6 protons (that is what makes them carbon) with 6 and 8 neutrons. Change the protons and you have changed the ELEMENT, not the isotope.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Mass number vs average atomic mass',
      content:
        'MASS NUMBER is the whole-number label after the name: protons + neutrons, describing ONE specific isotope (chlorine-37 = 17 protons + 20 neutrons). AVERAGE ATOMIC MASS is the decimal on the periodic table: it describes the natural MIXTURE of isotopes on Earth, weighted by how common each one is. Individual atoms give integers; only the mixture produces a decimal.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'The weighted-average formula',
      content:
        'average atomic mass = (fraction₁ × mass₁) + (fraction₂ × mass₂) + ... Convert each percent abundance to a decimal fraction by dividing by 100, and confirm the fractions sum to 1 BEFORE multiplying anything.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Weighted, not plain',
      content:
        'Abundance IS the weight. Chlorine is 75% chlorine-35 and 25% chlorine-37, so the average is dragged down toward 35 and lands at 35.5 — not at the plain midpoint 36.0. Adding the isotope masses and dividing by how many isotopes there are throws the abundance data away; it is correct only in an exact 50-50 mix.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Sanity check — lean toward the common one',
      content:
        'The answer must fall BETWEEN the lightest and heaviest isotope masses, and closer to whichever isotope is more abundant. An answer outside that range, or leaning the wrong way, means the abundances were paired with the wrong masses.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Running it backward',
      content:
        'Given the average and both isotope masses, the position of the average reveals which isotope dominates. An average of 10.8 between 10.0 and 11.0 sits much nearer 11.0, so the mass-11 isotope must be the common one. Same logic with percent abundance as the unknown: the closer the average sits to one mass, the larger that isotope\'s share.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Core vocabulary',
      content:
        'percent abundance — the share of an element\'s natural atoms that are a particular isotope. average atomic mass — the abundance-weighted average of an element\'s natural isotope masses, i.e. the decimal on the periodic table.',
    },
  ],
  methods: [
    {
      title: 'Percent-abundance weighted average: percent → fraction → weight → sum',
      when_to_use:
        'Every isotope mass and its percent abundance are given, and the element\'s average atomic mass is wanted.',
      steps: [
        'Convert each percent abundance to a decimal fraction (divide by 100).',
        'Check the fractions sum to 1.000 — if they do not, an isotope is missing or a percent was misread.',
        'Multiply each isotope mass by its own fraction to get that isotope\'s CONTRIBUTION (a contribution, not a mass).',
        'Add all contributions to get the average atomic mass.',
        'Sanity-check: the result lies between the extreme isotope masses and nearer the more abundant one.',
      ],
      example: {
        problem: 'Boron-10 (10.0 u, 20.0%) and boron-11 (11.0 u, 80.0%). Find boron\'s average atomic mass.',
        solution:
          '0.200 + 0.800 = 1.000 ✓. 0.200 × 10.0 = 2.00 u; 0.800 × 11.0 = 8.80 u. Sum = 10.8 u — between 10.0 and 11.0 and much closer to 11.0, since boron-11 is four times as common. ✓',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Spot and fix a plain-average answer',
      when_to_use:
        'A given solution divides the summed isotope masses by the number of isotopes, or otherwise ignores the abundances.',
      steps: [
        'Name the move: a PLAIN average treats the mixture as if every isotope were equally common.',
        'Point at the abundance data that contradicts it — the rare isotope cannot pull the average as hard as the common one.',
        'Redo it weighted: fraction × mass for each isotope, then add.',
        'Compare the two answers and say which isotope the correct value leans toward, and why.',
        'Note the exception: plain averaging matches the weighted result only at an exact 50-50 split.',
      ],
      example: {
        problem: 'Lithium-6 (6.0 u, 10.0%) and lithium-7 (7.0 u, 90.0%). A student answers (6.0 + 7.0) ÷ 2 = 6.5 u.',
        solution:
          'Weighted: 0.100 × 6.0 = 0.60 u; 0.900 × 7.0 = 6.30 u; sum = 6.9 u. The correct value sits near 7.0 because 90 of every 100 lithium atoms are lithium-7; the plain average ignored that.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Reason backward from the average to the dominant isotope',
      when_to_use:
        'Abundances are not given — the average atomic mass and the isotope masses are, and the question asks which isotope is more common (or roughly how common).',
      steps: [
        'Locate the average on the number line between the two isotope masses.',
        'The average always sits nearer the more abundant isotope — read off which one that is.',
        'Judge the degree: sitting almost on top of one mass means that isotope dominates heavily; sitting near the midpoint means the mix is close to even.',
        'If a number is required, solve (x × mass₁) + ((1 − x) × mass₂) = average for x.',
      ],
      example: {
        problem: 'Element Q has only Q-20 (20.0 u) and Q-22 (22.0 u), average 20.2 u. What does that say about the mixture?',
        solution: '20.2 sits almost on top of 20.0 and far from 22.0, so Q-20 is far more abundant (solving gives x = 0.90, i.e. 90% Q-20).',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Isotopes are the same element with different neutron counts: protons fix the identity, neutrons vary the mass.',
      kind: 'tip',
    },
    {
      content:
        'Mass number (protons + neutrons) is a whole number for ONE atom; average atomic mass is a decimal describing the natural mixture. No single chlorine atom weighs 35.5 u, and no atom holds half a neutron.',
      kind: 'gotcha',
    },
    {
      content:
        'Never plain-average the isotope masses. Abundance is the weight, and it only cancels out in an exact 50-50 mix.',
      kind: 'common-error',
    },
    {
      content:
        'Divide each percent by 100 before multiplying, and confirm the fractions sum to 1. Multiplying by 75 instead of 0.75 inflates the answer by a factor of 100.',
      kind: 'common-error',
    },
    {
      content:
        'Sanity check every answer: it must land between the lightest and heaviest isotope masses and lean toward the most abundant one. Failing that test means an abundance got paired with the wrong isotope mass.',
      kind: 'tip',
    },
  ],
};
