/**
 * Chemistry — Atomic Structure: Isotopes & Average Atomic Mass.
 *
 * Why the periodic table prints decimals (NGSS HS-PS1-1, SEP-5): isotopes
 * are one element with different neutron counts, and the printed atomic
 * mass is an abundance-weighted average of the natural mix. The star
 * misconception — plain-averaging the isotope masses — gets a full worked
 * example. Numbers are chosen so every answer lands on one decimal place.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U2_AVERAGE_ATOMIC_MASS: LessonPlan = {
  id: 'evelyn.hs.chem.average-atomic-mass.v1',
  title: 'Isotopes & Average Atomic Mass',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.average-atomic-mass',
      standard: 'CHEM-2.3',
      description:
        'Explain how isotopes of an element differ in neutron count and mass number, and calculate an element\'s average atomic mass as the abundance-weighted average of its natural isotopes (NGSS HS-PS1-1, SEP-5).',
    },
  ],
  prerequisites: ['chem.subatomic-particles-isotopes'],
  followUps: ['chem.electron-configurations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The decimal on the periodic table is evidence — no single atom weighs it, so what does it describe?',
      script:
        'Open the periodic table to chlorine and you will see 35.5 — but weigh a single chlorine atom and you will NEVER get 35.5. Every chlorine atom in the universe weighs either about 35 or about 37, never anything in between. So where does that decimal come from? It is not a measurement of one atom; it is a headcount of the whole population. The same idea lets archaeologists date a bone from its carbon-14 and lets doctors track blood flow with a radioactive tracer. Today you learn to read — and to compute — that decimal.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-isotopes-weighted-average',
      kind: 'concept',
      goal: 'Isotopes as same-element-different-neutrons, and the weighted average that turns a natural mix into the one number printed on the table.',
      keyIdeas: [
        'ISOTOPES: SAME ELEMENT, DIFFERENT MASS — isotopes are atoms of the SAME element with different numbers of neutrons. Carbon-12 and carbon-14 both have 6 protons (that is what makes them carbon); they carry 6 and 8 neutrons. Change the protons and you change the ELEMENT, not the isotope.',
        'MASS NUMBER — the whole-number label after the name: protons + neutrons. Chlorine-37 has 17 protons and 20 neutrons. Mass number is always an integer and always describes ONE specific isotope.',
        'AVERAGE ATOMIC MASS — the decimal printed on the periodic table. It describes the natural MIXTURE of isotopes as found on Earth, weighted by how common each one is. That is why it is a decimal while mass numbers are integers.',
        'THE FORMULA — average atomic mass = (fraction of isotope 1 × its mass) + (fraction of isotope 2 × its mass) + ... Convert each percent abundance to a decimal fraction by dividing by 100, and check that the fractions add to 1 before you multiply anything.',
        'WEIGHTED, NOT PLAIN — abundance is the weight. Chlorine is 75% chlorine-35 and 25% chlorine-37, so the average is dragged down toward 35, landing at 35.5 — not at the plain midpoint 36.0.',
        'SANITY CHECK: LEAN TOWARD THE COMMON ONE — the answer must always fall BETWEEN the lightest and heaviest isotope masses, and closer to whichever isotope is more abundant. If your answer sits outside that range or leans the wrong way, you multiplied by the wrong abundance.',
        'RUN IT BACKWARD — given the average and both isotope masses, you can deduce which isotope dominates: an average of 10.8 between masses 10.0 and 11.0 sits much nearer 11.0, so the mass-11 isotope must be the common one.',
        'THE TRAP: PLAIN AVERAGING — adding the isotope masses and dividing by how many isotopes there are throws the abundance data away. That shortcut is only correct in the rare case of an exact 50-50 mix.',
      ],
      vocabulary: [
        { term: 'isotope', definition: 'an atom of a given element with a different number of neutrons, and therefore a different mass, than other atoms of that element.' },
        { term: 'mass number', definition: 'the total count of protons plus neutrons in one atom — always a whole number.' },
        { term: 'percent abundance', definition: 'the share of an element\'s natural atoms that are a particular isotope.' },
        { term: 'average atomic mass', definition: 'the abundance-weighted average of an element\'s natural isotope masses — the decimal on the periodic table.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-boron-average',
      kind: 'worked_example',
      problem:
        'Boron occurs naturally as two isotopes: boron-10 with a mass of 10.0 u and 20.0% abundance, and boron-11 with a mass of 11.0 u and 80.0% abundance. Calculate boron\'s average atomic mass.',
      steps: [
        'Convert each percent abundance to a decimal fraction: 20.0% → 0.200 and 80.0% → 0.800. Check: 0.200 + 0.800 = 1.000, so the mixture is fully accounted for.',
        'Weight the first isotope: 0.200 × 10.0 u = 2.00 u. This is boron-10\'s contribution to the average, not its mass.',
        'Weight the second isotope: 0.800 × 11.0 u = 8.80 u.',
        'Add the contributions: 2.00 + 8.80 = 10.8 u.',
        'Sanity check: 10.8 lies between 10.0 and 11.0 and sits much closer to 11.0 — exactly right, since boron-11 is four times as common.',
      ],
      answer: '10.8 u',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-plain-average-trap',
      kind: 'worked_example',
      problem:
        'Lithium has two natural isotopes: lithium-6 with a mass of 6.0 u and 10.0% abundance, and lithium-7 with a mass of 7.0 u and 90.0% abundance. A student answers "(6.0 + 7.0) ÷ 2 = 6.5 u." Find the flaw and give the correct average atomic mass.',
      steps: [
        'Name the move: the student took a PLAIN average of the two isotope masses, treating the mixture as if it were half lithium-6 and half lithium-7.',
        'Why it fails: the abundances say otherwise — 90 out of every 100 lithium atoms are lithium-7. The rare isotope cannot pull the average as hard as the common one.',
        'Do it weighted: 0.100 × 6.0 u = 0.60 u, and 0.900 × 7.0 u = 6.30 u.',
        'Add the contributions: 0.60 + 6.30 = 6.9 u — much nearer 7.0 than the student\'s 6.5, because lithium-7 dominates the population.',
        'The plain average would only have been correct at an exact 50-50 split. Whenever abundances are given, they are weights, not decoration.',
      ],
      answer: '6.9 u — the weighted average leans toward lithium-7, the abundant isotope',
      estimatedMinutes: 3,
    },
    {
      id: 'try-isotope-identity',
      kind: 'try_yourself',
      problem: 'Which statement correctly describes how a chlorine-35 atom differs from a chlorine-37 atom?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Same number of protons, two fewer neutrons', correct: true },
        { id: 'b', text: 'Same number of neutrons, two fewer protons' },
        { id: 'c', text: 'Two fewer electrons, giving it a different charge' },
        { id: 'd', text: 'Two fewer protons, making it a different element with the same name' },
      ],
      expectedAnswer: 'Same number of protons, two fewer neutrons',
      hints: [
        'Both atoms are chlorine. What particle sets an atom\'s element identity, and therefore cannot change between isotopes?',
        'Mass number = protons + neutrons. If the protons are locked at 17, a mass number of 35 versus 37 must come from the neutrons.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-isotope-common',
      kind: 'try_yourself',
      problem:
        'Element Q has exactly two natural isotopes: Q-20 with a mass of 20.0 u and Q-22 with a mass of 22.0 u. Q\'s average atomic mass is 20.2 u. What does this tell you about the mixture?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Q-20 is far more abundant than Q-22', correct: true },
        { id: 'b', text: 'Q-22 is far more abundant than Q-20' },
        { id: 'c', text: 'The two isotopes are present in roughly equal amounts' },
        { id: 'd', text: 'Abundance cannot be judged without being given the percentages' },
      ],
      expectedAnswer: 'Q-20 is far more abundant than Q-22',
      hints: [
        'The weighted average always lands between the two isotope masses, closer to whichever isotope is more common.',
        '20.2 sits almost on top of 20.0 and far from 22.0. Which isotope must be doing nearly all of the pulling?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Chlorine has exactly two natural isotopes: chlorine-35 with a mass of 35.0 u and 75% abundance, and chlorine-37 with a mass of 37.0 u and 25% abundance. Calculate the average atomic mass of chlorine in u. Type your answer as a number to one decimal place.',
      responseFormat: 'numeric',
      expectedAnswer: '35.5',
      hints: [
        'Turn the percents into fractions (0.75 and 0.25), multiply each by its isotope mass, then add the two contributions.',
        '0.75 × 35.0 = 26.25 and 0.25 × 37.0 = 9.25. Add them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-decimal-atom',
      kind: 'misconception_check',
      question:
        'A student says: "Chlorine\'s atomic mass is 35.5, so a chlorine atom has 17 protons and 18.5 neutrons." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'A single atom can have a fractional number of neutrons',
          misconception: 'Reading the periodic table\'s average atomic mass as the mass number of one individual atom.',
          correctsTo:
            'No atom weighs 35.5 u and no atom holds half a neutron. 35.5 is a POPULATION statistic — the abundance-weighted average of chlorine-35 (75%, 18 neutrons) and chlorine-37 (25%, 20 neutrons). Individual atoms always have whole-number mass numbers; only the mixture produces a decimal.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Isotopes are the same element with different neutron counts: protons fix the identity, neutrons vary the mass.',
        'Mass number (protons + neutrons) is a whole number for ONE atom; average atomic mass is a decimal describing the natural mixture.',
        'Formula: average = (fraction₁ × mass₁) + (fraction₂ × mass₂) + ... — divide each percent by 100 and confirm the fractions sum to 1.',
        'Never plain-average the isotope masses; abundance is the weight, and it only cancels out in an exact 50-50 mix.',
        'Sanity check: the answer must fall between the lightest and heaviest isotope masses, leaning toward the most abundant one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Isotopes & Average Atomic Mass' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
