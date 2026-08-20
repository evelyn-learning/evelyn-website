/**
 * Grade 7 ELA — Mechanics: Commas & Punctuation.
 *
 * Procedure-led (CCSS L.7.2, with coordinate adjectives at L.7.2a). The
 * lesson replaces "put a comma where you pause" with five named comma jobs
 * and two runnable tests: the REMOVAL test for extra information and the
 * "and" test for coordinate adjectives. It closes with the apostrophe:
 * ownership yes, plurals never, and its versus it's.
 *
 * It follows m7ela.fragments-and-run-ons, so comma splices are referenced,
 * not re-taught.
 *
 * NOTE FOR FUTURE AUTHORS: every incorrect example in this file is labeled
 * WRONG with the CORRECT version beside it. A tutor reads these aloud, and
 * an unlabeled error would be presented to the student as a model. Also:
 * the serial comma is taught as a house style, never as a rule, and no item
 * has a correct answer that depends on it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U6_COMMAS_AND_END_PUNCTUATION: LessonPlan = {
  id: 'evelyn.ms.m7ela.commas-and-end-punctuation.v1',
  title: 'Commas & Punctuation',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.commas-and-end-punctuation',
      standard: 'M7ELA-6.4',
      description:
        'Punctuate sentences by naming the job each mark does — end marks that close a thought, commas for items in a series, introductory elements, a coordinating conjunction joining two independent clauses, extra removable information, and coordinate adjectives — and use apostrophes for possession rather than for plurals (CCSS L.7.2, including the comma between coordinate adjectives at L.7.2a).',
    },
  ],
  prerequisites: ['m7ela.fragments-and-run-ons'],
  followUps: ['m7ela.context-clues'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that one missing comma changes what the reader actually pictures.',
      script:
        'A friend texts you about the mess at her house last night. WRONG: "While we were eating the cat knocked over the whole pitcher." Read that first part again. For half a second, her family is eating the cat. Your brain has to back up and start over. One comma clears it up completely. CORRECT: "While we were eating, the cat knocked over the whole pitcher." Nothing changed except one small mark, and now there is only one way to read it. Here is the part most people get wrong: commas are not about where you breathe. Every comma is doing a job, and there are only five of them. Today you learn those five jobs, two quick tests you can run when you are stuck, and where the apostrophe goes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-punctuation-jobs',
      kind: 'concept',
      goal: 'Install the name-the-job rule, the five comma jobs, the removal test, the "and" test, and the apostrophe rules.',
      keyIdeas: [
        'END MARKS CLOSE A THOUGHT; COMMAS WORK INSIDE ONE. Every sentence ends with a period, a question mark or an exclamation point, and that mark is what keeps two complete thoughts apart. You saw last lesson that a comma cannot do that job by itself. WRONG: "The rain started, we ran inside." CORRECT: "The rain started. We ran inside." A comma is legal only when it is doing one of the five jobs below. If you cannot name the job, take the comma out.',
        'JOB 1, ITEMS IN A SERIES, AND JOB 2, AN INTRODUCTORY ELEMENT. Three or more items in a list get commas between them: "We packed sandwiches, grapes, and a bag of ice." The last comma, the one before "and", is called the serial comma. It is a style choice, not a rule. Many style guides use it and this course uses it, so pick one habit and stay consistent. Job 2 is separate: when a word, a phrase or a whole clause runs ahead of the main sentence, close it with a comma. "After the second period bell, the hallway finally emptied out."',
        'JOB 3, JOINING TWO COMPLETE SENTENCES. When one of the FANBOYS words (for, and, nor, but, or, yet, so) joins two groups that could each stand alone, put the comma BEFORE that word: "The pool closed early, so we rode home." Check what follows the joining word first. If it has no subject of its own, it is a second verb, not a second sentence, and it takes no comma. WRONG: "Deshawn grabbed his glove, and ran to the field." CORRECT: "Deshawn grabbed his glove and ran to the field."',
        'JOB 4, EXTRA INFORMATION, AND THE REMOVAL TEST. Some information can be lifted straight out of a sentence. Take it out and read what is left: if the sentence still works and still means the same thing, that information is extra, and extra information gets a PAIR of commas, one before and one after. "My cousin, who lives in Tulsa, sent a postcard." Never build half the fence. WRONG: "My cousin, who lives in Tulsa sent a postcard." If removing the words leaves you unsure WHICH one is meant, they are not extra and they get no commas at all: "The kid who found my phone gets the reward."',
        'JOB 5, COORDINATE ADJECTIVES, AND THE "AND" TEST. Two adjectives are coordinate when each one describes the noun on its own. Test them twice: put "and" between them, then swap their order. If both versions still sound right, they need a comma. "A long, boring afternoon" passes, because "long and boring" works and "boring, long afternoon" works. Now try "a bright red jacket": "bright and red" sounds wrong and "a red bright jacket" sounds worse, so those adjectives are stacked, not coordinate. WRONG: "a bright, red jacket." CORRECT: "a bright red jacket."',
        'APOSTROPHES MARK OWNERSHIP OR MISSING LETTERS, NEVER PLURALS. One owner takes apostrophe plus s: "my brother\'s bike." Several owners take the plural first and then the apostrophe: "the players\' benches." A word that just means more than one gets nothing. WRONG: "two taco\'s" CORRECT: "two tacos" And the pair that fools everybody: "it\'s" is short for "it is" or "it has", while "its" is the possessive, exactly like "his" and "her". Expand it to test. WRONG: "The team lost it\'s captain." CORRECT: "The team lost its captain."',
      ],
      vocabulary: [
        { term: 'serial comma', definition: 'the optional comma before the final "and" or "or" in a list of three or more items; this course uses it.' },
        { term: 'introductory element', definition: 'a word, phrase or clause that comes before the main sentence and is closed off with a comma.' },
        { term: 'extra information', definition: 'words that can be removed without changing what the sentence means or which person or thing it is about; they take a pair of commas.' },
        { term: 'coordinate adjectives', definition: 'two adjectives that each describe the noun on their own, so you can join them with "and" or swap their order; they take a comma between them.' },
        { term: 'possessive', definition: 'the form of a noun that shows ownership, written with an apostrophe: my brother\'s bike, the players\' benches.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-intro-and-series',
      kind: 'worked_example',
      problem:
        'Add the commas this sentence needs. "After the last game of the season Coach handed out orange slices water bottles and a stack of team photos."',
      steps: [
        'Find the main sentence first. It is "Coach handed out ..." Everything before the word "Coach" is setup, so that is Job 2, an introductory element. Close it with a comma after "season".',
        'Now look at what Coach handed out: orange slices, water bottles, a stack of team photos. That is three items, which is Job 1, a series.',
        'Put a comma between the items. This course uses the serial comma, so there is also a comma before "and". Leaving that last one out would not be an error, but stay consistent inside a piece of writing.',
        'CORRECT: "After the last game of the season, Coach handed out orange slices, water bottles, and a stack of team photos."',
        'Notice what gets NO comma. Nothing goes between "Coach" and "handed", because there is no job between a subject and its verb, no matter how long the sentence feels. WRONG: "After the last game of the season, Coach, handed out orange slices, water bottles, and a stack of team photos."',
      ],
      answer:
        '"After the last game of the season, Coach handed out orange slices, water bottles, and a stack of team photos." — one introductory comma plus the commas in the series.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-removal-and-and-test',
      kind: 'worked_example',
      problem:
        'This sentence has no commas at all. Decide where they belong, and prove each one. "Mr. Alvarez who coaches the swim team lent us a cracked dusty paddle."',
      steps: [
        'Start with "who coaches the swim team" and run the REMOVAL test. Lift it out and read what is left: "Mr. Alvarez lent us a cracked dusty paddle." The sentence still works, and you still know exactly who did it, because his name is right there.',
        'So that clause is extra information, which is Job 4. Extra information gets a PAIR of commas: one before "who" and one after "team".',
        'Do not build half the fence. WRONG: "Mr. Alvarez, who coaches the swim team lent us a cracked dusty paddle." One comma leaves the sentence hanging open and strands the subject away from its verb.',
        'Now the two adjectives, "cracked" and "dusty". Run the "and" test: "a cracked and dusty paddle" sounds right. Now swap them: "a dusty, cracked paddle" also sounds right. Both versions pass, so these are coordinate adjectives and they take a comma between them. That is Job 5.',
        'Compare that with a pair that FAILS the test, so you can feel the difference. "A bright red jacket" gives you "bright and red jacket" and "a red bright jacket", and both sound wrong. Those adjectives stack instead. WRONG: "a bright, red jacket." CORRECT: "a bright red jacket."',
        'CORRECT: "Mr. Alvarez, who coaches the swim team, lent us a cracked, dusty paddle." Three commas, and every one of them can name its job.',
      ],
      answer:
        '"Mr. Alvarez, who coaches the swim team, lent us a cracked, dusty paddle." — a pair of commas around the extra information, plus one comma between the coordinate adjectives.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-intro-and-series',
      kind: 'try_yourself',
      problem: 'Which sentence is punctuated correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Before the movie started, we bought popcorn, a soda, and a box of licorice.', correct: true },
        { id: 'b', text: 'Before the movie started we bought popcorn, a soda, and a box of licorice.' },
        { id: 'c', text: 'Before the movie started, we, bought popcorn, a soda, and a box of licorice.' },
        { id: 'd', text: 'Before the movie started, we bought popcorn a soda and a box of licorice.' },
      ],
      expectedAnswer: 'Before the movie started, we bought popcorn, a soda, and a box of licorice.',
      hints: [
        'Two jobs are in play at the same time here: closing an introductory element, and separating items in a series.',
        'The setup "Before the movie started" needs a comma after it, the three snacks need commas between them, and nothing at all is allowed to sit between "we" and "bought".',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-removal-test',
      kind: 'try_yourself',
      problem: 'Which sentence is punctuated correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'My aunt Rosa who trains guide dogs stayed with us for a week.' },
        { id: 'b', text: 'My aunt Rosa, who trains guide dogs, stayed with us for a week.', correct: true },
        { id: 'c', text: 'My aunt Rosa, who trains guide dogs stayed with us for a week.' },
        { id: 'd', text: 'My aunt Rosa who trains guide dogs, stayed with us for a week.' },
      ],
      expectedAnswer: 'My aunt Rosa, who trains guide dogs, stayed with us for a week.',
      hints: [
        'Run the removal test. Take out "who trains guide dogs" and read what is left. Does the sentence still work, and do you still know exactly who stayed?',
        'Her name is already in the sentence, so the dog-training part is extra information, and extra information takes a PAIR of commas. One comma on its own builds half a fence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-and-test',
      kind: 'try_yourself',
      problem: 'Which sentence is punctuated correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'We waited through a long boring afternoon in a bright red tent.' },
        { id: 'b', text: 'We waited through a long, boring afternoon in a bright, red tent.' },
        { id: 'c', text: 'We waited through a long, boring afternoon in a bright red tent.', correct: true },
        { id: 'd', text: 'We waited through a long, boring, afternoon in a bright red tent.' },
      ],
      expectedAnswer: 'We waited through a long, boring afternoon in a bright red tent.',
      hints: [
        'Run the "and" test on each pair of adjectives, then swap their order. One pair passes both checks and one pair fails both.',
        '"Long and boring" works and "boring, long afternoon" works, so that pair needs a comma. "Bright and red" does not work and "a red bright tent" does not either, so that pair gets nothing. And no comma ever separates the last adjective from its noun.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pause-and-its',
      kind: 'misconception_check',
      question:
        'A student turns in these two sentences. WRONG: "The girl with the green skateboard, lives on my street. Her dog dropped it\'s ball in the pool." She defends both marks. She says the comma is right because that is where she pauses when she reads it aloud, and she says "it\'s" is right because the ball belongs to the dog. Is she right about either one?',
      commonErrors: [
        {
          answer: 'Yes, the comma belongs there, because that is where you pause when you read the sentence out loud.',
          misconception:
            'Using pauses instead of jobs to place commas. This is the most common comma rule students are taught and the least reliable one, because everybody pauses in different places and long subjects always feel like they deserve a rest stop.',
          correctsTo:
            'Name the job before you keep a comma. That mark sits between the subject, "The girl with the green skateboard", and its verb, "lives". None of the five jobs covers that gap, so the comma has to go. WRONG: "The girl with the green skateboard, lives on my street." CORRECT: "The girl with the green skateboard lives on my street." Reading a sentence aloud is still useful for hearing when something is confusing. It just does not decide where the marks land.',
        },
        {
          answer: 'Yes, "it\'s" is right, because the ball belongs to the dog.',
          misconception:
            'Believing the apostrophe form is the possessive, because with regular nouns the apostrophe really does show ownership.',
          correctsTo:
            'Expand it and listen. "It\'s" is short for "it is", so the sentence becomes "Her dog dropped it is ball in the pool", which falls apart. The possessive is "its", with no apostrophe at all, exactly like "his" and "her". WRONG: "Her dog dropped it\'s ball in the pool." CORRECT: "Her dog dropped its ball in the pool." And remember the other half of the rule: an apostrophe never makes a word plural. WRONG: "two taco\'s" CORRECT: "two tacos"',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An end mark closes a complete thought. A comma works inside one, and it is legal only when you can name its job.',
        'The five jobs: items in a series, an introductory element, a FANBOYS word joining two complete sentences, extra information, and coordinate adjectives.',
        'REMOVAL TEST for extra information: take it out. If the sentence still works and still means the same thing, put a PAIR of commas around it.',
        '"AND" TEST for adjectives: if you can put "and" between them and swap their order, use a comma. "A long, boring afternoon" passes; "a bright red jacket" does not.',
        'Never place a comma just because you pause, and never split a subject from its verb.',
        'Apostrophes mark ownership or missing letters, never plurals. WRONG: "two taco\'s" CORRECT: "two tacos" And "it\'s" means "it is"; the possessive is "its".',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'Commas & Punctuation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
