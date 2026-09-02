/**
 * Grade 6 ELA — Text Structure, Author's Purpose & Comparing Accounts:
 * Comparing Two Authors' Accounts.
 *
 * CONCEPT-LED. Two authors can write about the exact same real event and
 * still write two different accounts of it, and neither one has to be wrong.
 * The whole lesson builds one way of reading: find the facts both accounts
 * state (the event itself), then name what each account adds that the other
 * leaves out (each writer's own choice about what to include, what to
 * emphasize, and how personal or how plain to sound). Three traps this plan
 * is built to kill: treating a detail one account leaves out as a mistake in
 * that account, assuming two accounts that emphasize different details must
 * be about two different events, and treating a difference in what is
 * included as proof that one account's facts are wrong.
 *
 * SCOPE GUARD: Grade 6 row 4.4 compares two authors' accounts of the SAME
 * real events, noting what each account includes and what each leaves out.
 * DELIBERATELY EXCLUDED: analyzing how an author's choice of evidence or
 * interpretation of a shared fact SHAPES the presentation — that is RI.7.9,
 * taught in the shipped m7ela-u4-comparing-two-texts.ts, which explicitly
 * has two authors draw opposite conclusions (one calls an added bus stop "a
 * delay," the other calls it "access") from one identical fact. This file
 * never asks a student to say what a fact MEANS, or to judge a choice a gain
 * or a loss; every pair of accounts in this file agrees on its shared facts
 * and differs only in what each one includes, leaves out, dwells on, or how
 * personal versus how plain each one sounds. Also excluded: sorting an
 * argument's claims into supported and unsupported (row 4.3 owns that), and
 * judging whether reasoning is sound or evidence is sufficient (RI.7.8,
 * Grade 7). DELIBERATELY ALLOWED, because row 4.3 sits immediately before
 * this one: the misconception check does ask a student to notice when two
 * accounts would genuinely clash on a stated fact, which brushes against
 * argument territory, but it stops at noticing whether two stated facts
 * clash and never asks the student to weigh whether either account's
 * reasoning holds up — that weighing belongs to row 4.3 and to RI.7.8.
 *
 * NOTE FOR FUTURE AUTHORS: every account in this file is original prose
 * written for the item — an invented letter, flyer, newsletter, program
 * report or newspaper item describing an invented specific event. This
 * course carries no passage machinery — no passageId, no shared texts — so
 * each item prints BOTH accounts inline, labeled Source A / Source B, and
 * must be solvable from those printed sentences alone. No published work is
 * quoted or paraphrased anywhere in this file. Every phrase this file puts
 * inside quotation marks in a step, hint or answer appears character-for-
 * character in the account excerpt above it; quote your own excerpt exactly,
 * never from memory.
 *
 * CLAIM LEDGER (informational passages): every excerpt in this file is an
 * invented informational account describing an invented specific event. None
 * of the five source pairs makes a claim about the real world beyond the
 * ordinary, non-statistical premise that schools, libraries and towns hold
 * park cleanups, food drives, concerts, reading challenges and bake sales.
 * What this ledger verifies instead is that, inside each pair, the two
 * accounts never state a fact that clashes with the other's, and it splits
 * each pair's EVENT FACT (true of the event, stated the same way by both
 * accounts) from its AUTHOR FRAMING (a detail or stance one account includes
 * that the other simply does not mention — a selection choice, not a claim
 * that can be right or wrong).
 *
 *   Claim                                        | Where          | Grounds
 *   [EVENT FACT] Twelve classmates cleaned up    | worked-1,      | Stipulated
 *   litter at Elm Street Park on a Saturday      | both sources   | scenario fact;
 *   morning.                                     |                | both invented
 *                                                 |                | accounts state
 *                                                 |                | it identically.
 *   [AUTHOR FRAMING] Source A adds how the       | worked-1       | Inclusion
 *   morning felt and the joke about the          |                | choice, not a
 *   strangest trash; Source B adds the bag       |                | checkable claim;
 *   count and the cleared picnic tables.         |                | consistent with
 *                                                 |                | the event fact.
 *   [EVENT FACT] The choir performed three       | worked-2,      | Stipulated
 *   songs at Thursday night's spring concert.    | both sources   | scenario fact;
 *                                                 |                | identical in
 *                                                 |                | both accounts.
 *   [AUTHOR FRAMING] Source A adds a singer's    | worked-2       | Inclusion
 *   nervousness and smile; Source B adds the     |                | choice; consistent
 *   number of students and the volunteers.       |                | with event fact.
 *   [EVENT FACT] Fairview Elementary held a      | try-1,         | Stipulated
 *   canned food drive during the last week of    | both sources   | scenario fact;
 *   October for the Riverside Food Pantry.       |                | identical in
 *                                                 |                | both accounts.
 *   [AUTHOR FRAMING] Source A adds that every    | try-1          | Inclusion
 *   classroom filled a box; Source B adds that   |                | choice; consistent
 *   one class filled three boxes, the most in    |                | with event fact.
 *   the school.                                  |                |
 *   [EVENT FACT] Oakview Library's summer        | try-2,         | Stipulated
 *   reading challenge ran for eight weeks this   | both sources   | scenario fact;
 *   year.                                        |                | identical in
 *                                                 |                | both accounts.
 *   [AUTHOR FRAMING] Source A adds a boy's       | try-2          | Inclusion
 *   eleven books and reading to the family dog;  |                | choice; consistent
 *   Source B adds the five-book rule and the     |                | with event fact.
 *   extended Saturday hours.                     |                |
 *   [EVENT FACT] The marching band held a bake   | try-3,         | Stipulated
 *   sale Saturday morning in the school parking  | both sources   | scenario fact;
 *   lot to raise money for new uniforms, and it  |                | both accounts
 *   ran four hours.                              |                | agree on it.
 *   [AUTHOR FRAMING] Source A adds the wind and  | try-3          | Inclusion
 *   the members who stayed the whole time;       |                | choice; consistent
 *   Source B adds the money raised toward new    |                | with event fact.
 *   uniforms.                                    |                |
 *   [EVENT FACT] The class trip to Miller's      | misconception  | Illustrative
 *   Orchard included picking apples; Account A   | question       | scenario for the
 *   adds lunch at picnic tables and Account B    |                | check itself, not
 *   adds a walk through the corn maze.           |                | a printed passage;
 *                                                 |                | both additions,
 *                                                 |                | no clash.
 *
 * No precise real-world statistic appears anywhere in this file. Quantities
 * inside the invented scenes (twelve classmates, eight trash bags, forty
 * students, three boxes, eleven books, four hours, about a third of the
 * uniforms) are specific details of a single invented occasion, not general
 * claims about the real world, so none of them needs a hedge.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U4_COMPARING_TWO_AUTHORS_ACCOUNTS: LessonPlan = {
  id: 'evelyn.ms.m6ela.comparing-two-authors-accounts.v1',
  title: 'Comparing Two Authors\' Accounts',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.comparing-two-authors-accounts',
      standard: 'M6ELA-4.4',
      description:
        'Compare and contrast how two authors present the same real events, noting what each account includes and what each leaves out, without yet analyzing how an author\'s choice of evidence or interpretation shapes the presentation (CCSS RI.6.9).',
    },
  ],
  prerequisites: ['m6ela.tracing-an-argument'],
  followUps: ['m6ela.pronoun-case'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that two true accounts of one event can still look different, and that different is not the same as wrong.',
      script:
        'Your class spends Saturday morning cleaning up the park. That night, two people write about it. One writes about how good the fall air felt and how everyone laughed about who found the strangest piece of trash. The other writes about how many bags got filled and how fast the group worked. Same morning, same park, same twelve classmates, and neither person made anything up. They just noticed different things and chose to write about different parts of the same morning. Today we learn how to line up two accounts of one event, find the facts they both agree on, and name exactly what each one adds that the other leaves out.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-comparing-two-accounts',
      kind: 'concept',
      goal: 'Install the method for comparing two accounts of one event: confirm the event matches, find the shared facts, then name each account\'s own additions.',
      keyIdeas: [
        'TWO ACCOUNTS, ONE EVENT. Before you compare anything, check that both accounts describe the same real event — the same day, the same place, the same happening. If the events do not match, there is nothing yet to compare.',
        'FIND THE SHARED FACTS FIRST. Make two lists, one for what each account says. The facts that appear on BOTH lists are the facts of the event itself, not any one writer\'s addition, and that is where a comparison starts.',
        'WHAT SITS ON ONLY ONE LIST IS THAT WRITER\'S CHOICE. Every account leaves things out — nobody prints everything that happened. A detail in one account that the other account does not mention is a choice about what to include, not an error.',
        'EMPHASIS IS WHAT AN ACCOUNT SPENDS ITS WORDS ON. One account might spend most of its sentences on how a moment felt. Another might spend most of its sentences on numbers, times and results. Both can be reporting the very same event.',
        'STANCE IS THE FEELING BEHIND THE WORDS. A personal letter or a diary entry often sounds warm and includes feelings. An official report or a newsletter item often sounds plain and sticks to facts and numbers. Neither stance makes an account more true than the other.',
        'DIFFERENT IS NOT THE SAME AS WRONG. Two accounts disagree only when they state facts that actually clash — one says the event happened on Saturday and the other says Sunday, for instance. Choosing different details to include, or writing with a different stance, is not a disagreement at all.',
      ],
      vocabulary: [
        { term: 'account', definition: 'a person\'s written report of something that happened.' },
        { term: 'shared fact', definition: 'a fact that both accounts of the same event state, part of the event itself rather than one writer\'s addition.' },
        { term: 'selection', definition: 'a writer\'s choice about which true details from an event to put in an account and which to leave out.' },
        { term: 'emphasis', definition: 'the detail or details an account spends the most words describing.' },
        { term: 'stance', definition: 'the attitude or feeling that comes through in how a writer describes an event, such as personal and warm or plain and factual.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-park-cleanup',
      kind: 'worked_example',
      problem:
        'Two accounts describe the same Saturday morning. Find the shared fact, then say what each account adds that the other leaves out.\n\nSource A (a classmate\'s note home): "On Saturday morning, twelve classmates cleaned up litter at Elm Street Park. Working in the cool fall air felt good, and by the end everyone was laughing about who had found the strangest piece of trash."\n\nSource B (the school\'s weekly newsletter): "On Saturday morning, twelve classmates cleaned up litter at Elm Street Park. The group filled eight trash bags in two hours and left every picnic table clear for the weekend."',
      steps: [
        'Check that both sources describe the same event before comparing anything else. Both open with the identical sentence: "On Saturday morning, twelve classmates cleaned up litter at Elm Street Park." Same day, same place, same group.',
        'Make two lists. Source A includes: the morning "felt good," and everyone "laughing about who had found the strangest piece of trash." Source B includes: the group "filled eight trash bags in two hours," and left "every picnic table clear for the weekend."',
        'Find the overlap. The shared fact, printed by both accounts word for word, is that twelve classmates cleaned up litter at Elm Street Park on Saturday morning. That is the event itself, the part neither account could leave out and still be about the same morning.',
        'Check for a conflict. Nothing on Source A\'s list contradicts anything on Source B\'s list. The morning can have "felt good" AND filled eight bags in two hours. Both sentences can be true of the same Saturday.',
        'Name what each source adds. Source A adds how the morning felt and the joke about the strangest trash. Source B adds the bag count, the time it took, and the cleared picnic tables. Source A leaves out the count. Source B leaves out the laughing. Neither omission makes the other account wrong.',
      ],
      answer:
        'Shared fact: twelve classmates cleaned up litter at Elm Street Park on Saturday morning. Source A adds how the morning felt and the joke about the strangest piece of trash; Source B adds the bag count, the two hours it took, and the cleared picnic tables. Neither account contradicts the other.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-choir-concert',
      kind: 'worked_example',
      problem:
        'Two accounts describe the same concert. Identify the shared fact, then say how the two accounts differ in what they choose to include.\n\nSource A (a parent\'s letter to family): "Our daughter\'s choir performed three songs at Thursday night\'s spring concert, and I could see her hands shaking before the curtain opened. By the last song she was smiling so wide I could see it from the back row."\n\nSource B (the school\'s program report): "The sixth-grade choir performed three songs at Thursday night\'s spring concert. Forty students took part, and the program thanked three parent volunteers who had set up chairs before the doors opened."',
      steps: [
        'Confirm the topic. Both sources describe the same event: they both "performed three songs at Thursday night\'s spring concert." Same concert, same night, same number of songs.',
        'List what each source adds beyond that shared line. Source A adds a feeling: her hands "shaking before the curtain opened," and later she "was smiling so wide I could see it from the back row." Source B adds a count and a logistics detail: "Forty students took part," and volunteers "had set up chairs before the doors opened."',
        'Ask whether either addition contradicts the other. It does not. A singer can be nervous before the curtain and also be one of forty students performing at the same time. The two additions sit side by side without touching each other.',
        'Notice the pattern behind the choices. A personal letter tends to include feeling, because that is what the writer noticed and cared about. A program report tends to include numbers and logistics, because that is what the writer\'s job was to record. That pattern is emphasis and stance, not disagreement.',
        'Say the comparison in one sentence: both accounts report the same concert, but Source A emphasizes a singer\'s nervousness and relief, while Source B emphasizes the size of the choir and the volunteers who helped set up.',
      ],
      answer:
        'Shared fact: the choir performed three songs at Thursday night\'s spring concert. Source A emphasizes a singer\'s nervousness and her smile by the last song; Source B emphasizes the number of students who took part and the volunteers who set up chairs. Neither account contradicts the other.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-shared-fact',
      kind: 'try_yourself',
      problem:
        'Read both accounts of the same food drive, then choose the fact that BOTH accounts state.\n\nSource A (the school flyer): "Fairview Elementary held a canned food drive during the last week of October for the Riverside Food Pantry, and every classroom in the school filled at least one box."\n\nSource B (a student\'s article for the school paper): "Fairview Elementary held a canned food drive during the last week of October for the Riverside Food Pantry, and Ms. Kwan\'s fourth-grade class filled three boxes by themselves, more than any other class in the school."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Fairview Elementary held a canned food drive during the last week of October for the Riverside Food Pantry.', correct: true },
        { id: 'b', text: 'Every classroom in the school filled at least one box of canned food, showing that not a single classroom in the building was left out of the drive.' },
        { id: 'c', text: 'Ms. Kwan\'s fourth-grade class filled three boxes by themselves, more than any other class in the school, which made their class the top collector of the whole food drive.' },
        { id: 'd', text: 'The food drive collected more cans this year than it had collected in any year the school had held one before, making this the most successful drive in Fairview\'s history.' },
      ],
      expectedAnswer: 'Fairview Elementary held a canned food drive during the last week of October for the Riverside Food Pantry.',
      hints: [
        'Make two lists, one for what Source A says and one for what Source B says, and look for the sentence that opens both accounts.',
        'Two of these choices are true, but each one is printed by only one of the two accounts. Only one sentence appears in both.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-detail-in-one-source-only',
      kind: 'try_yourself',
      problem:
        'Read both accounts of the same reading challenge, then choose the detail that appears in Source A but NOT in Source B.\n\nSource A (a family newsletter note): "Oakview Library\'s summer reading challenge ran for eight weeks this year, and my younger brother read eleven chapter books to earn his prize bookmark. He read the last one out loud to our dog because he said she deserved to hear the ending too."\n\nSource B (the library\'s program report): "Oakview Library\'s summer reading challenge ran for eight weeks this year. Readers needed to finish at least five books to earn a prize bookmark, and the library extended its Saturday hours for the final two weeks of the challenge."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Oakview Library\'s summer reading challenge ran for eight weeks this year.' },
        { id: 'b', text: 'A boy read the last of his eleven chapter books out loud to the family dog.', correct: true },
        { id: 'c', text: 'The library extended its Saturday hours for the final two weeks of the challenge.' },
        { id: 'd', text: 'Readers needed to finish at least five books to earn a prize bookmark.' },
      ],
      expectedAnswer: 'A boy read the last of his eleven chapter books out loud to the family dog.',
      hints: [
        'First mark which sentence shows up in both accounts. That sentence cannot be the answer, because the question asks for something only Source A says.',
        'Two of the remaining choices are true statements, but they come from Source B, not Source A. Match each detail to the account that actually printed it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-comparison',
      kind: 'try_yourself',
      problem:
        'Read both accounts of the same bake sale, then choose the statement that BEST describes how the two accounts differ.\n\nSource A (a band parent\'s group-chat post): "The marching band spent Saturday morning selling baked goods in the school parking lot to raise money for new uniforms, and by noon almost everything on the tables was gone. Several band members stayed the whole four hours even though the wind kept blowing napkins everywhere."\n\nSource B (the local paper\'s community item): "Fernwood Middle School\'s marching band held a bake sale Saturday morning in the school parking lot to raise money for new uniforms. The event ran for four hours, and organizers said the sale earned enough money to replace about a third of the band\'s uniforms."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The two accounts must describe two entirely different bake sales, since Source A never mentions how much money was earned and Source B never mentions the wind, so the two accounts cannot possibly be reporting the very same Saturday event.' },
        { id: 'b', text: 'Source B\'s report that the sale earned enough money to replace about a third of the band\'s uniforms proves that Source A\'s claim about the wind blowing napkins everywhere all morning long simply cannot be true.' },
        { id: 'c', text: 'Both accounts describe the same bake sale, but Source A focuses on the band members working through the wind for four hours, while Source B focuses on how much money the sale raised for new uniforms.', correct: true },
        { id: 'd', text: 'The two accounts cannot be compared at all, because one of them was written by a band parent posting in a group chat and the other one was written by a reporter working for the local newspaper.' },
      ],
      expectedAnswer: 'Both accounts describe the same bake sale, but Source A focuses on the band members working through the wind for four hours, while Source B focuses on how much money the sale raised for new uniforms.',
      hints: [
        'Check whether both accounts name the same event, the same place and the same length of time before deciding they disagree about anything.',
        'Notice that one account spends most of its words on the volunteers\' effort and the other spends most of its words on the result. Neither one contradicts the other\'s facts.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-omission-is-not-an-error',
      kind: 'misconception_check',
      question:
        'A student compares two accounts of the class field trip to Miller\'s Orchard. Account A says the class picked apples for two hours and then ate lunch at the picnic tables. Account B never mentions two hours; it only says the class picked apples and then walked through the corn maze. The student writes: "Account B must have the story wrong, since it does not say how long the apple picking took." What went wrong?',
      commonErrors: [
        {
          answer: 'Account B must have the story wrong, since it does not say how long the apple picking took.',
          misconception:
            'Treating a detail one account leaves out as a mistake in the account that leaves it out. Leaving a detail out feels like an error because the student already knows the detail from the other account.',
          correctsTo:
            'Check whether Account B actually states something that clashes with Account A, not just something less. Account B does not say the apple picking took two hours, but it also does not say the apple picking took some other length of time — it simply does not mention the length at all. That is a gap, not a contradiction. Account B would only be wrong if it stated a fact that clashed with Account A\'s fact, such as saying the class never picked apples at all.',
        },
        {
          answer: 'Since Account A mentions lunch and Account B mentions the corn maze, they must be describing two different field trips.',
          misconception:
            'Assuming that two accounts mentioning different activities must be describing two different events, instead of checking the facts the two accounts share first.',
          correctsTo:
            'Check the shared facts before deciding the events do not match. Both accounts agree that the class went to Miller\'s Orchard and picked apples. That shared fact is the event. Account A then adds the picnic lunch, and Account B adds the corn maze. One field trip can include apple picking, a lunch, and a walk through a corn maze, so two accounts that mention different parts of the same day can still be about the same trip.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two accounts of the same event should agree on the facts of that event. If they truly disagree on a fact, one of them has an error — but leaving a detail out is not the same as disagreeing.',
        'Find the shared facts first. Make two lists, one for each account, and look for the sentence that appears on both lists.',
        'What sits on only one list is that account\'s choice — what it included and what it left out. A detail one account skips does not make the other account wrong.',
        'Emphasis is the detail an account spends the most words on. A personal account often emphasizes feeling; an official report often emphasizes numbers and logistics.',
        'Different does not mean one account got a fact wrong. Ask first whether the two facts actually clash before deciding anyone made a mistake.',
        'A good comparison names the shared fact, then names what each account adds that the other leaves out.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Comparing Two Authors\' Accounts' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
