/**
 * Test plan — exercises the 2 Phase-12 environmental diagram kinds:
 *   1. population_pyramid
 *   2. climate_diagram
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_TEST_ENVSCI_DIAGRAMS_TOUR: LessonPlan = {
  id: 'evelyn.test.envsci-diagrams-tour.v1',
  title: 'Env Sci Diagram Tools — Visual Tour',
  curriculum: 'AP', grade: '11', subject: 'science', topic: 'ap-environmental-science', locale: 'en',
  los: [{ id: 'test.apenvsci.diagrams', description: 'Brief tour exercising the two AP Env Sci diagram tools (population_pyramid, climate_diagram) in a single session.', standard: 'INTERNAL-TEST' }],
  prerequisites: [], followUps: [], estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the session.',
      script: "Quick visual tour of two Env Sci diagrams — population pyramid and climate diagram. One picture each.",
      estimatedMinutes: 1,
    },

    {
      id: 'concept-pyramid',
      kind: 'concept',
      goal: 'Show a stage-2 (expanding) population pyramid.',
      teacherNote: 'EMIT EXACTLY ONE show_diagram with kind="population_pyramid". Use a representative Stage-2 country (broad-base pyramid) — e.g., Niger 2024 demographics. USE TUPLE FORMAT [ageLabel, malePercent, femalePercent]. params shape: { ageGroups: [["0-4",8.6,8.5],["5-9",7.7,7.6],["10-14",6.7,6.7],["15-19",5.8,5.9],["20-24",4.7,4.9],["25-29",3.7,3.9],["30-34",2.7,3.0],["35-39",2.0,2.3],["40-44",1.5,1.8],["45-49",1.1,1.4],["50-54",0.8,1.1],["55-59",0.6,0.8],["60-64",0.4,0.6],["65-69",0.3,0.4],["70-74",0.2,0.3],["75+",0.2,0.3]], mode:"percent", title:"Niger population pyramid (2024) — Stage 2", xLabel:"Population (%)" }. Do NOT promise follow-ups.',
      keyIdeas: [
        'A population pyramid shows AGE-SEX distribution.',
        'WIDE BASE: many young, few old → expanding population, high TFR.',
        'NARROW BASE: aging population, declining trajectory.',
        'COLUMN shape: stable, replacement-level fertility.',
      ],
      vocabulary: [{ term: 'population pyramid', definition: 'horizontal age-sex bar chart for a population.' }],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 4,
    },

    {
      id: 'concept-climate',
      kind: 'concept',
      goal: 'Show the climate diagram of a tropical rainforest location (Singapore).',
      teacherNote: 'EMIT EXACTLY ONE show_diagram with kind="climate_diagram". Use Singapore (tropical rainforest climate, near equator). USE TUPLE FORMAT [label, temp, precip]. ~26-28°C every month, high precipitation year-round (~150-300mm/month). params shape: { months: [["Jan",26.5,234],["Feb",27.0,162],["Mar",27.5,176],["Apr",27.9,154],["May",28.4,171],["Jun",28.4,131],["Jul",28.0,157],["Aug",27.8,149],["Sep",27.6,165],["Oct",27.4,166],["Nov",26.9,251],["Dec",26.4,304]], tempUnit:"°C", precipUnit:"mm", location:"Singapore (1.3°N)", title:"Tropical rainforest climate" }. Do NOT show variants.',
      keyIdeas: [
        'A climate diagram plots monthly temperature (line) + precipitation (bars).',
        'Tropical rainforest: warm year-round (~26-28°C) + high precipitation (>150mm/month).',
        'Pattern reveals biome: low seasonal variation = equatorial; high precipitation contrast = monsoon.',
      ],
      vocabulary: [{ term: 'climate diagram', definition: 'monthly temperature + precipitation chart for a location.' }],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 4,
    },

    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two Env Sci visualizations shipped: population_pyramid, climate_diagram.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: 'TEST',
    cedTopic: 'diagrams',
    cedTitle: 'Env Sci Diagram Tools Test',
    sources: [{ type: 'internal-test', source: 'AP Plans Initiative', note: 'Single plan exercising both Phase-12 environmental diagram tools.' }],
  },
};
