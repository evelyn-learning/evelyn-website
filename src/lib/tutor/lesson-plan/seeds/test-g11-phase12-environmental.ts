/**
 * TEST PLAN — G11 AP Env Sci / AP Human Geo — Phase 12 stress test.
 *
 * Exercises both Phase 12 environmental/demographic kinds:
 *   1. population_pyramid  (Nigeria — expanding, wide base)
 *   2. climate_diagram     (Singapore — tropical wet, year-round rain + warm temp)
 *
 * Uses abstract phrasing in try-yourself.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G11_PHASE12_ENVIRONMENTAL: LessonPlan = {
  id: 'evelyn.test.g11.environmental.phase12.v1',
  title: '[TEST] G11 AP Env Sci — Phase 12 stress test',
  curriculum: 'AP Environmental Science',
  grade: '9-12',
  subject: 'social',
  topic: 'environmental science',
  locale: 'en',
  los: [
    {
      id: 'test.phase12.environmental-coverage',
      description: 'Exercise both Phase 12 environmental/demographic kinds (population_pyramid, climate_diagram) with scribble + handwrite markings.',
      standard: 'INTERNAL-TEST',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 8,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the environmental/demographic test session.',
      script: "We're touring two visualization tools demographers and environmental scientists rely on. Ready?",
      estimatedMinutes: 1,
    },

    // ── 1. population_pyramid ─────────────────────────────────────
    {
      id: 'concept-population-pyramid',
      kind: 'concept',
      goal: 'Render population_pyramid + scribble on base + handwrite.',
      teacherNote:
        '1. show_diagram with type="population_pyramid" and params (Nigeria, expanding shape, percent):\n' +
        '   { ageGroups: [\n' +
        '       ["0-4", 8.0, 7.7], ["5-9", 7.3, 7.0], ["10-14", 6.6, 6.4],\n' +
        '       ["15-19", 5.8, 5.7], ["20-24", 5.0, 4.9], ["25-29", 4.2, 4.2],\n' +
        '       ["30-34", 3.5, 3.5], ["35-39", 2.8, 2.9], ["40-44", 2.2, 2.3],\n' +
        '       ["45-49", 1.7, 1.8], ["50-54", 1.3, 1.4], ["55-59", 0.9, 1.0],\n' +
        '       ["60-64", 0.6, 0.7], ["65-69", 0.4, 0.5], ["70-74", 0.2, 0.3],\n' +
        '       ["75+", 0.1, 0.2]\n' +
        '     ],\n' +
        '     mode: "percent",\n' +
        '     xLabel: "% of total population",\n' +
        '     title: "Nigeria 2024 — Population Pyramid" }\n\n' +
        '2. tutor_scribble { target: "base", color: "#dc2626", label: "wide base → expanding" }\n' +
        '3. tutor_handwrite { text: "Wide base = high birth rate, fast growth. Narrow top = short life expectancy." }\n' +
        '4. Briefly explain the three pyramid shapes (expanding/stable/declining), then advance.',
      keyIdeas: ['Wide base + narrow top = expanding population (high TFR).'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 2. climate_diagram ────────────────────────────────────────
    {
      id: 'concept-climate-diagram',
      kind: 'concept',
      goal: 'Render climate_diagram + scribble on temperature line + handwrite.',
      teacherNote:
        '1. show_diagram with type="climate_diagram" and params (Singapore — tropical wet):\n' +
        '   { months: [\n' +
        '       ["Jan", 26, 240], ["Feb", 27, 165], ["Mar", 27, 175],\n' +
        '       ["Apr", 28, 155], ["May", 28, 170], ["Jun", 28, 130],\n' +
        '       ["Jul", 27, 155], ["Aug", 27, 175], ["Sep", 27, 165],\n' +
        '       ["Oct", 27, 190], ["Nov", 27, 270], ["Dec", 26, 290]\n' +
        '     ],\n' +
        '     tempUnit: "°C",\n' +
        '     precipUnit: "mm",\n' +
        '     location: "Singapore",\n' +
        '     title: "Singapore — Tropical Rainforest Climate" }\n\n' +
        '2. tutor_scribble { target: "temperature line", color: "#dc2626", label: "flat ≈ 27°C" }\n' +
        '3. tutor_handwrite { text: "Tropical rainforest: temp ~constant (no winter), abundant rain every month." }\n' +
        '4. Briefly explain how the temp+precip pattern identifies the biome, then advance.',
      keyIdeas: ['Tropical rainforest climate: flat temp year-round + heavy rain every month.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── try-yourself ──────────────────────────────────────────────
    {
      id: 'try-yourself',
      kind: 'try_yourself',
      problem: 'If a population pyramid has a very wide base and a narrow top, is the population most likely expanding, stable, or declining?',
      expectedAnswer: 'expanding',
      hints: [
        'Wide base = many young people = many future parents.',
        'Compare each younger cohort to the one above it: bigger = growing.',
      ],
      responseFormat: 'free',
      estimatedMinutes: 1,
    },

    // ── recap ─────────────────────────────────────────────────────
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Population pyramid shape: wide base = expanding; column = stable; narrow base = declining.',
        'Tropical rainforest: flat-warm temperature + abundant year-round precipitation.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose: 'Test seed for Phase 12 (environmental/demographic). Both kinds × one scribble + one handwrite per concept.',
  },
};
