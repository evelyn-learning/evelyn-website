/**
 * AP English Language & Composition — Unit 6 CED 6.3: Figurative Language
 * and Rhetorical Schemes.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.figurative-language-schemes.v1`). Adds figurative
 * language — TROPES (metaphor, analogy: substituting or mapping meaning) —
 * and RHETORICAL SCHEMES (antithesis, anaphora: patterns of arrangement) as
 * a third style lens, connecting each device to its persuasive effect.
 *
 * Anchor texts referenced in the method's example: Frederick Douglass's
 * escalating antithesis-and-anaphora catalog (1852) and Patrick Henry's
 * "Give Me Liberty or Give Me Death" (1775). Quotes are limited to short
 * structural/rhetorical phrases per content-safety guidance.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_FIGURATIVE_LANGUAGE_SCHEMES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.figurative-language-schemes.v1',
  course: 'AP English Language & Composition',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Figurative Language and Rhetorical Schemes',
  planId: 'evelyn.ap.englang.figurative-language-schemes.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.figurative-language-schemes.v1' }],
  theory: [
    {
      loId: 'apenglang.figurative-language-schemes',
      kind: 'definition',
      title: 'trope vs. scheme',
      content:
        'A **trope** (figurative language) shifts a word or phrase\'s meaning beyond its literal sense — it asks "what does this stand for?" A **scheme** (rhetorical pattern) arranges words or clauses without changing their literal meaning — it asks "how is this arranged, and what does the pattern itself do?" The distinction matters because the two are analyzed differently.',
    },
    {
      loId: 'apenglang.figurative-language-schemes',
      kind: 'definition',
      title: 'metaphor and analogy',
      content:
        '**Metaphor** is an implied comparison between two unlike things ("hope is a siren"), without "like" or "as." **Analogy** is an extended comparison that maps one relationship onto another to make an abstract or unfamiliar idea concrete. Both let a reader FEEL a judgment (danger, betrayal, hypocrisy) instead of just being told to accept it.',
    },
    {
      loId: 'apenglang.figurative-language-schemes',
      kind: 'definition',
      title: 'antithesis and anaphora',
      content:
        '**Antithesis** balances contrasting ideas in parallel grammatical structure, sharpening the contrast between them. **Anaphora** repeats the same word or phrase at the start of successive clauses, building rhythm and momentum and letting a list of otherwise-separate claims feel like one escalating charge rather than disconnected complaints.',
    },
    {
      loId: 'apenglang.figurative-language-schemes',
      kind: 'framework',
      title: 'stacking a trope and a scheme',
      content:
        'Writers often STACK a trope and a scheme together — anaphora built from a repeated antithesis, for instance — and the combination is usually more persuasive than either alone. The analytical move is to name BOTH what\'s being compared/substituted (trope) AND how it\'s arranged (scheme), then connect both to effect.',
    },
    {
      loId: 'apenglang.figurative-language-schemes',
      kind: 'strategy',
      title: 'anaphora built on antithesis',
      content:
        'A high-value combined pattern: a series of clauses that each contain an internal antithesis (a prideful term paired against its indictment), repeated in an identical grammatical shape across several clauses (anaphora). The repetition confirms that the first indictment was not an isolated complaint but a pattern applying to everything the catalog touches.',
    },
    {
      loId: 'apenglang.figurative-language-schemes',
      kind: 'strategy',
      title: 'climactic ordering',
      content:
        'In a list built from repeated schemes, the FINAL item in the sequence often lands hardest — check whether the catalog closes on the term most central to the argument\'s stakes (e.g. the words the audience holds most sacred), which is rarely a coincidence of order.',
    },
    {
      loId: 'apenglang.figurative-language-schemes',
      kind: 'rhetorical-device',
      title: 'two questions, two lenses',
      content:
        'The core distinguishing question for any device: does it ask "what does this stand for?" (a trope — look for an implied or extended comparison) or "how is this arranged?" (a scheme — look for a repeated or balanced grammatical pattern)? Deciding which lens applies first prevents mislabeling a scheme as figurative language or vice versa.',
    },
    {
      loId: 'apenglang.figurative-language-schemes',
      kind: 'trap',
      title: 'device labeling without effect',
      content:
        'Labeling a device by name ("this is anaphora," "this is a metaphor") without explaining the persuasive EFFECT the specific pattern produces in this passage earns no credit. The test: strip the label out — does an explanation of effect remain, or does the sentence just re-identify what was already visible? If nothing remains, it is device-spotting, not analysis.',
    },
  ],
  methods: [
    {
      title: 'Analyze a rhetorical scheme (or trope) for effect',
      when_to_use:
        'Use when a passage contains a repeated grammatical pattern (anaphora, antithesis) or a figurative substitution (metaphor, analogy) worth analyzing for its persuasive effect.',
      steps: [
        'NAME THE DEVICE — is it a trope (metaphor, analogy: meaning shifts) or a scheme (antithesis, anaphora: arrangement patterns)?',
        'IF A SCHEME, identify the exact repeated grammatical shape and how many times it recurs; if a TROPE, identify the two things being compared or mapped.',
        'IF THE PASSAGE PAIRS A SCHEME WITH AN INTERNAL TROPE OR CONTRAST (e.g. anaphora built on antithesis), name that internal pairing within each repeated unit.',
        'EXPLAIN THE EFFECT OF THE REPEATED PATTERN — what does repetition accomplish that stating the point once would not?',
        "EXPLAIN WHY STACKING (or the specific device alone) SERVES THE WRITER'S PURPOSE — connect the pattern to what the writer needs the audience to feel or conclude.",
        'CHECK CLIMACTIC ORDER — does the final item in a list land hardest, and why?',
      ],
      example: {
        problem:
          'Analyze the rhetorical scheme, and its persuasive effect, in Douglass\'s catalog: "your celebration is a sham; your boasted liberty, an unholy license; your national greatness, swelling vanity; your sounds of rejoicing are empty and heartless; your denunciations of tyrants, brass fronted impudence; your shouts of liberty and equality, hollow mockery."',
        solution:
          'Douglass builds anaphora out of six antitheses in a row — each clause pairing a term of American pride (celebration, liberty, national greatness, rejoicing) against its indictment (sham, unholy license, swelling vanity, hollow mockery) in the same grammatical slot. The relentless repetition of the identical pattern doesn\'t let the audience recover between blows, turning one sharp criticism into a systematic indictment of every value the holiday claims — climaxing on the catalog\'s final and most foundational pairing, "liberty and equality... hollow mockery."',
      },
      relatedLoIds: ['apenglang.figurative-language-schemes'],
    },
  ],
  pointers: [
    { content: 'Trope = meaning shifts (metaphor, analogy); scheme = arrangement patterns without changing meaning (antithesis, anaphora).', kind: 'tip' },
    { content: 'Antithesis sharpens contrast by placing opposing ideas in the same grammatical slot.', kind: 'tip' },
    { content: 'Anaphora turns a list of separate claims into one cumulative, escalating charge — name the repetition, not just one instance.', kind: 'tip' },
    { content: 'Writers often stack a trope AND a scheme together — name both what\'s compared and how it\'s arranged.', kind: 'tip' },
    { content: 'Never label a device alone ("this is anaphora") — always explain the specific persuasive effect the pattern produces here.', kind: 'trap' },
    { content: 'In a repeated-pattern list, check whether the final item lands hardest by naming the argument\'s most foundational stake.', kind: 'tip' },
  ],
};
