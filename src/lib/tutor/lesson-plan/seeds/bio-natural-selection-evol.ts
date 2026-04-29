/**
 * HS Biology — Natural Selection and Evolution.
 * NGSS HS-LS4-2 / HS-LS4-3: evidence + mechanism of natural selection.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_NATURAL_SELECTION_EVOL: LessonPlan = {
  id: 'evelyn.hs.science.biology.natural-selection-evol.v1',
  title: 'Natural Selection and Evolution',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'evolution', locale: 'en',
  los: [{ id: 'ngss.hs-ls4-2', description: 'Construct an explanation based on evidence that the process of evolution primarily results from four factors.', standard: 'NGSS.HS-LS4-2' }],
  prerequisites: ['ngss.ms-ls4-4'], followUps: [], estimatedMinutes: 25,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in modern evidence.', script: 'Antibiotic-resistant bacteria. Galápagos finch beak shifts within a generation. HIV evolving inside a single patient. Evolution by natural selection happens in real time.', estimatedMinutes: 2 },
    { id: 'concept-four-factors', kind: 'concept', goal: 'Four factors: variation, heredity, differential survival/reproduction, time.', keyIdeas: [
      '1. VARIATION — individuals differ (mutation, sexual recombination).',
      '2. HEREDITY — variations pass to offspring through genes.',
      '3. DIFFERENTIAL SURVIVAL/REPRODUCTION — some variations help organisms survive + reproduce more in current conditions (FITNESS).',
      '4. TIME — over many generations, helpful traits become common; harmful become rare.',
      'Result: POPULATIONS evolve. Individuals don\'t.',
      'Sources of variation: random mutation, sexual recombination (crossing over, independent assortment).',
    ], vocabulary: [{ term: 'fitness', definition: 'reproductive success.' }, { term: 'allele frequency', definition: 'how common an allele is in a population.' }, { term: 'gene pool', definition: 'all alleles in a population.' }], estimatedMinutes: 5 },
    { id: 'concept-evidence', kind: 'concept', goal: 'Evidence for evolution: fossils, anatomy, embryology, molecular biology, biogeography, direct observation.', keyIdeas: [
      'FOSSIL RECORD: shows progression of life forms over time. Transitional fossils (Tiktaalik, Archaeopteryx).',
      'COMPARATIVE ANATOMY: homologous structures (bat wing, whale flipper, human arm — same bones, modified) suggest shared ancestry.',
      'EMBRYOLOGY: vertebrate embryos look strikingly similar early in development.',
      'MOLECULAR BIOLOGY: DNA + protein sequences confirm relationships (humans + chimps share ~98.8% DNA).',
      'BIOGEOGRAPHY: species distribution matches continental drift, isolation patterns.',
      'DIRECT OBSERVATION: antibiotic resistance evolves in days; finch beaks change within years.',
    ], estimatedMinutes: 5 },
    { id: 'concept-types-selection', kind: 'concept', goal: 'Types of selection: directional, stabilizing, disruptive.', keyIdeas: [
      'DIRECTIONAL: selection favors one extreme. Population shifts that direction (giraffe necks getting longer).',
      'STABILIZING: selection favors the AVERAGE; extremes selected against (human birth weight: too small or too large is risky).',
      'DISRUPTIVE: selection favors BOTH extremes; against the middle. Can lead to speciation.',
    ], suggestedTools: ['show_diagram'], estimatedMinutes: 3 },
    { id: 'worked-bacterial-resistance', kind: 'worked_example', problem: 'A doctor prescribes antibiotics for an infection. The patient stops taking them after 5 days (instead of the full 10). Why does this practice contribute to antibiotic resistance?', steps: [
      'Day 1: bacteria diverse — most weak to antibiotic, a few have RESISTANT mutations.',
      'Days 1-5: antibiotic kills weak bacteria first. Resistant ones survive longer.',
      'Day 5 (stop early): SOME bacteria still alive — biased toward resistant ones.',
      'Survivors reproduce: now the population is enriched for resistance.',
      'Future infections from these bacteria are HARDER to treat.',
      'Lesson: full course → kill all; stopping early → select for resistance.',
    ], answer: 'Stopping early leaves the most resistant bacteria alive, who then dominate the regrowing population.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Peacock tails are huge and colorful, making the male LESS able to escape predators. Why hasn\'t natural selection eliminated them?', expectedAnswer: 'SEXUAL SELECTION. Females prefer males with elaborate tails (signals genetic fitness). Males with bigger tails reproduce more, even if they die earlier. Natural selection favors traits that increase REPRODUCTIVE success — not just survival.', responseFormat: 'free', hints: ['What\'s the trait FOR?', 'Survival isn\'t the only fitness factor.'], estimatedMinutes: 3 },
    { id: 'misconception-survival-fittest', kind: 'misconception_check', question: 'A friend says "survival of the fittest = strongest survives." Right?', commonErrors: [{ answer: 'Yes — strongest.', misconception: 'Equating fitness with strength.', correctsTo: 'FITNESS in evolution = reproductive success in current conditions. Smallest, sneakiest, fastest, prettiest — whatever leads to more surviving offspring is "fittest." A small bacterium can be fitter than a big lion if it leaves more descendants.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Evolution = change in allele frequencies over generations.', 'Four factors: variation, heredity, differential survival, time.', 'Evidence: fossils, anatomy, molecular, biogeography, direct.', 'Types: directional, stabilizing, disruptive selection.', 'Fitness = reproductive success, not strength.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
