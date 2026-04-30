/**
 * G6 — The water cycle (deep dive).
 *
 * Evaporation, condensation, precipitation, runoff, infiltration,
 * transpiration. Energy from the sun drives the whole loop.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SCI_WATER_CYCLE: LessonPlan = {
  id: 'evelyn.g6.sci.earth.water-cycle.v1',
  title: 'The water cycle in depth',
  curriculum: 'NGSS',
  grade: '6',
  subject: 'sci',
  topic: 'earth-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.ms-ess2.c',
      description: 'Develop a model to describe the cycling of water through Earth\'s systems driven by energy from the sun.',
      standard: 'NGSS.MS-ESS2-4',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.ms-ess2.d'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Highlight that the same water has been cycling forever.',
      script: 'The water in your glass right now? Some of it was once in a dinosaur. It\'s been raining, evaporating, freezing, and flowing for 4.5 billion years — same water, just moved around.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-six-stages',
      kind: 'concept',
      goal: 'Six processes drive the cycle, all powered by the sun.',
      keyIdeas: [
        'EVAPORATION: liquid water → water vapor (gas). Sun heats oceans, lakes, puddles. Water rises into the atmosphere.',
        'TRANSPIRATION: plants release water vapor through their leaves. Combined with evaporation, this is "evapotranspiration".',
        'CONDENSATION: water vapor → tiny droplets. Happens when air cools. Forms CLOUDS.',
        'PRECIPITATION: droplets in clouds combine and fall as rain, snow, sleet, or hail.',
        'RUNOFF: precipitation flows downhill into streams, rivers, eventually oceans.',
        'INFILTRATION: some water soaks into the ground, becoming GROUNDWATER. Drains into wells, springs, eventually back to surface water.',
        'POWER SOURCE: the SUN. Without solar energy, no evaporation, no clouds, no rain. The cycle runs on solar power.',
      ],
      vocabulary: [
        { term: 'evaporation', definition: 'liquid water turning into water vapor.' },
        { term: 'condensation', definition: 'water vapor turning back into liquid droplets.' },
        { term: 'precipitation', definition: 'water falling from clouds as rain, snow, sleet, or hail.' },
        { term: 'transpiration', definition: 'plants releasing water vapor from their leaves.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-trace-drop',
      kind: 'worked_example',
      problem: 'Trace one water molecule from the ocean back to your faucet.',
      steps: [
        'Step 1: ocean water EVAPORATES, lifted by sun energy.',
        'Step 2: water vapor rises and CONDENSES into a cloud.',
        'Step 3: cloud moves over land, releases PRECIPITATION (rain or snow).',
        'Step 4: rain runs off into a river, OR infiltrates into the ground.',
        'Step 5: city pumps from river or aquifer, treats water, pipes it to your home.',
        'Step 6: faucet. Drink. Possibly evaporate (sweat) or be returned via sewage → river → ocean → start over.',
      ],
      answer: 'evaporation → condensation → precipitation → runoff/infiltration → human use',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In the water cycle, what process turns water VAPOR (gas) back into liquid droplets in clouds?',
      expectedAnswer: 'condensation',
      responseFormat: 'free',
      hints: [
        'It\'s the OPPOSITE of evaporation.',
        'It happens when warm air cools as it rises.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cycle-fixed-water',
      kind: 'misconception_check',
      question: 'Is "new water" being made somewhere in the water cycle?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Thinking the cycle creates fresh water.',
          correctsTo: 'No — the same water has been cycling for 4.5 billion years. The cycle MOVES water around, but doesn\'t create or destroy it. (Tiny exceptions: comets bring some, deep-Earth chemistry adds traces. But essentially the supply is fixed.)',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Six processes: evaporation, transpiration, condensation, precipitation, runoff, infiltration.',
        'Sun drives the whole cycle.',
        'Water doesn\'t get "made" — it just moves.',
        'Plants contribute via transpiration; not all evaporation is from oceans/lakes.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How could climate change affect the water cycle?',
      hint: 'Warmer atmosphere holds more water vapor → heavier rain in some places, longer droughts in others. Glaciers melt → sea level rise. Storms intensify.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
