/**
 * Digital SAT — Reading & Writing: Boundaries (Standard English Conventions).
 *
 * The single highest-frequency skill in the digital SAT's Standard English
 * Conventions domain: punctuating the boundary where one clause meets
 * another. Focus on the mechanical test that resolves nearly every item —
 * is each side of the blank a complete sentence or not? — and the four
 * classic traps: the comma splice, the run-on, the semicolon-with-a-
 * fragment, and the colon-with-a-fragment.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U8_BOUNDARIES: LessonPlan = {
  id: 'evelyn.testprep.dsat.boundaries.v1',
  title: 'Boundaries: Punctuation Between & Within Sentences',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.boundaries',
      standard: 'DSAT-8.1',
      description:
        'Correctly punctuate the boundary between independent and dependent clauses, choosing among period, semicolon, colon, and comma+FANBOYS while avoiding comma splices, run-ons, and fragments.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Boundaries as the single highest-frequency skill on SAT R&W — worth more raw points than any other individual Standard English Conventions skill.',
      script:
        'Standard English Conventions makes up roughly a quarter of the 54 Reading and Writing questions, and Boundaries — punctuating where one clause meets another — is the single biggest skill inside it, typically 6 to 8 questions a test. It rewards pure pattern recognition: is each side of the blank a complete sentence or not? Learn that one test and Boundaries becomes close to free points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-boundaries',
      kind: 'concept',
      goal: 'The four correct ways to join clauses, the four classic SAT traps, and the independent-vs-dependent test that resolves nearly every Boundaries item.',
      keyIdeas: [
        'THE CORE TEST — for every Boundaries item, isolate what is on each side of the blank and ask: does it have a subject and a verb, and could it stand alone as its own sentence? That answer (independent clause, dependent clause, or fragment) determines which punctuation marks are even eligible.',
        'TWO INDEPENDENT CLAUSES — four correct joins: (1) period, (2) semicolon, (3) comma + a FANBOYS conjunction (for, and, nor, but, or, yet, so), (4) colon, ONLY when the second clause explains, defines, or elaborates the first.',
        'TRAP 1 — COMMA SPLICE. Two independent clauses joined by a comma ALONE, with no conjunction: "The lab results were inconclusive, the team ran the test again." WRONG. This is the single most common wrong-answer trap on Boundaries items.',
        'TRAP 2 — RUN-ON. Two independent clauses with NO punctuation at all between them. Always wrong, even when the sentence reads smoothly aloud.',
        'TRAP 3 — SEMICOLON OR COLON WITH A FRAGMENT. Both marks require a genuine independent clause immediately BEFORE them. "Although the results were inconclusive; the team ran the test again." WRONG — the left side starts with "Although," making it dependent, not independent, so the semicolon has nothing complete to attach to.',
        'DEPENDENT + INDEPENDENT — subordinating conjunctions (although, because, since, while, when, if, unless...) open a dependent clause. Dependent-clause-FIRST needs a comma before the independent clause that follows: "Although the results were inconclusive, the team retested." Independent-clause-first with the subordinator in the middle usually takes NO comma: "The team retested because the results were inconclusive."',
        'TRAP 4 — SEMICOLON + CONJUNCTION. A semicolon is never immediately followed by a coordinating conjunction like "and" or "but" — that combination is nonstandard. Pick one mark or the other, not both.',
        'COLON PRECISION — a colon needs a complete independent clause before it (never after an incomplete verb phrase like "The recipe requires:"), and what follows can be a list, a single word, or an explanation — it does not itself need to be independent.',
      ],
      vocabulary: [
        { term: 'independent clause', definition: 'a group of words with a subject and a verb that can stand alone as a complete sentence.' },
        { term: 'dependent clause', definition: 'a clause that opens with a subordinating word (although, because, since, while...) and cannot stand alone.' },
        { term: 'comma splice', definition: 'the error of joining two independent clauses with only a comma and no conjunction.' },
        { term: 'run-on sentence', definition: 'two independent clauses joined with no punctuation at all.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-independent-independent',
      kind: 'worked_example',
      problem:
        'Choose the punctuation that correctly completes the sentence: "City engineers spent three years redesigning the aging bridge ___ the new structure now handles twice the daily traffic without any added support columns." (A) , (comma alone) (B) ; (semicolon) (C) : (colon) (D) [no punctuation]',
      steps: [
        'Left side: "City engineers spent three years redesigning the aging bridge" — subject "engineers," verb "spent" — a complete, independent clause.',
        'Right side: "the new structure now handles twice the daily traffic without any added support columns" — subject "structure," verb "handles" — also independent.',
        'Two independent clauses need a period, a semicolon, a comma + FANBOYS, or (if the second explains the first) a colon.',
        '(A) comma alone is a comma splice — wrong. (D) no punctuation is a run-on — wrong. (C) colon is wrong because the second clause is not explaining or defining anything about "the bridge" — it is a new, separate fact, not an elaboration.',
        '(B) semicolon correctly joins the two closely related independent statements.',
      ],
      answer: '(B) semicolon',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-dependent-independent',
      kind: 'worked_example',
      problem:
        'Choose the punctuation that correctly completes the sentence: "Although the observatory\'s new telescope can resolve details ten times sharper than its predecessor ___ astronomers can now map craters on asteroids more than a hundred million miles away." (A) , (comma) (B) ; (semicolon) (C) : (colon) (D) [no punctuation]',
      steps: [
        'Left side opens with "Although" — a subordinating conjunction — so even though it has a subject ("telescope") and a verb ("can resolve"), it is a DEPENDENT clause. It cannot stand alone.',
        'Right side: "astronomers can now map craters on asteroids more than a hundred million miles away" — independent.',
        'This is a dependent-clause-first + independent-clause-second sentence, which takes a comma after the dependent clause — not the two-independent-clause rule.',
        '(B) semicolon is wrong — a semicolon needs an independent clause on BOTH sides, and the left side is dependent (the fragment trap). (C) colon is wrong for the same reason: it also needs a complete clause before it. (D) no punctuation fuses the two halves together incorrectly.',
        '(A) comma is correct — the standard introductory-dependent-clause comma.',
      ],
      answer: '(A) comma',
      estimatedMinutes: 3,
    },
    {
      id: 'try-independent-independent',
      kind: 'try_yourself',
      problem:
        'Which choice completes the text so that it conforms to the conventions of Standard English? "During her summer internship, Maria digitized nearly two thousand handwritten field notes from a 1930s botanical expedition. The notes revealed a wildflower migration route no researcher had mapped before ___ her supervisor now cites the discovery in every guest lecture."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'mapped before, her supervisor' },
        { id: 'b', text: 'mapped before; her supervisor', correct: true },
        { id: 'c', text: 'mapped before her supervisor' },
        { id: 'd', text: 'mapped before: her supervisor' },
      ],
      expectedAnswer: 'mapped before; her supervisor',
      hints: [
        'Check whether each side of the blank is a complete sentence on its own — subject, verb, able to stand alone.',
        'Two independent clauses need a period, semicolon, or comma+FANBOYS — not a comma alone (splice) and not zero punctuation (run-on). The second clause here does not define or explain "migration route," so a colon does not fit either.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-dependent-independent',
      kind: 'try_yourself',
      problem:
        'Which choice completes the text so that it conforms to the conventions of Standard English? "Coastal engineers have spent two years reinforcing the seawall with a new composite material. Although early tests showed the material cracking in freezing temperatures ___ the redesigned mixture now withstands three times the stress of the original concrete."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'temperatures, the redesigned', correct: true },
        { id: 'b', text: 'temperatures; the redesigned' },
        { id: 'c', text: 'temperatures the redesigned' },
        { id: 'd', text: 'temperatures: the redesigned' },
      ],
      expectedAnswer: 'temperatures, the redesigned',
      hints: [
        'Look at the word that opens the first half of the sentence — does "Although" let that half stand alone?',
        'An introductory dependent clause takes a comma before the independent clause that follows it — not a semicolon or colon, both of which require a complete sentence on each side.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-semicolon-conjunction-trap',
      kind: 'try_yourself',
      problem:
        'Which choice completes the text so that it conforms to the conventions of Standard English? "The delivery drone lost signal contact halfway through its route over the canyon. Emergency protocols kicked in immediately ___ the drone still completed a safe, automated landing near the trailhead."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'immediately, but the drone', correct: true },
        { id: 'b', text: 'immediately the drone' },
        { id: 'c', text: 'immediately; but the drone' },
        { id: 'd', text: 'immediately, the drone' },
      ],
      expectedAnswer: 'immediately, but the drone',
      hints: [
        'Both halves are independent clauses, and the second one contrasts with the first ("still completed a safe landing" despite the emergency) — which conjunction signals contrast?',
        'A semicolon is never directly followed by a coordinating conjunction like "but" — that combination is nonstandard. And a comma with no conjunction at all is a splice.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-because-comma',
      kind: 'misconception_check',
      question:
        'A student always places a comma right before the word "because" whenever it shows up mid-sentence, writing: "The bridge closed, because the inspectors found a crack in a support beam." Is the comma correct?',
      commonErrors: [
        {
          answer: 'Yes — "because" always needs a comma before it.',
          misconception:
            'Treating every subordinating conjunction as an automatic comma trigger, instead of checking clause ORDER.',
          correctsTo:
            'No — when the independent clause comes FIRST and the dependent clause (because/although/since/etc.) comes SECOND, no comma is needed: "The bridge closed because the inspectors found a crack." The comma-before-dependent-clause rule only applies when the dependent clause comes first: "Because the inspectors found a crack, the bridge closed."',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two independent clauses: period, semicolon, comma+FANBOYS, or (only if the second explains the first) a colon. A comma alone is a splice; no mark at all is a run-on.',
        'Semicolons and colons both require a complete independent clause immediately BEFORE the mark — a dependent clause or fragment there is always wrong.',
        'Dependent clause + independent clause (in that order) takes a comma after the dependent clause; flip the order and the comma usually disappears.',
        'Read each side of the blank as its own sentence and ask: complete, or not? That single test resolves almost every Boundaries question.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Boundaries: Punctuation Between & Within Sentences' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
