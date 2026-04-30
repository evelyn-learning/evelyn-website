/**
 * AP Music Theory — Fundamentals: notes, scales, intervals, key
 * signatures.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_MUSIC_THEORY_FUNDAMENTALS: LessonPlan = {
  id: 'evelyn.ap.music.fundamentals.v1',
  title: 'Music theory fundamentals: scales, intervals, keys',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'arts',
  topic: 'music-theory',
  locale: 'en',
  los: [
    {
      id: 'apmusic.fundamentals',
      description: 'Identify scales, intervals, and key signatures.',
      standard: 'AP-MUSIC-1',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Music theory as the language behind every song.',
      script: 'Why does a sad song use minor chords? Why does a major scale sound bright? Music theory explains the patterns. Once you know the patterns, you can ANALYZE a piece — or write your own.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pillars',
      kind: 'concept',
      goal: 'Notes + scales + intervals + key signatures.',
      keyIdeas: [
        'NOTES: 12 in Western music — A, A♯/B♭, B, C, C♯/D♭, D, D♯/E♭, E, F, F♯/G♭, G, G♯/A♭. After A♯ comes B; after B comes C — only HALF STEPS between B-C and E-F (no sharp/flat).',
        'OCTAVE: distance between a note and the same note higher/lower (e.g., low C to high C). Frequency doubles.',
        'HALF STEP (semitone): smallest interval. Adjacent piano keys.',
        'WHOLE STEP (tone): 2 half steps.',
        'SCALES: ordered sets of pitches.',
        '  MAJOR scale pattern: W-W-H-W-W-W-H. Bright sound. C major: C D E F G A B C.',
        '  NATURAL MINOR: W-H-W-W-H-W-W. Darker sound. A minor: A B C D E F G A (uses same notes as C major — RELATIVE minor).',
        'INTERVALS: distance between two notes. Number (2nd, 3rd, 4th, …) + quality (major/minor/perfect/augmented/diminished).',
        '  Perfect: unison, 4th, 5th, octave.',
        '  Major / minor: 2nd, 3rd, 6th, 7th. (3rds and 6ths can be either.)',
        'KEY SIGNATURES: sharps or flats at the start of a staff indicating the scale. C major / A minor: NO sharps or flats. G major: 1 sharp (F♯). F major: 1 flat (B♭). Circle of fifths organizes them.',
        'CIRCLE OF FIFTHS: each step clockwise adds a sharp; counterclockwise adds a flat. Memorization aid.',
      ],
      vocabulary: [
        { term: 'scale', definition: 'an ordered series of notes following a specific interval pattern.' },
        { term: 'interval', definition: 'the distance between two notes.' },
        { term: 'key signature', definition: 'sharps or flats at the start of music indicating the key.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-major-scale',
      kind: 'worked_example',
      problem: 'Write the G major scale.',
      steps: [
        'Start on G. Apply pattern W-W-H-W-W-W-H.',
        'G + W = A.',
        'A + W = B.',
        'B + H = C.',
        'C + W = D.',
        'D + W = E.',
        'E + W = F♯.',
        'F♯ + H = G.',
        'G major: G A B C D E F♯ G. One sharp (F♯). Key signature: 1 sharp.',
      ],
      answer: 'G A B C D E F♯ G; 1 sharp',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How many half steps in a perfect 5th?',
      expectedAnswer: '7',
      responseFormat: 'numeric',
      hints: [
        'C to G is a perfect 5th.',
        'Count: C → C♯ → D → D♯ → E → F → F♯ → G = 7 half steps.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-major-happy',
      kind: 'misconception_check',
      question: 'Are major keys always "happy" and minor always "sad"?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Equating mode with mood.',
          correctsTo: 'Common but oversimplified. Many sad songs are in major keys; many lively ones in minor (lots of folk and Latin music). Mode is one TOOL of many. Tempo, instrumentation, lyrics, harmony together create mood.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '12 notes; B-C and E-F are half steps without sharps.',
        'Major scale: W-W-H-W-W-W-H.',
        'Natural minor: W-H-W-W-H-W-W.',
        'Intervals: number (2nd, 3rd…) + quality (major/minor/perfect).',
        'Circle of fifths organizes key signatures.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the major scale "sound right"?',
      hint: 'Frequency ratios. Perfect 5th = 3:2 ratio. Major 3rd ≈ 5:4. Simple ratios sound consonant. Major scale uses simple-ratio intervals heavily — basis of most Western music for the past 400 years.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
