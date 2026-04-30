/**
 * G6 — ELA: Argument writing (claim, evidence, counterclaim).
 *
 * The next step beyond G3 opinion writing — formal argument with a
 * thesis, supporting reasons backed by EVIDENCE (not just personal
 * preference), and acknowledging an opposing view (counterclaim)
 * before refuting it. The "addressing the other side" move is what
 * separates argument from opinion.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_ELA_ARGUMENT_WRITING: LessonPlan = {
  id: 'evelyn.g6.ela.argument-writing.v1',
  title: 'Argument Writing: Claim, Evidence, Counterclaim',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'ela',
  topic: 'writing',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.w.6.1',
      description: 'Write arguments to support claims with clear reasons and relevant evidence.',
      standard: 'CCSS.ELA-LITERACY.W.6.1',
    },
  ],
  prerequisites: ['ccss.ela.w.5.1'],
  followUps: ['ccss.ela.w.7.1'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Distinguish argument from opinion — the new ingredient is evidence.',
      script: 'Opinion: "Pizza is the best food because I love it." Argument: "Pizza is the best food because it\'s nutritionally balanced — protein from cheese, carbs from crust, vitamins from toppings — and a 2018 survey found it\'s the most-popular dinner pick across age groups." Same starting claim, but one is just personal preference and the other is built to convince a stranger.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-argument-structure',
      kind: 'concept',
      goal: 'Claim + evidence + reasoning + counterclaim + refutation + conclusion.',
      keyIdeas: [
        'A formal ARGUMENT has more parts than an opinion piece:',
        '  1) CLAIM (thesis): your main argument, in one clear sentence. Goes in the introduction.',
        '  2) REASONS: 2-3 supporting points, each its own paragraph.',
        '  3) EVIDENCE: facts, statistics, expert quotes, or examples that back each reason.',
        '  4) REASONING: explain how the evidence proves the reason.',
        '  5) COUNTERCLAIM: the strongest opposing argument. Acknowledging it shows you\'ve thought it through.',
        '  6) REFUTATION: explain why the counterclaim is weaker than yours.',
        '  7) CONCLUSION: restate the claim, summarize the evidence, end with a call to action or a final thought.',
        'OPINION uses "I think..." personal taste. ARGUMENT uses evidence anyone can check.',
        'Good evidence is SPECIFIC, RELEVANT, and from a credible source.',
        'TRANSITION words signal each move: "first", "additionally", "however" (for counterclaim), "but more importantly" (for refutation), "in conclusion".',
      ],
      vocabulary: [
        { term: 'claim', definition: 'the main point you\'re arguing for.' },
        { term: 'evidence', definition: 'facts, examples, or data that support a claim.' },
        { term: 'counterclaim', definition: 'the opposing argument you address before refuting.' },
        { term: 'refutation', definition: 'showing why the counterclaim is weaker than your claim.' },
      ],
      suggestedTools: ['show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-uniform',
      kind: 'worked_example',
      problem: 'Build a 1-paragraph argument: claim + reason + evidence + counterclaim + refutation. Topic: "Should schools require uniforms?"',
      steps: [
        'CLAIM: "Schools should require uniforms."',
        'REASON + EVIDENCE: "Uniforms reduce decision fatigue in the morning. A 2019 study by University X found students at uniform schools reported less stress about clothing choices."',
        'COUNTERCLAIM: "Some argue uniforms suppress students\' self-expression."',
        'REFUTATION: "However, students still express themselves through hairstyles, accessories, and shoes — uniforms only standardize the most-debated layer."',
        'Together as one paragraph it reads as a balanced position, not a rant.',
      ],
      answer: 'See model paragraph above',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Claim: "Middle schoolers should have homework limits." Brainstorm one piece of evidence and one counterclaim.',
      expectedAnswer: 'Evidence (e.g., research on sleep & academic performance); counterclaim (e.g., homework reinforces learning).',
      responseFormat: 'free',
      hints: [
        'Evidence should be a fact or study, not "I think".',
        'Counterclaim is the strongest argument SOMEONE WHO DISAGREES would make.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-no-counter',
      kind: 'misconception_check',
      question: 'Owen writes a strong 3-paragraph argument FOR more recess but never mentions any opposing view. He says "I don\'t want to give them ammunition." What\'s the issue?',
      commonErrors: [
        {
          answer: 'nothing — strongest argument is one-sided',
          misconception: 'Treating counterclaim as a weakness instead of a strength.',
          correctsTo: 'Skipping the counterclaim makes your argument WEAKER, not stronger. A reader who sees you ignore the obvious counter will assume you couldn\'t handle it. Acknowledging and refuting the strongest opposing view shows confidence and credibility.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Argument structure: claim → reasons + evidence + reasoning → counterclaim + refutation → conclusion.',
        'Argument differs from opinion by using EVIDENCE — facts, data, expert sources.',
        'Counterclaim isn\'t a weakness; addressing it makes your case stronger.',
        'Reasoning links evidence to the claim — don\'t skip it.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Take a topic you have a strong opinion on. Write the BEST counterclaim someone could make. Now refute it.',
      hint: 'If you can refute the strongest counterclaim, your argument is solid. If not, your claim might need to soften.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
