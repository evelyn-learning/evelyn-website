/**
 * AP US Government & Politics — CED Unit 3.7-3.9: Due Process and Selective
 * Incorporation.
 *
 * Unit-3 content plan (follows the Unit-1/Unit-2 calibration template — see
 * ap-apgov-u1-federalism.ts for the shared Passage/rubric infra this plan
 * reuses). Third stop in Unit 3's civil-liberties walk, following directly
 * from ap-apgov-u3-press-assembly-arms.ts, which already introduced
 * McDonald v. Chicago as one installment of incorporation; this plan makes
 * the incorporation MECHANISM itself the direct subject.
 *
 * Covers the doctrine of selective incorporation (Fourteenth Amendment Due
 * Process Clause, case-by-case, not all-at-once); Gideon v. Wainwright
 * (1963, Sixth Amendment right to counsel incorporated); Miranda rights;
 * Fourth Amendment search-and-seizure protections; and the right to
 * privacy as an implied, contested doctrine.
 *
 * NOTE ON INCORPORATION CONSISTENCY: per U1 (ap-apgov-u1-federalism.ts) and
 * this unit's own U3.5-3.6 plan, incorporation runs through the Fourteenth
 * Amendment's DUE PROCESS Clause only — the Equal Protection Clause is a
 * separate doctrine, addressed on its own terms in the next (civil-rights)
 * plan. This plan is consistent with that convention throughout.
 *
 * NO PASSAGE WIRED for this plan, per the brief.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U3_DUE_PROCESS: LessonPlan = {
  id: 'evelyn.ap.apgov.due-process-incorporation.v1',
  title: 'U3.7-3.9 Due Process & Selective Incorporation',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.due-process-incorporation',
      description:
        "Explain the doctrine of selective incorporation under the Fourteenth Amendment's Due Process Clause; Gideon v. Wainwright (1963) and the incorporation of the Sixth Amendment right to counsel; Miranda warnings; Fourth Amendment search-and-seizure protections; and the right to privacy as an implied, contested constitutional doctrine.",
      standard: 'AP-APGOV-3.7/3.8/3.9',
    },
  ],
  prerequisites: ['apgov.press-assembly-arms', 'apgov.federalism-foundations'],
  followUps: ['apgov.civil-rights-equality'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see incorporation as a slow, case-by-case doctrine they have already met twice (federalism\'s Fourteenth Amendment discussion, McDonald v. Chicago) rather than a single historical event, and to see the right to privacy as a genuinely contested doctrine rather than settled textual law.',
      script:
        'Last lesson closed with McDonald v. Chicago, which applied the Second Amendment to the states through the Fourteenth Amendment\'s Due Process Clause. That was not a one-time event — it was ONE INSTALLMENT in a doctrine called selective incorporation, which has been extending Bill of Rights protections to state governments, right by right, for over a century. Today we look at the doctrine itself, and at two of its most consequential applications: the right to a lawyer, even if you cannot afford one, and the rules police must follow when they search you or question you. We\'ll also look at a right that is NOT written anywhere in the Bill of Rights\' text at all — the right to privacy — and ask what it means for a constitutional right to be "implied" rather than stated, and why that makes it one of the most contested doctrines in American constitutional law.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-incorporation-counsel-privacy',
      kind: 'concept',
      goal: 'Explain selective incorporation, Gideon v. Wainwright, Miranda rights, Fourth Amendment protections, and the right to privacy as a contested implied doctrine.',
      keyIdeas: [
        'SELECTIVE INCORPORATION — THE DOCTRINE: originally, the Bill of Rights constrained only the FEDERAL government. Through the Fourteenth Amendment\'s DUE PROCESS CLAUSE ("nor shall any State deprive any person of life, liberty, or property, without due process of law"), the Supreme Court has, case by case over more than a century, held that most (not automatically all) Bill of Rights protections also apply against STATE and local governments. This is called SELECTIVE incorporation specifically because it happens right-by-right, in individual cases, not as a single blanket ruling that incorporated the entire Bill of Rights at once.',
        'GIDEON V. WAINWRIGHT (1963) — RIGHT TO COUNSEL INCORPORATED: Clarence Gideon was charged with a felony in Florida state court and could not afford a lawyer; Florida, at the time, only provided free counsel in capital cases. Representing himself, he was convicted. The Supreme Court held that the SIXTH AMENDMENT right to counsel is a FUNDAMENTAL right, incorporated against the states via the Fourteenth Amendment\'s Due Process Clause — meaning STATES, not just the federal government, must provide an attorney to a criminal defendant who cannot afford one. Gideon is a textbook example of selective incorporation applied to a specific, named Bill of Rights guarantee.',
        'MIRANDA RIGHTS: stemming from Miranda v. Arizona (1966), police must inform a suspect in custody, before interrogation, of certain rights: the right to remain silent, that anything said can be used against them in court, the right to an attorney, and that an attorney will be provided if they cannot afford one. These "Miranda warnings" protect the Fifth Amendment privilege against self-incrimination and the Sixth Amendment right to counsel during police interrogation specifically — a failure to give the warnings can make a resulting confession inadmissible in court.',
        'FOURTH AMENDMENT — SEARCHES AND SEIZURES: the Fourth Amendment protects "the right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures," generally requiring a WARRANT, supported by probable cause, before government may search or seize. Courts have recognized various exceptions (e.g. consent, plain view, exigent circumstances), but the baseline default is that unreasonable searches without a warrant or a recognized exception violate the Fourth Amendment, and evidence obtained in violation of it can typically be excluded from trial (the exclusionary rule).',
        'THE RIGHT TO PRIVACY — AN IMPLIED, CONTESTED DOCTRINE: unlike the rights above, the word "privacy" appears NOWHERE in the Constitution\'s text. The Supreme Court has, in some decisions, found a right to privacy IMPLIED by several amendments considered together (including the First, Third, Fourth, Fifth, and Ninth Amendments) rather than stated explicitly in any one of them. Because it rests on inference rather than explicit text, the right to privacy remains one of the most CONTESTED doctrines in constitutional law — scholars, justices, and the public disagree sharply both about whether it should be recognized at all and about how far it extends. Treat it, accurately, as a genuinely debated area of doctrine, not a settled textual guarantee like the Sixth Amendment right to counsel.',
        'WHY THIS IS "SELECTIVE," NOT "TOTAL," INCORPORATION: the Supreme Court has, over time, incorporated MOST — but has never held that it must incorporate EVERY SINGLE Bill of Rights provision automatically and all at once. Each incorporation question has historically required its own case (as with Gideon for the Sixth Amendment\'s counsel guarantee, or McDonald for the Second Amendment in the prior lesson). This case-by-case character is the defining feature of selective incorporation, and it is why incorporation is accurately described as an ongoing process rather than a completed, one-time event.',
      ],
      vocabulary: [
        {
          term: 'selective incorporation',
          definition:
            "the case-by-case doctrine, grounded in the Fourteenth Amendment's Due Process Clause, by which most (not automatically all) Bill of Rights protections have been extended to apply against state and local governments.",
        },
        {
          term: 'right to counsel',
          definition:
            'the Sixth Amendment guarantee of legal representation for a criminal defendant, incorporated against the states in Gideon v. Wainwright (1963), requiring states to provide an attorney to defendants who cannot afford one.',
        },
        {
          term: 'Miranda rights',
          definition:
            'warnings police must give a suspect in custody before interrogation (right to remain silent, right to an attorney, etc.), protecting Fifth Amendment self-incrimination and Sixth Amendment counsel rights, from Miranda v. Arizona (1966).',
        },
        {
          term: 'exclusionary rule',
          definition:
            'the rule that evidence obtained through an unreasonable, unwarranted search or seizure in violation of the Fourth Amendment is generally inadmissible at trial.',
        },
        {
          term: 'right to privacy',
          definition:
            "a constitutional doctrine, found in some Supreme Court decisions to be implied by several amendments read together rather than stated in the text of any one, and treated as a genuinely contested area of constitutional law.",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-gideon-incorporation-reasoning',
      kind: 'worked_example',
      problem:
        'Analyze the incorporation reasoning in Gideon v. Wainwright (1963). Facts: Clarence Gideon was tried in Florida state court on a felony charge and asked the court to appoint him a lawyer because he could not afford one; Florida law at the time only required appointed counsel in capital cases, so his request was denied, and he was convicted after representing himself. (a) Which Bill of Rights amendment is at issue, and what does it guarantee? (b) What mechanism did the Supreme Court use to make this federal constitutional guarantee binding on a STATE court proceeding? (c) Why is Gideon\'s holding described as "selective" incorporation rather than a ruling that incorporated the entire Bill of Rights at once?',
      steps: [
        'IDENTIFY THE RIGHT AT ISSUE. The Sixth Amendment guarantees, among other things, the right of a criminal defendant "to have the Assistance of Counsel for his defence." Gideon was denied appointed counsel in a Florida state felony prosecution.',
        'IDENTIFY THE MECHANISM. The Sixth Amendment, by its original text, restrained only the FEDERAL government. To make it binding on Florida, a STATE, the Supreme Court held that the right to counsel is a fundamental right INCORPORATED against the states through the Fourteenth Amendment\'s Due Process Clause — the same mechanism (not the Equal Protection Clause) used throughout this unit\'s incorporation cases, including McDonald v. Chicago in the previous lesson.',
        'EXPLAIN WHY "SELECTIVE." Gideon incorporated ONE specific guarantee — the Sixth Amendment right to counsel — through its own individual case. It did not, and could not by itself, incorporate every other Bill of Rights provision automatically; each right requires its own incorporation case (as McDonald later did for the Second Amendment, in 2010, nearly fifty years after Gideon). This right-by-right pattern, not a single blanket ruling, is exactly what "selective" incorporation means.',
        'CONNECT TO THE BROADER DOCTRINE. Gideon\'s result — states must provide counsel to indigent defendants — reshaped criminal procedure nationwide, but the underlying doctrinal MOVE (Due Process Clause incorporation of a specific enumerated right) is identical in structure to the Second Amendment story in McDonald, even though the two cases are separated by decades and involve entirely different rights.',
      ],
      answer:
        'The Sixth Amendment right to counsel is at issue — the guarantee that a criminal defendant has the assistance of a lawyer for their defense. The Supreme Court made this binding on Florida, a state court, by holding the right to counsel is a fundamental right incorporated against the states through the Fourteenth Amendment\'s Due Process Clause. Gideon is described as "selective" incorporation, not total incorporation, because the ruling incorporated only the Sixth Amendment\'s counsel guarantee through its own individual case — it did not automatically incorporate every other Bill of Rights provision; each right (like the Second Amendment in McDonald v. Chicago, decided nearly fifty years later) has required its own separate incorporation case.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. A state police department arrests a suspect on a felony charge and interrogates them for two hours without ever informing them of their right to remain silent or their right to an attorney; the suspect confesses. Separately, officers search the suspect\'s home without a warrant and without the suspect\'s consent, and without any emergency justifying an immediate search, and find evidence they use at trial. (a) Explain what constitutional problem arises from the interrogation, and name the doctrine that governs it. (b) Explain what constitutional problem arises from the home search, and what is likely to happen to the evidence found. (c) A commentator claims "the right to privacy in the Constitution clearly requires suppressing all of this evidence, since privacy is a fundamental right." Explain why this argument overstates how settled the right to privacy actually is as constitutional doctrine.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies that failing to give Miranda warnings before custodial interrogation violates the suspect\'s Fifth Amendment self-incrimination / Sixth Amendment counsel rights as protected by Miranda v. Arizona, and names Miranda rights/warnings as the governing doctrine. No credit for a response that misidentifies the doctrine or omits Miranda.',
            modelResponse:
              'Failing to inform the suspect of the right to remain silent and the right to an attorney before custodial interrogation violates the Miranda rights doctrine from Miranda v. Arizona (1966), which protects the Fifth Amendment privilege against self-incrimination and the Sixth Amendment right to counsel. Because the required warnings were never given, the resulting confession is likely inadmissible in court.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies the search as a likely Fourth Amendment violation (warrantless search without consent or exigent circumstances) and explains the evidence is likely inadmissible under the exclusionary rule. No credit for a response omitting the Fourth Amendment or the exclusionary rule.',
            modelResponse:
              "The warrantless home search without consent and without any emergency (exigent circumstance) justification likely violates the Fourth Amendment's protection against unreasonable searches and seizures, since it was conducted without a warrant or a recognized exception. Under the exclusionary rule, evidence obtained through such an unconstitutional search is generally inadmissible at trial.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that the right to privacy is an implied doctrine (not explicit constitutional text) and is genuinely contested, so it cannot be invoked as an automatically settled, self-executing basis for suppression — the actual bases here are the specific Fifth/Sixth Amendment Miranda doctrine and the Fourth Amendment/exclusionary rule, not a generalized privacy right. No credit for a response treating the right to privacy as clearly settled and dispositive, or for a response that provides no reasoning about privacy\'s contested status.',
            modelResponse:
              "This overstates the doctrine. The right to privacy does not appear explicitly in the Constitution's text; it has been found by some Supreme Court decisions to be implied by several amendments read together, and it remains one of the most contested doctrines in constitutional law, with real disagreement over whether it should be recognized and how far it extends. The actual, well-established constitutional bases for challenging what happened here are specific and textual: the Fifth/Sixth Amendment Miranda doctrine for the interrogation, and the Fourth Amendment's warrant requirement and exclusionary rule for the search — not a general appeal to an implied privacy right, which is not settled enough to serve as an automatic, standalone basis for suppression.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-incorporation-all-at-once',
      kind: 'misconception_check',
      question:
        'True or false: the Supreme Court incorporated the entire Bill of Rights against the states in a single ruling, applying every provision to state governments at once.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming "incorporation" refers to one landmark case that settled the whole question, rather than recognizing it as an ongoing, right-by-right doctrine built case by case over more than a century.',
          correctsTo:
            'FALSE. Incorporation has happened SELECTIVELY — right by right, in separate cases, over more than a century — not in a single all-at-once ruling. Gideon v. Wainwright (1963) incorporated only the Sixth Amendment right to counsel; McDonald v. Chicago (2010), decided nearly fifty years later, separately incorporated the Second Amendment right to keep and bear arms. Each right has generally required its own case establishing that it is "fundamental" enough to bind the states through the Fourteenth Amendment\'s Due Process Clause. This is precisely why the doctrine is called SELECTIVE incorporation, and why it remains, in principle, an ongoing rather than fully completed process.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Selective incorporation is the case-by-case doctrine, grounded in the Fourteenth Amendment\'s DUE PROCESS Clause, extending most (not automatically all) Bill of Rights protections to the states — it happened right-by-right, not all at once.',
        'Gideon v. Wainwright (1963) incorporated the Sixth Amendment right to counsel, requiring states to provide an attorney to indigent criminal defendants.',
        'Miranda rights (from Miranda v. Arizona, 1966) protect the Fifth Amendment self-incrimination privilege and Sixth Amendment counsel right during custodial interrogation; a Miranda failure can make a resulting confession inadmissible.',
        'The Fourth Amendment generally requires a warrant, backed by probable cause, before a search; evidence from an unconstitutional search is generally excluded under the exclusionary rule.',
        'The right to privacy is not stated in the Constitution\'s text — where recognized, it is IMPLIED from several amendments together, and it remains a genuinely contested doctrine, not a settled guarantee like the Sixth Amendment right to counsel.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.7-3.9',
    cedTitle: 'Due Process & Selective Incorporation',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
    ],
  },
};
