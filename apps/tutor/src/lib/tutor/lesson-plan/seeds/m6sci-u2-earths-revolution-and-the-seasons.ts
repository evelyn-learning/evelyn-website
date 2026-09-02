/**
 * Grade 6 Science (Earth & Space Science) — The Earth-Sun-Moon System:
 * Earth's Revolution & the Seasons.
 *
 * CONCEPT-LED fan-out row for m6sci (NGSS MS-ESS1-1). The lesson builds one
 * model -- an axis that stays tilted the same way in space all year, on a
 * planet that revolves around the sun -- and uses it to explain two things
 * at once: why a single hemisphere has different seasons across the year,
 * and why the two hemispheres have opposite seasons at the same time.
 *
 * The trap this lesson is built to kill is the single most common
 * misconception in Earth science: that seasons come from Earth's distance
 * from the sun. The lesson does not just avoid that explanation, it
 * confronts it directly with two facts that survive no distance theory --
 * Earth is actually closest to the sun in early January (Northern
 * Hemisphere winter) and farthest in early July (Northern Hemisphere
 * summer), and the two hemispheres have opposite seasons at the very same
 * moment despite being the same distance from the sun.
 *
 * SCOPE GUARD: this plan explains why seasons happen and why they are
 * opposite in the Northern and Southern Hemispheres, using a model of
 * Earth's fixed-direction tilted axis and its year-long revolution around
 * the sun. It deliberately excludes and deliberately allows the following:
 *   - ROW 2.1 (Earth's rotation: day and night) owns the daily spin that
 *     produces day and night. This file never explains day and night; it
 *     only uses day LENGTH (longer or shorter across the year) as one of
 *     the two consequences of tilt, which is a different claim from what
 *     causes day and night in the first place.
 *   - ROW 2.3 (phases of the Moon) and ROW 2.4 (eclipses) are not
 *     mentioned anywhere in this file. The Moon does not appear in this
 *     lesson at all.
 *   - GRAVITY holding Earth in orbit around the sun is row 1.3 and is not
 *     mentioned anywhere in this file.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this lesson states, as a plain
 *     observation, that sunlight arriving at a steeper, more direct angle
 *     warms a surface more than the same sunlight spread thin at a
 *     shallow angle over a larger area (grounded in the everyday
 *     experience of the sun feeling stronger overhead at midday than
 *     low and slanted at dawn or dusk, never in an assumed apparatus).
 *     It does NOT explain why that is true in terms of
 *     energy per unit area, heat transfer, radiation, or any particle-level
 *     account -- those are Grade 8 physical science and appear nowhere
 *     here. No force, distance calculation, or orbital mechanic is
 *     computed anywhere in this file.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope
 *     for this row, and none appears.
 *   - LATITUDE/ELEVATION effects on regional climate (why the equator
 *     stays milder year-round, why inland places swing more than coastal
 *     ones) belong to row 8.2 and do not appear in this file; this lesson
 *     only ever compares the Northern Hemisphere to the Southern
 *     Hemisphere as wholes.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * position, angle, and comparison in this file is written out in words,
 * and every item is solvable from the text printed inside it. Never write
 * "see the diagram above", and never assume the student has a flashlight,
 * a globe, or a lamp in front of them right now -- the sun-angle
 * comparisons in this file are grounded in a memory the student plausibly
 * already has (the sun feeling stronger overhead than low on the horizon),
 * never in a live demonstration or an apparatus they do not have.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U2_EARTHS_REVOLUTION_AND_THE_SEASONS: LessonPlan = {
  id: 'evelyn.ms.m6sci.earths-revolution-and-the-seasons.v1',
  title: 'Earth\'s Revolution & the Seasons',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.earths-revolution-and-the-seasons',
      standard: 'M6SCI-2.2',
      description:
        'Use a model of Earth\'s tilted axis and its year-long revolution around the sun to explain why seasons occur and why they are opposite in the Northern and Southern Hemispheres at the same time, sharing MS-ESS1-1 with the rest of Unit 2 as a coarse, model-by-model split (NGSS MS-ESS1-1).',
    },
  ],
  prerequisites: ['m6sci.earths-rotation-day-and-night'],
  followUps: ['m6sci.phases-of-the-moon'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Raise the distance myth and break it immediately with the hemisphere-opposite fact, before any explanation is given.',
      script:
        'You already know it is hot outside in July and cold in January, if you live in the Northern Hemisphere. Ask most people why, and almost everyone gives the same answer: Earth must get closer to the sun in the summer. It sounds completely reasonable. Here is one fact that breaks it instantly. Right now, whenever it is winter where you live, kids in Australia -- in the Southern Hemisphere -- are in the middle of their summer. Same Earth, same day, same distance from the sun, and completely opposite seasons. So distance cannot be the whole story, and it might not be any of the story. Today we build the model that explains your winter and Australia\'s summer, on the very same day, with the very same sun.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tilt-and-revolution',
      kind: 'concept',
      goal: 'Build the fixed-tilt-plus-revolution model, kill the distance myth with the two facts that survive no distance theory, and state the tilt effects precisely: angle of sunlight and day length, not proximity.',
      keyIdeas: [
        'THE AXIS STAYS POINTED THE SAME WAY. Earth spins on an axis that is tilted about 23.5 degrees, not standing straight up. As Earth revolves around the sun over the course of a year, that axis keeps pointing in the same direction in space -- toward roughly the same distant spot in the sky -- the whole time. The axis does not swing around to follow the sun and it does not flip partway through the year. That single fact is what makes everything else in this lesson work.',
        'THE DISTANCE MYTH, KILLED BY THE ORBIT ITSELF. Earth\'s orbit around the sun is close to a circle, only very slightly stretched. Earth is actually nearest the sun in early January -- which is winter in the Northern Hemisphere -- and farthest from the sun in early July -- which is Northern Hemisphere summer. WRONG: "It is summer in July because Earth is closer to the sun then." CORRECT: "Earth is farther from the sun in July than in January, so distance moves in exactly the wrong direction to explain a Northern Hemisphere summer."',
        'THE KILLER FACT: OPPOSITE HEMISPHERES, SAME DISTANCE, SAME MOMENT. In July, the Northern Hemisphere has summer and the Southern Hemisphere has winter, at the very same time. Both hemispheres sit on the same Earth, the same distance from the sun, at that exact moment. If distance controlled the season, the whole planet would have to be in the same season together, since there is only one Earth-to-sun distance at any moment. Since the season is different for the two hemispheres, the cause has to be something that is also different for the two hemispheres -- and distance from the sun is not.',
        'WHAT ACTUALLY CHANGES: THE ANGLE OF SUNLIGHT AND THE LENGTH OF DAY. Because the axis stays pointed the same way while Earth moves around the sun, there are times in the year when the Northern Hemisphere leans toward the sun and times when it leans away, with the Southern Hemisphere doing the opposite each time. You have probably noticed that the sun feels strongest around the middle of the day, when it sits high overhead, and much weaker in the early morning or evening, when its light comes in low and slanted near the horizon. The same idea plays out across a whole year. When a hemisphere is tilted toward the sun, sunlight there arrives at a steeper, more direct angle -- concentrated onto a smaller patch of ground -- and its days grow longer. When a hemisphere is tilted away, sunlight arrives at a shallower, more slanted angle -- spread thin over a larger patch of ground -- and its days grow shorter. Both of those together -- more direct sunlight and more hours of it -- are what make a season warm, not proximity to the sun.',
        'OPPOSITE HEMISPHERES, REVERSING EVERY SIX MONTHS. Seen from the Northern Hemisphere, summer is the stretch of the year when the tilt points that hemisphere toward the sun; winter is the stretch when it points away. Because the axis points one fixed way while Earth travels all the way around the sun, the Southern Hemisphere is always doing the opposite of the Northern Hemisphere at that same moment, and about six months later the roles swap completely. One full trip around the sun -- one revolution -- takes about 365 days, which is why the pattern repeats once a year.',
        'THE EXTREMES AND THE MIDPOINTS HAVE NAMES. A SOLSTICE is the point in Earth\'s orbit where a hemisphere\'s tilt toward or away from the sun is at its greatest, giving that hemisphere its longest or shortest day of the year. An EQUINOX is the point roughly halfway between the solstices, where neither hemisphere is tilted toward or away from the sun, so day and night are close to equal length in both hemispheres at once.',
      ],
      vocabulary: [
        { term: 'revolution', definition: 'one full trip Earth makes around the sun, which takes about 365 days.' },
        { term: 'axis', definition: 'the imaginary line through Earth\'s center that Earth spins around; it stays tilted about 23.5 degrees and keeps pointing the same direction in space all year.' },
        { term: 'tilt', definition: 'the fixed lean of Earth\'s axis away from standing straight up, which is the reason a hemisphere sometimes faces the sun more directly and sometimes less.' },
        { term: 'hemisphere', definition: 'one half of Earth, split by the equator into the Northern Hemisphere and the Southern Hemisphere.' },
        { term: 'solstice', definition: 'the point in Earth\'s orbit where a hemisphere\'s tilt toward or away from the sun is greatest, giving that hemisphere its longest or shortest day of the year.' },
        { term: 'equinox', definition: 'the point in Earth\'s orbit where neither hemisphere is tilted toward or away from the sun, so day and night are close to equal length everywhere.' },
      ],
      suggestedTools: ['show_diagram', 'show_cycle_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-position-to-season',
      kind: 'worked_example',
      problem:
        'Earth reaches the point in its orbit where the Northern Hemisphere is tilted toward the sun. Name the season in the Northern Hemisphere and the season in the Southern Hemisphere at that same moment, and say why.',
      steps: [
        'Start from the fixed fact: the axis points the same way all year, so whichever hemisphere the tilt happens to point toward the sun gets more direct sunlight and longer days.',
        'The Northern Hemisphere is tilted toward the sun, so it gets more direct sunlight -- the high-overhead, concentrated kind, the way the midday sun feels strong -- and longer days. That combination is summer.',
        'Because the axis points one fixed way, the Southern Hemisphere is tilted away from the sun at that same moment. It gets less direct sunlight -- the low, slanted, spread-out kind, the way an early-morning sun feels weak -- and shorter days. That combination is winter.',
        'Check the distance trap before finishing: both hemispheres are on the same Earth, the same distance from the sun, at this exact moment. If distance explained the season, both hemispheres would have to match. They do not, so the answer has to rest on tilt, not distance.',
        'Run the two checks a science answer needs, since there is no arithmetic to redo here. First, clues of DIFFERENT KINDS that agree: the angle reasoning (direct sunlight on the tilted-toward side), the day-length reasoning (longer days on the tilted-toward side), and the distance check (same distance, so distance cannot be doing the work) all point the same way. Second, change one condition and see the answer move: swing Earth around to the opposite side of its orbit, six months later, with the axis still pointing the same fixed direction -- now the Northern Hemisphere is the one tilted away, and the answer flips to Northern Hemisphere winter and Southern Hemisphere summer. A rule that gave summer to the same hemisphere no matter where Earth was in its orbit would not be a rule at all.',
      ],
      answer:
        'Summer in the Northern Hemisphere and winter in the Southern Hemisphere. The Northern Hemisphere\'s tilt points it toward the sun, giving it more direct sunlight and longer days; the Southern Hemisphere\'s tilt points it away, giving it less direct sunlight and shorter days -- not because either hemisphere is closer to the sun.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-distance-claim-checked',
      kind: 'worked_example',
      problem:
        'A student says: "The Northern Hemisphere has summer in July because Earth is closest to the sun then." Use what you know about Earth\'s orbit and about the Southern Hemisphere to show this is wrong, and give the real explanation.',
      steps: [
        'Check the distance claim against the actual orbit first. Earth\'s orbit is close to circular, and Earth is nearest the sun in early January and farthest from the sun in early July.',
        'WRONG: "Northern Hemisphere summer happens because Earth is closest to the sun in July." CORRECT: "Earth is actually farthest from the sun in early July and nearest in early January -- distance moves in exactly the wrong direction to explain a July summer."',
        'Bring in the hemisphere check. If distance controlled the season, the entire planet would share one season at a time, since there is only one Earth-to-sun distance at any moment. But in July the Southern Hemisphere has winter while the Northern Hemisphere has summer -- opposite seasons on the same planet at the same distance. Distance cannot explain that split.',
        'The real cause is the tilt. Because Earth\'s axis stays pointed the same fixed way as Earth revolves, around July the Northern Hemisphere\'s tilt points it toward the sun, so it gets more direct sunlight and longer days -- that is what makes it summer there, with the Southern Hemisphere tilted away and having winter.',
        'Run the two checks. First, three clues of different kinds that agree: the orbital-distance data (Earth is farther from the sun in July, not closer), the hemisphere-opposite fact (Southern Hemisphere is not also warm in July, so a whole-planet cause is ruled out), and day-length (Northern Hemisphere days are near their longest around this time). Second, rewind to a contrasting case: move the same reasoning to January. Distance is now closest, yet the Northern Hemisphere has winter -- another point against a distance-based rule -- while the tilt reasoning still gives the right answer, because in January the Northern Hemisphere\'s tilt points away from the sun.',
      ],
      answer:
        'Wrong: distance is not the cause, and it points the wrong way in July besides. The real explanation is that Earth\'s axis stays tilted the same fixed way all year, and around July that tilt points the Northern Hemisphere toward the sun, giving it more direct sunlight and longer days -- true even though Earth itself is farther from the sun at that time of year.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-why-july-is-summer',
      kind: 'try_yourself',
      problem: 'Why does the Northern Hemisphere have summer in July?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Earth\'s axis stays tilted the same fixed way all year, and in July that tilt points the Northern Hemisphere toward the sun, giving it more direct sunlight and longer days.',
          correct: true,
        },
        {
          id: 'b',
          text: 'Earth reaches the closest point in its orbit to the sun in July, and that extra closeness warms the whole planet at once, the same way standing closer to a campfire warms everyone near it more.',
        },
        {
          id: 'c',
          text: 'The tilt of Earth\'s axis flips to point in a new direction partway through the year, and in July it happens to be pointing toward the sun.',
        },
        {
          id: 'd',
          text: 'The sun gives off more energy during the summer months, so extra heat reaches Earth no matter which hemisphere you are standing in.',
        },
      ],
      expectedAnswer:
        'Earth\'s axis stays tilted the same fixed way all year, and in July that tilt points the Northern Hemisphere toward the sun, giving it more direct sunlight and longer days.',
      hints: [
        'Check the distance idea against the orbit first. Is Earth actually closest to the sun in July, or is it somewhere else in the year?',
        'The axis keeps pointing the same fixed direction in space all year -- it does not swing around or flip. So what changes as Earth moves around the sun is not the axis direction, but which hemisphere that fixed direction happens to point toward.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-opposite-hemispheres',
      kind: 'try_yourself',
      problem:
        'In July, while the Northern Hemisphere has summer, Australia -- in the Southern Hemisphere -- is having winter. Both places are on the same Earth, the same distance from the sun at that moment. What explains the difference?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Australia is much farther from the sun than the Northern Hemisphere is at that time of year, as if the two hemispheres could sit at different distances even though they share one round planet.',
        },
        {
          id: 'b',
          text: 'In July, Earth\'s tilt points the Northern Hemisphere toward the sun and the Southern Hemisphere away from it, so the two hemispheres get different amounts of direct sunlight and different day lengths at the same time.',
          correct: true,
        },
        {
          id: 'c',
          text: 'Australia\'s atmosphere is different from the Northern Hemisphere\'s atmosphere, and that difference is what produces the opposite season there, similar to how standing in the shade feels cooler than standing in direct sunlight.',
        },
        {
          id: 'd',
          text: 'The two hemispheres take turns being the closer one to the sun every few months, and Australia happens to be the farther hemisphere in July, as though the two halves of Earth could orbit the sun somewhat independently of each other.',
        },
      ],
      expectedAnswer:
        'In July, Earth\'s tilt points the Northern Hemisphere toward the sun and the Southern Hemisphere away from it, so the two hemispheres get different amounts of direct sunlight and different day lengths at the same time.',
      hints: [
        'The question already tells you the two places are the same distance from the sun. So whatever explains the difference has to be something that is NOT the same for the two hemispheres.',
        'Think about which way the fixed axis is pointing in July. If it points one hemisphere toward the sun, which way must it be pointing the other hemisphere at that same moment?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-angle-and-day-length',
      kind: 'try_yourself',
      problem:
        'At a certain point in Earth\'s orbit, sunlight strikes the Northern Hemisphere at a steep, close-to-overhead angle, and daylight there lasts about 15 hours. At the very same moment, sunlight strikes the Southern Hemisphere at a low, slanting angle, and daylight there lasts about 9 hours. What season is it in the Southern Hemisphere?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Summer, because a slanting sunlight angle spread over a larger area still delivers the same total warmth as a steep, concentrated angle would.',
        },
        {
          id: 'b',
          text: 'Spring, because 9 hours of daylight sits partway between a long summer day and a short winter day, so it must be an in-between season, without checking which direction the day length is heading.',
        },
        {
          id: 'c',
          text: 'Winter, because a low, slanting sun angle and shorter daylight are exactly what a hemisphere gets when Earth\'s tilt points it away from the sun.',
          correct: true,
        },
        {
          id: 'd',
          text: 'It cannot be determined from sunlight angle or day length, because season depends only on which month of the calendar it is, as if the calendar caused the seasons instead of simply recording them.',
        },
      ],
      expectedAnswer:
        'Winter, because a low, slanting sun angle and shorter daylight are exactly what a hemisphere gets when Earth\'s tilt points it away from the sun.',
      hints: [
        'Do not compare the two hemispheres\' hours to each other as if one number were "in between" the other. Instead ask what a low, slanted sun angle plus short days means on its own, the way an early-morning sun feels weak.',
        'A steep, close-to-overhead sun angle and long days go together on the side of Earth tilted toward the sun. What goes with the opposite: a low, slanting angle and short days?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-distance-and-whole-planet',
      kind: 'misconception_check',
      question:
        'A student writes: "It is summer in the Northern Hemisphere in July because Earth is closest to the sun then, and every place on Earth should be warm together." Two different things are wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'It is summer in the Northern Hemisphere in July because Earth is closest to the sun then.',
          misconception:
            'Assuming distance from the sun controls temperature, because "closer feels warmer" is true of a campfire and seems like it should carry over to the sun.',
          correctsTo:
            'Earth\'s orbit around the sun is close to circular, and Earth is actually nearest the sun in early January -- Northern Hemisphere winter -- and farthest from the sun in early July -- Northern Hemisphere summer. Distance moves in exactly the wrong direction to explain a July summer. The real cause is Earth\'s axis, which stays tilted the same fixed way all year: in July that tilt points the Northern Hemisphere toward the sun, giving it more direct sunlight and longer days.',
        },
        {
          answer: 'Every place on Earth should be warm together, since it is all the same distance from the sun.',
          misconception:
            'Treating season as one planet-wide condition instead of something that differs by hemisphere, because distance from the sun genuinely is almost the same for the whole planet.',
          correctsTo:
            'Season is not the same everywhere at once. In July the Northern Hemisphere is tilted toward the sun and has summer, while the Southern Hemisphere is tilted away and has winter, at that very same moment -- Australia, for example, has winter in July. Since both hemispheres sit at the same distance from the sun, only something that differs between the hemispheres -- the direction of the tilt -- can explain why their seasons are opposite.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Earth\'s axis is tilted about 23.5 degrees and keeps pointing the same fixed direction in space all year as Earth revolves around the sun.',
        'Seasons are not caused by distance from the sun. Earth is actually nearest the sun in early January (Northern Hemisphere winter) and farthest in early July (Northern Hemisphere summer).',
        'The killer fact: the Northern and Southern Hemispheres have opposite seasons at the same moment, even though they are the same distance from the sun -- so distance cannot be the cause.',
        'What actually changes is the angle of sunlight and the length of day. A hemisphere tilted toward the sun gets more direct, concentrated sunlight and longer days; a hemisphere tilted away gets more slanted, spread-out sunlight and shorter days.',
        'Seen from the Northern Hemisphere, summer is when the tilt points that hemisphere toward the sun and winter is when it points away; the Southern Hemisphere is always doing the opposite at that same moment.',
        'One revolution -- one full trip around the sun -- takes about 365 days, and the roles of the two hemispheres swap about every six months.',
        'A solstice is when a hemisphere\'s tilt toward or away from the sun is greatest, giving its longest or shortest day. An equinox is the roughly halfway point, when day and night are close to equal length in both hemispheres.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Earth\'s Revolution & the Seasons' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
