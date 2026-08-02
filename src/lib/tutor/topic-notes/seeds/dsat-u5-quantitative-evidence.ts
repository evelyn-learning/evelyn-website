/**
 * Digital SAT — Unit 5 CED 5.3: Command of Evidence: Quantitative.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.quantitative-evidence.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U5_QUANTITATIVE_EVIDENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.quantitative-evidence.v1',
  course: 'Digital SAT',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Command of Evidence: Quantitative',
  planId: 'evelyn.testprep.dsat.quantitative-evidence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.quantitative-evidence.v1' }],
  theory: [
    { loId: 'dsat.quantitative-evidence', kind: 'framework', title: 'The format', content: `THE FORMAT — a short passage states a claim, then a table or graph is described. The question asks which choice provides the data point that best SUPPORTS (or COMPLETES) the claim.` },
    { loId: 'dsat.quantitative-evidence', kind: 'framework', title: 'Step 1', content: `STEP 1 — restate the claim in your own words BEFORE reading the choices. Break it into parts: which group/category, which measure, which direction (increase, decrease, highest, lowest).` },
    { loId: 'dsat.quantitative-evidence', kind: 'framework', title: 'Step 2', content: `STEP 2 — scan the table for the row(s) and column(s) that match every part of the claim, not just one.` },
    { loId: 'dsat.quantitative-evidence', content: `TRAP: WRONG ROW/COLUMN — the number is real and pulled from the correct table, but it describes a different time period, group, or category than the claim names.` },
    { loId: 'dsat.quantitative-evidence', content: `TRAP: REVERSED DIRECTION — the data point is accurate but shows the opposite trend from what the claim states (a rise cited to support a claim about a plateau or decline).` },
    { loId: 'dsat.quantitative-evidence', content: `TRAP: EXTREME BUT IRRELEVANT — the biggest or smallest value in the table, tempting because it sounds impressive, but it doesn't address the SPECIFIC comparison the claim makes.` },
    { loId: 'dsat.quantitative-evidence', content: `TRAP: TRUE BUT INCOMPLETE — a choice that is factually correct about the data but only confirms part of the claim (e.g., confirms a rank but not a trend, or a trend but not which group).` },
    { loId: 'dsat.quantitative-evidence', kind: 'framework', title: 'Strategy', content: `STRATEGY — treat the claim like a checklist and test each choice against ALL of its parts before picking the one that satisfies every box.` },
    { loId: 'dsat.quantitative-evidence', kind: 'definition', title: 'quantitative evidence', content: `numerical data — a table or graph value — offered to support or complete a stated claim.` },
    { loId: 'dsat.quantitative-evidence', kind: 'definition', title: 'data point', content: 'one specific value from a table or graph, tied to a category and a measure.' },
    { loId: 'dsat.quantitative-evidence', kind: 'definition', title: 'trend', content: `the direction data moves across categories or time — increasing, decreasing, or roughly flat.` },
  ],
  methods: [
    {
      title: 'Worked typical',
      steps: [
        `Restate the claim: DOWNTOWN specifically had the BIGGEST drop, compared to Uptown and Riverside — two parts to satisfy.`,
        `Compute each neighborhood's drop: Downtown 29 → 21 = 8 minutes. Uptown 33 → 30 = 3 minutes. Riverside 25 → 24 = 1 minute.`,
        `Check each choice: (A) and (B) name the wrong neighborhood. (D) is true but too general — it never says Downtown had the LARGEST drop, so it doesn't complete the specific claim. (C) names Downtown AND states it was the largest decrease — both parts of the claim are satisfied.`,
      ],
      example: { problem: `Read the passage: A city planner claims: "Since the bike-lane expansion, Downtown saw a bigger drop in average commute time than Uptown or Riverside." Average commute time (minutes): Downtown — 2022: 29, 2024: 21. Uptown — 2022: 33, 2024: 30. Riverside — 2022: 25, 2024: 24. Question: Which choice best supports the planner's claim? (A) Uptown's commute time dropped from 33 to 30 minutes. (B) Riverside's commute time dropped from 25 to 24 minutes. (C) Downtown's commute time dropped from 29 to 21 minutes, the largest decrease of the three neighborhoods. (D) All three neighborhoods saw some decrease in commute time.`, solution: '(C)' },
      relatedLoIds: ['dsat.quantitative-evidence'],
    },
    {
      title: 'Worked trap',
      steps: [
        `Restate the claim precisely: BEYOND 6 cups, improvement STOPS (plateaus) — not the rise before 6 cups, and not simply "still a high value."`,
        `(A) and (B) describe the RISING portion of the data (2→4 and 4→6 cups) — real numbers, but the wrong rows: they're before the claimed plateau even starts.`,
        `(D) is tempting — 7.1 is genuinely the second-highest value in the table — but that fact says nothing about whether ratings kept improving; it's an extreme-but-irrelevant trap.`,
        `(C) covers exactly the range the claim is about (6 through 10 cups) and shows the ratings barely moving (7.2 → 7.3 → 7.1) — precisely "stopped improving."`,
      ],
      example: { problem: `Read the passage: A nutrition study tracked afternoon energy self-ratings (1–10 scale) for participants grouped by daily water intake. A columnist claims: "The data show that once water intake passed 6 cups per day, participants' energy ratings stopped improving." Average energy rating by cups/day: 2 cups — 4.1. 4 cups — 5.6. 6 cups — 7.2. 8 cups — 7.3. 10 cups — 7.1. Question: Which choice best completes the columnist's claim? (A) The jump from 2 to 4 cups raised the rating from 4.1 to 5.6. (B) The jump from 4 to 6 cups raised the rating from 5.6 to 7.2. (C) Beyond 6 cups, ratings moved only from 7.2 to 7.3 to 7.1 — essentially flat. (D) At 10 cups per day, the average rating was 7.1, the second-highest value recorded.`, solution: '(C)' },
      relatedLoIds: ['dsat.quantitative-evidence'],
    },
  ],
  pointers: [
    { content: `The best evidence is the data point that matches EVERY part of the claim — the right category, the right measure, the right direction — not just the most impressive number. A record-high or record-low value can be a true, verifiable fact from the table and still fail to support the SPECIFIC claim being tested. Turn the claim into a checklist (who/what group, which measure, which direction) and test each choice against all of it before choosing.`, kind: 'common-error' },
    { content: `Quantitative evidence questions pair a claim with a table or graph — the right choice is the data point that precisely matches the claim, not the biggest or most memorable number.`, kind: 'tip' },
    { content: `Turn the claim into a checklist (group, measure, direction) before scanning choices; a correct data point must satisfy ALL parts, not just one.`, kind: 'tip' },
    { content: `Watch for wrong-row/column and reversed-direction traps: real numbers pulled from the right table but describing a different range, group, or trend than the claim states.`, kind: 'tip' },
    { content: `A true, verifiable fact about the data can still be the WRONG answer if it doesn't complete the specific claim asked about.`, kind: 'tip' },
    { content: `Comparative claims need a comparison IN the answer. If the claim says "bigger drop than the others," a choice that only reports the target group's numbers is true but incomplete. The winner either cites the rival figures or says "the largest/smallest of the three."`, kind: 'gotcha' },
    { content: `Read the stem's exact verb: "raw increase" vs "percent increase" are different winners. 12,000→19,000 is +7,000 (58%); 20,000→23,000 is +3,000 (15%). If the claim says "greatest percentage growth," the biggest raw jump can be the trap.`, kind: 'edge-case' },
    { content: `Watch the completion-style stem: "most effectively uses data from the table to complete the statement." The blank follows a signal like *for example* or *specifically* — so the answer must be an INSTANCE of the claim, not a new or broader fact.`, kind: 'vocab-note' },
    { content: `When the claim links TWO variables (attendance AND satisfaction, dose AND response), the correct choice must cite both columns. A choice giving only one column — even the right row — fails the checklist.`, kind: 'common-error' },
    { content: `With declining data, flip your instincts: the group with the LOWEST final value may not have the biggest drop. Compute the change for every row before ranking — don't rank by the ending numbers.`, kind: 'gotcha' },
    { content: `Check the header row and units before trusting a number: columns can mix percent vs. count, or say "in thousands." A distractor may quote 23 when the table means 23,000, or call a percentage a raw total.`, kind: 'common-error' },
    { content: `Eliminate any choice that explains WHY. The data can only describe what happened; wording like "because the program worked" or "proving coaching causes gains" goes beyond the table and is wrong even if the numbers cited are right.`, kind: 'tip' },
    { content: `In graph versions, hit the legend and axis labels before the choices. Distractors swap the two series (coached vs. control), read the wrong axis, or quote a point from a year the claim never mentions.`, kind: 'edge-case' },
  ],
};
