/**
 * AP US History — CED Unit 6.4-6.6: Industrialization and Big Business.
 *
 * Period-6 content plan (follows the causes-of-revolution calibration
 * template — see ap-apush-u3-causes-of-revolution.ts for the full
 * rationale and docs/superpowers/specs/2026-07-10-ap-us-history-design.md
 * for the shared Passage/rubric infra this plan reuses).
 *
 * Anchor text: Andrew Carnegie, "Wealth" (1889) —
 * evelyn.passage.apush-carnegie-wealth.v1. The seeded excerpt is the
 * essay's "duty of the man of Wealth" paragraph — a trust/stewardship
 * argument. Per the passage's own docblock, this excerpt does NOT contain
 * the essay's earlier Social-Darwinist defense of accumulation; this plan
 * is careful to attribute only the duty-to-redistribute argument to the
 * seeded text, and to introduce Social Darwinism separately as the
 * CONTRASTING position Carnegie's own essay argues against on this point.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U6_INDUSTRIALIZATION: LessonPlan = {
  id: 'evelyn.ap.apush.industrialization-big-business.v1',
  title: 'U6.4-6.6 Industrialization and Big Business',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.industrialization-big-business',
      description:
        'Explain the rise of big business in steel, oil, and railroads; distinguish vertical and horizontal integration; explain the relationship (and distinction) between Social Darwinism and the Gospel of Wealth; and evaluate the role of laissez-faire courts and weak antitrust enforcement in this period.',
      standard: 'AP-APUSH-6.4',
    },
  ],
  prerequisites: ['apush.the-west-new-south'],
  followUps: ['apush.labor-movement', 'apush.immigration-urbanization'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see that the era\'s biggest businessmen justified their fortunes in genuinely different, competing ways — not one uniform "greed is good" ideology.',
      script:
        "By the 1890s, a handful of men — Andrew Carnegie in steel, John D. Rockefeller in oil, a handful of railroad financiers — controlled more wealth and productive capacity than most national governments in history. How did they explain, to themselves and the public, why that concentration of power was okay? You might expect one simple answer: might makes right, survival of the fittest, keep what you win. Some businessmen absolutely made that argument. But Andrew Carnegie, one of the single richest men who ever lived, wrote a famous essay in 1889 arguing something almost opposite: that a rich man who dies without giving away his fortune \"dies disgraced.\" Same era, same industry, wildly different justification. Today we're tracing how steel, oil, and rail actually got built at this scale — and the surprisingly split argument industrialists made about what they owed everyone else.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-integration-and-ideology',
      kind: 'concept',
      goal: 'Explain vertical and horizontal integration strategies in steel, oil, and rail; distinguish Social Darwinism from the Gospel of Wealth; and explain the role of laissez-faire courts and weak antitrust enforcement.',
      keyIdeas: [
        'STEEL AND VERTICAL INTEGRATION: Andrew Carnegie built Carnegie Steel into the dominant U.S. steel producer largely through VERTICAL integration — buying up the mines, ore transport, and mills involved at every STAGE of steel production, from raw material to finished product, to control quality and cut costs at each step. He also aggressively adopted the Bessemer process, a cheaper steelmaking method, to undercut competitors on price.',
        'OIL AND HORIZONTAL INTEGRATION: John D. Rockefeller built Standard Oil into a near-monopoly largely through HORIZONTAL integration — buying out or driving out COMPETING oil refineries at the SAME stage of production, consolidating an entire industry segment under one company\'s control, then using a legal trust structure to coordinate the combined firms. In practice, both Carnegie and Rockefeller used elements of both strategies at different points; "Carnegie = vertical" and "Rockefeller = horizontal" describes each man\'s DOMINANT, best-known strategy, not an absolute rule.',
        'RAILROADS AS THE ENABLING INDUSTRY: railroads supplied the transportation network big business depended on, consolidated into a small number of powerful trunk lines by the 1880s, and pioneered corporate practices (large-scale capital financing, professional management hierarchies, rate agreements or "pools" among competing lines) that other industries later copied.',
        'SOCIAL DARWINISM: a social theory, associated with Herbert Spencer and popularized in the U.S. by William Graham Sumner, that applied the idea of "survival of the fittest" to economic competition — arguing that wealth accumulation reflected superior natural fitness, that the wealthy earned their position through competitive success, and that government should NOT interfere with this natural sorting (including opposing charity or regulation as artificially propping up the "unfit"). This was one real ideological defense of concentrated wealth in the period.',
        'THE GOSPEL OF WEALTH: Andrew Carnegie\'s OWN 1889 essay, "Wealth," makes a DIFFERENT argument than Social Darwinism on the question of what the wealthy owe society. Carnegie\'s essay does defend the inequality that comes from vigorous competition earlier in the piece — but the excerpt this course anchors on states his conclusion: the man of wealth is DUTY-BOUND to treat his surplus fortune as a "trust fund" and administer it, during his own lifetime, for the community\'s benefit — not to hoard it or pass it entirely to heirs. This is a duty-to-REDISTRIBUTE argument, not a defense of unlimited, unaccountable accumulation.',
        'THE KEY DISTINCTION: Social Darwinism and the Gospel of Wealth are NOT the same position, even though both came from wealthy industrialists in the same era. Social Darwinism says the wealthy owe society nothing further once they have won fair competition. The Gospel of Wealth says the wealthy, having earned their fortune, then owe society a DUTY to give much of it back as a trustee — Carnegie personally funded thousands of public libraries, universities, and other institutions on exactly this reasoning.',
        'LAISSEZ-FAIRE COURTS AND WEAK ANTITRUST ENFORCEMENT: federal and state courts in this period generally interpreted the Constitution\'s Commerce Clause narrowly and favored business over regulation. In Wabash, St. Louis & Pacific Railway Co. v. Illinois (1886), the Supreme Court limited states\' power to regulate interstate railroad rates, prompting Congress to pass the Interstate Commerce Act (1887) — the first federal regulatory attempt, though weakly enforced. The Sherman Antitrust Act (1890) banned monopolistic combinations "in restraint of trade," but in United States v. E.C. Knight Co. (1895) the Supreme Court read "commerce" narrowly enough to exclude manufacturing monopolies like sugar refining from the Act\'s reach — leaving most large industrial combinations largely undisturbed through the 1890s.',
      ],
      vocabulary: [
        {
          term: 'vertical integration',
          definition:
            'a business strategy of controlling every STAGE of production for a good, from raw materials to finished product (Carnegie Steel\'s dominant strategy).',
        },
        {
          term: 'horizontal integration',
          definition:
            'a business strategy of consolidating competing firms at the SAME stage of production under one company\'s control (Standard Oil\'s dominant strategy).',
        },
        {
          term: 'Social Darwinism',
          definition:
            'a social theory (Spencer, Sumner) applying "survival of the fittest" to economic competition, holding that wealth reflects natural fitness and that government should not interfere with market outcomes.',
        },
        {
          term: 'Gospel of Wealth',
          definition:
            'Andrew Carnegie\'s 1889 argument that the wealthy, having earned their fortune through competition, are duty-bound to administer their surplus as a "trust fund" for the community\'s benefit during their own lifetime.',
        },
        {
          term: 'Sherman Antitrust Act (1890)',
          definition:
            'federal law banning monopolistic combinations "in restraint of trade"; weakly enforced in the 1890s after United States v. E.C. Knight Co. (1895) narrowed its reach to exclude manufacturing.',
        },
      ],
      passageId: 'evelyn.passage.apush-carnegie-wealth.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-carnegie-wealth',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Andrew Carnegie\'s "Wealth" (North American Review, 1889): "This, then, is held to be the duty of the man of Wealth: First, to set an example of modest, unostentatious living, shunning display or extravagance; to provide moderately for the legitimate wants of those dependent upon him; and after doing so to consider all surplus revenues which come to him simply as trust funds, which he is called upon to administer, and strictly bound as a matter of duty to administer in the manner which, in his judgment, is best calculated to produce the most beneficial results for the community—the man of wealth thus becoming the mere agent and trustee for his poorer brethren, bringing to their service his superior wisdom, experience, and ability to administer, doing for them better than they would or could do for themselves." What argument is Carnegie making, and how does it relate to the era\'s justifications for concentrated wealth?',
      steps: [
        'SOURCE IT FIRST. Andrew Carnegie, 1889, at the height of his own fortune from Carnegie Steel — writing not as a critic of accumulation but as one of its greatest beneficiaries, addressing an educated readership (North American Review) about how great fortunes should be used once amassed.',
        'IDENTIFY THE SPECIFIC CLAIM. Carnegie states a DUTY, not a suggestion: after living modestly and providing for dependents, the wealthy man must treat all surplus wealth as a "trust fund" he is "strictly bound" to administer for "the most beneficial results for the community." The word "duty" and "strictly bound" are doing real work here — this is a moral obligation, not optional generosity.',
        'NOTICE WHAT THIS EXCERPT DOES NOT ARGUE. This passage does not say the wealthy earned their fortune through natural superiority and therefore owe society nothing further (the Social Darwinist position) — it says the OPPOSITE: precisely because the wealthy have "superior wisdom, experience, and ability to administer," they are obligated to use it FOR the community, acting as a "trustee" rather than a permanent owner of the surplus.',
        'CONNECT TO THE GOSPEL OF WEALTH VS. SOCIAL DARWINISM DISTINCTION. This is the textbook statement of the Gospel of Wealth: earned wealth creates an ongoing duty to redistribute it during the owner\'s lifetime for public benefit (Carnegie\'s own practice: funding public libraries and universities), which is a materially different position from Social Darwinism\'s claim that the wealthy owe society nothing beyond having won fair competition.',
        'EXPLAIN THE HISTORICAL SIGNIFICANCE. This argument mattered because it gave industrialists and the public a moral framework for enormous private fortunes that was neither pure defense of unlimited accumulation nor a call for government redistribution — it argued PRIVATE, voluntary philanthropy by "superior" administrators was the correct middle path, a view that shaped the era\'s explosion of large-scale private philanthropy.',
        'STATE THE LINK TO THE COURSE THESIS. This passage shows one industrialist\'s ATTEMPT to answer a central question of the age — what do the wealthy owe society? — with a duty-to-redistribute argument, distinct from (and sometimes confused with) the era\'s harsher Social Darwinist justification for simply keeping what competition delivers.',
      ],
      answer:
        'Carnegie argues that the wealthy have a strict DUTY — not a choice — to treat their surplus fortune as a "trust fund" administered for the community\'s benefit, acting as a trustee rather than a permanent owner, because their "superior wisdom, experience, and ability" make them better equipped to direct that wealth productively than ordinary people would be on their own. This is the Gospel of Wealth position, and it is a genuinely different argument from Social Darwinism: Social Darwinism holds that the wealthy earned their position through fair competitive "survival of the fittest" and owe society nothing further, while Carnegie\'s excerpt insists that earning a fortune creates an ongoing OBLIGATION to give much of it back during the owner\'s own lifetime. Carnegie\'s own large-scale funding of public libraries and universities put this argument into practice. The passage matters historically because it shows one prominent, self-interested attempt to justify Gilded Age fortunes on terms other than pure survival-of-the-fittest — a distinction the AP exam frequently tests and that is easy to blur if you assume all industrialist rhetoric from this era says the same thing.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE business strategy used to build a dominant firm in this period (e.g. in steel, oil, or railroads). (b) Briefly explain how court decisions in this period limited government regulation of big business. (c) Briefly explain ONE way the Gospel of Wealth differs from Social Darwinism.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine business strategy — e.g. vertical integration (Carnegie Steel controlling every production stage) or horizontal integration (Standard Oil consolidating competing refineries). No credit for a vague statement ("companies got really big") with no specific strategy named.',
            modelResponse:
              "Andrew Carnegie built Carnegie Steel through vertical integration, buying up the mines, ore transport, and mills involved at every stage of steel production so he could control quality and costs from raw material to finished product.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate court decision limiting regulation — e.g. Wabash v. Illinois (1886) limiting state regulation of interstate rail rates, or United States v. E.C. Knight Co. (1895) narrowing the Sherman Antitrust Act\'s reach to exclude manufacturing monopolies. No credit for a vague or unsupported claim.',
            modelResponse:
              'In United States v. E.C. Knight Co. (1895), the Supreme Court interpreted "commerce" narrowly enough to exclude manufacturing monopolies like sugar refining from the Sherman Antitrust Act\'s reach, leaving most large industrial combinations largely undisturbed despite the 1890 law banning monopolistic combinations.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate distinction between the two positions — e.g. Social Darwinism holds the wealthy owe society nothing further having won fair competition, while the Gospel of Wealth holds the wealthy have a duty to redistribute surplus wealth as a trustee for the community. No credit for treating the two as the same position.',
            modelResponse:
              'Social Darwinism argued that wealth reflected natural fitness earned through fair competition and that the wealthy owed society nothing further, while the Gospel of Wealth (Carnegie\'s own argument) held that the wealthy have a strict duty to administer their surplus fortune as a trust for the community\'s benefit during their own lifetime, rather than simply keeping it.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-carnegie-defends-accumulation',
      kind: 'misconception_check',
      question:
        'True or false: Carnegie\'s essay "Wealth" defends the unlimited accumulation of fortune by the rich, with no obligation to give any of it back.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Conflating Carnegie\'s Gospel of Wealth with Social Darwinism because both come from a wealthy industrialist defending inequality earned through competition — missing that Carnegie\'s essay pivots to argue a DUTY to redistribute the resulting surplus.',
          correctsTo:
            'FALSE. Carnegie\'s "Wealth" (1889) does defend the inequality produced by vigorous competition, but its core argument — the passage this course anchors on — is that the wealthy man is "strictly bound as a matter of duty" to treat his surplus fortune as a "trust fund" administered for the community\'s benefit, acting as a trustee rather than simply keeping or passing on the full fortune. That is a duty-to-REDISTRIBUTE argument (the Gospel of Wealth), not a defense of unlimited, unaccountable accumulation — and it is a genuinely different position from Social Darwinism, which held the wealthy owed society nothing further beyond having won fair competition. Carnegie\'s own large-scale funding of public libraries and universities followed directly from this argument.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Carnegie Steel\'s dominant strategy was vertical integration (controlling every production stage); Standard Oil\'s dominant strategy was horizontal integration (consolidating competitors at the same stage) — though both men used elements of both.',
        'Social Darwinism (Spencer, Sumner) argued the wealthy owed society nothing further, having won fair competition; the Gospel of Wealth (Carnegie) argued the wealthy have a DUTY to redistribute surplus wealth as a trustee. These are different positions.',
        'Wabash v. Illinois (1886) limited state rail-rate regulation and prompted the Interstate Commerce Act (1887); United States v. E.C. Knight Co. (1895) narrowed the Sherman Antitrust Act (1890) to exclude manufacturing.',
        'The seeded Carnegie excerpt argues a duty to redistribute surplus wealth — do NOT attribute an unlimited-accumulation defense to this specific passage.',
        'Railroads enabled and financed the era\'s industrial consolidation, pioneering large-scale corporate financing and management practices other industries later copied.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.4-6.6',
    cedTitle: 'Industrialization and Big Business',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-carnegie-wealth.v1',
        chapter: '1889',
        note: 'Andrew Carnegie, "Wealth" — anchor document for the Gospel of Wealth argument, distinguished from Social Darwinism.',
      },
    ],
  },
};
