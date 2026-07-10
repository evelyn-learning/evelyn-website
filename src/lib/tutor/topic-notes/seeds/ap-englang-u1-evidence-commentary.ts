/**
 * AP English Language & Composition — Unit 1 CED 1.4: Evidence and
 * Commentary.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.evidence-commentary.v1`). Covers the paragraph-level
 * skill of selecting specific evidence and explaining how it works and why
 * it serves the writer's purpose — Row B of the real AP Lang rubric, and the
 * biggest single point-source on the exam.
 *
 * Anchor text referenced in the method's example: Patrick Henry, "Give Me
 * Liberty or Give Me Death" (1775). Quotes are limited to short, structural
 * rhetorical phrases already used elsewhere in the unit as anchor evidence.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_EVIDENCE_COMMENTARY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.evidence-commentary.v1',
  course: 'AP English Language',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Evidence and Commentary',
  planId: 'evelyn.ap.englang.evidence-commentary.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.evidence-commentary.v1' }],
  theory: [
    {
      loId: 'apenglang.evidence-commentary',
      kind: 'definition',
      title: 'evidence',
      content:
        'A specific textual detail — a quote, a rhetorical device, a structural choice — deliberately selected because it supports the paragraph\'s claim. Vague evidence ("the whole speech is emotional") isn\'t usable; specific evidence ("we must fight! I repeat it, sir, we must fight!") is.',
    },
    {
      loId: 'apenglang.evidence-commentary',
      kind: 'definition',
      title: 'commentary',
      content:
        'The explanation that connects the evidence to the paragraph\'s claim — the "so what." It answers: HOW does this specific wording/device work, and WHY does that serve the writer\'s purpose for this audience?',
    },
    {
      loId: 'apenglang.evidence-commentary',
      kind: 'trap',
      title: 'quote-and-drop',
      content:
        'The #1 paragraph-level trap: citing evidence, then moving straight to the next sentence or the next quote with no explanation in between. A quote never speaks for itself — the writer of the analysis has to make it speak.',
    },
    {
      loId: 'apenglang.evidence-commentary',
      kind: 'strategy',
      title: 'commentary traces a chain',
      content:
        'Strong commentary usually does more than restate the quote in other words — restating is not explaining. It traces a chain: what the device IS → what effect it has on the audience → why that effect serves the writer\'s larger purpose (tying back to the rhetorical situation from 1.1).',
    },
    {
      loId: 'apenglang.evidence-commentary',
      kind: 'framework',
      title: 'the reliable paragraph shape',
      content:
        'TOPIC SENTENCE (a mini-claim that supports the thesis) → EVIDENCE (a specific, accurately-quoted detail) → COMMENTARY (how it works + why it matters) → optionally a second evidence/commentary pair → a closing LINK back to the thesis.',
    },
    {
      loId: 'apenglang.evidence-commentary',
      kind: 'strategy',
      title: 'commentary should be the longer half',
      content:
        "Commentary should be proportionally the LONGER part of the evidence-commentary pairing. If a paragraph is mostly quotation with a one-clause explanation tacked on, that's a sign the analysis hasn't actually happened yet.",
    },
    {
      loId: 'apenglang.evidence-commentary',
      kind: 'strategy',
      title: 'evidence beyond direct quotes',
      content:
        "Evidence doesn't have to be a direct quote — naming a structural choice (repetition, a shift in address, escalating short sentences) and citing where it occurs is equally valid evidence, and often the strongest kind because it shows a pattern, not just a single line.",
    },
    {
      loId: 'apenglang.evidence-commentary',
      kind: 'definition',
      title: 'warrant',
      content:
        "The underlying logical link commentary supplies between a piece of evidence and the claim it is meant to support — the reasoning that makes the connection explicit rather than assumed.",
    },
    {
      loId: 'apenglang.evidence-commentary',
      kind: 'strategy',
      title: 'the finished-pair test',
      content:
        "Could a reader who has NOT read the passage still understand, from your commentary alone, why this specific detail matters to your claim? If not, more commentary is needed.",
    },
  ],
  methods: [
    {
      title: 'Build an evidence-and-commentary paragraph',
      when_to_use:
        'Use for each body paragraph after drafting a defensible thesis (1.3), one paragraph per line of reasoning.',
      steps: [
        'WRITE THE TOPIC SENTENCE — state the mini-claim this paragraph will prove.',
        'SELECT THE EVIDENCE — choose a specific, quotable detail or a precisely-named structural choice, and note why this detail (not some other line) was chosen.',
        'NAME WHAT THE DEVICE IS — identify the specific rhetorical device or structural pattern the evidence exhibits.',
        'EXPLAIN HOW IT WORKS ON THE AUDIENCE — describe the mechanism: what effect does this specific wording/device produce for a reader?',
        "EXPLAIN WHY THIS SERVES THE WRITER'S PURPOSE — tie the effect back to the rhetorical situation (1.1): why does this device serve this purpose for this audience better than an alternative would?",
        "LINK BACK TO THE THESIS — close by tying this paragraph's specific point back to the essay's overall claim.",
      ],
      example: {
        problem:
          "Build one body paragraph supporting the claim that Henry manufactures a sense of urgency to make immediate action feel like the only rational choice, drawing on his 1775 speech.",
        solution:
          "Henry's repetition at the speech's climax collapses any remaining sense that time is left to decide. Immediately after declaring \"There is no longer any room for hope,\" he repeats the identical clause rather than varying it — \"If we wish to be free, we must fight! I repeat it, sir, we must fight!\" — and that exact repetition, rather than a fresh argument, performs certainty instead of arguing for it: the decision is made to sound already settled, not still open for debate. Because Henry's purpose is to move a hesitant Convention off the fence and toward an irreversible vote, a device that makes deliberation itself feel finished serves that purpose more directly than another calm, evidence-based appeal could.",
      },
      relatedLoIds: ['apenglang.evidence-commentary'],
    },
  ],
  pointers: [
    { content: 'Quote-and-drop — citing evidence with no explanation — is the #1 paragraph-level failure.', kind: 'trap' },
    { content: 'Commentary should be the LONGER part of the pair, not an afterthought.', kind: 'tip' },
    { content: 'Good commentary explains HOW a device works and WHY it serves the writer\'s purpose — restating the quote is not commentary.', kind: 'trap' },
    { content: 'Shape: topic sentence → evidence → commentary → (optional second pair) → link back to thesis.', kind: 'tip' },
    { content: 'Naming a structural pattern (repetition, a shift in address) is valid evidence — it doesn\'t have to be a single quote.', kind: 'tip' },
    { content: 'Test: could a reader who never saw the passage understand, from your commentary alone, why this detail matters?', kind: 'tip' },
  ],
};
