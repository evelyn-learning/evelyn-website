/**
 * AP US History — Unit 9 CED 9.6: America Since 2001.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.america-since-2001.v1`. Covers 9/11 and the wars in
 * Afghanistan/Iraq, the PATRIOT Act security-vs-liberty debate, the 2008
 * financial crisis and response, the ACA, and polarization — anchored by
 * George W. Bush's September 20, 2001 address to Congress.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_SINCE_2001: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.america-since-2001.v1',
  course: 'AP United States History',
  cedUnit: 9,
  cedTopic: '9.6',
  cedTitle: 'America Since 2001',
  planId: 'evelyn.ap.apush.america-since-2001.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.america-since-2001.v1' }],
  theory: [
    {
      loId: 'apush.america-since-2001',
      kind: 'definition',
      title: 'USA PATRIOT Act',
      content:
        'A 2001 federal law expanding government surveillance and law-enforcement powers to investigate terrorism. Supporters: necessary to prevent further attacks. Critics: expanded surveillance/detention provisions threatened civil liberties. A genuine, unresolved debate.',
    },
    {
      loId: 'apush.america-since-2001',
      kind: 'definition',
      title: 'TARP',
      content:
        'The Troubled Asset Relief Program (October 2008, signed by Bush), authorizing federal funds to stabilize banks and financial institutions during the 2008 crisis — followed by the 2009 stimulus (American Recovery and Reinvestment Act, signed by Obama).',
    },
    {
      loId: 'apush.america-since-2001',
      kind: 'definition',
      title: 'Affordable Care Act (ACA)',
      content:
        'The 2010 law (signed by Obama) expanding health insurance coverage via subsidized marketplaces, an individual coverage requirement (later modified), and optional state Medicaid expansion — one of the most contested, still-litigated laws of the period.',
    },
    {
      loId: 'apush.america-since-2001',
      kind: 'event',
      title: 'September 11, 2001 and Afghanistan',
      content:
        'Coordinated al-Qaeda attacks on the World Trade Center and Pentagon killed nearly 3,000 — the deadliest terrorist attack on US soil. A US-led invasion of Afghanistan followed within weeks, targeting al-Qaeda and the sheltering Taliban government; it became the longest war in US history.',
    },
    {
      loId: 'apush.america-since-2001',
      kind: 'event',
      title: 'Iraq (2003, contested)',
      content:
        'The Bush administration invaded Iraq in 2003 citing intelligence about WMD and alleged terrorism ties, later disputed; no WMD stockpiles were found. The war\'s justification, execution, and long aftermath remain genuinely disputed among historians and policymakers.',
    },
    {
      loId: 'apush.america-since-2001',
      kind: 'framework',
      title: 'the 2008 financial crisis: standard multi-factor account',
      content:
        'A housing-price bubble fueled by subprime lending, risky mortgages packaged into securities sold worldwide, insufficient regulatory oversight, and excessive institutional leverage/risk-taking together produced the 2007-08 collapse and the deepest recession since the Great Depression. No single actor or decision caused it alone.',
    },
    {
      loId: 'apush.america-since-2001',
      kind: 'event',
      title: 'polarization and new media',
      content:
        'Growing partisan polarization from the 2000s into the 2010s coincided with the rise of cable news and later social media, which scholars document can both broaden participation and reinforce ideological "echo chambers" — a documented trend, described factually, not a partisan judgment.',
    },
    {
      loId: 'apush.america-since-2001',
      kind: 'trap',
      title: 'the 2008 crisis had no single cause',
      content:
        'Avoid attributing the 2008 crisis to one bank, one regulator, or one law acting alone. The standard account requires naming several contributing factors together (housing bubble, subprime lending, securitization, weak oversight, excessive leverage).',
    },
    {
      loId: 'apush.america-since-2001',
      kind: 'trap',
      title: "the security-vs-liberty debate is not settled",
      content:
        'Both the PATRIOT Act\'s supporters (prevention necessity) and critics (civil-liberties threat) reflect real, ongoing historical and legal positions — do not present either side as the exam-correct answer.',
    },
  ],
  methods: [
    {
      title: 'Read a crisis-response address for its dual audiences',
      when_to_use:
        'Use this when a speech responding to a crisis addresses more than one distinct audience (e.g. the domestic public and a specific global group) within the same address.',
      steps: [
        'IDENTIFY EACH DISTINCT AUDIENCE the speech addresses, and where the address shifts from one to another.',
        'STATE WHAT EACH SEGMENT IS TRYING TO ACCOMPLISH with its specific audience.',
        'EXPLAIN WHY BOTH MESSAGES APPEAR IN THE SAME SPEECH — usually to build the broadest possible support while avoiding a specific unintended reading.',
        'CONNECT the framing choice to the policy debates that followed.',
      ],
      example: {
        problem:
          'Bush\'s September 20, 2001 address both frames the attacks as an act of war on "freedom itself" and separately addresses Muslims worldwide to distinguish the terrorists from Islam. Why both in one speech?',
        solution:
          'The civilizational framing builds the broadest coalition for a strong response; the direct address to Muslims tries to prevent that same response from being read as a war against Islam or Muslims generally — both serve coalition-building at home and abroad.',
      },
      relatedLoIds: ['apush.america-since-2001'],
    },
  ],
  pointers: [
    { content: '2008 crisis: always name MULTIPLE factors (housing bubble, subprime lending, securitization, weak oversight, leverage) — never a single cause.', kind: 'trap' },
    { content: 'The PATRIOT Act debate has two legitimate sides (security necessity vs. civil-liberties threat) — state both, don\'t pick one as correct.', kind: 'tip' },
    { content: 'Iraq (2003) is presented as contested — no WMD were found, and the war\'s justification/aftermath remain disputed; don\'t treat it as settled history.', kind: 'trap' },
    { content: 'TARP (2008, Bush) and the stimulus (2009, Obama) are two different, sequential responses to the same crisis — don\'t conflate them or their signers.', kind: 'tip' },
    { content: 'Afghanistan (2001) became the longest US war, spanning four presidential administrations — a good example of a policy outlasting the crisis that started it.', kind: 'tip' },
  ],
};
