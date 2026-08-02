/**
 * ACT — Unit 4 CED 4.6: Scientific Math & Units in Context.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.scientific-math-units.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U4_SCIENTIFIC_MATH_UNITS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.scientific-math-units.v1',
  course: 'ACT',
  cedUnit: 4,
  cedTopic: '4.6',
  cedTitle: 'Scientific Math & Units in Context',
  planId: 'evelyn.testprep.act.scientific-math-units.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.scientific-math-units.v1' }],
  theory: [
    { loId: 'act.scientific-math-units', kind: 'framework', title: 'No calculator', content: `NO CALCULATOR — and that is a clue, not a curse. If your arithmetic feels ugly, you have either misread the table or should be rounding, not grinding out exact digits.` },
    { loId: 'act.scientific-math-units', content: `ROUND EARLY. Round table values to numbers that multiply and divide cleanly (48 → 50, 297 → 300) before you compute. ACT answer choices are spaced far enough apart that a rounded estimate still lands on exactly one of them.` },
    { loId: 'act.scientific-math-units', content: `SET UP A RATIO, DON'T MEMORIZE A FORMULA. Most "calculate" questions are a proportion between two rows of a table: find the rate/ratio from ONE row, then scale it by the same factor to reach the row (or value) the question asks about.` },
    { loId: 'act.scientific-math-units', content: `TRACK UNITS AT EVERY STEP. Write (or say) the unit next to every number as you compute. If the units left in your final number don't match what the question asks for, you are not done — you skipped a conversion.` },
    { loId: 'act.scientific-math-units', content: `CONVERT EVERY UNIT NAMED, NOT JUST THE OBVIOUS ONE. A question can ask you to convert time (minutes → hours) AND volume (mL → L) in the same problem. Finishing only one conversion is the single most common ACT Science math mistake.` },
    { loId: 'act.scientific-math-units', kind: 'framework', title: 'Trap', content: `TRAP — ORDER OF MAGNITUDE: an answer choice will have the right digits but the decimal point (or a factor of 10, 60, or 1000) in the wrong place. These exist specifically to catch a skipped conversion.` },
    { loId: 'act.scientific-math-units', kind: 'framework', title: 'Trap', content: `TRAP — BIGGER RAW NUMBER: concentration, density, and rate are all RATIOS (amount per unit), not raw totals. A distractor picks whichever sample has the larger raw amount instead of the larger ratio.` },
    { loId: 'act.scientific-math-units', content: `IF A FORMULA APPEARS IN THE PASSAGE, USE IT AS GIVEN. ACT Science math never requires outside formulas — every relationship you need to compute with is stated or is directly readable from the table.` },
    { loId: 'act.scientific-math-units', kind: 'definition', title: 'ratio / proportion', content: `a comparison of two quantities that scales together — find it from one table row, then scale it to answer about another.` },
    { loId: 'act.scientific-math-units', kind: 'definition', title: 'unit conversion factor', content: `a multiplier (like 1000 mL = 1 L, or 60 min = 1 hr) used to switch a value from one unit to an equivalent value in another.` },
    { loId: 'act.scientific-math-units', kind: 'definition', title: 'order of magnitude', content: `the power-of-ten size of a number; an order-of-magnitude trap answer is off by a factor of 10, 60, or 1000 from the correct value.` },
  ],
  methods: [
    {
      title: 'Worked rate conversion',
      steps: [
        `Find the rate from the table: 40 mL in 5 min is 8 mL per minute (check it: 80/10 = 8, 120/15 = 8, 160/20 = 8 — consistent).`,
        'Set up the ratio to the target time: 8 mL/min × 60 min = 480 mL.',
        `Check units against the question: the question asks for LITERS, and 480 is in mL — not done yet.`,
        'Convert mL to L: 480 mL ÷ 1000 = 0.48 L.',
        `Sanity check with the table pattern: 60 min is 4× the 15-min row (120 mL), and 4 × 120 = 480 mL. ✓`,
      ],
      example: { problem: `A collector gathered rainwater at a constant rate. Table 1 — Time (min): 5, 10, 15, 20; Volume collected (mL): 40, 80, 120, 160. Based on Table 1, if the rate stayed constant, how many total liters would be collected after 60 minutes?`, solution: '0.48 L' },
      relatedLoIds: ['act.scientific-math-units'],
    },
    {
      title: 'Worked ratio trap',
      steps: [
        `Density is a RATIO (mass ÷ volume), not the raw mass — the student is falling for the bigger-raw-number trap.`,
        'Compute Sample A: 12 g ÷ 4 mL = 3 g/mL.',
        'Compute Sample B: 18 g ÷ 9 mL = 2 g/mL.',
        `Compare the ratios, not the raw masses: 3 g/mL > 2 g/mL, so Sample A is denser even though it has the smaller mass.`,
        `The student is WRONG — a larger raw mass does not mean a larger density unless the volume scales the same way.`,
      ],
      example: { problem: `A passage gives the formula Density = mass ÷ volume. Table 2 — Sample A: mass 12 g, volume 4 mL. Sample B: mass 18 g, volume 9 mL. A student claims "Sample B is denser because it has more mass." Based on Table 2, is the student correct, and which sample is actually denser?`, solution: 'The student is incorrect; Sample A is denser (3 g/mL vs. 2 g/mL for Sample B).' },
      relatedLoIds: ['act.scientific-math-units'],
    },
  ],
  pointers: [
    { content: `Finish BOTH conversions named by the question: 250 mL/min × 60 min = 15,000 mL/hr, then divide by 1000 to get 15 L/hr. Whenever a question names two units to convert, check off both before picking a choice.`, kind: 'common-error' },
    { content: `No calculator: round table values to clean numbers and estimate — ACT answer choices are spaced apart enough for this to work.`, kind: 'tip' },
    { content: `Set up unit-based questions as a ratio from one table row, then scale by the same factor to reach the value the question asks about.`, kind: 'tip' },
    { content: `Convert EVERY unit named in the question and the answer choices, not just the first one you notice.`, kind: 'tip' },
    { content: `Concentration, density, and rate are ratios, not raw amounts — compare the ratio, not whichever sample has the bigger number.`, kind: 'tip' },
    { content: `Read the UNITS in the answer choices before you compute. If choices are in L/hr but the table is in mL/min, the conversions are announced right there — that scan takes 3 seconds and prevents the order-of-magnitude trap entirely.`, kind: 'tip' },
    { content: `If two answer choices differ only by a factor of 10, 60, or 1000, that pair IS the conversion trap. One is the pre-conversion value. Ask which conversion you might have skipped before choosing.`, kind: 'gotcha' },
    { content: `Check the rate is actually constant before scaling. Test two rows (40/5 AND 120/15). If the ratios differ, it's not a proportion question — read the trend and interpolate/extrapolate instead of multiplying.`, kind: 'common-error' },
    { content: `"Per" in a question stem (grams per 100 mL, mL per minute) means DIVIDE, and the word after "per" goes in the denominator. Reversing it — volume ÷ mass instead of mass ÷ volume — produces an answer that's usually listed as a choice.`, kind: 'vocab-note' },
    { content: `Watch for tables already given in scientific notation or with a unit multiplier in the column header ("Mass (×10⁻³ g)", "Volume (thousands of L)"). The header multiplier is part of every value in that column.`, kind: 'edge-case' },
    { content: `A rate can go BACKWARD too: if asked how long to reach a value, divide instead of multiply. 8 mL/min to reach 200 mL is 200 ÷ 8 = 25 min, not 8 × 200.`, kind: 'common-error' },
    { content: `If a passage-given formula has three variables, the question may hand you the OUTPUT and one input and ask for the other. Rearrange the formula as printed — don't hunt for a different equation you half-remember from chemistry.`, kind: 'tip' },
    { content: `Sanity-check magnitude against the table. If 20 min gave 160 mL, an answer for 60 min must be a few hundred mL — a choice reading 4,800 or 0.048 fails the smell test before you check units.`, kind: 'tip' },
  ],
};
