/**
 * AP US Government & Politics — CED Unit 3.7-3.9: Due Process and Selective
 * Incorporation.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.due-process-incorporation.v1`. Covers selective
 * incorporation (Fourteenth Amendment Due Process Clause, case-by-case);
 * Gideon v. Wainwright (1963, Sixth Amendment right to counsel
 * incorporated); Miranda rights; Fourth Amendment search-and-seizure
 * protections and the exclusionary rule; and the right to privacy as an
 * implied, contested doctrine.
 *
 * Incorporation note: consistent with U1 (ap-apgov-u1-federalism.ts) and
 * this unit's press-assembly-arms baseline — incorporation runs through
 * the Fourteenth Amendment's DUE PROCESS Clause only; Equal Protection is
 * a separate doctrine covered in the civil-rights baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_DUE_PROCESS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.due-process-incorporation.v1',
  course: 'AP US Government & Politics',
  cedUnit: 3,
  cedTopic: '3.7-3.9',
  cedTitle: 'Due Process & Selective Incorporation',
  planId: 'evelyn.ap.apgov.due-process-incorporation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.due-process-incorporation.v1' }],
  theory: [
    {
      loId: 'apgov.due-process-incorporation',
      kind: 'definition',
      title: 'selective incorporation',
      content:
        'The case-by-case doctrine, grounded in the Fourteenth Amendment\'s DUE PROCESS CLAUSE ("nor shall any State deprive any person of life, liberty, or property, without due process of law"), by which the Supreme Court has extended most (not automatically all) Bill of Rights protections — originally binding only the federal government — to apply against STATE and local governments. It is "selective" because it happens right-by-right, in individual cases, not as one blanket ruling.',
    },
    {
      loId: 'apgov.due-process-incorporation',
      kind: 'event',
      title: 'Gideon v. Wainwright (1963) — right to counsel incorporated',
      content:
        'Clarence Gideon was charged with a felony in Florida state court and could not afford a lawyer; Florida at the time only provided free counsel in capital cases. Representing himself, he was convicted. The Supreme Court held the SIXTH AMENDMENT right to counsel is a fundamental right, incorporated against the states via the Fourteenth Amendment\'s Due Process Clause — states, not just the federal government, must provide an attorney to an indigent criminal defendant.',
    },
    {
      loId: 'apgov.due-process-incorporation',
      kind: 'definition',
      title: 'Miranda rights',
      content:
        'Warnings police must give a suspect in custody before interrogation (right to remain silent; anything said can be used against them; right to an attorney; one will be provided if they cannot afford one), from Miranda v. Arizona (1966). Protect the Fifth Amendment privilege against self-incrimination and the Sixth Amendment right to counsel during interrogation. A failure to give the warnings can make a resulting confession inadmissible.',
    },
    {
      loId: 'apgov.due-process-incorporation',
      kind: 'concept',
      title: 'Fourth Amendment: searches, seizures, and the exclusionary rule',
      content:
        'The Fourth Amendment protects "the right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures," generally requiring a WARRANT supported by probable cause. Recognized exceptions include consent, plain view, and exigent circumstances. Evidence obtained in violation of the Fourth Amendment can typically be excluded from trial under the EXCLUSIONARY RULE.',
    },
    {
      loId: 'apgov.due-process-incorporation',
      kind: 'definition',
      title: 'exclusionary rule',
      content:
        'The rule that evidence obtained through an unreasonable, unwarranted search or seizure in violation of the Fourth Amendment is generally inadmissible at trial.',
    },
    {
      loId: 'apgov.due-process-incorporation',
      kind: 'concept',
      title: 'right to privacy: an implied, contested doctrine',
      content:
        'The word "privacy" appears nowhere in the Constitution\'s text. The Supreme Court has, in some decisions, found a right to privacy IMPLIED by several amendments considered together (including the First, Third, Fourth, Fifth, and Ninth Amendments) rather than stated explicitly in any one. Because it rests on inference, not explicit text, it remains one of the most CONTESTED doctrines in constitutional law — treat it as genuinely debated, not a settled textual guarantee like the Sixth Amendment right to counsel.',
    },
    {
      loId: 'apgov.due-process-incorporation',
      kind: 'concept',
      title: 'civil liberties vs. civil rights',
      content:
        'CIVIL LIBERTIES (this lesson\'s theme, and the First Amendment/due-process material earlier in the unit) are protections against government overreach — speech, religion, due process, search and seizure. CIVIL RIGHTS (the next lesson\'s theme) concern the promise of EQUAL treatment under the Fourteenth Amendment\'s Equal Protection Clause. Due process incorporation is a civil-liberties doctrine; it is a distinct question from equal protection.',
    },
    {
      loId: 'apgov.due-process-incorporation',
      kind: 'trap',
      title: 'incorporation is not a single, completed event',
      content:
        'Assuming "incorporation" refers to one landmark case that settled the whole question is the most common error. Incorporation happened SELECTIVELY, right by right, over more than a century: Gideon v. Wainwright (1963) incorporated only the Sixth Amendment right to counsel; McDonald v. Chicago (2010), nearly fifty years later, separately incorporated the Second Amendment. Each right generally requires its own case.',
    },
  ],
  methods: [
    {
      title: 'Trace an incorporation case: right, mechanism, and why "selective"',
      when_to_use:
        'Use this whenever a prompt describes a Bill of Rights guarantee being applied against a STATE and asks how or why.',
      steps: [
        'IDENTIFY THE SPECIFIC RIGHT AT ISSUE (e.g. Sixth Amendment counsel in Gideon, Second Amendment in McDonald).',
        'NAME THE MECHANISM PRECISELY: the Fourteenth Amendment\'s DUE PROCESS CLAUSE, not the Equal Protection Clause.',
        'EXPLAIN WHY "SELECTIVE": the case incorporates only that one right through its own individual holding — it does not automatically incorporate every other Bill of Rights provision.',
        'IF ASKED FOR A PARALLEL, connect to another incorporation case in this course (e.g. Gideon and McDonald share the identical doctrinal move despite decades of separation and entirely different rights).',
      ],
      example: {
        problem: 'A state court fails to provide a lawyer to an indigent felony defendant. What doctrine makes this a constitutional violation, and through what mechanism?',
        solution:
          'Gideon v. Wainwright (1963) held the Sixth Amendment right to counsel is a fundamental right incorporated against the states via the Fourteenth Amendment\'s Due Process Clause — so a state, not just the federal government, must provide counsel to an indigent defendant.',
      },
      relatedLoIds: ['apgov.due-process-incorporation'],
    },
    {
      title: 'Diagnose a criminal-procedure scenario: Miranda, Fourth Amendment, or neither',
      when_to_use:
        'Use this whenever a prompt describes police interrogation and/or a search and asks what constitutional problem, if any, arises.',
      steps: [
        'IF THE FACTS INVOLVE CUSTODIAL INTERROGATION without warnings, apply Miranda v. Arizona — check whether the suspect was informed of the right to remain silent and to an attorney before questioning.',
        'IF THE FACTS INVOLVE A SEARCH, check for a warrant supported by probable cause, or a recognized exception (consent, plain view, exigent circumstances). Absent both, the search likely violates the Fourth Amendment.',
        'IF EVIDENCE WAS OBTAINED IN VIOLATION of either doctrine, apply the exclusionary rule: the evidence (or confession) is generally inadmissible.',
        'DO NOT SUBSTITUTE A GENERAL "RIGHT TO PRIVACY" ARGUMENT for the specific, well-established doctrine that actually governs (Miranda/Fifth-Sixth Amendment for interrogation; Fourth Amendment/exclusionary rule for searches) — privacy is an implied, contested doctrine, not an automatic trump card.',
      ],
      relatedLoIds: ['apgov.due-process-incorporation'],
    },
  ],
  pointers: [
    { content: 'Incorporation runs through the Fourteenth Amendment\'s DUE PROCESS Clause — not Equal Protection. Equal Protection is a separate doctrine (covered in the civil-rights lesson).', kind: 'trap' },
    { content: 'Incorporation is selective and case-by-case, not one landmark event — Gideon (1963, counsel) and McDonald (2010, Second Amendment) are separate installments, decades apart.', kind: 'trap' },
    { content: 'The right to privacy is IMPLIED, not textual, and remains genuinely contested — don\'t treat it as a settled, automatic basis for a ruling the way you would treat Miranda or the Fourth Amendment.', kind: 'tip' },
    { content: 'A Miranda failure and a Fourth Amendment violation are separate doctrines: Miranda governs custodial interrogation (Fifth/Sixth Amendment); the exclusionary rule governs evidence from unconstitutional searches (Fourth Amendment).', kind: 'tip' },
    { content: 'Civil liberties (this lesson: due process, search/seizure, counsel) vs. civil rights (next lesson: equal protection) are distinct categories — don\'t merge them.', kind: 'tip' },
  ],
};
