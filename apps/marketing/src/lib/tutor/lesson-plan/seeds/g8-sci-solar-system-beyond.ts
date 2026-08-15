/**
 * Grade 8 Science — Solar System and Beyond.
 * NGSS MS-ESS1-2 / MS-ESS1-3: gravity in our solar system; scale of
 * the universe.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SCI_SOLAR_SYSTEM_BEYOND: LessonPlan = {
  id: 'evelyn.g8.science.space.solar-system-beyond.v1',
  title: 'The Solar System and Beyond',
  curriculum: 'NGSS', grade: '8', subject: 'science', topic: 'space', locale: 'en',
  los: [{ id: 'ngss.ms-ess1-2', description: 'Develop and use a model to describe the role of gravity in the motions within galaxies and the solar system.', standard: 'NGSS.MS-ESS1-2' }],
  prerequisites: ['ngss.5-ess1-2'], followUps: ['ngss.hs-ess1-4'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in scale.', script: 'Light from the sun takes 8 minutes to reach Earth. Light from the next-nearest STAR takes 4 YEARS. Light from the Andromeda galaxy takes 2.5 MILLION years. Space is huge — and gravity holds it together.', estimatedMinutes: 2 },
    { id: 'concept-gravity-rules', kind: 'concept', goal: 'Gravity is the master force in space — keeps planets orbiting the sun, moons orbiting planets, and stars in galaxies.', keyIdeas: [
      'GRAVITY: every mass attracts every other mass. STRENGTH depends on (a) mass and (b) distance squared.',
      'F = G × m₁ × m₂ / r².',
      'Bigger mass → more pull. Closer distance → much more pull (squared!).',
      'The SUN holds 99.8% of the solar system\'s mass → its gravity dominates.',
      'Planets ORBIT the sun (don\'t fall in) because they\'re moving SIDEWAYS — sideways momentum + gravity\'s pull = orbit.',
      'Moons orbit planets. Galaxies hold stars together. Gravity scales up.',
    ], vocabulary: [{ term: 'gravity', definition: 'attraction between masses.' }, { term: 'orbit', definition: 'curved path around a more massive body.' }, { term: 'galaxy', definition: 'a system of billions of stars held together by gravity.' }], suggestedTools: ['show_equation'], estimatedMinutes: 5 },
    { id: 'concept-scale', kind: 'concept', goal: 'Solar system → Milky Way → local group → universe.', keyIdeas: [
      'SOLAR SYSTEM: sun + planets + moons. ~100,000 AU across.',
      'MILKY WAY GALAXY: ~100 billion stars (incl our sun). 100,000 LIGHT-YEARS across.',
      'LOCAL GROUP: ~50 galaxies including Milky Way + Andromeda. Held by gravity.',
      'OBSERVABLE UNIVERSE: ~93 billion light-years across. Contains ~2 trillion galaxies.',
      'LIGHT-YEAR = distance light travels in 1 year ≈ 9.46 trillion km.',
    ], estimatedMinutes: 4 },
    { id: 'worked-orbit-distance', kind: 'worked_example', problem: 'Why does the Moon stay in orbit around Earth instead of either flying off into space or crashing into Earth?', steps: [
      'Moon has SIDEWAYS velocity (about 1 km/s).',
      'Earth\'s GRAVITY pulls moon TOWARD Earth.',
      'Two effects combine: moon would fly off in a straight line, but gravity keeps bending its path INWARD.',
      'Result: a CURVED PATH — the orbit. The moon is constantly "falling" toward Earth, but moving sideways fast enough to keep missing.',
      'If moon\'s sideways speed were too LOW: it would spiral in and crash. Too HIGH: it would escape Earth\'s gravity.',
    ], answer: 'Sideways motion + gravity\'s pull balance: the moon constantly falls toward Earth but keeps missing.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Pluto is much farther from the sun than Earth. Is the sun\'s gravitational pull on Pluto stronger, weaker, or the same as on Earth (assume Pluto and Earth had the same mass)?', expectedAnswer: 'WEAKER on Pluto. Gravity decreases with distance squared (F ∝ 1/r²). Pluto is ~40x farther → gravity is ~1600x weaker. That\'s why Pluto orbits SO SLOWLY (165 Earth years per orbit).', responseFormat: 'free', hints: ['Distance and gravity — what\'s the relationship?', '1/r² means doubling distance = 1/4 the gravity.'], estimatedMinutes: 3 },
    { id: 'misconception-no-gravity-in-space', kind: 'misconception_check', question: 'A friend says "astronauts on the ISS are weightless because there\'s NO gravity in space." Right?', commonErrors: [{ answer: 'Yes — no gravity in space.', misconception: 'Believing space is gravity-free.', correctsTo: 'Earth\'s gravity at the ISS\'s altitude is still ~90% of surface gravity. Astronauts are "weightless" because they\'re in CONSTANT FREE FALL around Earth — both they and the station fall at the same rate, so there\'s no apparent weight. Same reason elevator-drop briefly feels weightless.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Gravity scales with mass, decreases with distance squared.', 'Orbits = sideways motion + gravity pulling inward.', 'Solar system → galaxy → universe.', 'Distances measured in light-years (huge).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
