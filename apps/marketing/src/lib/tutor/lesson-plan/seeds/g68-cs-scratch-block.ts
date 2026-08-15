/**
 * Grades 6-8 Computer Science — Scratch & Block Programming.
 *
 * Sprites, events, message passing, and why blocks remove syntax errors.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_CS_SCRATCH_BLOCK: LessonPlan = {
  id: 'evelyn.cs.6-8.scratch-block.v1',
  title: 'Scratch & block programming — sprites and events',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'cs',
  topic: 'scratch-block',
  locale: 'en',
  los: [
    {
      id: 'cs68.scratch',
      description: 'Build a Scratch program using sprites, event blocks, and message broadcasting.',
      standard: 'CSTA-2-AP-13',
    },
  ],
  prerequisites: ['cs68.intro'],
  followUps: ['cs68.web'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Scratch as removing syntax so you can focus on logic.',
      script: 'In real code, one missing semicolon and nothing runs. Scratch uses BLOCKS that snap together — wrong shapes don\'t fit, so syntax errors disappear. What\'s left is the actual interesting part: figuring out what the program should DO.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-blocks',
      kind: 'concept',
      goal: 'Sprites, events, motion blocks, and message passing.',
      keyIdeas: [
        'SPRITE: a character or object on the stage. Each sprite has its own scripts.',
        'STAGE: the background. Can also have scripts.',
        'EVENT BLOCKS (yellow): "when green flag clicked", "when sprite clicked", "when key pressed". Programs start here.',
        'MOTION BLOCKS (blue): move 10 steps, turn 15 degrees, glide to x y.',
        'CONTROL BLOCKS (orange): forever, repeat 10, if/else, wait 1 second.',
        'BROADCAST: a sprite can shout "hello" and other sprites can listen with "when I receive hello". Lets sprites coordinate.',
        'Coordinate system: x goes left/right (-240 to 240), y goes up/down (-180 to 180). Center is (0, 0).',
      ],
      vocabulary: [
        { term: 'sprite', definition: 'a programmable object on the Scratch stage.' },
        { term: 'event', definition: 'something the user or system does that triggers code.' },
        { term: 'broadcast', definition: 'a message one sprite sends that any sprite can react to.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cat-walk',
      kind: 'worked_example',
      problem: 'Make the cat sprite walk across the screen when the green flag is clicked.',
      steps: [
        'Drag "when green flag clicked" — start of the program.',
        'Snap "go to x: -200, y: 0" below it — start at the left edge.',
        'Snap "repeat 20" below.',
        'Inside the repeat: "move 20 steps" and "wait 0.1 seconds".',
        '// The cat moves 20 × 20 = 400 pixels right, in 20 small steps over 2 seconds.',
      ],
      answer: 'Cat walks left-to-right when flag is clicked.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-broadcast',
      kind: 'try_yourself',
      problem: 'You want the cat sprite to say "Hi!" and then have a dog sprite bark. The dog\'s code shouldn\'t run until the cat finishes. Which Scratch feature do you use?',
      expectedAnswer: 'broadcast / receive',
      responseFormat: 'free',
      hints: [
        'You need one sprite to TELL another sprite to start.',
        'The dog\'s code needs an event block that listens for a custom event.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-shared-script',
      kind: 'misconception_check',
      question: 'A student says: "The cat\'s motion block also moves the dog." Why is that wrong?',
      commonErrors: [
        {
          answer: 'because they\'re both on the stage',
          misconception: 'Treating sprites as sharing one script.',
          correctsTo: 'Each sprite has its OWN scripts and its OWN x/y position. A "move 10 steps" block in the cat\'s scripts only moves the cat. To move the dog, you switch to the dog sprite and add motion blocks there. The stage doesn\'t move sprites — sprites move themselves.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Sprites have their own scripts; stage is the background.',
        'Event blocks (yellow) are how a program starts.',
        'Broadcast/receive lets sprites coordinate.',
        'Coordinates: x is horizontal, y is vertical, center is (0, 0).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does professional code (Python, JavaScript, etc.) use text instead of blocks if blocks remove syntax errors?',
      hint: 'Blocks scale poorly. A 10,000-line program is unreadable as blocks but fits on screen as text. Text is also faster to type, easier to version-control with git, and lets you copy-paste from documentation. Blocks are great for learning; text wins for serious projects.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
