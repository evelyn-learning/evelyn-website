import type { Passage } from '../types';

/**
 * AP U.S. Government and Politics — Practice Exam A stimulus (mock exam).
 *
 * Per the Task-11 authoring brief, this form uses exactly ONE shared
 * foundational-document passage: a compiled two-document excerpt (Federalist
 * No. 10 and Federalist No. 51, both James Madison writing as "Publius")
 * that anchors a small set of MCQ items asking students to compare/interpret
 * across the two documents. Text is copied verbatim from the already-vetted
 * practice-bank seeds (`apush-federalist-10.ts`, `apgov-federalist-51.ts`) —
 * same canonical public-domain wording, new passage id/slug so this mock
 * form does not share a live passageId with practice-bank items (guardrail
 * 8/6: fresh stimulus set, no cross-linked content).
 *
 * All other required-document/required-case MCQ items in this form are
 * discrete knowledge/application items (no stimulus needed) or use short,
 * high-confidence quotes/paraphrases inline in problemText per the
 * PD-QUOTE rule — not routed through this passage.
 */
export const APGOV_MOCK_A_PASSAGES: Passage[] = [
  {
    id: 'evelyn.passage.apgov-mock-a-federalist-10-51.v1',
    title: 'Federalist No. 10 and Federalist No. 51 (excerpts)',
    author: 'James Madison (writing as "Publius")',
    year: 1788,
    sourceUrl: 'https://en.wikisource.org/wiki/The_Federalist_Papers/No._10',
    license: 'public-domain',
    genre: 'document',
    fullText:
      `The following two excerpts are from essays James Madison wrote (under the pen name "Publius") to urge ratification of the proposed Constitution.\n\n` +
      `Document 1 — Federalist No. 10 (1787)\n` +
      `"By a faction, I understand a number of citizens, whether amounting to a majority or a minority of the whole, who are united and actuated by some common impulse of passion, or of interest, adverse to the rights of other citizens, or to the permanent and aggregate interests of the community."\n\n` +
      `Document 2 — Federalist No. 51 (1788)\n` +
      `"But the great security against a gradual concentration of the several powers in the same department, consists in giving to those who administer each department the necessary constitutional means, and personal motives, to resist encroachments of the others. ... Ambition must be made to counteract ambition. The interest of the man must be connected with the constitutional rights of the place. ... If men were angels, no Government would be necessary. If angels were to govern men, neither external nor internal controls on Government would be necessary."`,
    lineNumbered: true,
    wordCount: 174,
  },
];
