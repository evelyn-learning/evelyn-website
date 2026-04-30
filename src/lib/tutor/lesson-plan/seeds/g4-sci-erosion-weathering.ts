/**
 * G4 — Weathering and erosion.
 *
 * Weathering breaks rock; erosion moves the pieces. Wind, water, ice
 * as agents. Examples: Grand Canyon, beach sand, soil formation.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_SCI_EROSION_WEATHERING: LessonPlan = {
  id: 'evelyn.g4.sci.earth.weathering-erosion.v1',
  title: 'Weathering and erosion',
  curriculum: 'NGSS',
  grade: '4',
  subject: 'sci',
  topic: 'earth-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.4-ess2.a',
      description: 'Make observations and/or measurements to provide evidence of the effects of weathering or the rate of erosion.',
      standard: 'NGSS.4-ESS2-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.5-ess2.a'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a famous landform to introduce the slow power of water.',
      script: 'The Grand Canyon is a MILE deep. The Colorado River carved that — by flowing over the same rocks for millions of years. Water moves rocks. Slowly, but it never stops.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-things',
      kind: 'concept',
      goal: 'Distinguish weathering (breaking) from erosion (moving) and identify the agents.',
      keyIdeas: [
        'WEATHERING: breaking down rocks INTO pieces. Three kinds: PHYSICAL (frost wedging — water freezes in cracks and expands), CHEMICAL (acid rain dissolves minerals), BIOLOGICAL (plant roots crack rocks).',
        'EROSION: MOVING the broken pieces from one place to another. Water, wind, ice (glaciers), and gravity all move material.',
        'DEPOSITION: when erosion drops the material — sand at a beach, silt in a delta.',
        'WEATHER vs WEATHERING: "weather" is what\'s happening today. "Weathering" is the slow change rocks experience over years.',
        'EXAMPLES of each: Grand Canyon (water erosion), beach sand (waves eroding coast), soil (weathered rock + dead plants), boulders smoothed by glaciers.',
      ],
      vocabulary: [
        { term: 'weathering', definition: 'breaking rocks into smaller pieces.' },
        { term: 'erosion', definition: 'moving rock pieces from one place to another.' },
        { term: 'deposition', definition: 'when erosion drops the material somewhere new.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-canyon',
      kind: 'worked_example',
      problem: 'How did water create the Grand Canyon? Was it weathering or erosion or both?',
      steps: [
        'The Colorado River flowed over rock for millions of years.',
        'WEATHERING: water + freezing temps cracked the rock, dissolved minerals, broke pieces loose.',
        'EROSION: the river then CARRIED those loose pieces downstream — sometimes hundreds of miles.',
        'OVER TIME: water cut a deeper and deeper channel. Today: a mile deep.',
        'Both weathering AND erosion. They almost always work together.',
      ],
      answer: 'both — weathering broke the rock; erosion moved the pieces away',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A glacier moves down a mountain valley, picking up rocks and dragging them along. Is this erosion or weathering?',
      expectedAnswer: 'erosion',
      responseFormat: 'free',
      hints: [
        'Is the glacier BREAKING the rocks (weathering) or MOVING them (erosion)?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-weathering-weather',
      kind: 'misconception_check',
      question: 'Does the word "weathering" mean "what the weather is doing today"?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing weathering with weather.',
          correctsTo: 'No — WEATHER is the day-to-day conditions (rain, snow, wind). WEATHERING is the slow PROCESS by which rocks break down over months or millions of years. Weather can CAUSE weathering (rain, freeze-thaw), but they\'re different things.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'WEATHERING breaks. EROSION moves. DEPOSITION drops.',
        'Three kinds of weathering: physical, chemical, biological.',
        'Agents of erosion: water, wind, ice (glaciers), gravity.',
        'Slow processes — millions of years can carve canyons.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What\'s ONE thing humans do that SPEEDS UP erosion?',
      hint: 'Cutting down forests removes roots that hold soil in place. Building on hillsides without protection. Farming without crop rotation.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
