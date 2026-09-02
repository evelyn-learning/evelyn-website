/**
 * Grade 6 Science (Earth & Space Science) — Earth's Place in the Solar
 * System: Classifying the Planets.
 *
 * CONCEPT-LED plan for the m6sci fan-out (NGSS DCI ESS1.B, foundational to
 * MS-ESS1-3). The student sorts the eight planets into two groups purely by
 * what can be observed and described about them: what a planet is made of,
 * whether it has a solid surface, how large it is, whether it has rings, and
 * where it sits relative to the asteroid belt. The lesson never explains WHY
 * those properties line up the way they do -- that explanation belongs to
 * chemistry and physics taught in a later grade. It only teaches the pattern
 * and how to sort a description into one of the two groups.
 *
 * The two traps it is built to kill are (a) assuming a giant planet is just
 * a bigger rocky planet, when composition and surface, not size alone, are
 * what separate the two groups, and (b) assuming rings belong only to
 * Saturn, when all four giant planets have ring systems and Saturn's are
 * simply the brightest and easiest to see.
 *
 * SCOPE GUARD: this plan sorts the eight planets into terrestrial and
 * gas/ice giant groups using properties a student can be told about a
 * planet -- what it is made of, whether it has a solid surface, how large it
 * is, whether it has rings, and its position relative to the asteroid belt.
 * It never explains WHY a planet has those properties. Because the rest of
 * Unit 1 sits very close, the guard states what is deliberately EXCLUDED and
 * also what is deliberately ALLOWED at that edge, and why:
 *   - ROW 1.1 (scale of the solar system) owns building a relative-size and
 *     relative-distance MODEL of the solar system. This plan uses "close to
 *     the sun" and "far from the sun" only as a qualitative position
 *     relative to the asteroid belt; it does not build, compare or teach a
 *     scale model, and no distance appears anywhere in this file as a
 *     kilometer figure, an astronomical-unit figure, or a multiple of
 *     Earth's distance from the sun.
 *   - ROW 1.3 (gravity and orbital motion) owns explaining what keeps a
 *     planet in orbit. Gravity is not mentioned anywhere in this lesson's
 *     authored content (hook, concept, worked examples, try_yourself items,
 *     misconception check or recap); the word "gravity" appears only inside
 *     the `followUps` array, as part of the next row's loId string.
 *   - ROW 1.4 (asteroids, comets and other solar system objects) owns
 *     distinguishing dwarf planets, asteroids, comets and meteors by
 *     composition and orbital path. Pluto is named in three places in this
 *     file -- the "dwarf planet" vocabulary definition, the third
 *     try_yourself item (its stem, its four choices and its expected
 *     answer -- the item's two hints do not name it), and one recap line --
 *     and every appearance makes the same single point: Pluto is a dwarf
 *     planet, so it is not one of the eight planets sorted here. This plan
 *     never explains what makes an object a dwarf planet rather than a
 *     planet, and it does not name the asteroid belt's contents or the
 *     Kuiper Belt anywhere in the lesson body (the phrase "Kuiper Belt"
 *     appears once, right here in this guard, only to say it is absent).
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this plan states WHAT each group is
 *     made of (rock and metal, or gas and ice) as an observed property, and
 *     never explains WHY the inner planets are rocky and the outer ones are
 *     not. No chemistry, no formation history, no particle-level account of
 *     matter, and no computed density value appears anywhere in this file.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every planet
 * description in this file is written out in words, and every item is
 * solvable from the text printed inside it. Never write "see the diagram
 * above", and never assume the student has a model, a poster or a textbook
 * picture of the solar system in front of them.
 *
 * NOTE ON prerequisites/followUps: this row's chain is 1.1 -> 1.2 -> 1.3.
 * By the time this file is registered, all three rows exist in the batch, so
 * both arrays carry the real neighbor loIds rather than being left empty.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U1_CLASSIFYING_THE_PLANETS: LessonPlan = {
  id: 'evelyn.ms.m6sci.classifying-the-planets.v1',
  title: 'Classifying the Planets',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.classifying-the-planets',
      standard: 'M6SCI-1.2',
      description:
        'Sort the eight planets into terrestrial (rocky, small, close) and gas/ice giant (large, distant) groups by their observed properties (DCI ESS1.B; no MS-ESS1 performance expectation names planet classification directly, so it is cited as foundational to MS-ESS1-3).',
    },
  ],
  prerequisites: ['m6sci.scale-of-the-solar-system'],
  followUps: ['m6sci.gravity-and-orbital-motion'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from something the student already half-knows about the planets and turn it into a sorting question.',
      script:
        'Name the planets fast, in any order, and Mercury and Jupiter usually show up in the same breath, like they belong to the same kind of thing. They do not. If you could somehow stand on Mercury, you would be standing on solid rock. If you tried to stand on Jupiter, there would be nothing solid to stand on at any depth -- just deeper and deeper gas. Eight planets, and they clearly are not all one kind of place. Today we sort them into the two groups they actually fall into, using only things you can be told about a planet: what it is made of, whether it has solid ground, how big it is, whether it has rings. By the end, if someone hands you a description of a planet you have never heard of, you will be able to say which group it belongs to.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-groups',
      kind: 'concept',
      goal: 'Build the terrestrial / gas-ice-giant pattern from observed properties, and kill the size-alone trap and the rings-mean-Saturn trap before they are met.',
      keyIdeas: [
        'TWO GROUPS, SORTED BY WHAT YOU CAN OBSERVE. The eight planets sort into two groups: TERRESTRIAL planets and GAS/ICE GIANT planets. You sort a planet by checking what it is made of, whether it has a solid surface, how big it is, whether it has rings, and where it sits compared with the asteroid belt. This lesson only sorts by those properties. It does not explain why a planet ends up with them -- that is a question for a later grade.',
        'THE FOUR TERRESTRIAL PLANETS -- Mercury, Venus, Earth and Mars. They are small, made mostly of rock and metal, and have a solid surface a spacecraft could land on. They orbit close to the sun, before the asteroid belt. None of them has a ring system, and each one has no moon or only a small number of moons.',
        'THE FOUR GIANT PLANETS -- Jupiter, Saturn, Uranus and Neptune. They are much larger than any terrestrial planet, made mostly of gas and ice, and have no solid surface anywhere -- there is no ground to land on, even deep inside one. They orbit far beyond the asteroid belt, and every one of them has a ring system, though only Saturn\'s is bright enough to be easy to see. Each one has many more moons than any terrestrial planet.',
        'THE ASTEROID BELT MARKS THE SPLIT. In order outward from the sun the planets run: Mercury, Venus, Earth, Mars, then the asteroid belt, then Jupiter, Saturn, Uranus, Neptune. Every planet on the inner side of that belt is terrestrial, and every planet on the outer side is a giant. You do not need an exact distance in kilometers to use this -- knowing which side of the asteroid belt a planet is on is enough to sort it by position. That pattern is worth noticing, and it is a fact you can use; it is not something this lesson explains.',
        'THE TRAP -- SIZE ALONE IS NOT THE SORT. A planet is not a giant just because it happens to be large, and it is not terrestrial just because it happens to be small. WRONG: "It is a giant because it is the biggest kind of planet." CORRECT: "A planet only counts as a giant if it is also made mostly of gas or ice and has no solid surface -- being large is part of the pattern, not the whole rule." Composition and surface are what actually decide the group; size, position and rings line up with that split, but they do not replace it.',
      ],
      vocabulary: [
        { term: 'terrestrial planet', definition: 'a planet that is small, made mostly of rock and metal, and has a solid surface a spacecraft could land on.' },
        { term: 'gas/ice giant', definition: 'a planet that is much larger than a terrestrial planet, made mostly of gas and ice, and has no solid surface anywhere.' },
        { term: 'asteroid belt', definition: 'the region of the solar system that marks where the four terrestrial planets end and the four giant planets begin.' },
        { term: 'ring system', definition: 'a flat disk of orbiting material circling a planet; all four giant planets have one, though only Saturn\'s is bright enough to see easily.' },
        { term: 'dwarf planet', definition: 'an object that orbits the sun but is not counted among the eight planets, such as Pluto.' },
      ],
      suggestedTools: ['show_table', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sort-a-terrestrial',
      kind: 'worked_example',
      problem:
        'A newly described planet is reported to be small, made mostly of rock and metal, to have a solid surface, no ring system, and to orbit closer to the sun than the asteroid belt. Sort it into a group.',
      steps: [
        'List what the report actually says: small, rock and metal, solid surface, no rings, orbits before the asteroid belt. Five separate observed properties.',
        'Compare those properties with the terrestrial pattern. Mercury, Venus, Earth and Mars are all small, made mostly of rock and metal, have a solid surface, have no ring system, and orbit before the asteroid belt. Every property in the report matches.',
        'Check the giant pattern too, to be sure it does not also fit. Giant planets are much larger, made mostly of gas and ice, have no solid surface, commonly show a ring system, and orbit beyond the asteroid belt. None of that matches the report.',
        'WRONG: "It might still turn out to be a giant, since we do not know exactly how far it is from the sun in kilometers." CORRECT: "The report already places it before the asteroid belt, and that -- together with its rocky, solid-surfaced, small, ringless description -- is enough to sort it. No distance measurement is needed."',
        'Conclusion: the planet is terrestrial.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. Composition says rock and metal. Structure says a solid surface. Position says before the asteroid belt. Three different kinds of evidence, one answer. Second, change one thing about the report and check that the answer moves the way it should: if the report instead described a planet much larger than Earth, made mostly of gas, with no solid surface and a ring system, every one of those three clues would flip at once, and the sorting would flip to giant.',
      ],
      answer:
        'Terrestrial. The planet is small, rocky, solid-surfaced, ringless and orbits before the asteroid belt, which matches Mercury, Venus, Earth and Mars and matches none of the giant-planet properties.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sort-a-giant',
      kind: 'worked_example',
      problem:
        'A second planet is reported to have no solid surface anywhere, to be much larger than any of the four inner planets, to have a ring system too faint to see without a telescope, and to orbit far beyond the asteroid belt. Sort it into a group, and say which planets it could be.',
      steps: [
        'List the report: no solid surface, much larger than the inner planets, a faint ring system, orbits beyond the asteroid belt.',
        'Compare with the giant pattern. Jupiter, Saturn, Uranus and Neptune are all much larger than the inner planets, are made mostly of gas and ice with no solid surface anywhere, orbit beyond the asteroid belt, and every one of them has a ring system. All four properties match.',
        'Check the terrestrial pattern to rule it out. Terrestrial planets are small, have a solid surface, orbit before the asteroid belt, and have no ring system. None of that matches.',
        'Conclusion so far: this is a giant planet.',
        'WRONG: "It must be Saturn, since Saturn is the planet everyone pictures with rings." CORRECT: "All four giant planets have ring systems, so a ring alone never points to Saturn specifically -- and a FAINT ring actually points away from Saturn, since Saturn\'s rings are the brightest and easiest to see of the four."',
        'So the report narrows the answer to Jupiter, Uranus or Neptune -- the three giants whose rings are not the bright, easy-to-see kind -- and rules out Saturn specifically, even though all four are giants.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree, at the group level: composition says gas and ice with no solid surface, size says much larger than the inner planets, position says beyond the asteroid belt. Three different kinds of evidence, one group. Second, change one thing and check that the answer moves the way it should: if the report instead said the rings were the brightest and easiest to see of any planet, that single detail would point specifically to Saturn, while the other three clues would still only tell you giant, not which one. The group answer holds steady while the specific-planet answer moves, which shows the ring-brightness clue is doing separate work from the other three.',
      ],
      answer:
        'A giant planet -- specifically Jupiter, Uranus or Neptune, since the ring system described is faint and Saturn\'s rings are the brightest and easiest to see of the four.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-solid-surface-planet',
      kind: 'try_yourself',
      problem:
        'A planet is reported to have a solid, rocky surface a spacecraft could land on, to be one of the four smallest planets, and to orbit closer to the sun than the asteroid belt. Which group does it belong to?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A dwarf planet, because the smallest planets are always classified as dwarf planets.' },
        { id: 'b', text: 'It cannot be sorted this way. Classifying a planet requires knowing its exact distance from the sun in kilometers.' },
        { id: 'c', text: 'A gas/ice giant, because giant planets are built from many small rocky pieces packed tightly together.' },
        { id: 'd', text: 'Terrestrial, because it is small, rocky, has a solid surface, and orbits before the asteroid belt.', correct: true },
      ],
      expectedAnswer: 'Terrestrial, because it is small, rocky, has a solid surface, and orbits before the asteroid belt.',
      hints: [
        'Being small does not automatically make something a dwarf planet -- Mercury and Mars are both small and both count among the eight planets. Check what the planet is made of and whether it has solid ground instead.',
        'Every property in the description -- size, surface, and position relative to the asteroid belt -- points the same direction, and you do not need an exact distance in kilometers to use them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-giant-group-property',
      kind: 'try_yourself',
      problem: 'Which statement is true of Jupiter, Saturn, Uranus and Neptune as a group?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They are much larger than the four inner planets, have no solid surface anywhere, and orbit beyond the asteroid belt.', correct: true },
        { id: 'b', text: 'They are smaller than Earth, and their solid ground is simply hidden beneath a thick layer of clouds.' },
        { id: 'c', text: 'They orbit closer to the sun than Mercury, Venus, Earth and Mars, on the near side of the asteroid belt.' },
        { id: 'd', text: 'They are rocky like the four terrestrial planets, just larger versions of the same kind of planet.' },
      ],
      expectedAnswer: 'They are much larger than the four inner planets, have no solid surface anywhere, and orbit beyond the asteroid belt.',
      hints: [
        'Compare each choice against the two things every giant planet shares: what it is made of, and where it sits relative to the asteroid belt.',
        'Size, composition and position all move together for these four planets. Check whether a choice gets even one of those three backward.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pluto-is-not-a-planet',
      kind: 'try_yourself',
      problem:
        'A student says Pluto is the ninth planet and asks whether it belongs with the four terrestrial planets or the four giant planets. What is the best response?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Pluto belongs with the terrestrial planets, because it has a solid, icy surface.' },
        { id: 'b', text: 'Pluto is not one of the eight planets. It is a dwarf planet, so it does not belong in either group.', correct: true },
        { id: 'c', text: 'Pluto belongs with the giant planets, because it is farther from the sun than any of the eight planets.' },
        { id: 'd', text: 'Pluto could belong with either group, since it is smaller than the giants but farther out than the terrestrial planets.' },
      ],
      expectedAnswer: 'Pluto is not one of the eight planets. It is a dwarf planet, so it does not belong in either group.',
      hints: [
        'Before sorting an object into one of the two groups, check whether it is actually one of the eight planets this lesson sorts.',
        'An object can share a property with one group -- a solid surface, a distant orbit -- without being counted among the eight planets at all. Membership comes first, then sorting.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bigger-rocky-and-saturn-only',
      kind: 'misconception_check',
      question:
        'A student writes: "The giant planets like Jupiter and Saturn are just bigger, rockier versions of Earth, and only Saturn has rings around it." Two separate things are wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'The giant planets are just bigger, rockier versions of Earth.',
          misconception:
            'Assuming that increasing size simply scales up the terrestrial pattern, treating size as the whole rule instead of one property among several.',
          correctsTo:
            'The four giant planets -- Jupiter, Saturn, Uranus and Neptune -- are made mostly of gas and ice, not rock, and none of them has a solid surface a spacecraft could land on, even deep inside. Being much larger than Earth does not make a planet more like Earth; it puts it in a different group, sorted by what it is made of and where it orbits, not by size alone.',
        },
        {
          answer: 'Only Saturn has rings around it.',
          misconception:
            'Generalizing from the one ring system that is bright enough to see easily, and assuming the others simply do not exist.',
          correctsTo:
            'All four giant planets have ring systems. Saturn\'s rings are simply the widest and brightest, which is why photographs of Saturn are what most people picture when they hear the word rings. Jupiter, Uranus and Neptune all have ring systems too, just fainter ones.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The eight planets sort into two groups: terrestrial and gas/ice giant.',
        'Terrestrial: Mercury, Venus, Earth, Mars -- small, rocky, solid surface, no rings, orbit before the asteroid belt.',
        'Gas/ice giant: Jupiter, Saturn, Uranus, Neptune -- much larger, made of gas and ice, no solid surface anywhere, orbit beyond the asteroid belt.',
        'All four giant planets have ring systems. Saturn\'s are simply the brightest and easiest to see.',
        'Size alone does not decide the group. A planet counts as a giant only if it is also made mostly of gas or ice with no solid surface.',
        'This lesson sorts planets by what can be observed about them, not by why they ended up that way.',
        'Pluto is a dwarf planet, not one of the eight planets sorted here.',
        'No exact distance in kilometers is needed to sort a planet -- its position relative to the asteroid belt is enough.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Classifying the Planets' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
