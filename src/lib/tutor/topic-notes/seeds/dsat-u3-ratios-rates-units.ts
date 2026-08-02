/**
 * Digital SAT — Unit 3 CED 3.1: Ratios, Rates, Proportions & Unit Conversion.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.ratios-rates-units.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U3_RATIOS_RATES_UNITS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.ratios-rates-units.v1',
  course: 'Digital SAT',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Ratios, Rates, Proportions & Unit Conversion',
  planId: 'evelyn.testprep.dsat.ratios-rates-units.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.ratios-rates-units.v1' }],
  theory: [
    { loId: 'dsat.ratios-rates-units', kind: 'framework', title: 'Ratio language', content: `RATIO LANGUAGE — "a to b" or a:b compares PARTS, not a fraction of the total directly. TRAP — PARTS VS FRACTION OF WHOLE: if apples:oranges = 4:7, apples are 4 OUT OF 4+7=11 TOTAL PARTS (4/11 of the total), NOT 4/7.` },
    { loId: 'dsat.ratios-rates-units', kind: 'framework', title: 'Ratio order trap', content: `RATIO ORDER TRAP — the question sets the order. "Ratio of red to blue" must stay red:blue. Reducing 12:18 to 2:3 is fine; flipping it to 3:2 answers the wrong question.` },
    { loId: 'dsat.ratios-rates-units', kind: 'framework', title: 'Proportion setup', content: `PROPORTION SETUP — a/b = c/d, cross-multiply to get ad = bc. Keep the SAME quantity in the SAME position in both fractions (both numerators the same unit, both denominators the same unit) before cross-multiplying — swapping a position silently inverts the answer.` },
    { loId: 'dsat.ratios-rates-units', content: `RATE = quantity per unit (miles per hour, pages per second, dollars per item). Write it as a fraction with units attached; a rate and its reciprocal (miles per hour vs. hours per mile) are easy to confuse — check that your final units match what the question asks for.` },
    { loId: 'dsat.ratios-rates-units', kind: 'framework', title: 'Conversion factor trap', content: `CONVERSION FACTOR TRAP — the SAT often supplies the exact factor to use ("1 kilometer = 0.621 mile"). Use that number, not a memorized approximation, and sanity-check direction: converting to a BIGGER unit should shrink the number (multiply by the given decimal), converting to a SMALLER unit should grow it (divide by the given decimal, or multiply by its reciprocal).` },
    { loId: 'dsat.ratios-rates-units', kind: 'framework', title: 'Combined work/rate', content: `COMBINED WORK/RATE — if A finishes a job in a hours and B finishes it in b hours, their combined rate is 1/a + 1/b (job per hour). Combined TIME is the RECIPROCAL of that sum, not the sum of the times.` },
    { loId: 'dsat.ratios-rates-units', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — the built-in calculator is available on every math question. Typing a division or a proportion as two lines and reading the value (or intersection) is a legitimate 15-second verification of a cross-multiplied answer.` },
    { loId: 'dsat.ratios-rates-units', kind: 'definition', title: 'ratio', content: `a comparison of two quantities by division, written a:b or a/b, preserving the order the question states.` },
    { loId: 'dsat.ratios-rates-units', kind: 'definition', title: 'proportion', content: 'an equation stating two ratios are equal: a/b = c/d.' },
    { loId: 'dsat.ratios-rates-units', kind: 'definition', title: 'unit rate', content: `a rate expressed per a single unit of the other quantity, e.g. dollars per 1 item.` },
    { loId: 'dsat.ratios-rates-units', kind: 'definition', title: 'dimensional analysis', content: `converting units by multiplying by conversion-factor fractions arranged so the unwanted units cancel.` },
  ],
  methods: [
    {
      title: 'Worked direct proportion',
      steps: [
        `Set up a proportion keeping gadgets over hours on both sides: 180 gadgets / 4 hours = x gadgets / 10 hours.`,
        'Cross-multiply: 4x = 180 × 10 = 1800.',
        'x = 450 gadgets.',
        'Sanity check: 10 hours is 2.5× the original 4 hours, and 180 × 2.5 = 450. ✓',
      ],
      example: { problem: `A factory produces 180 gadgets every 4 hours, working at a constant rate. At this rate, how many gadgets does it produce in 10 hours?`, solution: '450 gadgets' },
      relatedLoIds: ['dsat.ratios-rates-units'],
    },
    {
      title: 'Worked reciprocal trap',
      steps: [
        `Keep the SAME quantity in the SAME position in both ratios: pages over seconds on both sides — 5 pages / 2 seconds = 300 pages / x seconds.`,
        `TRAP — flipping the setup to seconds/pages = pages/seconds inverts the proportion and produces a nonsense result (more pages finishing FASTER). A quick magnitude check catches it: more pages must take MORE time.`,
        'Cross-multiply correctly: 5x = 2 × 300 = 600.',
        'x = 120 seconds.',
      ],
      example: { problem: `A printer produces 5 pages every 2 seconds, working at a constant rate. At this rate, how many seconds does it take to produce 300 pages?`, solution: '120 seconds' },
      relatedLoIds: ['dsat.ratios-rates-units'],
    },
  ],
  pointers: [
    { content: `The question asks red TO blue, so red must come first: 12:18 reduces to 2:3, not 3:2. Always match the order the question states, even after simplifying.`, kind: 'common-error' },
    { content: `Ratio a:b means a parts to b parts; total parts = a + b — a part is a fraction of the TOTAL parts, not of the other quantity.`, kind: 'tip' },
    { content: `Set up proportions with matching quantities in matching positions before cross-multiplying; a swapped position silently inverts the answer.`, kind: 'tip' },
    { content: `When the SAT gives a conversion factor, use that exact number and sanity-check the direction — bigger target unit shrinks the number, smaller target unit grows it.`, kind: 'tip' },
    { content: `Combined work/rate: add the individual rates (1/timeA + 1/timeB), then take the reciprocal to get the combined time.`, kind: 'tip' },
    { content: `Three-term ratios show up: "red:blue:green = 2:3:5" means 10 total parts. Find the value of ONE part (total ÷ 10) and multiply — don't try to build a two-way proportion. Same move when a question gives you one quantity instead of the total.`, kind: 'tip' },
    { content: `Read the last five words of the question before you compute. "How many MORE oranges than apples," "what is the TOTAL," "how many apples" — the ratio work is identical but the final answer differs, and all three values sit in the choices.`, kind: 'gotcha' },
    { content: `Squared/cubed units need the factor applied twice or three times. 1 ft = 12 in means 1 ft² = 144 in², not 12 in². Watch for area, volume, and "per square meter" density problems.`, kind: 'edge-case' },
    { content: `For rate conversions like km/h → mi/min, convert one unit at a time with chained fractions and cancel visibly. Doing it in one mental step almost always multiplies where you should divide.`, kind: 'common-error' },
    { content: `Combined work: if the answer equals a + b or (a+b)/2, you added times instead of rates. The true combined time must be SMALLER than the faster worker's solo time — check that before bubbling.`, kind: 'gotcha' },
    { content: `"At this rate" / "at a constant rate" is the SAT's signal that a single proportion works. Without it — e.g. tiered pricing, a flat fee plus per-unit charge — proportional scaling is wrong; that's a linear model (y = mx + b).`, kind: 'vocab-note' },
    { content: `A ratio alone never gives actual amounts. If a problem says only "the ratio is 3:5" with no total and no one quantity, the answer must be another ratio or an expression — don't invent numbers like 3 and 5.`, kind: 'edge-case' },
    { content: `Round only at the end. Carry the full decimal (18 × 0.621 = 11.178) in Desmos and round once; rounding a conversion factor or an intermediate step mid-problem can push you into the adjacent wrong choice.`, kind: 'common-error' },
  ],
};
