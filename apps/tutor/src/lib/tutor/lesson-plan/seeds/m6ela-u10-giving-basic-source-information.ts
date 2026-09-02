/**
 * Grade 6 ELA — Research & Citation: Giving Basic Source Information.
 *
 * PROCEDURE-LED. This is the last row of Unit 10 and of the whole 40-row
 * m6ela course. There is one repeatable move: check a source note against
 * three required pieces — WHO made it, WHAT it is called, WHERE it can be
 * found — and fix whichever piece is missing, mislabeled, or swapped for
 * something else (a topic standing in for a title, or a quoted person
 * standing in for a maker). Both worked examples run that same three-piece
 * check across two different kinds of source, so the pattern generalizes
 * rather than living inside one example.
 *
 * SCOPE GUARD: Grade 6 row 10.4 teaches only the RECORDING of a source's
 * three basic identifying pieces — who made it, what it is called, and
 * where it was found — once a source has already been chosen and used.
 * DELIBERATELY EXCLUDED: whether a source is trustworthy enough to use in
 * the first place (row 10.2, evaluating-source-credibility); the mechanics
 * of quoting a source's exact words versus paraphrasing them, and the
 * plagiarism-avoidance habits that go with each (row 10.3,
 * quoting-and-paraphrasing-without-plagiarizing, this row's stated
 * prerequisite); and the formal citation apparatus — comma-and-period
 * placement, a separate in-text-credit convention distinct from a
 * works-cited entry, a required publication date, and the full
 * plagiarism-avoidance procedure — that the shipped Grade 7 course teaches
 * under the same W.7.8 code family in `m7ela-u10-citing-sources.ts` (see
 * the curriculum's Excluded list). This lesson never asks the student to
 * arrange the three pieces into one punctuated order; a labeled WHO/WHAT/
 * WHERE record is treated as complete on its own. DELIBERATELY ALLOWED,
 * because the two rows sit close: this lesson's second worked example and
 * third try_yourself item distinguish the person or group who MADE a
 * source from a person merely QUOTED or featured inside it. That
 * distinction is necessary to get WHO right at all — a student cannot
 * record who made a video without separating its maker from its on-camera
 * guest — and it is not the same skill as this course's earlier lessons on
 * judging a source's credibility or handling its quoted material.
 *
 * NOTE FOR FUTURE AUTHORS: every source, article, video, channel, and
 * person named in this file is invented for this lesson. This course
 * carries no passage machinery — no passageId, no shared texts — so every
 * item must be solvable from the words printed inside it alone. Every
 * quoted title inside a later segment matches, character for character,
 * the title as first introduced. No contraction appears in the tutor's own
 * voice anywhere in this file; the only apostrophes are possessives
 * ("Bright Sprout Science's channel," "the video's own name") and one
 * standard-spelling word ("cannot"), never a contracted verb.
 *
 * CLAIM LEDGER (informational passages) — covers the whole file, including
 * distractors and the misconception corrections. Every distractor in this
 * file is wrong about the RECORD-KEEPING SKILL (a missing piece, a topic
 * standing in for a title, a scope the lesson never taught), never about a
 * fact of the world, so none needed its own ledger row beyond the invented
 * entities listed below, which distractors only reuse, never extend:
 *   Claim                                  | Where               | Kind        | Grounds
 *   Many frogs stay still and barely move  | worked example 2    | REAL-WORLD  | Long-settled amphibian
 *   through the coldest months             | problem; try 3      |             | biology — frogs are
 *                                           | problem              |             | ectotherms that go
 *                                           |                      |             | dormant in cold weather.
 *                                           |                      |             | Hedged with "many," not
 *                                           |                      |             | asserted of every frog.
 *   Coop Corner published an article by    | worked example 1     | STIPULATED  | Invented for this item.
 *   Priya Anand titled "Picking the Right  |                      |             | Internally consistent:
 *   Chicken Breed for Your Yard"           |                      |             | used only within that
 *                                           |                      |             | one worked example.
 *   City Life Monthly published an article | try 1; try 2         | STIPULATED  | Invented for these
 *   by Renata Cole titled "How Skate Parks |                      |             | items. Internally
 *   Get Built"                             |                      |             | consistent: the title
 *                                           |                      |             | and magazine name match
 *                                           |                      |             | across both items; try 1
 *                                           |                      |             | never reveals the author
 *                                           |                      |             | name, so nothing there
 *                                           |                      |             | contradicts try 2.
 *   Bright Sprout Science posted a video   | worked example 2;    | STIPULATED  | Invented for these
 *   titled "Why Do Frogs Disappear in      | try 3                |             | items. Internally
 *   Winter?" featuring Dr. Elena Vance     |                      |             | consistent: the channel
 *                                           |                      |             | name, video title, and
 *                                           |                      |             | guest's role match
 *                                           |                      |             | across both segments.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U10_GIVING_BASIC_SOURCE_INFORMATION: LessonPlan = {
  id: 'evelyn.ms.m6ela.giving-basic-source-information.v1',
  title: 'Giving Basic Source Information',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.giving-basic-source-information',
      standard: 'M6ELA-10.4',
      description:
        'Record the basic bibliographic information for a source used in research — who made it, what it is called, and where it was found — as a labeled three-piece record that lets the source be located again (CCSS W.6.8).',
    },
  ],
  prerequisites: ['m6ela.quoting-and-paraphrasing-without-plagiarizing'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the cost of an incomplete source record personal and immediate, before the lesson names the fix.',
      script:
        'Last month you found the best video for folding a paper airplane that flies clear across the room. You watched it twice, put your phone away, and two weeks later you cannot find it again. You do not remember the name of the channel, you do not remember the exact title, and typing "that airplane video" into a search bar gets you nothing useful. All the information you needed was sitting right there on the screen the whole time, and none of it got written down. Today is about a small habit that fixes this for good: three pieces of information, written down the moment you use a source, so it never disappears on you again.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-the-three-basic-pieces',
      kind: 'concept',
      goal: 'Install the three-piece source record, the topic-versus-title mix-up, and the maker-versus-quoted-person mix-up as one repeatable check.',
      keyIdeas: [
        'A SOURCE IS ANYWHERE INFORMATION COMES FROM — a website, a book, a magazine, or a video. Whenever a source gets quoted, paraphrased, or just used for a fact, a short record of it gets kept so it can be found again later.',
        'A COMPLETE BASIC SOURCE RECORD HAS THREE PIECES. WHO made it — the person or group responsible for it, such as a writer, a magazine\'s staff, or the channel that posted a video. WHAT it is called — the exact title, printed on the source itself. WHERE it can be found — the name of the place holding it, such as a website, a magazine, a book, or a channel, clear enough that someone else could go find it there.',
        'THE TOPIC IS NOT THE TITLE. Writing what a source is about, such as "the chicken article" or "the frog video," is not the same as writing what it is actually called. The real title sits printed on the source itself, and that exact wording is what belongs in the record.',
        'THE PERSON WHO MADE A SOURCE IS NOT ALWAYS THE PERSON QUOTED INSIDE IT. A magazine article can quote someone the writer interviewed. A video can feature a guest speaking on camera. The maker of the source — the writer, the magazine, or the channel — goes in the WHO spot, not a person the source merely quotes or features.',
        'WRITE THE RECORD DOWN THE MOMENT A SOURCE GETS USED. Waiting until later means trying to remember an exact title or an author\'s name from memory, and those details fade fast. Three short labeled lines take a few seconds and save the trouble entirely.',
        'THIS IS A RECORD, NOT YET A FORMATTED CITATION. Arranging these three pieces into one exact order with specific punctuation is a later skill. For now the job is only to capture WHO, WHAT, and WHERE accurately, in any clear layout, such as three labeled lines.',
      ],
      vocabulary: [
        { term: 'source', definition: 'a place information comes from, such as a website, a book, a magazine, or a video.' },
        { term: 'author', definition: 'the person or group who made a source, such as a writer, a magazine\'s staff, or the channel that posted a video.' },
        { term: 'title', definition: 'the exact name of a source, printed on the source itself.' },
        { term: 'source record', definition: 'a short note that saves the who, what, and where of a source together, so it can be found again.' },
        { term: 'quoted', definition: 'featured or interviewed inside a source, without being the person or group who made it.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-fix-a-website-note',
      kind: 'worked_example',
      problem:
        'A student is taking notes for something she is writing about backyard chickens. She found a website called Coop Corner with an article by Priya Anand titled "Picking the Right Chicken Breed for Your Yard." Her note so far says only this: "chickens - coopcorner.example". Fix her note into a complete basic source record.',
      steps: [
        'Check the note against the three pieces one at a time, starting with WHERE. It already has coopcorner.example, which is enough to point back to the website, so WHERE is in decent shape.',
        'Check WHO. No name appears anywhere in the note. Go back to the page and look for a byline — it reads "By Priya Anand." Add that name to the record.',
        'Check WHAT. The note says "chickens," which is the topic the article covers, not its title. Look at the top of the page for the exact words printed there: "Picking the Right Chicken Breed for Your Yard." That exact wording replaces "chickens" in the record.',
        'Write the three pieces as three labeled lines instead of one running phrase, so nothing gets lost again: WHO: Priya Anand. WHAT: "Picking the Right Chicken Breed for Your Yard." WHERE: Coop Corner, coopcorner.example.',
        'Read the finished record back and confirm all three pieces are there and none of them is standing in for another: a name in the WHO spot, an exact title in the WHAT spot, and a place in the WHERE spot.',
      ],
      answer:
        'WHO: Priya Anand. WHAT: "Picking the Right Chicken Breed for Your Yard." WHERE: Coop Corner, coopcorner.example. The original note had part of WHERE but was missing WHO entirely, and had the topic, "chickens," sitting in the WHAT spot instead of the real title.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fix-a-video-note',
      kind: 'worked_example',
      problem:
        'A student watches a video called "Why Do Frogs Disappear in Winter?", posted by a channel called Bright Sprout Science. In the video, a guest scientist named Dr. Elena Vance explains that many frogs stay still and barely move through the coldest months. The student\'s note reads: AUTHOR: Dr. Elena Vance. TITLE: the frog video. FOUND: Bright Sprout Science\'s channel. Fix whatever is wrong with this record.',
      steps: [
        'Check WHERE first. "Bright Sprout Science\'s channel" names the place holding the video clearly enough for someone else to go find it there, so WHERE is fine as written.',
        'Check WHAT. "The frog video" describes what the video is about, not what it is called. The exact title printed under the video is "Why Do Frogs Disappear in Winter?" That exact wording replaces the description.',
        'Check WHO, and read it carefully this time. The note lists Dr. Elena Vance as the author. But Dr. Elena Vance is a guest who appears and speaks inside the video — she is quoted in it. She did not make it or post it. The channel Bright Sprout Science did both of those things, so Bright Sprout Science belongs in the WHO spot.',
        'Rewrite the fixed record: WHO: Bright Sprout Science. WHAT: "Why Do Frogs Disappear in Winter?" WHERE: Bright Sprout Science\'s channel. Dr. Elena Vance can still be mentioned as the scientist quoted in the video, but that detail is separate from who made the source.',
        'Notice the pattern across both worked examples: WHERE is often the piece already sitting in a note, WHAT gets swapped for a topic, and WHO gets swapped for whoever\'s name is easiest to remember, whether or not that person made the source.',
      ],
      answer:
        'WHO: Bright Sprout Science. WHAT: "Why Do Frogs Disappear in Winter?" WHERE: Bright Sprout Science\'s channel. The title was written as a description instead of the exact words printed under the video, and the author was written as the scientist quoted inside the video instead of the channel that made and posted it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-missing-piece-magazine-note',
      kind: 'try_yourself',
      problem:
        'A student is taking notes on a magazine article about how skate parks get built. Her note so far reads: TITLE: "How Skate Parks Get Built." AUTHOR: (nothing written down). FOUND IN: City Life Monthly magazine. Which piece of the basic source record is still missing from this note?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Where it was found, because the note names the magazine but never gives the exact page or issue number for the article.' },
        { id: 'b', text: 'The title, because "How Skate Parks Get Built" only describes what the note says the article covers, not the exact words printed at the top of the page.' },
        { id: 'c', text: 'The author, because the note never records who wrote the article — no name appears anywhere in it.', correct: true },
        { id: 'd', text: 'The date the article was published, because a complete source record always needs to say exactly when a source came out.' },
      ],
      expectedAnswer: 'The author, because the note never records who wrote the article — no name appears anywhere in it.',
      hints: [
        'Go through the three basic pieces one at a time — who made it, what it is called, and where it was found — and check the note against each one.',
        'Two of the three pieces are already sitting in the note, filled in correctly. Find the one piece the note itself admits is blank, and set aside anything this lesson never asked for in the first place.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-complete-record-four-notes',
      kind: 'try_yourself',
      problem:
        'Four students each took a note about the same magazine article, "How Skate Parks Get Built" by Renata Cole, printed in City Life Monthly. Which note is a complete basic source record, with all three pieces present and nothing mixed up?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'AUTHOR: skate parks. TITLE: "How Skate Parks Get Built." FOUND: City Life Monthly.' },
        { id: 'b', text: 'AUTHOR: Renata Cole. TITLE: an article about how skate parks get built. FOUND: City Life Monthly.' },
        { id: 'c', text: 'AUTHOR: Renata Cole. TITLE: "How Skate Parks Get Built." FOUND: nothing written down for where the article was found.' },
        { id: 'd', text: 'AUTHOR: Renata Cole. TITLE: "How Skate Parks Get Built." FOUND: City Life Monthly.', correct: true },
      ],
      expectedAnswer: 'AUTHOR: Renata Cole. TITLE: "How Skate Parks Get Built." FOUND: City Life Monthly.',
      hints: [
        'Check each note against all three pieces separately — who, what, and where — instead of judging the whole note at a glance.',
        'Three of these four notes get exactly one piece wrong: a topic sitting where a name belongs, a description sitting where the exact title belongs, or a blank sitting where a place belongs.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-author-vs-quoted-person',
      kind: 'try_yourself',
      problem:
        'A student takes notes on a video called "Why Do Frogs Disappear in Winter?", posted by a channel called Bright Sprout Science. In the video, a guest scientist named Dr. Elena Vance explains that many frogs stay still and barely move through the coldest months. The student\'s note reads: AUTHOR: Dr. Elena Vance. TITLE: "Why Do Frogs Disappear in Winter?" FOUND: Bright Sprout Science\'s channel. What is wrong with this note?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The author field names the scientist who is quoted inside the video, not the channel that actually made and posted it.', correct: true },
        { id: 'b', text: 'The title is missing, because the note only copied the exact words from the video\'s own name instead of describing what the video is about.' },
        { id: 'c', text: 'Nothing is wrong. All three pieces are filled in, so the note is already a complete source record.' },
        { id: 'd', text: 'The location is incomplete, because "Bright Sprout Science\'s channel" does not give an exact web address for the video.' },
      ],
      expectedAnswer: 'The author field names the scientist who is quoted inside the video, not the channel that actually made and posted it.',
      hints: [
        'Ask who actually made and posted this video, separately from who appears and speaks inside it. Those can be two different people or groups.',
        'Bright Sprout Science produced and uploaded the video. Dr. Elena Vance is featured in it, explaining something on camera, but appearing in a video is not the same job as making it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-topic-as-title-and-quoted-as-author',
      kind: 'misconception_check',
      question:
        'A student defends two notes this way: "I wrote \'the frog video\' because that is basically what it is called," and "I wrote Dr. Elena Vance as the author because she is the one who actually explains everything." What has gone wrong with each?',
      commonErrors: [
        {
          answer: 'Writing what a source is about, such as "the frog video" or "the chicken article," in the title spot.',
          misconception:
            'Treating the title as a summary of the topic instead of the exact name printed on the source. A description can feel close enough, especially when it is accurate, but it is not the wording a reader would need in order to search for and find the source again.',
          correctsTo:
            'The title is the exact wording printed on the source itself, not a summary of what the source covers. "The frog video" describes a topic that many different videos could share; "Why Do Frogs Disappear in Winter?" identifies exactly one video. Copy the title as printed, word for word.',
        },
        {
          answer: 'Writing the name of a person quoted or featured inside a source as the author, because that person\'s name is the one most easily remembered.',
          misconception:
            'Confusing who is speaking inside a source with who made and posted the source. A guest, an interviewee, or someone quoted in an article did not necessarily write, film, or publish it.',
          correctsTo:
            'The author is whoever made the source — the writer of an article, or the channel that produced and posted a video — even when someone else is quoted or featured inside it. Bright Sprout Science made and posted the frog video; Dr. Elena Vance is the scientist it features. Both facts can be true, and only the first one belongs in the WHO spot.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A complete basic source record has three pieces: WHO made it, WHAT it is called, and WHERE it can be found.',
        'WHO is the person or group who made the source — a writer, a magazine, or the channel that posted a video — not necessarily anyone the source quotes or features.',
        'WHAT is the exact title printed on the source itself, not a summary of its topic.',
        'WHERE is the name of the place holding the source, clear enough that someone else could go find it there.',
        'Write the record down the moment a source gets used. Waiting means trying to remember details that have already started to fade.',
        'This closes the research skills in this course. The three-piece habit works on any source, in any class, for the rest of a student\'s life, any time something needs to be found again.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Giving Basic Source Information' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
