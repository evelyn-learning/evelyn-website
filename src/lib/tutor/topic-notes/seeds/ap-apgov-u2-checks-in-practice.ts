/**
 * AP US Government & Politics — CED Unit 2.15: Policy-Making Across the
 * Branches.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.checks-in-practice.v1`. Covers divided versus unified
 * government, confirmation battles as a political check, the budget
 * process and the power of the purse, oversight versus executive
 * privilege (United States v. Nixon, 1974), and how a single policy issue
 * moves across all three branches plus the bureaucracy.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_CHECKS_IN_PRACTICE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.checks-in-practice.v1',
  course: 'AP US Government & Politics',
  cedUnit: 2,
  cedTopic: '2.15',
  cedTitle: 'Policy-Making Across the Branches',
  planId: 'evelyn.ap.apgov.checks-in-practice.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.checks-in-practice.v1' }],
  theory: [
    {
      loId: 'apgov.checks-in-practice',
      kind: 'concept',
      title: 'unified vs. divided government',
      content:
        'Government is UNIFIED when the same party controls the presidency, the House, and the Senate simultaneously, making it easier (though never automatic) to pass that party\'s agenda. Government is DIVIDED when at least one chamber of Congress is controlled by a different party than the presidency. Divided government makes passing major legislation harder and increases reliance on negotiation and compromise — but it does not make legislating impossible; major bipartisan laws have passed under divided government throughout U.S. history.',
    },
    {
      loId: 'apgov.checks-in-practice',
      kind: 'definition',
      title: 'divided government',
      content:
        'At least one chamber of Congress is controlled by a different political party than the presidency — the opposite of unified government, in which one party controls the presidency and both chambers.',
    },
    {
      loId: 'apgov.checks-in-practice',
      kind: 'concept',
      title: 'confirmation battles as a political check',
      content:
        'The Senate\'s advice-and-consent role over presidential nominations (judges, justices, and top executive officials) is a recurring, high-stakes political check, especially under divided government or a closely split Senate — an opposing-party Senate majority can delay, condition, or ultimately deny confirmation, shaping who actually staffs the executive and judicial branches regardless of who won the presidency.',
    },
    {
      loId: 'apgov.checks-in-practice',
      kind: 'concept',
      title: 'the budget process and the power of the purse',
      content:
        'Congress\'s constitutional power over spending (Article I, §9: no money may be drawn from the Treasury except by appropriations made by law) means every federal agency and program ultimately depends on Congress passing appropriations to fund it. This check reaches the presidency, the bureaucracy, and even the courts\' operating budgets. When Congress and the President cannot agree on appropriations, the result can be a continuing resolution or, if even that fails, a government shutdown.',
    },
    {
      loId: 'apgov.checks-in-practice',
      kind: 'definition',
      title: 'continuing resolution',
      content:
        'Temporary legislation funding the government at existing levels when Congress and the President have not agreed on new appropriations by the deadline.',
    },
    {
      loId: 'apgov.checks-in-practice',
      kind: 'concept',
      title: 'oversight vs. executive privilege',
      content:
        'Congressional oversight (hearings, investigations, subpoenas) frequently collides with executive privilege. Executive privilege is not explicit in the Constitution\'s text, but the Supreme Court recognized it as a real, though QUALIFIED (not absolute), presidential power in United States v. Nixon (1974) — the same decision that held the privilege must yield when weighed against a specific, demonstrated need for evidence in a criminal proceeding.',
    },
    {
      loId: 'apgov.checks-in-practice',
      kind: 'definition',
      title: 'executive privilege',
      content:
        'The President\'s claimed authority to keep certain internal executive-branch communications confidential from Congress and the courts. Not explicit in the Constitution\'s text; recognized as real but QUALIFIED (not absolute) in United States v. Nixon (1974).',
    },
    {
      loId: 'apgov.checks-in-practice',
      kind: 'event',
      title: 'United States v. Nixon (1974)',
      content:
        'The Supreme Court recognized executive privilege as a legitimate presidential power grounded in the separation of powers, but held it is QUALIFIED, not absolute — it must yield when weighed against a specific, demonstrated need for evidence in a criminal proceeding. This decision both created and limited the doctrine of executive privilege in the same ruling.',
    },
    {
      loId: 'apgov.checks-in-practice',
      kind: 'concept',
      title: 'one policy issue, all branches',
      content:
        'A single policy area typically moves through every institution covered in Unit 2, often repeatedly: Congress passes a broad statute; the relevant agency issues detailed rules using delegated rulemaking authority; the President directs the agency\'s priorities through informal executive action; affected parties sue, arguing the agency exceeded its delegated authority; a court exercises judicial review, potentially striking the guidance down; and Congress can respond again — with new legislation, an appropriations rider, or oversight hearings — restarting the cycle. No single branch has the final, permanent word.',
    },
    {
      loId: 'apgov.checks-in-practice',
      kind: 'trap',
      title: 'divided government does not mean nothing can pass',
      content:
        'Divided government makes passing major legislation more difficult and typically requires more negotiation and compromise — but it does not make legislation impossible. Significant bipartisan laws have passed under divided government throughout U.S. history. Even when major new legislation stalls, the bureaucracy\'s rulemaking, the President\'s informal powers, and the courts\' judicial review keep producing policy outcomes in the meantime.',
    },
  ],
  methods: [
    {
      title: 'Trace one policy issue across Congress, the bureaucracy, the President, and the courts',
      when_to_use:
        'Use this whenever a prompt walks through a multi-stage policy scenario and asks which institution is acting at each stage.',
      steps: [
        'STAGE 1 — CONGRESS: identify where a broad statute sets a policy goal and delegates discretion over specifics to an agency.',
        'STAGE 2 — THE AGENCY (BUREAUCRACY): identify where the agency uses that delegated discretion to issue detailed rules or guidance.',
        'STAGE 3 — THE PRESIDENT: identify any informal executive action (e.g. a directive reprioritizing enforcement) shaping how the agency uses its discretion.',
        'STAGE 4 — THE COURTS: identify a lawsuit challenging whether the agency\'s action stayed within its delegated authority — this is judicial review.',
        'STAGE 5 — CONGRESS AGAIN: note that Congress can respond with new legislation, an appropriations rider, or oversight hearings, restarting the cycle — no stage is the final word.',
      ],
      example: {
        problem: 'Congress sets a broad enforcement goal, an agency issues detailed guidance, the President redirects the agency\'s priorities, and a group sues arguing the guidance exceeds statutory authority. Which institutions are acting, and in what role?',
        solution:
          'Congress (delegates authority) -> the agency (bureaucracy, rulemaking/guidance) -> the President (informal executive direction) -> the courts (judicial review of whether the guidance exceeded delegated authority) -> and Congress can still respond again afterward with new legislation or an appropriations rider.',
      },
      relatedLoIds: ['apgov.checks-in-practice'],
    },
    {
      title: 'Apply United States v. Nixon\'s qualified-privilege standard to an oversight dispute',
      when_to_use:
        'Use this whenever a prompt describes Congress or a court seeking executive-branch information the President wants to withhold.',
      steps: [
        'RECOGNIZE THAT EXECUTIVE PRIVILEGE IS REAL but not absolute — do not treat a privilege claim as automatically valid or automatically invalid.',
        'APPLY THE NIXON STANDARD: privilege must yield when weighed against a specific, demonstrated need for evidence, particularly in a criminal proceeding.',
        'STATE THE OUTCOME in terms of that balancing test, not a blanket rule either way.',
      ],
      relatedLoIds: ['apgov.checks-in-practice'],
    },
  ],
  pointers: [
    { content: 'Divided government makes legislating harder, NOT impossible — major bipartisan laws have passed under divided government.', kind: 'trap' },
    { content: 'Executive privilege is QUALIFIED, not absolute — United States v. Nixon (1974) held it must yield to a demonstrated need for evidence in a criminal proceeding.', kind: 'trap' },
    { content: 'The power of the purse (Article I, §9) reaches every branch, including the courts\' own operating budgets — no federal spending happens without a congressional appropriation.', kind: 'tip' },
    { content: 'Confirmation battles are most salient under divided government: an opposite-party Senate can delay or deny confirmation regardless of who holds the presidency.', kind: 'tip' },
    { content: 'One policy issue typically cycles: Congress delegates -> agency rulemaking -> President\'s informal direction -> courts\' judicial review -> Congress responds again. No branch has the final word.', kind: 'tip' },
  ],
};
