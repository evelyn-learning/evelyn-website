/**
 * Chemistry — Unit 2, Topic 2.1: Development of the Atomic Model.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u2-atomic-theory.ts
 * (planId evelyn.hs.chem.atomic-theory.v1).
 *
 * Compressed reference notes — the evidence trail from Dalton to the
 * quantum cloud, the two-observations/two-conclusions structure of the
 * gold-foil experiment, and the traps that come with both.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.atomic-theory';
const PLAN_ID = 'evelyn.hs.chem.atomic-theory.v1';

export const BASELINE_CHEM_U2_ATOMIC_THEORY: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 2,
  cedTopic: '2.1',
  cedTitle: 'Development of the Atomic Model',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'How an atomic model is built',
      content:
        'Nobody has ever seen an atom directly — every claim about its interior comes from an experiment. A model survives exactly as long as it explains every observation; the first result it cannot account for forces an EXTENSION, not a demolition. Each new model keeps what the old one explained and adds the missing piece.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Dalton (1803) — indivisible spheres',
      content:
        'Matter is made of tiny indivisible atoms; all atoms of an element are identical; compounds combine atoms in fixed whole-number ratios; reactions only REARRANGE atoms. Explains conservation of mass and fixed composition (water is always 8 g oxygen per 1 g hydrogen). Only "indivisible" and "identical" were later overturned — the rest still stands.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Thomson (1897) — the electron',
      content:
        'Evidence: a cathode-ray beam bent toward a positive plate, and the same negative particle appeared regardless of which metal formed the cathode. Conclusion: every atom contains e⁻, so atoms are NOT indivisible. His plum-pudding model embedded those electrons in a soft, spread-out sphere of positive charge.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Rutherford (1911) — the nucleus',
      content:
        'Fast, heavy, positive alpha particles fired at gold foil gave TWO observations with TWO separate conclusions. Nearly all passed straight through → the atom is mostly EMPTY space. Roughly 1 in 8,000 deflected sharply or reversed → all the positive charge and nearly all the mass sit in a tiny dense central NUCLEUS. Spread-out pudding could never reverse an alpha particle.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Bohr (1913) — fixed energy levels',
      content:
        'Evidence: heated hydrogen emits a few sharp colored lines, never a full rainbow. Only certain energies come out, so electrons can only hold certain energies — they occupy fixed energy levels, and light is emitted when an electron drops from a higher level to a lower one. Works beautifully for hydrogen; breaks down for many-electron atoms.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Quantum / cloud model (1926 onward)',
      content:
        'Electrons are not beads on tracks. An orbital is a REGION OF PROBABILITY — where an electron is likely to be found, not a path it follows. Bohr\'s quantized energy levels survived into this model; his circular orbits did not. This is the model behind electron configuration and every bonding rule that follows.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Core vocabulary',
      content:
        'cathode ray — the stream of electrons emitted from the negative electrode of an evacuated tube. nucleus — the tiny, dense, positively charged core holding nearly all of an atom\'s mass. orbital — a region around the nucleus where an electron is likely to be found, rather than a fixed path.',
    },
  ],
  methods: [
    {
      title: 'Read a scattering experiment: one observation, one conclusion',
      when_to_use:
        'Any question that gives experimental results (gold foil, cathode ray, line spectra) and asks what they reveal about atomic structure.',
      steps: [
        'State the PREDICTION of the model being tested. Plum pudding: charge spread thinly, electrons far too light to move a heavy alpha — so every alpha should slip through with at most a tiny nudge.',
        'Take each observation SEPARATELY. Never let one observation carry two conclusions or borrow another\'s.',
        'Majority passing straight through → whatever they hit cannot fill the atom → the atom is overwhelmingly empty space.',
        'Rare large-angle deflection or backscatter → the target must be (i) positively charged, so it repels, and (ii) far MORE massive than the alpha, so it is not knocked aside.',
        'Combine: the target is tiny (hits are rare) yet holds the positive charge and nearly all the mass (it can reverse an alpha) — that is the nucleus, with electrons filling the huge empty volume around it.',
        'Treat RARITY as evidence, not noise: 1 in 8,000 is exactly what a minuscule target predicts.',
      ],
      example: {
        problem:
          'Alpha particles hit gold foil a few hundred atoms thick; nearly all pass through undeflected, about 1 in 8,000 deflects through a large angle, a few come almost straight back. What does each result show?',
        solution:
          'Straight-through majority → the atom is mostly empty space. Rare large deflections and backscatter → a tiny, dense, positively charged nucleus that a spread-out positive pudding cannot produce.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Audit a claim about an atomic-model experiment',
      when_to_use:
        'When a statement about a historical experiment must be corrected — the errors are almost always (a) inverted numbers, (b) an observation matched to the wrong conclusion, (c) "the old model was simply wrong".',
      steps: [
        'Check the PROPORTIONS first. Most alphas went through; only about 1 in 8,000 deflected strongly. Inverting this destroys the whole argument.',
        'Check the OBSERVATION-to-CONCLUSION pairing. Empty space comes from the straight-through majority; the nucleus comes from the rare backscatter.',
        'Check the SIZE claim. If positive charge filled the atom, deflections would be common. The nucleus is roughly 1/100,000 of the atom\'s diameter.',
        'Check the MODEL-HISTORY claim. Rutherford kept Thomson\'s electrons and only relocated the positive charge from a spread-out sphere into a tiny core — refinement, not deletion.',
        'Restate the corrected version with each observation attached to its own conclusion.',
      ],
      relatedLoIds: [LO],
    },
    {
      title: 'Apply Dalton conservation of mass in a sealed vessel',
      when_to_use:
        'A closed/sealed container reacts completely and one reactant or product mass is missing.',
      steps: [
        'Confirm the system is CLOSED — atoms are only rearranged, so total reactant mass = total product mass.',
        'Write the mass balance: (sum of reactant masses) = (sum of product masses).',
        'Substitute the known masses and solve for the single unknown.',
        'Check the leftover language: "reacts completely, nothing left over" means no unreacted mass to subtract.',
      ],
      example: {
        problem: '4.0 g of hydrogen reacts completely with oxygen in a sealed flask to give 36.0 g of water. What mass of oxygen was consumed?',
        solution: '4.0 + m(O₂) = 36.0 → m(O₂) = 32 g.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Evidence order: Dalton (indivisible spheres) → Thomson (electrons in a positive pudding) → Rutherford (tiny dense nucleus) → Bohr (fixed energy levels) → quantum cloud (orbitals as probability regions).',
      kind: 'tip',
    },
    {
      content:
        'Gold foil = two results, two conclusions. Nearly all straight through → mostly empty space. About 1 in 8,000 deflected or reversed → tiny, dense, positive nucleus. Never swap which result proves which.',
      kind: 'common-error',
    },
    {
      content:
        'Scale trap: the nucleus is about 1/100,000 the diameter of the atom — a marble at the center of a football stadium. Every textbook drawing exaggerates it enormously, which is why "mostly empty space" feels wrong.',
      kind: 'gotcha',
    },
    {
      content:
        'New models REFINE old ones, they do not erase them. Dalton\'s conservation of mass and Thomson\'s electron are both still part of chemistry. Saying "Rutherford proved Thomson wrong" loses credit.',
      kind: 'gotcha',
    },
    {
      content:
        'Bohr shell drawings use circles because they are easy to sketch, not because electrons move in circles. What survived Bohr is quantized ENERGY; what died is the orbit. Line spectra are the fingerprint of that restricted energy — only certain colors appear because only certain energy drops exist.',
      kind: 'tip',
    },
  ],
};
