/**
 * AP US Government & Politics — CED Unit 2.15: Policy-Making Across the
 * Branches.
 *
 * Unit-2 Vertical Slice content plan (follows the Unit-1 calibration
 * template — see ap-apgov-u1-federalism.ts for the shared Passage/rubric
 * infra this plan reuses). Closing, synthesis lesson for Unit 2 —
 * following directly from ap-apgov-u2-bureaucracy.ts and drawing on all
 * four prior U2 institutional lessons (Congress, the Presidency, the
 * Judiciary, the Bureaucracy) at once.
 *
 * NO WIRED DOCUMENT: like ap-apgov-u2-bureaucracy.ts, this synthesis
 * lesson has no passageId on any segment — no Task-1 passage models a
 * multi-branch policy scenario, so the concept and worked example instead
 * use a hypothetical-but-realistic immigration-enforcement scenario to
 * show how one policy issue moves across Congress, the President, the
 * bureaucracy, and the courts.
 *
 * Covers divided versus unified government; confirmation battles as a
 * political check; the budget process and the power of the purse;
 * oversight versus executive privilege; and how a single policy issue
 * moves across all three branches plus the bureaucracy.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U2_CHECKS_IN_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apgov.checks-in-practice.v1',
  title: 'U2.15 Policy-Making Across the Branches',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.checks-in-practice',
      description:
        'Explain divided versus unified government; confirmation battles as a political check; the budget process and the power of the purse; the tension between congressional oversight and executive privilege; and how a single policy issue moves across the legislative, executive, and judicial branches and the bureaucracy in practice.',
      standard: 'AP-APGOV-2.15',
    },
  ],
  prerequisites: [
    'apgov.congress-structure',
    'apgov.presidency-power',
    'apgov.judiciary-independence',
    'apgov.bureaucracy-accountability',
  ],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see that asking "which branch controls policy X?" is often the wrong question — most real policy issues move through all three branches and the bureaucracy at once, repeatedly.',
      script:
        "We've now covered Congress, the Presidency, the Judiciary, and the Bureaucracy separately, one at a time. Here's the catch: real policy almost never stays inside just one of those boxes. Ask \"which branch controls immigration policy?\" or \"which branch controls war powers?\" and the honest answer is: all of them, constantly pushing and responding to each other. Congress passes a law, an agency writes the rules implementing it, the President directs how aggressively to enforce it, someone sues, and a court decides whether the agency went too far — and then Congress can respond all over again, with new legislation or a budget rider. Today we put every piece from this unit together — Congress, the presidency, the judiciary, the bureaucracy — and trace how one policy fight actually moves through all of them, and what \"divided government\" really changes about that process.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-checks-in-practice',
      kind: 'concept',
      goal: 'Explain divided versus unified government, confirmation battles, the budget process, oversight versus executive privilege, and how a policy issue moves across all three branches and the bureaucracy.',
      keyIdeas: [
        'DIVIDED VS. UNIFIED GOVERNMENT: government is UNIFIED when the same party controls the presidency, the House, and the Senate simultaneously, making it easier (though never automatic) to pass that party\'s agenda. Government is DIVIDED when at least one chamber of Congress is controlled by a different party than the presidency. Divided government makes passing major legislation harder and increases reliance on negotiation, compromise, and the other tools covered in this unit — but it does not make legislating impossible; major bipartisan laws have passed under divided government throughout U.S. history.',
        'CONFIRMATION BATTLES: the Senate\'s advice-and-consent role over presidential nominations (judges, justices, and top executive officials) is a recurring, high-stakes political check, especially under divided government or a closely split Senate — an opposing-party Senate majority can delay, condition, or ultimately deny confirmation, shaping who actually staffs the executive and judicial branches regardless of who won the presidency.',
        'THE BUDGET PROCESS AND THE POWER OF THE PURSE: Congress\'s constitutional power over spending (Article I, §9: no money may be drawn from the Treasury except by appropriations made by law) means EVERY federal agency and program ultimately depends on Congress passing appropriations to fund it. This gives Congress a check that operates on every other actor in this unit — the presidency, the bureaucracy, even the courts\' operating budgets — regardless of what any of them wants to do. When Congress and the President cannot agree on appropriations, the result can be a temporary CONTINUING RESOLUTION (funding at existing levels) or, if even that fails, a GOVERNMENT SHUTDOWN.',
        'OVERSIGHT VS. EXECUTIVE PRIVILEGE: congressional oversight (hearings, investigations, subpoenas) frequently collides with EXECUTIVE PRIVILEGE — the President\'s claimed authority to keep certain internal executive-branch communications confidential from Congress and the courts. Executive privilege is NOT explicit in the Constitution\'s text, but the Supreme Court recognized it as a real, though QUALIFIED (not absolute), presidential power in United States v. Nixon (1974) — the same decision that held the privilege must yield when weighed against a specific, demonstrated need for evidence in a criminal proceeding. The tension between oversight and privilege recurs any time Congress investigates the executive branch.',
        'ONE POLICY ISSUE, ALL BRANCHES: a single policy area — immigration enforcement, for example — typically moves through every institution covered in this unit, often repeatedly: Congress passes a broad statute setting immigration policy goals; the relevant agency (bureaucracy) issues detailed rules and enforcement guidance implementing it, using delegated rulemaking authority; the President directs the agency\'s enforcement PRIORITIES through executive action, an informal power; affected parties sue, arguing the agency\'s guidance exceeds the authority Congress actually delegated; a federal court exercises judicial review, potentially striking the guidance down; and Congress can then respond again — with new legislation, an appropriations rider restricting how funds may be used, or oversight hearings — restarting the cycle. No single branch has the final, permanent word.',
      ],
      vocabulary: [
        {
          term: 'unified government',
          definition:
            'the same political party simultaneously controls the presidency, the House, and the Senate.',
        },
        {
          term: 'divided government',
          definition:
            'at least one chamber of Congress is controlled by a different party than the presidency, making legislative agreement harder to reach.',
        },
        {
          term: 'power of the purse',
          definition:
            "Congress's constitutional control over federal spending (Article I, §9) — no funds may leave the Treasury without an appropriation Congress passed.",
        },
        {
          term: 'continuing resolution',
          definition:
            'temporary legislation funding the government at existing levels when Congress and the President have not agreed on new appropriations by the deadline.',
        },
        {
          term: 'executive privilege',
          definition:
            "the President's claimed authority to keep certain internal executive-branch communications confidential from Congress and the courts; not explicit in the Constitution, recognized as real but QUALIFIED (not absolute) in United States v. Nixon (1974).",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-immigration-policy-across-branches',
      kind: 'worked_example',
      problem:
        'Analyze this policy sequence. Congress passes a statute directing the relevant federal agency to "prioritize enforcement resources toward removable individuals who pose a public safety risk," without listing every enforcement category in the statute itself. The agency then issues detailed enforcement guidance implementing that statute. A newly elected President, from the opposite party of the Senate majority, directs the agency (via executive action) to substantially narrow which categories of individuals count as enforcement priorities. A group opposed to the change sues, arguing the new guidance exceeds the discretion Congress actually granted in the statute. Separately, the Senate delays confirming the President\'s nominee to lead the agency for several months. Walk through which institution is acting at each stage, and what kind of power or check each one is exercising.',
      steps: [
        'STAGE 1 — CONGRESS (LEGISLATIVE, DELEGATED AUTHORITY). Congress sets the broad policy goal in a statute but delegates discretion over the enforcement specifics to the agency — the same delegated rulemaking authority covered in the bureaucracy lesson, exercised here because Congress cannot anticipate every enforcement scenario in advance.',
        'STAGE 2 — THE AGENCY (BUREAUCRACY, RULEMAKING). The agency uses that delegated discretion to issue detailed enforcement guidance — this is the bureaucracy translating a broad statutory goal into an operational policy.',
        'STAGE 3 — THE PRESIDENT (EXECUTIVE, INFORMAL POWER). The President\'s direction to the agency to narrow enforcement priorities is an exercise of INFORMAL executive power — not a new law, but a directive shaping how existing law and delegated agency discretion get used, the same kind of action covered in the presidency lesson.',
        'STAGE 4 — THE COURTS (JUDICIAL REVIEW). The lawsuit puts the judiciary in its checking role: a court must decide whether the new guidance is still within the discretion Congress actually delegated, or whether it exceeds that delegation — judicial review of an executive/bureaucratic action, the same power established in Marbury v. Madison and applied here to an agency\'s guidance rather than a statute.',
        'STAGE 5 — THE SENATE (CONFIRMATION BATTLE, DIVIDED GOVERNMENT). The Senate delay over the agency-leadership nominee is a textbook confirmation battle occurring under DIVIDED GOVERNMENT (opposite-party Senate majority): the Senate\'s advice-and-consent role becomes a political check that can shape who actually leads the agency independent of the statute\'s or the President\'s preferences.',
        'THE BIG PICTURE. No stage here is the "final" word — Congress could still respond with new legislation or an appropriations rider restricting how the agency may spend enforcement funds, restarting the cycle. This is what "policy moves across all three branches and the bureaucracy" concretely looks like: not one decision, but a repeating sequence of delegation, implementation, direction, challenge, and response.',
      ],
      answer:
        'Congress (legislative) sets the broad goal and delegates enforcement discretion to the agency; the agency (bureaucracy) exercises that delegated rulemaking authority to issue detailed guidance; the President (executive, informal power) redirects the agency\'s priorities through executive action; the courts (judicial review) then decide whether the new guidance still falls within the discretion Congress delegated; and separately, the Senate\'s confirmation delay over the agency\'s leadership nominee is a divided-government confirmation battle, a political check exercised through the advice-and-consent process. None of these is a final, permanent resolution — Congress retains the ability to pass new legislation, attach appropriations conditions, or hold oversight hearings, which can restart the entire cycle. This sequence is what it concretely looks like for one policy issue to move across all three branches and the bureaucracy.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        "Concept Application practice. A newly elected President wants to shift federal immigration-enforcement priorities. (a) Explain ONE informal power the President could use to redirect the bureaucracy's enforcement priorities without passing new legislation. (b) The Senate, controlled by the opposite party, delays confirming the President's nominee to lead the enforcement agency for several months. Identify whether this reflects divided or unified government, and explain how the Senate's advice-and-consent role functions as a check in this situation. (c) A civil-rights organization sues, arguing the agency's new enforcement guidance exceeds the discretion Congress granted in the original statute. Explain how a federal court could resolve this dispute.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies an executive order or other executive action directing agency enforcement priorities as an informal power, with a brief explanation. No credit for a response that names a formal power or omits the informal-power framing.',
            modelResponse:
              "The President could issue an executive order or other executive directive instructing the agency to prioritize (or deprioritize) particular categories of enforcement. This is an informal power: it is not explicitly listed in Article II, but it lets the President shape how existing law and delegated agency discretion are actually used.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies divided government (opposite parties controlling the presidency and the Senate) and explains that the Senate\'s advice-and-consent role lets it delay or withhold confirmation as a check on executive appointments. No credit for identifying unified government or omitting the advice-and-consent mechanism.',
            modelResponse:
              "This is an example of divided government, since the Senate majority belongs to a different party than the President. The Senate's advice-and-consent role over presidential nominations lets it function as a check here: by delaying confirmation, the opposition-controlled Senate can slow or complicate the President's ability to install agency leadership aligned with the new enforcement priorities.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that a federal court can exercise judicial review to determine whether the guidance exceeds the discretion Congress delegated (or is arbitrary and capricious), potentially striking it down. No credit for a response that omits judicial review or misapplies the standard.',
            modelResponse:
              "A federal court can use judicial review to examine whether the agency's new enforcement guidance is a permissible exercise of the discretion Congress delegated in the original statute, or whether it exceeds that authority or is arbitrary and capricious. If the court finds the guidance goes beyond what Congress authorized, it can strike the guidance down, requiring the agency to revise its approach.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-divided-government-nothing-passes',
      kind: 'misconception_check',
      question:
        'True or false: under divided government, it is essentially impossible for Congress and the President to pass any significant legislation together.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating divided government\'s tendency to make legislative agreement HARDER as equivalent to making it IMPOSSIBLE, rather than recognizing that major bipartisan legislation has repeatedly passed under divided government throughout U.S. history.',
          correctsTo:
            "FALSE. Divided government makes passing major legislation more difficult and typically requires more negotiation, compromise, and use of the tools covered in this unit — but it does not make legislation impossible. Significant bipartisan laws have passed under divided government at various points in U.S. history, often precisely because neither party controls every veto point and must bargain to get anything enacted. \"Gridlock\" and stalemate are common outcomes of divided government, not guaranteed ones — and even when major new legislation stalls, the other institutions covered in this unit (the bureaucracy's rulemaking, the President's informal powers, the courts' judicial review) keep producing policy outcomes in the meantime.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Unified government = one party controls the presidency and both chambers; divided government = at least one chamber is controlled by the opposing party — divided government makes legislating harder, not impossible.',
        'Confirmation battles: the Senate\'s advice-and-consent role is a recurring political check, especially salient under divided government.',
        'The power of the purse (Article I, §9): no federal spending happens without a congressional appropriation — this check reaches the presidency, the bureaucracy, and the courts\' operating budgets alike. Failure to agree can produce a continuing resolution or a shutdown.',
        'Executive privilege is real but QUALIFIED, not absolute — recognized in United States v. Nixon (1974), which also held it must yield to a demonstrated need for evidence in a criminal proceeding, illustrating the recurring oversight-vs-privilege tension.',
        'A single policy issue (e.g. immigration enforcement) typically cycles through Congress (delegating authority), the bureaucracy (rulemaking), the President (informal direction), the courts (judicial review), and back to Congress again — no one branch has the final, permanent word.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.15',
    cedTitle: 'Policy-Making Across the Branches',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
    ],
  },
};
