/**
 * Grade 6 ELA — Reading Informational Texts: Central Idea & Text Features:
 * Summarizing Informational Text.
 *
 * CONCEPT-LED fan-out row for m6ela. This is the informational counterpart to
 * row 2.1's literary theme-and-objective-summary lesson, built to kill the
 * same two traps in a nonfiction setting: RETELLING instead of summarizing
 * (listing every fact in the order the text gave them instead of picking out
 * what supports the central idea), and letting a judgment ride along inside a
 * summary that should carry none — including the quiet kind, a sentence that
 * announces a conclusion with words such as "this shows that" or "which
 * proves" instead of reporting what the text actually says (CCSS RI.6.2). The
 * central idea in every passage here is already identified for the student;
 * this lesson's whole job is turning a given central idea and its supporting
 * details into a short, fair, objective paragraph.
 *
 * SCOPE GUARD: Grade 6 row 3.2 teaches a student to turn an already-
 * identified central idea and its supporting details into a short, objective
 * summary of an informational text. DELIBERATELY EXCLUDED: determining the
 * central idea of an informational text in the first place, and identifying
 * which details support it — that is row 3.1's job, and every central idea
 * in this file is handed to the student already stated, never derived as the
 * item's own answer. Also excluded: naming technical or domain-specific
 * vocabulary as its own skill (row 3.3), and analyzing text features or how a
 * whole text is organized (rows 3.4 and 4.1) — no item or worked example
 * here asks the student to name a heading, caption or organizational
 * pattern. Also excluded: the fictional THEME-and-summary skill of row 2.1,
 * whose objective summary is built from a story's plot rather than a
 * nonfiction text's central idea — every excerpt in this file is
 * informational nonfiction, and none of the items or worked examples
 * involves a character, a plot event, or what a character wants or how a
 * character changes. Also excluded: analyzing two or more central ideas, or
 * how one central idea develops across a text, which is RI.7.2, owned by
 * Grade 7 Unit 3; every passage here states exactly one central idea,
 * already given. DELIBERATELY ALLOWED, because two neighboring rows sit
 * close: (a) this file uses the term "central idea" throughout, since
 * RI.6.2 covers both identifying it (row 3.1) and reporting it inside a
 * summary (this row) as two stages of one standard, and restating an
 * already-given central idea as the first sentence of a summary is not the
 * same skill as determining one from scratch; (b) this file's concept
 * segment repeats the words "objective" and "judgment" that row 2.1 also
 * uses, because Grade 6's ban on a summarizer's own opinion applies the same
 * way whether the text is a story or an informational passage — the two rows
 * share a rule, not a skill, and row 2.1 states that rule for narrative text
 * while this row states it for nonfiction.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original nonfiction
 * prose written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every phrase this file puts inside quotation marks
 * appears character-for-character in the excerpt printed above it; quote
 * your own excerpt exactly, never from memory. Every factual claim about the
 * real world in this file (popcorn, airplane ear pressure, onions, soda, and
 * autumn leaves) is true as stated and carries no invented precise
 * statistic.
 *
 * CLAIM LEDGER (informational passages):
 *   Claim                                       | Where               | Grounds
 *   A popcorn kernel pops because trapped water  | worked example 1,  | Long-settled food
 *   turns to steam and the built-up pressure     | passage + answer   | science; the standard
 *   bursts the shell, releasing the starch as    |                    | explanation of why
 *   foam                                         |                    | popcorn pops.
 *   Ears pop on an airplane because swallowing   | worked example 2,  | Long-settled human
 *   or yawning opens the Eustachian tube, which  | passage + answer   | physiology (middle-ear
 *   lets air pressure equalize between the       |                    | pressure equalization
 *   middle ear and the surrounding air           |                    | via the Eustachian tube).
 *   Cutting an onion releases a chemical that    | try-1 passage      | Long-settled food
 *   turns into a gas and irritates the eyes,     |                    | chemistry (onion's
 *   causing the eyes to make extra tears         |                    | lachrymatory compound).
 *   Soda goes flat because opening the can       | try-2 passage      | Long-settled chemistry
 *   releases the pressure keeping carbon dioxide |                    | (gas solubility drops
 *   dissolved, and the gas escapes over time     |                    | once pressure is released).
 *   Leaves change color in fall because the      | try-3 passage      | Long-settled plant
 *   green chlorophyll pigment breaks down,        |                    | biology (chlorophyll
 *   revealing yellow and orange pigments that    |                    | breakdown unmasking
 *   were already present in the leaf             |                    | carotenoid pigments).
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U3_SUMMARIZING_INFORMATIONAL_TEXT: LessonPlan = {
  id: 'evelyn.ms.m6ela.summarizing-informational-text.v1',
  title: 'Summarizing Informational Text',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.summarizing-informational-text',
      standard: 'M6ELA-3.2',
      description:
        'Write an objective summary of an informational text that states its already-identified central idea and only the details that support it, leaving out the summarizer\'s own reactions and conclusions entirely, including a quiet conclusion introduced by a phrase such as "this shows that" (CCSS RI.6.2; determining the central idea itself is the separate, prior skill taught by row 3.1).',
    },
  ],
  prerequisites: ['m6ela.central-idea-and-supporting-details'],
  followUps: ['m6ela.technical-and-domain-vocabulary'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel the gap between a raw dump of facts and the one short, fair paragraph that reports what a text said.',
      script:
        'A friend texts you the patch notes for a video game update: eleven bullet points about weapon changes, three about map fixes, and a note about a new character. Practice starts in twenty minutes and there is no time to read all of it. If a teammate texts back all eleven bullet points typed out again, you still have to do the sorting yourself. If a teammate texts back one sentence instead — the new character is strong right now, and two old strategies got weaker — you know exactly what matters before you play. That one sentence is a summary of the patch notes, and it works the same way on any piece of nonfiction writing, not just game updates. You already know how to find a text\'s central idea and which details support it, because that was the last lesson. Today the job is turning that central idea and those details into a short, fair paragraph that reports what the text said, and nothing about what you personally think of it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-summary-vs-retelling',
      kind: 'concept',
      goal: 'Separate summarizing an informational text from retelling it, and install the no-judgment rule using both the obvious judgment words and the quieter kind.',
      keyIdeas: [
        'A SUMMARY OF AN INFORMATIONAL TEXT STARTS WITH THE CENTRAL IDEA, ALREADY FOUND. Finding the central idea was the skill of the previous lesson. Here it is simply the first sentence of the summary you are building, not something to go hunting for again. Add only the details that explain or support that sentence, and stop there.',
        'RETELLING IS NOT SUMMARIZING. A retelling repeats a text\'s facts in the order the text gave them, treating every one of them as equally important. A summary is shorter than a retelling because it drops any fact that does not connect back to the central idea, even a fact that is true and interesting on its own.',
        'OBJECTIVE MEANS NO JUDGMENT, EVEN A QUIET ONE. Cross out the obvious judgment words first: amazing, incredible, boring, sad. Then watch for the quieter kind, a sentence that announces a conclusion instead of reporting a fact, using words such as "this shows that" or "which proves." Those words hand over the summarizer\'s own opinion about how important or impressive something is, and an objective summary carries none of that.',
        'A GOOD SUMMARY IS NOTICEABLY SHORTER THAN THE PASSAGE IT REPORTS ON. If a summary lines up sentence for sentence with the original passage, nothing has been picked out as more important than anything else, and everything the passage said has simply been restated.',
        'TEST A SUMMARY BY ASKING WHO IS TALKING. Every sentence in it should sound like it is reporting the passage, not like the summarizer is reacting to it. Two readers who disagree about how interesting the topic is should still be able to sign the exact same summary.',
      ],
      vocabulary: [
        { term: 'objective summary', definition: 'a short, factual restatement of an informational text\'s central idea and the details that support it, with the summarizer\'s own opinions and conclusions left out.' },
        { term: 'retelling', definition: 'a version of a text that lists its facts in the order they originally appeared, without picking out which ones support the central idea.' },
        { term: 'judgment', definition: 'a statement of how good, important, exciting or surprising something is, including a quiet version such as "this shows that" or "which proves," rather than a plain report of what the text says.' },
        { term: 'central idea', definition: 'the one sentence stating the main point an informational text makes about its topic, identified as its own skill in the previous lesson.' },
        { term: 'supporting detail', definition: 'a specific fact from the text that helps prove the central idea is true, used here to build a summary rather than to identify the idea itself.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-a-summary',
      kind: 'worked_example',
      problem:
        'Build an objective summary of this passage, using the central idea already identified below it.\n\n"Popcorn pops because of the tiny bit of water sealed inside each hard kernel. When a kernel heats up, that water turns into steam, and the steam has nowhere to go inside the hard shell. Pressure keeps building inside the kernel until the shell finally bursts open. The soft starch inside blows outward and puffs into the white foam people eat at movies. Many people like to add butter or salt once the popcorn has popped."\n\nCentral idea: a popcorn kernel pops because trapped water turns to steam, and the built-up pressure bursts the shell open.',
      steps: [
        'Start with the central idea, already given: a popcorn kernel pops because trapped water turns to steam, and the built-up pressure bursts the shell open. That sentence becomes the first sentence of the summary.',
        'Check each remaining sentence in the passage against that central idea, one at a time. The second sentence explains that "that water turns into steam" and "the steam has nowhere to go inside the hard shell" — both explain why pressure builds, so both connect.',
        'The third sentence says, "Pressure keeps building inside the kernel until the shell finally bursts open." That is the central idea\'s own ending, so it stays.',
        'The fourth sentence says, "The soft starch inside blows outward and puffs into the white foam people eat at movies." That is what happens right after the burst, still part of the same chain, so it stays too.',
        'The fifth sentence, about adding "butter or salt once the popcorn has popped," is true and about popcorn, but it has nothing to do with why the kernel pops in the first place. It does not connect to the central idea, so it is cut.',
        'Write the kept details in order, in fewer words than the passage used, with no judgment added anywhere.',
      ],
      answer:
        'A popcorn kernel pops because a small amount of water sealed inside turns to steam when the kernel heats up. The steam cannot escape, so pressure builds until the shell bursts, and the starch inside puffs into foam.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-a-summary',
      kind: 'worked_example',
      problem:
        'Repair this summary so that it reports the passage objectively, without retelling every sentence and without adding a judgment.\n\nPassage: "When an airplane climbs or drops quickly, the air pressure inside the cabin changes faster than the air pressure inside your ears can match it. A narrow tube called the Eustachian tube connects the middle ear to the back of the throat, and swallowing or yawning opens that tube for a moment. Opening the tube lets air move in or out of the middle ear until the pressure on both sides is equal again. Once the pressure equalizes, the popping or fullness feeling goes away."\n\nCentral idea: ears pop on an airplane because swallowing or yawning opens the Eustachian tube, letting air pressure equalize between the middle ear and the surrounding air.\n\nStudent summary: "When an airplane climbs or drops quickly, the air pressure inside the cabin changes. There is a narrow tube called the Eustachian tube. It connects the middle ear to the back of the throat. Swallowing or yawning opens that tube. This shows that your body is amazing at fixing pressure problems on its own."',
      steps: [
        'Find the retelling problem first. The first four sentences repeat the passage\'s own facts in the passage\'s own order, each as its own short sentence, without ever stating the central idea as one sentence. That is a retelling, not a summary.',
        'Find the judgment problem next. The last sentence, "This shows that your body is amazing at fixing pressure problems on its own," is not something the passage says. It announces the summarizer\'s own conclusion about how impressive the body is, using the words "this shows that." An objective summary reports what happens, not what the summarizer thinks about it.',
        'Rebuild it, starting with the central idea, already given: ears pop on an airplane because swallowing or yawning opens a tube that lets air pressure equalize between the middle ear and the surrounding air.',
        'Add only the detail that explains how that happens: the Eustachian tube "connects the middle ear to the back of the throat," and swallowing or yawning "opens that tube for a moment."',
        'WRONG: "When an airplane climbs or drops quickly, the air pressure inside the cabin changes. There is a narrow tube called the Eustachian tube. It connects the middle ear to the back of the throat. Swallowing or yawning opens that tube. This shows that your body is amazing at fixing pressure problems on its own." CORRECT: "Ears pop on an airplane because the air pressure around you changes faster than your ears can match it. Swallowing or yawning opens the Eustachian tube, a narrow tube connecting the middle ear to the throat, and that lets air move until the pressure equalizes again."',
        'Last check: could a reader who finds airplane pressure fascinating and a reader who finds it dull both sign the corrected version? Yes, because every sentence in it reports what happens, and nothing in it says what to think about it.',
      ],
      answer:
        'Ears pop on an airplane because the air pressure around you changes faster than your ears can match it. Swallowing or yawning opens the Eustachian tube, a narrow tube connecting the middle ear to the throat, and that lets air move until the pressure equalizes again.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-best-summary-onion',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the best OBJECTIVE SUMMARY. Its central idea has already been identified below it.\n\n"Cutting into an onion breaks open tiny cells that release a chemical mixed with the onion\'s natural sulfur. As soon as that chemical touches the air, it turns into a gas that drifts upward toward your face. When the gas reaches your eyes, it mixes with the thin layer of water that keeps your eyes moist and forms a mild irritant. Your eyes respond by making extra tears to wash the irritant away."\n\nCentral idea: cutting an onion releases a gas that irritates the eyes, and the eyes make extra tears to wash that irritant away.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'This shows that onions are more complicated than most people realize, which makes them one of the more surprising vegetables found in an ordinary kitchen.' },
        { id: 'b', text: 'Cutting an onion releases a chemical that turns into a gas, and that gas irritates the eyes, so the eyes make extra tears to wash the irritant away.', correct: true },
        { id: 'c', text: 'Cutting into an onion breaks open tiny cells and releases a chemical mixed with sulfur. That chemical turns into a gas once it touches the air. The gas drifts upward and reaches the eyes. The eyes are covered by a thin layer of water that keeps them moist.' },
        { id: 'd', text: 'Onion layers grow in rings underneath a thin, papery outer skin, and the bulb itself grows underground before the plant is harvested.' },
      ],
      expectedAnswer: 'Cutting an onion releases a chemical that turns into a gas, and that gas irritates the eyes, so the eyes make extra tears to wash the irritant away.',
      hints: [
        'Two of these four choices never actually explain why the eyes make tears at all — one stops at the eyes simply being moist, and one talks about a completely different part of the onion.',
        'One choice reports the passage\'s own chain of events and reaches the reason tears form. Another choice reacts to the passage instead of reporting it, using the words "this shows that."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-summary-soda',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the best OBJECTIVE SUMMARY. Its central idea has already been identified below it.\n\n"A can of soda is sealed under high pressure, and that pressure keeps carbon dioxide gas dissolved inside the liquid instead of escaping as bubbles. Opening the can lets some of that pressure out all at once, which is why the drink fizzes right when you open it. After the can stays open, pressure keeps leaking out a little at a time, and dissolved gas keeps escaping along with it. Once most of the gas has escaped, the soda tastes flat because the bubbles that carried its fizz are gone."\n\nCentral idea: soda goes flat because opening the can releases the pressure that was keeping carbon dioxide gas dissolved in the liquid, and the gas keeps escaping until the fizz is gone.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A can of soda is sealed under high pressure. Carbon dioxide gas is dissolved inside the liquid. Opening the can lets some of that pressure out all at once. The drink fizzes right when it is opened.' },
        { id: 'b', text: 'It is pretty amazing that opening a can causes such a dramatic fizzy reaction, and that fizz is honestly the best part of drinking soda in the first place.' },
        { id: 'c', text: 'Soda goes flat because opening the can releases the pressure that was keeping carbon dioxide gas dissolved in the liquid, and the gas keeps escaping until the fizz is gone.', correct: true },
        { id: 'd', text: 'Opening a can of soda lets pressure out all at once, which is why the drink fizzes the moment the can is opened.' },
      ],
      expectedAnswer: 'Soda goes flat because opening the can releases the pressure that was keeping carbon dioxide gas dissolved in the liquid, and the gas keeps escaping until the fizz is gone.',
      hints: [
        'One choice never reaches the reason the soda eventually tastes flat, one only explains the fizz at the moment of opening and stops there, and one reacts to the fizz instead of reporting on it.',
        'The passage\'s last sentence is where the real point lands. Whichever choice you pick, check whether it explains why the soda ends up flat, not only why it fizzes at first.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-summary-leaves',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the best OBJECTIVE SUMMARY. Its central idea has already been identified below it.\n\n"During spring and summer, leaves look green because a pigment called chlorophyll is present in large amounts. Chlorophyll is what leaves use to capture sunlight and make food for the tree, but yellow and orange pigments are inside the leaf all along, hidden underneath the green. In fall, cooler nights and shorter days cause the tree to stop making chlorophyll, and the green pigment breaks down faster than the tree can replace it. Once the green fades, the yellow and orange pigments that were there the whole time finally show through."\n\nCentral idea: leaves change color in fall not because a new color appears, but because the green pigment that had been covering the yellow and orange all along finally breaks down.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Chlorophyll is the pigment that leaves use to capture sunlight and make food for the tree, and it is present in the largest amounts during the warm, sunny months of spring and summer, which is why leaves look their deepest green then.' },
        { id: 'b', text: 'This shows just how amazing trees really are at surviving the changing seasons, and watching the leaves turn color every fall is one of nature\'s most beautiful and impressive displays.' },
        { id: 'c', text: 'Leaves look green in spring and summer because of the pigment chlorophyll. Yellow and orange pigments are inside the leaf the whole time, hidden underneath the green. In fall, the nights get cooler and the days get shorter. The tree responds by slowing down its production of chlorophyll.' },
        { id: 'd', text: 'Leaves change color in fall because the tree stops making the green pigment chlorophyll once nights turn cooler and days get shorter, and as the green fades, the yellow and orange pigments that were there all along finally show through.', correct: true },
      ],
      expectedAnswer: 'Leaves change color in fall because the tree stops making the green pigment chlorophyll once nights turn cooler and days get shorter, and as the green fades, the yellow and orange pigments that were there all along finally show through.',
      hints: [
        'One choice only describes chlorophyll\'s job in spring and summer and never gets to fall at all, one reacts to the topic instead of reporting on it, and one lists the passage\'s facts in order but stops one sentence before the actual color change happens.',
        'Check whether the choice you are considering ever says what happens once the green pigment is gone. That is the whole point of the passage, and only one choice reaches it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-retelling-and-quiet-judgment',
      kind: 'misconception_check',
      question:
        'A student summarizes an article about volcanoes two different ways. First version: every fact from the article, written down in the exact order the article gave them, starting with the article\'s own opening sentence. Second version: a short, accurate list of facts that ends with, "This shows that volcanoes are one of nature\'s most powerful forces." What went wrong with each version?',
      commonErrors: [
        {
          answer: 'Every fact from the article, written down in the exact order the article gave them, starting with the article\'s own opening sentence.',
          misconception:
            'Treating a complete retelling as a summary. Every sentence in it is true, and a true sentence does not look like a mistake, so the error is easy to miss.',
          correctsTo:
            'A summary states the central idea first, then keeps only the details that support it, and drops the rest, even facts that are true and interesting. Starting with the article\'s own opening sentence is also a sign of trouble, because the real point of an informational text often lands later, not in its first line.',
        },
        {
          answer: 'A short, accurate list of facts that ends with, "This shows that volcanoes are one of nature\'s most powerful forces."',
          misconception:
            'Slipping in a quiet judgment. The closing sentence sounds like a natural way to wrap up a summary, and it never uses an obvious opinion word like amazing or boring, so it does not feel like an opinion.',
          correctsTo:
            'The words "this shows that" announce a conclusion the summarizer drew, not a fact the article stated. An objective summary reports only what the text itself says, so that closing sentence has to be cut entirely, not softened.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An objective summary states the already-identified central idea first, then adds only the supporting details that back it, in fewer words than the original.',
        'Retelling is not summarizing. Retelling lists every fact in the text\'s own order; summarizing keeps only what supports the central idea and drops the rest.',
        'Cut the obvious judgment words, such as amazing, boring and incredible, and cut the quiet kind too. WRONG: "This shows that volcanoes are one of nature\'s most powerful forces." CORRECT: report only what the text itself says.',
        'A summary that never reaches the passage\'s actual point, such as why the soda ends up flat or why the leaves finally show color, is incomplete, even when every sentence in it is true.',
        'Test a summary by asking whether two readers who disagree about how interesting the topic is could both sign it. If not, a judgment is still hiding in it somewhere.',
        'A good summary is noticeably shorter than the passage it reports on, not a sentence-for-sentence restatement of it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Summarizing Informational Text' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
