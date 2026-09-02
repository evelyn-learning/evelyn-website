/**
 * Grade 6 World Geography — Earth's Physical Structure: Layers of the Earth.
 *
 * CONCEPT-LED fan-out row for m6geo (National Geography Standard 7). The
 * student has no procedure to run here, so the lesson installs one picture:
 * Earth is built of three layers, one nested inside the next -- the crust,
 * the mantle, and the core -- and each one can be told apart by where it
 * sits, how much space it fills, and what it is made of.
 *
 * SCOPE GUARD: this row identifies Earth's crust, mantle, and core by
 * relative POSITION (order from the surface to the center), relative SPACE
 * (which layer fills more of Earth's inside), and basic COMPOSITION and
 * TEMPERATURE (rock versus metal, and which layer is hottest). It treats the
 * core as ONE undivided layer. No depth in kilometers appears anywhere in
 * this file, and the core's state of matter (solid or liquid) is never
 * stated for exactly that reason -- see the cross-course note below.
 *   - CROSS-COURSE BOUNDARY (new for this wave): the sibling Grade 6 SCIENCE
 *     course already ships `m6sci-u3-earths-layered-structure.ts` on this
 *     same real-world subject, at a deeper level appropriate to that
 *     subject's own standard (DCI ESS2.A). That file splits the core into an
 *     outer core (liquid) and an inner core (solid), states every boundary's
 *     depth in kilometers, and explains why the inner core stays solid
 *     despite being the hottest layer (pressure versus temperature). None of
 *     that appears here. This row deliberately never states a state of
 *     matter for the core, precisely so it cannot contradict that more
 *     detailed split -- it describes the whole core only by composition
 *     (metal, not rock) and by temperature (hottest of the three), both of
 *     which hold true however the core is divided. A student taking both
 *     courses in the same year meets this row's three-part structure first,
 *     at position-and-composition depth, and meets the science course's
 *     two-part core split and its depth figures as a second, deeper pass on
 *     the same planet -- spiral review, not a contradiction.
 *   - A CHECKED NUMBER THAT DID NOT MAKE IT IN: an early draft of this file
 *     planned to call the mantle "Earth's thickest layer," a common way the
 *     fact gets stated. Checking it against the science sibling's own
 *     ledgered boundary depths (crust and mantle together to about 2,900
 *     kilometers; outer core to about 5,150; inner core to about 6,371) shows
 *     that the outer core and inner core ADDED TOGETHER span about 3,471
 *     kilometers -- more than the mantle's roughly 2,900. Once this row's
 *     core is treated as one combined layer, calling the mantle the single
 *     "thickest" layer by that radial-distance measure would be false. What
 *     IS true, and is what this row says instead, is that the mantle takes up
 *     more SPACE (volume) than the crust and the core put together: volume
 *     grows with the cube of the distance from the center, so a wide shell
 *     far from the center can hold more volume than a smaller-radius ball
 *     even with less radial reach. This is exactly the kind of checkable
 *     claim the dispatch warned about, and the note stays in the file so the
 *     next author on this subject does not have to rediscover it.
 *   - GRADE 7 BOUNDARY: no shipped `m7geo-*` file addresses Earth's internal
 *     layered structure directly. The nearest neighbor,
 *     `m7geo-u2-plate-tectonics-and-natural-hazards.ts`, mentions "crust"
 *     only at plate-boundary edges (for example, new crust forming at a
 *     divergent boundary) and assumes the crust/mantle vocabulary this row
 *     establishes; it never revisits layer identification. There is
 *     therefore no Grade 7 sentence on this exact subject to run Test 5 of
 *     the depth-ceiling checklist against; the operative comparison for this
 *     row is the cross-course one above.
 *   - GRADE 6 GEOGRAPHY NEIGHBOR: plate motion, and the fact that earthquakes
 *     and volcanoes cluster along plate edges, belong to the very next row,
 *     `m6geo-u3-earths-moving-plates.ts` (this row's followUp). No plate, no
 *     plate boundary, and no earthquake or volcano is named anywhere in this
 *     file.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea, step, and item stem below
 * is answered by IDENTIFY or LOCATE. The three layer names are a plain
 * vocabulary set, not a mechanism's typology, and every "because" in this
 * file is one plain-language link long.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%).
 * Every distractor below states a full wrong reason rather than a short wrong
 * label, and no key was built to be the longest choice because it is the key.
 * Measured as a diagnostic, not as a score: the key is the strictly longest
 * choice in 1 of the 3 items (item 2, "try-identify-the-crust," where the key
 * needs a qualifying clause the distractors do not). Character counts are in
 * the report, not repeated here. The three keys sit at ids b, c, and d -- the
 * id set `(3 + 1) mod 4 = 0` requires, omitting a.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U3_LAYERS_OF_THE_EARTH: LessonPlan = {
  id: 'evelyn.ms.m6geo.layers-of-the-earth.v1',
  title: 'Layers of the Earth',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.layers-of-the-earth',
      standard: 'M6GEO-3.1',
      description:
        "Identify Earth's crust, mantle, and core by their position and basic properties (National Geography Standard 7: the physical processes that shape the patterns of Earth's surface).",
    },
  ],
  prerequisites: ['m6geo.hemispheres-equator-and-prime-meridian'],
  followUps: ['m6geo.earths-moving-plates'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the ground feel like more than one thing before any layer is named.',
      script:
        "A question every kid has heard on a backyard afternoon: if you dug straight down, could you dig all the way through the planet and come out the other side? People joke about digging to China. The real answer starts with what is actually down there. Earth is not the same stuff all the way to the middle. It is built like a large ball with layers inside it, one layer sitting inside the next, and the deepest of those layers is farther from you right now than any place a person has ever traveled. Today you find out what those layers are, in what order they sit, and what tells one apart from another.",
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-layers',
      kind: 'concept',
      goal: "Install the three-layer model -- crust, mantle, core -- by position, relative space, and composition, without splitting the core into inner and outer parts.",
      keyIdeas: [
        "EARTH IS BUILT IN THREE MAIN LAYERS, ONE INSIDE THE NEXT. Starting at the surface and moving straight down toward the middle of the planet, the layers are, in order: the CRUST, the MANTLE, and the CORE. Each layer sits closer to the center than the layer before it, the way one nested layer of a large ball sits inside another.",
        "THE CRUST IS THE THIN, OUTERMOST LAYER. The crust is solid rock, and it is the layer right under the ground, the ocean floor, and every mountain. Of Earth's three layers, the crust is by far the thinnest, and it is the only one people have ever reached directly, through digging or drilling.",
        "THE MANTLE SITS IN THE MIDDLE, AND FILLS MOST OF EARTH'S INSIDE. The mantle sits between the crust and the core. It takes up more space inside Earth than the crust and the core put together. The mantle is solid rock, and it is extremely hot, hotter than the crust above it.",
        "THE CORE IS THE LAYER AT EARTH'S VERY CENTER. The core sits inside the mantle, at the middle of the planet, farther from the surface than either of the other two layers. Unlike the crust and the mantle, which are both rock, the core is made mostly of metal. Of Earth's three layers, the core is the hottest.",
        "A LAYER CAN BE IDENTIFIED BY WHERE IT SITS OR BY WHAT IT IS MADE OF. Position asks whether a layer is closest to the surface, in the middle, or at the very center. Makeup asks whether a layer is rock or metal, and how much space it fills. A description built from either kind of clue, or from both together, should point at the same layer.",
        "NOBODY HAS EVER DUG OR DRILLED ANYWHERE CLOSE TO THE MANTLE OR THE CORE. Every drilling project ever attempted has stayed inside the crust, without even reaching all the way through that thinnest layer in most places. What is known about the mantle and the core comes from other kinds of evidence, not from digging.",
      ],
      vocabulary: [
        { term: 'crust', definition: "Earth's thin, solid rock outermost layer, sitting right under the ground and the ocean floor." },
        { term: 'mantle', definition: 'the middle layer of Earth, between the crust and the core, that fills most of the space inside the planet.' },
        { term: 'core', definition: "the layer at Earth's very center, made mostly of metal rather than rock." },
        { term: 'composition', definition: 'what a layer is made of, such as rock or metal.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-locate-by-position',
      kind: 'worked_example',
      problem:
        "A scientist describes an object as: it sits at Earth's very center, farther from the surface than anything else inside the planet. Which of Earth's three layers is she describing?",
      steps: [
        'List the three layers in the order they sit, from the surface to the center: the crust first, the mantle in the middle, and the core last, at the very middle of the planet.',
        "Compare the description to that order. 'The very center, farther from the surface than anything else' can only match the layer named last, because every other layer sits somewhere between the surface and that point.",
        "WRONG: \"this must be the mantle, since the mantle takes up more space inside Earth than the other two layers.\" CORRECT: \"taking up more space tells you how much of Earth's inside a layer fills, not where its farthest point sits. The core takes up less space than the mantle, but it still reaches the one point that is farthest from the surface: the very center.\"",
        "Check by rereading the description again. 'Farther from the surface than anything else' rules out the crust immediately, since the crust is the closest layer to the surface, not the farthest. It also rules out the mantle, which sits between the crust and the core rather than at the extreme end. Only the core is left.",
        "Now test a contrasting case. An object described instead as 'sitting right where digging first reaches rock, closest to the surface of any of the three layers' would point to the opposite end of the same order: the crust.",
      ],
      answer:
        "The core. It is the layer at Earth's very center, farther from the surface than the crust or the mantle, even though it takes up less space inside Earth than the mantle does.",
      estimatedMinutes: 3,
    },
    {
      id: 'worked-identify-by-makeup',
      kind: 'worked_example',
      problem:
        'A sample is described three ways: it is solid rock, it is thin compared to the other two layers, and it is the only layer people have ever drilled into directly. Which layer is this, and why can it not be the mantle, even though the mantle is also solid rock?',
      steps: [
        'Take the three clues one at a time. Solid rock: true of both the crust and the mantle, so this clue alone does not decide the answer yet.',
        'Thin compared to the other two layers: only one layer is described that way in this lesson. The mantle fills most of Earth\'s inside, and the core sits at the center, so being the thin one points away from both of those and toward the crust.',
        'The only layer people have drilled into directly: this matches the crust again, since the crust is the layer right under the ground and the ocean floor, within reach of digging and drilling.',
        'WRONG: "since the mantle is also solid rock, either the crust or the mantle could be right." CORRECT: "solid rock only narrows the answer down to the crust or the mantle, ruling out the core. The other two clues, thinness and being reachable by drilling, are what settle it between those two, and both of them point to the crust."',
        'Put the three clues together. Solid rock rules out the core. Thinness rules out the mantle. Being reachable by drilling also rules out the mantle. All three clues agree on the same layer.',
        'This is the check to remember. One clue by itself can leave more than one layer possible. Three clues that are different kinds, all agreeing, settle it.',
      ],
      answer:
        'The crust. It is solid rock like the mantle, but it is also the thinnest of the three layers and the only one people have ever drilled into directly -- two clues the mantle does not match.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-order-of-three-layers',
      kind: 'try_yourself',
      problem: "Starting at Earth's surface and moving straight down to the very center, what is the correct order of Earth's three layers?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Core, then mantle, then crust -- because the word core sounds like it should be the very first layer reached, before anything else.' },
        { id: 'b', text: 'Crust, then mantle, then core -- each layer sits farther from the surface and closer to the center than the layer before it, ending at the very middle.', correct: true },
        { id: 'c', text: 'Crust, then core, then mantle -- because only the crust and the core are pictured as real layers, so the mantle is placed last instead of in between them.' },
        { id: 'd', text: 'Mantle, then crust, then core -- because the mantle is pictured as filling the most space, so it is placed as if it were the outermost layer instead of the middle one.' },
      ],
      expectedAnswer: 'Crust, then mantle, then core -- each layer sits farther from the surface and closer to the center than the layer before it, ending at the very middle.',
      hints: [
        'Start at the surface and go straight down. Which layer is the one a person could actually dig into first?',
        'Of the three layers, only one sits at the very center. Which name goes with the layer in between the outermost layer and that one?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-the-crust',
      kind: 'try_yourself',
      problem: 'Which of Earth\'s three layers is described as: thin compared to the other two, made of solid rock, and the only layer people have ever drilled into directly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The mantle, since it is also made of solid rock, and any layer made of rock is assumed to be described the same way.' },
        { id: 'b', text: 'The core, since being the only layer people have reached is assumed to mean the most extreme layer of all, the one at the very center.' },
        { id: 'c', text: 'The crust, since it is the thinnest of the three layers and it sits just under the ground and the ocean floor, right where digging starts.', correct: true },
        { id: 'd', text: 'Both the crust and the mantle together, since a drill has to pass through the crust before it could ever reach the mantle underneath it.' },
      ],
      expectedAnswer: 'The crust, since it is the thinnest of the three layers and it sits just under the ground and the ocean floor, right where digging starts.',
      hints: [
        'Three separate clues are given. Ask which single layer matches all three, not just one of them.',
        'Solid rock alone cannot decide it, since two of the three layers are rock. Thinness and being reachable by drilling are the clues that settle which of those two it is.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-the-core',
      kind: 'try_yourself',
      problem: "A sample is described as: found at Earth's very center, and made mostly of metal rather than rock. Which layer does this describe, and why can it not be the crust or the mantle?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The crust, because the crust is the layer closest to people, and anything ever found by digging is assumed to be crust.' },
        { id: 'b', text: 'The mantle, because the mantle fills the most space inside Earth, and the layer that fills the most space is assumed to reach all the way to the center.' },
        { id: 'c', text: 'Either the crust or the mantle, since together those two layers make up everything a drill could ever possibly reach.' },
        { id: 'd', text: "The core, because it sits at the very center of the planet and is made mostly of metal, unlike the rock that makes up the crust and the mantle.", correct: true },
      ],
      expectedAnswer: "The core, because it sits at the very center of the planet and is made mostly of metal, unlike the rock that makes up the crust and the mantle.",
      hints: [
        'Two separate clues are given: where the sample was found, and what it is made of. Both have to match the same layer.',
        'The crust and the mantle are both rock. A sample described as metal instead of rock cannot be either one of them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-uniform-rock-and-mantle-size',
      kind: 'misconception_check',
      question:
        "A student says: \"Earth's whole inside must be solid rock all the way to the center, the same as the ground under our feet. And the mantle must be a thin layer, since it is a short, ordinary-sounding word.\" What is wrong with each half of that?",
      commonErrors: [
        {
          answer: "Earth's whole inside must be solid rock all the way to the center, the same as the ground under our feet.",
          misconception:
            'Assuming that because the surface feels like solid rock, every layer underneath it is made of the exact same material.',
          correctsTo:
            "Earth's three layers are not all the same material. The crust and the mantle are both solid rock, but the innermost layer, the core, is made mostly of metal rather than rock. Where a layer sits does not decide what it is made of, and this lesson checks both separately.",
        },
        {
          answer: 'The mantle must be a thin layer, since it is a short, ordinary-sounding word.',
          misconception:
            'Letting how short or familiar a word sounds decide the size of the layer it names, instead of checking what this lesson actually says about it.',
          correctsTo:
            "The mantle is not thin. Of Earth's three layers, the mantle fills more space than the crust and the core put together. A word's length or how ordinary it sounds is not a reliable clue to a layer's size.",
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Earth has three main layers, one inside the next: the crust, the mantle, and the core, in that order from the surface to the center.',
        'The crust is the thin, outermost layer. It is solid rock, and it is the only layer people have ever reached directly, through digging or drilling.',
        "The mantle sits in the middle, between the crust and the core, and it fills more space inside Earth than the crust and the core put together. It is solid rock, and it is very hot.",
        "The core sits at Earth's very center, inside the mantle. It is made mostly of metal rather than rock, and of the three layers it is the hottest.",
        'A layer can be identified by where it sits or by what it is made of. Both kinds of clue should point at the same layer.',
        'Nobody has ever dug or drilled anywhere close to the mantle or the core. What is known about them comes from other kinds of evidence, not from digging.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Layers of the Earth' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
