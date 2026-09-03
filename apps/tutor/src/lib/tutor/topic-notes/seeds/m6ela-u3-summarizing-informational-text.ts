/**
 * Grade 6 English Language Arts — Unit 3 CED 3.2: Summarizing Informational Text.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.summarizing-informational-text.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U3_SUMMARIZING_INFORMATIONAL_TEXT: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.summarizing-informational-text.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Summarizing Informational Text',
  planId: 'evelyn.ms.m6ela.summarizing-informational-text.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.summarizing-informational-text.v1' }],
  theory: [
    { loId: 'm6ela.summarizing-informational-text', content: `A SUMMARY OF AN INFORMATIONAL TEXT STARTS WITH THE CENTRAL IDEA, ALREADY FOUND. Finding the central idea was the skill of the previous lesson. Here it is simply the first sentence of the summary you are building, not something to go hunting for again. Add only the details that explain or support that sentence, and stop there.` },
    { loId: 'm6ela.summarizing-informational-text', content: `RETELLING IS NOT SUMMARIZING. A retelling repeats a text's facts in the order the text gave them, treating every one of them as equally important. A summary is shorter than a retelling because it drops any fact that does not connect back to the central idea, even a fact that is true and interesting on its own.` },
    { loId: 'm6ela.summarizing-informational-text', content: `OBJECTIVE MEANS NO JUDGMENT, EVEN A QUIET ONE. Cross out the obvious judgment words first: amazing, incredible, boring, sad. Then watch for the quieter kind, a sentence that announces a conclusion instead of reporting a fact, using words such as "this shows that" or "which proves." Those words hand over the summarizer's own opinion about how important or impressive something is, and an objective summary carries none of that.` },
    { loId: 'm6ela.summarizing-informational-text', content: `A GOOD SUMMARY IS NOTICEABLY SHORTER THAN THE PASSAGE IT REPORTS ON. If a summary lines up sentence for sentence with the original passage, nothing has been picked out as more important than anything else, and everything the passage said has simply been restated.` },
    { loId: 'm6ela.summarizing-informational-text', content: `TEST A SUMMARY BY ASKING WHO IS TALKING. Every sentence in it should sound like it is reporting the passage, not like the summarizer is reacting to it. Two readers who disagree about how interesting the topic is should still be able to sign the exact same summary.` },
    { loId: 'm6ela.summarizing-informational-text', kind: 'definition', title: 'objective summary', content: `a short, factual restatement of an informational text's central idea and the details that support it, with the summarizer's own opinions and conclusions left out.` },
    { loId: 'm6ela.summarizing-informational-text', kind: 'definition', title: 'retelling', content: `a version of a text that lists its facts in the order they originally appeared, without picking out which ones support the central idea.` },
    { loId: 'm6ela.summarizing-informational-text', kind: 'definition', title: 'judgment', content: `a statement of how good, important, exciting or surprising something is, including a quiet version such as "this shows that" or "which proves," rather than a plain report of what the text says.` },
    { loId: 'm6ela.summarizing-informational-text', kind: 'definition', title: 'central idea', content: `the one sentence stating the main point an informational text makes about its topic, identified as its own skill in the previous lesson.` },
    { loId: 'm6ela.summarizing-informational-text', kind: 'definition', title: 'supporting detail', content: `a specific fact from the text that helps prove the central idea is true, used here to build a summary rather than to identify the idea itself.` },
  ],
  methods: [
    {
      title: 'Worked build a summary',
      steps: [
        `Start with the central idea, already given: a popcorn kernel pops because trapped water turns to steam, and the built-up pressure bursts the shell open. That sentence becomes the first sentence of the summary.`,
        `Check each remaining sentence in the passage against that central idea, one at a time. The second sentence explains that "that water turns into steam" and "the steam has nowhere to go inside the hard shell" — both explain why pressure builds, so both connect.`,
        `The third sentence says, "Pressure keeps building inside the kernel until the shell finally bursts open." That is the central idea's own ending, so it stays.`,
        `The fourth sentence says, "The soft starch inside blows outward and puffs into the white foam people eat at movies." That is what happens right after the burst, still part of the same chain, so it stays too.`,
        `The fifth sentence, about adding "butter or salt once the popcorn has popped," is true and about popcorn, but it has nothing to do with why the kernel pops in the first place. It does not connect to the central idea, so it is cut.`,
        `Write the kept details in order, in fewer words than the passage used, with no judgment added anywhere.`,
      ],
      example: { problem: `Build an objective summary of this passage, using the central idea already identified below it.

"Popcorn pops because of the tiny bit of water sealed inside each hard kernel. When a kernel heats up, that water turns into steam, and the steam has nowhere to go inside the hard shell. Pressure keeps building inside the kernel until the shell finally bursts open. The soft starch inside blows outward and puffs into the white foam people eat at movies. Many people like to add butter or salt once the popcorn has popped."

Central idea: a popcorn kernel pops because trapped water turns to steam, and the built-up pressure bursts the shell open.`, solution: `A popcorn kernel pops because a small amount of water sealed inside turns to steam when the kernel heats up. The steam cannot escape, so pressure builds until the shell bursts, and the starch inside puffs into foam.` },
      relatedLoIds: ['m6ela.summarizing-informational-text'],
    },
    {
      title: 'Worked repair a summary',
      steps: [
        `Find the retelling problem first. The first four sentences repeat the passage's own facts in the passage's own order, each as its own short sentence, without ever stating the central idea as one sentence. That is a retelling, not a summary.`,
        `Find the judgment problem next. The last sentence, "This shows that your body is amazing at fixing pressure problems on its own," is not something the passage says. It announces the summarizer's own conclusion about how impressive the body is, using the words "this shows that." An objective summary reports what happens, not what the summarizer thinks about it.`,
        `Rebuild it, starting with the central idea, already given: ears pop on an airplane because swallowing or yawning opens a tube that lets air pressure equalize between the middle ear and the surrounding air.`,
        `Add only the detail that explains how that happens: the Eustachian tube "connects the middle ear to the back of the throat," and swallowing or yawning "opens that tube for a moment."`,
        `WRONG: "When an airplane climbs or drops quickly, the air pressure inside the cabin changes. There is a narrow tube called the Eustachian tube. It connects the middle ear to the back of the throat. Swallowing or yawning opens that tube. This shows that your body is amazing at fixing pressure problems on its own." CORRECT: "Ears pop on an airplane because the air pressure around you changes faster than your ears can match it. Swallowing or yawning opens the Eustachian tube, a narrow tube connecting the middle ear to the throat, and that lets air move until the pressure equalizes again."`,
        `Last check: could a reader who finds airplane pressure fascinating and a reader who finds it dull both sign the corrected version? Yes, because every sentence in it reports what happens, and nothing in it says what to think about it.`,
      ],
      example: { problem: `Repair this summary so that it reports the passage objectively, without retelling every sentence and without adding a judgment.

Passage: "When an airplane climbs or drops quickly, the air pressure inside the cabin changes faster than the air pressure inside your ears can match it. A narrow tube called the Eustachian tube connects the middle ear to the back of the throat, and swallowing or yawning opens that tube for a moment. Opening the tube lets air move in or out of the middle ear until the pressure on both sides is equal again. Once the pressure equalizes, the popping or fullness feeling goes away."

Central idea: ears pop on an airplane because swallowing or yawning opens the Eustachian tube, letting air pressure equalize between the middle ear and the surrounding air.

Student summary: "When an airplane climbs or drops quickly, the air pressure inside the cabin changes. There is a narrow tube called the Eustachian tube. It connects the middle ear to the back of the throat. Swallowing or yawning opens that tube. This shows that your body is amazing at fixing pressure problems on its own."`, solution: `Ears pop on an airplane because the air pressure around you changes faster than your ears can match it. Swallowing or yawning opens the Eustachian tube, a narrow tube connecting the middle ear to the throat, and that lets air move until the pressure equalizes again.` },
      relatedLoIds: ['m6ela.summarizing-informational-text'],
    },
  ],
  pointers: [
    { content: `Students often say "Every fact from the article, written down in the exact order the article gave them, starting with the article's own opening sentence." — A summary states the central idea first, then keeps only the details that support it, and drops the rest, even facts that are true and interesting. Starting with the article's own opening sentence is also a sign of trouble, because the real point of an informational text often lands later, not in its first line.`, kind: 'common-error' },
    { content: `Students often say "A short, accurate list of facts that ends with, "This shows that volcanoes are one of nature's most powerful forces."" — The words "this shows that" announce a conclusion the summarizer drew, not a fact the article stated. An objective summary reports only what the text itself says, so that closing sentence has to be cut entirely, not softened.`, kind: 'common-error' },
    { content: `An objective summary states the already-identified central idea first, then adds only the supporting details that back it, in fewer words than the original.`, kind: 'tip' },
    { content: `Retelling is not summarizing. Retelling lists every fact in the text's own order; summarizing keeps only what supports the central idea and drops the rest.`, kind: 'tip' },
    { content: `Cut the obvious judgment words, such as amazing, boring and incredible, and cut the quiet kind too. WRONG: "This shows that volcanoes are one of nature's most powerful forces." CORRECT: report only what the text itself says.`, kind: 'tip' },
    { content: `A summary that never reaches the passage's actual point, such as why the soda ends up flat or why the leaves finally show color, is incomplete, even when every sentence in it is true.`, kind: 'tip' },
    { content: `Test a summary by asking whether two readers who disagree about how interesting the topic is could both sign it. If not, a judgment is still hiding in it somewhere.`, kind: 'tip' },
    { content: `A good summary is noticeably shorter than the passage it reports on, not a sentence-for-sentence restatement of it.`, kind: 'tip' },
  ],
};
