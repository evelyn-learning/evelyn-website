/**
 * AP World History: Modern — CED Unit 5.7-5.11: Industrial Society.
 *
 * Unit-5 fan-out content plan, fifth and last in the within-unit chain
 * (enlightenment → atlantic-revolutions → nationalism-unification →
 * industrial-revolution → industrial-society). concept = the historical
 * argument (how did urbanization and class formation reshape industrial
 * societies, and what range of responses — reform, unions, socialism,
 * laissez-faire — did those changes provoke?); worked_example = reading
 * Marx and Engels's class analysis as a primary source responding to the
 * same conditions documented in the Sadler Committee testimony;
 * try_yourself = a 3-point SAQ-style short-answer.
 *
 * Anchor texts: Testimony of Matthew Crabtree before the Sadler Committee
 * (1832) — evelyn.passage.apworld-sadler-testimony.v1, wired at the concept
 * segment. MEASURED SELECTION, ENFORCED THROUGHOUT THIS FILE: the seeded
 * excerpt is limited to hours-of-labor and fatigue testimony; the excluded
 * punishment testimony ("beaten," "strapped") is never quoted or closely
 * paraphrased anywhere below (concept, worked example, try-yourself,
 * misconception, recap, metadata).
 *
 * The Communist Manifesto (1848, Moore's 1888 PD trans.) —
 * evelyn.passage.apworld-communist-manifesto.v1, quoted directly in the
 * worked example's problem text (SegmentWorkedExample has no passageId
 * field). The seeded excerpt covers ONLY Section I's bourgeoisie/proletariat
 * "commodity" passage and the closing revolutionary call/"WORKING MEN OF ALL
 * COUNTRIES, UNITE!" — with a large, explicitly marked elision (the entire
 * intervening body of the Manifesto) between them. That gap is treated
 * explicitly below (worked example step 2) and the two excerpted passages
 * are NEVER presented as textually adjacent or as one continuous argument.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U5_INDUSTRIAL_SOCIETY: LessonPlan = {
  id: 'evelyn.ap.apworld.industrial-society.v1',
  title: 'U5.7 Industrial Society',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.industrial-society',
      description:
        'Explain the urbanization and class formation produced by industrialization, the working conditions documented by contemporaries such as the Sadler Committee, and the range of responses (reform legislation, trade unions, the socialism spectrum from utopian to Marxist, and the laissez-faire counterpoint) those conditions provoked.',
      standard: 'AP-APWORLD-5.7',
    },
  ],
  prerequisites: ['apworld.industrial-revolution'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see industrial society\'s new social classes and responses to them as a genuine spectrum of competing answers, not a single reaction.',
      script:
        "Industrialization didn't just change what people made and how — it changed where people lived and what social categories they belonged to. Millions moved from the countryside into fast-growing industrial cities, and a new social map emerged: an industrial bourgeoisie that owned factories and capital, and a much larger industrial proletariat that owned only its own labor, sold by the hour, including the labor of children as young as those testifying before a British parliamentary committee in 1832 about working days stretching to sixteen hours. Different people looked at that same new world and proposed strikingly different fixes: British reformers pushed for a Factory Act limiting child labor hours; workers formed unions to bargain collectively; utopian socialists dreamed up planned cooperative communities; and Karl Marx, writing in 1848, argued the whole system needed to be overthrown, not reformed. This unit is about telling these responses apart.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-industrial-society',
      kind: 'concept',
      goal: "Explain urbanization, class formation, industrial working conditions, and the spectrum of responses (reform, unions, socialism, laissez-faire) they provoked.",
      keyIdeas: [
        'RAPID URBANIZATION: industrialization drove rapid growth of industrial cities (Manchester and London among the most prominent English examples) as rural workers migrated toward factory employment, producing serious overcrowding and inadequate sanitation in many fast-growing industrial districts.',
        'NEW CLASS FORMATION: industrial society reorganized social hierarchy around a new industrial bourgeoisie (factory and business owners, holders of capital) and a much larger industrial proletariat (wage-dependent laborers with no capital of their own), replacing older, status-based estate hierarchies with a class structure defined chiefly by relationship to capital and labor.',
        "WOMEN'S AND CHILD LABOR AND THE SADLER COMMITTEE: factories widely employed women and children at low wages for very long hours; the 1832 British parliamentary Sadler Committee, examining conditions in mills and factories, took direct testimony (including from a worker named Matthew Crabtree) documenting workdays stretching to fourteen or sixteen hours and the resulting fatigue and loss of family time for child laborers.",
        "REFORM RESPONSE — THE FACTORY ACT OF 1833: the Sadler Committee's 1832 testimony fed directly into the British Factory Act of 1833, an early legislative step restricting child labor hours in textile mills — a reform response that worked WITHIN the existing industrial and parliamentary system rather than challenging it.",
        'UNION RESPONSE: industrial workers organized trade unions to bargain collectively over wages and hours, another response that generally sought to improve conditions within the existing economic system rather than replace it, though unions faced significant legal restriction in their early decades.',
        'THE SOCIALISM SPECTRUM — UTOPIAN TO MARXIST: early "utopian" socialists (such as Robert Owen, Charles Fourier, and Henri de Saint-Simon) envisioned small, planned cooperative communities as alternatives to industrial capitalism, generally seeking to persuade rather than to seize power. Karl Marx and Friedrich Engels, in "The Communist Manifesto" (1848), instead analyzed industrial society as built on an inherent, escalating conflict between the bourgeoisie and proletariat and called for the proletariat\'s revolutionary seizure of power — a fundamentally different, revolutionary response from both utopian socialism\'s persuasion-based communities and trade-union/reform-act efforts to improve conditions within the existing system.',
        'THE LAISSEZ-FAIRE COUNTERPOINT: economic liberalism, associated with Adam Smith\'s description of markets coordinating themselves through the pursuit of self-interest (the "invisible hand"), argued for minimal government interference in the economy — a starkly different diagnosis from the socialist critiques above, holding that markets, left alone, would ultimately serve society best.',
      ],
      vocabulary: [
        {
          term: 'industrial proletariat',
          definition:
            "the class of wage-dependent industrial laborers with no capital of their own, whose emergence alongside the industrial bourgeoisie reorganized social hierarchy around relationship to capital and labor.",
        },
        {
          term: 'utopian socialism',
          definition:
            'early socialist thought (Owen, Fourier, Saint-Simon) proposing small, planned cooperative communities as an alternative to industrial capitalism, generally through persuasion rather than the revolutionary seizure of power.',
        },
        {
          term: 'laissez-faire',
          definition:
            "the economic-liberal view (associated with Adam Smith) that markets, left largely free of government interference, coordinate themselves through individual self-interest to serve society best.",
        },
      ],
      passageId: 'evelyn.passage.apworld-sadler-testimony.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-manifesto-vs-sadler',
      kind: 'worked_example',
      problem:
        'Read this excerpt from "The Communist Manifesto" (1848, Samuel Moore\'s 1888 authorized English translation): "The weapons with which the bourgeoisie felled feudalism to the ground are now turned against the bourgeoisie itself. But not only has the bourgeoisie forged the weapons that bring death to itself; it has also called into existence the men who are to wield those weapons—the modern working class—the proletarians. In proportion as the bourgeoisie, i.e., capital, is developed, in the same proportion is the proletariat, the modern working class, developed—a class of labourers, who live only so long as they find work, and who find work only so long as their labour increases capital. These labourers, who must sell themselves piece-meal, are a commodity, like every other article of commerce, and are consequently exposed to all the vicissitudes of competition, to all the fluctuations of the market. ... The Communists disdain to conceal their views and aims. They openly declare that their ends can be attained only by the forcible overthrow of all existing social conditions. Let the ruling classes tremble at a Communistic revolution. The proletarians have nothing to lose but their chains. They have a world to win. WORKING MEN OF ALL COUNTRIES, UNITE!" How does Marx and Engels\'s opening class analysis relate to the conditions documented in the Sadler Committee testimony, and what should a careful reader do with the gap between these two excerpted passages?',
      steps: [
        "SOURCE IT FIRST. Marx and Engels published \"The Communist Manifesto\" in 1848, quoted here in Samuel Moore's authorized 1888 English translation. It is a political pamphlet making an explicit argument, not a neutral description — read it as Marx and Engels's own analysis and call to action, not as disinterested reporting.",
        'IDENTIFY THE OPENING CLAIM. The excerpt opens by arguing the bourgeoisie itself "called into existence" the modern working class as the very weapon that would eventually be "turned against the bourgeoisie itself," then argues that industrial capitalism structurally reduces those laborers to a "commodity" — people who "live only so long as they find work" and who "must sell themselves piece-meal," exposed to market "fluctuations" exactly as any traded good would be. This is a claim about the underlying LOGIC of the wage-labor relationship, not a description of any one factory.',
        'MARK THE GAP HONESTLY — DO NOT TREAT THE TWO EXCERPTS AS ADJACENT. A large, unquoted portion of the Manifesto\'s argument falls between the opening "commodity" passage and the closing call to action ("nothing to lose but their chains... WORKING MEN OF ALL COUNTRIES, UNITE!"). A careful reader states plainly that these are two separate excerpted passages from the same document, not two adjacent sentences, and does not fill in or assume the content of the elided middle portion.',
        "CONNECT THE OPENING CLAIM TO THE SADLER CONDITIONS. The Sadler Committee testimony documents concrete instances of exactly the wage-dependence Marx and Engels describe abstractly: a worker (Matthew Crabtree) testifying to workdays of fourteen to sixteen hours and resulting fatigue is a specific, individual case of a laborer whose work and wages depend entirely on continuing to find work, the general condition the Manifesto's opening passage analyzes at the level of the whole system.",
        "STATE THE LINK TO THE COURSE THESIS. Reading the Manifesto's opening passage alongside the Sadler testimony shows Marx and Engels responding, in 1848, to the same kind of documented conditions Sadler recorded in 1832 — but proposing a fundamentally different remedy (the closing call to revolutionary action) than the era's other responses (the 1833 Factory Act's incremental reform, or trade unions bargaining within the existing system).",
      ],
      answer:
        'Marx and Engels\'s opening passage argues that industrial capitalism structurally reduces laborers to a "commodity" — dependent on continually finding work and exposed to market "fluctuations" like any traded good — a claim about the underlying logic of wage labor, not a description of one specific workplace. A large, unquoted portion of the Manifesto\'s own argument falls between this opening passage and its closing call to action ("nothing to lose but their chains... WORKING MEN OF ALL COUNTRIES, UNITE!"); a careful reader treats these as two separate excerpted passages from the same 1848 document, never as adjacent sentences, and does not assume the content of what was elided between them. The Sadler Committee testimony (1832) supplies a concrete, individual instance of exactly the wage-dependence Marx and Engels describe abstractly — Matthew Crabtree\'s testimony to fourteen-to-sixteen-hour workdays and resulting fatigue is a specific case of the general condition the Manifesto\'s opening passage analyzes at the level of the whole economic system. Read together, the two documents show Marx and Engels responding, in 1848, to the same kind of conditions Sadler had documented in 1832 — but proposing revolutionary overthrow, not the incremental reform (the 1833 Factory Act) or union bargaining that were the era\'s other responses to the same conditions.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Identify ONE way industrial factories relied on the labor of women or children. (b) Explain ONE reform or union response to industrial working conditions. (c) Explain ONE way Marx and Engels's proposed response differed from trade-union reform or utopian socialism.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): correctly identifies ONE genuine way factories relied on women's or children's labor — e.g. long workdays (fourteen to sixteen hours, per testimony such as the Sadler Committee's) at low wages. No credit for a vague or unsupported claim, and no credit that relies on quoting or closely paraphrasing punishment/physical-discipline testimony (not part of the assigned record).",
            modelResponse:
              'Industrial textile factories widely employed children for very long workdays — fourteen to sixteen hours, according to testimony taken before the 1832 Sadler Committee — at low wages, leaving little time for rest or family life.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate reform or union response — e.g. the Factory Act of 1833 restricting child labor hours, or workers organizing trade unions to bargain collectively over wages and hours. No credit for a vague or unconnected claim.',
            modelResponse:
              "The British Factory Act of 1833, which followed directly from the Sadler Committee's 1832 testimony, restricted child labor hours in textile mills — a reform achieved within the existing parliamentary and industrial system.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate difference — e.g. Marx and Engels called for revolutionary overthrow of the capitalist system itself, while trade unions and reform acts sought to improve conditions within the existing system, and utopian socialists sought change through persuasion and small planned communities rather than revolution. No credit for a vague or unsupported claim.',
            modelResponse:
              "Unlike trade unions and reform legislation (such as the 1833 Factory Act), which sought to improve conditions within the existing industrial and parliamentary system, and unlike utopian socialists, who sought change through persuasion and small planned cooperative communities, Marx and Engels's Communist Manifesto (1848) called for the proletariat's revolutionary seizure of power and the overthrow of the capitalist system itself.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-marxism-equals-union-reform',
      kind: 'misconception_check',
      question:
        'True or false: Marxism and trade-union/reform-act responses to industrial conditions were essentially the same thing.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating all responses to harsh industrial conditions as one undifferentiated "labor movement," and overlooking the sharp difference between reform-minded responses working within the existing system and Marx and Engels\'s revolutionary call to overthrow it.',
          correctsTo:
            "FALSE. Trade unions and reform legislation (such as the Factory Act of 1833, which followed the Sadler Committee's 1832 testimony) sought to improve wages, hours, and conditions WITHIN the existing capitalist and parliamentary system. Marx and Engels's Communist Manifesto (1848), by contrast, argued the capitalist system itself was structurally exploitative and called for its revolutionary overthrow by the proletariat — a fundamentally different, and often rival, response to the same underlying industrial conditions, not a version of the same reform movement.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Industrialization drove rapid urbanization and reorganized social hierarchy around a new industrial bourgeoisie and a much larger industrial proletariat.',
        "The 1832 Sadler Committee documented industrial child labor conditions — workdays of fourteen to sixteen hours and resulting fatigue — feeding directly into the Factory Act of 1833.",
        'Trade unions and reform legislation (the Factory Act) sought improvement within the existing system; utopian socialists (Owen, Fourier, Saint-Simon) sought change through persuasion and small planned communities.',
        "Marx and Engels's Communist Manifesto (1848) analyzed industrial capitalism as structurally reducing labor to a \"commodity\" and called for the proletariat's revolutionary overthrow of the system — a fundamentally different response from reform or utopian socialism.",
        'Laissez-faire economic liberalism (associated with Adam Smith) argued markets, left largely free of government interference, would serve society best — the opposite diagnosis from the socialist critiques.',
        'Marxism and trade-union/reform-act responses were different, often rival, responses to the same industrial conditions — not the same movement.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.7-5.11',
    cedTitle: 'Industrial Society',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-sadler-testimony.v1',
        chapter: '1832',
        note: 'Testimony of Matthew Crabtree Before the Sadler Committee — anchor document for industrial child-labor conditions (hours/fatigue only, per that seed\'s measured selection).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-communist-manifesto.v1',
        chapter: '1848',
        note: "Marx and Engels, The Communist Manifesto (Moore's 1888 PD trans.) — quoted directly in the worked example as a primary source responding to Sadler-class conditions; the two excerpted passages are separated by a large marked elision, never presented as adjacent.",
      },
    ],
  },
};
