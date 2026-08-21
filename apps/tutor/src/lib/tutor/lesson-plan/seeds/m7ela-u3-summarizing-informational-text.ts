/**
 * Grade 7 ELA — Reading Informational Text: Summarizing Informational Text.
 *
 * Procedure-led (CCSS RI.7.2). One four-step recipe runs the whole lesson:
 * find the central idea, keep only the details that support it, cut the
 * examples and repetitions and opinions, then write it shorter and in your
 * own words. The four traps it is built to kill are copying the opening
 * sentences, keeping every interesting detail, smuggling in "I think", and
 * calling a word-swapped copy "my own words".
 *
 * NOTE FOR FUTURE AUTHORS: every passage in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. The subjects are ordinary, checkable facts and the
 * passages carry no invented statistics.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U3_SUMMARIZING_INFORMATIONAL_TEXT: LessonPlan = {
  id: 'evelyn.ms.m7ela.summarizing-informational-text.v1',
  title: 'Summarizing Informational Text',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.summarizing-informational-text',
      standard: 'M7ELA-3.2',
      description:
        'Write an objective summary of an informational text by stating its central idea, keeping only the details that support that idea, and restating them in your own words in fewer words than the original (CCSS RI.7.2).',
    },
  ],
  prerequisites: ['m7ela.central-idea-and-supporting-details'],
  followUps: ['m7ela.text-features-and-graphics'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already summarizes every day, then name the one rule they usually break.',
      script:
        'A friend misses the first twenty minutes of a movie and whispers, what did I miss. You do not replay every line for them. You give them the two things that matter, and you do it in about ten seconds. That is a summary, and you are already good at it. Now think about what you would say if that same friend asked what you thought of the movie. Different answer. That second answer has your opinion in it. Today we build a four-step recipe for the first kind of answer, the one that tells somebody what a text says without telling them what you think about it. The recipe works on any article, any notice, any page of a science book.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-summary-recipe',
      kind: 'concept',
      goal: 'Install the four-step recipe, then name the four traps that break a summary.',
      keyIdeas: [
        'A SUMMARY TELLS WHAT THE TEXT SAYS, NOT WHAT YOU THINK. It is shorter than the original, it is in your own words, and it leaves your feelings out. A review says whether the text was good. A summary says what the text said. Every rule below comes from that one difference.',
        'STEP 1 — FIND THE CENTRAL IDEA. Ask what the whole text is mostly about, and answer in one sentence. Not one topic word, one sentence. "Sea otters" is a topic. "Sea otters protect kelp forests by eating the urchins that damage them" is a central idea. Your summary is built around that sentence, so get it first.',
        'STEP 2 — KEEP ONLY THE DETAILS THAT SUPPORT THE CENTRAL IDEA. Go through the text and ask one question about each detail: does this help explain the sentence I just wrote. If it does, keep it. If it does not, it goes, no matter how interesting it is. Two or three supporting details is usually enough.',
        'STEP 3 — CUT THE EXAMPLES, THE REPEATS AND YOUR OPINIONS. Writers give examples to make an idea clear, and one idea often comes back two or three times in different words. A summary states the idea once and drops the examples. It also drops every judgment: no "I think", no "this part was boring", no "everybody should read this".',
        'STEP 4 — WRITE IT IN YOUR OWN WORDS, SHORTER THAN THE ORIGINAL. Aim for about a quarter to a third of the length. Cover the page and say the idea out loud first, then write down what you said. Your own words means your own sentences.',
        'SWAPPING A FEW WORDS IS NOT YOUR OWN WORDS. Keeping the shape of the original sentence and changing students to pupils, or willing to eager, is a close paraphrase. It is still the writer sentence wearing a hat, and it does not count. The test is simple: if your sentence lines up with the original word by word, you copied it. Rebuild the sentence from scratch instead.',
      ],
      vocabulary: [
        { term: 'summary', definition: 'a short restatement of what a text says, in your own words.' },
        { term: 'central idea', definition: 'the most important point the whole text makes, stated as a full sentence.' },
        { term: 'supporting detail', definition: 'a fact, reason or step in the text that helps explain the central idea.' },
        { term: 'objective', definition: 'sticking to what the text says, with no personal opinion added.' },
        { term: 'close paraphrase', definition: 'a copy of the original sentence with only a few words changed, which does not count as your own words.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-run-the-recipe',
      kind: 'worked_example',
      problem:
        'Summarize this passage using the four steps.\n\n"Sea otters spend much of the day eating, and one of their favorite foods is the sea urchin. Urchins feed on the base of kelp, the tall seaweed that grows in thick underwater forests. Where otters are common, they keep urchin numbers down and the kelp forest stays healthy. Where otters have vanished, urchins spread across the sea floor and the kelp is stripped away."',
      steps: [
        'Step 1, find the central idea. Ask what the whole passage is mostly about. Every sentence is about otters, urchins and kelp, and the last two sentences set up a contrast: otters present, kelp healthy; otters gone, kelp stripped. So the central idea is that sea otters protect kelp forests by eating urchins.',
        'Step 2, keep only the details that support that. The passage gives a chain, and each link is needed: otters eat urchins, urchins eat kelp, so otters keep the kelp forest alive. Those three go in.',
        'Step 3, cut the rest. Out goes "spend much of the day eating", which is a detail about otter habits and does not explain the chain. Out goes the description of kelp as tall seaweed in thick forests, which is there to help you picture it. Out goes any opinion of yours about otters being cute, because that is not in the passage at all.',
        'Step 4, write it in your own words and make it shorter. Say the idea out loud first with the passage covered, then write down what you said.',
        'Here is the summary: "Sea otters eat sea urchins, and urchins feed on kelp. When otters live in an area, urchin numbers stay low and the kelp forest survives. When otters are gone, urchins take over and the kelp disappears."',
        'Check it against the recipe. Central idea, yes. Only supporting details, yes. No opinion, no examples, and it is shorter than the original. Notice that the summary does not open with the passage first sentence. That sentence is about how much otters eat, and it was never the point.',
      ],
      answer:
        'Sea otters eat sea urchins, and urchins feed on kelp. When otters live in an area, urchin numbers stay low and the kelp forest survives. When otters are gone, urchins take over and the kelp disappears.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-bad-summary',
      kind: 'worked_example',
      problem:
        'A student wrote a summary of this passage. Find every rule it breaks, then fix it.\n\nPASSAGE: "Bread dough rises because of yeast, a tiny living thing mixed into the flour and water. The yeast feeds on sugars in the dough and gives off a gas as it works. That gas gets trapped in stretchy strands inside the dough, so the dough puffs up. In the oven the heat kills the yeast, and the dough sets in its risen shape."\n\nSTUDENT SUMMARY: "Bread dough rises because of yeast, a tiny living thing mixed into the flour and water. I think it is cool that something alive is hiding in a sandwich. Yeast is really interesting."',
      steps: [
        'Problem one, the opening is copied. The student first sentence is the passage first sentence, word for word. Copying is not summarizing, and a summary that starts by copying almost always stops before the real point.',
        'Problem two, there is an opinion in the middle. "I think it is cool" is the student talking about the student. A summary reports what the text says and nothing else.',
        'Problem three, the last line adds a judgment and no information. "Yeast is really interesting" tells a reader nothing about how dough rises.',
        'Problem four, the point is missing. The passage explains a chain: yeast feeds, gas comes off, the gas is trapped, the dough puffs up, and the oven locks the shape in. The student summary stops after the first link, so a reader learns nothing about why the dough rises.',
        'Now rebuild it. Step 1, central idea: yeast makes bread dough rise by giving off a gas that gets trapped inside. Step 2, supporting details: yeast feeds on sugars, the gas is caught in stretchy strands, the oven heat sets the risen shape.',
        'Steps 3 and 4, cut and rewrite. Here is the repaired summary: "Yeast is a living thing in the dough that feeds on sugars and lets off a gas. Stretchy strands in the dough trap the gas, which makes the dough puff up. Baking then kills the yeast and locks the dough in its risen shape."',
        'One last check. Notice how the repaired version does not follow the passage sentence by sentence with a few words swapped. That would be a close paraphrase, not a summary. The sentences were rebuilt.',
      ],
      answer:
        'Yeast is a living thing in the dough that feeds on sugars and lets off a gas. Stretchy strands in the dough trap the gas, which makes the dough puff up. Baking then kills the yeast and locks the dough in its risen shape.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-best-summary-bees',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the best summary.\n\n"When a honeybee finds a good patch of flowers, she flies back to the hive and dances for the other bees. She walks a short straight line while shaking her body, then loops around and repeats the same path. The angle of that straight line tells the other bees which direction to fly, and the length of the dance tells them how far away the flowers are. Bees that watch the dance leave the hive and search in that direction."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'When a honeybee finds a good patch of flowers, she flies back to the hive and dances for the other bees. She walks a short straight line while shaking her body.' },
        { id: 'b', text: 'A honeybee that finds flowers dances inside the hive, and the way she dances tells the other bees which direction to fly and how far to go.', correct: true },
        { id: 'c', text: 'Honeybees walk a straight line, shake their bodies, then loop around and do it again.' },
        { id: 'd', text: 'Honeybees dance to share directions to flowers, and it is amazing that such a small insect can give such clear instructions.' },
      ],
      expectedAnswer: 'A honeybee that finds flowers dances inside the hive, and the way she dances tells the other bees which direction to fly and how far to go.',
      hints: [
        'Start with step 1. In one sentence, what is this whole passage mostly about? Then check which choice actually says that.',
        'One choice copies the opening sentences, one keeps the dance steps but never says what the dance is for, and one adds an opinion about how amazing bees are.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-summary-thermos',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the best summary.\n\n"A thermos has two walls with a narrow gap between them, and most of the air has been pumped out of that gap. Heat moves easily through air, so when there is almost no air in the gap, heat has a hard time crossing it. The inside wall is usually coated with a shiny layer that reflects heat back toward the drink. Together these features slow down how fast a hot drink cools."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A thermos has two walls with a narrow gap between them, and most of the air has been pumped out of that gap.' },
        { id: 'b', text: 'A thermos is shiny on the inside, and it has two walls.' },
        { id: 'c', text: 'A thermos keeps a drink hot because the gap between its two walls holds almost no air and a shiny coating bounces heat back toward the drink, so the heat escapes slowly.', correct: true },
        { id: 'd', text: 'A thermos is the best way to carry soup to school, because the shiny coating traps all of the heat inside.' },
      ],
      expectedAnswer: 'A thermos keeps a drink hot because the gap between its two walls holds almost no air and a shiny coating bounces heat back toward the drink, so the heat escapes slowly.',
      hints: [
        'The last sentence of the passage tells you what all the parts are FOR. A summary that lists the parts and never says what they do has dropped the central idea.',
        'One choice copies the first sentence, one lists two features and stops, and one adds an opinion plus a claim the passage never makes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-own-words',
      kind: 'try_yourself',
      problem:
        'Here is one sentence from an article about school gardens: "Students who help grow vegetables at school are more willing to taste those vegetables at lunch."\n\nWhich version restates it in your own words?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Students who assist in growing vegetables at school are more eager to sample those vegetables at lunch.' },
        { id: 'b', text: 'Kids who work in a school garden are more likely to try the food they helped grow.', correct: true },
        { id: 'c', text: 'Students who grow vegetables at school eat only vegetables at lunch.' },
        { id: 'd', text: 'Students who grow vegetables at school will try them at lunch, which proves that every school should have a garden.' },
      ],
      expectedAnswer: 'Kids who work in a school garden are more likely to try the food they helped grow.',
      hints: [
        'Line each choice up against the original, word by word. If the two sentences march along in step with only a few words traded out, that is a close paraphrase, not your own words.',
        'Two of the choices change what the sentence means. One says students eat nothing but vegetables, and one bolts an opinion onto the end.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-copy-and-opinion',
      kind: 'misconception_check',
      question:
        'A student is asked to summarize a short article about how a thermos works. They copy the first two sentences of the article word for word and then add, "I think this is important because everybody likes hot chocolate." What went wrong?',
      commonErrors: [
        {
          answer: 'A summary is the first few sentences of the text, copied out.',
          misconception:
            'Treating the opening as the summary. The student assumes the writer put the main point first, so copying the top of the article must capture it.',
          correctsTo:
            'The opening sentences are usually background, not the point. In the thermos article the first sentence only describes the two walls, and the reason a thermos works does not arrive until the end. Run step 1 instead: read the whole thing, then say in one sentence what it is mostly about. And copying is never summarizing, even when the copied sentence happens to be an important one, because a summary has to be in your own words and shorter than the original.',
        },
        {
          answer: 'A summary can say what I think about the topic.',
          misconception:
            'Mixing a review into a summary. "I think this is important because..." feels like good writing, so the student adds it to show they were paying attention.',
          correctsTo:
            'A summary is objective, which means it reports only what the text says. Whether everybody likes hot chocolate is not in the article, so it cannot be in the summary. Cut every "I think", every "the best part was" and every "this was boring". If you want to give an opinion, that is a review, and it is a different piece of writing. Also watch the quieter version of this mistake: keeping every interesting detail because you liked it. A detail earns its place only when it supports the central idea.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A summary says what the text says. A review says what you think. Never mix them.',
        'Step 1, find the central idea and write it as one full sentence, not one topic word.',
        'Step 2, keep only the details that support that sentence. Step 3, cut the examples, the repeats and every opinion.',
        'Step 4, write it in your own words and shorter, about a quarter to a third of the original.',
        'The first sentences of a text are not the summary. They are usually background, and the point often lands at the end.',
        'Swapping a few words out of the original is a close paraphrase, not your own words. Rebuild the sentence from scratch.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Summarizing Informational Text' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
