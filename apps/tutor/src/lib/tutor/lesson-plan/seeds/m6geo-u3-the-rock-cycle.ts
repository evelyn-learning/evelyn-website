/**
 * Grade 6 World Geography — Earth's Physical Structure: The Rock Cycle.
 *
 * CONCEPT-LED plan for the m6geo fan-out (National Geography Standard 7).
 * The scope line asks for two things: describe igneous, sedimentary, and
 * metamorphic rock, and explain how the rock cycle slowly changes one type
 * into another. This file gives each rock type a one-clause formation
 * definition, then states -- as a single plain fact, never a traced,
 * multi-step mechanism -- that heat, pressure, and melting followed by
 * cooling can slowly turn one type into a different type over an extremely
 * long time, and that there is no one path every rock has to follow.
 *
 * SCOPE GUARD: this row DEFINES the three rock types by a one-clause
 * formation description each (melted-then-cooled; loose pieces settled and
 * pressed together; an existing rock changed by heat and pressure without
 * melting), and STATES that one type can slowly change into another given
 * enough time, with no fixed order. It never traces a named, multi-step
 * process chain, never asks the student to read a texture (crystal size,
 * banding, foliation) back to a formation process, and never uses the words
 * weathering, erosion, deposition, compaction, or cementation anywhere in
 * this file.
 *
 *   - CROSS-COURSE BOUNDARY (the operative one for this row): the sibling
 *     Grade 6 SCIENCE course covers this exact subject across two shipped
 *     files, `m6sci-u3-the-three-rock-types.ts` and
 *     `m6sci-u3-the-rock-cycle.ts`, and this single geography row covers
 *     what those two rows split between them. This file is deliberately
 *     shallower than either, not a compression of both: it never teaches
 *     the classification SKILL those files build (reading crystal size,
 *     layering-versus-foliation, or cooling rate back to a formation
 *     process from a texture description) -- every classification item here
 *     is handed the formation process directly in the problem's own words,
 *     never a texture to translate. It never names the seven-process
 *     framework (melting, cooling, weathering, erosion, deposition,
 *     compaction, cementation, heat-and-pressure) as an enumerated,
 *     traceable system, and no item asks the student to trace or read
 *     backward a chain of more than one step. The reasoning behind any
 *     change of type in this file is always exactly one link long: one
 *     named condition (fully melted and cooled, or heated and squeezed
 *     without melting) producing one resulting type. This file does not
 *     contradict either shipped science file: it honors their strict
 *     weathering-versus-erosion distinction by never using either word, and
 *     it honors their no-fixed-order rule for the cycle by stating plainly,
 *     and demonstrating in the second worked example, that the same
 *     starting rock can reach either of two different endings depending on
 *     what actually happens to it -- without ever asserting or implying a
 *     required sequence of types.
 *   - GRADE 7 WORLD GEOGRAPHY boundary: none of the 40 shipped `m7geo-*.ts`
 *     files (checked by name and by full-text search for "rock") teaches
 *     rock classification or the rock cycle at all -- Grade 7's own
 *     physical-geography unit covers plate boundaries
 *     (`m7geo-u2-plate-tectonics-and-natural-hazards.ts`) and landforms
 *     built by erosion and deposition
 *     (`m7geo-u2-landforms-and-water-features.ts`), neither of which
 *     classifies a rock by how it formed or traces a change from one rock
 *     type to another. There is therefore no Grade 7 World Geography file
 *     for this row to stay under; the depth ceiling that actually binds
 *     this row is set by the sibling science course, per the paragraph
 *     above, not by a Grade 7 geography lesson on the same subject.
 *   - What IS deliberately allowed, because the scope line asks for it
 *     directly: naming and defining all three rock types by name (the
 *     assignment, not a forbidden typology); the single vocabulary term
 *     "magma" for melted rock, merging the underground/surface distinction
 *     into one definition rather than splitting it into magma-versus-lava
 *     with a cooling-rate consequence (that split, and what it does to
 *     crystal size, is the science course's own classification skill); and
 *     the plain, one-sentence statement that the rock cycle has no fixed
 *     order, because the scope line's second half ("explain how the rock
 *     cycle slowly changes one type into another") cannot be honestly
 *     answered while implying a false fixed loop.
 *
 * ANSWER-CUE NOTE: all three MCQs are written against DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice
 * 67% of the time; chance is 25%). Choices are built in parallel
 * "[Type] rock, because ..." form. Measured, not targeted: the key is the
 * strictly longest choice in NONE of the three items (character counts:
 * item 1 -- 90, 96, 110, 93, key is the 90; item 2 -- 96, 106, 117, 108, key
 * is the 106; item 3 -- 98, 106, 116, 103, key is the 103). A count of zero
 * is not itself a target reached; chance alone produces zero in a
 * three-item file about 42% of the time. Per DF-1, the three keys sit at
 * ids a, b and d, which is the id set `(3 + 3) mod 4 = 2` requires, omitting
 * c.
 *
 * NOTE ON prerequisites/followUps: this row's chain is
 * earths-moving-plates -> the-rock-cycle -> weathering-erosion-and-deposition,
 * all three authored in the same 40-row batch, so both arrays are populated
 * with their real loIds per the fan-out contract and the lesson brief.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it, and no real place is named anywhere in
 * this file.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U3_THE_ROCK_CYCLE: LessonPlan = {
  id: 'evelyn.ms.m6geo.the-rock-cycle.v1',
  title: 'The Rock Cycle',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.the-rock-cycle',
      standard: 'M6GEO-3.3',
      description:
        'Describe igneous, sedimentary, and metamorphic rock and explain how the rock cycle slowly changes one type into another (National Geography Standard 7: the physical processes that shape the patterns of Earth\'s surface).',
    },
  ],
  prerequisites: ['m6geo.earths-moving-plates'],
  followUps: ['m6geo.weathering-erosion-and-deposition'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make three unlike-looking rocks feel connected by a hidden formation story, and plant the idea that no rock is stuck being one type forever.',
      script:
        'Pick up three different rocks from a schoolyard or a hiking trail and they can look nothing alike. One might be smooth and gray with tiny sparkly flecks in it. Another might be dull and gritty, almost like hardened sand. A third might be hard with faint stripes running through it. It is easy to think a rock is just a rock, but every single one of those three has its own different story about how it was made. And here is the part that sounds impossible: none of those stories has to be the end of it. Given enough time, a rock that is one type today can slowly become a completely different type. Today you find out what the three types are, and how one can turn into another.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-types-and-the-cycle',
      kind: 'concept',
      goal: 'Give each rock type a one-clause formation definition, then install the single fact that types can slowly change into each other, with no fixed order.',
      keyIdeas: [
        'ROCKS ARE SORTED INTO THREE TYPES, BY HOW EACH ONE FORMED. Every rock belongs to one of three types: IGNEOUS rock, SEDIMENTARY rock, and METAMORPHIC rock. Two rocks can look completely different and still be the same type, and two rocks that look alike can belong to different types, because what actually decides the type is how the rock was made, not its color or its size.',
        'IGNEOUS ROCK FORMS WHEN MELTED ROCK COOLS AND HARDENS. Rock can get hot enough to melt completely, whether that happens deep underground or after the melted rock reaches the surface. Melted rock is called MAGMA. When magma cools, it hardens back into solid rock, and that solid rock is igneous rock.',
        'SEDIMENTARY ROCK FORMS WHEN LOOSE PIECES ARE PRESSED TOGETHER. Small, loose pieces of rock, sand, or mud can settle into a layer, one on top of another. Over a very long time, the weight of the layers and minerals filling the gaps between the pieces press and glue those loose pieces into one solid rock. That solid rock is sedimentary rock.',
        'METAMORPHIC ROCK FORMS WHEN AN EXISTING ROCK CHANGES WITHOUT FULLY MELTING. Take a rock that already exists -- of any type -- and put it under intense heat and pressure, and it can change into a new kind of rock while never fully melting. That new rock is metamorphic rock. A rock that fully melts and then cools again becomes igneous rock instead, never metamorphic rock.',
        'OVER A VERY LONG TIME, ONE TYPE OF ROCK CAN SLOWLY CHANGE INTO ANOTHER TYPE. Heat, pressure, and melting followed by cooling can slowly turn one type of rock into a different type. This slow, ongoing change is called the ROCK CYCLE. It happens far too slowly for anyone to watch it happen -- the change takes an extremely long time, not a single human lifetime.',
        'THE ROCK CYCLE HAS NO SINGLE PATH EVERY ROCK MUST FOLLOW. The same starting rock does not always end up becoming the same next type. What happens to a rock -- whether it melts completely, or is squeezed by heat and pressure without melting -- decides what it becomes, not what type it already is. The same starting rock could end up as either of the other two types, depending on what actually happens to it.',
      ],
      vocabulary: [
        { term: 'igneous rock', definition: 'rock that forms when melted rock, called magma, cools and hardens into a solid.' },
        { term: 'sedimentary rock', definition: 'rock that forms when loose pieces of rock, sand, or mud are pressed together over a very long time.' },
        { term: 'metamorphic rock', definition: 'rock that forms when an existing rock is changed by heat and pressure without fully melting.' },
        { term: 'magma', definition: 'rock that has melted completely, whether it is still underground or has reached the surface.' },
        { term: 'rock cycle', definition: 'the slow, ongoing change of one rock type into another over a very long time, with no single fixed order.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-classify-igneous',
      kind: 'worked_example',
      problem:
        'A geologist describes a rock this way: it formed when melted rock deep underground slowly cooled and hardened into solid rock. What type of rock is this -- igneous, sedimentary, or metamorphic -- and how can you be sure no other type fits just as well?',
      steps: [
        'Start with the definition of each type. Igneous rock forms when melted rock cools and hardens. Sedimentary rock forms when loose pieces of rock, sand, or mud are pressed together. Metamorphic rock forms when an existing rock is changed by heat and pressure without fully melting.',
        'Match the description to one definition. The rock formed from melted rock that cooled and hardened. That matches the definition of igneous rock exactly.',
        'Now rewind the description and check the other two definitions on purpose, instead of stopping at the first match. Nowhere does it mention loose pieces settling into a layer, so sedimentary does not fit. Nowhere does it mention an existing rock being changed by heat and pressure, so metamorphic does not fit either. Igneous is the only definition that matches every part of the description.',
        'Test the same routine on a different rock, so it does not get memorized as one fixed answer. Suppose instead the description said: this rock formed when layers of sand were pressed together over a very long time, with no melting mentioned anywhere. Running the same three checks gives sedimentary rock instead -- the routine changes its answer when the description changes, which is what a routine is supposed to do.',
        'The routine stays the same every time: match the description to a definition, then check that the other two definitions do not also fit.',
      ],
      answer:
        'Igneous rock. It formed from melted rock that cooled and hardened, and nothing in the description matches settling sediment or an existing rock changed by heat and pressure.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-one-rock-two-endings',
      kind: 'worked_example',
      problem:
        'A rock used to be a sedimentary rock. Deep underground, intense heat and pressure changed it into a new kind of rock, and at no point did it fully melt. What type of rock is it now, and would the answer change if it had fully melted instead?',
      steps: [
        'Match the description to a definition first. Heat and pressure changing an existing rock, without the rock ever fully melting, is the definition of metamorphic rock.',
        'Apply it. The rock started as sedimentary rock, and heat and pressure changed it without melting it, so it is now metamorphic rock.',
        'Rewind and rule out the other two on purpose. It cannot be igneous, because igneous rock requires the rock to fully melt, and this rock never melted. It cannot still be sedimentary, because it was already a solid rock before the heat and pressure acted on it -- nothing here describes loose pieces settling and being pressed together for the first time.',
        'WRONG: "Heat always means a rock has melted." CORRECT: "A rock can be squeezed by intense heat and pressure for a very long time and never fully melt -- that is exactly what makes it metamorphic instead of igneous."',
        'Now change one detail and test the routine again. Suppose instead the rock had gotten so hot underground that it fully melted into liquid rock, and later cooled and hardened again. Melting followed by cooling is the definition of igneous rock, so that same starting sedimentary rock would end up igneous instead of metamorphic.',
        'Notice what decided the outcome both times: not what the rock used to be, but which change actually happened to it. The same starting rock can reach two different endings, because two different things can happen to it.',
      ],
      answer:
        'Metamorphic rock, because heat and pressure changed the existing sedimentary rock without it ever melting. If it had fully melted and then cooled instead, it would be igneous rock rather than metamorphic rock.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-igneous-from-melting',
      kind: 'try_yourself',
      problem:
        'A rock formed when melted rock flowed out through a crack in the ground and then cooled and hardened into solid rock. Nothing in the description mentions loose sediment settling, or an existing solid rock being changed by heat. What type of rock is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Igneous rock, because it formed from melted rock that cooled and hardened into solid rock.', correct: true },
        { id: 'b', text: 'Sedimentary rock, because the melted rock settled into a layer as it slowly cooled and hardened.' },
        { id: 'c', text: 'Metamorphic rock, because intense heat from the melted rock changed an existing solid rock without melting it.' },
        { id: 'd', text: 'Metamorphic rock, because the rock spent time underground before it ever reached the surface.' },
      ],
      expectedAnswer: 'Igneous rock, because it formed from melted rock that cooled and hardened into solid rock.',
      hints: [
        'Ask what actually happened to the rock first: did it start out as melted rock, as loose pieces settling into a layer, or as an existing solid rock being changed by heat?',
        'The description only mentions melted rock cooling and hardening. That single fact rules out any answer built around settling sediment or an existing solid rock.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-sedimentary-from-settling',
      kind: 'try_yourself',
      problem:
        'A rock is described as being made of small grains of sand that settled into a layer and were slowly pressed together into solid rock over a very long time. Nothing in the description mentions melted rock or an existing rock being changed by heat and pressure. What type of rock is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Igneous rock, because grains of sand are really just tiny crystals that cooled from melted rock.' },
        { id: 'b', text: 'Sedimentary rock, because it formed from loose grains that settled into a layer and were pressed together.', correct: true },
        { id: 'c', text: 'Metamorphic rock, because pressing grains together underground is the same as changing a rock with heat and pressure.' },
        { id: 'd', text: 'Igneous rock, because any rock that takes a very long time to form must have cooled slowly from melted rock.' },
      ],
      expectedAnswer: 'Sedimentary rock, because it formed from loose grains that settled into a layer and were pressed together.',
      hints: [
        'Check whether the description ever mentions melted rock cooling, or an existing solid rock being changed by heat and pressure.',
        'The description only mentions loose grains settling into a layer and then being pressed together. That single fact matches one type of rock and rules out the other two.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-one-rock-different-ending',
      kind: 'try_yourself',
      problem:
        'A rock used to be an igneous rock. Deep underground, intense heat and pressure changed it into a new kind of rock, and it never melted at any point. What type of rock is it now?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Igneous rock, because intense heat underground always means a rock has fully melted at some point.' },
        { id: 'b', text: 'Sedimentary rock, because being squeezed underground is the same as loose sediment being pressed together.' },
        { id: 'c', text: 'Igneous rock, because the rock was already igneous, and heat and pressure cannot change what type a rock already is.' },
        { id: 'd', text: 'Metamorphic rock, because an existing rock was changed by heat and pressure without ever fully melting.', correct: true },
      ],
      expectedAnswer: 'Metamorphic rock, because an existing rock was changed by heat and pressure without ever fully melting.',
      hints: [
        'Check the one detail the description states directly: did the rock ever fully melt at any point?',
        'Heat and pressure changing an already-existing rock, without it ever melting, is the definition of exactly one of the three rock types.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fixed-order-and-heat-means-melted',
      kind: 'misconception_check',
      question:
        'A student says: "The rock cycle always goes in the same order -- igneous, then sedimentary, then metamorphic, then back to igneous again. Also, if a rock gets very hot, it must have melted." Two separate things are wrong with that. What are they?',
      commonErrors: [
        {
          answer: 'The rock cycle always goes in the same order: igneous, then sedimentary, then metamorphic, then back to igneous again.',
          misconception:
            'Picturing the rock cycle as a single circle with one direction of travel, because the word cycle sounds like it should mean one repeating loop.',
          correctsTo:
            'The rock cycle has no single fixed order. The same starting rock can end up as either of the other two types, depending on what actually happens to it -- heat and pressure without melting changes any rock into metamorphic rock directly, and melting followed by cooling changes any rock into igneous rock directly, with no required stop along the way.',
        },
        {
          answer: 'If a rock gets very hot, it must have melted.',
          misconception:
            'Assuming that intense heat always means a rock has turned to liquid, because heat and melting are easy to picture as the same thing.',
          correctsTo:
            'A rock can be squeezed by intense heat and pressure for a very long time and never fully melt. That is exactly what makes a rock metamorphic instead of igneous. A rock only becomes igneous rock if it fully melts into magma and then cools and hardens again.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Rocks are grouped into three types by how each one formed: igneous rock, sedimentary rock, and metamorphic rock.',
        'Igneous rock forms when melted rock, called magma, cools and hardens into a solid.',
        'Sedimentary rock forms when loose pieces of rock, sand, or mud settle into a layer and are pressed together over a very long time.',
        'Metamorphic rock forms when an existing rock is changed by heat and pressure without fully melting.',
        'Over a very long time, heat, pressure, and melting followed by cooling can slowly change one type of rock into a different type. This slow change is called the rock cycle.',
        'The rock cycle has no single fixed order -- the same starting rock can end up as either of the other two types, depending on what actually happens to it.',
        'A rock only becomes igneous rock if it fully melts and then cools again. Heat and pressure without melting instead produce metamorphic rock.',
        'This change happens over an extremely long time, far too slowly for anyone to see it happening.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'The Rock Cycle' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
