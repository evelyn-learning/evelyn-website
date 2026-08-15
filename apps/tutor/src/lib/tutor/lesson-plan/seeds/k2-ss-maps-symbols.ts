/**
 * Grades K-2 Social Studies — Maps & Symbols.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SS_MAPS_SYMBOLS: LessonPlan = {
  id: 'evelyn.k2.ss.maps-symbols.v1',
  title: 'K-2 SS — Maps & Symbols',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ss',
  topic: 'k2-ss',
  locale: 'en',
  los: [
    {
      id: 'k2.ss.maps-symbols',
      description: 'Recognise that maps represent real places using symbols; identify cardinal directions and a map key.',
      standard: 'NCSS K-2 People, Places, Environments',
    },
  ],
  prerequisites: ['k2.ss.community-intro'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A map is a picture that shows where things are — and helps you find your way.',
      script: 'A map is like a picture of a place from above, as if you were a bird. Little symbols stand for big things. A tiny tree means a forest; a square stands for a building. Today we drill how to read maps.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-maps',
      kind: 'concept',
      goal: 'Map basics + symbols + key + directions.',
      keyIdeas: [
        'MAP: a picture from above showing where things are.',
        'SYMBOLS: little pictures that stand for real things. A tree = forest. A wavy line = river. A square = building.',
        'KEY (or LEGEND): a box on the map that tells what the symbols mean.',
        'CARDINAL DIRECTIONS: North, South, East, West. North is usually UP on a map. (Mnemonic: "Never Eat Soggy Waffles" — N, E, S, W clockwise.)',
        'COMPASS ROSE: a small star that shows directions on the map.',
        'TYPES of maps: street map (shows roads and buildings), world map (shows countries), playground map (small area).',
        'TO READ a map: 1) Find the KEY to know what symbols mean. 2) Find the COMPASS ROSE for direction. 3) Look for what you need.',
      ],
      vocabulary: [
        { term: 'map', definition: 'a picture that shows where places are.' },
        { term: 'symbol', definition: 'a small picture that stands for something bigger.' },
        { term: 'key', definition: 'a box on the map that tells what the symbols mean.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-map',
      kind: 'worked_example',
      problem: 'A map\'s key shows: blue line = river, green triangle = mountain, brown square = house. The map has a brown square next to a blue line. What does this mean?',
      steps: [
        'Look at the symbols and check the key.',
        'Brown square = house.',
        'Blue line = river.',
        'A house next to a river — there\'s a real house close to a river in this place.',
      ],
      answer: 'A house near a river.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'On a map, you are at a school. North is up. Your home is below the school on the map. Which direction is your home?',
      expectedAnswer: 'South',
      responseFormat: 'free',
      hints: [
        'North is up. So down is the opposite of up.',
        'The opposite of North is South.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-map-real-size',
      kind: 'misconception_check',
      question: 'A child says "the river on the map is tiny, so the real river must be tiny too." Correct?',
      commonErrors: [
        {
          answer: 'Tiny on map = tiny in real life',
          misconception: 'Treating a map as the same size as real places.',
          correctsTo: 'Maps are SHRUNK DOWN. Real places are MUCH bigger. A river that\'s 5 cm on the map could be many miles long in real life. Maps make big places fit on small paper. To know real size, look for a SCALE on the map (a bar showing how much real distance equals each inch of map).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Map = picture from above.',
        'Symbols stand for real things.',
        'Key explains the symbols.',
        'North is usually up. NESW.',
        'Maps are shrunk; real places are bigger.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do you think maps put NORTH at the top?',
      hint: 'It\'s a CONVENTION — agreed upon centuries ago, when many maps were drawn by Europeans pointing toward the magnetic North Pole. Most maps follow this. But there\'s no scientific reason — Earth has no actual "up". Some maps deliberately invert this (south up) to make people think.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
