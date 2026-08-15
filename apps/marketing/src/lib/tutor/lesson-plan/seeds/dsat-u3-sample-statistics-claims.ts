/**
 * Digital SAT — Math / Problem Solving and Data Analysis: Sample
 * Statistics, Margin of Error & Evaluating Claims.
 *
 * Tests whether a student can read a sample statistic ± margin of error
 * as a plausible range for the population value, AND separate the two
 * independent questions that decide what a study actually proves:
 * random SAMPLING (generalize to the sampled population) vs. random
 * ASSIGNMENT (claim causation). Desmos is allowed on every math
 * question, though this skill is mostly interpretation, not computation.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U3_SAMPLE_STATISTICS_CLAIMS: LessonPlan = {
  id: 'evelyn.testprep.dsat.sample-statistics-claims.v1',
  title: 'Sample Statistics, Margin of Error & Evaluating Claims',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.sample-statistics-claims',
      standard: 'DSAT-3.6',
      description:
        'Interpret a sample statistic and margin of error as a plausible range for a population value, and evaluate statistical claims by distinguishing what random sampling (generalization) versus random assignment (causation) each justify.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame this as a Problem Solving and Data Analysis staple — reading comprehension of a study description, not heavy computation.',
      script:
        'Problem Solving and Data Analysis is about 15 percent of SAT Math, and "evaluating statistical claims" shows up 2 to 3 times per test inside it. There is almost no arithmetic here — the SAT gives you a study or a survey and asks what you\'re actually allowed to conclude from it. Get the two-question checklist down and these become quick, reliable points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-claims',
      kind: 'concept',
      goal: 'Margin of error as a plausible range, plus the random-sampling-vs-random-assignment checklist for what a study can conclude.',
      keyIdeas: [
        'SAMPLE STATISTIC — a number computed from a sample (a percent, a mean) used to ESTIMATE the true population value, which is almost never known exactly.',
        'MARGIN OF ERROR (MOE) — the sample statistic is reported as statistic ± MOE. This defines an interval of plausible values for the population value: low end = statistic − MOE, high end = statistic + MOE.',
        'SAMPLE SIZE AND PRECISION — a LARGER random sample shrinks the margin of error (a tighter, more precise interval). A larger sample size does NOT fix a biased sampling method — only genuine randomization does that.',
        'TWO INDEPENDENT QUESTIONS every SAT study question is really asking: (1) Was the sample chosen RANDOMLY from the population? → if yes, you may GENERALIZE the result to that population. (2) Were subjects RANDOMLY ASSIGNED to groups/treatments? → if yes, you may claim CAUSATION.',
        'RANDOM SAMPLING ONLY (no assignment, e.g. a survey or observational study) → you can generalize to the population sampled, but you can only claim an ASSOCIATION, never causation.',
        'RANDOM ASSIGNMENT ONLY (e.g. volunteers split into two treatment groups) → you can claim the treatment CAUSED the difference for those subjects, but you canNOT generalize beyond the people in the study.',
        'SCOPE TRAP — even when generalization is valid, it only extends to the exact population the sample was drawn FROM (e.g. "students at that one school"), never to a broader group the question tempts you to assume (e.g. "all high school students").',
        'CORRELATION ≠ CAUSATION — an observational study can show a strong association and still support zero causal claim without random assignment. The SAT plants a plausible-sounding causal conclusion as a wrong choice almost every time.',
      ],
      vocabulary: [
        { term: 'margin of error', definition: 'the ± amount added to and subtracted from a sample statistic to give a plausible range for the true population value.' },
        { term: 'random sample', definition: 'a sample chosen so every member of the population has an equal chance of selection; justifies generalizing results to that population.' },
        { term: 'random assignment', definition: 'subjects are assigned to treatment groups by chance; justifies claiming the treatment caused an observed difference.' },
        { term: 'observational study', definition: 'a study that measures subjects without assigning treatments — can show association but never causation.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-moe-interval',
      kind: 'worked_example',
      problem:
        'A random sample of 500 adults in a county found that 46% plan to attend the county fair, with a margin of error of 3 percentage points. Based on this survey, what is the range of plausible values, in percent, for the proportion of ALL adults in the county who plan to attend the fair?',
      steps: [
        'The survey reports statistic ± MOE: 46% ± 3 percentage points.',
        'Low end: 46 − 3 = 43. High end: 46 + 3 = 49.',
        'Because the 500 adults were a RANDOM sample, this range generalizes to all adults in the county (not beyond it — not the whole state).',
      ],
      answer: '43% to 49%',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-scope-of-inference',
      kind: 'worked_example',
      problem:
        'Researchers want to know whether a new study app improves quiz scores for high school students nationwide. They recruit 200 volunteer students from one school, then randomly assign 100 of them to use the app and 100 to study as usual. The app group scores significantly higher. Which conclusion is best supported?',
      steps: [
        'Check assignment: subjects WERE randomly assigned to app vs. no-app → this experiment supports a CAUSAL claim: the app caused the score increase, for these 200 students.',
        'Check sampling: the 200 students were VOLUNTEERS from one school, not a random sample of "high school students nationwide" → the result canNOT be generalized nationwide.',
        'Best-supported conclusion: the app caused higher scores among the students in this study, but the finding cannot be extended beyond them without a random sample of the broader population.',
      ],
      answer: 'Causation is supported for the study\'s participants only; nationwide generalization is not supported.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-moe-range',
      kind: 'try_yourself',
      problem:
        'A random sample of 1,200 likely voters found that 58% support Candidate X, with a margin of error of 2.5 percentage points. Which interval contains the true percentage of all likely voters who support Candidate X, based on this survey?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '55.5% to 60.5%', correct: true },
        { id: 'b', text: '53% to 63%' },
        { id: 'c', text: '56% to 60%' },
        { id: 'd', text: '58% to 60.5%' },
      ],
      expectedAnswer: '55.5% to 60.5%',
      hints: ['Subtract the margin of error from the statistic for the low end, add it for the high end.', '58 − 2.5 = 55.5 and 58 + 2.5 = 60.5.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-scope-checklist',
      kind: 'try_yourself',
      problem:
        'A university researcher selects a random sample of 300 students from the university\'s enrollment database. She randomly assigns half of them to a new tutoring program and half to the standard program. Students in the new-program group show significantly higher final exam scores. Which statement is best supported by the study\'s design?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The results can be generalized to all students at the university, and the tutoring program caused the score increase.', correct: true },
        { id: 'b', text: 'The results can be generalized to all college students nationwide, but causation cannot be claimed.' },
        { id: 'c', text: 'The tutoring program caused the score increase, but the results cannot be generalized beyond the study.' },
        { id: 'd', text: 'Neither generalization nor causation is supported because the study lacks a comparison group.' },
      ],
      expectedAnswer: 'The results can be generalized to all students at the university, and the tutoring program caused the score increase.',
      hints: [
        'Check both questions separately: was the sample random? Was assignment to groups random?',
        'The 300 students were a random sample FROM the university\'s own enrollment database (generalizes only to that university), AND they were randomly assigned to the two programs (supports causation).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-moe-spr',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): A random sample of city residents found that 37% favor a proposed park renovation, with a margin of error of 4 percentage points. What is the least value, to the nearest percent, in the range of plausible population percentages supported by this survey?',
      responseFormat: 'numeric',
      expectedAnswer: '33',
      hints: ['The low end of the plausible range is statistic minus margin of error.', '37 − 4 = 33.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bigger-sample-fixes-bias',
      kind: 'misconception_check',
      question:
        'A researcher polls the first 500 people who click a link on her personal social media page about a proposed law, and 89% support it. She claims that surveying even more people this same way — say, 5,000 — would fix any problems with her conclusion, since more data is always better. Is she right?',
      commonErrors: [
        {
          answer: 'Yes — a bigger sample fixes the problem.',
          misconception: 'Confusing sample SIZE (which shrinks margin of error, i.e. precision) with sample RANDOMNESS (which prevents bias).',
          correctsTo: 'No. Her respondents are a self-selected, convenience sample, not a random one. A bigger sample of the same non-random group would shrink the margin of error but would NOT fix the bias — the sample is still unrepresentative of the general population no matter how large it gets. Only a genuinely random sampling method fixes bias; sample size only affects precision.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Statistic ± margin of error gives a plausible range for the true population value: low end = statistic − MOE, high end = statistic + MOE.',
        'A larger random sample shrinks the margin of error, but no sample size fixes a non-random (biased) sampling method.',
        'Random SAMPLING justifies generalizing to the exact population sampled — nothing broader. Random ASSIGNMENT justifies claiming causation.',
        'No random assignment → association only, never causation, no matter how strong the result looks.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.6', cedTitle: 'Sample Statistics, Margin of Error & Evaluating Claims' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
