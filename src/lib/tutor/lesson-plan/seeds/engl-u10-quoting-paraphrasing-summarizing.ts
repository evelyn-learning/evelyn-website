/**
 * HS English — Research & Inquiry: Quoting, Paraphrasing & Summarizing.
 *
 * The three ways a writer puts someone else's material into their own
 * paper (CCSS W.9-10.8), when each move is the right one, and the
 * patchwriting trap — a synonym-swapped near-copy that stays plagiarism
 * even with a citation attached. Every practice item is an MCQ.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U10_QUOTING_PARAPHRASING_SUMMARIZING: LessonPlan = {
  id: 'evelyn.hs.engl.quoting-paraphrasing-summarizing.v1',
  title: 'Quoting, Paraphrasing & Summarizing',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.quoting-paraphrasing-summarizing',
      standard: 'ENGL-10.3',
      description:
        'Choose deliberately among quoting a source (its exact words for an exact reason), paraphrasing it (a full rewrite in new structure at about the same length), and summarizing it (the main points condensed), and recognize patchwriting — a paraphrase that stays too close to the original wording or sentence shape — as plagiarism even when a citation is attached (CCSS W.9-10.8).',
    },
  ],
  prerequisites: ['engl.evaluating-sources'],
  followUps: ['engl.citing-and-integrating-sources'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the three moves as choices people already make when they retell what someone else said — and show that the choice carries meaning.',
      script:
        'A friend tells you a long, complicated story about what happened at work. Later you retell it to someone else, and you make three kinds of choices without thinking about it. Sometimes you say "she literally said, I quit, right there in the hallway" — because the exact words are the whole point. Sometimes you retell one part fully in your own way. And sometimes you flatten forty minutes into one sentence: "she quit and it got messy." A coach reading a scouting report does the same thing before a game. Writers do it on purpose, and there are names for the three moves: quoting, paraphrasing, summarizing. Today you learn when each one wins, and the one very common mistake that turns a paraphrase into plagiarism.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-moves',
      kind: 'concept',
      goal: 'The three moves, the situation each one is built for, the patchwriting trap, and the close-the-book method.',
      keyIdeas: [
        'THE THREE MOVES — QUOTE reproduces the source word for word inside quotation marks. PARAPHRASE restates one specific passage completely in your own words and your own sentence structure, running about the same length as the original. SUMMARIZE compresses a large stretch of source material down to its main points, so it is always much shorter than what it covers.',
        'WHEN QUOTING WINS — quote when the WORDING ITSELF is the evidence: a phrase so precise or so strange that rewording it would destroy the point, a definition you intend to argue with, or a line whose exact tone matters. If you cannot say why those particular words are necessary, you do not need the quotation marks.',
        'WHEN PARAPHRASING WINS — paraphrase when the IDEA matters and the wording does not. This is the default move in most research writing, because it proves you understood the source well enough to rebuild it, and it keeps your own voice running through the paragraph.',
        'WHEN SUMMARIZING WINS — summarize when you need the shape of a whole report, chapter, or study rather than one passage: background your reader needs before your argument starts, or a fair account of a position you plan to answer. A summary reports the main points only and leaves the details behind.',
        'THE PATCHWRITING TRAP — swapping in synonyms while keeping the source\'s sentence structure is NOT a paraphrase. It is patchwriting, and it counts as plagiarism. If your sentence marches through the original word order with a thesaurus laid over the top, you have copied the sentence and only redecorated it.',
        'THE CLOSE-THE-BOOK METHOD — read the passage until you can state its point out loud, then cover the source and write your version from memory. Only after your sentence exists do you look back, and only to check accuracy — never to borrow phrasing. Starting from the source sentence and editing it downward is how patchwriting happens.',
        'ALL THREE MOVES NEED A CITATION — quoting, paraphrasing, and summarizing all use someone else\'s material, so all three get credited. Losing the quotation marks does not make the idea yours. The only thing that never needs a citation is common knowledge and your own thinking.',
        'QUOTE SPARINGLY — a paper stitched together from quotations is a quote collage, not an argument. Your sentences should carry the reasoning, with quotations dropped in where the exact words earn their place.',
      ],
      vocabulary: [
        { term: 'paraphrase', definition: 'a complete restatement of one passage in your own words AND your own sentence structure, at roughly the original length.' },
        { term: 'patchwriting', definition: 'a near-copy that replaces some words with synonyms but keeps the source\'s sentence structure — a form of plagiarism, citation or not.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-close-the-book',
      kind: 'worked_example',
      problem:
        'Paraphrase this passage from a county wildlife bulletin for a research paper: "Beaver dams slow the spring melt before it reaches the lower valley, holding water on the land for weeks longer than an undammed stream would. Ranchers downstream who once treated the animals as pests now credit them with keeping the summer pasture green."',
      steps: [
        'Decide the move first. The wording here is plain — nothing about it is memorable or arguable. The IDEA is what you need, so this is a paraphrase, not a quotation.',
        'Read until you can say the point out loud without looking: beaver dams hold back the melt, the water stays around longer, and that changed how ranchers feel about beavers.',
        'Now close the book. Cover the passage and write your version from memory, in your own sentence shape. Notice that this is where a different structure comes from — you are building from the idea, not editing the original.',
        'Write it: "Where beavers build, the runoff from melting snow does not rush straight through to the valley floor; it sits on the land for an extra few weeks. That extra water keeps summer pasture alive, which is why some ranchers who used to want the beavers gone now want them to stay."',
        'Check accuracy against the source, then check length: two sentences for two, roughly the same size. A paraphrase does not shrink the passage — that would be a summary.',
        'Add the citation. A paraphrase is still the bulletin\'s finding, so it gets credited exactly like a quotation would.',
      ],
      answer:
        'A full rewrite built from memory: "Where beavers build, the runoff from melting snow does not rush straight through to the valley floor; it sits on the land for an extra few weeks. That extra water keeps summer pasture alive, which is why some ranchers who used to want the beavers gone now want them to stay." — cited to the bulletin.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-patchwriting-trap',
      kind: 'worked_example',
      problem:
        'A student is working from this line in a city report: "The new bus lanes cut average downtown travel times by nine minutes, but ridership rose only slightly in the first year." The student writes: "The fresh bus lanes reduced typical downtown trip times by nine minutes, however ridership increased only a little in the first year (City Report)." The citation is there. Is this an acceptable paraphrase?',
      steps: [
        'Line the two sentences up and compare them piece by piece rather than reading for overall feel. That comparison is what exposes patchwriting.',
        'Source: "The new bus lanes" / "cut" / "average downtown travel times" / "by nine minutes" / "but ridership rose only slightly" / "in the first year."',
        'Student: "The fresh bus lanes" / "reduced" / "typical downtown trip times" / "by nine minutes" / "however ridership increased only a little" / "in the first year."',
        'Every slot matches in the same order. New for old, cut for reduced, average for typical, rose for increased — the student changed the vocabulary and left the sentence skeleton untouched. That is patchwriting, and it is plagiarism.',
        'The citation does not rescue it. A citation says where an idea came from; it does not give permission to reuse someone else\'s sentence structure. Either quote the line exactly with quotation marks, or genuinely rewrite it.',
        'Fix it with the close-the-book method. Cover the source, state the point from memory, and let the new sentence find its own shape: "Downtown trips got about nine minutes faster once the bus lanes opened. The riders, though, did not follow — year-one ridership barely moved (City Report)." Two ideas, reordered, in the student\'s own construction.',
      ],
      answer:
        'No — it is patchwriting. The synonyms are swapped in but the source\'s sentence structure is copied intact, and a citation does not make that acceptable. Rewrite it from memory, for example: "Downtown trips got about nine minutes faster once the bus lanes opened. The riders, though, did not follow — year-one ridership barely moved (City Report)."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-move',
      kind: 'try_yourself',
      problem:
        'You are writing a paper arguing that a town\'s recycling program was oversold. A town council member said, in a public meeting, "This program will pay for itself by the second year, guaranteed." You want your reader to feel exactly how confident that promise was before you show what actually happened. Which move fits?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Quote it — the exact wording, especially "guaranteed," is the evidence your argument depends on.', correct: true },
        { id: 'b', text: 'Paraphrase it, because paraphrasing is always the safer choice in research writing.' },
        { id: 'c', text: 'Summarize the whole council meeting so the reader gets the full background.' },
        { id: 'd', text: 'Use the line without a citation, since it was said out loud in public rather than published.' },
      ],
      expectedAnswer:
        'Quote it — the exact wording, especially "guaranteed," is the evidence your argument depends on.',
      hints: [
        'Ask what you actually need the reader to notice: the general idea of the promise, or the confidence in the specific words the speaker chose?',
        'When the wording itself is the evidence, rewording it destroys the point — that is the situation quoting is built for.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-patchwriting',
      kind: 'try_yourself',
      problem:
        'Original, from a wildlife bulletin: "Volunteers counted 412 nesting pairs along the eastern shoreline this spring, the highest total since the survey began in 1998." Which of the following is patchwriting rather than an acceptable paraphrase?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Volunteers tallied 412 nesting pairs along the eastern coastline this spring, the largest number since the survey started in 1998.', correct: true },
        { id: 'b', text: 'This spring\'s volunteer count found 412 nesting pairs on the eastern shoreline — more than any year since the survey\'s first season in 1998.' },
        { id: 'c', text: 'No spring since the survey opened in 1998 has produced a bigger result than this year\'s: volunteers recorded 412 nesting pairs on the eastern shoreline.' },
        { id: 'd', text: 'The eastern shoreline held 412 nesting pairs when volunteers counted this spring, a record across the survey\'s history going back to 1998.' },
      ],
      expectedAnswer:
        'Volunteers tallied 412 nesting pairs along the eastern coastline this spring, the largest number since the survey started in 1998.',
      hints: [
        'Do not read for whether it sounds different. Line each option up against the original slot by slot and watch the word order.',
        'One option marches through the original in exactly the same order with synonyms dropped in: counted becomes tallied, shoreline becomes coastline, highest becomes largest, began becomes started.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-accurate-summary',
      kind: 'try_yourself',
      problem:
        'A city report states: "The downtown library extended its weekend hours in March. Visits on Saturdays and Sundays rose 22 percent over the following six months, and staff reported that the largest increase came from students using the study rooms." Which is the best SUMMARY of this passage?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Longer weekend hours at the downtown library brought a sharp rise in weekend visits, driven mainly by students.', correct: true },
        { id: 'b', text: 'The downtown library extended its weekend hours in March, and over the following six months Saturday and Sunday visits rose 22 percent, with staff reporting that the largest increase came from students who were using the study rooms during those newly added weekend hours.' },
        { id: 'c', text: 'Students prefer studying at the library on weekends rather than at home, so the city should extend weekend hours at every branch.' },
        { id: 'd', text: 'The downtown library changed its hours in March, and afterward some people noticed a difference in how busy the building was.' },
      ],
      expectedAnswer:
        'Longer weekend hours at the downtown library brought a sharp rise in weekend visits, driven mainly by students.',
      hints: [
        'A summary is much shorter than the passage and reports only the main points — check the length of each option first.',
        'Rule out the one that is nearly as long as the original, the one that adds a claim the passage never makes, and the one so vague that it drops the actual finding.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-citation-launders',
      kind: 'misconception_check',
      question:
        'A student turns in a paragraph that follows a source sentence word position by word position, with synonyms substituted, and defends it: "I put the citation right there at the end, so I gave them credit. It is not plagiarism if you cite it." What went wrong?',
      commonErrors: [
        {
          answer: 'A citation makes any level of closeness to the source acceptable',
          misconception:
            'Believing a citation covers borrowed WORDING, when it only credits the borrowed IDEA.',
          correctsTo:
            'A citation answers "whose idea is this?" — it does not license reusing someone else\'s sentence structure. Borrowed wording needs quotation marks; a paraphrase must be genuinely rebuilt in new structure from memory. A cited patchwrite is still plagiarism, because the reader is being shown a sentence the student did not actually write.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Quote when the exact words are the evidence; paraphrase when the idea matters and the wording does not; summarize when you need the main points of something large.',
        'A real paraphrase changes the words AND the sentence structure, and stays about the same length as the original.',
        'Patchwriting — the source\'s sentence shape with synonyms dropped in — is plagiarism, and a citation does not fix it.',
        'Close the book: state the point from memory, write your sentence, then look back only to check accuracy.',
        'All three moves get a citation, and quotations stay rare — your sentences should carry the argument.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'Quoting, Paraphrasing & Summarizing' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
