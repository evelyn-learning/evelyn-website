/**
 * Grade 8 Science — Climate Change.
 * NGSS MS-ESS3-5: ask questions to clarify evidence of factors that
 * have caused the rise in global temperatures.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SCI_CLIMATE_CHANGE: LessonPlan = {
  id: 'evelyn.g8.science.earth.climate-change.v1',
  title: 'Climate Change: Causes and Evidence',
  curriculum: 'NGSS', grade: '8', subject: 'science', topic: 'earth-systems', locale: 'en',
  los: [{ id: 'ngss.ms-ess3-5', description: 'Ask questions to clarify evidence of the factors that have caused the rise in global temperatures over the past century.', standard: 'NGSS.MS-ESS3-5' }],
  prerequisites: ['ngss.ms-ess2-5'], followUps: ['ngss.hs-ess3-6'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor with the data.', script: 'Earth\'s average temperature has risen about 1.1°C since 1880 — most of it in just the last 50 years. CO₂ in the air has gone from 280 ppm to 420+ ppm — the highest in 800,000 years. Why? Let\'s look at the evidence.', estimatedMinutes: 2 },
    { id: 'concept-greenhouse-effect', kind: 'concept', goal: 'Greenhouse gases trap heat. Adding more increases the trapping → planet warms.', keyIdeas: [
      'Sun\'s energy hits Earth → some absorbed (warms surface) → re-emitted as INFRARED.',
      'GREENHOUSE GASES (CO₂, methane, water vapor) ABSORB infrared → trap that heat in the atmosphere.',
      'Without ANY greenhouse effect, Earth would average -18°C (frozen).',
      'WITH natural greenhouse, Earth averages 15°C — habitable.',
      'Adding MORE greenhouse gases (from human activity) → MORE heat trapped → temperature rises beyond historical norms.',
    ], vocabulary: [{ term: 'greenhouse gas', definition: 'gas that traps heat (CO₂, methane, etc.).' }, { term: 'global warming', definition: 'increase in average Earth temperature.' }, { term: 'climate change', definition: 'long-term shift in climate patterns.' }], estimatedMinutes: 4 },
    { id: 'concept-evidence', kind: 'concept', goal: 'Evidence comes from temperature records, ice cores, sea levels, and CO₂ measurements.', keyIdeas: [
      'TEMPERATURE RECORDS: thermometers since 1880; satellites since 1970s.',
      'ICE CORES: bubbles trapped in Antarctic ice contain ancient atmosphere — show 800,000 years of CO₂ + temperature data.',
      'CO₂ correlates STRONGLY with temperature in ice records.',
      'CURRENT CO₂: 420+ ppm — the highest in those 800,000 years.',
      'SEA LEVELS rising (~3 mm/year now) due to melting ice + thermal expansion.',
      'Other signs: ocean acidification, glacier retreat, shifting species ranges, more extreme weather.',
    ], estimatedMinutes: 4 },
    { id: 'concept-human-cause', kind: 'concept', goal: 'Burning fossil fuels (coal, oil, gas) releases CO₂ stored over millions of years — the main human cause.', keyIdeas: [
      'Plants used CO₂ for photosynthesis over millions of years → buried + compressed → fossil fuels (coal, oil, gas).',
      'When we burn fossil fuels, that ancient CO₂ goes back into the atmosphere FAST.',
      'Other human contributions: deforestation (fewer trees absorbing CO₂), farming (methane from cattle, rice paddies), refrigerants.',
      'Volcanoes + natural sources release CO₂ too — but human emissions are ~100x more.',
      'Solutions: renewable energy, electric vehicles, reforestation, energy efficiency, carbon capture.',
    ], estimatedMinutes: 3 },
    { id: 'worked-greenhouse', kind: 'worked_example', problem: 'Why are Mars and Venus instructive examples for understanding Earth\'s greenhouse effect?', steps: [
      'MARS: very thin atmosphere, almost no greenhouse gases. Average temperature: -63°C. Frozen.',
      'VENUS: thick CO₂ atmosphere, runaway greenhouse. Average temperature: 462°C. Hot enough to melt lead.',
      'EARTH: moderate greenhouse keeps us at 15°C — habitable.',
      'These show the greenhouse effect is REAL — it\'s the difference between habitable Earth and frozen Mars or scalding Venus.',
      'Adding CO₂ pushes Earth toward Venus-like territory (very gradually).',
    ], answer: 'Mars (no greenhouse) is frozen; Venus (extreme greenhouse) is scalding. Earth\'s moderate greenhouse keeps us habitable — but more CO₂ shifts that balance.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Someone says "the climate has always changed naturally — what\'s different now?" What evidence shows current change is unusual?', expectedAnswer: 'RATE: current warming is ~10x faster than past natural changes. CAUSE: ice cores show CO₂ levels haven\'t been this high in 800,000+ years. CORRELATION: human emissions matched the rise precisely. Past changes had natural causes (orbital cycles, volcanoes); this one matches human industrial activity.', responseFormat: 'free', hints: ['Compare RATE of past vs current change.', 'What\'s the source of CO₂ this time?'], estimatedMinutes: 3 },
    { id: 'misconception-cold-day-disproves', kind: 'misconception_check', question: 'A friend says "it snowed yesterday — global warming is fake." Why doesn\'t a cold day disprove climate change?', commonErrors: [{ answer: 'Yes — cold = no warming.', misconception: 'Confusing weather with climate.', correctsTo: 'WEATHER (one day) is local + variable. CLIMATE is the long-term AVERAGE. One snowy day or even one cold winter doesn\'t change the multi-decade upward trend in global average temperature. Even in a warming climate, cold days happen.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Greenhouse gases trap heat (necessary in moderation).', 'Human activity has added a lot of CO₂.', 'Multiple lines of evidence: thermometers, ice cores, sea levels, CO₂ measurements.', 'Current change is faster + caused by humans, unlike past natural cycles.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
