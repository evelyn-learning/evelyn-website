/**
 * AP US Government & Politics — CED Unit 1.1-1.3: Ideals of Democracy &
 * Types of Democracy.
 *
 * CALIBRATION PLAN — the Unit-1 Vertical Slice's gold template. Establishes
 * the AP Gov content-course segment semantics, mirroring the APUSH/APWorld
 * calibration plans (`ap-apush-u3-causes-of-revolution.ts`,
 * `ap-apworld-u2-silk-roads.ts`): concept = the foundational political
 * theory (what ideals of democracy does the founding-era rhetoric assert,
 * and what competing MODELS of representative democracy does the
 * Constitution's actual design reflect?); worked_example = annotated
 * document analysis (what does the Declaration's own text establish, and
 * what does it NOT establish?); try_yourself = a 3-point AP Gov Concept
 * Application-style short response (identify/explain a scenario against
 * course concepts, not a full essay — the Argument Essay / SCOTUS
 * Comparison / Quantitative Analysis FRQ-practice plans with their own
 * authentic AP Gov rubric shapes live separately, see
 * docs/superpowers/specs/2026-07-11-ap-us-government-design.md).
 *
 * See that design doc §Architecture for the reused Passage/rubric infra
 * (identical to APUSH/APWorld/Eng Lang — 'document' genre, passage-aware
 * grader, lint-passages) and the AP Plans Initiative memory for the shared
 * AP conventions this plan follows (pacingThresholds, source attribution,
 * id/file/LO scheme).
 *
 * Anchor text: the Declaration of Independence (1776) preamble —
 * evelyn.passage.apush-declaration.v1 (reused from APUSH; seeded excerpt is
 * ONLY the two opening paragraphs — through "...deriving their just powers
 * from the consent of the governed." It does NOT include the Declaration's
 * "alter or abolish" clause or the grievance list that follow in the full
 * document; nothing below attributes that language to the excerpt). Where
 * the APUSH plan on this same document teaches Lockean natural-rights
 * philosophy and republicanism as the INTELLECTUAL ORIGINS of the
 * Revolution, this plan reads the identical excerpt through the AP Gov
 * lens: which of the CED's four democratic ideals (natural rights, popular
 * sovereignty, social contract, limited government) does the text actually
 * assert, and — moving beyond the excerpt to the Constitution's structural
 * choices — which of the three models of representative democracy
 * (participatory, pluralist, elite) does each constitutional design
 * decision reflect?
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U1_DEMOCRATIC_IDEALS: LessonPlan = {
  id: 'evelyn.ap.apgov.democratic-ideals.v1',
  title: 'U1.1 Ideals of Democracy & Types of Democracy',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.democratic-ideals',
      description:
        'Explain the ideals of natural rights, popular sovereignty, social contract, and limited government as expressed in the Declaration of Independence, and distinguish the participatory, pluralist, and elite models of representative democracy, with constitutional examples of each.',
      standard: 'AP-APGOV-1.1',
    },
  ],
  prerequisites: [],
  followUps: ['apgov.constitution-ratification'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to question the reflexive claim "the US is a democracy" and see that the real question is WHICH KIND — and by whose theory of legitimate government.',
      script:
        "Quick question: is the United States a democracy? Most people say yes without hesitating. But if a \"democracy\" means citizens vote directly on the laws that govern them, the honest answer is mostly no — you don't vote on tax rates, war powers, or federal spending bills. You vote for people who vote on those things. So why do we call it a democracy at all, and why did the Framers design it that way on purpose? The answer starts with two separate questions the Founding generation had to answer. First: what gives ANY government the right to rule people at all — what are its ideals? Second, once you've answered that: how much direct say should ordinary people actually get in running it? Those two questions produced, respectively, the ideals stated in the Declaration of Independence and the competing MODELS of democracy baked into the Constitution's actual design. Today we pull both apart.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ideals-and-models',
      kind: 'concept',
      goal: "Explain the four democratic ideals (natural rights, popular sovereignty, social contract, limited government) as they appear in the Declaration's preamble, and distinguish the participatory, pluralist, and elite models of representative democracy with accurate constitutional examples of each.",
      keyIdeas: [
        "THE DECLARATION IS A STATEMENT OF IDEALS, NOT A LEGAL DOCUMENT. It has never been enforceable law and created no institutions of government — the Constitution is what actually does that (more on this distinction in the misconception check below). What the Declaration DOES give us is the clearest founding-era statement of the ideals a legitimate government is supposed to answer to.",
        'NATURAL RIGHTS: the seeded excerpt states people "are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness" — rights that belong to people inherently, prior to and independent of any government, which government does not grant and may not justly take away.',
        'POPULAR SOVEREIGNTY: the excerpt states that governments derive "their just powers from the consent of the governed" — political authority ultimately belongs to the people; a government rules legitimately only with their consent, not by inherited right or divine claim.',
        'SOCIAL CONTRACT: the excerpt states government exists specifically "to secure these rights" — government is framed as an instrument created FOR a purpose (protecting natural rights), which implies a kind of agreement: authority is granted in exchange for that protection. (The excerpt stops there — it does not include the Declaration\'s later "alter or abolish" language about what happens if that agreement is broken; that reasoning follows immediately afterward in the full document, but outside what is quoted here.)',
        'LIMITED GOVERNMENT: follows from the same logic — if government is instituted "to secure these rights," its authority is bounded BY that purpose, not open-ended. A government that overreaches beyond protecting rights is acting outside the very justification the excerpt gives for having a government at all. (The Constitution operationalizes this later with enumerated powers, separation of powers, and the Bill of Rights — beyond what this excerpt itself establishes.)',
        "THESE FOUR IDEALS ANSWER \"WHY GOVERNMENT AT ALL\" — THEY DO NOT ANSWER \"HOW MUCH DIRECT SAY SHOULD THE PEOPLE GET.\" That second question is what the three models of representative democracy answer, and the Framers built the Constitution as a deliberate mix of all three rather than committing to just one.",
        'PARTICIPATORY DEMOCRACY: the model holding that broad, direct citizen involvement in political decisions is both possible and desirable. The federal Constitution itself contains little of this (the House is the closest — direct popular election of representatives), but participatory mechanisms are common at the STATE and local level: New England town meetings, and in many states, ballot initiatives, referenda, and recall elections that let citizens vote directly on laws or officials, bypassing the legislature.',
        'PLURALIST DEMOCRACY: the model holding that political power is legitimately exercised through organized groups competing and bargaining for influence — citizens are represented less as individuals and more through the interest groups (business associations, labor unions, advocacy organizations) they join. The First Amendment\'s protections for petitioning government and freedom of assembly/association are the constitutional hook that makes this kind of organized group competition possible.',
        'ELITE DEMOCRACY: the model holding that political decisions are best made by a smaller group of well-informed, capable people acting on behalf of the broader public, insulated from the unpredictability of direct mass opinion. This reflects real Framer anxiety about "faction" and momentary popular passion. TWO KEY CONSTITUTIONAL EXAMPLES: (1) the ELECTORAL COLLEGE — the President was designed to be chosen by appointed electors, not by a direct national popular vote; (2) the ORIGINAL DESIGN OF THE SENATE — senators were chosen by STATE LEGISLATURES, not directly elected by voters, until the Seventeenth Amendment (1913) changed that. Appointed (not elected), life-tenured federal judges are a third standing example, deliberately insulated from popular election altogether.',
        "THE CONSTITUTION BLENDS ALL THREE MODELS RATHER THAN PICKING ONE: direct popular election of the House (participatory-leaning); an Electoral College and an originally state-legislature-chosen Senate (elite-leaning); and First Amendment protections that enable organized interest-group competition (pluralist-leaning). Recognizing which model a given constitutional feature reflects — and that the Framers combined them on purpose — is the core AP Gov skill this unit builds toward.",
      ],
      vocabulary: [
        {
          term: 'natural rights',
          definition:
            'rights (life, liberty, and — per the Declaration — the pursuit of happiness) that belong to all people inherently, prior to and independent of government; government\'s role is to protect them, not grant them.',
        },
        {
          term: 'popular sovereignty',
          definition:
            'the principle that political authority ultimately belongs to the people, who may delegate it to a government but whose consent is the source of that government\'s legitimacy.',
        },
        {
          term: 'social contract',
          definition:
            'the theory that government\'s legitimate authority rests on an implicit agreement to protect the people\'s natural rights in exchange for their consent to be governed.',
        },
        {
          term: 'limited government',
          definition:
            "the principle that government's power is bounded — by the purpose for which it was created and by law — rather than open-ended or absolute.",
        },
        {
          term: 'participatory democracy',
          definition:
            'a model of democracy emphasizing broad, direct citizen involvement in political decisions — e.g. town meetings, ballot initiatives, referenda, and recall elections at the state/local level.',
        },
        {
          term: 'pluralist democracy',
          definition:
            'a model of democracy in which political power is exercised through organized groups (interest groups, unions, associations) competing and bargaining for influence over policy.',
        },
        {
          term: 'elite democracy',
          definition:
            'a model of democracy in which political decisions are made by a smaller group of capable, informed individuals acting on the public\'s behalf, insulated from direct mass opinion — e.g. the Electoral College or the originally state-legislature-chosen Senate.',
        },
      ],
      passageId: 'evelyn.passage.apush-declaration.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-declaration-ideals',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt — the full seeded text — from the preamble of the Declaration of Independence (1776): "When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature’s God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation. We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.—That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed." Identify which of the four democratic ideals this excerpt actually establishes, and what it does NOT establish.',
      steps: [
        'SOURCE IT FIRST. This is the OPENING of the Declaration, adopted by the Second Continental Congress on July 4, 1776 — before any of the ~27 specific grievances against George III that follow later in the full document. The seeded excerpt stops at "...consent of the governed"; nothing after that point is available to analyze here.',
        'FIND NATURAL RIGHTS. "[T]hey are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness" states natural rights directly: rights that exist because people are people, not because a government issued them, and that no government may justly revoke.',
        'FIND POPULAR SOVEREIGNTY. "[D]eriving their just powers from the consent of the governed" states popular sovereignty directly: a government\'s power is only JUST — only legitimate — if it comes from the people\'s consent, not from inherited or unilateral claim.',
        'FIND THE SOCIAL CONTRACT — CAREFULLY. "[T]o secure these rights, Governments are instituted among Men" frames government as an instrument created FOR a purpose (protecting rights), which is the social-contract logic. But note what is genuinely absent: the excerpt does NOT include the sentence that follows in the full Declaration about the people\'s right to "alter or abolish" a government that violates the contract. A careful reader credits this excerpt with stating why government is instituted, not with stating what happens if it breaks its end of the bargain — that reasoning appears later in the document, outside this excerpt.',
        'FIND LIMITED GOVERNMENT — BY INFERENCE, NOT DIRECT STATEMENT. The excerpt never uses a phrase like "limited government." But the logic that government is instituted "to secure these rights" implies boundaries: if protecting rights is the JOB, exceeding that job is acting outside the stated justification for having government at all. This is an inference the excerpt supports, not a phrase it contains.',
        "STATE THE LINK TO THE COURSE THESIS. In roughly 100 words, this excerpt states three of the four ideals directly (natural rights, popular sovereignty, and the purpose-driven logic of the social contract) and implies the fourth (limited government) — but it is a statement of IDEALS, not a legal mechanism. It doesn't create a Congress, an Electoral College, or a Senate, and it says nothing yet about HOW MUCH direct say ordinary people should get in government — that's the separate question the participatory/pluralist/elite models, and the Constitution's actual structure, answer.",
      ],
      answer:
        'The excerpt directly states natural rights ("unalienable Rights...Life, Liberty and the pursuit of Happiness") and popular sovereignty ("deriving their just powers from the consent of the governed"), and states the social contract\'s purpose-driven logic ("to secure these rights, Governments are instituted among Men") without including the Declaration\'s later "alter or abolish" language, which falls outside this seeded excerpt. Limited government is implied, not stated outright: if government exists specifically to secure rights, its legitimate authority is bounded by that purpose. What the excerpt does NOT do is settle how much direct political power ordinary citizens should hold — that is a separate question, answered not by the Declaration but by the Constitution\'s actual structural choices, which blend participatory, pluralist, and elite features rather than committing to one model.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. A state legislature is considering two competing proposals to change how major state laws get made. Proposal 1 would let citizens use a ballot initiative to place a proposed law directly before voters for an up-or-down vote, entirely bypassing the state legislature. Proposal 2 would keep all lawmaking with the elected state legislature, but require legislators to hold public hearings and formally consult certified interest-group representatives (business associations, labor unions, environmental groups) before voting on any major bill. (a) Describe the model of democracy — participatory, pluralist, or elite — that BEST characterizes Proposal 1. (b) In the context of the scenario, explain how Proposal 2 reflects the pluralist model of democracy. (c) Explain how the Framers\' original design of the U.S. Senate (before the Seventeenth Amendment) reflects a different model of democracy than the one described in part (a).',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies Proposal 1 as PARTICIPATORY democracy and describes why — citizens vote directly on the law themselves via the ballot initiative, with no elected representative acting as intermediary. No credit for identifying pluralist or elite, or for an identification with no supporting description.',
            modelResponse:
              'Proposal 1 reflects participatory democracy: it lets citizens vote directly on a proposed law themselves through a ballot initiative, cutting the elected legislature out of the decision entirely rather than having representatives decide on the public\'s behalf.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains that Proposal 2 is pluralist because policy influence flows through organized interest groups (business, labor, environmental) competing/bargaining to shape legislation, rather than through direct citizen votes or an insulated elite. Must connect the explanation to the specific scenario detail (formal consultation with certified interest-group representatives), not just define pluralism generically.",
            modelResponse:
              'Proposal 2 reflects pluralist democracy because it channels political influence through organized interest groups — business associations, labor unions, and environmental groups — that legislators are required to consult before voting, meaning policy outcomes emerge from competition and bargaining among these organized groups rather than from a direct popular vote or an insulated decision-making body.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that the original Senate — senators chosen by STATE LEGISLATURES rather than by direct popular vote, prior to the Seventeenth Amendment (1913) — reflects ELITE democracy, and states why that differs from the participatory model in part (a) (insulating the decision from direct mass/voter input rather than putting it directly before voters). No credit for a response that misidentifies the pre-17th-Amendment Senate\'s method of selection or fails to contrast it with participatory democracy.',
            modelResponse:
              "Before the Seventeenth Amendment (1913), U.S. senators were chosen by state legislatures rather than elected directly by voters, which reflects elite democracy: the decision was placed in the hands of a smaller body of officials rather than submitted directly to the people, the opposite of Proposal 1's participatory design, where citizens themselves cast the deciding vote.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-declaration-is-law',
      kind: 'misconception_check',
      question:
        'True or false: the Declaration of Independence is a legally binding document — it functions as U.S. law today, the same way the Constitution does.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Conflating a document that JUSTIFIES a claim to legitimate government with a document that actually CREATES and legally binds that government — treating the Declaration's statement of ideals as if it carries the same legal force as the Constitution.",
          correctsTo:
            'FALSE. The Declaration of Independence (1776) is a political and philosophical document: it states the case for why breaking from Britain was justified, grounded in natural rights, popular sovereignty, the social contract, and limited government. It has never been enforceable law — no court applies it, and it created no institution of government (no Congress, no presidency, no courts). The CONSTITUTION (drafted 1787, ratified 1788) is the actual supreme law of the land, per Article VI\'s Supremacy Clause — it creates and empowers the three branches, and its provisions are legally binding and enforceable in court. On the AP Gov exam, keep the two straight: the Declaration explains WHY a legitimate government must answer to the people\'s natural rights and consent; the Constitution is HOW the American government is actually structured, empowered, and legally bound to operate.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Declaration of Independence states ideals — natural rights, popular sovereignty, and (by implication) the social contract and limited government — but it is not itself law; the Constitution is the enforceable supreme law of the land.',
        "The seeded excerpt directly states natural rights (\"unalienable Rights...Life, Liberty and the pursuit of Happiness\") and popular sovereignty (\"consent of the governed\"); it does NOT include the Declaration's later \"alter or abolish\" language — don't attribute that to this excerpt.",
        'The four democratic ideals answer WHY government is legitimate at all; the three models of representative democracy answer a separate question — HOW MUCH direct say ordinary people should get.',
        'Participatory democracy = broad direct citizen involvement (state/local ballot initiatives, referenda, town meetings). Pluralist democracy = organized interest groups competing for influence (protected by the First Amendment). Elite democracy = decisions insulated in a smaller body (the Electoral College; the Senate, originally chosen by state legislatures until the Seventeenth Amendment).',
        'The Constitution blends all three models on purpose rather than committing to one — recognizing which model a given constitutional feature reflects is the core skill this unit builds toward.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.1',
    cedTitle: 'Ideals of Democracy & Types of Democracy',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-declaration.v1',
        chapter: '1776',
        note: 'Declaration of Independence preamble — anchor document for the four democratic ideals (natural rights, popular sovereignty, social contract, limited government).',
      },
    ],
  },
};
