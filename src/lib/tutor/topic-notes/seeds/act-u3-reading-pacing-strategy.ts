/**
 * ACT — Unit 3 CED 3.6: Pacing & Passage Strategy by Genre.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.reading-pacing-strategy.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U3_READING_PACING_STRATEGY: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.reading-pacing-strategy.v1',
  course: 'ACT',
  cedUnit: 3,
  cedTopic: '3.6',
  cedTitle: 'Pacing & Passage Strategy by Genre',
  planId: 'evelyn.testprep.act.reading-pacing-strategy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.reading-pacing-strategy.v1' }],
  theory: [
    { loId: 'act.reading-pacing-strategy', content: `THE MATH: 40 minutes ÷ 4 passages = 10:00 per passage; 40 minutes ÷ 36 questions = ~67 seconds per question. No bell rings between passages — you self-pace.` },
    { loId: 'act.reading-pacing-strategy', content: `FIXED PRINT ORDER: Prose Fiction, Social Science, Humanities, Natural Science — always in that order on the page. This is NOT the order you must answer in.` },
    { loId: 'act.reading-pacing-strategy', content: `PICK-YOUR-ORDER STRATEGY: spend ~10 seconds scanning all four titles/opening lines before starting. Rank them fastest-to-slowest by your comfort, then answer your STRONGEST genre first — bank fast, confident points while you're fresh, and save your weakest for last.` },
    { loId: 'act.reading-pacing-strategy', content: `WHY WEAKEST LAST (not first): if your weakest passage runs long, you can guess-and-move on its final few questions without it costing the three passages you're good at. If you front-load your weakest passage instead, a slow start can eat into passages you would have aced.` },
    { loId: 'act.reading-pacing-strategy', content: `SKIM vs. FULL READ: character-driven passages (Prose Fiction, often Humanities) usually reward a fuller first read — voice, tone, and relationships drive the questions. Informational passages (Social Science, Natural Science) with dense background, tables, or data usually reward a skim (topic sentences, first/last paragraph) followed by question-driven line-hunting.` },
    { loId: 'act.reading-pacing-strategy', content: `THE 3-MINUTE CAP: whichever approach you use, cap the initial read near 3 minutes even on a passage you're reading fully. If you're not done, move to the questions — line references and "according to the passage" cues will pull you back to the right spot.` },
    { loId: 'act.reading-pacing-strategy', kind: 'framework', title: 'Trap', content: `TRAP — SUNK COST: pouring extra minutes into a hard passage because you refuse to move on. One passage running 13 minutes instead of 10:00 steals 3 minutes from the other three combined.` },
    { loId: 'act.reading-pacing-strategy', kind: 'framework', title: 'Trap', content: `TRAP — NO PLAN: answering in print order out of habit, with no 10-second scan and no genre ranking, is the same as choosing your weakest genre first at random.` },
    { loId: 'act.reading-pacing-strategy', kind: 'definition', title: 'passage order', content: `the sequence a student chooses to ANSWER the four passages in — independent of the fixed print order.` },
    { loId: 'act.reading-pacing-strategy', kind: 'definition', title: 'line reference', content: `a question that names a specific line, paragraph, or figure ("According to lines 24–26…") — a cue to hunt the passage rather than reread it in full.` },
  ],
  methods: [
    {
      title: 'Worked order and budget',
      steps: [
        `Rank genres by comfort from the scan: Prose Fiction > Social Science ≈ Humanities > Natural Science.`,
        `Choose answering order: Prose Fiction first (bank quick, confident points while fresh), then Social Science, then Humanities, then Natural Science last — your weakest, saved for when a slow finish can't damage the other three.`,
        `The per-passage budget stays flat regardless of order: 10:00 each. Set checkpoints at 10, 20, 30, and 40 minutes to catch pacing drift early.`,
        `On Natural Science (last, weakest, data-heavy), plan to skim the background and go straight to the tables and line-referenced questions rather than a full read.`,
        `If Natural Science runs past 40 minutes, guess on the final 2–3 questions rather than borrowing time — the first three passages already banked the bulk of the points.`,
      ],
      example: { problem: `Section starts. Printed order: Prose Fiction, Social Science, Humanities, Natural Science. Your 10-second scan: Prose Fiction is a family-dinner scene (your strength); Social Science is about trade tariffs (comfortable); Humanities is a jazz musician's biography (comfortable); Natural Science is about photosynthesis experiments with two data tables (your weak spot — you missed several data questions on your last practice test). Choose your passage order and time checkpoints.`, solution: `Order: Prose Fiction → Social Science → Humanities → Natural Science, 10:00 each, weakest genre last with a hard stop at 40 minutes.` },
      relatedLoIds: ['act.reading-pacing-strategy'],
    },
    {
      title: 'Worked sunk cost trap',
      steps: [
        `Spot the trap: "just 3 more minutes" on ONE passage leaves only 27 minutes left for the other three, which need 30:00 combined — you'd be borrowing time you don't have from passages you haven't hurt yet.`,
        `Apply the checkpoint rule: on any question you're still stuck on, eliminate what you can, pick your best guess, and move on.`,
        `Mentally mark the unanswered Social Science questions as "return only if time remains after all four passages."`,
        `Move to your next passage (Humanities) at its full 10:00 budget — protect the passages you're strong at rather than defending the one that's running long.`,
        `If time remains after passage four, return to the skipped Social Science questions; if not, they were never going to get finished at the cost of two other passages.`,
      ],
      example: { problem: `You start with Social Science, your second-strongest genre. It has three dense data tables. At your 10-minute checkpoint you've only answered 5 of 9 questions, and you feel like just 3 more minutes would let you finish with full understanding. What should you do?`, solution: `Guess your best answer at the 10-minute checkpoint and move on — never let one dense passage eat into passages you could otherwise ace.` },
      relatedLoIds: ['act.reading-pacing-strategy'],
    },
  ],
  pointers: [
    { content: `Passage order is the student's choice — scan first, then answer the strongest genre first to bank points, saving the weakest for last. Reading depth should match the passage: skim-and-hunt for data/informational passages, fuller read for character-driven ones. And never leave answers blank — guess before time expires, since wrong guesses aren't penalized.`, kind: 'common-error' },
    { content: `4 passages, 36 questions, 40 minutes: 10:00 per passage, ~67 seconds per question — a flat budget no matter the order.`, kind: 'tip' },
    { content: `Print order is fixed (Prose Fiction, Social Science, Humanities, Natural Science) but your ANSWERING order isn't — scan for 10 seconds, then do your strongest genre first.`, kind: 'tip' },
    { content: `Skim + question-hunt for data-heavy or informational passages; a fuller read pays off more for character-driven fiction and humanities.`, kind: 'tip' },
    { content: `Guess and move at each checkpoint — never let one hard passage steal time from three passages you could ace.`, kind: 'tip' },
    { content: `Bubble answers as you go, not at the end of a passage — and if you skip a passage's print order, double-check the answer-sheet block number before bubbling. Re-ordering passages is where mis-gridded rows happen, and a shifted column can cost you 10 questions.`, kind: 'gotcha' },
    { content: `"Strongest genre" means fastest and most accurate on practice tests, not most interesting. A Humanities passage on a topic you love can still be slow if abstract-argument questions trip you up. Rank by score data, not by curiosity.`, kind: 'common-error' },
    { content: `Paired/dual passages (two short texts with comparison questions) usually appear in one slot and run slower than a single passage. If your scan spots "Passage A / Passage B," plan to read A + answer its questions, then B + its questions, then the both-passages set last.`, kind: 'edge-case' },
    { content: `A line reference tells you where to look, not what the answer is. Read the full sentence before and after the cited lines — the ACT routinely places the answer's key qualifier just outside the quoted range.`, kind: 'gotcha' },
    { content: `"Main idea," "the author's primary purpose," and "the passage as a whole" questions have no line reference — save them for after you've worked the detail questions, which will have already walked you through the text.`, kind: 'tip' },
    { content: `Checkpoints are cumulative clock times (10, 20, 30, 40), not "10 minutes per passage." If passage one ends at 8:30, your next checkpoint is still 20 — bank the extra 1:30 for your weakest passage instead of spending it.`, kind: 'common-error' },
    { content: `With ~4 minutes left, stop working and fill every remaining bubble with a letter — the ACT has no wrong-answer penalty. Blank rows on the last passage are the single most common way students lose points on this section.`, kind: 'tip' },
    { content: `Don't skim a Prose Fiction passage just because you're behind schedule. Tone, relationship, and "the narrator's attitude" questions have no line to hunt — skimming fiction saves 90 seconds and costs several questions.`, kind: 'edge-case' },
  ],
};
