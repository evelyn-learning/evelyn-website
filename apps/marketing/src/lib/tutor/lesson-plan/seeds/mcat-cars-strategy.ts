/**
 * MCAT CARS — Critical Analysis and Reasoning Skills.
 *
 * Most distinctive section. NO outside knowledge. Highest med-school weight.
 * This plan covers passage strategy, question-type recognition, and pacing.
 */

import type { LessonPlan } from '../types';

export const SEED_MCAT_CARS_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.mcat.cars.strategy.v1',
  title: 'MCAT CARS — Passage Strategy, Question Types, and Pacing',
  curriculum: 'CCSS',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'mcat-cars',
  locale: 'en',
  los: [
    {
      id: 'mcat.cars.strategy',
      description: 'Recognize the three CARS skill types (Foundations of Comprehension, Reasoning Within Text, Reasoning Beyond Text), apply structured passage-mapping, identify trap answer patterns, and pace 9 passages within 90 minutes.',
      standard: 'MCAT-CARS',
    },
  ],
  prerequisites: ['mcat.format-2025'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'CARS is the trickiest section to improve — start early.',
      script: 'Of all four MCAT sections, CARS is the one that does NOT respond to content review. You can read every textbook in existence and still bomb it. CARS responds to one thing: deliberate practice with active reading and answer-elimination patterns. Med schools weight CARS heavily because it predicts clinical reasoning. The good news: once you internalize the question-type taxonomy and the trap patterns, scores climb 1-2 points per month with consistent practice.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-question-types',
      kind: 'concept',
      goal: 'Three CARS skill categories.',
      keyIdeas: [
        'AAMC organizes CARS questions into THREE skills, each weighted ~30%.',
        'SKILL 1 — FOUNDATIONS OF COMPREHENSION: "What did the author say?" Main idea, vocabulary in context, finding evidence in the passage. Most direct. Strategy: re-locate in passage; the answer is THERE.',
        'SKILL 2 — REASONING WITHIN THE TEXT: "How did the author argue?" Identify assumptions, judge evidence quality, recognize tone, follow analogies. Requires synthesis of multiple paragraphs.',
        'SKILL 3 — REASONING BEYOND THE TEXT: "What if the world changed?" Apply author\'s position to a new scenario; identify how new info would weaken or strengthen the argument. Most abstract — but always anchored in the passage.',
        'WITHIN/BEYOND distinction is a common trap area. WITHIN-text questions stay inside the passage logic; BEYOND-text questions add external scenarios.',
        'COMMON QUESTION STEMS: "Which best describes the author\'s main idea?" (S1) "The author would most likely agree that..." (S2/S3) "Which finding would WEAKEN the author\'s argument?" (S3) "The word X in paragraph 2 most nearly means..." (S1).',
      ],
      vocabulary: [
        { term: 'main idea', definition: 'the central claim or thesis the author is arguing for; usually woven across the passage, not a single sentence.' },
        { term: 'tone', definition: 'author\'s attitude toward the subject (skeptical, enthusiastic, ambivalent, etc.); inferred from word choice.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-passage-mapping',
      kind: 'concept',
      goal: 'How to read a CARS passage.',
      keyIdeas: [
        'AIM: build a mental map of WHO is arguing WHAT, WHY, and against WHAT counter-position. NOT memorize details.',
        'PARAGRAPH-LEVEL TAGS (do mentally, not in writing — too slow): for each paragraph, ask: what is THIS paragraph adding to the argument?',
        'IDENTIFY THE STRUCTURE early: is the author arguing FOR a position? Comparing two views? Synthesizing? Refuting a strawman?',
        'KEY TRANSITION WORDS as signposts: "however," "but," "in contrast" → opposing view coming. "Therefore," "thus," "as a result" → conclusion. "For example" → illustration of preceding claim.',
        'TONE markers: "ostensibly," "purported," "so-called" → author is skeptical. "Indeed," "clearly" → author endorses.',
        'SKIM vs CLOSE-READ TRADEOFF: most fast scorers do ONE careful pass at moderate speed (~3-4 min/passage), then go to questions. RE-READING wastes time; instead, USE THE PASSAGE CONTENT as the question reference.',
        'TIMING TARGET: 9 passages × ~10 min each = 90 min total. Within 10 min: ~3-4 min reading + 6-7 min on questions.',
        'IF STUCK on a passage: GUESS, FLAG, MOVE ON. Coming back is fine but don\'t bleed time on one passage.',
      ],
      vocabulary: [
        { term: 'thesis', definition: 'the author\'s main argument or central claim; the position the rest of the passage supports.' },
        { term: 'transition word', definition: 'a connector ("however," "therefore," "in contrast") that signals shifts in argument structure.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-trap-patterns',
      kind: 'concept',
      goal: 'Wrong-answer patterns AAMC repeats.',
      keyIdeas: [
        'OUT OF SCOPE: introduces info not in the passage. Tempting if it sounds plausible from your background — but the passage didn\'t say it. AUTOMATIC ELIMINATE.',
        'EXTREME LANGUAGE: words like "always," "never," "only," "must" — usually too strong for nuanced humanities passages. Right answers more often hedge: "often," "may," "tends to."',
        'OPPOSITE: looks like a passage statement but flipped (negated, opposite direction). Catches careless readers.',
        'HALF-RIGHT, HALF-WRONG: first clause matches passage; second clause contradicts. Test-makers love this. READ THE WHOLE ANSWER.',
        'TRUE BUT IRRELEVANT: factually correct, but doesn\'t answer THIS question. Check that the answer responds to what was asked.',
        'AUTHOR\'S POSITION CONFUSION: the answer reflects A position from the passage, but not the AUTHOR\'S position (e.g., the author is summarizing a critic\'s view to refute it).',
        'STRATEGY: when stuck between two answers, find SPECIFIC PASSAGE EVIDENCE that supports one over the other. The right answer always traces back to a sentence or paragraph.',
        'NEVER answer based on outside knowledge — even when you "know" something is true in real life.',
      ],
      vocabulary: [
        { term: 'out-of-scope answer', definition: 'a tempting choice that introduces information not present in or implied by the passage.' },
        { term: 'extreme answer', definition: 'a choice using absolute language ("always," "never") not supported by the passage\'s typically nuanced argument.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A CARS passage on jazz history argues that bebop was a deliberate response to commercial swing music. Question stem: "The author would most likely agree that swing music in the 1940s..." Answer choices include: (A) was popular but lacked artistic merit, (B) was the dominant commercial genre that bebop musicians sought to subvert, (C) suffered a decline due to bebop\'s rise, (D) was equivalent to bebop in artistic value. The passage notes swing\'s commercial dominance and bebop\'s rejection of mainstream conventions. Which answer best fits?',
      expectedAnswer: '(B). The passage states swing was COMMERCIAL and bebop was a deliberate REACTION to it — exactly what (B) reflects. (A) is extreme: "lacked artistic merit" overstates the author\'s position (the passage doesn\'t denigrate swing, just contrasts it with bebop\'s aims). (C) is OUT OF SCOPE — the passage is about why bebop arose, not what happened to swing. (D) directly contradicts the passage — bebop was a reaction AGAINST swing, not equivalent.',
      responseFormat: 'mcq',
      hints: [
        'Eliminate extreme language ("lacked artistic merit").',
        'Eliminate out-of-scope (claims passage didn\'t support).',
        'Eliminate contradictions of stated passage content.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-cars-prep',
      kind: 'misconception_check',
      question: 'CARS performance improves most by reading textbooks on common CARS topics like philosophy and art history. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating CARS as content-acquisition like the science sections.',
          correctsTo: 'False. CARS is the section LEAST responsive to content study. Improvement comes from PRACTICE PASSAGES under timed conditions plus focused review of why you missed the questions you missed. The skill is reading argumentative prose carefully + spotting trap patterns + answering ONLY from the passage. Reading textbooks builds general knowledge but doesn\'t train the reasoning muscle. Use AAMC official CARS passages — they\'re the most representative. Some prep companies (Jack Westin, EK) offer free daily CARS passages, valuable for repetition. The best prep recipe: 2-3 passages daily, untimed at first, then timed; review every wrong answer + every guess until you understand the trap pattern.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '3 skill types: Foundations of Comprehension, Reasoning Within, Reasoning Beyond.',
        '~10 min/passage (9 passages, 90 min). 3-4 min read, 6-7 min questions.',
        'Trap patterns: out-of-scope, extreme, opposite, half-right, true-but-irrelevant.',
        'Stuck between two: find specific passage sentence supporting one.',
        'CARS improves with PRACTICE not content review. Daily passages.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do high-content premeds often plateau on CARS in the 125-127 range despite scoring 130+ on science sections?',
      hint: 'Two reasons: (1) Their reading habits — built for textbooks where authors are explicit and uniformly correct — fail on humanities passages where authors argue, hedge, and present opposing views. They mistake the author\'s ironic summary of a counter-argument for the author\'s position. (2) Their problem-solving instincts push them to "figure out" rather than RE-READ. In science, you derive; in CARS, you locate. The fix is metacognitive: practice slowing down on each question, tracing back to specific passage evidence, and resisting the urge to "solve" answers from intuition. CARS rewards humility and discipline, not reasoning power. Many top scorers report a ceiling break only after they accept the section as fundamentally different from science.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
