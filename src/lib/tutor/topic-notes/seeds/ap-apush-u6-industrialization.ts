/**
 * AP US History — Unit 6 CED 6.4-6.6: Industrialization and Big Business.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.industrialization-big-business.v1`. Covers vertical vs.
 * horizontal integration (steel/oil/rail), Social Darwinism vs. the
 * Gospel of Wealth, and laissez-faire courts/weak antitrust enforcement —
 * anchored by Andrew Carnegie's "Wealth" (1889).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_INDUSTRIALIZATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.industrialization-big-business.v1',
  course: 'AP United States History',
  cedUnit: 6,
  cedTopic: '6.4-6.6',
  cedTitle: 'Industrialization and Big Business',
  planId: 'evelyn.ap.apush.industrialization-big-business.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.industrialization-big-business.v1' }],
  theory: [
    {
      loId: 'apush.industrialization-big-business',
      kind: 'definition',
      title: 'vertical integration',
      content:
        'A business strategy of controlling every STAGE of production for a good, from raw materials to finished product. Carnegie Steel\'s dominant strategy (mines, ore transport, mills).',
    },
    {
      loId: 'apush.industrialization-big-business',
      kind: 'definition',
      title: 'horizontal integration',
      content:
        'A business strategy of consolidating competing firms at the SAME stage of production under one company\'s control. Standard Oil\'s dominant strategy (buying out competing refineries). Both Carnegie and Rockefeller used elements of both strategies at times — "Carnegie = vertical / Rockefeller = horizontal" describes each man\'s dominant, best-known approach, not an absolute rule.',
    },
    {
      loId: 'apush.industrialization-big-business',
      kind: 'definition',
      title: 'Social Darwinism',
      content:
        'A social theory (Herbert Spencer, popularized in the U.S. by William Graham Sumner) applying "survival of the fittest" to economic competition: wealth reflects natural fitness, and government should not interfere with market outcomes (including opposing charity or regulation).',
    },
    {
      loId: 'apush.industrialization-big-business',
      kind: 'definition',
      title: 'Gospel of Wealth',
      content:
        'Andrew Carnegie\'s 1889 argument that the wealthy, having earned their fortune through competition, are strictly duty-bound to administer their surplus as a "trust fund" for the community\'s benefit during their own lifetime — a DUTY TO REDISTRIBUTE, not a defense of unlimited accumulation.',
    },
    {
      loId: 'apush.industrialization-big-business',
      kind: 'framework',
      title: 'Social Darwinism vs. Gospel of Wealth — the key distinction',
      content:
        'Both come from wealthy industrialists in the same era, but they are NOT the same position. Social Darwinism: the wealthy owe society nothing further, having won fair competition. Gospel of Wealth: the wealthy, having won that competition, then owe a duty to give much of it back as trustees. Carnegie personally funded thousands of public libraries and universities on this reasoning.',
    },
    {
      loId: 'apush.industrialization-big-business',
      kind: 'event',
      title: 'Carnegie, "Wealth" (North American Review, 1889)',
      content:
        'The seeded excerpt is the essay\'s "duty of the man of Wealth" paragraph: after modest living and providing for dependents, all surplus is a "trust fund" the wealthy are "strictly bound as a matter of duty to administer" for the community\'s benefit, acting as "agent and trustee." This excerpt does NOT contain the essay\'s earlier Social-Darwinist-adjacent defense of accumulation — attribute only the duty/trustee argument to this specific passage.',
    },
    {
      loId: 'apush.industrialization-big-business',
      kind: 'law',
      title: 'laissez-faire courts and weak antitrust enforcement',
      content:
        'Wabash v. Illinois (1886) limited states\' power to regulate interstate rail rates, prompting the Interstate Commerce Act (1887). The Sherman Antitrust Act (1890) banned monopolistic combinations "in restraint of trade," but United States v. E.C. Knight Co. (1895) read "commerce" narrowly enough to exclude manufacturing monopolies (e.g. sugar refining), leaving most large industrial combinations largely undisturbed through the 1890s.',
    },
    {
      loId: 'apush.industrialization-big-business',
      kind: 'event',
      title: 'railroads as the enabling industry',
      content:
        'Railroads supplied the transportation network big business depended on, consolidated into a small number of powerful trunk lines by the 1880s, and pioneered large-scale corporate financing and management hierarchies other industries later copied.',
    },
  ],
  methods: [
    {
      title: 'Distinguish Social Darwinism from the Gospel of Wealth in a source',
      when_to_use:
        'Use this whenever a Gilded Age industrialist source discusses wealth, inequality, or the wealthy\'s obligations, before assuming it defends unlimited accumulation.',
      steps: [
        'Identify WHO is speaking and their material interest in the argument (a wealthy industrialist defending or qualifying their own position).',
        'Find the specific claim about what happens to wealth AFTER it is earned: does the source say the wealthy owe nothing further (Social Darwinism), or that they owe an ongoing duty to redistribute (Gospel of Wealth)?',
        'Check for "duty," "bound," or "trust/trustee" language — these signal the Gospel of Wealth\'s redistribution argument specifically.',
        'Attribute only what the SPECIFIC excerpt argues — a source can defend inequality earned through competition in one passage and argue a redistribution duty in another; do not import claims from parts of the essay you have not read.',
      ],
      example: {
        problem:
          'Carnegie\'s "Wealth" (1889): "...all surplus revenues which come to him simply as trust funds, which he is called upon to administer... strictly bound as a matter of duty..."',
        solution:
          'The "trust fund"/"strictly bound as a matter of duty" language identifies this as the Gospel of Wealth\'s redistribution argument, not a Social Darwinist defense of simply keeping accumulated wealth.',
      },
      relatedLoIds: ['apush.industrialization-big-business'],
    },
  ],
  pointers: [
    { content: 'Do NOT say Carnegie\'s "Wealth" defends unlimited accumulation — the seeded excerpt argues a strict DUTY to redistribute surplus as a trustee for the community.', kind: 'trap' },
    { content: 'Vertical vs. horizontal integration: name the STAGE relationship (same stage = horizontal; different stages = vertical), not just "big company got bigger."', kind: 'frq-vocab' },
    { content: 'Hedge attribution: both Carnegie and Rockefeller used vertical AND horizontal strategies at points — "Carnegie=vertical/Rockefeller=horizontal" is each man\'s DOMINANT strategy, not an absolute rule.', kind: 'edge-case' },
    { content: 'United States v. E.C. Knight Co. (1895) is the key case for "why the Sherman Antitrust Act barely worked in the 1890s" — narrowed "commerce" to exclude manufacturing.', kind: 'tip' },
    { content: 'Social Darwinism and Gospel of Wealth are commonly conflated on the exam because both come from wealthy industrialists — always check what the SOURCE says happens to wealth after it is earned.', kind: 'common-error' },
  ],
};
