/**
 * Grades 3-5 ELA — Summarizing.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_SUMMARIZING: LessonPlan = {
  id: 'evelyn.g35.ela.summarizing.v1',
  title: 'Grades 3-5 ELA — Summarizing',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.summarizing',
      description: 'Summarize a text by identifying the main idea and key supporting details, expressing them concisely in your own words.',
      standard: 'CCSS.ELA-LITERACY.RI.4.2',
    },
  ],
  prerequisites: ['g35.ela.text-features'],
  followUps: ['g35.ela.paragraph-structure'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Summarizing is a "shrink ray" for text — turn 500 words into 50 without losing meaning.',
      script: 'A friend asks "What was that book about?" If you re-tell every detail, they\'ll stop listening. A good summary captures the heart of the story in a few sentences. Today we learn the recipe.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-summary',
      kind: 'concept',
      goal: 'Difference between summary, retelling, and main idea + summarising methods.',
      keyIdeas: [
        'SUMMARY: a SHORT, ACCURATE description of the most important points. Usually 1/4 to 1/10 of the original length.',
        'NOT a summary: copying sentences from the text, including every detail, or quoting long passages.',
        'STORY (FICTION) FRAMEWORK — Somebody, Wanted, But, So, Then (SWBST):',
        '  Somebody = main character. Wanted = goal. But = conflict. So = action taken. Then = outcome.',
        '  Example: "Cinderella WANTED to attend the ball, BUT her stepmother forbade it, SO her fairy godmother helped, THEN she met the prince."',
        'INFORMATIONAL TEXT — Main Idea + Key Details:',
        '  Identify the topic + what the author MOST wants you to know about it. Include 2-3 key supporting details.',
        'EXCLUDE in any summary: minor details, examples, opinions, your own commentary.',
        'OWN WORDS: don\'t copy sentences. Paraphrase to show comprehension.',
        'CHECK: does your summary work as a stand-alone? Could a reader who didn\'t read the original get the gist?',
      ],
      vocabulary: [
        { term: 'summary', definition: 'a short statement of the most important points in a text, in your own words.' },
        { term: 'main idea', definition: 'the central point a text makes about its topic.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-summary',
      kind: 'worked_example',
      problem: 'Summarize the story of "Cinderella" using SWBST.',
      steps: [
        'Somebody: Cinderella, a kind girl mistreated by her stepfamily.',
        'Wanted: to attend the prince\'s royal ball.',
        'But: her stepmother and stepsisters refused to let her go.',
        'So: her fairy godmother used magic to give her a dress and carriage.',
        'Then: at the ball, she met the prince, lost a glass slipper, and was eventually identified by the slipper and married him.',
        'Combine: "Cinderella, a girl mistreated by her stepfamily, wanted to attend the royal ball but was forbidden. Her fairy godmother helped her go, where she met the prince, and after losing a slipper, she was found and married him."',
      ],
      answer: '~3-sentence summary using SWBST.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Summarize the story of "The Three Little Pigs" using SWBST.',
      expectedAnswer: 'Three pigs (Somebody) wanted to build safe homes (Wanted), but a wolf threatened them (But). The first two pigs built weak houses; the third built brick (So). The wolf destroyed the weak houses but couldn\'t blow down the brick one, and the third pig saved his brothers (Then).',
      responseFormat: 'free',
      hints: [
        'Who are the main characters?',
        'What did they want?',
        'What was the conflict?',
        'How was it resolved?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-retell-vs-summary',
      kind: 'misconception_check',
      question: 'A student "summarizes" a 500-word story by writing 450 words that include every event in order. Why isn\'t this a summary?',
      commonErrors: [
        {
          answer: '450-word retelling counts as a summary',
          misconception: 'Confusing retelling with summarizing.',
          correctsTo: 'A SUMMARY is short — typically 1/4 to 1/10 of the original. The student created a RETELLING (a near-complete account). A summary trims to MAIN events only, dropping minor details and exact dialogue. If your "summary" is the same length as the original, you didn\'t summarize — you just copied with paraphrasing.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Summary = short, accurate, in your own words.',
        'Stories: use SWBST (Somebody, Wanted, But, So, Then).',
        'Informational: main idea + 2-3 key details.',
        'Exclude minor details, opinions, exact quotes.',
        'A summary is much shorter than the original.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How is summarizing useful in real life beyond school?',
      hint: 'Reporting on a meeting, sending a one-paragraph email about a long article, telling a friend the highlights of a movie, recapping a sports game. The skill of compressing information without losing meaning is widely applicable in jobs, relationships, and study. Summary discipline also improves your reading focus.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
