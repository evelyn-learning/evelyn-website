/**
 * AP US Government & Politics — CED Unit 2.12-2.14: The Bureaucracy.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.bureaucracy-accountability.v1`. Covers the four
 * organizational types (cabinet departments, independent executive
 * agencies, independent regulatory commissions, government corporations),
 * delegated discretionary and rulemaking authority, iron triangles versus
 * issue networks, the merit system, and the channels of bureaucratic
 * accountability.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_BUREAUCRACY_ACCOUNTABILITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.bureaucracy-accountability.v1',
  course: 'AP US Government & Politics',
  cedUnit: 2,
  cedTopic: '2.12-2.14',
  cedTitle: 'The Bureaucracy',
  planId: 'evelyn.ap.apgov.bureaucracy-accountability.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.bureaucracy-accountability.v1' }],
  theory: [
    {
      loId: 'apgov.bureaucracy-accountability',
      kind: 'concept',
      title: 'four types of bureaucratic organization',
      content:
        'CABINET DEPARTMENTS (e.g. State, Defense, Treasury) are the largest units, headed by a secretary who is a presidential appointee and sits in the Cabinet, each covering a broad policy area. INDEPENDENT EXECUTIVE AGENCIES (e.g. NASA, the EPA) report directly to the President but sit outside any cabinet department, usually with a narrower mission. INDEPENDENT REGULATORY COMMISSIONS (e.g. the FCC, the SEC) are run by multi-member boards whose members typically serve fixed terms and can only be removed for cause, giving them more insulation from direct presidential control than a cabinet department. GOVERNMENT CORPORATIONS (e.g. the U.S. Postal Service, Amtrak) provide a service that could be run privately and operate more like a business, including charging fees.',
    },
    {
      loId: 'apgov.bureaucracy-accountability',
      kind: 'concept',
      title: 'delegated discretionary authority',
      content:
        'Congress often passes broad enabling legislation (e.g. "ensure the air is safe to breathe") without specifying every technical detail, then delegates to the relevant agency the authority to fill in the specifics. Congress delegates this way because agencies have the technical expertise and capacity for ongoing, detailed judgment that a part-time, generalist legislature does not.',
    },
    {
      loId: 'apgov.bureaucracy-accountability',
      kind: 'definition',
      title: 'rulemaking',
      content:
        'The formal process, typically involving public notice and a comment period, by which an agency uses delegated authority to produce detailed regulations that carry the force of law.',
    },
    {
      loId: 'apgov.bureaucracy-accountability',
      kind: 'definition',
      title: 'iron triangle',
      content:
        'A stable, mutually reinforcing relationship among an agency, the congressional committee(s) that oversee and fund it, and an interest group affected by its work — the agency writes rules the interest group wants, the interest group supports the committee\'s members, and the committee protects the agency\'s budget and mission.',
    },
    {
      loId: 'apgov.bureaucracy-accountability',
      kind: 'concept',
      title: 'issue networks (contrast with iron triangles)',
      content:
        'A looser, more fluid alternative model of policymaking involving a WIDER range of participants — agencies, committees, interest groups, but also academics, think tanks, and media — with less stable, more shifting alliances and more open contestation than a classic iron triangle.',
    },
    {
      loId: 'apgov.bureaucracy-accountability',
      kind: 'definition',
      title: 'merit system',
      content:
        'Federal civil service hiring based on qualifications and competitive examination rather than political connections or party loyalty (patronage) — established by the Pendleton Civil Service Act (1883) after patronage-driven hiring produced widespread incompetence and corruption.',
    },
    {
      loId: 'apgov.bureaucracy-accountability',
      kind: 'concept',
      title: 'accountability channels',
      content:
        'APPROPRIATIONS: Congress\'s power of the purse lets it fund, defund, or attach conditions to an agency\'s budget. HEARINGS: congressional oversight hearings let committees question agency officials and investigate how authority is being used. EXECUTIVE CONTROL: the President appoints (with Senate confirmation) top agency leadership, issues executive orders directing agency priorities, and reviews agency budgets/regulations through the Office of Management and Budget. COURTS: federal courts can strike down an agency rule that exceeds the authority Congress delegated, or that a court finds "arbitrary and capricious."',
    },
    {
      loId: 'apgov.bureaucracy-accountability',
      kind: 'concept',
      title: 'why iron triangles complicate accountability',
      content:
        'Normal accountability tools — oversight hearings, appropriations threats — depend on someone with power having an incentive to challenge the agency. If the committee that is supposed to provide oversight is itself allied with the agency (because an interest group supports that committee\'s members electorally), the check weakens: the body meant to hold the agency accountable benefits from not doing so aggressively.',
    },
    {
      loId: 'apgov.bureaucracy-accountability',
      kind: 'trap',
      title: 'the bureaucracy is not a "fourth branch"',
      content:
        'The bureaucracy holds NO independent constitutional power of its own. Federal agencies are created by acts of Congress and sit within (or answer to) the executive branch; every bit of rulemaking authority an agency exercises is authority Congress DELEGATED to it, and Congress can narrow, redirect, or eliminate that authority at any time. All three constitutional branches retain real checks over it.',
    },
  ],
  methods: [
    {
      title: 'Apply the iron triangle vs. issue network framework to a policy scenario',
      when_to_use:
        'Use this whenever a prompt describes an agency, a congressional committee, and an interest group interacting repeatedly around one policy area.',
      steps: [
        'IDENTIFY THE THREE CORNERS if present: the agency (administers/implements), the congressional committee (oversees/funds), and the interest group (affected by the policy).',
        'CHECK FOR MUTUAL REINFORCEMENT — does each corner support the other two without needing to act against its own interest? If so, this is a classic IRON TRIANGLE.',
        'EXPLAIN THE ACCOUNTABILITY PROBLEM: if the oversight body (the committee) is itself allied with the agency, normal checks weaken.',
        'TO IDENTIFY AN ISSUE NETWORK INSTEAD, look for a WIDER, more contested set of participants (academics, media, rival interest groups, think tanks) with shifting rather than stable alliances.',
      ],
      example: {
        problem: 'An agency, its overseeing committee, and one industry association consistently support each other\'s priorities on a regulatory issue. What structure is this, and what accountability problem does it create?',
        solution:
          'This is an iron triangle. The accountability problem: the committee meant to check the agency is itself allied with it (via the interest group\'s support for committee members), weakening the incentive to challenge the agency\'s decisions.',
      },
      relatedLoIds: ['apgov.bureaucracy-accountability'],
    },
    {
      title: 'Classify delegated authority and trace its accountability checks',
      when_to_use:
        'Use this whenever a prompt gives Congress a broad statutory goal without technical detail and asks what kind of authority the implementing agency has, and how it is checked.',
      steps: [
        'IDENTIFY DELEGATED DISCRETIONARY/RULEMAKING AUTHORITY when a statute states a broad goal but leaves technical specifics to an agency.',
        'EXPLAIN WHY CONGRESS DELEGATES: it lacks the technical expertise and ongoing capacity to specify every detail itself.',
        'NAME AT LEAST ONE CONGRESSIONAL CHECK (appropriations, oversight hearings, Senate confirmation of leadership) available after the fact.',
        'NAME THE JUDICIAL CHECK: a court can strike down a rule that exceeds the delegated authority or is "arbitrary and capricious."',
      ],
      relatedLoIds: ['apgov.bureaucracy-accountability'],
    },
  ],
  pointers: [
    { content: 'The bureaucracy is NOT a fourth branch — all its authority is delegated by Congress and stays checked by all three constitutional branches.', kind: 'trap' },
    { content: 'Iron triangle = stable, closed, mutually reinforcing (agency + committee + interest group). Issue network = wider, looser, more contested (adds academics, media, think tanks).', kind: 'tip' },
    { content: 'Four org types, quick ID: cabinet department (broad, secretary-led) vs. independent executive agency (narrower, reports to President) vs. independent regulatory commission (fixed-term board, more insulated) vs. government corporation (business-like, fee-based).', kind: 'tip' },
    { content: 'Merit system = Pendleton Act (1883): hiring by qualification/exam, replacing patronage-based hiring.', kind: 'tip' },
    { content: 'Accountability channels to name on an FRQ: appropriations (power of the purse), oversight hearings, executive control (appointments/executive orders/OMB), and judicial review ("arbitrary and capricious").', kind: 'tip' },
  ],
};
