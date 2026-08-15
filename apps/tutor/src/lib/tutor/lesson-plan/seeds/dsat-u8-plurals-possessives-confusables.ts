/**
 * Digital SAT — Reading & Writing / Standard English Conventions:
 * Plurals, Possessives & Frequently Confused Words.
 *
 * The digital SAT's Standard English Conventions domain repeatedly tests
 * the same short list of lookalike words: it's/its, their/there/they're,
 * whose/who's, and plural vs. possessive noun placement (student's vs.
 * students'). None of these require "knowledge" so much as a reliable
 * substitution test applied consistently under time pressure.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U8_PLURALS_POSSESSIVES_CONFUSABLES: LessonPlan = {
  id: 'evelyn.testprep.dsat.plurals-possessives-confusables.v1',
  title: 'Plurals, Possessives & Frequently Confused Words',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.plurals-possessives-confusables',
      standard: 'DSAT-8.4',
      description:
        "Distinguish frequently confused words (its/it's, their/there/they're, whose/who's) and apply correct plural vs. possessive noun placement (student's vs. students').",
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame confusable-words questions as high-frequency, high-speed points inside Standard English Conventions.',
      script:
        "Standard English Conventions makes up roughly 11 to 15 of the questions in each Reading & Writing module. Inside that domain, confusable-word traps — it's/its, their/there/they're, whose/who's, and plural vs. possessive placement — show up repeatedly, often more than once per test. None of them require memorizing a rule book. They all fall to the same 10-second substitution test, which makes them some of the fastest points on the entire exam once it's automatic.",
      estimatedMinutes: 1,
    },
    {
      id: 'concept-confusables',
      kind: 'concept',
      goal:
        "The substitution test for contractions, the four confusable pairs, and how plural vs. possessive placement works.",
      keyIdeas: [
        "THE SUBSTITUTION TEST — for any pair where one option is a contraction (it's, they're, who's), mentally expand it to the two words it stands for. If the sentence still reads correctly, the contraction is right; if not, use the non-contraction form.",
        "ITS vs IT'S — \"its\" is a possessive pronoun, no apostrophe, same family as \"his\" or \"her\": \"The company raised its prices.\" \"It's\" is ONLY ever a contraction for \"it is\" or \"it has\": \"It's raining.\"",
        "THEIR vs THERE vs THEY'RE — \"their\" = possessive (\"their prices\"); \"there\" = a place or \"there is/are\" (\"put it there,\" \"there are two options\"); \"they're\" = \"they are\" (\"they're leaving soon\").",
        "WHOSE vs WHO'S — \"whose\" = possessive, used for people or things (\"the writer whose article...\"); \"who's\" = \"who is\" or \"who has\" (\"who's calling?\").",
        "AN APOSTROPHE NEVER SIGNALS A PLAIN PLURAL. \"The dogs barked\" (plural, no apostrophe). \"The dog's leash\" (ONE dog owns it). \"The dogs' leashes\" (MULTIPLE dogs own them).",
        "PLURAL POSSESSIVE PLACEMENT — pluralize the noun FIRST, then add the apostrophe. Regular plural already ending in -s: add just an apostrophe (student → students → students'). Irregular plural NOT ending in -s: add 's (child → children → children's, woman → women → women's).",
        "THE SAT'S TRAP PATTERN — the test plants a plural noun right next to the blank to bait \"their\" when the true antecedent is singular (needs \"its\"), or plants a singular-looking noun to bait \"its\"/\"'s\" when the true antecedent is plural. Always trace the word back to what it actually replaces or modifies before picking.",
        "NO CALCULATOR FOR GRAMMAR, SAME DISCIPLINE — reread the full sentence with your choice plugged in and confirm it says what the passage MEANS, not just what \"sounds right\" out of habit.",
      ],
      vocabulary: [
        { term: 'contraction', definition: 'two words shortened into one, with an apostrophe marking the missing letters (it\'s = it is).' },
        { term: 'possessive', definition: 'a word form that shows ownership (its, whose, students\').' },
        { term: 'homophone', definition: 'words that sound alike but differ in spelling and meaning (their/there/they\'re).' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-their-there-theyre',
      kind: 'worked_example',
      problem:
        'Read the passage: "A local bakery started delivering fresh bread to nearby apartment buildings every Saturday morning. Residents quickly began leaving notes of thanks, and several buildings now keep a standing order. The bakery\'s owner says the deliveries have become ___ favorite part of the week." Which choice completes the text with the most logical word: (a) their (b) there (c) they\'re?',
      steps: [
        'The blank needs a word that shows possession — the "favorite part" belongs to the residents who look forward to the deliveries, so a possessive pronoun is needed.',
        'Test (c) "they\'re": substitute "they are" → "have become they are favorite part" — breaks down. Eliminate.',
        'Test (b) "there": signals a place or "there is/are," and doesn\'t fit directly before a noun like "favorite part." Eliminate.',
        '(a) "Their" is the possessive pronoun modifying "favorite part": "have become their favorite part of the week." Correct.',
      ],
      answer: 'their',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-its-plural-possessive-trap',
      kind: 'worked_example',
      problem:
        'Read the passage: "A regional airline surveyed passengers after switching to a new boarding system. The survey found that most travelers preferred the new process because ___ boarding passes now display seat groups in bigger print. Airline managers also reviewed feedback submitted by gate agents across twelve airports before finalizing the change; the agents\' notes shaped several small adjustments to the announcement script." Which choice completes the blank: (a) its (b) it\'s (c) their?',
      steps: [
        'Find the antecedent of the blank: whose boarding passes? "Most travelers" — plural — so the pronoun must be plural, not a word built around a single "it."',
        'Test (b) "it\'s": substitute "it is" → "because it is boarding passes now display" — fails grammatically. Eliminate.',
        'Test (a) "its": would mean the boarding passes belong to one "it" (say, the airline as a whole), but the sentence is about what the travelers themselves see on their own passes — "its" doesn\'t agree in number with "travelers." Eliminate.',
        '(c) "Their" agrees with the plural antecedent "travelers": "their boarding passes." Correct.',
        'Bonus check already inside the passage: "the agents\' notes" is correctly PLURAL possessive — many gate agents, apostrophe placed after the existing -s. "The agent\'s notes" would wrongly imply just one agent.',
      ],
      answer: 'their',
      estimatedMinutes: 3,
    },
    {
      id: 'try-its-contraction',
      kind: 'try_yourself',
      problem:
        'Read the passage: "A community garden added a rainwater collection system last year to reduce its water bill during dry summers. Neighbors who tend the garden say ___ noticeably easier to keep the tomato beds watered now that the tank refills after every storm." Which choice completes the text with the most logical word or phrase?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'its' },
        { id: 'b', text: "it's", correct: true },
        { id: 'c', text: 'their' },
        { id: 'd', text: "they're" },
      ],
      expectedAnswer: "it's",
      hints: [
        'Try substituting "it is" into the blank — does the sentence still make sense?',
        '"Neighbors say it is noticeably easier..." works. The blank needs the contraction, not a possessive pronoun or a plural pronoun.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-their-there-theyre',
      kind: 'try_yourself',
      problem:
        'Read the passage: "Two rival robotics teams from neighboring high schools built competing water-filtration prototypes for the regional science fair. After months of testing, ___ prototypes both qualified for the state competition, and the coaches now share a practice space twice a week." Which choice completes the text with the most logical word or phrase?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'their', correct: true },
        { id: 'b', text: 'there' },
        { id: 'c', text: "they're" },
        { id: 'd', text: 'its' },
      ],
      expectedAnswer: 'their',
      hints: [
        'Ask what "prototypes" belong to — is the owner singular or plural?',
        'Test "they are" and "it is" in the blank; neither works, so the answer is a possessive pronoun, not a contraction — and it needs to be plural to match "two rival robotics teams."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-whose-whos',
      kind: 'try_yourself',
      problem:
        'Read the passage: "A youth chess club is honoring the volunteer ___ patient coaching helped three beginners reach their first tournament wins this season. The club board plans to name an annual mentorship award after this volunteer next year." Which choice completes the text with the most logical word or phrase?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'whose', correct: true },
        { id: 'b', text: "who's" },
        { id: 'c', text: 'who is' },
        { id: 'd', text: 'which' },
      ],
      expectedAnswer: 'whose',
      hints: [
        'Test "who is" in the blank — "the volunteer who is patient coaching helped" does not hold together grammatically.',
        'You need a possessive word directly before "coaching" — the coaching that belongs to the volunteer. "Which" is also wrong here because it isn\'t used to refer to a person.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-plural-possessive',
      kind: 'misconception_check',
      question:
        'A student writes: "All of the student\'s projects were displayed in the hallway." Every student in the class had a project on display. What\'s wrong with "student\'s" here?',
      commonErrors: [
        {
          answer: "student's is fine — it just means something belonging to a student",
          misconception: 'Using the SINGULAR possessive (\'s) when the noun it modifies is actually plural.',
          correctsTo:
            "Since MANY students each contributed a project, the possessive must be PLURAL: pluralize first (student → students), then add just an apostrophe, since \"students\" already ends in -s → students'. Correct: \"All of the students' projects were displayed in the hallway.\" Only add 's for plurals that DON'T already end in -s, like children's or women's.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "An apostrophe never makes a word plural: cats (plural) vs. cat's (one owner) vs. cats' (multiple owners).",
        "it's = it is/has; its = possessive. their = possessive plural; there = place/\"there is/are\"; they're = they are. whose = possessive; who's = who is/has. Substitute the full words to test any contraction.",
        "For plural possessives, pluralize the noun first, then add just an apostrophe (students') — only add 's for irregular plurals that don't already end in -s (children's).",
        'Reread the full sentence with your choice plugged in before answering — that single habit catches nearly every trap in this topic.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'Plurals, Possessives & Frequently Confused Words' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
