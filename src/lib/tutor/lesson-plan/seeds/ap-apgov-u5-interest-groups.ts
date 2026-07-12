/**
 * AP US Government & Politics — CED Unit 5.6-5.7: Interest Groups.
 *
 * Unit-5 Vertical Slice content plan (follows the Unit-1 calibration
 * template — see ap-apgov-u1-federalism.ts for the shared Passage/rubric
 * infra this plan reuses). Third stop in Unit 5's linkage-institutions
 * walk, following directly from ap-apgov-u5-parties.ts.
 *
 * Covers pluralist theory versus the elite-critique of interest-group
 * politics; lobbying strategies (providing information, drafting model
 * legislation, testimony); the free-rider problem and selective
 * incentives; iron triangles versus issue networks (explicitly linked back
 * to ap-apgov-u2-bureaucracy.ts, which taught iron triangles and issue
 * networks from the bureaucratic-agency side of the same triangle); and
 * litigation plus amicus curiae briefs as an interest-group strategy.
 *
 * NO WIRED DOCUMENT: like ap-apgov-u2-bureaucracy.ts and
 * ap-apgov-u5-parties.ts, this lesson uses a hypothetical-but-realistic
 * scenario (a manufacturers' association lobbying on a proposed
 * regulation) rather than a seeded passage — no Task-16 passage models
 * interest-group content, so nothing is quoted or attributed to a document
 * here.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U5_INTEREST_GROUPS: LessonPlan = {
  id: 'evelyn.ap.apgov.interest-groups.v1',
  title: 'U5.6-5.7 Interest Groups',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.interest-groups',
      description:
        'Explain the pluralist and elite-critique views of interest-group politics; lobbying strategies (information provision, drafting legislation, testimony); the free-rider problem and selective incentives; iron triangles versus issue networks; and litigation and amicus curiae briefs as an interest-group strategy.',
      standard: 'AP-APGOV-5.6/5.7',
    },
  ],
  prerequisites: ['apgov.political-parties', 'apgov.bureaucracy-accountability'],
  followUps: ['apgov.elections-campaign-finance'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to notice the puzzle at the heart of interest-group politics: a group\'s lobbying win benefits everyone affected, whether or not they joined or paid dues — so why does anyone bother joining at all? — and to reconnect it to the bureaucracy unit\'s iron-triangle material from the OTHER side of the same relationship.',
      script:
        "We've covered parties. Now the other classic linkage institution built around organized interests rather than elections: interest groups. Here's the puzzle to open with. If an interest group successfully lobbies for, say, a tax break for an entire industry, every firm in that industry benefits — including firms that never joined the group or paid a cent in dues. So why would any individual firm bother joining and paying? That's not a hypothetical problem; it's a real structural challenge every interest group has to solve. And here's a callback: remember the bureaucracy unit's iron triangle — the tight relationship between a congressional committee, an agency, and an interest group? Today we're looking at that same triangle from the interest group's side, plus how groups lobby, and what they do when lobbying isn't working.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-interest-groups-lobbying-freerider-triangles',
      kind: 'concept',
      goal: 'Explain pluralism vs. the elite critique, lobbying strategies, the free-rider problem and selective incentives, iron triangles vs. issue networks, and litigation/amicus strategy.',
      keyIdeas: [
        'PLURALISM: a theory of interest-group politics holding that political power is spread across many competing groups, none dominant, so that the give-and-take among them produces a rough, ongoing balance of representation across society\'s many interests.',
        'THE ELITE CRITIQUE: a competing view arguing that pluralism overstates how evenly influence is actually distributed — resources (money, organization, access) are concentrated among a relatively small set of well-funded, well-connected groups and individuals, who as a result have disproportionate influence over policy outcomes compared to less-organized or less-resourced interests.',
        'LOBBYING — INFORMATION: one of interest groups\' core strategies is supplying lawmakers and their staff with specialized information and expertise on complex policy areas — legislators cannot be experts on every issue before them, and groups compete to be a trusted information source.',
        'LOBBYING — DRAFTING LEGISLATION: interest groups often draft specific model bill language for sympathetic lawmakers to introduce, translating a group\'s policy goals directly into proposed statutory text.',
        'LOBBYING — TESTIMONY: interest-group representatives testify at congressional committee hearings, putting their expertise and position directly into the public legislative record and in front of the committee members who will vote on a bill.',
        'THE FREE-RIDER PROBLEM: because many of the benefits an interest group wins (a tax rule, a safety regulation, a subsidy) apply to an entire industry or the public generally — not just to paying members — a rational, self-interested individual or firm can enjoy those benefits without ever joining or paying dues. If everyone reasons this way, the group struggles to fund itself even when its cause has broad support.',
        'SELECTIVE INCENTIVES: the standard solution to the free-rider problem — benefits made available ONLY to paying members (discounts, insurance programs, publications, networking opportunities, access to events) that give individuals a material reason to join beyond the group\'s general policy wins, which non-members get for free either way.',
        'IRON TRIANGLES: a mutually reinforcing, long-running three-way relationship among a congressional committee (or subcommittee), a bureaucratic agency, and an interest group, each benefiting the others — the committee gets policy expertise and political support, the agency gets funding and favorable oversight, and the group gets policy outcomes it wants. This is the same iron-triangle relationship covered in the bureaucracy unit (apgov.bureaucracy-accountability), viewed here from the interest group\'s side of the triangle.',
        'ISSUE NETWORKS: a looser, more fluid alternative to the tight iron triangle — a broader, shifting web of policy actors (multiple agencies, committees, interest groups, think tanks, academics, media) engaging on a policy area, with no single stable three-way alliance dominating decision-making the way a classic iron triangle does.',
        'LITIGATION AND AMICUS CURIAE BRIEFS: when legislative or executive channels are unfavorable, interest groups can pursue their goals through the courts — filing lawsuits directly, or filing AMICUS CURIAE ("friend of the court") briefs in cases they are not a direct party to, presenting arguments and information intended to influence how the court rules.',
      ],
      vocabulary: [
        {
          term: 'pluralism',
          definition: 'the theory that political power is spread across many competing interest groups, producing a rough overall balance of representation.',
        },
        {
          term: 'elite critique',
          definition: 'the view that interest-group influence is concentrated among a relatively small set of well-resourced groups, undermining pluralism\'s claim of balance.',
        },
        {
          term: 'free-rider problem',
          definition: "the challenge that individuals can enjoy an interest group's broadly shared policy wins without joining or paying dues, undermining the group's ability to fund itself.",
        },
        {
          term: 'selective incentives',
          definition: 'member-only material benefits (discounts, insurance, publications) an interest group offers to counteract the free-rider problem.',
        },
        {
          term: 'iron triangle',
          definition: 'a mutually reinforcing three-way relationship among a congressional committee, a bureaucratic agency, and an interest group.',
        },
        {
          term: 'issue network',
          definition: 'a broader, more fluid web of policy actors engaging on an issue, contrasted with the tight, stable alliance of a classic iron triangle.',
        },
        {
          term: 'amicus curiae brief',
          definition: '"friend of the court" brief filed by a party not directly involved in a case, presenting arguments meant to influence the court\'s ruling.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-iron-triangle-vs-issue-network',
      kind: 'worked_example',
      problem:
        "Compare two scenarios. Scenario One: a farm-subsidy agency, the House Agriculture Committee, and a national farmers' association have worked together for decades — the committee reliably funds and protects the agency's subsidy programs, the agency administers subsidies favorably to the association's members, and the association reliably supports committee members' reelection campaigns. Scenario Two: a debate over a new online-privacy regulation draws in several federal agencies, multiple congressional committees with overlapping jurisdiction, a dozen different tech-industry and civil-liberties interest groups, and academic researchers — with no single stable alliance dominating the outcome. (a) Identify which scenario describes an iron triangle and which describes an issue network, and explain the key difference between them. (b) Explain what each of the three iron-triangle participants in Scenario One gets out of the relationship. (c) Explain why an interest group might turn to litigation or an amicus brief instead of lobbying in a situation like Scenario Two, where no single alliance controls the outcome.",
      steps: [
        'CLASSIFY SCENARIO ONE. The farm-subsidy relationship — one committee, one agency, one dominant interest group, working together stably over decades — is the classic IRON TRIANGLE.',
        'CLASSIFY SCENARIO TWO. The privacy-regulation debate — multiple agencies, multiple overlapping committees, a dozen competing groups, researchers, no single dominant alliance — is an ISSUE NETWORK.',
        'THE KEY DIFFERENCE. An iron triangle is a small, stable, mutually reinforcing alliance among exactly three kinds of actors; an issue network is a much larger, looser, shifting set of actors with no guaranteed stable alliance controlling outcomes. Scale and stability are the distinguishing features, not just topic.',
        'WHAT EACH IRON-TRIANGLE PARTICIPANT GETS. The COMMITTEE gets policy expertise and political support (including campaign backing) from the association; the AGENCY gets reliable funding and favorable oversight from the committee; the INTEREST GROUP (the farmers\' association) gets subsidy policy outcomes favorable to its members from the agency and committee.',
        'WHY LITIGATION FITS AN ISSUE-NETWORK SITUATION. When no single alliance controls an outcome — as in the crowded privacy-regulation debate — a group\'s lobbying influence over any one committee or agency is diluted among many competing actors. Litigation (or an amicus brief in a case the group is not directly a party to) offers an alternate channel that does not depend on winning a fragmented, multi-actor legislative or bureaucratic fight; a single favorable court ruling can settle the issue regardless of how many other actors are competing for influence elsewhere.',
      ],
      answer:
        'Scenario One is an iron triangle: a stable, decades-long, mutually reinforcing alliance among exactly one committee, one agency, and one dominant interest group. Scenario Two is an issue network: a large, shifting set of agencies, committees, interest groups, and researchers with no single alliance controlling the outcome. In the iron triangle, the committee gets policy expertise and political/campaign support from the association, the agency gets reliable funding and favorable oversight from the committee, and the association gets subsidy outcomes favorable to its members. A group facing an issue-network situation like Scenario Two may turn to litigation or an amicus brief because its lobbying influence is diluted among many competing actors — a favorable court ruling offers a channel to a policy win that does not depend on prevailing in a crowded, fragmented legislative or bureaucratic fight.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. A trade association representing an entire manufacturing industry successfully lobbies Congress for a regulatory exemption that benefits every firm in the industry, whether or not the firm is a paying member of the association. To keep its membership funded, the association offers members-only legal consulting services and discounted industry-conference registration. Separately, when the association loses a legislative fight over a proposed regulation, it instead files an amicus curiae brief in an unrelated court case that could set a precedent affecting that same regulation. (a) Explain the free-rider problem this association faces, given who benefits from its lobbying win. (b) Explain how the members-only legal consulting and conference discounts function as selective incentives. (c) Explain what an amicus curiae brief is and why the association might use one after losing a legislative fight.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that because the regulatory exemption benefits every firm in the industry regardless of membership, non-member firms can free-ride on the association\'s lobbying without paying dues. No credit for a response that does not connect the shared benefit to the free-rider concept.',
            modelResponse:
              "Because the regulatory exemption benefits every firm in the industry — not just paying members of the association — non-member firms can enjoy the same policy win without ever joining or paying dues. This is the free-rider problem: the association bears the cost of lobbying, but the benefit is shared with firms that contributed nothing toward winning it.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that selective incentives are benefits available only to paying members, giving firms a material reason to join beyond the shared policy win non-members get for free. No credit for a response that misidentifies these benefits as something other than a free-rider countermeasure.',
            modelResponse:
              "The legal consulting and conference discounts are selective incentives: benefits available only to paying members, unlike the regulatory exemption which benefits every firm regardless of membership. By offering something non-members cannot access, the association gives firms a material reason to join and pay dues even though they could free-ride on its general lobbying wins.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly defines an amicus curiae brief as a "friend of the court" filing by a party not directly involved in the case, and explains that the association is using litigation as an alternate channel after losing in the legislative arena. No credit for a response that misdefines the brief or omits the alternate-channel reasoning.',
            modelResponse:
              "An amicus curiae brief is a \"friend of the court\" filing submitted by a party that is not directly involved in the case, presenting arguments meant to influence how the court rules. Having lost the legislative fight, the association turns to litigation as an alternate strategy — a favorable court ruling in this unrelated case could still shape the same regulation, giving the group another path to its policy goal after the legislative channel failed.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-free-rider-voluntary-joining',
      kind: 'misconception_check',
      question:
        'True or false: because a successful interest group\'s policy win benefits everyone affected, most affected people will voluntarily join the group and pay dues to support it.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming that a shared, widely beneficial goal is enough by itself to motivate voluntary contribution, rather than recognizing that a rational individual can enjoy a shared benefit without paying for it — which is precisely why interest groups need selective incentives at all.',
          correctsTo:
            'FALSE. This is exactly backwards — it describes the FREE-RIDER PROBLEM, not a reason people will voluntarily join. Because the group\'s policy win (a tax break, a safety rule, an exemption) benefits everyone affected regardless of membership, a rational individual has little material incentive to join and pay dues when they can enjoy the same benefit for free. That is precisely why real interest groups rely on SELECTIVE INCENTIVES — member-only benefits like discounts, insurance, or publications — to give people a reason to join beyond the shared policy win that non-members get anyway.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pluralism says influence is spread across many competing groups; the elite critique says influence is concentrated among a well-resourced few — two competing views of the same interest-group system.',
        'Lobbying strategies: providing information/expertise, drafting model legislation, and testifying at committee hearings.',
        'The free-rider problem: shared benefits mean people can enjoy a group\'s win without joining. Selective incentives (member-only benefits) are the standard countermeasure.',
        'Iron triangles are a tight, stable three-way alliance among a committee, an agency, and an interest group (see apgov.bureaucracy-accountability); issue networks are a much looser, larger, shifting set of actors with no single alliance controlling outcomes.',
        'When lobbying and legislative channels are unfavorable, interest groups can turn to litigation or file amicus curiae ("friend of the court") briefs to influence policy through the courts instead.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.6-5.7',
    cedTitle: 'Interest Groups',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
    ],
  },
};
