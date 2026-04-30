/**
 * SAT — Writing & Language: Grammar and usage rules.
 *
 * The SAT Writing section is rule-based. Students who know the rules
 * can rule-check each answer choice and eliminate quickly. Six
 * highest-frequency rules: subject-verb agreement, pronoun
 * agreement, parallel structure, comma rules, modifier placement,
 * and sentence-vs-fragment.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_WRITING_GRAMMAR: LessonPlan = {
  id: 'evelyn.testprep.sat.writing.grammar.v1',
  title: 'SAT Writing: Grammar Rules',
  curriculum: 'SAT',
  grade: '11',
  subject: 'test-prep',
  topic: 'sat-writing',
  locale: 'en',
  los: [
    {
      id: 'sat.writing.grammar',
      description: 'Apply core grammar and usage rules to SAT Writing & Language questions.',
    },
  ],
  prerequisites: ['ccss.ela.l.4.1.f'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Writing as a finite, learnable rule set.',
      script: 'The SAT Writing section is the most-coachable part of the test — it\'s a finite rule book. Master maybe 6 rules and you\'ll catch most errors in seconds. The trick: when you see an underlined phrase, mentally scan a quick checklist of what could be wrong instead of just "reading it for sound."',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-six-rules',
      kind: 'concept',
      goal: 'Six rules to scan: SVA, pronoun, parallel, commas, modifiers, fragments.',
      keyIdeas: [
        '1) SUBJECT-VERB AGREEMENT (SVA). Singular subject → singular verb; plural subject → plural verb. Watch for prepositional phrases between subject and verb that hide the real subject. "The basket of apples IS on the table" — basket is singular, even though "apples" is right next to the verb.',
        '2) PRONOUN AGREEMENT. A pronoun must match its antecedent in number and gender. "Every student should bring HIS OR HER book" (each = singular). "Students should bring THEIR books" (plural).',
        '3) PARALLEL STRUCTURE. Items in a list or comparison should have the same grammatical form. "She likes RUNNING, SWIMMING, and TO BIKE" → wrong. Make all gerunds: "running, swimming, and biking."',
        '4) COMMA RULES — five common uses:',
        '   - List: "apples, oranges, and pears."',
        '   - Compound sentence: ", and / but / or" between two independent clauses.',
        '   - After an introductory clause: "After dinner, we left."',
        '   - Around a non-essential clause: "My brother, who lives in Tokyo, called."',
        '   - DON\'T add a comma between subject and verb, or between verb and object.',
        '5) MODIFIER PLACEMENT. A descriptive phrase modifies the closest noun. "Walking to school, the rain started" — wrong: rain wasn\'t walking. Fix: "Walking to school, I noticed the rain start."',
        '6) FRAGMENTS / RUN-ONS / COMMA SPLICES. A fragment is missing a subject or verb. A run-on jams two independent clauses with no connector. A comma splice uses ONLY a comma to connect two independent clauses (need comma + FANBOYS or a semicolon).',
        'STRATEGY: when reading underlined text, ask "is the verb agreeing? is the pronoun matching? is everything parallel? is each comma justified? is the modifier next to its noun? is this a complete sentence?".',
      ],
      vocabulary: [
        { term: 'antecedent', definition: 'the noun a pronoun replaces.' },
        { term: 'parallel structure', definition: 'matching grammatical forms in a list or comparison.' },
        { term: 'modifier', definition: 'a word or phrase that describes another part of the sentence.' },
      ],
      suggestedTools: ['show_text', 'show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-sva',
      kind: 'worked_example',
      problem: 'Pick the correct verb: "The collection of vintage cars (is / are) on display."',
      steps: [
        'Identify the subject. "The COLLECTION" — singular, even though "vintage cars" is plural.',
        'Prepositional phrase "of vintage cars" is hiding next to the verb but is NOT the subject.',
        'Singular subject → singular verb → IS.',
        'Sentence: "The collection of vintage cars IS on display."',
      ],
      answer: 'is',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-parallel',
      kind: 'worked_example',
      problem: 'Fix the parallel structure: "Maya enjoys hiking, swimming, and to read books."',
      steps: [
        'Items in the list: hiking (gerund), swimming (gerund), to read books (infinitive). NOT parallel.',
        'Match all to gerund: "hiking, swimming, and READING books."',
        'Or all to infinitive: "to hike, to swim, and to read books."',
        'Either works as long as all three match.',
      ],
      answer: '"...hiking, swimming, and reading books."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which is correct: (a) "Each of the players have their own jersey." (b) "Each of the players has their own jersey." (c) "Each of the players has his or her own jersey."',
      expectedAnswer: 'c',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(a) — sounds natural' },
        { id: 'b', text: '(b) — singular verb fixed' },
        { id: 'c', text: '(c) — singular verb AND singular pronoun', correct: true },
      ],
      hints: [
        '"Each" is SINGULAR. So both the verb AND the pronoun should be singular.',
        '(a) gets both wrong. (b) gets verb right but pronoun wrong. (c) gets both.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-comma-pause',
      kind: 'misconception_check',
      question: 'Sage adds commas wherever she\'d "naturally pause" when reading aloud. Is that a reliable rule?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Using "pause when reading" as a comma rule.',
          correctsTo: 'Unreliable. Some pauses don\'t need commas (subject-verb pause), and some commas don\'t involve pauses. Use the FIVE structural rules: list, compound clause, intro clause, non-essential clause, NOT between subject/verb. The SAT will exploit "sounds natural" with comma traps.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Six rules: subject-verb agreement, pronoun, parallel, commas, modifiers, fragments.',
        'SVA trap: prepositional phrase between subject and verb hides the real subject.',
        'Parallel: same grammatical form in lists.',
        'Commas: list, compound, intro, non-essential — NOT between subject and verb.',
        'Modifier: must sit next to the thing it modifies.',
        'Don\'t use "pause-when-speaking" as a comma rule.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find the error: "Walking down the street, my keys fell out of my pocket."',
      hint: 'Modifier issue: "Walking down the street" implies "my keys" were walking. Fix: "Walking down the street, I dropped my keys" — make the subject be the one walking.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
