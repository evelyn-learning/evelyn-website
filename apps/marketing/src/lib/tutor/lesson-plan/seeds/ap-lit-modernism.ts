/**
 * AP Lit — Modernism (literary period).
 *
 * Roughly 1900-1945. Fragmentation, stream of consciousness, disillusionment, allusion.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_LIT_MODERNISM: LessonPlan = {
  id: 'evelyn.ap.lit.modernism.v1',
  title: 'Modernism in Literature',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-lit',
  locale: 'en',
  los: [
    {
      id: 'aplit.modernism',
      description: 'Identify modernist features (fragmentation, stream of consciousness, allusion, disillusionment) and analyze how they shape meaning in canonical works.',
      standard: 'AP-LIT-CHR-1',
    },
  ],
  prerequisites: ['aplit.literary-elements'],
  followUps: ['aplit.postmodernism'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Modernism as a response to a broken world.',
      script: 'World War I shattered the 19th century\'s confidence in progress, religion, and grand narratives. Modernist writers responded by breaking apart the form itself — fragmented timelines, unreliable narrators, sentences that mimic the chaos of consciousness. Read Eliot or Woolf and the prose feels like the world it describes: disordered, allusive, struggling to make meaning.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-features',
      kind: 'concept',
      goal: 'Defining features of literary Modernism.',
      keyIdeas: [
        'TIME PERIOD: roughly 1900–1945. Bracketed by WWI (started 1914) and WWII (ended 1945). The wars are existential context, not just background.',
        'FRAGMENTATION: stories don\'t flow chronologically or coherently. Eliot\'s "The Waste Land" is a collage of fragments. Faulkner\'s "The Sound and the Fury" cycles through four sections in different times and minds.',
        'STREAM OF CONSCIOUSNESS: prose imitating the unfiltered flow of thoughts. Joyce\'s "Ulysses", Woolf\'s "Mrs Dalloway". The reader is inside a character\'s mind, jumping between memories and observations without explicit signposts.',
        'UNRELIABLE NARRATOR: the storyteller may be limited, biased, mentally unstable, or actively deceitful. Faulkner\'s Benjy can\'t comprehend time; Fitzgerald\'s Nick Carraway is sympathetic but partial.',
        'DISILLUSIONMENT: faith in religion, government, and progress is undermined. Hemingway\'s "lost generation" — characters drift through Europe trying to find meaning after the war. Eliot: "These fragments I have shored against my ruins."',
        'ALLUSION: heavy use of references to mythology, scripture, classical literature. Eliot\'s "The Waste Land" cites the Bible, Shakespeare, the Upanishads, Wagner. The reader has to RECONSTRUCT meaning from scattered cultural artifacts.',
        'KEY AUTHORS: T.S. Eliot, Virginia Woolf, James Joyce, William Faulkner, Ernest Hemingway, F. Scott Fitzgerald, Ezra Pound, Wallace Stevens, Langston Hughes (Harlem Renaissance overlap).',
        'COMMON THEMES: alienation, the search for meaning, the failure of traditional institutions, urban anonymity, the unconscious mind.',
      ],
      vocabulary: [
        { term: 'stream of consciousness', definition: 'prose imitating the unstructured flow of a character\'s thoughts.' },
        { term: 'unreliable narrator', definition: 'a narrator whose account the reader cannot fully trust.' },
        { term: 'allusion', definition: 'a reference to another work, person, or event that the reader is expected to recognize.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-eliot',
      kind: 'worked_example',
      problem: 'Analyze how the opening of Eliot\'s "The Waste Land" — "April is the cruellest month" — embodies modernist features.',
      steps: [
        'INVERSION OF TRADITION: "April is the cruellest month" inverts the convention (Chaucer, romantic poets) of April as renewal. Right away the poem signals: traditional symbols don\'t work anymore.',
        'DISILLUSIONMENT: spring should be hope. Here it\'s painful — life stirring is more disturbing than winter\'s deadness. Reflects the post-WWI mood: the survivors find renewal harder than the dead found peace.',
        'ALLUSION: "April" gestures back to Chaucer\'s Canterbury Tales opening ("Whan that Aprille..."). The educated reader is meant to hear the inversion.',
        'FRAGMENTATION: the lines that follow jump between seasons, places, voices, languages. No single narrative anchor.',
        'INTERPRETATION: the speaker resists rebirth because rebirth means more pain. A modernist gesture — meaning is reluctant, fractured, requires reconstruction by the reader.',
      ],
      answer: 'Eliot inverts the spring-as-renewal trope, alludes to Chaucer, fragments the narrative, and signals post-war disillusionment — all in seven words.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name three modernist features that distinguish Joyce\'s "Ulysses" from a Victorian novel.',
      expectedAnswer: 'Stream of consciousness, fragmentation of time/narrative, heavy classical allusion (the parallel to Homer\'s Odyssey). Possibly also: disillusionment, urban setting, unreliable consciousness.',
      responseFormat: 'free',
      hints: [
        'Joyce vs Dickens: how does the prose itself differ?',
        'Three of: stream of consciousness, allusion, fragmentation, unreliable interiority.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-modernism-modern',
      kind: 'misconception_check',
      question: 'Is "modernism" the same as "modern" or "contemporary" literature?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating modernism as anything written recently.',
          correctsTo: 'No. MODERNISM is a specific literary movement, ~1900–1945. CONTEMPORARY literature means works written recently, regardless of style. The post-WWII period that pushed back on Modernism is called POSTMODERNISM (Beckett, Pynchon, Borges) — playful, self-aware, often parodying modernist seriousness. Calling Cormac McCarthy or Toni Morrison "modernist" is roughly a 50-year mislabel.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Modernism = 1900–1945. Disillusionment after WWI is the engine.',
        'Features: fragmentation, stream of consciousness, unreliable narrators, heavy allusion.',
        'Key authors: Eliot, Woolf, Joyce, Faulkner, Hemingway, Fitzgerald.',
        'Modernism ≠ "modern" or "contemporary".',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does modernist literature so often demand the reader work to construct meaning, instead of stating it directly?',
      hint: 'Modernists believed meaning had been lost — institutions, religion, grand narratives no longer authoritatively explained the world. Asking the reader to assemble fragments mirrors the post-war task of rebuilding meaning. The form enacts the theme. Not laziness; a deliberate aesthetic.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
