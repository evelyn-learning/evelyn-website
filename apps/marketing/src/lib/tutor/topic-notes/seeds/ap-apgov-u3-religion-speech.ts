/**
 * AP US Government & Politics — CED Unit 3.1-3.4: The First Amendment —
 * Religion and Speech.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.religion-speech-liberties.v1`. Covers the Establishment
 * Clause (Engel v. Vitale, 1962), the Free Exercise Clause (Wisconsin v.
 * Yoder, 1972), the speech-doctrine evolution from Schenck v. United
 * States (1919, "clear and present danger," since narrowed by Brandenburg
 * v. Ohio 1969) to Tinker v. Des Moines (1969, substantial-disruption
 * standard for student speech), and protected vs. unprotected speech
 * categories.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_RELIGION_SPEECH: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.religion-speech-liberties.v1',
  course: 'AP US Government & Politics',
  cedUnit: 3,
  cedTopic: '3.1-3.4',
  cedTitle: 'First Amendment: Religion & Speech',
  planId: 'evelyn.ap.apgov.religion-speech-liberties.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.religion-speech-liberties.v1' }],
  theory: [
    {
      loId: 'apgov.religion-speech-liberties',
      kind: 'definition',
      title: 'Establishment Clause',
      content:
        'First Amendment provision ("Congress shall make no law respecting an establishment of religion") barring GOVERNMENT from promoting or favoring religion. Basis for striking down school-sponsored prayer in Engel v. Vitale (1962).',
    },
    {
      loId: 'apgov.religion-speech-liberties',
      kind: 'definition',
      title: 'Free Exercise Clause',
      content:
        'First Amendment provision ("...or prohibiting the free exercise thereof") barring government from BURDENING an individual\'s religious practice. Basis for the Amish exemption in Wisconsin v. Yoder (1972). Note the two clauses can point in opposite directions: accommodating one person\'s free exercise can look, to someone else, like establishing religion.',
    },
    {
      loId: 'apgov.religion-speech-liberties',
      kind: 'event',
      title: 'Engel v. Vitale (1962) — Establishment Clause',
      content:
        "New York's Board of Regents composed a short, nondenominational prayer for public school students to recite each morning. The Supreme Court held this violated the Establishment Clause: it is not the business of government to compose official prayers for students to recite, even if the prayer is nondenominational, voluntary, and students may remain silent. Government-SPONSORED prayer in public schools is unconstitutional regardless of how mild or voluntary it appears.",
    },
    {
      loId: 'apgov.religion-speech-liberties',
      kind: 'event',
      title: 'Wisconsin v. Yoder (1972) — Free Exercise Clause',
      content:
        "Wisconsin required school attendance until age 16. Amish parents refused to send their children to school past 8th grade, citing conflict with their religious way of life. The Supreme Court held the compulsory-attendance law, as applied to the Amish, violated the Free Exercise Clause — the state's interest in universal education did not outweigh the families' sincere religious objection. Carved out a religion-based EXEMPTION from an otherwise neutral, generally applicable law.",
    },
    {
      loId: 'apgov.religion-speech-liberties',
      kind: 'event',
      title: 'Schenck v. United States (1919) — "clear and present danger" (narrowed)',
      content:
        'Schenck was convicted under the Espionage Act for distributing leaflets urging resistance to the WWI draft. Justice Holmes upheld the conviction, articulating the "CLEAR AND PRESENT DANGER" test: speech can be restricted when it creates a clear and present danger of substantive evils Congress may prevent. This test has since been NARROWED by later cases, most significantly Brandenburg v. Ohio (1969), which requires speech to be directed to and likely to incite IMMINENT lawless action. Schenck\'s language is a historical starting point, not the speech test courts apply today.',
    },
    {
      loId: 'apgov.religion-speech-liberties',
      kind: 'event',
      title: 'Tinker v. Des Moines (1969) — substantial-disruption standard',
      content:
        'Public school students wore black armbands to protest the Vietnam War; the school suspended them. The Supreme Court held students do not "shed their constitutional rights to freedom of speech or expression at the schoolhouse gate." Schools may restrict student expression only if it would "materially and substantially interfere with the requirements of appropriate discipline" — "undifferentiated fear or apprehension of disturbance" is not enough. This SUBSTANTIAL-DISRUPTION standard, a separate school-specific doctrine, governs student speech, not Schenck\'s clear-and-present-danger language.',
    },
    {
      loId: 'apgov.religion-speech-liberties',
      kind: 'definition',
      title: 'symbolic speech',
      content:
        'Non-verbal conduct intended to convey a particular message (e.g. wearing an armband in protest), protected as a form of speech under the First Amendment — the category at issue in Tinker v. Des Moines.',
    },
    {
      loId: 'apgov.religion-speech-liberties',
      kind: 'concept',
      title: 'protected vs. unprotected speech categories',
      content:
        'Most speech, including unpopular political speech, is PROTECTED and cannot be restricted based on viewpoint or content alone. Narrow categories are UNPROTECTED (or receive much less protection): obscenity, defamation (libel/slander), "true threats," and incitement meeting the Brandenburg imminent-lawless-action standard. Symbolic speech (Tinker) and most political speech (subject to the substantial-disruption limit in schools) are PROTECTED.',
    },
    {
      loId: 'apgov.religion-speech-liberties',
      kind: 'concept',
      title: 'the First Amendment restrains government only',
      content:
        'A recurring point of confusion: the First Amendment restricts GOVERNMENT action, not private actors. A private employer disciplining an employee for speech, or a private school restricting student speech, raises no First Amendment claim, because there is no government action involved.',
    },
    {
      loId: 'apgov.religion-speech-liberties',
      kind: 'trap',
      title: "Schenck's test is not today's test",
      content:
        'Assuming a famous, frequently cited case must still state current law is the most common error here. Schenck\'s "clear and present danger" test (1919) was narrowed by Brandenburg v. Ohio (1969, decided the same year as Tinker). Separately, Tinker\'s substantial-disruption standard is an independent doctrine for the school setting, not a version of the Schenck test.',
    },
  ],
  methods: [
    {
      title: 'Classify a religion-clause fact pattern: Establishment or Free Exercise?',
      when_to_use:
        'Use this whenever a prompt describes a government action touching religion and asks which clause and case applies.',
      steps: [
        'ASK WHO IS ACTING ON WHOM. If the GOVERNMENT is promoting, sponsoring, or organizing a religious practice, this is an ESTABLISHMENT CLAUSE issue (Engel v. Vitale).',
        'IF A LAW OR POLICY BURDENS an individual\'s or group\'s own religious practice, this is a FREE EXERCISE CLAUSE issue (Wisconsin v. Yoder).',
        'STATE THE HOLDING PRECISELY before applying it — Engel struck down government-sponsored prayer regardless of voluntariness; Yoder carved out an exemption from a neutral law because of a sincere religious burden.',
        'CHECK FOR THE OPPOSITE-DIRECTION TRAP: accommodating one party\'s free exercise can be challenged by someone else as an establishment problem — note this tension explicitly if the prompt raises it.',
      ],
      example: {
        problem: 'A public school allows a moment of silence each morning, during which a teacher-led prayer is read aloud over the intercom. Which clause governs, and how would the case likely come out?',
        solution:
          'This is an Establishment Clause issue, governed by Engel v. Vitale (1962): a teacher-led, school-organized prayer is government-sponsored, so it is very likely unconstitutional even if participation is described as voluntary — voluntariness does not cure a government-sponsored religious exercise.',
      },
      relatedLoIds: ['apgov.religion-speech-liberties'],
    },
    {
      title: 'Apply the correct speech standard: Schenck/Brandenburg vs. Tinker',
      when_to_use:
        'Use this whenever a prompt asks whether speech can be restricted, especially in a school setting.',
      steps: [
        'IDENTIFY THE SETTING. If the speech is in a public school and the speaker is a student, apply TINKER\'s substantial-disruption standard, not Schenck.',
        'IF THE SETTING IS GENERAL (not school-specific), the modern standard is Brandenburg v. Ohio\'s imminent-lawless-action test, NOT Schenck\'s original clear-and-present-danger language.',
        'FOR A SCHOOL CASE, ask whether the record shows a concrete, evidence-based showing of material and substantial interference — a vague, generalized worry ("undifferentiated fear") is insufficient under Tinker.',
        'DO NOT TREAT THE TWO TESTS AS STAGES OF ONE ANALYSIS — they are separate doctrines for separate contexts.',
      ],
      relatedLoIds: ['apgov.religion-speech-liberties'],
    },
  ],
  pointers: [
    { content: 'Schenck\'s "clear and present danger" test (1919) is NOT the modern speech standard — it was narrowed by Brandenburg v. Ohio (1969). Citing Schenck as if it still controlled is the #1 tested misconception here.', kind: 'trap' },
    { content: 'Establishment Clause = government promoting religion (Engel v. Vitale). Free Exercise Clause = government burdening individual religious practice (Wisconsin v. Yoder). Don\'t conflate the two.', kind: 'trap' },
    { content: 'Tinker\'s substantial-disruption standard is a separate, school-specific doctrine — not a stricter or looser version of Schenck/Brandenburg.', kind: 'tip' },
    { content: '"Undifferentiated fear or apprehension of disturbance" is explicitly insufficient under Tinker — a school needs a concrete showing of material and substantial interference.', kind: 'tip' },
    { content: 'The First Amendment restrains government action only — private employers and private schools raise no First Amendment claim.', kind: 'tip' },
  ],
};
