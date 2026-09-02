/**
 * Grade 6 Science (Earth & Space Science) — Plate Tectonics: Types of Plate
 * Boundaries.
 *
 * CONCEPT-LED fan-out row for m6sci (NGSS MS-ESS2-2). There is no diagram
 * available, and this topic is normally taught from a boundary map, so the
 * whole lesson is built around one substitute for the picture: NAME THE
 * MOTION. Every boundary in this file is identified by saying, in words,
 * which way the two plates are moving relative to each other -- apart,
 * together, or past -- and every item is solvable from that description
 * alone, the way the moon-phases exemplar carries its reasoning on the
 * Sun-Moon-Earth angle rather than on a picture.
 *
 * The trap this row is built to kill is treating "the two sides are moving
 * in different directions" as automatically convergent. A transform
 * boundary also has two sides moving in different directions -- one north,
 * one south, say -- and the only thing that actually decides the type is
 * whether the DISTANCE ACROSS the boundary is shrinking, growing, or
 * staying the same. A second, related trap is confusing a plate with a
 * continent: a convergent boundary needs two plates closing the distance
 * between them, and it does not care whether either plate happens to be
 * carrying a continent, open ocean floor, or both.
 *
 * SCOPE GUARD: this plan classifies a plate boundary into convergent,
 * divergent or transform using ONLY the relative-motion evidence, and
 * nothing else. Because the rest of Unit 4 sits very close on both sides,
 * the guard states what is deliberately EXCLUDED and also what is
 * deliberately ALLOWED at that edge, and why:
 *   - ROW 4.2 (Earth's plates & mantle convection) is this row's
 *     prerequisite. WHY the plates move -- mantle convection -- is not
 *     re-taught here and the word "convection" does not appear in this
 *     file; this plan starts from the plates already being in motion and
 *     asks only which direction that motion is, relative to a neighboring
 *     plate.
 *   - ROW 4.4 (landforms built by plate motion) is this row's follow-up,
 *     and it owns the landform-to-boundary-type-and-density match (fold
 *     mountains, ocean trench, mid-ocean ridge, rift valley, volcanic
 *     island arc). This file NAMES four real boundaries -- the Mid-Atlantic
 *     Ridge, the Andes, the Himalayas, and the San Andreas Fault -- purely
 *     to anchor each motion type in a place a student could look up, and it
 *     states outright, at the point each one is introduced, that what a
 *     boundary BUILDS and why is the next lesson. It never explains a
 *     landform by density (oceanic crust sinking beneath continental crust
 *     because it is denser is 4.4's reasoning, not this file's), and no
 *     mountain, trench, ridge or rift valley is described as a category to
 *     be matched against a boundary type. The one exception is a single,
 *     general mention that new ocean-floor material rises into a widening
 *     divergent gap -- carried over verbatim from this row's own salvage
 *     source as a plain statement of what "apart" produces at the ocean
 *     floor, not as a landform-classification lesson.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope
 *     for this row, and none appears.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: no heat-transfer mechanism, no
 *     force law, and no density calculation appears anywhere in this file.
 *     The word "denser" appears twice, both times as a FOIL -- a try_yourself
 *     distractor and its correction, both saying that classifying a boundary
 *     never requires knowing which plate is denser. This file never itself
 *     asserts that one plate or crust type is denser than another; this row
 *     only ever compares DIRECTION, never mass, weight, force or density.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * boundary in this file is identified from a written description of motion,
 * and every item is solvable from the text printed inside it. Never write
 * "see the map above", and never assume the student has a globe or a
 * plate-boundary map in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is
 * 4.2 -> 4.3 -> 4.4, populated from the lesson brief.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U4_TYPES_OF_PLATE_BOUNDARIES: LessonPlan = {
  id: 'evelyn.ms.m6sci.types-of-plate-boundaries.v1',
  title: 'Types of Plate Boundaries',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.types-of-plate-boundaries',
      standard: 'M6SCI-4.3',
      description:
        'Distinguish convergent, divergent, and transform plate boundaries by the direction plates move relative to each other (NGSS MS-ESS2-2).',
    },
  ],
  prerequisites: ['m6sci.earths-plates-and-mantle-convection'],
  followUps: ['m6sci.landforms-built-by-plate-motion'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Give the student a hands-on mental model of the three motions before naming any of them.',
      script:
        'Picture two kids on rolling desk chairs, out on a smooth floor. There are exactly three things that can happen between them. They can roll toward each other and crash together. They can roll away from each other and open up a gap. Or they can roll past each other, side by side, so the gap between them never changes even though they are both moving. Toward, apart, or past. There is no fourth option. Earth\'s plates -- the giant slabs of rock that make up the surface of the planet -- only ever do those same three things relative to a neighboring plate, just unbelievably slowly and over unbelievably long stretches of time. Right now, the ground under the middle of the Atlantic Ocean is doing one of those three things. The ground under California is doing a different one. By the end of this lesson you will be able to tell which is which, just from how the two sides are moving.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-boundary-types',
      kind: 'concept',
      goal: 'Name the three boundary types by relative motion alone, anchor each in a real place, and kill the two traps.',
      keyIdeas: [
        'A BOUNDARY IS NAMED BY DIRECTION, NOT BY WHAT IT BUILDS. A plate boundary is simply the place where two plates meet. To classify it, ask one question: which way are the two plates moving relative to each other -- apart, together, or past? What a boundary actually builds on the surface -- a mountain range, an ocean ridge, a trench -- depends on more than direction and is the next lesson. This lesson is only about the motion.',
        'DIVERGENT boundaries -- the two plates are moving APART, so the gap between them keeps growing. The Mid-Atlantic Ridge, an underwater mountain range that runs down the middle of the Atlantic Ocean floor, marks a divergent boundary: the plate carrying North and South America is moving away from the plate carrying Europe and Africa, and new ocean-floor material rises up to fill the widening gap between them.',
        'CONVERGENT boundaries -- the two plates are moving TOGETHER, so the gap between them keeps shrinking. Two real examples: the Andes mountains in South America sit above a boundary where a plate carrying open ocean floor is moving toward the plate that carries the South American continent, and the Himalayas in Asia sit above a boundary where the plate carrying India has been moving toward the plate carrying the rest of Asia for tens of millions of years. What each of these convergent boundaries builds, and why the two build different things, is the next lesson -- here, the only fact that matters is that in both places the two plates are closing the distance between them.',
        'TRANSFORM boundaries -- the two plates are sliding PAST each other, so the gap between them stays about the same even though both sides are moving. California\'s San Andreas Fault marks a transform boundary: the Pacific plate and the North American plate grind past each other, and the friction of two enormous plates sliding past one another is exactly what produces the fault\'s frequent earthquakes -- even though no new mountain range and no new ocean floor is being built there.',
        'THE FIRST TRAP: DIFFERENT DIRECTIONS IS NOT THE SAME AS CONVERGENT. At a transform boundary, the two sides really are moving in different directions -- one north, say, and one south. That can look like a collision if you only glance at the directions. The question that actually decides the type is whether the DISTANCE ACROSS the boundary is shrinking, growing, or staying the same. Shrinking is convergent. Growing is divergent. Staying about the same, while both sides slide along the boundary, is transform.',
        'THE SECOND TRAP: A PLATE IS NOT THE SAME THING AS A CONTINENT. One plate can carry open ocean floor and a continent margin at the same time. A convergent boundary does not require two continents crashing together -- the Andes boundary is convergent even though only one side carries a continent, because a convergent boundary is defined by direction alone, not by what either plate happens to be carrying.',
      ],
      vocabulary: [
        { term: 'plate boundary', definition: 'the place where two of Earth\'s plates meet.' },
        { term: 'convergent boundary', definition: 'a plate boundary where the two plates are moving toward each other, closing the distance between them.' },
        { term: 'divergent boundary', definition: 'a plate boundary where the two plates are moving apart, opening the distance between them.' },
        { term: 'transform boundary', definition: 'a plate boundary where the two plates are sliding past each other, with the distance between them staying about the same.' },
        { term: 'relative motion', definition: 'how two plates are moving compared with each other, rather than how fast either one moves on its own.' },
      ],
      suggestedTools: ['show_map', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-markers-drifting-apart',
      kind: 'worked_example',
      problem:
        'Scientists place two markers on the ocean floor, one on each side of a plate boundary. Tracking the exact position of each marker for many years shows the west marker drifting steadily to the west and the east marker drifting steadily to the east -- and the distance between the two markers has been growing every year. What type of boundary is this?',
      steps: [
        'Start with the one question that decides the type: which way are the two plates moving relative to each other?',
        'The west marker is moving away from the boundary toward the west, and the east marker is moving away from the boundary toward the east. Both markers are moving away from each other.',
        'The distance between them has been growing every year, which is the direct evidence that the two plates are pulling apart, not sliding past each other and not closing in.',
        'Moving apart, with the gap growing, is the definition of a divergent boundary.',
        'A real boundary that matches this exact pattern is the Mid-Atlantic Ridge: the plate carrying the Americas is moving one way and the plate carrying Europe and Africa is moving the other way, so the ocean floor between them keeps widening.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The direction clue: each marker moves away from the boundary. The trend clue: the distance between the markers grows year after year, not just once. The definition clue: "moving apart" is exactly what the word divergent means, and nothing in the description suggests sliding or closing. Three different kinds of evidence, one answer. Second, change one thing about the setup and check that the answer moves with it: if both markers had instead drifted toward each other, with the gap shrinking, the same reasoning would give a convergent boundary, and if both markers had drifted the same direction along the line between them while staying the same distance apart, it would give a transform boundary. The direction data is doing the actual work.',
      ],
      answer:
        'Divergent. Both markers move directly away from each other and the gap between them grows every year, matching a boundary like the Mid-Atlantic Ridge.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sliding-not-colliding',
      kind: 'worked_example',
      problem:
        'A boundary runs north to south through a region. Surveys show that the land west of the boundary has been sliding steadily north, along the line of the boundary, while the land east of the boundary has been sliding steadily south, also along the line of the boundary. Measured straight across the boundary, from west to east, the distance between the two sides has stayed the same for as long as it has been surveyed. What type of boundary is this, and why is it not convergent?',
      steps: [
        'Notice the direction of each motion first. Both sides are moving ALONG the line of the boundary -- one north, one south -- not toward it and not away from it.',
        'Now check the distance ACROSS the boundary, which is the measurement that actually decides the type. The problem states that distance has stayed the same the whole time.',
        'WRONG: "The two sides are moving in different directions, so they must be crashing together." CORRECT: "Moving in different directions along the boundary is not the same as moving toward each other across it. The distance across the boundary never changes here, so nothing is closing in."',
        'Sliding along the boundary while the distance across it stays about the same is the definition of a transform boundary, not a convergent one.',
        'A real boundary that matches this pattern is the San Andreas Fault: the Pacific plate slides past the North American plate along the fault line, and the grinding friction from that sliding produces the fault\'s frequent earthquakes, without building a new mountain range or a new stretch of ocean floor.',
        'Now run the two checks. First, three clues of different kinds that agree: the direction clue (both motions run along the boundary, not across it), the distance clue (the gap across the boundary is constant), and the definition clue (sliding-with-no-change-in-gap is exactly what transform means). Second, change one thing and see the answer move: if the west side had instead been measured moving east, straight toward the boundary, while the east side stayed in place, the distance across would start shrinking every year, and the boundary would become convergent -- even though it is the very same boundary line.',
      ],
      answer:
        'Transform. Both sides slide along the boundary and the distance across it does not change, matching a boundary like the San Andreas Fault; it is not convergent because nothing is closing the gap between the two sides.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-oceanic-continental-convergent',
      kind: 'try_yourself',
      problem:
        'Along a boundary at the edge of a continent, instruments track position for many years. The measurements show a plate carrying a wide stretch of open ocean floor moving steadily toward a neighboring plate that carries a continent, and the distance between the two plates has been shrinking every year. What type of boundary is this?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Transform, because a plate made of ocean floor and a plate made of continent are two different kinds of plate, and different kinds of plate slide past each other instead of colliding.',
        },
        {
          id: 'b',
          text: 'Divergent, because oceanic crust and continental crust always move at different speeds, and that speed difference is what opens a gap between the two plates.',
        },
        {
          id: 'c',
          text: 'It cannot be classified from this description alone, because that would first require knowing which of the two plates is denser than the other.',
        },
        {
          id: 'd',
          text: 'Convergent, because the two plates are moving toward each other and the distance between them is shrinking every year.',
          correct: true,
        },
      ],
      expectedAnswer:
        'Convergent, because the two plates are moving toward each other and the distance between them is shrinking every year.',
      hints: [
        'Ignore what each plate is carrying for a moment and look only at the two numbers you actually have: which way is each plate moving, and is the distance between them growing or shrinking?',
        'A plate is not the same thing as a continent, and classifying a boundary never requires knowing which side is denser -- that question belongs to a different lesson. Direction and distance are all you need here.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-transform-from-consequence',
      kind: 'try_yourself',
      problem:
        'California\'s San Andreas Fault is famous for producing frequent earthquakes, but in the time humans have studied it, it has not produced a new mountain range and it has not opened a new stretch of ocean floor. What type of boundary is the San Andreas Fault, and what is actually happening there?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Transform, because the Pacific plate and the North American plate are sliding past each other, not moving toward or away from each other.',
          correct: true,
        },
        {
          id: 'b',
          text: 'Convergent, because earthquakes only happen when two plates are crashing directly into each other.',
        },
        {
          id: 'c',
          text: 'Divergent, because a fault is a crack in the ground, and cracks only open up where plates are pulling apart from each other.',
        },
        {
          id: 'd',
          text: 'It cannot be a real plate boundary at all, because no mountain range or new ocean floor has formed there.',
        },
      ],
      expectedAnswer:
        'Transform, because the Pacific plate and the North American plate are sliding past each other, not moving toward or away from each other.',
      hints: [
        'The clue in the problem is what is MISSING: no new mountains, no new ocean floor. Ask which of the three motions would leave both of those things missing while still producing constant friction.',
        'Earthquakes come from plates catching and slipping against each other, and that friction can happen at any of the three boundary types -- it does not by itself tell you which type this is. Go back to the direction of motion instead.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plate-versus-continent',
      kind: 'try_yourself',
      problem:
        'Two students are arguing about the boundary under the Himalayas. The first student says, "The two sides can\'t be part of a divergent boundary just because they\'re two different continents, India and the rest of Asia -- that is not what decides the type." The second student says surveys show the two sides have been closing the distance between them for tens of millions of years. Based only on the second student\'s claim about direction, what type of boundary is this?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Divergent, because continents have been drifting apart ever since the supercontinent Pangea broke up, so a boundary between two continents must still be widening today.',
        },
        {
          id: 'b',
          text: 'Convergent, because the two plates have been moving toward each other and closing the distance, regardless of how many continents either one happens to carry.',
          correct: true,
        },
        {
          id: 'c',
          text: 'Transform, because two continents can never fully collide with each other -- they can only grind past one another over time.',
        },
        {
          id: 'd',
          text: 'It cannot be determined, because India and the rest of Asia must actually be riding on one single shared plate, since they sit right next to each other.',
        },
      ],
      expectedAnswer:
        'Convergent, because the two plates have been moving toward each other and closing the distance, regardless of how many continents either one happens to carry.',
      hints: [
        'The first student is correcting a mix-up between "plate" and "continent." Set that mix-up aside and look only at what the second student actually reported: which way is the distance between the two sides changing?',
        'A convergent boundary is defined by two plates closing the distance between them. It does not care whether one side, both sides, or neither side happens to carry a continent.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-earthquakes-and-continents',
      kind: 'misconception_check',
      question:
        'A student writes: "A convergent boundary always means two continents crashing into each other, like India and Asia. And the San Andreas Fault must be convergent too, because earthquakes only happen when plates crash together." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'A convergent boundary always means two continents crashing into each other.',
          misconception:
            'Generalizing from the one convergent example that involves two continents (India and Asia) to assume every convergent boundary must involve continents, which confuses "plate" with "continent."',
          correctsTo:
            'A convergent boundary only requires two plates moving toward each other and closing the distance between them -- it does not require continents at all. The Andes mark a convergent boundary where a plate carrying open ocean floor is closing in on the plate that carries the South American continent, and that boundary is convergent for the same reason the Himalayas boundary is: the distance between the two plates is shrinking. What either plate happens to be carrying does not decide the type.',
        },
        {
          answer: 'The San Andreas Fault must be convergent, because earthquakes only happen when plates crash together.',
          misconception:
            'Assuming earthquakes are exclusive evidence of a collision, when friction from plates catching and slipping produces earthquakes at any of the three boundary types.',
          correctsTo:
            'The San Andreas Fault is a transform boundary: the Pacific plate and the North American plate slide past each other, not toward or away from each other, and the friction of that sliding is exactly what produces its frequent earthquakes. Earthquakes tell you that plates are catching and slipping against each other -- they do not by themselves tell you which of the three directions the plates are moving in.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A plate boundary is classified by ONE thing: the direction the two plates are moving relative to each other -- apart, together, or past.',
        'DIVERGENT: plates move apart and the gap grows. Example: the Mid-Atlantic Ridge, where the plate carrying the Americas is moving away from the plate carrying Europe and Africa.',
        'CONVERGENT: plates move together and the gap shrinks. Examples: the Andes (an ocean-floor plate closing in on the South American plate) and the Himalayas (the plate carrying India closing in on the plate carrying the rest of Asia).',
        'TRANSFORM: plates slide past each other and the gap stays about the same. Example: California\'s San Andreas Fault.',
        'Moving in different directions is not automatically convergent -- check whether the distance ACROSS the boundary is actually shrinking, growing, or staying the same.',
        'A plate is not the same thing as a continent. A single plate can carry open ocean floor and a continent together, and a boundary\'s type is decided by direction alone -- never by whether either plate happens to be carrying a continent.',
        'Earthquakes can happen at all three boundary types, not only where plates collide.',
        'What each boundary type actually builds -- mountains, ridges, trenches -- is the next lesson. This lesson is about identifying the type from the motion alone.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Types of Plate Boundaries' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
