/**
 * Grade 4 Science — Earth's Features (Rocks, Fossils, Weathering).
 * NGSS 4-ESS1-1 / 4-ESS2-1: identify evidence from patterns in rock
 * formations and fossils in rock layers; weathering and erosion shape
 * the land over time.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_SCI_EARTH_FEATURES: LessonPlan = {
  id: 'evelyn.g4.science.earth.earth-features.v1',
  title: 'Reading Earth\'s Story in Rocks',
  curriculum: 'NGSS', grade: '4', subject: 'science', topic: 'earth-systems', locale: 'en',
  los: [{ id: 'ngss.4-ess1-1', description: 'Identify evidence from patterns in rock formations and fossils in rock layers to support an explanation for changes in a landscape over time.', standard: 'NGSS.4-ESS1-1' }, { id: 'ngss.4-ess2-1', description: 'Make observations and/or measurements to provide evidence of the effects of weathering or the rate of erosion by water, ice, wind, or vegetation.', standard: 'NGSS.4-ESS2-1' }],
  prerequisites: [], followUps: ['ngss.ms-ess2-2'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Hook with the surprise of a fossil fish on a mountain.', script: 'High up in the Himalayas, scientists have found fossils of FISH. Fish! On a mountain! How did sea creatures end up on the world\'s tallest peaks?', estimatedMinutes: 2 },
    { id: 'concept-rock-layers', kind: 'concept', goal: 'Rock layers form over time. Older layers are usually deeper. Fossils inside tell us what lived there long ago.', keyIdeas: [
      'Rocks form in LAYERS over thousands or millions of years.',
      'Each layer is a snapshot of a time period — the bottom layers are OLDEST.',
      'FOSSILS are preserved remains or imprints of ancient living things, trapped in rock layers.',
      'A fossil tells us what was alive at the time that layer formed AND what the environment was like.',
      'Fossils of sea creatures HIGH UP on a mountain mean that mountain was once UNDERWATER, then pushed up by Earth\'s movements.',
    ], vocabulary: [{ term: 'fossil', definition: 'preserved remains or impression of a living thing.' }, { term: 'sediment', definition: 'tiny pieces of rock and material that build up in layers.' }], estimatedMinutes: 4 },
    { id: 'concept-weathering-erosion', kind: 'concept', goal: 'Weathering breaks rocks down. Erosion moves the pieces away. Together they reshape Earth slowly.', keyIdeas: [
      'WEATHERING: rocks break into smaller pieces — by water (freeze/thaw), wind, plant roots, temperature changes.',
      'EROSION: the broken pieces are CARRIED AWAY by water (rivers), wind, ice (glaciers), or gravity.',
      'These processes are SLOW — happening over thousands or millions of years — but the effects are huge: canyons, valleys, beaches, deltas.',
      'The Grand Canyon was carved by the Colorado River wearing away rock for ~6 million years.',
    ], vocabulary: [{ term: 'weathering', definition: 'breaking rocks down in place.' }, { term: 'erosion', definition: 'moving broken pieces somewhere else.' }, { term: 'glacier', definition: 'a slow-moving river of ice.' }], estimatedMinutes: 4 },
    { id: 'worked-canyon', kind: 'worked_example', problem: 'The Grand Canyon is over a mile deep. How did a relatively small river carve such a deep canyon?', steps: [
      'The Colorado River has been flowing for ~6 million years.',
      'Each year the river WEATHERS rock in its bed (water + sediment grinding away).',
      'The pieces are ERODED away downstream by the current.',
      'Mile deep ÷ 6 million years ≈ tiny amount each year — but it adds up.',
      'Slow processes + LOTS of time = huge changes.',
    ], answer: 'Slow weathering + erosion over millions of years carved the canyon, layer by layer.', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'You find a fossil of a clam shell embedded in rock layers near the top of a hill. What does this fossil tell you about that hill\'s history?', expectedAnswer: 'The hill was once UNDERWATER (since clams live in water). The rock layer formed at the bottom of an ancient sea, and Earth\'s movements later raised it up.', responseFormat: 'free', hints: ['Where do clams live today?', 'How could a sea creature end up high on a hill?'], estimatedMinutes: 3 },
    { id: 'misconception-fast-features', kind: 'misconception_check', question: 'A friend says "the Grand Canyon must have been formed all at once by a huge flood." Could that be the explanation?', commonErrors: [{ answer: 'Yes — one flood.', misconception: 'Believing major landforms form quickly.', correctsTo: 'A single flood couldn\'t cut through that much rock that precisely. The Grand Canyon shows clear EVIDENCE of slow erosion: distinct rock layers exposed in order, side canyons matching tributary streams, sediments downstream that match the canyon volume. It took millions of years.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Rocks form in layers; older layers are usually deeper.', 'Fossils tell us what lived where, when.', 'Weathering breaks rocks; erosion moves the pieces.', 'Slow processes + lots of time = huge landforms.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
