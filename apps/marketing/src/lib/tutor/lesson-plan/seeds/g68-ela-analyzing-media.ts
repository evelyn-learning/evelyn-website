/**
 * Grades 6-8 ELA — Analyzing Media & Visual Texts.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_ANALYZING_MEDIA: LessonPlan = {
  id: 'evelyn.g68.ela.analyzing-media.v1',
  title: 'Grades 6-8 ELA — Analyzing Media & Visual Texts',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.analyzing-media',
      description: 'Analyze visual and digital texts (ads, photos, videos, infographics) for persuasive techniques and bias.',
      standard: 'CCSS.ELA-LITERACY.RI.7.7',
    },
  ],
  prerequisites: ['g68.ela.comparing-texts'],
  followUps: ['g68.ela.greek-latin-roots'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Images and videos persuade in ways words don\'t — and savvy readers learn to spot the techniques.',
      script: 'A toothpaste commercial. A political poster. A news photo of a protest. Each makes choices: framing, lighting, music, text overlay. Each designed to shape your reaction. Today we drill how to ANALYSE these choices instead of being moved by them unconsciously.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-media',
      kind: 'concept',
      goal: 'Visual analysis framework + persuasive techniques + bias detection.',
      keyIdeas: [
        'WHAT IS MEDIA: any communication delivered through images, sound, video, or web. Includes ads, news, social media posts, infographics.',
        'TECHNIQUES IN ADS: emotional appeal, celebrity endorsement, "everybody\'s doing it" (bandwagon), expert testimony, fear appeal.',
        'VISUAL CHOICES: framing (close vs wide), angle (looking up makes subject powerful; down makes them weak), lighting (warm vs cold), colour (red signals urgency, blue calm).',
        'AUDIO CHOICES (in video): music tempo, sound effects, narration tone — all manipulate mood.',
        'TEXT OVERLAY: bold claims, statistics (often without context), captions that frame interpretation.',
        'BIAS: a perspective that systematically favours one side. All media has SOME bias; the question is degree and direction.',
        'RED FLAGS for bias: emotional language, missing context, one-sided sources, cherry-picked statistics.',
        'SOURCE EVALUATION: who made this? Why? Who funds the source? CRAAP test applies (Currency, Relevance, Authority, Accuracy, Purpose).',
        'INFOGRAPHIC ANALYSIS: check the source, check the data, check whether visualisations distort scale (truncated y-axes, misleading area).',
      ],
      vocabulary: [
        { term: 'media', definition: 'channels of communication, especially visual or digital ones (advertising, news, social media).' },
        { term: 'bias', definition: 'a leaning toward one perspective at the expense of others.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-ad',
      kind: 'worked_example',
      problem: 'Analyse this ad description: "A 30-second commercial for a sports drink shows a young athlete training in slow motion to inspirational music. The athlete drinks the product, then sprints across a finish line. Tagline: \'Be the champion you were meant to be.\'"',
      steps: [
        'TECHNIQUE 1 — Emotional appeal: inspirational music + slow-motion training trigger feelings of admiration.',
        'TECHNIQUE 2 — Aspiration: "be the champion" — implies the product is what unlocks excellence.',
        'TECHNIQUE 3 — Implied causation: drinks → wins. Visual order suggests product caused the win.',
        'WHAT\'S MISSING: actual evidence the drink helps performance. Ingredients. Comparison with water.',
        'CONCLUSION: ad uses emotion + aspiration to bypass evidence-based reasoning. Effective marketing, not effective scientific argument.',
      ],
      answer: 'Identifies emotional appeal, aspiration, implied causation; notes missing evidence.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A news photo shows a protest from a low angle, making protesters look tall and powerful. What might this framing suggest about the photographer\'s perspective?',
      expectedAnswer: 'Sympathetic to the protesters; the low angle empowers them. A high-angle shot would have minimised them.',
      responseFormat: 'free',
      hints: [
        'Camera angle affects how subjects appear.',
        'Low angle = looking up at = empowered.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-objective-image',
      kind: 'misconception_check',
      question: 'A student says "photographs always show objective truth — they can\'t lie." Why is this naive?',
      commonErrors: [
        {
          answer: 'Photos = objective truth',
          misconception: 'Treating photographs as neutral records, ignoring framing and selection.',
          correctsTo: 'Every photograph involves CHOICES: what to include, what to crop out, what angle, what moment. A photographer covering a protest could show a peaceful crowd or a confrontational shouting face — same event, opposite impressions. Photos can\'t lie about what was IN FRAME, but they can mislead about what was happening overall by selective framing. Critical analysis assumes ALL media is shaped by choices.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Media uses image, sound, text together to persuade.',
        'Common techniques: emotional appeal, framing, music, text overlay.',
        'All media reflects choices; no medium is fully objective.',
        'Bias signals: emotional language, missing context, cherry-picked stats.',
        'Always ask: who made this? why? who paid?',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How can a misleading infographic distort data without lying?',
      hint: 'Common tricks: 1) Truncated y-axis exaggerates differences. 2) 3D effects distort area perception. 3) Selective time ranges that show favourable trends. 4) Comparing rates vs absolute numbers selectively. 5) Different scales for compared items. None are technically lies — but each creates false impressions. Always check axes, time spans, and units.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
