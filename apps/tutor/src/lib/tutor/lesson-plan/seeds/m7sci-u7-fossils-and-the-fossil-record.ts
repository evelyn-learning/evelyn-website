/**
 * Grade 7 Science (Life Science) — Evolution: Fossils & the Fossil Record.
 *
 * Concept-led row for the m7sci course (NGSS MS-LS4-1). The lesson does two
 * jobs: it teaches what a fossil actually is (usually NOT the original bone),
 * and it teaches how the ORDER of undisturbed rock layers turns a pile of
 * fossils into a record of change over time.
 *
 * The intellectually honest core is the second half: the fossil record is
 * INCOMPLETE, and a gap in it is missing evidence rather than evidence
 * against change. Say that out loud rather than hiding it.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every rock
 * layer sequence here is written out in words ("From top to bottom the layers
 * are ...") and every item is solvable from the words printed in it. Also
 * note the two accuracy fences kept throughout: no precise ages or dates are
 * stated anywhere, and no organism is ever called primitive, advanced or more
 * evolved than another.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U7_FOSSILS_AND_THE_FOSSIL_RECORD: LessonPlan = {
  id: 'evelyn.ms.m7sci.fossils-and-the-fossil-record.v1',
  title: 'Fossils & the Fossil Record',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.fossils-and-the-fossil-record',
      standard: 'M7SCI-7.1',
      description:
        'Explain how fossils form and why they are rare, use the order of undisturbed rock layers to place fossils from oldest to youngest, and analyze that ordered record as evidence that the kinds of living things on Earth have changed over time (NGSS MS-LS4-1).',
    },
  ],
  prerequisites: ['m7sci.mutations-and-variation'],
  followUps: ['m7sci.evidence-for-common-ancestry'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor fossilization in a familiar accident: a print left in mud that happens to survive.',
      script:
        'You walk across wet mud in the yard and leave a footprint. Most days the next rain smooths it away and nothing is left. But suppose that same afternoon a storm washes a load of sand over your print before it can dry out. The sand fills the shape. The mud underneath hardens. Your foot was never in that spot again, yet the shape of it is still there. That is almost exactly how a fossil happens, and it explains something surprising: fossils are not common. Almost every living thing that has ever died left nothing behind at all. Today we look at the ones that did, at the order they are stacked in, and at what that order tells us.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-fossil-record',
      kind: 'concept',
      goal: 'Define a fossil correctly, explain why fossilization is rare, establish superposition with its undisturbed condition, and read the ordered record as evidence of change without implying direction.',
      keyIdeas: [
        'WHAT A FOSSIL IS — a fossil is the preserved remains or traces of a living thing from long ago. Most fossils are not the original material. Over a very long time, water carrying dissolved minerals seeps into a buried bone or shell and the minerals slowly take the place of the original substance, so what you hold is rock in the exact shape of a bone. Others are only an impression: a mold left where a shell dissolved away, a cast where sediment filled that mold, or a TRACE fossil such as a footprint, a burrow or a tooth mark. WRONG: "A fossil is the actual bone of the animal, still there." CORRECT: "A fossil is usually rock that has taken the shape of the remains, or a mark the organism left behind."',
        'WHY FOSSILS ARE RARE — becoming a fossil takes an unlikely accident. The organism usually has to be buried quickly, in sediment such as mud or sand, before scavengers, insects and decay take it apart. Hard parts like bones, shells and teeth survive burial far more often than soft parts. A jellyfish, a worm or a leaf usually leaves nothing. So the fossils we have are not a fair sample of everything that lived. They lean heavily toward hard-bodied things that died in the right place at the right moment.',
        'SUPERPOSITION PUTS THE FOSSILS IN ORDER — sediment settles in flat layers, one on top of the older ones. So in UNDISTURBED rock layers, a deeper layer formed earlier than the layers above it, which means the deeper layer is older. That rule is called superposition, and it is what turns a scattered pile of fossils into a record with an order. Notice the word undisturbed. Earth processes can tilt layers, fold them, break them along a crack or wear a set of layers away entirely, so geologists first check whether a stack has been disturbed. Saying "the deepest layer is the oldest in undisturbed rock" is accurate; saying "the deepest layer is always the oldest" is not.',
        'WHAT THE ORDER SHOWS — read an undisturbed stack from the bottom upward and three patterns appear again and again. The kinds of living things found in the lower layers are often not found in the upper ones, which tells us that many kinds of organisms once existed and no longer exist anywhere. Kinds appear in upper layers that are absent from every layer below. And the organisms in nearby layers usually resemble each other more closely than organisms in layers far apart. Put together, the fossil record is evidence that life on Earth has CHANGED over time. Be careful how you say it: the record shows change, not improvement. An organism in an upper layer is not more advanced, more evolved or better than one below it. It is later.',
        'THE RECORD IS FULL OF HOLES, AND SCIENTISTS SAY SO — because fossilization is rare, because soft bodies almost never fossilize, and because rock layers get eroded or disturbed, the fossil record is INCOMPLETE. Everyone who works on it knows this. Here is the reasoning that matters: if a kind of organism is missing from a layer, the honest conclusion is that no fossil of it was FOUND there. That is missing evidence. It is not evidence that the organism never lived, and a gap in the record is not evidence against life changing over time. Absence of a fossil is weak information, because so many organisms leave no fossil at all.',
        'THE STACK-OF-DRAWINGS COMPARISON, AND WHERE IT BREAKS — imagine a pile of drawings on a desk, each one added on top of the last, so the bottom sheet is the oldest. Reading the pile from the bottom up shows how the drawings changed. That is a fair way to think about a rock stack. Now name the limit, because it matters twice. Nobody placed the layers there on purpose and no plan was being followed. And unlike a tidy pile, whole sheets are missing, some were never made in the first place, and Earth processes can shuffle or tip the stack. Use the comparison to hold the idea of order, then drop it.',
      ],
      vocabulary: [
        { term: 'fossil', definition: 'the preserved remains or traces of a living thing from long ago, usually turned to rock or left as an impression.' },
        { term: 'trace fossil', definition: 'a preserved mark left by an organism rather than part of its body, such as a footprint, a burrow or a tooth mark.' },
        { term: 'sediment', definition: 'small pieces of material such as mud, sand or silt that settle out of water or air and can bury remains.' },
        { term: 'superposition', definition: 'the rule that in undisturbed rock layers, each layer is older than the layers above it.' },
        { term: 'fossil record', definition: 'all the fossils found in Earth rocks, taken together and placed in order of age.' },
        { term: 'extinct', definition: 'describing a kind of organism that no longer exists anywhere on Earth.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-read-the-layers',
      kind: 'worked_example',
      problem:
        'A cliff by a river shows four rock layers that geologists have checked and found undisturbed. From top to bottom the layers are W, X, Y and Z. Layer W contains fossils of small shelled sea animals of a kind still alive in the ocean today. Layer X contains fossils of a large reptile that is not found alive anywhere now. Layer Y contains fossils of a fish covered in heavy bony plates that is not found alive anywhere now. Layer Z contains fossils of tiny shelled organisms and nothing else. Put the layers in order from oldest to youngest, and state what this stack is evidence of.',
      steps: [
        'First check the condition before using the rule. The problem says the layers are undisturbed, so superposition applies here. If the layers had been tilted or folded, this reasoning would not be safe.',
        'Apply superposition. Sediment settles on top of what is already there, so the deepest layer formed first. Z is the deepest, then Y, then X, and W is at the top.',
        'Write the order from oldest to youngest: Z, then Y, then X, then W. A common slip is to read the list in the order it was printed, top to bottom, and call W the oldest. Printed first does not mean deposited first.',
        'Now read the fossils in that order rather than in printed order. Oldest to youngest: tiny shelled organisms, then a plated fish, then a large reptile, then small shelled sea animals of a kind still living.',
        'Ask what changed. The plated fish is in Y and in no layer above it. The large reptile is in X and in no layer above it. Both are kinds of organisms that once existed and are not found alive now. So the stack records organisms disappearing.',
        'Ask what appeared. The large reptile shows up in X and is absent from Y and Z below it. So the stack also records kinds of organisms turning up that were not there earlier.',
        'State the conclusion in careful language. This stack is evidence that the kinds of living things on Earth have changed over time. Do NOT say the fish in Y was primitive or that the reptile in X was more advanced. Being in a higher layer means later, and nothing more.',
      ],
      answer:
        'Oldest to youngest the layers are Z, Y, X, W. The stack is evidence that the kinds of living things have changed over time: organisms found in the lower layers are not found alive today, and organisms appear in upper layers that are absent from every layer below.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-missing-from-the-record',
      kind: 'worked_example',
      problem:
        'A shallow pond is home to two kinds of animals: snails with hard shells, and soft-bodied worms that burrow in the mud at the bottom. Long after the pond fills in and the mud hardens into rock, scientists split the rock open. They find many snail shell fossils and not one worm body. A student concludes that no worms ever lived in that pond. Is that conclusion supported? Explain.',
      steps: [
        'Start with what fossilization needs: quick burial in sediment, and, most of the time, hard parts that resist decay long enough to be buried.',
        'Sort the two animals by that requirement. A snail shell is hard and made of material that survives burial well. A worm body is soft and is broken down by decay and by other organisms within days.',
        'So the two animals never had an equal chance of being preserved. Finding shells and no worm bodies is exactly what you would expect even if the pond had been full of worms.',
        'Look for the other kind of evidence. The worms burrowed in the mud, and a burrow can be preserved as a TRACE fossil. If the scientists find preserved burrows in the rock, they have evidence of the worms without any worm body at all.',
        'Now name the reasoning error. WRONG: "There are no worm fossils, so no worms lived here." CORRECT: "There are no worm fossils found here, and soft-bodied animals rarely leave fossils, so this rock cannot tell us much either way."',
        'Carry the same caution up to the whole fossil record. The record is incomplete for these same reasons, so a gap tells you that a fossil was not found, not that an organism was never there.',
      ],
      answer:
        'No. Soft-bodied worms decay quickly and rarely fossilize, while hard snail shells fossilize far more easily, so finding only shells is expected either way. The missing worms are missing evidence, not evidence that worms were absent, and preserved burrows could still record them.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-layer-sequence',
      kind: 'try_yourself',
      problem:
        'A road cut exposes five rock layers that have been checked and found undisturbed. From top to bottom the layers are P, Q, R, S and T. Fossils of one kind of clam are found in layer S and in layer R, and in none of the other three layers. Which statement is best supported by this stack?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The clam lived during the time when layers S and R were forming, and its fossils were not found in the other layers here.', correct: true },
        { id: 'b', text: 'The clam is older than everything in layer T, because layers closer to the top formed first.' },
        { id: 'c', text: 'The clam did not exist anywhere on Earth while layer Q was forming, because layer Q holds no clam fossils.' },
        { id: 'd', text: 'Layers R and S must have formed at the same time, because they contain the same kind of fossil.' },
      ],
      expectedAnswer: 'The clam lived during the time when layers S and R were forming, and its fossils were not found in the other layers here.',
      hints: [
        'In undisturbed layers, the deeper a layer sits, the earlier it formed. Write the five layers out from oldest to youngest before you look at the choices again.',
        'Missing from a layer means no fossil was found in that layer. Ask yourself whether that is the same thing as the animal not existing anywhere at that time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-a-fossil-is',
      kind: 'try_yourself',
      problem: 'Which statement best describes what most fossils are?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The original bones and bodies of animals, kept exactly as they were when the animals died.' },
        { id: 'b', text: 'Preserved remains or traces of once-living things, in which the original material has usually been replaced by minerals or left as an impression.', correct: true },
        { id: 'c', text: 'The bones of dinosaurs, since dinosaurs are the only organisms that left fossils behind.' },
        { id: 'd', text: 'Ordinary rocks that happen by chance to be shaped like animals and plants.' },
      ],
      expectedAnswer: 'Preserved remains or traces of once-living things, in which the original material has usually been replaced by minerals or left as an impression.',
      hints: [
        'A fossil dug out of rock is usually heavy and stony. Ask what happened to the original bone over all that time.',
        'A footprint and a burrow are both fossils, and neither one is any part of an animal body. Which choice is wide enough to include them?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-gaps-in-the-record',
      kind: 'try_yourself',
      problem:
        'A student argues that the fossil record cannot be used as evidence because it has gaps in it, with stretches of rock where a kind of organism simply is not found. Which response is best supported by what scientists know about how fossils form?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The gaps prove that the kinds of living things on Earth did not change over time.' },
        { id: 'b', text: 'There are no real gaps, because every organism that has ever lived left a fossil somewhere in the rock.' },
        { id: 'c', text: 'Gaps are expected, because fossilization is rare, soft bodies seldom fossilize, and rock layers get eroded or disturbed, so a gap is missing evidence rather than evidence against change.', correct: true },
        { id: 'd', text: 'The gaps show that nothing was alive on Earth during the times those layers were forming.' },
      ],
      expectedAnswer: 'Gaps are expected, because fossilization is rare, soft bodies seldom fossilize, and rock layers get eroded or disturbed, so a gap is missing evidence rather than evidence against change.',
      hints: [
        'Think back to how unlikely fossilization is. If most organisms leave nothing at all, should a complete record be expected in the first place?',
        'Two of these choices treat a missing fossil as if it were a positive finding. Not finding something is weaker information than finding it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fossils-and-gaps',
      kind: 'misconception_check',
      question:
        'A student writes: "Fossils are the real bones of the animals, and any animal that dies gets buried and becomes one. So if an animal is missing from a rock layer, it never existed then, and that gap breaks the whole fossil record."',
      commonErrors: [
        {
          answer: 'Fossils are the real bones, and animals that die usually become fossils.',
          misconception:
            'Picturing fossilization as ordinary and automatic, because every fossil a student has ever seen was displayed as a complete skeleton, and museums do not display the millions of organisms that left nothing.',
          correctsTo:
            'Two corrections here. First, most fossils are not the original material: over a very long time, minerals carried by water replace the bone or shell, so the fossil is rock in the shape of the remains. Others are only an impression, a mold, a cast or a trace such as a footprint. Second, fossilization is rare, not routine. The organism has to be buried quickly in sediment before decay and scavengers take it apart, and hard parts survive that far more often than soft parts do. Almost every organism that has ever lived left no fossil at all.',
        },
        {
          answer: 'A gap in the fossil record disproves the idea that life has changed over time.',
          misconception:
            'Treating "no fossil found" as if it were a positive discovery, when it is simply an absence of evidence produced by a process that preserves very little.',
          correctsTo:
            'A gap means that no fossil of that organism was FOUND in that rock, and there are ordinary reasons for that: the organism may have been soft-bodied, the conditions may have been wrong for burial, or the layer may have been eroded or disturbed by Earth processes. Missing evidence is not evidence against. The change over time is read from the fossils that DO exist and the order they sit in, and new fossils that fill in gaps keep being found. Notice also that scientists themselves say the record is incomplete. Admitting what the evidence cannot show is part of doing science honestly, not a weakness in the idea.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A fossil is the preserved remains or traces of a living thing from long ago. Usually the original material has been replaced by minerals, or the fossil is an impression or a trace such as a footprint or a burrow.',
        'Fossilization is rare. It normally takes quick burial in sediment plus hard parts, so soft-bodied organisms almost never fossilize.',
        'Superposition: in UNDISTURBED rock layers, deeper means older. Check for tilting, folding and erosion before applying the rule, and never state it as an absolute.',
        'Read a stack from the bottom up: organisms found only in lower layers no longer exist, and organisms appear in upper layers that are absent below. That is evidence that life has changed over time.',
        'Higher in the stack means LATER, and nothing else. No organism is primitive, advanced or more evolved than another.',
        'The fossil record is incomplete, and a gap is missing evidence, not evidence against change. Not finding a fossil is much weaker information than finding one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Fossils & the Fossil Record' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
