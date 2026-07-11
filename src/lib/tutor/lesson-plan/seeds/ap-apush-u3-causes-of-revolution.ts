/**
 * AP US History — CED Unit 3.2: Causes of the American Revolution.
 *
 * CALIBRATION PLAN — the Period-3 Vertical Slice's gold template. Establishes
 * the APUSH content-course segment semantics: concept = the historical
 * argument (why did the imperial crisis escalate to revolution?);
 * worked_example = annotated document analysis (what does a primary source
 * argue, and how does it evidence a cause?); try_yourself = a 3-point
 * SAQ-style short-answer (describe/explain/explain, not a full essay — the
 * DBQ/LEQ/SAQ essay-practice plans with authentic AP rubric totals live
 * separately, see docs/superpowers/specs/2026-07-10-ap-us-history-design.md).
 *
 * See that design doc §Architecture for the reused Passage/rubric infra and
 * the AP Plans Initiative memory for the shared AP conventions this plan
 * follows (pacingThresholds, source attribution, id/file/LO scheme).
 *
 * Anchor text: Thomas Paine, "Common Sense" (1776) —
 * evelyn.passage.apush-common-sense.v1. Teaching point is the ARGUMENT the
 * excerpt makes (America as a refuge for liberty, framing independence as a
 * universal cause) — quoted only as the short excerpt already seeded.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U3_CAUSES_OF_REVOLUTION: LessonPlan = {
  id: 'evelyn.ap.apush.causes-of-revolution.v1',
  title: 'U3.2 Causes of the American Revolution',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.causes-of-revolution',
      description:
        'Explain the causes of the American Revolution, including the end of salutary neglect, colonial objections to taxation without representation, and the influence of Enlightenment ideas of natural rights and government by consent.',
      standard: 'AP-APUSH-3.2',
    },
  ],
  prerequisites: [],
  followUps: ['apush.revolutionary-ideals'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the imperial crisis feel like a relationship breaking down, not an inevitable march to war.',
      script:
        "For over a century, Britain mostly left its American colonies alone — collecting some trade duties, rarely enforcing them, letting colonial assemblies run their own affairs. Colonists thought of themselves as British subjects with British rights. Then, starting in 1763, Britain suddenly needed money and started paying close attention. Within twelve years, colonists who had been proudly loyal were shooting at British soldiers. Nothing about a shared king or a shared language changed. What changed was the relationship. That's the puzzle of the American Revolution: not 'were the colonies always going to break away' — they weren't — but 'what turned loyal subjects into revolutionaries in just over a decade.'",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-imperial-crisis',
      kind: 'concept',
      goal: 'Explain how the end of salutary neglect, new taxation, and Enlightenment ideas combined to cause the Revolution.',
      keyIdeas: [
        "SALUTARY NEGLECT: Britain's long-standing policy — in place through the colonial era and intensifying under early-1700s ministers like Robert Walpole — of loosely enforcing trade and tax laws in the colonies, letting colonial assemblies handle most day-to-day governance. It remained largely unbroken until 1763, so colonists grew accustomed to real self-government even while remaining British subjects.",
        'THE TURNING POINT: the French and Indian War (1754–1763) left Britain with a massive war debt and new North American territory to defend. Parliament decided the colonies should help pay for their own defense — ending salutary neglect and asserting direct control for the first time in generations.',
        "NEW TAXES, NEW ANGER: the Sugar Act (1764), Stamp Act (1765), Townshend Acts (1767), and Tea Act (1773) each taxed colonists directly, without their consent, to raise revenue rather than merely regulate trade. Colonists had grown used to controlling their own taxation through their own assemblies.",
        "\"NO TAXATION WITHOUT REPRESENTATION\": the core colonial objection was NOT that taxes were too high — it was that Parliament, in which colonists had no elected representatives, had no legitimate authority to tax them at all. This was a constitutional argument about WHO gets to make the rules, not just a complaint about money.",
        "BRITAIN'S RESPONSE ESCALATED THE CRISIS: each colonial protest (boycotts, the Boston Tea Party) was met with harsher enforcement (the Coercive/'Intolerable' Acts of 1774), which pushed moderate colonists toward the radical position and built inter-colonial cooperation (the Committees of Correspondence, the First Continental Congress).",
        'ENLIGHTENMENT IDEAS SUPPLIED THE JUSTIFICATION: philosophers like John Locke argued government exists by the CONSENT of the governed to protect NATURAL RIGHTS (life, liberty, property) — and that a government violating those rights could be legitimately resisted. Colonial pamphleteers and leaders used this language to reframe resistance to taxes as a defense of universal rights, not just a colonial grievance.',
        'THE CAUSES COMBINE: material grievance (taxes imposed without consent) + constitutional argument (Parliament lacks authority over colonists without representation) + philosophical justification (natural rights and consent of the governed) together turned scattered protests into a unified, principled case for independence.',
      ],
      vocabulary: [
        {
          term: 'salutary neglect',
          definition:
            "Britain's long-running policy of loosely enforcing trade and tax laws in the colonies, allowing effective colonial self-government; ended after 1763.",
        },
        {
          term: 'no taxation without representation',
          definition:
            'the colonial argument that Parliament had no legitimate authority to tax colonists who had no elected representatives in it.',
        },
        {
          term: 'natural rights',
          definition:
            "Enlightenment idea (associated with John Locke) that all people possess inherent rights — life, liberty, property — that government exists to protect.",
        },
        {
          term: 'consent of the governed',
          definition:
            'the principle that a government\'s authority is only legitimate if the people it rules have agreed to be governed by it.',
        },
        {
          term: 'Coercive Acts',
          definition:
            "(also 'Intolerable Acts,' 1774) Britain's punitive laws closing Boston's port and curbing Massachusetts self-government after the Boston Tea Party — radicalized moderate colonists.",
        },
      ],
      passageId: 'evelyn.passage.apush-common-sense.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-common-sense',
      kind: 'worked_example',
      problem:
        "Analyze this excerpt from Thomas Paine's Common Sense (1776), published to convince ordinary colonists that independence — not reconciliation — was the answer: \"O ye that love mankind! Ye that dare oppose, not only the tyranny, but the tyrant, stand forth! Every spot of the old world is overrun with oppression. Freedom hath been hunted round the globe... O! receive the fugitive, and prepare in time an asylum for mankind.\" What is Paine arguing, and how does it reflect the causes of the Revolution?",
      steps: [
        'SOURCE IT FIRST. Who, when, why? Thomas Paine, January 1776 — after nine months of fighting had already begun (Lexington and Concord, April 1775) but before the Declaration. Paine is writing to persuade colonists still hoping for reconciliation with Britain that full independence is the only option.',
        'IDENTIFY THE CLAIM. Paine is not arguing about a specific tax. He reframes the whole conflict: America is not a rebellious colony, but the last refuge for liberty itself — "freedom hath been hunted round the globe" out of the Old World, and only America can give it "an asylum."',
        'CONNECT TO THE ENLIGHTENMENT CAUSE. This is the natural-rights argument in action: Paine treats liberty as a universal human inheritance ("that love mankind"), not a privilege Britain grants and can withdraw. That is exactly the philosophical move described in the concept — reframing a tax dispute as a defense of a universal right.',
        'CONNECT TO THE POLITICAL CAUSE. By calling George III "the tyrant" rather than blaming Parliament or specific ministers, Paine goes further than most earlier colonial writing — he indicts the monarchy itself, not just particular policies, which is why Common Sense is often credited with turning colonial anger over taxation into a demand for full separation.',
        'EXPLAIN THE EFFECT PAINE INTENDS. By framing independence as a moral rescue mission for "mankind" rather than a colonial grievance, Paine gives ordinary readers — not just political elites — a reason to see themselves as part of a universal cause, which is part of why the pamphlet sold so widely and shifted public opinion toward independence in early 1776.',
        'STATE THE LINK TO THE COURSE THESIS. This passage shows a CAUSE OF THE REVOLUTION (Enlightenment natural-rights thinking) being deployed as PERSUASION at a specific moment (early 1776) to convert material grievances about taxation into a broader argument for independence.',
      ],
      answer:
        "Paine argues that America is the last refuge for a universal human right — liberty — that has been driven out of the Old World, and that George III (\"the tyrant\") stands in the way of it. Written in January 1776, after fighting had begun but before the Declaration, the passage takes the Enlightenment idea of natural rights (which colonists had already used to argue against taxation without representation) and pushes it further: reconciliation is no longer framed as protecting colonial rights within the British Empire, but as America's unique role in protecting liberty for \"mankind.\" This rhetorical move — turning a dispute over taxes and representation into a universal moral cause — is a key reason Common Sense is credited with shifting public opinion toward full independence in 1776.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE cause of the American Revolution. (b) Briefly explain ONE piece of specific historical evidence that supports your answer to (a). (c) Briefly explain ONE way the ideas that drove the Revolution differed from earlier colonial political thinking (before 1763).",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes ONE genuine cause of the American Revolution — e.g. the end of salutary neglect and Britain\'s new revenue-raising taxes after 1763, the "no taxation without representation" objection to Parliamentary authority, the influence of Enlightenment natural-rights/consent-of-the-governed ideas, or escalating British enforcement (Coercive Acts) after colonial protest. No credit for a vague statement ("the colonists wanted freedom") with no identifiable specific cause.',
            modelResponse:
              'One cause of the Revolution was that, after the French and Indian War, Britain ended its long-standing policy of salutary neglect and began directly taxing the colonies (e.g. the Stamp Act) to pay off war debt — taxes colonists had no representatives in Parliament to consent to.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific piece of historical evidence (an act, event, document, or figure) that supports the cause named in (a), and connects it clearly to that cause rather than just naming it. No credit for evidence that is unconnected to the stated cause or is too generic to verify (e.g. 'the colonists were unhappy').",
            modelResponse:
              "The Stamp Act of 1765 taxed newspapers, legal documents, and playing cards directly, provoking colonial assemblies to pass resolutions (like the Virginia Resolves) denying Parliament's authority to tax them without representation — direct evidence of the 'no taxation without representation' objection driving resistance.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate way Revolutionary-era political thinking (natural rights, consent of the governed, resistance to a government violating those rights) differed from earlier colonial thinking that generally accepted British authority and monarchy as legitimate provided colonial assemblies retained self-governance. No credit for a vague contrast with no specific idea named.",
            modelResponse:
              "Before 1763, most colonists saw themselves as loyal British subjects who accepted Parliament's and the king's authority, so long as their own assemblies handled local taxation and governance. By the mid-1770s, writers like Paine reframed the conflict using Enlightenment natural-rights language — arguing government is only legitimate with the consent of the governed and that a government violating natural rights (like liberty) can be justly resisted, which went well beyond earlier colonial arguments that had only asked for the rights of Englishmen within the empire.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-inevitable',
      kind: 'misconception_check',
      question:
        'True or false: the American Revolution was inevitable — the colonies were always going to break away from Britain eventually, it was just a matter of time.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Presentism / inevitability thinking — reading the outcome (independence) backward into the whole colonial period as though it were destined, rather than tracing the specific chain of decisions and events (1763–1776) that produced it.',
          correctsTo:
            "FALSE. For most of the colonial period, colonists were proudly loyal British subjects — the Revolution was not a long-simmering inevitability but the outcome of a specific, escalating chain of events after 1763: new taxes following the end of salutary neglect, colonial objections on constitutional grounds, Britain's punitive response (the Coercive Acts), and Enlightenment ideas supplying the justification for resistance. At almost any point before 1774–75, moderate compromise was still possible and many colonists actively sought it (e.g. the Olive Branch Petition, July 1775, appealed directly to the king for reconciliation AFTER fighting had begun). Treating the Revolution as inevitable erases the actual historical argument AP US History asks you to make: WHY did THESE specific choices lead to THIS specific outcome, not a predetermined one.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Salutary neglect ended after 1763 (French and Indian War debt) — Britain started directly taxing and governing colonies it had mostly left alone for a century.',
        '"No taxation without representation" is a constitutional argument about legitimate authority, not just a complaint about tax rates.',
        'Enlightenment ideas (natural rights, consent of the governed — Locke) gave colonial resistance a universal philosophical justification, visible in texts like Common Sense.',
        'Protest and British response escalated each other: taxes → boycotts/Tea Party → Coercive Acts → radicalized moderates → Continental Congress.',
        'The Revolution was not inevitable — it resulted from a specific, escalating chain of events after 1763, not colonial destiny. Avoid presentism.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.2',
    cedTitle: 'Causes of the American Revolution',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-common-sense.v1',
        chapter: '1776',
        note: 'Thomas Paine, "Common Sense" — anchor document for the natural-rights justification of independence.',
      },
    ],
  },
};
