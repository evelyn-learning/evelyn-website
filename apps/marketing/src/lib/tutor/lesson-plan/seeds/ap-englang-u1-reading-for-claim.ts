/**
 * AP English Language & Composition — CED Unit 1.2: Reading for the Writer's
 * Claim.
 *
 * Builds directly on 1.1 (the rhetorical situation): once a student can name
 * WHAT SITUATION a text responds to, the next skill is separating the text's
 * TOPIC from its CLAIM — the arguable point the writer wants the reader to
 * accept. This is the single most common place weak readers get lost: they
 * can summarize what a text is about but can't state what it's arguing.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Patrick Henry, "Give Me Liberty or Give Me Death" (1775) —
 * evelyn.passage.henry-give-me-liberty.v1. The teaching point is locating and
 * stating the writer's CLAIM (the case for immediate armed resistance), not
 * relitigating the historical conflict — quotes below are limited to short,
 * structural rhetorical phrases from the speech itself.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U1_READING_FOR_CLAIM: LessonPlan = {
  id: 'evelyn.ap.englang.reading-for-claim.v1',
  title: "U1.2 Reading for the Writer's Claim",
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.reading-for-claim',
      description:
        "Distinguish a text's topic from the writer's claim (the arguable point being asserted) and state that claim precisely from a given passage.",
      standard: 'AP-ENGLANG-1.2',
    },
  ],
  prerequisites: ['apenglang.rhetorical-situation'],
  followUps: ['apenglang.defensible-thesis', 'apenglang.evidence-commentary'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the difference between summarizing a text and stating what it argues, before naming the term "claim."',
      script:
        "Picture two students who just read the same op-ed and have to describe it in one sentence. Student A says: 'It's about whether the school should extend the lunch period.' Student B says: 'It argues that a longer lunch period would actually improve test scores, not hurt them.' Both sentences are accurate. Only one of them tells you what the writer is trying to convince you of. Student A named the TOPIC. Student B found the CLAIM. Every AP passage you read — a speech, an essay, an editorial — has both, and confusing them is the single most common way readers get lost. Today we train the second skill: reading past the topic to find the sentence the whole text is built to defend.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-reading-for-claim',
      kind: 'concept',
      goal: "Define 'claim' precisely, distinguish it from topic and from subordinate reasons, and give students a repeatable method for locating it.",
      keyIdeas: [
        "TOPIC is what a text is ABOUT (a subject); CLAIM is what the text ARGUES about that subject (an arguable position). 'The Fourth of July' is a topic. 'The Fourth of July exposes a nation's hypocrisy' is a claim.",
        "A claim must be ARGUABLE — a reasonable person could push back on it. A fact ('the colonies were under British rule in 1775') or a plot detail is never a claim, because there's nothing to dispute.",
        "The claim is often NOT handed to you in one tidy sentence. In speeches and essays, it's frequently assembled across paragraphs — you have to synthesize the writer's repeated moves into a single statement of what they want you to believe or do.",
        "Watch for SIGNAL LANGUAGE that tends to mark where a claim surfaces: modal/evaluative words ('must,' 'cannot,' 'ought,' 'the only course'), imperative structure, and emphatic repetition. These are the writer turning up the volume on the point they most want to land.",
        "Do not mistake a SUPPORTING REASON for the claim itself. A reason justifies or defends the claim; it is one rung below it. ('The colonists have petitioned and been ignored' is a reason. 'Armed resistance is now the only remaining option' is the claim the reason supports.)",
        "In an argument structured as a call to action, the claim often crystallizes at the CLIMAX — the point the build-up has been driving toward — rather than in the opening lines.",
        "The reliable test: after reading, ask 'What does this writer want me to BELIEVE or DO as a result of this text?' Whatever answer you give in one sentence — if it's arguable — is the claim.",
        "Getting the claim right is the foundation for everything after it in this unit: you cannot write a defensible thesis (1.3) or select relevant evidence (1.4) about a text whose claim you've misidentified.",
      ],
      vocabulary: [
        { term: 'claim', definition: "the arguable position a writer wants the reader to accept — the point the whole text is built to defend." },
        { term: 'topic', definition: 'the subject a text is about, as distinct from any position taken on it.' },
        { term: 'subordinate reason', definition: "a piece of support that justifies the main claim but is not itself the claim." },
        { term: 'arguable', definition: 'capable of being reasonably disputed — the defining test of a claim, as opposed to a fact.' },
        { term: 'call to action', definition: 'an argument structured to move the audience toward a specific action, often crystallizing its claim at the climax.' },
        { term: 'signal language', definition: "modal or evaluative wording ('must,' 'cannot') and emphatic repetition that often mark where a claim is being asserted." },
      ],
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-henry-claim',
      kind: 'worked_example',
      problem:
        "Read Patrick Henry's 1775 speech to the Virginia Convention (evelyn.passage.henry-give-me-liberty.v1). The speech runs through petitions ignored, warnings about weakness, and a rising insistence that 'the war is actually begun.' State the single claim the entire speech is built to defend.",
      steps: [
        "RULE OUT THE TOPIC. 'The speech is about the conflict with Britain' names a subject, not a position — it's not arguable, so it can't be the claim.",
        "IDENTIFY THE SUBORDINATE REASONS. Henry lists several: petitions have failed ('our petitions have been slighted'), delay won't make the colonies stronger ('when shall we be stronger?'), and God/nature favor the colonists' cause. Each of these is SUPPORT — none of them is the point itself, they are the case FOR the point.",
        "FOLLOW THE SIGNAL LANGUAGE. Watch the modal shift: 'There is no longer any room for hope' and the repeated, emphatic 'we must fight! I repeat it, sir, we must fight!' — repetition of an imperative is Henry turning up the volume on exactly the claim he wants to land.",
        "LOCATE THE CLIMAX. The build-up (failed petitions → futility of delay → inevitability of war) drives toward one statement, delivered with maximum emphasis near the end: armed resistance is no longer a choice among options but the only remaining course.",
        "APPLY THE TEST. What does Henry want the Convention to believe or do as a result of this speech? Not 'understand the history of the conflict' — believe that continued negotiation is now impossible and vote to authorize armed resistance immediately.",
        "STATE THE CLAIM IN ONE ARGUABLE SENTENCE, distinguishing it from both the topic and the subordinate reasons that support it.",
      ],
      answer:
        "Henry's claim: given that peaceful appeals to Britain have been exhausted and delay only weakens the colonies' position, armed resistance is no longer one option among several but the only remaining course open to Virginia. (Note this is arguable — a listener could have believed further negotiation was still possible — which is exactly why it's a claim and not a fact.)",
      estimatedMinutes: 6,
    },
    {
      id: 'try-claim-henry',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.henry-give-me-liberty.v1, write ONE sentence stating Henry's central claim. Do not summarize the topic (what the speech is about) and do not restate a subordinate reason (one piece of support) as if it were the main point — state the single arguable position the whole speech is built to defend.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      rubric: {
        parts: [
          {
            criterionId: 'claim',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the sentence states an arguable position (not a fact or plot summary) that accurately captures Henry's central claim — that continued petitioning/reconciliation is exhausted and armed resistance is now the only remaining course — stated as the OVERARCHING point rather than one supporting reason. Partial credit for a claim that is directionally correct but stated as only one subordinate reason (e.g. 'petitions have failed' presented as if it were the whole claim, with no synthesis to the 'we must fight' conclusion), or for a claim that is accurate but hedged into something no longer arguable (e.g. stating it as settled fact rather than a position). No credit for a sentence that only names the topic ('the speech is about resisting British rule') with no arguable position stated, or that merely paraphrases a quote without asserting a claim.",
            modelResponse:
              "Henry claims that because peaceful appeals to Britain have already failed and further delay would only leave the colonies weaker, armed resistance is no longer one option among several but the only course left open to them.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-reason-vs-claim',
      kind: 'misconception_check',
      question:
        'A student states: "Henry\'s claim is that the colonists have already tried petitioning the king and been ignored." Is this the central claim of the speech?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Mistaking a SUBORDINATE REASON (one piece of evidence supporting the argument) for the CLAIM itself — the reading-comprehension version of the summary-vs-analysis trap.',
          correctsTo:
            "No — that failed petitioning is a REASON Henry gives, one rung below the claim it supports. It answers 'why should we believe delay is pointless,' but it isn't the point the whole speech drives toward. The actual claim sits one level up: because petitioning has failed and delay only weakens their position, armed resistance is now the only remaining course. The test: ask whether the sentence could be one piece of evidence FOR a larger point, or IS the larger point. If a reasonable listener could accept the sentence as true and still not be at the speech's real conclusion, you've found a reason, not the claim.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Topic is what a text is about; claim is the arguable position it takes on that topic — always ask which one you just stated.',
        'A claim must be arguable: a fact or plot detail can never be a claim, because there is nothing to dispute.',
        "Don't mistake a subordinate reason (support FOR the claim) for the claim itself — a reason is one rung below the point it's defending.",
        "Watch signal language — modal words ('must,' 'cannot') and emphatic repetition — as clues to where a writer is asserting their claim.",
        "The reliable test: 'What does this writer want me to believe or do as a result of this text?' — state that in one arguable sentence.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.2',
    cedTitle: "Reading for the Writer's Claim",
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '1',
        note: "AP English Language and Composition Course and Exam Description, Unit 1 — distinguishing topic from the writer's arguable claim.",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.henry-give-me-liberty.v1',
        chapter: '1775',
        note: 'Patrick Henry, "Give Me Liberty or Give Me Death" — anchor text for locating the writer\'s central claim.',
      },
    ],
  },
};
