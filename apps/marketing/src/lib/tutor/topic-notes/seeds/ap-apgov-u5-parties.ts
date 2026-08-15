/**
 * AP US Government & Politics — CED Unit 5.3-5.5: Political Parties.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.political-parties.v1`. Covers parties as a linkage
 * institution and their core functions (mobilization, platform
 * development, candidate recruitment); the shift toward
 * candidate-centered campaigns; realignment and critical elections
 * (1932 as the standard example); and the structural barriers facing
 * third parties (winner-take-all elections, ballot-access laws)
 * alongside their agenda-shaping influence even without winning office.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_POLITICAL_PARTIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.political-parties.v1',
  course: 'AP US Government & Politics',
  cedUnit: 5,
  cedTopic: '5.3-5.5',
  cedTitle: 'Political Parties',
  planId: 'evelyn.ap.apgov.political-parties.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.political-parties.v1' }],
  theory: [
    {
      loId: 'apgov.political-parties',
      kind: 'definition',
      title: 'linkage institution',
      content:
        'A channel that connects citizens\' preferences to government policy and action. Political parties, elections, interest groups, and the media are the four classic linkage institutions. Parties link citizens to government by aggregating individual preferences into a broader coalition and slate of candidates.',
    },
    {
      loId: 'apgov.political-parties',
      kind: 'concept',
      title: 'party function — mobilization',
      content:
        'Parties organize get-out-the-vote drives, canvassing, and voter contact to turn their supporters out on election day, directly affecting turnout beyond what individual candidates could achieve alone.',
    },
    {
      loId: 'apgov.political-parties',
      kind: 'definition',
      title: 'party platform',
      content:
        "A formal statement of the positions and priorities a political party stands for. It gives voters a lower-cost way to infer where a candidate likely stands across many issues at once — the same mechanism behind party-line voting.",
    },
    {
      loId: 'apgov.political-parties',
      kind: 'concept',
      title: 'party function — candidate recruitment',
      content:
        'Parties recruit and help nominate candidates to run for office, particularly important in down-ballot races voters know little about individually.',
    },
    {
      loId: 'apgov.political-parties',
      kind: 'concept',
      title: 'candidate-centered campaigns',
      content:
        "Over recent decades, American campaigns have shifted toward being built around an individual candidate's own personal brand, fundraising network, and media presence rather than run tightly through party organizations. This gives individual candidates more independence from their party's platform and leadership, even as they still run under a party label.",
    },
    {
      loId: 'apgov.political-parties',
      kind: 'definition',
      title: 'critical election and realignment',
      content:
        'A CRITICAL ELECTION is a rare election that produces a sharp and LASTING shift in which groups of voters support which party — a REALIGNMENT of the party coalitions that persists well beyond that single election. Most elections shift a coalition\'s support only marginally; durability across MULTIPLE subsequent elections, not just size, is what makes a shift "critical."',
    },
    {
      loId: 'apgov.political-parties',
      kind: 'concept',
      title: '1932 as the standard realignment example',
      content:
        'The 1932 election shifted many working-class, urban, and immigrant voters into the Democratic coalition amid the Great Depression and the New Deal — a shift that persisted for decades, through 1936 and 1940 and beyond, rather than reversing in the next cycle. That durability is exactly what separates a critical, realigning election from an ordinary, temporary swing.',
    },
    {
      loId: 'apgov.political-parties',
      kind: 'definition',
      title: 'winner-take-all',
      content:
        'An electoral rule (used in most U.S. elections) in which single-member districts are decided by plurality — whoever gets the most votes wins the seat outright — rather than proportional representation, where a party winning roughly 15% of the vote would get roughly 15% of the seats. Under winner-take-all, a third party that consistently draws real support but never finishes first wins NO seats for that support.',
    },
    {
      loId: 'apgov.political-parties',
      kind: 'concept',
      title: 'ballot-access laws — the second third-party barrier',
      content:
        'Many states require candidates or parties to meet signature, petition, or filing requirements simply to appear on the ballot at all. These requirements are typically far easier for established major parties (with existing organizational infrastructure) to satisfy than for new or minor parties, adding a structural barrier on top of winner-take-all rules.',
    },
    {
      loId: 'apgov.political-parties',
      kind: 'concept',
      title: 'third-party agenda influence',
      content:
        'Despite structural barriers, third parties still shape American politics by pushing issues the major parties had ignored onto the national agenda. A major party will sometimes adopt a popular third-party position specifically to win back the voters that third party was drawing, even though the third party itself rarely wins the office in question.',
    },
    {
      loId: 'apgov.political-parties',
      kind: 'trap',
      title: 'turnout does not have a fixed partisan effect',
      content:
        'Higher overall turnout does NOT always help the same party. Whether a turnout surge helps one party depends on WHO the additional voters are and how their preferences compare to the electorate that would have voted anyway — treating "higher turnout helps party X" as a universal law ignores that the effect is contingent on who newly turns out in that specific race.',
    },
  ],
  methods: [
    {
      title: 'Determine whether a described election shift is a realignment',
      when_to_use:
        'Use this whenever a prompt describes a shift in which voters support which party and asks whether it counts as a realignment produced by a critical election.',
      steps: [
        'CHECK DURABILITY, NOT JUST SIZE. Does the shift persist across MULTIPLE subsequent elections, or does it reverse within a cycle or two?',
        'IF IT PERSISTS -> this is a realignment produced by a critical election (e.g. 1932).',
        'IF IT REVERSES QUICKLY -> this is an ordinary, temporary swing, not a realignment.',
        'DO NOT call every large single-election shift a "realignment" — size alone is not sufficient without durability.',
      ],
      example: {
        problem: 'A shift into one party\'s coalition holds steady through the next two elections rather than reversing. Is this a realignment?',
        solution: 'Yes — durability across subsequent elections is the defining feature of a realignment, not the size of the initial shift alone.',
      },
      relatedLoIds: ['apgov.political-parties'],
    },
    {
      title: 'Explain why a consistently-polling third party wins no seats',
      when_to_use:
        'Use this whenever a prompt describes a third party drawing a steady vote share (e.g. 6-10%) across cycles under single-member-district elections and asks why it wins no seats.',
      steps: [
        'IDENTIFY THE ELECTORAL RULE. Single-member districts decided by plurality = winner-take-all.',
        'APPLY THE RULE. Only the FIRST-PLACE finisher wins the seat — there is no partial credit for a real-but-insufficient vote share.',
        'CONTRAST WITH PROPORTIONAL REPRESENTATION to show the gap is structural, not a sign of weak support: the same vote share would translate into roughly that same share of seats under a proportional system.',
        'IF ASKED FOR INFLUENCE DESPITE NO SEATS, invoke agenda influence: a major party may adopt the third party\'s popular position to win back those voters.',
      ],
      relatedLoIds: ['apgov.political-parties'],
    },
  ],
  pointers: [
    { content: 'Linkage institutions = parties, elections, interest groups, media — the channels connecting citizen preferences to government.', kind: 'tip' },
    { content: 'A critical/realigning election is defined by DURABILITY of the shift across multiple subsequent elections, not just the size of one election\'s swing.', kind: 'tip' },
    { content: 'Winner-take-all means only the first-place finisher wins a seat — a steady 6-10% vote share still yields zero seats under this rule.', kind: 'trap' },
    { content: 'Ballot-access laws (signatures, filing fees) are a SEPARATE structural barrier from winner-take-all — don\'t conflate the two when asked to name barriers to third parties.', kind: 'tip' },
    { content: 'Third parties can shape policy through agenda influence (major-party co-optation of a popular position) even while winning zero seats — "no seats" does not mean "no influence."', kind: 'tip' },
    { content: 'Never claim higher turnout has a fixed, universal partisan effect — it depends on who the additional voters are in that specific election.', kind: 'trap' },
  ],
};
