/**
 * High School Chemistry — Atomic Structure and Subatomic Particles.
 *
 * NGSS HS-PS1-1: foundation for all of chemistry. Protons, neutrons,
 * electrons; atomic number, mass number, isotopes; how the periodic
 * table is organized by atomic number. Sets up periodic trends and
 * bonding lessons that follow.
 *
 * Source: NGSS HS-PS1, OpenStax Chemistry 2e Chapter 2.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_ATOMIC_STRUCTURE: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.atomic-structure.v1',
  title: 'Atomic Structure and Subatomic Particles',
  curriculum: 'NGSS',
  grade: '9-12',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'ngss.hs-ps1-1',
      description: 'Use the periodic table as a model to predict the relative properties of elements based on the patterns of electrons in the outermost energy level of atoms.',
      standard: 'NGSS.HS-PS1-1',
    },
  ],
  prerequisites: ['ngss.ms-ps1-1'],
  followUps: ['hs.chem.electron-configuration', 'hs.chem.periodic-trends'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the lesson in the scale of atoms — incomprehensibly small, but understandable.',
      script: 'A single drop of water contains about 1.7 × 10²¹ molecules. Each molecule is three atoms. So that one drop has roughly five sextillion atoms. We can\'t see them — but in the past 100 years we\'ve mapped exactly what\'s INSIDE each one. Let\'s start with the parts.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-three-particles',
      kind: 'concept',
      goal: 'Atoms are made of three subatomic particles — protons, neutrons, electrons — with specific properties and locations.',
      keyIdeas: [
        'PROTON: positive charge (+1), mass ≈ 1 amu, located in the NUCLEUS.',
        'NEUTRON: no charge (neutral), mass ≈ 1 amu, also in the nucleus.',
        'ELECTRON: negative charge (−1), mass ≈ 1/1836 amu (basically nothing), orbits the nucleus in ENERGY LEVELS / shells.',
        'Nucleus is TINY but holds 99.9% of an atom\'s mass. The rest is mostly empty space.',
        'In a neutral atom, # protons = # electrons (charges balance).',
        'amu = atomic mass unit = 1.66 × 10⁻²⁷ kg.',
      ],
      vocabulary: [
        { term: 'nucleus', definition: 'the dense central core of an atom containing protons and neutrons.' },
        { term: 'amu', definition: 'atomic mass unit — convenient unit for measuring particle mass.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_orbital_diagram'],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-atomic-number-mass-number',
      kind: 'concept',
      goal: 'Atomic number = # protons (defines the element). Mass number = protons + neutrons. Isotopes = same element, different neutrons.',
      keyIdeas: [
        'ATOMIC NUMBER (Z) = number of protons. UNIQUE per element. Carbon always has Z=6.',
        'MASS NUMBER (A) = protons + neutrons.',
        'ISOTOPES = atoms of the same element with DIFFERENT numbers of neutrons (same Z, different A).',
        'Carbon-12 (⁶C with 6 neutrons) and Carbon-14 (⁶C with 8 neutrons) are isotopes — both carbon, different masses.',
        'Average atomic mass (on the periodic table) is a WEIGHTED average of an element\'s naturally occurring isotopes.',
        'Standard notation: ᴬZX where A=mass number, Z=atomic number, X=element symbol. Or just write "Carbon-14".',
      ],
      vocabulary: [
        { term: 'atomic number', definition: 'the number of protons; defines the element.' },
        { term: 'mass number', definition: 'protons + neutrons.' },
        { term: 'isotope', definition: 'an atom with the same protons but different neutrons.' },
      ],
      suggestedTools: ['show_periodic_table_highlight', 'show_diagram'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-carbon-12-vs-14',
      kind: 'worked_example',
      problem: 'Carbon-12 and Carbon-14 are both isotopes of carbon. For each: how many protons, neutrons, and electrons does a NEUTRAL atom have?',
      steps: [
        'Both are carbon → atomic number Z = 6. So both have 6 PROTONS.',
        'Both are NEUTRAL → # electrons = # protons = 6 ELECTRONS each.',
        'C-12: mass number A = 12. Neutrons = A − Z = 12 − 6 = 6 NEUTRONS.',
        'C-14: mass number A = 14. Neutrons = A − Z = 14 − 6 = 8 NEUTRONS.',
        'Same element (both C, both 6 protons, both 6 electrons) — but different number of neutrons → different mass.',
      ],
      answer: 'C-12: 6p, 6n, 6e. C-14: 6p, 8n, 6e.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'An atom has 17 protons, 18 neutrons, and 17 electrons. What element is it, what\'s its mass number, and is it a neutral atom or an ion?',
      expectedAnswer: 'Chlorine (Cl), mass number 35, neutral atom (since # protons = # electrons)',
      responseFormat: 'free',
      hints: [
        'Atomic number = protons. Look that up on the periodic table.',
        'Mass number = protons + neutrons.',
        'Neutral if proton count equals electron count.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-isotopes-different-elements',
      kind: 'misconception_check',
      question: 'A student says "Carbon-12 and Carbon-14 are different elements because they have different masses." Is that correct?',
      commonErrors: [
        {
          answer: 'Yes — different mass = different element.',
          misconception: 'Confusing mass differences with element differences.',
          correctsTo: 'Element identity is set by PROTON COUNT (atomic number), NOT mass. Both C-12 and C-14 have 6 protons → both are carbon. Different neutrons make them ISOTOPES (same element, different mass). Carbon-14 is unstable and radioactive — that\'s used for carbon dating — but it\'s still carbon.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three subatomic particles: proton (+, in nucleus), neutron (0, in nucleus), electron (−, around nucleus).',
        'Atomic number Z = protons → defines the element.',
        'Mass number A = protons + neutrons.',
        'Isotopes: same Z, different A.',
        'Neutral atom: # protons = # electrons.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Hydrogen has three isotopes: protium (¹H), deuterium (²H), tritium (³H). Heavy water (D₂O) is water made with deuterium instead of regular hydrogen. Why does heavy water have a slightly higher density and slightly different chemical kinetics than ordinary water?',
      hint: 'Same chemistry (same Z = same protons = same bonding behavior) but heavier atoms move slower — affects reaction rates.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
