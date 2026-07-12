/**
 * AP US Government & Politics — CED Unit 5.3-5.5: Political Parties.
 *
 * Unit-5 Vertical Slice content plan (follows the Unit-1 calibration
 * template — see ap-apgov-u1-federalism.ts for the shared Passage/rubric
 * infra this plan reuses). Second stop in Unit 5's linkage-institutions
 * walk, following directly from ap-apgov-u5-voting.ts: having covered who
 * can vote and how they decide, this plan covers the organizations that
 * structure most of that choice — political parties.
 *
 * Covers parties as linkage institutions; party functions (mobilization,
 * platform development, candidate recruitment); the shift toward
 * candidate-centered campaigns; realignment and critical elections; and
 * the structural barriers facing third parties (winner-take-all elections,
 * ballot-access laws) alongside third parties' agenda-shaping influence
 * even without winning office.
 *
 * NO WIRED DOCUMENT: like ap-apgov-u2-bureaucracy.ts, this lesson uses a
 * hypothetical-but-realistic scenario (a third-party candidate's campaign)
 * rather than a seeded passage — no Task-16 passage models party-structure
 * content, so nothing is quoted or attributed to a document here.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U5_PARTIES: LessonPlan = {
  id: 'evelyn.ap.apgov.political-parties.v1',
  title: 'U5.3-5.5 Political Parties',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.political-parties',
      description:
        'Explain political parties\' role as a linkage institution and their core functions (mobilization, platform development, candidate recruitment); the shift toward candidate-centered campaigns; realignment and critical elections; and the structural barriers (winner-take-all elections, ballot-access laws) facing third parties, alongside their agenda-shaping influence.',
      standard: 'AP-APGOV-5.3/5.4/5.5',
    },
  ],
  prerequisites: ['apgov.voting-rights-behavior'],
  followUps: ['apgov.interest-groups'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see political parties not as fixed, permanent teams but as coalitions that can suddenly and lastingly reshuffle around a single election, and to notice that the American two-party system is itself a structural outcome, not an accident.',
      script:
        "Last lesson covered how individual citizens decide whether and how to vote. But most of the time, that choice runs through an organization: a political party. Here's a puzzle to open with — American party coalitions haven't always looked the way they do now. At certain moments in history, a single election has permanently reshuffled which groups of voters back which party — political scientists call these critical elections. And here's a second puzzle: despite plenty of Americans telling pollsters they want more choices, this country has had basically two major parties for almost its entire history. That's not a law of nature — it's a product of how our elections are actually structured. Today we map what parties actually DO, how their coalitions can shift, and why a system with no rule against a third party still almost never produces one that wins.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-parties-linkage-realignment-thirdparty',
      kind: 'concept',
      goal: 'Explain parties as a linkage institution and their core functions, the shift to candidate-centered campaigns, realignment/critical elections, and the structural barriers and agenda influence of third parties.',
      keyIdeas: [
        'LINKAGE INSTITUTIONS: the channels that connect citizens\' preferences to government policy and action — political parties, elections, interest groups, and the media are the four classic linkage institutions. Parties link citizens to government by aggregating individual preferences into a broader coalition and slate of candidates.',
        'PARTY FUNCTION — MOBILIZATION: parties organize get-out-the-vote drives, canvassing, and voter contact to turn their supporters out on election day, directly affecting turnout beyond what individual candidates could achieve alone.',
        'PARTY FUNCTION — PLATFORM: parties develop a PLATFORM, a formal statement of the positions and priorities the party stands for, giving voters a lower-cost way to infer where a candidate likely stands across many issues at once (this is the same mechanism behind party-line voting from the prior lesson).',
        'PARTY FUNCTION — RECRUITMENT: parties recruit and help nominate candidates to run for office, particularly important in down-ballot races voters know little about individually.',
        'CANDIDATE-CENTERED CAMPAIGNS: over recent decades, American campaigns have shifted toward being built around an individual candidate\'s own personal brand, fundraising network, and media presence rather than run tightly through party organizations. This gives individual candidates more independence from their party\'s platform and leadership, even as they still run under a party label.',
        'REALIGNMENT AND CRITICAL ELECTIONS: most elections shift a coalition\'s support only marginally. A CRITICAL ELECTION is a rare election that produces a sharp and LASTING shift in which groups of voters support which party — a REALIGNMENT of the party coalitions that persists well beyond that single election. The 1932 election, which shifted many working-class, urban, and immigrant voters into the Democratic coalition amid the Great Depression and the New Deal, is a standard example of a realigning, critical election.',
        'THIRD-PARTY BARRIER — WINNER-TAKE-ALL: most U.S. elections use single-member districts decided by plurality (whoever gets the most votes wins the seat outright) rather than proportional representation (where a party winning, say, 15% of the vote gets roughly 15% of the seats). Under winner-take-all rules, a third party that consistently draws real support but never finishes first wins NO seats for that support — a powerful structural disincentive to vote or organize for a third party, reinforcing the two-party system regardless of voter preferences.',
        'THIRD-PARTY BARRIER — BALLOT ACCESS: many states require candidates or parties to meet signature, petition, or filing requirements simply to appear on the ballot at all. These requirements are typically far easier for established major parties (with existing organizational infrastructure) to satisfy than for new or minor parties, adding a second structural barrier on top of winner-take-all rules.',
        'THIRD-PARTY AGENDA INFLUENCE: despite these barriers, third parties still shape American politics by pushing issues the major parties had ignored onto the national agenda — a major party will sometimes adopt a popular third-party position to win back the voters that third party was drawing, even though the third party itself rarely wins the office in question.',
      ],
      vocabulary: [
        {
          term: 'linkage institution',
          definition: 'a channel connecting citizens\' preferences to government policy — parties, elections, interest groups, and the media.',
        },
        {
          term: 'party platform',
          definition: 'a formal statement of the positions and priorities a political party stands for.',
        },
        {
          term: 'candidate-centered campaign',
          definition: "a campaign built around an individual candidate's own brand, fundraising, and media presence rather than run tightly through party organization.",
        },
        {
          term: 'realignment',
          definition: 'a sharp, lasting shift in which groups of voters support which party, typically triggered by a critical election.',
        },
        {
          term: 'critical election',
          definition: 'a rare election that produces a realignment of party coalitions persisting well beyond that single election (e.g. 1932).',
        },
        {
          term: 'winner-take-all',
          definition: 'an electoral rule in which the candidate with the most votes wins the seat outright, with no seats awarded for a strong-but-not-first-place showing — a major structural barrier to third parties.',
        },
        {
          term: 'ballot access laws',
          definition: 'state requirements (signatures, petitions, filing fees) a candidate or party must meet to appear on the ballot, typically harder for minor parties to satisfy than established major parties.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-critical-election-and-third-party',
      kind: 'worked_example',
      problem:
        'A political scientist studying U.S. elections notes: "The 1932 election shifted many working-class and urban voters into the Democratic coalition, and that shift persisted for decades afterward — it was not reversed in 1936 or 1940." In that same era, a minor third party consistently draws 8-10% of the vote in a particular state\'s elections, year after year, but never finishes first and has never won a single seat in that state\'s legislature. (a) Explain why the 1932 shift described above counts as a realignment produced by a critical election, rather than an ordinary, temporary swing. (b) Explain why the minor third party in this example wins no seats despite drawing a consistent 8-10% of the vote, using the winner-take-all concept. (c) Explain one way this third party could still meaningfully affect state policy even without ever winning a seat.',
      steps: [
        'IDENTIFY WHAT MAKES A SHIFT "CRITICAL." An ordinary election can shift a few voters back and forth without changing the underlying coalition. What makes 1932 a CRITICAL election, per the scenario, is that the shift PERSISTED for decades rather than reversing in the next election or two — durability, not just size, is what defines a realignment.',
        'CONNECT TO REALIGNMENT. Because the working-class/urban shift into the Democratic coalition held through multiple subsequent elections (1936, 1940), it counts as a REALIGNMENT: a lasting reshuffling of which voter groups back which party, not a one-time blip.',
        'APPLY WINNER-TAKE-ALL TO THE THIRD PARTY. Under winner-take-all rules, a candidate needs to finish FIRST to win a seat — there is no partial credit for finishing second with a real but insufficient vote share. A minor party drawing a steady 8-10% will consistently finish behind the two major-party candidates in most districts, so it wins zero seats no matter how many elections in a row it draws that same 8-10%.',
        'CONTRAST WITH PROPORTIONAL REPRESENTATION. Under a proportional system, that same 8-10% vote share would translate into roughly 8-10% of the legislature\'s seats. The gap between "consistent real support" and "zero seats" in this scenario is a direct structural consequence of winner-take-all rules, not a sign the party lacks genuine voter support.',
        'IDENTIFY THE AGENDA-INFLUENCE PATHWAY. Even without winning a seat, a minor party that reliably draws 8-10% represents votes either major party could gain by adopting some of that party\'s popular positions. A major party may shift its own platform toward the third party\'s issues specifically to win back those voters — meaning the third party can shape policy outcomes indirectly, through major-party co-optation, even while remaining shut out of office.',
      ],
      answer:
        'The 1932 shift counts as a critical, realigning election because it PERSISTED across multiple subsequent elections rather than reversing — durability, not just size, is what separates a critical election from an ordinary swing. The third party wins no seats despite its steady 8-10% because winner-take-all rules award the seat only to whoever finishes FIRST in each district; a consistent second-or-third-place vote share, however real, produces zero seats under that rule (it would translate to roughly 8-10% of seats under a proportional system instead). The third party can still shape policy without winning office: a major party may adopt some of its popular positions specifically to win back the voters it is drawing, giving the minor party real agenda influence even while remaining structurally shut out of winning seats.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. A new political party forms around a single issue that neither major party has prioritized. In its first three election cycles it draws 6-9% of the vote in state legislative races but wins no seats, since the state uses single-member districts decided by plurality. By the third cycle, one of the two major parties has revised its own platform to include a version of the new party\'s signature issue. (a) Explain how the party\'s function of platform development is illustrated by the major party\'s revision in this scenario. (b) Using the winner-take-all concept, explain why the new party keeps winning no seats despite its consistent vote share. (c) Explain how this scenario illustrates a third party\'s agenda influence even without winning office.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that a party platform is a formal statement of positions used to signal to voters where the party stands, and that the major party revising its platform to include the issue is an example of that function in action. No credit for a response that does not connect the revision to platform development.',
            modelResponse:
              "A party's platform is its formal statement of the positions it stands for, used to signal to voters where the party falls on major issues. By revising its platform to include a version of the new party's signature issue, the major party is exercising this same platform-development function — updating the formal position it presents to voters, in this case partly in response to the emerging party's support.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that winner-take-all rules award the seat only to the first-place finisher, so a consistent-but-insufficient vote share (6-9%) produces zero seats regardless of how many cycles it persists. No credit for a response that misstates winner-take-all or omits the first-place requirement.',
            modelResponse:
              "Under winner-take-all rules, only the candidate who finishes FIRST in a single-member district wins the seat — there is no partial allocation of seats for a party that consistently finishes behind the top two. Because the new party's 6-9% support keeps landing it in third place, it wins zero seats across all three cycles despite genuinely holding that level of voter support.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that the major party\'s adoption of the issue shows the new party shaping the political agenda/policy outcomes even without winning a seat itself. No credit for a response that claims the new party won influence by winning office.',
            modelResponse:
              "Even though the new party never wins a seat, it shapes the political agenda: a major party adopts a version of its signature issue specifically to win back the voters the new party was attracting. This shows that a third party can influence which issues get addressed and how existing parties position themselves, without ever holding office itself.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-turnout-always-favors-one-party',
      kind: 'misconception_check',
      question: 'True or false: higher overall voter turnout in an election always helps the same political party.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming turnout effects are a fixed law that always favors one party, rather than recognizing that the effect depends on WHICH additional voters turn out and how their preferences compare to the existing electorate in that specific election.',
          correctsTo:
            "FALSE. Higher turnout does not have a single, fixed partisan effect — whether it helps one party depends on WHO the additional voters are and how their preferences differ from the electorate that would have voted anyway. In some elections, a turnout surge draws in voters who lean toward one party; in others, added voters split similarly to the existing electorate or even favor the other party. Treating \"higher turnout helps party X\" as a universal rule ignores that turnout's partisan effect is contingent on the composition of who newly turns out in that specific race, not a constant.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Parties are a linkage institution (alongside elections, interest groups, and media) connecting citizen preferences to government, through three core functions: mobilization, platform development, and candidate recruitment.',
        'Candidate-centered campaigns are built around an individual candidate\'s own brand and fundraising rather than run tightly through the party.',
        'A critical election produces a REALIGNMENT — a lasting shift in party coalitions that persists across subsequent elections (e.g. 1932), unlike an ordinary temporary swing.',
        'Winner-take-all elections (only the first-place finisher wins) and ballot-access laws are the two major structural barriers keeping third parties from winning seats, even with real, consistent voter support.',
        'Third parties still shape politics through agenda influence: major parties sometimes adopt a popular third-party position to win back those voters, even when the third party itself never wins office.',
        'Turnout effects are NOT a fixed law favoring one party — whether higher turnout helps a given party depends on who the additional voters are in that specific election.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.3-5.5',
    cedTitle: 'Political Parties',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
    ],
  },
};
