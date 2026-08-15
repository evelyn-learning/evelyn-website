/**
 * Grades 3-5 ELA — Verb Tenses.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_VERB_TENSES: LessonPlan = {
  id: 'evelyn.g35.ela.verb-tenses.v1',
  title: 'Grades 3-5 ELA — Verb Tenses',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.verb-tenses',
      description: 'Use present, past, and future tenses correctly; recognise progressive forms; maintain consistent tense within a piece.',
      standard: 'CCSS.ELA-LITERACY.L.4.1.B',
    },
  ],
  prerequisites: ['g35.ela.pronoun-usage'],
  followUps: ['g35.ela.commas-quotes'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Tense tells WHEN something happens — and switching tenses by accident confuses readers.',
      script: '"I walked to the store. I buy some apples." Wait — when did this happen? Past, then suddenly present. The reader has to stop and re-anchor in time. Today we lock in tense consistency and the irregular verbs that trip up most writers.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-tenses',
      kind: 'concept',
      goal: 'Three core tenses + progressive forms + consistency.',
      keyIdeas: [
        'PRESENT TENSE: action happens now or habitually. "I walk." "She runs."',
        'PAST TENSE: action happened in the past. Most regular verbs add -ed. "I walked." "She ran."',
        'FUTURE TENSE: action will happen later. Use "will". "I will walk." "She will run."',
        'PROGRESSIVE FORMS: action ongoing.',
        '  Present progressive: am/is/are + -ing. "I am walking."',
        '  Past progressive: was/were + -ing. "I was walking."',
        '  Future progressive: will be + -ing. "I will be walking."',
        'IRREGULAR VERBS: don\'t add -ed for past. Common ones to memorise:',
        '  Go → went (not "goed"). See → saw. Eat → ate. Run → ran. Take → took. Begin → began. Catch → caught. Bring → brought. Buy → bought. Have → had.',
        'TENSE CONSISTENCY: stay in one tense unless there\'s a reason to shift. Narratives are often in past; informational texts often in present.',
        'COMMON ERROR: switching tenses mid-paragraph without signal. "I went to the park. Then I see a friend." → fix: "Then I saw a friend."',
      ],
      vocabulary: [
        { term: 'tense', definition: 'the form of a verb that shows when the action takes place.' },
        { term: 'progressive', definition: 'the tense form using -ing that shows an ongoing action.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-tense',
      kind: 'worked_example',
      problem: 'Fix the tense problems in this paragraph: "Last summer, I go to my grandma\'s house. We bake cookies and watched movies. It is the best week ever."',
      steps: [
        'Determine the intended tense: "Last summer" signals PAST.',
        'Find each verb: "go" (present, wrong), "bake" (present, wrong), "watched" (past, right), "is" (present, wrong).',
        'Convert to past: go → went, bake → baked, watched stays, is → was.',
        'Revised: "Last summer, I WENT to my grandma\'s house. We BAKED cookies and watched movies. It WAS the best week ever."',
      ],
      answer: 'Consistent past tense throughout.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What is the past tense of "go", "see", and "eat"?',
      expectedAnswer: 'went, saw, ate (all irregular)',
      responseFormat: 'free',
      hints: [
        'These are IRREGULAR — they do not follow the -ed pattern.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-irregular-ed',
      kind: 'misconception_check',
      question: 'A student writes "I goed to the park." Why is this wrong?',
      commonErrors: [
        {
          answer: '"I goed"',
          misconception: 'Adding -ed to every past-tense verb without checking for irregulars.',
          correctsTo: '"Go" is IRREGULAR — its past tense is "went", not "goed". The -ed ending only works for regular verbs (walked, played, jumped). Common irregulars must be memorised: go→went, see→saw, eat→ate, run→ran, do→did. Children naturally over-apply the -ed pattern; correcting it requires memorising the most-used irregulars.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Present, past, future — three core tenses.',
        'Regular past = verb + -ed. Irregular = memorise (went, saw, ate, ran, took).',
        'Progressive = am/is/are/was/were/will-be + -ing.',
        'Stay in one tense throughout; only shift with a reason.',
        'Narratives often in past; informational often in present.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might a writer DELIBERATELY switch tenses?',
      hint: 'To signal a flashback or flash-forward. Example in a present-tense narrative: "I am walking to school. Yesterday, I saw a strange thing. Now, the same person stands across the street." The tense shift cues the reader: "yesterday" gets past tense; "now" returns to present. Deliberate, signalled shifts work; accidental ones confuse.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
