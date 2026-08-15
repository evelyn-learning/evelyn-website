/**
 * AP US Government & Politics — CED Unit 1.1-1.3: Ideals of Democracy &
 * Types of Democracy.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.democratic-ideals.v1`. Covers the four democratic ideals
 * (natural rights, popular sovereignty, social contract, limited
 * government) as expressed in the seeded Declaration of Independence
 * preamble excerpt, and the three models of representative democracy
 * (participatory, pluralist, elite) the Constitution's actual structure
 * reflects — two separate questions the plan is careful to keep apart.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_DEMOCRATIC_IDEALS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.democratic-ideals.v1',
  course: 'AP US Government & Politics',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Ideals of Democracy & Types of Democracy',
  planId: 'evelyn.ap.apgov.democratic-ideals.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.democratic-ideals.v1' }],
  theory: [
    {
      loId: 'apgov.democratic-ideals',
      kind: 'framework',
      title: 'two separate questions: ideals vs. models',
      content:
        'The four democratic ideals (natural rights, popular sovereignty, social contract, limited government) answer WHY a government is legitimate at all. The three models of representative democracy (participatory, pluralist, elite) answer a completely separate question — HOW MUCH direct say ordinary people should get in running it. Keep these apart: a scenario about direct citizen involvement is a models question, not an ideals question.',
    },
    {
      loId: 'apgov.democratic-ideals',
      kind: 'definition',
      title: 'natural rights',
      content:
        'Rights (life, liberty, and — per the Declaration — the pursuit of happiness) that belong to all people inherently, prior to and independent of government. Government does not grant these rights and may not justly take them away; its role is only to protect them.',
    },
    {
      loId: 'apgov.democratic-ideals',
      kind: 'definition',
      title: 'popular sovereignty',
      content:
        'The principle that political authority ultimately belongs to the people. A government rules legitimately only when it derives its power from the consent of the governed — not from inherited right or a divine claim to rule.',
    },
    {
      loId: 'apgov.democratic-ideals',
      kind: 'definition',
      title: 'limited government',
      content:
        "The principle that government's power is bounded — by the purpose for which it was created — rather than open-ended or absolute. A government instituted to secure natural rights is, by that same logic, not justified in exceeding that purpose. The Constitution later operationalizes this with enumerated powers, separation of powers, and the Bill of Rights.",
      sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.democratic-ideals.v1', segmentId: 'concept-ideals-and-models' }],
    },
    {
      loId: 'apgov.democratic-ideals',
      kind: 'concept',
      title: 'social contract',
      content:
        'The theory that government exists specifically "to secure" natural rights — framing government as an instrument created FOR a purpose, which implies an agreement: authority is granted in exchange for protecting those rights. The seeded Declaration excerpt states this purpose-driven logic but stops before the Declaration\'s later "alter or abolish" language about what happens if government breaks that agreement — that reasoning is NOT part of what this excerpt establishes.',
    },
    {
      loId: 'apgov.democratic-ideals',
      kind: 'concept',
      title: 'participatory democracy',
      content:
        'The model holding that broad, direct citizen involvement in political decisions is both possible and desirable. The federal Constitution contains little of this directly (the House — direct popular election of representatives — is the closest), but participatory mechanisms are common at the state/local level: town meetings, ballot initiatives, referenda, and recall elections that let citizens vote directly on laws or officials, bypassing the legislature.',
    },
    {
      loId: 'apgov.democratic-ideals',
      kind: 'concept',
      title: 'pluralist democracy',
      content:
        'The model holding that political power is legitimately exercised through organized groups (business associations, labor unions, advocacy organizations) competing and bargaining for influence, rather than through individual citizens acting alone. The First Amendment\'s protections for petitioning government and freedom of assembly/association are the constitutional hook that makes this kind of organized group competition possible.',
    },
    {
      loId: 'apgov.democratic-ideals',
      kind: 'concept',
      title: 'elite democracy',
      content:
        'The model holding that political decisions are best made by a smaller group of well-informed, capable people acting on the public\'s behalf, insulated from direct mass opinion — reflecting real Framer anxiety about "faction." Two key constitutional examples: the Electoral College (the President chosen by appointed electors, not a direct national popular vote) and the ORIGINAL design of the Senate (senators chosen by state legislatures, not directly elected, until the Seventeenth Amendment in 1913). Life-tenured, appointed federal judges are a third standing example.',
    },
    {
      loId: 'apgov.democratic-ideals',
      kind: 'framework',
      title: 'the Constitution blends all three models on purpose',
      content:
        'Direct popular election of the House leans participatory; the Electoral College and the originally state-legislature-chosen Senate lean elite; First Amendment protections that enable organized interest-group competition lean pluralist. The Framers combined all three deliberately rather than committing to one — recognizing which model a given constitutional feature reflects is the core AP Gov skill this unit builds toward.',
    },
    {
      loId: 'apgov.democratic-ideals',
      kind: 'event',
      title: 'what the seeded Declaration excerpt does and does not establish',
      content:
        'The excerpt (the Declaration\'s opening through "...consent of the governed") directly states natural rights and popular sovereignty, and states the social contract\'s purpose-driven logic without the later "alter or abolish" language. Limited government is implied, not stated outright. The excerpt does NOT settle how much direct political power ordinary citizens should hold — that is answered separately, by the Constitution\'s actual structural choices, not by the Declaration.',
    },
    {
      loId: 'apgov.democratic-ideals',
      kind: 'trap',
      title: 'the Declaration is not law',
      content:
        'The Declaration of Independence has never been enforceable law and created no institution of government — no Congress, no presidency, no courts. It is a statement of ideals justifying a claim to legitimate government. The Constitution (drafted 1787, ratified 1788) is the actual supreme law of the land per Article VI\'s Supremacy Clause, and it is what creates and empowers the three branches.',
    },
  ],
  methods: [
    {
      title: 'Concept Application: identify which model of democracy a scenario reflects',
      when_to_use:
        'Use this whenever a scenario describes a specific decision-making process (a vote, an appointment, a consultation requirement) and asks which model of democracy — participatory, pluralist, or elite — it best reflects.',
      steps: [
        'ASK WHO ACTUALLY MAKES THE DECISION. Do citizens vote on the outcome directly (participatory)? Do organized groups compete/bargain to shape it (pluralist)? Does a smaller, insulated body decide on the public\'s behalf (elite)?',
        'MATCH TO A CONSTITUTIONAL EXAMPLE FOR THE ANSWER. Participatory: ballot initiatives, referenda, direct House elections. Pluralist: First-Amendment-protected interest-group lobbying/petitioning. Elite: the Electoral College, the pre-Seventeenth-Amendment Senate, appointed judges.',
        'EXPLAIN WHY, DON\'T JUST LABEL. Full credit requires tying the identification to the specific mechanism in the scenario (e.g. "citizens vote directly, cutting out the legislature" for participatory), not a generic definition.',
        'IF ASKED TO CONTRAST TWO PROPOSALS, name what is DIFFERENT about who decides — that contrast is usually the actual point being tested.',
      ],
      example: {
        problem:
          'A state adds a rule requiring legislators to formally consult certified interest-group representatives (business, labor, environmental) before voting on any major bill. Which model of democracy does this best reflect, and why?',
        solution:
          'Pluralist democracy: political influence flows through organized interest groups (business, labor, environmental) that legislators must consult, meaning policy outcomes emerge from competition and bargaining among those organized groups rather than from a direct citizen vote (participatory) or a decision made by an insulated few with no group input (elite).',
      },
      relatedLoIds: ['apgov.democratic-ideals'],
    },
  ],
  pointers: [
    { content: 'The Declaration states ideals; it is not law and creates no government institution. Never call it "legally binding" — that describes the Constitution.', kind: 'trap' },
    { content: 'The seeded excerpt stops at "consent of the governed" — it does NOT include the Declaration\'s later "alter or abolish" language. Don\'t attribute that phrase to this excerpt.', kind: 'trap' },
    { content: 'Ideals answer "why government at all"; models answer "how much direct say." A question about ballot initiatives or the Electoral College is a MODELS question, not an ideals question.', kind: 'tip' },
    { content: 'Elite democracy examples: the Electoral College AND the original (pre-17th-Amendment) Senate. Don\'t use only one — knowing both is what separates full credit from partial credit on an FRQ.', kind: 'tip' },
    { content: 'Participatory = citizens vote directly (ballot initiative, referendum). Pluralist = organized GROUPS compete for influence. Don\'t conflate "citizens have input" generically with one specific model.', kind: 'tip' },
  ],
};
