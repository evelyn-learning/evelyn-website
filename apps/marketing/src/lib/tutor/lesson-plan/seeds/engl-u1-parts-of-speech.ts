/**
 * HS English — Grammar & Usage: Parts of Speech in Action.
 *
 * The foundation the rest of the course stands on (CCSS L.9-10.1):
 * a word's part of speech is the JOB it does in one particular
 * sentence, not a label stamped on it for life. Every practice item
 * is a function-identification MCQ built on original sentences.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U1_PARTS_OF_SPEECH: LessonPlan = {
  id: 'evelyn.hs.engl.parts-of-speech.v1',
  title: 'Parts of Speech in Action',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.parts-of-speech',
      standard: 'ENGL-1.1',
      description:
        'Identify each of the eight parts of speech by the FUNCTION a word performs in a particular sentence, recognizing that the same word can act as a noun, a verb, or a modifier depending on the job it is doing (CCSS L.9-10.1).',
    },
  ],
  prerequisites: [],
  followUps: ['engl.subject-verb-agreement'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame parts of speech as the shared vocabulary that makes every later revision decision possible — and kill the idea that words carry permanent labels.',
      script:
        'Every piece of writing you care about this year — the email that asks a stranger for an internship, the argument that has to survive a skeptical reader, the story whose first line decides whether anyone keeps reading — gets revised the same way: you look at a sentence, decide which word is doing which job, and move or cut accordingly. That is all parts of speech are. Here is the twist most students never get told: the same word can be a noun in one sentence and a verb in the next. "Light" is a thing on your ceiling and an action you do to a candle. So we are not memorizing eight word lists today. We are learning to ask one question of any word: what job is it doing right here?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-function-not-label',
      kind: 'concept',
      goal: 'The function test, the eight jobs, and the two label-shortcut errors that wreck student answers.',
      keyIdeas: [
        'FUNCTION, NOT MEMORIZATION — a part of speech is a JOB a word does in one specific sentence, not a permanent tag. Ask "what is this word doing here?" before you name it. Change the sentence and the answer can change.',
        'NOUNS AND PRONOUNS — nouns name a person, place, thing, or idea and can take "the" or "a" in front of them ("the counselor", "a deadline", "freedom"). Pronouns stand in for a noun already known: she, they, it, who, everyone, myself.',
        'VERBS — verbs carry the action or the state of being: "she drafted", "the room felt quiet". The test is tense: if you can put it in the past or future ("yesterday she ___", "tomorrow she will ___"), it is working as a verb in that slot.',
        'ADJECTIVES AND ADVERBS — adjectives modify nouns and pronouns and answer which one, what kind, or how many ("a blunt reply", "three drafts"). Adverbs modify verbs, adjectives, or other adverbs and answer how, when, where, or to what degree ("replied bluntly", "almost finished", "arrived early").',
        'PREPOSITIONS, CONJUNCTIONS, INTERJECTIONS — prepositions start a phrase that locates something in space, time, or relationship ("in the folder", "after lunch", "about the schedule"). Conjunctions join: and, but, or, so, yet for equal parts; because, although, when, if to attach a dependent idea. Interjections are stand-alone bursts of feeling: "Ouch", "Well", "Honestly".',
        'THE SAME WORD, DIFFERENT JOBS — the biggest source of wrong answers. "Study" is a noun in "her study of local water", a verb in "I study at night", and an adjective in "the study group meets Thursday". WRONG — answering "study is a noun" without reading the sentence. CORRECT — naming the job the word does in the sentence in front of you.',
        'THE -LY SHORTCUT TRAP — most adverbs end in -ly, but the ending never decides the answer. WRONG — calling "lovely" and "friendly" adverbs because of the -ly. CORRECT — both modify nouns ("a lovely afternoon", "a friendly opening line"), so both are adjectives. Meanwhile "fast", "early", "hard", and "well" are adverbs with no -ly at all: "she writes fast".',
        'WATCH THE HELPERS — forms of be, have, and do often team up with a main verb ("has been revising", "did not answer"). The whole cluster is doing the verb job; "not" is an adverb that sneaked into the middle of it, never part of the verb itself.',
      ],
      vocabulary: [
        { term: 'function', definition: 'the job a word performs in one particular sentence — the only thing that decides its part of speech.' },
        { term: 'modifier', definition: 'a word that changes or narrows the meaning of another word; adjectives modify nouns, adverbs modify verbs, adjectives, and other adverbs.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-name-the-jobs',
      kind: 'worked_example',
      problem:
        'Name the part of speech of "before", "practiced", "carefully", and "and" in this sentence: "Before the interview, Dara practiced her answers carefully, and her hands finally stopped shaking."',
      steps: [
        '"Before" — it opens the phrase "before the interview", which tells us WHEN relative to something else. A word that starts a phrase locating something in time is a PREPOSITION.',
        '"Practiced" — apply the tense test: yesterday Dara practiced, tomorrow Dara will practice. It carries the action, so it is a VERB.',
        '"Carefully" — ask what it modifies. It tells us HOW she practiced, and "practiced" is a verb, so this is an ADVERB.',
        '"And" — it sits between two complete ideas ("Dara practiced her answers" and "her hands finally stopped shaking") and joins them as equals. That is a CONJUNCTION.',
        'Notice the routine never once required a memorized list: each answer came from asking what the word was doing in this sentence.',
      ],
      answer:
        'before = preposition, practiced = verb, carefully = adverb, and = conjunction',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-same-word-three-jobs',
      kind: 'worked_example',
      problem:
        'A student insists that "light" is a noun, full stop. Test that claim against three sentences: "The light above the podium buzzed all evening." / "We light the grill before the guests arrive." / "She packed one light jacket for the trip."',
      steps: [
        'Sentence one: "the light" takes the article "the" and names a thing that buzzed. It is the subject of the verb "buzzed", so here "light" is a NOUN.',
        'Sentence two: run the tense test — yesterday we lit the grill, tomorrow we will light the grill. It carries the action of the sentence, so here "light" is a VERB.',
        'Sentence three: ask what "light" is doing to "jacket". It answers what kind of jacket, and "jacket" is a noun, so here "light" is an ADJECTIVE.',
        'So the student claim is WRONG as stated: "light is a noun" is only true of sentence one. CORRECT version of the claim: "light" can function as a noun, a verb, or an adjective, and the sentence decides which.',
        'The lesson: never answer from the word alone. Cover the word, read what surrounds it, and ask what job the slot needs filled.',
      ],
      answer:
        'Noun in the first sentence, verb in the second, adjective in the third — the same word doing three different jobs.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-home-as-adjective',
      kind: 'try_yourself',
      problem:
        'What part of speech is the word "home" in this sentence? "The debate team reviews its notes before every home match."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'adjective', correct: true },
        { id: 'b', text: 'noun' },
        { id: 'c', text: 'adverb' },
        { id: 'd', text: 'preposition' },
      ],
      expectedAnswer: 'adjective',
      hints: [
        'Do not ask what "home" usually is. Ask what it is doing to the word right after it.',
        '"Home" tells us what kind of match, and "match" is a noun — a word that modifies a noun is an adjective.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ly-trap',
      kind: 'try_yourself',
      problem:
        'What part of speech is the word "friendly" in this sentence? "Her friendly opening line put the whole panel at ease."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'adverb' },
        { id: 'b', text: 'adjective', correct: true },
        { id: 'c', text: 'noun' },
        { id: 'd', text: 'verb' },
      ],
      expectedAnswer: 'adjective',
      hints: [
        'The -ly ending is not evidence. Find the word being modified first.',
        '"Friendly" tells us what kind of line, and "line" is a noun — so despite the -ly, it is an adjective.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-study-as-adjective',
      kind: 'try_yourself',
      problem: 'In which sentence does the word "study" function as an adjective?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The study group meets in the back corner of the library every Thursday.', correct: true },
        { id: 'b', text: 'I study best when the music is turned down low.' },
        { id: 'c', text: 'Her study of the creek behind the school took two years.' },
        { id: 'd', text: 'We reserved the study for the whole afternoon.' },
      ],
      expectedAnswer: 'The study group meets in the back corner of the library every Thursday.',
      hints: [
        'An adjective modifies a noun. Look for the option where "study" sits in front of a noun and tells you what kind.',
        'In one option "study" tells us what kind of group; in another it is the action, and in two more it names a thing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-permanent-labels',
      kind: 'misconception_check',
      question:
        'A student labels "water" a noun in the sentence "We water the tomato plants every Friday" and explains: "water is a thing, so it is always a noun." What went wrong?',
      commonErrors: [
        {
          answer: '"Water" is a noun because water is a thing',
          misconception: 'Treating parts of speech as permanent labels attached to words rather than jobs done inside a sentence.',
          correctsTo:
            'The label comes from the job, not the dictionary. Here "water" passes the tense test — yesterday we watered the plants, tomorrow we will water them — so it is the VERB of the sentence. It would be a noun in "The water tasted like pennies."',
        },
        {
          answer: '"Every" is an adverb because it tells when we do it',
          misconception: 'Assigning adverb to any word that seems to add information, without checking what word is actually modified.',
          correctsTo:
            '"Every" modifies the noun "Friday", not the verb, so it is an ADJECTIVE answering how many. The phrase "every Friday" as a whole tells when, but the individual word still does an adjective job.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A part of speech is a JOB in one sentence, not a permanent label — ask "what is this word doing here?" every single time.',
        'Nouns and pronouns name; verbs pass the tense test; adjectives modify nouns; adverbs modify verbs, adjectives, and other adverbs.',
        'Prepositions open locating phrases, conjunctions join, interjections stand alone as bursts of feeling.',
        'The -ly ending proves nothing: "lovely" and "friendly" are adjectives, and "fast", "early", and "hard" are adverbs with no -ly.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Parts of Speech in Action' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
