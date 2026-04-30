/**
 * G11 — Economics: Market structures (perfect competition,
 * monopoly, oligopoly, monopolistic competition).
 *
 * The four classic market types, distinguished by number of firms,
 * product differentiation, and barriers to entry. Each behaves
 * differently in pricing and output. Antitrust law and the
 * rationale for breaking up monopolies.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ECON_MARKET_STRUCTURES: LessonPlan = {
  id: 'evelyn.g11.ss.econ.market-structures.v1',
  title: 'Market Structures',
  curriculum: 'state-standards',
  grade: '11',
  subject: 'social-studies',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'ss.g11.econ.market-structures',
      description: 'Distinguish among perfect competition, monopoly, oligopoly, and monopolistic competition.',
    },
  ],
  prerequisites: ['ss.g11.econ.supply-demand'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that not all markets behave like the textbook supply/demand picture.',
      script: 'A wheat farmer can\'t set the price of wheat — there are millions of farmers and the price is set by the market. But Apple sets iPhone prices on its own. And there are only a handful of cell carriers. These are completely different MARKET STRUCTURES, and each behaves differently. Knowing which is which tells you a lot about how prices, choices, and innovation work.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-structures',
      kind: 'concept',
      goal: 'Four structures + barriers to entry + antitrust.',
      keyIdeas: [
        'Markets are classified by THREE features:',
        '  1) Number of firms.',
        '  2) Product differentiation (identical vs different).',
        '  3) Barriers to entry (how hard for new firms to enter).',
        'PERFECT COMPETITION:',
        '  Many firms, identical product, no barriers to entry.',
        '  Examples: agriculture (wheat, corn).',
        '  Firms are PRICE TAKERS — must accept the market price.',
        '  Theoretical ideal — most efficient allocation of resources.',
        'MONOPOLY:',
        '  ONE firm, no close substitutes, high barriers to entry.',
        '  Examples: utility companies (regulated), patents on a unique drug.',
        '  Firm is a PRICE MAKER. Charges high prices, restricts output.',
        '  Generally inefficient and harmful to consumers — hence ANTITRUST law.',
        'MONOPOLISTIC COMPETITION:',
        '  Many firms, DIFFERENTIATED product, low barriers to entry.',
        '  Examples: restaurants, clothing, hair salons.',
        '  Each firm has SOME pricing power because their product is unique.',
        '  Heavy advertising; product variety; somewhat inefficient but offers choice.',
        'OLIGOPOLY:',
        '  Few large firms (3-10 typically), products may be similar or differentiated, high barriers.',
        '  Examples: airlines, cell carriers, soft drinks.',
        '  Firms watch each other carefully — interdependent. May tacitly coordinate prices.',
        '  CARTELS (formal price-fixing agreements) are illegal but oligopolies sometimes act like them.',
        'BARRIERS TO ENTRY: economies of scale, patents, government licenses, brand loyalty, high startup capital.',
        'ANTITRUST LAW: Sherman Act (1890), Clayton Act (1914). Government can block mergers, force breakups (AT&T 1984), and prosecute price-fixing.',
      ],
      vocabulary: [
        { term: 'perfect competition', definition: 'many firms, identical product, no barriers; price-takers.' },
        { term: 'monopoly', definition: 'one firm, no substitutes, high barriers; price-maker.' },
        { term: 'oligopoly', definition: 'few firms; behavior interdependent.' },
        { term: 'monopolistic competition', definition: 'many firms, differentiated products, low barriers.' },
        { term: 'antitrust', definition: 'laws and policies preventing monopoly abuse.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'Classify each: (a) Local pizza restaurants in a city. (b) The local water utility. (c) Wheat farming. (d) Smartphone manufacturers.',
      steps: [
        '(a) Pizza restaurants — many sellers, differentiated (each restaurant\'s pizza is slightly different), low barriers to entry → MONOPOLISTIC COMPETITION.',
        '(b) Water utility — one provider per region, high barriers (can\'t lay duplicate pipes) → MONOPOLY (usually regulated).',
        '(c) Wheat farming — many farmers, identical product, low barriers → PERFECT COMPETITION.',
        '(d) Smartphones — few large firms (Apple, Samsung, Google), differentiated, high barriers (R&D costs, brand) → OLIGOPOLY.',
      ],
      answer: '(a) monopolistic competition (b) monopoly (c) perfect competition (d) oligopoly',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is the airline industry considered an oligopoly?',
      expectedAnswer: 'Few large carriers (3-5 dominate); high barriers (planes, gates, regulation); they watch each other\'s prices.',
      responseFormat: 'free',
      hints: [
        'Number of major airlines? Small.',
        'Cost to start an airline? Huge.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-monopoly-illegal',
      kind: 'misconception_check',
      question: 'Mateo says "monopolies are illegal in the US." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Equating monopoly with illegal practice.',
          correctsTo: 'Wrong. HAVING a monopoly is not illegal per se. ABUSING monopoly power is. Companies that achieve dominance through innovation (e.g., a patented drug) can hold a legitimate monopoly. Antitrust kicks in when firms acquire or maintain dominance through anti-competitive PRACTICES — predatory pricing, exclusive deals, mergers that hurt competition.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four structures: perfect competition, monopolistic competition, oligopoly, monopoly.',
        'Distinguished by: number of firms, product differentiation, barriers.',
        'Perfect competition: ideal but rare.',
        'Monopoly: one firm with pricing power; antitrust laws regulate.',
        'Oligopoly: few firms watching each other.',
        'Most real-world markets are monopolistic competition or oligopoly.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are tech giants (Google, Meta, Apple, Amazon) hard to classify?',
      hint: 'They dominate their markets (look like monopolies), but each faces some competition from the others (Apple vs Google in phones; Amazon vs Walmart in retail). They\'re effectively a NEW form of oligopoly — sometimes called a "tech oligopoly". Antitrust law is updating to address them.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
