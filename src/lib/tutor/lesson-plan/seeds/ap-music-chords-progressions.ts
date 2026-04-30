/**
 * AP Music Theory — Chords and chord progressions.
 *
 * Triads, seventh chords, Roman numeral analysis, common
 * progressions.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_MUSIC_CHORDS_PROGRESSIONS: LessonPlan = {
  id: 'evelyn.ap.music.chords-progressions.v1',
  title: 'Chords and progressions',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'arts',
  topic: 'music-theory',
  locale: 'en',
  los: [
    {
      id: 'apmusic.chords',
      description: 'Build triads and seventh chords; analyze chord progressions using Roman numerals.',
      standard: 'AP-MUSIC-2',
    },
  ],
  prerequisites: ['apmusic.fundamentals'],
  followUps: [],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Most pop songs use just 4 chords.',
      script: 'A handful of chord progressions show up in thousands of pop songs. I-V-vi-IV is the "everywhere" progression — Let It Be, No Woman No Cry, Don\'t Stop Believin\'. Once you know how chords work, you spot the pattern everywhere.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-chords-roman',
      kind: 'concept',
      goal: 'Triads + sevenths + Roman numeral analysis + common progressions.',
      keyIdeas: [
        'TRIAD: 3-note chord, stacked thirds. Major triad: root + major 3rd + perfect 5th. Minor triad: root + minor 3rd + perfect 5th. Diminished: root + minor 3rd + diminished 5th. Augmented: root + major 3rd + augmented 5th.',
        'In C major: C major (C-E-G), D minor (D-F-A), E minor (E-G-B), F major (F-A-C), G major (G-B-D), A minor (A-C-E), B diminished (B-D-F).',
        'ROMAN NUMERAL ANALYSIS: chords numbered by their position in the key.',
        '  Uppercase = major. Lowercase = minor. Diminished often gets °.',
        '  In major: I, ii, iii, IV, V, vi, vii°.',
        'SEVENTH CHORD: triad + 7th above root. V7 is dominant 7 — strong "wants to resolve to I" feel.',
        'COMMON PROGRESSIONS:',
        '  I-IV-V (I to IV to V): blues, rock and roll backbone.',
        '  I-V-vi-IV: pop and contemporary.',
        '  ii-V-I: jazz turnaround.',
        '  vi-IV-I-V: another pop staple.',
        'CADENCE: how a phrase ends. V→I = AUTHENTIC (strong, conclusive). IV→I = PLAGAL ("amen" cadence). V→vi = DECEPTIVE.',
      ],
      vocabulary: [
        { term: 'triad', definition: 'a three-note chord built from stacked thirds.' },
        { term: 'Roman numeral analysis', definition: 'naming chords by their scale position in a key.' },
        { term: 'cadence', definition: 'a chord progression that ends a musical phrase.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-pop-progression',
      kind: 'worked_example',
      problem: 'In C major, what are the actual chords for I-V-vi-IV?',
      steps: [
        'I (C major): C-E-G.',
        'V (G major, the 5th degree): G-B-D.',
        'vi (A minor, the 6th degree, lowercase = minor): A-C-E.',
        'IV (F major): F-A-C.',
        'C → G → A minor → F. Sing "no woman no cry" to it.',
      ],
      answer: 'C, G, Am, F',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In C major, what does V resolve to most strongly?',
      expectedAnswer: 'I (C major)',
      responseFormat: 'free',
      hints: [
        'V → I is the AUTHENTIC cadence.',
        'Strongest sense of resolution.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-chord-letters',
      kind: 'misconception_check',
      question: 'Is a "C chord" always major?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Letter alone implies major.',
          correctsTo: 'When unspecified, "C chord" usually means C MAJOR. But "Cm" is C minor; "C7" is C dominant 7. Always check the suffix. Major is implicit when nothing else is written.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Triad: stacked thirds. Major / minor / diminished / augmented.',
        'Roman numerals: uppercase major, lowercase minor.',
        'Common progressions: I-IV-V, I-V-vi-IV, ii-V-I.',
        'Cadences: authentic (V-I), plagal (IV-I), deceptive (V-vi).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How can the same progression sound EMOTIONAL in one song and CHEERFUL in another?',
      hint: 'Tempo, melody, dynamics, instrumentation, lyrics. The progression is a SKELETON; everything else adds character. "Pachelbel\'s Canon" and "Don\'t Look Back in Anger" share much of the same progression but feel very different.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
