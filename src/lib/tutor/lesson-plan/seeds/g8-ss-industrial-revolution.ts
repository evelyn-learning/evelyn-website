/**
 * G8 — Social Studies: Industrial Revolution.
 *
 * The transformation from hand production to machines, beginning in
 * 18th-century Britain. Steam engine, factory system, urbanization,
 * railroads, telegraph. Massive social change: working class,
 * child labor, growth of cities, beginning of modern capitalism.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SS_INDUSTRIAL_REVOLUTION: LessonPlan = {
  id: 'evelyn.g8.ss.industrial-revolution.v1',
  title: 'The Industrial Revolution',
  curriculum: 'state-standards',
  grade: '8',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ss.g8.world.industrial',
      description: 'Describe causes, technologies, and social effects of the Industrial Revolution.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show how dramatically life changed.',
      script: 'In 1750, almost everything was made by hand at home. Most people farmed. Travel speed maxed at horse pace. By 1900 — just 150 years later — factories cranked out goods, trains crossed continents, telegraphs sent messages instantly, and most people lived in cities. The Industrial Revolution may be the single biggest shift in how humans live since the invention of agriculture.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-industrial',
      kind: 'concept',
      goal: 'Causes, key technologies, social effects, downsides.',
      keyIdeas: [
        'STARTED in BRITAIN in the late 1700s. Why Britain?',
        '  Resources: coal and iron deposits.',
        '  Capital: profits from trade and colonies.',
        '  Labor: enclosure movement pushed farmers to cities.',
        '  Stable government + protected property rights.',
        'KEY TECHNOLOGIES:',
        '  STEAM ENGINE (improved by James WATT, ~1769): mechanical power from coal heat. Drove factories, then trains, then ships.',
        '  TEXTILE MACHINES: spinning jenny, water frame, power loom — turned cloth-making from cottage craft into factory output.',
        '  RAILROADS: first commercial line ~1825. Cut travel and shipping time dramatically.',
        '  TELEGRAPH (~1840s): instant long-distance communication for the first time.',
        '  Later — STEEL (cheap mass production by ~1860s), ELECTRICITY, INTERNAL COMBUSTION ENGINE.',
        'SOCIAL EFFECTS:',
        '  URBANIZATION: people moved from farms to cities for factory jobs. Cities like Manchester grew tenfold.',
        '  WORKING CLASS / proletariat: a new social class of factory workers.',
        '  CHILD LABOR: kids as young as 5 worked in mines and factories. Eventually reformed.',
        '  WORKING CONDITIONS: long hours, dangerous machinery, low pay. Spawned LABOR UNIONS and reform movements.',
        '  POLLUTION: coal smoke darkened cities; rivers polluted by industry.',
        '  CAPITALISM: factories owned by capitalists who hired wage labor. Adam Smith\'s "Wealth of Nations" (1776) provided economic theory.',
        '  Eventually a counter-movement: SOCIALISM (Karl Marx, "Communist Manifesto" 1848) critiqued industrial capitalism.',
        'GLOBAL EFFECTS: Britain led, then spread to Western Europe, USA, eventually Japan. Industrialized countries built empires partly to secure raw materials and markets — fueled the New Imperialism.',
      ],
      vocabulary: [
        { term: 'Industrial Revolution', definition: 'the shift from hand production to machines starting in late-1700s Britain.' },
        { term: 'urbanization', definition: 'the movement of people from rural to urban areas.' },
        { term: 'factory system', definition: 'manufacturing concentrated in large buildings using powered machinery.' },
        { term: 'capitalism', definition: 'an economic system based on private ownership and free markets.' },
      ],
      suggestedTools: ['show_concept_map', 'show_timeline'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-causes',
      kind: 'worked_example',
      problem: 'List four reasons the Industrial Revolution started in Britain rather than elsewhere.',
      steps: [
        '1) NATURAL RESOURCES: huge coal and iron deposits.',
        '2) CAPITAL: wealth from colonial trade gave investors money to fund inventions and factories.',
        '3) LABOR: the Enclosure Movement consolidated farmland; displaced rural workers moved to cities looking for jobs.',
        '4) POLITICAL STABILITY: Britain had stable government, protected property rights, and patent laws encouraging invention.',
        '(Bonus: a culture of scientific curiosity from the Royal Society + Newton.)',
      ],
      answer: 'Resources, capital, labor, stable institutions',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How did the steam engine change manufacturing?',
      expectedAnswer: 'Provided steady mechanical power independent of location (no need for water flow), enabling factories to be built anywhere and run anytime.',
      responseFormat: 'free',
      hints: [
        'Before steam engines, factories needed water wheels — meaning they had to be on rivers.',
        'Steam removed that constraint.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-purely-good',
      kind: 'misconception_check',
      question: 'Sage says "the Industrial Revolution was purely a good thing — it made everyone richer." What\'s missing?',
      commonErrors: [
        {
          answer: 'true — life improved overall',
          misconception: 'Treating long-term gains as if they applied evenly to everyone immediately.',
          correctsTo: 'Long-term, productivity rose dramatically. SHORT-term, factory workers often had WORSE lives than farmers — long hours, dangerous conditions, child labor, urban slums, no labor protections. Living standards for ordinary workers may have actually DECLINED for the first 50-100 years before reforms and rising wages caught up. Always ask "for whom" when claiming a development was good.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Started in Britain ~1760-1840; spread globally.',
        'Key tech: steam engine, textile machines, railroads, telegraph, later steel/electricity.',
        'Social effects: urbanization, working class, child labor, pollution.',
        'Capitalism formalized; socialism arose as critique.',
        'Long-term: massive productivity gains. Short-term: hard on workers.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did the Industrial Revolution lead to the New Imperialism (1870s-1914)?',
      hint: 'Industrialized countries needed raw materials (rubber, cotton, oil) and new markets to absorb factory output. They competed to colonize Africa and Asia. Industrial-grade weapons (Maxim gun) made it militarily one-sided.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
