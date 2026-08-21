/**
 * Grade 7 ELA — Informational Reading: Domain-Specific Vocabulary.
 *
 * Procedure-led (CCSS RI.7.4). The whole lesson lives in one gap: a word the
 * student has known since kindergarten (table, cell, current, root, volume,
 * product, matter) turns around and carries an exact, different meaning
 * inside a subject. The method is three steps — name the subject, run the
 * substitute test on the sentence, then take the definition the text offers.
 *
 * NOTE FOR FUTURE AUTHORS: in every practice item the strongest distractor is
 * the EVERYDAY meaning of the same word. That is deliberate — it is the named
 * student error this lesson exists to kill, and an item without it is not
 * testing this skill. Every excerpt is original prose written for its item,
 * and every technical definition asserted here was checked for accuracy.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U3_TECHNICAL_AND_DOMAIN_VOCABULARY: LessonPlan = {
  id: 'evelyn.ms.m7ela.technical-and-domain-vocabulary.v1',
  title: 'Domain-Specific Vocabulary',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.technical-and-domain-vocabulary',
      standard: 'M7ELA-3.4',
      description:
        'Determine the meaning of technical and domain-specific words in an informational text, especially familiar words whose everyday meaning differs from the meaning the subject uses, by naming the subject, testing the word against the surrounding sentence, and using definitions the text supplies (CCSS RI.7.4).',
    },
  ],
  prerequisites: ['m7ela.text-features-and-graphics'],
  followUps: ['m7ela.text-structure'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open the everyday-versus-technical gap with one word the student cannot possibly get wrong in daily life.',
      script:
        'Picture this. Before the picnic, somebody texts the group chat: "Somebody bring a table." Everybody knows exactly what to grab. Now picture your science teacher saying the same three words on Monday morning: "Somebody bring a table." Nobody is dragging furniture up the stairs. She wants a chart, with rows and columns and numbers in it. Same word, same spelling, two completely different things to go find. That flip happens all over the books you read for school. Words you have known since you were four turn around and mean something exact and different inside a subject. If you keep using the meaning you already had, you can read an entire paragraph wrong and never once notice that you did.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-domain-vocabulary',
      kind: 'concept',
      goal: 'Define domain-specific vocabulary, expose the familiar-word trap, and install the three-step method for settling which meaning is in use.',
      keyIdeas: [
        'A DOMAIN IS JUST A SUBJECT AREA — science, math, music, cooking, basketball. Domain-specific vocabulary means words that carry one exact meaning inside that subject, a meaning everybody working in the subject agrees on. Photosynthesis and denominator are obvious ones. Those are not the ones that fool people.',
        'THE TRAP IS THE WORD YOU ALREADY KNOW. Some words have an everyday meaning AND a technical meaning, and the two are not close. Table: furniture, or a chart of rows and columns. Current: happening now, or water and electricity that is flowing. Cell: a small room, or the smallest unit of a living thing. Volume: how loud something is, or how much space something takes up. Product: something a store sells, or the answer you get when you multiply. Root: the part of a plant underground, or the base part of a word. Matter: to be important, or anything that has mass and takes up space.',
        'STEP ONE, NAME THE SUBJECT YOU ARE READING IN. Before you decide what a word means, decide where you are. A science article, a math lesson, a lesson about words, a music page. Then ask the real question: which meaning does THIS subject use? The subject picks the meaning, and you can usually tell the subject from the title or the first line.',
        'STEP TWO, RUN THE SUBSTITUTE TEST. Drop the everyday meaning into the sentence and read it out. If the sentence goes strange, breaks, or says something nobody would ever say, the technical meaning is the one in use. "Turn to the furniture on page 12" breaks instantly, and that broken sound is the signal.',
        'STEP THREE, TAKE THE HELP THE TEXT OFFERS. Informational writers know these words are hard, so they hand you the meaning. Watch for the words is, means, is called or or; for a phrase tucked inside commas, dashes or parentheses; for a word printed in bold, which usually points to a glossary; and for the glossary itself at the back. If the text defines the word, stop guessing and use the definition it gave you.',
        'SHORT WORDS ARE TECHNICAL WORDS TOO. Table, cell, root, matter, volume, product and current are seven letters or fewer and every one of them is ordinary. Length and fanciness tell you nothing. The signal that a word is being used technically is the SUBJECT it appears in, not how hard it looks on the page.',
      ],
      vocabulary: [
        { term: 'domain', definition: 'a subject area, such as science, math or music, that has its own set of exact words.' },
        { term: 'domain-specific vocabulary', definition: 'words that carry one exact meaning inside a subject, even when the same word means something else in everyday talk.' },
        { term: 'technical meaning', definition: 'the precise meaning a word has inside its subject, agreed on by everyone working in that subject.' },
        { term: 'everyday meaning', definition: 'the meaning a word has in ordinary talk outside any subject.' },
        { term: 'context', definition: 'the words and sentences around a word, which show which meaning is in use.' },
        { term: 'glossary', definition: 'a short list of subject words and their meanings, usually at the back of a book or inside a box on the page.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-current-substitute-test',
      kind: 'worked_example',
      problem:
        'A notice at a swimming beach says: "Do not swim past the orange buoy. The current there moves fast enough to carry a strong swimmer out past the pier." What does the word current mean in that notice?',
      steps: [
        'Start with the meaning you already carry. In everyday talk, current means happening right now, as in the current score or the current week. That meaning arrives first, so hold it up against the sentence before you trust it.',
        'Run the substitute test. Put the everyday meaning in: "The happening-right-now there moves fast enough to carry a strong swimmer." That is not something anyone would say. Everyday current describes a thing, and this current IS a thing that moves. The everyday meaning does not fit.',
        'Name the subject. This is a safety notice about swimming in open water, so the subject is water and the way water moves. Now ask the real question: what does current name inside that subject?',
        'Read what the sentence says the current DOES. It moves, and it can carry a swimmer out past the pier. Only moving water could carry a swimmer at a beach, so the current has to be water that is going somewhere.',
        'State the technical meaning: a current is water flowing steadily in one direction. The same word does the same job in other subjects. In an electricity lesson, a current is electric charge flowing through a wire, which is the same idea of steady flow inside a different subject.',
        'Check the answer back against the notice. Water flowing steadily in one direction would absolutely pull a swimmer past the pier, so the technical meaning fits every word of the sentence and the everyday meaning fits none of it.',
      ],
      answer:
        'Current here means water that is flowing steadily in one direction. It does not mean the everyday happening right now, because that meaning breaks the sentence.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-table-subject-and-details',
      kind: 'worked_example',
      problem:
        'A science article says: "Turn to the table on page 12. It lists how many inches of rain fell each month, with the months down the left side and the years across the top." What does the word table mean here, and how can you tell?',
      steps: [
        'Name the everyday meaning first, out loud. A table is furniture: a flat top with legs, the thing you eat dinner on. That is the meaning most readers reach for, and it is the one to test.',
        'Run the substitute test. "Turn to the furniture on page 12." A page cannot hold furniture. The sentence breaks in three words, which is the signal that the technical meaning is in use.',
        'Name the subject. You are reading a science article and being sent to a page, so the subject is how information is laid out inside a text. Charts, maps and diagrams live there.',
        'Use the details the sentence already gave you. It says the table LISTS inches of rain, with months down the left side and years across the top. Something going down the side and something going across the top is a description of rows and columns.',
        'State the technical meaning: a table is information arranged in rows and columns so a reader can find one exact number fast. To read this one you would slide down to the month you want and across to the year you want, and the rainfall sits where they meet.',
        'Notice one more thing, because it is the point of the whole lesson. Table is short, common, and a word you learned as a toddler, and it is still a technical term here. Short never means simple.',
      ],
      answer:
        'A table is information arranged in rows and columns, here rainfall by month and by year. The sentence proves it: a page can hold a chart but not a piece of furniture, and rows and columns are described directly.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-product-in-math',
      kind: 'try_yourself',
      problem:
        'A math notebook page reads: "We wrote 6 x 4 = 24 on the board. Mr. Alvarez pointed at the 24 and said that number is the product, then asked us for the product of 7 and 5." In that page, what does the word product mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'something a company makes and sells in a store' },
        { id: 'b', text: 'the number you get when you multiply two numbers', correct: true },
        { id: 'c', text: 'the number you get when you add two numbers' },
        { id: 'd', text: 'the two numbers that are being multiplied together' },
      ],
      expectedAnswer: 'the number you get when you multiply two numbers',
      hints: [
        'Name the subject first. This is math, so ask what product means inside math. Then look at exactly what the teacher pointed at: he wrote 6 x 4 = 24 and called the 24 the product.',
        'One choice is the everyday store meaning. One names the 6 and the 4 instead of the 24. One describes adding, and the board says multiply. Only one choice describes what the 24 is in 6 x 4 = 24.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-root-in-word-study',
      kind: 'try_yourself',
      problem:
        'A word-study handout says: "The words biology, biography and antibiotic all share the root bio, which came from an old Greek word for life. Once you know that root, a word you have never seen before stops being a total mystery." In that handout, what does the word root mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'the part of a plant that grows underground and takes in water' },
        { id: 'b', text: 'the base part of a word that other words are built from', correct: true },
        { id: 'c', text: 'a group of letters added to the end of a word to change its meaning' },
        { id: 'd', text: 'the main cause of a problem' },
      ],
      expectedAnswer: 'the base part of a word that other words are built from',
      hints: [
        'Name the subject. This handout is about words, not about gardens, so ask what root would name inside a lesson about how words are built.',
        'The sentence says three words SHARE bio and that bio came from a Greek word for life. Bio is the piece all three words are built around. One choice is the plant meaning, one describes an ending instead of a base, and one is the everyday phrase about problems.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-volume-in-science',
      kind: 'try_yourself',
      problem:
        'A science journal entry says: "Ms. Reyes poured the juice from a short wide glass into a tall thin glass. The volume stayed exactly the same, she told us, even though the juice looked like more in the tall glass." In that entry, what does the word volume mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'how loud a sound is' },
        { id: 'b', text: 'the amount of space the juice takes up', correct: true },
        { id: 'c', text: 'how high the juice rises inside the glass' },
        { id: 'd', text: 'one book out of a numbered set of books' },
      ],
      expectedAnswer: 'the amount of space the juice takes up',
      hints: [
        'The everyday meaning of volume is about sound, and there is no sound anywhere in this entry. Name the subject instead: a science teacher is pouring juice from one glass into another.',
        'The entry says the volume stayed exactly the same even though the juice LOOKED like more in the tall glass. So volume cannot be the height it reaches. Ask what did not change when the juice moved glasses.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-i-already-know-that-word',
      kind: 'misconception_check',
      question:
        'A student is reading a science article that says: "Scientists measured the current in the stream every hour for a week." The student says, "I already know that word. Current means happening now, so they measured what the stream was doing right at that moment." What went wrong?',
      commonErrors: [
        {
          answer: 'Nothing went wrong. I already know the word current, so I already know what it means here.',
          misconception:
            'Believing that knowing a word in everyday talk means knowing it inside a subject. The familiar meaning arrives so fast that the reader never stops to check it against the sentence.',
          correctsTo:
            'The everyday meaning does not survive the sentence. Substitute it in and listen: "Scientists measured the happening-now in the stream every hour for a week." Nobody can measure a happening-now. In a science article about a stream, current names water that is flowing steadily in one direction, so the scientists were measuring how fast the water was flowing. Knowing a word from everyday life is where the check STARTS, never where it ends. Name the subject, then ask which meaning that subject uses.',
        },
        {
          answer: 'Current cannot be a technical word anyway. Technical words are long and scientific, and current is short and normal.',
          misconception:
            'Using the length or the fanciness of a word to decide whether it is technical, so the reader scans for big words and walks straight past the short ones.',
          correctsTo:
            'Length proves nothing at all. Table, cell, root, matter, volume, product and current are all short, ordinary words, and every one of them carries an exact technical meaning inside some subject. A cell is the smallest unit of a living thing. Matter is anything that has mass and takes up space. A product is the answer you get when you multiply. The signal that a word is technical is the SUBJECT it appears in, not the number of letters in it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A domain-specific word carries one exact meaning inside its subject, and the same word can mean something completely different in everyday talk.',
        'Step one: name the subject you are reading in, then ask which meaning THAT subject uses.',
        'Step two: run the substitute test. Drop the everyday meaning into the sentence. If the sentence breaks or goes strange, the technical meaning is the one in use.',
        'Step three: take the help the text offers. Look for a definition after is, means or is called, a phrase inside commas, dashes or parentheses, a word printed in bold, or the glossary.',
        'Short common words are technical words too. Table, cell, root, matter, volume, product and current all have exact meanings inside a subject.',
        'Knowing a word from everyday life is where the check starts, not where it ends.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'Domain-Specific Vocabulary' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
