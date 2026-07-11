/**
 * AP English Language & Composition — CED Unit 4.3: Diction and Tone.
 *
 * Builds on Unit 1's evidence-commentary skill and 4.2's framing work: word
 * choice is the most granular level at which a writer's attitude toward a
 * subject becomes visible. This topic teaches connotation-level diction
 * analysis, how a cluster of word choices adds up to a describable TONE,
 * and how to track a TONAL SHIFT across a passage — the paragraph-grain
 * skill of building a full evidence+commentary paragraph around diction.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows (concept = rhetorical
 * move; worked_example = annotated model; try_yourself PARAGRAPH grain:
 * responseFormat 'free', rubric = evidence(3) + commentary(3), same shape
 * as U1.4).
 *
 * Anchor text: Jonathan Swift's "A Modest Proposal" —
 * evelyn.passage.swift-modest-proposal.v1 — the canonical diction/tone
 * text: earnest, clinical, statistic-laden diction ("prodigious number,"
 * "additional grievance," "computation") that turns deadpan-ironic at the
 * "delicious nourishing and wholesome food" line. Quote of that line is
 * limited to that single short phrase, per content-safety guidance.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U4_DICTION_AND_TONE: LessonPlan = {
  id: 'evelyn.ap.englang.diction-and-tone.v1',
  title: 'U4.3 Diction and Tone',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.diction-and-tone',
      description:
        "Analyze a writer's specific word choices (diction) for their connotation, describe the tone that a cluster of choices creates, and trace a tonal shift across a passage, building a full evidence-and-commentary paragraph that explains how the diction produces that tone.",
      standard: 'AP-ENGLANG-4.3',
    },
  ],
  prerequisites: ['apenglang.evidence-commentary', 'apenglang.intros-conclusions-analysis'],
  followUps: ['apenglang.analyzing-line-of-reasoning'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that word choice alone can flip meaning, before naming "diction" or "tone".',
      script:
        "Someone tells you 'my roommate is frugal.' Someone else tells you 'my roommate is cheap.' Same basic fact — they don't spend money — completely different judgment baked into the word. That's connotation: the emotional charge a word carries beyond its dictionary definition. Now imagine an entire paragraph built out of words like 'frugal' — measured, careful, almost clinical language — describing something that is actually horrifying. That gap, between calm clinical language and a shocking subject, is one of the most powerful tools in a writer's kit: irony through diction. Today we get precise about HOW specific word choices (not just 'the writer's word choice was interesting') add up to a describable tone — and how that tone can shift, or stay eerily calm, right when you'd expect it to break.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-diction-tone',
      kind: 'concept',
      goal: 'Define diction, connotation, and tone; show how specific word choices accumulate into a tone; introduce tonal shift.',
      keyIdeas: [
        "DICTION is a writer's specific word choice — not vocabulary in general, but the deliberate selection of THIS word over available synonyms with a different charge.",
        "CONNOTATION is the emotional or associative charge a word carries beyond its literal (denotative) meaning. 'Frugal' and 'cheap' denote the same behavior but connote very differently — one approving, one critical.",
        "TONE is the writer's attitude toward the subject as it is revealed THROUGH accumulated word choices — tone is not a mood in the reader, and not a topic; it's inferred from a pattern of diction, not from a single word in isolation.",
        "To analyze tone, look for CLUSTERS: several words from the same connotative family reinforcing each other (e.g. repeated clinical/bureaucratic terms — 'computation,' 'grievance,' 'commonwealth' — building a tone of detached, official rationality) rather than resting an entire tone claim on one word.",
        "A TONAL SHIFT is a deliberate change in the pattern of diction partway through a passage — often signaled by a turn word ('but,' 'yet') or a sudden change in register (formal to casual, clinical to visceral) — and it usually marks a shift in the writer's rhetorical move, not just a stylistic accident.",
        "IRONY THROUGH DICTION occurs when a calm, clinical, or approving tone is applied to a subject the reader knows (or comes to realize) is shocking or morally troubling — the mismatch between measured word choice and disturbing content IS the argument, forcing the reader to supply the outrage the writer's flat tone withholds.",
        "The trap: naming a tone word ('the tone is ironic') without pointing to the SPECIFIC diction that produces it, or listing several word choices without ever naming the tone or effect they add up to. Both halves — specific words AND the tone they create — are required.",
      ],
      vocabulary: [
        { term: 'diction', definition: "a writer's specific, deliberate word choice — this word rather than an available synonym." },
        { term: 'connotation', definition: "the emotional or associative charge a word carries beyond its literal, dictionary meaning." },
        { term: 'denotation', definition: "a word's literal, dictionary meaning, independent of the feeling it evokes." },
        { term: 'tone', definition: "the writer's attitude toward the subject, inferred from a pattern (not a single instance) of word choice." },
        { term: 'tonal shift', definition: 'a deliberate change in the pattern of diction partway through a passage, usually marking a shift in rhetorical move.' },
        { term: 'irony (of tone)', definition: "a mismatch between a calm/approving tone and a subject the reader knows to be shocking, forcing the reader to supply the outrage the writer withholds." },
      ],
      passageId: 'evelyn.passage.swift-modest-proposal.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-swift-tone',
      kind: 'worked_example',
      problem:
        "Build one body paragraph analyzing how Swift's diction creates a clinical, detached tone in the early paragraphs of 'A Modest Proposal,' and how that tone makes the essay's later ironic turn possible (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.swift-modest-proposal.v1).",
      steps: [
        "WRITE THE TOPIC SENTENCE. State the mini-claim: Swift's diction in the opening paragraphs establishes a coldly bureaucratic, statistic-minded tone toward a subject (starving children) that should call for compassion, not calculation.",
        "SELECT THE EVIDENCE — SPECIFIC WORDS, NOT JUST A VIBE. Point to the cluster: 'prodigious number,' 'additional grievance,' 'useful members of the commonwealth,' 'computation' — bureaucratic, almost economic vocabulary applied to children living in poverty.",
        "NAME THE CONNOTATION OF EACH TERM. 'Grievance' and 'computation' carry the connotation of an administrative problem to be solved on paper, not a human tragedy; 'useful members' evaluates children by their utility to the state, as though they were a resource inventory rather than people.",
        "NAME THE TONE THIS CLUSTER PRODUCES. Together, this diction produces a detached, clinical, faux-reasonable tone — the voice of a policy paper, not a person moved by suffering.",
        "EXPLAIN WHY THIS TONE SERVES SWIFT'S PURPOSE (the why). Swift is not endorsing this detachment — he is performing it, so that when the proposal turns monstrous, the reader has already been trained to notice how unnervingly calm the voice remains. The clinical tone is the setup that makes the later irony devastating rather than merely absurd.",
        "LINK BACK TO THE PARAGRAPH'S CLAIM. Close by tying the clinical diction back to the claim that Swift's opening tone is a deliberate, sustained performance of detachment, not a lapse — priming the reader for the satire's real target: a society capable of discussing poverty in exactly this bloodless way.",
      ],
      answer:
        "Swift's diction in the opening paragraphs establishes a coldly bureaucratic, statistic-minded tone toward a subject — starving children — that would ordinarily call for compassion, not calculation. Words like \"prodigious number,\" \"additional grievance,\" and \"computation\" carry the connotation of an administrative problem to be tallied on paper rather than a human tragedy, while calling children potential \"useful members of the commonwealth\" evaluates them by utility rather than as people. Together this cluster produces a detached, clinical, faux-reasonable tone — the voice of a policy report, not a person moved by suffering. Swift is not endorsing that detachment; he is performing it, training the reader to notice just how calm this voice remains before the proposal turns monstrous, so that the later irony lands as devastating rather than merely absurd. The opening's clinical diction is not a stylistic lapse — it is the deliberate setup for the satire's real target: a society capable of discussing poverty in exactly this bloodless way.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-paragraph-swift-shift',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.swift-modest-proposal.v1, write ONE body paragraph analyzing the TONAL SHIFT at the moment Swift reveals his actual proposal — the line describing a well-nursed child as \"a most delicious nourishing and wholesome food.\" Your paragraph must identify at least one specific piece of diction from BEFORE this line (establishing the earlier clinical/statistical tone) AND at least one specific word from this line, and must include commentary explaining how the shift (or, more precisely, the eerie CONTINUITY of the calm tone across the shift) works and why it serves Swift's satiric purpose. Do not quote-and-drop.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.swift-modest-proposal.v1',
      rubric: {
        parts: [
          {
            criterionId: 'evidence',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph cites specific, accurately-quoted diction from the earlier clinical/statistical register (e.g. 'computation,' 'prodigious number,' 'grossly mistaken,' 'a child just dropt from its dam') AND the specific diction of the reveal line (e.g. 'delicious nourishing and wholesome food,' or the culinary verbs 'stewed, roasted, baked, or boiled'). Partial credit (1-2) for citing only one side (only the earlier register or only the reveal line) or evidence that is vague/only loosely connected. No credit for no evidence, misquoted evidence, or evidence irrelevant to the tonal-shift claim.",
            modelResponse:
              "Swift's earlier register is built from words like \"computation\" and \"grossly mistaken ... in their computation,\" describing children in the same flatly quantifying terms as a ledger; the proposal itself continues this same tone into horror, calling a child \"a most delicious nourishing and wholesome food, whether stewed, roasted, baked, or boiled.\"",
          },
          {
            criterionId: 'commentary',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): commentary explains HOW the tone works across this moment — specifically, that there is NO shift into an alarmed or horrified register; the same calm, appreciative, almost culinary-review diction ('delicious nourishing and wholesome') continues seamlessly from the earlier statistical calm, which is precisely what makes the line shocking — AND explains WHY this eerie tonal continuity (rather than an obvious shift into horror) serves Swift's satiric purpose (the persona's failure to register any change in register when describing cannibalism is itself the indictment: it exposes how a purely 'rational,' statistics-minded approach to poverty can rationalize monstrous conclusions without ever feeling like it has crossed a line). Partial credit for commentary that notes the calm tone continues but doesn't explain why that continuity (rather than a shift) is the satiric point, or that only restates the shocking content. No credit for commentary absent or reduced to summarizing what the proposal says.",
            modelResponse:
              "What is most unsettling here is the ABSENCE of a tonal shift: rather than breaking into horror or hesitation, Swift's persona describes eating a child in the same appreciative, almost gastronomic register he used to describe eating problems as a matter of \"computation.\" That seamless continuity is the satire's real weapon — it dramatizes how a coldly 'rational,' statistics-first approach to human suffering can arrive at a monstrous conclusion without the speaker ever registering that anything has gone wrong, exposing the emptiness of a rationality that never once has to confront what it is proposing.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: 'misconception-labeling-tone-without-diction',
      kind: 'misconception_check',
      question:
        'A student writes: "The tone of this passage is ironic." Is this a complete tone analysis on its own?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Naming a tone word (ironic, sarcastic, somber, urgent) without pointing to the SPECIFIC diction that produces it — the tone-analysis equivalent of naming a device without commentary.',
          correctsTo:
            "No — a tone label with no supporting diction is an assertion, not an analysis. The AP scorer needs to see the specific words that create that tone: which connotative choices, in which cluster, add up to \"ironic\"? Compare: \"the tone is ironic\" (no credit-earning content) versus \"the calm, appreciative diction of 'delicious nourishing and wholesome food' applied to eating a child creates a tone of horrifying irony, because the register never shifts to match the horror of the content\" (specific diction + named tone + explanation of the mismatch). Always pair the tone word with the exact words that produce it.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Diction is deliberate word choice; connotation is the emotional charge a word carries beyond its literal meaning; tone is the attitude a CLUSTER of diction reveals.',
        'Never rest a tone claim on one word in isolation — point to a pattern of connotatively-related word choices.',
        'A tonal shift is a deliberate change in diction, often marking a shift in rhetorical move — but sometimes the absence of an expected shift (calm tone continuing into shocking content) is itself the rhetorical move.',
        'Irony through diction: a calm/approving tone applied to shocking content forces the reader to supply the outrage the writer withholds.',
        'Never name a tone word alone — always pair it with the specific diction that produces it and explain the effect, the same evidence+commentary discipline as any other paragraph.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.3',
    cedTitle: 'Diction and Tone',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '4',
        note: 'AP English Language and Composition Course and Exam Description, Unit 4 — diction, connotation, tone, and tonal shift.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.swift-modest-proposal.v1',
        chapter: '1729',
        note: 'Jonathan Swift, "A Modest Proposal" — anchor text for clinical diction, tone, and the ironic tonal continuity at the proposal\'s reveal.',
      },
    ],
  },
};
