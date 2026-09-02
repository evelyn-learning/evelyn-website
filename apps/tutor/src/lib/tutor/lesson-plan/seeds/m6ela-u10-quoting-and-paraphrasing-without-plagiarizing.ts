/**
 * Grade 6 ELA — Research & Citation: Quoting & Paraphrasing Without
 * Plagiarizing.
 *
 * PROCEDURE-LED fan-out row. There is one repeatable move and this lesson
 * makes it fluent: decide whether the exact wording matters, then either
 * copy it exactly inside quotation marks or rebuild the idea from scratch in
 * a new sentence shape (CCSS W.6.8). The trap this lesson exists to kill is
 * the near-copy "paraphrase" that keeps the source sentence standing and
 * only swaps in a couple of synonyms. The second trap is believing that
 * naming a source is a substitute for quotation marks, rather than a
 * separate requirement that applies to a quote and a paraphrase alike.
 *
 * SCOPE GUARD: Grade 6 row 10.3 teaches two moves only — quoting a source
 * exactly and paraphrasing it by rebuilding both the words and the sentence
 * structure while keeping the meaning — and teaches that both moves require
 * credit, so that a source's words or ideas are never left looking like the
 * student's own. DELIBERATELY EXCLUDED: judging whether a source itself is
 * trustworthy (row 10.2, "Evaluating Source Credibility" — that row owns
 * gathering and assessing sources; this row assumes a source has already
 * been judged credible and focuses only on how its words and ideas get
 * used); recording a source's title, author and where it was found (row
 * 10.4, "Giving Basic Source Information" — the bibliographic record-keeping
 * habit); summarizing a source as a third move alongside quoting and
 * paraphrasing (that third move, and the fuller three-move treatment, belong
 * to the shipped m7ela-u10-quoting-paraphrasing-summarizing.ts at Grade 7
 * depth — this row never asks a student to compress a whole source down to
 * its main points, which is also a different skill from row 3.2's
 * "Summarizing Informational Text"); and any formal citation format or the
 * full plagiarism-avoidance apparatus of the shipped Grade 7 "Citing
 * Sources" lesson (W.7.8, m7ela-u10-citing-sources.ts) — this row credits a
 * source with a plain lead-in phrase inside a sentence ("the guide explains
 * that...", "according to..."), never a formal in-text citation or works-
 * cited format. DELIBERATELY ALLOWED, because two neighbouring rows sit
 * close: (a) every item in this lesson names where its sentence came from in
 * plain prose, which brushes against row 10.4's job of recording bibliographic
 * detail — but naming a source informally inside a sentence is not the same
 * skill as keeping a structured record of title, author and location, and
 * this lesson never asks for those three facts; (b) this lesson's items ask
 * the student to judge whether a source's words or ideas are being used
 * honestly, which brushes against row 10.2's job of judging a source — but
 * 10.2 asks whether the source itself can be trusted, while this row always
 * treats the printed source as trustworthy and asks only how it is quoted or
 * paraphrased afterward.
 *
 * NOTE FOR FUTURE AUTHORS: every source sentence in this file is original
 * prose written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * words printed inside it. Because this lesson is itself about quoting
 * accurately, every quotation mark in this file was checked against its
 * source sentence character-for-character, including capitalisation and the
 * closing period, before this file was finished; copy-paste any quoted
 * fragment from its source, never retype it. Every broken example in the
 * tutor's own prose (the concept segment and both worked examples) is
 * labeled WRONG with the CORRECT version beside it, because a tutor reads
 * these lines aloud. The only unlabeled wrong forms in this file are the MCQ
 * distractors the three try_yourself items ask the student to reject, which
 * is exactly what those items are for; each one is then named in that
 * item's hints or in the misconception check.
 *
 * CLAIM LEDGER (informational passages):
 *   Claim                                    | Where                | Kind        | Grounds
 *   Rain forms when tiny drops of water in a  | try-1 passage        | REAL-WORLD  | Standard collision-
 *   cloud bump into each other and join       |                      |             | coalescence explanation
 *   together until they are heavy enough to   |                      |             | of raindrop formation;
 *   fall to the ground                        |                      |             | long-settled, commonly
 *                                              |                      |             | taught at this grade band.
 *   Recycling one aluminum can saves enough   | try-2 passage        | REAL-WORLD  | Widely documented
 *   energy to run a television for several    |                      |             | recycling-energy-savings
 *   hours                                     |                      |             | estimate; hedged with the
 *                                              |                      |             | qualitative "several hours"
 *                                              |                      |             | rather than a specific
 *                                              |                      |             | figure, since published
 *                                              |                      |             | estimates vary by source.
 *   Camels store fat, not water, inside their | try-3 passage        | REAL-WORLD  | Long-settled camel
 *   humps, which lets them survive for long   |                      |             | anatomy and physiology;
 *   stretches without eating                  |                      |             | checked.
 *   A spider's web has sticky threads in some | worked-example-1     | REAL-WORLD  | Standard, well-documented
 *   places and threads that are not sticky in | passage              |             | orb-weaver web structure
 *   other places, and the spider can cross    |                      |             | (sticky capture threads,
 *   its own web without touching a sticky one |                      |             | non-sticky frame/radial
 *                                              |                      |             | threads).
 *   A trail sign at Cedar Ridge Park reads     | worked-example-2     | STIPULATED  | Invented park and sign.
 *   "Stay on the marked path. Off-path        | passage              |             | Internally consistent: the
 *   walking damages new plant growth."        |                      |             | sign's wording never
 *                                              |                      |             | changes anywhere it is
 *                                              |                      |             | quoted in this file.
 *   Off-path walking (trampling) damages new  | worked-example-2     | REAL-WORLD  | Well-documented park-
 *   plant growth                               | passage / paraphrase |             | management fact: foot
 *                                              |                      |             | traffic compacts soil and
 *                                              |                      |             | harms young or emerging
 *                                              |                      |             | plants.
 *   A monarch butterfly that flies all the    | concept keyIdea 3    | REAL-WORLD  | Well-documented monarch
 *   way to Mexico is not the same butterfly    |                      |             | migration biology:
 *   that eventually makes it back, because     |                      |             | completing one full annual
 *   completing the full round trip takes       |                      |             | round trip normally spans
 *   several generations                        |                      |             | several generations, not
 *                                              |                      |             | one migrating individual.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U10_QUOTING_AND_PARAPHRASING_WITHOUT_PLAGIARIZING: LessonPlan = {
  id: 'evelyn.ms.m6ela.quoting-and-paraphrasing-without-plagiarizing.v1',
  title: 'Quoting & Paraphrasing Without Plagiarizing',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.quoting-and-paraphrasing-without-plagiarizing',
      standard: 'M6ELA-10.3',
      description:
        'Quote or paraphrase a source\'s data or conclusions accurately and distinguish the two, so another person\'s words or ideas are never presented as the student\'s own (CCSS W.6.8).',
    },
  ],
  prerequisites: ['m6ela.evaluating-source-credibility'],
  followUps: ['m6ela.giving-basic-source-information'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a word swap does not turn a source sentence into the student\'s own, and preview the two honest moves.',
      script:
        'You are writing a report for social studies, and you find a sentence in a book that says exactly what you want to say. You type it into your report, then change a few words so it does not look exactly the same. Problem solved, right? Actually, no. That sentence still belongs to whoever wrote it, and swapping in a couple of words does not change whose idea it is. There are two honest ways to use somebody else\'s sentence. You can keep it exactly and show a reader it is not yours, or you can truly rebuild it into a new sentence of your own and still say where the idea came from. There is also a fast way to catch yourself doing a word swap instead of a real rewrite, and by the end of today it will be automatic.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-quote-or-paraphrase',
      kind: 'concept',
      goal: 'Define quoting and paraphrasing, kill the word-swap trap, and install the credit rule that covers both moves.',
      keyIdeas: [
        'QUOTE WHEN THE EXACT WORDS MATTER. A quote copies a source\'s words exactly, letter for letter, and sets them off in quotation marks. Use a quote when the wording is precise, striking, or when the wording itself is the point. Keep a quotation short — one sharp sentence beats a whole paragraph you did not write.',
        'PARAPHRASE WHEN YOU WANT THE IDEA IN YOUR OWN WORDS. A paraphrase takes one idea from a source and rebuilds it completely, in your own words and your own sentence structure, while the meaning stays exactly the same. Because you are rebuilding the idea rather than cutting it down, a genuine paraphrase covers about as much ground as the sentence it came from.',
        'A PARAPHRASE IS NOT A WORD SWAP. This is the trap that catches the most students. Original: "Monarch butterflies travel thousands of miles to Mexico each winter, and no single butterfly completes the entire round trip." WRONG: "Monarch butterflies journey thousands of miles to Mexico every winter, and no single butterfly finishes the whole round trip." Every part sits in the same slot, wearing a different word — that is a copy in a costume, not a paraphrase. CORRECT: "A monarch butterfly that flies all the way to Mexico is not the same butterfly that eventually makes it back, because completing the full round trip takes several generations." That version keeps the true idea and rebuilds the sentence from scratch.',
        'COPYING A SENTENCE EXACTLY IS NEVER A PARAPHRASE, EVEN WITH A SOURCE NAMED BESIDE IT. If the words are the source\'s exact words, they need quotation marks, whether or not the sentence structure looks familiar. Quotation marks are the only signal a reader has that the exact wording is not the student\'s own.',
        'QUOTING AND PARAPHRASING BOTH NEED CREDIT. Ask one question about every sentence built from a source: did I know this before I found the source? If the answer is no, name where the idea came from, whether the sentence quotes the source exactly or paraphrases it. Taking off the quotation marks does not turn a borrowed idea into the student\'s own.',
        'THE LOOK-AWAY METHOD BUILDS A REAL PARAPHRASE. Read the source sentence until you understand it. Look away from it, or cover it with your hand. Say the idea out loud in your own words. Write down what you said. Only then look back, and look back for one reason only: to check that you got the idea right, not to borrow its sentence shape.',
      ],
      vocabulary: [
        { term: 'quote', definition: 'the exact words of a source, copied letter for letter and set off in quotation marks.' },
        { term: 'paraphrase', definition: 'one idea from a source said again in new words and a new sentence structure, while the meaning stays the same.' },
        { term: 'source', definition: 'the book, article, website, or sign that an idea or a set of exact words came from.' },
        { term: 'credit', definition: 'naming where an idea or a set of words came from, whether it is quoted exactly or paraphrased.' },
        { term: 'plagiarism', definition: 'presenting another person\'s words or ideas as your own, whether by copying them exactly or by only swapping in a few different words.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-a-real-paraphrase',
      kind: 'worked_example',
      problem:
        'Paraphrase this sentence from a science guide about spiders, so the idea is rebuilt in your own words and your own sentence shape.\n\n"A spider\'s web has sticky threads in some places and threads that are not sticky in other places, so the spider can cross its own web without ever touching a sticky strand."',
      steps: [
        'Read the sentence until you understand exactly what it says: some threads in the web catch things, other threads do not, and the spider relies on that difference to move around safely.',
        'Watch what happens if you only swap in similar words and leave the sentence shape untouched. WRONG: "A spider\'s web contains sticky strands in certain spots and strands that are not sticky in other spots, so the spider is able to move across its own web without ever contacting a sticky strand." Every part sits in the same slot it started in, wearing a different word. That is a copy in a costume, not a paraphrase, even though not one word matches the original exactly.',
        'Instead, look away from the source and say the idea out loud in your own words: some threads catch things, other threads do not, and the spider keeps track of which is which.',
        'Write down what you said, and let it take its own shape. CORRECT: "Not every thread in a spider\'s web is sticky, and the spider keeps track of which threads are which, so it can walk across its own web without getting stuck."',
        'Look back at the source only to check accuracy. Does the source say some threads are sticky and some are not? Yes. Does it say the spider avoids the sticky ones? Yes. Nothing was added, and nothing true was left out.',
        'Check the length. The rebuilt sentence covers the same ground as the original, at roughly the same length. A paraphrase does not shrink a sentence down to a few main points — that is a different move, and this lesson does not teach it.',
        'Credit the guide. The fact about sticky and non-sticky threads came from the science guide, not from the student\'s own head, so the science guide gets named wherever this sentence is used.',
      ],
      answer:
        'According to the science guide, not every thread in a spider\'s web is sticky, and the spider keeps track of which threads are which, so it can walk across its own web without getting stuck.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pick-the-move-and-credit-it',
      kind: 'worked_example',
      problem:
        'You are writing a report about park rules, and a trail sign at Cedar Ridge Park says this.\n\n"Stay on the marked path. Off-path walking damages new plant growth."\n\nYou want your reader to hear the sign\'s exact warning. Decide which move fits, write the sentence, and credit the sign.',
      steps: [
        'Ask what the reader needs. Not the general idea that people should stay on the path — the blunt, exact way the sign puts it. When the wording itself is the point, that calls for a quote, not a paraphrase.',
        'Copy the words exactly, letter for letter, and set them off in quotation marks so a reader can see they are not yours. WRONG: writing the sign\'s exact sentence into the report with no quotation marks at all: Stay on the marked path. Off-path walking damages new plant growth. Printed that way, a reader has no way to know those are the sign\'s words and not the student\'s own.',
        'Add a lead-in that names where the words came from. CORRECT: A trail sign at Cedar Ridge Park warns, "Stay on the marked path. Off-path walking damages new plant growth."',
        'Now suppose the report only needs the general idea, not the sign\'s exact wording. Then the move changes to a paraphrase, and the sentence has to be rebuilt, not word-swapped. WRONG paraphrase: "Remain on the marked trail, because walking off the trail harms fresh plant growth." That keeps the sign\'s exact sentence order and only trades in similar words. CORRECT paraphrase: "The park asks visitors to keep off the surrounding ground, since foot traffic there can hurt young plants before they get established."',
        'Either way, exact quote or rebuilt paraphrase, the sign gets credited. Losing the quotation marks does not make the sign\'s warning the student\'s own idea, and neither does swapping in a few synonyms.',
      ],
      answer:
        'Quote: A trail sign at Cedar Ridge Park warns, "Stay on the marked path. Off-path walking damages new plant growth." Paraphrase: The park asks visitors to keep off the surrounding ground, since foot traffic there can hurt young plants before they get established. Both credit the sign as the source.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-fair-paraphrase',
      kind: 'try_yourself',
      problem:
        'You are writing a report on how rain forms, and you find this sentence in a weather guide for kids. Which choice is a fair paraphrase of it — the idea rebuilt in new words and a new sentence shape, not a copy with a few words swapped?\n\n"Rain forms when tiny drops of water inside a cloud bump into each other and join together until they are heavy enough to fall to the ground."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Rain develops when small droplets of water within a cloud collide with each other and combine until they are weighty enough to drop to the ground.' },
        { id: 'b', text: 'Inside a cloud, tiny drops of water keep colliding and sticking together, and once they get too heavy to stay up, rain begins to fall.', correct: true },
        { id: 'c', text: 'Rain forms when tiny drops of water inside a cloud bump into each other and join together until they are heavy enough to fall to the ground.' },
        { id: 'd', text: 'Rain forms when a cloud becomes so heavy with water that it suddenly bursts open and empties out all at once.' },
      ],
      expectedAnswer: 'Inside a cloud, tiny drops of water keep colliding and sticking together, and once they get too heavy to stay up, rain begins to fall.',
      hints: [
        'Line up each choice against the source phrase by phrase. One choice keeps the exact same sentence shape and just swaps in similar words — that is not a paraphrase, no matter how different the words look.',
        'Rule out the choice that copies the source exactly, and the choice that changes what actually happens in the sky. The paraphrase you want says the same true thing in a new sentence shape.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-quote-and-credit',
      kind: 'try_yourself',
      problem:
        'Your source is a class recycling guide. Which sentence correctly quotes the source inside a sentence of your own report?\n\n"Recycling one aluminum can saves enough energy to run a television for several hours."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Recycling one aluminum can "saves enough energy to run a television for several hours."' },
        { id: 'b', text: 'Recycling one aluminum can saves enough energy to run a television for several hours.' },
        { id: 'c', text: 'The recycling guide explains that recycling one aluminum can "saves enough energy to run a television for several hours."', correct: true },
        { id: 'd', text: 'According to the recycling guide, recycling one aluminum can saves enough energy to run a television for several hours.' },
      ],
      expectedAnswer: 'The recycling guide explains that recycling one aluminum can "saves enough energy to run a television for several hours."',
      hints: [
        'Ask two questions about each choice: does it show the exact words inside quotation marks, and does it say where those words came from?',
        'Rule out any choice that copies the guide\'s exact sentence without quotation marks, even if it names the guide, and any choice that shows the exact words in quotation marks but never says whose words they are.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-quote-paraphrase-or-plagiarism',
      kind: 'try_yourself',
      problem:
        'You are writing a report on desert animals, and an animal guide gives you this sentence. Which choice below correctly uses the source, either by quoting it exactly or by paraphrasing it, without presenting the source\'s words or ideas as your own?\n\n"Camels store fat, not water, inside their humps, which lets them survive for long stretches without eating."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Camels store fat, not water, inside their humps, which lets them survive for long stretches without eating.' },
        { id: 'b', text: 'Camels keep fat, not water, in their humps, which helps them go for long periods without eating.' },
        { id: 'c', text: 'The animal guide explains that a camel\'s hump works like a built-in canteen — it stores water, not fat, and that stored water is what lets the animal go without drinking for weeks.' },
        { id: 'd', text: 'The animal guide explains that a camel\'s hump is not a water tank at all — it holds fat, and that stored fat is what lets the animal go without eating for a long time.', correct: true },
      ],
      expectedAnswer: 'The animal guide explains that a camel\'s hump is not a water tank at all — it holds fat, and that stored fat is what lets the animal go without eating for a long time.',
      hints: [
        'Two of these choices just repeat the source\'s own sentence, one with the exact words and one with a few words swapped in the same order — both count as copying, credited or not.',
        'Of the two that are genuinely rewritten, check which one keeps the source\'s actual claim about which substance fills a camel\'s hump. Only one choice gets that right and also says where the idea came from.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-any-change-counts',
      kind: 'misconception_check',
      question:
        'A student is paraphrasing this sentence from a source: "Elephants use their trunks to suck up water and then spray it into their mouths to drink." The student turns in this sentence: "Elephants use their trunks to draw up water and then spray it into their mouths to drink," and says, "It is not word-for-word the same, so it counts as my own words." What has gone wrong?',
      commonErrors: [
        {
          answer: 'Elephants use their trunks to draw up water and then spray it into their mouths to drink.',
          misconception:
            'Believing that changing even one word is enough to make a sentence the student\'s own. The sentence keeps the source\'s exact order and almost every other word, so it is still the source\'s sentence wearing a disguise.',
          correctsTo:
            'A paraphrase has to change the sentence structure, not just a word or two inside the same structure. Cover the source and say the idea a new way: "An elephant fills its trunk with water, then curls the trunk toward its mouth to drink." The order of ideas moved, the sentence shape moved, and the meaning stayed exactly the same. That is what makes it a paraphrase instead of a copy with a costume on.',
        },
        {
          answer: 'As long as I say which book or website an idea came from, I can use its exact sentence without quotation marks.',
          misconception:
            'Treating credit as a stand-in for quotation marks, so naming the source feels like it covers the borrowed wording too.',
          correctsTo:
            'Naming the source says where an idea came from. It does not give permission to keep the source\'s exact sentence. If the exact words matter, copy them exactly and put quotation marks around them, and still name the source. If the exact words do not matter, cover the source and rebuild the idea in a new sentence, and still name the source. Either way the source gets credited, and either way its exact sentence never appears without quotation marks around it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A quote copies the source\'s exact words, letter for letter, and sets them off in quotation marks. Use it when the exact wording matters.',
        'A paraphrase changes the words AND the sentence structure, and keeps the same meaning at about the same length. WRONG: swapping in a few synonyms and leaving the sentence shape untouched. CORRECT: rebuilding the idea from scratch, the way the look-away method does.',
        'Copying a sentence exactly, even with a source named beside it, is not a paraphrase. Quotation marks are what tell a reader the exact words are not the student\'s own.',
        'Both a quote and a paraphrase need credit. Ask: did I know this before I found the source? If not, say where it came from.',
        'Presenting another person\'s exact words or rebuilt idea as your own, with no quotation marks and no credit, is plagiarism, even if only a couple of words were changed.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'Quoting & Paraphrasing Without Plagiarizing' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
