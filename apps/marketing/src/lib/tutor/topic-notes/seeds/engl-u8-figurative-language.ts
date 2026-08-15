/**
 * HS English — Unit 8 CED 8.1: Metaphor, Simile & Personification.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.figurative-language.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U8_FIGURATIVE_LANGUAGE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.figurative-language.v1',
  course: 'HS English',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'Metaphor, Simile & Personification',
  planId: 'evelyn.hs.engl.figurative-language.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.figurative-language.v1' }],
  theory: [
    { loId: 'engl.figurative-language', kind: 'framework', title: 'Simile', content: `SIMILE — an EXPLICIT comparison of two unlike things, flagged by like, as, than, or resembles: "Her patience was thin as frost on a windshield." The signal word keeps the two things separate; they are held side by side.` },
    { loId: 'engl.figurative-language', kind: 'framework', title: 'Metaphor', content: `METAPHOR — an IMPLICIT comparison that states the equation outright, with no signal word: "Her patience was frost." Metaphor is the bolder move because it claims identity instead of resemblance, so the reader has to work out how the two things can possibly be the same.` },
    { loId: 'engl.figurative-language', kind: 'framework', title: 'The transfer test', content: `THE TRANSFER TEST — the whole interpretation, in three questions. What is being described? What is it compared to? WHICH QUALITY crosses from one to the other? "Grief is a locked room" transfers enclosure and no-way-out, not walls and hinges. Naming the figure is labeling; naming the transferred quality is reading.` },
    { loId: 'engl.figurative-language', kind: 'framework', title: 'Personification', content: `PERSONIFICATION — giving human qualities, actions, or intentions to something nonhuman: "The kettle complained on the burner." Test it by asking whether the verb or adjective requires a mind — complaining does, boiling does not.` },
    { loId: 'engl.figurative-language', kind: 'framework', title: 'Hyperbole', content: `HYPERBOLE — deliberate, obvious exaggeration for emphasis, not meant to be believed: "I have apologized nine thousand times." The point is the size of the feeling, not the size of the number. If a reader could plausibly take it as fact, it is not hyperbole.` },
    { loId: 'engl.figurative-language', kind: 'framework', title: 'Extended metaphor', content: `EXTENDED METAPHOR — one comparison sustained across several lines or a whole poem, with new details drawn from the same source: if hope starts as a small fire, later lines can add kindling, wind, and ash. Watch for the sustained image; it usually carries the poem's argument.` },
    { loId: 'engl.figurative-language', kind: 'framework', title: 'Not literally false', content: `NOT LITERALLY FALSE — MEANING TRUE — a figure is not a lie or a mistake. "The city never sleeps" is false as a fact and accurate as a description. Judging a figure by its literal truth is the fastest way to miss what it says.` },
    { loId: 'engl.figurative-language', kind: 'framework', title: 'The like / as shortcut error', content: `THE LIKE / AS SHORTCUT ERROR — the signal word alone does not make a simile. "He ran like the wind" compares two UNLIKE things (a runner, moving air) and is a simile. "She acts like her sister" compares two like things and is a plain literal comparison — no quality is transferred across a gap, so there is nothing figurative to interpret. Ask what gap the comparison crosses before you label it.` },
    { loId: 'engl.figurative-language', kind: 'definition', title: 'figurative language', content: `language that means something other than its literal statement, usually by comparing one thing to another.` },
    { loId: 'engl.figurative-language', kind: 'definition', title: 'vehicle and tenor', content: `the tenor is the thing actually being described; the vehicle is what it is compared to. The meaning lives in the quality the vehicle lends the tenor.` },
  ],
  methods: [
    {
      title: 'Worked interpret metaphor',
      steps: [
        `Identify the figure: the kitchen IS a lighthouse — an equation with no like or as, so this is a metaphor, not a simile.`,
        `Name both sides of the comparison. Tenor: the grandmother's kitchen. Vehicle: a lighthouse.`,
        `Run the transfer test — ask which qualities of a lighthouse are being lent. A lighthouse is a fixed, visible signal that guides people who are off course, and it does so without judging why they strayed.`,
        `Check which qualities do NOT transfer: nobody claims the kitchen is tall, stone, or on a cliff. Selecting the relevant quality is the reader's job.`,
        `Confirm the rest of the image agrees: "steered," "drifted," and the "yellow window" all belong to the same sea-and-beacon picture, so the metaphor is extended across the lines rather than dropped after one.`,
        `State the meaning in a sentence: the kitchen functioned as a steady, welcoming point of orientation for family members who had lost their bearings.`,
      ],
      example: { problem: `Interpret the figurative language in these original lines: "My grandmother's kitchen was a lighthouse. / Every lost cousin steered for that yellow window, / and nobody ever asked how far they had drifted."`, solution: `Metaphor — the kitchen (tenor) is compared to a lighthouse (vehicle), transferring the qualities of a constant, visible refuge that guides the lost home without asking questions; "steered" and "drifted" extend the image` },
      relatedLoIds: ['engl.figurative-language'],
    },
    {
      title: 'Worked literal reading error',
      steps: [
        `Check the label first. A simile needs an explicit signal word — like, as, than, resembles. The line has none; it assigns human states directly to the bridge. That makes it personification, not simile.`,
        `Diagnose why the student reached for simile: hearing any comparison and reaching for the like/as category is the most common labeling reflex. The presence of a comparison does not fix the figure.`,
        `Confirm the personification by testing the words: "groaned," "tired of," and "thanking" all require a mind or a body. A bridge can creak, but only a creature can be tired of something.`,
        `Address the second error — reading the figure literally. "Bridges cannot get tired" is factually correct and critically useless; nobody was claiming the bridge has feelings.`,
        `Replace the literal test with the transfer test: what does human weariness lend the bridge? Long service, accumulated strain, and — through "stopped thanking it" — the town's neglect of something it depends on.`,
        `State the corrected reading: personification transfers weariness and unacknowledged labor to the bridge, so the line is about the town's ingratitude as much as about the structure.`,
      ],
      example: { problem: `A student reads the line "The old bridge groaned under the truck, tired of holding up a town that had stopped thanking it" and answers: "This is a simile, because the bridge is compared to a tired person. Also it is not true — bridges cannot get tired." Two errors are hiding here. Find both and fix them.`, solution: `It is personification, not simile — no like or as, and human states are assigned directly to the bridge; and a figure is judged by what it transfers (long strain, unthanked service), not by whether it is literally true` },
      relatedLoIds: ['engl.figurative-language'],
    },
  ],
  pointers: [
    { content: `A simile compares two UNLIKE things so that a quality can transfer across the gap — "she sings like a hinge in a hurricane." Comparing a singer to another singer is a literal comparison of manner: same category, nothing transferred, nothing to interpret. Test the gap first, then apply the label.`, kind: 'common-error' },
    { content: `Simile compares explicitly with like or as; metaphor states the equation with no signal word.`, kind: 'tip' },
    { content: `The transfer test is the interpretation: name the two things compared, then name the single quality that crosses over.`, kind: 'tip' },
    { content: `Personification gives human minds or bodies to nonhuman things; hyperbole exaggerates so obviously that nobody is meant to believe it.`, kind: 'tip' },
    { content: `A figure is literally false and meaning true — and a like or as between two similar things is a plain comparison, not a simile.`, kind: 'tip' },
    { content: `Don't label a comparison a simile just because you see *like* or *as*. Ask what gap it crosses first: "sings like her mother" compares singer to singer — same category, nothing transferred, plain literal comparison. "Sings like a hinge in a hurricane" crosses a gap.`, kind: 'common-error' },
    { content: `Naming the figure is not interpreting it. "This is a metaphor" earns nothing until you name the tenor, the vehicle, and the ONE quality that crosses over. Labeling is step one of four.`, kind: 'tip' },
    { content: `Never object that a figure "isn't true." "Bridges can't get tired" is factually right and critically useless. A figure is literally false and meaning true — judge it by what it transfers, not by whether it could happen.`, kind: 'gotcha' },
    { content: `Keep *tenor* and *vehicle* straight: tenor = the thing actually being described; vehicle = what it's compared to. In "grief is a locked room," grief is the tenor. Students routinely flip these and end up analyzing the wrong subject.`, kind: 'vocab-note' },
    { content: `Not every quality of the vehicle transfers. "Grief is a locked room" transfers enclosure and no-way-out — not hinges, wallpaper, or square footage. Pick the relevant quality; don't inventory the object.`, kind: 'common-error' },
    { content: `Test personification on the verb or adjective: does it require a MIND or a body? The kettle *boiling* is literal; the kettle *complaining* is personification. Motion or noise alone isn't enough — "the river rushed" is just what rivers do.`, kind: 'edge-case' },
    { content: `Hyperbole must be unbelievable on purpose. "I apologized nine thousand times" is hyperbole; "I apologized three times" is just a count. If a reader could plausibly take it as fact, it isn't hyperbole — it's a claim.`, kind: 'edge-case' },
    { content: `Before you say a metaphor ends, scan the next lines for words from the same source picture. "Steered," "drifted," and "yellow window" all belong to the lighthouse — that's an extended metaphor, and the sustained image usually carries the poem's argument.`, kind: 'tip' },
  ],
};
