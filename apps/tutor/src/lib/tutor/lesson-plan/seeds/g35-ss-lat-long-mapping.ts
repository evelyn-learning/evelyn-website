/**
 * Grades 3-5 Social Studies — Latitude & Longitude.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_SS_LAT_LONG_MAPPING: LessonPlan = {
  id: 'evelyn.g35.ss.lat-long-mapping.v1',
  title: 'Grades 3-5 SS — Latitude & Longitude',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ss',
  topic: 'g35-ss',
  locale: 'en',
  los: [
    {
      id: 'g35.ss.lat-long-mapping',
      description: 'Use latitude and longitude lines to locate places on a globe or world map.',
      standard: 'NCSS 3-5 People, Places, Environments',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A grid of imaginary lines lets you find ANY place on Earth — even in the middle of the ocean.',
      script: 'Sailors hundreds of years ago needed to find their way without GPS. They invented latitude and longitude — a grid of lines around the Earth. With just two numbers, you can pinpoint anywhere. Today we drill how it works.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-latlong',
      kind: 'concept',
      goal: 'Latitude + longitude + key reference lines + reading coordinates.',
      keyIdeas: [
        'LATITUDE: lines that go HORIZONTALLY around Earth (like belts). Measured in degrees NORTH or SOUTH of the EQUATOR (0°).',
        'LONGITUDE: lines that go VERTICALLY from North Pole to South Pole. Measured EAST or WEST of the PRIME MERIDIAN (0°, runs through Greenwich, London).',
        'EQUATOR: 0° latitude. Divides Earth into Northern and Southern Hemispheres.',
        'PRIME MERIDIAN: 0° longitude. Divides Earth into Eastern and Western Hemispheres.',
        'POLES: North Pole at 90°N latitude. South Pole at 90°S.',
        'INTERNATIONAL DATE LINE: about 180° longitude. Crossing it changes the date by one day.',
        'COORDINATES: written latitude FIRST, then longitude. "40°N, 74°W" = New York City.',
        'REMEMBERING: LATitude = LADder rungs (horizontal). LONGitude = LONG lines from pole to pole (vertical).',
        'GPS uses latitude and longitude (with extreme precision) to pinpoint your phone\'s location.',
        'NORTHERN HEMISPHERE includes North America, Europe, most of Asia, northern Africa.',
        'SOUTHERN HEMISPHERE includes most of South America, southern Africa, Australia, Antarctica.',
      ],
      vocabulary: [
        { term: 'latitude', definition: 'horizontal lines around Earth measuring north-south position.' },
        { term: 'longitude', definition: 'vertical lines from pole to pole measuring east-west position.' },
        { term: 'equator', definition: 'the imaginary line around Earth\'s middle at 0° latitude.' },
        { term: 'Prime Meridian', definition: 'the imaginary line from pole to pole at 0° longitude (through Greenwich).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-locate',
      kind: 'worked_example',
      problem: 'A city is located at 35°N, 139°E. Roughly where is it?',
      steps: [
        '35°N: 35 degrees NORTH of the equator. Northern Hemisphere.',
        '139°E: 139 degrees EAST of the Prime Meridian. East of London.',
        'Looking at a map: that\'s in EAST ASIA.',
        '35°N puts it about the same latitude as Tennessee (US).',
        '139°E places it in the western Pacific.',
        'Those coordinates are TOKYO, JAPAN.',
      ],
      answer: 'Tokyo, Japan.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Is the EQUATOR a line of LATITUDE or LONGITUDE?',
      expectedAnswer: 'Latitude (it goes around Earth horizontally, at 0°).',
      responseFormat: 'free',
      hints: [
        'It runs around Earth\'s middle horizontally.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mix-up',
      kind: 'misconception_check',
      question: 'A child says "latitude lines run from pole to pole." Correct?',
      commonErrors: [
        {
          answer: 'Latitude = pole to pole',
          misconception: 'Mixing up latitude (horizontal) with longitude (vertical).',
          correctsTo: 'LATITUDE lines go HORIZONTALLY around Earth (like belts or ladder rungs). LONGITUDE lines go VERTICALLY from pole to pole. The mnemonic: LADder = LATitude (rungs are horizontal). Or "lat is FLAT" — latitude lines are flat circles.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Latitude = horizontal (north-south position from equator).',
        'Longitude = vertical (east-west position from Prime Meridian).',
        'Equator: 0° latitude. Prime Meridian: 0° longitude.',
        'Coordinates: latitude first, then longitude.',
        'Lat is FLAT. Long lines go pole to pole.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the WEATHER tend to be hotter near the EQUATOR?',
      hint: 'The equator gets the most DIRECT sunlight year-round. Earth tilts on its axis, so as you move toward the poles, sunlight hits at an angle and spreads over more area, less concentrated. At the equator, sunlight hits more head-on. Latitude is a strong predictor of climate — tropical at the equator, polar at the extremes.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
