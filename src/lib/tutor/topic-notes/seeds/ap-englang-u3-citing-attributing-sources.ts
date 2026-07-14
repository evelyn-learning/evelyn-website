/**
 * AP English Language & Composition — Unit 3 CED 3.2: Citing and
 * Attributing Sources.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.citing-attributing-sources.v1`). Covers the mechanics
 * of bringing a source's exact words or ideas into the writer's own sentence
 * without the reader losing track of whose words are whose — attribution,
 * lead-ins, and grammatical integration.
 *
 * Anchor text referenced in the method's example: Patrick Henry, "Give Me
 * Liberty or Give Me Death" (1775). Quotes are limited to short, structural
 * rhetorical phrases already used as anchor evidence for this speech
 * elsewhere in the unit.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_CITING_ATTRIBUTING_SOURCES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.citing-attributing-sources.v1',
  course: 'AP English Language & Composition',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Citing and Attributing Sources',
  planId: 'evelyn.ap.englang.citing-attributing-sources.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.citing-attributing-sources.v1' }],
  theory: [
    {
      loId: 'apenglang.citing-attributing-sources',
      kind: 'definition',
      title: 'attribution',
      content:
        'A signal telling the reader whose words or idea come next — "According to Source A," "As Henry argues," "The speaker contends" — so a quote or paraphrase is never mistaken for the writer\'s own unsupported assertion.',
    },
    {
      loId: 'apenglang.citing-attributing-sources',
      kind: 'definition',
      title: 'lead-in',
      content:
        'The phrase introducing a quotation, naming its source and framing why it is being used — the first piece of the reliable mechanics for bringing evidence into a sentence.',
    },
    {
      loId: 'apenglang.citing-attributing-sources',
      kind: 'definition',
      title: 'integrated quotation',
      content:
        'A quote grammatically stitched into the writer\'s own sentence rather than standing alone. Reliable mechanics: LEAD-IN + QUOTATION (short, exact, in quotation marks) + INTEGRATION (folded into one grammatical sentence) + attribution if the lead-in didn\'t already supply it.',
    },
    {
      loId: 'apenglang.citing-attributing-sources',
      kind: 'trap',
      title: 'the dropped quote',
      content:
        'A quotation plunked into a paragraph as its own standalone sentence with no lead-in and no grammatical connection to the sentence before or after it — it reads as an interruption, not as evidence the writer is using.',
    },
    {
      loId: 'apenglang.citing-attributing-sources',
      kind: 'strategy',
      title: 'attribute every specific piece, every time',
      content:
        'On the real exam, sources are lettered or labeled ("Source A," "Source B") — a synthesis essay must attribute EVERY specific piece of borrowed evidence to its specific source, every time it appears, not just once at the start of the essay.',
    },
    {
      loId: 'apenglang.citing-attributing-sources',
      kind: 'definition',
      title: 'paraphrase still needs attribution',
      content:
        'Restating a source\'s idea in the writer\'s own words still requires attribution even without quotation marks — "As Henry frames it, further waiting has stopped being a real option" attributes an idea, not just borrowed words, to its source.',
    },
    {
      loId: 'apenglang.citing-attributing-sources',
      kind: 'trap',
      title: 'accuracy of attribution matters',
      content:
        'Crediting an idea to the WRONG source (saying Lincoln said something Henry said) is a factual error that damages the essay\'s credibility, not a minor slip.',
    },
    {
      loId: 'apenglang.citing-attributing-sources',
      kind: 'trap',
      title: 'quotation marks alone are not attribution',
      content:
        'Quotation marks show that words were borrowed, but they don\'t tell the reader WHO said them or WHY the quote is relevant before the reader gets to it. Test: could a reader who skipped the sentence before the quote still tell whose words these are? If not, it\'s a dropped quote, not attribution.',
    },
  ],
  methods: [
    {
      title: 'Attribute and grammatically integrate a quotation',
      when_to_use:
        'Use every time a specific quotation or paraphrase from a source is brought into a synthesis or analysis sentence.',
      steps: [
        'CHOOSE THE SPECIFIC EVIDENCE — a short, exact quotation or a precisely-stated paraphrase.',
        'WRITE A LEAD-IN THAT NAMES THE SOURCE AND FRAMES THE QUOTE\'S RELEVANCE.',
        'DROP IN THE QUOTATION EXACTLY, IN QUOTATION MARKS.',
        'INTEGRATE IT GRAMMATICALLY RATHER THAN LETTING IT STAND ALONE — fold the quotation into the lead-in\'s sentence structure so it reads as one continuous sentence.',
        'CLOSE WITH ATTRIBUTION-AWARE COMMENTARY IF THE LEAD-IN DIDN\'T FULLY NAME THE SOURCE.',
        'CHECK FOR THE DROPPED-QUOTE TEST — read the sentence aloud: does the quotation feel like an interruption, or does it flow as part of one grammatical unit?',
      ],
      example: {
        problem:
          "Integrate evidence from Patrick Henry's 1775 speech into one sentence supporting the claim that Henry manufactures a sense that no time remains to decide.",
        solution:
          "As Patrick Henry warns his fellow delegates at the exact moment he declares that further waiting is no longer possible, \"we must fight! I repeat it, sir, we must fight!\" — a repetition that turns continued hesitation itself into a moral failure.",
      },
      relatedLoIds: ['apenglang.citing-attributing-sources'],
    },
  ],
  pointers: [
    { content: 'Attribution tells the reader whose words or idea come next — never let a quote or paraphrase read as your own unsupported assertion.', kind: 'tip' },
    { content: 'Reliable mechanics: lead-in (names the source, frames relevance) + exact quotation + grammatical integration into one sentence.', kind: 'tip' },
    { content: 'A dropped quote — no lead-in, no grammatical connection — reads as an interruption, not evidence, even with quotation marks.', kind: 'trap' },
    { content: 'Paraphrase needs attribution too, even without quotation marks.', kind: 'tip' },
    { content: 'Attributing an idea to the WRONG source is a factual error that damages credibility — double-check every attribution.', kind: 'trap' },
  ],
};
