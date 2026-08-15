/**
 * College Intro — Intro to Literature.
 *
 * Anchor plan for freshman lit survey: how to read fiction, poetry,
 * and drama as an interpreter, not a consumer.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_ELA_INTRO_LITERATURE: LessonPlan = {
  id: 'evelyn.college.ela.intro-literature.v1',
  title: 'Intro to Literature — reading as interpretation',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'ela',
  topic: 'intro-literature',
  locale: 'en',
  los: [
    {
      id: 'college.ela.intro-literature',
      description: 'Read fiction, poetry, and drama as an interpreter — identifying form, voice, and the work the text is doing on the reader.',
      standard: 'COLLEGE-INTRO-LIT',
    },
  ],
  prerequisites: ['g912.ela.literary-devices'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reading like an interpreter is a different activity than reading for plot.',
      script: 'When a friend asks "how was the book?" you summarize the plot. When a literature professor asks "what is this text doing?" you describe the choices the writer made — what they emphasized, what they suppressed, what work they want the reader to do. Those are not the same skill. Today we shift gears.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-intro-lit',
      kind: 'concept',
      goal: 'Form, narrator, voice, form-content fit, close reading, interpretive vs evaluative claims.',
      keyIdeas: [
        'INTERPRETATION ≠ EVALUATION. "I liked it" is a reaction. "The novel uses unreliable narration to make the reader complicit in the protagonist\'s self-deception" is an interpretation. College courses care about the second.',
        'NARRATOR ≠ AUTHOR. The voice telling the story is a constructed device. Asking "why did the author choose THIS narrator" opens up most fiction.',
        'FORM SHAPES MEANING. A sonnet limits what can be said in 14 lines and a strict rhyme scheme — the constraint IS part of the meaning. Same content in free verse would mean differently.',
        'CLOSE READING: spend 30 minutes on a 14-line poem rather than 30 minutes on a chapter. Notice diction, syntax, line breaks, sound. Why THIS word, in THIS position, with THIS sound?',
        'GENRE-SPECIFIC MOVES. Fiction: narration, focalization, free indirect discourse. Poetry: meter, rhyme, line break, image. Drama: stage direction, monologue, dramatic irony.',
        'WHAT IS THE TEXT DOING TO YOU as a reader? Withholding info? Aligning your sympathy? Forcing you into a position you would normally resist?',
        'DEFENSIBLE INTERPRETATION must be supported by specific textual evidence. "The narrator is unreliable" needs you to point at the specific lines where the gap between narration and reality opens up.',
        'MULTIPLE READINGS coexist. A text supports several interpretations; the question is which is most defensible from the evidence, not which is "right."',
      ],
      vocabulary: [
        { term: 'free indirect discourse', definition: 'narration that takes on the voice and perspective of a character without quotation marks — common in Austen, Joyce, Woolf.' },
        { term: 'focalization', definition: 'whose perceptual perspective the narration adopts at a given moment, regardless of who is speaking.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-narrator',
      kind: 'worked_example',
      problem: 'In Nabokov\'s "Lolita," Humbert Humbert narrates his own crimes in beautiful, elaborate prose. What is the form doing?',
      steps: [
        'Step 1: separate narrator from author. Nabokov ≠ Humbert. The book is not endorsing the crimes.',
        'Step 2: notice the deliberate gap. Beautiful prose describes a monstrous act. The reader is being asked to register the disjunction.',
        'Step 3: ask what the form does to the reader. The reader catches themselves enjoying the prose, then catches themselves enjoying the prose, and is forced to examine their own complicity in narrative seduction.',
        'Step 4: the interpretation: the novel is a critique of how aesthetic beauty can launder moral horror — and it weaponizes the reader\'s own aesthetic responses to make the point.',
        'Notice: the interpretation only emerges when you stop asking "what happens" and start asking "what is the form doing to me as a reader."',
      ],
      answer: 'Beautiful prose forces the reader into uncomfortable complicity, exposing how aesthetic surface can mask moral content.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a poem with strict iambic pentameter, the poet breaks meter for one line. What interpretive question does that ask you to consider?',
      expectedAnswer: 'Sample: When meter is consistent for many lines, the consistency becomes invisible. A break in meter forces the reader\'s attention onto that line — meter that breaks is meter that says "look at me." The interpretive question is: what content is the poet making you stop and notice? Often it is the emotionally or argumentatively pivotal moment of the poem.',
      responseFormat: 'free',
      hints: [
        'Form makes meaning by what it draws attention to.',
        'A break in pattern is a way of pointing.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-author-intent',
      kind: 'misconception_check',
      question: 'A student writes: "We can\'t know what the author meant, so all interpretations are equally valid." Why does this miss the point of literary interpretation?',
      commonErrors: [
        {
          answer: 'All interpretations are equally valid',
          misconception: 'Confusing interpretive humility with interpretive relativism.',
          correctsTo: 'Two errors. First, literary interpretation is not about recovering authorial intent — that is biographical research. It is about what the TEXT does, which is something the text itself shows us. Second, interpretations are not all equal: they are judged by how much textual evidence they account for, how internally coherent they are, and how productively they let us re-read the text. "The novel is about a duck" is a worse interpretation of "Pride and Prejudice" than "the novel critiques marriage as economic survival" — not because Austen told us, but because the second accounts for what is actually on the page.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Interpret what the text is DOING, not just what it says.',
        'Narrator is a device, not the author.',
        'Form shapes meaning; constraints are part of content.',
        'Close reading: dwell at the level of word, line, sound.',
        'Defensible interpretations are supported by textual evidence.',
        'Multiple readings coexist — judged by fit, not authority.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is "what the author intended" a different (and often less productive) question than "what does the text do"?',
      hint: 'Authors are unreliable narrators of their own intent — they say what sounds good in interviews, forget early drafts, change their minds about meanings. The text, by contrast, is a fixed artifact: every reader can return to the same lines. Asking "what does the text do" focuses interpretation on shared evidence. Asking "what did the author mean" relies on speculation, biography, or interview material that may have its own agendas. The intentional fallacy (Wimsatt & Beardsley, 1946) names this.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
