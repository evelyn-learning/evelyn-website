/**
 * Grade 7 World Geography — Geography Tools: Latitude, Longitude & Absolute
 * Location.
 *
 * The procedure-led exemplar for the m7geo course (National Geography
 * Standard 1). One procedure runs the lesson: find the latitude, find the
 * longitude, write latitude first with its hemisphere letter.
 *
 * The two traps it is built to kill are (a) believing latitude lines "go up
 * and down" because they measure a north-south position -- they run
 * horizontally -- and (b) writing a coordinate pair in the wrong order.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO MAPS AND NO IMAGES in this course.
 * Every item here is solvable from the words printed inside it. Where a map
 * is needed, describe it. And every factual claim about a real place must be
 * true -- prefer the fixed reference lines (Equator, Prime Meridian, the
 * tropics) over anything that can change.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U1_LATITUDE_LONGITUDE_AND_LOCATION: LessonPlan = {
  id: 'evelyn.ms.m7geo.latitude-longitude-and-location.v1',
  title: 'Latitude, Longitude & Absolute Location',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.latitude-longitude-and-location',
      standard: 'M7GEO-1.2',
      description:
        'Use lines of latitude and longitude to state the absolute location of a place, and read a coordinate pair correctly including its hemisphere letters (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: ['m7geo.maps-globes-and-projections'],
  followUps: ['m7geo.map-elements-scale-and-direction'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show why a shared coordinate system exists, using something the student has already relied on.',
      script:
        'Try telling somebody where you are without using a street name. You might say near the big park, or two blocks from the store with the green sign. That works if the other person knows your town. It is useless to somebody a thousand miles away. Every phone that has ever found you, every ship, every rescue helicopter uses the same fix for this problem: two numbers that work anywhere on Earth and mean the same thing to everyone. Today we learn to read those two numbers, and to write them in the order that keeps them from meaning the wrong place.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-coordinates',
      kind: 'concept',
      goal: 'Define both line families, fix the horizontal/vertical confusion, and set the write-order rule.',
      keyIdeas: [
        'LATITUDE LINES RUN EAST AND WEST, AND THEY MEASURE HOW FAR NORTH OR SOUTH YOU ARE. This is the sentence students get backwards, so read it twice. The lines themselves lie flat, like the rungs of a ladder going around the globe. What they MEASURE is your north-south position. WRONG: "Latitude lines run up and down because they measure north and south." RIGHT: "Latitude lines run east and west, and they measure a north-south position." Latitude lines are also called parallels, because they never meet.',
        'LATITUDE STARTS AT THE EQUATOR, which is 0 degrees. From there it counts up to 90 degrees at the North Pole and 90 degrees at the South Pole. Every latitude except the Equator itself needs a letter, N or S, or you have named two different places at once. Useful fixed lines: the Tropic of Cancer at about 23.5 degrees N, the Tropic of Capricorn at about 23.5 degrees S, and the Arctic Circle at about 66.5 degrees N.',
        'LONGITUDE LINES RUN NORTH AND SOUTH, FROM POLE TO POLE, AND THEY MEASURE HOW FAR EAST OR WEST YOU ARE. They are also called meridians. Unlike parallels, they are not parallel to each other -- they are farthest apart at the Equator and they all meet at the poles.',
        'LONGITUDE STARTS AT THE PRIME MERIDIAN, which is 0 degrees, and counts up to 180 degrees going east and 180 degrees going west. So longitude needs an E or a W. Notice the two ranges are different: latitude never goes past 90, longitude goes to 180. A number larger than 90 in the first slot of a coordinate pair is a signal that something is wrong.',
        'ALWAYS WRITE LATITUDE FIRST, THEN LONGITUDE. The order is not a style choice; it changes which place you named. Say it as one phrase every time: latitude first, longitude second. Together the two numbers give a place its ABSOLUTE LOCATION -- the one exact spot, the same for everybody. That is different from RELATIVE location, which describes a place by what it is near.',
        'HEMISPHERE LETTERS ARE NOT OPTIONAL. Dropping the N or the S puts a place in two possible spots, one north of the Equator and one south of it. The same is true of E and W around the Prime Meridian. A coordinate without its letters is not an answer.',
      ],
      vocabulary: [
        { term: 'latitude', definition: 'the measure of how far north or south a place is from the Equator, in degrees.' },
        { term: 'longitude', definition: 'the measure of how far east or west a place is from the Prime Meridian, in degrees.' },
        { term: 'Equator', definition: 'the line of latitude at 0 degrees, halfway between the poles.' },
        { term: 'Prime Meridian', definition: 'the line of longitude at 0 degrees, from which east and west are measured.' },
        { term: 'absolute location', definition: 'the exact position of a place, usually given as a latitude and longitude pair.' },
        { term: 'relative location', definition: 'where a place is in relation to other places, such as north of a river.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-read-a-coordinate',
      kind: 'worked_example',
      problem:
        'A weather station reports its position as 40 degrees N, 75 degrees W. Describe in plain words where on Earth that is, and explain how you know.',
      steps: [
        'Take the numbers in the order they are written. The first one is always latitude, so the latitude is 40 degrees N.',
        'Read what that means. Latitude is measured from the Equator, and the letter is N, so this place is 40 degrees north of the Equator. That puts it in the Northern Hemisphere, well north of the Tropic of Cancer at about 23.5 degrees N.',
        'The second number is longitude: 75 degrees W. Longitude is measured from the Prime Meridian, and the letter is W, so this place is 75 degrees west of it. That puts it in the Western Hemisphere.',
        'Put the two together: a spot in the Northern Hemisphere, about 40 degrees up from the Equator, and in the Western Hemisphere, about 75 degrees west of the Prime Meridian.',
        'Sanity-check the numbers before you finish. Latitude of 40 is under 90, so it is possible. Longitude of 75 is under 180, so it is possible. Both letters are present. The coordinate is well formed.',
      ],
      answer:
        'A place in the Northern Hemisphere, 40 degrees north of the Equator, and in the Western Hemisphere, 75 degrees west of the Prime Meridian.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-catch-the-bad-pair',
      kind: 'worked_example',
      problem:
        'A student writes a location as 120 degrees N, 45 degrees E. Something is wrong. Find the mistake and explain how you spotted it.',
      steps: [
        'Check the slots first. The first number is latitude, the second is longitude.',
        'Test the latitude against its limit. Latitude runs from 0 at the Equator to 90 at each pole, so 90 is the largest latitude that exists. A latitude of 120 is impossible -- there is no such place.',
        'Test the longitude. Longitude runs to 180 east and 180 west, so 45 degrees E is a perfectly ordinary longitude. That number is fine.',
        'So the second number is valid and the first is not. The most likely explanation is that the student wrote the pair in the wrong order, putting a longitude in the latitude slot.',
        'Repair it by swapping: 45 degrees N, 120 degrees E would be a well-formed pair. Both numbers are now inside their limits, and both letters are present.',
        'Keep this check. If the first number in a pair is bigger than 90, the pair is either in the wrong order or simply wrong. It takes two seconds and it catches the most common error in this whole topic.',
      ],
      answer:
        'The latitude is impossible: latitude only goes to 90 degrees. The numbers were most likely written in the wrong order; 45 degrees N, 120 degrees E is well formed.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-line-direction',
      kind: 'try_yourself',
      problem: 'Which statement about lines of latitude is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They run north and south and measure an east-west position.' },
        { id: 'b', text: 'They run east and west and measure a north-south position.', correct: true },
        { id: 'c', text: 'They run north and south and measure a north-south position.' },
        { id: 'd', text: 'They meet each other at the North and South Poles.' }
      ],
      expectedAnswer: 'They run east and west and measure a north-south position.',
      hints: [
        'Picture the Equator. Which way does that line run around the globe -- side to side, or pole to pole?',
        'The direction a line RUNS and the direction it MEASURES are not the same. Latitude lines lie flat like ladder rungs, and what they tell you is how far up or down you are.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-zero-lines',
      kind: 'try_yourself',
      problem: 'Which line of LATITUDE is at 0 degrees?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Prime Meridian' },
        { id: 'b', text: 'The Tropic of Cancer' },
        { id: 'c', text: 'The Arctic Circle' },
        { id: 'd', text: 'The Equator', correct: true }
      ],
      expectedAnswer: 'The Equator',
      hints: [
        'The question asks for a line of latitude, so first rule out any line that is a line of longitude.',
        'The Prime Meridian is also at 0 degrees, but it is a line of LONGITUDE. The Tropic of Cancer sits at about 23.5 degrees N and the Arctic Circle at about 66.5 degrees N, so neither is at zero.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-write-the-pair',
      kind: 'try_yourself',
      problem:
        'A place lies 30 degrees south of the Equator and 60 degrees east of the Prime Meridian. Which choice states its absolute location correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '60 degrees E, 30 degrees S' },
        { id: 'b', text: '30 degrees N, 60 degrees W' },
        { id: 'c', text: '30 degrees, 60 degrees' },
        { id: 'd', text: '30 degrees S, 60 degrees E', correct: true }
      ],
      expectedAnswer: '30 degrees S, 60 degrees E',
      hints: [
        'Two things have to be right: the ORDER of the numbers, and the hemisphere letter on each one.',
        'South of the Equator means S, and east of the Prime Meridian means E. Latitude is written first. One choice has the order reversed, one has both letters wrong, and one has no letters at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-latitude-direction',
      kind: 'misconception_check',
      question:
        'A student says: "Latitude lines must run up and down the globe, because latitude tells you how far north or south you are." Where does that reasoning go wrong?',
      commonErrors: [
        {
          answer: 'Latitude lines run up and down, from pole to pole.',
          misconception:
            'Assuming a line must point in the same direction as the thing it measures. Because latitude reports a north-south position, the student concludes the lines themselves must run north-south.',
          correctsTo:
            'A measuring line usually lies ACROSS the direction it measures, the way the marks on a ruler lie across its length. Latitude lines run east and west, all the way around the globe, and your latitude is which of those rungs you are standing on. The lines that do run pole to pole are the longitude lines, and they measure an east-west position. Anchor it on the Equator: it circles the globe side to side, and it is a line of latitude.',
        },
        {
          answer: 'A location can be written as 45 degrees, 90 degrees with no letters.',
          misconception:
            'Treating the hemisphere letters as decoration rather than as part of the number.',
          correctsTo:
            'Without letters, 45 degrees could be north or south of the Equator, and 90 degrees could be east or west of the Prime Meridian. That is four different places on Earth, not one. A coordinate pair is only an absolute location when each number carries its letter, so write 45 degrees N, 90 degrees W and mean exactly one spot.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Latitude lines run EAST and WEST and measure a NORTH-SOUTH position. Longitude lines run north and south and measure an east-west position.',
        'Latitude starts at the Equator (0 degrees) and reaches 90 degrees at each pole. Longitude starts at the Prime Meridian (0 degrees) and reaches 180 degrees east and west.',
        'Always write latitude first, then longitude. The order changes which place you named.',
        'Every number needs its hemisphere letter -- N or S for latitude, E or W for longitude.',
        'Quick check: if the first number is bigger than 90, the pair is in the wrong order or simply wrong.',
        'Absolute location is the exact spot given by the coordinates. Relative location describes a place by what it is near.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Latitude, Longitude & Absolute Location' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
