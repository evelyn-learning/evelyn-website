/**
 * ACT — English: Grammar, punctuation, rhetorical skills.
 *
 * 75 questions, 45 minutes. Tests usage/mechanics (~55%) and
 * rhetorical skills (~45%). The pace is brutal — ~36 sec per
 * question. The same six grammar rules from SAT plus comma rules,
 * apostrophes, and rhetorical-strategy questions about word choice
 * and paragraph order.
 */

import type { LessonPlan } from '../types';

export const SEED_ACT_ENGLISH: LessonPlan = {
  id: 'evelyn.testprep.act.english.v1',
  title: 'ACT English: Grammar and Rhetoric',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act-english',
  locale: 'en',
  los: [
    {
      id: 'act.english',
      description: 'Apply grammar, punctuation, and rhetorical-skills knowledge to ACT English questions.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame ACT English as a pace + rule-recognition test.',
      script: '75 questions in 45 minutes. That\'s 36 seconds per question. The good news: ACT English is the most rule-based, predictable section on either college admission test. Master the rules and master pacing — you don\'t need to read every passage carefully. Just scan the underlined parts and apply rules.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-act-english',
      kind: 'concept',
      goal: 'Question categories + key rules + pacing strategy.',
      keyIdeas: [
        'TWO main question categories:',
        '  USAGE & MECHANICS (~55%): grammar, punctuation, sentence structure.',
        '  RHETORICAL SKILLS (~45%): word choice, paragraph structure, organization, conciseness.',
        'CORE GRAMMAR RULES (largely shared with SAT):',
        '  1) Subject-verb agreement (watch prepositional phrases hiding the subject).',
        '  2) Pronoun agreement (each, everyone = singular).',
        '  3) Parallel structure in lists.',
        '  4) Modifier placement (the modifier modifies the closest noun).',
        '  5) Sentence vs fragment vs run-on.',
        '  6) Tense consistency.',
        'PUNCTUATION rules (heavy ACT focus):',
        '  COMMAS: list, compound, intro, non-essential. NEVER between subject/verb.',
        '  SEMICOLONS: join two independent clauses (replaces "and" + comma).',
        '  COLONS: introduce a list or explanation; what FOLLOWS must explain or list. Independent clause must come BEFORE.',
        '  DASHES: like commas (interruption) or like a colon (introduction). Two dashes around a non-essential phrase, or one before an explanation.',
        '  APOSTROPHES: possession (Sam\'s book) and contractions (don\'t). NOT used for plurals!',
        'RHETORICAL SKILLS:',
        '  CONCISION: shorter usually wins. ACT favors clean, direct phrasing. "OMIT" or shortest answer is often correct.',
        '  STYLE: match tone. A formal essay shouldn\'t suddenly use slang.',
        '  ORDER questions: best paragraph order; best transition.',
        '  RELEVANCE: should this sentence be added or deleted? Look for whether it supports the surrounding paragraph.',
        'PACING STRATEGY:',
        '  Don\'t read passages in full first. Look at the underlined portion + context (one sentence before and after).',
        '  When stuck, eliminate two and guess. Never leave blanks.',
        '  Skip and circle hard questions; come back if time allows.',
      ],
      vocabulary: [
        { term: 'usage and mechanics', definition: 'grammar, punctuation, sentence structure questions.' },
        { term: 'rhetorical skills', definition: 'word choice, organization, style questions.' },
        { term: 'concision', definition: 'expressing an idea using as few words as needed.' },
      ],
      suggestedTools: ['show_text', 'show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-semicolon',
      kind: 'worked_example',
      problem: 'Pick the punctuation: "She studied hard ___ she got an A."',
      steps: [
        'Two independent clauses: "She studied hard" + "she got an A".',
        'Options: comma alone (WRONG — comma splice), period (works), comma + and/so (works), semicolon (works).',
        'A semicolon is correct: "She studied hard; she got an A."',
        'Test: replace semicolon with period — does each side stand alone? Yes → semicolon is fine.',
      ],
      answer: 'Semicolon (or period, or comma + conjunction)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-concise',
      kind: 'worked_example',
      problem: 'Pick the most concise version: (a) "due to the fact that" (b) "because" (c) "owing to the circumstance that" (d) "in light of the fact that"',
      steps: [
        'All four mean the same thing.',
        'ACT prefers SHORTEST that conveys meaning.',
        '(b) "because" — one word. Always wins over wordy alternatives.',
      ],
      answer: '(b) because',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Fix: "The teacher gave it to me — Sarah and Sam — to take home."',
      expectedAnswer: 'Likely correct as is, or could be commas/parens around the appositive.',
      responseFormat: 'free',
      hints: [
        'Two dashes set off a non-essential phrase. Same job as commas or parentheses.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-its-its',
      kind: 'misconception_check',
      question: 'Sage writes "Its time for the meeting." What\'s the rule for it\'s vs its?',
      commonErrors: [
        {
          answer: 'no rule, both work',
          misconception: 'Confusing the contraction with the possessive.',
          correctsTo: '"It\'s" = "it is" (contraction) — apostrophe stands for missing letter. "Its" = possessive (the dog wagged its tail) — NO apostrophe. Test: replace with "it is" — if it works, use "it\'s"; otherwise "its". So "It\'s time for the meeting" (= "It is time"), but "The dog wagged its tail" (NOT "it is tail").',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Usage/mechanics ~55% + rhetorical skills ~45%.',
        'Punctuation heavy: commas, semicolons, colons, dashes, apostrophes.',
        'Apostrophes: possession or contraction, NOT plural.',
        'Concision usually wins — shortest answer often correct.',
        'Pace: ~36 sec/Q. Don\'t read full passages — look at underlined + context.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Take a practice ACT English passage. Time yourself. Are you under 36 seconds per question on average?',
      hint: 'If not, identify what\'s slowing you — overthinking, re-reading, or a specific question type. Practice that.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
