/**
 * ACT English — Verb Tense & Form.
 *
 * Verb tense/form questions are among the most common ACT English usage
 * items, and they are almost never solvable by reading the underlined verb
 * alone — the correct choice is set by the tense the surrounding passage
 * has already established. Tense CONSISTENCY with the sentences before and
 * after the underline is the ACT's signature move on this question type.
 * All excerpts below are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U1_VERB_TENSE_FORM: LessonPlan = {
  id: 'evelyn.testprep.act.verb-tense-form.v1',
  title: 'Verb Tense & Form',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.verb-tense-form',
      standard: 'ACT-1.4',
      description:
        'Select the verb tense and form that matches the timeline already established by the surrounding sentences in an ACT English passage.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe verb tense/form questions as a paragraph-level check, not a single-sentence judgment call — set the pacing stakes.',
      script:
        'ACT English gives you 75 questions in 45 minutes — about 9 minutes per passage, well under a minute per question. Verb tense and form questions show up in nearly every passage, and they are the easiest ones to get wrong fast, because the underlined verb almost always SOUNDS fine by itself. The trick the ACT is testing isn\'t grammar knowledge — it\'s whether you checked the timeline the rest of the paragraph already set.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tense-consistency',
      kind: 'concept',
      goal: 'The paragraph-timeline method for verb tense, plus the traps that make an isolated verb sound right when it is wrong.',
      keyIdeas: [
        'ESTABLISH THE TIMELINE FIRST. Before judging the underlined verb, read one sentence before and one sentence after. The tense used THERE — not how the underlined verb sounds alone — is the rule you\'re checking against.',
        'SIMPLE PAST STAYS PAST. If a paragraph narrates a past event ("volunteered," "cleaned," "read"), every verb describing that same timeline must stay simple past, even if a present-tense version would be a perfectly grammatical sentence in isolation.',
        'PRESENT PERFECT ("has/have + past participle") signals an action that started in the past and still matters or continues now. Don\'t mix it into a passage that is narrating a finished, dated past event.',
        'PAST PERFECT ("had + past participle") marks the EARLIER of two past events — the "sequence of tenses" rule. When a sentence compares two things that both happened in the past, the one that happened first takes "had + participle"; the later, reference event stays simple past.',
        'SIGNAL WORDS EARN A SHIFT. Words like "now," "today," "currently," "by the time," or "already" justify a tense change. No signal word present ⟹ no earned shift; the passage\'s tense holds.',
        'VERB FORM IS A SEPARATE CHECK FROM TENSE. After an auxiliary like "has," "have," "had," or "will have," the verb must take its PAST PARTICIPLE form (written, gone, seen, done) — not the simple past form (wrote, went, saw, did). This trips students who know the right tense but plug in the wrong form.',
        'TRAP — SOUNDS-RIGHT-ALONE: the ACT deliberately writes the underlined verb so it reads naturally as a stand-alone sentence. It is designed to pass a "does this sound okay?" check while failing the paragraph-timeline check.',
        'TRAP — UNSIGNALED SHIFT: a passage that drifts from past to present (or back) with no signal word is an ERROR to fix, not a stylistic choice the author is allowed to make.',
      ],
      vocabulary: [
        { term: 'tense consistency', definition: 'keeping every verb describing the same timeline in the same tense unless a signal word justifies a shift.' },
        { term: 'past perfect', definition: '"had + past participle" — marks the earlier of two past events (e.g., "had spread" before "arrived").' },
        { term: 'sequence of tenses', definition: 'the rule governing which of two related events gets simple past and which gets past perfect, based on which happened first.' },
        { term: 'verb form', definition: 'the specific shape a verb takes after an auxiliary (participle: written, gone, seen) versus its simple-past shape (wrote, went, saw).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-tense-consistency',
      kind: 'worked_example',
      problem:
        'Last summer, Maria volunteered at the animal shelter every weekend. She "WALKS" the dogs, cleaned the kennels, and read to the cats to help them get used to human voices. Which choice best fixes the underlined verb?',
      steps: [
        'Read the sentences around the underline: "volunteered," "cleaned," and "read" are all simple past — the paragraph has clearly established a past-tense, finished-summer timeline.',
        '"WALKS" is present tense, breaking that established sequence — even though "She walks the dogs" is a perfectly fine sentence in isolation.',
        'Check for a signal word that would justify a shift to present tense (now, today, currently). There is none.',
        'The underlined verb must match "cleaned" and "read": simple past, "walked."',
      ],
      answer: 'walked',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sequence-of-tenses',
      kind: 'worked_example',
      problem:
        'By the time the fire trucks arrived, the flames already "SPREAD" to the roof next door. Which choice best fixes the underlined verb?',
      steps: [
        'Two past events are being compared: the trucks arriving, and the flames spreading. Both happened in the past, but not at the same time.',
        '"By the time" and "already" are sequence-of-tenses signal words — they flag that one past event finished BEFORE another past event.',
        '"Arrived" is the later, reference event, so it correctly stays simple past.',
        'The earlier event — the spreading — needs past perfect: "had spread." Trap: "spread" alone (NO CHANGE) reads fine as an isolated sentence, but it fails the two-events-in-sequence test.',
      ],
      answer: 'had spread',
      estimatedMinutes: 3,
    },
    {
      id: 'try-present-tense-match',
      kind: 'try_yourself',
      problem:
        'Every morning, the baker arrives before dawn, mixes the dough, and "SHAPED" the loaves by hand. Which choice best fixes the underlined verb?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE' },
        { id: 'b', text: 'shapes', correct: true },
        { id: 'c', text: 'had shaped' },
        { id: 'd', text: 'shaping' },
      ],
      expectedAnswer: 'shapes',
      hints: [
        'Check the surrounding verbs, not just the underlined one: "arrives" and "mixes" are present tense.',
        'No signal word justifies a shift to past — the underlined verb must match the paragraph\'s established present tense.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-past-perfect-sequence',
      kind: 'try_yourself',
      problem:
        'The committee announced the winners on Friday. Before the announcement, three judges "RAISE" concerns about one finalist\'s eligibility. Which choice best fixes the underlined verb?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE' },
        { id: 'b', text: 'raised' },
        { id: 'c', text: 'had raised', correct: true },
        { id: 'd', text: 'raising' },
      ],
      expectedAnswer: 'had raised',
      hints: [
        'Two past events are being compared: the announcement, and the judges raising concerns. Which happened first?',
        '"Before the announcement" is the sequence signal — the earlier event takes past perfect.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-verb-form',
      kind: 'try_yourself',
      problem:
        'By graduation, Marcus will have "WROTE" over two hundred pages in his journal. Which choice best fixes the underlined verb?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE' },
        { id: 'b', text: 'writes' },
        { id: 'c', text: 'written', correct: true },
        { id: 'd', text: 'to write' },
      ],
      expectedAnswer: 'written',
      hints: [
        'This is a FORM question, not a tense question — the tense ("will have ___") is already set.',
        'After "will have," the verb needs its past-participle form, not the simple-past form. "Wrote" is simple past; the participle of "write" is "written."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sounds-right-alone',
      kind: 'misconception_check',
      question:
        'A student reads only the underlined verb, decides "She walks the dogs" sounds like a normal, correct sentence, and picks NO CHANGE without checking anything else. What went wrong?',
      commonErrors: [
        {
          answer: 'Picking NO CHANGE because the verb sounds grammatically fine by itself',
          misconception: 'Treating the underlined sentence as a stand-alone unit graded on its own grammaticality.',
          correctsTo: 'ACT verb tense/form questions are graded against the paragraph\'s established timeline, not the underlined sentence in isolation. Always read a sentence before and after, identify the tense already in use, and check for a signal word before allowing any shift.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Read a sentence before AND after the underlined verb — the surrounding tense is the rule, not how the verb sounds alone.',
        'No signal word (now, today, by the time, already) means no earned tense shift.',
        '"Had + past participle" (past perfect) marks whichever of two past events happened FIRST; the later, reference event stays simple past.',
        'Verb FORM is a separate check from tense: match the participle to the auxiliary (will have written, has gone), not the simple-past shape (wrote, went).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Verb Tense & Form' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
