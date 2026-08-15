/**
 * Grades 6-8 ELA — Argument Writing (Claim, Evidence, Reasoning).
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_ARGUMENT_CER: LessonPlan = {
  id: 'evelyn.g68.ela.argument-cer.v1',
  title: 'Grades 6-8 ELA — Argument Writing (CER)',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.argument-cer',
      description: 'Construct argument paragraphs using the Claim-Evidence-Reasoning (CER) framework with strong reasoning explaining how evidence supports the claim.',
      standard: 'CCSS.ELA-LITERACY.W.7.1',
    },
  ],
  prerequisites: ['g68.ela.tone-mood'],
  followUps: ['g68.ela.counterclaim'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'CER is the secret weapon of strong middle-school writers — and it works in science, history, and ELA.',
      script: 'A weak essay says "Schools should have later start times because it\'s good for students." A strong essay claims, cites evidence, and EXPLAINS how the evidence supports the claim. CER = Claim, Evidence, Reasoning. Today we build the habit.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cer',
      kind: 'concept',
      goal: 'Each component + the full structure + common mistakes.',
      keyIdeas: [
        'CLAIM: a debatable statement answering the prompt or thesis. Specific, defensible. NOT a fact.',
        'EVIDENCE: specific facts, data, examples, or quotes that support the claim. Cite sources.',
        'REASONING: an explanation of HOW the evidence supports the claim. Connects the dots.',
        'STRUCTURE for CER paragraph: 1) Claim (1-2 sentences). 2) Evidence (1-3 sentences with citation). 3) Reasoning (2-4 sentences linking evidence to claim). 4) Concluding sentence.',
        'WEAK CLAIM: "Bullying is bad." (Not debatable.) STRONG CLAIM: "Schools should require monthly anti-bullying training because it reduces incidents by measurable amounts."',
        'WEAK EVIDENCE: vague generalities. STRONG EVIDENCE: specific data, named studies, exact quotes.',
        'WEAK REASONING: restating the evidence. STRONG REASONING: explaining the WHY behind the connection.',
        'AVOID: stacking evidence without reasoning. The "so what" of evidence must be explicit.',
        'TRANSITION WORDS for reasoning: "This shows that...", "This suggests...", "The reason this matters...", "Therefore..."',
      ],
      vocabulary: [
        { term: 'claim', definition: 'a debatable statement that the writer will support with evidence and reasoning.' },
        { term: 'reasoning', definition: 'the explanation of how evidence supports a claim.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cer',
      kind: 'worked_example',
      problem: 'Write a CER paragraph for the claim that schools should reduce homework loads in middle school.',
      steps: [
        'CLAIM: "Middle schools should reduce nightly homework to under 60 minutes because excessive homework harms student well-being without improving academic outcomes."',
        'EVIDENCE: "A 2014 Stanford University study of 4,300 students found that more than 2 hours of homework per night correlated with sleep deprivation, headaches, and anxiety, with no measurable benefit to test scores beyond the 1-2 hour mark (Stanford News, 2014)."',
        'REASONING: "This evidence shows that beyond a certain point, additional homework not only stops helping students learn — it actively damages their physical and mental health. Adolescents already face heavy social and emotional demands; piling on busywork takes time away from sleep, exercise, and family — the very ingredients of a healthy developing brain. If homework\'s purpose is to support learning, then a load that produces zero learning benefit and clear health costs is counterproductive."',
        'CONCLUDING SENTENCE: "Reducing homework loads is therefore not lowering standards — it is aligning policy with what evidence already shows."',
      ],
      answer: 'Full CER paragraph with claim, cited evidence, reasoning, and conclusion.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write a CER about whether students should have a daily recess. Include claim + 1 piece of evidence + reasoning.',
      expectedAnswer: 'Sample: Claim — Daily recess should be mandatory. Evidence — A 2013 American Academy of Pediatrics report links recess with better classroom behaviour. Reasoning — Recess gives the brain a chance to consolidate learning and lets kids burn off energy that would otherwise distract from class. Without it, behavioural problems increase.',
      responseFormat: 'free',
      hints: [
        'Claim: take a position.',
        'Evidence: a fact or study.',
        'Reasoning: WHY the evidence supports the claim.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-no-reasoning',
      kind: 'misconception_check',
      question: 'A student writes: "Recess helps students learn. Schools that have recess do better on tests. Therefore, recess helps students learn." What\'s missing?',
      commonErrors: [
        {
          answer: 'Repeating the claim instead of reasoning',
          misconception: 'Treating restating the claim as reasoning.',
          correctsTo: 'The "Therefore..." sentence just RESTATES the claim. REASONING explains the MECHANISM: "When students take physical breaks, their brains consolidate new information and reset attention. The improved test scores in recess schools likely reflect this neurological benefit." That\'s the missing piece — connecting evidence to claim through a causal explanation.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Claim: debatable position.',
        'Evidence: specific facts/data with citation.',
        'Reasoning: WHY the evidence supports the claim.',
        'Avoid stacking evidence without reasoning.',
        'Transitions: "This shows...", "This suggests...".',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does CER apply outside ELA — for example, in science labs?',
      hint: 'In science: Claim = "The plants in light grew taller." Evidence = "Plants in sunlight averaged 12 cm vs 4 cm in dark by week 3." Reasoning = "Photosynthesis requires light to convert CO2 to glucose; without light, plants exhaust stored energy and stunt." Same structure, different content. CER works wherever you make and defend claims.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
