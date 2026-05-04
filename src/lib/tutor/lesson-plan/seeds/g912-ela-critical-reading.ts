/**
 * Grades 9-12 ELA — Critical Reading.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_CRITICAL_READING: LessonPlan = {
  id: 'evelyn.g912.ela.critical-reading.v1',
  title: 'Grades 9-12 ELA — Critical Reading',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.critical-reading',
      description: 'Read texts critically: identify assumptions, perspective, bias, and gaps; engage as a questioning rather than passive reader.',
      standard: 'CCSS.ELA-LITERACY.RI.11-12.6',
    },
  ],
  prerequisites: ['g912.ela.logical-fallacies'],
  followUps: ['g912.ela.narrative-advanced'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Critical reading turns a passive consumer into an active participant — questioning rather than accepting.',
      script: 'Casual reading: "What does this say?" Critical reading: "What does this say, what does it ASSUME, whose interests does it serve, what does it leave out?" The shift is the difference between high-school passive reading and college-level engagement. Today we drill the questioning habits.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-critical',
      kind: 'concept',
      goal: 'Questioning framework + perspective analysis + recognising gaps.',
      keyIdeas: [
        'CRITICAL READING isn\'t HOSTILE reading. It\'s active, questioning, evaluating — even of texts you agree with.',
        'KEY QUESTIONS: 1) Who wrote this and why? 2) What perspective is privileged? 3) What\'s assumed? 4) What\'s LEFT OUT? 5) What evidence is offered? 6) What\'s contested?',
        'PERSPECTIVE: every text comes from a viewpoint. A history of WWII written in 1945 differs from one written in 2020. Author background, time period, intended audience all shape the text.',
        'WHAT IS LEFT OUT: who isn\'t mentioned? What perspective isn\'t represented? Silences are evidence.',
        'BIAS: tendency toward one perspective. Different from being WRONG — biased texts can still be informative if read critically.',
        'TONE / WORD CHOICE reveals attitude: "freedom fighters" vs "rebels" — same group, different framing.',
        'EVIDENCE: where does it come from? Cherry-picked? Statistically meaningful?',
        'CHALLENGE YOUR OWN reactions: do you agree because the text is convincing, or because it confirms what you already believed?',
        'CRITICAL doesn\'t mean DISMISSIVE. The goal is engaged understanding, not reflexive disagreement.',
      ],
      vocabulary: [
        { term: 'perspective', definition: 'the viewpoint from which a text is written; shaped by author background, era, and intended audience.' },
        { term: 'confirmation bias', definition: 'tendency to accept evidence that supports existing beliefs and dismiss evidence that contradicts them.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-critical',
      kind: 'worked_example',
      problem: 'Critically read this excerpt: "The new policy has been embraced by hardworking American families nationwide as a common-sense solution to a long-standing problem."',
      steps: [
        'PERSPECTIVE: who would call this "common-sense"? Likely supporters. The text adopts their framing.',
        'WORD CHOICE: "hardworking American families" — emotionally loaded, implies those who disagree are not hardworking or American.',
        'GAPS: who DOESN\'T support? What objections exist? Not mentioned.',
        'EVIDENCE: vague — "embraced... nationwide" — no statistics or specific examples.',
        'ASSUMPTIONS: that the problem is "long-standing" (true?), that this policy SOLVES it (proven?).',
        'CRITICAL CONCLUSION: this is persuasive framing rather than balanced analysis. Read with awareness of the rhetoric.',
      ],
      answer: 'Identifies framing, gaps, and unstated assumptions.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A history textbook calls early American settlers "pioneers" and Native peoples "obstacles to progress." What does this word choice reveal about the textbook\'s perspective?',
      expectedAnswer: 'The word choice privileges the settlers\' viewpoint — they are heroic ("pioneers"); Native peoples are reduced to "obstacles", erasing their humanity, agency, and prior land claims. The text is written from the settler perspective and frames history accordingly.',
      responseFormat: 'free',
      hints: [
        'Whose perspective do "pioneers" and "obstacles" reflect?',
        'What\'s missing or distorted?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-bias-bad',
      kind: 'misconception_check',
      question: 'A student dismisses any biased text as "useless." Why might this be a mistake?',
      commonErrors: [
        {
          answer: 'Biased = useless',
          misconception: 'Treating bias as a reason to discard rather than to read carefully.',
          correctsTo: 'Every text has SOME bias (perspective). Even a "neutral" textbook reflects choices about what to include. Dismissing biased texts means ignoring most of human writing. Better: read biased texts CRITICALLY — note the perspective, account for it, compare with other perspectives. A biased text can still inform if you know the bias. The dangerous reader is one who doesn\'t notice bias, not one who reads it skeptically.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Question: who, why, perspective, assumed, missing, evidence, contested.',
        'Word choice reveals framing.',
        'What\'s LEFT OUT is evidence.',
        'All texts have perspective; bias isn\'t disqualifying.',
        'Challenge your own confirmation bias.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does critical reading apply to texts you AGREE with?',
      hint: 'Especially crucial there. Confirmation bias makes us accept what fits our beliefs uncritically. Practising critical reading on agreeable texts trains the muscle: "What is this assuming? Where might it be wrong? What\'s left out?" Agreeing readers can also be misled. Strong readers maintain skepticism even when sympathetic.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
