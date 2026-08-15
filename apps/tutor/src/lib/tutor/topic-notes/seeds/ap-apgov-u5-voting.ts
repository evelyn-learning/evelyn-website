/**
 * AP US Government & Politics — CED Unit 5.1-5.2: Voting Rights & Voter
 * Behavior.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.voting-rights-behavior.v1`. Covers the four
 * constitutional amendments expanding voting rights (15th, 19th, 24th,
 * 26th) plus the Voting Rights Act of 1965; the rational-choice,
 * retrospective, prospective, and party-line models of voting behavior;
 * the major factors driving turnout; and the voluntary-vs-compulsory
 * framing for U.S. turnout.
 *
 * TURNOUT FIGURES: the real, published Census Bureau CPS Table A-1
 * "Total percent" values quoted in the plan's own docblock — ages 18-24:
 * 32.3% (2000), 44.3% (2008), 39.4% (2016), 48.0% (2020); ages 65+:
 * 67.6% (2000), 68.1% (2008), 68.4% (2016), 71.9% (2020). The 2016-to-2020
 * gap NARROWED (29.0 -> 23.9 points) because BOTH groups rose, not because
 * the 65+ group stood still — nothing below claims the gap closed.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_VOTING_RIGHTS_BEHAVIOR: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.voting-rights-behavior.v1',
  course: 'AP US Government & Politics',
  cedUnit: 5,
  cedTopic: '5.1-5.2',
  cedTitle: 'Voting Rights & Voter Behavior',
  planId: 'evelyn.ap.apgov.voting-rights-behavior.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.voting-rights-behavior.v1' }],
  theory: [
    {
      loId: 'apgov.voting-rights-behavior',
      kind: 'concept',
      title: '15th and 19th Amendments',
      content:
        'The 15TH AMENDMENT (1870) prohibits denying or abridging the right to vote "on account of race, color, or previous condition of servitude" — but for nearly a century afterward, many states used poll taxes, literacy tests, and other devices to effectively suppress Black voter registration and turnout despite the text. The 19TH AMENDMENT (1920) prohibits denying or abridging the right to vote "on account of sex," securing women\'s suffrage after decades of organizing. These two amendments address DIFFERENT barriers (race vs. sex), separated by 50 years — never merge them.',
    },
    {
      loId: 'apgov.voting-rights-behavior',
      kind: 'concept',
      title: '24th and 26th Amendments',
      content:
        'The 24TH AMENDMENT (1964) bans poll taxes (a fee charged to vote) as a condition for voting in FEDERAL elections, removing a tool states had used to suppress turnout among poorer voters, disproportionately Black voters in the South. The 26TH AMENDMENT (1971) lowers the minimum voting age to 18 nationwide, driven substantially by the argument that citizens old enough to be drafted for military service were old enough to vote.',
    },
    {
      loId: 'apgov.voting-rights-behavior',
      kind: 'definition',
      title: 'Voting Rights Act of 1965',
      content:
        'Federal LEGISLATION (not a constitutional amendment) passed to give the 15th Amendment real enforcement teeth: it outlawed literacy tests and other discriminatory voting devices and authorized direct federal oversight of voting practices in jurisdictions with histories of racial discrimination. It targeted RACIAL barriers to voting specifically, distinct from the sex-based barrier the 19th Amendment addressed 45 years earlier.',
    },
    {
      loId: 'apgov.voting-rights-behavior',
      kind: 'concept',
      title: 'four models of voting behavior',
      content:
        'RATIONAL-CHOICE VOTING: voters weigh the personal costs and benefits of voting for a candidate, or of voting at all, choosing whichever option best serves self-interest. RETROSPECTIVE VOTING: voters evaluate an incumbent (or incumbent party) based on PAST performance ("has the country done well under this administration?"). PROSPECTIVE VOTING: voters evaluate candidates based on proposed FUTURE policies and promises. PARTY-LINE VOTING: voters choose their party\'s candidate across most or all races on a ballot, largely independent of the specific candidates\' records — a heuristic that lowers the information cost of voting.',
    },
    {
      loId: 'apgov.voting-rights-behavior',
      kind: 'concept',
      title: 'turnout factors',
      content:
        'REGISTRATION LAWS (deadlines, ID requirements, same-day or automatic registration raise or lower the practical cost of registering); TYPE OF ELECTION (presidential elections draw substantially higher turnout than midterm or local elections, reflecting differences in perceived stakes and media attention); DEMOGRAPHICS (turnout correlates strongly with age, education, and income — older, more educated, and higher-income citizens vote at higher rates on average); POLITICAL EFFICACY (a citizen\'s belief that their vote can actually affect government outcomes — lower efficacy is associated with lower turnout).',
    },
    {
      loId: 'apgov.voting-rights-behavior',
      kind: 'definition',
      title: 'political efficacy',
      content:
        "A citizen's belief that their vote and participation can actually affect government outcomes. Low political efficacy is associated with lower turnout — a citizen who doubts their vote matters has less reason to bear the cost of voting at all.",
    },
    {
      loId: 'apgov.voting-rights-behavior',
      kind: 'definition',
      title: 'compulsory voting',
      content:
        'A system (NOT used in the U.S.) that legally requires eligible citizens to vote, often with a modest penalty for not doing so. U.S. voting is entirely VOLUNTARY — registering and casting a ballot are left to the individual citizen\'s choice, with no legal penalty for not voting. This voluntary-vs-compulsory contrast is a standard framing for why measured U.S. turnout runs lower than in some peer democracies.',
    },
    {
      loId: 'apgov.voting-rights-behavior',
      kind: 'concept',
      title: 'CPS turnout-by-age data (2000-2020)',
      content:
        'Real published Census Bureau CPS Table A-1 "Total percent" figures. Ages 18-24: 32.3% (2000), 44.3% (2008), 39.4% (2016), 48.0% (2020). Ages 65+: 67.6% (2000), 68.1% (2008), 68.4% (2016), 71.9% (2020). The 65+-to-18-24 gap was 35.3 points (2000), 23.8 (2008), 29.0 (2016), and 23.9 (2020). CPS turnout is SELF-REPORTED, so it tends to run a few points above ballot-verified turnout.',
    },
    {
      loId: 'apgov.voting-rights-behavior',
      kind: 'concept',
      title: 'the 2016-to-2020 gap narrowed — it did not close',
      content:
        'Reported turnout among 18-24-year-olds rose 8.6 points from 2016 to 2020 (39.4% to 48.0%), a substantial youth-turnout surge. But the 65+ group ALSO rose over the same span (68.4% to 71.9%), so the gap NARROWED (29.0 to 23.9 points) rather than closed. A smaller gap is not the same as no gap — 65+ turnout led 18-24 turnout in every election in this dataset, with no exceptions.',
    },
    {
      loId: 'apgov.voting-rights-behavior',
      kind: 'trap',
      title: 'the VRA did not enfranchise women',
      content:
        'A common error: assuming any landmark voting-rights measure must be the one that enfranchised women. Women\'s right to vote was secured by the 19TH AMENDMENT (1920), a constitutional amendment. The Voting Rights Act of 1965 is a federal LAW targeting RACIAL discrimination in voting, giving the 15th Amendment (1870) real enforcement power nearly a century after its ratification. Don\'t merge these two distinct, differently-timed milestones.',
    },
  ],
  methods: [
    {
      title: 'Classify a described voting decision by model',
      when_to_use:
        'Use this whenever a prompt describes how a voter is reasoning about a candidate choice and asks which model of voting behavior it illustrates.',
      steps: [
        'CHECK THE TIME ORIENTATION. Is the voter looking backward at what already happened, or forward at what is promised?',
        'IF BACKWARD-LOOKING (judging past performance/results) -> retrospective voting.',
        'IF FORWARD-LOOKING (judging proposed future policies/promises) -> prospective voting.',
        'IF THE VOTER IS FOLLOWING PARTY LABEL ACROSS THE BALLOT REGARDLESS OF INDIVIDUAL RECORDS -> party-line voting.',
        'IF THE VOTER IS EXPLICITLY WEIGHING PERSONAL COSTS/BENEFITS OF VOTING OR OF A CANDIDATE\'S POSITIONS -> rational-choice voting.',
      ],
      example: {
        problem: 'A voter says: "I always vote for whoever is doing the best job right now, based on how things have gone the last four years."',
        solution: 'Retrospective voting — the voter is explicitly judging past performance, not future promises.',
      },
      relatedLoIds: ['apgov.voting-rights-behavior'],
    },
    {
      title: 'Compute and interpret a turnout gap from a data table',
      when_to_use:
        'Use this whenever a prompt gives turnout percentages for two groups across elections and asks you to compute a gap and describe the trend.',
      steps: [
        'SUBTRACT the lower group\'s percentage from the higher group\'s percentage, for each year requested, to get the gap in percentage points.',
        'DESCRIBE ANY SINGLE-GROUP CHANGE separately (e.g. how much one group\'s turnout rose or fell between two elections).',
        'BEFORE CLAIMING A GAP "CLOSED," CHECK BOTH GROUPS. If the gap shrank because ONE group rose while the OTHER stayed flat or fell, that is different from the gap shrinking because both groups rose (narrowing without closing) or the lower group caught all the way up (closing).',
        'STATE THE CONCLUSION PRECISELY: "narrowed" (both moved, gap smaller but nonzero) is not the same claim as "closed" (gap reached zero).',
      ],
      relatedLoIds: ['apgov.voting-rights-behavior'],
    },
  ],
  pointers: [
    { content: 'The 19th Amendment (1920) enfranchised women; the Voting Rights Act of 1965 is a federal LAW targeting racial discrimination — never conflate the two.', kind: 'trap' },
    { content: 'The 24th Amendment bans poll taxes only in FEDERAL elections — a state can still eliminate its own state-election poll tax by ordinary state action, which is a separate step.', kind: 'tip' },
    { content: 'CPS turnout figures are SELF-REPORTED and run a few points above ballot-verified counts — a data-quality caveat, not a reason to distrust the trend.', kind: 'tip' },
    { content: 'The 2016-to-2020 turnout gap narrowed (29.0 to 23.9 points) because BOTH age groups rose — never claim the age gap in turnout "closed."', kind: 'trap' },
    { content: 'Retrospective = judge the PAST; prospective = judge PROMISED FUTURE policy. Keep the time direction straight.', kind: 'tip' },
    { content: 'U.S. voting is voluntary, not compulsory — no legal penalty exists for not voting, unlike some peer democracies.', kind: 'tip' },
  ],
};
