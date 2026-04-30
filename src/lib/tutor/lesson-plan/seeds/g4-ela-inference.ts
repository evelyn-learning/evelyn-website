/**
 * G4 — ELA: Making inferences (text + your knowledge = conclusion).
 *
 * The reading skill where the answer isn't directly written down.
 * "Reading between the lines." The student combines what the text
 * says with what they already know to draw a logical conclusion.
 * Differentiates inference from explicit ("right there") answers
 * and from wild guesses (no textual support).
 */

import type { LessonPlan } from '../types';

export const SEED_G4_ELA_INFERENCE: LessonPlan = {
  id: 'evelyn.g4.ela.inference.v1',
  title: 'Making Inferences',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'ela',
  topic: 'reading-comprehension',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.rl.4.1',
      description: 'Refer to details and examples in a text when explaining what the text says explicitly and when drawing inferences from the text.',
      standard: 'CCSS.ELA-LITERACY.RL.4.1',
    },
  ],
  prerequisites: ['ccss.ela.rl.3.1'],
  followUps: ['ccss.ela.rl.5.1'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame inference as detective work, with text as the evidence.',
      script: '"Maya wiped the rain off her glasses, kicked off her muddy boots, and grabbed a towel." Did the writer SAY Maya was outside in the rain? No. But you KNOW she was. That figuring-out is called making an inference — using the text plus what you already know to fill in what isn\'t directly stated.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-text-plus-knowledge',
      kind: 'concept',
      goal: 'Inference formula + how to support an inference + difference from a wild guess.',
      keyIdeas: [
        'INFERENCE = a conclusion you draw from clues in the text plus what you already know.',
        'Formula: TEXT EVIDENCE + YOUR KNOWLEDGE = INFERENCE.',
        'Authors don\'t spell out everything — they leave clues. Good readers fill the gaps.',
        'EXPLICIT vs INFERRED:',
        '  Explicit ("right there"): the answer is directly stated. ("It was raining.") No inference needed.',
        '  Inferred: you have to figure it out. ("Wet glasses + muddy boots" → was outside in rain.)',
        'A good inference must be SUPPORTED by the text. If you can\'t point to evidence, it\'s a guess, not an inference.',
        'Strategy: when you make a conclusion, ask "what in the text told me this?". If you can answer, it\'s inference.',
        'Inferences aren\'t always about events. You can infer how a character FEELS ("she slammed the door" → angry), where the SETTING is, what time it is, etc.',
      ],
      vocabulary: [
        { term: 'inference', definition: 'a conclusion drawn from clues in the text plus your own knowledge.' },
        { term: 'explicit', definition: 'directly stated in the text.' },
        { term: 'evidence', definition: 'the specific words or details that support a conclusion.' },
      ],
      suggestedTools: ['show_text', 'show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-character-feeling',
      kind: 'worked_example',
      problem: 'Read: "Sam stared at the ground and didn\'t answer when his teacher called on him. He knew the answer, but his hands were shaking and his face felt hot." Make an inference about how Sam feels.',
      steps: [
        'Look at the clues: stares at ground, doesn\'t answer, hands shake, face feels hot.',
        'What do I already know? People often act like this when they\'re nervous or embarrassed about being put on the spot.',
        'Inference: Sam is feeling nervous (or shy / embarrassed) about answering in front of the class.',
        'Evidence I can point to: "stared at the ground", "hands shaking", "face felt hot."',
      ],
      answer: 'Sam is nervous / shy / embarrassed',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Read: "Lia opened her birthday present and her face lit up. She hugged her grandma so tightly that grandma laughed." What can you infer about how Lia feels about the present?',
      expectedAnswer: 'She loves it / is very happy',
      responseFormat: 'free',
      hints: [
        'Look at the clues: face lit up, tight hug.',
        'What do you know about how people act when they like something?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-no-evidence',
      kind: 'misconception_check',
      question: 'About the Sam paragraph, Owen says "Sam doesn\'t know the answer." Is that a good inference?',
      commonErrors: [
        {
          answer: 'yes — he didn\'t answer',
          misconception: 'Drawing a conclusion that contradicts text evidence.',
          correctsTo: 'No. The text actually says "He knew the answer." Owen ignored that and inferred from "didn\'t answer" alone. A real inference must FIT all the evidence — including the line that says Sam knew. The right inference is that he was too nervous to answer, NOT that he didn\'t know.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Inference = text evidence + your knowledge → conclusion.',
        'A good inference is SUPPORTED by the text — you can point to clues.',
        'A guess that contradicts the text isn\'t an inference.',
        'You can infer feelings, settings, time, motives — not just events.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: '"The streetlights had just blinked on. The shopkeepers were locking their doors and waving goodbye." What time of day is this?',
      hint: 'Streetlights ON, shops CLOSING. Inference: early evening / dusk.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
