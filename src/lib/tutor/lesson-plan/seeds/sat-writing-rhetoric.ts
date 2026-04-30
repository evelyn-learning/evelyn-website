/**
 * SAT Writing & Language — Rhetoric (Synthesis, Transitions, Evidence).
 *
 * The "rhetorical skills" sub-domain: organization, focus, evidence use, and transitions.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_WRITING_RHETORIC: LessonPlan = {
  id: 'evelyn.sat.writing.rhetoric.v1',
  title: 'SAT Writing — Rhetoric (Synthesis, Transitions, Evidence)',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'sat.writing-rhetoric',
      description: 'Apply rhetorical-skill strategies to SAT Writing & Language questions on transitions, paragraph focus, evidence use, and argument structure.',
      standard: 'SAT-WL-RHET',
    },
  ],
  prerequisites: ['sat.writing-grammar'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Half of SAT Writing isn\'t grammar — it\'s rhetorical clarity.',
      script: 'About half of the SAT Writing & Language questions test grammar (commas, subject-verb agreement, etc.). The OTHER half tests RHETORIC: did the writer pick the right transition? Does this sentence belong in this paragraph? Does this evidence actually support the claim? These questions reward different reading — focus and structure rather than memorized grammar rules.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Rhetorical question types and how to handle each.',
      keyIdeas: [
        'TRANSITION QUESTIONS: ask which connector best joins two sentences. Identify the LOGICAL relationship: AGREEMENT (also, similarly, in addition), CONTRAST (however, but, nevertheless), CAUSE-EFFECT (therefore, consequently, as a result), EXAMPLE (for example, for instance), TIME (then, finally, meanwhile). Pick by meaning, NEVER just style.',
        'COMBINING SENTENCES: ask which version is most concise + clear. Eliminate redundant words. Keep specific information. Best answer is usually the SHORTEST that retains all meaning.',
        'PARAGRAPH FOCUS: ask whether a sentence belongs in a paragraph. Read the topic sentence and the surrounding sentences. If the candidate strays from the paragraph\'s SPECIFIC topic, delete or move it.',
        'ADD/DELETE QUESTIONS: ask whether a sentence should be added or kept. Two sub-questions: (1) does it support the paragraph\'s point? (2) does the reason given in the answer choice match the actual function?',
        'EVIDENCE QUESTIONS: ask which option best supports a claim. Check that the evidence DIRECTLY relates to the specific claim. Beware of evidence that\'s "true but irrelevant".',
        'REORDERING: ask where a sentence best fits. Identify what comes BEFORE it (the connection) and AFTER it (what should follow). Look for cohesion clues: pronouns referring to a prior subject, transition words.',
        'GRAPH-BASED RHETORIC: a passage references a chart. Question may ask which choice is most accurate to the data. Read the graph carefully — units, axis values, trends. Distractor answers often misstate the graph.',
        'STYLE / TONE: ask whether a phrase fits the passage\'s style (formal vs casual). Match the surrounding tone. Don\'t default to "fancier".',
      ],
      vocabulary: [
        { term: 'transition', definition: 'a word or phrase that signals the logical relationship between two ideas.' },
        { term: 'cohesion', definition: 'the connection between sentences and paragraphs that makes a passage flow.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-transition',
      kind: 'worked_example',
      problem: 'Two sentences: "The new policy reduced commute times by 15%. ___ ridership on public transit fell by 8%." Which transition fits: "Therefore," "However," "For example," or "Meanwhile"?',
      steps: [
        'Sentence 1: positive effect of policy (commute times down).',
        'Sentence 2: a result that\'s SURPRISING given sentence 1 (you might expect ridership UP, not down).',
        '"Therefore" — implies cause/effect. But the second sentence doesn\'t naturally follow from faster commutes.',
        '"However" — signals contrast / surprise. Fits — fast commutes might be expected to RAISE ridership, but it FELL. Contrast.',
        '"For example" — wrong; the second isn\'t an example of the first.',
        '"Meanwhile" — neutral simultaneity. Possible but weaker than "However" because it misses the contrast.',
        'BEST ANSWER: "However."',
      ],
      answer: '"However" — the second sentence is contrary to what you\'d expect from the first.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A paragraph about Marie Curie\'s isolation of radium adds a sentence about her daughter Irene\'s later research. Should the sentence be added if the paragraph is specifically about radium isolation?',
      expectedAnswer: 'No, delete it — the paragraph is focused on radium isolation. Information about Irene\'s research is relevant to a different topic. Even if biographically connected, it strays from the paragraph\'s specific point.',
      responseFormat: 'free',
      hints: [
        'Does the sentence advance the paragraph\'s SPECIFIC topic?',
        'Or is it just biographically related but not on-topic?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fancy-words',
      kind: 'misconception_check',
      question: 'On SAT Writing, do answer choices with more sophisticated vocabulary tend to be correct?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Equating fancy with correct.',
          correctsTo: 'No — the SAT rewards CLARITY, CONCISENESS, and STYLE FIT. The simplest accurate phrasing usually wins. Distractors with fancy words ("utilize", "in light of the fact that") that just inflate sentences are often WRONG. Match the passage\'s tone, not "academic-sounding". Concise + clear + on-tone beats elaborate.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Transitions: signal LOGICAL relationship (agree, contrast, cause, example, time).',
        'Paragraph focus: only sentences advancing the SPECIFIC topic belong.',
        'Evidence: must DIRECTLY support the specific claim, not just be true.',
        'Style: match the passage\'s tone. Concise + clear > elaborate.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A passage references a chart showing rising electric vehicle adoption. The question asks which sentence best summarizes the chart. Why is reading the chart yourself crucial?',
      hint: 'Distractor answers often state the data INACCURATELY ("EVs rose by 50%") when the chart actually shows different values. Or they cite an irrelevant trend ("hybrid adoption rose"). Always read axes, units, time periods, then check each answer against the data. The right answer matches the chart precisely; wrong answers misstate it confidently.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
