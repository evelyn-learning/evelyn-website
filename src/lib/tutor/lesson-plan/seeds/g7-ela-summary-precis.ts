/**
 * G7 — Summarizing nonfiction (objective summary).
 *
 * Identify main idea + supporting ideas; restate without opinion;
 * keep it short.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_ELA_SUMMARY_PRECIS: LessonPlan = {
  id: 'evelyn.g7.ela.reading.objective-summary.v1',
  title: 'Writing an objective summary',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'ela',
  topic: 'reading',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.7.ri.2',
      description: 'Determine two or more central ideas in a text and analyze their development; provide an objective summary of the text.',
      standard: 'CCSS.ELA-LITERACY.RI.7.2',
    },
  ],
  prerequisites: ['ccss.ela.5.ri.2'],
  followUps: ['ccss.ela.9-10.ri.2'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Distinguish summary from review.',
      script: 'Imagine telling a friend what a book is ABOUT vs whether you LIKED it. Two different things. Summary = what the text says. Review = what YOU think. Today: how to summarize without sneaking in opinions.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'Three rules + the structure of a good summary.',
      keyIdeas: [
        'RULE 1: Find the MAIN IDEA — what is the whole text mostly about?',
        'RULE 2: Pick the most IMPORTANT supporting ideas. Skip the small details, the examples, the side notes.',
        'RULE 3: BE OBJECTIVE — no "I think", "this was boring", "the best part was". Stick to what the author actually wrote.',
        'A good summary is roughly 1/4 to 1/3 the length of the original. Doesn\'t copy sentences; it RESTATES in your own words.',
        'STRUCTURE: 1 sentence stating main idea + 2-4 sentences with key supporting points + 1 closing sentence (what conclusion the text reaches).',
      ],
      vocabulary: [
        { term: 'summary', definition: 'a short, objective restatement of a text\'s main ideas.' },
        { term: 'objective', definition: 'without personal opinions or feelings.' },
        { term: 'central idea', definition: 'the most important point a text makes.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fix',
      kind: 'worked_example',
      problem: 'Bad summary: "This article was super interesting. It talked about how I think the moon is amazing because it\'s bigger than I thought." How do we fix it?',
      steps: [
        'PROBLEMS: 1) "super interesting" is opinion. 2) "I think" is opinion. 3) "amazing because it\'s bigger than I thought" is opinion + vague.',
        'STRIP OPINIONS: rewrite as facts only.',
        'BETTER: "The article explains the size and characteristics of the moon. It compares the moon\'s diameter to Earth\'s and describes its surface features. The author concludes that the moon is larger relative to its planet than any other moon in the solar system."',
        'Check: no "I think", no judgments. Just what the article said.',
      ],
      answer: 'remove all opinion words; restate the facts in your own words',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which sentence belongs in an OBJECTIVE summary? (a) "The article was poorly organized." (b) "The article describes three causes of the Great Depression."',
      expectedAnswer: '(b)',
      responseFormat: 'free',
      hints: [
        '(a) is an opinion ("poorly organized" is your judgment).',
        '(b) is factual — restating what the article does.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-shortcuts-okay',
      kind: 'misconception_check',
      question: 'Can I just copy the first and last sentences of each paragraph as my summary?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Copy-paste summary.',
          correctsTo: 'No — that\'s plagiarism if you don\'t restate. Real summary requires you to UNDERSTAND, then rewrite in your own words. Just copying sentences doesn\'t demonstrate that you got the ideas.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Find the main idea, pick the most important supporting points.',
        'Be OBJECTIVE — no opinions, judgments, or feelings.',
        'Restate in YOUR OWN words; don\'t copy.',
        'Keep it short — about 1/4 to 1/3 the original length.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is summarizing one of the most useful school skills you\'ll ever learn?',
      hint: 'Note-taking, studying, research, professional writing, even understanding news — all rely on extracting main ideas from long content. The skill scales with you for life.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
