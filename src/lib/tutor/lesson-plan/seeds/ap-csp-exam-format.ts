/**
 * AP CSP — Exam Format and the 5 Big Ideas (2025-26).
 *
 * Currency-checked against the College Board AP CSP page + 2024-25
 * exam reorganization. The Create Performance Task was significantly
 * restructured for May 2024+: the old standalone video + written
 * responses + program were replaced by the Personalized Project
 * Reference (PPR) submission + 2 exam-day written responses about
 * the PPR code.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSP_EXAM_FORMAT: LessonPlan = {
  id: 'evelyn.ap.csp.exam-format.v1',
  title: 'AP CSP: Exam Format and the 5 Big Ideas',
  curriculum: 'CollegeBoard',
  grade: 'ap',
  subject: 'cs',
  topic: 'ap-cs-principles',
  locale: 'en',
  los: [
    {
      id: 'apcsp.exam-format',
      description: 'Describe the current AP CSP exam structure (MC + written-response sections), the 5 Big Ideas with exam weights, and the Personalized Project Reference (PPR) workflow that replaced the older standalone Create Performance Task.',
      standard: 'AP-CSP-EXAM',
    },
  ],
  prerequisites: [],
  followUps: ['apcsp.create-pt'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'AP CSP isn\'t just a multiple-choice exam — it\'s exam + project, with 30% from your code.',
      script: 'AP CSP is unusual: 70% of your score is the end-of-year MC exam, but 30% comes from a Create Performance Task — a real program YOU wrote, that you describe in your own words on exam day. The College Board restructured this in 2024: instead of submitting an essay-style writeup separately, you now submit a "Personalized Project Reference" (PPR) by April 30, then answer 2 written-response questions on exam day USING that PPR. The format is meant to make the score harder to outsource and faster to grade.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Exam structure, Big Idea weights, scoring split.',
      keyIdeas: [
        'EXAM has TWO sections: Section 1 — 70 multiple-choice questions, 2 hours. Section 2 — 2 written-response questions about your PPR code, 1 hour. Total ~3 hours on exam day.',
        'EXAM SCORING: Section 1 + Section 2 together = 70% of your final 1-5 score. Create PT (the PPR + WR2 work) = 30%.',
        'BIG IDEA WEIGHTS on the MC section: Big Idea 1 Creative Development (10-13%), BI 2 Data (17-22%), BI 3 Algorithms and Programming (30-35%, the heaviest), BI 4 Computer Systems and Networks (11-15%), BI 5 Impact of Computing (21-26%). BI 3 + BI 5 together are over half the MC score.',
        'COMPUTATIONAL THINKING PRACTICES (1-5): scored on every MC question in addition to Big Idea content. Practice 1 Computational Solution Design, 2 Algorithms and Program Development, 3 Abstraction in Program Development, 4 Code Analysis, 5 Computing Innovations. Practice 6 (Responsible Computing) is taught but NOT assessed.',
        'DIGITAL EXAM: AP CSP is fully digital, taken in Bluebook (the same app as Digital SAT and other digital APs). Calculator NOT needed.',
        'REGISTRATION: students must enroll in their AP Classroom section so College Board can issue a PPR upload link. Late enrollment can lock you out.',
      ],
      vocabulary: [
        { term: 'Big Idea', definition: 'one of the five content domains AP CSP organizes the curriculum around.' },
        { term: 'Computational Thinking Practice', definition: 'a set of skills (5 assessed) that the MC items test alongside content knowledge.' },
        { term: 'Personalized Project Reference (PPR)', definition: 'screenshots of your code that you submit in advance and use to answer written-response questions on exam day.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-big-ideas',
      kind: 'concept',
      goal: 'What each Big Idea actually covers.',
      keyIdeas: [
        'BIG IDEA 1 — CREATIVE DEVELOPMENT (10-13%): collaboration, program design and development, identifying and addressing errors, documenting code. Process-focused: HOW you build, not specific syntax.',
        'BIG IDEA 2 — DATA (17-22%): binary representations of numbers/text/images/sound, abstraction in data, data analysis and visualization, lossless vs lossy compression, data in large quantities (privacy, bias, reliability).',
        'BIG IDEA 3 — ALGORITHMS AND PROGRAMMING (30-35%): variables, control flow (conditionals, loops), lists, procedures (functions), parameters, return values, undecidable vs decidable problems, efficiency (linear vs binary search at a conceptual level), simulations. The heaviest unit by far.',
        'BIG IDEA 4 — COMPUTER SYSTEMS AND NETWORKS (11-15%): the Internet (TCP/IP, DNS, routing, packets, redundancy/fault tolerance), parallel and distributed computing.',
        'BIG IDEA 5 — IMPACT OF COMPUTING (21-26%): beneficial and harmful effects of computing innovations, digital divide, computing bias, crowdsourcing, citizen science, intellectual property and copyright, safe computing.',
        'EVERY MC item is dual-tagged: Big Idea + Computational Thinking Practice. Some items are pure content recall; others test the practice via novel-context analysis.',
        'STRATEGY: BI 3 + BI 5 are over half of MC. Don\'t under-prepare BI 5 just because it feels softer than algorithms — it\'s scoring weight is similar.',
      ],
      vocabulary: [
        { term: 'algorithm', definition: 'a finite sequence of well-defined instructions that solves a problem.' },
        { term: 'abstraction', definition: 'hiding details to focus on essential structure; appears in both data and procedures.' },
        { term: 'digital divide', definition: 'unequal access to computing resources, often along socioeconomic, geographic, or generational lines.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'On exam day, after the 70 MC questions in Section 1, you\'ll spend 1 hour on Section 2. What is Section 2 testing, and what materials are you allowed to reference?',
      expectedAnswer: 'Section 2 is 2 written-response questions about YOUR Create PT code. You can reference the Personalized Project Reference (PPR) you submitted by April 30 — it has screenshots of your list and procedure code. You explain what your code does and why, using the PPR as evidence.',
      responseFormat: 'free',
      hints: [
        'Section 2 is the new Create-PT-on-exam-day format.',
        'PPR = Personalized Project Reference, submitted in advance.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-create-removed',
      kind: 'misconception_check',
      question: 'The Create Performance Task was removed from AP CSP for 2024+ exams, so the score is now 100% from the multiple-choice exam. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Conflating "format change" with "task removal".',
          correctsTo: 'False. The Create PT was NOT removed — it was RESTRUCTURED. Students still build a real program throughout the year. The change: instead of submitting a video + 1500-word essay-style response + program code separately by a deadline, students now submit a Personalized Project Reference (PPR — code screenshots) by April 30, then answer 2 written-response questions about their code DURING the exam (Section 2). Final score is still 70% exam (Sections 1+2) and 30% Create PT artifact. The college is still measuring real coding work.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Exam: 70 MC (2hr) + 2 WR on your PPR code (1hr). 70% of final score.',
        'Create PT artifact (PPR + program work): 30% of final score.',
        '5 Big Ideas weighted: BI 3 Algorithms (30-35%) and BI 5 Impact (21-26%) are heaviest.',
        'PPR submitted by April 30. Without it, no Section 2 reference on exam day.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did College Board move the Create Performance Task written response from take-home to exam-day?',
      hint: 'AI-generated code and AI-generated essays got hard to detect take-home. By moving the essay-style response to exam day (with only a PPR for reference), College Board can be more confident that the analysis is the student\'s own. Also: faster grading (responses are shorter and more structured), and less student time spent on a separate writeup. Trade-off: students who write slowly or have writing-related accommodations face more time pressure than before.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
