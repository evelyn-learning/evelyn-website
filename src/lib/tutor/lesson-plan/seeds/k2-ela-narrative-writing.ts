/**
 * Grades K-2 ELA — Narrative Writing.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_ELA_NARRATIVE_WRITING: LessonPlan = {
  id: 'evelyn.k2.ela.narrative-writing.v1',
  title: 'K-2 ELA — Narrative Writing',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ela',
  topic: 'k2-ela',
  locale: 'en',
  los: [
    {
      id: 'k2.ela.narrative-writing',
      description: 'Write simple narratives with a beginning, middle, end; include character, setting, and at least one event.',
      standard: 'CCSS.ELA-LITERACY.W.1.3',
    },
  ],
  prerequisites: ['k2.ela.asking-questions'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'You can write your OWN stories — and they don\'t have to be long to be great.',
      script: 'A story is just: someone, somewhere, doing something. Tell what happened first. Then next. Then last. By the end of today, you\'ll have your own story.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-narrative',
      kind: 'concept',
      goal: 'Three-part structure for K-2 narrative + voice + word selection.',
      keyIdeas: [
        'Every story needs: 1) a CHARACTER (who), 2) a SETTING (where), 3) an EVENT (what happens).',
        'BEGINNING: introduce who and where. "Once there was a bunny named Lily. She lived in a forest."',
        'MIDDLE: tell what happens. "One day, Lily found a shiny rock under a tree."',
        'END: wrap it up. "She brought it home and showed her family."',
        'WORDS to start sentences: "Once...", "One day...", "Then...", "Finally...". These keep the story moving.',
        'CAPITAL letter at sentence start. PERIOD at end. Names get capital letters.',
        'YOU CAN add details: how characters FEEL, what they SEE, what they SAY.',
        'TIP: draw a picture before writing. Pictures help you see your story.',
      ],
      vocabulary: [
        { term: 'narrative', definition: 'a story; tells what happened.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-narrative',
      kind: 'worked_example',
      problem: 'Write a 4-sentence story about a child who finds something special at the park.',
      steps: [
        'Beginning: "Sam went to the park on Saturday."',
        'Middle 1: "He saw something shiny in the grass."',
        'Middle 2: "He picked it up — it was a beautiful blue marble."',
        'End: "Sam smiled and put the marble in his pocket to keep."',
        'Now read it together: 4 sentences, beginning-middle-end, character (Sam), setting (park), event (finds marble).',
      ],
      answer: '4-sentence narrative with all elements.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write a 3-sentence story about a cat. Include who, where, and what happens.',
      expectedAnswer: 'Sample: "Whiskers was a cat who lived on a farm. One sunny day, she chased a butterfly across the field. The butterfly escaped, but Whiskers found a warm spot to nap in."',
      responseFormat: 'free',
      hints: [
        'Sentence 1: who and where.',
        'Sentence 2: what happens.',
        'Sentence 3: how it ends.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-just-events',
      kind: 'misconception_check',
      question: 'A child writes "I went to the store. I got candy." Is this a complete narrative?',
      commonErrors: [
        {
          answer: 'Two events = complete narrative',
          misconception: 'Listing events without setting up character or finishing the story.',
          correctsTo: 'It has events but feels INCOMPLETE. Add: who is "I" (a character with a name and feeling?), where exactly (which store?), how it ends (was the candy good? did anything happen?). Better: "Last Saturday, I went to my favourite candy store with my mom. I picked out a chocolate bar. When I got home, I shared it with my brother." Same idea, much fuller.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Story = character + setting + event.',
        'Beginning, middle, end.',
        'Capital letters and periods matter.',
        'Add details about feelings, sights, words.',
        'Drawing first helps the writing.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How could you make your story EVEN BETTER by adding dialogue?',
      hint: 'Dialogue = characters speaking. "She said \'Hi!\'". It makes the story feel alive. "Whiskers chased the butterfly. \'Wait!\' she meowed. \'Come back!\'" The reader can almost HEAR the character. Use quotation marks around what someone says.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
