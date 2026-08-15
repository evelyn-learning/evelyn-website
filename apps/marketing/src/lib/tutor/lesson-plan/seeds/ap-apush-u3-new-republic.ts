/**
 * AP US History — CED Unit 3.11: Developing an American Identity / The
 * New Republic.
 *
 * Period-3 Vertical Slice content plan (follows the causes-of-revolution
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale and docs/superpowers/specs/2026-07-10-ap-us-history-design.md
 * for the shared Passage/rubric infra this plan reuses).
 *
 * Closes the Period-3 government arc: Washington's precedent-setting
 * presidency, Hamilton's financial plan and the constitutional debate it
 * provoked, the first party system (Federalists vs. Democratic-
 * Republicans), and Washington's Farewell Address warnings — delivered
 * only after the very divisions he warned against had already emerged
 * during his own administration.
 *
 * The worked example reuses the Constitution's Preamble (evelyn.passage.
 * apush-constitution-preamble.v1) — introduced in ap-apush-u3-articles-of-
 * confederation.ts as a diagnostic of Articles failures — from a new
 * angle: how the FIRST administration concretely fulfilled (or contested)
 * those stated purposes in practice.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U3_NEW_REPUBLIC: LessonPlan = {
  id: 'evelyn.ap.apush.new-republic.v1',
  title: 'U3.11 Developing an American Identity: The New Republic',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.new-republic',
      description:
        "Explain how Washington's presidency established governing precedents, how Hamilton's financial plan provoked constitutional debate over the scope of federal power, and how the first party system emerged despite Washington's Farewell Address warnings against factionalism and foreign entanglement.",
      standard: 'AP-APUSH-3.11',
    },
  ],
  prerequisites: ['apush.constitution-ratification'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see that Washington was inventing the presidency in real time, with no prior example to follow.',
      script:
        "When George Washington took the oath of office in 1789, the Constitution told him almost nothing about HOW to actually be president. Should he be called \"Your Excellency\"? How many terms should he serve? Should he have advisors, and how much should he listen to them? There was no answer key — Washington was the first person to ever hold this specific job, and whatever he did, right or wrong, would become the unwritten rulebook for every president after him. At the same time, his own government was about to split into two bitterly opposed camps over a question the Constitution also never fully answered: how much power does the federal government actually have? Today we're watching the new republic figure out, in real time, what kind of country it was going to be.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-washington-hamilton-parties',
      kind: 'concept',
      goal: "Explain Washington's precedents, Hamilton's financial plan and the constitutional debate it caused, and the emergence of the first party system.",
      keyIdeas: [
        "WASHINGTON'S PRECEDENTS: as the first president, Washington's choices became unwritten norms. He created an executive Cabinet of advisors (Secretary of State, Treasury, War, Attorney General) though the Constitution does not require one; he voluntarily stepped down after two terms, establishing a norm that held for nearly 150 years (until Franklin Roosevelt won a third term in 1940); and he insisted on the modest title \"Mr. President\" rather than anything resembling royalty, signaling the new government's break from monarchy in practice, not just on paper.",
        "THE JUDICIARY ACT OF 1789: Congress used its first session to fill in what the Constitution left vague, establishing a full federal court system — including the Supreme Court and lower federal courts — answering the Articles of Confederation's total lack of a national judiciary.",
        "HAMILTON'S FINANCIAL PLAN: Treasury Secretary Alexander Hamilton proposed the federal government ASSUME (take over) state Revolutionary War debts, establish a national Bank of the United States to stabilize currency and credit, and raise revenue through tariffs and excise taxes (including a tax on whiskey) — all designed to establish the new government's financial credibility with domestic and foreign lenders.",
        'THE CONSTITUTIONAL FIGHT HAMILTON\'S PLAN PROVOKED: Hamilton defended the national bank as constitutional under "loose construction" — the idea that the Necessary and Proper Clause implies powers beyond those explicitly listed. Thomas Jefferson and James Madison, opposing the bank, argued for "strict construction" — that the federal government could exercise ONLY the specific powers the Constitution explicitly grants. This same interpretive debate (how much power does "necessary and proper" really imply?) would recur across nearly all of American constitutional history.',
        "THE WHISKEY REBELLION (1794): western Pennsylvania farmers, angered by Hamilton's excise tax on whiskey, violently resisted tax collectors. Unlike the Confederation Congress during Shays' Rebellion, Washington personally led a federalized militia to suppress the uprising — a direct demonstration that the NEW government, unlike the old one, actually had the power to enforce its own laws.",
        "THE FIRST PARTY SYSTEM: disagreements over Hamilton's financial plan, the scope of federal power, and how to respond to the French Revolution split Washington's own administration into two organized camps — Federalists (led by Hamilton: strong central government, loose construction, commercial/manufacturing economy, favored stability over revolutionary France) and Democratic-Republicans (led by Jefferson and Madison: strict construction, states' rights, an agrarian economy, more sympathetic to Revolutionary France). This was the first American party system, and it formed WHILE Washington was still in office.",
        "WASHINGTON'S FAREWELL ADDRESS (1796): as he left office, Washington warned against the dangers of permanent political parties (factionalism, he feared, would tear the young republic apart from within) and against permanent foreign alliances that could drag the U.S. into other nations' conflicts. The warning is often remembered as prophetic — but it was also, pointedly, a comment on divisions that had already formed inside his OWN cabinet and party politics that were already actively organizing as he spoke.",
      ],
      vocabulary: [
        {
          term: 'assumption (of state debts)',
          definition:
            "Hamilton's proposal for the federal government to take over and pay off state Revolutionary War debts, strengthening federal financial credibility and tying state interests to the national government's success.",
        },
        {
          term: 'loose construction',
          definition:
            'the interpretive view (Hamilton) that the Constitution\'s Necessary and Proper Clause implies powers beyond those explicitly listed — used to justify the national bank.',
        },
        {
          term: 'strict construction',
          definition:
            'the interpretive view (Jefferson, Madison) that the federal government may exercise only the powers explicitly granted by the Constitution — used to oppose the national bank.',
        },
        {
          term: 'first party system',
          definition:
            "the earliest American political-party divide — Federalists (Hamilton) vs. Democratic-Republicans (Jefferson, Madison) — that emerged during Washington's presidency over federal power and foreign policy.",
        },
        {
          term: 'Whiskey Rebellion',
          definition:
            "an armed 1794 tax protest by western Pennsylvania farmers against Hamilton's excise tax, suppressed by Washington personally leading a federalized militia — demonstrating the new government's enforcement power.",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-preamble-fulfilled',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from the Preamble to the U.S. Constitution once more, now from a different angle: "...in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty..." Rather than reading it as a diagnosis of the Articles\' failures, trace how each purpose was concretely TESTED or FULFILLED during Washington\'s presidency (1789-1797).',
      steps: [
        'SOURCE IT AGAIN, NEW ANGLE. The Preamble states the Constitution\'s purposes in 1787. Washington\'s presidency (1789-1797) is the first real-world test of whether the new government could actually deliver on them.',
        '"ESTABLISH JUSTICE" IS FULFILLED BY THE JUDICIARY ACT OF 1789. Congress\'s first session created the federal court system the Constitution promised but the Articles never had — the Supreme Court and lower federal courts, giving the Preamble\'s promise concrete institutional form almost immediately.',
        '"INSURE DOMESTIC TRANQUILITY" IS TESTED — AND PASSES — DURING THE WHISKEY REBELLION. Unlike the Confederation Congress facing Shays\' Rebellion with no army at all, Washington personally led a federalized militia to suppress the 1794 whiskey-tax uprising in Pennsylvania. This is the clearest possible before/after contrast: the SAME kind of internal unrest that the Articles government could not address, the Constitution\'s government could.',
        '"PROVIDE FOR THE COMMON DEFENCE" IS FUNDED BY HAMILTON\'S FINANCIAL PLAN. Assumption of state debts and a national bank gave the federal government the financial credibility and capacity the Articles never had — the practical precondition for maintaining any defense capability at all.',
        '"PROMOTE THE GENERAL WELFARE" AND "SECURE THE BLESSINGS OF LIBERTY" BECOME CONTESTED, NOT SETTLED. Hamilton and Jefferson/Madison disagreed sharply about HOW to promote the general welfare — loose construction and a commercial/banking economy versus strict construction and an agrarian, states\'-rights vision. The Preamble states a shared goal; it does not settle how to achieve it, and that unresolved question is exactly what produced the first party system.',
        "STATE THE LINK TO THE COURSE THESIS. Washington's presidency shows the Constitution's promises moving from PAPER to PRACTICE — some fulfilled cleanly (justice, domestic tranquility, defense), and one (the \"general welfare\"/scope-of-federal-power question) immediately becoming the central, unresolved argument that would define American politics for the rest of the Republic's history.",
      ],
      answer:
        "Washington's presidency put the Preamble's promises to their first real test. \"Establish Justice\" was fulfilled almost immediately by the Judiciary Act of 1789, creating the federal court system the Articles never had. \"Insure domestic Tranquility\" was tested directly by the Whiskey Rebellion (1794) — and, unlike the Confederation facing Shays' Rebellion, the new government actually had the militia power to respond, with Washington leading it personally. \"Provide for the common defence\" depended on the financial credibility Hamilton's assumption plan and national bank built. But \"promote the general Welfare\" proved to be the Preamble's most contested clause: Hamilton's loose-construction, pro-bank vision and Jefferson/Madison's strict-construction, agrarian vision disagreed sharply on HOW to pursue it — and that unresolved disagreement produced the first party system, showing that the Constitution's shared purposes did not guarantee agreement on how to achieve them.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE component of Hamilton's financial plan. (b) Briefly explain how this component provoked a constitutional debate over the scope of federal power. (c) Briefly explain ONE precedent Washington's presidency established for the federal government.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): correctly and specifically describes a genuine component of Hamilton's financial plan — assumption of state debts, the national Bank of the United States, or tariffs/excise taxes (e.g. the whiskey tax) to raise revenue. No credit for a vague statement (\"Hamilton wanted a strong economy\") with no specific policy named.",
            modelResponse:
              "One component of Hamilton's financial plan was the creation of a national Bank of the United States, intended to stabilize the young nation's currency and credit and give the federal government a reliable financial institution to work with.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate constitutional debate provoked by the named component — e.g. loose construction (Hamilton, Necessary and Proper Clause) versus strict construction (Jefferson/Madison, only explicitly granted powers) over whether the bank was constitutional. No credit for a disconnected or vague explanation.",
            modelResponse:
              "The national bank was not among the powers explicitly listed in the Constitution, so it provoked a fight over interpretation: Hamilton argued for loose construction, claiming the Necessary and Proper Clause implied the federal government could create a bank to carry out its other powers, while Jefferson and Madison argued for strict construction, insisting the federal government could exercise only powers the Constitution explicitly granted.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate precedent Washington's presidency set — e.g. the two-term tradition, creating an executive Cabinet, personally leading the militia response to the Whiskey Rebellion (demonstrating federal enforcement power), or adopting the modest title \"Mr. President.\" No credit for a vague or unsupported claim.",
            modelResponse:
              "Washington established the precedent of voluntarily stepping down after two terms rather than serving for life, setting an unwritten norm for peaceful transfer of presidential power that held for well over a century afterward.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-farewell-address-prevented-parties',
      kind: 'misconception_check',
      question:
        "True or false: Washington's Farewell Address warning against political parties successfully prevented them from forming, since organized parties did not emerge in the U.S. until decades later.",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Treating Washington's warning as a prediction about a distant future danger, rather than a comment on a division that had already formed around him.",
          correctsTo:
            "FALSE. A first party system — Federalists (led by Hamilton) versus Democratic-Republicans (led by Jefferson and Madison) — had already emerged during Washington's OWN presidency, driven by disagreements over Hamilton's financial plan, the proper scope of federal power (loose vs. strict construction), and how to respond to the French Revolution. By the time Washington delivered his Farewell Address in 1796, these were not hypothetical future dangers he was predicting — they were active, organizing political camps already shaping American politics, including disagreements within his own administration. His warning reflects a division he had already witnessed and failed to prevent, not a threat he successfully headed off.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Washington set lasting precedents with no prior model to follow: an executive Cabinet, the two-term tradition, and the modest title \"Mr. President.\"",
        "Hamilton's financial plan (debt assumption, national bank, tariffs/excise taxes) provoked the loose-construction (Hamilton) vs. strict-construction (Jefferson/Madison) constitutional debate.",
        "The Whiskey Rebellion (1794) showed the new government COULD enforce its laws — Washington personally led the militia response, unlike the powerless Confederation during Shays' Rebellion.",
        'The first party system (Federalists vs. Democratic-Republicans) emerged during Washington\'s OWN presidency, not after it.',
        "Washington's Farewell Address (1796) warned against parties and foreign entanglements he had already watched emerge, not dangers he successfully prevented.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.11',
    cedTitle: 'Developing an American Identity / The New Republic',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-constitution-preamble.v1',
        chapter: '1787',
        note: 'Constitution Preamble — reused from ap-apush-u3-articles-of-confederation.ts, now read as the standard tested against Washington-era practice.',
      },
    ],
  },
};
