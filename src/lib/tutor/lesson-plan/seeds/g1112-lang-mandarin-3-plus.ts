import type { LessonPlan } from '../types';

export const SEED_G1112_LANG_MANDARIN_3_PLUS: LessonPlan = {
  id: 'evelyn.lang.11-12.mandarin-3-plus.v1',
  title: 'Mandarin III+ — comparative + 把 ba construction',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'languages',
  topic: 'mandarin-3-plus',
  locale: 'en',
  los: [
    { id: 'lang1112.mn.compare-ba', description: 'Form comparative sentences with 比 bǐ and use 把 ba sentences for object-focused actions.', standard: 'ACTFL-Intermediate-High' },
  ],
  prerequisites: ['lang910.mn.aspect-particles'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame ba as the way to put the OBJECT in focus.',
      script: 'Mandarin\'s usual order is subject-verb-object. But sometimes you want to emphasize what HAPPENS TO the object — what was done, completed, transformed. The 把 ba construction promotes the object before the verb, with a result attached. Once you see it, you spot it everywhere in real Mandarin.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-compare-ba',
      kind: 'concept',
      goal: 'Comparative + ba.',
      keyIdeas: [
        'COMPARATIVE: A 比 bǐ B + adjective. "他比我高" (tā bǐ wǒ gāo) = he is taller than me.',
        'NO -er ending or "more" word — just 比.',
        'ADD A NUMBER: "他比我高五厘米" = he is 5 cm taller than me.',
        '把 BA construction: subject + 把 + object + verb + result/complement. "我把书看完了" (I read the book to completion).',
        'WHEN TO USE 把: when there\'s a clear RESULT or change in state to the object. "我把窗户打开了" (I opened the window — and now it\'s open).',
        'WHEN NOT: simple "I read books" → 我看书. No specific object, no completion focus.',
        'NEGATION: 没把 méi bǎ. "我没把书看完" = I didn\'t finish reading the book.',
      ],
      vocabulary: [
        { term: '比 bǐ', definition: 'comparative marker — "than".' },
        { term: '把 bǎ', definition: 'preposition that promotes the object before the verb to focus on result/disposition.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-ba',
      kind: 'worked_example',
      problem: 'Translate using 把: "He ate the apple all up." (apple = 苹果 píngguǒ, eat = 吃 chī, finish = 完 wán)',
      steps: [
        'Object focus + result → 把 construction.',
        'Subject: 他 tā.',
        '把 + object: 把苹果.',
        'Verb + result: 吃完 (eat-finish) + 了 (completion).',
        'Result: 他把苹果吃完了. (tā bǎ píngguǒ chī wán le)',
      ],
      answer: '他把苹果吃完了. (tā bǎ píngguǒ chī wán le)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Translate: "She is faster than her brother." (fast = 快 kuài, brother = 哥哥 gēge)',
      expectedAnswer: '她比她哥哥快 (tā bǐ tā gēge kuài)',
      responseFormat: 'free',
      hints: [
        'Comparative marker: 比 bǐ.',
        'No -er ending.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '比 bǐ for comparisons. A 比 B adjective.',
        '把 bǎ to focus on object + result/disposition.',
        '把 needs a clear result; not for generic actions.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
