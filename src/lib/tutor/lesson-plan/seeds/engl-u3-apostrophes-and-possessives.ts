/**
 * HS English — Grammar & Usage: Apostrophes & Possessives.
 *
 * The punctuation mark readers judge fastest (CCSS L.9-10.2): mark
 * ownership on singular and plural nouns, keep contractions apart from
 * possessive pronouns (its/it's, their/they're/there, whose/who's), and
 * leave plain plurals alone. Every practice item is a revision-choice or
 * error-spot MCQ.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U3_APOSTROPHES_AND_POSSESSIVES: LessonPlan = {
  id: 'evelyn.hs.engl.apostrophes-and-possessives.v1',
  title: 'Apostrophes & Possessives',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.apostrophes-and-possessives',
      standard: 'ENGL-3.3',
      description:
        'Punctuate possession correctly on singular and plural nouns, distinguish contractions from possessive pronouns (its/it\'s, their/they\'re/there, whose/who\'s), and leave plain plural nouns free of apostrophes (CCSS L.9-10.2, L.9-10.2.c).',
    },
  ],
  prerequisites: ['engl.semicolons-and-colons'],
  followUps: ['engl.dashes-parentheses-quotation'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Apostrophe errors are the ones strangers notice instantly — frame the mark as a signal of ownership, not of plurality.',
      script:
        'Walk past enough storefronts and you will find one: a chalkboard promising "Fresh Muffin\'s Daily," with an apostrophe that has no business being there. Readers notice. The same mark shows up in the college essay you will write, the caption a club account posts, the email you send a teacher asking for a recommendation, and every time it lands in the wrong spot, a sentence quietly says something you did not mean. An apostrophe has exactly two jobs: it marks ownership, or it marks missing letters. It never, ever means "more than one." Today you get a two-question routine that places the mark correctly every time, plus the four lookalike pairs that trip up even strong writers.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-apostrophe-rules',
      kind: 'concept',
      goal: 'The ownership test, singular vs. plural possessive placement, and the contraction-versus-possessive-pronoun pairs.',
      keyIdeas: [
        'THE OWNERSHIP TEST — before writing an apostrophe, flip the phrase around with "of". "The drivers license" becomes "the license OF the driver," which makes sense, so an apostrophe is needed. If the of-flip produces nonsense, the word is a plain plural and takes NO apostrophe at all.',
        'SINGULAR POSSESSIVE — one owner takes apostrophe plus s, whatever letter the word ends in: "the writer\'s notebook," "the class\'s schedule," "the boss\'s office." Attach the mark to the end of the whole singular word; never slide it inside the word.',
        'PLURAL POSSESSIVE — pluralize FIRST, then punctuate. A regular plural already ends in -s, so it takes an apostrophe alone: writer becomes writers becomes "the writers\' notebooks" (several writers own them). WRONG: "the writers\'s notebooks." CORRECT: "the writers\' notebooks."',
        'IRREGULAR PLURALS — plurals that do NOT end in -s take a normal apostrophe plus s: child becomes children becomes "the children\'s books"; woman becomes women becomes "the women\'s team"; person becomes people becomes "the people\'s choice." WRONG: "the childrens\' books." CORRECT: "the children\'s books."',
        'PLAIN PLURALS TAKE NO APOSTROPHE — this is the storefront error. WRONG: "Fresh Bagel\'s Sold Here." CORRECT: "Fresh Bagels Sold Here." Nothing belongs to the bagels and no letters are missing, so no mark belongs there. The same goes for decades and acronyms in modern usage: "the 1990s," "three DVDs."',
        'CONTRACTION vs POSSESSIVE PRONOUN — three pairs cause most of the damage: its/it\'s, their/they\'re, and whose/who\'s. Expand the apostrophe form to test it. "It\'s" unpacks to "it is" or "it has," "they\'re" unpacks to "they are," "who\'s" unpacks to "who is" or "who has." If the expansion reads correctly, the apostrophe form belongs; if it collapses, use the possessive.',
        'POSSESSIVE PRONOUNS NEVER TAKE APOSTROPHES — its, theirs, hers, ours, yours, and whose already show ownership on their own, exactly the way "his" does. WRONG: "The team lost it\'s captain." CORRECT: "The team lost its captain." And "there" is the outsider of its trio: it marks a place or opens a sentence, as in "There are two drafts on the desk."',
      ],
      vocabulary: [
        { term: 'possessive', definition: 'a noun or pronoun form that shows ownership (the writer\'s draft, the writers\' drafts, its, whose).' },
        { term: 'contraction', definition: 'two words shortened into one, with an apostrophe standing in for the missing letters ("it\'s" = "it is").' },
        { term: 'plain plural', definition: 'a noun meaning simply more than one, owning nothing — it takes an -s and no apostrophe.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-plural-possessive',
      kind: 'worked_example',
      problem:
        'Fix the punctuation in this newsletter line: "The volunteers signatures filled the entire back page." Where does the apostrophe belong, and why?',
      steps: [
        'Run the ownership test: "the signatures OF the volunteers" makes sense, so "volunteers" does need a possessive apostrophe. This is not a plain plural.',
        'Count the owners. A whole page of signatures came from many people, so the owner is PLURAL: volunteers.',
        'Pluralize first, then punctuate: volunteer becomes volunteers. That plural already ends in -s, so add the apostrophe after the existing -s and stop there.',
        'CORRECT: "The volunteers\' signatures filled the entire back page." Two WRONG alternatives worth naming: "volunteer\'s" would claim a single volunteer signed the page over and over, and "volunteers" with no mark leaves the ownership unpunctuated.',
      ],
      answer: 'volunteers\' — a plural owner, so pluralize first and place the apostrophe after the -s already there',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-its-backward',
      kind: 'worked_example',
      problem:
        'A student turns in this sentence: "The museum reopened it\'s east wing on Saturday, and the staff says its going to stay open late all summer." Both apostrophe decisions are backward. Fix them.',
      steps: [
        'Start with the first slot. Expand the contraction: "it\'s" unpacks to "it is," which turns the sentence into "The museum reopened it is east wing." That collapses, so the contraction is WRONG here.',
        'What the writer means is the east wing belonging to the museum — ownership by a single "it." The possessive pronoun is "its," with no apostrophe, exactly the way "his" and "her" carry none.',
        'Now the second slot. "Going to stay open late" needs a subject and a verb in front of it: "it is going to stay open late." The expansion reads perfectly, so this slot needs the CONTRACTION "it\'s."',
        'CORRECT: "The museum reopened its east wing on Saturday, and the staff says it\'s going to stay open late all summer." Why the ear fails here: both forms sound identical aloud, so sound cannot decide. The expansion test decides.',
      ],
      answer:
        '"The museum reopened its east wing on Saturday, and the staff says it\'s going to stay open late all summer." — possessive "its" first, contraction "it\'s" second',
      estimatedMinutes: 3,
    },
    {
      id: 'try-plural-possessive',
      kind: 'try_yourself',
      problem:
        'Which choice correctly completes the sentence? "The two ___ dressing rooms sit on opposite sides of the stage."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'actors\'', correct: true },
        { id: 'b', text: 'actor\'s' },
        { id: 'c', text: 'actors' },
        { id: 'd', text: 'actors\'s' },
      ],
      expectedAnswer: 'actors\'',
      hints: [
        'Run the ownership test — the dressing rooms belong to whom, and is that owner singular or plural?',
        'Two actors own them, so pluralize first (actor becomes actors), then add the apostrophe after the -s that is already sitting there. Nothing more follows it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-its-pair',
      kind: 'try_yourself',
      problem:
        'Which choice correctly fills the two blanks, in order? "The bookstore moved ___ poetry section to the front window, and now ___ the first thing customers notice from the sidewalk."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'its ... it\'s', correct: true },
        { id: 'b', text: 'it\'s ... its' },
        { id: 'c', text: 'its ... its' },
        { id: 'd', text: 'it\'s ... it\'s' },
      ],
      expectedAnswer: 'its ... it\'s',
      hints: [
        'Expand "it is" into each blank separately — in which blank does it read correctly, and in which does it fall apart?',
        'Blank one shows the poetry section belonging to the store, so it needs the possessive "its." Blank two means "it is the first thing customers notice," so it takes the contraction.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-correct',
      kind: 'try_yourself',
      problem: 'Which sentence is punctuated correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The photographer whose work fills the hallway graduated last spring.', correct: true },
        { id: 'b', text: 'The photographer who\'s work fills the hallway graduated last spring.' },
        { id: 'c', text: 'The seniors hung they\'re best prints near the office door.' },
        { id: 'd', text: 'Three portrait\'s were added to the display case on Monday.' },
      ],
      expectedAnswer: 'The photographer whose work fills the hallway graduated last spring.',
      hints: [
        'Expand every apostrophe form you see: "who is," "they are." Any sentence where the expansion collapses is out.',
        'Option a needs a possessive before "work," and "whose" supplies it. The others fail three familiar ways: "who\'s work" expands to "who is work," "they\'re best prints" expands to "they are best prints," and "portrait\'s" puts a mark on a plain plural.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-plural-apostrophe',
      kind: 'misconception_check',
      question:
        'A sign in the school hallway reads "Fresh Bagel\'s Sold Every Friday." A student defends the mark: "Bagel\'s is the plural — the apostrophe shows there is more than one." What went wrong?',
      commonErrors: [
        {
          answer: 'The apostrophe is fine because it marks the plural',
          misconception: 'Treating the apostrophe as a plural marker rather than a marker of ownership or missing letters.',
          correctsTo:
            'An apostrophe has only two jobs: ownership and missing letters. Nothing belongs to the bagels and no letters are missing, so the sign needs the bare plural. WRONG: "Fresh Bagel\'s Sold Every Friday." CORRECT: "Fresh Bagels Sold Every Friday." The mark would return only if the bagels owned something, as in "the bagels\' warm smell filled the hallway."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An apostrophe marks ownership or missing letters — never a plain plural: bagels (plural), the bagel\'s crust (one owner), the bagels\' smell (many owners).',
        'Singular owner takes apostrophe plus s. For plurals, pluralize FIRST, then add just an apostrophe (writers\'), unless the plural does not end in -s (children\'s, women\'s).',
        'Expand to test: it\'s = it is/has, they\'re = they are, who\'s = who is/has. If the expansion collapses, you want its, their, or whose.',
        'Possessive pronouns carry no apostrophe at all — its, theirs, hers, ours, yours, whose — and "there" marks a place, not ownership.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Apostrophes & Possessives' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
