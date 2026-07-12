/**
 * AP US Government & Politics — CED Unit 5.12-5.13: The Media as a
 * Linkage Institution.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.media-linkage.v1`. Covers agenda setting; horse-race
 * coverage; media consolidation; partisan and social media alongside
 * filter bubbles; and how these media dynamics affect campaigns and
 * voter behavior. Final baseline in the Unit-5 linkage-institutions walk.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_MEDIA_LINKAGE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.media-linkage.v1',
  course: 'AP US Government & Politics',
  cedUnit: 5,
  cedTopic: '5.12-5.13',
  cedTitle: 'The Media as a Linkage Institution',
  planId: 'evelyn.ap.apgov.media-linkage.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.media-linkage.v1' }],
  theory: [
    {
      loId: 'apgov.media-linkage',
      kind: 'definition',
      title: 'agenda setting',
      content:
        'The media\'s power to influence WHICH issues the public perceives as important, simply by choosing what to cover and how prominently. Agenda setting is specifically about shaping what people think ABOUT, not dictating the specific opinion they should hold on that issue once it\'s on their radar — those are two distinct effects.',
    },
    {
      loId: 'apgov.media-linkage',
      kind: 'definition',
      title: 'horse-race coverage',
      content:
        'Political coverage that emphasizes who is winning, who is ahead in the polls, and campaign strategy and tactics, rather than substantive policy positions. Critics argue it crowds out substantive coverage voters could use to evaluate candidates on the merits, even though it is often easier and cheaper to produce and can attract more viewers than policy-heavy coverage.',
    },
    {
      loId: 'apgov.media-linkage',
      kind: 'concept',
      title: 'media consolidation',
      content:
        'The trend of fewer, larger media corporations owning a growing share of news outlets. Consolidation raises concerns that fewer independent owners means less diversity in editorial perspective and local coverage, even as it can also produce efficiencies of scale in a struggling news industry.',
    },
    {
      loId: 'apgov.media-linkage',
      kind: 'concept',
      title: 'partisan and social media',
      content:
        'Many outlets and platforms today are more openly aligned with a partisan viewpoint than in earlier eras of national broadcast news, and much of the public now gets news through social-media platforms rather than traditional outlets at all.',
    },
    {
      loId: 'apgov.media-linkage',
      kind: 'definition',
      title: 'filter bubble',
      content:
        "The effect (driven both by deliberately choosing partisan-aligned outlets and by platforms' content-recommendation algorithms) of being repeatedly shown content that reinforces a person's existing views, reducing everyday exposure to opposing perspectives compared to earlier, more centralized media environments.",
    },
    {
      loId: 'apgov.media-linkage',
      kind: 'concept',
      title: 'how media changes affect campaigns',
      content:
        'Candidates today can communicate with voters directly through social media, bypassing traditional editorial gatekeepers who once decided what coverage a campaign received — this lowers the cost and speed of reaching supporters directly, but it also removes a layer of editorial fact-checking, making it easier for misinformation to spread quickly through the same channels.',
    },
    {
      loId: 'apgov.media-linkage',
      kind: 'concept',
      title: 'how media changes affect voter behavior',
      content:
        'As citizens increasingly select personalized, partisan, or algorithmically curated news sources, they encounter a narrower range of framing and issue emphasis than in a shared, broad-based media environment — reinforcing existing views and shaping which issues, and which side of them, feel most urgent to any given voter.',
    },
    {
      loId: 'apgov.media-linkage',
      kind: 'concept',
      title: 'same event, two framings (agenda setting through story selection)',
      content:
        'Two outlets can cover the identical event and choose to lead with entirely different aspects of it — one with substantive policy content, the other with who "won" and how polls moved. Neither outlet is telling viewers exactly what to conclude, but each is shaping which aspect of the same event its audience treats as most important to think about. That is agenda setting operating through story selection and emphasis, independent of any specific opinion pushed.',
    },
    {
      loId: 'apgov.media-linkage',
      kind: 'trap',
      title: 'agenda setting does not mean dictating opinions',
      content:
        'A common error: assuming agenda-setting theory means the media tells people WHAT OPINION to hold on political issues. It does not. Agenda setting is the power to influence which issues the public perceives as important — what to think ABOUT — not to dictate the specific opinion or side a person should take on those issues once they\'re on the public\'s radar. Two outlets can raise the same issue\'s importance (agenda setting) while framing it very differently, or leave the ultimate opinion entirely up to the viewer.',
    },
  ],
  methods: [
    {
      title: 'Classify coverage as horse-race vs. substantive, and identify the agenda-setting effect',
      when_to_use:
        'Use this whenever a prompt describes how an outlet covered a campaign event and asks you to classify the coverage or explain its agenda-setting effect.',
      steps: [
        'CHECK THE LEAD FRAME. Does it center on who is winning/polling/strategy (horse-race) or on policy substance/proposals (substantive coverage)?',
        'IF THE COVERAGE FOCUSES ON WHO "WON" OR HOW POLLS SHIFTED -> horse-race coverage.',
        'IDENTIFY THE AGENDA-SETTING EFFECT SEPARATELY from any opinion the outlet may or may not be pushing: by choosing what to lead with, the outlet shapes which aspect of the event its audience treats as important — this happens even if the outlet never states an opinion.',
        'DO NOT conflate "this outlet chose to emphasize X" (agenda setting) with "this outlet told viewers to think Y" (opinion persuasion) — they are different claims.',
      ],
      example: {
        problem: 'An outlet\'s lead story on a debate is headlined "Candidate Stumbles, Rival Gains in Overnight Polls." Classify the coverage.',
        solution: 'Horse-race coverage — the lead centers on who "won" and how polls moved, not policy substance.',
      },
      relatedLoIds: ['apgov.media-linkage'],
    },
  ],
  pointers: [
    { content: 'Agenda setting = shaping WHAT people think about (issue salience), never confuse it with shaping WHAT OPINION people hold on an issue.', kind: 'trap' },
    { content: 'Horse-race coverage emphasizes who\'s winning/polling and strategy over policy substance — that is the defining feature to name in an FRQ.', kind: 'tip' },
    { content: 'Media consolidation = fewer, larger owners across more outlets — a station running a corporate-mandated national segment instead of local reporting is a textbook example.', kind: 'tip' },
    { content: 'Filter bubbles arise from BOTH deliberate outlet choice AND algorithmic recommendation — cite both drivers when explaining the effect.', kind: 'tip' },
    { content: 'Bypassing traditional media via direct-to-social-media posts trades editorial fact-checking for speed and reach — always name both the advantage AND the risk together.', kind: 'tip' },
  ],
};
