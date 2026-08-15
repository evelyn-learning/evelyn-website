/**
 * AP English Language & Composition — CED Unit 7.1: Nuance, Qualification,
 * and Concession.
 *
 * This unit targets the AP rubric's SOPHISTICATION point — the hardest point
 * on the essay, earned only by writing that goes beyond a competent,
 * defensible argument. The first and most teachable route into it is
 * QUALIFICATION: a writer who states a claim with the right degree of force
 * ("often," "in most cases," "to a considerable degree") rather than
 * overstating it into an absolute ("always," "every," "completely") is
 * already writing more precisely and more defensibly than a student who
 * reaches for the biggest possible claim. Genuine CONCESSION — not the
 * counterargument-then-rebuttal move of Unit 2, but a writer's honest
 * acknowledgment that their own claim has real limits or exceptions — is the
 * clearest single signal of sophisticated thinking a reader can recognize in
 * one sentence.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics (try_yourself MICRO grain: responseFormat
 * 'free', one sentence, rubric = single 6-point part) this plan follows.
 *
 * Anchor text: Frederick Douglass, "What to the Slave Is the Fourth of July?"
 * (1852) — evelyn.passage.douglass-fourth-of-july.v1. The teaching point is
 * Douglass's qualifying wish — "Would to God ... that an affirmative answer
 * could be truthfully returned" — a genuine concession of what he WISHES were
 * true, made in service of (not retreat from) his larger indictment. Quotes
 * below are limited to this short structural phrase, never the atrocity
 * content the speech condemns.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U7_NUANCE_QUALIFICATION_CONCESSION: LessonPlan = {
  id: 'evelyn.ap.englang.nuance-qualification-concession.v1',
  title: 'U7.1 Nuance, Qualification, and Concession',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.nuance-qualification-concession',
      description:
        'Qualify a claim with precise, defensible scope (acknowledging complexity, conditions, or degree) instead of overstating it, and make a genuine concession about a claim\'s own limits as a route to the sophistication point.',
      standard: 'AP-ENGLANG-7.1',
    },
  ],
  prerequisites: [
    'apenglang.defensible-thesis',
    'apenglang.building-an-argument',
    'apenglang.counterargument-rebuttal',
  ],
  followUps: ['apenglang.complex-reasoning'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that an overstated claim is easier to attack and less believable than a precisely-scoped one, before naming "qualification."',
      script:
        "Two witnesses describe the same accident. One says, 'That driver ALWAYS runs red lights — he's a menace who NEVER stops for anyone.' The other says, 'I've seen that driver run this particular light at least three times this month, usually when he's rushing.' Which one do you believe more? The first sounds like venting; the second sounds like testimony. The absolute claim is actually WEAKER — one counterexample destroys it entirely, and it sounds like the speaker hasn't thought carefully. The scoped, qualified claim is stronger precisely because it claims less than everything, and is honest about what it does and doesn't know. Sophisticated writers do the same thing on purpose: they say exactly as much as the evidence supports, no more — and that precision is what makes a reader trust them.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-qualification-concession',
      kind: 'concept',
      goal: 'Define qualification and genuine concession, distinguish them from hedging/weak-willed writing, and explain why they are a route to the sophistication point.',
      keyIdeas: [
        "QUALIFICATION means scoping a claim to the degree, conditions, or population the evidence actually supports — using words like 'often,' 'in most cases,' 'to a considerable degree,' 'under these conditions' instead of absolutes like 'always,' 'every,' 'completely,' 'no one.'",
        "An OVERSTATED claim (an absolute) is easy to destroy: a single counterexample refutes 'always' or 'never' entirely. A QUALIFIED claim is more defensible because it only claims what can actually be shown — it survives scrutiny a stronger-sounding absolute claim would not.",
        "GENUINE CONCESSION here is different from the counterargument-rebuttal move (naming an opponent's objection and answering it): it's the writer honestly acknowledging a real LIMIT, EXCEPTION, or TENSION within their OWN claim — where it does not fully hold, or where the picture is more complicated than the thesis alone suggests.",
        "This is NOT hedging or wishy-washy writing. HEDGING undermines the claim itself ('I guess maybe this could sort of be true'); QUALIFICATION sharpens the claim's precision while keeping its force ('this holds in most cases, though it weakens under X condition'). The claim stays defensible and specific — it just stops overreaching.",
        "The AP rubric's SOPHISTICATION point rewards writing that demonstrates a complex understanding, explains the significance of the rhetorical situation, or makes effective use of nuanced, precise language throughout — a genuinely qualified claim or an honest concession about the claim's own limits is one of the most learnable ways to demonstrate that complexity, because it shows the writer sees more than one layer of the issue.",
        "Douglass models exactly this move: 'Would to God, both for your sakes and ours, that an affirmative answer could be truthfully returned to these questions!' is a genuine concession — he is honestly admitting what he WISHES were true (that the nation's ideals did extend to enslaved people) — before showing that the real answer is otherwise. The concession does not weaken his indictment; naming what he wishes were true makes the gap he goes on to expose land harder.",
        "The test for a qualified claim: does it name the SCOPE (how much, how often, under what conditions) rather than reaching for the biggest possible version? The test for a genuine concession: does the writer name a real limit or complication in their OWN position, honestly, rather than only ever conceding points made by an imagined opponent?",
      ],
      vocabulary: [
        { term: 'qualification', definition: 'scoping a claim to the degree, frequency, or conditions the evidence actually supports, rather than stating it as an absolute.' },
        { term: 'overstatement', definition: 'a claim pushed to an absolute ("always," "every," "completely") beyond what the evidence can support.' },
        { term: 'concession (of one\'s own claim)', definition: "honestly acknowledging a real limit, exception, or complication within the writer's own position, not just an opponent's." },
        { term: 'hedging', definition: 'weakening a claim\'s force with vague uncertainty ("maybe," "sort of") rather than precisely scoping it — a failure mode, not sophistication.' },
        { term: 'sophistication (AP rubric)', definition: "the additional rubric point earned by writing that demonstrates complex understanding, situates the argument meaningfully, or uses precise, nuanced language throughout." },
      ],
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-qualify-douglass-claim',
      kind: 'worked_example',
      problem:
        "Revise this overstated claim into a precisely-qualified, more defensible one, using Douglass's own qualifying move as a model: \"Frederick Douglass proves that all national celebrations of freedom are completely meaningless and every American in his audience was a total hypocrite.\" (Mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.douglass-fourth-of-july.v1.)",
      steps: [
        "IDENTIFY THE OVERSTATEMENT. Flag every absolute word: 'proves,' 'all,' 'completely meaningless,' 'every,' 'total.' Each one is a claim a single counterexample could sink — surely SOME national celebrations mean something to someone, and Douglass never actually calls every audience member a hypocrite.",
        "ASK WHAT THE PASSAGE ACTUALLY SUPPORTS. Douglass's argument is specific: for the enslaved, THIS particular celebration (of a liberty they are denied) rings hollow — not that celebration itself is meaningless everywhere, and not that every listener personally chose hypocrisy rather than inherited it.",
        "SCOPE THE CLAIM TO THAT EVIDENCE. Replace 'all... completely meaningless' with a qualified version: the celebration rings hollow SPECIFICALLY for those it excludes, IN THE CONTEXT of a nation that has not extended its own founding promise.",
        "BUILD IN A GENUINE CONCESSION, modeled on Douglass's own 'Would to God ... that an affirmative answer could be truthfully returned' — honestly note what the qualified claim does NOT say (it doesn't accuse every listener of deliberate malice) so the claim's real scope is visible, not implied.",
        "CHECK THE REVISION KEEPS ITS FORCE. A qualified claim should still be a real, defensible, arguable claim — not so hedged it says nothing. Confirm the revision still makes a clear, specific point a reader could disagree with.",
      ],
      answer:
        "Revised: 'Douglass argues that for those excluded from it, the Fourth of July's promise of liberty rings hollow — not because every American celebrant is a knowing hypocrite, but because a nation's founding ideals, however sincerely felt by those they protect, remain empty for those they were never extended to.' This keeps Douglass's real claim (the celebration's hollowness for the excluded) while dropping the indefensible absolutes ('all,' 'completely,' 'every,' 'total') and honestly conceding that the argument is about a system's failure, not a verdict on every individual's conscience — which is closer to what the passage itself argues and harder to refute.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-qualify-claim',
      kind: 'try_yourself',
      problem:
        "Revise this overstated thesis into ONE sentence that is precisely qualified and genuinely concedes a real limit of its own claim, while still remaining a clear, defensible, arguable position: \"Social media has completely destroyed every meaningful friendship and there is no benefit to it whatsoever.\" Do not simply soften the claim into vagueness — keep it specific and arguable, just accurately scoped.",
      responseFormat: 'free',
      rubric: {
        parts: [
          {
            criterionId: 'qualification',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the revised sentence removes the indefensible absolutes ('completely destroyed,' 'every,' 'no benefit whatsoever'), scopes the claim to a specific degree/condition/population the writer could actually defend (e.g. 'for many teenagers,' 'shallow, low-effort interaction increasingly displaces,' 'in many cases,' 'though it does sustain some long-distance ties'), AND includes a genuine concession of a real limit or exception in the writer's OWN claim (not merely an opponent's objection) — while remaining a specific, arguable, defensible claim rather than collapsing into vague hedging ('maybe it's sort of bad sometimes'). Partial credit (2-4) for a revision that qualifies scope but includes no real concession, OR concedes something but leaves an absolute unfixed, OR is qualified but so vague it is no longer a clear claim. No credit for a sentence that keeps the absolutes intact, or that is a plot/content summary rather than a claim.",
              modelResponse:
                "While social media has not destroyed friendship outright — it does sustain some long-distance ties that would otherwise fade — it has, for many teenagers, made shallow, low-effort interaction a substitute for the sustained attention deeper friendships require.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-hedging-vs-qualifying',
      kind: 'misconception_check',
      question:
        'A student, told their thesis was "too absolute," revises it to: "I think maybe social media could kind of affect friendships in some way, possibly." Is this a successful qualification?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Treating HEDGING — piling on vague uncertainty until the claim says almost nothing — as if it were the same move as QUALIFICATION, which precisely scopes a claim while keeping it specific and arguable.',
          correctsTo:
            "No — this is hedging, not qualification, and it's actually a step backward. 'I think maybe... kind of... in some way, possibly' doesn't scope the claim to a specific degree or condition; it just drains all the content out of it until there's no longer a defensible, arguable position left to disagree with. Qualification keeps the claim SPECIFIC — 'social media shallow, low-effort interaction increasingly displaces sustained attention for many teenagers' — while being honest about scope and limits. The test: after qualifying, is there still a clear claim a reader could push back on with evidence? If the sentence has become so vague that no one could actually disagree with it, it's been hedged into meaninglessness, not sharpened into sophistication.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Qualification scopes a claim to what the evidence actually supports ('often,' 'to a considerable degree,' 'under these conditions') instead of overstating it into an absolute ('always,' 'every,' 'completely').",
        "An overstated claim is weaker, not stronger — a single counterexample refutes an absolute; a qualified claim survives scrutiny because it claims only what it can defend.",
        "Genuine concession here means honestly naming a real limit or exception in the writer's OWN claim — not the opponent's objection (that's Unit 2's counterargument-rebuttal move).",
        "Qualification is not hedging: hedging drains a claim of content with vague uncertainty; qualification keeps the claim specific and arguable while scoping it precisely.",
        "Precise qualification and honest concession are a learnable route to the AP rubric's SOPHISTICATION point — they demonstrate the writer sees more than one layer of the issue.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.1',
    cedTitle: 'Nuance, Qualification, and Concession',
    sources: [
      {
        type: 'plan',
        source: 'AP Plans Initiative — AP English Language',
      },
    ],
  },
};
