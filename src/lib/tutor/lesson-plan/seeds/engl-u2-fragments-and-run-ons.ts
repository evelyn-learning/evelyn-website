/**
 * HS English — Grammar & Usage: Fragments, Run-Ons & Comma Splices.
 *
 * The sentence-boundary skill every other writing move depends on
 * (CCSS L.9-10.1, L.9-10.2): test whether each side of a punctuation mark
 * is an independent clause, then choose a legal join. Every practice item
 * is a revision-choice or error-spot MCQ over original prose.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U2_FRAGMENTS_AND_RUN_ONS: LessonPlan = {
  id: 'evelyn.hs.engl.fragments-and-run-ons.v1',
  title: 'Fragments, Run-Ons & Comma Splices',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.fragments-and-run-ons',
      standard: 'ENGL-2.3',
      description:
        'Recognize and repair sentence fragments, run-on (fused) sentences, and comma splices by testing whether each side of a punctuation mark is an independent clause and then choosing a legal join (CCSS L.9-10.1, L.9-10.2).',
    },
  ],
  prerequisites: ['engl.sentence-types-combining'],
  followUps: ['engl.modifiers-and-parallelism'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Sentence boundaries decide whether a reader follows the idea — frame the skill as control over pacing and clarity in real writing.',
      script:
        'Every message you send builds a small argument: an email asking a teacher to reopen a portal, a caption under a photo you want people to actually read, a paragraph of a college essay that has to land in one breath. Where you end a sentence is how you tell the reader where one idea stops and the next begins. Put the break in the wrong place and a sharp thought reads as a stumble: "The interview went well, I got the internship." Today you get one test that settles every boundary question, plus the four legal ways to join two complete thoughts, so you can control the rhythm of your own writing on purpose.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-independent-clause-test',
      kind: 'concept',
      goal: 'The independent-clause test, the three boundary errors, and the traps that hide them.',
      keyIdeas: [
        'THE TEST — an independent clause has a subject and a verb and could stand alone as its own sentence. Before you touch any punctuation mark, cover one side with your hand and ask: "Would I send this by itself?" That single question resolves nearly every boundary decision.',
        'FOUR LEGAL JOINS — two independent clauses may be joined in exactly four ways: (1) a period, making two sentences, (2) a semicolon, (3) a comma plus a FANBOYS conjunction (for, and, nor, but, or, yet, so), (4) a colon, but only when the second clause explains or delivers on the first.',
        'FRAGMENT — a word group punctuated like a sentence that cannot stand alone. Most fragments are dependent clauses opening with a subordinator such as when, although, because, since, while, which, or who. WRONG: "Because the rehearsal ran two hours long." CORRECT: "Because the rehearsal ran two hours long, we skipped the last scene." Other fragments are stranded phrases with no verb at all, or a verb ending in -ing with no helper: WRONG: "Running the sound board for the whole show." Attach it or give it a subject and a real verb.',
        'RUN-ON (FUSED SENTENCE) — two independent clauses jammed together with no punctuation and no conjunction. WRONG: "The interview went well I got the internship." Fix it with any of the four legal joins. CORRECT: "The interview went well, and I got the internship."',
        'COMMA SPLICE — two independent clauses joined by a comma ALONE. WRONG: "The interview went well, I got the internship." This is the most common boundary error in student writing because the comma feels like a pause and the sentence sounds fine aloud. A comma is never strong enough on its own to hold two complete thoughts together.',
        'TRAP — CONJUNCTIVE ADVERBS. Words like however, therefore, moreover, consequently, and instead do the meaning-work of a conjunction but do not have the grammar-power of one. WRONG: "Ticket sales doubled, however, the club still lost money." CORRECT: "Ticket sales doubled; however, the club still lost money." Semicolon before, comma after.',
        'TRAP — LENGTH IS NOT THE TEST. Count clauses, not words. A long sentence carrying one independent clause plus modifying phrases is perfectly correct, and a four-word sentence can still be a fragment. Do not break a sentence in half just because it feels long.',
        'STYLE NOTE — a deliberate fragment can work in fiction, dialogue, or a punchy caption ("No warning. Just rain."). The difference between craft and error is intent, and academic writing gives you very little room to claim it, so in essays and analysis keep every sentence complete.',
      ],
      vocabulary: [
        { term: 'independent clause', definition: 'a word group with a subject and a verb that expresses a complete thought and could stand alone as a sentence.' },
        { term: 'dependent clause', definition: 'a word group with a subject and a verb that cannot stand alone because it opens with a subordinator such as when, although, because, or which.' },
        { term: 'comma splice', definition: 'the error of joining two independent clauses with a comma and no conjunction.' },
        { term: 'FANBOYS', definition: 'the coordinating conjunctions that may follow a comma to join two independent clauses: for, and, nor, but, or, yet, so.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-comma-splice',
      kind: 'worked_example',
      problem:
        'A student turns in this line in a personal narrative: "The gym smelled like floor polish and nerves, my name was third on the callback list." Diagnose the boundary and revise it.',
      steps: [
        'Cover the right side and read the left alone: "The gym smelled like floor polish and nerves." Subject "gym", verb "smelled" — that stands alone. Independent clause.',
        'Now cover the left and read the right: "My name was third on the callback list." Subject "name", verb "was" — that stands alone too. Independent clause.',
        'Two independent clauses are held together here by a comma and nothing else. That is a comma splice, and it is WRONG no matter how natural the pause sounds when read aloud.',
        'Choose from the four legal joins based on the effect you want. A period gives two clipped beats. A semicolon keeps the two images tightly linked without spelling out the relationship, which suits a narrative that is building tension.',
        'CORRECT: "The gym smelled like floor polish and nerves; my name was third on the callback list." A comma plus "and" would also be correct, just softer.',
      ],
      answer:
        'Comma splice — revise to "The gym smelled like floor polish and nerves; my name was third on the callback list."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-however-trap',
      kind: 'worked_example',
      problem:
        'A student notices a run-on in a draft and tries to repair it. Original: "The fundraiser sold out in a day the club still finished the season short on money." The student revises to: "The fundraiser sold out in a day, however, the club still finished the season short on money." Is the revision correct?',
      steps: [
        'Diagnose the original first: "The fundraiser sold out in a day" stands alone, and "the club still finished the season short on money" stands alone. Two independent clauses with no punctuation at all between them — a run-on, or fused sentence.',
        'Now test the revision the same way. The two clauses are unchanged, so both sides are still independent. The only new material is the comma and the word "however".',
        'Here is the trap: "however" means what "but" means, so it feels like it should do the same grammatical job. It cannot. "However" is a conjunctive adverb, not one of the FANBOYS conjunctions, so a comma in front of it does not license the join.',
        'The revision therefore trades a run-on for a comma splice. WRONG: "The fundraiser sold out in a day, however, the club still finished the season short on money."',
        'Fix it with a mark strong enough to stand between two complete thoughts. CORRECT: "The fundraiser sold out in a day; however, the club still finished the season short on money." Equally correct: "The fundraiser sold out in a day, but the club still finished the season short on money."',
      ],
      answer:
        'No — the revision is still a comma splice. Use "sold out in a day; however, the club..." or "sold out in a day, but the club...".',
      estimatedMinutes: 3,
    },
    {
      id: 'try-comma-splice',
      kind: 'try_yourself',
      problem:
        'Which revision fixes the sentence? "The bakery on Third Street closes at noon on Sundays, we got there twenty minutes too late."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The bakery on Third Street closes at noon on Sundays, and we got there twenty minutes too late.', correct: true },
        { id: 'b', text: 'The bakery on Third Street closes at noon on Sundays we got there twenty minutes too late.' },
        { id: 'c', text: 'The bakery on Third Street closes at noon on Sundays, however, we got there twenty minutes too late.' },
        { id: 'd', text: 'The bakery on Third Street closes at noon on Sundays, we got there, twenty minutes too late.' },
      ],
      expectedAnswer:
        'The bakery on Third Street closes at noon on Sundays, and we got there twenty minutes too late.',
      hints: [
        'Cover each side of the comma and read it alone. If both halves could be sent as their own sentence, a comma by itself cannot hold them together.',
        'Two independent clauses need a period, a semicolon, or a comma plus a FANBOYS conjunction. Deleting the comma only turns the splice into a run-on, and "however" is not a FANBOYS conjunction.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-fragment',
      kind: 'try_yourself',
      problem:
        'Which revision fixes the fragment? "Although the interview lasted only nine minutes. The manager offered her the weekend shift on the spot."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Although the interview lasted only nine minutes, the manager offered her the weekend shift on the spot.', correct: true },
        { id: 'b', text: 'Although the interview lasted only nine minutes; the manager offered her the weekend shift on the spot.' },
        { id: 'c', text: 'Although the interview, lasted only nine minutes. The manager offered her the weekend shift on the spot.' },
        { id: 'd', text: 'Although the interview lasted only nine minutes the manager offered her the weekend shift on the spot.' },
      ],
      expectedAnswer:
        'Although the interview lasted only nine minutes, the manager offered her the weekend shift on the spot.',
      hints: [
        'Read the first group alone: "Although the interview lasted only nine minutes." Does it finish the thought, or leave you waiting for the rest?',
        'The word "Although" makes that clause dependent, so it must attach to the independent clause that follows. A semicolon will not work, because a semicolon needs a complete sentence on its left.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-correct',
      kind: 'try_yourself',
      problem: 'Which sentence is punctuated correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The volunteers repainted the mural over spring break, and the neighborhood council covered the cost of the supplies.', correct: true },
        { id: 'b', text: 'The volunteers repainted the mural over spring break the neighborhood council covered the cost of the supplies.' },
        { id: 'c', text: 'The volunteers repainted the mural over spring break, the neighborhood council covered the cost of the supplies.' },
        { id: 'd', text: 'While the volunteers repainted the mural over spring break. The neighborhood council covered the cost of the supplies.' },
      ],
      expectedAnswer:
        'The volunteers repainted the mural over spring break, and the neighborhood council covered the cost of the supplies.',
      hints: [
        'Three of these commit one of the three boundary errors. Test both halves of each option: independent, or not?',
        'Option b fuses two independent clauses with no mark at all, option c joins them with a comma alone, and option d strands a "While" clause as its own sentence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-length',
      kind: 'misconception_check',
      question:
        'A student reads this sentence, decides it is far too long to be legal, and splits it in half with a period: "The film club, after screening more than forty short documentaries submitted by students across three districts, chose six finalists for the spring showcase." What went wrong?',
      commonErrors: [
        {
          answer: 'It is a run-on because it goes on too long, so it needs to be broken into two sentences.',
          misconception: 'Using sentence LENGTH as the test for a boundary error instead of counting independent clauses.',
          correctsTo:
            'Length is irrelevant — count independent clauses. This sentence has exactly one: "The film club chose six finalists for the spring showcase." Everything between the commas is a modifying phrase with no subject-verb pair of its own, so there is no second clause to separate. Splitting it would actually CREATE a fragment: "After screening more than forty short documentaries submitted by students across three districts." One independent clause, however long, is never a run-on.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cover each side of the punctuation and ask "would I send this by itself?" — that independent-clause test settles nearly every boundary question.',
        'Two independent clauses take a period, a semicolon, a comma plus FANBOYS, or a colon when the second explains the first. A comma alone is a comma splice; no mark at all is a run-on.',
        'A fragment is usually a dependent clause (when, although, because, which) punctuated as a sentence — attach it to the independent clause beside it, or drop the subordinator.',
        'However, therefore, and moreover take a semicolon before and a comma after; and length is never the test — count clauses, not words.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Fragments, Run-Ons & Comma Splices' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
