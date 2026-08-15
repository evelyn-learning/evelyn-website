/** AP Psychology — Research Methods (CED SF: Scientific Foundations: Research Methods and Statistics).
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.research-methods.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.research-methods.v1' }],
  theory: [
    { loId: 'appsych.research-methods', content: `THE EXPERIMENT is the ONLY research method that can establish CAUSE AND EFFECT. The researcher MANIPULATES an INDEPENDENT VARIABLE (IV) and MEASURES a DEPENDENT VARIABLE (DV) while holding everything else constant. IV = the manipulated cause; DV = the measured outcome (it "depends" on the IV). The EXPERIMENTAL group receives the treatment; the CONTROL group does not — it often receives a PLACEBO (an inert treatment) so participants cannot tell which group they are in — and comparing the two ISOLATES the effect of the IV. If nothing is manipulated, it is NOT an experiment — no causal claim is licensed.` },
    { loId: 'appsych.research-methods', content: `OPERATIONAL DEFINITION: a precise, MEASURABLE statement of how a variable is defined in a specific study (e.g. "stress = score on a 10-item anxiety scale"; "aggression = number of times a child hits the doll"). Required for REPLICATION — other researchers must be able to repeat the study exactly. On FRQs, "operationally define the DV" means state the concrete measurement, not the abstract concept.` },
    { loId: 'appsych.research-methods', content: `SAMPLING and the most-tested distinction on the exam. The POPULATION is everyone the researcher wants to generalize to; the SAMPLE is the subset actually studied. RANDOM SELECTION (random sampling) — every member of the population has an equal chance of being in the sample — makes the sample REPRESENTATIVE and the results GENERALIZABLE; a biased or convenience sample (only volunteers, only one school) limits generalizability. RANDOM ASSIGNMENT is different: it places participants into experimental/control GROUPS by chance, equalizing individual differences so groups start EQUIVALENT — this is what permits a CAUSAL conclusion. Assignment → causation; selection → generalization. Do not swap them.` },
    { loId: 'appsych.research-methods', content: `CONFOUNDING VARIABLE: any uncontrolled difference between groups that offers an ALTERNATIVE EXPLANATION for the result (e.g. the caffeine group also happened to be younger). Confounds are minimized by RANDOM ASSIGNMENT and control groups. The PLACEBO EFFECT (improvement from mere expectation) and EXPERIMENTER BIAS (researchers unconsciously influencing results) are controlled with BLINDING: SINGLE-BLIND — participants do not know their group; DOUBLE-BLIND — neither participants NOR the data-collecting researchers know. Double-blind controls BOTH placebo effects and experimenter bias.` },
    { loId: 'appsych.research-methods', content: `CORRELATIONAL METHOD: measures the RELATIONSHIP between two variables WITHOUT manipulating either. The CORRELATION COEFFICIENT r ranges from -1 to +1. SIGN = DIRECTION: positive means the variables move TOGETHER (both rise or both fall); negative means they move in OPPOSITE directions. MAGNITUDE (absolute value) = STRENGTH: closer to 1 or -1 is stronger; r near zero means little or no relationship. Note: r = -0.80 is STRONGER than r = +0.40 — strength ignores sign. And CORRELATION DOES NOT EQUAL CAUSATION: if A correlates with B, three explanations compete — A causes B; B causes A (REVERSE CAUSATION / directionality problem); or a THIRD VARIABLE causes both (e.g. conscientiousness drives both more sleep and higher grades). Only an experiment with random assignment can rule these out. On FRQs, always name a specific plausible third variable — "something else" earns no points.` },
    { loId: 'appsych.research-methods', content: `DESCRIPTIVE METHODS — they DESCRIBE behavior, they do not explain or establish cause. CASE STUDY: one person or group examined in depth; rich detail but poor generalizability (the case may be unusual). NATURALISTIC OBSERVATION: watching behavior in its natural setting WITHOUT intervening; high realism, no control, observer effects possible. SURVEY: self-report from many people; fast and broad but vulnerable to WORDING EFFECTS, SOCIAL DESIRABILITY BIAS (answering to look good), and SAMPLING BIAS.` },
    { loId: 'appsych.research-methods', content: `DESCRIPTIVE STATISTICS — CENTRAL TENDENCY: MEAN (arithmetic average; SENSITIVE to outliers), MEDIAN (middle score; ROBUST to outliers), MODE (most frequent score). In a SKEWED distribution the mean is pulled TOWARD the tail: positive (right) skew pulls the mean ABOVE the median; negative (left) skew pulls it BELOW. VARIABILITY: RANGE (highest minus lowest) and STANDARD DEVIATION (typical spread of scores around the mean — small SD = scores clustered; large SD = scores spread out). The NORMAL DISTRIBUTION is the symmetric bell curve where mean = median = mode: roughly 68 percent of scores fall within one SD of the mean, about 95 percent within two, about 99.7 percent within three. Many psychological measures are approximately normal (e.g. IQ with mean 100, SD 15 — so an IQ of 130 is two SDs above the mean, higher than about 97.5 percent of people).` },
    { loId: 'appsych.research-methods', content: `INFERENTIAL STATISTICS: STATISTICAL SIGNIFICANCE (conventionally p < .05) means the observed result is UNLIKELY TO BE DUE TO CHANCE alone — there is less than a 5 percent probability of getting a result this extreme if there were truly no effect. Significance does NOT mean the effect is LARGE or IMPORTANT; with huge samples, tiny effects reach significance. EFFECT SIZE describes MAGNITUDE. Larger samples make it easier to detect real effects.` },
    { loId: 'appsych.research-methods', content: `RESEARCH ETHICS — enforced by the IRB (Institutional Review Board), which reviews studies BEFORE they run. Requirements: INFORMED CONSENT (participants agree knowing what the study involves), VOLUNTARY PARTICIPATION with the right to withdraw at any time, PROTECTION FROM HARM, CONFIDENTIALITY of data, DECEPTION only when scientifically justified and no reasonable alternative exists, and DEBRIEFING afterward (explain the true purpose, especially after deception). Animal research follows separate welfare standards with its own oversight.` },
    { loId: 'appsych.research-methods', kind: 'definition', title: 'random assignment', content: `placing participants into experimental/control groups by chance so groups start equivalent; the feature that permits causal claims.` },
    { loId: 'appsych.research-methods', kind: 'definition', title: 'confounding variable', content: `an uncontrolled variable that differs between groups and offers an alternative explanation for the results.` },
    { loId: 'appsych.research-methods', kind: 'definition', title: 'statistical significance', content: `a result (p < .05) unlikely to have occurred by chance alone; says nothing about the size or importance of the effect.` },
  ],
  methods: [
    {
      title: 'Dissect an experiment (IV / DV / groups / assignment)',
      when_to_use: 'Any stem that describes a researcher giving a treatment and measuring an outcome — MCQ or FRQ.',
      steps: [
        `STEP 1 — Find the MANIPULATION: what did the researcher CHANGE between groups? That is the INDEPENDENT VARIABLE (state both levels, e.g. caffeine vs placebo).`,
        `STEP 2 — Find the MEASUREMENT: what outcome was recorded? That is the DEPENDENT VARIABLE. Give its OPERATIONAL DEFINITION if asked (the concrete measure, e.g. reaction time in milliseconds).`,
        `STEP 3 — Label the GROUPS: the treatment receivers are the EXPERIMENTAL group; the no-treatment / placebo receivers are the CONTROL group.`,
        `STEP 4 — Check RANDOM ASSIGNMENT: were participants placed into groups by chance? If yes, groups start equivalent and a CAUSAL conclusion is allowed. If no, name the possible CONFOUND that pre-existing differences create.`,
        `STEP 5 — Check BLINDING: if participants could expect an effect, a PLACEBO controls it; if researchers could bias measurement, DOUBLE-BLIND controls that too.`,
        `STEP 6 — State the conclusion in causal language ONLY if steps 1 and 4 both hold: "the IV caused the change in the DV."`,
      ],
      example: {
        problem: `A researcher gives half of participants caffeine and half a placebo, then measures reaction time. Identify the IV, the DV, the groups, and why random assignment matters here.`,
        solution: `IV = caffeine vs placebo (the manipulated variable). DV = reaction time (the measured outcome). Experimental group = caffeine; control group = placebo. Random assignment spreads individual differences (age, baseline alertness, tolerance) evenly across groups, so groups start equivalent and any reaction-time difference can be attributed to the caffeine rather than a confound.`,
      },
      relatedLoIds: ['appsych.research-methods'],
    },
    {
      title: 'Interpret a correlation without over-claiming',
      when_to_use: 'Any stem reporting an r value or an association ("students who X tend to Y") — especially headlines that use causal verbs.',
      steps: [
        `STEP 1 — State DIRECTION from the sign of r: positive = variables move together; negative = opposite directions.`,
        `STEP 2 — State STRENGTH from the magnitude: near zero = weak/none; around plus-or-minus 0.4 to 0.6 = moderate; near plus-or-minus 1 = strong. Strength ignores sign.`,
        `STEP 3 — Block the causal leap: no variable was MANIPULATED, so "associated with" cannot become "causes."`,
        `STEP 4 — Offer the two rival explanations: REVERSE CAUSATION (B causes A) and a specific, plausible THIRD VARIABLE that could drive both.`,
        `STEP 5 — Name the fix: a TRUE EXPERIMENT — randomly ASSIGN participants to levels of the suspected cause (now the IV), control other variables, measure the outcome (DV).`,
      ],
      example: {
        problem: `A study reports that students who sleep more get higher grades (r = +0.45). A headline declares "Sleep boosts grades!" Interpret the correlation and evaluate the headline.`,
        solution: `r = +0.45 is a MODERATE POSITIVE correlation — sleep and grades tend to rise together. The headline over-claims: "boosts" is causal, but no manipulation occurred. Grades could drive sleep (less stress → more sleep), or a third variable such as conscientiousness could cause both. Only an experiment that randomly assigns students to sleep amounts and measures grades could license a causal claim.`,
      },
      relatedLoIds: ['appsych.research-methods'],
    },
  ],
  pointers: [
    { content: 'Random ASSIGNMENT → causation; random SELECTION → generalizability. The most-missed distinction on the exam.', kind: 'tip' },
    { content: 'Only an experiment (manipulated IV + random assignment) shows cause and effect. Correlation and descriptive methods never do.', kind: 'tip' },
    { content: 'For r: sign gives direction, magnitude gives strength. r = -0.8 is stronger than r = +0.4.', kind: 'tip' },
    { content: 'Third-variable answers must be SPECIFIC — name a variable that plausibly drives both measures.', kind: 'tip' },
    { content: 'Significant (p < .05) means unlikely due to chance, NOT large or important. Effect size gives magnitude.', kind: 'tip' },
    { content: 'Skew pulls the MEAN toward the tail; the median stays put. Use the median with outliers.', kind: 'tip' },
  ],
};
