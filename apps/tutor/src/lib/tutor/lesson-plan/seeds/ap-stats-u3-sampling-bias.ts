/**
 * AP Statistics — CED Unit 3.4: Potential Problems with Sampling.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U3_SAMPLING_BIAS: LessonPlan = {
  id: 'evelyn.ap.stats.sampling-bias.v1', title: 'U3.4 Bias and Sampling Pitfalls',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.sampling-bias', description: 'Identify common sources of bias: voluntary response, convenience sampling, undercoverage, nonresponse, response bias, and question wording. Describe how each distorts results.', standard: 'AP-STATS-3.4' }],
  prerequisites: ['apstats.sampling-methods'], followUps: ['apstats.experimental-design'], estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame bias.', script: "Even a large sample can be USELESS if it\'s biased. BIAS = systematic deviation from the truth. The way you collect data can build bias right in.", estimatedMinutes: 2 },
    { id: 'concept-bias', kind: 'concept', goal: 'Cover bias types.',
      keyIdeas: [
        'BIAS: a SYSTEMATIC tendency for sample results to differ from population truth in the same direction.',
        'KEY DISTINCTION: bias ≠ random sampling variability. A bigger sample REDUCES variability but DOES NOT FIX bias.',
        'TYPES OF BIAS:',
        '  • VOLUNTARY RESPONSE BIAS: people CHOOSE to participate (online polls, write-in surveys). Strong opinions over-represented.',
        '  • CONVENIENCE SAMPLING: surveying whoever is easy to reach (friends, mall shoppers). Not representative.',
        '  • UNDERCOVERAGE: some groups in the population are SYSTEMATICALLY EXCLUDED from the sampling frame. (e.g., calling landlines misses cell-only households.)',
        '  • NONRESPONSE BIAS: some selected individuals can\'t or won\'t respond, AND nonresponders differ from responders.',
        '  • RESPONSE BIAS: respondents lie or distort (sensitive topics, social-desirability, interviewer effects).',
        '  • QUESTION WORDING BIAS: leading or loaded questions push respondents toward an answer.',
        'AP RUBRIC TIP: name the bias AND explain how it affects the result. "Voluntary response" alone won\'t score full points.',
        'COUNTER-INTUITIVE FACT: a poorly-designed sample of MILLIONS can be WORSE than a properly-designed sample of HUNDREDS. (Famous case: 1936 Literary Digest poll predicted Landon over Roosevelt with 2.4 million respondents — wrong because of voluntary response and undercoverage.)',
      ],
      vocabulary: [
        { term: 'bias', definition: 'systematic deviation of sample results from the population truth.' },
        { term: 'voluntary response bias', definition: 'self-selected respondents over-represent strong opinions.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-bias', kind: 'worked_example',
      problem: 'A radio host asks listeners to call in to vote on whether the city should build a new stadium. 80% of callers vote yes. Identify the bias and explain its likely direction.',
      steps: [
        'STEP 1 — Identify: VOLUNTARY RESPONSE BIAS (callers self-selected).',
        'STEP 2 — Direction: people with STRONG opinions (especially fans excited about a new stadium) are MORE LIKELY to call in. The 80% likely OVERESTIMATES city-wide support.',
        'STEP 3 — Sentence: "Voluntary response bias. Listeners who feel strongly about the stadium — likely fans favoring it — are most motivated to call. The 80% overestimates true city-wide support."',
      ],
      answer: 'Voluntary response bias; result likely overestimates true support.', estimatedMinutes: 3 },
    { id: 'try-identify', kind: 'try_yourself',
      problem: 'For each scenario identify the bias type: \n(a) An online poll on a tax-cut website asks "Should the unfair income tax be cut?" \n(b) A pollster surveys only people standing in line at a gun show about gun-control views. \n(c) A telephone survey using only landlines. \n(d) A pollster mails 1000 surveys but only 200 are returned.',
      expectedAnswer: '(a) Question-wording (loaded with "unfair") AND voluntary response (online opt-in). (b) Convenience sampling — gun-show attendees are unrepresentative. (c) Undercoverage — cell-only households excluded. (d) Nonresponse bias — the 800 who didn\'t respond may differ from the 200 who did.',
      responseFormat: 'free', hints: ['Match each scenario to a named bias.'], estimatedMinutes: 3 },
    { id: 'try-effect', kind: 'try_yourself',
      problem: 'AP-style synthesis. A school sends a survey to parents asking "How often does your child do homework?" with options never / rarely / sometimes / often / always. 70% of parents respond "always." (a) Identify two likely sources of bias. (b) Describe how each would distort the result.',
      expectedAnswer: '(a) RESPONSE BIAS (parents may exaggerate their child\'s diligence — social desirability) and NONRESPONSE BIAS (parents who respond may differ systematically from those who don\'t — perhaps more engaged parents respond, whose kids really do do more homework). (2)\n(b) Response bias INFLATES the "always/often" responses upward (parents reluctant to admit their child rarely does homework). Nonresponse bias likely also inflates if engaged parents (whose kids do homework) are more likely to respond. Both push the result above the true population rate. (2)\nTotal: 4 points.',
      responseFormat: 'frq', hints: ['Name and explain. Don\'t just label.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Bias = systematic, NOT fixed by larger n.',
      'Voluntary response, convenience, undercoverage, nonresponse, response, question wording.',
      'Always NAME bias AND explain direction of distortion.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'Sampling Bias', sources: [{ type: 'concept', book: 'tps5e', chapter: '4', note: 'Standard bias taxonomy.' }] },
};
