/**
 * AP Seminar — exam + portfolio strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_SEMINAR_STRATEGY: LessonPlan = {
  id: 'evelyn.ap.seminar.strategy.v1',
  title: 'AP Seminar exam + portfolio strategy',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ela',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'apseminar.strategy',
      description: 'Apply the QUEST process to AP Seminar tasks: research, evaluate sources, synthesize multiple perspectives, communicate findings, and reflect.',
      standard: 'AP-SEMINAR',
    },
  ],
  prerequisites: [],
  followUps: ['apresearch.strategy'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'AP Seminar is the first half of the AP Capstone diploma.',
      script: 'AP Seminar is unlike any other AP exam. There\'s no single test on a fixed body of knowledge. Instead, you do TWO performance tasks across the year (collaborative + individual essay) plus a 2-hour written exam. The whole year teaches you the QUEST process: how to research, evaluate sources, synthesize multiple perspectives, and communicate findings rigorously.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-quest',
      kind: 'concept',
      goal: 'QUEST process and the three score components.',
      keyIdeas: [
        'QUEST: Question (and explore), Understand (and analyze), Evaluate (multiple perspectives), Synthesize (ideas), Team / Transmit / Reflect.',
        'COMPONENT 1 — TEAM PROJECT (20% of score): with a small group, identify a problem, research it, and present a solution. Includes individual research report (~1200-2000 words), team multimedia presentation (~8-10 min), oral defense.',
        'COMPONENT 2 — INDIVIDUAL RESEARCH (35%): a 2000-word research-based essay developing a personal argument about a real-world issue, AND a ~6-8 min presentation + oral defense.',
        'COMPONENT 3 — END OF COURSE EXAM (45%): 2-hour timed exam. Section 1: 3 short-answer questions analyzing an argument from a source. Section 2: long essay synthesizing multiple sources into a structured argument.',
        'EVALUATING SOURCES: every source has CREDIBILITY (who is the author, what bias?), RELEVANCE (does it answer your question?), and PERSPECTIVE (whose voice is represented or missing?). Always cite — your essays use APA or MLA.',
        'SYNTHESIS not summary: the goal is connecting multiple sources around YOUR argument, not summarizing each in turn. Body paragraphs argue something; sources are evidence.',
        'MULTIPLE PERSPECTIVES: AP Seminar specifically rewards engaging with views you DISAGREE with. Steel-man the opposing view before refuting it.',
        'PRESENTATIONS: rehearsed but not memorized verbatim. Cite sources orally. Anticipate questions for the oral defense.',
      ],
      vocabulary: [
        { term: 'QUEST', definition: 'AP Seminar\'s core process: Question, Understand, Evaluate, Synthesize, Transmit/Reflect.' },
        { term: 'oral defense', definition: 'a brief Q&A after a presentation where graders ask probing questions.' },
        { term: 'synthesis', definition: 'integrating multiple sources to support an original argument, not just summarizing them.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-essay',
      kind: 'worked_example',
      problem: 'How to structure the End-of-Course exam Section 2 (long synthesis essay).',
      steps: [
        'Read the prompt + sources (4-7 sources). Identify the question being asked.',
        'TAKE A CLEAR POSITION. Don\'t straddle. The essay needs an arguable thesis.',
        'PLAN with a thesis + 3-4 supporting claims, each backed by a different source.',
        'Body paragraphs: claim sentence, source citation (with attribution), analysis tying to the thesis. ~3-4 paragraphs.',
        'Engage with at least ONE counter-argument from a source — concede, then refute or limit it.',
        'Use the sources to BUILD your argument, not list. "While Source 3 argues X, Source 2 demonstrates that Y, suggesting that..."',
        'Cite within text. End-of-course exam doesn\'t require a separate Works Cited — but in-text attribution is mandatory.',
        'Time management: ~10 min reading, ~30 min writing, ~5 min revising.',
      ],
      answer: 'Clear position, claim-evidence-analysis structure, engage with counter, use sources to build argument.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In the team project, why does AP Seminar require an INDIVIDUAL research report alongside the team presentation?',
      expectedAnswer: 'To assess each student\'s individual contribution to research and reasoning. Group projects can mask weak contributors; the individual report ensures every team member demonstrates research, source evaluation, and writing skills independently. The team presentation tests collaboration and synthesis across viewpoints.',
      responseFormat: 'free',
      hints: [
        'What\'s the risk of grading only the team output?',
        'What do graders need to see from each individual?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-no-position',
      kind: 'misconception_check',
      question: 'Should AP Seminar essays present "both sides" without taking a position to seem balanced?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing balance with no-position.',
          correctsTo: 'No. Graders specifically look for an ARGUMENT. Engaging with multiple perspectives is required, but you must still take a defensible position. The best essays steel-man counter-arguments AND defend a thesis. Refusing to commit reads as evasive, not balanced. The rubric rewards engagement, not neutrality.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three components: team project (20%), individual essay+presentation (35%), end-of-course exam (45%).',
        'QUEST process structures the year.',
        'Synthesis > summary. Take a position; engage with counter-arguments.',
        'Cite credibly. Defend orally. Reflect on your reasoning.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does AP Capstone (Seminar + Research) appeal to selective universities even though the courses don\'t teach a single subject?',
      hint: 'They teach RESEARCH and ACADEMIC WRITING — skills that map directly onto college work. Universities care less about content mastery (you\'ll learn that) and more about process: can you formulate a question, find good sources, evaluate them critically, write a structured argument? AP Capstone gives explicit evidence of those skills via portfolio + exam, which a transcript of content-heavy AP courses can\'t.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
