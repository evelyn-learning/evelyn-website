/**
 * Digital SAT — Unit 3 CED 3.6: Sample Statistics, Margin of Error & Evaluating Claims.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.sample-statistics-claims.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U3_SAMPLE_STATISTICS_CLAIMS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.sample-statistics-claims.v1',
  course: 'Digital SAT',
  cedUnit: 3,
  cedTopic: '3.6',
  cedTitle: 'Sample Statistics, Margin of Error & Evaluating Claims',
  planId: 'evelyn.testprep.dsat.sample-statistics-claims.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.sample-statistics-claims.v1' }],
  theory: [
    { loId: 'dsat.sample-statistics-claims', kind: 'framework', title: 'Sample statistic', content: `SAMPLE STATISTIC — a number computed from a sample (a percent, a mean) used to ESTIMATE the true population value, which is almost never known exactly.` },
    { loId: 'dsat.sample-statistics-claims', content: `MARGIN OF ERROR (MOE) — the sample statistic is reported as statistic ± MOE. This defines an interval of plausible values for the population value: low end = statistic − MOE, high end = statistic + MOE.` },
    { loId: 'dsat.sample-statistics-claims', kind: 'framework', title: 'Sample size and precision', content: `SAMPLE SIZE AND PRECISION — a LARGER random sample shrinks the margin of error (a tighter, more precise interval). A larger sample size does NOT fix a biased sampling method — only genuine randomization does that.` },
    { loId: 'dsat.sample-statistics-claims', content: `TWO INDEPENDENT QUESTIONS every SAT study question is really asking: (1) Was the sample chosen RANDOMLY from the population? → if yes, you may GENERALIZE the result to that population. (2) Were subjects RANDOMLY ASSIGNED to groups/treatments? → if yes, you may claim CAUSATION.` },
    { loId: 'dsat.sample-statistics-claims', content: `RANDOM SAMPLING ONLY (no assignment, e.g. a survey or observational study) → you can generalize to the population sampled, but you can only claim an ASSOCIATION, never causation.` },
    { loId: 'dsat.sample-statistics-claims', content: `RANDOM ASSIGNMENT ONLY (e.g. volunteers split into two treatment groups) → you can claim the treatment CAUSED the difference for those subjects, but you canNOT generalize beyond the people in the study.` },
    { loId: 'dsat.sample-statistics-claims', kind: 'framework', title: 'Scope trap', content: `SCOPE TRAP — even when generalization is valid, it only extends to the exact population the sample was drawn FROM (e.g. "students at that one school"), never to a broader group the question tempts you to assume (e.g. "all high school students").` },
    { loId: 'dsat.sample-statistics-claims', content: `CORRELATION ≠ CAUSATION — an observational study can show a strong association and still support zero causal claim without random assignment. The SAT plants a plausible-sounding causal conclusion as a wrong choice almost every time.` },
    { loId: 'dsat.sample-statistics-claims', kind: 'definition', title: 'margin of error', content: `the ± amount added to and subtracted from a sample statistic to give a plausible range for the true population value.` },
    { loId: 'dsat.sample-statistics-claims', kind: 'definition', title: 'random sample', content: `a sample chosen so every member of the population has an equal chance of selection; justifies generalizing results to that population.` },
    { loId: 'dsat.sample-statistics-claims', kind: 'definition', title: 'random assignment', content: `subjects are assigned to treatment groups by chance; justifies claiming the treatment caused an observed difference.` },
    { loId: 'dsat.sample-statistics-claims', kind: 'definition', title: 'observational study', content: `a study that measures subjects without assigning treatments — can show association but never causation.` },
  ],
  methods: [
    {
      title: 'Worked moe interval',
      steps: [
        'The survey reports statistic ± MOE: 46% ± 3 percentage points.',
        'Low end: 46 − 3 = 43. High end: 46 + 3 = 49.',
        `Because the 500 adults were a RANDOM sample, this range generalizes to all adults in the county (not beyond it — not the whole state).`,
      ],
      example: { problem: `A random sample of 500 adults in a county found that 46% plan to attend the county fair, with a margin of error of 3 percentage points. Based on this survey, what is the range of plausible values, in percent, for the proportion of ALL adults in the county who plan to attend the fair?`, solution: '43% to 49%' },
      relatedLoIds: ['dsat.sample-statistics-claims'],
    },
    {
      title: 'Worked scope of inference',
      steps: [
        `Check assignment: subjects WERE randomly assigned to app vs. no-app → this experiment supports a CAUSAL claim: the app caused the score increase, for these 200 students.`,
        `Check sampling: the 200 students were VOLUNTEERS from one school, not a random sample of "high school students nationwide" → the result canNOT be generalized nationwide.`,
        `Best-supported conclusion: the app caused higher scores among the students in this study, but the finding cannot be extended beyond them without a random sample of the broader population.`,
      ],
      example: { problem: `Researchers want to know whether a new study app improves quiz scores for high school students nationwide. They recruit 200 volunteer students from one school, then randomly assign 100 of them to use the app and 100 to study as usual. The app group scores significantly higher. Which conclusion is best supported?`, solution: `Causation is supported for the study's participants only; nationwide generalization is not supported.` },
      relatedLoIds: ['dsat.sample-statistics-claims'],
    },
  ],
  pointers: [
    { content: `A bigger sample does not fix the problem. Her respondents are a self-selected, convenience sample, not a random one. A bigger sample of the same non-random group would shrink the margin of error but would NOT fix the bias — the sample is still unrepresentative of the general population no matter how large it gets. Only a genuinely random sampling method fixes bias; sample size only affects precision.`, kind: 'common-error' },
    { content: `Statistic ± margin of error gives a plausible range for the true population value: low end = statistic − MOE, high end = statistic + MOE.`, kind: 'tip' },
    { content: `A larger random sample shrinks the margin of error, but no sample size fixes a non-random (biased) sampling method.`, kind: 'tip' },
    { content: `Random SAMPLING justifies generalizing to the exact population sampled — nothing broader. Random ASSIGNMENT justifies claiming causation.`, kind: 'tip' },
    { content: `No random assignment → association only, never causation, no matter how strong the result looks.`, kind: 'tip' },
    { content: `Answer choices with absolute language — "all," "every," "proves," "is guaranteed to," "will always" — are near-automatic wrong answers here. The correct choice usually hedges: "plausible," "likely," "the results suggest," "between X and Y." Scan for the hedge before you compute anything.`, kind: 'gotcha' },
    { content: `MOE is in **percentage points**, not percent-of-the-percent. With 46% ± 3, the range is 43%–49% — NOT 46 ± (3% of 46) = 44.62–47.38. The SAT sometimes lists that decimal-looking interval as a distractor.`, kind: 'common-error' },
    { content: `"Which conclusion is best supported by the study?" is not asking what's true — it's asking what the DESIGN licenses. A choice can be factually plausible and still wrong because the design (no random assignment, or a volunteer sample) doesn't back it.`, kind: 'vocab-note' },
    { content: `Read the sampling sentence for the exact population: "randomly selected from the 800 seniors at Lincoln High" licenses a claim about Lincoln High seniors only — not all Lincoln students, not all seniors in the district. Underline the noun phrase after "selected from."`, kind: 'gotcha' },
    { content: `Random assignment WITHOUT random sampling still gives causation — don't reject a causal choice just because subjects were volunteers. Volunteers only kill generalization, not causation. Check the two questions separately; they have separate answers.`, kind: 'edge-case' },
    { content: `A larger sample shrinks MOE but never guarantees the true value lies in the interval. Wording like "the true percentage MUST be between 55.5% and 60.5%" is wrong; "is plausibly/likely between" is right. The interval is an estimate, not a proof.`, kind: 'common-error' },
    { content: `Comparing two groups' intervals? If they OVERLAP (e.g., 41%–47% vs. 45%–51%), the survey does not support a claim that one is truly greater — even if one sample statistic is higher. Non-overlapping intervals support a difference.`, kind: 'edge-case' },
    { content: `"Self-selected," "volunteers," "those who responded," "the first 200 shoppers," "visitors to the website" all flag a NON-random sample — no generalization, period. "Randomly selected from a list/database" is the only green light.`, kind: 'tip' },
  ],
};
