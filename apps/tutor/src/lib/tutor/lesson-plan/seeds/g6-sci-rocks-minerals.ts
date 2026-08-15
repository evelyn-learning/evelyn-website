/**
 * G6 — Rocks and minerals.
 *
 * Three rock types (igneous, sedimentary, metamorphic) and the rock
 * cycle. Mineral identification by hardness, streak, luster.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SCI_ROCKS_MINERALS: LessonPlan = {
  id: 'evelyn.g6.sci.earth.rocks-minerals.v1',
  title: 'Rocks, minerals, and the rock cycle',
  curriculum: 'NGSS',
  grade: '6',
  subject: 'sci',
  topic: 'earth-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.ms-ess2.a',
      description: 'Develop a model to describe the cycling of Earth\'s materials and the flow of energy that drives this process.',
      standard: 'NGSS.MS-ESS2-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.ms-ess2.b'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open with the "everything is connected" rock cycle pitch.',
      script: 'A piece of granite in the mountains today might have been LAVA millions of years ago — and could be SAND on a beach a few million years from now. Rocks aren\'t fixed; they cycle.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-three-types',
      kind: 'concept',
      goal: 'Three rock types based on how they form, plus the rock cycle that converts them.',
      keyIdeas: [
        'IGNEOUS rocks form from cooled MAGMA or LAVA. "Igneous" comes from "ignis" = fire. Examples: granite (slow cooling underground, big crystals), basalt (fast cooling on surface, small crystals), pumice, obsidian.',
        'SEDIMENTARY rocks form when bits of rock, plant, or animal compress over time. Often have LAYERS and FOSSILS. Examples: sandstone (compressed sand), limestone (sea shells), shale (mud).',
        'METAMORPHIC rocks form when existing rocks are squeezed and heated underground but don\'t melt. Examples: marble (from limestone), slate (from shale), gneiss.',
        'ROCK CYCLE: each type can become the others. Igneous + weathering → sediment → sedimentary. Sedimentary + heat/pressure → metamorphic. Metamorphic + melting → magma → igneous. No starting point — it\'s a CYCLE.',
        'MINERAL: a naturally occurring solid with a specific chemical composition and crystal structure. Rocks are made of one or more minerals.',
        'TESTING MINERALS: HARDNESS (Mohs scale 1-10, talc to diamond), STREAK (color of powder), LUSTER (shiny/dull), CLEAVAGE (how it breaks).',
      ],
      vocabulary: [
        { term: 'mineral', definition: 'a naturally occurring solid with a fixed chemical recipe.' },
        { term: 'magma', definition: 'molten rock UNDERGROUND.' },
        { term: 'lava', definition: 'molten rock that has reached the SURFACE.' },
        { term: 'rock cycle', definition: 'the continuous process by which rocks change from one type to another.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-fossil-rock',
      kind: 'worked_example',
      problem: 'You find a rock with visible layers and a fish fossil. What type is it, and how did it form?',
      steps: [
        'Layers + fossils → SEDIMENTARY.',
        'Long ago, this fish died and sank to a sea floor or lake bed.',
        'Layers of sand and mud buried it, compressed it over millions of years.',
        'The pressure cemented the sediments into rock — preserving the fish shape as a fossil.',
        'Most likely: SHALE or LIMESTONE.',
      ],
      answer: 'sedimentary — formed by compression of sediments around the fish over millions of years',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Marble is used in statues. Originally it was limestone (a sedimentary rock). What type is marble, and how did it form?',
      expectedAnswer: 'metamorphic — heat and pressure transformed limestone',
      responseFormat: 'free',
      hints: [
        'Limestone got buried, squeezed, heated — but didn\'t melt.',
        'When existing rocks change form under heat/pressure → which type?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rock-mineral-same',
      kind: 'misconception_check',
      question: 'Is a rock the same thing as a mineral?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Conflating rocks and minerals.',
          correctsTo: 'No — a MINERAL has a fixed chemical recipe (quartz is always SiO₂). A ROCK is made of one or more minerals. Granite is a rock containing the minerals quartz, feldspar, and mica.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Igneous = cooled magma/lava. Sedimentary = compressed bits + fossils. Metamorphic = heat/pressure but no melting.',
        'Rock cycle: any type can become any other given the right conditions.',
        'Rocks are made of MINERALS (which have fixed chemistry).',
        'Test minerals by hardness, streak, luster.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does GRANITE have big crystals while BASALT has tiny ones — even though both are igneous?',
      hint: 'Granite cools slowly (underground), giving crystals time to grow. Basalt cools fast (on the surface), so crystals stay tiny.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
