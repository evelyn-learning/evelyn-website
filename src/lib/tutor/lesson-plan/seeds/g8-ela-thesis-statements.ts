/**
 * G8 — ELA: Thesis statements (essay-level claim writing).
 *
 * The single sentence that anchors a whole essay. Three traits of a
 * strong thesis: arguable (someone could disagree), specific (not a
 * vague topic), and previewable (hints at the supporting reasons).
 * Tests the student against the three failure modes: too obvious,
 * too vague, or just a topic statement.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_ELA_THESIS_STATEMENTS: LessonPlan = {
  id: 'evelyn.g8.ela.thesis-statements.v1',
  title: 'Writing Strong Thesis Statements',
  curriculum: 'CCSS',
  grade: '8',
  subject: 'ela',
  topic: 'writing',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.w.8.1.a',
      description: 'Introduce claim(s), acknowledge alternate or opposing claims, and organize the reasons and evidence logically.',
      standard: 'CCSS.ELA-LITERACY.W.8.1.A',
    },
  ],
  prerequisites: ['ccss.ela.w.6.1'],
  followUps: ['ccss.ela.w.9-10.1.a'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame thesis as the GPS for a whole essay.',
      script: 'Imagine starting a road trip without a destination. You\'d wander. Same thing happens to an essay without a thesis — paragraphs go everywhere, never arriving anywhere. The thesis is your GPS — one sentence that tells you AND the reader exactly where you\'re going.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-traits',
      kind: 'concept',
      goal: 'Three traits of a strong thesis: arguable, specific, previewable. Three failure modes.',
      keyIdeas: [
        'A THESIS STATEMENT is the central claim of an essay — usually one sentence at the end of the introduction.',
        'Three traits of a STRONG thesis:',
        '  1) ARGUABLE — someone could reasonably disagree. ("The sky is blue" is not arguable; "School should start at 9am" is.)',
        '  2) SPECIFIC — narrow enough to actually defend in an essay. (Not "Technology is good" but "Smartphones improve middle-school students\' learning when used as research tools.")',
        '  3) PREVIEWABLE — hints at the main supporting reasons, often by listing categories. ("...because of A, B, and C.")',
        'Three FAILURE MODES:',
        '  TOO OBVIOUS / FACT: "Pollution is bad." Nobody disagrees → no argument.',
        '  TOO VAGUE: "School is important." → about what? In what way? Compared to what?',
        '  JUST A TOPIC: "I\'ll be writing about climate change." → that\'s WHAT you\'re writing about, not what you\'re ARGUING.',
        'Build process: start with a TOPIC ("homework"), narrow to a QUESTION ("How much homework helps learning?"), answer with a CLAIM ("Middle-schoolers learn best with no more than 30 minutes of nightly homework"), then add SUPPORT preview ("...because longer assignments hurt sleep, reduce family time, and produce diminishing learning gains").',
      ],
      vocabulary: [
        { term: 'thesis statement', definition: 'the central claim of an essay; usually one sentence.' },
        { term: 'arguable', definition: 'reasonable people could disagree; there\'s a real case to be made.' },
      ],
      suggestedTools: ['show_text', 'show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-improve',
      kind: 'worked_example',
      problem: 'Improve this thesis: "School lunches are bad."',
      steps: [
        'Trait check: arguable? Sort of, but vague. Specific? No — "bad" how? Previewable? No reasons.',
        'Add specificity: "bad" → too high in sodium, fat, processed.',
        'Add a preview of reasons: nutrition, taste, environmental impact.',
        'Improved: "Public school lunches should be reformed because they are too high in sodium and processed ingredients, lack appealing flavors, and produce high amounts of food waste."',
        'Now: arguable (people could disagree), specific (concrete claims), previewable (three reason categories).',
      ],
      answer: 'Improved thesis with three reason preview',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which is the strongest thesis? (a) "I will write about social media." (b) "Social media is everywhere." (c) "Daily social media use under 1 hour can improve teen mental health, while heavier use harms sleep and self-esteem."',
      expectedAnswer: 'c',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(a) — clear topic' },
        { id: 'b', text: '(b) — true statement' },
        { id: 'c', text: '(c) — specific, arguable, previews reasons', correct: true },
      ],
      hints: [
        '(a) is a topic statement, not a claim.',
        '(b) is true but not arguable.',
        '(c) makes a specific, arguable claim with reasons.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-restate-prompt',
      kind: 'misconception_check',
      question: 'For the prompt "Should middle schools have later start times?", Sage writes the thesis: "This essay will discuss whether middle schools should have later start times." What\'s wrong?',
      commonErrors: [
        {
          answer: 'nothing — addresses the question',
          misconception: 'Restating the prompt as if that were the thesis.',
          correctsTo: 'Sage just told the reader what the essay is ABOUT, not what they\'re ARGUING. A thesis must take a SIDE: "Middle schools should start at 9am because students who sleep more learn more, behavior issues drop, and academic performance improves." Now there\'s a claim to defend.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Thesis = one-sentence central claim of an essay.',
        'Three traits: ARGUABLE, SPECIFIC, PREVIEWABLE.',
        'Three failures: too obvious, too vague, just a topic.',
        'Build process: topic → question → claim → preview reasons.',
        'Restating the prompt is NOT a thesis — take a side.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Pick a topic you\'d argue about (school dress code, video games, homework). Write a thesis using the three-trait checklist. Then write the OPPOSITE thesis just as strong.',
      hint: 'The opposite thesis test ensures your thesis is actually arguable. If the opposite is absurd, your thesis was too obvious.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
