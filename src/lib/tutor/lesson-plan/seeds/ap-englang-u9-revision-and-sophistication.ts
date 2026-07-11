/**
 * AP English Language & Composition — CED Unit 9.4: Revision and Earning
 * the Sophistication Point.
 *
 * The course's final topic: turning a competent-but-flat essay into one that
 * earns Row C (Sophistication) on the real AP Lang rubric — the point
 * reserved for writing that shows a nuanced, complicated understanding
 * rather than a merely correct one. Sophistication is NOT extra vocabulary
 * or a longer conclusion; it's earned through REVISION — noticing where a
 * thesis or piece of commentary is technically defensible but flat, and
 * pushing it toward complexity: a qualification, a considered
 * counterposition, an explicit stake in why the argument matters beyond the
 * prompt. This closes the loop with Unit 7's nuance/qualification/concession
 * work, now applied as a self-editing discipline rather than a first-draft
 * move.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics (try_yourself PARAGRAPH grain: responseFormat
 * 'free', rubric = two parts summing to 6) this plan follows.
 *
 * No anchor passage — this topic works from a short student-provided/sample
 * weak paragraph the student revises, not one of the course's four
 * historical passages.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U9_REVISION_AND_SOPHISTICATION: LessonPlan = {
  id: 'evelyn.ap.englang.revision-and-sophistication.v1',
  title: 'U9.4 Revision and Earning the Sophistication Point',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.revision-and-sophistication',
      description:
        'Revise a drafted paragraph to strengthen its thesis and commentary and to add genuine nuance — a qualification, a considered counterposition, or an explicit stake in the argument\'s larger significance — earning credit for sophistication rather than merely correct, flat analysis.',
      standard: 'AP-ENGLANG-9.4',
    },
  ],
  prerequisites: [
    'apenglang.nuance-qualification-concession',
    'apenglang.evidence-commentary',
    'apenglang.mcq-writing-editing',
  ],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make students feel the difference between a correct paragraph and a sophisticated one, before naming Row C.',
      script:
        "Here's a fact: two essays can both have a defensible thesis, both use real evidence, both explain that evidence correctly — and still score differently, because one of them ALSO shows the writer thinking past the obvious. Sophistication isn't a fancier vocabulary word dropped into a sentence. It's the moment a writer says, in effect, 'yes, and here's the complication that makes this more interesting than a simple claim' — a qualification, a case that almost cuts the other way, a reason this argument actually matters. That's a point most essays leave on the table, not because students can't think that way, but because first drafts rarely have time to. Today's skill is a REVISION skill: finding where your own paragraph is flat, and pushing it toward that complexity.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-revision-sophistication',
      kind: 'concept',
      goal: 'Define the sophistication point and the three concrete revision moves that most reliably earn it.',
      keyIdeas: [
        "THE SOPHISTICATION POINT (Row C on the real AP Lang rubric) rewards writing that demonstrates a NUANCED or COMPLICATED understanding of the rhetorical situation or argument — not a fourth example, not fancier diction, not a longer paragraph. It is earned through the THINKING, not the word count.",
        "THREE REVISION MOVES MOST RELIABLY EARN IT: (1) QUALIFY THE THESIS — replace an absolute claim ('always,' 'proves') with a precise, still-defensible boundary ('most effectively when paired with X,' 'particularly for an audience already primed to Y') that shows you've considered where the claim does and doesn't hold. (2) ADD A CONSIDERED COUNTERPOSITION AND ANSWER IT — briefly acknowledge a case that could cut against your claim, then explain why your reading still holds; this shows you tested your own argument rather than only defending it. (3) STATE THE STAKES — explain briefly WHY the distinction you're making matters beyond satisfying the prompt (e.g. what it reveals about how persuasion works, or about the text's larger project).",
        "REVISING FOR SOPHISTICATION STARTS WITH FINDING THE FLAT SENTENCE, not adding a new one. Read your own thesis or topic sentence and ask: 'is this true in EVERY case, or could I name the specific condition that makes it true?' A claim that survives that question with a real boundary named is already more sophisticated than the same claim stated as an absolute.",
        "SOPHISTICATION CANNOT BE BOLTED ON AS A GENERIC CLOSING SENTENCE ('this shows the complexity of the human condition') — that is the single most common failed attempt at Row C: a vague, universal-sounding line that isn't actually connected to the specific evidence and claim just made. Genuine sophistication is always SPECIFIC to the argument at hand.",
        "COMMENTARY CAN ALSO BE PUSHED TOWARD SOPHISTICATION, not just the thesis: instead of stopping at 'this device does X,' add 'this device does X, though it risks Y' or 'this device does X, which matters more for THIS audience than it would for a different one' — extending the chain of reasoning one more link rather than stopping at the first correct explanation.",
        "THE TEST FOR A SUCCESSFUL REVISION: does the new sentence show you considered an alternative, a boundary, or a stake that a flatter version of the same paragraph would have skipped? If the added sentence could be deleted without losing any actual thinking (only losing word count), it isn't sophistication yet.",
      ],
      vocabulary: [
        { term: 'sophistication point (Row C)', definition: "the AP Lang rubric point rewarding a nuanced, complicated understanding of the rhetorical situation or argument, not extra length or vocabulary." },
        { term: 'qualify', definition: 'to narrow an absolute claim to a precise, still-defensible boundary that shows where and why it holds.' },
        { term: 'considered counterposition', definition: 'a brief acknowledgment of a case that could cut against the claim, answered rather than ignored.' },
        { term: 'stakes', definition: "a stated reason the argument's distinction matters beyond simply satisfying the prompt." },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-revise-paragraph',
      kind: 'worked_example',
      problem:
        "Revise this flat but technically correct paragraph to earn sophistication: 'Lincoln uses repetition in his speech. He repeats words like \"dedicate\" and phrases like \"of the people.\" This repetition makes his speech more persuasive and memorable. It shows he was a great writer.' (Mentioned here in prose — this segment type carries no passageId field.)",
      steps: [
        "DIAGNOSE THE FLATNESS. Every sentence here is technically true but each stops at the first correct observation: repetition exists, it's persuasive, Lincoln was skilled. None of this is wrong — it's just not yet analysis, and there's no qualification, counterposition, or stated stakes anywhere.",
        "QUALIFY THE CLAIM. Instead of 'repetition makes his speech more persuasive' (true of almost any repetition, in any speech, always), narrow it: repetition of a SPECIFIC KIND — escalating negation ('we can not dedicate... consecrate... hallow') — works because it enacts the very insufficiency of words that the sentence describes, which a simple repeated word would not.",
        "ADD A CONSIDERED COUNTERPOSITION. Acknowledge: repetition CAN feel like padding or a rhetorical crutch in a weaker speech — so the sophistication move is explaining WHY it doesn't read that way here: because each repeated element (dedicate/consecrate/hallow; of/by/for) is escalating rather than identical, avoiding the flatness that mere repetition risks.",
        "STATE THE STAKES BRIEFLY. Why does this distinction matter beyond the prompt? Because it reveals something about persuasive brevity itself: Lincoln achieves gravity in under 300 words partly BECAUSE the repetition does structural work (building an escalating claim) rather than merely decorative work.",
        "REWRITE THE PARAGRAPH WITH THESE MOVES FOLDED IN, not appended as a separate closing sentence — the qualification and stakes should modify the existing claims, not sit after them as an unconnected coda.",
      ],
      answer:
        "Revised: 'Lincoln's repetition is not merely decorative but escalating: \"we can not dedicate—we can not consecrate—we can not hallow\" moves through near-synonyms of increasing weight, enacting the very insufficiency of words that the sentence describes. Repetition risks sounding like padding in a weaker speech, but because each repeated element intensifies rather than restates the last, it instead performs the address's central claim — that language itself falls short of the soldiers' sacrifice — which is part of how Lincoln achieves such gravity in under three hundred words.'",
      estimatedMinutes: 6,
    },
    {
      id: 'try-revise-weak-paragraph',
      kind: 'try_yourself',
      problem:
        "Revise this flat, technically-correct paragraph to earn the sophistication point: 'The proposer in \"A Modest Proposal\" uses statistics and a calm tone. This makes the essay effective. The tone shows Swift was a good writer who understood irony.' Write ONE revised body paragraph that (1) strengthens the commentary — explains HOW the calm, statistical tone works and not just that it is 'effective' — and (2) adds real nuance: a qualification, a considered counterposition, or a stated stake in why this rhetorical choice matters beyond the prompt. Do not simply add a vague closing sentence about 'complexity' — the added thinking must connect specifically to the tone/statistics claim.",
      responseFormat: 'free',
      rubric: {
        parts: [
          {
            criterionId: 'commentary',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the revision explains HOW the calm, statistic-laden tone specifically works (e.g. it borrows the credibility of reasoned economic argument, lulling the reader into treating a monstrous proposal as a rational policy option) rather than asserting only that it is 'effective.' Partial credit (1-2) for commentary that gestures at a mechanism but remains vague or only restates that the tone is persuasive. No credit for commentary absent or unchanged from the flat original ('this makes the essay effective' with no explanation of how).",
            modelResponse:
              "The proposer's calm, statistic-laden tone borrows the credibility of reasoned economic argument, so that by the time the monstrous proposal itself arrives, the reader has already been trained to evaluate it the way one evaluates any policy brief — by its numbers — rather than by its morality.",
          },
          {
            criterionId: 'nuance-sophistication',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): adds genuine, SPECIFIC nuance connected to the tone/statistics claim — a qualification (e.g. naming the precise condition under which the calm tone works, such as only because the reader initially reads the piece as sincere policy prose), a considered counterposition (e.g. acknowledging that a calm tone alone doesn't guarantee irony, then explaining what makes THIS calm tone read as ironic rather than sincere), or a stated stake (e.g. why this technique matters to satire as a mode, not just to this one essay). Partial credit (1-2) for an attempt at nuance that is present but generic/vague (e.g. a closing line about 'showing complexity' not tied to the specific claim). No credit for no added nuance, or a bolted-on universal statement disconnected from the tone/statistics claim.",
            modelResponse:
              "A calm, statistical tone alone doesn't automatically read as ironic — plenty of sincere policy writing sounds exactly this way — so the irony depends on the gap between that reasonable-sounding voice and the reader's own moral revulsion at what it is calmly proposing; it is precisely because the tone COULD be mistaken for sincerity that it does its satirical work, exposing how easily 'reasonable-sounding' argument can be used to launder an unreasonable conclusion.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: 'misconception-vocabulary-equals-sophistication',
      kind: 'misconception_check',
      question:
        'A student revises their conclusion to add: "In conclusion, this essay demonstrates the multifaceted and profound complexity of the human experience." Does this sentence earn the sophistication point?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Treating elevated, universal-sounding VOCABULARY ('multifaceted,' 'profound complexity') as if it were itself evidence of sophisticated THINKING, when the sentence isn't connected to any specific claim or evidence in the essay.",
          correctsTo:
            "No — this sentence could be pasted onto almost any essay on any topic, which is exactly the tell that it isn't sophistication: it names no specific qualification, counterposition, or stake tied to THIS essay's actual argument. Real sophistication is always SPECIFIC — it modifies a particular claim ('this device works ONLY when...'), engages a particular counterposition ('one might object that... but...'), or states a particular stake ('this matters because it reveals...'). The test: could this sentence be deleted and pasted into a different essay on a different topic without anyone noticing? If yes, it's decoration, not sophistication.",
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The sophistication point (Row C) rewards nuanced THINKING specific to your argument — not extra vocabulary, length, or a generic closing sentence about 'complexity.'",
        "Three reliable revision moves: qualify an absolute claim to its true boundary, add and answer a considered counterposition, or state the stakes of your distinction.",
        "Sophistication modifies EXISTING claims and commentary — it isn't bolted on as an unconnected coda at the end.",
        "Test: if a sentence could be pasted into a different essay on a different topic unchanged, it's decoration, not sophistication.",
        "Revision, not first drafting, is where sophistication is usually found — read your own flat sentence and ask what boundary, counterposition, or stake it's missing.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9.4',
    cedTitle: 'Revision and Earning the Sophistication Point',
    sources: [
      {
        type: 'plan',
        source: 'AP Plans Initiative — AP English Language',
      },
    ],
  },
};
