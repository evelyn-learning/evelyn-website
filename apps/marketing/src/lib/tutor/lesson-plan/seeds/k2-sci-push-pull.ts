/**
 * K-2 Science — Pushes and Pulls.
 *
 * Foundational K-2 physical-science concept (NGSS K-PS2-1, K-PS2-2):
 * what makes things move, and how the strength + direction of a push
 * or pull changes the motion. Heavy on concrete, embodied examples
 * (door, wagon, swing) and light on vocabulary. Renders use
 * show_early_math + show_labeled_image so the student SEES the force
 * arrows rather than just hears the words.
 *
 * Source: NGSS K-PS2 Performance Expectations, OpenStax K-2 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_PUSH_PULL: LessonPlan = {
  id: 'evelyn.k2.science.physics.push-pull.v1',
  title: 'Pushes and Pulls',
  curriculum: 'NGSS',
  grade: 'K-2',
  subject: 'science',
  topic: 'forces-and-motion',
  locale: 'en',
  los: [
    {
      id: 'ngss.k-ps2-1',
      description: 'Plan and conduct an investigation to compare the effects of different strengths or directions of pushes and pulls on the motion of an object.',
      standard: 'NGSS.K-PS2-1',
    },
    {
      id: 'ngss.k-ps2-2',
      description: 'Analyze data to determine if a design solution works as intended to change the speed or direction of an object with a push or a pull.',
      standard: 'NGSS.K-PS2-2',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.3-ps2-1', 'ngss.3-ps2-2'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student noticing pushes and pulls in their own room right now.',
      script: 'Look around you. Can you find one thing you can PUSH and one thing you can PULL? Try the door — can you tell which one?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-what-is-force',
      kind: 'concept',
      goal: 'A push or pull is what makes things start moving, stop, or change direction.',
      keyIdeas: [
        'A PUSH moves something AWAY from you.',
        'A PULL moves something TOWARD you.',
        'Things only move when something pushes or pulls them.',
        'A bigger push or pull makes things move FASTER or FARTHER.',
      ],
      vocabulary: [
        { term: 'push', definition: 'force that moves something away.' },
        { term: 'pull', definition: 'force that moves something toward you.' },
        { term: 'force', definition: 'a push OR a pull.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_free_body_diagram'],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pushing-wagon',
      kind: 'worked_example',
      problem: 'A child pushes an empty toy wagon. Then they push it again with a heavy box inside. Which time does the wagon move farther?',
      steps: [
        'Show the wagon empty: a small push moves it FAR.',
        'Show the wagon with a heavy box: same push moves it only a SHORT way.',
        'Explain: with the same push, the LIGHTER thing moves more. With a HEAVIER thing, you need a BIGGER push.',
      ],
      answer: 'The empty wagon moves farther — same push, less weight.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Try this: imagine pushing a swing at the playground with a SMALL push, then with a BIG push. Which way does the swing go higher?',
      expectedAnswer: 'big push',
      responseFormat: 'free',
      hints: [
        'Bigger push = more energy moves into the swing.',
        'Think about how high the swing goes each time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-need-touch',
      kind: 'misconception_check',
      question: 'A friend says "things move on their own when nobody is looking!" Is that right? What makes a ball roll across the floor?',
      commonErrors: [
        {
          answer: 'Things move on their own.',
          misconception: 'Believing objects can start moving without any force.',
          correctsTo: 'Something always pushes or pulls — even gravity (the Earth pulling) or a tiny bump from the floor counts as a force.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A push moves things away. A pull moves things toward you.',
        'Bigger force = more change in motion.',
        'Things only move when something pushes or pulls them.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Can you push something AND pull it at the same time? When does that happen?',
      hint: 'Think about a wagon — what is your hand doing on the handle?',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
