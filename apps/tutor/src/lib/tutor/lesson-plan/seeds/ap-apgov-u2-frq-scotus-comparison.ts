/**
 * AP US Government & Politics — Unit 2 FRQ Practice: SCOTUS Comparison
 * (AP Gov FRQ 3) — 4 points, one point per lettered part, comparing a
 * REQUIRED foundational case against a related NONREQUIRED case.
 *
 * Format (per the authentic AP Gov SCOTUS Comparison FRQ): the facts,
 * constitutional issue, and holding of two Supreme Court cases, given
 * inline in the prompt as text rather than via a passage document,
 * followed by four parts — (A) IDENTIFY a concept common to both cases,
 * (B) EXPLAIN how the required case's facts led to its holding, (C)
 * EXPLAIN how the reasoning in the nonrequired case differs from the
 * required case's reasoning, and (D) EXPLAIN how the nonrequired case's
 * holding affects a political principle or relationship.
 *
 * Required case: Baker v. Carr (1962) — Tennessee had not redrawn its
 * legislative districts since 1901 despite major population shifts,
 * producing severe rural/urban malapportionment; the Court held that
 * reapportionment claims are justiciable under the Fourteenth Amendment's
 * Equal Protection Clause, rejecting the argument that such claims were a
 * nonjusticiable political question. Nonrequired case: Rucho v. Common
 * Cause (2019) — challenges to partisan-gerrymandered congressional maps
 * in North Carolina and Maryland; the Court held that claims of excessive
 * partisan gerrymandering present nonjusticiable political questions,
 * because there is no judicially manageable standard for measuring how
 * much partisan advantage is too much, leaving such claims beyond the
 * reach of federal courts. NO passageId/passageIds: per spec, both case
 * descriptions live inline in the try_yourself prompt as text. Constitu-
 * tional accuracy of both case summaries is a review gate on this plan.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U2_FRQ_SCOTUS_COMPARISON: LessonPlan = {
  id: 'evelyn.ap.apgov.u2-frq-scotus-comparison.v1',
  title: 'Unit 2 FRQ Practice — SCOTUS Comparison',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u2-frq-scotus-comparison',
      description:
        'Answer a complete AP Gov SCOTUS Comparison free-response question comparing the required case Baker v. Carr (1962) to the nonrequired case Rucho v. Common Cause (2019) — identifying the shared concept of justiciability, explaining how the required case\'s facts produced its holding, explaining how the two cases\' reasoning about justiciability differs, and explaining how the nonrequired case\'s holding affects state legislatures\' power over districting — scored against the authentic AP Gov 4-point SCOTUS Comparison rubric (1 point per part).',
      standard: 'AP-APGOV-2-FRQ-SCOTUS',
    },
  ],
  prerequisites: ['apgov.congress-structure', 'apgov.judiciary-independence'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of comparing a required case to a related nonrequired case concrete, and name the format\'s biggest trap: describing one case\'s reasoning as if it belonged to the other.',
      script:
        "One of the four AP Gov free-response questions gives you two Supreme Court cases — always one of the nine required cases, plus a related case you can reason about from its facts — worth 4 points. This time the shared thread is justiciability: whether a federal court may even hear a claim, or whether it's the kind of dispute the Constitution commits to the elected branches instead. You already know Baker v. Carr, the required case that opened federal courts' doors to redistricting challenges. Today you'll compare it to Rucho v. Common Cause, a case about a DIFFERENT kind of districting claim — partisan gerrymandering — where the Court closed that same door. Getting this FRQ right means never letting the two cases' reasoning about justiciability blur together.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-scotus-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SCOTUS Comparison FRQ asks for and how the 4-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get the facts, constitutional issue, and holding of two cases — a REQUIRED case (Baker v. Carr) and a NONREQUIRED case that relates to it (Rucho v. Common Cause), here sharing the concept of justiciability but reaching different results. Four parts, each worth 1 point, graded independently.',
        'PART (A) — IDENTIFY THE SHARED CONCEPT (0-1 point): full credit requires correctly naming justiciability — whether a court may properly decide a claim, as opposed to it being a nonjusticiable political question — as the concept common to both cases\' central legal question.',
        'PART (B) — EXPLAIN THE REQUIRED CASE\'S FACTS -> HOLDING (0-1 point): full credit requires explaining HOW Baker\'s specific facts (Tennessee\'s decades-stale districts, severe rural/urban malapportionment) led logically to its specific holding (reapportionment claims are justiciable under the Equal Protection Clause) — cause and effect, not just facts and holding restated side by side.',
        'PART (C) — EXPLAIN HOW THE REASONING DIFFERS (0-1 point): the hardest part of this format. Full credit requires explaining WHY the two cases reached different conclusions about justiciability — Baker found a judicially manageable standard (population equality) for malapportionment, while Rucho found NO judicially manageable standard for measuring how much partisan advantage in districting is too much.',
        'PART (D) — EXPLAIN THE NONREQUIRED CASE\'S EFFECT (0-1 point): full credit requires explaining how Rucho\'s holding affects a broader political relationship — here, the practical power of state legislatures over districting — not just restating the holding itself.',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: attributing one case\'s reasoning to the other in part (C) — for instance, describing Rucho\'s "no manageable standard" reasoning as if it applied to Baker, or vice versa.',
        'Total = 4 points, one per part, each graded independently — the authentic AP Gov SCOTUS Comparison scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-scotus-comparison-frq',
      kind: 'try_yourself',
      problem:
        'Read the descriptions of the following two Supreme Court cases, then answer parts (A), (B), (C), and (D).\n\nBaker v. Carr (1962) — REQUIRED CASE: Tennessee had not redrawn the boundaries of its state legislative districts since 1901, even though the state\'s population had shifted dramatically from rural to urban areas in the decades since. As a result, some rural districts had far fewer residents per legislator than urban districts, so rural votes counted far more than urban votes in electing the state legislature. Charles Baker and other urban voters sued, arguing this malapportionment diluted their votes in violation of the Fourteenth Amendment\'s Equal Protection Clause. Tennessee argued that redistricting was a "political question" that federal courts had no business deciding. The Supreme Court disagreed: it held that claims of legislative malapportionment are justiciable — federal courts CAN hear and decide them under the Equal Protection Clause — because such claims do not require courts to resolve an issue the Constitution commits exclusively to another branch.\n\nRucho v. Common Cause (2019) — NONREQUIRED CASE: Voters in North Carolina and Maryland challenged their states\' congressional district maps, arguing the maps had been deliberately drawn by the party in power to entrench that party\'s advantage and dilute the votes of the other party\'s supporters. They argued this partisan gerrymandering violated constitutional principles of fair representation. The Supreme Court disagreed that federal courts could resolve the claim: it held that claims of excessive partisan gerrymandering present political questions beyond the reach of federal courts, because there is no judicially manageable standard for deciding how much partisan advantage in a district map crosses a constitutional line — leaving such disputes to state legislatures, state courts applying state constitutions, Congress, or ballot initiatives, not federal courts.\n\n(A) Identify the concept of justiciability common to both Baker v. Carr (1962) and Rucho v. Common Cause (2019).\n(B) Explain how the facts of Baker led to its holding.\n(C) Explain how the reasoning in Rucho differs from the reasoning in Baker.\n(D) Explain how the holding in Rucho affects the power of state legislatures over districting.',
      responseFormat: 'frq',
      expectedAnswer:
        "(A) Justiciability — whether a claim is the kind of dispute a federal court may properly decide, as opposed to a nonjusticiable political question committed to another branch — is the concept common to both cases, since each turns on whether the Supreme Court could even hear the underlying districting claim. (B) In Baker, Tennessee's legislative districts had not been redrawn since 1901 despite major rural-to-urban population shifts, producing severe malapportionment in which rural votes counted far more than urban votes; because the claim rested on the Fourteenth Amendment's Equal Protection Clause and courts had a manageable way to measure the harm (comparing population across districts), the Court held that reapportionment challenges are justiciable and could proceed in federal court, rather than being dismissed as a political question. (C) Baker's reasoning found that malapportionment claims present a judicially manageable standard — comparing district populations under the Equal Protection Clause — so such claims were justiciable. Rucho's reasoning, by contrast, held that while partisan gerrymandering might raise real concerns about fair representation, there is no judicially discernible and manageable standard for deciding how much partisan advantage is too much, because measuring political \"fairness\" between parties is inherently a value judgment rather than one federal courts have a legal yardstick to apply consistently — so unlike Baker's numerically measurable malapportionment claim, Rucho's partisan-gerrymandering claim was held nonjusticiable. (D) By closing the door to federal court review of partisan-gerrymandering claims, Rucho's holding increases the practical power of state legislatures over districting: legislatures that control the redistricting process, especially under unified government, can draw congressional and state legislative maps to favor their own party without a federal constitutional check on that partisan motive, leaving only state courts under state constitutions, state redistricting commissions, or Congress as potential limits on that power.",
      rubric: {
        parts: [
          {
            criterionId: 'A-identify-justiciability',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly identifies justiciability — whether a claim is one federal courts may properly decide, versus a nonjusticiable political question — as the concept common to both cases. No credit (0/1) for a different or vaguely stated concept (e.g., simply "redistricting" with no reference to whether courts could hear the claim).',
            modelResponse:
              'Justiciability — whether a claim is the kind of dispute a federal court may properly decide, as opposed to a nonjusticiable political question committed to another branch — is common to both cases, since each turns on whether the Supreme Court could even hear the underlying districting claim.',
          },
          {
            criterionId: 'B-required-case-reasoning',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains HOW Baker\'s facts (Tennessee\'s decades-stale districts, severe rural/urban malapportionment) led to the holding that reapportionment claims are justiciable under the Equal Protection Clause — cause and effect, not just restated facts. No credit (0/1) for stating the facts or the holding alone with no connecting reasoning, or for misstating the holding.',
            modelResponse:
              "Tennessee's legislative districts had not been redrawn since 1901 despite major rural-to-urban population shifts, producing severe malapportionment in which rural votes counted far more than urban votes; because the claim rested on the Fourteenth Amendment's Equal Protection Clause and courts had a manageable way to measure the harm — comparing population across districts — the Court held that reapportionment challenges are justiciable and could proceed in federal court, rather than being dismissed as a political question.",
          },
          {
            criterionId: 'C-compare-reasoning',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1/1): explains the reasoning gap between the two cases — Baker found a judicially manageable standard (population equality under the Equal Protection Clause) for malapportionment, while Rucho found NO judicially manageable standard for measuring how much partisan advantage in districting is too much. No credit (0/1) for only stating that the two cases reached different results without explaining why the reasoning differed, or for attributing one case's reasoning to the other.",
            modelResponse:
              "Baker's reasoning found a judicially manageable standard for malapportionment claims — comparing population across districts under the Equal Protection Clause — so such claims were justiciable. Rucho's reasoning instead concluded that although partisan gerrymandering may raise real concerns about fair representation, there is no judicially discernible and manageable standard for deciding how much partisan advantage crosses a constitutional line, because measuring political fairness between parties is a value judgment rather than one courts have a legal yardstick to apply consistently — so unlike Baker's numerically measurable claim, Rucho's partisan-gerrymandering claim was held nonjusticiable.",
          },
          {
            criterionId: 'D-explain-effect',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1/1): explains how Rucho's holding affects the power of state legislatures over districting — that closing federal courts to partisan-gerrymandering claims increases legislatures' practical discretion to draw maps favoring their own party without federal judicial check. No credit (0/1) for restating the holding with no explanation of its effect on state legislative power.",
            modelResponse:
              "By closing the door to federal court review of partisan-gerrymandering claims, Rucho's holding increases the practical power of state legislatures over districting: legislatures controlling the redistricting process, especially under unified government, can draw maps to favor their own party without a federal constitutional check on that partisan motive, leaving only state courts under state constitutions, state redistricting commissions, or Congress as potential limits.",
          },
        ],
      },
      hints: [
        'Part (A) wants ONE named concept (justiciability), not a vague reference to "redistricting rules."',
        'Part (C) is the hardest part: explain WHY the reasoning differs (a manageable population standard in Baker vs. no manageable partisan-fairness standard in Rucho), not just that the outcomes differ.',
        "Don't let Baker's and Rucho's reasoning blur together — keep a clean line between which case found a manageable standard and which case did not.",
      ],
      estimatedMinutes: 13,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SCOTUS Comparison is 4 points, one per part, each graded independently — a required case (Baker) plus a related nonrequired case (Rucho), no separate document.',
        'Baker v. Carr (1962): malapportionment claims are justiciable under the Equal Protection Clause because courts have a manageable standard — comparing district populations.',
        'Rucho v. Common Cause (2019): partisan-gerrymandering claims are NONjusticiable political questions because there is no judicially manageable standard for how much partisan advantage is too much — the opposite justiciability conclusion from a related districting dispute.',
        "Part (C) is the format's hardest part: explain WHY the reasoning differs (a workable population standard vs. no workable partisan-fairness standard), not just that the results differ.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2-FRQ-SCOTUS',
    cedTitle: 'Unit 2 FRQ Practice — SCOTUS Comparison',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics SCOTUS Comparison free-response task wording and 4-point rubric (1 point per lettered part). Case descriptions (Baker v. Carr, 1962; Rucho v. Common Cause, 2019) are inline prompt text, not a seeded passage.',
      },
    ],
  },
};
