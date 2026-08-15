import type { LessonPlan } from '../types';

export const SEED_G35_LANG_MANDARIN_BEGINNER: LessonPlan = {
  id: 'evelyn.lang.3-5.mandarin-beginner.v1',
  title: 'Mandarin for beginners — 你好, 数字, 颜色',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'languages',
  topic: 'mandarin-beginner',
  locale: 'en',
  los: [
    {
      id: 'lang35.mandarin.beginner',
      description: 'Greet, count, and recognize basic Pinyin tones in Mandarin.',
      standard: 'ACTFL-Novice-Low',
    },
  ],
  prerequisites: [],
  followUps: ['lang68.mandarin-1'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Mandarin as a TONAL language with simple grammar.',
      script: 'Mandarin sounds intimidating but the GRAMMAR is actually simple — no verb conjugations, no tenses to memorize, no genders. The hard part is TONES. The same syllable in different tones means different things. Get the tone wrong, you\'ve said the wrong word.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mandarin-basics',
      kind: 'concept',
      goal: 'Tones, greetings, numbers 1-10.',
      keyIdeas: [
        'PINYIN: the romanization system. Lets you read Mandarin without learning characters first.',
        'FOUR TONES: 1st = high level (mā 妈, mom). 2nd = rising (má 麻, hemp). 3rd = falling-rising (mǎ 马, horse). 4th = falling sharp (mà 骂, scold). Plus a neutral tone.',
        'GREETINGS: 你好 nǐ hǎo (hello), 早上好 zǎo shang hǎo (good morning), 谢谢 xièxie (thank you), 再见 zàijiàn (goodbye).',
        'NUMBERS 1-10: 一 yī, 二 èr, 三 sān, 四 sì, 五 wǔ, 六 liù, 七 qī, 八 bā, 九 jiǔ, 十 shí.',
        'BASIC SENTENCE: subject + verb + object. 我吃饭 (wǒ chī fàn) = I eat rice/food.',
        'NO CONJUGATIONS: 我吃 (I eat), 你吃 (you eat), 他吃 (he eats) — verb never changes form.',
      ],
      vocabulary: [
        { term: '你好 nǐ hǎo', definition: 'hello (literally "you good").' },
        { term: '谢谢 xièxie', definition: 'thank you.' },
        { term: '再见 zàijiàn', definition: 'goodbye (literally "again see").' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In Mandarin, the syllable "ma" can mean four different words depending on what?',
      expectedAnswer: 'the tone — mā (mom), má (hemp), mǎ (horse), mà (scold)',
      responseFormat: 'free',
      hints: [
        'It\'s the pitch contour of the syllable.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-tones-optional',
      kind: 'misconception_check',
      question: 'A student says: "Tones don\'t matter much — speakers will figure out what I mean from context." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because of context',
          misconception: 'Treating tones as accent.',
          correctsTo: 'Tones are part of the WORD, not optional accent. Saying mā (mom) when you mean mǎ (horse) is like saying "ham" when you mean "horse" in English. Context helps with errors but listeners get genuinely confused. Practicing tones early — even if hard — pays off forever. Avoiding tones is the biggest mistake adult Mandarin learners make.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '4 tones: high level, rising, falling-rising, sharp falling.',
        '你好 nǐ hǎo = hello.',
        'Numbers 1-10 in Pinyin.',
        'Verbs don\'t conjugate.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
