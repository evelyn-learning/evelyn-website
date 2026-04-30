/**
 * G11 — Statistics: Sampling and bias.
 *
 * Why we sample (cost, time, infeasibility), how to sample WELL
 * (random sampling), how sampling can go wrong (bias). Common bias
 * types: selection, response, voluntary response, undercoverage.
 * The line between a "study" and a credible study.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_STATS_SAMPLING: LessonPlan = {
  id: 'evelyn.g11.math.stats.sampling.v1',
  title: 'Sampling and Bias',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hss.ic.b.3',
      description: 'Recognize the purposes of and differences among sample surveys, experiments, and observational studies.',
      standard: 'CCSS.MATH.CONTENT.HSS.IC.B.3',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a famous polling failure to motivate "good sampling".',
      script: 'In 1936, a magazine ran a presidential poll. They mailed 10 million people. They got 2.4 million responses. Their conclusion: Landon would beat Roosevelt in a landslide. Roosevelt won by the largest margin in history. What went wrong wasn\'t the SAMPLE SIZE — it was who they sampled. They drew names from car owners and phone listings — wealthy people in 1936. The sample was biased. Sampling well is harder than it looks.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sampling-bias',
      kind: 'concept',
      goal: 'Why sampling, types of sampling, types of bias.',
      keyIdeas: [
        'POPULATION = the entire group you want to know about.',
        'SAMPLE = a subset of the population you actually study.',
        'WHY SAMPLE? Cost, time, infeasibility (you can\'t test every battery to destruction).',
        'GOAL: draw conclusions about the population from the sample.',
        'GOOD SAMPLES are representative: the sample looks like a mini-version of the population.',
        'SAMPLING METHODS:',
        '  SIMPLE RANDOM SAMPLE (SRS): every person has equal chance of being picked. Gold standard.',
        '  STRATIFIED: split population into groups, then SRS within each. Use when groups differ.',
        '  CLUSTER: pick whole groups (clusters), then survey everyone in chosen clusters.',
        '  SYSTEMATIC: every Nth person from a list. Easy but breaks if the list has a pattern.',
        '  CONVENIENCE: ask whoever\'s nearby. CHEAP and BIASED.',
        '  VOLUNTARY RESPONSE: anyone who wants to answer (online polls). HEAVILY BIASED toward people with strong opinions.',
        'TYPES OF BIAS:',
        '  SELECTION: the sampling method excludes some people systematically.',
        '  UNDERCOVERAGE: certain groups are underrepresented in the sample frame.',
        '  NON-RESPONSE: the people who decline to answer differ from those who respond.',
        '  RESPONSE: the way questions are worded affects answers ("Do you support saving the Earth?" vs "Do you support new environmental regulations?").',
        '  VOLUNTARY RESPONSE: a special case where opinionated people self-select.',
        'A small RANDOM sample beats a huge BIASED sample every time.',
      ],
      vocabulary: [
        { term: 'population', definition: 'the entire group you want information about.' },
        { term: 'sample', definition: 'the subset of the population you actually study.' },
        { term: 'simple random sample', definition: 'every member has equal chance of selection.' },
        { term: 'bias', definition: 'systematic error favoring certain outcomes.' },
      ],
      suggestedTools: ['show_concept_map', 'show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'Identify the bias type: A radio show asks listeners to call in with their opinion on a new tax. Of 200 callers, 80% oppose it.',
      steps: [
        'Sampling method: voluntary response — people self-select to call.',
        'Bias: people with STRONG opinions (especially negative) are far more likely to call than the indifferent majority.',
        'Bias type: VOLUNTARY RESPONSE bias (a form of selection bias).',
        'Conclusion: this 80% doesn\'t generalize. The population might be evenly split or even support the tax.',
      ],
      answer: 'Voluntary response bias',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-design',
      kind: 'worked_example',
      problem: 'A high school of 1200 students wants to estimate the average screen time. Design a sampling plan.',
      steps: [
        'POPULATION: all 1200 students.',
        'SIMPLE RANDOM SAMPLE option: number students 1-1200, use a random-number generator to pick 100. Survey those 100.',
        'STRATIFIED option: split by grade (300 in each of 4 grades). SRS 25 per grade. Ensures each grade is represented.',
        'BAD options: surveying just one homeroom (cluster, but biased if homerooms differ); standing at the gym door (convenience); posting an online survey (voluntary response).',
      ],
      answer: 'SRS or stratified-by-grade',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A school newspaper poll asks "Should the cafeteria offer healthier food?" 95% say yes. Why might this be biased?',
      expectedAnswer: 'Loaded wording — almost no one says "no" to healthier food, regardless of actual preferences.',
      responseFormat: 'free',
      hints: [
        'Read the question carefully.',
        'Would a different wording give different answers?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bigger-better',
      kind: 'misconception_check',
      question: 'A poll surveys 100,000 people via a popular website. Sami says the result is highly accurate because of the huge sample size. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating sample size as the only thing that matters.',
          correctsTo: 'Wrong. Size matters less than randomness. A 100,000-person voluntary online poll is biased — only website users who chose to respond. A 1,000-person SRS would be more accurate. The 1936 Literary Digest poll surveyed 2.4 million and was wildly wrong because the sample wasn\'t representative.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Sample to learn about a population you can\'t survey fully.',
        'Random sampling (SRS, stratified) is the gold standard.',
        'Convenience and voluntary-response samples are usually biased.',
        'Question wording is itself a bias source.',
        'A small random sample beats a huge biased sample.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is "stratified" sampling sometimes BETTER than simple random?',
      hint: 'When the population has clear subgroups that differ on the variable of interest, stratifying ensures each subgroup is proportionally represented — reducing variance compared to pure SRS.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
