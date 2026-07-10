/**
 * AP English Language & Composition — CED Unit 5.2: Unity and Coherence.
 *
 * Builds on 5.1 (a paragraph carries one sub-claim via a topic sentence):
 * now students learn to police that sub-claim sentence-by-sentence. Unity
 * means every sentence in a paragraph actually serves the topic sentence's
 * claim — a well-connected, smoothly-flowing paragraph can still fail if
 * one sentence, however true or interesting, answers a different question
 * than the paragraph is asking.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Patrick Henry, "Give Me Liberty or Give Me Death" (1775) —
 * evelyn.passage.henry-give-me-liberty.v1. The teaching point is how
 * tightly every sentence in Henry's rebuttal to "we are weak" serves that
 * single refutation — quotes below are limited to the short, structural
 * rhetorical phrases already used as anchor evidence for this speech
 * elsewhere in the course.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U5_UNITY_AND_COHERENCE: LessonPlan = {
  id: 'evelyn.ap.englang.unity-and-coherence.v1',
  title: 'U5.2 Unity and Coherence',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.unity-and-coherence',
      description:
        "Evaluate whether every sentence in a paragraph serves that paragraph's topic-sentence claim, and identify or revise sentences that break unity by digressing from it.",
      standard: 'AP-ENGLANG-5.2',
    },
  ],
  prerequisites: ['apenglang.reasoning-and-paragraphing'],
  followUps: ['apenglang.transitions-cohesion'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that a smoothly-written sentence can still break a paragraph, before naming "unity" or "digression."',
      script:
        "Imagine a friend telling you a story about a terrible day at work, and mid-story they mention, smoothly and in the same tone, that their car is due for an oil change. It's a true sentence. It's delivered just as fluently as everything around it. But it doesn't belong — it isn't part of the story they're telling. A paragraph works the same way. Every sentence can be grammatically smooth and factually accurate and STILL not belong, if it isn't actually serving the paragraph's one claim. Today we learn to catch the sentence that's true, well-written, and completely beside the point.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-unity-and-coherence',
      kind: 'concept',
      goal: 'Define unity, digression, and coherence, and show how a paragraph can be smooth and still break unity.',
      keyIdeas: [
        "UNITY means every sentence in a paragraph serves that paragraph's single topic-sentence claim. A unified paragraph has no sentence that could be deleted without weakening the paragraph's job, and no sentence that actually belongs to a different point.",
        "COHERENCE (the sentence-to-sentence FLOW of a paragraph, covered next in 5.3) is a different problem than unity. A paragraph can be perfectly coherent — reading smoothly, one sentence leading naturally to the next — while still containing a sentence that breaks unity by quietly drifting off the paragraph's actual claim.",
        "A DIGRESSION is any sentence that, however true or well-written, does not serve the paragraph's stated claim. Digressions are dangerous precisely because they often feel relevant — they're about the same broader subject — even though they answer a different question than the paragraph is asking.",
        "THE TEST FOR UNITY: can you trace every sentence back to the topic sentence with a clear \"this sentence supports THAT claim because...\"? If any sentence fails that test, it breaks unity — it should either be cut, or the topic sentence needs to change (which usually means the paragraph is really two paragraphs, per 5.1).",
        "Digressions often smuggle themselves in as background information, a related fact, or an aside that feels relevant because it's about the same broader subject, even though it does not support the specific claim the paragraph is making.",
        "Revising for unity usually means CUTTING a sentence, not rewording it. A true digression rarely can be repaired by editing its phrasing, because the problem is what the sentence is doing there, not how it's worded.",
        "Henry's rebuttal to the objection that the colonists are 'too weak' stays relentlessly on ONE claim: delay makes weakness worse, not better. Every sentence in that stretch pushes the same single point — none of it digresses into, say, a separate point about the merits of reconciliation.",
        "Strong writers protect unity even under time pressure by rereading the topic sentence after drafting and checking each following sentence against it — one sentence, one test, every time.",
      ],
      vocabulary: [
        { term: 'unity', definition: "the property that every sentence in a paragraph serves that paragraph's single topic-sentence claim." },
        { term: 'digression', definition: 'a sentence that does not serve the paragraph\'s stated claim, however true or well-written it is.' },
        { term: 'coherence', definition: 'the sentence-to-sentence flow of a paragraph — a separate quality from unity (developed further in 5.3).' },
      ],
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-henry-unity',
      kind: 'worked_example',
      problem:
        "Show that every sentence in Henry's rebuttal to the objection 'we are weak' (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.henry-give-me-liberty.v1) serves the SAME single claim, with none breaking unity into a different point.",
      steps: [
        "STATE THE PARAGRAPH'S IMPLICIT TOPIC-SENTENCE CLAIM. Delaying resistance will make the colonists weaker, not stronger — waiting is not a viable strategy.",
        "TRACE THE OPENING SENTENCE. 'They tell us, sir, that we are weak; unable to cope with so formidable an adversary' — this names the objection the paragraph exists to refute. It serves the claim by stating exactly what will be answered.",
        "TRACE THE FOLLOW-UP QUESTIONS. 'But when shall we be stronger? Will it be the next week, or the next year?' — these directly argue that delay does not help. They serve the same claim.",
        "TRACE THE RHETORICAL QUESTION ABOUT INACTION. 'Shall we gather strength by irresolution and inaction?' — reinforces the identical point via a rhetorical question. Still the same claim.",
        "TRACE THE POSITIVE COUNTER-EVIDENCE. 'Three millions of people, armed in the holy cause of liberty...are invincible' — this supplies the positive half of the refutation (we ARE strong now, if we act). It still serves the same claim by completing it, not introducing a new one.",
        "TRACE THE SENTENCE ABOUT DIVINE PROVIDENCE. 'There is a just God...who will raise up friends to fight our battles for us' — this could look like a digression (a new idea, providence), but it is still additional support for why the colonists are not truly weak, not an unrelated topic like a case for reconciliation.",
        "CONCLUDE. No sentence in this stretch introduces an unrelated claim — nothing here argues about taxation policy or the merits of peace. That is what unity looks like even across several sentences and a shift in the kind of evidence used.",
      ],
      answer:
        "Every sentence in Henry's rebuttal — the naming of the objection, the rhetorical questions about delay, the counter-evidence about numbers, and the appeal to providence — serves the single claim that waiting will not make the colonists stronger. None of it drifts into an unrelated point; that unbroken focus is what unity across multiple sentences looks like.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-identify-digression',
      kind: 'try_yourself',
      problem:
        "A student drafts this body paragraph arguing that a four-day school week would improve student focus: \"Cutting one day from the school week would sharpen focus rather than dilute learning, because students would arrive to fewer, longer class blocks with more sustained attention instead of five days of divided energy. Longer blocks also give teachers room for deeper, uninterrupted work instead of constant transitions. Many students also have part-time jobs on weekends, which is a completely separate scheduling issue from the length of the school week itself. With fewer, longer days, students would build the sustained-focus habits that shorter but more frequent days actually erode.\" Identify the ONE sentence that breaks this paragraph's unity, and in one sentence explain why it does not serve the paragraph's claim.",
      responseFormat: 'free',
      rubric: {
        parts: [
          {
            criterionId: 'unity-identification',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): correctly identifies the sentence about students' part-time weekend jobs as the one that breaks unity, AND explains, specifically, that it does not serve the paragraph's claim (that fewer, longer school days sharpen focus) because it addresses a different topic (weekend employment scheduling) rather than the paragraph's actual point about classroom attention/focus — going beyond simply noting the sentence is 'off-topic' in general terms. Partial credit (3-4) for correctly identifying the sentence but explaining the reason only vaguely (e.g. 'it doesn't fit' with no connection to the specific claim), or for a reasonable but incorrect identification paired with a well-reasoned unity argument. No credit (0-2) for identifying no sentence, identifying the wrong sentence with no defensible unity reasoning, or an answer that summarizes the paragraph's content without addressing unity.",
            modelResponse:
              "The sentence \"Many students also have part-time jobs on weekends, which is a completely separate scheduling issue from the length of the school week itself\" breaks the paragraph's unity because it shifts to weekend employment scheduling — a different topic entirely — rather than supporting the paragraph's actual claim that fewer, longer school days improve classroom focus.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-related-vs-relevant',
      kind: 'misconception_check',
      question:
        'A student defends the weekend-jobs sentence above by saying, "It\'s fine — it\'s still about students and school schedules, so it\'s related to the paragraph." Is this a valid defense of the paragraph\'s unity?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Treating RELATED-TO-THE-SUBJECT (broadly about students/schedules) as if it were the same thing as RELEVANT-TO-THE-CLAIM (specifically supports THIS paragraph's claim about focus). This is the core unity trap — a sentence can share a subject with the paragraph while answering a completely different question.",
          correctsTo:
            "No — being about the same broad subject (school schedules) is not the same as serving the paragraph's specific CLAIM (that fewer, longer days sharpen focus). The weekend-jobs sentence answers a different question — how students spend their weekends — not the paragraph's actual question, which is about classroom attention during the week. The test isn't \"is this sentence about a related subject?\" — it's \"does this sentence support THIS paragraph's specific claim?\" A true, well-written, on-subject sentence can still break unity if it fails that second, narrower test.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Unity means every sentence serves the paragraph's single topic-sentence claim — not just its general subject.",
        "A digression can be true, well-written, and even about the same broad topic, and still break unity if it answers a different question than the paragraph is asking.",
        "The test: trace every sentence back to the topic sentence with \"this supports THAT claim because...\" — if a sentence fails the test, cut it or split the paragraph.",
        "Fixing a digression is usually a CUT, not a rewording — the problem is what the sentence is doing there, not how it's phrased.",
        "Coherence (smooth flow) and unity (staying on the claim) are different problems — a paragraph can flow smoothly and still fail unity.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.2',
    cedTitle: 'Unity and Coherence',
    sources: [
      {
        type: 'plan',
        source: 'AP Plans Initiative — AP English Language',
      },
    ],
  },
};
