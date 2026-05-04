/**
 * Grades 6-8 ELA — Counterclaim & Rebuttal.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_COUNTERCLAIM: LessonPlan = {
  id: 'evelyn.g68.ela.counterclaim.v1',
  title: 'Grades 6-8 ELA — Counterclaim & Rebuttal',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.counterclaim',
      description: 'Acknowledge a counterclaim and rebut it; integrate concession-rebuttal into argument paragraphs.',
      standard: 'CCSS.ELA-LITERACY.W.7.1.B',
    },
  ],
  prerequisites: ['g68.ela.argument-cer'],
  followUps: ['g68.ela.informational-research'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Strong arguments anticipate the OTHER side and refute it — that\'s what separates middle-school argument writing from elementary.',
      script: 'Imagine debating someone who says "school uniforms suppress individuality". You can pretend they didn\'t say it (weak) or you can address it head-on: "Some argue uniforms suppress individuality. While dress is one form of expression, students have many — clothing is far from the only one." That second move is COUNTERCLAIM + REBUTTAL.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-counterclaim',
      kind: 'concept',
      goal: 'Components + structure + transition phrases.',
      keyIdeas: [
        'COUNTERCLAIM: an opposing view to your own claim. Take it seriously.',
        'REBUTTAL: your response showing why the counterclaim is weak, narrow, or wrong.',
        'CONCESSION: acknowledge any partial validity in the counterclaim before refuting it. Strengthens credibility.',
        'STRUCTURE: 1) Introduce counterclaim with concession. 2) State the counterclaim. 3) Rebut with reasoning + evidence.',
        'TRANSITIONS: "Some may argue...", "It is true that...", "However...", "On the other hand...", "Despite this..."',
        'WEAK rebuttal: dismissive ("That\'s wrong"). STRONG rebuttal: addresses the actual logic of the counterclaim.',
        'WHERE in essay: counterclaim usually goes in its OWN paragraph or near the conclusion of an argument.',
        'AVOID strawman: don\'t describe a weak fake version of the counterclaim and refute that. Steel-man the strongest opposing view.',
      ],
      vocabulary: [
        { term: 'counterclaim', definition: 'an opposing argument that the writer acknowledges and responds to.' },
        { term: 'rebuttal', definition: 'the writer\'s response to a counterclaim, refuting or limiting it.' },
        { term: 'concession', definition: 'admission that part of a counterclaim has merit, before refuting the rest.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-counterclaim',
      kind: 'worked_example',
      problem: 'Write a counterclaim + rebuttal paragraph for: "Schools should adopt uniforms."',
      steps: [
        'INTRODUCE counterclaim with concession: "Some argue that uniforms suppress students\' individual expression."',
        'STATE the counterclaim fully: "These critics worry that requiring identical clothing flattens personal identity, particularly during adolescence when self-expression is critical."',
        'BEGIN REBUTTAL with concession: "It is true that clothing offers ONE form of self-expression."',
        'CONTRADICT or LIMIT: "However, students have many other channels for individuality — art, hobbies, words, friendships, and accessories within uniform guidelines."',
        'ADD evidence: "Studies of uniform schools show that students simply express identity through other means; bullying related to clothing also drops."',
        'CONCLUDE: "Uniforms do not erase individuality; they redirect it from the surface to deeper grounds."',
      ],
      answer: 'Counterclaim acknowledged with concession, rebutted with reasoning + evidence.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write a counterclaim + rebuttal for: "Phones should be banned during class."',
      expectedAnswer: 'Sample: Some argue phones are essential for emergencies. While safety is real, schools have alternative communication systems and can collect phones at the start of class without compromising safety. The trade-off — ten seconds of teacher access in an emergency vs constant distraction during 50 minutes of learning — favours banning.',
      responseFormat: 'free',
      hints: [
        'What\'s the strongest opposing argument?',
        'Acknowledge it (concession), then refute (rebuttal).',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-strawman',
      kind: 'misconception_check',
      question: 'A student "rebuts" a counterclaim by writing: "Some say homework is good. But homework is bad and they\'re wrong." Why is this weak?',
      commonErrors: [
        {
          answer: '"They\'re wrong" without explanation',
          misconception: 'Treating dismissal as rebuttal.',
          correctsTo: 'Strong rebuttal explains WHY the counterclaim falls short. Evidence, reasoning, or limit ("This applies in some cases but not others"). Saying "they\'re wrong" refuses to engage. Better: "Some say homework reinforces learning, and that is true for assignments under one hour. Beyond that, research shows diminishing returns and increased stress, so the value of homework levels off rather than continuing to grow."',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Counterclaim: opposing view.',
        'Rebuttal: your response, with reasoning and evidence.',
        'Concession: acknowledge partial validity.',
        'Steel-man, don\'t straw-man, the opposition.',
        'Transitions: "Some argue...", "However...", "On the other hand...".',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might addressing a counterclaim STRENGTHEN your argument rather than weaken it?',
      hint: 'Showing you considered the opposing view signals fair-mindedness and credibility. Readers trust writers who engage with disagreement. Ignoring counterclaims makes the writer look one-sided. Steel-manning the opposition AND refuting it demonstrates that the claim survives serious challenge — much more convincing than ignoring challenges.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
