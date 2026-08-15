/**
 * AP World History: Modern — CED Unit 5.3-5.6: The Industrial Revolution.
 *
 * Unit-5 fan-out content plan, fourth in the within-unit chain
 * (enlightenment → atlantic-revolutions → nationalism-unification →
 * industrial-revolution → industrial-society). No passage is wired here per
 * the unit spec — the teaching point is a structural comparison (First vs.
 * Second Industrial Revolution) built from the concept's own facts rather
 * than a primary-source analysis. concept = the historical argument (what
 * combination of factors let Britain industrialize first, and how did the
 * technologies and geography of industrialization change between the First
 * and Second Industrial Revolutions?); worked_example = a structured
 * comparison exercise; try_yourself = a 3-point SAQ-style short-answer.
 *
 * Prerequisite note: `apworld.columbian-exchange-global` (Unit 4) is wired
 * as a prerequisite because the concept's "coal, capital, colonies"
 * resource framing depends on the colonial wealth/silver-circuit argument
 * established there.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U5_INDUSTRIAL_REVOLUTION: LessonPlan = {
  id: 'evelyn.ap.apworld.industrial-revolution.v1',
  title: 'U5.3 The Industrial Revolution',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.industrial-revolution',
      description:
        'Explain why Britain industrialized first (coal, capital, colonies, agricultural revolution, water transport), the rise of the factory system and railroads, the spread of industrialization to Belgium, Germany, the United States, and Japan, and the technological shift of the Second Industrial Revolution.',
      standard: 'AP-APWORLD-5.3',
    },
  ],
  prerequisites: ['apworld.nationalism-unification', 'apworld.columbian-exchange-global'],
  followUps: ['apworld.industrial-society'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see British industrialization as the product of a specific, coincidental combination of factors, not an inevitable or purely technological story.',
      script:
        "Why did the Industrial Revolution start in Britain, of all places, in the late 1700s? It's tempting to answer with a single invention — the steam engine — and leave it there. But Britain had something no single invention explains: large, accessible coal deposits sitting close to iron ore and to port cities; centuries of accumulated trading and colonial capital looking for somewhere to invest; a captive colonial market and source of raw materials (cotton from its colonies and, later, the American South); an agricultural revolution already underway that freed up rural labor and fed a growing urban workforce; and a dense network of rivers and canals to move heavy goods cheaply. Watt's improved steam engine mattered — but it landed on top of all of that, not into a vacuum. This unit traces how that specific combination made Britain first, and how the technologies of industrialization then changed again, decades later, in a \"Second\" Industrial Revolution built on steel, chemicals, and electricity.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-industrial-revolution',
      kind: 'concept',
      goal: 'Explain the combination of factors behind British industrial primacy, the factory system, railroads, the spread of industrialization, and the shift to a Second Industrial Revolution.',
      keyIdeas: [
        'WHY BRITAIN FIRST — COAL, CAPITAL, COLONIES, AGRICULTURE, TRANSPORT: Britain combined large, accessible coal deposits (fuel for steam power and metalworking); substantial accumulated capital from earlier trade and colonial wealth (including the silver-linked global trade circuits already studied); colonial markets and raw materials (notably cotton); an agricultural revolution (enclosure of common land, crop rotation, selective livestock breeding) that raised food output while freeing rural labor to move to industrial towns; and an existing network of rivers and canals for cheap, heavy-goods transport. No other economy of the period combined all five factors as completely.',
        "WATT'S STEAM ENGINE AND THE FACTORY SYSTEM: James Watt's much-improved steam engine (patented 1769) made steam power practical well beyond pumping water out of mines, enabling mechanized textile production — the spinning jenny, water frame, and power loom mechanized spinning and weaving that had previously been done by hand in individual homes (the \"putting-out\" system). This drove the rise of the factory system: wage laborers concentrated under one roof, working machine-paced shifts, rather than working piecework at home on their own schedule.",
        'RAILROADS TRANSFORM TRANSPORT: the Stockton and Darlington Railway (1825) and the Liverpool and Manchester Railway (1830) were early landmark steam railroads, dramatically cutting the cost and time of moving goods and people overland and creating enormous new demand for iron, coal, and (later) steel — railroads became both a product of industrialization and a further engine driving it.',
        'INDUSTRIALIZATION SPREADS: Belgium industrialized early among continental European states, given its own coal deposits and proximity to British capital and technology. Germany industrialized rapidly especially after unification (1871), building heavy industry (coal, steel) and large industrial cartels. The United States industrialized rapidly especially after the Civil War, exploiting its own vast coal and iron resources and growing domestic market. Japan pursued deliberate, state-led industrialization after the Meiji Restoration (from 1868), viewing rapid industrial and military modernization as necessary to avoid the fate of colonized states elsewhere in Asia.',
        'THE SECOND INDUSTRIAL REVOLUTION (FROM c. 1870): a second wave of industrial technologies — the Bessemer process for mass-producing steel, industrial chemicals, and electricity — transformed industrial economies again from around 1870 onward, enabling larger-scale factories, new industries, and further shifts in which countries (notably Germany and the United States) led global industrial output.',
      ],
      vocabulary: [
        {
          term: 'factory system',
          definition:
            'the concentration of wage laborers under one roof working machine-paced shifts, replacing the earlier "putting-out" system of home-based piecework production.',
        },
        {
          term: 'Second Industrial Revolution',
          definition:
            'the wave of industrial technologies from roughly 1870 onward — mass-produced steel (Bessemer process), industrial chemicals, and electricity — that transformed industrial economies again after the first, textile-and-steam-driven wave.',
        },
        {
          term: 'agricultural revolution',
          definition:
            "the pre-industrial British transformation of farming (enclosure of common land, crop rotation, selective livestock breeding) that raised food output and freed rural labor to move into industrial towns.",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-first-vs-second-industrial-revolution',
      kind: 'worked_example',
      problem:
        'Compare the First Industrial Revolution (Britain, from the late 1700s: mechanized textile production via the spinning jenny/water frame/power loom, Watt\'s improved steam engine of 1769, and early railroads from 1825) with the Second Industrial Revolution (from roughly 1870: mass-produced steel via the Bessemer process, industrial chemicals, and electricity, with Germany and the United States among the leading producers). What changed between the two waves, and what stayed the same?',
      steps: [
        "IDENTIFY WHAT STAYED THE SAME. Both waves were driven by new industrial technologies transforming production and enabling the factory system; both drove new demand for raw materials (coal, iron, later steel) and new transport infrastructure; and both reorganized labor around concentrated, wage-based factory work rather than home-based production.",
        "IDENTIFY THE TECHNOLOGY SHIFT. The First Industrial Revolution centered on TEXTILES and STEAM: mechanized spinning and weaving, and steam power derived chiefly from coal. The Second Industrial Revolution centered on STEEL, CHEMICALS, and ELECTRICITY: the Bessemer process allowed steel — stronger and more versatile than iron — to be mass-produced cheaply, while new chemical industries and electrical power opened entirely new sectors the first wave hadn't touched.",
        'IDENTIFY THE GEOGRAPHIC SHIFT. Britain led decisively during the First Industrial Revolution, given its unique combination of coal, capital, colonies, agricultural surplus, and water transport. By the Second Industrial Revolution, Germany (industrializing rapidly after 1871 unification) and the United States (especially after its Civil War) had caught up to and, in some measures, overtaken British industrial output — showing that British primacy in the first wave did not guarantee permanent leadership.',
        "CONNECT TO THE CONCEPT'S BROADER CLAIM. The shift from the First to the Second Industrial Revolution shows industrialization was not a single fixed event but an ongoing, evolving process — new technologies (steel, chemicals, electricity) opened opportunities for new leading economies (Germany, the U.S.) that Britain's earlier coal-and-textile advantage did not permanently lock in.",
        'STATE THE LINK TO THE COURSE THESIS. Britain\'s specific combination of coal, capital, colonies, agricultural revolution, and water transport explains why it industrialized FIRST — but the later shift to steel, chemicals, and electricity, led increasingly by Germany and the United States, shows that early industrial leadership was not permanent or guaranteed.',
      ],
      answer:
        "Both waves shared a core pattern — new industrial technology driving the factory system, new raw-material demand, and new transport infrastructure — but differed sharply in technology and geography. The First Industrial Revolution centered on textiles and steam power (mechanized spinning/weaving, Watt's 1769 steam engine, railroads from 1825), with Britain uniquely positioned by its combination of coal, capital, colonies, agricultural surplus, and water transport. The Second Industrial Revolution (from roughly 1870) centered on steel (the Bessemer process), industrial chemicals, and electricity — technologies that opened new opportunities exploited especially by Germany (industrializing rapidly after its 1871 unification) and the United States (especially after its Civil War), both of which caught up to or surpassed Britain in key measures of industrial output. The overall lesson: Britain's specific combination of factors explains why it industrialized first, but the later technological shift shows early industrial leadership was not permanent.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE factor that helped Britain industrialize first. (b) Explain ONE difference between the First and Second Industrial Revolutions. (c) Explain ONE way industrialization spread from Britain to another named country (Belgium, Germany, the United States, or Japan).',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): correctly identifies ONE genuine factor behind British industrial primacy — e.g. accessible coal deposits, accumulated trade/colonial capital, colonial markets/raw materials, the agricultural revolution, or existing water transport (rivers/canals). No credit for a vague or unsupported claim.",
            modelResponse:
              "One factor that helped Britain industrialize first was its access to large, easily minable coal deposits located close to iron ore and port cities, providing cheap fuel for steam power and metalworking.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate difference between the two waves — e.g. First (textiles/steam, Britain-led) versus Second (steel/chemicals/electricity, Germany/U.S.-led). No credit for a vague or unconnected claim.',
            modelResponse:
              "The First Industrial Revolution centered on mechanized textile production and steam power, led by Britain, while the Second Industrial Revolution (from roughly 1870) centered on mass-produced steel, industrial chemicals, and electricity, with Germany and the United States emerging as leading industrial producers.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way industrialization spread to ONE named country — e.g. Belgium\'s early coal-based industrialization, Germany\'s post-1871 heavy industry, the U.S.\'s post-Civil War industrial growth, or Japan\'s Meiji-era (from 1868) state-led industrialization. No credit for a vague or unsupported claim.',
            modelResponse:
              'After the Meiji Restoration (from 1868), the Japanese state deliberately pursued rapid, state-led industrialization and military modernization, aiming to avoid the fate of territories elsewhere in Asia that had come under direct European colonial control.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-immediate-improvement',
      kind: 'misconception_check',
      question:
        "True or false: industrialization improved most workers' lives immediately once factories were established.",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Assuming that because industrialization eventually raised long-run living standards, it must have improved conditions for the factory workers of the First Industrial Revolution's early decades as well — collapsing a long-run outcome into an immediate one.",
          correctsTo:
            "FALSE. In the decades immediately following the rise of the factory system, conditions for many industrial workers were harsh: long hours, dangerous unguarded machinery, and extensive reliance on low-paid women's and children's labor were common, and rapid, unplanned urban growth produced overcrowded, unsanitary industrial cities. Clear, sustained improvement in ordinary workers' living standards mostly came later, through factors including labor organizing, reform legislation, and rising wages — not as an automatic, immediate byproduct of industrialization itself.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Britain industrialized first through a specific combination: accessible coal, accumulated capital, colonial markets/raw materials, the agricultural revolution, and existing water transport.",
        "Watt's improved steam engine (1769) enabled mechanized textile production and the rise of the factory system, replacing home-based \"putting-out\" production.",
        "Early railroads (Stockton and Darlington, 1825; Liverpool and Manchester, 1830) transformed transport and drove further demand for iron, coal, and steel.",
        'Industrialization spread to Belgium, Germany (especially after 1871 unification), the United States (especially after its Civil War), and Japan (Meiji-era state-led industrialization from 1868).',
        'The Second Industrial Revolution (from roughly 1870: steel via the Bessemer process, chemicals, electricity) shifted industrial leadership increasingly toward Germany and the United States.',
        "Industrialization did not immediately improve most workers' lives — early factory conditions were often harsh; sustained improvement came later.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.3-5.6',
    cedTitle: 'The Industrial Revolution',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP World History' }],
  },
};
