/**
 * Grade 6 Science (Earth & Space Science) — The Earth-Sun-Moon System: Phases of the Moon.
 *
 * CONCEPT-LED exemplar for the m6sci fan-out (NGSS MS-ESS1-1). The student
 * has no procedure to lean on here: the whole lesson is building one
 * three-dimensional picture -- a sun that lights half the Moon at all times,
 * a Moon that goes around Earth, and an observer standing on Earth who sees a
 * different fraction of that lit half depending on the angle. Everything in
 * the plan is aimed at making the picture solid enough that the student can
 * run it forward (position to phase) and backward (observation to position).
 *
 * The two traps it is built to kill are (a) explaining phases by Earth's
 * shadow, which is the single most common middle-school error on this topic,
 * and (b) the "dark side of the Moon", which is the far side and is lit for
 * half of every month.
 *
 * SCOPE GUARD: this plan explains the monthly phase cycle from the changing
 * Sun-Moon-Earth angle, and nothing else. Because row 2.4 sits very close,
 * the guard states what is deliberately EXCLUDED and also what is
 * deliberately ALLOWED at that edge, and why:
 *   - ECLIPSES are row 2.4. The lunar eclipse IS named in this file -- in the
 *     concept segment, in a worked-example step, in a try_yourself distractor
 *     and hint, and in the misconception check -- and everywhere it appears it
 *     is there for one purpose only: to establish that a phase is NOT a
 *     shadow, which is the error this row exists to kill. The plan also states
 *     in a single sentence that the Moon's orbit is tilted about 5 degrees, so
 *     that a student does not leave believing every full moon ought to produce
 *     an eclipse. It does NOT teach solar-versus-lunar eclipse geometry, umbra
 *     and penumbra, or why an eclipse is visible from only part of Earth.
 *     Those belong to row 2.4.
 *   - GRAVITY holding the Moon in its orbit is row 1.3 and is not mentioned
 *     anywhere in this file.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: the only claim this plan makes about
 *     the NATURE of light is that the Moon shines by reflected sunlight, and it
 *     is stated as a bare fact with no account of why. Everything else about
 *     illumination in this file is geometry -- which half of the Moon faces the
 *     sun, and which half faces us. Light as a wave, ray diagrams, angles of
 *     reflection, wavelength and the electromagnetic spectrum appear nowhere,
 *     and no force, distance or brightness is calculated.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every position
 * in this file is written out in words, and every item is solvable from the
 * text printed inside it. Never write "see the diagram above", and never
 * assume the student has a flashlight, a ball, a globe, or a clear sky
 * tonight.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 2.2 -> 2.3 -> 2.4.
 * Rows 2.2 and 2.4 are now registered alongside this one, so the chain is
 * wired: prerequisites points at row 2.2 (`earths-revolution-and-the-seasons`)
 * and followUps points at row 2.4 (`solar-and-lunar-eclipses`).
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U2_PHASES_OF_THE_MOON: LessonPlan = {
  id: 'evelyn.ms.m6sci.phases-of-the-moon.v1',
  title: 'Phases of the Moon',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.phases-of-the-moon',
      standard: 'M6SCI-2.3',
      description:
        'Use a model of the Moon orbiting Earth to explain why the illuminated shape of the Moon appears to change over about 29.5 days, naming the phases in order and accounting for the change by the Sun-Moon-Earth angle rather than by Earth\'s shadow (NGSS MS-ESS1-1).',
    },
  ],
  prerequisites: ['m6sci.earths-revolution-and-the-seasons'],
  followUps: ['m6sci.solar-and-lunar-eclipses'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from something the student has already seen and does not have an explanation for.',
      script:
        'You have almost certainly seen the Moon in the middle of the afternoon. Pale, thin, sitting there in a blue sky like somebody forgot to take it down. That alone should be strange, because most people describe the Moon as a night thing. Here is something stranger. Take a photo of the Moon tonight and another one a week from tonight, and it will be a different shape. Not a little different. A sliver can turn into a half circle. Nothing has been added to the Moon and nothing has been taken away from it. The Moon has not grown and it has not been eaten. So what actually changed? Today we build the picture that answers that, and by the end you will be able to look at the Moon and say where it is sitting in its orbit.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-phases',
      kind: 'concept',
      goal: 'Build the lit-half model, name the eight phases in order, and kill the shadow error and the dark-side error.',
      keyIdeas: [
        'HALF THE MOON IS ALWAYS LIT. The Moon makes no light of its own. It shines because sunlight bounces off it. The sun lights up one half of the Moon at all times, in exactly the way the sun lights up one half of Earth at all times -- that is what we call daytime. So the amount of the Moon that is lit never changes. What changes across the month is how much of that lit half we can see from where we are standing.',
        'THE PHASE COMES FROM THE ANGLE. The Moon orbits Earth, and the full cycle of phases -- from one new moon to the next -- takes about 29.5 days. As the Moon goes around, the angle between the sun, the Moon and Earth keeps changing, so a person on Earth sees a different slice of the lit half each night. When the Moon is between Earth and the sun, the lit half is facing away from us and we see almost nothing. That is a NEW MOON. When Earth is between the sun and the Moon, the lit half is facing straight at us and we see all of it. That is a FULL MOON.',
        'THE PHASES IN ORDER -- new moon, waxing crescent, first quarter, waxing gibbous, full moon, waning gibbous, third quarter, waning crescent, and then new moon again. WAXING means the lit part is growing. WANING means the lit part is shrinking. A CRESCENT is when less than half of the disk we see is lit. A GIBBOUS is when more than half of the disk we see is lit, but not all of it. Notice that these words describe our VIEW, not the Moon -- half the Moon is lit the whole time. First quarter and third quarter look like half circles, and they are named for how far the Moon has traveled through its cycle, not for how much of it you can see. That mismatch is worth saying out loud, because it catches people every time.',
        'THE BIG TRAP -- A PHASE IS NOT A SHADOW. Earth does cast a shadow, and that shadow does sometimes fall on the Moon. When it does, we call it a lunar eclipse, and that is the next lesson. But an eclipse is rare and it is over in a few hours, while phases happen every single month and take weeks. WRONG: "The Moon looks like a crescent because Earth is blocking most of the sunlight." CORRECT: "The Moon looks like a crescent because from here we can only see a sliver of its lit half." Here is how you can catch the error yourself. A first quarter moon is high in the sky at sunset, while the sun is going down near the horizon. Earth\'s shadow always points straight away from the sun, so at that moment the shadow is nowhere near the Moon -- and yet half the Moon is dark. A shadow cannot be the explanation.',
        'THERE IS NO DARK SIDE OF THE MOON. The Moon turns once for every trip it makes around Earth, which means the same side of it always faces us. That side is the NEAR side and the other one is the FAR side. The far side is not dark. It gets sunlight for half of every month, just as the near side does. In fact, at new moon, when we see almost nothing, the far side is the fully lit side. People who say dark side almost always mean far side.',
        'THE MOON IS NOT ONLY A NIGHT OBJECT. A waxing crescent sets soon after the sun does, which is why you catch it low in the west just after sunset. A first quarter moon is already up in the afternoon. A full moon rises around the time the sun sets, so it is up all night. Seeing the Moon in daylight is completely normal, and it is one more sign that the phase depends on the Sun-Moon-Earth angle and not on whether it happens to be dark outside.',
      ],
      vocabulary: [
        { term: 'phase', definition: 'the shape of the lit part of the Moon that we can see from Earth at a given time.' },
        { term: 'new moon', definition: 'the phase when the Moon is between Earth and the sun, so its lit half faces away from us and almost nothing is visible.' },
        { term: 'full moon', definition: 'the phase when Earth is between the sun and the Moon, so the lit half faces us and the whole disk is visible.' },
        { term: 'waxing', definition: 'describing a Moon whose lit part is growing from night to night.' },
        { term: 'waning', definition: 'describing a Moon whose lit part is shrinking from night to night.' },
        { term: 'gibbous', definition: 'a phase in which more than half of the disk we see is lit, but it is not yet full.' },
      ],
      suggestedTools: ['show_diagram', 'show_cycle_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-position-to-phase',
      kind: 'worked_example',
      problem:
        'The Moon reaches the point in its orbit where Earth sits almost exactly between the sun and the Moon. Name the phase and describe what a person on the night side of Earth sees.',
      steps: [
        'Start by finding the lit half, because that never changes. The sun lights the half of the Moon that faces the sun.',
        'Now place the observer. Earth is between the sun and the Moon, so the observer is looking at the Moon from the same side the sunlight is arriving from.',
        'That means the lit half of the Moon is pointed straight back at Earth. The observer can see all of it.',
        'A whole visible disk is a full moon.',
        'Check it against the timing rule. A full moon is directly opposite the sun in the sky, so it rises about when the sun sets and it is up all night. That matches what people actually notice about full moons, so the picture is consistent.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. Geometry says the lit half is pointed at us. Rising and setting times say a full moon is opposite the sun, so it comes up as the sun goes down. Everyday experience says the Moon people see high overhead at midnight is the full one. Three different kinds of evidence, one answer. Second, change one thing about the setup and check that the answer moves the way it should: swing the Moon around to the other side of Earth, so it sits between Earth and the sun, and the same reasoning now gives a new moon. A rule that returned a full moon wherever you put the Moon would be no rule at all.',
        'One more thing worth saying, so it does not become a new confusion. Earth is between the sun and the Moon at every full moon, but we do not get a lunar eclipse every month. The Moon\'s orbit is tilted about 5 degrees compared with Earth\'s orbit around the sun, so the Moon usually passes a little above or a little below Earth\'s shadow. Eclipses are the next lesson; the point here is that a full moon and an eclipse are not the same event.',
      ],
      answer:
        'A full moon. Earth sits between the sun and the Moon, so the lit half of the Moon faces Earth and an observer sees the entire disk, up all night.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-observation-to-position',
      kind: 'worked_example',
      problem:
        'On Tuesday, a student in the Northern Hemisphere sees a thin crescent moon low in the western sky just after sunset. Six nights later, the Moon looks like a half circle and is high in the southern sky at sunset. Is the Moon waxing or waning, and what is the second phase called?',
      steps: [
        'Compare the two shapes in time order. A thin sliver on Tuesday has become a half circle six nights later, so the lit part is growing. Growing means waxing.',
        'Now name the second shape. A half circle that is growing comes after the waxing crescent and before the waxing gibbous, so it is the first quarter.',
        'Check both observations against the timing rule instead of trusting the shape alone. A waxing crescent sets soon after the sun, which is exactly why it was low in the west just after sunset. A first quarter moon is already high in the sky when the sun goes down. Both match, so the answer holds up two different ways.',
        'WRONG: "It looks like half of a circle, so the Moon must be halfway through its cycle." CORRECT: "It looks like half of a circle, but it is a quarter of the way through the cycle, which is why the name is first quarter." The shape you see and the fraction of the orbit completed are two different numbers, and the name follows the orbit.',
        'WRONG: "The lit part grew because the Moon moved closer to the sun." CORRECT: "The distance from the Moon to the sun barely changes. The angle we are viewing the lit half from is what changed."',
        'A third clue, of a different kind again, that costs nothing. In the Northern Hemisphere, a waxing moon is lit on its right side and a waning moon is lit on its left. If the student reports the lit part on the right, the waxing answer is confirmed. Note that this rule is about where the observer is standing, not about the Moon -- from the Southern Hemisphere the sides are the other way around. So three different kinds of clue now agree: the shape changing, the sunset positions, and the lit side.',
        'Last, change one thing and check that the answer moves with it. Suppose the two sightings had come in the other order -- a half circle first, then a thin sliver six nights later -- and the lit part had been on the LEFT. Shrinking gives waning, the left side confirms waning for a Northern Hemisphere observer, and a half circle on the way down is the THIRD quarter, not the first. Same three clues, different input, different answer. That is how you know the clues are doing real work rather than agreeing with whatever you decided first.',
      ],
      answer:
        'The Moon is waxing, and the second phase is the first quarter. The lit part grew from a sliver to a half circle over six nights, and the sunset positions of the two sightings match a waxing crescent followed by a first quarter moon.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-why-the-shape-changes',
      kind: 'try_yourself',
      problem: 'Why does the Moon appear to change shape over the course of a month?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Earth\'s shadow falls across the Moon each night, and it covers a different amount as the month goes on.' },
        { id: 'b', text: 'The angle between the sun, Earth and the Moon changes, so we see a different amount of the always-lit half.', correct: true },
        { id: 'c', text: 'The Moon moves in and out of the sunlight as it orbits, so a different amount of it is lit each night.' },
        { id: 'd', text: 'Clouds and Earth\'s atmosphere block part of the Moon from view, and they block a different amount each night.' },
      ],
      expectedAnswer: 'The angle between the sun, Earth and the Moon changes, so we see a different amount of the always-lit half.',
      hints: [
        'Start with the part that never changes. How much of the Moon is lit by the sun at any moment, and does that amount go up and down during the month?',
        'If the lit amount is always the same, then the thing that changes has to be on our end. What changes about our view as the Moon travels around Earth?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-position-to-phase',
      kind: 'try_yourself',
      problem: 'The Moon reaches the point in its orbit where it sits between Earth and the sun. What do people on Earth see?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A full moon, because that is when the Moon is closest to the sun.' },
        { id: 'b', text: 'A gibbous moon, because more than half of the Moon is lit by the sun.' },
        { id: 'c', text: 'Almost nothing, because the lit half of the Moon faces away from Earth.', correct: true },
        { id: 'd', text: 'A lunar eclipse, because the Moon has moved into Earth\'s shadow.' },
      ],
      expectedAnswer: 'Almost nothing, because the lit half of the Moon faces away from Earth.',
      hints: [
        'Put the three objects in a line in your head, in the order given: sun, then Moon, then Earth. Which side of the Moon is the sunlight hitting?',
        'The lit side is the side facing the sun. If Earth is on the other side of the Moon from the sun, is the lit side pointed toward us or away from us?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-observation-to-phase',
      kind: 'try_yourself',
      problem:
        'For ten nights in a row, a student at home in Ohio, in the Northern Hemisphere, notices that the lit part of the Moon is getting smaller, and that the lit part is on the left side. What is the Moon doing?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Waxing, moving from new moon toward full moon.' },
        { id: 'b', text: 'Passing through Earth\'s shadow, which is why the lit part keeps shrinking.' },
        { id: 'c', text: 'Moving farther from Earth, so less of it can be seen.' },
        { id: 'd', text: 'Waning, moving from full moon toward new moon.', correct: true },
      ],
      expectedAnswer: 'Waning, moving from full moon toward new moon.',
      hints: [
        'She has two separate clues: the direction the lit part is changing, and which side it is on. Take the first one on its own. What is the word for a lit part that shrinks?',
        'Now use the second clue as a check. For an observer in the Northern Hemisphere, which side is lit while the Moon is shrinking? And ask yourself how long an eclipse lasts compared with ten nights.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-shadow-and-dark-side',
      kind: 'misconception_check',
      question:
        'A student writes: "The Moon has phases because Earth\'s shadow covers part of it, and the part we never see is the dark side of the Moon." Two different things are wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'The Moon has phases because Earth\'s shadow covers part of it.',
          misconception:
            'Explaining a change in a lit shape with the only shadow the student can think of, because a shadow is the everyday reason a lit thing goes dark.',
          correctsTo:
            'Earth\'s shadow does fall on the Moon sometimes, and when it does we call it a lunar eclipse -- an event that happens rarely and is finished in a few hours. Phases happen every month and take weeks. The real cause is the viewing angle: the sun always lights half of the Moon, and as the Moon travels around Earth we see a changing fraction of that lit half. There is a check you can run without any equipment. A first quarter moon is high in the sky at sunset, while the sun is low near the horizon. Earth\'s shadow always points straight away from the sun, so it is nowhere near the Moon at that moment -- and half the Moon is still dark. The shadow explanation fails right there.',
        },
        {
          answer: 'The part we never see is the dark side of the Moon.',
          misconception:
            'Hearing the common phrase dark side and assuming that never seen and never lit mean the same thing.',
          correctsTo:
            'The correct name is the FAR side, not the dark side. The Moon turns once for every trip around Earth, so the same near side always faces us. The far side is hidden from us, but it is not dark: it receives sunlight for half of every month, exactly as the near side does. At new moon, when we can barely see the Moon at all, the far side is the fully lit side. Swap one word and the sentence becomes true: the part we never see is the far side of the Moon.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The sun lights half the Moon at all times. The lit amount never changes; our view of it does.',
        'A phase is set by the angle between the sun, the Moon and Earth as the Moon orbits. The full cycle from one new moon to the next takes about 29.5 days.',
        'Moon between Earth and sun gives a new moon. Earth between sun and Moon gives a full moon.',
        'The order is new, waxing crescent, first quarter, waxing gibbous, full, waning gibbous, third quarter, waning crescent.',
        'Waxing means growing and waning means shrinking. A crescent shows less than half the disk lit; a gibbous shows more than half.',
        'Phases are not caused by Earth\'s shadow. Earth\'s shadow on the Moon is a lunar eclipse, which is rare and lasts hours.',
        'There is no dark side of the Moon. There is a far side, and it is lit for half of every month.',
        'The Moon is often visible in daylight, which is another sign that phases depend on angle and not on nightfall.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Phases of the Moon' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
