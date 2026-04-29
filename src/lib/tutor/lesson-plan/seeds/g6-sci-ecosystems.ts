/**
 * Grade 6 Science — Ecosystems and Energy Flow.
 * NGSS MS-LS2-1 / MS-LS2-3: dynamics of populations + energy flow.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SCI_ECOSYSTEMS: LessonPlan = {
  id: 'evelyn.g6.science.life.ecosystems.v1',
  title: 'Ecosystems and How They Work',
  curriculum: 'NGSS', grade: '6', subject: 'science', topic: 'ecology', locale: 'en',
  los: [{ id: 'ngss.ms-ls2-1', description: 'Analyze and interpret data to provide evidence for the effects of resource availability on organisms and populations of organisms in an ecosystem.', standard: 'NGSS.MS-LS2-1' }],
  prerequisites: ['ngss.5-ls2-1'], followUps: ['ngss.hs-ls2-2'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in interdependence.', script: 'Wolves were nearly hunted to extinction in Yellowstone. When they came back, the WHOLE ecosystem changed — even the rivers shifted course. How can one species do that?', estimatedMinutes: 2 },
    { id: 'concept-ecosystem', kind: 'concept', goal: 'Ecosystem = community of living things + non-living environment, all interacting.', keyIdeas: [
      'POPULATION = all members of one species in an area (all the wolves in Yellowstone).',
      'COMMUNITY = all populations in an area (wolves + elk + grass + trees + rabbits + …).',
      'ECOSYSTEM = community + non-living environment (rocks, water, climate).',
      'BIOTIC factors = living things. ABIOTIC factors = non-living (sunlight, water, temperature).',
      'Organisms compete for resources: food, water, space, mates.',
      'Limiting resources cap population size.',
    ], vocabulary: [{ term: 'population', definition: 'all members of one species in one place.' }, { term: 'community', definition: 'all populations in an area.' }, { term: 'ecosystem', definition: 'community + environment, interacting.' }], estimatedMinutes: 5 },
    { id: 'concept-relationships', kind: 'concept', goal: 'Species interact: predator-prey, competition, cooperation, parasitism.', keyIdeas: [
      'PREDATION: one eats the other (wolf eats elk).',
      'COMPETITION: species or members compete for limited resources.',
      'MUTUALISM: both benefit (bees + flowers).',
      'COMMENSALISM: one benefits, other unaffected (barnacles on whales).',
      'PARASITISM: one benefits, other harmed (tapeworms in animals).',
    ], estimatedMinutes: 4 },
    { id: 'worked-yellowstone', kind: 'worked_example', problem: 'Wolves return to Yellowstone after 70 years gone. Trace the cascade of effects.', steps: [
      'Wolves prey on ELK → elk population drops + elk avoid grazing in valleys (afraid of ambush).',
      'Plants in valleys (willows, aspens) recover — no longer constantly eaten.',
      'BEAVERS return (need willows for dams).',
      'Beaver dams create wetlands → habitat for fish, ducks, otters.',
      'Tree roots stabilize riverbanks → rivers run differently.',
      'One predator triggered changes through dozens of species AND the physical landscape. Called a "trophic cascade."',
    ], answer: 'Wolves → fewer elk grazing → plants recover → beavers return → wetlands form → rivers shift. One species, ecosystem-wide effects.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A pond ecosystem has algae, small fish that eat algae, larger fish that eat the small fish, and herons that eat the larger fish. If a disease wipes out the algae, what happens to the rest of the food web?', expectedAnswer: 'Small fish lose their food → starve and decline. Larger fish lose THEIR food (the small fish) → also decline. Herons lose food → leave or starve. The ecosystem collapses or restructures from the bottom up.', responseFormat: 'free', hints: ['Trace the chain — what eats what?', 'Loss at the bottom propagates UP.'], estimatedMinutes: 3 },
    { id: 'misconception-balance-static', kind: 'misconception_check', question: 'A friend says "ecosystems are perfectly balanced — they don\'t change." Right?', commonErrors: [{ answer: 'Yes — perfectly balanced.', misconception: 'Believing ecosystems are static.', correctsTo: 'Ecosystems are DYNAMIC — populations rise and fall, species evolve, climate shifts, sometimes major disturbances reshape everything (fires, floods, invasive species). "Balance" is more like an ongoing dance than a frozen state.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Population → community → ecosystem.', 'Biotic + abiotic factors interact.', 'Species relationships: predation, competition, mutualism, commensalism, parasitism.', 'Trophic cascades: one species can shift everything.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
