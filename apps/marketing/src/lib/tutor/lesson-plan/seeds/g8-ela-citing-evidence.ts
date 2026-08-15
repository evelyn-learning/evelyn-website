/**
 * G8 — Citing textual evidence and direct quotation.
 *
 * How to pull a quote from a text and integrate it into your own
 * sentence. MLA-style page citations.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_ELA_CITING_EVIDENCE: LessonPlan = {
  id: 'evelyn.g8.ela.writing.citing-evidence.v1',
  title: 'Citing textual evidence with direct quotes',
  curriculum: 'CCSS',
  grade: '8',
  subject: 'ela',
  topic: 'writing',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.8.ri.1',
      description: 'Cite textual evidence that supports analysis of what the text says explicitly and inferences drawn from it.',
      standard: 'CCSS.ELA-LITERACY.RI.8.1',
    },
    {
      id: 'ccss.ela.8.w.9',
      description: 'Draw evidence from literary or informational texts to support analysis, reflection, and research.',
      standard: 'CCSS.ELA-LITERACY.W.8.9',
    },
  ],
  prerequisites: ['ccss.ela.6.ri.1'],
  followUps: ['ccss.ela.9-10.ri.1'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make clear: claims without evidence are just opinions.',
      script: 'If I say "the main character is brave", that\'s an opinion. But if I QUOTE a moment where she charges into a burning building, suddenly it\'s an argument. Evidence transforms opinion into analysis.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cee-formula',
      kind: 'concept',
      goal: 'Three steps to integrate evidence: claim → evidence → explanation.',
      keyIdeas: [
        'CLAIM: a specific assertion you\'re making about the text.',
        'EVIDENCE: a direct quotation OR specific paraphrase from the text.',
        'EXPLANATION: connect the evidence back to your claim — show HOW it supports the point.',
        'INTEGRATION: don\'t drop a quote alone. Use a SIGNAL PHRASE: "The narrator says, \'…\'" or "As the author writes, \'…\'".',
        'CITATION: include page or paragraph number in parentheses: (Smith 42) or (Lee, par. 3).',
        'A "FLOATING QUOTE" is a no-no — a quote sentence by itself with no setup or explanation.',
      ],
      vocabulary: [
        { term: 'signal phrase', definition: 'a phrase that introduces a quote, e.g. "the author writes,".' },
        { term: 'citation', definition: 'a mark showing exactly where a quote came from.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-floating-fix',
      kind: 'worked_example',
      problem: 'Floating quote: "The author shows isolation. \'Maya sat alone at the lunch table\' (Smith 12). She is lonely." How do we fix it?',
      steps: [
        'Step 1: Add a SIGNAL PHRASE so the quote isn\'t floating. → "The author shows isolation when the narrator describes that \'Maya sat alone at the lunch table\' (Smith 12)."',
        'Step 2: EXPLAIN — connect to the claim. → "This direct image of solitude during a normally social moment emphasizes Maya\'s emotional disconnection."',
        'Final: "The author shows isolation when the narrator describes that \'Maya sat alone at the lunch table\' (Smith 12). This direct image of solitude during a normally social moment emphasizes Maya\'s emotional disconnection."',
        'NOW it\'s claim → evidence → explanation, smoothly integrated.',
      ],
      answer: 'add a signal phrase + add an explanation sentence',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Take this floating quote and integrate it: "The setting feels eerie. \'Fog crept through the empty streets\' (Park 8)."',
      expectedAnswer: 'Add a signal phrase ("Park writes that…") and an explanation connecting the fog imagery to the eerie atmosphere.',
      responseFormat: 'free',
      hints: [
        'Step 1: introduce the quote with a signal phrase.',
        'Step 2: after the quote, add a sentence explaining HOW it shows the eerie setting.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-quote-speaks-itself',
      kind: 'misconception_check',
      question: 'Once you\'ve quoted the text, does the quote "speak for itself" — no need to explain?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating quotes as self-evident.',
          correctsTo: 'No — the reader doesn\'t know WHY you picked that quote. You must explain HOW it supports your claim. Without explanation, you\'re just decorating with text instead of analyzing.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'CLAIM → EVIDENCE → EXPLANATION (the CEE formula).',
        'NEVER drop a floating quote — always introduce it with a signal phrase.',
        'Cite the source: (Author page) format.',
        'After quoting, EXPLAIN how it supports your point.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What about long quotes (4+ lines)? When and how do you use a "block quote"?',
      hint: 'Block quotes are indented, no quotation marks, used for passages longer than 4 lines. Use them sparingly — most analysis works better with short embedded quotes.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
