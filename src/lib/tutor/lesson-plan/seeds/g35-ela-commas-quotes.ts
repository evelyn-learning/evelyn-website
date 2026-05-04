/**
 * Grades 3-5 ELA — Commas & Quotation Marks.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_COMMAS_QUOTES: LessonPlan = {
  id: 'evelyn.g35.ela.commas-quotes.v1',
  title: 'Grades 3-5 ELA — Commas & Quotation Marks',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.commas-quotes',
      description: 'Use commas correctly in lists, dates, addresses, and compound sentences; punctuate dialogue with quotation marks.',
      standard: 'CCSS.ELA-LITERACY.L.4.2',
    },
  ],
  prerequisites: ['g35.ela.verb-tenses'],
  followUps: ['g35.ela.research-basics'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Commas and quotation marks are tiny but powerful — they tell readers when to pause and when characters are speaking.',
      script: '"Let\'s eat Grandma!" vs "Let\'s eat, Grandma!" One missing comma changes the meaning entirely. Today we drill the comma rules and quotation conventions that make writing clear.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-comma-quote',
      kind: 'concept',
      goal: 'Comma rules + quotation conventions.',
      keyIdeas: [
        'COMMA in LISTS (Oxford or not): "I bought apples, oranges, and bananas." (Oxford comma before "and" preferred for clarity in 3+ items.)',
        'COMMA in DATES: "July 4, 1776" or "July 4, 1776, was Independence Day."',
        'COMMA in ADDRESSES: "She lives in Austin, Texas." Comma between city and state.',
        'COMMA in COMPOUND SENTENCES: place a comma BEFORE the conjunction (and, but, or, so) when joining two complete thoughts. "I wanted to go, but it was raining."',
        'COMMA after INTRODUCTORY phrase: "After lunch, we played outside." "However, it started to rain."',
        'COMMA in DIRECT ADDRESS: "Maya, please pass the salt." "Thanks, Mom!"',
        'QUOTATION MARKS: enclose the EXACT words a character speaks. "I am ready," she said.',
        'QUOTATION PUNCTUATION: comma BEFORE the closing quote when speech tag follows. Period inside quotes if speech ends the sentence. ',
        'NEW LINE per SPEAKER: when a different character starts speaking, start a new paragraph. Helps readers track who\'s talking.',
        'COMMON ERROR — comma splice: joining two complete sentences with ONLY a comma. Fix with period, semicolon, or comma + conjunction.',
      ],
      vocabulary: [
        { term: 'compound sentence', definition: 'a sentence containing two independent clauses joined by a conjunction.' },
        { term: 'speech tag', definition: 'words like "she said" or "he asked" that identify the speaker.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-comma-quote',
      kind: 'worked_example',
      problem: 'Punctuate this sentence: "I bought milk eggs and bread my mom said."',
      steps: [
        'This is a SPOKEN sentence — needs quotation marks around what mom said.',
        'Add quotes around the spoken part: "I bought milk eggs and bread" my mom said.',
        'Add commas in the LIST: "I bought milk, eggs, and bread" my mom said.',
        'Add comma before the closing quote (before speech tag): "I bought milk, eggs, and bread," my mom said.',
        'Add period at end: "I bought milk, eggs, and bread," my mom said.',
      ],
      answer: '"I bought milk, eggs, and bread," my mom said.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Add commas: "I went to Paris France in March 2022 and it was wonderful."',
      expectedAnswer: '"I went to Paris, France, in March 2022, and it was wonderful."',
      responseFormat: 'free',
      hints: [
        'City + country needs commas.',
        'Compound sentence ("and it was wonderful") — comma before "and".',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-comma-splice',
      kind: 'misconception_check',
      question: 'A student writes: "It was raining, we stayed inside." Why is this wrong?',
      commonErrors: [
        {
          answer: '"It was raining, we stayed inside."',
          misconception: 'Joining two complete sentences with only a comma (a "comma splice").',
          correctsTo: 'Both halves are COMPLETE sentences. A comma alone is too weak to join them. Three fixes: 1) Period: "It was raining. We stayed inside." 2) Semicolon: "It was raining; we stayed inside." 3) Comma + conjunction: "It was raining, so we stayed inside." Comma splices are one of the most common writing errors — always check whether each side of the comma is a complete sentence.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Commas in lists, dates, addresses, compound sentences, after intro phrases, in direct address.',
        'Quotation marks enclose exact words.',
        'Comma BEFORE closing quote when speech tag follows.',
        'New paragraph per speaker.',
        'Avoid comma splices: don\'t join complete sentences with just a comma.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When dialogue continues after a speech tag, how do you punctuate?',
      hint: '"I want to go," she said, "but I don\'t have time." → comma after first part of speech, comma after "said", quotation continues. Or: "I want to go." She paused. "But I don\'t have time." (Two separate sentences with action between.)',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
