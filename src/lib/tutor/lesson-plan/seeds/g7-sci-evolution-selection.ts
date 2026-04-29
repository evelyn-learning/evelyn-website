/**
 * Grade 7 Science — Evolution and Natural Selection.
 * NGSS MS-LS4-4 / MS-LS4-6: natural selection drives evolution; species
 * change over generations through differential survival.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SCI_EVOLUTION_SELECTION: LessonPlan = {
  id: 'evelyn.g7.science.life.evolution-selection.v1',
  title: 'Evolution by Natural Selection',
  curriculum: 'NGSS', grade: '7', subject: 'science', topic: 'evolution', locale: 'en',
  los: [{ id: 'ngss.ms-ls4-4', description: 'Construct an explanation based on evidence that describes how genetic variations of traits in a population increase some individuals\' probability of surviving and reproducing in a specific environment.', standard: 'NGSS.MS-LS4-4' }],
  prerequisites: ['ngss.ms-ls3-1'], followUps: ['ngss.hs-ls4-2'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in a fast example.', script: 'Bacteria can evolve in DAYS. Spray antibiotics, kill 99% — but the 1% that survives reproduces, and now the new bacteria are antibiotic-resistant. That\'s evolution by natural selection happening fast enough to watch.', estimatedMinutes: 2 },
    { id: 'concept-natural-selection', kind: 'concept', goal: 'Natural selection has 4 ingredients: variation, heredity, differential survival/reproduction, time.', keyIdeas: [
      '1. VARIATION — individuals in a population are slightly different (height, color, behavior).',
      '2. HEREDITY — those traits pass to offspring through genes.',
      '3. DIFFERENTIAL SURVIVAL — some traits help survival/reproduction more in current conditions. Those individuals leave more offspring.',
      '4. TIME — over many generations, helpful traits become common; harmful ones become rare.',
      'Result: the population CHANGES (evolves) to fit its environment better.',
      'Charles DARWIN proposed this in 1859 (On the Origin of Species).',
      'KEY: individuals don\'t evolve. POPULATIONS evolve over generations.',
    ], vocabulary: [{ term: 'natural selection', definition: 'process where individuals with helpful traits leave more offspring.' }, { term: 'variation', definition: 'differences between individuals.' }, { term: 'fitness', definition: 'in evolution, ability to survive + reproduce in the current environment.' }], estimatedMinutes: 5 },
    { id: 'worked-peppered-moth', kind: 'worked_example', problem: 'In 1800s England, peppered moths were mostly LIGHT-colored, blending into clean tree bark. After factories darkened tree bark with soot, populations shifted to mostly DARK moths. Use natural selection to explain.', steps: [
      'VARIATION: moths existed in light AND dark forms (genetic variation).',
      'PRE-INDUSTRIAL: trees were light. Light moths CAMOUFLAGED on bark; dark moths visible to bird predators. Light moths survived more, reproduced more → light dominant.',
      'POST-INDUSTRIAL: trees darkened with soot. NOW dark moths camouflaged; light moths visible. Dark moths survived more, reproduced more.',
      'Over many generations: dark form became dominant. Same species, but the population changed.',
      'When clean-air laws cleaned the trees again, light moths recovered.',
    ], answer: 'Soot changed which color was camouflaged. Predators selected against the visible color. Population shifted dark, then back to light when conditions reverted.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A population of beetles lives in a green forest. Most beetles are green; a few are brown. A new bird predator arrives that easily spots brown beetles but struggles to see green ones. Predict what happens to the beetle population over many generations.', expectedAnswer: 'Brown beetles get eaten more → fewer survive to reproduce. Green beetles survive and reproduce more. Over generations, brown becomes rare and green becomes even MORE dominant — the population shifts further green.', responseFormat: 'free', hints: ['Which color survives the predator?', 'Survivors pass on their genes — what color do their offspring tend to be?'], estimatedMinutes: 3 },
    { id: 'misconception-individuals-evolve', kind: 'misconception_check', question: 'A friend says "the giraffes stretched to reach high leaves, and over time their necks got longer." Is this how evolution works?', commonErrors: [{ answer: 'Yes — individuals adapt during their life.', misconception: 'Lamarckism — believing acquired traits pass to offspring.', correctsTo: 'Individuals do NOT evolve. POPULATIONS evolve. Giraffes with naturally longer necks (due to genetic variation) had a survival advantage — reached more food, lived longer, had more babies. Over generations, longer-necked giraffes became common. Stretching during life doesn\'t change genes.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Natural selection requires variation, heredity, differential survival, time.', 'Populations evolve, not individuals.', 'Environment determines which traits are advantageous.', 'Fast example: antibiotic resistance in days.', 'Slow example: human evolution over millions of years.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
