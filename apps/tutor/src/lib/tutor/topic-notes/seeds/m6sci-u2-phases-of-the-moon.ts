/**
 * Grade 6 Science — Unit 2 CED 2.3: Phases of the Moon.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.phases-of-the-moon.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U2_PHASES_OF_THE_MOON: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.phases-of-the-moon.v1',
  course: 'Grade 6 Science',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Phases of the Moon',
  planId: 'evelyn.ms.m6sci.phases-of-the-moon.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.phases-of-the-moon.v1' }],
  theory: [
    { loId: 'm6sci.phases-of-the-moon', content: `HALF THE MOON IS ALWAYS LIT. The Moon makes no light of its own. It shines because sunlight bounces off it. The sun lights up one half of the Moon at all times, in exactly the way the sun lights up one half of Earth at all times -- that is what we call daytime. So the amount of the Moon that is lit never changes. What changes across the month is how much of that lit half we can see from where we are standing.` },
    { loId: 'm6sci.phases-of-the-moon', content: `THE PHASE COMES FROM THE ANGLE. The Moon orbits Earth, and the full cycle of phases -- from one new moon to the next -- takes about 29.5 days. As the Moon goes around, the angle between the sun, the Moon and Earth keeps changing, so a person on Earth sees a different slice of the lit half each night. When the Moon is between Earth and the sun, the lit half is facing away from us and we see almost nothing. That is a NEW MOON. When Earth is between the sun and the Moon, the lit half is facing straight at us and we see all of it. That is a FULL MOON.` },
    { loId: 'm6sci.phases-of-the-moon', content: `THE PHASES IN ORDER -- new moon, waxing crescent, first quarter, waxing gibbous, full moon, waning gibbous, third quarter, waning crescent, and then new moon again. WAXING means the lit part is growing. WANING means the lit part is shrinking. A CRESCENT is when less than half of the disk we see is lit. A GIBBOUS is when more than half of the disk we see is lit, but not all of it. Notice that these words describe our VIEW, not the Moon -- half the Moon is lit the whole time. First quarter and third quarter look like half circles, and they are named for how far the Moon has traveled through its cycle, not for how much of it you can see. That mismatch is worth saying out loud, because it catches people every time.` },
    { loId: 'm6sci.phases-of-the-moon', content: `THE BIG TRAP -- A PHASE IS NOT A SHADOW. Earth does cast a shadow, and that shadow does sometimes fall on the Moon. When it does, we call it a lunar eclipse, and that is the next lesson. But an eclipse is rare and it is over in a few hours, while phases happen every single month and take weeks. WRONG: "The Moon looks like a crescent because Earth is blocking most of the sunlight." CORRECT: "The Moon looks like a crescent because from here we can only see a sliver of its lit half." Here is how you can catch the error yourself. A first quarter moon is high in the sky at sunset, while the sun is going down near the horizon. Earth's shadow always points straight away from the sun, so at that moment the shadow is nowhere near the Moon -- and yet half the Moon is dark. A shadow cannot be the explanation.` },
    { loId: 'm6sci.phases-of-the-moon', content: `THERE IS NO DARK SIDE OF THE MOON. The Moon turns once for every trip it makes around Earth, which means the same side of it always faces us. That side is the NEAR side and the other one is the FAR side. The far side is not dark. It gets sunlight for half of every month, just as the near side does. In fact, at new moon, when we see almost nothing, the far side is the fully lit side. People who say dark side almost always mean far side.` },
    { loId: 'm6sci.phases-of-the-moon', content: `THE MOON IS NOT ONLY A NIGHT OBJECT. A waxing crescent sets soon after the sun does, which is why you catch it low in the west just after sunset. A first quarter moon is already up in the afternoon. A full moon rises around the time the sun sets, so it is up all night. Seeing the Moon in daylight is completely normal, and it is one more sign that the phase depends on the Sun-Moon-Earth angle and not on whether it happens to be dark outside.` },
    { loId: 'm6sci.phases-of-the-moon', kind: 'definition', title: 'phase', content: `the shape of the lit part of the Moon that we can see from Earth at a given time.` },
    { loId: 'm6sci.phases-of-the-moon', kind: 'definition', title: 'new moon', content: `the phase when the Moon is between Earth and the sun, so its lit half faces away from us and almost nothing is visible.` },
    { loId: 'm6sci.phases-of-the-moon', kind: 'definition', title: 'full moon', content: `the phase when Earth is between the sun and the Moon, so the lit half faces us and the whole disk is visible.` },
    { loId: 'm6sci.phases-of-the-moon', kind: 'definition', title: 'waxing', content: 'describing a Moon whose lit part is growing from night to night.' },
    { loId: 'm6sci.phases-of-the-moon', kind: 'definition', title: 'waning', content: 'describing a Moon whose lit part is shrinking from night to night.' },
    { loId: 'm6sci.phases-of-the-moon', kind: 'definition', title: 'gibbous', content: `a phase in which more than half of the disk we see is lit, but it is not yet full.` },
  ],
  methods: [
    {
      title: 'Worked position to phase',
      steps: [
        `Start by finding the lit half, because that never changes. The sun lights the half of the Moon that faces the sun.`,
        `Now place the observer. Earth is between the sun and the Moon, so the observer is looking at the Moon from the same side the sunlight is arriving from.`,
        `That means the lit half of the Moon is pointed straight back at Earth. The observer can see all of it.`,
        'A whole visible disk is a full moon.',
        `Check it against the timing rule. A full moon is directly opposite the sun in the sky, so it rises about when the sun sets and it is up all night. That matches what people actually notice about full moons, so the picture is consistent.`,
        `Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. Geometry says the lit half is pointed at us. Rising and setting times say a full moon is opposite the sun, so it comes up as the sun goes down. Everyday experience says the Moon people see high overhead at midnight is the full one. Three different kinds of evidence, one answer. Second, change one thing about the setup and check that the answer moves the way it should: swing the Moon around to the other side of Earth, so it sits between Earth and the sun, and the same reasoning now gives a new moon. A rule that returned a full moon wherever you put the Moon would be no rule at all.`,
        `One more thing worth saying, so it does not become a new confusion. Earth is between the sun and the Moon at every full moon, but we do not get a lunar eclipse every month. The Moon's orbit is tilted about 5 degrees compared with Earth's orbit around the sun, so the Moon usually passes a little above or a little below Earth's shadow. Eclipses are the next lesson; the point here is that a full moon and an eclipse are not the same event.`,
      ],
      example: { problem: `The Moon reaches the point in its orbit where Earth sits almost exactly between the sun and the Moon. Name the phase and describe what a person on the night side of Earth sees.`, solution: `A full moon. Earth sits between the sun and the Moon, so the lit half of the Moon faces Earth and an observer sees the entire disk, up all night.` },
      relatedLoIds: ['m6sci.phases-of-the-moon'],
    },
    {
      title: 'Worked observation to position',
      steps: [
        `Compare the two shapes in time order. A thin sliver on Tuesday has become a half circle six nights later, so the lit part is growing. Growing means waxing.`,
        `Now name the second shape. A half circle that is growing comes after the waxing crescent and before the waxing gibbous, so it is the first quarter.`,
        `Check both observations against the timing rule instead of trusting the shape alone. A waxing crescent sets soon after the sun, which is exactly why it was low in the west just after sunset. A first quarter moon is already high in the sky when the sun goes down. Both match, so the answer holds up two different ways.`,
        `WRONG: "It looks like half of a circle, so the Moon must be halfway through its cycle." CORRECT: "It looks like half of a circle, but it is a quarter of the way through the cycle, which is why the name is first quarter." The shape you see and the fraction of the orbit completed are two different numbers, and the name follows the orbit.`,
        `WRONG: "The lit part grew because the Moon moved closer to the sun." CORRECT: "The distance from the Moon to the sun barely changes. The angle we are viewing the lit half from is what changed."`,
        `A third clue, of a different kind again, that costs nothing. In the Northern Hemisphere, a waxing moon is lit on its right side and a waning moon is lit on its left. If the student reports the lit part on the right, the waxing answer is confirmed. Note that this rule is about where the observer is standing, not about the Moon -- from the Southern Hemisphere the sides are the other way around. So three different kinds of clue now agree: the shape changing, the sunset positions, and the lit side.`,
        `Last, change one thing and check that the answer moves with it. Suppose the two sightings had come in the other order -- a half circle first, then a thin sliver six nights later -- and the lit part had been on the LEFT. Shrinking gives waning, the left side confirms waning for a Northern Hemisphere observer, and a half circle on the way down is the THIRD quarter, not the first. Same three clues, different input, different answer. That is how you know the clues are doing real work rather than agreeing with whatever you decided first.`,
      ],
      example: { problem: `On Tuesday, a student in the Northern Hemisphere sees a thin crescent moon low in the western sky just after sunset. Six nights later, the Moon looks like a half circle and is high in the southern sky at sunset. Is the Moon waxing or waning, and what is the second phase called?`, solution: `The Moon is waxing, and the second phase is the first quarter. The lit part grew from a sliver to a half circle over six nights, and the sunset positions of the two sightings match a waxing crescent followed by a first quarter moon.` },
      relatedLoIds: ['m6sci.phases-of-the-moon'],
    },
  ],
  pointers: [
    { content: `Students often say "The Moon has phases because Earth's shadow covers part of it." — Earth's shadow does fall on the Moon sometimes, and when it does we call it a lunar eclipse -- an event that happens rarely and is finished in a few hours. Phases happen every month and take weeks. The real cause is the viewing angle: the sun always lights half of the Moon, and as the Moon travels around Earth we see a changing fraction of that lit half. There is a check you can run without any equipment. A first quarter moon is high in the sky at sunset, while the sun is low near the horizon. Earth's shadow always points straight away from the sun, so it is nowhere near the Moon at that moment -- and half the Moon is still dark. The shadow explanation fails right there.`, kind: 'common-error' },
    { content: `Students often say "The part we never see is the dark side of the Moon." — The correct name is the FAR side, not the dark side. The Moon turns once for every trip around Earth, so the same near side always faces us. The far side is hidden from us, but it is not dark: it receives sunlight for half of every month, exactly as the near side does. At new moon, when we can barely see the Moon at all, the far side is the fully lit side. Swap one word and the sentence becomes true: the part we never see is the far side of the Moon.`, kind: 'common-error' },
    { content: `The sun lights half the Moon at all times. The lit amount never changes; our view of it does.`, kind: 'tip' },
    { content: `A phase is set by the angle between the sun, the Moon and Earth as the Moon orbits. The full cycle from one new moon to the next takes about 29.5 days.`, kind: 'tip' },
    { content: `Moon between Earth and sun gives a new moon. Earth between sun and Moon gives a full moon.`, kind: 'tip' },
    { content: `The order is new, waxing crescent, first quarter, waxing gibbous, full, waning gibbous, third quarter, waning crescent.`, kind: 'tip' },
    { content: `Waxing means growing and waning means shrinking. A crescent shows less than half the disk lit; a gibbous shows more than half.`, kind: 'tip' },
    { content: `Phases are not caused by Earth's shadow. Earth's shadow on the Moon is a lunar eclipse, which is rare and lasts hours.`, kind: 'tip' },
    { content: `There is no dark side of the Moon. There is a far side, and it is lit for half of every month.`, kind: 'tip' },
    { content: `The Moon is often visible in daylight, which is another sign that phases depend on angle and not on nightfall.`, kind: 'tip' },
    { content: `**Half the Moon is always lit.** When you see a crescent, the dark part isn't unlighted—it's the half facing away from the sun. You're only seeing a sliver of the lit half.`, kind: 'vocab-note' },
    { content: `Don't confuse **phase** (the shape you see now) with **position in orbit** (how far through the 29.5-day cycle). A first quarter moon looks like half a circle but is only ¼ of the way around its orbit.`, kind: 'common-error' },
    { content: `**A phase is not Earth's shadow.** Proof: a first quarter moon is high in the sky at sunset while the sun is on the horizon. Earth's shadow points away from the sun, so it's nowhere near the Moon—yet half is still dark.`, kind: 'gotcha' },
    { content: `The Moon's **far side is not dark**—it's lit for half the month, just like the near side. At new moon, the far side is fully sunlit. Don't say 'dark side'; say 'far side.'`, kind: 'vocab-note' },
    { content: `The Moon is **often visible in daylight**—waxing crescents in the afternoon, first quarters in the day, full moons at noon. That only works if phases depend on angle, not on nightfall.`, kind: 'tip' },
    { content: `**Waxing = growing; waning = shrinking.** Both describe the lit part getting bigger or smaller night-to-night as you watch the phase sequence. They don't describe the Moon's distance from Earth.`, kind: 'vocab-note' },
    { content: `In the Northern Hemisphere, **waxing moons are lit on the right; waning moons are lit on the left.** Use this as a quick check—but remember it flips if you're south of the equator.`, kind: 'tip' },
    { content: `A **lunar eclipse** (rare, lasts a few hours) is different from phases (happen every month, take weeks). Don't call a phase an eclipse—and Earth's shadow reaching the Moon is only one rare moment, not the reason phases exist.`, kind: 'edge-case' },
  ],
};
