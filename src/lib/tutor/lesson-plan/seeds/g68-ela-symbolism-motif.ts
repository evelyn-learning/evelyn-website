/**
 * Grades 6-8 ELA — Symbolism & Motif.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_SYMBOLISM_MOTIF: LessonPlan = {
  id: 'evelyn.g68.ela.symbolism-motif.v1',
  title: 'Grades 6-8 ELA — Symbolism & Motif',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.symbolism-motif',
      description: 'Identify symbols and motifs in literature and explain their thematic significance.',
      standard: 'CCSS.ELA-LITERACY.RL.8.4',
    },
  ],
  prerequisites: ['g68.ela.narrative-arc'],
  followUps: ['g68.ela.tone-mood'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Symbols and motifs let authors say complex things without saying them out loud.',
      script: 'A green light across the bay. A mockingbird. A road. To literal readers, just objects. To analytical readers, doorways into the story\'s themes. Today we learn to read past the surface.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-symbols',
      kind: 'concept',
      goal: 'Define + spot + interpret symbols and motifs.',
      keyIdeas: [
        'SYMBOL: a person, object, or image that represents something BEYOND its literal self. The mockingbird = innocence. The green light = hope/aspiration.',
        'MOTIF: a RECURRING element (image, idea, phrase) that develops a theme. Recurrence is what distinguishes a motif from a one-off symbol.',
        'NOT EVERY OBJECT is a symbol. The author signals symbolic weight through emphasis, repetition, or unusual focus.',
        'SPOTTING SYMBOLS: 1) What objects/images are emphasised or repeated? 2) Do they appear at key moments? 3) Could they stand for an abstract idea (love, freedom, fear)?',
        'CONTEXT MATTERS: a rose can symbolise love in one story and death in another. Look at how the author USES the symbol.',
        'MOTIFS often recur across multiple chapters. Roads, water, light/dark, journeys, weather are common.',
        'AVOID over-reading: not every detail is symbolic. Focus on elements the author clearly amplifies.',
        'TIE TO THEME: explain WHAT the symbol/motif suggests about the story\'s message.',
      ],
      vocabulary: [
        { term: 'symbol', definition: 'a concrete object, person, or image that represents something abstract or larger than itself.' },
        { term: 'motif', definition: 'a recurring image, idea, or phrase that develops a theme.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-symbol',
      kind: 'worked_example',
      problem: 'Interpret the storm in a novel where it appears whenever the protagonist faces a major decision.',
      steps: [
        'Spot the pattern: storms accompany decision moments.',
        'What do storms typically suggest? Chaos, instability, emotional turmoil.',
        'How does it tie to the protagonist? Decisions are difficult — internal storm matches the external one.',
        'Author intent: the storm SYMBOLISES inner conflict; recurrence makes it a MOTIF.',
        'Theme connection: the recurrent storms suggest that change is inseparable from emotional turmoil — the author argues that growth requires weathering uncertainty.',
      ],
      answer: 'Storms = symbol/motif of inner conflict; tie to a theme about growth requiring turmoil.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a story where the main character keeps returning to a single oak tree throughout her childhood, what might the oak tree symbolise?',
      expectedAnswer: 'Stability, rootedness, family memory, growing-up, or refuge — depending on context. Strong answers: tie symbol to specific story moments and a theme.',
      responseFormat: 'free',
      hints: [
        'Trees are often symbols of: strength, growth, roots, family.',
        'What does the oak provide for the character?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-everything-symbol',
      kind: 'misconception_check',
      question: 'A student says every red object in a book is a symbol of love or anger. Why is this over-reading?',
      commonErrors: [
        {
          answer: 'Every red object = symbol',
          misconception: 'Treating any colour or detail as automatically symbolic.',
          correctsTo: 'Symbolism requires AUTHOR EMPHASIS. A red apple in a fruit bowl is just an apple. A red door that the character keeps fixating on, or a red dress she wears at every key moment — those are emphasised and likely symbolic. Test: does the author keep returning to the object? Does it appear at thematically charged moments? If no to both, it\'s probably just description.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Symbol = object representing something abstract.',
        'Motif = recurring symbol or pattern that develops a theme.',
        'Look for emphasis and repetition.',
        'Context decides meaning — same symbol can mean different things in different works.',
        'Always tie symbol/motif back to theme.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A novel features birds in cages, then later, a flock of birds flying free. What might this contrast symbolise?',
      hint: 'Caged birds = constraint, captivity, limited possibility. Free birds = liberation, freedom, possibility. The shift from caged to free suggests a thematic movement: from oppression to liberation, perhaps in a character\'s personal arc or in society. Contrast within a recurring motif amplifies the message.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
