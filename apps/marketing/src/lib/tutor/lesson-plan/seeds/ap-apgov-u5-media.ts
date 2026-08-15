/**
 * AP US Government & Politics — CED Unit 5.12-5.13: The Media as a Linkage
 * Institution.
 *
 * Unit-5 Vertical Slice content plan (follows the Unit-1 calibration
 * template — see ap-apgov-u1-federalism.ts for the shared Passage/rubric
 * infra this plan reuses). Fifth and final stop in Unit 5's
 * linkage-institutions walk (and the final plan of the AP US Government
 * course's Vertical Slice), following directly from
 * ap-apgov-u5-elections.ts: having covered how elections and money shape
 * campaigns, this closing plan covers the institution that shapes how
 * citizens actually SEE those campaigns.
 *
 * Covers agenda setting; horse-race coverage; media consolidation;
 * partisan and social media alongside filter bubbles; and how these media
 * changes affect campaigns and voter behavior.
 *
 * NO WIRED DOCUMENT: like ap-apgov-u2-bureaucracy.ts, ap-apgov-u5-parties.ts,
 * and ap-apgov-u5-interest-groups.ts, this lesson uses a
 * hypothetical-but-realistic scenario (contrasting two outlets' coverage of
 * the same campaign) rather than a seeded passage — no Task-16 passage
 * models media-coverage content, so nothing is quoted or attributed to a
 * document here.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U5_MEDIA: LessonPlan = {
  id: 'evelyn.ap.apgov.media-linkage.v1',
  title: 'U5.12-5.13 The Media as a Linkage Institution',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.media-linkage',
      description:
        'Explain the media\'s agenda-setting function and horse-race coverage; media consolidation; partisan and social media alongside filter bubbles; and how these dynamics affect political campaigns and voter behavior.',
      standard: 'AP-APGOV-5.12/5.13',
    },
  ],
  prerequisites: ['apgov.elections-campaign-finance'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the media\'s power as less about dictating specific opinions and more about controlling which issues even reach public attention in the first place — and to notice how differently two outlets covering the identical event can shape what a viewer walks away thinking mattered.',
      script:
        "We've covered parties, interest groups, elections, and campaign money. Last stop in this unit: the media — the linkage institution that shapes what citizens actually see and hear about all of the above. Here's a common misunderstanding worth clearing up immediately: the media's biggest power isn't telling people exactly WHAT to think about an issue. It's telling people WHICH issues are worth thinking about at all. Two outlets can cover the exact same debate and one leads with a candidate's policy proposal while the other leads with who \"won\" the exchange and how the polls moved afterward — same event, two very different signals about what matters. Today we look at how the media sets the agenda, why so much coverage reads like a horse race, and how a shrinking number of owners and a personalized social-media feed are changing what campaigns and voters actually experience.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-media-agenda-horserace-consolidation-filterbubbles',
      kind: 'concept',
      goal: 'Explain agenda setting, horse-race coverage, media consolidation, partisan/social media and filter bubbles, and how these dynamics affect campaigns and voter behavior.',
      keyIdeas: [
        'AGENDA SETTING: the media\'s power to influence WHICH issues the public perceives as important, simply by choosing what to cover and how prominently. Agenda setting is specifically about shaping what people think ABOUT, not dictating the specific opinion they should hold on that issue once it\'s on their radar — those are two distinct effects, and this lesson\'s content is the first one.',
        'HORSE-RACE COVERAGE: political coverage that emphasizes who is winning, who is ahead in the polls, and campaign strategy and tactics, rather than substantive policy positions. Critics argue it crowds out substantive coverage voters could use to evaluate candidates on the merits, even though it is often easier and cheaper to produce and can attract more viewers than policy-heavy coverage.',
        'MEDIA CONSOLIDATION: the trend of fewer, larger media corporations owning a growing share of news outlets. Consolidation raises concerns that fewer independent owners means less diversity in editorial perspective and local coverage, even as it can also produce efficiencies of scale in a struggling news industry.',
        'PARTISAN AND SOCIAL MEDIA: many outlets and platforms today are more openly aligned with a partisan viewpoint than in earlier eras of national broadcast news, and much of the public now gets news through social-media platforms rather than traditional outlets at all.',
        'FILTER BUBBLES: the effect (driven both by deliberately choosing partisan-aligned outlets and by platforms\' content-recommendation algorithms) of being repeatedly shown content that reinforces a person\'s existing views, reducing everyday exposure to opposing perspectives compared to earlier, more centralized media environments.',
        'HOW MEDIA CHANGES AFFECT CAMPAIGNS: candidates today can communicate with voters directly through social media, bypassing traditional editorial gatekeepers who once decided what coverage a campaign received — this lowers the cost and speed of reaching supporters directly, but it also removes a layer of editorial fact-checking, making it easier for misinformation to spread quickly through the same channels.',
        'HOW MEDIA CHANGES AFFECT VOTER BEHAVIOR: as citizens increasingly select personalized, partisan, or algorithmically curated news sources, they encounter a narrower range of framing and issue emphasis than in a shared, broad-based media environment — reinforcing existing views and shaping which issues, and which side of them, feel most urgent to any given voter.',
      ],
      vocabulary: [
        {
          term: 'agenda setting',
          definition: 'the media\'s power to influence which issues the public perceives as important, distinct from dictating specific opinions on those issues.',
        },
        {
          term: 'horse-race coverage',
          definition: 'political coverage emphasizing who is winning/polling and campaign strategy over substantive policy positions.',
        },
        {
          term: 'media consolidation',
          definition: 'the trend of fewer, larger corporations owning a growing share of news outlets.',
        },
        {
          term: 'filter bubble',
          definition: 'the effect of being repeatedly shown content that reinforces existing views, driven by outlet choice and recommendation algorithms alike, reducing exposure to opposing perspectives.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-outlets-same-debate',
      kind: 'worked_example',
      problem:
        'Two outlets cover the identical televised debate between two candidates. Outlet A\'s lead story is headlined "Candidate\'s Healthcare Plan Would Restructure Insurance Markets" and spends most of its coverage explaining the proposal\'s mechanics. Outlet B\'s lead story is headlined "Candidate Stumbles in Exchange, Overnight Polls Show Rival Gaining" and spends most of its coverage on who appeared to "win" the debate and how it might shift the race. (a) Which outlet\'s coverage is a clearer example of horse-race coverage, and why? (b) Explain how, even without directly telling viewers what opinion to hold, each outlet\'s choice of lead story is an example of agenda setting. (c) Explain one way a filter bubble could cause a given voter to only ever see ONE of these two outlets\' framings of the same debate.',
      steps: [
        'IDENTIFY THE HORSE-RACE COVERAGE. Outlet B is the clearer example: its lead frames the story around who "won," how polls moved, and campaign strategy — the classic markers of horse-race coverage — rather than the substance of any policy proposal.',
        'CONTRAST WITH OUTLET A. Outlet A\'s lead instead centers substantive policy content (how the healthcare proposal would actually work), which is closer to the policy-substance coverage horse-race coverage is often criticized for crowding out.',
        'CONNECT LEAD-STORY CHOICE TO AGENDA SETTING. Neither outlet is telling viewers exactly what to conclude about the healthcare plan or who should win. But by choosing to lead with policy substance (Outlet A) versus strategic "who\'s winning" framing (Outlet B), each outlet is shaping which ASPECT of the same event its viewers will treat as most important to think about — that is agenda setting operating through story selection and emphasis, independent of any specific opinion pushed.',
        'APPLY THE FILTER-BUBBLE CONCEPT. A voter who exclusively follows Outlet A (by personal choice, or because a social-media feed\'s recommendation algorithm keeps surfacing that outlet\'s content) would only ever encounter the policy-substance framing of this debate, never Outlet B\'s horse-race framing, and vice versa for an Outlet-B-only viewer.',
        'THE TAKEAWAY. Two audiences watching coverage of the SAME event can come away with entirely different senses of what mattered about it — one thinking about healthcare-market mechanics, the other thinking about who is "winning" — without either outlet ever directly telling its audience what conclusion to reach. That gap is a direct, concrete illustration of agenda setting and filter bubbles working together.',
      ],
      answer:
        "Outlet B's coverage is horse-race coverage, since it centers on who \"won\" and how polls shifted rather than policy substance; Outlet A's coverage centers policy substance instead. Even though neither outlet tells viewers exactly what opinion to hold, each is exercising agenda setting through its choice of lead story — shaping which aspect of the identical debate (policy mechanics vs. who's ahead) its audience treats as most important. A viewer locked into only one outlet, whether by personal choice or an algorithm's recommendations, experiences a filter bubble: they would only ever see one of these two framings of the same event, never the other.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. A candidate\'s campaign posts a short video directly to a social-media platform, bypassing traditional news outlets entirely. The video spreads quickly and is later found to contain a significantly misleading claim about the candidate\'s opponent. Meanwhile, a large media conglomerate that recently acquired several previously independent local news stations instructs all of them to run the same national political segment instead of separate local reporting. (a) Explain one advantage and one risk of the campaign bypassing traditional outlets to post directly to social media. (b) Explain what media consolidation is and how it applies to the conglomerate\'s decision described above. (c) Explain how a viewer who only follows outlets and social accounts aligned with one side of the race might be affected by a filter bubble in this scenario.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies a real advantage (direct, fast, low-cost communication with supporters, bypassing editorial gatekeepers) and a real risk (loss of editorial fact-checking, faster spread of misinformation) of bypassing traditional media. No credit for a response citing only one side or an inaccurate advantage/risk.',
            modelResponse:
              "One advantage is that posting directly to social media lets the campaign reach supporters quickly and cheaply without needing traditional outlets to decide whether or how to cover it. One risk is that bypassing traditional editorial gatekeepers also removes a layer of fact-checking, making it easier for a misleading claim — like the one described — to spread quickly before it can be corrected.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): defines media consolidation as fewer, larger corporations owning more outlets, and explains that the conglomerate replacing independent local coverage with a single national segment across all its stations is a direct example. No credit for a response that misdefines consolidation or fails to apply it to the scenario.',
            modelResponse:
              "Media consolidation is the trend of fewer, larger corporations owning a growing share of news outlets. The conglomerate's decision to have all of its recently acquired local stations run the same national segment, instead of separate local reporting, is a direct example: one owner is now shaping content across many outlets that used to report independently, reducing the diversity of local coverage available to viewers in each station's area.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that a filter bubble would repeatedly expose this voter to content reinforcing their existing view of the race (potentially including the misleading claim, if aligned with their side) without exposure to the opposing side\'s framing or corrections. No credit for a response that does not connect the filter-bubble effect to reduced exposure to opposing perspectives.',
            modelResponse:
              "A voter who only follows outlets and accounts aligned with one side of the race is in a filter bubble: they would be repeatedly shown content reinforcing that side's framing of events — potentially including the misleading video, if it aligns with their side — without much exposure to the opposing side's coverage or any corrections that circulate mainly among the other side's audience. This narrows what the voter sees relative to a more balanced media diet.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-agenda-setting-tells-what-to-think',
      kind: 'misconception_check',
      question:
        'True or false: agenda-setting theory means the media tells people WHAT OPINION to hold on political issues.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Conflating the media\'s power to make an issue seem important (agenda setting) with the separate question of persuading someone toward a specific opinion or side on that issue.',
          correctsTo:
            'FALSE. Agenda-setting theory holds that the media\'s power is to influence WHICH ISSUES the public perceives as important — what to think ABOUT — not to dictate the specific opinion or side a person should take on those issues once they\'re on the public\'s radar. Two outlets can raise the exact same issue\'s importance (agenda setting) while framing it in very different ways, or leave the ultimate opinion entirely up to the individual viewer. Don\'t conflate "the media decides what feels important right now" with "the media decides what you should conclude about it."',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Agenda setting: the media\'s power to shape which issues the public sees as important — WHAT to think about — not to dictate specific opinions on those issues.',
        'Horse-race coverage emphasizes who is winning/polling and campaign strategy over policy substance, which critics say crowds out substantive coverage.',
        'Media consolidation: fewer, larger corporations owning more outlets, raising concerns about reduced diversity of editorial perspective and local coverage.',
        'Partisan/social media and filter bubbles: outlet choice and recommendation algorithms alike can repeatedly reinforce a person\'s existing views, narrowing exposure to opposing framings.',
        'Media changes reshape campaigns (direct-to-voter social media, bypassing editorial gatekeepers, faster misinformation spread) and voter behavior (narrower, more personalized information diets).',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.12-5.13',
    cedTitle: 'The Media as a Linkage Institution',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
    ],
  },
};
