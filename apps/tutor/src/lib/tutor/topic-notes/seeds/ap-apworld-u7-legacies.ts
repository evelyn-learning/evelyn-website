/**
 * AP World History — Unit 7 CED 7.8-7.9: Legacies of Total War —
 * Atrocities, Refugees, and Human Rights.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.conflict-legacies.v1`. Covers the documented
 * state-planning pattern behind the century's major genocides, the
 * refugee and human-rights institutions the World Wars produced, and how
 * both wars weakened European imperial power.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U7_LEGACIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.conflict-legacies.v1',
  course: 'AP World History: Modern',
  cedUnit: 7,
  cedTopic: '7.8-7.9',
  cedTitle: 'Legacies of Total War: Atrocities, Refugees, and Human Rights',
  planId: 'evelyn.ap.apworld.conflict-legacies.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.conflict-legacies.v1' }],
  theory: [
    {
      loId: 'apworld.conflict-legacies',
      kind: 'definition',
      title: 'crimes against humanity',
      content:
        'A category of international criminal charge, established at the Nuremberg Trials (1945-1946), holding individuals — not just states — legally responsible for large-scale atrocities against civilian populations.',
    },
    {
      loId: 'apworld.conflict-legacies',
      kind: 'definition',
      title: 'genocide (state-planning pattern)',
      content:
        'The deliberate, large-scale destruction of a national, ethnic, racial, or religious group. The Armenian genocide, the Holocaust, the Cambodian genocide, and the Rwandan genocide each followed documented state or organizational planning rather than spontaneous violence.',
    },
    {
      loId: 'apworld.conflict-legacies',
      kind: 'definition',
      title: 'Universal Declaration of Human Rights (UDHR, 1948)',
      content:
        'A UN General Assembly declaration (not a binding treaty or court) articulating a broad, prospective, aspirational set of universal human rights, drafted partly in direct response to WWII atrocities and informed by the Nuremberg precedent of individual criminal responsibility.',
    },
    {
      loId: 'apworld.conflict-legacies',
      kind: 'event',
      title: 'Armenian genocide (1915-1923) and the Holocaust — recap',
      content:
        'Ottoman deportations/killings of Armenians (est. 600,000-1.5 million) and Nazi Germany\'s murder of six million Jews and millions of others are both documented state campaigns, covered earlier in the unit. The Holocaust\'s bureaucratic planning is captured at the Wannsee Conference (January 1942).',
    },
    {
      loId: 'apworld.conflict-legacies',
      kind: 'event',
      title: 'Cambodian genocide (Khmer Rouge, 1975-1979)',
      content:
        "Pol Pot's Khmer Rouge regime pursued radical forced agrarian collectivization, killing an estimated 1.7 to 2 million people — roughly a quarter of Cambodia's population — through executions, forced labor, and starvation, organized via the regime's documented administrative structure, Angkar.",
    },
    {
      loId: 'apworld.conflict-legacies',
      kind: 'event',
      title: 'Rwandan genocide (1994)',
      content:
        'A Hutu extremist-led government and organized Interahamwe militia killed an estimated 800,000 people, most of them ethnic Tutsi, in roughly 100 days — preceded by years of documented extremist propaganda (radio broadcasts) and organized militia training.',
    },
    {
      loId: 'apworld.conflict-legacies',
      kind: 'event',
      title: '1951 Refugee Convention',
      content:
        'A UN legal framework defining refugee status and the obligations of asylum states, built directly in response to the massive displacement produced by the World Wars.',
    },
    {
      loId: 'apworld.conflict-legacies',
      kind: 'event',
      title: 'Nuremberg Trials (1945-1946)',
      content:
        'An international military tribunal (US, UK, USSR, France) trying surviving Nazi officials, establishing that individuals could be held criminally responsible for crimes against humanity, genocide, and aggressive war, and that "following orders" was not a complete defense.',
    },
    {
      loId: 'apworld.conflict-legacies',
      kind: 'cause',
      title: "the World Wars' weakening of European imperial power",
      content:
        "Economically (war debt, destroyed infrastructure), militarily (depleted forces), and morally (colonial troops who fought for Allied 'freedom'/'self-determination' rhetoric returned home questioning why it excluded their own countries; Japan's wartime conquests exposed European colonial weakness in Asia) — setting the stage for decolonization.",
    },
    {
      loId: 'apworld.conflict-legacies',
      kind: 'framework',
      title: 'Nuremberg vs. the UDHR — two distinct legal legacies',
      content:
        'Nuremberg = a JUDICIAL tribunal assigning individual criminal guilt after the fact. The UDHR = a non-binding, prospective, aspirational DECLARATION of universal rights. Neither, alone, prevented the later documented genocides in Cambodia and Rwanda.',
    },
  ],
  methods: [
    {
      title: "Trace a causal chain between two related but distinct postwar institutions",
      when_to_use:
        'Use when a prompt links two institutions/events (e.g. Nuremberg and the UDHR) that are often conflated as "the same legacy" but actually address distinct problems.',
      steps: [
        'Identify precisely what the FIRST institution is and does (e.g. a judicial tribunal assigning guilt).',
        'Identify precisely what the SECOND institution is and does (e.g. a prospective declaration of rights).',
        'State the specific precedent or lesson the first fed into the second.',
        'Weigh what neither institution, by itself, fully solved.',
        'State the conclusion connecting both to the broader course thesis.',
      ],
      example: {
        problem: 'How did Nuremberg (1945-46) feed into the UDHR (1948)?',
        solution:
          "Nuremberg proved individuals could be held criminally accountable for atrocities even under government orders; the UDHR then tried to state, prospectively, the standard those violations should be judged against — though Nuremberg's authority came only from the victors, and the UDHR remains non-binding.",
      },
      relatedLoIds: ['apworld.conflict-legacies'],
    },
  ],
  pointers: [
    { content: 'Never call a genocide a "spontaneous outburst" — each one in this unit (Armenia, the Holocaust, Cambodia, Rwanda) followed documented state or organizational planning.', kind: 'trap' },
    { content: "Keep Nuremberg (a tribunal assigning individual guilt) and the UDHR (a non-binding, prospective declaration) distinct — don't collapse them into one institution.", kind: 'trap' },
    { content: 'Cite one specific piece of planning evidence per atrocity: Wannsee Conference (Holocaust), Angkar (Cambodia), documented propaganda/militia training (Rwanda).', kind: 'tip' },
    { content: "Explain European imperial weakening on multiple axes (economic, military, moral) — a one-axis answer won't earn full credit.", kind: 'tip' },
    { content: 'The UDHR is deliberately NOT wired to a passage in this topic — it is covered by description only here; a cited excerpt belongs to a later unit\'s MCQs.', kind: 'tip' },
  ],
};
