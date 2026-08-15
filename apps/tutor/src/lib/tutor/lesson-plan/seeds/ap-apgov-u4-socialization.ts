/**
 * AP US Government & Politics — CED Unit 4.1-4.4: Political Socialization &
 * Public Opinion.
 *
 * Unit-4 Vertical Slice content plan (follows the Unit-1/2/3 calibration
 * template — see ap-apgov-u1-federalism.ts for the shared Passage/rubric
 * infra this plan reuses). First stop in Unit 4's public-opinion walk;
 * opens with how citizens FORM their political views before Unit 4 turns to
 * how those views get measured (apgov.public-opinion-measurement) and
 * organized into ideology (apgov.ideology-policy).
 *
 * Covers the agents of political socialization (family, school, peers,
 * media, religion), generational ("cohort") effects vs. lifecycle ("aging")
 * effects on ideology, the American core values (individualism, equality of
 * opportunity, free enterprise, rule of law, limited government), and
 * globalization's influence on political attitudes.
 *
 * DATA-TABLE STIMULUS (Quantitative Analysis document type): the anchor is
 * evelyn.passage.apgov-ideology-age-table.v1, seeded in Task 11 — a text
 * DESCRIPTION of a data table of GALLUP's 2021 calendar-year polling
 * ("U.S. Political Ideology Steady; Conservatives, Moderates Tie",
 * news.gallup.com/poll/388988), not a literary excerpt, so the worked
 * example restates its figures rather than quoting continuous prose. Per
 * that passage's own docblock: conservative self-identification RISES with
 * age (23% ages 18-29 -> 33% ages 30-49 -> 43% ages 50-64 -> 45% ages 65+),
 * liberal self-identification falls from 34% (18-29) to a low of 19%
 * (50-64) before ticking up slightly to 21% (65+), and the passage's own
 * closing paragraph attributes this pattern primarily to a GENERATIONAL
 * (cohort) effect rather than a lifecycle (aging) effect — nothing below
 * claims a different attribution than that, and every reference to this
 * data is attributed to Gallup, never ANES.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U4_SOCIALIZATION: LessonPlan = {
  id: 'evelyn.ap.apgov.socialization-opinion.v1',
  title: 'U4.1-4.4 Political Socialization & Public Opinion',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.socialization-opinion',
      description:
        'Explain the major agents of political socialization (family, school, peers, media, religion); distinguish generational (cohort) effects from lifecycle (aging) effects on political attitudes; describe the American core political values (individualism, equality of opportunity, free enterprise, rule of law, limited government); and explain globalization\'s influence on public opinion.',
      standard: 'AP-APGOV-4.1/4.2/4.3/4.4',
    },
  ],
  prerequisites: ['apgov.democratic-ideals'],
  followUps: ['apgov.public-opinion-measurement'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see their own political opinions as the product of specific, nameable influences — not something they arrived at from nowhere — and to notice that a whole generation can share a political outlook without any single person ever "deciding" to hold it.',
      script:
        "Quick question: where did your opinions about government actually come from? Most people can't fully answer that — but political scientists can name the usual suspects: what your family talked about at dinner, what your school taught you about citizenship, what your friends think, what media you consume, and, for many people, their religious upbringing. Here's the more surprising part. Gallup has been asking American adults to place themselves on a liberal-to-conservative scale for decades, and if you break the results down by age group, older Americans are consistently more conservative than younger Americans — every single time Gallup runs the poll, not just this year. Does that mean people become more conservative as they personally get older? Or does it mean each generation was shaped by different formative experiences and mostly KEEPS that outlook as it ages? That distinction — and the five \"agents of socialization\" that do the shaping in the first place — is today's lesson.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-socialization-agents-and-values',
      kind: 'concept',
      goal: 'Explain the five major agents of political socialization, distinguish generational from lifecycle effects using the Gallup age-ideology pattern, describe the five American core values, and explain globalization\'s influence on public opinion.',
      keyIdeas: [
        'POLITICAL SOCIALIZATION: the lifelong process by which people acquire their political attitudes, values, and knowledge. It happens gradually, through repeated exposure to specific "agents," not through any single deliberate decision.',
        'AGENT 1 — FAMILY: the single strongest and earliest influence for most people. Party identification in particular tends to be passed down from parents to children through everyday conversation and modeled behavior, well before a child can independently evaluate policy.',
        'AGENT 2 — SCHOOL: civics and history curricula, the Pledge of Allegiance, and school structures themselves (student government, rule-following) transmit basic democratic values and civic knowledge — often the first place a young person is deliberately taught WHY American government is organized the way it is.',
        'AGENT 3 — PEERS: as people move through adolescence and young adulthood, friend groups and social circles increasingly shape political attitudes, particularly on newly salient issues where family influence has not already set a fixed view.',
        'AGENT 4 — MEDIA: news coverage, entertainment, and (increasingly) social media shape both WHAT people think about (agenda-setting) and, over time, how they interpret it. Media influence compounds with the other agents rather than replacing them — it is usually filtered through family and peer discussion, not absorbed in isolation.',
        'AGENT 5 — RELIGION: religious institutions and upbringing shape political attitudes both directly (explicit teaching on moral and social questions) and indirectly (the community and social networks a religious upbringing builds, which then transmit attitudes the way peer groups do).',
        'GENERATIONAL (COHORT) EFFECTS VS. LIFECYCLE (AGING) EFFECTS: two different explanations for why age groups differ politically. A LIFECYCLE effect means individuals shift their views AS THEY personally age — the same person becomes more conservative (or more liberal) simply by growing older, regardless of when they were born. A GENERATIONAL (or COHORT) effect means each generation is shaped by the distinctive formative political events of ITS coming-of-age years, and that outlook then persists across the cohort\'s lifetime even as its members age — the difference between age groups reflects WHEN they came of age, not aging itself.',
        'READING THE GALLUP AGE-IDEOLOGY PATTERN THE RIGHT WAY: Gallup\'s 2021 polling shows conservative self-identification rising steadily with age and liberal self-identification generally falling with age. Political scientists studying this kind of pattern generally attribute it MORE to a generational/cohort effect (each age cohort\'s formative political experiences persisting over its lifetime) than to a pure lifecycle/aging effect (individuals simply drifting rightward as they personally age) — a distinction this unit\'s worked example unpacks using Gallup\'s own published figures.',
        'CORE AMERICAN VALUES: five widely shared, though variously interpreted, political values that cut across ideology and party: INDIVIDUALISM (personal responsibility and self-reliance are primary; government should not be the first answer to every problem); EQUALITY OF OPPORTUNITY (everyone should have a fair chance to succeed, though people plainly disagree about what "fair chance" requires in practice — this is a distinct value from equality of OUTCOME); FREE ENTERPRISE (a market economy with limited government interference is the default American economic arrangement); RULE OF LAW (government officials and ordinary citizens alike are bound by publicly known, generally applicable law — no one is above it); and LIMITED GOVERNMENT (government\'s power is bounded, not open-ended, tracing back to the ideals covered in Unit 1). These values are broadly SHARED across the ideological spectrum even though liberals, conservatives, and libertarians weigh and apply them differently — they are common ground, not a partisan checklist.',
        'GLOBALIZATION\'S INFLUENCE ON PUBLIC OPINION: increased international trade, migration, communication, and cultural exchange expose Americans to comparative reference points — how other countries handle healthcare, immigration, or economic policy — that did not previously factor into domestic political debate as readily. Globalization also raises new domestic political fault lines (trade policy\'s effect on manufacturing jobs, immigration policy, international institutions\' role) that did not exist in the same form for earlier generations, itself a source of generational difference in political attitudes.',
      ],
      vocabulary: [
        {
          term: 'political socialization',
          definition:
            'the lifelong process by which people acquire their political attitudes, values, and knowledge, primarily through family, school, peers, media, and religion.',
        },
        {
          term: 'agents of socialization',
          definition:
            'the sources through which political socialization occurs — chiefly family, school, peers, media, and religion.',
        },
        {
          term: 'generational (cohort) effect',
          definition:
            "a political attitude shared by people who came of age during the same historical period, formed by that period's events and persisting across the cohort's lifetime.",
        },
        {
          term: 'lifecycle (aging) effect',
          definition:
            'a political attitude shift that occurs as an individual personally ages, independent of which historical period they came of age in.',
        },
        {
          term: 'core American values',
          definition:
            'widely shared American political values — individualism, equality of opportunity, free enterprise, rule of law, and limited government — held across the ideological spectrum, though interpreted differently by different ideologies.',
        },
      ],
      passageId: 'evelyn.passage.apgov-ideology-age-table.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ideology-age-cohort-pattern',
      kind: 'worked_example',
      problem:
        'Analyze this data table on self-reported political ideology by age group, adapted from Gallup\'s report "U.S. Political Ideology Steady; Conservatives, Moderates Tie" (calendar-year 2021 polling): among adults ages 18-29, 34% describe themselves as liberal, 41% as moderate, 23% as conservative; ages 30-49: 25% liberal, 40% moderate, 33% conservative; ages 50-64: 19% liberal, 36% moderate, 43% conservative; ages 65+: 21% liberal, 32% moderate, 45% conservative. (a) Describe the trend in conservative self-identification across the four age groups. (b) Describe the trend in liberal self-identification across the same four age groups — is it a perfect mirror image of (a)? (c) Political scientists generally explain this kind of age pattern using one of two competing hypotheses: a lifecycle (aging) effect, or a generational (cohort) effect. Which explanation does the political-socialization research Gallup\'s finding is typically read alongside favor, and why does that matter for predicting whether these percentages will look the same in twenty years?',
      steps: [
        'SOURCE IT. A described data table adapted from Gallup\'s own published 2021 calendar-year polling report, breaking self-reported ideology into four age groups.',
        'READ THE CONSERVATIVE TREND — RISES STEADILY WITH AGE. 23% (18-29) -> 33% (30-49) -> 43% (50-64) -> 45% (65+). Conservative self-identification increases at every single age-group interval shown, with the steepest jump between the two middle groups (30-49 to 50-64, +10 points).',
        'READ THE LIBERAL TREND — NOT A PERFECT MIRROR. 34% (18-29) -> 25% (30-49) -> 19% (50-64) -> 21% (65+). Liberal identification falls for the first three groups but then TICKS UP slightly for the oldest group (65+, 21% vs. 19% for 50-64) rather than continuing to fall. This is NOT simply the conservative trend running in reverse — don\'t describe it as strictly monotonic decline across all four groups.',
        'IDENTIFY THE COMPETING HYPOTHESES. A LIFECYCLE (aging) explanation would say individual people personally become more conservative as they age, so the SAME cohort would show rising conservative identification over time as it ages. A GENERATIONAL (cohort) explanation would say each age group\'s political outlook was shaped by the distinctive events of ITS coming-of-age years and then persists — so the differences between age groups reflect WHEN each group was politically formed, not what aging itself does to a person.',
        'APPLY THE COHORT EXPLANATION TO THIS DATA. Consistent with political-socialization research, this pattern is generally read as reflecting MORE of a generational/cohort effect than a pure lifecycle effect: each age cohort\'s political attitudes were substantially shaped by the historical period in which it came of age, and those attitudes tend to persist across that cohort\'s lifetime rather than converging as its members simply grow older.',
        'STATE WHY THE DISTINCTION MATTERS FOR PREDICTION. If the pattern were a pure lifecycle effect, today\'s 18-to-29-year-olds would be expected to become as conservative as today\'s 65+ group once they reach that age. If it is instead mostly a generational effect, today\'s younger cohort is more likely to CARRY its current relatively liberal-leaning profile forward as it ages, and the electorate\'s aggregate ideology would shift only gradually, as older cohorts are replaced by younger ones — a very different prediction about the next twenty years.',
      ],
      answer:
        'Conservative self-identification rises steadily across all four age groups (23% -> 33% -> 43% -> 45%), with the largest jump between the 30-49 and 50-64 groups. Liberal self-identification is NOT a perfect mirror image: it falls across the first three groups (34% -> 25% -> 19%) but ticks up slightly for the oldest group (21% for 65+, versus 19% for 50-64). Political-socialization research generally attributes this kind of age pattern more to a GENERATIONAL (cohort) effect — each age group\'s outlook shaped by its own formative political era and persisting over its lifetime — than to a pure LIFECYCLE (aging) effect, where individuals would be expected to personally drift rightward simply by growing older. That distinction matters for prediction: if it is mainly generational, today\'s younger, less-conservative cohort is more likely to retain a similar profile as it ages, so the electorate\'s aggregate ideology would shift gradually through generational replacement rather than through individuals simply becoming more conservative with age.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        "Concept Application practice. A high school senior grew up in a household where her parents regularly discussed the importance of \"working hard and not depending on government handouts\" at the dinner table. In her AP Gov class, she is assigned a project researching how a market economy allocates goods with minimal government interference. Over spring break, she travels abroad for the first time and is struck by how differently another country handles its healthcare system compared to the United States, and starts asking new questions about U.S. policy she had never previously considered. (a) Identify the agent of political socialization most directly illustrated by the dinner-table conversations, and explain how it shaped her views. (b) Identify the core American value most directly illustrated by her class project on market allocation, and briefly describe that value. (c) Explain how her trip abroad illustrates globalization's influence on public opinion, distinguishing it from the agents named in part (a).",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies FAMILY as the agent of socialization illustrated by the dinner-table conversations, and explains that family is typically the earliest and strongest agent, transmitting attitudes (here, toward self-reliance) through repeated everyday exposure before a child independently evaluates policy. No credit for identifying a different agent or giving no explanation of family\'s typical role.',
            modelResponse:
              "The dinner-table conversations illustrate FAMILY as an agent of political socialization. Family is typically the earliest and strongest influence on political attitudes, transmitting values like self-reliance and skepticism of government assistance through repeated, everyday conversation well before a child is old enough to independently evaluate policy alternatives.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies FREE ENTERPRISE as the core value illustrated by the class project on market allocation with minimal government interference, and briefly describes the value accurately. No credit for identifying a different core value or an inaccurate description.',
            modelResponse:
              'The class project illustrates FREE ENTERPRISE, the core American value holding that a market economy with limited government interference is the default arrangement for allocating goods and services in the United States.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that the trip abroad illustrates globalization\'s influence by exposing her to a comparative international reference point (another country\'s healthcare system) that generates new political questions she had not previously considered, and distinguishes this from family/school/peers/media/religion as a distinct, international source of attitude change. No credit for a response that treats the trip as simply another instance of one of the five listed agents without noting the international/comparative element.',
            modelResponse:
              "Her trip abroad illustrates globalization's influence on public opinion: direct exposure to another country's different approach to healthcare gives her a comparative international reference point that raises new questions about U.S. policy she had not previously considered. This is distinct from family, school, peers, media, or religion — it is international exposure itself, not a domestic agent of socialization, that is prompting her to reconsider her views.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-moderate-is-apolitical',
      kind: 'misconception_check',
      question:
        'True or false: identifying as "moderate" on a liberal-conservative ideology scale means a person has no real political opinions and is not politically engaged.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating "moderate" as a residual, empty category — the absence of a real political opinion — rather than as one of three substantive, self-selected positions on the same ideology scale as "liberal" and "conservative."',
          correctsTo:
            'FALSE. "Moderate" is a substantive self-identification on the SAME liberal-to-conservative scale as "liberal" and "conservative" — in the Gallup 2021 data covered in this lesson, moderates make up 32-41% of respondents depending on age group, often the SINGLE LARGEST category in a given age group. Choosing "moderate" typically reflects a real political position — for example, holding a mix of positions that lean liberal on some issues and conservative on others, or genuinely occupying the political center on most issues — not an absence of opinion or disengagement. Political engagement (following politics, voting, holding views on specific issues) and ideological self-placement (where someone locates themselves on the liberal-conservative scale) are two separate things: a moderate can be just as politically engaged and informed as a strong liberal or strong conservative. Don\'t treat the middle category on an ideology scale as equivalent to "no answer."',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The five agents of political socialization are family (typically earliest/strongest), school, peers, media, and religion — each shapes political attitudes through repeated exposure, not a single decision.',
        'A generational (cohort) effect means an age group\'s outlook was shaped by its own formative political era and persists over its lifetime; a lifecycle (aging) effect means individuals shift views simply by personally growing older. In Gallup\'s 2021 age-ideology data, political-socialization research favors the generational explanation.',
        'In Gallup\'s 2021 data, conservative identification rises steadily with age (23% -> 33% -> 43% -> 45%), but liberal identification is NOT a mirror image — it falls through age 64 before ticking up slightly for 65+ (19% -> 21%).',
        'The five core American values — individualism, equality of opportunity, free enterprise, rule of law, limited government — are broadly shared across the ideological spectrum, even though liberals, conservatives, and libertarians weigh and apply them differently.',
        'Globalization exposes Americans to comparative international reference points (e.g. other countries\' healthcare or economic systems), raising new political questions and fault lines distinct from the five traditional agents of socialization.',
        '"Moderate" is a substantive ideological self-identification, not an absence of political opinion or disengagement — moderates are often the largest single category in ideology surveys.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.1-4.4',
    cedTitle: 'Political Socialization & Public Opinion',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-ideology-age-table.v1',
        chapter: '2021',
        note: 'Described data table (Gallup, "U.S. Political Ideology Steady; Conservatives, Moderates Tie," 2021 calendar-year polling) — ideological self-identification by age group; anchor for the concept and worked example.',
      },
    ],
  },
};
