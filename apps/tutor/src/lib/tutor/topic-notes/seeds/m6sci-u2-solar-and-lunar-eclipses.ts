/**
 * Grade 6 Science — Unit 2 CED 2.4: Solar & Lunar Eclipses.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.solar-and-lunar-eclipses.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U2_SOLAR_AND_LUNAR_ECLIPSES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.solar-and-lunar-eclipses.v1',
  course: 'Grade 6 Science',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Solar & Lunar Eclipses',
  planId: 'evelyn.ms.m6sci.solar-and-lunar-eclipses.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.solar-and-lunar-eclipses.v1' }],
  theory: [
    { loId: 'm6sci.solar-and-lunar-eclipses', content: `WHAT AN ECLIPSE IS. An eclipse happens when the sun, Earth and the Moon line up close to a straight line, so that one body blocks sunlight from reaching another body. There are exactly two kinds in this lesson, and the order the three bodies stand in tells you which one you have.` },
    { loId: 'm6sci.solar-and-lunar-eclipses', content: `A SOLAR ECLIPSE -- ORDER: SUN, MOON, EARTH. The Moon is the body in the middle. The Moon's shadow reaches part of Earth's daytime side, blocking sunlight from that part. This can only happen at new moon, because that is the only point in the Moon's orbit where it sits between the sun and Earth. Because the Moon's shadow is small compared with Earth, the shadow only ever covers a narrow strip of Earth's daytime side at any moment, not the whole daytime side.` },
    { loId: 'm6sci.solar-and-lunar-eclipses', content: `A LUNAR ECLIPSE -- ORDER: SUN, EARTH, MOON. Earth is the body in the middle. Earth's shadow reaches the Moon, blocking sunlight from reaching it. This can only happen at full moon, because that is the only point in the Moon's orbit where Earth sits between the sun and the Moon. Because Earth's shadow is large compared with the Moon, the Moon can sit fully inside that shadow, and everyone on Earth's night side is looking at the same Moon at the same time -- so a lunar eclipse is visible from the entire night side of Earth at once, unlike the narrow strip of a solar eclipse.` },
    { loId: 'm6sci.solar-and-lunar-eclipses', content: `THE ORDER IS THE WHOLE ANSWER. Whichever body sits in the middle of the three is the one doing the blocking, and the body on the far end from it is the one losing sunlight. Moon in the middle blocks sunlight from reaching Earth -- a solar eclipse. Earth in the middle blocks sunlight from reaching the Moon -- a lunar eclipse. If a description does not say which body is in the middle, it has not actually said which eclipse it is.` },
    { loId: 'm6sci.solar-and-lunar-eclipses', content: `WHY ECLIPSES DO NOT HAPPEN EVERY MONTH. Earth has a new moon and a full moon roughly every 29.5 days, which might seem to mean an eclipse every two weeks. It does not happen that often because the Moon's orbit is tilted about 5 degrees from Earth's orbit around the sun. The two orbits only cross at two points. Most new moons and full moons happen with the Moon a little above or a little below the straight line an eclipse needs, and only the smaller number that land near where the orbits cross produce one.` },
    { loId: 'm6sci.solar-and-lunar-eclipses', content: `NEVER LOOK DIRECTLY AT THE SUN, INCLUDING DURING A SOLAR ECLIPSE. Sunlight is intense enough to damage your eyes in seconds, even during the partial stages of a solar eclipse, and ordinary sunglasses do not block enough of it to make this safe. People who observe a solar eclipse in person use eclipse glasses built to a specific safety standard, or watch an indirect projection of it, and never look at the sun without that protection.` },
    { loId: 'm6sci.solar-and-lunar-eclipses', kind: 'definition', title: 'eclipse', content: `an event where the sun, Earth and the Moon line up close to a straight line and one body blocks sunlight from reaching another.` },
    { loId: 'm6sci.solar-and-lunar-eclipses', kind: 'definition', title: 'solar eclipse', content: `the Moon passing between the sun and Earth at new moon, so the Moon's shadow blocks sunlight from reaching a narrow strip of Earth.` },
    { loId: 'm6sci.solar-and-lunar-eclipses', kind: 'definition', title: 'lunar eclipse', content: `Earth passing between the sun and the Moon at full moon, so Earth's shadow blocks sunlight from reaching the Moon.` },
    { loId: 'm6sci.solar-and-lunar-eclipses', kind: 'definition', title: 'tilted orbit', content: `the Moon's path around Earth sits about 5 degrees out of line with Earth's path around the sun, so the three bodies only line up closely enough for an eclipse on some new and full moons, not all of them.` },
  ],
  methods: [
    {
      title: 'Worked solar eclipse',
      steps: [
        `Name the order first, because the order decides everything. Sun, Moon, Earth -- the Moon is the body in the middle.`,
        `Whenever the Moon is the body in the middle, its shadow is what can reach Earth. That is a solar eclipse: the Moon blocking sunlight from reaching part of Earth.`,
        `Check the phase condition. The Moon sits between the sun and Earth only at new moon, which matches what the problem states.`,
        `Now explain the narrow strip. Earth is far bigger than the Moon, so the Moon's shadow is small compared with Earth. As the Moon's small shadow sweeps across Earth's daytime side, it only ever covers a narrow strip at any moment, never the whole daytime side at once.`,
        `Run the two checks a science answer needs, since there is no arithmetic to redo here. First, look for clues of different kinds that agree: the ORDER given in the problem places the Moon in the middle (a geometry clue); the PHASE given is new moon, which is the only phase where that order can occur (a timing clue); and the OUTCOME described -- a narrow strip going dark -- matches what a small shadow crossing a much larger Earth should produce (a size clue). Three different kinds of clue, one answer.`,
        `Second, change one condition and check that the answer moves. Suppose the order had been Sun, Earth, Moon instead, with Earth in the middle. Then Earth's shadow, not the Moon's, would be doing the blocking, and the event would be a lunar eclipse instead, visible very differently -- from the whole night side of Earth rather than a narrow daytime strip. Swapping which body sits in the middle changes the entire answer, which is exactly what should happen if the order is really doing the work.`,
      ],
      example: { problem: `During a certain new moon, the Moon lines up almost exactly between the sun and Earth, in that order: Sun, Moon, Earth. A narrow strip of Earth's daytime side goes dark for a short time as the Moon blocks the sun from that strip. Name the type of eclipse, and explain why only a narrow strip experiences it rather than the whole daytime side.`, solution: `A solar eclipse. The Moon is the body in the middle (Sun, Moon, Earth), so its shadow reaches part of Earth's daytime side. Because the Moon's shadow is small compared with Earth, only a narrow strip of that daytime side experiences it at any moment.` },
      relatedLoIds: ['m6sci.solar-and-lunar-eclipses'],
    },
    {
      title: 'Worked lunar eclipse',
      steps: [
        `Name the order first. Sun, Earth, Moon -- Earth is the body in the middle this time.`,
        `Whenever Earth is the body in the middle, Earth's shadow is what can reach the Moon. That is a lunar eclipse: Earth blocking sunlight from reaching the Moon.`,
        `Check the phase condition. Earth sits between the sun and the Moon only at full moon, which matches the problem.`,
        `Now explain the wider visibility and the longer stretch. Earth is far bigger than the Moon, so Earth's shadow is large compared with the Moon. A large shadow takes longer to cross a small target, so the Moon can sit inside Earth's shadow for a longer stretch than the Moon's small shadow can sit on any one strip of Earth. And because the Moon is a single small object rather than a wide surface, anyone on the night side who can see the Moon at all sees the same darkened Moon at the same time -- there is no narrow path to be inside or outside of.`,
        `WRONG: "A lunar eclipse can only be seen from one narrow area, the same as a solar eclipse." CORRECT: "A lunar eclipse is visible from the entire night side of Earth at once, because everyone on that side is looking at the same Moon sitting inside the same shadow."`,
        `Run the two checks. Three different kinds of clue agree: the ORDER places Earth in the middle (geometry), the PHASE is full moon, the only phase where that order occurs (timing), and the OUTCOME described -- widespread, longer visibility -- matches a small object sitting inside a large shadow (size). Now change one condition: if Earth's shadow were small compared with the Moon instead of large, the Moon could cross it quickly and only part of the Moon's disk might darken at a time -- a different, faster event. The actual size relationship is what makes the eclipse both total and long for everyone who can see it.`,
        `One more condition worth changing, since eclipses are the topic of this lesson. Full moons happen about every 29.5 days, yet Earth's shadow does not fall on the Moon every single one of those full moons. The Moon's orbit is tilted about 5 degrees from Earth's orbit around the sun, so on most full moons the Moon passes a little above or a little below Earth's shadow rather than through it. A lunar eclipse only happens on the smaller number of full moons where the Moon is also close to the place where its tilted orbit crosses Earth's orbital plane.`,
      ],
      example: { problem: `The following month, at full moon, Earth lines up almost exactly between the sun and the Moon, in that order: Sun, Earth, Moon. That month, people across the entire night side of Earth can see the Moon darken, for a much longer stretch than the narrow solar eclipse from the previous example. Name the type of eclipse, and explain why so many more people can see it, and for longer.`, solution: `A lunar eclipse. Earth is the body in the middle (Sun, Earth, Moon), so Earth's shadow falls on the Moon. Because Earth's shadow is large compared with the Moon, and everyone on Earth's night side is looking at the same Moon, the eclipse is visible from the entire night side at once and lasts longer than a solar eclipse's narrow strip.` },
      relatedLoIds: ['m6sci.solar-and-lunar-eclipses'],
    },
  ],
  pointers: [
    { content: `Students often say "A solar eclipse happens when Earth's shadow blocks the sun." — In a solar eclipse, the order is Sun, Moon, Earth -- the Moon is the body in the middle, and it is the Moon's shadow that falls on Earth, blocking sunlight from reaching part of Earth's daytime side. Earth's shadow is never involved in a solar eclipse; Earth's shadow is what causes a lunar eclipse instead, when Earth is the body in the middle.`, kind: 'common-error' },
    { content: `Students often say "It can happen at any full moon." — A solar eclipse can only happen at new moon, because that is the only point in the Moon's orbit where the Moon sits between the sun and Earth. Full moon is when Earth sits between the sun and the Moon, which is the condition for a lunar eclipse, not a solar one. And even at new moon, most months do not produce an eclipse at all, because the Moon's orbit is tilted about 5 degrees from Earth's orbit and usually misses the straight line an eclipse needs.`, kind: 'common-error' },
    { content: `An eclipse happens when the sun, Earth and the Moon line up close to a straight line. The body in the middle decides everything.`, kind: 'tip' },
    { content: `Solar eclipse -- order Sun, Moon, Earth. The Moon is in the middle, its shadow falls on part of Earth's daytime side, and it can only happen at new moon.`, kind: 'tip' },
    { content: `Because the Moon's shadow is small compared with Earth, a solar eclipse is visible only from a narrow strip of Earth's daytime side.`, kind: 'tip' },
    { content: `Lunar eclipse -- order Sun, Earth, Moon. Earth is in the middle, its shadow falls on the Moon, and it can only happen at full moon.`, kind: 'tip' },
    { content: `Because Earth's shadow is large compared with the Moon, a lunar eclipse is visible from the entire night side of Earth at once.`, kind: 'tip' },
    { content: `Eclipses do not happen every new moon or full moon because the Moon's orbit is tilted about 5 degrees from Earth's orbit around the sun, so most months the Moon passes above or below the line an eclipse needs.`, kind: 'tip' },
    { content: `Never look directly at the sun, even during a solar eclipse. Use eclipse glasses built to a safety standard, or watch an indirect projection, and never rely on ordinary sunglasses.`, kind: 'tip' },
  ],
};
