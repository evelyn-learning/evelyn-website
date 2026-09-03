/**
 * Grade 6 Science — Unit 4 CED 4.3: Types of Plate Boundaries.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.types-of-plate-boundaries.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U4_TYPES_OF_PLATE_BOUNDARIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.types-of-plate-boundaries.v1',
  course: 'Grade 6 Science',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Types of Plate Boundaries',
  planId: 'evelyn.ms.m6sci.types-of-plate-boundaries.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.types-of-plate-boundaries.v1' }],
  theory: [
    { loId: 'm6sci.types-of-plate-boundaries', content: `A BOUNDARY IS NAMED BY DIRECTION, NOT BY WHAT IT BUILDS. A plate boundary is simply the place where two plates meet. To classify it, ask one question: which way are the two plates moving relative to each other -- apart, together, or past? What a boundary actually builds on the surface -- a mountain range, an ocean ridge, a trench -- depends on more than direction and is the next lesson. This lesson is only about the motion.` },
    { loId: 'm6sci.types-of-plate-boundaries', content: `DIVERGENT boundaries -- the two plates are moving APART, so the gap between them keeps growing. The Mid-Atlantic Ridge, an underwater mountain range that runs down the middle of the Atlantic Ocean floor, marks a divergent boundary: the plate carrying North and South America is moving away from the plate carrying Europe and Africa, and new ocean-floor material rises up to fill the widening gap between them.` },
    { loId: 'm6sci.types-of-plate-boundaries', content: `CONVERGENT boundaries -- the two plates are moving TOGETHER, so the gap between them keeps shrinking. Two real examples: the Andes mountains in South America sit above a boundary where a plate carrying open ocean floor is moving toward the plate that carries the South American continent, and the Himalayas in Asia sit above a boundary where the plate carrying India has been moving toward the plate carrying the rest of Asia for tens of millions of years. What each of these convergent boundaries builds, and why the two build different things, is the next lesson -- here, the only fact that matters is that in both places the two plates are closing the distance between them.` },
    { loId: 'm6sci.types-of-plate-boundaries', content: `TRANSFORM boundaries -- the two plates are sliding PAST each other, so the gap between them stays about the same even though both sides are moving. California's San Andreas Fault marks a transform boundary: the Pacific plate and the North American plate grind past each other, and the friction of two enormous plates sliding past one another is exactly what produces the fault's frequent earthquakes -- even though no new mountain range and no new ocean floor is being built there.` },
    { loId: 'm6sci.types-of-plate-boundaries', content: `THE FIRST TRAP: DIFFERENT DIRECTIONS IS NOT THE SAME AS CONVERGENT. At a transform boundary, the two sides really are moving in different directions -- one north, say, and one south. That can look like a collision if you only glance at the directions. The question that actually decides the type is whether the DISTANCE ACROSS the boundary is shrinking, growing, or staying the same. Shrinking is convergent. Growing is divergent. Staying about the same, while both sides slide along the boundary, is transform.` },
    { loId: 'm6sci.types-of-plate-boundaries', content: `THE SECOND TRAP: A PLATE IS NOT THE SAME THING AS A CONTINENT. One plate can carry open ocean floor and a continent margin at the same time. A convergent boundary does not require two continents crashing together -- the Andes boundary is convergent even though only one side carries a continent, because a convergent boundary is defined by direction alone, not by what either plate happens to be carrying.` },
    { loId: 'm6sci.types-of-plate-boundaries', kind: 'definition', title: 'plate boundary', content: `the place where two of Earth's plates meet.` },
    { loId: 'm6sci.types-of-plate-boundaries', kind: 'definition', title: 'convergent boundary', content: `a plate boundary where the two plates are moving toward each other, closing the distance between them.` },
    { loId: 'm6sci.types-of-plate-boundaries', kind: 'definition', title: 'divergent boundary', content: `a plate boundary where the two plates are moving apart, opening the distance between them.` },
    { loId: 'm6sci.types-of-plate-boundaries', kind: 'definition', title: 'transform boundary', content: `a plate boundary where the two plates are sliding past each other, with the distance between them staying about the same.` },
    { loId: 'm6sci.types-of-plate-boundaries', kind: 'definition', title: 'relative motion', content: `how two plates are moving compared with each other, rather than how fast either one moves on its own.` },
  ],
  methods: [
    {
      title: 'Worked markers drifting apart',
      steps: [
        `Start with the one question that decides the type: which way are the two plates moving relative to each other?`,
        `The west marker is moving away from the boundary toward the west, and the east marker is moving away from the boundary toward the east. Both markers are moving away from each other.`,
        `The distance between them has been growing every year, which is the direct evidence that the two plates are pulling apart, not sliding past each other and not closing in.`,
        'Moving apart, with the gap growing, is the definition of a divergent boundary.',
        `A real boundary that matches this exact pattern is the Mid-Atlantic Ridge: the plate carrying the Americas is moving one way and the plate carrying Europe and Africa is moving the other way, so the ocean floor between them keeps widening.`,
        `Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The direction clue: each marker moves away from the boundary. The trend clue: the distance between the markers grows year after year, not just once. The definition clue: "moving apart" is exactly what the word divergent means, and nothing in the description suggests sliding or closing. Three different kinds of evidence, one answer. Second, change one thing about the setup and check that the answer moves with it: if both markers had instead drifted toward each other, with the gap shrinking, the same reasoning would give a convergent boundary, and if both markers had drifted the same direction along the line between them while staying the same distance apart, it would give a transform boundary. The direction data is doing the actual work.`,
      ],
      example: { problem: `Scientists place two markers on the ocean floor, one on each side of a plate boundary. Tracking the exact position of each marker for many years shows the west marker drifting steadily to the west and the east marker drifting steadily to the east -- and the distance between the two markers has been growing every year. What type of boundary is this?`, solution: `Divergent. Both markers move directly away from each other and the gap between them grows every year, matching a boundary like the Mid-Atlantic Ridge.` },
      relatedLoIds: ['m6sci.types-of-plate-boundaries'],
    },
    {
      title: 'Worked sliding not colliding',
      steps: [
        `Notice the direction of each motion first. Both sides are moving ALONG the line of the boundary -- one north, one south -- not toward it and not away from it.`,
        `Now check the distance ACROSS the boundary, which is the measurement that actually decides the type. The problem states that distance has stayed the same the whole time.`,
        `WRONG: "The two sides are moving in different directions, so they must be crashing together." CORRECT: "Moving in different directions along the boundary is not the same as moving toward each other across it. The distance across the boundary never changes here, so nothing is closing in."`,
        `Sliding along the boundary while the distance across it stays about the same is the definition of a transform boundary, not a convergent one.`,
        `A real boundary that matches this pattern is the San Andreas Fault: the Pacific plate slides past the North American plate along the fault line, and the grinding friction from that sliding produces the fault's frequent earthquakes, without building a new mountain range or a new stretch of ocean floor.`,
        `Now run the two checks. First, three clues of different kinds that agree: the direction clue (both motions run along the boundary, not across it), the distance clue (the gap across the boundary is constant), and the definition clue (sliding-with-no-change-in-gap is exactly what transform means). Second, change one thing and see the answer move: if the west side had instead been measured moving east, straight toward the boundary, while the east side stayed in place, the distance across would start shrinking every year, and the boundary would become convergent -- even though it is the very same boundary line.`,
      ],
      example: { problem: `A boundary runs north to south through a region. Surveys show that the land west of the boundary has been sliding steadily north, along the line of the boundary, while the land east of the boundary has been sliding steadily south, also along the line of the boundary. Measured straight across the boundary, from west to east, the distance between the two sides has stayed the same for as long as it has been surveyed. What type of boundary is this, and why is it not convergent?`, solution: `Transform. Both sides slide along the boundary and the distance across it does not change, matching a boundary like the San Andreas Fault; it is not convergent because nothing is closing the gap between the two sides.` },
      relatedLoIds: ['m6sci.types-of-plate-boundaries'],
    },
  ],
  pointers: [
    { content: `Students often say "A convergent boundary always means two continents crashing into each other." — A convergent boundary only requires two plates moving toward each other and closing the distance between them -- it does not require continents at all. The Andes mark a convergent boundary where a plate carrying open ocean floor is closing in on the plate that carries the South American continent, and that boundary is convergent for the same reason the Himalayas boundary is: the distance between the two plates is shrinking. What either plate happens to be carrying does not decide the type.`, kind: 'common-error' },
    { content: `Students often say "The San Andreas Fault must be convergent, because earthquakes only happen when plates crash together." — The San Andreas Fault is a transform boundary: the Pacific plate and the North American plate slide past each other, not toward or away from each other, and the friction of that sliding is exactly what produces its frequent earthquakes. Earthquakes tell you that plates are catching and slipping against each other -- they do not by themselves tell you which of the three directions the plates are moving in.`, kind: 'common-error' },
    { content: `A plate boundary is classified by ONE thing: the direction the two plates are moving relative to each other -- apart, together, or past.`, kind: 'tip' },
    { content: `DIVERGENT: plates move apart and the gap grows. Example: the Mid-Atlantic Ridge, where the plate carrying the Americas is moving away from the plate carrying Europe and Africa.`, kind: 'tip' },
    { content: `CONVERGENT: plates move together and the gap shrinks. Examples: the Andes (an ocean-floor plate closing in on the South American plate) and the Himalayas (the plate carrying India closing in on the plate carrying the rest of Asia).`, kind: 'tip' },
    { content: `TRANSFORM: plates slide past each other and the gap stays about the same. Example: California's San Andreas Fault.`, kind: 'tip' },
    { content: `Moving in different directions is not automatically convergent -- check whether the distance ACROSS the boundary is actually shrinking, growing, or staying the same.`, kind: 'tip' },
    { content: `A plate is not the same thing as a continent. A single plate can carry open ocean floor and a continent together, and a boundary's type is decided by direction alone -- never by whether either plate happens to be carrying a continent.`, kind: 'tip' },
    { content: `Earthquakes can happen at all three boundary types, not only where plates collide.`, kind: 'tip' },
    { content: `What each boundary type actually builds -- mountains, ridges, trenches -- is the next lesson. This lesson is about identifying the type from the motion alone.`, kind: 'tip' },
  ],
};
