/**
 * Grade 6 Science (Earth & Space Science) — Earth\'s History in the Rock
 * Record: Relative Dating & Rock Layers.
 *
 * PROCEDURE-LED exemplar for the m6sci fan-out (NGSS MS-ESS1-4). One routine
 * runs the whole lesson: check for disturbance, order the undisturbed layers
 * bottom to top, then slot every cutting feature in between the youngest
 * thing it cuts and the oldest thing that lies unbroken over it, and read the
 * order back to check it. The shape is deliberately different from the
 * concept-led exemplar: the concept segment is a short ordered recipe rather
 * than a mental model, both worked examples run the same four moves so the
 * pattern is unmistakable, and every answer ends with a read-it-backward
 * check.
 *
 * The two traps it is built to kill are (a) applying superposition to rock
 * that has been folded, tilted or faulted, and (b) assuming a feature that
 * cuts across layers must be the youngest thing in the picture.
 *
 * SCOPE GUARD: this plan produces an ORDER of rock layers and events, and
 * never an age in years. Because the rest of Unit 5 sits very close, the
 * guard states what is deliberately EXCLUDED and also what is deliberately
 * ALLOWED at that edge, and why:
 *   - ROW 5.2 (absolute dating and the geologic time scale) is referenced
 *     only as "a different method" and "the next lesson", and only to stop a
 *     student converting an order into a number of years. Radiometric dating,
 *     carbon-14, uranium-lead, half-lives and the eon/era/period names appear
 *     nowhere in this file, by design.
 *   - ROWS 5.3 (index fossils) and 5.4 (mass extinctions) are not touched at
 *     all: there is no fossil anywhere in this plan and no extinction event.
 *     Every rock column is described by rock type and position only.
 *   - GRADE 7 LIFE SCIENCE boundary: because fossils are absent, so is every
 *     route into natural selection, evolution, adaptation, common ancestry
 *     and extinction causes. If a later revision adds a fossil to an item, it
 *     may serve ONLY as a marker sitting in a layer, never as evidence about
 *     how a species changed.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: radioactive decay as a physical
 *     process is Grade 8 and is not mentioned. This plan states THAT folding,
 *     tilting and faulting happen, and that they happen after the rock
 *     hardens, because the ordering routine needs that fact; it never explains
 *     the mechanism behind them, which is Grade 6 Unit 4 for the plate motion
 *     and Grade 8 for anything about force or energy.
 *   - Rock-type names (conglomerate, coal seam, mudstone and the rest) are used
 *     only as labels for layers. Wherever a rock type could be mistaken for
 *     evidence of age, the plan says so outright: a worked-example step and a
 *     try_yourself hint both state that rock type does not determine order.
 *     How each rock type forms is Unit 3 and is not taught here.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every rock
 * column, fault and intrusion in this file is written out in words, top-down
 * or bottom-up order stated explicitly, and every item is solvable from the
 * text printed inside it. Never write "see the cross-section above", and
 * never assume the student has a rock sample in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 4.4 -> 5.1 -> 5.2,
 * but rows 4.4 and 5.2 are authored in the fan-out that follows this commit.
 * `lint-ms-plans` rejects a prerequisite/followUp that does not resolve to a
 * registered LO, so both arrays stay empty until the full 40-row batch lands
 * and the controller wires the chain. Do not copy the empty arrays.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U5_RELATIVE_DATING_AND_ROCK_LAYERS: LessonPlan = {
  id: 'evelyn.ms.m6sci.relative-dating-and-rock-layers.v1',
  title: 'Relative Dating & Rock Layers',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.relative-dating-and-rock-layers',
      standard: 'M6SCI-5.1',
      description:
        'Apply the law of superposition to order undisturbed rock layers from oldest to youngest, and identify when a sequence has been disturbed by folding, tilting or a later feature cutting across it (NGSS MS-ESS1-4).',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the ordering rule in a pile the student already reads without thinking about it.',
      script:
        'There is a pile somewhere in your house. Mail on the counter, laundry on a chair, papers on a desk. Without touching it you already know something true about that pile: the thing at the bottom got there first. Nobody taught you that. It is just how piles work when things only get added on top. Geologists read cliffs the same way. Layers of mud and sand settle out and harden, one on top of another, over enormous stretches of time, and a cliff face is that pile turned into stone. Today you learn to read the pile. And then you learn the harder half, which is what to do when somebody has clearly reached into the pile and moved something.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ordering-rules',
      kind: 'concept',
      goal: 'Install the three rules and the four-step routine, and name the two traps before they are met.',
      keyIdeas: [
        'RELATIVE DATING ANSWERS "WHICH CAME FIRST", NOT "HOW OLD". The whole result of this lesson is an ORDER: this happened, then this, then this. It never produces a number of years. Getting an age in years takes a completely different method, which is the next lesson. Saying "the bottom layer is 300 million years old" from layer order alone is not a small overreach; it is an answer to a question you were never given the evidence for.',
        'RULE 1, ORIGINAL HORIZONTALITY -- sediment settles out flat. Sand and mud spread across a lake bed or a sea floor in flat sheets, so rock layers START flat. This rule is what makes the next one usable, and it is also the alarm bell: if you find layers that are tilted, folded or bent, they did not form that way. Something moved them after they hardened.',
        'RULE 2, THE LAW OF SUPERPOSITION -- in an UNDISTURBED stack of layers, the bottom layer was laid down first, so it is the oldest, and each layer above it is younger than the one below. Say the word undisturbed out loud every single time you use this rule. It is not decoration. Folding, tilting and faulting can all move rock after it forms, and in disturbed rock the bottom layer is no longer guaranteed to be the oldest.',
        'RULE 3, CROSS-CUTTING RELATIONSHIPS -- anything that cuts ACROSS layers is younger than every layer it cuts, because those layers had to already be there to be cut. A fault is one example: a break where rock has slipped. A crack filled with hardened igneous rock, called an intrusion, is another. The other half of the rule matters just as much: a layer that lies flat and unbroken across the top of a cutting feature was laid down after that feature, so the layer is the younger of the two.',
        'THE ROUTINE, IN ORDER -- (1) Check for disturbance first. Are the layers flat, or tilted, folded or broken? (2) Order the layers by superposition, oldest at the bottom. (3) Place every cutting feature: it goes just after the youngest thing it cuts and just before the oldest thing that lies unbroken over it. (4) Read your list back and ask of each item whether it could only have formed once everything before it existed. If any step fails that question, the order is wrong.',
        'THE TWO TRAPS. First trap: a cutting feature is NOT automatically the youngest thing in the picture. It is younger than what it cuts and older than what covers it. That puts it in the middle of the order whenever something lies unbroken across it, and at the end only when nothing does. Second trap: a disturbance does not make the rock record unreadable. Tilted layers can still be put in order; you just cannot assume that lowest on the cliff face means first. The pile comparison from the start of the lesson works only while nothing reaches into the pile -- which is exactly the assumption that Rule 3 exists to handle.',
      ],
      vocabulary: [
        { term: 'relative dating', definition: 'working out the order in which rocks and events formed, without giving any of them an age in years.' },
        { term: 'law of superposition', definition: 'the rule that in an undisturbed stack of rock layers, the bottom layer is the oldest and each layer above is younger.' },
        { term: 'original horizontality', definition: 'the rule that sediment settles in flat layers, so tilted or folded layers must have been moved after they formed.' },
        { term: 'cross-cutting relationships', definition: 'the rule that a feature cutting across rock layers is younger than every layer it cuts.' },
        { term: 'fault', definition: 'a break in rock along which one side has moved relative to the other.' },
        { term: 'intrusion', definition: 'melted rock that pushed into a crack in existing rock and hardened there.' },
      ],
      suggestedTools: ['show_diagram', 'show_flowchart'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-undisturbed-stack',
      kind: 'worked_example',
      problem:
        'A cliff face along a highway shows four flat, undisturbed rock layers. From the top down they are shale, then sandstone, then limestone, then conglomerate at the bottom. Put the four layers in order from oldest to youngest.',
      steps: [
        'Step 1, check for disturbance. The problem says the layers are flat and undisturbed. No tilting, no folding, no break running across them. So superposition applies, and Rule 1 agrees: layers start flat and these still are.',
        'Step 2, order the layers by superposition. The bottom layer was laid down first, so the conglomerate is the oldest. Each layer above is younger than the one below it, so limestone comes next, then sandstone, then shale on top.',
        'Step 3, place any cutting features. There are none in this cliff, so this step is empty. It is still worth doing on purpose, because the habit of looking is what saves you on the next problem.',
        'Step 4, read the list back: conglomerate, limestone, sandstone, shale. Could each one only have formed after the one before it? Yes -- each layer settled on top of the one already there. The order holds.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. Position says the conglomerate is at the bottom. Shape says the layers are still flat, so nothing has moved them since they hardened. Consistency says the list reads correctly in both directions -- oldest at the bottom, youngest on top. Three different kinds of evidence, one answer. Second, change one thing about the problem and check that the answer moves the way it should: if the layers had been folded instead of flat, step 1 would have stopped you, because the lowest layer on the cliff face would no longer be guaranteed to be the oldest. The test is not whether you get the same answer. It is whether the answer moves when the evidence moves.',
        'Notice what you did NOT use: the rock names. Limestone is not automatically older than sandstone, and conglomerate is not automatically older than shale. WRONG: "The limestone is older because limestone is an old kind of rock." CORRECT: "The limestone is older because it sits below the sandstone in an undisturbed stack." The position is the evidence. The rock type is not.',
        'And notice what the answer is not. WRONG: "The conglomerate is about 300 million years old." CORRECT: "The conglomerate is older than the other three layers." Relative dating gives order and nothing else.',
      ],
      answer: 'From oldest to youngest: conglomerate, limestone, sandstone, shale.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-intrusion-in-the-middle',
      kind: 'worked_example',
      problem:
        'In a second cliff, four flat layers lie one on top of another. From the bottom up they are limestone, shale, sandstone and siltstone. A narrow crack filled with hardened igneous rock runs up through the limestone, the shale and the sandstone, and stops at the base of the siltstone. The siltstone lies flat and unbroken across the top of the crack. Put all five features in order from oldest to youngest.',
      steps: [
        'Step 1, check for disturbance. The layers are flat, so superposition applies to them. But something cuts across them, so the job is not finished once the layers are ordered. This is the case Rule 3 exists for.',
        'Step 2, order the layers by superposition, bottom first: limestone, shale, sandstone, siltstone.',
        'Step 3, place the cutting feature. The igneous rock runs through the limestone, the shale and the sandstone. All three had to be there already for the crack to cut them, so the intrusion is younger than all three.',
        'Step 3 continued, use the other half of Rule 3. The siltstone lies flat and unbroken across the top of the crack, which means the siltstone was laid down after the crack was already filled and hardened. So the intrusion is older than the siltstone. That pins it: the intrusion goes after the sandstone and before the siltstone.',
        'WRONG: "The igneous rock cut through three layers, so it has to be the youngest thing here." CORRECT: "A cutting feature is younger than everything it cuts and older than anything lying unbroken over it." Cutting tells you where in the sequence something belongs, not that it belongs at the end. This is the most common mistake on this kind of problem.',
        'Step 4, read the list back: limestone, shale, sandstone, intrusion, siltstone. Could each one only have formed after everything before it? The shale needed the limestone underneath. The sandstone needed the shale. The intrusion needed all three to cut through. The siltstone needed the intrusion to already be there and hardened flat before it could settle across the top. Every step passes, so the order holds.',
        'And change one thing, to be sure the rule is doing the work. Suppose the crack had cut through the siltstone as well, with no layer lying unbroken above it. Then nothing in the cliff would sit after the intrusion, and the intrusion WOULD be the youngest feature. So a cutting feature is not always in the middle and not always at the end -- what decides it is whether something lies unbroken across the top of it. Change that one detail and the answer changes with it.',
      ],
      answer:
        'From oldest to youngest: limestone, shale, sandstone, the igneous rock filling the crack, siltstone.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-superposition',
      kind: 'try_yourself',
      problem:
        'A road cut shows five flat, undisturbed rock layers. From the bottom up they are a gray sandstone, a red shale, a thin coal seam, a white limestone, and a brown siltstone at the top. Which layer is the oldest?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The brown siltstone, because it is the layer on top.' },
        { id: 'b', text: 'The thin coal seam, because coal takes the longest to form.' },
        { id: 'c', text: 'The gray sandstone, because it is the layer at the bottom.', correct: true },
        { id: 'd', text: 'It cannot be worked out without knowing the age of each layer in years.' },
      ],
      expectedAnswer: 'The gray sandstone, because it is the layer at the bottom.',
      hints: [
        'The layers are described from the BOTTOM UP, so read the list carefully before you pick an end of it. Which layer settled onto the ground first, and which settled on top of everything else?',
        'Superposition uses position and nothing else. The kind of rock a layer is made of does not tell you its place in the order, and you do not need any ages in years to put an undisturbed stack in sequence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cross-cutting',
      kind: 'try_yourself',
      problem:
        'A cliff shows three flat layers. From the bottom up they are mudstone, sandstone and limestone. A fault runs from the bottom of the cliff all the way to the top, cutting through all three layers, and the rock on one side of the fault has slipped down relative to the other side. Which formed most recently?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The mudstone, because a fault always forms before the rock it cuts.' },
        { id: 'b', text: 'The limestone, because it is the layer at the top of the cliff.' },
        { id: 'c', text: 'It cannot be worked out, because a fault leaves the layers disturbed.' },
        { id: 'd', text: 'The fault, because it cuts through all three layers and nothing lies unbroken across it.', correct: true },
      ],
      expectedAnswer: 'The fault, because it cuts through all three layers and nothing lies unbroken across it.',
      hints: [
        'A fault is a break in rock that is already there. For the fault to cut a layer, ask which one had to exist first.',
        'Check the other half of the cross-cutting rule too. Is there any layer lying flat and unbroken across the top of this fault? If nothing covers it, nothing came after it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-disturbance',
      kind: 'try_yourself',
      problem:
        'In a road cut, every rock layer is tilted at a steep angle, and they all slope the same way. What is the best conclusion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The layers were deposited flat and were tilted later by movement of Earth\'s crust.', correct: true },
        { id: 'b', text: 'The sediment was deposited at a steep angle by fast-moving water.' },
        { id: 'c', text: 'The layers cannot be placed in any order at all, because tilting destroys the record.' },
        { id: 'd', text: 'The tilted layers must be younger than any flat layers nearby.' },
      ],
      expectedAnswer: 'The layers were deposited flat and were tilted later by movement of Earth\'s crust.',
      hints: [
        'Go back to Rule 1. What shape are layers in when sediment first settles out? If you find them in a different shape, what does that tell you about when the change happened?',
        'Being disturbed is information, not a dead end. It tells you an extra event happened, and that the event came after the layers hardened -- so the layers are still older than the tilting, not younger.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bottom-is-oldest',
      kind: 'misconception_check',
      question:
        'A student is asked to order the layers in a folded cliff and writes: "The bottom layer is always the oldest, so the bottom layer here is the oldest, and it is about 300 million years old." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'The bottom layer is always the oldest.',
          misconception:
            'Remembering superposition as a slogan and dropping the one word that limits it, because "bottom is oldest" is short and easy to hold onto.',
          correctsTo:
            'The rule reads: in an UNDISTURBED stack, the bottom layer is the oldest. The cliff in the question is folded, which means the rock was bent after it hardened, and folding can carry older rock up over younger rock. So the first move on any problem is not to apply superposition -- it is to check whether the layers are still flat. If they are folded, tilted or cut, superposition alone will not finish the job, and you need the cross-cutting rule and original horizontality to work out what happened and in what order.',
        },
        {
          answer: 'It is about 300 million years old.',
          misconception:
            'Treating an order as though it were a measurement, because a question about age feels like it should be answered with a number.',
          correctsTo:
            'Relative dating tells you which came first and which came later. It cannot produce a single year, because nothing in the layers is being measured -- only compared. An age in years comes from a different method that measures the rock itself, and that is the next lesson. The honest answer here is a comparison: this layer is older than the ones above it. WRONG: "This layer is 300 million years old." CORRECT: "This layer formed before the layers above it."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Relative dating gives an ORDER, never an age in years.',
        'Rule 1, original horizontality: sediment settles flat, so tilted or folded layers were moved after they hardened.',
        'Rule 2, superposition: in an UNDISTURBED stack, the bottom layer is oldest and each layer above is younger. The word undisturbed is part of the rule.',
        'Rule 3, cross-cutting: a fault or an intrusion is younger than every layer it cuts, and older than any layer lying unbroken across it.',
        'The routine: check for disturbance, order the layers, place the cutting features, then read the list back.',
        'A cutting feature sits in the MIDDLE of the order whenever a layer lies unbroken across it, and at the end only when nothing covers it.',
        'A disturbance is information, not a dead end -- it tells you an extra event happened after the layers formed.',
        'The rock type never decides the order. Position and cross-cutting do.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Relative Dating & Rock Layers' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
