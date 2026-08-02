/**
 * ACT — Unit 4 CED 4.7: Pacing & Strategy for the Science Section.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.science-pacing-strategy.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U4_SCIENCE_PACING_STRATEGY: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.science-pacing-strategy.v1',
  course: 'ACT',
  cedUnit: 4,
  cedTopic: '4.7',
  cedTitle: 'Pacing & Strategy for the Science Section',
  planId: 'evelyn.testprep.act.science-pacing-strategy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.science-pacing-strategy.v1' }],
  theory: [
    { loId: 'act.science-pacing-strategy', content: `THE MATH: 35 minutes across 6-7 passages averages ~5 minutes each, but the three passage types are NOT equally fast — budget them differently, not evenly.` },
    { loId: 'act.science-pacing-strategy', content: `TRIAGE ORDER: Data Representation is fastest (~4 min — pure lookup, no experiment to track) and goes FIRST. Research Summaries are next (~5 min — comparing 2-3 experiments). Conflicting Viewpoints is slowest (~6-7 min — the only type that requires reading full passages of text) and goes LAST, regardless of where it is printed in the booklet.` },
    { loId: 'act.science-pacing-strategy', content: `SCAN BEFORE YOU START: spend the first ~30-60 seconds flipping through every passage and tagging its type — tables/graphs with no described experiment = Data Rep; a described experiment with trials or a graph = Research Summary; two or more named scientists/students with competing explanations = Conflicting Viewpoints.` },
    { loId: 'act.science-pacing-strategy', content: `FIGURES-FIRST DISCIPLINE: within a Data Rep or Research Summary passage, skip the intro prose and go straight to the questions — the numbers you need are almost always in a table or figure, not the paragraph above it. Conflicting Viewpoints is the exception: you must read each viewpoint's text, because there is no figure that substitutes for the argument.` },
    { loId: 'act.science-pacing-strategy', content: `THE 90-SECOND CUTOFF: if a single question is eating more than about 90 seconds, stop. Mark your best guess, flag it if you want to revisit, and move on — one stubborn question is never worth sinking the rest of a passage.` },
    { loId: 'act.science-pacing-strategy', content: `NEVER LEAVE BLANKS: the ACT does not subtract points for wrong answers, so a blank is a guaranteed zero while any guess has a real chance at credit. Every question gets an answer bubbled in before time is called, even ones you never actually reach — use a single "letter of the day" for those in the closing seconds.` },
    { loId: 'act.science-pacing-strategy', content: `TIME-CHECK RHYTHM: glance at the clock after finishing every passage (or every two), not after every question — checking too often burns the very seconds you are trying to save.` },
    { loId: 'act.science-pacing-strategy', content: `COMMON TRAP: rushing Data Rep so fast that you misread an axis or unit, then having to redo it — going fast on the easy passages only pays off if you are still accurate. Fast and wrong costs more time than slow and right.` },
    { loId: 'act.science-pacing-strategy', kind: 'definition', title: 'triage', content: `quickly sorting the passages by how fast they can be answered, then working in that order instead of the order they are printed.` },
    { loId: 'act.science-pacing-strategy', kind: 'definition', title: 'Conflicting Viewpoints', content: `the ACT Science passage type with two or more scientists/students offering competing explanations; the only type that requires reading full-text arguments rather than just figures.` },
    { loId: 'act.science-pacing-strategy', kind: 'definition', title: 'letter of the day', content: `one pre-chosen guess letter used to fill any remaining blanks in the final seconds — faster than deliberating, and no worse in expectation than any other guess.` },
  ],
  methods: [
    {
      title: 'Worked budget a full section',
      steps: [
        `Tag each passage by type: 3 × Data Representation, 3 × Research Summary, 1 × Conflicting Viewpoints (matches the ~30%/50%/20% split ACT Science typically uses).`,
        `Apply the standard per-type budgets: Data Rep ≈ 4 min each, Research Summary ≈ 5 min each, Conflicting Viewpoints ≈ 7 min.`,
        `Multiply out each type: 3 Data Rep × 4 min = 12 min. 3 Research Summary × 5 min = 15 min. 1 Conflicting Viewpoints × 7 min = 7 min.`,
        'Sum the working time: 12 + 15 + 7 = 34 minutes.',
        `Add the initial 1-minute scan to tag passage types: 34 + 1 = 35 minutes — the full section, fully accounted for with no slack lost.`,
        `Order of attack: all 3 Data Representation passages first (fastest points banked early), then the 3 Research Summaries, then the single Conflicting Viewpoints passage last — even if it happens to be printed first in the booklet.`,
      ],
      example: { problem: `Today's ACT Science section has 7 passages: three Data Representation, three Research Summaries, and one Conflicting Viewpoints. Using the standard per-type budgets, build a time plan for the full 35-minute section and decide the order to tackle the passages.`, solution: `Work the 3 Data Rep passages first (~4 min each = 12 min), then the 3 Research Summaries (~5 min each = 15 min), then Conflicting Viewpoints last (~7 min) — 34 working minutes plus the 1-minute scan uses exactly the 35-minute section.` },
      relatedLoIds: ['act.science-pacing-strategy'],
    },
    {
      title: 'Worked sunk cost trap',
      steps: [
        `Notice the trap: "I already spent 6 minutes here" is a sunk cost — it is NOT a reason to keep spending more minutes on this same passage.`,
        `Do the quick math on what is left: 2 untouched Data Rep passages at ~4 min each = 8 minutes combined.`,
        `12 minutes left − 8 minutes for the two Data Rep passages = 4 minutes of slack, not enough to safely finish this Research Summary passage properly right now.`,
        `Apply the never-leave-blanks rule to the question you are stuck on: bubble your current best guess so it is never blank, then jump to the two Data Representation passages while there is still time to bank those faster points.`,
        `Return to finish the Research Summary passage only if time remains after both Data Rep passages are done.`,
      ],
      example: { problem: `With 12 minutes left in ACT Science, you are on question 3 of a tough Research Summary passage and have already spent 6 minutes on it. Two Data Representation passages are still completely untouched. What should you do?`, solution: `Guess on the question you are stuck on so it is never blank, jump immediately to the two untouched Data Representation passages (the fastest remaining points), and only return to the Research Summary passage if time is left over.` },
      relatedLoIds: ['act.science-pacing-strategy'],
    },
  ],
  pointers: [
    { content: `Passage TYPE — not print order — should decide the order you work in, since Data Rep and Research Summary passages are faster than Conflicting Viewpoints. And figures-first (skipping the intro prose on those two types) saves real time without costing accuracy, because the questions are answered from the tables and graphs, not the narrative — the intro rarely contains anything the questions actually need.`, kind: 'common-error' },
    { content: `Triage by passage type: Data Representation first (~4 min, fastest), Research Summaries second (~5 min), Conflicting Viewpoints last (~6-7 min, only type needing full-text reading).`, kind: 'tip' },
    { content: `Figures first — skip the intro prose on Data Rep and Research Summary; Conflicting Viewpoints is the exception and must be read.`, kind: 'tip' },
    { content: 'Stuck on a question for more than ~90 seconds? Guess, mark it, and move on.', kind: 'tip' },
    { content: `Never leave a blank — the ACT has no guessing penalty, so every question gets an answer before time is called.`, kind: 'tip' },
    { content: `Triage ≠ skipping. Every passage still gets worked — you're only choosing the ORDER. If you jump to Data Rep first, physically fold or flag the pages you passed over so you don't finish the section thinking the Conflicting Viewpoints passage was optional.`, kind: 'vocab-note' },
    { content: `Working out of print order wrecks bubbling. Bubble one passage's answers as a block right after you finish it, checking the question numbers against the sheet — a one-row shift from jumping passages can silently cost you a whole passage's points.`, kind: 'common-error' },
    { content: `Budget by question count, not just type. A Data Rep passage with 7 questions is not a 4-minute passage, and a Research Summary with 5 is not a 5-minute one. Glance at how many questions each passage carries during your opening scan and shift a minute accordingly.`, kind: 'edge-case' },
    { content: `Inside Conflicting Viewpoints, triage again: answer the single-scientist questions ('Scientist 2 would most likely agree...') right after reading that viewpoint. Save 'both scientists' / 'point of disagreement' questions for last — they're the slowest.`, kind: 'tip' },
    { content: `Question stems tell you the cost. 'According to Figure 2' or 'In Table 1' = a 20-second lookup, do it now. 'Based on the results of Study 1 AND Study 2' or 'If the experiment were repeated with...' = a 60-90-second question. Clear the cheap stems first within each passage.`, kind: 'tip' },
    { content: `Speeding through Data Rep, students grab the right number from the wrong axis. Before reading a value, say the axis label AND unit to yourself, and check table headers for '(×10³)' or a log scale — the answer choices are built from exactly that misread.`, kind: 'gotcha' },
    { content: `If ~20 seconds of hunting the figures turns up nothing the question is referring to, it's not a lookup — guess and move. Don't re-scan every table hoping the data is hiding somewhere; that's the classic 90-second sinkhole.`, kind: 'gotcha' },
    { content: `Start your letter-of-the-day sweep at the 30-second mark, not when the proctor calls time. Four bubbled guesses beat one more solved question — and blanks can't be fixed after 'pencils down.'`, kind: 'common-error' },
  ],
};
