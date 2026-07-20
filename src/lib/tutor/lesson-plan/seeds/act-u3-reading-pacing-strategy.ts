/**
 * ACT — Reading: Pacing & Passage Strategy by Genre.
 *
 * 4 passages, 40 questions, 35 minutes — a flat budget (~8:45/passage,
 * ~52 sec/question) no matter which order you work the passages in. The
 * printed order is always Prose Fiction, Social Science, Humanities,
 * Natural Science, but the ANSWERING order is the student's choice. This
 * lesson drills the pick-your-order strategy and when to skim vs. read
 * each genre before diving into questions.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U3_READING_PACING_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.act.reading-pacing-strategy.v1',
  title: 'Pacing & Passage Strategy by Genre',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.reading-pacing-strategy',
      standard: 'ACT-3.6',
      description:
        'Choose a passage-answering order by genre strength, budget ~8:45 per passage against the 35-minute section clock, and decide skim-vs-full-read per passage type.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the flat time budget concrete and reframe passage order as a choice, not a rule.',
      script:
        'ACT Reading: 4 passages, 40 questions, 35 minutes. That is 8 minutes 45 seconds per passage, about 52 seconds per question — and that budget never changes. What CAN change is the order you tackle the passages in. The passages are always printed Prose Fiction, Social Science, Humanities, Natural Science — but nothing says you have to answer them in that order. Today: how to pick YOUR order and how to decide, passage by passage, whether to skim or read.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pacing-strategy',
      kind: 'concept',
      goal: 'The flat budget, the fixed print order vs. chosen answering order, the pick-your-order strategy, and skim-vs-read by genre.',
      keyIdeas: [
        'THE MATH: 35 minutes ÷ 4 passages = ~8:45 per passage; 35 minutes ÷ 40 questions = ~52 seconds per question. No bell rings between passages — you self-pace.',
        'FIXED PRINT ORDER: Prose Fiction, Social Science, Humanities, Natural Science — always in that order on the page. This is NOT the order you must answer in.',
        'PICK-YOUR-ORDER STRATEGY: spend ~10 seconds scanning all four titles/opening lines before starting. Rank them fastest-to-slowest by your comfort, then answer your STRONGEST genre first — bank fast, confident points while you\'re fresh, and save your weakest for last.',
        'WHY WEAKEST LAST (not first): if your weakest passage runs long, you can guess-and-move on its final few questions without it costing the three passages you\'re good at. If you front-load your weakest passage instead, a slow start can eat into passages you would have aced.',
        'SKIM vs. FULL READ: character-driven passages (Prose Fiction, often Humanities) usually reward a fuller first read — voice, tone, and relationships drive the questions. Informational passages (Social Science, Natural Science) with dense background, tables, or data usually reward a skim (topic sentences, first/last paragraph) followed by question-driven line-hunting.',
        'THE 3-MINUTE CAP: whichever approach you use, cap the initial read near 3 minutes even on a passage you\'re reading fully. If you\'re not done, move to the questions — line references and "according to the passage" cues will pull you back to the right spot.',
        'TRAP — SUNK COST: pouring extra minutes into a hard passage because you refuse to move on. One passage running 12 minutes instead of 8:45 steals over 3 minutes from the other three combined.',
        'TRAP — NO PLAN: answering in print order out of habit, with no 10-second scan and no genre ranking, is the same as choosing your weakest genre first at random.',
      ],
      vocabulary: [
        { term: 'passage order', definition: 'the sequence a student chooses to ANSWER the four passages in — independent of the fixed print order.' },
        { term: 'line reference', definition: 'a question that names a specific line, paragraph, or figure ("According to lines 24–26…") — a cue to hunt the passage rather than reread it in full.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-order-and-budget',
      kind: 'worked_example',
      problem:
        'Section starts. Printed order: Prose Fiction, Social Science, Humanities, Natural Science. Your 10-second scan: Prose Fiction is a family-dinner scene (your strength); Social Science is about trade tariffs (comfortable); Humanities is a jazz musician\'s biography (comfortable); Natural Science is about photosynthesis experiments with two data tables (your weak spot — you missed several data questions on your last practice test). Choose your passage order and time checkpoints.',
      steps: [
        'Rank genres by comfort from the scan: Prose Fiction > Social Science ≈ Humanities > Natural Science.',
        'Choose answering order: Prose Fiction first (bank quick, confident points while fresh), then Social Science, then Humanities, then Natural Science last — your weakest, saved for when a slow finish can\'t damage the other three.',
        'The per-passage budget stays flat regardless of order: ~8:45 each. Set checkpoints at 9, 18, 27, and 35 minutes to catch pacing drift early.',
        'On Natural Science (last, weakest, data-heavy), plan to skim the background and go straight to the tables and line-referenced questions rather than a full read.',
        'If Natural Science runs past 35 minutes, guess on the final 2–3 questions rather than borrowing time — the first three passages already banked the bulk of the points.',
      ],
      answer: 'Order: Prose Fiction → Social Science → Humanities → Natural Science, ~8:45 each, weakest genre last with a hard stop at 35 minutes.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sunk-cost-trap',
      kind: 'worked_example',
      problem:
        'You start with Social Science, your second-strongest genre. It has three dense data tables. At your 9-minute checkpoint you\'ve only answered 5 of 10 questions, and you feel like just 3 more minutes would let you finish with full understanding. What should you do?',
      steps: [
        'Spot the trap: "just 3 more minutes" on ONE passage leaves only 32 minutes left for the other three, which need 26:15 combined — you\'d be borrowing time you don\'t have from passages you haven\'t hurt yet.',
        'Apply the checkpoint rule: on any question you\'re still stuck on, eliminate what you can, pick your best guess, and move on.',
        'Mentally mark the 5 unanswered Social Science questions as "return only if time remains after all four passages."',
        'Move to your next passage (Humanities) at its full 8:45 budget — protect the passages you\'re strong at rather than defending the one that\'s running long.',
        'If time remains after passage four, return to the skipped Social Science questions; if not, they were never going to get finished at the cost of two other passages.',
      ],
      answer: 'Guess your best answer at the 9-minute checkpoint and move on — never let one dense passage eat into passages you could otherwise ace.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-pick-order',
      kind: 'try_yourself',
      problem:
        'Your 10-second scan: the Humanities passage is about a topic you love, and the Natural Science passage has two dense data tables you know you struggle with. What should you do first?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Start with Natural Science to get the hard one out of the way while you have the most time left.' },
        { id: 'b', text: 'Start with Humanities, your strongest genre, to bank confident points while you\'re fresh.', correct: true },
        { id: 'c', text: 'Start in printed order (Prose Fiction) regardless of what the scan showed.' },
        { id: 'd', text: 'Skim all four passages fully before answering any questions on any of them.' },
      ],
      expectedAnswer: 'Start with Humanities, your strongest genre, to bank confident points while you\'re fresh.',
      hints: [
        'The order printed on the page is not the order you\'re required to answer in.',
        'Banking points on your strongest genre first sets up steadier pacing for the rest of the section.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-checkpoint-decision',
      kind: 'try_yourself',
      problem:
        'You\'re 9 minutes into your first passage and have only answered 6 of its 10 questions. What\'s the right pacing move?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Keep working this passage until every question is answered, even if it takes 15 minutes.' },
        { id: 'b', text: 'Guess your best answer on the tough remaining questions, move to the next passage on schedule, and return only if time allows at the end.', correct: true },
        { id: 'c', text: 'Skip the next passage entirely so you can finish this one properly.' },
        { id: 'd', text: 'Restart this passage from the beginning with a slower, more careful read.' },
      ],
      expectedAnswer: 'Guess your best answer on the tough remaining questions, move to the next passage on schedule, and return only if time allows at the end.',
      hints: [
        'A blank answer scores the same as a wrong guess and worse than an educated one — there\'s no guessing penalty.',
        'One passage running long doesn\'t have to cost the other three.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-skim-vs-read',
      kind: 'try_yourself',
      problem:
        'A Natural Science passage opens with two paragraphs of dense background text, then a data table and several "According to the table…" questions. What\'s the smarter first move?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Read every word of the background text carefully before glancing at the table or questions.' },
        { id: 'b', text: 'Skim the background for the gist, scan the table, then let the line-and-data-referenced questions pull you back to the exact spot needed.', correct: true },
        { id: 'c', text: 'Read the whole passage twice to make sure nothing is missed.' },
        { id: 'd', text: 'Answer from memory of similar passages without reading this one at all.' },
      ],
      expectedAnswer: 'Skim the background for the gist, scan the table, then let the line-and-data-referenced questions pull you back to the exact spot needed.',
      hints: [
        'Informational passages with table/line references reward skim-then-hunt over a full read.',
        'The questions themselves will tell you exactly where in the passage to look.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fixed-order',
      kind: 'misconception_check',
      question:
        'A student always answers passages in print order (Prose Fiction, Social Science, Humanities, Natural Science) and always reads each one fully before touching its questions, no matter the genre. On test day they run out of time and leave the last 8 questions blank. What went wrong?',
      commonErrors: [
        {
          answer: 'Print order and always-read-fully-first are just "how you\'re supposed to do it."',
          misconception: 'Treating the printed passage order and a uniform full-read approach as mandatory rather than as strategic choices inside a flat 35-minute budget.',
          correctsTo:
            'Passage order is the student\'s choice — scan first, then answer the strongest genre first to bank points, saving the weakest for last. Reading depth should match the passage: skim-and-hunt for data/informational passages, fuller read for character-driven ones. And never leave answers blank — guess before time expires, since wrong guesses aren\'t penalized.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '4 passages, 40 questions, 35 minutes: ~8:45 per passage, ~52 seconds per question — a flat budget no matter the order.',
        'Print order is fixed (Prose Fiction, Social Science, Humanities, Natural Science) but your ANSWERING order isn\'t — scan for 10 seconds, then do your strongest genre first.',
        'Skim + question-hunt for data-heavy or informational passages; a fuller read pays off more for character-driven fiction and humanities.',
        'Guess and move at each checkpoint — never let one hard passage steal time from three passages you could ace.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.6', cedTitle: 'Pacing & Passage Strategy by Genre' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
