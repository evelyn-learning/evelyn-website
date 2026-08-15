/**
 * Digital SAT — Unit 1 CED 1.2: Linear Functions & Interpreting Slope/Intercept.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.linear-functions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U1_LINEAR_FUNCTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.linear-functions.v1',
  course: 'Digital SAT',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Linear Functions & Interpreting Slope/Intercept',
  planId: 'evelyn.testprep.dsat.linear-functions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.linear-functions.v1' }],
  theory: [
    { loId: 'dsat.linear-functions', content: `FORM & MEANING — y = mx + b (or f(x) = mx + b). m is the slope: the rate of change of y per unit increase in x. b is the y-intercept: the value of y when x = 0.` },
    { loId: 'dsat.linear-functions', kind: 'framework', title: 'Slope from two points or a table', content: `SLOPE FROM TWO POINTS OR A TABLE — m = (y₂ − y₁)/(x₂ − x₁) = Δy/Δx. Pick any two rows of a table; if the function is truly linear, every consecutive Δy/Δx matches.` },
    { loId: 'dsat.linear-functions', kind: 'framework', title: 'Slope from a graph', content: `SLOPE FROM A GRAPH — read the intercept where the line crosses the y-axis; read the slope as rise/run between two clearly plotted points.` },
    { loId: 'dsat.linear-functions', kind: 'framework', title: 'Interpreting in context', content: `INTERPRETING IN CONTEXT — the SAT's favorite question type: "which statement best describes what [number] means in this context?" Match slope to "per unit" language and intercept to "the value when [x-quantity] is 0" — and always attach the correct UNITS to each.` },
    { loId: 'dsat.linear-functions', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — THE INTERCEPT ISN'T ALWAYS "THE BEGINNING." If x is defined as "years since 2015," the intercept is the value IN 2015, not at some absolute zero point. Always check what x = 0 actually represents in the story before interpreting b.` },
    { loId: 'dsat.linear-functions', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — SIGN OF THE SLOPE. "Increasing," "growing," "more" mean positive slope; "decreasing," "depreciating," "less" mean negative slope. Reporting only the magnitude and skipping the sign flips the meaning entirely.` },
    { loId: 'dsat.linear-functions', kind: 'framework', title: 'Function-notation variant', content: `FUNCTION-NOTATION VARIANT — the same skill written as f(x) = mx + b. f(0) = b, and evaluating f(k) is a plug-in. "Which function has the greater rate of change?" is just comparing two m values across an equation, table, and/or graph.` },
    { loId: 'dsat.linear-functions', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — since Desmos is available on every math question, typing the modeled equation in and tracing two points is a fast way to confirm a slope or intercept before committing to an interpretation.` },
    { loId: 'dsat.linear-functions', kind: 'definition', title: 'slope', content: `the rate of change of a linear function: Δy/Δx, constant between any two points on the line.` },
    { loId: 'dsat.linear-functions', kind: 'definition', title: 'y-intercept', content: 'the value of y (or f(x)) when x = 0 — where the line crosses the y-axis.' },
    { loId: 'dsat.linear-functions', kind: 'definition', title: 'rate of change', content: `the real-world meaning of slope in a modeled context, e.g. dollars per month or centimeters per hour.` },
  ],
  methods: [
    {
      title: 'Worked typical',
      steps: [
        'Slope: m = (9 − 18)/(5 − 2) = −9/3 = −3.',
        'Use the point (2, 18) to solve for b: 18 = −3(2) + b → 18 = −6 + b → b = 24.',
        'Function: h(t) = −3t + 24.',
        `Interpret: slope −3 means the candle burns down 3 cm per hour; intercept 24 means the candle started at 24 cm (its height at t = 0).`,
      ],
      example: { problem: `A candle burns at a constant rate. After 2 hours it is 18 cm tall; after 5 hours it is 9 cm tall. Write a linear function h(t) for height in centimeters after t hours, and interpret the slope and intercept.`, solution: `h(t) = −3t + 24; slope = −3 cm/hour (burn rate), intercept = 24 cm (starting height).` },
      relatedLoIds: ['dsat.linear-functions'],
    },
    {
      title: 'Worked context trap',
      steps: [
        'The intercept b = 50 is the value of F when y = 0.',
        `y = 0 corresponds to the year 2015, because y is defined as years SINCE 2015 — not "the beginning of the lake's history."`,
        `TRAP: a student who doesn't check what y = 0 means in context might think the intercept describes when the population "started," but the variable only measures years from 2015 onward.`,
        'So F(0) = 50 hundred fish = 5,000 fish is the population in 2015.',
      ],
      example: { problem: `A lake's fish population F, in hundreds of fish, is modeled by F = −3y + 50, where y is the number of years since 2015. What does the value 50 represent, and what was the population in 2015?`, solution: `50 represents the population, in hundreds of fish, in 2015; actual population = 5,000 fish.` },
      relatedLoIds: ['dsat.linear-functions'],
    },
  ],
  pointers: [
    { content: `The slope is −2200, which is NEGATIVE — the value DECREASES by $2,200 each year. A negative slope always means the output falls as the input rises; check the sign, not just the number, before interpreting.`, kind: 'common-error' },
    { content: `y = mx + b (or f(x) = mx + b): m is the slope (rate of change), b is the y-intercept (value when x = 0).`, kind: 'tip' },
    { content: `Slope from two points or table rows: m = Δy/Δx — the same ratio between ANY two points on the line.`, kind: 'tip' },
    { content: `When interpreting in context, check what x = 0 actually represents in the story, and attach the correct units to both slope and intercept.`, kind: 'tip' },
    { content: `Check the SIGN of the slope: negative means decreasing, not increasing — don't report only the magnitude.`, kind: 'tip' },
    { content: `Watch scaled units: "P, in thousands" or "F, in hundreds of fish" means the intercept 50 is 5,000, not 50. The SAT plants an answer choice with the raw number un-scaled. Re-read the variable definition line before picking.`, kind: 'gotcha' },
    { content: `Slope answer choices often differ only by the noun: "increases by 15 dollars per day" vs "increases by 15 days per dollar." The rate is always output-per-input — y-units over x-units. Say it out loud in that order before choosing.`, kind: 'common-error' },
    { content: `Δy/Δx needs the SAME order in both differences. If you use (y₂−y₁) on top, use (x₂−x₁) on the bottom. Flipping one gives a slope with the wrong sign — and a wrong-sign slope always has a waiting answer choice.`, kind: 'common-error' },
    { content: `For f(0) from two function values, don't always solve for b algebraically — step backward by the slope. f(2)=11, m=4 → go back 2 units: 11 − 2(4) = 3. Faster and fewer sign errors on student-produced responses.`, kind: 'tip' },
    { content: `"Years since 2015," "months after the study began," "hours after noon" — whenever x is defined as a shift, x = 0 is that reference moment, not zero on any real clock. Also, a *negative* x value is legal and means BEFORE the reference point.`, kind: 'edge-case' },
    { content: `Only linear tables have a constant Δy/Δx. If table x-values are unevenly spaced (0, 2, 5, 9), divide by the actual Δx — don't just subtract consecutive y's and call that the slope.`, kind: 'gotcha' },
    { content: `"Best interprets" questions: the wrong choices usually swap slope and intercept meanings. Test each with x = 0 — the intercept statement must be true at the very start, the slope statement must contain "per" or "each."`, kind: 'tip' },
    { content: `"Rate of change" and "slope" are the same number, but the SAT also says "greatest rate of change" when comparing a table, a graph, and an equation. Compare |m| only if the question says "changes fastest"; otherwise negative slopes are genuinely smaller.`, kind: 'vocab-note' },
  ],
};
