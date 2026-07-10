/**
 * AP English Language & Composition — CED Unit 3.2: Citing and Attributing
 * Sources.
 *
 * Builds on 3.1 (understanding the synthesis task): once a student can name
 * the shared issue and a defensible position, they need the mechanics to
 * bring a source's exact words or ideas into their own sentence without the
 * reader losing track of whose words are whose. On the real exam, sources
 * are lettered ("Source A," "Source B") and every specific piece of evidence
 * must be attributed to its specific source — an unattributed or misattributed
 * quote is both a mechanics error and a credibility problem.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Patrick Henry, "Give Me Liberty or Give Me Death" (1775) —
 * evelyn.passage.henry-give-me-liberty.v1. The teaching point is attribution
 * and integration mechanics, not the historical conflict — quotes below are
 * limited to the short, structural rhetorical phrases already used as anchor
 * evidence for this speech elsewhere in the unit.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U3_CITING_ATTRIBUTING_SOURCES: LessonPlan = {
  id: 'evelyn.ap.englang.citing-attributing-sources.v1',
  title: 'U3.2 Citing and Attributing Sources',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.citing-attributing-sources',
      description:
        "Attribute quoted or paraphrased material to its specific source using a lead-in and integrate the quotation grammatically into the writer's own sentence, without dropping quotes or misattributing ideas.",
      standard: 'AP-ENGLANG-3.2',
    },
  ],
  prerequisites: ['apenglang.the-synthesis-task'],
  followUps: ['apenglang.position-across-sources'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel why unattributed quotations confuse a reader about whose words or ideas are on the page.',
      script:
        "Imagine reading a group text where nobody's name shows up next to their messages — just a wall of lines. You'd have no idea who said what, who agreed with whom, or who you should hold to a claim. Writing that borrows someone else's words works the same way: if you drop in a quote with no signal of whose it is, your reader can't tell where your source's idea ends and your own sentence begins. In a synthesis essay, with multiple sources in play at once, that confusion gets worse fast. Today we build the habit of always making it obvious, in the sentence itself, whose words and ideas the reader is looking at.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-attribution-integration',
      kind: 'concept',
      goal: 'Define attribution and quotation integration, name the reliable mechanics for both, and flag the two most common errors.',
      keyIdeas: [
        "ATTRIBUTION signals to the reader whose words or idea come next — 'According to Source A,' 'As Henry argues,' 'The speaker contends' — so a quote or paraphrase is never mistaken for the writer's own unsupported assertion.",
        'On the real exam, sources are lettered or labeled ("Source A," "Source B") — a synthesis essay must attribute EVERY specific piece of borrowed evidence to its specific source, every time it appears, not just once at the start of the essay.',
        "The reliable mechanics: LEAD-IN (a phrase naming the source and framing why you're about to quote it) + QUOTATION (short, exact, in quotation marks) + INTEGRATION (the quote is grammatically stitched into your own sentence) + attribution if the lead-in didn't already supply it.",
        "A DROPPED QUOTE is a quotation plunked into a paragraph as its own standalone sentence with no lead-in and no grammatical connection to the sentence before or after it — it reads as an interruption, not as evidence the writer is using.",
        'PARAPHRASE also needs attribution even without quotation marks — "As Henry frames it, further waiting has stopped being a real option" attributes an idea, not just borrowed words, to its source.',
        "ACCURACY of attribution matters as much as its presence: crediting an idea to the WRONG source (saying Lincoln said something Henry said) is a factual error that damages the essay's credibility, not a minor slip.",
      ],
      vocabulary: [
        { term: 'attribution', definition: "a signal telling the reader whose words or idea are being used — naming the specific source." },
        { term: 'lead-in', definition: 'the phrase introducing a quotation, naming its source and framing why it is being used.' },
        { term: 'integrated quotation', definition: "a quote grammatically stitched into the writer's own sentence rather than standing alone." },
        { term: 'dropped quote', definition: 'a quotation inserted with no lead-in or grammatical connection to the surrounding sentence.' },
        { term: 'paraphrase', definition: "restating a source's idea in the writer's own words — still requires attribution." },
      ],
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-integrate-henry-quote',
      kind: 'worked_example',
      problem:
        "Integrate evidence from Patrick Henry's 1775 speech (mentioned here in prose — this segment type carries no passageId field — the resolved text is evelyn.passage.henry-give-me-liberty.v1) into one sentence supporting the claim that Henry manufactures a sense that no time remains to decide.",
      steps: [
        'CHOOSE THE SPECIFIC EVIDENCE. The repeated declarative: "we must fight! I repeat it, sir, we must fight!"',
        "WRITE A LEAD-IN THAT NAMES THE SOURCE AND FRAMES THE QUOTE'S RELEVANCE. 'As Patrick Henry warns his fellow delegates at the moment he declares further waiting impossible, ...'",
        "DROP IN THE QUOTATION EXACTLY, IN QUOTATION MARKS. '...\"we must fight! I repeat it, sir, we must fight!\"'",
        'INTEGRATE IT GRAMMATICALLY RATHER THAN LETTING IT STAND ALONE. Fold the quotation into the lead-in\'s sentence structure so it reads as one continuous sentence, not two.',
        'CLOSE WITH ATTRIBUTION-AWARE COMMENTARY IF THE LEAD-IN DIDN\'T FULLY NAME THE SOURCE. Confirm the sentence makes clear, without a separate citation tag, that these are Henry\'s exact words.',
        "CHECK FOR THE DROPPED-QUOTE TEST. Read the sentence aloud: does the quotation feel like an interruption, or does it flow as part of one grammatical unit? If it reads as an interruption, revise the lead-in.",
      ],
      answer:
        'As Patrick Henry warns his fellow delegates at the exact moment he declares that further waiting is no longer possible, "we must fight! I repeat it, sir, we must fight!" — a repetition that turns continued hesitation itself into a moral failure.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-attribute-integrate',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.henry-give-me-liberty.v1, write ONE sentence that properly attributes and grammatically integrates a specific quotation from Henry (e.g. \"there is no longer any room for hope\" or \"the next gale... will bring to our ears the clash of resounding arms\") in support of the claim that Henry treats peace as no longer available. Your sentence must include a lead-in naming Henry as the source and must NOT drop the quote in as a standalone sentence.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      rubric: {
        parts: [
          {
            criterionId: 'attribution-integration',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the sentence (a) names Henry (or 'the speaker'/'Henry') as the source of the quotation in a lead-in, (b) quotes accurately and relevantly to the stated claim (peace no longer being available), and (c) integrates the quotation grammatically into one continuous sentence rather than dropping it in as a separate, disconnected sentence. Partial credit (3-4) if attribution is present but the quote is dropped in with awkward or absent grammatical connection, or if the quote is integrated but the lead-in never actually names the source. Partial credit (1-2) if a quote is included with no attribution at all (an unattributed dropped quote), or if the quote is misattributed to the wrong speaker. No credit for a sentence with no quotation, a fabricated quotation, or a quotation entirely irrelevant to the stated claim.",
            modelResponse:
              'Henry insists that peace itself has become an illusion rather than an option still on the table, declaring flatly, "there is no longer any room for hope," before warning that "the next gale that sweeps from the north will bring to our ears the clash of resounding arms."',
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-quote-marks-enough',
      kind: 'misconception_check',
      question:
        'A student writes: "We must fight! I repeat it, sir, we must fight! This proves Henry wanted war." They put quotation marks around the borrowed words. Is that sufficient attribution?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Believing that quotation marks alone attribute a quote — treating a DROPPED QUOTE (no lead-in, no name, no grammatical connection) as properly cited evidence.",
          correctsTo:
            "No — quotation marks show that words were borrowed, but they don't tell the reader WHO said them or WHY this quote is relevant before the reader gets to it; the quotation just appears as its own sentence with nothing connecting it to what came before. A lead-in is required: 'As Henry declares at the speech's climax, \"we must fight! I repeat it, sir, we must fight!\"' names the source, signals the quote is coming, and folds it into one grammatical sentence. The test: could a reader who skipped the sentence before the quote still tell whose words these are? If not, it's a dropped quote, not attribution.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Attribution tells the reader whose words or idea come next — never let a quote or paraphrase read as your own unsupported assertion.',
        'Reliable mechanics: lead-in (names the source, frames relevance) + exact quotation + grammatical integration into one sentence.',
        'A dropped quote — no lead-in, no grammatical connection — reads as an interruption, not evidence, even with quotation marks.',
        'Paraphrase needs attribution too, even without quotation marks.',
        'Attributing an idea to the WRONG source is a factual error that damages credibility, not a minor slip — double-check every attribution.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.2',
    cedTitle: 'Citing and Attributing Sources',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP English Language' },
    ],
  },
};
