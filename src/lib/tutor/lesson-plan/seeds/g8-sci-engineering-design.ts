/**
 * Grade 8 Science — Engineering Design Process.
 * NGSS MS-ETS1-1 / MS-ETS1-3 / MS-ETS1-4: define problems, evaluate
 * solutions, iterate.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SCI_ENGINEERING_DESIGN: LessonPlan = {
  id: 'evelyn.g8.science.engineering.design-process.v1',
  title: 'The Engineering Design Process',
  curriculum: 'NGSS', grade: '8', subject: 'science', topic: 'engineering', locale: 'en',
  los: [{ id: 'ngss.ms-ets1-1', description: 'Define the criteria and constraints of a design problem with sufficient precision to ensure a successful solution.', standard: 'NGSS.MS-ETS1-1' }],
  prerequisites: [], followUps: ['ngss.hs-ets1-1'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in real-world impact.', script: 'A self-driving car. A water purifier for a village without electricity. A wheelchair that climbs stairs. Engineers create these by following a process — not just genius. The process is teachable.', estimatedMinutes: 2 },
    { id: 'concept-process', kind: 'concept', goal: 'Engineering design is iterative: define problem → research → brainstorm → prototype → test → refine.', keyIdeas: [
      '1. DEFINE THE PROBLEM. What needs solving? Who is it for?',
      '2. IDENTIFY CRITERIA + CONSTRAINTS. Criteria = what success looks like. Constraints = limits (cost, materials, time, safety).',
      '3. RESEARCH. What\'s already been tried? What\'s the science?',
      '4. BRAINSTORM solutions. Many ideas, no judgment yet.',
      '5. SELECT + PROTOTYPE the best ideas.',
      '6. TEST against criteria.',
      '7. REFINE based on results.',
      '8. Iterate steps 5-7 multiple times.',
      'KEY: failure is part of the process. Most prototypes fail; lessons feed the next iteration.',
    ], vocabulary: [{ term: 'criteria', definition: 'requirements for success.' }, { term: 'constraint', definition: 'limit on the design (cost, time, materials).' }, { term: 'prototype', definition: 'an early test version.' }, { term: 'iteration', definition: 'a single cycle of design + test + improve.' }], estimatedMinutes: 5 },
    { id: 'worked-water-purifier', kind: 'worked_example', problem: 'Walk through designing a water purifier for a village with no electricity.', steps: [
      'DEFINE: villagers need clean drinking water. Current source: contaminated stream.',
      'CRITERIA: removes bacteria/viruses; produces 20+ liters/day; lasts 5+ years.',
      'CONSTRAINTS: cost <$50; no electricity; locally repairable; uses available materials.',
      'RESEARCH: existing solutions (boiling, sand filters, UV from sun, ceramic filters).',
      'BRAINSTORM: solar still, sand+gravel filter, ceramic candle filter, biosand filter.',
      'PROTOTYPE: build a small biosand filter (works without electricity, locally maintainable).',
      'TEST: measure bacteria reduction (lab samples).',
      'REFINE: adjust sand layer depth; improve flow rate.',
      'Several iterations later: a design that meets all criteria + constraints.',
    ], answer: 'Iterative process: define → criteria/constraints → research → brainstorm → prototype → test → refine. Multiple cycles get you to a working design.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Define the criteria and constraints for designing a backpack for elementary school students.', expectedAnswer: 'CRITERIA: holds books + lunch + supplies; comfortable for hours; durable for years; easy to open; has compartments. CONSTRAINTS: cost <$30; weight when empty <0.5kg; safe materials (no toxic dyes); sized for kids (~12in × 16in).', responseFormat: 'free', hints: ['Criteria = what success looks like.', 'Constraints = limits (price, size, safety, etc.).'], estimatedMinutes: 3 },
    { id: 'misconception-design-linear', kind: 'misconception_check', question: 'A friend says "engineering is a linear process — you do it once and you\'re done." Right?', commonErrors: [{ answer: 'Yes — one and done.', misconception: 'Treating design as one-pass.', correctsTo: 'Engineering is ITERATIVE — you cycle through prototyping, testing, and refining many times. Most products go through dozens of iterations before release. Failure at each stage teaches what to do better. "Done" is when the design meets all criteria within constraints — not after the first try.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Define problem + criteria + constraints first.', 'Research, brainstorm, prototype, test, refine.', 'Iterate — failure is feedback.', 'Trade-offs are unavoidable (cost vs durability, etc.).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
