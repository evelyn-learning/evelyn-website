/**
 * ACT — Reading: Vocabulary in Context.
 *
 * "As it is used in line X, the word Y most nearly means" questions show up
 * on nearly every ACT Reading passage. The trap is almost always the SAME
 * one: the word's ordinary, most-common dictionary meaning sits right there
 * as an answer choice, and it's wrong. These are ~52-second questions —
 * fast if you reread the sentence, slow (and often wrong) if you answer
 * from memory of what the word usually means. All stimuli are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U3_VOCABULARY_IN_CONTEXT: LessonPlan = {
  id: 'evelyn.testprep.act.vocabulary-in-context.v1',
  title: 'Vocabulary in Context',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.vocabulary-in-context',
      standard: 'ACT-3.4',
      description:
        'Determine the intended meaning of a word as used in a specific line of an ACT Reading passage, resisting the pull of its most common dictionary meaning.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame vocabulary-in-context as a rereading skill, not a vocabulary-size skill, and name the recurring trap.',
      script:
        'Almost every ACT Reading passage has at least one question shaped like this: "As it is used in line 24, the word X most nearly means..." Good news — these are rarely hard words. Bad news — the ACT picks ordinary words that have a common, everyday meaning AND a less common one, and the everyday meaning is sitting right there as a wrong answer choice. You get about 52 seconds per question. Today is about training yourself to reread instead of recall.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-context-method',
      kind: 'concept',
      goal: 'The cover-predict-match method, and how to recognize and defuse the common-meaning trap.',
      keyIdeas: [
        'THE QUESTION SHAPE: "As it is used in line X, the word Y most nearly means..." — it names a specific line, which means the sentence itself decides the answer, not the word in isolation.',
        'THE CORE TRAP: the ACT deliberately chooses words with a common, everyday meaning that is NOT the meaning used in the passage. That common meaning is almost always one of the four choices, and it is almost always wrong. Do not answer from memory of "what this word usually means."',
        'COVER-PREDICT-MATCH: cover the answer choices, reread the sentence (plus one sentence before/after for context), predict your own substitute word, THEN uncover the choices and match your prediction — not the word\'s default meaning.',
        'TESTED WORDS ARE USUALLY ORDINARY, not obscure. "Sound," "novel," "grave," "temper," "arresting" — everyday words with a second, less common sense. The difficulty is entirely in the trap, not in the vocabulary itself.',
        'RELINE EVERY TIME: reread using the exact line number given. The same word can carry a different sense in a different paragraph — never reuse a definition of the word from earlier in the passage.',
        'PART-OF-SPEECH CHECK: your substitute must fit the same grammatical role the word plays in that sentence — noun for noun, verb for verb, adjective for adjective. A choice can be a real meaning of the word and still fail this check.',
        'WHEN TWO CHOICES LOOK PLAUSIBLE: plug each one back into the sentence and read it for sense and tone. The wrong one is usually a genuine meaning of the word in isolation, but it makes the sentence awkward or nonsensical in context.',
      ],
      vocabulary: [
        { term: 'vocabulary-in-context question', definition: 'a question asking what a word "most nearly means" as used in a specific, cited line of the passage.' },
        { term: 'common-meaning trap', definition: 'the wrong answer choice built from the word\'s most familiar, everyday sense — present precisely because it is tempting.' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-typical',
      kind: 'worked_example',
      problem:
        'Dr. Alvarez had spent a decade studying which farming methods actually protected topsoil, so when younger colleagues proposed shortcuts, she reminded them that only a SOUND method — one tested across several seasons and different soil types — could be trusted to hold up when a drought finally came. As it is used in this sentence, "sound" most nearly means: (a) loud (b) reliable and well-supported (c) deep, as in undisturbed sleep (d) a narrow body of water',
      steps: [
        'Cover the choices first. Reread the sentence: a method is "sound" if it has been "tested across several seasons and different soil types" and can be "trusted to hold up."',
        'Predict a substitute in your own words: "solid," "trustworthy," "proven."',
        'Notice the common-meaning trap: "sound" most often makes people think of noise/hearing (choice a) — but nothing in this sentence is about hearing, so that meaning cannot fit.',
        'Also notice "sound" has two OTHER real meanings baited here — undisturbed sleep (c) and a body of water (d) — neither fits a farming "method."',
        'Match your prediction to the choices: "reliable and well-supported" is the only one that fits a tested, trustworthy method.',
      ],
      answer: 'reliable and well-supported',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trap-variant',
      kind: 'worked_example',
      problem:
        'The coach\'s early enthusiasm for the untested lineup had to be TEMPERED by the sobering reality of a schedule that included three of last year\'s playoff teams in the first month alone. As it is used in this sentence, "tempered" most nearly means: (a) angered (b) hardened, as in metal-working (c) moderated or restrained (d) ignored',
      steps: [
        'COMMON-MEANING TRAP CHECK FIRST: "temper" instantly suggests anger ("lost his temper") — but that use is a NOUN, and here "tempered" is a VERB acting on "enthusiasm." Cross out (a) immediately on part-of-speech grounds, not just meaning.',
        'A second real meaning is baited too: "temper" a metal means to HARDEN it through heat treatment — a legitimate verb use of the word, so it survives the part-of-speech check.',
        'Read for sense: does "sobering reality" harden enthusiasm, or does it soften/restrain it? A sobering fact reins excess enthusiasm in — it does not strengthen it. (b) fails the sense check even though it is a real meaning of the word.',
        'Predict your own substitute before matching: "reined in," "toned down," "kept in check."',
        'Confirm by plugging back in: "enthusiasm had to be moderated or restrained by the sobering reality" reads naturally — (c) is correct.',
      ],
      answer: 'moderated or restrained',
      estimatedMinutes: 3,
    },
    {
      id: 'try-arresting',
      kind: 'try_yourself',
      problem:
        'What struck reviewers most about the photography exhibit wasn\'t its scale but its ARRESTING use of shadow, each print holding the eye far longer than its small frame seemed to warrant. As it is used in this sentence, "arresting" most nearly means:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'related to a police arrest' },
        { id: 'b', text: 'strikingly attention-getting', correct: true },
        { id: 'c', text: 'slow-moving' },
        { id: 'd', text: 'frightening' },
      ],
      expectedAnswer: 'strikingly attention-getting',
      hints: [
        '"Arresting" ordinarily makes you think of police — but nothing here involves law enforcement, so that meaning can\'t be right.',
        'The sentence says the prints "held the eye far longer than its small frame seemed to warrant." What word matches that idea?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-novel',
      kind: 'try_yourself',
      problem:
        'The engineers\' NOVEL approach to the bridge\'s cable design — untested anywhere else in the world — drew both admiration and skepticism from the review board. As it is used in this sentence, "novel" most nearly means:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'a long work of fiction' },
        { id: 'b', text: 'new and original', correct: true },
        { id: 'c', text: 'predictable' },
        { id: 'd', text: 'expensive' },
      ],
      expectedAnswer: 'new and original',
      hints: [
        '"Novel" as a noun means a book — but here it describes "approach," so it must be functioning as an adjective.',
        'The approach is described as "untested anywhere else in the world." What adjective fits that description?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-grave',
      kind: 'try_yourself',
      problem:
        'Though the mayor tried to sound optimistic at the press conference, her advisors exchanged GRAVE looks the moment the budget numbers appeared on screen. As it is used in this sentence, "grave" most nearly means:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'a burial site' },
        { id: 'b', text: 'serious and worried', correct: true },
        { id: 'c', text: 'joyful' },
        { id: 'd', text: 'confused' },
      ],
      expectedAnswer: 'serious and worried',
      hints: [
        '"Grave" as a noun means a burial place — but here it describes "looks," so it\'s functioning as an adjective, not a noun.',
        'The mayor is trying to sound optimistic while her advisors react to bad budget numbers. What mood fits that reaction?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-answer-from-memory',
      kind: 'misconception_check',
      question:
        'A student sees the word "sound" in a passage and immediately picks "loud, audible noise" without rereading the sentence it appears in. What went wrong?',
      commonErrors: [
        {
          answer: 'loud, audible noise',
          misconception: 'Answering vocabulary-in-context questions from memory of the word\'s single most common meaning instead of rereading the cited sentence.',
          correctsTo: 'Always reread the exact line named in the question and predict a substitute word BEFORE looking at the choices. The ACT deliberately writes these questions around words whose common, everyday meaning is wrong in that specific sentence — treat the familiar meaning as a warning sign, not a shortcut.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '"As it is used in line X, the word Y most nearly means" is decided by that sentence, not by the word\'s dictionary-default sense.',
        'The word\'s most common everyday meaning is almost always one of the four choices — and it\'s usually the wrong one. That\'s the trap.',
        'Cover the choices, reread the sentence plus context, predict your own substitute, THEN match to a choice.',
        'Check part of speech and plug your answer back into the sentence — it should read naturally.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'Vocabulary in Context' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
