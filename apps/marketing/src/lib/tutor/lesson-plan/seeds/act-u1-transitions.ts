/**
 * ACT — English / Transitions & Logical Connections.
 *
 * Transition questions show up in nearly every ACT English passage
 * (~9 minutes per passage, 75 questions / 45 minutes overall). The
 * trap isn't vocabulary — it's sequencing. Students who read the
 * answer choices first anchor on whichever word "sounds right."
 * The fix is to classify the logical relationship between the two
 * ideas BEFORE looking at the choices, then match the transition
 * family to that relationship. The ACT also tests transition
 * PLACEMENT — where a transitional sentence belongs within a
 * paragraph, not just which word to use.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U1_TRANSITIONS: LessonPlan = {
  id: 'evelyn.testprep.act.transitions.v1',
  title: 'Transitions & Logical Connections',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.transitions',
      standard: 'ACT-1.8',
      description:
        'Identify the logical relationship between sentences or paragraphs and select the transition word, phrase, or sentence placement that correctly signals that relationship.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame transitions as a relationship-classification skill, not a vocabulary quiz — set the pacing stakes.',
      script:
        'ACT English gives you 75 questions in 45 minutes — about 36 seconds each — and almost every one of the five passages (roughly 9 minutes apiece) has at least one transition question: however, therefore, moreover, and their cousins. These are some of the fastest points on the test IF you classify the logical relationship between the two ideas BEFORE you even glance at the answer choices. Today we also cover the ACT\'s favorite twist: questions about WHERE a transition or transitional sentence belongs in a paragraph, not just which word to pick.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-transition-logic',
      kind: 'concept',
      goal: 'Relationship-first method, transition families, and the two big traps: wrong-direction word choice and misplacement.',
      keyIdeas: [
        'CLASSIFY FIRST. Read the sentence before and the sentence after the underlined transition and decide the RELATIONSHIP between them — contrast, cause/effect, addition, example, concession, or sequence — before you read a single answer choice.',
        'THEN match the family. Once you know the relationship, pick the choice from that family. "NO CHANGE" is a completely legitimate answer when the existing transition already matches — don\'t assume a question implies an error.',
        'TRANSITION FAMILIES: ADDITION (moreover, furthermore, in addition, also) — a new supporting point. CONTRAST (however, nevertheless, yet, on the other hand) — the ideas disagree or reverse. CAUSE/EFFECT (therefore, thus, consequently, as a result) — one idea produces the other. CONCESSION (although, granted, admittedly) — acknowledges a point before overriding it. EXAMPLE (for instance, namely, specifically) — illustrates the prior claim. SEQUENCE (meanwhile, subsequently, finally) — orders events in time.',
        'TRAP 1 — WRONG DIRECTION: "however" and "therefore" are the two most common distractors, precisely because they sound formal and connective. If the surrounding sentences actually AGREE or the second CONTINUES from the first, a contrast word reverses the logic; if the second sentence is just a new fact (not a consequence), a cause/effect word overstates the link.',
        'TRAP 2 — PLACEMENT: the ACT also asks where a transition — or a whole transitional sentence — belongs within a paragraph. A transition only works when it sits between the two specific ideas it bridges. If a question proposes moving a sentence, re-classify the relationship at the NEW location; don\'t reuse your first answer.',
        'PARAGRAPH-LEVEL TRANSITIONS: some questions ask for the best transitional SENTENCE to open or close a paragraph. Check what idea the paragraph before ends on and what the paragraph after begins with — the correct sentence has to bridge both, not just echo one side.',
        'READ WIDE. Always read one sentence before AND one sentence after the underlined portion. Many wrong answers look plausible if you only read the sentence containing the blank.',
        'WATCH FOR EXISTING PATTERNS: if a paragraph already uses a sequence marker (first... second... finally...), an inserted transition must fit that established pattern, not just be logically valid in isolation.',
      ],
      vocabulary: [
        { term: 'transition', definition: 'a word, phrase, or sentence that signals the logical relationship between two ideas.' },
        { term: 'concession', definition: 'acknowledging a point (often with "although" or "granted") before pivoting to a different claim.' },
        { term: 'NO CHANGE', definition: 'the ACT\'s standard first choice meaning "the underlined portion is already correct" — a real, frequently correct answer.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cause-effect',
      kind: 'worked_example',
      problem:
        'Passage excerpt: "The bridge\'s original cables had corroded badly. \'THEREFORE,\' engineers decided to replace the entire suspension system rather than repair individual sections." Which choice is best for the underlined transition? (a) NO CHANGE ("Therefore") (b) However (c) For example (d) Meanwhile',
      steps: [
        'Read before and after, ignoring the current word: "cables had corroded badly" (a problem) → "engineers decided to replace the entire system" (a decision).',
        'Classify BEFORE looking hard at the choices: the decision follows FROM the corrosion — that\'s a cause/effect relationship.',
        'Scan the choices for the cause/effect family: (a) "Therefore" is cause/effect. (b) "However" is contrast — wrong family. (c) "For example" introduces an illustration, not a consequence. (d) "Meanwhile" signals simultaneous time, not causation.',
        'Only (a) matches the classified relationship, and it happens to be the existing word — NO CHANGE is correct here.',
      ],
      answer: '(a) NO CHANGE — "Therefore" correctly signals cause/effect.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-wrong-family-trap',
      kind: 'worked_example',
      problem:
        'Passage excerpt: "[1] Local libraries across the district have expanded their maker-space programs, adding 3-D printers and robotics kits. [2] \'MOREOVER,\' the number of teen library-card sign-ups has increased by 40 percent since the programs began." Which choice is best for the underlined transition in sentence 2? (a) NO CHANGE ("Moreover") (b) As a result (c) However (d) For example',
      steps: [
        'Read sentence 1 (maker spaces expanded) and sentence 2 (teen sign-ups rose 40%), setting aside the underlined word for now.',
        'Classify: is sentence 2 simply an ADDITIONAL fact sitting alongside sentence 1, or did the sign-up increase happen BECAUSE OF the maker-space expansion? The 40% rise is a consequence, not a separate add-on — that\'s cause/effect.',
        'Check the choices against that classification: (a) "Moreover" is addition — plausible-sounding but the wrong family, since it treats the rise as an unrelated extra fact rather than a result. (b) "As a result" is cause/effect — matches. (c) "However" is contrast — the sentences don\'t disagree. (d) "For example" would need sentence 2 to illustrate sentence 1, not report a separate outcome.',
        'This is the trap: NO CHANGE looks safe because "Moreover" sounds transitional, but classifying the relationship first shows it names the wrong connection.',
      ],
      answer: '(b) As a result — the sign-up increase is a consequence of the maker-space expansion, not an added fact.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-contrast',
      kind: 'try_yourself',
      problem:
        'Passage excerpt: "[1] The company\'s quarterly profits fell for the third straight year. [2] \'NEVERTHELESS,\' the board voted to increase the dividend paid to shareholders." Which choice is best for the underlined transition?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE ("Nevertheless")', correct: true },
        { id: 'b', text: 'Therefore' },
        { id: 'c', text: 'For example' },
        { id: 'd', text: 'Moreover' },
      ],
      expectedAnswer: 'NO CHANGE ("Nevertheless")',
      hints: [
        'Classify first: profits FELL, but the board increased the dividend anyway — do those two facts agree, or does the second push against the first?',
        'That\'s a contrast/concession relationship, so you need a contrast-family word.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-wrong-direction',
      kind: 'try_yourself',
      problem:
        'Passage excerpt: "[1] Rainfall in the region has decreased by 20 percent over the past decade. [2] \'HOWEVER,\' reservoir levels have also dropped, and several small farms have had to install irrigation systems for the first time." Which choice is best for the underlined transition?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE ("However")' },
        { id: 'b', text: 'As a result', correct: true },
        { id: 'c', text: 'For instance' },
        { id: 'd', text: 'Nevertheless' },
      ],
      expectedAnswer: 'As a result',
      hints: [
        'Read past the underlined word: dropping reservoirs and new irrigation systems both follow directly from decreased rainfall — do those ideas disagree, or does one cause the other?',
        '"However" and "Nevertheless" are both contrast words; nothing in sentence 2 contradicts sentence 1, so eliminate the contrast family entirely.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-placement',
      kind: 'try_yourself',
      problem:
        'Paragraph: "[1] Community gardens have become popular in the downtown neighborhood. [2] The city donated an empty lot on Fifth Street to the project last spring. [3] Volunteers now grow vegetables that are donated to the local food pantry every week. [4] The garden\'s success has encouraged two nearby neighborhoods to start their own plots." The writer wants to add this sentence: "For this reason, the city plans to donate two more lots next year." Where should it be placed?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Before Sentence 1' },
        { id: 'b', text: 'After Sentence 2' },
        { id: 'c', text: 'After Sentence 3' },
        { id: 'd', text: 'After Sentence 4', correct: true },
      ],
      expectedAnswer: 'After Sentence 4',
      hints: [
        '"For this reason" needs an explicit reason directly before it — find the sentence that states the reason the city would donate MORE lots.',
        'Sentence 4 states the garden\'s success spurring nearby neighborhoods to start their own plots — that success is the stated "reason." Placing the new sentence anywhere earlier severs it from its reason.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-interchangeable-transitions',
      kind: 'misconception_check',
      question:
        'A student swaps in "however" or "moreover" whenever unsure, since both sound formal and transitional. What\'s the underlying misconception?',
      commonErrors: [
        {
          answer: 'Any formal-sounding connector works as long as the sentence reads smoothly.',
          misconception:
            'Treating transitions as interchangeable connective tissue instead of markers of a SPECIFIC logical relationship — contrast and addition are opposite jobs, not stylistic variants of each other.',
          correctsTo:
            'Classify the relationship between the two ideas first, BEFORE reading the choices, then pick the transition whose family matches: contrast words signal disagreement or reversal, addition words signal a new supporting point, cause/effect words signal one idea producing the other. Swapping families reverses or muddles the sentence\'s meaning even when the grammar is fine.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Classify the logical relationship between the two ideas BEFORE reading the answer choices.',
        'Match the transition family to that relationship — contrast, cause/effect, addition, example, concession, sequence — never by "sounds right."',
        'NO CHANGE is a fully legitimate answer whenever the existing transition already matches the relationship.',
        'Placement questions: a transition only works between the two specific ideas it bridges — re-classify the relationship any time a sentence might move.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.8', cedTitle: 'Transitions & Logical Connections' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
