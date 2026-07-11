/**
 * AP English Language & Composition — CED Unit 6.3: Figurative Language and
 * Rhetorical Schemes.
 *
 * Having analyzed syntax (6.1) and diction/connotation (6.2), students now
 * add figurative language — TROPES (metaphor, analogy: substituting or
 * mapping meaning) — and RHETORICAL SCHEMES (antithesis, anaphora: patterns
 * of arrangement) as a third lens on style, and learn to connect a device
 * (of either kind) to its persuasive EFFECT rather than merely labeling it.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows (concept = rhetorical
 * move; worked_example = annotated model; try_yourself PARAGRAPH grain:
 * responseFormat 'free', rubric = evidence(3) + commentary(3)).
 *
 * Anchor text for concept/worked example: Frederick Douglass's escalating
 * antithesis-and-anaphora catalog — evelyn.passage.douglass-fourth-of-
 * july.v1 ("your celebration is a sham; your boasted liberty...") — the
 * unit's ideal scheme text. Try-yourself uses Patrick Henry's "Give Me
 * Liberty or Give Me Death" — evelyn.passage.henry-give-me-liberty.v1 — for
 * its anaphoric "we have petitioned... our petitions have been slighted"
 * sequence, for passage variety. Quotes are limited to short structural/
 * rhetorical phrases per content-safety guidance.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U6_FIGURATIVE_LANGUAGE_SCHEMES: LessonPlan = {
  id: 'evelyn.ap.englang.figurative-language-schemes.v1',
  title: 'U6.3 Figurative Language and Rhetorical Schemes',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.figurative-language-schemes',
      description:
        "Identify figurative language and rhetorical schemes (metaphor, analogy, antithesis, anaphora), distinguish tropes (which shift meaning) from schemes (which pattern arrangement), and explain the specific persuasive effect each produces rather than merely naming the device.",
      standard: 'AP-ENGLANG-6.3',
    },
  ],
  prerequisites: ['apenglang.diction-connotation-tone'],
  followUps: ['apenglang.analyzing-style'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Distinguish tropes (meaning-shifting) from schemes (arrangement-patterning), before naming any specific devices.',
      script:
        "Some rhetorical moves change WHAT a word means — calling hope \"a siren\" is a metaphor; hope isn't literally a mythical creature, but the comparison reshapes how you see it. Other moves don't change meaning at all — they rearrange the STRUCTURE of a sentence, like repeating the same grammatical pattern three times in a row. Today we learn both halves: figurative language (tropes) that substitutes one meaning for another, and rhetorical schemes that pattern words and clauses for effect — and how writers stack both together to make an argument feel undeniable.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-tropes-schemes',
      kind: 'concept',
      goal: 'Distinguish tropes from schemes, define metaphor, analogy, antithesis, and anaphora, and connect each to its persuasive effect.',
      keyIdeas: [
        "FIGURATIVE LANGUAGE (TROPES) shifts a word or phrase's meaning beyond its literal sense. METAPHOR is an implied comparison (\"hope is a siren\"); ANALOGY is an extended comparison that maps one relationship onto another to make an abstract or unfamiliar idea concrete.",
        "RHETORICAL SCHEMES pattern the ARRANGEMENT of words or clauses without changing their literal meaning. ANTITHESIS balances contrasting ideas in parallel grammatical structure; ANAPHORA repeats the same word or phrase at the start of successive clauses.",
        "The distinction matters: a trope asks \"what does this stand for?\"; a scheme asks \"how is this arranged, and what does the pattern itself do?\"",
        "Antithesis's persuasive effect: placing two ideas in the same grammatical slot sharpens the contrast between them, making each term's meaning depend on — and highlight — its opposite.",
        "Anaphora's persuasive effect: repeating the same opening across clauses builds rhythm and momentum, and lets a list of otherwise separate claims feel like one escalating charge rather than disconnected complaints.",
        "Analogy and metaphor's persuasive effect: mapping an abstract or contested claim onto a concrete, shared image lets a reader FEEL a judgment (danger, betrayal, hypocrisy) instead of just being told to accept it.",
        "Writers often STACK a trope and a scheme together — anaphora built from a repeated antithesis, for instance — and the combination is usually more persuasive than either alone. The analytical move is to name BOTH what's being compared/substituted (trope) AND how it's arranged (scheme), then connect both to effect.",
        "The trap: labeling a device (\"this is anaphora\") without explaining the persuasive EFFECT of the specific pattern in this specific passage — a device name alone earns no analytical credit.",
      ],
      vocabulary: [
        { term: 'trope', definition: "a figure of speech that shifts a word or phrase's meaning beyond its literal sense (e.g. metaphor, analogy)." },
        { term: 'scheme', definition: 'a pattern in the arrangement of words or clauses that does not change their literal meaning (e.g. antithesis, anaphora).' },
        { term: 'metaphor', definition: 'an implied comparison between two unlike things, without "like" or "as."' },
        { term: 'analogy', definition: 'an extended comparison that maps one relationship onto another to clarify or intensify an abstract idea.' },
        { term: 'antithesis', definition: 'a pairing of contrasting ideas in parallel, balanced grammatical structure.' },
        { term: 'anaphora', definition: 'repetition of the same word or phrase at the start of successive clauses.' },
      ],
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-douglass-scheme',
      kind: 'worked_example',
      problem:
        "Analyze the rhetorical scheme, and its persuasive effect, in Douglass's catalog (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.douglass-fourth-of-july.v1): \"your celebration is a sham; your boasted liberty, an unholy license; your national greatness, swelling vanity; your sounds of rejoicing are empty and heartless; your denunciations of tyrants, brass fronted impudence; your shouts of liberty and equality, hollow mockery.\"",
      steps: [
        "NAME THE SCHEME. This is anaphora built on antithesis: each clause repeats the same grammatical pattern — \"your [term of American pride], [a harshly critical indictment]\" — six times in a row.",
        "NAME THE ANTITHETICAL PAIRING WITHIN EACH CLAUSE. Each clause places a term of American self-celebration (celebration, liberty, national greatness, rejoicing, denunciations of tyrants, shouts of liberty and equality) directly against a term that indicts it (sham, unholy license, swelling vanity, empty and heartless, brass fronted impudence, hollow mockery) — antithesis operating at the clause level, six times over.",
        "EXPLAIN THE EFFECT OF THE REPEATED PATTERN (ANAPHORA). Repeating the identical \"your X, [indictment]\" structure six times in immediate succession doesn't let the audience recover between blows — each repetition confirms that the first indictment wasn't an isolated complaint, but a pattern that applies to literally every value the holiday claims.",
        "EXPLAIN THE EFFECT OF THE ANTITHESIS WITHIN EACH PAIRING. Placing the prideful term and its indictment in the exact same grammatical slot forces the reader to hold both meanings of the SAME word at once — \"liberty\" is both what the audience celebrates and, in the same breath, \"an unholy license\" — the two readings can't be pulled apart once placed side by side.",
        "EXPLAIN WHY STACKING SCHEME AND PATTERN SERVES DOUGLASS'S PURPOSE. Any single one of these antitheses might land as one sharp criticism; stacking six in an anaphoric list, each following the identical pattern, makes the indictment feel total and systematic — not one complaint, but proof that none of the holiday's celebrated values survive contact with his perspective.",
        "LINK TO CLIMACTIC ORDER. The final pairing — \"your shouts of liberty and equality, hollow mockery\" — lands hardest because it directly names the two words (liberty, equality) most central to the nation's self-image, closing the catalog on its most foundational claim.",
      ],
      answer:
        "Douglass builds anaphora out of six antitheses in a row — each clause pairing a term of American pride (celebration, liberty, national greatness, rejoicing) against its indictment (sham, unholy license, swelling vanity, hollow mockery) in the same grammatical slot. The relentless repetition of the identical pattern doesn't let the audience recover between blows, turning one sharp criticism into a systematic indictment of every value the holiday claims — climaxing on the catalog's final and most foundational pairing, \"liberty and equality... hollow mockery.\"",
      estimatedMinutes: 6,
    },
    {
      id: 'try-paragraph-henry-scheme',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.henry-give-me-liberty.v1, write ONE body paragraph analyzing the anaphora in \"We have petitioned; we have remonstrated; we have supplicated; we have prostrated ourselves before the throne... Our petitions have been slighted; our remonstrances have produced additional violence and insult; our supplications have been disregarded; and we have been spurned, with contempt, from the foot of the throne!\" Identify the scheme AND explain its persuasive effect — how repeating the same grammatical pattern across a rising sequence of actions, then echoing the pattern with each action's rejected outcome, builds Henry's case that peaceful means have been exhausted. Include at least one specific piece of evidence AND commentary. Do not quote-and-drop.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      rubric: {
        parts: [
          {
            criterionId: 'evidence',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph cites both the anaphoric action sequence ('we have petitioned... remonstrated... supplicated... prostrated ourselves') AND the parallel echo of rejected outcomes ('our petitions have been slighted; our remonstrances have produced additional violence and insult; our supplications have been disregarded'). Partial credit (1-2) for citing only one half of the doubled pattern, or evidence present but vague. No credit for no evidence, misquoted evidence, or evidence irrelevant to the scheme.",
            modelResponse:
              "Henry builds anaphora twice over: first the escalating list of peaceful actions — \"we have petitioned; we have remonstrated; we have supplicated; we have prostrated ourselves before the throne\" — then a matching list of their rejections — \"our petitions have been slighted; our remonstrances have produced additional violence and insult; our supplications have been disregarded.\"",
          },
          {
            criterionId: 'commentary',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): commentary explains HOW the doubled anaphora works (the first list catalogs every peaceful option tried, in escalating formality; the second list, in the identical grammatical pattern, shows each one systematically failing, so the two lists read as a single closing argument rather than two separate observations) AND WHY that arrangement serves Henry's purpose (it makes 'we must fight' feel like the only remaining conclusion the pattern itself allows, rather than an emotional leap) — going beyond restating what the quotes say. Partial credit for commentary that explains the pattern's effect but not why it serves Henry's purpose, or that mostly restates the quotes. No credit for commentary absent or reduced to summary.",
            modelResponse:
              "By matching the escalating list of peaceful efforts with an equally escalating list of their failures in the identical grammatical pattern, Henry turns two lists into one closing argument: each clause in the second list forecloses an option the first list had just raised, so that by the time both lists end, no peaceful avenue remains untried and unrejected. That double anaphora is what makes 'we must fight' feel like the pattern's own conclusion rather than an emotional leap Henry is asking the Convention to take on faith.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: 'misconception-scheme-labeling',
      kind: 'misconception_check',
      question:
        'A student writes: "Henry uses anaphora when he says we have petitioned, we have remonstrated, we have supplicated, we have prostrated ourselves." Is this a complete analysis of the scheme?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Labeling a scheme by name (anaphora, antithesis) without explaining the persuasive EFFECT the specific pattern produces in this passage.',
          correctsTo:
            "No — naming \"anaphora\" identifies the pattern but not what it accomplishes. Why does repeating \"we have...\" four times, rather than just listing the actions once, matter here? Real scheme analysis explains the effect (the repetition builds a formal, escalating record of every peaceful option attempted) and connects it to the writer's purpose (making the later failure-list, and then the turn to fighting, feel earned rather than abrupt). The test: strip the label out — does an explanation of effect remain, or does the sentence just re-identify what you already saw? If nothing remains, it's device-spotting, not analysis.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Tropes (metaphor, analogy) shift meaning; schemes (antithesis, anaphora) pattern arrangement without changing literal meaning.",
        "Antithesis sharpens contrast by placing opposing ideas in the same grammatical slot; anaphora builds rhythm and turns a list into one cumulative charge.",
        "Metaphor and analogy let a reader FEEL an abstract judgment by mapping it onto something concrete.",
        "Writers often stack a trope and a scheme together — name both what's compared/substituted AND how it's arranged.",
        "Never label a device alone — always explain the specific persuasive effect the pattern produces here and why it serves the writer's purpose.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.3',
    cedTitle: 'Figurative Language and Rhetorical Schemes',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '6',
        note: 'AP English Language and Composition Course and Exam Description, Unit 6 — tropes (metaphor, analogy) versus schemes (antithesis, anaphora) and their persuasive effects.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.douglass-fourth-of-july.v1',
        chapter: '1852',
        note: 'Frederick Douglass, "What to the Slave Is the Fourth of July?" — anchor text for the anaphora-built-on-antithesis catalog.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.henry-give-me-liberty.v1',
        chapter: '1775',
        note: 'Patrick Henry, "Give Me Liberty or Give Me Death" — practice text for the doubled anaphora of effort and rejection.',
      },
    ],
  },
};
