/**
 * AP Computer Science Principles — Data and binary representation.
 *
 * How computers store data: bits, bytes, binary, integers, text
 * (ASCII/Unicode), images, sound. Lossy vs lossless compression.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSP_DATA_BINARY: LessonPlan = {
  id: 'evelyn.ap.csp.data-binary.v1',
  title: 'How computers store data: binary, text, images',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'cs',
  topic: 'ap-cs-principles',
  locale: 'en',
  los: [
    {
      id: 'apcsp.data',
      description: 'Explain how computers represent and store different types of data using binary.',
      standard: 'AP-CSP-DAT-1',
    },
  ],
  prerequisites: [],
  followUps: ['apcsp.algorithms'],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the wild fact: text, photos, music — all stored as 0s and 1s.',
      script: 'Your photo, your favorite song, every word in this lesson — all stored in computers as nothing but ZEROS and ONES. Just two symbols, used in patterns, can represent everything. How? That\'s today.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-binary',
      kind: 'concept',
      goal: 'Bits, bytes, binary numbers, text encoding, images, sound, compression.',
      keyIdeas: [
        'BIT: a single binary digit, either 0 or 1. Smallest unit of digital data.',
        'BYTE: 8 bits. One byte can represent 256 different values (2⁸).',
        'BINARY NUMBERS: base-2 number system. Just like decimal but with positions for 1, 2, 4, 8, 16, …. Decimal 5 = binary 101 (4+1).',
        'TEXT ENCODING: each character maps to a number, then to binary. ASCII (7 bits, 128 characters — English letters, digits, punctuation). UNICODE (extends to all world languages: Chinese, Arabic, emoji).',
        'IMAGES: each PIXEL holds color values. Common: 24-bit RGB — 8 bits each for Red, Green, Blue (0-255). A 1920×1080 image has ~6 million pixels × 3 bytes = ~6 MB raw.',
        'SOUND: SAMPLE the wave at thousands of points per second. CD audio: 44,100 samples/sec, 16 bits per sample, stereo → ~10 MB per minute raw.',
        'COMPRESSION: reduce data size.',
        '  LOSSLESS: ZIP, PNG, FLAC. Original recoverable EXACTLY. Best for code, text, important images.',
        '  LOSSY: JPEG, MP3, MP4. Discards data the human senses won\'t notice. Smaller files but original NOT recoverable. Best for everyday photos, music, video.',
        'POWERS OF 2: 2¹⁰ ≈ 1000 (1 KB ≈ 1024 bytes). 2²⁰ ≈ 1 million (1 MB). 2³⁰ ≈ 1 billion (1 GB). 2⁴⁰ ≈ 1 trillion (1 TB).',
      ],
      vocabulary: [
        { term: 'bit', definition: 'a single binary digit (0 or 1).' },
        { term: 'byte', definition: '8 bits.' },
        { term: 'binary', definition: 'a base-2 number system using only 0 and 1.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-binary',
      kind: 'worked_example',
      problem: 'Convert decimal 13 to binary.',
      steps: [
        'Find the largest power of 2 that fits: 8 (2³). 13 - 8 = 5.',
        'Largest power of 2 in 5: 4 (2²). 5 - 4 = 1.',
        'Largest power of 2 in 1: 1 (2⁰). 1 - 1 = 0.',
        'So 13 = 8 + 4 + 1 = 1·8 + 1·4 + 0·2 + 1·1 = 1101 in binary.',
      ],
      answer: '1101',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is JPEG (lossy) bad for storing source code, and ZIP (lossless) bad for everyday photos?',
      expectedAnswer: 'JPEG would corrupt code (one wrong bit breaks it); ZIP doesn\'t compress photos as much as JPEG can',
      responseFormat: 'free',
      hints: [
        'Different file types have different needs.',
        'Code: every bit matters. Photos: human eyes don\'t see slight changes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bit-byte',
      kind: 'misconception_check',
      question: 'Is "8 megabits per second" the same as "8 megabytes per second"?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing bits and bytes.',
          correctsTo: 'No — 8 MEGABITS/sec is 1 MEGABYTE/sec (8 bits = 1 byte). ISPs advertise speeds in megabits to look bigger; downloads are in megabytes. A 100 Mbps connection downloads at ~12.5 MB/sec, not 100 MB/sec.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Bit (0 or 1) → byte (8 bits).',
        'Binary base-2: positions are 1, 2, 4, 8, 16, ….',
        'Text: ASCII or Unicode mapping. Images: pixels × bytes-per-color. Sound: samples × bits-per-sample.',
        'Compression: lossless preserves; lossy discards imperceptible data.',
        '8 bits = 1 byte. Bits and bytes are NOT the same.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A black-and-white photo with NO compression at 4K resolution would be how big?',
      hint: '4K = ~3840 × 2160 = ~8.3 million pixels. Each B&W pixel needs 8 bits (256 shades) = 1 byte. Total ≈ 8 MB. Color (24 bits/pixel) ≈ 25 MB. Compression (JPEG) typically gets it under 5 MB.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
