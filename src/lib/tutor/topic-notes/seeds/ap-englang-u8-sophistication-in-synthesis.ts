/**
 * AP English Language & Composition — Unit 8 CED 8.4: Sophistication in
 * Synthesis.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.sophistication-in-synthesis.v1`). The capstone of the
 * unit: bringing credibility awareness (8.1), disagreement-handling (8.2),
 * and qualification (8.3) into a single synthesis stance that SITUATES
 * multiple sources in a broader conversation across time, rather than
 * treating them as a list of separately-supported points.
 *
 * Anchor texts referenced in the method's example: Patrick Henry (1775),
 * Frederick Douglass (1852), Abraham Lincoln's Gettysburg Address (1863).
 * Quotes are limited to the short structural/rhetorical phrases already used
 * as anchor evidence elsewhere in the course.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_SOPHISTICATION_IN_SYNTHESIS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.sophistication-in-synthesis.v1',
  course: 'AP English Language',
  cedUnit: 8,
  cedTopic: '8.4',
  cedTitle: 'Sophistication in Synthesis',
  planId: 'evelyn.ap.englang.sophistication-in-synthesis.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.sophistication-in-synthesis.v1' }],
  theory: [
    {
      loId: 'apenglang.sophistication-in-synthesis',
      kind: 'definition',
      title: 'sophistication (synthesis)',
      content:
        'Not extra vocabulary or a longer thesis — showing that sources are in a CONVERSATION with each other and the broader issue, not just serving as separate pieces of evidence lined up for one claim.',
    },
    {
      loId: 'apenglang.sophistication-in-synthesis',
      kind: 'definition',
      title: 'broader conversation',
      content:
        'The larger, shared question or tradition multiple sources are all responding to, even across different eras — e.g. "once a nation declares liberty its founding promise, who actually receives it, and who has to keep fighting for it?"',
    },
    {
      loId: 'apenglang.sophistication-in-synthesis',
      kind: 'definition',
      title: 'through-line',
      content:
        'A claim traced across sources in sequence, where each source extends, revises, or answers the one(s) before it — read as stages of one ongoing conversation, not separate opinions.',
    },
    {
      loId: 'apenglang.sophistication-in-synthesis',
      kind: 'framework',
      title: 'situating sources in a broader conversation',
      content:
        'Situating means identifying the larger question or tradition the sources are all responding to — even across decades — and showing how each source EXTENDS, REVISES, or ANSWERS the one(s) before it, rather than standing alone.',
    },
    {
      loId: 'apenglang.sophistication-in-synthesis',
      kind: 'strategy',
      title: 'the stand-back move',
      content:
        'One reliable move: end a key paragraph (or the essay) by stepping back to state what the sources TOGETHER reveal that no single source states on its own. The through-line itself becomes part of the thesis, not just a transition sentence.',
    },
    {
      loId: 'apenglang.sophistication-in-synthesis',
      kind: 'trap',
      title: 'the surface-level trap',
      content:
        'An essay that competently executes evidence-and-commentary, handles disagreement, and qualifies its claim, yet still reads as a LIST of separate, well-supported points rather than a single argument that has genuinely thought about how the sources relate to each other and to the world beyond the texts.',
    },
    {
      loId: 'apenglang.sophistication-in-synthesis',
      kind: 'strategy',
      title: 'name why the tension matters',
      content:
        'Sophistication also means naming WHY the tension, qualification, or credibility question surfaced earlier in the essay actually MATTERS to the larger stakes of the issue — not just resolving it and moving on to the next paragraph.',
    },
    {
      loId: 'apenglang.sophistication-in-synthesis',
      kind: 'strategy',
      title: 'the one-source test',
      content:
        'Test a claimed sophisticated sentence by asking: could it have been written after reading only ONE of the sources? If yes, it isn\'t sophistication — it\'s just describing that one source in advanced language. Genuine sophistication requires the relationship BETWEEN sources.',
    },
  ],
  methods: [
    {
      title: 'Build a through-line claim across multiple sources',
      when_to_use:
        'Use for a synthesis essay\'s stand-back paragraph (often the conclusion or a key body paragraph), after evidence, disagreement-handling, and qualification are already in place.',
      steps: [
        'NAME THE BROADER QUESTION ALL THE SOURCES ARE RESPONDING TO, even across a wide span of time.',
        'TRACE THE THROUGH-LINE STAGE BY STAGE — state what each source does in sequence, showing how later sources extend, revise, or answer earlier ones.',
        'NAME WHAT NO SINGLE SOURCE STATES ALONE — the claim that only emerges from reading the sequence together.',
        'STATE THE STAND-BACK CLAIM explicitly, folding the through-line into the thesis rather than tacking it on as a closing flourish.',
        'VERIFY SOPHISTICATION, NOT SUMMARY — confirm the claim could not be made by any one source alone.',
      ],
      example: {
        problem:
          "Using Henry (1775), Douglass (1852), and Lincoln (1863), build a sophisticated synthesis claim that situates these three texts in a broader conversation about American liberty, rather than treating them as three separate opinions.",
        solution:
          "Read individually, Henry demands liberty through force, Douglass exposes who was excluded from it, and Lincoln admits the work remains unfinished — three separate, well-supported points. Read together, across 88 years, they reveal something none states alone: that securing liberty was never a single completed event but a promise perpetually reopened by whoever it has failed to include, restated in each era's own terms.",
      },
      relatedLoIds: ['apenglang.sophistication-in-synthesis'],
    },
  ],
  pointers: [
    { content: 'Sophistication is a specific analytical move — situating sources in relation to each other — not more sources or fancier vocabulary.', kind: 'tip' },
    { content: 'The surface-level trap: competently executing evidence, disagreement-handling, and qualification without ever connecting the sources to each other.', kind: 'trap' },
    { content: 'The one-source test: if a "sophisticated" sentence could have been written from just one source, it isn\'t sophistication yet.', kind: 'tip' },
    { content: 'Trace a through-line across time: each source extends, revises, or answers the one(s) before it.', kind: 'tip' },
    { content: 'The stand-back claim belongs IN the thesis, not bolted on as a closing sentence.', kind: 'tip' },
    { content: 'Sophistication is the rarest, highest-scoring rubric row — it rewards this stand-back move specifically.', kind: 'tip' },
  ],
};
