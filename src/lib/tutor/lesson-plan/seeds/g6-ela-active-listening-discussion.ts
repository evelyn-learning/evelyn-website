/**
 * G6 — Active listening and class discussions.
 *
 * Speaking and listening standard. Norms for productive discussion:
 * stay on topic, build on others, ask clarifying questions, disagree
 * respectfully.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_ELA_ACTIVE_LISTENING: LessonPlan = {
  id: 'evelyn.g6.ela.speaking-listening.discussion.v1',
  title: 'Active listening and discussion skills',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'ela',
  topic: 'speaking-listening',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.6.sl.1',
      description: 'Engage effectively in a range of collaborative discussions, building on others\' ideas and expressing their own clearly.',
      standard: 'CCSS.ELA-LITERACY.SL.6.1',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.7.sl.1'],
  estimatedMinutes: 11,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Distinguish "waiting to talk" from actually listening.',
      script: 'Most people don\'t listen — they wait for their turn to talk. Real listening means processing what the OTHER person actually said. It\'s rarer than you\'d think.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-skills',
      kind: 'concept',
      goal: 'Four habits that make discussions productive.',
      keyIdeas: [
        'BUILD ON others: don\'t just respond — connect. "I agree with what Maria said, and I\'d add…"',
        'ASK clarifying questions: "Can you say more about what you meant by ___?" Shows you listened AND helps the speaker sharpen the idea.',
        'DISAGREE respectfully: separate the IDEA from the PERSON. "I see it differently because…" — not "You\'re wrong."',
        'STAY on topic: bring side-conversations back to the main question. Prevent drift.',
        'EVIDENCE matters: support claims with reasons or examples. "Because the text says…" or "I noticed when…"',
        'BODY LANGUAGE: face the speaker, eye contact (within cultural comfort), nodding shows engagement.',
      ],
      vocabulary: [
        { term: 'active listening', definition: 'fully focusing on and processing what the speaker says.' },
        { term: 'clarifying question', definition: 'a question asked to better understand someone\'s point.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-build-on',
      kind: 'worked_example',
      problem: 'Maria says: "I think the character was selfish for taking the last cookie." How could you BUILD on her point in discussion?',
      steps: [
        'Acknowledge: "I see what Maria is saying about selfishness."',
        'Add: "And I\'d add that her selfishness shows up earlier too — when she ignored her brother in chapter 2."',
        'Now you\'ve VALIDATED her point AND deepened the discussion with new evidence.',
        'Avoid: switching to a totally new topic, or just saying "yeah" with no addition.',
      ],
      answer: 'acknowledge + add evidence or extension',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A classmate says something you disagree with. Write a respectful disagreement starter.',
      expectedAnswer: 'I see it differently because… (or similar)',
      responseFormat: 'free',
      hints: [
        'Avoid "you\'re wrong" — focus on the IDEA, not the PERSON.',
        'Try "I see this differently because…" or "I had a different reading — when I read X, I noticed…"',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-quiet-not-listening',
      kind: 'misconception_check',
      question: 'If you\'re quiet during a discussion, are you NOT participating?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Equating talking with participating.',
          correctsTo: 'Not necessarily — you can be ACTIVELY listening: making eye contact, taking notes, building a thoughtful response. Talking-without-listening is much worse than listening-without-talking. But ideally, both happen.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Build on others — connect, don\'t just react.',
        'Ask clarifying questions.',
        'Disagree with the IDEA, not the person.',
        'Support claims with evidence.',
        'Listening is participating too.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How do online discussions (text-based, like comments) compare to spoken ones for active listening?',
      hint: 'Text gives more time to process. But you lose tone, body language. Easier to misinterpret. Easier to attack the person, not the idea.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
