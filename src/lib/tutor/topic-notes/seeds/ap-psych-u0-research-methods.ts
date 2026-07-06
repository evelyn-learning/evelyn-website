/**
 * AP Psychology — Unit 0 CED SF: Scientific Foundations: Research Methods and Statistics.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.research-methods.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_RESEARCH_METHODS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.research-methods.v1',
  course: 'AP Psychology',
  cedUnit: 0,
  cedTopic: 'SF',
  cedTitle: 'Scientific Foundations: Research Methods and Statistics',
  planId: 'evelyn.ap.psych.research-methods.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.research-methods.v1' }],
  theory: [
    { loId: 'appsych.research-methods', content: `THE EXPERIMENT — the ONLY method that shows CAUSE AND EFFECT. The researcher MANIPULATES an independent variable (IV) and MEASURES a dependent variable (DV).` },
    { loId: 'appsych.research-methods', content: `INDEPENDENT VARIABLE (IV): the manipulated cause. DEPENDENT VARIABLE (DV): the measured outcome (it "depends" on the IV).` },
    { loId: 'appsych.research-methods', content: `OPERATIONAL DEFINITION: a precise, measurable statement of a variable (e.g. "stress = score on a 10-item anxiety scale"). Required so others can replicate.` },
    { loId: 'appsych.research-methods', content: `EXPERIMENTAL vs CONTROL GROUP: the experimental group gets the treatment; the control group does not (often a placebo). The comparison isolates the IV effect.` },
    { loId: 'appsych.research-methods', content: `RANDOM ASSIGNMENT (to groups) — the heart of an experiment: each participant has an equal chance of any group. It evens out individual differences, so the groups start equivalent. Do NOT confuse with RANDOM SELECTION (sampling from a population, which affects generalizability, not causation).` },
    { loId: 'appsych.research-methods', content: `CONFOUNDING VARIABLE: an uncontrolled difference between groups that could explain the result instead of the IV. Random assignment + control groups minimize confounds. PLACEBO effect and EXPERIMENTER BIAS are controlled with DOUBLE-BLIND designs.` },
    { loId: 'appsych.research-methods', content: `CORRELATIONAL METHOD: measures the relationship between two variables WITHOUT manipulation. Correlation coefficient r ranges -1 to +1: sign = direction (positive = move together; negative = opposite), magnitude = strength. CORRELATION DOES NOT EQUAL CAUSATION (could be reverse causation or a third variable).` },
    { loId: 'appsych.research-methods', content: `DESCRIPTIVE METHODS (describe, do not explain): CASE STUDY (one person/group in depth), NATURALISTIC OBSERVATION (watch behavior in its natural setting without intervening), SURVEY (self-report; watch for wording effects, social desirability, sampling bias).` },
    { loId: 'appsych.research-methods', content: `DESCRIPTIVE STATISTICS: MEASURES OF CENTRAL TENDENCY — mean (average; sensitive to outliers/skew), median (middle; robust to outliers), mode (most frequent). MEASURES OF VARIABILITY — range and STANDARD DEVIATION (spread around the mean). A SKEWED distribution pulls the mean toward the tail.` },
    { loId: 'appsych.research-methods', content: `INFERENTIAL STATISTICS: STATISTICAL SIGNIFICANCE (p < .05) means the result is unlikely to be due to chance — it does NOT mean the effect is large or important. EFFECT SIZE describes magnitude.` },
    { loId: 'appsych.research-methods', content: `RESEARCH ETHICS (APA / IRB review): INFORMED CONSENT, protection from harm, voluntary participation, confidentiality, DECEPTION only when justified, and DEBRIEFING afterward. Animal research has its own welfare standards.` },
    { loId: 'appsych.research-methods', kind: 'definition', title: 'random assignment', content: `placing participants into experimental/control groups by chance; equalizes groups and enables causal claims.` },
    { loId: 'appsych.research-methods', kind: 'definition', title: 'confounding variable', content: 'an uncontrolled variable that offers an alternative explanation for the results.' },
    { loId: 'appsych.research-methods', kind: 'definition', title: 'statistical significance', content: 'a result (p < .05) unlikely to have occurred by chance alone.' },
  ],
  methods: [],
  pointers: [
    { content: 'Only the EXPERIMENT (manipulated IV + random assignment) shows causation.', kind: 'tip' },
    { content: `Correlation shows relationship, not cause — beware reverse causation and third variables.`, kind: 'tip' },
    { content: `Descriptive methods (case study, naturalistic observation, survey) describe, not explain.`, kind: 'tip' },
    { content: `Mean/median/mode + standard deviation summarize data; p < .05 = statistically significant (not necessarily large).`, kind: 'tip' },
    { content: `Ethics: informed consent, protection from harm, justified deception, debriefing, IRB review.`, kind: 'tip' },
  ],
};
