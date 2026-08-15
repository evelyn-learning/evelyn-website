/**
 * AP US Government & Politics — CED Unit 2.4-2.7: The Presidency — Formal
 * and Informal Powers.
 *
 * Unit-2 Vertical Slice content plan (follows the Unit-1 calibration
 * template — see ap-apgov-u1-federalism.ts for the shared Passage/rubric
 * infra this plan reuses). Second stop in Unit 2's institutional walk,
 * following directly from ap-apgov-u2-congress.ts.
 *
 * Covers formal presidential powers (veto/pocket veto, commander-in-chief,
 * appointments, pardons) versus informal powers (executive orders,
 * executive agreements, bargaining, the bully pulpit); the War Powers
 * Resolution of 1973; the 22nd Amendment's term limit; and the recurring
 * debate over expansion of presidential power.
 *
 * DOCUMENT STIMULUS: the anchor is evelyn.passage.apgov-federalist-70.v1,
 * Alexander Hamilton's case for a unitary, energetic executive. The seeded
 * excerpt (per that passage's own docblock) covers only two things: (1) the
 * claim that "Energy in the Executive is a leading character in the
 * definition of good Government" and its four ingredients (unity, duration,
 * adequate support, competent powers); and (2) the unity argument
 * ("decision, activity, secrecy, and despatch") plus the claim that
 * plurality in the executive "tends to conceal faults, and destroy
 * responsibility." The worked example below quotes and analyzes only that
 * text — it does not attribute anything else to Federalist 70.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U2_PRESIDENCY: LessonPlan = {
  id: 'evelyn.ap.apgov.presidency-power.v1',
  title: 'U2.4-2.7 The Presidency: Formal & Informal Powers',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.presidency-power',
      description:
        'Explain the President\'s formal powers (veto/pocket veto, commander-in-chief, appointments, pardons) versus informal powers (executive orders, executive agreements, bargaining, the bully pulpit); the constraints of the War Powers Resolution of 1973 and the 22nd Amendment; and the ongoing debate over the expansion of presidential power.',
      standard: 'AP-APGOV-2.4/2.5/2.6/2.7',
    },
  ],
  prerequisites: ['apgov.congress-structure'],
  followUps: ['apgov.judiciary-independence'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the gap between the President\'s few explicit constitutional powers and the much larger amount of unilateral action modern presidents actually take, and to wonder what fills that gap.',
      script:
        "We just mapped Congress. Now the executive branch. Here's the puzzle: Article II, the shortest of the three main Articles, gives the President surprisingly few explicit powers — sign or veto bills, command the armed forces, make appointments and treaties (with the Senate's help), grant pardons. And yet modern presidents routinely act alone — issuing directives that reshape federal policy overnight, negotiating international agreements without a Senate vote, dominating the news cycle to pressure Congress into acting. Where does that extra power come from, if it's not written down the same way Congress's powers are? Alexander Hamilton actually predicted this, defending a strong, single executive in Federalist No. 70 back in 1788 — arguing that \"energy\" in the executive was essential to good government. Today we separate what the Constitution explicitly gives the President from what presidents have built for themselves since — and the two big limits Congress and the Constitution eventually imposed in response.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-presidency-formal-informal-powers',
      kind: 'concept',
      goal: 'Explain formal versus informal presidential powers, the War Powers Resolution of 1973, the 22nd Amendment, and the expansion-of-power debate.',
      keyIdeas: [
        'FORMAL POWERS: powers explicitly granted to the President by the Constitution. VETO: the President may reject a bill Congress has passed (Article I, §7); a POCKET VETO occurs if the President takes no action on a bill within 10 days AND Congress adjourns during that window, killing the bill without a formal veto Congress could override. COMMANDER-IN-CHIEF: the President leads the armed forces (Article II, §2), though Congress alone holds the power to declare war (Article I, §8). APPOINTMENTS: the President nominates federal judges, justices, and top executive officials, subject to Senate confirmation (advice and consent). PARDONS: the President may pardon or grant clemency for federal offenses (Article II, §2) — an essentially unchecked formal power.',
        'INFORMAL POWERS: powers not explicitly listed in the Constitution\'s text, built up through practice and precedent. EXECUTIVE ORDERS: directives to federal agencies on how to implement or enforce EXISTING law — not new statutes; they can be reversed by a later president, overridden by legislation, or struck down by courts. EXECUTIVE AGREEMENTS: international agreements the President makes with a foreign government WITHOUT Senate ratification (unlike treaties, which require two-thirds Senate approval) — faster to conclude, but less durable, since a successor president can unilaterally withdraw from one. BARGAINING AND PERSUASION: the President\'s ability to negotiate directly with individual members of Congress to build support for an agenda. THE BULLY PULPIT: using the visibility of the presidency to shape public opinion and pressure Congress or other actors indirectly.',
        'THE WAR POWERS RESOLUTION (1973): passed by Congress (over President Nixon\'s veto) to reassert legislative control over military engagements after Vietnam. It requires the President to notify Congress within 48 hours of introducing U.S. armed forces into hostilities, and to withdraw those forces within 60 days (extendable by 30 more days for a safe withdrawal) UNLESS Congress declares war, specifically authorizes the continued use of force, or is physically unable to convene. In practice, presidents of both parties have disputed the Resolution\'s constitutionality and its precise triggers, so compliance has been contested and inconsistent — but it remains the primary statutory check on unilateral, extended military action.',
        'THE 22ND AMENDMENT (1951): no person may be ELECTED President more than twice. A further rule covers partial terms: a person who has held the presidency, or acted as President, for MORE than two years of a term to which someone else was originally elected may be elected President only ONCE (not twice) in their own right. This closed the door left open after Franklin Roosevelt was elected to four terms, formalizing the two-term norm Washington had set by precedent alone.',
        'THE EXPANSION-OF-POWER DEBATE: critics argue that informal powers — especially executive orders, executive agreements, and unilateral military action — have let the presidency grow far beyond Article II\'s explicit text, sometimes bypassing Congress\'s lawmaking and treaty-ratification roles entirely. Defenders argue that a fast-moving, complex modern state requires exactly the kind of "energy in the Executive" Hamilton described — a single, decisive actor who can respond quickly where a large, deliberative Congress cannot. Both sides agree informal powers still operate within real limits: courts can strike down executive actions that exceed statutory or constitutional authority, and Congress retains the power of the purse, oversight, and (in the most extreme case) impeachment.',
      ],
      vocabulary: [
        {
          term: 'formal powers',
          definition:
            "powers explicitly granted to the President by the Constitution's text (e.g. veto, commander-in-chief, appointments, pardons).",
        },
        {
          term: 'informal powers',
          definition:
            'powers not explicitly listed in the Constitution, built up through precedent and practice (e.g. executive orders, executive agreements, the bully pulpit).',
        },
        {
          term: 'pocket veto',
          definition:
            "a bill dies without a formal veto if the President takes no action within 10 days and Congress adjourns during that window.",
        },
        {
          term: 'executive order',
          definition:
            'a presidential directive to federal agencies on how to implement or enforce existing law; not a new statute, and reversible by a later president, Congress, or the courts.',
        },
        {
          term: 'executive agreement',
          definition:
            "an international agreement the President makes with a foreign government without Senate ratification, unlike a treaty (which needs two-thirds Senate approval).",
        },
        {
          term: 'War Powers Resolution',
          definition:
            'a 1973 law requiring the President to notify Congress within 48 hours of committing troops to hostilities and to withdraw within 60-90 days absent congressional authorization.',
        },
        {
          term: '22nd Amendment',
          definition:
            'the 1951 amendment limiting a person to being elected President twice, and to being elected only once if they already served more than two years of a predecessor\'s term.',
        },
      ],
      passageId: 'evelyn.passage.apgov-federalist-70.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-federalist-70-energy',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Federalist No. 70 (Alexander Hamilton, 1788): "Energy in the Executive is a leading character in the definition of good Government. It is essential to the protection of the community against foreign attacks; it is not less essential to the steady administration of the laws ... The ingredients which constitute energy in the Executive are, first, unity; secondly, duration; thirdly, an adequate provision for its support; fourthly, competent powers. That unity is conducive to energy, will not be disputed. Decision, activity, secrecy, and despatch, will generally characterize the proceedings of one man, in a much more eminent degree than the proceedings of any greater number ... But one of the weightiest objections to a plurality in the Executive ... is, that it tends to conceal faults, and destroy responsibility." What is Hamilton\'s core argument for why the executive power should rest in ONE person rather than a group, and how does this argument connect to the modern formal/informal powers split covered in this lesson?',
      steps: [
        'SOURCE IT FIRST. Federalist No. 70, written by Alexander Hamilton as "Publius," published 1788 — this essay specifically defends Article II\'s choice of a single President over a multi-person executive council or committee.',
        'FIND THE CORE CLAIM. "Energy in the Executive is a leading character in the definition of good Government." Hamilton argues good government REQUIRES an executive capable of decisive, fast action — not just an executive that is constitutionally limited.',
        'THE FOUR INGREDIENTS OF ENERGY. Hamilton lists unity (one person, not a committee), duration (a term long enough to act with independence), adequate support (sufficient resources/compensation), and competent powers (real constitutional authority) as what energy requires.',
        'THE UNITY ARGUMENT — "DECISION, ACTIVITY, SECRECY, AND DESPATCH." Hamilton argues a single executive can act with speed and coordination that a multi-member body cannot — one person can decide and move immediately, while a group must first deliberate and agree.',
        'THE PLURALITY OBJECTION — "CONCEAL FAULTS, AND DESTROY RESPONSIBILITY." Hamilton\'s second argument: if executive power were shared among several people, it would become impossible to pin blame on any one of them when something goes wrong — a group can always point fingers at each other. A single executive, by contrast, is fully and visibly ACCOUNTABLE — voters know exactly who is responsible.',
        'LINK TO FORMAL/INFORMAL POWERS. Hamilton\'s "unity" and "energy" argument is precisely the logic modern presidents invoke to justify INFORMAL powers — a single executive acting quickly via an executive order or a rapid military response embodies exactly the "decision, activity, secrecy, and despatch" Hamilton praised. But the SAME unity that enables speed is what critics point to in the expansion-of-power debate: a single, energetic executive is also a single actor capable of unilateral overreach, which is why formal checks (Senate confirmation, the War Powers Resolution, the 22nd Amendment, judicial review) exist alongside that energy.',
      ],
      answer:
        'Hamilton argues that good government requires "energy" in the executive — decisive, fast, well-resourced, empowered action — and that this energy depends on UNITY: vesting executive power in one person, not a committee or council. A single executive can act with "decision, activity, secrecy, and despatch" that a multi-member body cannot, and a single executive is also fully accountable, since a plural executive would let its members "conceal faults" and evade responsibility by blaming one another. This argument for energetic, unified executive action is the same logic modern presidents invoke to justify informal powers like executive orders and rapid unilateral responses — and it is exactly why the expansion-of-power debate exists: the same unity that produces speed also concentrates the capacity for overreach, which is why formal checks like Senate confirmation, the War Powers Resolution, and the 22nd Amendment\'s term limit exist alongside it.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. In response to an escalating overseas conflict, the President orders U.S. troops into hostilities without first seeking a formal declaration of war from Congress, then separately issues an executive order directing federal agencies to expand support services for veterans affected by the deployment. Years later, this President — who had already completed more than two years of a predecessor\'s unfinished term before being elected once, in her own right, to a full four-year term — considers running for reelection. (a) Identify whether the executive order described above is an example of a formal or an informal presidential power, and explain why. (b) Explain how the War Powers Resolution of 1973 constrains the President\'s authority to keep troops deployed in hostilities without further congressional action. (c) Applying the 22nd Amendment, explain whether this President is constitutionally eligible to run for reelection.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies the executive order as an INFORMAL power and explains why (not explicitly enumerated in the Constitution\'s text; a directive to agencies on implementing existing law, not a new statute). No credit for identifying it as formal, or an identification with no supporting reason.',
            modelResponse:
              "The executive order is an informal power. It is not explicitly listed among the President's constitutional powers in Article II; instead, it is a directive telling federal agencies how to implement or enforce laws that already exist. Because it rests on precedent and practice rather than explicit constitutional text, it counts as an informal, not formal, power.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that the War Powers Resolution requires the President to notify Congress within 48 hours of introducing troops into hostilities and to withdraw within 60 days (extendable to 90) unless Congress declares war, authorizes continued action, or extends the time. No credit for a response that omits the 48-hour notification or the 60/90-day withdrawal requirement.',
            modelResponse:
              "The War Powers Resolution of 1973 requires the President to notify Congress within 48 hours of committing troops to hostilities, and requires the President to withdraw those troops within 60 days (with a possible 30-day extension for a safe withdrawal) unless Congress has declared war, specifically authorized the continued use of force, or extended that deadline. Without such congressional action, the President's authority to keep troops deployed indefinitely is legally constrained by this timeline.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly explains, applying the 22nd Amendment, that because this President already served more than two years of a predecessor\'s term, she may be elected only ONCE in her own right — and having already used that one election, she is NOT eligible to run for reelection now. No credit for a response that concludes she is eligible, or that omits the more-than-two-years / elected-only-once reasoning.',
            modelResponse:
              "Under the 22nd Amendment, a person who has served more than two years of a term to which someone else was elected may be elected President only ONCE in their own right, rather than the normal twice. Because this President already completed more than two years of her predecessor's term and has since been elected once to a full term of her own, she has now used up her single allowed election. She is therefore NOT constitutionally eligible to run for reelection.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-executive-orders-are-laws',
      kind: 'misconception_check',
      question:
        'True or false: a presidential executive order is a law, equivalent in legal force to a statute passed by Congress.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming that because an executive order has immediate, binding effect on federal agencies, it must carry the same legal status as a statute Congress passed and the President signed.',
          correctsTo:
            "FALSE. An executive order is NOT a statute — it is a directive to federal agencies about HOW to implement or enforce laws that already exist, issued under the President's existing constitutional or statutory authority. It cannot create new legal obligations for private citizens the way a statute can, and it remains subject to real limits: a court can strike it down if it exceeds the President's authority or conflicts with existing law, Congress can override it through new legislation, and a LATER president can simply reverse it by issuing a new executive order — none of which is true of an act of Congress signed into law. Executive orders are a genuine, informal presidential tool, but they operate within — not above — the existing legal framework.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Formal powers (explicit in Article II): veto/pocket veto, commander-in-chief, appointments (with Senate advice and consent), pardons. Informal powers (built through precedent): executive orders, executive agreements, bargaining, the bully pulpit.',
        'The War Powers Resolution (1973) requires 48-hour notification to Congress after committing troops to hostilities, and withdrawal within 60-90 days absent congressional authorization.',
        'The 22nd Amendment (1951): no one may be elected President more than twice; a person who served more than two years of a predecessor\'s term may be elected only once in their own right.',
        'Federalist No. 70: Hamilton argues "energy in the Executive" — requiring unity (one person, not a committee) — enables "decision, activity, secrecy, and despatch," while a plural executive would "conceal faults, and destroy responsibility."',
        'Executive orders are NOT statutes: they implement existing law, can be struck down by courts, overridden by Congress, or reversed by a later president — unlike an act of Congress.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.4-2.7',
    cedTitle: 'The Presidency: Formal & Informal Powers',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-federalist-70.v1',
        chapter: '1788',
        note: 'Federalist No. 70 — Hamilton\'s "energy in the Executive" and unity/plurality argument for a single President; anchor for the concept and worked example.',
      },
    ],
  },
};
