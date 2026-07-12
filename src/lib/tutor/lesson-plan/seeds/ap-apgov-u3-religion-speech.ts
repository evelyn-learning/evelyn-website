/**
 * AP US Government & Politics — CED Unit 3.1-3.4: The First Amendment —
 * Religion and Speech.
 *
 * Unit-3 content plan (follows the Unit-1/Unit-2 calibration template — see
 * ap-apgov-u1-federalism.ts for the shared Passage/rubric infra this plan
 * reuses, and ap-apgov-u2-judiciary.ts for the document-wired worked-example
 * pattern). First stop in Unit 3's civil-liberties walk.
 *
 * Covers the Establishment Clause (Engel v. Vitale, 1962 — school-sponsored
 * prayer unconstitutional) and the Free Exercise Clause (Wisconsin v. Yoder,
 * 1972 — Amish exemption from compulsory schooling past 8th grade); speech
 * doctrine from Schenck v. United States (1919, "clear and present danger,"
 * explicitly noted as since narrowed) to Tinker v. Des Moines (1969,
 * symbolic student speech, substantial-disruption standard); and the
 * protected-vs-unprotected speech-category distinction.
 *
 * DOCUMENT STIMULUS: the anchor is evelyn.passage.apgov-tinker-opinion.v1
 * (seeded in Task 6). Per that passage's own docblock, the excerpt covers
 * only: (1) the "schoolhouse gate" sentence, (2) the "undifferentiated fear
 * or apprehension of disturbance is not enough" holding, and (3) the
 * "materially and substantially interfere with the requirements of
 * appropriate discipline" standard (quoting Burnside v. Byars). The worked
 * example below quotes and analyzes only that language.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U3_RELIGION_SPEECH: LessonPlan = {
  id: 'evelyn.ap.apgov.religion-speech-liberties.v1',
  title: 'U3.1-3.4 First Amendment: Religion & Speech',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.religion-speech-liberties',
      description:
        "Explain the First Amendment's Establishment Clause (Engel v. Vitale, 1962) and Free Exercise Clause (Wisconsin v. Yoder, 1972); the evolution of free-speech doctrine from Schenck v. United States (1919) to Tinker v. Des Moines (1969); and the distinction between protected and unprotected categories of speech.",
      standard: 'AP-APGOV-3.1/3.2/3.3/3.4',
    },
  ],
  prerequisites: ['apgov.federalism-foundations'],
  followUps: ['apgov.press-assembly-arms'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the First Amendment\'s religion and speech clauses not as a single blanket "freedom" but as several distinct doctrines, each with its own test and its own history of the Supreme Court moving the line.',
      script:
        'Units 1 and 2 covered how power is divided and how the three branches check each other. Unit 3 turns to a different question: what can the government NOT do to you? Start with two schools. In one, a school board leads a short prayer over the morning announcements. In another, Amish parents refuse to send their 14-year-old to high school, citing their faith. The Supreme Court struck down the first and protected the second — both are First Amendment religion cases, but they run in opposite directions, because the Establishment Clause and the Free Exercise Clause do different jobs. Then there\'s speech: in 1919 the Court said the government could jail someone for words that created a "clear and present danger." Fifty years later, the Court said public school students wearing armbands to protest a war couldn\'t be punished unless their speech would "materially and substantially disrupt" school. Same First Amendment, very different results — because the speech test itself changed. Today we build the map: which clause governs which fact pattern, and how far the speech line has actually moved.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-religion-speech-doctrine',
      kind: 'concept',
      goal: 'Explain the Establishment and Free Exercise Clauses with their anchor cases, the evolution of the speech test from Schenck to Tinker, and protected vs. unprotected speech categories.',
      keyIdeas: [
        'TWO RELIGION CLAUSES, TWO DIRECTIONS: the First Amendment\'s religion language does two different jobs. The ESTABLISHMENT CLAUSE ("Congress shall make no law respecting an establishment of religion") restricts GOVERNMENT from promoting or favoring religion. The FREE EXERCISE CLAUSE ("...or prohibiting the free exercise thereof") restricts government from BURDENING an individual\'s religious practice. They can point in opposite directions in a given case: accommodating one person\'s free exercise can look, to someone else, like the government establishing religion.',
        'ENGEL V. VITALE (1962) — ESTABLISHMENT CLAUSE: New York\'s Board of Regents composed a short, nondenominational prayer for public school students to recite each morning. The Supreme Court held this violated the Establishment Clause: it is not the business of government to compose official prayers for any group of American citizens to recite, even if the prayer is nondenominational, voluntary to recite along with the class, and students may remain silent. Government-SPONSORED prayer in public schools is unconstitutional, regardless of how mild or voluntary it appears.',
        'WISCONSIN V. YODER (1972) — FREE EXERCISE CLAUSE: Wisconsin required school attendance until age 16. Amish parents refused to send their children to school past 8th grade, arguing that further formal schooling conflicted with their religious way of life and threatened their community\'s survival. The Supreme Court held Wisconsin\'s compulsory-attendance law, as applied to the Amish, violated the Free Exercise Clause: the state\'s interest in universal education did not outweigh the Amish families\' sincere religious objection, especially given the Amish tradition\'s long, successful history of self-sufficiency. The ruling carved out a religion-based EXEMPTION from an otherwise neutral, generally applicable law.',
        'SCHENCK V. UNITED STATES (1919) — THE ORIGINAL SPEECH TEST: Charles Schenck was convicted under the Espionage Act for distributing leaflets urging resistance to the World War I draft. The Supreme Court (Justice Holmes) upheld the conviction, articulating the "CLEAR AND PRESENT DANGER" test: speech can be restricted when it creates a clear and present danger of bringing about substantive evils Congress has a right to prevent — famously illustrated by the (non-binding) example of falsely shouting fire in a crowded theater. IMPORTANT: this test has since been NARROWED by later cases (most significantly Brandenburg v. Ohio, 1969, which requires speech to be directed to and likely to incite IMMINENT lawless action before it can be restricted). Schenck\'s "clear and present danger" language is a historical starting point, not the speech test the Court applies today.',
        'TINKER V. DES MOINES (1969) — SYMBOLIC STUDENT SPEECH: public school students wore black armbands to protest the Vietnam War; the school suspended them. The Supreme Court held that students do not "shed their constitutional rights to freedom of speech or expression at the schoolhouse gate." Wearing the armbands was a form of symbolic speech, and schools may only restrict student expression if it would "materially and substantially interfere with the requirements of appropriate discipline in the operation of the school" — mere "undifferentiated fear or apprehension of disturbance" is not enough. This SUBSTANTIAL-DISRUPTION standard, not Schenck\'s clear-and-present-danger language, is the framework courts apply to student speech in schools.',
        'PROTECTED VS. UNPROTECTED CATEGORIES: most speech, including unpopular political speech, is PROTECTED and cannot be restricted based on its viewpoint or content alone. Certain narrow categories are treated as UNPROTECTED (or receive much less protection) regardless of the Schenck/Brandenburg imminent-danger analysis: obscenity, defamation (libel/slander), "true threats," and incitement meeting the Brandenburg standard. Symbolic speech (like Tinker\'s armbands) and most political speech (including inside public schools, subject to Tinker\'s substantial-disruption limit) fall on the PROTECTED side.',
        'THE FIRST AMENDMENT ONLY RESTRAINS GOVERNMENT: a recurring point of confusion — the First Amendment restricts government action, not private actors. A private employer disciplining an employee for something they said, or a private school restricting student speech, does not raise a First Amendment claim, because there is no government action involved.',
      ],
      vocabulary: [
        {
          term: 'Establishment Clause',
          definition:
            'First Amendment provision barring government from establishing, promoting, or favoring a religion — the basis for striking down school-sponsored prayer in Engel v. Vitale (1962).',
        },
        {
          term: 'Free Exercise Clause',
          definition:
            "First Amendment provision barring government from prohibiting or unduly burdening an individual's religious practice — the basis for the Amish exemption in Wisconsin v. Yoder (1972).",
        },
        {
          term: 'clear and present danger test',
          definition:
            'the speech-restriction standard from Schenck v. United States (1919): speech may be restricted if it creates a clear and present danger of substantive evils Congress may prevent. Since narrowed by later cases, notably Brandenburg v. Ohio (1969).',
        },
        {
          term: 'substantial disruption standard',
          definition:
            "the standard from Tinker v. Des Moines (1969): public schools may restrict student expression only if it would materially and substantially interfere with school discipline — undifferentiated fear of disturbance is not enough.",
        },
        {
          term: 'symbolic speech',
          definition:
            'non-verbal conduct intended to convey a particular message (e.g. wearing an armband in protest), protected as a form of speech under the First Amendment.',
        },
      ],
      passageId: 'evelyn.passage.apgov-tinker-opinion.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-tinker-substantial-disruption',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from the Supreme Court\'s opinion in Tinker v. Des Moines Independent Community School District, 393 U.S. 503 (1969), delivered by Justice Abe Fortas: "It can hardly be argued that either students or teachers shed their constitutional rights to freedom of speech or expression at the schoolhouse gate. ... [I]n our system, undifferentiated fear or apprehension of disturbance is not enough to overcome the right to freedom of expression. ... Certainly where there is no finding and no showing that engaging in the forbidden conduct would \'materially and substantially interfere with the requirements of appropriate discipline in the operation of the school,\' the prohibition cannot be sustained." (a) What right does the "schoolhouse gate" sentence establish for students? (b) What standard does the Court reject as insufficient to justify restricting student speech, and what standard does it require instead? (c) How does this standard differ from the Schenck "clear and present danger" test covered earlier in this lesson?',
      steps: [
        'SOURCE IT. Justice Fortas\'s opinion of the Court in Tinker v. Des Moines (1969), the required AP Gov case on symbolic student speech.',
        '"SCHOOLHOUSE GATE" — THE BASELINE RIGHT. The opinion states students do not "shed their constitutional rights to freedom of speech or expression at the schoolhouse gate." This establishes that First Amendment protection follows students INTO public schools; schools are not a First-Amendment-free zone simply because the speaker is a minor and the setting is educational.',
        'WHAT THE COURT REJECTS. The opinion explicitly rejects "undifferentiated fear or apprehension of disturbance" as a sufficient justification for restricting student expression — a school cannot suppress speech merely because officials are generally worried it MIGHT cause problems, with no concrete basis for that worry.',
        'WHAT THE COURT REQUIRES INSTEAD. The excerpt requires a showing that the conduct would "materially and substantially interfere with the requirements of appropriate discipline in the operation of the school" — a concrete, evidence-based standard, not a vague fear. This is the SUBSTANTIAL DISRUPTION standard.',
        'CONTRAST WITH SCHENCK. Schenck\'s "clear and present danger" test (1919) asked whether speech created a danger of substantive evils Congress could prevent — a general national-security-era standard for speech generally, later narrowed by Brandenburg\'s imminent-lawless-action requirement. Tinker\'s substantial-disruption standard is a DIFFERENT, narrower doctrinal test specific to the school setting: it asks about disruption to school operations and discipline, not danger to the public generally. A test can satisfy one standard without engaging the other at all — they are not stages of the same test, they are separate doctrines for separate contexts.',
      ],
      answer:
        'The "schoolhouse gate" sentence establishes that students retain their First Amendment free-speech and expression rights inside public schools — the right does not stop at the door. The Court rejects "undifferentiated fear or apprehension of disturbance" as a justification for restricting student speech, and instead requires a concrete showing that the speech would "materially and substantially interfere with the requirements of appropriate discipline in the operation of the school" — the substantial disruption standard. This differs from Schenck\'s "clear and present danger" test: Schenck asked whether speech generally created a danger of substantive evils, a standard later narrowed by Brandenburg v. Ohio\'s imminent-lawless-action requirement, while Tinker\'s substantial-disruption standard is a separate, school-specific doctrine focused on disruption to school operations, not a stricter or looser version of the same national-security-era test.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. A public school board opens each school day with a brief, voluntary prayer read over the intercom by a student volunteer. Separately, in the same district, a small group of students silently wear black ribbons to protest a proposed school policy; administrators ban the ribbons, citing a general worry that "some students might get upset." (a) Using Engel v. Vitale (1962), explain whether the intercom prayer practice is likely constitutional, and why. (b) Using Wisconsin v. Yoder (1972), explain the difference between the Establishment Clause claim in part (a) and a Free Exercise Clause claim. (c) Using Tinker v. Des Moines (1969), explain whether the school\'s justification for banning the ribbons is likely to satisfy the constitutional standard for restricting student speech.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies that the intercom prayer is likely UNCONSTITUTIONAL under Engel v. Vitale because it is school-sponsored/government-composed prayer, even if brief and voluntary to participate in. No credit for a response concluding it is constitutional or omitting Engel-based reasoning.',
            modelResponse:
              'The intercom prayer practice is likely unconstitutional under Engel v. Vitale (1962), which held that government-sponsored prayer in public schools violates the Establishment Clause. Even though the prayer here is brief and a student reads it voluntarily, the school itself is sponsoring and organizing an official prayer practice as part of the school day, which is exactly what Engel found impermissible — voluntariness and brevity do not cure a government-sponsored religious exercise.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that the Establishment Clause (part a) restricts government from promoting/sponsoring religion, while the Free Exercise Clause (illustrated by Yoder) restricts government from burdening an individual\'s own religious practice — a claim about being prevented from practicing one\'s faith, not about the government promoting one. No credit for conflating the two clauses or omitting Yoder.',
            modelResponse:
              "The Establishment Clause claim in part (a) is about the GOVERNMENT promoting or sponsoring religion — the school itself organizing a prayer. A Free Exercise claim, illustrated by Wisconsin v. Yoder (1972), is the opposite kind of claim: it arises when a government law or policy BURDENS an individual's ability to practice their own religion, such as Wisconsin's compulsory-attendance law burdening Amish families' religious way of life. One clause restrains government promotion of religion; the other restrains government interference with individual religious practice.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains, using Tinker, that a general worry some students "might get upset" is exactly the kind of "undifferentiated fear or apprehension of disturbance" Tinker held insufficient, so the ban likely fails the substantial disruption standard absent a concrete showing of material and substantial interference. No credit for a response that misapplies the standard or gives no Tinker-based reasoning.',
            modelResponse:
              'Under Tinker v. Des Moines (1969), the school\'s justification is unlikely to be sufficient. Tinker held that "undifferentiated fear or apprehension of disturbance" does not justify restricting student expression; a school must show the speech would materially and substantially interfere with appropriate school discipline. A vague worry that "some students might get upset" is precisely the kind of generalized fear Tinker rejected, so banning the silent ribbons on that basis alone likely violates the students\' First Amendment rights.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-schenck-still-governs',
      kind: 'misconception_check',
      question:
        'True or false: the "clear and present danger" test from Schenck v. United States (1919) is still the standard the Supreme Court applies today to decide when speech can be restricted.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming a famous, frequently cited case must still state current law, rather than recognizing that Schenck\'s test was a starting point later NARROWED by subsequent decisions — most significantly Brandenburg v. Ohio (1969), decided the same year as Tinker.',
          correctsTo:
            'FALSE. Schenck\'s "clear and present danger" test (1919) is no longer the governing speech-restriction standard. It was significantly NARROWED by later cases, most importantly Brandenburg v. Ohio (1969), which requires speech to be directed to inciting, and likely to incite, IMMINENT lawless action before it can be restricted — a much more speech-protective standard than Schenck\'s original "clear and present danger" language. Separately, for the school setting specifically, Tinker v. Des Moines (also 1969) supplies its own doctrine — the substantial-disruption standard — which is not a version of the Schenck test at all, but an independent framework for student expression in schools. Citing Schenck alone as if it still controlled either general speech restrictions or school speech would be citing outdated doctrine on both counts.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Establishment Clause restrains government from promoting religion (Engel v. Vitale, 1962 — school-sponsored prayer unconstitutional); the Free Exercise Clause restrains government from burdening individual religious practice (Wisconsin v. Yoder, 1972 — Amish exemption from compulsory schooling past 8th grade).',
        'Schenck v. United States (1919) created the "clear and present danger" test — but that test has since been narrowed by later cases (notably Brandenburg v. Ohio); it is a historical starting point, not the speech test courts apply today.',
        'Tinker v. Des Moines (1969): students do not "shed their constitutional rights... at the schoolhouse gate." Schools may restrict student expression only on a showing of material and substantial interference with school discipline — "undifferentiated fear" is not enough. This substantial-disruption standard is a separate, school-specific doctrine, not a version of Schenck\'s test.',
        'Most speech, including unpopular political and symbolic speech, is protected; narrow categories (obscenity, defamation, true threats, Brandenburg-level incitement) receive little or no protection.',
        'The First Amendment restrains GOVERNMENT action only — it does not apply to private employers, private schools, or other private actors.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.1-3.4',
    cedTitle: 'First Amendment: Religion & Speech',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-tinker-opinion.v1',
        chapter: '1969',
        note: 'Tinker v. Des Moines opinion excerpt — "schoolhouse gate" and substantial-disruption language; anchor for the concept and worked example.',
      },
    ],
  },
};
