/**
 * AP US Government & Politics — Unit 3 FRQ Practice: SCOTUS Comparison
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
 * holding affects student-speech rights.
 *
 * Required case: Tinker v. Des Moines (1969) — public school students wore
 * black armbands to protest the Vietnam War and were suspended; the Court
 * held students do not "shed their constitutional rights... at the
 * schoolhouse gate," and schools may restrict student expression only if
 * it would materially and substantially interfere with school discipline.
 * Nonrequired case: Morse v. Frederick (2007) — a student displayed a
 * banner reading "BONG HiTS 4 JESUS" at a school-supervised event (students
 * were released to watch the Olympic Torch Relay under teacher
 * supervision); the Court held schools may restrict student speech
 * reasonably viewed as promoting illegal drug use, without needing to show
 * Tinker-style substantial disruption. NO passageId/passageIds: per spec,
 * both case descriptions live inline in the try_yourself prompt as text.
 * Constitutional accuracy of both case summaries is a review gate on this
 * plan. The registered evelyn.passage.apgov-tinker-opinion.v1 excerpt
 * exists (used in ap-apgov-u3-religion-speech.ts) but is not wired here,
 * matching the U1/U2 inline-description convention for this format.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U3_FRQ_SCOTUS_COMPARISON: LessonPlan = {
  id: 'evelyn.ap.apgov.u3-frq-scotus-comparison.v1',
  title: 'Unit 3 FRQ Practice — SCOTUS Comparison',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u3-frq-scotus-comparison',
      description:
        'Answer a complete AP Gov SCOTUS Comparison free-response question comparing the required case Tinker v. Des Moines (1969) to the nonrequired case Morse v. Frederick (2007) — identifying the shared First Amendment student-speech concept, explaining how the required case\'s facts produced its holding, explaining how the two cases\' reasoning differs, and explaining how the nonrequired case\'s holding affects student-speech rights in public schools — scored against the authentic AP Gov 4-point SCOTUS Comparison rubric (1 point per part).',
      standard: 'AP-APGOV-3-FRQ-SCOTUS',
    },
  ],
  prerequisites: ['apgov.religion-speech-liberties'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of comparing a required case to a related nonrequired case concrete, and name the format\'s biggest trap: describing one case\'s reasoning as if it belonged to the other.',
      script:
        "One of the four AP Gov free-response questions gives you two Supreme Court cases — always one of the nine required cases, plus a related case you can reason about from its facts — worth 4 points. This time the shared thread is student speech in public schools: whether and when a school may restrict what a student says or displays. You already know Tinker v. Des Moines, the required case that protects student expression unless it would substantially disrupt school operations. Today you'll compare it to Morse v. Frederick, a case about a DIFFERENT kind of student speech — a banner referencing illegal drug use at a school-supervised event — where the Court restricted speech WITHOUT requiring proof of disruption at all. Getting this FRQ right means never letting the two cases' reasoning blur together.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-scotus-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SCOTUS Comparison FRQ asks for and how the 4-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get the facts, constitutional issue, and holding of two cases — a REQUIRED case (Tinker v. Des Moines) and a NONREQUIRED case that relates to it (Morse v. Frederick), both about the First Amendment and student speech but reaching different results. Four parts, each worth 1 point, graded independently.',
        'PART (A) — IDENTIFY THE SHARED CONCEPT (0-1 point): full credit requires correctly naming the First Amendment right to freedom of speech as applied to public school students — the concept common to both cases\' central legal question — not a vaguer reference to "student rights" generally.',
        'PART (B) — EXPLAIN THE REQUIRED CASE\'S FACTS -> HOLDING (0-1 point): full credit requires explaining HOW Tinker\'s specific facts (students silently wore armbands protesting the Vietnam War; no disruption occurred) led logically to its specific holding (students retain free-speech rights at school; schools may restrict expression only upon a showing of material and substantial disruption) — cause and effect, not just facts and holding restated side by side.',
        'PART (C) — EXPLAIN HOW THE REASONING DIFFERS (0-1 point): the hardest part of this format. Full credit requires explaining WHY the two cases used different reasoning — Tinker requires schools to show an actual or reasonably forecasted substantial disruption before restricting speech, while Morse did NOT apply that disruption test at all, instead creating a separate, content-based exception: schools may restrict speech reasonably interpreted as promoting illegal drug use because of the school\'s recognized interest in deterring student drug use, regardless of disruption.',
        'PART (D) — EXPLAIN THE NONREQUIRED CASE\'S EFFECT (0-1 point): full credit requires explaining how Morse\'s holding affects student-speech rights broadly — that it narrows Tinker\'s protection by giving schools an additional, easier-to-satisfy basis for restricting a specific category of student speech (messages reasonably viewed as promoting illegal drug use) without any disruption showing — not just restating the holding itself.',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: attributing one case\'s reasoning to the other in part (C) — for instance, describing Morse\'s content-based drug-use exception as if it required a Tinker-style disruption showing, or vice versa.',
        'Total = 4 points, one per part, each graded independently — the authentic AP Gov SCOTUS Comparison scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-scotus-comparison-frq',
      kind: 'try_yourself',
      problem:
        'Read the descriptions of the following two Supreme Court cases, then answer parts (A), (B), (C), and (D).\n\nTinker v. Des Moines (1969) — REQUIRED CASE: a group of public school students wore black armbands to school to silently protest the Vietnam War. School officials, anticipating disturbance, suspended the students. The students sued, arguing the suspension violated their First Amendment rights. The Supreme Court agreed: it held that students do not "shed their constitutional rights to freedom of speech or expression at the schoolhouse gate," and that a school may restrict student expression only if school officials can reasonably forecast that it would "materially and substantially interfere with the requirements of appropriate discipline in the operation of the school" — mere "undifferentiated fear or apprehension of disturbance" is not enough. Because the armbands were silent and passive and caused no actual disruption, the suspension violated the students\' free-speech rights.\n\nMorse v. Frederick (2007) — NONREQUIRED CASE: during a school-supervised event — students were released from class, under teacher supervision, to watch the Olympic Torch Relay pass by on a public street across from their high school — a student unfurled a large banner reading "BONG HiTS 4 JESUS," a phrase the principal reasonably interpreted as promoting illegal drug use. The principal confiscated the banner and suspended the student. The Supreme Court held that schools may restrict student speech, at a school-supervised event, when that speech is reasonably viewed as promoting illegal drug use, given the school\'s important interest in deterring drug use among students — the Court did not require the school to show that the banner caused or threatened any substantial disruption to school operations.\n\n(A) Identify the constitutional provision common to both Tinker v. Des Moines (1969) and Morse v. Frederick (2007).\n(B) Explain how the facts of Tinker led to its holding.\n(C) Explain how the reasoning in Morse differs from the reasoning in Tinker.\n(D) Explain how the holding in Morse affects student-speech rights in public schools.',
      responseFormat: 'frq',
      expectedAnswer:
        "(A) The First Amendment's protection of freedom of speech, as applied to public school students, is common to both cases, since each turns on whether and when a public school may restrict a student's expression. (B) In Tinker, students silently wore armbands protesting the Vietnam War, causing no actual disturbance; because the school could point to nothing beyond an undifferentiated fear of disruption, and the expression was passive and non-disruptive, the Court held that students retain free-speech rights at school and that schools may restrict expression only upon a showing that it would materially and substantially interfere with school discipline — a showing the school could not make here, so the suspension was unconstitutional. (C) Tinker's reasoning requires school officials to show an actual or reasonably forecasted material and substantial disruption before restricting student speech — a disruption-based test. Morse's reasoning does not apply that disruption test at all: the Court instead created a separate, content-based exception, holding that a school may restrict a message reasonably viewed as promoting illegal drug use because of the school's recognized interest in deterring student drug use, with no need to show or forecast any disruption to school operations — so unlike Tinker's focus on disruption, Morse's reasoning turns on the message's specific content and the school's drug-deterrence interest. (D) By allowing schools to restrict a category of student speech without any disruption showing, Morse narrows the protection Tinker established: schools now have an additional, easier-to-satisfy basis for restricting student expression — messages reasonably viewed as promoting illegal drug use at school-supervised events — meaning Tinker's substantial-disruption standard is no longer the only test schools must satisfy to restrict student speech.",
      rubric: {
        parts: [
          {
            criterionId: 'A-identify-provision',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly identifies the First Amendment\'s protection of freedom of speech, as applied to public school students, as the concept common to both cases. No credit (0/1) for a vaguer or incorrect concept (e.g., "student rights" with no reference to speech, or a different amendment).',
            modelResponse:
              "The First Amendment's protection of freedom of speech, as applied to public school students, is common to both cases, since each turns on whether and when a public school may restrict a student's expression.",
          },
          {
            criterionId: 'B-required-case-reasoning',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains HOW Tinker\'s facts (silent, non-disruptive armband protest; no actual disturbance) led to the holding that schools may restrict student expression only upon a showing of material and substantial disruption — cause and effect, not just restated facts. No credit (0/1) for stating the facts or holding alone with no connecting reasoning, or for misstating the holding.',
            modelResponse:
              "Students silently wore armbands protesting the Vietnam War, causing no actual disturbance; because the school could point to nothing beyond an undifferentiated fear of disruption, and the expression was passive and non-disruptive, the Court held that schools may restrict student expression only upon a showing that it would materially and substantially interfere with school discipline — a showing the school could not make here, so the suspension was unconstitutional.",
          },
          {
            criterionId: 'C-compare-reasoning',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1/1): explains the reasoning gap between the two cases — Tinker requires a showing of actual or reasonably forecasted substantial disruption, while Morse applied no disruption test at all, instead resting on a content-based drug-use exception tied to the school's deterrence interest. No credit (0/1) for only stating that the two cases reached different results without explaining why the reasoning differed, or for attributing one case's reasoning to the other.",
            modelResponse:
              "Tinker's reasoning requires school officials to show an actual or reasonably forecasted material and substantial disruption before restricting student speech. Morse's reasoning does not apply that disruption test at all: the Court instead created a separate, content-based exception, holding that a school may restrict a message reasonably viewed as promoting illegal drug use because of its recognized interest in deterring student drug use, with no need to show or forecast any disruption — so unlike Tinker's focus on disruption, Morse's reasoning turns on the message's content and the school's drug-deterrence interest.",
          },
          {
            criterionId: 'D-explain-effect',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1/1): explains how Morse's holding affects student-speech rights — that it narrows Tinker's protection by giving schools an additional, easier-to-satisfy basis (a content-based drug-use exception requiring no disruption showing) for restricting student expression. No credit (0/1) for restating the holding with no explanation of its effect on student-speech rights generally.",
            modelResponse:
              "By allowing schools to restrict a category of student speech without any disruption showing, Morse narrows the protection Tinker established: schools now have an additional, easier-to-satisfy basis for restricting student expression — messages reasonably viewed as promoting illegal drug use at school-supervised events — meaning Tinker's substantial-disruption standard is no longer the only test schools must satisfy to restrict student speech.",
          },
        ],
      },
      hints: [
        'Part (A) wants ONE named provision (the First Amendment\'s free-speech guarantee as applied to students), not a vague reference to "student rights."',
        'Part (C) is the hardest part: explain WHY the reasoning differs (a disruption showing in Tinker vs. a content-based drug-use exception in Morse), not just that the outcomes differ.',
        "Don't let Tinker's disruption-based reasoning and Morse's content-based reasoning blur together — keep a clean line between which case requires which showing.",
      ],
      estimatedMinutes: 13,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SCOTUS Comparison is 4 points, one per part, each graded independently — a required case (Tinker) plus a related nonrequired case (Morse), no separate document.',
        'Tinker v. Des Moines (1969): schools may restrict student expression only upon a showing of material and substantial disruption — mere apprehension of disturbance is not enough.',
        'Morse v. Frederick (2007): schools may restrict student speech reasonably viewed as promoting illegal drug use, with NO disruption showing required — a content-based exception, not an application of Tinker\'s disruption test.',
        "Part (C) is the format's hardest part: explain WHY the reasoning differs (disruption-based vs. content-based), not just that the results differ.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3-FRQ-SCOTUS',
    cedTitle: 'Unit 3 FRQ Practice — SCOTUS Comparison',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics SCOTUS Comparison free-response task wording and 4-point rubric (1 point per lettered part). Case descriptions (Tinker v. Des Moines, 1969; Morse v. Frederick, 2007) are inline prompt text, not a seeded passage.',
      },
    ],
  },
};
