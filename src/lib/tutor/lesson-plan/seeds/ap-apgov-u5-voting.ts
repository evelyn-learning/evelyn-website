/**
 * AP US Government & Politics — CED Unit 5.1-5.2: Voting Rights & Voter
 * Behavior.
 *
 * Unit-5 Vertical Slice content plan (follows the Unit-1/2/3/4 calibration
 * template — see ap-apgov-u1-federalism.ts for the shared Passage/rubric
 * infra this plan reuses). Opens Unit 5's linkage-institutions walk,
 * picking up from Unit 4's public-opinion material
 * (apgov.socialization-opinion): today's question is what citizens who've
 * formed political views actually DO with them at the ballot box, and who
 * has historically been allowed to cast a ballot at all.
 *
 * Covers the 15th, 19th, 24th, and 26th Amendments and the Voting Rights
 * Act of 1965; the rational-choice, retrospective, prospective, and
 * party-line models of voting behavior; the major factors driving turnout
 * (registration laws, type of election, demographics, political efficacy);
 * and the voluntary-vs-compulsory-voting framing used to explain
 * comparatively low U.S. turnout.
 *
 * DATA-TABLE STIMULUS (Quantitative Analysis document type): the anchor is
 * evelyn.passage.apgov-turnout-age-table.v1 (Task 16), a text DESCRIPTION
 * of a Census Bureau CPS Table A-1 data table, not a literary excerpt — so
 * the worked example restates its figures rather than quoting continuous
 * prose. Per that passage's own docblock, all figures are the REAL
 * published CPS "Total percent" values: reported turnout for ages 18-24
 * was 32.3% (2000), 44.3% (2008), 39.4% (2016), 48.0% (2020); for 65-and-
 * over it was 67.6% (2000), 68.1% (2008), 68.4% (2016), 71.9% (2020). The
 * 18-24-to-65+ gap was 35.3 points (2000), 23.8 (2008), 29.0 (2016), and
 * 23.9 (2020) — the passage's own closing paragraph attributes the
 * 2016-to-2020 narrowing (29.0 -> 23.9) to an 8.6-point youth turnout
 * surge, but is explicit that the 65+ group ALSO rose over that same span
 * (68.4% -> 71.9%), so the gap narrowed WITHOUT closing. Nothing below
 * claims the gap closed, or that turnout is self-reported without
 * qualification (CPS turnout is self-reported and runs above ballot-
 * verified counts, per that passage's own text).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U5_VOTING: LessonPlan = {
  id: 'evelyn.ap.apgov.voting-rights-behavior.v1',
  title: 'U5.1-5.2 Voting Rights & Voter Behavior',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.voting-rights-behavior',
      description:
        'Explain the expansion of voting rights through the 15th, 19th, 24th, and 26th Amendments and the Voting Rights Act of 1965; distinguish the rational-choice, retrospective, prospective, and party-line models of voting behavior; and explain the major factors driving voter turnout (registration laws, type of election, demographics, political efficacy) and the voluntary-vs-compulsory-voting framing used to explain U.S. turnout.',
      standard: 'AP-APGOV-5.1/5.2',
    },
  ],
  prerequisites: ['apgov.socialization-opinion'],
  followUps: ['apgov.political-parties'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see that "who gets to vote" was never settled once and for all by the original Constitution, and to notice that even among citizens who CAN vote today, turnout varies enormously by age — setting up both the rights half and the behavior half of the lesson.',
      script:
        "Last unit closed with how citizens FORM their political views. Today: what they actually do with those views. Here's the first surprise — the original Constitution said almost nothing about who could vote; it left that to the states, and for most of American history that meant huge numbers of citizens were shut out by race, by sex, by poverty, by age. It took four separate constitutional amendments and a landmark 1965 law to even get the RIGHT to vote where it is today. And here's the second surprise: even now, having the right doesn't mean everyone uses it equally. In the four presidential elections we'll look at today, voters 65 and older turned out at a noticeably higher rate than voters 18 to 24 in every single one — no exceptions. Today we map how the right to vote was won, and why, even after it's won, turnout still isn't equal.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-voting-rights-behavior-turnout',
      kind: 'concept',
      goal: 'Explain the 15th/19th/24th/26th Amendments and the VRA; the rational-choice, retrospective, prospective, and party-line voting models; and the factors driving turnout, including the voluntary-vs-compulsory framing.',
      keyIdeas: [
        'THE 15TH AMENDMENT (1870): prohibits denying or abridging the right to vote "on account of race, color, or previous condition of servitude." Ratified after the Civil War — but for nearly a century afterward, many states used poll taxes, literacy tests, and other devices to effectively suppress Black voter registration and turnout despite the amendment\'s text.',
        'THE 19TH AMENDMENT (1920): prohibits denying or abridging the right to vote "on account of sex" — women\'s suffrage, secured after decades of organizing.',
        'THE 24TH AMENDMENT (1964): bans poll taxes (a fee charged to vote) as a condition for voting in FEDERAL elections — removing one of the tools states had used to suppress turnout among poorer voters, disproportionately Black voters in the South.',
        'THE 26TH AMENDMENT (1971): lowers the minimum voting age to 18 nationwide, driven substantially by the argument that citizens old enough to be drafted for military service were old enough to vote.',
        'THE VOTING RIGHTS ACT OF 1965: federal legislation, not a constitutional amendment, passed to give the 15th Amendment real enforcement teeth — it outlawed literacy tests and other discriminatory voting devices and authorized direct federal oversight of voting practices in jurisdictions with histories of racial discrimination. It targeted RACIAL barriers to voting specifically, distinct from the sex-based barrier the 19th Amendment addressed decades earlier.',
        'RATIONAL-CHOICE VOTING: a model in which voters weigh the personal costs and benefits of voting for a given candidate or of voting at all, choosing the option that best serves their own self-interest.',
        'RETROSPECTIVE VOTING: voters evaluate an incumbent (or incumbent party) based on past performance — "has the economy/the country done well under this administration?" — rather than on specific future promises.',
        'PROSPECTIVE VOTING: voters evaluate candidates based on their proposed FUTURE policies and promises, choosing whoever\'s stated platform best matches the voter\'s own preferences going forward.',
        'PARTY-LINE VOTING: voters choose the candidate of the party they identify with across most or all races on a ballot, largely independent of the specific candidates\' individual records or positions — a heuristic that lowers the information cost of voting.',
        'TURNOUT FACTORS: REGISTRATION LAWS (deadlines, ID requirements, same-day or automatic registration all raise or lower the practical cost of registering); TYPE OF ELECTION (presidential elections draw substantially higher turnout than midterm or local elections, reflecting differences in perceived stakes and media attention); DEMOGRAPHICS (turnout correlates strongly with age, education, and income — older, more educated, and higher-income citizens vote at higher rates on average); POLITICAL EFFICACY (a citizen\'s belief that their vote can actually affect government outcomes — lower efficacy is associated with lower turnout).',
        'VOLUNTARY VS. COMPULSORY VOTING: U.S. voting is entirely VOLUNTARY — registering and casting a ballot are left to the individual citizen\'s choice, with no legal penalty for not voting. Some other democracies use COMPULSORY voting, legally requiring eligible citizens to vote (often with a modest penalty for not doing so). This voluntary-vs-compulsory contrast is a standard framing for why measured U.S. turnout runs lower than in some peer democracies.',
      ],
      vocabulary: [
        {
          term: 'Voting Rights Act of 1965',
          definition:
            'federal law (not a constitutional amendment) that outlawed literacy tests and authorized federal oversight of voting practices in jurisdictions with histories of racial discrimination, giving the 15th Amendment real enforcement power.',
        },
        {
          term: 'rational-choice voting',
          definition: 'a model in which voters choose based on the personal costs and benefits of a candidate or of voting itself.',
        },
        {
          term: 'retrospective voting',
          definition: 'evaluating an incumbent based on past performance rather than future promises.',
        },
        {
          term: 'prospective voting',
          definition: "evaluating candidates based on their proposed future policies.",
        },
        {
          term: 'party-line voting',
          definition: "choosing a party's candidates across the ballot based on party identification rather than each race's specifics.",
        },
        {
          term: 'political efficacy',
          definition: "a citizen's belief that their vote and participation can actually affect government outcomes; low efficacy correlates with lower turnout.",
        },
        {
          term: 'compulsory voting',
          definition: 'a system (not used in the U.S.) that legally requires eligible citizens to vote, contrasted with the voluntary U.S. system.',
        },
      ],
      passageId: 'evelyn.passage.apgov-turnout-age-table.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-turnout-age-gap-2020',
      kind: 'worked_example',
      problem:
        'Analyze this data table on reported voter turnout by age group, adapted from the U.S. Census Bureau\'s Current Population Survey (CPS) Voting and Registration Supplement, Table A-1: reported turnout for ages 18-24 was 32.3% in 2000, 44.3% in 2008, 39.4% in 2016, and 48.0% in 2020; reported turnout for ages 65-and-over was 67.6% in 2000, 68.1% in 2008, 68.4% in 2016, and 71.9% in 2020. (a) Compute the turnout gap between the 65+ group and the 18-24 group in 2016 and in 2020. (b) Describe what changed for 18-24-year-olds between 2016 and 2020. (c) Using both age groups\' figures, explain whether the 2020 shift closed the long-standing turnout gap between young and older voters.',
      steps: [
        'SOURCE IT. A described data table adapted from the Census Bureau\'s CPS Voting and Registration Supplement, Table A-1, covering four presidential elections, 2000-2020. CPS turnout is SELF-REPORTED (respondents tell an interviewer whether they voted), so it tends to run a few points above ballot-verified turnout — a limitation to keep in mind, not a reason to distrust the trend.',
        'COMPUTE THE 2016 GAP. 65+ turnout (68.4%) minus 18-24 turnout (39.4%) = 29.0 percentage points.',
        'COMPUTE THE 2020 GAP. 65+ turnout (71.9%) minus 18-24 turnout (48.0%) = 23.9 percentage points.',
        'DESCRIBE THE 18-24 SHIFT. Reported turnout among 18-24-year-olds rose 8.6 percentage points from 2016 to 2020 (39.4% to 48.0%) — a substantial single-election jump, consistent with widely reported record youth turnout in that election.',
        'DID THE GAP CLOSE? NO — IT NARROWED, NOT CLOSED. The gap fell from 29.0 points (2016) to 23.9 points (2020), a real narrowing driven by the youth surge. But the 65+ group ALSO grew over the same span (68.4% to 71.9%), so older voters did not stand still while younger voters caught up. The 2020 youth surge reduced the age gap in reported turnout without eliminating it — a smaller gap is not the same as no gap.',
      ],
      answer:
        'The 65+-to-18-24 turnout gap was 29.0 percentage points in 2016 (68.4% minus 39.4%) and 23.9 points in 2020 (71.9% minus 48.0%). Reported turnout among 18-24-year-olds rose 8.6 points between those two elections (39.4% to 48.0%), a substantial youth-turnout surge. But because 65-and-over turnout ALSO rose over the same span (68.4% to 71.9%), the gap narrowed rather than closed — the 2020 shift reduced the long-standing age gap in reported turnout without eliminating it.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. A state eliminates its poll tax for state elections, adds same-day voter registration, and runs a public-awareness campaign encouraging young citizens to vote. (a) Explain which constitutional amendment addressed poll taxes in FEDERAL elections and how it relates to this state\'s change. (b) Explain how same-day registration is likely to affect turnout, using the turnout-factors framework (registration laws, type of election, demographics, political efficacy). (c) A voter in this state says: "I always vote for whichever candidate is doing the best job right now, based on how things have gone the last four years, not on promises about the future." Identify which model of voting behavior this describes and explain why.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies the 24th Amendment as banning poll taxes in federal elections, and explains that this state\'s change extends a similar removal of a financial barrier to its own (state) elections. No credit for naming the wrong amendment or omitting the poll-tax/24th Amendment link.',
            modelResponse:
              "The 24th Amendment (1964) bans poll taxes as a condition of voting in federal elections. This state's decision to eliminate its own poll tax for state elections extends that same principle — removing a financial barrier to voting — to elections the 24th Amendment itself does not directly cover.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that easing registration requirements (same-day registration) lowers the practical cost/barrier to voting and is likely to raise turnout, tying the explanation to the registration-laws factor. No credit for a response that ignores registration laws as a turnout factor.',
            modelResponse:
              "Same-day registration removes a common barrier to voting — the need to register well in advance of election day — which lowers the practical cost of participating. Since registration laws are one of the key factors driving turnout, easing them (alongside a public-awareness push aimed at raising political efficacy among young citizens) is likely to increase turnout, particularly among citizens who might otherwise miss a registration deadline.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies retrospective voting and explains that it means evaluating the incumbent\'s past performance rather than future promises. No credit for naming a different model or omitting the past-performance reasoning.',
            modelResponse:
              "This voter is engaged in retrospective voting: evaluating the incumbent based on how things have gone during their time in office, rather than on prospective promises about future policy. The voter's own description — judging performance over 'the last four years' rather than future plans — is the defining feature of the retrospective model.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-vra-womens-suffrage',
      kind: 'misconception_check',
      question: 'True or false: the Voting Rights Act of 1965 is the law that gave women the right to vote.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Conflating the two major 20th-century voting-rights milestones — assuming any landmark voting-rights measure must be the one that enfranchised women, rather than distinguishing which barrier (sex vs. race) each measure actually addressed.',
          correctsTo:
            'FALSE. Women\'s right to vote was secured by the 19TH AMENDMENT (1920), a constitutional amendment. The Voting Rights Act of 1965 is a federal LAW (not a constitutional amendment) that targeted RACIAL discrimination in voting — it outlawed literacy tests and authorized federal oversight of jurisdictions with histories of suppressing Black voters, giving the 15th Amendment (1870) real enforcement power nearly a century after its ratification. The two measures address different barriers (sex vs. race) separated by 45 years — don\'t merge them into a single "the law that expanded voting rights" event.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four amendments expanded voting rights: 15th (1870, race), 19th (1920, sex), 24th (1964, bans federal poll taxes), 26th (1971, age 18). The Voting Rights Act of 1965 is a federal LAW, not an amendment, that gave the 15th Amendment real enforcement teeth against racial discrimination.',
        'Four voting-behavior models: rational-choice (self-interest cost/benefit), retrospective (judge past performance), prospective (judge future promises), party-line (vote the party across the ballot).',
        'Turnout factors: registration laws, type of election (presidential > midterm/local), demographics (age/education/income), and political efficacy. U.S. voting is voluntary, unlike compulsory-voting systems elsewhere — a standard framing for comparatively lower U.S. turnout.',
        'In the described 2000-2020 CPS data, 65+ turnout led 18-24 turnout in every election shown. The 18-24 group surged 8.6 points from 2016 to 2020 (39.4% to 48.0%), narrowing the age gap from 29.0 to 23.9 points — but the 65+ group also rose (68.4% to 71.9%) over the same span, so the gap narrowed without closing.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.1-5.2',
    cedTitle: 'Voting Rights & Voter Behavior',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-turnout-age-table.v1',
        chapter: '2000-2020',
        note: 'Described data table (Census Bureau CPS Table A-1) — reported turnout by age group; anchor for the concept and worked example.',
      },
    ],
  },
};
