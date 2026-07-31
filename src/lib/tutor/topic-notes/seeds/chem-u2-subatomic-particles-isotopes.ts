/**
 * Chemistry — Unit 2, Topic 2.2: Subatomic Particles & Isotope Notation.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u2-subatomic-particles-isotopes.ts
 * (planId evelyn.hs.chem.subatomic-particles-isotopes.v1).
 *
 * Compressed reference notes — the three-count bookkeeping every later
 * unit leans on, plus the traps: mass number read as a neutron count,
 * ion charge sign flipped, isotope confused with ion.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.subatomic-particles-isotopes';
const PLAN_ID = 'evelyn.hs.chem.subatomic-particles-isotopes.v1';

export const BASELINE_CHEM_U2_SUBATOMIC_PARTICLES_ISOTOPES: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Subatomic Particles & Isotope Notation',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Three particles, three jobs',
      content:
        'PROTON — charge +1, mass ≈ 1 amu, in the nucleus; fixes which ELEMENT you have. NEUTRON — charge 0, mass ≈ 1 amu, also in the nucleus; adds MASS and nothing else. ELECTRON — charge −1, mass ≈ 1/1836 amu, in shells outside the nucleus; sets CHARGE and does all the chemistry. Nearly all the mass sits in a nucleus about 100,000 times smaller than the atom.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Z, A, and the neutron subtraction',
      content:
        'Z (atomic number) = number of PROTONS = the element\'s identity, the whole number printed on each periodic-table box. A (mass number) = protons + neutrons, always a whole number. Therefore NEUTRONS = A − Z. A is never the neutron count on its own — that subtraction is the most-skipped step in the topic.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Isotope notation',
      content:
        'Full form puts the mass number as a leading superscript and the atomic number as a leading subscript: ³⁵₁₇Cl, ³⁷₁₇Cl. Hyphen notation says the same thing with less typing: chlorine-35, chlorine-37. The subscript is redundant — the element symbol already fixes Z — which is why hyphen notation is legal.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Isotopes = same Z, different A',
      content:
        'Same element, different neutron count, therefore different mass. Chemistry is run by electrons, and isotopes of one element have identical electron arrangements, so isotopes react essentially identically — chlorine-35 and chlorine-37 both make ordinary table salt.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Charge comes from electrons only',
      content:
        'A neutral atom has electrons = protons. Charge is written after the symbol: Ca²⁺, S²⁻. ELECTRONS = Z − charge. A 2+ ion LOST two electrons (two fewer than Z); a 2− ion GAINED two. Protons and neutrons never change when an ion forms.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Isotope ≠ ion, and same A ≠ same element',
      content:
        'An isotope differs in NEUTRONS (mass changes, charge does not); an ion differs in ELECTRONS (charge changes, mass barely does). ³⁵Cl and ³⁷Cl are isotopes; Cl and Cl⁻ are an atom and its ion; ³⁷Cl⁻ is both at once. Matching mass numbers prove nothing: ¹⁴C (6 protons) and ¹⁴N (7 protons) are different elements — isobars, not isotopes.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Core vocabulary',
      content:
        'atomic number (Z) — number of protons; defines the element. mass number (A) — protons plus neutrons, the total nuclear particle count. isotope — one of two or more atoms of the same element differing in neutron count and therefore mass. ion — an atom that has gained or lost electrons and so carries a net charge.',
    },
  ],
  methods: [
    {
      title: 'Three-count readout from isotope notation',
      when_to_use:
        'Given a symbol like ³⁵₁₇Cl, ²⁷Al³⁺, or a hyphen name plus the element\'s atomic number, and asked for protons, neutrons, and electrons.',
      steps: [
        'PROTONS: read Z from the element symbol (or the subscript). This never changes — it is what makes the atom that element.',
        'NEUTRONS: read A (the superscript, or the number after the hyphen) and subtract. Neutrons = A − Z.',
        'ELECTRONS: neutral atom → electrons = Z. Charged species → electrons = Z − charge (positive charge means electrons were LOST).',
        'Verify: (protons) − (electrons) must reproduce the written charge, and (protons) + (neutrons) must reproduce A.',
        'Write the result in full notation if asked: A on top, Z below, charge after the symbol.',
      ],
      example: {
        problem: 'Chlorine has Z = 17. Give protons, neutrons, electrons for neutral chlorine-35 and chlorine-37.',
        solution:
          'Chlorine-35: 17 protons, 35 − 17 = 18 neutrons, 17 electrons (³⁵₁₇Cl). Chlorine-37: 17 protons, 37 − 17 = 20 neutrons, 17 electrons (³⁷₁₇Cl). Two extra neutrons is the entire difference; identical electrons → identical chemistry.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Audit a stated proton/neutron/electron count',
      when_to_use:
        'A given answer must be checked or corrected — the two standard errors are copying A across as the neutron count and flipping the ion sign.',
      steps: [
        'Protons: confirm against Z. Forming an ion never touches the nucleus, so this figure is usually the one that is right.',
        'Neutrons: reject any answer equal to A. Recompute A − Z.',
        'Electrons: check the sign direction. A superscript "+" means electrons were REMOVED, so electrons < protons; "−" means electrons were added.',
        'Sanity-check the net charge from the corrected counts — positives from protons minus negatives from electrons must equal the written charge. A count that cannot reproduce the charge is wrong.',
      ],
      example: {
        problem: 'A student writes: "⁴⁰Ca²⁺ has 20 protons, 40 neutrons, 22 electrons." Calcium is Z = 20. Correct it.',
        solution:
          'Protons 20 ✓. Neutrons = 40 − 20 = 20, not 40. Electrons = 20 − 2 = 18, not 22 (a 2+ ion lost two). Check: 20 − 18 = 2+ ✓. Corrected: 20 protons, 20 neutrons, 18 electrons.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Back-solve counts when Z is not given',
      when_to_use:
        'The problem supplies a mass number plus a neutron count (or an electron count) and no element name.',
      steps: [
        'Recover Z from the mass-number relationship: protons = A − neutrons.',
        'Identify the element from Z if the question names it (Z is the periodic-table address).',
        'Apply the charge rule to get electrons: electrons = Z − charge.',
        'Re-derive A and the charge from your final counts as a check.',
      ],
      example: {
        problem: 'A monatomic ion has A = 65, 36 neutrons, charge 2+. How many electrons?',
        solution: 'Protons = 65 − 36 = 29. Electrons = 29 − 2 = 27.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Three counts, three jobs: protons set the element, neutrons set the mass, electrons set the charge and do the chemistry.',
      kind: 'tip',
    },
    {
      content:
        'Z = protons; A = protons + neutrons; so neutrons = A − Z. The mass number is NEVER the neutron count by itself — this is the single most common error in the topic.',
      kind: 'common-error',
    },
    {
      content:
        'Electrons = Z − charge. Positive ion → LOST electrons (fewer than protons). Negative ion → gained electrons. The nucleus is untouched either way, so protons and neutrons are identical before and after.',
      kind: 'common-error',
    },
    {
      content:
        'Isotope ≠ ion. Isotopes differ in neutrons (mass changes, charge does not); ions differ in electrons (charge changes, mass barely does). An atom can be both at once, like ³⁷Cl⁻.',
      kind: 'gotcha',
    },
    {
      content:
        'Same mass number does not mean same element: ¹⁴C and ¹⁴N share A = 14 but have 6 and 7 protons. Identity is protons alone — 17 protons is chlorine, 18 is argon. And the decimal on the periodic table (35.45) is a mixture average, not any one atom\'s mass.',
      kind: 'gotcha',
    },
  ],
};
