/**
 * Digital SAT — Unit 3 CED 3.5: Probability & Conditional Probability from Tables.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.probability.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U3_PROBABILITY: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.probability.v1',
  course: 'Digital SAT',
  cedUnit: 3,
  cedTopic: '3.5',
  cedTitle: 'Probability & Conditional Probability from Tables',
  planId: 'evelyn.testprep.dsat.probability.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.probability.v1' }],
  theory: [
    { loId: 'dsat.probability', content: `READ THE TABLE FIRST. A two-way table crosses two categorical variables (rows × columns) with row totals, column totals, and a grand total in the corner. Identify what each row and each column represents before touching a fraction.` },
    { loId: 'dsat.probability', content: `SIMPLE PROBABILITY = one row or column total over the GRAND total. "What fraction of everyone surveyed is in category X?" uses the grand total as the denominator.` },
    { loId: 'dsat.probability', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — "GIVEN THAT" MEANS RESTRICT FIRST. The phrase "given that X" tells you to throw away everyone NOT in X, then compute using ONLY that restricted group as the denominator. Using the grand total instead of the restricted total is the single most common wrong answer on these questions.` },
    { loId: 'dsat.probability', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — DIRECTION MATTERS. P(A given B) and P(B given A) share the SAME joint cell in the numerator but use DIFFERENT denominators (B's total vs A's total) — they are almost never equal. Find which category the "given" applies to; that category's total is the denominator, and the OTHER category is what you're finding the probability of.` },
    { loId: 'dsat.probability', content: `ROW-CONDITION vs COLUMN-CONDITION. If the "given" category is a row label, restrict to that row's total. If it's a column label, restrict to that column's total.` },
    { loId: 'dsat.probability', content: `"OR" QUESTIONS — add every cell that satisfies EITHER condition (counting any overlap only once) over the grand total; equivalently, 1 minus the probability of neither. TRAP: naively adding the two marginal probabilities double-counts the overlap cell.` },
    { loId: 'dsat.probability', content: `DESMOS DOESN'T BUILD THE TABLE. There's no calculator shortcut for reading a table — organize the two numbers you need (the restricted total and the target cell or cell-sum), then divide.` },
    { loId: 'dsat.probability', kind: 'definition', title: 'conditional probability', content: `the probability of an event GIVEN that another event has already happened — restrict to that group before computing the fraction.` },
    { loId: 'dsat.probability', kind: 'definition', title: 'marginal total', content: `a row or column total in a two-way table — the count in that category regardless of the other variable.` },
    { loId: 'dsat.probability', kind: 'definition', title: 'joint frequency', content: `the count in a single interior cell of a two-way table — satisfies BOTH the row and column condition at once.` },
  ],
  methods: [
    {
      title: 'Worked typical',
      steps: [
        `The condition is "given that the employee works remotely" — remote is a ROW, so restrict to the Remote row: 90 employees total.`,
        'Within that restricted group of 90, 18 are managers.',
        `P(manager | remote) = 18 / 90 = 1/5 = 0.2. Note the denominator is 90 (the Remote row total), NOT 150 (the grand total).`,
      ],
      example: { problem: `A company surveyed 150 employees on work location and role. Results: Remote employees — 18 managers, 72 not managers (90 total). In-office employees — 12 managers, 48 not managers (60 total). Column totals: 30 managers, 120 not managers, 150 overall. One employee is selected at random from the 150 surveyed. What is the probability that the employee is a manager, given that the employee works remotely?`, solution: '1/5 (0.2)' },
      relatedLoIds: ['dsat.probability'],
    },
    {
      title: 'Worked reversal trap',
      steps: [
        `The condition flipped: now it's "given that the employee is a manager" — manager is a COLUMN, so restrict to the Manager column: 30 employees total (NOT the 90 from the last problem).`,
        'Within that restricted group of 30 managers, 18 work remotely.',
        `P(remote | manager) = 18 / 30 = 3/5 = 0.6. Same joint cell (18) as the previous problem, but a completely different answer (0.6 vs 0.2) because the denominator changed. This is why direction matters — always re-identify the condition for each question.`,
      ],
      example: { problem: `Same 150-employee table: Remote — 18 managers, 72 not managers (90 total). In-office — 12 managers, 48 not managers (60 total). Column totals: 30 managers, 120 not managers, 150 overall. Now find: what is the probability that the employee works remotely, given that the employee is a manager?`, solution: '3/5 (0.6)' },
      relatedLoIds: ['dsat.probability'],
    },
  ],
  pointers: [
    { content: `The word "given" means restrict to that group FIRST. 25 cat-owning dog owners out of 40 dog owners = 25/40 = 5/8. The 100 grand total is irrelevant once the condition restricts the population.`, kind: 'common-error' },
    { content: `"Given that" = restrict to that row or column FIRST; the denominator is the restricted total, not the grand total.`, kind: 'tip' },
    { content: `Direction matters: P(A given B) restricts to B's total; P(B given A) restricts to A's total — same table, different denominators, usually different answers.`, kind: 'tip' },
    { content: `"Or" probabilities: add the relevant cells directly (counting any overlap once), or use 1 minus the probability of neither — don't add the two marginal probabilities and double-count the overlap.`, kind: 'tip' },
    { content: `Desmos won't organize the table for you — identify the restricted total and the target cell (or cell-sum) first, then divide.`, kind: 'tip' },
    { content: `Wrong answers are engineered from your likely errors: the grand-total version (18/150), the reversed-direction version (18/30), and the complement (72/90) are all sitting in the choices. Getting a "nice" number is zero evidence you conditioned correctly.`, kind: 'gotcha' },
    { content: `"Given that," "of those who," "among the," and "from the group who..." all mean the same thing: restrict. The SAT often drops "given" entirely — "Of the employees who work remotely, what fraction are managers?" is a conditional question in disguise.`, kind: 'vocab-note' },
    { content: `Watch the setup sentence: "selected at random from the 150 surveyed" vs "selected at random from those who work remotely." The second one puts the condition in the SETUP, not the question — the denominator is 90 even though the question never says "given."`, kind: 'gotcha' },
    { content: `Some tables don't hand you the totals — you may have to add the row or column yourself, or back out a missing cell from a total. Compute the marginal you need before you write the fraction; don't grab a number just because it's on the edge of the table.`, kind: 'edge-case' },
    { content: `Before dividing, say the fraction out loud as "___ out of ___." If the top group isn't fully inside the bottom group, you've built it wrong. 18 managers out of 30 managers ✓. 18 managers out of 120 non-managers ✗.`, kind: 'tip' },
    { content: `Don't add the two marginals for OR. In the sport/chemistry table, 60/180 + 70/180 = 130/180 double-counts the 25 who do both. Either subtract the overlap (60+70−25=105) or count non-sport-no-chem (75) and do 1 − 75/180.`, kind: 'common-error' },
    { content: `"Neither" and "not A" questions: the target is a cell or cell-sum, not a total. "Probability the student takes no chemistry, given they play a sport" = 35/60 — restrict first, THEN take the not-column within that row.`, kind: 'edge-case' },
    { content: `Percent versions ask for the answer as a percent or say "approximately what percent" — convert and round only at the end, and check whether the question wants percent of the restricted group or of everyone surveyed. Those give different numbers.`, kind: 'common-error' },
  ],
};
