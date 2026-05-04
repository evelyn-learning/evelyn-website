/**
 * Grades 9-12 ELA — Drama, Novel, Poem (Genre Comparison).
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_GENRE_COMPARISON: LessonPlan = {
  id: 'evelyn.g912.ela.genre-comparison.v1',
  title: 'Grades 9-12 ELA — Genre Comparison',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.genre-comparison',
      description: 'Compare and contrast how meaning is constructed in drama, novels, and poetry; analyse genre-specific techniques.',
      standard: 'CCSS.ELA-LITERACY.RL.11-12.5',
    },
  ],
  prerequisites: ['g912.ela.short-story-craft'],
  followUps: ['g912.ela.speech-presentation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Drama, novel, poem — same broad goal (literary art), different toolkits and conventions.',
      script: 'A play tells a story through dialogue and stage directions. A novel tells through narration and description. A poem tells through compression and sound. Comparing them shows how form shapes meaning. Today we drill genre-specific techniques.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-genres',
      kind: 'concept',
      goal: 'Differences across genres + analytical implications.',
      keyIdeas: [
        'DRAMA: written for performance. Uses dialogue + stage directions. No narrator (in most plays). Audience sees, not reads. Time is performed in real time.',
        'NOVEL: long prose. Narrator (third or first person). Interior thoughts accessible. Time can compress or expand at will.',
        'POETRY: compressed. Form (line breaks, stanzas, meter) carries meaning beyond words. Often short.',
        'SHORT STORY: prose, brief. Focuses on a single event or insight. Compression like poetry, prose like novel.',
        'NON-FICTION: factual genres. Memoir, essay, journalism. Truth claims matter.',
        'KEY DIFFERENCE — INTERIORITY: novels access character thought directly. Drama infers thought from action and dialogue. Poetry offers concentrated voice.',
        'KEY DIFFERENCE — TIME: novel compresses years in a sentence. Drama happens in real time. Poetry compresses moments to lines.',
        'KEY DIFFERENCE — NARRATOR: novel has narrator(s). Drama (mostly) has none. Poetry has speaker.',
        'COMPARING SAME STORY across genres: a play of "Pride and Prejudice" loses Austen\'s narrator commentary. A novel adaptation of "Hamlet" gains internal monologue but loses the staged spectacle.',
      ],
      vocabulary: [
        { term: 'genre', definition: 'a category of literature defined by form and conventions.' },
        { term: 'interiority', definition: 'access to a character\'s internal thoughts and feelings.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-genre',
      kind: 'worked_example',
      problem: 'How might the same emotional moment — a parent receiving bad news — appear differently in a novel, a play, and a poem?',
      steps: [
        'NOVEL: narrator describes the parent\'s thoughts ("She read the letter and felt the world tilt"), describes setting, references the past, gives interior reaction.',
        'PLAY: parent reads the letter, reacts physically (drops the letter, sits down). A character notices: "Mum?" The audience infers grief from action alone. No internal narrator.',
        'POEM: compressed image — "The letter fell from her hand, / and the kitchen filled / with nothing but silence." The form carries meaning the prose can\'t.',
        'EACH genre prioritises different aspects. Novel: interior. Play: action. Poem: compression and image.',
      ],
      answer: 'Same moment, different access points to meaning depending on genre.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A novel uses a soliloquy-style internal monologue to convey grief. What\'s the play equivalent?',
      expectedAnswer: 'A SOLILOQUY (a character speaking alone on stage to reveal their thoughts) — the dramatic equivalent of internal monologue.',
      responseFormat: 'free',
      hints: [
        'How does drama show internal thoughts when there\'s no narrator?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-translate',
      kind: 'misconception_check',
      question: 'A student says novels and plays are basically interchangeable. Why is this wrong?',
      commonErrors: [
        {
          answer: 'Novels = plays',
          misconception: 'Treating all narrative genres as equivalent.',
          correctsTo: 'Each genre has affordances and constraints. Novels access interior thought directly; plays don\'t. Plays use dramatic time; novels can leap years. Adaptations between genres always LOSE and ADD things. A film adaptation of a novel cannot include the narrator\'s voice in the same way; it must convey through performance, music, framing. Genre matters for what art can do.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Drama: dialogue + action; no narrator; performed.',
        'Novel: narrator; interior thought; flexible time.',
        'Poetry: compressed; form carries meaning; voice.',
        'Same story, different access to meaning by genre.',
        'Adaptations always reshape the original.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might an author DELIBERATELY choose to write in poetry rather than prose?',
      hint: 'Poetry compresses. Compression intensifies. A poem can convey emotional weight that prose dilutes. Poetry also offers FORM — line breaks, sound, rhythm — as a meaning-making tool unavailable to prose. Some experiences (grief, love, terror) gain power from compression. Poets choose poetry because their material demands it; the form fits the content.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
