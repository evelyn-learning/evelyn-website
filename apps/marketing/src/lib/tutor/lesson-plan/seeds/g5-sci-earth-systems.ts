/**
 * Grade 5 Science — Earth's Four Systems.
 * NGSS 5-ESS2-1: develop a model using an example to describe ways
 * the geosphere, biosphere, hydrosphere, and/or atmosphere interact.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_SCI_EARTH_SYSTEMS: LessonPlan = {
  id: 'evelyn.g5.science.earth.earth-systems.v1',
  title: 'Earth\'s Four Systems',
  curriculum: 'NGSS', grade: '5', subject: 'science', topic: 'earth-systems', locale: 'en',
  los: [{ id: 'ngss.5-ess2-1', description: 'Develop a model using an example to describe ways the geosphere, biosphere, hydrosphere, and/or atmosphere interact.', standard: 'NGSS.5-ESS2-1' }],
  prerequisites: ['ngss.2-ess2-3'], followUps: ['ngss.ms-ess2-4'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Connect the four spheres.', script: 'Take a deep breath. You just connected four of Earth\'s biggest systems: the AIR (atmosphere), the WATER vapor mixed in, the LIVING THING (you, in the biosphere), and indirectly — the ROCKS (geosphere) that produce the gases. Earth\'s systems are always interacting.', estimatedMinutes: 2 },
    { id: 'concept-four-spheres', kind: 'concept', goal: 'Earth has four interconnected systems: geosphere (rocks), hydrosphere (water), atmosphere (air), and biosphere (life). They interact constantly.', keyIdeas: [
      'GEOSPHERE: the SOLID Earth — rocks, soil, mountains, the core.',
      'HYDROSPHERE: all WATER — oceans, lakes, rivers, ice, groundwater.',
      'ATMOSPHERE: the AIR — layers of gas surrounding Earth.',
      'BIOSPHERE: ALL LIVING THINGS — plants, animals, fungi, bacteria.',
      'These interact every day:',
      '  · Plants (biosphere) breathe in CO₂ from air (atmosphere) and pull water (hydrosphere) through soil (geosphere).',
      '  · Volcanoes (geosphere) release gases (atmosphere).',
      '  · Rivers (hydrosphere) erode rocks (geosphere) and carry sediment to oceans.',
      '  · Animals (biosphere) drink water and breathe air.',
    ], vocabulary: [{ term: 'geosphere', definition: 'Earth\'s solid rock and soil.' }, { term: 'hydrosphere', definition: 'all of Earth\'s water.' }, { term: 'atmosphere', definition: 'Earth\'s air layer.' }, { term: 'biosphere', definition: 'all living things on Earth.' }], estimatedMinutes: 5 },
    { id: 'worked-volcanic-eruption', kind: 'worked_example', problem: 'A volcanic eruption affects multiple Earth systems. Trace what happens.', steps: [
      'GEOSPHERE: lava and rocks erupt — physical change to the land.',
      'ATMOSPHERE: gases (CO₂, sulfur dioxide, water vapor) and ash released into the air. Can affect global temperature.',
      'HYDROSPHERE: heat melts glaciers; gases dissolve in oceans (acidifying); ash darkens water.',
      'BIOSPHERE: living things in the area die or flee; ash makes soil more fertile (long-term benefit); altered atmosphere affects climate → affects all life.',
      'ONE event → cascading effects through ALL four spheres.',
    ], answer: 'A volcano connects all four spheres: rocks erupt (geo), gases enter air (atmo), heat affects water (hydro), and life nearby is disrupted (bio).', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A river flows through a forest. Identify how each of the four spheres is involved.', expectedAnswer: 'Hydrosphere = the water itself. Geosphere = the soil/rock the river flows over and erodes. Atmosphere = water evaporates from the surface; rain falls into it. Biosphere = trees drinking from the river, fish living in it, birds nearby.', responseFormat: 'free', hints: ['Each sphere has a part to play in this scene.', 'Don\'t forget invisible interactions (evaporation, breathing).'], estimatedMinutes: 3 },
    { id: 'misconception-isolated-systems', kind: 'misconception_check', question: 'A friend says "the four systems are separate — they don\'t really affect each other." Right?', commonErrors: [{ answer: 'Yes — they\'re separate.', misconception: 'Treating Earth\'s systems as independent.', correctsTo: 'They constantly interact. Plants take CO₂ from air, water from soil, send oxygen back to air. Climate change shows how strongly they\'re linked: warming atmosphere → melting ice (hydro) → rising seas → flooding coastal life (bio) → eroding land (geo).' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Geosphere = rocks/soil.', 'Hydrosphere = all water.', 'Atmosphere = air.', 'Biosphere = all life.', 'They INTERACT — change in one affects others.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
