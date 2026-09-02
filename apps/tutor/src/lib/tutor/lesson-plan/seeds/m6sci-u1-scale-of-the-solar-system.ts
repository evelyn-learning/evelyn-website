/**
 * Grade 6 Science (Earth & Space Science) — Earth's Place in the Solar
 * System: Scale of the Solar System.
 *
 * CONCEPT-LED fan-out row for m6sci (NGSS MS-ESS1-3). The picture this
 * lesson builds is a single relationship applied twice: pick one real object
 * to stand in for the Sun, work out one scale factor from that choice, and
 * then apply that SAME scale factor to get both a relative-size model (small
 * enough to hold) and a relative-distance model (too large for any page, so
 * it has to be walked or measured out). The two traps it is built to kill
 * are (a) trusting a not-to-scale poster or drawing as though it were a
 * scale model, and (b) treating a planet's size and its distance from the
 * sun as though one tells you the other.
 *
 * SCOPE GUARD: this plan compares the SIZES of the sun and the planets, and
 * their DISTANCES from the sun and from Earth, using relative-size and
 * relative-distance models built from a single shared scale factor. Because
 * three sibling rows sit very close, the guard states what is deliberately
 * EXCLUDED and also what is deliberately ALLOWED at that edge, and why:
 *   - ROW 1.2 (classifying the planets) sorts the eight planets into groups
 *     by their properties. This plan names individual planets and compares
 *     their sizes and distances one at a time; it never groups them into
 *     categories, and the words "terrestrial," "rocky," "gas giant" and "ice
 *     giant" appear nowhere in this file.
 *   - ROW 1.3 (gravity and orbital motion) explains WHY a planet stays on
 *     its path instead of flying off straight. This plan uses the word
 *     "orbit" only to describe WHERE a planet is and how far it has
 *     travelled along its own path -- never to explain what keeps it there.
 *     Gravity is not named anywhere in this file.
 *   - ROW 1.4 (asteroids, comets and other solar system objects) inventories
 *     the asteroid belt, the Kuiper Belt, comets and dwarf planets. None of
 *     those objects appears in this file; every size and distance comparison
 *     here uses the sun, the eight planets, and Earth's moon.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this plan makes no force
 *     calculation, states no energy law, and never explains why the Sun
 *     shines or what light is made of. Every claim in it is a size, a
 *     distance, or a ratio between two of those.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every size
 * and every distance in this file is written out in words and numbers, and
 * every item is solvable from the text printed inside it. Never write "see
 * the diagram above," and never assume the student has a beach ball, a
 * measuring tape, or an open field in front of them right now -- the models
 * are described precisely enough to build, not assumed to already exist.
 *
 * NOTE ON prerequisites/followUps: this is row 1.1, the first row of the
 * course, so `prerequisites` is empty by design (there is no earlier row).
 * `followUps` points at row 1.2, which is authored in the same fan-out batch
 * and wired together by the controller when all 40 rows are registered.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U1_SCALE_OF_THE_SOLAR_SYSTEM: LessonPlan = {
  id: 'evelyn.ms.m6sci.scale-of-the-solar-system.v1',
  title: 'Scale of the Solar System',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.scale-of-the-solar-system',
      standard: 'M6SCI-1.1',
      description:
        'Use relative-size and relative-distance models (not to-scale drawings) to compare the sizes of the sun and planets and their distances from the sun and from Earth (NGSS MS-ESS1-3).',
    },
  ],
  prerequisites: [],
  followUps: ['m6sci.classifying-the-planets'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the student that a familiar solar-system picture cannot be telling the truth about size and distance at the same time.',
      script:
        'You have probably seen a poster or a textbook page with the sun and the eight planets lined up in a neat row, all fitting on one page, evenly spaced. That picture has to be lying about something, and today you will find out exactly what. If you shrank the sun down small enough to hold in one hand, and you kept the distances between the planets true to that same shrinking, the farthest planet would not fit on the page at all. It would be sitting somewhere down the street. A page cannot show a tiny dot and a distance longer than a street at the same time, so the poster cheats -- it squeezes the planets close together and draws them a similar size just so everything fits. Today we build a model that does not cheat. We pick one object to stand in for the sun, work out exactly how much everything else shrinks along with it, and then find out just how big and how empty the solar system really is.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-scale-models',
      kind: 'concept',
      goal: 'Establish that the sun dwarfs every planet, that planets differ hugely in size from each other, and build one shared scale factor into both a relative-size model and a relative-distance model.',
      keyIdeas: [
        'THE SUN DWARFS EVERY PLANET IN SIZE. The sun\'s real diameter is about 1,392,000 kilometers. Earth\'s real diameter is about 12,742 kilometers. Dividing one by the other, 1,392,000 divided by 12,742 is about 109 -- so about 109 Earths lined up side by side, edge to edge, would stretch all the way across the sun\'s diameter. No planet comes anywhere close to the sun\'s size.',
        'PLANETS DIFFER HUGELY IN SIZE FROM EACH OTHER TOO, NOT ONLY FROM THE SUN. Jupiter\'s real diameter is about 139,820 kilometers, which is about 11 times Earth\'s diameter (139,820 divided by 12,742 is about 11). Mars\'s real diameter is about 6,779 kilometers, a bit more than half of Earth\'s (6,779 divided by 12,742 is about 0.53). Comparing sizes always means dividing one diameter by another -- the same move used to compare a planet with the sun.',
        'A SCALE MODEL PICKS ONE OBJECT, THEN APPLIES ONE FACTOR TO EVERYTHING. Pick a real object to stand in for the sun -- say, a beach ball about 30 centimeters across. Dividing the sun\'s real diameter by that 30 centimeters gives a single scale factor: 1,392,000 kilometers divided by 30 centimeters is 46,400, so every centimeter in the model stands for about 46,400 real kilometers. That one number is the whole model. Apply it to any real size or any real distance and it tells you the matching model size or model distance.',
        'THE SAME FACTOR MAKES SIZES TINY AND DISTANCES HUGE, WHICH IS WHY THEY ARE MODELED SEPARATELY. Applying 46,400 kilometers per centimeter to Earth\'s diameter, 12,742 kilometers, gives a model size of about 0.27 centimeters, roughly 3 millimeters -- about the size of a sesame seed. Applying that exact same factor to Earth\'s real distance from the sun, about 150,000,000 kilometers, gives a model distance of about 3,233 centimeters, or about 32 meters -- far longer than a classroom. One shared scale factor, but it shrinks a whole planet down to something you could lose in a carpet while stretching the distance to it out past a classroom wall. That mismatch, not a difference in the factor itself, is why a relative-size model (built from small objects you can hold) and a relative-distance model (built by measuring out a large open space) are normally shown apart from each other, and never both at once on a single not-to-scale drawing.',
        'A PLANET\'S DISTANCE FROM THE SUN STAYS CLOSE TO FIXED. Earth\'s average distance from the sun, about 150,000,000 kilometers, is so useful for comparing positions that astronomers gave it its own name: one astronomical unit, or 1 AU. Mars sits at about 1.5 AU, and Jupiter sits at about 5.2 AU -- each planet has its own roughly steady distance from the sun, which is what makes the AU a useful ruler for the whole solar system.',
        'A PLANET\'S DISTANCE FROM EARTH IS NOT FIXED THE SAME WAY. Earth and Mars are both traveling around the sun, each at its own distance and its own pace, so the gap between the two planets keeps changing depending on where each one currently sits along its own path -- unlike the distance from a planet to the sun, which stays close to steady all year. Distance from Earth is easiest to pin down for the sun itself and for the moon: the moon\'s average distance from Earth is about 384,000 kilometers, and dividing the sun\'s distance by that, 150,000,000 divided by 384,000 is about 390 -- so the sun sits about 390 times farther from Earth than the moon does.',
      ],
      vocabulary: [
        { term: 'astronomical unit (AU)', definition: 'a unit of distance equal to Earth\'s average distance from the sun, about 150,000,000 kilometers, used to compare how far other planets sit from the sun.' },
        { term: 'scale model', definition: 'a model in which every real size or distance is shrunk by the same fixed factor, so the relationships between the parts stay accurate even though the actual numbers are much smaller.' },
        { term: 'diameter', definition: 'the distance straight across a circle or a sphere through its center, used here to compare the sizes of the sun and the planets.' },
        { term: 'relative size', definition: 'how big or small something is compared with something else, rather than its size stated alone in kilometers.' },
        { term: 'relative distance', definition: 'how far apart two things are compared with some other distance, rather than the distance stated alone in kilometers.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-size-model',
      kind: 'worked_example',
      problem:
        'In a scale model of the solar system, the sun is represented by a beach ball about 30 centimeters across. The sun\'s real diameter, about 1,392,000 kilometers, is about 109 times Earth\'s real diameter, about 12,742 kilometers. About how big should Earth be in this model, and what everyday object is close to that size?',
      steps: [
        'Find the scale factor first. The ball\'s 30 centimeters stands for the sun\'s real diameter of about 1,392,000 kilometers. Dividing, 1,392,000 kilometers divided by 30 centimeters is 46,400 -- so every centimeter in the model stands for about 46,400 real kilometers.',
        'Apply that scale factor to Earth. Earth\'s real diameter is about 12,742 kilometers. Dividing by the scale factor, 12,742 divided by 46,400 is about 0.27 centimeters, which is about 2.7 millimeters.',
        'Check that arithmetic a second way, using the ratio directly instead of the scale factor. The sun\'s real diameter is about 109 times Earth\'s, so Earth\'s model size should be the ball\'s 30 centimeters divided by 109. Thirty divided by 109 is about 0.28 centimeters -- the same answer, reached by a completely different calculation.',
        'Check it a third way, against something you already know the size of without doing any math at all. A sesame seed genuinely measures about 2 to 3 millimeters. The computed size, about 2.7 millimeters, matches a real object you could hold up next to the ball. Two different arithmetic routes and one everyday comparison all agree, so the model size is solid.',
        'WRONG: "A bigger ball would mean the real planets are actually bigger." CORRECT: "Changing the ball only changes the size of the object chosen to represent the sun; the real sun, the real Earth, and the ratio between them never change."',
        'Now rewind the setup and change it, to make sure the ratio is doing the real work and not the specific ball chosen. Suppose the model used a 3-meter weather balloon instead of a 30-centimeter beach ball -- ten times bigger. Earth\'s model size would also grow by that same factor of ten, to about 2.7 centimeters, roughly a large marble. The centimeter measurements changed completely, but Earth is still about 109 times smaller than the ball representing the sun in both versions. The ratio is the part of the model that is real, not the specific object chosen to stand in for the sun.',
      ],
      answer:
        'About 2.7 millimeters, roughly the size of a sesame seed. That is the ball\'s 30 centimeters divided by about 109, since Earth\'s real diameter is about 109 times smaller than the sun\'s.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-distance-model',
      kind: 'worked_example',
      problem:
        'Using the same 30-centimeter beach-ball sun and the same scale factor of 46,400 real kilometers per model centimeter, Earth\'s model distance from the ball works out to about 32 meters. Mars\'s real distance from the sun is about 228,000,000 kilometers, which is about 1.5 times Earth\'s real distance from the sun. About how far from the ball should Mars sit in this model?',
      steps: [
        'Start from the same scale factor as before: 46,400 real kilometers for every model centimeter. Mars\'s real distance from the sun, about 228,000,000 kilometers, divided by 46,400, is about 4,914 centimeters, which is about 49 meters.',
        'Check that a second way, using the ratio directly. Mars\'s real distance from the sun is about 1.5 times Earth\'s, so Mars\'s model distance should be about 1.5 times Earth\'s model distance: 32 meters times 1.5 is about 48 meters, matching the direct calculation closely (the small difference is only rounding).',
        'Check it a third way, by reasoning about the size of the gap rather than doing more arithmetic. Mars is only somewhat farther from the sun than Earth is -- about 1.5 times, not ten times or a hundred times -- so its model distance should be only somewhat larger than Earth\'s 32 meters, not dramatically larger. About 49 meters fits that expectation; a distance of several hundred meters would not.',
        'WRONG: "Mars is a smaller planet than Earth, so it should sit closer to the ball to look right." CORRECT: "A planet\'s size and a planet\'s distance from the sun are two separate facts, measured with the same scale factor but never determined by each other. Where Mars sits in the distance model depends only on its real distance from the sun, never on how big or small the planet itself is."',
        'Now rewind and change the planet, to see the answer move the way it should. Neptune\'s real distance from the sun is about 30 times Earth\'s, not 1.5 times. Using the same method, Neptune\'s model distance is about 32 meters times 30, which is about 970 meters -- just under a kilometer, even though the ball representing the sun is still only 30 centimeters across. Changing the real-distance ratio from 1.5 to 30 produced a huge change in the model distance, from about 49 meters to about 970 meters, which is exactly how a real answer is supposed to behave when the evidence changes.',
        'One more thing the arithmetic reveals on its own: Neptune\'s model distance, almost 970 meters, is enormously larger than Earth\'s model SIZE, about 2.7 millimeters, ever was. In this model the space between the planets is far bigger than the planets themselves -- which is exactly why one small drawing cannot show both facts to scale at the same time.',
      ],
      answer:
        'About 49 meters, roughly 1.5 times Earth\'s model distance of about 32 meters, because Mars\'s real distance from the sun is about 1.5 times Earth\'s.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-size-model',
      kind: 'try_yourself',
      problem:
        'In a scale model, the sun is shrunk down to a beach ball about 30 centimeters across. Earth\'s real diameter is about 109 times smaller than the sun\'s. About how big should Earth be in this model?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'About 30 centimeters, the same size as the ball, because Earth is a planet too and belongs at full size in any model of the solar system.' },
        { id: 'b', text: 'About 15 centimeters, roughly half the ball, because most classroom posters draw Earth clearly smaller than the sun but still easy to see next to it.' },
        { id: 'c', text: 'About 3 millimeters, roughly the size of a sesame seed, because Earth\'s diameter divides into the sun\'s model size about 109 times.', correct: true },
        { id: 'd', text: 'About 33 centimeters, a little larger than the ball itself, because treating 109 times smaller as 109 percent of the ball\'s size gives 30 times 1.09, not 30 divided by 109.' },
      ],
      expectedAnswer: 'About 3 millimeters, roughly the size of a sesame seed, because Earth\'s diameter divides into the sun\'s model size about 109 times.',
      hints: [
        'Find the direction of the division first. If Earth is 109 times SMALLER than the sun, does the ball\'s 30 centimeters get multiplied by 109, or divided by 109?',
        'Thirty divided by 109 is a small fraction of a centimeter. Which everyday object, out of the four choices, is genuinely that tiny?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-distance-model',
      kind: 'try_yourself',
      problem:
        'Using the same 30-centimeter beach-ball sun, Earth\'s model distance from the ball works out to about 32 meters. Mars\'s real distance from the sun is about 1.5 times Earth\'s. About how far from the ball should Mars sit in this model?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'About 21 meters, closer to the ball than Earth is, because Mars is a smaller, rockier planet than Earth.' },
        { id: 'b', text: 'About 32 meters, the same distance as Earth, because a scale model spreads the planets out evenly like a simple classroom poster.' },
        { id: 'c', text: 'About 65 meters, twice as far as Earth, because Mars looks noticeably smaller than Earth so its model needs double the distance to look correct.' },
        { id: 'd', text: 'About 49 meters, because Mars\'s real distance from the sun is about 1.5 times Earth\'s, so its model distance is also about 1.5 times Earth\'s model distance.', correct: true },
      ],
      expectedAnswer: 'About 49 meters, because Mars\'s real distance from the sun is about 1.5 times Earth\'s, so its model distance is also about 1.5 times Earth\'s model distance.',
      hints: [
        'The size of a planet and its distance from the sun are two separate facts. Which of the four choices bases the distance on Mars\'s SIZE rather than on its real distance from the sun?',
        'If a real distance is 1.5 times bigger, its model distance should also be 1.5 times bigger. Multiply Earth\'s model distance, 32 meters, by 1.5, and see which choice matches.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-distance-from-earth',
      kind: 'try_yourself',
      problem:
        'Earth\'s distance from the sun stays close to 150,000,000 kilometers all year, a figure so useful that scientists gave it its own name, the astronomical unit. Why can Earth\'s distance from Mars not be given the same simple way, as one fixed number?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because Earth and Mars each travel around the sun at their own distance and their own pace, so the gap between them keeps changing depending on where each one currently sits along its own path.', correct: true },
        { id: 'b', text: 'Because Mars, unlike Earth, does not stay at a steady distance from the sun as it moves along its orbit, so a single fixed number for its distance would already be inaccurate no matter what Earth happens to be doing.' },
        { id: 'c', text: 'Because Mars is so far from Earth that no instrument available to scientists is precise enough to measure the changing gap between the two planets down to an exact number of kilometers.' },
        { id: 'd', text: 'Because Earth\'s own distance from the sun changes noticeably enough over the course of a year that no planet\'s distance, including Earth\'s, can honestly be reduced to one fixed number either.' },
      ],
      expectedAnswer: 'Because Earth and Mars each travel around the sun at their own distance and their own pace, so the gap between them keeps changing depending on where each one currently sits along its own path.',
      hints: [
        'The question already tells you Earth\'s distance from the sun stays close to fixed. Ask what is different about a distance measured between TWO moving planets instead of between one planet and the sun.',
        'Both Earth and Mars are moving, each along its own path around the sun. Does a gap between two moving things usually stay the same size, or change as each one moves?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-poster-is-accurate',
      kind: 'misconception_check',
      question:
        'A student looks at a classroom poster showing the sun and the eight planets lined up in a row, evenly spaced and all a similar size, and says: "This poster is basically accurate -- and since Mars looks about the same size as Earth on it, Mars must be about as far from the sun as Earth is too." Two separate things have gone wrong here. What are they?',
      commonErrors: [
        {
          answer: 'The poster is basically accurate.',
          misconception:
            'Trusting a not-to-scale classroom drawing as though it were a scale model, because the poster looks like the kind of picture that ought to show true sizes and distances.',
          correctsTo:
            'A poster that fits the sun and eight planets on one page cannot be to scale. Using real numbers, if the sun were a 30-centimeter ball, Earth\'s model size would be about 2.7 millimeters while Neptune\'s model distance would be about 970 meters -- no single page is big enough to show something millimeters across and a gap longer than a football field at the same time. The poster is drawn for clarity, not accuracy, and cannot be read as a true scale model.',
        },
        {
          answer: 'Since Mars looks about the same size as Earth on the poster, Mars must be about as far from the sun as Earth is.',
          misconception:
            'Assuming that because a poster gets one quantity wrong, a relationship shown on the page still carries over to a completely different quantity -- reading a size relationship on the poster as evidence about distance.',
          correctsTo:
            'Size and distance are two separate facts about a planet, and one being shown incorrectly says nothing about the other. Mars\'s real diameter, about 6,779 kilometers, actually is fairly close to Earth\'s, about 12,742 kilometers -- but Mars\'s real distance from the sun, about 228,000,000 kilometers, is about 1.5 times Earth\'s distance, not the same. The two facts have to be checked separately against real measurements, never read off of each other.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The sun\'s real diameter, about 1,392,000 kilometers, is about 109 times Earth\'s real diameter, about 12,742 kilometers -- no planet is close to the sun in size.',
        'Planets differ hugely in size from each other too: Jupiter\'s diameter is about 11 times Earth\'s, and Mars\'s diameter is a bit more than half of Earth\'s.',
        'A scale model shrinks every real size or distance by the same fixed factor, so the relationships between the parts stay accurate.',
        'The same scale factor applies to both size and distance, but it produces sizes small enough to hold and distances too large for a page -- which is why a relative-size model and a relative-distance model are usually built separately.',
        'If the sun is a 30-centimeter ball, Earth\'s model size is about 2.7 millimeters (about a sesame seed) and Earth\'s model distance is about 32 meters.',
        'A planet\'s real distance from the sun stays close to fixed all year. Earth\'s average distance from the sun, about 150,000,000 kilometers, is called one astronomical unit.',
        'Earth\'s distance from another planet, like Mars, is NOT fixed the way Earth\'s distance from the sun is, because both planets keep moving along their own paths at their own pace.',
        'A not-to-scale poster or drawing is for clarity, not accuracy -- a size relationship shown on one is not evidence about a distance relationship, or the reverse.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Scale of the Solar System' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
