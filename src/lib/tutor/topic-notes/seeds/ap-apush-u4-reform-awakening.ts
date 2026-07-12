/**
 * AP US History — Unit 4 CED 4.10-4.11: Religion and Reform in
 * Antebellum America.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.reform-awakening.v1`. Covers the Second Great
 * Awakening, temperance, abolition (Garrison, Douglass), the Seneca
 * Falls Convention, utopian communities, and the common-school
 * movement.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_REFORM_AWAKENING: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.reform-awakening.v1',
  course: 'AP United States History',
  cedUnit: 4,
  cedTopic: '4.10-4.11',
  cedTitle: 'Religion and Reform in Antebellum America',
  planId: 'evelyn.ap.apush.reform-awakening.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.reform-awakening.v1' }],
  theory: [
    {
      loId: 'apush.reform-awakening',
      kind: 'definition',
      title: 'Second Great Awakening',
      content:
        "wave of Protestant religious revivalism (1790s-1840s) emphasizing individual choice in salvation and moral self-improvement, associated with preachers like Charles Finney; upstate New York, repeatedly swept by revival, became known as the \"burned-over district.\" Its emphasis on personal moral improvement fed directly into belief that society itself could be reformed.",
    },
    {
      loId: 'apush.reform-awakening',
      kind: 'event',
      title: 'temperance',
      content:
        "reformers organized against alcohol consumption, linking it to poverty, domestic violence, and moral decay; the American Temperance Society (founded 1826) became one of the era's largest reform organizations, well short of the nationwide prohibition that came much later (1920).",
    },
    {
      loId: 'apush.reform-awakening',
      kind: 'definition',
      title: 'immediatism',
      content:
        "William Lloyd Garrison's position, launched with The Liberator (1831), demanding immediate and uncompensated emancipation, rejecting the gradual emancipation or colonization approaches earlier anti-slavery reformers had favored — a position controversial even among some abolitionists.",
    },
    {
      loId: 'apush.reform-awakening',
      kind: 'event',
      title: 'Frederick Douglass',
      content:
        "a formerly enslaved man who became one of the abolitionist movement's most powerful voices, combining firsthand testimony with reasoned argument in his writing and speeches.",
    },
    {
      loId: 'apush.reform-awakening',
      kind: 'event',
      title: 'the Seneca Falls Convention (1848)',
      content:
        "organized by Elizabeth Cady Stanton and Lucretia Mott, the first major women's rights convention produced the Declaration of Sentiments, deliberately modeled on the Declaration of Independence, asserting \"all men and women are created equal\" and cataloguing grievances including exclusion from voting and lack of legal standing.",
    },
    {
      loId: 'apush.reform-awakening',
      kind: 'framework',
      title: 'abolition-to-women\'s-rights pipeline',
      content:
        'many Seneca Falls organizers, including Stanton and Mott, had been active first in the abolition movement — their exclusion from full participation there sharpened their sense of women\'s own political exclusion and directly shaped the Declaration of Sentiments\' natural-rights argument.',
    },
    {
      loId: 'apush.reform-awakening',
      kind: 'event',
      title: 'utopian communities and the common-school movement',
      content:
        "utopian communities like Brook Farm and Oneida experimented with alternative arrangements of property, labor, or family life. Horace Mann led the common-school movement in Massachusetts, arguing free, publicly funded education was essential to democracy and social mobility, laying groundwork for public education systems elsewhere.",
    },
    {
      loId: 'apush.reform-awakening',
      kind: 'trap',
      title: 'reform movements were not universally popular',
      content:
        'abolition provoked violent mobs even in Northern cities and divided abolitionists themselves; the Declaration of Sentiments was mocked in the press and considered radical by many, including some abolitionists who did not support women\'s suffrage. Studying a movement as historically significant does not mean it was broadly embraced at the time.',
    },
  ],
  methods: [
    {
      title: "Analyze a reform document's use of a borrowed rhetorical frame",
      when_to_use:
        'Use when a reform-era document deliberately echoes an earlier, widely revered text (like the Declaration of Independence) to make its argument.',
      steps: [
        'IDENTIFY THE EARLIER TEXT being echoed, and name the specific language or structure borrowed.',
        'IDENTIFY THE ONE KEY CHANGE the new document makes to that borrowed language (e.g. adding "and women").',
        'EXPLAIN WHY BORROWING A REVERED TEXT IS RHETORICALLY POWERFUL — it argues the new claim was already implied by principles the audience already accepts.',
        'CONNECT TO THE BROADER REFORM MOVEMENT the document belongs to, and to any personal history (e.g. prior activism in another reform cause) that shaped its authors.',
      ],
      example: {
        problem: 'How does the Declaration of Sentiments use the Declaration of Independence?',
        solution:
          'It mirrors the Declaration of Independence\'s exact structure and language, changing "all men" to "all men and women are created equal," and follows with a grievance list mirroring the original\'s complaints against George III — arguing women\'s exclusion betrays principles Americans already claimed to hold as self-evident.',
      },
      relatedLoIds: ['apush.reform-awakening'],
    },
  ],
  pointers: [
    { content: 'The #1 trap: assuming a movement studied favorably today was popular in its own time. Abolition and women\'s rights both provoked serious backlash, including from other reformers.', kind: 'trap' },
    { content: 'Garrison\'s immediatism (immediate, uncompensated emancipation) is more radical than earlier gradual-emancipation or colonization approaches — do not conflate all antebellum antislavery positions.', kind: 'trap' },
    { content: 'The Second Great Awakening is the ROOT cause connecting temperance, abolition, women\'s rights, and education reform — trace any specific movement back to its emphasis on moral perfectibility.', kind: 'tip' },
    { content: 'Know the direct abolition-to-Seneca-Falls link: Stanton and Mott were abolitionists first, and their exclusion there shaped the 1848 convention.', kind: 'tip' },
    { content: 'Distinguish Garrison (immediatist, The Liberator, 1831) from Douglass (formerly enslaved, firsthand testimony) — both major abolitionist figures, different roles.', kind: 'tip' },
  ],
};
