/**
 * AP US History — CED Unit 3.3: The Ideas of the American Revolution.
 *
 * Period-3 Vertical Slice content plan (follows the causes-of-revolution
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale and docs/superpowers/specs/2026-07-10-ap-us-history-design.md
 * for the shared Passage/rubric infra this plan reuses).
 *
 * Where causes-of-revolution explains WHY the imperial crisis escalated,
 * this plan asks WHAT IDEAS the revolutionaries used to justify breaking
 * from Britain and to imagine a new kind of government — Lockean natural
 * rights and republicanism, expressed most fully in the Declaration of
 * Independence.
 *
 * Anchor text: the Declaration of Independence (1776), preamble —
 * evelyn.passage.apush-declaration.v1. Teaching point is how the preamble
 * OPERATIONALIZES Enlightenment philosophy into a political argument
 * (self-evident truths, unalienable rights, consent of the governed, the
 * right to alter or abolish an unjust government).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U3_REVOLUTIONARY_IDEALS: LessonPlan = {
  id: 'evelyn.ap.apush.revolutionary-ideals.v1',
  title: 'U3.3 The Ideas of the American Revolution',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.revolutionary-ideals',
      description:
        'Explain the intellectual origins of the American Revolution, including Lockean natural rights and social-contract theory, republicanism, and how these ideas were expressed in colonial pamphlets and the Declaration of Independence.',
      standard: 'AP-APUSH-3.3',
    },
  ],
  prerequisites: ['apush.causes-of-revolution'],
  followUps: ['apush.articles-of-confederation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the Declaration of Independence as a PHILOSOPHICAL ARGUMENT with a structure, not just a list of complaints.',
      script:
        "Most people who've heard of the Declaration of Independence remember it as America's angry breakup letter with King George III — and about three-quarters of it IS a list of grievances. But that's not what made it revolutionary. Plenty of rebellions in history have listed grievances against a king. What's radical about the Declaration is the FIRST part — before the complaints even start — where Thomas Jefferson lays out a whole theory of why any government has authority at all, and when the people are allowed to overthrow one. That theory didn't come from nowhere. It came from decades of Enlightenment philosophy that colonial leaders had been reading, arguing about, and slowly turning into a political program. Today we're asking: what IDEAS turned colonial resistance into a Revolution with a philosophy behind it?",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-enlightenment-republicanism',
      kind: 'concept',
      goal: 'Explain how Lockean natural rights / social-contract theory and republicanism combined to justify independence and shape ideas about the new government.',
      keyIdeas: [
        "JOHN LOCKE'S NATURAL RIGHTS: the English philosopher John Locke (writing in the 1680s, after England's own Glorious Revolution) argued that all people possess natural rights — life, liberty, and property — that exist BEFORE government and are not government's to give or withhold. This was not a new idea invented in 1776; colonial leaders were adapting a decades-old European philosophy to their own conflict with Parliament and the Crown.",
        "THE SOCIAL CONTRACT: Locke argued government is a CONTRACT — people consent to be governed in exchange for protection of their natural rights. If a government instead violates those rights (taxing without consent, dissolving assemblies, quartering troops), the contract is broken and the people have the right — not just the option — to alter or abolish it and start over.",
        'REPUBLICANISM: a distinct but related idea about HOW a legitimate government should be structured — power derived from the people (popular sovereignty) and exercised through elected representatives, not inherited through a monarch. Republicanism also carried a moral dimension: it held that a republic survives only if its citizens practice civic VIRTUE (putting the public good above private/factional interest), because without a king to hold things together, corruption and factionalism could tear a republic apart from within.',
        'REPUBLICANISM IS NOT DIRECT DEMOCRACY: colonial republicans did not mean "every citizen votes directly on every law." They meant representative government, accountable to the people, checked against concentrating too much power in any one person or faction — a middle path between monarchy and mob rule.',
        "THE DECLARATION AS APPLIED PHILOSOPHY: the Declaration of Independence's famous opening — \"We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights\" — is Locke's natural-rights theory converted directly into a political document. The line that follows it — governments are instituted \"deriving their just powers from the consent of the governed\" — is the social contract, stated as a founding premise before a single grievance against George III is even listed.",
        "PAMPHLETS SPREAD THE IDEAS BEYOND ELITES: works like Thomas Paine's Common Sense (1776) translated this same Enlightenment philosophy into plain, widely accessible language, reaching ordinary colonists who had never read Locke directly — which is part of why these ideas became a genuinely popular cause, not just an elite intellectual position.",
        'WHY THIS MATTERS BEYOND 1776: because independence was justified using UNIVERSAL claims about natural rights and consent — not just colonial grievances specific to America — these same ideas became the yardstick used to judge every government that followed, including the one the revolutionaries themselves would soon have to design.',
      ],
      vocabulary: [
        {
          term: 'natural rights',
          definition:
            "rights (life, liberty, property) that Locke argued belong to all people inherently, prior to and independent of government — government's job is to protect them, not grant them.",
        },
        {
          term: 'social contract',
          definition:
            "Locke's theory that government's authority rests on an agreement between rulers and the ruled to protect natural rights — broken if government instead violates those rights.",
        },
        {
          term: 'republicanism',
          definition:
            'the belief that legitimate government derives its power from the people and is exercised through elected representatives (not inherited monarchy), sustained by civic virtue rather than a king.',
        },
        {
          term: 'popular sovereignty',
          definition:
            "the principle that political authority ultimately belongs to the people, who may delegate it to a government but never permanently surrender it.",
        },
        {
          term: 'unalienable rights',
          definition:
            "rights that cannot be given away or taken away — the Declaration's term for the Lockean natural rights it lists (life, liberty, and the pursuit of happiness).",
        },
      ],
      passageId: 'evelyn.passage.apush-declaration.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-declaration-preamble',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from the preamble of the Declaration of Independence (1776): "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.—That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed." What philosophy is this paragraph built on, and what work is it doing before the Declaration even mentions a single specific grievance against the king?',
      steps: [
        'SOURCE IT FIRST. Drafted primarily by Thomas Jefferson, adopted by the Second Continental Congress on July 4, 1776 — months after fighting had already begun. This excerpt is the OPENING of the document, before any of the ~27 grievances against George III that follow.',
        "IDENTIFY THE PHILOSOPHICAL CLAIM. \"All men are created equal\" and possess \"unalienable Rights\" — Life, Liberty, and the pursuit of Happiness — is Locke's natural-rights theory almost point for point (Locke's own formulation was \"life, liberty, and property\"; Jefferson's substitution of \"pursuit of Happiness\" broadens the claim without changing its logic).",
        'IDENTIFY THE SOCIAL-CONTRACT CLAIM. The second sentence — governments are "instituted" to "secure these rights," "deriving their just powers from the consent of the governed" — states the social contract directly: government exists FOR a purpose (protecting rights) and gets its authority FROM the people, not from a king\'s bloodline or divine right.',
        "EXPLAIN WHY THIS COMES FIRST, BEFORE THE GRIEVANCES. By establishing the THEORY before listing complaints, Jefferson is doing something structurally important: he's not asking the reader to sympathize with colonial anger — he's asking the reader to accept a general PRINCIPLE (legitimate government requires consent and rights-protection) that the grievance list will then show George III violating. This makes the case a matter of universal justice, not a one-off colonial squabble.",
        'CONNECT TO REPUBLICANISM. The claim that just power derives "from the consent of the governed" is also a republican claim about WHO gets to authorize government — not a king by inheritance, but the people themselves. This is the philosophical seed of the representative government the Constitutional Convention would later have to design from scratch.',
        'STATE THE LINK TO THE COURSE THESIS. This passage shows Enlightenment natural-rights and social-contract theory doing real political WORK — converting a specific colonial rebellion into a universal argument, and setting the philosophical terms (consent, rights-protection) that any legitimate government the revolutionaries built afterward would have to satisfy.',
      ],
      answer:
        'The excerpt states Locke\'s natural-rights and social-contract theory as a founding premise: people possess unalienable rights (life, liberty, pursuit of happiness) that exist independent of government, and government\'s only legitimate purpose is to secure those rights with the consent of the governed. By placing this philosophical claim BEFORE any specific grievance against George III, the Declaration converts a colonial rebellion into a case built on universal principles of legitimate government — and implicitly commits the revolutionaries themselves to designing a future government that actually satisfies those same standards of consent and rights-protection.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE Enlightenment idea that shaped Revolutionary-era political thought. (b) Briefly explain ONE piece of specific historical evidence (a document, phrase, or event) that shows this idea being applied. (c) Briefly explain ONE way republicanism, as colonial leaders understood it, differed from direct democracy.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): correctly and specifically describes a genuine Enlightenment idea behind Revolutionary thought — e.g. Lockean natural rights (life, liberty, property), the social contract (government's authority depends on consent and protecting rights), or republicanism/popular sovereignty. No credit for a vague statement (\"the colonists believed in freedom\") with no identifiable specific idea.",
            modelResponse:
              "One Enlightenment idea was John Locke's theory of natural rights — that all people possess inherent rights to life, liberty, and property that exist independently of government, and that government exists only to protect them.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific piece of evidence (document, phrase, event) that demonstrates the idea named in (a) being applied, and connects it clearly to that idea rather than just naming it. No credit for evidence unconnected to the stated idea.',
            modelResponse:
              'The Declaration of Independence states that people are "endowed by their Creator with certain unalienable Rights" including "Life, Liberty and the pursuit of Happiness" and that governments derive "their just powers from the consent of the governed" — directly restating Locke\'s natural-rights and social-contract theory as the document\'s founding premise.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate distinction between colonial republicanism (representative government accountable to the people, sustained by civic virtue, checked against factionalism) and direct democracy (citizens voting directly on every law). No credit for a vague or inaccurate contrast.',
            modelResponse:
              "Colonial republicans did not want citizens voting directly on every law the way a pure democracy would; they wanted government exercised through elected representatives accountable to the people, restrained by a sense of civic virtue and public-mindedness, as a middle path between monarchy (no popular voice at all) and unchecked direct rule by momentary popular passions.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-locke-invented',
      kind: 'misconception_check',
      question:
        "True or false: John Locke's ideas about natural rights and government by consent were first put into practice by the American revolutionaries in 1776 — the colonists invented this philosophy to justify independence.",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating a philosophy the revolutionaries ADAPTED as one they INVENTED — collapsing the difference between where an idea originates and where it gets applied to a new political situation.',
          correctsTo:
            "FALSE. John Locke published his natural-rights and social-contract theory nearly a century earlier, in Two Treatises of Government (1689), justifying England's own Glorious Revolution against James II. Colonial leaders and pamphleteers did not invent this philosophy in 1776 — they had been reading, discussing, and citing Locke for decades before the imperial crisis, and increasingly ADAPTED his arguments to their specific conflict with Parliament and the Crown over the 1760s and 1770s. Understanding this matters for the AP exam: the Declaration's originality is in how it APPLIES existing Enlightenment philosophy to a specific political argument for independence, not in inventing new political theory from scratch.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Locke's natural rights (life, liberty, property) and social-contract theory predate the Revolution by nearly a century — colonists adapted, not invented, this philosophy.",
        'The social contract holds government\'s authority depends on protecting rights with the consent of the governed; violating that contract justifies altering or abolishing the government.',
        'Republicanism means representative government accountable to the people, sustained by civic virtue — NOT direct democracy where citizens vote on every law.',
        "The Declaration's preamble states this philosophy as a universal PRINCIPLE before listing a single specific grievance, turning a colonial rebellion into an argument about legitimate government generally.",
        "Pamphlets like Common Sense spread this philosophy to ordinary colonists, turning an elite intellectual position into a popular cause.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.3',
    cedTitle: 'The Ideas of the American Revolution',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-declaration.v1',
        chapter: '1776',
        note: 'Declaration of Independence preamble — anchor document for Lockean natural-rights and social-contract theory.',
      },
    ],
  },
};
