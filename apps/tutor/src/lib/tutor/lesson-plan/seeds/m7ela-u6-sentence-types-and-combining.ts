/**
 * Grade 7 ELA — Sentence Structure: Sentence Types & Combining.
 *
 * Procedure-led (CCSS L.7.1b). Two counts name every sentence: how many
 * independent clauses, how many dependent clauses. But L.7.1b is not a
 * labeling standard — it is about SIGNALING RELATIONSHIPS, so the lesson
 * spends most of its air on the second half: when you combine two choppy
 * sentences, the joining word you pick tells the reader how the ideas
 * relate, and the wrong one misleads even when the punctuation is perfect.
 *
 * The three traps it is built to kill are "long means compound", "a comma
 * means compound", and "compound means two of anything" (a compound SUBJECT
 * does not make a compound SENTENCE).
 *
 * NOTE FOR FUTURE AUTHORS: every incorrect example in this file is labeled
 * WRONG, with the CORRECT version beside it. A tutor reads these aloud, and
 * an unlabeled bad sentence would be presented to the student as a model.
 * Vocabulary is deliberately identical to m7ela-u6-fragments-and-run-ons,
 * the lesson that follows this one: independent clause, dependent clause,
 * starter word, and the joining words for, and, nor, but, or, yet, so.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U6_SENTENCE_TYPES_AND_COMBINING: LessonPlan = {
  id: 'evelyn.ms.m7ela.sentence-types-and-combining.v1',
  title: 'Sentence Types & Combining',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.sentence-types-and-combining',
      standard: 'M7ELA-6.2',
      description:
        'Name simple, compound, complex and compound-complex sentences by counting independent and dependent clauses, and combine short related sentences by choosing the joining word that signals the real relationship between the ideas (CCSS L.7.1b).',
    },
  ],
  prerequisites: ['m7ela.phrases-and-clauses'],
  followUps: ['m7ela.fragments-and-run-ons'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that combining sentences is how a writer tells the reader how ideas connect, using a story a twelve-year-old would actually tell.',
      script:
        'Here is somebody telling you about their Saturday. "We rode to the skate park. It was closed. We rode home." Three little sentences, and every single connection is missing. You have to guess whether the closing was a surprise, whether they were upset, whether one thing caused the next. Now listen to the same three facts joined up. "We rode all the way to the skate park, but it was closed, so we rode home." Nothing new was added. The joining words did the work. The word but told you they were disappointed, and the word so told you why they turned around. Today you learn the four shapes a sentence can take, and you learn to pick the joining word that says what you actually mean.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sentence-types',
      kind: 'concept',
      goal: 'Install the two-count method for naming the four sentence types, then teach that the joining word carries the meaning.',
      keyIdeas: [
        'EVERY SENTENCE IS BUILT FROM CLAUSES, AND THERE ARE TWO KINDS. An INDEPENDENT clause has a subject, a verb, and a finished thought, so it could stand alone: "Devon fixed the chain." A DEPENDENT clause has a subject and a verb, but a starter word holds the thought open, so it cannot stand alone: "because the chain kept slipping." The starter words are because, although, when, since, if, while, after, before and unless. Count the two kinds and the name of the sentence falls right out.',
        'THE FOUR TYPES, BY THE COUNT. SIMPLE = one independent clause and no dependent clause: "Devon fixed the chain on my bike." COMPOUND = two or more independent clauses joined correctly: "Devon fixed the chain, and I pumped up the tires." COMPLEX = one independent clause plus at least one dependent clause: "Because the chain kept slipping, Devon flipped my bike over." COMPOUND-COMPLEX = two or more independent clauses plus at least one dependent clause: "Because the chain kept slipping, Devon flipped my bike over, and I held the pedal still."',
        'JOINING TWO INDEPENDENT CLAUSES TAKES REAL EQUIPMENT. Use a comma plus a joining word from for, and, nor, but, or, yet, so. Or use a semicolon. A comma all by itself is not strong enough. WRONG: "Devon fixed the chain, I pumped up the tires." CORRECT: "Devon fixed the chain, and I pumped up the tires." For a dependent clause the rule is different: put it FIRST and it takes a comma after it, put it LAST and it usually takes none. CORRECT: "When the rain stopped, we rode out." CORRECT: "We rode out when the rain stopped."',
        'THE JOINING WORD CARRIES MEANING, AND THAT IS THE WHOLE POINT. But signals contrast. So signals result. And signals addition. Or signals a choice. Because signals cause, and although signals that something happened anyway. Pick the wrong one and you mislead the reader even though your punctuation is perfect. WRONG: "It rained all morning, so we still played the whole game." That tells the reader the rain caused them to play. CORRECT: "It rained all morning, but we still played the whole game."',
        'COMBINING IS A CHOICE ABOUT EMPHASIS TOO. Whatever you put in the independent clause is what the reader remembers, and the dependent clause fades into the background. "Although we lost, the crowd stayed for every minute" is about the crowd. "Although the crowd stayed for every minute, we lost" is about the loss. Same two facts, different point. Decide which idea matters most, then make THAT one the independent clause.',
        'COMPOUND DOES NOT MEAN TWO OF ANYTHING. A compound SUBJECT is two people sharing one verb, and the sentence is still SIMPLE: "Maya and Devon left early" has one clause. A compound VERB is one subject doing two things, and that sentence is SIMPLE as well: "Maya washed the dishes and dried them." No comma goes before that "and". Before you call a sentence compound, check that each side of the joining word has its own subject AND its own verb.',
      ],
      vocabulary: [
        { term: 'independent clause', definition: 'a group of words with a subject and a verb that finishes its thought and could stand alone as a sentence.' },
        { term: 'dependent clause', definition: 'a clause held open by a starter word such as because or although, so it cannot stand alone.' },
        { term: 'starter word', definition: 'a word such as because, although, when, since, if, while, after, before or unless that turns a clause into a dependent clause.' },
        { term: 'joining word', definition: 'one of for, and, nor, but, or, yet, so, used with a comma to join two independent clauses.' },
        { term: 'compound-complex sentence', definition: 'a sentence with two or more independent clauses plus at least one dependent clause.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-the-type',
      kind: 'worked_example',
      problem:
        'Name the sentence type. "When the power went out, my dad lit two candles, and my little brother laughed at the shadows on the wall."',
      steps: [
        'Find every subject-and-verb pair first. There are three: "the power went out", "my dad lit two candles", and "my little brother laughed at the shadows on the wall".',
        'Check pair one for a starter word. It opens with "When", so the thought is held open and the clause cannot stand alone. That is one DEPENDENT clause.',
        'Test pair two on its own. "My dad lit two candles." Subject, verb, finished thought. That is an INDEPENDENT clause.',
        'Test pair three on its own. "My little brother laughed at the shadows on the wall." Also independent. So there are two independent clauses, and they are joined the legal way, with a comma plus the joining word "and".',
        'Read off the count. Two independent plus one dependent is COMPOUND-COMPLEX.',
        'Notice the comma after "out". The dependent clause came first, so it takes a comma after it. If you flipped it to the end you would drop that comma: "My dad lit two candles when the power went out."',
      ],
      answer:
        'Compound-complex — one dependent clause ("When the power went out") plus two independent clauses joined by a comma and "and".',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-combine-choose-the-word',
      kind: 'worked_example',
      problem:
        'Combine these so the reader can tell how the ideas relate. "Our team practiced every morning for a month. We lost the first game." A student turned in this: "Our team practiced every morning for a month, we lost the first game." Is that right?',
      steps: [
        'Test each side of the comma alone. "Our team practiced every morning for a month." Complete sentence. "We lost the first game." Complete sentence. So this is two independent clauses.',
        'Two independent clauses held together by only a comma is a comma splice. The draft is WRONG: "Our team practiced every morning for a month, we lost the first game." A comma by itself cannot do that job.',
        'Do not reach for punctuation yet. Name the relationship first. All that practice should have produced a win, and it did not. That is contrast, not result.',
        'So the joining word "so" would be WRONG here: "Our team practiced every morning for a month, so we lost the first game." Read that back. It tells the reader the practicing CAUSED the loss, which is not what happened.',
        'The word "but" signals contrast, so it fits. CORRECT: "Our team practiced every morning for a month, but we lost the first game." That is a compound sentence: two independent clauses, comma plus a joining word.',
        'A complex sentence works too, and it shifts the emphasis. CORRECT: "Although our team practiced every morning for a month, we lost the first game." The starter word "Although" pushes the practice into the background and leaves the loss out front. Both versions are correct. Pick the one that says what you want the reader to walk away with.',
      ],
      answer:
        'The draft is a comma splice. CORRECT: "Our team practiced every morning for a month, but we lost the first game." (compound), or "Although our team practiced every morning for a month, we lost the first game." (complex).',
      estimatedMinutes: 3,
    },
    {
      id: 'try-combine-relationship',
      kind: 'try_yourself',
      problem:
        'Which version joins these two sentences correctly and shows how the ideas really relate? "We practiced the routine for three weeks. Our group forgot the ending on stage."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'We practiced the routine for three weeks, so our group forgot the ending on stage.' },
        { id: 'b', text: 'We practiced the routine for three weeks, but our group forgot the ending on stage.', correct: true },
        { id: 'c', text: 'We practiced the routine for three weeks, our group forgot the ending on stage.' },
        { id: 'd', text: 'We practiced the routine for three weeks, and our group forgot the ending.' },
      ],
      expectedAnswer: 'We practiced the routine for three weeks, but our group forgot the ending on stage.',
      hints: [
        'Name the relationship before you pick a word. Three weeks of practice should have stopped the mistake, and it did not. Is that cause, or is that contrast?',
        'Check the other three for real problems: one says the practicing caused the mistake, one uses a comma with no joining word at all, and one quietly drops where the mistake happened.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-the-compound',
      kind: 'try_yourself',
      problem: 'Which sentence is a COMPOUND sentence?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Maya and Devon carried the props to the stage.' },
        { id: 'b', text: 'Maya carried the props to the stage, and Devon taped the cords down.', correct: true },
        { id: 'c', text: 'After Maya carried the props to the stage, Devon taped the cords down.' },
        { id: 'd', text: 'Maya carried the props to the stage and taped the cords down.' },
      ],
      expectedAnswer: 'Maya carried the props to the stage, and Devon taped the cords down.',
      hints: [
        'A compound sentence needs TWO independent clauses, so cover the joining word and check that each side has its own subject and its own verb.',
        'Option a has two people sharing one verb, which is a compound subject in one simple sentence. Option c opens with the starter word "After", which makes that clause dependent. Option d has one subject doing two things.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pick-the-joining-word',
      kind: 'try_yourself',
      problem:
        'Which version signals the relationship correctly? "The pool closed for repairs on Monday. Our swim meet moved to the gym."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The pool closed for repairs on Monday, but our swim meet moved to the gym.' },
        { id: 'b', text: 'The pool closed for repairs on Monday, or our swim meet moved to the gym.' },
        { id: 'c', text: 'The pool closed for repairs on Monday, so our swim meet moved to the gym.', correct: true },
        { id: 'd', text: 'Although the pool closed for repairs on Monday, our swim meet moved to the gym.' },
      ],
      expectedAnswer: 'The pool closed for repairs on Monday, so our swim meet moved to the gym.',
      hints: [
        'All four are punctuated legally, so punctuation cannot decide this one. Ask what actually happened: did the closed pool CAUSE the move, or did the move happen in spite of it?',
        'But signals contrast, or signals a choice between two things, and although signals that something happened anyway. Only one of these four words signals a result.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-long-or-comma-means-compound',
      kind: 'misconception_check',
      question:
        'A student calls this a compound sentence: "On Friday night my whole family, including my grandmother and the dog, squeezed into one car and drove out to the fireworks." Their reasoning is that it is long, it has commas, and it has an "and" in it. Are they right?',
      commonErrors: [
        {
          answer: 'Yes, it is compound, because it is long and it has commas and an "and".',
          misconception:
            'Using length, commas and the word "and" as the test, instead of counting independent clauses that each have their own subject and verb.',
          correctsTo:
            'Count clauses, not words. There is exactly one subject here, "my whole family", and it runs both verbs: squeezed and drove. That is a compound VERB inside one clause, not a second clause, which is also why no comma belongs before that "and". The words between the commas, "including my grandmother and the dog", have no subject and no verb at all, so they are only a phrase. One independent clause and no dependent clause makes this sentence SIMPLE, however long it runs.',
        },
        {
          answer: 'Yes, because "my grandmother and the dog" is two things, so it is compound.',
          misconception:
            'Hearing "compound" as "two of anything" — treating a pair of nouns, or a compound subject, as if it made a compound sentence.',
          correctsTo:
            'Compound describes the SENTENCE, and a compound sentence needs two independent clauses. "Maya and Devon left early" names two people, but there is one verb and one clause, so that sentence is SIMPLE. CORRECT compound version: "Maya left early, and Devon stayed for the whole game." Now each side of the joining word has its own subject and its own verb.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Name any sentence with two counts. Simple = 1 independent clause. Compound = 2 or more independent. Complex = 1 independent plus at least 1 dependent. Compound-complex = 2 or more independent plus at least 1 dependent.',
        'Join two independent clauses with a comma plus for, and, nor, but, or, yet, so, or with a semicolon. WRONG: "Devon fixed the chain, I pumped up the tires." CORRECT: "Devon fixed the chain, and I pumped up the tires."',
        'A dependent clause placed first takes a comma after it; placed last it usually takes none.',
        'The joining word carries the meaning: but for contrast, so for result, and for addition, or for a choice, because for cause. The wrong word misleads the reader even when the punctuation is right.',
        'Whatever sits in the independent clause is what the reader remembers, so put the idea that matters most there.',
        'Compound does not mean two of anything. "Maya and Devon left early" is SIMPLE. Check that each side of the joining word has its own subject and its own verb.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Sentence Types & Combining' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
