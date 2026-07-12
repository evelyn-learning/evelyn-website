/**
 * AP US Government & Politics — CED Unit 5.8-5.11: Elections & Campaign
 * Finance.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.elections-campaign-finance.v1`. Covers open vs.
 * closed primaries/caucuses; Electoral College mechanics and critiques
 * (including the 12th Amendment fix of Article II's original design);
 * incumbency advantage; and the campaign-finance arc from FECA through
 * BCRA to Citizens United v. FEC, including PACs vs. super PACs and hard
 * vs. soft money.
 *
 * CITIZENS UNITED HOLDING: follows the plan's careful framing exactly —
 * the excerpted reasoning covers (1) political speech doesn't lose First
 * Amendment protection because its source is a corporation, and (2)
 * INDEPENDENT expenditures (no prearrangement/coordination with the
 * candidate) don't create the quid pro quo corruption risk that justifies
 * limiting DIRECT contributions. The super-PAC "may not coordinate"
 * restriction is presented as settled downstream doctrine, not quoted
 * from the excerpt itself.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_ELECTIONS_CAMPAIGN_FINANCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.elections-campaign-finance.v1',
  course: 'AP US Government & Politics',
  cedUnit: 5,
  cedTopic: '5.8-5.11',
  cedTitle: 'Elections & Campaign Finance',
  planId: 'evelyn.ap.apgov.elections-campaign-finance.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.elections-campaign-finance.v1' }],
  theory: [
    {
      loId: 'apgov.elections-campaign-finance',
      kind: 'concept',
      title: 'open vs. closed primaries',
      content:
        'In an OPEN PRIMARY, any registered voter can vote in either party\'s primary regardless of their own party registration. In a CLOSED PRIMARY, only voters registered with that party may vote in its primary. Caucuses are a related but distinct nominating method using in-person meetings and discussion rather than a private ballot vote.',
    },
    {
      loId: 'apgov.elections-campaign-finance',
      kind: 'concept',
      title: 'Electoral College mechanics',
      content:
        'Each state gets a number of electors equal to its total congressional delegation (House seats plus its two senators); there are 538 electors total, and 270 electoral votes are needed to win. Most states award ALL of their electors to whichever candidate wins that state\'s popular vote (winner-take-all). If no candidate wins a majority of electoral votes, the 12th Amendment sends the presidential election to the House of Representatives, voting by state delegation, to choose among the top finishers.',
    },
    {
      loId: 'apgov.elections-campaign-finance',
      kind: 'definition',
      title: '12th Amendment (1804)',
      content:
        "Requires electors to cast SEPARATE ballots for President and Vice President, replacing Article II's ORIGINAL design in which each elector cast two votes for President with no separate VP ballot and the runner-up became Vice President. That original design produced a real crisis in the 1800 election (a tie between Jefferson and his own running mate, Burr, resolved only after many House ballots). The Electoral College process used today is a POST-Founding fix, not Article II's unmodified text.",
    },
    {
      loId: 'apgov.elections-campaign-finance',
      kind: 'concept',
      title: 'Electoral College critiques',
      content:
        'A candidate can win the national popular vote yet lose the Electoral College, because it aggregates state-level winner-take-all outcomes rather than counting national votes directly. The system also concentrates campaign attention on a relatively small number of competitive "swing states" rather than the country as a whole, since safely-won states offer no additional electoral payoff for extra campaigning.',
    },
    {
      loId: 'apgov.elections-campaign-finance',
      kind: 'concept',
      title: 'incumbency advantage',
      content:
        'Incumbents (officeholders running for reelection) win at substantially higher rates than challengers, driven by name recognition, the franking privilege (free official mail to constituents), an established fundraising network, prior campaign experience, and constituent casework built up while in office — advantages a first-time challenger typically lacks.',
    },
    {
      loId: 'apgov.elections-campaign-finance',
      kind: 'concept',
      title: 'FECA and BCRA',
      content:
        'FECA (Federal Election Campaign Act, 1971, amended 1974): the foundational modern campaign-finance law, establishing disclosure requirements for contributions/spending and limits on direct contributions to candidates, along with public financing options for presidential campaigns. BCRA (Bipartisan Campaign Reform Act, 2002, "McCain-Feingold"): banned soft-money contributions to national political parties and placed new restrictions on issue-advocacy ads run close to an election.',
    },
    {
      loId: 'apgov.elections-campaign-finance',
      kind: 'concept',
      title: 'Citizens United v. FEC (2010) — the holding',
      content:
        'The Supreme Court held that the First Amendment bars the government from restricting INDEPENDENT political expenditures by corporations and unions. Two lines of reasoning: (1) political speech "does not lose First Amendment protection simply because its source is a corporation"; (2) independent expenditures — unlike direct contributions — do not create a quid pro quo corruption risk, because the absence of prearrangement and coordination with the candidate removes the danger that justifies limiting direct contributions.',
    },
    {
      loId: 'apgov.elections-campaign-finance',
      kind: 'definition',
      title: 'super PAC',
      content:
        'A political committee, a vehicle enabled by Citizens United and related lower-court rulings, that may raise and spend UNLIMITED sums on INDEPENDENT political expenditures (ads, mailers, etc. not coordinated with a candidate) — but may NOT contribute directly to candidates and may NOT coordinate its spending with a candidate\'s campaign. Contrast with a traditional PAC, which may contribute directly to candidates, subject to federal contribution limits.',
    },
    {
      loId: 'apgov.elections-campaign-finance',
      kind: 'definition',
      title: 'hard money vs. soft money',
      content:
        'HARD MONEY is regulated, contribution-limited money given directly to a candidate or party for federal election activity. SOFT MONEY was largely unregulated money nominally raised for party-building rather than a specific candidate, until BCRA banned soft-money contributions to national parties in 2002.',
    },
    {
      loId: 'apgov.elections-campaign-finance',
      kind: 'concept',
      title: 'why the line falls where it does: coordination',
      content:
        "The moment a super PAC's spending becomes coordinated with a candidate's campaign, or the moment it makes a direct contribution, it steps outside the reasoning Citizens United used to permit unlimited independent spending in the first place — which is exactly why direct contributions and coordination, unlike independent expenditures, remain subject to legal limits.",
    },
  ],
  methods: [
    {
      title: 'Apply Citizens United\'s reasoning to a described expenditure',
      when_to_use:
        'Use this whenever a prompt describes money being spent to help or hurt a candidate and asks whether it is legally permitted, and why.',
      steps: [
        'ASK WHETHER THE SPENDING IS COORDINATED WITH THE CANDIDATE\'S CAMPAIGN. If yes -> treat it like a direct contribution, subject to limits. If no (independent) -> continue.',
        'IF INDEPENDENT, APPLY THE CORE REASONING: no prearrangement/coordination means no quid pro quo corruption risk, so the spending is NOT capped in amount.',
        'IDENTIFY THE SPENDER. A super PAC may spend unlimited amounts independently but may NOT contribute directly to a candidate or coordinate — state both halves of that rule together.',
        'DO NOT claim a super PAC can donate directly to a candidate — that would cross into the coordinated/direct-contribution category the law still limits.',
      ],
      example: {
        problem: 'A super PAC spends millions on ads for a candidate\'s opponent without ever discussing strategy with that opponent\'s campaign. Is this legal, and why?',
        solution: 'Yes — because the spending is independent (uncoordinated), it does not create the quid pro quo risk that justifies limiting direct contributions, per Citizens United.',
      },
      relatedLoIds: ['apgov.elections-campaign-finance'],
    },
    {
      title: 'Sequence the campaign-finance arc when asked to trace its development',
      when_to_use:
        'Use this whenever a prompt asks how campaign-finance law changed over time or asks you to place a law/case in the correct order.',
      steps: [
        'START WITH FECA (1971): disclosure + direct-contribution limits + public financing options.',
        'THEN BCRA (2002): banned soft money to national parties, restricted election-season issue ads.',
        'THEN CITIZENS UNITED (2010): protected independent corporate/union expenditures under the First Amendment, enabling super PACs.',
        'KEEP THE PAC-VS-SUPER-PAC DISTINCTION SEPARATE from the hard-money-vs-soft-money distinction — they are two different axes (contribution type, and direct-vs-independent spending vehicle), not the same contrast restated.',
      ],
      relatedLoIds: ['apgov.elections-campaign-finance'],
    },
  ],
  pointers: [
    { content: 'Closed primary = only that party\'s registered voters; open primary = any registered voter, regardless of party.', kind: 'tip' },
    { content: 'Today\'s two-ballot Electoral College process is a 12th Amendment (1804) FIX of Article II\'s original one-ballot design, prompted by the 1800 Jefferson-Burr crisis — not the Founders\' original, unmodified text.', kind: 'trap' },
    { content: 'A super PAC may spend UNLIMITED sums on INDEPENDENT expenditures but may NOT contribute directly to a candidate or coordinate with a campaign — always state both halves of this rule.', kind: 'trap' },
    { content: 'Citizens United\'s corruption-risk reasoning turns on the ABSENCE of coordination — that is exactly what separates protected independent expenditures from still-limited direct contributions.', kind: 'tip' },
    { content: 'Hard money (contribution-limited) vs. soft money (largely unregulated party-building money, banned for national parties by BCRA) is a separate axis from PAC vs. super PAC.', kind: 'tip' },
    { content: 'Incumbency advantage: name recognition, franking privilege, fundraising network, constituent casework — cite specific factors, not just "incumbents win more."', kind: 'tip' },
  ],
};
