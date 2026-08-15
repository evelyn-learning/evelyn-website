/**
 * Grades 9-12 ELA — Logical Fallacies.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_LOGICAL_FALLACIES: LessonPlan = {
  id: 'evelyn.g912.ela.logical-fallacies.v1',
  title: 'Grades 9-12 ELA — Logical Fallacies',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.logical-fallacies',
      description: 'Identify common logical fallacies in arguments; explain why each is fallacious.',
      standard: 'CCSS.ELA-LITERACY.RI.11-12.5',
    },
  ],
  prerequisites: ['g912.ela.annotated-bib'],
  followUps: ['g912.ela.critical-reading'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Logical fallacies are how persuasion goes wrong — once you can name them, you can\'t be fooled by them.',
      script: 'A politician attacks their opponent personally instead of their argument: ad hominem. A pundit warns "if we allow X, soon we\'ll have Y, then Z, then disaster": slippery slope. Naming the fallacies makes the manipulation visible. Today we drill the most common ones.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-fallacies',
      kind: 'concept',
      goal: 'Top 8 fallacies + recognition + why each is invalid.',
      keyIdeas: [
        'AD HOMINEM: attacking the PERSON instead of the ARGUMENT. "We shouldn\'t listen to her on climate; she drives a gas car."',
        'STRAW MAN: misrepresenting an opponent\'s argument to make it easier to attack. "Critics of immigration want to ban all newcomers" (when they may want only structural reform).',
        'FALSE DICHOTOMY (either-or): presenting only two options when more exist. "You\'re either with us or against us."',
        'SLIPPERY SLOPE: claiming one event will lead inevitably to a chain of bad outcomes without evidence. "If we allow this, soon we\'ll lose all freedoms."',
        'APPEAL TO AUTHORITY (when not relevant): "Einstein supported X" (Einstein was a physicist, not a relevant authority on X).',
        'BANDWAGON: "Everyone\'s doing X, so X must be right."',
        'CIRCULAR REASONING: using the conclusion as a premise. "X is true because X says so."',
        'HASTY GENERALISATION: drawing a broad conclusion from too few examples. "I met two rude New Yorkers — New Yorkers must be rude."',
        'POST HOC ERGO PROPTER HOC: assuming because B followed A, A caused B. "I drank coffee then aced the test — coffee makes me smart."',
        'NAMING a fallacy doesn\'t REFUTE the conclusion — only the LOGIC of how the conclusion was reached. The conclusion might still be true on other grounds.',
      ],
      vocabulary: [
        { term: 'ad hominem', definition: 'attacking the person rather than addressing their argument.' },
        { term: 'straw man', definition: 'misrepresenting an opponent\'s argument to make it easier to defeat.' },
        { term: 'false dichotomy', definition: 'presenting only two options when more exist.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-fallacy',
      kind: 'worked_example',
      problem: 'Identify the fallacy: "We can\'t trust her recommendation on the budget — she failed her economics class in college."',
      steps: [
        'Argument structure: "Don\'t trust X because of Y about X\'s past."',
        'Y is about HER (her past failure), not the BUDGET.',
        'Fallacy: AD HOMINEM. The argument attacks the person, not the recommendation\'s merits.',
        'Why fallacious: even someone who failed economics could make a sound budget recommendation. Evaluating her PROPOSAL requires looking at the proposal, not her grade history.',
      ],
      answer: 'Ad hominem.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the fallacy: "If we allow students to retake one test, soon they\'ll demand to retake all of them, and grades will mean nothing."',
      expectedAnswer: 'Slippery slope — assumes a chain reaction without evidence.',
      responseFormat: 'free',
      hints: [
        'Is the speaker showing the chain step by step, or assuming it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fallacy-disproof',
      kind: 'misconception_check',
      question: 'A student says "you committed a fallacy, therefore your conclusion is wrong." Why might this itself be a logical error?',
      commonErrors: [
        {
          answer: 'Fallacy = wrong conclusion',
          misconception: 'Treating identified fallacy as a refutation of the conclusion.',
          correctsTo: 'Identifying a fallacy refutes the LOGIC, not the conclusion. A fallacy means the ARGUMENT for the conclusion is invalid — but the conclusion might still be true on other grounds. Calling out a fallacy without offering counterargument is itself a fallacy ("fallacy fallacy"). Best move: 1) name the fallacy, 2) ask for valid argument, 3) judge conclusion separately.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Common fallacies: ad hominem, straw man, false dichotomy, slippery slope, appeal to authority, bandwagon, circular reasoning, hasty generalisation, post hoc.',
        'Naming fallacies makes manipulation visible.',
        'A fallacy refutes the LOGIC, not the conclusion.',
        'Critical readers spot fallacies in their OWN arguments too.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might a "true" claim still be communicated through a fallacious argument?',
      hint: 'Speakers may have right INSTINCTS without articulating valid reasoning. Example: "Trust me, vaccines work" might be true (vaccines do work) but argued through APPEAL TO AUTHORITY rather than evidence. The conclusion is correct; the argument is poorly constructed. Critical reading distinguishes "this is wrong" from "this is true but the speaker hasn\'t made a valid case for it." Both deserve scrutiny.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
