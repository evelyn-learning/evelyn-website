/**
 * AP US Government & Politics — CED Unit 3.10-3.13: Civil Rights and Equal
 * Protection.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.civil-rights-equality.v1`. Covers the Fourteenth
 * Amendment's Equal Protection Clause; Brown v. Board of Education (1954)
 * and resistance to its implementation; the context and argument structure
 * of MLK's "Letter from Birmingham Jail" (1963); the Civil Rights Act of
 * 1964, Voting Rights Act of 1965, and Title IX (1972); and the NAACP's
 * litigation strategy.
 *
 * COPYRIGHT NOTE — MLK "LETTER FROM BIRMINGHAM JAIL" (1963): the Letter is
 * still under copyright, per the source lesson plan. This baseline
 * describes its context and argument structure ENTIRELY IN ITS OWN WORDS —
 * ZERO quoted sentences from the Letter appear anywhere below. The only
 * Letter-associated language reproduced is the two-word named concept
 * "constructive tension," used as a term of art, not as an excerpted
 * sentence.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_CIVIL_RIGHTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.civil-rights-equality.v1',
  course: 'AP US Government & Politics',
  cedUnit: 3,
  cedTopic: '3.10-3.13',
  cedTitle: 'Civil Rights & Equal Protection',
  planId: 'evelyn.ap.apgov.civil-rights-equality.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.civil-rights-equality.v1' }],
  theory: [
    {
      loId: 'apgov.civil-rights-equality',
      kind: 'definition',
      title: 'Equal Protection Clause',
      content:
        'Fourteenth Amendment provision barring states from denying "any person within its jurisdiction the equal protection of the laws." A distinct guarantee from the Due Process Clause: government must not draw arbitrary or invidious distinctions among people, particularly on the basis of protected characteristics like race. Basis for Brown v. Board of Education (1954).',
    },
    {
      loId: 'apgov.civil-rights-equality',
      kind: 'concept',
      title: 'civil rights vs. civil liberties',
      content:
        'CIVIL RIGHTS doctrine concerns the promise of EQUAL treatment under the Equal Protection Clause. CIVIL LIBERTIES doctrine (the earlier lessons in this unit — speech, religion, due process, search and seizure) concerns protections against government overreach more broadly. Keep the two categories distinct.',
    },
    {
      loId: 'apgov.civil-rights-equality',
      kind: 'event',
      title: 'Brown v. Board of Education (1954)',
      content:
        'Consolidated challenges to state-mandated racial segregation in public schools. The Supreme Court (Chief Justice Warren) held that segregating children in public schools solely on the basis of race deprives them of equal educational opportunities, and REJECTED the "separate but equal" doctrine that had permitted state-mandated segregation since Plessy v. Ferguson (1896): separate educational facilities are "inherently unequal," violating the Fourteenth Amendment\'s Equal Protection Clause. The harm the Court identified is psychological/social (a feeling of inferiority), not merely a gap in physical resources — so the holding does not depend on the segregated facilities being tangibly unequal.',
    },
    {
      loId: 'apgov.civil-rights-equality',
      kind: 'concept',
      title: 'resistance to Brown\'s implementation',
      content:
        'Brown did not desegregate schools immediately. Many Southern states and districts engaged in years of open defiance and delay (sometimes called "massive resistance"), so meaningful desegregation in much of the South did not occur until well over a decade later, in some places only after further court orders and federal enforcement. Brown established the constitutional PRINCIPLE; enforcing it on the ground was a separate, prolonged struggle — the resistance does not mean the ruling was wrong or reversed.',
    },
    {
      loId: 'apgov.civil-rights-equality',
      kind: 'concept',
      title: '"Letter from Birmingham Jail" (1963) — context',
      content:
        "Written by Martin Luther King Jr. while jailed in Birmingham, Alabama, after his arrest during a campaign of nonviolent direct action (marches and demonstrations without a permit) against the city's segregation laws. The letter responds to a public statement from a group of white clergymen who had criticized King's campaign as unwise and poorly timed, urging that the fight against segregation be pursued through the courts and negotiation alone, more slowly.",
    },
    {
      loId: 'apgov.civil-rights-equality',
      kind: 'concept',
      title: '"Letter from Birmingham Jail" — argument structure (described, not quoted)',
      content:
        'King distinguishes JUST from UNJUST laws: a law is unjust, and one a person has a moral responsibility to disobey openly (while accepting the legal penalty), when it degrades human dignity, is imposed on a group with no voice in enacting it, or is applied unequally in practice even if neutral on its face. He defends nonviolent direct action as necessary because negotiation had repeatedly failed: its purpose is to create a crisis and foster "CONSTRUCTIVE TENSION" that forces a community which has consistently refused to confront an issue voluntarily to finally negotiate it. He also criticizes the moderate reader (including the clergymen he answers) for prioritizing the appearance of order and a gradual timeline over the substance of justice, arguing this kind of moderation functions in practice as a greater obstacle to progress than open hostility from an outright opponent.',
    },
    {
      loId: 'apgov.civil-rights-equality',
      kind: 'definition',
      title: 'constructive tension',
      content:
        'The named concept, from King\'s "Letter from Birmingham Jail," describing the intended effect of nonviolent direct action: creating a crisis that forces a community which has refused to negotiate voluntarily to finally confront and address an issue.',
    },
    {
      loId: 'apgov.civil-rights-equality',
      kind: 'concept',
      title: 'the 1960s-70s civil rights statutes',
      content:
        'CIVIL RIGHTS ACT OF 1964: prohibits discrimination on the basis of race, color, religion, sex, and national origin, including in employment (Title VII) and public accommodations (restaurants, hotels) — reaching PRIVATE conduct the Equal Protection Clause alone (which restrains only government action) could not. VOTING RIGHTS ACT OF 1965: targets the specific tools (literacy tests and similar barriers) used to disenfranchise Black voters, authorizing direct federal oversight of voting procedures in jurisdictions with a history of discrimination. TITLE IX (1972): prohibits sex-based discrimination in any educational program or activity receiving federal funding, most commonly associated with school athletics but reaching sex discrimination in education far more broadly.',
    },
    {
      loId: 'apgov.civil-rights-equality',
      kind: 'concept',
      title: 'the NAACP litigation strategy',
      content:
        'Well before the 1964-65 legislation, the NAACP pursued a sustained, deliberate LITIGATION strategy — a sequence of federal lawsuits (including the cases consolidated into Brown itself) designed to chip away at "separate but equal" case by case, treating federal courts as a primary venue for civil rights advances. Civil-rights case filings in U.S. district courts grew enormously across the following decades: 709 filings in 1964, 18,922 by 1990, peaking at 43,278 in 1997, easing to 32,865 by 2006, and still running at 41,044 in 2020 — evidence the federal courts remained central for decades, not just in the immediate aftermath of Brown.',
    },
    {
      loId: 'apgov.civil-rights-equality',
      kind: 'trap',
      title: 'Brown addressed public schools and government action, not private businesses',
      content:
        'Assuming Brown\'s rejection of "separate but equal" applied automatically to all forms of segregation everywhere, including private businesses, is a common error. Brown addressed PUBLIC (government-run) SCHOOLS specifically; the Equal Protection Clause restrains government action, not private conduct. Ending segregation in privately owned public accommodations required the Civil Rights Act of 1964, a federal STATUTE — a gap the Constitution alone, even after Brown, could not close.',
    },
  ],
  methods: [
    {
      title: 'Distinguish civil rights (Equal Protection) claims from civil liberties (Due Process) claims',
      when_to_use:
        'Use this whenever a prompt asks which constitutional provision or doctrine governs a scenario involving unequal treatment vs. a scenario involving government overreach on an individual right.',
      steps: [
        'ASK WHETHER THE COMPLAINT IS ABOUT UNEQUAL TREATMENT among people/groups (Equal Protection, civil rights) or about a burden on a specific individual right like speech, religion, search/seizure, or counsel (Due Process/civil liberties).',
        'IF EQUAL PROTECTION, identify the classification at issue (e.g. race) and check whether Brown v. Board of Education\'s "inherently unequal" reasoning or a related equal-protection precedent applies.',
        'CHECK WHETHER THE ACTOR IS GOVERNMENT OR PRIVATE. The Equal Protection Clause (like Due Process) restrains only government action — private discrimination requires a STATUTORY basis (e.g. the Civil Rights Act of 1964), not the Constitution alone.',
        'STATE THE CONCLUSION PRECISELY, distinguishing the constitutional claim (if any) from any statutory claim available only because of a later Act of Congress.',
      ],
      example: {
        problem: 'A privately owned restaurant refuses to serve customers based on race. Does the Equal Protection Clause apply directly? What does?',
        solution:
          'No — the Equal Protection Clause restrains only government action, and a private restaurant is not a government actor, so the Constitution alone (even after Brown) does not reach this. The Civil Rights Act of 1964 fills that gap by federal statute, prohibiting race discrimination in public accommodations like restaurants.',
      },
      relatedLoIds: ['apgov.civil-rights-equality'],
    },
    {
      title: 'Explain King\'s argument in your own words without quoting the Letter',
      when_to_use:
        'Use this whenever a prompt asks about the reasoning in "Letter from Birmingham Jail" — the Letter is copyrighted, so responses must paraphrase, not quote.',
      steps: [
        'IDENTIFY WHICH PART OF THE ARGUMENT the prompt is asking about: the just/unjust law distinction, the defense of nonviolent direct action, or the criticism of the moderate.',
        'STATE THE REASONING IN YOUR OWN WORDS — describe the argument\'s structure and logic without reproducing sentences from the actual text.',
        'THE ONLY PERMITTED NAMED-CONCEPT LANGUAGE is the two-word term "constructive tension" — used as a term of art, not as a quoted sentence.',
        'CONNECT THE ARGUMENT TO ITS HISTORICAL CONTEXT (responding to clergymen urging patience/negotiation) if the prompt asks for context.',
      ],
      relatedLoIds: ['apgov.civil-rights-equality'],
    },
  ],
  pointers: [
    { content: 'Brown v. Board of Education addressed PUBLIC schools and government action — it did not, by itself, reach private businesses like restaurants or hotels. That required the Civil Rights Act of 1964.', kind: 'trap' },
    { content: 'Equal Protection (civil rights) is a distinct doctrine from Due Process (civil liberties, covered earlier in the unit) — don\'t conflate the two.', kind: 'trap' },
    { content: 'When discussing "Letter from Birmingham Jail," paraphrase the argument — do not quote sentences from the copyrighted text. Only "constructive tension" is a permitted named term.', kind: 'tip' },
    { content: 'Brown\'s constitutional holding (1954) and its on-the-ground enforcement are separate things — years of resistance after Brown do not mean the ruling was wrong or reversed.', kind: 'tip' },
    { content: 'The Civil Rights Act (1964), Voting Rights Act (1965), and Title IX (1972) are STATUTES extending protection into areas (private conduct, voting procedures, federally funded education) the Equal Protection Clause alone could not reach.', kind: 'tip' },
  ],
};
