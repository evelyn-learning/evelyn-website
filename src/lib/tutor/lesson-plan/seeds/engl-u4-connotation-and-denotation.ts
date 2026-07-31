/**
 * HS English — Language & Vocabulary: Connotation & Denotation.
 *
 * The word-choice skill behind tone (CCSS L.9-10.5, L.9-10.5.b): separate a
 * word's dictionary meaning from the feeling it carries, place near-synonyms
 * on a positive/neutral/negative ladder, and pick the rung that matches the
 * intended effect. All example sentences are short ORIGINAL prose written for
 * this lesson — no copyrighted quotations, no external passages.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U4_CONNOTATION_AND_DENOTATION: LessonPlan = {
  id: 'evelyn.hs.engl.connotation-and-denotation.v1',
  title: 'Connotation & Denotation',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.connotation-and-denotation',
      standard: 'ENGL-4.2',
      description:
        'Distinguish a word\'s denotation from the positive, neutral, or negative connotation it carries in context, and choose deliberately among near-synonyms such as thrifty, cheap, and economical to produce an intended effect on the reader (CCSS L.9-10.5, L.9-10.5.b).',
    },
  ],
  prerequisites: ['engl.precision-and-concision'],
  followUps: ['engl.tone-and-register'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that two words with the same dictionary meaning can deliver opposite verdicts — connotation is the lever writers pull on readers.',
      script:
        'Describe someone as confident and people want to work with them. Describe the exact same person as arrogant and people avoid them. Nothing about the person changed — only the word did. Both words point at a person who is sure of themselves, so the dictionary barely separates them, but the feeling attached to each one delivers a verdict. Headline writers, letter writers, and anyone asking for something they really want all live on that difference. Today you learn to hear it on purpose, so the words you pick say what you actually mean.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-charge',
      kind: 'concept',
      goal: 'Denotation versus connotation, synonym ladders, how surrounding context shifts a word\'s charge, and how loaded words steer readers.',
      keyIdeas: [
        'DENOTATION — the literal, dictionary meaning of a word: the definition you would find printed in an entry. "Thrifty," "cheap," and "economical" share almost the same denotation: spending little money.',
        'CONNOTATION — the emotional charge a word carries on top of that definition: the approval, disapproval, or neutrality a reader feels. "Thrifty" praises, "cheap" criticizes, "economical" simply reports. Same denotation, three different verdicts.',
        'THE SYNONYM LADDER — near-synonyms line up on a ladder from positive to neutral to negative. Slender / thin / scrawny. Determined / persistent / stubborn. Curious / inquisitive / nosy. Frugal / economical / stingy. Naming the rungs is how a writer chooses instead of guessing.',
        'NEUTRAL IS A CHOICE TOO — the middle rung is not the absence of a decision. News reporting, lab writing, and formal analysis deliberately climb to the neutral rung so readers judge the facts rather than the wording.',
        'CONNOTATION SHIFTS WITH CONTEXT — charge is not welded to a word; the surrounding sentence bends it. "Aggressive" is an insult in "an aggressive coworker" and a compliment in "an aggressive treatment plan that saved the patient." Always test the word inside its actual sentence, not alone.',
        'LOADED WORDS STEER READERS — writers push judgment onto readers by swapping in charged near-synonyms while the facts stay identical. "A crowd gathered outside city hall" and "a mob gathered outside city hall" report the same event and argue opposite things. Spotting the swap is how you read persuasion instead of absorbing it.',
        'MATCH THE WORD TO THE INTENDED EFFECT — the working question is never "is this word correct?" but "what does this word make my reader feel about my subject?" Decide the effect first, then pick the rung that produces it.',
      ],
      vocabulary: [
        { term: 'denotation', definition: 'the literal dictionary meaning of a word, stripped of any feeling attached to it.' },
        { term: 'connotation', definition: 'the positive, neutral, or negative emotional charge a word carries beyond its literal meaning.' },
        { term: 'loaded word', definition: 'a word chosen for its charge in order to push the reader toward a judgment the facts alone would not deliver.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-ladder-choice',
      kind: 'worked_example',
      problem:
        'A student is writing a profile of a classmate who refused to abandon a recycling proposal after the student council rejected it twice. The student wants readers to admire her. Which word belongs in the blank? "Even after two rejections, Amara remained ___ about the recycling proposal." Options: steadfast, stubborn, obstinate, pigheaded.',
      steps: [
        'Check the denotation first: all four words describe a person who refuses to change position. On dictionary meaning alone, every option is defensible, so denotation cannot decide this.',
        'Name the intended effect: the writer wants readers to ADMIRE Amara. That means the blank needs a positive rung, not a neutral or negative one.',
        'Sort the ladder by charge: "steadfast" is positive (loyal to a worthy goal); "stubborn" is mildly negative; "obstinate" is more negative and formal; "pigheaded" is bluntly insulting.',
        'Select and test the word in the full sentence: "Even after two rejections, Amara remained STEADFAST about the recycling proposal." The sentence now praises her persistence, which is the effect the writer wanted. The three rejected options report the same behavior but blame her for it.',
      ],
      answer: 'steadfast — the only positive rung on a ladder whose four words share the denotation "refusing to change position"',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-wrong-charge',
      kind: 'worked_example',
      problem:
        'A student wants to compliment a coach in a thank-you note and writes: "Coach Ruiz was relentless about our warm-up routine, and she was a fanatic about safety gear." The student is surprised when a reader calls the note unflattering. What went wrong, and how should the sentence be revised?',
      steps: [
        'Diagnose the error class: the student picked words whose DENOTATION was right and whose CONNOTATION was wrong. "Relentless" and "fanatic" both accurately denote someone who never lets up, so the student heard nothing wrong.',
        'Test each word for charge in context. "Relentless" describes pressure that does not stop, and applied to a person supervising teenagers it reads as wearing rather than caring. "Fanatic" is stronger still: it denotes intense devotion but connotes loss of proportion, which turns a safety habit into an obsession.',
        'Name the intended effect: gratitude. The note should make readers hear care and high standards, so both blanks need positive rungs.',
        'Climb the ladder and revise: relentless becomes "consistent" or "unwavering"; fanatic becomes "meticulous" or "vigilant." Revised: "Coach Ruiz was unwavering about our warm-up routine, and she was meticulous about safety gear." The facts did not change at all — only the verdict the reader hears.',
      ],
      answer:
        'The student chose right-denotation, wrong-charge words; swapping "relentless" for "unwavering" and "fanatic" for "meticulous" keeps the meaning and delivers the intended praise',
      estimatedMinutes: 3,
    },
    {
      id: 'try-negative-charge',
      kind: 'try_yourself',
      problem:
        'A writer wants readers to disapprove of how a committee handled a budget review. Read the sentence frame: "The committee spent three hours ___ every line of the department budget." Which word gives the sentence a negative connotation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'examining' },
        { id: 'b', text: 'nitpicking', correct: true },
        { id: 'c', text: 'reviewing' },
        { id: 'd', text: 'studying' },
      ],
      expectedAnswer: 'nitpicking',
      hints: [
        'All four words denote looking closely at something. Ask which one adds a judgment about whether that close look was worth the time.',
        'Three options are neutral report words. One implies the committee fussed over trivial details.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-intended-effect',
      kind: 'try_yourself',
      problem:
        'Read the excerpt from a recommendation letter: "Devin managed the drama club budget for two years. He rented costumes instead of buying them and returned every unused prop, finishing both seasons under budget." The writer wants to PRAISE Devin for spending carefully. Which word best completes the next sentence for that intended effect? "Devin is ___ with money entrusted to him."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'cheap' },
        { id: 'b', text: 'stingy' },
        { id: 'c', text: 'thrifty', correct: true },
        { id: 'd', text: 'miserly' },
      ],
      expectedAnswer: 'thrifty',
      hints: [
        'Every choice denotes spending little money, so denotation cannot separate them. Sort them by charge instead.',
        'Three of the four accuse Devin of withholding money he should spend. Only one credits him with using it wisely.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-neutral-in-context',
      kind: 'try_yourself',
      problem:
        'Read the excerpt from a news report: "About two hundred people gathered outside the transit office on Tuesday morning to oppose the fare increase. The ___ stayed until the board adjourned at noon." The reporter must let readers judge the event for themselves. Which word keeps the sentence neutral?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'mob' },
        { id: 'b', text: 'crowd', correct: true },
        { id: 'c', text: 'horde' },
        { id: 'd', text: 'swarm' },
      ],
      expectedAnswer: 'crowd',
      hints: [
        'All four words denote a large group of people in one place. Ask which one adds no verdict about that group.',
        'Three options imply the group was menacing, unruly, or subhuman. Neutral reporting needs the rung that reports size and nothing else.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-synonyms-interchangeable',
      kind: 'misconception_check',
      question:
        'A student defends the sentence "My grandmother is a hoarder of buttons and thread" by saying: "The thesaurus lists hoarder as a synonym for collector, so the words mean the same thing and either one works." What went wrong?',
      commonErrors: [
        {
          answer: 'Synonyms mean the same thing, so any synonym can be swapped in without changing the sentence',
          misconception: 'Treating a thesaurus list as a set of interchangeable equals, and checking only denotation while ignoring connotation.',
          correctsTo:
            'Synonyms share a denotation, not a charge. "Collector" credits the grandmother with care and purpose; "hoarder" implies she cannot let go of things and that the pile is a problem. A thesaurus entry is a list of candidates on a ladder, never a list of equals — test each candidate inside the actual sentence and pick the rung that matches the effect you want.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Denotation is the dictionary meaning; connotation is the positive, neutral, or negative charge the word carries on top of it.',
        'Near-synonyms sit on a ladder — thrifty / economical / cheap — so decide the effect you want first, then pick the rung that produces it.',
        'Charge shifts with context: test the word inside its actual sentence, because "aggressive coworker" and "aggressive treatment" pull opposite ways.',
        'Loaded words argue while pretending to report — swapping "crowd" for "mob" changes no facts and changes every verdict, in your writing and in what you read.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Connotation & Denotation' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
