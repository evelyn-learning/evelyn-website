/**
 * ACT — Science / Pacing & Strategy for the Science Section.
 *
 * 40 questions, 6-7 passages, 35 minutes. The clock — not the science —
 * is what beats most students on this section. This lesson is NOT about
 * reading any single figure (that's 4.1); it's about the section-level
 * game plan: which passage type to attack first, how to budget minutes
 * across passages, when to cut losses on a stuck question, and why a
 * blank is always worse than a guess.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U4_SCIENCE_PACING_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.act.science-pacing-strategy.v1',
  title: 'Pacing & Strategy for the Science Section',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.science-pacing-strategy',
      standard: 'ACT-4.7',
      description:
        'Triage the 6-7 passages of ACT Science by type and time budget, apply figures-first discipline within each passage, and never leave a question blank under the 35-minute clock.',
    },
  ],
  prerequisites: ['act.data-representation'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe ACT Science as a section-level pacing puzzle, not a per-question content test.',
      script:
        '40 questions, 6 to 7 passages, 35 minutes — that is roughly 5 minutes per passage on average, but not every passage deserves the same 5 minutes. Students who run out of time almost never run out because the science was too hard; they run out because they spent 8 minutes on a passage that should have taken 4, or got stuck rereading one question three times. Today is entirely about the clock: which passages to hit first, how to split your 35 minutes, and what to do when a question is eating your time.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pacing-triage',
      kind: 'concept',
      goal: 'Passage-type triage order, per-type time budgets, figures-first discipline, and the never-leave-blanks rule.',
      keyIdeas: [
        'THE MATH: 35 minutes across 6-7 passages averages ~5 minutes each, but the three passage types are NOT equally fast — budget them differently, not evenly.',
        'TRIAGE ORDER: Data Representation is fastest (~4 min — pure lookup, no experiment to track) and goes FIRST. Research Summaries are next (~5 min — comparing 2-3 experiments). Conflicting Viewpoints is slowest (~6-7 min — the only type that requires reading full passages of text) and goes LAST, regardless of where it is printed in the booklet.',
        'SCAN BEFORE YOU START: spend the first ~30-60 seconds flipping through every passage and tagging its type — tables/graphs with no described experiment = Data Rep; a described experiment with trials or a graph = Research Summary; two or more named scientists/students with competing explanations = Conflicting Viewpoints.',
        'FIGURES-FIRST DISCIPLINE: within a Data Rep or Research Summary passage, skip the intro prose and go straight to the questions — the numbers you need are almost always in a table or figure, not the paragraph above it. Conflicting Viewpoints is the exception: you must read each viewpoint\'s text, because there is no figure that substitutes for the argument.',
        'THE 90-SECOND CUTOFF: if a single question is eating more than about 90 seconds, stop. Mark your best guess, flag it if you want to revisit, and move on — one stubborn question is never worth sinking the rest of a passage.',
        'NEVER LEAVE BLANKS: the ACT does not subtract points for wrong answers, so a blank is a guaranteed zero while any guess has a real chance at credit. Every question gets an answer bubbled in before time is called, even ones you never actually reach — use a single "letter of the day" for those in the closing seconds.',
        'TIME-CHECK RHYTHM: glance at the clock after finishing every passage (or every two), not after every question — checking too often burns the very seconds you are trying to save.',
        'COMMON TRAP: rushing Data Rep so fast that you misread an axis or unit, then having to redo it — going fast on the easy passages only pays off if you are still accurate. Fast and wrong costs more time than slow and right.',
      ],
      vocabulary: [
        { term: 'triage', definition: 'quickly sorting the passages by how fast they can be answered, then working in that order instead of the order they are printed.' },
        { term: 'Conflicting Viewpoints', definition: 'the ACT Science passage type with two or more scientists/students offering competing explanations; the only type that requires reading full-text arguments rather than just figures.' },
        { term: 'letter of the day', definition: 'one pre-chosen guess letter used to fill any remaining blanks in the final seconds — faster than deliberating, and no worse in expectation than any other guess.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-budget-a-full-section',
      kind: 'worked_example',
      problem:
        'Today\'s ACT Science section has 7 passages: three Data Representation, three Research Summaries, and one Conflicting Viewpoints. Using the standard per-type budgets, build a time plan for the full 35-minute section and decide the order to tackle the passages.',
      steps: [
        'Tag each passage by type: 3 × Data Representation, 3 × Research Summary, 1 × Conflicting Viewpoints (matches the ~30%/50%/20% split ACT Science typically uses).',
        'Apply the standard per-type budgets: Data Rep ≈ 4 min each, Research Summary ≈ 5 min each, Conflicting Viewpoints ≈ 7 min.',
        'Multiply out each type: 3 Data Rep × 4 min = 12 min. 3 Research Summary × 5 min = 15 min. 1 Conflicting Viewpoints × 7 min = 7 min.',
        'Sum the working time: 12 + 15 + 7 = 34 minutes.',
        'Add the initial 1-minute scan to tag passage types: 34 + 1 = 35 minutes — the full section, fully accounted for with no slack lost.',
        'Order of attack: all 3 Data Representation passages first (fastest points banked early), then the 3 Research Summaries, then the single Conflicting Viewpoints passage last — even if it happens to be printed first in the booklet.',
      ],
      answer:
        'Work the 3 Data Rep passages first (~4 min each = 12 min), then the 3 Research Summaries (~5 min each = 15 min), then Conflicting Viewpoints last (~7 min) — 34 working minutes plus the 1-minute scan uses exactly the 35-minute section.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sunk-cost-trap',
      kind: 'worked_example',
      problem:
        'With 12 minutes left in ACT Science, you are on question 3 of a tough Research Summary passage and have already spent 6 minutes on it. Two Data Representation passages are still completely untouched. What should you do?',
      steps: [
        'Notice the trap: "I already spent 6 minutes here" is a sunk cost — it is NOT a reason to keep spending more minutes on this same passage.',
        'Do the quick math on what is left: 2 untouched Data Rep passages at ~4 min each = 8 minutes combined.',
        '12 minutes left − 8 minutes for the two Data Rep passages = 4 minutes of slack, not enough to safely finish this Research Summary passage properly right now.',
        'Apply the never-leave-blanks rule to the question you are stuck on: bubble your current best guess so it is never blank, then jump to the two Data Representation passages while there is still time to bank those faster points.',
        'Return to finish the Research Summary passage only if time remains after both Data Rep passages are done.',
      ],
      answer:
        'Guess on the question you are stuck on so it is never blank, jump immediately to the two untouched Data Representation passages (the fastest remaining points), and only return to the Research Summary passage if time is left over.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-triage-order',
      kind: 'try_yourself',
      problem:
        'With 8 minutes left in ACT Science and two passages remaining — one Data Representation, one Conflicting Viewpoints — which should you tackle first?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Conflicting Viewpoints, because it is worth reading carefully' },
        { id: 'b', text: 'Data Representation, because it is the fastest passage type', correct: true },
        { id: 'c', text: 'Whichever one is printed first in the booklet' },
        { id: 'd', text: 'Skip both and review your earlier answers instead' },
      ],
      expectedAnswer: 'Data Representation, because it is the fastest passage type',
      hints: [
        'Triage by passage type, not by print order: which type needs the least reading?',
        'Data Representation is pure figure lookup; Conflicting Viewpoints requires reading full text — with only 8 minutes, bank the faster points first.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-90-second-cutoff',
      kind: 'try_yourself',
      problem:
        'You have spent about 90 seconds on a single ACT Science question and still are not sure of the answer. What is the best move?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Keep working until you are completely certain, however long that takes' },
        { id: 'b', text: 'Leave it blank to save time and move on' },
        { id: 'c', text: 'Make your best guess, mark it, and move on — return only if time remains', correct: true },
        { id: 'd', text: 'Switch to a different passage entirely and never come back to this one' },
      ],
      expectedAnswer: 'Make your best guess, mark it, and move on — return only if time remains',
      hints: [
        'No single ACT Science question is worth sinking the rest of a passage over.',
        'A blank is a guaranteed zero; a guess has a real chance at points — and you can still revisit it later.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-final-seconds',
      kind: 'try_yourself',
      problem:
        'Time is about to be called on ACT Science and you still have 4 questions completely unanswered. What should you do in the last few seconds?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Leave them blank since you cannot answer them properly in time' },
        { id: 'b', text: 'Bubble in a guess for every one of them — any letter, just do not leave any blank', correct: true },
        { id: 'c', text: 'Only answer the one you feel most confident about and leave the rest' },
        { id: 'd', text: 'Go back and erase your earlier answers to double-check them first' },
      ],
      expectedAnswer: 'Bubble in a guess for every one of them — any letter, just do not leave any blank',
      hints: [
        'The ACT does not subtract points for a wrong answer.',
        'A blank is a guaranteed zero; a guess — even a random one — has a real chance at credit.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-thorough-reading',
      kind: 'misconception_check',
      question:
        'A student reads all 7 passages in the order they are printed, and reads each passage\'s full introduction before looking at any question, believing this thorough approach guarantees the highest accuracy. Under a 35-minute clock, what is wrong with this plan?',
      commonErrors: [
        {
          answer: 'Reading passages in printed order and reading the full intro text before questions',
          misconception: 'Believing that thorough front-to-back reading is always the safest way to maximize accuracy on a timed section.',
          correctsTo:
            'Passage TYPE — not print order — should decide the order you work in, since Data Rep and Research Summary passages are faster than Conflicting Viewpoints. And figures-first (skipping the intro prose on those two types) saves real time without costing accuracy, because the questions are answered from the tables and graphs, not the narrative — the intro rarely contains anything the questions actually need.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Triage by passage type: Data Representation first (~4 min, fastest), Research Summaries second (~5 min), Conflicting Viewpoints last (~6-7 min, only type needing full-text reading).',
        'Figures first — skip the intro prose on Data Rep and Research Summary; Conflicting Viewpoints is the exception and must be read.',
        'Stuck on a question for more than ~90 seconds? Guess, mark it, and move on.',
        'Never leave a blank — the ACT has no guessing penalty, so every question gets an answer before time is called.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.7', cedTitle: 'Pacing & Strategy for the Science Section' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
