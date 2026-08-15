/**
 * AP US Government & Politics — CED Unit 2.8-2.11: The Federal Judiciary.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.judiciary-independence.v1`. Covers Article III (life
 * tenure during good behavior, salary protection), Marbury v. Madison
 * (1803) establishing judicial review, precedent and stare decisis,
 * judicial activism versus restraint, the checks on the courts, and
 * Federalist No. 78's "least dangerous branch" argument.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_JUDICIARY_INDEPENDENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.judiciary-independence.v1',
  course: 'AP US Government & Politics',
  cedUnit: 2,
  cedTopic: '2.8-2.11',
  cedTitle: 'The Federal Judiciary',
  planId: 'evelyn.ap.apgov.judiciary-independence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.judiciary-independence.v1' }],
  theory: [
    {
      loId: 'apgov.judiciary-independence',
      kind: 'concept',
      title: 'Article III and judicial independence',
      content:
        'Article III establishes the Supreme Court and gives Congress the power to create lower federal courts. Federal judges and justices serve during "good Behaviour" — effectively LIFE TENURE, removable only through impeachment — and their salaries cannot be reduced while they hold office. Both protections exist to insulate judges from political pressure so they can rule against Congress, the President, or public opinion without fear of losing their job or pay.',
    },
    {
      loId: 'apgov.judiciary-independence',
      kind: 'definition',
      title: 'judicial review',
      content:
        'The power of federal courts to declare an act of Congress (or executive action) void when it conflicts with the Constitution. NOT stated anywhere in Article III\'s text — the Supreme Court established this power for itself, by precedent, in Marbury v. Madison (1803).',
    },
    {
      loId: 'apgov.judiciary-independence',
      kind: 'event',
      title: 'Marbury v. Madison (1803) — judicial review established',
      content:
        'Outgoing President John Adams made last-minute judicial appointments; incoming Secretary of State James Madison withheld one commission (to William Marbury). Marbury sued directly in the Supreme Court under a provision of the Judiciary Act of 1789. Chief Justice John Marshall\'s opinion held that provision itself UNCONSTITUTIONAL, because it improperly expanded the Supreme Court\'s original jurisdiction beyond what Article III allows — and in deciding this, the Court asserted judicial review for the first time.',
    },
    {
      loId: 'apgov.judiciary-independence',
      kind: 'definition',
      title: 'precedent',
      content:
        'A prior court decision that establishes a rule future courts are expected to follow in similar cases.',
    },
    {
      loId: 'apgov.judiciary-independence',
      kind: 'definition',
      title: 'stare decisis',
      content:
        '"Let the decision stand" — the doctrine that courts should generally follow precedent rather than re-litigate settled questions each time, promoting predictability and stability in the law. Courts CAN overturn their own precedent, but stare decisis creates a strong presumption against doing so lightly.',
    },
    {
      loId: 'apgov.judiciary-independence',
      kind: 'concept',
      title: 'judicial activism vs. judicial restraint',
      content:
        'Judicial ACTIVISM describes a judicial philosophy willing to overturn precedent, strike down laws, or read the Constitution in new ways to address current circumstances or societal needs. Judicial RESTRAINT describes a philosophy favoring deference to precedent and to the decisions of the elected branches, overturning laws only when a violation is clear. These describe judicial PHILOSOPHY, not fixed positions tied to any one political party.',
    },
    {
      loId: 'apgov.judiciary-independence',
      kind: 'concept',
      title: 'checks on the courts',
      content:
        'APPOINTMENTS: the President nominates, and the Senate must confirm, every federal judge and justice. JURISDICTION: Congress has significant control over the structure and jurisdiction of the federal courts below the Supreme Court, and some scope to regulate the Supreme Court\'s appellate jurisdiction. CONSTITUTIONAL AMENDMENT: the only way to directly override a Supreme Court constitutional interpretation is a constitutional amendment (a high bar). ENFORCEMENT: courts have no independent means to enforce their own rulings — they depend on the executive branch to carry them out.',
    },
    {
      loId: 'apgov.judiciary-independence',
      kind: 'event',
      title: 'Federalist No. 78 (1788) — the "least dangerous" branch',
      content:
        'Alexander Hamilton argues the judiciary "will always be the least dangerous to the political rights of the Constitution," having "neither FORCE nor WILL, but merely judgment," and depending "upon the aid of the Executive arm even for the efficacy of its judgments." Unlike Congress (controls the purse) or the President (commands the military), courts cannot make anyone comply on their own.',
    },
    {
      loId: 'apgov.judiciary-independence',
      kind: 'concept',
      title: 'Federalist 78 and Marbury together: enforcement vs. interpretive authority',
      content:
        'The two texts are not really in tension. Hamilton\'s claim in Federalist 78 is about ENFORCEMENT capacity — courts cannot compel compliance themselves. Marshall\'s claim in Marbury is about INTERPRETIVE authority — courts decide what the law IS, including declaring a conflicting statute void. Judicial review shows that "merely judgment" can still be enormously consequential, but exercising it does not give courts force or will; a ruling still depends on the executive branch (or other actors\' compliance) to take effect — which is exactly why the checks on the courts still matter.',
    },
    {
      loId: 'apgov.judiciary-independence',
      kind: 'trap',
      title: 'judicial review is not written into Article III',
      content:
        'Article III does NOT explicitly grant judicial review. The Supreme Court asserted this power for itself in Marbury v. Madison (1803). Assuming any famous, foundational judicial power must be spelled out in the Constitution\'s original text is the most common way to get this wrong.',
    },
  ],
  methods: [
    {
      title: 'Apply Marbury v. Madison\'s judicial-review holding to a new scenario',
      when_to_use:
        'Use this whenever a prompt describes a court reviewing a law or executive action and asks what power or standard is at work.',
      steps: [
        'IDENTIFY THE POWER BEING EXERCISED. If a court is deciding whether a statute or executive action conflicts with the Constitution, that is judicial review.',
        'STATE THE HOLDING PRECISELY: Marbury v. Madison (1803) established that federal courts may declare an act of Congress void when it conflicts with the Constitution — a power NOT stated in Article III\'s text.',
        'NOTE THE LIMIT: exercising judicial review is an act of interpretation, not enforcement — the ruling still depends on the executive branch (or another actor) to take effect.',
        'CONNECT TO REAL CHECKS if the prompt asks about accountability: Senate confirmation, congressional control of lower-court jurisdiction, and the amendment process all remain available even though courts hold judicial review.',
      ],
      example: {
        problem: 'A federal court strikes down part of a federal statute as unconstitutional. What power is the court exercising, and where does that power come from?',
        solution:
          'The court is exercising judicial review — the power to declare a law void when it conflicts with the Constitution. This power comes from precedent, specifically Marbury v. Madison (1803), not from any explicit grant in Article III\'s text.',
      },
      relatedLoIds: ['apgov.judiciary-independence'],
    },
    {
      title: 'Analyze two documents together: separate what each one actually claims',
      when_to_use:
        'Use this whenever a prompt presents two related excerpts (e.g. Federalist 78 and the Marbury opinion) and asks whether they agree or conflict.',
      steps: [
        'SOURCE EACH TEXT SEPARATELY — note the author, date, and what specific claim each one is making before comparing them.',
        'IDENTIFY THE PRECISE SCOPE of each claim (e.g. one is about enforcement capacity, the other about interpretive authority) rather than treating both as making the same general point.',
        'CHECK WHETHER THE CLAIMS ACTUALLY CONTRADICT EACH OTHER, or whether they describe two different things that can both be true at once.',
        'STATE THE SYNTHESIS explicitly — how the later text builds on, narrows, or coexists with the earlier one.',
      ],
      relatedLoIds: ['apgov.judiciary-independence'],
    },
  ],
  pointers: [
    { content: 'Judicial review is not in Article III\'s text — the Supreme Court claimed it for itself in Marbury v. Madison (1803).', kind: 'trap' },
    { content: 'Life tenure ("good Behaviour") and salary protection both exist to insulate judges from political pressure — that is the rationale, not just the rule.', kind: 'tip' },
    { content: 'Judicial activism vs. restraint describes philosophy about deference to precedent/elected branches, not a fixed party alignment.', kind: 'tip' },
    { content: 'Real checks on the courts: Senate confirmation of nominees, congressional control over lower-court structure/jurisdiction, the constitutional amendment process, and dependence on the executive for enforcement.', kind: 'tip' },
    { content: 'Hamilton\'s "neither force nor will" (Federalist 78) is about enforcement, not interpretive power — Marbury\'s judicial review does not contradict it.', kind: 'tip' },
  ],
};
