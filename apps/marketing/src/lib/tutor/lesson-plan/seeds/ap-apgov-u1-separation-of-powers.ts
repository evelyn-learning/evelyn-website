/**
 * AP US Government & Politics — CED Unit 1.6: Principles of American
 * Government — Separation of Powers & Checks and Balances.
 *
 * Unit-1 Vertical Slice content plan (follows the democratic-ideals
 * calibration template — see ap-apgov-u1-democratic-ideals.ts for the full
 * rationale and docs/superpowers/specs/2026-07-11-ap-us-government-design.md
 * for the shared Passage/rubric infra this plan reuses).
 *
 * Covers separation of powers (the STRUCTURAL divide into three branches)
 * versus checks and balances (the specific TOOLS — veto/override, advice
 * and consent, judicial review, impeachment — each branch holds to limit
 * the others), and the deliberate design tradeoff of stalemate/gridlock in
 * exchange for safety against concentrated power.
 *
 * Anchor text: Federalist No. 51 (Madison, 1788) —
 * evelyn.passage.apgov-federalist-51.v1 (seeded excerpt is the FULL two
 * paragraphs: "ambition must be made to counteract ambition" / "if men were
 * angels" in the first, and the "double security" of the compound-republic
 * argument in the second — trimmed with internal ellipses per the passage's
 * own docblock, otherwise verbatim public-domain text). The concept carries
 * the passageId; the worked example quotes the full seeded text directly
 * (worked_example has no passageId field). The second paragraph's federalism
 * preview is used deliberately to set up the next lesson.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U1_SEPARATION_OF_POWERS: LessonPlan = {
  id: 'evelyn.ap.apgov.separation-of-powers.v1',
  title: 'U1.6 Separation of Powers & Checks and Balances',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.separation-of-powers',
      description:
        'Explain the separation of powers among the legislative, executive, and judicial branches, and the checks and balances (veto/override, advice and consent, judicial review, impeachment) each branch holds over the others, including why the design deliberately trades efficiency for stalemate.',
      standard: 'AP-APGOV-1.6',
    },
  ],
  prerequisites: ['apgov.constitution-ratification'],
  followUps: ['apgov.federalism-foundations'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see legislative-executive gridlock as an intended cost of the constitutional design, not a malfunction of it.',
      script:
        "Last lesson ended with the Constitution ratified and a government up and running. Here's a question that trips up a lot of people: why does the U.S. government so often seem STUCK — a bill stalls, a nominee waits months for confirmation, a law gets challenged in court for years? It's tempting to call that dysfunction. But the Framers built it that way ON PURPOSE. James Madison, defending the Constitution's structure in Federalist No. 51, argued that the real danger wasn't gridlock — it was any ONE branch of government getting too much power, too fast, with nothing to stop it. So instead of trusting officeholders to behave, the Constitution splits power three ways and arms each branch with tools to fight back if another branch overreaches. Today we're mapping exactly what those tools are, and why Madison thought forcing branches to fight each other was the safest design of all.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-separation-and-checks',
      kind: 'concept',
      goal: 'Explain separation of powers versus checks and balances, name the specific constitutional check mechanisms (veto/override, advice and consent, judicial review, impeachment), and explain why the design deliberately trades efficiency for stalemate.',
      keyIdeas: [
        'SEPARATION OF POWERS: the Constitution divides governmental power across three branches, each with distinct constitutional functions — legislative (Article I: Congress makes law), executive (Article II: the President enforces law), and judicial (Article III: federal courts interpret law).',
        'CHECKS AND BALANCES IS NOT THE SAME THING AS SEPARATION OF POWERS. Separation of powers is the STRUCTURAL divide into three branches. Checks and balances are the specific TOOLS each branch holds to limit the OTHER branches, so the divide doesn\'t let any one branch act unchecked. They are related — checks and balances only make sense because power is separated first — but they are not interchangeable terms (more on this common mix-up in the misconception check below).',
        'VETO / OVERRIDE: the President may veto (reject) a bill Congress has passed (Article I, §7). Congress can then override that veto and enact the law anyway with a two-thirds vote in BOTH the House and the Senate — a legislative check on the executive that requires a supermajority to use.',
        'ADVICE AND CONSENT: the Senate must confirm, by majority vote, many presidential appointments (Cabinet secretaries, federal judges, Supreme Court justices) and must ratify treaties by a two-thirds vote (Article II, §2) — a legislative check on the executive\'s appointment and treaty-making power.',
        'JUDICIAL REVIEW — NOT IN ARTICLE III\'S TEXT. Judicial review is the power of federal courts to declare a law or executive action unconstitutional. Article III does NOT explicitly grant this power. The Supreme Court asserted it for itself in Marbury v. Madison (1803), where Chief Justice John Marshall struck down part of the Judiciary Act of 1789 as exceeding Congress\'s constitutional authority. Judicial review is a judicial check on both the legislative and executive branches, established by precedent rather than constitutional text.',
        'IMPEACHMENT: the House of Representatives has the sole power to impeach — by majority vote — civil officers, including the President, for "Treason, Bribery, or other high Crimes and Misdemeanors" (Article II, §4). The Senate has the sole power to TRY impeachments; conviction (which removes the official from office) requires a two-thirds vote of the Senate. Impeachment is a legislative check that reaches into both the executive and judicial branches.',
        'FEDERALIST NO. 51\'S ARGUMENT: Madison defends this design on INCENTIVE, not virtue — "ambition must be made to counteract ambition." Each branch\'s officeholders are given both the constitutional tools above and the personal, institutional self-interest to resist encroachment by the other branches, rather than the system relying on good character alone.',
        '"IF MEN WERE ANGELS..." Madison\'s reasoning has two layers: government is necessary at all because ordinary people cannot be trusted to govern themselves without it; and INTERNAL controls on government (checks and balances) are just as necessary, because the people WHO govern are not angels either — power must check power at every level.',
        'DESIGNED-IN STALEMATE: because power is fragmented across branches this way — and, as Federalist 51\'s second paragraph argues, further subdivided by federalism between the national and state governments (previewed here, covered fully in the next lesson) — no single branch or actor can govern unilaterally. The system deliberately trades efficiency for safety: a President and an opposing-party Congress fighting a bill to a stalemate, or a nominee waiting months for Senate confirmation, are a predictable, INTENDED cost of preventing any one branch from concentrating power, not evidence the system is broken.',
      ],
      vocabulary: [
        {
          term: 'separation of powers',
          definition:
            'the constitutional division of governmental power into three branches — legislative, executive, judicial — each with distinct functions.',
        },
        {
          term: 'checks and balances',
          definition:
            'the specific constitutional tools (veto/override, advice and consent, judicial review, impeachment) each branch holds to limit the power of the other branches.',
        },
        {
          term: 'veto',
          definition:
            "the President's constitutional power to reject a bill passed by Congress (Article I, §7).",
        },
        {
          term: 'override',
          definition:
            "Congress's power to enact a law despite a presidential veto, requiring a two-thirds vote in both the House and Senate.",
        },
        {
          term: 'advice and consent',
          definition:
            "the Senate's constitutional role in confirming (majority vote) major presidential appointments and ratifying treaties (two-thirds vote).",
        },
        {
          term: 'judicial review',
          definition:
            'the power of federal courts to declare a law or executive action unconstitutional; not stated in Article III\'s text, established by the Supreme Court itself in Marbury v. Madison (1803).',
        },
        {
          term: 'impeachment',
          definition:
            'the process by which the House impeaches (majority vote) and the Senate tries and can convict/remove (two-thirds vote) a civil officer, including the President, for "Treason, Bribery, or other high Crimes and Misdemeanors."',
        },
      ],
      passageId: 'evelyn.passage.apgov-federalist-51.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-federalist-51-ambition',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt — the full seeded text — from Federalist No. 51 (James Madison, 1788): "But the great security against a gradual concentration of the several powers in the same department, consists in giving to those who administer each department the necessary constitutional means, and personal motives, to resist encroachments of the others. ... Ambition must be made to counteract ambition. The interest of the man must be connected with the constitutional rights of the place. ... If men were angels, no Government would be necessary. If angels were to govern men, neither external nor internal controls on Government would be necessary.\n\nFirst. In a single republic, all the power surrendered by the People is submitted to the administration of a single Government; and the usurpations are guarded against, by a division of the Government into distinct and separate departments. In the compound republic of America, the power surrendered by the People is first divided between two distinct Governments, and then the portion allotted to each, subdivided among distinct and separate departments. Hence a double security arises to the rights of the People. The different Governments will control each other, at the same time that each will be controlled by itself." What is Madison\'s core argument for WHY checks and balances actually work, and what does the second paragraph add to that argument?',
      steps: [
        'SOURCE IT FIRST. Federalist No. 51, written by James Madison as "Publius," published 1788 as part of the same essay series that includes Federalist No. 10 — this essay specifically defends the Constitution\'s internal structure (separation of powers and checks and balances) against fears of concentrated power.',
        'FIND THE CORE MECHANISM. "[T]he great security against a gradual concentration of the several powers in the same department, consists in giving to those who administer each department the necessary constitutional means, and personal motives, to resist encroachments of the others." Madison\'s claim: what actually prevents one branch from swallowing the others isn\'t a written rule alone — it\'s giving each branch\'s officeholders both the constitutional TOOLS (veto/override, advice and consent, judicial review, impeachment) and the personal INCENTIVE to use them.',
        '"AMBITION MUST BE MADE TO COUNTERACT AMBITION." Rather than relying on officeholders\' virtue, the system channels self-interested ambition: officials naturally want to protect and expand their own branch\'s power, and the Constitution is designed so that this exact ambition, in each branch, resists the ambition of the others — competition among self-interested actors, not good character, is what holds the system in balance.',
        '"IF MEN WERE ANGELS..." — TWO LAYERS OF THE ARGUMENT. "If men were angels, no Government would be necessary" — government exists because ordinary people cannot be trusted to behave without it. "If angels were to govern men, neither external nor internal controls on Government would be necessary" — but since those who GOVERN are not angels either, internal controls (checks and balances among the branches) are just as necessary as government\'s controls over the governed.',
        'THE SECOND PARAGRAPH — "DOUBLE SECURITY." Madison contrasts "a single republic," where the only protection against tyranny is dividing ONE government into departments, with "the compound republic of America," where power is FIRST divided between two distinct governments (national and state) and THEN subdivided further among departments within each. This is a SECOND, independent layer of protection beyond separation of powers alone — federalism itself functions as a check.',
        'STATE THE LINK TO THE COURSE THESIS. Checks and balances are the specific tools that make separation of powers actually work in practice, per Madison\'s ambition-counteracting-ambition logic — and the essay\'s own second paragraph previews that this is only HALF the story. The next lesson picks up federalism, the "double security" Madison describes as the other half.',
      ],
      answer:
        'Madison argues that what actually prevents power from concentrating in one branch is not virtue but incentive: giving each branch\'s officeholders both constitutional tools and personal motives to resist the others\' encroachment — "ambition must be made to counteract ambition." Government itself is necessary because people are not angels, and internal controls on government (checks and balances) are equally necessary because those who govern are not angels either. The second paragraph adds a further, independent layer: unlike "a single republic" protected only by dividing one government into departments, "the compound republic of America" divides power FIRST between national and state governments and THEN subdivides it again within each — a "double security" in which federalism itself, not just separation of powers, checks potential tyranny.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        "Concept Application practice. Congress passes a controversial law creating a new federal regulatory agency, over the objection of the President, who believes the law oversteps executive authority. (a) Describe the tool the President could use in response to the bill BEFORE it becomes law, and explain what Congress could do to enact the law anyway despite the President's objection. (b) A few months later, the agency's first director resigns, and the President nominates a replacement. Explain how the Senate's power of advice and consent applies to this nomination. (c) A different group later sues, arguing the law itself is unconstitutional. Explain how a federal court could resolve this dispute using judicial review, and note one important fact about where that power does NOT come from.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly describes the veto as the President\'s pre-enactment tool, and correctly explains that Congress can override the veto with a two-thirds vote in BOTH chambers to enact the law anyway. No credit for a response that omits the two-thirds/both-chambers requirement or names the wrong tool.',
            modelResponse:
              "Before the bill becomes law, the President could veto it, refusing to sign it. Congress could still enact the law over that objection by overriding the veto — but only with a two-thirds vote in both the House and the Senate, a deliberately high bar that requires broad, bipartisan support to override the executive.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains that the Senate must confirm the nominee by majority vote before the new director can take office, correctly identifying this as advice and consent. No credit for a response that describes a different chamber or process, or omits the confirmation requirement.",
            modelResponse:
              'Advice and consent means the Senate must review and confirm the President\'s nominee for agency director by majority vote before that person can officially take office — giving the Senate a real check on who leads the agency, not just a formality.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that a federal court could use judicial review to strike down the law if it is found unconstitutional, AND correctly notes that judicial review is not explicitly granted by Article III\'s text but was established by the Supreme Court itself in Marbury v. Madison (1803). No credit for a response that omits the Article-III/Marbury point.',
            modelResponse:
              "A federal court could use judicial review to strike down the law as unconstitutional if it finds Congress or the President exceeded their constitutional authority in creating the agency. Importantly, this power is not written into Article III's text — the Supreme Court established judicial review for itself in Marbury v. Madison (1803), so it rests on precedent rather than an explicit constitutional grant.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-checks-equals-separation',
      kind: 'misconception_check',
      question:
        'True or false: "separation of powers" and "checks and balances" are just two different names for the same constitutional principle.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating the STRUCTURAL divide of government into three branches (separation of powers) as identical to the specific TOOLS each branch uses to limit the others (checks and balances), rather than recognizing checks and balances as a distinct mechanism layered ON TOP of that divide.',
          correctsTo:
            'FALSE. These are related but distinct principles. SEPARATION OF POWERS is the structural choice to divide governmental power into three branches, each with its own constitutional function: Congress (Article I) makes law, the President (Article II) enforces law, and the courts (Article III) interpret law. CHECKS AND BALANCES are the specific TOOLS the Constitution gives each branch to limit the OTHER branches so that the separation doesn\'t let any one branch act unchecked — the President\'s veto and the Senate\'s power to override it, the Senate\'s advice and consent over appointments and treaties, the courts\' judicial review of laws and executive actions (a power, notably, not written into Article III\'s text but established by the Supreme Court itself in Marbury v. Madison, 1803), and Congress\'s power of impeachment. Without separation of powers, there would be nothing distinct for checks and balances to check; without checks and balances, separation of powers alone would not, per Madison\'s Federalist No. 51 argument, reliably prevent one branch from dominating the others.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Separation of powers = the STRUCTURAL division of government into three branches with distinct constitutional roles; checks and balances = the specific TOOLS each branch has to limit the others — related but not the same thing.',
        'Veto/override: the President can veto a bill; Congress can override with a two-thirds vote in both chambers. Advice and consent: the Senate confirms major appointments (majority) and ratifies treaties (two-thirds).',
        'Judicial review — the power to strike down unconstitutional laws or actions — is NOT written into Article III\'s text; the Supreme Court established it for itself in Marbury v. Madison (1803).',
        'Impeachment: the House impeaches by majority vote; the Senate tries the case and convicts (removing an official from office) with a two-thirds vote.',
        'Federalist 51: "ambition must be made to counteract ambition" — checks and balances work by giving officeholders self-interested incentive to resist encroachment, not by relying on virtue; the essay\'s second paragraph previews federalism as a second, independent "double security" (next lesson).',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.6',
    cedTitle: 'Principles of American Government: Separation of Powers & Checks and Balances',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-federalist-51.v1',
        chapter: '1788',
        note: 'Federalist No. 51 — Madison\'s "ambition must be made to counteract ambition" argument for checks and balances, and the "double security"/compound-republic preview of federalism.',
      },
    ],
  },
};
