/**
 * AP US Government & Politics — CED Unit 3.10-3.13: Civil Rights and Equal
 * Protection.
 *
 * Unit-3 content plan (follows the Unit-1/Unit-2 calibration template — see
 * ap-apgov-u1-federalism.ts for the shared Passage/rubric infra this plan
 * reuses, and ap-apgov-u2-judiciary.ts for the pattern of referencing a
 * second document in prose/metadata without wiring it as a segment
 * passageId). Closing stop in Unit 3's civil-liberties/civil-rights walk,
 * following directly from ap-apgov-u3-due-process.ts.
 *
 * Covers the Fourteenth Amendment's Equal Protection Clause; Brown v. Board
 * of Education (1954) and the resistance to its implementation; Martin
 * Luther King Jr.'s "Letter from Birmingham Jail" (1963); the Civil Rights
 * Act of 1964, Voting Rights Act of 1965, and Title IX (1972); and the
 * NAACP's litigation strategy, tied descriptively to the civil-rights
 * filings-table data.
 *
 * DOCUMENT STIMULUS: the anchor is evelyn.passage.apgov-brown-opinion.v1
 * (seeded in Task 6). Per that passage's own docblock, the excerpt covers
 * only: the "deprive... of equal educational opportunities" question, the
 * "generates a feeling of inferiority" finding, and the "'separate but
 * equal' has no place... inherently unequal" / Fourteenth Amendment
 * equal-protection conclusion. The worked example below quotes and
 * analyzes only that language.
 *
 * COPYRIGHT NOTE — MLK "LETTER FROM BIRMINGHAM JAIL" (1963): the Letter is
 * still under copyright. This plan describes its context and argument
 * structure ENTIRELY IN THE PLAN'S OWN WORDS — ZERO quoted sentences from
 * the Letter appear anywhere below. The only Letter-associated language
 * reproduced is the two-word named concept "constructive tension," used as
 * a term of art, not as an excerpted sentence.
 *
 * DATA REFERENCE (NOT A WIRED PASSAGE): the NAACP litigation-strategy
 * discussion below cites the same five real data points documented in
 * evelyn.passage.apgov-civil-rights-filings-table.v1's own docblock — 1964:
 * 709 filings; 1990: 18,922; 1997: 43,278 (the series peak); 2006: 32,865;
 * 2020: 41,044 — but that passage is referenced descriptively, not wired
 * as a segment passageId, since the concept segment's single passageId
 * slot is used for the Brown opinion excerpt (matching the pattern used in
 * ap-apgov-u2-judiciary.ts for the Marbury opinion excerpt).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U3_CIVIL_RIGHTS: LessonPlan = {
  id: 'evelyn.ap.apgov.civil-rights-equality.v1',
  title: 'U3.10-3.13 Civil Rights & Equal Protection',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.civil-rights-equality',
      description:
        "Explain the Fourteenth Amendment's Equal Protection Clause; Brown v. Board of Education (1954) and the resistance to its implementation; the context and argument structure of Martin Luther King Jr.'s \"Letter from Birmingham Jail\" (1963); the Civil Rights Act of 1964, Voting Rights Act of 1965, and Title IX (1972); and the NAACP's litigation strategy for advancing civil rights through the federal courts.",
      standard: 'AP-APGOV-3.10/3.11/3.12/3.13',
    },
  ],
  prerequisites: ['apgov.due-process-incorporation', 'apgov.constitution-ratification'],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see civil rights as a distinct doctrine from civil liberties (Equal Protection vs. Due Process), and to see 1954-1965 not as a single moment but as a decade-long sequence of a court ruling, resistance to it, a jailed protest leader\'s public argument, and eventually federal statutes.',
      script:
        "This unit has covered civil LIBERTIES so far — protections against government, running through the Due Process Clause. Today's topic is civil RIGHTS: the Fourteenth Amendment's separate promise that government must treat people EQUALLY, under its Equal Protection Clause. In 1954, the Supreme Court ruled that racially segregated public schools violated that promise. That ruling did not end segregation overnight — it triggered a decade of resistance, resistance that a Baptist minister sitting in a Birmingham jail cell in 1963 argued, in writing, could not be waited out. Two years after that, Congress passed the two most consequential civil rights statutes in American history. Today we trace that whole sequence: the equal protection doctrine itself, the case that declared segregated schools unconstitutional, the argument made from a jail cell for why the timeline for justice could not be left to the comfort of the majority, and the statutes that followed.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-equal-protection-brown-mlk-statutes',
      kind: 'concept',
      goal: "Explain the Equal Protection Clause, Brown v. Board and its implementation resistance, the context and argument structure of MLK's Letter from Birmingham Jail, the major 1960s-70s civil rights statutes, and the NAACP's litigation strategy.",
      keyIdeas: [
        'THE EQUAL PROTECTION CLAUSE: the Fourteenth Amendment provides that no state shall "deny to any person within its jurisdiction the equal protection of the laws." Unlike the Due Process Clause (which the last lesson used to trace incorporation), Equal Protection is its own distinct guarantee: government must not draw arbitrary or invidious distinctions among people, particularly on the basis of protected characteristics like race. Civil RIGHTS doctrine, generally, concerns this promise of equal treatment; civil LIBERTIES doctrine concerns protections against government overreach more broadly (speech, religion, due process, and the like).',
        'BROWN V. BOARD OF EDUCATION (1954): the case consolidated challenges to state-mandated racial segregation in public schools. The Supreme Court (Chief Justice Earl Warren) held that segregating children in public schools solely on the basis of race deprives them of equal educational opportunities, and REJECTED the "separate but equal" doctrine that had permitted state-mandated segregation since Plessy v. Ferguson (1896): the Court held that separate educational facilities are "inherently unequal," violating the Fourteenth Amendment\'s Equal Protection Clause.',
        'RESISTANCE TO IMPLEMENTATION: Brown did not desegregate schools immediately. Many Southern states and school districts engaged in years of open defiance and delay — including strategies sometimes called "massive resistance" — such that meaningful school desegregation in much of the South did not occur until well over a decade after the ruling, in some places only after further court orders and federal enforcement. Brown established the constitutional PRINCIPLE; enforcing it on the ground was a separate, prolonged political and legal struggle.',
        'MLK\'S "LETTER FROM BIRMINGHAM JAIL" (1963) — CONTEXT: written by Martin Luther King Jr. while jailed in Birmingham, Alabama, after his arrest during a campaign of nonviolent direct action (marches and demonstrations without a permit) against the city\'s segregation laws. The letter responds to a public statement issued by a group of white clergymen who had criticized King\'s campaign as unwise and poorly timed, urging that the fight against segregation be pursued through the courts and negotiation alone, and more slowly.',
        'MLK\'S "LETTER FROM BIRMINGHAM JAIL" — ARGUMENT STRUCTURE (described, not quoted): King draws a distinction between JUST and UNJUST laws — arguing that a law is unjust, and thus one a person has a moral responsibility to disobey openly (while accepting the legal penalty), when it degrades human dignity, when it is imposed on a group that had no voice in enacting it, or when it is applied unequally in practice even if neutral on its face. He defends nonviolent direct action as necessary specifically because negotiation had repeatedly failed: its purpose is to create a crisis and foster a kind of "CONSTRUCTIVE TENSION" that forces a community which has consistently refused to confront an issue voluntarily to finally negotiate it. He also directly criticizes the moderate reader — including the clergymen he is answering — for prioritizing the appearance of order and the comfort of a gradual timeline over the substance of justice, arguing that this kind of moderation, however well-intentioned, in practice functions as a greater obstacle to progress than open hostility from an outright opponent.',
        'CIVIL RIGHTS ACT OF 1964: landmark federal statute prohibiting discrimination on the basis of race, color, religion, sex, and national origin, including in employment (Title VII) and public accommodations (e.g. restaurants, hotels) — reaching PRIVATE conduct in ways the Equal Protection Clause alone (which restrains only government action) could not.',
        'VOTING RIGHTS ACT OF 1965: landmark federal statute targeting the specific tools (literacy tests, and similar barriers) Southern states had used to disenfranchise Black voters, and authorizing direct federal oversight and enforcement of voting procedures in jurisdictions with a history of discriminatory practices.',
        'TITLE IX (1972): federal statute prohibiting sex-based discrimination in any educational program or activity receiving federal funding — most commonly associated with expanding opportunities for women and girls in school athletics, but reaching sex discrimination in education far more broadly than athletics alone.',
        'THE NAACP LITIGATION STRATEGY: well before 1964-65 legislation, the NAACP (National Association for the Advancement of Colored People) pursued a sustained, deliberate LITIGATION strategy — bringing a sequence of federal lawsuits (including the cases consolidated into Brown itself) designed to chip away at "separate but equal" case by case, rather than waiting for legislative change. This strategy treated the federal courts as a primary venue for advancing civil rights, and civil-rights case filings in U.S. district courts grew enormously across the following decades as new causes of action accumulated: from a mere 709 civil rights filings in 1964 (the year after Title VII of the Civil Rights Act took effect), to 18,922 by 1990, peaking at 43,278 in 1997 after further statutes like the Americans with Disabilities Act (1990) expanded available claims, easing to 32,865 by 2006, and still running at 41,044 filings in 2020 — evidence that the federal courts have remained a central venue for pursuing civil rights claims for decades after the key 1960s statutes were enacted, not just in the immediate aftermath of Brown.',
      ],
      vocabulary: [
        {
          term: 'Equal Protection Clause',
          definition:
            'Fourteenth Amendment provision barring states from denying any person the equal protection of the laws — the basis for Brown v. Board of Education (1954); a distinct guarantee from the Due Process Clause.',
        },
        {
          term: '"separate but equal"',
          definition:
            'the doctrine from Plessy v. Ferguson (1896) permitting state-mandated racial segregation if facilities were nominally equal; rejected by Brown v. Board of Education (1954), which held separate facilities are "inherently unequal."',
        },
        {
          term: 'just vs. unjust law (King)',
          definition:
            "the distinction, drawn by Martin Luther King Jr. in \"Letter from Birmingham Jail\" (1963), between laws that comport with human dignity and were enacted with the affected group's voice, and laws that degrade dignity, are imposed without that voice, or are applied unequally — with the latter argued to carry a moral case for open, nonviolent disobedience.",
        },
        {
          term: 'constructive tension',
          definition:
            'the named concept, from King\'s "Letter from Birmingham Jail," describing the intended effect of nonviolent direct action: creating a crisis that forces a community which has refused to negotiate voluntarily to finally confront and address an issue.',
        },
        {
          term: 'NAACP litigation strategy',
          definition:
            'the sustained strategy of pursuing civil rights advances through a deliberate sequence of federal lawsuits (including the cases consolidated into Brown v. Board) rather than relying solely on legislative change.',
        },
      ],
      passageId: 'evelyn.passage.apgov-brown-opinion.v1',
      estimatedMinutes: 7,
    },
    {
      id: 'worked-brown-inherently-unequal-reasoning',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from the Supreme Court\'s opinion in Brown v. Board of Education, 347 U.S. 483 (1954), delivered by Chief Justice Earl Warren: "We come then to the question presented: Does segregation of children in public schools solely on the basis of race, even though the physical facilities and other \'tangible\' factors may be equal, deprive the children of the minority group of equal educational opportunities? We believe that it does. ... To separate them from others of similar age and qualifications solely because of their race generates a feeling of inferiority as to their status in the community that may affect their hearts and minds in a way unlikely ever to be undone. ... We conclude that in the field of public education the doctrine of \'separate but equal\' has no place. Separate educational facilities are inherently unequal. ... [D]eprived of the equal protection of the laws guaranteed by the Fourteenth Amendment." (a) What specific question does the Court say it is answering, and how does it answer it? (b) What kind of harm does the Court identify, beyond any difference in physical facilities? (c) What does the Court conclude about the "separate but equal" doctrine, and which constitutional provision does it invoke?',
      steps: [
        'SOURCE IT. Chief Justice Warren\'s opinion of the Court in Brown v. Board of Education (1954), the required AP Gov case establishing that segregated public schools violate Equal Protection.',
        'IDENTIFY THE QUESTION AND ANSWER. The Court asks whether segregating children by race, "even though the physical facilities and other \'tangible\' factors may be equal," deprives minority children of equal educational opportunities — and answers directly: "We believe that it does." This frames the case as NOT turning on whether the buildings, books, or teacher quality were literally equal; the harm is found even assuming rough tangible equality.',
        'IDENTIFY THE HARM BEYOND TANGIBLE FACTORS. The Court finds that separating children "solely because of their race generates a feeling of inferiority as to their status in the community" that may affect them "in a way unlikely ever to be undone" — an intangible, psychological and social harm, not a physical-resources harm. This is the core reasoning move: equality of buildings and books cannot cure the harm of the separation itself.',
        'IDENTIFY THE CONCLUSION AND ITS BASIS. The Court concludes "the doctrine of \'separate but equal\' has no place" in public education, because "separate educational facilities are inherently unequal" — rejecting Plessy v. Ferguson\'s framework outright rather than merely limiting it. The Court grounds this in the Fourteenth Amendment\'s guarantee of "the equal protection of the laws."',
        'SYNTHESIZE. Brown\'s reasoning does not depend on proving the segregated schools were unequal in resources; it holds that the ACT of state-mandated separation by race is itself the constitutional harm, inherently and regardless of resource parity — which is why "separate but equal" was rejected as a doctrine entirely, not merely tightened.',
      ],
      answer:
        'The Court asks whether segregating children in public schools by race, even assuming equal physical facilities, deprives minority children of equal educational opportunities — and answers yes ("We believe that it does"). Beyond any difference in tangible facilities, the Court identifies a psychological and social harm: enforced separation by race "generates a feeling of inferiority as to their status in the community" that may never be undone. The Court concludes that "separate but equal" "has no place" in public education because "separate educational facilities are inherently unequal," grounding this conclusion in the Fourteenth Amendment\'s Equal Protection Clause — meaning the harm comes from the act of state-mandated separation itself, not merely from any gap in resources between the separated facilities.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. In 1955, one year after Brown, a Southern school district publicly announces it will not desegregate, and no desegregation actually occurs there until federal court orders and federal marshals force compliance more than a decade later. Around the same time, a civil rights leader jailed for organizing a nonviolent protest campaign writes an open letter responding to critics who argued he should have waited for the courts and negotiation to work instead. (a) Using Brown v. Board of Education, explain why the district\'s 1955 announcement does not mean Brown\'s constitutional holding was wrong or overturned. (b) Using the argument structure of King\'s "Letter from Birmingham Jail" (in your own words, without quoting it), explain the reasoning he gives for why nonviolent direct action, rather than only litigation and negotiation, was necessary at that point. (c) Explain how the Civil Rights Act of 1964 addressed a gap that the Equal Protection Clause, and even Brown itself, could not reach on their own.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that Brown established the constitutional PRINCIPLE that segregated schools violate Equal Protection, but implementation faced years of resistance/delay (e.g. "massive resistance") — a district\'s defiance reflects an enforcement gap, not an error or reversal in the Court\'s holding. No credit for a response implying Brown was legally invalid or overturned because of the resistance.',
            modelResponse:
              "The district's refusal to desegregate does not undermine Brown's holding — it reflects the well-documented gap between a constitutional ruling and its on-the-ground enforcement. Brown established that segregated public schools violate the Equal Protection Clause; many Southern states and districts nonetheless engaged in years of resistance and delay, so meaningful desegregation in much of the South did not happen until later, sometimes only after further court orders and federal enforcement. That resistance is a separate political and legal struggle over implementation, not evidence that the Court's constitutional holding was mistaken or reversed.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains, in the student\'s own words with no quoted text from the Letter, that King argued nonviolent direct action was necessary because negotiation had repeatedly failed, and that direct action was intended to create a crisis/tension ("constructive tension" acceptable as the named concept) forcing a community that had refused to address the issue voluntarily to finally confront it. No credit for a response that quotes sentences from the actual Letter, or that gives no reasoning beyond stating a conclusion.',
            modelResponse:
              'King argued that negotiation alone had already been tried and had repeatedly failed to produce real change, so simply waiting longer for negotiation or the courts to act was not a realistic path to justice. He described nonviolent direct action as intended to create a kind of "constructive tension" — a crisis significant enough to force a community that had consistently avoided confronting the issue to finally negotiate it seriously, rather than continuing to postpone action indefinitely.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that the Equal Protection Clause (and Brown) restrains only government/state action, while the Civil Rights Act of 1964 reaches PRIVATE discrimination (e.g. private employers, private businesses/public accommodations) that the Constitution alone could not. No credit for a response that does not identify the public/private action distinction.',
            modelResponse:
              "The Equal Protection Clause is a constitutional restraint on GOVERNMENT action — it does not, by itself, reach discrimination by private employers or private businesses. Brown addressed only government-run public schools. The Civil Rights Act of 1964 filled that gap by federal statute: it prohibited discrimination in private employment (Title VII) and privately owned public accommodations like restaurants and hotels, reaching private conduct that the Equal Protection Clause alone has no power to touch.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-brown-overruled-plessy-everywhere',
      kind: 'misconception_check',
      question:
        'True or false: Brown v. Board of Education (1954) overruled the "separate but equal" doctrine for all public accommodations everywhere, including private businesses like restaurants and hotels.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming Brown\'s rejection of "separate but equal" applied automatically and immediately to all forms of segregation everywhere, rather than recognizing Brown as a ruling specifically about PUBLIC EDUCATION and about GOVERNMENT (state) action.',
          correctsTo:
            'FALSE. Brown v. Board of Education (1954) held that segregation in PUBLIC (government-run) SCHOOLS violates the Equal Protection Clause, rejecting "separate but equal" specifically in that context. It did not, by itself, reach private businesses like restaurants and hotels — the Equal Protection Clause restrains government action, not private conduct. Ending segregation in privately owned public accommodations required a later federal STATUTE, the Civil Rights Act of 1964, which prohibited race discrimination in employment and in privately owned public accommodations — a gap the Constitution alone, even after Brown, could not close on its own.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Equal Protection Clause (Fourteenth Amendment) is a distinct guarantee from the Due Process Clause: it bars states from denying any person equal treatment under the law.',
        'Brown v. Board of Education (1954) held segregated public schools "inherently unequal," rejecting "separate but equal" — but implementation faced years of resistance; the ruling addressed public schools and government action, not private businesses.',
        "MLK's \"Letter from Birmingham Jail\" (1963, described here — no text quoted) distinguishes just from unjust laws, defends nonviolent direct action as creating necessary \"constructive tension\" after negotiation had failed, and criticizes the moderate's preference for order over justice.",
        'The Civil Rights Act of 1964 (reaching private employment/public accommodations), the Voting Rights Act of 1965 (targeting discriminatory voting barriers), and Title IX (1972, sex discrimination in federally funded education) extended civil rights protection by STATUTE into areas the Equal Protection Clause alone could not reach.',
        'The NAACP\'s sustained litigation strategy used the federal courts as a primary venue for civil rights advances; civil rights filings in U.S. district courts grew from 709 (1964) to a peak of 43,278 (1997), still running at 41,044 by 2020 — the courts have remained central for decades, not just in the immediate aftermath of Brown.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.10-3.13',
    cedTitle: 'Civil Rights & Equal Protection',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-brown-opinion.v1',
        chapter: '1954',
        note: 'Brown v. Board of Education opinion excerpt — "inherently unequal"/equal-protection language; anchor for the concept and worked example.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-civil-rights-filings-table.v1',
        chapter: '1964-2020',
        note: 'Described data table of civil rights case filings in U.S. district courts — referenced descriptively (not wired as a segment passageId) in the NAACP litigation-strategy discussion.',
      },
    ],
  },
};
