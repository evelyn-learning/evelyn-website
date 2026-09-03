/**
 * Grade 6 Science — Unit 1 CED 1.1: Scale of the Solar System.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.scale-of-the-solar-system.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U1_SCALE_OF_THE_SOLAR_SYSTEM: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.scale-of-the-solar-system.v1',
  course: 'Grade 6 Science',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Scale of the Solar System',
  planId: 'evelyn.ms.m6sci.scale-of-the-solar-system.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.scale-of-the-solar-system.v1' }],
  theory: [
    { loId: 'm6sci.scale-of-the-solar-system', content: `THE SUN DWARFS EVERY PLANET IN SIZE. The sun's real diameter is about 1,392,000 kilometers. Earth's real diameter is about 12,742 kilometers. Dividing one by the other, 1,392,000 divided by 12,742 is about 109 -- so about 109 Earths lined up side by side, edge to edge, would stretch all the way across the sun's diameter. No planet comes anywhere close to the sun's size.` },
    { loId: 'm6sci.scale-of-the-solar-system', content: `PLANETS DIFFER HUGELY IN SIZE FROM EACH OTHER TOO, NOT ONLY FROM THE SUN. Jupiter's real diameter is about 139,820 kilometers, which is about 11 times Earth's diameter (139,820 divided by 12,742 is about 11). Mars's real diameter is about 6,779 kilometers, a bit more than half of Earth's (6,779 divided by 12,742 is about 0.53). Comparing sizes always means dividing one diameter by another -- the same move used to compare a planet with the sun.` },
    { loId: 'm6sci.scale-of-the-solar-system', content: `A SCALE MODEL PICKS ONE OBJECT, THEN APPLIES ONE FACTOR TO EVERYTHING. Pick a real object to stand in for the sun -- say, a beach ball about 30 centimeters across. Dividing the sun's real diameter by that 30 centimeters gives a single scale factor: 1,392,000 kilometers divided by 30 centimeters is 46,400, so every centimeter in the model stands for about 46,400 real kilometers. That one number is the whole model. Apply it to any real size or any real distance and it tells you the matching model size or model distance.` },
    { loId: 'm6sci.scale-of-the-solar-system', content: `THE SAME FACTOR MAKES SIZES TINY AND DISTANCES HUGE, WHICH IS WHY THEY ARE MODELED SEPARATELY. Applying 46,400 kilometers per centimeter to Earth's diameter, 12,742 kilometers, gives a model size of about 0.27 centimeters, roughly 3 millimeters -- about the size of a sesame seed. Applying that exact same factor to Earth's real distance from the sun, about 150,000,000 kilometers, gives a model distance of about 3,233 centimeters, or about 32 meters -- far longer than a classroom. One shared scale factor, but it shrinks a whole planet down to something you could lose in a carpet while stretching the distance to it out past a classroom wall. That mismatch, not a difference in the factor itself, is why a relative-size model (built from small objects you can hold) and a relative-distance model (built by measuring out a large open space) are normally shown apart from each other, and never both at once on a single not-to-scale drawing.` },
    { loId: 'm6sci.scale-of-the-solar-system', content: `A PLANET'S DISTANCE FROM THE SUN STAYS CLOSE TO FIXED. Earth's average distance from the sun, about 150,000,000 kilometers, is so useful for comparing positions that astronomers gave it its own name: one astronomical unit, or 1 AU. Mars sits at about 1.5 AU, and Jupiter sits at about 5.2 AU -- each planet has its own roughly steady distance from the sun, which is what makes the AU a useful ruler for the whole solar system.` },
    { loId: 'm6sci.scale-of-the-solar-system', content: `A PLANET'S DISTANCE FROM EARTH IS NOT FIXED THE SAME WAY. Earth and Mars are both traveling around the sun, each at its own distance and its own pace, so the gap between the two planets keeps changing depending on where each one currently sits along its own path -- unlike the distance from a planet to the sun, which stays close to steady all year. Distance from Earth is easiest to pin down for the sun itself and for the moon: the moon's average distance from Earth is about 384,000 kilometers, and dividing the sun's distance by that, 150,000,000 divided by 384,000 is about 390 -- so the sun sits about 390 times farther from Earth than the moon does.` },
    { loId: 'm6sci.scale-of-the-solar-system', kind: 'definition', title: 'astronomical unit (AU)', content: `a unit of distance equal to Earth's average distance from the sun, about 150,000,000 kilometers, used to compare how far other planets sit from the sun.` },
    { loId: 'm6sci.scale-of-the-solar-system', kind: 'definition', title: 'scale model', content: `a model in which every real size or distance is shrunk by the same fixed factor, so the relationships between the parts stay accurate even though the actual numbers are much smaller.` },
    { loId: 'm6sci.scale-of-the-solar-system', kind: 'definition', title: 'diameter', content: `the distance straight across a circle or a sphere through its center, used here to compare the sizes of the sun and the planets.` },
    { loId: 'm6sci.scale-of-the-solar-system', kind: 'definition', title: 'relative size', content: `how big or small something is compared with something else, rather than its size stated alone in kilometers.` },
    { loId: 'm6sci.scale-of-the-solar-system', kind: 'definition', title: 'relative distance', content: `how far apart two things are compared with some other distance, rather than the distance stated alone in kilometers.` },
  ],
  methods: [
    {
      title: 'Worked size model',
      steps: [
        `Find the scale factor first. The ball's 30 centimeters stands for the sun's real diameter of about 1,392,000 kilometers. Dividing, 1,392,000 kilometers divided by 30 centimeters is 46,400 -- so every centimeter in the model stands for about 46,400 real kilometers.`,
        `Apply that scale factor to Earth. Earth's real diameter is about 12,742 kilometers. Dividing by the scale factor, 12,742 divided by 46,400 is about 0.27 centimeters, which is about 2.7 millimeters.`,
        `Check that arithmetic a second way, using the ratio directly instead of the scale factor. The sun's real diameter is about 109 times Earth's, so Earth's model size should be the ball's 30 centimeters divided by 109. Thirty divided by 109 is about 0.28 centimeters -- the same answer, reached by a completely different calculation.`,
        `Check it a third way, against something you already know the size of without doing any math at all. A sesame seed genuinely measures about 2 to 3 millimeters. The computed size, about 2.7 millimeters, matches a real object you could hold up next to the ball. Two different arithmetic routes and one everyday comparison all agree, so the model size is solid.`,
        `WRONG: "A bigger ball would mean the real planets are actually bigger." CORRECT: "Changing the ball only changes the size of the object chosen to represent the sun; the real sun, the real Earth, and the ratio between them never change."`,
        `Now rewind the setup and change it, to make sure the ratio is doing the real work and not the specific ball chosen. Suppose the model used a 3-meter weather balloon instead of a 30-centimeter beach ball -- ten times bigger. Earth's model size would also grow by that same factor of ten, to about 2.7 centimeters, roughly a large marble. The centimeter measurements changed completely, but Earth is still about 109 times smaller than the ball representing the sun in both versions. The ratio is the part of the model that is real, not the specific object chosen to stand in for the sun.`,
      ],
      example: { problem: `In a scale model of the solar system, the sun is represented by a beach ball about 30 centimeters across. The sun's real diameter, about 1,392,000 kilometers, is about 109 times Earth's real diameter, about 12,742 kilometers. About how big should Earth be in this model, and what everyday object is close to that size?`, solution: `About 2.7 millimeters, roughly the size of a sesame seed. That is the ball's 30 centimeters divided by about 109, since Earth's real diameter is about 109 times smaller than the sun's.` },
      relatedLoIds: ['m6sci.scale-of-the-solar-system'],
    },
    {
      title: 'Worked distance model',
      steps: [
        `Start from the same scale factor as before: 46,400 real kilometers for every model centimeter. Mars's real distance from the sun, about 228,000,000 kilometers, divided by 46,400, is about 4,914 centimeters, which is about 49 meters.`,
        `Check that a second way, using the ratio directly. Mars's real distance from the sun is about 1.5 times Earth's, so Mars's model distance should be about 1.5 times Earth's model distance: 32 meters times 1.5 is about 48 meters, matching the direct calculation closely (the small difference is only rounding).`,
        `Check it a third way, by reasoning about the size of the gap rather than doing more arithmetic. Mars is only somewhat farther from the sun than Earth is -- about 1.5 times, not ten times or a hundred times -- so its model distance should be only somewhat larger than Earth's 32 meters, not dramatically larger. About 49 meters fits that expectation; a distance of several hundred meters would not.`,
        `WRONG: "Mars is a smaller planet than Earth, so it should sit closer to the ball to look right." CORRECT: "A planet's size and a planet's distance from the sun are two separate facts, measured with the same scale factor but never determined by each other. Where Mars sits in the distance model depends only on its real distance from the sun, never on how big or small the planet itself is."`,
        `Now rewind and change the planet, to see the answer move the way it should. Neptune's real distance from the sun is about 30 times Earth's, not 1.5 times. Using the same method, Neptune's model distance is about 32 meters times 30, which is about 970 meters -- just under a kilometer, even though the ball representing the sun is still only 30 centimeters across. Changing the real-distance ratio from 1.5 to 30 produced a huge change in the model distance, from about 49 meters to about 970 meters, which is exactly how a real answer is supposed to behave when the evidence changes.`,
        `One more thing the arithmetic reveals on its own: Neptune's model distance, almost 970 meters, is enormously larger than Earth's model SIZE, about 2.7 millimeters, ever was. In this model the space between the planets is far bigger than the planets themselves -- which is exactly why one small drawing cannot show both facts to scale at the same time.`,
      ],
      example: { problem: `Using the same 30-centimeter beach-ball sun and the same scale factor of 46,400 real kilometers per model centimeter, Earth's model distance from the ball works out to about 32 meters. Mars's real distance from the sun is about 228,000,000 kilometers, which is about 1.5 times Earth's real distance from the sun. About how far from the ball should Mars sit in this model?`, solution: `About 49 meters, roughly 1.5 times Earth's model distance of about 32 meters, because Mars's real distance from the sun is about 1.5 times Earth's.` },
      relatedLoIds: ['m6sci.scale-of-the-solar-system'],
    },
  ],
  pointers: [
    { content: `Students often say "The poster is basically accurate." — A poster that fits the sun and eight planets on one page cannot be to scale. Using real numbers, if the sun were a 30-centimeter ball, Earth's model size would be about 2.7 millimeters while Neptune's model distance would be about 970 meters -- no single page is big enough to show something millimeters across and a gap longer than a football field at the same time. The poster is drawn for clarity, not accuracy, and cannot be read as a true scale model.`, kind: 'common-error' },
    { content: `Students often say "Since Mars looks about the same size as Earth on the poster, Mars must be about as far from the sun as Earth is." — Size and distance are two separate facts about a planet, and one being shown incorrectly says nothing about the other. Mars's real diameter, about 6,779 kilometers, actually is fairly close to Earth's, about 12,742 kilometers -- but Mars's real distance from the sun, about 228,000,000 kilometers, is about 1.5 times Earth's distance, not the same. The two facts have to be checked separately against real measurements, never read off of each other.`, kind: 'common-error' },
    { content: `The sun's real diameter, about 1,392,000 kilometers, is about 109 times Earth's real diameter, about 12,742 kilometers -- no planet is close to the sun in size.`, kind: 'tip' },
    { content: `Planets differ hugely in size from each other too: Jupiter's diameter is about 11 times Earth's, and Mars's diameter is a bit more than half of Earth's.`, kind: 'tip' },
    { content: `A scale model shrinks every real size or distance by the same fixed factor, so the relationships between the parts stay accurate.`, kind: 'tip' },
    { content: `The same scale factor applies to both size and distance, but it produces sizes small enough to hold and distances too large for a page -- which is why a relative-size model and a relative-distance model are usually built separately.`, kind: 'tip' },
    { content: `If the sun is a 30-centimeter ball, Earth's model size is about 2.7 millimeters (about a sesame seed) and Earth's model distance is about 32 meters.`, kind: 'tip' },
    { content: `A planet's real distance from the sun stays close to fixed all year. Earth's average distance from the sun, about 150,000,000 kilometers, is called one astronomical unit.`, kind: 'tip' },
    { content: `Earth's distance from another planet, like Mars, is NOT fixed the way Earth's distance from the sun is, because both planets keep moving along their own paths at their own pace.`, kind: 'tip' },
    { content: `A not-to-scale poster or drawing is for clarity, not accuracy -- a size relationship shown on one is not evidence about a distance relationship, or the reverse.`, kind: 'tip' },
  ],
};
