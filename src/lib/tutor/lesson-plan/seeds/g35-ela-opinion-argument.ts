/**
 * Grades 3-5 ELA — Opinion / Argument Writing.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_OPINION_ARGUMENT: LessonPlan = {
  id: 'evelyn.g35.ela.opinion-argument.v1',
  title: 'Grades 3-5 ELA — Opinion & Argument Writing',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.opinion-argument',
      description: 'Write a clear opinion piece with a stated position, reasons, evidence, and a conclusion.',
      standard: 'CCSS.ELA-LITERACY.W.4.1',
    },
  ],
  prerequisites: ['g35.ela.informational-writing'],
  followUps: ['g35.ela.editing-revision'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A good opinion piece doesn\'t just say what you think — it convinces the reader by giving REASONS and EVIDENCE.',
      script: 'You think school should start later. Saying "I think school should start later because I don\'t like mornings" won\'t convince anyone. But "Studies show teens need more sleep" — that\'s a reason backed by evidence. Today we drill the OREO structure that turns opinions into arguments.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-opinion',
      kind: 'concept',
      goal: 'OREO structure + reasons + evidence + counterarguments.',
      keyIdeas: [
        'OREO: Opinion → Reasons → Evidence/Examples → Opinion (restated).',
        'OPINION (THESIS): a clear statement of what you believe. "Cats are better pets than dogs."',
        'REASONS: 2-4 reasons supporting your opinion. One paragraph per reason.',
        'EVIDENCE: facts, statistics, examples, expert quotes that support each reason.',
        'COUNTERARGUMENT: address the OTHER side. "Some say dogs are friendlier, but..." Strengthens credibility.',
        'PERSUASIVE WORDS: "should", "must", "important", "best", "worst". Use sparingly — over-use weakens.',
        'AVOID: insulting opposing views. Be respectful even while disagreeing.',
        'CONCLUSION: restate the opinion and call to action or summary of reasons.',
        'VOICE: confident but not aggressive. The reader should want to nod, not argue.',
      ],
      vocabulary: [
        { term: 'opinion', definition: 'a personal belief or judgement; not a fact.' },
        { term: 'evidence', definition: 'facts, data, or examples that support a reason.' },
        { term: 'counterargument', definition: 'an opposing view that you address and refute.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-opinion',
      kind: 'worked_example',
      problem: 'Outline an opinion piece arguing "Schools should serve healthier lunches."',
      steps: [
        'OPINION: "Schools should serve healthier lunches because nutrition affects student learning and well-being."',
        'REASON 1 — Concentration: "Studies show students who eat well-balanced meals concentrate better in class. A 2018 report linked sugary lunches to afternoon attention drops."',
        'REASON 2 — Long-term health: "Childhood eating habits shape adult health. Schools serve the SAME kids 180 days a year — that\'s 180 chances to build good habits."',
        'COUNTERARGUMENT: "Some argue healthy food is too expensive. But school food programs partnering with local farms have shown costs can stay flat while quality goes up."',
        'CONCLUSION: "Healthier lunches help students learn, grow, and develop habits that last. Schools owe their students this investment."',
      ],
      answer: 'OREO outline with opinion, two reasons + evidence, counterargument, conclusion.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'State an opinion about a topic you care about, then list TWO reasons that support it.',
      expectedAnswer: 'Example — Opinion: "Kids should have at least 30 minutes of recess every day." Reason 1: "Physical activity improves concentration." Reason 2: "Free play helps build social skills."',
      responseFormat: 'free',
      hints: [
        'Pick a clear "should" or "shouldn\'t" position.',
        'Each reason should be different — variety strengthens the case.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-no-evidence',
      kind: 'misconception_check',
      question: 'A student writes "Cats are obviously better than dogs" and provides no reasons. Why is this weak?',
      commonErrors: [
        {
          answer: '"Cats are obviously better"',
          misconception: 'Asserting an opinion as if it\'s self-evidently true.',
          correctsTo: '"Obviously" is a weak shortcut. It tells the reader you BELIEVE something without giving REASONS to agree. Strong opinion writing always provides supporting reasons and evidence. Replace "obviously" with "because" + a real reason: "Cats are better pets than dogs because they\'re lower-maintenance — they don\'t need daily walks." That gives the reader something to consider.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'OREO: Opinion, Reasons, Evidence, Opinion restated.',
        'Each reason gets its own paragraph.',
        'Address counterarguments to strengthen your position.',
        'Avoid insulting language; be respectful but firm.',
        'Don\'t skip evidence — it\'s what makes opinion convincing.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How is opinion writing different from informational writing?',
      hint: 'Informational writing presents facts neutrally to teach. Opinion writing presents an argument to persuade. Different goals, different voices. Informational answers "what is true?"; opinion answers "what should we do or believe?". Both use facts, but opinion writing chooses facts that support its position; informational writing aims for balanced coverage.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
