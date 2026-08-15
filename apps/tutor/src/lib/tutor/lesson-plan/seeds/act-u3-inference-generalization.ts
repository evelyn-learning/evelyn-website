/**
 * ACT — Reading / Inference & Generalization: "it can reasonably be
 * inferred" questions.
 *
 * These questions never ask what the passage SAYS — they ask what the
 * passage's own details FORCE you to conclude, one logical step out.
 * At ~52 seconds per question, the danger isn't running out of time to
 * reason it through; it's picking the answer that merely SOUNDS
 * plausible over the one the text actually supports. All stimuli are
 * original short excerpts.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U3_INFERENCE_GENERALIZATION: LessonPlan = {
  id: 'evelyn.testprep.act.inference-generalization.v1',
  title: 'Inference & Generalization',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.inference-generalization',
      standard: 'ACT-3.3',
      description:
        'Distinguish ACT Reading answer choices that are reasonably supported by the passage\'s own details from choices that merely sound plausible but overreach, contradict the text, or rely on outside knowledge.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 19,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe inference questions as a text-support game, not a reading-comprehension guessing game — with realistic pacing stakes.',
      script:
        'On every ACT Reading passage, several of your questions will start with some version of "it can reasonably be inferred that..." or "the passage most strongly suggests...". You have about 52 seconds per question, and these are exactly the ones where rushed test-takers pick wrong — not because the reasoning is hard, but because the wrong answers are built to SOUND right. Today\'s whole game: telling supported-by-the-text apart from merely plausible.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-inference-generalization',
      kind: 'concept',
      goal: 'Define inference vs. generalization, name the signal phrases, and drill the recurring wrong-answer traps.',
      keyIdeas: [
        'AN INFERENCE is exactly ONE logical step from what the passage directly states — not zero steps (that\'s a detail question, answered by a quote) and not several steps (that\'s outside knowledge).',
        'A GENERALIZATION broadens several specific details in the passage into one overall claim — it needs support from MORE THAN ONE example, not a single moment.',
        'SIGNAL PHRASES to recognize instantly: "it can reasonably be inferred," "the passage suggests," "the author implies," "would most likely agree," "most strongly suggests."',
        'THE TEST: if you cannot point to the specific words in the passage that force an answer, it is not a valid inference — it is a guess, no matter how reasonable it sounds.',
        'TRAP 1 — TOO FAR: the choice takes a real detail and stretches it past what the passage supports (a private habit becomes a sweeping belief about "all X").',
        'TRAP 2 — OPPOSITE: the choice reverses the direction the evidence actually points.',
        'TRAP 3 — EXTREME LANGUAGE: "always," "never," "only," "completely" — the passage supports a tendency, not an absolute.',
        'TRAP 4 — OUTSIDE KNOWLEDGE: the choice is true in real life (or sounds like common sense) but the passage itself never establishes it — irrelevant, no matter how true.',
      ],
      vocabulary: [
        { term: 'inference', definition: 'a conclusion reasonably supported by the passage\'s details but not directly stated in the text.' },
        { term: 'generalization', definition: 'a broad claim built by combining several specific details or examples from across the passage.' },
        { term: 'textual support', definition: 'the specific words or details in the passage that justify picking one answer choice over another.' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-typical-inference',
      kind: 'worked_example',
      problem:
        'Passage excerpt: "Mara arrived at the concert hall three hours before the performance, though she had played this concerto more than forty times. She ran through the opening passage twice, adjusted the shoulder rest on her violin though it had not moved, and asked the stage manager three times whether the piano would be tuned before six. When a stagehand offered to fetch her a chair, she waved him off and kept practicing, her bow arm rising and falling in the same four measures, over and over, until the house doors opened." Question: It can reasonably be inferred from the passage that Mara is:',
      steps: [
        'Spot the signal phrase: "it can reasonably be inferred" — the answer must be supported by details, not quoted word-for-word.',
        'List what IS stated: arrived three hours early, repeated a passage she\'s played 40+ times, adjusted an already-correct shoulder rest, asked the same question three times, refused a chair to keep practicing.',
        'None of these individually says "Mara is anxious" — but every one of them is unnecessary repetition or over-checking of something already fine. That pattern points to one underlying state.',
        'Check candidate answers: an answer claiming she is "unusually anxious about the performance despite her extensive experience" is supported by every detail listed. An answer claiming she "doubts her own talent" goes further than the text supports — nothing suggests she doubts her ability, only that she is nervous.',
      ],
      answer: 'Mara feels unusually anxious about the performance despite her extensive experience.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trap-catching',
      kind: 'worked_example',
      problem:
        'Passage excerpt: "In 1854, cartographer Edmund Voss published a map of the delta that took eleven years to survey, redrawing the coastline nearly every season as sandbars shifted overnight. Voss refused three offers to publish an earlier version, telling his editor that a map \'wrong in a single channel could sink a boat.\' By the time the final edition appeared, two of the waterways it depicted no longer existed." Question: The passage most strongly suggests that Voss valued:',
      steps: [
        'Signal phrase: "most strongly suggests" — same rules as "reasonably be inferred."',
        'List what is stated: 11-year survey, redrew the coastline every season, refused three earlier publications, said an error "could sink a boat," and even the final map went out of date almost immediately.',
        'Eliminate the TOO-FAR trap: "Voss believed all published maps were dangerous" — the passage only shows his standard for HIS OWN map, never a claim about maps in general.',
        'Eliminate the EXTREME trap: "Voss achieved complete, lasting accuracy" — the last sentence undercuts this directly; two waterways were already gone by publication.',
        'What survives every detail without overreaching: Voss prioritized accuracy over speed, even knowing the terrain would keep changing on him.',
      ],
      answer: 'Voss prioritized accuracy over speed, even though the terrain kept changing.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-basic-inference',
      kind: 'try_yourself',
      problem:
        'Passage excerpt: "When the school replaced the library\'s card catalog with a computer terminal, Ms. Alvarez kept the old wooden drawers in the corner of the room. She never asked anyone to file cards in them, but each September she polished the brass handles and refused a custodian\'s offer to haul them away, saying only that the terminal was \'faster, not better.\'" Question: It can reasonably be inferred that Ms. Alvarez:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'believes the computer terminal is worse than the old system in every possible way' },
        { id: 'b', text: 'feels a persisting attachment to a system the school no longer uses', correct: true },
        { id: 'c', text: 'plans to eventually replace the computer terminal with the card catalog' },
        { id: 'd', text: 'is required by school policy to preserve the old drawers' },
      ],
      expectedAnswer: 'feels a persisting attachment to a system the school no longer uses',
      hints: [
        'She keeps polishing something no one uses anymore — what does that behavior suggest about her feelings, not her plans?',
        'Watch for choices that go further than the text supports (a future plan) or add information the passage never gives (a policy).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-trap-elimination',
      kind: 'try_yourself',
      problem:
        'Passage excerpt: "The bakery on Third Street sold out of its cardamom rolls by nine each morning, yet the owner, Teo, refused to double the recipe. \'If I make more, I\'ll start guessing at the cardamom instead of weighing it,\' he told a regular customer. He kept the same four ovens he\'d started with fifteen years earlier, even after a supplier offered him a walk-in oven at cost." Question: The passage most strongly suggests that Teo\'s decision not to expand production is driven primarily by:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'a concern that scaling up would compromise the rolls\' quality', correct: true },
        { id: 'b', text: 'a lack of money to buy new equipment' },
        { id: 'c', text: 'a belief that cardamom rolls should only be sold in the morning' },
        { id: 'd', text: 'a preference for having more free time during the day' },
      ],
      expectedAnswer: 'a concern that scaling up would compromise the rolls\' quality',
      hints: [
        'Teo explains his own reasoning directly — "I\'ll start guessing... instead of weighing." What is he protecting?',
        'One choice sounds plausible (money) but the passage shows him being offered an oven "at cost" — that undercuts a money-based explanation.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-generalization',
      kind: 'try_yourself',
      problem:
        'Passage excerpt: "During her first year running the community garden, Priya rewrote the watering schedule twice, added a locked box for donated tools after several went missing, and started a sign-up sheet when volunteers began showing up on the wrong days. When a longtime member complained that the garden felt more like a spreadsheet than a garden, Priya simply added color-coded tabs to the sign-up sheet." Question: Which generalization about Priya is best supported by the passage as a whole?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'She responds to recurring problems by creating new systems and rules', correct: true },
        { id: 'b', text: 'She values tradition over efficiency' },
        { id: 'c', text: 'She is uncomfortable delegating tasks to volunteers' },
        { id: 'd', text: 'She has never managed a garden before this year' },
      ],
      expectedAnswer: 'She responds to recurring problems by creating new systems and rules',
      hints: [
        'A generalization about the WHOLE passage needs support from more than one example — find the pattern across all three: schedule, lockbox, sign-up sheet.',
        'Watch for choices based on just one moment (the complaint) that don\'t hold up across the rest of the passage.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-outside-knowledge',
      kind: 'misconception_check',
      question:
        'A student answers an inference question using something they happen to know is true from outside reading, even though the passage never mentions it. Why is this risky on the ACT?',
      commonErrors: [
        {
          answer: 'If it\'s true in real life, it must be the correct inference.',
          misconception: 'Treating outside knowledge as valid support for an ACT Reading inference.',
          correctsTo:
            'ACT inference answers must be provable using ONLY the passage\'s own words — no matter how true a fact is outside the passage, if you can\'t point to the specific details that support it, it\'s not the answer. The passage is a closed system: everything you need is on the page.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '"It can reasonably be inferred" means ONE logical step from what\'s directly stated — never zero steps (that\'s a detail question) and never several steps (that\'s outside knowledge).',
        'If you can\'t point to specific words in the passage that support an answer, it\'s not a valid inference — it\'s a guess.',
        'Generalizations need support from more than one example in the passage, not a single detail.',
        'Eliminate choices that go too far, reverse the evidence, use extreme language ("always," "never," "only"), or import outside knowledge before picking the best-supported choice.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Inference & Generalization' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
