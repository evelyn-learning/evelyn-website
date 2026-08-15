/**
 * AP US History — CED Unit 3.9: The Articles of Confederation.
 *
 * Period-3 Vertical Slice content plan (follows the causes-of-revolution
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale and docs/superpowers/specs/2026-07-10-ap-us-history-design.md
 * for the shared Passage/rubric infra this plan reuses).
 *
 * This plan covers the first American national government — deliberately
 * weak by design, given the revolutionaries' fear of concentrated power
 * fresh off a war against a distant king — and the specific structural
 * weaknesses (no taxing power, no army, near-impossible amendment) that
 * exposed it as unworkable, culminating in Shays' Rebellion (1786-87).
 *
 * No Articles-of-Confederation text is seeded as a Passage (it has little
 * quotable rhetorical content for document analysis). Instead, the worked
 * example uses the Constitution's Preamble — evelyn.passage.apush-
 * constitution-preamble.v1 — as a CONTRAST document: each purpose the
 * Preamble lists reads as a direct answer to a specific Articles failure.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U3_ARTICLES_OF_CONFEDERATION: LessonPlan = {
  id: 'evelyn.ap.apush.articles-of-confederation.v1',
  title: 'U3.9 The Articles of Confederation',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.articles-of-confederation',
      description:
        'Explain the structure, powers, and weaknesses of the Articles of Confederation, including the causes and significance of Shays\' Rebellion, and evaluate the Northwest Ordinance as an achievement of the Confederation Congress.',
      standard: 'AP-APUSH-3.9',
    },
  ],
  prerequisites: ['apush.revolutionary-ideals'],
  followUps: ['apush.constitution-ratification'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: "Get the student to see the Articles' weakness as a deliberate CHOICE born of fear, not an accident or oversight.",
      script:
        "Imagine you'd just fought a war to escape a government that taxed you without your consent and sent soldiers to occupy your towns. When it's your turn to design a NEW government, what's the first thing you'd worry about? Almost certainly: making sure this new government can never do that to you again. That's exactly the mindset the framers of America's first constitution — the Articles of Confederation, adopted in 1777 — brought to the table. They built a national government so weak on purpose that it could barely function. It worked, for a while. Then it didn't. Today we're tracing what the Articles could and couldn't do, and how one specific crisis in rural Massachusetts exposed the flaw that would end up rewriting the whole American government from scratch.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-articles-structure-weaknesses',
      kind: 'concept',
      goal: "Explain the Articles of Confederation's structure and powers, its critical weaknesses, and the Northwest Ordinance as a genuine success.",
      keyIdeas: [
        "A DELIBERATELY WEAK GOVERNMENT: the Articles of Confederation, drafted in 1777 and ratified by all 13 states in 1781 (delayed for years by disputes over western land claims), created a national government that was really a \"league of friendship\" among sovereign states — a unicameral Congress with one vote per state, and NO separate executive branch or national judiciary. This was a deliberate reaction to fear of concentrated power, fresh off a revolution against a king.",
        'WHAT CONGRESS COULD DO: declare war and make peace, negotiate treaties with foreign nations, coin money, and manage western territories and relations with Native nations.',
        "WHAT CONGRESS COULD NOT DO: it could not levy or collect taxes directly — it could only REQUEST money from the states (a \"requisition\"), which states frequently ignored, leaving the national government chronically underfunded. It could not regulate interstate or foreign commerce, so states set their own tariffs against each other. It had no power to raise a standing national army, relying instead on state militias it could not compel states to provide. And amending the Articles required the UNANIMOUS consent of all 13 states, making structural reform nearly impossible even when most states agreed change was needed.",
        "SHAYS' REBELLION (1786-87): in western Massachusetts, farmers — many of them Revolutionary War veterans — faced crushing debt, high state taxes, and courts foreclosing on their land. Led by Daniel Shays, armed farmers shut down local courts and marched on a federal arsenal to stop the foreclosures. The Confederation Congress had NO national army to respond — Massachusetts had to raise its own private militia (funded by wealthy merchants) to put the rebellion down. This exposed, in the most alarming way possible, that the national government could not guarantee order even within a single state.",
        'THE NORTHWEST ORDINANCE (1787) — A REAL SUCCESS: passed by the same Confederation Congress in its final year, the Northwest Ordinance established an orderly process for organizing and admitting new states from the Northwest Territory (later Ohio, Indiana, Illinois, Michigan, Wisconsin) on EQUAL footing with the original 13 states — not as permanent colonies of the older states. It banned slavery north of the Ohio River and provided for public education in the new territories. This shows the Articles were not a failure at everything — territorial policy is a genuine, lasting Confederation Congress achievement, even as its finance, commerce, and defense powers collapsed.',
        'THE UPSHOT: the Articles\' failures were not random — they traced directly back to the founding fear of centralized power. That same fear had made the new government too weak to tax, defend, or even police itself, and Shays\' Rebellion was the specific crisis that convinced many leaders a stronger national government was necessary, setting up the Constitutional Convention of 1787.',
      ],
      vocabulary: [
        {
          term: 'Articles of Confederation',
          definition:
            "the first constitution of the United States (ratified 1781), creating a deliberately weak national government — a \"league of friendship\" among sovereign states with no executive or judiciary and no power to tax or raise an army.",
        },
        {
          term: 'requisition',
          definition:
            "the system by which the Confederation Congress could only REQUEST funds from state governments rather than collect taxes directly — states often refused or paid late, leaving Congress chronically underfunded.",
        },
        {
          term: "Shays' Rebellion",
          definition:
            'an armed uprising (1786-87) of debt-burdened Massachusetts farmers protesting land foreclosures and taxes; the Confederation\'s inability to respond became a key catalyst for the Constitutional Convention.',
        },
        {
          term: 'Northwest Ordinance',
          definition:
            "an act of the Confederation Congress (1787) establishing an orderly process for admitting new states from the Northwest Territory on equal footing with existing states, and banning slavery north of the Ohio River.",
        },
        {
          term: 'unicameral',
          definition:
            'having a single legislative chamber — the structure of the Confederation Congress, in contrast to the later bicameral Congress (House + Senate) under the Constitution.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-preamble-contrast',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from the Preamble to the U.S. Constitution (1787): "We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America." Read as a RESPONSE to the Articles of Confederation, what specific failure does each purpose in this list seem to be answering?',
      steps: [
        'SOURCE IT FIRST. Written at the Philadelphia Convention in the summer of 1787 — called, officially, to revise the Articles of Confederation, but the delegates instead drafted an entirely new constitution. This is the OPENING sentence, stating the document\'s purposes before a single article of government structure follows.',
        '"MORE PERFECT UNION" ANSWERS THE LEAGUE-OF-FRIENDSHIP PROBLEM. The Articles created 13 largely independent states loosely allied, not a unified nation — no power to force states to cooperate on anything from finances to interstate trade. "More perfect Union" signals a shift toward genuine national government, not just an alliance.',
        '"ESTABLISH JUSTICE" ANSWERS THE MISSING JUDICIARY. The Articles had no national court system at all to interpret laws or resolve disputes between states. This clause anticipates what becomes Article III and the federal judiciary.',
        '"INSURE DOMESTIC TRANQUILITY" ANSWERS SHAYS\' REBELLION DIRECTLY. Under the Articles, the national government had no army to respond when armed farmers shut down Massachusetts courts in 1786-87 — the state had to raise its own militia. This phrase is a direct, almost pointed, response to a very fresh and specific crisis.',
        '"PROVIDE FOR THE COMMON DEFENCE" ANSWERS THE NO-ARMY, NO-TAX PROBLEM. Without direct taxing power, the Confederation Congress could not reliably fund or raise a standing military — it could only request money and troops from states that often refused.',
        '"PROMOTE THE GENERAL WELFARE" AND "SECURE THE BLESSINGS OF LIBERTY" gesture more broadly at the Articles\' commercial paralysis (no power to regulate interstate/foreign trade, so states taxed each other\'s goods) and at protecting the Revolution\'s gains for future generations ("our Posterity") rather than letting the new nation collapse into disorder or reconquest.',
        'STATE THE LINK TO THE COURSE THESIS. Read this way, the Preamble is almost a diagnostic checklist of the Articles\' specific structural failures — which is exactly why the document that replaces the Articles opens by naming, in order, what the old government could not do.',
      ],
      answer:
        "Each purpose in the Preamble reads as a direct answer to a specific Articles-of-Confederation failure: \"more perfect Union\" replaces the loose \"league of friendship\" that let states act independently; \"establish Justice\" supplies the national judiciary the Articles never had; \"insure domestic Tranquility\" responds almost pointedly to Shays' Rebellion, which the Confederation had no army to put down; \"provide for the common defence\" answers the Articles' inability to tax or reliably raise a military; and \"promote the general Welfare\"/\"secure the Blessings of Liberty\" gesture at the commercial paralysis and long-term instability the Articles' weak structure produced. Read this way, the Preamble functions almost as a checklist of the government it is replacing.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE specific weakness of the Articles of Confederation. (b) Briefly explain ONE piece of specific historical evidence (an event or policy) that illustrates this weakness. (c) Briefly explain ONE way the Northwest Ordinance represents a genuine SUCCESS of the Confederation Congress despite these weaknesses.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine structural weakness of the Articles of Confederation — e.g. no power to levy/collect taxes directly (only request via requisition), no power to regulate interstate/foreign commerce, no standing national army, or the unanimous-consent requirement for amendments. No credit for a vague statement ("the government was weak") with no specific power named.',
            modelResponse:
              'One weakness of the Articles of Confederation was that Congress had no power to levy or collect taxes directly — it could only request funds from the states through a system of requisitions, which states frequently ignored or paid late.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific piece of evidence (event or policy) that demonstrates the weakness named in (a), connected clearly to that weakness. No credit for evidence unconnected to the stated weakness or too generic to verify.",
            modelResponse:
              "Shays' Rebellion (1786-87) showed this directly: when debt-burdened Massachusetts farmers shut down courts and marched on a federal arsenal, the Confederation Congress had no national army it could deploy, and Massachusetts had to raise and fund its own private militia to put down the uprising.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way the Northwest Ordinance (1787) succeeded — e.g. establishing an orderly process for admitting new states on equal footing, banning slavery north of the Ohio River, or providing for public education in the territories. No credit for a vague claim with no specific provision named.',
            modelResponse:
              "The Northwest Ordinance of 1787 established a clear, orderly process for organizing the Northwest Territory and admitting new states from it on equal footing with the original 13 — rather than treating new territory as a permanent colonial possession of the existing states — and it also banned slavery north of the Ohio River, showing the Confederation Congress could still govern effectively in areas where its structural weaknesses (taxation, defense) weren't the limiting factor.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-total-failure',
      kind: 'misconception_check',
      question:
        'True or false: the Articles of Confederation were a total failure with no real accomplishments, which is why they were scrapped in 1787.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'All-or-nothing thinking about the Articles — treating a government with serious structural weaknesses as though it accomplished literally nothing, rather than recognizing it succeeded in some policy areas (territorial organization) while failing badly in others (taxation, defense, commerce).',
          correctsTo:
            "FALSE. The Articles of Confederation had genuine, serious structural weaknesses — no power to tax directly, no standing army, no power to regulate commerce, and an amendment process requiring unanimous consent that made reform nearly impossible — and Shays' Rebellion (1786-87) exposed those weaknesses in the most alarming way, becoming a key catalyst for the Constitutional Convention. But the SAME Confederation Congress also passed the Northwest Ordinance of 1787, a genuinely successful and long-lasting policy that established an orderly, equal-footing process for admitting new states and banned slavery in the Northwest Territory — a framework that shaped American westward expansion for decades. The AP exam rewards recognizing this kind of nuance: a government (or any historical actor) can fail badly in some respects and succeed in others within the same period.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Articles created a deliberately weak national government — unicameral Congress, no executive, no judiciary — as a direct reaction to fear of concentrated power after the Revolution.',
        'Critical weaknesses: no power to tax directly (only requisition), no power to regulate commerce, no standing army, and amendments required unanimous consent of all 13 states.',
        "Shays' Rebellion (1786-87) exposed the Confederation's inability to respond to internal unrest — Massachusetts had to raise its own militia — and became a key catalyst for the Constitutional Convention.",
        'The Northwest Ordinance (1787) was a genuine success: an orderly process for new-state admission on equal footing, and a ban on slavery north of the Ohio River.',
        "The Constitution's Preamble purposes (Union, Justice, domestic Tranquility, common defence) read almost as a direct answer to specific Articles failures.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.9',
    cedTitle: 'The Articles of Confederation',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-constitution-preamble.v1',
        chapter: '1787',
        note: 'Constitution Preamble — used as a contrast document, read as a response to specific Articles-of-Confederation failures.',
      },
    ],
  },
};
