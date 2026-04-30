/**
 * G3 — Social Studies: Reading maps and globes.
 *
 * The first systematic geography skill. Cardinal directions
 * (N/S/E/W), map keys / legends, scale, latitude vs longitude
 * (basic). The difference between a flat map and a 3D globe — and
 * why distortion happens.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_SS_MAPS_GLOBES: LessonPlan = {
  id: 'evelyn.g3.ss.maps-globes.v1',
  title: 'Reading Maps and Globes',
  curriculum: 'state-standards',
  grade: '3',
  subject: 'social-studies',
  topic: 'geography',
  locale: 'en',
  los: [
    {
      id: 'ss.g3.geog.maps',
      description: 'Use cardinal directions, map keys, and scale to interpret maps.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up maps as "tools that pack a lot of info into a small picture".',
      script: 'A map of your town fits on a piece of paper. But your actual town might be miles across. How does that work? Maps are clever — every line, color, and symbol stands for something real, in a much smaller space. Learning to read a map is like learning to read a secret code.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-map-tools',
      kind: 'concept',
      goal: 'Cardinal directions, compass rose, key/legend, scale, lat/lon, globe vs flat map.',
      keyIdeas: [
        'CARDINAL DIRECTIONS: North (N), South (S), East (E), West (W). The four main compass points.',
        'INTERMEDIATE directions: NE, NW, SE, SW (in between the cardinals).',
        'COMPASS ROSE: a small picture on the map showing which way is N/S/E/W.',
        'MAP KEY (or LEGEND): a small box showing what each symbol or color stands for. Always check the key first.',
        'SCALE: shows how distance on the map relates to real distance. ("1 inch = 10 miles".)',
        'LATITUDE: imaginary lines that run EAST-WEST around Earth. Measure how far NORTH or SOUTH a place is. The equator is 0° latitude.',
        'LONGITUDE: imaginary lines that run NORTH-SOUTH from pole to pole. Measure how far EAST or WEST. The prime meridian is 0° longitude.',
        'GLOBE = a 3D model of Earth. Most accurate but you can\'t carry it around easily.',
        'FLAT MAP = easier to use, but flattening a sphere causes some DISTORTION (sizes near the poles look bigger than they really are).',
      ],
      vocabulary: [
        { term: 'compass rose', definition: 'a symbol showing the cardinal directions on a map.' },
        { term: 'legend / key', definition: 'a guide explaining the symbols and colors on a map.' },
        { term: 'scale', definition: 'shows how map distance relates to real distance.' },
        { term: 'latitude', definition: 'east-west lines measuring north-south position.' },
        { term: 'longitude', definition: 'north-south lines measuring east-west position.' },
      ],
      suggestedTools: ['show_map', 'show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-directions',
      kind: 'worked_example',
      problem: 'You\'re at the school. The library is two blocks east, then one block north. The park is three blocks south of the library. Which cardinal direction is the park from the school?',
      steps: [
        'Start at school.',
        'East 2 blocks to library.',
        'North 1 block to library entrance.',
        'South 3 blocks to park: that ends 2 blocks SOUTH of where the school was (1 block north - 3 blocks south = 2 blocks south).',
        'Park is 2 blocks south and 2 blocks east of school. So roughly SOUTHEAST of school.',
      ],
      answer: 'Southeast (SE)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'On a map, the scale says "1 inch = 5 miles." Two cities are 4 inches apart on the map. How many miles apart are they in real life?',
      expectedAnswer: '20',
      responseFormat: 'numeric',
      hints: [
        'Each inch is 5 miles.',
        '4 inches × 5 miles = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-globe-vs-flat',
      kind: 'misconception_check',
      question: 'On a flat world map, Greenland looks about as big as Africa. Sage concludes Greenland is roughly the size of Africa. Right?',
      commonErrors: [
        {
          answer: 'yes — the map shows it',
          misconception: 'Treating flat-map sizes as accurate, especially near the poles.',
          correctsTo: 'Wrong. Flattening a sphere stretches things near the poles. On a globe, Africa is about 14 TIMES the area of Greenland. Flat maps lie about size at the top and bottom — always check a globe (or look up the real area) for size comparisons.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Compass rose tells you N/S/E/W. Always check it first.',
        'Map key explains the symbols. Read it before reading the map.',
        'Scale: 1 inch = ? miles. Multiply to get real distance.',
        'Latitude = north/south position. Longitude = east/west position.',
        'Globes are accurate; flat maps distort sizes near the poles.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do maps usually put north at the top? Is there a "right" way?',
      hint: 'It\'s a convention, not a rule. Older maps put east at the top (where the sun rises) — "orient" actually comes from the same root. North-up is standardized but somewhat arbitrary.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
