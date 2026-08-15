/**
 * LSAT — Logical Reasoning (post-2024 format makes LR ~50% of scored sections).
 *
 * Question types catalog + per-type strategy. With Logic Games gone,
 * LR is the dominant skill on the modern LSAT.
 */

import type { LessonPlan } from '../types';

export const SEED_LSAT_LOGICAL_REASONING: LessonPlan = {
  id: 'evelyn.testprep.lsat.logical-reasoning.v1',
  title: 'LSAT Logical Reasoning: Question Types and Strategy',
  curriculum: 'LSAC',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'lsat',
  locale: 'en',
  los: [
    {
      id: 'lsat.logical-reasoning',
      description: 'Identify the major LSAT Logical Reasoning question types, recognize them from question stems, and apply per-type strategy to short argument passages.',
      standard: 'LSAT-LR',
    },
  ],
  prerequisites: ['lsat.format-2024'],
  followUps: ['lsat.reading-comprehension'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'LR is the heart of the modern LSAT.',
      script: 'Every Logical Reasoning question gives you a 60-100 word argument and asks ONE question about it. There are ~15 named question types, but they cluster into a handful of families. The key skill is RECOGNIZING the family from the question stem. Once you know "this is a strengthen question" or "this is a method of reasoning question", the strategy is mechanical. Get good at type recognition and your accuracy jumps fast.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-types',
      kind: 'concept',
      goal: 'The major LR question type families.',
      keyIdeas: [
        'STRENGTHEN: which choice, if true, would most support / strengthen the argument? Look for choices that fill a gap between evidence and conclusion or rule out an alternative explanation.',
        'WEAKEN: which choice, if true, would most undermine / call into question the argument? Look for alternative explanations, missing evidence, contradictions to the conclusion.',
        'NECESSARY ASSUMPTION: which choice MUST be true for the argument to work? Test by NEGATING the choice — if negation kills the argument, that\'s the necessary assumption.',
        'SUFFICIENT ASSUMPTION: which choice, if true, would prove the conclusion? Often involves a logical bridge that connects the evidence to the conclusion.',
        'FLAW: what is wrong with the reasoning? Common flaws: confusing correlation with causation, mistaking necessary for sufficient, ad hominem, circular reasoning, hasty generalization, equivocation, relying on unrepresentative samples.',
        'PARALLEL REASONING: which choice has the same LOGICAL STRUCTURE (not topic) as the argument? Map the argument to abstract form (if A then B; A; therefore B) and find the choice with that structure.',
        'PARALLEL FLAW: same as parallel but BOTH must contain the same flaw type.',
        'INFERENCE / MUST BE TRUE: which choice MUST be true based on the passage? Stay close to what\'s stated; don\'t bring in outside reasoning.',
        'PRINCIPLE: questions ask you to APPLY a stated principle (find the choice that fits) or IDENTIFY the principle implicit in the argument.',
        'PARADOX / DISCREPANCY: which choice resolves an apparent contradiction or surprising fact in the passage? Look for a choice that explains why both seemingly contradictory things can be true.',
        'METHOD OF REASONING / ROLE: how does the argument proceed? OR — what role does the bold/underlined sentence play? Common roles: premise, conclusion, intermediate conclusion, opposing position, supporting example.',
        'EVALUATE / USEFUL TO KNOW: which question, if answered, would help evaluate the argument? Look for the question whose answer would either strengthen or weaken — both directions matter.',
        'POINT AT ISSUE / DISAGREEMENT: in a 2-speaker argument, which choice identifies what they disagree about? Both must take a position on it.',
      ],
      vocabulary: [
        { term: 'necessary assumption', definition: 'a premise that MUST hold for the conclusion to follow; test by negation.' },
        { term: 'sufficient assumption', definition: 'a premise that, if added, would PROVE the conclusion.' },
        { term: 'parallel reasoning', definition: 'matching the abstract logical structure of an argument across different topics.' },
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'worked-strengthen',
      kind: 'worked_example',
      problem: 'Argument: "Cities that planted more trees saw lower summer temperatures over the next decade. Therefore, planting trees in our city will lower our summer temperatures." Question: Which most strengthens the argument?',
      steps: [
        'IDENTIFY ARGUMENT: Evidence is correlational (more trees → lower temps in OTHER cities). Conclusion is causal AND projective (planting trees in OUR city will cause cooling).',
        'IDENTIFY GAPS: (a) correlation might be from a third factor (those cities also reduced traffic, used reflective roofs, etc.). (b) our city may differ (climate, geography, density).',
        'STRENGTHENERS would: (a) rule out alternative explanations — "the cities that added trees made no other major changes during that decade", or (b) confirm our city is similar — "our city has comparable climate and density to those studied".',
        'NOT a strengthener: "tree-planting is endorsed by the mayor" (irrelevant to whether it works), "trees provide other benefits" (irrelevant to temperature claim).',
        'BEST CHOICE TYPE: ruling out an alternative explanation is usually the strongest strengthener for correlation-to-causation arguments.',
      ],
      answer: 'A choice that either rules out alternative explanations or confirms similarity between the studied cities and our city.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A question stem reads: "The argument is most vulnerable to criticism on the grounds that it..." Which question type is this?',
      expectedAnswer: 'FLAW question. The stem signals you need to identify what is logically wrong with the reasoning. Common stems for flaw: "vulnerable to criticism", "most weakened by", "the argument fails to consider", "questionable because".',
      responseFormat: 'free',
      hints: [
        '"Vulnerable to criticism" = something is WRONG with the reasoning.',
        'Match to the families list.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-strong-real-world',
      kind: 'misconception_check',
      question: 'On a Strengthen question, the right answer is the choice that\'s most plausibly true in the real world.',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Importing real-world plausibility instead of in-passage logic.',
          correctsTo: 'False. The right Strengthen choice is the one that, IF TRUE, would most support the conclusion — regardless of whether it sounds plausible in real life. Many right answers are extreme or surprising claims; many wrong answers are reasonable-sounding but irrelevant. The question stem typically says "if true" or "assuming the following"; that\'s your signal to ASSUME the choice and check its effect on the argument, not to evaluate the choice\'s real-world likelihood.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '~15 LR question types, clustered into families: support/attack (strengthen, weaken), assumption (necessary, sufficient, flaw), inference (must-be-true, principle), structure (parallel, method, role), other (paradox, evaluate, point-at-issue).',
        'Recognize the type from the stem first — strategy follows from type.',
        'Negate to test necessary assumption. Map structure to test parallel.',
        'Answer choices are evaluated "if true" — don\'t reject for real-world implausibility.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does LSAC favor questions about correlation-to-causation reasoning across many LR question types?',
      hint: 'Legal arguments often hinge on whether observed evidence (a pattern of behavior, a sequence of events) PROVES or merely SUGGESTS a causal claim. Distinguishing correlation from causation is one of the most important and most-failed reasoning skills. By weighting LR toward this skill, LSAC selects for students who can do legal analysis well. Memorize the four canonical alternative explanations: third variable, reverse causation, coincidence, and selection bias.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
