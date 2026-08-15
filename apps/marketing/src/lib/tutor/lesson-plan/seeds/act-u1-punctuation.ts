/**
 * ACT — English / Punctuation: Commas, Apostrophes, Colons & Dashes.
 *
 * Punctuation questions are among the most frequent and most beatable on
 * ACT English — they're pure rule-application, no outside knowledge
 * required. The ACT's favorite move is the UNNECESSARY-COMMA TRAP: an
 * answer choice that inserts a comma somewhere that "feels" like a pause
 * but has no grammatical job. All excerpts below are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U1_PUNCTUATION: LessonPlan = {
  id: 'evelyn.testprep.act.punctuation.v1',
  title: 'Punctuation: Commas, Apostrophes, Colons & Dashes',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.punctuation',
      standard: 'ACT-1.2',
      description:
        'Apply comma, apostrophe, colon, and dash rules to fix or confirm punctuation in ACT English passage excerpts, correctly distinguishing essential from nonessential information.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame punctuation questions as high-frequency, high-beatability, and pace the section.',
      script:
        'ACT English gives you 75 questions in 45 minutes — about 36 seconds each. Punctuation questions (commas, apostrophes, colons, dashes) typically make up close to a fifth of that test, and unlike vocabulary or content questions, they run on a small, fixed set of rules. Learn the rules and you can answer these in seconds. The catch: the ACT constantly baits you with an extra comma that sounds fine read aloud but breaks a rule. Today we hunt that trap specifically.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-punctuation-rules',
      kind: 'concept',
      goal: 'Core comma/semicolon/colon/dash/apostrophe rules, with the unnecessary-comma trap as the headline pattern.',
      keyIdeas: [
        'PAIRED COMMAS FOR NONESSENTIAL INFO: an appositive or extra descriptive clause that could be deleted without changing the sentence\'s core meaning gets a comma (or dash) BEFORE and AFTER it — never just one side.',
        'NO COMMAS FOR ESSENTIAL INFO: a clause that identifies WHICH person or thing is meant (a restrictive clause, often starting with "that" or "who") takes NO commas at all. Confusing these two is the single most common ACT punctuation trap.',
        'THE UNNECESSARY-COMMA TRAP: the ACT constantly offers a choice with an extra comma wedged between a subject and its verb, a verb and its object, or right after a FANBOYS conjunction. If you can\'t name the rule that puts a comma there, the comma doesn\'t belong — DELETE IT.',
        'COMMA SPLICE TRAP: a single comma can never join two independent clauses. Fix with a period, a semicolon, or a comma plus a FANBOYS conjunction (for, and, nor, but, or, yet, so).',
        'SEMICOLON = TWO COMPLETE SENTENCES GLUED TOGETHER: both sides of a semicolon must be able to stand alone. If either side is a fragment, the semicolon is wrong.',
        'COLON AND SINGLE DASH NEED A COMPLETE CLAUSE FIRST: whatever comes before a colon or a single introductory dash must be a full independent clause; what follows explains, lists, or emphasizes it.',
        'APOSTROPHES NEVER MAKE A PLURAL: "the dog\'s bone" (one dog, possessive), "the dogs\' bones" (multiple dogs, possessive), "dogs" (just plural, no apostrophe). "Its" is possessive; "it\'s" is the contraction for "it is."',
        'PAIRED DASHES = PAIRED COMMAS: two dashes around a nonessential interruption do the same job as two commas — don\'t mix one dash with one comma around the same interruption.',
      ],
      vocabulary: [
        { term: 'appositive', definition: 'a noun phrase placed next to another noun that renames or explains it (e.g., "my sister, a doctor,").' },
        { term: 'restrictive clause', definition: 'a clause essential to identifying its noun, and therefore written with no surrounding commas (e.g., "the book that I borrowed").' },
        { term: 'FANBOYS', definition: 'the seven coordinating conjunctions: for, and, nor, but, or, yet, so.' },
        { term: 'comma splice', definition: 'the error of joining two independent clauses with only a comma.' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-appositive-commas',
      kind: 'worked_example',
      problem:
        'In the passage: "The team captain, JOSH JENNINGS, called a timeout with ten seconds left." Is the punctuation around "JOSH JENNINGS" correct as written, or should the commas be deleted?',
      steps: [
        'Identify what "Josh Jennings" is doing in the sentence — it renames "the team captain." That makes it an appositive.',
        'Test it: delete the phrase entirely. "The team captain called a timeout with ten seconds left." Still a complete, sensible sentence — so the appositive is NONESSENTIAL information.',
        'Nonessential information gets set off by a PAIR of commas (or dashes, or parentheses) — one before, one after.',
        'Both commas in the original sentence are in the right places. NO CHANGE is correct.',
      ],
      answer: 'NO CHANGE — "Josh Jennings" is a nonessential appositive, correctly set off by a pair of commas.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-unnecessary-comma',
      kind: 'worked_example',
      problem:
        'In the passage: "The volunteers, who arrived early, sorted, the donated coats by size." Which comma in this sentence should be deleted?',
      steps: [
        'Check each comma against a rule, one at a time. Commas 1 and 2 set off "who arrived early" — a nonessential clause. That pair is correctly used.',
        'Comma 3 sits between the verb "sorted" and its direct object, "the donated coats."',
        'RULE: a verb is never separated from its direct object by a single, unpaired comma — there is no rule that puts a comma there.',
        'This is the ACT\'s favorite trap: a comma that "feels" like a natural pause but has no grammatical job. Delete comma 3.',
      ],
      answer: 'Delete the comma after "sorted" — a verb should never be separated from its direct object by a comma.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-comma-splice',
      kind: 'try_yourself',
      problem:
        'In the sentence "The bakery closed at six, the line still stretched around the block," which choice correctly punctuates the underlined portion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE — "six, the line"' },
        { id: 'b', text: '"six; the line"', correct: true },
        { id: 'c', text: '"six the line" (no punctuation)' },
        { id: 'd', text: '"six, and, the line"' },
      ],
      expectedAnswer: '"six; the line"',
      hints: [
        'Check whether each side of the punctuation mark could stand alone as its own complete sentence.',
        'A comma by itself can never join two independent clauses — that\'s a comma splice. A semicolon can.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-apostrophe',
      kind: 'try_yourself',
      problem:
        'In the sentence "The committee reviewed each applicant\'s portfolio before making ITS final decision," is "ITS" correct as written?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE — "its"', correct: true },
        { id: 'b', text: '"it\'s"' },
        { id: 'c', text: '"its\'"' },
        { id: 'd', text: '"their"' },
      ],
      expectedAnswer: 'NO CHANGE — "its"',
      hints: [
        'Try substituting "it is" for the underlined word — does the sentence still make sense?',
        '"Its" (no apostrophe) is possessive; "it\'s" (with apostrophe) is a contraction for "it is." "Committee" is being treated as a single body ("it"), not "they."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-restrictive-clause',
      kind: 'try_yourself',
      problem:
        'In the sentence "Students, who finish the exam early, may leave the room quietly," should the commas around "who finish the exam early" stay?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE — keep both commas' },
        { id: 'b', text: 'Delete both commas', correct: true },
        { id: 'c', text: 'Keep only the first comma' },
        { id: 'd', text: 'Keep only the second comma' },
      ],
      expectedAnswer: 'Delete both commas',
      hints: [
        'Remove the clause "who finish the exam early" — does the sentence still say the same thing about which students may leave?',
        'A clause that narrows down WHICH students are meant (restrictive/essential) takes no commas at all — only nonessential clauses get commas.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fanboys-comma',
      kind: 'misconception_check',
      question:
        'A student rewrites "She proofread the essay and submitted it before the deadline" as "She proofread the essay, and submitted it before the deadline." What went wrong?',
      commonErrors: [
        {
          answer: 'Adding a comma before "and"',
          misconception: 'Treating every FANBOYS word as an automatic comma trigger, regardless of what follows it.',
          correctsTo:
            'A comma before a FANBOYS conjunction is only needed when BOTH sides are independent clauses. Here, "and submitted it before the deadline" has no subject of its own — it\'s just the second half of a compound verb ("proofread... and submitted..."), so no comma belongs there. Test each side: can it stand alone as a full sentence? If not, skip the comma — this is the #1 unnecessary-comma trap on the ACT.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Nonessential info (appositives, extra clauses) gets a PAIR of commas or dashes; essential/restrictive info gets NONE — that\'s the #1 trap the ACT sets.',
        'A comma alone can never join two independent clauses — use a semicolon, a period, or a comma plus a FANBOYS conjunction instead.',
        'Apostrophes show possession or mark a missing letter (contraction) — never a plain plural. "Its" (possessive) vs. "it\'s" (it is).',
        'A colon or a single introductory dash must be preceded by a complete independent clause: ask "could everything before this mark stand alone as a sentence?"',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Punctuation: Commas, Apostrophes, Colons & Dashes' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
