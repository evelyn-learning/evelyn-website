/**
 * AP US Government & Politics — CED Unit 5.8-5.11: Elections & Campaign
 * Finance.
 *
 * Unit-5 Vertical Slice content plan (follows the Unit-1 calibration
 * template — see ap-apgov-u1-federalism.ts and ap-apgov-u2-judiciary.ts
 * for the shared Passage/rubric infra this plan reuses). Fourth stop in
 * Unit 5's linkage-institutions walk, following directly from
 * ap-apgov-u5-interest-groups.ts: having covered how organized interests
 * pursue their goals, this plan covers the elections and campaign-finance
 * system those interests (and everyone else) operate within.
 *
 * Covers primaries and caucuses (open vs. closed); Electoral College
 * mechanics and critiques; incumbency advantage; and the campaign-finance
 * arc from FECA through BCRA to Citizens United v. FEC, including PACs
 * versus super PACs and hard versus soft money.
 *
 * DOCUMENT STIMULUS: the anchor is
 * evelyn.passage.apgov-citizens-united-opinion.v1 (Task 16), Justice
 * Kennedy's majority opinion in Citizens United v. FEC (2010). Per that
 * passage's own docblock, the seeded excerpt covers exactly two lines of
 * reasoning: (1) that political speech "does not lose First Amendment
 * protection 'simply because its source is a corporation'"; and (2) that
 * independent expenditures — unlike direct contributions — do not create a
 * quid pro quo corruption risk, because the "absence of prearrangement and
 * coordination of an expenditure with the candidate or his agent" removes
 * the danger that justifies limiting direct contributions. The worked
 * example below quotes only this text. The PAC-vs-super-PAC distinction
 * (super PACs may make unlimited independent expenditures but may NOT
 * contribute directly to candidates or coordinate with a campaign) is
 * downstream doctrine that grew out of this holding, not itself quoted
 * from the excerpt, and is presented as settled campaign-finance law in
 * the concept section rather than attributed to the passage.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U5_ELECTIONS: LessonPlan = {
  id: 'evelyn.ap.apgov.elections-campaign-finance.v1',
  title: 'U5.8-5.11 Elections & Campaign Finance',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.elections-campaign-finance',
      description:
        'Explain the difference between open and closed primaries/caucuses; the mechanics and critiques of the Electoral College; incumbency advantage; and the campaign-finance arc from FECA through BCRA to Citizens United v. FEC, including the distinction between PACs and super PACs and between hard and soft money.',
      standard: 'AP-APGOV-5.8/5.9/5.10/5.11',
    },
  ],
  prerequisites: ['apgov.interest-groups', 'apgov.congress-structure'],
  followUps: ['apgov.media-linkage'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see that the presidential election system running today is NOT the one the Founders wrote in Article II — a later amendment quietly rewired it — and to see the modern campaign-finance system as a decades-long back-and-forth between Congress, the Court, and money finding new channels.',
      script:
        "We've covered parties and interest groups. Now the actual mechanics of getting elected, and the money that funds it. Quick question: does the Constitution, as originally written in Article II, describe the presidential election process we use today? It does not — a 12th Amendment rewrite fixed a real crisis in the original design before we’d even used it twice. And on the money side: Congress has spent fifty years trying to regulate campaign spending, only to watch the rules keep shifting — including one Supreme Court case that fundamentally changed what corporations and unions are allowed to spend. Today we map how primaries and the Electoral College actually work, why incumbents so rarely lose, and how campaign-finance law got from strict 1970s limits to today's super PACs.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-elections-electoral-college-campaign-finance',
      kind: 'concept',
      goal: 'Explain open vs. closed primaries/caucuses, Electoral College mechanics and critiques, incumbency advantage, and the FECA-to-BCRA-to-Citizens-United campaign-finance arc including PACs vs. super PACs and hard vs. soft money.',
      keyIdeas: [
        'OPEN VS. CLOSED PRIMARIES: in an OPEN PRIMARY, any registered voter can vote in either party\'s primary regardless of their own party registration. In a CLOSED PRIMARY, only voters registered with that party may vote in its primary. Caucuses are a related but distinct nominating method using in-person meetings and discussion rather than a private ballot vote.',
        'ELECTORAL COLLEGE MECHANICS: each state gets a number of electors equal to its total congressional delegation (House seats plus its two senators); there are 538 electors total, and 270 electoral votes are needed to win. Most states award all of their electors to whichever candidate wins that state\'s popular vote (winner-take-all). If no candidate wins a majority of electoral votes, the 12th Amendment sends the presidential election to the House of Representatives, voting by state delegation, to choose among the top finishers.',
        'THE 12TH AMENDMENT (1804): the ORIGINAL Article II design had each elector cast two votes for President with no separate ballot for Vice President — the runner-up became Vice President. This produced a real crisis in the 1800 election (a tie between Jefferson and his own running mate, Burr, resolved only after many House ballots). The 12th Amendment fixed this by requiring electors to cast SEPARATE ballots for President and Vice President — the system used today is a POST-Founding fix, not the Constitution\'s original text.',
        'ELECTORAL COLLEGE CRITIQUES: a candidate can win the national popular vote yet lose the Electoral College, because it aggregates state-level winner-take-all outcomes rather than counting national votes directly; the system also concentrates campaign attention on a relatively small number of competitive "swing states" rather than the country as a whole, since safely-won states offer no additional electoral payoff for extra campaigning.',
        'INCUMBENCY ADVANTAGE: incumbents (officeholders running for reelection) win at substantially higher rates than challengers, driven by name recognition, the franking privilege (free official mail to constituents), an established fundraising network, prior campaign experience, and constituent casework built up while in office — advantages a first-time challenger typically lacks.',
        'FECA (Federal Election Campaign Act, 1971, amended 1974): the foundational modern campaign-finance law, establishing disclosure requirements for campaign contributions/spending and limits on direct contributions to candidates, along with public financing options for presidential campaigns.',
        'BCRA (Bipartisan Campaign Reform Act, 2002, "McCain-Feingold"): banned SOFT MONEY contributions to national political parties (previously unlimited funds nominally for "party-building" activities, not directly to candidates) and placed new restrictions on issue-advocacy ads run close to an election.',
        'CITIZENS UNITED V. FEC (2010): the Supreme Court held that the First Amendment bars the government from restricting INDEPENDENT political expenditures by corporations and unions — political speech does not lose First Amendment protection simply because a corporation is its source, and independent expenditures (unlike direct contributions) do not create the same quid pro quo corruption risk that justifies limiting direct contributions.',
        'PACS VS. SUPER PACS: a traditional PAC (political action committee) may contribute directly to candidates, subject to federal contribution limits. A SUPER PAC, a vehicle enabled by Citizens United and related lower-court rulings, may raise and spend UNLIMITED sums on INDEPENDENT political expenditures (ads, mailers, etc. not coordinated with a candidate) — but a super PAC may NOT contribute directly to candidates and may NOT coordinate its spending with a candidate\'s campaign. The absence of direct contributions and coordination is exactly the reasoning Citizens United relied on to distinguish independent expenditures from the direct contributions Congress may still limit.',
        'HARD MONEY VS. SOFT MONEY: HARD MONEY is regulated, contribution-limited money given directly to a candidate or party for federal election activity. SOFT MONEY was largely unregulated money nominally raised for party-building rather than a specific candidate, until BCRA banned soft-money contributions to national parties in 2002.',
      ],
      vocabulary: [
        {
          term: 'open primary',
          definition: 'a primary election any registered voter may vote in, regardless of their own party registration.',
        },
        {
          term: 'closed primary',
          definition: "a primary election only voters registered with that party may vote in.",
        },
        {
          term: '12th Amendment',
          definition: 'ratified 1804; requires electors to cast separate ballots for President and Vice President, replacing Article II\'s original single-ballot design after the 1800 Jefferson-Burr crisis.',
        },
        {
          term: 'incumbency advantage',
          definition: 'the substantially higher reelection rate of sitting officeholders, driven by name recognition, franking privilege, fundraising networks, and constituent casework.',
        },
        {
          term: 'BCRA (McCain-Feingold, 2002)',
          definition: 'law banning soft-money contributions to national parties and restricting election-season issue ads.',
        },
        {
          term: 'Citizens United v. FEC (2010)',
          definition: 'Supreme Court case holding the First Amendment bars government restriction of independent political expenditures by corporations and unions.',
        },
        {
          term: 'super PAC',
          definition: 'a political committee that may raise/spend unlimited sums on independent expenditures, but may NOT contribute directly to candidates or coordinate with a campaign.',
        },
        {
          term: 'soft money',
          definition: "largely unregulated party-building money, banned for national parties by BCRA in 2002 — contrasted with contribution-limited hard money.",
        },
      ],
      passageId: 'evelyn.passage.apgov-citizens-united-opinion.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-citizens-united-corporate-speech',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from the Supreme Court\'s opinion in Citizens United v. FEC (Justice Kennedy, 2010): "Under the rationale of these precedents, political speech does not lose First Amendment protection \'simply because its source is a corporation.\'... The Court has thus rejected the argument that political speech of corporations or other associations should be treated differently under the First Amendment simply because such associations are not \'natural persons.\'" And separately: "The absence of prearrangement and coordination of an expenditure with the candidate or his agent not only undermines the value of the expenditure to the candidate, but also alleviates the danger that expenditures will be given as a quid pro quo for improper commitments from the candidate." (a) What is the Court\'s reasoning for why a corporation\'s political speech deserves First Amendment protection? (b) What specific feature of an INDEPENDENT expenditure does the Court say reduces the risk of corruption? (c) Using this reasoning, explain why a super PAC may make unlimited independent expenditures but may not contribute directly to a candidate or coordinate with a campaign.',
      steps: [
        'SOURCE IT. Justice Kennedy\'s majority opinion in Citizens United v. FEC (2010), holding that the First Amendment bars government restriction of independent political expenditures by corporations and unions.',
        'THE CORPORATE-SPEECH REASONING. The Court holds that political speech "does not lose First Amendment protection simply because its source is a corporation" — being a corporation rather than a "natural person" does not strip an entity\'s political speech of constitutional protection.',
        'THE ANTI-CORRUPTION REASONING FOR INDEPENDENT EXPENDITURES. The Court identifies the "absence of prearrangement and coordination of an expenditure with the candidate or his agent" as the key feature that both reduces the expenditure\'s value to the candidate AND removes the quid pro quo corruption risk that justifies limiting DIRECT contributions. Because there is no coordination, there is no direct exchange for the candidate to repay.',
        'APPLY TO SUPER PACS. A super PAC\'s spending is, by definition, independent — not prearranged or coordinated with any candidate\'s campaign. Under the Court\'s own reasoning, that lack of coordination is exactly what removes the corruption risk, which is why the law permits unlimited independent spending by a super PAC even while continuing to cap DIRECT contributions (where coordination and a more direct quid pro quo risk are present).',
        'THE LINE THE REASONING DRAWS. The moment a super PAC\'s spending becomes coordinated with a candidate\'s campaign, or the moment it makes a direct contribution, it steps outside the reasoning the Court used to permit unlimited independent spending in the first place — which is exactly why direct contributions and coordination, unlike independent expenditures, remain subject to legal limits.',
      ],
      answer:
        'The Court reasons that political speech does not lose First Amendment protection simply because its source is a corporation rather than a "natural person." For independent expenditures specifically, the Court identifies the absence of prearrangement and coordination with the candidate as the key feature that removes the quid pro quo corruption risk that justifies limiting direct contributions. Applying this reasoning, a super PAC may make unlimited independent expenditures precisely because that spending is not coordinated with any campaign — but the moment it made a direct contribution or coordinated with a candidate, it would fall outside this reasoning and back into the category of activity the law can and does limit.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. In a state with a closed primary, only voters registered with a party may help select that party\'s nominee. In the general election that follows, the incumbent officeholder wins reelection by a wide margin. Separately, a super PAC spends millions of dollars on ads supporting the incumbent\'s opponent, without ever discussing ad strategy with the opponent\'s campaign. (a) Explain one way a closed primary differs from an open primary in terms of who can participate. (b) Identify two specific factors that typically give an incumbent officeholder an advantage in a general election. (c) Explain why the super PAC in this scenario is legally permitted to spend unlimited money on these ads, but would NOT be permitted to contribute that money directly to the opponent\'s campaign.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly explains that a closed primary restricts voting to registered party members, while an open primary allows any registered voter regardless of party. No credit for a reversed or vague description.',
            modelResponse:
              "In a closed primary, only voters who are registered with that party may vote in its primary election. This differs from an open primary, where any registered voter may participate in either party's primary regardless of their own party registration.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies two real incumbency-advantage factors (e.g. name recognition, franking privilege, fundraising network, constituent casework). No credit for citing a factor that is not an actual incumbency advantage or naming only one.',
            modelResponse:
              "Two factors driving incumbency advantage are name recognition — voters are simply more familiar with a sitting officeholder than with a new challenger — and the franking privilege, which lets incumbents send official mail to constituents at public expense, keeping their name and record in front of voters between elections.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains, using Citizens United\'s reasoning, that independent (uncoordinated) expenditures don\'t create the same quid pro quo corruption risk as direct contributions, which is why super PACs may spend unlimited amounts independently but may not contribute directly to or coordinate with a campaign. No credit for a response that claims super PACs may donate directly to candidates.',
            modelResponse:
              "Because the super PAC's spending is independent — not coordinated with the opponent's campaign — it does not create the quid pro quo corruption risk that direct contributions can create, per the reasoning in Citizens United v. FEC. That is exactly why the law permits unlimited independent expenditures by a super PAC while still barring it from contributing directly to a candidate or coordinating its spending with that candidate's campaign; a direct contribution or coordinated spending would reintroduce the corruption risk the independent-expenditure reasoning depends on there being none of.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-electoral-college-article-ii-verbatim',
      kind: 'misconception_check',
      question:
        'True or false: today\'s Electoral College process — with electors casting one ballot for President and a separate ballot for Vice President — is exactly how Article II of the Constitution originally described presidential elections.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming the Electoral College process used today must be the Founders\' original design simply because "Electoral College" sounds like an unchanged, purely Founding-era institution, rather than recognizing that a later amendment rewired a specific part of it.',
          correctsTo:
            'FALSE. Article II\'s ORIGINAL design had each elector cast TWO votes for President, with no separate Vice-Presidential ballot — the runner-up simply became Vice President. That design produced a real crisis in the election of 1800, when Thomas Jefferson and his own running mate, Aaron Burr, tied in electoral votes and the election had to be resolved by the House of Representatives after many ballots. The 12TH AMENDMENT (1804) fixed this by requiring electors to cast SEPARATE ballots for President and Vice President — the system used today is a post-Founding constitutional fix, not Article II\'s original, unmodified text.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Open primaries allow any registered voter to participate; closed primaries restrict voting to that party\'s registered members.',
        'The Electoral College: 538 electors, 270 to win, mostly winner-take-all by state; a no-majority outcome sends the election to the House under the 12th Amendment — which itself REPLACED Article II\'s original single-ballot design after the 1800 crisis. Critiques: a popular-vote winner can still lose the Electoral College, and campaigning concentrates on swing states.',
        'Incumbency advantage comes from name recognition, franking privilege, fundraising networks, and constituent casework.',
        'Campaign-finance arc: FECA (1971, disclosure + contribution limits) -> BCRA (2002, banned soft money to national parties) -> Citizens United v. FEC (2010, independent corporate/union expenditures protected by the First Amendment).',
        'PACs may contribute directly to candidates within limits; super PACs may spend UNLIMITED sums on INDEPENDENT expenditures but may NOT contribute directly to candidates or coordinate with a campaign — the lack of coordination is exactly what Citizens United\'s reasoning relies on.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.8-5.11',
    cedTitle: 'Elections & Campaign Finance',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-citizens-united-opinion.v1',
        chapter: '2010',
        note: 'Citizens United v. FEC opinion excerpt — corporate-speech and independent-expenditure/anti-corruption reasoning; anchor for the concept and worked example.',
      },
    ],
  },
};
