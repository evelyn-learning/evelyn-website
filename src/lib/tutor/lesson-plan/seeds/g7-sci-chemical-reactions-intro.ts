/**
 * Grade 7 Science — Chemical Reactions Intro.
 * NGSS MS-PS1-2 / MS-PS1-5: substances change to different ones in
 * reactions; conservation of mass.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SCI_CHEMICAL_REACTIONS_INTRO: LessonPlan = {
  id: 'evelyn.g7.science.chemistry.reactions-intro.v1',
  title: 'Chemical Reactions Intro',
  curriculum: 'NGSS', grade: '7', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.ms-ps1-2', description: 'Analyze and interpret data on the properties of substances before and after the substances interact to determine if a chemical reaction has occurred.', standard: 'NGSS.MS-PS1-2' }],
  prerequisites: ['ngss.ms-ps1-1'], followUps: ['ngss.hs-ps1-2'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor with a familiar reaction.', script: 'Strike a match. Wood + heat + oxygen → flame, smoke, ash. The match was made of WOOD; afterward, no more wood. New stuff appeared. That\'s a chemical reaction.', estimatedMinutes: 2 },
    { id: 'concept-physical-vs-chemical', kind: 'concept', goal: 'Distinguish physical changes (form changes, same substance) from chemical reactions (NEW substances form).', keyIdeas: [
      'PHYSICAL CHANGE: substance changes form but stays the same chemically. Ice melting (still water), salt dissolving (still salt molecules).',
      'CHEMICAL REACTION: atoms REARRANGE into NEW substances with NEW properties. Iron rusting, wood burning, baking a cake.',
      'Signs of chemical reaction: color change, gas bubbles (without boiling), heat or light released, precipitate forms (solid from liquids), unreversible.',
      'In a reaction, REACTANTS turn into PRODUCTS.',
      'Example: 2 H₂ + O₂ → 2 H₂O. H and O are reactants; water is product.',
      'CONSERVATION OF MASS: total mass before = total mass after. Atoms are rearranged, not created or destroyed.',
    ], vocabulary: [{ term: 'reactant', definition: 'starting substance.' }, { term: 'product', definition: 'substance formed.' }, { term: 'precipitate', definition: 'solid that forms when liquids react.' }], estimatedMinutes: 5 },
    { id: 'worked-baking-soda-vinegar', kind: 'worked_example', problem: 'You mix baking soda (NaHCO₃) with vinegar (acetic acid). It bubbles fiercely and the liquid feels colder. What happened, chemically?', steps: [
      'Bubbling = gas (CO₂) being released.',
      'Cold = energy was absorbed (endothermic reaction).',
      'New substances formed: water + sodium acetate + CO₂.',
      'Reaction: NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂.',
      'Reactants (baking soda + vinegar) → Products (sodium acetate + water + CO₂ gas).',
      'Mass is conserved — just hard to weigh because CO₂ escapes as gas.',
    ], answer: 'A chemical reaction — gas (CO₂) released, new substances formed, energy absorbed.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Classify each as physical or chemical change: (a) ice melting, (b) iron rusting, (c) wood burning, (d) salt dissolving in water.', expectedAnswer: '(a) physical (still water). (b) CHEMICAL (rust is a new substance, iron oxide). (c) CHEMICAL (wood becomes ash + smoke). (d) physical (salt is still salt, just spread out).', responseFormat: 'free', hints: ['New substance? → chemical.', 'Same stuff in different form? → physical.'], estimatedMinutes: 3 },
    { id: 'misconception-mass-disappears', kind: 'misconception_check', question: 'A friend burns wood and says "the wood disappeared — mass was lost." What\'s actually happening?', commonErrors: [{ answer: 'Yes — mass disappears.', misconception: 'Ignoring gases produced.', correctsTo: 'Mass is conserved! What "disappeared" became invisible products: CO₂ + H₂O VAPOR escaped into the air. If you collected ALL the products (gases + ash), the total mass equals what you started with (wood + oxygen used).' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Physical = same substance, different form.', 'Chemical = new substance, atoms rearranged.', 'Signs of chemical reaction: color, gas, heat, precipitate.', 'Mass is ALWAYS conserved (even if products are gases).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
