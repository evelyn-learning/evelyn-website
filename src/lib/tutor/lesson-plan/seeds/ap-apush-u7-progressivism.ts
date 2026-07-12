/**
 * AP US History — CED Unit 7.4-7.5: The Progressive Movement.
 *
 * Period-7 fan-out content plan (follows the causes-of-revolution
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale). No passage is wired to this plan per the Period-7
 * block spec — the worked example is a document-free comparative analysis
 * of Theodore Roosevelt's and Woodrow Wilson's competing approaches to
 * trusts, since no Progressive-era Passage is seeded for this period.
 *
 * Muckraker works (Ida Tarbell, Upton Sinclair) are described only, with
 * no verbatim quotation, since no Passage documents them here.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U7_PROGRESSIVISM: LessonPlan = {
  id: 'evelyn.ap.apush.progressivism.v1',
  title: 'U7.4-7.5 The Progressive Movement',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.progressivism',
      description:
        'Explain the origins and goals of Progressive reform from the municipal to the state to the federal level; explain the Progressive-era policies of Theodore Roosevelt, William Howard Taft, and Woodrow Wilson; explain the 16th-19th Amendments and the woman suffrage movement; and evaluate the limits Progressivism placed on issues of race.',
      standard: 'AP-APUSH-7.4',
    },
  ],
  prerequisites: ['apush.imperialism'],
  followUps: ['apush.wwi'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Progressivism as a genuinely diverse, sometimes internally contradictory reform coalition, not a single unified movement with one agenda.',
      script:
        "Here's a puzzle: the same reform era that gave American women the vote (1920) and created the federal income tax also saw many of its Southern reformers write literacy tests and poll taxes into law specifically to strip Black Americans of the vote. Both things are genuinely part of \"Progressivism.\" That should make you suspicious of any simple one-sentence definition of the movement. Progressivism wasn't a political party with a single platform — it was a loose, sometimes contradictory coalition of reformers who agreed government should DO something about the problems industrialization and urbanization had created, but disagreed sharply about what, for whom, and how far. Today we're tracing that reform energy as it climbs from city halls to statehouses to the White House — and where, along the way, it stopped short.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-progressivism',
      kind: 'concept',
      goal: 'Explain the escalation of Progressive reform from the municipal to state to federal level, the competing programs of Roosevelt, Taft, and Wilson, the era\'s constitutional amendments and suffrage strategy, and Progressivism\'s limits on race.',
      keyIdeas: [
        'MUCKRAKERS built public pressure for reform: journalists investigated and publicized corporate abuse and government corruption in mass-circulation magazines — Ida Tarbell\'s investigative reporting exposed Standard Oil\'s monopolistic business practices, and Upton Sinclair\'s 1906 novel "The Jungle" exposed unsanitary conditions in Chicago\'s meatpacking industry, helping spur the federal food-safety laws described below.',
        'REFORM ESCALATED FROM MUNICIPAL TO STATE TO FEDERAL: city-level reformers built settlement houses (like Jane Addams\'s Hull House in Chicago) to serve immigrant and working-class neighborhoods, and pushed city-commission and city-manager government structures meant to reduce ward-boss corruption. State-level reform followed: Wisconsin\'s governor Robert La Follette pioneered direct primaries, tighter railroad regulation, and expert regulatory commissions — a model often called the "Wisconsin Idea." Only after these local and state successes did comparable reform reach the federal level.',
        "THEODORE ROOSEVELT'S SQUARE DEAL: Roosevelt distinguished between \"good\" trusts (efficient, not abusive) and \"bad\" trusts, pursuing selective antitrust suits rather than dismantling big business wholesale. Following muckraking exposure of unsafe food and drugs, he pushed the Pure Food and Drug Act and the Meat Inspection Act (both 1906), and expanded federal conservation of public lands.",
        "TAFT'S SPLIT WITH PROGRESSIVE REPUBLICANS: William Howard Taft actually filed MORE antitrust suits than Roosevelt had, but alienated progressive Republicans over the Payne-Aldrich Tariff (which raised rates rather than lowering them, as progressives wanted) and the Pinchot-Ballinger Affair (a conservation policy dispute) — fracturing the Republican coalition Roosevelt had built.",
        'THE ELECTION OF 1912: the Republican split produced a four-way race — Taft (Republican), Roosevelt (running as the Progressive/"Bull Moose" Party candidate on his "New Nationalism" platform), Woodrow Wilson (Democrat, "New Freedom"), and Eugene Debs (Socialist). The divided Republican vote helped Wilson win decisively.',
        "WILSON'S NEW FREEDOM: Wilson lowered tariffs (Underwood Tariff, 1913), created the Federal Reserve System (1913) to regulate the nation's currency and banking system, and strengthened antitrust enforcement through the Clayton Antitrust Act and the new Federal Trade Commission (both 1914).",
        'FOUR CONSTITUTIONAL AMENDMENTS marked the Progressive Era: the 16th Amendment (1913, authorizing a federal income tax), the 17th Amendment (1913, direct election of U.S. senators, replacing selection by state legislatures), the 18th Amendment (ratified 1919, national Prohibition of alcohol), and the 19th Amendment (1920, women\'s suffrage).',
        'SUFFRAGE STRATEGY COMBINED TWO APPROACHES: the National American Woman Suffrage Association (NAWSA), led by Carrie Chapman Catt, pursued a dual state-by-state AND federal-amendment strategy (the "Winning Plan"), while Alice Paul\'s more confrontational National Woman\'s Party used direct-action tactics — picketing the White House, hunger strikes when arrested — to keep pressure on Wilson and Congress. Both wings contributed to the 19th Amendment\'s ratification in 1920.',
        "PROGRESSIVISM'S LIMITS ON RACE: Progressive reform was overwhelmingly a movement led by and for white, often middle-class, Americans. In the South, many \"reforms\" (literacy tests, poll taxes, grandfather clauses) were specifically designed to disenfranchise Black voters, and legal segregation stood affirmed by Plessy v. Ferguson (1896). W.E.B. Du Bois and other Black activists founded the Niagara Movement (1905) and helped found the NAACP (1909) to resist a pattern the mainstream Progressive movement mostly ignored or reinforced.",
      ],
      vocabulary: [
        {
          term: 'muckrakers',
          definition:
            'journalists who investigated and publicized corporate abuse and government corruption in mass-circulation magazines, building public pressure for Progressive reform (e.g. Ida Tarbell on Standard Oil, Upton Sinclair on the meatpacking industry).',
        },
        {
          term: 'Wisconsin Idea',
          definition:
            'Governor Robert La Follette\'s state-level reform model (direct primaries, railroad regulation, expert commissions) that became a template for other states before federal Progressive reform followed.',
        },
        {
          term: '17th Amendment (1913)',
          definition:
            'constitutional amendment establishing direct election of U.S. senators by voters, replacing selection by state legislatures.',
        },
        {
          term: '19th Amendment (1920)',
          definition:
            "constitutional amendment guaranteeing women's suffrage, achieved through both NAWSA's state-by-state/federal strategy and the National Woman's Party's direct-action tactics.",
        },
        {
          term: 'Niagara Movement / NAACP',
          definition:
            "civil-rights organizing led by W.E.B. Du Bois (Niagara Movement, 1905; co-founder of the NAACP, 1909) that resisted disenfranchisement and segregation the mainstream Progressive movement largely ignored.",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-square-deal-vs-new-freedom',
      kind: 'worked_example',
      problem:
        "Compare Theodore Roosevelt's approach to trusts (the Square Deal, and later his 1912 \"New Nationalism\") with Woodrow Wilson's approach (the New Freedom). Both aimed to curb corporate power — what did each favor, and what does the difference reveal about the diversity within Progressivism?",
      steps: [
        "IDENTIFY ROOSEVELT'S APPROACH. Roosevelt distinguished between \"good\" trusts (efficient, not abusive of consumers or competitors) and \"bad\" trusts, and favored selective regulation and prosecution of the bad ones rather than breaking up big business as such. His 1912 \"New Nationalism\" went further, arguing a strong, activist federal government should actively REGULATE and manage large-scale industrial capitalism rather than try to dismantle it.",
        "IDENTIFY WILSON'S APPROACH. Wilson's \"New Freedom\" started from a different premise: that concentrated economic power was itself the problem, regardless of how it behaved, because it crushed the fair competition of smaller businesses and individual enterprise. His program (Underwood Tariff, Federal Reserve, Clayton Antitrust Act, Federal Trade Commission) aimed more at restoring competitive markets and breaking up excessive concentration than at regulating trusts as permanent, accepted fixtures.",
        "LOCATE THE EXACT DISAGREEMENT. Both leaders agreed big business needed some federal check. They disagreed on WHETHER concentrated economic power itself was acceptable if well-regulated (Roosevelt) or was inherently a problem to be broken up (Wilson) — a real philosophical difference, not just a difference in party label.",
        "CONNECT TO PROGRESSIVISM'S DIVERSITY. This is a clear example of Progressivism's internal disagreement: reformers agreed government should act on the problems of industrial capitalism, but split over HOW — between accepting big business under strong regulation versus actively restoring smaller-scale competition. The same tension appears across the movement: municipal reformers focused on efficient administration, social-justice reformers focused on labor and housing conditions, and moral reformers focused on temperance and personal conduct, without a single shared blueprint.",
        "STATE THE LINK TO THE COURSE THESIS. The Roosevelt/Wilson split over trusts is a specific, well-documented instance of a general truth about the Progressive Era: it was a broad coalition around a shared instinct that industrialization's problems required government action, not a single movement with one agreed program — which is exactly why it is a mistake to describe it as unified.",
      ],
      answer:
        'Roosevelt\'s approach (the Square Deal, later "New Nationalism") accepted large-scale business as a fact of the modern economy and favored strong federal REGULATION, distinguishing "good" trusts from "bad" ones and prosecuting selectively. Wilson\'s "New Freedom" treated concentrated economic power itself as the core problem and favored restoring competitive markets by breaking up excessive concentration (Clayton Antitrust Act, Federal Trade Commission) alongside currency and tariff reform. Both agreed the federal government needed to check big business, but disagreed on whether regulated bigness (Roosevelt) or restored competition (Wilson) was the right cure — a genuine philosophical split that illustrates why Progressivism is better understood as a diverse coalition sharing an instinct for government action than as a single movement with one agreed program.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE Progressive-era reform at the municipal, state, or federal level. (b) Briefly explain ONE specific law or constitutional amendment and the problem it was designed to address. (c) Briefly explain ONE way Progressive-era reform's benefits were limited for African Americans.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine Progressive-era reform — e.g. settlement houses, city-commission/city-manager government, Wisconsin\'s direct primary and railroad regulation, or a specific federal program (Square Deal, New Freedom). No credit for a vague statement ("reformers wanted change") with no specific reform named.',
            modelResponse:
              'One Progressive-era reform was the direct primary, pioneered in Wisconsin under Governor Robert La Follette, which let ordinary party voters choose nominees directly instead of leaving nominations to party bosses in closed conventions.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate law or amendment (16th, 17th, 18th, 19th Amendments; Pure Food and Drug Act; Federal Reserve Act; Clayton Antitrust Act) and connects it to the problem it addressed. No credit for a disconnected or vague explanation.',
            modelResponse:
              "The 17th Amendment (1913) established direct election of U.S. senators by voters, addressing the problem of state legislatures — often influenced by corporate and party-machine interests — controlling who became senator instead of the voting public.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate limit on Progressivism\'s benefit to African Americans — e.g. Southern "reforms" like literacy tests, poll taxes, and grandfather clauses used to disenfranchise Black voters, or the persistence of legal segregation (Plessy v. Ferguson) throughout the era. No credit for a vague or unsupported claim.',
            modelResponse:
              "Many Southern Progressive-era \"reforms\" were actually used to disenfranchise Black voters: literacy tests, poll taxes, and grandfather clauses stripped most African American men of the vote they had gained after the Civil War, even as the same era's rhetoric of civic improvement applied almost exclusively to white Americans.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-single-movement',
      kind: 'misconception_check',
      question:
        'True or false: the Progressives were a single, unified movement with one shared reform agenda.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating a broad, loosely-labeled reform era as though it had one coherent platform, rather than recognizing it as a coalition of distinct, sometimes conflicting reform impulses.',
          correctsTo:
            'FALSE. Progressivism was a broad and often internally divided coalition, not a single movement with one agenda. Theodore Roosevelt and Woodrow Wilson, both considered Progressives, disagreed sharply over whether to regulate big business (Roosevelt) or break it up to restore competition (Wilson) — a disagreement serious enough to help split the Republican Party in the four-way election of 1912. Reformers who focused on efficient, corruption-free city government did not necessarily share the priorities of social-justice reformers focused on labor conditions and immigrant housing, or of temperance reformers focused on banning alcohol. Most damagingly, many Southern "Progressive" reforms were explicitly used to disenfranchise Black voters even as the movement expanded political rights (direct primaries, women\'s suffrage) for others. The AP exam rewards recognizing Progressivism\'s internal diversity and limits, not describing it as a single coherent program.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Muckrakers (Tarbell, Sinclair) exposed corporate and industrial abuses, building public pressure for reform that escalated from municipal (settlement houses, city-manager government) to state (Wisconsin Idea) to federal levels.",
        "Roosevelt's Square Deal favored regulating (not breaking up) big business; Wilson's New Freedom favored restoring competition by breaking up concentrated power — a genuine philosophical split within Progressivism, visible in the four-way election of 1912.",
        'The 16th-19th Amendments (income tax, direct election of senators, Prohibition, women\'s suffrage) were all ratified during this era, with suffrage won through both NAWSA\'s state/federal strategy and the National Woman\'s Party\'s direct action.',
        'Progressivism placed real limits on race: many Southern "reforms" disenfranchised Black voters, and legal segregation persisted throughout the era, prompting Du Bois\'s Niagara Movement and the founding of the NAACP (1909).',
        'Progressivism was a diverse, sometimes internally contradictory coalition, not a single unified movement with one shared agenda.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.4-7.5',
    cedTitle: 'The Progressive Movement',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP US History' }],
  },
};
