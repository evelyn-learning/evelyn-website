/**
 * AP English Language & Composition — Unit 9 CED 9.2: MCQ Reading
 * (Rhetorical Analysis) Strategy.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.mcq-reading-strategy.v1`). Covers the reading moves
 * specific to the exam's rhetorical-analysis-style passage questions —
 * meaning-in-context, purpose/effect, and the elimination discipline that
 * turns a 4-way guess into a 2-way one.
 *
 * Anchor text referenced in the method's example: Jonathan Swift, "A Modest
 * Proposal." The teaching point is reading the persona/tone for MCQ-style
 * purpose and meaning-in-context questions; quoting is limited to the
 * canonical "delicious nourishing... food" irony phrase, one short quote
 * only.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_MCQ_READING_STRATEGY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.mcq-reading-strategy.v1',
  course: 'AP English Language & Composition',
  cedUnit: 9,
  cedTopic: '9.2',
  cedTitle: 'MCQ Reading (Rhetorical Analysis) Strategy',
  planId: 'evelyn.ap.englang.mcq-reading-strategy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.mcq-reading-strategy.v1' }],
  theory: [
    {
      loId: 'apenglang.mcq-reading-strategy',
      kind: 'definition',
      title: 'meaning-in-context',
      content:
        'What a word or phrase means/does IN THIS SENTENCE, not in general. The trap: an answer choice that IS a correct dictionary definition of the word but doesn\'t fit how the word functions in THIS passage. Re-read the sentence with each candidate meaning substituted in.',
    },
    {
      loId: 'apenglang.mcq-reading-strategy',
      kind: 'definition',
      title: 'purpose/effect question',
      content:
        'Asks what a sentence, device, or structural choice ACCOMPLISHES for the writer\'s argument or for the reader — not what it says. The trap: an answer that accurately restates the sentence\'s content (summary) instead of naming its function.',
    },
    {
      loId: 'apenglang.mcq-reading-strategy',
      kind: 'definition',
      title: 'persona',
      content:
        'The constructed voice/character a writer adopts, which may differ from the writer\'s own actual views (as in satire). On satire/persona passages, don\'t confuse the persona\'s stated view with the writer\'s actual purpose — the gap between them often IS the tested effect.',
    },
    {
      loId: 'apenglang.mcq-reading-strategy',
      kind: 'framework',
      title: 'four classic distractor types',
      content:
        'Recognize and eliminate fast: (1) TRUE BUT IRRELEVANT — accurate about the passage but doesn\'t answer the actual question asked; (2) TOO BROAD — describes the whole passage\'s purpose when the question asks about one sentence/device; (3) TOO NARROW — describes only part of what the cited device does, missing its full effect; (4) OPPOSITE OR REVERSED — gets the direction of the effect backwards.',
    },
    {
      loId: 'apenglang.mcq-reading-strategy',
      kind: 'strategy',
      title: 're-anchor to the cited lines',
      content:
        'A choice can be well-written and plausible-sounding in isolation but simply not match what happens at the cited lines — go back to the text before trusting your memory of "roughly what that part said."',
    },
    {
      loId: 'apenglang.mcq-reading-strategy',
      kind: 'strategy',
      title: 'eliminate first, then weigh',
      content:
        'Process of elimination beats searching for "the right answer" cold. First eliminate any choice that is flatly wrong about the passage\'s content, THEN weigh the remaining choices against the specific question stem (meaning vs. purpose vs. effect) — most 4-way questions collapse to a 2-way choice this way.',
    },
    {
      loId: 'apenglang.mcq-reading-strategy',
      kind: 'trap',
      title: 'length/specificity is not a tie-breaker',
      content:
        'Picking whichever answer is longer or more specific-sounding is not evidence it is correct — test-writers deliberately craft plausible-sounding wrong answers of any length. The real tie-breaker is re-reading the cited lines against the exact question stem.',
    },
    {
      loId: 'apenglang.mcq-reading-strategy',
      kind: 'strategy',
      title: 'tone/persona questions read the gap',
      content:
        'Tone and persona questions (common on satire/irony passages) ask you to read the GAP between what a passage says and what it means — a persona speaking with calm, reasonable confidence about something the reader recognizes as monstrous IS the tone.',
    },
  ],
  methods: [
    {
      title: 'Eliminate distractors on a purpose/effect MCQ',
      when_to_use:
        'Use on any MCQ asking what a cited sentence, tone, or device accomplishes (not what it says).',
      steps: [
        'READ THE QUESTION STEM CAREFULLY — confirm it asks for an EFFECT/PURPOSE, which rules out any choice that just restates content.',
        'ELIMINATE CHOICES THAT ARE TRUE BUT IRRELEVANT — accurate about the passage but not an answer to the specific question asked.',
        'ELIMINATE CHOICES THAT ARE REVERSED OR WRONG ABOUT THE PASSAGE\'S ACTUAL CONTENT.',
        'ELIMINATE CHOICES THAT CONFUSE THE PERSONA WITH THE WRITER, on satire/irony passages.',
        'CONFIRM THE REMAINING CHOICE AGAINST THE CITED LINES — check it names a specific effect tied to the device\'s place in the passage.',
      ],
      example: {
        problem:
          "A question asks the primary rhetorical effect of the proposer's calm, statistic-laden tone describing impoverished mothers, with choices: (A) express Swift's genuine concern, (B) establish the proposer as reasonable before revealing a monstrous solution, (C) summarize Ireland's economic condition, (D) criticize mothers for failing their children.",
        solution:
          "(C) is eliminated as true-but-irrelevant (a content summary, not a tone effect). (D) is eliminated as reversed — the tone reads as concern, not criticism. (A) is eliminated as confusing the ironic persona with Swift's actual purpose. (B) is confirmed against the cited lines: the calm, data-driven tone builds the persona's credibility right before the ironic proposal lands — a specific, defensible rhetorical effect.",
      },
      relatedLoIds: ['apenglang.mcq-reading-strategy'],
    },
  ],
  pointers: [
    { content: 'Meaning-in-context asks what a word does IN THIS SENTENCE, not its dictionary definition.', kind: 'tip' },
    { content: 'Four distractor types: true-but-irrelevant, too broad, too narrow, opposite/reversed — name the type to eliminate fast.', kind: 'tip' },
    { content: 'Always re-anchor a choice to the cited line numbers before trusting your memory of the passage.', kind: 'tip' },
    { content: 'Eliminate the clearly wrong choices first, then weigh survivors against the exact question stem.', kind: 'tip' },
    { content: 'On satire/persona passages, the gap between the persona\'s stated view and the writer\'s actual purpose is often the tested effect.', kind: 'tip' },
    { content: 'A long, specific-sounding answer is not automatically correct — length is not a tie-breaker.', kind: 'trap' },
  ],
};
