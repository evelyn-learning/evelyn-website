/**
 * Grade 6 Science (Earth & Space Science) — Earth's Place in the Solar
 * System: Gravity & Orbital Motion.
 *
 * CONCEPT-LED fan-out row for m6sci (NGSS MS-ESS1-2). The student has no
 * procedure to lean on: the whole lesson is building one picture -- gravity
 * as a pull every mass exerts on every other mass, growing stronger with more
 * mass and weaker with more distance, and an orbit as that pull continuously
 * curving a moving object's path so it keeps falling toward a central body
 * while also moving sideways fast enough to keep missing it. The picture is
 * then run across all three cases the standard names: a planet orbiting the
 * sun, a moon orbiting a planet, and a satellite orbiting Earth.
 *
 * This is the single most exposed row in the whole course. Gravity is a
 * FORCE, and force is Grade 8 physical science; this file teaches gravity's
 * ROLE in holding an orbit together without ever teaching gravity as a force
 * that can be calculated. See the SCOPE GUARD below for exactly where that
 * line is drawn and re-checked against the finished body.
 *
 * SCOPE GUARD: this plan explains, in words only, how gravity's pull --
 * which grows stronger with more mass and weaker with more distance, stated
 * only as "stronger" and "weaker" and never as a number or an equation --
 * keeps a planet, a moon, or an artificial satellite moving in a curved
 * orbit instead of flying off in a straight line. It never calculates a
 * gravitational force. Because this row sits directly on the Grade 8
 * boundary, every clause below is written to be checked against the
 * finished file, not just asserted:
 *   - GRADE 8 PHYSICAL SCIENCE boundary: no force law, no version of
 *     F = Gm1m2/r2, no Newton's law named as such, no force diagram, no
 *     vector, and no calculation appears anywhere in this file. An orbit is
 *     described only as gravity continuously pulling an object toward a
 *     central body while the object moves sideways fast enough to keep
 *     missing it -- the file never describes a balance of forces and never
 *     describes an inward acceleration, which are the two specific Grade 8
 *     framings this row exists to avoid. The word "force" appears only in
 *     this doc comment and in the learning-objective description below
 *     (which states the row's own scope sentence, naming what is NOT
 *     calculated) -- it is not used anywhere inside any `segments` entry,
 *     including inside a distractor, so no reader can mistake a wrong
 *     choice for a hedge into physics vocabulary. Mass appears only as
 *     "more matter, stronger pull" and is never computed; "weight" as a
 *     quantity is never used or computed either, and the only place the
 *     string "weight"
 *     occurs at all is inside the ordinary word "weightless", in one
 *     distractor and its correction, describing the everyday sensation of
 *     floating rather than any computed quantity.
 *   - Row 1.1 (scale of the solar system) builds to-scale-model comparisons
 *     of size and distance. This file makes only qualitative closer/farther
 *     comparisons in service of the gravity rule -- it states no distance in
 *     kilometers or astronomical units and builds no scale model.
 *   - Row 1.2 (classifying the planets) sorts the eight planets into
 *     terrestrial and gas/ice-giant groups by observed properties. This file
 *     does not classify or sort planets; it uses the fact -- already
 *     established there -- that gas giants are far more massive than
 *     terrestrial planets only as an example when comparing which of two
 *     bodies pulls more strongly.
 *   - Row 1.4 (asteroids, comets and other solar system objects) inventories
 *     object types and locates the asteroid belt and the Kuiper Belt. This
 *     file names no asteroid, comet, dwarf planet or meteor, and locates no
 *     belt. "Satellite" here means an orbiting object in general, and an
 *     artificial satellite specifically -- never a solar system object type.
 *   - Row 2.3 (phases of the Moon) explains why the Moon's lit shape appears
 *     to change. The Moon appears in this file only as an example of a
 *     natural satellite following the same orbital pattern as an artificial
 *     one; this file does not address the Moon's phases, and reflected
 *     sunlight is never mentioned.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every example
 * in this file is written out in words, and every item is solvable from the
 * text printed inside it. Never write "see the diagram above", and never
 * assume the student has a ball, a string, a globe, or a model orbit to look
 * at.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is
 * 1.2 -> 1.3 -> 1.4, written now per the fan-out contract's chain table even
 * though 1.4 is authored in a sibling agent's file in this same fan-out --
 * both slugs will exist as registered LOs once the controller lands the
 * full 40-row batch.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U1_GRAVITY_AND_ORBITAL_MOTION: LessonPlan = {
  id: 'evelyn.ms.m6sci.gravity-and-orbital-motion.v1',
  title: 'Gravity & Orbital Motion',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.gravity-and-orbital-motion',
      standard: 'M6SCI-1.3',
      description:
        'Use a model to explain qualitatively how gravity keeps planets, moons, and satellites in orbit rather than flying off in a straight line, without calculating gravitational force (NGSS MS-ESS1-2).',
    },
  ],
  prerequisites: ['m6sci.classifying-the-planets'],
  followUps: ['m6sci.asteroids-comets-and-other-solar-system-objects'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the two-sided puzzle -- why does gravity not pull the Moon in, and why does the Moon not fly away -- before the model resolves it.',
      script:
        'Toss a ball straight up and it always comes back down. Every single time, no exceptions. Now here is something strange. The Moon has been orbiting Earth for billions of years, pulled on by Earth\'s gravity that whole time, and it has never once fallen down and landed. It has also never once drifted off into space. It just keeps going around, on almost exactly the same path, over and over. If gravity is strong enough to yank a tossed ball back to the ground in a couple of seconds, why has it never dragged the Moon in? And if gravity really is pulling on the Moon, why has the Moon not flown off in a straight line, the way a rock flies off straight the moment you let go of a string you were swinging it on? Today we build the one picture that answers both questions at once -- and it explains a planet circling the sun and a satellite circling Earth exactly the same way.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-gravity-and-orbits',
      kind: 'concept',
      goal: 'Install gravity as a mass-and-distance pull, and build the falling-and-missing model of an orbit across planets, moons, and satellites.',
      keyIdeas: [
        'GRAVITY IS A PULL BETWEEN ANY TWO THINGS WITH MASS. Every object that has mass pulls on every other object that has mass, pulling them toward each other. You and a nearby friend pull on each other a little, though far too weakly to ever notice. The sun has an enormous amount of mass, so its pull is enormous too -- strong enough to reach all the way across the solar system and hold every planet in orbit around it.',
        'TWO THINGS CHANGE HOW STRONG THE PULL IS: MASS AND DISTANCE. A more massive object pulls more strongly than a less massive one. And for any two given objects, the pull grows weaker the farther apart they are. Both of these are directions, not numbers -- this lesson never turns "stronger" or "weaker" into a calculation.',
        'WITHOUT GRAVITY, AN ORBITING OBJECT WOULD JUST FLY OFF IN A STRAIGHT LINE. Every planet, moon, and satellite is already moving through space. If nothing were pulling on it, it would keep moving in that same straight line forever, exactly like a rock flying off straight once you let go of the string you were swinging it on. Nothing in the solar system does that, because gravity is always pulling.',
        'AN ORBIT IS FALLING WHILE MOVING SIDEWAYS FAST ENOUGH TO KEEP MISSING. Gravity\'s pull continuously bends an orbiting object\'s path toward the central body. But the object is also moving sideways, and if that sideways motion is fast enough, the object keeps getting pulled toward the central body and also keeps missing it, over and over, tracing a curve that wraps all the way around. That combination -- constantly falling, constantly missing -- is what an orbit is.',
        'THE SAME PICTURE EXPLAINS THREE DIFFERENT KINDS OF ORBIT. A planet orbits the sun. A moon orbits a planet. A human-made satellite orbits Earth. In every one of these, the pattern is identical: gravity pulls the smaller object toward the central body, the smaller object is also moving sideways, and the result is a curved path around the central body rather than a crash into it or a drift away from it. Only the central body and the orbiting object change from one case to the next.',
        'GRAVITY DOES NOT SWITCH OFF IN SPACE. An astronaut orbiting Earth is not floating because gravity has stopped -- Earth\'s gravity is still pulling on the astronaut and on the spacecraft, the whole time, which is exactly what keeps the spacecraft in orbit instead of flying off straight. The astronaut floats relative to the inside of the spacecraft because the astronaut and the spacecraft are falling toward Earth together, at the same rate, the way a dropped phone would seem to hang in the air right next to you inside an elevator that was falling freely. The elevator is not really in orbit, but the falling-together idea is the same one.',
      ],
      vocabulary: [
        { term: 'gravity', definition: 'a pull that every object with mass exerts on every other object with mass, pulling them toward each other.' },
        { term: 'mass', definition: 'the amount of matter in an object; an object with more mass produces a stronger gravitational pull.' },
        { term: 'orbit', definition: 'the repeating curved path a smaller object follows around a larger object, kept curving by the larger object\'s constant gravitational pull.' },
        { term: 'satellite', definition: 'any object that orbits a larger object; the Moon is a natural satellite of Earth, and a spacecraft launched around Earth is an artificial satellite.' },
        { term: 'free fall', definition: 'moving under the pull of gravity alone, with nothing pushing back or holding the object up; an orbiting spacecraft and everything inside it are in free fall together.' },
      ],
      suggestedTools: ['show_diagram', 'show_concept_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ball-and-satellite',
      kind: 'worked_example',
      problem:
        'A ball rolls off the edge of a table and curves quickly down to the floor, landing just a step away. A satellite launched from a rocket is also pulled by Earth\'s gravity the entire time it moves, and yet instead of quickly hitting the ground, it circles Earth again and again for years. Explain why one lands close by almost immediately and the other keeps going around Earth without ever landing.',
      steps: [
        'Start with what is the same for both objects: gravity is pulling on each of them, toward Earth\'s center, for the whole time they are moving. Gravity does not switch off for either one.',
        'Now find what is different: how much sideways speed each object has when gravity starts acting on it. The ball rolling off the table has very little sideways speed, so gravity pulls it down to the floor almost immediately, close to the table.',
        'The satellite is launched with an enormous sideways speed. Gravity pulls it toward Earth\'s center the entire time, curving its path downward -- but Earth\'s surface curves away beneath the satellite at about the same rate the satellite is falling toward it. So the satellite keeps falling toward Earth and also keeps missing it, and its path curves all the way around the planet instead of ending at the ground.',
        'Notice that gravity is doing the identical job in both cases -- pulling the object toward Earth\'s center. What decides whether the path ends nearby or wraps around the whole planet is only the sideways speed, not any difference in gravity itself.',
        'Run three different kinds of check, since there is no arithmetic to redo here. Observation: real satellites stay in orbit for months or years without an engine firing to push them along, which fits gravity alone providing the pull that curves the path -- nothing needs to keep shoving the satellite sideways. Everyday comparison: the ball is really the same situation with almost no sideways speed, which is why it behaves like the small-scale version of the exact same idea. Internal consistency: one single rule -- pulled toward the center, moving sideways -- explains both the ball landing close by and the satellite orbiting for years, without needing a separate explanation for each.',
        'Now change one condition and check that the answer moves with it. If the satellite were moving too slowly sideways for its height above Earth, gravity would pull it down to the ground quickly, the same way it pulls the ball down -- the difference between "orbits Earth" and "falls to Earth" is exactly this sideways speed, not a difference in what gravity is doing.',
      ],
      answer:
        'Gravity pulls on both the ball and the satellite the whole time. The ball has very little sideways speed, so gravity pulls it to the ground almost immediately. The satellite has an enormous sideways speed, so gravity keeps curving its path around Earth instead of down to the ground -- it keeps falling toward Earth and also keeps moving sideways fast enough to keep missing it, which is what an orbit is.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-mass-and-distance',
      kind: 'worked_example',
      problem:
        'Two separate comparisons. First: Satellite A orbits close to Earth, and Satellite B has the same mass as Satellite A but orbits much farther out. Which satellite feels the stronger pull of Earth\'s gravity? Second: a moon orbits Jupiter at a certain distance, and an identical moon orbits Mars at that exact same distance. Which moon feels the stronger gravitational pull from its planet?',
      steps: [
        'Handle the first comparison. The two satellites have the same mass, so mass cannot be the reason one feels a stronger pull than the other -- distance is the only thing that is different. The rule for distance: gravity\'s pull grows weaker the farther apart two objects are. Satellite A is closer to Earth than Satellite B, so Satellite A feels the stronger pull.',
        'Handle the second comparison. Here the distance is held exactly the same by the setup, so distance cannot be the reason one moon feels a stronger pull -- mass is the only thing that is different. The rule for mass: a more massive object pulls more strongly. Jupiter is a gas giant and is far more massive than Mars, a terrestrial planet, so the moon orbiting Jupiter feels the stronger pull.',
        'Notice why each comparison changed only ONE thing at a time. Gravity\'s pull depends on both mass and distance together, and two real objects in the solar system usually differ in both at once, so you often cannot say which pull is stronger without the actual numbers -- which this lesson never calculates. Holding one factor fixed is what lets you reason about the other factor on its own.',
        'Run three different kinds of check. Real-world example: the sun\'s gravity is strong enough to hold Neptune in orbit even though Neptune is extremely far away, because the sun\'s mass is enormous -- the same "more mass, stronger pull" rule used above. Everyday comparison: you do not feel pulled toward a friend standing near you, because a person\'s mass is far too small for the pull to be noticeable, but you do feel Earth\'s pull under your feet every second, because Earth\'s mass is enormous -- showing mass matters here in exactly the same direction it did for the planets and moons. Internal consistency: the same two rules -- closer is stronger, more massive is stronger -- correctly explain both comparisons above without needing a different explanation for each.',
        'Now change one condition and check that the answer moves with it. If Satellite B were moved in to the exact same distance as Satellite A, the two would feel an identical pull, because their masses are equal and now their distances are equal too -- change the condition, and the earlier answer changes with it.',
      ],
      answer:
        'Satellite A feels the stronger pull, because it is closer to Earth and a closer object feels a stronger gravitational pull. The moon orbiting Jupiter feels the stronger pull, because Jupiter is far more massive than Mars and a more massive object pulls more strongly at the same distance.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-spacecraft-orbit',
      kind: 'try_yourself',
      problem:
        'A spacecraft is launched from Earth. Once it reaches a stable path around Earth, why does it neither fall straight down nor fly off into space?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Earth\'s gravity keeps pulling it toward Earth\'s center the whole time, and the spacecraft is moving sideways fast enough that it keeps missing the ground instead of hitting it, so its path curves all the way around the planet.',
          correct: true,
        },
        {
          id: 'b',
          text: 'Once a spacecraft reaches orbit, it has traveled far enough away from Earth that gravity can no longer reach it, the way sunlight fades out and disappears once you get far enough from its source, so nothing is pulling on the spacecraft in any direction anymore.',
        },
        {
          id: 'c',
          text: 'The spacecraft\'s engines keep firing for as long as it stays in orbit, continuously pushing it sideways the way a car\'s engine has to keep running to keep the car moving forward, so the spacecraft never has the chance to fall toward Earth.',
        },
        {
          id: 'd',
          text: 'The spacecraft is moving so fast that Earth\'s gravity cannot catch up to it, the way running fast enough can let you get away from someone chasing you, so gravity stops affecting its path once the spacecraft reaches orbit.',
        },
      ],
      expectedAnswer:
        'Earth\'s gravity keeps pulling it toward Earth\'s center the whole time, and the spacecraft is moving sideways fast enough that it keeps missing the ground instead of hitting it, so its path curves all the way around the planet.',
      hints: [
        'Gravity from Earth does not actually turn off just because something is far away or moving fast -- it keeps pulling on every object with mass, everywhere in space, no matter the speed.',
        'Think about what makes an orbit different from an object that just falls straight down to the ground: it is not that gravity is missing, it is that the object also has sideways motion. What does gravity keep doing to that sideways motion?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-closer-planet',
      kind: 'try_yourself',
      problem:
        'Two planets orbit the sun. Planet X is much closer to the sun than Planet Y, and the two planets have about the same mass. Which planet feels the stronger pull of the sun\'s gravity, and why?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Planet Y, because a planet farther from the sun spends more of its orbit in direct sunlight, and more sunlight exposure makes the sun\'s gravitational pull on it stronger.',
        },
        {
          id: 'b',
          text: 'Planet X, because the sun\'s gravitational pull grows weaker the farther away an object is, so the closer planet feels the stronger pull.',
          correct: true,
        },
        {
          id: 'c',
          text: 'Both planets feel exactly the same pull, because the sun\'s own mass does not change depending on which planet you are comparing it to.',
        },
        {
          id: 'd',
          text: 'Planet Y, because it has been orbiting the sun for longer, and a planet builds up a stronger pull to the sun the more years it spends orbiting it.',
        },
      ],
      expectedAnswer:
        'Planet X, because the sun\'s gravitational pull grows weaker the farther away an object is, so the closer planet feels the stronger pull.',
      hints: [
        'Start with what is different between the two planets in this problem. Their masses are about the same, so mass cannot be the reason one feels a stronger pull than the other.',
        'Since mass is not the difference here, only the other thing that changes gravity\'s strength is left. What happens to the strength of a pull between two objects as the distance between them gets smaller?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-floating-astronaut',
      kind: 'try_yourself',
      problem:
        'An astronaut aboard a spacecraft orbiting Earth lets go of a pen in mid-air, and the pen floats next to her instead of dropping to the floor of the spacecraft. Which explanation is correct?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Earth\'s gravity has become too weak to reach the spacecraft at that altitude, the way a magnet\'s pull fades out once you move a paperclip far enough away, so neither the astronaut nor the pen feels any pull from Earth anymore.',
        },
        {
          id: 'b',
          text: 'The metal body of the spacecraft blocks Earth\'s gravity from reaching the astronaut and the pen, the way a roof keeps rain from reaching someone underneath it, so nothing inside the spacecraft feels Earth\'s pull at all.',
        },
        {
          id: 'c',
          text: 'Earth\'s gravity is still pulling on the astronaut, the pen, and the spacecraft, and all three are falling toward Earth together at the same rate, so the pen appears to float next to the astronaut instead of dropping to the floor.',
          correct: true,
        },
        {
          id: 'd',
          text: 'The astronaut and the pen are weightless because they have left Earth\'s atmosphere, and gravity only reaches as far out as there is air to carry it, the same way sound cannot travel through the emptiness of space because there is no air to carry it.',
        },
      ],
      expectedAnswer:
        'Earth\'s gravity is still pulling on the astronaut, the pen, and the spacecraft, and all three are falling toward Earth together at the same rate, so the pen appears to float next to the astronaut instead of dropping to the floor.',
      hints: [
        'Ask whether gravity has actually stopped acting on the spacecraft altogether -- if it truly had, the spacecraft would fly off in a straight line instead of staying in orbit around Earth.',
        'The astronaut, the pen, and the spacecraft are not weightless because gravity is missing. All three are being pulled the same way, at the same time. What does that do to how they move relative to each other, inside the spacecraft?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-no-gravity-in-space',
      kind: 'misconception_check',
      question:
        'A student says: "There is no gravity in space -- that is why astronauts float, and that is also why the Moon does not just fall down and crash into Earth." Two separate errors are packed into that one sentence. What are they?',
      commonErrors: [
        {
          answer: 'There is no gravity in space.',
          misconception:
            'Assuming gravity needs something close by, like standing on solid ground, to work at all, since gravity\'s pull cannot be seen or heard the way a push or a shove can.',
          correctsTo:
            'Gravity does not switch off in space. It is what is pulling on the astronaut, the spacecraft, and the Moon right now, everywhere in the solar system. An astronaut floats inside a spacecraft not because gravity has stopped, but because the astronaut and the spacecraft are falling toward Earth together, at the same rate, so nothing pushes the astronaut toward the floor.',
        },
        {
          answer: 'That is also why the Moon does not just fall down and crash into Earth.',
          misconception:
            'Assuming that if gravity is pulling on the Moon at all, the Moon should eventually fall straight down and crash into Earth, since that is what happens to an object dropped nearby.',
          correctsTo:
            'The Moon is falling toward Earth the entire time -- gravity never stops pulling on it. But the Moon is also moving sideways fast enough that it keeps missing Earth instead of hitting it. Constantly falling and constantly missing, together, is exactly what an orbit is, and it is why the Moon has kept the same kind of path for billions of years instead of crashing in or drifting away.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Gravity is a pull that every object with mass exerts on every other object with mass, and it never switches off in space.',
        'A more massive object pulls more strongly, and two objects pull on each other more weakly the farther apart they are.',
        'Without gravity, a planet, moon, or satellite would simply keep moving in a straight line forever.',
        'An orbit is gravity constantly pulling an object toward a central body while the object moves sideways fast enough to keep missing it.',
        'The same picture explains a planet orbiting the sun, a moon orbiting a planet, and a satellite orbiting Earth -- only the central body and the orbiting object change.',
        'An astronaut floats in orbit because the astronaut and the spacecraft are falling toward Earth together at the same rate, not because gravity has stopped.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Gravity & Orbital Motion' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
