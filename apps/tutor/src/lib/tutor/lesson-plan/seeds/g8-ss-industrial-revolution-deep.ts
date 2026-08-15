/**
 * G8 SS — Industrial Revolution (deep).
 *
 * Causes, key inventions, social changes, factory conditions,
 * urbanization, labor movements.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SS_INDUSTRIAL_REVOLUTION_DEEP: LessonPlan = {
  id: 'evelyn.g8.ss.world-history.industrial-revolution-deep.v1',
  title: 'Industrial Revolution (deep)',
  curriculum: 'NCSS',
  grade: '8',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.68.history.industrial-revolution-deep',
      description: 'Analyze causes, key inventions, social impacts, and reform movements of the Industrial Revolution.',
      standard: 'NCSS.D2.His.14.6-8',
    },
  ],
  prerequisites: [],
  followUps: ['ncss.68.history.immigration'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The biggest change in human living since farming.',
      script: 'For 10,000 years after farming was invented, most humans lived on farms doing physical labor. Then in 80 years (1760-1840) Britain transformed: factories, cities, trains, telegraphs. NOW most humans live in cities and work indoors. The Industrial Revolution is the biggest break from how our ancestors lived.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-causes-impacts',
      kind: 'concept',
      goal: 'Why Britain first + key inventions + social transformation + responses.',
      keyIdeas: [
        'WHY BRITAIN FIRST? (1) Coal and iron deposits. (2) Geography: navigable rivers and coastline. (3) Stable government, property rights. (4) Capital from earlier global trade and colonies. (5) Enclosure movement created a wage-labor class.',
        'KEY INVENTIONS:',
        '  STEAM ENGINE (Watt, 1769): power on demand. Drove factories, trains, ships.',
        '  COTTON GIN, SPINNING JENNY, POWER LOOM: revolutionized textiles. Cottage weaving → factory production.',
        '  RAILROADS (~1830s on): cut transportation cost dramatically. Steel, coal, food shipped nationally.',
        '  TELEGRAPH (1840s): instant communication over long distances.',
        '  IRON → STEEL (Bessemer, 1850s): cheaper, stronger.',
        'SOCIAL TRANSFORMATIONS:',
        '  URBANIZATION: people MOVED to factory cities. London quintupled in size 1800-1900.',
        '  FACTORY WORK: long hours (12-16 daily), low wages, dangerous machines, child labor common.',
        '  TENEMENTS: cramped, dirty housing. Cholera outbreaks.',
        '  MIDDLE CLASS expanded: factory owners, managers, professionals.',
        '  WORKING CLASS formed: industrial wage workers separate from agricultural laborers.',
        'RESPONSES / REFORMS:',
        '  LUDDITES: workers smashed machines (early 1800s) — feared job loss.',
        '  LABOR UNIONS formed; strikes for better conditions and pay.',
        '  REFORM LAWS (UK Factory Acts 1833+): limited child labor, set maximum work hours.',
        '  KARL MARX (1848 Communist Manifesto): radical critique of capitalism. Predicted worker revolution.',
        'GLOBAL SPREAD: US (~1820s), Germany, France, then Japan (Meiji, 1868). Today\'s developing economies are still industrializing.',
      ],
      vocabulary: [
        { term: 'industrialization', definition: 'shift from hand production in homes to machines in factories.' },
        { term: 'urbanization', definition: 'movement of population from rural to urban areas.' },
        { term: 'union', definition: 'organized group of workers seeking better wages and conditions.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-britain',
      kind: 'worked_example',
      problem: 'Why did the Industrial Revolution start in Britain rather than France or China?',
      steps: [
        'GEOGRAPHY: rich coal deposits and iron ore close together. Navigable rivers and short distances to coasts.',
        'INSTITUTIONS: stable property rights, parliamentary government, courts that enforced contracts.',
        'CAPITAL: profits from Atlantic trade (including slavery) and colonial empire fueled investment.',
        'AGRICULTURE: enclosure movement consolidated farms, freed up labor for factories.',
        'CULTURE: scientific societies, practical engineering tradition (Watt was a craftsman, not aristocrat).',
        'CHINA had the technology earlier (printing, gunpowder, compass) but bureaucracy discouraged disruptive innovation. France had wealth but instability.',
        'Combination of factors converged in Britain ~1760.',
      ],
      answer: 'coal+iron geography + stable institutions + colonial capital + free labor + scientific culture',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why did labor UNIONS form during the Industrial Revolution?',
      expectedAnswer: 'workers had little individual power against owners; collective bargaining could win better wages, hours, safety',
      responseFormat: 'free',
      hints: [
        'One worker can\'t negotiate against a factory owner.',
        'Many workers TOGETHER (with strike threat) can.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-progress-only',
      kind: 'misconception_check',
      question: 'Was the Industrial Revolution mostly good for ordinary people right away?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating progress as immediately beneficial.',
          correctsTo: 'For roughly the first 50 years, ORDINARY workers\' lives often got WORSE — longer hours, dangerous factories, urban disease, child labor. Living standards rose later (after ~1850), as productivity gains spread and reforms kicked in. The benefits were real but unevenly distributed and slow to reach the poor.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Started Britain ~1760 due to coal/iron + institutions + capital.',
        'Steam engine, textiles, railroads, telegraph, steel were key.',
        'Urbanization + factory conditions reshaped daily life.',
        'Labor unions, reform laws, Marxism arose as responses.',
        'Spread globally; still ongoing in developing world.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Are we in the middle of a "Fourth Industrial Revolution" with AI and robotics?',
      hint: 'Some economists argue yes — AI automation is comparable to past upheavals. Others say it\'s smaller. Like prior transitions: productivity gains likely; but distribution, jobs, and inequality are open questions. History suggests painful adjustments before benefits spread.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
