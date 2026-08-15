/**
 * MCAT Psych/Soc — Research Methods, Statistics, and Study Design.
 *
 * High-yield: study types, validity threats, statistics interpretation,
 * IRB/ethics. Tested across all sections via passage-based study questions.
 */

import type { LessonPlan } from '../types';

export const SEED_MCAT_PSYCH_SOC_RESEARCH: LessonPlan = {
  id: 'evelyn.testprep.mcat.psych-soc.research-methods.v1',
  title: 'MCAT Psych/Soc — Research Methods, Stats & Study Design',
  curriculum: 'CCSS',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'mcat-psych-soc',
  locale: 'en',
  los: [
    {
      id: 'mcat.psych-soc.research-methods',
      description: 'Identify study designs (RCT, cohort, case-control, cross-sectional, case study), distinguish independent/dependent variables, recognize confounding + bias + validity threats, interpret p-values and effect sizes, and apply IRB ethical standards.',
      standard: 'MCAT-PS-RES',
    },
  ],
  prerequisites: ['mcat.format-2025'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Research methods is the highest-leverage Psych/Soc topic.',
      script: 'Almost every MCAT passage in Psych/Soc — and many in Bio/Biochem — describes a study. To answer the questions you have to recognize the design, identify confounders, and interpret the results. Get fluent here and you don\'t need deep psych content to score well on study questions.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-study-designs',
      kind: 'concept',
      goal: 'Study types — strengths and weaknesses.',
      keyIdeas: [
        'EXPERIMENTAL: investigator MANIPULATES an independent variable. Strongest causal evidence. Includes RCTs.',
        'RANDOMIZED CONTROLLED TRIAL (RCT): random assignment to treatment or control. Gold standard for causal inference. Eliminates selection bias. Often double-blinded (neither subject nor researcher knows assignment).',
        'OBSERVATIONAL (no manipulation): investigator OBSERVES. Cheaper but weaker causal claims.',
        'COHORT (longitudinal): follow group(s) FORWARD in time, tracking outcomes. Can be prospective (start now, follow forward) or retrospective (use existing records). Good for incidence and rare exposures.',
        'CASE-CONTROL: starts with people who have the OUTCOME (cases) and matches CONTROLS without it. Looks BACKWARD at exposures. Good for rare DISEASES; cheap; can\'t calculate incidence.',
        'CROSS-SECTIONAL: snapshot at one time. Measures PREVALENCE. Can\'t establish causality (no temporal order).',
        'CASE STUDY / CASE SERIES: detailed description of single patient(s). Hypothesis-generating only; no statistical inference.',
        'META-ANALYSIS: pools data from multiple studies. Highest level of evidence when done well.',
      ],
      vocabulary: [
        { term: 'randomized controlled trial', definition: 'experimental study with random assignment to treatment vs control; gold standard for causal claims.' },
        { term: 'cohort study', definition: 'observational study following groups forward in time; measures incidence and risk.' },
        { term: 'case-control study', definition: 'observational study comparing exposures of people with and without an outcome (looks backward); for rare diseases.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-validity-bias',
      kind: 'concept',
      goal: 'Variables, confounding, biases, validity.',
      keyIdeas: [
        'INDEPENDENT VARIABLE (IV): manipulated/predicted. DEPENDENT VARIABLE (DV): measured/outcome. CONFOUNDING VARIABLE: unmeasured factor associated with BOTH IV and DV — creates spurious relationships.',
        'INTERNAL VALIDITY: did the IV actually cause the DV change in this study? Threats: confounding, selection bias, attrition, measurement error.',
        'EXTERNAL VALIDITY (generalizability): do results extend to other people/contexts? Threats: WEIRD samples (Western, Educated, Industrialized, Rich, Democratic), specific settings.',
        'COMMON BIASES:',
        '  SELECTION BIAS: groups not comparable at baseline (e.g., volunteer bias).',
        '  RECALL BIAS: cases remember exposures differently than controls (case-control studies prone to this).',
        '  HAWTHORNE EFFECT: subjects change behavior because they know they\'re observed.',
        '  PUBLICATION BIAS: positive results published more than null results — distorts meta-analyses.',
        '  CONFIRMATION BIAS: researcher\'s expectations influence interpretation.',
        '  ATTRITION/SURVIVORSHIP: only "survivors" measured; dropouts may differ systematically.',
        'BLINDING: single-blind (subjects don\'t know), double-blind (neither subjects nor researchers know). Reduces placebo and observer bias.',
        'CONTROLS for confounding: randomization (RCT), matching (case-control), stratification, multivariable regression.',
      ],
      vocabulary: [
        { term: 'confounding variable', definition: 'unmeasured factor associated with both IV and DV that creates spurious associations.' },
        { term: 'selection bias', definition: 'systematic difference between participants and non-participants (or between groups), distorting results.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-statistics-ethics',
      kind: 'concept',
      goal: 'Statistical interpretation + research ethics.',
      keyIdeas: [
        'p-VALUE: probability of observing the result (or more extreme) IF the null hypothesis is true. p < 0.05 conventional cutoff for "statistically significant" — meaning result would happen <5% by chance under null.',
        'p-VALUE LIMITS: doesn\'t measure effect size or clinical importance. Large samples produce small p-values for trivial effects. Always look at EFFECT SIZE alongside.',
        'TYPE I ERROR (α): false positive — rejecting null when it\'s true. Set by α (typically 0.05).',
        'TYPE II ERROR (β): false negative — failing to reject false null. POWER = 1 − β. Increased by larger n, larger effect, lower variability.',
        'CONFIDENCE INTERVAL (CI): range that contains true value with stated probability (e.g., 95% CI). Doesn\'t cross null (e.g., RR 1.0, OR 1.0) → statistically significant.',
        'CORRELATION (r): −1 to +1. Measures linear association strength + direction. Correlation ≠ causation.',
        'EFFECT SIZE: standardized magnitude of difference (Cohen\'s d, odds ratio, relative risk). Reports practical importance.',
        'IRB (INSTITUTIONAL REVIEW BOARD): reviews human-subjects research for ethical compliance.',
        'CORE ETHICAL PRINCIPLES (Belmont Report): RESPECT for persons (informed consent, autonomy), BENEFICENCE (maximize benefit, minimize harm), JUSTICE (fair selection of subjects).',
        'INFORMED CONSENT requires: capacity, voluntariness, disclosure of risks/benefits, right to withdraw.',
      ],
      vocabulary: [
        { term: 'p-value', definition: 'probability of observing the data under the null hypothesis; <0.05 conventionally "significant."' },
        { term: 'IRB', definition: 'Institutional Review Board — body that reviews and approves human-subjects research for ethical compliance.' },
        { term: 'effect size', definition: 'standardized measure of the magnitude of an effect (e.g., Cohen\'s d, OR, RR); independent of sample size.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A study finds that people who drink coffee have lower depression rates. Researchers conclude coffee prevents depression. What is the main weakness of this conclusion?',
      expectedAnswer: 'CONFOUNDING + reverse causation. The study sounds observational (cross-sectional or cohort, NOT an RCT). Possible confounders: socioeconomic status, exercise habits, social engagement (coffee shops are social), or general health. Reverse causation: depressed people may avoid coffee, not the reverse. Without randomization, we can\'t conclude COFFEE → LOWER DEPRESSION. Need an RCT to establish causality.',
      responseFormat: 'free',
      hints: [
        'Was the study experimental or observational?',
        'Could a third variable cause both?',
        'Could the outcome cause the exposure (reverse causation)?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-p-value',
      kind: 'misconception_check',
      question: 'A p-value of 0.04 means there is a 96% probability that the observed effect is real (not due to chance). True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Inverting the conditional probability inside the p-value definition.',
          correctsTo: 'False. The p-value is P(data | null hypothesis is true), NOT P(null hypothesis is true | data) and NOT P(effect is real). A p of 0.04 means: IF the null were true, we\'d see this result (or more extreme) only 4% of the time by chance. It says NOTHING about the probability the alternative hypothesis is correct or the effect is real. The actual probability the effect is real depends on prior probability + sample size + effect size — Bayesian thinking, not the p-value alone. MCAT loves this trap; resist the simple inversion.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'RCT > cohort > case-control > cross-sectional > case study for causal evidence.',
        'Confounding, selection bias, recall bias, Hawthorne, publication bias — name + spot.',
        'p-value: P(data|null), NOT P(null|data). Effect size + CI matter as much.',
        'Type I (α) = false positive; Type II (β) = false negative; Power = 1 − β.',
        'IRB; Belmont principles: respect, beneficence, justice. Informed consent essential.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the Tuskegee Syphilis Study a foundational case study in research ethics, and what specific principles did it violate?',
      hint: 'The Tuskegee study (1932-1972) followed 600 Black men with untreated syphilis to observe disease progression. Penicillin became the standard treatment in the 1940s, but it was withheld from participants. Violations of all three Belmont principles: RESPECT FOR PERSONS — no informed consent, men were told they had "bad blood," didn\'t know they were in a study; BENEFICENCE — known effective treatment withheld, harm allowed to continue; JUSTICE — exclusively poor Black men exploited for research benefiting others. The 1979 Belmont Report and IRB system were direct responses. MCAT often tests this in research-ethics passages — the principles, not just the historical fact.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
