/**
 * AP US Government & Politics — CED Unit 2.4-2.7: The Presidency — Formal
 * and Informal Powers.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.presidency-power.v1`. Covers formal presidential powers
 * (veto/pocket veto, commander-in-chief, appointments, pardons) versus
 * informal powers (executive orders, executive agreements, bargaining, the
 * bully pulpit), the War Powers Resolution of 1973, the 22nd Amendment, the
 * expansion-of-power debate, and Federalist No. 70's "energy in the
 * Executive" argument.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_PRESIDENCY_POWER: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.presidency-power.v1',
  course: 'AP US Government & Politics',
  cedUnit: 2,
  cedTopic: '2.4-2.7',
  cedTitle: 'The Presidency: Formal & Informal Powers',
  planId: 'evelyn.ap.apgov.presidency-power.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.presidency-power.v1' }],
  theory: [
    {
      loId: 'apgov.presidency-power',
      kind: 'concept',
      title: 'formal powers',
      content:
        'Powers explicitly granted to the President by the Constitution. VETO: the President may reject a bill Congress has passed (Article I, §7). COMMANDER-IN-CHIEF: the President leads the armed forces (Article II, §2), though Congress alone holds the power to declare war (Article I, §8). APPOINTMENTS: the President nominates federal judges, justices, and top executive officials, subject to Senate confirmation (advice and consent). PARDONS: the President may pardon or grant clemency for federal offenses (Article II, §2) — an essentially unchecked formal power.',
    },
    {
      loId: 'apgov.presidency-power',
      kind: 'definition',
      title: 'pocket veto',
      content:
        'A bill dies without a formal veto if the President takes no action on it within 10 days AND Congress adjourns during that window — killing the bill without a formal veto Congress could otherwise try to override.',
    },
    {
      loId: 'apgov.presidency-power',
      kind: 'concept',
      title: 'informal powers',
      content:
        'Powers not explicitly listed in the Constitution\'s text, built up through practice and precedent: executive orders and executive agreements (see definitions below), BARGAINING AND PERSUASION (negotiating directly with individual members of Congress to build support for an agenda), and THE BULLY PULPIT (using the visibility of the presidency to shape public opinion and pressure Congress or other actors indirectly).',
    },
    {
      loId: 'apgov.presidency-power',
      kind: 'definition',
      title: 'executive order',
      content:
        'A presidential directive to federal agencies on how to implement or enforce EXISTING law — not a new statute. It can be reversed by a later president, overridden by legislation, or struck down by courts.',
    },
    {
      loId: 'apgov.presidency-power',
      kind: 'definition',
      title: 'executive agreement',
      content:
        'An international agreement the President makes with a foreign government WITHOUT Senate ratification — unlike a treaty, which requires two-thirds Senate approval. Faster to conclude than a treaty, but less durable, since a successor president can unilaterally withdraw from one.',
    },
    {
      loId: 'apgov.presidency-power',
      kind: 'framework',
      title: 'the War Powers Resolution (1973)',
      content:
        'Passed by Congress (over President Nixon\'s veto) to reassert legislative control over military engagements after Vietnam. It requires the President to notify Congress within 48 hours of introducing U.S. armed forces into hostilities, and to withdraw those forces within 60 days (extendable by 30 more days for a safe withdrawal) UNLESS Congress declares war, specifically authorizes the continued use of force, or is physically unable to convene. Compliance has been contested and inconsistent across administrations, but it remains the primary statutory check on unilateral, extended military action.',
    },
    {
      loId: 'apgov.presidency-power',
      kind: 'framework',
      title: 'the 22nd Amendment (1951)',
      content:
        'No person may be ELECTED President more than twice. A further rule covers partial terms: a person who has held the presidency, or acted as President, for MORE than two years of a term to which someone else was originally elected may be elected President only ONCE (not twice) in their own right. This closed the door left open after Franklin Roosevelt was elected to four terms, formalizing the two-term norm Washington had set by precedent alone.',
    },
    {
      loId: 'apgov.presidency-power',
      kind: 'concept',
      title: 'the expansion-of-power debate',
      content:
        'Critics argue that informal powers — especially executive orders, executive agreements, and unilateral military action — have let the presidency grow far beyond Article II\'s explicit text, sometimes bypassing Congress\'s lawmaking and treaty-ratification roles. Defenders argue a fast-moving, complex modern state requires "energy in the Executive" (Hamilton\'s phrase) — a single, decisive actor who can respond quickly where a large, deliberative Congress cannot. Both sides agree informal powers still operate within real limits: courts can strike down executive actions that exceed statutory or constitutional authority, and Congress retains the power of the purse, oversight, and impeachment.',
    },
    {
      loId: 'apgov.presidency-power',
      kind: 'event',
      title: 'Federalist No. 70 (1788) — "energy in the Executive"',
      content:
        'Alexander Hamilton argues "Energy in the Executive is a leading character in the definition of good Government" — good government REQUIRES an executive capable of decisive, fast action. He lists four ingredients of energy: unity (one person, not a committee), duration (a term long enough to act with independence), adequate support (sufficient resources), and competent powers (real constitutional authority).',
    },
    {
      loId: 'apgov.presidency-power',
      kind: 'event',
      title: 'Federalist No. 70 — the unity argument',
      content:
        'Hamilton argues a single executive can act with "decision, activity, secrecy, and despatch" that a multi-member body cannot. His second argument against a plural executive: shared power lets its members "conceal faults, and destroy responsibility" — a group can point fingers at each other, while a single executive is fully and visibly accountable. This unity/energy argument is the same logic modern presidents invoke to justify informal powers.',
    },
    {
      loId: 'apgov.presidency-power',
      kind: 'trap',
      title: 'an executive order is not a statute',
      content:
        'An executive order does not carry the same legal force as an act of Congress. It cannot create new legal obligations the way a statute can, a court can strike it down if it exceeds presidential authority or conflicts with existing law, Congress can override it through new legislation, and a later president can simply reverse it — none of which is true of a signed act of Congress.',
    },
  ],
  methods: [
    {
      title: 'Classify a presidential action as a formal or informal power',
      when_to_use:
        'Use this whenever a prompt describes a specific presidential action and asks whether it is constitutionally explicit or built through precedent.',
      steps: [
        'CHECK WHETHER THE ACTION IS LISTED IN ARTICLE II\'S TEXT (veto, commander-in-chief, appointments, pardons, treaties with Senate consent). If so, it is a FORMAL power.',
        'IF NOT EXPLICITLY LISTED, check whether it rests on precedent and practice instead — executive orders, executive agreements, bargaining, the bully pulpit. If so, it is an INFORMAL power.',
        'IF CLASSIFYING AN EXECUTIVE ORDER SPECIFICALLY, confirm it directs agencies on implementing EXISTING law rather than creating new law — that is what makes it informal rather than statutory.',
        'STATE THE REASON, not just the label — a formal/informal classification without the "because" (explicit text vs. built through precedent) earns no credit on an FRQ.',
      ],
      example: {
        problem: 'The President issues a directive telling agencies how to enforce an existing environmental law more strictly. Formal or informal power?',
        solution:
          'Informal. It is not listed in Article II\'s text; it is an executive order directing agencies on how to implement a law that already exists, not a new statute — so it rests on precedent and practice, not explicit constitutional text.',
      },
      relatedLoIds: ['apgov.presidency-power'],
    },
    {
      title: 'Apply the War Powers Resolution timeline to a deployment scenario',
      when_to_use:
        'Use this whenever a prompt describes the President committing troops to hostilities without a declaration of war and asks what constrains continued deployment.',
      steps: [
        'IDENTIFY THE TRIGGER. Troops introduced into hostilities without a declaration of war starts the clock.',
        'APPLY THE 48-HOUR NOTIFICATION requirement: the President must notify Congress within 48 hours of the deployment.',
        'APPLY THE 60/90-DAY WITHDRAWAL requirement: absent a declaration of war, specific congressional authorization, or an extension, the President must withdraw forces within 60 days (extendable by 30 more for a safe withdrawal).',
        'NOTE THE CONTESTED STATUS — presidents have disputed the Resolution\'s constitutionality and exact triggers, so state the legal requirement, not an assumption that it is always obeyed.',
      ],
      relatedLoIds: ['apgov.presidency-power'],
    },
  ],
  pointers: [
    { content: 'An executive order is NOT a statute — it implements existing law, can be struck down by courts, overridden by Congress, or reversed by a later president.', kind: 'trap' },
    { content: 'War Powers Resolution (1973): 48-hour notification to Congress, then withdrawal within 60 days (extendable 30 more) unless Congress authorizes continued action.', kind: 'tip' },
    { content: '22nd Amendment: more than two years of a predecessor\'s term served -> eligible for only ONE election in your own right, not two.', kind: 'tip' },
    { content: 'Federalist 70\'s "unity" argument (one person, not a committee) is Hamilton\'s case for BOTH the energetic exercise of informal powers AND full presidential accountability — don\'t treat it as only about speed.', kind: 'tip' },
    { content: 'A treaty needs two-thirds Senate approval; an executive agreement does not need any Senate vote — that is exactly what makes it faster but less durable.', kind: 'tip' },
  ],
};
