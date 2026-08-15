/**
 * Grade 7 Science — Conservation of Mass.
 * NGSS MS-PS1-5: develop and use a model to describe how the total
 * number of atoms does not change in a chemical reaction.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SCI_CONSERVATION_MASS: LessonPlan = {
  id: 'evelyn.g7.science.chemistry.conservation-mass.v1',
  title: 'Conservation of Mass in Reactions',
  curriculum: 'NGSS', grade: '7', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.ms-ps1-5', description: 'Develop and use a model to describe how the total number of atoms does not change in a chemical reaction and thus mass is conserved.', standard: 'NGSS.MS-PS1-5' }],
  prerequisites: ['ngss.ms-ps1-2'], followUps: ['ngss.hs-ps1-7'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor with a paradox.', script: 'Burn a 100g log. The ash weighs only ~5g. The log "lost" 95g. But scientists insist mass was CONSERVED. How?', estimatedMinutes: 2 },
    { id: 'concept-conservation', kind: 'concept', goal: 'Atoms are rearranged, not destroyed. Total mass before = total mass after — IF you count the gases too.', keyIdeas: [
      'Conservation of Mass: total mass of REACTANTS = total mass of PRODUCTS in a chemical reaction.',
      'Atoms aren\'t created or destroyed — just rearranged into new molecules.',
      'In an OPEN system, gases escape — so the visible mass appears to change. The "missing" mass left as a gas.',
      'In a CLOSED (sealed) container, the scale never changes during reactions.',
      'Antoine Lavoisier proved this in the 1770s using sealed flasks.',
    ], vocabulary: [{ term: 'closed system', definition: 'sealed; no matter enters or leaves.' }, { term: 'open system', definition: 'matter can enter/leave (gases escape).' }], estimatedMinutes: 4 },
    { id: 'concept-balanced-equations', kind: 'concept', goal: 'Balanced chemical equations show conservation: same atoms on both sides.', keyIdeas: [
      'Example: 2 H₂ + O₂ → 2 H₂O.',
      'LEFT SIDE atoms: 4 H + 2 O.',
      'RIGHT SIDE atoms: 4 H + 2 O.',
      'Same atoms — just rearranged. Mass conserved.',
      'Coefficients (numbers in front) are needed to balance.',
    ], suggestedTools: ['show_balanced_equation'], estimatedMinutes: 3 },
    { id: 'worked-burning-log', kind: 'worked_example', problem: 'A 100g log burns. Ash weighs 5g. Where did the 95g go?', steps: [
      'Wood + O₂ (from air) → CO₂ + H₂O (vapor) + ash + a little soot.',
      'CO₂ and H₂O ESCAPED as gases — invisible.',
      'If you weighed: log + oxygen used, vs ash + CO₂ + H₂O collected, the totals match.',
      'Wood became 95g of GASES + 5g of ash. Mass conserved; just left the visible system.',
    ], answer: 'The 95g became invisible gases (CO₂ + H₂O vapor) that escaped into the air.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'You drop a tablet of antacid into 200g of water in a sealed bottle. It fizzes (CO₂ generated). After fizzing stops, what does the sealed bottle weigh?', expectedAnswer: '200g + the original tablet mass — because the bottle is SEALED, the CO₂ stays inside. Mass is conserved.', responseFormat: 'free', hints: ['Sealed bottle = closed system.', 'Where does the CO₂ go if the bottle is sealed?'], estimatedMinutes: 2 },
    { id: 'misconception-energy-disappears', kind: 'misconception_check', question: 'A friend says "in an explosion, mass is destroyed and turns into energy." Is mass destroyed in chemical reactions?', commonErrors: [{ answer: 'Yes — mass to energy.', misconception: 'Confusing nuclear with chemical reactions.', correctsTo: 'In CHEMICAL reactions, mass is FULLY conserved — the energy released came from REARRANGING atoms, not destroying mass. Mass-to-energy (E=mc²) only happens in NUCLEAR reactions, and even then the mass change is tiny.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Mass conserved in chemical reactions.', 'Atoms rearranged; not created or destroyed.', '"Lost" mass usually escaped as gas.', 'Closed system = always conserved on the scale.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
