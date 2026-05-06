/**
 * Grades 9-10 Science — Plate Tectonics.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_SCI_PLATE_TECTONICS: LessonPlan = {
  id: 'evelyn.g910.science.plate-tectonics.v1',
  title: 'Earth Science — Plate Tectonics and Boundaries',
  curriculum: 'NGSS',
  grade: '9',
  subject: 'science',
  topic: 'earth-science-hs',
  locale: 'en',
  los: [
    {
      id: 'g910.sci.earth.plate-tectonics',
      description: 'Explain plate tectonic theory, identify the three main types of plate boundaries, and connect each to characteristic geologic features.',
      standard: 'NGSS-HS-ESS2-1',
    },
  ],
  prerequisites: [],
  followUps: ['g910.sci.earth.atmosphere'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Earth\'s surface is a giant cracked shell — pieces moving inches per year shape continents, mountains, earthquakes.',
      script: 'The continents look fixed, but they\'re drifting. Africa and South America fit together like puzzle pieces because they once were. Today: how plate tectonics explains earthquakes, volcanoes, mountains, and ocean trenches — all from the same simple idea.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-plate-tectonics',
      kind: 'concept',
      goal: 'Plate theory, three boundary types, geologic features.',
      keyIdeas: [
        'PLATE TECTONICS: Earth\'s LITHOSPHERE (crust + upper mantle) is broken into ~15 large plates that float on the molten ASTHENOSPHERE below.',
        'Plates move 1-10 cm per year, driven by convection in the mantle (heat from Earth\'s core rises, cooler mantle sinks).',
        'CONTINENTAL DRIFT (Wegener, 1912): the idea that continents move. Initially rejected; confirmed in the 1960s by ocean-floor mapping.',
        'EVIDENCE for plate tectonics:',
        '  Coastlines fit (Africa + South America).',
        '  Matching fossils on opposite sides of oceans.',
        '  Matching rock formations.',
        '  Magnetic stripes on the seafloor symmetric around mid-ocean ridges (showing seafloor spreading).',
        '  Earthquake and volcano distributions (along plate boundaries).',
        'THREE TYPES OF PLATE BOUNDARIES:',
        '  1. DIVERGENT: plates move APART. Magma rises to fill the gap, creating new crust.',
        '     Mid-ocean ridges (Mid-Atlantic Ridge). Continental rifts (East African Rift).',
        '     Features: volcanic activity, shallow earthquakes.',
        '  2. CONVERGENT: plates move TOWARD each other. One sinks under the other (subduction) or they crumple together.',
        '     Ocean-continent: ocean plate subducts under continent. Examples: Andes (Pacific plate under South America), Cascade Range (Pacific Northwest US).',
        '     Ocean-ocean: one ocean plate under another. Forms island arcs (Japan, Philippines).',
        '     Continent-continent: no subduction, just crumpling. Forms huge mountain ranges (Himalayas: India crashing into Asia).',
        '     Features: deep ocean trenches, volcanic arcs, deep + powerful earthquakes.',
        '  3. TRANSFORM: plates slide PAST each other. No new crust, no destruction.',
        '     Example: San Andreas Fault (Pacific and North American plates).',
        '     Features: shallow but powerful earthquakes; fewer volcanoes.',
        'RING OF FIRE: the boundary of the Pacific Ocean — most of the world\'s earthquakes and volcanoes occur there because of converging and subducting plates.',
      ],
      vocabulary: [
        { term: 'subduction', definition: 'when one tectonic plate sinks beneath another at a convergent boundary; produces deep trenches and volcanism.' },
        { term: 'mid-ocean ridge', definition: 'an underwater mountain range at a divergent boundary where new oceanic crust forms.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'The Andes mountain range runs along the western edge of South America. Earthquakes are common there. What kind of plate boundary causes this, and what specific process is at work?',
      steps: [
        'Western South America = continent. Pacific Ocean = ocean plate.',
        'They are converging. The denser oceanic plate sinks BENEATH the continental plate (subduction).',
        'Subduction generates: deep ocean trench (Peru-Chile Trench), volcanic mountain range (Andes), powerful earthquakes from the friction of the descending plate.',
        'Boundary type: CONVERGENT (specifically ocean-continent subduction).',
      ],
      answer: 'Convergent (ocean-continent) — Pacific plate subducting under South American plate.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'The Mid-Atlantic Ridge is an underwater mountain range running down the centre of the Atlantic Ocean. What type of boundary, and what is happening?',
      expectedAnswer: 'Divergent boundary. The North American and Eurasian plates (and the South American and African plates) are moving apart. Magma rises through the gap, creating new oceanic crust. The Atlantic Ocean is widening by ~2-5 cm per year. Iceland sits on this ridge — that\'s why it has so many volcanoes and geysers.',
      responseFormat: 'free',
      hints: [
        'A mid-OCEAN ridge usually means one type of boundary.',
        'What process creates new crust?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-continents-only',
      kind: 'misconception_check',
      question: 'A student says plate tectonics is about continents moving — implying ocean plates don\'t move. What\'s the correction?',
      commonErrors: [
        {
          answer: 'Only continents move',
          misconception: 'Confusing "continental drift" with the full theory of plate tectonics.',
          correctsTo: 'Plate tectonics involves BOTH oceanic AND continental plates. Plates can be entirely oceanic (Pacific plate, mostly under the Pacific Ocean) or have continental parts (Eurasian plate). The plates are pieces of the LITHOSPHERE — both crust types — and all move together. Many of the most dramatic features (mid-ocean ridges, ocean trenches, island arcs) involve oceanic plates exclusively.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Lithosphere is broken into plates that float on the asthenosphere.',
        'Three boundaries: divergent (apart), convergent (together), transform (sliding).',
        'Convergent → trenches, volcanoes, big mountains, big earthquakes.',
        'Divergent → mid-ocean ridges, new crust, smaller quakes.',
        'Transform → shallow earthquakes (San Andreas).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
