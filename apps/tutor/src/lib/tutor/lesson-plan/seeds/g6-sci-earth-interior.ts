/**
 * Grade 6 Science — Earth's Interior Structure.
 * NGSS MS-ESS2-1: develop a model to describe the cycling of Earth's
 * materials and the flow of energy that drives this process.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SCI_EARTH_INTERIOR: LessonPlan = {
  id: 'evelyn.g6.science.earth.earth-interior.v1',
  title: 'Inside the Earth',
  curriculum: 'NGSS', grade: '6', subject: 'science', topic: 'earth-systems', locale: 'en',
  los: [{ id: 'ngss.ms-ess2-1', description: 'Develop a model to describe the cycling of Earth\'s materials and the flow of energy that drives this process.', standard: 'NGSS.MS-ESS2-1' }],
  prerequisites: ['ngss.4-ess1-1'], followUps: ['ngss.hs-ess2-3'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in the strangeness of the inside.', script: 'Beneath your feet — going DOWN, not across — is some of the most extreme territory on Earth: rock so hot it flows like syrup, an ocean of liquid metal, a solid metal ball hotter than the sun\'s surface. We\'ve never been there. How do we know?', estimatedMinutes: 2 },
    { id: 'concept-layers', kind: 'concept', goal: 'Earth has four major layers: crust (rocky shell), mantle (hot semi-solid rock), outer core (liquid iron), inner core (solid iron).', keyIdeas: [
      'CRUST: thin outer rocky layer (5-70 km thick). What we live on. Two types: oceanic (denser, thinner) + continental (lighter, thicker).',
      'MANTLE: thick layer of hot rock below crust (~2900 km). Mostly SOLID but slowly FLOWS like very thick syrup over millions of years (asthenosphere). Convection here drives plate tectonics.',
      'OUTER CORE: LIQUID iron + nickel (~2200 km thick). Its motion creates Earth\'s MAGNETIC FIELD.',
      'INNER CORE: SOLID iron + nickel ball (~1200 km radius). ~5500°C — hotter than sun\'s surface. Solid because of immense pressure.',
      'How we know: SEISMIC WAVES from earthquakes travel differently through different materials. By tracking wave behavior, geologists mapped the layers.',
    ], vocabulary: [{ term: 'crust', definition: 'Earth\'s thin outer rocky layer.' }, { term: 'mantle', definition: 'thick hot rock layer below crust.' }, { term: 'core', definition: 'Earth\'s metal center (outer liquid, inner solid).' }, { term: 'seismic wave', definition: 'wave from earthquakes used to study Earth\'s interior.' }], estimatedMinutes: 5 },
    { id: 'concept-energy-cycling', kind: 'concept', goal: 'Heat from Earth\'s core drives motion in the mantle. That motion drives plate tectonics, volcanoes, earthquakes, and the magnetic field.', keyIdeas: [
      'Heat sources: residual heat from formation + radioactive decay in the mantle.',
      'Convection in the mantle: hot rock rises, cools, sinks → drives plates.',
      'Convection in the outer core: moving liquid iron generates Earth\'s MAGNETIC FIELD (compasses, protection from solar wind).',
      'Without internal heat, Earth would be geologically dead — no volcanoes, no plate motion, no magnetic field.',
    ], estimatedMinutes: 4 },
    { id: 'worked-seismic-evidence', kind: 'worked_example', problem: 'A seismologist watches earthquake waves. Some types pass through the entire Earth. Others pass through solids but DIE OUT in liquids. How does this help map Earth\'s interior?', steps: [
      'Two main wave types: P-waves (compression) pass through everything; S-waves (shear) pass through SOLIDS only, not liquids.',
      'Detectors all over Earth record arrival times.',
      'When S-waves DON\'T arrive at certain regions on the opposite side from a quake → SHADOW ZONE.',
      'The shadow zone matches what we\'d expect if there\'s a LIQUID layer (the outer core) blocking S-waves.',
      'Wave bending also reveals layer boundaries (waves change speed at boundaries).',
    ], answer: 'S-waves blocked by liquids → outer core must be liquid. Wave bending shows boundaries.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'If Earth\'s interior were entirely solid, what would be different about life on the surface?', expectedAnswer: 'No plate tectonics → no mountains forming, no earthquakes (or very few), no volcanoes recycling minerals to the surface, no magnetic field (which protects us from solar radiation). Earth would look more like the Moon — geologically dead.', responseFormat: 'free', hints: ['Internal heat drives mantle motion → plates.', 'Liquid outer core → magnetic field.'], estimatedMinutes: 3 },
    { id: 'misconception-uniform-rock', kind: 'misconception_check', question: 'A friend says "deep inside Earth is just solid rock all the way down to the center." True?', commonErrors: [{ answer: 'Yes — solid rock all the way.', misconception: 'Imagining uniform Earth interior.', correctsTo: 'Different layers with different STATES: crust solid, mantle solid-but-flows, OUTER CORE LIQUID iron, inner core solid iron. Not all rock either — the core is metal.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Four layers: crust, mantle, outer core (liquid), inner core (solid).', 'Internal heat drives mantle convection → plate tectonics.', 'Liquid outer core motion → Earth\'s magnetic field.', 'Mapped via seismic waves from earthquakes.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
