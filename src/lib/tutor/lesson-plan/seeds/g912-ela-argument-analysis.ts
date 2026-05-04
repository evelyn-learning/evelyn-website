/**
 * Grades 9-12 ELA — Argument Analysis (Claim Mapping).
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_ARGUMENT_ANALYSIS: LessonPlan = {
  id: 'evelyn.g912.ela.argument-analysis.v1',
  title: 'Grades 9-12 ELA — Argument Analysis',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.argument-analysis',
      description: 'Map and analyse arguments by identifying claims, premises, evidence, and assumptions; evaluate logical strength.',
      standard: 'CCSS.ELA-LITERACY.RI.11-12.8',
    },
  ],
  prerequisites: ['g912.ela.rhetoric-epl'],
  followUps: ['g912.ela.research-paper'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Strong critical reading isn\'t about agreeing or disagreeing — it\'s about MAPPING the argument first.',
      script: 'When you read an opinion piece, your first instinct may be to react. But the analytical move is to FIRST diagram: what is the claim, what are the supporting premises, what evidence backs them, and what does the author assume? Once mapped, you can evaluate. Today we drill the mapping.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-argument-map',
      kind: 'concept',
      goal: 'Components of an argument + how to map + how to evaluate.',
      keyIdeas: [
        'CLAIM: the main position the author is defending. Often the thesis. Should be debatable.',
        'PREMISES: supporting reasons that lead to the claim. Each premise is itself a claim that may need support.',
        'EVIDENCE: facts, data, quotes, examples that back premises.',
        'ASSUMPTIONS (warrants): unstated beliefs that connect evidence to claims. The author often DOESN\'T spell these out — but they\'re there.',
        'COUNTERARGUMENT: opposing view. Strong arguments address them.',
        'MAPPING DIAGRAM: claim at top → premises beneath → evidence/examples beneath each premise → assumptions made explicit.',
        'EVALUATE LOGICAL STRENGTH: 1) Are premises supported? 2) Are assumptions defensible? 3) Does the conclusion FOLLOW from the premises? 4) Is the evidence credible?',
        'COMMON WEAKNESSES: missing evidence, unstated assumptions, hasty generalisations, false analogies, slippery slope.',
        'EVEN STRONG ARGUMENTS have unstated assumptions. The question is whether they\'re reasonable.',
        'YOUR RESPONSE: only after mapping should you AGREE or DISAGREE. Map first, react second.',
      ],
      vocabulary: [
        { term: 'premise', definition: 'a statement that supports the main claim of an argument.' },
        { term: 'assumption', definition: 'an unstated belief that connects premises to conclusion.' },
        { term: 'warrant', definition: 'the underlying assumption that makes a piece of evidence relevant to a claim.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-map',
      kind: 'worked_example',
      problem: 'Map this argument: "Schools should adopt year-round calendars. Studies show summer learning loss costs students 1-3 months of progress. Year-round schedules with shorter, more frequent breaks reduce this loss."',
      steps: [
        'CLAIM: "Schools should adopt year-round calendars."',
        'PREMISE 1: "Year-round schedules reduce learning loss."',
        'EVIDENCE for Premise 1: "Studies show summer learning loss costs 1-3 months of progress" + the implicit comparison.',
        'UNSTATED ASSUMPTION: 1) Reducing learning loss is a desirable goal. 2) The year-round calendar achieves the reduction without other costs. 3) Studies cited are reliable.',
        'EVALUATION: Premise depends on the studies being valid. Counterargument might note costs to families, teachers, or summer activities. The argument is NOT addressed. Strength is moderate — claim is supported but not fully defended.',
      ],
      answer: 'Mapped: claim, premise, evidence, assumptions, evaluation.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the unstated assumption in: "We should ban junk food in schools because childhood obesity is rising."',
      expectedAnswer: 'Unstated assumptions include: (1) banning junk food in schools will significantly reduce obesity, (2) school is a major source of junk food consumption, (3) schools should take responsibility for student nutrition. Without these, the conclusion doesn\'t follow.',
      responseFormat: 'free',
      hints: [
        'What does the author take for granted between the EVIDENCE (rising obesity) and the CLAIM (ban)?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-react-first',
      kind: 'misconception_check',
      question: 'A student reads an argument they disagree with and writes a rebuttal without first mapping the argument. Why is this risky?',
      commonErrors: [
        {
          answer: 'Rebut without mapping',
          misconception: 'Reacting to gut response rather than the argument\'s actual structure.',
          correctsTo: 'Without mapping, you may rebut a strawman (a weakened version) instead of the strongest form of the argument. Or you may attack premises that aren\'t actually load-bearing. Mapping first ensures you engage with what the argument really claims. Strong rebuttals identify the weakest premise OR a flawed assumption — but you can\'t do that without first knowing the structure.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Map: claim → premises → evidence → assumptions.',
        'Always look for unstated assumptions.',
        'Evaluate: are premises supported? Do assumptions hold? Is logic valid?',
        'Map BEFORE reacting.',
        'Strong rebuttals attack the weakest defensible point, not strawmen.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are arguments with HIDDEN assumptions especially dangerous in public debate?',
      hint: 'Hidden assumptions slip past readers because they\'re never stated. If everyone shares the assumption, no problem. But if the assumption is contested, it shapes the argument WITHOUT being defended. Surfacing assumptions forces them to be argued explicitly. Critical readers in journalism, law, and policy must constantly ask "what is being assumed here?"',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
