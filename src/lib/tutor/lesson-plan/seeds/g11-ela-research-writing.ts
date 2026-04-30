/**
 * G11 — ELA: Research writing (sources, citation, synthesis).
 *
 * Multi-source research papers. Evaluating credibility (CRAAP test),
 * integrating evidence smoothly with signal phrases, MLA in-text
 * citations and Works Cited basics, avoiding plagiarism, synthesizing
 * across sources rather than reporting one at a time.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ELA_RESEARCH_WRITING: LessonPlan = {
  id: 'evelyn.g11.ela.research-writing.v1',
  title: 'Research Writing: Sources, Citation, Synthesis',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'writing',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.w.11-12.7',
      description: 'Conduct short and sustained research projects, synthesizing multiple sources.',
      standard: 'CCSS.ELA-LITERACY.W.11-12.7',
    },
    {
      id: 'ccss.ela.w.11-12.8',
      description: 'Gather information from multiple authoritative sources; assess strengths and limitations.',
      standard: 'CCSS.ELA-LITERACY.W.11-12.8',
    },
  ],
  prerequisites: ['ccss.ela.w.8.7'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Distinguish research writing from "summary of one Wikipedia page".',
      script: 'Research writing isn\'t copying facts from one website. It\'s gathering 3-6 different sources, evaluating which are credible, and SYNTHESIZING — putting them in conversation with each other. The output should sound like YOU, building an argument from evidence — not a stitched-together pile of quotes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-research-skills',
      kind: 'concept',
      goal: 'CRAAP test for sources, signal phrases, MLA basics, synthesis vs reporting, plagiarism avoidance.',
      keyIdeas: [
        'EVALUATING SOURCES — the CRAAP test:',
        '  C — Currency: how recent? (Critical for science / current events.)',
        '  R — Relevance: does it answer YOUR question?',
        '  A — Authority: who wrote it? Credentials? .edu / .gov vs random blog?',
        '  A — Accuracy: is the info verifiable? Cited evidence?',
        '  P — Purpose: why was it written? Inform, persuade, sell?',
        'AVOID: Wikipedia as a primary source (use it to find better sources via its citations); pure opinion blogs; AI-generated articles.',
        'SIGNAL PHRASES introduce a quote or paraphrase: "According to Smith...", "Jones argues that...", "A 2020 study by the CDC found...". Tells the reader where the info comes from BEFORE the quote.',
        'IN-TEXT MLA CITATION: (Author Page#) at the end of the sentence. "...mass extinction events shape evolution (Smith 42)."',
        'WORKS CITED list at the end: alphabetical by author. Format: Last, First. Title. Publisher, Year. (Lookup specific format per source type.)',
        'SYNTHESIS vs REPORTING:',
        '  REPORTING: Source A says X. Source B says Y. Source C says Z. (Boring — just a list.)',
        '  SYNTHESIS: Sources agree that X, but A and B disagree on whether Y or Z. (Putting sources in dialogue.)',
        'PLAGIARISM = using someone\'s words or ideas without credit. To avoid: cite EVERY non-original idea, not just direct quotes. Paraphrasing without citation is still plagiarism.',
      ],
      vocabulary: [
        { term: 'CRAAP test', definition: 'Currency, Relevance, Authority, Accuracy, Purpose.' },
        { term: 'signal phrase', definition: 'a phrase that introduces a quote or paraphrase.' },
        { term: 'synthesis', definition: 'combining multiple sources to build a new argument.' },
        { term: 'plagiarism', definition: 'using someone else\'s words or ideas without credit.' },
      ],
      suggestedTools: ['show_text', 'show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-craap',
      kind: 'worked_example',
      problem: 'You\'re researching climate change for a paper. Apply CRAAP to: a 2008 article on a personal blog by someone who calls themselves a "free thinker."',
      steps: [
        'C (Currency): 2008 — climate science has moved a LOT since then. Outdated.',
        'R (Relevance): depends on the topic. May or may not.',
        'A (Authority): "free thinker" is not a credential. No expertise indicated.',
        'A (Accuracy): personal blogs rarely cite peer-reviewed evidence.',
        'P (Purpose): unclear — could be persuasion or speculation.',
        'CONCLUSION: skip this source. Find a peer-reviewed scientific paper or a .gov / .edu / IPCC report instead.',
      ],
      answer: 'Reject — fails Currency, Authority, Accuracy',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-citation',
      kind: 'worked_example',
      problem: 'Integrate this fact into a paragraph with proper signal phrase and MLA citation: A 2021 study by NASA scientist Dr. Hayhoe found Arctic sea ice has dropped 13% per decade since 1979. (Source: Hayhoe, "Arctic Decline," 2021, page 7.)',
      steps: [
        'Use a signal phrase to introduce: "According to a 2021 NASA study by Dr. Katharine Hayhoe..."',
        'State the fact in your own words or quote.',
        'Add MLA citation at the end: "(Hayhoe 7)".',
        'Full sentence: "According to a 2021 NASA study by Dr. Katharine Hayhoe, Arctic sea ice has declined by approximately 13% per decade since 1979 (Hayhoe 7)."',
      ],
      answer: 'See integrated sentence above',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You paraphrase an idea from a source but use your own words. Do you still need to cite?',
      expectedAnswer: 'Yes',
      responseFormat: 'free',
      hints: [
        'Plagiarism is using someone\'s IDEAS without credit, not just their words.',
        'Even paraphrased material gets cited.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-quote-pile',
      kind: 'misconception_check',
      question: 'Owen\'s research paper has 8 quotes back-to-back with little of his own writing between. He thinks "more sources = better paper." What\'s the issue?',
      commonErrors: [
        {
          answer: 'nothing',
          misconception: 'Stacking quotes without analysis — letting sources speak instead of YOU using them.',
          correctsTo: 'A research paper should be YOUR argument, with sources as evidence. If 80% of the paper is quotations, the reader hears the sources, not you. Aim for sources to be ~25-30% of the writing — the rest is your synthesis, analysis, and reasoning. Quote ONLY when the original wording is essential.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'CRAAP: Currency, Relevance, Authority, Accuracy, Purpose.',
        'Use signal phrases before quotes.',
        'MLA in-text: (Author Page).',
        'Synthesis = sources in dialogue, not stacked.',
        'Cite paraphrases, not just direct quotes.',
        'Your voice should drive the paper; sources are evidence.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'You find Source A and Source B disagreeing on a fact. How do you handle that in your paper?',
      hint: 'Don\'t hide it. Acknowledge the disagreement, evaluate which source is more credible per CRAAP, and explain WHY you trust one over the other. That\'s sophisticated writing.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
