/**
 * G5 — Water cycle (elementary version).
 *
 * Lighter version of the G6 deep dive. Focus on the four key
 * processes for grades 4-5 standards.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_SCI_WATER_CYCLE: LessonPlan = {
  id: 'evelyn.g5.sci.earth.water-cycle.v1',
  title: 'The water cycle',
  curriculum: 'NGSS',
  grade: '5',
  subject: 'sci',
  topic: 'earth-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.5-ess2.a',
      description: 'Develop a model using an example to describe ways the geosphere, biosphere, hydrosphere, and atmosphere interact.',
      standard: 'NGSS.5-ESS2-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.ms-ess2.c'],
  estimatedMinutes: 11,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open with the always-recycling angle.',
      script: 'The water in your glass right now might have been a raindrop in Brazil last month. Earth doesn\'t MAKE new water — it just keeps moving the same water around in the water cycle.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-stages',
      kind: 'concept',
      goal: 'Four key stages and the sun\'s role.',
      keyIdeas: [
        'EVAPORATION: liquid water turns into a GAS (water vapor) and rises into the air. Sun heats oceans, lakes, puddles.',
        'CONDENSATION: water vapor cools as it rises. Tiny droplets form. Lots of droplets = a CLOUD.',
        'PRECIPITATION: when droplets in clouds combine until they\'re heavy enough to fall — RAIN, SNOW, SLEET, or HAIL.',
        'COLLECTION (runoff): water that lands on Earth flows into rivers, lakes, oceans. Some soaks into the ground.',
        'Cycle starts AGAIN as the sun evaporates water.',
        'KEY: the SUN drives the whole cycle by providing energy for evaporation. Without the sun, no cycle.',
      ],
      vocabulary: [
        { term: 'evaporation', definition: 'liquid water turning into water vapor (gas).' },
        { term: 'condensation', definition: 'water vapor cooling into liquid droplets.' },
        { term: 'precipitation', definition: 'water falling from clouds — rain, snow, sleet, hail.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-puddle',
      kind: 'worked_example',
      problem: 'A puddle disappears after a sunny morning. Where did the water go?',
      steps: [
        'The sun heated the puddle.',
        'Heated water EVAPORATED — turned into water vapor.',
        'The vapor rose into the air.',
        'You can\'t see it now, but it\'s there. Eventually it will COOL, CONDENSE into clouds, and PRECIPITATE somewhere as rain.',
        'The water didn\'t disappear — it\'s back in the cycle.',
      ],
      answer: 'evaporated into the air as water vapor',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You see a cloud in the sky. What process turned water vapor into the visible droplets in that cloud?',
      expectedAnswer: 'condensation',
      responseFormat: 'free',
      hints: [
        'Vapor (gas) → liquid droplets is the OPPOSITE of evaporation.',
        'It happens when air cools as it rises.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rain-from-air',
      kind: 'misconception_check',
      question: 'Does rain come directly out of the air, or does the water need to be in clouds first?',
      commonErrors: [
        {
          answer: 'air',
          misconception: 'Skipping the cloud step.',
          correctsTo: 'It comes from CLOUDS. Water vapor first CONDENSES into tiny droplets (clouds), then those droplets combine until heavy enough to FALL as precipitation. The cloud is the in-between step.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four stages: evaporation, condensation, precipitation, collection.',
        'Sun powers the cycle.',
        'The same water keeps cycling — never created or destroyed.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Plants release water vapor too — through their leaves. What\'s that called?',
      hint: 'Transpiration. Combined with evaporation, it adds significant water vapor to the air. Sometimes called "evapotranspiration".',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
