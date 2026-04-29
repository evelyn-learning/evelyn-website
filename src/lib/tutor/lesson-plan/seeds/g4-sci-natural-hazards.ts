/**
 * Grade 4 Science — Natural Hazards.
 * NGSS 4-ESS3-2: generate and compare multiple solutions to reduce
 * the impacts of natural Earth processes on humans.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_SCI_NATURAL_HAZARDS: LessonPlan = {
  id: 'evelyn.g4.science.earth.natural-hazards.v1',
  title: 'Natural Hazards and How We Reduce Their Impact',
  curriculum: 'NGSS', grade: '4', subject: 'science', topic: 'earth-systems', locale: 'en',
  los: [{ id: 'ngss.4-ess3-2', description: 'Generate and compare multiple solutions to reduce the impacts of natural Earth processes on humans.', standard: 'NGSS.4-ESS3-2' }],
  prerequisites: [], followUps: ['ngss.ms-ess3-2'], estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Hook with the engineering challenge.', script: 'Earthquakes shake buildings. Hurricanes flood cities. We can\'t STOP these natural events — but we can DESIGN ways to be safer when they happen. How?', estimatedMinutes: 1 },
    { id: 'concept-hazards', kind: 'concept', goal: 'Natural hazards are Earth processes that can damage people and property. Engineers design solutions to reduce — not eliminate — the harm.', keyIdeas: [
      'NATURAL HAZARDS include: earthquakes, volcanoes, hurricanes, tornadoes, floods, wildfires, tsunamis, blizzards.',
      'These are NORMAL Earth processes — but become HAZARDS when they affect humans.',
      'We can\'t prevent them, but we can REDUCE harm:',
      '  · Earthquake-resistant building design (flexible structures).',
      '  · Levees and floodwalls for flood-prone areas.',
      '  · Storm shelters for tornadoes.',
      '  · Early warning systems (tsunami sirens, hurricane forecasts).',
      '  · Building codes that require strong materials in risk zones.',
    ], vocabulary: [{ term: 'natural hazard', definition: 'a natural Earth process that can harm people.' }, { term: 'mitigation', definition: 'reducing the harm a hazard could cause.' }], estimatedMinutes: 4 },
    { id: 'worked-earthquake-building', kind: 'worked_example', problem: 'How does an earthquake-resistant building stay standing during a quake?', steps: [
      'Earthquakes shake the ground sideways and up-down.',
      'A RIGID building cracks because it can\'t move with the shaking.',
      'A FLEXIBLE building (using steel + special joints) BENDS slightly with the motion — releases stress without breaking.',
      'Some buildings sit on RUBBER or SLIDING BASES that ABSORB shaking before it reaches the building.',
      'Combined: flexibility + isolation = much safer.',
    ], answer: 'Flexibility and base isolation let the building move with the shaking instead of fighting it.', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A coastal town is in a hurricane zone. Brainstorm three solutions to reduce hurricane damage.', expectedAnswer: 'Possible answers: stronger building codes (hurricane straps, impact-resistant windows); seawalls/levees; evacuation plans + early warning sirens; protected mangrove buffers; storm shelters; underground utilities.', responseFormat: 'free', hints: ['Think buildings, infrastructure, and warning systems.', 'No single solution — combine several for best results.'], estimatedMinutes: 3 },
    { id: 'misconception-can-prevent', kind: 'misconception_check', question: 'A friend says "if we build well enough, earthquakes won\'t happen." Right?', commonErrors: [{ answer: 'Yes — engineering can prevent them.', misconception: 'Confusing impact reduction with hazard prevention.', correctsTo: 'Earthquakes happen because of plate tectonics deep underground — we can\'t stop them. But we can REDUCE THE DAMAGE. Mitigation ≠ prevention.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Hazards are natural; we can\'t prevent them.', 'Engineers reduce damage with design + warning systems.', 'Multiple solutions usually work better than one.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
