/**
 * AP US Government & Politics — Unit 4 FRQ Practice: SCOTUS Comparison
 * (AP Gov FRQ 3) — 4 points, one point per lettered part, comparing a
 * REQUIRED foundational case against a related NONREQUIRED case.
 *
 * SPEC-FLAGGED DEVIATION: Unit 4 (Political Ideologies & Beliefs) is the
 * one CED unit with NO required Supreme Court case of its own. Per the AP
 * Plans Initiative's D3 hybrid-SCOTUS coverage decision, this plan
 * BORROWS the required free-exercise case Wisconsin v. Yoder (1972) —
 * normally associated with Unit 3's civil liberties — so that Unit 4
 * still gets a full, authentic SCOTUS Comparison FRQ. This is a deliberate,
 * documented exception, not an error.
 *
 * Format (per the authentic AP Gov SCOTUS Comparison FRQ): the facts,
 * constitutional issue, and holding of two Supreme Court cases, given
 * inline in the prompt as text rather than via a passage document,
 * followed by four parts — (A) IDENTIFY a concept common to both cases,
 * (B) EXPLAIN how the required case's facts led to its holding, (C)
 * EXPLAIN how the reasoning in the nonrequired case differs from the
 * required case's reasoning, and (D) EXPLAIN how the nonrequired case's
 * holding affects religious groups whose beliefs conflict with state law.
 *
 * Required case: Wisconsin v. Yoder (1972) — Wisconsin required school
 * attendance until age 16; Amish parents refused to send their children to
 * formal school beyond the 8th grade (through about age 14-15), citing
 * their religion's rejection of the values taught in higher education and
 * their community's practice of hands-on vocational training instead. The
 * Court held that Wisconsin's interest in two more years of compulsory
 * schooling did not outweigh the substantial burden the requirement placed
 * on the Amish families' sincere, long-standing free-exercise-of-religion
 * rights, so the state could not force the additional years of attendance.
 * Nonrequired case: Employment Division v. Smith (1990) — two drug
 * counselors were fired, and then denied Oregon unemployment benefits,
 * after ingesting peyote as part of a Native American Church religious
 * ceremony; Oregon's controlled-substances law banned peyote for everyone,
 * with no religious exemption. The Court held that a neutral, generally
 * applicable law (one that does not target religion and applies to
 * everyone regardless of belief) does not violate the Free Exercise Clause
 * merely because it incidentally burdens a religious practice, and does
 * not require the government to show a compelling interest to justify that
 * incidental burden. NO passageId/passageIds: per spec, both case
 * descriptions live inline in the try_yourself prompt as text, matching
 * the U1/U2/U3 inline-description convention for this format.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U4_FRQ_SCOTUS_COMPARISON: LessonPlan = {
  id: 'evelyn.ap.apgov.u4-frq-scotus-comparison.v1',
  title: 'Unit 4 FRQ Practice — SCOTUS Comparison',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u4-frq-scotus-comparison',
      description:
        'Answer a complete AP Gov SCOTUS Comparison free-response question comparing the required case Wisconsin v. Yoder (1972) to the nonrequired case Employment Division v. Smith (1990) — identifying the shared Free Exercise Clause concept, explaining how the required case\'s facts produced its holding, explaining how the two cases\' reasoning differs, and explaining how the nonrequired case\'s holding affects religious groups whose beliefs conflict with state law — scored against the authentic AP Gov 4-point SCOTUS Comparison rubric (1 point per part).',
      standard: 'AP-APGOV-4-FRQ-SCOTUS',
    },
  ],
  prerequisites: ['apgov.socialization-opinion', 'apgov.public-opinion-measurement', 'apgov.ideology-policy'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of comparing a required case to a related nonrequired case concrete, and flag why this particular pairing is borrowed into Unit 4, then name the format\'s biggest trap: applying one case\'s balancing test to the other case\'s facts.',
      script:
        "One of the four AP Gov free-response questions gives you two Supreme Court cases — always one of the nine required cases, plus a related case you can reason about from its facts — worth 4 points. Here's something worth knowing about today's pair: Unit 4 (ideology and public opinion) doesn't have a required case of its own, so this practice set borrows Wisconsin v. Yoder, a free-exercise-of-religion case usually studied alongside civil liberties, so you still get full SCOTUS Comparison practice. Yoder held that Wisconsin couldn't force Amish families to send their children to school past the 8th grade over their religious objection. Today you'll compare it to Employment Division v. Smith, a case about a very DIFFERENT kind of religious practice — peyote use in a Native American religious ceremony — where the Court reached its result WITHOUT using Yoder's balancing approach at all. Getting this FRQ right means never letting the two cases' reasoning blur together.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-scotus-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SCOTUS Comparison FRQ asks for and how the 4-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get the facts, constitutional issue, and holding of two cases — a REQUIRED case (Wisconsin v. Yoder) and a NONREQUIRED case that relates to it (Employment Division v. Smith), both about the First Amendment\'s Free Exercise Clause but reaching different results through different reasoning. Four parts, each worth 1 point, graded independently.',
        'PART (A) — IDENTIFY THE SHARED CONCEPT (0-1 point): full credit requires correctly naming the First Amendment\'s Free Exercise Clause — the concept common to both cases\' central legal question — not a vaguer reference to "religious freedom" with no reference to the specific constitutional clause.',
        'PART (B) — EXPLAIN THE REQUIRED CASE\'S FACTS -> HOLDING (0-1 point): full credit requires explaining HOW Yoder\'s specific facts (the Amish families\' sincere, long-standing religious objection to formal schooling past the 8th grade, and their demonstrated alternative vocational-training practice) led logically to its specific holding (Wisconsin\'s interest in two more years of compulsory schooling did not outweigh the substantial burden on the families\' free-exercise rights) — cause and effect, not just facts and holding restated side by side.',
        'PART (C) — EXPLAIN HOW THE REASONING DIFFERS (0-1 point): the hardest part of this format. Full credit requires explaining WHY the two cases used different reasoning — Yoder weighed (balanced) the state\'s interest in compulsory schooling against the specific, substantial burden on a sincere religious practice, while Smith did NOT apply that kind of balancing test at all: it held that a NEUTRAL, GENERALLY APPLICABLE law (Oregon\'s peyote ban, which applies to everyone regardless of religion) does not need to satisfy any compelling-interest or balancing standard just because it incidentally burdens a religious practice.',
        'PART (D) — EXPLAIN THE NONREQUIRED CASE\'S EFFECT (0-1 point): full credit requires explaining how Smith\'s holding affects religious groups broadly — that it narrows free-exercise protection by making it much harder for a religious group to win an exemption from a neutral, generally applicable law that burdens its practices, since the group can no longer rely on Yoder-style balancing or a compelling-interest requirement and must instead seek a legislative exemption or show the law is not actually neutral/generally applicable.',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: attributing one case\'s reasoning to the other in part (C) — for instance, describing Smith as if it required the state to show a compelling interest the way Yoder\'s balancing approach implicitly does, or describing Yoder as if it applied Smith\'s neutral-law rule.',
        'Total = 4 points, one per part, each graded independently — the authentic AP Gov SCOTUS Comparison scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-scotus-comparison-frq',
      kind: 'try_yourself',
      problem:
        'Read the descriptions of the following two Supreme Court cases, then answer parts (A), (B), (C), and (D).\n\nWisconsin v. Yoder (1972) — REQUIRED CASE: Wisconsin law required all children to attend school, public or private, until age 16. Several Amish families refused to send their children to formal school beyond the 8th grade (around age 14-15), arguing that additional formal schooling conflicted with their sincere, long-standing religious beliefs and community way of life, and that their children instead received practical, vocational training within the Amish community after that point. The State prosecuted the parents for violating the compulsory-attendance law. The Supreme Court held that Wisconsin\'s interest in requiring two more years of formal schooling did not outweigh the substantial burden the requirement placed on the Amish families\' free exercise of religion, given the sincerity and duration of their religious objection and the adequacy of the alternative, informal education their children received; the State could not force the additional years of attendance.\n\nEmployment Division v. Smith (1990) — NONREQUIRED CASE: two drug and alcohol counselors in Oregon, both members of the Native American Church, ingested peyote — a hallucinogenic substance banned under Oregon\'s controlled-substances law for everyone, without a religious exemption — as part of a religious ceremony. They were fired for this conduct and then denied Oregon unemployment benefits because their firing was for work-related "misconduct." They sued, arguing the denial of benefits violated their free-exercise rights. The Supreme Court held that a neutral law of general applicability — one that does not target religion and applies to everyone regardless of belief — does not violate the Free Exercise Clause merely because it incidentally burdens a particular religious practice, and the government need not show a compelling interest to justify that incidental burden.\n\n(A) Identify the constitutional clause common to both Wisconsin v. Yoder (1972) and Employment Division v. Smith (1990).\n(B) Explain how the facts of Yoder led to its holding.\n(C) Explain how the reasoning in Smith differs from the reasoning in Yoder.\n(D) Explain how the holding in Smith affects religious groups whose beliefs conflict with state law.',
      responseFormat: 'frq',
      expectedAnswer:
        "(A) The First Amendment's Free Exercise Clause is common to both cases, since each turns on whether and when the government may enforce a law that burdens a person's religious practice. (B) In Yoder, Amish families had a sincere, long-standing religious objection to formal schooling beyond the 8th grade and had an established, adequate alternative — informal, community-based vocational training; because Wisconsin's interest in two additional years of compulsory schooling was outweighed by the substantial burden this specific, sincere religious practice would suffer, the Court held the State could not force the Amish families to comply with the compulsory-attendance law past the 8th grade. (C) Yoder's reasoning weighs (balances) the government's interest in its regulation against the substantial burden that regulation places on a specific, sincere religious practice — finding here that the burden on the Amish outweighed Wisconsin's interest. Smith's reasoning does not apply that kind of balancing test at all: the Court instead held that a neutral, generally applicable law — Oregon's peyote ban, which applies to everyone regardless of religion — does not violate the Free Exercise Clause just because it incidentally burdens a religious practice, and the government does not need to show a compelling interest to justify that incidental burden. So unlike Yoder's case-specific weighing of burden against interest, Smith's reasoning turns on whether the law itself is neutral and generally applicable, not on how heavily it burdens the particular religious practice. (D) By allowing neutral, generally applicable laws to burden religious practice without a compelling-interest showing, Smith narrows the free-exercise protection Yoder's balancing approach might otherwise have offered: religious groups whose sincere practices conflict with a neutral, generally applicable state law can no longer rely on courts to weigh the burden on their religion against the state's interest the way Yoder did, and must instead seek a legislative exemption from the law or show that the law is not actually neutral or generally applicable (for example, that it specifically targets a religious practice) in order to receive judicial protection.",
      rubric: {
        parts: [
          {
            criterionId: 'A-identify-clause',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly identifies the First Amendment\'s Free Exercise Clause as the concept common to both cases. No credit (0/1) for a vaguer or incorrect concept (e.g., "religious freedom" with no reference to the specific clause, or a different amendment/clause).',
            modelResponse:
              "The First Amendment's Free Exercise Clause is common to both cases, since each turns on whether and when the government may enforce a law that burdens a person's religious practice.",
          },
          {
            criterionId: 'B-required-case-reasoning',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains HOW Yoder\'s facts (sincere, long-standing Amish religious objection; adequate alternative vocational training) led to the holding that Wisconsin\'s interest in two more years of compulsory schooling did not outweigh the substantial burden on free exercise — cause and effect, not just restated facts. No credit (0/1) for stating the facts or holding alone with no connecting reasoning, or for misstating the holding.',
            modelResponse:
              "Amish families had a sincere, long-standing religious objection to formal schooling beyond the 8th grade and an established, adequate alternative — informal, community-based vocational training; because Wisconsin's interest in two additional years of compulsory schooling was outweighed by the substantial burden on this specific, sincere religious practice, the Court held the State could not force compliance with the compulsory-attendance law past the 8th grade.",
          },
          {
            criterionId: 'C-compare-reasoning',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1/1): explains the reasoning gap between the two cases — Yoder weighs the government's interest against the burden on a specific, sincere religious practice, while Smith applied no such balancing test, instead resting on whether the law is neutral and generally applicable. No credit (0/1) for only stating that the two cases reached different results without explaining why the reasoning differed, or for attributing one case's reasoning to the other.",
            modelResponse:
              "Yoder's reasoning weighs the government's interest in its regulation against the substantial burden that regulation places on a specific, sincere religious practice. Smith's reasoning does not apply that kind of balancing test at all: it holds that a neutral, generally applicable law does not violate the Free Exercise Clause just because it incidentally burdens a religious practice, with no compelling-interest showing required — so unlike Yoder's case-specific weighing, Smith's reasoning turns on whether the law itself is neutral and generally applicable.",
          },
          {
            criterionId: 'D-explain-effect',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1/1): explains how Smith's holding affects religious groups — that it narrows free-exercise protection by making it much harder to win an exemption from a neutral, generally applicable law, since the group can no longer rely on Yoder-style balancing and must instead seek a legislative exemption or show the law is not actually neutral/generally applicable. No credit (0/1) for restating the holding with no explanation of its effect on religious groups generally.",
            modelResponse:
              "By allowing neutral, generally applicable laws to burden religious practice without a compelling-interest showing, Smith narrows the protection Yoder's balancing approach might otherwise have offered: religious groups whose sincere practices conflict with a neutral, generally applicable state law can no longer rely on courts to balance the burden against the state's interest, and must instead seek a legislative exemption or show the law specifically targets religion to receive judicial protection.",
          },
        ],
      },
      hints: [
        'Part (A) wants ONE named clause (the Free Exercise Clause), not a vague reference to "religious freedom."',
        'Part (C) is the hardest part: explain WHY the reasoning differs (balancing burden-vs-interest in Yoder, versus a neutral/generally-applicable-law rule in Smith), not just that the outcomes differ.',
        "Don't let Yoder's case-specific balancing and Smith's neutral-law rule blur together — keep a clean line between which case uses which approach.",
      ],
      estimatedMinutes: 13,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SCOTUS Comparison is 4 points, one per part, each graded independently — a required case (Yoder, borrowed into Unit 4 since Unit 4 has no required case of its own) plus a related nonrequired case (Smith), no separate document.',
        'Wisconsin v. Yoder (1972): the Court weighed Wisconsin\'s interest in compulsory schooling against the substantial burden on the Amish families\' sincere free-exercise rights, and held the burden outweighed the state\'s interest past the 8th grade.',
        'Employment Division v. Smith (1990): a neutral, generally applicable law (Oregon\'s peyote ban) does not violate the Free Exercise Clause even if it incidentally burdens a religious practice, and requires no compelling-interest showing — no Yoder-style balancing test applies.',
        "Part (C) is the format's hardest part: explain WHY the reasoning differs (case-specific balancing vs. a neutral-law rule), not just that the results differ.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4-FRQ-SCOTUS',
    cedTitle: 'Unit 4 FRQ Practice — SCOTUS Comparison',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics SCOTUS Comparison free-response task wording and 4-point rubric (1 point per lettered part). Case descriptions (Wisconsin v. Yoder, 1972; Employment Division v. Smith, 1990) are inline prompt text, not a seeded passage. Yoder is borrowed from Unit 3\'s civil-liberties material because Unit 4 has no required case of its own — a documented, spec-sanctioned deviation.',
      },
    ],
  },
};
