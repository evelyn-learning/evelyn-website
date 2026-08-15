/**
 * HS English — Grammar & Usage: Semicolons & Colons.
 *
 * The two marks students avoid because nobody ever showed them the rule
 * (CCSS L.9-10.2a): a semicolon joins two complete sentences that belong
 * together (and separates list items that already contain commas), while
 * a colon needs a complete clause in front of it and then points forward
 * to a list, an explanation, or an elaboration. Both marks fail the same
 * way — something incomplete on the left. Every excerpt below is
 * original; every practice item is a revision-choice MCQ.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U3_SEMICOLONS_AND_COLONS: LessonPlan = {
  id: 'evelyn.hs.engl.semicolons-and-colons.v1',
  title: 'Semicolons & Colons',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.semicolons-and-colons',
      standard: 'ENGL-3.2',
      description:
        'Use a semicolon to link closely related independent clauses (including clauses joined by a conjunctive adverb) and to separate list items that already contain commas, and use a colon after a complete independent clause to introduce a list, an explanation, or an elaboration (CCSS L.9-10.2, L.9-10.2a).',
    },
  ],
  prerequisites: ['engl.commas'],
  followUps: ['engl.apostrophes-and-possessives'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe the semicolon and colon as tools that control emphasis and momentum in real writing, not as decoration only fancy writers are allowed to use.',
      script:
        'Most people write their whole lives using two marks: the comma and the period. That is like playing an instrument with two notes. Compare these three versions of the same idea. "The audition was Friday. I had not practiced." Two flat, separate facts. "The audition was Friday; I had not practiced." Now the second half lands as a consequence of the first, and the reader feels the drop. "One problem stood between me and that stage: I had not practiced." Now the sentence builds to the confession and stops on it. Same words, three different effects. The semicolon and the colon are how a writer controls momentum in an email, a story, a caption, or a college essay, and each one runs on exactly one rule about what has to sit to its left. Today you learn both rules, and the two errors that show up the moment a writer guesses.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-semicolon-colon-rules',
      kind: 'concept',
      goal: 'The complete-clause test that governs both marks, the jobs each mark does, and the classic errors that follow from placing them by feel.',
      keyIdeas: [
        'THE ONE TEST BOTH MARKS SHARE — cover everything to the LEFT of the mark and read it aloud. If it cannot stand alone as its own sentence, neither a semicolon nor a colon is allowed there. That single test catches most semicolon and colon errors before they happen.',
        'SEMICOLON JOB 1: JOINING TWO COMPLETE SENTENCES — a semicolon links two independent clauses whose ideas belong together: "The gym flooded on Thursday; the tournament moved to the middle school." Both sides must be able to stand alone. A semicolon is roughly a soft period, so it says to the reader: these two statements are one thought.',
        'SEMICOLON JOB 2: TRANSITION WORDS BETWEEN CLAUSES — words such as however, therefore, moreover, instead, in fact, and for example are conjunctive adverbs, not conjunctions. When one of them opens the second complete sentence, put a semicolon BEFORE it and a comma AFTER it: "The recipe called for buttermilk; however, we used yogurt instead."',
        'SEMICOLON JOB 3: THE SUPER-COMMA LIST — when the items in a list already contain commas of their own, upgrade the dividers between items to semicolons so the reader can tell where each item ends: "Our exchange partners came from Lima, Peru; Osaka, Japan; and Cork, Ireland."',
        'COLON JOB: A COMPLETE CLAUSE THAT POINTS FORWARD — a colon requires a full independent clause on its left, and then introduces what the clause has promised: a list, an explanation, an elaboration, or a single emphatic word. "The kit contained everything we needed: rope, chalk, and a headlamp." "She finally admitted the real reason: she had never wanted the job."',
        'THE RIGHT SIDE OF A COLON IS FREE — unlike a semicolon, a colon does not care whether what follows it is a complete sentence. A list, a phrase, or one word is all fine. The demand is entirely on the LEFT side.',
        'ERROR A: SEMICOLON BEFORE A FRAGMENT — the most common semicolon mistake is using it where the second half cannot stand alone. WRONG: "We repainted the whole set on Saturday; hoping the paint would dry by opening night." The words after the semicolon have no subject. CORRECT: "We repainted the whole set on Saturday, hoping the paint would dry by opening night." A dependent opener breaks it from the other direction. WRONG: "Because the bus broke down; we missed the first hour." CORRECT: "Because the bus broke down, we missed the first hour."',
        'ERROR B: COLON AFTER AN INCOMPLETE CLAUSE — writers drop a colon in the middle of a sentence right where the list starts, which leaves a dangling verb or preposition on the left. WRONG: "The three things I packed were: sunscreen, a paperback, and my sketchbook." WRONG: "We stopped for supplies such as: batteries and tape." CORRECT: "I packed three things: sunscreen, a paperback, and my sketchbook." Either delete the colon or finish the clause before it. Also remember that a semicolon is never followed directly by and, but, or so — choose one mark or the conjunction, not both.',
      ],
      vocabulary: [
        { term: 'independent clause', definition: 'a group of words with a subject and a verb that can stand alone as a complete sentence.' },
        { term: 'conjunctive adverb', definition: 'a transition word such as however, therefore, moreover, or instead that connects ideas but cannot join two clauses the way and or but can.' },
        { term: 'super-comma', definition: 'a semicolon used to divide list items that already contain commas inside them.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-semicolon-vs-colon',
      kind: 'worked_example',
      problem:
        'Which mark belongs in the blank, a semicolon or a colon? "The darkroom rule was posted on the door in red marker ___ nobody opens this door while the light is on."',
      steps: [
        'Cover everything to the left of the blank and read it: "The darkroom rule was posted on the door in red marker." Subject "rule", verb "was posted" — a complete independent clause. Both marks are therefore eligible, so the test alone does not decide it.',
        'Now read the right side: "nobody opens this door while the light is on." That is also a complete sentence, which keeps the semicolon in play.',
        'Ask what the right side is DOING for the left side. The left side promises a rule and does not say what it is; the right side delivers exactly that rule. That is elaboration, not a separate related fact.',
        'A semicolon would be grammatically legal but would flatten the sentence into two equal statements. The colon is the better choice because it makes the left side point forward and lets the rule land at the end.',
        'CORRECT: "The darkroom rule was posted on the door in red marker: nobody opens this door while the light is on." Note that the right side of a colon may be a full sentence, a list, or a single word — the colon never demands one shape.',
      ],
      answer:
        'A colon — the left side is a complete clause that promises a rule, and the right side delivers it: "The darkroom rule was posted on the door in red marker: nobody opens this door while the light is on."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fragment-traps',
      kind: 'worked_example',
      problem:
        'A student writes: "My favorite parts of the trip were: the ferry ride, the night market, and the walk back along the harbor; even though my shoes were soaked the whole time." Both marks were placed where the sentence felt like it paused. Are they correct?',
      steps: [
        'Test the colon first. Cover everything to its left: "My favorite parts of the trip were". Subject "parts", verb "were" — and then nothing. A linking verb with no complement is not a complete sentence, so the colon has nothing to attach to.',
        'There are two repairs. Delete the colon and let the list finish the sentence: "My favorite parts of the trip were the ferry ride, the night market, and the walk back along the harbor." Or finish the clause first and keep the colon: "Three parts of the trip stood out: the ferry ride, the night market, and the walk back along the harbor."',
        'Now test the semicolon. Cover everything to its right: "even though my shoes were soaked the whole time." That opens with the subordinator "even though", so it is a dependent clause and cannot stand alone. A semicolon needs a complete sentence on BOTH sides.',
        'The repair there is a comma, which is the normal mark before a trailing dependent clause.',
        'WRONG: "My favorite parts of the trip were: the ferry ride, the night market, and the walk back along the harbor; even though my shoes were soaked the whole time." CORRECT: "Three parts of the trip stood out: the ferry ride, the night market, and the walk back along the harbor, even though my shoes were soaked the whole time."',
      ],
      answer:
        'No — the colon sits after an incomplete clause and the semicolon sits before a dependent fragment. CORRECT: "Three parts of the trip stood out: the ferry ride, the night market, and the walk back along the harbor, even though my shoes were soaked the whole time."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-join-two-clauses',
      kind: 'try_yourself',
      problem:
        'Which choice correctly completes the sentence? "The last bus had already pulled away from the curb ___ we walked the two miles home in the rain."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'curb, we walked' },
        { id: 'b', text: 'curb; we walked', correct: true },
        { id: 'c', text: 'curb we walked' },
        { id: 'd', text: 'curb; and we walked' },
      ],
      expectedAnswer: 'curb; we walked',
      hints: [
        'Read each side of the blank on its own. Can each one stand alone as a complete sentence?',
        'Two complete sentences cannot be joined by a comma alone, and they cannot simply be run together. A semicolon joins them, but it is never followed directly by and, but, or so.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-colon-complete-clause',
      kind: 'try_yourself',
      problem: 'Which sentence is punctuated correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The audition list asked for three things: a monologue, a resume, and a headshot.', correct: true },
        { id: 'b', text: 'The audition list asked for: a monologue, a resume, and a headshot.' },
        { id: 'c', text: 'The things the audition list asked for were: a monologue, a resume, and a headshot.' },
        { id: 'd', text: 'The audition list asked for items such as: a monologue, a resume, and a headshot.' },
      ],
      expectedAnswer: 'The audition list asked for three things: a monologue, a resume, and a headshot.',
      hints: [
        'Cover the list in each option and read only what comes before the colon. Which version is already a complete sentence?',
        'A colon needs a full independent clause on its left. Endings like "asked for", "were", and "such as" leave the clause unfinished, so the colon has nothing to attach to.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-transition-and-super-comma',
      kind: 'try_yourself',
      problem: 'Which sentence is punctuated correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'We booked the venue in March, however, the deposit did not clear until June.' },
        { id: 'b', text: 'We booked the venue in March; however, the deposit did not clear until June.', correct: true },
        { id: 'c', text: 'We booked the venue in March however; the deposit did not clear until June.' },
        { id: 'd', text: 'We booked the venue in March: however the deposit did not clear until June.' },
      ],
      expectedAnswer: 'We booked the venue in March; however, the deposit did not clear until June.',
      hints: [
        'The word however is a transition word, not a conjunction like and or but, so it cannot hold two complete sentences together by itself.',
        'When a transition word opens the second complete sentence, the semicolon goes BEFORE it and a comma goes AFTER it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-semicolon-as-big-comma',
      kind: 'misconception_check',
      question:
        'A student describes the semicolon as a comma with extra weight, to be used whenever a sentence needs a longer pause, and writes: "We rehearsed the closing number six times; determined to get the timing right before Friday." Is the semicolon correct?',
      commonErrors: [
        {
          answer: 'Yes — the sentence needs a strong pause there, and a semicolon is stronger than a comma.',
          misconception: 'Treating the semicolon as a matter of pause length rather than as a mark that requires a complete sentence on each side.',
          correctsTo:
            'No — pause length is not the rule. Read the right side alone: "determined to get the timing right before Friday" has no subject and no main verb, so it is a fragment, and a semicolon requires a complete sentence on BOTH sides. CORRECT: "We rehearsed the closing number six times, determined to get the timing right before Friday." If the writer wants the weight of a semicolon, the fix is to make the second half stand alone: "We rehearsed the closing number six times; we were determined to get the timing right before Friday."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cover everything to the left of the mark: if it cannot stand alone as a sentence, neither a semicolon nor a colon is allowed there.',
        'A semicolon joins two COMPLETE sentences that belong together, and it also acts as a super-comma between list items that already contain commas.',
        'A transition word such as however or therefore takes a semicolon before it and a comma after it; a semicolon is never followed directly by and, but, or so.',
        'A colon needs a complete clause on its left and then points forward to a list, an explanation, or one emphatic word — and the right side never has to be a full sentence.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Semicolons & Colons' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
