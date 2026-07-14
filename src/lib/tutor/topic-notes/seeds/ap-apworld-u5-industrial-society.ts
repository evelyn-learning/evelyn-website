/**
 * AP World History — Unit 5 CED 5.7-5.11: Industrial Society.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.industrial-society.v1`. Covers urbanization, class
 * formation, industrial working conditions (Sadler Committee, 1832), and
 * the spectrum of responses (Factory Act, unions, utopian/Marxist
 * socialism, laissez-faire). CRITICAL: Sadler-related content below is
 * limited to hours-of-labor/fatigue testimony (per that seed's measured
 * selection) — the excluded punishment testimony is never quoted or
 * closely paraphrased anywhere in this file.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_INDUSTRIAL_SOCIETY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.industrial-society.v1',
  course: 'AP World History: Modern',
  cedUnit: 5,
  cedTopic: '5.7-5.11',
  cedTitle: 'Industrial Society',
  planId: 'evelyn.ap.apworld.industrial-society.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.industrial-society.v1' }],
  theory: [
    {
      loId: 'apworld.industrial-society',
      kind: 'definition',
      title: 'industrial proletariat',
      content:
        'The class of wage-dependent industrial laborers with no capital of their own, whose emergence alongside the industrial bourgeoisie reorganized social hierarchy around relationship to capital and labor.',
    },
    {
      loId: 'apworld.industrial-society',
      kind: 'definition',
      title: 'utopian socialism',
      content:
        'Early socialist thought (Owen, Fourier, Saint-Simon) proposing small, planned cooperative communities as an alternative to industrial capitalism, generally through persuasion rather than the revolutionary seizure of power.',
    },
    {
      loId: 'apworld.industrial-society',
      kind: 'definition',
      title: 'laissez-faire',
      content:
        "The economic-liberal view (associated with Adam Smith) that markets, left largely free of government interference, coordinate themselves through individual self-interest to serve society best.",
    },
    {
      loId: 'apworld.industrial-society',
      kind: 'event',
      title: 'urbanization and class formation',
      content:
        'Industrialization drove rapid growth of industrial cities (Manchester, London prominent examples), producing overcrowding and inadequate sanitation, and reorganized social hierarchy around an industrial bourgeoisie (capital owners) and a much larger industrial proletariat (wage laborers).',
    },
    {
      loId: 'apworld.industrial-society',
      kind: 'event',
      title: 'Sadler Committee testimony (1832)',
      content:
        'The British parliamentary Sadler Committee took testimony (including from Matthew Crabtree) documenting industrial workdays stretching to fourteen or sixteen hours and the resulting fatigue and loss of family time for child laborers — hours/fatigue testimony only, per the seed\'s measured selection.',
    },
    {
      loId: 'apworld.industrial-society',
      kind: 'event',
      title: 'Factory Act of 1833',
      content:
        "The Sadler Committee's 1832 testimony fed directly into the British Factory Act of 1833, an early legislative step restricting child labor hours in textile mills — a reform response working within the existing system.",
    },
    {
      loId: 'apworld.industrial-society',
      kind: 'event',
      title: 'trade unions',
      content:
        'Industrial workers organized trade unions to bargain collectively over wages and hours, another within-system response, though unions faced significant legal restriction in their early decades.',
    },
    {
      loId: 'apworld.industrial-society',
      kind: 'event',
      title: "Marx and Engels's Communist Manifesto (1848)",
      content:
        'Marx and Engels analyzed industrial society as built on an inherent, escalating conflict between the bourgeoisie and proletariat, describing labor as reduced to a "commodity," and called for the proletariat\'s revolutionary seizure of power — a fundamentally different response from reform or utopian socialism.',
    },
    {
      loId: 'apworld.industrial-society',
      kind: 'framework',
      title: 'the socialism spectrum',
      content:
        'Utopian socialists (Owen, Fourier, Saint-Simon) sought change through persuasion and small planned communities; Marx and Engels sought revolutionary overthrow of the capitalist system itself — two distinct points on a spectrum, not the same response.',
    },
    {
      loId: 'apworld.industrial-society',
      kind: 'trap',
      title: 'Marxism is not the same as trade-union reform',
      content:
        'Trade unions and reform legislation (Factory Act 1833) sought improvement within the existing capitalist/parliamentary system; Marx and Engels called for its revolutionary overthrow — a fundamentally different, often rival, response to the same conditions.',
    },
  ],
  methods: [
    {
      title: 'Read a primary-source class analysis alongside a documentary-evidence source, respecting a marked elision',
      when_to_use:
        'Use this when reading the Communist Manifesto\'s opening class analysis alongside the Sadler Committee testimony, or any time a source excerpt has a large marked elision between two quoted spans.',
      steps: [
        'Source each document separately (a political pamphlet making an argument vs. parliamentary testimony documenting specific conditions).',
        'Identify the abstract/systemic claim (Manifesto: labor reduced to a "commodity") versus the concrete/individual evidence (Sadler: one worker\'s hours and fatigue).',
        'If a large elision separates two excerpted spans of the same document, state that explicitly — never treat them as adjacent or assume the elided content.',
        "Connect the individual evidence to the systemic claim, then state each source's proposed remedy separately (reform vs. revolution) — do not merge them.",
      ],
      example: {
        problem:
          "The Manifesto's opening \"commodity\" passage and its closing revolutionary call are separated by a large unquoted portion. How should this be handled?",
        solution:
          'State plainly that these are two separate excerpted passages from the same 1848 document, not adjacent sentences, and do not assume or fill in the elided middle content.',
      },
      relatedLoIds: ['apworld.industrial-society'],
    },
  ],
  pointers: [
    { content: 'NEVER quote or closely paraphrase the Sadler testimony\'s punishment content ("beaten," "strapped") — the seeded excerpt is hours-of-labor/fatigue ONLY.', kind: 'gotcha' },
    { content: 'The Manifesto excerpt has a LARGE marked gap between the opening "commodity" passage and the closing call to action — never present them as adjacent or as one continuous argument.', kind: 'gotcha' },
    { content: 'Marxism and trade-union/reform-act responses are DIFFERENT, often rival, responses to industrial conditions — this is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'Utopian socialism (persuasion, small planned communities) vs. Marxism (revolutionary overthrow) — keep these two ends of the socialism spectrum distinct.', kind: 'tip' },
    { content: 'The Factory Act of 1833 directly followed the Sadler Committee\'s 1832 testimony — keep the one-year sequence straight on an FRQ.', kind: 'tip' },
  ],
};
