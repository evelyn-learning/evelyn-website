/**
 * Grade 7 English Language Arts — Unit 3 CED 3.2: Summarizing Informational Text.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.summarizing-informational-text.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U3_SUMMARIZING_INFORMATIONAL_TEXT: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.summarizing-informational-text.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Summarizing Informational Text',
  planId: 'evelyn.ms.m7ela.summarizing-informational-text.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.summarizing-informational-text.v1' }],
  theory: [
    { loId: 'm7ela.summarizing-informational-text', content: `A SUMMARY TELLS WHAT THE TEXT SAYS, NOT WHAT YOU THINK. It is shorter than the original, it is in your own words, and it leaves your feelings out. A review says whether the text was good. A summary says what the text said. Every rule below comes from that one difference.` },
    { loId: 'm7ela.summarizing-informational-text', kind: 'framework', title: 'Step 1', content: `STEP 1 — FIND THE CENTRAL IDEA. Ask what the whole text is mostly about, and answer in one sentence. Not one topic word, one sentence. "Sea otters" is a topic. "Sea otters protect kelp forests by eating the urchins that damage them" is a central idea. Your summary is built around that sentence, so get it first.` },
    { loId: 'm7ela.summarizing-informational-text', kind: 'framework', title: 'Step 2', content: `STEP 2 — KEEP ONLY THE DETAILS THAT SUPPORT THE CENTRAL IDEA. Go through the text and ask one question about each detail: does this help explain the sentence I just wrote. If it does, keep it. If it does not, it goes, no matter how interesting it is. Two or three supporting details is usually enough.` },
    { loId: 'm7ela.summarizing-informational-text', kind: 'framework', title: 'Step 3', content: `STEP 3 — CUT THE EXAMPLES, THE REPEATS AND YOUR OPINIONS. Writers give examples to make an idea clear, and one idea often comes back two or three times in different words. A summary states the idea once and drops the examples. It also drops every judgment: no "I think", no "this part was boring", no "everybody should read this".` },
    { loId: 'm7ela.summarizing-informational-text', kind: 'framework', title: 'Step 4', content: `STEP 4 — WRITE IT IN YOUR OWN WORDS, SHORTER THAN THE ORIGINAL. Aim for about a quarter to a third of the length. Cover the page and say the idea out loud first, then write down what you said. Your own words means your own sentences.` },
    { loId: 'm7ela.summarizing-informational-text', content: `SWAPPING A FEW WORDS IS NOT YOUR OWN WORDS. Keeping the shape of the original sentence and changing students to pupils, or willing to eager, is a close paraphrase. It is still the writer sentence wearing a hat, and it does not count. The test is simple: if your sentence lines up with the original word by word, you copied it. Rebuild the sentence from scratch instead.` },
    { loId: 'm7ela.summarizing-informational-text', kind: 'definition', title: 'summary', content: 'a short restatement of what a text says, in your own words.' },
    { loId: 'm7ela.summarizing-informational-text', kind: 'definition', title: 'central idea', content: 'the most important point the whole text makes, stated as a full sentence.' },
    { loId: 'm7ela.summarizing-informational-text', kind: 'definition', title: 'supporting detail', content: 'a fact, reason or step in the text that helps explain the central idea.' },
    { loId: 'm7ela.summarizing-informational-text', kind: 'definition', title: 'objective', content: 'sticking to what the text says, with no personal opinion added.' },
    { loId: 'm7ela.summarizing-informational-text', kind: 'definition', title: 'close paraphrase', content: `a copy of the original sentence with only a few words changed, which does not count as your own words.` },
  ],
  methods: [
    {
      title: 'Worked run the recipe',
      steps: [
        `Step 1, find the central idea. Ask what the whole passage is mostly about. Every sentence is about otters, urchins and kelp, and the last two sentences set up a contrast: otters present, kelp healthy; otters gone, kelp stripped. So the central idea is that sea otters protect kelp forests by eating urchins.`,
        `Step 2, keep only the details that support that. The passage gives a chain, and each link is needed: otters eat urchins, urchins eat kelp, so otters keep the kelp forest alive. Those three go in.`,
        `Step 3, cut the rest. Out goes "spend much of the day eating", which is a detail about otter habits and does not explain the chain. Out goes the description of kelp as tall seaweed in thick forests, which is there to help you picture it. Out goes any opinion of yours about otters being cute, because that is not in the passage at all.`,
        `Step 4, write it in your own words and make it shorter. Say the idea out loud first with the passage covered, then write down what you said.`,
        `Here is the summary: "Sea otters eat sea urchins, and urchins feed on kelp. When otters live in an area, urchin numbers stay low and the kelp forest survives. When otters are gone, urchins take over and the kelp disappears."`,
        `Check it against the recipe. Central idea, yes. Only supporting details, yes. No opinion, no examples, and it is shorter than the original. Notice that the summary does not open with the passage first sentence. That sentence is about how much otters eat, and it was never the point.`,
      ],
      example: { problem: `Summarize this passage using the four steps.

"Sea otters spend much of the day eating, and one of their favorite foods is the sea urchin. Urchins feed on the base of kelp, the tall seaweed that grows in thick underwater forests. Where otters are common, they keep urchin numbers down and the kelp forest stays healthy. Where otters have vanished, urchins spread across the sea floor and the kelp is stripped away."`, solution: `Sea otters eat sea urchins, and urchins feed on kelp. When otters live in an area, urchin numbers stay low and the kelp forest survives. When otters are gone, urchins take over and the kelp disappears.` },
      relatedLoIds: ['m7ela.summarizing-informational-text'],
    },
    {
      title: 'Worked repair bad summary',
      steps: [
        `Problem one, the opening is copied. The student first sentence is the passage first sentence, word for word. Copying is not summarizing, and a summary that starts by copying almost always stops before the real point.`,
        `Problem two, there is an opinion in the middle. "I think it is cool" is the student talking about the student. A summary reports what the text says and nothing else.`,
        `Problem three, the last line adds a judgment and no information. "Yeast is really interesting" tells a reader nothing about how dough rises.`,
        `Problem four, the point is missing. The passage explains a chain: yeast feeds, gas comes off, the gas is trapped, the dough puffs up, and the oven locks the shape in. The student summary stops after the first link, so a reader learns nothing about why the dough rises.`,
        `Now rebuild it. Step 1, central idea: yeast makes bread dough rise by giving off a gas that gets trapped inside. Step 2, supporting details: yeast feeds on sugars, the gas is caught in stretchy strands, the oven heat sets the risen shape.`,
        `Steps 3 and 4, cut and rewrite. Here is the repaired summary: "Yeast is a living thing in the dough that feeds on sugars and lets off a gas. Stretchy strands in the dough trap the gas, which makes the dough puff up. Baking then kills the yeast and locks the dough in its risen shape."`,
        `One last check. Notice how the repaired version does not follow the passage sentence by sentence with a few words swapped. That would be a close paraphrase, not a summary. The sentences were rebuilt.`,
      ],
      example: { problem: `A student wrote a summary of this passage. Find every rule it breaks, then fix it.

PASSAGE: "Bread dough rises because of yeast, a tiny living thing mixed into the flour and water. The yeast feeds on sugars in the dough and gives off a gas as it works. That gas gets trapped in stretchy strands inside the dough, so the dough puffs up. In the oven the heat kills the yeast, and the dough sets in its risen shape."

STUDENT SUMMARY: "Bread dough rises because of yeast, a tiny living thing mixed into the flour and water. I think it is cool that something alive is hiding in a sandwich. Yeast is really interesting."`, solution: `Yeast is a living thing in the dough that feeds on sugars and lets off a gas. Stretchy strands in the dough trap the gas, which makes the dough puff up. Baking then kills the yeast and locks the dough in its risen shape.` },
      relatedLoIds: ['m7ela.summarizing-informational-text'],
    },
  ],
  pointers: [
    { content: `Students often say "A summary is the first few sentences of the text, copied out." — The opening sentences are usually background, not the point. In the thermos article the first sentence only describes the two walls, and the reason a thermos works does not arrive until the end. Run step 1 instead: read the whole thing, then say in one sentence what it is mostly about. And copying is never summarizing, even when the copied sentence happens to be an important one, because a summary has to be in your own words and shorter than the original.`, kind: 'common-error' },
    { content: `Students often say "A summary can say what I think about the topic." — A summary is objective, which means it reports only what the text says. Whether everybody likes hot chocolate is not in the article, so it cannot be in the summary. Cut every "I think", every "the best part was" and every "this was boring". If you want to give an opinion, that is a review, and it is a different piece of writing. Also watch the quieter version of this mistake: keeping every interesting detail because you liked it. A detail earns its place only when it supports the central idea.`, kind: 'common-error' },
    { content: 'A summary says what the text says. A review says what you think. Never mix them.', kind: 'tip' },
    { content: `Step 1, find the central idea and write it as one full sentence, not one topic word.`, kind: 'tip' },
    { content: `Step 2, keep only the details that support that sentence. Step 3, cut the examples, the repeats and every opinion.`, kind: 'tip' },
    { content: `Step 4, write it in your own words and shorter, about a quarter to a third of the original.`, kind: 'tip' },
    { content: `The first sentences of a text are not the summary. They are usually background, and the point often lands at the end.`, kind: 'tip' },
    { content: `Swapping a few words out of the original is a close paraphrase, not your own words. Rebuild the sentence from scratch.`, kind: 'tip' },
    { content: `A topic is not a central idea. "Sea otters" or "how a thermos works" is a topic. A central idea is a full sentence that says the point: "Sea otters protect kelp forests by eating urchins." If your first line has no verb doing real work, you stopped too early.`, kind: 'vocab-note' },
    { content: `Don't start your summary with the text's first sentence. Opening sentences are usually background — the thermos passage starts with two walls, but the point (heat escapes slowly) lands at the end. Read the whole thing before you decide what it's mostly about.`, kind: 'common-error' },
    { content: `Changing "students" to "pupils" or "willing" to "eager" is a **close paraphrase**, not your own words. Test it: line your sentence up with the original. If the words match slot for slot, rebuild the sentence from scratch instead of redecorating it.`, kind: 'vocab-note' },
    { content: `"I think," "the best part," "this was boring," "everybody should read this" — none of these belong in a summary. That's a review. Objective means only what the text says, even if your opinion is smart and true.`, kind: 'gotcha' },
    { content: `A detail earns a spot only if it explains your central-idea sentence — not because it's fun. "Otters spend much of the day eating" is interesting and still gets cut. Ask each detail: does this help explain my sentence? No? Out.`, kind: 'common-error' },
    { content: `When a passage explains a chain (yeast feeds → gas comes off → strands trap it → dough puffs), you need the whole chain. Stopping after link one leaves the reader with no idea why it happens.`, kind: 'edge-case' },
    { content: `Short is not the goal — short *and complete* is. If your summary is one line but a reader still can't say what the text explained, you cut a supporting detail, not an example. Aim for about a quarter to a third of the original.`, kind: 'tip' },
    { content: `Self-check before you turn it in: cover the passage and read only your summary. Can someone who never saw the text say what its point was? Can you point to any word you didn't write yourself? Any "I"? Fix those three things first.`, kind: 'tip' },
  ],
};
