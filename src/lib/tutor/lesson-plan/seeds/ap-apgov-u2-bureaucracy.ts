/**
 * AP US Government & Politics — CED Unit 2.12-2.14: The Bureaucracy.
 *
 * Unit-2 Vertical Slice content plan (follows the Unit-1 calibration
 * template — see ap-apgov-u1-federalism.ts for the shared Passage/rubric
 * infra this plan reuses). Fourth stop in Unit 2's institutional walk,
 * following directly from ap-apgov-u2-judiciary.ts.
 *
 * NO WIRED DOCUMENT: unlike the other four U2 plans, this lesson has no
 * passageId on any segment. The concept and worked example instead use a
 * hypothetical-but-realistic scenario (a farm-subsidy agency's iron
 * triangle) to teach delegated rulemaking authority and accountability —
 * no Task-1 passage models this content, so nothing is quoted or
 * attributed to a document here.
 *
 * Covers the four organizational types (cabinet departments, independent
 * executive agencies, independent regulatory commissions, government
 * corporations); delegated discretionary and rulemaking authority; iron
 * triangles versus issue networks; the merit system; and the channels of
 * bureaucratic accountability (appropriations, hearings, executive
 * control, courts).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U2_BUREAUCRACY: LessonPlan = {
  id: 'evelyn.ap.apgov.bureaucracy-accountability.v1',
  title: 'U2.12-2.14 The Bureaucracy',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.bureaucracy-accountability',
      description:
        'Explain the four types of federal bureaucratic organization (cabinet departments, independent executive agencies, independent regulatory commissions, government corporations); delegated discretionary and rulemaking authority; iron triangles and issue networks; the merit system; and the channels (appropriations, hearings, executive control, courts) through which the bureaucracy is held accountable.',
      standard: 'AP-APGOV-2.12/2.13/2.14',
    },
  ],
  prerequisites: ['apgov.judiciary-independence'],
  followUps: ['apgov.checks-in-practice'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to notice that most of the government decisions that actually touch their daily life — a drug the FDA approves, an emissions rule the EPA sets — are made by people nobody voted for, and to wonder how that\'s supposed to be accountable in a democracy.',
      script:
        "We've covered Congress, the President, and the courts — the three branches everyone learns to name. But most of the specific rules that actually govern daily life — how clean a car's exhaust has to be, whether a new medication is safe enough to sell, how a farm subsidy program is administered — aren't written by any of those three. They're written by federal agencies staffed by people nobody ever elected. That's the bureaucracy: the fourth piece of the puzzle that doesn't get its own Article, but does an enormous share of the actual governing. Today's question isn't whether the bureaucracy has power — it clearly does. It's: if these officials aren't elected, what stops them from just doing whatever they want?",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-bureaucracy-structure-authority-accountability',
      kind: 'concept',
      goal: 'Explain the four bureaucratic organization types, delegated discretionary/rulemaking authority, iron triangles versus issue networks, the merit system, and accountability mechanisms.',
      keyIdeas: [
        'FOUR TYPES OF BUREAUCRATIC ORGANIZATION: CABINET DEPARTMENTS (e.g. State, Defense, Treasury) are the largest units, headed by a secretary who is a presidential appointee and sits in the Cabinet, each covering a broad policy area. INDEPENDENT EXECUTIVE AGENCIES (e.g. NASA, the EPA) report directly to the President but sit outside any cabinet department, usually with a narrower mission. INDEPENDENT REGULATORY COMMISSIONS (e.g. the FCC, the SEC) are run by multi-member boards whose members typically serve FIXED terms and can only be removed for cause, giving them more insulation from direct presidential control than a cabinet department — they write and enforce rules for an entire industry or sector. GOVERNMENT CORPORATIONS (e.g. the U.S. Postal Service, Amtrak) provide a service that could be run privately and are structured to charge fees and operate more like a business.',
        'DELEGATED DISCRETIONARY AND RULEMAKING AUTHORITY: Congress often passes broad enabling legislation (e.g. "ensure the air is safe to breathe") without specifying every technical detail, then DELEGATES to the relevant agency the authority to fill in the specifics through RULEMAKING — a formal process (typically involving public notice and a comment period) that produces detailed regulations with the force of law. Congress delegates this way because agencies have the technical expertise and capacity for ongoing, detailed judgment that a part-time, generalist legislature does not.',
        'IRON TRIANGLES: a stable, mutually reinforcing relationship among an agency, the congressional committee(s) that oversee and fund it, and an interest group affected by its work — each helps protect the others\' priorities (the agency writes rules the interest group wants, the interest group supports the committee\'s members, the committee protects the agency\'s budget and mission). ISSUE NETWORKS: a looser, more fluid alternative model of policymaking involving a WIDER range of participants — agencies, committees, interest groups, but also academics, think tanks, and media — with less stable, more shifting alliances and more open contestation than a classic iron triangle.',
        'THE MERIT SYSTEM: federal civil service hiring based on qualifications and competitive examination rather than political connections or party loyalty (patronage) — established by the Pendleton Civil Service Act (1883) after patronage-driven hiring produced widespread incompetence and corruption. Most federal bureaucrats today are career civil servants hired and retained under merit-system protections, not political appointees who turn over with each new administration.',
        'ACCOUNTABILITY: despite not being elected, the bureaucracy is checked through several channels. APPROPRIATIONS: Congress\'s power of the purse lets it fund, defund, or attach conditions to an agency\'s budget. HEARINGS: congressional oversight hearings let committees question agency officials and investigate how authority is being used. EXECUTIVE CONTROL: the President appoints (with Senate confirmation) top agency leadership, issues executive orders directing agency priorities, and reviews agency budgets/regulations through the Office of Management and Budget. COURTS: federal courts can strike down an agency rule that exceeds the authority Congress delegated, or that a court finds "arbitrary and capricious."',
      ],
      vocabulary: [
        {
          term: 'independent regulatory commission',
          definition:
            'a multi-member body (e.g. the FCC, SEC) whose members serve fixed terms and can be removed only for cause, giving it more insulation from direct presidential control than a cabinet department.',
        },
        {
          term: 'government corporation',
          definition:
            'a federal entity (e.g. USPS, Amtrak) providing a service that could be run privately, structured to operate more like a business, including charging fees.',
        },
        {
          term: 'rulemaking',
          definition:
            "the formal process by which an agency, under authority Congress delegated, issues detailed regulations with the force of law, typically after public notice and comment.",
        },
        {
          term: 'iron triangle',
          definition:
            "a stable, mutually reinforcing relationship among an agency, its congressional oversight/appropriations committee, and an affected interest group.",
        },
        {
          term: 'issue network',
          definition:
            'a looser, more fluid policy community involving agencies, committees, interest groups, academics, think tanks, and media, with shifting rather than stable alliances.',
        },
        {
          term: 'merit system',
          definition:
            "hiring federal civil servants based on qualifications and competitive examination rather than political patronage, established by the Pendleton Act (1883).",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-iron-triangle-farm-subsidy',
      kind: 'worked_example',
      problem:
        "Analyze this scenario. A federal agency administers agricultural subsidy payments to farmers. It works closely with the House Agriculture Committee, which oversees the agency's budget and legislative authority, and with a national farmers' advocacy association, which represents subsidy recipients. Over time, the three routinely support each other: the agency proposes subsidy rules the association favors; the association mobilizes political support for committee members who protect the agency's funding; and the committee, in turn, insulates the agency's budget from cuts. (a) Identify this three-way relationship as an iron triangle, and explain which actor plays each of the triangle's three roles. (b) Explain ONE reason this kind of stable relationship can make bureaucratic accountability harder to achieve through normal oversight channels. (c) Describe ONE change to this scenario that would make it look more like an issue network than a classic iron triangle.",
      steps: [
        'IDENTIFY THE THREE CORNERS. The agency (administers subsidies and writes implementing rules), the congressional committee (the House Agriculture Committee — oversees and funds the agency), and the interest group (the farmers\' association — represents the policy\'s beneficiaries). This is the textbook iron-triangle structure.',
        'DESCRIBE THE MUTUAL REINFORCEMENT. Each corner supports the other two: the agency writes rules the interest group wants; the interest group mobilizes political support that helps protect the committee members who favor the agency; the committee protects the agency\'s budget and legislative mandate. No single actor needs to act against its own interest for this cycle to continue.',
        'EXPLAIN WHY THIS COMPLICATES ACCOUNTABILITY. Normal accountability tools — congressional oversight hearings, appropriations threats — depend on SOMEONE with power having an incentive to challenge the agency. But if the committee that\'s supposed to provide oversight is itself allied with the agency (because the interest group supports committee members electorally), that check weakens: the very body meant to hold the agency accountable benefits from NOT doing so aggressively.',
        'DESCRIBE WHAT WOULD SHIFT IT TOWARD AN ISSUE NETWORK. Bringing in a WIDER, more contested set of participants would loosen the closed triangle — for example, if agricultural economists, environmental advocacy groups critical of subsidy design, journalists covering the subsidy program\'s costs, and rival farm-industry associations with different priorities all became active, ongoing participants in the debate, the policy conversation would involve more competing voices and less stable, mutually reinforcing alliances than the closed agency-committee-interest-group loop described above.',
      ],
      answer:
        "This is an iron triangle: the agency is the bureaucratic corner (administers subsidies, writes rules), the House Agriculture Committee is the congressional corner (oversees and funds the agency), and the farmers' association is the interest-group corner (represents subsidy recipients). The three mutually reinforce each other — rules favor the association, the association's support helps protect friendly committee members, and the committee protects the agency's budget — with no actor needing to act against its own interest. This complicates accountability because the body meant to provide oversight (the committee) is itself allied with the agency it's supposed to check, weakening the incentive to challenge it. The relationship would look more like an issue network if a wider, more contested set of participants — economists, rival farm groups, environmental critics, journalists — became ongoing, competing voices in the policy debate, replacing the closed triangle's stable alliance with a looser, more fluid, more openly contested policy community.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. Congress passes a law directing a federal agency to "set standards to ensure the nation\'s air quality protects public health," without specifying exact pollutant limits in the statute itself. (a) Identify the type of authority Congress has given the agency, and explain why Congress delegates authority this way rather than writing every technical detail into the statute. (b) Describe ONE way Congress can hold the agency accountable for how it uses this authority after the fact. (c) Describe ONE way the federal courts can check the agency\'s use of this authority.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies this as delegated discretionary/rulemaking authority, and explains that Congress lacks the technical expertise and ongoing capacity to specify every detail, so it authorizes the agency to fill in specifics through rulemaking. No credit for a response that omits the expertise/capacity rationale.',
            modelResponse:
              "Congress has delegated discretionary, or rulemaking, authority to the agency. Congress passes broad enabling legislation rather than specifying every technical pollutant limit itself because it lacks the scientific and technical expertise, and the ongoing capacity, to make and update those detailed determinations — the agency's specialized staff can research, set, and revise specific standards more effectively through the rulemaking process.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): describes a real accountability mechanism (e.g. appropriations/power of the purse, oversight hearings, or Senate confirmation of agency leadership) and explains how it holds the agency accountable. No credit for a mechanism that is not a real congressional tool.',
            modelResponse:
              "Congress can hold the agency accountable through its power of the purse: appropriations committees can reduce, condition, or threaten to cut the agency's budget if lawmakers believe it is setting standards Congress did not intend, giving Congress ongoing leverage even after the original statute was passed.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that a federal court can review and strike down the agency\'s rule if it exceeds the authority Congress delegated or is found "arbitrary and capricious." No credit for a response that omits judicial review or misdescribes the standard.',
            modelResponse:
              "A federal court can exercise judicial review over the agency's air-quality rule: if a party sues arguing the rule exceeds the authority Congress actually delegated in the statute, or that the agency's reasoning was arbitrary and capricious, a court can strike the rule down, forcing the agency to revise or abandon it.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-bureaucracy-fourth-branch',
      kind: 'misconception_check',
      question:
        'True or false: the federal bureaucracy is effectively a "fourth branch" of government, holding independent constitutional power of its own, separate from the legislative, executive, and judicial branches.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming that because the bureaucracy exercises so much day-to-day rulemaking power, it must hold its own independent constitutional authority, rather than authority delegated to it by Congress and situated within the executive branch.',
          correctsTo:
            'FALSE. The bureaucracy holds NO independent constitutional power of its own. Federal agencies are created by acts of Congress and sit within (or answer to) the executive branch; every bit of rulemaking authority an agency exercises is authority Congress DELEGATED to it through enabling legislation, and Congress can narrow, redirect, or eliminate that authority at any time. The bureaucracy remains subject to real checks from all three constitutional branches: Congress\'s power of the purse and oversight hearings, presidential appointment and executive-order control, and judicial review of agency rules. It exercises enormous practical influence, but that influence is entirely derivative of authority the other branches have given it — it is not a fourth branch with its own constitutional standing.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four organizational types: cabinet departments (broad, secretary-led), independent executive agencies (report to the President, narrower mission), independent regulatory commissions (fixed-term boards, more insulated), government corporations (business-like, fee-based).',
        'Congress delegates discretionary/rulemaking authority because agencies have the technical expertise and ongoing capacity a generalist legislature lacks; rulemaking produces detailed regulations with the force of law.',
        'Iron triangle = a stable, mutually reinforcing agency-committee-interest-group relationship; issue network = a looser, wider, more contested policy community (adds academics, media, think tanks).',
        'Merit system (Pendleton Act, 1883): federal hiring by qualification/exam, not political patronage.',
        'Accountability channels: appropriations (power of the purse), congressional oversight hearings, executive control (appointments, executive orders, OMB review), and judicial review of agency rules.',
        'The bureaucracy is NOT a fourth branch with independent constitutional power — all its authority is delegated by Congress and remains checked by all three constitutional branches.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.12-2.14',
    cedTitle: 'The Bureaucracy',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
    ],
  },
};
