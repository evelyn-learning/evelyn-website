/**
 * AP US History — Unit 3 CED 3.11: Developing an American Identity / The
 * New Republic.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.new-republic.v1`. Covers Washington's precedent-setting
 * presidency, Hamilton's financial plan and the loose-vs-strict
 * construction debate it provoked, the Whiskey Rebellion, the first party
 * system, and Washington's Farewell Address.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_NEW_REPUBLIC: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.new-republic.v1',
  course: 'AP United States History',
  cedUnit: 3,
  cedTopic: '3.11',
  cedTitle: 'Developing an American Identity / The New Republic',
  planId: 'evelyn.ap.apush.new-republic.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.new-republic.v1' }],
  theory: [
    {
      loId: 'apush.new-republic',
      kind: 'event',
      title: "Washington's precedents",
      content:
        'As the first president (1789), Washington\'s choices became unwritten norms: he created an executive Cabinet (Secretary of State, Treasury, War, Attorney General) though the Constitution does not require one; he voluntarily stepped down after two terms, a norm that held over 150 years until FDR; and he insisted on the modest title "Mr. President" rather than anything resembling royalty.',
    },
    {
      loId: 'apush.new-republic',
      kind: 'event',
      title: 'the Judiciary Act of 1789',
      content:
        "Congress used its first session to establish a full federal court system — including the Supreme Court and lower federal courts — answering the Articles of Confederation's total lack of a national judiciary.",
    },
    {
      loId: 'apush.new-republic',
      kind: 'framework',
      title: "Hamilton's financial plan",
      content:
        'Treasury Secretary Alexander Hamilton proposed the federal government ASSUME (take over) state Revolutionary War debts, establish a national Bank of the United States to stabilize currency and credit, and raise revenue through tariffs and excise taxes (including a whiskey tax) — all designed to establish the new government\'s financial credibility with domestic and foreign lenders.',
    },
    {
      loId: 'apush.new-republic',
      kind: 'definition',
      title: 'loose construction',
      content:
        "The interpretive view (Hamilton) that the Constitution's Necessary and Proper Clause implies powers beyond those explicitly listed — used to justify the constitutionality of the national bank.",
    },
    {
      loId: 'apush.new-republic',
      kind: 'definition',
      title: 'strict construction',
      content:
        'The interpretive view (Jefferson, Madison) that the federal government may exercise only the powers the Constitution explicitly grants — used to argue the national bank was unconstitutional.',
    },
    {
      loId: 'apush.new-republic',
      kind: 'event',
      title: 'the Whiskey Rebellion (1794)',
      content:
        "Western Pennsylvania farmers, angered by Hamilton's excise tax on whiskey, violently resisted tax collectors. Unlike the Confederation Congress facing Shays' Rebellion, Washington personally led a federalized militia to suppress the uprising — a direct demonstration that the new government, unlike the old one, could enforce its own laws.",
    },
    {
      loId: 'apush.new-republic',
      kind: 'definition',
      title: 'first party system',
      content:
        'The earliest American political-party divide, forming DURING Washington\'s own presidency: Federalists (led by Hamilton — strong central government, loose construction, commercial economy, wary of Revolutionary France) versus Democratic-Republicans (led by Jefferson and Madison — strict construction, states\' rights, agrarian economy, more sympathetic to Revolutionary France).',
    },
    {
      loId: 'apush.new-republic',
      kind: 'event',
      title: "Washington's Farewell Address (1796)",
      content:
        'As he left office, Washington warned against permanent political parties (fearing factionalism would tear the young republic apart) and against permanent foreign alliances. The warning is often remembered as prophetic, but it was also a comment on divisions already active inside his own administration and cabinet as he spoke.',
    },
    {
      loId: 'apush.new-republic',
      kind: 'framework',
      title: 'the Preamble tested in practice',
      content:
        "Washington's presidency put the Constitution's stated purposes to their first real test: \"establish Justice\" fulfilled by the Judiciary Act (1789); \"insure domestic Tranquility\" tested and passed during the Whiskey Rebellion; \"provide for the common defence\" funded by Hamilton's financial plan. But \"promote the general Welfare\" became CONTESTED, not settled — Hamilton's and Jefferson/Madison's opposing visions of how to pursue it produced the first party system.",
    },
  ],
  methods: [
    {
      title: 'Trace a founding document\'s promises into governing practice',
      when_to_use:
        'Use when asked how an early administration (e.g. Washington\'s) fulfilled, tested, or contested the purposes stated in an earlier document like the Constitution\'s Preamble.',
      steps: [
        'RESTATE THE PROMISE — name the specific purpose or clause from the earlier document.',
        'FIND THE CONCRETE EVENT OR POLICY that tested or fulfilled it during the administration in question.',
        'COMPARE TO THE PRIOR FAILURE (if any) — was this capability something the previous government (e.g. the Confederation) lacked entirely?',
        'CHECK WHETHER THE PROMISE WAS SETTLED OR CONTESTED — some purposes are fulfilled cleanly; others (like "general welfare") become sites of ongoing political disagreement rather than resolved achievements.',
      ],
      example: {
        problem:
          'How did the Whiskey Rebellion (1794) test the Constitution\'s promise to "insure domestic Tranquility"?',
        solution:
          "Unlike the Confederation Congress facing Shays' Rebellion with no army at all, Washington personally led a federalized militia to suppress the 1794 whiskey-tax uprising in Pennsylvania. This is the clearest before/after contrast: the same kind of internal unrest the Articles government could not address, the Constitution's government could — the promise was tested and fulfilled.",
      },
      relatedLoIds: ['apush.new-republic'],
    },
  ],
  pointers: [
    { content: 'The first party system emerged DURING Washington\'s presidency, not after it — the Farewell Address warned against divisions already active, not a hypothetical future danger.', kind: 'trap' },
    { content: 'Loose construction = Hamilton/bank/Necessary and Proper Clause. Strict construction = Jefferson-Madison/only explicitly granted powers. Keep the pairing straight.', kind: 'tip' },
    { content: 'The Whiskey Rebellion (1794) is the direct contrast case to Shays\' Rebellion (1786-87) — use both together to show the new government\'s added enforcement capacity.', kind: 'tip' },
    { content: 'Washington\'s two-term precedent was VOLUNTARY, not constitutionally required — it became law only later (22nd Amendment, 1951).', kind: 'trap' },
    { content: 'Hamilton\'s plan has three distinct parts: debt assumption, the national bank, and tariffs/excise taxes — name the specific one asked about, not "his economic plan" generally.', kind: 'tip' },
  ],
};
