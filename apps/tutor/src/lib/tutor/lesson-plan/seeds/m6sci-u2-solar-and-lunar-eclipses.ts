/**
 * Grade 6 Science (Earth & Space Science) — The Earth-Sun-Moon System: Solar & Lunar Eclipses.
 *
 * CONCEPT-LED lesson for the m6sci fan-out (NGSS MS-ESS1-1), following the shape of the
 * phases-of-the-moon exemplar. The student cannot see a diagram, so the whole lesson leans on
 * one representation that survives being spoken aloud and printed as plain text: the ORDER the
 * three bodies stand in. Every eclipse description in this file states that order explicitly --
 * Sun, Moon, Earth for a solar eclipse; Sun, Earth, Moon for a lunar eclipse -- and the reasoning
 * in every worked example and try_yourself item is built on top of that order rather than on any
 * picture the student cannot see.
 *
 * SCOPE GUARD: this plan distinguishes a solar eclipse (Moon between Sun and Earth) from a lunar
 * eclipse (Earth between Sun and Moon), explains why each is visible the way it is (a narrow
 * strip of Earth for a solar eclipse, the whole night side for a lunar eclipse, from the size
 * difference between the Moon's shadow and Earth's shadow), and explains why eclipses do not
 * happen every month (the Moon's orbit is tilted about 5 degrees from Earth's orbit around the
 * sun). Nothing else is in scope:
 *   - ROW 2.3 (phases of the Moon) is the immediate neighbor and is assumed, not re-taught. This
 *     file uses "new moon" and "full moon" only as the phase conditions an eclipse depends on; it
 *     does not re-explain the waxing/waning cycle, the eight named phases, or why the Moon's lit
 *     shape changes across the month. Those belong to 2.3.
 *   - ROW 2.2 (Earth's revolution and the seasons) owns Earth's AXIAL tilt. This file names a
 *     different tilt -- the Moon's ORBITAL tilt relative to Earth's orbit around the sun -- and
 *     the try_yourself item closest to being confused with 2.2 (the third one) is written
 *     specifically to stop a student from reaching for the seasons explanation here.
 *   - ROW 1.3 (gravity and orbital motion) owns why the Moon stays in orbit at all. Gravity is
 *     not named anywhere in this file.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this file describes eclipses entirely as shadows and
 *     straight-line geometry. It never explains light as a wave, never uses refraction or a ray
 *     diagram, and the hook's mention of the Moon turning a coppery color during a lunar eclipse
 *     is stated as a plain observation with no mechanism attached -- the atmospheric-refraction
 *     explanation for that color is deliberately left out. No force, distance or brightness is
 *     calculated anywhere in this file.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for this row, and none
 *     appears.
 *   - SAFETY: every mention of viewing a solar eclipse in person is paired with an explicit
 *     instruction never to look directly at the sun without eclipse-safety equipment; the file
 *     never describes or implies looking at the sun unprotected.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every alignment in this file is
 * written out in words, always naming which body stands in the middle, so a try_yourself item is
 * solvable from the text printed inside it alone.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U2_SOLAR_AND_LUNAR_ECLIPSES: LessonPlan = {
  id: 'evelyn.ms.m6sci.solar-and-lunar-eclipses.v1',
  title: 'Solar & Lunar Eclipses',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.solar-and-lunar-eclipses',
      standard: 'M6SCI-2.4',
      description:
        'Use a model of Sun-Earth-Moon alignment to distinguish a solar eclipse (Moon between Sun and Earth) from a lunar eclipse (Earth between Sun and Moon) and explain why eclipses do not occur every month (NGSS MS-ESS1-1).',
    },
  ],
  prerequisites: ['m6sci.phases-of-the-moon'],
  followUps: ['m6sci.earths-layered-structure'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Contrast the two kinds of eclipse by what they look like, before naming either one.',
      script:
        'You may have seen news coverage of a solar eclipse: the sky dims in the middle of the day, and people stand outside wearing dark glasses made just for the occasion. It looks like nighttime arriving early, in the wrong place, for no reason -- and then it passes and the sky brightens again. A lunar eclipse looks completely different: the full moon slowly turns a dim, coppery color, over a much longer stretch of time than a solar eclipse lasts, and anyone who can see the Moon that night sees the same thing at the same time. Two very different-looking events, both called eclipses, both built from the exact same three objects: the sun, Earth and the Moon. Today you will learn the one thing that tells them apart -- which of the three objects is standing in the middle -- and why an eclipse does not happen every single month, even though the Moon lines up with the sun and Earth every month.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-eclipses',
      kind: 'concept',
      goal: 'Build the order-decides-the-type model for both eclipse kinds, and explain why eclipses are rare compared with new and full moons.',
      keyIdeas: [
        'WHAT AN ECLIPSE IS. An eclipse happens when the sun, Earth and the Moon line up close to a straight line, so that one body blocks sunlight from reaching another body. There are exactly two kinds in this lesson, and the order the three bodies stand in tells you which one you have.',
        'A SOLAR ECLIPSE -- ORDER: SUN, MOON, EARTH. The Moon is the body in the middle. The Moon\'s shadow reaches part of Earth\'s daytime side, blocking sunlight from that part. This can only happen at new moon, because that is the only point in the Moon\'s orbit where it sits between the sun and Earth. Because the Moon\'s shadow is small compared with Earth, the shadow only ever covers a narrow strip of Earth\'s daytime side at any moment, not the whole daytime side.',
        'A LUNAR ECLIPSE -- ORDER: SUN, EARTH, MOON. Earth is the body in the middle. Earth\'s shadow reaches the Moon, blocking sunlight from reaching it. This can only happen at full moon, because that is the only point in the Moon\'s orbit where Earth sits between the sun and the Moon. Because Earth\'s shadow is large compared with the Moon, the Moon can sit fully inside that shadow, and everyone on Earth\'s night side is looking at the same Moon at the same time -- so a lunar eclipse is visible from the entire night side of Earth at once, unlike the narrow strip of a solar eclipse.',
        'THE ORDER IS THE WHOLE ANSWER. Whichever body sits in the middle of the three is the one doing the blocking, and the body on the far end from it is the one losing sunlight. Moon in the middle blocks sunlight from reaching Earth -- a solar eclipse. Earth in the middle blocks sunlight from reaching the Moon -- a lunar eclipse. If a description does not say which body is in the middle, it has not actually said which eclipse it is.',
        'WHY ECLIPSES DO NOT HAPPEN EVERY MONTH. Earth has a new moon and a full moon roughly every 29.5 days, which might seem to mean an eclipse every two weeks. It does not happen that often because the Moon\'s orbit is tilted about 5 degrees from Earth\'s orbit around the sun. The two orbits only cross at two points. Most new moons and full moons happen with the Moon a little above or a little below the straight line an eclipse needs, and only the smaller number that land near where the orbits cross produce one.',
        'NEVER LOOK DIRECTLY AT THE SUN, INCLUDING DURING A SOLAR ECLIPSE. Sunlight is intense enough to damage your eyes in seconds, even during the partial stages of a solar eclipse, and ordinary sunglasses do not block enough of it to make this safe. People who observe a solar eclipse in person use eclipse glasses built to a specific safety standard, or watch an indirect projection of it, and never look at the sun without that protection.',
      ],
      vocabulary: [
        { term: 'eclipse', definition: 'an event where the sun, Earth and the Moon line up close to a straight line and one body blocks sunlight from reaching another.' },
        { term: 'solar eclipse', definition: 'the Moon passing between the sun and Earth at new moon, so the Moon\'s shadow blocks sunlight from reaching a narrow strip of Earth.' },
        { term: 'lunar eclipse', definition: 'Earth passing between the sun and the Moon at full moon, so Earth\'s shadow blocks sunlight from reaching the Moon.' },
        { term: 'tilted orbit', definition: 'the Moon\'s path around Earth sits about 5 degrees out of line with Earth\'s path around the sun, so the three bodies only line up closely enough for an eclipse on some new and full moons, not all of them.' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-solar-eclipse',
      kind: 'worked_example',
      problem:
        'During a certain new moon, the Moon lines up almost exactly between the sun and Earth, in that order: Sun, Moon, Earth. A narrow strip of Earth\'s daytime side goes dark for a short time as the Moon blocks the sun from that strip. Name the type of eclipse, and explain why only a narrow strip experiences it rather than the whole daytime side.',
      steps: [
        'Name the order first, because the order decides everything. Sun, Moon, Earth -- the Moon is the body in the middle.',
        'Whenever the Moon is the body in the middle, its shadow is what can reach Earth. That is a solar eclipse: the Moon blocking sunlight from reaching part of Earth.',
        'Check the phase condition. The Moon sits between the sun and Earth only at new moon, which matches what the problem states.',
        'Now explain the narrow strip. Earth is far bigger than the Moon, so the Moon\'s shadow is small compared with Earth. As the Moon\'s small shadow sweeps across Earth\'s daytime side, it only ever covers a narrow strip at any moment, never the whole daytime side at once.',
        'Run the two checks a science answer needs, since there is no arithmetic to redo here. First, look for clues of different kinds that agree: the ORDER given in the problem places the Moon in the middle (a geometry clue); the PHASE given is new moon, which is the only phase where that order can occur (a timing clue); and the OUTCOME described -- a narrow strip going dark -- matches what a small shadow crossing a much larger Earth should produce (a size clue). Three different kinds of clue, one answer.',
        'Second, change one condition and check that the answer moves. Suppose the order had been Sun, Earth, Moon instead, with Earth in the middle. Then Earth\'s shadow, not the Moon\'s, would be doing the blocking, and the event would be a lunar eclipse instead, visible very differently -- from the whole night side of Earth rather than a narrow daytime strip. Swapping which body sits in the middle changes the entire answer, which is exactly what should happen if the order is really doing the work.',
      ],
      answer:
        'A solar eclipse. The Moon is the body in the middle (Sun, Moon, Earth), so its shadow reaches part of Earth\'s daytime side. Because the Moon\'s shadow is small compared with Earth, only a narrow strip of that daytime side experiences it at any moment.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-lunar-eclipse',
      kind: 'worked_example',
      problem:
        'The following month, at full moon, Earth lines up almost exactly between the sun and the Moon, in that order: Sun, Earth, Moon. That month, people across the entire night side of Earth can see the Moon darken, for a much longer stretch than the narrow solar eclipse from the previous example. Name the type of eclipse, and explain why so many more people can see it, and for longer.',
      steps: [
        'Name the order first. Sun, Earth, Moon -- Earth is the body in the middle this time.',
        'Whenever Earth is the body in the middle, Earth\'s shadow is what can reach the Moon. That is a lunar eclipse: Earth blocking sunlight from reaching the Moon.',
        'Check the phase condition. Earth sits between the sun and the Moon only at full moon, which matches the problem.',
        'Now explain the wider visibility and the longer stretch. Earth is far bigger than the Moon, so Earth\'s shadow is large compared with the Moon. A large shadow takes longer to cross a small target, so the Moon can sit inside Earth\'s shadow for a longer stretch than the Moon\'s small shadow can sit on any one strip of Earth. And because the Moon is a single small object rather than a wide surface, anyone on the night side who can see the Moon at all sees the same darkened Moon at the same time -- there is no narrow path to be inside or outside of.',
        'WRONG: "A lunar eclipse can only be seen from one narrow area, the same as a solar eclipse." CORRECT: "A lunar eclipse is visible from the entire night side of Earth at once, because everyone on that side is looking at the same Moon sitting inside the same shadow."',
        'Run the two checks. Three different kinds of clue agree: the ORDER places Earth in the middle (geometry), the PHASE is full moon, the only phase where that order occurs (timing), and the OUTCOME described -- widespread, longer visibility -- matches a small object sitting inside a large shadow (size). Now change one condition: if Earth\'s shadow were small compared with the Moon instead of large, the Moon could cross it quickly and only part of the Moon\'s disk might darken at a time -- a different, faster event. The actual size relationship is what makes the eclipse both total and long for everyone who can see it.',
        'One more condition worth changing, since eclipses are the topic of this lesson. Full moons happen about every 29.5 days, yet Earth\'s shadow does not fall on the Moon every single one of those full moons. The Moon\'s orbit is tilted about 5 degrees from Earth\'s orbit around the sun, so on most full moons the Moon passes a little above or a little below Earth\'s shadow rather than through it. A lunar eclipse only happens on the smaller number of full moons where the Moon is also close to the place where its tilted orbit crosses Earth\'s orbital plane.',
      ],
      answer:
        'A lunar eclipse. Earth is the body in the middle (Sun, Earth, Moon), so Earth\'s shadow falls on the Moon. Because Earth\'s shadow is large compared with the Moon, and everyone on Earth\'s night side is looking at the same Moon, the eclipse is visible from the entire night side at once and lasts longer than a solar eclipse\'s narrow strip.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-solar-eclipse-order',
      kind: 'try_yourself',
      problem:
        'In a certain alignment, the Moon lines up almost exactly between the sun and Earth, in that order: Sun, Moon, Earth, and it happens at new moon. What type of eclipse is this, and where on Earth can it be seen from?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A lunar eclipse, visible from the entire night side of Earth, because a straight-line alignment is treated as always sending Earth\'s shadow onto the Moon, no matter which body stands in the middle.' },
        { id: 'b', text: 'A solar eclipse, visible from the entire daytime side of Earth at once, because the Moon\'s shadow is treated as if it were as wide as Earth, rather than a small shadow sweeping across it.' },
        { id: 'c', text: 'A solar eclipse, visible only from a narrow strip of Earth\'s daytime side, because the Moon is the body in the middle and its shadow is small compared with Earth.', correct: true },
        { id: 'd', text: 'A lunar eclipse, visible only from a narrow strip on Earth\'s night side, because new moon is mistaken for the phase when Earth\'s shadow reaches the Moon.' },
      ],
      expectedAnswer: 'A solar eclipse, visible only from a narrow strip of Earth\'s daytime side, because the Moon is the body in the middle and its shadow is small compared with Earth.',
      hints: [
        'Start by naming which body sits in the middle of the three, in the order given. That single fact decides which kind of eclipse this is.',
        'Once you know which body is in the middle, think about how big its shadow is compared with the body the shadow lands on. Does a small shadow cover a whole planet, or only part of it at a time?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-lunar-eclipse-order',
      kind: 'try_yourself',
      problem:
        'The following month, Earth lines up almost exactly between the sun and the Moon, in that order: Sun, Earth, Moon, and it happens at full moon. What type of eclipse is this, and where can it be seen from?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A solar eclipse, visible only from a narrow strip of Earth\'s daytime side, because the Moon is kept as the blocker even though this order puts Earth in the middle instead.' },
        { id: 'b', text: 'A lunar eclipse, visible only from a narrow strip of Earth\'s night side, because the solar eclipse\'s narrow-strip rule is carried over here without being rechecked.' },
        { id: 'c', text: 'A lunar eclipse, visible only during the day, from the side of Earth facing the sun, because that side seems closest to where the shadow starts.' },
        { id: 'd', text: 'A lunar eclipse, visible from the entire night side of Earth at once, because Earth is the body in the middle and its shadow is large enough to cover the whole Moon.', correct: true },
      ],
      expectedAnswer: 'A lunar eclipse, visible from the entire night side of Earth at once, because Earth is the body in the middle and its shadow is large enough to cover the whole Moon.',
      hints: [
        'Start the same way as before: name which body sits in the middle of the three, in the order given. That tells you the type.',
        'Now think about the sizes involved. Earth\'s shadow and the Moon it falls on -- which one is bigger, and what does that mean for how much of Earth can see the same darkened Moon at once?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-why-not-every-month',
      kind: 'try_yourself',
      problem:
        'Earth has a new moon or a full moon roughly every 29.5 days, so an eclipse could line up about twice a month. Eclipses actually happen far less often than that. What explains the difference?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Moon\'s orbit is tilted about 5 degrees from Earth\'s orbit around the sun, so at most new and full moons the Moon sits slightly above or slightly below the straight line an eclipse needs.', correct: true },
        { id: 'b', text: 'Eclipses do line up at almost every new and full moon, but most of them are dismissed as too faint to be noticed from the ground, so people assume an eclipse almost never happens.' },
        { id: 'c', text: 'The Moon\'s distance from Earth changes enough during its orbit that its shadow drifts off target most months, the same way a flashlight beam misses a wall once you back far enough away from it.' },
        { id: 'd', text: 'Earth\'s axis is tilted the same way it is during the seasons, so Earth\'s shadow only lines up with the Moon a few times a year, near the times the axis points most directly toward the sun.' },
      ],
      expectedAnswer: 'The Moon\'s orbit is tilted about 5 degrees from Earth\'s orbit around the sun, so at most new and full moons the Moon sits slightly above or slightly below the straight line an eclipse needs.',
      hints: [
        'New moon and full moon are about the alignment of the sun, Earth and the Moon along one line. Ask whether the Moon\'s path around Earth actually sits exactly on that same line every time, or off to one side of it.',
        'Think about which tilt is being asked about here: the tilt that causes the seasons belongs to Earth spinning on its axis. This question is about a different tilt -- the one belonging to the Moon\'s path around Earth.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-order-and-phase',
      kind: 'misconception_check',
      question:
        'A student says: "A solar eclipse happens when Earth\'s shadow blocks the sun, and it can happen at any full moon." Name the two separate mistakes in that sentence, and correct each one.',
      commonErrors: [
        {
          answer: 'A solar eclipse happens when Earth\'s shadow blocks the sun.',
          misconception:
            'Reversing which body is in the middle and whose shadow is doing the work, likely by assuming a solar eclipse is just the sun\'s version of the more familiar lunar eclipse.',
          correctsTo:
            'In a solar eclipse, the order is Sun, Moon, Earth -- the Moon is the body in the middle, and it is the Moon\'s shadow that falls on Earth, blocking sunlight from reaching part of Earth\'s daytime side. Earth\'s shadow is never involved in a solar eclipse; Earth\'s shadow is what causes a lunar eclipse instead, when Earth is the body in the middle.',
        },
        {
          answer: 'It can happen at any full moon.',
          misconception:
            'Attaching the wrong phase to the wrong eclipse, likely by remembering that eclipses are tied to a specific moon phase without keeping track of which phase goes with which type.',
          correctsTo:
            'A solar eclipse can only happen at new moon, because that is the only point in the Moon\'s orbit where the Moon sits between the sun and Earth. Full moon is when Earth sits between the sun and the Moon, which is the condition for a lunar eclipse, not a solar one. And even at new moon, most months do not produce an eclipse at all, because the Moon\'s orbit is tilted about 5 degrees from Earth\'s orbit and usually misses the straight line an eclipse needs.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An eclipse happens when the sun, Earth and the Moon line up close to a straight line. The body in the middle decides everything.',
        'Solar eclipse -- order Sun, Moon, Earth. The Moon is in the middle, its shadow falls on part of Earth\'s daytime side, and it can only happen at new moon.',
        'Because the Moon\'s shadow is small compared with Earth, a solar eclipse is visible only from a narrow strip of Earth\'s daytime side.',
        'Lunar eclipse -- order Sun, Earth, Moon. Earth is in the middle, its shadow falls on the Moon, and it can only happen at full moon.',
        'Because Earth\'s shadow is large compared with the Moon, a lunar eclipse is visible from the entire night side of Earth at once.',
        'Eclipses do not happen every new moon or full moon because the Moon\'s orbit is tilted about 5 degrees from Earth\'s orbit around the sun, so most months the Moon passes above or below the line an eclipse needs.',
        'Never look directly at the sun, even during a solar eclipse. Use eclipse glasses built to a safety standard, or watch an indirect projection, and never rely on ordinary sunglasses.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Solar & Lunar Eclipses' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
