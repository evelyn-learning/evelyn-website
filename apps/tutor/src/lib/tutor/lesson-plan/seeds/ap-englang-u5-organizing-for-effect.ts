/**
 * AP English Language & Composition — CED Unit 5.4: Organizing an Argument
 * for Effect.
 *
 * Closes out Unit 5. Students now know how a single paragraph carries one
 * sub-claim (5.1), stays unified around it (5.2), and connects to its
 * neighbors with accurate transitions (5.3). This topic zooms out to the
 * whole-argument level: the ORDER in which points are sequenced — not just
 * their content — is itself a rhetorical choice that produces an effect on
 * the reader (weakest-to-strongest, strongest-first, chronological,
 * problem-solution).
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Patrick Henry, "Give Me Liberty or Give Me Death" (1775) —
 * evelyn.passage.henry-give-me-liberty.v1. The teaching point is how
 * Henry withholds his climactic repeated declaration until after
 * refuting the "weakness" objection — quotes below are limited to short,
 * structural rhetorical phrases already used as anchor evidence for this
 * speech elsewhere in the course. Lincoln's chronological past-present-
 * future structure (evelyn.passage.lincoln-gettysburg.v1) is referenced in
 * prose as a second organizing pattern.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U5_ORGANIZING_FOR_EFFECT: LessonPlan = {
  id: 'evelyn.ap.englang.organizing-for-effect.v1',
  title: 'U5.4 Organizing an Argument for Effect',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.organizing-for-effect',
      description:
        "Evaluate and choose an argument's point sequence (e.g. weakest-to-strongest, strongest-first, chronological, problem-solution) based on the rhetorical effect that ordering produces on the reader.",
      standard: 'AP-ENGLANG-5.4',
    },
  ],
  prerequisites: ['apenglang.transitions-cohesion', 'apenglang.line-of-reasoning-argument'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that reordering the same points changes the effect, before naming organizing patterns.',
      script:
        "Imagine you're asking a parent for a later curfew. You could lead with your BEST reason, or save it for last. Lead with it, and you risk them tuning out before you finish — the strongest ammunition is spent early on a skeptical audience. Save it for last, after several smaller points have already softened them up, and it can land as the final, decisive push. Same points, same words even — but a completely different order produces a completely different effect. Today we study ORDER as a rhetorical choice in its own right, not just a container for content.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-organizing-for-effect',
      kind: 'concept',
      goal: 'Name the common organizing patterns and show that reordering the same points changes the rhetorical effect on the reader.',
      keyIdeas: [
        "ORGANIZING FOR EFFECT means the ORDER in which an argument presents its points is itself a rhetorical choice, not a neutral container. The same set of points, reordered, can produce a different effect on the reader.",
        "COMMON ORGANIZING PATTERNS: weakest-to-strongest (saves the most persuasive point for last, building momentum toward a climax); strongest-first (leads with the best point to win over skeptical readers early); chronological (following a time sequence — past, present, future); and problem-solution (establishing a problem before proposing a fix, so the fix lands as necessary rather than arbitrary).",
        "WEAKEST-TO-STRONGEST builds momentum: a reader who has already accepted several minor points is primed to accept the strongest, climactic point last. Reversing the order (strongest first) would spend the argument's best material before the reader is warmed up to accept it.",
        "Henry's speech saves its most repetitive, declarative climax — 'we must fight! I repeat it, sir, we must fight!' — for AFTER he has already dismantled the 'we are weak' objection and established there is 'no longer any room for hope.' Opening with the climax would leave nothing left to build toward.",
        "CHRONOLOGICAL organization can itself carry an argument: Lincoln orders the Gettysburg Address past (the founding) → present (the war as a test of that founding) → future (the unfinished work), so the ORDER argues that the present moment is a test the past set up, and the future is what the present now demands. Reordering would break that logic, not just the timeline.",
        "Reordering a real argument is a genuine revision decision, not cosmetic tidying: moving the strongest point earlier trades momentum for early credibility with a skeptical audience; moving it later trades early credibility for a stronger finish. A writer should choose deliberately based on how resistant the audience is likely to be.",
        "THE TEST for organization-for-effect: ask what would be LOST if the points were shuffled into a different order. If nothing would be lost, the order isn't doing rhetorical work yet — it's still just a list.",
      ],
      vocabulary: [
        { term: 'weakest-to-strongest', definition: 'an organizing pattern that saves the most persuasive point for last, building momentum toward a climax.' },
        { term: 'strongest-first', definition: 'an organizing pattern that leads with the best point to win over a skeptical reader early.' },
        { term: 'chronological organization', definition: 'sequencing points by time (e.g. past, present, future) so the order itself carries part of the argument.' },
        { term: 'problem-solution structure', definition: 'establishing a problem before proposing a fix, so the fix lands as necessary rather than arbitrary.' },
      ],
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-henry-climax-order',
      kind: 'worked_example',
      problem:
        "Explain why Patrick Henry withholds his climactic repeated declaration \"we must fight!\" until AFTER he has already refuted the \"we are weak\" objection, rather than opening the speech with it (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.henry-give-me-liberty.v1).",
      steps: [
        "IDENTIFY WHAT COMES BEFORE THE CLIMAX. Naming the danger of false hope ('the illusions of hope'), then the exhausted history of peaceful petitions ('we have petitioned; we have remonstrated...'), building to 'there is no longer any room for hope. If we wish to be free, we must fight!'",
        "NOTICE THE DECLARATION ALREADY APPEARS ONCE BEFORE THE FULL CLIMAX. The speech is already building momentum through repetition of the same conclusion at more than one point, not introducing it cold.",
        "ASK WHAT OPENING WITH THE CLIMAX WOULD COST. It would ask the audience to accept the conclusion before hearing why hope is an illusion or why peaceful appeals have already failed — it would sound like a demand, not an earned conclusion.",
        "IDENTIFY THE ORDERING PATTERN. Weakest-to-strongest / climax-building: Henry sequences 'hope is a dangerous illusion' → 'we have exhausted every peaceful option' → (in the fuller speech) 'waiting won't make us stronger' → THEN the declarative climax.",
        "EXPLAIN THE EFFECT OF THE ORDER. Each prior point removes one more reason to wait, so that by the time the audience reaches 'we must fight,' it feels like the only conclusion left standing, not an opening assertion they haven't yet earned the right to hear.",
        "NAME THE TAKEAWAY. The order performs the persuasion: the same sentences in reverse order would read as a threat or demand rather than an earned, cumulative conclusion.",
      ],
      answer:
        "By placing the declarative climax after dismantling the illusion of hope and cataloguing the failure of peaceful appeals, Henry makes 'we must fight!' land as the one conclusion left standing rather than an opening demand — the weakest-to-strongest order is itself doing persuasive work that the same words in a different sequence would not do.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-order-effect-henry',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.henry-give-me-liberty.v1, write ONE sentence explaining why Henry places the repeated declaration \"we must fight!\" AFTER his refutation of the objection that the colonists are too weak to resist, rather than before it, and what specific rhetorical effect this ordering choice produces. Do not just summarize the content of the passage — name the ordering pattern and explain the EFFECT of the ORDER itself.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      rubric: {
        parts: [
          {
            criterionId: 'order-effect',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the sentence identifies the ordering choice (refuting weakness, and exhausting the case for hope, BEFORE the declarative climax — a weakest-to-strongest / climax-building pattern) AND explains the specific rhetorical effect this produces: the declaration lands as an earned, inescapable conclusion the audience has been walked into, rather than an opening demand they haven't yet been given reason to accept. Partial credit (3-4) for identifying the ordering choice accurately without explaining its effect, or gesturing at 'it builds up to it' without explaining WHY that sequencing is more persuasive than the reverse. No credit (0-2) for a sentence that only summarizes the content of the refutation or the climax with no claim about the order or its effect.",
            modelResponse:
              "By placing 'we must fight!' only after dismantling the claim that the colonists are too weak to resist, Henry makes the declaration land as the one conclusion left standing rather than as an opening demand the Convention hasn't yet earned the right to hear.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-directness-over-order',
      kind: 'misconception_check',
      question:
        'A student argues that Henry\'s speech would be MORE persuasive if it opened immediately with "we must fight!" because that is more direct and urgent than building up to it gradually. Is this a sound revision suggestion?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Equating directness/bluntness with persuasive strength, and ignoring that a climactic order builds EARNED momentum a blunt opening cannot — assuming the most urgent-sounding sentence is automatically the most effective one regardless of where it sits in the sequence.",
          correctsTo:
            "No — directness is not the same as persuasiveness. Opening with 'we must fight!' would ask a still-skeptical, still-deliberating Convention to accept the conclusion before hearing any of the reasoning that makes it feel necessary — it would read as a demand, not an earned decision. By instead refuting the 'we are weak' objection and exhausting the case for hope FIRST, Henry lets the audience arrive at the conclusion themselves, which is more persuasive than simply asserting it up front, however urgently. The test: ask what the ordering removes from the audience's ability to resist — a well-sequenced climax removes reasons to disagree one at a time; a blunt opening removes none of them.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The order in which an argument presents its points is a rhetorical choice, not a neutral container — reordering the same points changes the effect.",
        "Weakest-to-strongest builds momentum toward a climax; strongest-first wins over a skeptical reader early; chronological order can itself argue a relationship between past, present, and future; problem-solution makes a fix feel necessary rather than arbitrary.",
        "Henry withholds his climactic declaration until after refuting the weakness objection, so it lands as an earned conclusion rather than an opening demand.",
        "Directness is not the same as persuasiveness — a well-ordered build can be more persuasive than a blunt, unearned opening.",
        "Test: ask what would be LOST if the points were shuffled into a different order. If nothing would be lost, the order isn't doing rhetorical work yet.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.4',
    cedTitle: 'Organizing an Argument for Effect',
    sources: [
      {
        type: 'plan',
        source: 'AP Plans Initiative — AP English Language',
      },
    ],
  },
};
