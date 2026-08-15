/**
 * AP Psychology — Scientific Foundations: Research Methods and Statistics.
 *
 * The cross-cutting "science practices" strand of the redesigned CED
 * (experimental design, correlation vs causation, descriptive methods,
 * descriptive/inferential statistics, and research ethics). Examined
 * throughout the course and central to FRQ Question 2 (evidence-based).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_PSYCH_SF_RESEARCH_METHODS: LessonPlan = {
  id: 'evelyn.ap.psych.research-methods.v1',
  title: 'Scientific Foundations: Research Methods and Statistics',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-psychology',
  locale: 'en',
  los: [
    {
      id: 'appsych.research-methods',
      description:
        'Distinguish experimental, correlational, and descriptive research methods; identify independent/dependent variables, operational definitions, random assignment, and confounds; interpret correlation vs causation; read descriptive (central tendency, variability) and inferential (statistical significance) statistics; and apply research ethics.',
      standard: 'AP-PSYCH-SF',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 26,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame research methods as the toolkit that separates psychology from pop-psych opinion.',
      script:
        "Why is psychology a SCIENCE and not just opinions about people? Because every claim is backed by a method — an experiment, a correlation, a careful observation — and by statistics that tell us whether a result is real or just luck. This is tested all over the AP exam, and the second free-response question is entirely about reading a study. Master the method vocabulary and you unlock points everywhere.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-methods',
      kind: 'concept',
      goal: 'Cover experimental/correlational/descriptive methods, key variables, statistics, and ethics.',
      keyIdeas: [
        'THE EXPERIMENT — the ONLY method that shows CAUSE AND EFFECT. The researcher MANIPULATES an independent variable (IV) and MEASURES a dependent variable (DV).',
        'INDEPENDENT VARIABLE (IV): the manipulated cause. DEPENDENT VARIABLE (DV): the measured outcome (it "depends" on the IV).',
        'OPERATIONAL DEFINITION: a precise, measurable statement of a variable (e.g. "stress = score on a 10-item anxiety scale"). Required so others can replicate.',
        'EXPERIMENTAL vs CONTROL GROUP: the experimental group gets the treatment; the control group does not (often a placebo). The comparison isolates the IV effect.',
        'RANDOM ASSIGNMENT (to groups) — the heart of an experiment: each participant has an equal chance of any group. It evens out individual differences, so the groups start equivalent. Do NOT confuse with RANDOM SELECTION (sampling from a population, which affects generalizability, not causation).',
        'CONFOUNDING VARIABLE: an uncontrolled difference between groups that could explain the result instead of the IV. Random assignment + control groups minimize confounds. PLACEBO effect and EXPERIMENTER BIAS are controlled with DOUBLE-BLIND designs.',
        'CORRELATIONAL METHOD: measures the relationship between two variables WITHOUT manipulation. Correlation coefficient r ranges -1 to +1: sign = direction (positive = move together; negative = opposite), magnitude = strength. CORRELATION DOES NOT EQUAL CAUSATION (could be reverse causation or a third variable).',
        'DESCRIPTIVE METHODS (describe, do not explain): CASE STUDY (one person/group in depth), NATURALISTIC OBSERVATION (watch behavior in its natural setting without intervening), SURVEY (self-report; watch for wording effects, social desirability, sampling bias).',
        'DESCRIPTIVE STATISTICS: MEASURES OF CENTRAL TENDENCY — mean (average; sensitive to outliers/skew), median (middle; robust to outliers), mode (most frequent). MEASURES OF VARIABILITY — range and STANDARD DEVIATION (spread around the mean). A SKEWED distribution pulls the mean toward the tail.',
        'INFERENTIAL STATISTICS: STATISTICAL SIGNIFICANCE (p < .05) means the result is unlikely to be due to chance — it does NOT mean the effect is large or important. EFFECT SIZE describes magnitude.',
        'RESEARCH ETHICS (APA / IRB review): INFORMED CONSENT, protection from harm, voluntary participation, confidentiality, DECEPTION only when justified, and DEBRIEFING afterward. Animal research has its own welfare standards.',
      ],
      vocabulary: [
        { term: 'random assignment', definition: 'placing participants into experimental/control groups by chance; equalizes groups and enables causal claims.' },
        { term: 'confounding variable', definition: 'an uncontrolled variable that offers an alternative explanation for the results.' },
        { term: 'statistical significance', definition: 'a result (p < .05) unlikely to have occurred by chance alone.' },
      ],
      suggestedTools: ['show_scatter_plot', 'show_stats'],
      estimatedMinutes: 7,
    },
    {
      id: 'try-identify-design',
      kind: 'try_yourself',
      problem:
        'A researcher gives half of participants caffeine and half a placebo, then measures reaction time. Identify (a) the independent variable, (b) the dependent variable, (c) the experimental and control groups, and (d) why random assignment matters here.',
      expectedAnswer:
        '(a) IV = whether the participant received caffeine (caffeine vs placebo) — the manipulated variable. (b) DV = reaction time — the measured outcome. (c) Experimental group = the caffeine group; control group = the placebo group. (d) Random assignment matters because it distributes individual differences (age, baseline alertness, tolerance) evenly across the two groups, so the groups start equivalent and any difference in reaction time can be attributed to the caffeine (the IV) rather than a pre-existing group difference (a confound). Strong answers correctly label IV/DV (not reversed) and explain random assignment as equalizing groups to permit a causal conclusion.',
      responseFormat: 'free',
      hints: [
        'The IV is what the researcher manipulates; the DV is what they measure.',
        'The control group gets the placebo.',
        'Random assignment makes groups equivalent at the start.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-correlation',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A study reports that students who sleep more get higher grades (r = +0.45). A news headline declares "Sleep boosts grades!" (a) Interpret the correlation. (b) Explain why the headline overstates the finding. (c) Propose a third-variable explanation. (d) What method WOULD allow a causal claim?',
      expectedAnswer:
        '(a) INTERPRETATION: r = +0.45 is a MODERATE POSITIVE correlation — more sleep is associated with higher grades, and the two tend to increase together. (b) THE HEADLINE OVERSTATES: "boosts" is a CAUSAL claim, but a correlation cannot establish causation. The relationship could run the other way (REVERSE CAUSATION — students who do well feel less stressed and sleep more) or be explained by a third variable. (c) THIRD-VARIABLE EXPLANATION: e.g. good time-management / conscientiousness could cause BOTH more sleep AND higher grades, with no direct link between sleep and grades. (Other valid answers: lower workload, higher socioeconomic status, fewer evening jobs.) (d) A TRUE EXPERIMENT would be needed: randomly ASSIGN students to different sleep amounts (IV), control other variables, and measure grades (DV). Random assignment + manipulation is what licenses a causal conclusion. Strong answers (i) give direction AND strength, (ii) name the correlation-causation problem, (iii) supply a plausible third variable, and (iv) cite the experiment with random assignment.',
      responseFormat: 'frq',
      hints: [
        'Give both the direction and the strength of r.',
        'Why can\'t "associated with" become "causes"?',
        'A third variable can drive both measures at once.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Only the EXPERIMENT (manipulated IV + random assignment) shows causation.',
        'Correlation shows relationship, not cause — beware reverse causation and third variables.',
        'Descriptive methods (case study, naturalistic observation, survey) describe, not explain.',
        'Mean/median/mode + standard deviation summarize data; p < .05 = statistically significant (not necessarily large).',
        'Ethics: informed consent, protection from harm, justified deception, debriefing, IRB review.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '0',
    cedTopic: 'SF',
    cedTitle: 'Scientific Foundations: Research Methods and Statistics',
    sources: [
      { type: 'concept', book: 'feldman', chapter: '1', note: 'Research methods, statistics, and ethics — the science-practices strand.' },
    ],
  },
};
