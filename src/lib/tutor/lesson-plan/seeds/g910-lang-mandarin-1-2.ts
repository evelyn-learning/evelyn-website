import type { LessonPlan } from '../types';

export const SEED_G910_LANG_MANDARIN_1_2: LessonPlan = {
  id: 'evelyn.lang.9-10.mandarin-1-2.v1',
  title: 'Mandarin I-II — particles 了, 过, 着',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'languages',
  topic: 'mandarin-1-2',
  locale: 'en',
  los: [
    { id: 'lang910.mn.aspect-particles', description: 'Use 了 le, 过 guo, and 着 zhe to mark aspect rather than tense.', standard: 'ACTFL-Intermediate-Low' },
  ],
  prerequisites: ['lang68.mn1.characters'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Mandarin as ASPECT-based, not tense-based.',
      script: 'English marks WHEN (past, present, future) on the verb. Mandarin marks ASPECT — whether something is completed, experienced, or ongoing — using particles. The verb itself never changes form. Time you express with adverbs (yesterday, tomorrow). Aspect with 了, 过, 着.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-particles',
      kind: 'concept',
      goal: 'Three aspect particles.',
      keyIdeas: [
        '了 LE marks COMPLETION or change of state. "我吃了饭" (wǒ chī le fàn) = I have eaten / I ate. Position: after verb (or end of sentence for change of state).',
        '过 GUO marks past EXPERIENCE — has done something at least once. "我去过中国" (wǒ qù guo Zhōngguó) = I have been to China.',
        '着 ZHE marks ongoing STATE during another action. "他坐着看书" = he reads while sitting (lit: "he sit-zhe read book").',
        'TIME words handle when: 昨天 yesterday, 今天 today, 明天 tomorrow. Verb itself doesn\'t conjugate.',
        'NEGATION of completed past: 没 méi (or 没有 méi yǒu), NOT 不 bù. "我没吃" = I haven\'t eaten / didn\'t eat.',
        'COMMON CONFUSION: 了 le has multiple uses; CONTEXT and POSITION distinguish them. Don\'t over-add 了.',
      ],
      vocabulary: [
        { term: '了 le', definition: 'aspect particle for completion / change of state.' },
        { term: '过 guo', definition: 'aspect particle for past experience (have done at least once).' },
        { term: '着 zhe', definition: 'aspect particle for ongoing state during another action.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pick',
      kind: 'worked_example',
      problem: 'Translate: "I have eaten Beijing duck." (Beijing duck = 北京烤鸭 Běijīng kǎoyā)',
      steps: [
        '"have eaten" = past experience, at least once → 过 guo.',
        'Result: 我吃过北京烤鸭. (wǒ chī guo Běijīng kǎoyā)',
        'NOT 我吃了北京烤鸭 — that means "I just ate the duck" (one specific completed instance), not "I have at some point tried it".',
      ],
      answer: '我吃过北京烤鸭. (wǒ chī guo Běijīng kǎoyā)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How would you say "I haven\'t finished my homework" in Mandarin? (Hint: negation of completed past.)',
      expectedAnswer: '我没做完作业 (wǒ méi zuò wán zuòyè) — use 没 to negate completed action; do NOT use 了 in negation',
      responseFormat: 'free',
      hints: [
        'Negate with 没, not 不.',
        'When 没 is used, drop 了.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mandarin marks ASPECT, not tense.',
        '了 = completion / change of state.',
        '过 = past experience.',
        '着 = ongoing state during another action.',
        'Negate completed: 没 not 不.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
