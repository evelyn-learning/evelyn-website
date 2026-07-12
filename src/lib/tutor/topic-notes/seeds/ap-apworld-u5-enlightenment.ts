/**
 * AP World History — Unit 5 CED 5.1: The Enlightenment.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.enlightenment.v1`. Covers Locke's and Rousseau's
 * natural-rights/social-contract theory and the uneven later application of
 * Enlightenment reasoning to feminism (Wollstonecraft), abolition, and
 * suffrage. Measured, exam-neutral tone throughout, per Global Constraints.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_ENLIGHTENMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.enlightenment.v1',
  course: 'AP World History',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'The Enlightenment',
  planId: 'evelyn.ap.apworld.enlightenment.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.enlightenment.v1' }],
  theory: [
    {
      loId: 'apworld.enlightenment',
      kind: 'definition',
      title: 'natural rights',
      content:
        'Rights (Locke: life, liberty, property) held to exist prior to and independent of government, which legitimate government exists to protect.',
    },
    {
      loId: 'apworld.enlightenment',
      kind: 'definition',
      title: 'social contract',
      content:
        'The theory (Locke, Rousseau) that legitimate political authority derives from an agreement among individuals to form a political community, rather than from divine right or inherited status.',
    },
    {
      loId: 'apworld.enlightenment',
      kind: 'definition',
      title: 'deism',
      content:
        'The Enlightenment-era view that a rational creator established the universe according to natural laws but does not intervene in it afterward, in contrast to organized revealed religion.',
    },
    {
      loId: 'apworld.enlightenment',
      kind: 'framework',
      title: "Locke's consent-based government",
      content:
        "John Locke argued individuals possess natural rights (life, liberty, property) existing prior to government, and that legitimate government rests on the consent of the governed; if government violated those rights, the people retained a right to alter or replace it.",
    },
    {
      loId: 'apworld.enlightenment',
      kind: 'framework',
      title: "Rousseau's general will",
      content:
        'Jean-Jacques Rousseau argued legitimate political authority comes from a social contract in which individuals collectively form a political community and submit to the "general will" — the collective good of the community, which could in principle override an individual private preference.',
    },
    {
      loId: 'apworld.enlightenment',
      kind: 'event',
      title: "Wollstonecraft's Vindication (1792)",
      content:
        'Mary Wollstonecraft\'s "A Vindication of the Rights of Woman" (1792) applied Enlightenment reason-based virtue theory to women\'s education, extending Rousseau\'s own claim (virtue requires the individual\'s own exercise of reason) to women, against Rousseau\'s own restriction of that claim to men.',
    },
    {
      loId: 'apworld.enlightenment',
      kind: 'event',
      title: 'bridge to 19th-century feminism',
      content:
        "Wollstonecraft's argument is a direct intellectual bridge forward to 19th-century feminism, including the Seneca Falls Convention (1848), which echoed natural-rights language in its own Declaration of Sentiments.",
    },
    {
      loId: 'apworld.enlightenment',
      kind: 'event',
      title: 'applications to abolition and suffrage',
      content:
        'Abolitionist and suffrage movements across the 18th and 19th centuries drew directly on Enlightenment natural-rights language, arguing that rights claimed as universal could not be coherently limited by race or sex — an argument Enlightenment writers themselves did not uniformly accept or apply.',
    },
    {
      loId: 'apworld.enlightenment',
      kind: 'event',
      title: 'religious toleration and reduced divine-right authority',
      content:
        'Many Enlightenment thinkers argued for religious toleration and a reduced role for organized religious authority in political life, a significant departure from the divine-right justifications of earlier monarchies.',
    },
    {
      loId: 'apworld.enlightenment',
      kind: 'trap',
      title: 'Enlightenment thinkers did not uniformly favor democracy',
      content:
        'Many Enlightenment thinkers feared direct or universal democracy (mob rule, the political judgment of the propertyless); Locke\'s framework was compatible with constitutional monarchy, and many Enlightenment-influenced constitutions initially restricted participation by property, race, and sex.',
    },
  ],
  methods: [
    {
      title: 'Trace how a later writer extends (or restricts) an earlier Enlightenment premise',
      when_to_use:
        'Use this when analyzing how a later thinker (e.g., Wollstonecraft, an abolitionist, a suffragist) applies an earlier Enlightenment thinker\'s own reasoning to a new group or claim.',
      steps: [
        "Identify the earlier thinker's original premise and to whom they applied it.",
        'Identify precisely how the later writer uses that SAME premise but applies it to a different, often excluded, group.',
        "State explicitly whether the later writer is extending the original thinker's logic (as Wollstonecraft does with Rousseau) or breaking from it entirely.",
        'Connect the extension to the broader pattern of uneven, selective application of Enlightenment ideas across the following century.',
      ],
      example: {
        problem: "Wollstonecraft writes: \"This was Rousseau's opinion respecting men: I extend it to women.\" What move is she making?",
        solution:
          "She takes Rousseau's own premise — that virtue requires the individual's own exercise of reason — and extends it to a group (women) Rousseau himself excluded from that premise, rather than rejecting his framework outright.",
      },
      relatedLoIds: ['apworld.enlightenment'],
    },
  ],
  pointers: [
    { content: "Wollstonecraft's 1792 argument names Rousseau directly and extends HIS OWN premise to women — don't describe her as simply rejecting Enlightenment thought; she is using it.", kind: 'tip' },
    { content: 'Enlightenment thinkers did NOT uniformly support universal democracy — many feared mob rule. This is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'Locke = natural rights + consent of the governed; Rousseau = social contract + general will. Don\'t conflate the two frameworks on an FRQ.', kind: 'tip' },
    { content: 'Abolition and suffrage movements applied Enlightenment natural-rights language MORE literally/universally than many of the original Enlightenment authors themselves did.', kind: 'tip' },
    { content: 'Deism is belief in a non-intervening rational creator, not atheism — don\'t conflate the two on an FRQ.', kind: 'gotcha' },
  ],
};
