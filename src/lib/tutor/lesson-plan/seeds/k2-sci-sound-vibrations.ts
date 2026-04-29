/**
 * K-2 Science — Sound and Vibrations.
 *
 * NGSS 1-PS4-1: plan and conduct investigations to provide evidence
 * that vibrating materials make sound, and that sound can make
 * materials vibrate. Embodied: feel a guitar string, throat when
 * humming, drum.
 *
 * Source: NGSS 1-PS4, OpenStax K-2 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_SOUND_VIBRATIONS: LessonPlan = {
  id: 'evelyn.k2.science.physics.sound-vibrations.v1',
  title: 'How Sound Works',
  curriculum: 'NGSS',
  grade: 'K-2',
  subject: 'science',
  topic: 'waves',
  locale: 'en',
  los: [
    {
      id: 'ngss.1-ps4-1',
      description: 'Plan and conduct investigations to provide evidence that vibrating materials can make sound and that sound can make materials vibrate.',
      standard: 'NGSS.1-PS4-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.4-ps4-1'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to FEEL a sound.',
      script: 'Put your hand gently on your throat and hum a long "mmmmm." What do you feel? That tickle is what makes sound!',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-vibration',
      kind: 'concept',
      goal: 'Sound is made when something VIBRATES — moves back and forth fast.',
      keyIdeas: [
        'A VIBRATION is a tiny back-and-forth wiggle, very fast.',
        'When something vibrates, it pushes the air around it.',
        'The pushing air carries the sound to your EARS.',
        'Inside your ears, the air makes your eardrums vibrate — and your brain hears that as sound.',
        'Pluck a guitar string — see it wiggle. That wiggle = the sound.',
        'Hit a drum — the skin of the drum vibrates. That vibration is the BOOM.',
      ],
      vocabulary: [
        { term: 'vibrate', definition: 'to wiggle back and forth very fast.' },
        { term: 'sound', definition: 'what you hear when something vibrates.' },
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-rubber-band',
      kind: 'worked_example',
      problem: 'You stretch a rubber band tight and pluck it. You see it wiggle and you hear a TWANG sound. Then you grab the rubber band to stop it from wiggling. What happens to the sound?',
      steps: [
        'Pluck the rubber band: it WIGGLES (vibrates) → makes a sound (twang).',
        'Grab and HOLD the rubber band: the wiggling STOPS.',
        'When vibration stops → SOUND STOPS.',
        'The sound was caused by the wiggling. No wiggle = no sound.',
      ],
      answer: 'The sound stops as soon as the vibration stops.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You\'re standing in front of a big speaker playing loud music. You put your hand on the speaker and feel it shaking. What\'s making the speaker shake?',
      expectedAnswer: 'The speaker is vibrating to make the sound.',
      responseFormat: 'free',
      hints: [
        'Sound and vibration are connected — what we learned!',
        'The speaker shakes BECAUSE it\'s making sound.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-silent-vibration',
      kind: 'misconception_check',
      question: 'A friend says "things only vibrate when they make sound." Is that right? Can things vibrate WITHOUT a sound you can hear?',
      commonErrors: [
        {
          answer: 'Yes — vibrate only with sound.',
          misconception: 'Believing all vibration must produce hearable sound.',
          correctsTo: 'Some vibrations are too SLOW or too FAST for human ears. Dogs can hear higher pitches than we can. Whales make sounds too low for us. The vibration is real — just outside our hearing range. Or sometimes vibrations are too quiet for the air to carry far.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Sound = vibration moving through air to your ears.',
        'No vibration = no sound.',
        'Touch a guitar, a drum, or your throat while singing — you can FEEL the vibration.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
