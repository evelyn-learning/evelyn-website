/**
 * Grade 7 ELA — Grammar & Usage: Parts of Speech.
 *
 * Procedure-led (CCSS L.7.1a). One idea runs the whole lesson: a word's part
 * of speech is the JOB it does in the sentence in front of you, not a label
 * stamped on the word for life. "Run" is a verb in one sentence and a noun in
 * the next; "fast" is an adjective in one and an adverb in the next.
 *
 * The four traps it is built to kill: (a) every word has one fixed part of
 * speech you can memorise, (b) anything ending in -ly is an adverb, (c)
 * adjectives only ever sit in front of nouns, (d) is/are/was are not real
 * verbs.
 *
 * NOTE FOR FUTURE AUTHORS: every incorrect claim in this file is labeled
 * WRONG with the CORRECT version beside it. A tutor reads these aloud, and an
 * unlabeled wrong example would be presented to the student as a model.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U5_PARTS_OF_SPEECH: LessonPlan = {
  id: 'evelyn.ms.m7ela.parts-of-speech.v1',
  title: 'Parts of Speech',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.parts-of-speech',
      standard: 'M7ELA-5.1',
      description:
        'Name the eight parts of speech by the job a word performs in one particular sentence, explaining the function of nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions and interjections in specific sentences (CCSS L.7.1a).',
    },
  ],
  prerequisites: ['m7ela.comparing-two-texts'],
  followUps: ['m7ela.subject-verb-agreement'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Install the one idea of the lesson: a part of speech is a job, and the same word can hold different jobs.',
      script:
        'Think about somebody in your family. On a Tuesday morning they might be a driver. At dinner they are a cook. At the rink on Saturday they are a coach. Same person, three different jobs, and which one you call them depends on where they are standing. Words work exactly the same way. Take the word run. In "They run three miles every Saturday", run is the action, so it is a verb. In "She went for a run after dinner", run is a thing you went for, so it is a noun. Nothing about the word changed. The job changed. So today we are not memorising eight lists of words. We are learning one question you ask about any word in any sentence: what job is this word doing right here?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-job-not-label',
      kind: 'concept',
      goal: 'Give the eight jobs, the tests that identify each one, and the two shortcuts that produce wrong answers.',
      keyIdeas: [
        'A PART OF SPEECH IS A JOB, NOT A LABEL. You cannot look a word up and be finished. You have to read the sentence around it. "Run" is a verb in "They run three miles every Saturday" and a noun in "She went for a run after dinner." WRONG: "Run is a verb, so the answer is verb." CORRECT: "In this sentence run names a thing you went for, so here it is a noun."',
        'NOUNS NAME. A noun names a person, a place, a thing or an idea: coach, kitchen, backpack, courage. The quick test is whether you can put the or a in front of it. PRONOUNS stand in for a noun everybody already knows: I, you, he, she, it, we, they, who, everyone, nobody. In "Maya lost her helmet, so she borrowed mine", she takes the place of Maya.',
        'VERBS TELL WHAT HAPPENS OR WHAT IS. Action verbs are easy: kicked, chews, will shout. The test is tense. If you can say it happened yesterday and will happen tomorrow, it is working as a verb. But some verbs show no action at all. The forms of be — am, is, are, was, were — are real verbs, and any one of them can be the only verb in a sentence. In "The gym was empty", the whole verb is was. Helpers count too: in "has been waiting", the three words work together as one verb.',
        'ADJECTIVES DESCRIBE NOUNS, AND THEY DO NOT ALWAYS SIT IN FRONT. An adjective answers which one, what kind or how many about a noun or pronoun: "a red backpack", "three slices", "that seat". It can also come after a form of be and describe the noun back at the front: in "The pizza was cold", cold describes pizza, so cold is an adjective even though it sits at the end.',
        'ADVERBS DESCRIBE VERBS, ADJECTIVES AND OTHER ADVERBS. An adverb answers how, when, where or how much: "she sang loudly" tells how she sang, "we left early" tells when we left, "a very cold night" tells how cold. To name one, find the word it is describing first. If that word is a noun, you are looking at an adjective instead.',
        'THE LAST THREE JOBS, AND THE -LY TRAP. PREPOSITIONS sit in front of a noun and show where, when or how it fits: under the couch, after lunch, with my cousin, by one goal. CONJUNCTIONS join: and, but, or, so, yet join equal parts, while because, although, when, since attach a part that cannot stand alone. INTERJECTIONS are short bursts of feeling that stand apart: Wow, Ouch, Hey. And the trap: the -ly ending never decides anything. WRONG: "Friendly ends in -ly, so it is an adverb." CORRECT: in "a friendly driver", friendly describes the noun driver, so it is an adjective. Lonely and lively work the same way, and fast, hard and soon can all do the adverb job with no -ly at all.',
      ],
      vocabulary: [
        { term: 'part of speech', definition: 'the job a word is doing in one particular sentence — noun, pronoun, verb, adjective, adverb, preposition, conjunction or interjection.' },
        { term: 'modify', definition: 'to describe or narrow another word; adjectives modify nouns and pronouns, adverbs modify verbs, adjectives and other adverbs.' },
        { term: 'linking verb', definition: 'a verb such as am, is, are, was or were that shows no action but connects the subject to a word that describes or renames it.' },
        { term: 'preposition', definition: 'a word placed in front of a noun to show where, when or how that noun fits, such as under, after, with or by.' },
        { term: 'conjunction', definition: 'a word that joins words, phrases or clauses, such as and, but, so, because or although.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-name-five-jobs',
      kind: 'worked_example',
      problem:
        'Name the part of speech of the words Wow, blocked, easily, but and by in this sentence: "Wow, the goalie blocked that shot easily, but our team still lost by one goal."',
      steps: [
        'Start with Wow. It is not attached to anything. It is a burst of feeling sitting on its own in front of the sentence, and the sentence still works if you delete it. That is an INTERJECTION.',
        'Now blocked. Run the tense test: yesterday the goalie blocked the shot, tomorrow the goalie will block the shot. It carries what happened, so it is a VERB.',
        'Now easily. Ask what it is describing. It tells you HOW the goalie blocked the shot, and blocked is a verb, so easily is an ADVERB. Notice the -ly is not the reason. The reason is that it describes a verb.',
        'Now but. Look at what is on each side of it. On the left, "the goalie blocked that shot easily." On the right, "our team still lost by one goal." Two complete thoughts, joined as equals. That is a CONJUNCTION.',
        'Now by. It sits in front of the noun goal and starts the group "by one goal", which tells you by how much the team lost. A word placed in front of a noun to show how it fits is a PREPOSITION.',
        'Every one of those five answers came from the same question, asked five times: what is this word doing here? No memorised list was needed once.',
      ],
      answer:
        'Wow = interjection, blocked = verb, easily = adverb, but = conjunction, by = preposition',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-same-word-two-jobs',
      kind: 'worked_example',
      problem:
        'A student says that run is always a verb and fast is always an adjective. Test both claims. "They run three miles every Saturday." / "She went for a run after dinner." / "Our coach bought a fast bike." / "My cousin talks fast."',
      steps: [
        'Sentence one, the word run. Tense test: yesterday they ran three miles, tomorrow they will run three miles. It carries the action of the sentence, so here run is a VERB.',
        'Sentence two, the same word. This time it has the word a in front of it, and it names the thing she went for. You can even count them: one run, two runs. So here run is a NOUN.',
        'So the first claim is WRONG as stated: "run is always a verb." CORRECT: run works as a verb in the first sentence and as a noun in the second.',
        'Sentence three, the word fast. Ask what it describes. It tells you what kind of bike, and bike is a noun. A word describing a noun is an ADJECTIVE.',
        'Sentence four, the same word again. Here it describes talks, telling you HOW your cousin talks. Talks is a verb, so this time fast is an ADVERB. It has no -ly, and it does not need one.',
        'So the second claim is WRONG too: "fast is always an adjective." CORRECT: fast is an adjective when it describes a noun and an adverb when it describes a verb. Both claims failed for the same reason. They named the word instead of reading the sentence.',
      ],
      answer:
        'run = verb in the first sentence, noun in the second; fast = adjective in the third, adverb in the fourth.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-park-as-verb',
      kind: 'try_yourself',
      problem: 'In which sentence does the word park function as a verb?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'We met at the park after school and stayed until dark.' },
        { id: 'b', text: 'Dad will park the van behind the gym.', correct: true },
        { id: 'c', text: 'The park bench outside the library needed new paint.' },
        { id: 'd', text: 'Our new park opens on Saturday morning.' },
      ],
      expectedAnswer: 'Dad will park the van behind the gym.',
      hints: [
        'Do not ask what park usually is. Run the tense test on each option: could you say it happened yesterday and will happen tomorrow?',
        'In one option park is the thing somebody does to the van. In the others it names a place, or it tells you what kind of bench.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cold-after-linking-verb',
      kind: 'try_yourself',
      problem:
        'What part of speech is the word cold in this sentence? "The pizza was cold by the time we got home."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'adverb' },
        { id: 'b', text: 'noun' },
        { id: 'c', text: 'adjective', correct: true },
        { id: 'd', text: 'verb' },
      ],
      expectedAnswer: 'adjective',
      hints: [
        'Find the word that cold is describing, then look at what job THAT word is doing.',
        'Cold describes the pizza, and pizza is a noun. An adjective does not have to sit in front of its noun; after a form of be it can point back to the subject.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-light-as-adjective',
      kind: 'try_yourself',
      problem: 'In which sentence does the word light function as an adjective?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The light above the kitchen table flickered twice.' },
        { id: 'b', text: 'We light the candles right before dinner.' },
        { id: 'c', text: 'Pack a light jacket for the field trip.', correct: true },
        { id: 'd', text: 'Please turn off the light when you leave.' },
      ],
      expectedAnswer: 'Pack a light jacket for the field trip.',
      hints: [
        'An adjective describes a noun. Look for the option where light tells you what KIND of thing.',
        'In two options light names a thing, and in one it is the action somebody does to the candles. Only one option has it describing a jacket.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-was-and-ly',
      kind: 'misconception_check',
      question:
        'A student looks at the sentence "Our friendly bus driver was late again" and says two things: first, that the sentence has no verb because nobody does anything, and second, that friendly is an adverb because it ends in -ly. What went wrong in each?',
      commonErrors: [
        {
          answer: 'The sentence has no verb, because nobody does anything in it.',
          misconception:
            'Believing a verb has to be a physical action, so forms of be — is, are, was, were — do not count as real verbs.',
          correctsTo:
            'Was IS the verb, and it is the only verb in the sentence. Verbs tell what happens OR what is. Was is a linking verb: it connects the driver to the word that describes the driver, which is late. Run the tense test on it and it still passes: the driver was late yesterday, the driver will be late tomorrow. WRONG: "Our friendly bus driver late again" with the verb removed, which is not a sentence at all. CORRECT: "Our friendly bus driver was late again."',
        },
        {
          answer: 'Friendly is an adverb because it ends in -ly.',
          misconception:
            'Using the -ly ending as the test instead of asking which word is being described.',
          correctsTo:
            'The ending never decides the answer. Friendly describes the noun driver, telling you what kind of driver, so friendly is an ADJECTIVE. Lonely and lively behave the same way: "a lonely dog", "a lively puppy". Meanwhile fast, hard and soon do the adverb job with no -ly at all, as in "my cousin talks fast". Always find the word being described first, then name the job.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A part of speech is the JOB a word does in one sentence, not a label the word carries around. Ask what is this word doing here, every single time.',
        'Run is a verb in "They run three miles every Saturday" and a noun in "She went for a run after dinner." Fast is an adjective in "a fast bike" and an adverb in "my cousin talks fast."',
        'Nouns name; pronouns stand in for nouns; verbs pass the tense test; adjectives describe nouns; adverbs describe verbs, adjectives and other adverbs.',
        'Prepositions sit in front of a noun to show how it fits, conjunctions join, interjections stand apart as bursts of feeling.',
        'Am, is, are, was and were are real verbs. WRONG: "The gym was empty has no verb." CORRECT: was is the verb, and empty is an adjective describing the gym.',
        'The -ly ending proves nothing. Friendly and lonely are adjectives; fast, hard and soon can all be adverbs. Find the word being described, then name the job.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Parts of Speech' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
