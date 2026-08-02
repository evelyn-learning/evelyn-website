/**
 * ACT — Unit 4 CED 4.2: Trends, Interpolation & Extrapolation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.trends-extrapolation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U4_TRENDS_EXTRAPOLATION: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.trends-extrapolation.v1',
  course: 'ACT',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Trends, Interpolation & Extrapolation',
  planId: 'evelyn.testprep.act.trends-extrapolation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.trends-extrapolation.v1' }],
  theory: [
    { loId: 'act.trends-extrapolation', content: `DIRECT RELATIONSHIP: as one variable increases, the other increases too (both go up together, or both go down together).` },
    { loId: 'act.trends-extrapolation', content: 'INVERSE RELATIONSHIP: as one variable increases, the other decreases.' },
    { loId: 'act.trends-extrapolation', content: `INTERPOLATION: estimating a value for an x between two x-values you already have data for. Usually SAFE — the trend is confirmed on both sides of your target.` },
    { loId: 'act.trends-extrapolation', content: `EXTRAPOLATION: estimating a value for an x outside the entire range of data given. Riskier — you're assuming the same relationship (and the same underlying mechanism) keeps holding past where anyone actually measured it.` },
    { loId: 'act.trends-extrapolation', content: `METHOD: find the two nearest known points, compute the rate of change between them (change in y ÷ change in x), then apply that rate to your target x.` },
    { loId: 'act.trends-extrapolation', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — STRAIGHT-LINE OVERREACH: extending a linear trend far past the data without checking for a note about the process leveling off, reversing, or saturating (common ACT Science passage language: "activity plateaus," "approaches a maximum," "levels off").` },
    { loId: 'act.trends-extrapolation', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — DIRECTION FLIP: misreading an inverse trend as direct (or vice versa) and adding when you should subtract, or subtracting when you should add.` },
    { loId: 'act.trends-extrapolation', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — WRONG NEIGHBORS: interpolating using the two nearest ROWS as printed, instead of the two nearest x-VALUES to your target — same condition-matching discipline as basic lookup, now applied to estimation.` },
    { loId: 'act.trends-extrapolation', kind: 'definition', title: 'interpolation', content: 'estimating a value between two data points that were actually measured.' },
    { loId: 'act.trends-extrapolation', kind: 'definition', title: 'extrapolation', content: 'estimating a value beyond the full range of measured data.' },
    { loId: 'act.trends-extrapolation', kind: 'definition', title: 'direct relationship', content: 'both variables increase together (or decrease together).' },
    { loId: 'act.trends-extrapolation', kind: 'definition', title: 'inverse relationship', content: 'one variable increases as the other decreases.' },
  ],
  methods: [
    {
      title: 'Worked interpolation',
      steps: [
        `Hour 4.5 falls BETWEEN two measured points (hour 3 and hour 6) — this is interpolation, so the trend is confirmed on both sides.`,
        `Identify the relationship: as time increases, mass increases — direct relationship.`,
        `Compute the rate between the nearest known points: from hour 3 (10 g) to hour 6 (16 g), mass rose 6 g over 3 hr = 2 g/hr.`,
        `Apply the rate: hour 4.5 is 1.5 hr past hour 3, so add 2 g/hr × 1.5 hr = 3 g to 10 g.`,
        'Sanity-check: 13 g sits neatly between 10 g (hour 3) and 16 g (hour 6). ✓',
      ],
      example: { problem: `Table 1 tracks a crystal's mass as it grows. Time (hr): 0, 3, 6, 9; Mass (g): 4, 10, 16, 22. Based on Table 1, the crystal's mass at hour 4.5 is closest to what value?`, solution: '13 g' },
      relatedLoIds: ['act.trends-extrapolation'],
    },
    {
      title: 'Worked extrapolation trap',
      steps: [
        `The measured trend (minutes 0–15) is inverse and linear: temperature falls 4°C/min (80 → 60 → 40 → 20).`,
        `A pure straight-line extrapolation to minute 30 (15 min past the last data point) gives 20 − 4×15 = −40°C.`,
        `But minute 30 is well OUTSIDE the measured range, and the passage explicitly flags a mechanism limit: the liquid cannot cool below room temperature (22°C).`,
        `The straight-line answer (−40°C) ignores that note — this is the classic extrapolation trap.`,
        `A reasonable estimate instead: the cooling rate slows as the liquid nears 22°C, so temperature at minute 30 is somewhat above 22°C, not below it — nowhere near −40°C.`,
      ],
      example: { problem: `Table 2 tracks a cooling liquid. Time (min): 0, 5, 10, 15; Temperature (°C): 80, 60, 40, 20. A note in the passage states the liquid cools toward, and never below, room temperature (22°C). A student extrapolates the straight-line trend to minute 30 and predicts −40°C. What is wrong with that prediction, and what is a more reasonable estimate?`, solution: `Somewhat above 22°C (room temperature) — not −40°C; the straight-line extrapolation ignores the passage's stated cooling limit.` },
      relatedLoIds: ['act.trends-extrapolation'],
    },
  ],
  pointers: [
    { content: `Interpolation is usually safe because the trend is confirmed by data on BOTH sides of your target. Extrapolation is riskier because you are assuming — not confirming — that the same relationship and mechanism continue; real processes often plateau, reverse, or change slope outside the tested range, and ACT passages frequently say so directly.`, kind: 'common-error' },
    { content: `Direct relationship: both variables rise (or fall) together. Inverse: one rises as the other falls.`, kind: 'tip' },
    { content: `Interpolation (between two measured points) is usually safe — the trend is confirmed on both sides.`, kind: 'tip' },
    { content: `Extrapolation (beyond the measured data) is riskier — watch for passage language about leveling off, saturating, or hitting a limit.`, kind: 'tip' },
    { content: `Always compute the rate of change between the two known points nearest your target before estimating.`, kind: 'tip' },
    { content: `Answer choices themselves reveal the trend direction. If your target x sits between two measured x's, the correct value must fall BETWEEN their y-values — cross off any choice outside that bracket before doing any arithmetic. Often only one choice survives.`, kind: 'tip' },
    { content: `"Closest to" and "approximately" in the stem mean the ACT wants an estimate, not exact math. Spread-out choices (e.g., 13 / 25 / 40 / 55) signal you can eyeball the midpoint; tightly spaced choices (12 / 13 / 14) mean actually compute the rate.`, kind: 'tip' },
    { content: `Non-uniform x-spacing is the hidden trap. If Time reads 0, 5, 10, 20, 40, the y-gaps are NOT comparable gaps — you must divide by the actual Δx each time. Never assume consecutive rows are equally spaced in x.`, kind: 'gotcha' },
    { content: `Watch for tables sorted descending or by a non-x column. "Two nearest rows" ≠ "two nearest x-values" when rows are ordered by trial number or grouped by condition. Locate your target x on the axis/column first, then pick neighbors.`, kind: 'common-error' },
    { content: `A trend can be direct AND still slow down. "Increases, but by smaller and smaller amounts" is still direct — it's curving, not inverse. Don't call a decelerating rise an inverse relationship just because the gaps shrink.`, kind: 'vocab-note' },
    { content: `For curved (non-linear) data, use only the two points flanking your target — not the overall average rate across the whole table. Averaging the first and last rows of a curve gives a value the ACT plants as a wrong choice.`, kind: 'edge-case' },
    { content: `Extrapolation limits often live in the passage text or a figure footnote, not the table. Before extending a trend past the last data point, scan for words like *plateaus, saturates, maximum, cannot exceed, approaches, threshold* — one sentence can invalidate your arithmetic.`, kind: 'gotcha' },
    { content: `Physical floors and ceilings still apply even with no passage note: mass, concentration, count, and volume can't go negative; percentages can't exceed 100. If a straight-line extrapolation gives an impossible value, the trend must bend.`, kind: 'edge-case' },
  ],
};
