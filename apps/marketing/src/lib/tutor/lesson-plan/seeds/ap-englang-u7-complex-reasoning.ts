/**
 * AP English Language & Composition — CED Unit 7.2: Complex Reasoning and
 * Implication.
 *
 * Builds on 7.1 (qualification/concession): once a claim is honestly scoped,
 * sophisticated reasoning goes further and traces what the claim actually
 * IMPLIES — tensions it creates, angles it opens up, second-order
 * consequences a simpler paragraph would leave unexamined. The most common
 * failure at this level isn't a factual error; it's OVERSIMPLIFICATION —
 * reasoning that stops at the first plausible link instead of following the
 * chain further, or that treats a claim as though it applies from only one
 * angle when a second, competing angle is equally live.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics (try_yourself PARAGRAPH grain: responseFormat
 * 'free', rubric = two parts summing to 6) this plan follows.
 *
 * Anchor text: Abraham Lincoln, "The Gettysburg Address" (1863) —
 * evelyn.passage.lincoln-gettysburg.v1. The teaching point is the
 * implication Lincoln draws from the dead's sacrifice — that the LIVING now
 * bear an unfinished obligation, not merely that the dead should be honored
 * — a reasoning move that goes one full step past the obvious. Quotes below
 * are limited to short structural phrases already used elsewhere in the
 * unit.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U7_COMPLEX_REASONING: LessonPlan = {
  id: 'evelyn.ap.englang.complex-reasoning.v1',
  title: 'U7.2 Complex Reasoning and Implication',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.complex-reasoning',
      description:
        'Reason beyond a claim\'s first, most obvious link to trace its implications, the tensions it creates, and more than one live angle on it, rather than stopping at an oversimplified single-step explanation.',
      standard: 'AP-ENGLANG-7.2',
    },
  ],
  prerequisites: [
    'apenglang.nuance-qualification-concession',
    'apenglang.line-of-reasoning-argument',
  ],
  followUps: ['apenglang.situating-in-context'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the difference between the first plausible explanation and the one that actually follows it through, before naming "implication."',
      script:
        "Someone asks why a store is closed on a Tuesday afternoon. The first answer that comes to mind: 'maybe they're just taking a break.' That's plausible, and it's also where most people stop thinking. But follow it one more step: if it's closed on a random weekday afternoon with no sign, no notice, that might imply something bigger — a supply problem, a staffing crisis, maybe the business is in trouble. The FIRST explanation isn't wrong, exactly — it's just shallow. It stops at the first plausible link instead of asking what that link, if true, would actually MEAN for everything else. Sophisticated reasoning does the same thing with an argument: it doesn't stop at the first connection between evidence and claim — it follows that connection to see what it implies, what tension it creates, and whether there's a second angle worth considering.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-complex-reasoning',
      kind: 'concept',
      goal: 'Define implication, tension, and the multi-angle move; explain why single-step reasoning reads as oversimplified even when it is technically correct.',
      keyIdeas: [
        "IMPLICATION is what a claim or piece of evidence points to BEYOND its immediate, most obvious meaning — the second-order consequence a reader wouldn't see unless the writer traced it out. Reasoning that stops at the first plausible link, without asking 'and if that's true, what does it mean for X?', is OVERSIMPLIFIED even when every individual sentence is accurate.",
        "A TENSION is a place where two things a writer's own argument depends on don't sit comfortably together — e.g., honoring the dead's sacrifice ALSO obligates the living to a task the dead can no longer perform themselves. Naming a tension the argument itself creates (not just an opponent's objection) is a hallmark of complex reasoning.",
        "REASONING FROM MULTIPLE ANGLES means testing a claim against more than one lens before settling on an explanation — e.g., a policy's likely effect on the group it targets AND its effect on groups it doesn't mention, or a text's stated purpose AND the purpose implied by its structure. Oversimplification often comes from unconsciously picking one angle and never checking whether a competing angle changes the picture.",
        "Complex reasoning is NOT complicated vocabulary or longer sentences — a short sentence can carry a genuinely complex implication, and a long one can just restate the obvious. The complexity is in the THINKING (what does this imply, where does it strain, what else could be true), not the diction (save that for Unit 7.4, rhetorical risk and style).",
        "A reliable move: state the claim → ask 'if this is true, what does it further imply, or where does it create tension with something else the argument needs?' → follow that implication out loud, rather than stopping once the first, safest connection has been made.",
        "Lincoln performs exactly this move: the obvious claim is 'we should honor the dead.' But he reasons a full step further — their sacrifice implies an unfinished OBLIGATION on the LIVING ('It is for us the living, rather, to be dedicated here to the unfinished work') — a genuinely complex move because it turns a moment of commemoration into a demand for future action, which creates its own tension: honoring the past requires acting, not just remembering.",
        "The test for oversimplification: could this reasoning stop one sentence earlier and lose nothing? If the paragraph's second half only restates its first half in different words, the reasoning hasn't actually gone anywhere — it has described a claim, not extended it.",
      ],
      vocabulary: [
        { term: 'implication', definition: "what a claim points to beyond its immediate, most obvious meaning — the further consequence tracing it out reveals." },
        { term: 'tension', definition: "a place where two things an argument depends on pull against each other, created by the argument's own logic." },
        { term: 'oversimplification', definition: 'reasoning that stops at the first plausible link instead of tracing implications or considering a competing angle.' },
        { term: 'multiple angles', definition: "testing a claim against more than one lens (who benefits, who is unmentioned, what the structure implies vs. states) before settling on an explanation." },
        { term: 'second-order consequence', definition: 'an effect or meaning that follows from a first effect, not visible until the reasoning is carried one step further.' },
      ],
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-lincoln-implication',
      kind: 'worked_example',
      problem:
        "Build one body paragraph that reasons past the obvious claim ('Lincoln honors the soldiers who died') to the complex implication his speech actually draws, tracing the tension it creates for the living audience (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.lincoln-gettysburg.v1).",
      steps: [
        "STATE THE OBVIOUS, FIRST-LEVEL CLAIM. Lincoln says the dead deserve honor and that 'we can not dedicate — we can not consecrate — we can not hallow — this ground,' because the soldiers' actions already did that.",
        "ASK WHAT THAT CLAIM FURTHER IMPLIES. If the ground is already consecrated by the dead's action, and the living cannot add to it by speech, then the living have not been let off the hook — they have been handed a DIFFERENT obligation: not to speak well, but to ACT well, to continue 'the unfinished work.'",
        "NAME THE TENSION THIS CREATES. A commemoration speech that insists words can't do what the occasion requires ('the world will little note, nor long remember what we say here') is, on its surface, self-undermining — Lincoln is speaking AT LENGTH about the limits of speaking. The tension: how can a speech honor an act it insists speech cannot honor?",
        "RESOLVE THE TENSION BY TRACING THE IMPLICATION ONE STEP FURTHER. The speech resolves this by redirecting its own purpose: it isn't trying to consecrate the ground (impossible), it's trying to consecrate the LIVING to the unfinished task — 'that from these honored dead we take increased devotion to that cause.' The speech's job was never commemoration; it's mobilization dressed as commemoration.",
        "LINK BACK TO WHY THIS IS THE COMPLEX READING, not the simple one. A first-level reading ('Lincoln honors the dead') stops one full step short of what the text is actually reasoning toward — an argument that the ONLY adequate honor is the living continuing the dead's work, which turns a graveside speech into a demand for future action.",
      ],
      answer:
        "The obvious reading of the Gettysburg Address is that Lincoln honors the fallen soldiers; the complex reading is that he uses their sacrifice to place an obligation on the living that the speech itself cannot discharge. Lincoln insists that words cannot consecrate the ground — 'we can not dedicate—we can not consecrate—we can not hallow—this ground' — which creates a real tension: why deliver a speech about the limits of speech-making at all? The implication resolves the tension by redirecting the speech's purpose away from commemorating the dead (which he says is already done, and beyond his power) and toward mobilizing the living, who alone can still act: 'It is for us the living, rather, to be dedicated here to the unfinished work.' Read this way, the speech is not primarily an act of mourning but an act of recruitment disguised as one — its true claim is that honoring the dead requires continuing their work, not merely remembering it.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-implication-paragraph',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.lincoln-gettysburg.v1, write ONE body paragraph that reasons PAST the obvious claim that 'government of the people, by the people, for the people' celebrates democracy, to the more complex implication: that Lincoln frames the war itself as a TEST of whether such a government CAN survive at all ('testing whether that nation, or any nation so conceived and so dedicated, can long endure'). Your paragraph must trace at least one specific implication or tension beyond the first-level claim, using specific evidence, not simply restate that Lincoln values democracy.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      rubric: {
        parts: [
          {
            criterionId: 'evidence',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph cites specific, accurately-quoted evidence relevant to the implication (e.g. 'testing whether that nation... can long endure,' the closing tricolon 'of the people, by the people, for the people, shall not perish from the earth,' or 'a new birth of freedom'). Partial credit (1-2) for evidence present but vague or only loosely tied to the implication being traced. No credit for missing, misquoted, or irrelevant evidence.",
            modelResponse:
              "Lincoln frames the war explicitly as a test rather than an accomplished fact — 'testing whether that nation, or any nation so conceived and so dedicated, can long endure' — and closes by making survival itself, not merely celebration, the stake: government 'of the people, by the people, for the people, shall not perish from the earth.'",
          },
          {
            criterionId: 'implication',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): commentary goes past the first-level claim (Lincoln values/celebrates democracy) to trace the complex implication that the speech reframes the war as an open, still-undecided experiment whose outcome is not guaranteed — meaning the founders' 'proposition that all men are created equal' is not a settled fact being honored but a hypothesis still being tested by whether the nation survives, which places real risk and uncertainty at the center of a speech that could otherwise read as simple patriotic reassurance. Partial credit for commentary that gestures at the implication without tracing it (e.g. only restates 'it's a test') or that identifies a tension but does not explain what it implies. No credit for commentary that only restates the obvious celebratory reading with no further reasoning.",
            modelResponse:
              "By calling the war a 'test' rather than treating democratic government as an achieved fact, Lincoln implies something more unsettling than simple patriotic pride: the 'proposition that all men are created equal' is not a settled truth being honored at Gettysburg, but a hypothesis whose survival is still genuinely in doubt. This reframes commemoration as high-stakes uncertainty — the speech isn't reassuring its audience that democracy has proven itself, but warning them that it might not, unless the living carry the 'unfinished work' forward themselves.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: 'misconception-oversimplified-single-step',
      kind: 'misconception_check',
      question:
        'A student writes: "Lincoln says the soldiers died for freedom, so this paragraph shows that Lincoln thinks freedom is important." Is this complex reasoning?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Treating a single, obvious, one-step link between evidence and claim as if tracing it counted as complex reasoning — OVERSIMPLIFICATION dressed up as analysis because it sounds like a conclusion.',
          correctsTo:
            "No — this stops at the first plausible link and goes no further. 'Freedom is important' is true but so general it explains almost nothing specific about THIS text; it could be written about nearly any speech on the subject. Complex reasoning asks the next question: if Lincoln values freedom, what does THIS passage imply beyond that — that the living now owe the dead an unfinished task, that the nation's survival (not just its ideals) is in doubt, that words themselves are inadequate to the occasion? The test: does the sentence stop at the FIRST plausible connection, or does it follow that connection to a further, more specific implication a different, less careful reader would have missed? If it stops at the first link, it's oversimplified, no matter how confidently it's stated.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Implication is what a claim points to BEYOND its most obvious meaning — reasoning that stops at the first plausible link is oversimplified even if every sentence in it is accurate.",
        "A tension is a place an argument's own logic pulls against itself; naming and resolving a tension the argument itself creates is a hallmark of complex reasoning.",
        "Complex reasoning tests a claim from more than one angle before settling on an explanation — oversimplification often comes from silently picking one angle and never checking a competing one.",
        "Complexity lives in the THINKING, not the vocabulary — a short sentence can carry a genuinely complex implication; a long one can just restate the obvious.",
        "Test: could the reasoning stop one sentence earlier and lose nothing? If so, it hasn't gone anywhere — it has described the claim, not extended it.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.2',
    cedTitle: 'Complex Reasoning and Implication',
    sources: [
      {
        type: 'plan',
        source: 'AP Plans Initiative — AP English Language',
      },
    ],
  },
};
