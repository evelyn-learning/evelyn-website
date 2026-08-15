/**
 * AP US Government & Politics — CED Unit 5.6-5.7: Interest Groups.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.interest-groups.v1`. Covers pluralist theory versus
 * the elite critique of interest-group politics; lobbying strategies
 * (information, drafting model legislation, testimony); the free-rider
 * problem and selective incentives; iron triangles versus issue networks
 * (linked back to apgov.bureaucracy-accountability, which taught iron
 * triangles from the agency side); and litigation plus amicus curiae
 * briefs as an interest-group strategy.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_INTEREST_GROUPS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.interest-groups.v1',
  course: 'AP US Government & Politics',
  cedUnit: 5,
  cedTopic: '5.6-5.7',
  cedTitle: 'Interest Groups',
  planId: 'evelyn.ap.apgov.interest-groups.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.interest-groups.v1' }],
  theory: [
    {
      loId: 'apgov.interest-groups',
      kind: 'concept',
      title: 'pluralism vs. the elite critique',
      content:
        'PLURALISM holds that political power is spread across many competing interest groups, none dominant, so the give-and-take among them produces a rough, ongoing balance of representation across society\'s many interests. The ELITE CRITIQUE argues that pluralism overstates how evenly influence is distributed: resources (money, organization, access) are concentrated among a relatively small set of well-funded, well-connected groups, who have disproportionate influence over policy outcomes compared to less-organized or less-resourced interests. These are competing views of the SAME system, not a settled debate.',
    },
    {
      loId: 'apgov.interest-groups',
      kind: 'concept',
      title: 'lobbying strategy — information and drafting legislation',
      content:
        'INFORMATION: interest groups supply lawmakers and their staff with specialized information and expertise on complex policy areas — legislators cannot be experts on every issue, and groups compete to be a trusted information source. DRAFTING LEGISLATION: groups often draft specific model bill language for sympathetic lawmakers to introduce, translating a group\'s policy goals directly into proposed statutory text.',
    },
    {
      loId: 'apgov.interest-groups',
      kind: 'concept',
      title: 'lobbying strategy — testimony',
      content:
        'Interest-group representatives testify at congressional committee hearings, putting their expertise and position directly into the public legislative record and in front of the committee members who will vote on a bill.',
    },
    {
      loId: 'apgov.interest-groups',
      kind: 'definition',
      title: 'free-rider problem',
      content:
        'Because many of the benefits an interest group wins (a tax rule, a safety regulation, a subsidy) apply to an entire industry or the public generally — not just to paying members — a rational, self-interested individual or firm can enjoy those benefits without ever joining or paying dues. If everyone reasons this way, the group struggles to fund itself even when its cause has broad support.',
    },
    {
      loId: 'apgov.interest-groups',
      kind: 'definition',
      title: 'selective incentives',
      content:
        'The standard solution to the free-rider problem: benefits made available ONLY to paying members (discounts, insurance programs, publications, networking opportunities, access to events) that give individuals a material reason to join beyond the group\'s general policy wins, which non-members get for free either way.',
    },
    {
      loId: 'apgov.interest-groups',
      kind: 'concept',
      title: 'iron triangles',
      content:
        'A mutually reinforcing, long-running three-way relationship among a congressional committee (or subcommittee), a bureaucratic agency, and an interest group, each benefiting the others: the committee gets policy expertise and political support, the agency gets funding and favorable oversight, and the group gets policy outcomes it wants. This is the SAME iron-triangle relationship covered in apgov.bureaucracy-accountability, viewed here from the interest group\'s side of the triangle.',
    },
    {
      loId: 'apgov.interest-groups',
      kind: 'concept',
      title: 'issue networks',
      content:
        'A looser, more fluid alternative to the tight iron triangle: a broader, shifting web of policy actors (multiple agencies, committees, interest groups, think tanks, academics, media) engaging on a policy area, with no single stable three-way alliance dominating decision-making the way a classic iron triangle does. Scale and stability — not just topic — are what distinguish an issue network from an iron triangle.',
    },
    {
      loId: 'apgov.interest-groups',
      kind: 'definition',
      title: 'amicus curiae brief',
      content:
        '"Friend of the court" brief filed by a party not directly involved in a case, presenting arguments and information intended to influence how the court rules. Part of the LITIGATION strategy interest groups use when legislative or executive channels are unfavorable — groups can also file lawsuits directly.',
    },
    {
      loId: 'apgov.interest-groups',
      kind: 'concept',
      title: 'why litigation fits a diluted-influence situation',
      content:
        'When no single alliance controls an outcome (an issue-network situation with many competing actors), a group\'s lobbying influence over any one committee or agency is diluted. Litigation, or an amicus brief in a case the group is not directly a party to, offers an alternate channel that does not depend on winning a fragmented, multi-actor legislative or bureaucratic fight — a single favorable court ruling can settle the issue regardless of how many other actors are competing for influence elsewhere.',
    },
    {
      loId: 'apgov.interest-groups',
      kind: 'trap',
      title: 'a shared benefit does not motivate voluntary joining',
      content:
        'A common error: assuming that because a policy win benefits everyone affected, most affected people will voluntarily join and pay dues to support the group. This has it backwards — it describes the free-rider problem exactly. A rational individual has little material incentive to join when they can enjoy the same shared benefit for free, which is precisely why real interest groups rely on selective incentives to give people a reason to join at all.',
    },
  ],
  methods: [
    {
      title: 'Classify a policy-influence relationship as an iron triangle or an issue network',
      when_to_use:
        'Use this whenever a prompt describes a group of actors (agencies, committees, interest groups) working on a policy area and asks whether it is an iron triangle or an issue network.',
      steps: [
        'COUNT THE STABLE PARTICIPANTS. Exactly one committee, one agency, one dominant interest group, working together stably over time -> iron triangle.',
        'CHECK FOR SCALE AND FLUIDITY. Multiple agencies, multiple overlapping committees, many competing groups, researchers, no single dominant alliance -> issue network.',
        'IF UNSURE, ASK WHETHER ONE ALLIANCE CONTROLS THE OUTCOME. A stable, controlling three-way alliance = iron triangle; a large, shifting set of actors with no single alliance in control = issue network.',
      ],
      example: {
        problem: 'A committee, an agency, and one dominant farmers\' association have worked together for decades on subsidy policy. Iron triangle or issue network?',
        solution: 'Iron triangle — exactly one committee, one agency, one dominant interest group in a stable, mutually reinforcing relationship.',
      },
      relatedLoIds: ['apgov.interest-groups'],
    },
    {
      title: 'Explain why an interest group offers selective incentives',
      when_to_use:
        'Use this whenever a prompt describes a group offering member-only benefits alongside a broadly shared policy win, and asks why.',
      steps: [
        'IDENTIFY THE SHARED BENEFIT that goes to everyone regardless of membership (this is the free-rider risk).',
        'IDENTIFY THE MEMBER-ONLY BENEFIT (discounts, insurance, publications, consulting) that non-members cannot access.',
        'CONNECT THE TWO: the member-only benefit exists specifically to counteract the free-rider problem created by the shared benefit.',
      ],
      relatedLoIds: ['apgov.interest-groups'],
    },
  ],
  pointers: [
    { content: 'Pluralism = influence spread across many competing groups; elite critique = influence concentrated among a well-resourced few — two competing views of the same system.', kind: 'tip' },
    { content: 'Free-rider problem: shared benefits let non-members enjoy a group\'s win for free. Selective incentives (member-only benefits) are the standard countermeasure — always pair the two concepts.', kind: 'tip' },
    { content: 'Iron triangle = exactly one committee + one agency + one dominant group, stable over time. Issue network = many actors, no single controlling alliance. Scale/stability is the test, not topic.', kind: 'trap' },
    { content: 'An amicus curiae brief is filed by a party NOT directly involved in the case — don\'t confuse it with a party bringing its own lawsuit.', kind: 'tip' },
    { content: '"Shared benefit motivates joining" is backwards — it describes the free-rider problem, which is exactly why selective incentives exist.', kind: 'trap' },
    { content: 'Litigation/amicus strategy is especially useful when lobbying influence is diluted across many competing actors (an issue-network situation).', kind: 'tip' },
  ],
};
