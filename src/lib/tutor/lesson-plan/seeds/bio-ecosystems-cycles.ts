/**
 * HS Biology — Ecosystem Dynamics and Biogeochemical Cycles.
 * NGSS HS-LS2-3 / HS-LS2-4 / HS-LS2-5: matter and energy flow.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_ECOSYSTEMS_CYCLES: LessonPlan = {
  id: 'evelyn.hs.science.biology.ecosystems-cycles.v1',
  title: 'Ecosystem Dynamics and Biogeochemical Cycles',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'ecology', locale: 'en',
  los: [{ id: 'ngss.hs-ls2-4', description: 'Use mathematical representations to support claims for the cycling of matter and flow of energy among organisms in an ecosystem.', standard: 'NGSS.HS-LS2-4' }],
  prerequisites: ['hs.bio.ecology-populations'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in the carbon path.', script: 'The carbon atom in your breath right now might have been in a dinosaur 65 million years ago, then in soil, then a tree, then a cow, then your dinner. Carbon doesn\'t leave Earth — it cycles. Same with nitrogen, water, phosphorus.', estimatedMinutes: 2 },
    { id: 'concept-energy-flow', kind: 'concept', goal: 'Energy flows ONE WAY through ecosystems; ~10% transfers between trophic levels.', keyIdeas: [
      'Sunlight enters → producers (plants) capture ~1% via photosynthesis.',
      'TROPHIC LEVELS:',
      '  · Producers (plants) → 1° consumers (herbivores) → 2° consumers (carnivores) → 3° consumers (top predators).',
      'Each transfer LOSES ~90% of energy (lost as heat, used in metabolism).',
      'RULE OF 10%: only ~10% of energy passes to next trophic level.',
      'This is why food chains rarely have more than 4-5 levels — not enough energy left.',
      'Decomposers (fungi, bacteria) break down dead matter → return nutrients to soil.',
    ], vocabulary: [{ term: 'trophic level', definition: 'feeding level in a food chain.' }, { term: 'producer', definition: 'organism that makes its own food.' }, { term: 'decomposer', definition: 'organism that breaks down dead material.' }], suggestedTools: ['show_diagram'], estimatedMinutes: 4 },
    { id: 'concept-cycles', kind: 'concept', goal: 'Carbon, nitrogen, water, and phosphorus cycle through Earth\'s reservoirs.', keyIdeas: [
      'CARBON CYCLE: photosynthesis (CO₂ → sugars) ↔ respiration (sugars → CO₂). Fossil fuel burning adds CO₂ fast.',
      'NITROGEN CYCLE: atmosphere is 78% N₂, but most life can\'t use it. Bacteria FIX nitrogen → ammonia → nitrates → plants → animals → back to atmosphere.',
      'WATER CYCLE: evaporation → condensation → precipitation → collection. Drives weather + life.',
      'PHOSPHORUS CYCLE: rocks weather → soil → plants → animals → death/decay → soil. NO atmospheric phase. Slow.',
      'KEY: matter is RECYCLED. Energy is NOT — it flows in and is lost as heat.',
    ], estimatedMinutes: 5 },
    { id: 'worked-pyramid', kind: 'worked_example', problem: 'A grassland gets 100,000 kcal of sunlight energy. Apply the 10% rule through 4 trophic levels.', steps: [
      'Producers (grass) capture ~1% of sunlight: 1,000 kcal.',
      '1° consumers (grasshoppers): 10% of 1,000 = 100 kcal.',
      '2° consumers (mice): 10% of 100 = 10 kcal.',
      '3° consumers (hawks): 10% of 10 = 1 kcal.',
      'Hawks have very little energy left → small populations of top predators.',
      'This is why ecosystems can\'t sustain 5+ trophic levels.',
    ], answer: 'Energy drops by ~90% per trophic level → only 1 kcal reaches the hawk. Top predators rare for this reason.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Why is eating plants directly more energy-efficient than eating meat (from animals that ate plants)?', expectedAnswer: 'When you eat a cow, the cow already lost ~90% of the plant energy in its metabolism. So eating beef = ~10% the original plant energy. Eating plants directly = ~100%. Plant-based diets feed more people from the same farmland because no trophic-level energy loss.', responseFormat: 'free', hints: ['Apply the 10% rule.', 'Each trophic level loses energy.'], estimatedMinutes: 3 },
    { id: 'misconception-decomposer-waste', kind: 'misconception_check', question: 'A friend says "decomposers are gross — they just deal with waste." Why are they actually essential?', commonErrors: [{ answer: 'Yes — just waste handlers.', misconception: 'Underestimating decomposers.', correctsTo: 'Decomposers RECYCLE nutrients (N, P, C) back into soil so plants can use them again. Without decomposers, dead matter would pile up, nutrients would lock up in corpses, and plants would have nothing to grow on. Within a few decades, ecosystems would collapse.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Energy flows ONE WAY (in as light, out as heat); matter CYCLES.', '10% rule: energy transfer between trophic levels is ~10%.', 'Carbon, nitrogen, water, phosphorus all cycle.', 'Decomposers are essential nutrient recyclers.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
