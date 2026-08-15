/**
 * AP US Government & Politics — Unit 5 FRQ Practice: SCOTUS Comparison
 * (AP Gov FRQ 3) — 4 points, one point per lettered part, comparing a
 * REQUIRED foundational case against a related NONREQUIRED case.
 *
 * Format (per the authentic AP Gov SCOTUS Comparison FRQ): the facts,
 * constitutional issue, and holding of two Supreme Court cases, given
 * inline in the prompt as text rather than via a passage document,
 * followed by four parts — (A) IDENTIFY a concept common to both cases,
 * (B) EXPLAIN how the required case's facts led to its holding, (C)
 * EXPLAIN how the reasoning in the nonrequired case relates to the
 * required case's reasoning, and (D) EXPLAIN how the required case's
 * holding affects a form of political behavior.
 *
 * Required case: Citizens United v. FEC (2010) — Citizens United, a
 * nonprofit corporation, produced a film critical of a presidential
 * candidate and wanted to distribute it via video-on-demand close to a
 * primary election; the Bipartisan Campaign Reform Act (BCRA) barred
 * corporations from funding "electioneering communications" referring to a
 * candidate within a set window before an election. The Supreme Court held
 * that political speech does not lose First Amendment protection simply
 * because its source is a corporation or union, and that INDEPENDENT
 * political expenditures — unlike direct contributions to a candidate — do
 * not create the same quid pro quo corruption risk, because there is no
 * prearrangement or coordination with the candidate; the Court struck down
 * the corporate/union independent-expenditure ban but left BCRA's
 * disclosure and disclaimer requirements in place.
 * Nonrequired case: Buckley v. Valeo (1976) — a constitutional challenge to
 * the Federal Election Campaign Act (FECA)'s limits on both campaign
 * CONTRIBUTIONS (money given directly to a candidate) and campaign
 * EXPENDITURES (money spent independently on political speech, including a
 * candidate's own spending). The Court upheld FECA's contribution limits,
 * reasoning that large direct contributions create a real risk of quid pro
 * quo corruption or its appearance, a risk substantial enough to justify
 * limiting a contribution's dollar amount. But the Court struck down FECA's
 * expenditure limits, reasoning that spending money to engage in political
 * speech is itself a form of protected First Amendment expression, and that
 * restricting how much can be spent on that speech restricts the speech
 * itself in a way contribution limits do not. NO passageId/passageIds: per
 * spec, both case descriptions live inline in the try_yourself prompt as
 * text, matching the U1-U4 inline-description convention for this format.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U5_FRQ_SCOTUS_COMPARISON: LessonPlan = {
  id: 'evelyn.ap.apgov.u5-frq-scotus-comparison.v1',
  title: 'Unit 5 FRQ Practice — SCOTUS Comparison',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u5-frq-scotus-comparison',
      description:
        'Answer a complete AP Gov SCOTUS Comparison free-response question comparing the required case Citizens United v. FEC (2010) to the nonrequired case Buckley v. Valeo (1976) — identifying the shared First Amendment concept, explaining how Citizens United\'s facts produced its holding, explaining how Buckley\'s contribution/expenditure distinction relates to Citizens United\'s reasoning, and explaining how Citizens United affects interest groups\' electioneering — scored against the authentic AP Gov 4-point SCOTUS Comparison rubric (1 point per part).',
      standard: 'AP-APGOV-5-FRQ-SCOTUS',
    },
  ],
  prerequisites: ['apgov.elections-campaign-finance'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of comparing a required case to a related nonrequired case concrete for the campaign-finance pair, and name the format\'s biggest trap: treating Buckley\'s contribution/expenditure line as if Citizens United erased it entirely.',
      script:
        "One of the four AP Gov free-response questions gives you two Supreme Court cases — always one of the nine required cases, plus a related case you can reason about from its facts — worth 4 points. Today's required case is Citizens United v. FEC, the 2010 decision that let corporations and unions spend unlimited money on independent political ads. But Citizens United didn't invent the reasoning it relies on out of nothing — it built directly on a much older case, Buckley v. Valeo from 1976, which first drew a line between limiting campaign CONTRIBUTIONS (allowed, because of corruption risk) and limiting campaign EXPENDITURES (not allowed, because spending money on political speech is itself protected speech). The biggest trap on this FRQ is treating Citizens United as if it threw out Buckley's contribution/expenditure distinction — it didn't; it extended the EXPENDITURE side of that same distinction to corporations and unions. Today you'll compare the two cases and keep that distinction perfectly clean.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-scotus-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SCOTUS Comparison FRQ asks for and how the 4-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get the facts, constitutional issue, and holding of two cases — a REQUIRED case (Citizens United v. FEC) and a NONREQUIRED case that relates to it (Buckley v. Valeo), both turning on the First Amendment\'s protection of political spending as speech. Four parts, each worth 1 point, graded independently.',
        'PART (A) — IDENTIFY THE SHARED PROVISION (0-1 point): full credit requires correctly naming the First Amendment\'s protection of political speech/expression as the concept common to both cases\' central legal question — not a vaguer reference to "money in politics" with no reference to the specific constitutional provision.',
        'PART (B) — EXPLAIN THE REQUIRED CASE\'S FACTS -> HOLDING (0-1 point): full credit requires explaining HOW Citizens United\'s specific facts (a corporation wanting to fund an independent political film/ad referencing a candidate close to an election, barred by BCRA solely because its source was a corporation) led logically to its specific holding (political speech does not lose First Amendment protection because its source is a corporation, and independent expenditures — uncoordinated with any candidate — do not carry the same corruption risk as direct contributions) — cause and effect, not just facts and holding restated side by side.',
        'PART (C) — EXPLAIN HOW BUCKLEY\'S DISTINCTION RELATES (0-1 point): the hardest part of this format. Full credit requires explaining that Buckley first drew the contribution/expenditure line — upholding contribution limits because of a real corruption risk, while striking expenditure limits because spending on political speech is itself protected — and that Citizens United built directly on Buckley\'s EXPENDITURE-side reasoning, extending the same "independent spending is protected, uncoordinated spending carries no quid pro quo risk" logic to corporations and unions, rather than disturbing Buckley\'s separate holding upholding contribution limits.',
        'PART (D) — EXPLAIN THE EFFECT ON INTEREST GROUPS (0-1 point): full credit requires explaining that Citizens United\'s holding lets interest groups (and the corporations/unions that fund them) spend unlimited sums on independent political expenditures — through vehicles like super PACs — to influence elections, so long as that spending is not coordinated with, or contributed directly to, a candidate\'s campaign.',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: describing Citizens United as if it struck down ALL campaign-finance limits, including contribution limits — Buckley\'s contribution-limit holding is still good law; Citizens United extended only the expenditure side of Buckley\'s distinction, and only to corporate/union speakers.',
        'Total = 4 points, one per part, each graded independently — the authentic AP Gov SCOTUS Comparison scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-scotus-comparison-frq',
      kind: 'try_yourself',
      problem:
        'Read the descriptions of the following two Supreme Court cases, then answer parts (A), (B), (C), and (D).\n\nCitizens United v. FEC (2010) — REQUIRED CASE: Citizens United, a nonprofit corporation, produced a film critical of a presidential candidate and wanted to make it available via video-on-demand close to a primary election. The Bipartisan Campaign Reform Act (BCRA) barred corporations and unions from funding "electioneering communications" that referred to a candidate within a set window before an election, regardless of whether the spending was coordinated with any candidate. The Supreme Court held that political speech does not lose First Amendment protection simply because its source is a corporation or union, and that INDEPENDENT political expenditures — spending not prearranged or coordinated with a candidate — do not create the same quid pro quo corruption risk that direct contributions can create; the Court struck down the ban on corporate and union independent expenditures, while leaving BCRA\'s disclosure and disclaimer requirements in place.\n\nBuckley v. Valeo (1976) — NONREQUIRED CASE: this case was a constitutional challenge to the Federal Election Campaign Act (FECA)\'s limits on both campaign CONTRIBUTIONS (money given directly to a candidate) and campaign EXPENDITURES (money spent independently on political speech, including a candidate\'s own spending on their campaign). The Supreme Court upheld FECA\'s contribution limits, reasoning that large direct contributions create a real risk of quid pro quo corruption or its appearance, substantial enough to justify limiting a contribution\'s dollar amount. But the Court struck down FECA\'s expenditure limits, reasoning that spending money to engage in political speech is itself a form of protected First Amendment expression, so restricting how much a person or campaign can spend restricts the underlying speech in a way that a contribution limit does not.\n\n(A) Identify the constitutional provision common to both Citizens United v. FEC (2010) and Buckley v. Valeo (1976).\n(B) Explain how the facts of Citizens United led to its holding.\n(C) Explain how the contribution/expenditure distinction in Buckley relates to the reasoning in Citizens United.\n(D) Explain how the holding in Citizens United affects interest groups\' electioneering.',
      responseFormat: 'frq',
      expectedAnswer:
        "(A) The First Amendment's protection of political speech is common to both cases, since each turns on whether the government may limit money spent or contributed in connection with political campaigns without violating free-speech protections. (B) Citizens United, a nonprofit corporation, wanted to fund an independent film critical of a candidate close to an election, but BCRA barred corporations from funding this kind of \"electioneering communication\" solely because of the corporate source of the spending. Because the spending was independent — not coordinated or prearranged with any candidate — the Court reasoned it carried none of the quid pro quo corruption risk that justifies limiting direct contributions, and that political speech does not lose First Amendment protection merely because a corporation is the speaker; this led the Court to strike down the corporate/union independent-expenditure ban while leaving disclosure requirements in place. (C) Buckley first drew the line between contributions and expenditures: it upheld FECA's contribution limits because large direct contributions create a real corruption risk, but struck down FECA's expenditure limits because spending money on political speech is itself protected expression. Citizens United did not disturb Buckley's contribution-limit holding; instead, it extended Buckley's EXPENDITURE-side reasoning — that independent spending on political speech is protected and does not carry a corruption risk the way direct contributions do — to corporations and unions, applying the same logic Buckley had already established for individuals' independent spending. (D) By protecting corporations' and unions' independent political expenditures, Citizens United lets interest groups — and the corporations and unions that fund them — spend unlimited sums on independent electioneering, typically through vehicles like super PACs, to run ads and other communications supporting or opposing candidates, so long as that spending is not coordinated with, and not contributed directly to, any candidate's campaign.",
      rubric: {
        parts: [
          {
            criterionId: 'A-identify-provision',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly identifies the First Amendment\'s protection of political speech/expression as the concept common to both cases. No credit (0/1) for a vaguer or incorrect concept (e.g., "campaign finance law" or "money in politics" with no reference to the First Amendment).',
            modelResponse:
              "The First Amendment's protection of political speech is common to both cases, since each turns on whether the government may limit money spent or contributed in connection with political campaigns without violating free-speech protections.",
          },
          {
            criterionId: 'B-required-case-reasoning',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains HOW Citizens United\'s facts (a corporation barred from funding independent, uncoordinated electioneering speech solely because of its corporate source) led to its holding (corporate/union independent expenditures are protected; independent spending carries no quid pro quo corruption risk) — cause and effect, not just facts and holding restated side by side. No credit (0/1) for stating the facts or holding alone with no connecting reasoning, or for misstating the holding.',
            modelResponse:
              "Citizens United, a nonprofit corporation, was barred from funding an independent film about a candidate solely because of its corporate source. Because the spending was independent — not coordinated with any candidate — the Court reasoned it carried none of the corruption risk that justifies limiting direct contributions, and that political speech does not lose First Amendment protection merely because a corporation is the speaker; this led the Court to strike down the corporate/union independent-expenditure ban.",
          },
          {
            criterionId: 'C-compare-reasoning',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1/1): explains that Buckley's contribution/expenditure distinction (contribution limits upheld for corruption-risk reasons; expenditure limits struck down because spending is protected speech) is the reasoning Citizens United extended to corporations and unions on the expenditure side, without disturbing Buckley's contribution-limit holding. No credit (0/1) for only stating that the two cases reached similar results without explaining the connection, or for claiming Citizens United overturned Buckley's contribution-limit holding.",
            modelResponse:
              "Buckley drew the line between contributions (limits upheld, due to corruption risk) and expenditures (limits struck down, because spending on political speech is itself protected). Citizens United did not disturb Buckley's contribution-limit holding; it extended Buckley's expenditure-side reasoning — that independent spending is protected and carries no corruption risk — to corporate and union speakers, applying the same logic Buckley had already established for independent spending generally.",
          },
          {
            criterionId: 'D-explain-effect',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1/1): explains that Citizens United lets interest groups (via corporations/unions and vehicles like super PACs) spend unlimited sums on independent electioneering, so long as the spending is not coordinated with or contributed directly to a candidate. No credit (0/1) for restating the holding with no explanation of its effect on interest-group electioneering, or for claiming the holding allows direct contributions.",
            modelResponse:
              "By protecting corporations' and unions' independent political expenditures, Citizens United lets interest groups spend unlimited sums on independent electioneering — typically through vehicles like super PACs — to support or oppose candidates through ads and other communications, so long as that spending is not coordinated with, and not contributed directly to, any candidate's campaign.",
          },
        ],
      },
      hints: [
        'Part (A) wants the First Amendment specifically, not a vague reference to "campaign finance" with no constitutional provision named.',
        'Part (C) is the hardest part: explain that Citizens United extended Buckley\'s EXPENDITURE-side reasoning to corporations, without touching Buckley\'s separate contribution-limit holding.',
        "Don't describe Citizens United as striking down contribution limits — it left Buckley's contribution-limit holding intact and addressed only independent expenditures.",
      ],
      estimatedMinutes: 13,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SCOTUS Comparison is 4 points, one per part, each graded independently — a required case (Citizens United v. FEC) plus a related nonrequired case (Buckley v. Valeo), no separate document.',
        "Buckley v. Valeo (1976): upheld FECA's contribution limits (corruption risk) but struck down its expenditure limits (spending on political speech is itself protected First Amendment expression).",
        'Citizens United v. FEC (2010): extended Buckley\'s expenditure-side reasoning to corporations and unions — independent political expenditures are protected speech and carry no quid pro quo corruption risk, since they are not coordinated with any candidate.',
        "Part (C) is the format's hardest part: Citizens United did NOT disturb Buckley's contribution-limit holding — it extended only the expenditure side of Buckley's distinction, and only to corporate/union speakers.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5-FRQ-SCOTUS',
    cedTitle: 'Unit 5 FRQ Practice — SCOTUS Comparison',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics SCOTUS Comparison free-response task wording and 4-point rubric (1 point per lettered part). Case descriptions (Citizens United v. FEC, 2010; Buckley v. Valeo, 1976) are inline prompt text, not a seeded passage.',
      },
    ],
  },
};
