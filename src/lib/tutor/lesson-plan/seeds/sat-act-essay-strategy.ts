/**
 * SAT/ACT — Essay strategy (rhetorical analysis).
 *
 * For ACT writing and optional SAT essay (older format) and AP Lang
 * rhetorical analysis. How to read a passage and write about HOW
 * the author argues.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_ACT_ESSAY_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.sat-act.essay-rhetorical-analysis.v1',
  title: 'Rhetorical analysis essay strategy (SAT/ACT/AP Lang)',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'testprep.essay-rhetorical',
      description: 'Plan and write an essay analyzing how an author builds an argument.',
      standard: 'AP-LANG-ESSAY-2',
    },
  ],
  prerequisites: ['ccss.ela.9-10.ri.6'],
  followUps: [],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe rhetorical analysis as identifying TOOLS, not opinions.',
      script: 'Rhetorical analysis isn\'t about whether you AGREE with the author. It\'s about HOW the author argues. What TOOLS do they use to persuade? Spotting those tools is the whole skill.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Five-step strategy + evidence types + scoring criteria.',
      keyIdeas: [
        'STEP 1: READ ACTIVELY. Underline strong word choices, repeated phrases, statistics, anecdotes, contrasts. Notice STRUCTURE — does the argument build? Pivot? Conclude?',
        'STEP 2: IDENTIFY THE CLAIM. What is the author arguing for or against? State it in your own words.',
        'STEP 3: CATALOG THE STRATEGIES. Three appeals — ETHOS (credibility), PATHOS (emotion), LOGOS (logic + evidence). Plus devices: anaphora, parallelism, antithesis, hyperbole, anecdote, statistic, expert quote, rhetorical question.',
        'STEP 4: PLAN. Pick 2-3 of the strongest strategies. Each gets a paragraph. Don\'t try to cover everything.',
        'STEP 5: WRITE the essay. Intro: state the claim and preview your 2-3 strategies. Each body paragraph: identify the strategy, give a SPECIFIC example with a SHORT QUOTE, EXPLAIN how it persuades. Conclusion: synthesize how the strategies work together.',
        'AVOID: summary (don\'t just retell the passage), agreement/disagreement, vague labels ("good word choice"). Be SPECIFIC.',
        'TIME BUDGET: 50-min ACT writing, 40-min AP. Spend ~10 min reading + planning, ~30-35 min writing, last 5 reviewing.',
      ],
      vocabulary: [
        { term: 'rhetorical strategy', definition: 'a technique an author uses to persuade.' },
        { term: 'ethos / pathos / logos', definition: 'appeals to credibility, emotion, and logic respectively.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-paragraph',
      kind: 'worked_example',
      problem: 'Sample author uses statistics. Show how to write a body paragraph analyzing this strategy.',
      steps: [
        'TOPIC SENTENCE: "The author employs statistics to establish authority and ground the argument in measurable reality."',
        'EVIDENCE: "For instance, citing that \'37% of teens report sleeping less than six hours nightly\' (line 12) anchors the claim about screen-time damage in concrete data."',
        'EXPLANATION: "This number serves a double function: it appeals to LOGOS by quantifying the problem, and it implicitly appeals to ETHOS by suggesting the author is informed and trustworthy. Without a statistic, the reader can dismiss the claim as anecdotal. WITH it, the author shifts the burden — the reader must explain why the data is wrong."',
        'TRANSITION: "Beyond statistical authority, the author also..."',
        'NOTE: every body paragraph hits the same beats — STRATEGY, SPECIFIC EXAMPLE, EFFECT explained.',
      ],
      answer: 'topic sentence (strategy) + specific quoted evidence + explanation of effect',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a rhetorical analysis essay, why is it a MISTAKE to spend a paragraph saying whether you agree with the author?',
      expectedAnswer: 'the prompt is asking how the author argues, not whether the argument is correct',
      responseFormat: 'free',
      hints: [
        'Reread what rhetorical analysis is asking.',
        'Your opinion is irrelevant — the analysis is about technique.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-summary-okay',
      kind: 'misconception_check',
      question: 'Should a rhetorical analysis essay include a summary of the passage?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Filling space with summary.',
          correctsTo: 'Briefly mention what the passage is about (1 sentence in intro), but do NOT summarize at length. Graders are LOOKING FOR analysis. Summary fills your word count without scoring points.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Rhetorical analysis = HOW the author argues, not WHETHER they\'re right.',
        'Read actively, identify the claim, catalog strategies (ethos/pathos/logos + devices).',
        'Pick 2-3 strongest strategies. One per body paragraph.',
        'Body paragraph formula: strategy → quote → explain effect.',
        'Avoid summary. Avoid agreeing/disagreeing.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is rhetorical analysis useful BEYOND test essays?',
      hint: 'Spotting persuasion tactics in ads, political speeches, social media — protects you from manipulation. Lets you evaluate arguments rather than just react. A core media-literacy skill.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
