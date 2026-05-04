/**
 * Grades 3-5 ELA — Inference & Text Evidence.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_INFERENCE_EVIDENCE: LessonPlan = {
  id: 'evelyn.g35.ela.inference-evidence.v1',
  title: 'Grades 3-5 ELA — Inference & Text Evidence',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.inference-evidence',
      description: 'Make inferences from text by combining details with prior knowledge; cite evidence to support inferences.',
      standard: 'CCSS.ELA-LITERACY.RL.4.1',
    },
  ],
  prerequisites: ['g35.ela.theme'],
  followUps: ['g35.ela.authors-purpose'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Authors don\'t spell out everything — good readers READ BETWEEN THE LINES.',
      script: 'When a story says "Sara stomped into her room and slammed the door," the author doesn\'t need to write "Sara was angry." You inferred it. Today we practise the formula: text clues + what I already know = inference. Then we back it up with evidence.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-inference',
      kind: 'concept',
      goal: 'What inference is + how to support with evidence + the formula.',
      keyIdeas: [
        'INFERENCE: a smart guess based on details in the text + your own knowledge. Goes beyond what is directly stated.',
        'FORMULA: TEXT CLUE + WHAT I KNOW = INFERENCE.',
        'TEXT EVIDENCE: specific words, sentences, or actions in the text that support your inference.',
        'STRONG INFERENCES are tied to multiple pieces of evidence and don\'t contradict the text.',
        'WEAK INFERENCES jump to conclusions or ignore parts of the text.',
        'CITE EVIDENCE: when explaining an inference, include phrases like "the text says…" or "in paragraph 3, the author writes…"',
        'NOT EVERY INFERENCE IS RIGHT. If a teacher disagrees, look back: did you use the right text clues? Did you over-interpret?',
        'INFERENCES vs PREDICTIONS: predictions are about the FUTURE (what will happen next?). Inferences can be about now or past — what character feels, why event happened.',
      ],
      vocabulary: [
        { term: 'inference', definition: 'a conclusion drawn from text clues plus background knowledge.' },
        { term: 'text evidence', definition: 'specific words or details in the text that support an idea or inference.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-inference',
      kind: 'worked_example',
      problem: 'Read: "Mark hugged his backpack tightly to his chest as he walked into the new school. He kept his eyes on the floor." Infer: How is Mark feeling, and what evidence supports your inference?',
      steps: [
        'Text clues: hugging backpack tightly, eyes on the floor, going into a NEW school.',
        'What I know: people hold things tightly when they feel insecure. Looking at the floor often means avoiding eye contact, which suggests shyness or anxiety.',
        'INFERENCE: Mark is nervous or anxious about being at a new school.',
        'Evidence: 1) "hugged his backpack tightly to his chest" (signals self-protective behaviour). 2) "kept his eyes on the floor" (avoiding social contact). 3) "new school" (unfamiliar setting, common source of anxiety).',
      ],
      answer: 'Mark is nervous/anxious. Evidence: tight hug + downcast eyes + new setting.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Read: "Anna woke up to a dark sky and the sound of branches snapping. The rain hadn\'t started yet, but the wind was screaming through her window." What can you infer about the weather?',
      expectedAnswer: 'A big storm is approaching (or has arrived). Evidence: dark sky, branches snapping, screaming wind.',
      responseFormat: 'free',
      hints: [
        'List the text clues about weather.',
        'What kind of weather creates dark sky, broken branches, strong wind?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-no-evidence',
      kind: 'misconception_check',
      question: 'A student infers "Mark is scared of the principal" from "Mark walked into the new school." Why is this a weak inference?',
      commonErrors: [
        {
          answer: 'Mark is scared of the principal',
          misconception: 'Adding details (the principal) that aren\'t in the text and over-specifying the cause of feelings.',
          correctsTo: 'The text never mentions the principal. Inferences must rest on TEXT EVIDENCE plus general knowledge — not invented characters or specific causes the author didn\'t hint at. A stronger inference: "Mark is nervous about being in a new place." That\'s supported by the text. The principal is a leap.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Inference = text clue + prior knowledge.',
        'Always cite specific text evidence to support inferences.',
        'Strong inferences fit multiple clues without contradicting the text.',
        'Don\'t add details the author didn\'t suggest.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Read: "When Maria saw the package on her doorstep, she gasped, ran to get scissors, and was tearing it open before she even reached the kitchen." What can you infer about Maria?',
      hint: 'Inference: Maria was excited and had been waiting for the package. Evidence: "gasped" (surprise/joy), "ran" (urgency), "tearing it open before reaching the kitchen" (eagerness — couldn\'t wait). A package she\'d been anticipating for some time would explain the haste.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
