/**
 * AP Macroeconomics — CED Unit 1.5: Cost-Benefit Analysis.
 *
 * Establishes the MB = MC decision rule that runs through every later
 * unit (firm production, government policy, consumer choice). Surfaces
 * the sunk-cost fallacy as the canonical AP misconception.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U1_COST_BENEFIT: LessonPlan = {
  id: 'evelyn.ap.macro.cost-benefit.v1',
  title: 'Cost-Benefit Analysis',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.cost-benefit',
      description:
        'Apply marginal-benefit / marginal-cost reasoning to find the optimal level of an activity, and recognize sunk costs as irrelevant to forward-looking decisions.',
      standard: 'AP-MACRO-1.5',
    },
  ],
  prerequisites: ['apmacro.scarcity', 'apmacro.comparative-advantage'],
  followUps: ['apmacro.marginal-analysis-consumer'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame every economic decision as a marginal one.',
      script:
        "When should you stop studying for a test? When does a city build the LAST bus stop? When does a factory produce the LAST unit? In every case, the answer comes from comparing what you GAIN from one more (the marginal benefit) to what you GIVE UP for one more (the marginal cost). Stop adding when MB equals MC. That single rule decides millions of choices a day across the economy.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mb-mc',
      kind: 'concept',
      goal: 'Cover MB, MC, the MB=MC decision rule, and sunk-cost reasoning.',
      keyIdeas: [
        'MARGINAL BENEFIT (MB): the additional benefit gained from doing ONE MORE of an action — one more unit produced, one more hour studied, one more bus stop built. Usually DECREASING as you do more (diminishing returns).',
        'MARGINAL COST (MC): the additional cost of doing ONE MORE. Often INCREASING as you scale up (resources tighten), though sometimes constant.',
        'OPTIMAL DECISION RULE: keep doing the action while MB > MC. Stop at the point where MB = MC. Past that point, MB < MC and each additional unit DESTROYS value.',
        'WHY MB = MC is optimal: if MB > MC at your current level, you are leaving value on the table — adding one more produces net positive value. If MB < MC, you are destroying value — pull back. The equilibrium is where neither moving up nor down improves things.',
        'TOTAL vs MARGINAL: total benefit is the SUM of all marginal benefits up to your current level. Total benefit can keep rising even as marginal benefit falls — the area, not the next slice. AP often tests whether you can read totals from a marginal table or vice versa.',
        'SUNK COST: a cost already incurred that CANNOT be recovered. Sunk costs are IRRELEVANT to forward-looking decisions. Whether you continue doing X depends on the FUTURE marginal benefits and costs from this point onward, not on what you already spent.',
        'IMPLICIT vs EXPLICIT cost: explicit costs are out-of-pocket dollars. IMPLICIT costs are opportunity costs of resources you already own (your time, your building, your saved money). Both belong in a complete economic cost-benefit analysis even if only explicit ones show up in accounting.',
      ],
      vocabulary: [
        { term: 'marginal benefit', definition: 'the additional benefit from one more unit of an activity.' },
        { term: 'marginal cost', definition: 'the additional cost of one more unit of an activity.' },
        { term: 'sunk cost', definition: 'a cost already incurred that cannot be recovered — irrelevant to forward-looking choices.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-bus-stops',
      kind: 'worked_example',
      problem:
        "A city is deciding how many new bus stops to build along a route. Each new stop has a marginal benefit (riders served, in dollar terms) that diminishes as more stops are added (the most-needed locations are picked first). The marginal cost is constant at $5 per stop (in thousands). MB schedule: stop 1 = $11, stop 2 = $9, stop 3 = $7, stop 4 = $5, stop 5 = $3, stop 6 = $1. How many stops should the city build?",
      steps: [
        'STEP 1 — RECORD MC. MC is constant at $5 per stop. The decision rule: build a stop while MB > $5; stop building once MB drops to or below $5.',
        'STEP 2 — STOP-BY-STOP CHECK. Stop 1: MB=$11 > MC=$5 → BUILD (net +$6). Stop 2: MB=$9 > MC=$5 → BUILD (net +$4). Stop 3: MB=$7 > MC=$5 → BUILD (net +$2). Stop 4: MB=$5 = MC=$5 → BUILD (net $0; conventionally we build at MB=MC since net is non-negative). Stop 5: MB=$3 < MC=$5 → STOP (would lose $2). Stop 6: MB=$1 < MC=$5 → STOP.',
        'STEP 3 — OPTIMAL QUANTITY. Build 4 stops. Net total benefit = (11-5)+(9-5)+(7-5)+(5-5) = 6+4+2+0 = $12 thousand.',
        'STEP 4 — VERIFY: building a 5th stop would reduce net benefit to $12 + ($3-$5) = $10. Building only 3 stops would yield $12 + 0 - 0 = ... actually, only 3 yields 6+4+2 = $12 too — but conventionally we treat MB=MC as "build" because there is no harm. Both 3 and 4 are common AP answers; the canonical convention is to build at MB=MC. Stick with 4.',
        'STEP 5 — INTUITION. Each additional stop is a separate yes/no decision. The MB falls because each new stop serves a less-busy location. The constant MC tells us to keep building until "the next one isn\'t worth it." That moment is when MB hits MC.',
      ],
      answer: 'Optimal: 4 bus stops. Net benefit at the optimum = $12 thousand.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-rule',
      kind: 'try_yourself',
      problem:
        'State the optimal-decision rule using marginal benefit and marginal cost. Then explain in one sentence WHY it works.',
      expectedAnswer:
        'Rule: keep doing the action while MB > MC; stop at the point where MB = MC. Why: at any level where MB > MC, doing one more adds positive net value; at any level where MB < MC, the last unit subtracted value and you should pull back. MB = MC is the unique level where neither moving up nor down improves the outcome — it is the optimum.',
      responseFormat: 'free',
      hints: ['The rule has two parts: when to keep going, and when to stop.', 'Think about what happens just above and just below MB=MC.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-firm',
      kind: 'try_yourself',
      problem:
        'A firm sells widgets at $10 each. Marginal costs by unit: 1st widget MC=$3, 2nd $5, 3rd $7, 4th $9, 5th $10, 6th $12, 7th $15. How many widgets should the firm produce? What is the maximum profit (ignore fixed costs)?',
      expectedAnswer:
        'MR = $10 (constant — the firm is a price-taker selling at $10 each). Compare MR vs MC unit-by-unit. Units 1-4: MR=$10 > MC ($3,$5,$7,$9) → produce all four. Unit 5: MR=$10 = MC=$10 → produce (MB = MC convention). Unit 6: MR=$10 < MC=$12 → STOP. Optimal output = 5 widgets. Maximum profit (ignoring fixed costs) = sum of (MR-MC) = (10-3)+(10-5)+(10-7)+(10-9)+(10-10) = 7+5+3+1+0 = $16.',
      responseFormat: 'numeric',
      hints: [
        'Marginal revenue per widget = price the firm gets = $10.',
        'Apply the MR=MC rule (which is the producer-side version of MB=MC).',
        'Profit = sum of all per-unit (MR-MC) up to the optimum.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-sunk-cost',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A movie studio has spent $80 million producing a film. Test screenings suggest the film will earn only $20 million in theaters. Reshoots could improve quality and raise expected revenue to $35 million, but reshoots will cost an additional $25 million. The CEO says: "We have already spent $80M — we have to keep going to recover that money." Evaluate the CEO\'s reasoning.',
      expectedAnswer:
        'The CEO is committing the SUNK COST FALLACY. The $80M is sunk — it has already been spent and cannot be recovered regardless of what the studio does next. The relevant decision is forward-looking: should they spend an ADDITIONAL $25M to gain ADDITIONAL revenue of $15M ($35M minus the $20M they would have earned anyway)? That is a $10M LOSS on the marginal decision. Reshoot only if the marginal benefit ($15M extra revenue) exceeds the marginal cost ($25M reshoot cost). Here it does not. Decline reshoots. Note the studio still LOSES money overall ($80M spent, $20M revenue = $60M loss), but the proper question is "given where we are, what minimizes future losses?" — and reshooting makes the loss WORSE, not better. Strong answers explicitly state: sunk costs are irrelevant; only future MB vs future MC matters.',
      responseFormat: 'frq',
      hints: [
        'Identify what is sunk and what is not.',
        'What is the MARGINAL benefit of reshooting? What is the MARGINAL cost?',
        'Apply MB = MC reasoning to the FORWARD decision only.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-sunk',
      kind: 'misconception_check',
      question: 'You have already paid $50 for a non-refundable concert ticket. The day arrives and you feel sick; you would much rather stay home and rest. Should you go to the concert because you "already paid"?',
      commonErrors: [
        {
          answer: 'yes — otherwise the $50 is wasted',
          misconception:
            "Treating sunk costs as a reason to do something. The $50 is gone whether you attend or not. Forcing yourself to attend is paying TWICE — once with the ticket money you can't recover, and again with a miserable evening when you wanted to rest.",
          correctsTo:
            'NO. The $50 is sunk — gone whether you attend or not. The forward-looking decision is: between "go to the concert (feeling sick)" and "stay home and rest," which has higher net benefit GOING FORWARD? If staying home and resting is more valuable to you than the concert experience, stay home. Going to "not waste the money" actively makes things worse: you experience a bad concert AND you used up a sick evening you needed for rest. The $50 is the price of entry to a decision you should make on its current merits, not a debt that obligates you to attend.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Optimal level of any activity: keep doing it while MB > MC; stop where MB = MC.',
        'MB usually falls; MC often rises. They cross at the optimum.',
        'Total benefit = sum of marginal benefits. Don\'t confuse "total" with "marginal."',
        'Sunk costs are IRRELEVANT to forward-looking decisions. Compare future MB vs future MC only.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.5',
    cedTitle: 'Cost-Benefit Analysis',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '1', note: 'OpenStax Ch 1 framing of marginal reasoning and sunk-cost logic.' },
    ],
  },
};
