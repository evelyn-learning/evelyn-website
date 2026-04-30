/**
 * G9 — ELA: Five-paragraph essay structure (intro, three body, conclusion).
 *
 * The standard HS essay scaffold. Hook + thesis introduction; three
 * body paragraphs each with a topic sentence + evidence + analysis;
 * conclusion that does more than restate. The "claim sandwich"
 * inside each body paragraph.
 */

import type { LessonPlan } from '../types';

export const SEED_G9_ELA_ESSAY_STRUCTURE: LessonPlan = {
  id: 'evelyn.g9.ela.essay-structure.v1',
  title: 'Essay Structure: Intro, Body, Conclusion',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'ela',
  topic: 'writing',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.w.9-10.1',
      description: 'Write arguments to support claims in an analysis of substantive topics.',
      standard: 'CCSS.ELA-LITERACY.W.9-10.1',
    },
  ],
  prerequisites: ['ccss.ela.w.8.1.a'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame essay structure as the architecture that holds an argument up.',
      script: 'You can have brilliant ideas and still write a confusing essay. Why? No structure. The five-paragraph format is a scaffold — boring on its own, but it forces you to ARGUE in a clear shape: tell, show, tell what you showed. Once you can ace this format, you can break it on purpose later.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-paragraphs',
      kind: 'concept',
      goal: 'Each paragraph\'s job + the body-paragraph claim sandwich.',
      keyIdeas: [
        'INTRODUCTION (1 paragraph):',
        '  HOOK — a question, surprising fact, or quote to grab attention.',
        '  CONTEXT — 2-3 sentences setting up the topic for someone who isn\'t already informed.',
        '  THESIS — your specific, arguable claim. Last sentence of the intro.',
        'BODY (3 paragraphs — one per supporting reason):',
        '  TOPIC SENTENCE — what THIS paragraph argues (mini-thesis).',
        '  EVIDENCE — quote, statistic, or example.',
        '  ANALYSIS — how the evidence proves the topic sentence.',
        '  TRANSITION — link to next paragraph.',
        '  This is the CLAIM-EVIDENCE-ANALYSIS sandwich (CEA), one per body paragraph.',
        'CONCLUSION (1 paragraph):',
        '  RESTATE the thesis (in DIFFERENT words from the intro).',
        '  SYNTHESIZE the body paragraphs — show how they fit together.',
        '  END WIDER — call to action, broader implication, or final thought. Don\'t just say "in conclusion, ...".',
        'The "five paragraphs" isn\'t magic — it\'s a starting frame. Real essays often have more (or fewer). Master the structure before remixing it.',
      ],
      vocabulary: [
        { term: 'thesis', definition: 'the central arguable claim of the essay.' },
        { term: 'topic sentence', definition: 'the first sentence of a body paragraph; states what the paragraph argues.' },
        { term: 'transition', definition: 'a sentence or phrase linking one paragraph to the next.' },
      ],
      suggestedTools: ['show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-outline',
      kind: 'worked_example',
      problem: 'Outline a 5-paragraph essay on the thesis: "Schools should require coding classes because coding builds problem-solving, prepares students for modern jobs, and improves logical thinking."',
      steps: [
        'INTRO: Hook (a fact about coding job demand). Context (most schools don\'t teach coding). Thesis (above).',
        'BODY 1: Coding builds problem-solving. Evidence: studies showing coding students improve on logic tests. Analysis: explain how coding requires breaking problems into steps.',
        'BODY 2: Coding prepares for modern jobs. Evidence: BLS data on tech-job growth. Analysis: even non-tech roles increasingly need coding-adjacent skills.',
        'BODY 3: Coding improves logical thinking. Evidence: cognitive research on debugging and logic. Analysis: link coding errors to logical reasoning skill.',
        'CONCLUSION: Restate thesis (different words). Synthesize: in skills, jobs, AND thinking, coding pays off. End wider: schools that delay coding leave students behind.',
      ],
      answer: 'See full outline above',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For a thesis "Reading fiction improves empathy," write one body paragraph topic sentence.',
      expectedAnswer: 'e.g., "Fiction places readers inside the minds of characters whose lives differ from their own, training empathy in a way nonfiction rarely matches."',
      responseFormat: 'free',
      hints: [
        'Topic sentence = mini-thesis for ONE paragraph.',
        'Pick ONE specific reason why fiction → empathy.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-restate-conclusion',
      kind: 'misconception_check',
      question: 'Sage\'s conclusion just copies the thesis word-for-word from the intro. Is that fine?',
      commonErrors: [
        {
          answer: 'yes — that\'s the point of a conclusion',
          misconception: 'Treating "restate" as "copy".',
          correctsTo: 'No. RESTATE means say it again in DIFFERENT words, plus do more — synthesize the body, end wider. Copying the thesis verbatim is lazy and signals "I had nothing else to add." A good conclusion shows the reader what they\'ve LEARNED from the argument, not just the original claim.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Intro: hook + context + thesis (last sentence).',
        'Body × 3: topic sentence + evidence + analysis + transition.',
        'Conclusion: restate (different words) + synthesize + end wider.',
        'Five paragraphs is a starting frame — master it, then remix.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might a real essay have more than five paragraphs?',
      hint: 'Some claims need 4-5 reasons. Some need a full paragraph for context. Some need a counterclaim/refutation paragraph. Five is a scaffold, not a law.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
