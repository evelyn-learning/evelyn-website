import type { LessonPlan } from '../types';

export const SEED_G1112_LANG_FRENCH_4_PLUS: LessonPlan = {
  id: 'evelyn.lang.11-12.french-4-plus.v1',
  title: 'French IV+ — subjunctive (subjonctif)',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'languages',
  topic: 'french-4-plus',
  locale: 'en',
  los: [
    { id: 'lang1112.fr.subjonctif', description: 'Recognize triggers for subjonctif and form regular and irregular present subjonctif.', standard: 'ACTFL-Intermediate-High' },
  ],
  prerequisites: ['lang910.fr.composed-imparfait'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the subjonctif as parallel to Spanish subjunctive.',
      script: 'Like Spanish, French uses the subjunctive after expressions of WISH, DOUBT, EMOTION, and certain conjunctions. The forms differ but the LOGIC is the same: subjunctive lives in subordinate clauses introduced by que.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-subjonctif',
      kind: 'concept',
      goal: 'Formation + triggers.',
      keyIdeas: [
        'PRESENT SUBJONCTIF: take 3rd-person plural (ils) present indicative, drop -ent, add -e, -es, -e, -ions, -iez, -ent.',
        'EXAMPLE parler: ils parlent → parl- → que je parle, que tu parles, qu\'il parle, que nous parlions, que vous parliez, qu\'ils parlent.',
        'IRREGULAR: être → sois, sois, soit, soyons, soyez, soient. avoir → aie, aies, ait, ayons, ayez, aient. aller → aille... faire → fasse... savoir → sache...',
        'TRIGGERS: il faut que, vouloir que, souhaiter que, avoir peur que, regretter que, douter que, conjunctions (bien que, pour que, avant que, jusqu\'à ce que).',
        'INDICATIVE vs SUBJUNCTIVE: "Je pense qu\'il EST gentil" (think → indicative) vs "Je ne pense pas qu\'il SOIT gentil" (negation + thought → subjunctive).',
        'EMOTION + opinion: "Je suis content qu\'elle vienne" (I\'m glad she\'s coming).',
      ],
      vocabulary: [
        { term: 'subjonctif', definition: 'subjunctive mood for wish, doubt, emotion, certain conjunctions.' },
        { term: 'il faut que', definition: 'one must / it\'s necessary that — always triggers subjonctif.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-translate',
      kind: 'worked_example',
      problem: 'Translate: "I want you (tu) to come." (want = vouloir, come = venir)',
      steps: [
        '"vouloir que" triggers subjonctif.',
        'venir → ils viennent → vien- → vienne / viennes...',
        '"Que tu" → subjonctif: viennes.',
        'Result: "Je veux que tu viennes."',
      ],
      answer: 'Je veux que tu viennes.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Subjonctif or indicatif: "Il est important que tu ___ tes devoirs." (faire)',
      expectedAnswer: 'subjonctif — fasses (il est important que triggers subjonctif; faire is irregular: fasse, fasses, fasse, fassions, fassiez, fassent)',
      responseFormat: 'free',
      hints: [
        '"Il est important que" = impersonal triggering subjonctif.',
        'Faire is irregular.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Subjonctif lives after que.',
        'Trigger expressions: il faut que, vouloir que, avoir peur que, bien que.',
        'Form from ils-form stem + endings.',
        'Key irregulars: être, avoir, aller, faire, savoir.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
