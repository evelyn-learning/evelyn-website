/**
 * Grade 6 Science (Earth & Space Science) — Earth's Place in the Solar
 * System: Asteroids, Comets & Other Solar System Objects.
 *
 * CONCEPT-LED row for the m6sci fan-out (NGSS MS-ESS1-3, shared with row
 * 1.1). Row 1.1 compares the SCALE of solar-system objects; this row
 * inventories the OTHER object TYPES beyond the eight planets -- asteroids,
 * comets, dwarf planets, and the meteoroid/meteor/meteorite family -- sorting
 * them by composition and by the shape of their orbit, and locating the two
 * belts (asteroid belt, Kuiper Belt) that most of them call home.
 *
 * The two traps it is built to kill are (a) the meteoroid/meteor/meteorite
 * mix-up, where the exact same fragment gets three different names depending
 * on where it currently is, and (b) treating a comet's tail as a wake caused
 * by motion rather than as heat from the sun turning surface ice into gas
 * that always streams away from the sun, regardless of which way the comet
 * is traveling.
 *
 * SCOPE GUARD: this plan sorts solar-system objects OTHER than the eight
 * planets into asteroid / comet / dwarf planet / meteoroid-meteor-meteorite
 * by composition and orbit shape, and locates the asteroid belt and the
 * Kuiper Belt. Because three Unit 1 neighbors sit very close, the guard
 * states what is deliberately EXCLUDED and also what is deliberately
 * ALLOWED at that edge, and why:
 *   - ROW 1.1 (scale of the solar system) owns relative-size and
 *     relative-distance modeling. This plan never compares how big one
 *     object is next to another or how far apart two objects sit in
 *     scaled-down terms; distances appear only as plain, unscaled location
 *     statements ("between the orbits of Mars and Jupiter", "far beyond
 *     Neptune's orbit"), never as a scale comparison or a ratio.
 *   - ROW 1.2 (classifying the planets) owns terrestrial-versus-giant
 *     classification of the eight actual planets. No planet is classified
 *     in this file, and no planet is ever the answer to an item; wherever
 *     "planet" or "full planet" appears, it is there only as the contrast
 *     case for what a dwarf planet is missing -- having cleared its own
 *     orbital neighborhood of debris -- never as an object being sorted
 *     into terrestrial or giant.
 *   - ROW 1.3 (gravity and orbital motion) owns the mechanism that keeps
 *     any of these objects in orbit at all. This plan never uses gravity in
 *     that sense and never explains WHY an object follows its orbit; orbits
 *     are sorted only by their observed SHAPE (roughly steady and
 *     near-circular for an asteroid, long and stretched-out for a comet).
 *     The word "gravity" does appear, but only in the different, self-
 *     contained sense the dwarf-planet/asteroid roundness test needs -- an
 *     object's OWN gravity being strong enough (or not) to pull it into a
 *     sphere. That is a shape-and-composition fact used for sorting, not a
 *     claim about what keeps an object orbiting, and row 1.3 is never
 *     cited or relied on here.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: the only claim this plan makes
 *     about a comet's tail is that heat from the sun turns some of the
 *     comet's surface ice into gas, and that gas and dust then stream away
 *     from the nucleus and always point away from the sun. That is stated
 *     as an observed, descriptive fact with no account of WHY it points
 *     away from the sun -- solar wind, radiation pressure, the physics of a
 *     phase change, and the particle model of matter appear nowhere in this
 *     file, matching the brief's instruction to describe what is observed
 *     rather than the mechanism.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope
 *     for this row, and none appears.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * position, orbit shape and location in this file is written out in words,
 * and every item is solvable from the text printed inside it. Never write
 * "see the diagram above", and never assume the student has a model,
 * telescope, or a night sky in front of them right now.
 *
 * NOTE ON DEFINITIONS THAT VARY BY SOURCE: sources describe the middle
 * stage of the meteoroid/meteor/meteorite chain slightly differently --
 * some describe the object itself as a meteor while it is glowing in the
 * atmosphere, others define a meteor more narrowly as just the streak of
 * light the burning produces. This file states both readings rather than
 * asserting one, because the location rule for sorting the three names
 * (space, atmosphere, ground) holds either way.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U1_ASTEROIDS_COMETS_AND_OTHER_SOLAR_SYSTEM_OBJECTS: LessonPlan = {
  id: 'evelyn.ms.m6sci.asteroids-comets-and-other-solar-system-objects.v1',
  title: 'Asteroids, Comets & Other Solar System Objects',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.asteroids-comets-and-other-solar-system-objects',
      standard: 'M6SCI-1.4',
      description:
        'Distinguish asteroids, comets, dwarf planets, and meteors by composition and orbital path, and locate the asteroid belt and Kuiper Belt on a solar-system model, sharing MS-ESS1-3 with the course\'s scale-of-the-solar-system row: that lesson compares scale, this one inventories object types (NGSS MS-ESS1-3).',
    },
  ],
  prerequisites: ['m6sci.gravity-and-orbital-motion'],
  followUps: ['m6sci.earths-rotation-day-and-night'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from a shooting star, and use it to set up the location-based naming trap the whole lesson is built to solve.',
      script:
        'You have probably seen a "shooting star" streak across the night sky, gone in under a second. Here is the surprising part -- it was not a star at all, and it was not falling out of the sky the way that name suggests. Real stars are enormous, distant suns, nowhere close to falling toward Earth. What you actually saw was a tiny fragment of rock or dust, usually no bigger than a grain of sand, burning up from friction as it slammed into Earth\'s atmosphere at incredible speed. That one fragment has three completely different names depending on exactly where it is at the moment you are talking about it, and mixing those names up is one of the most common mistakes people make about it. Beyond the eight planets, the solar system is full of smaller objects like this one -- some rocky, some icy, some round, some lumpy, some following a steady path and some swinging wildly close to the sun and back out again. Today we sort them out.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-solar-system-objects',
      kind: 'concept',
      goal: 'Install composition and orbit shape as the two sorting tools, name the four categories, and kill the meteoroid/meteor/meteorite mix-up and the tail-as-motion-wake error.',
      keyIdeas: [
        'ASTEROIDS are rocky, sometimes metallic, chunks of leftover material from the process that formed the sun and planets about 4.6 billion years ago. Most orbit the sun in the ASTEROID BELT, a wide region between the orbits of Mars and Jupiter, following a roughly steady path that stays about the same distance from the sun the whole way around. Asteroids are usually too small for their own gravity to pull them into a round shape, so most look lumpy and irregular rather than sphere-shaped.',
        'COMETS are made mostly of ice, frozen gases, and dust -- often described as a "dirty snowball". Unlike an asteroid\'s roughly steady orbit, a comet follows a long, stretched-out orbit that carries it from far out in the outer solar system all the way in past Mars, sometimes closer to the sun than Earth is, and then back out again. As a comet nears the sun and warms up, some of its surface ice turns to gas, and that gas and dust stream away from it to form a glowing tail. The tail always points away from the sun, not backward along the direction the comet is traveling -- so on the outbound half of its orbit, moving away from the sun, a comet\'s tail actually stretches out in front of it.',
        'DWARF PLANETS orbit the sun and are massive enough for their own gravity to pull them into a round shape, the way a true planet is round. What keeps a dwarf planet from counting as a full planet is that it has not cleared other objects out of its orbital neighborhood -- it shares its orbit with plenty of similar-sized debris nearby, while a planet\'s gravity has swept its own path mostly clear. Ceres, round and orbiting inside the asteroid belt, is a dwarf planet. So is Pluto, round and orbiting in the Kuiper Belt, and so is Eris, an even more distant round object also orbiting far beyond Neptune.',
        'THE SAME OBJECT, THREE NAMES BY LOCATION -- METEOROID, METEOR, METEORITE. A small chunk of rock or metal drifting through space -- often a broken-off piece of an asteroid, or dust shed by a comet -- is called a meteoroid. If that fragment enters Earth\'s atmosphere and friction with the air heats it until it glows, the streak of light it produces is called a meteor -- sometimes called a "shooting star", though no star is involved at all. If a piece survives the trip through the atmosphere and reaches the ground, that surviving piece is called a meteorite. It is the same object the whole way through; only the name changes, and it changes because of WHERE the object is, not because the object has turned into something new. WRONG: "A meteor and a meteorite are two different kinds of space rock." CORRECT: "A meteor and a meteorite can be exactly the same rock, named differently because one is still burning in the sky and the other has already landed." Sources describe the middle stage slightly differently -- some call the object itself a meteor while it is glowing, others define a meteor more narrowly as just the streak of light the burning produces. Either way, the location rule for sorting the three names holds: space is meteoroid, atmosphere is meteor, ground is meteorite.',
        'TWO BELTS, TWO LOCATIONS. In order outward from the sun: Mercury, Venus, Earth, Mars, then the ASTEROID BELT, then Jupiter, Saturn, Uranus, Neptune, then the KUIPER BELT far beyond Neptune\'s orbit. The asteroid belt is rocky and lies among the inner planets; the Kuiper Belt is icy and lies past the outer planets, which is part of why Kuiper Belt objects tend to be made of ice and dust rather than rock and metal.',
      ],
      vocabulary: [
        { term: 'asteroid', definition: 'a rocky, sometimes metallic object orbiting the sun, usually too small for its own gravity to make it round, mostly found in the asteroid belt.' },
        { term: 'asteroid belt', definition: 'the wide region between the orbits of Mars and Jupiter where most asteroids orbit.' },
        { term: 'comet', definition: 'an object made of ice, frozen gases and dust that follows a long, stretched-out orbit and develops a glowing tail when it nears the sun.' },
        { term: 'dwarf planet', definition: 'an object round enough from its own gravity to look like a small planet, but that has not cleared other objects out of its orbital neighborhood.' },
        { term: 'meteoroid', definition: 'a small fragment of rock or metal traveling through space, before it reaches an atmosphere.' },
        { term: 'meteor', definition: 'the streak of light produced when a meteoroid burns up from friction with the air after entering an atmosphere.' },
        { term: 'meteorite', definition: 'a fragment of a meteoroid that survives its trip through the atmosphere and reaches the ground.' },
        { term: 'Kuiper Belt', definition: 'a region of icy objects far beyond the orbit of Neptune.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-classify-a-comet',
      kind: 'worked_example',
      problem:
        'An object is made of ice, frozen gases, and dust. It follows a long, stretched-out orbit that carries it from far out past Neptune all the way in past the orbit of Mars, then back out again over many years. As it passes close to the sun this time, a glowing tail forms and stretches away from it, pointing away from the sun. What kind of solar system object is this, and how do you know?',
      steps: [
        'Start with composition, because it sorts out two of the four categories immediately. Ice, frozen gases, and dust rule out an asteroid, which is rocky and often metallic, and they rule out a dwarf planet, whose defining feature is being round from its own gravity -- nothing here says the object is round.',
        'Now check the orbit shape. A long, stretched-out orbit that swings from far beyond Neptune to inside the orbit of Mars is not a roughly steady, near-circular path -- that stretched, extreme-distance-swinging shape is exactly what sets a comet\'s orbit apart from an asteroid\'s.',
        'Add the tail. A tail that forms as the object nears the sun and stretches away from the sun is a feature specific to comets -- the sun\'s heat is turning some of the object\'s surface ice into gas, and that gas and dust stream away from the nucleus.',
        'Composition, orbit shape, and the tail all point the same way, so the object is a comet.',
        'WRONG: "It has to be a dwarf planet, because it is a big object out past Neptune." CORRECT: "Being far out past Neptune only narrows down the neighborhood -- lots of very different objects orbit out there. What actually decides comet versus dwarf planet versus asteroid is composition, orbit shape, and whether the object is round, not distance from the sun alone."',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. Composition says ice and dust, not rock or metal. Orbit shape says a long, stretched path with extreme distance changes, not a steady one. Behavior says a tail forms near the sun. Three different kinds of evidence, one answer. Second, change one thing about the setup and check that the answer moves the way it should: swap the composition to rock and metal and keep the same near-circular belt orbit, and the object becomes an asteroid instead -- the answer moves when the evidence moves.',
      ],
      answer:
        'A comet. Its icy composition, its long stretched-out orbit that swings from far beyond Neptune to inside Mars\'s orbit, and the tail that forms as it nears the sun all point to the same answer.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-one-fragment-three-names',
      kind: 'worked_example',
      problem:
        'A pea-sized fragment of rock has been drifting alone through space for millions of years, likely a broken-off piece of a much larger asteroid. Tonight it enters Earth\'s atmosphere at high speed. Friction with the air heats it until it glows, producing a bright streak of light across the sky that a person on the ground points at and calls a "shooting star." A small piece of the fragment survives the trip through the atmosphere and is found the next morning lying in a field. Name what this one fragment is called at each of the three stages.',
      steps: [
        'Stage one: out in space, before it reaches Earth\'s atmosphere at all. A small rock or metal fragment drifting through space is called a meteoroid. The name has nothing to do with what the fragment is made of, only that it is a small object out in space rather than a large body like an asteroid or a planet.',
        'Stage two: entering Earth\'s atmosphere. Once the fragment hits the atmosphere and friction with the air heats it enough to glow, the streak of light it produces is called a meteor. This is the stage people mean by "shooting star," even though no star is involved at all.',
        'Stage three: on the ground. If any piece of the fragment survives the trip through the atmosphere and is found afterward, that surviving piece is called a meteorite.',
        'WRONG: "It is a meteor from the moment it leaves the asteroid belt until it lands in the field." CORRECT: "The object is the same rock fragment the whole time; only its name changes, and it changes with location -- space is meteoroid, atmosphere is meteor, ground is meteorite."',
        'Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree: location (space, then air, then ground), the process happening to the object at each location (drifting, then burning, then landed), and the plain sequence of the story itself, told in order. Three different kinds of evidence, one three-stage answer. Second, change one thing and see that the answer moves: if the fragment burned up completely and no piece reached the ground, there would be no meteorite at all -- the object would only ever have been a meteoroid, then a meteor, and nothing more. Most meteoroids that enter an atmosphere burn up completely and never become a meteorite.',
      ],
      answer:
        'Meteoroid while it drifts alone through space; meteor for the streak of light as it burns in Earth\'s atmosphere; meteorite for the surviving piece once it reaches the ground. It is the same fragment throughout -- only the name changes, based on location.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-asteroid-by-composition-and-orbit',
      kind: 'try_yourself',
      problem:
        'An object is made mostly of rock and metal. It follows a nearly circular orbit that stays in the region between the orbits of Mars and Jupiter, and it never develops a tail. What kind of solar system object is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A comet, because comets are the small objects that travel around the sun, and any object that fits that description counts as one.' },
        { id: 'b', text: 'An asteroid, because its rocky composition and its steady orbit within the region between Mars and Jupiter match the asteroid belt.', correct: true },
        { id: 'c', text: 'A dwarf planet, because any object that orbits the sun in the region between Mars and Jupiter is round enough to count as a dwarf planet.' },
        { id: 'd', text: 'A meteor, because a meteor is simply the name for a small object moving through the space between the planets.' },
      ],
      expectedAnswer: 'An asteroid, because its rocky composition and its steady orbit within the region between Mars and Jupiter match the asteroid belt.',
      hints: [
        'Composition is the first clue -- rock and metal rules out one of the four categories completely, since that category is made of ice, frozen gas and dust instead.',
        'Now check the orbit. A steady, near-circular path that stays in one region between two named planets matches a specific belt named in this lesson -- which one, and what is an object that lives there usually called?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-dwarf-planet-by-roundness-and-neighborhood',
      kind: 'try_yourself',
      problem:
        'An object orbits the sun out in the Kuiper Belt, far beyond Neptune. Its own gravity has pulled it into a round shape, but plenty of other icy objects share its orbital neighborhood and it has not cleared them away. What kind of solar system object is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A full planet, because anything round that follows its own path around the sun counts as a full planet.' },
        { id: 'b', text: 'A comet, because comets are the icy objects that orbit far out in the Kuiper Belt, beyond Neptune.' },
        { id: 'c', text: 'A dwarf planet, because it is round from its own gravity but has not cleared other objects out of its orbital neighborhood.', correct: true },
        { id: 'd', text: 'An asteroid, because asteroids are the small solid objects left over from the solar system\'s early history.' },
      ],
      expectedAnswer: 'A dwarf planet, because it is round from its own gravity but has not cleared other objects out of its orbital neighborhood.',
      hints: [
        'Two separate requirements decide this, and the object meets one of them but not the other. Being pulled into a round shape by its own gravity is one requirement for a full planet -- what is the other?',
        'The description tells you the object has NOT cleared its orbital neighborhood. Of the four categories in this lesson, which one is specifically defined by being round but not having cleared its neighborhood?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-name-the-burning-streak',
      kind: 'try_yourself',
      problem:
        'A rock fragment has been drifting through space for a long time. Tonight it enters Earth\'s atmosphere, and friction with the air heats it until it glows, producing a bright streak of light across the sky. What is this glowing streak called at this exact moment, while it is still burning in the atmosphere and has not yet reached the ground?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A meteorite, because a meteorite is the name for any fragment of rock that has traveled here from outer space.' },
        { id: 'b', text: 'An asteroid, because asteroids are rock fragments that travel alone through space toward Earth.' },
        { id: 'c', text: 'A meteoroid, because that is the name for a small rock fragment traveling alone through space.' },
        { id: 'd', text: 'A meteor, because that is the name for the streak of light produced as a fragment burns in Earth\'s atmosphere.', correct: true },
      ],
      expectedAnswer: 'A meteor, because that is the name for the streak of light produced as a fragment burns in Earth\'s atmosphere.',
      hints: [
        'Three different names track three different locations for the exact same fragment -- name them in order, from out in space, to inside the atmosphere, to on the ground.',
        'This fragment is described as being in the middle location, currently glowing and not yet on the ground. Which of the three names belongs to that middle stage?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-shooting-star-and-tail-motion',
      kind: 'misconception_check',
      question:
        'A student says: "I saw a shooting star last night -- that must have been a star falling out of the sky. Comets probably have tails for the same reason, because they are moving so fast through space." Two separate things are wrong here. What are they?',
      commonErrors: [
        {
          answer: 'A shooting star is a star falling out of the sky.',
          misconception:
            'Taking the common name "shooting star" literally, and assuming a star -- an enormous, distant sun -- can fall toward Earth.',
          correctsTo:
            'A "shooting star" is not a star at all. It is the streak of light called a meteor, produced when a small rock or dust fragment -- a meteoroid -- enters Earth\'s atmosphere at high speed and burns up from friction with the air. Real stars are enormous and extremely far away; nothing that size is falling toward Earth.',
        },
        {
          answer: 'Comets have tails because they are moving fast through space, like a trail behind a speeding car.',
          misconception:
            'Assuming the tail is a physical wake caused by motion, the same way dust trails behind a moving vehicle.',
          correctsTo:
            'A comet\'s tail is not caused by its speed. As a comet\'s long, stretched-out orbit carries it close to the sun, heat from the sun turns some of its surface ice into gas, and that gas and dust stream away from the nucleus. The tail always points away from the sun, no matter which direction the comet itself is traveling -- so a comet moving away from the sun still has its tail out in front of it, not trailing behind.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Asteroids are rocky, sometimes metallic, and mostly orbit the sun in the asteroid belt between Mars and Jupiter, in a roughly steady path.',
        'Comets are made of ice, frozen gases and dust, and follow a long, stretched-out orbit that swings from far out in the solar system in toward the sun and back.',
        'A comet\'s tail forms as sunlight warms its surface ice into gas, and the tail always points away from the sun -- not backward along the comet\'s direction of travel.',
        'Dwarf planets are round from their own gravity, like a true planet, but have not cleared other objects out of their orbital neighborhood. Ceres orbits in the asteroid belt; Pluto and Eris orbit far beyond Neptune.',
        'The Kuiper Belt is a region of icy objects far beyond Neptune\'s orbit.',
        'The same small fragment has three names depending on location: meteoroid out in space, meteor as it burns in Earth\'s atmosphere, and meteorite if a piece survives to reach the ground.',
        'Most of these objects are leftover material from the process that formed the sun and planets about 4.6 billion years ago.',
        'Distance from the sun alone does not decide what kind of object something is -- composition, orbit shape, and whether the object is round all matter too.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Asteroids, Comets & Other Solar System Objects' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
