/**
 * Chemistry — Atomic Structure: Subatomic Particles & Isotope Notation.
 *
 * The bookkeeping every later unit leans on (NGSS HS-PS1-1): protons set
 * identity, neutrons set mass, electrons set charge. Isotope notation is
 * just those three counts written down — and the classic errors (mass
 * number read as a neutron count, charge sign flipped, isotope confused
 * with ion) get equal billing with the method.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U2_SUBATOMIC_PARTICLES_ISOTOPES: LessonPlan = {
  id: 'evelyn.hs.chem.subatomic-particles-isotopes.v1',
  title: 'Subatomic Particles & Isotope Notation',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.subatomic-particles-isotopes',
      standard: 'CHEM-2.2',
      description:
        'Determine the number of protons, neutrons, and electrons in a neutral atom or a monatomic ion from isotope notation, and explain why isotopes of an element share chemical behavior (NGSS HS-PS1-1).',
    },
  ],
  prerequisites: ['chem.atomic-theory'],
  followUps: ['chem.average-atomic-mass'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Same element, different neutrons — a difference small enough to be invisible chemically and large enough to date a mammoth bone.',
      script:
        'The smoke detector in your hallway runs on americium-241. A cancer ward down the road treats overactive thyroids with iodine-131, and archaeologists date a mammoth bone with carbon-14. In every case the useful atom has a perfectly ordinary twin — americium-243, iodine-127, carbon-12 — that sits in the same box on the periodic table, bonds the same way, and does absolutely nothing interesting. The only difference is a couple of neutrons. Today we learn to read an atom the way a chemist does: three counts, three consequences — protons for identity, neutrons for mass, electrons for charge.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-counts',
      kind: 'concept',
      goal: 'Protons/neutrons/electrons as three independent counts, isotope notation as the shorthand for them, and the three classic bookkeeping traps.',
      keyIdeas: [
        'THREE PARTICLES, THREE JOBS — the PROTON (charge +1, mass ≈ 1 amu, in the nucleus) fixes which element you have; the NEUTRON (charge 0, mass ≈ 1 amu, also in the nucleus) adds mass and nothing else; the ELECTRON (charge −1, mass ≈ 1/1836 amu) lives in shells outside the nucleus and does all the chemistry. Nearly all the mass sits in a nucleus that is a hundred-thousand times smaller than the atom.',
        'ATOMIC NUMBER Z = PROTONS — and it IS the element\'s identity. Every atom with 6 protons is carbon; change the proton count and you have changed elements. Z is the whole-number address printed on each periodic-table box.',
        'MASS NUMBER A = PROTONS + NEUTRONS — a count of nuclear particles, always a whole number. So NEUTRONS = A − Z. Notice A is never the neutron count on its own; that subtraction is the single most-skipped step in the topic.',
        'ISOTOPE NOTATION — write the mass number as a leading superscript and the atomic number as a leading subscript: ³⁵₁₇Cl, ³⁷₁₇Cl. Hyphen notation says the same thing with less typing: chlorine-35, chlorine-37. The subscript is redundant — the symbol already tells you Z — which is why hyphen notation is legal.',
        'ISOTOPES = SAME Z, DIFFERENT A — same element, different neutron count, therefore different mass. Because chemistry is run by electrons and isotopes of one element have identical electron arrangements, isotopes react essentially identically. That is why chlorine-35 and chlorine-37 both make ordinary table salt.',
        'CHARGE COMES FROM ELECTRONS ONLY — a neutral atom has electrons = protons. A charge superscript is written after the symbol: Ca²⁺, S²⁻. ELECTRONS = Z − charge. A 2+ ion LOST two electrons (fewer negatives, so 2 fewer than Z); a 2− ion GAINED two. Protons and neutrons never change when an ion forms.',
        'ISOTOPE ≠ ION — an isotope differs in NEUTRONS (mass changes, charge does not); an ion differs in ELECTRONS (charge changes, mass barely does). ³⁵Cl and ³⁷Cl are isotopes; Cl and Cl⁻ are an atom and its ion. An atom can be both at once, like ³⁷Cl⁻.',
        'SAME A DOES NOT MEAN SAME ELEMENT — ¹⁴C and ¹⁴N both have mass number 14, but with 6 protons versus 7 they are carbon and nitrogen, two different elements. Matching mass numbers make them isobars, not isotopes.',
      ],
      vocabulary: [
        { term: 'atomic number (Z)', definition: 'the number of protons in the nucleus; it defines which element the atom is.' },
        { term: 'mass number (A)', definition: 'protons plus neutrons — the total count of particles in the nucleus.' },
        { term: 'isotope', definition: 'one of two or more atoms of the same element that differ in neutron count, and therefore in mass.' },
        { term: 'ion', definition: 'an atom that has gained or lost electrons and so carries a net charge.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-two-chlorine-isotopes',
      kind: 'worked_example',
      problem:
        'Chlorine has atomic number 17. Give the protons, neutrons, and electrons in a neutral atom of chlorine-35 and in a neutral atom of chlorine-37, and write each in full isotope notation.',
      steps: [
        'Both are chlorine, so both have Z = 17 → 17 PROTONS each. Proton count is what makes them chlorine in the first place, so it cannot differ.',
        'Both are described as neutral atoms, so electrons = protons → 17 ELECTRONS each.',
        'Chlorine-35: the hyphen number is the MASS number, so A = 35. Neutrons = A − Z = 35 − 17 = 18 NEUTRONS.',
        'Chlorine-37: A = 37, so neutrons = 37 − 17 = 20 NEUTRONS. Two extra neutrons is the entire difference between these atoms.',
        'Full notation puts A on top and Z below: ³⁵₁₇Cl and ³⁷₁₇Cl. Same electron arrangement in both → identical chemistry, different mass.',
      ],
      answer: 'Chlorine-35: 17 protons, 18 neutrons, 17 electrons (³⁵₁₇Cl). Chlorine-37: 17 protons, 20 neutrons, 17 electrons (³⁷₁₇Cl).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ion-error-hunt',
      kind: 'worked_example',
      problem:
        'A student writes: "⁴⁰Ca²⁺ has 20 protons, 40 neutrons, and 22 electrons." Calcium\'s atomic number is 20. Find every error and give the corrected counts.',
      steps: [
        'Check the protons first. Z = 20 for calcium, and forming an ion never changes the nucleus, so 20 protons is CORRECT — that part stays.',
        'Neutrons: the student copied the mass number straight across. But 40 is A = protons + neutrons, not the neutron count. Neutrons = A − Z = 40 − 20 = 20 NEUTRONS, not 40. Error one.',
        'Electrons: the superscript 2+ means the atom is short two negative charges, so it LOST two electrons. The student added them instead. Electrons = Z − charge = 20 − 2 = 18 ELECTRONS, not 22. Error two.',
        'Sanity-check the charge with the corrected numbers: 20 positives from protons and 18 negatives from electrons leave a net of 2+, which matches the symbol. A count that does not reproduce the written charge is always wrong.',
        'Corrected: ⁴⁰Ca²⁺ has 20 protons, 20 neutrons, and 18 electrons.',
      ],
      answer: '20 protons, 20 neutrons, 18 electrons — the mass number is not the neutron count, and a positive ion has FEWER electrons than protons.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-isotope-pair',
      kind: 'try_yourself',
      problem: 'Which pair of atoms are isotopes of each other?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'An atom with 8 protons and 8 neutrons, and an atom with 8 protons and 10 neutrons', correct: true },
        { id: 'b', text: 'An atom with 8 protons and 10 neutrons, and an atom with 10 protons and 8 neutrons' },
        { id: 'c', text: 'An atom with 7 protons and 7 neutrons, and an atom with 6 protons and 8 neutrons' },
        { id: 'd', text: 'An oxygen atom with 8 electrons, and an oxygen particle with 10 electrons' },
      ],
      expectedAnswer: 'An atom with 8 protons and 8 neutrons, and an atom with 8 protons and 10 neutrons',
      hints: [
        'Isotopes must be the SAME element. Which count decides the element?',
        'Look for a pair with matching proton counts and different neutron counts — matching mass numbers or differing electron counts do not qualify.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-aluminum-ion',
      kind: 'try_yourself',
      problem:
        'Aluminum has atomic number 13. How many protons, neutrons, and electrons are in ²⁷Al³⁺?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '13 protons, 14 neutrons, 10 electrons', correct: true },
        { id: 'b', text: '13 protons, 14 neutrons, 16 electrons' },
        { id: 'c', text: '13 protons, 27 neutrons, 10 electrons' },
        { id: 'd', text: '10 protons, 14 neutrons, 13 electrons' },
      ],
      expectedAnswer: '13 protons, 14 neutrons, 10 electrons',
      hints: [
        'Neutrons = A − Z, and the 27 is the mass number. Protons never change when an ion forms.',
        'A 3+ charge means three electrons were LOST, so electrons = 13 − 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A monatomic ion has a mass number of 65, contains 36 neutrons, and carries a charge of 2+. How many electrons does this ion have? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '27',
      hints: [
        'You are not given Z directly, but A = protons + neutrons, so protons = 65 − 36.',
        'That gives 29 protons. A 2+ charge means two electrons were lost, so subtract 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-isotopes-vs-elements',
      kind: 'misconception_check',
      question:
        'A student says: "The periodic table lists chlorine\'s mass as 35.45, so chlorine-35 and chlorine-37 can\'t both be real chlorine — and anyway, adding neutrons should change what the element is." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'Adding neutrons makes it a different element',
          misconception: 'Treating mass, rather than proton count, as the thing that defines an element.',
          correctsTo:
            'Identity is set by PROTONS alone. Chlorine-35 and chlorine-37 both have 17 protons, so both are chlorine; the two extra neutrons change only the mass. Change the proton count and you have genuinely changed elements — 17 protons is chlorine, 18 is argon.',
        },
        {
          answer: 'The decimal 35.45 proves neither isotope is real chlorine',
          misconception: 'Reading the periodic table\'s average atomic mass as the mass of one atom.',
          correctsTo:
            'No single chlorine atom weighs 35.45 amu. Real samples are a mixture — roughly three-quarters chlorine-35 and one-quarter chlorine-37 — and 35.45 is the weighted average of that mixture. Mass numbers of individual atoms are always whole numbers; only the average carries a decimal, which is exactly the calculation coming up next.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three counts, three jobs: protons set the element, neutrons set the mass, electrons set the charge and do the chemistry.',
        'Z = protons; A = protons + neutrons; so neutrons = A − Z. The mass number is never the neutron count by itself.',
        'Isotope notation ³⁷₁₇Cl (or chlorine-37) is just A on top, Z below — isotopes share Z and differ in A.',
        'Electrons = Z − charge: a positive ion has LOST electrons, a negative ion has gained them; the nucleus is untouched either way.',
        'Isotope ≠ ion, and matching mass numbers ≠ same element — ¹⁴C and ¹⁴N are different elements entirely.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Subatomic Particles & Isotope Notation' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
