/**
 * AP US Government & Politics — CED Unit 3.5-3.6: Press, Assembly, and the
 * Second Amendment.
 *
 * Unit-3 content plan (follows the Unit-1/Unit-2 calibration template — see
 * ap-apgov-u1-federalism.ts for the shared Passage/rubric infra this plan
 * reuses). Second stop in Unit 3's civil-liberties walk, following directly
 * from ap-apgov-u3-religion-speech.ts.
 *
 * Covers freedom of the press and the doctrine of prior restraint (New York
 * Times Co. v. United States, 1971 — the Pentagon Papers case); the rights
 * to assemble and petition; and the Second Amendment right to keep and bear
 * arms as incorporated against the states via the Fourteenth Amendment's
 * Due Process Clause (McDonald v. Chicago, 2010).
 *
 * NO PASSAGE WIRED for this plan, per the brief — no U3 press/arms passage
 * was seeded in Task 6.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U3_PRESS_ASSEMBLY_ARMS: LessonPlan = {
  id: 'evelyn.ap.apgov.press-assembly-arms.v1',
  title: 'U3.5-3.6 Press, Assembly & the Second Amendment',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.press-assembly-arms',
      description:
        'Explain freedom of the press and the doctrine of prior restraint (New York Times Co. v. United States, 1971); the rights of assembly and petition; and the Second Amendment right to keep and bear arms as incorporated against the states via the Fourteenth Amendment\'s Due Process Clause (McDonald v. Chicago, 2010).',
      standard: 'AP-APGOV-3.5/3.6',
    },
  ],
  prerequisites: ['apgov.religion-speech-liberties'],
  followUps: ['apgov.due-process-incorporation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see "freedom of the press" as centered on a specific, powerful doctrine (prior restraint) rather than a vague guarantee, and to see the Second Amendment as a right whose scope against STATE governments specifically was only settled in 2010.',
      script:
        'Last lesson covered speech and religion. Two more First Amendment freedoms remain, plus a right from a different amendment that keeps landing in the same civil-liberties unit. First: in 1971, the federal government tried to stop the New York Times from publishing a classified Pentagon study about the Vietnam War, arguing publication would harm national security. The Supreme Court let the Times publish anyway — and the reasoning the Court used, about when government can stop speech BEFORE it happens, is one of the most powerful doctrines in this unit. Second: the right to peaceably assemble and petition government sounds obvious, but it is what makes protests, marches, and organized lobbying constitutionally protected activity. Third, a right that is not in the First Amendment at all: the Second Amendment\'s right to keep and bear arms. For most of American history, whether that right constrained STATE gun laws (not just federal law) was genuinely unsettled — it took a 2010 case to resolve it, using the very incorporation mechanism this unit keeps returning to. Today: prior restraint, assembly and petition, and how the Second Amendment reached the states.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-press-assembly-arms',
      kind: 'concept',
      goal: 'Explain freedom of the press and prior restraint via NYT v. US, the rights of assembly and petition, and the Second Amendment as incorporated via McDonald v. Chicago.',
      keyIdeas: [
        'FREEDOM OF THE PRESS: the First Amendment protects the press from government censorship and interference, on the theory that an independent press able to report on government (including unfavorably) is essential to self-government and to holding officials accountable.',
        'PRIOR RESTRAINT: government action that blocks speech or publication BEFORE it happens, rather than punishing it afterward. Prior restraint is treated as the most serious kind of First Amendment violation and carries a "heavy presumption" against its constitutionality — the government must clear an extremely high bar to justify stopping publication in advance.',
        'NEW YORK TIMES CO. V. UNITED STATES (1971) — THE PENTAGON PAPERS CASE: the federal government sought a court order (an injunction) to stop the New York Times and Washington Post from publishing the "Pentagon Papers," a classified Department of Defense study of US decision-making in the Vietnam War, arguing publication would harm national security. The Supreme Court refused to block publication, holding that the government had NOT met the "heavy burden" required to justify a prior restraint on the press. The case is the leading modern statement that prior restraint bears a heavy presumption against constitutionality — the government could still, in principle, pursue OTHER remedies (such as prosecution) after publication, but could not stop publication in advance on the showing it made here.',
        'ASSEMBLY AND PETITION: the First Amendment also protects the right of the people "peaceably to assemble, and to petition the Government for a redress of grievances." This is the constitutional basis for protests, marches, demonstrations, and organized lobbying of government officials — protected activity as long as it remains peaceable; government may impose reasonable, content-neutral time/place/manner restrictions (e.g. permit requirements for large marches) but cannot ban assembly or petition based on the viewpoint being expressed.',
        'THE SECOND AMENDMENT: "A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed." For most of American history, the amendment\'s application to STATE and local gun regulations (as opposed to purely federal law) was unresolved.',
        'McDONALD V. CHICAGO (2010) — INCORPORATION OF THE SECOND AMENDMENT: Chicago had a handgun ban. The Supreme Court held that the Second Amendment\'s individual right to keep and bear arms is INCORPORATED against state and local governments via the Fourteenth Amendment\'s DUE PROCESS CLAUSE — the same selective-incorporation mechanism (not the Equal Protection Clause) that has applied most other Bill of Rights protections to the states. After McDonald, state and local gun laws, not just federal gun laws, are subject to Second Amendment scrutiny.',
        'INCORPORATION AS A RECURRING MECHANISM, NOT A ONE-TIME EVENT: McDonald is one installment in the ongoing, CASE-BY-CASE process of selective incorporation — the Fourteenth Amendment\'s Due Process Clause has been used, right by right and case by case over more than a century, to apply most (not automatically all) Bill of Rights protections to the states. The next lesson in this unit examines that mechanism directly.',
      ],
      vocabulary: [
        {
          term: 'prior restraint',
          definition:
            'government action blocking speech or publication before it occurs, rather than punishing it afterward; carries a heavy presumption against constitutionality under New York Times Co. v. United States (1971).',
        },
        {
          term: 'assembly and petition',
          definition:
            'First Amendment rights to peaceably gather (e.g. protest, march, demonstrate) and to formally ask government for a redress of grievances (e.g. organized lobbying); subject to reasonable, content-neutral time/place/manner rules but not to viewpoint-based bans.',
        },
        {
          term: 'incorporation (Second Amendment)',
          definition:
            "the extension of the Second Amendment's individual right to keep and bear arms to constrain state and local governments, via the Fourteenth Amendment's Due Process Clause, established in McDonald v. Chicago (2010).",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-prior-restraint-analysis',
      kind: 'worked_example',
      problem:
        'Apply the prior-restraint doctrine from New York Times Co. v. United States (1971). Scenario: a federal agency learns that a national newspaper plans to publish a story, based on leaked internal memos, revealing that a government program has been mismanaged and wasting taxpayer money. The agency has no evidence the story would endanger any ongoing operation or any person\'s safety, but it asks a federal court to block publication until it can review the story, citing embarrassment to the agency and "government interests." (a) What standard would the Court apply to the agency\'s request, and where does that standard come from? (b) Is the agency likely to meet that standard, and why or why not? (c) If the story is published and turns out to include some false claims, could the government pursue any remedy at all — and how would that differ from prior restraint?',
      steps: [
        'IDENTIFY THE DOCTRINE. The agency is asking a court to stop publication BEFORE it happens — a prior restraint. New York Times Co. v. United States (1971) governs: prior restraint on the press carries a "heavy presumption" against its constitutionality, and the government bears a heavy burden to justify it.',
        'APPLY THE STANDARD TO THE FACTS. The agency\'s stated justifications — embarrassment and generic "government interests" — are exactly the kind of showing the Pentagon Papers Court found insufficient. In NYT v. US, even a claim of national-security harm from publishing a classified Vietnam War study did not meet the heavy burden required. A mere risk of embarrassment, with no evidence of concrete harm to an ongoing operation or to anyone\'s safety, is a substantially WEAKER showing than what the government failed to establish in 1971.',
        'CONCLUDE ON THE PRIOR-RESTRAINT REQUEST. The agency is very unlikely to meet the heavy burden required to justify a prior restraint; a court applying NYT v. US would likely deny the request to block publication in advance.',
        'DISTINGUISH SUBSEQUENT REMEDIES. Prior restraint is about stopping speech BEFORE it happens. If the published story later turns out to include false, defamatory claims, the government (or affected officials, subject to the actual-malice standard that applies to public officials) could potentially pursue a LIBEL claim AFTER publication. That is a fundamentally different legal posture from prior restraint: punishing or seeking damages for speech that already occurred is not the same First Amendment problem as stopping speech in advance, and courts apply a much less demanding standard to it.',
        'LINK TO THE COURSE THESIS. This is the same doctrinal move as Tinker\'s substantial-disruption standard or Schenck\'s narrowed clear-and-present-danger test from the last lesson: each doctrine sets a specific bar the government must clear before it may restrict expression, and the bar for STOPPING speech in advance (prior restraint) is deliberately the highest bar of all.',
      ],
      answer:
        'The Court would apply the "heavy presumption against constitutionality" standard for prior restraint established in New York Times Co. v. United States (1971). The agency is unlikely to meet that standard: its justifications — embarrassment and vague "government interests," with no evidence of concrete harm — are weaker than the national-security claim the government made and lost in NYT v. US itself, so a court would likely deny the request and allow publication. If the published story later includes false claims, the government (or officials) could potentially pursue a libel/defamation claim AFTER publication, since punishing speech after the fact is a different, less demanding First Amendment question than stopping it in advance through prior restraint.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. A city bans "large gatherings for the purpose of protest" in its downtown core, though it allows other large gatherings (e.g. parades, festivals) in the same area, and separately bans handgun ownership within city limits, citing a state-level view that any locality may regulate firearms as it sees fit. (a) Using the concept of assembly and petition, explain a constitutional problem with the way the protest ban is written. (b) Using McDonald v. Chicago (2010), explain why the city\'s assumption that it can regulate firearms however it likes is incorrect. (c) Identify the constitutional mechanism McDonald relied on to reach that result.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies that singling out protest gatherings for a ban while allowing other large gatherings (parades, festivals) in the same space is a VIEWPOINT- or content-based restriction on assembly, not a neutral time/place/manner rule, and is constitutionally problematic for that reason. No credit for a response that treats any restriction on large gatherings as automatically unconstitutional, or gives no reasoning.',
            modelResponse:
              'The problem is that the ban singles out gatherings "for the purpose of protest" specifically while allowing other large gatherings, like parades or festivals, in the same downtown area. Government may impose reasonable, content-neutral time/place/manner restrictions on assembly, but a rule that targets protest specifically — rather than applying equally to all large gatherings regardless of purpose — is a content- or viewpoint-based restriction on the right to assemble and petition, which the First Amendment does not permit.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that McDonald v. Chicago (2010) held the Second Amendment right to keep and bear arms applies to state and local governments too, so a city cannot regulate firearms free of Second Amendment constraints. No credit for a response that concludes the city\'s regulation is unconstrained or omits McDonald.',
            modelResponse:
              "The city's assumption is incorrect because McDonald v. Chicago (2010) held that the Second Amendment's individual right to keep and bear arms applies to state and local governments, not just the federal government. After McDonald, a city ban on handgun ownership is subject to Second Amendment scrutiny just as a federal gun law would be — localities are not free to regulate firearms however they wish merely because the regulation is local rather than federal.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies the Fourteenth Amendment\'s Due Process Clause (selective incorporation) as the mechanism, not the Equal Protection Clause. No credit for naming the wrong clause or mechanism.',
            modelResponse:
              "McDonald relied on selective incorporation via the Fourteenth Amendment's Due Process Clause — the same mechanism used to apply most other Bill of Rights protections against the states — to hold that the Second Amendment right applies to state and local governments.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-nyt-means-anything-goes',
      kind: 'misconception_check',
      question:
        'True or false: because the government lost in New York Times Co. v. United States (1971), the press can never face any legal consequence at all for what it publishes.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Confusing the specific holding against PRIOR RESTRAINT (stopping publication in advance) with a broader claim that the press faces no legal accountability of any kind for published content.',
          correctsTo:
            "FALSE. New York Times Co. v. United States (1971) held only that the government had not met its heavy burden to justify a PRIOR RESTRAINT — blocking publication in advance. The decision did not immunize the press from all legal consequences after the fact: the press can still, in principle, face libel/defamation liability for false and damaging statements, and in some circumstances the government has pursued other remedies (such as prosecution of the individuals who leaked classified material) after publication. The doctrine's core distinction is between stopping speech BEFORE it happens (prior restraint, subject to the heaviest First Amendment scrutiny) and imposing consequences AFTER it happens (a different, less demanding analysis) — NYT v. US addressed only the former.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Prior restraint — government action blocking speech or publication BEFORE it happens — carries a heavy presumption against constitutionality (New York Times Co. v. United States, 1971, the Pentagon Papers case).',
        'NYT v. US addressed prior restraint only; it does not immunize the press from all after-the-fact legal consequences, such as libel liability.',
        'Assembly and petition protect peaceable gatherings and organized lobbying; government may impose neutral time/place/manner rules but not viewpoint- or content-based bans.',
        'McDonald v. Chicago (2010) incorporated the Second Amendment\'s individual right to keep and bear arms against state and local governments, via the Fourteenth Amendment\'s DUE PROCESS Clause — the same selective-incorporation mechanism (not Equal Protection) covered elsewhere in this unit.',
        'Incorporation is an ongoing, case-by-case process, not a single historical event — McDonald is one installment in that process.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.5-3.6',
    cedTitle: 'Press, Assembly & the Second Amendment',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
    ],
  },
};
