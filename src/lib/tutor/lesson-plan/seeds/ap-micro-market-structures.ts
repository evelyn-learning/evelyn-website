/**
 * AP Micro — Market Structures.
 *
 * Perfect competition, monopoly, monopolistic competition, oligopoly. Profit maximization.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_MICRO_MARKET_STRUCTURES: LessonPlan = {
  id: 'evelyn.ap.micro.market-structures.v1',
  title: 'Market Structures',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ss',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'apmicro.market-structures',
      description: 'Compare perfect competition, monopolistic competition, oligopoly, and monopoly on entry, pricing power, and efficiency; apply MR = MC profit maximization.',
      standard: 'AP-MICRO-3',
    },
  ],
  prerequisites: ['apmicro.supply-demand', 'apmicro.elasticity'],
  followUps: ['apmicro.factor-markets'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Same firm goal, very different worlds depending on competition.',
      script: 'Every firm wants to maximize profit. But the rules of the game depend on how many competitors there are, how similar the products are, and how easy it is for new firms to enter. A wheat farmer plays a totally different game than Google. Four market structures cover the spectrum.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-structures',
      kind: 'concept',
      goal: 'Four structures, each defined by competition + entry.',
      keyIdeas: [
        'PROFIT-MAX RULE (UNIVERSAL): produce where MR = MC. Then check if P > ATC (profit), P = ATC (break-even), P < ATC (loss but minimize). If P < AVC in short run, shut down.',
        'PERFECT COMPETITION: many sellers, identical product, FREE entry/exit, perfect info. Each firm is a PRICE TAKER — demand curve is horizontal at market price. P = MR. Long-run zero economic profit (entry erodes any profit).',
        'MONOPOLY: one seller, no close substitutes, BARRIERS TO ENTRY (patent, natural monopoly, control of inputs). Firm is PRICE MAKER. MR < P (must lower price to sell more). Inefficient — produces less than socially optimal at higher price. May have permanent profit.',
        'MONOPOLISTIC COMPETITION: many sellers, DIFFERENTIATED products (restaurants, clothing brands), free entry. Each firm has SOME market power (its own brand) but faces close substitutes. Long-run zero profit (entry of similar brands). Excess capacity — produces below efficient scale.',
        'OLIGOPOLY: FEW large sellers, products may be identical or differentiated, barriers to entry. STRATEGIC interaction — each firm cares what rivals do. Game theory tools (PRISONER\'S DILEMMA, NASH EQUILIBRIUM) are central. May collude (cartel) or compete fiercely.',
        'EFFICIENCY: perfect competition is most efficient (P = MC, no deadweight loss). Monopoly creates DEADWEIGHT LOSS — quantity below the efficient level. Monopolistic competition has small deadweight loss + product variety benefit.',
        'PRICE DISCRIMINATION (monopolies): charge different prices to different buyers based on willingness to pay. Increases profit, can sometimes increase total quantity (closer to efficient).',
        'GAME THEORY in oligopoly: PRISONER\'S DILEMMA shows why cooperation is unstable — each firm has incentive to defect (cut price) even when both would gain by cooperating.',
      ],
      vocabulary: [
        { term: 'price taker', definition: 'a firm that has no power to set price; must accept the market price.' },
        { term: 'deadweight loss', definition: 'reduction in total surplus from producing less than the efficient quantity.' },
        { term: 'Nash equilibrium', definition: 'a strategy profile where no firm gains by unilaterally changing strategy.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-monopoly',
      kind: 'worked_example',
      problem: 'A monopoly faces P = 100 − Q and MC = 20. Find profit-maximizing quantity, price, and explain why this is inefficient.',
      steps: [
        'TR = P · Q = (100 − Q) · Q = 100Q − Q².',
        'MR = dTR/dQ = 100 − 2Q.',
        'Set MR = MC: 100 − 2Q = 20 → Q = 40.',
        'P = 100 − 40 = 60.',
        'EFFICIENT (perfect competition) quantity: P = MC → 100 − Q = 20 → Q = 80.',
        'Monopoly produces HALF the efficient quantity at THREE TIMES marginal cost. Deadweight loss is the triangle between Q = 40 and Q = 80 below the demand curve and above MC.',
        'This loss is why most countries regulate monopolies or break them up.',
      ],
      answer: 'Q = 40, P = 60. Monopoly produces less than the efficient Q = 80, creating deadweight loss.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A perfectly competitive farm sells wheat at the market price of $5/bushel. The farm\'s MC = 2 + 0.1·Q. How many bushels should the farm produce to maximize profit?',
      expectedAnswer: '30 bushels',
      responseFormat: 'free',
      hints: [
        'In perfect competition, P = MR = 5.',
        'Set MR = MC: 5 = 2 + 0.1·Q. Solve.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-monopoly-charges-anything',
      kind: 'misconception_check',
      question: 'Can a monopoly charge any price it wants and make whatever profit it wants?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating monopoly as unlimited pricing power.',
          correctsTo: 'No. A monopoly is constrained by the DEMAND CURVE — even with no rivals, if it raises price too high, quantity demanded falls. Profit is bounded by where MR = MC. The monopoly\'s power is to choose any point ON the demand curve, not to step off it. Some monopolies barely earn profit because their demand is weak (a monopoly on something nobody wants).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Profit max universal: MR = MC.',
        'Perfect competition: price taker, P = MR, zero LR profit.',
        'Monopoly: price maker, MR < P, deadweight loss.',
        'Mon. competition: differentiated, free entry, zero LR profit. Oligopoly: few firms, strategic.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'In a Prisoner\'s Dilemma between two oligopolists deciding whether to advertise, why does the Nash equilibrium feature both advertising even when both would prefer neither did?',
      hint: 'Each firm reasons: if rival doesn\'t advertise, I\'m better off advertising (I steal share). If rival advertises, I must too (or lose share). Advertising is the dominant strategy. Both follow it. Result: same shares as if neither advertised, but both bear costs. Cooperation would help, but is unstable — temptation to defect.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
