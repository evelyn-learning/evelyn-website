/**
 * AP US Government & Politics — CED Unit 1.4-1.5: Challenges of the
 * Articles of Confederation & Ratification of the Constitution.
 *
 * Unit-1 Vertical Slice content plan (follows the democratic-ideals
 * calibration template — see ap-apgov-u1-democratic-ideals.ts for the full
 * rationale and docs/superpowers/specs/2026-07-11-ap-us-government-design.md
 * for the shared Passage/rubric infra this plan reuses).
 *
 * Covers the Articles of Confederation's structural weaknesses (no direct
 * taxing power, no executive, unanimous-consent amendment) and Shays's
 * Rebellion as catalyst; the Constitutional Convention's core compromises
 * (Great/Connecticut Compromise, Three-Fifths Compromise, Electoral College
 * Compromise); and the Federalist/Anti-Federalist ratification debate.
 *
 * DOCUMENT ANCHOR — deliberately the MIRROR of the APUSH ratification plan
 * (ap-apush-u3-constitution-ratification.ts), which anchors its concept on
 * Federalist No. 10. This AP Gov plan anchors on Brutus No. 1 instead
 * (evelyn.passage.apush-brutus-1.v1 — reused from APUSH, seeded excerpt is
 * ONLY the size-of-a-free-republic argument, through "...to those of the
 * most tyrannical that ever existed in the world"; nothing below attributes
 * more to it than that). The worked example then pairs Brutus No. 1 against
 * Federalist No. 10 (evelyn.passage.apush-federalist-10.v1 — seeded excerpt
 * is ONLY Madison's definition of a faction; it does NOT contain Madison's
 * separate "a large republic controls the mischiefs of faction" argument,
 * which appears in a later, unseeded paragraph of the same essay — the
 * worked example is explicit that this larger argument is invoked from
 * general knowledge, not quoted from the excerpt).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U1_CONSTITUTION_RATIFICATION: LessonPlan = {
  id: 'evelyn.ap.apgov.constitution-ratification.v1',
  title: 'U1.4-1.5 The Articles of Confederation, the Convention & Ratification',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.constitution-ratification',
      description:
        "Explain the structural weaknesses of the Articles of Confederation and the significance of Shays's Rebellion, the Constitutional Convention's core compromises (Great Compromise, Three-Fifths Compromise, Electoral College Compromise), and the Federalist/Anti-Federalist debate over ratification.",
      standard: 'AP-APGOV-1.4/1.5',
    },
  ],
  prerequisites: ['apgov.democratic-ideals'],
  followUps: ['apgov.separation-of-powers'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the Articles’ collapse and the ratification fight as two acts of the same drama: a government failed, and its replacement had to be SOLD to a skeptical public, not just written.',
      script:
        "Last lesson we asked which ideals a legitimate government answers to, and which model of democracy the Constitution's structure reflects. Today's question is more practical: how did the United States end up with THIS Constitution at all? The first American government — the Articles of Confederation — actually failed. It couldn't tax, couldn't field an army, and nearly collapsed when armed farmers in Massachusetts shut down courts in 1786 and the national government had no way to respond. So delegates gathered in Philadelphia in 1787, supposedly just to patch up the Articles, and instead wrote an entirely new government from scratch. But writing it was only half the battle — nine of thirteen states still had to agree to RATIFY it, against serious, organized opposition that thought this new government looked less like a fix and more like a new king in disguise. Today we trace both the deals that made the Constitution possible and the fight over whether to adopt it at all.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-convention-and-ratification',
      kind: 'concept',
      goal: "Explain the Articles' structural weaknesses and Shays's Rebellion, the Convention's core compromises, and the Federalist/Anti-Federalist ratification debate.",
      keyIdeas: [
        'FROM FAILURE TO CONVENTION: the Articles of Confederation created a deliberately weak national government — it had no power to levy taxes directly (it could only REQUEST money from the states, a "requisition," which states often ignored), no separate executive branch, no national judiciary, and amending the Articles required the UNANIMOUS consent of all 13 states, making reform nearly impossible even when most states agreed change was needed.',
        "SHAYS'S REBELLION (1786-87): debt-burdened Massachusetts farmers, many of them Revolutionary War veterans facing land foreclosures and high state taxes, took up arms and shut down local courts. The Confederation Congress had NO national army to respond — Massachusetts had to raise its own private militia to put the uprising down. This exposed, in the most alarming way possible, that the national government could not guarantee order even within a single state, and became the specific crisis that convinced many leaders a stronger national government was necessary.",
        'THE CONSTITUTIONAL CONVENTION (Philadelphia, summer 1787): delegates convened, officially, to revise the Articles of Confederation. Instead, meeting behind closed doors, they scrapped the Articles entirely and drafted an altogether new frame of government built around federalism, separation of powers, and checks and balances.',
        'THE GREAT (CONNECTICUT) COMPROMISE: resolved the dispute between large states (who wanted congressional representation by population) and small states (who wanted equal representation regardless of size) by creating a BICAMERAL Congress — the House of Representatives apportioned by population, and the Senate with equal representation (two seats per state).',
        'THE THREE-FIFTHS COMPROMISE: resolved a dispute between Southern states (who wanted enslaved people counted toward population for greater representation, without extending them any rights) and Northern states (who objected to counting enslaved people for representation while excluding them from taxation) by counting three-fifths of a state’s enslaved population toward BOTH representation and direct taxation — a bargain that entrenched slavery’s political power in the new national government from its very founding.',
        "THE ELECTORAL COLLEGE COMPROMISE: resolved a dispute over how to choose the President. Some delegates wanted CONGRESS to select the President directly, which risked making the executive dependent on (and beholden to) the legislature; others wanted a direct NATIONAL POPULAR VOTE, which many delegates distrusted for a large, geographically dispersed electorate with no fast way to communicate across states. The compromise created the Electoral College: each state appoints electors equal to its combined House-plus-Senate delegation, and those electors formally choose the President — a method deliberately insulated from both a legislative vote and a direct popular vote.",
        'FEDERALISTS SUPPORTED RATIFICATION: led by figures like Alexander Hamilton, James Madison, and John Jay (who jointly wrote the Federalist Papers under the pen name "Publius"), Federalists argued the new government was necessary and safe — that a large, diverse republic could actually control the dangers of faction better than a small one could, and that its checks and balances would prevent any branch from becoming tyrannical.',
        'ANTI-FEDERALISTS OPPOSED RATIFICATION: led by figures like Patrick Henry and George Mason, and represented in essays like "Brutus No. 1," Anti-Federalists argued the new national government would be too powerful and too distant from the people. As the excerpt below states directly, Brutus pointed to history: no free republic had ever successfully governed a territory as large as the proposed United States. Anti-Federalists also objected — most damagingly — that the Constitution as drafted contained NO bill of rights protecting individual liberties from federal overreach.',
        'RESOLUTION: RATIFICATION PLUS A PROMISE. The Constitution secured the required nine of thirteen state ratifications by 1788, but several key states ratified only after Federalists promised to add a bill of rights once the new government was in place — delivered by Madison as the first ten amendments in 1791. Crucially, ratifying the Constitution did NOT mean surrendering all state power: it created a federal system in which the national and state governments would each hold real, distinct authority (exactly how that authority is divided is the subject of a later lesson in this unit).',
      ],
      vocabulary: [
        {
          term: 'Articles of Confederation',
          definition:
            'the first constitution of the United States (ratified 1781), creating a deliberately weak national government with no power to tax directly, no executive, and no judiciary.',
        },
        {
          term: "Shays's Rebellion",
          definition:
            "an armed uprising (1786-87) of debt-burdened Massachusetts farmers protesting land foreclosures and taxes; the Confederation's inability to respond became a key catalyst for the Constitutional Convention.",
        },
        {
          term: 'Great (Connecticut) Compromise',
          definition:
            'the Convention agreement creating a bicameral Congress — House of Representatives by population, Senate with equal representation per state — resolving the large-state/small-state dispute.',
        },
        {
          term: 'Three-Fifths Compromise',
          definition:
            "the Convention agreement counting three-fifths of a state's enslaved population toward both representation and direct taxation, entrenching slavery's political power in the new government.",
        },
        {
          term: 'Electoral College Compromise',
          definition:
            "the Convention agreement having state-appointed electors, rather than Congress or a direct national popular vote, formally choose the President.",
        },
        {
          term: 'Federalists',
          definition:
            'supporters of ratifying the Constitution (e.g. Hamilton, Madison, Jay), who argued a stronger national government with checks and balances was necessary and safe.',
        },
        {
          term: 'Anti-Federalists',
          definition:
            'opponents of ratifying the Constitution (e.g. Patrick Henry, George Mason, "Brutus"), who feared a national government this large and powerful could not remain a genuine free republic, and objected to the absence of a bill of rights.',
        },
      ],
      passageId: 'evelyn.passage.apush-brutus-1.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-brutus-federalist10',
      kind: 'worked_example',
      problem:
        'Compare these two excerpts from the ratification debate over how large a republic can safely govern itself. Brutus No. 1 (Anti-Federalist, 1787): "History furnishes no example of a free republic, any thing like the extent of the United States. The Grecian republics were of small extent; so also was that of the Romans. Both of these, it is true, in process of time, extended their conquests over large territories of country; and the consequence was, that their governments were changed from that of free governments to those of the most tyrannical that ever existed in the world." Federalist No. 10 (James Madison, 1787): "By a faction, I understand a number of citizens, whether amounting to a majority or a minority of the whole, who are united and actuated by some common impulse of passion, or of interest, adverse to the rights of other citizens, or to the permanent and aggregate interests of the community." What specific fear does Brutus raise about a republic the size of the proposed United States, and what does Madison’s essay argue instead — using only what these two excerpts actually say?',
      steps: [
        'SOURCE BOTH. Both essays were published in 1787 during the New York ratification debate — Brutus No. 1 (Anti-Federalist, attributed to Robert Yates) arguing against ratification, Federalist No. 10 (Madison, writing as "Publius") arguing for it. They are part of the same public argument.',
        'IDENTIFY BRUTUS’S CLAIM. Brutus argues from history: "no example of a free republic, any thing like the extent of the United States" — free governments (Greek, Roman) that expanded over large territories turned tyrannical. His fear: a republic as large as the proposed United States cannot stay a genuine, accountable self-government; distance and diversity will corrupt it.',
        'IDENTIFY WHAT THE FEDERALIST 10 EXCERPT ACTUALLY SAYS — AND WHAT IT DOES NOT. The quoted text is Madison’s DEFINITION of a faction: a group, majority or minority, united by an interest "adverse to the rights of other citizens, or to the permanent and aggregate interests of the community." That is all this excerpt establishes. It does NOT include Madison’s separate, more famous argument — found later in the same essay, but not quoted here — that a LARGE, diverse republic actually controls the danger of faction better than a small one. Credit only the definition to this excerpt, not the "cure."',
        'CONNECT MADISON’S (UNQUOTED) LARGER ARGUMENT TO BRUTUS’S FEAR. Though not present in this excerpt, Madison’s broader Federalist No. 10 argument is well known: the very scale Brutus fears is, for Madison, the SOLUTION — a bigger, more diverse republic contains so many competing factions that no single one can dominate the whole government. Brutus and Madison agree that size is decisive for a republic’s survival; they reach opposite conclusions about which direction it cuts.',
        'LINK TO THE CONVENTION’S ACTUAL DESIGN CHOICES. The compromises from the concept — a bicameral Congress balancing large and small states, an Electoral College insulating presidential selection from both Congress and a raw national vote — are partly a practical answer to disputes exactly like this one: how do you build one government that a diverse, continent-spanning population will accept as legitimately self-governing?',
        'STATE THE LINK TO THE COURSE THESIS. This is the same disagreement running through the whole ratification debate: is a large, more powerful national government the CURE for factional conflict and disorder (the Federalist bet), or its CAUSE (Brutus’s fear)? The Convention’s compromises did not resolve that philosophical disagreement — they resolved the political problem of securing nine states’ ratification despite it, with the promised Bill of Rights (1791) as the final concession to Anti-Federalist concerns.',
      ],
      answer:
        'Brutus argues from historical example ("no example of a free republic, any thing like the extent of the United States") that free governments which expanded over large territories became tyrannical, so a republic as large as the proposed United States cannot remain genuinely self-governing. The Federalist No. 10 excerpt itself only defines a faction as a group — majority or minority — pursuing an interest adverse to others’ rights or the common good; it does not contain Madison’s separate, unquoted argument that a large, diverse republic actually controls factions better than a small one, which answers Brutus’s fear directly even though it falls outside this excerpt. Both writers agree republic size is decisive; they draw opposite conclusions from it. The Convention’s compromises (the Great Compromise, the Electoral College) and the promised Bill of Rights resolved the political standoff between these views without settling the underlying philosophical disagreement.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. A newly independent country is drafting its founding constitution. Convention delegates are deadlocked over two disputes: (1) larger provinces want legislative seats apportioned by population, while smaller provinces demand equal representation regardless of size; (2) some delegates want the national legislature to choose the head of state directly, while others insist on a direct national popular vote, which several delegates distrust for such a large, dispersed electorate. A minority faction at the convention, unpersuaded by either resolution, later publishes an essay opposing ratification, arguing — much like Brutus No. 1 — that no free republic in history has ever successfully governed a territory this large. (a) Describe how the U.S. Constitutional Convention’s Great (Connecticut) Compromise resolved a dispute analogous to (1). (b) Explain how the Electoral College Compromise addressed a dispute analogous to (2), including why it was designed to avoid BOTH alternatives delegates were arguing over. (c) Explain how a Federalist supporter of the new country’s constitution could respond to the Brutus-style objection described above, drawing on Madison’s broader Federalist No. 10 reasoning about the size of a republic.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly describes the Great (Connecticut) Compromise as creating a bicameral legislature — one chamber apportioned by population (favoring larger provinces), one with equal representation per province (favoring smaller ones) — as the resolution to dispute (1). No credit for a response that names only one chamber or omits the bicameral structure.',
            modelResponse:
              'The Great Compromise resolved this kind of dispute by creating a bicameral legislature: one chamber (like the House of Representatives) apportioned by population, satisfying larger provinces, and a second chamber (like the Senate) with equal representation for every province regardless of size, satisfying smaller ones — so neither side had to fully win or fully lose.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains that the Electoral College Compromise created electors (tied to each state's/province's legislative delegation) to choose the executive, and explains it was designed to avoid BOTH giving the legislature direct control over the executive AND relying on a pure national popular vote. No credit for a response that only restates one alternative without explaining why the compromise avoids both.",
            modelResponse:
              "The Electoral College Compromise addressed this by having electors — appointed by each state in numbers tied to its legislative delegation — formally choose the head of state, instead of either extreme: it avoided letting the legislature pick the executive directly (which would make the executive dependent on the legislature) and avoided a pure national popular vote (which many delegates distrusted for a large, dispersed electorate), landing on a middle path insulated from both.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains that a Federalist could respond using Madison's broader (non-excerpt) Federalist No. 10 reasoning — that a large, diverse republic actually controls factions better than a small one because so many competing interests make it harder for any one to dominate — turning the fear of size into an argument for it. No credit for a response with no clear connection to the large-republic-controls-faction argument.",
            modelResponse:
              "A Federalist could respond using Madison's broader Federalist No. 10 reasoning: rather than being fatal to free government, a large, diverse republic actually controls the danger of faction BETTER than a small one, because so many competing interests make it difficult for any single faction to seize control of the whole government — turning Brutus's fear of size into an argument that size is protective rather than dangerous.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-constitution-abolished-states',
      kind: 'misconception_check',
      question:
        'True or false: the new Constitution was designed to eliminate independent state governments and create a single, unified national government with no meaningful state authority left over.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Conflating a STRONGER national government with the elimination of state government altogether — mistaking the shift away from the Articles’ extreme weakness for a total transfer of power to the national capital.',
          correctsTo:
            'FALSE. The Constitution replaced the Articles’ weak "league of friendship" with a genuinely federal system: national and state governments each hold real, distinct authority, rather than the states being absorbed into one central government. The new national government WAS given more power than under the Articles — including the power to tax directly, regulate interstate commerce, and raise an army — but states kept their own legislatures, executives, and courts, and retained significant authority the Constitution never took from them. That division was formalized soon after ratification by the Tenth Amendment (1791), which reserves to the states (or the people) any power the Constitution neither delegates to the national government nor prohibits to the states. Federalists explicitly campaigned on this point during ratification to counter exactly this Anti-Federalist fear — exactly HOW that division of power works (enumerated, reserved, and concurrent powers) is the subject of a later lesson in this unit.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The Articles of Confederation's weaknesses (no direct taxing power, no executive, unanimous-consent amendments) plus Shays's Rebellion (1786-87) catalyzed the Constitutional Convention.",
        'The Great Compromise created a bicameral Congress; the Three-Fifths Compromise counted 3/5 of a state’s enslaved population for both representation and taxation; the Electoral College Compromise had electors — not Congress, not a direct popular vote — choose the President.',
        'Federalists (Hamilton, Madison, Jay) supported ratification, arguing a large republic could control faction and needed a stronger government; Anti-Federalists (Henry, Mason, "Brutus") feared a government this large and centralized, and the missing bill of rights.',
        'Brutus No. 1’s excerpt argues history shows no free republic has governed successfully at this scale; the Federalist No. 10 excerpt only DEFINES faction — Madison’s answering "large-republic-controls-faction" argument is a separate, unquoted part of the essay.',
        'Ratification succeeded (9/13 states, 1788) only after Federalists promised a bill of rights, delivered in 1791 — and the new government was designed to divide power between the nation and the states, not eliminate state authority.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.4-1.5',
    cedTitle: 'Challenges of the Articles of Confederation & Ratification of the Constitution',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-brutus-1.v1',
        chapter: '1787',
        note: 'Brutus No. 1 — the Anti-Federalist argument that free republics cannot survive over so large a territory; anchor document for the concept and worked example.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-federalist-10.v1',
        chapter: '1787',
        note: 'Federalist No. 10 — Madison’s definition of faction (excerpt does NOT include his separate large-republic-controls-faction argument); paired with Brutus No. 1 in the worked example.',
      },
    ],
  },
};
