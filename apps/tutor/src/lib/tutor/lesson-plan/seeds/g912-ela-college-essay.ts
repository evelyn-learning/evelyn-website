/**
 * Grades 9-12 ELA — College Essay Craft.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_COLLEGE_ESSAY: LessonPlan = {
  id: 'evelyn.g912.ela.college-essay.v1',
  title: 'Grades 9-12 ELA — College Essay Craft',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.college-essay',
      description: 'Plan and draft college application essays that reveal authentic voice, specific narrative, and reflection.',
      standard: 'CCSS.ELA-LITERACY.W.11-12.3',
    },
  ],
  prerequisites: ['g912.ela.vocab-advanced'],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A great college essay isn\'t a resume reformatted as prose — it\'s a window into who you are.',
      script: 'Admissions officers read thousands of essays. Generic essays about "what soccer taught me" disappear in the pile. Specific, voice-driven essays that reveal a real person\'s thinking stand out. Today we drill the moves that make admissions essays sing.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-college-essay',
      kind: 'concept',
      goal: 'Voice + specificity + reflection + structure for the Common App + tone.',
      keyIdeas: [
        'PURPOSE: reveal who you ARE, not list what you\'ve DONE. The essay is the only place admissions hears YOU.',
        'VOICE: write the way you actually think — not as you imagine "college essays" sound. Be authentic.',
        'SPECIFICITY: concrete moments beat abstract claims. "I learned the value of teamwork" → no. "When my soccer team lost the playoff because I missed the penalty kick, I learned that being responsible for the outcome means accepting blame publicly..." → YES.',
        'REFLECTION: don\'t just NARRATE. Reflect on what the moment meant, what you\'ve thought about since, how you\'ve changed.',
        'STRUCTURE for narrative essay: 1) HOOK in a moment. 2) Backstory if needed. 3) Develop the moment. 4) Reflect. 5) Connect to your future self.',
        'TONE: warm but not begging. Confident but not arrogant. Honest about struggle.',
        'AVOID: clichés (sports victory teaching life lessons, mission trip "discoveries"), name-dropping, listing achievements.',
        'AVOID PRETENTIOUS LANGUAGE: trying to sound impressive backfires. Plain language with depth wins.',
        'AUDIENCE: admissions readers are humans. They want to like you. Make it easy for them.',
        'REVISION: 5+ drafts is normal. Get feedback from teachers, parents, peers.',
        'STAYING WITHIN LIMITS: Common App is 250-650 words. Many supplemental essays are shorter. Cut tightly.',
      ],
      vocabulary: [
        { term: 'voice', definition: 'the distinctive personality of a writer in prose; built through diction, syntax, and attitude.' },
        { term: 'specificity', definition: 'detailed, concrete writing that beats abstract or general claims.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-improve',
      kind: 'worked_example',
      problem: 'Improve this opening: "Throughout my high-school career, I have always been passionate about science and learning new things."',
      steps: [
        'Original is: 1) generic ("throughout my high-school career"), 2) cliché ("passionate about science"), 3) tells without showing.',
        'IMPROVED: "I once spent four hours arguing with my chemistry teacher about whether quantum tunnelling could explain why my eggs cooked unevenly. He won. I went home and tried again with a different pan."',
        'Why better: SPECIFIC moment, REVEALS personality (curious, dogged, willing to argue with teachers, self-deprecating), HINTS at scientific interest without claiming "passion".',
        'Show, don\'t tell. Specifics > clichés.',
      ],
      answer: 'Specific story replaces generic claim.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Take this clichéd ending and rewrite to be specific: "This experience taught me to never give up."',
      expectedAnswer: 'Sample: "I still don\'t know if I\'ll make varsity next year. But the next morning at 5:45 AM, I was on the field practising the move that had failed me. The work itself, even without guarantee, had become the point." (Specific, reflective, no cliché.)',
      responseFormat: 'free',
      hints: [
        'Replace abstract "never give up" with a specific action you took.',
        'Show the reflection, don\'t state it.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-impressive',
      kind: 'misconception_check',
      question: 'A student writes a college essay listing their achievements and using formal vocabulary. Why might this hurt their application?',
      commonErrors: [
        {
          answer: 'List achievements, sound formal',
          misconception: 'Treating the essay as a resume in prose.',
          correctsTo: 'The essay is the COUNTERWEIGHT to the resume. Admissions already has GPAs, test scores, awards, activities. The essay is the only place to show personality, voice, reflection. Listing achievements duplicates the application; sounding formal hides personality. Better: pick ONE specific moment that reveals something true about how you think. The reader should feel they\'ve met you.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Reveal who you are; don\'t recap what you\'ve done.',
        'Voice authentic, not "essay-y".',
        'Specific moments beat abstract claims.',
        'Reflect, don\'t just narrate.',
        'Avoid clichés and pretentious language.',
        'Revise heavily; get feedback.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the college essay more important for some applicants than others?',
      hint: 'For applicants whose academic profile alone won\'t differentiate them — many applicants have similar GPAs and test scores at competitive schools. The essay becomes the tipping factor. For applicants overcoming context (limited resources, family circumstances), the essay is where to address what numbers can\'t show. For applicants in arts or humanities, the essay demonstrates the very craft they\'re applying to study.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
