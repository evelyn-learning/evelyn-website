/**
 * Grade 6 Science — Unit 5 CED 5.1: Relative Dating & Rock Layers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.relative-dating-and-rock-layers.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U5_RELATIVE_DATING_AND_ROCK_LAYERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.relative-dating-and-rock-layers.v1',
  course: 'Grade 6 Science',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Relative Dating & Rock Layers',
  planId: 'evelyn.ms.m6sci.relative-dating-and-rock-layers.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.relative-dating-and-rock-layers.v1' }],
  theory: [
    { loId: 'm6sci.relative-dating-and-rock-layers', content: `RELATIVE DATING ANSWERS "WHICH CAME FIRST", NOT "HOW OLD". The whole result of this lesson is an ORDER: this happened, then this, then this. It never produces a number of years. Getting an age in years takes a completely different method, which is the next lesson. Saying "the bottom layer is 300 million years old" from layer order alone is not a small overreach; it is an answer to a question you were never given the evidence for.` },
    { loId: 'm6sci.relative-dating-and-rock-layers', content: `RULE 1, ORIGINAL HORIZONTALITY -- sediment settles out flat. Sand and mud spread across a lake bed or a sea floor in flat sheets, so rock layers START flat. This rule is what makes the next one usable, and it is also the alarm bell: if you find layers that are tilted, folded or bent, they did not form that way. Something moved them after they hardened.` },
    { loId: 'm6sci.relative-dating-and-rock-layers', content: `RULE 2, THE LAW OF SUPERPOSITION -- in an UNDISTURBED stack of layers, the bottom layer was laid down first, so it is the oldest, and each layer above it is younger than the one below. Say the word undisturbed out loud every single time you use this rule. It is not decoration. Folding, tilting and faulting can all move rock after it forms, and in disturbed rock the bottom layer is no longer guaranteed to be the oldest.` },
    { loId: 'm6sci.relative-dating-and-rock-layers', content: `RULE 3, CROSS-CUTTING RELATIONSHIPS -- anything that cuts ACROSS layers is younger than every layer it cuts, because those layers had to already be there to be cut. A fault is one example: a break where rock has slipped. A crack filled with hardened igneous rock, called an intrusion, is another. The other half of the rule matters just as much: a layer that lies flat and unbroken across the top of a cutting feature was laid down after that feature, so the layer is the younger of the two.` },
    { loId: 'm6sci.relative-dating-and-rock-layers', content: `THE ROUTINE, IN ORDER -- (1) Check for disturbance first. Are the layers flat, or tilted, folded or broken? (2) Order the layers by superposition, oldest at the bottom. (3) Place every cutting feature: it goes just after the youngest thing it cuts and just before the oldest thing that lies unbroken over it. (4) Read your list back and ask of each item whether it could only have formed once everything before it existed. If any step fails that question, the order is wrong.` },
    { loId: 'm6sci.relative-dating-and-rock-layers', content: `THE TWO TRAPS. First trap: a cutting feature is NOT automatically the youngest thing in the picture. It is younger than what it cuts and older than what covers it. That puts it in the middle of the order whenever something lies unbroken across it, and at the end only when nothing does. Second trap: a disturbance does not make the rock record unreadable. Tilted layers can still be put in order; you just cannot assume that lowest on the cliff face means first. The pile comparison from the start of the lesson works only while nothing reaches into the pile -- which is exactly the assumption that Rule 3 exists to handle.` },
    { loId: 'm6sci.relative-dating-and-rock-layers', kind: 'definition', title: 'relative dating', content: `working out the order in which rocks and events formed, without giving any of them an age in years.` },
    { loId: 'm6sci.relative-dating-and-rock-layers', kind: 'definition', title: 'law of superposition', content: `the rule that in an undisturbed stack of rock layers, the bottom layer is the oldest and each layer above is younger.` },
    { loId: 'm6sci.relative-dating-and-rock-layers', kind: 'definition', title: 'original horizontality', content: `the rule that sediment settles in flat layers, so tilted or folded layers must have been moved after they formed.` },
    { loId: 'm6sci.relative-dating-and-rock-layers', kind: 'definition', title: 'cross-cutting relationships', content: `the rule that a feature cutting across rock layers is younger than every layer it cuts.` },
    { loId: 'm6sci.relative-dating-and-rock-layers', kind: 'definition', title: 'fault', content: 'a break in rock along which one side has moved relative to the other.' },
    { loId: 'm6sci.relative-dating-and-rock-layers', kind: 'definition', title: 'intrusion', content: 'melted rock that pushed into a crack in existing rock and hardened there.' },
  ],
  methods: [
    {
      title: 'Worked undisturbed stack',
      steps: [
        `Step 1, check for disturbance. The problem says the layers are flat and undisturbed. No tilting, no folding, no break running across them. So superposition applies, and Rule 1 agrees: layers start flat and these still are.`,
        `Step 2, order the layers by superposition. The bottom layer was laid down first, so the conglomerate is the oldest. Each layer above is younger than the one below it, so limestone comes next, then sandstone, then shale on top.`,
        `Step 3, place any cutting features. There are none in this cliff, so this step is empty. It is still worth doing on purpose, because the habit of looking is what saves you on the next problem.`,
        `Step 4, read the list back: conglomerate, limestone, sandstone, shale. Could each one only have formed after the one before it? Yes -- each layer settled on top of the one already there. The order holds.`,
        `Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. Position says the conglomerate is at the bottom. Shape says the layers are still flat, so nothing has moved them since they hardened. Consistency says the list reads correctly in both directions -- oldest at the bottom, youngest on top. Three different kinds of evidence, one answer. Second, change one thing about the problem and check that the answer moves the way it should: if the layers had been folded instead of flat, step 1 would have stopped you, because the lowest layer on the cliff face would no longer be guaranteed to be the oldest. The test is not whether you get the same answer. It is whether the answer moves when the evidence moves.`,
        `Notice what you did NOT use: the rock names. Limestone is not automatically older than sandstone, and conglomerate is not automatically older than shale. WRONG: "The limestone is older because limestone is an old kind of rock." CORRECT: "The limestone is older because it sits below the sandstone in an undisturbed stack." The position is the evidence. The rock type is not.`,
        `And notice what the answer is not. WRONG: "The conglomerate is about 300 million years old." CORRECT: "The conglomerate is older than the other three layers." Relative dating gives order and nothing else.`,
      ],
      example: { problem: `A cliff face along a highway shows four flat, undisturbed rock layers. From the top down they are shale, then sandstone, then limestone, then conglomerate at the bottom. Put the four layers in order from oldest to youngest.`, solution: 'From oldest to youngest: conglomerate, limestone, sandstone, shale.' },
      relatedLoIds: ['m6sci.relative-dating-and-rock-layers'],
    },
    {
      title: 'Worked intrusion in the middle',
      steps: [
        `Step 1, check for disturbance. The layers are flat, so superposition applies to them. But something cuts across them, so the job is not finished once the layers are ordered. This is the case Rule 3 exists for.`,
        `Step 2, order the layers by superposition, bottom first: limestone, shale, sandstone, siltstone.`,
        `Step 3, place the cutting feature. The igneous rock runs through the limestone, the shale and the sandstone. All three had to be there already for the crack to cut them, so the intrusion is younger than all three.`,
        `Step 3 continued, use the other half of Rule 3. The siltstone lies flat and unbroken across the top of the crack, which means the siltstone was laid down after the crack was already filled and hardened. So the intrusion is older than the siltstone. That pins it: the intrusion goes after the sandstone and before the siltstone.`,
        `WRONG: "The igneous rock cut through three layers, so it has to be the youngest thing here." CORRECT: "A cutting feature is younger than everything it cuts and older than anything lying unbroken over it." Cutting tells you where in the sequence something belongs, not that it belongs at the end. This is the most common mistake on this kind of problem.`,
        `Step 4, read the list back: limestone, shale, sandstone, intrusion, siltstone. Could each one only have formed after everything before it? The shale needed the limestone underneath. The sandstone needed the shale. The intrusion needed all three to cut through. The siltstone needed the intrusion to already be there and hardened flat before it could settle across the top. Every step passes, so the order holds.`,
        `And change one thing, to be sure the rule is doing the work. Suppose the crack had cut through the siltstone as well, with no layer lying unbroken above it. Then nothing in the cliff would sit after the intrusion, and the intrusion WOULD be the youngest feature. So a cutting feature is not always in the middle and not always at the end -- what decides it is whether something lies unbroken across the top of it. Change that one detail and the answer changes with it.`,
      ],
      example: { problem: `In a second cliff, four flat layers lie one on top of another. From the bottom up they are limestone, shale, sandstone and siltstone. A narrow crack filled with hardened igneous rock runs up through the limestone, the shale and the sandstone, and stops at the base of the siltstone. The siltstone lies flat and unbroken across the top of the crack. Put all five features in order from oldest to youngest.`, solution: `From oldest to youngest: limestone, shale, sandstone, the igneous rock filling the crack, siltstone.` },
      relatedLoIds: ['m6sci.relative-dating-and-rock-layers'],
    },
  ],
  pointers: [
    { content: `Students often say "The bottom layer is always the oldest." — The rule reads: in an UNDISTURBED stack, the bottom layer is the oldest. The cliff in the question is folded, which means the rock was bent after it hardened, and folding can carry older rock up over younger rock. So the first move on any problem is not to apply superposition -- it is to check whether the layers are still flat. If they are folded, tilted or cut, superposition alone will not finish the job, and you need the cross-cutting rule and original horizontality to work out what happened and in what order.`, kind: 'common-error' },
    { content: `Students often say "It is about 300 million years old." — Relative dating tells you which came first and which came later. It cannot produce a single year, because nothing in the layers is being measured -- only compared. An age in years comes from a different method that measures the rock itself, and that is the next lesson. The honest answer here is a comparison: this layer is older than the ones above it. WRONG: "This layer is 300 million years old." CORRECT: "This layer formed before the layers above it."`, kind: 'common-error' },
    { content: 'Relative dating gives an ORDER, never an age in years.', kind: 'tip' },
    { content: `Rule 1, original horizontality: sediment settles flat, so tilted or folded layers were moved after they hardened.`, kind: 'tip' },
    { content: `Rule 2, superposition: in an UNDISTURBED stack, the bottom layer is oldest and each layer above is younger. The word undisturbed is part of the rule.`, kind: 'tip' },
    { content: `Rule 3, cross-cutting: a fault or an intrusion is younger than every layer it cuts, and older than any layer lying unbroken across it.`, kind: 'tip' },
    { content: `The routine: check for disturbance, order the layers, place the cutting features, then read the list back.`, kind: 'tip' },
    { content: `A cutting feature sits in the MIDDLE of the order whenever a layer lies unbroken across it, and at the end only when nothing covers it.`, kind: 'tip' },
    { content: `A disturbance is information, not a dead end -- it tells you an extra event happened after the layers formed.`, kind: 'tip' },
    { content: 'The rock type never decides the order. Position and cross-cutting do.', kind: 'tip' },
  ],
};
