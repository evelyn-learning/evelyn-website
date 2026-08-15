/**
 * AP English Language & Composition — CED Unit 2.5: Introductions and
 * Conclusions.
 *
 * Closes Unit 2's argument-essay sequence: everything built across the unit
 * — a defensible position (2.1), sequenced evidence (2.2), a coherent line
 * of reasoning (2.3), and a handled counterargument (2.4) — can still be
 * undercut by an opening that buries the stakes, or a conclusion that only
 * repeats the thesis and stops. This topic trains framing: earning the claim
 * with a concrete opening and answering "so what" with a conclusion that
 * transforms, rather than restates, that opening.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Abraham Lincoln, "The Gettysburg Address" (1863) —
 * evelyn.passage.lincoln-gettysburg.v1, whose opening ("Four score and seven
 * years ago... conceived in Liberty") establishes stakes before any mention
 * of the war or dedication, and whose closing tricolon ("of the people, by
 * the people, for the people") transforms rather than repeats that opening.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U2_INTROS_CONCLUSIONS: LessonPlan = {
  id: 'evelyn.ap.englang.intros-conclusions.v1',
  title: 'U2.5 Introductions and Conclusions',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.intros-conclusions',
      description:
        'Frame an original argument with an introduction that establishes concrete stakes before stating the claim, and a conclusion that answers "so what" by transforming — rather than restating — the opening.',
      standard: 'AP-ENGLANG-2.5',
    },
  ],
  prerequisites: ['apenglang.counterargument-rebuttal', 'apenglang.audience-context'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that an opening and closing frame everything else, before naming "stakes" or "framing."',
      script:
        "The first ten seconds of a persuasive speech decide whether the audience leans in or starts checking their phone. The last ten seconds decide what they actually carry out of the room. Everything you've built this unit — a sharp position, well-sequenced evidence, a coherent line of reasoning, a rebuttal that survives the strongest objection — can still fall flat if the opening buries the stakes under generic throat-clearing, or if the conclusion just repeats the thesis in the same words and stops. Today we learn how to earn a reader's attention before you ask for their agreement, and how to leave them with more than a rerun of what they already read.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-intros-conclusions',
      kind: 'concept',
      goal: 'Define what an introduction and conclusion must each accomplish, name reliable opening strategies and the traps to avoid, and explain framing.',
      keyIdeas: [
        "An INTRODUCTION'S job is to establish STAKES before it states the claim — give the reader a reason to care about the issue BEFORE asking them to agree with a position on it. A claim dropped with no stakes reads like an assignment being completed, not an argument being made.",
        "Reliable opening strategies: a vivid SPECIFIC SCENARIO or fact that makes the issue concrete, a striking STATISTIC that reframes scale, or a direct statement of the TENSION or counter-position the essay will resolve — all of which earn the reader's attention before the claim itself arrives.",
        "AVOID THE 'DICTIONARY OPENING' AND THE 'SINCE THE DAWN OF TIME' OPENING — starting from an overly broad, generic frame ('Throughout history, people have argued about...') delays the stakes instead of establishing them, and signals a writer stalling rather than staking a claim.",
        "A CONCLUSION'S job is NOT to restate the thesis in the same words — that wastes the reader's last attention on information they already have. A strong conclusion answers 'so what': why does this claim matter beyond the essay itself, what should change, what's at stake if it doesn't?",
        "FRAMING ties the introduction and conclusion together deliberately — an image, question, or scenario raised in the opening can be revisited, transformed, in the closing, so the essay reads as a complete arc rather than a claim sandwiched between two disconnected paragraphs.",
        "Lincoln's opening — 'Four score and seven years ago our fathers brought forth... a new nation, conceived in Liberty' — states the stakes (a nation founded on a specific proposition) before the speech ever gets to its immediate occasion. His closing — 'government of the people, by the people, for the people, shall not perish from the earth' — doesn't restate the opening in the same words; it TRANSFORMS the founding proposition into a forward-looking stake for the living.",
        "The test for a conclusion: if you deleted it, would the essay feel unfinished because it never answered 'why does this matter,' or would nothing be lost because it only repeated what the introduction already said?",
      ],
      vocabulary: [
        { term: 'stakes', definition: 'the reason a reader should care about an issue, established before the claim itself is stated.' },
        { term: 'framing', definition: "the deliberate link between an essay's opening and closing, so an image or question is transformed rather than merely repeated." },
        { term: 'dictionary opening', definition: "a generic, overly broad opening ('throughout history...') that delays stakes instead of establishing them." },
        { term: 'so-what conclusion', definition: "a conclusion that answers why the claim matters beyond the essay, rather than restating the thesis." },
        { term: 'hook', definition: 'a concrete scenario, statistic, or detail an introduction uses to earn the reader\'s attention before the claim.' },
      ],
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-frame-start-times',
      kind: 'worked_example',
      problem:
        "Write an opening and a closing frame for the same essay (claim: high schools should push start times to 8:30 a.m. or later), modeled on how Lincoln establishes stakes in his opening and transforms them — rather than repeating them — in his closing (mentioned here in prose; this segment type carries no passageId field).",
      steps: [
        "REJECT THE 'DICTIONARY OPENING.' A draft opener like 'Throughout history, schools have set various start times' is generic and delays the stakes — discard it.",
        "FIND A CONCRETE STAKES-ESTABLISHING DETAIL. Choose something specific and vivid — that the average American teenager gets nearly two hours less sleep per night than sleep scientists say adolescents need — not sleep 'in general,' a specific, measurable gap.",
        "OPEN WITH THAT STAKE, NOT THE CLAIM YET. Lead with the concrete fact so the reader feels the scale of the problem before being asked to agree with a solution.",
        "STATE THE CLAIM, positioned as the answer the stakes-establishing opening has earned. Now the position (push start times to 8:30 a.m. or later) lands as a response to a problem the reader already feels, not an assignment being announced.",
        "PLAN THE CONCLUSION AS A TRANSFORMATION, NOT A REPETITION. Instead of restating the sleep-gap fact, project it forward — what happens to THIS generation of students if the gap is allowed to persist through their whole adolescence — echoing how Lincoln's closing projects the founding proposition forward into 'a new birth of freedom' rather than repeating 'four score and seven years ago.'",
        "WRITE BOTH FRAMES so the closing answers the 'so what' the opening's fact raised, without repeating its wording.",
      ],
      answer:
        "OPENING: \"The average American teenager gets nearly two hours less sleep per night than sleep scientists say adolescent brains need to function — and the single biggest, most fixable cause of that gap is a school bell that rings before their bodies are biologically ready for it. High schools should push start times to 8:30 a.m. or later.\" CLOSING: \"A generation of students forced to choose, every school-day morning, between their education and their biology will not simply catch up on the weekend — the debt compounds for four years and follows them past graduation. Moving the first bell later doesn't just fix a schedule; it is the one change a district can make tomorrow that lets an entire generation's biology and education stop working against each other.\" The opening earns the claim with a concrete stake; the closing transforms that same stake into a forward-looking consequence instead of repeating it.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-opening-frame',
      kind: 'try_yourself',
      problem:
        "Continuing the same argument essay (claim: high schools should push start times to 8:30 a.m. or later), write ONE opening sentence that establishes concrete stakes for the issue BEFORE stating the claim — using a specific scenario, statistic, or vivid detail, not a generic 'throughout history' opening. Do not state the claim itself in this sentence; earn it first.",
      responseFormat: 'free',
      rubric: {
        parts: [
          {
            criterionId: 'framing',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): a single sentence that establishes concrete, specific stakes for the school-start-times issue (a vivid scenario, a striking statistic, or a specific detail that reframes the scale of the problem) without yet stating the claim itself, and avoids the 'dictionary opening'/'since the dawn of time' generic frame. Partial credit for a sentence that gestures at stakes but stays generic ('sleep is important for students') with no specific, concrete detail, or that states the claim itself instead of earning it first. No credit for a generic, overly broad opening with no specific stake ('Throughout history, schools have debated start times') or for a sentence that only restates the issue as a topic.",
            modelResponse:
              "By the time the first bell rings at 7:15, many high schoolers have already been awake for two-plus hours running on a sleep debt their own biology says they shouldn't have to carry.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-restated-conclusion',
      kind: 'misconception_check',
      question:
        'A student\'s essay conclusion reads: "In conclusion, as I have shown, high schools should push start times to 8:30 a.m. or later because of the reasons discussed above." Is this an effective conclusion?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Mistaking a RESTATEMENT of the thesis in near-identical words — with 'as I have shown' and 'the reasons discussed above' standing in for actual content — for a conclusion that answers 'so what.'",
          correctsTo:
            "No — this repeats information the reader already has (the claim) and adds nothing about why it matters beyond the essay itself. 'As I have shown' and 'the reasons discussed above' are placeholders, not content — they gesture at the essay's body without extending its point anywhere. The test: if you deleted this conclusion, would the essay feel unfinished because a question was left unanswered, or would nothing be lost because it only repeated the opening claim? Here, nothing would be lost — the conclusion isn't doing its job. A fix projects the claim forward: what happens to real students if the change isn't made, or what does making it unlock, phrased so it couldn't have appeared verbatim in the introduction.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "An introduction earns the claim by establishing concrete stakes FIRST — a specific scenario, statistic, or vivid detail — not by opening with a generic 'throughout history' frame.",
        "A conclusion's job is to answer 'so what,' projecting the claim's significance forward — not to restate the thesis in near-identical words.",
        "Framing ties the introduction and conclusion together: an image or stake raised at the opening can be transformed, not repeated, at the close.",
        "Test your own conclusion: if you deleted it, would the essay feel unfinished, or would nothing be lost because it only repeated the introduction?",
        "Everything built across this unit — claim, evidence, reasoning, rebuttal — depends on an opening and closing that earn and extend it, rather than bury or merely restate it.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.5',
    cedTitle: 'Introductions and Conclusions',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '2',
        note: 'AP English Language and Composition Course and Exam Description, Unit 2 — framing an argument with an introduction that earns its claim and a conclusion that answers "so what."',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.lincoln-gettysburg.v1',
        chapter: '1863',
        note: 'Abraham Lincoln, "The Gettysburg Address" — model of an opening that establishes stakes and a closing that transforms rather than repeats them.',
      },
    ],
  },
};
