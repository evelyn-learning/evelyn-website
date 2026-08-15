/**
 * Grades 9-12 ELA — Poetry Analysis (Form, Meter, Sound).
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_POETRY_ANALYSIS: LessonPlan = {
  id: 'evelyn.g912.ela.poetry-analysis.v1',
  title: 'Grades 9-12 ELA — Poetry Analysis',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.poetry-analysis',
      description: 'Analyse poems by attending to form, meter, sound, imagery, voice, and meaning; produce sustained close reading.',
      standard: 'CCSS.ELA-LITERACY.RL.11-12.4',
    },
  ],
  prerequisites: ['g912.ela.shakespeare-basics'],
  followUps: ['g912.ela.short-story-craft'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Poems pack meaning into compressed form — every word, line break, and sound choice matters.',
      script: 'A novelist might use 300 pages to convey a feeling. A poet does it in 14 lines. To analyse poetry, you must notice everything — line breaks, rhyme, rhythm, image, voice. Today we drill the elements that make poetry work.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-poetry',
      kind: 'concept',
      goal: 'Form, meter, sound, imagery, voice + analytical approach.',
      keyIdeas: [
        'FORM: shape on the page. Sonnet (14 lines), haiku (5-7-5 syllables), free verse (no fixed pattern), villanelle (19 lines with refrains).',
        'STANZA: a grouped set of lines (like a paragraph). Couplet (2), tercet (3), quatrain (4).',
        'METER: rhythm pattern. Iamb (da-DUM), trochee (DUM-da), anapest (da-da-DUM), dactyl (DUM-da-da). Combine with feet count: pentameter (5 feet), tetrameter (4), hexameter (6).',
        'RHYME SCHEME: pattern marked by letters. ABAB CDCD = alternating rhymes in two quatrains.',
        'SOUND DEVICES: alliteration (repeated consonants, "fluid fountains"), assonance (repeated vowels, "rain stains"), consonance (repeated end-consonants), onomatopoeia (sound = meaning, "buzz").',
        'IMAGERY: appeals to senses. Visual, auditory, tactile, olfactory, gustatory.',
        'VOICE / SPEAKER: the "I" of the poem may not be the poet. Like a narrator in fiction.',
        'LINE BREAKS: each break creates emphasis or surprise. Why HERE? End-stopped (punctuation at line end) vs enjambment (sentence continues across line break).',
        'TURN (volta): a shift in argument or mood, common in sonnets.',
        'ANALYSIS APPROACH: read aloud → notice form → notice sound → notice imagery → identify voice/speaker → ask what it MEANS → cite evidence.',
      ],
      vocabulary: [
        { term: 'enjambment', definition: 'a sentence or phrase continuing across a line break without punctuation.' },
        { term: 'volta', definition: 'a turn or shift in argument, often in a sonnet between octave and sestet.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-analyze',
      kind: 'worked_example',
      problem: 'Analyse this couplet: "Two roads diverged in a wood, and I — / I took the one less traveled by," (Robert Frost).',
      steps: [
        'FORM: from a longer poem, four-line stanzas, iambic tetrameter (mostly 4 feet per line).',
        'LINE BREAK: dramatic dash and line break after "I —" creates pause; emphasises the hesitation, the choice.',
        'REPETITION: "I — / I" — the repeat implies stammering, decision-making, perhaps regret.',
        'RHYTHM: the dash-and-break interrupts the rhythm, slowing the reader.',
        'IMAGE: roads in a wood — a metaphor for life choices.',
        'VOICE: speaker is reflective, perhaps justifying.',
        'MEANING: the choice mattered to the speaker — but the line-break and self-correction hint that the certainty isn\'t total. Many readers misread this poem as celebrating non-conformity; closer reading suggests irony or ambivalence.',
      ],
      answer: 'Form, line break, repetition, rhythm, imagery, voice, irony all noted.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the meter: "Shall I compare thee to a summer\'s day?"',
      expectedAnswer: 'Iambic pentameter — 5 iambs (da-DUM repeated). "shall I / com-PARE / thee TO / a SUM- / mer\'s DAY".',
      responseFormat: 'free',
      hints: [
        'Count syllables: 10.',
        'Stress pattern: alternates unstressed-stressed.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-summary-poem',
      kind: 'misconception_check',
      question: 'A student "analyses" a poem by paraphrasing what it says into prose. Why isn\'t this analysis?',
      commonErrors: [
        {
          answer: 'Paraphrase = analysis',
          misconception: 'Treating restating the poem as analysing it.',
          correctsTo: 'Paraphrase tells you the basic content; analysis explains HOW the poem creates meaning. The line breaks, sound, rhythm, imagery, ambiguity — all the poetic CHOICES — are what poetry adds beyond what prose could say. Analysis attends to form. "The poem is about losing a friend" is paraphrase; "The use of past-tense throughout, the absence of dialogue, and the recurring imagery of empty chairs convey a grief frozen in time" is analysis.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Form, meter, rhyme, sound devices, imagery, voice, line breaks.',
        'Read aloud first.',
        'Speaker ≠ author.',
        'Line breaks create emphasis; enjambment creates flow.',
        'Volta = shift; common in sonnets.',
        'Analyse HOW the poem makes meaning, not just what it says.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might a poet choose FREE VERSE over a fixed form?',
      hint: 'Free verse rejects predetermined patterns to let the poem\'s shape emerge from its content. A poem about chaos may use fragmented lines; a meditative poem may use long, unbroken phrases. Fixed forms (sonnet, villanelle) offer structure as constraint and meaning. Free verse offers freedom and the demand to MAKE the form match the content. Each choice is a statement.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
