/**
 * AP US Government & Politics — CED Unit 1.6: Principles of American
 * Government — Separation of Powers & Checks and Balances.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.separation-of-powers.v1`. Covers separation of powers
 * (the structural divide into three branches) versus checks and balances
 * (the specific tools — veto/override, advice and consent, judicial
 * review, impeachment — each branch holds over the others), anchored on
 * Federalist No. 51's "ambition must counteract ambition" argument.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_SEPARATION_OF_POWERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.separation-of-powers.v1',
  course: 'AP US Government & Politics',
  cedUnit: 1,
  cedTopic: '1.6',
  cedTitle: 'Principles of American Government: Separation of Powers & Checks and Balances',
  planId: 'evelyn.ap.apgov.separation-of-powers.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.separation-of-powers.v1' }],
  theory: [
    {
      loId: 'apgov.separation-of-powers',
      kind: 'definition',
      title: 'separation of powers',
      content:
        'The constitutional division of governmental power into three branches, each with distinct functions: legislative (Article I: Congress makes law), executive (Article II: the President enforces law), and judicial (Article III: federal courts interpret law).',
    },
    {
      loId: 'apgov.separation-of-powers',
      kind: 'definition',
      title: 'checks and balances',
      content:
        "The specific TOOLS each branch holds to limit the OTHER branches, so the structural divide doesn't let any one branch act unchecked: veto/override, advice and consent, judicial review, and impeachment. Related to separation of powers but not the same thing — checks and balances only make sense because power is separated first.",
    },
    {
      loId: 'apgov.separation-of-powers',
      kind: 'concept',
      title: 'veto / override',
      content:
        'The President may veto (reject) a bill Congress has passed (Article I, §7). Congress can then override that veto and enact the law anyway with a two-thirds vote in BOTH the House and the Senate — a legislative check on the executive that requires a supermajority to use.',
    },
    {
      loId: 'apgov.separation-of-powers',
      kind: 'concept',
      title: 'advice and consent',
      content:
        "The Senate must confirm, by MAJORITY vote, many presidential appointments (Cabinet secretaries, federal judges, Supreme Court justices) and must ratify treaties by a TWO-THIRDS vote (Article II, §2) — a legislative check on the executive's appointment and treaty-making power. Note the different thresholds for the two functions.",
    },
    {
      loId: 'apgov.separation-of-powers',
      kind: 'definition',
      title: 'judicial review',
      content:
        "The power of federal courts to declare a law or executive action unconstitutional. NOT explicitly granted by Article III's text — the Supreme Court asserted this power for itself in Marbury v. Madison (1803), where Chief Justice John Marshall struck down part of the Judiciary Act of 1789 as exceeding Congress's constitutional authority. A judicial check on both the legislative and executive branches, established by precedent rather than constitutional text.",
    },
    {
      loId: 'apgov.separation-of-powers',
      kind: 'concept',
      title: 'impeachment',
      content:
        'The House of Representatives has the sole power to impeach — by MAJORITY vote — civil officers, including the President, for "Treason, Bribery, or other high Crimes and Misdemeanors" (Article II, §4). The Senate has the sole power to TRY impeachments; conviction (removal from office) requires a TWO-THIRDS vote of the Senate. A legislative check reaching into both the executive and judicial branches.',
    },
    {
      loId: 'apgov.separation-of-powers',
      kind: 'framework',
      title: 'Federalist 51: "ambition must counteract ambition"',
      content:
        'Madison defends the design on INCENTIVE, not virtue. What actually prevents one branch from concentrating power isn\'t a written rule alone — it\'s giving each branch\'s officeholders both the constitutional tools above AND the personal, institutional self-interest to resist encroachment by the other branches.',
    },
    {
      loId: 'apgov.separation-of-powers',
      kind: 'framework',
      title: '"if men were angels..." — two layers',
      content:
        "Government is necessary at all because ordinary people cannot be trusted to govern themselves without it (\"if men were angels, no Government would be necessary\"). INTERNAL controls on government (checks and balances) are equally necessary, because the people WHO govern are not angels either (\"if angels were to govern men, neither external nor internal controls...would be necessary\") — power must check power at every level.",
    },
    {
      loId: 'apgov.separation-of-powers',
      kind: 'event',
      title: 'the "double security" — federalism previewed',
      content:
        'Federalist 51\'s second paragraph contrasts "a single republic" (protected only by dividing one government into departments) with "the compound republic of America," where power is FIRST divided between national and state governments and THEN subdivided among departments within each — a second, independent layer of protection. This previews federalism, covered in the following Unit-1 lesson.',
    },
    {
      loId: 'apgov.separation-of-powers',
      kind: 'framework',
      title: 'designed-in stalemate is a feature, not a malfunction',
      content:
        "Because power is fragmented across branches (and, per Federalist 51's second paragraph, further subdivided by federalism), no single branch or actor can govern unilaterally. The system deliberately trades efficiency for safety: a bill stalled by an opposing-party Congress, or a nominee waiting months for confirmation, is a predictable, INTENDED cost of preventing any one branch from concentrating power.",
    },
    {
      loId: 'apgov.separation-of-powers',
      kind: 'trap',
      title: 'separation of powers ≠ checks and balances',
      content:
        'Separation of powers is the STRUCTURAL divide into three branches. Checks and balances are the specific TOOLS each branch holds to limit the others. They are related but not interchangeable: without separation of powers, there is nothing distinct for checks and balances to check; without checks and balances, the structural divide alone would not reliably prevent one branch from dominating the others.',
    },
  ],
  methods: [
    {
      title: "Apply a required case's holding to a new scenario (e.g. Marbury v. Madison)",
      when_to_use:
        'Use this whenever an FRQ describes a new dispute and asks how a required Supreme Court case\'s holding would apply — a common AP Gov "SCOTUS Comparison" or Concept Application move.',
      steps: [
        "STATE THE CASE'S ACTUAL HOLDING FIRST, precisely. For Marbury v. Madison (1803): the Supreme Court established that federal courts can declare a law or executive action unconstitutional (judicial review) — a power not explicitly granted by Article III's text.",
        'MAP THE NEW SCENARIO ONTO THE HOLDING. Identify what role in the new scenario is analogous to the original case (e.g. "a law is challenged as unconstitutional" maps to Marbury\'s judicial-review holding).',
        'APPLY THE HOLDING TO REACH A CONCLUSION about the new scenario, explicitly using the same reasoning the Court used (not just restating that "the Court can review laws").',
        'NAME THE SOURCE OF THE POWER ACCURATELY. For judicial review specifically: note it comes from Marbury\'s precedent, not from Article III\'s text — this distinction is frequently tested.',
      ],
      example: {
        problem:
          'A group sues, arguing a newly passed federal law is unconstitutional. How could a federal court resolve this using judicial review, and where does that power come from?',
        solution:
          "A federal court could use judicial review to strike down the law if it finds Congress exceeded its constitutional authority in passing it. This power is not written into Article III's text — the Supreme Court established judicial review for itself in Marbury v. Madison (1803), so it rests on precedent rather than an explicit constitutional grant.",
      },
      relatedLoIds: ['apgov.separation-of-powers'],
    },
  ],
  pointers: [
    { content: "Separation of powers = the structural divide into three branches. Checks and balances = the tools each branch uses on the others. Don't use the terms interchangeably.", kind: 'trap' },
    { content: "Judicial review is NOT in Article III's text — it was established by the Supreme Court itself in Marbury v. Madison (1803). A response that just says \"Article III gives courts judicial review\" earns no credit.", kind: 'trap' },
    { content: 'Veto override needs 2/3 of BOTH chambers; treaty ratification needs 2/3 of the Senate ALONE; ordinary appointment confirmation needs only a majority. Three different thresholds — don\'t blur them.', kind: 'tip' },
    { content: 'Impeachment: the House impeaches by MAJORITY vote; the Senate convicts/removes by a TWO-THIRDS vote. Different chambers, different actions, different thresholds.', kind: 'tip' },
    { content: '"Ambition must be made to counteract ambition" (Federalist 51) rests on self-interested INCENTIVE, not officeholder virtue — cite this distinction for full credit on an FRQ about why checks and balances work.', kind: 'tip' },
  ],
};
