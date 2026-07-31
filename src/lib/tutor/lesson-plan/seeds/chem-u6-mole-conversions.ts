/**
 * Chemistry — The Mole & Stoichiometry: Mole Conversions.
 *
 * The mole as the hub of a three-spoke conversion map (NGSS HS-PS1-7):
 * mass via molar mass, particles via 6.02 × 10²³, gas volume via
 * 22.4 L/mol at STP. The classic errors get equal billing — applying
 * 22.4 L/mol to a liquid, and multiplying when the units demand division.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U6_MOLE_CONVERSIONS: LessonPlan = {
  id: 'evelyn.hs.chem.mole-conversions.v1',
  title: 'Mole Conversions: Mass, Particles & Gas Volume',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.mole-conversions',
      standard: 'CHEM-6.2',
      description:
        'Convert among mass, moles, number of particles, and gas volume at STP using molar mass, Avogadro\'s number, and the molar volume of a gas (NGSS HS-PS1-7).',
    },
  ],
  prerequisites: ['chem.the-mole-molar-mass'],
  followUps: ['chem.percent-composition-empirical'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The mole as the chemist\'s counting trick — you weigh a sample, but what you actually learn is how many particles are in it.',
      script:
        'A pharmacist filling a prescription cannot count molecules of medicine, and a water-treatment operator cannot count chlorine atoms going into a reservoir. They do something cleverer: they weigh. Because one mole of any substance contains 6.02 × 10²³ particles, a balance becomes a particle counter — and for gases, so does a measuring tank, since one mole of ANY gas fills 22.4 L at STP. Today you learn the conversion map that connects grams, particles, and liters through a single hub: the mole. Every stoichiometry problem for the rest of this course starts here.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mole-hub',
      kind: 'concept',
      goal: 'Moles as the central hub with three spokes, the divide-versus-multiply decision, and the two classic traps.',
      keyIdeas: [
        'MOLES ARE THE HUB — mass, particle count, and gas volume never convert directly into each other. Each one connects to MOLES, and every trip runs through that hub. Drawing the hub with three spokes turns every problem in this lesson into "which spokes do I ride?"',
        'SPOKE 1: MASS ↔ MOLES via MOLAR MASS (g/mol) — grams ÷ molar mass = moles; moles × molar mass = grams. Molar mass comes from the formula: CO₂ = 12.0 + 2(16.0) = 44.0 g/mol.',
        'SPOKE 2: MOLES ↔ PARTICLES via AVOGADRO\'S NUMBER — 1 mol = 6.02 × 10²³ particles. moles × 6.02 × 10²³ = particles; particles ÷ 6.02 × 10²³ = moles. "Particles" means whatever the formula names: atoms for Fe, molecules for CO₂, formula units for NaCl.',
        'SPOKE 3: MOLES ↔ GAS VOLUME via MOLAR VOLUME — at STP (0 °C and 1 atm) one mole of ANY gas occupies 22.4 L. liters ÷ 22.4 = moles; moles × 22.4 = liters. Identity does not matter: 1 mol of H₂ and 1 mol of CO₂ both fill 22.4 L, even though one weighs 2.0 g and the other 44.0 g.',
        'TWO-SPOKE TRIPS — grams to particles, or grams to liters, is never one step. Ride into the hub, then back out: grams → moles → particles. Skipping the hub is skipping the only unit that all three spokes share.',
        'DIVIDE OR MULTIPLY? LET UNITS DECIDE — write the conversion factor so the unit you are leaving cancels: 88 g × (1 mol / 44.0 g) leaves mol. If your setup leaves g²/mol, you flipped the factor. Dimensional analysis, not memory, picks the direction.',
        'THE TRAP: 22.4 L/mol IS FOR GASES AT STP ONLY — it does not describe liquids or solids, and it does not hold at other temperatures and pressures. One mole of liquid water is about 18 mL, not 22.4 L; gas particles are simply spread thousands of times farther apart.',
        'THE TRAP: MOLECULES ARE NOT ATOMS — 1 mol of CO₂ holds 6.02 × 10²³ MOLECULES but three times that many atoms, because each molecule carries 3 atoms. Read the question for which particle it wants before you reach for Avogadro\'s number.',
      ],
      vocabulary: [
        { term: 'Avogadro\'s number', definition: 'the number of particles in one mole, 6.02 × 10²³.' },
        { term: 'molar mass', definition: 'the mass in grams of one mole of a substance, in g/mol, summed from the formula\'s atomic masses.' },
        { term: 'molar volume', definition: 'the volume one mole of any gas occupies at STP, 22.4 L/mol.' },
        { term: 'STP', definition: 'standard temperature and pressure: 0 °C and 1 atm.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-grams-to-molecules',
      kind: 'worked_example',
      problem:
        'How many molecules of carbon dioxide are in 88.0 g of CO₂? Molar mass CO₂ = 44.0 g/mol; one mole contains 6.02 × 10²³ particles.',
      steps: [
        'Map the trip: you have grams and want molecules — two different spokes, so the route is grams → moles → molecules, through the hub.',
        'Ride spoke 1 into the hub: 88.0 g × (1 mol / 44.0 g) = 2.00 mol CO₂. The grams cancel, leaving moles, which confirms the factor was written right side up.',
        'Ride spoke 2 out of the hub: 2.00 mol × (6.02 × 10²³ molecules / 1 mol) = 1.204 × 10²⁴ molecules.',
        'Sanity check: 88.0 g is twice the molar mass, so the answer should be about two Avogadro\'s numbers — and 1.204 × 10²⁴ is exactly 2 × 6.02 × 10²³. If you wanted ATOMS instead, you would multiply once more by 3 atoms per molecule.',
      ],
      answer: '1.204 × 10²⁴ molecules of CO₂ (grams → moles → molecules)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-molar-volume-trap',
      kind: 'worked_example',
      problem:
        'A student writes: "36.0 g of liquid water is 2.00 mol, and one mole occupies 22.4 L, so the water fills 44.8 L — about half a bathtub." Molar mass H₂O = 18.0 g/mol. Diagnose the error and give a sensible volume.',
      steps: [
        'Check the first move: 36.0 g ÷ 18.0 g/mol = 2.00 mol H₂O. That step is correct — spoke 1 works for any substance.',
        'Name the bad move: the student rode spoke 3, but 22.4 L/mol is the molar volume of a GAS at STP. The sample here is liquid water, so that spoke does not exist for it.',
        'Why gases are special: in a gas the particles are separated by huge empty gaps, so the volume depends on particle COUNT, not identity — that is why 22.4 L/mol works for every gas alike. In a liquid the particles touch, so volume depends on the substance itself.',
        'Use liquid water\'s density instead (1.00 g/mL): 36.0 g ÷ 1.00 g/mL = 36.0 mL — roughly two tablespoons, about 1,200 times smaller than the student\'s answer. If 36.0 g of water were boiled to steam at STP, THEN it would occupy 2.00 mol × 22.4 L/mol = 44.8 L.',
      ],
      answer: 'About 36.0 mL as a liquid — 22.4 L/mol applies only to gases at STP (as steam it would be 44.8 L)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-route-grams-to-molecules',
      kind: 'try_yourself',
      problem:
        'You are given a mass in grams of CO₂ and asked for the number of molecules. Which sequence of operations is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Divide the grams by the molar mass, then multiply by 6.02 × 10²³', correct: true },
        { id: 'b', text: 'Multiply the grams by the molar mass, then multiply by 6.02 × 10²³' },
        { id: 'c', text: 'Divide the grams by 22.4, then multiply by 6.02 × 10²³' },
        { id: 'd', text: 'Multiply the grams by 6.02 × 10²³ — grams and moles are the same count' },
      ],
      expectedAnswer: 'Divide the grams by the molar mass, then multiply by 6.02 × 10²³',
      hints: [
        'Every trip runs through the hub: grams → moles → particles. Which factor gets you into moles, and which gets you out to particles?',
        'Write the units: g × (1 mol / g) leaves mol; then mol × (particles / mol) leaves particles. Any setup that does not cancel grams first is flipped.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-atoms-vs-molecules',
      kind: 'try_yourself',
      problem:
        'How many total ATOMS are in 1.00 mol of CO₂? One mole contains 6.02 × 10²³ particles.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1.81 × 10²⁴ atoms — 6.02 × 10²³ molecules, each holding 3 atoms', correct: true },
        { id: 'b', text: '6.02 × 10²³ atoms — one mole is always 6.02 × 10²³ atoms' },
        { id: 'c', text: '1.204 × 10²⁴ atoms — count only the two oxygens' },
        { id: 'd', text: '3 atoms — the formula CO₂ shows 3 atoms' },
      ],
      expectedAnswer: '1.81 × 10²⁴ atoms — 6.02 × 10²³ molecules, each holding 3 atoms',
      hints: [
        'Avogadro\'s number counts the particle the formula names — here, CO₂ MOLECULES. The question asks for something smaller.',
        'Each CO₂ molecule contains 1 carbon plus 2 oxygens = 3 atoms, so multiply the molecule count by 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A sample of nitrogen gas occupies 44.8 L at STP. At STP one mole of any gas occupies 22.4 L. How many moles of N₂ are in the sample? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '2',
      hints: [
        'You are riding spoke 3 toward the hub: liters ÷ 22.4 L/mol = moles. Write the units so liters cancel.',
        '44.8 ÷ 22.4 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-multiply-direction',
      kind: 'misconception_check',
      question:
        'A student converts 18.0 g of water to moles by multiplying: 18.0 g × 18.0 g/mol = 324 mol H₂O. What went wrong, and how would checking units have caught it instantly?',
      commonErrors: [
        {
          answer: 'Multiply grams by molar mass to get moles',
          misconception: 'Treating molar mass as a number to multiply by rather than a conversion factor whose units must cancel.',
          correctsTo:
            'Molar mass is a ratio, 18.0 g per 1 mol, and it must be written so the unit you are leaving cancels: 18.0 g × (1 mol / 18.0 g) = 1.00 mol. The student\'s setup leaves g²/mol, which is not a unit of anything — a dead giveaway. Sanity check too: a sample weighing exactly one molar mass is exactly one mole, and 324 moles of water would weigh nearly 6 kg.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Moles are the hub: mass, particles, and gas volume each connect only to moles, never straight to each other.',
        'Spoke 1 — grams ÷ molar mass = moles; moles × molar mass = grams.',
        'Spoke 2 — moles × 6.02 × 10²³ = particles; particles ÷ 6.02 × 10²³ = moles.',
        'Spoke 3 — at STP, liters ÷ 22.4 = moles; moles × 22.4 = liters, and it works for any gas regardless of identity.',
        '22.4 L/mol is for GASES at STP only — one mole of liquid water is about 18 mL, not 22.4 L.',
        'Let units pick divide versus multiply: write the factor so the old unit cancels, and count atoms versus molecules carefully.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Mole Conversions: Mass, Particles & Gas Volume' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
