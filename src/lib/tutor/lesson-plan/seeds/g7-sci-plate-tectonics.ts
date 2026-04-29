/**
 * Grade 7 Science — Plate Tectonics.
 *
 * NGSS MS-ESS2-2 / MS-ESS2-3: how Earth's lithosphere is broken into
 * plates that move, and the geological events at plate boundaries
 * (earthquakes, volcanoes, mountains, ocean trenches). Connects to
 * the historical evidence (Wegener's continental drift, magnetic
 * stripes, fossils across continents).
 *
 * Source: NGSS MS-ESS2, OpenStax Earth Science, USGS materials.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SCI_PLATE_TECTONICS: LessonPlan = {
  id: 'evelyn.g7.science.earth.plate-tectonics.v1',
  title: 'Plate Tectonics',
  curriculum: 'NGSS',
  grade: '7',
  subject: 'science',
  topic: 'earth-systems',
  locale: 'en',
  los: [
    {
      id: 'ngss.ms-ess2-2',
      description: 'Construct an explanation based on evidence for how geoscience processes have changed Earth\'s surface at varying time and spatial scales.',
      standard: 'NGSS.MS-ESS2-2',
    },
    {
      id: 'ngss.ms-ess2-3',
      description: 'Analyze and interpret data on the distribution of fossils and rocks, continental shapes, and seafloor structures to provide evidence of the past plate motions.',
      standard: 'NGSS.MS-ESS2-3',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.hs-ess2-1'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hook with the puzzle of why South America and Africa look like they fit together.',
      script: 'Look at a map. Notice how the east coast of South America matches the west coast of Africa — like two puzzle pieces? In 1912, a scientist named Alfred Wegener noticed this and said: "Maybe they USED to be one continent." Everyone laughed. Today, we know he was right. Why?',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-plates',
      kind: 'concept',
      goal: 'Earth\'s outer shell is broken into about 15 large plates that float on hotter, flowing rock below — and slowly move around.',
      keyIdeas: [
        'Earth\'s LITHOSPHERE (crust + uppermost mantle) is broken into ~15 large pieces called PLATES.',
        'Plates float on the ASTHENOSPHERE — hot, soft rock that flows slowly (like very thick honey).',
        'Plates move at about 2-10 cm per year — fingernail-growth speed. Over millions of years, that\'s thousands of kilometers.',
        'CONVECTION CURRENTS in the mantle drive the motion: hot rock rises, cools, sinks → drags plates along the surface.',
        'There are two types of crust: OCEANIC (denser, thinner) and CONTINENTAL (less dense, thicker).',
      ],
      vocabulary: [
        { term: 'lithosphere', definition: 'Earth\'s rigid outer layer (crust + uppermost mantle).' },
        { term: 'asthenosphere', definition: 'the hot, slowly-flowing layer below the lithosphere.' },
        { term: 'plate', definition: 'a large slab of lithosphere that moves over the asthenosphere.' },
        { term: 'convection', definition: 'circular flow caused by hot material rising and cool material sinking.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_diagram'],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-boundaries',
      kind: 'concept',
      goal: 'Three kinds of plate boundary, each producing distinctive geology.',
      keyIdeas: [
        'CONVERGENT — plates push TOGETHER. Possible outcomes:',
        '  · Oceanic + continental → oceanic dives under (subduction) → trench + volcanic mountains (e.g., Andes).',
        '  · Continental + continental → both buckle up → mountains (e.g., Himalayas, formed by India crashing into Asia).',
        '  · Oceanic + oceanic → one subducts → island arc + deep trench (e.g., Mariana Trench).',
        'DIVERGENT — plates pull APART. Magma rises into the gap. New crust forms. Mid-ocean ridges (e.g., Mid-Atlantic Ridge); rift valleys on land (e.g., East African Rift).',
        'TRANSFORM — plates slide PAST each other horizontally. No new crust, no destruction — but huge friction → earthquakes (e.g., San Andreas Fault).',
      ],
      vocabulary: [
        { term: 'subduction', definition: 'when one plate dives under another at a convergent boundary.' },
        { term: 'mid-ocean ridge', definition: 'an underwater mountain range at a divergent boundary.' },
        { term: 'fault', definition: 'a crack where plates or rock layers slide past each other.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_diagram'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-himalayas',
      kind: 'worked_example',
      problem: 'The Himalayan mountain range is still GROWING — about 5 mm taller each year. Use plate tectonics to explain why.',
      steps: [
        'India sits on the Indian plate; the rest of Asia sits on the Eurasian plate.',
        'About 50 million years ago, the Indian plate (drifting north) crashed into the Eurasian plate. CONVERGENT boundary, both continental.',
        'Continental crust doesn\'t subduct easily (too low density). Instead, the two plates BUCKLE up at the collision zone.',
        'India keeps pushing north (~5 cm/year). The collision continues to compress the rocks → mountains keep rising.',
        '5 mm/year of uplift is the ongoing result of an ongoing collision.',
      ],
      answer: 'The Indian plate is still pushing into the Eurasian plate. The collision keeps buckling up the rocks, raising the mountains.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'The Atlantic Ocean is GETTING WIDER each year. Which type of plate boundary runs down the middle of the Atlantic, and what\'s happening at it?',
      expectedAnswer: 'A divergent boundary (the Mid-Atlantic Ridge). Plates are pulling apart, magma rises and forms new oceanic crust, pushing North/South America westward and Europe/Africa eastward.',
      responseFormat: 'free',
      hints: [
        'Three boundary types: convergent (push together), divergent (pull apart), transform (slide past).',
        'Which one would make the ocean wider over time?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-static-earth',
      kind: 'misconception_check',
      question: 'A student says "the continents look fixed because nothing\'s really moving — Wegener was wrong." How would you respond?',
      commonErrors: [
        {
          answer: 'Right — continents are fixed.',
          misconception: 'Confusing "I don\'t feel motion" with "no motion is happening".',
          correctsTo: 'The plates ARE moving — about 2-10 cm/year. We can\'t feel it because it\'s so slow, but GPS measurements directly track plate motion in real time. Evidence for past motion: matching coastlines, identical fossils on now-separated continents (Mesosaurus in South America AND Africa), magnetic stripes on the seafloor showing where new crust formed.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Earth\'s outer shell is broken into ~15 plates.',
        'Plates float on flowing hot mantle (asthenosphere) and move ~2-10 cm/year.',
        'Three boundary types: convergent (mountains, subduction), divergent (mid-ocean ridges, rift valleys), transform (earthquakes).',
        'Continental drift IS happening — measured directly by GPS.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
