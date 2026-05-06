/**
 * GRE Verbal — Text Completion strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_VERBAL_TEXT_COMPLETION: LessonPlan = {
  id: 'evelyn.testprep.gre.verbal.text-completion.v1',
  title: 'GRE Verbal — Text Completion Strategy',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'gre-verbal',
  locale: 'en',
  los: [
    {
      id: 'testprep.gre.verbal.text-completion',
      description: 'Drill GRE Text Completion: predict the blank from context, identify "trigger" words, evaluate answer choices systematically.',
      standard: 'GRE-VERBAL',
    },
  ],
  prerequisites: [],
  followUps: ['testprep.gre.verbal.sentence-equiv'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Text Completion is about reading carefully — vocab matters but predicting the blank matters more.',
      script: 'A 2-3 sentence passage with 1-3 blanks. Each blank has 3 (or 5 for single blanks) answer choices. The trap is picking a vocab word that "sounds right" — but the right answer must FIT THE LOGIC of the passage. Always predict before reading the choices.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-text-completion',
      kind: 'concept',
      goal: 'Procedure, trigger words, prediction, common traps.',
      keyIdeas: [
        'PROCEDURE:',
        '  1. Read the WHOLE sentence/paragraph first. Don\'t look at choices yet.',
        '  2. Identify TRIGGER WORDS — clues about meaning or relationship: same-direction (and, also, similarly, indeed) or opposite-direction (but, however, although, despite).',
        '  3. PREDICT what word should fill the blank. Use plain-English words first; you don\'t need GRE vocab to predict.',
        '  4. Match your prediction to the answer choices.',
        '  5. Read the sentence with your chosen word in place. Does it make sense?',
        'TRIGGER WORDS by relationship:',
        '  CONTRAST: but, however, although, despite, yet, on the other hand. Blank goes OPPOSITE the surrounding context.',
        '  CONTINUATION: and, also, moreover, indeed, furthermore. Blank matches surrounding context.',
        '  CAUSE/EFFECT: because, therefore, thus, as a result. Blank fits the cause-effect logic.',
        '  EXAMPLE: such as, for instance. Blank is something specific that illustrates a general claim.',
        'MULTIPLE BLANKS: predict each independently if possible; some blanks depend on others.',
        'TRAPS:',
        '  Vocab matching without LOGIC matching — a fancy word that doesn\'t fit the relationship.',
        '  Choosing a word that\'s emotionally similar but factually wrong.',
        '  Skipping the trigger word — the entire prediction depends on it.',
        'IF unsure between two options: plug in each. The one that makes the sentence read smoothly + matches the trigger logic wins.',
      ],
      vocabulary: [
        { term: 'trigger word', definition: 'a connective word (but, although, therefore) that signals the logical relationship between parts of a sentence; it dictates what kind of word the blank requires.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Despite the team\'s impressive _____ talent, their lack of cohesion led to defeat. Choices: (A) ample (B) negligible (C) prodigious (D) miniscule (E) modest.',
      steps: [
        'Trigger word: "Despite" — signals CONTRAST. The talent and the defeat go in opposite directions.',
        'Defeat is bad. Talent must be GOOD to make "despite" meaningful.',
        'Predict: a word meaning "lots of" or "great."',
        'Match against choices: (A) ample = sufficient. (B) negligible = small (wrong direction). (C) prodigious = enormous, extraordinary. (D) miniscule = tiny (wrong). (E) modest = small (wrong).',
        '(C) prodigious fits best — emphasises extraordinary talent, sharpening the contrast with defeat.',
      ],
      answer: '(C) prodigious',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Given his reputation for _____, the executive\'s sudden decision to share credit publicly came as a surprise. Choices: (A) generosity (B) mendacity (C) parsimony (D) prudence (E) loquacity.',
      expectedAnswer: '(C) parsimony. The contrast: sudden sharing of credit (generous behaviour) is SURPRISING given his reputation. So his reputation must be the OPPOSITE — stinginess. Parsimony = stinginess. (A) generosity is opposite (no surprise). (B) mendacity = lying — not directly opposed to credit-sharing. (D) prudence = caution — not the right axis. (E) loquacity = talkativeness — irrelevant.',
      responseFormat: 'free',
      hints: [
        'The "came as a surprise" implies his behaviour CONTRADICTS his reputation.',
        'What would be the opposite of sharing credit?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-vocab-only',
      kind: 'misconception_check',
      question: 'A student picks the most "GRE-sounding" word, regardless of fit. Why does this hurt their score?',
      commonErrors: [
        {
          answer: 'Pick advanced vocab',
          misconception: 'Treating Text Completion as a vocab quiz.',
          correctsTo: 'GRE Text Completion is a LOGIC test as much as a vocab test. The right answer must fit the SENTENCE LOGIC determined by trigger words, not just sound impressive. A word like "abstemious" is great vocab, but if the sentence calls for "generous," abstemious is wrong. Always: read sentence, identify triggers, predict in plain English, then match.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Predict in plain English BEFORE looking at choices.',
        'Trigger words (but, despite, therefore) dictate direction.',
        'Vocab matters less than logic fit.',
        'Plug in the chosen word and re-read for fit.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
