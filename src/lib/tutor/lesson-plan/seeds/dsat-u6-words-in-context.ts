/**
 * Digital SAT — Reading & Writing: Words in Context.
 *
 * Craft & Structure domain skill tested on every digital SAT R&W module in
 * two prompt shapes: fill-the-blank ("most logical and precise word or
 * phrase") and define-in-context ("as used in the text, most nearly
 * means"). Both are the same underlying skill — context fit, not raw
 * vocabulary size. Focus on the recurring digital-SAT traps: the common
 * dictionary meaning that doesn't fit this sentence, the near-synonym with
 * the wrong connotation, and the choice that ignores a contrast signal
 * word (although, despite, however, but).
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U6_WORDS_IN_CONTEXT: LessonPlan = {
  id: 'evelyn.testprep.dsat.words-in-context.v1',
  title: 'Words in Context',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.words-in-context',
      standard: 'DSAT-6.1',
      description:
        'Determine the most logical and precise word or phrase from context, for both fill-the-blank and "most nearly means" digital SAT prompts.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Words in Context as a recurring, high-frequency Craft & Structure skill — a strategy problem, not a vocabulary-memorization problem.',
      script:
        'Words in Context shows up several times on every digital SAT Reading and Writing module, in two disguises: "fill in the blank" and "what does this word most nearly mean." You do not need to know every word in the English language. You need to read the sentence like a detective and figure out what word HAS to go there. That skill is what we build today.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Teach the predict-then-match process, the context-clue types, and the four recurring digital-SAT traps for Words in Context.',
      keyIdeas: [
        'TWO DIGITAL-SAT PROMPTS, ONE SKILL — "Which choice completes the text with the most logical and precise word or phrase?" (fill-the-blank) and "As used in the text, the word/phrase ___ most nearly means" (define-in-context). Both are graded the same way: does the choice fit THIS sentence, not just the dictionary.',
        'PROCESS — read the full sentence (and the sentence before/after when given), predict a plain-English word or at least a positive/negative direction before looking at the choices, then match your prediction to the closest choice.',
        "CONTEXT CLUES — a direct restatement or definition in the sentence; a synonym or example right next to the target word; a contrast signal (although, despite, however, yet, but, while) that flips the expected direction; a cause/result signal (because, therefore, so) that confirms it.",
        'TRAP: DENOTATION OVER CONTEXT — the wrong choice is a real, common dictionary meaning of the word (a legal "trial," a scientific "trial," an athletic "trial") that simply does not fit this sentence\'s meaning.',
        'TRAP: CONNOTATION MISMATCH — the wrong choice is close in literal meaning but carries the wrong emotional shade (generous vs. equitable; stingy vs. frugal; arrogant vs. confident).',
        'TRAP: WRONG-DIRECTION — the wrong choice fits the general topic but points the opposite way from a nearby contrast word like "despite," "but," or "however."',
        'TRAP: SOUNDS-SMART DISTRACTOR — a choice that is longer or more sophisticated-sounding than the correct answer, but does not actually fit the sentence as precisely.',
        'STRATEGY — eliminate every choice that contradicts your one-word prediction FIRST, then compare the survivors for precision. Never pick a word just because it sounds advanced.',
      ],
      vocabulary: [
        { term: 'denotation', definition: "a word's literal, dictionary meaning — the meaning the SAT often sets as a trap when it doesn't fit the sentence." },
        { term: 'connotation', definition: 'the emotional or cultural shade a word carries beyond its literal meaning (positive, negative, or neutral).' },
        { term: 'context clue', definition: 'a nearby word or phrase — synonym, contrast, example, or cause — that signals a word\'s meaning in this specific sentence.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-fill-blank',
      kind: 'worked_example',
      problem:
        'Read the passage: "Marine biologists have long debated why some octopus species change color even when no predator is nearby. Recent field studies suggest the shifts are not always defensive; they can also communicate mood or reproductive readiness. If color change served only as camouflage, researchers would expect it to occur only in the presence of a threat, but octopuses have been recorded flashing patterns while completely alone, which most researchers now find ______." Question: Which choice completes the text with the most logical and precise word or phrase? (A) predictable (B) puzzling (C) irrelevant (D) convenient',
      steps: [
        'Find the signal word: "but" introduces a contrast between what researchers would EXPECT (color change only near a threat) and what they actually OBSERVE (octopuses changing color alone).',
        'Predict a plain-English word for how researchers would react to an unexpected finding: "confusing," "surprising," "hard to explain."',
        'Match: (A) predictable is the opposite of unexpected — eliminate. (C) irrelevant and (D) convenient don\'t fit a finding researchers are actively debating. (B) puzzling matches "unexpected and hard to explain."',
      ],
      answer: '(B) puzzling',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-most-nearly-means',
      kind: 'worked_example',
      problem:
        'Read the passage: "In her memoir, the retired diplomat describes the early years of her career as a series of small trials that tested her patience long before any major crisis arrived. She recalls sitting through hours of stalled negotiations, drafting reports that were rewritten a dozen times, and waiting months for replies to routine cables. Looking back, she credits this slow, unglamorous grind with teaching her more about diplomacy than any single dramatic summit ever did." Question: As used in the text, what does the word "trials" most nearly mean? (A) courtroom proceedings (B) taxing experiences (C) experiments (D) athletic competitions',
      steps: [
        'Locate "trials" in context: "a series of small trials that tested her patience," followed by stalled negotiations, endless rewrites, and long waits.',
        'Predict a plain-English word: "hardships," "frustrations," "taxing experiences" — nothing legal or scientific.',
        'Eliminate the denotation traps: (A) courtroom proceedings is the legal meaning — no court is described. (C) experiments is the scientific meaning — no experiment is described. (D) athletic competitions is irrelevant. (B) taxing experiences matches "tested her patience."',
      ],
      answer: '(B) taxing experiences',
      estimatedMinutes: 3,
    },
    {
      id: 'try-fill-blank',
      kind: 'try_yourself',
      problem:
        'Read the passage: "When the city council first proposed replacing the aging public pool with a splash pad, longtime residents were largely ______: they had fond memories of swim lessons and summer meets and did not want the pool demolished. Only after engineers explained that the pool\'s foundation was cracked beyond repair did opinions begin to shift." Question: Which choice completes the text with the most logical and precise word or phrase?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'indifferent' },
        { id: 'b', text: 'resistant', correct: true },
        { id: 'c', text: 'enthusiastic' },
        { id: 'd', text: 'uninformed' },
      ],
      expectedAnswer: 'resistant',
      hints: [
        'Look at what the residents "had fond memories of" and what they "did not want" — that tells you their attitude toward the change.',
        'They are pushing back against the plan, not staying neutral about it — eliminate the choice that means "not caring."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-most-nearly-means',
      kind: 'try_yourself',
      problem:
        'Read the passage: "The new store manager was praised by corporate for running a tight operation: shifts started exactly on time, every receipt was double-checked, and no employee left before their closing checklist was complete. Several cashiers, however, described her methods in less flattering terms, saying she treated even a two-minute delay as a serious offense and rarely acknowledged when the extra effort paid off." Question: As used in the text, what does the phrase "tight operation" most nearly mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'a financially profitable business' },
        { id: 'b', text: 'a strictly controlled workplace', correct: true },
        { id: 'c', text: 'a physically small workplace' },
        { id: 'd', text: 'a well-connected team' },
      ],
      expectedAnswer: 'a strictly controlled workplace',
      hints: [
        'List every detail before "however": exact punctuality, double-checked receipts, a completed closing checklist. What do those describe about how the workplace is run?',
        '"Tight" here describes discipline and control, not money or physical size.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-connotation-trap',
      kind: 'try_yourself',
      problem:
        'Read the passage: "After weeks of testimony, the arbitrator\'s decision was surprisingly ______: rather than favoring one side outright, she split the disputed contract nearly down the middle, awarding each company roughly half of what it had originally claimed. Both legal teams later admitted they had expected a much more one-sided outcome." Question: Which choice completes the text with the most logical and precise word or phrase?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'equitable', correct: true },
        { id: 'b', text: 'generous' },
        { id: 'c', text: 'lenient' },
        { id: 'd', text: 'impulsive' },
      ],
      expectedAnswer: 'equitable',
      hints: [
        'The arbitrator did not favor either side — she split the award almost exactly in half. What single word means "fair to both sides"?',
        '"Generous" means giving more than expected to one party; this decision balanced BOTH parties equally instead. "After weeks of testimony" also rules out an impulsive decision.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dictionary-meaning',
      kind: 'misconception_check',
      question:
        'A student is asked what "novel" most nearly means in a sentence describing a scientist\'s "novel approach to renewable energy storage," and confidently answers "a printed fictional book." What went wrong?',
      commonErrors: [
        {
          answer: 'a printed fictional book',
          misconception: "Reaching for the single most common dictionary meaning of the word instead of checking which meaning fits this sentence.",
          correctsTo:
            'Words in Context questions almost always test a LESS common or contextual meaning, not the first meaning that comes to mind. Here "novel" is used as an adjective meaning "new and original." Predict a plain-English word from the sentence itself ("new," "innovative") before matching to choices — never lock in the first meaning you know.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Predict a plain-English word — or at least a positive/negative direction — before looking at the answer choices.',
        'Watch for contrast and cause signal words (although, despite, however, but, because, therefore) — they tell you which direction the answer must point.',
        'Eliminate the "common dictionary meaning" trap and the "close but wrong connotation" trap — the right answer fits THIS sentence, not the word\'s most familiar sense.',
        'The two digital-SAT phrasings — "most logical and precise word" and "most nearly means" — are the same skill: context fit beats vocabulary size.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Words in Context' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
