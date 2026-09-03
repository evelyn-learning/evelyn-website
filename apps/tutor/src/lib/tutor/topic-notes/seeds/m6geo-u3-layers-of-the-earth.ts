/**
 * Grade 6 World Geography — Unit 3 CED 3.1: Layers of the Earth.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.layers-of-the-earth.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U3_LAYERS_OF_THE_EARTH: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.layers-of-the-earth.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Layers of the Earth',
  planId: 'evelyn.ms.m6geo.layers-of-the-earth.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.layers-of-the-earth.v1' }],
  theory: [
    { loId: 'm6geo.layers-of-the-earth', content: `EARTH IS BUILT IN THREE MAIN LAYERS, ONE INSIDE THE NEXT. Starting at the surface and moving straight down toward the middle of the planet, the layers are, in order: the CRUST, the MANTLE, and the CORE. Each layer sits closer to the center than the layer before it, the way one nested layer of a large ball sits inside another.` },
    { loId: 'm6geo.layers-of-the-earth', content: `THE CRUST IS THE THIN, OUTERMOST LAYER. The crust is solid rock, and it is the layer right under the ground, the ocean floor, and every mountain. Of Earth's three layers, the crust is by far the thinnest, and it is the only one people have ever reached directly, through digging or drilling.` },
    { loId: 'm6geo.layers-of-the-earth', content: `THE MANTLE SITS IN THE MIDDLE, AND FILLS MOST OF EARTH'S INSIDE. The mantle sits between the crust and the core. It takes up more space inside Earth than the crust and the core put together. The mantle is solid rock, and it is extremely hot, hotter than the crust above it.` },
    { loId: 'm6geo.layers-of-the-earth', content: `THE CORE IS THE LAYER AT EARTH'S VERY CENTER. The core sits inside the mantle, at the middle of the planet, farther from the surface than either of the other two layers. Unlike the crust and the mantle, which are both rock, the core is made mostly of metal. Of Earth's three layers, the core is the hottest.` },
    { loId: 'm6geo.layers-of-the-earth', content: `A LAYER CAN BE IDENTIFIED BY WHERE IT SITS OR BY WHAT IT IS MADE OF. Position asks whether a layer is closest to the surface, in the middle, or at the very center. Makeup asks whether a layer is rock or metal, and how much space it fills. A description built from either kind of clue, or from both together, should point at the same layer.` },
    { loId: 'm6geo.layers-of-the-earth', content: `NOBODY HAS EVER DUG OR DRILLED ANYWHERE CLOSE TO THE MANTLE OR THE CORE. Every drilling project ever attempted has stayed inside the crust, without even reaching all the way through that thinnest layer in most places. What is known about the mantle and the core comes from other kinds of evidence, not from digging.` },
    { loId: 'm6geo.layers-of-the-earth', kind: 'definition', title: 'crust', content: `Earth's thin, solid rock outermost layer, sitting right under the ground and the ocean floor.` },
    { loId: 'm6geo.layers-of-the-earth', kind: 'definition', title: 'mantle', content: `the middle layer of Earth, between the crust and the core, that fills most of the space inside the planet.` },
    { loId: 'm6geo.layers-of-the-earth', kind: 'definition', title: 'core', content: `the layer at Earth's very center, made mostly of metal rather than rock.` },
    { loId: 'm6geo.layers-of-the-earth', kind: 'definition', title: 'composition', content: 'what a layer is made of, such as rock or metal.' },
  ],
  methods: [
    {
      title: 'Worked locate by position',
      steps: [
        `List the three layers in the order they sit, from the surface to the center: the crust first, the mantle in the middle, and the core last, at the very middle of the planet.`,
        `Compare the description to that order. 'The very center, farther from the surface than anything else' can only match the layer named last, because every other layer sits somewhere between the surface and that point.`,
        `WRONG: "this must be the mantle, since the mantle takes up more space inside Earth than the other two layers." CORRECT: "taking up more space tells you how much of Earth's inside a layer fills, not where its farthest point sits. The core takes up less space than the mantle, but it still reaches the one point that is farthest from the surface: the very center."`,
        `Check by rereading the description again. 'Farther from the surface than anything else' rules out the crust immediately, since the crust is the closest layer to the surface, not the farthest. It also rules out the mantle, which sits between the crust and the core rather than at the extreme end. Only the core is left.`,
        `Now test a contrasting case. An object described instead as 'sitting right where digging first reaches rock, closest to the surface of any of the three layers' would point to the opposite end of the same order: the crust.`,
      ],
      example: { problem: `A scientist describes an object as: it sits at Earth's very center, farther from the surface than anything else inside the planet. Which of Earth's three layers is she describing?`, solution: `The core. It is the layer at Earth's very center, farther from the surface than the crust or the mantle, even though it takes up less space inside Earth than the mantle does.` },
      relatedLoIds: ['m6geo.layers-of-the-earth'],
    },
    {
      title: 'Worked identify by makeup',
      steps: [
        `Take the three clues one at a time. Solid rock: true of both the crust and the mantle, so this clue alone does not decide the answer yet.`,
        `Thin compared to the other two layers: only one layer is described that way in this lesson. The mantle fills most of Earth's inside, and the core sits at the center, so being the thin one points away from both of those and toward the crust.`,
        `The only layer people have drilled into directly: this matches the crust again, since the crust is the layer right under the ground and the ocean floor, within reach of digging and drilling.`,
        `WRONG: "since the mantle is also solid rock, either the crust or the mantle could be right." CORRECT: "solid rock only narrows the answer down to the crust or the mantle, ruling out the core. The other two clues, thinness and being reachable by drilling, are what settle it between those two, and both of them point to the crust."`,
        `Put the three clues together. Solid rock rules out the core. Thinness rules out the mantle. Being reachable by drilling also rules out the mantle. All three clues agree on the same layer.`,
        `This is the check to remember. One clue by itself can leave more than one layer possible. Three clues that are different kinds, all agreeing, settle it.`,
      ],
      example: { problem: `A sample is described three ways: it is solid rock, it is thin compared to the other two layers, and it is the only layer people have ever drilled into directly. Which layer is this, and why can it not be the mantle, even though the mantle is also solid rock?`, solution: `The crust. It is solid rock like the mantle, but it is also the thinnest of the three layers and the only one people have ever drilled into directly -- two clues the mantle does not match.` },
      relatedLoIds: ['m6geo.layers-of-the-earth'],
    },
  ],
  pointers: [
    { content: `Students often say "Earth's whole inside must be solid rock all the way to the center, the same as the ground under our feet." — Earth's three layers are not all the same material. The crust and the mantle are both solid rock, but the innermost layer, the core, is made mostly of metal rather than rock. Where a layer sits does not decide what it is made of, and this lesson checks both separately.`, kind: 'common-error' },
    { content: `Students often say "The mantle must be a thin layer, since it is a short, ordinary-sounding word." — The mantle is not thin. Of Earth's three layers, the mantle fills more space than the crust and the core put together. A word's length or how ordinary it sounds is not a reliable clue to a layer's size.`, kind: 'common-error' },
    { content: `Earth has three main layers, one inside the next: the crust, the mantle, and the core, in that order from the surface to the center.`, kind: 'tip' },
    { content: `The crust is the thin, outermost layer. It is solid rock, and it is the only layer people have ever reached directly, through digging or drilling.`, kind: 'tip' },
    { content: `The mantle sits in the middle, between the crust and the core, and it fills more space inside Earth than the crust and the core put together. It is solid rock, and it is very hot.`, kind: 'tip' },
    { content: `The core sits at Earth's very center, inside the mantle. It is made mostly of metal rather than rock, and of the three layers it is the hottest.`, kind: 'tip' },
    { content: `A layer can be identified by where it sits or by what it is made of. Both kinds of clue should point at the same layer.`, kind: 'tip' },
    { content: `Nobody has ever dug or drilled anywhere close to the mantle or the core. What is known about them comes from other kinds of evidence, not from digging.`, kind: 'tip' },
    { content: `Don't confuse 'thin' with 'small.' The mantle fills MORE space than the crust and core combined—it's huge, just not as thick as you might think.`, kind: 'common-error' },
    { content: `Position and composition are two separate clues. Always check BOTH when identifying a layer—where it sits AND what it's made of.`, kind: 'tip' },
    { content: `The core is metal, not rock. Crust and mantle are rock. If you see 'metal,' it's the core; if you see 'rock,' it's crust or mantle.`, kind: 'vocab-note' },
    { content: `We've only ever drilled into the crust. Everything we know about the mantle and core comes from OTHER evidence, not digging.`, kind: 'gotcha' },
    { content: `Order from surface to center: crust → mantle → core. Memorize this as a fixed chain. There are no exceptions or rearrangements.`, kind: 'tip' },
    { content: `Don't use 'takes up space' and 'sits at the very center' to mean the same thing. A layer can be small in size but still reach the farthest point (the core).`, kind: 'common-error' },
    { content: `Solid rock means crust OR mantle—that clue alone isn't enough. You need a second clue (thinness, reachability, heat) to narrow it down.`, kind: 'edge-case' },
  ],
};
