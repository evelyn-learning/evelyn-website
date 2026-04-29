/**
 * HS Biology — Population Ecology.
 * NGSS HS-LS2-1 / HS-LS2-2: factors affecting carrying capacity.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_ECOLOGY_POPULATIONS: LessonPlan = {
  id: 'evelyn.hs.science.biology.ecology-populations.v1',
  title: 'Population Ecology',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'ecology', locale: 'en',
  los: [{ id: 'ngss.hs-ls2-1', description: 'Use mathematical and/or computational representations to support explanations of factors that affect carrying capacity of ecosystems.', standard: 'NGSS.HS-LS2-1' }],
  prerequisites: ['hs.bio.cell-theory-structure'], followUps: ['hs.bio.ecosystems-cycles'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in deer overpopulation.', script: 'Kaibab Plateau, Arizona, 1906: 4,000 deer. Predators removed. By 1924: 100,000 deer. By 1939: back to 10,000 — most starved. The land could not support that many. Populations have limits.', estimatedMinutes: 2 },
    { id: 'concept-growth', kind: 'concept', goal: 'Populations grow exponentially without limits, logistically with limits.', keyIdeas: [
      'POPULATION = group of one species in one area.',
      'EXPONENTIAL GROWTH (J-curve): unlimited resources, no predators → population doubles repeatedly.',
      '  · dN/dt = rN (where r = per-capita growth rate, N = population size).',
      'LOGISTIC GROWTH (S-curve): real-world; growth slows as resources get scarce.',
      '  · dN/dt = rN × (K-N)/K, where K = CARRYING CAPACITY.',
      'CARRYING CAPACITY (K) = max population the environment can sustain.',
      'Above K → death rate > birth rate → population crashes back down.',
    ], vocabulary: [{ term: 'carrying capacity', definition: 'max sustainable population (K).' }, { term: 'exponential growth', definition: 'unlimited growth (J-curve).' }, { term: 'logistic growth', definition: 'limited growth that levels at K (S-curve).' }], suggestedTools: ['show_equation'], estimatedMinutes: 5 },
    { id: 'concept-limits', kind: 'concept', goal: 'Limiting factors are density-dependent or density-independent.', keyIdeas: [
      'DENSITY-DEPENDENT FACTORS: stronger as population gets denser.',
      '  · Competition for food, water, space.',
      '  · Disease (spreads faster in dense populations).',
      '  · Predation (predators concentrate where prey is dense).',
      'DENSITY-INDEPENDENT FACTORS: hit any-sized population the same.',
      '  · Weather (drought, freeze, hurricane).',
      '  · Natural disasters (fire, flood).',
      '  · Human activity (habitat destruction, pollution).',
    ], estimatedMinutes: 4 },
    { id: 'worked-rabbits', kind: 'worked_example', problem: 'A rabbit population on an island starts at 50. They grow at r = 0.5/year. Carrying capacity K = 500. What happens after 10 years vs 30 years?', steps: [
      'Year 0: N = 50. Far below K, so growth is nearly exponential.',
      'Year 5: N ≈ 200. Still rising fast.',
      'Year 10: N ≈ 380. Approaching K — growth slows.',
      'Year 15: N ≈ 470. Almost at K.',
      'Year 30: N ≈ 500. Stable at carrying capacity.',
      'Limiting factors kicking in: less grass per rabbit, more disease in dense groups.',
    ], answer: 'Initially exponential, then logistic — leveling off at K = 500 because food/space limits kick in.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A bacterial colony in a Petri dish doubles every 20 minutes. After 4 hours starting from 100 cells, why doesn\'t it really reach the predicted billions?', expectedAnswer: 'Resource limits hit fast: nutrients run out, waste builds up, space fills. Real growth follows logistic (S-curve), not exponential. Carrying capacity in a Petri dish is small, so population plateaus or even crashes once nutrients exhaust.', responseFormat: 'free', hints: ['What\'s the difference between exponential and logistic growth?', 'What runs out in a closed dish?'], estimatedMinutes: 3 },
    { id: 'misconception-r-vs-K', kind: 'misconception_check', question: 'A friend says "more babies always = better population growth." Right?', commonErrors: [{ answer: 'Yes — more babies = more growth.', misconception: 'Ignoring carrying capacity.', correctsTo: 'Births alone don\'t determine population — DEATH RATE does too. Above carrying capacity, more births just mean more die from starvation/disease. Sustainable populations balance births and deaths within environmental limits.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Exponential = J-curve (no limits). Logistic = S-curve (with limits).', 'Carrying capacity (K) is the environment\'s max.', 'Density-dependent vs density-independent factors.', 'Real populations rarely grow exponentially for long.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
