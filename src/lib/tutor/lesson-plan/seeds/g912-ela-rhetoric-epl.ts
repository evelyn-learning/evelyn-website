/**
 * Grades 9-12 ELA — Rhetorical Analysis (Ethos, Pathos, Logos).
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_RHETORIC_EPL: LessonPlan = {
  id: 'evelyn.g912.ela.rhetoric-epl.v1',
  title: 'Grades 9-12 ELA — Rhetorical Analysis (Ethos, Pathos, Logos)',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.rhetoric-epl',
      description: 'Identify and analyse Aristotle\'s three rhetorical appeals: ethos, pathos, logos. Apply to speeches and persuasive texts.',
      standard: 'CCSS.ELA-LITERACY.RI.11-12.6',
    },
  ],
  prerequisites: ['g912.ela.literary-devices'],
  followUps: ['g912.ela.argument-analysis'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Aristotle\'s 2,400-year-old framework still explains how to persuade people today.',
      script: 'Watch any political speech, advertisement, or court argument. Three forces will be at work: appeal to authority (ETHOS), appeal to emotion (PATHOS), appeal to logic (LOGOS). Aristotle named them in ancient Greece, and they still describe how persuasion works. Today we make them visible to you.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-epl',
      kind: 'concept',
      goal: 'Three appeals + identification + balanced use.',
      keyIdeas: [
        'ETHOS: appeal to credibility and character. The speaker says "trust me because I\'m qualified / honest / experienced." Doctors quoting medical journals; veterans speaking on military matters; celebrities endorsing products.',
        'PATHOS: appeal to emotion. Stirs fear, sympathy, anger, hope. Charity ads showing suffering children; politicians invoking patriotism; horror movies; anti-smoking campaigns.',
        'LOGOS: appeal to logic and evidence. Statistics, data, syllogisms, case studies, structured arguments.',
        'BALANCED PERSUASION uses all three. Pure logos can feel cold. Pure pathos can feel manipulative. Pure ethos can feel like an appeal to authority alone. The strongest arguments mix.',
        'IDENTIFY ETHOS: who is speaking, why should we trust them, what credentials are invoked?',
        'IDENTIFY PATHOS: what emotions are evoked? Through what imagery, language, story?',
        'IDENTIFY LOGOS: what facts, data, reasoning are presented? Is the logic valid?',
        'EVALUATE: are appeals SUPPORTED or MANIPULATIVE? Logos with cherry-picked stats. Pathos that exploits without solving. Ethos that claims false credentials.',
        'DISTINGUISH: a manipulative appeal looks like a legitimate appeal — until you check the evidence.',
      ],
      vocabulary: [
        { term: 'ethos', definition: 'appeal to credibility, authority, or character.' },
        { term: 'pathos', definition: 'appeal to emotion.' },
        { term: 'logos', definition: 'appeal to logic and evidence.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-epl',
      kind: 'worked_example',
      problem: 'Identify the appeals in this speech excerpt: "As a doctor with 30 years of experience, I have personally seen what addiction does to families. Statistics show that for every dollar spent on early intervention, $7 in long-term costs are saved. We owe it to the next generation to act now."',
      steps: [
        'ETHOS: "As a doctor with 30 years of experience" establishes the speaker\'s credibility.',
        'PATHOS: "I have personally seen what addiction does to families" + "owe it to the next generation" — emotional appeal through personal witness and obligation.',
        'LOGOS: "Statistics show that for every dollar spent on early intervention, $7 in long-term costs are saved" — concrete data.',
        'STRONG balance: all three present. Reader is moved emotionally, persuaded by data, AND inclined to trust the source.',
      ],
      answer: 'Ethos (doctor credentials), pathos (personal witness, generational duty), logos (cost-benefit ratio). Balanced.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the dominant appeal: "If we don\'t act now, our children will inherit an unliveable planet."',
      expectedAnswer: 'Pathos (emotional appeal to fear and protective instincts toward children).',
      responseFormat: 'free',
      hints: [
        'Is the speaker presenting data? Or stirring emotion?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pathos-bad',
      kind: 'misconception_check',
      question: 'A student says "pathos is manipulative — strong arguments rely only on logos." Why is this wrong?',
      commonErrors: [
        {
          answer: 'Avoid pathos entirely',
          misconception: 'Treating emotional appeals as inherently manipulative.',
          correctsTo: 'Pathos is a LEGITIMATE part of persuasion. Humans aren\'t purely rational — emotions inform decisions, especially moral ones. A charity that shows suffering does so to make the abstract concrete; a war reporter who describes a bombing\'s human cost moves readers to demand peace. The line between legitimate and manipulative pathos is whether the emotion fits the FACTS. Manipulation: stirring fear without grounds. Legitimate pathos: connecting feeling to reality.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Ethos: credibility. Pathos: emotion. Logos: logic.',
        'Strong persuasion balances all three.',
        'Identify by asking: trust source? Move emotion? Logical argument?',
        'Evaluate honesty: emotional appeal grounded in facts is legitimate; ungrounded pathos is manipulation.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might pure logos sometimes FAIL to persuade?',
      hint: 'Humans aren\'t purely logical. A stack of climate-change statistics may not motivate action — but a story of a single family losing their home to flooding might. Logos persuades the analytical mind; pathos engages the gut. Skilled persuaders know when each works. Logos alone often fails because action requires emotional stake.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
