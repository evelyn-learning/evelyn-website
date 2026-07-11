/**
 * AP US Government & Politics — Unit 1 FRQ Practice: SCOTUS Comparison
 * (AP Gov FRQ 3) — 4 points, one point per lettered part, comparing a
 * REQUIRED foundational case against a related NONREQUIRED case.
 *
 * Format (per the authentic AP Gov SCOTUS Comparison FRQ): the facts,
 * constitutional issue, and holding of two Supreme Court cases (the
 * required case is always one of the nine Unit-1-9 required cases; here,
 * per spec, both case descriptions are given inline in the prompt as text
 * rather than via a passage document), followed by four parts —
 * (A) IDENTIFY a constitutional provision common to both cases,
 * (B) EXPLAIN how the required case's facts led to its holding,
 * (C) EXPLAIN how the reasoning in the required case differs from the
 * reasoning that produced the nonrequired case's holding, and
 * (D) EXPLAIN how the nonrequired case's holding affects a political
 * principle or relationship.
 *
 * Required case: United States v. Lopez (1995) — the Gun-Free School
 * Zones Act of 1990 exceeded Congress's Commerce Clause power, because
 * possessing a firearm near a school is not itself economic activity; the
 * first Commerce Clause limit the Court had imposed since the New Deal
 * era. Nonrequired case: Gonzales v. Raich (2005) — Congress CAN reach
 * even purely local, noncommercial, home-grown medical marijuana under
 * the Commerce Clause, because it is part of a comprehensive national
 * regulatory scheme over the controlled-substances market (the
 * Wickard-style aggregation rationale: Congress may rationally conclude
 * that a whole CLASS of activity, taken in the aggregate, substantially
 * affects interstate commerce, even where an individual instance of that
 * activity, standing alone, would not).
 *
 * NO passageId/passageIds: per spec, both case descriptions live inline
 * in the try_yourself prompt as text, not as a seeded document.
 * Constitutional accuracy of both case summaries is a review gate on this
 * plan; nothing below overstates either holding.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U1_FRQ_SCOTUS_COMPARISON: LessonPlan = {
  id: 'evelyn.ap.apgov.u1-frq-scotus-comparison.v1',
  title: 'Unit 1 FRQ Practice — SCOTUS Comparison',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u1-frq-scotus-comparison',
      description:
        'Answer a complete AP Gov SCOTUS Comparison free-response question comparing the required case United States v. Lopez (1995) to the nonrequired case Gonzales v. Raich (2005) — identifying a shared constitutional clause, explaining how the required case\'s facts produced its holding, explaining how the two cases\' reasoning differs, and explaining how the nonrequired case\'s holding affects federal-state power — scored against the authentic AP Gov 4-point SCOTUS Comparison rubric (1 point per part).',
      standard: 'AP-APGOV-1-FRQ-SCOTUS',
    },
  ],
  prerequisites: ['apgov.federalism-foundations'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of comparing a required case to a related nonrequired case concrete, and name the format\'s biggest trap: describing a case\'s holding as if it were the OTHER case\'s reasoning.',
      script:
        "One of the four AP Gov free-response questions gives you two Supreme Court cases — always one of the nine required cases from the Unit 1-9 case list, plus a related case you haven't necessarily studied by name but can reason about from its facts — worth 4 points. The whole format hinges on precisely tracking which reasoning belongs to which case, because the two cases usually reach OPPOSITE conclusions using the SAME constitutional clause. You already know United States v. Lopez, the required case from this unit: the Court said Congress went too far using the Commerce Clause to ban guns near schools. Today you'll compare it to Gonzales v. Raich, a case where the Court used the SAME Commerce Clause to reach the OPPOSITE result. Getting this FRQ right means never letting the two cases' reasoning blur together.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-scotus-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SCOTUS Comparison FRQ asks for and how the 4-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get the facts, constitutional issue, and holding of two cases — a REQUIRED case (always one of the AP Gov Unit 1-9 required cases) and a NONREQUIRED case that relates to it, usually by sharing a constitutional clause but reaching a different result. Four parts, each worth 1 point, graded independently.',
        'PART (A) — IDENTIFY THE SHARED PROVISION (0-1 point): full credit requires correctly naming the specific constitutional clause or provision common to both cases (here, the Commerce Clause of Article I, Section 8) — not a vague reference to "federal power" with no named clause.',
        'PART (B) — EXPLAIN THE REQUIRED CASE\'S FACTS -> HOLDING (0-1 point): full credit requires explaining HOW the required case\'s specific facts led logically to its specific holding — cause and effect, not just restating the facts and the holding side by side with no connective reasoning.',
        'PART (C) — EXPLAIN HOW THE REASONING DIFFERS (0-1 point): the hardest part of this format. Full credit requires explaining the REASONING gap between the two cases — not just noting that they reached different results, but explaining WHY the same clause produced opposite outcomes (here: whether the regulated activity, taken individually or in the aggregate, is economic and substantially affects interstate commerce).',
        'PART (D) — EXPLAIN THE NONREQUIRED CASE\'S EFFECT (0-1 point): full credit requires explaining how the nonrequired case\'s holding affects a broader political principle or relationship — here, the balance of power between the federal government and the states — not just restating the holding itself.',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: attributing one case\'s reasoning to the other case in part (C) — for instance, describing Raich\'s aggregation reasoning as if it were part of Lopez\'s holding, or vice versa. Keep a clean mental line between which facts and which reasoning belong to which case.',
        'Total = 4 points, one per part, each graded independently — the authentic AP Gov SCOTUS Comparison scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-scotus-comparison-frq',
      kind: 'try_yourself',
      problem:
        'Read the descriptions of the following two Supreme Court cases, then answer parts (A), (B), (C), and (D).\n\nUnited States v. Lopez (1995) — REQUIRED CASE: Congress passed the Gun-Free School Zones Act of 1990, making it a federal crime to knowingly possess a firearm in a school zone, relying on its power under the Commerce Clause. Alfonzo Lopez, a twelfth-grade student, was convicted under the Act after carrying a concealed handgun into his San Antonio high school. He challenged the law, arguing Congress had exceeded its constitutional authority. The Supreme Court agreed: it held that possessing a gun near a school is not itself an economic activity and does not substantially affect interstate commerce, so the Act exceeded Congress\'s Commerce Clause power — the first time in decades the Court had struck down a federal law for going beyond that power.\n\nGonzales v. Raich (2005) — NONREQUIRED CASE: California voters had approved the use of marijuana for medical purposes under state law. Angel Raich and Diane Monson grew small amounts of marijuana at home for their own medical use, entirely within California and never sold or transported across state lines. Federal agents seized and destroyed the plants under the federal Controlled Substances Act, which Congress had enacted using its Commerce Clause power to regulate the national market in controlled substances. Raich sued, arguing that her purely local, noncommercial, home-grown marijuana was beyond Congress\'s reach. The Supreme Court disagreed: it held that Congress could regulate even this local, noncommercial activity because it was part of a broader class of activities — the national market for controlled substances — that Congress could rationally conclude, in the aggregate, substantially affects interstate commerce, so the Commerce Clause reached even Raich\'s home-grown marijuana as part of that comprehensive regulatory scheme.\n\n(A) Identify the constitutional clause that is common to both United States v. Lopez (1995) and Gonzales v. Raich (2005).\n(B) Explain how the facts of Lopez led to the holding in that case.\n(C) Explain how the reasoning in Lopez differs from the reasoning that produced the holding in Raich.\n(D) Explain how the holding in Raich affects the balance of power between the federal government and the states.',
      responseFormat: 'frq',
      expectedAnswer:
        "(A) The Commerce Clause (Article I, Section 8) is common to both cases: Congress relied on it to justify the Gun-Free School Zones Act in Lopez and the Controlled Substances Act's reach into home-grown marijuana in Raich. (B) In Lopez, Alfonzo Lopez was convicted for carrying a gun into a school under a federal law resting solely on the Commerce Clause; because possessing a firearm near a school is not itself an economic activity and does not substantially affect interstate commerce, the Court held that this individual, noneconomic act fell outside the kind of activity the Commerce Clause reaches, so the law exceeded Congress's power and the conviction could not stand on that basis. (C) Lopez's reasoning asked whether the specific regulated activity — gun possession near a school — was itself economic and substantially affected interstate commerce, and found it was not, so the individual act could not be aggregated to justify federal power. Raich's reasoning took a broader, class-based approach: even though Raich's own home-grown marijuana was purely local and noncommercial, the Court reasoned that Congress could rationally treat it as part of a much larger, undeniably economic national market in controlled substances, and that this whole CLASS of activity, taken in the aggregate, substantially affects interstate commerce — so the individual local act could be swept in as part of a comprehensive regulatory scheme, even though it could not have been reached on its own under Lopez's individual-activity test. (D) By allowing Congress to reach purely local, noncommercial, state-authorized activity as part of a broader national regulatory scheme, Raich's holding favors the federal government in the balance of federal-state power: it shows that once Congress comprehensively regulates a national market, states have limited ability to carve out even genuinely local exceptions (like California's own medical-marijuana law) from that federal scheme, meaning federal Commerce Clause power can override a state's own policy choice in an area the state has otherwise chosen to permit.",
      rubric: {
        parts: [
          {
            criterionId: 'A-identify-clause',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly identifies the Commerce Clause (Article I, Section 8) as the provision common to both cases. No credit (0/1) for a different or vaguely stated clause/power.',
            modelResponse:
              "The Commerce Clause of Article I, Section 8 is common to both cases — Congress invoked it to justify the Gun-Free School Zones Act in Lopez and the Controlled Substances Act's application to home-grown marijuana in Raich.",
          },
          {
            criterionId: 'B-required-case-reasoning',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains HOW Lopez\'s facts (gun possession near a school, a noneconomic individual act) led to the holding that the Gun-Free School Zones Act exceeded the Commerce Clause power — cause and effect, not just restated facts. No credit (0/1) for stating the facts or the holding alone with no connecting reasoning, or for misstating the holding.',
            modelResponse:
              "Alfonzo Lopez was convicted for carrying a gun into a San Antonio school under a federal law based solely on the Commerce Clause; because possessing a firearm near a school is not itself an economic activity and does not substantially affect interstate commerce, the Court held that this kind of individual, noneconomic conduct falls outside what the Commerce Clause reaches, so the Act exceeded Congress's constitutional authority and could not support the conviction.",
          },
          {
            criterionId: 'C-compare-reasoning',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1/1): explains the reasoning gap between the two cases — Lopez asked whether the SPECIFIC regulated activity was itself economic and substantially affected interstate commerce (it was not), while Raich allowed Congress to aggregate a local, noncommercial act into a broader CLASS of activity that, taken as a whole, substantially affects interstate commerce. No credit (0/1) for only stating that the two cases reached different results without explaining why the reasoning differed, or for attributing one case's reasoning to the other.",
            modelResponse:
              "Lopez's reasoning examined the specific regulated activity in isolation — gun possession near a school — and found it was not itself economic and did not substantially affect interstate commerce, so it could not be reached under the Commerce Clause. Raich's reasoning instead asked whether the activity was part of a broader CLASS of economic activity that, in the aggregate, substantially affects interstate commerce; because home-grown medical marijuana was part of the much larger national market in controlled substances that Congress was comprehensively regulating, the Court allowed it to be aggregated into that class even though, standing alone like the gun in Lopez, it was local and noncommercial.",
          },
          {
            criterionId: 'D-explain-effect',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1/1): explains how Raich's holding affects the federal-state balance of power — that it favors federal power by letting Congress reach local, state-authorized activity as part of a comprehensive national regulatory scheme, limiting states' ability to carve out exceptions even in areas of state policy choice. No credit (0/1) for restating the holding with no explanation of its effect on federal-state power.",
            modelResponse:
              "Because Raich lets Congress reach even purely local, noncommercial, state-authorized activity when it is part of a comprehensive national regulatory scheme, the holding shifts the federal-state balance of power toward the federal government: states have limited ability to protect even their own explicitly authorized policy choices, like California's medical-marijuana law, from a comprehensive federal regulatory scheme resting on the Commerce Clause.",
          },
        ],
      },
      hints: [
        'Part (A) wants ONE named clause, not a vague reference to "federal power."',
        'Part (C) is the hardest part: explain WHY the reasoning differs (individual activity vs. aggregated class of activity), not just that the outcomes differ.',
        "Don't let Lopez's and Raich's reasoning blur together — keep a clean line between which facts and which logic belong to which case.",
      ],
      estimatedMinutes: 13,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SCOTUS Comparison is 4 points, one per part, each graded independently — a required case (Lopez) plus a related nonrequired case (Raich), no separate document.',
        'Lopez (1995): the Gun-Free School Zones Act exceeded the Commerce Clause power because possessing a gun near a school is not economic activity — the first Commerce Clause limit in decades.',
        "Raich (2005): Congress CAN reach purely local, noncommercial, home-grown medical marijuana under the Commerce Clause because it's part of a comprehensive national regulatory scheme — the aggregation/class-of-activities rationale, the opposite outcome from the same clause.",
        "Part (C) is the format's hardest part: explain WHY the reasoning differs (individual-activity test in Lopez vs. aggregated-class test in Raich), not just that the results differ.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1-FRQ-SCOTUS',
    cedTitle: 'Unit 1 FRQ Practice — SCOTUS Comparison',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics SCOTUS Comparison free-response task wording and 4-point rubric (1 point per lettered part). Case descriptions (United States v. Lopez, 1995; Gonzales v. Raich, 2005) are inline prompt text, not a seeded passage.',
      },
    ],
  },
};
