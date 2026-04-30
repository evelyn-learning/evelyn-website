/**
 * SAT Reading — History / Social Studies passages.
 *
 * Founding documents, "Great Conversation" texts, evidence-based reasoning.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_READING_HISTORY: LessonPlan = {
  id: 'evelyn.sat.reading.history.v1',
  title: 'SAT Reading — History / Social Studies Passages',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'sat.reading-history',
      description: 'Apply specific strategies to history and social studies passages on the SAT Reading section, including founding documents and the "Great Conversation".',
      standard: 'SAT-READING-HIST',
    },
  ],
  prerequisites: ['sat.reading-evidence'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'History passages have specific argument structure.',
      script: 'SAT history passages aren\'t just dense old prose — they\'re ARGUMENTS. The author is making a case (often using formal language) and the SAT tests whether you can identify what they\'re arguing, what evidence they use, and what assumptions they make. Founding documents (Federalist Papers, Constitution, MLK speeches) appear regularly. Read for STRUCTURE: claim → reason → evidence → conclusion.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Reading history passages for argument structure.',
      keyIdeas: [
        'IDENTIFY THE CLAIM: what is the author arguing FOR? Often stated in the first paragraph or last paragraph. Look for "I propose...", "I contend...", "Therefore...".',
        'IDENTIFY THE OPPOSITION: many history passages address an opposing view. Mark phrases like "Some argue...", "It has been said...". The author then refutes.',
        'TYPES OF EVIDENCE: HISTORICAL examples, LEGAL/CONSTITUTIONAL precedents, MORAL principles, EMPIRICAL claims about facts. Identify which type the author uses.',
        'RHETORICAL STRATEGIES: appeals to founders / authority, parallelism, repetition, antithesis (X but not Y). MLK\'s "Letter from Birmingham Jail" is a master class.',
        'PAIRED PASSAGES: the SAT often pairs two passages on related topics — e.g., Federalist vs Anti-Federalist on the Constitution. Compare positions, not just agree-disagree. Where exactly do they differ?',
        'OLD-FASHIONED VOCABULARY: founding-era texts use formal language. "Whence" (from where), "wont" (accustomed to), "shall" (must), "consanguinity" (blood relation). Don\'t panic — context usually clarifies.',
        'INFERRED ARGUMENT: history passages often ASSUME things. SAT may ask about an UNSTATED ASSUMPTION. Look for what the author takes for granted in their reasoning.',
        'AUTHOR\'S PURPOSE: not always "to inform". Can be "to defend a position", "to refute", "to advocate", "to warn". Identify the action the author wants the reader to take or accept.',
        'DATA/CHART QUESTIONS: some history passages include a graph or table. Read it carefully — values, axes, time period. Some questions ask whether the data SUPPORTS or UNDERMINES a claim in the passage.',
      ],
      vocabulary: [
        { key: 'claim', term: 'claim', definition: 'the central argument the author is making.' },
        { term: 'rhetoric', definition: 'language designed to persuade, not just inform.' },
        { term: 'antithesis', definition: 'a rhetorical device juxtaposing contrasting ideas (e.g., "ask not what your country can do for you...").' },
      ].map(({ term, definition }) => ({ term, definition })),
      estimatedMinutes: 5,
    },
    {
      id: 'worked-paired',
      kind: 'worked_example',
      problem: 'A paired passage gives Hamilton (Federalist 78) defending judicial review and Brutus (Anti-Federalist) opposing it. How do you compare their positions efficiently?',
      steps: [
        'Hamilton\'s claim: courts must have power to strike down unconstitutional laws — protects rights against legislative excess.',
        'Brutus\'s claim: unelected judges given final word over elected legislators is anti-democratic.',
        'KEY DIFFERENCE: not WHETHER courts should rule, but WHO should have final say — Constitution-protected courts (Hamilton) or elected legislatures (Brutus).',
        'Both AGREE that the Constitution should be authoritative. They DISAGREE on who interprets it.',
        'When the SAT asks "what would Brutus most likely say about Hamilton\'s argument?", look for Brutus\'s OWN words about courts vs democracy. Use his framing, not yours.',
        'STRATEGY: skim each passage; then read their THESIS sentences side by side; identify the precise point of disagreement.',
      ],
      answer: 'Both accept Constitutional supremacy; they disagree on whether unelected judges or elected legislators should have final interpretive authority.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In Federalist 51, Madison writes: "If men were angels, no government would be necessary." What unstated assumption does this argument rely on?',
      expectedAnswer: 'That humans are NOT angels — that they are flawed, self-interested, or capable of harm. The whole argument for government rests on this assumption about human nature.',
      responseFormat: 'free',
      hints: [
        'What does Madison take for granted to make this point?',
        'The conditional ("if angels") implies a contrasting reality.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-old-language',
      kind: 'misconception_check',
      question: 'When you hit unfamiliar 18th-century language ("whereas", "wherefore", "consanguinity"), should you skip the sentence?',
      commonErrors: [
        {
          answer: 'yes, skip it',
          misconception: 'Avoiding unfamiliar wording.',
          correctsTo: 'No — the SAT often tests precisely those formal phrases. Use CONTEXT: surrounding sentences usually clarify the meaning. "Whereas" introduces a fact ("given that..."). "Wherefore" means "for which reason / why". "Heretofore" means "until now". The sentence usually makes sense once you slot the modern equivalent. Skip and you may miss the central claim.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Identify CLAIM + OPPOSITION + EVIDENCE structure.',
        'Founding-era language: use context, don\'t skip.',
        'Paired passages: find the precise point of disagreement.',
        'Watch for unstated assumptions and rhetorical strategies (antithesis, parallelism).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the SAT include "Great Conversation" texts (Founding documents, MLK, Thoreau, Susan B. Anthony)?',
      hint: 'They train two skills at once: close reading of dense argumentative prose, AND civic literacy. The SAT was redesigned in 2016 partly to ensure students engage with foundational American texts. The exam is making a curricular statement, not just testing reading. Knowing these texts helps both on the test and as a citizen.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
