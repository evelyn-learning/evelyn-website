/**
 * Grade 7 World Geography — Unit 1 CED 1.2: Latitude, Longitude & Absolute Location.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7geo.latitude-longitude-and-location.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7GEO_U1_LATITUDE_LONGITUDE_AND_LOCATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7geo.latitude-longitude-and-location.v1',
  course: 'Grade 7 World Geography',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Latitude, Longitude & Absolute Location',
  planId: 'evelyn.ms.m7geo.latitude-longitude-and-location.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7geo.latitude-longitude-and-location.v1' }],
  theory: [
    { loId: 'm7geo.latitude-longitude-and-location', content: `LATITUDE LINES RUN EAST AND WEST, AND THEY MEASURE HOW FAR NORTH OR SOUTH YOU ARE. This is the sentence students get backwards, so read it twice. The lines themselves lie flat, like the rungs of a ladder going around the globe. What they MEASURE is your north-south position. WRONG: "Latitude lines run up and down because they measure north and south." RIGHT: "Latitude lines run east and west, and they measure a north-south position." Latitude lines are also called parallels, because they never meet.` },
    { loId: 'm7geo.latitude-longitude-and-location', content: `LATITUDE STARTS AT THE EQUATOR, which is 0 degrees. From there it counts up to 90 degrees at the North Pole and 90 degrees at the South Pole. Every latitude except the Equator itself needs a letter, N or S, or you have named two different places at once. Useful fixed lines: the Tropic of Cancer at about 23.5 degrees N, the Tropic of Capricorn at about 23.5 degrees S, and the Arctic Circle at about 66.5 degrees N.` },
    { loId: 'm7geo.latitude-longitude-and-location', content: `LONGITUDE LINES RUN NORTH AND SOUTH, FROM POLE TO POLE, AND THEY MEASURE HOW FAR EAST OR WEST YOU ARE. They are also called meridians. Unlike parallels, they are not parallel to each other -- they are farthest apart at the Equator and they all meet at the poles.` },
    { loId: 'm7geo.latitude-longitude-and-location', content: `LONGITUDE STARTS AT THE PRIME MERIDIAN, which is 0 degrees, and counts up to 180 degrees going east and 180 degrees going west. So longitude needs an E or a W. Notice the two ranges are different: latitude never goes past 90, longitude goes to 180. A number larger than 90 in the first slot of a coordinate pair is a signal that something is wrong.` },
    { loId: 'm7geo.latitude-longitude-and-location', content: `ALWAYS WRITE LATITUDE FIRST, THEN LONGITUDE. The order is not a style choice; it changes which place you named. Say it as one phrase every time: latitude first, longitude second. Together the two numbers give a place its ABSOLUTE LOCATION -- the one exact spot, the same for everybody. That is different from RELATIVE location, which describes a place by what it is near.` },
    { loId: 'm7geo.latitude-longitude-and-location', content: `HEMISPHERE LETTERS ARE NOT OPTIONAL. Dropping the N or the S puts a place in two possible spots, one north of the Equator and one south of it. The same is true of E and W around the Prime Meridian. A coordinate without its letters is not an answer.` },
    { loId: 'm7geo.latitude-longitude-and-location', kind: 'definition', title: 'latitude', content: 'the measure of how far north or south a place is from the Equator, in degrees.' },
    { loId: 'm7geo.latitude-longitude-and-location', kind: 'definition', title: 'longitude', content: `the measure of how far east or west a place is from the Prime Meridian, in degrees.` },
    { loId: 'm7geo.latitude-longitude-and-location', kind: 'definition', title: 'Equator', content: 'the line of latitude at 0 degrees, halfway between the poles.' },
    { loId: 'm7geo.latitude-longitude-and-location', kind: 'definition', title: 'Prime Meridian', content: 'the line of longitude at 0 degrees, from which east and west are measured.' },
    { loId: 'm7geo.latitude-longitude-and-location', kind: 'definition', title: 'absolute location', content: 'the exact position of a place, usually given as a latitude and longitude pair.' },
    { loId: 'm7geo.latitude-longitude-and-location', kind: 'definition', title: 'relative location', content: 'where a place is in relation to other places, such as north of a river.' },
  ],
  methods: [
    {
      title: 'Worked read a coordinate',
      steps: [
        `Take the numbers in the order they are written. The first one is always latitude, so the latitude is 40 degrees N.`,
        `Read what that means. Latitude is measured from the Equator, and the letter is N, so this place is 40 degrees north of the Equator. That puts it in the Northern Hemisphere, well north of the Tropic of Cancer at about 23.5 degrees N.`,
        `The second number is longitude: 75 degrees W. Longitude is measured from the Prime Meridian, and the letter is W, so this place is 75 degrees west of it. That puts it in the Western Hemisphere.`,
        `Put the two together: a spot in the Northern Hemisphere, about 40 degrees up from the Equator, and in the Western Hemisphere, about 75 degrees west of the Prime Meridian.`,
        `Sanity-check the numbers before you finish. Latitude of 40 is under 90, so it is possible. Longitude of 75 is under 180, so it is possible. Both letters are present. The coordinate is well formed.`,
      ],
      example: { problem: `A weather station reports its position as 40 degrees N, 75 degrees W. Describe in plain words where on Earth that is, and explain how you know.`, solution: `A place in the Northern Hemisphere, 40 degrees north of the Equator, and in the Western Hemisphere, 75 degrees west of the Prime Meridian.` },
      relatedLoIds: ['m7geo.latitude-longitude-and-location'],
    },
    {
      title: 'Worked catch the bad pair',
      steps: [
        'Check the slots first. The first number is latitude, the second is longitude.',
        `Test the latitude against its limit. Latitude runs from 0 at the Equator to 90 at each pole, so 90 is the largest latitude that exists. A latitude of 120 is impossible -- there is no such place.`,
        `Test the longitude. Longitude runs to 180 east and 180 west, so 45 degrees E is a perfectly ordinary longitude. That number is fine.`,
        `So the second number is valid and the first is not. The most likely explanation is that the student wrote the pair in the wrong order, putting a longitude in the latitude slot.`,
        `Repair it by swapping: 45 degrees N, 120 degrees E would be a well-formed pair. Both numbers are now inside their limits, and both letters are present.`,
        `Keep this check. If the first number in a pair is bigger than 90, the pair is either in the wrong order or simply wrong. It takes two seconds and it catches the most common error in this whole topic.`,
      ],
      example: { problem: `A student writes a location as 120 degrees N, 45 degrees E. Something is wrong. Find the mistake and explain how you spotted it.`, solution: `The latitude is impossible: latitude only goes to 90 degrees. The numbers were most likely written in the wrong order; 45 degrees N, 120 degrees E is well formed.` },
      relatedLoIds: ['m7geo.latitude-longitude-and-location'],
    },
  ],
  pointers: [
    { content: `Students often say "Latitude lines run up and down, from pole to pole." — A measuring line usually lies ACROSS the direction it measures, the way the marks on a ruler lie across its length. Latitude lines run east and west, all the way around the globe, and your latitude is which of those rungs you are standing on. The lines that do run pole to pole are the longitude lines, and they measure an east-west position. Anchor it on the Equator: it circles the globe side to side, and it is a line of latitude.`, kind: 'common-error' },
    { content: `Students often say "A location can be written as 45 degrees, 90 degrees with no letters." — Without letters, 45 degrees could be north or south of the Equator, and 90 degrees could be east or west of the Prime Meridian. That is four different places on Earth, not one. A coordinate pair is only an absolute location when each number carries its letter, so write 45 degrees N, 90 degrees W and mean exactly one spot.`, kind: 'common-error' },
    { content: `Latitude lines run EAST and WEST and measure a NORTH-SOUTH position. Longitude lines run north and south and measure an east-west position.`, kind: 'tip' },
    { content: `Latitude starts at the Equator (0 degrees) and reaches 90 degrees at each pole. Longitude starts at the Prime Meridian (0 degrees) and reaches 180 degrees east and west.`, kind: 'tip' },
    { content: `Always write latitude first, then longitude. The order changes which place you named.`, kind: 'tip' },
    { content: `Every number needs its hemisphere letter -- N or S for latitude, E or W for longitude.`, kind: 'tip' },
    { content: `Quick check: if the first number is bigger than 90, the pair is in the wrong order or simply wrong.`, kind: 'tip' },
    { content: `Absolute location is the exact spot given by the coordinates. Relative location describes a place by what it is near.`, kind: 'tip' },
    { content: `Latitude lines RUN east–west but MEASURE north–south. Don't let the direction of the measurement fool you into turning the lines sideways. Anchor on the Equator: it circles the globe side to side, and it's a latitude line.`, kind: 'common-error' },
    { content: `Latitude tops out at 90; longitude goes to 180. If the FIRST number in a pair is over 90, the pair is backwards or wrong. Do this two-second check on every coordinate before you call it done.`, kind: 'tip' },
    { content: `N, S, E, W are part of the number, not decoration. "45 degrees, 90 degrees" names four possible spots on Earth. Without letters it is not an absolute location and not a finished answer.`, kind: 'gotcha' },
    { content: `Write latitude first, longitude second — every single time. Swapping them names a completely different place. Say "lat, then long" out loud as you write.`, kind: 'common-error' },
    { content: `Don't mix up parallels and meridians. Parallels = latitude lines, always the same distance apart. Meridians = longitude lines, widest at the Equator and meeting at both poles — so they are NOT parallel.`, kind: 'vocab-note' },
    { content: `Two lines sit at 0 degrees, but they are different: the Equator is 0 degrees LATITUDE, the Prime Meridian is 0 degrees LONGITUDE. Points on them need no letter — everywhere else does.`, kind: 'edge-case' },
    { content: `"Near the mall" or "north of the river" is RELATIVE location. Only a lat/long pair gives ABSOLUTE location — the same exact spot for everyone, everywhere.`, kind: 'vocab-note' },
    { content: `Bigger latitude number = farther from the Equator, not farther 'up.' 60 degrees S is far south, not high. Check the letter before you decide which way the place sits.`, kind: 'gotcha' },
  ],
};
