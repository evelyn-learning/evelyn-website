/**
 * Grade 7 ELA — Research: Quoting, Paraphrasing & Summarizing.
 *
 * Procedure-led (CCSS W.7.8). Three ways to use a source, and the question
 * that picks between them: what does my reader need, the exact words, one
 * idea, or the gist? The trap this lesson exists to kill is the word-swap
 * "paraphrase" that keeps the source sentence standing and only redecorates
 * it. The second trap is the belief that a source only gets credited when
 * you quote it.
 *
 * NOTE FOR FUTURE AUTHORS: every source sentence in this file is original
 * prose written for this lesson. Do not swap in real book text. Every bad
 * example is labeled WRONG with the CORRECT version beside it, because a
 * tutor reads these aloud.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U10_QUOTING_PARAPHRASING_SUMMARIZING: LessonPlan = {
  id: 'evelyn.ms.m7ela.quoting-paraphrasing-summarizing.v1',
  title: 'Quoting, Paraphrasing & Summarizing',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.quoting-paraphrasing-summarizing',
      standard: 'M7ELA-10.3',
      description:
        'Choose between quoting a source, paraphrasing it and summarizing it, write a paraphrase that rebuilds the sentence instead of swapping in synonyms, and credit the source for all three moves (CCSS W.7.8).',
    },
  ],
  prerequisites: ['m7ela.evaluating-sources'],
  followUps: ['m7ela.citing-sources'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already makes all three moves when retelling something, and that picking the wrong one changes the message.',
      script:
        'Your friend spends ten minutes telling you about the soccer game you missed. Later you retell it three different ways to three different people. To one, you repeat the exact line the coach yelled, because the words are the whole story. To another, you retell one play in full, in your own way. To your grandmother, you say seven words: "We won, and Maya scored the last goal." You just quoted, paraphrased and summarized, without anybody teaching you how. Today we give the three moves their names, and we figure out when each one is the right pick. Then we deal with the mistake almost everybody makes on their first research report.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-moves',
      kind: 'concept',
      goal: 'Install the three moves with the situation each is built for, kill the word-swap paraphrase, and teach the look-away method.',
      keyIdeas: [
        'QUOTE WHEN THE EXACT WORDS MATTER. There are three ways to use a source, and quoting is the first. You copy the words exactly, letter for letter, and you put quotation marks around them. Use it when the wording is precise, or striking, or when the wording itself is what you are talking about. Keep quotations short. One sharp line beats four sentences you did not write.',
        'PARAPHRASE WHEN YOU WANT ONE IDEA IN YOUR OWN WORDS. A paraphrase takes one piece of a source and says it again, completely in your own language and your own sentence shape. It stays about the same length as the original, because you are not cutting anything out. You are rebuilding it. This is the move you will use most often.',
        'A PARAPHRASE IS NOT A WORD SWAP. This is the heart of the lesson. If you keep the original sentence standing and only drop synonyms into it, you have copied the sentence. Original: "When the tide goes out, a tide pool is cut off from the ocean." WRONG: "When the tide moves out, a tide pool is separated from the sea." Every part is still in the same place, wearing a different word. CORRECT: "Low tide leaves a tide pool stranded, with no path back to the ocean." That one was rebuilt from the idea, not edited from the sentence.',
        'THE LOOK-AWAY METHOD BUILDS A REAL PARAPHRASE. Read the sentence until you understand it. Look away from it, or cover it with your hand. Say the idea out loud in your own words. Write down what you said. Only then look back, and look back for one reason only: to check that you got it right. If your eyes are on the source while you write, you will copy its shape without meaning to.',
        'SUMMARIZE WHEN YOU WANT THE GIST OF SOMETHING LONG. A summary takes a whole paragraph, chapter or article and boils it down to the main points, in your own words. A summary is always much shorter than what it covers, and it leaves details behind on purpose. That shortness is the difference between a summary and a paraphrase.',
        'ALL THREE MOVES GET CREDIT. Quoting, paraphrasing and summarizing all use material that came from someone else, so all three name where it came from. Taking off the quotation marks does not turn the idea into yours. The only things that never need credit are your own thinking and facts everybody already knows, such as the fact that water freezes.',
      ],
      vocabulary: [
        { term: 'quote', definition: 'the exact words of a source, copied letter for letter and placed inside quotation marks.' },
        { term: 'paraphrase', definition: 'one idea from a source said again in your own words and your own sentence structure, at about the same length.' },
        { term: 'summary', definition: 'the main points of something long, in your own words, made much shorter than the original.' },
        { term: 'credit', definition: 'naming the source an idea came from, whether you quoted it, paraphrased it or summarized it.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-build-a-paraphrase',
      kind: 'worked_example',
      problem:
        'Paraphrase this sentence from a book about tide pools for your report. "When the tide goes out, a tide pool is cut off from the ocean, and the animals trapped inside must wait for hours until the water returns."',
      steps: [
        'Pick the move first. Nothing about this wording is striking, and you do not need the whole chapter. You need this one idea, said your way. That is a paraphrase.',
        'Watch what happens if you skip the method and just edit the sentence. WRONG: "When the tide moves out, a tide pool is separated from the sea, and the creatures stuck inside have to wait for hours until the water comes back." Line the two up and every piece is in the same slot: goes out became moves out, cut off became separated, trapped became stuck. That is a copy in a costume, and it is not allowed even if you name the book.',
        'Now do it properly. Cover the sentence with your hand and say the idea out loud: the tide leaves, the pool gets stranded, and the animals in it are stuck there for hours.',
        'Write what you said, and let it find its own shape. CORRECT: "Animals in a tide pool have no way out once the ocean pulls back. The pool is on its own for hours, and so is everything living in it, until the tide comes in again."',
        'Look back at the source now, and only to check accuracy. Did the original say the animals wait hours? Yes. Did it say the pool loses contact with the ocean? Yes. Nothing was added and nothing was dropped.',
        'Check the length. Two sentences for one, which is about the same size. A paraphrase does not shrink the original. If yours came out much shorter, you wrote a summary instead.',
        'Credit the book. A paraphrase still carries a fact that came from the book, so the book gets named exactly the way a quotation would.',
      ],
      answer:
        'A rebuilt version written from memory: "Animals in a tide pool have no way out once the ocean pulls back. The pool is on its own for hours, and so is everything living in it, until the tide comes in again." Credited to the tide pool book.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pick-the-move',
      kind: 'worked_example',
      problem:
        'A book about tide pools has this paragraph. "Barnacles look like small gray bumps of rock. When the tide is out, each one seals itself shut and holds a drop of seawater inside. When the water returns, the barnacle opens and sweeps tiny bits of food out of the current with feathery legs." Your report has room for one sentence about barnacles. Which move do you use?',
      steps: [
        'Ask the question that picks the move: what does my reader need from this? Not the exact wording. Not one idea in full. The reader needs the gist of the whole paragraph in one sentence. That is a summary.',
        'Cover the paragraph and say the main points out loud: a barnacle shuts itself up with water inside while the tide is gone, and opens to feed when the tide comes back.',
        'Write it short: "A barnacle seals a drop of seawater inside itself while the tide is out, then opens up to feed once the tide returns."',
        'Check it against the rules for a summary. Much shorter than the paragraph? Yes, one sentence instead of three. Your own words? Yes. Main points only? Yes, and the feathery legs got left behind, which is exactly what a summary is supposed to do with a detail.',
        'Now change the situation and watch the move change with it. Suppose your report is about how the book describes sea creatures. Then the wording is the point, so you quote: The book calls barnacles "small gray bumps of rock." Notice how short that quotation is. You take the striking phrase and nothing else.',
        'Either way, name the book. A summary leans on a source just as much as a quotation does.',
      ],
      answer:
        'Summarize, because one sentence has to cover a whole paragraph: "A barnacle seals a drop of seawater inside itself while the tide is out, then opens up to feed once the tide returns." Quoting would win only if the wording itself were the point, and then you would keep the quotation short, such as "small gray bumps of rock." Credit the book either way.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-real-paraphrase',
      kind: 'try_yourself',
      problem:
        'Original, from a book about honeybees: "A honeybee that finds a good patch of flowers returns to the hive and dances in a pattern that tells the other bees which direction to fly." Which choice is a real paraphrase of that sentence?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A honeybee that locates a nice patch of blossoms goes back to the hive and dances in a pattern that shows the other bees which direction to travel.' },
        { id: 'b', text: 'Direction is what the dance is for. Once a bee has found flowers worth visiting, it heads home and moves in a pattern that points the rest of the hive the right way.', correct: true },
        { id: 'c', text: 'The other bees watch one bee dance, then follow that bee in a line back to the flowers.' },
        { id: 'd', text: 'A honeybee that finds a good patch of flowers returns to the hive and dances in a pattern that tells the other bees which direction to fly. The book is named on my sources page.' },
      ],
      expectedAnswer:
        'Direction is what the dance is for. Once a bee has found flowers worth visiting, it heads home and moves in a pattern that points the rest of the hive the right way.',
      hints: [
        'Do not pick the one that sounds different. Line each choice up against the original piece by piece and watch whether the pieces are still in the same order.',
        'One choice only swaps synonyms into the same sentence shape, one copies the sentence exactly and hopes a source list fixes it, and one says something the original never said.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pick-the-move',
      kind: 'try_yourself',
      problem:
        'You are writing a report about the new skate park. A sign at the entrance says, "Helmets required. No exceptions, no excuses." You want your reader to hear exactly how strict that rule sounds. Which move fits?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Copy the words into your own sentence without quotation marks, since a sign is not something a person said out loud.' },
        { id: 'b', text: 'Paraphrase the line, because paraphrasing is always the safer choice.' },
        { id: 'c', text: 'Summarize everything else written on the sign so the reader gets the full picture.' },
        { id: 'd', text: 'Quote the line, because the exact words are what make the rule sound strict.', correct: true },
      ],
      expectedAnswer: 'Quote the line, because the exact words are what make the rule sound strict.',
      hints: [
        'Ask what the reader needs. Is it the general idea that helmets are required, or the blunt way this particular sign says it?',
        'When the wording itself is the point, putting it in your own words throws away the thing you wanted. And quotation marks are for exact copied words from anywhere, not only for speech.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-summary',
      kind: 'try_yourself',
      problem:
        'Original, from a field guide to city parks: "Crows in the park have learned which benches people eat lunch on. They arrive before noon and wait in the branches above those benches. When a crumb drops, the closest crow is on the ground before it stops rolling." Which choice is the best SUMMARY of that paragraph?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The crows in the park know which benches people eat lunch on, so they show up before noon and sit in the branches over those benches, and as soon as a crumb falls the nearest crow reaches the ground before the crumb stops rolling.' },
        { id: 'b', text: 'Park crows have figured out where lunch happens, so they wait above those benches and grab dropped food fast.', correct: true },
        { id: 'c', text: 'Crows are the smartest birds in any city park, which is why people should stop eating lunch outdoors.' },
        { id: 'd', text: 'Some birds in the park behave in interesting ways around people during the day.' },
      ],
      expectedAnswer: 'Park crows have figured out where lunch happens, so they wait above those benches and grab dropped food fast.',
      hints: [
        'Start with length. A summary is much shorter than what it covers, so one of these is disqualified before you even check the meaning.',
        'Of the short ones, rule out the choice that adds an opinion the paragraph never states, and the choice so vague that it drops the actual finding.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-credit-only-for-quotes',
      kind: 'misconception_check',
      question:
        'Jamal used a book about tide pools for his report. He put one of its ideas fully in his own words and never named the book. He says, "I did not quote it. I wrote that sentence myself, so I do not owe anybody anything." What went wrong?',
      commonErrors: [
        {
          answer: 'You only have to credit a source when you use its exact words.',
          misconception:
            'Thinking that quotation marks are what trigger the credit, so a paraphrase or a summary can travel without a source.',
          correctsTo:
            'Credit follows the IDEA, not the punctuation. Jamal wrote the sentence, but he did not find out that fact. The book did. A paraphrase and a summary both take something a source found out and pass it to your reader, so both name the source, exactly the way a quotation does. Ask yourself one question about every sentence in a report: did I know this before I opened the source? If the answer is no, name the source.',
        },
        {
          answer: 'If you name the source, you can keep its wording.',
          misconception:
            'Flipping the rule over, and treating a credit line as permission to copy the sentence itself.',
          correctsTo:
            'Naming the source says where the idea came from. It does not hand you the sentence. If you want the exact words, copy them exactly and put quotation marks around them. If you do not want the exact words, cover the source and rebuild the idea from memory. WRONG: keeping the original sentence with a few synonyms dropped in and a source name at the end. CORRECT: quotation marks around the exact words, or a genuinely rebuilt sentence, and a source name either way.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pick the move by asking what your reader needs: the exact words means quote, one idea in your words means paraphrase, the gist of something long means summarize.',
        'Quote exactly, inside quotation marks, and keep it short.',
        'A paraphrase changes the words AND the sentence structure, and stays about the same length. WRONG: the same sentence with synonyms dropped in. CORRECT: the idea rebuilt from scratch.',
        'The look-away method: read it, cover it, say it in your own words, write that down, then look back only to check accuracy.',
        'A summary is much shorter than the original and keeps only the main points.',
        'All three moves get credit. Losing the quotation marks does not make the idea yours.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'Quoting, Paraphrasing & Summarizing' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
